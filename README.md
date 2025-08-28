# 🎓 Course Management System

A modern, full-stack University Course Management System built with **Spring Boot** (backend) and **React.js** (frontend). This system supports three user roles: **Admin**, **Lecturer**, and **Student** with comprehensive features for course management, assignment submission, grading, and user administration.

![System Architecture](docs/screenshots/architecture-overview.png)

## 🚀 **Features**

### 👨‍💼 **Admin Features**
- ✅ User management (create, update, delete users)
- ✅ Course management (create, assign lecturers, manage enrollments)
- ✅ System-wide analytics and reporting
- ✅ Role-based access control
- ✅ Academic year and semester management

### 👨‍🏫 **Lecturer Features**
- ✅ Course management (view assigned courses)
- ✅ Assignment creation and management
- ✅ Student enrollment management
- ✅ Grading and feedback system
- ✅ Course announcements
- ✅ Student progress tracking

### 👨‍🎓 **Student Features**
- ✅ Course enrollment and browsing
- ✅ Assignment submission
- ✅ Grade viewing and progress tracking
- ✅ Course materials access
- ✅ Announcement viewing
- ✅ Profile management

## 🛠️ **Technology Stack**

### **Frontend**
- **React.js 18** - Modern UI library
- **Material-UI (MUI)** - UI component library
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Context API** - State management

### **Backend**
- **Spring Boot 2.7** - Java framework
- **Spring Security** - Authentication & authorization
- **Spring Data JPA** - Database abstraction
- **JWT** - Token-based authentication
- **Maven** - Dependency management

### **Database**
- **H2 Database** - Development (in-memory)
- **MySQL 8.0** - Production database
- **JPA/Hibernate** - ORM

### **DevOps & Deployment**
- **Docker & Docker Compose** - Containerization
- **Nginx** - Reverse proxy & load balancer
- **GitHub Actions** - CI/CD (optional)

## 🏗️ **Project Structure**

```
Course Management System/
├── 📁 frontend/                 # React.js frontend application
│   ├── public/                  # Static assets
│   ├── src/
│   │   ├── components/          # React components
│   │   ├── context/            # Context providers
│   │   ├── services/           # API services
│   │   └── utils/              # Utility functions
│   └── package.json
├── 📁 backend/                  # Spring Boot backend application
│   ├── src/main/java/          # Java source code
│   │   ├── controller/         # REST controllers
│   │   ├── service/            # Business logic
│   │   ├── entity/             # JPA entities
│   │   ├── repository/         # Data repositories
│   │   └── security/           # Security configuration
│   └── pom.xml
├── 📁 database/                 # Database schemas and scripts
│   ├── schema.sql              # MySQL schema
│   ├── h2_schema.sql          # H2 schema
│   ├── sample_data.sql        # Sample data
│   └── docker-compose.yml     # Database setup
├── 📁 deployment/               # Docker deployment files
│   ├── docker-compose.yml     # Full stack deployment
│   ├── Dockerfile.backend     # Backend container
│   ├── Dockerfile.frontend    # Frontend container
│   └── nginx.conf             # Nginx configuration
├── 📁 docs/                     # Documentation
├── 📁 tests/                    # Test suites
└── README.md
```

## 🚀 **Quick Start**

### **Prerequisites**
- **Node.js 18+** and **npm**
- **Java 11+** and **Maven**
- **Docker & Docker Compose** (for containerized deployment)
- **MySQL 8.0** (for production)

### **Option 1: Docker Deployment (Recommended)**

```bash
# 1. Clone the repository
git clone <repository-url>
cd "Course Management System"

# 2. Set up environment variables
cd deployment
cp .env.example .env
# Edit .env with your configuration

# 3. Start all services with Docker
docker-compose up -d

# 4. Access the application
# Frontend: http://localhost:3000
# Backend API: http://localhost:8080/api
# phpMyAdmin: http://localhost:8081
```

### **Option 2: Manual Development Setup**

#### **Backend Setup**
```bash
cd backend

# Install dependencies and run
mvn clean install
mvn spring-boot:run

# Backend will run on http://localhost:8080
```

#### **Frontend Setup**
```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm start

# Frontend will run on http://localhost:3000
```

#### **Database Setup**
```bash
# H2 (Development) - Automatically configured
# Access H2 console: http://localhost:8080/h2-console

# MySQL (Production)
cd database
docker-compose up -d
# Or manually create database and run schema.sql
```

## 👥 **Demo Accounts**

Use these accounts to test the system:

| Role | Email | Password |
|------|-------|----------|
| **Admin** | admin@university.edu | admin123 |
| **Lecturer** | lecturer@university.edu | lecturer123 |
| **Student** | student@university.edu | student123 |

## 📱 **Screenshots**

### Login Page
![Login](docs/screenshots/login-page.png)

### Admin Dashboard
![Admin Dashboard](docs/screenshots/admin-dashboard.png)

### Lecturer Dashboard
![Lecturer Dashboard](docs/screenshots/lecturer-dashboard.png)

### Student Dashboard
![Student Dashboard](docs/screenshots/student-dashboard.png)

## 📖 **API Documentation**

### **Authentication Endpoints**
```
POST /api/auth/login          # User login
POST /api/auth/register       # User registration
GET  /api/auth/me            # Get current user
POST /api/auth/logout        # User logout
```

### **Admin Endpoints**
```
GET    /api/admin/courses     # Get all courses
POST   /api/admin/courses     # Create course
PUT    /api/admin/courses/{id} # Update course
DELETE /api/admin/courses/{id} # Delete course
```

### **Lecturer Endpoints**
```
GET /api/lecturer/courses     # Get lecturer courses
GET /api/lecturer/assignments # Get course assignments
POST /api/lecturer/assignments # Create assignment
```

### **Student Endpoints**
```
GET /api/student/courses      # Get available courses
POST /api/student/enroll      # Enroll in course
GET /api/student/assignments  # Get assignments
POST /api/student/submit      # Submit assignment
```

> **Full API documentation**: [docs/API-Documentation.md](docs/API-Documentation.md)

## 🧪 **Testing**

### **Backend Tests**
```bash
cd backend
mvn test                     # Run unit tests
mvn integration-test         # Run integration tests
```

### **Frontend Tests**
```bash
cd frontend
npm test                     # Run unit tests
npm run test:e2e            # Run end-to-end tests
```

### **API Testing**
```bash
# Import Postman collection
tests/api-tests.postman.json

# Or use curl examples in docs/API-Documentation.md
```

## 🚀 **Deployment**

### **Development Environment**
```bash
# Frontend development server
cd frontend && npm start

# Backend development server
cd backend && mvn spring-boot:run

# Database (H2 in-memory)
# Automatically configured
```

### **Production Environment**
```bash
# Using Docker Compose
cd deployment
docker-compose -f production.yml up -d

# Manual deployment
# 1. Build frontend: npm run build
# 2. Build backend: mvn clean package
# 3. Deploy to server with reverse proxy
```

### **Cloud Deployment**
- **AWS**: Deploy using ECS or Elastic Beanstalk
- **Google Cloud**: Deploy using Cloud Run or GKE
- **Azure**: Deploy using Container Instances or AKS
- **Heroku**: Deploy using Heroku Containers

> **Detailed deployment guide**: [deployment/README.md](deployment/README.md)

## 🔐 **Security Features**

- ✅ **JWT Authentication** - Stateless token-based auth
- ✅ **Role-based Access Control** - Admin/Lecturer/Student roles
- ✅ **Password Hashing** - BCrypt encryption
- ✅ **CORS Protection** - Configured cross-origin policies
- ✅ **SQL Injection Prevention** - JPA/Hibernate protection
- ✅ **XSS Protection** - Security headers and validation
- ✅ **Rate Limiting** - API request throttling

## 📊 **Database Schema**

![Database ERD](docs/database-erd.png)

### **Core Tables**
- **users** - Base user information
- **admins, lecturers, students** - Role-specific data
- **courses** - Course information
- **enrollments** - Student-course relationships
- **assignments** - Course assignments
- **submissions** - Student assignment submissions

> **Full schema documentation**: [database/README.md](database/README.md)

## 🛠️ **Development**

### **Adding New Features**

1. **Backend API**:
   - Create entity in `entity/`
   - Create repository in `repository/`
   - Create service in `service/`
   - Create controller in `controller/`
   - Add tests in `test/`

2. **Frontend UI**:
   - Create component in `components/`
   - Add service in `services/`
   - Update routing in `App.js`
   - Add to navigation

### **Code Style**
- **Backend**: Java code style with Google Java Format
- **Frontend**: ESLint + Prettier configuration
- **Database**: SQL naming conventions

### **Contributing**
1. Fork the repository
2. Create feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -m 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit pull request

## 📚 **Documentation**

- 📖 [Technical Report](docs/Technical-Report.pdf)
- 📖 [User Manual](docs/User-Manual.pdf)
- 📖 [API Documentation](docs/API-Documentation.md)
- 📖 [Setup Instructions](docs/Setup-Instructions.md)
- 📖 [Database Documentation](database/README.md)
- 📖 [Deployment Guide](deployment/README.md)

## ❓ **Troubleshooting**

### **Common Issues**

#### **Port Conflicts**
```bash
# Check what's using the port
lsof -i :3000
lsof -i :8080

# Kill process or change port in configuration
```

#### **Database Connection**
```bash
# Check H2 console: http://localhost:8080/h2-console
# JDBC URL: jdbc:h2:mem:testdb
# Username: sa
# Password: (empty)
```

#### **CORS Issues**
```bash
# Check backend CORS configuration in CorsConfig.java
# Ensure frontend URL is in allowed origins
```

#### **Docker Issues**
```bash
# Check container status
docker-compose ps

# View logs
docker-compose logs [service-name]

# Rebuild containers
docker-compose up -d --build
```

## 📞 **Support**

- 📧 **Email**: support@university.edu
- 📖 **Documentation**: [docs/](docs/)
- 🐛 **Issues**: GitHub Issues
- 💬 **Discussions**: GitHub Discussions

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🏆 **Assignment Requirements Fulfilled**

✅ **Modern Web Application** - React.js + Spring Boot  
✅ **Three User Roles** - Admin, Lecturer, Student  
✅ **Authentication System** - JWT-based security  
✅ **Database Integration** - JPA/Hibernate with MySQL/H2  
✅ **Responsive Design** - Material-UI components  
✅ **RESTful APIs** - Complete CRUD operations  
✅ **Deployment Ready** - Docker containerization  
✅ **Documentation** - Comprehensive guides and reports  
✅ **Testing** - Unit and integration tests  
✅ **GitHub Repository** - Version controlled codebase  

---

## 🚀 **Getting Started Now**

```bash
# Quick deployment
git clone <repository-url>
cd "Course Management System/deployment"
cp .env.example .env
docker-compose up -d

# Access at http://localhost:3000
# Login with: admin@university.edu / admin123
```

**Built with ❤️ for University Course Management**
