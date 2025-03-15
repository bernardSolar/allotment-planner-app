import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { 
  getUserGardens, 
  getGardenDetails, 
  createGarden, 
  updateGarden, 
  deleteGarden,
  addElement
} from '../slices/gardenSlice';
import GardenCanvas from '../components/garden/GardenCanvas';
import ElementPalette from '../components/garden/ElementPalette';

const PageContainer = styled.div`
  padding: 20px;
`;

const PageHeader = styled.div`
  margin-bottom: 20px;
`;

const Title = styled.h1`
  font-size: 2rem;
  color: var(--primary-dark);
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  color: var(--text-light);
`;

const GardenPlannerPage = () => {
  const dispatch = useDispatch();
  const { gardens, loading, error } = useSelector((state) => state.gardens);
  
  useEffect(() => {
    dispatch(getUserGardens());
  }, [dispatch]);
  
  return (
    <PageContainer>
      <PageHeader>
        <Title>Garden Planner</Title>
        <Subtitle>Design and manage your garden layouts</Subtitle>
      </PageHeader>
      
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : (
        <div>
          <p>This is where your garden planner will be displayed.</p>
          <GardenCanvas />
          <ElementPalette />
        </div>
      )}
    </PageContainer>
  );
};

export default GardenPlannerPage;
