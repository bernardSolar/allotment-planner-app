import React from 'react';
import { useParams } from 'react-router-dom';

const PlantDetailsPage = () => {
  const { id } = useParams();
  
  return (
    <div className="container">
      <h1>Plant Details</h1>
      <p>Plant ID: {id}</p>
      <p>This page will show detailed information about a specific plant.</p>
    </div>
  );
};

export default PlantDetailsPage;
