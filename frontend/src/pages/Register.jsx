import React from 'react';
import { Link } from 'react-router-dom';

const Register = () => {
  return (
    <div style={styles.container}>
      <h1>Create Account</h1>
      <p>Registration form will go here in a later lesson.</p>
      <p>
        Already have an account? <Link to="/login">Login here</Link>
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

export default Register;
