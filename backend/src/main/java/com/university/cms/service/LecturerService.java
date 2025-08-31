package com.university.cms.service;

import com.university.cms.entity.Lecturer;
import com.university.cms.entity.User;
import com.university.cms.entity.Enrollment;
import com.university.cms.repository.LecturerRepository;
import com.university.cms.repository.EnrollmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.concurrent.ConcurrentHashMap;
import java.util.ArrayList;
import java.time.LocalDateTime;
import java.util.stream.Collectors;

@Service
@Transactional
public class LecturerService {

    @Autowired
    private LecturerRepository lecturerRepository;
    
    @Autowired
    private EnrollmentRepository enrollmentRepository;
    
    // Simple in-memory storage for materials (in production, use database)
    private final Map<Long, List<Map<String, Object>>> courseMaterials = new ConcurrentHashMap<>();

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
        return courseMaterials.getOrDefault(courseId, new ArrayList<>());
    }
    
    public void uploadCourseMaterial(Long courseId, String title, String description, String fileName, long fileSize) {
        Map<String, Object> material = new HashMap<>();
        material.put("id", System.currentTimeMillis()); // Simple ID generation
        material.put("title", title);
        material.put("description", description);
        material.put("fileName", fileName);
        material.put("fileSize", fileSize);
        material.put("uploadDate", LocalDateTime.now().toString());
        
        courseMaterials.computeIfAbsent(courseId, k -> new ArrayList<>()).add(material);
    }
    
    public void updateCourseMaterial(Long courseId, Long materialId, String title, String description) {
        List<Map<String, Object>> materials = courseMaterials.get(courseId);
        if (materials != null) {
            for (Map<String, Object> material : materials) {
                if (material.get("id").equals(materialId)) {
                    material.put("title", title);
                    material.put("description", description);
                    break;
                }
            }
        }
    }
    
    public void deleteCourseMaterial(Long courseId, Long materialId) {
        List<Map<String, Object>> materials = courseMaterials.get(courseId);
        if (materials != null) {
            materials.removeIf(material -> material.get("id").equals(materialId));
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
}
