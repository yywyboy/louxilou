import { createClient } from '@supabase/supabase-js'
import { writeFileSync, readFileSync } from 'fs'
import { join } from 'path'

// 读取.env文件
function loadEnv() {
  try {
    const envPath = join(process.cwd(), '.env')
    const envContent = readFileSync(envPath, 'utf-8')
    const lines = envContent.split('\n')
    
    for (const line of lines) {
      const trimmed = line.trim()
      if (trimmed && !trimmed.startsWith('#')) {
        const [key, ...valueParts] = trimmed.split('=')
        if (key && valueParts.length > 0) {
          process.env[key.trim()] = valueParts.join('=').trim()
        }
      }
    }
  } catch (error) {
    console.warn('无法读取.env文件:', error.message)
  }
}

loadEnv()

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('错误: 请设置 VITE_SUPABASE_URL 和 VITE_SUPABASE_ANON_KEY 环境变量')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toUTCString()
}

function escapeXml(text) {
  if (!text) return ''
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function generateRSS(posts) {
  const items = posts.map(post => {
    const pubDate = formatDate(post.created_at)
    const link = `https://louxilou.com.cn/blog/${post.id}`
    const description = post.summary || (post.content ? post.content.substring(0, 200) : '')
    
    return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${link}</link>
      <description>${escapeXml(description)}</description>
      <pubDate>${pubDate}</pubDate>
      <guid>${link}</guid>
    </item>`
  }).join('\n\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>楼西楼的博客</title>
    <link>https://louxilou.com.cn</link>
    <description>分享前端技术、生活随想与阅读笔记</description>
    <language>zh-CN</language>
    <lastBuildDate>${formatDate(new Date().toISOString())}</lastBuildDate>
    <atom:link href="https://louxilou.com.cn/feed.xml" rel="self" type="application/rss+xml"/>

${items}
  </channel>
</rss>`
}

async function main() {
  try {
    console.log('正在从Supabase获取文章数据...')
    
    const { data: posts, error } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20)

    if (error) {
      throw error
    }

    if (!posts || posts.length === 0) {
      console.log('没有找到文章，生成空RSS')
    } else {
      console.log(`找到 ${posts.length} 篇文章`)
    }

    const rssContent = generateRSS(posts || [])
    const outputPath = join(process.cwd(), 'public', 'feed.xml')
    
    writeFileSync(outputPath, rssContent, 'utf-8')
    console.log(`RSS已生成: ${outputPath}`)
    
  } catch (error) {
    console.error('生成RSS失败:', error.message)
    process.exit(1)
  }
}

main()
