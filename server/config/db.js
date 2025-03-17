const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

// Create a connection to the database
const sequelize = new Sequelize(
  process.env.DB_NAME || 'allotment_planner',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

// Test the connection
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('MySQL Database connection established successfully');
    
    // Sync all models
    // Note: In production, you might want to use migrations instead
    if (process.env.NODE_ENV === 'development') {
      console.log('Syncing database models...');
      // Using force: true will drop tables if they exist and recreate them
      // This is a temporary fix for the "Too many keys" error
      await sequelize.sync({ force: true });
      console.log('Database models synchronized');
    }
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };
