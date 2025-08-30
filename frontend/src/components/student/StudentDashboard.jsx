import React, { useState, useEffect } from 'react';
import {
  Row,
  Col,
  Card,
  Statistic,
  Table,
  Button,
  Modal,
  Form,
  Input,
  Upload,
  Tag,
  Space,
  Typography,
  Tabs,
  message,
  Progress,
  Divider,
  List
} from 'antd';
import {
  BookOutlined,
  FileTextOutlined,
  TrophyOutlined,
  UploadOutlined,
  DownloadOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const StudentDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    enrolledCourses: 0,
    pendingAssignments: 0,
    averageGrade: 0,
    completedCourses: 0
  });
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [grades, setGrades] = useState([]);
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(true);
  const [uploadModalVisible, setUploadModalVisible] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  
  const [uploadForm] = Form.useForm();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      // Mock data for now
      setDashboardData({
        enrolledCourses: 4,
        pendingAssignments: 3,
        averageGrade: 85,
        completedCourses: 2
      });
      setCourses([
        { id: 1, courseCode: 'CS101', title: 'Introduction to Computer Science', lecturerName: 'Dr. Smith', credits: 3, schedule: 'MWF 10:00-11:00', progress: 75 },
        { id: 2, courseCode: 'MATH201', title: 'Calculus II', lecturerName: 'Prof. Johnson', credits: 4, schedule: 'TTH 2:00-3:30', progress: 60 }
      ]);
      setAssignments([
        { id: 1, title: 'Programming Assignment 1', courseName: 'CS101', dueDate: '2025-09-15', submissionStatus: 'PENDING', grade: null },
        { id: 2, title: 'Derivative Problems', courseName: 'MATH201', dueDate: '2025-09-10', submissionStatus: 'SUBMITTED', grade: 88 }
      ]);
      setGrades([
        { id: 1, courseName: 'CS101', itemName: 'Midterm Exam', grade: 92, weight: 30, gradedDate: '2025-08-20', feedback: 'Excellent work!' },
        { id: 2, courseName: 'MATH201', itemName: 'Quiz 1', grade: 78, weight: 10, gradedDate: '2025-08-15', feedback: 'Good effort, review derivatives' }
      ]);
      setProfile({
        firstName: 'John',
        lastName: 'Doe',
        email: 'student@university.edu',
        studentId: 'STU001',
        phone: '+1-555-0123',
        createdAt: '2024-09-01'
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      message.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitAssignment = async (values) => {
    try {
      const formData = new FormData();
      formData.append('assignmentId', selectedAssignment.id);
      formData.append('submissionText', values.submissionText || '');
      
      if (values.file && values.file.fileList.length > 0) {
        formData.append('file', values.file.fileList[0].originFileObj);
      }

      // Mock submission
      message.success('Assignment submitted successfully');
      setUploadModalVisible(false);
      uploadForm.resetFields();
      setSelectedAssignment(null);
      await loadDashboardData();
    } catch (error) {
      console.error('Error submitting assignment:', error);
      message.error('Failed to submit assignment');
    }
  };

  const openSubmissionModal = (assignment) => {
    setSelectedAssignment(assignment);
    setUploadModalVisible(true);
  };

  const getGradeColor = (grade) => {
    if (grade >= 90) return 'green';
    if (grade >= 80) return 'blue';
    if (grade >= 70) return 'orange';
    if (grade >= 60) return 'yellow';
    return 'red';
  };

  const getAssignmentStatus = (assignment) => {
    const now = new Date();
    const dueDate = new Date(assignment.dueDate);
    
    if (assignment.submissionStatus === 'SUBMITTED') {
      return { status: 'Submitted', color: 'green', icon: <CheckCircleOutlined /> };
    }
    
    if (now > dueDate) {
      return { status: 'Overdue', color: 'red', icon: <ClockCircleOutlined /> };
    }
    
    return { status: 'Pending', color: 'orange', icon: <ClockCircleOutlined /> };
  };

  // Table columns
  const courseColumns = [
    {
      title: 'Course Code',
      dataIndex: 'courseCode',
      key: 'courseCode',
    },
    {
      title: 'Course Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Lecturer',
      dataIndex: 'lecturerName',
      key: 'lecturerName',
    },
    {
      title: 'Credits',
      dataIndex: 'credits',
      key: 'credits',
      render: (credits) => <Tag color="blue">{credits}</Tag>,
    },
    {
      title: 'Schedule',
      dataIndex: 'schedule',
      key: 'schedule',
      render: (schedule) => schedule || 'TBA',
    },
    {
      title: 'Progress',
      dataIndex: 'progress',
      key: 'progress',
      render: (progress) => (
        <Progress 
          percent={progress || 0} 
          size="small" 
          status={progress === 100 ? 'success' : 'active'}
        />
      ),
    },
  ];

  const assignmentColumns = [
    {
      title: 'Assignment',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Course',
      dataIndex: 'courseName',
      key: 'courseName',
    },
    {
      title: 'Due Date',
      dataIndex: 'dueDate',
      key: 'dueDate',
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Status',
      key: 'status',
      render: (_, record) => {
        const { status, color, icon } = getAssignmentStatus(record);
        return (
          <Tag color={color} icon={icon}>
            {status}
          </Tag>
        );
      },
    },
    {
      title: 'Grade',
      dataIndex: 'grade',
      key: 'grade',
      render: (grade) => grade ? (
        <Tag color={getGradeColor(grade)}>{grade}%</Tag>
      ) : (
        <Text type="secondary">Not graded</Text>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => {
        const { status } = getAssignmentStatus(record);
        return (
          <Space>
            {status !== 'Submitted' && (
              <Button
                type="primary"
                size="small"
                icon={<UploadOutlined />}
                onClick={() => openSubmissionModal(record)}
              >
                Submit
              </Button>
            )}
            {record.materials && (
              <Button
                size="small"
                icon={<DownloadOutlined />}
                onClick={() => window.open(record.materials, '_blank')}
              >
                Download
              </Button>
            )}
          </Space>
        );
      },
    },
  ];

  const gradeColumns = [
    {
      title: 'Course',
      dataIndex: 'courseName',
      key: 'courseName',
    },
    {
      title: 'Assignment/Exam',
      dataIndex: 'itemName',
      key: 'itemName',
    },
    {
      title: 'Grade',
      dataIndex: 'grade',
      key: 'grade',
      render: (grade) => (
        <Tag color={getGradeColor(grade)} style={{ fontSize: '14px', padding: '4px 8px' }}>
          {grade}%
        </Tag>
      ),
    },
    {
      title: 'Weight',
      dataIndex: 'weight',
      key: 'weight',
      render: (weight) => `${weight}%`,
    },
    {
      title: 'Date',
      dataIndex: 'gradedDate',
      key: 'gradedDate',
      render: (date) => date ? new Date(date).toLocaleDateString() : 'N/A',
    },
    {
      title: 'Feedback',
      dataIndex: 'feedback',
      key: 'feedback',
      render: (feedback) => feedback || 'No feedback',
    },
  ];

  return (
    <div>
      <Title level={2} style={{ marginBottom: 24 }}>Student Dashboard</Title>
      
      {/* Statistics Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Enrolled Courses"
              value={dashboardData.enrolledCourses}
              prefix={<BookOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Pending Assignments"
              value={dashboardData.pendingAssignments}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#fa8c16' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Average Grade"
              value={dashboardData.averageGrade}
              suffix="%"
              prefix={<TrophyOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Completed Courses"
              value={dashboardData.completedCourses}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Main Content Tabs */}
      <Card>
        <Tabs defaultActiveKey="courses">
          <TabPane tab="My Courses" key="courses">
            <Table
              columns={courseColumns}
              dataSource={courses}
              rowKey="id"
              loading={loading}
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
              }}
            />
          </TabPane>

          <TabPane tab="Assignments" key="assignments">
            <Table
              columns={assignmentColumns}
              dataSource={assignments}
              rowKey="id"
              loading={loading}
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
              }}
            />
          </TabPane>

          <TabPane tab="Grades" key="grades">
            <Table
              columns={gradeColumns}
              dataSource={grades}
              rowKey="id"
              loading={loading}
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
              }}
            />
          </TabPane>

          <TabPane tab="Profile" key="profile">
            <Row gutter={24}>
              <Col xs={24} lg={12}>
                <Card title="Personal Information" style={{ marginBottom: 16 }}>
                  <List>
                    <List.Item>
                      <List.Item.Meta
                        title="Full Name"
                        description={`${profile.firstName || ''} ${profile.lastName || ''}`}
                      />
                    </List.Item>
                    <List.Item>
                      <List.Item.Meta
                        title="Email"
                        description={profile.email || 'N/A'}
                      />
                    </List.Item>
                    <List.Item>
                      <List.Item.Meta
                        title="Student ID"
                        description={profile.studentId || 'N/A'}
                      />
                    </List.Item>
                    <List.Item>
                      <List.Item.Meta
                        title="Phone"
                        description={profile.phone || 'N/A'}
                      />
                    </List.Item>
                    <List.Item>
                      <List.Item.Meta
                        title="Enrollment Date"
                        description={profile.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'N/A'}
                      />
                    </List.Item>
                  </List>
                </Card>
              </Col>
              <Col xs={24} lg={12}>
                <Card title="Academic Summary" style={{ marginBottom: 16 }}>
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <div>
                      <Text strong>Overall GPA:</Text>
                      <div style={{ marginTop: 8 }}>
                        <Progress
                          percent={(dashboardData.averageGrade / 100) * 100}
                          format={() => `${dashboardData.averageGrade}%`}
                          strokeColor={getGradeColor(dashboardData.averageGrade)}
                        />
                      </div>
                    </div>
                    <Divider />
                    <div>
                      <Text strong>Course Progress:</Text>
                      <div style={{ marginTop: 8 }}>
                        <Progress
                          percent={dashboardData.completedCourses > 0 ? 
                            (dashboardData.completedCourses / (dashboardData.completedCourses + dashboardData.enrolledCourses)) * 100 : 0}
                          format={() => `${dashboardData.completedCourses} completed`}
                        />
                      </div>
                    </div>
                  </Space>
                </Card>
              </Col>
            </Row>
          </TabPane>
        </Tabs>
      </Card>

      {/* Assignment Submission Modal */}
      <Modal
        title={`Submit Assignment: ${selectedAssignment?.title}`}
        open={uploadModalVisible}
        onCancel={() => {
          setUploadModalVisible(false);
          setSelectedAssignment(null);
          uploadForm.resetFields();
        }}
        footer={null}
        destroyOnClose
      >
        <Form
          form={uploadForm}
          layout="vertical"
          onFinish={handleSubmitAssignment}
        >
          <Form.Item
            name="submissionText"
            label="Submission Text (Optional)"
          >
            <Input.TextArea
              rows={4}
              placeholder="Enter any text submission or comments..."
            />
          </Form.Item>

          <Form.Item
            name="file"
            label="Upload File (Optional)"
          >
            <Upload
              beforeUpload={() => false}
              maxCount={1}
              accept=".pdf,.doc,.docx,.txt,.zip"
            >
              <Button icon={<UploadOutlined />}>Click to Upload</Button>
            </Upload>
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                Submit Assignment
              </Button>
              <Button onClick={() => {
                setUploadModalVisible(false);
                setSelectedAssignment(null);
                uploadForm.resetFields();
              }}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default StudentDashboard;