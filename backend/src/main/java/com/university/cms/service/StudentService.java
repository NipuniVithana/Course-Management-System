package com.university.cms.service;

import com.university.cms.entity.*;
import com.university.cms.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class StudentService {

    @Autowired
    private StudentRepository studentRepository;
    
    @Autowired
    private EnrollmentRepository enrollmentRepository;
    
    @Autowired
    private CourseRepository courseRepository;
    
    @Autowired
    private LecturerService lecturerService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UserRepository userRepository;

    public Student getStudentByUser(User user) {
        return studentRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Student not found"));
    }

    @Transactional
    public Map<String, Object> enrollInCourse(Student student, Long courseId) {
        // Check if course exists
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        // Check if already enrolled
        Optional<Enrollment> existingEnrollment = enrollmentRepository
                .findByStudentIdAndCourseId(student.getId(), courseId);
        if (existingEnrollment.isPresent()) {
            throw new RuntimeException("Already enrolled in this course");
        }

        // Check course capacity
        long enrolledCount = enrollmentRepository.countEnrolledByCourseId(courseId);
        if (enrolledCount >= course.getCapacity()) {
            throw new RuntimeException("Course is full");
        }

        // Create enrollment
        Enrollment enrollment = new Enrollment(student, course);
        enrollment.setEnrollmentDate(LocalDateTime.now());
        enrollment.setStatus(Enrollment.Status.ENROLLED);
        
        enrollmentRepository.save(enrollment);

        Map<String, Object> result = new HashMap<>();
        result.put("message", "Successfully enrolled in course");
        result.put("courseCode", course.getCourseCode());
        result.put("courseTitle", course.getTitle());
        result.put("enrollmentDate", enrollment.getEnrollmentDate());
        return result;
    }

    public List<Map<String, Object>> getStudentEnrollments(Student student) {
        return enrollmentRepository.findByStudentId(student.getId()).stream()
                .map(enrollment -> {
                    Map<String, Object> enrollmentData = new HashMap<>();
                    Course course = enrollment.getCourse();
                    
                    enrollmentData.put("id", enrollment.getId());
                    enrollmentData.put("enrollmentDate", enrollment.getEnrollmentDate());
                    enrollmentData.put("status", enrollment.getStatus());
                    enrollmentData.put("finalGrade", enrollment.getFinalGrade());
                    
                    // Course information
                    enrollmentData.put("courseId", course.getId());
                    enrollmentData.put("courseCode", course.getCourseCode());
                    enrollmentData.put("title", course.getTitle());
                    enrollmentData.put("credits", course.getCredits());
                    enrollmentData.put("department", course.getDepartment());
                    
                    // Lecturer information
                    if (course.getLecturer() != null) {
                        enrollmentData.put("lecturerName", 
                            course.getLecturer().getFirstName() + " " + course.getLecturer().getLastName());
                    }
                    
                    return enrollmentData;
                })
                .collect(Collectors.toList());
    }

    @Transactional
    public void dropCourse(Student student, Long courseId) {
        Enrollment enrollment = enrollmentRepository
                .findByStudentIdAndCourseId(student.getId(), courseId)
                .orElseThrow(() -> new RuntimeException("Enrollment not found"));
        
        enrollment.setStatus(Enrollment.Status.DROPPED);
        enrollmentRepository.save(enrollment);
    }

    // Get course by ID for student
    public Map<String, Object> getCourseById(Student student, Long courseId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));
        
        // Check if student is enrolled
        boolean isEnrolled = enrollmentRepository.findByStudentIdAndCourseId(student.getId(), courseId).isPresent();
        if (!isEnrolled) {
            throw new RuntimeException("You are not enrolled in this course");
        }
        
        Map<String, Object> courseData = new HashMap<>();
        courseData.put("id", course.getId());
        courseData.put("courseCode", course.getCourseCode());
        courseData.put("title", course.getTitle());
        courseData.put("description", course.getDescription());
        courseData.put("credits", course.getCredits());
        courseData.put("department", course.getDepartment());
        courseData.put("capacity", course.getCapacity());
        courseData.put("status", course.getStatus());
        
        if (course.getLecturer() != null) {
            courseData.put("lecturerName", 
                course.getLecturer().getFirstName() + " " + course.getLecturer().getLastName());
        }
        
        return courseData;
    }

    // Get course materials for student
    public List<Map<String, Object>> getCourseMaterials(Student student, Long courseId) {
        // Check if student is enrolled
        boolean isEnrolled = enrollmentRepository.findByStudentIdAndCourseId(student.getId(), courseId).isPresent();
        if (!isEnrolled) {
            throw new RuntimeException("You are not enrolled in this course");
        }
        
        // Get materials from lecturer service
        return lecturerService.getCourseMaterials(courseId);
    }

    // Get enrolled students in a course (for student to see classmates)
    public List<Map<String, Object>> getCourseStudents(Student student, Long courseId) {
        // Check if student is enrolled
        boolean isEnrolled = enrollmentRepository.findByStudentIdAndCourseId(student.getId(), courseId).isPresent();
        if (!isEnrolled) {
            throw new RuntimeException("You are not enrolled in this course");
        }
        
        return enrollmentRepository.findByCourseId(courseId).stream()
                .filter(enrollment -> enrollment.getStatus() == Enrollment.Status.ENROLLED)
                .map(enrollment -> {
                    Student enrolledStudent = enrollment.getStudent();
                    Map<String, Object> studentData = new HashMap<>();
                    studentData.put("id", enrolledStudent.getId());
                    studentData.put("studentId", enrolledStudent.getStudentId());
                    studentData.put("firstName", enrolledStudent.getFirstName());
                    studentData.put("lastName", enrolledStudent.getLastName());
                    studentData.put("email", enrolledStudent.getUser().getEmail());
                    return studentData;
                })
                .collect(Collectors.toList());
    }

    // Get student's grade for a specific course
    public Map<String, Object> getStudentGrade(Student student, Long courseId) {
        Enrollment enrollment = enrollmentRepository.findByStudentIdAndCourseId(student.getId(), courseId)
                .orElseThrow(() -> new RuntimeException("You are not enrolled in this course"));
        
        if (enrollment.getFinalGrade() == null) {
            return null; // No grade assigned yet
        }
        
        Map<String, Object> gradeData = new HashMap<>();
        // Try to parse grade as number, otherwise keep as string
        try {
            gradeData.put("grade", Double.parseDouble(enrollment.getFinalGrade()));
        } catch (NumberFormatException e) {
            gradeData.put("grade", enrollment.getFinalGrade());
        }
        gradeData.put("feedback", enrollment.getFeedback());
        gradeData.put("gradedDate", enrollment.getGradedDate());
        return gradeData;
    }

    // Get student profile
    public Map<String, Object> getStudentProfile(Student student) {
        Map<String, Object> profileData = new HashMap<>();
        
        // Student information
        profileData.put("id", student.getId());
        profileData.put("studentId", student.getStudentId());
        profileData.put("firstName", student.getFirstName());
        profileData.put("lastName", student.getLastName());
        profileData.put("email", student.getUser().getEmail());
        profileData.put("phone", student.getPhone());
        profileData.put("address", student.getAddress());
        profileData.put("program", student.getProgram());
        profileData.put("yearOfStudy", student.getYearOfStudy());
        profileData.put("gpa", student.getGpa());
        profileData.put("createdAt", student.getCreatedAt());
        
        return profileData;
    }

    // Update student profile
    public void updateStudentProfile(Student student, Map<String, Object> profileData) {
        // Update student fields
        if (profileData.containsKey("firstName")) {
            student.setFirstName(profileData.get("firstName").toString());
        }
        if (profileData.containsKey("lastName")) {
            student.setLastName(profileData.get("lastName").toString());
        }
        if (profileData.containsKey("phone")) {
            student.setPhone(profileData.get("phone").toString());
        }
        if (profileData.containsKey("address")) {
            student.setAddress(profileData.get("address").toString());
        }
        if (profileData.containsKey("program")) {
            student.setProgram(profileData.get("program").toString());
        }
        if (profileData.containsKey("yearOfStudy")) {
            student.setYearOfStudy(Integer.valueOf(profileData.get("yearOfStudy").toString()));
        }
        
        // Save the updated student
        studentRepository.save(student);
        
        // Update user email if provided
        if (profileData.containsKey("email")) {
            User user = student.getUser();
            user.setEmail(profileData.get("email").toString());
            userRepository.save(user);
        }
    }

    @Transactional
    public void changeStudentPassword(Student student, String currentPassword, String newPassword) {
        User user = student.getUser();
        
        // Verify current password
        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            throw new RuntimeException("Current password is incorrect");
        }
        
        // Update to new password
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }
}
