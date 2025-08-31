package com.university.cms.repository;

import com.university.cms.entity.Student;
import com.university.cms.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {
    Student findByUserId(Long userId);
    Optional<Student> findByUser(User user);
    boolean existsByStudentId(String studentId);
}
