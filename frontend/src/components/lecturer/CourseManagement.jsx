import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Button,
  Typography,
  message,
  Tag,
  Modal,
  Form,
  Input,
  Upload,
  Space,
  Tabs,
  List,
  Avatar,
  Breadcrumb,
  Row,
  Col,
  Statistic,
  Divider,
  Spin,
  Dropdown
} from 'antd';
import {
  BookOutlined,
  UploadOutlined,
  FileTextOutlined,
  EditOutlined,
  TrophyOutlined,
  HomeOutlined,
  UserOutlined,
  TeamOutlined,
  CalendarOutlined,
  ArrowLeftOutlined,
  MoreOutlined,
  DeleteOutlined,
  DownloadOutlined
} from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import lecturerService from '../../services/lecturerService';

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { TextArea } = Input;

const CourseManagement = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [uploadModal, setUploadModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [gradeModal, setGradeModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [activeTab, setActiveTab] = useState('materials');
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  const [gradeForm] = Form.useForm();

  useEffect(() => {
    const loadData = async () => {
      if (courseId) {
        try {
          setLoading(true);
          const [courseData, studentsData, materialsData] = await Promise.all([
            lecturerService.getCourseById(courseId),
            lecturerService.getEnrolledStudents(courseId),
            lecturerService.getCourseMaterials(courseId)
          ]);
          setCourse(courseData);
          setStudents(studentsData);
          setMaterials(materialsData);
        } catch (error) {
          console.error('Error loading course data:', error);
          message.error('Failed to load course data');
        } finally {
          setLoading(false);
        }
      }
    };
    
    loadData();
  }, [courseId]);

  const loadCourseData = async () => {
    try {
      const [studentsData, materialsData] = await Promise.all([
        lecturerService.getEnrolledStudents(courseId),
        lecturerService.getCourseMaterials(courseId)
      ]);
      setStudents(studentsData);
      setMaterials(materialsData);
    } catch (error) {
      console.error('Error loading course data:', error);
      message.error('Failed to load course data');
    }
  };

  const handleUploadMaterial = async (values) => {
    try {
      await lecturerService.uploadCourseMaterial(courseId, values);
      message.success('Material uploaded successfully');
      setUploadModal(false);
      form.resetFields();
      await loadCourseData();
    } catch (error) {
      console.error('Error uploading material:', error);
      message.error('Failed to upload material');
    }
  };

  const handleUpdateGrade = async (values) => {
    try {
      await lecturerService.updateStudentGrade(
        courseId,
        selectedStudent.id,
        values
      );
      message.success('Grade updated successfully');
      setGradeModal(false);
      gradeForm.resetFields();
      await loadCourseData();
    } catch (error) {
      console.error('Error updating grade:', error);
      message.error('Failed to update grade');
    }
  };

  const handleEditMaterial = (material) => {
    setSelectedMaterial(material);
    editForm.setFieldsValue({
      title: material.title,
      description: material.description
    });
    setEditModal(true);
  };

  const handleUpdateMaterial = async (values) => {
    try {
      await lecturerService.updateCourseMaterial(courseId, selectedMaterial.id, values);
      message.success('Material updated successfully');
      setEditModal(false);
      editForm.resetFields();
      setSelectedMaterial(null);
      await loadCourseData();
    } catch (error) {
      console.error('Error updating material:', error);
      message.error('Failed to update material');
    }
  };

  const handleDeleteMaterial = async (material) => {
    Modal.confirm({
      title: 'Delete Material',
      content: `Are you sure you want to delete "${material.title}"?`,
      okText: 'Yes, Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          await lecturerService.deleteCourseMaterial(courseId, material.id);
          message.success('Material deleted successfully');
          await loadCourseData();
        } catch (error) {
          console.error('Error deleting material:', error);
          message.error('Failed to delete material');
        }
      }
    });
  };

  const handleDownloadMaterial = (material) => {
    // In a real implementation, you would download the actual file
    message.info(`Downloading ${material.fileName}...`);
    // Simulate download
    const link = document.createElement('a');
    link.href = '#'; // In real implementation, this would be the file URL
    link.download = material.fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const showGradeModal = (student) => {
    setSelectedStudent(student);
    gradeForm.setFieldsValue({
      grade: student.grade || '',
      feedback: student.feedback || ''
    });
    setGradeModal(true);
  };

  const studentColumns = [
    {
      title: 'Student ID',
      dataIndex: 'studentId',
      key: 'studentId',
      width: 120,
    },
    {
      title: 'Name',
      key: 'name',
      render: (_, record) => (
        <Space>
          <Avatar icon={<UserOutlined />} />
          {`${record.firstName} ${record.lastName}`}
        </Space>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Grade',
      dataIndex: 'grade',
      key: 'grade',
      width: 100,
      render: (grade) => (
        grade ? (
          <Tag color={grade >= 85 ? 'green' : grade >= 70 ? 'blue' : grade >= 60 ? 'orange' : 'red'}>
            {grade}%
          </Tag>
        ) : (
          <Tag color="default">N/A</Tag>
        )
      ),
    },
    {
      title: 'Action',
      key: 'action',
      width: 150,
      render: (_, record) => (
        <Space>
          <Button
            size="small"
            icon={<EditOutlined />}
            onClick={() => showGradeModal(record)}
          >
            Grade
          </Button>
        </Space>
      ),
    },
  ];

  if (loading) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!course) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <Title level={4}>Course not found</Title>
        <Button onClick={() => navigate('/lecturer/my-courses')}>
          Go back to My Courses
        </Button>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <Breadcrumb style={{ marginBottom: 16 }}>
          <Breadcrumb.Item>
            <HomeOutlined />
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Button 
              type="link" 
              style={{ padding: 0 }}
              onClick={() => navigate('/lecturer/my-courses')}
            >
              My Courses
            </Button>
          </Breadcrumb.Item>
          <Breadcrumb.Item>{course.title}</Breadcrumb.Item>
        </Breadcrumb>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <Title level={2} style={{ margin: 0, color: '#1890ff' }}>
              <BookOutlined /> {course.title}
            </Title>
            <Space style={{ marginTop: 8 }}>
              <Tag color="blue">{course.courseCode}</Tag>
              <Tag color="green">{course.credits} Credits</Tag>
              <Tag color="orange">{course.department}</Tag>
              <Tag color={course.status === 'ACTIVE' ? 'green' : 'red'}>
                {course.status}
              </Tag>
            </Space>
          </div>
          <Button 
            icon={<ArrowLeftOutlined />} 
            onClick={() => navigate('/lecturer/my-courses')}
          >
            Back to My Courses
          </Button>
        </div>
      </div>

      {/* Course Statistics */}
      <Card style={{ marginBottom: 24 }}>
        <Row gutter={16}>
          <Col span={8}>
            <Statistic
              title="Enrolled Students"
              value={students.length}
              prefix={<TeamOutlined />}
            />
          </Col>
          <Col span={8}>
            <Statistic
              title="Course Materials"
              value={materials.length}
              prefix={<FileTextOutlined />}
            />
          </Col>
          <Col span={8}>
            <Statistic
              title="Average Grade"
              value={students.length > 0 ? 
                (students.filter(s => s.grade).reduce((sum, s) => sum + s.grade, 0) / 
                students.filter(s => s.grade).length || 0).toFixed(1) : 0
              }
              suffix="%"
              prefix={<TrophyOutlined />}
            />
          </Col>
        </Row>
      </Card>

      {/* Main Content Tabs */}
      <Card>
        <Tabs activeKey={activeTab} onChange={setActiveTab} size="large">
          <TabPane 
            tab={
              <span>
                <FileTextOutlined />
                Materials ({materials.length})
              </span>
            } 
            key="materials"
          >
            <div style={{ marginBottom: 16 }}>
              <Button
                type="primary"
                icon={<UploadOutlined />}
                onClick={() => setUploadModal(true)}
              >
                Upload Material
              </Button>
            </div>
            <List
              dataSource={materials}
              renderItem={(material) => {
                const menuItems = [
                  {
                    key: 'edit',
                    label: 'Edit',
                    icon: <EditOutlined />,
                    onClick: () => handleEditMaterial(material)
                  },
                  {
                    key: 'download',
                    label: 'Download',
                    icon: <DownloadOutlined />,
                    onClick: () => handleDownloadMaterial(material)
                  },
                  {
                    key: 'delete',
                    label: 'Delete',
                    icon: <DeleteOutlined />,
                    danger: true,
                    onClick: () => handleDeleteMaterial(material)
                  }
                ];

                return (
                  <List.Item
                    actions={[
                      <Dropdown
                        menu={{ items: menuItems }}
                        trigger={['click']}
                        placement="bottomRight"
                      >
                        <Button
                          type="text"
                          icon={<MoreOutlined />}
                          style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center' 
                          }}
                        />
                      </Dropdown>
                    ]}
                  >
                    <List.Item.Meta
                      avatar={<Avatar icon={<FileTextOutlined />} />}
                      title={material.title}
                      description={
                        <Space direction="vertical" size={4}>
                          <Text type="secondary">{material.description}</Text>
                          <Space>
                            <Text type="secondary" style={{ fontSize: '12px' }}>
                              <CalendarOutlined /> Uploaded: {new Date(material.uploadDate).toLocaleDateString()}
                            </Text>
                            <Text type="secondary" style={{ fontSize: '12px' }}>
                              📁 {material.fileName}
                            </Text>
                            <Text type="secondary" style={{ fontSize: '12px' }}>
                              📊 {(material.fileSize / 1024).toFixed(1)} KB
                            </Text>
                          </Space>
                        </Space>
                      }
                    />
                  </List.Item>
                );
              }}
              locale={{ emptyText: 'No materials uploaded yet' }}
            />
          </TabPane>

          <TabPane 
            tab={
              <span>
                <TeamOutlined />
                Students ({students.length})
              </span>
            } 
            key="students"
          >
            <Table
              columns={studentColumns}
              dataSource={students}
              rowKey="id"
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total) => `Total ${total} students`
              }}
            />
          </TabPane>

          <TabPane 
            tab={
              <span>
                <TrophyOutlined />
                Results
              </span>
            } 
            key="results"
          >
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <TrophyOutlined style={{ fontSize: 48, color: '#d9d9d9', marginBottom: 16 }} />
              <Title level={4} type="secondary">Results Summary</Title>
              <Text type="secondary">
                Detailed results and analytics will be available here
              </Text>
              <Divider />
              <Row gutter={16} style={{ marginTop: 24 }}>
                <Col span={8}>
                  <Card>
                    <Statistic
                      title="Pass Rate"
                      value={students.length > 0 ? 
                        ((students.filter(s => s.grade >= 60).length / students.length) * 100).toFixed(1) : 0
                      }
                      suffix="%"
                      valueStyle={{ color: '#3f8600' }}
                    />
                  </Card>
                </Col>
                <Col span={8}>
                  <Card>
                    <Statistic
                      title="Highest Grade"
                      value={students.length > 0 ? Math.max(...students.map(s => s.grade || 0)) : 0}
                      suffix="%"
                      valueStyle={{ color: '#1890ff' }}
                    />
                  </Card>
                </Col>
                <Col span={8}>
                  <Card>
                    <Statistic
                      title="Lowest Grade"
                      value={students.length > 0 ? Math.min(...students.filter(s => s.grade).map(s => s.grade)) || 0 : 0}
                      suffix="%"
                      valueStyle={{ color: '#cf1322' }}
                    />
                  </Card>
                </Col>
              </Row>
            </div>
          </TabPane>
        </Tabs>
      </Card>

      {/* Upload Material Modal */}
      <Modal
        title="Upload Course Material"
        open={uploadModal}
        onOk={form.submit}
        onCancel={() => setUploadModal(false)}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleUploadMaterial}
        >
          <Form.Item
            name="title"
            label="Material Title"
            rules={[{ required: true, message: 'Please enter material title' }]}
          >
            <Input placeholder="Enter material title" />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: 'Please enter description' }]}
          >
            <TextArea rows={4} placeholder="Enter material description" />
          </Form.Item>
          <Form.Item
            name="file"
            label="File"
            rules={[{ required: true, message: 'Please select a file' }]}
          >
            <Upload.Dragger
              beforeUpload={() => false} // Prevent auto upload
              maxCount={1}
              accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.xls,.xlsx"
            >
              <p className="ant-upload-drag-icon">
                <UploadOutlined />
              </p>
              <p className="ant-upload-text">Click or drag file to this area to upload</p>
              <p className="ant-upload-hint">
                Support for PDF, DOC, PPT, and other document formats (Max: 50MB)
              </p>
            </Upload.Dragger>
          </Form.Item>
        </Form>
      </Modal>

      {/* Edit Material Modal */}
      <Modal
        title="Edit Course Material"
        open={editModal}
        onOk={editForm.submit}
        onCancel={() => {
          setEditModal(false);
          setSelectedMaterial(null);
          editForm.resetFields();
        }}
        width={600}
      >
        <Form
          form={editForm}
          layout="vertical"
          onFinish={handleUpdateMaterial}
        >
          <Form.Item
            name="title"
            label="Material Title"
            rules={[{ required: true, message: 'Please enter material title' }]}
          >
            <Input placeholder="Enter material title" />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: 'Please enter description' }]}
          >
            <TextArea rows={4} placeholder="Enter material description" />
          </Form.Item>
          {selectedMaterial && (
            <div style={{ padding: '12px', backgroundColor: '#f5f5f5', borderRadius: '8px', marginBottom: '16px' }}>
              <Text strong>Current File: </Text>
              <Text>{selectedMaterial.fileName}</Text>
              <br />
              <Text type="secondary" style={{ fontSize: '12px' }}>
                To replace the file, upload a new material instead.
              </Text>
            </div>
          )}
        </Form>
      </Modal>

      {/* Grade Modal */}
      <Modal
        title={`Update Grade - ${selectedStudent?.firstName} ${selectedStudent?.lastName}`}
        open={gradeModal}
        onOk={gradeForm.submit}
        onCancel={() => setGradeModal(false)}
      >
        <Form
          form={gradeForm}
          layout="vertical"
          onFinish={handleUpdateGrade}
        >
          <Form.Item
            name="grade"
            label="Grade (%)"
            rules={[
              { required: true, message: 'Please enter grade' },
              { type: 'number', min: 0, max: 100, message: 'Grade must be between 0 and 100' }
            ]}
          >
            <Input type="number" placeholder="Enter grade (0-100)" />
          </Form.Item>
          <Form.Item
            name="feedback"
            label="Feedback"
          >
            <TextArea rows={4} placeholder="Enter feedback for student" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CourseManagement;
