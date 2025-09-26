import React, { useState } from 'react';
import { Card, Row, Col, Statistic, List, Avatar, Button, Tag, Typography, Tabs, Modal, Form, Input, InputNumber, Select, Rate, Empty, Divider, Progress } from 'antd';
import { ArrowUpOutlined, PlusOutlined, EyeOutlined, MessageOutlined, StarOutlined, ProjectOutlined, DollarOutlined, UserOutlined, ClockCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';
import '../Dashboard.css';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;
const { TextArea } = Input;
const { Option } = Select;

interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  budget: number;
  deadline: string;
  status: 'draft' | 'published' | 'in_progress' | 'completed' | 'cancelled';
  applicants: number;
  selectedDesigner?: {
    id: string;
    name: string;
    avatar: string;
    rating: number;
  };
  createdAt: string;
}

interface Designer {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  completedProjects: number;
  specialties: string[];
  hourlyRate: number;
  responseTime: string;
  portfolio: {
    title: string;
    image: string;
  }[];
}

interface Review {
  id: string;
  projectId: string;
  projectTitle: string;
  designerName: string;
  designerAvatar: string;
  rating: number;
  comment: string;
  createdAt: string;
}

const OwnerDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [projectModalVisible, setProjectModalVisible] = useState(false);
  const [reviewModalVisible, setReviewModalVisible] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [form] = Form.useForm();
  const [reviewForm] = Form.useForm();

  // 模拟业主数据
  const ownerStats = {
    totalProjects: 15,
    activeProjects: 4,
    completedProjects: 11,
    totalSpent: 89600,
    monthlySpent: 12800,
    savedAmount: 15200,
    averageRating: 4.7,
    favoriteDesigners: 8
  };

  const projects: Project[] = [
    {
      id: '1',
      title: '电商平台UI设计',
      description: '需要设计一个现代化的电商平台界面，包括首页、商品页、购物车等核心页面',
      category: 'UI设计',
      budget: 15000,
      deadline: '2024-02-15',
      status: 'in_progress',
      applicants: 12,
      selectedDesigner: {
        id: '1',
        name: '张设计师',
        avatar: 'https://via.placeholder.com/40',
        rating: 4.9
      },
      createdAt: '2024-01-10'
    },
    {
      id: '2',
      title: '品牌视觉设计',
      description: '为新创公司设计完整的品牌视觉系统，包括Logo、VI手册等',
      category: '品牌设计',
      budget: 8000,
      deadline: '2024-01-30',
      status: 'published',
      applicants: 8,
      createdAt: '2024-01-12'
    },
    {
      id: '3',
      title: '产品包装设计',
      description: '设计高端护肤品的包装，要求简约时尚，体现品牌调性',
      category: '包装设计',
      budget: 12000,
      deadline: '2024-02-20',
      status: 'completed',
      applicants: 15,
      selectedDesigner: {
        id: '2',
        name: '李设计师',
        avatar: 'https://via.placeholder.com/40',
        rating: 4.8
      },
      createdAt: '2023-12-20'
    }
  ];

  const recommendedDesigners: Designer[] = [
    {
      id: '1',
      name: '张设计师',
      avatar: 'https://via.placeholder.com/60',
      rating: 4.9,
      completedProjects: 156,
      specialties: ['UI设计', '品牌设计', '移动端设计'],
      hourlyRate: 200,
      responseTime: '1小时内',
      portfolio: [
        { title: '电商APP设计', image: 'https://via.placeholder.com/100x80' },
        { title: '品牌视觉系统', image: 'https://via.placeholder.com/100x80' }
      ]
    },
    {
      id: '2',
      name: '李设计师',
      avatar: 'https://via.placeholder.com/60',
      rating: 4.8,
      completedProjects: 89,
      specialties: ['包装设计', '平面设计', '插画'],
      hourlyRate: 180,
      responseTime: '2小时内',
      portfolio: [
        { title: '产品包装', image: 'https://via.placeholder.com/100x80' },
        { title: '海报设计', image: 'https://via.placeholder.com/100x80' }
      ]
    },
    {
      id: '3',
      name: '王设计师',
      avatar: 'https://via.placeholder.com/60',
      rating: 4.7,
      completedProjects: 234,
      specialties: ['网页设计', 'UI设计', '交互设计'],
      hourlyRate: 220,
      responseTime: '30分钟内',
      portfolio: [
        { title: '企业官网', image: 'https://via.placeholder.com/100x80' },
        { title: '管理系统UI', image: 'https://via.placeholder.com/100x80' }
      ]
    }
  ];

  const reviews: Review[] = [
    {
      id: '1',
      projectId: '3',
      projectTitle: '产品包装设计',
      designerName: '李设计师',
      designerAvatar: 'https://via.placeholder.com/40',
      rating: 5,
      comment: '设计师非常专业，作品质量很高，沟通顺畅，按时交付。非常满意！',
      createdAt: '2024-01-08'
    }
  ];

  const getStatusColor = (status: string) => {
    const colors = {
      draft: 'default',
      published: 'blue',
      in_progress: 'orange',
      completed: 'green',
      cancelled: 'red'
    };
    return colors[status as keyof typeof colors] || 'default';
  };

  const getStatusText = (status: string) => {
    const texts = {
      draft: '草稿',
      published: '已发布',
      in_progress: '进行中',
      completed: '已完成',
      cancelled: '已取消'
    };
    return texts[status as keyof typeof texts] || status;
  };

  const handleProjectSubmit = (values: any) => {
    console.log('发布项目:', values);
    setProjectModalVisible(false);
    form.resetFields();
  };

  const handleReviewSubmit = (values: any) => {
    console.log('提交评价:', values);
    setReviewModalVisible(false);
    reviewForm.resetFields();
    setSelectedProject(null);
  };

  const openReviewModal = (project: Project) => {
    setSelectedProject(project);
    setReviewModalVisible(true);
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <Title level={2}>业主工作台</Title>
        <Text type="secondary">管理您的项目需求和设计师合作</Text>
      </div>

      <Tabs activeKey={activeTab} onChange={setActiveTab} className="dashboard-tabs">
        <TabPane tab="概览" key="overview">
          {/* 统计卡片 */}
          <Row gutter={[16, 16]} className="stats-row">
            <Col xs={12} sm={12} md={6}>
              <Card>
                <Statistic
                  title="总项目数"
                  value={ownerStats.totalProjects}
                  prefix={<ProjectOutlined />}
                  valueStyle={{ color: '#1890ff' }}
                />
              </Card>
            </Col>
            <Col xs={12} sm={12} md={6}>
              <Card>
                <Statistic
                  title="进行中项目"
                  value={ownerStats.activeProjects}
                  valueStyle={{ color: '#faad14' }}
                />
              </Card>
            </Col>
            <Col xs={12} sm={12} md={6}>
              <Card>
                <Statistic
                  title="本月支出"
                  value={ownerStats.monthlySpent}
                  prefix="¥"
                  valueStyle={{ color: '#f5222d' }}
                />
              </Card>
            </Col>
            <Col xs={12} sm={12} md={6}>
              <Card>
                <Statistic
                  title="平均评分"
                  value={ownerStats.averageRating}
                  suffix="/ 5.0"
                  prefix={<StarOutlined />}
                  valueStyle={{ color: '#eb2f96' }}
                />
              </Card>
            </Col>
          </Row>

          {/* 项目和设计师推荐 */}
          <Row gutter={[16, 16]} className="content-row">
            <Col xs={24} lg={12}>
              <Card 
                title="我的项目" 
                extra={
                  <Button 
                    type="primary" 
                    icon={<PlusOutlined />}
                    onClick={() => setProjectModalVisible(true)}
                  >
                    发布项目
                  </Button>
                }
              >
                <List
                  dataSource={projects.slice(0, 3)}
                  renderItem={(project) => (
                    <List.Item
                      actions={[
                        <Button type="link" size="small">查看</Button>,
                        project.status === 'completed' && !reviews.find(r => r.projectId === project.id) && (
                          <Button 
                            type="link" 
                            size="small"
                            onClick={() => openReviewModal(project)}
                          >
                            评价
                          </Button>
                        )
                      ].filter(Boolean)}
                    >
                      <List.Item.Meta
                        title={
                          <div className="project-title">
                            <span>{project.title}</span>
                            <Tag color={getStatusColor(project.status)}>
                              {getStatusText(project.status)}
                            </Tag>
                          </div>
                        }
                        description={
                          <div className="project-info">
                            <div>预算：¥{project.budget.toLocaleString()}</div>
                            <div>截止：{project.deadline}</div>
                            <div>申请人数：{project.applicants}人</div>
                            {project.selectedDesigner && (
                              <div>设计师：{project.selectedDesigner.name}</div>
                            )}
                          </div>
                        }
                      />
                    </List.Item>
                  )}
                />
              </Card>
            </Col>

            <Col xs={24} lg={12}>
              <Card title="推荐设计师" extra={<Button type="link">查看更多</Button>}>
                <List
                  dataSource={recommendedDesigners.slice(0, 3)}
                  renderItem={(designer) => (
                    <List.Item
                      actions={[
                        <Button type="link" size="small">查看</Button>,
                        <Button type="link" size="small">联系</Button>
                      ]}
                    >
                      <List.Item.Meta
                        avatar={<Avatar src={designer.avatar} size={48}>{designer.name[0]}</Avatar>}
                        title={
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span>{designer.name}</span>
                            <div>
                              <Rate disabled defaultValue={designer.rating} style={{ fontSize: '12px' }} />
                              <Text style={{ marginLeft: 4, fontSize: '12px' }}>{designer.rating}</Text>
                            </div>
                          </div>
                        }
                        description={
                          <div>
                            <div style={{ marginBottom: 4 }}>
                              {designer.specialties.map(specialty => (
                                <Tag key={specialty} size="small">{specialty}</Tag>
                              ))}
                            </div>
                            <div style={{ fontSize: '12px', color: '#8c8c8c' }}>
                              <span>¥{designer.hourlyRate}/小时</span>
                              <span style={{ marginLeft: 16 }}>完成{designer.completedProjects}个项目</span>
                            </div>
                          </div>
                        }
                      />
                    </List.Item>
                  )}
                />
              </Card>
            </Col>
          </Row>
        </TabPane>

        <TabPane tab="项目管理" key="projects">
          <Card 
            title="我的项目" 
            extra={
              <Button 
                type="primary" 
                icon={<PlusOutlined />}
                onClick={() => setProjectModalVisible(true)}
              >
                发布新项目
              </Button>
            }
          >
            <Row gutter={[16, 16]}>
              {projects.map((project) => (
                <Col xs={24} sm={12} lg={8} key={project.id}>
                  <Card
                    hoverable
                    actions={[
                      <EyeOutlined key="view" />,
                      <MessageOutlined key="message" />,
                      project.status === 'completed' && !reviews.find(r => r.projectId === project.id) && (
                        <Button 
                          type="link" 
                          size="small" 
                          onClick={() => openReviewModal(project)}
                        >
                          评价
                        </Button>
                      )
                    ].filter(Boolean)}
                  >
                    <Card.Meta
                      title={project.title}
                      description={
                        <div className="project-card-info">
                          <Paragraph ellipsis={{ rows: 2 }}>
                            {project.description}
                          </Paragraph>
                          <div>分类：{project.category}</div>
                          <div>预算：¥{project.budget.toLocaleString()}</div>
                          <div>截止：{project.deadline}</div>
                          <Divider />
                          <div className="project-status">
                            <Tag color={getStatusColor(project.status)}>
                              {getStatusText(project.status)}
                            </Tag>
                            <Text type="secondary">{project.applicants}人申请</Text>
                          </div>
                          {project.selectedDesigner && (
                            <div style={{ marginTop: 8, display: 'flex', alignItems: 'center' }}>
                              <Avatar src={project.selectedDesigner.avatar} size={24} />
                              <Text style={{ marginLeft: 8 }}>{project.selectedDesigner.name}</Text>
                              <Rate 
                                disabled 
                                defaultValue={project.selectedDesigner.rating} 
                                style={{ fontSize: '12px', marginLeft: 8 }} 
                              />
                            </div>
                          )}
                        </div>
                      }
                    />
                  </Card>
                </Col>
              ))}
            </Row>
          </Card>
        </TabPane>

        <TabPane tab="设计师库" key="designers">
          <Card title="推荐设计师">
            <Row gutter={[16, 16]}>
              {recommendedDesigners.map((designer) => (
                <Col xs={24} sm={12} lg={8} key={designer.id}>
                  <Card
                    hoverable
                    actions={[
                      <EyeOutlined key="view" />,
                      <MessageOutlined key="message" />,
                      <Button type="link" size="small">邀请合作</Button>
                    ]}
                  >
                    <Card.Meta
                      avatar={<Avatar src={designer.avatar} size={60}>{designer.name[0]}</Avatar>}
                      title={
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span>{designer.name}</span>
                            <div>
                              <Rate disabled defaultValue={designer.rating} style={{ fontSize: '12px' }} />
                              <Text style={{ marginLeft: 4, fontSize: '12px' }}>{designer.rating}</Text>
                            </div>
                          </div>
                        </div>
                      }
                      description={
                        <div>
                          <div style={{ marginBottom: 8 }}>
                            {designer.specialties.map(specialty => (
                              <Tag key={specialty} size="small" color="blue">{specialty}</Tag>
                            ))}
                          </div>
                          <div style={{ marginBottom: 8, fontSize: '13px', color: '#8c8c8c' }}>
                            <div>¥{designer.hourlyRate}/小时 · 完成{designer.completedProjects}个项目</div>
                            <div>响应时间：{designer.responseTime}</div>
                          </div>
                          <div>
                            <Text strong style={{ fontSize: '12px' }}>作品展示：</Text>
                            <div style={{ display: 'flex', gap: 4, marginTop: 4 }}>
                              {designer.portfolio.map((work, index) => (
                                <img
                                  key={index}
                                  src={work.image}
                                  alt={work.title}
                                  style={{ width: 40, height: 32, objectFit: 'cover', borderRadius: 4 }}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                      }
                    />
                  </Card>
                </Col>
              ))}
            </Row>
          </Card>
        </TabPane>

        <TabPane tab="支出统计" key="spending">
          <Row gutter={[16, 16]}>
            <Col xs={24} md={8}>
              <Card>
                <Statistic
                  title="总支出"
                  value={ownerStats.totalSpent}
                  prefix="¥"
                  valueStyle={{ color: '#f5222d' }}
                />
              </Card>
            </Col>
            <Col xs={24} md={8}>
              <Card>
                <Statistic
                  title="本月支出"
                  value={ownerStats.monthlySpent}
                  prefix="¥"
                  valueStyle={{ color: '#faad14' }}
                />
              </Card>
            </Col>
            <Col xs={24} md={8}>
              <Card>
                <Statistic
                  title="节省金额"
                  value={ownerStats.savedAmount}
                  prefix="¥"
                  suffix={
                    <span style={{ fontSize: '14px', color: '#52c41a' }}>
                      <ArrowUpOutlined /> 8%
                    </span>
                  }
                  valueStyle={{ color: '#52c41a' }}
                />
              </Card>
            </Col>
          </Row>

          <Card title="支出趋势" style={{ marginTop: 16 }}>
            <Empty description="图表功能开发中..." />
          </Card>
        </TabPane>
      </Tabs>

      {/* 发布项目模态框 */}
      <Modal
        title="发布新项目"
        open={projectModalVisible}
        onCancel={() => {
          setProjectModalVisible(false);
          form.resetFields();
        }}
        footer={null}
        width={600}
      >
        <Form form={form} onFinish={handleProjectSubmit} layout="vertical">
          <Form.Item
            name="title"
            label="项目标题"
            rules={[{ required: true, message: '请输入项目标题' }]}
          >
            <Input placeholder="请输入项目标题" />
          </Form.Item>

          <Form.Item
            name="category"
            label="项目分类"
            rules={[{ required: true, message: '请选择项目分类' }]}
          >
            <Select placeholder="请选择项目分类">
              <Option value="品牌设计">品牌设计</Option>
              <Option value="UI设计">UI设计</Option>
              <Option value="包装设计">包装设计</Option>
              <Option value="平面设计">平面设计</Option>
              <Option value="网页设计">网页设计</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="description"
            label="项目描述"
            rules={[{ required: true, message: '请输入项目描述' }]}
          >
            <TextArea rows={4} placeholder="请详细描述您的项目需求..." />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="budget"
                label="项目预算（元）"
                rules={[{ required: true, message: '请输入项目预算' }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  min={0}
                  placeholder="0"
                  formatter={value => `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="deadline"
                label="截止日期"
                rules={[{ required: true, message: '请选择截止日期' }]}
              >
                <Input type="date" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ marginRight: 8 }}>
              发布项目
            </Button>
            <Button onClick={() => setProjectModalVisible(false)}>
              取消
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* 评价设计师模态框 */}
      <Modal
        title="评价设计师"
        open={reviewModalVisible}
        onCancel={() => {
          setReviewModalVisible(false);
          reviewForm.resetFields();
          setSelectedProject(null);
        }}
        footer={null}
        width={500}
      >
        {selectedProject && (
          <Form form={reviewForm} onFinish={handleReviewSubmit} layout="vertical">
            <div style={{ marginBottom: 16, padding: 16, background: '#f5f5f5', borderRadius: 8 }}>
              <Text strong>项目：{selectedProject.title}</Text>
              {selectedProject.selectedDesigner && (
                <div style={{ marginTop: 8, display: 'flex', alignItems: 'center' }}>
                  <Avatar src={selectedProject.selectedDesigner.avatar} size={32} />
                  <Text style={{ marginLeft: 8 }}>设计师：{selectedProject.selectedDesigner.name}</Text>
                </div>
              )}
            </div>

            <Form.Item
              name="rating"
              label="评分"
              rules={[{ required: true, message: '请给出评分' }]}
            >
              <Rate />
            </Form.Item>

            <Form.Item
              name="comment"
              label="评价内容"
              rules={[{ required: true, message: '请输入评价内容' }]}
            >
              <TextArea rows={4} placeholder="请分享您对设计师工作的评价..." />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" style={{ marginRight: 8 }}>
                提交评价
              </Button>
              <Button onClick={() => setReviewModalVisible(false)}>
                取消
              </Button>
            </Form.Item>
          </Form>
        )}
      </Modal>
    </div>
  );
};

export default OwnerDashboard;