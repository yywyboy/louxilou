# 楼西楼博客 - 完整使用指南

## 目录

1. [网站架构](#一网站架构)
2. [页面功能](#二页面功能)
3. [内容管理](#三内容管理)
4. [图片管理](#四图片管理)
5. [自定义配置](#五自定义配置)
6. [部署与更新](#六部署与更新)

---

## 一、网站架构

### 技术栈

| 类型 | 技术 |
|------|------|
| 前端框架 | Vue 3 + TypeScript |
| 构建工具 | Vite 6 |
| 后端服务 | Supabase |
| 样式方案 | Scoped CSS（Neo-brutalist 风格） |
| 部署平台 | Cloudflare Pages |

### 项目结构

```
l:\
├── public/                # 静态资源
│   ├── photos/           # 图片库照片
│   ├── books/            # 书籍 TXT 文件
│   └── logo.png          # 网站 Logo
├── src/
│   ├── assets/styles/    # 全局样式
│   ├── components/       # 组件
│   ├── composables/      # 组合式函数
│   ├── data/             # 静态数据（书籍信息）
│   ├── lib/              # 工具库（Supabase、博客函数）
│   ├── router/           # 路由配置
│   └── views/            # 页面组件
├── supabase-schema.sql   # 数据库表结构
├── BLOG-MANAGEMENT.md    # 本文档
└── .env                  # 环境变量
```

### 数据库表

| 表名 | 用途 |
|------|------|
| `posts` | 文章/博客 |
| `comments` | 评论 |
| `likes` | 点赞 |
| `announcements` | 网站公告 |

---

## 二、页面功能

### 1. 首页 (`/`)

**左侧边栏**：
- 网站公告（从 Supabase 获取）
- 网易云音乐播放器

**中间主内容**：
- 搜索框
- 文章列表（卡片式布局）

**右侧边栏**：
- 快速链接（GitHub、Bilibili、邮件联系）
- 友情链接

### 2. 藏书阁 (`/library`)

- 书籍网格展示
- 搜索功能（按书名/作者）
- 点击进入书籍详情

### 3. 书籍详情 (`/library/:id`)

- 书籍封面、简介
- 章节列表
- 在线阅读/下载按钮

### 4. 在线阅读器 (`/library/:bookId/read/:chapterId`)

- 固定顶部导航栏（不被遮挡）
- 固定底部翻页栏
- 字体大小调节（A-/A+）
- 章节快速导航

### 5. 图片库 (`/gallery`)

- 三列瀑布流布局
- 点击放大预览
- 响应式设计

### 6. 文章详情 (`/blog/:id`)

- 文章内容（支持 Markdown）
- 点赞功能
- 评论区

---

## 三、内容管理

### 1. 文章管理

#### 发布文章

1. 打开 https://supabase.com/dashboard
2. 选择项目 → **Table Editor** → **posts**
3. 点击 **Insert row**
4. 填写字段：

| 字段 | 说明 | 必填 |
|------|------|------|
| `title` | 文章标题 | 是 |
| `summary` | 摘要 | 否 |
| `content` | 内容（Markdown） | 是 |
| `cover` | 封面图 URL | 否 |
| `tags` | 标签数组，如 `{"技术","Vue"}` | 否 |
| `category` | 分类：`tech`/`life`/`reading`/`thoughts` | 否 |

5. 点击 **Save**

#### 删除文章

1. 进入 **Table Editor** → **posts**
2. 选中要删除的行
3. 点击 **Delete**

#### 编辑文章

1. 进入 **Table Editor** → **posts**
2. 点击要编辑的行
3. 修改后点击 **Save**

### 2. 公告管理

#### 添加/修改公告

1. 进入 **Table Editor** → **announcements**
2. 添加新行或编辑现有行
3. 填写 `content`（公告内容）
4. 设置 `is_active` 为 `true` 显示，`false` 隐藏

#### 显示规则

- 首页只显示最新的一条活跃公告
- 如果没有活跃公告，显示默认文案

### 3. 评论管理

#### 查看评论

进入 **Table Editor** → **comments**

#### 删除评论

```sql
-- 删除某篇文章的所有评论
DELETE FROM comments WHERE post_id = '文章UUID';

-- 删除特定评论
DELETE FROM comments WHERE id = '评论UUID';
```

---

## 四、图片管理

### 添加图片到图片库

1. 将图片文件放入 `public/photos/` 目录
2. 图片命名格式：`photo (1).jpg`、`photo (2).jpg`...
3. 修改 `src/views/Gallery.vue` 中的照片数量：

```typescript
const photos = Array.from({ length: 36 }, (_, i) => ({  // 修改 36 为实际数量
  id: i + 1,
  src: `/photos/photo (${i + 1}).jpg`,
  alt: `Photo ${i + 1}`
}))
```

4. 重新构建并部署

### 图片优化建议

- 单张图片建议 < 200KB
- 使用 https://tinypng.com 压缩
- 转换为 WebP 格式可减小 25-35% 体积

---

## 五、自定义配置

### 1. 修改网易云音乐播放器

编辑 `src/views/Home.vue`，找到：

```html
<iframe
  src="//music.163.com/outchain/player?type=1&id=17982886763&auto=0&height=430"
  ...
></iframe>
```

**参数说明**：
- `type=1`：歌单模式
- `id=17982886763`：歌单 ID
- `auto=0`：不自动播放（改为 `1` 则自动播放）

**获取歌单 ID**：
1. 打开网易云音乐网页版
2. 打开想要的歌单
3. URL 中的数字就是歌单 ID

### 2. 修改快速链接

编辑 `src/views/Home.vue`，找到快速链接部分：

```html
<a href="https://github.com/yywyboy" target="_blank" class="quick-link">
  <span class="link-text">GitHub</span>
</a>
```

### 3. 修改友情链接

编辑 `src/views/Home.vue`，找到友情链接部分：

```html
<a href="https://louxilou.com.cn" target="_blank" class="friend-link">
  <span class="link-text">楼西楼</span>
</a>
```

### 4. 修改书籍数据

编辑 `src/data/books.ts`，添加或修改书籍信息：

```typescript
{
  id: 'book-id',
  title: '书名',
  author: '作者',
  cover: '/books/cover.jpg',
  description: '简介',
  chapters: [
    { id: 'chapter-1', title: '第一章', cover: '', status: '已完结', txtUrl: '/books/chapter1.txt' }
  ]
}
```

### 5. 修改网站 Logo

替换 `public/logo.png` 文件

### 6. 修改主题色

编辑 `src/assets/styles/main.css`：

```css
:root {
  --color-bg: #BDC0BA;      /* 页面背景色 */
  --color-accent: #9F353A;  /* 强调色 */
  --color-text: #333;       /* 文字颜色 */
  --color-text-secondary: #666; /* 次要文字颜色 */
}
```

---

## 六、部署与更新

### 推送到 GitHub

```bash
git add .
git commit -m "更新说明"
git push origin main
```

### Cloudflare Pages 自动部署

如果已配置 Cloudflare Pages，推送到 GitHub 后会自动部署。

### 手动部署

1. 构建项目：`npm run build`
2. 上传 `dist/` 目录到 Cloudflare Pages

---

## 七、常用 SQL 查询

```sql
-- 查看所有文章
SELECT id, title, category, view_count, created_at 
FROM posts ORDER BY created_at DESC;

-- 查看评论数
SELECT p.title, COUNT(c.id) as comment_count
FROM posts p LEFT JOIN comments c ON c.post_id = p.id
GROUP BY p.id, p.title;

-- 查看点赞数
SELECT p.title, COUNT(l.id) as like_count
FROM posts p LEFT JOIN likes l ON l.post_id = p.id
GROUP BY p.id, p.title ORDER BY like_count DESC;

-- 查看浏览量最高的文章
SELECT title, view_count FROM posts ORDER BY view_count DESC LIMIT 10;
```

---

## 八、常见问题

### Q: 图片加载慢怎么办？

A: 
1. 压缩图片（推荐 https://tinypng.com）
2. 转换为 WebP 格式
3. 使用 CDN 加速

### Q: 如何修改网易云音乐歌单？

A: 修改 `src/views/Home.vue` 中的 `id=17982886763` 为你的歌单 ID

### Q: 如何添加新的友情链接？

A: 在 `src/views Home.vue` 的友情链接区域添加新的 `<a>` 标签

### Q: 公告不显示怎么办？

A: 检查 Supabase 中 `announcements` 表是否有 `is_active=true` 的记录
