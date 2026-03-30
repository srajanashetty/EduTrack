-- Sample data for EduTrack
-- Password for all accounts is: password
-- (BCrypt encoded as $2a$10$SlYQmyNdGzTn7ZLBXBChFOC9f6kFjAqPhccnP6DxlWXx2lPk1C3G6)

-- Insert Users
INSERT IGNORE INTO users (id, username, password, role, full_name, phone_number, profile_image) VALUES
(1, 'admin@edutrack.com', '$2a$10$SlYQmyNdGzTn7ZLBXBChFOC9f6kFjAqPhccnP6DxlWXx2lPk1C3G6', 'ADMIN', 'System Admin', '1234567890', NULL),
(2, 'teacher@edutrack.com', '$2a$10$SlYQmyNdGzTn7ZLBXBChFOC9f6kFjAqPhccnP6DxlWXx2lPk1C3G6', 'TEACHER', 'Demo Teacher', '0987654321', NULL),
(3, 'student@edutrack.com', '$2a$10$SlYQmyNdGzTn7ZLBXBChFOC9f6kFjAqPhccnP6DxlWXx2lPk1C3G6', 'STUDENT', 'Demo Student', '1112223333', NULL);

-- Insert Teacher Details (Linked to user_id=2)
INSERT IGNORE INTO teacher_details (id, user_id, name, email, department, subjects_handled, experience, teacher_id) VALUES
(1, 2, 'Demo Teacher', 'teacher@edutrack.com', 'CSE', 'Software Engineering, Database Management', '5 Years', 'T1001');

-- Insert Student Details (Linked to user_id=3)
INSERT IGNORE INTO students (id, user_id, name, email, department, year, section) VALUES
(1, 3, 'Demo Student', 'student@edutrack.com', 'CSE', 3, 'A');
