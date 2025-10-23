import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database';
import { Application } from './Application';

// Response attributes interface
interface ResponseAttributes {
  id: string;
  applicationId: string;
  
  // Email details
  emailId?: string; // External email ID for tracking
  subject: string;
  sender: string;
  senderName?: string;
  recipient: string;
  receivedDate: Date;
  content: string;
  htmlContent?: string;
  
  // Classification
  classification: 'interview_invite' | 'rejection' | 'request_info' | 'acknowledgment' | 'offer' | 'follow_up' | 'other';
  confidence: number; // AI confidence score 0-1
  
  // Extracted information
  extractedData?: {
    interviewDate?: Date;
    interviewTime?: string;
    interviewLocation?: string;
    interviewType?: 'phone' | 'video' | 'in_person' | 'panel';
    interviewers?: string[];
    nextSteps?: string;
    deadline?: Date;
    salaryMention?: number;
    benefits?: string[];
    rejectionReason?: string;
    feedback?: string;
  };
  
  // Processing status
  processed: boolean;
  processingDate?: Date;
  processingNotes?: string;
  
  // Action taken
  actionRequired: boolean;
  actionTaken?: string;
  actionDate?: Date;
  
  // Sentiment analysis
  sentiment?: 'positive' | 'neutral' | 'negative';
  sentimentScore?: number; // -1 to 1
  
  userId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Response creation attributes interface
interface ResponseCreationAttributes extends Optional<ResponseAttributes, 'id'> {}

// Response model class
export class Response extends Model<ResponseAttributes, ResponseCreationAttributes> implements ResponseAttributes {
  public id!: string;
  public applicationId!: string;
  
  // Email details
  public emailId?: string;
  public subject!: string;
  public sender!: string;
  public senderName?: string;
  public recipient!: string;
  public receivedDate!: Date;
  public content!: string;
  public htmlContent?: string;
  
  // Classification
  public classification!: 'interview_invite' | 'rejection' | 'request_info' | 'acknowledgment' | 'offer' | 'follow_up' | 'other';
  public confidence!: number;
  
  // Extracted information
  public extractedData?: {
    interviewDate?: Date;
    interviewTime?: string;
    interviewLocation?: string;
    interviewType?: 'phone' | 'video' | 'in_person' | 'panel';
    interviewers?: string[];
    nextSteps?: string;
    deadline?: Date;
    salaryMention?: number;
    benefits?: string[];
    rejectionReason?: string;
    feedback?: string;
  };
  
  // Processing status
  public processed!: boolean;
  public processingDate?: Date;
  public processingNotes?: string;
  
  // Action taken
  public actionRequired!: boolean;
  public actionTaken?: string;
  public actionDate?: Date;
  
  // Sentiment analysis
  public sentiment?: 'positive' | 'neutral' | 'negative';
  public sentimentScore?: number;
  
  public userId!: string;
  
  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Initialize Response model
Response.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    applicationId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'applications',
        key: 'id',
      },
    },
    
    // Email details
    emailId: {
      type: DataTypes.STRING,
      unique: true,
    },
    subject: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    sender: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    senderName: {
      type: DataTypes.STRING,
    },
    recipient: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    receivedDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    htmlContent: {
      type: DataTypes.TEXT,
    },
    
    // Classification
    classification: {
      type: DataTypes.ENUM('interview_invite', 'rejection', 'request_info', 'acknowledgment', 'offer', 'follow_up', 'other'),
      allowNull: false,
    },
    confidence: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        min: 0,
        max: 1,
      },
    },
    
    // Extracted information
    extractedData: {
      type: DataTypes.JSONB,
    },
    
    // Processing status
    processed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    processingDate: {
      type: DataTypes.DATE,
    },
    processingNotes: {
      type: DataTypes.TEXT,
    },
    
    // Action taken
    actionRequired: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    actionTaken: {
      type: DataTypes.TEXT,
    },
    actionDate: {
      type: DataTypes.DATE,
    },
    
    // Sentiment analysis
    sentiment: {
      type: DataTypes.ENUM('positive', 'neutral', 'negative'),
    },
    sentimentScore: {
      type: DataTypes.FLOAT,
      validate: {
        min: -1,
        max: 1,
      },
    },
    
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
  },
  {
    sequelize,
    modelName: 'Response',
    tableName: 'responses',
    hooks: {
      afterCreate: async (response: Response) => {
        // Auto-update application status based on response classification
        const application = await Application.findByPk(response.applicationId);
        if (application) {
          let newStatus = application.status;
          const communications = application.communications || [];
          
          // Add communication record
          communications.push({
            date: response.receivedDate,
            type: 'email',
            direction: 'inbound',
            subject: response.subject,
            summary: `${response.classification} - ${response.subject}`,
          });
          
          // Update status based on classification
          switch (response.classification) {
            case 'interview_invite':
              if (application.status === 'submitted') {
                newStatus = 'interviewing';
              }
              break;
            case 'rejection':
              newStatus = 'rejected';
              break;
            case 'offer':
              newStatus = 'offered';
              break;
          }
          
          await application.update({
            status: newStatus,
            communications,
            responseDate: response.receivedDate,
            responseType: response.sentiment === 'positive' ? 'positive' : 
                         response.sentiment === 'negative' ? 'negative' : 'no_response',
          });
        }
      },
    },
    indexes: [
      {
        fields: ['applicationId'],
      },
      {
        fields: ['userId'],
      },
      {
        fields: ['classification'],
      },
      {
        fields: ['receivedDate'],
      },
      {
        fields: ['processed'],
      },
      {
        fields: ['actionRequired'],
      },
      {
        fields: ['emailId'],
        unique: true,
        where: {
          emailId: {
            [DataTypes.Op.ne]: null,
          },
        },
      },
    ],
  }
);

export default Response;