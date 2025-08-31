package com.university.cms.controller;

import com.university.cms.entity.User;
import com.university.cms.entity.Student;
import com.university.cms.service.AuthService;
import com.university.cms.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/student")
public class StudentController {

    @Autowired
    private StudentService studentService;
    
    @Autowired
    private AuthService authService;

    // Enrollment endpoints
    @PostMapping("/enrollments")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<?> enrollInCourse(
            @RequestBody Map<String, Object> enrollmentData,
            Authentication authentication) {
        try {
            String email = authentication.getName();
            User user = authService.getCurrentUser(email);
            Student student = studentService.getStudentByUser(user);
            
            Long courseId = Long.valueOf(enrollmentData.get("courseId").toString());
            
            Map<String, Object> result = studentService.enrollInCourse(student, courseId);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/enrollments")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<?> getMyEnrollments(Authentication authentication) {
        try {
            String email = authentication.getName();
            User user = authService.getCurrentUser(email);
            Student student = studentService.getStudentByUser(user);
            
            return ResponseEntity.ok(studentService.getStudentEnrollments(student));
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @DeleteMapping("/enrollments/{courseId}")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<?> dropCourse(
            @PathVariable Long courseId,
            Authentication authentication) {
        try {
            String email = authentication.getName();
            User user = authService.getCurrentUser(email);
            Student student = studentService.getStudentByUser(user);
            
            studentService.dropCourse(student, courseId);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Successfully dropped from course");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/courses/{courseId}")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<?> getCourseById(
            @PathVariable Long courseId,
            Authentication authentication) {
        try {
            String email = authentication.getName();
            User user = authService.getCurrentUser(email);
            Student student = studentService.getStudentByUser(user);
            
            return ResponseEntity.ok(studentService.getCourseById(student, courseId));
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/courses/{courseId}/materials")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<?> getCourseMaterials(
            @PathVariable Long courseId,
            Authentication authentication) {
        try {
            String email = authentication.getName();
            User user = authService.getCurrentUser(email);
            Student student = studentService.getStudentByUser(user);
            
            return ResponseEntity.ok(studentService.getCourseMaterials(student, courseId));
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/courses/{courseId}/students")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<?> getCourseStudents(
            @PathVariable Long courseId,
            Authentication authentication) {
        try {
            String email = authentication.getName();
            User user = authService.getCurrentUser(email);
            Student student = studentService.getStudentByUser(user);
            
            return ResponseEntity.ok(studentService.getCourseStudents(student, courseId));
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/courses/{courseId}/grades")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<?> getCourseGrades(
            @PathVariable Long courseId,
            Authentication authentication) {
        try {
            String email = authentication.getName();
            User user = authService.getCurrentUser(email);
            Student student = studentService.getStudentByUser(user);
            
            return ResponseEntity.ok(studentService.getStudentGrade(student, courseId));
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    // Profile endpoints
    @GetMapping("/profile")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<?> getProfile(Authentication authentication) {
        try {
            String email = authentication.getName();
            User user = authService.getCurrentUser(email);
            Student student = studentService.getStudentByUser(user);
            
            return ResponseEntity.ok(studentService.getStudentProfile(student));
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PutMapping("/profile")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<?> updateProfile(
            @RequestBody Map<String, Object> profileData,
            Authentication authentication) {
        try {
            String email = authentication.getName();
            User user = authService.getCurrentUser(email);
            Student student = studentService.getStudentByUser(user);
            
            studentService.updateStudentProfile(student, profileData);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Profile updated successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PutMapping("/profile/password")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<?> changePassword(
            @RequestBody Map<String, String> passwordData,
            Authentication authentication) {
        try {
            String email = authentication.getName();
            User user = authService.getCurrentUser(email);
            Student student = studentService.getStudentByUser(user);
            
            String currentPassword = passwordData.get("currentPassword");
            String newPassword = passwordData.get("newPassword");
            
            studentService.changeStudentPassword(student, currentPassword, newPassword);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Password changed successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
}
