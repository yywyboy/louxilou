# Vue Framework - 快速启动指南

## 环境要求

- Node.js 18+ 
- npm 或 pnpm

## 安装步骤

1. **安装依赖**

```bash
npm install
```

或使用 pnpm：

```bash
pnpm install
```

2. **启动开发服务器**

```bash
npm run dev
```

或使用 pnpm：

```bash
pnpm dev
```

3. **在浏览器中打开**

开发服务器启动后，访问 http://localhost:5173

## 项目结构

```
vue-framework/
├── src/
│   ├── components/      # 通用组件
│   │   ├── NavBar.vue   # 导航栏
│   │   ├── Footer.vue   # 页脚
│   │   ├── Button.vue   # 按钮
│   │   └── Card.vue     # 卡片
│   ├── views/           # 页面组件
│   │   ├── Home.vue     # 首页
│   │   ├── About.vue    # 关于页
│   │   ├── Articles.vue # 文章列表
│   │   └── Contact.vue  # 联系页
│   ├── router/          # 路由配置
│   │   └── index.ts
│   ├── assets/          # 静态资源
│   │   └── styles/
│   │       └── main.css # 全局样式
│   ├── App.vue          # 根组件
│   └── main.ts          # 入口文件
├── index.html           # HTML 入口
├── package.json         # 项目配置
├── vite.config.ts       # Vite 配置
└── tsconfig.json        # TypeScript 配置
```

## 可用脚本

- `npm run dev` - 启动开发服务器
- `npm run build` - 构建生产版本
- `npm run preview` - 预览生产构建

## 功能特点

- ✅ Vue 3 Composition API
- ✅ TypeScript 类型支持
- ✅ Vue Router 4 路由管理
- ✅ 响应式设计
- ✅ 现代化 UI 组件
- ✅ 动画效果
- ✅ 表单验证

## 页面路由

- `/` - 首页
- `/about` - 关于页面
- `/articles` - 文章列表
- `/contact` - 联系页面

## 技术栈

- Vue 3.4+
- Vue Router 4
- TypeScript 5
- Vite 5
- 原生 CSS (CSS Variables)
