/**
 * Component for rendering canvas zoom and pan controls
 */
import React from 'react';
import styled from 'styled-components';
import { 
  CONTROL_BUTTON_COLOR, 
  CONTROL_BUTTON_HOVER_COLOR, 
  CONTROL_BUTTON_BORDER_COLOR 
} from '../../config/gridConfig';

const ControlsContainer = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  gap: 10px;
  z-index: 10;
`;

const ControlButton = styled.button`
  background-color: ${CONTROL_BUTTON_COLOR};
  border: 1px solid ${CONTROL_BUTTON_BORDER_COLOR};
  border-radius: 4px;
  padding: 5px 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 14px;
  
  &:hover {
    background-color: ${CONTROL_BUTTON_HOVER_COLOR};
  }
  
  svg {
    width: 16px;
    height: 16px;
    margin-right: 6px;
  }
`;

/**
 * Zoom and pan controls for the canvas
 * 
 * @param {Object} props - Component props
 * @param {Function} props.onZoomIn - Handler for zoom in button click
 * @param {Function} props.onZoomOut - Handler for zoom out button click
 * @param {Function} props.onResetView - Handler for reset view button click
 * @returns {JSX.Element} - The rendered component
 */
const CanvasControls = ({ onZoomIn, onZoomOut, onResetView }) => {
  return (
    <ControlsContainer>
      <ControlButton onClick={onZoomIn}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="16" />
          <line x1="8" y1="12" x2="16" y2="12" />
        </svg>
        Zoom In
      </ControlButton>
      <ControlButton onClick={onZoomOut}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <line x1="8" y1="12" x2="16" y2="12" />
        </svg>
        Zoom Out
      </ControlButton>
      <ControlButton onClick={onResetView}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 12h18M12 3v18" />
        </svg>
        Reset View
      </ControlButton>
    </ControlsContainer>
  );
};

export default CanvasControls;