# Database Configuration Guide

This folder contains database schema and configuration files for the Course Management System.

## Files Overview

### Schema Files
- `schema.sql` - MySQL/MariaDB production database schema
- `h2_schema.sql` - H2 database schema for development

### Sample Data Files  
- `sample_data.sql` - Sample data for MySQL/MariaDB
- `h2_sample_data.sql` - Sample data for H2 database

### Configuration Files
- `docker-compose.yml` - Docker configuration for MySQL database
- `mysql-init.sql` - MySQL initialization script

## Database Setup

### Development (H2)
The application is configured to use H2 in-memory database by default. The schema and sample data will be automatically loaded when the application starts.

**Demo Accounts:**
- Admin: `admin@university.edu` / `admin123`
- Lecturer: `lecturer@university.edu` / `lecturer123`  
- Student: `student@university.edu` / `student123`

### Production (MySQL)

#### Option 1: Docker (Recommended)
```bash
# Start MySQL database with Docker
docker-compose up -d

# The database will be automatically initialized with schema and sample data
```

#### Option 2: Manual Setup
1. Install MySQL/MariaDB
2. Create database:
   ```sql
   CREATE DATABASE course_management_system;
   ```
3. Run schema script:
   ```bash
   mysql -u root -p course_management_system < schema.sql
   ```
4. Load sample data:
   ```bash
   mysql -u root -p course_management_system < sample_data.sql
   ```

## Database Schema Overview

### Core Tables
- `users` - Base user information (shared by all roles)
- `admins` - Admin-specific data
- `lecturers` - Lecturer-specific data  
- `students` - Student-specific data

### Academic Tables
- `courses` - Course information
- `enrollments` - Student-course relationships
- `assignments` - Course assignments
- `submissions` - Student assignment submissions
- `announcements` - Course announcements

### Key Relationships
- Users have role-specific entries (Admin/Lecturer/Student)
- Lecturers teach multiple courses
- Students enroll in multiple courses
- Courses have multiple assignments
- Students submit assignments

## Environment Configuration

Update `application.yml` to switch between databases:

### H2 (Development)
```yaml
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

### MySQL (Production)
```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/course_management_system
    username: cms_user
    password: cms_password
    driver-class-name: com.mysql.cj.jdbc.Driver
```

## Security Notes
- All demo passwords are hashed using BCrypt
- Change default passwords in production
- Use environment variables for database credentials
- Enable SSL for database connections in production

## Backup and Migration
- Regular backups recommended for production
- Use MySQL dump for data migration
- Version control schema changes
- Test migrations on staging environment first
