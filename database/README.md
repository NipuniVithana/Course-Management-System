# Database Configuration Guide

This folder contains database schema and configuration files for the Course Management System.

## Files Overview

### Schema Files
- `schema.sql` - MySQL database schema (main production schema)
- `mysql-init.sql` - MySQL initialization script

### Migration Files
- `create_course_materials_table.sql` - Migration for course materials functionality
- `create_assignment_submissions_table.sql` - Migration for assignment submissions
- `add_assignment_file_fields.sql` - Migration for assignment file support
- `remove_capacity_column.sql` - Migration to remove course capacity logic
- `drop_submissions_table.sql` - Migration to remove unused submissions table

### Sample Data Files  
- `sample_data.sql` - Sample data for MySQL database
- `backup.sql` - Database backup

### Legacy Files (Not Used)
- `h2_schema.sql` - H2 database schema (legacy - not used)
- `h2_sample_data.sql` - H2 sample data (legacy - not used)

## Database Setup

### Current Setup (MySQL)
The application is configured to use MySQL database exclusively. Data initialization is handled programmatically through the `DataInitializer.java` class.

**Demo Accounts:**
- Admin: `admin@university.edu` / `admin123`
- Lecturer: `lecturer@university.edu` / `lecturer123`  
- Student: `student@university.edu` / `student123`

### MySQL Database Setup

#### Prerequisites
1. Install MySQL 8.0 or higher
2. Ensure MySQL service is running

#### Database Creation
1. Create database and user:
   ```sql
   CREATE DATABASE cms_database;
   CREATE USER 'root'@'localhost' IDENTIFIED BY 'root';
   GRANT ALL PRIVILEGES ON cms_database.* TO 'root'@'localhost';
   FLUSH PRIVILEGES;
   ```

2. The application uses JPA `ddl-auto: update` to automatically create/update schema from entity classes.

3. Sample data is automatically created by `DataInitializer.java` on first run.

#### Manual Schema Setup (Optional)
If you prefer manual schema setup:
```bash
mysql -u root -proot cms_database < schema.sql
```

## Database Schema Overview

### Core Tables
- `users` - Base user information (shared by all roles)
- `admins` - Admin-specific data
- `lecturers` - Lecturer-specific data  
- `students` - Student-specific data

### Academic Tables
- `courses` - Course information
- `degrees` - Academic degree programs
- `enrollments` - Student-course relationships
- `assignments` - Course assignments
- `assignment_submissions` - Student assignment submissions with file support
- `course_materials` - Course materials and resources

### Key Relationships
- Users have role-specific entries (Admin/Lecturer/Student)
- Lecturers can register for and teach multiple courses
- Students enroll in multiple courses
- Courses belong to degree programs
- Courses have multiple assignments and materials
- Students submit assignments with text and file uploads
- Lecturers can grade submissions and provide feedback

## Environment Configuration

Current application configuration in `application.yml`:

### MySQL (Current Setup)
```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/cms_database?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
    driver-class-name: com.mysql.cj.jdbc.Driver
    username: root
    password: root
  
  jpa:
    database-platform: org.hibernate.dialect.MySQL8Dialect
    hibernate:
      ddl-auto: update
    show-sql: true
```

### Profile Configuration
- **Development**: `application-dev.yml` (MySQL)
- **Production**: `application-prod.yml` (MySQL with environment variables)

## Security Notes
- All demo passwords are hashed using BCrypt
- Change default passwords in production
- Use environment variables for database credentials in production
- Database connections use standard MySQL security practices

## Data Management
- **Automatic Initialization**: `DataInitializer.java` creates initial users and sample data
- **Schema Management**: JPA entities automatically create/update database schema
- **File Storage**: Assignment submissions and course materials stored in `uploads/` directory
- **Database Migrations**: SQL migration files for schema changes

## Development Notes
- The application creates sample users on first run if database is empty
- Course materials and assignments support file uploads
- Submission system supports both text and file submissions
- Lecturer-student enrollment system with grading functionality

## Backup and Migration
- Use MySQL dump for data backup: `mysqldump -u root -proot cms_database > backup.sql`
- Migration files in this directory document schema changes
- Test migrations on development environment first
- File uploads are stored in filesystem, backup separately
