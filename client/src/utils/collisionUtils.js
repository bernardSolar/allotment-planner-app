/**
 * Utility functions for collision detection between garden elements
 */
import { getElementPixelPosition, getElementPixelDimensions } from './positionUtils';

/**
 * Checks if two rectangles overlap
 * @param {Object} rect1 - First rectangle {x, y, width, height}
 * @param {Object} rect2 - Second rectangle {x, y, width, height}
 * @returns {boolean} - True if the rectangles overlap
 */
export const rectIntersect = (rect1, rect2) => {
  return (
    rect1.x < rect2.x + rect2.width &&
    rect1.x + rect1.width > rect2.x &&
    rect1.y < rect2.y + rect2.height &&
    rect1.y + rect1.height > rect2.y
  );
};

/**
 * Checks if an element with a new position would collide with other elements
 * @param {Object} element - Element being moved
 * @param {Object} newPixelPosition - New position in pixels {x, y}
 * @param {Array} otherElements - Array of other elements to check against
 * @param {number} gridSize - Size of grid cells in pixels
 * @returns {boolean} - True if a collision would occur
 */
export const checkElementCollision = (element, newPixelPosition, otherElements, gridSize = 30) => {
  if (!element || !otherElements || otherElements.length === 0) {
    return false;
  }

  // Get the moved element's dimensions in pixels
  const { width, height } = getElementPixelDimensions(element, gridSize);
  
  // Create the moved element's rectangle
  const movedRect = {
    x: newPixelPosition.x,
    y: newPixelPosition.y,
    width,
    height
  };
  
  // Check against each other element
  return otherElements.some(otherElement => {
    // Skip checking against itself or background
    if (otherElement.id === element.id || otherElement.type === 'background') {
      return false;
    }
    
    // Get the other element's position and dimensions
    const otherPosition = getElementPixelPosition(otherElement, gridSize);
    const otherDimensions = getElementPixelDimensions(otherElement, gridSize);
    
    // Create the other element's rectangle
    const otherRect = {
      x: otherPosition.x,
      y: otherPosition.y,
      width: otherDimensions.width,
      height: otherDimensions.height
    };
    
    // Check for intersection
    return rectIntersect(movedRect, otherRect);
  });
};