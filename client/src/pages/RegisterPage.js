import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { register, clearError } from '../slices/authSlice';
import styled from 'styled-components';
import { FiUser, FiLock, FiMail, FiMapPin, FiAlertCircle } from 'react-icons/fi';
import { toast } from 'react-toastify';

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  min-height: calc(100vh - 200px);
`;

const RegisterCard = styled.div`
  background-color: white;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
  width: 100%;
  max-width: 500px;
  padding: 2rem;
`;

const RegisterHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  color: var(--primary-dark);
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  color: var(--text-light);
`;

const Form = styled.form`
  .form-group + .form-group {
    margin-top: 1.5rem;
  }
`;

const InputGroup = styled.div`
  position: relative;
  
  svg {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: var(--text-light);
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 12px 12px 40px;
  border: 1px solid #ddd;
  border-radius: var(--border-radius);
  font-size: 1rem;
  transition: var(--transition);
  
  &:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.2);
  }
`;

const Button = styled.button`
  width: 100%;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: var(--border-radius);
  padding: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);
  margin-top: 1.5rem;
  
  &:hover {
    background-color: var(--primary-dark);
  }
  
  &:disabled {
    background-color: #bdbdbd;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: #ffebee;
  color: #c62828;
  padding: 12px;
  border-radius: var(--border-radius);
  margin-bottom: 1.5rem;
  
  svg {
    flex-shrink: 0;
  }
`;

const LoginLink = styled.div`
  text-align: center;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #eee;
  
  a {
    color: var(--primary-color);
    text-decoration: none;
    font-weight: 600;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const TermsText = styled.p`
  font-size: 0.9rem;
  color: var(--text-light);
  text-align: center;
  margin-top: 1rem;
  
  a {
    color: var(--primary-color);
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [location, setLocation] = useState('');
  const [passwordError, setPasswordError] = useState('');
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo, loading, error } = useSelector((state) => state.auth);
  
  // Redirect if already logged in
  useEffect(() => {
    if (userInfo) {
      navigate('/garden-planner');
    }
  }, [userInfo, navigate]);
  
  // Clear error when component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate passwords match
    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    } else {
      setPasswordError('');
    }
    
    // Validate password strength
    if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters long');
      return;
    } else {
      setPasswordError('');
    }
    
    dispatch(register({ name, email, password, location }))
      .unwrap()
      .then(() => {
        toast.success('Registration successful!');
        navigate('/garden-planner');
      })
      .catch((error) => {
        // Error is already handled in the reducer
      });
  };
  
  return (
    <PageContainer>
      <RegisterCard>
        <RegisterHeader>
          <Title>Create Account</Title>
          <Subtitle>Sign up to start planning your garden</Subtitle>
        </RegisterHeader>
        
        {(error || passwordError) && (
          <ErrorMessage>
            <FiAlertCircle />
            <span>{error || passwordError}</span>
          </ErrorMessage>
        )}
        
        <Form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <InputGroup>
              <FiUser />
              <Input
                type="text"
                id="name"
                placeholder="Your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </InputGroup>
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <InputGroup>
              <FiMail />
              <Input
                type="email"
                id="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </InputGroup>
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <InputGroup>
              <FiLock />
              <Input
                type="password"
                id="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </InputGroup>
          </div>
          
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <InputGroup>
              <FiLock />
              <Input
                type="password"
                id="confirmPassword"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </InputGroup>
          </div>
          
          <div className="form-group">
            <label htmlFor="location">Location (Optional)</label>
            <InputGroup>
              <FiMapPin />
              <Input
                type="text"
                id="location"
                placeholder="City, Country"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </InputGroup>
            <small>This helps us provide localized planting schedules and weather alerts</small>
          </div>
          
          <Button type="submit" disabled={loading}>
            {loading ? 'Creating Account...' : 'Sign Up'}
          </Button>
          
          <TermsText>
            By signing up, you agree to our{' '}
            <Link to="/terms">Terms of Service</Link> and{' '}
            <Link to="/privacy">Privacy Policy</Link>
          </TermsText>
          
          <LoginLink>
            Already have an account? <Link to="/login">Login</Link>
          </LoginLink>
        </Form>
      </RegisterCard>
    </PageContainer>
  );
};

export default RegisterPage;
