/**
 * Utility functions for handling positions and dimensions in the garden planner
 */

/**
 * Converts grid units to pixel position
 * @param {Object} gridPosition - Position in grid units {x, y}
 * @param {number} gridSize - Size of a grid cell in pixels
 * @returns {Object} - Position in pixels {x, y}
 */
export const gridToPixel = (gridPosition, gridSize = 30) => {
  if (!gridPosition) return { x: 0, y: 0 };
  
  return {
    x: gridPosition.x * gridSize,
    y: gridPosition.y * gridSize
  };
};

/**
 * Converts pixel position to grid units
 * @param {Object} pixelPosition - Position in pixels {x, y}
 * @param {number} gridSize - Size of a grid cell in pixels
 * @returns {Object} - Position in grid units {x, y}
 */
export const pixelToGrid = (pixelPosition, gridSize = 30) => {
  if (!pixelPosition) return { x: 0, y: 0 };
  
  return {
    x: Math.round(pixelPosition.x / gridSize),
    y: Math.round(pixelPosition.y / gridSize)
  };
};

/**
 * Gets the element's position in pixels
 * @param {Object} element - Element object
 * @param {number} gridSize - Size of a grid cell in pixels
 * @returns {Object} - Position in pixels {x, y}
 */
export const getElementPixelPosition = (element, gridSize = 30) => {
  if (!element) return { x: 0, y: 0 };
  
  // Handle both position formats (position object or direct x,y properties)
  if (element.position) {
    return gridToPixel(element.position, gridSize);
  } else if (element.x !== undefined && element.y !== undefined) {
    return gridToPixel({ x: element.x, y: element.y }, gridSize);
  }
  
  return { x: 0, y: 0 };
};

/**
 * Gets the element's dimensions in pixels
 * @param {Object} element - Element object
 * @param {number} gridSize - Size of a grid cell in pixels
 * @returns {Object} - Dimensions in pixels {width, height}
 */
export const getElementPixelDimensions = (element, gridSize = 30) => {
  if (!element) return { width: gridSize, height: gridSize };
  
  // Handle both dimension formats
  if (element.dimensions) {
    return {
      width: element.dimensions.width * gridSize,
      height: element.dimensions.height * gridSize
    };
  } else if (element.width !== undefined && element.height !== undefined) {
    return {
      width: element.width * gridSize,
      height: element.height * gridSize
    };
  }
  
  return { width: gridSize, height: gridSize };
};

/**
 * Updates an element's position
 * @param {Object} element - Element to update
 * @param {Object} newPosition - New position in grid units
 * @returns {Object} - Updated element
 */
export const updateElementPosition = (element, newPosition) => {
  if (!element || !newPosition) return element;
  
  const updatedElement = { ...element };
  
  // Update position based on the format used by the element
  if (updatedElement.position) {
    updatedElement.position = { 
      x: newPosition.x, 
      y: newPosition.y 
    };
  } else {
    updatedElement.x = newPosition.x;
    updatedElement.y = newPosition.y;
  }
  
  return updatedElement;
};