const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Plant = sequelize.define('Plant', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  scientificName: {
    type: DataTypes.STRING,
    defaultValue: ''
  },
  description: {
    type: DataTypes.TEXT,
    defaultValue: ''
  },
  plantType: {
    type: DataTypes.ENUM('vegetable', 'fruit', 'herb', 'flower', 'tree', 'bush', 'other'),
    allowNull: false
  },
  // Growing information
  hardinessZoneMin: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  hardinessZoneMax: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  sunRequirements: {
    type: DataTypes.ENUM('full sun', 'partial sun', 'partial shade', 'full shade'),
    defaultValue: 'full sun'
  },
  soilRequirements: {
    type: DataTypes.TEXT, // Store as JSON string
    get() {
      const rawValue = this.getDataValue('soilRequirements');
      return rawValue ? JSON.parse(rawValue) : [];
    },
    set(value) {
      this.setDataValue('soilRequirements', JSON.stringify(value || []));
    }
  },
  soilPHMin: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  soilPHMax: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  wateringNeeds: {
    type: DataTypes.ENUM('low', 'moderate', 'high'),
    defaultValue: 'moderate'
  },
  spacingInRows: {
    type: DataTypes.FLOAT, // in cm
    allowNull: false
  },
  spacingBetweenRows: {
    type: DataTypes.FLOAT, // in cm
    allowNull: false
  },
  plantingDepth: {
    type: DataTypes.FLOAT, // in cm
    defaultValue: 1
  },
  // Time information
  timeToMaturity: {
    type: DataTypes.INTEGER, // in days
    defaultValue: 0
  },
  // Care information
  careInstructionsFertilizing: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  careInstructionsPruning: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  careInstructionsPestControl: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  careInstructionsDiseaseControl: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  careInstructionsSpecial: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  // Harvesting information
  harvestInstructions: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  expectedYield: {
    type: DataTypes.STRING,
    allowNull: true
  },
  storage: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  // Additional information
  culinaryUses: {
    type: DataTypes.TEXT, // Store as JSON string
    get() {
      const rawValue = this.getDataValue('culinaryUses');
      return rawValue ? JSON.parse(rawValue) : [];
    },
    set(value) {
      this.setDataValue('culinaryUses', JSON.stringify(value || []));
    }
  },
  medicinalUses: {
    type: DataTypes.TEXT, // Store as JSON string
    get() {
      const rawValue = this.getDataValue('medicinalUses');
      return rawValue ? JSON.parse(rawValue) : [];
    },
    set(value) {
      this.setDataValue('medicinalUses', JSON.stringify(value || []));
    }
  },
  // Metadata
  isPublic: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  createdBy: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Users',
      key: 'id'
    }
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
  }
}, {
  timestamps: true
});

// Related tables

// Sowing Periods
const SowingPeriod = sequelize.define('SowingPeriod', {
  startMonth: {
    type: DataTypes.INTEGER, // 1-12
    allowNull: false
  },
  startDay: {
    type: DataTypes.INTEGER, // 1-31
    allowNull: false
  },
  endMonth: {
    type: DataTypes.INTEGER, // 1-12
    allowNull: false
  },
  endDay: {
    type: DataTypes.INTEGER, // 1-31
    allowNull: false
  },
  region: {
    type: DataTypes.STRING,
    defaultValue: 'general'
  },
  plantId: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  timestamps: true
});

// Harvest Periods
const HarvestPeriod = sequelize.define('HarvestPeriod', {
  startMonth: {
    type: DataTypes.INTEGER, // 1-12
    allowNull: false
  },
  startDay: {
    type: DataTypes.INTEGER, // 1-31
    allowNull: false
  },
  endMonth: {
    type: DataTypes.INTEGER, // 1-12
    allowNull: false
  },
  endDay: {
    type: DataTypes.INTEGER, // 1-31
    allowNull: false
  },
  region: {
    type: DataTypes.STRING,
    defaultValue: 'general'
  },
  plantId: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  timestamps: true
});

// Companion Planting
const CompanionPlanting = sequelize.define('CompanionPlanting', {
  relationship: {
    type: DataTypes.ENUM('good', 'bad', 'neutral'),
    defaultValue: 'neutral'
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  plantId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  companionPlantId: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  timestamps: true
});

// Plant Images
const PlantImage = sequelize.define('PlantImage', {
  url: {
    type: DataTypes.STRING,
    allowNull: false
  },
  caption: {
    type: DataTypes.STRING,
    allowNull: true
  },
  plantId: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  timestamps: true
});

// Define associations
const setupAssociations = () => {
  const User = sequelize.models.User;
  
  // Plant belongs to User (creator)
  if (User) {
    Plant.belongsTo(User, {
      foreignKey: 'createdBy',
      as: 'creator'
    });
  }
  
  // Plant has many SowingPeriods
  Plant.hasMany(SowingPeriod, {
    foreignKey: 'plantId',
    as: 'sowingPeriods',
    onDelete: 'CASCADE'
  });
  
  SowingPeriod.belongsTo(Plant, {
    foreignKey: 'plantId',
    as: 'plant'
  });
  
  // Plant has many HarvestPeriods
  Plant.hasMany(HarvestPeriod, {
    foreignKey: 'plantId',
    as: 'harvestPeriods',
    onDelete: 'CASCADE'
  });
  
  HarvestPeriod.belongsTo(Plant, {
    foreignKey: 'plantId',
    as: 'plant'
  });
  
  // Plant has many CompanionPlantings
  Plant.hasMany(CompanionPlanting, {
    foreignKey: 'plantId',
    as: 'companionPlantings',
    onDelete: 'CASCADE'
  });
  
  CompanionPlanting.belongsTo(Plant, {
    foreignKey: 'plantId',
    as: 'plant'
  });
  
  CompanionPlanting.belongsTo(Plant, {
    foreignKey: 'companionPlantId',
    as: 'companionPlant'
  });
  
  // Plant has many Images
  Plant.hasMany(PlantImage, {
    foreignKey: 'plantId',
    as: 'images',
    onDelete: 'CASCADE'
  });
  
  PlantImage.belongsTo(Plant, {
    foreignKey: 'plantId',
    as: 'plant'
  });
};

module.exports = { 
  Plant, 
  SowingPeriod, 
  HarvestPeriod, 
  CompanionPlanting, 
  PlantImage, 
  setupAssociations 
};
