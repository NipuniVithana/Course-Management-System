-- Database Backup Script
-- Run this to create a backup of the database

-- For MySQL:
-- mysqldump -u cms_user -p course_management_system > backup_$(date +%Y%m%d_%H%M%S).sql

-- Restore from backup:
-- mysql -u cms_user -p course_management_system < backup_file.sql

-- Example backup with compression:
-- mysqldump -u cms_user -p course_management_system | gzip > backup_$(date +%Y%m%d_%H%M%S).sql.gz

-- Restore from compressed backup:
-- gunzip < backup_file.sql.gz | mysql -u cms_user -p course_management_system
