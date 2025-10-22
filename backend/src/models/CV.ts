import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database';
import { User } from './User';

// CV attributes interface
interface CVAttributes {
  id: string;
  title: string;
  filePath: string;
  fileType: string;
  fileSize: number;
  parsedData?: object;
  skills?: string[];
  isDefault: boolean;
  userId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// CV creation attributes interface (optional fields during creation)
interface CVCreationAttributes extends Optional<CVAttributes, 'id' | 'isDefault'> {}

// CV model class
export class CV extends Model<CVAttributes, CVCreationAttributes> implements CVAttributes {
  public id!: string;
  public title!: string;
  public filePath!: string;
  public fileType!: string;
  public fileSize!: number;
  public parsedData?: object;
  public skills?: string[];
  public isDefault!: boolean;
  public userId!: string;
  
  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Initialize CV model
CV.init(
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
    filePath: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fileType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fileSize: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    parsedData: {
      type: DataTypes.JSONB,
    },
    skills: {
      type: DataTypes.ARRAY(DataTypes.STRING),
    },
    isDefault: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
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
    modelName: 'CV',
    tableName: 'cvs',
  }
);

// Define associations
CV.belongsTo(User, { foreignKey: 'userId', as: 'user' });
User.hasMany(CV, { foreignKey: 'userId', as: 'cvs' });

export default CV;