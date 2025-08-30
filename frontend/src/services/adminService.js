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
  console.log('Request interceptor - Token:', token ? 'Present' : 'Missing');
  console.log('Request URL:', config.baseURL + config.url);
  console.log('Request method:', config.method);
  console.log('Request data:', config.data);
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    console.log('Response received:', response.status, response.data);
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.status, error.response?.data);
    return Promise.reject(error);
  }
);

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

  updateLecturer: async (lecturerId, lecturerData) => {
    const response = await api.put(`/admin/lecturers/${lecturerId}`, lecturerData);
    return response.data;
  },

  updateLecturerStatus: async (lecturerId, status) => {
    const response = await api.put(`/admin/lecturers/${lecturerId}/status`, { active: status });
    return response.data;
  },

  updateStudent: async (studentId, studentData) => {
    const response = await api.put(`/admin/students/${studentId}`, studentData);
    return response.data;
  },

  updateStudentStatus: async (studentId, status) => {
    const response = await api.put(`/admin/students/${studentId}/status`, { active: status });
    return response.data;
  },

  updateUser: async (userId, userData) => {
    const response = await api.put(`/admin/users/${userId}`, userData);
    return response.data;
  },

  updateUserStatus: async (userId, status) => {
    const response = await api.put(`/admin/users/${userId}/status`, { active: status });
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

  // Degree Management
  getAllDegrees: async () => {
    const response = await api.get('/degrees');
    return response.data;
  },

  createDegree: async (degreeData) => {
    const response = await api.post('/degrees', degreeData);
    return response.data;
  },

  updateDegree: async (degreeId, degreeData) => {
    const response = await api.put(`/degrees/${degreeId}`, degreeData);
    return response.data;
  },

  deleteDegree: async (degreeId) => {
    const response = await api.delete(`/degrees/${degreeId}`);
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
