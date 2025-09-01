package com.university.cms.service;

import com.university.cms.entity.*;
import com.university.cms.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
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
    private AssignmentRepository assignmentRepository;
    
    @Autowired
    private AssignmentSubmissionRepository assignmentSubmissionRepository;
    
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
    
    public long getTotalStudentCount() {
        return studentRepository.count();
    }
    
    // Assignment-related methods for students
    public List<Assignment> getCourseAssignments(Long courseId) {
        return assignmentRepository.findByCourseId(courseId);
    }
    
    public boolean isStudentEnrolledInCourse(Student student, Long courseId) {
        return enrollmentRepository.findByStudentIdAndCourseId(student.getId(), courseId).isPresent();
    }
    
    public Long getCourseIdByAssignmentId(Long assignmentId) {
        Assignment assignment = assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new RuntimeException("Assignment not found"));
        return assignment.getCourse().getId();
    }
    
    public ResponseEntity<byte[]> downloadAssignmentFile(Long assignmentId) {
        try {
            Assignment assignment = assignmentRepository.findById(assignmentId)
                    .orElseThrow(() -> new RuntimeException("Assignment not found"));
            
            if (assignment.getFilePath() == null) {
                throw new RuntimeException("No file associated with this assignment");
            }
            
            Path filePath = Paths.get(assignment.getFilePath());
            if (!Files.exists(filePath)) {
                throw new RuntimeException("File not found on server");
            }
            
            byte[] fileContent = Files.readAllBytes(filePath);
            
            return ResponseEntity.ok()
                    .header("Content-Disposition", "attachment; filename=\"" + assignment.getFileName() + "\"")
                    .header("Content-Type", "application/octet-stream")
                    .body(fileContent);
                    
        } catch (Exception e) {
            throw new RuntimeException("Failed to download assignment file: " + e.getMessage());
        }
    }
    
    // Assignment submission methods
    @Transactional
    public void submitAssignment(Long assignmentId, Student student, String submissionText, MultipartFile file) {
        try {
            Assignment assignment = assignmentRepository.findById(assignmentId)
                    .orElseThrow(() -> new RuntimeException("Assignment not found"));
            
            // Check if student already submitted this assignment
            Optional<AssignmentSubmission> existingSubmission = 
                    assignmentSubmissionRepository.findByAssignmentIdAndStudentId(assignmentId, student.getId());
            
            AssignmentSubmission submission;
            if (existingSubmission.isPresent()) {
                // Update existing submission
                submission = existingSubmission.get();
                submission.setSubmissionText(submissionText);
                
                // Delete old file if exists and new file is provided
                if (file != null && !file.isEmpty() && submission.getFilePath() != null) {
                    try {
                        Files.deleteIfExists(Paths.get(submission.getFilePath()));
                    } catch (IOException e) {
                        System.err.println("Failed to delete old submission file: " + e.getMessage());
                    }
                }
            } else {
                // Create new submission
                submission = new AssignmentSubmission();
                submission.setAssignment(assignment);
                submission.setStudent(student);
                submission.setSubmissionText(submissionText);
            }
            
            // Handle file upload if present
            if (file != null && !file.isEmpty()) {
                String fileName = file.getOriginalFilename();
                String uploadDir = "uploads/submissions/";
                
                // Create directory if it doesn't exist
                Path uploadPath = Paths.get(uploadDir);
                if (!Files.exists(uploadPath)) {
                    Files.createDirectories(uploadPath);
                }
                
                // Generate unique filename
                String uniqueFileName = System.currentTimeMillis() + "_" + fileName;
                Path filePath = uploadPath.resolve(uniqueFileName);
                
                // Save file
                Files.copy(file.getInputStream(), filePath);
                
                // Set file information in submission
                submission.setFileName(fileName);
                submission.setFilePath(filePath.toString());
                submission.setFileSize(file.getSize());
            }
            
            assignmentSubmissionRepository.save(submission);
        } catch (Exception e) {
            throw new RuntimeException("Failed to submit assignment: " + e.getMessage());
        }
    }
    
    public Map<String, Object> getMySubmission(Long assignmentId, Student student) {
        Optional<AssignmentSubmission> submission = 
                assignmentSubmissionRepository.findByAssignmentIdAndStudentId(assignmentId, student.getId());
        
        if (submission.isPresent()) {
            AssignmentSubmission sub = submission.get();
            Map<String, Object> submissionData = new HashMap<>();
            submissionData.put("id", sub.getId());
            submissionData.put("submissionText", sub.getSubmissionText());
            submissionData.put("fileName", sub.getFileName());
            submissionData.put("fileSize", sub.getFileSize());
            submissionData.put("submittedAt", sub.getSubmittedAt().toString());
            submissionData.put("grade", sub.getGrade());
            submissionData.put("feedback", sub.getFeedback());
            submissionData.put("gradedAt", sub.getGradedAt() != null ? sub.getGradedAt().toString() : null);
            return submissionData;
        } else {
            return null; // No submission found
        }
    }
}
