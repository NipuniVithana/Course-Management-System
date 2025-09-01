import React, { useState, useEffect } from 'react';
import {
  Row,
  Col,
  Card,
  Statistic,
  Typography,
  Space,
  List,
  Tag,
  message
} from 'antd';
import {
  UserOutlined,
  BookOutlined,
  TeamOutlined,
  ArrowUpOutlined,
  BankOutlined,
  DashboardOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import adminService from '../../services/adminService';

const { Title, Text, Paragraph } = Typography;

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState({
    totalUsers: 0,
    totalCourses: 0,
    totalDegrees: 0,
    totalLecturers: 0,
    totalStudents: 0
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
    loadRecentActivities();
  }, []);

  const loadRecentActivities = () => {
    try {
      const savedActivities = localStorage.getItem('adminActivities');
      if (savedActivities) {
        const activities = JSON.parse(savedActivities);
        // Show only the last 10 activities
        setRecentActivities(activities.slice(0, 10));
      }
    } catch (error) {
      console.error('Error loading activities:', error);
      setRecentActivities([]);
    }
  };

  // Make this function available globally
  window.addAdminActivity = (title, description, type) => {
    try {
      const newActivity = {
        id: Date.now(),
        title,
        description,
        type,
        timestamp: new Date().toLocaleString()
      };

      const savedActivities = localStorage.getItem('adminActivities');
      const activities = savedActivities ? JSON.parse(savedActivities) : [];
      
      // Add new activity at the beginning
      activities.unshift(newActivity);
      
      // Keep only the last 50 activities to prevent localStorage from growing too large
      const limitedActivities = activities.slice(0, 50);
      
      localStorage.setItem('adminActivities', JSON.stringify(limitedActivities));
      
      // Update the state to show the new activity immediately
      setRecentActivities(limitedActivities.slice(0, 10));
    } catch (error) {
      console.error('Error saving activity:', error);
    }
  };

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      // Try to get dashboard stats, if it fails, use mock data
      try {
        const stats = await adminService.getDashboardStats();
        setDashboardData(stats);
      } catch (error) {
        console.warn('Using mock data due to API error:', error);
        // Use mock data if API is not available
        setDashboardData({
          totalStudents: 150,
          totalLecturers: 25,
          totalCourses: 45,
          totalDegrees: 12
        });
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      message.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    {
      title: 'Manage Courses',
      description: 'View and manage all courses',
      icon: <BookOutlined />,
      path: '/admin/courses',
      color: '#722ed1'
    },
    {
      title: 'Manage Students',
      description: 'View and manage student accounts',
      icon: <TeamOutlined />,
      path: '/admin/students',
      color: '#fa8c16'
    },
    {
      title: 'Manage Lecturers',
      description: 'View and manage lecturer accounts',
      icon: <UserOutlined />,
      path: '/admin/lecturers',
      color: '#1890ff'
    },
    {
      title: 'Manage Degrees',
      description: 'View and manage degree programs',
      icon: <BankOutlined />,
      path: '/admin/degrees',
      color: '#52c41a'
    }
  ];

  return (
    <div style={{ padding: '24px', background: '#f5f5f5', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <Title level={2} style={{ margin: 0, color: '#1890ff', display: 'flex', alignItems: 'center' }}>
          <DashboardOutlined style={{ marginRight: '8px' }} />
          Admin Dashboard
        </Title>
        <Paragraph type="secondary" style={{ marginBottom: 0, fontSize: '16px' }}>
          Welcome to the University Course Management System. Manage students, lecturers, and courses.
        </Paragraph>
      </div>

      {/* Statistics Cards */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card loading={loading}>
            <Statistic
              title="Total Students"
              value={dashboardData.totalStudents || 0}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#3f8600' }}
              suffix={<ArrowUpOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card loading={loading}>
            <Statistic
              title="Total Lecturers"
              value={dashboardData.totalLecturers || 0}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#1890ff' }}
              suffix={<ArrowUpOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card loading={loading}>
            <Statistic
              title="Total Courses"
              value={dashboardData.totalCourses || 0}
              prefix={<BookOutlined />}
              valueStyle={{ color: '#722ed1' }}
              suffix={<ArrowUpOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card loading={loading}>
            <Statistic
              title="Total Degrees"
              value={dashboardData.totalDegrees || 0}
              prefix={<BankOutlined />}
              valueStyle={{ color: '#fa8c16' }}
              suffix={<ArrowUpOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        {/* Quick Actions */}
        <Col xs={24} lg={12}>
          <Card
            title="Quick Actions"
            style={{ height: '400px' }}
          >
            <Row gutter={[16, 16]}>
              {quickActions.map((action, index) => (
                <Col xs={24} sm={12} key={index}>
                  <Card
                    hoverable
                    size="small"
                    onClick={() => navigate(action.path)}
                    style={{ 
                      cursor: 'pointer',
                      borderLeft: `4px solid ${action.color}`,
                      height: '140px',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                    bodyStyle={{
                      display: 'flex',
                      alignItems: 'center',
                      height: '100%',
                      padding: '16px'
                    }}
                  >
                    <Card.Meta
                      avatar={
                        <div style={{ 
                          color: action.color, 
                          fontSize: '32px',
                          display: 'flex',
                          alignItems: 'center',
                          marginRight: '12px'
                        }}>
                          {action.icon}
                        </div>
                      }
                      title={
                        <div style={{ 
                          fontSize: '16px', 
                          fontWeight: '600',
                          marginBottom: '4px'
                        }}>
                          {action.title}
                        </div>
                      }
                      description={
                        <div style={{ 
                          fontSize: '13px',
                          color: '#666'
                        }}>
                          {action.description}
                        </div>
                      }
                    />
                  </Card>
                </Col>
              ))}
            </Row>
          </Card>
        </Col>

        {/* Recent Activities */}
        <Col xs={24} lg={12}>
          <Card 
            title="Recent Activities" 
            loading={loading}
            style={{ height: '400px' }}
            bodyStyle={{ 
              height: 'calc(100% - 57px)', 
              overflow: 'auto'
            }}
          >
            {recentActivities && recentActivities.length > 0 ? (
              <List
                size="small"
                dataSource={recentActivities}
                renderItem={(item) => (
                  <List.Item style={{ padding: '12px 0' }}>
                    <List.Item.Meta
                      title={<div style={{ fontSize: '14px', fontWeight: '500' }}>{item.title}</div>}
                      description={
                        <Space style={{ marginTop: '4px' }}>
                          <Text type="secondary" style={{ fontSize: '13px' }}>{item.description}</Text>
                          <Tag color="blue" size="small">{item.type}</Tag>
                          <Text type="secondary" style={{ fontSize: '11px' }}>{item.timestamp}</Text>
                        </Space>
                      }
                    />
                  </List.Item>
                )}
              />
            ) : (
              <div style={{ 
                textAlign: 'center', 
                color: '#999', 
                padding: '60px 20px',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Text type="secondary">No recent activities</Text>
              </div>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AdminDashboard;
