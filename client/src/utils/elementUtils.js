/**
 * Utility functions for garden elements
 */

/**
 * Gets the appropriate color for an element based on its type
 * @param {Object} element - The garden element
 * @returns {string} - Color as a hex code
 */
export const getElementColor = (element) => {
  if (!element) return '#BDBDBD';

  switch (element.type) {
    case 'raisedBed':
      return '#8D6E63'; // Brown for raised beds
    case 'flatBed':
      return '#A5D6A7'; // Light green for flat beds
    case 'path':
      return '#E0E0E0'; // Light gray for paths
    case 'plant':
      return element.color || '#4CAF50'; // Default plant color
    case 'tree':
      return '#43A047'; // Dark green for trees
    case 'bush':
      return '#66BB6A'; // Medium green for bushes
    case 'structure':
      return '#90A4AE'; // Blue-gray for structures
    default:
      return '#BDBDBD'; // Gray for other elements
  }
};

/**
 * Calculates the aspect ratio of an element
 * @param {Object} element - The garden element
 * @returns {number} - The aspect ratio (width/height)
 */
export const getElementAspectRatio = (element) => {
  if (!element) return 1;
  
  if (element.dimensions) {
    return element.dimensions.width / element.dimensions.height;
  } else if (element.width !== undefined && element.height !== undefined) {
    return element.width / element.height;
  }
  
  return 1;
};

/**
 * Creates a new element with a unique ID
 * @param {Object} templateElement - The element template
 * @returns {Object} - A new element with a unique ID
 */
export const createNewElement = (templateElement) => {
  if (!templateElement) return null;
  
  return {
    ...templateElement,
    id: `${templateElement.id}-${Date.now()}`,
    position: templateElement.position || { x: 0, y: 0 },
    name: templateElement.name
  };
};

/**
 * Gets the stroke width for an element based on selection state
 * @param {boolean} isSelected - Whether the element is selected
 * @param {number} scale - Current zoom scale
 * @returns {number} - The stroke width in pixels
 */
export const getElementStrokeWidth = (isSelected, scale = 1) => {
  return isSelected ? 2 / scale : 1 / scale;
};

/**
 * Gets the stroke color for an element based on selection state
 * @param {boolean} isSelected - Whether the element is selected
 * @returns {string} - The stroke color as a hex code
 */
export const getElementStrokeColor = (isSelected) => {
  return isSelected ? '#FF9800' : '#757575';
};