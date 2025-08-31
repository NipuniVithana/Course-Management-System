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
  InputNumber,
  Upload,
  Space,
  Tabs,
  List,
  Avatar,
  Breadcrumb,
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
import studentService from '../../services/studentService';

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { TextArea } = Input;

const CourseManagement = ({ userRole = 'LECTURER' }) => {
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

  // Role-based configuration
  const isStudent = userRole === 'STUDENT';
  const [studentGrade, setStudentGrade] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      if (courseId) {
        try {
          setLoading(true);
          if (isStudent) {
            // For students, load course data, materials, students, and their grades
            const [courseData, materialsData, studentsData, gradesData] = await Promise.all([
              studentService.getCourseById(courseId),
              studentService.getCourseMaterials(courseId).catch(() => []),
              studentService.getCourseStudents(courseId).catch(() => []),
              studentService.getCourseGrades(courseId).catch(() => null)
            ]);
            setCourse(courseData);
            setMaterials(materialsData);
            setStudents(studentsData);
            setStudentGrade(gradesData);
          } else {
            // For lecturers, load all data as before
            const [courseData, studentsData, materialsData] = await Promise.all([
              lecturerService.getCourseById(courseId),
              lecturerService.getEnrolledStudents(courseId),
              lecturerService.getCourseMaterials(courseId)
            ]);
            setCourse(courseData);
            setStudents(studentsData);
            setMaterials(materialsData);
          }
        } catch (error) {
          console.error('Error loading course data:', error);
          message.error('Failed to load course data');
        } finally {
          setLoading(false);
        }
      }
    };
    
    loadData();
  }, [courseId, isStudent]);

  const loadCourseData = async () => {
    try {
      if (isStudent) {
        // For students, reload materials and students using student endpoints
        const [materialsData, studentsData, gradesData] = await Promise.all([
          studentService.getCourseMaterials(courseId).catch(() => []),
          studentService.getCourseStudents(courseId).catch(() => []),
          studentService.getCourseGrades(courseId).catch(() => null)
        ]);
        setMaterials(materialsData);
        setStudents(studentsData);
        setStudentGrade(gradesData);
      } else {
        // For lecturers, reload all data
        const [studentsData, materialsData] = await Promise.all([
          lecturerService.getEnrolledStudents(courseId),
          lecturerService.getCourseMaterials(courseId)
        ]);
        setStudents(studentsData);
        setMaterials(materialsData);
      }
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
      
      // Update the local students state immediately
      setStudents(prevStudents => 
        prevStudents.map(student => 
          student.id === selectedStudent.id 
            ? { ...student, grade: values.grade, feedback: values.feedback }
            : student
        )
      );
      
      message.success('Grade updated successfully');
      setGradeModal(false);
      gradeForm.resetFields();
      setSelectedStudent(null);
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
      grade: student.grade ? Number(student.grade) : undefined,
      feedback: student.feedback || ''
    });
    setGradeModal(true);
  };

  const studentColumns = [
    {
      title: 'Student ID',
      dataIndex: 'studentId',
      key: 'studentId',
      width: 150,
    },
    {
      title: 'Name',
      key: 'name',
      width: 250,
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
      width: 280,
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
        <Button onClick={() => navigate(isStudent ? '/student/my-courses' : '/lecturer/my-courses')}>
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
            <span 
              style={{ 
                color: '#1890ff', 
                cursor: 'pointer',
                textDecoration: 'none'
              }}
              onClick={() => navigate(isStudent ? '/student/my-courses' : '/lecturer/my-courses')}
            >
              My Courses
            </span>
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
            onClick={() => navigate(isStudent ? '/student/my-courses' : '/lecturer/my-courses')}
          >
            Back to My Courses
          </Button>
        </div>
      </div>



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
            {!isStudent && (
              <div style={{ marginBottom: 16 }}>
                <Button
                  type="primary"
                  icon={<UploadOutlined />}
                  onClick={() => setUploadModal(true)}
                >
                  Upload Material
                </Button>
              </div>
            )}
            <List
              dataSource={materials}
              renderItem={(material) => {
                let menuItems = [
                  {
                    key: 'download',
                    label: 'Download',
                    icon: <DownloadOutlined />,
                    onClick: () => handleDownloadMaterial(material)
                  }
                ];

                // Only add edit and delete options for lecturers
                if (!isStudent) {
                  menuItems = [
                    {
                      key: 'edit',
                      label: 'Edit',
                      icon: <EditOutlined />,
                      onClick: () => handleEditMaterial(material)
                    },
                    ...menuItems,
                    {
                      key: 'delete',
                      label: 'Delete',
                      icon: <DeleteOutlined />,
                      danger: true,
                      onClick: () => handleDeleteMaterial(material)
                    }
                  ];
                }

                return (
                  <List.Item
                    actions={
                      isStudent ? [
                        // For students, show only download button directly
                        <Button
                          type="text"
                          icon={<DownloadOutlined />}
                          onClick={() => handleDownloadMaterial(material)}
                        >
                          Download
                        </Button>
                      ] : [
                        // For lecturers, show dropdown menu
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
                      ]
                    }
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
              scroll={{ x: 700 }}
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
            <div style={{ marginBottom: 16 }}>
              <Title level={4}>
                {isStudent ? 'My Results' : 'Student Results'}
              </Title>
              <Text type="secondary">
                {isStudent ? 'View your grades and feedback' : 'Add and manage student grades'}
              </Text>
            </div>
            
            {isStudent ? (
              // Student view - show only their own results
              <div style={{ padding: '24px', textAlign: 'center' }}>
                <Title level={3}>Your Grade for this Course</Title>
                <div style={{ 
                  padding: '32px', 
                  backgroundColor: '#f5f5f5', 
                  borderRadius: '8px',
                  marginTop: '16px'
                }}>
                  {studentGrade ? (
                    <>
                      <Tag 
                        color={studentGrade.grade >= 85 ? 'green' : studentGrade.grade >= 70 ? 'blue' : studentGrade.grade >= 60 ? 'orange' : 'red'}
                        style={{ fontSize: '24px', padding: '12px 24px', borderRadius: '8px' }}
                      >
                        Grade: {studentGrade.grade}%
                      </Tag>
                      {studentGrade.feedback && (
                        <div style={{ marginTop: '16px' }}>
                          <Title level={5}>Feedback:</Title>
                          <Text style={{ fontStyle: 'italic' }}>{studentGrade.feedback}</Text>
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      <Tag 
                        color="default" 
                        style={{ fontSize: '24px', padding: '12px 24px', borderRadius: '8px' }}
                      >
                        Grade: Not Available
                      </Tag>
                      <div style={{ marginTop: '16px', color: '#666' }}>
                        <Text>Your grade has not been assigned yet</Text>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ) : (
              // Lecturer view - show all students with grade management
              <Table
                columns={[
                  {
                    title: 'Student ID',
                    dataIndex: 'studentId',
                    key: 'studentId',
                    width: 150,
                  },
                  {
                    title: 'Name',
                    key: 'name',
                    width: 280,
                    render: (_, record) => (
                      <Space>
                        <Avatar icon={<UserOutlined />} />
                        {`${record.firstName} ${record.lastName}`}
                      </Space>
                    ),
                  },
                  {
                    title: 'Current Grade',
                    dataIndex: 'grade',
                    key: 'grade',
                    width: 150,
                    align: 'center',
                    render: (grade) => (
                      grade ? (
                        <Tag color={grade >= 85 ? 'green' : grade >= 70 ? 'blue' : grade >= 60 ? 'orange' : 'red'}>
                          {grade}%
                        </Tag>
                      ) : (
                        <Tag color="default">No Grade</Tag>
                      )
                    ),
                  },
                  {
                    title: 'Action',
                    key: 'action',
                    width: 150,
                    align: 'center',
                    render: (_, record) => (
                      <Button
                        type="primary"
                        size="small"
                        icon={<EditOutlined />}
                        onClick={() => showGradeModal(record)}
                      >
                        {record.grade ? 'Edit Grade' : 'Add Grade'}
                      </Button>
                    ),
                  },
                ]}
                dataSource={students}
                rowKey="id"
                scroll={{ x: 730 }}
              />
            )}
          </TabPane>
        </Tabs>
      </Card>

      {/* Lecturer-only Modals */}
      {!isStudent && (
        <>
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
              { 
                validator: (_, value) => {
                  if (value === null || value === undefined) {
                    return Promise.reject(new Error('Please enter grade'));
                  }
                  if (value < 0 || value > 100) {
                    return Promise.reject(new Error('Grade must be between 0 and 100'));
                  }
                  return Promise.resolve();
                }
              }
            ]}
          >
            <InputNumber 
              min={0} 
              max={100} 
              style={{ width: '100%' }}
              placeholder="Enter grade (0-100)" 
            />
          </Form.Item>
          <Form.Item
            name="feedback"
            label="Feedback"
          >
            <TextArea rows={4} placeholder="Enter feedback for student" />
          </Form.Item>
        </Form>
      </Modal>
        </>
      )}
    </div>
  );
};

export default CourseManagement;
