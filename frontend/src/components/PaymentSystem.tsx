import React, { useState } from 'react';
import {
  Card,
  Button,
  Table,
  Tag,
  Space,
  Modal,
  Form,
  Input,
  Select,
  InputNumber,
  Radio,
  Upload,
  Checkbox,
  DatePicker,
  Steps,
  Statistic,
  Row,
  Col,
  Descriptions,
  Alert,
  Typography,
  Divider,
  message,
  Progress
} from 'antd';
import {
  CreditCardOutlined,
  FileTextOutlined,
  SafetyCertificateOutlined,
  PayCircleOutlined,
  DownloadOutlined,
  EyeOutlined,
  EditOutlined,
  PlusOutlined,
  UploadOutlined,
  LockOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  InfoCircleOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import './PaymentSystem.css';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;
const { Step } = Steps;

interface PaymentStage {
  id: string;
  stage: string;
  amount: number;
  percentage: number;
  status: 'pending' | 'paid' | 'overdue';
  dueDate: string;
  description: string;
}

interface Contract {
  id: string;
  title: string;
  designer: string;
  client: string;
  amount: number;
  status: 'draft' | 'pending' | 'signed' | 'completed';
  createDate: string;
  signDate?: string;
  type: 'design' | 'construction' | 'consultation';
}

interface CopyrightRegistration {
  id: string;
  title: string;
  type: 'architectural' | 'interior' | 'landscape';
  status: 'submitted' | 'reviewing' | 'approved' | 'rejected';
  submitDate: string;
  approveDate?: string;
  certificateUrl?: string;
}

const PaymentSystem: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'payment' | 'contract' | 'copyright'>('payment');
  const [paymentModalVisible, setPaymentModalVisible] = useState(false);
  const [contractModalVisible, setContractModalVisible] = useState(false);
  const [copyrightModalVisible, setCopyrightModalVisible] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<PaymentStage | null>(null);
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [paymentForm] = Form.useForm();
  const [contractForm] = Form.useForm();
  const [copyrightForm] = Form.useForm();

  // 模拟数据
  const paymentStages: PaymentStage[] = [
    {
      id: '1',
      stage: '设计定金',
      amount: 5000,
      percentage: 20,
      status: 'paid',
      dueDate: '2024-01-15',
      description: '项目启动定金，确认设计需求'
    },
    {
      id: '2',
      stage: '方案确认',
      amount: 7500,
      percentage: 30,
      status: 'paid',
      dueDate: '2024-02-15',
      description: '初步方案确认后支付'
    },
    {
      id: '3',
      stage: '施工图完成',
      amount: 7500,
      percentage: 30,
      status: 'pending',
      dueDate: '2024-03-15',
      description: '施工图纸完成后支付'
    },
    {
      id: '4',
      stage: '项目验收',
      amount: 5000,
      percentage: 20,
      status: 'pending',
      dueDate: '2024-04-15',
      description: '项目最终验收后支付'
    }
  ];

  const contracts: Contract[] = [
    {
      id: '1',
      title: '现代简约住宅设计合同',
      designer: '张设计师',
      client: '李先生',
      amount: 25000,
      status: 'signed',
      createDate: '2024-01-10',
      signDate: '2024-01-12',
      type: 'design'
    },
    {
      id: '2',
      title: '办公空间装修合同',
      designer: '王设计师',
      client: '某科技公司',
      amount: 150000,
      status: 'pending',
      createDate: '2024-01-20',
      type: 'construction'
    }
  ];

  const copyrightRegistrations: CopyrightRegistration[] = [
    {
      id: '1',
      title: '现代简约住宅设计方案',
      type: 'interior',
      status: 'approved',
      submitDate: '2024-01-15',
      approveDate: '2024-02-01',
      certificateUrl: '/certificates/cert-001.pdf'
    },
    {
      id: '2',
      title: '商业综合体建筑设计',
      type: 'architectural',
      status: 'reviewing',
      submitDate: '2024-02-10'
    }
  ];

  const handlePayment = async (values: any) => {
    try {
      // 模拟支付处理
      await new Promise(resolve => setTimeout(resolve, 2000));
      message.success('支付成功！');
      setPaymentModalVisible(false);
      paymentForm.resetFields();
    } catch (error) {
      message.error('支付失败，请重试');
    }
  };

  const handleContractSign = async (values: any) => {
    try {
      // 模拟合同签署处理
      await new Promise(resolve => setTimeout(resolve, 1500));
      message.success('合同签署成功！');
      setContractModalVisible(false);
      contractForm.resetFields();
    } catch (error) {
      message.error('合同签署失败，请重试');
    }
  };

  const handleCopyrightSubmit = async (values: any) => {
    try {
      // 模拟版权登记提交
      await new Promise(resolve => setTimeout(resolve, 1500));
      message.success('版权登记申请提交成功！');
      setCopyrightModalVisible(false);
      copyrightForm.resetFields();
    } catch (error) {
      message.error('提交失败，请重试');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
      case 'signed':
      case 'approved':
        return 'success';
      case 'pending':
      case 'reviewing':
        return 'processing';
      case 'overdue':
      case 'rejected':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusText = (status: string, type: 'payment' | 'contract' | 'copyright') => {
    if (type === 'payment') {
      switch (status) {
        case 'paid': return '已支付';
        case 'pending': return '待支付';
        case 'overdue': return '已逾期';
        default: return status;
      }
    } else if (type === 'contract') {
      switch (status) {
        case 'draft': return '草稿';
        case 'pending': return '待签署';
        case 'signed': return '已签署';
        case 'completed': return '已完成';
        default: return status;
      }
    } else {
      switch (status) {
        case 'submitted': return '已提交';
        case 'reviewing': return '审核中';
        case 'approved': return '已通过';
        case 'rejected': return '已拒绝';
        default: return status;
      }
    }
  };

  const paymentColumns: ColumnsType<PaymentStage> = [
    {
      title: '支付阶段',
      dataIndex: 'stage',
      key: 'stage',
      render: (text, record) => (
        <Space direction="vertical" size={0}>
          <Text strong>{text}</Text>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            {record.description}
          </Text>
        </Space>
      )
    },
    {
      title: '金额',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount) => (
        <Text strong style={{ color: '#ff6b9d' }}>¥{amount.toLocaleString()}</Text>
      )
    },
    {
      title: '比例',
      dataIndex: 'percentage',
      key: 'percentage',
      render: (percentage) => `${percentage}%`
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={getStatusColor(status)}>
          {getStatusText(status, 'payment')}
        </Tag>
      )
    },
    {
      title: '截止日期',
      dataIndex: 'dueDate',
      key: 'dueDate'
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space>
          {record.status === 'pending' && (
            <Button 
              type="primary" 
              size="small"
              icon={<PayCircleOutlined />}
              onClick={() => {
                setSelectedPayment(record);
                setPaymentModalVisible(true);
              }}
            >
              支付
            </Button>
          )}
          <Button 
            size="small" 
            icon={<EyeOutlined />}
          >
            详情
          </Button>
        </Space>
      )
    }
  ];

  const totalAmount = paymentStages.reduce((sum, stage) => sum + stage.amount, 0);
  const paidAmount = paymentStages
    .filter(stage => stage.status === 'paid')
    .reduce((sum, stage) => sum + stage.amount, 0);
  const paymentProgress = (paidAmount / totalAmount) * 100;

  return (
    <div className="payment-system">
      {/* 系统头部 */}
      <div className="system-header">
        <Title level={2}>财务管理系统</Title>
        <Text type="secondary">管理项目支付、合同签署和版权登记</Text>
      </div>

      {/* 统计卡片 */}
      <Row gutter={24} style={{ marginBottom: 24 }}>
        <Col span={8}>
          <Card>
            <Statistic
              title="项目总金额"
              value={totalAmount}
              prefix="¥"
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="已收金额"
              value={paidAmount}
              prefix="¥"
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="支付进度"
              value={paymentProgress}
              suffix="%"
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 系统选项卡 */}
      <div className="system-tabs">
        <Button
          type={activeTab === 'payment' ? 'primary' : 'default'}
          icon={<CreditCardOutlined />}
          onClick={() => setActiveTab('payment')}
        >
          多阶段支付
        </Button>
        <Button
          type={activeTab === 'contract' ? 'primary' : 'default'}
          icon={<FileTextOutlined />}
          onClick={() => setActiveTab('contract')}
        >
          电子合同
        </Button>
        <Button
          type={activeTab === 'copyright' ? 'primary' : 'default'}
          icon={<SafetyCertificateOutlined />}
          onClick={() => setActiveTab('copyright')}
        >
          版权登记
        </Button>
      </div>

      {/* 多阶段支付管理 */}
      {activeTab === 'payment' && (
        <Card className="payment-card">
          <div className="payment-overview">
            <Title level={4}>项目支付进度</Title>
            <Steps
              current={paymentStages.findIndex(stage => stage.status === 'pending')}
              status={paymentStages.some(stage => stage.status === 'overdue') ? 'error' : 'process'}
            >
              {paymentStages.map((stage, index) => (
                <Step
                  key={stage.id}
                  title={stage.stage}
                  description={`¥${stage.amount.toLocaleString()}`}
                  icon={
                    stage.status === 'paid' ? <CheckCircleOutlined /> :
                    stage.status === 'overdue' ? <ExclamationCircleOutlined /> :
                    <ClockCircleOutlined />
                  }
                />
              ))}
            </Steps>
          </div>
          
          <Divider />
          
          <div className="payment-actions">
            <Space>
              <Button type="primary" icon={<PlusOutlined />}>
                添加支付阶段
              </Button>
              <Button icon={<DownloadOutlined />}>
                导出支付记录
              </Button>
            </Space>
          </div>
          
          <Table
            columns={paymentColumns}
            dataSource={paymentStages}
            rowKey="id"
            pagination={false}
            style={{ marginTop: 16 }}
          />
        </Card>
      )}

      {/* 电子合同管理 */}
      {activeTab === 'contract' && (
        <Card className="contract-card">
          <div className="contract-header">
            <Title level={4}>合同管理</Title>
            <Button 
              type="primary" 
              icon={<PlusOutlined />}
              onClick={() => setContractModalVisible(true)}
            >
              创建合同
            </Button>
          </div>
          
          <div className="contract-list">
            {contracts.map(contract => (
              <Card key={contract.id} className="contract-item">
                <div className="contract-header">
                  <Space>
                    <Title level={5}>{contract.title}</Title>
                    <Tag color={getStatusColor(contract.status)}>
                      {getStatusText(contract.status, 'contract')}
                    </Tag>
                  </Space>
                  <div className="contract-actions">
                    <Space>
                      <Button size="small" icon={<EyeOutlined />}>
                        查看
                      </Button>
                      <Button size="small" icon={<DownloadOutlined />}>
                        下载
                      </Button>
                      {contract.status === 'pending' && (
                        <Button 
                          type="primary" 
                          size="small" 
                          icon={<EditOutlined />}
                          onClick={() => {
                            setSelectedContract(contract);
                            setContractModalVisible(true);
                          }}
                        >
                          签署
                        </Button>
                      )}
                    </Space>
                  </div>
                </div>
                
                <Descriptions size="small" column={2}>
                  <Descriptions.Item label="设计师">{contract.designer}</Descriptions.Item>
                  <Descriptions.Item label="客户">{contract.client}</Descriptions.Item>
                  <Descriptions.Item label="合同金额">¥{contract.amount.toLocaleString()}</Descriptions.Item>
                  <Descriptions.Item label="创建日期">{contract.createDate}</Descriptions.Item>
                  {contract.signDate && (
                    <Descriptions.Item label="签署日期">{contract.signDate}</Descriptions.Item>
                  )}
                </Descriptions>
              </Card>
            ))}
          </div>
        </Card>
      )}

      {/* 版权登记管理 */}
      {activeTab === 'copyright' && (
        <Card className="copyright-card">
          <div className="copyright-header">
            <Title level={4}>版权登记</Title>
            <Button 
              type="primary" 
              icon={<PlusOutlined />}
              onClick={() => setCopyrightModalVisible(true)}
            >
              申请登记
            </Button>
          </div>
          
          <div className="copyright-list">
            {copyrightRegistrations.map(registration => (
              <Card key={registration.id} className="copyright-item">
                <div className="copyright-header">
                  <Space>
                    <Title level={5}>{registration.title}</Title>
                    <Tag color={getStatusColor(registration.status)}>
                      {getStatusText(registration.status, 'copyright')}
                    </Tag>
                  </Space>
                  <div className="copyright-actions">
                    <Space>
                      <Button size="small" icon={<EyeOutlined />}>
                        查看
                      </Button>
                      {registration.certificateUrl && (
                        <Button 
                          type="primary" 
                          size="small" 
                          icon={<DownloadOutlined />}
                        >
                          下载证书
                        </Button>
                      )}
                    </Space>
                  </div>
                </div>
                
                <Descriptions size="small" column={2}>
                  <Descriptions.Item label="作品类型">
                    {registration.type === 'architectural' ? '建筑设计' :
                     registration.type === 'interior' ? '室内设计' : '景观设计'}
                  </Descriptions.Item>
                  <Descriptions.Item label="提交日期">{registration.submitDate}</Descriptions.Item>
                  {registration.approveDate && (
                    <Descriptions.Item label="审批日期">{registration.approveDate}</Descriptions.Item>
                  )}
                </Descriptions>
              </Card>
            ))}
          </div>
        </Card>
      )}

      {/* 支付模态框 */}
      <Modal
        title="支付确认"
        open={paymentModalVisible}
        onCancel={() => {
          setPaymentModalVisible(false);
          setSelectedPayment(null);
          paymentForm.resetFields();
        }}
        footer={null}
        width={600}
      >
        {selectedPayment && (
          <Form
            form={paymentForm}
            layout="vertical"
            onFinish={handlePayment}
            initialValues={{
              paymentMethod: 'alipay',
              amount: selectedPayment.amount
            }}
          >
            <Alert
              message={`支付阶段：${selectedPayment.stage}`}
              description={selectedPayment.description}
              type="info"
              showIcon
              style={{ marginBottom: 16 }}
            />
            
            <Form.Item
              label="支付方式"
              name="paymentMethod"
              rules={[{ required: true, message: '请选择支付方式' }]}
            >
              <Radio.Group>
                <Radio.Button value="alipay">支付宝</Radio.Button>
                <Radio.Button value="wechat">微信支付</Radio.Button>
                <Radio.Button value="bank">银行转账</Radio.Button>
              </Radio.Group>
            </Form.Item>
            
            <Form.Item
              label="支付金额"
              name="amount"
              rules={[{ required: true, message: '请输入支付金额' }]}
            >
              <InputNumber
                style={{ width: '100%' }}
                formatter={value => `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => value!.replace(/¥\s?|(,*)/g, '')}
                min={0}
                max={selectedPayment.amount}
              />
            </Form.Item>
            
            <Form.Item
              label="支付密码"
              name="password"
              rules={[{ required: true, message: '请输入支付密码' }]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="请输入支付密码"
              />
            </Form.Item>
            
            <Alert
              message="安全提示"
              description="请确认支付金额和收款方信息，支付后无法撤销。"
              type="warning"
              showIcon
              style={{ marginBottom: 16 }}
            />
            
            <Form.Item>
              <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
                <Button onClick={() => setPaymentModalVisible(false)}>
                  取消
                </Button>
                <Button type="primary" htmlType="submit">
                  确认支付
                </Button>
              </Space>
            </Form.Item>
          </Form>
        )}
      </Modal>

      {/* 合同模态框 */}
      <Modal
        title={selectedContract ? '签署合同' : '创建合同'}
        open={contractModalVisible}
        onCancel={() => {
          setContractModalVisible(false);
          setSelectedContract(null);
          contractForm.resetFields();
        }}
        footer={null}
        width={800}
      >
        <Form
          form={contractForm}
          layout="vertical"
          onFinish={handleContractSign}
          initialValues={selectedContract || {}}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="合同标题"
                name="title"
                rules={[{ required: true, message: '请输入合同标题' }]}
              >
                <Input placeholder="请输入合同标题" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="合同类型"
                name="type"
                rules={[{ required: true, message: '请选择合同类型' }]}
              >
                <Select placeholder="请选择合同类型">
                  <Option value="design">设计合同</Option>
                  <Option value="construction">施工合同</Option>
                  <Option value="consultation">咨询合同</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="设计师"
                name="designer"
                rules={[{ required: true, message: '请输入设计师姓名' }]}
              >
                <Input placeholder="请输入设计师姓名" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="客户"
                name="client"
                rules={[{ required: true, message: '请输入客户姓名' }]}
              >
                <Input placeholder="请输入客户姓名" />
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item
            label="合同金额"
            name="amount"
            rules={[{ required: true, message: '请输入合同金额' }]}
          >
            <InputNumber
              style={{ width: '100%' }}
              formatter={value => `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value!.replace(/¥\s?|(,*)/g, '')}
              min={0}
              placeholder="请输入合同金额"
            />
          </Form.Item>
          
          <Form.Item
            label="合同条款"
            name="terms"
            rules={[{ required: true, message: '请输入合同条款' }]}
          >
            <TextArea
              rows={6}
              placeholder="请输入详细的合同条款和条件"
            />
          </Form.Item>
          
          <Form.Item
            label="附件上传"
            name="attachments"
          >
            <Upload
              multiple
              beforeUpload={() => false}
              listType="text"
            >
              <Button icon={<UploadOutlined />}>上传附件</Button>
            </Upload>
          </Form.Item>
          
          {selectedContract && (
            <Form.Item
              name="agree"
              valuePropName="checked"
              rules={[{ required: true, message: '请同意合同条款' }]}
            >
              <Checkbox>
                我已仔细阅读并同意以上合同条款
              </Checkbox>
            </Form.Item>
          )}
          
          <Form.Item>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button onClick={() => setContractModalVisible(false)}>
                取消
              </Button>
              <Button type="primary" htmlType="submit">
                {selectedContract ? '确认签署' : '创建合同'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* 版权登记模态框 */}
      <Modal
        title="版权登记申请"
        open={copyrightModalVisible}
        onCancel={() => {
          setCopyrightModalVisible(false);
          copyrightForm.resetFields();
        }}
        footer={null}
        width={600}
      >
        <Form
          form={copyrightForm}
          layout="vertical"
          onFinish={handleCopyrightSubmit}
        >
          <Form.Item
            label="作品标题"
            name="title"
            rules={[{ required: true, message: '请输入作品标题' }]}
          >
            <Input placeholder="请输入作品标题" />
          </Form.Item>
          
          <Form.Item
            label="作品类型"
            name="type"
            rules={[{ required: true, message: '请选择作品类型' }]}
          >
            <Select placeholder="请选择作品类型">
              <Option value="architectural">建筑设计</Option>
              <Option value="interior">室内设计</Option>
              <Option value="landscape">景观设计</Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            label="完成日期"
            name="completionDate"
            rules={[{ required: true, message: '请选择完成日期' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          
          <Form.Item
            label="作品描述"
            name="description"
            rules={[{ required: true, message: '请输入作品描述' }]}
          >
            <TextArea
              rows={4}
              placeholder="请详细描述作品的设计理念、特点等"
            />
          </Form.Item>
          
          <Form.Item
            label="作品文件"
            name="files"
            rules={[{ required: true, message: '请上传作品文件' }]}
          >
            <Upload
              multiple
              beforeUpload={() => false}
              listType="picture-card"
              accept=".jpg,.jpeg,.png,.pdf,.dwg"
            >
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>上传文件</div>
              </div>
            </Upload>
          </Form.Item>
          
          <Alert
            message="申请说明"
            description="版权登记申请提交后，将在5-10个工作日内完成审核。请确保上传的文件清晰完整。"
            type="info"
            showIcon
            style={{ marginBottom: 16 }}
          />
          
          <Form.Item>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button onClick={() => setCopyrightModalVisible(false)}>
                取消
              </Button>
              <Button type="primary" htmlType="submit">
                提交申请
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default PaymentSystem;