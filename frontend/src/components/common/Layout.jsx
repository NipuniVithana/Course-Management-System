import React, { useState } from 'react';
import { Layout as AntLayout, Menu, Avatar, Dropdown, Space, Typography, theme } from 'antd';
import {
  UserOutlined,
  LogoutOutlined,
  DashboardOutlined,
  TeamOutlined,
  BookOutlined,
  ReadOutlined,
  BankOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined
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
      navigate('/profile');
    }
  };

  const handleSidebarMenuClick = ({ key }) => {
    // Handle sidebar navigation
    switch (key) {
      case 'dashboard':
        navigate('/dashboard');
        break;
      // Admin navigation
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
        if (user?.role === 'ADMIN') {
          navigate('/admin/courses');
        } else if (user?.role === 'LECTURER') {
          navigate('/lecturer/all-courses');
        } else if (user?.role === 'STUDENT') {
          navigate('/student/all-courses');
        }
        break;
      // Lecturer navigation
      case 'my-courses':
        if (user?.role === 'LECTURER') {
          navigate('/lecturer/my-courses');
        } else if (user?.role === 'STUDENT') {
          navigate('/student/my-courses');
        }
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
            key: 'all-courses',
            icon: <BookOutlined />,
            label: 'All Courses',
          },
          {
            key: 'my-courses',
            icon: <BookOutlined />,
            label: 'My Courses',
          },
        ];

      case 'STUDENT':
        return [
          ...baseItems,
          {
            key: 'all-courses',
            icon: <BookOutlined />,
            label: 'All Courses',
          },
          {
            key: 'my-courses',
            icon: <BookOutlined />,
            label: 'My Courses',
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
