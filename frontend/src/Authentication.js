import React, { useState, useEffect } from 'react';
import { auth } from './firebase';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import axios from 'axios';
import SuccessToast from './SuccessToast';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useNavigate, useLocation } from 'react-router-dom';
import './flip-transition.css';

const RotatingOrbImage = ({ src }) => (
  <div className="modern-orb-container">
    <div className="modern-orb"></div>
  </div>
);

const Authentication = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showSignupConfirm, setShowSignupConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const orbUrl = process.env.PUBLIC_URL + '/orb.png';
  const logoUrl = process.env.PUBLIC_URL + '/vp-pic.png';
  const [verificationNeeded, setVerificationNeeded] = useState(false);

  // Check for verification success from URL (if redirected by backend)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('verified') === 'true') {
      setToastMessage('Email verified successfully! Please log in.');
      setShowSuccessToast(true);
      // Clean URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [location]);

  // Formik/Yup validation schema
  const loginSchema = Yup.object().shape({
    username: Yup.string().required('Username or Email is required'),
    password: Yup.string().required('Password is required'),
  });

  const handleLogin = async (values, { setSubmitting }) => {
    setVerificationNeeded(false);
    try {
      // 1. Call backend login endpoint to get JWT
      const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
        email: values.username,
        password: values.password
      });

      // 2. If login successful, store token
      if (loginResponse.data.token) {
        localStorage.setItem('token', loginResponse.data.token);
        // 3. Fetch user profile to get role and id
        const profileResponse = await axios.get('http://localhost:5000/api/auth/me', {
          headers: { Authorization: `Bearer ${loginResponse.data.token}` }
        });
        const user = profileResponse.data.user;
        setLoading(false);
        setSubmitting(false);
        // 4. Navigate based on role
        if (user.role === 'admin') {
          navigate(`/admin/${user._id}`);
        } else {
          navigate(`/dashboard/${user._id}`);
        }
      }
    } catch (error) {
      setLoading(false);
      setSubmitting(false);
      const msg = error.response?.data?.message || error.message || 'Login failed! Check your connection.';
      setToastMessage(msg);
      setShowSuccessToast(true);
    }
  };

// Signup schema using Yup object style
const signupSchema = Yup.object({
  username: Yup.string().required('Username is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirm your password'),
});

  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const handleSignup = async (values, { setSubmitting }) => {
    setLoading(true);
    try {
      // 1. Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        values.email,
        values.password
      );
      // 2. Send verification email
      await sendEmailVerification(userCredential.user);

      // 3. Save user in MongoDB via backend
      await axios.post('http://localhost:5000/api/auth/signup', {
        name: values.username,
        email: values.email,
        password: values.password, // Optionally send or hash on backend
        role: values.role || 'staff',
        firebaseUid: userCredential.user.uid
      });

      setLoading(false);
      setSubmitting(false);
      setToastMessage('Signup successful! Please check your email and verify your account.');
      setShowSuccessToast(true);
      setTimeout(() => {
        setShowSuccessToast(false);
        setIsLogin(true);
        navigate('/auth');
      }, 3500);
    } catch (error) {
      setLoading(false);
      setSubmitting(false);
      const serverMessage = error.response?.data?.message;
      setToastMessage(serverMessage || error.message || 'Signup failed! Check your connection.');
      setShowSuccessToast(true);
    }
  };

  const handleResendVerification = async () => {
    if (auth.currentUser) {
      try {
        await sendEmailVerification(auth.currentUser);
        setToastMessage('Verification email resent! Check your inbox.');
        setShowSuccessToast(true);
      } catch (error) {
        setToastMessage('Error sending email: ' + error.message);
        setShowSuccessToast(true);
      }
    }
  };

  return (
    <div className="auth-wrapper">
      {showSuccessToast && (
        <SuccessToast message={toastMessage} onClose={() => setShowSuccessToast(false)} />
      )}
      {/* Left Side: Modern Orb */}
      <div className="auth-left">
        <RotatingOrbImage />
      </div>
      {/* Right Side: Form */}
      <div className="auth-right">
        {isLogin ? (
          <div className="auth-right-content">
            <img src={logoUrl} alt="Virtual Pay Logo" className="auth-logo" />
            <h2 className="login h2" style={{ color: '#fff' }}>Welcome Back</h2>
            <div className="auth-subtitle">Log in to your account</div>
            <Formik
              initialValues={{ username: '', password: '' }}
              validationSchema={loginSchema}
              onSubmit={handleLogin}
            >
              {({ isSubmitting, values }) => (
                <Form className="auth-form" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {/* Login Form Fields */}
                  <div className="input-icon-wrapper">
                    <span className="input-icon" aria-hidden="true">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#B24592" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="14" rx="3"/><path d="M3 7l9 6 9-6"/></svg>
                    </span>
                    <Field type="text" name="username" placeholder="Username or Email" className="auth-input" style={{ paddingLeft: '2.2rem' }} />
                    <ErrorMessage name="username" component="div" style={{ color: '#F7941E', fontSize: '0.95em', marginTop: '2px', marginLeft: '4px' }} />
                  </div>
                  <div className="input-icon-wrapper password-wrapper">
                    <span className="input-icon" aria-hidden="true">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#B24592" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="11" width="14" height="8" rx="2"/><path d="M12 17v-3"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                    </span>
                    <Field type={showPassword ? 'text' : 'password'} name="password" placeholder="Password" className="auth-input" style={{ paddingLeft: '2.2rem' }} />
                    <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? 'Hide password' : 'Show password'}>
                      {showPassword ? <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#7D1F4B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="12" rx="7" ry="5"/><circle cx="12" cy="12" r="2.5"/></svg> : <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#7D1F4B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="12" rx="7" ry="5"/><circle cx="12" cy="12" r="2.5"/><line x1="4" y1="4" x2="20" y2="20"/></svg>}
                    </button>
                    <ErrorMessage name="password" component="div" style={{ color: '#F7941E', fontSize: '0.95em', marginTop: '2px', marginLeft: '4px' }} />
                  </div>
                  <div className="auth-forgot"><span style={{ cursor: 'pointer' }} onClick={() => navigate('/forgot-password')}>Forgot password?</span></div>
                  <div className="auth-switch-text" style={{ marginBottom: 0, marginTop: 0 }}>
                    Need an account?
                    <span className="auth-switch-link" style={{ color: '#F7941E', cursor: 'pointer', textDecoration: 'underline', marginLeft: '5px' }} onClick={() => setIsLogin(false)}>Sign Up</span>
                  </div>
                  {verificationNeeded && (
                    <div style={{ textAlign: 'center', marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                      <button type="button" onClick={handleResendVerification} style={{ background: 'none', border: 'none', color: '#fff', textDecoration: 'underline', cursor: 'pointer', fontSize: '0.9rem' }}>Resend Verification Email</button>
                    </div>
                  )}
                  <button type="submit" className="auth-btn" disabled={isSubmitting || loading}>
                    {loading ? <span className="spinner" /> : 'Log In'}
                  </button>
                </Form>
              )}
            </Formik>
          </div>
        ) : (
          <div className="auth-right-content">
            <img src={logoUrl} alt="Virtual Pay Logo" className="auth-logo" />
            <div className="signup-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', marginTop: '0.5rem' }}>
              <h2 className="signup h2" style={{ color: '#fff', marginBottom: '1.2rem' }}>Create an Account</h2>
              <Formik initialValues={{ username: '', email: '', password: '', confirmPassword: '', role: 'staff' }} validationSchema={signupSchema} onSubmit={handleSignup}>
                {({ isSubmitting }) => (
                  <Form className="auth-form" style={{ display: 'flex', flexDirection: 'column', gap: '14px', width: '100%', maxWidth: '300px' }}>
                    {/* Signup Form Fields */}
                    <div className="input-icon-wrapper" style={{ width: '100%' }}>
                      <span className="input-icon" aria-hidden="true"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#B24592" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 4-7 8-7s8 3 8 7"/></svg></span>
                      <Field type="text" name="username" placeholder="Username" className="auth-input" style={{ paddingLeft: '2.2rem', fontSize: '0.95rem' }} />
                      <ErrorMessage name="username" component="div" style={{ color: '#F7941E', fontSize: '0.95em', marginTop: '2px', marginLeft: '4px' }} />
                    </div>
                    <div className="input-icon-wrapper" style={{ width: '100%' }}>
                      <span className="input-icon" aria-hidden="true"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#B24592" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="14" rx="3"/><path d="M3 7l9 6 9-6"/></svg></span>
                      <Field type="email" name="email" placeholder="Email" className="auth-input" style={{ paddingLeft: '2.2rem', fontSize: '0.95rem' }} />
                      <ErrorMessage name="email" component="div" style={{ color: '#F7941E', fontSize: '0.95em', marginTop: '2px', marginLeft: '4px' }} />
                    </div>
                    <div className="input-icon-wrapper password-wrapper" style={{ width: '100%' }}>
                      <span className="input-icon" aria-hidden="true"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#B24592" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="11" width="14" height="8" rx="2"/><path d="M12 17v-3"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg></span>
                      <Field type={showSignupPassword ? 'text' : 'password'} name="password" placeholder="Password" className="auth-input" style={{ paddingLeft: '2.2rem', fontSize: '0.95rem' }} />
                      <button type="button" className="password-toggle" onClick={() => setShowSignupPassword(!showSignupPassword)} aria-label={showSignupPassword ? 'Hide password' : 'Show password'}>
                        {showSignupPassword ? <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#7D1F4B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="12" rx="7" ry="5"/><circle cx="12" cy="12" r="2.5"/></svg> : <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#7D1F4B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="12" rx="7" ry="5"/><circle cx="12" cy="12" r="2.5"/><line x1="4" y1="4" x2="20" y2="20"/></svg>}
                      </button>
                      <ErrorMessage name="password" component="div" style={{ color: '#F7941E', fontSize: '0.95em', marginTop: '2px', marginLeft: '4px' }} />
                    </div>
                    <div className="input-icon-wrapper password-wrapper" style={{ width: '100%' }}>
                      <span className="input-icon" aria-hidden="true"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#B24592" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="11" width="14" height="8" rx="2"/><path d="M12 17v-3"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg></span>
                      <Field type={showSignupConfirm ? 'text' : 'password'} name="confirmPassword" placeholder="Confirm Password" className="auth-input" style={{ paddingLeft: '2.2rem', fontSize: '0.95rem' }} />
                      <button type="button" className="password-toggle" onClick={() => setShowSignupConfirm(!showSignupConfirm)} aria-label={showSignupConfirm ? 'Hide password' : 'Show password'}>
                        {showSignupConfirm ? <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#7D1F4B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="12" rx="7" ry="5"/><circle cx="12" cy="12" r="2.5"/></svg> : <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#7D1F4B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="12" rx="7" ry="5"/><circle cx="12" cy="12" r="2.5"/><line x1="4" y1="4" x2="20" y2="20"/></svg>}
                      </button>
                      <ErrorMessage name="confirmPassword" component="div" style={{ color: '#F7941E', fontSize: '0.95em', marginTop: '2px', marginLeft: '4px' }} />
                    </div>
                    <button type="submit" className="auth-btn" disabled={isSubmitting || loading} style={{ fontSize: '1rem', padding: '0.6rem 1.1rem', marginTop: '0.8rem' }}>
                      {loading && <span className="spinner" />}
                      Sign Up
                    </button>
                  </Form>
                )}
              </Formik>
              <div className="auth-switch-text" style={{ marginTop: '1.5rem', fontWeight: 500, fontSize: '1.01rem', color: '#fff' }}>
                Already have an account?
                <span className="auth-switch-link" style={{ color: '#F7941E', marginLeft: '0.4em', cursor: 'pointer', textDecoration: 'underline' }} onClick={() => setIsLogin(true)}>Log In</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Authentication;
