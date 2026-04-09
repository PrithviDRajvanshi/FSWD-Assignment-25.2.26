import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'react-toastify';
import LoginForm from '../components/LoginForm';

const Login = () => {
  const navigate = useNavigate();
  const { login, loading } = useAuth();
  const [error, setError] = useState('');

  const handleSubmit = async ({ email, password }) => {
    setError('');

    const result = await login(email, password);
    if (result.success) {
      // redirect to dashboard
      navigate('/dashboard');
    } else {
      const msg = result.error || 'Login failed';
      setError(msg);
      toast.error(msg);
    }
  };

  return (
    <div style={styles.container}>
      <h1>Login</h1>

      <LoginForm
        onSubmit={handleSubmit}
        loading={loading}
        submissionError={error}
      />

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
    maxWidth: 480,
    margin: '0 auto',
  },
};

export default Login;
