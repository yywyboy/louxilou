<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { gsap } from '../composables/useGsap'

interface Friend {
  name: string
  url: string
  avatar: string
  desc: string
}

const friends = ref<Friend[]>([
  { name: '楼西楼', url: 'https://louxilou.com.cn', avatar: '/p.png', desc: '文章 · 阅读 · 摄影' },
])

onMounted(() => {
  document.title = '友链 — LOUXILOU'
  gsap.fromTo('.pg-head', { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay: 0.1 })
  gsap.fromTo('.friend-card', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: 'power3.out', delay: 0.3 })
})
</script>

<template>
  <div class="friends">
    <div class="ctr">
      <header class="pg-head">
        <span class="eyebrow">Friends</span>
        <h1 class="pg-title">友链</h1>
        <p class="pg-desc">志同道合的朋友们</p>
      </header>

      <div class="friend-grid">
        <a v-for="f in friends" :key="f.name" :href="f.url" target="_blank" rel="noopener" class="friend-card interactive">
          <img :src="f.avatar" :alt="f.name" class="friend-avatar" decoding="async" />
          <div class="friend-info">
            <h3 class="friend-name">{{ f.name }}</h3>
            <p class="friend-desc">{{ f.desc }}</p>
          </div>
        </a>
      </div>

      <section class="apply-section">
        <div class="rule-center"></div>
        <h2 class="apply-title">申请友链</h2>
        <p class="apply-desc">如果你也想出现在这里，请通过以下方式联系我：</p>
        <div class="apply-info">
          <p>📧 邮箱：<a href="mailto:3095697053@qq.com" class="apply-link">3095697053@qq.com</a></p>
          <p>📺 Bilibili：<a href="https://space.bilibili.com/603244446" target="_blank" class="apply-link">@楼西楼</a></p>
        </div>
        <div class="apply-format">
          <h3 class="format-title">申请格式</h3>
          <ul class="format-list">
            <li>网站名称</li>
            <li>网站链接</li>
            <li>头像链接</li>
            <li>一句话描述</li>
          </ul>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.friends { position: relative; z-index: 1; padding: 2rem 0 6rem; }
.pg-head { text-align: center; margin-bottom: 3rem; opacity: 0; }
.eyebrow { font-family: var(--font-sans); font-size: 0.65rem; color: var(--gold); letter-spacing: 0.3em; text-transform: uppercase; display: block; margin-bottom: 1rem; }
.pg-title { font-family: var(--font-display); font-size: clamp(3rem, 7vw, 5rem); font-weight: 900; letter-spacing: 0.06em; margin-bottom: 0.75rem; }
.pg-desc { font-size: 0.88rem; color: var(--ink-ghost); letter-spacing: 0.05em; }

.friend-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.25rem; margin-bottom: 4rem; }
.friend-card { display: flex; align-items: center; gap: 1rem; padding: 1.25rem; background: var(--bg-card); border: 1px solid var(--border); border-radius: 6px; text-decoration: none; transition: all 0.3s; }
.friend-card:hover { border-color: var(--gold); transform: translateY(-2px); box-shadow: 0 4px 16px rgba(0,0,0,0.06); }
.friend-avatar { width: 48px; height: 48px; border-radius: 50%; object-fit: cover; border: 2px solid var(--border); flex-shrink: 0; }
.friend-info { flex: 1; min-width: 0; }
.friend-name { font-family: var(--font-display); font-size: 1rem; font-weight: 600; margin-bottom: 0.15rem; color: var(--ink); }
.friend-desc { font-size: 0.78rem; color: var(--ink-ghost); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

.apply-section { max-width: 560px; margin: 0 auto; text-align: center; }
.apply-title { font-family: var(--font-display); font-size: 1.3rem; font-weight: 600; margin-bottom: 0.75rem; }
.apply-desc { font-size: 0.88rem; color: var(--ink-ghost); margin-bottom: 1.5rem; }
.apply-info { margin-bottom: 2rem; }
.apply-info p { font-size: 0.85rem; color: var(--ink-dim); margin-bottom: 0.4rem; }
.apply-link { color: var(--gold); text-decoration: none; border-bottom: 1px solid transparent; transition: border-color 0.3s; }
.apply-link:hover { border-bottom-color: var(--gold); }
.apply-format { padding: 1.5rem; background: var(--bg-card); border: 1px solid var(--border); border-radius: 6px; text-align: left; }
.format-title { font-family: var(--font-display); font-size: 0.95rem; font-weight: 600; margin-bottom: 0.75rem; }
.format-list { padding-left: 1.25rem; }
.format-list li { font-size: 0.85rem; color: var(--ink-dim); margin-bottom: 0.3rem; }

@media (max-width: 768px) {
  .pg-title { font-size: 2.5rem; }
  .friend-grid { grid-template-columns: 1fr; }
}
</style>
