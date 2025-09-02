import React, { useState, useEffect } from 'react';
import {
  Row,
  Col,
  Card,
  Statistic,
  Tag,
  Space,
  Typography,
  message,
  Badge,
  Avatar,
  Empty
} from 'antd';
import {
  BookOutlined,
  UserOutlined,
  TeamOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  FilePdfOutlined,
  TrophyOutlined,
  DashboardOutlined
} from '@ant-design/icons';
import lecturerService from '../../services/lecturerService';

const { Title, Paragraph } = Typography;

const LecturerDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    totalCourses: 0,
    totalStudents: 0,
    totalMaterials: 0,
    averageResults: 0
  });
  const [courses, setCourses] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Load lecturer's courses (registered courses)
      const coursesData = await lecturerService.getMyCourses();
      setCourses(coursesData);
      
      // Calculate dashboard statistics
      let totalStudents = 0;
      let totalMaterials = 0;
      let totalGrades = 0;
      let gradeCount = 0;
      
      // For each course, get additional data
      for (const course of coursesData) {
        totalStudents += course.enrolledCount || 0;
        
        // Get course materials count
        try {
          const materials = await lecturerService.getCourseMaterials(course.id);
          totalMaterials += materials.length;
        } catch (error) {
          console.log(`Could not fetch materials for course ${course.id}`);
        }
        
        if (course.averageGrade !== null && course.averageGrade !== undefined) {
          totalGrades += course.averageGrade;
          gradeCount++;
        }
      }
      
      const averageResults = gradeCount > 0 ? Math.round(totalGrades / gradeCount) : 0; // Show 0 if no grades available
      
      setDashboardData({
        totalCourses: coursesData.length,
        totalStudents,
        totalMaterials,
        averageResults
      });

      const activitiesData = await lecturerService.getRecentActivities();
      setRecentActivities(activitiesData);
      
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      message.error('Failed to load dashboard data');
    }
  };

  return (
    <div style={{ padding: '24px', background: '#f5f5f5', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <Title level={2} style={{ margin: 0, color: '#1890ff', display: 'flex', alignItems: 'center' }}>
          <DashboardOutlined style={{ marginRight: '8px' }} />
          Lecturer Dashboard
        </Title>
        <Paragraph type="secondary" style={{ marginBottom: 0, fontSize: '16px' }}>
          Welcome back! Manage your courses, assignments, and student progress.
        </Paragraph>
      </div>
      
      {/* Statistics Cards */}
      <Row gutter={[24, 24]} style={{ marginBottom: 32 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card 
            style={{ borderRadius: '8px' }}
            bodyStyle={{ padding: '20px' }}
          >
            <Statistic
              title="My Courses"
              value={dashboardData.totalCourses}
              prefix={<BookOutlined style={{ color: '#1890ff' }} />}
              valueStyle={{ color: '#1890ff', fontSize: '24px' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card 
            style={{ borderRadius: '8px' }}
            bodyStyle={{ padding: '20px' }}
          >
            <Statistic
              title="Total Students"
              value={dashboardData.totalStudents}
              prefix={<UserOutlined style={{ color: '#52c41a' }} />}
              valueStyle={{ color: '#52c41a', fontSize: '24px' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card 
            style={{ borderRadius: '8px' }}
            bodyStyle={{ padding: '20px' }}
          >
            <Statistic
              title="Course Materials"
              value={dashboardData.totalMaterials}
              prefix={<FilePdfOutlined style={{ color: '#faad14' }} />}
              valueStyle={{ color: '#faad14', fontSize: '24px' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card 
            style={{ borderRadius: '8px' }}
            bodyStyle={{ padding: '20px' }}
          >
            <Statistic
              title="Average Results"
              value={dashboardData.averageResults}
              suffix="%"
              prefix={<TrophyOutlined style={{ color: '#722ed1' }} />}
              valueStyle={{ color: '#722ed1', fontSize: '24px' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Main Content */}
      <Row gutter={[24, 24]}>
        {/* My Courses Section */}
        <Col xs={24} lg={12}>
          <Card 
            title={
              <Space>
                <BookOutlined style={{ color: '#1890ff' }} />
                <span>My Courses</span>
                <Badge count={courses.length} style={{ backgroundColor: '#52c41a' }} />
              </Space>
            }
            style={{ borderRadius: '8px', height: '500px' }}
            bodyStyle={{ height: '420px', overflowY: 'auto' }}
          >
            {courses.length === 0 ? (
              <Empty 
                description="No courses assigned yet"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            ) : (
              <Space direction="vertical" style={{ width: '100%' }} size="middle">
                {courses.slice(0, 5).map(course => (
                  <Card 
                    key={course.id}
                    size="small"
                    style={{ 
                      borderRadius: '8px',
                      border: '1px solid #f0f0f0'
                    }}
                    bodyStyle={{ padding: '16px' }}
                  >
                    <Row justify="space-between" align="middle">
                      <Col span={20}>
                        <div>
                          <Space size="small" style={{ marginBottom: '8px' }}>
                            <Tag color="blue">{course.courseCode}</Tag>
                            <Tag color="purple">{course.department || 'Computer Science'}</Tag>
                          </Space>
                          <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                            {course.title}
                          </div>
                          <div style={{ color: '#666', fontSize: '12px' }}>
                            <TeamOutlined /> {course.enrolledCount || 0} students
                          </div>
                        </div>
                      </Col>
                      <Col span={4} style={{ textAlign: 'right' }}>
                        <Tag color="green">{course.credits} Credits</Tag>
                      </Col>
                    </Row>
                  </Card>
                ))}
              </Space>
            )}
          </Card>
        </Col>

        {/* Recent Activity */}
        <Col xs={24} lg={12}>
          <Card 
            title={
              <Space>
                <ClockCircleOutlined style={{ color: '#1890ff' }} />
                <span>Recent Activity</span>
              </Space>
            }
            style={{ borderRadius: '8px', height: '500px' }}
            bodyStyle={{ height: '420px', overflowY: 'auto' }}
          >
            {recentActivities.length === 0 ? (
              <Empty 
                description="No recent activities"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            ) : (
              <Space direction="vertical" style={{ width: '100%' }} size="middle">
                {recentActivities.map(activity => {
                  let icon;
                  switch (activity.icon) {
                    case 'check':
                      icon = <CheckCircleOutlined />;
                      break;
                    case 'file':
                      icon = <FilePdfOutlined />;
                      break;
                    case 'user':
                      icon = <UserOutlined />;
                      break;
                    default:
                      icon = <BookOutlined />;
                  }

                  return (
                    <Card 
                      key={activity.id}
                      size="small"
                      style={{ borderRadius: '8px', border: '1px solid #f0f0f0' }}
                      bodyStyle={{ padding: '16px' }}
                    >
                      <Space>
                        <Avatar style={{ backgroundColor: activity.color }}>
                          {icon}
                        </Avatar>
                        <div>
                          <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{activity.title}</div>
                          <div style={{ color: '#666', fontSize: '12px' }}>
                            {activity.description}
                          </div>
                          <div style={{ color: '#999', fontSize: '11px' }}>{activity.time}</div>
                        </div>
                      </Space>
                    </Card>
                  );
                })}
              </Space>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default LecturerDashboard;
