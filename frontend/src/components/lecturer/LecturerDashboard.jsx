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
  DatePicker,
  Select,
  Tag,
  Space,
  Typography,
  Tabs,
  message,
  Popconfirm,
  InputNumber,
  Badge
} from 'antd';
import {
  BookOutlined,
  UserOutlined,
  FileTextOutlined,
  CalendarOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  DownloadOutlined
} from '@ant-design/icons';
import lecturerService from '../../services/lecturerService';
import dayjs from 'dayjs';

const { Title } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;
const { TextArea } = Input;

const LecturerDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    totalCourses: 0,
    totalStudents: 0,
    pendingGrades: 0,
    upcomingClasses: 0
  });
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tableLoading, setTableLoading] = useState(false);
  
  // Modal states
  const [assignmentModalVisible, setAssignmentModalVisible] = useState(false);
  const [gradeModalVisible, setGradeModalVisible] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  
  // Forms
  const [assignmentForm] = Form.useForm();
  const [gradeForm] = Form.useForm();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [
        dashStats,
        coursesData,
        assignmentsData,
        submissionsData,
        studentsData
      ] = await Promise.all([
        lecturerService.getDashboardStats(),
        lecturerService.getCourses(),
        lecturerService.getAssignments(),
        lecturerService.getSubmissions(),
        lecturerService.getStudents()
      ]);
      
      setDashboardData(dashStats);
      setCourses(coursesData);
      setAssignments(assignmentsData);
      setSubmissions(submissionsData);
      setStudents(studentsData);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      message.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleAssignmentSubmit = async (values) => {
    try {
      setTableLoading(true);
      const assignmentData = {
        ...values,
        dueDate: values.dueDate.format('YYYY-MM-DD HH:mm:ss')
      };

      if (selectedAssignment) {
        await lecturerService.updateAssignment(selectedAssignment.id, assignmentData);
        message.success('Assignment updated successfully');
      } else {
        await lecturerService.createAssignment(assignmentData);
        message.success('Assignment created successfully');
      }

      setAssignmentModalVisible(false);
      assignmentForm.resetFields();
      setSelectedAssignment(null);
      await loadDashboardData();
    } catch (error) {
      console.error('Error saving assignment:', error);
      message.error('Failed to save assignment');
    } finally {
      setTableLoading(false);
    }
  };

  const handleGradeSubmit = async (values) => {
    try {
      setTableLoading(true);
      await lecturerService.gradeSubmission(selectedSubmission.id, values);
      message.success('Grade submitted successfully');
      setGradeModalVisible(false);
      gradeForm.resetFields();
      setSelectedSubmission(null);
      await loadDashboardData();
    } catch (error) {
      console.error('Error submitting grade:', error);
      message.error('Failed to submit grade');
    } finally {
      setTableLoading(false);
    }
  };

  const handleDeleteAssignment = async (assignmentId) => {
    try {
      setTableLoading(true);
      await lecturerService.deleteAssignment(assignmentId);
      message.success('Assignment deleted successfully');
      await loadDashboardData();
    } catch (error) {
      console.error('Error deleting assignment:', error);
      message.error('Failed to delete assignment');
    } finally {
      setTableLoading(false);
    }
  };

  const openAssignmentModal = (assignment = null) => {
    setSelectedAssignment(assignment);
    if (assignment) {
      assignmentForm.setFieldsValue({
        ...assignment,
        dueDate: dayjs(assignment.dueDate)
      });
    } else {
      assignmentForm.resetFields();
    }
    setAssignmentModalVisible(true);
  };

  const openGradeModal = (submission) => {
    setSelectedSubmission(submission);
    gradeForm.setFieldsValue({
      grade: submission.grade,
      feedback: submission.feedback
    });
    setGradeModalVisible(true);
  };

  const getSubmissionStatus = (submission) => {
    if (submission.grade !== null && submission.grade !== undefined) {
      return { status: 'Graded', color: 'green' };
    }
    if (submission.submittedAt) {
      return { status: 'Submitted', color: 'blue' };
    }
    return { status: 'Not Submitted', color: 'red' };
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
      title: 'Credits',
      dataIndex: 'credits',
      key: 'credits',
      render: (credits) => <Tag color="blue">{credits}</Tag>,
    },
    {
      title: 'Enrolled Students',
      dataIndex: 'enrolledCount',
      key: 'enrolledCount',
      render: (count) => count || 0,
    },
    {
      title: 'Capacity',
      dataIndex: 'capacity',
      key: 'capacity',
    },
    {
      title: 'Schedule',
      dataIndex: 'schedule',
      key: 'schedule',
      render: (schedule) => schedule || 'TBA',
    },
  ];

  const assignmentColumns = [
    {
      title: 'Assignment Title',
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
      title: 'Total Points',
      dataIndex: 'totalPoints',
      key: 'totalPoints',
      render: (points) => points || 100,
    },
    {
      title: 'Submissions',
      dataIndex: 'submissionCount',
      key: 'submissionCount',
      render: (count, record) => (
        <Badge count={count || 0} showZero>
          <Tag>{count || 0} / {record.enrolledCount || 0}</Tag>
        </Badge>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => openAssignmentModal(record)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this assignment?"
            onConfirm={() => handleDeleteAssignment(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              type="link"
              danger
              icon={<DeleteOutlined />}
            >
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const submissionColumns = [
    {
      title: 'Student',
      dataIndex: 'studentName',
      key: 'studentName',
    },
    {
      title: 'Assignment',
      dataIndex: 'assignmentTitle',
      key: 'assignmentTitle',
    },
    {
      title: 'Course',
      dataIndex: 'courseName',
      key: 'courseName',
    },
    {
      title: 'Submitted',
      dataIndex: 'submittedAt',
      key: 'submittedAt',
      render: (date) => date ? new Date(date).toLocaleDateString() : 'Not submitted',
    },
    {
      title: 'Grade',
      dataIndex: 'grade',
      key: 'grade',
      render: (grade) => grade !== null && grade !== undefined ? (
        <Tag color="green">{grade}%</Tag>
      ) : (
        <Tag color="orange">Pending</Tag>
      ),
    },
    {
      title: 'Status',
      key: 'status',
      render: (_, record) => {
        const { status, color } = getSubmissionStatus(record);
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          {record.submittedAt && (
            <Button
              type="primary"
              size="small"
              onClick={() => openGradeModal(record)}
            >
              Grade
            </Button>
          )}
          {record.submissionFile && (
            <Button
              size="small"
              icon={<DownloadOutlined />}
              onClick={() => window.open(record.submissionFile, '_blank')}
            >
              Download
            </Button>
          )}
        </Space>
      ),
    },
  ];

  const studentColumns = [
    {
      title: 'Name',
      key: 'name',
      render: (_, record) => `${record.firstName || ''} ${record.lastName || ''}`,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Student ID',
      dataIndex: 'studentId',
      key: 'studentId',
    },
    {
      title: 'Enrolled Courses',
      dataIndex: 'enrolledCourses',
      key: 'enrolledCourses',
      render: (courses) => courses?.length || 0,
    },
    {
      title: 'Average Grade',
      dataIndex: 'averageGrade',
      key: 'averageGrade',
      render: (grade) => grade ? `${grade}%` : 'N/A',
    },
  ];

  return (
    <div>
      <Title level={2} style={{ marginBottom: 24 }}>Lecturer Dashboard</Title>
      
      {/* Statistics Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="My Courses"
              value={dashboardData.totalCourses}
              prefix={<BookOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Students"
              value={dashboardData.totalStudents}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Pending Grades"
              value={dashboardData.pendingGrades}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#fa8c16' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Upcoming Classes"
              value={dashboardData.upcomingClasses}
              prefix={<CalendarOutlined />}
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
                showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
              }}
            />
          </TabPane>

          <TabPane tab="Assignments" key="assignments">
            <div style={{ marginBottom: 16 }}>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => openAssignmentModal()}
              >
                Create Assignment
              </Button>
            </div>
            <Table
              columns={assignmentColumns}
              dataSource={assignments}
              rowKey="id"
              loading={loading || tableLoading}
              pagination={{
                pageSize: 10,
                showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
              }}
            />
          </TabPane>

          <TabPane tab="Submissions & Grading" key="submissions">
            <Table
              columns={submissionColumns}
              dataSource={submissions}
              rowKey="id"
              loading={loading || tableLoading}
              pagination={{
                pageSize: 10,
                showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
              }}
            />
          </TabPane>

          <TabPane tab="My Students" key="students">
            <Table
              columns={studentColumns}
              dataSource={students}
              rowKey="id"
              loading={loading}
              pagination={{
                pageSize: 10,
                showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
              }}
            />
          </TabPane>
        </Tabs>
      </Card>

      {/* Assignment Modal */}
      <Modal
        title={selectedAssignment ? 'Edit Assignment' : 'Create New Assignment'}
        open={assignmentModalVisible}
        onCancel={() => {
          setAssignmentModalVisible(false);
          setSelectedAssignment(null);
          assignmentForm.resetFields();
        }}
        footer={null}
        destroyOnClose
        width={600}
      >
        <Form
          form={assignmentForm}
          layout="vertical"
          onFinish={handleAssignmentSubmit}
        >
          <Form.Item
            name="title"
            label="Assignment Title"
            rules={[{ required: true, message: 'Please enter assignment title' }]}
          >
            <Input placeholder="e.g., Midterm Project" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: 'Please enter assignment description' }]}
          >
            <TextArea rows={4} placeholder="Assignment description and requirements" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="courseId"
                label="Course"
                rules={[{ required: true, message: 'Please select a course' }]}
              >
                <Select placeholder="Select course">
                  {courses.map(course => (
                    <Option key={course.id} value={course.id}>
                      {course.courseCode} - {course.title}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="totalPoints"
                label="Total Points"
                rules={[{ required: true, message: 'Please enter total points' }]}
              >
                <InputNumber min={1} max={1000} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="dueDate"
            label="Due Date"
            rules={[{ required: true, message: 'Please select due date' }]}
          >
            <DatePicker
              showTime
              style={{ width: '100%' }}
              format="YYYY-MM-DD HH:mm"
            />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={tableLoading}>
                {selectedAssignment ? 'Update' : 'Create'}
              </Button>
              <Button onClick={() => {
                setAssignmentModalVisible(false);
                setSelectedAssignment(null);
                assignmentForm.resetFields();
              }}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Grade Modal */}
      <Modal
        title={`Grade Submission - ${selectedSubmission?.studentName}`}
        open={gradeModalVisible}
        onCancel={() => {
          setGradeModalVisible(false);
          setSelectedSubmission(null);
          gradeForm.resetFields();
        }}
        footer={null}
        destroyOnClose
      >
        <Form
          form={gradeForm}
          layout="vertical"
          onFinish={handleGradeSubmit}
        >
          <Form.Item
            name="grade"
            label="Grade (%)"
            rules={[{ required: true, message: 'Please enter a grade' }]}
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
            <TextArea
              rows={4}
              placeholder="Provide feedback to the student..."
            />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={tableLoading}>
                Submit Grade
              </Button>
              <Button onClick={() => {
                setGradeModalVisible(false);
                setSelectedSubmission(null);
                gradeForm.resetFields();
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

export default LecturerDashboard;
