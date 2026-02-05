import React, { useState, useEffect } from 'react';
import { auth } from '../firebase';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ProtectedRoute = ({ children, requiredRole }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        navigate('/auth');
        return;
      }

      try {
        const token = await currentUser.getIdToken();
        const { data } = await axios.get('http://localhost:5000/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(data.user);

        // Check if user is verified
        if (!data.user.isVerified) {
          navigate('/auth');
          return;
        }

        // Check role if required
        if (requiredRole && data.user.role !== requiredRole) {
          navigate('/dashboard'); // Redirect to staff dashboard if not authorized
          return;
        }
      } catch (err) {
        console.error('Auth check failed:', err);
        navigate('/auth');
        return;
      }

      setLoading(false);
    };

    checkAuth();
  }, [navigate, requiredRole]);

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: '#0a0a0a'
      }}>
        <div style={{ color: '#fff', fontSize: '1.2rem' }}>Loading...</div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
