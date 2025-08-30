import React, { useState } from 'react';
import {
  Form,
  Input,
  Button,
  Typography,
  Card,
  Alert,
  Select,
  Row,
  Col
} from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined, IdcardOutlined } from '@ant-design/icons';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const { Title, Text, Link } = Typography;
const { Option } = Select;

const Register = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  
  const { register, error, clearError } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    setLoading(true);
    
    try {
      console.log('Attempting registration with:', values);
      const result = await register(values);
      console.log('Registration successful:', result);
      navigate('/login');
    } catch (err) {
      console.error('Registration error:', err);
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
        <Col xs={24} sm={20} md={16} lg={12} xl={10}>
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
                Create Your Account
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
              name="register"
              onFinish={handleSubmit}
              onValuesChange={handleFormChange}
              layout="vertical"
              requiredMark={false}
            >
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="firstName"
                    label="First Name"
                    rules={[{ required: true, message: 'Please input your first name!' }]}
                  >
                    <Input
                      prefix={<UserOutlined />}
                      placeholder="First name"
                      size="large"
                      disabled={loading}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="lastName"
                    label="Last Name"
                    rules={[{ required: true, message: 'Please input your last name!' }]}
                  >
                    <Input
                      prefix={<UserOutlined />}
                      placeholder="Last name"
                      size="large"
                      disabled={loading}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                name="email"
                label="Email Address"
                rules={[
                  { required: true, message: 'Please input your email!' },
                  { type: 'email', message: 'Please enter a valid email!' }
                ]}
              >
                <Input
                  prefix={<MailOutlined />}
                  placeholder="Enter your email"
                  size="large"
                  disabled={loading}
                />
              </Form.Item>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="password"
                    label="Password"
                    rules={[
                      { required: true, message: 'Please input your password!' },
                      { min: 6, message: 'Password must be at least 6 characters!' }
                    ]}
                  >
                    <Input.Password
                      prefix={<LockOutlined />}
                      placeholder="Enter password"
                      size="large"
                      disabled={loading}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="confirmPassword"
                    label="Confirm Password"
                    dependencies={['password']}
                    rules={[
                      { required: true, message: 'Please confirm your password!' },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || getFieldValue('password') === value) {
                            return Promise.resolve();
                          }
                          return Promise.reject(new Error('Passwords do not match!'));
                        },
                      }),
                    ]}
                  >
                    <Input.Password
                      prefix={<LockOutlined />}
                      placeholder="Confirm password"
                      size="large"
                      disabled={loading}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                name="role"
                label="Role"
                initialValue="STUDENT"
                rules={[{ required: true, message: 'Please select your role!' }]}
              >
                <Select size="large" disabled={loading}>
                  <Option value="STUDENT">Student</Option>
                  <Option value="LECTURER">Lecturer</Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="phone"
                label="Phone Number"
              >
                <Input
                  prefix={<PhoneOutlined />}
                  placeholder="Phone number (optional)"
                  size="large"
                  disabled={loading}
                />
              </Form.Item>

              <Form.Item
                noStyle
                shouldUpdate={(prevValues, currentValues) => prevValues.role !== currentValues.role}
              >
                {({ getFieldValue }) => {
                  const role = getFieldValue('role');
                  return role === 'STUDENT' ? (
                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item
                          name="studentId"
                          label="Student ID"
                        >
                          <Input
                            prefix={<IdcardOutlined />}
                            placeholder="Student ID (optional)"
                            size="large"
                            disabled={loading}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          name="program"
                          label="Program"
                        >
                          <Input
                            placeholder="Program (optional)"
                            size="large"
                            disabled={loading}
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                  ) : role === 'LECTURER' ? (
                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item
                          name="department"
                          label="Department"
                        >
                          <Input
                            placeholder="Department (optional)"
                            size="large"
                            disabled={loading}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          name="officeLocation"
                          label="Office Location"
                        >
                          <Input
                            placeholder="Office location (optional)"
                            size="large"
                            disabled={loading}
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                  ) : null;
                }}
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
                  Create Account
                </Button>
              </Form.Item>
            </Form>

            <div style={{ textAlign: 'center' }}>
              <Text>Already have an account? </Text>
              <Link>
                <RouterLink to="/login">Sign In</RouterLink>
              </Link>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Register;
