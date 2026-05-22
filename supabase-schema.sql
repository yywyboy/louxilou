-- =====================================================
-- Louxilou Blog - Supabase Database Schema
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- Posts Table
-- =====================================================
CREATE TABLE IF NOT EXISTS posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  summary TEXT,
  content TEXT NOT NULL DEFAULT '',
  cover TEXT,
  tags TEXT[] DEFAULT '{}',
  category TEXT DEFAULT 'thoughts' CHECK (category IN ('tech', 'life', 'reading', 'thoughts')),
  author_name TEXT DEFAULT 'LouxiLou',
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for category filtering
CREATE INDEX IF NOT EXISTS idx_posts_category ON posts(category);
-- Index for ordering by creation time
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);

-- =====================================================
-- Comments Table
-- =====================================================
CREATE TABLE IF NOT EXISTS comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL DEFAULT '匿名用户',
  user_avatar TEXT,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fetching comments by post
CREATE INDEX IF NOT EXISTS idx_comments_post_id ON comments(post_id);
CREATE INDEX IF NOT EXISTS idx_comments_created_at ON comments(created_at);

-- =====================================================
-- Likes Table
-- =====================================================
CREATE TABLE IF NOT EXISTS likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);

-- Index for checking if user liked a post
CREATE INDEX IF NOT EXISTS idx_likes_post_id ON likes(post_id);
CREATE INDEX IF NOT EXISTS idx_likes_user_id ON likes(user_id);

-- =====================================================
-- Row Level Security (RLS)
-- =====================================================

-- Enable RLS
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;

-- Posts: Everyone can read, only authenticated users can insert/update/delete
CREATE POLICY "Posts are publicly readable" ON posts
  FOR SELECT USING (true);

CREATE POLICY "Anyone can insert posts" ON posts
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update posts" ON posts
  FOR UPDATE USING (true);

CREATE POLICY "Anyone can delete posts" ON posts
  FOR DELETE USING (true);

-- Comments: Everyone can read, anyone can insert
CREATE POLICY "Comments are publicly readable" ON comments
  FOR SELECT USING (true);

CREATE POLICY "Anyone can insert comments" ON comments
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can delete own comments" ON comments
  FOR DELETE USING (true);

-- Likes: Everyone can read, anyone can toggle
CREATE POLICY "Likes are publicly readable" ON likes
  FOR SELECT USING (true);

CREATE POLICY "Anyone can insert likes" ON likes
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can delete likes" ON likes
  FOR DELETE USING (true);

-- =====================================================
-- Realtime
-- =====================================================
-- Enable realtime for comments table
ALTER PUBLICATION supabase_realtime ADD TABLE comments;

-- =====================================================
-- Functions
-- =====================================================

-- Function to increment view count
CREATE OR REPLACE FUNCTION increment_view_count(post_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE posts
  SET view_count = COALESCE(view_count, 0) + 1
  WHERE id = post_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
DROP TRIGGER IF EXISTS update_posts_updated_at ON posts;
CREATE TRIGGER update_posts_updated_at
  BEFORE UPDATE ON posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- Sample Data
-- =====================================================

-- Insert a sample post
INSERT INTO posts (title, summary, content, category, tags, cover) VALUES (
  '欢迎来到我的博客',
  '这是博客的第一篇文章，来看看这个博客系统有哪些功能吧！',
  '# 欢迎来到我的博客 🎉

这是使用 Supabase 作为后端的全新博客系统！

## 功能特点

### 📝 文章管理
- 支持 Markdown 编写
- 多种分类：技术、生活、读书、随想
- 标签系统

### 💬 评论互动
- 实时评论更新
- 无需刷新页面

### ❤️ 点赞功能
- 基于 localStorage 的用户识别
- 防重复点赞

### 👁️ 浏览量统计
- 自动累计阅读数

## 示例代码

这是一个代码块的示例：

```javascript
const hello = "Hello World!";
console.log(hello);
```

## 开始使用

点击上方的「写文章」按钮，开始创作吧！

有什么问题可以随时联系我~',
  'thoughts',
  ARRAY['欢迎', '新博客', 'Supabase'],
  'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800'
);

-- Insert more sample posts
INSERT INTO posts (title, summary, content, category, tags) VALUES
  (
    'Vue 3 组合式 API 实战技巧',
    '分享一些在使用 Vue 3 组合式 API 过程中积累的实用技巧和最佳实践。',
    '# Vue 3 组合式 API 实战技巧

组合式 API（Composition API）是 Vue 3 最重要的特性之一，本文分享一些实战中积累的技巧。

## 1. 善用 ref 和 reactive

- `ref` 用于基本类型和对象
- `reactive` 用于复杂对象

```javascript
// ref
const count = ref(0)
console.log(count.value) // 0

// reactive
const state = reactive({
  name: ''Vue'',
  version: ''3.0''
})
```

## 2. 逻辑复用

组合式 API 的最大优势之一就是逻辑复用：

```javascript
// useCounter.js
export function useCounter() {
  const count = ref(0)
  const increment = () => count.value++
  return { count, increment }
}
```

## 3. 异步操作

配合 `suspense` 和 `async setup` 使用效果更好。',
    'tech',
    ARRAY['Vue', 'JavaScript', '前端']
  ),
  (
    '我的阅读清单分享',
    '分享最近在读的一些书籍，以及一些读书心得。',
    '# 我的阅读清单分享

最近读了几本很有意思的书，推荐给大家。

## 《挪威的森林》

村上春树的经典之作，关于青春、爱情和迷失。

> "死并非生的对立面，而作为生的一部分永存。"

## 《小王子》

每次重读都有新的感悟，关于爱与责任。

## 阅读习惯

我习惯在睡前阅读半小时，既放松又能充实自己。

你们有什么推荐的书吗？欢迎在评论区分享！',
    'reading',
    ARRAY['读书', '推荐', '分享']
  );
