import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FiGrid, FiCalendar, FiCloudRain, FiDatabase, FiUsers } from 'react-icons/fi';
import { GiPlantSeed, GiTree, GiGreenhouse } from 'react-icons/gi';

const HeroSection = styled.section`
  background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), 
              url('https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80') center/cover no-repeat;
  color: white;
  text-align: center;
  padding: 100px 20px;
  margin-top: -20px;
`;

const HeroTitle = styled.h1`
  font-size: 3rem;
  margin-bottom: 20px;
`;

const HeroSubtitle = styled.p`
  font-size: 1.2rem;
  max-width: 800px;
  margin: 0 auto 30px;
  line-height: 1.6;
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

const HeroButton = styled(Link)`
  padding: 12px 25px;
  border-radius: var(--border-radius);
  font-weight: 600;
  text-decoration: none;
  transition: var(--transition);
  
  &.primary {
    background-color: var(--primary-color);
    color: white;
    
    &:hover {
      background-color: var(--primary-dark);
    }
  }
  
  &.secondary {
    background-color: transparent;
    color: white;
    border: 2px solid white;
    
    &:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }
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
  transition: var(--transition);
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  }
`;

const FeatureIcon = styled.div`
  font-size: 3rem;
  color: var(--primary-color);
  margin-bottom: 15px;
`;

const FeatureTitle = styled.h3`
  margin-bottom: 10px;
  font-size: 1.5rem;
  color: var(--text-color);
`;

const FeatureDescription = styled.p`
  color: var(--text-light);
  line-height: 1.6;
`;

const PricingSection = styled.section`
  padding: 80px 20px;
  background-color: #f9fafb;
`;

const PricingTitle = styled.h2`
  text-align: center;
  margin-bottom: 20px;
  font-size: 2.2rem;
  color: var(--primary-dark);
`;

const PricingSubtitle = styled.p`
  text-align: center;
  max-width: 700px;
  margin: 0 auto 50px;
  color: var(--text-light);
  font-size: 1.1rem;
  line-height: 1.6;
`;

const PricingGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  max-width: 1200px;
  margin: 0 auto;
`;

const PricingCard = styled.div`
  background-color: white;
  border-radius: var(--border-radius);
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  transition: var(--transition);
  display: flex;
  flex-direction: column;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  }
  
  &.popular {
    border-top: 5px solid var(--primary-color);
    transform: scale(1.05);
    
    @media (max-width: 992px) {
      transform: scale(1);
    }
  }
`;

const PricingHeader = styled.div`
  background-color: ${({ popular }) => popular ? 'var(--primary-dark)' : '#f5f5f5'};
  color: ${({ popular }) => popular ? 'white' : 'var(--text-color)'};
  padding: 25px 20px;
  text-align: center;
`;

const PricingTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 5px;
`;

const PricingPrice = styled.div`
  font-size: 2.5rem;
  font-weight: 700;
  margin: 15px 0;
  
  span {
    font-size: 1rem;
    font-weight: 400;
  }
`;

const PricingFeatures = styled.ul`
  list-style: none;
  padding: 20px;
  flex: 1;
  
  li {
    padding: 10px 0;
    border-bottom: 1px solid #eee;
    
    &:last-child {
      border-bottom: none;
    }
  }
`;

const PricingButton = styled(Link)`
  display: block;
  text-align: center;
  background-color: ${({ popular }) => popular ? 'var(--primary-color)' : '#f5f5f5'};
  color: ${({ popular }) => popular ? 'white' : 'var(--text-color)'};
  text-decoration: none;
  padding: 15px;
  margin: 10px 20px 20px;
  border-radius: var(--border-radius);
  font-weight: 600;
  transition: var(--transition);
  
  &:hover {
    background-color: ${({ popular }) => popular ? 'var(--primary-dark)' : '#e0e0e0'};
  }
`;

const CTASection = styled.section`
  background-color: var(--primary-dark);
  color: white;
  text-align: center;
  padding: 80px 20px;
`;

const CTATitle = styled.h2`
  font-size: 2.2rem;
  margin-bottom: 20px;
`;

const CTAText = styled.p`
  font-size: 1.1rem;
  max-width: 700px;
  margin: 0 auto 30px;
  line-height: 1.6;
`;

const CTAButton = styled(Link)`
  display: inline-block;
  background-color: white;
  color: var(--primary-dark);
  text-decoration: none;
  padding: 12px 25px;
  border-radius: var(--border-radius);
  font-weight: 600;
  transition: var(--transition);
  
  &:hover {
    background-color: var(--primary-light);
    color: white;
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
          <HeroButton to="/register" className="primary">
            Get Started - It's Free
          </HeroButton>
          <HeroButton to="/garden-planner" className="secondary">
            Explore the Planner
          </HeroButton>
        </HeroButtons>
      </HeroSection>
      
      <FeaturesSection>
        <FeaturesTitle>Everything You Need to Grow</FeaturesTitle>
        <FeaturesGrid>
          <FeatureCard>
            <FeatureIcon>
              <FiGrid />
            </FeatureIcon>
            <FeatureTitle>Interactive Planner</FeatureTitle>
            <FeatureDescription>
              Design your garden with our drag-and-drop interface. Create beds, add plants, and visualize your space.
            </FeatureDescription>
          </FeatureCard>
          
          <FeatureCard>
            <FeatureIcon>
              <FiCalendar />
            </FeatureIcon>
            <FeatureTitle>Planting Calendar</FeatureTitle>
            <FeatureDescription>
              Know exactly when to sow, plant, and harvest with personalized schedules based on your location.
            </FeatureDescription>
          </FeatureCard>
          
          <FeatureCard>
            <FeatureIcon>
              <FiCloudRain />
            </FeatureIcon>
            <FeatureTitle>Weather Alerts</FeatureTitle>
            <FeatureDescription>
              Receive timely notifications about frost, heat, drought, and other conditions that affect your garden.
            </FeatureDescription>
          </FeatureCard>
          
          <FeatureCard>
            <FeatureIcon>
              <GiPlantSeed />
            </FeatureIcon>
            <FeatureTitle>Plant Database</FeatureTitle>
            <FeatureDescription>
              Access information on hundreds of plants, including growing requirements, companion planting, and more.
            </FeatureDescription>
          </FeatureCard>
          
          <FeatureCard>
            <FeatureIcon>
              <GiGreenhouse />
            </FeatureIcon>
            <FeatureTitle>Growth Tracking</FeatureTitle>
            <FeatureDescription>
              Record germination, growth, and harvest data to improve your gardening year after year.
            </FeatureDescription>
          </FeatureCard>
          
          <FeatureCard>
            <FeatureIcon>
              <FiUsers />
            </FeatureIcon>
            <FeatureTitle>Community Sharing</FeatureTitle>
            <FeatureDescription>
              Share your garden plans and exchange tips with fellow gardeners in our growing community.
            </FeatureDescription>
          </FeatureCard>
        </FeaturesGrid>
      </FeaturesSection>
      
      <PricingSection>
        <PricingTitle>Choose Your Plan</PricingTitle>
        <PricingSubtitle>
          Start for free and upgrade as your garden grows. All plans include core planning features.
        </PricingSubtitle>
        
        <PricingGrid>
          <PricingCard>
            <PricingHeader>
              <PricingTitle>Free</PricingTitle>
              <PricingPrice>£0 <span>/ forever</span></PricingPrice>
            </PricingHeader>
            <PricingFeatures>
              <li>Basic garden planning tools</li>
              <li>Up to 1 garden design</li>
              <li>Track up to 20 plants</li>
              <li>Basic plant database access</li>
              <li>Simple planting calendar</li>
            </PricingFeatures>
            <PricingButton to="/register">Get Started</PricingButton>
          </PricingCard>
          
          <PricingCard className="popular">
            <PricingHeader popular>
              <PricingTitle>Premium</PricingTitle>
              <PricingPrice>£5 <span>/ month</span></PricingPrice>
            </PricingHeader>
            <PricingFeatures>
              <li>Unlimited garden designs</li>
              <li>Track unlimited plants</li>
              <li>Full plant database access</li>
              <li>Advanced planting calendar</li>
              <li>Weather integration with alerts</li>
              <li>Garden & harvest statistics</li>
              <li>Export & print garden plans</li>
            </PricingFeatures>
            <PricingButton to="/register" popular>Start 7-Day Free Trial</PricingButton>
          </PricingCard>
          
          <PricingCard>
            <PricingHeader>
              <PricingTitle>Annual</PricingTitle>
              <PricingPrice>£40 <span>/ year</span></PricingPrice>
            </PricingHeader>
            <PricingFeatures>
              <li>All Premium features</li>
              <li>Save £20 compared to monthly</li>
              <li>Priority support</li>
              <li>Early access to new features</li>
              <li>Seasonal planting guides</li>
            </PricingFeatures>
            <PricingButton to="/register">Choose Annual</PricingButton>
          </PricingCard>
        </PricingGrid>
      </PricingSection>
      
      <CTASection>
        <CTATitle>Ready to Grow Better?</CTATitle>
        <CTAText>
          Join thousands of gardeners who are planning, tracking, and optimizing their growing spaces with our tools.
        </CTAText>
        <CTAButton to="/register">
          Create Your Free Account
        </CTAButton>
      </CTASection>
    </>
  );
};

export default HomePage;
