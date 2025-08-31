package com.university.cms.repository;

import com.university.cms.entity.Admin;
import com.university.cms.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AdminRepository extends JpaRepository<Admin, Long> {
    Admin findByUserId(Long userId);
    Optional<Admin> findByUser(User user);
}
