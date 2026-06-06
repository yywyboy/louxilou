import { supabase } from './supabase'
import type { Post, Comment } from './types'

export { type Post, type Comment } from './types'

/* Static fallback posts — shown when Supabase is unavailable */
const STATIC_POSTS: Post[] = [
  {
    id: 'static-1',
    title: '读《百年孤独》：时间是一个圆',
    summary: '马尔克斯笔下的马孔多小镇，七代人的命运轮回，揭示了拉丁美洲百年孤独的深层密码。',
    content: `## 时间是一个圆

> 多年以后，面对行刑队，奥雷里亚诺·布恩迪亚上校将会回想起父亲带他去见识冰块的那个遥远的下午。

这是文学史上最著名的开篇之一。马尔克斯用一句话，就将过去、现在和未来编织在一起，形成了一个完整的时间闭环。

### 孤独的宿命

布恩迪亚家族的每一个人，都在以自己的方式对抗孤独，却又在对抗中加深了孤独。奥雷里亚诺上校发动了三十二场战争，最终却在反复制作小金鱼中度过余生。阿玛兰妲拒绝了所有求婚者，在缝制殓衣中等待死亡。

这种孤独不是个人的，而是整个民族的。马孔多的兴衰，就是拉丁美洲的缩影。

### 魔幻与现实

马尔克斯最伟大的技巧，是让魔幻成为现实的一部分。升天的美人、预言的羊皮卷、持续四年十一个月零两天的雨——这些都不需要解释，因为在这个世界里，它们就是真实的。

**阅读建议**：不要试图理清所有人物关系，让文字的洪流将你带走。`,
    cover: null,
    tags: ['读书', '拉美文学', '马尔克斯'],
    category: 'reading',
    author_name: 'LOUXILOU',
    view_count: 42,
    created_at: '2024-12-15T08:00:00Z',
    updated_at: '2024-12-15T08:00:00Z',
  },
  {
    id: 'static-2',
    title: '前端动画的艺术：从 CSS 到 GSAP',
    summary: '探讨前端动画的不同层次，从简单的 CSS transition 到 GSAP 驱动的复杂时间线动画。',
    content: `## 前端动画的艺术

好的动画不是炫技，而是为用户创造**有意义的反馈**。

### CSS 动画的局限

CSS transition 和 animation 适合简单的状态变化：

\`\`\`css
.button {
  transition: transform 0.3s ease;
}
.button:hover {
  transform: translateY(-2px);
}
\`\`\`

但当你需要以下能力时，CSS 就不够了：
- 精确的时间线控制
- 滚动驱动的动画
- 多元素编排
- 物理模拟

### GSAP 的力量

GSAP (GreenSock Animation Platform) 是目前最强大的前端动画库：

\`\`\`javascript
gsap.timeline()
  .from('.title', { y: 50, opacity: 0, duration: 0.8 })
  .from('.subtitle', { y: 30, opacity: 0 }, '-=0.4')
  .from('.cta', { scale: 0.8, opacity: 0 }, '-=0.2')
\`\`\`

### 设计原则

1. **目的性** — 每个动画都要有存在的理由
2. **克制** — 少即是多
3. **性能** — 只动画 transform 和 opacity
4. **可访问性** — 尊重 \`prefers-reduced-motion\``,
    cover: null,
    tags: ['前端', '动画', 'GSAP'],
    category: 'tech',
    author_name: 'LOUXILOU',
    view_count: 28,
    created_at: '2024-11-20T10:00:00Z',
    updated_at: '2024-11-20T10:00:00Z',
  },
  {
    id: 'static-3',
    title: '雨天的书店',
    summary: '一个关于城市中独立书店的随想，在数字时代，实体书的温度依然不可替代。',
    content: `## 雨天的书店

下雨天最适合逛书店。

不是那种连锁的、灯光明亮的、按照畅销榜排列的书店。而是那种藏在巷子里、门口放着一块手写黑板、推门进去有咖啡香和旧纸张味道的独立书店。

### 纸张的温度

电子书很方便，但翻页时纸张的触感、书脊折痕处的微妙阻力、以及偶尔从前一位读者那里遗落的便签——这些是屏幕无法复制的。

### 选书的艺术

好的独立书店店主，本身就是一位策展人。他们不会把最畅销的书放在最显眼的位置，而是会把你从未听说过的、但恰好适合你的那本书，放在你目光自然落下的地方。

> 一家好的书店，不是让你买到你想买的书，而是让你发现你不知道自己需要的书。

雨还在下。不急，再看一本。`,
    cover: null,
    tags: ['生活', '书店', '随想'],
    category: 'life',
    author_name: 'LOUXILOU',
    view_count: 35,
    created_at: '2024-10-08T14:00:00Z',
    updated_at: '2024-10-08T14:00:00Z',
  },
  {
    id: 'static-4',
    title: 'Vue 3 组合式 API 的设计哲学',
    summary: '从 Options API 到 Composition API，不只是语法变化，更是思维方式的升级。',
    content: `## 为什么需要组合式 API

Vue 2 的 Options API（data、methods、computed、watch）在小型组件中非常直观。但当组件变大，相关逻辑被分散到不同选项中，阅读和维护成本急剧上升。

### 逻辑关注点的聚合

组合式 API 的核心价值：**将同一功能的逻辑放在一起**。

\`\`\`typescript
// 一个完整的鼠标追踪功能
function useMouse() {
  const x = ref(0)
  const y = ref(0)

  function update(e: MouseEvent) {
    x.value = e.clientX
    y.value = e.clientY
  }

  onMounted(() => window.addEventListener('mousemove', update))
  onUnmounted(() => window.removeEventListener('mousemove', update))

  return { x, y }
}
\`\`\`

### 可复用性

Options API 中复用逻辑靠 mixin，但 mixin 有命名冲突和来源不清晰的问题。组合式函数（composable）完美解决了这些：

- 返回值类型明确
- 可以嵌套组合
- 没有命名冲突

### 实际项目建议

1. **小组件**：Options API 依然好用，不必强行迁移
2. **复杂逻辑**：用 composables 抽离
3. **TypeScript**：组合式 API 的类型推导更优秀`,
    cover: null,
    tags: ['前端', 'Vue', '架构'],
    category: 'tech',
    author_name: 'LOUXILOU',
    view_count: 56,
    created_at: '2024-09-15T09:00:00Z',
    updated_at: '2024-09-15T09:00:00Z',
  },
  {
    id: 'static-5',
    title: '陀思妥耶夫斯基：灵魂的拷问者',
    summary: '从《罪与罚》到《卡拉马佐夫兄弟》，陀氏文学中关于罪恶、信仰与救赎的永恒追问。',
    content: `## 地下室人的独白

> 我是一个有病的人……我是一个凶狠的人。我是一个不讨人喜欢的人。

陀思妥耶夫斯基的《地下室手记》开篇，就宣告了一种全新的文学声音。这不是叙述者在讲故事，而是灵魂在自我撕裂。

### 罪与意识

拉斯柯尔尼科夫杀了人。但真正的刑罚不是西伯利亚的苦役，而是意识的折磨。陀氏笔下的人物，总是在行动之后才开始真正受苦——因为意识不允许他们遗忘。

### 信仰的困境

《卡拉马佐夫兄弟》中，伊万说：「如果上帝不存在，一切都是被允许的。」但陀氏并没有简单地否定或肯定信仰。他让佐西马长老的温柔与伊万的理性并存，让读者自己选择。

### 为什么今天还要读陀氏

因为我们仍然在问同样的问题：
- 人可以为了「更高的目的」而作恶吗？
- 纯粹的善良是否可能？
- 苦难有没有意义？

这些问题没有答案。但提问本身就是意义。`,
    cover: null,
    tags: ['读书', '俄国文学', '陀思妥耶夫斯基'],
    category: 'reading',
    author_name: 'LOUXILOU',
    view_count: 38,
    created_at: '2024-08-20T11:00:00Z',
    updated_at: '2024-08-20T11:00:00Z',
  },
  {
    id: 'static-6',
    title: '关于深夜写作',
    summary: '夜深人静时，文字似乎有了自己的意志。一些关于写作习惯的私人记录。',
    content: `## 深夜的键盘声

白天写作，文字是工具；深夜写作，文字是对话。

### 为什么是深夜

不是因为「灵感只在夜里来」这种浪漫化的说法。而是因为白天有太多噪音——邮件、消息、待办事项。深夜世界安静下来，思维才能真正沉入文字。

### 写作的节奏

好的写作有呼吸感。长短句交替，抽象与具体穿插，紧张与舒缓轮转。像音乐一样，留白和停顿比音符更重要。

> 写作不是把话说完，而是在恰当的地方停下来。

### 修改的艺术

初稿是和自己对话，修改是和读者对话。每一遍修改都在问：这句话，读者能理解吗？这个转折，读者能跟上吗？

好的文章不是写出来的，是改出来的。`,
    cover: null,
    tags: ['生活', '写作', '随想'],
    category: 'life',
    author_name: 'LOUXILOU',
    view_count: 22,
    created_at: '2024-07-10T23:00:00Z',
    updated_at: '2024-07-10T23:00:00Z',
  },
]

export interface GetPostsOptions {
  category?: string
  limit?: number
}

export async function getPosts(options?: GetPostsOptions): Promise<Post[]> {
  if (!supabase) return STATIC_POSTS

  try {
    let query = supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false })

    if (options?.category && options.category !== 'all') {
      query = query.eq('category', options.category)
    }
    if (options?.limit) {
      query = query.limit(options.limit)
    }

    const { data, error } = await query
    if (error) {
      console.warn('Supabase posts error, using fallback:', error.message)
      return STATIC_POSTS
    }
    return data && data.length > 0 ? data : STATIC_POSTS
  } catch {
    console.warn('Supabase unavailable, using static posts')
    return STATIC_POSTS
  }
}

export async function getPost(id: string): Promise<Post | null> {
  if (!supabase) return STATIC_POSTS.find((p) => p.id === id) || null

  try {
    const { data, error } = await supabase.from('posts').select('*').eq('id', id).single()
    if (error || !data) {
      return STATIC_POSTS.find((p) => p.id === id) || null
    }
    await incrementViewCount(id)
    return data
  } catch {
    return STATIC_POSTS.find((p) => p.id === id) || null
  }
}

export async function searchPosts(keyword: string, category?: string): Promise<Post[]> {
  if (!supabase) return []
  let query = supabase
    .from('posts')
    .select('*')
    .or(`title.ilike.%${keyword}%,summary.ilike.%${keyword}%,content.ilike.%${keyword}%`)
    .order('created_at', { ascending: false })

  if (category && category !== 'all') {
    query = query.eq('category', category)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error searching posts:', error)
    return []
  }

  return data || []
}

export async function getComments(postId: string): Promise<Comment[]> {
  if (!supabase) return []
  const { data, error } = await supabase
    .from('comments')
    .select('*')
    .eq('post_id', postId)
    .order('created_at', { ascending: true })

  if (error) {
    console.error('Error fetching comments:', error)
    return []
  }

  return data || []
}

export async function addComment(
  postId: string,
  userName: string,
  content: string,
  userAvatar?: string
): Promise<Comment | null> {
  if (!supabase) return null
  const { data, error } = await supabase
    .from('comments')
    .insert({
      post_id: postId,
      user_name: userName,
      user_avatar: userAvatar || null,
      content
    })
    .select()
    .single()

  if (error) {
    console.error('Error adding comment:', error)
    return null
  }

  return data
}

export async function toggleLike(postId: string, userId: string): Promise<boolean> {
  if (!supabase) return false
  const { data: existing } = await supabase
    .from('likes')
    .select('id')
    .eq('post_id', postId)
    .eq('user_id', userId)
    .single()

  if (existing) {
    const { error } = await supabase
      .from('likes')
      .delete()
      .eq('post_id', postId)
      .eq('user_id', userId)

    if (error) {
      console.error('Error removing like:', error)
      return false
    }
    return false
  } else {
    const { error } = await supabase
      .from('likes')
      .insert({ post_id: postId, user_id: userId })

    if (error) {
      console.error('Error adding like:', error)
      return true
    }
    return true
  }
}

export async function hasUserLiked(postId: string, userId: string): Promise<boolean> {
  if (!supabase) return false
  const { data } = await supabase
    .from('likes')
    .select('id')
    .eq('post_id', postId)
    .eq('user_id', userId)
    .single()

  return !!data
}

export async function getLikeCount(postId: string): Promise<number> {
  if (!supabase) return 0
  const { count, error } = await supabase
    .from('likes')
    .select('id', { count: 'exact' })
    .eq('post_id', postId)

  if (error) {
    console.error('Error getting like count:', error)
    return 0
  }

  return count || 0
}

async function incrementViewCount(postId: string): Promise<void> {
  if (!supabase) return
  const { error } = await supabase.rpc('increment_view_count', { post_id: postId })
  if (error) {
    console.error('Error incrementing view count:', error)
  }
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function estimateReadTime(content: string): number {
  const wordsPerMinute = 200
  const wordCount = content.replace(/[#*`\n]/g, '').length
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute))
}

export function subscribeToComments(
  postId: string,
  callback: (comment: Comment) => void
): () => void {
  if (!supabase) return () => {}
  const client = supabase
  const channel = client
    .channel(`comments:${postId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'comments',
        filter: `post_id=eq.${postId}`
      },
      (payload) => {
        callback(payload.new as Comment)
      }
    )
    .subscribe()

  return () => {
    client.removeChannel(channel)
  }
}

// Comment likes
export async function toggleCommentLike(commentId: string, userId: string): Promise<boolean> {
  if (!supabase) return false
  const { data: existing } = await supabase
    .from('comment_likes')
    .select('id')
    .eq('comment_id', commentId)
    .eq('user_id', userId)
    .single()

  if (existing) {
    await supabase.from('comment_likes').delete().eq('comment_id', commentId).eq('user_id', userId)
    return false
  } else {
    await supabase.from('comment_likes').insert({ comment_id: commentId, user_id: userId })
    return true
  }
}

export async function hasUserLikedComment(commentId: string, userId: string): Promise<boolean> {
  if (!supabase) return false
  const { data } = await supabase
    .from('comment_likes')
    .select('id')
    .eq('comment_id', commentId)
    .eq('user_id', userId)
    .single()
  return !!data
}

export async function getCommentLikeCount(commentId: string): Promise<number> {
  if (!supabase) return 0
  const { count } = await supabase
    .from('comment_likes')
    .select('id', { count: 'exact' })
    .eq('comment_id', commentId)
  return count || 0
}

export interface Announcement {
  id: string
  content: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export async function getActiveAnnouncement(): Promise<Announcement | null> {
  if (!supabase) return null
  const { data, error } = await supabase
    .from('announcements')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (error) {
    console.error('Error fetching announcement:', error)
    return null
  }

  return data
}

export async function getAllAnnouncements(): Promise<Announcement[]> {
  if (!supabase) return []
  const { data, error } = await supabase
    .from('announcements')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching announcements:', error)
    return []
  }

  return data || []
}

export async function createAnnouncement(content: string): Promise<Announcement | null> {
  if (!supabase) return null
  const { data, error } = await supabase
    .from('announcements')
    .insert({ content, is_active: true })
    .select()
    .single()

  if (error) {
    console.error('Error creating announcement:', error)
    return null
  }

  return data
}

export async function updateAnnouncement(id: string, content: string): Promise<boolean> {
  if (!supabase) return false
  const { error } = await supabase
    .from('announcements')
    .update({ content, updated_at: new Date().toISOString() })
    .eq('id', id)

  if (error) {
    console.error('Error updating announcement:', error)
    return false
  }

  return true
}

export async function deleteAnnouncement(id: string): Promise<boolean> {
  if (!supabase) return false
  const { error } = await supabase
    .from('announcements')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting announcement:', error)
    return false
  }

  return true
}

export async function toggleAnnouncementActive(id: string, isActive: boolean): Promise<boolean> {
  if (!supabase) return false
  const { error } = await supabase
    .from('announcements')
    .update({ is_active: isActive, updated_at: new Date().toISOString() })
    .eq('id', id)

  if (error) {
    console.error('Error toggling announcement:', error)
    return false
  }

  return true
}