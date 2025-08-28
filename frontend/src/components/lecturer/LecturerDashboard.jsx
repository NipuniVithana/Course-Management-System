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
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Tabs,
  Tab
} from '@mui/material';
import {
  Add as AddIcon,
  Grade as GradeIcon,
  Assignment as AssignmentIcon,
  People as PeopleIcon,
  Edit as EditIcon,
  Visibility as ViewIcon
} from '@mui/icons-material';
import lecturerService from '../../services/lecturerService';

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

const LecturerDashboard = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [students, setStudents] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Dialog states
  const [openAssignmentDialog, setOpenAssignmentDialog] = useState(false);
  const [openGradeDialog, setOpenGradeDialog] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  // Form states
  const [assignmentForm, setAssignmentForm] = useState({
    title: '',
    description: '',
    dueDate: '',
    maxPoints: 100,
    courseId: ''
  });

  const [gradeForm, setGradeForm] = useState({
    pointsEarned: '',
    feedback: ''
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  useEffect(() => {
    if (selectedCourse) {
      loadCourseData(selectedCourse.id);
    }
  }, [selectedCourse]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const coursesData = await lecturerService.getMyCourses();
      setCourses(coursesData);
      
      if (coursesData.length > 0) {
        setSelectedCourse(coursesData[0]);
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCourseData = async (courseId) => {
    try {
      const [studentsData, assignmentsData] = await Promise.all([
        lecturerService.getEnrolledStudents(courseId),
        lecturerService.getAssignments(courseId)
      ]);
      
      setStudents(studentsData);
      setAssignments(assignmentsData);
    } catch (error) {
      console.error('Error loading course data:', error);
    }
  };

  const handleCreateAssignment = async (e) => {
    e.preventDefault();
    try {
      await lecturerService.createAssignment({
        ...assignmentForm,
        courseId: selectedCourse.id
      });
      
      setOpenAssignmentDialog(false);
      setAssignmentForm({
        title: '',
        description: '',
        dueDate: '',
        maxPoints: 100,
        courseId: ''
      });
      
      if (selectedCourse) {
        loadCourseData(selectedCourse.id);
      }
    } catch (error) {
      console.error('Error creating assignment:', error);
    }
  };

  const handleViewSubmissions = async (assignment) => {
    try {
      const submissionsData = await lecturerService.getSubmissions(assignment.id);
      setSubmissions(submissionsData);
      setActiveTab(3); // Switch to submissions tab
    } catch (error) {
      console.error('Error loading submissions:', error);
    }
  };

  const handleGradeSubmission = (submission) => {
    setSelectedSubmission(submission);
    setGradeForm({
      pointsEarned: submission.pointsEarned || '',
      feedback: submission.feedback || ''
    });
    setOpenGradeDialog(true);
  };

  const handleSubmitGrade = async (e) => {
    e.preventDefault();
    try {
      await lecturerService.gradeSubmission(selectedSubmission.id, gradeForm);
      setOpenGradeDialog(false);
      setSelectedSubmission(null);
      setGradeForm({
        pointsEarned: '',
        feedback: ''
      });
      
      // Refresh submissions
      if (submissions.length > 0) {
        const assignmentId = submissions[0].assignmentId;
        const submissionsData = await lecturerService.getSubmissions(assignmentId);
        setSubmissions(submissionsData);
      }
    } catch (error) {
      console.error('Error grading submission:', error);
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Lecturer Dashboard
      </Typography>

      {/* Course Selection */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Select Course:
        </Typography>
        <Box display="flex" gap={2} flexWrap="wrap">
          {courses.map((course) => (
            <Button
              key={course.id}
              variant={selectedCourse?.id === course.id ? "contained" : "outlined"}
              onClick={() => setSelectedCourse(course)}
            >
              {course.courseCode} - {course.title}
            </Button>
          ))}
        </Box>
      </Box>

      {selectedCourse && (
        <>
          {/* Statistics Cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box>
                      <Typography color="textSecondary" gutterBottom>
                        Enrolled Students
                      </Typography>
                      <Typography variant="h4">
                        {students.length}
                      </Typography>
                    </Box>
                    <PeopleIcon color="primary" sx={{ fontSize: 40 }} />
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
                        Total Assignments
                      </Typography>
                      <Typography variant="h4">
                        {assignments.length}
                      </Typography>
                    </Box>
                    <AssignmentIcon color="secondary" sx={{ fontSize: 40 }} />
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
                        Pending Grades
                      </Typography>
                      <Typography variant="h4">
                        {submissions.filter(s => !s.pointsEarned).length}
                      </Typography>
                    </Box>
                    <GradeIcon color="warning" sx={{ fontSize: 40 }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Tabs */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={activeTab} onChange={handleTabChange}>
              <Tab label="Students" />
              <Tab label="Assignments" />
              <Tab label="Grade Management" />
              <Tab label="Submissions" />
            </Tabs>
          </Box>

          {/* Students Tab */}
          <TabPanel value={activeTab} index={0}>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Student ID</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Program</TableCell>
                    <TableCell>Enrollment Date</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {students.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell>{student.studentId}</TableCell>
                      <TableCell>{student.firstName} {student.lastName}</TableCell>
                      <TableCell>{student.email}</TableCell>
                      <TableCell>{student.program}</TableCell>
                      <TableCell>
                        {new Date(student.enrollmentDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={student.status || 'ENROLLED'}
                          color="success"
                          size="small"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>

          {/* Assignments Tab */}
          <TabPanel value={activeTab} index={1}>
            <Box sx={{ mb: 2 }}>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setOpenAssignmentDialog(true)}
              >
                Create Assignment
              </Button>
            </Box>
            
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Title</TableCell>
                    <TableCell>Due Date</TableCell>
                    <TableCell>Max Points</TableCell>
                    <TableCell>Submissions</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {assignments.map((assignment) => (
                    <TableRow key={assignment.id}>
                      <TableCell>{assignment.title}</TableCell>
                      <TableCell>
                        {new Date(assignment.dueDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{assignment.maxPoints}</TableCell>
                      <TableCell>{assignment.submissionCount || 0}</TableCell>
                      <TableCell>
                        <IconButton
                          size="small"
                          onClick={() => handleViewSubmissions(assignment)}
                          title="View Submissions"
                        >
                          <ViewIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          title="Edit Assignment"
                        >
                          <EditIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>

          {/* Grade Management Tab */}
          <TabPanel value={activeTab} index={2}>
            <Typography variant="h6" gutterBottom>
              Final Grades for {selectedCourse.title}
            </Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Student</TableCell>
                    <TableCell>Assignment Avg</TableCell>
                    <TableCell>Final Grade</TableCell>
                    <TableCell>Letter Grade</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {students.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell>{student.firstName} {student.lastName}</TableCell>
                      <TableCell>{student.assignmentAverage || '-'}</TableCell>
                      <TableCell>{student.finalGrade || '-'}</TableCell>
                      <TableCell>{student.letterGrade || '-'}</TableCell>
                      <TableCell>
                        <Button size="small" variant="outlined">
                          Set Grade
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>

          {/* Submissions Tab */}
          <TabPanel value={activeTab} index={3}>
            <Typography variant="h6" gutterBottom>
              Assignment Submissions
            </Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Student</TableCell>
                    <TableCell>Submission Date</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Points Earned</TableCell>
                    <TableCell>Max Points</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {submissions.map((submission) => (
                    <TableRow key={submission.id}>
                      <TableCell>
                        {submission.student?.firstName} {submission.student?.lastName}
                      </TableCell>
                      <TableCell>
                        {new Date(submission.submittedAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={submission.status}
                          color={submission.status === 'GRADED' ? 'success' : 'warning'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{submission.pointsEarned || '-'}</TableCell>
                      <TableCell>{submission.assignment?.maxPoints}</TableCell>
                      <TableCell>
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => handleGradeSubmission(submission)}
                        >
                          {submission.pointsEarned ? 'Edit Grade' : 'Grade'}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>
        </>
      )}

      {/* Assignment Dialog */}
      <Dialog open={openAssignmentDialog} onClose={() => setOpenAssignmentDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Assignment</DialogTitle>
        <form onSubmit={handleCreateAssignment}>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Assignment Title"
              fullWidth
              variant="outlined"
              value={assignmentForm.title}
              onChange={(e) => setAssignmentForm({...assignmentForm, title: e.target.value})}
              required
            />
            <TextField
              margin="dense"
              label="Description"
              fullWidth
              multiline
              rows={4}
              variant="outlined"
              value={assignmentForm.description}
              onChange={(e) => setAssignmentForm({...assignmentForm, description: e.target.value})}
            />
            <TextField
              margin="dense"
              label="Due Date"
              type="datetime-local"
              fullWidth
              variant="outlined"
              value={assignmentForm.dueDate}
              onChange={(e) => setAssignmentForm({...assignmentForm, dueDate: e.target.value})}
              required
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              margin="dense"
              label="Maximum Points"
              type="number"
              fullWidth
              variant="outlined"
              value={assignmentForm.maxPoints}
              onChange={(e) => setAssignmentForm({...assignmentForm, maxPoints: parseInt(e.target.value)})}
              required
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenAssignmentDialog(false)}>Cancel</Button>
            <Button type="submit" variant="contained">Create</Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Grade Dialog */}
      <Dialog open={openGradeDialog} onClose={() => setOpenGradeDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Grade Submission</DialogTitle>
        <form onSubmit={handleSubmitGrade}>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Points Earned"
              type="number"
              fullWidth
              variant="outlined"
              value={gradeForm.pointsEarned}
              onChange={(e) => setGradeForm({...gradeForm, pointsEarned: e.target.value})}
              required
            />
            <TextField
              margin="dense"
              label="Feedback"
              fullWidth
              multiline
              rows={4}
              variant="outlined"
              value={gradeForm.feedback}
              onChange={(e) => setGradeForm({...gradeForm, feedback: e.target.value})}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenGradeDialog(false)}>Cancel</Button>
            <Button type="submit" variant="contained">Save Grade</Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default LecturerDashboard;
