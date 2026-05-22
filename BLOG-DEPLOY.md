# 博客部署到 Cloudflare Pages 指南

## 准备工作

1. 一个 Cloudflare 账户
2. 一个 GitHub 仓库（代码已推送到 GitHub）

## 部署步骤

### 第一步：推送代码到 GitHub

确保所有代码已推送到 GitHub 仓库。

### 第二步：连接 Cloudflare Pages

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 导航到 **Workers & Pages**
3. 点击 **Create application**
4. 选择 **Pages** 选项卡
5. 点击 **Connect to Git**

### 第三步：配置构建

1. 选择你的 GitHub 仓库
2. 构建配置：
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
3. 点击 **Save and Deploy**

### 第四步：添加环境变量

在 Pages 设置中添加以下环境变量：

| 变量名 | 值 |
|--------|-----|
| `VITE_SUPABASE_URL` | 你的 Supabase 项目 URL |
| `VITE_SUPABASE_ANON_KEY` | 你的 Supabase ANON KEY |

### 第五步：初始化 Supabase 数据库

1. 打开 https://supabase.com
2. 进入你的项目
3. 点击左侧菜单 **SQL Editor**
4. 复制 `supabase-schema.sql` 的全部内容
5. 粘贴并点击 **Run**

### 第六步：验证部署

部署完成后，访问 Cloudflare 分配的域名（如 `your-project.pages.dev`）查看博客。

## 更新博客文章

### 方式一：Supabase 控制台

1. 进入 Supabase 项目
2. 点击 **Table Editor** → **posts**
3. 点击 **Insert row** 添加新文章

### 方式二：SQL

```sql
INSERT INTO posts (title, summary, content, category, tags) VALUES (
  '文章标题',
  '文章摘要',
  '## 正文（Markdown格式）',
  'tech',
  ARRAY['标签1', '标签2']
);
```

## 常见问题

### Q: 部署后博客页面空白？

检查浏览器控制台是否有错误，可能是环境变量未正确设置。

### Q: 评论功能不工作？

确认 Supabase 的 **Realtime** 功能已启用（Database → Replication）。

### Q: 如何自定义域名？

在 Cloudflare Pages 设置中的 **Custom domains** 页面添加你的域名。

## 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```