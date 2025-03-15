const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

// Garden model
const Garden = sequelize.define('Garden', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    defaultValue: ''
  },
  dimensionWidth: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  dimensionHeight: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  dimensionUnit: {
    type: DataTypes.STRING,
    defaultValue: 'meters'
  },
  location: {
    type: DataTypes.STRING,
    defaultValue: ''
  },
  isPublic: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  tags: {
    type: DataTypes.TEXT, // Store as JSON string
    get() {
      const rawValue = this.getDataValue('tags');
      return rawValue ? JSON.parse(rawValue) : [];
    },
    set(value) {
      this.setDataValue('tags', JSON.stringify(value || []));
    }
  },
  year: {
    type: DataTypes.INTEGER,
    defaultValue: () => new Date().getFullYear()
  },
  seasonStart: {
    type: DataTypes.DATE,
    allowNull: true
  },
  seasonEnd: {
    type: DataTypes.DATE,
    allowNull: true
  },
  weatherHardinessZone: {
    type: DataTypes.STRING,
    allowNull: true
  },
  weatherLastFrostDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  weatherFirstFrostDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  timestamps: true
});

// Garden element model
const GardenElement = sequelize.define('GardenElement', {
  type: {
    type: DataTypes.ENUM('plant', 'raisedBed', 'flatBed', 'path', 'tree', 'bush', 'structure', 'other'),
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    defaultValue: ''
  },
  positionX: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  positionY: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  dimensionWidth: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  dimensionHeight: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  dimensionRotation: {
    type: DataTypes.FLOAT,
    defaultValue: 0
  },
  color: {
    type: DataTypes.STRING,
    defaultValue: '#8bc34a'
  },
  // Plant-specific details
  plantId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Plants',
      key: 'id'
    }
  },
  plantingDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  germinationDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  harvestDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  plantNotes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  plantStatus: {
    type: DataTypes.ENUM('planned', 'planted', 'germinated', 'growing', 'harvested', 'removed'),
    defaultValue: 'planned'
  },
  // Structure-specific details
  structureMaterial: {
    type: DataTypes.STRING,
    allowNull: true
  },
  structureHeight: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  structureDepth: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  structureSoilType: {
    type: DataTypes.STRING,
    allowNull: true
  },
  structureNotes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  gardenId: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  timestamps: true
});

// Define associations
const setupAssociations = () => {
  const User = sequelize.models.User;
  const Plant = sequelize.models.Plant;
  
  if (User) {
    Garden.belongsTo(User, {
      foreignKey: 'userId',
      as: 'user'
    });
  }
  
  // Garden has many elements
  Garden.hasMany(GardenElement, {
    foreignKey: 'gardenId',
    as: 'elements',
    onDelete: 'CASCADE'
  });
  
  GardenElement.belongsTo(Garden, {
    foreignKey: 'gardenId',
    as: 'garden'
  });
  
  // Garden elements can reference plants
  if (Plant) {
    GardenElement.belongsTo(Plant, {
      foreignKey: 'plantId',
      as: 'plant'
    });
  }
};

module.exports = { Garden, GardenElement, setupAssociations };
