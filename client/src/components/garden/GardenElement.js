import React, { useState, useEffect, useCallback } from 'react';
import { Group, Rect, Text, Circle } from 'react-konva';

const GardenElement = ({
  element,
  gridSize = 30,
  isSelected = false,
  onClick = () => {},
  onDragEnd = () => {},
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
    onDragEnd(newPosition);
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
          {/* Corner handles */}
          <Circle x={0} y={0} radius={5 / scale} fill="#FFC107" stroke="#FF9800" strokeWidth={1 / scale} />
          <Circle x={width} y={0} radius={5 / scale} fill="#FFC107" stroke="#FF9800" strokeWidth={1 / scale} />
          <Circle x={0} y={height} radius={5 / scale} fill="#FFC107" stroke="#FF9800" strokeWidth={1 / scale} />
          <Circle
            x={width}
            y={height}
            radius={5 / scale}
            fill="#FFC107"
            stroke="#FF9800"
            strokeWidth={1 / scale}
          />
        </>
      )}
    </Group>
  );
};

export default GardenElement;
