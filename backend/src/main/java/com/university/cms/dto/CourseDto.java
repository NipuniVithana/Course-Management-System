package com.university.cms.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public class CourseDto {
    
    @NotBlank(message = "Course code is required")
    private String courseCode;
    
    @NotBlank(message = "Course name is required")
    private String courseName;
    
    private String description;
    
    @NotNull(message = "Credits is required")
    @Positive(message = "Credits must be positive")
    private Integer credits;
    
    // Make lecturerId optional
    private Long lecturerId;
    
    @NotNull(message = "Degree ID is required")
    private Long degreeId;
    
    @NotBlank(message = "Department is required")  
    private String department;
    
    private Integer capacity;
    
    public CourseDto() {}
    
    public String getCourseCode() {
        return courseCode;
    }
    
    public void setCourseCode(String courseCode) {
        this.courseCode = courseCode;
    }
    
    public String getCourseName() {
        return courseName;
    }
    
    public void setCourseName(String courseName) {
        this.courseName = courseName;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public Integer getCredits() {
        return credits;
    }
    
    public void setCredits(Integer credits) {
        this.credits = credits;
    }
    
    public Long getLecturerId() {
        return lecturerId;
    }
    
    public void setLecturerId(Long lecturerId) {
        this.lecturerId = lecturerId;
    }
    
    public Long getDegreeId() {
        return degreeId;
    }
    
    public void setDegreeId(Long degreeId) {
        this.degreeId = degreeId;
    }
    
    public String getDepartment() {
        return department;
    }
    
    public void setDepartment(String department) {
        this.department = department;
    }
    
    public Integer getCapacity() {
        return capacity;
    }
    
    public void setCapacity(Integer capacity) {
        this.capacity = capacity;
    }
}
