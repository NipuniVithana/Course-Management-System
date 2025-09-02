package com.university.cms.config;

import com.university.cms.entity.*;
import com.university.cms.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private AdminRepository adminRepository;
    
    @Autowired
    private DegreeRepository degreeRepository;
    
    @Autowired
    private LecturerRepository lecturerRepository;
    
    @Autowired
    private StudentRepository studentRepository;
    
    @Autowired
    private CourseRepository courseRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Only initialize data if database is empty
        if (userRepository.count() == 0) {
            System.out.println("Initializing database with sample data...");
            initializeData();
            System.out.println("Database initialization completed!");
        } else {
            System.out.println("Database already contains data. Skipping initialization.");
        }
    }

    private void initializeData() {
        // Create Degrees
        Degree computerScienceDegree = new Degree();
        computerScienceDegree.setName("Computer Science");
        computerScienceDegree.setDescription("Bachelor of Science in Computer Science - A comprehensive program covering software development, algorithms, and computer systems.");
        computerScienceDegree.setDuration(4);
        computerScienceDegree.setFaculty("Faculty of Engineering");
        computerScienceDegree.setDepartment("Computer Science");
        computerScienceDegree.setCreatedAt(LocalDateTime.now());
        computerScienceDegree.setUpdatedAt(LocalDateTime.now());
        degreeRepository.save(computerScienceDegree);

        Degree businessDegree = new Degree();
        businessDegree.setName("Business Administration");
        businessDegree.setDescription("Bachelor of Business Administration - Comprehensive business education covering management, finance, and marketing.");
        businessDegree.setDuration(4);
        businessDegree.setFaculty("Faculty of Business");
        businessDegree.setDepartment("Business Administration");
        businessDegree.setCreatedAt(LocalDateTime.now());
        businessDegree.setUpdatedAt(LocalDateTime.now());
        degreeRepository.save(businessDegree);

        // Create Admin User
        User adminUser = new User();
        adminUser.setEmail("admin@university.edu");
        adminUser.setPassword(passwordEncoder.encode("admin123"));
        adminUser.setFirstName("Admin");
        adminUser.setLastName("User");
        adminUser.setRole(User.Role.ADMIN);
        adminUser.setStatus(User.Status.ACTIVE);
        adminUser.setCreatedAt(LocalDateTime.now());
        adminUser.setUpdatedAt(LocalDateTime.now());
        userRepository.save(adminUser);

        // Create Admin Profile
        Admin admin = new Admin();
        admin.setUser(adminUser);
        admin.setFirstName("Admin");
        admin.setLastName("User");
        admin.setPhone("+1-555-000-0000");
        admin.setCreatedAt(LocalDateTime.now());
        admin.setUpdatedAt(LocalDateTime.now());
        adminRepository.save(admin);

        // Create Lecturer User
        User lecturerUser = new User();
        lecturerUser.setEmail("lecturer@university.edu");
        lecturerUser.setPassword(passwordEncoder.encode("lecturer123"));
        lecturerUser.setFirstName("John");
        lecturerUser.setLastName("Smith");
        lecturerUser.setRole(User.Role.LECTURER);
        lecturerUser.setStatus(User.Status.ACTIVE);
        lecturerUser.setCreatedAt(LocalDateTime.now());
        lecturerUser.setUpdatedAt(LocalDateTime.now());
        userRepository.save(lecturerUser);

        // Create Lecturer Profile
        Lecturer lecturer = new Lecturer();
        lecturer.setUser(lecturerUser);
        lecturer.setEmployeeId("EMP001");
        lecturer.setFirstName("John");
        lecturer.setLastName("Smith");
        lecturer.setDepartment("Computer Science");
        lecturer.setOfficeLocation("Room 301, Engineering Building");
        lecturer.setPhone("+1-234-567-8900");
        lecturer.setCreatedAt(LocalDateTime.now());
        lecturer.setUpdatedAt(LocalDateTime.now());
        lecturerRepository.save(lecturer);

        // Create Student User
        User studentUser = new User();
        studentUser.setEmail("student@university.edu");
        studentUser.setPassword(passwordEncoder.encode("student123"));
        studentUser.setFirstName("Jane");
        studentUser.setLastName("Doe");
        studentUser.setRole(User.Role.STUDENT);
        studentUser.setStatus(User.Status.ACTIVE);
        studentUser.setCreatedAt(LocalDateTime.now());
        studentUser.setUpdatedAt(LocalDateTime.now());
        userRepository.save(studentUser);

        // Create Student Profile
        Student student = new Student();
        student.setUser(studentUser);
        student.setStudentId("STU001");
        student.setFirstName("Jane");
        student.setLastName("Doe");
        student.setProgram("Computer Science");
        student.setYearOfStudy(2);
        student.setGpa(new BigDecimal("3.50"));
        student.setPhone("+1-098-765-4321");
        student.setAddress("123 Student Street, University City");
        student.setCreatedAt(LocalDateTime.now());
        student.setUpdatedAt(LocalDateTime.now());
        studentRepository.save(student);

        // Create Sample Courses
        Course javaCourse = new Course();
        javaCourse.setCourseCode("CS101");
        javaCourse.setTitle("Introduction to Java Programming");
        javaCourse.setDescription("Fundamentals of Java programming including object-oriented concepts, data structures, and basic algorithms.");
        javaCourse.setCredits(3);
        javaCourse.setDepartment("Computer Science");
        javaCourse.setLecturer(lecturer);
        javaCourse.setDegree(computerScienceDegree);
        javaCourse.setStatus(Course.Status.ACTIVE);
        javaCourse.setCreatedAt(LocalDateTime.now());
        javaCourse.setUpdatedAt(LocalDateTime.now());
        courseRepository.save(javaCourse);

        Course webDevCourse = new Course();
        webDevCourse.setCourseCode("CS201");
        webDevCourse.setTitle("Web Development");
        webDevCourse.setDescription("Modern web development using HTML, CSS, JavaScript, and popular frameworks like React.");
        webDevCourse.setCredits(3);
        webDevCourse.setDepartment("Computer Science");
        webDevCourse.setLecturer(lecturer);
        webDevCourse.setDegree(computerScienceDegree);
        webDevCourse.setStatus(Course.Status.ACTIVE);
        webDevCourse.setCreatedAt(LocalDateTime.now());
        webDevCourse.setUpdatedAt(LocalDateTime.now());
        courseRepository.save(webDevCourse);

        Course databaseCourse = new Course();
        databaseCourse.setCourseCode("CS301");
        databaseCourse.setTitle("Database Management Systems");
        databaseCourse.setDescription("Design and implementation of database systems, SQL, normalization, and database administration.");
        databaseCourse.setCredits(4);
        databaseCourse.setDepartment("Computer Science");
        databaseCourse.setLecturer(lecturer);
        databaseCourse.setDegree(computerScienceDegree);
        databaseCourse.setStatus(Course.Status.ACTIVE);
        databaseCourse.setCreatedAt(LocalDateTime.now());
        databaseCourse.setUpdatedAt(LocalDateTime.now());
        courseRepository.save(databaseCourse);
    }
}
