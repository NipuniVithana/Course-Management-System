package com.university.cms.service;

import com.university.cms.dto.LoginRequest;
import com.university.cms.dto.LoginResponse;
import com.university.cms.dto.RegisterRequest;
import com.university.cms.entity.Admin;
import com.university.cms.entity.Lecturer;
import com.university.cms.entity.Student;
import com.university.cms.entity.User;
import com.university.cms.repository.AdminRepository;
import com.university.cms.repository.LecturerRepository;
import com.university.cms.repository.StudentRepository;
import com.university.cms.repository.UserRepository;
import com.university.cms.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
@Transactional
public class AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private LecturerRepository lecturerRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserDetailsServiceImpl userDetailsService;

    public LoginResponse login(LoginRequest loginRequest) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));
        } catch (BadCredentialsException e) {
            throw new RuntimeException("Invalid email or password", e);
        }

        final UserDetails userDetails = userDetailsService.loadUserByUsername(loginRequest.getEmail());
        final User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        final String jwt = jwtUtil.generateToken(userDetails.getUsername(), user.getRole().toString());

        return new LoginResponse(jwt, user.getEmail(), user.getRole().toString(), user.getFirstName(), user.getLastName(), user.getId());
    }

    public String register(RegisterRequest registerRequest) {
        // Check if user already exists
        Optional<User> existingUser = userRepository.findByEmail(registerRequest.getEmail());
        if (existingUser.isPresent()) {
            throw new RuntimeException("Email is already registered");
        }

        // Create base user
        User user = new User();
        user.setFirstName(registerRequest.getFirstName());
        user.setLastName(registerRequest.getLastName());
        user.setEmail(registerRequest.getEmail());
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        user.setRole(User.Role.valueOf(registerRequest.getRole()));
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());

        User savedUser = userRepository.save(user);

        // Create role-specific entity
        switch (registerRequest.getRole()) {
            case "ADMIN":
                Admin admin = new Admin();
                admin.setUser(savedUser);
                admin.setCreatedAt(LocalDateTime.now());
                admin.setUpdatedAt(LocalDateTime.now());
                adminRepository.save(admin);
                break;

            case "LECTURER":
                Lecturer lecturer = new Lecturer();
                lecturer.setUser(savedUser);
                lecturer.setFirstName(registerRequest.getFirstName());
                lecturer.setLastName(registerRequest.getLastName());
                lecturer.setEmployeeId(registerRequest.getLecturerId());
                lecturer.setDepartment(registerRequest.getDepartment());
                lecturer.setPhone(registerRequest.getPhone());
                lecturer.setOfficeLocation(registerRequest.getOfficeLocation());
                lecturer.setCreatedAt(LocalDateTime.now());
                lecturer.setUpdatedAt(LocalDateTime.now());
                lecturerRepository.save(lecturer);
                break;

            case "STUDENT":
                Student student = new Student();
                student.setUser(savedUser);
                student.setFirstName(registerRequest.getFirstName());
                student.setLastName(registerRequest.getLastName());
                student.setStudentId(registerRequest.getStudentId());
                student.setPhone(registerRequest.getPhone());
                student.setProgram(registerRequest.getProgram());
                student.setCreatedAt(LocalDateTime.now());
                student.setUpdatedAt(LocalDateTime.now());
                studentRepository.save(student);
                break;

            default:
                throw new RuntimeException("Invalid role: " + registerRequest.getRole());
        }

        return "User registered successfully";
    }

    public User getCurrentUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
