package com.university.cms.service;

import com.university.cms.dto.CourseRequest;
import com.university.cms.entity.Course;
import com.university.cms.entity.Lecturer;
import com.university.cms.repository.CourseRepository;
import com.university.cms.repository.LecturerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
public class CourseService {

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private LecturerRepository lecturerRepository;

    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }

    public Course getCourseById(Long id) {
        return courseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Course not found with id: " + id));
    }

    public Course createCourse(CourseRequest courseRequest) {
        // Check if lecturer exists
        Lecturer lecturer = lecturerRepository.findById(courseRequest.getLecturerId())
                .orElseThrow(() -> new RuntimeException("Lecturer not found with id: " + courseRequest.getLecturerId()));

        // Check if course code already exists
        if (courseRepository.findByCourseCode(courseRequest.getCourseCode()).isPresent()) {
            throw new RuntimeException("Course with code " + courseRequest.getCourseCode() + " already exists");
        }

        Course course = new Course();
        course.setCourseCode(courseRequest.getCourseCode());
        course.setTitle(courseRequest.getCourseName());
        course.setDescription(courseRequest.getDescription());
        course.setCredits(courseRequest.getCredits());
        course.setLecturer(lecturer);
        course.setUpdatedAt(LocalDateTime.now());

        return courseRepository.save(course);
    }

    public Course updateCourse(Long id, CourseRequest courseRequest) {
        Course course = getCourseById(id);

        // Check if lecturer exists if lecturer is being changed
        if (!course.getLecturer().getId().equals(courseRequest.getLecturerId())) {
            Lecturer lecturer = lecturerRepository.findById(courseRequest.getLecturerId())
                    .orElseThrow(() -> new RuntimeException("Lecturer not found with id: " + courseRequest.getLecturerId()));
            course.setLecturer(lecturer);
        }

        course.setCourseCode(courseRequest.getCourseCode());
        course.setTitle(courseRequest.getCourseName());
        course.setDescription(courseRequest.getDescription());
        course.setCredits(courseRequest.getCredits());
        course.setUpdatedAt(LocalDateTime.now());

        return courseRepository.save(course);
    }

    public void deleteCourse(Long id) {
        Course course = getCourseById(id);
        courseRepository.delete(course);
    }

    public List<Course> getCoursesByLecturer(Long lecturerId) {
        return courseRepository.findByLecturerId(lecturerId);
    }
}
