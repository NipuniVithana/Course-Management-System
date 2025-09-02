import React, { useState } from 'react';
import {
  Form,
  Input,
  Button,
  Typography,
  Card,
  Alert,
  Space,
  Divider,
  Row,
  Col
} from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const { Title, Text, Link } = Typography;

const Login = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  
  const { login, error, clearError } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    setLoading(true);
    
    try {
      const result = await login(values.email, values.password);
      navigate('/dashboard');
    } catch (err) {
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = () => {
    if (error) clearError();
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#ffffff',
      padding: '20px'
    }}>
      <Row justify="center" style={{ width: '100%' }}>
        <Col xs={24} sm={20} md={16} lg={12} xl={8}>
          <Card
            style={{
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
              borderRadius: '12px',
              border: 'none'
            }}
          >
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <Title level={2} style={{ color: '#1890ff', marginBottom: '8px' }}>
                Course Management System
              </Title>
              <Title level={4} style={{ color: '#666', fontWeight: 400 }}>
                Sign In to Your Account
              </Title>
            </div>

            {error && (
              <Alert
                message={error}
                type="error"
                style={{ marginBottom: '24px' }}
                closable
                onClose={clearError}
              />
            )}

            <Form
              form={form}
              name="login"
              onFinish={handleSubmit}
              onValuesChange={handleFormChange}
              layout="vertical"
              requiredMark={false}
            >
              <Form.Item
                name="email"
                label="Email Address"
                rules={[
                  { required: true, message: 'Please input your email!' },
                  { type: 'email', message: 'Please enter a valid email!' }
                ]}
              >
                <Input
                  prefix={<UserOutlined />}
                  placeholder="Enter your email"
                  size="large"
                  disabled={loading}
                />
              </Form.Item>

              <Form.Item
                name="password"
                label="Password"
                rules={[{ required: true, message: 'Please input your password!' }]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="Enter your password"
                  size="large"
                  disabled={loading}
                />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  size="large"
                  block
                  style={{ marginTop: '16px' }}
                >
                  Sign In
                </Button>
              </Form.Item>
            </Form>

            <div style={{ textAlign: 'center' }}>
              <Text>Don't have an account? </Text>
              <Link>
                <RouterLink to="/register">Sign Up</RouterLink>
              </Link>
            </div>

            <Divider>Demo Credentials</Divider>

            <Card 
              size="small" 
              style={{ 
                background: '#f8f9fa', 
                border: '1px solid #e9ecef',
                borderRadius: '8px'
              }}
            >
              <Space direction="vertical" style={{ width: '100%' }}>
                <div>
                  <Text strong style={{ color: '#1890ff' }}>Admin:</Text>
                  <Text style={{ marginLeft: '8px' }}>admin@university.edu / admin123</Text>
                </div>
                <div>
                  <Text strong style={{ color: '#52c41a' }}>Lecturer:</Text>
                  <Text style={{ marginLeft: '8px' }}>lecturer@university.edu / lecturer123</Text>
                </div>
                <div>
                  <Text strong style={{ color: '#fa8c16' }}>Student:</Text>
                  <Text style={{ marginLeft: '8px' }}>student@university.edu / student123</Text>
                </div>
              </Space>
            </Card>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Login;
