import React from 'react'
import ReactDOM from 'react-dom/client'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import App from './App'
import './index.css'

// 配置 Ant Design 主题 - 蓝粉色渐变风格
const theme = {
  token: {
    colorPrimary: '#6366f1', // 蓝紫色主色调
    colorPrimaryHover: '#8b5cf6', // 悬停时的紫色
    colorPrimaryActive: '#5b21b6', // 激活时的深紫色
    colorSuccess: '#ec4899', // 粉色成功色
    colorWarning: '#f59e0b', // 橙色警告色
    colorError: '#ef4444', // 红色错误色
    colorInfo: '#06b6d4', // 青色信息色
    borderRadius: 12,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    colorBgContainer: '#ffffff',
    colorBgLayout: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  },
  components: {
    Layout: {
      bodyBg: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      headerBg: 'rgba(255, 255, 255, 0.95)',
      siderBg: 'rgba(255, 255, 255, 0.95)',
    },
    Menu: {
      itemBg: 'transparent',
      itemSelectedBg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      itemHoverBg: 'rgba(102, 126, 234, 0.1)',
      itemSelectedColor: '#ffffff',
    },
    Button: {
      borderRadius: 12,
      primaryShadow: '0 4px 15px 0 rgba(102, 126, 234, 0.3)',
    },
    Card: {
      borderRadius: 16,
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
    },
    Input: {
      borderRadius: 10,
    },
    Select: {
      borderRadius: 10,
    },
  },
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ConfigProvider locale={zhCN} theme={theme}>
      <App />
    </ConfigProvider>
  </React.StrictMode>,
)