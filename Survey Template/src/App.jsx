
import React, { useEffect } from 'react';
import { Route, Routes, BrowserRouter as Router, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { Toaster } from '@/components/ui/toaster';
import ScrollToTop from '@/components/ScrollToTop';
import LoginPage from '@/pages/LoginPage';
import AdminDashboard from '@/pages/AdminDashboard';
import StaffDashboard from '@/pages/StaffDashboard';
import NotAuthorized from '@/pages/NotAuthorized';
import ProtectedRoute from '@/components/ProtectedRoute';
import { initializeMockData } from '@/utils/mockData';

function App() {
  useEffect(() => {
    initializeMockData();
  }, []);

  return (
    <ThemeProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/staff-dashboard"
            element={
              <ProtectedRoute allowedRoles={['admin', 'staff']}>
                <StaffDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/not-authorized" element={<NotAuthorized />} />
        </Routes>
        <Toaster />
      </Router>
    </ThemeProvider>
  );
}

export default App;
