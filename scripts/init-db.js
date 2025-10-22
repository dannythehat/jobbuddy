#!/usr/bin/env node

import sequelize from '../src/config/database';
import { User, CV, JobPreference, Job, Application } from '../src/models';

const initializeDatabase = async () => {
  try {
    console.log('🔄 Initializing database...');

    // Test connection
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.');

    // Sync all models
    await sequelize.sync({ force: false });
    console.log('✅ Database models synchronized successfully.');

    console.log('🎉 Database initialization completed!');
    
    // Create a sample admin user if none exists
    const adminExists = await User.findOne({ where: { role: 'admin' } });
    
    if (!adminExists) {
      const bcrypt = require('bcryptjs');
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('admin123', salt);
      
      await User.create({
        name: 'Admin User',
        email: 'admin@jobbuddy.com',
        password: hashedPassword,
        role: 'admin',
      });
      
      console.log('✅ Admin user created (email: admin@jobbuddy.com, password: admin123)');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  }
};

initializeDatabase();