package com.university.cms.controller;

import com.university.cms.dto.CourseDto;
import com.university.cms.entity.Course;
import com.university.cms.entity.User;
import com.university.cms.entity.Student;
import com.university.cms.service.CourseService;
import com.university.cms.service.AuthService;
import com.university.cms.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3001", maxAge = 3600)
public class CourseController {

    @Autowired
    private CourseService courseService;
    
    @Autowired
    private AuthService authService;
    
    @Autowired
    private StudentService studentService;

    // Admin endpoints
    @GetMapping("/admin/courses")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Course>> getAllCourses() {
        List<Course> courses = courseService.getAllCourses();
        return ResponseEntity.ok(courses);
    }

    @PostMapping("/admin/courses")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createCourse(@Valid @RequestBody CourseDto courseRequest) {
        try {
            Course course = courseService.createCourse(courseRequest);
            return ResponseEntity.ok(course);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PutMapping("/admin/courses/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateCourse(@PathVariable Long id, @Valid @RequestBody CourseDto courseRequest) {
        try {
            Course course = courseService.updateCourse(id, courseRequest);
            return ResponseEntity.ok(course);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @DeleteMapping("/admin/courses/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteCourse(@PathVariable Long id) {
        try {
            courseService.deleteCourse(id);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Course deleted successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    // Admin lecturer management endpoints
    @GetMapping("/admin/lecturers")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAllLecturers() {
        try {
            List<Map<String, Object>> lecturers = courseService.getAllLecturers();
            return ResponseEntity.ok(lecturers);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/admin/students")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAllStudents() {
        try {
            List<Map<String, Object>> students = courseService.getAllStudents();
            return ResponseEntity.ok(students);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PutMapping("/admin/students/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateStudent(@PathVariable Long id, @RequestBody Map<String, Object> studentData) {
        try {
            Map<String, Object> updatedStudent = courseService.updateStudent(id, studentData);
            return ResponseEntity.ok(updatedStudent);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PutMapping("/admin/students/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateStudentStatus(@PathVariable Long id, @RequestBody Map<String, Object> statusData) {
        try {
            Boolean active = (Boolean) statusData.get("active");
            Map<String, Object> updatedStudent = courseService.updateStudentStatus(id, active);
            return ResponseEntity.ok(updatedStudent);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    // Student endpoints
    @GetMapping("/student/courses")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<List<Map<String, Object>>> getAvailableCourses(Authentication authentication) {
        try {
            String email = authentication.getName();
            User user = authService.getCurrentUser(email);
            Student student = studentService.getStudentByUser(user);
            
            List<Map<String, Object>> courses = courseService.getAvailableCoursesForStudent(student);
            return ResponseEntity.ok(courses);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/admin/lecturers/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateLecturer(@PathVariable Long id, @RequestBody Map<String, Object> lecturerData) {
        try {
            Map<String, Object> updatedLecturer = courseService.updateLecturer(id, lecturerData);
            return ResponseEntity.ok(updatedLecturer);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PutMapping("/admin/lecturers/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateLecturerStatus(@PathVariable Long id, @RequestBody Map<String, Object> statusData) {
        try {
            Boolean active = (Boolean) statusData.get("active");
            Map<String, Object> updatedLecturer = courseService.updateLecturerStatus(id, active);
            return ResponseEntity.ok(updatedLecturer);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PutMapping("/admin/courses/{id}/assign")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> assignLecturerToCourse(@PathVariable Long id, @RequestBody Map<String, Long> request) {
        try {
            Long lecturerId = request.get("lecturerId");
            Course course = courseService.assignLecturerToCourse(id, lecturerId);
            return ResponseEntity.ok(course);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    // Test endpoint - remove after debugging
    @GetMapping("/test/courses")
    public ResponseEntity<List<Course>> getCoursesTest() {
        System.out.println("DEBUG: Test endpoint /test/courses called");
        try {
            List<Course> courses = courseService.getAllCourses();
            System.out.println("DEBUG: Test endpoint - courses retrieved: " + courses.size());
            return ResponseEntity.ok(courses);
        } catch (Exception e) {
            System.out.println("DEBUG: Test endpoint error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(new ArrayList<>());
        }
    }
}
