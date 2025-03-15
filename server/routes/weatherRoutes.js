const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const jwt = require('jsonwebtoken');
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

// @desc    Get current weather data for a location
// @route   GET /api/weather/current
// @access  Private
router.get(
  '/current',
  protect,
  asyncHandler(async (req, res) => {
    const { location } = req.query;
    
    if (!location) {
      res.status(400);
      throw new Error('Please provide a location parameter');
    }

    try {
      // Use OpenWeatherMap API
      const weatherResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${process.env.WEATHER_API_KEY}`
      );
      
      const weatherData = await weatherResponse.json();
      
      if (weatherData.cod && weatherData.cod !== 200) {
        res.status(404);
        throw new Error(weatherData.message || 'Location not found');
      }
      
      // Format the response to suit our app's needs
      const formattedWeather = {
        location: weatherData.name,
        country: weatherData.sys.country,
        temperature: weatherData.main.temp,
        feels_like: weatherData.main.feels_like,
        humidity: weatherData.main.humidity,
        description: weatherData.weather[0].description,
        icon: weatherData.weather[0].icon,
        wind_speed: weatherData.wind.speed,
        wind_direction: weatherData.wind.deg,
        clouds: weatherData.clouds.all,
        rain: weatherData.rain ? weatherData.rain['1h'] : 0,
        timestamp: weatherData.dt,
        timezone: weatherData.timezone,
      };
      
      res.json(formattedWeather);
    } catch (error) {
      console.error(`Weather API error: ${error.message}`);
      res.status(500);
      throw new Error('Failed to fetch weather data');
    }
  })
);

// @desc    Get weather forecast for a location
// @route   GET /api/weather/forecast
// @access  Private
router.get(
  '/forecast',
  protect,
  asyncHandler(async (req, res) => {
    const { location, days = 5 } = req.query;
    
    if (!location) {
      res.status(400);
      throw new Error('Please provide a location parameter');
    }

    try {
      // Use OpenWeatherMap API for 5-day forecast
      const forecastResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${location}&units=metric&appid=${process.env.WEATHER_API_KEY}`
      );
      
      const forecastData = await forecastResponse.json();
      
      if (forecastData.cod && forecastData.cod !== '200') {
        res.status(404);
        throw new Error(forecastData.message || 'Location not found');
      }
      
      // Process the forecast data into a more usable format
      // OpenWeatherMap provides data in 3-hour increments
      const processedForecast = forecastData.list.map(item => ({
        timestamp: item.dt,
        date: new Date(item.dt * 1000).toISOString().split('T')[0],
        time: new Date(item.dt * 1000).toISOString().split('T')[1].substring(0, 5),
        temperature: item.main.temp,
        feels_like: item.main.feels_like,
        min_temp: item.main.temp_min,
        max_temp: item.main.temp_max,
        pressure: item.main.pressure,
        humidity: item.main.humidity,
        description: item.weather[0].description,
        icon: item.weather[0].icon,
        wind_speed: item.wind.speed,
        wind_direction: item.wind.deg,
        clouds: item.clouds.all,
        rain: item.rain ? item.rain['3h'] : 0,
      }));
      
      // Group by day
      const dailyForecast = processedForecast.reduce((days, item) => {
        const date = item.date;
        if (!days[date]) {
          days[date] = [];
        }
        days[date].push(item);
        return days;
      }, {});
      
      // Limit to the requested number of days
      const limitedForecast = Object.entries(dailyForecast)
        .slice(0, parseInt(days))
        .reduce((obj, [date, items]) => {
          obj[date] = items;
          return obj;
        }, {});
      
      res.json({
        location: forecastData.city.name,
        country: forecastData.city.country,
        timezone: forecastData.city.timezone,
        forecast: limitedForecast,
      });
    } catch (error) {
      console.error(`Weather API error: ${error.message}`);
      res.status(500);
      throw new Error('Failed to fetch weather forecast');
    }
  })
);

// @desc    Get garden alerts based on weather conditions
// @route   GET /api/weather/alerts
// @access  Private
router.get(
  '/alerts',
  protect,
  asyncHandler(async (req, res) => {
    const { location } = req.query;
    
    if (!location) {
      res.status(400);
      throw new Error('Please provide a location parameter');
    }

    try {
      // Get current weather and forecast
      const [currentResponse, forecastResponse] = await Promise.all([
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${process.env.WEATHER_API_KEY}`),
        fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${location}&units=metric&appid=${process.env.WEATHER_API_KEY}`)
      ]);
      
      const currentData = await currentResponse.json();
      const forecastData = await forecastResponse.json();
      
      if (currentData.cod !== 200 || forecastData.cod !== '200') {
        res.status(404);
        throw new Error('Location not found');
      }
      
      // Generate alerts based on weather conditions
      const alerts = [];
      
      // Check for frost risk (temperatures below 0°C)
      const forecastList = forecastData.list;
      const frostRisk = forecastList.some(item => item.main.temp <= 0);
      if (frostRisk) {
        alerts.push({
          type: 'frost',
          severity: 'high',
          message: 'Frost risk detected in the next few days. Protect sensitive plants.',
          action: 'Cover tender plants with a frost blanket or bring potted plants indoors.'
        });
      }
      
      // Check for extreme heat (above 30°C)
      const heatRisk = forecastList.some(item => item.main.temp >= 30);
      if (heatRisk) {
        alerts.push({
          type: 'heat',
          severity: 'high',
          message: 'High temperatures expected. Plants may be stressed.',
          action: 'Increase watering frequency and consider providing shade for sensitive plants.'
        });
      }
      
      // Check for drought conditions (no rain for 5 days)
      const rainPredicted = forecastList.some(item => (item.rain && item.rain['3h'] > 0));
      if (!rainPredicted) {
        alerts.push({
          type: 'drought',
          severity: 'medium',
          message: 'No rain predicted in the next few days.',
          action: 'Ensure adequate watering, especially for newly planted crops.'
        });
      }
      
      // Check for heavy rain
      const heavyRainRisk = forecastList.some(item => (item.rain && item.rain['3h'] > 10));
      if (heavyRainRisk) {
        alerts.push({
          type: 'heavy_rain',
          severity: 'medium',
          message: 'Heavy rain predicted. Risk of soil erosion and waterlogging.',
          action: 'Ensure good drainage and consider protecting delicate plants.'
        });
      }
      
      // Check for strong winds
      const windRisk = forecastList.some(item => item.wind.speed > 10); // m/s
      if (windRisk) {
        alerts.push({
          type: 'wind',
          severity: 'medium',
          message: 'Strong winds predicted. Risk of plant and structure damage.',
          action: 'Stake tall plants and secure garden structures.'
        });
      }
      
      res.json({
        location: currentData.name,
        country: currentData.sys.country,
        alerts,
        current_temp: currentData.main.temp,
        current_conditions: currentData.weather[0].description,
      });
      
    } catch (error) {
      console.error(`Weather alerts error: ${error.message}`);
      res.status(500);
      throw new Error('Failed to generate weather alerts');
    }
  })
);

module.exports = router;
