import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './LandingPage';
import AuthenticationPage from './AuthenticationPage';
import ForgotPassword from './ForgotPassword';
import StaffDashboard from './StaffDashboard';
import Profile from './Profile';
import AdminDashboard from './admin';
import AdminProfile from './AdminProfile';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthenticationPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/dashboard" element={<StaffDashboard />} />
        <Route path ="/profile" element={<Profile />}/>
        <Route path ="/admin" element = {<AdminDashboard/>}/>
        <Route path ="/admin-profile" element = {<AdminProfile/>}/>
      </Routes>
    </Router>
  </React.StrictMode>
);




