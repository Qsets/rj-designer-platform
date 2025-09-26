# RJ 设计师平台

一个现代化的设计师与业主对接平台，提供项目管理、消息沟通、支付系统等功能。

## 功能特性

- 🎨 **项目管理** - 完整的设计项目生命周期管理
- 💬 **实时消息** - 设计师与业主之间的即时沟通
- 💳 **支付系统** - 安全可靠的在线支付解决方案
- 👤 **用户管理** - 多角色用户系统（设计师/业主）
- 📊 **数据看板** - 直观的数据统计和分析
- 🎯 **任务跟踪** - 项目进度和任务状态管理

## 技术栈

### 前端
- React 18 + TypeScript
- Ant Design 5.x
- React Router v6
- Zustand (状态管理)
- Axios (HTTP 客户端)

### 后端
- Node.js + Express
- TypeScript
- MongoDB + Mongoose
- JWT 认证
- Socket.io (实时通信)

## 项目结构

```
rj-designer-platform/
├── frontend/                 # 前端应用
│   ├── src/
│   │   ├── components/      # 通用组件
│   │   ├── pages/          # 页面组件
│   │   ├── stores/         # 状态管理
│   │   ├── services/       # API 服务
│   │   └── utils/          # 工具函数
│   └── public/             # 静态资源
├── backend/                 # 后端应用
│   ├── src/
│   │   ├── controllers/    # 控制器
│   │   ├── models/         # 数据模型
│   │   ├── routes/         # 路由
│   │   ├── middleware/     # 中间件
│   │   └── utils/          # 工具函数
│   └── uploads/            # 文件上传目录
└── docs/                   # 项目文档
```

## 开发环境搭建

### 前端
```bash
cd frontend
npm install
npm run dev
```

### 后端
```bash
cd backend
npm install
npm run dev
```

## 部署

项目支持 Docker 容器化部署，详见 `docker-compose.yml` 配置文件。

## 贡献指南

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。