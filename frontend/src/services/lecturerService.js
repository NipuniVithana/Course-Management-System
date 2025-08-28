import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const lecturerService = {
  // Dashboard
  getDashboardData: async () => {
    const response = await api.get('/lecturer/dashboard');
    return response.data;
  },

  // Course Management
  getMyCourses: async () => {
    const response = await api.get('/lecturer/courses');
    return response.data;
  },

  getCourseById: async (courseId) => {
    const response = await api.get(`/lecturer/courses/${courseId}`);
    return response.data;
  },

  // Student Management
  getEnrolledStudents: async (courseId) => {
    const response = await api.get(`/lecturer/courses/${courseId}/students`);
    return response.data;
  },

  getStudentDetails: async (studentId) => {
    const response = await api.get(`/lecturer/students/${studentId}`);
    return response.data;
  },

  // Assignment Management
  createAssignment: async (assignmentData) => {
    const response = await api.post('/lecturer/assignments', assignmentData);
    return response.data;
  },

  getAssignments: async (courseId) => {
    const response = await api.get(`/lecturer/courses/${courseId}/assignments`);
    return response.data;
  },

  updateAssignment: async (assignmentId, assignmentData) => {
    const response = await api.put(`/lecturer/assignments/${assignmentId}`, assignmentData);
    return response.data;
  },

  deleteAssignment: async (assignmentId) => {
    const response = await api.delete(`/lecturer/assignments/${assignmentId}`);
    return response.data;
  },

  // Submission Management
  getSubmissions: async (assignmentId) => {
    const response = await api.get(`/lecturer/assignments/${assignmentId}/submissions`);
    return response.data;
  },

  gradeSubmission: async (submissionId, gradeData) => {
    const response = await api.put(`/lecturer/submissions/${submissionId}/grade`, gradeData);
    return response.data;
  },

  // Grade Management
  setFinalGrade: async (enrollmentId, gradeData) => {
    const response = await api.put(`/lecturer/enrollments/${enrollmentId}/grade`, gradeData);
    return response.data;
  },

  getCourseGrades: async (courseId) => {
    const response = await api.get(`/lecturer/courses/${courseId}/grades`);
    return response.data;
  },

  exportGrades: async (courseId) => {
    const response = await api.get(`/lecturer/courses/${courseId}/grades/export`, {
      responseType: 'blob'
    });
    return response.data;
  }
};

export default lecturerService;
