// Import all models and their association setup functions
const { User, setupAssociations: setupUserAssociations } = require('./userModel');
const { Garden, GardenElement, setupAssociations: setupGardenAssociations } = require('./gardenModel');
const { 
  Plant, 
  SowingPeriod, 
  HarvestPeriod, 
  CompanionPlanting, 
  PlantImage, 
  setupAssociations: setupPlantAssociations 
} = require('./plantModel');

// Setup all associations once all models are imported
const setupAllAssociations = () => {
  setupUserAssociations();
  setupGardenAssociations();
  setupPlantAssociations();
};

// Call this function after all models are defined
setupAllAssociations();

// Export all models
module.exports = {
  User,
  Garden,
  GardenElement,
  Plant,
  SowingPeriod,
  HarvestPeriod,
  CompanionPlanting,
  PlantImage
};
