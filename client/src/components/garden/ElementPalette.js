import React from 'react';
import styled from 'styled-components';

const PaletteContainer = styled.div`
  background-color: white;
  border: 1px solid #ddd;
  border-radius: var(--border-radius);
  padding: 15px;
  box-shadow: var(--shadow);
  margin-bottom: 20px;
`;

const PaletteHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
`;

const ElementPalette = ({ gardenId }) => {
  return (
    <PaletteContainer>
      <PaletteHeader>
        <h3>Garden Elements</h3>
      </PaletteHeader>
      <p>Element palette will be displayed here. Garden ID: {gardenId}</p>
    </PaletteContainer>
  );
};

export default ElementPalette;
