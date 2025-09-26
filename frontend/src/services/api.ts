import axios, { AxiosInstance, AxiosResponse } from 'axios'
import { message } from 'antd'

// 创建 axios 实例
const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    // 从 localStorage 获取 token
    const authStorage = localStorage.getItem('auth-storage')
    if (authStorage) {
      try {
        const { state } = JSON.parse(authStorage)
        if (state?.token) {
          config.headers.Authorization = `Bearer ${state.token}`
        }
      } catch (error) {
        console.error('解析认证信息失败:', error)
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response
  },
  (error) => {
    if (error.response) {
      const { status, data } = error.response
      
      switch (status) {
        case 401:
          // 未授权，清除本地存储并跳转到登录页
          localStorage.removeItem('auth-storage')
          window.location.href = '/login'
          message.error('登录已过期，请重新登录')
          break
        case 403:
          message.error('没有权限访问该资源')
          break
        case 404:
          message.error('请求的资源不存在')
          break
        case 500:
          message.error('服务器内部错误')
          break
        default:
          message.error(data?.message || '请求失败')
      }
    } else if (error.request) {
      message.error('网络连接失败，请检查网络设置')
    } else {
      message.error('请求配置错误')
    }
    
    return Promise.reject(error)
  }
)

// 认证相关 API
export const authApi = {
  // 设置认证 token
  setAuthToken: (token: string) => {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
  },
  
  // 清除认证 token
  clearAuthToken: () => {
    delete api.defaults.headers.common['Authorization']
  },
  
  // 登录
  login: (data: { email: string; password: string; rememberMe?: boolean }) => {
    return api.post('/auth/login', data)
  },
  
  // 注册
  register: (data: {
    inviteCode: string
    email: string
    verificationCode: string
    password: string
    confirmPassword: string
    nickname: string
  }) => {
    return api.post('/auth/register', data)
  },
  
  // 发送验证码
  sendVerificationCode: (email: string, type: 'register' | 'reset_password') => {
    return api.post('/auth/send-verification-code', null, {
      params: { email, type }
    })
  },
  
  // 验证邀请码
  validateInviteCode: (code: string) => {
    return api.post('/auth/validate-invite-code', null, {
      params: { code }
    })
  },
  
  // 验证邮箱验证码
  validateVerificationCode: (email: string, code: string, type: 'register' | 'reset_password') => {
    return api.post('/auth/validate-verification-code', null, {
      params: { email, code, type }
    })
  },
  
  // 健康检查
  health: () => {
    return api.get('/auth/health')
  }
}

// 用户相关 API
export const userApi = {
  // 获取当前用户信息
  getCurrentUser: () => {
    return api.get('/user/profile')
  },
  
  // 更新用户信息
  updateProfile: (data: any) => {
    return api.put('/user/profile', data)
  },
  
  // 上传头像
  uploadAvatar: (file: File) => {
    const formData = new FormData()
    formData.append('avatar', file)
    return api.post('/user/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  }
}

// 项目相关 API
export const projectApi = {
  // 获取项目列表
  getProjects: (params?: any) => {
    return api.get('/projects', { params })
  },
  
  // 获取项目详情
  getProject: (id: number) => {
    return api.get(`/projects/${id}`)
  },
  
  // 创建项目
  createProject: (data: any) => {
    return api.post('/projects', data)
  },
  
  // 更新项目
  updateProject: (id: number, data: any) => {
    return api.put(`/projects/${id}`, data)
  },
  
  // 删除项目
  deleteProject: (id: number) => {
    return api.delete(`/projects/${id}`)
  }
}

// 消息相关 API
export const messageApi = {
  // 获取消息列表
  getMessages: (params?: any) => {
    return api.get('/messages', { params })
  },
  
  // 发送消息
  sendMessage: (data: any) => {
    return api.post('/messages', data)
  },
  
  // 标记消息为已读
  markAsRead: (id: number) => {
    return api.put(`/messages/${id}/read`)
  }
}

// 设计师相关 API
export const designerApi = {
  // 获取设计师资料
  getProfile: () => {
    return api.get('/designer/profile')
  },
  
  // 更新设计师资料
  updateProfile: (data: any) => {
    return api.put('/designer/profile', data)
  },
  
  // 获取作品集
  getPortfolio: () => {
    return api.get('/designer/portfolio')
  },
  
  // 添加作品
  addWork: (data: any) => {
    return api.post('/designer/portfolio', data)
  },
  
  // 获取订单列表
  getOrders: (params?: any) => {
    return api.get('/designer/orders', { params })
  }
}

// 业主相关 API
export const ownerApi = {
  // 获取业主资料
  getProfile: () => {
    return api.get('/owner/profile')
  },
  
  // 更新业主资料
  updateProfile: (data: any) => {
    return api.put('/owner/profile', data)
  },
  
  // 发布需求
  publishRequirement: (data: any) => {
    return api.post('/owner/requirements', data)
  },
  
  // 获取需求列表
  getRequirements: (params?: any) => {
    return api.get('/owner/requirements', { params })
  },
  
  // 获取订单列表
  getOrders: (params?: any) => {
    return api.get('/owner/orders', { params })
  }
}

export default api