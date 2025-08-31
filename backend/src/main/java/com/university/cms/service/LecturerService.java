package com.university.cms.service;

import com.university.cms.entity.Lecturer;
import com.university.cms.entity.User;
import com.university.cms.repository.LecturerRepository;
import com.university.cms.repository.EnrollmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.stream.Collectors;

@Service
@Transactional
public class LecturerService {

    @Autowired
    private LecturerRepository lecturerRepository;
    
    @Autowired
    private EnrollmentRepository enrollmentRepository;

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

    public Lecturer getLecturerById(Long id) {
        return lecturerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Lecturer not found"));
    }
}
