-- MySQL Initialization Script for Docker
-- This file is executed when the MySQL container starts for the first time

-- Create the database
CREATE DATABASE IF NOT EXISTS course_management_system;
USE course_management_system;

-- Grant privileges to the CMS user
GRANT ALL PRIVILEGES ON course_management_system.* TO 'cms_user'@'%';
FLUSH PRIVILEGES;

-- Source the schema and sample data
SOURCE /docker-entrypoint-initdb.d/schema.sql;
SOURCE /docker-entrypoint-initdb.d/sample_data.sql;
