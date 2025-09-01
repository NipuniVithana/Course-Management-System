package com.university.cms.service;

import com.university.cms.entity.Lecturer;
import com.university.cms.entity.User;
import com.university.cms.entity.Course;
import com.university.cms.entity.Enrollment;
import com.university.cms.repository.LecturerRepository;
import com.university.cms.repository.CourseRepository;
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
            courseData.put("capacity", course.getCapacity());
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
            
            // Activity 1: Recent Course Registrations
            for (Course course : courses) {
                List<Enrollment> recentEnrollments = enrollmentRepository
                    .findByCourseIdOrderByEnrollmentDateDesc(course.getId());
                
                for (Enrollment enrollment : recentEnrollments.stream().limit(3).collect(Collectors.toList())) {
                    Map<String, Object> activity = new HashMap<>();
                    activity.put("id", "enrollment-" + enrollment.getId());
                    activity.put("type", "enrollment");
                    activity.put("title", "New Student Enrollment");
                    activity.put("description", "Student enrolled in " + course.getTitle());
                    activity.put("time", getTimeAgo(enrollment.getEnrollmentDate()));
                    activity.put("icon", "user-add");
                    activity.put("color", "#52c41a");
                    activities.add(activity);
                }
            }
            
            // Activity 2: Recent Grade Updates
            for (Course course : courses) {
                List<Enrollment> recentlyGraded = enrollmentRepository
                    .findByCourseIdAndFinalGradeIsNotNullOrderByGradedDateDesc(course.getId());
                
                for (Enrollment enrollment : recentlyGraded.stream().limit(3).collect(Collectors.toList())) {
                    Map<String, Object> activity = new HashMap<>();
                    activity.put("id", "grade-" + enrollment.getId());
                    activity.put("type", "grading");
                    activity.put("title", "Grade Updated");
                    activity.put("description", "Updated grade for " + course.getTitle());
                    activity.put("time", getTimeAgo(enrollment.getGradedDate()));
                    activity.put("icon", "check-circle");
                    activity.put("color", "#1890ff");
                    activities.add(activity);
                }
            }
            
            // Activity 3: Course Assignments (when lecturer registers for courses)
            for (Course course : courses) {
                Map<String, Object> activity = new HashMap<>();
                activity.put("id", "course-" + course.getId());
                activity.put("type", "course");
                activity.put("title", "Course Assignment");
                activity.put("description", "Assigned to teach " + course.getTitle());
                activity.put("time", getTimeAgo(course.getCreatedAt()));
                activity.put("icon", "book");
                activity.put("color", "#722ed1");
                activities.add(activity);
            }
            
            // Sort by most recent and limit to 5
            activities.sort((a, b) -> {
                // Sort by timestamp (most recent first)
                return b.get("time").toString().compareTo(a.get("time").toString());
            });
            
            return activities.stream().limit(5).collect(Collectors.toList());
            
        } catch (Exception e) {
            e.printStackTrace();
            return new ArrayList<>(); // Return empty list on error
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
}
