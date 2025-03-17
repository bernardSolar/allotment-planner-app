/**
 * Component for the garden element palette selection
 */
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { setSelectedElement } from '../../slices/gardenSlice';
import { ELEMENT_CATEGORIES, ELEMENT_DEFINITIONS } from '../../config/elementTypes';
import ElementIcons from './ElementIcons'; // We'll create this next

// Styled components for the palette
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

/**
 * Element palette with categorized garden elements for selection
 * 
 * @param {Object} props - Component props
 * @param {string} props.gardenId - ID of current garden
 * @returns {JSX.Element} - The rendered component
 */
const ElementPalette = ({ gardenId = null }) => {
  const dispatch = useDispatch();
  const [activeCategory, setActiveCategory] = useState(ELEMENT_CATEGORIES.STRUCTURES);
  
  /**
   * Handle element selection from palette
   * @param {Object} element - The element template
   */
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
  
  /**
   * Handle element drag start from palette
   * @param {Object} e - Drag event
   * @param {Object} element - The element template
   */
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
    
    // Store element data in the drag event for the drop target
    e.dataTransfer.setData('application/json', JSON.stringify(newElement));
    
    // Set a custom drag image (optional)
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
  
  /**
   * Render category tabs
   * @returns {Array<JSX.Element>} - Array of tab elements
   */
  const renderCategoryTabs = () => {
    return Object.values(ELEMENT_CATEGORIES).map(category => (
      <CategoryTab 
        key={category}
        active={activeCategory === category} 
        onClick={() => setActiveCategory(category)}
      >
        {category.charAt(0).toUpperCase() + category.slice(1)}
      </CategoryTab>
    ));
  };
  
  /**
   * Render element cards for the active category
   * @returns {Array<JSX.Element>} - Array of element card elements
   */
  const renderElementCards = () => {
    const elements = ELEMENT_DEFINITIONS[activeCategory] || [];
    
    return elements.map((element) => (
      <ElementCard 
        key={element.id}
        draggable="true"
        onDragStart={(e) => handleElementDragStart(e, element)}
        onClick={() => handleElementClick(element)}
      >
        <ElementIcon>
          {ElementIcons[element.id]}
        </ElementIcon>
        <ElementName>{element.name}</ElementName>
      </ElementCard>
    ));
  };
  
  return (
    <PaletteContainer>
      <PaletteHeader>
        <h3>Garden Elements</h3>
      </PaletteHeader>
      
      <CategoryTabs>
        {renderCategoryTabs()}
      </CategoryTabs>
      
      <ElementGrid>
        {renderElementCards()}
      </ElementGrid>
    </PaletteContainer>
  );
};

export default ElementPalette;