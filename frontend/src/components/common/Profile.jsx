import React, { useState, useEffect } from 'react';
import {
  Card,
  Form,
  Input,
  Button,
  Avatar,
  Typography,
  Row,
  Col,
  message,
  Space,
  Divider,
  Upload,
  Modal
} from 'antd';
import {
  UserOutlined,
  EditOutlined,
  SaveOutlined,
  CameraOutlined,
  ArrowLeftOutlined
} from '@ant-design/icons';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import studentService from '../../services/studentService';
import lecturerService from '../../services/lecturerService';

const { Title, Text } = Typography;

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      setLoading(true);
      let data;
      if (user?.role === 'STUDENT') {
        data = await studentService.getProfile();
      } else if (user?.role === 'LECTURER') {
        data = await lecturerService.getProfile();
      }
      setProfileData(data);
      form.setFieldsValue(data);
    } catch (error) {
      console.error('Error loading profile:', error);
      message.error('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (values) => {
    try {
      setLoading(true);
      if (user?.role === 'STUDENT') {
        await studentService.updateProfile(values);
      } else if (user?.role === 'LECTURER') {
        await lecturerService.updateProfile(values);
      }
      message.success('Profile updated successfully');
      setEditing(false);
      await loadProfileData();
    } catch (error) {
      console.error('Error updating profile:', error);
      message.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (values) => {
    try {
      setPasswordLoading(true);
      if (user?.role === 'STUDENT') {
        await studentService.changePassword(values);
      } else if (user?.role === 'LECTURER') {
        await lecturerService.changePassword(values);
      }
      message.success('Password changed successfully');
      setShowPasswordModal(false);
      passwordForm.resetFields();
    } catch (error) {
      console.error('Error changing password:', error);
      message.error('Failed to change password');
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleAvatarUpload = async (file) => {
    try {
      setLoading(true);
      if (user?.role === 'STUDENT') {
        await studentService.uploadProfilePicture(file);
      } else if (user?.role === 'LECTURER') {
        await lecturerService.uploadProfilePicture(file);
      }
      message.success('Profile picture updated successfully');
      await loadProfileData();
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      message.error('Failed to upload profile picture');
    } finally {
      setLoading(false);
    }
    return false; // Prevent default upload behavior
  };

  const goBack = () => {
    navigate(-1);
  };

  if (loading && !profileData) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <Title level={3}>Loading Profile...</Title>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <Button 
          icon={<ArrowLeftOutlined />} 
          onClick={goBack}
          style={{ marginBottom: '16px' }}
        >
          Back
        </Button>
        <Title level={2} style={{ margin: 0 }}>
          <UserOutlined /> My Profile
        </Title>
      </div>

      <Row gutter={[24, 24]}>
        {/* Left Column - Profile Picture and Basic Info */}
        <Col xs={24} lg={8}>
          <Card style={{ textAlign: 'center', borderRadius: '8px' }}>
            <div style={{ marginBottom: '16px' }}>
              <Avatar
                size={120}
                icon={<UserOutlined />}
                src={profileData?.profilePicture}
                style={{ marginBottom: '16px' }}
              />
              <Upload
                accept="image/*"
                beforeUpload={handleAvatarUpload}
                showUploadList={false}
                disabled={loading}
              >
                <Button 
                  icon={<CameraOutlined />}
                  type="dashed" 
                  style={{ marginBottom: '16px' }}
                  loading={loading}
                >
                  Change Picture
                </Button>
              </Upload>
            </div>
            
            <Title level={4} style={{ marginBottom: '8px' }}>
              {profileData?.firstName} {profileData?.lastName}
            </Title>
            <Text type="secondary" style={{ display: 'block', marginBottom: '8px' }}>
              {user?.email}
            </Text>
            <Text strong style={{ color: '#1890ff' }}>
              {user?.role}
            </Text>

            {user?.role === 'STUDENT' && profileData && (
              <>
                <Divider />
                <Space direction="vertical" size="small">
                  <Text><strong>Student ID:</strong> {profileData.studentId}</Text>
                  <Text><strong>Program:</strong> {profileData.program}</Text>
                  <Text><strong>Year:</strong> {profileData.yearOfStudy}</Text>
                  {profileData.gpa && <Text><strong>GPA:</strong> {profileData.gpa}</Text>}
                </Space>
              </>
            )}

            {user?.role === 'LECTURER' && profileData && (
              <>
                <Divider />
                <Space direction="vertical" size="small">
                  <Text><strong>Employee ID:</strong> {profileData.employeeId}</Text>
                  <Text><strong>Department:</strong> {profileData.department}</Text>
                  {profileData.officeLocation && <Text><strong>Office:</strong> {profileData.officeLocation}</Text>}
                </Space>
              </>
            )}
          </Card>
        </Col>

        {/* Right Column - Editable Profile Information */}
        <Col xs={24} lg={16}>
          <Card 
            title="Profile Information"
            extra={
              <Space>
                <Button
                  type="primary"
                  onClick={() => setShowPasswordModal(true)}
                >
                  Change Password
                </Button>
                {!editing ? (
                  <Button 
                    type="primary" 
                    icon={<EditOutlined />}
                    onClick={() => setEditing(true)}
                  >
                    Edit Profile
                  </Button>
                ) : (
                  <Space>
                    <Button onClick={() => setEditing(false)}>
                      Cancel
                    </Button>
                    <Button 
                      type="primary" 
                      icon={<SaveOutlined />}
                      onClick={() => form.submit()}
                      loading={loading}
                    >
                      Save Changes
                    </Button>
                  </Space>
                )}
              </Space>
            }
            style={{ borderRadius: '8px' }}
          >
            <Form
              form={form}
              layout="vertical"
              onFinish={handleUpdateProfile}
              disabled={!editing}
            >
              <Row gutter={[16, 16]}>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="firstName"
                    label="First Name"
                    rules={[{ required: true, message: 'Please enter your first name' }]}
                  >
                    <Input placeholder="Enter first name" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="lastName"
                    label="Last Name"
                    rules={[{ required: true, message: 'Please enter your last name' }]}
                  >
                    <Input placeholder="Enter last name" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="phone"
                    label="Phone Number"
                  >
                    <Input placeholder="Enter phone number" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="address"
                    label="Address"
                  >
                    <Input placeholder="Enter address" />
                  </Form.Item>
                </Col>

                {user?.role === 'STUDENT' && (
                  <>
                    <Col xs={24} md={12}>
                      <Form.Item
                        name="program"
                        label="Program"
                      >
                        <Input placeholder="Enter program" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item
                        name="yearOfStudy"
                        label="Year of Study"
                      >
                        <Input placeholder="Enter year of study" />
                      </Form.Item>
                    </Col>
                  </>
                )}

                {user?.role === 'LECTURER' && (
                  <>
                    <Col xs={24} md={12}>
                      <Form.Item
                        name="department"
                        label="Department"
                      >
                        <Input placeholder="Enter department" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item
                        name="officeLocation"
                        label="Office Location"
                      >
                        <Input placeholder="Enter office location" />
                      </Form.Item>
                    </Col>
                  </>
                )}
              </Row>
            </Form>
          </Card>
        </Col>
      </Row>

      {/* Change Password Modal */}
      <Modal
        title="Change Password"
        open={showPasswordModal}
        onCancel={() => {
          setShowPasswordModal(false);
          passwordForm.resetFields();
        }}
        footer={null}
      >
        <Form
          form={passwordForm}
          layout="vertical"
          onFinish={handleChangePassword}
        >
          <Form.Item
            name="currentPassword"
            label="Current Password"
            rules={[{ required: true, message: 'Please enter your current password' }]}
          >
            <Input.Password placeholder="Enter current password" />
          </Form.Item>
          <Form.Item
            name="newPassword"
            label="New Password"
            rules={[
              { required: true, message: 'Please enter a new password' },
              { min: 6, message: 'Password must be at least 6 characters' }
            ]}
          >
            <Input.Password placeholder="Enter new password" />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            label="Confirm New Password"
            dependencies={['newPassword']}
            rules={[
              { required: true, message: 'Please confirm your new password' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Passwords do not match'));
                },
              }),
            ]}
          >
            <Input.Password placeholder="Confirm new password" />
          </Form.Item>
          <div style={{ textAlign: 'right' }}>
            <Space>
              <Button onClick={() => {
                setShowPasswordModal(false);
                passwordForm.resetFields();
              }}>
                Cancel
              </Button>
              <Button 
                type="primary" 
                htmlType="submit"
                loading={passwordLoading}
              >
                Change Password
              </Button>
            </Space>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default Profile;
