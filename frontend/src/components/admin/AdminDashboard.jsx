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
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  People as PeopleIcon,
  School as SchoolIcon,
  Assignment as AssignmentIcon
} from '@mui/icons-material';
import adminService from '../../services/adminService';

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    totalUsers: 0,
    totalCourses: 0,
    totalEnrollments: 0,
    recentActivities: []
  });
  const [courses, setCourses] = useState([]);
  const [lecturers, setLecturers] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Dialog states
  const [openCourseDialog, setOpenCourseDialog] = useState(false);
  const [openLecturerDialog, setOpenLecturerDialog] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  
  // Form states
  const [courseForm, setCourseForm] = useState({
    courseCode: '',
    title: '',
    description: '',
    credits: '',
    capacity: '',
    lecturerId: ''
  });
  
  const [lecturerForm, setLecturerForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    department: '',
    phone: '',
    officeLocation: ''
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [dashStats, coursesData, lecturersData, studentsData] = await Promise.all([
        adminService.getDashboardStats(),
        adminService.getAllCourses(),
        adminService.getAllLecturers(),
        adminService.getAllStudents()
      ]);
      
      setDashboardData(dashStats);
      setCourses(coursesData);
      setLecturers(lecturersData);
      setStudents(studentsData);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCourseSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedCourse) {
        await adminService.updateCourse(selectedCourse.id, courseForm);
      } else {
        await adminService.createCourse(courseForm);
      }
      
      setOpenCourseDialog(false);
      setCourseForm({
        courseCode: '',
        title: '',
        description: '',
        credits: '',
        capacity: '',
        lecturerId: ''
      });
      setSelectedCourse(null);
      loadDashboardData();
    } catch (error) {
      console.error('Error saving course:', error);
    }
  };

  const handleLecturerSubmit = async (e) => {
    e.preventDefault();
    try {
      await adminService.createLecturer(lecturerForm);
      setOpenLecturerDialog(false);
      setLecturerForm({
        firstName: '',
        lastName: '',
        email: '',
        department: '',
        phone: '',
        officeLocation: ''
      });
      loadDashboardData();
    } catch (error) {
      console.error('Error creating lecturer:', error);
    }
  };

  const handleEditCourse = (course) => {
    setSelectedCourse(course);
    setCourseForm({
      courseCode: course.courseCode,
      title: course.title,
      description: course.description || '',
      credits: course.credits.toString(),
      capacity: course.capacity.toString(),
      lecturerId: course.lecturerId || ''
    });
    setOpenCourseDialog(true);
  };

  const handleDeleteCourse = async (courseId) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await adminService.deleteCourse(courseId);
        loadDashboardData();
      } catch (error) {
        console.error('Error deleting course:', error);
      }
    }
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Total Students
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
                    Total Lecturers
                  </Typography>
                  <Typography variant="h4">
                    {lecturers.length}
                  </Typography>
                </Box>
                <SchoolIcon color="secondary" sx={{ fontSize: 40 }} />
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
                    Total Courses
                  </Typography>
                  <Typography variant="h4">
                    {courses.length}
                  </Typography>
                </Box>
                <AssignmentIcon color="success" sx={{ fontSize: 40 }} />
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
                    Total Enrollments
                  </Typography>
                  <Typography variant="h4">
                    {dashboardData.totalEnrollments}
                  </Typography>
                </Box>
                <AssignmentIcon color="warning" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Quick Actions
        </Typography>
        <Box display="flex" gap={2}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenCourseDialog(true)}
          >
            Add Course
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenLecturerDialog(true)}
          >
            Add Lecturer
          </Button>
        </Box>
      </Box>

      {/* Courses Table */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Courses Management
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Course Code</TableCell>
                <TableCell>Title</TableCell>
                <TableCell>Credits</TableCell>
                <TableCell>Capacity</TableCell>
                <TableCell>Lecturer</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {courses.map((course) => (
                <TableRow key={course.id}>
                  <TableCell>{course.courseCode}</TableCell>
                  <TableCell>{course.title}</TableCell>
                  <TableCell>{course.credits}</TableCell>
                  <TableCell>{course.capacity}</TableCell>
                  <TableCell>
                    {course.lecturer ? `${course.lecturer.firstName} ${course.lecturer.lastName}` : 'Unassigned'}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={course.status}
                      color={course.status === 'ACTIVE' ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton
                      size="small"
                      onClick={() => handleEditCourse(course)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteCourse(course.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Course Dialog */}
      <Dialog open={openCourseDialog} onClose={() => setOpenCourseDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedCourse ? 'Edit Course' : 'Add New Course'}
        </DialogTitle>
        <form onSubmit={handleCourseSubmit}>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Course Code"
              fullWidth
              variant="outlined"
              value={courseForm.courseCode}
              onChange={(e) => setCourseForm({...courseForm, courseCode: e.target.value})}
              required
            />
            <TextField
              margin="dense"
              label="Title"
              fullWidth
              variant="outlined"
              value={courseForm.title}
              onChange={(e) => setCourseForm({...courseForm, title: e.target.value})}
              required
            />
            <TextField
              margin="dense"
              label="Description"
              fullWidth
              multiline
              rows={3}
              variant="outlined"
              value={courseForm.description}
              onChange={(e) => setCourseForm({...courseForm, description: e.target.value})}
            />
            <TextField
              margin="dense"
              label="Credits"
              type="number"
              fullWidth
              variant="outlined"
              value={courseForm.credits}
              onChange={(e) => setCourseForm({...courseForm, credits: e.target.value})}
              required
            />
            <TextField
              margin="dense"
              label="Capacity"
              type="number"
              fullWidth
              variant="outlined"
              value={courseForm.capacity}
              onChange={(e) => setCourseForm({...courseForm, capacity: e.target.value})}
              required
            />
            <FormControl fullWidth margin="dense">
              <InputLabel>Lecturer</InputLabel>
              <Select
                value={courseForm.lecturerId}
                onChange={(e) => setCourseForm({...courseForm, lecturerId: e.target.value})}
                label="Lecturer"
              >
                <MenuItem value="">Unassigned</MenuItem>
                {lecturers.map((lecturer) => (
                  <MenuItem key={lecturer.id} value={lecturer.id}>
                    {lecturer.firstName} {lecturer.lastName} - {lecturer.department}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenCourseDialog(false)}>Cancel</Button>
            <Button type="submit" variant="contained">
              {selectedCourse ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Lecturer Dialog */}
      <Dialog open={openLecturerDialog} onClose={() => setOpenLecturerDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Lecturer</DialogTitle>
        <form onSubmit={handleLecturerSubmit}>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="First Name"
              fullWidth
              variant="outlined"
              value={lecturerForm.firstName}
              onChange={(e) => setLecturerForm({...lecturerForm, firstName: e.target.value})}
              required
            />
            <TextField
              margin="dense"
              label="Last Name"
              fullWidth
              variant="outlined"
              value={lecturerForm.lastName}
              onChange={(e) => setLecturerForm({...lecturerForm, lastName: e.target.value})}
              required
            />
            <TextField
              margin="dense"
              label="Email"
              type="email"
              fullWidth
              variant="outlined"
              value={lecturerForm.email}
              onChange={(e) => setLecturerForm({...lecturerForm, email: e.target.value})}
              required
            />
            <TextField
              margin="dense"
              label="Department"
              fullWidth
              variant="outlined"
              value={lecturerForm.department}
              onChange={(e) => setLecturerForm({...lecturerForm, department: e.target.value})}
              required
            />
            <TextField
              margin="dense"
              label="Phone"
              fullWidth
              variant="outlined"
              value={lecturerForm.phone}
              onChange={(e) => setLecturerForm({...lecturerForm, phone: e.target.value})}
            />
            <TextField
              margin="dense"
              label="Office Location"
              fullWidth
              variant="outlined"
              value={lecturerForm.officeLocation}
              onChange={(e) => setLecturerForm({...lecturerForm, officeLocation: e.target.value})}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenLecturerDialog(false)}>Cancel</Button>
            <Button type="submit" variant="contained">Create</Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default AdminDashboard;
