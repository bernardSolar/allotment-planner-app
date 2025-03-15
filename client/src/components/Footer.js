import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FiGithub, FiTwitter, FiInstagram, FiMail } from 'react-icons/fi';

const StyledFooter = styled.footer`
  background-color: var(--primary-dark);
  color: var(--white);
  padding: 2rem 1rem;
  margin-top: 2rem;
`;

const FooterContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
`;

const FooterSection = styled.div`
  h3 {
    font-size: 1.2rem;
    margin-bottom: 1rem;
    font-weight: 600;
  }
`;

const FooterLink = styled(Link)`
  color: var(--white);
  text-decoration: none;
  display: block;
  margin-bottom: 0.5rem;
  transition: var(--transition);
  
  &:hover {
    color: var(--secondary-light);
  }
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const SocialLink = styled.a`
  color: var(--white);
  font-size: 1.5rem;
  transition: var(--transition);
  
  &:hover {
    color: var(--secondary-light);
  }
`;

const Copyright = styled.div`
  text-align: center;
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <StyledFooter>
      <FooterContainer>
        <FooterSection>
          <h3>Allotment Planner</h3>
          <p>Plan your garden, track your plants, and get personalized growing advice.</p>
          <SocialLinks>
            <SocialLink href="#" target="_blank" rel="noopener noreferrer">
              <FiGithub />
            </SocialLink>
            <SocialLink href="#" target="_blank" rel="noopener noreferrer">
              <FiTwitter />
            </SocialLink>
            <SocialLink href="#" target="_blank" rel="noopener noreferrer">
              <FiInstagram />
            </SocialLink>
            <SocialLink href="mailto:contact@example.com">
              <FiMail />
            </SocialLink>
          </SocialLinks>
        </FooterSection>
        
        <FooterSection>
          <h3>Features</h3>
          <FooterLink to="/garden-planner">Garden Planner</FooterLink>
          <FooterLink to="/plants">Plant Database</FooterLink>
          <FooterLink to="/calendar">Planting Calendar</FooterLink>
          <FooterLink to="/weather-alerts">Weather Alerts</FooterLink>
        </FooterSection>
        
        <FooterSection>
          <h3>Subscription</h3>
          <FooterLink to="/pricing">Free Tier</FooterLink>
          <FooterLink to="/pricing">Premium (£5/month)</FooterLink>
          <FooterLink to="/pricing">Annual (£40/year)</FooterLink>
        </FooterSection>
        
        <FooterSection>
          <h3>Help</h3>
          <FooterLink to="/faq">FAQ</FooterLink>
          <FooterLink to="/contact">Contact Us</FooterLink>
          <FooterLink to="/privacy">Privacy Policy</FooterLink>
          <FooterLink to="/terms">Terms of Service</FooterLink>
        </FooterSection>
      </FooterContainer>
      
      <Copyright>
        <p>&copy; {currentYear} Allotment Planner. All rights reserved.</p>
      </Copyright>
    </StyledFooter>
  );
};

export default Footer;
