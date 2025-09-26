import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Badge } from 'antd'
import {
  HomeOutlined,
  UserOutlined,
  ProjectOutlined,
  MessageOutlined,
  AppstoreOutlined
} from '@ant-design/icons'
import { useAuthStore } from '../../stores/authStore'
import './BottomNavigation.css'

interface NavItem {
  key: string
  path: string
  icon: React.ReactNode
  label: string
  badge?: number
  roles?: string[]
}

const BottomNavigation: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, isAuthenticated } = useAuthStore()

  // 基础导航项
  const baseNavItems: NavItem[] = [
    {
      key: 'home',
      path: '/',
      icon: <HomeOutlined />,
      label: '首页'
    },
    {
      key: 'projects',
      path: '/projects',
      icon: <ProjectOutlined />,
      label: '项目'
    },
    {
      key: 'messages',
      path: '/messages',
      icon: <MessageOutlined />,
      label: '消息',
      badge: 0 // 这里可以从状态管理中获取未读消息数
    },
    {
      key: 'profile',
      path: '/profile',
      icon: <UserOutlined />,
      label: '我的'
    }
  ]

  // 根据用户角色添加专属导航项
  const getRoleSpecificNavItems = (): NavItem[] => {
    if (!isAuthenticated || !user) return baseNavItems

    const roleNavItems = [...baseNavItems]
    
    // 在项目和消息之间插入角色专属导航
    const insertIndex = 2
    
    if (user.role === 'DESIGNER') {
      roleNavItems.splice(insertIndex, 0, {
        key: 'designer',
        path: '/designer',
        icon: <AppstoreOutlined />,
        label: '工作台',
        roles: ['DESIGNER']
      })
    } else if (user.role === 'OWNER') {
      roleNavItems.splice(insertIndex, 0, {
        key: 'owner',
        path: '/owner',
        icon: <AppstoreOutlined />,
        label: '工作台',
        roles: ['OWNER']
      })
    }

    return roleNavItems
  }

  const navItems = getRoleSpecificNavItems()

  const handleNavClick = (path: string) => {
    if (!isAuthenticated && path !== '/') {
      navigate('/login')
      return
    }
    navigate(path)
  }

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/'
    }
    return location.pathname.startsWith(path)
  }

  // 如果在登录或注册页面，不显示底部导航
  if (location.pathname === '/login' || location.pathname === '/register') {
    return null
  }

  return (
    <div className="bottom-navigation">
      <div className="nav-container">
        {navItems.map((item) => (
          <div
            key={item.key}
            className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
            onClick={() => handleNavClick(item.path)}
          >
            <div className="nav-icon">
              {item.badge !== undefined && item.badge > 0 ? (
                <Badge count={item.badge} size="small">
                  {item.icon}
                </Badge>
              ) : (
                item.icon
              )}
            </div>
            <span className="nav-label">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default BottomNavigation