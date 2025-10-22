import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database';

// Job attributes interface
interface JobAttributes {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  salary?: string;
  jobType: string;
  remote: boolean;
  url: string;
  source: string;
  postedDate?: Date;
  closingDate?: Date;
  skills?: string[];
  requirements?: string[];
  benefits?: string[];
  matchScore?: number;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// Job creation attributes interface (optional fields during creation)
interface JobCreationAttributes extends Optional<JobAttributes, 'id' | 'isActive'> {}

// Job model class
export class Job extends Model<JobAttributes, JobCreationAttributes> implements JobAttributes {
  public id!: string;
  public title!: string;
  public company!: string;
  public location!: string;
  public description!: string;
  public salary?: string;
  public jobType!: string;
  public remote!: boolean;
  public url!: string;
  public source!: string;
  public postedDate?: Date;
  public closingDate?: Date;
  public skills?: string[];
  public requirements?: string[];
  public benefits?: string[];
  public matchScore?: number;
  public isActive!: boolean;
  
  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Initialize Job model
Job.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    company: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    salary: {
      type: DataTypes.STRING,
    },
    jobType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    remote: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    source: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    postedDate: {
      type: DataTypes.DATE,
    },
    closingDate: {
      type: DataTypes.DATE,
    },
    skills: {
      type: DataTypes.ARRAY(DataTypes.STRING),
    },
    requirements: {
      type: DataTypes.ARRAY(DataTypes.STRING),
    },
    benefits: {
      type: DataTypes.ARRAY(DataTypes.STRING),
    },
    matchScore: {
      type: DataTypes.FLOAT,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    sequelize,
    modelName: 'Job',
    tableName: 'jobs',
  }
);

export default Job;