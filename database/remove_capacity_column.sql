-- Remove capacity column from courses table
-- This script ensures the capacity column is removed from the courses table

USE course_management_system;

-- Check if capacity column exists and remove it
SET @sql = (
    SELECT IF(
        COUNT(*) > 0,
        'ALTER TABLE courses DROP COLUMN capacity;',
        'SELECT "Column capacity does not exist" as message;'
    )
    FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_SCHEMA = 'course_management_system' 
    AND TABLE_NAME = 'courses' 
    AND COLUMN_NAME = 'capacity'
);

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Verify the column has been removed
SELECT COLUMN_NAME 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = 'course_management_system' 
AND TABLE_NAME = 'courses'
ORDER BY ORDINAL_POSITION;
