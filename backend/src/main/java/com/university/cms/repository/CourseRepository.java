package com.university.cms.repository;

import com.university.cms.entity.Course;
import com.university.cms.entity.Lecturer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {
    boolean existsByCourseCode(String courseCode);
    Optional<Course> findByCourseCode(String courseCode);
    List<Course> findByLecturerId(Long lecturerId);
    List<Course> findByLecturer(Lecturer lecturer);
    List<Course> findByStatus(Course.Status status);
}
