import React from 'react';
import { Link } from 'react-router-dom';

const Login = () => {
  return (
    <div style={styles.container}>
      <h1>Login</h1>
      <p>Login form will go here in a later lesson.</p>
      <p>
        Don't have an account? <Link to="/register">Register here</Link>
      </p>
    </div>
  );
};

const styles = {
  container: {
    padding: '40px 20px',
    textAlign: 'center',
  },
};

export default Login;
