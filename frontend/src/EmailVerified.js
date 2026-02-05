
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './App.css'; // Use your main styles for theme

const EmailVerifiedPage = () => {
  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)'
    }}>
      <EmailVerified />
    </div>
  );
};

const EmailVerified = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [status, setStatus] = useState('verifying'); // verifying, success, error
  const [message, setMessage] = useState('Verifying your email...');

  useEffect(() => {
    // Get oobCode and mode from query params
    const params = new URLSearchParams(location.search);
    const oobCode = params.get('oobCode');
    const mode = params.get('mode');
    if (!oobCode || mode !== 'verifyEmail') {
      setStatus('error');
      setMessage('Invalid verification link.');
      return;
    }
    // Call backend to verify
    axios.get(`http://localhost:5000/api/auth/verify-email?oobCode=${encodeURIComponent(oobCode)}&mode=${encodeURIComponent(mode)}`)
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

  // Handler to request a new verification email
  const handleResendVerification = async () => {
    const params = new URLSearchParams(location.search);
    const oobCode = params.get('oobCode');
    const mode = params.get('mode');
    try {
      // Try to get the email from the action code
      if (oobCode && mode === 'verifyEmail') {
        const info = await axios.get(`http://localhost:5000/api/auth/check-action-code?oobCode=${encodeURIComponent(oobCode)}`);
        const email = info.data.email;
        await axios.post('http://localhost:5000/api/auth/resend-verification', { email });
        setMessage('Verification email resent! Check your inbox.');
      } else {
        setMessage('Cannot resend verification. Invalid link.');
      }
    } catch (err) {
      setMessage('Failed to resend verification email.');
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-left">
        <div className="modern-orb-container">
          <div className="modern-orb"></div>
        </div>
      </div>
      <div className="auth-right">
        <div className="auth-right-content">
          <img src={process.env.PUBLIC_URL + '/vp-pic.png'} alt="Virtual Pay Logo" className="auth-logo" />
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
            onClick={() => navigate('/auth')}
            disabled={status === 'verifying'}
          >
            Go to Sign In
          </button>
          {status === 'error' && (
            <button
              className="auth-btn"
              style={{ marginTop: 12, background: '#F7941E', color: '#fff' }}
              onClick={handleResendVerification}
            >
              Request Another Verification Link
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmailVerifiedPage;
