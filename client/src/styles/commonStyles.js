/**
 * Common styled components for the application
 */
import styled from 'styled-components';

// Container for page content
export const PageContainer = styled.div`
  padding: 20px;
`;

// Page header with title and actions
export const PageHeader = styled.div`
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

// Page title
export const Title = styled.h1`
  font-size: 2rem;
  color: var(--primary-dark);
  margin-bottom: 0.5rem;
`;

// Subtitle below page title
export const Subtitle = styled.p`
  color: var(--text-light);
`;

// Container for actions (buttons)
export const ActionContainer = styled.div`
  display: flex;
  gap: 10px;
`;

// Standard button
export const Button = styled.button`
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

// Icon button with smaller padding
export const IconButton = styled.button`
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 5px 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 14px;
  
  &:hover {
    background-color: #f5f5f5;
  }
  
  svg {
    width: 16px;
    height: 16px;
    margin-right: ${props => props.hasText ? '6px' : '0'};
  }
`;

// Card container
export const Card = styled.div`
  background-color: white;
  border: 1px solid #ddd;
  border-radius: var(--border-radius);
  padding: 15px;
  box-shadow: var(--shadow);
  margin-bottom: 20px;
`;

// Form group for inputs
export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin-bottom: 15px;
`;

// Form label
export const Label = styled.label`
  font-weight: 500;
`;

// Input field
export const Input = styled.input`
  padding: 8px 12px;
  border-radius: 4px;
  border: 1px solid #ddd;
`;

// Select dropdown
export const Select = styled.select`
  padding: 8px 12px;
  border-radius: 4px;
  border: 1px solid #ddd;
  min-width: 200px;
`;