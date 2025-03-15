import React, { useState, useRef, useEffect } from 'react';
import { Stage, Layer, Rect, Group, Text } from 'react-konva';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { 
  updateElement, 
  setSelectedElement,
  clearSelectedElement 
} from '../../slices/gardenSlice';
import GardenElement from './GardenElement';
import { toast } from 'react-toastify';

const CanvasContainer = styled.div`
  width: 100%;
  border: 1px solid #ddd;
  border-radius: var(--border-radius);
  background-color: white;
  overflow: hidden;
  box-shadow: var(--shadow);
  margin-bottom: 20px;
`;

const ToolbarContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background-color: #f5f5f5;
  border-bottom: 1px solid #ddd;
`;

const ZoomControls = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const ZoomButton = styled.button`
  background-color: var(--primary-color);
  color: white;
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  transition: var(--transition);
  
  &:hover {
    background-color: var(--primary-dark);
  }
  
  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const ZoomText = styled.span`
  font-weight: 500;
`;

const GridSizeControl = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const GardenCanvas = ({ garden, readOnly = false }) => {
  const dispatch = useDispatch();
  const stageRef = useRef(null);
  const selectedElement = useSelector((state) => state.gardens.selectedElement);
  
  // State for the canvas
  const [stageWidth, setStageWidth] = useState(800);
  const [stageHeight, setStageHeight] = useState(600);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [gridSize, setGridSize] = useState(20); // Grid size in pixels
  const [snapToGrid, setSnapToGrid] = useState(true);
  
  // Handle window resize
  useEffect(() => {
    const containerElement = document.getElementById('garden-canvas-container');
    if (containerElement) {
      const updateSize = () => {
        setStageWidth(containerElement.offsetWidth);
        setStageHeight(containerElement.offsetWidth * 0.75); // 4:3 aspect ratio
      };
      
      updateSize();
      window.addEventListener('resize', updateSize);
      
      return () => window.removeEventListener('resize', updateSize);
    }
  }, []);
  
  // Convert garden dimensions to pixels
  const gardenWidthInPixels = garden?.dimensions?.width * gridSize || stageWidth;
  const gardenHeightInPixels = garden?.dimensions?.height * gridSize || stageHeight;
  
  // Handle zooming
  const handleZoomIn = () => {
    setScale(scale * 1.2);
  };
  
  const handleZoomOut = () => {
    if (scale > 0.5) {
      setScale(scale / 1.2);
    }
  };
  
  const handleZoomReset = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };
  
  // Handle element selection
  const handleElementClick = (element) => {
    if (readOnly) return;
    dispatch(setSelectedElement(element));
  };
  
  // Handle element dragging
  const handleElementDragEnd = (element, newPosition) => {
    if (readOnly) return;
    
    // Snap to grid if enabled
    let adjustedX = newPosition.x;
    let adjustedY = newPosition.y;
    
    if (snapToGrid) {
      adjustedX = Math.round(adjustedX / gridSize) * gridSize;
      adjustedY = Math.round(adjustedY / gridSize) * gridSize;
    }
    
    // Make sure elements stay within the garden boundaries
    adjustedX = Math.max(0, Math.min(adjustedX, gardenWidthInPixels - element.dimensions.width * gridSize));
    adjustedY = Math.max(0, Math.min(adjustedY, gardenHeightInPixels - element.dimensions.height * gridSize));
    
    // Update element position
    const updatedElement = {
      ...element,
      position: {
        x: adjustedX / gridSize, // Store in grid units, not pixels
        y: adjustedY / gridSize,
      },
    };
    
    // Dispatch the update
    dispatch(updateElement({
      gardenId: garden._id,
      elementId: element._id,
      elementData: updatedElement,
    }))
      .unwrap()
      .then(() => {
        // Update the selected element to reflect the new position
        dispatch(setSelectedElement(updatedElement));
      })
      .catch((error) => {
        toast.error(`Error updating element: ${error}`);
      });
  };
  
  // Handle stage dragging (panning)
  const handleStageDragStart = () => {
    setIsDragging(true);
    dispatch(clearSelectedElement());
  };
  
  const handleStageDragEnd = (e) => {
    setIsDragging(false);
    setPosition({
      x: e.target.x(),
      y: e.target.y(),
    });
  };
  
  // Toggle grid snap
  const toggleSnapToGrid = () => {
    setSnapToGrid(!snapToGrid);
  };
  
  // Update grid size
  const handleGridSizeChange = (e) => {
    setGridSize(Number(e.target.value));
  };
  
  // Draw the grid
  const renderGrid = () => {
    const gridLines = [];
    const scaledGridSize = gridSize * scale;
    
    // Vertical lines
    for (let x = 0; x <= gardenWidthInPixels; x += gridSize) {
      gridLines.push(
        <Rect
          key={`v-${x}`}
          x={x}
          y={0}
          width={1 / scale}
          height={gardenHeightInPixels}
          fill="#ddd"
          opacity={0.5}
        />
      );
    }
    
    // Horizontal lines
    for (let y = 0; y <= gardenHeightInPixels; y += gridSize) {
      gridLines.push(
        <Rect
          key={`h-${y}`}
          x={0}
          y={y}
          width={gardenWidthInPixels}
          height={1 / scale}
          fill="#ddd"
          opacity={0.5}
        />
      );
    }
    
    return gridLines;
  };
  
  return (
    <>
      <ToolbarContainer>
        <ZoomControls>
          <ZoomButton onClick={handleZoomOut} disabled={scale <= 0.5}>
            -
          </ZoomButton>
          <ZoomText>{Math.round(scale * 100)}%</ZoomText>
          <ZoomButton onClick={handleZoomIn} disabled={scale >= 3}>
            +
          </ZoomButton>
          <ZoomButton onClick={handleZoomReset}>
            ⟲
          </ZoomButton>
        </ZoomControls>
        
        <GridSizeControl>
          <label htmlFor="grid-size">Grid Size:</label>
          <select
            id="grid-size"
            value={gridSize}
            onChange={handleGridSizeChange}
            disabled={readOnly}
          >
            <option value={10}>10cm</option>
            <option value={20}>20cm</option>
            <option value={30}>30cm</option>
            <option value={50}>50cm</option>
            <option value={100}>1m</option>
          </select>
          
          <label>
            <input
              type="checkbox"
              checked={snapToGrid}
              onChange={toggleSnapToGrid}
              disabled={readOnly}
            />
            Snap to Grid
          </label>
        </GridSizeControl>
      </ToolbarContainer>
      
      <CanvasContainer id="garden-canvas-container">
        <Stage
          ref={stageRef}
          width={stageWidth}
          height={stageHeight}
          draggable={!readOnly}
          onDragStart={handleStageDragStart}
          onDragEnd={handleStageDragEnd}
          x={position.x}
          y={position.y}
          scaleX={scale}
          scaleY={scale}
        >
          <Layer>
            {/* Garden boundary */}
            <Rect
              x={0}
              y={0}
              width={gardenWidthInPixels}
              height={gardenHeightInPixels}
              fill="#f0f9e8"
              stroke="#8bc34a"
              strokeWidth={2 / scale}
            />
            
            {/* Grid lines */}
            {renderGrid()}
            
            {/* Garden name label */}
            <Group x={10} y={10}>
              <Text
                text={garden?.name || 'Garden Plan'}
                fontSize={16 / scale}
                fontStyle="bold"
                fill="#388e3c"
                padding={5 / scale}
              />
            </Group>
            
            {/* Garden elements */}
            {garden?.elements && garden.elements.map((element) => (
              <GardenElement
                key={element._id}
                element={element}
                gridSize={gridSize}
                isSelected={selectedElement?._id === element._id}
                onClick={() => handleElementClick(element)}
                onDragEnd={(newPosition) => handleElementDragEnd(element, newPosition)}
                draggable={!readOnly}
                scale={scale}
              />
            ))}
          </Layer>
        </Stage>
      </CanvasContainer>
    </>
  );
};

export default GardenCanvas;
