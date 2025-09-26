import React from 'react'
import { Card, Row, Col, Typography, Button, Space, Statistic, Avatar, Tag } from 'antd'
import { 
  PlusOutlined, 
  EyeOutlined, 
  HeartOutlined, 
  MessageOutlined,
  TrophyOutlined,
  RocketOutlined,
  TeamOutlined,
  StarOutlined
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import './Home.css'

const { Title, Text, Paragraph } = Typography

const Home: React.FC = () => {
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuthStore()

  // 模拟数据
  const featuredWorks = [
    {
      id: 1,
      title: '现代简约客厅设计',
      designer: '张设计师',
      avatar: '',
      price: '￥5,000',
      views: 1234,
      likes: 89,
      image: 'https://via.placeholder.com/300x200?text=客厅设计',
      tags: ['现代', '简约', '客厅']
    },
    {
      id: 2,
      title: '北欧风格卧室设计',
      designer: '李设计师',
      avatar: '',
      price: '￥3,500',
      views: 987,
      likes: 67,
      image: 'https://via.placeholder.com/300x200?text=卧室设计',
      tags: ['北欧', '温馨', '卧室']
    },
    {
      id: 3,
      title: '工业风办公空间',
      designer: '王设计师',
      avatar: '',
      price: '￥8,000',
      views: 2156,
      likes: 145,
      image: 'https://via.placeholder.com/300x200?text=办公设计',
      tags: ['工业风', '办公', '创意']
    }
  ]

  const platformStats = [
    { title: '注册设计师', value: 1234, suffix: '位' },
    { title: '完成项目', value: 5678, suffix: '个' },
    { title: '满意度', value: 98.5, suffix: '%' },
    { title: '平台交易额', value: 2.5, suffix: '万元' }
  ]

  const handleGetStarted = () => {
    if (isAuthenticated) {
      if (user?.role === 'DESIGNER') {
        navigate('/designer')
      } else if (user?.role === 'OWNER') {
        navigate('/owner')
      } else {
        navigate('/projects')
      }
    } else {
      navigate('/register')
    }
  }

  return (
    <div className="home-container">
      {/* 英雄区域 */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <Title level={1} className="hero-title">
              连接创意与需求
              <br />
              <span className="gradient-text">钧鉴设计交易平台</span>
            </Title>
            <Paragraph className="hero-description">
              专业的设计师与业主对接平台，提供高质量的设计服务
              <br />
              从创意构思到项目落地，我们为您提供全流程保障
            </Paragraph>
            <Space size="large" className="hero-actions">
              <Button 
                type="primary" 
                size="large" 
                icon={<RocketOutlined />}
                onClick={handleGetStarted}
                className="cta-button"
              >
                {isAuthenticated ? '进入工作台' : '立即开始'}
              </Button>
              <Button 
                size="large" 
                onClick={() => navigate('/projects')}
                className="secondary-button"
              >
                浏览项目
              </Button>
            </Space>
          </div>
          <div className="hero-image">
            <div className="floating-card card-1">
              <TrophyOutlined style={{ fontSize: 24, color: '#1890ff' }} />
              <Text>优质设计</Text>
            </div>
            <div className="floating-card card-2">
              <TeamOutlined style={{ fontSize: 24, color: '#52c41a' }} />
              <Text>专业团队</Text>
            </div>
            <div className="floating-card card-3">
              <StarOutlined style={{ fontSize: 24, color: '#faad14' }} />
              <Text>五星服务</Text>
            </div>
          </div>
        </div>
      </section>

      {/* 平台数据 */}
      <section className="stats-section">
        <div className="container">
          <Row gutter={[24, 24]}>
            {platformStats.map((stat, index) => (
              <Col xs={12} sm={6} key={index}>
                <Card className="stat-card">
                  <Statistic
                    title={stat.title}
                    value={stat.value}
                    suffix={stat.suffix}
                    valueStyle={{ color: '#1890ff', fontWeight: 'bold' }}
                  />
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* 精选作品 */}
      <section className="featured-section">
        <div className="container">
          <div className="section-header">
            <Title level={2}>精选作品</Title>
            <Text type="secondary">发现优秀设计师的创意作品</Text>
          </div>
          
          <Row gutter={[24, 24]}>
            {featuredWorks.map((work) => (
              <Col xs={24} sm={12} lg={8} key={work.id}>
                <Card
                  hoverable
                  className="work-card"
                  cover={
                    <div className="work-image">
                      <img src={work.image} alt={work.title} />
                      <div className="work-overlay">
                        <Space>
                          <Button 
                            type="primary" 
                            icon={<EyeOutlined />}
                            onClick={() => navigate(`/works/${work.id}`)}
                          >
                            查看详情
                          </Button>
                        </Space>
                      </div>
                    </div>
                  }
                >
                  <div className="work-info">
                    <Title level={4} className="work-title">{work.title}</Title>
                    <div className="work-meta">
                      <Space>
                        <Avatar size="small" src={work.avatar} />
                        <Text>{work.designer}</Text>
                      </Space>
                      <Text className="work-price">{work.price}</Text>
                    </div>
                    <div className="work-tags">
                      {work.tags.map((tag) => (
                        <Tag key={tag} color="blue">{tag}</Tag>
                      ))}
                    </div>
                    <div className="work-stats">
                      <Space split={<span className="divider">|</span>}>
                        <span><EyeOutlined /> {work.views}</span>
                        <span><HeartOutlined /> {work.likes}</span>
                      </Space>
                    </div>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>

          <div className="section-footer">
            <Button 
              size="large" 
              onClick={() => navigate('/works')}
            >
              查看更多作品
            </Button>
          </div>
        </div>
      </section>

      {/* 快速入口 */}
      {isAuthenticated && (
        <section className="quick-actions-section">
          <div className="container">
            <Title level={3}>快速操作</Title>
            <Row gutter={[16, 16]}>
              {user?.role === 'DESIGNER' && (
                <>
                  <Col xs={12} sm={8} md={6}>
                    <Card 
                      hoverable 
                      className="action-card"
                      onClick={() => navigate('/designer/portfolio')}
                    >
                      <PlusOutlined style={{ fontSize: 24, color: '#1890ff' }} />
                      <Text>上传作品</Text>
                    </Card>
                  </Col>
                  <Col xs={12} sm={8} md={6}>
                    <Card 
                      hoverable 
                      className="action-card"
                      onClick={() => navigate('/designer/orders')}
                    >
                      <MessageOutlined style={{ fontSize: 24, color: '#52c41a' }} />
                      <Text>查看订单</Text>
                    </Card>
                  </Col>
                </>
              )}
              
              {user?.role === 'OWNER' && (
                <>
                  <Col xs={12} sm={8} md={6}>
                    <Card 
                      hoverable 
                      className="action-card"
                      onClick={() => navigate('/owner/publish')}
                    >
                      <PlusOutlined style={{ fontSize: 24, color: '#1890ff' }} />
                      <Text>发布需求</Text>
                    </Card>
                  </Col>
                  <Col xs={12} sm={8} md={6}>
                    <Card 
                      hoverable 
                      className="action-card"
                      onClick={() => navigate('/owner/projects')}
                    >
                      <MessageOutlined style={{ fontSize: 24, color: '#52c41a' }} />
                      <Text>我的项目</Text>
                    </Card>
                  </Col>
                </>
              )}
            </Row>
          </div>
        </section>
      )}
    </div>
  )
}

export default Home