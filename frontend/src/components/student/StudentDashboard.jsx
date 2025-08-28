import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Tabs,
  Tab,
  LinearProgress
} from '@mui/material';
import {
  School as SchoolIcon,
  Assignment as AssignmentIcon,
  Grade as GradeIcon,
  Person as PersonIcon,
  CloudUpload as UploadIcon
} from '@mui/icons-material';
import studentService from '../../services/studentService';

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const StudentDashboard = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [availableCourses, setAvailableCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [grades, setGrades] = useState([]);
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(true);

  // Dialog states
  const [openEnrollDialog, setOpenEnrollDialog] = useState(false);
  const [openSubmissionDialog, setOpenSubmissionDialog] = useState(false);
  const [openProfileDialog, setOpenProfileDialog] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedAssignment, setSelectedAssignment] = useState(null);

  // Form states
  const [submissionForm, setSubmissionForm] = useState({
    file: null,
    submissionText: ''
  });

  const [profileForm, setProfileForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    address: ''
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [
        availableCoursesData,
        enrolledCoursesData,
        assignmentsData,
        gradesData,
        profileData
      ] = await Promise.all([
        studentService.getAvailableCourses(),
        studentService.getMyEnrollments(),
        studentService.getMyAssignments(),
        studentService.getMyGrades(),
        studentService.getProfile()
      ]);
      
      setAvailableCourses(availableCoursesData);
      setEnrolledCourses(enrolledCoursesData);
      setAssignments(assignmentsData);
      setGrades(gradesData);
      setProfile(profileData);
      setProfileForm({
        firstName: profileData.firstName || '',
        lastName: profileData.lastName || '',
        phone: profileData.phone || '',
        address: profileData.address || ''
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEnrollInCourse = async (courseId) => {
    try {
      await studentService.enrollInCourse(courseId);
      setOpenEnrollDialog(false);
      loadDashboardData();
    } catch (error) {
      console.error('Error enrolling in course:', error);
    }
  };

  const handleSubmitAssignment = async (e) => {
    e.preventDefault();
    try {
      await studentService.submitAssignment(selectedAssignment.id, submissionForm);
      setOpenSubmissionDialog(false);
      setSubmissionForm({
        file: null,
        submissionText: ''
      });
      setSelectedAssignment(null);
      loadDashboardData();
    } catch (error) {
      console.error('Error submitting assignment:', error);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      await studentService.updateProfile(profileForm);
      setOpenProfileDialog(false);
      loadDashboardData();
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const calculateGPA = () => {
    if (grades.length === 0) return 0;
    const totalPoints = grades.reduce((sum, grade) => sum + (grade.gradePoints || 0), 0);
    const totalCredits = grades.reduce((sum, grade) => sum + (grade.credits || 0), 0);
    return totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : 0;
  };

  const getGradeColor = (letterGrade) => {
    switch (letterGrade) {
      case 'A': case 'A+': return 'success';
      case 'B': case 'B+': return 'info';
      case 'C': case 'C+': return 'warning';
      case 'D': case 'F': return 'error';
      default: return 'default';
    }
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Student Dashboard
      </Typography>

      <Typography variant="h6" gutterBottom>
        Welcome back, {profile.firstName} {profile.lastName}!
      </Typography>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Enrolled Courses
                  </Typography>
                  <Typography variant="h4">
                    {enrolledCourses.length}
                  </Typography>
                </Box>
                <SchoolIcon color="primary" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Pending Assignments
                  </Typography>
                  <Typography variant="h4">
                    {assignments.filter(a => !a.submitted).length}
                  </Typography>
                </Box>
                <AssignmentIcon color="warning" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Current GPA
                  </Typography>
                  <Typography variant="h4">
                    {calculateGPA()}
                  </Typography>
                </Box>
                <GradeIcon color="success" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Completed Courses
                  </Typography>
                  <Typography variant="h4">
                    {grades.filter(g => g.finalGrade).length}
                  </Typography>
                </Box>
                <PersonIcon color="info" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab label="Course Enrollment" />
          <Tab label="My Courses" />
          <Tab label="Assignments" />
          <Tab label="Grades" />
          <Tab label="Profile" />
        </Tabs>
      </Box>

      {/* Course Enrollment Tab */}
      <TabPanel value={activeTab} index={0}>
        <Typography variant="h6" gutterBottom>
          Available Courses
        </Typography>
        <Grid container spacing={3}>
          {availableCourses.map((course) => (
            <Grid item xs={12} md={6} lg={4} key={course.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {course.courseCode}
                  </Typography>
                  <Typography variant="subtitle1" gutterBottom>
                    {course.title}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" paragraph>
                    {course.description}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Credits:</strong> {course.credits}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Lecturer:</strong> {course.lecturer?.firstName} {course.lecturer?.lastName}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    <strong>Capacity:</strong> {course.enrolledCount || 0}/{course.capacity}
                  </Typography>
                  <Box mt={2}>
                    <Button
                      variant="contained"
                      fullWidth
                      onClick={() => {
                        setSelectedCourse(course);
                        setOpenEnrollDialog(true);
                      }}
                      disabled={course.enrolledCount >= course.capacity}
                    >
                      {course.enrolledCount >= course.capacity ? 'Full' : 'Enroll'}
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </TabPanel>

      {/* My Courses Tab */}
      <TabPanel value={activeTab} index={1}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Course Code</TableCell>
                <TableCell>Course Title</TableCell>
                <TableCell>Lecturer</TableCell>
                <TableCell>Credits</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Current Grade</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {enrolledCourses.map((enrollment) => (
                <TableRow key={enrollment.id}>
                  <TableCell>{enrollment.course?.courseCode}</TableCell>
                  <TableCell>{enrollment.course?.title}</TableCell>
                  <TableCell>
                    {enrollment.course?.lecturer?.firstName} {enrollment.course?.lecturer?.lastName}
                  </TableCell>
                  <TableCell>{enrollment.course?.credits}</TableCell>
                  <TableCell>
                    <Chip
                      label={enrollment.status}
                      color={enrollment.status === 'ENROLLED' ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{enrollment.currentGrade || '-'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      {/* Assignments Tab */}
      <TabPanel value={activeTab} index={2}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Assignment</TableCell>
                <TableCell>Course</TableCell>
                <TableCell>Due Date</TableCell>
                <TableCell>Max Points</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Grade</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {assignments.map((assignment) => (
                <TableRow key={assignment.id}>
                  <TableCell>{assignment.title}</TableCell>
                  <TableCell>{assignment.course?.courseCode}</TableCell>
                  <TableCell>
                    {new Date(assignment.dueDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{assignment.maxPoints}</TableCell>
                  <TableCell>
                    <Chip
                      label={assignment.submitted ? 'Submitted' : 'Pending'}
                      color={assignment.submitted ? 'success' : 'warning'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {assignment.grade ? `${assignment.grade}/${assignment.maxPoints}` : '-'}
                  </TableCell>
                  <TableCell>
                    {!assignment.submitted && (
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<UploadIcon />}
                        onClick={() => {
                          setSelectedAssignment(assignment);
                          setOpenSubmissionDialog(true);
                        }}
                      >
                        Submit
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      {/* Grades Tab */}
      <TabPanel value={activeTab} index={3}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6">
            Current GPA: {calculateGPA()}
          </Typography>
          <LinearProgress 
            variant="determinate" 
            value={(calculateGPA() / 4) * 100} 
            sx={{ mt: 1, height: 10, borderRadius: 5 }}
          />
        </Box>
        
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Course</TableCell>
                <TableCell>Credits</TableCell>
                <TableCell>Letter Grade</TableCell>
                <TableCell>Grade Points</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {grades.map((grade) => (
                <TableRow key={grade.id}>
                  <TableCell>
                    {grade.course?.courseCode} - {grade.course?.title}
                  </TableCell>
                  <TableCell>{grade.course?.credits}</TableCell>
                  <TableCell>
                    <Chip
                      label={grade.letterGrade || 'In Progress'}
                      color={getGradeColor(grade.letterGrade)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{grade.gradePoints || '-'}</TableCell>
                  <TableCell>
                    <Chip
                      label={grade.status || 'ENROLLED'}
                      color={grade.status === 'COMPLETED' ? 'success' : 'info'}
                      size="small"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      {/* Profile Tab */}
      <TabPanel value={activeTab} index={4}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Personal Information
                </Typography>
                <Typography><strong>Student ID:</strong> {profile.studentId}</Typography>
                <Typography><strong>Name:</strong> {profile.firstName} {profile.lastName}</Typography>
                <Typography><strong>Email:</strong> {profile.email}</Typography>
                <Typography><strong>Phone:</strong> {profile.phone || 'Not provided'}</Typography>
                <Typography><strong>Program:</strong> {profile.program}</Typography>
                <Typography><strong>Year:</strong> {profile.yearOfStudy}</Typography>
                <Box mt={2}>
                  <Button
                    variant="contained"
                    onClick={() => setOpenProfileDialog(true)}
                  >
                    Edit Profile
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Academic Summary
                </Typography>
                <Typography><strong>Current GPA:</strong> {calculateGPA()}</Typography>
                <Typography><strong>Total Credits:</strong> {profile.totalCredits || 0}</Typography>
                <Typography><strong>Completed Courses:</strong> {grades.filter(g => g.finalGrade).length}</Typography>
                <Typography><strong>In Progress:</strong> {enrolledCourses.length}</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Enrollment Confirmation Dialog */}
      <Dialog open={openEnrollDialog} onClose={() => setOpenEnrollDialog(false)}>
        <DialogTitle>Confirm Enrollment</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to enroll in {selectedCourse?.courseCode} - {selectedCourse?.title}?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEnrollDialog(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={() => handleEnrollInCourse(selectedCourse?.id)}
          >
            Enroll
          </Button>
        </DialogActions>
      </Dialog>

      {/* Assignment Submission Dialog */}
      <Dialog open={openSubmissionDialog} onClose={() => setOpenSubmissionDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Submit Assignment</DialogTitle>
        <form onSubmit={handleSubmitAssignment}>
          <DialogContent>
            <Typography variant="h6" gutterBottom>
              {selectedAssignment?.title}
            </Typography>
            <Typography variant="body2" color="textSecondary" paragraph>
              Due: {selectedAssignment && new Date(selectedAssignment.dueDate).toLocaleString()}
            </Typography>
            
            <TextField
              margin="dense"
              label="Text Submission"
              fullWidth
              multiline
              rows={4}
              variant="outlined"
              value={submissionForm.submissionText}
              onChange={(e) => setSubmissionForm({...submissionForm, submissionText: e.target.value})}
            />
            
            <Box mt={2}>
              <input
                accept="*/*"
                style={{ display: 'none' }}
                id="file-upload"
                type="file"
                onChange={(e) => setSubmissionForm({...submissionForm, file: e.target.files[0]})}
              />
              <label htmlFor="file-upload">
                <Button variant="outlined" component="span" startIcon={<UploadIcon />}>
                  Upload File
                </Button>
              </label>
              {submissionForm.file && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Selected: {submissionForm.file.name}
                </Typography>
              )}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenSubmissionDialog(false)}>Cancel</Button>
            <Button type="submit" variant="contained">Submit</Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Profile Edit Dialog */}
      <Dialog open={openProfileDialog} onClose={() => setOpenProfileDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Profile</DialogTitle>
        <form onSubmit={handleUpdateProfile}>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="First Name"
              fullWidth
              variant="outlined"
              value={profileForm.firstName}
              onChange={(e) => setProfileForm({...profileForm, firstName: e.target.value})}
              required
            />
            <TextField
              margin="dense"
              label="Last Name"
              fullWidth
              variant="outlined"
              value={profileForm.lastName}
              onChange={(e) => setProfileForm({...profileForm, lastName: e.target.value})}
              required
            />
            <TextField
              margin="dense"
              label="Phone"
              fullWidth
              variant="outlined"
              value={profileForm.phone}
              onChange={(e) => setProfileForm({...profileForm, phone: e.target.value})}
            />
            <TextField
              margin="dense"
              label="Address"
              fullWidth
              multiline
              rows={3}
              variant="outlined"
              value={profileForm.address}
              onChange={(e) => setProfileForm({...profileForm, address: e.target.value})}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenProfileDialog(false)}>Cancel</Button>
            <Button type="submit" variant="contained">Update</Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default StudentDashboard;
