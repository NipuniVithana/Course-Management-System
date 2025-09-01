package com.university.cms.service;

import com.university.cms.dto.CourseDto;
import com.university.cms.entity.Course;
import com.university.cms.entity.Degree;
import com.university.cms.entity.Lecturer;
import com.university.cms.entity.Student;
import com.university.cms.entity.User;
import com.university.cms.repository.CourseRepository;
import com.university.cms.repository.EnrollmentRepository;
import com.university.cms.repository.LecturerRepository;
import com.university.cms.repository.StudentRepository;
import com.university.cms.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Transactional
public class CourseService {

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private EnrollmentRepository enrollmentRepository;

    @Autowired
    private LecturerRepository lecturerRepository;
    
    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DegreeService degreeService;

    public List<Course> getAllCourses() {
        List<Course> courses = courseRepository.findAll();
        System.out.println("DEBUG: getAllCourses returning " + courses.size() + " courses");
        for (Course course : courses) {
            System.out.println("DEBUG: Course - ID: " + course.getId() + 
                ", Title: " + course.getTitle() + 
                ", Code: " + course.getCourseCode() + 
                ", Credits: " + course.getCredits() +
                ", Lecturer: " + (course.getLecturer() != null ? 
                    course.getLecturer().getFirstName() + " " + course.getLecturer().getLastName() : "None"));
        }
        return courses;
    }

    // Admin-specific method to get courses with all related data
    public List<Map<String, Object>> getAllCoursesForAdmin() {
        List<Course> courses = courseRepository.findAll();
        return courses.stream()
                .map(course -> {
                    Map<String, Object> courseData = new HashMap<>();
                    courseData.put("id", course.getId());
                    courseData.put("courseCode", course.getCourseCode());
                    courseData.put("title", course.getTitle());
                    courseData.put("description", course.getDescription());
                    courseData.put("credits", course.getCredits());
                    courseData.put("department", course.getDepartment());
                    courseData.put("status", course.getStatus());
                    courseData.put("createdAt", course.getCreatedAt());
                    courseData.put("updatedAt", course.getUpdatedAt());
                    
                    // Add degree information
                    if (course.getDegree() != null) {
                        Map<String, Object> degreeData = new HashMap<>();
                        degreeData.put("id", course.getDegree().getId());
                        degreeData.put("name", course.getDegree().getName());
                        degreeData.put("department", course.getDegree().getDepartment());
                        courseData.put("degree", degreeData);
                    } else {
                        courseData.put("degree", null);
                    }
                    
                    // Add lecturer information
                    if (course.getLecturer() != null) {
                        courseData.put("lecturerId", course.getLecturer().getId());
                        courseData.put("lecturerName", 
                            course.getLecturer().getFirstName() + " " + course.getLecturer().getLastName());
                        courseData.put("lecturerFirstName", course.getLecturer().getFirstName());
                        courseData.put("lecturerLastName", course.getLecturer().getLastName());
                    } else {
                        courseData.put("lecturerId", null);
                        courseData.put("lecturerName", null);
                        courseData.put("lecturerFirstName", null);
                        courseData.put("lecturerLastName", null);
                    }
                    
                    // Add enrollment count
                    long enrollmentCount = enrollmentRepository.countEnrolledByCourseId(course.getId());
                    courseData.put("enrollmentCount", enrollmentCount);
                    
                    return courseData;
                })
                .collect(Collectors.toList());
    }

    public Course getCourseById(Long id) {
        return courseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Course not found with id: " + id));
    }

    public Course createCourse(CourseDto courseRequest) {
        // Check if course code already exists
        if (courseRepository.findByCourseCode(courseRequest.getCourseCode()).isPresent()) {
            throw new RuntimeException("Course with code " + courseRequest.getCourseCode() + " already exists");
        }

        Course course = new Course();
        course.setCourseCode(courseRequest.getCourseCode());
        course.setTitle(courseRequest.getCourseName());
        course.setDescription(courseRequest.getDescription());
        course.setCredits(courseRequest.getCredits());
        
        // Set degree using degreeId
        if (courseRequest.getDegreeId() != null) {
            Degree degree = degreeService.getDegreeById(courseRequest.getDegreeId())
                    .orElseThrow(() -> new RuntimeException("Degree not found with id: " + courseRequest.getDegreeId()));
            course.setDegree(degree);
        }
        
        course.setDepartment(courseRequest.getDepartment());
        
        course.setUpdatedAt(LocalDateTime.now());
        return courseRepository.save(course);
    }

    public Course updateCourse(Long id, CourseDto courseRequest) {
        Course course = getCourseById(id);

        course.setCourseCode(courseRequest.getCourseCode());
        course.setTitle(courseRequest.getCourseName());
        course.setDescription(courseRequest.getDescription());
        course.setCredits(courseRequest.getCredits());
        course.setUpdatedAt(LocalDateTime.now());

        return courseRepository.save(course);
    }

    public void deleteCourse(Long id) {
        Course course = getCourseById(id);
        courseRepository.delete(course);
    }

    // Admin methods for lecturer management
    public List<Map<String, Object>> getAllLecturers() {
        List<Lecturer> lecturers = lecturerRepository.findAll();
        return lecturers.stream().map(lecturer -> {
            Map<String, Object> lecturerMap = new HashMap<>();
            lecturerMap.put("id", lecturer.getId());
            lecturerMap.put("firstName", lecturer.getFirstName());
            lecturerMap.put("lastName", lecturer.getLastName());
            lecturerMap.put("email", lecturer.getUser().getEmail());
            lecturerMap.put("phoneNumber", lecturer.getPhone());
            lecturerMap.put("department", lecturer.getDepartment());
            lecturerMap.put("officeLocation", lecturer.getOfficeLocation());
            lecturerMap.put("employeeId", lecturer.getEmployeeId());
            lecturerMap.put("active", lecturer.getUser().getStatus() == User.Status.ACTIVE);
            return lecturerMap;
        }).collect(Collectors.toList());
    }

    public Map<String, Object> updateLecturer(Long id, Map<String, Object> lecturerData) {
        try {
            Lecturer lecturer = lecturerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Lecturer not found with id: " + id));
            
            // Update lecturer information
            lecturer.setFirstName((String) lecturerData.get("firstName"));
            lecturer.setLastName((String) lecturerData.get("lastName"));
            lecturer.setDepartment((String) lecturerData.get("department"));
            lecturer.setPhone((String) lecturerData.get("phoneNumber"));
            lecturer.setOfficeLocation((String) lecturerData.get("officeLocation"));
            lecturer.setUpdatedAt(LocalDateTime.now());
            
            // Update user email if provided
            if (lecturerData.get("email") != null) {
                String newEmail = (String) lecturerData.get("email");
                if (!lecturer.getUser().getEmail().equals(newEmail)) {
                    // Check if new email already exists
                    if (userRepository.findByEmail(newEmail).isPresent()) {
                        throw new RuntimeException("Email already exists: " + newEmail);
                    }
                    lecturer.getUser().setEmail(newEmail);
                    lecturer.getUser().setUpdatedAt(LocalDateTime.now());
                }
            }
            
            Lecturer savedLecturer = lecturerRepository.save(lecturer);
            
            // Return updated lecturer data
            Map<String, Object> result = new HashMap<>();
            result.put("id", savedLecturer.getId());
            result.put("firstName", savedLecturer.getFirstName());
            result.put("lastName", savedLecturer.getLastName());
            result.put("email", savedLecturer.getUser().getEmail());
            result.put("phoneNumber", savedLecturer.getPhone());
            result.put("department", savedLecturer.getDepartment());
            result.put("officeLocation", savedLecturer.getOfficeLocation());
            result.put("employeeId", savedLecturer.getEmployeeId());
            result.put("active", savedLecturer.getUser().getStatus() == User.Status.ACTIVE);
            
            return result;
        } catch (Exception e) {
            throw new RuntimeException("Failed to update lecturer: " + e.getMessage());
        }
    }

    public Map<String, Object> updateLecturerStatus(Long id, Boolean active) {
        try {
            Lecturer lecturer = lecturerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Lecturer not found with id: " + id));
            
            // Update user status
            lecturer.getUser().setStatus(active ? User.Status.ACTIVE : User.Status.INACTIVE);
            lecturer.getUser().setUpdatedAt(LocalDateTime.now());
            lecturer.setUpdatedAt(LocalDateTime.now());
            
            Lecturer savedLecturer = lecturerRepository.save(lecturer);
            
            // Return updated lecturer data
            Map<String, Object> result = new HashMap<>();
            result.put("id", savedLecturer.getId());
            result.put("firstName", savedLecturer.getFirstName());
            result.put("lastName", savedLecturer.getLastName());
            result.put("email", savedLecturer.getUser().getEmail());
            result.put("phoneNumber", savedLecturer.getPhone());
            result.put("department", savedLecturer.getDepartment());
            result.put("officeLocation", savedLecturer.getOfficeLocation());
            result.put("employeeId", savedLecturer.getEmployeeId());
            result.put("active", savedLecturer.getUser().getStatus() == User.Status.ACTIVE);
            
            return result;
        } catch (Exception e) {
            throw new RuntimeException("Failed to update lecturer status: " + e.getMessage());
        }
    }

    public Map<String, Object> updateStudent(Long id, Map<String, Object> studentData) {
        try {
            Student student = studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found with id: " + id));
            
            // Update student information
            student.setFirstName((String) studentData.get("firstName"));
            student.setLastName((String) studentData.get("lastName"));
            student.setPhone((String) studentData.get("phoneNumber"));
            student.setStudentId((String) studentData.get("studentId"));
            student.setProgram((String) studentData.get("program"));
            student.setAddress((String) studentData.get("address"));
            
            if (studentData.get("yearOfStudy") != null) {
                student.setYearOfStudy(Integer.valueOf(studentData.get("yearOfStudy").toString()));
            }
            
            student.setUpdatedAt(LocalDateTime.now());
            
            // Update user email if provided
            if (studentData.get("email") != null) {
                String newEmail = (String) studentData.get("email");
                if (!student.getUser().getEmail().equals(newEmail)) {
                    // Check if new email already exists
                    if (userRepository.findByEmail(newEmail).isPresent()) {
                        throw new RuntimeException("Email already exists: " + newEmail);
                    }
                    student.getUser().setEmail(newEmail);
                    student.getUser().setUpdatedAt(LocalDateTime.now());
                }
            }
            
            Student savedStudent = studentRepository.save(student);
            
            // Return updated student data
            Map<String, Object> result = new HashMap<>();
            result.put("id", savedStudent.getId());
            result.put("firstName", savedStudent.getFirstName());
            result.put("lastName", savedStudent.getLastName());
            result.put("email", savedStudent.getUser().getEmail());
            result.put("phoneNumber", savedStudent.getPhone());
            result.put("studentId", savedStudent.getStudentId());
            result.put("program", savedStudent.getProgram());
            result.put("address", savedStudent.getAddress());
            result.put("yearOfStudy", savedStudent.getYearOfStudy());
            result.put("active", savedStudent.getUser().getStatus() == User.Status.ACTIVE);
            
            return result;
        } catch (Exception e) {
            throw new RuntimeException("Failed to update student: " + e.getMessage());
        }
    }

    public Map<String, Object> updateStudentStatus(Long id, Boolean active) {
        try {
            Student student = studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found with id: " + id));
            
            // Update user status
            student.getUser().setStatus(active ? User.Status.ACTIVE : User.Status.INACTIVE);
            student.getUser().setUpdatedAt(LocalDateTime.now());
            student.setUpdatedAt(LocalDateTime.now());
            
            Student savedStudent = studentRepository.save(student);
            
            // Return updated student data
            Map<String, Object> result = new HashMap<>();
            result.put("id", savedStudent.getId());
            result.put("firstName", savedStudent.getFirstName());
            result.put("lastName", savedStudent.getLastName());
            result.put("email", savedStudent.getUser().getEmail());
            result.put("phoneNumber", savedStudent.getPhone());
            result.put("studentId", savedStudent.getStudentId());
            result.put("program", savedStudent.getProgram());
            result.put("address", savedStudent.getAddress());
            result.put("yearOfStudy", savedStudent.getYearOfStudy());
            result.put("active", savedStudent.getUser().getStatus() == User.Status.ACTIVE);
            
            return result;
        } catch (Exception e) {
            throw new RuntimeException("Failed to update student status: " + e.getMessage());
        }
    }

    public List<Map<String, Object>> getAllStudents() {
        List<Student> students = studentRepository.findAll();
        return students.stream().map(student -> {
            Map<String, Object> studentMap = new HashMap<>();
            studentMap.put("id", student.getId());
            studentMap.put("firstName", student.getFirstName());
            studentMap.put("lastName", student.getLastName());
            studentMap.put("email", student.getUser().getEmail());
            studentMap.put("phoneNumber", student.getPhone());
            studentMap.put("studentId", student.getStudentId());
            studentMap.put("yearOfStudy", student.getYearOfStudy());
            studentMap.put("major", student.getProgram());
            studentMap.put("active", student.getUser().getStatus() == User.Status.ACTIVE);
            return studentMap;
        }).collect(Collectors.toList());
    }

    public Map<String, Object> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalCourses", courseRepository.count());
        stats.put("totalLecturers", lecturerRepository.count());
        stats.put("totalStudents", studentRepository.count());
        stats.put("totalDegrees", degreeService.getAllDegrees().size());
        return stats;
    }

    public Course registerLecturerToCourse(Long courseId, Long lecturerId) {
        Course course = getCourseById(courseId);
        
        if (lecturerId != null) {
            Lecturer lecturer = lecturerRepository.findById(lecturerId)
                .orElseThrow(() -> new RuntimeException("Lecturer not found with id: " + lecturerId));
            course.setLecturer(lecturer);
        } else {
            // Remove lecturer assignment
            course.setLecturer(null);
        }
        
        course.setUpdatedAt(LocalDateTime.now());
        return courseRepository.save(course);
    }

    public Course unregisterLecturerFromCourse(Long courseId, Long lecturerId) {
        Course course = getCourseById(courseId);
        
        // Verify that the lecturer is currently assigned to this course
        if (course.getLecturer() == null || !course.getLecturer().getId().equals(lecturerId)) {
            throw new RuntimeException("Lecturer is not assigned to this course");
        }
        
        // Remove lecturer assignment
        course.setLecturer(null);
        course.setUpdatedAt(LocalDateTime.now());
        return courseRepository.save(course);
    }

    // Lecturer-specific methods
    public List<Map<String, Object>> getAvailableCoursesForLecturer(Lecturer lecturer) {
        List<Course> allCourses = courseRepository.findAll();
        return allCourses.stream()
                .map(course -> {
                    Map<String, Object> courseData = new HashMap<>();
                    courseData.put("id", course.getId());
                    courseData.put("courseCode", course.getCourseCode());
                    courseData.put("title", course.getTitle());
                    courseData.put("department", course.getDepartment());
                    courseData.put("credits", course.getCredits());
                    courseData.put("status", course.getStatus());
                    courseData.put("description", course.getDescription());
                    
                    // Add degree information
                    if (course.getDegree() != null) {
                        courseData.put("degreeName", course.getDegree().getName());
                        courseData.put("degreeId", course.getDegree().getId());
                    } else {
                        courseData.put("degreeName", null);
                        courseData.put("degreeId", null);
                    }
                    
                    // Add lecturer information
                    if (course.getLecturer() != null) {
                        courseData.put("lecturerName", course.getLecturer().getFirstName() + " " + course.getLecturer().getLastName());
                        courseData.put("lecturerId", course.getLecturer().getId());
                        courseData.put("isRegistered", course.getLecturer().getId().equals(lecturer.getId()));
                    } else {
                        courseData.put("lecturerName", null);
                        courseData.put("lecturerId", null);
                        courseData.put("isRegistered", false);
                    }
                    
                    return courseData;
                })
                .collect(Collectors.toList());
    }

    // Student-specific methods
    public List<Map<String, Object>> getAvailableCoursesForStudent(Student student) {
        List<Course> allCourses = courseRepository.findAll();
        return allCourses.stream()
                .map(course -> {
                    Map<String, Object> courseData = new HashMap<>();
                    courseData.put("id", course.getId());
                    courseData.put("courseCode", course.getCourseCode());
                    courseData.put("title", course.getTitle());
                    courseData.put("department", course.getDepartment());
                    courseData.put("credits", course.getCredits());
                    courseData.put("status", course.getStatus());
                    courseData.put("description", course.getDescription());
                    
                    // Add degree information
                    if (course.getDegree() != null) {
                        courseData.put("degreeName", course.getDegree().getName());
                        courseData.put("degreeId", course.getDegree().getId());
                    } else {
                        courseData.put("degreeName", null);
                        courseData.put("degreeId", null);
                    }
                    
                    // Add lecturer information
                    if (course.getLecturer() != null) {
                        courseData.put("lecturerName", course.getLecturer().getFirstName() + " " + course.getLecturer().getLastName());
                        courseData.put("lecturerId", course.getLecturer().getId());
                    } else {
                        courseData.put("lecturerName", null);
                        courseData.put("lecturerId", null);
                    }
                    
                    // Add enrollment information
                    boolean isEnrolled = enrollmentRepository
                            .findByStudentIdAndCourseId(student.getId(), course.getId())
                            .isPresent();
                    courseData.put("isEnrolled", isEnrolled);
                    
                    // Add enrolled count
                    long enrolledCount = enrollmentRepository.countEnrolledByCourseId(course.getId());
                    courseData.put("enrolledCount", enrolledCount);
                    
                    return courseData;
                })
                .collect(Collectors.toList());
    }

    public List<Course> getCoursesByLecturer(Lecturer lecturer) {
        return courseRepository.findByLecturer(lecturer);
    }

    public boolean isLecturerAssignedToCourse(Lecturer lecturer, Long courseId) {
        Course course = getCourseById(courseId);
        return course.getLecturer() != null && course.getLecturer().getId().equals(lecturer.getId());
    }
    
    public long getTotalCourseCount() {
        return courseRepository.count();
    }
}
