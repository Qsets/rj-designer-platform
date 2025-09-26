import React, { useState, useRef, useEffect } from 'react';
import { Layout, List, Avatar, Input, Button, Typography, Badge, Empty, Divider, Card, Tag, Dropdown, Menu } from 'antd';
import { SendOutlined, SearchOutlined, MoreOutlined, PhoneOutlined, VideoCameraOutlined, FileOutlined, PictureOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import './Messages.css';

const { Sider, Content } = Layout;
const { Title, Text } = Typography;
const { TextArea } = Input;

interface Message {
  id: string;
  content: string;
  type: 'text' | 'image' | 'file';
  sender: 'me' | 'other';
  timestamp: string;
  status?: 'sending' | 'sent' | 'read';
}

interface Conversation {
  id: string;
  name: string;
  avatar?: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  online: boolean;
  type: 'project' | 'system' | 'chat';
  projectInfo?: {
    title: string;
    status: string;
  };
}

const Messages: React.FC = () => {
  const [selectedConversation, setSelectedConversation] = useState<string>('1');
  const [messageInput, setMessageInput] = useState('');
  const [searchText, setSearchText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 模拟对话列表
  const conversations: Conversation[] = [
    {
      id: '1',
      name: '张设计师',
      avatar: 'https://via.placeholder.com/40',
      lastMessage: '好的，我会尽快完成设计稿',
      lastMessageTime: '2024-01-15 14:30',
      unreadCount: 2,
      online: true,
      type: 'project',
      projectInfo: {
        title: '电商平台UI设计',
        status: '进行中'
      }
    },
    {
      id: '2',
      name: '李业主',
      avatar: 'https://via.placeholder.com/40',
      lastMessage: '请问什么时候可以看到初稿？',
      lastMessageTime: '2024-01-15 12:15',
      unreadCount: 0,
      online: false,
      type: 'project',
      projectInfo: {
        title: '品牌设计项目',
        status: '待确认'
      }
    },
    {
      id: '3',
      name: '系统通知',
      avatar: undefined,
      lastMessage: '您的项目已通过审核',
      lastMessageTime: '2024-01-15 10:00',
      unreadCount: 1,
      online: false,
      type: 'system'
    },
    {
      id: '4',
      name: '王总',
      avatar: 'https://via.placeholder.com/40',
      lastMessage: '合作愉快！',
      lastMessageTime: '2024-01-14 18:45',
      unreadCount: 0,
      online: true,
      type: 'chat'
    }
  ];

  // 模拟消息数据
  const messages: Record<string, Message[]> = {
    '1': [
      {
        id: '1',
        content: '您好，关于电商平台的设计，我有一些想法想和您讨论',
        type: 'text',
        sender: 'other',
        timestamp: '2024-01-15 14:00',
        status: 'read'
      },
      {
        id: '2',
        content: '好的，请说说您的想法',
        type: 'text',
        sender: 'me',
        timestamp: '2024-01-15 14:05',
        status: 'read'
      },
      {
        id: '3',
        content: '我觉得首页的布局可以更加简洁一些，突出主要功能',
        type: 'text',
        sender: 'other',
        timestamp: '2024-01-15 14:10',
        status: 'read'
      },
      {
        id: '4',
        content: '好的，我会尽快完成设计稿',
        type: 'text',
        sender: 'other',
        timestamp: '2024-01-15 14:30',
        status: 'sent'
      }
    ],
    '2': [
      {
        id: '1',
        content: '请问什么时候可以看到初稿？',
        type: 'text',
        sender: 'other',
        timestamp: '2024-01-15 12:15',
        status: 'read'
      }
    ],
    '3': [
      {
        id: '1',
        content: '您的项目已通过审核，可以开始接收申请了',
        type: 'text',
        sender: 'other',
        timestamp: '2024-01-15 10:00',
        status: 'sent'
      }
    ],
    '4': [
      {
        id: '1',
        content: '合作愉快！',
        type: 'text',
        sender: 'other',
        timestamp: '2024-01-14 18:45',
        status: 'read'
      }
    ]
  };

  const currentConversation = conversations.find(c => c.id === selectedConversation);
  const currentMessages = messages[selectedConversation] || [];

  const filteredConversations = conversations.filter(conv =>
    conv.name.toLowerCase().includes(searchText.toLowerCase()) ||
    conv.lastMessage.toLowerCase().includes(searchText.toLowerCase())
  );

  useEffect(() => {
    scrollToBottom();
  }, [currentMessages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = () => {
    if (!messageInput.trim()) return;

    // 这里应该调用API发送消息
    console.log('发送消息:', messageInput);
    setMessageInput('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getConversationIcon = (conversation: Conversation) => {
    if (conversation.type === 'system') {
      return <Avatar style={{ backgroundColor: '#1890ff' }}>系</Avatar>;
    }
    return (
      <Badge dot={conversation.online} offset={[-8, 32]}>
        <Avatar src={conversation.avatar} size={40}>
          {conversation.name[0]}
        </Avatar>
      </Badge>
    );
  };

  const getMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' });
    }
  };

  const conversationMenuItems: MenuProps['items'] = [
    {
      key: 'call',
      label: '语音通话',
      icon: <PhoneOutlined />
    },
    {
      key: 'video',
      label: '视频通话',
      icon: <VideoCameraOutlined />
    },
    {
      type: 'divider'
    },
    {
      key: 'clear',
      label: '清空聊天记录',
      danger: true
    }
  ];

  return (
    <div className="messages-container">
      <Layout className="messages-layout">
        {/* 对话列表 */}
        <Sider width={320} className="conversations-sider">
          <div className="conversations-header">
            <Title level={4}>消息</Title>
            <Input
              placeholder="搜索对话"
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
            />
          </div>

          <div className="conversations-list">
            {filteredConversations.length > 0 ? (
              <List
                dataSource={filteredConversations}
                renderItem={(conversation) => (
                  <List.Item
                    className={`conversation-item ${selectedConversation === conversation.id ? 'active' : ''}`}
                    onClick={() => setSelectedConversation(conversation.id)}
                  >
                    <List.Item.Meta
                      avatar={getConversationIcon(conversation)}
                      title={
                        <div className="conversation-title">
                          <span className="name">{conversation.name}</span>
                          <span className="time">{getMessageTime(conversation.lastMessageTime)}</span>
                        </div>
                      }
                      description={
                        <div className="conversation-description">
                          <div className="last-message">
                            {conversation.lastMessage}
                          </div>
                          {conversation.projectInfo && (
                            <div className="project-info">
                              <Tag size="small" color="blue">
                                {conversation.projectInfo.title}
                              </Tag>
                            </div>
                          )}
                        </div>
                      }
                    />
                    {conversation.unreadCount > 0 && (
                      <Badge
                        count={conversation.unreadCount}
                        className="unread-badge"
                      />
                    )}
                  </List.Item>
                )}
              />
            ) : (
              <Empty description="暂无对话" />
            )}
          </div>
        </Sider>

        {/* 聊天区域 */}
        <Content className="chat-content">
          {currentConversation ? (
            <>
              {/* 聊天头部 */}
              <div className="chat-header">
                <div className="chat-info">
                  <Avatar src={currentConversation.avatar} size={32}>
                    {currentConversation.name[0]}
                  </Avatar>
                  <div className="chat-details">
                    <Title level={5}>{currentConversation.name}</Title>
                    {currentConversation.online && (
                      <Text type="secondary" className="online-status">在线</Text>
                    )}
                    {currentConversation.projectInfo && (
                      <Text type="secondary" className="project-title">
                        {currentConversation.projectInfo.title}
                      </Text>
                    )}
                  </div>
                </div>
                <div className="chat-actions">
                  <Dropdown menu={{ items: conversationMenuItems }} trigger={['click']}>
                    <Button type="text" icon={<MoreOutlined />} />
                  </Dropdown>
                </div>
              </div>

              <Divider style={{ margin: 0 }} />

              {/* 消息列表 */}
              <div className="messages-list">
                {currentMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`message-item ${message.sender === 'me' ? 'sent' : 'received'}`}
                  >
                    {message.sender === 'other' && (
                      <Avatar
                        src={currentConversation.avatar}
                        size={32}
                        className="message-avatar"
                      >
                        {currentConversation.name[0]}
                      </Avatar>
                    )}
                    <div className="message-content">
                      <div className="message-bubble">
                        {message.content}
                      </div>
                      <div className="message-meta">
                        <span className="message-time">
                          {getMessageTime(message.timestamp)}
                        </span>
                        {message.sender === 'me' && message.status && (
                          <span className={`message-status ${message.status}`}>
                            {message.status === 'sending' && '发送中'}
                            {message.status === 'sent' && '已发送'}
                            {message.status === 'read' && '已读'}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* 输入区域 */}
              <div className="message-input-area">
                <div className="input-toolbar">
                  <Button type="text" icon={<PictureOutlined />} />
                  <Button type="text" icon={<FileOutlined />} />
                </div>
                <div className="input-container">
                  <TextArea
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="输入消息..."
                    autoSize={{ minRows: 1, maxRows: 4 }}
                    className="message-input"
                  />
                  <Button
                    type="primary"
                    icon={<SendOutlined />}
                    onClick={handleSendMessage}
                    disabled={!messageInput.trim()}
                    className="send-button"
                  >
                    发送
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="no-conversation">
              <Empty
                description="选择一个对话开始聊天"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            </div>
          )}
        </Content>
      </Layout>
    </div>
  );
};

export default Messages;