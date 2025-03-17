/**
 * Custom hook for handling element selection
 */
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  setSelectedElement, 
  clearSelectedElement 
} from '../slices/gardenSlice';

/**
 * Hook for managing element selection
 * 
 * @returns {Object} - Selection state and handlers
 */
export const useSelection = () => {
  const dispatch = useDispatch();
  const selectedElement = useSelector((state) => state.gardens.selectedElement);
  
  // Handler for selecting an element
  const handleSelectElement = useCallback((element) => {
    console.log(`Selected element: ${element?.id}`);
    dispatch(setSelectedElement(element));
  }, [dispatch]);
  
  // Handler for clearing selection
  const handleClearSelection = useCallback(() => {
    console.log('Cleared selection');
    dispatch(clearSelectedElement());
  }, [dispatch]);
  
  // Handler for clicking on the stage background
  const handleStageClick = useCallback((e) => {
    // If clicking on empty area (not an element)
    if (e.target === e.currentTarget) {
      handleClearSelection();
    }
  }, [handleClearSelection]);
  
  // Check if a specific element is selected
  const isElementSelected = useCallback((element) => {
    return element && selectedElement && element.id === selectedElement.id;
  }, [selectedElement]);

  return {
    selectedElement,
    handleSelectElement,
    handleClearSelection,
    handleStageClick,
    isElementSelected
  };
};

export default useSelection;