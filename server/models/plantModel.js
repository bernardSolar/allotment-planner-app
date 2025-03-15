const mongoose = require('mongoose');

const plantSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    scientificName: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
    plantType: {
      type: String,
      enum: ['vegetable', 'fruit', 'herb', 'flower', 'tree', 'bush', 'other'],
      required: true,
    },
    // Growing information
    growingInfo: {
      hardinessZones: {
        min: { type: Number },
        max: { type: Number },
      },
      sunRequirements: {
        type: String,
        enum: ['full sun', 'partial sun', 'partial shade', 'full shade'],
        default: 'full sun',
      },
      soilRequirements: {
        type: [String],
        default: [],
      },
      soilPH: {
        min: { type: Number },
        max: { type: Number },
      },
      wateringNeeds: {
        type: String,
        enum: ['low', 'moderate', 'high'],
        default: 'moderate',
      },
      spacing: {
        inRows: { type: Number, required: true }, // in cm
        betweenRows: { type: Number, required: true }, // in cm
      },
      depth: {
        type: Number, // in cm
        default: 1,
      },
    },
    // Time information
    timeToMaturity: {
      type: Number, // in days
      default: 0,
    },
    sowingPeriod: [{
      start: { type: Date }, // Month and day only
      end: { type: Date }, // Month and day only
      region: { type: String, default: 'general' },
    }],
    harvestPeriod: [{
      start: { type: Date }, // Month and day only
      end: { type: Date }, // Month and day only
      region: { type: String, default: 'general' },
    }],
    // Companion planting
    companionPlants: [{
      plant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Plant',
      },
      relationship: {
        type: String,
        enum: ['good', 'bad', 'neutral'],
        default: 'neutral',
      },
      notes: String,
    }],
    // Care information
    careInstructions: {
      fertilizing: String,
      pruning: String,
      pestControl: String,
      diseaseControl: String,
      special: String,
    },
    // Harvesting information
    harvestInstructions: String,
    expectedYield: String,
    storage: String,
    // Additional information
    culinaryUses: [String],
    medicinalUses: [String],
    images: [{
      url: String,
      caption: String,
    }],
    // Metadata
    isPublic: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    tags: [String],
  },
  {
    timestamps: true,
  }
);

// Virtual for calculating when to sow based on current date and location
plantSchema.virtual('whenToSow').get(function() {
  // Logic to determine if now is a good time to sow
  // Would include logic based on current date and user's location
  return 'Implementation required based on date and location';
});

const Plant = mongoose.model('Plant', plantSchema);

module.exports = Plant;
