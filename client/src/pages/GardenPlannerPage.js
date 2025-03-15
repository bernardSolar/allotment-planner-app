import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FiPlus, FiEdit2, FiSave, FiTrash2, FiInfo } from 'react-icons/fi';
import { 
  getUserGardens, 
  createGarden, 
  getGardenDetails, 
  updateGarden, 
  deleteGarden,
  addElement
} from '../slices/gardenSlice';
import GardenCanvas from '../components/garden/GardenCanvas';
import ElementPalette from '../components/garden/ElementPalette';
import { toast } from 'react-toastify';

const PageContainer = styled.div`
  padding: 20px;
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }
`;

const Title = styled.h1`
  font-size: 2rem;
  color: var(--primary-dark);
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  
  @media (max-width: 576px) {
    flex-wrap: wrap;
  }
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 8px 15px;
  border-radius: var(--border-radius);
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition);
  border: none;
  
  &.primary {
    background-color: var(--primary-color);
    color: white;
    
    &:hover {
      background-color: var(--primary-dark);
    }
  }
  
  &.secondary {
    background-color: var(--secondary-color);
    color: white;
    
    &:hover {
      background-color: var(--secondary-dark);
    }
  }
  
  &.danger {
    background-color: #f44336;
    color: white;
    
    &:hover {
      background-color: #d32f2f;
    }
  }
  
  &:disabled {
    background-color: #bdbdbd;
    cursor: not-allowed;
  }
`;

const GardensGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const GardenCard = styled.div`
  background-color: white;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
  overflow: hidden;
  transition: var(--transition);
  cursor: pointer;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
  }
  
  &.active {
    border: 2px solid var(--primary-color);
    transform: translateY(-5px);
  }
`;

const GardenPreview = styled.div`
  height: 160px;
  background-color: #f0f9e8;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-light);
  font-size: 0.9rem;
`;

const GardenCardContent = styled.div`
  padding: 15px;
`;

const GardenCardTitle = styled.h3`
  margin: 0 0 5px;
  font-size: 1.2rem;
  color: var(--text-color);
`;

const GardenCardInfo = styled.div`
  display: flex;
  justify-content: space-between;
  color: var(--text-light);
  font-size: 0.9rem;
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: white;
  border-radius: var(--border-radius);
  width: 100%;
  max-width: 500px;
  padding: 20px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
`;

const ModalTitle = styled.h2`
  margin: 0;
  font-size: 1.5rem;
  color: var(--text-color);
`;

const ModalCloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: var(--text-light);
  transition: var(--transition);
  
  &:hover {
    color: var(--text-color);
  }
`;

const Form = styled.form`
  .form-group + .form-group {
    margin-top: 15px;
  }
`;

const MainContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 20px;
  
  @media (max-width: 992px) {
    grid-template-columns: 1fr;
  }
`;

const ElementInfo = styled.div`
  background-color: white;
  border-radius: var(--border-radius);
  padding: 15px;
  box-shadow: var(--shadow);
  margin-bottom: 20px;
`;

const ElementInfoHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
`;

const ElementInfoTitle = styled.h3`
  margin: 0;
  font-size: 1.2rem;
  color: var(--text-color);
`;

const ElementInfoContent = styled.div`
  .form-group + .form-group {
    margin-top: 15px;
  }
`;

const GardenPlannerPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { gardens, gardenDetails, selectedElement, loading, error } = useSelector((state) => state.gardens);
  
  // State for modals and form
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [newGardenData, setNewGardenData] = useState({
    name: '',
    description: '',
    dimensions: { width: 10, height: 8, unit: 'meters' },
    location: '',
  });
  
  // State for the selected garden
  const [selectedGarden, setSelectedGarden] = useState(null);
  
  // Load user's gardens on component mount
  useEffect(() => {
    dispatch(getUserGardens());
  }, [dispatch]);
  
  // Load garden details when a garden is selected
  useEffect(() => {
    if (selectedGarden) {
      dispatch(getGardenDetails(selectedGarden._id));
    }
  }, [dispatch, selectedGarden]);
  
  // Handle creating a new garden
  const handleCreateGarden = (e) => {
    e.preventDefault();
    
    dispatch(createGarden(newGardenData))
      .unwrap()
      .then((garden) => {
        setShowCreateModal(false);
        setNewGardenData({
          name: '',
          description: '',
          dimensions: { width: 10, height: 8, unit: 'meters' },
          location: '',
        });
        setSelectedGarden(garden);
        toast.success('Garden created successfully');
      })
      .catch((error) => {
        toast.error(`Error creating garden: ${error}`);
      });
  };
  
  // Handle editing a garden
  const handleEditGarden = (e) => {
    e.preventDefault();
    
    if (!selectedGarden) return;
    
    dispatch(updateGarden({
      id: selectedGarden._id,
      gardenData: newGardenData,
    }))
      .unwrap()
      .then((garden) => {
        setShowEditModal(false);
        setSelectedGarden(garden);
        toast.success('Garden updated successfully');
      })
      .catch((error) => {
        toast.error(`Error updating garden: ${error}`);
      });
  };
  
  // Handle deleting a garden
  const handleDeleteGarden = () => {
    if (!selectedGarden) return;
    
    dispatch(deleteGarden(selectedGarden._id))
      .unwrap()
      .then(() => {
        setShowDeleteModal(false);
        setSelectedGarden(null);
        toast.success('Garden deleted successfully');
      })
      .catch((error) => {
        toast.error(`Error deleting garden: ${error}`);
      });
  };
  
  // Handle selecting a garden
  const handleSelectGarden = (garden) => {
    setSelectedGarden(garden);
  };
  
  // Handle drag and drop for adding new elements
  const handleDrop = (e) => {
    e.preventDefault();
    
    try {
      // Get the element data from the drag event
      const elementData = JSON.parse(e.dataTransfer.getData('application/json'));
      
      // Get the drop position on the canvas
      const canvasRect = document.getElementById('garden-canvas-container').getBoundingClientRect();
      const x = (e.clientX - canvasRect.left) / 20; // Assuming gridSize is 20
      const y = (e.clientY - canvasRect.top) / 20;
      
      // Create the new element
      const newElement = {
        type: elementData.type,
        name: elementData.name,
        position: { x, y },
        dimensions: { 
          width: elementData.width, 
          height: elementData.height,
          rotation: 0
        },
        color: elementData.color,
      };
      
      // Add the element to the garden
      dispatch(addElement({
        gardenId: selectedGarden._id,
        elementData: newElement,
      }))
        .unwrap()
        .then(() => {
          toast.success('Element added to garden');
        })
        .catch((error) => {
          toast.error(`Error adding element: ${error}`);
        });
    } catch (error) {
      console.error('Error handling drop:', error);
    }
  };
  
  // Handle drag over
  const handleDragOver = (e) => {
    e.preventDefault();
  };
  
  // Open edit modal with current garden data
  const openEditModal = () => {
    if (!selectedGarden) return;
    
    setNewGardenData({
      name: selectedGarden.name,
      description: selectedGarden.description || '',
      dimensions: selectedGarden.dimensions,
      location: selectedGarden.location || '',
    });
    
    setShowEditModal(true);
  };
  
  // If the user has no gardens, show a welcome message
  if (gardens.length === 0 && !loading) {
    return (
      <PageContainer>
        <PageHeader>
          <Title>Garden Planner</Title>
          <Button className="primary" onClick={() => setShowCreateModal(true)}>
            <FiPlus /> Create Your First Garden
          </Button>
        </PageHeader>
        
        <div className="card">
          <div className="card-body text-center">
            <FiInfo size={50} style={{ color: 'var(--primary-color)', marginBottom: '20px' }} />
            <h2>Welcome to the Garden Planner!</h2>
            <p>
              Get started by creating your first garden. You'll be able to design your layout,
              add plants, and track your growing progress.
            </p>
            <Button className="primary" onClick={() => setShowCreateModal(true)}>
              <FiPlus /> Create Garden
            </Button>
          </div>
        </div>
        
        {/* Create Garden Modal */}
        {showCreateModal && (
          <ModalOverlay>
            <ModalContent>
              <ModalHeader>
                <ModalTitle>Create New Garden</ModalTitle>
                <ModalCloseButton onClick={() => setShowCreateModal(false)}>×</ModalCloseButton>
              </ModalHeader>
              
              <Form onSubmit={handleCreateGarden}>
                <div className="form-group">
                  <label htmlFor="name">Garden Name</label>
                  <input
                    type="text"
                    id="name"
                    className="form-control"
                    value={newGardenData.name}
                    onChange={(e) => setNewGardenData({ ...newGardenData, name: e.target.value })}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="description">Description (Optional)</label>
                  <textarea
                    id="description"
                    className="form-control"
                    value={newGardenData.description}
                    onChange={(e) => setNewGardenData({ ...newGardenData, description: e.target.value })}
                    rows="3"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="location">Location (Optional)</label>
                  <input
                    type="text"
                    id="location"
                    className="form-control"
                    value={newGardenData.location}
                    onChange={(e) => setNewGardenData({ ...newGardenData, location: e.target.value })}
                    placeholder="E.g., Backyard, Allotment Plot 12"
                  />
                </div>
                
                <div className="grid">
                  <div className="col-6">
                    <div className="form-group">
                      <label htmlFor="width">Width</label>
                      <input
                        type="number"
                        id="width"
                        className="form-control"
                        value={newGardenData.dimensions.width}
                        onChange={(e) => setNewGardenData({
                          ...newGardenData,
                          dimensions: { ...newGardenData.dimensions, width: Number(e.target.value) }
                        })}
                        min="1"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="col-6">
                    <div className="form-group">
                      <label htmlFor="height">Height</label>
                      <input
                        type="number"
                        id="height"
                        className="form-control"
                        value={newGardenData.dimensions.height}
                        onChange={(e) => setNewGardenData({
                          ...newGardenData,
                          dimensions: { ...newGardenData.dimensions, height: Number(e.target.value) }
                        })}
                        min="1"
                        required
                      />
                    </div>
                  </div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="unit">Unit</label>
                  <select
                    id="unit"
                    className="form-control"
                    value={newGardenData.dimensions.unit}
                    onChange={(e) => setNewGardenData({
                      ...newGardenData,
                      dimensions: { ...newGardenData.dimensions, unit: e.target.value }
                    })}
                  >
                    <option value="meters">Meters</option>
                    <option value="feet">Feet</option>
                  </select>
                </div>
                
                <div className="form-group mt-4">
                  <Button type="submit" className="primary" disabled={loading}>
                    <FiPlus /> Create Garden
                  </Button>
                </div>
              </Form>
            </ModalContent>
          </ModalOverlay>
        )}
      </PageContainer>
    );
  }
  
  return (
    <PageContainer>
      <PageHeader>
        <Title>Garden Planner</Title>
        <ButtonGroup>
          <Button className="primary" onClick={() => setShowCreateModal(true)}>
            <FiPlus /> New Garden
          </Button>
          {selectedGarden && (
            <>
              <Button className="secondary" onClick={openEditModal}>
                <FiEdit2 /> Edit Garden
              </Button>
              <Button className="danger" onClick={() => setShowDeleteModal(true)}>
                <FiTrash2 /> Delete
              </Button>
            </>
          )}
        </ButtonGroup>
      </PageHeader>
      
      {/* Gardens Grid */}
      <GardensGrid>
        {gardens.map((garden) => (
          <GardenCard
            key={garden._id}
            className={selectedGarden?._id === garden._id ? 'active' : ''}
            onClick={() => handleSelectGarden(garden)}
          >
            <GardenPreview>
              {/* Could add a simple SVG preview of the garden here */}
              Garden Preview
            </GardenPreview>
            <GardenCardContent>
              <GardenCardTitle>{garden.name}</GardenCardTitle>
              <GardenCardInfo>
                <span>{garden.dimensions.width} × {garden.dimensions.height} {garden.dimensions.unit}</span>
                <span>{garden.elements?.length || 0} elements</span>
              </GardenCardInfo>
            </GardenCardContent>
          </GardenCard>
        ))}
      </GardensGrid>
      
      {/* Main Content - Garden Canvas and Tools */}
      {selectedGarden && gardenDetails && (
        <MainContent>
          <div 
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            <GardenCanvas garden={gardenDetails} />
          </div>
          
          <div>
            {/* Element palette for adding new elements */}
            <ElementPalette gardenId={selectedGarden._id} />
            
            {/* Element info */}
            {selectedElement && (
              <ElementInfo>
                <ElementInfoHeader>
                  <ElementInfoTitle>{selectedElement.name}</ElementInfoTitle>
                </ElementInfoHeader>
                <ElementInfoContent>
                  <div className="form-group">
                    <label>Type</label>
                    <p>{selectedElement.type}</p>
                  </div>
                  <div className="form-group">
                    <label>Position</label>
                    <p>
                      X: {selectedElement.position.x.toFixed(2)}, 
                      Y: {selectedElement.position.y.toFixed(2)}
                    </p>
                  </div>
                  <div className="form-group">
                    <label>Dimensions</label>
                    <p>
                      {selectedElement.dimensions.width.toFixed(2)} × {selectedElement.dimensions.height.toFixed(2)} {gardenDetails.dimensions.unit}
                    </p>
                  </div>
                  
                  {selectedElement.type === 'plant' && (
                    <div className="form-group">
                      <label>Planting Details</label>
                      <p>
                        {selectedElement.plantDetails?.plantingDate 
                          ? `Planted: ${new Date(selectedElement.plantDetails.plantingDate).toLocaleDateString()}`
                          : 'Not planted yet'
                        }
                      </p>
                      {selectedElement.plantDetails?.harvestDate && (
                        <p>Expected Harvest: {new Date(selectedElement.plantDetails.harvestDate).toLocaleDateString()}</p>
                      )}
                    </div>
                  )}
                  
                  <Button className="secondary">
                    <FiEdit2 /> Edit Element
                  </Button>
                </ElementInfoContent>
              </ElementInfo>
            )}
          </div>
        </MainContent>
      )}
      
      {/* Create Garden Modal */}
      {showCreateModal && (
        <ModalOverlay>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>Create New Garden</ModalTitle>
              <ModalCloseButton onClick={() => setShowCreateModal(false)}>×</ModalCloseButton>
            </ModalHeader>
            
            <Form onSubmit={handleCreateGarden}>
              <div className="form-group">
                <label htmlFor="name">Garden Name</label>
                <input
                  type="text"
                  id="name"
                  className="form-control"
                  value={newGardenData.name}
                  onChange={(e) => setNewGardenData({ ...newGardenData, name: e.target.value })}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="description">Description (Optional)</label>
                <textarea
                  id="description"
                  className="form-control"
                  value={newGardenData.description}
                  onChange={(e) => setNewGardenData({ ...newGardenData, description: e.target.value })}
                  rows="3"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="location">Location (Optional)</label>
                <input
                  type="text"
                  id="location"
                  className="form-control"
                  value={newGardenData.location}
                  onChange={(e) => setNewGardenData({ ...newGardenData, location: e.target.value })}
                  placeholder="E.g., Backyard, Allotment Plot 12"
                />
              </div>
              
              <div className="grid">
                <div className="col-6">
                  <div className="form-group">
                    <label htmlFor="width">Width</label>
                    <input
                      type="number"
                      id="width"
                      className="form-control"
                      value={newGardenData.dimensions.width}
                      onChange={(e) => setNewGardenData({
                        ...newGardenData,
                        dimensions: { ...newGardenData.dimensions, width: Number(e.target.value) }
                      })}
                      min="1"
                      required
                    />
                  </div>
                </div>
                
                <div className="col-6">
                  <div className="form-group">
                    <label htmlFor="height">Height</label>
                    <input
                      type="number"
                      id="height"
                      className="form-control"
                      value={newGardenData.dimensions.height}
                      onChange={(e) => setNewGardenData({
                        ...newGardenData,
                        dimensions: { ...newGardenData.dimensions, height: Number(e.target.value) }
                      })}
                      min="1"
                      required
                    />
                  </div>
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="unit">Unit</label>
                <select
                  id="unit"
                  className="form-control"
                  value={newGardenData.dimensions.unit}
                  onChange={(e) => setNewGardenData({
                    ...newGardenData,
                    dimensions: { ...newGardenData.dimensions, unit: e.target.value }
                  })}
                >
                  <option value="meters">Meters</option>
                  <option value="feet">Feet</option>
                </select>
              </div>
              
              <div className="form-group mt-4">
                <Button type="submit" className="primary" disabled={loading}>
                  <FiPlus /> Create Garden
                </Button>
              </div>
            </Form>
          </ModalContent>
        </ModalOverlay>
      )}
      
      {/* Edit Garden Modal */}
      {showEditModal && (
        <ModalOverlay>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>Edit Garden</ModalTitle>
              <ModalCloseButton onClick={() => setShowEditModal(false)}>×</ModalCloseButton>
            </ModalHeader>
            
            <Form onSubmit={handleEditGarden}>
              <div className="form-group">
                <label htmlFor="edit-name">Garden Name</label>
                <input
                  type="text"
                  id="edit-name"
                  className="form-control"
                  value={newGardenData.name}
                  onChange={(e) => setNewGardenData({ ...newGardenData, name: e.target.value })}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="edit-description">Description (Optional)</label>
                <textarea
                  id="edit-description"
                  className="form-control"
                  value={newGardenData.description}
                  onChange={(e) => setNewGardenData({ ...newGardenData, description: e.target.value })}
                  rows="3"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="edit-location">Location (Optional)</label>
                <input
                  type="text"
                  id="edit-location"
                  className="form-control"
                  value={newGardenData.location}
                  onChange={(e) => setNewGardenData({ ...newGardenData, location: e.target.value })}
                  placeholder="E.g., Backyard, Allotment Plot 12"
                />
              </div>
              
              <div className="form-group mt-4">
                <Button type="submit" className="primary" disabled={loading}>
                  <FiSave /> Save Changes
                </Button>
              </div>
            </Form>
          </ModalContent>
        </ModalOverlay>
      )}
      
      {/* Delete Garden Modal */}
      {showDeleteModal && (
        <ModalOverlay>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>Delete Garden</ModalTitle>
              <ModalCloseButton onClick={() => setShowDeleteModal(false)}>×</ModalCloseButton>
            </ModalHeader>
            
            <div className="card-body">
              <p>Are you sure you want to delete the garden "{selectedGarden.name}"?</p>
              <p className="text-danger">This action cannot be undone!</p>
              
              <div className="flex justify-between mt-4">
                <Button onClick={() => setShowDeleteModal(false)}>
                  Cancel
                </Button>
                <Button className="danger" onClick={handleDeleteGarden} disabled={loading}>
                  <FiTrash2 /> Delete Garden
                </Button>
              </div>
            </div>
          </ModalContent>
        </ModalOverlay>
      )}
    </PageContainer>
  );
};

export default GardenPlannerPage;
