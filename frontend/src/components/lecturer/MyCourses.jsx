import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Button,
  Typography,
  message,
  Tag,
  Badge
} from 'antd';
import {
  BookOutlined,
  EyeOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import lecturerService from '../../services/lecturerService';

const { Title } = Typography;

const MyCourses = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMyCourses();
  }, []);

  const loadMyCourses = async () => {
    try {
      setLoading(true);
      const data = await lecturerService.getMyCourses();
      setCourses(data);
    } catch (error) {
      console.error('Error loading courses:', error);
      message.error('Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  const handleManageCourse = (course) => {
    navigate(`/lecturer/course/${course.id}`);
  };

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
      title: 'Credits',
      dataIndex: 'credits',
      key: 'credits',
      width: 80,
      align: 'center',
      render: (credits) => <Tag color="green">{credits}</Tag>,
    },
    {
      title: 'Enrolled Students',
      dataIndex: 'enrolledCount',
      key: 'enrolledCount',
      width: 130,
      align: 'center',
      render: (count) => <Badge count={count} color="blue" />,
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
      render: (_, record) => (
        <Button
          type="primary"
          size="small"
          icon={<EyeOutlined />}
          onClick={() => handleManageCourse(record)}
        >
          Manage
        </Button>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <div style={{ marginBottom: 16 }}>
          <Title level={4}>
            <BookOutlined /> My Courses
          </Title>
        </div>
        <Table
          columns={columns}
          dataSource={courses}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `Total ${total} courses`
          }}
        />
      </Card>
    </div>
  );
};

export default MyCourses;
