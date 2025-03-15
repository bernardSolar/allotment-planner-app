const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const Garden = require('../models/gardenModel');
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

// @desc    Create a garden
// @route   POST /api/gardens
// @access  Private
router.post(
  '/',
  protect,
  asyncHandler(async (req, res) => {
    const { name, description, dimensions, location, elements, isPublic, tags, weatherData } = req.body;

    const garden = new Garden({
      user: req.user._id,
      name,
      description,
      dimensions,
      location,
      elements: elements || [],
      isPublic: isPublic || false,
      tags: tags || [],
      weatherData: weatherData || {},
    });

    const createdGarden = await garden.save();
    res.status(201).json(createdGarden);
  })
);

// @desc    Get all gardens for a user
// @route   GET /api/gardens
// @access  Private
router.get(
  '/',
  protect,
  asyncHandler(async (req, res) => {
    const gardens = await Garden.find({ user: req.user._id });
    res.json(gardens);
  })
);

// @desc    Get a garden by ID
// @route   GET /api/gardens/:id
// @access  Private
router.get(
  '/:id',
  protect,
  asyncHandler(async (req, res) => {
    const garden = await Garden.findById(req.params.id);

    if (garden) {
      // Check if garden belongs to user or is public
      if (garden.user.toString() === req.user._id.toString() || garden.isPublic) {
        res.json(garden);
      } else {
        res.status(403);
        throw new Error('Not authorized to access this garden');
      }
    } else {
      res.status(404);
      throw new Error('Garden not found');
    }
  })
);

// @desc    Update a garden
// @route   PUT /api/gardens/:id
// @access  Private
router.put(
  '/:id',
  protect,
  asyncHandler(async (req, res) => {
    const garden = await Garden.findById(req.params.id);

    if (garden) {
      // Check if garden belongs to user
      if (garden.user.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error('Not authorized to update this garden');
      }

      // Update garden fields
      garden.name = req.body.name || garden.name;
      garden.description = req.body.description || garden.description;
      garden.dimensions = req.body.dimensions || garden.dimensions;
      garden.location = req.body.location || garden.location;
      garden.elements = req.body.elements || garden.elements;
      garden.isPublic = req.body.isPublic !== undefined ? req.body.isPublic : garden.isPublic;
      garden.tags = req.body.tags || garden.tags;
      garden.weatherData = req.body.weatherData || garden.weatherData;

      const updatedGarden = await garden.save();
      res.json(updatedGarden);
    } else {
      res.status(404);
      throw new Error('Garden not found');
    }
  })
);

// @desc    Delete a garden
// @route   DELETE /api/gardens/:id
// @access  Private
router.delete(
  '/:id',
  protect,
  asyncHandler(async (req, res) => {
    const garden = await Garden.findById(req.params.id);

    if (garden) {
      // Check if garden belongs to user
      if (garden.user.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error('Not authorized to delete this garden');
      }

      await garden.deleteOne();
      res.json({ message: 'Garden removed' });
    } else {
      res.status(404);
      throw new Error('Garden not found');
    }
  })
);

// @desc    Add a garden element
// @route   POST /api/gardens/:id/elements
// @access  Private
router.post(
  '/:id/elements',
  protect,
  asyncHandler(async (req, res) => {
    const garden = await Garden.findById(req.params.id);

    if (garden) {
      // Check if garden belongs to user
      if (garden.user.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error('Not authorized to update this garden');
      }

      const newElement = req.body;
      garden.elements.push(newElement);
      
      const updatedGarden = await garden.save();
      res.status(201).json(updatedGarden);
    } else {
      res.status(404);
      throw new Error('Garden not found');
    }
  })
);

// @desc    Update a garden element
// @route   PUT /api/gardens/:id/elements/:elementId
// @access  Private
router.put(
  '/:id/elements/:elementId',
  protect,
  asyncHandler(async (req, res) => {
    const garden = await Garden.findById(req.params.id);

    if (garden) {
      // Check if garden belongs to user
      if (garden.user.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error('Not authorized to update this garden');
      }

      const elementIndex = garden.elements.findIndex(
        (element) => element._id.toString() === req.params.elementId
      );

      if (elementIndex !== -1) {
        garden.elements[elementIndex] = {
          ...garden.elements[elementIndex].toObject(),
          ...req.body,
          _id: garden.elements[elementIndex]._id, // Ensure ID doesn't change
        };

        const updatedGarden = await garden.save();
        res.json(updatedGarden);
      } else {
        res.status(404);
        throw new Error('Garden element not found');
      }
    } else {
      res.status(404);
      throw new Error('Garden not found');
    }
  })
);

// @desc    Delete a garden element
// @route   DELETE /api/gardens/:id/elements/:elementId
// @access  Private
router.delete(
  '/:id/elements/:elementId',
  protect,
  asyncHandler(async (req, res) => {
    const garden = await Garden.findById(req.params.id);

    if (garden) {
      // Check if garden belongs to user
      if (garden.user.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error('Not authorized to update this garden');
      }

      const elementIndex = garden.elements.findIndex(
        (element) => element._id.toString() === req.params.elementId
      );

      if (elementIndex !== -1) {
        garden.elements.splice(elementIndex, 1);
        const updatedGarden = await garden.save();
        res.json(updatedGarden);
      } else {
        res.status(404);
        throw new Error('Garden element not found');
      }
    } else {
      res.status(404);
      throw new Error('Garden not found');
    }
  })
);

module.exports = router;
