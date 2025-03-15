import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile, clearError, resetSuccess } from '../slices/authSlice';
import { getUserGardens } from '../slices/gardenSlice';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FiUser, FiMail, FiMapPin, FiEdit2, FiCalendar, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';
import { GiPlantRoots } from 'react-icons/gi';
import { toast } from 'react-toastify';

const PageContainer = styled.div`
  padding: 2rem;
`;

const PageHeader = styled.div`
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

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 2rem;
  
  @media (max-width: 992px) {
    grid-template-columns: 1fr;
  }
`;

const ProfileCard = styled.div`
  background-color: white;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
  padding: 1.5rem;
  height: fit-content;
`;

const ProfileHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 1.5rem;
  text-align: center;
`;

const ProfileAvatar = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background-color: var(--primary-light);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
  color: white;
  font-size: 2.5rem;
`;

const ProfileName = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
`;

const ProfileDetail = styled.div`
  display: flex;
  align-items: center;
  padding: 0.75rem 0;
  
  &:not(:last-child) {
    border-bottom: 1px solid #eee;
  }
  
  svg {
    margin-right: 0.75rem;
    color: var(--primary-color);
  }
`;

const ProfileStats = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-top: 1.5rem;
`;

const StatCard = styled.div`
  background-color: var(--primary-light);
  color: white;
  padding: 1rem;
  border-radius: var(--border-radius);
  text-align: center;
`;

const StatNumber = styled.div`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  font-size: 0.9rem;
`;

const EditButton = styled.button`
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: var(--border-radius);
  padding: 0.5rem 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: var(--transition);
  font-weight: 500;
  margin-top: 1.5rem;
  width: 100%;
  justify-content: center;
  
  &:hover {
    background-color: var(--primary-dark);
  }
`;

const TabsContainer = styled.div`
  background-color: white;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
  overflow: hidden;
`;

const TabNavigation = styled.div`
  display: flex;
  border-bottom: 1px solid #eee;
`;

const TabButton = styled.button`
  padding: 1rem;
  background-color: ${({ active }) => (active ? 'white' : '#f9f9f9')};
  border: none;
  border-bottom: ${({ active }) => (active ? `3px solid var(--primary-color)` : 'none')};
  font-weight: ${({ active }) => (active ? '600' : '400')};
  color: ${({ active }) => (active ? 'var(--primary-color)' : 'var(--text-color)')};
  cursor: pointer;
  flex: 1;
  transition: var(--transition);
  
  &:hover {
    background-color: ${({ active }) => (active ? 'white' : '#f0f0f0')};
  }
`;

const TabContent = styled.div`
  padding: 1.5rem;
`;

const GardenGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
`;

const GardenCard = styled(Link)`
  background-color: #f9f9f9;
  border-radius: var(--border-radius);
  padding: 1rem;
  text-decoration: none;
  color: var(--text-color);
  transition: var(--transition);
  
  &:hover {
    background-color: #f0f0f0;
    transform: translateY(-3px);
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
  }
`;

const GardenTitle = styled.h3`
  margin-bottom: 0.5rem;
  color: var(--primary-dark);
`;

const GardenInfo = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  color: var(--text-light);
`;

const Form = styled.form`
  .form-group + .form-group {
    margin-top: 1rem;
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
  padding: 10px 10px 10px 40px;
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

const SaveButton = styled.button`
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: var(--border-radius);
  padding: 0.75rem 1.5rem;
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

const Message = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px;
  border-radius: var(--border-radius);
  margin-bottom: 1rem;
  
  &.error {
    background-color: #ffebee;
    color: #c62828;
  }
  
  &.success {
    background-color: #e8f5e9;
    color: #2e7d32;
  }
  
  svg {
    flex-shrink: 0;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 2rem;
  color: var(--text-light);
  
  svg {
    font-size: 3rem;
    margin-bottom: 1rem;
    color: var(--primary-light);
  }
  
  h3 {
    margin-bottom: 1rem;
    color: var(--text-color);
  }
`;

const ProfilePage = () => {
  // User info and state
  const dispatch = useDispatch();
  const { userInfo, loading, error, success } = useSelector((state) => state.auth);
  const { gardens } = useSelector((state) => state.gardens);
  
  // Form state
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [location, setLocation] = useState('');
  const [activeTab, setActiveTab] = useState('gardens');
  
  // Initialize form with user data
  useEffect(() => {
    if (userInfo) {
      setName(userInfo.name || '');
      setEmail(userInfo.email || '');
      setLocation(userInfo.location || '');
    }
  }, [userInfo]);
  
  // Load user gardens
  useEffect(() => {
    dispatch(getUserGardens());
  }, [dispatch]);
  
  // Clear success state
  useEffect(() => {
    if (success) {
      // Reset after 3 seconds
      const timer = setTimeout(() => {
        dispatch(resetSuccess());
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [success, dispatch]);
  
  // Clear error when component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearError());
      dispatch(resetSuccess());
    };
  }, [dispatch]);
  
  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate passwords match if provided
    if (password && password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    // Update profile
    dispatch(updateProfile({
      name,
      email,
      password: password || undefined,
      location,
    }))
      .unwrap()
      .then(() => {
        setEditMode(false);
        setPassword('');
        setConfirmPassword('');
        toast.success('Profile updated successfully');
      })
      .catch((error) => {
        // Error already handled in reducer
      });
  };
  
  return (
    <PageContainer>
      <PageHeader>
        <Title>Your Profile</Title>
        <Subtitle>Manage your account and view your garden statistics</Subtitle>
      </PageHeader>
      
      <ContentGrid>
        <ProfileCard>
          <ProfileHeader>
            <ProfileAvatar>
              <FiUser />
            </ProfileAvatar>
            <ProfileName>{userInfo?.name}</ProfileName>
            <div>{userInfo?.subscription === 'free' ? 'Free Plan' : userInfo?.subscription === 'premium' ? 'Premium Plan' : 'Annual Plan'}</div>
          </ProfileHeader>
          
          <ProfileDetail>
            <FiMail />
            <div>{userInfo?.email}</div>
          </ProfileDetail>
          
          <ProfileDetail>
            <FiMapPin />
            <div>{userInfo?.location || 'No location set'}</div>
          </ProfileDetail>
          
          <ProfileDetail>
            <FiCalendar />
            <div>Joined {new Date(userInfo?.createdAt).toLocaleDateString()}</div>
          </ProfileDetail>
          
          <ProfileStats>
            <StatCard>
              <StatNumber>{gardens?.length || 0}</StatNumber>
              <StatLabel>Gardens</StatLabel>
            </StatCard>
            <StatCard>
              <StatNumber>0</StatNumber>
              <StatLabel>Plants</StatLabel>
            </StatCard>
          </ProfileStats>
          
          <EditButton onClick={() => setEditMode(!editMode)}>
            <FiEdit2 />
            {editMode ? 'Cancel Editing' : 'Edit Profile'}
          </EditButton>
        </ProfileCard>
        
        <TabsContainer>
          <TabNavigation>
            <TabButton
              active={activeTab === 'gardens'}
              onClick={() => setActiveTab('gardens')}
            >
              Your Gardens
            </TabButton>
            <TabButton
              active={activeTab === 'settings'}
              onClick={() => setActiveTab('settings')}
            >
              Account Settings
            </TabButton>
          </TabNavigation>
          
          <TabContent>
            {activeTab === 'gardens' && (
              <>
                {gardens && gardens.length > 0 ? (
                  <GardenGrid>
                    {gardens.map((garden) => (
                      <GardenCard key={garden._id} to={`/gardens/${garden._id}`}>
                        <GardenTitle>{garden.name}</GardenTitle>
                        <GardenInfo>
                          <span>{garden.elements?.length || 0} elements</span>
                          <span>{garden.dimensions.width}×{garden.dimensions.height}{garden.dimensions.unit}</span>
                        </GardenInfo>
                      </GardenCard>
                    ))}
                  </GardenGrid>
                ) : (
                  <EmptyState>
                    <GiPlantRoots />
                    <h3>No Gardens Yet</h3>
                    <p>Start planning your garden by creating your first layout</p>
                    <Link to="/garden-planner" className="btn btn-primary">
                      Create Garden
                    </Link>
                  </EmptyState>
                )}
              </>
            )}
            
            {activeTab === 'settings' && (
              <>
                {error && (
                  <Message className="error">
                    <FiAlertCircle />
                    <span>{error}</span>
                  </Message>
                )}
                
                {success && (
                  <Message className="success">
                    <FiCheckCircle />
                    <span>Profile updated successfully!</span>
                  </Message>
                )}
                
                <Form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <InputGroup>
                      <FiUser />
                      <Input
                        type="text"
                        id="name"
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
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </InputGroup>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="location">Location</label>
                    <InputGroup>
                      <FiMapPin />
                      <Input
                        type="text"
                        id="location"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="City, Country"
                      />
                    </InputGroup>
                    <small>This helps us provide localized planting schedules and weather alerts</small>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="password">Password (leave blank to keep current)</label>
                    <InputGroup>
                      <FiLock />
                      <Input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="New password"
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
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm new password"
                      />
                    </InputGroup>
                  </div>
                  
                  <SaveButton type="submit" disabled={loading}>
                    {loading ? 'Saving...' : 'Save Changes'}
                  </SaveButton>
                </Form>
              </>
            )}
          </TabContent>
        </TabsContainer>
      </ContentGrid>
    </PageContainer>
  );
};

export default ProfilePage;
