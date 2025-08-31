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

const studentService = {
  // Dashboard
  getDashboardData: async () => {
    const response = await api.get('/student/dashboard');
    return response.data;
  },

  // Course Management
  getAllAvailableCourses: async () => {
    const response = await api.get('/student/courses');
    return response.data;
  },

  getAvailableCourses: async () => {
    const response = await api.get('/student/courses');
    return response.data;
  },

  getCourseById: async (courseId) => {
    const response = await api.get(`/student/courses/${courseId}`);
    return response.data;
  },

  // Enrollment Management
  enrollToCourse: async (courseId) => {
    const response = await api.post('/student/enrollments', { courseId });
    return response.data;
  },

  enrollInCourse: async (courseId) => {
    const response = await api.post('/student/enrollments', { courseId });
    return response.data;
  },

  getMyEnrollments: async () => {
    const response = await api.get('/student/enrollments');
    return response.data;
  },

  dropCourse: async (enrollmentId) => {
    const response = await api.delete(`/student/enrollments/${enrollmentId}`);
    return response.data;
  },

  // Grade Management
  getMyGrades: async () => {
    const response = await api.get('/student/grades');
    return response.data;
  },

  getCourseGrades: async (courseId) => {
    const response = await api.get(`/student/courses/${courseId}/grades`);
    return response.data;
  },

  // Course Materials
  getCourseMaterials: async (courseId) => {
    const response = await api.get(`/student/courses/${courseId}/materials`);
    return response.data;
  },

  // Course Students (for viewing classmates)
  getCourseStudents: async (courseId) => {
    const response = await api.get(`/student/courses/${courseId}/students`);
    return response.data;
  },

  getTranscript: async () => {
    const response = await api.get('/student/transcript');
    return response.data;
  },

  downloadTranscript: async () => {
    const response = await api.get('/student/transcript/download', {
      responseType: 'blob'
    });
    return response.data;
  },

  // Assignment Management
  getMyAssignments: async () => {
    const response = await api.get('/student/assignments');
    return response.data;
  },

  getCourseAssignments: async (courseId) => {
    const response = await api.get(`/student/courses/${courseId}/assignments`);
    return response.data;
  },

  submitAssignment: async (assignmentId, submissionData) => {
    const formData = new FormData();
    
    if (submissionData.file) {
      formData.append('file', submissionData.file);
    }
    
    if (submissionData.text) {
      formData.append('submissionText', submissionData.text);
    }

    const response = await api.post(`/student/assignments/${assignmentId}/submit`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  getSubmission: async (assignmentId) => {
    const response = await api.get(`/student/assignments/${assignmentId}/submission`);
    return response.data;
  },

  // Profile Management
  getProfile: async () => {
    const response = await api.get('/student/profile');
    return response.data;
  },

  updateProfile: async (profileData) => {
    const response = await api.put('/student/profile', profileData);
    return response.data;
  },

  changePassword: async (passwordData) => {
    const response = await api.put('/student/profile/password', passwordData);
    return response.data;
  },

  uploadProfilePicture: async (file) => {
    const formData = new FormData();
    formData.append('profilePicture', file);

    const response = await api.post('/student/profile/picture', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
};

export default studentService;
