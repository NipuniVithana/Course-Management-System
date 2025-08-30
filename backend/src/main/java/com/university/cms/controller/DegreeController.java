package com.university.cms.controller;

import com.university.cms.entity.Degree;
import com.university.cms.service.DegreeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/degrees")
@CrossOrigin(origins = "http://localhost:3000")
public class DegreeController {

    @Autowired
    private DegreeService degreeService;

    @GetMapping
    public ResponseEntity<List<Degree>> getAllDegrees() {
        List<Degree> degrees = degreeService.getAllDegrees();
        return ResponseEntity.ok(degrees);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Degree> getDegreeById(@PathVariable Long id) {
        Optional<Degree> degree = degreeService.getDegreeById(id);
        return degree.map(ResponseEntity::ok)
                    .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Degree> createDegree(@RequestBody Degree degree) {
        Degree savedDegree = degreeService.saveDegree(degree);
        return ResponseEntity.ok(savedDegree);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Degree> updateDegree(@PathVariable Long id, @RequestBody Degree degree) {
        Optional<Degree> existingDegree = degreeService.getDegreeById(id);
        if (existingDegree.isPresent()) {
            degree.setId(id);
            Degree updatedDegree = degreeService.saveDegree(degree);
            return ResponseEntity.ok(updatedDegree);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDegree(@PathVariable Long id) {
        Optional<Degree> degree = degreeService.getDegreeById(id);
        if (degree.isPresent()) {
            degreeService.deleteDegree(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}
