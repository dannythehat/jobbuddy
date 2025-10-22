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