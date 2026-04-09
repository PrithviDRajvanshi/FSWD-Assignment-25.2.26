import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div style={styles.container}>
      <h1>Welcome to BlogHub</h1>
      <p>A platform for writers to publish, connect, and grow their audience.</p>
      <div style={styles.features}>
        <div style={styles.feature}>
          <h3>Easy Publishing</h3>
          <p>Write and publish in minutes</p>
        </div>
        <div style={styles.feature}>
          <h3>Build Audience</h3>
          <p>Grow your follower base</p>
        </div>
        <div style={styles.feature}>
          <h3>Rich Editor</h3>
          <p>Beautiful formatting tools</p>
        </div>
      </div>
      <Link to="/register" style={styles.cta}>Get Started</Link>
    </div>
  );
};

const styles = {
  container: {
    padding: '40px 20px',
    textAlign: 'center',
  },
  features: {
    display: 'flex',
    justifyContent: 'space-around',
    marginTop: '30px',
  },
  feature: {
    maxWidth: '200px',
  },
  cta: {
    display: 'inline-block',
    marginTop: '30px',
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: '#fff',
    textDecoration: 'none',
    borderRadius: '4px',
  },
};

export default Home;
