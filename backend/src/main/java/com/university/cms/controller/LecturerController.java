package com.university.cms.controller;

import com.university.cms.entity.Course;
import com.university.cms.entity.Lecturer;
import com.university.cms.entity.User;
import com.university.cms.service.CourseService;
import com.university.cms.service.LecturerService;
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
            lecturerService.uploadCourseMaterial(courseId, title, description, 
                file.getOriginalFilename(), file.getSize());
            
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
}
