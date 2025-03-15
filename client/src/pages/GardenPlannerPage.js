import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { 
  getUserGardens, 
  getGardenDetails, 
  createGarden, 
  updateGarden, 
  deleteGarden
} from '../slices/gardenSlice';
import GardenCanvas from '../components/garden/GardenCanvas';
import ElementPalette from '../components/garden/ElementPalette';

const PageContainer = styled.div`
  padding: 20px;
`;

const PageHeader = styled.div`
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h1`
  font-size: 2rem;
  color: var(--primary-dark);
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  color: var(--text-light);
`;

const GardenActions = styled.div`
  display: flex;
  gap: 10px;
`;

const Button = styled.button`
  background-color: var(--primary);
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  cursor: pointer;
  font-size: 14px;
  
  &:hover {
    background-color: var(--primary-dark);
  }
  
  &.secondary {
    background-color: var(--secondary);
    &:hover {
      background-color: var(--secondary-dark);
    }
  }
  
  &.danger {
    background-color: #f44336;
    &:hover {
      background-color: #d32f2f;
    }
  }
`;

const GardenSelector = styled.div`
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 15px;
`;

const Select = styled.select`
  padding: 8px 12px;
  border-radius: 4px;
  border: 1px solid #ddd;
  min-width: 200px;
`;

const GardenInfoBox = styled.div`
  background-color: white;
  border: 1px solid #ddd;
  border-radius: var(--border-radius);
  padding: 15px;
  box-shadow: var(--shadow);
  margin-bottom: 20px;
`;

const CreateGardenForm = styled.form`
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const Label = styled.label`
  font-weight: 500;
`;

const Input = styled.input`
  padding: 8px 12px;
  border-radius: 4px;
  border: 1px solid #ddd;
`;

const GardenPlannerPage = () => {
  const dispatch = useDispatch();
  const { gardens, gardenDetails, loading, error } = useSelector((state) => state.gardens);
  
  const [selectedGardenId, setSelectedGardenId] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newGardenName, setNewGardenName] = useState('');
  const [gardenName, setGardenName] = useState('');
  
  useEffect(() => {
    dispatch(getUserGardens());
  }, [dispatch]);
  
  useEffect(() => {
    if (gardens.length > 0 && !selectedGardenId) {
      setSelectedGardenId(gardens[0]._id);
      dispatch(getGardenDetails(gardens[0]._id));
    }
  }, [gardens, selectedGardenId, dispatch]);
  
  useEffect(() => {
    if (gardenDetails) {
      setGardenName(gardenDetails.name);
    }
  }, [gardenDetails]);
  
  const handleGardenChange = (e) => {
    const id = e.target.value;
    setSelectedGardenId(id);
    dispatch(getGardenDetails(id));
  };
  
  const handleCreateGarden = (e) => {
    e.preventDefault();
    if (newGardenName.trim()) {
      dispatch(createGarden({ name: newGardenName }));
      setNewGardenName('');
      setShowCreateForm(false);
    }
  };
  
  const handleUpdateGarden = () => {
    if (gardenName.trim() && gardenDetails) {
      dispatch(updateGarden({ 
        gardenId: gardenDetails._id, 
        gardenData: { 
          ...gardenDetails, 
          name: gardenName 
        } 
      }));
    }
  };
  
  const handleDeleteGarden = () => {
    if (window.confirm('Are you sure you want to delete this garden? This action cannot be undone.')) {
      dispatch(deleteGarden(selectedGardenId));
    }
  };
  
  return (
    <PageContainer>
      <PageHeader>
        <div>
          <Title>Garden Planner</Title>
          <Subtitle>Design and manage your garden layouts</Subtitle>
        </div>
        <GardenActions>
          {!showCreateForm && (
            <Button onClick={() => setShowCreateForm(true)}>Create New Garden</Button>
          )}
        </GardenActions>
      </PageHeader>
      
      {showCreateForm && (
        <GardenInfoBox>
          <h3>Create New Garden</h3>
          <CreateGardenForm onSubmit={handleCreateGarden}>
            <FormGroup>
              <Label htmlFor="gardenName">Garden Name</Label>
              <Input 
                type="text" 
                id="gardenName" 
                value={newGardenName} 
                onChange={(e) => setNewGardenName(e.target.value)}
                placeholder="My Vegetable Garden"
                required
              />
            </FormGroup>
            <div style={{ display: 'flex', gap: '10px' }}>
              <Button type="submit">Create Garden</Button>
              <Button 
                type="button" 
                className="secondary" 
                onClick={() => setShowCreateForm(false)}
              >
                Cancel
              </Button>
            </div>
          </CreateGardenForm>
        </GardenInfoBox>
      )}
      
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : gardens.length > 0 ? (
        <>
          <GardenSelector>
            <Label htmlFor="garden-select">Select Garden:</Label>
            <Select
              id="garden-select"
              value={selectedGardenId}
              onChange={handleGardenChange}
            >
              {gardens.map((garden) => (
                <option key={garden._id} value={garden._id}>
                  {garden.name}
                </option>
              ))}
            </Select>
            {gardenDetails && (
              <>
                <Input
                  type="text"
                  value={gardenName}
                  onChange={(e) => setGardenName(e.target.value)}
                  placeholder="Garden Name"
                />
                <Button onClick={handleUpdateGarden}>Update Name</Button>
                <Button className="danger" onClick={handleDeleteGarden}>Delete Garden</Button>
              </>
            )}
          </GardenSelector>
          
          <ElementPalette />
          
          <GardenCanvas garden={gardenDetails} />
        </>
      ) : (
        <p>No gardens found. Create a new garden to get started.</p>
      )}
    </PageContainer>
  );
};

export default GardenPlannerPage;