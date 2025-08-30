import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Space,
  Typography,
  message,
  Tag,
  Input,
  Select,
  Row,
  Col,
  Button,
  Modal,
  Form,
  Popconfirm
} from 'antd';
import {
  UserOutlined,
  CheckCircleOutlined,
  StopOutlined,
  EditOutlined
} from '@ant-design/icons';
import adminService from '../../services/adminService';

const { Title } = Typography;
const { Search } = Input;
const { Option } = Select;

const Lecturers = () => {
  const [lecturers, setLecturers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedLecturer, setSelectedLecturer] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    loadLecturers();
  }, []);

  const loadLecturers = async () => {
    try {
      setLoading(true);
      const data = await adminService.getAllLecturers();
      setLecturers(data);
    } catch (error) {
      console.error('Error loading lecturers:', error);
      message.error('Failed to load lecturers');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value) => {
    setSearchText(value);
  };

  const handleStatusFilter = (value) => {
    setStatusFilter(value);
  };

  const handleEditLecturer = (lecturer) => {
    setSelectedLecturer(lecturer);
    form.setFieldsValue({
      firstName: lecturer.firstName,
      lastName: lecturer.lastName,
      email: lecturer.email,
      phoneNumber: lecturer.phoneNumber,
      department: lecturer.department,
      officeLocation: lecturer.officeLocation
    });
    setEditModalVisible(true);
  };

  const handleUpdateLecturer = async (values) => {
    try {
      setLoading(true);
      await adminService.updateLecturer(selectedLecturer.id, values);
      message.success('Lecturer updated successfully');
      setEditModalVisible(false);
      setSelectedLecturer(null);
      form.resetFields();
      await loadLecturers();
    } catch (error) {
      console.error('Error updating lecturer:', error);
      message.error('Failed to update lecturer');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (lecturer) => {
    try {
      setLoading(true);
      const newStatus = !lecturer.active;
      await adminService.updateLecturerStatus(lecturer.id, newStatus);
      message.success(`Lecturer ${newStatus ? 'activated' : 'deactivated'} successfully`);
      await loadLecturers();
    } catch (error) {
      console.error('Error updating lecturer status:', error);
      message.error('Failed to update lecturer status');
    } finally {
      setLoading(false);
    }
  };

  const filteredLecturers = lecturers.filter(lecturer => {
    const matchesSearch = !searchText || 
      lecturer.firstName.toLowerCase().includes(searchText.toLowerCase()) ||
      lecturer.lastName.toLowerCase().includes(searchText.toLowerCase()) ||
      lecturer.email.toLowerCase().includes(searchText.toLowerCase()) ||
      lecturer.employeeId.toLowerCase().includes(searchText.toLowerCase());

    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'active' && lecturer.active) ||
      (statusFilter === 'inactive' && !lecturer.active);

    return matchesSearch && matchesStatus;
  });

  const columns = [
    {
      title: 'Employee ID',
      dataIndex: 'employeeId',
      key: 'employeeId',
      sorter: (a, b) => a.employeeId.localeCompare(b.employeeId),
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
      sorter: (a, b) => a.email.localeCompare(b.email),
    },
    {
      title: 'Department',
      dataIndex: 'department',
      key: 'department',
      sorter: (a, b) => (a.department || '').localeCompare(b.department || ''),
    },
    {
      title: 'Phone',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
      render: (phone) => phone || 'N/A',
    },
    {
      title: 'Office Location',
      dataIndex: 'officeLocation',
      key: 'officeLocation',
      render: (location) => location || 'N/A',
    },
    {
      title: 'Status',
      key: 'status',
      render: (_, record) => (
        <Tag
          icon={record.active ? <CheckCircleOutlined /> : <StopOutlined />}
          color={record.active ? 'success' : 'error'}
        >
          {record.active ? 'Active' : 'Inactive'}
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
            onClick={() => handleEditLecturer(record)}
          >
            Edit
          </Button>
          <Popconfirm
            title={`Are you sure you want to ${record.active ? 'deactivate' : 'activate'} this lecturer?`}
            onConfirm={() => handleToggleStatus(record)}
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
    }
  ];

  return (
    <div>
      <Card>
        <div style={{ marginBottom: 16 }}>
          <Row gutter={[16, 16]} align="middle">
            <Col>
              <Title level={3} style={{ margin: 0 }}>
                <UserOutlined style={{ marginRight: 8 }} />
                Lecturers
              </Title>
            </Col>
          </Row>
        </div>

        <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
          <Col xs={24} sm={12} md={8}>
            <Search
              placeholder="Search lecturers..."
              allowClear
              onSearch={handleSearch}
              onChange={(e) => handleSearch(e.target.value)}
              style={{ width: '100%' }}
            />
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Select
              placeholder="Filter by status"
              style={{ width: '100%' }}
              value={statusFilter}
              onChange={handleStatusFilter}
            >
              <Option value="all">All Status</Option>
              <Option value="active">Active</Option>
              <Option value="inactive">Inactive</Option>
            </Select>
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={filteredLecturers}
          rowKey="id"
          loading={loading}
          pagination={{
            total: filteredLecturers.length,
            pageSize: 10,
            showTotal: (total, range) => 
              `${range[0]}-${range[1]} of ${total} lecturers`,
          }}
          scroll={{ x: 800 }}
        />

        <Modal
          title="Edit Lecturer"
          visible={editModalVisible}
          onCancel={() => setEditModalVisible(false)}
          footer={null}
        >
          <Form
            form={form}
            onFinish={handleUpdateLecturer}
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
              rules={[{ required: true, message: 'Email is required' }, { type: 'email', message: 'Invalid email' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="phoneNumber"
              label="Phone Number"
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="department"
              label="Department"
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="officeLocation"
              label="Office Location"
            >
              <Input />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading}>
                Update Lecturer
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </Card>
    </div>
  );
};

export default Lecturers;
