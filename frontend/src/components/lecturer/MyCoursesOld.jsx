import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Button,
  Typography,
  message,
  Tag,
  Badge
} from 'antd';
import {
  BookOutlined,
  EyeOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import lecturerService from '../../services/lecturerService';

const { Title } = Typography;

const MyCourses = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMyCourses();
  }, []);

  const loadMyCourses = async () => {
    try {
      setLoading(true);
      const data = await lecturerService.getMyCourses();
      setCourses(data);
    } catch (error) {
      console.error('Error loading courses:', error);
      message.error('Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  const handleManageCourse = (course) => {
    navigate(`/lecturer/course/${course.id}`);
  };
        values
      );
      message.success('Grade updated successfully');
      setGradeModal(false);
      gradeForm.resetFields();
      setSelectedStudent(null);
      await loadCourseDetails(selectedCourse.id);
    } catch (error) {
      console.error('Error updating grade:', error);
      message.error('Failed to update grade');
    }
  };

  const showGradeModal = (student) => {
    setSelectedStudent(student);
    gradeForm.setFieldsValue({
      grade: student.grade || '',
      comments: student.comments || ''
    });
    setGradeModal(true);
  };

  const columns = [
    {
      title: 'Course Code',
      dataIndex: 'courseCode',
      key: 'courseCode',
      width: 120,
      render: (text) => <strong>{text}</strong>,
    },
    {
      title: 'Course Title',
      dataIndex: 'title',
      key: 'title',
      ellipsis: true,
    },
    {
      title: 'Department',
      dataIndex: 'department',
      key: 'department',
      width: 150,
    },
    {
      title: 'Credits',
      dataIndex: 'credits',
      key: 'credits',
      width: 80,
      align: 'center',
    },
    {
      title: 'Enrolled Students',
      dataIndex: 'enrolledCount',
      key: 'enrolledCount',
      width: 130,
      align: 'center',
      render: (count) => <Badge count={count} color="blue" />,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => (
        <Tag color={status === 'ACTIVE' ? 'green' : 'red'}>
          {status}
        </Tag>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      width: 120,
      render: (_, record) => (
        <Button
          type="primary"
          size="small"
          icon={<EyeOutlined />}
          onClick={() => showCourseDetails(record)}
        >
          Manage
        </Button>
      ),
    },
  ];

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
      render: (_, record) => `${record.firstName} ${record.lastName}`,
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
      render: (grade) => grade || <Text type="secondary">Not graded</Text>,
    },
    {
      title: 'Action',
      key: 'action',
      width: 120,
      render: (_, record) => (
        <Button
          size="small"
          icon={<EditOutlined />}
          onClick={() => showGradeModal(record)}
        >
          Grade
        </Button>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <div style={{ marginBottom: 16 }}>
          <Title level={4} style={{ margin: 0 }}>
            <BookOutlined /> My Courses
          </Title>
        </div>

        <Table
          columns={columns}
          dataSource={courses}
          rowKey="id"
          loading={loading}
          pagination={{
            total: courses.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} courses`,
          }}
        />
      </Card>

      {/* Course Detail Modal */}
      <Modal
        title={selectedCourse ? `${selectedCourse.courseCode} - ${selectedCourse.title}` : ''}
        open={courseDetailModal}
        onCancel={() => {
          setCourseDetailModal(false);
          setSelectedCourse(null);
        }}
        footer={null}
        width={1000}
      >
        <Tabs defaultActiveKey="students">
          <TabPane tab={`Students (${students.length})`} key="students">
            <div style={{ marginBottom: 16 }}>
              <Text>Manage enrolled students and their grades</Text>
            </div>
            <Table
              columns={studentColumns}
              dataSource={students}
              rowKey="id"
              size="small"
              pagination={{ pageSize: 8 }}
            />
          </TabPane>
          
          <TabPane tab={`Materials (${materials.length})`} key="materials">
            <div style={{ marginBottom: 16 }}>
              <Space>
                <Button
                  type="primary"
                  icon={<UploadOutlined />}
                  onClick={() => setUploadModal(true)}
                >
                  Upload Material
                </Button>
              </Space>
            </div>
            <List
              dataSource={materials}
              renderItem={(material) => (
                <List.Item
                  actions={[
                    <Button size="small" icon={<EyeOutlined />}>View</Button>
                  ]}
                >
                  <List.Item.Meta
                    avatar={<Avatar icon={<FileTextOutlined />} />}
                    title={material.title}
                    description={`Uploaded on ${new Date(material.uploadDate).toLocaleDateString()}`}
                  />
                </List.Item>
              )}
            />
          </TabPane>
        </Tabs>
      </Modal>

      {/* Upload Material Modal */}
      <Modal
        title="Upload Course Material"
        open={uploadModal}
        onCancel={() => {
          setUploadModal(false);
          form.resetFields();
        }}
        footer={null}
      >
        <Form form={form} onFinish={handleUploadMaterial} layout="vertical">
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
          >
            <TextArea rows={3} placeholder="Enter description" />
          </Form.Item>
          <Form.Item
            name="file"
            label="File"
            rules={[{ required: true, message: 'Please upload a file' }]}
          >
            <Upload
              maxCount={1}
              beforeUpload={() => false}
            >
              <Button icon={<UploadOutlined />}>Select File</Button>
            </Upload>
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                Upload
              </Button>
              <Button onClick={() => setUploadModal(false)}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Grade Student Modal */}
      <Modal
        title={`Grade Student: ${selectedStudent?.firstName} ${selectedStudent?.lastName}`}
        open={gradeModal}
        onCancel={() => {
          setGradeModal(false);
          setSelectedStudent(null);
          gradeForm.resetFields();
        }}
        footer={null}
      >
        <Form form={gradeForm} onFinish={handleUpdateGrade} layout="vertical">
          <Form.Item
            name="grade"
            label="Grade"
            rules={[{ required: true, message: 'Please enter a grade' }]}
          >
            <Input placeholder="Enter grade (e.g., A+, B, 85%)" />
          </Form.Item>
          <Form.Item
            name="comments"
            label="Comments"
          >
            <TextArea rows={3} placeholder="Enter feedback comments" />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" icon={<TrophyOutlined />}>
                Update Grade
              </Button>
              <Button onClick={() => setGradeModal(false)}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default MyCourses;
