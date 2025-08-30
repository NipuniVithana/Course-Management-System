package com.university.cms.service;

import com.university.cms.entity.Admin;
import com.university.cms.entity.Course;
import com.university.cms.entity.Degree;
import com.university.cms.entity.Lecturer;
import com.university.cms.entity.Student;
import com.university.cms.entity.User;
import com.university.cms.repository.AdminRepository;
import com.university.cms.repository.CourseRepository;
import com.university.cms.repository.DegreeRepository;
import com.university.cms.repository.LecturerRepository;
import com.university.cms.repository.StudentRepository;
import com.university.cms.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class DataInitializationService implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private LecturerRepository lecturerRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private DegreeRepository degreeRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        initializeUsers();
        initializeDegrees();
        initializeCourses();
    }

    private void initializeUsers() {
        // Create admin user if not exists
        if (userRepository.findByEmail("admin@university.edu").isEmpty()) {
            User adminUser = new User();
            adminUser.setFirstName("System");
            adminUser.setLastName("Administrator");
            adminUser.setEmail("admin@university.edu");
            adminUser.setPassword(passwordEncoder.encode("admin123"));
            adminUser.setRole(User.Role.ADMIN);
            adminUser.setCreatedAt(LocalDateTime.now());
            adminUser.setUpdatedAt(LocalDateTime.now());
            User savedAdminUser = userRepository.save(adminUser);

            Admin admin = new Admin();
            admin.setUser(savedAdminUser);
            admin.setFirstName("System");
            admin.setLastName("Administrator");
            admin.setCreatedAt(LocalDateTime.now());
            admin.setUpdatedAt(LocalDateTime.now());
            adminRepository.save(admin);

            System.out.println("Demo admin created: admin@university.edu / admin123");
        }

        // Create lecturer user if not exists
        if (userRepository.findByEmail("lecturer@university.edu").isEmpty()) {
            User lecturerUser = new User();
            lecturerUser.setFirstName("John");
            lecturerUser.setLastName("Smith");
            lecturerUser.setEmail("lecturer@university.edu");
            lecturerUser.setPassword(passwordEncoder.encode("lecturer123"));
            lecturerUser.setRole(User.Role.LECTURER);
            lecturerUser.setCreatedAt(LocalDateTime.now());
            lecturerUser.setUpdatedAt(LocalDateTime.now());
            User savedLecturerUser = userRepository.save(lecturerUser);

            Lecturer lecturer = new Lecturer();
            lecturer.setUser(savedLecturerUser);
            lecturer.setFirstName("John");
            lecturer.setLastName("Smith");
            lecturer.setEmployeeId("LEC001");
            lecturer.setDepartment("Computer Science");
            lecturer.setCreatedAt(LocalDateTime.now());
            lecturer.setUpdatedAt(LocalDateTime.now());
            lecturerRepository.save(lecturer);

            System.out.println("Demo lecturer created: lecturer@university.edu / lecturer123");
        }

        // Create student user if not exists
        if (userRepository.findByEmail("student@university.edu").isEmpty()) {
            User studentUser = new User();
            studentUser.setFirstName("Jane");
            studentUser.setLastName("Doe");
            studentUser.setEmail("student@university.edu");
            studentUser.setPassword(passwordEncoder.encode("student123"));
            studentUser.setRole(User.Role.STUDENT);
            studentUser.setCreatedAt(LocalDateTime.now());
            studentUser.setUpdatedAt(LocalDateTime.now());
            User savedStudentUser = userRepository.save(studentUser);

            Student student = new Student();
            student.setUser(savedStudentUser);
            student.setFirstName("Jane");
            student.setLastName("Doe");
            student.setStudentId("STU001");
            student.setProgram("Computer Science");
            student.setCreatedAt(LocalDateTime.now());
            student.setUpdatedAt(LocalDateTime.now());
            studentRepository.save(student);

            System.out.println("Demo student created: student@university.edu / student123");
        }
    }

    private void initializeDegrees() {
        // Create default degrees if not exists
        if (degreeRepository.findByName("Bachelor of Science in Computer Science").isEmpty()) {
            Degree degree = new Degree();
            degree.setName("Bachelor of Science in Computer Science");
            degree.setDepartment("Computer Science");
            degree.setFaculty("Faculty of Engineering");
            degree.setDuration(4);
            degree.setDescription("Four-year undergraduate program in Computer Science covering programming, algorithms, data structures, and software engineering.");
            degreeRepository.save(degree);
            System.out.println("Default degree created: Bachelor of Science in Computer Science");
        }

        if (degreeRepository.findByName("Master of Science in Computer Science").isEmpty()) {
            Degree degree = new Degree();
            degree.setName("Master of Science in Computer Science");
            degree.setDepartment("Computer Science");
            degree.setFaculty("Faculty of Engineering");
            degree.setDuration(2);
            degree.setDescription("Two-year graduate program in Computer Science with focus on advanced topics and research.");
            degreeRepository.save(degree);
            System.out.println("Default degree created: Master of Science in Computer Science");
        }

        if (degreeRepository.findByName("Bachelor of Arts in Mathematics").isEmpty()) {
            Degree degree = new Degree();
            degree.setName("Bachelor of Arts in Mathematics");
            degree.setDepartment("Mathematics");
            degree.setFaculty("Faculty of Science");
            degree.setDuration(4);
            degree.setDescription("Four-year undergraduate program in Mathematics covering calculus, algebra, statistics, and mathematical analysis.");
            degreeRepository.save(degree);
            System.out.println("Default degree created: Bachelor of Arts in Mathematics");
        }
    }

    private void initializeCourses() {
        // Get the default degree
        Degree csDegree = degreeRepository.findByName("Bachelor of Science in Computer Science")
                .orElseThrow(() -> new RuntimeException("CS Degree not found"));

        // Create default courses if not exists
        if (courseRepository.findByCourseCode("CS101").isEmpty()) {
            Course course = new Course();
            course.setCourseCode("CS101");
            course.setTitle("Introduction to Computer Science");
            course.setDescription("Basic concepts of computer science and programming.");
            course.setCredits(3);
            course.setDegree(csDegree);
            course.setDepartment("Computer Science");
            course.setCreatedAt(LocalDateTime.now());
            course.setUpdatedAt(LocalDateTime.now());
            courseRepository.save(course);

            System.out.println("Default course created: CS101 - Introduction to Computer Science");
        }

        if (courseRepository.findByCourseCode("CS102").isEmpty()) {
            Course course = new Course();
            course.setCourseCode("CS102");
            course.setTitle("Data Structures");
            course.setDescription("Introduction to data structures and algorithms.");
            course.setCredits(3);
            course.setDegree(csDegree);
            course.setDepartment("Computer Science");
            course.setCreatedAt(LocalDateTime.now());
            course.setUpdatedAt(LocalDateTime.now());
            courseRepository.save(course);

            System.out.println("Default course created: CS102 - Data Structures");
        }

        if (courseRepository.findByCourseCode("CS103").isEmpty()) {
            Course course = new Course();
            course.setCourseCode("CS103");
            course.setTitle("Database Systems");
            course.setDescription("Fundamentals of database systems and SQL.");
            course.setCredits(3);
            course.setDegree(csDegree);
            course.setDepartment("Computer Science");
            course.setCreatedAt(LocalDateTime.now());
            course.setUpdatedAt(LocalDateTime.now());
            courseRepository.save(course);

            System.out.println("Default course created: CS103 - Database Systems");
        }
    }
}
