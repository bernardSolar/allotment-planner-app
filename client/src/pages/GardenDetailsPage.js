import React from 'react';
import { useParams } from 'react-router-dom';

const GardenDetailsPage = () => {
  const { id } = useParams();
  
  return (
    <div className="container">
      <h1>Garden Details</h1>
      <p>Garden ID: {id}</p>
      <p>This page will show detailed information about a specific garden.</p>
    </div>
  );
};

export default GardenDetailsPage;
