import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database';
import { User } from './User';
import { Job } from './Job';
import { CV } from './CV';

// Application attributes interface
interface ApplicationAttributes {
  id: string;
  status: 'draft' | 'submitted' | 'interviewing' | 'offered' | 'accepted' | 'rejected' | 'withdrawn';
  submissionDate?: Date;
  coverLetter?: string;
  notes?: string;
  responseDate?: Date;
  responseType?: 'positive' | 'negative' | 'no_response';
  interviewDate?: Date;
  interviewNotes?: string;
  offerDetails?: object;
  
  // Enhanced tracking fields
  applicationMethod?: 'direct' | 'linkedin' | 'indeed' | 'company_website' | 'referral' | 'recruiter' | 'other';
  referralSource?: string;
  followUpDates?: Date[];
  rejectionReason?: string;
  rejectionFeedback?: string;
  salaryOffered?: number;
  negotiationNotes?: string;
  
  // Timeline tracking
  statusHistory?: Array<{
    status: string;
    date: Date;
    notes?: string;
  }>;
  
  // Communication tracking
  communications?: Array<{
    date: Date;
    type: 'email' | 'phone' | 'meeting' | 'message';
    direction: 'inbound' | 'outbound';
    subject?: string;
    summary: string;
  }>;
  
  // Job board tracking
  jobBoardUrl?: string;
  jobBoardId?: string;
  
  userId: string;
  jobId: string;
  cvId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Application creation attributes interface (optional fields during creation)
interface ApplicationCreationAttributes extends Optional<ApplicationAttributes, 'id'> {}

// Application model class
export class Application extends Model<ApplicationAttributes, ApplicationCreationAttributes> implements ApplicationAttributes {
  public id!: string;
  public status!: 'draft' | 'submitted' | 'interviewing' | 'offered' | 'accepted' | 'rejected' | 'withdrawn';
  public submissionDate?: Date;
  public coverLetter?: string;
  public notes?: string;
  public responseDate?: Date;
  public responseType?: 'positive' | 'negative' | 'no_response';
  public interviewDate?: Date;
  public interviewNotes?: string;
  public offerDetails?: object;
  
  // Enhanced tracking fields
  public applicationMethod?: 'direct' | 'linkedin' | 'indeed' | 'company_website' | 'referral' | 'recruiter' | 'other';
  public referralSource?: string;
  public followUpDates?: Date[];
  public rejectionReason?: string;
  public rejectionFeedback?: string;
  public salaryOffered?: number;
  public negotiationNotes?: string;
  
  // Timeline tracking
  public statusHistory?: Array<{
    status: string;
    date: Date;
    notes?: string;
  }>;
  
  // Communication tracking
  public communications?: Array<{
    date: Date;
    type: 'email' | 'phone' | 'meeting' | 'message';
    direction: 'inbound' | 'outbound';
    subject?: string;
    summary: string;
  }>;
  
  // Job board tracking
  public jobBoardUrl?: string;
  public jobBoardId?: string;
  
  public userId!: string;
  public jobId!: string;
  public cvId!: string;
  
  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Initialize Application model
Application.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    status: {
      type: DataTypes.ENUM('draft', 'submitted', 'interviewing', 'offered', 'accepted', 'rejected', 'withdrawn'),
      allowNull: false,
      defaultValue: 'draft',
    },
    submissionDate: {
      type: DataTypes.DATE,
    },
    coverLetter: {
      type: DataTypes.TEXT,
    },
    notes: {
      type: DataTypes.TEXT,
    },
    responseDate: {
      type: DataTypes.DATE,
    },
    responseType: {
      type: DataTypes.ENUM('positive', 'negative', 'no_response'),
    },
    interviewDate: {
      type: DataTypes.DATE,
    },
    interviewNotes: {
      type: DataTypes.TEXT,
    },
    offerDetails: {
      type: DataTypes.JSONB,
    },
    
    // Enhanced tracking fields
    applicationMethod: {
      type: DataTypes.ENUM('direct', 'linkedin', 'indeed', 'company_website', 'referral', 'recruiter', 'other'),
    },
    referralSource: {
      type: DataTypes.STRING,
    },
    followUpDates: {
      type: DataTypes.JSONB,
      defaultValue: [],
    },
    rejectionReason: {
      type: DataTypes.STRING,
    },
    rejectionFeedback: {
      type: DataTypes.TEXT,
    },
    salaryOffered: {
      type: DataTypes.DECIMAL(10, 2),
    },
    negotiationNotes: {
      type: DataTypes.TEXT,
    },
    
    // Timeline tracking
    statusHistory: {
      type: DataTypes.JSONB,
      defaultValue: [],
    },
    
    // Communication tracking
    communications: {
      type: DataTypes.JSONB,
      defaultValue: [],
    },
    
    // Job board tracking
    jobBoardUrl: {
      type: DataTypes.TEXT,
    },
    jobBoardId: {
      type: DataTypes.STRING,
    },
    
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    jobId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'jobs',
        key: 'id',
      },
    },
    cvId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'cvs',
        key: 'id',
      },
    },
  },
  {
    sequelize,
    modelName: 'Application',
    tableName: 'applications',
    hooks: {
      beforeUpdate: (application: Application) => {
        // Track status changes in history
        if (application.changed('status')) {
          const statusHistory = application.statusHistory || [];
          statusHistory.push({
            status: application.status,
            date: new Date(),
            notes: `Status changed to ${application.status}`
          });
          application.statusHistory = statusHistory;
        }
      }
    },
    indexes: [
      {
        fields: ['userId'],
      },
      {
        fields: ['jobId'],
      },
      {
        fields: ['status'],
      },
      {
        fields: ['submissionDate'],
      },
      {
        fields: ['applicationMethod'],
      },
    ],
  }
);

// Define associations
Application.belongsTo(User, { foreignKey: 'userId', as: 'user' });
User.hasMany(Application, { foreignKey: 'userId', as: 'applications' });

Application.belongsTo(Job, { foreignKey: 'jobId', as: 'job' });
Job.hasMany(Application, { foreignKey: 'jobId', as: 'applications' });

Application.belongsTo(CV, { foreignKey: 'cvId', as: 'cv' });
CV.hasMany(Application, { foreignKey: 'cvId', as: 'applications' });

export default Application;