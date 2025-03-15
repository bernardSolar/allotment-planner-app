const mongoose = require('mongoose');

// Schema for individual garden elements (plants, beds, structures, etc.)
const gardenElementSchema = mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      enum: ['plant', 'raisedBed', 'flatBed', 'path', 'tree', 'bush', 'structure', 'other'],
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: '',
    },
    position: {
      x: { type: Number, required: true },
      y: { type: Number, required: true },
    },
    dimensions: {
      width: { type: Number, required: true },
      height: { type: Number, required: true },
      rotation: { type: Number, default: 0 },
    },
    color: {
      type: String,
      default: '#8bc34a', // Light green default
    },
    plantDetails: {
      plantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Plant',
      },
      plantingDate: Date,
      germinationDate: Date,
      harvestDate: Date,
      notes: String,
      status: {
        type: String,
        enum: ['planned', 'planted', 'germinated', 'growing', 'harvested', 'removed'],
        default: 'planned',
      },
    },
    // For structures like raised beds, containers, etc.
    structureDetails: {
      material: String,
      height: Number, // height above ground
      depth: Number, // soil depth
      soilType: String,
      notes: String,
    },
  },
  {
    timestamps: true,
  }
);

// Schema for the main garden layout
const gardenSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: '',
    },
    dimensions: {
      width: { type: Number, required: true },
      height: { type: Number, required: true },
      unit: { type: String, default: 'meters' },
    },
    location: {
      type: String,
      default: '',
    },
    elements: [gardenElementSchema],
    isPublic: {
      type: Boolean,
      default: false,
    },
    tags: [String],
    year: {
      type: Number,
      default: () => new Date().getFullYear(),
    },
    seasonStart: {
      type: Date,
      default: null,
    },
    seasonEnd: {
      type: Date,
      default: null,
    },
    weatherData: {
      hardinessZone: String,
      lastFrostDate: Date,
      firstFrostDate: Date,
    },
  },
  {
    timestamps: true,
  }
);

const Garden = mongoose.model('Garden', gardenSchema);

module.exports = Garden;
