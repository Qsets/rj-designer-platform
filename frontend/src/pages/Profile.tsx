import React, { useState } from 'react';
import { Card, Avatar, Button, Form, Input, Upload, message, Tabs, Row, Col, Statistic, Tag, List, Typography } from 'antd';
import { UserOutlined, EditOutlined, CameraOutlined, UploadOutlined, EyeOutlined, HeartOutlined, MessageOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import './Profile.css';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

interface UserProfile {
  id: string;
  nickname: string;
  email: string;
  avatar?: string;
  bio?: string;
  role: 'DESIGNER' | 'OWNER';
  joinDate: string;
  location?: string;
  website?: string;
  skills?: string[];
  stats: {
    projects: number;
    followers: number;
    following: number;
    likes: number;
  };
}

interface Work {
  id: string;
  title: string;
  image: string;
  likes: number;
  views: number;
  category: string;
}

const Profile: React.FC = () => {
  const [editing, setEditing] = useState(false);
  const [form] = Form.useForm();
  
  // 模拟用户数据
  const [userProfile, setUserProfile] = useState<UserProfile>({
    id: '1',
    nickname: '设计师小王',
    email: 'designer@example.com',
    avatar: 'https://via.placeholder.com/120',
    bio: '专注于UI/UX设计，擅长移动端界面设计和用户体验优化。',
    role: 'DESIGNER',
    joinDate: '2023-01-15',
    location: '北京',
    website: 'https://portfolio.example.com',
    skills: ['UI设计', 'UX设计', 'Figma', 'Sketch', 'Photoshop'],
    stats: {
      projects: 24,
      followers: 156,
      following: 89,
      likes: 432
    }
  });

  // 模拟作品数据
  const works: Work[] = [
    {
      id: '1',
      title: '移动端购物应用设计',
      image: 'https://via.placeholder.com/300x200',
      likes: 45,
      views: 234,
      category: 'UI设计'
    },
    {
      id: '2',
      title: '企业官网重设计',
      image: 'https://via.placeholder.com/300x200',
      likes: 32,
      views: 189,
      category: 'Web设计'
    },
    {
      id: '3',
      title: '品牌视觉识别系统',
      image: 'https://via.placeholder.com/300x200',
      likes: 67,
      views: 345,
      category: '品牌设计'
    }
  ];

  const handleEdit = () => {
    setEditing(true);
    form.setFieldsValue(userProfile);
  };

  const handleSave = async (values: any) => {
    try {
      // 这里应该调用API更新用户信息
      setUserProfile({ ...userProfile, ...values });
      setEditing(false);
      message.success('个人信息更新成功');
    } catch (error) {
      message.error('更新失败，请重试');
    }
  };

  const handleCancel = () => {
    setEditing(false);
    form.resetFields();
  };

  const uploadProps: UploadProps = {
    name: 'avatar',
    action: '/api/upload/avatar',
    showUploadList: false,
    beforeUpload: (file) => {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
      if (!isJpgOrPng) {
        message.error('只能上传 JPG/PNG 格式的图片!');
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error('图片大小不能超过 2MB!');
      }
      return isJpgOrPng && isLt2M;
    },
    onChange: (info) => {
      if (info.file.status === 'done') {
        message.success('头像上传成功');
        // 更新头像URL
        setUserProfile({
          ...userProfile,
          avatar: info.file.response.url
        });
      } else if (info.file.status === 'error') {
        message.error('头像上传失败');
      }
    },
  };

  return (
    <div className="profile-container">
      <div className="container">
        <Row gutter={[24, 24]}>
          {/* 左侧个人信息 */}
          <Col xs={24} lg={8}>
            <Card className="profile-card">
              <div className="profile-header">
                <div className="avatar-container">
                  <Avatar
                    size={120}
                    src={userProfile.avatar}
                    icon={<UserOutlined />}
                  />
                  {editing && (
                    <Upload {...uploadProps}>
                      <Button
                        className="avatar-upload-btn"
                        icon={<CameraOutlined />}
                        shape="circle"
                      />
                    </Upload>
                  )}
                </div>
                
                <div className="profile-info">
                  <Title level={3}>{userProfile.nickname}</Title>
                  <Text type="secondary">{userProfile.email}</Text>
                  <div className="role-tag">
                    <Tag color={userProfile.role === 'DESIGNER' ? 'blue' : 'green'}>
                      {userProfile.role === 'DESIGNER' ? '设计师' : '业主'}
                    </Tag>
                  </div>
                </div>

                {!editing && (
                  <Button
                    type="primary"
                    icon={<EditOutlined />}
                    onClick={handleEdit}
                    className="edit-btn"
                  >
                    编辑资料
                  </Button>
                )}
              </div>

              {editing ? (
                <Form
                  form={form}
                  layout="vertical"
                  onFinish={handleSave}
                  className="profile-form"
                >
                  <Form.Item
                    name="nickname"
                    label="昵称"
                    rules={[{ required: true, message: '请输入昵称' }]}
                  >
                    <Input />
                  </Form.Item>
                  
                  <Form.Item name="bio" label="个人简介">
                    <Input.TextArea rows={3} />
                  </Form.Item>
                  
                  <Form.Item name="location" label="所在地">
                    <Input />
                  </Form.Item>
                  
                  <Form.Item name="website" label="个人网站">
                    <Input />
                  </Form.Item>

                  <div className="form-actions">
                    <Button onClick={handleCancel}>
                      取消
                    </Button>
                    <Button type="primary" htmlType="submit">
                      保存
                    </Button>
                  </div>
                </Form>
              ) : (
                <div className="profile-details">
                  {userProfile.bio && (
                    <div className="bio-section">
                      <Paragraph>{userProfile.bio}</Paragraph>
                    </div>
                  )}
                  
                  <div className="info-item">
                    <Text strong>加入时间：</Text>
                    <Text>{new Date(userProfile.joinDate).toLocaleDateString()}</Text>
                  </div>
                  
                  {userProfile.location && (
                    <div className="info-item">
                      <Text strong>所在地：</Text>
                      <Text>{userProfile.location}</Text>
                    </div>
                  )}
                  
                  {userProfile.website && (
                    <div className="info-item">
                      <Text strong>个人网站：</Text>
                      <a href={userProfile.website} target="_blank" rel="noopener noreferrer">
                        {userProfile.website}
                      </a>
                    </div>
                  )}
                  
                  {userProfile.skills && userProfile.skills.length > 0 && (
                    <div className="skills-section">
                      <Text strong>技能标签：</Text>
                      <div className="skills-tags">
                        {userProfile.skills.map((skill, index) => (
                          <Tag key={index} color="blue">{skill}</Tag>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 统计数据 */}
              <div className="stats-section">
                <Row gutter={16}>
                  <Col span={6}>
                    <Statistic
                      title="项目"
                      value={userProfile.stats.projects}
                      valueStyle={{ fontSize: '18px' }}
                    />
                  </Col>
                  <Col span={6}>
                    <Statistic
                      title="粉丝"
                      value={userProfile.stats.followers}
                      valueStyle={{ fontSize: '18px' }}
                    />
                  </Col>
                  <Col span={6}>
                    <Statistic
                      title="关注"
                      value={userProfile.stats.following}
                      valueStyle={{ fontSize: '18px' }}
                    />
                  </Col>
                  <Col span={6}>
                    <Statistic
                      title="获赞"
                      value={userProfile.stats.likes}
                      valueStyle={{ fontSize: '18px' }}
                    />
                  </Col>
                </Row>
              </div>
            </Card>
          </Col>

          {/* 右侧内容区域 */}
          <Col xs={24} lg={16}>
            <Tabs defaultActiveKey="works" className="profile-tabs">
              <TabPane tab="作品集" key="works">
                <Row gutter={[16, 16]}>
                  {works.map((work) => (
                    <Col xs={24} sm={12} lg={8} key={work.id}>
                      <Card
                        hoverable
                        cover={
                          <div className="work-cover">
                            <img alt={work.title} src={work.image} />
                            <div className="work-overlay">
                              <Button icon={<EyeOutlined />} type="text" />
                            </div>
                          </div>
                        }
                        className="work-card"
                      >
                        <Card.Meta
                          title={work.title}
                          description={
                            <div className="work-meta">
                              <Tag>{work.category}</Tag>
                              <div className="work-stats">
                                <span><HeartOutlined /> {work.likes}</span>
                                <span><EyeOutlined /> {work.views}</span>
                              </div>
                            </div>
                          }
                        />
                      </Card>
                    </Col>
                  ))}
                </Row>
              </TabPane>

              <TabPane tab="项目历史" key="projects">
                <List
                  itemLayout="horizontal"
                  dataSource={[
                    {
                      title: '电商平台UI设计',
                      description: '完成时间：2024-01-15',
                      status: '已完成',
                      amount: '¥5,000'
                    },
                    {
                      title: '企业品牌设计',
                      description: '完成时间：2024-01-10',
                      status: '已完成',
                      amount: '¥8,000'
                    }
                  ]}
                  renderItem={(item) => (
                    <List.Item
                      actions={[
                        <Button type="link">查看详情</Button>
                      ]}
                    >
                      <List.Item.Meta
                        title={item.title}
                        description={item.description}
                      />
                      <div className="project-info">
                        <Tag color="green">{item.status}</Tag>
                        <Text strong>{item.amount}</Text>
                      </div>
                    </List.Item>
                  )}
                />
              </TabPane>

              <TabPane tab="评价" key="reviews">
                <List
                  itemLayout="horizontal"
                  dataSource={[
                    {
                      author: '客户A',
                      content: '设计师非常专业，作品质量很高，沟通顺畅。',
                      rating: 5,
                      date: '2024-01-15'
                    },
                    {
                      author: '客户B',
                      content: '交付及时，设计风格符合要求，推荐！',
                      rating: 5,
                      date: '2024-01-10'
                    }
                  ]}
                  renderItem={(item) => (
                    <List.Item>
                      <List.Item.Meta
                        avatar={<Avatar icon={<UserOutlined />} />}
                        title={
                          <div className="review-header">
                            <span>{item.author}</span>
                            <span className="review-rating">
                              {'★'.repeat(item.rating)}
                            </span>
                          </div>
                        }
                        description={
                          <div>
                            <Paragraph>{item.content}</Paragraph>
                            <Text type="secondary">{item.date}</Text>
                          </div>
                        }
                      />
                    </List.Item>
                  )}
                />
              </TabPane>
            </Tabs>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Profile;