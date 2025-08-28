import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { Container, CircularProgress, Box } from '@mui/material';

// Auth Components
import Login from './components/auth/Login';
import Register from './components/auth/Register';

// Dashboard Components
import AdminDashboard from './components/admin/AdminDashboard';
import LecturerDashboard from './components/lecturer/LecturerDashboard';
import StudentDashboard from './components/student/StudentDashboard';

// Common Components
import ProtectedRoute from './components/common/ProtectedRoute';
import Layout from './components/common/Layout';

function App() {
  const { user, loading } = useAuth();

  console.log('App.js - Current user:', user, 'Loading:', loading);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" disableGutters>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
        <Route path="/register" element={!user ? <Register /> : <Navigate to="/dashboard" />} />
        
        {/* Protected Routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Layout>
              {user?.role === 'ADMIN' && <AdminDashboard />}
              {user?.role === 'LECTURER' && <LecturerDashboard />}
              {user?.role === 'STUDENT' && <StudentDashboard />}
            </Layout>
          </ProtectedRoute>
        } />

        {/* Admin Routes */}
        <Route path="/admin/*" element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <Layout>
              <AdminDashboard />
            </Layout>
          </ProtectedRoute>
        } />

        {/* Lecturer Routes */}
        <Route path="/lecturer/*" element={
          <ProtectedRoute allowedRoles={['LECTURER']}>
            <Layout>
              <LecturerDashboard />
            </Layout>
          </ProtectedRoute>
        } />

        {/* Student Routes */}
        <Route path="/student/*" element={
          <ProtectedRoute allowedRoles={['STUDENT']}>
            <Layout>
              <StudentDashboard />
            </Layout>
          </ProtectedRoute>
        } />

        {/* Default Routes */}
        <Route path="/" element={
          user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />
        } />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Container>
  );
}

export default App;
