package com.university.cms.service;

import com.university.cms.entity.Assignment;
import com.university.cms.entity.CourseMaterial;
import com.university.cms.entity.Lecturer;
import com.university.cms.entity.User;
import com.university.cms.entity.Course;
import com.university.cms.entity.Enrollment;
import com.university.cms.repository.AssignmentRepository;
import com.university.cms.repository.CourseMaterialRepository;
import com.university.cms.repository.LecturerRepository;
import com.university.cms.repository.CourseRepository;
import com.university.cms.repository.EnrollmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.ArrayList;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.time.format.DateTimeFormatter;
import java.util.stream.Collectors;

@Service
@Transactional
public class LecturerService {

    @Autowired
    private LecturerRepository lecturerRepository;
    
    @Autowired
    private CourseRepository courseRepository;
    
    @Autowired
    private EnrollmentRepository enrollmentRepository;
    
    @Autowired
    private AssignmentRepository assignmentRepository;
    
    @Autowired
    private CourseMaterialRepository courseMaterialRepository;

    public Lecturer getLecturerByUser(User user) {
        return lecturerRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Lecturer not found for user"));
    }

    public List<Map<String, Object>> getEnrolledStudents(Long courseId) {
        return enrollmentRepository.findByCourseId(courseId).stream()
                .map(enrollment -> {
                    Map<String, Object> studentData = new HashMap<>();
                    studentData.put("id", enrollment.getStudent().getId());
                    studentData.put("studentId", enrollment.getStudent().getStudentId());
                    studentData.put("firstName", enrollment.getStudent().getFirstName());
                    studentData.put("lastName", enrollment.getStudent().getLastName());
                    studentData.put("email", enrollment.getStudent().getUser().getEmail());
                    studentData.put("enrollmentDate", enrollment.getEnrollmentDate());
                    studentData.put("status", enrollment.getStatus());
                    studentData.put("grade", enrollment.getFinalGrade());
                    return studentData;
                })
                .collect(Collectors.toList());
    }

    public List<Lecturer> getAllLecturers() {
        return lecturerRepository.findAll();
    }
    
    // Course Materials Management
    public List<Map<String, Object>> getCourseMaterials(Long courseId) {
        List<CourseMaterial> materials = courseMaterialRepository.findByCourseId(courseId);
        return materials.stream().map(material -> {
            Map<String, Object> materialData = new HashMap<>();
            materialData.put("id", material.getId());
            materialData.put("title", material.getTitle());
            materialData.put("description", material.getDescription());
            materialData.put("fileName", material.getFileName());
            materialData.put("fileSize", material.getFileSize());
            materialData.put("uploadDate", material.getUploadDate().toString());
            return materialData;
        }).collect(Collectors.toList());
    }
    
    public void uploadCourseMaterial(Long courseId, String title, String description, MultipartFile file) {
        try {
            // Get course
            Course course = courseRepository.findById(courseId)
                    .orElseThrow(() -> new RuntimeException("Course not found"));
            
            String fileName = file.getOriginalFilename();
            String uploadDir = "uploads/materials/";
            
            // Create directory if it doesn't exist
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }
            
            // Generate unique filename
            String uniqueFileName = System.currentTimeMillis() + "_" + fileName;
            Path filePath = uploadPath.resolve(uniqueFileName);
            
            // Save file
            Files.copy(file.getInputStream(), filePath);
            
            // Create and save course material entity
            CourseMaterial material = new CourseMaterial();
            material.setCourse(course);
            material.setTitle(title);
            material.setDescription(description);
            material.setFileName(fileName);
            material.setFilePath(filePath.toString());
            material.setFileSize(file.getSize());
            
            courseMaterialRepository.save(material);
        } catch (Exception e) {
            throw new RuntimeException("Failed to upload material: " + e.getMessage());
        }
    }
    
    public void updateCourseMaterial(Long courseId, Long materialId, String title, String description) {
        try {
            CourseMaterial material = courseMaterialRepository.findById(materialId)
                    .orElseThrow(() -> new RuntimeException("Material not found"));
            
            // Verify material belongs to the course
            if (!material.getCourse().getId().equals(courseId)) {
                throw new RuntimeException("Material does not belong to the specified course");
            }
            
            material.setTitle(title);
            material.setDescription(description);
            
            courseMaterialRepository.save(material);
        } catch (Exception e) {
            throw new RuntimeException("Failed to update material: " + e.getMessage());
        }
    }
    
    public void deleteCourseMaterial(Long courseId, Long materialId) {
        try {
            CourseMaterial material = courseMaterialRepository.findById(materialId)
                    .orElseThrow(() -> new RuntimeException("Material not found"));
            
            // Verify material belongs to the course
            if (!material.getCourse().getId().equals(courseId)) {
                throw new RuntimeException("Material does not belong to the specified course");
            }
            
            // Delete the physical file
            if (material.getFilePath() != null) {
                try {
                    Files.deleteIfExists(Paths.get(material.getFilePath()));
                } catch (IOException e) {
                    // Log but don't fail if file can't be deleted
                    System.err.println("Failed to delete material file: " + e.getMessage());
                }
            }
            
            // Delete from database
            courseMaterialRepository.deleteById(materialId);
        } catch (Exception e) {
            throw new RuntimeException("Failed to delete material: " + e.getMessage());
        }
    }

    public ResponseEntity<byte[]> downloadCourseMaterial(Long courseId, Long materialId) {
        try {
            CourseMaterial material = courseMaterialRepository.findById(materialId)
                    .orElseThrow(() -> new RuntimeException("Material not found"));
            
            // Verify material belongs to the course
            if (!material.getCourse().getId().equals(courseId)) {
                throw new RuntimeException("Material does not belong to the specified course");
            }
            
            String filePath = material.getFilePath();
            String fileName = material.getFileName();
            
            if (filePath == null) {
                throw new RuntimeException("No file associated with this material");
            }
            
            Path path = Paths.get(filePath);
            if (!Files.exists(path)) {
                throw new RuntimeException("File not found on server");
            }
            
            byte[] fileContent = Files.readAllBytes(path);
            
            return ResponseEntity.ok()
                    .header("Content-Disposition", "attachment; filename=\"" + fileName + "\"")
                    .header("Content-Type", "application/octet-stream")
                    .body(fileContent);
                    
        } catch (Exception e) {
            throw new RuntimeException("Failed to download material file: " + e.getMessage());
        }
    }

    public Lecturer getLecturerById(Long id) {
        return lecturerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Lecturer not found"));
    }

    public void updateStudentGrade(Long courseId, Long studentId, Map<String, Object> gradeData) {
        // Find the enrollment
        Enrollment enrollment = enrollmentRepository.findByStudentIdAndCourseId(studentId, courseId)
                .orElseThrow(() -> new RuntimeException("Enrollment not found"));
        
        // Update the grade and feedback
        if (gradeData.containsKey("grade")) {
            enrollment.setFinalGrade(gradeData.get("grade").toString());
        }
        if (gradeData.containsKey("feedback")) {
            enrollment.setFeedback(gradeData.get("feedback").toString());
        }
        enrollment.setGradedDate(java.time.LocalDateTime.now());
        
        // Save the updated enrollment
        enrollmentRepository.save(enrollment);
    }
    
    public long getTotalLecturerCount() {
        return lecturerRepository.count();
    }
    
    public List<Map<String, Object>> getCoursesWithStats(Lecturer lecturer) {
        List<Course> courses = courseRepository.findByLecturer(lecturer);
        List<Map<String, Object>> coursesWithStats = new ArrayList<>();
        
        for (Course course : courses) {
            Map<String, Object> courseData = new HashMap<>();
            courseData.put("id", course.getId());
            courseData.put("title", course.getTitle());
            courseData.put("courseCode", course.getCourseCode());
            courseData.put("description", course.getDescription());
            courseData.put("credits", course.getCredits());
            courseData.put("department", course.getDepartment());
            courseData.put("status", course.getStatus());
            
            // Calculate enrolled count
            List<Enrollment> enrollments = enrollmentRepository.findByCourseId(course.getId());
            courseData.put("enrolledCount", enrollments.size());
            
            // Calculate average grade
            List<Enrollment> gradedEnrollments = enrollments.stream()
                .filter(e -> e.getFinalGrade() != null && !e.getFinalGrade().trim().isEmpty())
                .collect(Collectors.toList());
            
            if (!gradedEnrollments.isEmpty()) {
                double averageGrade = calculateAverageGrade(gradedEnrollments);
                courseData.put("averageGrade", averageGrade);
            } else {
                courseData.put("averageGrade", null);
            }
            
            coursesWithStats.add(courseData);
        }
        
        return coursesWithStats;
    }
    
    private double calculateAverageGrade(List<Enrollment> gradedEnrollments) {
        double totalPoints = 0;
        int validGrades = 0;
        
        for (Enrollment enrollment : gradedEnrollments) {
            String grade = enrollment.getFinalGrade().trim();
            try {
                double numericGrade = Double.parseDouble(grade);
                if (numericGrade >= 0 && numericGrade <= 100) { // Valid numeric grade
                    totalPoints += numericGrade;
                    validGrades++;
                }
            } catch (NumberFormatException e) {
                // Skip invalid grades
                System.out.println("Invalid grade format: " + grade);
            }
        }
        
        return validGrades > 0 ? totalPoints / validGrades : 0.0;
    }
    
    // Remove the letter grade conversion method since we only use numeric grades now
    
    public List<Map<String, Object>> getRecentActivities(Lecturer lecturer) {
        List<Map<String, Object>> activities = new ArrayList<>();
        
        try {
            // Get lecturer's courses
            List<Course> courses = courseRepository.findByLecturer(lecturer);
            System.out.println("Lecturer " + lecturer.getId() + " has " + courses.size() + " courses");
            
            // Activity 1: Recent Course Materials Uploaded
            for (Course course : courses) {
                List<CourseMaterial> recentMaterials = courseMaterialRepository.findByCourseId(course.getId());
                for (CourseMaterial material : recentMaterials.stream()
                        .sorted((a, b) -> b.getUploadDate().compareTo(a.getUploadDate()))
                        .limit(2)
                        .collect(Collectors.toList())) {
                    Map<String, Object> activity = new HashMap<>();
                    activity.put("id", "material-" + material.getId());
                    activity.put("type", "material");
                    activity.put("title", "Material Uploaded");
                    activity.put("description", "Uploaded \"" + material.getTitle() + "\" to " + course.getTitle());
                    activity.put("time", getTimeAgo(material.getUploadDate()));
                    activity.put("icon", "file-text");
                    activity.put("color", "#52c41a");
                    activities.add(activity);
                }
            }
            
            // Activity 2: Recent Assignments Created
            for (Course course : courses) {
                List<Assignment> recentAssignments = assignmentRepository.findByCourseId(course.getId());
                for (Assignment assignment : recentAssignments.stream()
                        .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                        .limit(2)
                        .collect(Collectors.toList())) {
                    Map<String, Object> activity = new HashMap<>();
                    activity.put("id", "assignment-" + assignment.getId());
                    activity.put("type", "assignment");
                    activity.put("title", "Assignment Created");
                    activity.put("description", "Created \"" + assignment.getTitle() + "\" for " + course.getTitle());
                    activity.put("time", getTimeAgo(assignment.getCreatedAt()));
                    activity.put("icon", "edit");
                    activity.put("color", "#1890ff");
                    activities.add(activity);
                }
            }
            
            // Activity 3: Recent Student Enrollments
            for (Course course : courses) {
                try {
                    List<Enrollment> recentEnrollments = enrollmentRepository
                        .findByCourseIdOrderByEnrollmentDateDesc(course.getId());
                    
                    for (Enrollment enrollment : recentEnrollments.stream().limit(2).collect(Collectors.toList())) {
                        Map<String, Object> activity = new HashMap<>();
                        activity.put("id", "enrollment-" + enrollment.getId());
                        activity.put("type", "enrollment");
                        activity.put("title", "New Student Enrollment");
                        activity.put("description", enrollment.getStudent().getFirstName() + " " + 
                                   enrollment.getStudent().getLastName() + " enrolled in " + course.getTitle());
                        activity.put("time", getTimeAgo(enrollment.getEnrollmentDate()));
                        activity.put("icon", "user-add");
                        activity.put("color", "#722ed1");
                        activities.add(activity);
                    }
                } catch (Exception e) {
                    System.err.println("Error fetching enrollments for course " + course.getId() + ": " + e.getMessage());
                }
            }
            
            // Activity 4: Recent Grade Updates
            for (Course course : courses) {
                try {
                    List<Enrollment> recentlyGraded = enrollmentRepository
                        .findByCourseIdAndFinalGradeIsNotNullOrderByGradedDateDesc(course.getId());
                    
                    for (Enrollment enrollment : recentlyGraded.stream().limit(2).collect(Collectors.toList())) {
                        if (enrollment.getGradedDate() != null) {
                            Map<String, Object> activity = new HashMap<>();
                            activity.put("id", "grade-" + enrollment.getId());
                            activity.put("type", "grading");
                            activity.put("title", "Grade Updated");
                            activity.put("description", "Updated grade for " + enrollment.getStudent().getFirstName() + 
                                       " " + enrollment.getStudent().getLastName() + " in " + course.getTitle());
                            activity.put("time", getTimeAgo(enrollment.getGradedDate()));
                            activity.put("icon", "check-circle");
                            activity.put("color", "#f5222d");
                            activities.add(activity);
                        }
                    }
                } catch (Exception e) {
                    System.err.println("Error fetching graded enrollments for course " + course.getId() + ": " + e.getMessage());
                }
            }
            
            // If no recent activities, add some default ones
            if (activities.isEmpty()) {
                for (Course course : courses.stream().limit(3).collect(Collectors.toList())) {
                    Map<String, Object> activity = new HashMap<>();
                    activity.put("id", "course-" + course.getId());
                    activity.put("type", "course");
                    activity.put("title", "Teaching Course");
                    activity.put("description", "You are teaching " + course.getTitle());
                    activity.put("time", getTimeAgo(course.getCreatedAt()));
                    activity.put("icon", "book");
                    activity.put("color", "#13c2c2");
                    activities.add(activity);
                }
                
                // Add a welcome activity if still empty
                if (activities.isEmpty()) {
                    Map<String, Object> activity = new HashMap<>();
                    activity.put("id", "welcome");
                    activity.put("type", "welcome");
                    activity.put("title", "Welcome to CMS");
                    activity.put("description", "Start by exploring your courses and uploading materials");
                    activity.put("time", "Just now");
                    activity.put("icon", "smile");
                    activity.put("color", "#52c41a");
                    activities.add(activity);
                }
            }
            
            // Sort by most recent and limit to 5
            activities.sort((a, b) -> {
                String timeA = a.get("time").toString();
                String timeB = b.get("time").toString();
                
                // Handle "Just now" case
                if (timeA.equals("Just now")) return -1;
                if (timeB.equals("Just now")) return 1;
                
                // For other time formats, reverse sort (most recent first)
                return timeB.compareTo(timeA);
            });
            
            List<Map<String, Object>> result = activities.stream().limit(5).collect(Collectors.toList());
            System.out.println("Returning " + result.size() + " activities for lecturer " + lecturer.getId());
            
            return result;
            
        } catch (Exception e) {
            e.printStackTrace();
            System.err.println("Error in getRecentActivities: " + e.getMessage());
            
            // Return a default activity on error
            List<Map<String, Object>> defaultActivities = new ArrayList<>();
            Map<String, Object> activity = new HashMap<>();
            activity.put("id", "error");
            activity.put("type", "error");
            activity.put("title", "Welcome");
            activity.put("description", "Start exploring your lecturer dashboard");
            activity.put("time", "Just now");
            activity.put("icon", "info-circle");
            activity.put("color", "#1890ff");
            defaultActivities.add(activity);
            
            return defaultActivities;
        }
    }
    
    private String getTimeAgo(LocalDateTime dateTime) {
        if (dateTime == null) return "Unknown time";
        
        LocalDateTime now = LocalDateTime.now();
        long minutes = ChronoUnit.MINUTES.between(dateTime, now);
        long hours = ChronoUnit.HOURS.between(dateTime, now);
        long days = ChronoUnit.DAYS.between(dateTime, now);
        
        if (minutes < 60) {
            return minutes <= 1 ? "1 minute ago" : minutes + " minutes ago";
        } else if (hours < 24) {
            return hours == 1 ? "1 hour ago" : hours + " hours ago";
        } else if (days < 7) {
            return days == 1 ? "1 day ago" : days + " days ago";
        } else {
            return dateTime.format(DateTimeFormatter.ofPattern("MMM d, yyyy"));
        }
    }
    
    // Assignment Management Methods
    public List<Assignment> getCourseAssignments(Long courseId) {
        return assignmentRepository.findByCourseId(courseId);
    }
    
    public void createAssignment(Map<String, Object> assignmentData, MultipartFile file) {
        try {
            Assignment assignment = new Assignment();
            assignment.setTitle((String) assignmentData.get("title"));
            assignment.setDescription((String) assignmentData.get("description"));
            assignment.setMaxPoints((Integer) assignmentData.get("maxPoints"));
            
            // Parse the due date
            String dueDateStr = (String) assignmentData.get("dueDate");
            LocalDateTime dueDate = LocalDateTime.parse(dueDateStr);
            assignment.setDueDate(dueDate);
            
            // Get course
            Long courseId = Long.valueOf(assignmentData.get("courseId").toString());
            Course course = courseRepository.findById(courseId)
                    .orElseThrow(() -> new RuntimeException("Course not found"));
            assignment.setCourse(course);
            
            // Handle file upload if present
            if (file != null && !file.isEmpty()) {
                String fileName = file.getOriginalFilename();
                String uploadDir = "uploads/assignments/";
                
                // Create directory if it doesn't exist
                Path uploadPath = Paths.get(uploadDir);
                if (!Files.exists(uploadPath)) {
                    Files.createDirectories(uploadPath);
                }
                
                // Generate unique filename
                String uniqueFileName = System.currentTimeMillis() + "_" + fileName;
                Path filePath = uploadPath.resolve(uniqueFileName);
                
                // Save file
                Files.copy(file.getInputStream(), filePath);
                
                // Set file information in assignment
                assignment.setFileName(fileName);
                assignment.setFilePath(filePath.toString());
                assignment.setFileSize(file.getSize());
            }
            
            assignmentRepository.save(assignment);
        } catch (Exception e) {
            throw new RuntimeException("Failed to create assignment: " + e.getMessage());
        }
    }
    
    public void updateAssignment(Long assignmentId, Map<String, Object> assignmentData, MultipartFile file) {
        try {
            Assignment assignment = assignmentRepository.findById(assignmentId)
                    .orElseThrow(() -> new RuntimeException("Assignment not found"));
            
            assignment.setTitle((String) assignmentData.get("title"));
            assignment.setDescription((String) assignmentData.get("description"));
            assignment.setMaxPoints((Integer) assignmentData.get("maxPoints"));
            
            // Parse the due date
            String dueDateStr = (String) assignmentData.get("dueDate");
            LocalDateTime dueDate = LocalDateTime.parse(dueDateStr);
            assignment.setDueDate(dueDate);
            
            // Handle file upload if present
            if (file != null && !file.isEmpty()) {
                // Delete old file if exists
                if (assignment.getFilePath() != null) {
                    try {
                        Files.deleteIfExists(Paths.get(assignment.getFilePath()));
                    } catch (IOException e) {
                        // Log but don't fail if old file can't be deleted
                        System.err.println("Failed to delete old file: " + e.getMessage());
                    }
                }
                
                String fileName = file.getOriginalFilename();
                String uploadDir = "uploads/assignments/";
                
                // Create directory if it doesn't exist
                Path uploadPath = Paths.get(uploadDir);
                if (!Files.exists(uploadPath)) {
                    Files.createDirectories(uploadPath);
                }
                
                // Generate unique filename
                String uniqueFileName = System.currentTimeMillis() + "_" + fileName;
                Path filePath = uploadPath.resolve(uniqueFileName);
                
                // Save file
                Files.copy(file.getInputStream(), filePath);
                
                // Update file information in assignment
                assignment.setFileName(fileName);
                assignment.setFilePath(filePath.toString());
                assignment.setFileSize(file.getSize());
            }
            
            assignmentRepository.save(assignment);
        } catch (Exception e) {
            throw new RuntimeException("Failed to update assignment: " + e.getMessage());
        }
    }
    
    public void deleteAssignment(Long assignmentId) {
        try {
            Assignment assignment = assignmentRepository.findById(assignmentId)
                    .orElseThrow(() -> new RuntimeException("Assignment not found"));
            
            // Delete associated file if exists
            if (assignment.getFilePath() != null) {
                try {
                    Files.deleteIfExists(Paths.get(assignment.getFilePath()));
                } catch (IOException e) {
                    // Log but don't fail if file can't be deleted
                    System.err.println("Failed to delete assignment file: " + e.getMessage());
                }
            }
            
            assignmentRepository.deleteById(assignmentId);
        } catch (Exception e) {
            throw new RuntimeException("Failed to delete assignment: " + e.getMessage());
        }
    }
    
    public ResponseEntity<byte[]> downloadAssignmentFile(Long assignmentId) {
        try {
            Assignment assignment = assignmentRepository.findById(assignmentId)
                    .orElseThrow(() -> new RuntimeException("Assignment not found"));
            
            if (assignment.getFilePath() == null) {
                throw new RuntimeException("No file associated with this assignment");
            }
            
            Path filePath = Paths.get(assignment.getFilePath());
            if (!Files.exists(filePath)) {
                throw new RuntimeException("File not found on server");
            }
            
            byte[] fileContent = Files.readAllBytes(filePath);
            
            return ResponseEntity.ok()
                    .header("Content-Disposition", "attachment; filename=\"" + assignment.getFileName() + "\"")
                    .header("Content-Type", "application/octet-stream")
                    .body(fileContent);
                    
        } catch (Exception e) {
            throw new RuntimeException("Failed to download assignment file: " + e.getMessage());
        }
    }
    
    public Long getCourseIdByAssignmentId(Long assignmentId) {
        Assignment assignment = assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new RuntimeException("Assignment not found"));
        return assignment.getCourse().getId();
    }

    // Profile Management Methods
    public Map<String, Object> getProfile(Lecturer lecturer) {
        try {
            Map<String, Object> profile = new HashMap<>();
            User user = lecturer.getUser();
            
            profile.put("id", lecturer.getId());
            profile.put("employeeId", lecturer.getEmployeeId());
            profile.put("lecturerId", lecturer.getLecturerId());
            profile.put("firstName", lecturer.getFirstName());
            profile.put("lastName", lecturer.getLastName());
            profile.put("email", user.getEmail());
            profile.put("phone", lecturer.getPhone());
            profile.put("department", lecturer.getDepartment());
            profile.put("officeLocation", lecturer.getOfficeLocation());
            
            return profile;
        } catch (Exception e) {
            throw new RuntimeException("Failed to get profile: " + e.getMessage());
        }
    }

    public void updateProfile(Lecturer lecturer, Map<String, Object> profileData) {
        try {
            // Update lecturer fields
            if (profileData.containsKey("firstName")) {
                lecturer.setFirstName((String) profileData.get("firstName"));
            }
            if (profileData.containsKey("lastName")) {
                lecturer.setLastName((String) profileData.get("lastName"));
            }
            if (profileData.containsKey("phone")) {
                lecturer.setPhone((String) profileData.get("phone"));
            }
            if (profileData.containsKey("department")) {
                lecturer.setDepartment((String) profileData.get("department"));
            }
            if (profileData.containsKey("officeLocation")) {
                lecturer.setOfficeLocation((String) profileData.get("officeLocation"));
            }
            
            lecturerRepository.save(lecturer);
        } catch (Exception e) {
            throw new RuntimeException("Failed to update profile: " + e.getMessage());
        }
    }

    public void changePassword(User user, Map<String, String> passwordData) {
        try {
            String currentPassword = passwordData.get("currentPassword");
            String newPassword = passwordData.get("newPassword");
            
            // In a real implementation, you would verify the current password
            // and hash the new password before saving
            // For now, this is a placeholder implementation
            
            if (currentPassword == null || newPassword == null) {
                throw new RuntimeException("Current password and new password are required");
            }
            
            if (newPassword.length() < 6) {
                throw new RuntimeException("New password must be at least 6 characters long");
            }
            
            // TODO: Implement actual password verification and hashing
            // user.setPassword(hashedNewPassword);
            // userRepository.save(user);
            
            // For now, just validate the input
            System.out.println("Password change requested for user: " + user.getEmail());
            
        } catch (Exception e) {
            throw new RuntimeException("Failed to change password: " + e.getMessage());
        }
    }
}
