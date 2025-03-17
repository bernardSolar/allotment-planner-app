/**
 * Component for rendering an individual garden element on the canvas
 */
import React from 'react';
import { Group, Rect, Text, Circle } from 'react-konva';
import { getElementPixelPosition, getElementPixelDimensions } from '../../utils/positionUtils';
import { getElementColor, getElementStrokeWidth, getElementStrokeColor } from '../../utils/elementUtils';
import { CORNER_HANDLE_RADIUS } from '../../config/gridConfig';

/**
 * Renders a garden element (bed, plant, tree, etc.)
 * 
 * @param {Object} props - Component props
 * @param {Object} props.element - The element data
 * @param {number} props.gridSize - Size of grid cells in pixels
 * @param {boolean} props.isSelected - Whether the element is selected
 * @param {Function} props.onClick - Handler for element click
 * @param {Function} props.onDragEnd - Handler for element drag end
 * @param {boolean} props.draggable - Whether the element can be dragged
 * @param {number} props.scale - Current zoom scale
 * @returns {JSX.Element} - The rendered component
 */
const GardenElement = ({
  element,
  gridSize = 30,
  isSelected = false,
  onClick = () => {},
  onDragEnd = () => {},
  draggable = true,
  scale = 1,
}) => {
  // If no element is provided, don't render anything
  if (!element) return null;
  
  // Get position and dimensions in pixels
  const position = getElementPixelPosition(element, gridSize);
  const { width, height } = getElementPixelDimensions(element, gridSize);
  
  /**
   * Handle element drag end
   * @param {Object} e - Drag event
   */
  const handleDragEnd = (e) => {
    // Get the absolute position after drag
    const newPosition = {
      x: e.target.x(),
      y: e.target.y()
    };
    
    console.log(`Dragged element ${element.id} to position:`, newPosition);
    
    // Pass the updated position to the parent component
    onDragEnd(newPosition);
  };
  
  /**
   * Renders the appropriate visual representation of the element
   * based on its type
   * @returns {JSX.Element} - Element representation
   */
  const renderElement = () => {
    const color = getElementColor(element);
    const strokeWidth = getElementStrokeWidth(isSelected, scale);
    const strokeColor = getElementStrokeColor(isSelected);

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
      draggable={isSelected} // Only allow dragging if selected
      onClick={onClick}
      onTap={onClick}
      onDragStart={(e) => {
        // Prevent propagation to stop the stage from handling the drag
        e.cancelBubble = true;
        console.log("ELEMENT drag start:", element.id);
      }}
      onDragMove={(e) => {
        // Prevent propagation to stop the stage from handling the drag
        e.cancelBubble = true;
        console.log("ELEMENT drag move:", element.id, e.target.x(), e.target.y());
      }}
      onDragEnd={(e) => {
        // Prevent propagation to stop the stage from handling the drag
        e.cancelBubble = true;
        console.log("ELEMENT drag end:", element.id, e.target.x(), e.target.y());
        handleDragEnd(e);
      }}
    >
      {renderElement()}

      {/* Selection indicators when selected */}
      {isSelected && (
        <>
          {/* Simple selection outline */}
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
          
          {/* Corner handles for visual feedback only */}
          <Circle 
            x={0} 
            y={0} 
            radius={CORNER_HANDLE_RADIUS / scale} 
            fill="#FFC107" 
            stroke="#FF9800" 
            strokeWidth={1 / scale} 
          />
          <Circle 
            x={width} 
            y={0} 
            radius={CORNER_HANDLE_RADIUS / scale} 
            fill="#FFC107" 
            stroke="#FF9800" 
            strokeWidth={1 / scale} 
          />
          <Circle 
            x={0} 
            y={height} 
            radius={CORNER_HANDLE_RADIUS / scale} 
            fill="#FFC107" 
            stroke="#FF9800" 
            strokeWidth={1 / scale} 
          />
          <Circle 
            x={width} 
            y={height} 
            radius={CORNER_HANDLE_RADIUS / scale} 
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