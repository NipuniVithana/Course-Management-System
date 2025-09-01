-- Add file-related fields to assignments table
ALTER TABLE assignments 
ADD COLUMN file_name VARCHAR(255),
ADD COLUMN file_path VARCHAR(500),
ADD COLUMN file_size BIGINT;
