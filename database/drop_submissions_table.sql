-- Migration: Remove unused submissions table
-- Description: Drop the unused submissions table as the application now uses assignment_submissions table exclusively

-- Drop the unused submissions table
DROP TABLE IF EXISTS submissions;
