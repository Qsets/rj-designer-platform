import React from 'react'
import { Layout, Avatar, Dropdown, Space, Typography, Button, Badge } from 'antd'
import { 
  UserOutlined, 
  LogoutOutlined, 
  SettingOutlined,
  BellOutlined,
  MenuOutlined
} from '@ant-design/icons'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../../stores/authStore'
import './Header.css'

const { Header: AntHeader } = Layout
const { Text } = Typography

interface HeaderProps {
  onMenuToggle?: () => void
  showMenuButton?: boolean
}

const Header: React.FC<HeaderProps> = ({ onMenuToggle, showMenuButton = false }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout, isAuthenticated } = useAuthStore()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人资料',
      onClick: () => navigate('/profile')
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: '设置',
      onClick: () => navigate('/settings')
    },
    {
      type: 'divider' as const
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      onClick: handleLogout
    }
  ]

  const getPageTitle = () => {
    const path = location.pathname
    switch (path) {
      case '/':
        return '首页'
      case '/profile':
        return '个人资料'
      case '/projects':
        return '项目管理'
      case '/messages':
        return '消息中心'
      case '/designer':
        return '设计师工作台'
      case '/owner':
        return '业主工作台'
      case '/login':
        return '登录'
      case '/register':
        return '注册'
      default:
        return '钧鉴设计交易平台'
    }
  }

  const getRoleText = (role: string) => {
    switch (role) {
      case 'DESIGNER':
        return '设计师'
      case 'OWNER':
        return '业主'
      case 'ADMIN':
        return '管理员'
      default:
        return ''
    }
  }

  return (
    <AntHeader className="app-header">
      <div className="header-left">
        {showMenuButton && (
          <Button
            type="text"
            icon={<MenuOutlined />}
            onClick={onMenuToggle}
            className="menu-button"
          />
        )}
        <div className="logo-section">
          <div className="logo" onClick={() => navigate('/')}>
            钧鉴
          </div>
          <Text className="page-title">{getPageTitle()}</Text>
        </div>
      </div>

      <div className="header-right">
        {isAuthenticated && user ? (
          <Space size="middle">
            {/* 消息通知 */}
            <Badge count={0} size="small">
              <Button
                type="text"
                icon={<BellOutlined />}
                onClick={() => navigate('/messages')}
                className="notification-button"
              />
            </Badge>

            {/* 用户菜单 */}
            <Dropdown
              menu={{ items: userMenuItems }}
              placement="bottomRight"
              trigger={['click']}
            >
              <div className="user-info">
                <Avatar
                  src={user.avatar}
                  icon={<UserOutlined />}
                  size="small"
                />
                <div className="user-details">
                  <Text className="user-name">{user.nickname}</Text>
                  <Text className="user-role">{getRoleText(user.role)}</Text>
                </div>
              </div>
            </Dropdown>
          </Space>
        ) : (
          <Space>
            <Button type="text" onClick={() => navigate('/login')}>
              登录
            </Button>
            <Button type="primary" onClick={() => navigate('/register')}>
              注册
            </Button>
          </Space>
        )}
      </div>
    </AntHeader>
  )
}

export default Header