import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';

// Layout Components
import Header from './components/Header';
import Footer from './components/Footer';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import GardenPlannerPage from './pages/GardenPlannerPage';
import GardenDetailsPage from './pages/GardenDetailsPage';
import PlantDatabasePage from './pages/PlantDatabasePage';
import PlantDetailsPage from './pages/PlantDetailsPage';
import CalendarPage from './pages/CalendarPage';
import WeatherAlertsPage from './pages/WeatherAlertsPage';
import NotFoundPage from './pages/NotFoundPage';

// Protected Route Component
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const { userInfo } = useSelector((state) => state.auth);

  return (
    <div className="app-container">
      <Header />
      <main className="main-content">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/plants" element={<PlantDatabasePage />} />
          <Route path="/plants/:id" element={<PlantDetailsPage />} />
          
          {/* Protected Routes */}
          <Route path="/profile" element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          } />
          <Route path="/garden-planner" element={
            <ProtectedRoute>
              <GardenPlannerPage />
            </ProtectedRoute>
          } />
          <Route path="/gardens/:id" element={
            <ProtectedRoute>
              <GardenDetailsPage />
            </ProtectedRoute>
          } />
          <Route path="/calendar" element={
            <ProtectedRoute>
              <CalendarPage />
            </ProtectedRoute>
          } />
          <Route path="/weather-alerts" element={
            <ProtectedRoute>
              <WeatherAlertsPage />
            </ProtectedRoute>
          } />
          
          {/* Catch-all route for 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
