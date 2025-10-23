import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database';
import { User } from './User';
import { ABTest } from './ABTest';
import { Application } from './Application';

// A/B Test Participation attributes interface
interface ABTestParticipationAttributes {
  id: string;
  testId: string;
  userId: string;
  applicationId?: string;
  
  // Variant assignment
  variantId: string;
  variantName: string;
  
  // Participation details
  assignedAt: Date;
  exposedAt?: Date; // When user was actually exposed to the variant
  convertedAt?: Date; // When conversion event occurred
  
  // Conversion tracking
  converted: boolean;
  conversionType?: 'response' | 'interview' | 'offer' | 'click' | 'open';
  conversionValue?: number;
  
  // Context data
  context?: {
    jobTitle?: string;
    company?: string;
    industry?: string;
    location?: string;
    salaryRange?: string;
    applicationMethod?: string;
    deviceType?: string;
    userAgent?: string;
  };
  
  // Metadata
  metadata?: any;
  notes?: string;
  
  createdAt?: Date;
  updatedAt?: Date;
}

// A/B Test Participation creation attributes interface
interface ABTestParticipationCreationAttributes extends Optional<ABTestParticipationAttributes, 'id'> {}

// A/B Test Participation model class
export class ABTestParticipation extends Model<ABTestParticipationAttributes, ABTestParticipationCreationAttributes> implements ABTestParticipationAttributes {
  public id!: string;
  public testId!: string;
  public userId!: string;
  public applicationId?: string;
  
  public variantId!: string;
  public variantName!: string;
  
  public assignedAt!: Date;
  public exposedAt?: Date;
  public convertedAt?: Date;
  
  public converted!: boolean;
  public conversionType?: 'response' | 'interview' | 'offer' | 'click' | 'open';
  public conversionValue?: number;
  
  public context?: {
    jobTitle?: string;
    company?: string;
    industry?: string;
    location?: string;
    salaryRange?: string;
    applicationMethod?: string;
    deviceType?: string;
    userAgent?: string;
  };
  
  public metadata?: any;
  public notes?: string;
  
  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Initialize A/B Test Participation model
ABTestParticipation.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    testId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'ab_tests',
        key: 'id',
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
    applicationId: {
      type: DataTypes.UUID,
      references: {
        model: 'applications',
        key: 'id',
      },
    },
    variantId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    variantName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    assignedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    exposedAt: {
      type: DataTypes.DATE,
    },
    convertedAt: {
      type: DataTypes.DATE,
    },
    converted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    conversionType: {
      type: DataTypes.ENUM('response', 'interview', 'offer', 'click', 'open'),
    },
    conversionValue: {
      type: DataTypes.DECIMAL(10, 2),
    },
    context: {
      type: DataTypes.JSONB,
    },
    metadata: {
      type: DataTypes.JSONB,
    },
    notes: {
      type: DataTypes.TEXT,
    },
  },
  {
    sequelize,
    modelName: 'ABTestParticipation',
    tableName: 'ab_test_participations',
    hooks: {
      beforeCreate: (participation: ABTestParticipation) => {
        // Set exposed time when participation is created
        if (!participation.exposedAt) {
          participation.exposedAt = new Date();
        }
      },
      beforeUpdate: (participation: ABTestParticipation) => {
        // Set conversion time when converted flag changes to true
        if (participation.converted && !participation.convertedAt) {
          participation.convertedAt = new Date();
        }
      }
    },
    indexes: [
      {
        fields: ['testId'],
      },
      {
        fields: ['userId'],
      },
      {
        fields: ['applicationId'],
      },
      {
        fields: ['variantId'],
      },
      {
        fields: ['converted'],
      },
      {
        fields: ['assignedAt'],
      },
      {
        fields: ['convertedAt'],
      },
      {
        unique: true,
        fields: ['testId', 'userId', 'applicationId'],
        name: 'unique_test_user_application'
      },
    ],
  }
);

// Define associations
ABTestParticipation.belongsTo(ABTest, { foreignKey: 'testId' });
ABTestParticipation.belongsTo(User, { foreignKey: 'userId' });
ABTestParticipation.belongsTo(Application, { foreignKey: 'applicationId' });

ABTest.hasMany(ABTestParticipation, { foreignKey: 'testId' });
User.hasMany(ABTestParticipation, { foreignKey: 'userId' });
Application.hasMany(ABTestParticipation, { foreignKey: 'applicationId' });

export default ABTestParticipation;