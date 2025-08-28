-- H2 Sample Data for Development
-- Password for all demo accounts: "password123" (encoded with BCrypt)

-- Insert demo users
INSERT INTO users (first_name, last_name, email, password, role) VALUES
('System', 'Administrator', 'admin@university.edu', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HI/2Kn86WX.XL5GGGLj9q', 'ADMIN'),
('John', 'Smith', 'lecturer@university.edu', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HI/2Kn86WX.XL5GGGLj9q', 'LECTURER'),
('Jane', 'Doe', 'student@university.edu', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HI/2Kn86WX.XL5GGGLj9q', 'STUDENT'),
('Robert', 'Johnson', 'robert.johnson@university.edu', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HI/2Kn86WX.XL5GGGLj9q', 'LECTURER'),
('Emily', 'Davis', 'emily.davis@university.edu', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HI/2Kn86WX.XL5GGGLj9q', 'STUDENT'),
('Michael', 'Wilson', 'michael.wilson@university.edu', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HI/2Kn86WX.XL5GGGLj9q', 'STUDENT');

-- Insert admins
INSERT INTO admins (user_id) VALUES (1);

-- Insert lecturers
INSERT INTO lecturers (user_id, lecturer_id, department) VALUES
(2, 'LEC001', 'Computer Science'),
(4, 'LEC002', 'Mathematics');

-- Insert students
INSERT INTO students (user_id, student_id, department) VALUES
(3, 'STU001', 'Computer Science'),
(5, 'STU002', 'Computer Science'),
(6, 'STU003', 'Mathematics');

-- Insert courses
INSERT INTO courses (course_code, course_name, description, credits, lecturer_id, status) VALUES
('CS101', 'Introduction to Programming', 'Basic programming concepts using Java', 3, 1, 'ACTIVE'),
('CS201', 'Data Structures and Algorithms', 'Advanced data structures and algorithm analysis', 4, 1, 'ACTIVE'),
('MATH101', 'Calculus I', 'Differential and integral calculus', 4, 2, 'ACTIVE'),
('CS301', 'Database Systems', 'Database design and SQL programming', 3, 1, 'ACTIVE');

-- Insert enrollments
INSERT INTO enrollments (student_id, course_id, status) VALUES
(1, 1, 'ENROLLED'),
(1, 2, 'ENROLLED'),
(2, 1, 'ENROLLED'),
(2, 4, 'ENROLLED'),
(3, 3, 'ENROLLED');

-- Insert assignments
INSERT INTO assignments (course_id, title, description, due_date, max_score) VALUES
(1, 'Hello World Program', 'Create a simple Hello World program in Java', DATEADD('DAY', 7, CURRENT_TIMESTAMP), 100.00),
(1, 'Calculator Application', 'Build a basic calculator with GUI', DATEADD('DAY', 14, CURRENT_TIMESTAMP), 150.00),
(2, 'Binary Search Implementation', 'Implement binary search algorithm', DATEADD('DAY', 10, CURRENT_TIMESTAMP), 100.00),
(3, 'Derivative Problems', 'Solve calculus derivative problems', DATEADD('DAY', 5, CURRENT_TIMESTAMP), 100.00),
(4, 'Database Design Project', 'Design a database for a library system', DATEADD('DAY', 21, CURRENT_TIMESTAMP), 200.00);

-- Insert sample submissions
INSERT INTO submissions (assignment_id, student_id, content, score, status, graded_at, graded_by) VALUES
(1, 1, 'public class HelloWorld { public static void main(String[] args) { System.out.println("Hello World!"); } }', 95.00, 'GRADED', CURRENT_TIMESTAMP, 1),
(1, 2, 'public class Hello { public static void main(String[] args) { System.out.println("Hello World"); } }', 90.00, 'GRADED', CURRENT_TIMESTAMP, 1),
(3, 1, 'Binary search implementation with recursive approach...', 88.00, 'GRADED', CURRENT_TIMESTAMP, 1);

-- Insert announcements
INSERT INTO announcements (course_id, lecturer_id, title, content, is_important) VALUES
(1, 1, 'Welcome to CS101', 'Welcome to Introduction to Programming! Please review the syllabus and course materials.', TRUE),
(1, 1, 'Assignment 1 Posted', 'The first assignment has been posted. Due date is next week.', FALSE),
(2, 1, 'Midterm Exam Schedule', 'The midterm exam will be held on [Date]. Please prepare accordingly.', TRUE),
(3, 2, 'Office Hours Update', 'My office hours have been updated. Please check the course page for details.', FALSE);
