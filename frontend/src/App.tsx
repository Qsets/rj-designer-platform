import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout, Menu, Avatar, Dropdown, Button, Space, Badge, ConfigProvider } from 'antd';
import {
  HomeOutlined,
  UserOutlined,
  ProjectOutlined,
  MessageOutlined,
  DashboardOutlined,
  BellOutlined,
  SettingOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  CreditCardOutlined
} from '@ant-design/icons';
import zhCN from 'antd/locale/zh_CN';
import { useAuthStore } from './stores/authStore';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// 页面组件导入
import Home from './pages/Home';
import Profile from './pages/Profile';
import Projects from './pages/Projects';
import Messages from './pages/Messages';
import Dashboard from './pages/Dashboard';
import DesignerDashboard from './pages/designer/Dashboard';
import OwnerDashboard from './pages/owner/Dashboard';
import PaymentSystem from './components/PaymentSystem';

import './App.css';

const { Header, Sider, Content } = Layout;

// 受保护的路由组件
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuthStore()
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  
  return <>{children}</>
}

// 公开路由组件（已登录用户不能访问）
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuthStore()
  
  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }
  
  return <>{children}</>
}

const App: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuthStore();
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKey, setSelectedKey] = useState('home');

  // 粉白色主题配置
  const pinkWhiteTheme = {
    token: {
      colorPrimary: '#ff69b4',
      colorSuccess: '#ff91a4',
      colorWarning: '#ffb3ba',
      colorError: '#ff6b9d',
      colorInfo: '#ffc0cb',
      colorBgBase: '#fefefe',
      colorBgContainer: '#ffffff',
      colorBgElevated: '#fff5f7',
      colorBorder: '#ffe4e6',
      colorBorderSecondary: '#ffcccb',
      colorText: '#2c2c2c',
      colorTextSecondary: '#666666',
      colorTextTertiary: '#999999',
      borderRadius: 12,
      boxShadow: '0 2px 8px rgba(255, 105, 180, 0.1)',
      fontFamily: '"Inter", "PingFang SC", "Microsoft YaHei", sans-serif',
    },
    components: {
      Layout: {
        headerBg: '#ffffff',
        siderBg: '#fff8f9',
        bodyBg: '#fefefe',
      },
      Menu: {
        itemBg: 'transparent',
        itemSelectedBg: '#ffe4e6',
        itemHoverBg: '#fff0f1',
        itemSelectedColor: '#ff69b4',
        itemColor: '#666666',
      },
      Button: {
        primaryShadow: '0 2px 4px rgba(255, 105, 180, 0.2)',
      },
      Card: {
        headerBg: '#fff8f9',
      },
    },
  };

  const menuItems = [
    {
      key: 'home',
      icon: <HomeOutlined />,
      label: '首页',
    },
    {
      key: 'projects',
      icon: <ProjectOutlined />,
      label: '项目',
    },
    {
      key: 'messages',
      icon: <MessageOutlined />,
      label: '消息',
      badge: 3,
    },
    {
      key: 'payment',
      icon: <CreditCardOutlined />,
      label: '交易系统',
    },
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: '工作台',
    },
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人中心',
    },
  ];

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人资料',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: '设置',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      onClick: logout,
    },
  ];

  const renderContent = () => {
    switch (selectedKey) {
      case 'home':
        return <Home />;
      case 'projects':
        return <Projects />;
      case 'messages':
        return <Messages />;
      case 'payment':
        return <PaymentSystem />;
      case 'dashboard':
        if (user?.role === 'designer') {
          return <DesignerDashboard />;
        } else if (user?.role === 'owner') {
          return <OwnerDashboard />;
        }
        return <Dashboard />;
      case 'profile':
        return <Profile />;
      default:
        return <Home />;
    }
  };

  // 临时注释掉登录验证，允许直接访问
  // if (!isAuthenticated) {
  //   return (
  //     <ConfigProvider theme={pinkWhiteTheme} locale={zhCN}>
  //       <Router>
  //         <Routes>
  //           <Route path="/login" element={<Login />} />
  //           <Route path="/register" element={<Register />} />
  //           <Route path="*" element={<Navigate to="/login" replace />} />
  //         </Routes>
  //       </Router>
  //     </ConfigProvider>
  //   );
  // }

  return (
    <ConfigProvider theme={pinkWhiteTheme} locale={zhCN}>
      <Router>
        <Layout className="app-layout">
          <Sider
            trigger={null}
            collapsible
            collapsed={collapsed}
            className="app-sider"
            width={240}
            collapsedWidth={80}
          >
            <div className="app-logo">
              <img src="/logo.svg" alt="Logo" />
              {!collapsed && <span>设计师平台</span>}
            </div>
            <Menu
              theme="light"
              mode="inline"
              selectedKeys={[selectedKey]}
              onClick={({ key }) => setSelectedKey(key)}
              className="app-menu"
            >
              {menuItems.map(item => (
                <Menu.Item key={item.key} icon={item.icon}>
                  <Space>
                    {item.label}
                    {item.badge && <Badge count={item.badge} size="small" />}
                  </Space>
                </Menu.Item>
              ))}
            </Menu>
          </Sider>
          
          <Layout className="app-main">
            <Header className="app-header">
              <div className="header-left">
                <Button
                  type="text"
                  icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                  onClick={() => setCollapsed(!collapsed)}
                  className="collapse-btn"
                />
                <h2 className="page-title">
                  {menuItems.find(item => item.key === selectedKey)?.label}
                </h2>
              </div>
              
              <div className="header-right">
                <Space size="middle">
                  <Badge count={5} size="small">
                    <Button type="text" icon={<BellOutlined />} />
                  </Badge>
                  
                  <Dropdown
                    menu={{ items: userMenuItems }}
                    placement="bottomRight"
                    trigger={['click']}
                  >
                    <Space className="user-info">
                      <Avatar src={user?.avatar} icon={<UserOutlined />} />
                      <span className="username">{user?.name}</span>
                    </Space>
                  </Dropdown>
                </Space>
              </div>
            </Header>
            
            <Content className="app-content">
              {renderContent()}
            </Content>
          </Layout>
        </Layout>
      </Router>
    </ConfigProvider>
  );
}

export default App