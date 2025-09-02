import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Button,
  Typography,
  message,
  Tag,
  Modal,
  Form,
  Input,
  InputNumber,
  Upload,
  Space,
  Tabs,
  List,
  Avatar,
  Breadcrumb,
  Spin,
  Dropdown,
  DatePicker
} from 'antd';
import {
  BookOutlined,
  UploadOutlined,
  FileTextOutlined,
  EditOutlined,
  TrophyOutlined,
  HomeOutlined,
  UserOutlined,
  TeamOutlined,
  CalendarOutlined,
  ArrowLeftOutlined,
  MoreOutlined,
  DeleteOutlined,
  DownloadOutlined
} from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import lecturerService from '../../services/lecturerService';
import studentService from '../../services/studentService';

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { TextArea } = Input;

const CourseManagement = ({ userRole = 'LECTURER' }) => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [uploadModal, setUploadModal] = useState(false);
  const [assignmentModal, setAssignmentModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [editAssignmentModal, setEditAssignmentModal] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [submissionModal, setSubmissionModal] = useState(false);
  const [selectedAssignmentForSubmission, setSelectedAssignmentForSubmission] = useState(null);
  const [gradeModal, setGradeModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [submissionGradeModal, setSubmissionGradeModal] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [activeTab, setActiveTab] = useState('materials');
  const [form] = Form.useForm();
  const [assignmentForm] = Form.useForm();
  const [editForm] = Form.useForm();
  const [editAssignmentForm] = Form.useForm();
  const [submissionForm] = Form.useForm();
  const [gradeForm] = Form.useForm();
  const [submissionGradeForm] = Form.useForm();

  // Role-based configuration
  const isStudent = userRole === 'STUDENT';
  const [studentGrade, setStudentGrade] = useState(null);
  const [studentSubmissions, setStudentSubmissions] = useState({});

  useEffect(() => {
    const loadData = async () => {
      if (courseId) {
        try {
          setLoading(true);
          if (isStudent) {
            // For students, load course data, materials, students, and their grades
            const [courseData, materialsData, studentsData, gradesData] = await Promise.all([
              studentService.getCourseById(courseId),
              studentService.getCourseMaterials(courseId).catch(() => []),
              studentService.getCourseStudents(courseId).catch(() => []),
              studentService.getCourseGrades(courseId).catch(() => null)
            ]);
            setCourse(courseData);
            setMaterials(materialsData);
            setStudents(studentsData);
            setStudentGrade(gradesData);
            // Students can view assignments but not edit them
            try {
              const assignmentsData = await studentService.getCourseAssignments(courseId);
              setAssignments(assignmentsData);
              // Load student submissions for each assignment
              await loadStudentSubmissions(assignmentsData);
            } catch (error) {
              console.error('Error loading assignments:', error);
              setAssignments([]);
            }
          } else {
            // For lecturers, load all data
            const [courseData, studentsData, materialsData, assignmentsData] = await Promise.all([
              lecturerService.getCourseById(courseId),
              lecturerService.getEnrolledStudents(courseId),
              lecturerService.getCourseMaterials(courseId),
              lecturerService.getAssignments(courseId).catch(() => [])
            ]);
            setCourse(courseData);
            setStudents(studentsData);
            setMaterials(materialsData);
            setAssignments(assignmentsData);
            
            // Load submissions for lecturers
            try {
              const submissionsData = await lecturerService.getCourseSubmissions(courseId);
              setSubmissions(submissionsData);
            } catch (error) {
              console.error('Error loading submissions:', error);
              setSubmissions([]);
            }
          }
        } catch (error) {
          console.error('Error loading course data:', error);
          message.error('Failed to load course data');
        } finally {
          setLoading(false);
        }
      }
    };
    
    loadData();
  }, [courseId, isStudent]);

  // Function to load student submissions for all assignments
  const loadStudentSubmissions = async (assignmentsData) => {
    if (!isStudent || !assignmentsData || assignmentsData.length === 0) {
      return;
    }

    try {
      const submissionsMap = {};
      
      // Load submission data for each assignment
      for (const assignment of assignmentsData) {
        try {
          const submissionData = await studentService.getSubmission(assignment.id);
          if (submissionData) {
            submissionsMap[assignment.id] = submissionData;
          }
        } catch (error) {
          console.log(`No submission found for assignment ${assignment.id}`);
        }
      }
      
      setStudentSubmissions(submissionsMap);
    } catch (error) {
      console.error('Error loading student submissions:', error);
    }
  };

  const loadCourseData = async () => {
    try {
      if (isStudent) {
        // For students, reload materials and students using student endpoints
        const [materialsData, studentsData, gradesData] = await Promise.all([
          studentService.getCourseMaterials(courseId).catch(() => []),
          studentService.getCourseStudents(courseId).catch(() => []),
          studentService.getCourseGrades(courseId).catch(() => null)
        ]);
        setMaterials(materialsData);
        setStudents(studentsData);
        setStudentGrade(gradesData);
        // Students can view assignments but not edit them
        try {
          const assignmentsData = await studentService.getCourseAssignments(courseId);
          setAssignments(assignmentsData);
          // Reload student submissions
          await loadStudentSubmissions(assignmentsData);
        } catch (error) {
          console.error('Error loading assignments:', error);
          setAssignments([]);
        }
      } else {
        // For lecturers, reload all data
        const [studentsData, materialsData, assignmentsData] = await Promise.all([
          lecturerService.getEnrolledStudents(courseId),
          lecturerService.getCourseMaterials(courseId),
          lecturerService.getAssignments(courseId).catch(() => [])
        ]);
        setStudents(studentsData);
        setMaterials(materialsData);
        setAssignments(assignmentsData);
        
        // Load submissions for lecturers
        try {
          const submissionsData = await lecturerService.getCourseSubmissions(courseId);
          setSubmissions(submissionsData);
        } catch (error) {
          console.error('Error loading submissions:', error);
          setSubmissions([]);
        }
      }
    } catch (error) {
      console.error('Error loading course data:', error);
      message.error('Failed to load course data');
    }
  };

  const handleUploadMaterial = async (values) => {
    try {
      await lecturerService.uploadCourseMaterial(courseId, values);
      message.success('Material uploaded successfully');
      setUploadModal(false);
      form.resetFields();
      await loadCourseData();
    } catch (error) {
      console.error('Error uploading material:', error);
      message.error('Failed to upload material');
    }
  };

  const handleCreateAssignment = async (values) => {
    try {
      const assignmentData = {
        ...values,
        courseId: courseId,
        dueDate: values.dueDate.format('YYYY-MM-DDTHH:mm:ss')
      };
      
      // Handle file upload
      if (values.file && values.file.fileList && values.file.fileList.length > 0) {
        assignmentData.file = values.file.fileList[0].originFileObj;
      }
      
      await lecturerService.createAssignment(assignmentData);
      message.success('Assignment created successfully');
      setAssignmentModal(false);
      assignmentForm.resetFields();
      await loadCourseData();
    } catch (error) {
      console.error('Error creating assignment:', error);
      message.error('Failed to create assignment');
    }
  };

  const handleEditAssignment = (assignment) => {
    setSelectedAssignment(assignment);
    editAssignmentForm.setFieldsValue({
      title: assignment.title,
      description: assignment.description,
      maxPoints: assignment.maxPoints,
      dueDate: dayjs(assignment.dueDate)
    });
    setEditAssignmentModal(true);
  };

  const handleUpdateAssignment = async (values) => {
    try {
      const assignmentData = {
        ...values,
        dueDate: values.dueDate.format('YYYY-MM-DDTHH:mm:ss')
      };
      
      // Handle file upload
      if (values.file && values.file.fileList && values.file.fileList.length > 0) {
        assignmentData.file = values.file.fileList[0].originFileObj;
      }
      
      await lecturerService.updateAssignment(selectedAssignment.id, assignmentData);
      message.success('Assignment updated successfully');
      setEditAssignmentModal(false);
      editAssignmentForm.resetFields();
      setSelectedAssignment(null);
      await loadCourseData();
    } catch (error) {
      console.error('Error updating assignment:', error);
      message.error('Failed to update assignment');
    }
  };

  const handleDeleteAssignment = async (assignment) => {
    Modal.confirm({
      title: 'Delete Assignment',
      content: `Are you sure you want to delete "${assignment.title}"?`,
      okText: 'Yes, Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          await lecturerService.deleteAssignment(assignment.id);
          message.success('Assignment deleted successfully');
          await loadCourseData();
        } catch (error) {
          console.error('Error deleting assignment:', error);
          message.error('Failed to delete assignment');
        }
      }
    });
  };

  const handleDownloadAssignmentFile = async (assignment) => {
    try {
      const response = isStudent 
        ? await studentService.downloadAssignmentFile(assignment.id)
        : await lecturerService.downloadAssignmentFile(assignment.id);
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.download = assignment.fileName || 'assignment_file';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      message.success('File downloaded successfully');
    } catch (error) {
      console.error('Error downloading file:', error);
      message.error('Failed to download file');
    }
  };

  // Submission handlers
  const handleSubmitAssignment = (assignment) => {
    setSelectedAssignmentForSubmission(assignment);
    
    // Check if student has existing submission
    const existingSubmission = studentSubmissions[assignment.id];
    if (existingSubmission) {
      // Pre-populate form with existing submission data
      submissionForm.setFieldsValue({
        submissionText: existingSubmission.submissionText || ''
      });
    } else {
      // Clear form for new submission
      submissionForm.resetFields();
    }
    
    setSubmissionModal(true);
  };

  const handleCreateSubmission = async (values) => {
    try {
      const submissionData = {
        submissionText: values.submissionText
      };
      
      // Handle file upload
      if (values.file && values.file.fileList && values.file.fileList.length > 0) {
        submissionData.file = values.file.fileList[0].originFileObj;
      }
      
      await studentService.submitAssignment(selectedAssignmentForSubmission.id, submissionData);
      message.success('Assignment submitted successfully');
      setSubmissionModal(false);
      submissionForm.resetFields();
      setSelectedAssignmentForSubmission(null);
      
      // Reload student submissions to update the UI
      await loadStudentSubmissions(assignments);
    } catch (error) {
      console.error('Error submitting assignment:', error);
      message.error('Failed to submit assignment');
    }
  };

  // Handle tab changes
  const handleTabChange = (activeKey) => {
    setActiveTab(activeKey);
  };

  const handleDownloadSubmission = async (submission) => {
    try {
      const response = await lecturerService.downloadSubmissionFile(submission.id);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.download = submission.fileName || 'submission_file';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      message.success('File downloaded successfully');
    } catch (error) {
      console.error('Error downloading submission:', error);
      message.error('Failed to download submission');
    }
  };

  const handleUpdateGrade = async (values) => {
    try {
      await lecturerService.updateStudentGrade(
        courseId,
        selectedStudent.id,
        values
      );
      
      setStudents(prevStudents => 
        prevStudents.map(student => 
          student.id === selectedStudent.id 
            ? { ...student, grade: values.grade, feedback: values.feedback }
            : student
        )
      );
      
      message.success('Grade updated successfully');
      setGradeModal(false);
      gradeForm.resetFields();
      setSelectedStudent(null);
    } catch (error) {
      console.error('Error updating grade:', error);
      message.error('Failed to update grade');
    }
  };

  // Submission grading handlers
  const showSubmissionGradeModal = (submission) => {
    setSelectedSubmission(submission);
    submissionGradeForm.setFieldsValue({
      grade: submission.grade || '',
      feedback: submission.feedback || ''
    });
    setSubmissionGradeModal(true);
  };

  const handleGradeSubmission = async (values) => {
    try {
      await lecturerService.gradeSubmission(selectedSubmission.id, values);
      
      // Update the local submissions state immediately
      setSubmissions(prevSubmissions => 
        prevSubmissions.map(submission => 
          submission.id === selectedSubmission.id 
            ? { ...submission, grade: values.grade, feedback: values.feedback, gradedAt: new Date().toISOString() }
            : submission
        )
      );
      
      message.success('Submission graded successfully');
      setSubmissionGradeModal(false);
      submissionGradeForm.resetFields();
      setSelectedSubmission(null);
    } catch (error) {
      console.error('Error grading submission:', error);
      message.error('Failed to grade submission');
    }
  };

  const handleEditMaterial = (material) => {
    setSelectedMaterial(material);
    editForm.setFieldsValue({
      title: material.title,
      description: material.description
    });
    setEditModal(true);
  };

  const handleUpdateMaterial = async (values) => {
    try {
      await lecturerService.updateCourseMaterial(courseId, selectedMaterial.id, values);
      message.success('Material updated successfully');
      setEditModal(false);
      editForm.resetFields();
      setSelectedMaterial(null);
      await loadCourseData();
    } catch (error) {
      console.error('Error updating material:', error);
      message.error('Failed to update material');
    }
  };

  const handleDeleteMaterial = async (material) => {
    Modal.confirm({
      title: 'Delete Material',
      content: `Are you sure you want to delete "${material.title}"?`,
      okText: 'Yes, Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          await lecturerService.deleteCourseMaterial(courseId, material.id);
          message.success('Material deleted successfully');
          await loadCourseData();
        } catch (error) {
          console.error('Error deleting material:', error);
          message.error('Failed to delete material');
        }
      }
    });
  };

  const handleDownloadMaterial = async (material) => {
    try {
      message.info(`Downloading ${material.fileName}...`);
      const response = await lecturerService.downloadCourseMaterial(courseId, material.id);
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.download = material.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      message.success(`${material.fileName} downloaded successfully`);
    } catch (error) {
      console.error('Error downloading material:', error);
      message.error('Failed to download material');
    }
  };

  const showGradeModal = (student) => {
    setSelectedStudent(student);
    gradeForm.setFieldsValue({
      grade: student.grade ? Number(student.grade) : undefined,
      feedback: student.feedback || ''
    });
    setGradeModal(true);
  };

  const studentColumns = [
    {
      title: 'Student ID',
      dataIndex: 'studentId',
      key: 'studentId',
      width: 150,
    },
    {
      title: 'Name',
      key: 'name',
      width: 250,
      render: (_, record) => (
        <Space>
          <Avatar icon={<UserOutlined />} />
          {`${record.firstName} ${record.lastName}`}
        </Space>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      width: 280,
    },
  ];

  if (loading) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!course) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <Title level={4}>Course not found</Title>
        <Button onClick={() => navigate(isStudent ? '/student/my-courses' : '/lecturer/my-courses')}>
          Go back to My Courses
        </Button>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <Breadcrumb style={{ marginBottom: 16 }}>
          <Breadcrumb.Item>
            <HomeOutlined />
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <span 
              style={{ 
                color: '#1890ff', 
                cursor: 'pointer',
                textDecoration: 'none'
              }}
              onClick={() => navigate(isStudent ? '/student/my-courses' : '/lecturer/my-courses')}
            >
              My Courses
            </span>
          </Breadcrumb.Item>
          <Breadcrumb.Item>{course.title}</Breadcrumb.Item>
        </Breadcrumb>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <Title level={2} style={{ margin: 0, color: '#1890ff' }}>
              <BookOutlined /> {course.title}
            </Title>
            <Space style={{ marginTop: 8 }}>
              <Tag color="blue">{course.courseCode}</Tag>
              <Tag color="green">{course.credits} Credits</Tag>
              <Tag color="orange">{course.department}</Tag>
              <Tag color={course.status === 'ACTIVE' ? 'green' : 'red'}>
                {course.status}
              </Tag>
            </Space>
          </div>
          <Button 
            icon={<ArrowLeftOutlined />} 
            onClick={() => navigate(isStudent ? '/student/my-courses' : '/lecturer/my-courses')}
          >
            Back to My Courses
          </Button>
        </div>
      </div>



      {/* Main Content Tabs */}
      <Card>
        <Tabs activeKey={activeTab} onChange={handleTabChange} size="large">
          <TabPane 
            tab={
              <span>
                <FileTextOutlined />
                Materials ({materials.length})
              </span>
            } 
            key="materials"
          >
            {!isStudent && (
              <div style={{ marginBottom: 16 }}>
                <Button
                  type="primary"
                  icon={<UploadOutlined />}
                  onClick={() => setUploadModal(true)}
                >
                  Upload Material
                </Button>
              </div>
            )}
            <List
              dataSource={materials}
              renderItem={(material) => {
                // For lecturers, only edit and delete in dropdown menu
                let menuItems = [];
                if (!isStudent) {
                  menuItems = [
                    {
                      key: 'edit',
                      label: 'Edit',
                      icon: <EditOutlined />,
                      onClick: () => handleEditMaterial(material)
                    },
                    {
                      key: 'delete',
                      label: 'Delete',
                      icon: <DeleteOutlined />,
                      danger: true,
                      onClick: () => handleDeleteMaterial(material)
                    }
                  ];
                }

                return (
                  <List.Item
                    actions={
                      isStudent ? [
                        // For students, show only download button directly
                        <Button
                          type="link"
                          icon={<DownloadOutlined />}
                          onClick={() => handleDownloadMaterial(material)}
                        >
                          Download
                        </Button>
                      ] : [
                        // For lecturers, show download link and dropdown menu
                        <Button
                          type="link"
                          icon={<DownloadOutlined />}
                          onClick={() => handleDownloadMaterial(material)}
                        >
                          Download
                        </Button>,
                        <Dropdown
                          menu={{ items: menuItems }}
                          trigger={['click']}
                          placement="bottomRight"
                        >
                          <Button
                            type="text"
                            icon={<MoreOutlined />}
                            style={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              justifyContent: 'center' 
                            }}
                          />
                        </Dropdown>
                      ]
                    }
                  >
                    <List.Item.Meta
                      avatar={<Avatar icon={<FileTextOutlined />} />}
                      title={material.title}
                      description={
                        <Space direction="vertical" size={4}>
                          <Text type="secondary">{material.description}</Text>
                          <Space>
                            <Text type="secondary" style={{ fontSize: '12px' }}>
                              <CalendarOutlined /> Uploaded: {new Date(material.uploadDate).toLocaleDateString()}
                            </Text>
                            <Text type="secondary" style={{ fontSize: '12px' }}>
                              📁 {material.fileName}
                            </Text>
                            <Text type="secondary" style={{ fontSize: '12px' }}>
                              📊 {(material.fileSize / 1024).toFixed(1)} KB
                            </Text>
                          </Space>
                        </Space>
                      }
                    />
                  </List.Item>
                );
              }}
              locale={{ emptyText: 'No materials uploaded yet' }}
            />
          </TabPane>

          <TabPane 
            tab={
              <span>
                <FileTextOutlined />
                Assignments ({assignments.length})
              </span>
            } 
            key="assignments"
          >
            {!isStudent && (
              <div style={{ marginBottom: 16 }}>
                <Button
                  type="primary"
                  icon={<UploadOutlined />}
                  onClick={() => setAssignmentModal(true)}
                >
                  Create Assignment
                </Button>
              </div>
            )}
            <List
              dataSource={assignments}
              renderItem={(assignment) => {
                let menuItems = [];

                // Only add edit and delete options for lecturers
                if (!isStudent) {
                  menuItems = [
                    {
                      key: 'edit',
                      label: 'Edit',
                      icon: <EditOutlined />,
                      onClick: () => handleEditAssignment(assignment)
                    },
                    {
                      key: 'delete',
                      label: 'Delete',
                      icon: <DeleteOutlined />,
                      danger: true,
                      onClick: () => handleDeleteAssignment(assignment)
                    }
                  ];
                }

                return (
                  <List.Item
                    actions={
                      !isStudent ? [
                        // For lecturers, show dropdown menu
                        <Dropdown
                          menu={{ items: menuItems }}
                          trigger={['click']}
                          placement="bottomRight"
                        >
                          <Button
                            type="text"
                            icon={<MoreOutlined />}
                            style={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              justifyContent: 'center' 
                            }}
                          />
                        </Dropdown>
                      ] : []
                    }
                  >
                    <List.Item.Meta
                      avatar={<Avatar icon={<FileTextOutlined />} style={{ backgroundColor: '#1890ff' }} />}
                      title={assignment.title}
                      description={
                        <Space direction="vertical" size={4}>
                          <Text type="secondary">{assignment.description}</Text>
                          <Space>
                            <Text type="secondary" style={{ fontSize: '12px' }}>
                              <CalendarOutlined /> Due: {new Date(assignment.dueDate).toLocaleDateString()}
                            </Text>
                            <Text type="secondary" style={{ fontSize: '12px' }}>
                              🏆 Max Points: {assignment.maxPoints}
                            </Text>
                            <Text type="secondary" style={{ fontSize: '12px' }}>
                              📅 Created: {new Date(assignment.createdAt).toLocaleDateString()}
                            </Text>
                            {assignment.fileName && (
                              <Text type="secondary" style={{ fontSize: '12px' }}>
                                📎 File: {assignment.fileName}
                              </Text>
                            )}
                          </Space>
                          {assignment.fileName && (
                            <Button
                              type="link"
                              size="small"
                              icon={<DownloadOutlined />}
                              onClick={() => handleDownloadAssignmentFile(assignment)}
                              style={{ padding: '2px 8px', fontSize: '12px' }}
                            >
                              Download File
                            </Button>
                          )}
                          {isStudent && (() => {
                            const submission = studentSubmissions[assignment.id];
                            if (submission) {
                              // Student has already submitted
                              return (
                                <Space direction="vertical" style={{ marginTop: '8px' }}>
                                  <Tag color="green" style={{ fontSize: '12px' }}>
                                    ✅ Submitted on {new Date(submission.submittedAt).toLocaleDateString()}
                                  </Tag>
                                  {submission.grade && (
                                    <Tag color="blue" style={{ fontSize: '12px' }}>
                                      Grade: {submission.grade}%
                                    </Tag>
                                  )}
                                  <Button
                                    type="default"
                                    size="small"
                                    onClick={() => handleSubmitAssignment(assignment)}
                                    style={{ marginTop: '4px' }}
                                  >
                                    Edit Submission
                                  </Button>
                                </Space>
                              );
                            } else {
                              return (
                                <Button
                                  type="primary"
                                  size="small"
                                  onClick={() => handleSubmitAssignment(assignment)}
                                  style={{ marginTop: '8px' }}
                                >
                                  Submit Assignment
                                </Button>
                              );
                            }
                          })()}
                        </Space>
                      }
                    />
                  </List.Item>
                );
              }}
              locale={{ emptyText: 'No assignments created yet' }}
            />
          </TabPane>

          {!isStudent && (
            <TabPane 
              tab={
                <span>
                  <FileTextOutlined />
                  Submissions ({submissions.length})
                </span>
              } 
              key="submissions"
            >
              <Table
                columns={[
                  {
                    title: 'Student ID',
                    dataIndex: 'studentId',
                    key: 'studentId',
                    width: 120,
                  },
                  {
                    title: 'Student Name',
                    dataIndex: 'studentName',
                    key: 'studentName',
                    width: 150,
                  },
                  {
                    title: 'Assignment',
                    dataIndex: 'assignmentName',
                    key: 'assignmentName',
                    width: 200,
                  },
                  {
                    title: 'Submitted At',
                    dataIndex: 'submittedAt',
                    key: 'submittedAt',
                    width: 180,
                    render: (date) => new Date(date).toLocaleString(),
                  },
                  {
                    title: 'File',
                    key: 'file',
                    width: 120,
                    render: (_, record) => (
                      record.fileName ? (
                        <Button
                          type="link"
                          size="small"
                          icon={<DownloadOutlined />}
                          onClick={() => handleDownloadSubmission(record)}
                        >
                          Download
                        </Button>
                      ) : (
                        <Text type="secondary">No file</Text>
                      )
                    ),
                  },
                  {
                    title: 'Grade',
                    dataIndex: 'grade',
                    key: 'grade',
                    width: 100,
                    render: (grade) => grade ? `${grade}%` : 'Not graded',
                  },
                  {
                    title: 'Action',
                    key: 'action',
                    width: 120,
                    render: (_, record) => (
                      <Button
                        type="primary"
                        size="small"
                        icon={<EditOutlined />}
                        onClick={() => showSubmissionGradeModal(record)}
                      >
                        {record.grade ? 'Edit Grade' : 'Grade'}
                      </Button>
                    ),
                  }
                ]}
                dataSource={submissions}
                rowKey="id"
                scroll={{ x: 1000 }}
                expandable={{
                  expandedRowRender: (record) => (
                    <div style={{ padding: '16px' }}>
                      <Title level={5}>Submission Text:</Title>
                      <p>{record.submissionText || 'No text submission'}</p>
                      {record.feedback && (
                        <>
                          <Title level={5}>Feedback:</Title>
                          <p>{record.feedback}</p>
                        </>
                      )}
                    </div>
                  ),
                  rowExpandable: (record) => record.submissionText || record.feedback,
                }}
              />
            </TabPane>
          )}

          <TabPane 
            tab={
              <span>
                <TeamOutlined />
                Students ({students.length})
              </span>
            } 
            key="students"
          >
            <Table
              columns={studentColumns}
              dataSource={students}
              rowKey="id"
              scroll={{ x: 700 }}
            />
          </TabPane>

          <TabPane 
            tab={
              <span>
                <TrophyOutlined />
                Results
              </span>
            } 
            key="results"
          >
            <div style={{ marginBottom: 16 }}>
              <Title level={4}>
                {isStudent ? 'My Results' : 'Student Results'}
              </Title>
              <Text type="secondary">
                {isStudent ? 'View your grades and feedback' : 'Add and manage student grades'}
              </Text>
            </div>
            
            {isStudent ? (
              // Student view - show only their own results
              <div style={{ padding: '24px', textAlign: 'center' }}>
                <Title level={3}>Your Grade for this Course</Title>
                <div style={{ 
                  padding: '32px', 
                  backgroundColor: '#f5f5f5', 
                  borderRadius: '8px',
                  marginTop: '16px'
                }}>
                  {studentGrade ? (
                    <>
                      <Tag 
                        color={studentGrade.grade >= 85 ? 'green' : studentGrade.grade >= 70 ? 'blue' : studentGrade.grade >= 60 ? 'orange' : 'red'}
                        style={{ fontSize: '24px', padding: '12px 24px', borderRadius: '8px' }}
                      >
                        Grade: {studentGrade.grade}%
                      </Tag>
                      {studentGrade.feedback && (
                        <div style={{ marginTop: '16px' }}>
                          <Title level={5}>Feedback:</Title>
                          <Text style={{ fontStyle: 'italic' }}>{studentGrade.feedback}</Text>
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      <Tag 
                        color="default" 
                        style={{ fontSize: '24px', padding: '12px 24px', borderRadius: '8px' }}
                      >
                        Grade: Not Available
                      </Tag>
                      <div style={{ marginTop: '16px', color: '#666' }}>
                        <Text>Your grade has not been assigned yet</Text>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ) : (
              // Lecturer view - show all students with grade management
              <Table
                columns={[
                  {
                    title: 'Student ID',
                    dataIndex: 'studentId',
                    key: 'studentId',
                    width: 150,
                  },
                  {
                    title: 'Name',
                    key: 'name',
                    width: 280,
                    render: (_, record) => (
                      <Space>
                        <Avatar icon={<UserOutlined />} />
                        {`${record.firstName} ${record.lastName}`}
                      </Space>
                    ),
                  },
                  {
                    title: 'Current Grade',
                    dataIndex: 'grade',
                    key: 'grade',
                    width: 150,
                    align: 'center',
                    render: (grade) => (
                      grade ? (
                        <Tag color={grade >= 85 ? 'green' : grade >= 70 ? 'blue' : grade >= 60 ? 'orange' : 'red'}>
                          {grade}%
                        </Tag>
                      ) : (
                        <Tag color="default">No Grade</Tag>
                      )
                    ),
                  },
                  {
                    title: 'Action',
                    key: 'action',
                    width: 150,
                    align: 'center',
                    render: (_, record) => (
                      <Button
                        type="primary"
                        size="small"
                        icon={<EditOutlined />}
                        onClick={() => showGradeModal(record)}
                      >
                        {record.grade ? 'Edit Grade' : 'Add Grade'}
                      </Button>
                    ),
                  },
                ]}
                dataSource={students}
                rowKey="id"
                scroll={{ x: 730 }}
              />
            )}
          </TabPane>
        </Tabs>
      </Card>

      {/* Lecturer-only Modals */}
      {!isStudent && (
        <>
          {/* Upload Material Modal */}
          <Modal
            title="Upload Course Material"
            open={uploadModal}
            onOk={form.submit}
            onCancel={() => setUploadModal(false)}
            width={600}
          >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleUploadMaterial}
        >
          <Form.Item
            name="title"
            label="Material Title"
            rules={[{ required: true, message: 'Please enter material title' }]}
          >
            <Input placeholder="Enter material title" />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: 'Please enter description' }]}
          >
            <TextArea rows={4} placeholder="Enter material description" />
          </Form.Item>
          <Form.Item
            name="file"
            label="File"
            rules={[{ required: true, message: 'Please select a file' }]}
          >
            <Upload.Dragger
              beforeUpload={() => false} // Prevent auto upload
              maxCount={1}
              accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.xls,.xlsx"
            >
              <p className="ant-upload-drag-icon">
                <UploadOutlined />
              </p>
              <p className="ant-upload-text">Click or drag file to this area to upload</p>
              <p className="ant-upload-hint">
                Support for PDF, DOC, PPT, and other document formats (Max: 50MB)
              </p>
            </Upload.Dragger>
          </Form.Item>
        </Form>
      </Modal>

      {/* Edit Material Modal */}
      <Modal
        title="Edit Course Material"
        open={editModal}
        onOk={editForm.submit}
        onCancel={() => {
          setEditModal(false);
          setSelectedMaterial(null);
          editForm.resetFields();
        }}
        width={600}
      >
        <Form
          form={editForm}
          layout="vertical"
          onFinish={handleUpdateMaterial}
        >
          <Form.Item
            name="title"
            label="Material Title"
            rules={[{ required: true, message: 'Please enter material title' }]}
          >
            <Input placeholder="Enter material title" />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: 'Please enter description' }]}
          >
            <TextArea rows={4} placeholder="Enter material description" />
          </Form.Item>
          {selectedMaterial && (
            <div style={{ padding: '12px', backgroundColor: '#f5f5f5', borderRadius: '8px', marginBottom: '16px' }}>
              <Text strong>Current File: </Text>
              <Text>{selectedMaterial.fileName}</Text>
              <br />
              <Text type="secondary" style={{ fontSize: '12px' }}>
                To replace the file, upload a new material instead.
              </Text>
            </div>
          )}
        </Form>
      </Modal>

      {/* Create Assignment Modal */}
      <Modal
        title="Create Assignment"
        open={assignmentModal}
        onOk={assignmentForm.submit}
        onCancel={() => setAssignmentModal(false)}
        width={600}
      >
        <Form
          form={assignmentForm}
          layout="vertical"
          onFinish={handleCreateAssignment}
        >
          <Form.Item
            name="title"
            label="Assignment Title"
            rules={[{ required: true, message: 'Please enter assignment title' }]}
          >
            <Input placeholder="Enter assignment title" />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: 'Please enter description' }]}
          >
            <TextArea rows={4} placeholder="Enter assignment description" />
          </Form.Item>
          <Form.Item
            name="maxPoints"
            label="Maximum Points"
            rules={[
              { required: true, message: 'Please enter maximum points' },
              { 
                validator: (_, value) => {
                  if (value === null || value === undefined) {
                    return Promise.reject(new Error('Please enter maximum points'));
                  }
                  if (value <= 0) {
                    return Promise.reject(new Error('Maximum points must be greater than 0'));
                  }
                  return Promise.resolve();
                }
              }
            ]}
          >
            <InputNumber 
              min={1} 
              max={1000} 
              style={{ width: '100%' }}
              placeholder="Enter maximum points" 
            />
          </Form.Item>
          <Form.Item
            name="dueDate"
            label="Due Date"
            rules={[{ required: true, message: 'Please select due date' }]}
          >
            <DatePicker 
              showTime
              style={{ width: '100%' }}
              placeholder="Select due date and time"
            />
          </Form.Item>
          <Form.Item
            name="file"
            label="Assignment File (Optional)"
          >
            <Upload.Dragger
              beforeUpload={() => false}
              maxCount={1}
              accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.xls,.xlsx"
            >
              <p className="ant-upload-drag-icon">
                <UploadOutlined />
              </p>
              <p className="ant-upload-text">Click or drag file to this area to upload</p>
              <p className="ant-upload-hint">
                Support for PDF, DOC, PPT, and other document formats (Max: 50MB)
              </p>
            </Upload.Dragger>
          </Form.Item>
        </Form>
      </Modal>

      {/* Edit Assignment Modal */}
      <Modal
        title="Edit Assignment"
        open={editAssignmentModal}
        onOk={editAssignmentForm.submit}
        onCancel={() => {
          setEditAssignmentModal(false);
          setSelectedAssignment(null);
          editAssignmentForm.resetFields();
        }}
        width={600}
      >
        <Form
          form={editAssignmentForm}
          layout="vertical"
          onFinish={handleUpdateAssignment}
        >
          <Form.Item
            name="title"
            label="Assignment Title"
            rules={[{ required: true, message: 'Please enter assignment title' }]}
          >
            <Input placeholder="Enter assignment title" />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: 'Please enter description' }]}
          >
            <TextArea rows={4} placeholder="Enter assignment description" />
          </Form.Item>
          <Form.Item
            name="maxPoints"
            label="Maximum Points"
            rules={[
              { required: true, message: 'Please enter maximum points' },
              { 
                validator: (_, value) => {
                  if (value === null || value === undefined) {
                    return Promise.reject(new Error('Please enter maximum points'));
                  }
                  if (value <= 0) {
                    return Promise.reject(new Error('Maximum points must be greater than 0'));
                  }
                  return Promise.resolve();
                }
              }
            ]}
          >
            <InputNumber 
              min={1} 
              max={1000} 
              style={{ width: '100%' }}
              placeholder="Enter maximum points" 
            />
          </Form.Item>
          <Form.Item
            name="dueDate"
            label="Due Date"
            rules={[{ required: true, message: 'Please select due date' }]}
          >
            <DatePicker 
              showTime
              style={{ width: '100%' }}
              placeholder="Select due date and time"
            />
          </Form.Item>
          <Form.Item
            name="file"
            label="Assignment File (Optional)"
          >
            <Upload.Dragger
              beforeUpload={() => false}
              maxCount={1}
              accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.xls,.xlsx"
            >
              <p className="ant-upload-drag-icon">
                <UploadOutlined />
              </p>
              <p className="ant-upload-text">Click or drag file to this area to upload</p>
              <p className="ant-upload-hint">
                Replace existing file or upload new file (PDF, DOC, PPT, etc.)
              </p>
            </Upload.Dragger>
          </Form.Item>
          {selectedAssignment && selectedAssignment.fileName && (
            <div style={{ padding: '12px', backgroundColor: '#f5f5f5', borderRadius: '8px', marginBottom: '16px' }}>
              <Text strong>Current File: </Text>
              <Text>{selectedAssignment.fileName}</Text>
              <Button
                type="link"
                icon={<DownloadOutlined />}
                onClick={() => handleDownloadAssignmentFile(selectedAssignment)}
                style={{ marginLeft: '8px' }}
              >
                Download
              </Button>
            </div>
          )}
        </Form>
      </Modal>

      {/* Grade Modal */}
      <Modal
        title={`Update Grade - ${selectedStudent?.firstName} ${selectedStudent?.lastName}`}
        open={gradeModal}
        onOk={gradeForm.submit}
        onCancel={() => setGradeModal(false)}
      >
        <Form
          form={gradeForm}
          layout="vertical"
          onFinish={handleUpdateGrade}
        >
          <Form.Item
            name="grade"
            label="Grade (%)"
            rules={[
              { required: true, message: 'Please enter grade' },
              { 
                validator: (_, value) => {
                  if (value === null || value === undefined) {
                    return Promise.reject(new Error('Please enter grade'));
                  }
                  if (value < 0 || value > 100) {
                    return Promise.reject(new Error('Grade must be between 0 and 100'));
                  }
                  return Promise.resolve();
                }
              }
            ]}
          >
            <InputNumber 
              min={0} 
              max={100} 
              style={{ width: '100%' }}
              placeholder="Enter grade (0-100)" 
            />
          </Form.Item>
          <Form.Item
            name="feedback"
            label="Feedback"
          >
            <TextArea rows={4} placeholder="Enter feedback for student" />
          </Form.Item>
        </Form>
      </Modal>
        </>
      )}

      {/* Student Submission Modal */}
      {isStudent && (
        <Modal
          title={`${studentSubmissions[selectedAssignmentForSubmission?.id] ? 'Edit' : 'Submit'} Assignment: ${selectedAssignmentForSubmission?.title}`}
          open={submissionModal}
          onCancel={() => {
            setSubmissionModal(false);
            setSelectedAssignmentForSubmission(null);
            submissionForm.resetFields();
          }}
          width={600}
          footer={[
            <Button key="cancel" onClick={() => {
              setSubmissionModal(false);
              setSelectedAssignmentForSubmission(null);
              submissionForm.resetFields();
            }}>
              Cancel
            </Button>,
            <Button key="submit" type="primary" onClick={submissionForm.submit}>
              {studentSubmissions[selectedAssignmentForSubmission?.id] ? 'Update Submission' : 'Submit Assignment'}
            </Button>
          ]}
        >
          <Form
            form={submissionForm}
            layout="vertical"
            onFinish={handleCreateSubmission}
          >
            <Form.Item
              name="submissionText"
              label="Submission Text"
              rules={[{ required: true, message: 'Please enter your submission text' }]}
            >
              <TextArea 
                rows={6} 
                placeholder="Enter your assignment submission text here..."
              />
            </Form.Item>
            <Form.Item
              name="file"
              label="Upload File (Optional)"
            >
              <Upload.Dragger
                beforeUpload={() => false}
                maxCount={1}
                accept=".pdf,.doc,.docx,.txt,.zip,.rar"
              >
                <p className="ant-upload-drag-icon">
                  <UploadOutlined />
                </p>
                <p className="ant-upload-text">Click or drag file to upload</p>
                <p className="ant-upload-hint">
                  Support for PDF, DOC, TXT, ZIP files (Max: 50MB)
                </p>
              </Upload.Dragger>
            </Form.Item>
          </Form>
        </Modal>
      )}

      {/* Submission Grading Modal */}
      {!isStudent && (
        <Modal
          title={`Grade Submission - ${selectedSubmission?.studentName}`}
          open={submissionGradeModal}
          onOk={submissionGradeForm.submit}
          onCancel={() => {
            setSubmissionGradeModal(false);
            setSelectedSubmission(null);
            submissionGradeForm.resetFields();
          }}
          width={600}
        >
          <Form
            form={submissionGradeForm}
            layout="vertical"
            onFinish={handleGradeSubmission}
          >
            <div style={{ marginBottom: '16px', padding: '12px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
              <Text strong>Assignment: </Text>
              <Text>{selectedSubmission?.assignmentName}</Text>
              <br />
              <Text strong>Student: </Text>
              <Text>{selectedSubmission?.studentName}</Text>
              <br />
              <Text strong>Submitted: </Text>
              <Text>{selectedSubmission?.submittedAt ? new Date(selectedSubmission.submittedAt).toLocaleString() : 'N/A'}</Text>
            </div>
            
            {selectedSubmission?.submissionText && (
              <div style={{ marginBottom: '16px' }}>
                <Text strong>Submission Text:</Text>
                <div style={{ 
                  marginTop: '8px', 
                  padding: '12px', 
                  border: '1px solid #d9d9d9', 
                  borderRadius: '6px', 
                  backgroundColor: '#fafafa',
                  maxHeight: '150px',
                  overflowY: 'auto'
                }}>
                  <Text>{selectedSubmission.submissionText}</Text>
                </div>
              </div>
            )}
            
            {selectedSubmission?.fileName && (
              <div style={{ marginBottom: '16px' }}>
                <Text strong>Attached File: </Text>
                <Button
                  type="link"
                  icon={<DownloadOutlined />}
                  onClick={() => handleDownloadSubmission(selectedSubmission)}
                  style={{ padding: 0, marginLeft: '8px' }}
                >
                  {selectedSubmission.fileName}
                </Button>
              </div>
            )}
            
            <Form.Item
              name="grade"
              label="Grade (%)"
              rules={[
                { required: true, message: 'Please enter grade' },
                { 
                  validator: (_, value) => {
                    if (value === null || value === undefined) {
                      return Promise.reject(new Error('Please enter grade'));
                    }
                    if (value < 0 || value > 100) {
                      return Promise.reject(new Error('Grade must be between 0 and 100'));
                    }
                    return Promise.resolve();
                  }
                }
              ]}
            >
              <InputNumber 
                min={0} 
                max={100} 
                style={{ width: '100%' }}
                placeholder="Enter grade (0-100)" 
              />
            </Form.Item>
            <Form.Item
              name="feedback"
              label="Feedback"
            >
              <TextArea rows={4} placeholder="Enter feedback for student" />
            </Form.Item>
          </Form>
        </Modal>
      )}
    </div>
  );
};

export default CourseManagement;
