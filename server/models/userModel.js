const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const { sequelize } = require('../config/db');

const User = sequelize.define('User', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  isAdmin: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  subscription: {
    type: DataTypes.ENUM('free', 'premium', 'annual'),
    defaultValue: 'free'
  },
  location: {
    type: DataTypes.STRING,
    defaultValue: ''
  },
  hardinessZone: {
    type: DataTypes.STRING,
    defaultValue: ''
  }
}, {
  // Other model options
  timestamps: true,
  
  // Method to exclude password when converting to JSON
  defaultScope: {
    attributes: { exclude: ['password'] }
  },
  scopes: {
    withPassword: {
      attributes: {}
    }
  }
});

// Model hooks - similar to Mongoose middleware
User.beforeCreate(async (user) => {
  if (user.password) {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
  }
});

User.beforeUpdate(async (user) => {
  if (user.changed('password')) {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
  }
});

// Instance methods
User.prototype.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Define associations (like Mongoose refs)
// This will be run after all models are defined
const setupAssociations = () => {
  const Garden = sequelize.models.Garden;
  const Plant = sequelize.models.Plant;
  
  if (Garden) {
    User.hasMany(Garden, {
      foreignKey: 'userId',
      as: 'gardens'
    });
  }
  
  if (Plant) {
    User.hasMany(Plant, {
      foreignKey: 'createdBy',
      as: 'plants'
    });
  }
};

module.exports = { User, setupAssociations };
