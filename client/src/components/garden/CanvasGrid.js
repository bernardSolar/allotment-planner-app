/**
 * Component for rendering the garden grid
 */
import React from 'react';
import { Group, Rect } from 'react-konva';
import { GRID_COLOR } from '../../config/gridConfig';

/**
 * Renders grid lines for the garden canvas
 * 
 * @param {Object} props - Component props
 * @param {number} props.width - Width of the grid in pixels
 * @param {number} props.height - Height of the grid in pixels
 * @param {number} props.gridSize - Size of grid cells in pixels
 * @param {number} props.scale - Current zoom scale
 * @returns {JSX.Element} - The rendered component
 */
const CanvasGrid = ({ width, height, gridSize, scale }) => {
  const gridLines = [];
  
  // Add vertical grid lines
  for (let i = 0; i <= width; i += gridSize) {
    gridLines.push(
      <Rect
        key={`v-${i}`}
        x={i}
        y={0}
        width={1 / scale}
        height={height}
        fill={GRID_COLOR}
      />
    );
  }
  
  // Add horizontal grid lines
  for (let i = 0; i <= height; i += gridSize) {
    gridLines.push(
      <Rect
        key={`h-${i}`}
        x={0}
        y={i}
        width={width}
        height={1 / scale}
        fill={GRID_COLOR}
      />
    );
  }
  
  return (
    <Group opacity={0.5}>
      {gridLines}
    </Group>
  );
};

export default CanvasGrid;