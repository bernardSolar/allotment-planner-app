import React, { useState, useEffect, useCallback } from 'react';
import { Group, Rect, Text, Circle } from 'react-konva';

const GardenElement = ({
  element,
  gridSize = 30,
  isSelected = false,
  onClick = () => {},
  onDragEnd = () => {},
  onResize = () => {},
  draggable = true,
  scale = 1,
}) => {
  // Handle both formats of element position (x/y properties directly or nested in position object)
  const getInitialPosition = useCallback(() => {
    if (!element) {
      return { x: 0, y: 0 };
    }
    
    if (element.position) {
      return {
        x: element.position.x * gridSize,
        y: element.position.y * gridSize,
      };
    } else if (element.x !== undefined && element.y !== undefined) {
      return {
        x: element.x * gridSize,
        y: element.y * gridSize,
      };
    } else {
      // Default position if none specified
      return { x: 0, y: 0 };
    }
  }, [element, gridSize]);
  
  // Convert element position from grid units to pixels
  const [position, setPosition] = useState(getInitialPosition());
  
  // State to track resizing
  const [isResizing, setIsResizing] = useState(false);
  const [resizePreview, setResizePreview] = useState(null);

  // Update position when gridSize or element position changes
  useEffect(() => {
    setPosition(getInitialPosition());
  }, [getInitialPosition]);

  // Element width and height in pixels (handle different formats)
  const getElementDimensions = useCallback(() => {
    if (!element) {
      return { width: gridSize, height: gridSize };
    }
    
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
    } else {
      // Default dimensions
      return {
        width: gridSize,
        height: gridSize
      };
    }
  }, [element, gridSize]);
  
  // If no element is provided, don't render anything
  if (!element) {
    return null;
  }
  
  const { width, height } = getElementDimensions();

  // Handle element drag
  const handleDragEnd = (e) => {
    const newPosition = {
      x: e.target.x(),
      y: e.target.y(),
    };
    setPosition(newPosition);
    onDragEnd(element, newPosition);
  };
  
  // Calculate the original aspect ratio
  const aspectRatio = element.dimensions ? 
    element.dimensions.width / element.dimensions.height : 
    (element.width && element.height) ? element.width / element.height : 1;
  
  // Start resizing
  const handleResizeStart = (e, corner) => {
    if (!isSelected) return;
    setIsResizing(true);
    e.cancelBubble = true; // Prevent propagation
  };
  
  // Handle resize move - update preview
  const handleResizeMove = (e, corner) => {
    if (!isResizing || !isSelected) return;
    
    // Get the position of the pointer relative to the stage
    const stage = e.target.getStage();
    const pointerPosition = stage.getPointerPosition();
    const stageBox = stage.container().getBoundingClientRect();
    
    // Convert pointer position to local coordinates
    const localPos = {
      x: (pointerPosition.x - stageBox.left - stage.x()) / scale,
      y: (pointerPosition.y - stageBox.top - stage.y()) / scale
    };
    
    // Calculate the element's absolute position in stage coordinates
    const absElementPos = {
      x: position.x,
      y: position.y
    };
    
    // Calculate new dimensions based on which corner is being dragged
    let newWidth, newHeight;
    
    if (corner === 'bottomRight') {
      // Calculate dimensions from top-left to pointer
      newWidth = Math.max(gridSize, localPos.x - absElementPos.x);
      newHeight = Math.max(gridSize, localPos.y - absElementPos.y);
    } else if (corner === 'bottomLeft') {
      // Calculate width from right edge to pointer, height from top to pointer
      newWidth = Math.max(gridSize, (absElementPos.x + width) - localPos.x);
      newHeight = Math.max(gridSize, localPos.y - absElementPos.y);
    } else if (corner === 'topRight') {
      // Calculate width from left to pointer, height from bottom to pointer
      newWidth = Math.max(gridSize, localPos.x - absElementPos.x);
      newHeight = Math.max(gridSize, (absElementPos.y + height) - localPos.y);
    } else if (corner === 'topLeft') {
      // Calculate dimensions from bottom-right to pointer
      newWidth = Math.max(gridSize, (absElementPos.x + width) - localPos.x);
      newHeight = Math.max(gridSize, (absElementPos.y + height) - localPos.y);
    }
    
    // Maintain aspect ratio
    if (corner === 'bottomRight' || corner === 'topLeft') {
      // Use width to determine height
      newHeight = newWidth / aspectRatio;
    } else {
      // Use height to determine width
      newWidth = newHeight * aspectRatio;
    }
    
    // Round to nearest grid size
    newWidth = Math.round(newWidth / gridSize) * gridSize;
    newHeight = Math.round(newHeight / gridSize) * gridSize;
    
    // Constraint: can't be larger than canvas
    const canvasWidth = stage.width() / scale;
    const canvasHeight = stage.height() / scale;
    newWidth = Math.min(newWidth, canvasWidth - absElementPos.x);
    newHeight = Math.min(newHeight, canvasHeight - absElementPos.y);
    
    // Update the resize preview
    setResizePreview({ width: newWidth, height: newHeight });
  };
  
  // End resizing and apply changes
  const handleResizeEnd = (e, corner) => {
    if (!isResizing || !isSelected || !resizePreview) return;
    
    // Convert to grid units
    const gridWidth = Math.max(1, Math.round(resizePreview.width / gridSize));
    const gridHeight = Math.max(1, Math.round(resizePreview.height / gridSize));
    
    // Update dimensions in parent component
    if (onResize) {
      onResize(element, {
        width: gridWidth,
        height: gridHeight
      });
    }
    
    // Reset resizing state
    setIsResizing(false);
    setResizePreview(null);
  };

  // Get appropriate color based on element type
  const getColor = () => {
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

  // Render different types of elements
  const renderElement = () => {
    const color = getColor();
    const strokeWidth = isSelected ? 2 / scale : 1 / scale;
    const strokeColor = isSelected ? '#FF9800' : '#757575';

    switch (element.type) {
      case 'plant':
        // Circular plant representation
        return (
          <>
            <Circle
              x={width / 2}
              y={height / 2}
              radius={Math.min(width, height) / 2 - strokeWidth}
              fill={color}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
            />
            <Text
              x={0}
              y={height}
              width={width}
              text={element.name}
              fontSize={12 / scale}
              fill="#333"
              align="center"
            />
          </>
        );
      
      case 'tree':
        // Tree representation with trunk and canopy
        return (
          <>
            {/* Tree trunk */}
            <Rect
              x={width / 2 - width / 6}
              y={height / 2}
              width={width / 3}
              height={height / 2}
              fill="#8D6E63"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
            />
            {/* Tree canopy */}
            <Circle
              x={width / 2}
              y={height / 3}
              radius={width / 2 - strokeWidth}
              fill={color}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
            />
            <Text
              x={0}
              y={height}
              width={width}
              text={element.name}
              fontSize={12 / scale}
              fill="#333"
              align="center"
            />
          </>
        );
      
      case 'bush':
        // Bush representation - slightly oval
        return (
          <>
            <Rect
              x={0}
              y={0}
              width={width}
              height={height}
              fill={color}
              cornerRadius={height / 2}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
            />
            <Text
              x={0}
              y={height / 2 - 6 / scale}
              width={width}
              text={element.name}
              fontSize={12 / scale}
              fill="#333"
              align="center"
            />
          </>
        );
      
      default:
        // Default rectangular representation for beds, paths, structures, etc.
        return (
          <>
            <Rect
              x={0}
              y={0}
              width={width}
              height={height}
              fill={color}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              cornerRadius={element.type === 'path' ? 0 : 5 / scale}
            />
            <Text
              x={5 / scale}
              y={5 / scale}
              width={width - 10 / scale}
              text={element.name}
              fontSize={14 / scale}
              fill="#333"
              align="center"
              verticalAlign="middle"
              ellipsis={true}
            />
          </>
        );
    }
  };

  return (
    <Group
      x={position.x}
      y={position.y}
      width={width}
      height={height}
      draggable={draggable}
      onDragEnd={handleDragEnd}
      onClick={onClick}
      onTap={onClick}
    >
      {renderElement()}

      {/* Selection indicators when selected */}
      {isSelected && (
        <>
          {/* Corner handles for resizing with drag events */}
          <Circle 
            x={0} 
            y={0} 
            radius={6 / scale} 
            fill="#FFC107" 
            stroke="#FF9800" 
            strokeWidth={1 / scale}
            draggable={true}
            onDragStart={(e) => handleResizeStart(e, 'topLeft')}
            onDragMove={(e) => handleResizeMove(e, 'topLeft')}
            onDragEnd={(e) => handleResizeEnd(e, 'topLeft')}
            cursor="nwse-resize"
          />
          <Circle 
            x={width} 
            y={0} 
            radius={6 / scale} 
            fill="#FFC107" 
            stroke="#FF9800" 
            strokeWidth={1 / scale}
            draggable={true}
            onDragStart={(e) => handleResizeStart(e, 'topRight')}
            onDragMove={(e) => handleResizeMove(e, 'topRight')}
            onDragEnd={(e) => handleResizeEnd(e, 'topRight')}
            cursor="nesw-resize"
          />
          <Circle 
            x={0} 
            y={height} 
            radius={6 / scale} 
            fill="#FFC107" 
            stroke="#FF9800" 
            strokeWidth={1 / scale}
            draggable={true}
            onDragStart={(e) => handleResizeStart(e, 'bottomLeft')}
            onDragMove={(e) => handleResizeMove(e, 'bottomLeft')}
            onDragEnd={(e) => handleResizeEnd(e, 'bottomLeft')}
            cursor="nesw-resize"
          />
          <Circle
            x={width}
            y={height}
            radius={6 / scale}
            fill="#FFC107"
            stroke="#FF9800"
            strokeWidth={1 / scale}
            draggable={true}
            onDragStart={(e) => handleResizeStart(e, 'bottomRight')}
            onDragMove={(e) => handleResizeMove(e, 'bottomRight')}
            onDragEnd={(e) => handleResizeEnd(e, 'bottomRight')}
            cursor="nwse-resize"
          />
          
          {/* Resize preview outline */}
          {isResizing && resizePreview && (
            <Rect
              x={0}
              y={0}
              width={resizePreview.width}
              height={resizePreview.height}
              stroke="#4CAF50"
              strokeWidth={2 / scale}
              dash={[5 / scale, 5 / scale]}
              fill="rgba(76, 175, 80, 0.2)"
              listening={false}
            />
          )}
          
          {/* Selection outline */}
          {!isResizing && (
            <Rect
              x={0}
              y={0}
              width={width}
              height={height}
              stroke="#FF9800"
              strokeWidth={2 / scale}
              dash={[5 / scale, 5 / scale]}
              fill="transparent"
              listening={false}
            />
          )}
        </>
      )}
    </Group>
  );
};

export default GardenElement;
