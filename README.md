# 🎓 Course Management System

A modern, full-stack University Course Management System built with **Spring Boot** (backend) and **React.js** (frontend). This system supports three user roles: **Admin**, **Lecturer**, and **Student** with comprehensive features for course management, assignment submission, grading, and user administration.

> **⚠️ Important Configuration Notes:**
> - **Development**: Uses `cms_database` with `root`/`root` credentials (frontend on port 3001)
> - **Docker/Production**: Uses `course_management_system` with `cms_user`/`cms_password` credentials (frontend on port 3000)
> - Backend CORS settings vary between controllers (some use :3001, others :3000)
> - The system automatically handles database creation in Docker deployments

## 🚀 **Quick Start with Docker**

### **P# 3. Set environment variables in Railway dashboard:
#    - MYSQL_DATABASE=course_management_system
#    - MYSQL_USER=cms_user
#    - MYSQL_PASSWORD=cms_password
#    - MYSQL_ROOT_PASSWORD=rootpassword
#    - JWT_SECRET=mySecretKey123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890uisites**
- Docker Engine 20.0+
- Docker Compose 2.0+
- 8GB+ RAM recommended
- Git

### **1. Clone Repository**
```bash
git clone <your-repository-url>
cd "Course Management System"
```

### **2. Environment Setup**
```bash
cd deployment
cp .env.example .env
# Edit .env file if needed (optional - defaults work fine)
```

> **Note:** The system uses different database configurations:
> - **Development**: `cms_database` with `root`/`root` credentials
> - **Docker/Production**: `course_management_system` with `cms_user`/`cms_password` credentials
> - The Docker setup will automatically create the correct database and user

### **3. Deploy with Docker Compose**
```bash
# Build and start all services
docker-compose up --build -d

# View logs (optional)
docker-compose logs -f

# Check service status
docker-compose ps
```

### **4. Access Application**
- **Frontend**: http://localhost:3001 (Development) / http://localhost:3000 (Docker)
- **Backend API**: http://localhost:8080/api
- **Database**: localhost:3306 (Database: course_management_system, User: cms_user, Password: cms_password)
- **phpMyAdmin**: http://localhost:8081 (Database management UI)

### **5. Demo Accounts**
| Role | Email | Password | Access |
|------|-------|----------|---------|
| Admin | admin@university.edu | admin123 | Full system administration |
| Lecturer | lecturer@university.edu | lecturer123 | Course management, grading |
| Student | student@university.edu | student123 | Course enrollment, submissions |

### **6. Stop Services**
```bash
# Stop all services
docker-compose down

# Stop and remove volumes (clean slate)
docker-compose down -v
```

## 🔧 **Troubleshooting**

### **Common Issues**

**Port Conflicts:**
```bash
# Check what's using the ports
sudo lsof -i :3001  # Frontend (Development)
sudo lsof -i :3000  # Frontend (Docker)
sudo lsof -i :8080  # Backend
sudo lsof -i :3306  # Database

# Kill processes if needed
sudo kill -9 <PID>
```

> **Note:** Frontend runs on port 3001 in development mode, but on port 3000 when deployed with Docker. Some backend controllers are configured for port 3001 (dev) and others for 3000 (Docker). This may cause CORS issues in certain deployment scenarios.

**Database Connection Issues:**
```bash
# Wait for database to fully initialize (first run takes 2-3 minutes)
docker-compose logs mysql

# Restart just the backend after database is ready
docker-compose restart backend
```

**File Upload Issues:**
```bash
# Check if upload directory exists and has correct permissions
ls -la uploads/
sudo chmod 755 uploads/
```

**Memory Issues:**
```bash
# Check Docker memory usage
docker system df

# Clean up unused containers/images
docker system prune -a
```

### **Reset Everything**
```bash
# Complete clean restart
docker-compose down -v
docker system prune -a
docker-compose up --build -d
```

## 🛠️ **Development Setup**

### **Local Development (Without Docker)**

**Backend Setup:**
```bash
cd backend

# Install dependencies
mvn clean install

# Set environment variables
export SPRING_PROFILES_ACTIVE=dev
export SPRING_DATASOURCE_URL=jdbc:mysql://localhost:3306/cms_database
export SPRING_DATASOURCE_USERNAME=root
export SPRING_DATASOURCE_PASSWORD=root

# Run application
mvn spring-boot:run
```

**Frontend Setup:**
```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

**Database Setup:**
```bash
# Start MySQL with Docker
docker run -d \
  --name cms_mysql \
  -e MYSQL_ROOT_PASSWORD=rootpassword \
  -e MYSQL_DATABASE=course_management_system \
  -e MYSQL_USER=cms_user \
  -e MYSQL_PASSWORD=cms_password \
  -p 3306:3306 \
  mysql:8.0

# Import schema
mysql -h localhost -u cms_user -p course_management_system < database/schema.sql
mysql -h localhost -u cms_user -p course_management_system < database/sample_data.sql
```

## 🚀 **Features**

### 👨‍💼 **Admin Features**
- ✅ User management (create, update, delete users)
- ✅ Course management (create, edit, delete courses)
- ✅ Degree program management and course mapping
- ✅ System-wide analytics and reporting
- ✅ Role-based access control

### 👨‍🏫 **Lecturer Features**
- ✅ Course registration (register for courses to teach)
- ✅ Assignment creation and management with file uploads
- ✅ Student enrollment viewing for registered courses
- ✅ Grading and feedback system for submissions
- ✅ Course materials upload and management
- ✅ Assignment submission viewing and downloads

### 👨‍🎓 **Student Features**
- ✅ Course browsing and enrollment
- ✅ Assignment submission with file uploads
- ✅ Grade viewing and progress tracking
- ✅ Course materials download and access
- ✅ Assignment feedback viewing
- ✅ Profile management

## 🛠️ **Technology Stack**

### **Frontend**
- **React.js 18** - Modern UI library
- **Ant Design (antd)** - UI component library
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Context API** - State management

### **Backend**
- **Spring Boot 3.x** - Java framework with Java 17
- **Spring Security** - Authentication & authorization
- **Spring Data JPA** - Database abstraction
- **JWT** - Token-based authentication
- **Maven** - Dependency management

### **Database**
- **MySQL 8.0** - Production database
- **JPA/Hibernate** - ORM

### **Deployment**
- **Docker & Docker Compose** - Containerization
- **Nginx** - Reverse proxy and web server
- **Multi-stage builds** - Optimized images

### **DevOps & Deployment**
- **Docker & Docker Compose** - Containerization
- **Nginx** - Reverse proxy & load balancer
- **GitHub Actions** - CI/CD (optional)

## 📁 **Project Structure**

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
- **Java 17+** and **Maven**
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
# Frontend: http://localhost:3001 (Development) / http://localhost:3000 (Docker)
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

# Start development server (runs on port 3001)
npm start

# Frontend will run on http://localhost:3001
```

#### **Database Setup**
```bash
# For Development (Manual MySQL setup):
# Database name: cms_database (for local development)
# Username: root, Password: root

# For Docker deployment:
# Database name: course_management_system
# Username: cms_user, Password: cms_password

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

##  **API Documentation**

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

> **For additional setup information**: [docs/Setup-Instructions.md](docs/Setup-Instructions.md)

## 🌐 **Production Deployment Options**

### **Option 1: Railway (Recommended)**
```bash
# 1. Push code to GitHub
git add .
git commit -m "Ready for deployment"
git push origin main

# 2. Connect Railway to GitHub repo
# 3. Railway auto-detects Docker configuration
# 4. Set environment variables in Railway dashboard:
#    - MYSQL_DATABASE=cms_database
#    - MYSQL_USER=root
#    - MYSQL_PASSWORD=root
#    - JWT_SECRET=mySecretKey123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890
```

### **Option 2: Split Deployment (Free)**
```bash
# Deploy frontend to Vercel (free)
cd frontend
npm run build
# Upload build folder to Vercel

# Keep backend local or use Railway for backend only
```

## 📁 **Project Structure**
```
Course Management System/
├── backend/                 # Spring Boot application
│   ├── src/main/java/      # Java source code
│   ├── src/main/resources/ # Configuration files
│   └── pom.xml             # Maven dependencies
├── frontend/               # React application
│   ├── src/                # React source code
│   ├── public/             # Static assets
│   └── package.json        # NPM dependencies
├── database/               # Database scripts
│   ├── schema.sql          # Database schema
│   ├── sample_data.sql     # Initial data
│   └── docker-compose.yml  # Database container
├── deployment/             # Docker configurations
│   ├── Dockerfile.backend  # Backend container
│   ├── Dockerfile.frontend # Frontend container
│   ├── docker-compose.yml  # Full stack deployment
│   └── nginx.conf          # Nginx configuration
├── docs/                   # Documentation
├── tests/                  # Test files
└── README.md               # This file
```

## 🔌 **API Endpoints**

### **Health Check**
```http
GET /actuator/health     # Application health status
GET /actuator/info       # Application information
```

### **Authentication**
```http
POST /api/auth/register     # User registration
POST /api/auth/login        # User login
GET  /api/auth/me          # Get current user
```

### **Admin Endpoints**
```http
GET    /api/admin/dashboard/stats # Get dashboard statistics

# Course Management (via CourseController)
GET    /api/admin/courses     # Get all courses
POST   /api/admin/courses     # Create course
PUT    /api/admin/courses/{id} # Update course
DELETE /api/admin/courses/{id} # Delete course

# Degree Management (via DegreeController) 
GET    /api/admin/degrees     # Get all degrees
POST   /api/admin/degrees     # Create degree
```

### **Lecturer Endpoints**
```http
GET    /api/lecturer/courses/available    # Browse available courses
POST   /api/lecturer/courses/{id}/register # Register for course
GET    /api/lecturer/courses              # Get registered courses
GET    /api/lecturer/courses/{id}         # Get course details

POST   /api/lecturer/courses/{id}/materials          # Upload materials
GET    /api/lecturer/courses/{id}/materials          # Get materials
DELETE /api/lecturer/courses/{id}/materials/{fileId} # Delete material

POST   /api/lecturer/courses/{id}/assignments        # Create assignment
GET    /api/lecturer/courses/{id}/assignments        # Get assignments
PUT    /api/lecturer/assignments/{id}                # Update assignment

GET    /api/lecturer/assignments/{id}/submissions    # Get submissions
POST   /api/lecturer/submissions/{id}/grade          # Grade submission
```

### **Student Endpoints**
```http
GET    /api/student/courses/available     # Browse available courses
POST   /api/student/enrollments           # Enroll in course
GET    /api/student/enrollments           # Get enrolled courses

GET    /api/student/courses/{id}/materials     # Get course materials
GET    /api/student/courses/{id}/assignments   # Get assignments

POST   /api/student/assignments/{id}/submit    # Submit assignment
GET    /api/student/submissions               # Get my submissions
GET    /api/student/grades                    # Get my grades
```

## 🧪 **Testing**

### **Run Tests**
```bash
# Backend tests
cd backend
mvn test

# Frontend tests
cd frontend
npm test

# API tests with Postman
# Import tests/api-tests.postman.json into Postman
```

### **Test Coverage**
- Backend: Authentication and controller tests
- Frontend: Component and interaction tests
- API: Comprehensive Postman collection

## 📊 **Database Schema**

### **Key Tables**
- `users` - Base user information
- `students`, `lecturers`, `admins` - Role-specific data
- `courses` - Course information
- `degrees` - Degree programs
- `enrollments` - Student-course relationships
- `assignments` - Assignment details
- `submissions` - Student submissions
- `grades` - Grade records
- `course_materials` - File metadata

## 🔐 **Security Features**

- **JWT Authentication** - Secure token-based auth
- **Role-Based Access** - Method-level security
- **Password Encryption** - BCrypt hashing
- **Input Validation** - Comprehensive validation
- **CORS Protection** - Cross-origin security
- **Rate Limiting** - API abuse prevention
- **File Upload Security** - Type and size validation

## 📱 **User Interface**

### **Design System**
- **Ant Design** components for consistency
- **Responsive design** for all devices
- **Role-based navigation** and features
- **Modern Material Design** principles
- **Accessibility** compliance

### **Key UI Features**
- Dashboard with statistics
- File upload/download interface
- Assignment submission system
- Grade viewing and feedback
- Course browsing and enrollment
- User management interface

## 🚀 **Performance**

### **Optimizations**
- **Multi-stage Docker builds** for smaller images
- **Nginx reverse proxy** for load balancing
- **Database indexing** for query performance
- **Gzip compression** for faster loading
- **Connection pooling** for database efficiency

### **Specifications**
- **File Upload Limit**: 50MB (configurable)
- **Database**: MySQL 8.0 with InnoDB engine
- **Memory**: < 1GB backend, 512MB frontend
- **Concurrent Users**: Tested with 100+ users

## 📋 **Environment Variables**

### **Backend (.env)**
```bash
# Database Configuration (Development)
SPRING_DATASOURCE_URL=jdbc:mysql://localhost:3306/cms_database
SPRING_DATASOURCE_USERNAME=root
SPRING_DATASOURCE_PASSWORD=root

# Database Configuration (Docker/Production)
MYSQL_DATABASE=course_management_system
MYSQL_USER=cms_user
MYSQL_PASSWORD=cms_password
MYSQL_ROOT_PASSWORD=rootpassword

# JWT Configuration
JWT_SECRET=mySecretKey123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890
JWT_EXPIRATION=86400000

# File Upload
FILE_UPLOAD_PATH=./uploads
MAX_FILE_SIZE=52428800

# Environment
SPRING_PROFILES_ACTIVE=dev
```

### **Frontend (.env)**
```bash
REACT_APP_API_URL=http://localhost:8080/api
PORT=3001
```

## 🤝 **Contributing**

### **Development Workflow**
1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

### **Code Standards**
- **Java**: Follow Spring Boot conventions
- **React**: Use functional components with hooks
- **Database**: Maintain referential integrity
- **Testing**: Write tests for new features

## 📞 **Support**

### **Common Questions**

**Q: How do I reset the database?**
```bash
docker-compose down -v
docker-compose up --build -d
```

**Q: How do I add new users?**
- Use admin account to create users via UI
- Or register new accounts via registration page

**Q: File uploads not working?**
- Check upload directory permissions
- Verify file size limits
- Check Docker volume mounts

**Q: Can't connect to database?**
- Wait 2-3 minutes for MySQL to fully initialize
- Check Docker logs: `docker-compose logs mysql`
- Restart backend: `docker-compose restart backend`

## 📄 **License**

This project is licensed under the MIT License.

## 🙏 **Acknowledgments**

- **Spring Boot** community for excellent documentation
- **React** team for the amazing framework
- **Ant Design** for beautiful UI components
- **Docker** for containerization capabilities
- **MySQL** for reliable database management

---

**Built with ❤️ for Modern Enterprise Application Development**

