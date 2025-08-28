import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const adminService = {
  // Dashboard Statistics
  getDashboardStats: async () => {
    const response = await api.get('/admin/dashboard/stats');
    return response.data;
  },

  // User Management
  getAllUsers: async () => {
    const response = await api.get('/admin/users');
    return response.data;
  },

  getAllLecturers: async () => {
    const response = await api.get('/admin/lecturers');
    return response.data;
  },

  getAllStudents: async () => {
    const response = await api.get('/admin/students');
    return response.data;
  },

  createLecturer: async (lecturerData) => {
    const response = await api.post('/admin/lecturers', lecturerData);
    return response.data;
  },

  updateUser: async (userId, userData) => {
    const response = await api.put(`/admin/users/${userId}`, userData);
    return response.data;
  },

  deleteUser: async (userId) => {
    const response = await api.delete(`/admin/users/${userId}`);
    return response.data;
  },

  // Course Management
  getAllCourses: async () => {
    const response = await api.get('/admin/courses');
    return response.data;
  },

  createCourse: async (courseData) => {
    const response = await api.post('/admin/courses', courseData);
    return response.data;
  },

  updateCourse: async (courseId, courseData) => {
    const response = await api.put(`/admin/courses/${courseId}`, courseData);
    return response.data;
  },

  deleteCourse: async (courseId) => {
    const response = await api.delete(`/admin/courses/${courseId}`);
    return response.data;
  },

  assignCourseToLecturer: async (courseId, lecturerId) => {
    const response = await api.put(`/admin/courses/${courseId}/assign`, { lecturerId });
    return response.data;
  },

  // System Management
  getSystemSettings: async () => {
    const response = await api.get('/admin/system/settings');
    return response.data;
  },

  updateSystemSettings: async (settings) => {
    const response = await api.put('/admin/system/settings', settings);
    return response.data;
  }
};

export default adminService;
