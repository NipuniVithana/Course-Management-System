package com.university.cms.repository;

import com.university.cms.entity.Lecturer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LecturerRepository extends JpaRepository<Lecturer, Long> {
    Lecturer findByUserId(Long userId);
    boolean existsByEmployeeId(String employeeId);
}
