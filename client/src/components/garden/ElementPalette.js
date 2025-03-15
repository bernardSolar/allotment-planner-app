import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { FiGrid, FiLayers, FiMapPin, FiMap, FiTrash2 } from 'react-icons/fi';
import { GiPlantSeed, GiTree, GiPoisonTree, GiGreenhouse, GiWateringCan } from 'react-icons/gi';
import { addElement, deleteElement } from '../../slices/gardenSlice';
import { toast } from 'react-toastify';

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
  overflow-x: auto;
  padding-bottom: 5px;
  margin-bottom: 15px;
`;

const CategoryTab = styled.button`
  background-color: ${({ active }) => (active ? 'var(--primary-color)' : '#f5f5f5')};
  color: ${({ active }) => (active ? 'white' : 'var(--text-color)')};
  border: 1px solid #ddd;
  border-radius: var(--border-radius);
  padding: 8px 12px;
  cursor: pointer;
  transition: var(--transition);
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
  white-space: nowrap;
  
  &:hover {
    background-color: ${({ active }) => (active ? 'var(--primary-dark)' : '#e0e0e0')};
  }
`;

const ElementsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 10px;
`;

const ElementItem = styled.div`
  border: 1px solid #ddd;
  border-radius: var(--border-radius);
  padding: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: grab;
  transition: var(--transition);
  background-color: white;
  
  &:hover {
    border-color: var(--primary-color);
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  }
`;

const ElementIcon = styled.div`
  font-size: 2rem;
  margin-bottom: 5px;
  color: ${({ color }) => color};
`;

const ElementName = styled.div`
  font-size: 0.9rem;
  text-align: center;
  color: var(--text-color);
`;

const DeleteButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: #f44336;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: var(--border-radius);
  cursor: pointer;
  transition: var(--transition);
  
  &:hover {
    background-color: #d32f2f;
  }
  
  &:disabled {
    background-color: #bdbdbd;
    cursor: not-allowed;
  }
`;

const ElementPalette = ({ gardenId }) => {
  const dispatch = useDispatch();
  const [activeCategory, setActiveCategory] = useState('structures');
  const selectedElement = useSelector((state) => state.gardens.selectedElement);
  
  // Define element categories and their items
  const elementCategories = {
    structures: [
      { type: 'raisedBed', name: 'Raised Bed (1x1m)', width: 1, height: 1, color: '#8D6E63', icon: <FiGrid /> },
      { type: 'raisedBed', name: 'Raised Bed (2x1m)', width: 2, height: 1, color: '#8D6E63', icon: <FiGrid /> },
      { type: 'raisedBed', name: 'Raised Bed (3x1m)', width: 3, height: 1, color: '#8D6E63', icon: <FiGrid /> },
      { type: 'flatBed', name: 'Flat Bed (2x2m)', width: 2, height: 2, color: '#A5D6A7', icon: <FiLayers /> },
      { type: 'flatBed', name: 'Flat Bed (3x3m)', width: 3, height: 3, color: '#A5D6A7', icon: <FiLayers /> },
      { type: 'path', name: 'Path (1x2m)', width: 1, height: 2, color: '#E0E0E0', icon: <FiMapPin /> },
      { type: 'structure', name: 'Greenhouse', width: 2, height: 3, color: '#90A4AE', icon: <GiGreenhouse /> },
      { type: 'structure', name: 'Shed', width: 2, height: 2, color: '#795548', icon: <FiMap /> },
      { type: 'structure', name: 'Compost Bin', width: 1, height: 1, color: '#5D4037', icon: <GiWateringCan /> },
    ],
    plants: [
      { type: 'plant', name: 'Tomato', width: 0.5, height: 0.5, color: '#F44336', icon: <GiPlantSeed /> },
      { type: 'plant', name: 'Carrot', width: 0.3, height: 0.3, color: '#FF9800', icon: <GiPlantSeed /> },
      { type: 'plant', name: 'Lettuce', width: 0.4, height: 0.4, color: '#8BC34A', icon: <GiPlantSeed /> },
      { type: 'plant', name: 'Potato', width: 0.5, height: 0.5, color: '#795548', icon: <GiPlantSeed /> },
      { type: 'plant', name: 'Cucumber', width: 0.5, height: 0.5, color: '#4CAF50', icon: <GiPlantSeed /> },
      { type: 'plant', name: 'Peas', width: 0.3, height: 0.3, color: '#8BC34A', icon: <GiPlantSeed /> },
      { type: 'plant', name: 'Beans', width: 0.3, height: 0.3, color: '#33691E', icon: <GiPlantSeed /> },
      { type: 'plant', name: 'Corn', width: 0.5, height: 0.5, color: '#FFEB3B', icon: <GiPlantSeed /> },
      { type: 'plant', name: 'Onion', width: 0.3, height: 0.3, color: '#BDBDBD', icon: <GiPlantSeed /> },
    ],
    trees: [
      { type: 'tree', name: 'Apple Tree', width: 3, height: 3, color: '#43A047', icon: <GiTree /> },
      { type: 'tree', name: 'Pear Tree', width: 3, height: 3, color: '#43A047', icon: <GiTree /> },
      { type: 'tree', name: 'Plum Tree', width: 2.5, height: 2.5, color: '#43A047', icon: <GiTree /> },
      { type: 'tree', name: 'Cherry Tree', width: 2.5, height: 2.5, color: '#43A047', icon: <GiTree /> },
      { type: 'bush', name: 'Blueberry Bush', width: 1, height: 1, color: '#66BB6A', icon: <GiPoisonTree /> },
      { type: 'bush', name: 'Raspberry Bush', width: 1, height: 1, color: '#66BB6A', icon: <GiPoisonTree /> },
      { type: 'bush', name: 'Gooseberry Bush', width: 0.8, height: 0.8, color: '#66BB6A', icon: <GiPoisonTree /> },
      { type: 'bush', name: 'Blackberry Bush', width: 1, height: 1, color: '#66BB6A', icon: <GiPoisonTree /> },
    ],
  };

  // Handle category change
  const handleCategoryChange = (category) => {
    setActiveCategory(category);
  };

  // Handle element drag start
  const handleDragStart = (e, element) => {
    // Set the drag data
    e.dataTransfer.setData('application/json', JSON.stringify(element));
    e.dataTransfer.effectAllowed = 'copy';
  };

  // Handle element deletion
  const handleDeleteSelected = () => {
    if (!selectedElement) return;
    
    dispatch(deleteElement({
      gardenId,
      elementId: selectedElement._id,
    }))
      .unwrap()
      .then(() => {
        toast.success('Element deleted successfully');
      })
      .catch((error) => {
        toast.error(`Error deleting element: ${error}`);
      });
  };

  return (
    <PaletteContainer>
      <PaletteHeader>
        <h3>Garden Elements</h3>
        <DeleteButton 
          onClick={handleDeleteSelected}
          disabled={!selectedElement}
        >
          <FiTrash2 /> Delete Selected
        </DeleteButton>
      </PaletteHeader>
      
      <CategoryTabs>
        <CategoryTab
          active={activeCategory === 'structures'}
          onClick={() => handleCategoryChange('structures')}
        >
          <FiGrid /> Structures
        </CategoryTab>
        <CategoryTab
          active={activeCategory === 'plants'}
          onClick={() => handleCategoryChange('plants')}
        >
          <GiPlantSeed /> Plants
        </CategoryTab>
        <CategoryTab
          active={activeCategory === 'trees'}
          onClick={() => handleCategoryChange('trees')}
        >
          <GiTree /> Trees & Bushes
        </CategoryTab>
      </CategoryTabs>
      
      <ElementsGrid>
        {elementCategories[activeCategory].map((element, index) => (
          <ElementItem
            key={`${element.type}-${index}`}
            draggable
            onDragStart={(e) => handleDragStart(e, element)}
          >
            <ElementIcon color={element.color}>{element.icon}</ElementIcon>
            <ElementName>{element.name}</ElementName>
          </ElementItem>
        ))}
      </ElementsGrid>
    </PaletteContainer>
  );
};

export default ElementPalette;
