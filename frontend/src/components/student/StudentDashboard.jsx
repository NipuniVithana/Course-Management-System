import React, { useState, useEffect } from 'react';
import {
  Row,
  Col,
  Card,
  Statistic,
  Button,
  Tag,
  Space,
  Typography,
  message,
  Avatar,
  Empty,
  Spin,
  Alert
} from 'antd';
import {
  BookOutlined,
  TrophyOutlined,
  CheckCircleOutlined,
  UserOutlined,
  StarOutlined,
  EyeOutlined,
  RightOutlined,
  DashboardOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import studentService from '../../services/studentService';

const { Title, Text, Paragraph } = Typography;

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    totalAvailableCourses: 0,
    totalEnrolledCourses: 0,
    completedCourses: 0,
    averageGrade: 0
  });
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [recentGrades, setRecentGrades] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load all available courses and student's enrolled courses
      const [allCoursesData, coursesData] = await Promise.all([
        studentService.getAllAvailableCourses(),
        studentService.getMyEnrollments()
      ]);
      
      setEnrolledCourses(coursesData);

      // Calculate dashboard statistics
      const totalCourses = coursesData.length;
      const coursesWithGrades = coursesData.filter(course => course.finalGrade && parseFloat(course.finalGrade) > 0);
      const averageGrade = coursesWithGrades.length > 0 
        ? coursesWithGrades.reduce((sum, course) => sum + parseFloat(course.finalGrade || 0), 0) / coursesWithGrades.length
        : 0;

      setDashboardData({
        totalAvailableCourses: allCoursesData.length,
        totalEnrolledCourses: totalCourses,
        completedCourses: coursesWithGrades.length,
        averageGrade: averageGrade.toFixed(1)
      });

      // Set recent grades (courses with grades)
      setRecentGrades(coursesWithGrades.slice(0, 4).map(course => ({
        id: course.id,
        courseName: course.title,
        courseCode: course.courseCode,
        grade: parseFloat(course.finalGrade),
        lecturerName: course.lecturerName,
        gradedDate: course.enrollmentDate
      })));

    } catch (error) {
      console.error('Error loading dashboard data:', error);
      message.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const getGradeColor = (grade) => {
    if (grade >= 85) return '#52c41a';
    if (grade >= 70) return '#1890ff';
    if (grade >= 60) return '#fa8c16';
    return '#ff4d4f';
  };

  const getGradeStatus = (grade) => {
    if (grade >= 85) return 'excellent';
    if (grade >= 70) return 'good';
    if (grade >= 60) return 'satisfactory';
    return 'needs-improvement';
  };

  const handleViewCourse = (course) => {
    navigate(`/student/course/${course.courseId || course.id}`);
  };

  const renderCourseCard = (course) => (
    <Card
      key={course.id}
      size="small"
      hoverable
      style={{ height: '100%', borderRadius: '8px' }}
      bodyStyle={{ padding: '16px' }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '12px' }}>
        <Avatar 
          icon={<BookOutlined />} 
          style={{ 
            backgroundColor: course.finalGrade ? getGradeColor(parseFloat(course.finalGrade)) : '#1890ff',
            marginRight: '12px',
            flexShrink: 0
          }} 
        />
        <div style={{ flex: 1, minWidth: 0 }}>
          <Text strong style={{ display: 'block', fontSize: '14px' }}>
            {course.courseCode}
          </Text>
          <Text style={{ fontSize: '12px', color: '#666' }}>
            {course.credits} Credits
          </Text>
        </div>
      </div>
      
      <Text 
        ellipsis={{ tooltip: course.title }} 
        style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}
      >
        {course.title}
      </Text>
      
      <div style={{ marginBottom: '12px' }}>
        <Space size={4}>
          <UserOutlined style={{ fontSize: '12px', color: '#666' }} />
          <Text style={{ fontSize: '12px', color: '#666' }}>
            {course.lecturerName}
          </Text>
        </Space>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Space size={4}>
          <Tag color={course.status === 'ENROLLED' ? 'green' : 'blue'} size="small">
            {course.status}
          </Tag>
          {course.finalGrade && (
            <Tag 
              color={getGradeStatus(parseFloat(course.finalGrade))} 
              size="small"
            >
              {course.finalGrade}%
            </Tag>
          )}
        </Space>
        <Button 
          type="link" 
          size="small"
          icon={<EyeOutlined />}
          onClick={() => handleViewCourse(course)}
          style={{ padding: '0 4px' }}
        >
          View
        </Button>
      </div>
    </Card>
  );

  const renderGradeCard = (grade) => (
    <Card 
      key={grade.id}
      size="small" 
      style={{ textAlign: 'center', borderRadius: '8px', height: '100%' }}
      bodyStyle={{ padding: '16px' }}
    >
      <Avatar 
        size={48}
        style={{ 
          backgroundColor: getGradeColor(grade.grade),
          marginBottom: '8px',
          fontSize: '16px',
          fontWeight: 'bold'
        }}
      >
        {grade.grade}%
      </Avatar>
      <div>
        <Text strong style={{ display: 'block', fontSize: '14px' }}>
          {grade.courseCode}
        </Text>
        <Text 
          style={{ fontSize: '12px', color: '#666' }}
          ellipsis={{ tooltip: grade.courseName }}
        >
          {grade.courseName}
        </Text>
      </div>
    </Card>
  );

  if (loading) {
    return (
      <div style={{ 
        padding: '24px', 
        textAlign: 'center', 
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ 
      padding: '24px', 
      backgroundColor: '#f5f5f5', 
      minHeight: '100vh' 
    }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <Title level={2} style={{ margin: 0, color: '#1890ff', display: 'flex', alignItems: 'center' }}>
          <DashboardOutlined style={{ marginRight: '8px' }} />
          Student Dashboard
        </Title>
        <Paragraph type="secondary" style={{ marginBottom: 0, fontSize: '16px' }}>
          Welcome back! Here's your academic overview and recent activity.
        </Paragraph>
      </div>

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} md={6}>
          <Card 
            style={{ borderRadius: '8px' }}
            bodyStyle={{ padding: '20px' }}
          >
            <Statistic
              title="All Courses"
              value={dashboardData.totalAvailableCourses}
              prefix={<BookOutlined style={{ color: '#1890ff' }} />}
              valueStyle={{ color: '#1890ff', fontSize: '24px' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card 
            style={{ borderRadius: '8px' }}
            bodyStyle={{ padding: '20px' }}
          >
            <Statistic
              title="Enrolled Courses"
              value={dashboardData.totalEnrolledCourses}
              prefix={<BookOutlined style={{ color: '#52c41a' }} />}
              valueStyle={{ color: '#52c41a', fontSize: '24px' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card 
            style={{ borderRadius: '8px' }}
            bodyStyle={{ padding: '20px' }}
          >
            <Statistic
              title="Completed Courses"
              value={dashboardData.completedCourses}
              prefix={<CheckCircleOutlined style={{ color: '#faad14' }} />}
              valueStyle={{ color: '#faad14', fontSize: '24px' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card 
            style={{ borderRadius: '8px' }}
            bodyStyle={{ padding: '20px' }}
          >
            <Statistic
              title="Average Grade"
              value={dashboardData.averageGrade}
              suffix="%"
              prefix={<TrophyOutlined style={{ color: '#722ed1' }} />}
              valueStyle={{ color: '#722ed1', fontSize: '24px' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        {/* My Courses Section */}
        <Col xs={24} lg={16}>
          <Card
            title={
              <Space>
                <BookOutlined />
                <span>My Enrolled Courses</span>
              </Space>
            }
            extra={
              <Button 
                type="primary" 
                icon={<RightOutlined />}
                onClick={() => navigate('/student/my-courses')}
              >
                View All
              </Button>
            }
            style={{ borderRadius: '8px', marginBottom: '16px' }}
          >
            {enrolledCourses.length > 0 ? (
              <Row gutter={[12, 12]}>
                {enrolledCourses.slice(0, 4).map(course => (
                  <Col xs={24} sm={12} key={course.id}>
                    {renderCourseCard(course)}
                  </Col>
                ))}
              </Row>
            ) : (
              <Empty 
                description={
                  <span>
                    No enrolled courses yet.{' '}
                    <Button 
                      type="link" 
                      onClick={() => navigate('/student/all-courses')}
                      style={{ padding: 0 }}
                    >
                      Browse available courses
                    </Button>
                  </span>
                }
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            )}
          </Card>

        </Col>

        {/* Right Sidebar */}
        <Col xs={24} lg={8}>
          {/* Recent Grades */}
          {recentGrades.length > 0 && (
            <Card
              title={
                <Space>
                  <StarOutlined />
                  <span>Recent Grades</span>
                </Space>
              }
              style={{ borderRadius: '8px' }}
            >
              <Row gutter={[12, 12]}>
                {recentGrades.map(grade => (
                  <Col xs={12} key={grade.id}>
                    {renderGradeCard(grade)}
                  </Col>
                ))}
              </Row>
            </Card>
          )}
        </Col>
      </Row>

      {/* Welcome Alert for New Students */}
      {dashboardData.totalEnrolledCourses === 0 && (
        <Alert
          message="Welcome to the Course Management System!"
          description={
            <div>
              <p>Get started by browsing and enrolling in available courses.</p>
              <Button 
                type="primary" 
                icon={<BookOutlined />}
                onClick={() => navigate('/student/all-courses')}
              >
                Browse Courses
              </Button>
            </div>
          }
          type="info"
          showIcon
          style={{ marginTop: '16px', borderRadius: '8px' }}
        />
      )}
    </div>
  );
};

export default StudentDashboard;