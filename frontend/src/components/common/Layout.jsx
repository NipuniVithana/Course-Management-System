import React, { useState } from 'react';
import { Layout as AntLayout, Menu, Avatar, Dropdown, Space, Typography, theme } from 'antd';
import {
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
  DashboardOutlined,
  TeamOutlined,
  BookOutlined,
  FileTextOutlined,
  CalendarOutlined,
  BarChartOutlined,
  ReadOutlined,
  UserAddOutlined,
  BankOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  EditOutlined,
  ProfileOutlined
} from '@ant-design/icons';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const { Header, Sider, Content } = AntLayout;
const { Text } = Typography;

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleMenuClick = ({ key }) => {
    if (key === 'logout') {
      handleLogout();
    } else if (key === 'profile') {
      // Handle profile navigation
      console.log('Profile clicked');
    } else if (key === 'settings') {
      // Handle settings navigation
      console.log('Settings clicked');
    }
  };

  const handleSidebarMenuClick = ({ key }) => {
    // Handle sidebar navigation
    switch (key) {
      case 'dashboard':
        navigate('/dashboard');
        break;
      case 'students':
        navigate('/admin/students');
        break;
      case 'lecturers':
        navigate('/admin/lecturers');
        break;
      case 'degrees':
        navigate('/admin/degrees');
        break;
      case 'all-courses':
        navigate('/admin/courses');
        break;
      default:
        console.log('Menu item clicked:', key);
    }
  };

  const dropdownItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Profile',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Settings',
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      danger: true,
    },
  ];

  const getMenuItems = () => {
    const baseItems = [
      {
        key: 'dashboard',
        icon: <DashboardOutlined />,
        label: 'Home',
      },
    ];

    switch (user?.role) {
      case 'ADMIN':
        return [
          ...baseItems,
          {
            key: 'users',
            icon: <TeamOutlined />,
            label: 'User Management',
            children: [
              {
                key: 'students',
                icon: <TeamOutlined />,
                label: 'Students',
              },
              {
                key: 'lecturers',
                icon: <UserOutlined />,
                label: 'Lecturers',
              },
            ],
          },
          {
            key: 'academic',
            icon: <BookOutlined />,
            label: 'Academic Management',
            children: [
              {
                key: 'degrees',
                icon: <BankOutlined />,
                label: 'Degrees',
              },
              {
                key: 'all-courses',
                icon: <ReadOutlined />,
                label: 'Courses',
              },
            ],
          },
        ];

      case 'LECTURER':
        return [
          ...baseItems,
          {
            key: 'my-courses',
            icon: <BookOutlined />,
            label: 'My Courses',
          },
          {
            key: 'students',
            icon: <TeamOutlined />,
            label: 'My Students',
          },
          {
            key: 'assignments',
            icon: <FileTextOutlined />,
            label: 'Assignments',
            children: [
              {
                key: 'view-assignments',
                icon: <ReadOutlined />,
                label: 'View Assignments',
              },
              {
                key: 'create-assignment',
                icon: <EditOutlined />,
                label: 'Create Assignment',
              },
              {
                key: 'grade-assignments',
                icon: <BarChartOutlined />,
                label: 'Grade Assignments',
              },
            ],
          },
          {
            key: 'schedule',
            icon: <CalendarOutlined />,
            label: 'Schedule',
          },
          {
            key: 'materials',
            icon: <BankOutlined />,
            label: 'Course Materials',
          },
        ];

      case 'STUDENT':
        return [
          ...baseItems,
          {
            key: 'my-courses',
            icon: <BookOutlined />,
            label: 'My Courses',
          },
          {
            key: 'assignments',
            icon: <FileTextOutlined />,
            label: 'Assignments',
            children: [
              {
                key: 'pending-assignments',
                icon: <FileTextOutlined />,
                label: 'Pending',
              },
              {
                key: 'submitted-assignments',
                icon: <ReadOutlined />,
                label: 'Submitted',
              },
              {
                key: 'graded-assignments',
                icon: <BarChartOutlined />,
                label: 'Graded',
              },
            ],
          },
          {
            key: 'schedule',
            icon: <CalendarOutlined />,
            label: 'Class Schedule',
          },
          {
            key: 'grades',
            icon: <BarChartOutlined />,
            label: 'My Grades',
          },
          {
            key: 'enrollment',
            icon: <UserAddOutlined />,
            label: 'Course Enrollment',
          },
          {
            key: 'profile',
            icon: <ProfileOutlined />,
            label: 'My Profile',
          },
        ];

      default:
        return baseItems;
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'ADMIN':
        return '#1890ff'; // Blue
      case 'LECTURER':
        return '#52c41a'; // Green
      case 'STUDENT':
        return '#fa8c16'; // Orange
      default:
        return '#1890ff';
    }
  };

  const getRoleName = (role) => {
    switch (role) {
      case 'ADMIN':
        return 'Administrator';
      case 'LECTURER':
        return 'Lecturer';
      case 'STUDENT':
        return 'Student';
      default:
        return role;
    }
  };

  return (
    <AntLayout style={{ minHeight: '100vh' }}>
      <Sider 
        trigger={null} 
        collapsible 
        collapsed={collapsed}
        width={280}
        collapsedWidth={80}
        style={{
          background: colorBgContainer,
          borderRight: '1px solid #f0f0f0',
        }}
      >
        <div style={{ 
          height: 64, 
          margin: 16, 
          background: getRoleColor(user?.role),
          borderRadius: borderRadiusLG,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: collapsed ? '12px' : '16px',
          fontWeight: 'bold',
          textAlign: 'center',
          padding: '0 8px'
        }}>
          {collapsed ? 'UoK' : 'University of Kelaniya'}
        </div>
        <Menu
          mode="inline"
          defaultSelectedKeys={['dashboard']}
          items={getMenuItems()}
          onClick={handleSidebarMenuClick}
          style={{ border: 'none' }}
        />
      </Sider>
      
      <AntLayout>
        <Header
          style={{
            padding: '0 16px',
            background: colorBgContainer,
            borderBottom: '1px solid #f0f0f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
              className: 'trigger',
              onClick: () => setCollapsed(!collapsed),
              style: { fontSize: '18px', cursor: 'pointer' },
            })}
            <Text strong style={{ marginLeft: 16, color: getRoleColor(user?.role) }}>
              University of Kelaniya - {getRoleName(user?.role)} Portal
            </Text>
          </div>

          <Dropdown
            menu={{ items: dropdownItems, onClick: handleMenuClick }}
            placement="bottomRight"
            arrow
          >
            <Space style={{ cursor: 'pointer' }}>
              <Text>Welcome, {user?.role === 'ADMIN' ? 'Admin' : (user?.firstName || user?.name || user?.email)}</Text>
              <Avatar 
                size="small" 
                style={{ backgroundColor: getRoleColor(user?.role) }}
                icon={<UserOutlined />}
              >
                {user?.role === 'ADMIN' ? 'A' : (user?.firstName || user?.name || user?.email)?.charAt(0)?.toUpperCase()}
              </Avatar>
            </Space>
          </Dropdown>
        </Header>
        
        <Content
          style={{
            margin: 24,
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          {children}
        </Content>
      </AntLayout>
    </AntLayout>
  );
};

export default Layout;
