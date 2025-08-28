# Course Management System - User Manual

## 📖 **Table of Contents**
1. [Introduction](#introduction)
2. [Getting Started](#getting-started)
3. [Admin Guide](#admin-guide)
4. [Lecturer Guide](#lecturer-guide)
5. [Student Guide](#student-guide)
6. [Common Features](#common-features)
7. [Troubleshooting](#troubleshooting)

---

## 🎯 **Introduction**

The Course Management System is a web-based application designed for universities to manage courses, students, lecturers, and assignments. The system supports three user roles with different access levels and functionalities.

### **User Roles**
- **Admin**: System administration and user management
- **Lecturer**: Course and assignment management
- **Student**: Course enrollment and assignment submission

### **Key Features**
- User authentication and role-based access
- Course creation and management
- Student enrollment system
- Assignment creation and submission
- Grading and feedback system
- User profile management

---

## 🚀 **Getting Started**

### **Accessing the System**

1. **Open your web browser**
2. **Navigate to**: http://localhost:3000 (or your deployment URL)
3. **You will see the login page**

### **Demo Accounts**

Use these accounts to explore the system:

| Role | Email | Password |
|------|-------|----------|
| **Admin** | admin@university.edu | admin123 |
| **Lecturer** | lecturer@university.edu | lecturer123 |
| **Student** | student@university.edu | student123 |

### **First Login**

1. **Enter your email and password**
2. **Click "Login" button**
3. **You will be redirected to your role-specific dashboard**

---

## 👨‍💼 **Admin Guide**

As an Admin, you have full system access and can manage all aspects of the course management system.

### **Admin Dashboard**

After logging in, you'll see:
- **System Statistics**: Overview of users, courses, and activities
- **Quick Actions**: Shortcuts to common tasks
- **Recent Activities**: Latest system activities

### **User Management**

#### **View All Users**
1. **Navigate to** "Users" from the sidebar
2. **View list** of all registered users
3. **Filter by role** (Admin, Lecturer, Student)
4. **Search users** by name or email

#### **Create New User**
1. **Click** "Add New User" button
2. **Fill in** user details:
   - First Name and Last Name
   - Email Address
   - Password
   - Role (Admin/Lecturer/Student)
   - Role-specific fields (Student ID, Lecturer ID, Department)
3. **Click** "Create User"

#### **Edit User**
1. **Click** "Edit" button next to user
2. **Modify** user information
3. **Click** "Save Changes"

#### **Delete User**
1. **Click** "Delete" button next to user
2. **Confirm** deletion in the popup
3. **User will be permanently removed**

### **Course Management**

#### **View All Courses**
1. **Navigate to** "Courses" from the sidebar
2. **View list** of all courses
3. **See course details**: Code, Name, Lecturer, Credits
4. **Filter by status** (Active, Inactive, Archived)

#### **Create New Course**
1. **Click** "Add New Course" button
2. **Fill in** course details:
   - Course Code (e.g., CS101)
   - Course Name
   - Description
   - Credits
   - Assign Lecturer
3. **Click** "Create Course"

#### **Edit Course**
1. **Click** "Edit" button next to course
2. **Modify** course information
3. **Change** assigned lecturer if needed
4. **Click** "Save Changes"

#### **Delete Course**
1. **Click** "Delete" button next to course
2. **Confirm** deletion in the popup
3. **Course and related data will be removed**

### **Enrollment Management**

#### **View Enrollments**
1. **Navigate to** "Enrollments"
2. **See all** student-course relationships
3. **Filter by** course or student
4. **View enrollment status**

#### **Manual Enrollment**
1. **Click** "Enroll Student" button
2. **Select** student from dropdown
3. **Select** course from dropdown
4. **Click** "Enroll"

#### **Remove Enrollment**
1. **Find** the enrollment record
2. **Click** "Remove" button
3. **Confirm** the action

### **Reports and Analytics**

#### **System Statistics**
- **Total Users** by role
- **Active Courses** count
- **Recent Enrollments**
- **Assignment Submission** rates

#### **Generate Reports**
1. **Navigate to** "Reports"
2. **Select** report type
3. **Choose** date range
4. **Click** "Generate Report"
5. **Download** or view online

---

## 👨‍🏫 **Lecturer Guide**

As a Lecturer, you can manage your courses, create assignments, and grade student submissions.

### **Lecturer Dashboard**

Your dashboard shows:
- **Your Courses**: List of assigned courses
- **Recent Submissions**: Latest student submissions
- **Upcoming Deadlines**: Assignment due dates
- **Class Statistics**: Enrollment and performance data

### **Course Management**

#### **View Your Courses**
1. **Navigate to** "My Courses"
2. **See all** courses assigned to you
3. **Click** on a course to view details

#### **Course Details**
For each course, you can see:
- **Course Information**: Code, name, description
- **Enrolled Students**: List of registered students
- **Assignments**: Created assignments
- **Announcements**: Course announcements

### **Student Management**

#### **View Enrolled Students**
1. **Go to** course details page
2. **Click** "Students" tab
3. **View list** of enrolled students
4. **See student** progress and grades

#### **Student Progress**
- **Assignment submissions**
- **Grades received**
- **Attendance records** (if implemented)
- **Overall performance**

### **Assignment Management**

#### **Create Assignment**
1. **Go to** course details page
2. **Click** "Assignments" tab
3. **Click** "Create Assignment" button
4. **Fill in** assignment details:
   - Assignment Title
   - Description/Instructions
   - Due Date and Time
   - Maximum Score
   - File Upload Requirements
5. **Click** "Create Assignment"

#### **View Assignments**
1. **Navigate to** "Assignments"
2. **See all** your created assignments
3. **Filter by** course or status
4. **View submission** statistics

#### **Edit Assignment**
1. **Click** "Edit" on assignment
2. **Modify** assignment details
3. **Update** due date if needed
4. **Click** "Save Changes"

### **Grading System**

#### **View Submissions**
1. **Go to** assignment details
2. **Click** "Submissions" tab
3. **See all** student submissions
4. **Filter by** submission status

#### **Grade Submission**
1. **Click** "Grade" next to submission
2. **Review** submitted content/files
3. **Enter** score (out of maximum points)
4. **Add** written feedback
5. **Click** "Save Grade"

#### **Bulk Grading**
1. **Select** multiple submissions
2. **Click** "Bulk Actions"
3. **Choose** "Grade Selected"
4. **Enter** common feedback
5. **Individual scores** can be set

### **Announcements**

#### **Create Announcement**
1. **Go to** course details
2. **Click** "Announcements" tab
3. **Click** "New Announcement"
4. **Fill in**:
   - Announcement Title
   - Content/Message
   - Mark as Important (optional)
5. **Click** "Post Announcement"

#### **Manage Announcements**
- **Edit** existing announcements
- **Delete** old announcements
- **Pin** important announcements

---

## 👨‍🎓 **Student Guide**

As a Student, you can enroll in courses, submit assignments, and track your academic progress.

### **Student Dashboard**

Your dashboard displays:
- **Enrolled Courses**: Your current courses
- **Upcoming Assignments**: Due assignments
- **Recent Grades**: Latest graded work
- **Announcements**: Important course updates

### **Course Enrollment**

#### **Browse Available Courses**
1. **Navigate to** "Course Catalog"
2. **Browse** all available courses
3. **Filter by** department or credits
4. **Search** for specific courses

#### **View Course Details**
1. **Click** on a course
2. **See** course information:
   - Course Description
   - Lecturer Information
   - Credits and Requirements
   - Schedule (if available)

#### **Enroll in Course**
1. **Click** "Enroll" button on course
2. **Confirm** enrollment
3. **Course appears** in "My Courses"

#### **Drop Course**
1. **Go to** "My Courses"
2. **Click** "Drop" next to course
3. **Confirm** the action
4. **Course will be** removed from your list

### **Assignment Management**

#### **View Assignments**
1. **Navigate to** "Assignments"
2. **See all** assignments from enrolled courses
3. **Filter by** course or due date
4. **Sort by** priority or deadline

#### **Assignment Details**
For each assignment, view:
- **Instructions** and requirements
- **Due date** and time
- **Maximum points**
- **Submission status**
- **Grade** (if graded)

#### **Submit Assignment**

**Text Submission:**
1. **Click** "Submit" on assignment
2. **Type** or paste your answer
3. **Review** your submission
4. **Click** "Submit Assignment"

**File Submission:**
1. **Click** "Submit" on assignment
2. **Click** "Choose File" or drag-and-drop
3. **Select** your file(s)
4. **Add** submission notes (optional)
5. **Click** "Submit Assignment"

#### **Edit Submission**
- **Before deadline**: Edit and resubmit
- **After deadline**: Contact lecturer for permission

### **Grade Tracking**

#### **View Grades**
1. **Navigate to** "Grades"
2. **See all** graded assignments
3. **Filter by** course
4. **View** detailed feedback

#### **Grade Details**
For each graded assignment:
- **Score received** / Total points
- **Percentage** and letter grade
- **Lecturer feedback**
- **Submission date**
- **Grading date**

#### **Overall Progress**
- **Course-wise** grade summary
- **GPA calculation** (if implemented)
- **Progress charts** and trends

### **Profile Management**

#### **View Profile**
1. **Click** on your name (top-right)
2. **Select** "Profile"
3. **View** your information

#### **Edit Profile**
1. **Click** "Edit Profile"
2. **Update** personal information:
   - Name
   - Email
   - Department
   - Contact Information
3. **Click** "Save Changes"

#### **Change Password**
1. **Go to** Profile page
2. **Click** "Change Password"
3. **Enter** current password
4. **Enter** new password
5. **Confirm** new password
6. **Click** "Update Password"

---

## 🔧 **Common Features**

### **Navigation**

#### **Sidebar Menu**
- **Dashboard**: Main overview page
- **Role-specific options**: Based on your role
- **Profile**: Personal settings
- **Logout**: Sign out of system

#### **Top Navigation**
- **Breadcrumbs**: Show current page location
- **User menu**: Quick access to profile and logout
- **Notifications**: System alerts (if implemented)

### **Search and Filtering**

#### **Search Functionality**
- **Global search**: Find courses, users, or content
- **Page-specific search**: Filter current page results
- **Advanced filters**: Multiple criteria selection

#### **Sorting Options**
- **Alphabetical**: A-Z or Z-A
- **Date**: Newest or oldest first
- **Status**: Active, completed, pending
- **Custom**: Role-specific sorting

### **Notifications**

#### **Types of Notifications**
- **Assignment due** reminders
- **New announcements**
- **Grade updates**
- **System maintenance** alerts

#### **Managing Notifications**
- **View all** notifications
- **Mark as read**
- **Delete** old notifications
- **Notification settings** (if available)

---

## 🚨 **Troubleshooting**

### **Common Issues**

#### **Login Problems**

**"Invalid email or password"**
- **Check** email spelling
- **Verify** password (case-sensitive)
- **Try** password reset (if available)
- **Contact** administrator

**"Account locked"**
- **Contact** system administrator
- **Wait** for automatic unlock (if configured)

#### **Access Denied**

**"You don't have permission"**
- **Verify** you're logged in
- **Check** your role permissions
- **Contact** administrator if incorrect

#### **File Upload Issues**

**"File too large"**
- **Check** file size limit
- **Compress** or reduce file size
- **Use** alternative format

**"Invalid file type"**
- **Check** allowed file formats
- **Convert** to supported format
- **Contact** lecturer for alternatives

#### **Page Loading Problems**

**Page won't load**
- **Refresh** the page (F5)
- **Clear** browser cache
- **Try** different browser
- **Check** internet connection

**Slow performance**
- **Close** other browser tabs
- **Check** internet speed
- **Try** during off-peak hours

### **Browser Requirements**

#### **Supported Browsers**
- **Chrome 90+** (Recommended)
- **Firefox 88+**
- **Safari 14+**
- **Edge 90+**

#### **Browser Settings**
- **Enable JavaScript**
- **Allow cookies**
- **Disable ad blockers** for the site
- **Enable pop-ups** if needed

### **Mobile Usage**

#### **Mobile Compatibility**
- **Responsive design** works on tablets
- **Basic functionality** on phones
- **Full features** available on desktop

#### **Mobile Tips**
- **Use landscape** orientation for better view
- **Zoom in** for small text or buttons
- **Use mobile browser** instead of apps

### **Getting Help**

#### **Self-Help Resources**
- **User Manual** (this document)
- **FAQ section** (if available)
- **Video tutorials** (if available)

#### **Contact Support**
- **Technical Issues**: IT Help Desk
- **Academic Questions**: Course Lecturer
- **Account Problems**: System Administrator

#### **Emergency Contacts**
- **Email**: support@university.edu
- **Phone**: +1-234-567-8900
- **Office Hours**: Monday-Friday, 9 AM - 5 PM

---

## 📱 **Tips for Success**

### **Best Practices**

#### **For All Users**
- **Regular backups** of important files
- **Strong passwords** and regular updates
- **Log out** when using shared computers
- **Report bugs** or issues promptly

#### **For Students**
- **Submit early** to avoid last-minute issues
- **Keep backups** of all assignments
- **Check deadlines** regularly
- **Communicate** with lecturers about issues

#### **For Lecturers**
- **Clear instructions** in assignments
- **Regular announcements** for updates
- **Timely grading** and feedback
- **Monitor** student progress

#### **For Admins**
- **Regular system** maintenance
- **Monitor** system performance
- **Backup** important data
- **Train users** on new features

### **Productivity Tips**

#### **Keyboard Shortcuts**
- **Ctrl+S**: Save (where applicable)
- **Ctrl+F**: Search on page
- **Tab**: Navigate between fields
- **Enter**: Submit forms

#### **Time Management**
- **Set reminders** for due dates
- **Prioritize** urgent tasks
- **Use dashboard** for quick overview
- **Regular check-ins** with system

---

**This user manual covers the core functionality of the Course Management System. For additional features or specific questions, please contact your system administrator or technical support team.**

**Version**: 1.0  
**Last Updated**: January 2025  
**Next Review**: June 2025
