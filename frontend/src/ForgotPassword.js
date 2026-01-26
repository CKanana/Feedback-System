import React, { useState } from 'react';
import './App.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const logoUrl = process.env.PUBLIC_URL + '/vp-pic.png';

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      console.log(`[Dev Mode] Password Reset Link: http://localhost:3000/reset-password?email=${encodeURIComponent(email)}`);
    }, 1400);
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-left">
        <img src={process.env.PUBLIC_URL + '/orb.png'} alt="Decorative Orb" className="orb-animation" />
      </div>
      <div className="auth-right">
        <div className="auth-right-content">
          <img src={logoUrl} alt="Virtual Pay Logo" className="auth-logo" />
          <h2 className="login h2" style={{ color: '#fff' }}>Forgot Password</h2>
          <div className="auth-subtitle">Enter your email to reset your password</div>
          {submitted ? (
            <div style={{ color: '#7D1F4B', fontWeight: 600, marginTop: '2rem', fontSize: '1.1rem' }}>
              If an account exists, a reset link has been sent to your email.
            </div>
          ) : (
            <form className="auth-form" onSubmit={handleSubmit}>
              <div className="input-icon-wrapper">
                <span className="input-icon" aria-hidden="true">
                  {/* Email icon */}
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#B24592" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="14" rx="3"/><path d="M3 7l9 6 9-6"/></svg>
                </span>
                <input
                  type="email"
                  placeholder="Email"
                  className="auth-input"
                  style={{ paddingLeft: '2.2rem' }}
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="auth-btn" disabled={loading}>
                {loading && <span className="spinner" />}
                Send Reset Link
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
