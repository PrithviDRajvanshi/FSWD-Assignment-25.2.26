import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, loading, logout, isAuthenticated } = useAuth();

  useEffect(() => {
    // If loading is complete and user is not authenticated, redirect to login
    if (!loading && !isAuthenticated()) {
      navigate('/login');
    }
  }, [loading, navigate, isAuthenticated]);

  // Show loading state while context is initializing
  if (loading) {
    return <div style={styles.container}>Loading...</div>;
  }

  // If not authenticated, show nothing (redirect will happen in useEffect)
  if (!isAuthenticated()) {
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={styles.container}>
      <h1>Dashboard</h1>
      {user ? (
        <div>
          <p>Welcome, <strong>{user.name}</strong></p>
          <p>Email: {user.email}</p>
          <p>Member since: {new Date(user.createdAt).toLocaleDateString()}</p>
          <button onClick={handleLogout} style={styles.logout}>Logout</button>
        </div>
      ) : (
        <p>No user information available.</p>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: '40px 20px',
    textAlign: 'center',
  },
  logout: {
    marginTop: 12,
    padding: '8px 12px',
    cursor: 'pointer'
  }
};

export default Dashboard;
