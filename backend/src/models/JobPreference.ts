import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database';
import { User } from './User';

// JobPreference attributes interface
interface JobPreferenceAttributes {
  id: string;
  jobTitle: string[];
  location: string[];
  remotePreference: 'remote' | 'hybrid' | 'onsite' | 'any';
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency?: string;
  jobType: ('full-time' | 'part-time' | 'contract' | 'internship')[];
  industry?: string[];
  skills?: string[];
  experience?: string;
  education?: string;
  keywords?: string[];
  excludeKeywords?: string[];
  userId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// JobPreference creation attributes interface (optional fields during creation)
interface JobPreferenceCreationAttributes extends Optional<JobPreferenceAttributes, 'id'> {}

// JobPreference model class
export class JobPreference extends Model<JobPreferenceAttributes, JobPreferenceCreationAttributes> implements JobPreferenceAttributes {
  public id!: string;
  public jobTitle!: string[];
  public location!: string[];
  public remotePreference!: 'remote' | 'hybrid' | 'onsite' | 'any';
  public salaryMin?: number;
  public salaryMax?: number;
  public salaryCurrency?: string;
  public jobType!: ('full-time' | 'part-time' | 'contract' | 'internship')[];
  public industry?: string[];
  public skills?: string[];
  public experience?: string;
  public education?: string;
  public keywords?: string[];
  public excludeKeywords?: string[];
  public userId!: string;
  
  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Initialize JobPreference model
JobPreference.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    jobTitle: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
    },
    location: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
    },
    remotePreference: {
      type: DataTypes.ENUM('remote', 'hybrid', 'onsite', 'any'),
      allowNull: false,
      defaultValue: 'any',
    },
    salaryMin: {
      type: DataTypes.INTEGER,
    },
    salaryMax: {
      type: DataTypes.INTEGER,
    },
    salaryCurrency: {
      type: DataTypes.STRING,
      defaultValue: 'USD',
    },
    jobType: {
      type: DataTypes.ARRAY(DataTypes.ENUM('full-time', 'part-time', 'contract', 'internship')),
      allowNull: false,
    },
    industry: {
      type: DataTypes.ARRAY(DataTypes.STRING),
    },
    skills: {
      type: DataTypes.ARRAY(DataTypes.STRING),
    },
    experience: {
      type: DataTypes.STRING,
    },
    education: {
      type: DataTypes.STRING,
    },
    keywords: {
      type: DataTypes.ARRAY(DataTypes.STRING),
    },
    excludeKeywords: {
      type: DataTypes.ARRAY(DataTypes.STRING),
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
    modelName: 'JobPreference',
    tableName: 'job_preferences',
  }
);

// Define associations
JobPreference.belongsTo(User, { foreignKey: 'userId', as: 'user' });
User.hasOne(JobPreference, { foreignKey: 'userId', as: 'jobPreference' });

export default JobPreference;