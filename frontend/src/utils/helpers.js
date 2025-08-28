import { GRADE_SCALE, DATE_FORMATS, VALIDATION_RULES } from './constants';

// Date Utilities
export const formatDate = (date, format = DATE_FORMATS.DISPLAY) => {
  if (!date) return '';
  
  const d = new Date(date);
  
  switch (format) {
    case DATE_FORMATS.DISPLAY:
      return d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: '2-digit'
      });
    case DATE_FORMATS.INPUT:
      return d.toISOString().split('T')[0];
    case DATE_FORMATS.DATETIME_INPUT:
      return d.toISOString().slice(0, 16);
    default:
      return d.toLocaleDateString();
  }
};

export const isDatePassed = (date) => {
  return new Date(date) < new Date();
};

export const getDaysUntil = (date) => {
  const diff = new Date(date) - new Date();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

// Grade Utilities
export const calculateGPA = (grades) => {
  if (!grades || grades.length === 0) return 0;
  
  let totalPoints = 0;
  let totalCredits = 0;
  
  grades.forEach(grade => {
    if (grade.letterGrade && grade.credits) {
      const gradePoints = GRADE_SCALE[grade.letterGrade] || 0;
      totalPoints += gradePoints * grade.credits;
      totalCredits += grade.credits;
    }
  });
  
  return totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : 0;
};

export const getLetterGrade = (percentage) => {
  if (percentage >= 97) return 'A+';
  if (percentage >= 93) return 'A';
  if (percentage >= 90) return 'A-';
  if (percentage >= 87) return 'B+';
  if (percentage >= 83) return 'B';
  if (percentage >= 80) return 'B-';
  if (percentage >= 77) return 'C+';
  if (percentage >= 73) return 'C';
  if (percentage >= 70) return 'C-';
  if (percentage >= 67) return 'D+';
  if (percentage >= 60) return 'D';
  return 'F';
};

export const getGradeColor = (letterGrade) => {
  switch (letterGrade) {
    case 'A+': case 'A': case 'A-': return 'success';
    case 'B+': case 'B': case 'B-': return 'info';
    case 'C+': case 'C': case 'C-': return 'warning';
    case 'D+': case 'D': case 'F': return 'error';
    default: return 'default';
  }
};

// Validation Utilities
export const validateEmail = (email) => {
  return VALIDATION_RULES.EMAIL.test(email);
};

export const validatePhone = (phone) => {
  return VALIDATION_RULES.PHONE.test(phone);
};

export const validatePassword = (password) => {
  return password && password.length >= VALIDATION_RULES.PASSWORD_MIN_LENGTH;
};

export const validateCourseCode = (code) => {
  return VALIDATION_RULES.COURSE_CODE_PATTERN.test(code);
};

// File Utilities
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const getFileExtension = (filename) => {
  return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);
};

export const isValidFileType = (file, allowedTypes) => {
  return allowedTypes.includes(file.type);
};

// String Utilities
export const capitalizeFirst = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const getInitials = (firstName, lastName) => {
  const first = firstName ? firstName.charAt(0).toUpperCase() : '';
  const last = lastName ? lastName.charAt(0).toUpperCase() : '';
  return first + last;
};

export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

// Array Utilities
export const sortByDate = (array, dateField, ascending = true) => {
  return array.sort((a, b) => {
    const dateA = new Date(a[dateField]);
    const dateB = new Date(b[dateField]);
    return ascending ? dateA - dateB : dateB - dateA;
  });
};

export const groupBy = (array, key) => {
  return array.reduce((groups, item) => {
    const group = item[key];
    groups[group] = groups[group] || [];
    groups[group].push(item);
    return groups;
  }, {});
};

export const filterByStatus = (array, status) => {
  return array.filter(item => item.status === status);
};

// Role Utilities
export const hasRole = (user, requiredRoles) => {
  if (!user || !user.role) return false;
  if (typeof requiredRoles === 'string') return user.role === requiredRoles;
  return requiredRoles.includes(user.role);
};

export const isAdmin = (user) => {
  return user && user.role === 'ADMIN';
};

export const isLecturer = (user) => {
  return user && user.role === 'LECTURER';
};

export const isStudent = (user) => {
  return user && user.role === 'STUDENT';
};

// URL Utilities
export const buildApiUrl = (endpoint, params = {}) => {
  const url = new URL(endpoint, process.env.REACT_APP_API_URL || 'http://localhost:8080/api');
  
  Object.keys(params).forEach(key => {
    if (params[key] !== null && params[key] !== undefined) {
      url.searchParams.append(key, params[key]);
    }
  });
  
  return url.toString();
};

// Error Handling Utilities
export const getErrorMessage = (error) => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  
  if (error.message) {
    return error.message;
  }
  
  return 'An unexpected error occurred';
};

export const handleApiError = (error, defaultMessage = 'Operation failed') => {
  console.error('API Error:', error);
  
  if (error.response?.status === 401) {
    // Handle unauthorized
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
    return 'Session expired. Please login again.';
  }
  
  if (error.response?.status === 403) {
    return 'You do not have permission to perform this action.';
  }
  
  if (error.response?.status === 404) {
    return 'The requested resource was not found.';
  }
  
  if (error.response?.status >= 500) {
    return 'Server error. Please try again later.';
  }
  
  return getErrorMessage(error) || defaultMessage;
};

// Local Storage Utilities
export const setLocalStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

export const getLocalStorage = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return defaultValue;
  }
};

export const removeLocalStorage = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing from localStorage:', error);
  }
};
