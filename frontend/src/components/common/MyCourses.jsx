import React, { useState, useEffect, useCallback } from 'react';
import {
  Card,
  Table,
  Button,
  Typography,
  message,
  Tag
} from 'antd';
import {
  BookOutlined,
  EyeOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import lecturerService from '../../services/lecturerService';
import studentService from '../../services/studentService';

const { Title } = Typography;

const MyCourses = ({ userRole = 'LECTURER' }) => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Configure based on user role
  const isStudent = userRole === 'STUDENT';
  const service = isStudent ? studentService : lecturerService;

  const loadMyCourses = useCallback(async () => {
    try {
      setLoading(true);
      const data = isStudent ? await service.getMyEnrollments() : await service.getMyCourses();
      setCourses(data);
    } catch (error) {
      console.error('Error loading courses:', error);
      message.error('Failed to load courses');
    } finally {
      setLoading(false);
    }
  }, [isStudent, service]);

  useEffect(() => {
    loadMyCourses();
  }, [loadMyCourses]);

  const handleCourseAction = (course) => {
    if (isStudent) {
      navigate(`/student/course/${course.courseId || course.id}`);
    } else {
      navigate(`/lecturer/course/${course.id}`);
    }
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
      width: 250,
      render: (title) => (
        <div>
          <strong>{title}</strong>
        </div>
      ),
    },
    {
      title: isStudent ? 'Lecturer' : 'Department',
      dataIndex: isStudent ? 'lecturerName' : 'department',
      key: isStudent ? 'lecturerName' : 'department',
      width: 180,
      render: (value) => value || 'Not assigned',
    },
    {
      title: 'Credits',
      dataIndex: 'credits',
      key: 'credits',
      width: 100,
      align: 'center',
      render: (credits) => <Tag color="green">{credits}</Tag>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => (
        <Tag color={status === 'ACTIVE' || status === 'ENROLLED' ? 'green' : 'red'}>
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
          onClick={() => handleCourseAction(record)}
        >
          {isStudent ? 'View' : 'Manage'}
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
          rowKey={isStudent ? 'id' : 'id'}
          loading={loading}
          scroll={{ x: 800 }}
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
