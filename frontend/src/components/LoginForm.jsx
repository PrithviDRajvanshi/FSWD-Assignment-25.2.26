import React, { useState } from 'react';

const LoginForm = ({ onSubmit, loading = false, submissionError = '' }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validationError, setValidationError] = useState('');

  const errorMessage = validationError || submissionError;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setValidationError('');

    if (!email || !password) {
      setValidationError('Please provide email and password.');
      return;
    }

    await onSubmit({ email, password });
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      {errorMessage ? (
        <div role="alert" style={styles.error}>
          {errorMessage}
        </div>
      ) : null}

      <label htmlFor="login-email" style={styles.label}>
        Email
      </label>
      <input
        id="login-email"
        name="email"
        style={styles.input}
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="you@example.com"
      />

      <label htmlFor="login-password" style={styles.label}>
        Password
      </label>
      <input
        id="login-password"
        name="password"
        style={styles.input}
        type="password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        placeholder="password"
      />

      <button style={styles.button} type="submit" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
};

const styles = {
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    marginTop: 12,
  },
  label: { textAlign: 'left' },
  input: { padding: 8, fontSize: 16 },
  button: { padding: '10px 16px', fontSize: 16, cursor: 'pointer' },
  error: { color: 'red' },
};

export default LoginForm;
