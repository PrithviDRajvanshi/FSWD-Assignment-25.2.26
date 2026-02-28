import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const stored = localStorage.getItem('user');

    if (!token) {
      navigate('/login');
      return;
    }

    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch (err) {
        // ignore
      }
    }

    // try to fetch fresh user info
    const fetchMe = async () => {
      try {
        const res = await fetch('/api/users/me', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          // token might be invalid
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          navigate('/login');
          return;
        }

        const data = await res.json();
        setUser(data);
        localStorage.setItem('user', JSON.stringify(data));
      } catch (err) {
        setError('Unable to fetch user info');
      } finally {
        setLoading(false);
      }
    };

    fetchMe();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (loading) {
    return <div style={styles.container}>Loading...</div>;
  }

  return (
    <div style={styles.container}>
      <h1>Dashboard</h1>
      {error && <div style={{ color: 'red' }}>{error}</div>}
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
