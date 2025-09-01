import React, { useState, useEffect } from 'react';
import {
  Card,
  Form,
  Input,
  InputNumber,
  Button,
  Typography,
  message,
  Row,
  Col,
  Space,
  Select
} from 'antd';
import {
  BookOutlined,
  PlusOutlined,
  UserOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import adminService from '../../services/adminService';

const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const AddCourse = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [lecturers, setLecturers] = useState([]);
  const [degrees, setDegrees] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [lecturersData, degreesData] = await Promise.all([
        adminService.getAllLecturers(),
        adminService.getAllDegrees()
      ]);
      setLecturers(lecturersData.filter(lecturer => lecturer.active));
      setDegrees(degreesData);
    } catch (error) {
      console.error('Error loading data:', error);
      message.error('Failed to load data');
    }
  };

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      await adminService.createCourse(values);
      message.success('Course created successfully');
      form.resetFields();
      // Optionally navigate back to courses list
      // navigate('/admin/courses');
    } catch (error) {
      console.error('Error creating course:', error);
      message.error('Failed to create course');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    navigate('/admin/courses');
  };

  return (
    <div>
      <Card>
        <div style={{ marginBottom: 24 }}>
          <Title level={3} style={{ margin: 0 }}>
            <BookOutlined style={{ marginRight: 8 }} />
            Add New Course
          </Title>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          requiredMark={false}
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
                  size="large"
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
                  size="large"
                  style={{ width: '100%' }}
                  min={1}
                  max={10}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="courseName"
            label="Course Name"
            rules={[
              { required: true, message: 'Please enter course name!' },
              { min: 5, message: 'Course name must be at least 5 characters!' }
            ]}
          >
            <Input
              placeholder="Enter course name"
              size="large"
            />
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
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="lecturerId"
            label="Assign Lecturer (Optional)"
            help="You can assign a lecturer now or later from the course management page"
          >
            <Select
              placeholder="Select a lecturer (optional)"
              size="large"
              allowClear
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {lecturers.map(lecturer => (
                <Option key={lecturer.id} value={lecturer.id}>
                  <UserOutlined style={{ marginRight: 8 }} />
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
                  size="large"
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
                <Input
                  placeholder="e.g., Computer Science, Mathematics"
                  size="large"
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item style={{ marginTop: 32 }}>
            <Space size="middle">
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                size="large"
                icon={<PlusOutlined />}
              >
                Create Course
              </Button>
              <Button
                size="large"
                onClick={handleCancel}
              >
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default AddCourse;
