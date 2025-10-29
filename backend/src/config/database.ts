import { Sequelize } from 'sequelize';
import { Pool } from 'pg';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Database configuration
const dbName = process.env.DB_NAME || 'jobbuddy';
const dbUser = process.env.DB_USER || 'postgres';
const dbPassword = process.env.DB_PASSWORD || 'password';
const dbHost = process.env.DB_HOST || 'localhost';
const dbPort = parseInt(process.env.DB_PORT || '5432');

// Create Sequelize instance
const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
  host: dbHost,
  port: dbPort,
  dialect: 'postgres',
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

// Create pg Pool instance for raw queries
export const pool = new Pool({
  host: dbHost,
  port: dbPort,
  database: dbName,
  user: dbUser,
  password: dbPassword,
  max: 5,
  min: 0,
  idleTimeoutMillis: 10000,
  connectionTimeoutMillis: 30000,
});

// Track database connection status
export let isDbConnected = false;

// Test database connection (non-blocking)
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    isDbConnected = true;
    console.log('✅ Database connection established successfully.');
  } catch (error) {
    isDbConnected = false;
    console.warn('⚠️  Database connection failed - app will run in limited mode:', error instanceof Error ? error.message : error);
    console.warn('⚠️  Some features requiring database access will be unavailable.');
  }
};

// Call the test connection function (non-blocking)
testConnection().catch(err => {
  console.warn('Database connection test failed:', err);
});

export default sequelize;
