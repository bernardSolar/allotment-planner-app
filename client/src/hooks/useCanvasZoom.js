/**
 * Custom hook for handling canvas zoom and pan
 */
import { useState, useCallback, useRef } from 'react';
import { 
  MIN_ZOOM, 
  MAX_ZOOM, 
  ZOOM_FACTOR 
} from '../config/gridConfig';

/**
 * Hook for managing canvas zoom and pan behavior
 * 
 * @param {number} initialScale - Initial zoom scale
 * @param {Object} initialPosition - Initial position {x, y}
 * @returns {Object} - Zoom and pan state and handlers
 */
export const useCanvasZoom = (initialScale = 1, initialPosition = { x: 0, y: 0 }) => {
  const [scale, setScale] = useState(initialScale);
  const [position, setPosition] = useState(initialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const stageRef = useRef(null);

  // Handle wheel event for zooming
  const handleWheel = useCallback((e) => {
    e.evt.preventDefault();
    
    const stage = stageRef.current;
    if (!stage) return;
    
    const oldScale = scale;
    const pointerPosition = stage.getPointerPosition();
    const mousePointTo = {
      x: (pointerPosition.x - stage.x()) / oldScale,
      y: (pointerPosition.y - stage.y()) / oldScale,
    };
    
    // Calculate new scale
    const newScale = e.evt.deltaY < 0 
      ? oldScale * ZOOM_FACTOR 
      : oldScale / ZOOM_FACTOR;
    
    // Limit scale
    const limitedScale = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, newScale));
    
    // Calculate new position to zoom toward mouse position
    const newPos = {
      x: pointerPosition.x - mousePointTo.x * limitedScale,
      y: pointerPosition.y - mousePointTo.y * limitedScale,
    };
    
    setScale(limitedScale);
    setPosition(newPos);
  }, [scale]);
  
  // Zoom in handler
  const handleZoomIn = useCallback(() => {
    const newScale = Math.min(MAX_ZOOM, scale * ZOOM_FACTOR);
    setScale(newScale);
  }, [scale]);
  
  // Zoom out handler
  const handleZoomOut = useCallback(() => {
    const newScale = Math.max(MIN_ZOOM, scale / ZOOM_FACTOR);
    setScale(newScale);
  }, [scale]);
  
  // Reset view handler
  const handleResetView = useCallback(() => {
    setScale(initialScale);
    setPosition(initialPosition);
  }, [initialScale, initialPosition]);
  
  // Handle stage drag start
  const handleStageDragStart = useCallback(() => {
    console.log("Stage drag start");
    setIsDragging(true);
  }, []);
  
  // Handle stage drag end
  const handleStageDragEnd = useCallback((e) => {
    console.log("Stage drag end");
    setPosition({ 
      x: e.target.x(), 
      y: e.target.y() 
    });
    setIsDragging(false);
  }, []);

  return {
    scale,
    position,
    isDragging,
    stageRef,
    handleWheel,
    handleZoomIn,
    handleZoomOut,
    handleResetView,
    handleStageDragStart,
    handleStageDragEnd
  };
};

export default useCanvasZoom;