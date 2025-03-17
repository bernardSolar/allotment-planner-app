import React, { useState } from 'react';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import { setSelectedElement } from '../../slices/gardenSlice';

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

const CategoryTabs = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
`;

const CategoryTab = styled.button`
  background-color: ${props => props.active ? 'var(--primary)' : '#f5f5f5'};
  color: ${props => props.active ? 'white' : 'var(--text)'};
  border: 1px solid ${props => props.active ? 'var(--primary)' : '#ddd'};
  border-radius: 4px;
  padding: 8px 16px;
  cursor: pointer;
  font-size: 14px;
  font-weight: ${props => props.active ? 'bold' : 'normal'};
  
  &:hover {
    background-color: ${props => props.active ? 'var(--primary-dark)' : '#e0e0e0'};
  }
`;

const ElementGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 10px;
  max-height: 280px;
  overflow-y: auto;
  padding: 5px;
`;

const ElementCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #f9f9f9;
  border: 1px solid #eee;
  border-radius: 4px;
  padding: 10px;
  cursor: grab;
  transition: all 0.2s;
  
  &:hover {
    background-color: #f0f0f0;
    transform: translateY(-2px);
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  }
  
  &:active {
    cursor: grabbing;
    transform: scale(0.95);
  }
`;

const ElementIcon = styled.div`
  width: 60px;
  height: 60px;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  svg {
    width: 100%;
    height: 100%;
  }
`;

const ElementName = styled.span`
  font-size: 12px;
  text-align: center;
  color: var(--text);
`;

// SVG icons for each element type
const ElementIcons = {
  raisedBed: (
    <svg viewBox="0 0 100 100">
      <rect x="10" y="10" width="80" height="80" fill="#8D6E63" stroke="#5D4037" strokeWidth="2" />
      <rect x="15" y="15" width="70" height="70" fill="#A1887F" stroke="#5D4037" strokeWidth="1" />
    </svg>
  ),
  flatBed: (
    <svg viewBox="0 0 100 100">
      <rect x="10" y="40" width="80" height="20" fill="#A5D6A7" stroke="#4CAF50" strokeWidth="2" />
    </svg>
  ),
  path: (
    <svg viewBox="0 0 100 100">
      <rect x="10" y="40" width="80" height="20" fill="#E0E0E0" stroke="#9E9E9E" strokeWidth="2" />
      <line x1="20" y1="50" x2="80" y2="50" stroke="#BDBDBD" strokeWidth="2" strokeDasharray="5,5" />
    </svg>
  ),
  fence: (
    <svg viewBox="0 0 100 100">
      <line x1="20" y1="30" x2="20" y2="70" stroke="#795548" strokeWidth="4" />
      <line x1="40" y1="30" x2="40" y2="70" stroke="#795548" strokeWidth="4" />
      <line x1="60" y1="30" x2="60" y2="70" stroke="#795548" strokeWidth="4" />
      <line x1="80" y1="30" x2="80" y2="70" stroke="#795548" strokeWidth="4" />
      <line x1="10" y1="40" x2="90" y2="40" stroke="#795548" strokeWidth="4" />
      <line x1="10" y1="60" x2="90" y2="60" stroke="#795548" strokeWidth="4" />
    </svg>
  ),
  shed: (
    <svg viewBox="0 0 100 100">
      <polygon points="50,20 80,40 80,80 20,80 20,40" fill="#90A4AE" stroke="#607D8B" strokeWidth="2" />
      <rect x="45" y="60" width="15" height="20" fill="#5D4037" stroke="#3E2723" strokeWidth="1" />
      <rect x="30" y="50" width="10" height="10" fill="#BBDEFB" stroke="#2196F3" strokeWidth="1" />
      <rect x="65" y="50" width="10" height="10" fill="#BBDEFB" stroke="#2196F3" strokeWidth="1" />
    </svg>
  ),
  tomato: (
    <svg viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="30" fill="#F44336" stroke="#D32F2F" strokeWidth="2" />
      <path d="M50,20 L50,35" stroke="#4CAF50" strokeWidth="3" />
      <path d="M50,35 C40,25 30,35 30,45" stroke="#4CAF50" strokeWidth="2" />
      <path d="M50,35 C60,25 70,35 70,45" stroke="#4CAF50" strokeWidth="2" />
    </svg>
  ),
  carrot: (
    <svg viewBox="0 0 100 100">
      <path d="M50,25 L60,40 Q65,70 50,85 Q35,70 40,40 Z" fill="#FF9800" stroke="#E65100" strokeWidth="2" />
      <path d="M50,20 L45,5 M50,20 L55,8 M50,20 L60,15" stroke="#4CAF50" strokeWidth="2" />
    </svg>
  ),
  lettuce: (
    <svg viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="30" fill="#8BC34A" stroke="#689F38" strokeWidth="2" />
      <path d="M30,40 Q50,35 70,40" stroke="#689F38" strokeWidth="2" fill="none" />
      <path d="M30,50 Q50,45 70,50" stroke="#689F38" strokeWidth="2" fill="none" />
      <path d="M30,60 Q50,55 70,60" stroke="#689F38" strokeWidth="2" fill="none" />
    </svg>
  ),
  appleTree: (
    <svg viewBox="0 0 100 100">
      <rect x="45" y="50" width="10" height="30" fill="#795548" stroke="#5D4037" strokeWidth="2" />
      <circle cx="50" cy="40" r="25" fill="#4CAF50" stroke="#388E3C" strokeWidth="2" />
      <circle cx="40" cy="35" r="5" fill="#F44336" stroke="#D32F2F" strokeWidth="1" />
      <circle cx="60" cy="35" r="5" fill="#F44336" stroke="#D32F2F" strokeWidth="1" />
      <circle cx="50" cy="55" r="5" fill="#F44336" stroke="#D32F2F" strokeWidth="1" />
    </svg>
  ),
  cherryTree: (
    <svg viewBox="0 0 100 100">
      <rect x="45" y="50" width="10" height="30" fill="#795548" stroke="#5D4037" strokeWidth="2" />
      <circle cx="50" cy="40" r="25" fill="#4CAF50" stroke="#388E3C" strokeWidth="2" />
      <circle cx="40" cy="30" r="4" fill="#E91E63" stroke="#C2185B" strokeWidth="1" />
      <circle cx="55" cy="25" r="4" fill="#E91E63" stroke="#C2185B" strokeWidth="1" />
      <circle cx="60" cy="40" r="4" fill="#E91E63" stroke="#C2185B" strokeWidth="1" />
      <circle cx="45" cy="45" r="4" fill="#E91E63" stroke="#C2185B" strokeWidth="1" />
    </svg>
  ),
  bush: (
    <svg viewBox="0 0 100 100">
      <ellipse cx="50" cy="60" rx="30" ry="25" fill="#66BB6A" stroke="#388E3C" strokeWidth="2" />
      <circle cx="40" cy="50" r="10" fill="#7CB342" stroke="#558B2F" strokeWidth="1" />
      <circle cx="60" cy="55" r="12" fill="#7CB342" stroke="#558B2F" strokeWidth="1" />
      <circle cx="50" cy="70" r="8" fill="#7CB342" stroke="#558B2F" strokeWidth="1" />
    </svg>
  ),
  bench: (
    <svg viewBox="0 0 100 100">
      <rect x="20" y="40" width="60" height="10" fill="#A1887F" stroke="#795548" strokeWidth="2" />
      <rect x="25" y="50" width="5" height="20" fill="#8D6E63" stroke="#5D4037" strokeWidth="1" />
      <rect x="70" y="50" width="5" height="20" fill="#8D6E63" stroke="#5D4037" strokeWidth="1" />
    </svg>
  ),
  pond: (
    <svg viewBox="0 0 100 100">
      <ellipse cx="50" cy="50" rx="30" ry="20" fill="#90CAF9" stroke="#2196F3" strokeWidth="2" />
      <path d="M40,45 Q45,40 50,45 Q55,50 60,45" fill="none" stroke="#64B5F6" strokeWidth="1" />
    </svg>
  )
};

// Define element categories and their items
const elementCategories = {
  structures: [
    { id: 'raisedBed', name: 'Raised Bed', type: 'raisedBed', dimensions: { width: 3, height: 2 } },
    { id: 'flatBed', name: 'Flat Bed', type: 'flatBed', dimensions: { width: 4, height: 2 } },
    { id: 'path', name: 'Path', type: 'path', dimensions: { width: 1, height: 3 } },
    { id: 'fence', name: 'Fence', type: 'fence', dimensions: { width: 5, height: 1 } },
    { id: 'shed', name: 'Shed', type: 'shed', dimensions: { width: 2, height: 2 } }
  ],
  plants: [
    { id: 'tomato', name: 'Tomato', type: 'plant', dimensions: { width: 1, height: 1 } },
    { id: 'carrot', name: 'Carrot', type: 'plant', dimensions: { width: 1, height: 1 } },
    { id: 'lettuce', name: 'Lettuce', type: 'plant', dimensions: { width: 1, height: 1 } }
  ],
  trees: [
    { id: 'appleTree', name: 'Apple Tree', type: 'tree', dimensions: { width: 3, height: 3 } },
    { id: 'cherryTree', name: 'Cherry Tree', type: 'tree', dimensions: { width: 3, height: 3 } },
    { id: 'bush', name: 'Bush', type: 'bush', dimensions: { width: 2, height: 2 } }
  ],
  decorative: [
    { id: 'bench', name: 'Bench', type: 'structure', dimensions: { width: 2, height: 1 } },
    { id: 'pond', name: 'Pond', type: 'structure', dimensions: { width: 3, height: 2 } }
  ]
};

const ElementPalette = ({ gardenId = null }) => {
  const dispatch = useDispatch();
  const [activeCategory, setActiveCategory] = useState('structures');
  const [draggedElement, setDraggedElement] = useState(null);
  
  // Handle element selection and preparation for drag
  const handleElementDragStart = (e, element) => {
    // Skip if no garden is selected
    if (!gardenId) {
      console.warn('No garden selected. Please select or create a garden first.');
      return;
    }
    
    // Create a new element based on the template
    const newElement = {
      ...element,
      id: `${element.id}-${Date.now()}`,
      position: { x: 0, y: 0 }, // Default position, will be updated when placed
      name: element.name
    };
    
    // Set the element being dragged
    setDraggedElement(newElement);
    
    // Store element data in the drag event for the drop target
    e.dataTransfer.setData('application/json', JSON.stringify(newElement));
    
    // Set a custom drag image (optional - could be improved)
    const dragImage = document.createElement('div');
    dragImage.style.width = '60px';
    dragImage.style.height = '60px';
    dragImage.style.backgroundImage = 'url(data:image/svg+xml;base64,' + btoa('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50"><circle cx="25" cy="25" r="20" fill="#4CAF50"/></svg>') + ')';
    dragImage.style.position = 'absolute';
    dragImage.style.top = '-1000px';
    document.body.appendChild(dragImage);
    
    try {
      e.dataTransfer.setDragImage(dragImage, 30, 30);
    } catch (err) {
      console.warn('Error setting drag image:', err);
    }
    
    // Notify the Redux store that an element is being dragged
    dispatch(setSelectedElement(newElement));
  };
  
  const handleElementDragEnd = () => {
    setDraggedElement(null);
    // We don't clear selectedElement here because the canvas needs it for placement
  };
  
  // Handle click as well for mobile or touch devices without drag events
  const handleElementClick = (element) => {
    // Skip if no garden is selected
    if (!gardenId) {
      console.warn('No garden selected. Please select or create a garden first.');
      return;
    }
    
    // Create a new element based on the template
    const newElement = {
      ...element,
      id: `${element.id}-${Date.now()}`,
      position: { x: 0, y: 0 }, // Default position, will be updated when placed
      name: element.name
    };
    
    dispatch(setSelectedElement(newElement));
  };
  
  return (
    <PaletteContainer>
      <PaletteHeader>
        <h3>Garden Elements</h3>
      </PaletteHeader>
      
      <CategoryTabs>
        <CategoryTab 
          active={activeCategory === 'structures'} 
          onClick={() => setActiveCategory('structures')}
        >
          Structures
        </CategoryTab>
        <CategoryTab 
          active={activeCategory === 'plants'} 
          onClick={() => setActiveCategory('plants')}
        >
          Plants
        </CategoryTab>
        <CategoryTab 
          active={activeCategory === 'trees'} 
          onClick={() => setActiveCategory('trees')}
        >
          Trees
        </CategoryTab>
        <CategoryTab 
          active={activeCategory === 'decorative'} 
          onClick={() => setActiveCategory('decorative')}
        >
          Decorative
        </CategoryTab>
      </CategoryTabs>
      
      <ElementGrid>
        {elementCategories[activeCategory].map((element) => (
          <ElementCard 
            key={element.id}
            draggable="true"
            onDragStart={(e) => handleElementDragStart(e, element)}
            onDragEnd={handleElementDragEnd}
            onClick={() => handleElementClick(element)}
          >
            <ElementIcon>
              {ElementIcons[element.id]}
            </ElementIcon>
            <ElementName>{element.name}</ElementName>
          </ElementCard>
        ))}
      </ElementGrid>
    </PaletteContainer>
  );
};

export default ElementPalette;
