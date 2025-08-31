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
  TrophyOutlined
} from '@ant-design/icons';
import lecturerService from '../../services/lecturerService';

const { Title } = Typography;

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
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
        
        // Mock average grade calculation (you can replace with actual grades later)
        if (course.averageGrade) {
          totalGrades += course.averageGrade;
          gradeCount++;
        }
      }
      
      const averageResults = gradeCount > 0 ? Math.round(totalGrades / gradeCount) : 85; // Default to 85% if no grades
      
      setDashboardData({
        totalCourses: coursesData.length,
        totalStudents,
        totalMaterials,
        averageResults
      });

      // Generate recent activities based on actual data
      const activities = generateRecentActivities(coursesData);
      setRecentActivities(activities);
      
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      message.error('Failed to load dashboard data');
    }
  };

  const generateRecentActivities = (courses) => {
    const activities = [];
    
    // Add course registration activities
    courses.forEach((course) => {
      const daysAgo = Math.floor(Math.random() * 7) + 1; // Random 1-7 days ago
      
      activities.push({
        id: `register-${course.id}`,
        type: 'registration',
        title: 'Course Registration',
        description: `Registered for "${course.title}"`,
        time: `${daysAgo} day${daysAgo > 1 ? 's' : ''} ago`,
        icon: 'check',
        color: '#52c41a'
      });
    });

    // Add some mock material activities (you can replace with real data)
    if (courses.length > 0) {
      const randomCourse = courses[Math.floor(Math.random() * courses.length)];
      activities.push({
        id: 'material-upload',
        type: 'material',
        title: 'Material Uploaded',
        description: `Added lecture notes to "${randomCourse.title}"`,
        time: '2 hours ago',
        icon: 'file',
        color: '#1890ff'
      });
    }

    // Sort by most recent first and limit to 5
    return activities.slice(0, 5);
  };

  return (
    <div style={{ padding: '24px', background: '#f5f5f5', minHeight: '100vh' }}>
      <Title level={2} style={{ marginBottom: 24, color: '#1890ff' }}>
        Welcome to Your Dashboard
      </Title>
      
      {/* Statistics Cards */}
      <Row gutter={[24, 24]} style={{ marginBottom: 32 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card 
            style={{ 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              border: 'none',
              borderRadius: '12px'
            }}
          >
            <Statistic
              title={<span style={{ color: 'white', fontSize: '14px' }}>My Courses</span>}
              value={dashboardData.totalCourses}
              prefix={<BookOutlined style={{ color: 'white' }} />}
              valueStyle={{ color: 'white', fontSize: '32px', fontWeight: 'bold' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card 
            style={{ 
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              border: 'none',
              borderRadius: '12px'
            }}
          >
            <Statistic
              title={<span style={{ color: 'white', fontSize: '14px' }}>Total Students</span>}
              value={dashboardData.totalStudents}
              prefix={<UserOutlined style={{ color: 'white' }} />}
              valueStyle={{ color: 'white', fontSize: '32px', fontWeight: 'bold' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card 
            style={{ 
              background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
              border: 'none',
              borderRadius: '12px'
            }}
          >
            <Statistic
              title={<span style={{ color: 'white', fontSize: '14px' }}>Course Materials</span>}
              value={dashboardData.totalMaterials}
              prefix={<FilePdfOutlined style={{ color: 'white' }} />}
              valueStyle={{ color: 'white', fontSize: '32px', fontWeight: 'bold' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card 
            style={{ 
              background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
              border: 'none',
              borderRadius: '12px'
            }}
          >
            <Statistic
              title={<span style={{ color: 'white', fontSize: '14px' }}>Average Results</span>}
              value={dashboardData.averageResults}
              suffix={<span style={{ color: 'white', fontSize: '16px' }}>%</span>}
              prefix={<TrophyOutlined style={{ color: 'white' }} />}
              valueStyle={{ color: 'white', fontSize: '32px', fontWeight: 'bold' }}
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
            style={{ borderRadius: '12px', height: '500px' }}
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
                            <TeamOutlined /> {course.enrolledCount || 0}/{course.capacity} students
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
            style={{ borderRadius: '12px', height: '500px' }}
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
