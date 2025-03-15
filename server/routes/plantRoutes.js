const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const Plant = require('../models/plantModel');
const User = require('../models/userModel');

// Middleware to protect routes
const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from the token
      req.user = await User.findById(decoded.id).select('-password');

      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});

// Admin middleware
const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401);
    throw new Error('Not authorized as an admin');
  }
};

// @desc    Get all plants
// @route   GET /api/plants
// @access  Public
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const pageSize = 20;
    const page = Number(req.query.pageNumber) || 1;
    
    // Filtering options
    const keyword = req.query.keyword
      ? {
          name: {
            $regex: req.query.keyword,
            $options: 'i',
          },
        }
      : {};
    
    const plantType = req.query.plantType ? { plantType: req.query.plantType } : {};
    
    // Combine filters
    const filters = {
      ...keyword,
      ...plantType,
      isPublic: true, // Only show public plants by default
    };
    
    const count = await Plant.countDocuments(filters);
    const plants = await Plant.find(filters)
      .limit(pageSize)
      .skip(pageSize * (page - 1))
      .sort({ name: 1 });

    res.json({
      plants,
      page,
      pages: Math.ceil(count / pageSize),
      total: count,
    });
  })
);

// @desc    Get plant by ID
// @route   GET /api/plants/:id
// @access  Public
router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const plant = await Plant.findById(req.params.id);

    if (plant) {
      res.json(plant);
    } else {
      res.status(404);
      throw new Error('Plant not found');
    }
  })
);

// @desc    Create a plant
// @route   POST /api/plants
// @access  Private
router.post(
  '/',
  protect,
  asyncHandler(async (req, res) => {
    const {
      name,
      scientificName,
      description,
      plantType,
      growingInfo,
      timeToMaturity,
      sowingPeriod,
      harvestPeriod,
      companionPlants,
      careInstructions,
      harvestInstructions,
      expectedYield,
      storage,
      culinaryUses,
      medicinalUses,
      images,
      isPublic,
      tags,
    } = req.body;

    const plant = new Plant({
      name,
      scientificName: scientificName || '',
      description: description || '',
      plantType,
      growingInfo: growingInfo || {},
      timeToMaturity: timeToMaturity || 0,
      sowingPeriod: sowingPeriod || [],
      harvestPeriod: harvestPeriod || [],
      companionPlants: companionPlants || [],
      careInstructions: careInstructions || {},
      harvestInstructions: harvestInstructions || '',
      expectedYield: expectedYield || '',
      storage: storage || '',
      culinaryUses: culinaryUses || [],
      medicinalUses: medicinalUses || [],
      images: images || [],
      isPublic: isPublic !== undefined ? isPublic : true,
      createdBy: req.user._id,
      tags: tags || [],
    });

    const createdPlant = await plant.save();
    res.status(201).json(createdPlant);
  })
);

// @desc    Update a plant
// @route   PUT /api/plants/:id
// @access  Private/Admin
router.put(
  '/:id',
  protect,
  asyncHandler(async (req, res) => {
    const plant = await Plant.findById(req.params.id);

    if (plant) {
      // Check if user is admin or the creator of the plant
      if (
        !req.user.isAdmin &&
        (!plant.createdBy || plant.createdBy.toString() !== req.user._id.toString())
      ) {
        res.status(403);
        throw new Error('Not authorized to update this plant');
      }

      // Update plant fields
      const updatedFields = Object.keys(req.body).reduce((acc, key) => {
        if (req.body[key] !== undefined) {
          acc[key] = req.body[key];
        }
        return acc;
      }, {});

      const updatedPlant = await Plant.findByIdAndUpdate(
        req.params.id,
        { $set: updatedFields },
        { new: true }
      );

      res.json(updatedPlant);
    } else {
      res.status(404);
      throw new Error('Plant not found');
    }
  })
);

// @desc    Delete a plant
// @route   DELETE /api/plants/:id
// @access  Private/Admin
router.delete(
  '/:id',
  protect,
  asyncHandler(async (req, res) => {
    const plant = await Plant.findById(req.params.id);

    if (plant) {
      // Check if user is admin or the creator of the plant
      if (
        !req.user.isAdmin &&
        (!plant.createdBy || plant.createdBy.toString() !== req.user._id.toString())
      ) {
        res.status(403);
        throw new Error('Not authorized to delete this plant');
      }

      await plant.deleteOne();
      res.json({ message: 'Plant removed' });
    } else {
      res.status(404);
      throw new Error('Plant not found');
    }
  })
);

// @desc    Get plants by season
// @route   GET /api/plants/season/:month
// @access  Public
router.get(
  '/season/:month',
  asyncHandler(async (req, res) => {
    const month = parseInt(req.params.month);
    
    if (isNaN(month) || month < 1 || month > 12) {
      res.status(400);
      throw new Error('Invalid month. Please provide a number between 1 and 12.');
    }
    
    // Convert month to Date objects for comparison
    // Note: This is a simplified approach and would need refinement for real-world use
    const currentDate = new Date();
    currentDate.setMonth(month - 1);
    currentDate.setDate(15); // Middle of the month
    
    // Find plants that can be sown or harvested in this month
    const plants = await Plant.find({
      isPublic: true,
      $or: [
        { 'sowingPeriod.start': { $lte: currentDate }, 'sowingPeriod.end': { $gte: currentDate } },
        { 'harvestPeriod.start': { $lte: currentDate }, 'harvestPeriod.end': { $gte: currentDate } }
      ]
    });
    
    res.json(plants);
  })
);

// @desc    Get user's plants
// @route   GET /api/plants/user
// @access  Private
router.get(
  '/user/plants',
  protect,
  asyncHandler(async (req, res) => {
    const plants = await Plant.find({ createdBy: req.user._id });
    res.json(plants);
  })
);

module.exports = router;
