package com.university.cms.controller;

import com.university.cms.entity.Course;
import com.university.cms.entity.Lecturer;
import com.university.cms.entity.User;
import com.university.cms.service.CourseService;
import com.university.cms.service.LecturerService;
import com.university.cms.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.ArrayList;
import java.util.concurrent.ConcurrentHashMap;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/lecturer")
@CrossOrigin(origins = "http://localhost:3000")
public class LecturerController {

    // Simple in-memory storage for materials (in production, use database)
    private final Map<Long, List<Map<String, Object>>> courseMaterials = new ConcurrentHashMap<>();

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
    public ResponseEntity<List<Course>> getMyCourses(Authentication authentication) {
        try {
            String email = authentication.getName();
            User user = authService.getCurrentUser(email);
            Lecturer lecturer = lecturerService.getLecturerByUser(user);
            
            List<Course> courses = courseService.getCoursesByLecturer(lecturer);
            return ResponseEntity.ok(courses);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
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
            courseService.assignLecturerToCourse(courseId, lecturer.getId());
            
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
            
            // Return materials for this course (from in-memory storage)
            List<Map<String, Object>> materials = courseMaterials.getOrDefault(courseId, new ArrayList<>());
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
            
            // Create material record
            Map<String, Object> material = new HashMap<>();
            material.put("id", System.currentTimeMillis()); // Simple ID generation
            material.put("title", title);
            material.put("description", description);
            material.put("fileName", file.getOriginalFilename());
            material.put("fileSize", file.getSize());
            material.put("uploadDate", LocalDateTime.now().toString());
            material.put("lecturerName", lecturer.getFirstName() + " " + lecturer.getLastName());
            
            // Store in memory (in production, save to database and file system)
            courseMaterials.computeIfAbsent(courseId, k -> new ArrayList<>()).add(material);
            
            System.out.println("Material stored successfully:");
            System.out.println("Course ID: " + courseId);
            System.out.println("Material: " + material);
            
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
            
            // Find and update material in memory storage
            List<Map<String, Object>> materials = courseMaterials.get(courseId);
            if (materials != null) {
                for (Map<String, Object> material : materials) {
                    if (material.get("id").equals(materialId)) {
                        material.put("title", title);
                        material.put("description", description);
                        material.put("updatedDate", LocalDateTime.now().toString());
                        
                        System.out.println("Material updated successfully:");
                        System.out.println("Course ID: " + courseId);
                        System.out.println("Material ID: " + materialId);
                        System.out.println("Updated Material: " + material);
                        
                        return ResponseEntity.ok("Material updated successfully");
                    }
                }
            }
            
            return ResponseEntity.notFound().build();
            
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
            
            // Find and remove material from memory storage
            List<Map<String, Object>> materials = courseMaterials.get(courseId);
            if (materials != null) {
                boolean removed = materials.removeIf(material -> material.get("id").equals(materialId));
                if (removed) {
                    System.out.println("Material deleted successfully:");
                    System.out.println("Course ID: " + courseId);
                    System.out.println("Material ID: " + materialId);
                    
                    return ResponseEntity.ok("Material deleted successfully");
                }
            }
            
            return ResponseEntity.notFound().build();
            
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
        // Placeholder for grade update - can be implemented later
        return ResponseEntity.ok("Grade update feature coming soon");
    }
}
