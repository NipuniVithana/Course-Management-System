import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Typography,
  message,
  Input,
  Row,
  Col,
  Modal,
  Form,
  Popconfirm
} from 'antd';
import {
  BookOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined
} from '@ant-design/icons';
import adminService from '../../services/adminService';

const { Title } = Typography;
const { Search } = Input;
const { TextArea } = Input;

const Degrees = () => {
  const [degrees, setDegrees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDegree, setSelectedDegree] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    loadDegrees();
  }, []);

  const loadDegrees = async () => {
    try {
      setLoading(true);
      const data = await adminService.getAllDegrees();
      setDegrees(data);
    } catch (error) {
      console.error('Error loading degrees:', error);
      message.error('Failed to load degrees');
    } finally {
      setLoading(false);
    }
  };

  const handleAddDegree = () => {
    setSelectedDegree(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEditDegree = (degree) => {
    setSelectedDegree(degree);
    form.setFieldsValue({
      name: degree.name,
      description: degree.description,
      duration: degree.duration,
      department: degree.department,
      faculty: degree.faculty
    });
    setModalVisible(true);
  };

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      if (selectedDegree) {
        await adminService.updateDegree(selectedDegree.id, values);
        message.success('Degree updated successfully');
        
        // Track activity
        if (window.addAdminActivity) {
          window.addAdminActivity(
            'Degree Updated',
            `Degree "${values.name}" in ${values.faculty} was updated`,
            'degree'
          );
        }
      } else {
        await adminService.createDegree(values);
        message.success('Degree created successfully');
        
        // Track activity
        if (window.addAdminActivity) {
          window.addAdminActivity(
            'Degree Created',
            `New degree "${values.name}" in ${values.faculty} was created`,
            'degree'
          );
        }
      }
      setModalVisible(false);
      setSelectedDegree(null);
      form.resetFields();
      await loadDegrees();
    } catch (error) {
      console.error('Error saving degree:', error);
      message.error('Failed to save degree');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDegree = async (degreeId) => {
    try {
      setLoading(true);
      
      // Find the degree details before deleting
      const degree = degrees.find(d => d.id === degreeId);
      
      await adminService.deleteDegree(degreeId);
      message.success('Degree deleted successfully');
      
      // Track activity
      if (window.addAdminActivity && degree) {
        window.addAdminActivity(
          'Degree Deleted',
          `Degree "${degree.name}" from ${degree.faculty} was deleted`,
          'degree'
        );
      }
      
      await loadDegrees();
    } catch (error) {
      console.error('Error deleting degree:', error);
      message.error('Failed to delete degree');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value) => {
    setSearchText(value);
  };

  const filteredDegrees = degrees.filter(degree => {
    return !searchText || 
      degree.name.toLowerCase().includes(searchText.toLowerCase()) ||
      degree.faculty?.toLowerCase().includes(searchText.toLowerCase()) ||
      degree.department.toLowerCase().includes(searchText.toLowerCase());
  });

  const columns = [
    {
      title: 'Degree Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Faculty',
      dataIndex: 'faculty',
      key: 'faculty',
      sorter: (a, b) => (a.faculty || '').localeCompare(b.faculty || ''),
    },
    {
      title: 'Department',
      dataIndex: 'department',
      key: 'department',
      sorter: (a, b) => a.department.localeCompare(b.department),
    },
    {
      title: 'Duration (Years)',
      dataIndex: 'duration',
      key: 'duration',
      render: (duration) => `${duration} years`,
      sorter: (a, b) => a.duration - b.duration,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEditDegree(record)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this degree?"
            description="This will affect all courses under this degree."
            onConfirm={() => handleDeleteDegree(record.id)}
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
          <Row gutter={[16, 16]} align="middle">
            <Col>
              <Title level={3} style={{ margin: 0 }}>
                <BookOutlined style={{ marginRight: 8 }} />
                Degrees
              </Title>
            </Col>
          </Row>
        </div>

        <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
          <Col xs={24} sm={12} md={8}>
            <Search
              placeholder="Search degrees..."
              allowClear
              onSearch={handleSearch}
              onChange={(e) => handleSearch(e.target.value)}
              style={{ width: '100%' }}
            />
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAddDegree}
            >
              Add Degree
            </Button>
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={filteredDegrees}
          rowKey="id"
          loading={loading}
          pagination={{
            total: filteredDegrees.length,
            pageSize: 10,
            showTotal: (total, range) => 
              `${range[0]}-${range[1]} of ${total} degrees`,
          }}
          scroll={{ x: 700 }}
        />
      </Card>

      {/* Add/Edit Degree Modal */}
      <Modal
        title={selectedDegree ? 'Edit Degree' : 'Add New Degree'}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          setSelectedDegree(null);
          form.resetFields();
        }}
        footer={null}
        destroyOnClose
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="name"
            label="Degree Name"
            rules={[{ required: true, message: 'Please enter degree name' }]}
          >
            <Input placeholder="e.g., Bachelor of Science in Computer Science" />
          </Form.Item>

          <Form.Item
            name="faculty"
            label="Faculty"
            rules={[{ required: true, message: 'Please enter faculty' }]}
          >
            <Input placeholder="e.g., Faculty of Engineering, Faculty of Science" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="department"
                label="Department"
                rules={[{ required: true, message: 'Please enter department' }]}
              >
                <Input placeholder="e.g., Computer Science" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="duration"
                label="Duration (Years)"
                rules={[{ required: true, message: 'Please enter duration' }]}
              >
                <Input type="number" min={1} max={10} placeholder="e.g., 4" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: 'Please enter description' }]}
          >
            <TextArea 
              rows={4} 
              placeholder="Describe the degree program, its objectives, and career prospects..."
            />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={loading}>
                {selectedDegree ? 'Update' : 'Create'} Degree
              </Button>
              <Button onClick={() => {
                setModalVisible(false);
                setSelectedDegree(null);
                form.resetFields();
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

export default Degrees;
