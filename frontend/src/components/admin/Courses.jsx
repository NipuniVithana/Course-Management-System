import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Typography,
  message,
  Popconfirm,
  Tag,
  Input,
  Select,
  Row,
  Col,
  Modal,
  Form,
  InputNumber
} from 'antd';
import {
  BookOutlined,
  EditOutlined,
  DeleteOutlined,
  UserOutlined,
  TeamOutlined,
  PlusOutlined
} from '@ant-design/icons';
import adminService from '../../services/adminService';

const { Title } = Typography;
const { Search } = Input;
const { Option } = Select;
const { TextArea } = Input;

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [lecturers, setLecturers] = useState([]);
  const [degrees, setDegrees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [selectedDegree, setSelectedDegree] = useState('all');
  const [assignModalVisible, setAssignModalVisible] = useState(false);
  const [addCourseModalVisible, setAddCourseModalVisible] = useState(false);
  const [editCourseModalVisible, setEditCourseModalVisible] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [editingCourse, setEditingCourse] = useState(null);
  const [assignForm] = Form.useForm();
  const [addCourseForm] = Form.useForm();
  const [editCourseForm] = Form.useForm();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [coursesData, lecturersData, degreesData] = await Promise.all([
        adminService.getAllCourses(),
        adminService.getAllLecturers(),
        adminService.getAllDegrees()
      ]);
      console.log('Courses data:', coursesData); // Debug log
      setCourses(coursesData);
      setLecturers(lecturersData);
      setDegrees(degreesData);
    } catch (error) {
      console.error('Error loading data:', error);
      message.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (courseId) => {
    try {
      // Find the course details before deleting
      const course = courses.find(c => c.id === courseId);
      
      await adminService.deleteCourse(courseId);
      message.success('Course deleted successfully');
      
      // Track activity
      if (window.addAdminActivity && course) {
        window.addAdminActivity(
          'Course Deleted',
          `Course "${course.title}" (${course.courseCode}) was deleted`,
          'course'
        );
      }
      
      loadData();
    } catch (error) {
      console.error('Error deleting course:', error);
      message.error('Failed to delete course');
    }
  };

  const handleAssignLecturer = (course) => {
    setSelectedCourse(course);
    assignForm.setFieldsValue({
      lecturerId: course.lecturerId
    });
    setAssignModalVisible(true);
  };

  const handleAssignSubmit = async (values) => {
    try {
      await adminService.assignCourseToLecturer(selectedCourse.id, values.lecturerId);
      message.success('Lecturer assigned successfully');
      setAssignModalVisible(false);
      assignForm.resetFields();
      setSelectedCourse(null);
      loadData();
    } catch (error) {
      console.error('Error assigning lecturer:', error);
      message.error('Failed to assign lecturer');
    }
  };

  const handleAddCourse = () => {
    addCourseForm.resetFields();
    setAddCourseModalVisible(true);
  };

  const handleAddCourseSubmit = async (values) => {
    try {
      setLoading(true);
      
      // Map frontend field names to backend field names
      const courseData = {
        courseCode: values.courseCode,
        courseName: values.title,  // Frontend uses 'title', backend expects 'courseName'
        description: values.description,
        credits: parseInt(values.credits),
        degreeId: parseInt(values.degreeId),
        department: values.department,
        capacity: values.capacity ? parseInt(values.capacity) : null,
        lecturerId: values.lecturerId || null
      };
      
      await adminService.createCourse(courseData);
      message.success('Course created successfully');
      
      // Track activity
      if (window.addAdminActivity) {
        window.addAdminActivity(
          'Course Created',
          `New course "${values.title}" (${values.courseCode}) was created`,
          'course'
        );
      }
      
      setAddCourseModalVisible(false);
      addCourseForm.resetFields();
      await loadData();
    } catch (error) {
      console.error('Error creating course:', error);
      message.error('Failed to create course');
    } finally {
      setLoading(false);
    }
  };

  const handleEditCourse = (course) => {
    setEditingCourse(course);
    editCourseForm.setFieldsValue({
      courseCode: course.courseCode,
      title: course.title,
      description: course.description,
      credits: course.credits,
      degreeId: course.degree?.id,
      department: course.department,
      capacity: course.capacity,
      lecturerId: course.lecturerId
    });
    setEditCourseModalVisible(true);
  };

  const handleEditCourseSubmit = async (values) => {
    try {
      setLoading(true);
      
      // Map frontend field names to backend field names
      const courseData = {
        courseCode: values.courseCode,
        courseName: values.title,  // Frontend uses 'title', backend expects 'courseName'
        description: values.description,
        credits: parseInt(values.credits),
        degreeId: parseInt(values.degreeId),
        department: values.department,
        capacity: values.capacity ? parseInt(values.capacity) : null,
        lecturerId: values.lecturerId || null
      };
      
      await adminService.updateCourse(editingCourse.id, courseData);
      message.success('Course updated successfully');
      
      // Track activity
      if (window.addAdminActivity) {
        window.addAdminActivity(
          'Course Updated',
          `Course "${values.title}" (${values.courseCode}) was updated`,
          'course'
        );
      }
      
      setEditCourseModalVisible(false);
      editCourseForm.resetFields();
      setEditingCourse(null);
      await loadData();
    } catch (error) {
      console.error('Error updating course:', error);
      message.error('Failed to update course');
    } finally {
      setLoading(false);
    }
  };

  const filteredCourses = courses.filter(course => {
    // Text search filter
    const textMatch = (
      course.title?.toLowerCase().includes(searchText.toLowerCase()) ||
      course.courseCode?.toLowerCase().includes(searchText.toLowerCase()) ||
      course.description?.toLowerCase().includes(searchText.toLowerCase()) ||
      course.degree?.name?.toLowerCase().includes(searchText.toLowerCase())
    );

    // Degree filter
    const degreeMatch = selectedDegree === 'all' || 
      (course.degree && course.degree.id.toString() === selectedDegree);

    return textMatch && degreeMatch;
  });

  const columns = [
    {
      title: 'Course Code',
      dataIndex: 'courseCode',
      key: 'courseCode',
      width: 120,
      sorter: (a, b) => (a.courseCode || '').localeCompare(b.courseCode || ''),
      fixed: 'left',
    },
    {
      title: 'Course Name',
      dataIndex: 'title',
      key: 'title',
      width: 200,
      sorter: (a, b) => (a.title || '').localeCompare(b.title || ''),
    },
    {
      title: 'Credits',
      dataIndex: 'credits',
      key: 'credits',
      width: 80,
      align: 'center',
      sorter: (a, b) => (a.credits || 0) - (b.credits || 0),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      width: 250,
      ellipsis: true,
      render: (text) => text || 'N/A',
    },
    {
      title: 'Assigned Lecturer',
      key: 'lecturer',
      width: 180,
      render: (_, record) => {
        if (record.lecturerId) {
          const lecturer = lecturers.find(l => l.id === record.lecturerId);
          return lecturer ? 
            <Tag color="blue" icon={<UserOutlined />}>
              {`${lecturer.firstName} ${lecturer.lastName}`}
            </Tag> : 
            <Tag color="orange">Unknown Lecturer</Tag>;
        }
        return <Tag color="red">Not Assigned</Tag>;
      },
    },
    {
      title: 'Enrollments',
      dataIndex: 'enrollmentCount',
      key: 'enrollmentCount',
      width: 120,
      align: 'center',
      render: (count) => (
        <Tag color="green" icon={<TeamOutlined />}>
          {count || 0} students
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 300,
      fixed: 'right',
      render: (_, record) => (
        <Space size="middle">
          <Button
            size="small"
            type="primary"
            icon={<UserOutlined />}
            onClick={() => handleAssignLecturer(record)}
          >
            Assign Lecturer
          </Button>
          <Button
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEditCourse(record)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this course?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              size="small"
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

  return (
    <div>
      <Card>
        <div style={{ marginBottom: 16 }}>
          <Row justify="space-between" align="middle">
            <Col>
              <Title level={3} style={{ margin: 0 }}>
                <BookOutlined style={{ marginRight: 8 }} />
                Courses
              </Title>
            </Col>
            <Col>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleAddCourse}
              >
                Add Course
              </Button>
            </Col>
          </Row>
        </div>

        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col xs={24} sm={12} md={8}>
            <Search
              placeholder="Search by course name, code, or description"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: '100%' }}
              allowClear
            />
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Select
              placeholder="Filter by degree"
              value={selectedDegree}
              onChange={setSelectedDegree}
              style={{ width: '100%' }}
              allowClear
            >
              <Option value="all">All Courses</Option>
              {degrees.map(degree => (
                <Option key={degree.id} value={degree.id.toString()}>
                  {degree.name}
                </Option>
              ))}
            </Select>
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={filteredCourses}
          loading={loading}
          rowKey="id"
          pagination={{
            total: filteredCourses.length,
            pageSize: 10,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} courses`,
          }}
          scroll={{ x: 1200, y: 600 }}
          size="middle"
        />
      </Card>

      <Modal
        title="Assign Lecturer to Course"
        open={assignModalVisible}
        onCancel={() => {
          setAssignModalVisible(false);
          assignForm.resetFields();
          setSelectedCourse(null);
        }}
        footer={null}
      >
        <Form
          form={assignForm}
          onFinish={handleAssignSubmit}
          layout="vertical"
        >
          <Form.Item
            name="lecturerId"
            label="Select Lecturer"
            rules={[{ required: true, message: 'Please select a lecturer!' }]}
          >
            <Select
              placeholder="Choose a lecturer"
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {lecturers.filter(l => l.active).map(lecturer => (
                <Option key={lecturer.id} value={lecturer.id}>
                  {`${lecturer.firstName} ${lecturer.lastName}`}
                  {lecturer.department && ` - ${lecturer.department}`}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={() => setAssignModalVisible(false)}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit">
                Assign Lecturer
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Add New Course"
        open={addCourseModalVisible}
        onCancel={() => {
          setAddCourseModalVisible(false);
          addCourseForm.resetFields();
        }}
        footer={null}
        destroyOnClose
        width={800}
      >
        <Form
          form={addCourseForm}
          layout="vertical"
          onFinish={handleAddCourseSubmit}
        >
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                name="courseCode"
                label="Course Code"
                rules={[
                  { required: true, message: 'Please enter course code!' },
                  { min: 3, message: 'Course code must be at least 3 characters!' }
                ]}
              >
                <Input
                  placeholder="e.g., CS101, MATH201"
                  style={{ textTransform: 'uppercase' }}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="credits"
                label="Credits"
                rules={[
                  { required: true, message: 'Please enter number of credits!' },
                  { type: 'number', min: 1, max: 10, message: 'Credits must be between 1 and 10!' }
                ]}
              >
                <InputNumber
                  placeholder="Enter credits"
                  style={{ width: '100%' }}
                  min={1}
                  max={10}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="title"
            label="Course Name"
            rules={[
              { required: true, message: 'Please enter course name!' },
              { min: 5, message: 'Course name must be at least 5 characters!' }
            ]}
          >
            <Input placeholder="Enter course name" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Course Description"
            rules={[
              { required: true, message: 'Please enter course description!' },
              { min: 20, message: 'Description must be at least 20 characters!' }
            ]}
          >
            <TextArea
              placeholder="Enter detailed course description..."
              rows={4}
            />
          </Form.Item>

          <Form.Item
            name="lecturerId"
            label="Assign Lecturer (Optional)"
            help="You can assign a lecturer now or later from the course management page"
          >
            <Select
              placeholder="Select a lecturer (optional)"
              allowClear
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {lecturers.filter(l => l.active).map(lecturer => (
                <Option key={lecturer.id} value={lecturer.id}>
                  {`${lecturer.firstName} ${lecturer.lastName}`}
                  {lecturer.department && ` - ${lecturer.department}`}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                name="degreeId"
                label="Degree"
                rules={[
                  { required: true, message: 'Please select a degree!' }
                ]}
              >
                <Select
                  placeholder="Select a degree"
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {degrees.map(degree => (
                    <Option key={degree.id} value={degree.id}>
                      {degree.name} - {degree.department}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="department"
                label="Department"
                rules={[
                  { required: true, message: 'Please enter the department!' },
                  { min: 3, message: 'Department must be at least 3 characters!' }
                ]}
              >
                <Input placeholder="e.g., Computer Science, Mathematics" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="capacity"
            label="Maximum Enrollment"
            rules={[
              { type: 'number', min: 1, message: 'Maximum enrollment must be at least 1!' }
            ]}
          >
            <InputNumber
              placeholder="Enter max students (default: 30)"
              style={{ width: '100%' }}
              min={1}
              max={1000}
            />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={loading}>
                Create Course
              </Button>
              <Button onClick={() => {
                setAddCourseModalVisible(false);
                addCourseForm.resetFields();
              }}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Edit Course"
        open={editCourseModalVisible}
        onCancel={() => {
          setEditCourseModalVisible(false);
          editCourseForm.resetFields();
        }}
        footer={null}
        destroyOnClose
        width={800}
      >
        <Form
          form={editCourseForm}
          layout="vertical"
          onFinish={handleEditCourseSubmit}
        >
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                name="courseCode"
                label="Course Code"
                rules={[
                  { required: true, message: 'Please enter course code!' },
                  { min: 3, message: 'Course code must be at least 3 characters!' }
                ]}
              >
                <Input
                  placeholder="e.g., CS101, MATH201"
                  style={{ textTransform: 'uppercase' }}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="credits"
                label="Credits"
                rules={[
                  { required: true, message: 'Please enter number of credits!' },
                  { type: 'number', min: 1, max: 10, message: 'Credits must be between 1 and 10!' }
                ]}
              >
                <InputNumber
                  placeholder="Enter credits"
                  style={{ width: '100%' }}
                  min={1}
                  max={10}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="title"
            label="Course Name"
            rules={[
              { required: true, message: 'Please enter course name!' },
              { min: 5, message: 'Course name must be at least 5 characters!' }
            ]}
          >
            <Input placeholder="Enter course name" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Course Description"
            rules={[
              { required: true, message: 'Please enter course description!' },
              { min: 20, message: 'Description must be at least 20 characters!' }
            ]}
          >
            <TextArea
              placeholder="Enter detailed course description..."
              rows={4}
            />
          </Form.Item>

          <Form.Item
            name="lecturerId"
            label="Assign Lecturer (Optional)"
            help="You can assign a lecturer now or later from the course management page"
          >
            <Select
              placeholder="Select a lecturer (optional)"
              allowClear
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {lecturers.filter(l => l.active).map(lecturer => (
                <Option key={lecturer.id} value={lecturer.id}>
                  {`${lecturer.firstName} ${lecturer.lastName}`}
                  {lecturer.department && ` - ${lecturer.department}`}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                name="degreeId"
                label="Degree"
                rules={[
                  { required: true, message: 'Please select a degree!' }
                ]}
              >
                <Select
                  placeholder="Select a degree"
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {degrees.map(degree => (
                    <Option key={degree.id} value={degree.id}>
                      {degree.name} - {degree.department}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="department"
                label="Department"
                rules={[
                  { required: true, message: 'Please enter the department!' },
                  { min: 3, message: 'Department must be at least 3 characters!' }
                ]}
              >
                <Input placeholder="e.g., Computer Science, Mathematics" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="capacity"
            label="Maximum Enrollment"
            rules={[
              { type: 'number', min: 1, message: 'Maximum enrollment must be at least 1!' }
            ]}
          >
            <InputNumber
              placeholder="Enter max students (default: 30)"
              style={{ width: '100%' }}
              min={1}
              max={1000}
            />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={loading}>
                Update Course
              </Button>
              <Button onClick={() => {
                setEditCourseModalVisible(false);
                editCourseForm.resetFields();
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

export default Courses;
