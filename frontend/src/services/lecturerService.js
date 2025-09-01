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
    const formData = new FormData();
    formData.append('courseId', assignmentData.courseId);
    formData.append('title', assignmentData.title);
    formData.append('description', assignmentData.description);
    formData.append('maxPoints', assignmentData.maxPoints);
    formData.append('dueDate', assignmentData.dueDate);
    
    if (assignmentData.file) {
      formData.append('file', assignmentData.file);
    }
    
    const response = await api.post('/lecturer/assignments', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  getAssignments: async (courseId) => {
    const response = await api.get(`/lecturer/courses/${courseId}/assignments`);
    return response.data;
  },

  updateAssignment: async (assignmentId, assignmentData) => {
    const formData = new FormData();
    formData.append('title', assignmentData.title);
    formData.append('description', assignmentData.description);
    formData.append('maxPoints', assignmentData.maxPoints);
    formData.append('dueDate', assignmentData.dueDate);
    
    if (assignmentData.file) {
      formData.append('file', assignmentData.file);
    }
    
    const response = await api.put(`/lecturer/assignments/${assignmentId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  deleteAssignment: async (assignmentId) => {
    const response = await api.delete(`/lecturer/assignments/${assignmentId}`);
    return response.data;
  },

  downloadAssignmentFile: async (assignmentId) => {
    const response = await api.get(`/lecturer/assignments/${assignmentId}/download`, {
      responseType: 'blob',
    });
    return response;
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
  },

  // Course Browsing and Requests
  getAllAvailableCourses: async () => {
    const response = await api.get('/lecturer/courses/available');
    return response.data;
  },

  getAllDegrees: async () => {
    const response = await api.get('/degrees');
    return response.data;
  },

  registerToCourse: async (courseId) => {
    const response = await api.post(`/lecturer/courses/${courseId}/register`);
    return response.data;
  },

  unregisterFromCourse: async (courseId) => {
    const response = await api.delete(`/lecturer/courses/${courseId}/unregister`);
    return response.data;
  },

  // Course Materials
  getCourseMaterials: async (courseId) => {
    const response = await api.get(`/lecturer/courses/${courseId}/materials`);
    return response.data;
  },

  uploadCourseMaterial: async (courseId, materialData) => {
    const formData = new FormData();
    formData.append('title', materialData.title);
    formData.append('description', materialData.description || '');
    if (materialData.file && materialData.file.fileList && materialData.file.fileList[0]) {
      formData.append('file', materialData.file.fileList[0].originFileObj);
    }
    
    const response = await api.post(`/lecturer/courses/${courseId}/materials`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  updateCourseMaterial: async (courseId, materialId, materialData) => {
    const formData = new FormData();
    formData.append('title', materialData.title);
    formData.append('description', materialData.description || '');
    
    const response = await api.put(`/lecturer/courses/${courseId}/materials/${materialId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  deleteCourseMaterial: async (courseId, materialId) => {
    const response = await api.delete(`/lecturer/courses/${courseId}/materials/${materialId}`);
    return response.data;
  },

  downloadCourseMaterial: async (courseId, materialId) => {
    const response = await api.get(`/lecturer/courses/${courseId}/materials/${materialId}/download`, {
      responseType: 'blob',
    });
    return response;
  },

  // Student Grading
  updateStudentGrade: async (courseId, studentId, gradeData) => {
    const response = await api.put(`/lecturer/courses/${courseId}/students/${studentId}/grade`, gradeData);
    return response.data;
  },

  // Recent Activities
  getRecentActivities: async () => {
    const response = await api.get('/lecturer/recent-activities');
    return response.data;
  },

  // Profile Management
  getProfile: async () => {
    const response = await api.get('/lecturer/profile');
    return response.data;
  },

  updateProfile: async (profileData) => {
    const response = await api.put('/lecturer/profile', profileData);
    return response.data;
  },

  changePassword: async (passwordData) => {
    const response = await api.put('/lecturer/change-password', passwordData);
    return response.data;
  },
};

export default lecturerService;
