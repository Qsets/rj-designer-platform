import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { authApi } from '../services/api'

export interface User {
  id: number
  email: string
  nickname: string
  avatar?: string
  role: 'DESIGNER' | 'OWNER' | 'ADMIN'
  status: 'ACTIVE' | 'INACTIVE' | 'BANNED'
  emailVerified: boolean
}

export interface AuthResponse {
  token: string
  tokenType: string
  expiresIn: number
  user: User
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  
  // Actions
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => void
  setUser: (user: User) => void
  setToken: (token: string) => void
  clearAuth: () => void
  checkAuth: () => Promise<void>
}

export interface RegisterData {
  email: string
  password: string
  confirmPassword: string
  nickname: string
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email: string, password: string, rememberMe = false) => {
        set({ isLoading: true })
        try {
          const response = await authApi.login({ email, password, rememberMe })
          const { token, user } = response.data
          
          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false
          })
          
          // 设置 API 默认 token
          authApi.setAuthToken(token)
        } catch (error: any) {
          set({ isLoading: false })
          throw new Error(error.response?.data?.message || '登录失败')
        }
      },

      register: async (data: RegisterData) => {
        set({ isLoading: true })
        try {
          const response = await authApi.register(data)
          const { token, user } = response.data
          
          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false
          })
          
          // 设置 API 默认 token
          authApi.setAuthToken(token)
        } catch (error: any) {
          set({ isLoading: false })
          throw new Error(error.response?.data?.message || '注册失败')
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false
        })
        
        // 清除 API token
        authApi.clearAuthToken()
        
        // 清除本地存储
        localStorage.removeItem('auth-storage')
      },

      setUser: (user: User) => {
        set({ user })
      },

      setToken: (token: string) => {
        set({ token })
        authApi.setAuthToken(token)
      },

      clearAuth: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false
        })
        authApi.clearAuthToken()
      },

      checkAuth: async () => {
        const { token } = get()
        if (!token) {
          return
        }

        try {
          // 这里可以添加验证 token 有效性的 API 调用
          authApi.setAuthToken(token)
          set({ isAuthenticated: true })
        } catch (error) {
          // Token 无效，清除认证状态
          get().clearAuth()
        }
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
)