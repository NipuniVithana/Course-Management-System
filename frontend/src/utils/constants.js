// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:8080/api',
  TIMEOUT: 10000,
};

// User Roles
export const USER_ROLES = {
  ADMIN: 'ADMIN',
  LECTURER: 'LECTURER',
  STUDENT: 'STUDENT'
};

// API Endpoints
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password'
  },
  
  // Admin endpoints
  ADMIN: {
    DASHBOARD: '/admin/dashboard/stats',
    USERS: '/admin/users',
    LECTURERS: '/admin/lecturers',
    STUDENTS: '/admin/students',
    COURSES: '/admin/courses',
    SYSTEM_SETTINGS: '/admin/system/settings'
  },
  
  // Lecturer endpoints
  LECTURER: {
    DASHBOARD: '/lecturer/dashboard',
    COURSES: '/lecturer/courses',
    STUDENTS: '/lecturer/students',
    ASSIGNMENTS: '/lecturer/assignments',
    SUBMISSIONS: '/lecturer/submissions',
    GRADES: '/lecturer/grades'
  },
  
  // Student endpoints
  STUDENT: {
    DASHBOARD: '/student/dashboard',
    COURSES: '/student/courses',
    ENROLLMENTS: '/student/enrollments',
    ASSIGNMENTS: '/student/assignments',
    GRADES: '/student/grades',
    PROFILE: '/student/profile',
    TRANSCRIPT: '/student/transcript'
  }
};

// Status Constants
export const ENROLLMENT_STATUS = {
  ENROLLED: 'ENROLLED',
  DROPPED: 'DROPPED',
  COMPLETED: 'COMPLETED'
};

export const SUBMISSION_STATUS = {
  SUBMITTED: 'SUBMITTED',
  GRADED: 'GRADED',
  LATE: 'LATE'
};

export const COURSE_STATUS = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE'
};

export const USER_STATUS = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE'
};

// Grade Constants
export const GRADE_SCALE = {
  'A+': 4.0,
  'A': 4.0,
  'A-': 3.7,
  'B+': 3.3,
  'B': 3.0,
  'B-': 2.7,
  'C+': 2.3,
  'C': 2.0,
  'C-': 1.7,
  'D+': 1.3,
  'D': 1.0,
  'F': 0.0
};

// UI Constants
export const ITEMS_PER_PAGE = 10;

export const THEME_COLORS = {
  ADMIN: '#1976d2',    // Blue
  LECTURER: '#2e7d32', // Green
  STUDENT: '#ed6c02'   // Orange
};

// File Upload Constants
export const FILE_UPLOAD = {
  MAX_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_TYPES: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
    'image/jpeg',
    'image/png',
    'image/gif'
  ]
};

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: 'MMM dd, yyyy',
  INPUT: 'yyyy-MM-dd',
  DATETIME_INPUT: 'yyyy-MM-ddTHH:mm'
};

// Validation Rules
export const VALIDATION_RULES = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^[+]?[1-9][\d]{0,15}$/,
  PASSWORD_MIN_LENGTH: 6,
  COURSE_CODE_PATTERN: /^[A-Z]{2,4}[0-9]{3,4}$/
};

// Local Storage Keys
export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
  THEME: 'theme',
  LANGUAGE: 'language'
};
