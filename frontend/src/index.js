import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ModernLandingPage from './ModernLandingPage';
import LandingPage from './LandingPage';
import AuthenticationPage from './AuthenticationPage';
import ForgotPassword from './ForgotPassword';
import StaffDashboard from './StaffDashboard';
import Profile from './Profile';
import AdminDashboard from './admin';
import AdminProfile from './AdminProfile';
import EmailVerified from './EmailVerified';
import ProtectedRoute from './components/ProtectedRoute';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<ModernLandingPage />} />
        <Route path="/classic" element={<LandingPage />} />
        <Route path="/auth" element={<AuthenticationPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/dashboard" element={<StaffDashboard />} />
        <Route path="/dashboard/:id" element={<StaffDashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/:id" element={<AdminDashboard />} />
        <Route path="/admin-profile" element={<AdminProfile />} />
        <Route path="/email-verified" element={<EmailVerified />} />
      </Routes>
    </Router>
  </React.StrictMode>
);




