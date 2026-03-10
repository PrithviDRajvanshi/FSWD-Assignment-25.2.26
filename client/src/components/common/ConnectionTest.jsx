import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { toast } from 'react-toastify';
import './ConnectionTest.css';

function ConnectionTest() {
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('Testing connection...');
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const testBackendConnection = async () => {
    try {
      setStatus('loading');
      setMessage('Testing connection...');
      setError(null);

      // Use relative URL /api which will be proxied to backend
      const response = await api.get('/connection-test');

      const responseData = response.data;
      setData(responseData);
      setStatus('success');
      setMessage('✅ Successfully connected to backend!');
    } catch (err) {
      setStatus('error');
      setMessage('❌ Failed to connect to backend');
      const msg = err.response?.data?.message || err.message;
      setError(msg);
      toast.error(msg);
      console.error('Connection test error:', err);
    }
  };

  useEffect(() => {
    testBackendConnection();
  }, []);

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
        <button
          className="retry-btn"
          style={{ marginLeft: '8px' }}
          onClick={async () => {
            try {
              await api.get('/test-error');
            } catch (err) {
              const msg = err.response?.data?.message || err.message;
              toast.error(msg);
            }
          }}
        >
          Trigger Backend Error
        </button>
      </div>
    </div>
  );
}

export default ConnectionTest;
