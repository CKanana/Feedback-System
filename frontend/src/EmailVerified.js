
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './App.css'; // Use your main styles for theme


const EmailVerified = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [status, setStatus] = useState('verifying'); // verifying, success, error
  const [message, setMessage] = useState('Verifying your email...');

  useEffect(() => {
    // Get uid from query params
    const params = new URLSearchParams(location.search);
    const uid = params.get('uid');
    if (!uid) {
      setStatus('error');
      setMessage('Invalid verification link.');
      return;
    }
    // Call backend to verify
    axios.get(`http://localhost:5000/api/auth/verify-email?uid=${encodeURIComponent(uid)}`)
      .then(() => {
        setStatus('success');
        setMessage('Your email has been verified! You can now sign in.');
        setTimeout(() => navigate('/auth?verified=true'), 3000);
      })
      .catch((err) => {
        setStatus('error');
        if (err.response && err.response.data && err.response.data.message) {
          setMessage(err.response.data.message);
        } else {
          setMessage('Verification failed. Please try again or contact support.');
        }
      });
  }, [location, navigate]);

  return (
    <div className="auth-wrapper">
      <div className="auth-right">
        <div className="auth-right-content">
          <h2 className="login h2" style={{ color: '#fff' }}>
            {status === 'verifying' && 'Verifying...'}
            {status === 'success' && 'Email Verified!'}
            {status === 'error' && 'Verification Error'}
          </h2>
          <div className="auth-subtitle" style={{ color: '#F7941E', marginBottom: 24 }}>
            {message}
          </div>
          <button
            className="auth-btn"
            style={{ background: 'linear-gradient(90deg, #B24592 0%, #F15F79 100%)', color: '#fff', fontWeight: 600, borderRadius: 8, padding: '12px 32px', fontSize: '1.1rem', marginTop: 16 }}
            onClick={() => navigate('/auth')}
            disabled={status === 'verifying'}
          >
            Go to Sign In
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmailVerified;
