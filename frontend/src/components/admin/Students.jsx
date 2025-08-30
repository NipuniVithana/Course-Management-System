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
  Form
} from 'antd';
import {
  TeamOutlined,
  CheckCircleOutlined,
  StopOutlined,
  EditOutlined
} from '@ant-design/icons';
import adminService from '../../services/adminService';

const { Title } = Typography;
const { Search } = Input;
const { Option } = Select;

const Students = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      setLoading(true);
      const data = await adminService.getAllStudents();
      setStudents(data);
    } catch (error) {
      console.error('Error loading students:', error);
      message.error('Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  const handleActivateDeactivate = async (studentId, currentStatus) => {
    try {
      await adminService.updateStudentStatus(studentId, !currentStatus);
      message.success(`Student ${currentStatus ? 'deactivated' : 'activated'} successfully`);
      loadStudents();
    } catch (error) {
      console.error('Error updating student status:', error);
      message.error('Failed to update student status');
    }
  };

  const handleEditStudent = (student) => {
    setSelectedStudent(student);
    form.setFieldsValue({
      firstName: student.firstName,
      lastName: student.lastName,
      email: student.email,
      studentId: student.studentId,
      phoneNumber: student.phoneNumber,
      program: student.program,
      yearOfStudy: student.yearOfStudy,
      address: student.address
    });
    setEditModalVisible(true);
  };

  const handleUpdateStudent = async (values) => {
    try {
      setLoading(true);
      await adminService.updateStudent(selectedStudent.id, values);
      message.success('Student updated successfully');
      setEditModalVisible(false);
      setSelectedStudent(null);
      form.resetFields();
      await loadStudents();
    } catch (error) {
      console.error('Error updating student:', error);
      message.error('Failed to update student');
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = 
      student.firstName?.toLowerCase().includes(searchText.toLowerCase()) ||
      student.lastName?.toLowerCase().includes(searchText.toLowerCase()) ||
      student.email?.toLowerCase().includes(searchText.toLowerCase()) ||
      student.studentId?.toLowerCase().includes(searchText.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'active' && student.active) ||
      (statusFilter === 'inactive' && !student.active);
    
    return matchesSearch && matchesStatus;
  });

  const columns = [
    {
      title: 'Student ID',
      dataIndex: 'studentId',
      key: 'studentId',
      sorter: (a, b) => (a.studentId || '').localeCompare(b.studentId || ''),
    },
    {
      title: 'Name',
      key: 'name',
      render: (_, record) => `${record.firstName} ${record.lastName}`,
      sorter: (a, b) => `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      sorter: (a, b) => (a.email || '').localeCompare(b.email || ''),
    },
    {
      title: 'Phone',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
    },
    {
      title: 'Year of Study',
      dataIndex: 'yearOfStudy',
      key: 'yearOfStudy',
      render: (year) => year ? `Year ${year}` : 'N/A',
    },
    {
      title: 'Major',
      dataIndex: 'major',
      key: 'major',
      render: (major) => major || 'N/A',
    },
    {
      title: 'Status',
      dataIndex: 'active',
      key: 'active',
      render: (active) => (
        <Tag color={active ? 'green' : 'red'}>
          {active ? 'Active' : 'Inactive'}
        </Tag>
      ),
      filters: [
        { text: 'Active', value: true },
        { text: 'Inactive', value: false },
      ],
      onFilter: (value, record) => record.active === value,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEditStudent(record)}
          >
            Edit
          </Button>
          <Popconfirm
            title={`Are you sure you want to ${record.active ? 'deactivate' : 'activate'} this student?`}
            onConfirm={() => handleActivateDeactivate(record.id, record.active)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              size="small"
              type={record.active ? 'default' : 'primary'}
              icon={record.active ? <StopOutlined /> : <CheckCircleOutlined />}
            >
              {record.active ? 'Deactivate' : 'Activate'}
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
          <Title level={3} style={{ margin: 0 }}>
            <TeamOutlined style={{ marginRight: 8 }} />
            Student Management
          </Title>
        </div>

        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col xs={24} sm={12} md={8}>
            <Search
              placeholder="Search by name, email, or student ID"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: '100%' }}
              allowClear
            />
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Select
              placeholder="Filter by status"
              value={statusFilter}
              onChange={setStatusFilter}
              style={{ width: '100%' }}
            >
              <Option value="all">All Students</Option>
              <Option value="active">Active Only</Option>
              <Option value="inactive">Inactive Only</Option>
            </Select>
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={filteredStudents}
          loading={loading}
          rowKey="id"
          pagination={{
            total: filteredStudents.length,
            pageSize: 10,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} students`,
          }}
          scroll={{ x: 800 }}
        />

        <Modal
          title="Edit Student"
          visible={editModalVisible}
          onCancel={() => setEditModalVisible(false)}
          footer={null}
        >
          <Form
            form={form}
            onFinish={handleUpdateStudent}
            layout="vertical"
          >
            <Form.Item
              name="firstName"
              label="First Name"
              rules={[{ required: true, message: 'First name is required' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="lastName"
              label="Last Name"
              rules={[{ required: true, message: 'Last name is required' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="email"
              label="Email"
              rules={[{ required: true, message: 'Email is required' }, { type: 'email', message: 'Invalid email address' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="studentId"
              label="Student ID"
              rules={[{ required: true, message: 'Student ID is required' }]}
            >
              <Input disabled />
            </Form.Item>
            <Form.Item
              name="phoneNumber"
              label="Phone Number"
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="program"
              label="Program"
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="yearOfStudy"
              label="Year of Study"
            >
              <Select>
                <Option value="1">Year 1</Option>
                <Option value="2">Year 2</Option>
                <Option value="3">Year 3</Option>
                <Option value="4">Year 4</Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="address"
              label="Address"
            >
              <Input.TextArea rows={2} />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading}>
                Update Student
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </Card>
    </div>
  );
};

export default Students;
