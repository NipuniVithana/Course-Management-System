import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { ConfigProvider, Spin } from 'antd';

// Auth Components
import Login from './components/auth/Login';
import Register from './components/auth/Register';

// Dashboard Components
import AdminDashboard from './components/admin/AdminDashboard';
import LecturerDashboard from './components/lecturer/LecturerDashboard';
import StudentDashboard from './components/student/StudentDashboard';

// Admin Components
import Students from './components/admin/Students';
import Lecturers from './components/admin/Lecturers';
import Degrees from './components/admin/Degrees';
import Courses from './components/admin/Courses';
import AddCourse from './components/admin/AddCourse';

// Lecturer Components
import MyCourses from './components/lecturer/MyCourses';
import CourseManagement from './components/lecturer/CourseManagement';

// Student Components
// (Student specific components if any)

// Shared Components
import AllCourses from './components/common/AllCourses';

// Common Components
import ProtectedRoute from './components/common/ProtectedRoute';
import Layout from './components/common/Layout';
import Profile from './components/common/Profile';

function App() {
  const { user, loading } = useAuth();

  console.log('App.js - Current user:', user, 'Loading:', loading);

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh' 
      }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#1890ff',
        },
      }}
    >
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

        {/* Profile Route - Available to all authenticated users */}
        <Route path="/profile" element={
          <ProtectedRoute>
            <Layout>
              <Profile />
            </Layout>
          </ProtectedRoute>
        } />

        {/* Admin Routes */}
        <Route path="/admin/students" element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <Layout>
              <Students />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/admin/lecturers" element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <Layout>
              <Lecturers />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/admin/degrees" element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <Layout>
              <Degrees />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/admin/courses" element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <Layout>
              <Courses />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/admin/add-course" element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <Layout>
              <AddCourse />
            </Layout>
          </ProtectedRoute>
        } />

        <Route path="/admin/*" element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <Layout>
              <AdminDashboard />
            </Layout>
          </ProtectedRoute>
        } />

        {/* Lecturer Routes */}
        <Route path="/lecturer/all-courses" element={
          <ProtectedRoute allowedRoles={['LECTURER']}>
            <Layout>
              <AllCourses userRole="LECTURER" />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/lecturer/my-courses" element={
          <ProtectedRoute allowedRoles={['LECTURER']}>
            <Layout>
              <MyCourses userRole="LECTURER" />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/lecturer/course-management/:courseId" element={
          <ProtectedRoute allowedRoles={['LECTURER']}>
            <Layout>
              <CourseManagement />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/lecturer/*" element={
          <ProtectedRoute allowedRoles={['LECTURER']}>
            <Layout>
              <LecturerDashboard />
            </Layout>
          </ProtectedRoute>
        } />

        {/* Student Routes */}
        <Route path="/student/all-courses" element={
          <ProtectedRoute allowedRoles={['STUDENT']}>
            <Layout>
              <AllCourses userRole="STUDENT" />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/student/my-courses" element={
          <ProtectedRoute allowedRoles={['STUDENT']}>
            <Layout>
              <MyCourses userRole="STUDENT" />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/student/course/:courseId" element={
          <ProtectedRoute allowedRoles={['STUDENT']}>
            <Layout>
              <CourseManagement userRole="STUDENT" />
            </Layout>
          </ProtectedRoute>
        } />
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
    </ConfigProvider>
  );
}

export default App;