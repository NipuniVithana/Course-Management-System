# Course Management System - API Documentation

This document provides comprehensive API documentation for the Course Management System backend services.

## 🔗 **Base URL**
```
Development: http://localhost:8080/api
Production: https://your-domain.com/api
```

## 🔐 **Authentication**

All API endpoints (except public endpoints) require JWT authentication.

### **Authentication Header**
```
Authorization: Bearer <JWT_TOKEN>
```

### **Public Endpoints**
- `POST /auth/login`
- `POST /auth/register`

## 📡 **API Endpoints**

---

## 🔑 **Authentication Endpoints**

### **Login**
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "student@university.edu",
  "password": "student123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzUxMiJ9...",
  "type": "Bearer",
  "email": "student@university.edu",
  "role": "STUDENT",
  "firstName": "Jane",
  "lastName": "Doe",
  "userId": 3
}
```

### **Register**
```http
POST /api/auth/register
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Smith",
  "email": "john.smith@university.edu",
  "password": "password123",
  "role": "STUDENT",
  "studentId": "STU123",
  "department": "Computer Science"
}
```

**Response:**
```json
{
  "message": "User registered successfully"
}
```

### **Get Current User**
```http
GET /api/auth/me
Authorization: Bearer <JWT_TOKEN>
```

**Response:**
```json
{
  "id": 3,
  "email": "student@university.edu",
  "firstName": "Jane",
  "lastName": "Doe",
  "role": "STUDENT"
}
```

### **Logout**
```http
POST /api/auth/logout
Authorization: Bearer <JWT_TOKEN>
```

**Response:**
```json
{
  "message": "User logged out successfully"
}
```

---

## 👨‍💼 **Admin Endpoints**

### **Get All Courses**
```http
GET /api/admin/courses
Authorization: Bearer <ADMIN_JWT_TOKEN>
```

**Response:**
```json
[
  {
    "id": 1,
    "courseCode": "CS101",
    "courseName": "Introduction to Programming",
    "description": "Basic programming concepts using Java",
    "credits": 3,
    "status": "ACTIVE",
    "lecturer": {
      "id": 1,
      "lecturerId": "LEC001",
      "user": {
        "firstName": "John",
        "lastName": "Smith"
      }
    },
    "createdAt": "2025-01-01T10:00:00",
    "updatedAt": "2025-01-01T10:00:00"
  }
]
```

### **Create Course**
```http
POST /api/admin/courses
Authorization: Bearer <ADMIN_JWT_TOKEN>
Content-Type: application/json

{
  "courseCode": "CS201",
  "courseName": "Data Structures",
  "description": "Advanced data structures and algorithms",
  "credits": 4,
  "lecturerId": 1
}
```

**Response:**
```json
{
  "id": 2,
  "courseCode": "CS201",
  "courseName": "Data Structures",
  "description": "Advanced data structures and algorithms",
  "credits": 4,
  "status": "ACTIVE",
  "lecturer": {
    "id": 1,
    "lecturerId": "LEC001"
  },
  "createdAt": "2025-01-01T10:00:00",
  "updatedAt": "2025-01-01T10:00:00"
}
```

### **Update Course**
```http
PUT /api/admin/courses/{id}
Authorization: Bearer <ADMIN_JWT_TOKEN>
Content-Type: application/json

{
  "courseCode": "CS201",
  "courseName": "Data Structures and Algorithms",
  "description": "Updated description",
  "credits": 4,
  "lecturerId": 1
}
```

### **Delete Course**
```http
DELETE /api/admin/courses/{id}
Authorization: Bearer <ADMIN_JWT_TOKEN>
```

**Response:**
```json
{
  "message": "Course deleted successfully"
}
```

---

## 👨‍🏫 **Lecturer Endpoints**

### **Get Lecturer Courses**
```http
GET /api/lecturer/courses
Authorization: Bearer <LECTURER_JWT_TOKEN>
```

### **Get Course Details**
```http
GET /api/lecturer/courses/{id}
Authorization: Bearer <LECTURER_JWT_TOKEN>
```

### **Get Course Assignments**
```http
GET /api/lecturer/courses/{courseId}/assignments
Authorization: Bearer <LECTURER_JWT_TOKEN>
```

### **Create Assignment**
```http
POST /api/lecturer/assignments
Authorization: Bearer <LECTURER_JWT_TOKEN>
Content-Type: application/json

{
  "courseId": 1,
  "title": "Programming Assignment 1",
  "description": "Create a simple calculator application",
  "dueDate": "2025-01-15T23:59:59",
  "maxScore": 100.0
}
```

### **Grade Assignment**
```http
PUT /api/lecturer/submissions/{submissionId}/grade
Authorization: Bearer <LECTURER_JWT_TOKEN>
Content-Type: application/json

{
  "score": 85.5,
  "feedback": "Good work! Consider improving error handling."
}
```

---

## 👨‍🎓 **Student Endpoints**

### **Get Available Courses**
```http
GET /api/student/courses
Authorization: Bearer <STUDENT_JWT_TOKEN>
```

### **Get Course Details**
```http
GET /api/student/courses/{id}
Authorization: Bearer <STUDENT_JWT_TOKEN>
```

### **Enroll in Course**
```http
POST /api/student/enroll
Authorization: Bearer <STUDENT_JWT_TOKEN>
Content-Type: application/json

{
  "courseId": 1
}
```

### **Get Student Assignments**
```http
GET /api/student/assignments
Authorization: Bearer <STUDENT_JWT_TOKEN>
```

### **Submit Assignment**
```http
POST /api/student/assignments/{assignmentId}/submit
Authorization: Bearer <STUDENT_JWT_TOKEN>
Content-Type: multipart/form-data

{
  "file": <FILE_UPLOAD>,
  "content": "Assignment submission text"
}
```

### **Get Submission Details**
```http
GET /api/student/submissions/{submissionId}
Authorization: Bearer <STUDENT_JWT_TOKEN>
```

---

## 📊 **Common Response Models**

### **User Object**
```json
{
  "id": 1,
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@university.edu",
  "role": "STUDENT"
}
```

### **Course Object**
```json
{
  "id": 1,
  "courseCode": "CS101",
  "courseName": "Introduction to Programming",
  "description": "Basic programming concepts",
  "credits": 3,
  "status": "ACTIVE",
  "lecturer": {
    "id": 1,
    "lecturerId": "LEC001",
    "user": {
      "firstName": "John",
      "lastName": "Smith"
    }
  }
}
```

### **Assignment Object**
```json
{
  "id": 1,
  "title": "Programming Assignment 1",
  "description": "Create a calculator",
  "dueDate": "2025-01-15T23:59:59",
  "maxScore": 100.0,
  "status": "ACTIVE",
  "course": {
    "id": 1,
    "courseCode": "CS101"
  }
}
```

### **Submission Object**
```json
{
  "id": 1,
  "assignment": {
    "id": 1,
    "title": "Programming Assignment 1"
  },
  "student": {
    "id": 1,
    "studentId": "STU001"
  },
  "submittedAt": "2025-01-10T14:30:00",
  "score": 85.5,
  "feedback": "Good work!",
  "status": "GRADED"
}
```

---

## ❌ **Error Responses**

### **Authentication Error**
```json
{
  "error": "Unauthorized",
  "message": "Invalid or expired token",
  "status": 401
}
```

### **Authorization Error**
```json
{
  "error": "Forbidden",
  "message": "Access denied for this resource",
  "status": 403
}
```

### **Validation Error**
```json
{
  "error": "Bad Request",
  "message": "Email is required",
  "status": 400
}
```

### **Not Found Error**
```json
{
  "error": "Not Found",
  "message": "Course not found with id: 999",
  "status": 404
}
```

### **Server Error**
```json
{
  "error": "Internal Server Error",
  "message": "An unexpected error occurred",
  "status": 500
}
```

---

## 🔧 **Status Codes**

| Code | Description |
|------|-------------|
| 200 | OK - Request successful |
| 201 | Created - Resource created successfully |
| 204 | No Content - Request successful, no content returned |
| 400 | Bad Request - Invalid request data |
| 401 | Unauthorized - Authentication required |
| 403 | Forbidden - Access denied |
| 404 | Not Found - Resource not found |
| 409 | Conflict - Resource already exists |
| 500 | Internal Server Error - Server error |

---

## 🧪 **Testing with cURL**

### **Login Example**
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@university.edu",
    "password": "admin123"
  }'
```

### **Get Courses Example**
```bash
curl -X GET http://localhost:8080/api/admin/courses \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### **Create Course Example**
```bash
curl -X POST http://localhost:8080/api/admin/courses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "courseCode": "CS301",
    "courseName": "Database Systems",
    "description": "Database design and implementation",
    "credits": 3,
    "lecturerId": 1
  }'
```

---

## 📝 **Postman Collection**

Import the Postman collection for easy testing:
- [Download Collection](../tests/api-tests.postman.json)
- Import into Postman
- Set environment variables:
  - `baseUrl`: `http://localhost:8080/api`
  - `authToken`: `<JWT_TOKEN_FROM_LOGIN>`

---

## 🔄 **Rate Limiting**

API endpoints are rate-limited to prevent abuse:

- **General API**: 10 requests per second
- **Authentication**: 5 requests per minute
- **File Upload**: 3 requests per minute

Rate limit headers are included in responses:
```
X-RateLimit-Limit: 10
X-RateLimit-Remaining: 7
X-RateLimit-Reset: 1640995200
```

---

## 📖 **Additional Resources**

- [OpenAPI/Swagger Documentation](http://localhost:8080/swagger-ui.html)
- [Postman Collection](../tests/api-tests.postman.json)
- [Integration Tests](../tests/backend-tests/integration-tests/)
- [Database Schema](../database/README.md)
