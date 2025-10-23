import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database';
import { User } from './User';

// Integration attributes interface
interface IntegrationAttributes {
  id: string;
  userId: string;
  provider: 'google_calendar' | 'google_gmail' | 'outlook_calendar' | 'outlook_email' | 'apple_calendar';
  
  // OAuth credentials
  accessToken: string;
  refreshToken?: string;
  expiresAt?: Date;
  
  // Provider-specific data
  providerUserId?: string;
  providerEmail?: string;
  providerName?: string;
  
  // Integration status
  status: 'connected' | 'disconnected' | 'error' | 'expired';
  lastSyncAt?: Date;
  lastErrorAt?: Date;
  errorMessage?: string;
  
  // Permissions granted
  permissions: string[]; // ['calendar.read', 'calendar.write', 'email.read', etc.]
  
  // Settings
  settings?: {
    autoSync?: boolean;
    syncFrequency?: number; // minutes
    defaultCalendar?: string;
    reminderDefaults?: {
      email?: number; // minutes before
      popup?: number; // minutes before
    };
    emailSignature?: string;
  };
  
  // Metadata
  metadata?: any;
  
  createdAt?: Date;
  updatedAt?: Date;
}

// Integration creation attributes interface
interface IntegrationCreationAttributes extends Optional<IntegrationAttributes, 'id'> {}

// Integration model class
export class Integration extends Model<IntegrationAttributes, IntegrationCreationAttributes> implements IntegrationAttributes {
  public id!: string;
  public userId!: string;
  public provider!: 'google_calendar' | 'google_gmail' | 'outlook_calendar' | 'outlook_email' | 'apple_calendar';
  
  public accessToken!: string;
  public refreshToken?: string;
  public expiresAt?: Date;
  
  public providerUserId?: string;
  public providerEmail?: string;
  public providerName?: string;
  
  public status!: 'connected' | 'disconnected' | 'error' | 'expired';
  public lastSyncAt?: Date;
  public lastErrorAt?: Date;
  public errorMessage?: string;
  
  public permissions!: string[];
  
  public settings?: {
    autoSync?: boolean;
    syncFrequency?: number;
    defaultCalendar?: string;
    reminderDefaults?: {
      email?: number;
      popup?: number;
    };
    emailSignature?: string;
  };
  
  public metadata?: any;
  
  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Initialize Integration model
Integration.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    provider: {
      type: DataTypes.ENUM('google_calendar', 'google_gmail', 'outlook_calendar', 'outlook_email', 'apple_calendar'),
      allowNull: false,
    },
    accessToken: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    refreshToken: {
      type: DataTypes.TEXT,
    },
    expiresAt: {
      type: DataTypes.DATE,
    },
    providerUserId: {
      type: DataTypes.STRING,
    },
    providerEmail: {
      type: DataTypes.STRING,
    },
    providerName: {
      type: DataTypes.STRING,
    },
    status: {
      type: DataTypes.ENUM('connected', 'disconnected', 'error', 'expired'),
      allowNull: false,
      defaultValue: 'connected',
    },
    lastSyncAt: {
      type: DataTypes.DATE,
    },
    lastErrorAt: {
      type: DataTypes.DATE,
    },
    errorMessage: {
      type: DataTypes.TEXT,
    },
    permissions: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: [],
    },
    settings: {
      type: DataTypes.JSONB,
      defaultValue: {
        autoSync: true,
        syncFrequency: 15,
        reminderDefaults: {
          email: 60, // 1 hour before
          popup: 15  // 15 minutes before
        }
      },
    },
    metadata: {
      type: DataTypes.JSONB,
    },
  },
  {
    sequelize,
    modelName: 'Integration',
    tableName: 'integrations',
    hooks: {
      beforeUpdate: (integration: Integration) => {
        // Update lastSyncAt when status changes to connected
        if (integration.changed('status') && integration.status === 'connected') {
          integration.lastSyncAt = new Date();
        }
        
        // Set lastErrorAt when status changes to error
        if (integration.changed('status') && integration.status === 'error') {
          integration.lastErrorAt = new Date();
        }
      }
    },
    indexes: [
      {
        fields: ['userId'],
      },
      {
        fields: ['provider'],
      },
      {
        fields: ['status'],
      },
      {
        fields: ['providerUserId'],
      },
      {
        fields: ['providerEmail'],
      },
      {
        unique: true,
        fields: ['userId', 'provider'],
        name: 'unique_user_provider'
      },
    ],
  }
);

// Define associations
Integration.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Integration, { foreignKey: 'userId' });

export default Integration;