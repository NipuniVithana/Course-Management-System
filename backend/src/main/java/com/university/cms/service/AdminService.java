package com.university.cms.service;

import com.university.cms.entity.Admin;
import com.university.cms.entity.User;
import com.university.cms.repository.AdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class AdminService {

    @Autowired
    private AdminRepository adminRepository;

    public Admin getAdminByUser(User user) {
        return adminRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Admin not found for user"));
    }

    public Admin getAdminById(Long id) {
        return adminRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Admin not found"));
    }
}
