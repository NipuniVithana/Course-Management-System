package com.university.cms.controller;

import com.university.cms.entity.Assignment;
import com.university.cms.entity.Course;
import com.university.cms.entity.Lecturer;
import com.university.cms.entity.Student;
import com.university.cms.entity.User;
import com.university.cms.service.CourseService;
import com.university.cms.service.LecturerService;
import com.university.cms.service.StudentService;
import com.university.cms.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/lecturer")
@CrossOrigin(origins = "http://localhost:3000")
public class LecturerController {

    @Autowired
    private CourseService courseService;
    
    @Autowired
    private LecturerService lecturerService;
    
    @Autowired
    private StudentService studentService;
    
    @Autowired
    private AuthService authService;

    // Course browsing
    @GetMapping("/courses/available")
    public ResponseEntity<List<Map<String, Object>>> getAvailableCourses(Authentication authentication) {
        try {
            String email = authentication.getName();
            User user = authService.getCurrentUser(email);
            Lecturer lecturer = lecturerService.getLecturerByUser(user);
            
            List<Map<String, Object>> courses = courseService.getAvailableCoursesForLecturer(lecturer);
            return ResponseEntity.ok(courses);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // My courses
    @GetMapping("/courses")
    @PreAuthorize("hasRole('LECTURER')")
    public ResponseEntity<?> getMyCourses(Authentication authentication) {
        try {
            String email = authentication.getName();
            User user = authService.getCurrentUser(email);
            Lecturer lecturer = lecturerService.getLecturerByUser(user);
            
            List<Map<String, Object>> coursesWithStats = lecturerService.getCoursesWithStats(lecturer);
            return ResponseEntity.ok(coursesWithStats);
        } catch (Exception e) {
            e.printStackTrace(); // Add logging to see the error
            Map<String, String> response = new HashMap<>();
            response.put("message", "Error retrieving courses: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    // Get specific course details
    @GetMapping("/courses/{courseId}")
    public ResponseEntity<Course> getCourseById(
            @PathVariable Long courseId,
            Authentication authentication) {
        try {
            String email = authentication.getName();
            User user = authService.getCurrentUser(email);
            Lecturer lecturer = lecturerService.getLecturerByUser(user);
            
            // Verify lecturer has access to this course
            if (!courseService.isLecturerAssignedToCourse(lecturer, courseId)) {
                return ResponseEntity.status(403).build();
            }
            
            Course course = courseService.getCourseById(courseId);
            return ResponseEntity.ok(course);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Register to course
    @PostMapping("/courses/{courseId}/register")
    public ResponseEntity<String> registerToCourse(
            @PathVariable Long courseId,
            Authentication authentication) {
        try {
            String email = authentication.getName();
            User user = authService.getCurrentUser(email);
            Lecturer lecturer = lecturerService.getLecturerByUser(user);
            
            // Register lecturer to the course
            courseService.registerLecturerToCourse(courseId, lecturer.getId());
            
            return ResponseEntity.ok("Successfully registered to course");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to register to course: " + e.getMessage());
        }
    }

    // Unregister from course
    @DeleteMapping("/courses/{courseId}/unregister")
    public ResponseEntity<String> unregisterFromCourse(
            @PathVariable Long courseId,
            Authentication authentication) {
        try {
            String email = authentication.getName();
            User user = authService.getCurrentUser(email);
            Lecturer lecturer = lecturerService.getLecturerByUser(user);
            
            // Unregister lecturer from the course
            courseService.unregisterLecturerFromCourse(courseId, lecturer.getId());
            
            return ResponseEntity.ok("Successfully unregistered from course");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to unregister from course: " + e.getMessage());
        }
    }

    // Get enrolled students for a course
    @GetMapping("/courses/{courseId}/students")
    public ResponseEntity<List<Map<String, Object>>> getEnrolledStudents(
            @PathVariable Long courseId,
            Authentication authentication) {
        try {
            String email = authentication.getName();
            User user = authService.getCurrentUser(email);
            Lecturer lecturer = lecturerService.getLecturerByUser(user);
            
            // Verify lecturer has access to this course
            if (!courseService.isLecturerAssignedToCourse(lecturer, courseId)) {
                return ResponseEntity.status(403).build();
            }
            
            List<Map<String, Object>> students = lecturerService.getEnrolledStudents(courseId);
            return ResponseEntity.ok(students);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Course materials
    @GetMapping("/courses/{courseId}/materials")
    public ResponseEntity<List<Map<String, Object>>> getCourseMaterials(
            @PathVariable Long courseId,
            Authentication authentication) {
        try {
            String email = authentication.getName();
            User user = authService.getCurrentUser(email);
            Lecturer lecturer = lecturerService.getLecturerByUser(user);
            
            // Verify lecturer has access to this course
            if (!courseService.isLecturerAssignedToCourse(lecturer, courseId)) {
                return ResponseEntity.status(403).build();
            }
            
            // Return materials for this course (from lecturer service)
            List<Map<String, Object>> materials = lecturerService.getCourseMaterials(courseId);
            System.out.println("Returning " + materials.size() + " materials for course " + courseId);
            return ResponseEntity.ok(materials);
            
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/courses/{courseId}/materials")
    public ResponseEntity<String> uploadCourseMaterial(
            @PathVariable Long courseId,
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam("file") MultipartFile file,
            Authentication authentication) {
        try {
            String email = authentication.getName();
            User user = authService.getCurrentUser(email);
            Lecturer lecturer = lecturerService.getLecturerByUser(user);
            
            // Verify lecturer has access to this course
            if (!courseService.isLecturerAssignedToCourse(lecturer, courseId)) {
                return ResponseEntity.status(403).body("Access denied");
            }
            
            // Validate file
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body("File is required");
            }
            
            // Store material using lecturer service
            lecturerService.uploadCourseMaterial(courseId, title, description, file);
            
            System.out.println("Material stored successfully for course: " + courseId);
            
            return ResponseEntity.ok("Material uploaded successfully");
            
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Failed to upload material: " + e.getMessage());
        }
    }

    @PutMapping("/courses/{courseId}/materials/{materialId}")
    public ResponseEntity<String> updateCourseMaterial(
            @PathVariable Long courseId,
            @PathVariable Long materialId,
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            Authentication authentication) {
        try {
            String email = authentication.getName();
            User user = authService.getCurrentUser(email);
            Lecturer lecturer = lecturerService.getLecturerByUser(user);
            
            // Verify lecturer has access to this course
            if (!courseService.isLecturerAssignedToCourse(lecturer, courseId)) {
                return ResponseEntity.status(403).body("Access denied");
            }
            
            // Update material using lecturer service
            lecturerService.updateCourseMaterial(courseId, materialId, title, description);
            
            System.out.println("Material updated successfully:");
            System.out.println("Course ID: " + courseId);
            System.out.println("Material ID: " + materialId);
            
            return ResponseEntity.ok("Material updated successfully");
            
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Failed to update material: " + e.getMessage());
        }
    }

    @DeleteMapping("/courses/{courseId}/materials/{materialId}")
    public ResponseEntity<String> deleteCourseMaterial(
            @PathVariable Long courseId,
            @PathVariable Long materialId,
            Authentication authentication) {
        try {
            String email = authentication.getName();
            User user = authService.getCurrentUser(email);
            Lecturer lecturer = lecturerService.getLecturerByUser(user);
            
            // Verify lecturer has access to this course
            if (!courseService.isLecturerAssignedToCourse(lecturer, courseId)) {
                return ResponseEntity.status(403).body("Access denied");
            }
            
            // Delete material using lecturer service
            lecturerService.deleteCourseMaterial(courseId, materialId);
            
            System.out.println("Material deleted successfully:");
            System.out.println("Course ID: " + courseId);
            System.out.println("Material ID: " + materialId);
            
            return ResponseEntity.ok("Material deleted successfully");
            
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Failed to delete material: " + e.getMessage());
        }
    }

    // Download course material - accessible by both lecturers and students
    @PreAuthorize("hasRole('LECTURER') or hasRole('STUDENT')")
    @GetMapping("/courses/{courseId}/materials/{materialId}/download")
    public ResponseEntity<byte[]> downloadCourseMaterial(
            @PathVariable Long courseId,
            @PathVariable Long materialId,
            Authentication authentication) {
        try {
            String email = authentication.getName();
            User user = authService.getCurrentUser(email);
            
            // Check if user has access to this course
            boolean hasAccess = false;
            
            if ("LECTURER".equals(user.getRole().name())) {
                Lecturer lecturer = lecturerService.getLecturerByUser(user);
                hasAccess = courseService.isLecturerAssignedToCourse(lecturer, courseId);
            } else if ("STUDENT".equals(user.getRole().name())) {
                Student student = studentService.getStudentByUser(user);
                hasAccess = studentService.isStudentEnrolledInCourse(student, courseId);
            }
            
            if (!hasAccess) {
                return ResponseEntity.status(403).build();
            }
            
            return lecturerService.downloadCourseMaterial(courseId, materialId);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Assignment Management
    @GetMapping("/courses/{courseId}/assignments")
    public ResponseEntity<List<Assignment>> getCourseAssignments(
            @PathVariable Long courseId,
            Authentication authentication) {
        try {
            String email = authentication.getName();
            User user = authService.getCurrentUser(email);
            Lecturer lecturer = lecturerService.getLecturerByUser(user);
            
            // Verify lecturer has access to this course
            if (!courseService.isLecturerAssignedToCourse(lecturer, courseId)) {
                return ResponseEntity.status(403).build();
            }
            
            List<Assignment> assignments = lecturerService.getCourseAssignments(courseId);
            return ResponseEntity.ok(assignments);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/assignments")
    public ResponseEntity<String> createAssignment(
            @RequestParam("courseId") Long courseId,
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam("maxPoints") Integer maxPoints,
            @RequestParam("dueDate") String dueDate,
            @RequestParam(value = "file", required = false) MultipartFile file,
            Authentication authentication) {
        try {
            String email = authentication.getName();
            User user = authService.getCurrentUser(email);
            Lecturer lecturer = lecturerService.getLecturerByUser(user);
            
            // Verify lecturer has access to this course
            if (!courseService.isLecturerAssignedToCourse(lecturer, courseId)) {
                return ResponseEntity.status(403).body("Access denied");
            }
            
            Map<String, Object> assignmentData = new HashMap<>();
            assignmentData.put("courseId", courseId);
            assignmentData.put("title", title);
            assignmentData.put("description", description);
            assignmentData.put("maxPoints", maxPoints);
            assignmentData.put("dueDate", dueDate);
            
            lecturerService.createAssignment(assignmentData, file);
            return ResponseEntity.ok("Assignment created successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to create assignment: " + e.getMessage());
        }
    }

    @PutMapping("/assignments/{assignmentId}")
    public ResponseEntity<String> updateAssignment(
            @PathVariable Long assignmentId,
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam("maxPoints") Integer maxPoints,
            @RequestParam("dueDate") String dueDate,
            @RequestParam(value = "file", required = false) MultipartFile file,
            Authentication authentication) {
        try {
            String email = authentication.getName();
            User user = authService.getCurrentUser(email);
            Lecturer lecturer = lecturerService.getLecturerByUser(user);
            
            // Verify lecturer has access to this assignment via course
            Long courseId = lecturerService.getCourseIdByAssignmentId(assignmentId);
            if (!courseService.isLecturerAssignedToCourse(lecturer, courseId)) {
                return ResponseEntity.status(403).body("Access denied");
            }
            
            Map<String, Object> assignmentData = new HashMap<>();
            assignmentData.put("title", title);
            assignmentData.put("description", description);
            assignmentData.put("maxPoints", maxPoints);
            assignmentData.put("dueDate", dueDate);
            
            lecturerService.updateAssignment(assignmentId, assignmentData, file);
            return ResponseEntity.ok("Assignment updated successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to update assignment: " + e.getMessage());
        }
    }

    @DeleteMapping("/assignments/{assignmentId}")
    public ResponseEntity<String> deleteAssignment(
            @PathVariable Long assignmentId,
            Authentication authentication) {
        try {
            String email = authentication.getName();
            User user = authService.getCurrentUser(email);
            Lecturer lecturer = lecturerService.getLecturerByUser(user);
            
            // Verify lecturer has access to this assignment via course
            Long courseId = lecturerService.getCourseIdByAssignmentId(assignmentId);
            if (!courseService.isLecturerAssignedToCourse(lecturer, courseId)) {
                return ResponseEntity.status(403).body("Access denied");
            }
            
            lecturerService.deleteAssignment(assignmentId);
            return ResponseEntity.ok("Assignment deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to delete assignment: " + e.getMessage());
        }
    }

    @PreAuthorize("hasRole('LECTURER')")
    @GetMapping("/assignments/{assignmentId}/download")
    public ResponseEntity<byte[]> downloadAssignmentFile(
            @PathVariable Long assignmentId,
            Authentication authentication) {
        try {
            String email = authentication.getName();
            User user = authService.getCurrentUser(email);
            Lecturer lecturer = lecturerService.getLecturerByUser(user);
            
            // Verify lecturer has access to this assignment via course
            Long courseId = lecturerService.getCourseIdByAssignmentId(assignmentId);
            if (!courseService.isLecturerAssignedToCourse(lecturer, courseId)) {
                return ResponseEntity.status(403).build();
            }
            
            return lecturerService.downloadAssignmentFile(assignmentId);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Assignment submission management endpoints
    @GetMapping("/assignments/{assignmentId}/submissions")
    public ResponseEntity<List<Map<String, Object>>> getAssignmentSubmissions(
            @PathVariable Long assignmentId,
            Authentication authentication) {
        try {
            String email = authentication.getName();
            User user = authService.getCurrentUser(email);
            Lecturer lecturer = lecturerService.getLecturerByUser(user);
            
            // Verify lecturer has access to this assignment via course
            Long courseId = lecturerService.getCourseIdByAssignmentId(assignmentId);
            if (!courseService.isLecturerAssignedToCourse(lecturer, courseId)) {
                return ResponseEntity.status(403).build();
            }
            
            List<Map<String, Object>> submissions = lecturerService.getAssignmentSubmissions(assignmentId);
            return ResponseEntity.ok(submissions);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/courses/{courseId}/submissions")
    public ResponseEntity<List<Map<String, Object>>> getCourseSubmissions(
            @PathVariable Long courseId,
            Authentication authentication) {
        try {
            String email = authentication.getName();
            User user = authService.getCurrentUser(email);
            Lecturer lecturer = lecturerService.getLecturerByUser(user);
            
            // Verify lecturer has access to this course
            if (!courseService.isLecturerAssignedToCourse(lecturer, courseId)) {
                return ResponseEntity.status(403).build();
            }
            
            List<Map<String, Object>> submissions = lecturerService.getCourseSubmissions(courseId);
            return ResponseEntity.ok(submissions);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PreAuthorize("hasRole('LECTURER')")
    @GetMapping("/submissions/{submissionId}/download")
    public ResponseEntity<byte[]> downloadSubmissionFile(
            @PathVariable Long submissionId,
            Authentication authentication) {
        try {
            String email = authentication.getName();
            User user = authService.getCurrentUser(email);
            Lecturer lecturer = lecturerService.getLecturerByUser(user);
            
            // Verify lecturer has access to this submission via course
            Long courseId = lecturerService.getCourseIdBySubmissionId(submissionId);
            if (!courseService.isLecturerAssignedToCourse(lecturer, courseId)) {
                return ResponseEntity.status(403).build();
            }
            
            return lecturerService.downloadSubmissionFile(submissionId);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Grade management placeholder
    @PutMapping("/courses/{courseId}/students/{studentId}/grade")
    public ResponseEntity<String> updateStudentGrade(
            @PathVariable Long courseId,
            @PathVariable Long studentId,
            @RequestBody Map<String, Object> gradeData) {
        try {
            lecturerService.updateStudentGrade(courseId, studentId, gradeData);
            return ResponseEntity.ok("Grade updated successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error updating grade: " + e.getMessage());
        }
    }

    // Assignment submission grading endpoint
    @PutMapping("/submissions/{submissionId}/grade")
    public ResponseEntity<String> gradeSubmission(
            @PathVariable Long submissionId,
            @RequestBody Map<String, Object> gradeData,
            Authentication authentication) {
        try {
            String email = authentication.getName();
            User user = authService.getCurrentUser(email);
            Lecturer lecturer = lecturerService.getLecturerByUser(user);
            
            // Verify lecturer has access to this submission via course
            Long courseId = lecturerService.getCourseIdBySubmissionId(submissionId);
            if (!courseService.isLecturerAssignedToCourse(lecturer, courseId)) {
                return ResponseEntity.status(403).body("Access denied");
            }
            
            lecturerService.gradeSubmission(submissionId, gradeData);
            return ResponseEntity.ok("Submission graded successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error grading submission: " + e.getMessage());
        }
    }

    // Recent Activities
    @GetMapping("/recent-activities")
    @PreAuthorize("hasRole('LECTURER')")
    public ResponseEntity<?> getRecentActivities(Authentication authentication) {
        try {
            String email = authentication.getName();
            User user = authService.getCurrentUser(email);
            Lecturer lecturer = lecturerService.getLecturerByUser(user);
            
            List<Map<String, Object>> activities = lecturerService.getRecentActivities(lecturer);
            return ResponseEntity.ok(activities);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Failed to load recent activities: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    // Profile Management
    @GetMapping("/profile")
    @PreAuthorize("hasRole('LECTURER')")
    public ResponseEntity<?> getProfile(Authentication authentication) {
        try {
            String email = authentication.getName();
            User user = authService.getCurrentUser(email);
            Lecturer lecturer = lecturerService.getLecturerByUser(user);
            
            Map<String, Object> profile = lecturerService.getProfile(lecturer);
            return ResponseEntity.ok(profile);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Failed to load profile: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PutMapping("/profile")
    @PreAuthorize("hasRole('LECTURER')")
    public ResponseEntity<?> updateProfile(
            @RequestBody Map<String, Object> profileData,
            Authentication authentication) {
        try {
            String email = authentication.getName();
            User user = authService.getCurrentUser(email);
            Lecturer lecturer = lecturerService.getLecturerByUser(user);
            
            lecturerService.updateProfile(lecturer, profileData);
            return ResponseEntity.ok("Profile updated successfully");
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Failed to update profile: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PutMapping("/change-password")
    @PreAuthorize("hasRole('LECTURER')")
    public ResponseEntity<?> changePassword(
            @RequestBody Map<String, String> passwordData,
            Authentication authentication) {
        try {
            String email = authentication.getName();
            User user = authService.getCurrentUser(email);
            
            lecturerService.changePassword(user, passwordData);
            return ResponseEntity.ok("Password changed successfully");
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Failed to change password: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
}
