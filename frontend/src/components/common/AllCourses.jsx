import React, { useState, useEffect } from 'react';
import {
  Card,
  Button,
  Typography,
  message,
  Tag,
  Row,
  Col,
  Select,
  Input,
  Space,
  Modal,
  Form,
  Table
} from 'antd';
import {
  BookOutlined,
  SearchOutlined,
  PlusOutlined
} from '@ant-design/icons';
import lecturerService from '../../services/lecturerService';
import studentService from '../../services/studentService';

const { Title } = Typography;
const { Option } = Select;

const AllCourses = ({ userRole = 'LECTURER' }) => {
  const [courses, setCourses] = useState([]);
  const [degrees, setDegrees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [degreeFilter, setDegreeFilter] = useState('');
  const [actionModal, setActionModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [form] = Form.useForm();

  // Configure based on user role
  const isStudent = userRole === 'STUDENT';
  const actionText = isStudent ? 'enroll' : 'register';
  const actionTextCapitalized = isStudent ? 'Enroll' : 'Register';
  const service = isStudent ? studentService : lecturerService;

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [coursesData, degreesData] = await Promise.all([
          service.getAllAvailableCourses(),
          service.getAllDegrees()
        ]);
        console.log(`${userRole} courses data:`, coursesData);
        console.log(`${userRole} degrees data:`, degreesData);
        setCourses(coursesData);
        setDegrees(degreesData);
      } catch (error) {
        console.error('Error loading data:', error);
        message.error('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [userRole, service]);

  const loadCourses = async () => {
    try {
      setLoading(true);
      const data = await service.getAllAvailableCourses();
      console.log(`${userRole} courses data:`, data);
      console.log(`${userRole} sample course:`, data[0]);
      setCourses(data);
    } catch (error) {
      console.error('Error loading courses:', error);
      message.error('Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  const handleCourseAction = async (course) => {
    setSelectedCourse(course);
    setActionModal(true);
    form.resetFields();
  };

  const handleActionSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      // Verify the course code
      if (values.courseCode !== selectedCourse.courseCode) {
        message.error(`Incorrect course code. Please enter the correct course code to ${actionText}.`);
        return;
      }
      
      setProcessing(true);
      
      if (isStudent) {
        await studentService.enrollToCourse(selectedCourse.id);
        message.success('Successfully enrolled in course');
      } else {
        await lecturerService.registerToCourse(selectedCourse.id);
        message.success('Successfully registered to course');
      }
      
      setActionModal(false);
      loadCourses(); // Reload courses to update status
    } catch (error) {
      if (error.errorFields) {
        // Validation error
        return;
      }
      console.error(`Error ${actionText}ing ${isStudent ? 'in' : 'to'} course:`, error);
      message.error(`Failed to ${actionText} ${isStudent ? 'in' : 'to'} course`);
    } finally {
      setProcessing(false);
    }
  };

  const handleUnregister = async (course) => {
    Modal.confirm({
      title: 'Confirm Unregistration',
      content: `Are you sure you want to unregister from "${course.title}" (${course.courseCode})?`,
      okText: 'Yes, Unregister',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          await lecturerService.unregisterFromCourse(course.id);
          message.success('Successfully unregistered from course');
          loadCourses(); // Reload courses to update status
        } catch (error) {
          console.error('Error unregistering from course:', error);
          message.error('Failed to unregister from course');
        }
      }
    });
  };

  // Helper function to get degree name from course data
  const getDegreeName = (course) => {
    // For lecturer data (Map with degreeName field)
    if (course.degreeName !== undefined) {
      return course.degreeName;
    }
    // For student data (Course entity with degree object)
    if (course.degree && course.degree.name) {
      return course.degree.name;
    }
    return null;
  };

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchText.toLowerCase()) ||
                         course.courseCode.toLowerCase().includes(searchText.toLowerCase());
    const degreeName = getDegreeName(course);
    const matchesDegree = !degreeFilter || degreeName === degreeFilter;
    return matchesSearch && matchesDegree;
  });

  const columns = [
    {
      title: 'Course Code',
      dataIndex: 'courseCode',
      key: 'courseCode',
      width: 120,
      render: (code) => <Tag color="blue">{code}</Tag>
    },
    {
      title: 'Course Title',
      dataIndex: 'title',
      key: 'title',
      width: 300,
      ellipsis: true,
      render: (title) => <span style={{ fontWeight: 'bold' }}>{title}</span>
    },
    {
      title: 'Department',
      dataIndex: 'department',
      key: 'department',
      width: 160,
      render: (department) => (
        <Tag color="purple">{department || 'Computer Science'}</Tag>
      )
    },
    {
      title: 'Credits',
      dataIndex: 'credits',
      key: 'credits',
      width: 80,
      align: 'center',
      render: (credits) => <Tag color="green">{credits}</Tag>
    },
    {
      title: 'Action',
      key: 'action',
      width: 180,
      align: 'center',
      render: (_, record) => {
        
        // For lecturers, check if already registered
        if (!isStudent && record.isRegistered) {
          return (
            <Button.Group>
              <Button
                size="small"
                type="primary"
                disabled
              >
                Assigned
              </Button>
              <Button
                size="small"
                danger
                onClick={() => handleUnregister(record)}
              >
                Unregister
              </Button>
            </Button.Group>
          );
        }
        
        // For students, check if already enrolled
        if (isStudent && record.isEnrolled) {
          return (
            <div style={{ 
              display: 'flex', 
              justifyContent: 'flex-start',
              width: '140px'
            }}>
              <div style={{ width: '70px' }}></div> 
              <Button
                size="small"
                disabled
                style={{ 
                  color: '#52c41a', 
                  borderColor: '#52c41a',
                  borderRadius: '6px'
                }}
              >
                Enrolled
              </Button>
            </div>
          );
        }
        
        return (
          <div style={{ 
            display: 'flex', 
            justifyContent: 'flex-start',
            width: '140px'
          }}>
            <div style={{ width: '70px' }}></div> 
            <Button
              type="primary"
              size="small"
              icon={<PlusOutlined />}
              onClick={() => handleCourseAction(record)}
              disabled={record.status !== 'ACTIVE'}
              style={{ 
                borderRadius: '6px'
              }}
            >
              {actionTextCapitalized}
            </Button>
          </div>
        );
      }
    }
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <div style={{ marginBottom: '24px' }}>
          <Title level={2} style={{ margin: 0, color: '#1890ff' }}>
            <BookOutlined style={{ marginRight: '8px' }} />
            All Courses
          </Title>
          <p style={{ margin: '8px 0 0 0', color: '#666' }}>
            Browse and {actionText} {isStudent ? 'in' : 'for'} available courses
          </p>
        </div>

        {/* Search and Filter Controls */}
        <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
          <Col xs={24} sm={12} md={8}>
            <Input
              placeholder="Search courses..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
            />
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Select
              placeholder="Filter by degree"
              style={{ width: '100%' }}
              value={degreeFilter}
              onChange={setDegreeFilter}
              allowClear
            >
              <Option value="">All Degrees</Option>
              {degrees.map(degree => (
                <Option key={degree.id} value={degree.name}>{degree.name}</Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={24} md={8}>
            <Space>
              <span style={{ color: '#666' }}>
                Showing {filteredCourses.length} of {courses.length} courses
              </span>
            </Space>
          </Col>
        </Row>

        {/* Courses Table */}
        <Table
          columns={columns}
          dataSource={filteredCourses}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showQuickJumper: true,
            showTotal: (total, range) => 
              `${range[0]}-${range[1]} of ${total} courses`
          }}
          scroll={{ x: 920 }}
        />
      </Card>

      {/* Action Modal */}
      <Modal
        title={
          <Space>
            <PlusOutlined style={{ color: '#1890ff' }} />
            <span>{actionTextCapitalized} {isStudent ? 'in' : 'for'} Course</span>
          </Space>
        }
        open={actionModal}
        onCancel={() => {
          setActionModal(false);
          setSelectedCourse(null);
          form.resetFields();
        }}
        footer={null}
        destroyOnClose
      >
        {selectedCourse && (
          <div>
            <div style={{ marginBottom: '20px', padding: '16px', background: '#f5f5f5', borderRadius: '6px' }}>
              <Row gutter={[16, 8]}>
                <Col span={8}>
                  <strong>Course Code:</strong>
                </Col>
                <Col span={16}>
                  <Tag color="blue">{selectedCourse.courseCode}</Tag>
                </Col>
                <Col span={8}>
                  <strong>Course Title:</strong>
                </Col>
                <Col span={16}>
                  {selectedCourse.title}
                </Col>
                <Col span={8}>
                  <strong>Credits:</strong>
                </Col>
                <Col span={16}>
                  <Tag color="green">{selectedCourse.credits}</Tag>
                </Col>
              </Row>
            </div>

            <Form
              form={form}
              layout="vertical"
              onFinish={handleActionSubmit}
            >
              <Form.Item
                name="courseCode"
                label={`Enter Course Code to Confirm ${actionTextCapitalized}ment`}
                rules={[
                  { required: true, message: 'Please enter the course code' }
                ]}
              >
                <Input 
                  autoComplete="off"
                />
              </Form.Item>

              <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
                <Space>
                  <Button onClick={() => {
                    setActionModal(false);
                    setSelectedCourse(null);
                    form.resetFields();
                  }}>
                    Cancel
                  </Button>
                  <Button 
                    type="primary" 
                    htmlType="submit"
                    loading={processing}
                    icon={<PlusOutlined />}
                  >
                    {actionTextCapitalized} {isStudent ? 'in' : 'for'} Course
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AllCourses;
