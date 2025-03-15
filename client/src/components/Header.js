import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FiMenu, FiX, FiUser, FiLogOut, FiHome, FiCalendar, FiCloudRain, FiList, FiGrid } from 'react-icons/fi';
import { logout } from '../slices/authSlice';
import styled from 'styled-components';

const StyledHeader = styled.header`
  background-color: var(--primary-color);
  color: var(--white);
  padding: 1rem;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`;

const NavContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
`;

const Logo = styled(Link)`
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--white);
  text-decoration: none;
  display: flex;
  align-items: center;
  
  svg {
    margin-right: 8px;
  }
`;

const NavLinks = styled.nav`
  @media (max-width: 768px) {
    position: fixed;
    top: 0;
    right: ${({ isOpen }) => (isOpen ? '0' : '-100%')};
    width: 70%;
    height: 100vh;
    background-color: var(--primary-color);
    display: flex;
    flex-direction: column;
    padding: 2rem 1rem;
    transition: right 0.3s ease;
    z-index: 101;
  }

  @media (min-width: 769px) {
    display: flex;
    align-items: center;
  }
`;

const NavLink = styled(Link)`
  color: var(--white);
  text-decoration: none;
  padding: 0.5rem 1rem;
  display: flex;
  align-items: center;
  transition: var(--transition);
  
  svg {
    margin-right: 8px;
  }
  
  &:hover {
    background-color: var(--primary-dark);
    border-radius: var(--border-radius);
  }

  @media (max-width: 768px) {
    margin: 0.5rem 0;
    padding: 0.75rem 1rem;
  }
`;

const LoginButton = styled(Link)`
  color: var(--white);
  text-decoration: none;
  padding: 0.5rem 1rem;
  background-color: var(--primary-dark);
  border-radius: var(--border-radius);
  display: flex;
  align-items: center;
  transition: var(--transition);
  
  svg {
    margin-right: 8px;
  }
  
  &:hover {
    background-color: var(--secondary-dark);
  }

  @media (max-width: 768px) {
    margin: 0.5rem 0;
    padding: 0.75rem 1rem;
  }
`;

const MenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: var(--white);
  font-size: 1.5rem;
  cursor: pointer;
  
  @media (max-width: 768px) {
    display: block;
  }
`;

const Overlay = styled.div`
  display: ${({ isOpen }) => (isOpen ? 'block' : 'none')};
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 100;
`;

const CloseMenuButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  color: var(--white);
  font-size: 1.5rem;
  cursor: pointer;
  display: none;
  
  @media (max-width: 768px) {
    display: block;
  }
`;

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
    closeMenu();
  };

  return (
    <StyledHeader>
      <NavContainer>
        <Logo to="/">
          <FiGrid /> Allotment Planner
        </Logo>
        
        <MenuButton onClick={toggleMenu}>
          <FiMenu />
        </MenuButton>
        
        <Overlay isOpen={isOpen} onClick={closeMenu} />
        
        <NavLinks isOpen={isOpen}>
          <CloseMenuButton onClick={closeMenu}>
            <FiX />
          </CloseMenuButton>
          
          <NavLink to="/" onClick={closeMenu}>
            <FiHome /> Home
          </NavLink>
          
          <NavLink to="/plants" onClick={closeMenu}>
            <FiList /> Plants
          </NavLink>
          
          {userInfo ? (
            <>
              <NavLink to="/garden-planner" onClick={closeMenu}>
                <FiGrid /> Garden Planner
              </NavLink>
              
              <NavLink to="/calendar" onClick={closeMenu}>
                <FiCalendar /> Calendar
              </NavLink>
              
              <NavLink to="/weather-alerts" onClick={closeMenu}>
                <FiCloudRain /> Weather
              </NavLink>
              
              <NavLink to="/profile" onClick={closeMenu}>
                <FiUser /> Profile
              </NavLink>
              
              <NavLink as="button" onClick={handleLogout} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <FiLogOut /> Logout
              </NavLink>
            </>
          ) : (
            <LoginButton to="/login" onClick={closeMenu}>
              <FiUser /> Login
            </LoginButton>
          )}
        </NavLinks>
      </NavContainer>
    </StyledHeader>
  );
};

export default Header;
