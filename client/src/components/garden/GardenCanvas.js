import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { Stage, Layer, Rect, Group } from 'react-konva';
import { 
  setSelectedElement, 
  clearSelectedElement,
  addElement, 
  updateElement 
} from '../../slices/gardenSlice';
import GardenElement from './GardenElement';

const CanvasContainer = styled.div`
  width: 100%;
  border: 1px solid #ddd;
  border-radius: var(--border-radius);
  background-color: white;
  overflow: hidden;
  box-shadow: var(--shadow);
  margin-bottom: 20px;
  height: 500px;
  position: relative;
  
  &.drop-active {
    border: 2px dashed var(--primary);
    background-color: rgba(0, 0, 0, 0.02);
  }
`;

const Controls = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  gap: 10px;
  z-index: 10;
`;

const ControlButton = styled.button`
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 5px 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 14px;
  
  &:hover {
    background-color: #f5f5f5;
  }
  
  svg {
    width: 16px;
    height: 16px;
    margin-right: 6px;
  }
`;

const GardenCanvas = ({ garden }) => {
  const dispatch = useDispatch();
  const selectedElement = useSelector((state) => state.gardens.selectedElement);
  const stageRef = useRef(null);
  const containerRef = useRef(null);
  
  // Canvas state
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [gridSize, setGridSize] = useState(30); // Size of each grid cell in pixels
  const [stageSize, setStageSize] = useState({ width: 0, height: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isDropTarget, setIsDropTarget] = useState(false);
  
  // Initialize stage size on mount
  useEffect(() => {
    if (containerRef.current) {
      setStageSize({
        width: containerRef.current.offsetWidth,
        height: containerRef.current.offsetHeight,
      });
    }
  }, []);
  
  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setStageSize({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        });
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Handle drag and drop from palette to canvas
  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDropTarget(true);
  }, []);
  
  const handleDragEnter = useCallback((e) => {
    e.preventDefault();
    setIsDropTarget(true);
  }, []);
  
  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDropTarget(false);
  }, []);
  
  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDropTarget(false);
    
    if (!garden || !garden._id) {
      console.warn('No garden selected. Please select or create a garden first.');
      return;
    }
    
    try {
      // Get element data from the drag event
      const elementData = JSON.parse(e.dataTransfer.getData('application/json'));
      if (!elementData) return;
      
      // Get the drop position relative to the canvas
      const containerRect = containerRef.current.getBoundingClientRect();
      const dropX = e.clientX - containerRect.left;
      const dropY = e.clientY - containerRect.top;
      
      // Convert the drop position to grid position
      const gridX = Math.round((dropX - position.x) / scale / gridSize);
      const gridY = Math.round((dropY - position.y) / scale / gridSize);
      
      // Create a new element with the drop position
      const newElement = {
        ...elementData,
        position: { x: gridX, y: gridY }
      };
      
      // Add element to garden
      dispatch(addElement({
        gardenId: garden._id,
        element: newElement,
      }));
      
      // Clear the selected element to prevent automatic addition
      dispatch(clearSelectedElement());
    } catch (error) {
      console.error('Error processing dropped element:', error);
    }
  }, [garden, position, scale, gridSize, dispatch]);
  
  // Click on empty canvas to clear selection
  const handleStageClick = (e) => {
    // If clicking on empty area (not an element)
    if (e.target === e.currentTarget) {
      dispatch(clearSelectedElement());
    }
  };
  
  // Handle zoom
  const handleWheel = (e) => {
    e.evt.preventDefault();
    
    const scaleBy = 1.1;
    const stage = stageRef.current;
    const oldScale = scale;
    
    const pointerPosition = stage.getPointerPosition();
    const mousePointTo = {
      x: (pointerPosition.x - stage.x()) / oldScale,
      y: (pointerPosition.y - stage.y()) / oldScale,
    };
    
    // Calculate new scale
    const newScale = e.evt.deltaY < 0 ? oldScale * scaleBy : oldScale / scaleBy;
    
    // Limit scale
    const limitedScale = Math.max(0.1, Math.min(5, newScale));
    
    // Set new position
    const newPos = {
      x: pointerPosition.x - mousePointTo.x * limitedScale,
      y: pointerPosition.y - mousePointTo.y * limitedScale,
    };
    
    setScale(limitedScale);
    setPosition(newPos);
  };
  
  // Zoom controls
  const handleZoomIn = () => {
    const newScale = Math.min(5, scale * 1.2);
    setScale(newScale);
  };
  
  const handleZoomOut = () => {
    const newScale = Math.max(0.1, scale / 1.2);
    setScale(newScale);
  };
  
  const handleResetView = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };
  
  // Handle element selection
  const handleElementClick = (element) => {
    dispatch(setSelectedElement(element));
  };
  
  // Handle element position update after drag
  const handleElementDragEnd = (element, newPosition) => {
    // Skip if no garden is selected
    if (!garden || !garden._id) {
      console.warn('No garden selected. Please select or create a garden first.');
      return;
    }
    
    console.log("Canvas received drag end:", element.id, newPosition);
    
    // Allow free positioning (not snapped to grid)
    const newX = newPosition.x;
    const newY = newPosition.y;
    
    // Check for collision with other elements (don't allow overlap)
    const isColliding = garden.elements.some(otherElement => {
      // Skip checking against itself or background
      if (otherElement.id === element.id || otherElement.type === 'background') {
        return false;
      }
      
      // Get other element's position
      let otherX, otherY, otherWidth, otherHeight;
      
      if (otherElement.position) {
        otherX = otherElement.position.x * gridSize;
        otherY = otherElement.position.y * gridSize;
      } else {
        otherX = otherElement.x * gridSize;
        otherY = otherElement.y * gridSize;
      }
      
      if (otherElement.dimensions) {
        otherWidth = otherElement.dimensions.width * gridSize;
        otherHeight = otherElement.dimensions.height * gridSize;
      } else {
        otherWidth = otherElement.width * gridSize;
        otherHeight = otherElement.height * gridSize;
      }
      
      // Get this element's dimensions
      let thisWidth, thisHeight;
      if (element.dimensions) {
        thisWidth = element.dimensions.width * gridSize;
        thisHeight = element.dimensions.height * gridSize;
      } else {
        thisWidth = element.width * gridSize;
        thisHeight = element.height * gridSize;
      }
      
      // Check for overlap
      return (
        newX < otherX + otherWidth &&
        newX + thisWidth > otherX &&
        newY < otherY + otherHeight &&
        newY + thisHeight > otherY
      );
    });
    
    // If colliding, don't update position
    if (isColliding) {
      console.log("Collision detected, preventing overlap");
      return;
    }
    
    // Create a new element with updated position
    const updatedElement = { ...element };
    
    // Convert to grid units for storage
    const gridX = newX / gridSize;
    const gridY = newY / gridSize;
    
    // Update position based on the format used by the element
    if (updatedElement.position) {
      updatedElement.position = { 
        x: gridX, 
        y: gridY 
      };
    } else {
      updatedElement.x = gridX;
      updatedElement.y = gridY;
    }
    
    // Update element in store
    dispatch(updateElement({
      gardenId: garden._id,
      element: updatedElement,
    }));
  };
  
  // Handle element resize
  const handleElementResize = (element, newDimensions) => {
    // Skip if no garden is selected
    if (!garden || !garden._id) {
      console.warn('No garden selected. Please select or create a garden first.');
      return;
    }
    
    // Calculate dimensions in grid units
    const dimensions = {
      width: Math.max(1, Math.round(newDimensions.width)),
      height: Math.max(1, Math.round(newDimensions.height))
    };
    
    // Update element in store with new dimensions
    dispatch(updateElement({
      gardenId: garden._id,
      element: {
        ...element,
        dimensions: dimensions,
      },
    }));
  };
  
  // Add new element from palette to garden
  useEffect(() => {
    if (selectedElement && selectedElement.id && !selectedElement.id.includes('-') && garden && garden._id) {
      // This is a new element from the palette
      // Add to garden with initial position at center of visible area
      const centerX = Math.round((stageSize.width / 2 - position.x) / scale / gridSize);
      const centerY = Math.round((stageSize.height / 2 - position.y) / scale / gridSize);
      
      const newElement = {
        ...selectedElement,
        id: `${selectedElement.id}-${Date.now()}`,
      };
      
      // Use the correct format for position
      if (selectedElement.position) {
        newElement.position = { x: centerX, y: centerY };
      } else {
        newElement.x = centerX;
        newElement.y = centerY;
      }
      
      dispatch(addElement({
        gardenId: garden._id,
        element: newElement,
      }));
    }
  }, [selectedElement, garden, dispatch, position, scale, gridSize, stageSize]);
  
  // Render garden grid
  const renderGrid = () => {
    const gridLines = [];
    const width = garden?.dimensions?.width || 1000;
    const height = garden?.dimensions?.height || 600;
    
    // Vertical lines
    for (let i = 0; i <= width; i += gridSize) {
      gridLines.push(
        <Rect
          key={`v-${i}`}
          x={i}
          y={0}
          width={1 / scale}
          height={height}
          fill="rgba(0, 0, 0, 0.1)"
        />
      );
    }
    
    // Horizontal lines
    for (let i = 0; i <= height; i += gridSize) {
      gridLines.push(
        <Rect
          key={`h-${i}`}
          x={0}
          y={i}
          width={width}
          height={1 / scale}
          fill="rgba(0, 0, 0, 0.1)"
        />
      );
    }
    
    return (
      <Group opacity={0.5}>
        {gridLines}
      </Group>
    );
  };
  
  if (!garden) {
    return (
      <CanvasContainer
        id="garden-canvas-container"
        ref={containerRef}
      >
        <p>No garden selected</p>
      </CanvasContainer>
    );
  }
  
  return (
    <CanvasContainer
      id="garden-canvas-container"
      ref={containerRef}
      className={isDropTarget ? 'drop-active' : ''}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {isDropTarget && (
        <div 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
          }}
        >
          <div
            style={{
              padding: '10px 20px',
              backgroundColor: 'rgba(255,255,255,0.8)',
              borderRadius: '4px',
              border: '1px solid var(--primary)',
              fontSize: '14px',
              color: 'var(--primary)',
            }}
          >
            Drop element here
          </div>
        </div>
      )}
      
      <Controls>
        <ControlButton onClick={handleZoomIn}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="16" />
            <line x1="8" y1="12" x2="16" y2="12" />
          </svg>
          Zoom In
        </ControlButton>
        <ControlButton onClick={handleZoomOut}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="8" y1="12" x2="16" y2="12" />
          </svg>
          Zoom Out
        </ControlButton>
        <ControlButton onClick={handleResetView}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 12h18M12 3v18" />
          </svg>
          Reset View
        </ControlButton>
      </Controls>
      
      <Stage
        ref={stageRef}
        width={stageSize.width}
        height={stageSize.height}
        draggable={!selectedElement} // Only allow canvas panning when no element is selected
        x={position.x}
        y={position.y}
        scaleX={scale}
        scaleY={scale}
        onWheel={handleWheel}
        onClick={handleStageClick}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={(e) => {
          setPosition({ x: e.target.x(), y: e.target.y() });
          setIsDragging(false);
        }}
      >
        <Layer>
          {/* Background */}
          <Rect
            x={0}
            y={0}
            width={garden.dimensions.width}
            height={garden.dimensions.height}
            fill="#8FBC8F"
          />
          
          {/* Grid lines */}
          {renderGrid()}
          
          {/* Garden elements */}
          {garden.elements && garden.elements.map((element) => (
            element.type !== 'background' && (
              <GardenElement
                key={element.id}
                element={element}
                gridSize={gridSize}
                isSelected={selectedElement?.id === element.id}
                onClick={() => handleElementClick(element)}
                onDragEnd={(newPosition) => {
                  console.log("Element dragged:", element.id, newPosition);
                  handleElementDragEnd(element, newPosition);
                }}
                draggable={!isDragging}
                scale={scale}
              />
            )
          ))}
        </Layer>
      </Stage>
    </CanvasContainer>
  );
};

export default GardenCanvas;
