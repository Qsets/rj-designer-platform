import React, { useState } from 'react';
import { Card, Button, Input, Select, Row, Col, Tag, Avatar, Typography, Pagination, Empty, Spin } from 'antd';
import { SearchOutlined, FilterOutlined, PlusOutlined, EyeOutlined, MessageOutlined, CalendarOutlined, DollarOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import './Projects.css';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

interface Project {
  id: string;
  title: string;
  description: string;
  budget: string;
  deadline: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  category: string;
  skills: string[];
  owner: {
    id: string;
    name: string;
    avatar?: string;
  };
  applicants: number;
  createdAt: string;
}

const Projects: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  // 模拟项目数据
  const projects: Project[] = [
    {
      id: '1',
      title: '电商平台移动端UI设计',
      description: '需要设计一套完整的电商平台移动端界面，包括首页、商品列表、商品详情、购物车、订单等页面。要求界面简洁美观，用户体验良好。',
      budget: '¥8,000 - ¥12,000',
      deadline: '2024-02-15',
      status: 'OPEN',
      category: 'UI设计',
      skills: ['UI设计', 'Figma', '移动端设计'],
      owner: {
        id: '1',
        name: '张先生',
        avatar: 'https://via.placeholder.com/40'
      },
      applicants: 8,
      createdAt: '2024-01-10'
    },
    {
      id: '2',
      title: '企业品牌视觉识别系统设计',
      description: '为新成立的科技公司设计完整的品牌视觉识别系统，包括Logo、名片、信纸、PPT模板等。',
      budget: '¥15,000 - ¥25,000',
      deadline: '2024-02-20',
      status: 'IN_PROGRESS',
      category: '品牌设计',
      skills: ['品牌设计', 'Logo设计', 'VI设计'],
      owner: {
        id: '2',
        name: '李女士',
        avatar: 'https://via.placeholder.com/40'
      },
      applicants: 12,
      createdAt: '2024-01-08'
    },
    {
      id: '3',
      title: '餐厅网站设计与开发',
      description: '为高端餐厅设计并开发官方网站，需要展示菜单、环境、预订功能等。要求设计精美，符合餐厅定位。',
      budget: '¥20,000 - ¥30,000',
      deadline: '2024-03-01',
      status: 'OPEN',
      category: 'Web设计',
      skills: ['Web设计', '前端开发', '响应式设计'],
      owner: {
        id: '3',
        name: '王总',
        avatar: 'https://via.placeholder.com/40'
      },
      applicants: 5,
      createdAt: '2024-01-12'
    },
    {
      id: '4',
      title: '产品包装设计',
      description: '为新产品设计包装，包括外包装盒、内包装、标签等。产品为高端护肤品，要求设计高雅时尚。',
      budget: '¥6,000 - ¥10,000',
      deadline: '2024-02-10',
      status: 'COMPLETED',
      category: '包装设计',
      skills: ['包装设计', '平面设计', 'Adobe Illustrator'],
      owner: {
        id: '4',
        name: '陈女士',
        avatar: 'https://via.placeholder.com/40'
      },
      applicants: 15,
      createdAt: '2024-01-05'
    }
  ];

  const categories = ['UI设计', '品牌设计', 'Web设计', '包装设计', '插画设计', '平面设计'];
  const statuses = [
    { value: 'OPEN', label: '招募中', color: 'blue' },
    { value: 'IN_PROGRESS', label: '进行中', color: 'orange' },
    { value: 'COMPLETED', label: '已完成', color: 'green' },
    { value: 'CANCELLED', label: '已取消', color: 'red' }
  ];

  const getStatusConfig = (status: string) => {
    return statuses.find(s => s.value === status) || statuses[0];
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchText.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchText.toLowerCase());
    const matchesCategory = !selectedCategory || project.category === selectedCategory;
    const matchesStatus = !selectedStatus || project.status === selectedStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const paginatedProjects = filteredProjects.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleSearch = (value: string) => {
    setSearchText(value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    setCurrentPage(1);
  };

  const handleStatusChange = (value: string) => {
    setSelectedStatus(value);
    setCurrentPage(1);
  };

  const handleProjectClick = (projectId: string) => {
    navigate(`/projects/${projectId}`);
  };

  const handleCreateProject = () => {
    navigate('/projects/create');
  };

  return (
    <div className="projects-container">
      <div className="container">
        {/* 页面头部 */}
        <div className="page-header">
          <div className="header-content">
            <Title level={2}>项目大厅</Title>
            <Text type="secondary">发现优质设计项目，展示您的才华</Text>
          </div>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleCreateProject}
            className="create-btn"
          >
            发布项目
          </Button>
        </div>

        {/* 搜索和筛选 */}
        <Card className="filter-card">
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} sm={12} md={8}>
              <Input
                placeholder="搜索项目标题或描述"
                prefix={<SearchOutlined />}
                value={searchText}
                onChange={(e) => handleSearch(e.target.value)}
                allowClear
              />
            </Col>
            <Col xs={12} sm={6} md={4}>
              <Select
                placeholder="选择分类"
                value={selectedCategory}
                onChange={handleCategoryChange}
                allowClear
                style={{ width: '100%' }}
              >
                {categories.map(category => (
                  <Option key={category} value={category}>{category}</Option>
                ))}
              </Select>
            </Col>
            <Col xs={12} sm={6} md={4}>
              <Select
                placeholder="项目状态"
                value={selectedStatus}
                onChange={handleStatusChange}
                allowClear
                style={{ width: '100%' }}
              >
                {statuses.map(status => (
                  <Option key={status.value} value={status.value}>{status.label}</Option>
                ))}
              </Select>
            </Col>
            <Col xs={24} md={8}>
              <div className="filter-info">
                <Text type="secondary">
                  共找到 {filteredProjects.length} 个项目
                </Text>
              </div>
            </Col>
          </Row>
        </Card>

        {/* 项目列表 */}
        <Spin spinning={loading}>
          {paginatedProjects.length > 0 ? (
            <>
              <Row gutter={[24, 24]} className="projects-grid">
                {paginatedProjects.map((project) => {
                  const statusConfig = getStatusConfig(project.status);
                  
                  return (
                    <Col xs={24} sm={12} lg={8} xl={6} key={project.id}>
                      <Card
                        hoverable
                        className="project-card"
                        onClick={() => handleProjectClick(project.id)}
                        actions={[
                          <div key="applicants" className="card-action">
                            <MessageOutlined />
                            <span>{project.applicants} 人申请</span>
                          </div>,
                          <div key="view" className="card-action">
                            <EyeOutlined />
                            <span>查看详情</span>
                          </div>
                        ]}
                      >
                        <div className="project-header">
                          <Tag color={statusConfig.color} className="status-tag">
                            {statusConfig.label}
                          </Tag>
                          <Text type="secondary" className="category-tag">
                            {project.category}
                          </Text>
                        </div>

                        <Title level={4} className="project-title">
                          {project.title}
                        </Title>

                        <Paragraph
                          ellipsis={{ rows: 3 }}
                          className="project-description"
                        >
                          {project.description}
                        </Paragraph>

                        <div className="project-skills">
                          {project.skills.slice(0, 3).map((skill, index) => (
                            <Tag key={index} className="skill-tag">
                              {skill}
                            </Tag>
                          ))}
                          {project.skills.length > 3 && (
                            <Tag className="skill-tag">+{project.skills.length - 3}</Tag>
                          )}
                        </div>

                        <div className="project-info">
                          <div className="info-item">
                            <DollarOutlined />
                            <Text strong>{project.budget}</Text>
                          </div>
                          <div className="info-item">
                            <CalendarOutlined />
                            <Text>截止 {new Date(project.deadline).toLocaleDateString()}</Text>
                          </div>
                        </div>

                        <div className="project-owner">
                          <Avatar
                            size="small"
                            src={project.owner.avatar}
                            style={{ marginRight: 8 }}
                          />
                          <Text type="secondary">{project.owner.name}</Text>
                          <Text type="secondary" className="created-time">
                            {new Date(project.createdAt).toLocaleDateString()}
                          </Text>
                        </div>
                      </Card>
                    </Col>
                  );
                })}
              </Row>

              {/* 分页 */}
              {filteredProjects.length > pageSize && (
                <div className="pagination-container">
                  <Pagination
                    current={currentPage}
                    total={filteredProjects.length}
                    pageSize={pageSize}
                    onChange={setCurrentPage}
                    showSizeChanger={false}
                    showQuickJumper
                    showTotal={(total, range) =>
                      `第 ${range[0]}-${range[1]} 项，共 ${total} 项`
                    }
                  />
                </div>
              )}
            </>
          ) : (
            <div className="empty-container">
              <Empty
                description="暂无符合条件的项目"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              >
                <Button type="primary" onClick={() => {
                  setSearchText('');
                  setSelectedCategory('');
                  setSelectedStatus('');
                  setCurrentPage(1);
                }}>
                  清除筛选条件
                </Button>
              </Empty>
            </div>
          )}
        </Spin>
      </div>
    </div>
  );
};

export default Projects;