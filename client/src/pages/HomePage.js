import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const HeroSection = styled.section`
  background-color: var(--primary-color);
  color: white;
  text-align: center;
  padding: 80px 20px;
`;

const HeroTitle = styled.h1`
  font-size: 3rem;
  margin-bottom: 20px;
`;

const HeroSubtitle = styled.p`
  font-size: 1.2rem;
  max-width: 800px;
  margin: 0 auto 30px;
`;

const HeroButtons = styled.div`
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 20px;
  
  @media (max-width: 576px) {
    flex-direction: column;
    align-items: center;
  }
`;

const FeaturesSection = styled.section`
  padding: 80px 20px;
  background-color: white;
`;

const FeaturesTitle = styled.h2`
  text-align: center;
  margin-bottom: 50px;
  font-size: 2.2rem;
  color: var(--primary-dark);
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 30px;
  max-width: 1200px;
  margin: 0 auto;
`;

const FeatureCard = styled.div`
  text-align: center;
  padding: 30px;
  border-radius: var(--border-radius);
  background-color: white;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
`;

const FeatureTitle = styled.h3`
  margin-bottom: 10px;
  font-size: 1.5rem;
  color: var(--text-color);
`;

const FeatureDescription = styled.p`
  color: var(--text-light);
`;

const CTAButton = styled(Link)`
  display: inline-block;
  background-color: ${props => props.$secondary ? 'transparent' : 'var(--primary-color)'};
  color: ${props => props.$secondary ? 'var(--primary-color)' : 'white'};
  border: ${props => props.$secondary ? '2px solid var(--primary-color)' : 'none'};
  padding: 12px 24px;
  border-radius: var(--border-radius);
  text-decoration: none;
  font-weight: 600;
  transition: var(--transition);
  
  &:hover {
    background-color: ${props => props.$secondary ? 'rgba(76, 175, 80, 0.1)' : 'var(--primary-dark)'};
  }
`;

const HomePage = () => {
  return (
    <>
      <HeroSection>
        <HeroTitle>Plan Your Perfect Garden</HeroTitle>
        <HeroSubtitle>
          Design, track, and optimize your allotment or garden space with our intuitive planner.
          Get personalized planting schedules, weather alerts, and expert growing advice.
        </HeroSubtitle>
        <HeroButtons>
          <CTAButton to="/register">Get Started - It's Free</CTAButton>
          <CTAButton to="/garden-planner" $secondary>Explore the Planner</CTAButton>
        </HeroButtons>
      </HeroSection>
      
      <FeaturesSection>
        <FeaturesTitle>Everything You Need to Grow</FeaturesTitle>
        <FeaturesGrid>
          <FeatureCard>
            <FeatureTitle>Interactive Planner</FeatureTitle>
            <FeatureDescription>
              Design your garden with our drag-and-drop interface. Create beds, add plants, and visualize your space.
            </FeatureDescription>
          </FeatureCard>
          
          <FeatureCard>
            <FeatureTitle>Planting Calendar</FeatureTitle>
            <FeatureDescription>
              Know exactly when to sow, plant, and harvest with personalized schedules based on your location.
            </FeatureDescription>
          </FeatureCard>
          
          <FeatureCard>
            <FeatureTitle>Weather Alerts</FeatureTitle>
            <FeatureDescription>
              Receive timely notifications about frost, heat, drought, and other conditions that affect your garden.
            </FeatureDescription>
          </FeatureCard>
        </FeaturesGrid>
      </FeaturesSection>
    </>
  );
};

export default HomePage;
