/**
 * Custom hook for handling element dragging
 */
import { useCallback } from 'react';
import { checkElementCollision } from '../utils/collisionUtils';
import { pixelToGrid } from '../utils/positionUtils';
import { GRID_SIZE } from '../config/gridConfig';

/**
 * Hook for managing element dragging behavior
 * 
 * @param {Function} updateElement - Function to update element state
 * @param {Object} garden - The current garden
 * @returns {Object} - Drag event handlers
 */
export const useElementDrag = (updateElement, garden) => {
  // Handler for drag start
  const handleDragStart = useCallback((element) => {
    console.log(`Started dragging element: ${element.id}`);
    // Could add additional functionality here, like showing drop indicators
  }, []);

  // Handler for drag move - useful for real-time collision feedback
  const handleDragMove = useCallback((element) => {
    // Currently not using, but could implement real-time collision visualization
  }, []);

  // Handler for drag end - this is where we update the element's position
  const handleDragEnd = useCallback((element, newPixelPosition) => {
    console.log(`Finished dragging element: ${element.id} to:`, newPixelPosition);
    
    if (!garden || !garden._id) {
      console.warn('No garden selected. Please select or create a garden first.');
      return;
    }
    
    // Check for collisions with other elements
    const isColliding = checkElementCollision(
      element, 
      newPixelPosition, 
      garden.elements, 
      GRID_SIZE
    );
    
    // If colliding, don't update position
    if (isColliding) {
      console.log("Collision detected, preventing overlap");
      return;
    }
    
    // Convert to grid units for storage
    const gridPosition = pixelToGrid(newPixelPosition, GRID_SIZE);
    
    // Update the element in the store
    updateElement(element, gridPosition);
  }, [garden, updateElement]);

  return {
    handleDragStart,
    handleDragMove,
    handleDragEnd
  };
};

export default useElementDrag;