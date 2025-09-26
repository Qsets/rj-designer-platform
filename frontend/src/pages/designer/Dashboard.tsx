import React, { useState } from 'react';
import { Card, Row, Col, Statistic, Progress, Button, Tag, Typography, Tabs, Badge, Empty, Upload, Modal, Form, Input, InputNumber, Select, Table, Space, Steps, Divider, DatePicker } from 'antd';
import { ArrowUpOutlined, PlusOutlined, EyeOutlined, StarOutlined, ProjectOutlined, EditOutlined, DeleteOutlined, DownloadOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd/es/upload/interface';
import './Dashboard.css';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;
const { TextArea } = Input;
const { Option } = Select;
const { Column } = Table;
const { Step } = Steps;

interface Portfolio {
  id: string;
  title: string;
  description: string;
  category: string;
  images: string[];
  likes: number;
  views: number;
  createdAt: string;
  featured: boolean;
}

interface PricingPackage {
  id: string;
  name: string;
  description: string;
  price: number;
  deliveryTime: number;
  revisions: number;
  features: string[];
  active: boolean;
}

interface Contract {
  id: string;
  projectTitle: string;
  clientName: string;
  amount: number;
  status: 'draft' | 'sent' | 'signed' | 'completed' | 'cancelled';
  createdAt: string;
  signedAt?: string;
  deadline: string;
  milestones: {
    id: string;
    title: string;
    amount: number;
    dueDate: string;
    status: 'pending' | 'completed' | 'paid';
  }[];
}

const DesignerDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [portfolioModalVisible, setPortfolioModalVisible] = useState(false);
  const [pricingModalVisible, setPricingModalVisible] = useState(false);
  const [contractModalVisible, setContractModalVisible] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [form] = Form.useForm();
  const [pricingForm] = Form.useForm();
  const [contractForm] = Form.useForm();

  // 模拟设计师数据
  const designerStats = {
    totalProjects: 28,
    activeProjects: 6,
    completedProjects: 22,
    totalEarnings: 125600,
    monthlyEarnings: 18900,
    portfolioViews: 15420,
    portfolioLikes: 892,
    clientRating: 4.9,
    responseRate: 98,
    completionRate: 96
  };

  const portfolios: Portfolio[] = [
    {
      id: '1',
      title: '现代简约品牌设计',
      description: '为科技公司设计的现代简约风格品牌视觉系统',
      category: '品牌设计',
      images: ['https://via.placeholder.com/300x200', 'https://via.placeholder.com/300x200'],
      likes: 156,
      views: 2340,
      createdAt: '2024-01-10',
      featured: true
    },
    {
      id: '2',
      title: '电商平台UI设计',
      description: '移动端电商应用的完整UI设计方案',
      category: 'UI设计',
      images: ['https://via.placeholder.com/300x200'],
      likes: 89,
      views: 1560,
      createdAt: '2024-01-05',
      featured: false
    },
    {
      id: '3',
      title: '餐厅品牌包装设计',
      description: '高端餐厅的品牌标识和包装设计',
      category: '包装设计',
      images: ['https://via.placeholder.com/300x200', 'https://via.placeholder.com/300x200'],
      likes: 234,
      views: 3120,
      createdAt: '2023-12-28',
      featured: true
    }
  ];

  const pricingPackages: PricingPackage[] = [
    {
      id: '1',
      name: '基础套餐',
      description: '适合小型项目的基础设计服务',
      price: 2000,
      deliveryTime: 7,
      revisions: 2,
      features: ['初稿设计', '2次修改', '源文件交付', '基础咨询'],
      active: true
    },
    {
      id: '2',
      name: '标准套餐',
      description: '适合中型项目的标准设计服务',
      price: 5000,
      deliveryTime: 14,
      revisions: 5,
      features: ['完整设计方案', '5次修改', '源文件交付', '设计说明', '后期支持'],
      active: true
    },
    {
      id: '3',
      name: '高级套餐',
      description: '适合大型项目的高级设计服务',
      price: 10000,
      deliveryTime: 21,
      revisions: 10,
      features: ['全套设计方案', '无限修改', '源文件交付', '详细说明', '长期支持', '商用授权'],
      active: true
    }
  ];

  const contracts: Contract[] = [
    {
      id: '1',
      projectTitle: '电商平台UI设计',
      clientName: '张总',
      amount: 15000,
      status: 'signed',
      createdAt: '2024-01-10',
      signedAt: '2024-01-12',
      deadline: '2024-02-10',
      milestones: [
        { id: '1', title: '设计稿交付', amount: 7500, dueDate: '2024-01-25', status: 'completed' },
        { id: '2', title: '最终交付', amount: 7500, dueDate: '2024-02-10', status: 'pending' }
      ]
    },
    {
      id: '2',
      projectTitle: '品牌视觉设计',
      clientName: '李经理',
      amount: 8000,
      status: 'sent',
      createdAt: '2024-01-15',
      deadline: '2024-02-15',
      milestones: [
        { id: '1', title: '概念设计', amount: 4000, dueDate: '2024-01-30', status: 'pending' },
        { id: '2', title: '完整方案', amount: 4000, dueDate: '2024-02-15', status: 'pending' }
      ]
    }
  ];

  const handleUploadChange = ({ fileList }: { fileList: UploadFile[] }) => {
    setFileList(fileList);
  };

  const handlePortfolioSubmit = (values: any) => {
    console.log('提交作品集:', values);
    setPortfolioModalVisible(false);
    form.resetFields();
    setFileList([]);
  };

  const handlePricingSubmit = (values: any) => {
    console.log('提交定价套餐:', values);
    setPricingModalVisible(false);
    pricingForm.resetFields();
  };

  const handleContractSubmit = (values: any) => {
    console.log('创建合同:', values);
    setContractModalVisible(false);
    contractForm.resetFields();
  };

  const getStatusColor = (status: string) => {
    const colors = {
      draft: 'default',
      sent: 'processing',
      signed: 'success',
      completed: 'success',
      cancelled: 'error',
      pending: 'warning',
      paid: 'success'
    };
    return colors[status as keyof typeof colors] || 'default';
  };

  const getStatusText = (status: string) => {
    const texts = {
      draft: '草稿',
      sent: '已发送',
      signed: '已签署',
      completed: '已完成',
      cancelled: '已取消',
      pending: '待处理',
      paid: '已支付'
    };
    return texts[status as keyof typeof texts] || status;
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <Title level={2}>设计师工作台</Title>
        <Text type="secondary">管理您的作品集、项目和收入</Text>
      </div>

      <Tabs activeKey={activeTab} onChange={setActiveTab} className="dashboard-tabs">
        <TabPane tab="概览" key="overview">
          {/* 统计卡片 */}
          <Row gutter={[16, 16]} className="stats-row">
            <Col xs={12} sm={12} md={6}>
              <Card>
                <Statistic
                  title="总项目数"
                  value={designerStats.totalProjects}
                  prefix={<ProjectOutlined />}
                  valueStyle={{ color: '#1890ff' }}
                />
              </Card>
            </Col>
            <Col xs={12} sm={12} md={6}>
              <Card>
                <Statistic
                  title="进行中项目"
                  value={designerStats.activeProjects}
                  valueStyle={{ color: '#faad14' }}
                />
              </Card>
            </Col>
            <Col xs={12} sm={12} md={6}>
              <Card>
                <Statistic
                  title="本月收入"
                  value={designerStats.monthlyEarnings}
                  prefix="¥"
                  suffix={
                    <span style={{ fontSize: '14px', color: '#52c41a' }}>
                      <ArrowUpOutlined /> 15%
                    </span>
                  }
                  valueStyle={{ color: '#52c41a' }}
                />
              </Card>
            </Col>
            <Col xs={12} sm={12} md={6}>
              <Card>
                <Statistic
                  title="客户评分"
                  value={designerStats.clientRating}
                  suffix="/ 5.0"
                  prefix={<StarOutlined />}
                  valueStyle={{ color: '#eb2f96' }}
                />
              </Card>
            </Col>
          </Row>

          {/* 作品集概览 */}
          <Row gutter={[16, 16]} className="content-row">
            <Col xs={24} lg={16}>
              <Card 
                title="最新作品" 
                extra={
                  <Button 
                    type="primary" 
                    icon={<PlusOutlined />}
                    onClick={() => setPortfolioModalVisible(true)}
                  >
                    上传作品
                  </Button>
                }
              >
                <Row gutter={[16, 16]}>
                  {portfolios.slice(0, 3).map((portfolio) => (
                    <Col xs={24} sm={12} lg={8} key={portfolio.id}>
                      <Card
                        hoverable
                        cover={
                          <img
                            alt={portfolio.title}
                            src={portfolio.images[0]}
                            style={{ height: 160, objectFit: 'cover' }}
                          />
                        }
                        actions={[
                          <EyeOutlined key="view" />,
                          <EditOutlined key="edit" />,
                          <DeleteOutlined key="delete" />
                        ]}
                      >
                        <Card.Meta
                          title={portfolio.title}
                          description={
                            <div>
                              <Tag color="blue">{portfolio.category}</Tag>
                              <div style={{ marginTop: 8, fontSize: '12px', color: '#8c8c8c' }}>
                                <span><EyeOutlined /> {portfolio.views}</span>
                                <span style={{ marginLeft: 16 }}><StarOutlined /> {portfolio.likes}</span>
                              </div>
                            </div>
                          }
                        />
                      </Card>
                    </Col>
                  ))}
                </Row>
              </Card>
            </Col>

            <Col xs={24} lg={8}>
              <Card title="数据统计">
                <div style={{ marginBottom: 16 }}>
                  <Text>作品集浏览量</Text>
                  <div style={{ display: 'flex', alignItems: 'center', marginTop: 4 }}>
                    <Progress percent={75} size="small" style={{ flex: 1, marginRight: 8 }} />
                    <Text strong>{designerStats.portfolioViews}</Text>
                  </div>
                </div>
                <div style={{ marginBottom: 16 }}>
                  <Text>获赞数量</Text>
                  <div style={{ display: 'flex', alignItems: 'center', marginTop: 4 }}>
                    <Progress percent={60} size="small" style={{ flex: 1, marginRight: 8 }} />
                    <Text strong>{designerStats.portfolioLikes}</Text>
                  </div>
                </div>
                <div style={{ marginBottom: 16 }}>
                  <Text>响应率</Text>
                  <div style={{ display: 'flex', alignItems: 'center', marginTop: 4 }}>
                    <Progress percent={designerStats.responseRate} size="small" style={{ flex: 1, marginRight: 8 }} />
                    <Text strong>{designerStats.responseRate}%</Text>
                  </div>
                </div>
                <div>
                  <Text>完成率</Text>
                  <div style={{ display: 'flex', alignItems: 'center', marginTop: 4 }}>
                    <Progress percent={designerStats.completionRate} size="small" style={{ flex: 1, marginRight: 8 }} />
                    <Text strong>{designerStats.completionRate}%</Text>
                  </div>
                </div>
              </Card>
            </Col>
          </Row>
        </TabPane>

        <TabPane tab="作品集管理" key="portfolio">
          <Card 
            title="我的作品集" 
            extra={
              <Button 
                type="primary" 
                icon={<PlusOutlined />}
                onClick={() => setPortfolioModalVisible(true)}
              >
                上传新作品
              </Button>
            }
          >
            <Row gutter={[16, 16]}>
              {portfolios.map((portfolio) => (
                <Col xs={24} sm={12} lg={8} key={portfolio.id}>
                  <Card
                    hoverable
                    cover={
                      <div style={{ position: 'relative' }}>
                        <img
                          alt={portfolio.title}
                          src={portfolio.images[0]}
                          style={{ height: 200, objectFit: 'cover', width: '100%' }}
                        />
                        {portfolio.featured && (
                          <Badge.Ribbon text="精选" color="red" />
                        )}
                      </div>
                    }
                    actions={[
                      <EyeOutlined key="view" />,
                      <EditOutlined key="edit" />,
                      <DeleteOutlined key="delete" />
                    ]}
                  >
                    <Card.Meta
                      title={portfolio.title}
                      description={
                        <div>
                          <Paragraph ellipsis={{ rows: 2 }}>
                            {portfolio.description}
                          </Paragraph>
                          <div style={{ marginTop: 8 }}>
                            <Tag color="blue">{portfolio.category}</Tag>
                          </div>
                          <div style={{ marginTop: 8, fontSize: '12px', color: '#8c8c8c' }}>
                            <span><EyeOutlined /> {portfolio.views}</span>
                            <span style={{ marginLeft: 16 }}><StarOutlined /> {portfolio.likes}</span>
                            <span style={{ float: 'right' }}>{portfolio.createdAt}</span>
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

        <TabPane tab="定价管理" key="pricing">
          <Card 
            title="服务定价" 
            extra={
              <Button 
                type="primary" 
                icon={<PlusOutlined />}
                onClick={() => setPricingModalVisible(true)}
              >
                添加套餐
              </Button>
            }
          >
            <Row gutter={[16, 16]}>
              {pricingPackages.map((pkg) => (
                <Col xs={24} sm={12} lg={8} key={pkg.id}>
                  <Card
                    title={
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>{pkg.name}</span>
                        <Tag color={pkg.active ? 'green' : 'red'}>
                          {pkg.active ? '启用' : '停用'}
                        </Tag>
                      </div>
                    }
                    actions={[
                      <EditOutlined key="edit" />,
                      <DeleteOutlined key="delete" />
                    ]}
                  >
                    <div style={{ textAlign: 'center', marginBottom: 16 }}>
                      <Title level={2} style={{ color: '#1890ff', margin: 0 }}>
                        ¥{pkg.price.toLocaleString()}
                      </Title>
                      <Text type="secondary">{pkg.deliveryTime}天交付</Text>
                    </div>
                    <Paragraph>{pkg.description}</Paragraph>
                    <div style={{ marginBottom: 16 }}>
                      <Text strong>包含服务：</Text>
                      <ul style={{ marginTop: 8, paddingLeft: 20 }}>
                        {pkg.features.map((feature, index) => (
                          <li key={index} style={{ marginBottom: 4 }}>
                            <Text>{feature}</Text>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div style={{ fontSize: '12px', color: '#8c8c8c' }}>
                      修改次数：{pkg.revisions === -1 ? '无限' : `${pkg.revisions}次`}
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          </Card>
        </TabPane>

        <TabPane tab="合同管理" key="contracts">
          <Card 
            title="合同列表" 
            extra={
              <Button 
                type="primary" 
                icon={<PlusOutlined />}
                onClick={() => setContractModalVisible(true)}
              >
                创建合同
              </Button>
            }
          >
            <Table
              dataSource={contracts}
              rowKey="id"
              pagination={{ pageSize: 10 }}
              scroll={{ x: 800 }}
            >
              <Column
                title="项目名称"
                dataIndex="projectTitle"
                key="projectTitle"
                render={(text) => <Text strong>{text}</Text>}
              />
              <Column
                title="客户"
                dataIndex="clientName"
                key="clientName"
              />
              <Column
                title="金额"
                dataIndex="amount"
                key="amount"
                render={(amount) => <Text strong>¥{amount.toLocaleString()}</Text>}
              />
              <Column
                title="状态"
                dataIndex="status"
                key="status"
                render={(status) => (
                  <Tag color={getStatusColor(status)}>
                    {getStatusText(status)}
                  </Tag>
                )}
              />
              <Column
                title="截止日期"
                dataIndex="deadline"
                key="deadline"
              />
              <Column
                title="操作"
                key="action"
                render={(_, record: Contract) => (
                  <Space>
                    <Button size="small" icon={<EyeOutlined />}>
                      查看
                    </Button>
                    {record.status === 'draft' && (
                      <Button size="small" type="primary">
                        发送
                      </Button>
                    )}
                    <Button size="small" icon={<DownloadOutlined />}>
                      下载
                    </Button>
                  </Space>
                )}
              />
            </Table>

            <Divider>里程碑进度</Divider>
            
            {contracts.map((contract) => (
              <Card 
                key={contract.id} 
                size="small" 
                title={contract.projectTitle}
                style={{ marginBottom: 16 }}
              >
                <Steps size="small" current={contract.milestones.findIndex(m => m.status === 'pending')}>
                  {contract.milestones.map((milestone) => (
                    <Step
                      key={milestone.id}
                      title={milestone.title}
                      description={
                        <div>
                          <div>¥{milestone.amount.toLocaleString()}</div>
                          <div>{milestone.dueDate}</div>
                          <Tag size="small" color={getStatusColor(milestone.status)}>
                            {getStatusText(milestone.status)}
                          </Tag>
                        </div>
                      }
                    />
                  ))}
                </Steps>
              </Card>
            ))}
          </Card>
        </TabPane>

        <TabPane tab="收入统计" key="earnings">
          <Row gutter={[16, 16]}>
            <Col xs={24} md={8}>
              <Card>
                <Statistic
                  title="总收入"
                  value={designerStats.totalEarnings}
                  prefix="¥"
                  valueStyle={{ color: '#52c41a' }}
                />
              </Card>
            </Col>
            <Col xs={24} md={8}>
              <Card>
                <Statistic
                  title="本月收入"
                  value={designerStats.monthlyEarnings}
                  prefix="¥"
                  suffix={
                    <span style={{ fontSize: '14px', color: '#52c41a' }}>
                      <ArrowUpOutlined /> 15%
                    </span>
                  }
                  valueStyle={{ color: '#52c41a' }}
                />
              </Card>
            </Col>
            <Col xs={24} md={8}>
              <Card>
                <Statistic
                  title="平均项目价值"
                  value={Math.round(designerStats.totalEarnings / designerStats.totalProjects)}
                  prefix="¥"
                  valueStyle={{ color: '#1890ff' }}
                />
              </Card>
            </Col>
          </Row>

          <Card title="收入趋势" style={{ marginTop: 16 }}>
            <Empty description="图表功能开发中..." />
          </Card>
        </TabPane>
      </Tabs>

      {/* 上传作品模态框 */}
      <Modal
        title="上传新作品"
        open={portfolioModalVisible}
        onCancel={() => {
          setPortfolioModalVisible(false);
          form.resetFields();
          setFileList([]);
        }}
        footer={null}
        width={600}
      >
        <Form form={form} onFinish={handlePortfolioSubmit} layout="vertical">
          <Form.Item
            name="title"
            label="作品标题"
            rules={[{ required: true, message: '请输入作品标题' }]}
          >
            <Input placeholder="请输入作品标题" />
          </Form.Item>

          <Form.Item
            name="category"
            label="作品分类"
            rules={[{ required: true, message: '请选择作品分类' }]}
          >
            <Select placeholder="请选择作品分类">
              <Option value="品牌设计">品牌设计</Option>
              <Option value="UI设计">UI设计</Option>
              <Option value="包装设计">包装设计</Option>
              <Option value="平面设计">平面设计</Option>
              <Option value="插画设计">插画设计</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="description"
            label="作品描述"
            rules={[{ required: true, message: '请输入作品描述' }]}
          >
            <TextArea rows={4} placeholder="请描述您的作品..." />
          </Form.Item>

          <Form.Item
            name="images"
            label="作品图片"
            rules={[{ required: true, message: '请上传作品图片' }]}
          >
            <Upload
              listType="picture-card"
              fileList={fileList}
              onChange={handleUploadChange}
              beforeUpload={() => false}
              multiple
            >
              {fileList.length >= 8 ? null : (
                <div>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>上传图片</div>
                </div>
              )}
            </Upload>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ marginRight: 8 }}>
              发布作品
            </Button>
            <Button onClick={() => setPortfolioModalVisible(false)}>
              取消
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* 添加定价套餐模态框 */}
      <Modal
        title="添加定价套餐"
        open={pricingModalVisible}
        onCancel={() => {
          setPricingModalVisible(false);
          pricingForm.resetFields();
        }}
        footer={null}
        width={600}
      >
        <Form form={pricingForm} onFinish={handlePricingSubmit} layout="vertical">
          <Form.Item
            name="name"
            label="套餐名称"
            rules={[{ required: true, message: '请输入套餐名称' }]}
          >
            <Input placeholder="如：基础套餐" />
          </Form.Item>

          <Form.Item
            name="description"
            label="套餐描述"
            rules={[{ required: true, message: '请输入套餐描述' }]}
          >
            <TextArea rows={3} placeholder="请描述套餐内容..." />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="price"
                label="价格（元）"
                rules={[{ required: true, message: '请输入价格' }]}
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
                name="deliveryTime"
                label="交付时间（天）"
                rules={[{ required: true, message: '请输入交付时间' }]}
              >
                <InputNumber style={{ width: '100%' }} min={1} placeholder="7" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="revisions"
            label="修改次数"
            rules={[{ required: true, message: '请输入修改次数' }]}
          >
            <InputNumber style={{ width: '100%' }} min={0} placeholder="3" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ marginRight: 8 }}>
              添加套餐
            </Button>
            <Button onClick={() => setPricingModalVisible(false)}>
              取消
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* 合同创建模态框 */}
      <Modal
        title="创建合同"
        open={contractModalVisible}
        onCancel={() => setContractModalVisible(false)}
        footer={null}
        width={800}
      >
        <Form form={contractForm} onFinish={handleContractSubmit} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="projectTitle"
                label="项目名称"
                rules={[{ required: true, message: '请输入项目名称' }]}
              >
                <Input placeholder="请输入项目名称" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="clientName"
                label="客户名称"
                rules={[{ required: true, message: '请输入客户名称' }]}
              >
                <Input placeholder="请输入客户名称" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="amount"
                label="合同总金额（元）"
                rules={[{ required: true, message: '请输入合同金额' }]}
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
                label="项目截止日期"
                rules={[{ required: true, message: '请选择截止日期' }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="description"
            label="项目描述"
            rules={[{ required: true, message: '请输入项目描述' }]}
          >
            <TextArea rows={4} placeholder="请详细描述项目内容和要求..." />
          </Form.Item>

          <Divider>里程碑设置</Divider>
          
          <Form.List name="milestones">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Card key={key} size="small" style={{ marginBottom: 16 }}>
                    <Row gutter={16}>
                      <Col span={8}>
                        <Form.Item
                          {...restField}
                          name={[name, 'title']}
                          label="里程碑名称"
                          rules={[{ required: true, message: '请输入里程碑名称' }]}
                        >
                          <Input placeholder="里程碑名称" />
                        </Form.Item>
                      </Col>
                      <Col span={6}>
                        <Form.Item
                          {...restField}
                          name={[name, 'amount']}
                          label="金额"
                          rules={[{ required: true, message: '请输入金额' }]}
                        >
                          <InputNumber
                            style={{ width: '100%' }}
                            min={0}
                            placeholder="0"
                          />
                        </Form.Item>
                      </Col>
                      <Col span={6}>
                        <Form.Item
                          {...restField}
                          name={[name, 'dueDate']}
                          label="截止日期"
                          rules={[{ required: true, message: '请选择日期' }]}
                        >
                          <DatePicker style={{ width: '100%' }} />
                        </Form.Item>
                      </Col>
                      <Col span={4}>
                        <Form.Item label=" ">
                          <Button 
                            type="text" 
                            danger 
                            icon={<DeleteOutlined />}
                            onClick={() => remove(name)}
                          >
                            删除
                          </Button>
                        </Form.Item>
                      </Col>
                    </Row>
                  </Card>
                ))}
                <Button 
                  type="dashed" 
                  onClick={() => add()} 
                  block 
                  icon={<PlusOutlined />}
                >
                  添加里程碑
                </Button>
              </>
            )}
          </Form.List>

          <Form.Item style={{ marginTop: 24 }}>
            <Button type="primary" htmlType="submit" style={{ marginRight: 8 }}>
              创建合同
            </Button>
            <Button onClick={() => setContractModalVisible(false)}>
              取消
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default DesignerDashboard;