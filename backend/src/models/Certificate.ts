import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database';
import { User } from './User';

// Certificate attributes interface
interface CertificateAttributes {
  id: string;
  name: string;
  issuer: string;
  issueDate: Date;
  expiryDate?: Date;
  credentialId?: string;
  credentialUrl?: string;
  description?: string;
  category: 'certificate' | 'award' | 'license' | 'qualification' | 'course' | 'other';
  fileName?: string;
  filePath?: string;
  fileSize?: number;
  mimeType?: string;
  isVerified: boolean;
  skills?: string[];
  userId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Certificate creation attributes interface (optional fields during creation)
interface CertificateCreationAttributes extends Optional<CertificateAttributes, 'id'> {}

// Certificate model class
export class Certificate extends Model<CertificateAttributes, CertificateCreationAttributes> implements CertificateAttributes {
  public id!: string;
  public name!: string;
  public issuer!: string;
  public issueDate!: Date;
  public expiryDate?: Date;
  public credentialId?: string;
  public credentialUrl?: string;
  public description?: string;
  public category!: 'certificate' | 'award' | 'license' | 'qualification' | 'course' | 'other';
  public fileName?: string;
  public filePath?: string;
  public fileSize?: number;
  public mimeType?: string;
  public isVerified!: boolean;
  public skills?: string[];
  public userId!: string;
  
  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Initialize Certificate model
Certificate.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [1, 255],
      },
    },
    issuer: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [1, 255],
      },
    },
    issueDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    expiryDate: {
      type: DataTypes.DATEONLY,
    },
    credentialId: {
      type: DataTypes.STRING,
      validate: {
        len: [0, 255],
      },
    },
    credentialUrl: {
      type: DataTypes.TEXT,
      validate: {
        isUrl: true,
      },
    },
    description: {
      type: DataTypes.TEXT,
    },
    category: {
      type: DataTypes.ENUM('certificate', 'award', 'license', 'qualification', 'course', 'other'),
      allowNull: false,
      defaultValue: 'certificate',
    },
    fileName: {
      type: DataTypes.STRING,
    },
    filePath: {
      type: DataTypes.STRING,
    },
    fileSize: {
      type: DataTypes.INTEGER,
      validate: {
        min: 0,
      },
    },
    mimeType: {
      type: DataTypes.STRING,
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    skills: {
      type: DataTypes.JSONB,
      defaultValue: [],
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
    modelName: 'Certificate',
    tableName: 'certificates',
    indexes: [
      {
        fields: ['userId'],
      },
      {
        fields: ['category'],
      },
      {
        fields: ['issueDate'],
      },
      {
        fields: ['expiryDate'],
      },
    ],
  }
);

// Define associations
Certificate.belongsTo(User, { foreignKey: 'userId', as: 'user' });
User.hasMany(Certificate, { foreignKey: 'userId', as: 'certificates' });

export default Certificate;