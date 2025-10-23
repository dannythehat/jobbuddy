import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database';
import { Application } from './Application';
import { Response } from './Response';

// Interview attributes interface
interface InterviewAttributes {
  id: string;
  applicationId: string;
  responseId?: string; // Link to the response that triggered this interview
  
  // Interview details
  title: string;
  description?: string;
  scheduledDate: Date;
  duration: number; // Duration in minutes
  timezone: string;
  
  // Location details
  location?: string;
  meetingUrl?: string; // Zoom, Teams, etc.
  meetingId?: string;
  meetingPassword?: string;
  address?: string;
  
  // Interview type and format
  type: 'phone' | 'video' | 'in_person' | 'panel' | 'technical' | 'behavioral';
  format: 'one_on_one' | 'panel' | 'group' | 'presentation' | 'technical_test';
  
  // Participants
  interviewers: Array<{
    name: string;
    title?: string;
    email?: string;
    phone?: string;
  }>;
  
  // Status and workflow
  status: 'pending' | 'confirmed' | 'rescheduled' | 'cancelled' | 'completed' | 'no_show';
  userResponse?: 'accepted' | 'declined' | 'reschedule_requested';
  userResponseDate?: Date;
  
  // Calendar integration
  calendarEventId?: string; // Google Calendar event ID
  calendarProvider?: 'google' | 'outlook' | 'apple' | 'other';
  calendarSynced: boolean;
  
  // Reminders
  reminders: Array<{
    type: 'email' | 'push' | 'sms';
    timing: number; // Minutes before interview
    sent: boolean;
    sentDate?: Date;
  }>;
  
  // Preparation and notes
  preparationNotes?: string;
  companyResearch?: string;
  questionsToAsk?: string[];
  expectedQuestions?: string[];
  
  // Post-interview
  interviewNotes?: string;
  feedback?: string;
  outcome?: 'positive' | 'negative' | 'neutral' | 'pending';
  nextSteps?: string;
  followUpDate?: Date;
  
  // Email automation
  confirmationEmailSent: boolean;
  confirmationEmailDate?: Date;
  thankYouEmailSent: boolean;
  thankYouEmailDate?: Date;
  
  // Rescheduling
  originalDate?: Date;
  rescheduleReason?: string;
  rescheduleCount: number;
  
  userId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Interview creation attributes interface
interface InterviewCreationAttributes extends Optional<InterviewAttributes, 'id'> {}

// Interview model class
export class Interview extends Model<InterviewAttributes, InterviewCreationAttributes> implements InterviewAttributes {
  public id!: string;
  public applicationId!: string;
  public responseId?: string;
  
  // Interview details
  public title!: string;
  public description?: string;
  public scheduledDate!: Date;
  public duration!: number;
  public timezone!: string;
  
  // Location details
  public location?: string;
  public meetingUrl?: string;
  public meetingId?: string;
  public meetingPassword?: string;
  public address?: string;
  
  // Interview type and format
  public type!: 'phone' | 'video' | 'in_person' | 'panel' | 'technical' | 'behavioral';
  public format!: 'one_on_one' | 'panel' | 'group' | 'presentation' | 'technical_test';
  
  // Participants
  public interviewers!: Array<{
    name: string;
    title?: string;
    email?: string;
    phone?: string;
  }>;
  
  // Status and workflow
  public status!: 'pending' | 'confirmed' | 'rescheduled' | 'cancelled' | 'completed' | 'no_show';
  public userResponse?: 'accepted' | 'declined' | 'reschedule_requested';
  public userResponseDate?: Date;
  
  // Calendar integration
  public calendarEventId?: string;
  public calendarProvider?: 'google' | 'outlook' | 'apple' | 'other';
  public calendarSynced!: boolean;
  
  // Reminders
  public reminders!: Array<{
    type: 'email' | 'push' | 'sms';
    timing: number;
    sent: boolean;
    sentDate?: Date;
  }>;
  
  // Preparation and notes
  public preparationNotes?: string;
  public companyResearch?: string;
  public questionsToAsk?: string[];
  public expectedQuestions?: string[];
  
  // Post-interview
  public interviewNotes?: string;
  public feedback?: string;
  public outcome?: 'positive' | 'negative' | 'neutral' | 'pending';
  public nextSteps?: string;
  public followUpDate?: Date;
  
  // Email automation
  public confirmationEmailSent!: boolean;
  public confirmationEmailDate?: Date;
  public thankYouEmailSent!: boolean;
  public thankYouEmailDate?: Date;
  
  // Rescheduling
  public originalDate?: Date;
  public rescheduleReason?: string;
  public rescheduleCount!: number;
  
  public userId!: string;
  
  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Initialize Interview model
Interview.init(
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
    responseId: {
      type: DataTypes.UUID,
      references: {
        model: 'responses',
        key: 'id',
      },
    },
    
    // Interview details
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    scheduledDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 60, // Default 1 hour
    },
    timezone: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'UTC',
    },
    
    // Location details
    location: {
      type: DataTypes.STRING,
    },
    meetingUrl: {
      type: DataTypes.TEXT,
    },
    meetingId: {
      type: DataTypes.STRING,
    },
    meetingPassword: {
      type: DataTypes.STRING,
    },
    address: {
      type: DataTypes.TEXT,
    },
    
    // Interview type and format
    type: {
      type: DataTypes.ENUM('phone', 'video', 'in_person', 'panel', 'technical', 'behavioral'),
      allowNull: false,
      defaultValue: 'video',
    },
    format: {
      type: DataTypes.ENUM('one_on_one', 'panel', 'group', 'presentation', 'technical_test'),
      allowNull: false,
      defaultValue: 'one_on_one',
    },
    
    // Participants
    interviewers: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: [],
    },
    
    // Status and workflow
    status: {
      type: DataTypes.ENUM('pending', 'confirmed', 'rescheduled', 'cancelled', 'completed', 'no_show'),
      allowNull: false,
      defaultValue: 'pending',
    },
    userResponse: {
      type: DataTypes.ENUM('accepted', 'declined', 'reschedule_requested'),
    },
    userResponseDate: {
      type: DataTypes.DATE,
    },
    
    // Calendar integration
    calendarEventId: {
      type: DataTypes.STRING,
    },
    calendarProvider: {
      type: DataTypes.ENUM('google', 'outlook', 'apple', 'other'),
    },
    calendarSynced: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    
    // Reminders
    reminders: {
      type: DataTypes.JSONB,
      defaultValue: [
        { type: 'email', timing: 1440, sent: false }, // 24 hours before
        { type: 'push', timing: 60, sent: false },    // 1 hour before
        { type: 'push', timing: 15, sent: false },    // 15 minutes before
      ],
    },
    
    // Preparation and notes
    preparationNotes: {
      type: DataTypes.TEXT,
    },
    companyResearch: {
      type: DataTypes.TEXT,
    },
    questionsToAsk: {
      type: DataTypes.JSONB,
      defaultValue: [],
    },
    expectedQuestions: {
      type: DataTypes.JSONB,
      defaultValue: [],
    },
    
    // Post-interview
    interviewNotes: {
      type: DataTypes.TEXT,
    },
    feedback: {
      type: DataTypes.TEXT,
    },
    outcome: {
      type: DataTypes.ENUM('positive', 'negative', 'neutral', 'pending'),
    },
    nextSteps: {
      type: DataTypes.TEXT,
    },
    followUpDate: {
      type: DataTypes.DATE,
    },
    
    // Email automation
    confirmationEmailSent: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    confirmationEmailDate: {
      type: DataTypes.DATE,
    },
    thankYouEmailSent: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    thankYouEmailDate: {
      type: DataTypes.DATE,
    },
    
    // Rescheduling
    originalDate: {
      type: DataTypes.DATE,
    },
    rescheduleReason: {
      type: DataTypes.TEXT,
    },
    rescheduleCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
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
    modelName: 'Interview',
    tableName: 'interviews',
    hooks: {
      beforeCreate: (interview: Interview) => {
        // Set default title if not provided
        if (!interview.title) {
          interview.title = `Interview - ${interview.type}`;
        }
      },
      afterUpdate: async (interview: Interview) => {
        // Update application status when interview status changes
        if (interview.changed('status')) {
          const application = await Application.findByPk(interview.applicationId);
          if (application) {
            let newStatus = application.status;
            
            switch (interview.status) {
              case 'confirmed':
                if (application.status === 'submitted') {
                  newStatus = 'interviewing';
                }
                break;
              case 'completed':
                // Keep as interviewing until final decision
                break;
              case 'cancelled':
              case 'no_show':
                // Could revert to submitted or mark as rejected
                break;
            }
            
            if (newStatus !== application.status) {
              await application.update({ status: newStatus });
            }
          }
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
        fields: ['status'],
      },
      {
        fields: ['scheduledDate'],
      },
      {
        fields: ['calendarEventId'],
      },
      {
        fields: ['userResponse'],
      },
    ],
  }
);

export default Interview;