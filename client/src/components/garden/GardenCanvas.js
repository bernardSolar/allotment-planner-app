import React from 'react';
import styled from 'styled-components';

const CanvasContainer = styled.div`
  width: 100%;
  border: 1px solid #ddd;
  border-radius: var(--border-radius);
  background-color: white;
  overflow: hidden;
  box-shadow: var(--shadow);
  margin-bottom: 20px;
  height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const GardenCanvas = ({ garden }) => {
  return (
    <CanvasContainer id="garden-canvas-container">
      <p>Garden Canvas Placeholder - This will be the interactive garden editor</p>
      <p>{garden ? `Garden ID: ${garden._id}` : 'No garden selected'}</p>
    </CanvasContainer>
  );
};

export default GardenCanvas;
