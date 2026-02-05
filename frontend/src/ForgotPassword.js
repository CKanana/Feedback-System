import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import './App.css';

const ForgotPasswordPage = () => {
  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)'
    }}>
      <ForgotPassword />
    </div>
  );
};

const ForgotPassword = () => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const logoUrl = process.env.PUBLIC_URL + '/vp-pic.png';

  // Modern Orb Component
  const ModernOrb = () => (
    <div className="modern-orb-container">
      <div className="modern-orb"></div>
    </div>
  );

  // Yup schema for validation
  const forgotPasswordSchema = Yup.object({
    email: Yup.string().email('Invalid email').required('Email is required'),
  });

  const handleSubmit = (values, { setSubmitting }) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setSubmitting(false);
      console.log(`[Dev Mode] Password Reset Link: http://localhost:3000/reset-password?email=${encodeURIComponent(values.email)}`);
    }, 1400);
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-left">
        <ModernOrb />
      </div>
      <div className="auth-right">
        <div className="auth-right-content">
          <img src={logoUrl} alt="Virtual Pay Logo" className="auth-logo" />
          <h2 className="login h2" style={{ color: '#fff', fontSize: '2rem', marginBottom: '0.5rem' }}>Forgot Password</h2>
          <div className="auth-subtitle">Enter your email to reset your password</div>
          {submitted ? (
            <div style={{ color: '#F7941E', fontWeight: 600, marginTop: '2rem', fontSize: '1.1rem' }}>
              If an account exists, a reset link has been sent to your email.
            </div>
          ) : (
            <Formik
              initialValues={{ email: '' }}
              validationSchema={forgotPasswordSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting }) => (
                <Form className="auth-form">
                  <div className="input-icon-wrapper">
                    <span className="input-icon" aria-hidden="true">
                      {/* Email icon */}
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F7941E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="14" rx="3"/><path d="M3 7l9 6 9-6"/></svg>
                    </span>
                    <Field
                      type="email"
                      name="email"
                      placeholder="Email"
                      className="auth-input"
                      style={{ paddingLeft: '2.2rem' }}
                    />
                    <ErrorMessage name="email" component="div" style={{ color: '#F7941E', fontSize: '0.95em', marginTop: '2px', marginLeft: '4px' }} />
                  </div>
                  <button type="submit" className="auth-btn" disabled={isSubmitting || loading}>
                    {loading && <span className="spinner" />}
                    Send Reset Link
                  </button>
                </Form>
              )}
            </Formik>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
