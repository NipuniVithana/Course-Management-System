package com.university.cms.service;

import com.university.cms.entity.Degree;
import com.university.cms.repository.DegreeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DegreeService {

    @Autowired
    private DegreeRepository degreeRepository;

    public List<Degree> getAllDegrees() {
        return degreeRepository.findAll();
    }

    public Optional<Degree> getDegreeById(Long id) {
        return degreeRepository.findById(id);
    }

    public Degree saveDegree(Degree degree) {
        return degreeRepository.save(degree);
    }

    public void deleteDegree(Long id) {
        degreeRepository.deleteById(id);
    }

    public Optional<Degree> findByName(String name) {
        return degreeRepository.findByName(name);
    }

    public List<Degree> findByDepartment(String department) {
        return degreeRepository.findByDepartment(department);
    }
    
    public long getTotalDegreeCount() {
        return degreeRepository.count();
    }
}
