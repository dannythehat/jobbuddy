import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database';
import { User } from './User';

// A/B Test attributes interface
interface ABTestAttributes {
  id: string;
  name: string;
  description: string;
  type: 'cover_letter' | 'application_method' | 'timing' | 'cv_template' | 'subject_line' | 'follow_up';
  status: 'draft' | 'running' | 'paused' | 'completed' | 'archived';
  
  // Test configuration
  variants: Array<{
    id: string;
    name: string;
    content: any;
    weight: number; // Traffic allocation percentage
  }>;
  
  // Test parameters
  targetMetric: 'response_rate' | 'interview_rate' | 'offer_rate' | 'click_rate' | 'open_rate';
  minimumSampleSize: number;
  confidenceLevel: number; // 90, 95, 99
  expectedEffect: number; // Expected improvement percentage
  
  // Test results
  results?: {
    winner?: string;
    confidence: number;
    statisticalSignificance: boolean;
    pValue: number;
    effectSize: number;
    variants: Array<{
      id: string;
      name: string;
      participants: number;
      conversions: number;
      conversionRate: number;
      confidenceInterval: { lower: number; upper: number };
    }>;
  };
  
  // Timing
  startDate?: Date;
  endDate?: Date;
  duration?: number; // Duration in days
  
  // Targeting
  targetAudience?: {
    industries?: string[];
    experienceLevels?: string[];
    locations?: string[];
    jobTypes?: string[];
  };
  
  // Metadata
  createdBy: string;
  tags?: string[];
  notes?: string;
  
  userId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// A/B Test creation attributes interface
interface ABTestCreationAttributes extends Optional<ABTestAttributes, 'id'> {}

// A/B Test model class
export class ABTest extends Model<ABTestAttributes, ABTestCreationAttributes> implements ABTestAttributes {
  public id!: string;
  public name!: string;
  public description!: string;
  public type!: 'cover_letter' | 'application_method' | 'timing' | 'cv_template' | 'subject_line' | 'follow_up';
  public status!: 'draft' | 'running' | 'paused' | 'completed' | 'archived';
  
  public variants!: Array<{
    id: string;
    name: string;
    content: any;
    weight: number;
  }>;
  
  public targetMetric!: 'response_rate' | 'interview_rate' | 'offer_rate' | 'click_rate' | 'open_rate';
  public minimumSampleSize!: number;
  public confidenceLevel!: number;
  public expectedEffect!: number;
  
  public results?: {
    winner?: string;
    confidence: number;
    statisticalSignificance: boolean;
    pValue: number;
    effectSize: number;
    variants: Array<{
      id: string;
      name: string;
      participants: number;
      conversions: number;
      conversionRate: number;
      confidenceInterval: { lower: number; upper: number };
    }>;
  };
  
  public startDate?: Date;
  public endDate?: Date;
  public duration?: number;
  
  public targetAudience?: {
    industries?: string[];
    experienceLevels?: string[];
    locations?: string[];
    jobTypes?: string[];
  };
  
  public createdBy!: string;
  public tags?: string[];
  public notes?: string;
  
  public userId!: string;
  
  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Initialize A/B Test model
ABTest.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    type: {
      type: DataTypes.ENUM('cover_letter', 'application_method', 'timing', 'cv_template', 'subject_line', 'follow_up'),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('draft', 'running', 'paused', 'completed', 'archived'),
      allowNull: false,
      defaultValue: 'draft',
    },
    variants: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: [],
      validate: {
        isValidVariants(value: any) {
          if (!Array.isArray(value) || value.length < 2) {
            throw new Error('At least 2 variants are required for A/B testing');
          }
          
          const totalWeight = value.reduce((sum, variant) => sum + (variant.weight || 0), 0);
          if (Math.abs(totalWeight - 100) > 0.01) {
            throw new Error('Variant weights must sum to 100%');
          }
        }
      }
    },
    targetMetric: {
      type: DataTypes.ENUM('response_rate', 'interview_rate', 'offer_rate', 'click_rate', 'open_rate'),
      allowNull: false,
      defaultValue: 'response_rate',
    },
    minimumSampleSize: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 30,
      validate: {
        min: 10,
        max: 10000,
      }
    },
    confidenceLevel: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 95,
      validate: {
        isIn: [[90, 95, 99]],
      }
    },
    expectedEffect: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      defaultValue: 10.0,
      validate: {
        min: 1.0,
        max: 100.0,
      }
    },
    results: {
      type: DataTypes.JSONB,
    },
    startDate: {
      type: DataTypes.DATE,
    },
    endDate: {
      type: DataTypes.DATE,
    },
    duration: {
      type: DataTypes.INTEGER,
      validate: {
        min: 1,
        max: 365,
      }
    },
    targetAudience: {
      type: DataTypes.JSONB,
    },
    createdBy: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    tags: {
      type: DataTypes.JSONB,
      defaultValue: [],
    },
    notes: {
      type: DataTypes.TEXT,
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
    modelName: 'ABTest',
    tableName: 'ab_tests',
    hooks: {
      beforeUpdate: (test: ABTest) => {
        // Auto-complete test if end date is reached
        if (test.endDate && new Date() >= test.endDate && test.status === 'running') {
          test.status = 'completed';
        }
      }
    },
    indexes: [
      {
        fields: ['userId'],
      },
      {
        fields: ['status'],
      },
      {
        fields: ['type'],
      },
      {
        fields: ['startDate'],
      },
      {
        fields: ['endDate'],
      },
      {
        fields: ['createdBy'],
      },
    ],
  }
);

// Define associations
ABTest.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(ABTest, { foreignKey: 'userId' });

export default ABTest;