# Course Management System - Setup Instructions

This guide provides step-by-step instructions for setting up the Course Management System in different environments.

## 📋 **Prerequisites**

### **Required Software**
- **Node.js 18+** - [Download](https://nodejs.org/)
- **Java 11+** - [Download OpenJDK](https://openjdk.org/)
- **Maven 3.6+** - [Download](https://maven.apache.org/)
- **Git** - [Download](https://git-scm.com/)

### **Optional (Recommended)**
- **Docker & Docker Compose** - [Download](https://docker.com/)
- **MySQL 8.0** - [Download](https://mysql.com/)
- **Visual Studio Code** - [Download](https://code.visualstudio.com/)
- **IntelliJ IDEA** - [Download](https://www.jetbrains.com/idea/)

### **System Requirements**
- **RAM**: Minimum 4GB, Recommended 8GB+
- **Storage**: Minimum 2GB free space
- **OS**: Windows 10+, macOS 10.15+, or Linux Ubuntu 18.04+

---

## 🚀 **Quick Start (Docker - Recommended)**

### **Step 1: Clone Repository**
```bash
git clone <repository-url>
cd "Course Management System"
```

### **Step 2: Configure Environment**
```bash
cd deployment
cp .env.example .env

# Edit .env file with your configuration
nano .env  # or use your preferred editor
```

### **Step 3: Start All Services**
```bash
docker-compose up -d
```

### **Step 4: Access Application**
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080/api
- **H2 Console**: http://localhost:8080/h2-console
- **phpMyAdmin**: http://localhost:8081

### **Step 5: Login with Demo Accounts**
| Role | Email | Password |
|------|-------|----------|
| Admin | admin@university.edu | admin123 |
| Lecturer | lecturer@university.edu | lecturer123 |
| Student | student@university.edu | student123 |

---

## 🔧 **Manual Development Setup**

### **Frontend Setup**

#### **1. Install Node.js Dependencies**
```bash
cd frontend
npm install
```

#### **2. Configure Environment**
```bash
# Create .env file in frontend folder
cp .env.example .env

# Edit environment variables
REACT_APP_API_URL=http://localhost:8080/api
REACT_APP_ENVIRONMENT=development
```

#### **3. Start Development Server**
```bash
npm start
```
Frontend will be available at: http://localhost:3000

#### **4. Build for Production**
```bash
npm run build
```

---

### **Backend Setup**

#### **1. Install Java and Maven**
```bash
# Verify installations
java -version
mvn -version
```

#### **2. Configure Database**

**Option A: H2 Database (Development)**
```yaml
# backend/src/main/resources/application.yml
spring:
  datasource:
    url: jdbc:h2:mem:testdb
    driver-class-name: org.h2.Driver
    username: sa
    password: 
  h2:
    console:
      enabled: true
```

**Option B: MySQL Database (Production)**
```yaml
# backend/src/main/resources/application.yml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/course_management_system
    username: cms_user
    password: cms_password
    driver-class-name: com.mysql.cj.jdbc.Driver
```

#### **3. Install Dependencies and Run**
```bash
cd backend

# Install dependencies
mvn clean install

# Run application
mvn spring-boot:run
```
Backend will be available at: http://localhost:8080

#### **4. Build for Production**
```bash
mvn clean package
```

---

### **Database Setup**

#### **H2 Database (Default)**
- Automatically configured
- Access console: http://localhost:8080/h2-console
- JDBC URL: `jdbc:h2:mem:testdb`
- Username: `sa`
- Password: (empty)

#### **MySQL Database**

**Option 1: Docker**
```bash
cd database
docker-compose up -d
```

**Option 2: Manual Installation**
```bash
# Install MySQL
sudo apt install mysql-server  # Ubuntu
brew install mysql             # macOS

# Create database
mysql -u root -p
CREATE DATABASE course_management_system;
CREATE USER 'cms_user'@'localhost' IDENTIFIED BY 'cms_password';
GRANT ALL PRIVILEGES ON course_management_system.* TO 'cms_user'@'localhost';
FLUSH PRIVILEGES;

# Import schema
mysql -u cms_user -p course_management_system < database/schema.sql

# Import sample data
mysql -u cms_user -p course_management_system < database/sample_data.sql
```

---

## 🐳 **Docker Deployment**

### **Development Environment**
```bash
# Start all services
cd deployment
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### **Production Environment**
```bash
# Copy production environment
cp .env.example .env.prod
# Edit .env.prod with production values

# Deploy with production configuration
docker-compose -f production.yml --env-file .env.prod up -d
```

### **Individual Services**
```bash
# Start only database
docker-compose up -d mysql

# Start backend only
docker-compose up -d backend

# Rebuild specific service
docker-compose up -d --build frontend
```

---

## 🔐 **Environment Configuration**

### **Development (.env)**
```bash
# Database
MYSQL_ROOT_PASSWORD=rootpassword
MYSQL_DATABASE=course_management_system
MYSQL_USER=cms_user
MYSQL_PASSWORD=cms_password

# Application
SPRING_PROFILES_ACTIVE=development
JWT_SECRET=developmentSecretKey
JWT_EXPIRATION=86400000

# Ports
FRONTEND_PORT=3000
BACKEND_PORT=8080
MYSQL_PORT=3306
```

### **Production (.env.prod)**
```bash
# Database (Use strong passwords)
MYSQL_ROOT_PASSWORD=StrongRootPassword123!
MYSQL_DATABASE=course_management_system
MYSQL_USER=cms_prod_user
MYSQL_PASSWORD=StrongUserPassword123!

# Application
SPRING_PROFILES_ACTIVE=production
JWT_SECRET=VerySecureProductionJWTSecretKey123!
JWT_EXPIRATION=3600000

# Ports
NGINX_PORT=80
NGINX_SSL_PORT=443
```

---

## 🧪 **Testing Setup**

### **Backend Tests**
```bash
cd backend

# Run unit tests
mvn test

# Run integration tests
mvn integration-test

# Generate test coverage report
mvn jacoco:report
```

### **Frontend Tests**
```bash
cd frontend

# Run unit tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run end-to-end tests
npm run test:e2e
```

### **API Testing**
```bash
# Install Newman (Postman CLI)
npm install -g newman

# Run API tests
newman run tests/api-tests.postman.json
```

---

## 🌐 **IDE Setup**

### **Visual Studio Code**

#### **Recommended Extensions**
```json
{
  "recommendations": [
    "ms-vscode.vscode-java-pack",
    "ms-vscode.vscode-spring-initializr",
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-eslint"
  ]
}
```

#### **Settings**
```json
{
  "java.configuration.updateBuildConfiguration": "interactive",
  "java.format.settings.url": "https://raw.githubusercontent.com/google/styleguide/gh-pages/eclipse-java-google-style.xml",
  "editor.formatOnSave": true,
  "eslint.format.enable": true
}
```

### **IntelliJ IDEA**

#### **Required Plugins**
- Spring Boot
- Maven
- Lombok
- Database Tools and SQL

#### **Configuration**
1. Import as Maven project
2. Set Project SDK to Java 11+
3. Enable annotation processing
4. Configure code style (Google Java Style)

---

## 🔧 **Development Workflow**

### **Git Workflow**
```bash
# Clone repository
git clone <repository-url>
cd "Course Management System"

# Create feature branch
git checkout -b feature/new-feature

# Make changes and commit
git add .
git commit -m "Add new feature"

# Push and create pull request
git push origin feature/new-feature
```

### **Development Commands**
```bash
# Install all dependencies
npm run install:all

# Start development environment
npm run dev

# Run tests
npm run test:all

# Build for production
npm run build:all

# Clean build artifacts
npm run clean
```

---

## 🚨 **Troubleshooting**

### **Common Issues**

#### **Port Already in Use**
```bash
# Find process using port
lsof -i :3000
lsof -i :8080

# Kill process
kill -9 <PID>

# Or change port in configuration
```

#### **Database Connection Failed**
```bash
# Check MySQL is running
sudo systemctl status mysql

# Test connection
mysql -u cms_user -p -h localhost

# Check H2 console
http://localhost:8080/h2-console
```

#### **Java Version Issues**
```bash
# Check Java version
java -version

# Set JAVA_HOME
export JAVA_HOME=/path/to/java11

# Update alternatives (Linux)
sudo update-alternatives --config java
```

#### **Node.js Issues**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Use specific Node version with nvm
nvm use 18
```

#### **Docker Issues**
```bash
# Check Docker status
docker --version
docker-compose --version

# View container logs
docker-compose logs [service-name]

# Restart services
docker-compose restart

# Rebuild containers
docker-compose up -d --build
```

#### **CORS Issues**
```bash
# Check backend CORS configuration
# Ensure frontend URL is in allowed origins
# Update CorsConfig.java if needed
```

### **Performance Issues**

#### **Backend Performance**
```bash
# Increase JVM memory
export MAVEN_OPTS="-Xmx2g"

# Profile application
mvn spring-boot:run -Dspring-boot.run.profiles=debug
```

#### **Frontend Performance**
```bash
# Analyze bundle size
npm run build
npx webpack-bundle-analyzer build/static/js/*.js

# Use development server with hot reload
npm start
```

---

## 📞 **Getting Help**

### **Documentation**
- [API Documentation](API-Documentation.md)
- [User Manual](User-Manual.pdf)
- [Technical Report](Technical-Report.pdf)

### **Community**
- GitHub Issues: Report bugs and request features
- GitHub Discussions: Ask questions and share ideas

### **Professional Support**
- Email: support@university.edu
- Documentation: [docs/](./README.md)

---

## ✅ **Verification Checklist**

After setup, verify everything works:

- [ ] Frontend loads at http://localhost:3000
- [ ] Backend API responds at http://localhost:8080/api
- [ ] Database connection successful
- [ ] Login with demo accounts works
- [ ] All three role dashboards accessible
- [ ] API endpoints return data
- [ ] Tests pass successfully
- [ ] Docker containers start without errors

---

## 🎯 **Next Steps**

1. **Explore the Application**
   - Login with different role accounts
   - Test core functionality
   - Review API responses

2. **Development**
   - Set up your preferred IDE
   - Configure code formatting
   - Set up version control

3. **Customization**
   - Update demo data
   - Modify UI themes
   - Add custom features

4. **Deployment**
   - Set up production environment
   - Configure SSL certificates
   - Set up monitoring and backups

**Successfully completed setup? You're ready to start developing! 🚀**
