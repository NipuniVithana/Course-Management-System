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
  Table,
  Badge
} from 'antd';
import {
  BookOutlined,
  SearchOutlined,
  PlusOutlined
} from '@ant-design/icons';
import lecturerService from '../../services/lecturerService';

const { Title } = Typography;
const { Option } = Select;

const AllCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [degreeFilter, setDegreeFilter] = useState('');
  const [registrationModal, setRegistrationModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [registering, setRegistering] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      setLoading(true);
      const data = await lecturerService.getAllAvailableCourses();
      setCourses(data);
    } catch (error) {
      console.error('Error loading courses:', error);
      message.error('Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterToCourse = async (course) => {
    setSelectedCourse(course);
    setRegistrationModal(true);
    form.resetFields();
  };

  const handleRegistrationSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      // Verify the course code
      if (values.courseCode !== selectedCourse.courseCode) {
        message.error('Incorrect course code. Please enter the correct course code to register.');
        return;
      }
      
      setRegistering(true);
      await lecturerService.registerToCourse(selectedCourse.id);
      message.success('Successfully registered to course');
      setRegistrationModal(false);
      loadCourses(); // Reload to update status
    } catch (error) {
      if (error.errorFields) {
        // Validation error
        return;
      }
      console.error('Error registering to course:', error);
      message.error('Failed to register to course');
    } finally {
      setRegistering(false);
    }
  };

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchText.toLowerCase()) ||
                         course.courseCode.toLowerCase().includes(searchText.toLowerCase());
    const matchesDegree = !degreeFilter || degreeFilter === 'all' || course.degreeName === degreeFilter;
    return matchesSearch && matchesDegree;
  });

  const degrees = [...new Set(courses.map(course => course.degreeName).filter(Boolean))];

  const columns = [
    {
      title: 'Course Code',
      dataIndex: 'courseCode',
      key: 'courseCode',
      width: 120,
      render: (code) => <Tag color="blue">{code}</Tag>,
    },
    {
      title: 'Course Title',
      dataIndex: 'title',
      key: 'title',
      render: (title) => (
        <div>
          <strong>{title}</strong>
        </div>
      ),
    },
    {
      title: 'Department',
      dataIndex: 'department',
      key: 'department',
      width: 150,
    },
    {
      title: 'Degree',
      dataIndex: 'degreeName',
      key: 'degreeName',
      width: 150,
      render: (degree) => degree || '-',
    },
    {
      title: 'Credits',
      dataIndex: 'credits',
      key: 'credits',
      width: 80,
      align: 'center',
      render: (credits) => <Tag color="green">{credits}</Tag>,
    },
    {
      title: 'Capacity',
      dataIndex: 'capacity',
      key: 'capacity',
      width: 100,
      align: 'center',
      render: (capacity) => <Badge count={capacity} color="orange" />,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => (
        <Tag color={status === 'ACTIVE' ? 'green' : 'red'}>
          {status}
        </Tag>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      width: 120,
      render: (_, record) => {
        if (record.isAssigned) {
          return (
            <Button type="primary" size="small" style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}>
              My Course
            </Button>
          );
        }
        if (record.lecturerName) {
          return (
            <Button disabled size="small">
              Assigned
            </Button>
          );
        }
        return (
          <Button
            type="primary"
            size="small"
            icon={<PlusOutlined />}
            onClick={() => handleRegisterToCourse(record)}
            disabled={record.status !== 'ACTIVE'}
          >
            Register
          </Button>
        );
      },
    },
  ];

  return (
    <div style={{ padding: '24px', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <div style={{ marginBottom: 24 }}>
        <Title level={3} style={{ margin: 0, color: '#1890ff' }}>
          <BookOutlined /> Course Overview
        </Title>
        <Typography.Text type="secondary">
          Browse and register for available courses
        </Typography.Text>
      </div>

      <Card style={{ marginBottom: 24 }}>
        <Row gutter={16} align="middle" style={{ marginBottom: 16 }}>
          <Col flex="auto">
            <Row gutter={16}>
              <Col span={12}>
                <Input
                  size="large"
                  placeholder="Search by course name or code"
                  prefix={<SearchOutlined />}
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                />
              </Col>
              <Col span={8}>
                <Select
                  size="large"
                  placeholder="Filter by degree"
                  value={degreeFilter}
                  onChange={setDegreeFilter}
                  style={{ width: '100%' }}
                >
                  <Option value="">All Degrees</Option>
                  {degrees.map(degree => (
                    <Option key={degree} value={degree}>{degree}</Option>
                  ))}
                </Select>
              </Col>
            </Row>
          </Col>
          <Col>
            <div style={{ textAlign: 'right' }}>
              <Typography.Text strong>{filteredCourses.length}</Typography.Text>
              <Typography.Text type="secondary"> courses available</Typography.Text>
            </div>
          </Col>
        </Row>
      </Card>

      {loading ? (
        <Card>
          <Table
            columns={columns}
            dataSource={[]}
            rowKey="id"
            loading={true}
            pagination={false}
          />
        </Card>
      ) : (
        <Card>
          <Table
            columns={columns}
            dataSource={filteredCourses}
            rowKey="id"
            loading={loading}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total) => `Total ${total} courses`
            }}
            locale={{
              emptyText: (
                <div style={{ textAlign: 'center', padding: '60px 0' }}>
                  <BookOutlined style={{ fontSize: 48, color: '#d9d9d9', marginBottom: 16 }} />
                  <Typography.Title level={4} type="secondary">No courses found</Typography.Title>
                  <Typography.Text type="secondary">
                    Try adjusting your search or filter criteria
                  </Typography.Text>
                </div>
              )
            }}
          />
        </Card>
      )}
      
      {/* Registration Modal */}
      <Modal
        title="Register for Course"
        open={registrationModal}
        onOk={handleRegistrationSubmit}
        onCancel={() => setRegistrationModal(false)}
        confirmLoading={registering}
        width={600}
      >
        {selectedCourse && (
          <div>
            <div style={{ marginBottom: 20, padding: 16, backgroundColor: '#f5f5f5', borderRadius: 8 }}>
              <Title level={5} style={{ margin: 0, marginBottom: 8 }}>
                {selectedCourse.title}
              </Title>
              <Space>
                <Tag color="blue">{selectedCourse.courseCode}</Tag>
                <Tag color="green">{selectedCourse.credits} Credits</Tag>
                <Tag color="orange">{selectedCourse.department}</Tag>
              </Space>
              {selectedCourse.degreeName && (
                <div style={{ marginTop: 8 }}>
                  <Typography.Text type="secondary">
                    <BookOutlined /> {selectedCourse.degreeName}
                  </Typography.Text>
                </div>
              )}
            </div>
            
            <Form
              form={form}
              layout="vertical"
              initialValues={{
                courseCode: ''
              }}
            >
              <Form.Item
                name="courseCode"
                label="Course Registration Code"
                rules={[
                  { required: true, message: 'Please enter the course code to register' },
                  { min: 3, message: 'Course code must be at least 3 characters' }
                ]}
              >
                <Input
                  size="large"
                />
              </Form.Item>
            </Form>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AllCourses;
