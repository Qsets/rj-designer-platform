import React, { useState } from 'react';
import {
  Modal,
  Button,
  Card,
  Tag,
  Space,
  Typography,
  Divider,
  message,
  Badge,
  Tooltip,
  Row,
  Col
} from 'antd';
import {
  GiftOutlined,
  CopyOutlined,
  UserOutlined,
  CrownOutlined,
  StarOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  InfoCircleOutlined
} from '@ant-design/icons';
import './InviteCodeDisplay.css';

const { Text, Title, Paragraph } = Typography;

interface InviteCode {
  id: string;
  code: string;
  type: 'designer' | 'owner' | 'premium';
  status: 'active' | 'used' | 'expired';
  expiryDate: string;
  description: string;
  usageCount: number;
  maxUsage: number;
}

interface InviteCodeDisplayProps {
  visible?: boolean;
  onClose?: () => void;
}

const InviteCodeDisplay: React.FC<InviteCodeDisplayProps> = ({ 
  visible = false, 
  onClose 
}) => {
  const [showModal, setShowModal] = useState(visible);
  const [selectedCode, setSelectedCode] = useState<InviteCode | null>(null);

  // 模拟邀请码数据
  const inviteCodes: InviteCode[] = [
    {
      id: '1',
      code: 'DESIGNER2024',
      type: 'designer',
      status: 'active',
      expiryDate: '2024-12-31',
      description: '设计师专用邀请码，享受专业设计工具',
      usageCount: 15,
      maxUsage: 100
    },
    {
      id: '2',
      code: 'OWNER2024',
      type: 'owner',
      status: 'active',
      expiryDate: '2024-12-31',
      description: '业主专用邀请码，快速找到优质设计师',
      usageCount: 8,
      maxUsage: 50
    },
    {
      id: '3',
      code: 'PREMIUM2024',
      type: 'premium',
      status: 'active',
      expiryDate: '2024-12-31',
      description: '高级会员邀请码，享受全部功能',
      usageCount: 3,
      maxUsage: 20
    },
    {
      id: '4',
      code: 'EXPIRED2023',
      type: 'designer',
      status: 'expired',
      expiryDate: '2023-12-31',
      description: '已过期的设计师邀请码',
      usageCount: 50,
      maxUsage: 50
    }
  ];

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code).then(() => {
      message.success('邀请码已复制到剪贴板');
    }).catch(() => {
      message.error('复制失败，请手动复制');
    });
  };

  const handleCopyAllCodes = () => {
    const activeCodes = inviteCodes
      .filter(code => code.status === 'active')
      .map(code => `${code.code} - ${code.description}`)
      .join('\n');
    
    navigator.clipboard.writeText(activeCodes).then(() => {
      message.success('所有有效邀请码已复制到剪贴板');
    }).catch(() => {
      message.error('复制失败，请手动复制');
    });
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'designer':
        return <StarOutlined />;
      case 'owner':
        return <UserOutlined />;
      case 'premium':
        return <CrownOutlined />;
      default:
        return <GiftOutlined />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'designer':
        return 'blue';
      case 'owner':
        return 'green';
      case 'premium':
        return 'gold';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircleOutlined />;
      case 'used':
        return <ExclamationCircleOutlined />;
      case 'expired':
        return <ClockCircleOutlined />;
      default:
        return <InfoCircleOutlined />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'used':
        return 'warning';
      case 'expired':
        return 'error';
      default:
        return 'default';
    }
  };

  const activeCodesCount = inviteCodes.filter(code => code.status === 'active').length;
  const totalUsage = inviteCodes.reduce((sum, code) => sum + code.usageCount, 0);

  return (
    <>
      <Button 
        type="primary" 
        icon={<GiftOutlined />}
        onClick={() => setShowModal(true)}
        className="invite-code-trigger"
      >
        查看邀请码
      </Button>

      <Modal
        title={
          <Space>
            <GiftOutlined />
            <span>邀请码管理</span>
          </Space>
        }
        open={showModal}
        onCancel={() => {
          setShowModal(false);
          onClose?.();
        }}
        footer={[
          <Button key="copy-all" onClick={handleCopyAllCodes}>
            <CopyOutlined /> 复制所有有效邀请码
          </Button>,
          <Button key="close" onClick={() => {
            setShowModal(false);
            onClose?.();
          }}>
            关闭
          </Button>
        ]}
        width={800}
        className="invite-code-modal"
      >
        <div className="invite-code-container">
          {/* 概览卡片 */}
          <Card className="invite-code-summary">
            <Row gutter={24}>
              <Col span={8}>
                <div className="summary-item">
                  <Badge count={activeCodesCount} showZero>
                    <GiftOutlined className="summary-icon" />
                  </Badge>
                  <div className="summary-text">
                    <Text type="secondary">有效邀请码</Text>
                    <Title level={4}>{activeCodesCount}</Title>
                  </div>
                </div>
              </Col>
              <Col span={8}>
                <div className="summary-item">
                  <Badge count={totalUsage} showZero>
                    <UserOutlined className="summary-icon" />
                  </Badge>
                  <div className="summary-text">
                    <Text type="secondary">总使用次数</Text>
                    <Title level={4}>{totalUsage}</Title>
                  </div>
                </div>
              </Col>
              <Col span={8}>
                <div className="summary-item">
                  <Badge count={inviteCodes.length} showZero>
                    <InfoCircleOutlined className="summary-icon" />
                  </Badge>
                  <div className="summary-text">
                    <Text type="secondary">邀请码总数</Text>
                    <Title level={4}>{inviteCodes.length}</Title>
                  </div>
                </div>
              </Col>
            </Row>
          </Card>

          <Divider />

          {/* 邀请码列表 */}
          <div className="invite-codes-list">
            {inviteCodes.map((inviteCode, index) => (
              <Card 
                key={inviteCode.id} 
                className="invite-code-card"
                hoverable
              >
                <div className="code-header">
                  <Space>
                    <Text strong>#{index + 1}</Text>
                    <Text 
                      code 
                      className="code-value"
                      onClick={() => handleCopyCode(inviteCode.code)}
                    >
                      {inviteCode.code}
                    </Text>
                    <Tag 
                      color={getStatusColor(inviteCode.status)}
                      icon={getStatusIcon(inviteCode.status)}
                    >
                      {inviteCode.status === 'active' ? '有效' : 
                       inviteCode.status === 'used' ? '已用完' : '已过期'}
                    </Tag>
                  </Space>
                  <Tooltip title="点击复制">
                    <Button 
                      type="text" 
                      icon={<CopyOutlined />}
                      onClick={() => handleCopyCode(inviteCode.code)}
                    />
                  </Tooltip>
                </div>

                <div className="code-info">
                  <div className="info-row">
                    <Space>
                      <Tag 
                        color={getTypeColor(inviteCode.type)}
                        icon={getTypeIcon(inviteCode.type)}
                      >
                        {inviteCode.type === 'designer' ? '设计师' :
                         inviteCode.type === 'owner' ? '业主' : '高级会员'}
                      </Tag>
                      <Text type="secondary">
                        过期时间：{inviteCode.expiryDate}
                      </Text>
                    </Space>
                  </div>
                  
                  <Paragraph className="code-description">
                    {inviteCode.description}
                  </Paragraph>
                  
                  <div className="usage-info">
                    <Text type="secondary">
                      使用次数：{inviteCode.usageCount} / {inviteCode.maxUsage}
                    </Text>
                    <div className="usage-progress">
                      <div 
                        className="usage-bar"
                        style={{
                          width: `${(inviteCode.usageCount / inviteCode.maxUsage) * 100}%`,
                          backgroundColor: inviteCode.status === 'active' ? '#52c41a' : '#ff4d4f'
                        }}
                      />
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <Divider />

          {/* 使用说明 */}
          <Card className="usage-instructions">
            <Title level={5}>
              <InfoCircleOutlined /> 使用说明
            </Title>
            <Paragraph>
              <ul>
                <li><strong>设计师邀请码：</strong>适用于专业设计师注册，享受设计工具和项目管理功能</li>
                <li><strong>业主邀请码：</strong>适用于有设计需求的业主，可快速找到合适的设计师</li>
                <li><strong>高级会员邀请码：</strong>享受平台所有高级功能，包括优先推荐和专属客服</li>
                <li><strong>注册流程：</strong>选择用户类型 → 输入邀请码 → 完善个人信息 → 开始使用</li>
              </ul>
            </Paragraph>
          </Card>
        </div>
      </Modal>
    </>
  );
};

export default InviteCodeDisplay;