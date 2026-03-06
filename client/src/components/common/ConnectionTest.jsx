import React, { useState, useEffect } from 'react';
import './ConnectionTest.css';

function ConnectionTest() {
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('Testing connection...');
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    testBackendConnection();
  }, []);

  const testBackendConnection = async () => {
    try {
      setStatus('loading');
      setMessage('Testing connection...');
      setError(null);

      // Use relative URL /api which will be proxied to backend
      const response = await fetch('/api/connection-test');

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}: ${response.statusText}`);
      }

      const responseData = await response.json();
      setData(responseData);
      setStatus('success');
      setMessage('✅ Successfully connected to backend!');
    } catch (err) {
      setStatus('error');
      setMessage('❌ Failed to connect to backend');
      setError(err.message);
      console.error('Connection test error:', err);
    }
  };

  return (
    <div className="connection-test-container">
      <div className={`status-card ${status}`}>
        <h2>Frontend-Backend Connection Test</h2>

        <div className={`status-badge ${status}`}>
          {status === 'loading' && '⏳ Loading...'}
          {status === 'success' && '✅ Success'}
          {status === 'error' && '❌ Error'}
        </div>

        <p className="message">{message}</p>

        {data && (
          <div className="response-data">
            <h3>Response from Backend:</h3>
            <pre>{JSON.stringify(data, null, 2)}</pre>
          </div>
        )}

        {error && (
          <div className="error-details">
            <h3>Error Details:</h3>
            <p>{error}</p>
          </div>
        )}

        <button onClick={testBackendConnection} className="retry-btn">
          Retry Connection
        </button>
      </div>
    </div>
  );
}

export default ConnectionTest;
