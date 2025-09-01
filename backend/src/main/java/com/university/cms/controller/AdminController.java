package com.university.cms.controller;

import com.university.cms.service.AdminService;
import com.university.cms.service.AuthService;
import com.university.cms.service.CourseService;
import com.university.cms.service.StudentService;
import com.university.cms.service.LecturerService;
import com.university.cms.service.DegreeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:3000")
public class AdminController {

    @Autowired
    private AdminService adminService;
    
    @Autowired
    private AuthService authService;
    
    @Autowired
    private CourseService courseService;
    
    @Autowired
    private StudentService studentService;
    
    @Autowired
    private LecturerService lecturerService;
    
    @Autowired
    private DegreeService degreeService;

    // Dashboard stats
    @GetMapping("/dashboard/stats")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        try {
            Map<String, Object> stats = new HashMap<>();
            
            // Get counts from each service
            long totalStudents = studentService.getTotalStudentCount();
            long totalLecturers = lecturerService.getTotalLecturerCount();
            long totalCourses = courseService.getTotalCourseCount();
            long totalDegrees = degreeService.getTotalDegreeCount();
            
            stats.put("totalStudents", totalStudents);
            stats.put("totalLecturers", totalLecturers);
            stats.put("totalCourses", totalCourses);
            stats.put("totalDegrees", totalDegrees);
            
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
