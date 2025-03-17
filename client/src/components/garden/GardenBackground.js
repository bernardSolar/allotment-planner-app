/**
 * Component for rendering the garden background
 */
import React from 'react';
import { Rect } from 'react-konva';
import { DEFAULT_BACKGROUND_COLOR } from '../../config/gridConfig';

/**
 * Renders the garden background
 * 
 * @param {Object} props - Component props
 * @param {number} props.width - Width of background in pixels
 * @param {number} props.height - Height of background in pixels
 * @param {string} props.color - Background color (optional)
 * @returns {JSX.Element} - The rendered component
 */
const GardenBackground = ({ width, height, color = DEFAULT_BACKGROUND_COLOR }) => {
  return (
    <Rect
      x={0}
      y={0}
      width={width}
      height={height}
      fill={color}
    />
  );
};

export default GardenBackground;