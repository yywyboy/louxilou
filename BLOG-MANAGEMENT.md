# 博客管理指南

## 一、文章管理

本博客使用 Supabase 作为后端数据库，文章数据存储在 `posts` 表中。

### 1. 发布文章

#### 方法一：通过 Supabase 仪表板（推荐）

1. 打开 https://supabase.com/dashboard
2. 选择你的项目
3. 左侧菜单点击 **Table Editor** → **posts**
4. 点击右上角 **Insert row** 按钮
5. 填写以下字段：

| 字段 | 说明 | 是否必填 | 示例 |
|------|------|----------|------|
| `title` | 文章标题 | 必填 | `我的第一篇文章` |
| `summary` | 文章摘要 | 可选 | `这是一篇示例文章` |
| `content` | 文章内容（支持 Markdown） | 必填 | `# 标题\n\n正文内容` |
| `cover` | 封面图片 URL | 可选 | `https://example.com/image.jpg` |
| `tags` | 标签数组 | 可选 | `{"技术", "Vue"}` |
| `category` | 分类 | 可选 | `tech` / `life` / `reading` / `thoughts` |
| `author_name` | 作者名 | 可选 | 默认为 `LouxiLou` |

6. 点击 **Save** 保存

#### 方法二：通过 SQL 命令

在 Supabase 仪表板的 **SQL Editor** 中执行：

```sql
INSERT INTO posts (title, summary, content, category, tags, cover) VALUES (
  '文章标题',
  '文章摘要',
  '# 文章标题

这里是文章内容，支持 Markdown 格式。

## 二级标题

正文内容...',
  'tech',
  ARRAY['标签1', '标签2'],
  'https://example.com/cover.jpg'
);
```

### 2. 删除文章

#### 方法一：通过 Supabase 仪表板

1. 进入 **Table Editor** → **posts**
2. 找到要删除的文章
3. 点击行左侧的复选框选中
4. 点击 **Delete** 按钮

#### 方法二：通过 SQL 命令

```sql
-- 按标题删除
DELETE FROM posts WHERE title = '文章标题';

-- 按 ID 删除
DELETE FROM posts WHERE id = '文章UUID';
```

### 3. 编辑文章

1. 进入 **Table Editor** → **posts**
2. 点击要编辑的行
3. 修改内容后点击 **Save**

或使用 SQL：

```sql
UPDATE posts 
SET title = '新标题', 
    content = '新内容',
    updated_at = NOW()
WHERE id = '文章UUID';
```

### 4. 文章分类说明

| 分类值 | 显示名称 |
|--------|----------|
| `tech` | 技术 |
| `life` | 生活 |
| `reading` | 读书 |
| `thoughts` | 随想 |

---

## 二、网站公告管理

网站公告在首页左侧边栏显示，数据存储在 Supabase 的 `announcements` 表中。

### 1. 添加公告

#### 方法一：通过 Supabase 仪表板（推荐）

1. 进入 **Table Editor** → **announcements**
2. 点击 **Insert row** 按钮
3. 填写字段：

| 字段 | 说明 | 是否必填 | 示例 |
|------|------|----------|------|
| `content` | 公告内容 | 必填 | `网站已更新到 v2.0 版本！` |
| `is_active` | 是否显示 | 可选 | `true`（默认） |

4. 点击 **Save** 保存

#### 方法二：通过 SQL 命令

```sql
INSERT INTO announcements (content, is_active) VALUES (
  '欢迎访问我的博客！最新公告内容...',
  true
);
```

### 2. 修改公告

1. 进入 **Table Editor** → **announcements**
2. 点击要修改的公告行
3. 修改 `content` 字段
4. 点击 **Save**

### 3. 删除公告

1. 进入 **Table Editor** → **announcements**
2. 选中要删除的行
3. 点击 **Delete** 按钮

### 4. 隐藏公告（不删除）

将 `is_active` 字段设置为 `false` 即可隐藏公告，而不删除它：

```sql
UPDATE announcements 
SET is_active = false 
WHERE id = '公告UUID';
```

### 5. 公告显示规则

- 首页只显示最新的 **一条** 活跃公告（`is_active = true`）
- 如果没有活跃公告，显示默认文案
- 按创建时间倒序排列

---

## 三、评论管理

### 查看评论

1. 进入 Supabase 仪表板 → **Table Editor** → **comments**
2. 可以看到所有评论，包括 `post_id`、`user_name`、`content` 等

### 删除评论

```sql
-- 删除某篇文章的所有评论
DELETE FROM comments WHERE post_id = '文章UUID';

-- 删除特定评论
DELETE FROM comments WHERE id = '评论UUID';
```

---

## 四、常用 SQL 查询

```sql
-- 查看所有已发布文章（按时间倒序）
SELECT id, title, category, view_count, created_at 
FROM posts 
ORDER BY created_at DESC;

-- 查看某篇文章的评论数
SELECT p.title, COUNT(c.id) as comment_count
FROM posts p
LEFT JOIN comments c ON c.post_id = p.id
GROUP BY p.id, p.title;

-- 查看点赞数最多的文章
SELECT p.title, COUNT(l.id) as like_count
FROM posts p
LEFT JOIN likes l ON l.post_id = p.id
GROUP BY p.id, p.title
ORDER BY like_count DESC;

-- 查看浏览量最高的文章
SELECT title, view_count 
FROM posts 
ORDER BY view_count DESC 
LIMIT 10;
```

---

## 五、部署更新

修改代码后，推送到 GitHub 的 `main` 分支会自动触发 Cloudflare Pages 部署：

```bash
git add .
git commit -m "更新说明"
git push origin main
```

部署完成后约 1-2 分钟即可在网站上看到更新。
