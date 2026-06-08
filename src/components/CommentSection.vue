<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import type { Comment } from '../lib/blog'

const props = defineProps<{
  comments: Comment[]
  commentLikes: Record<string, { liked: boolean; count: number }>
  userName?: string
  isLoggedIn?: boolean
}>()

const emit = defineEmits<{
  submit: [content: string, parentId?: string, replyToName?: string]
  like: [commentId: string]
  login: []
}>()

const cBody = ref('')
const replyTo = ref<{ id: string; name: string } | null>(null)

const nestedComments = computed(() => {
  const map = new Map<string, Comment[]>()
  props.comments.forEach(c => {
    const pid = c.parent_id || '_root'
    if (!map.has(pid)) map.set(pid, [])
    map.get(pid)!.push(c)
  })
  return map
})
const rootComments = computed(() => nestedComments.value.get('_root') || [])

function getReplies(parentId: string): Comment[] {
  return nestedComments.value.get(parentId) || []
}

function fmtDate(d: string) {
  if (!d) return ''
  const now = new Date(), ms = now.getTime() - new Date(d).getTime()
  const min = Math.floor(ms/60000), hr = Math.floor(ms/3600000), day = Math.floor(ms/86400000)
  if (min < 1) return '刚刚'
  if (min < 60) return min + '分钟前'
  if (hr < 24) return hr + '小时前'
  if (day < 7) return day + '天前'
  return new Date(d).toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })
}

function startReply(id: string, name: string) {
  replyTo.value = { id, name }
  nextTick(() => { document.querySelector('.cm-form textarea')?.scrollIntoView({ behavior: 'smooth', block: 'center' }) })
}
function cancelReply() { replyTo.value = null }

function doComment() {
  if (!cBody.value.trim()) return
  emit('submit', cBody.value.trim(), replyTo.value?.id, replyTo.value?.name)
  cBody.value = ''
  replyTo.value = null
}
</script>

<template>
  <section class="cm-sec">
    <h2 class="cm-title">评论 ({{ comments.length }})</h2>
    <div class="rule" style="margin-bottom:2rem"></div>

    <!-- 未登录：提示登录 -->
    <div v-if="!isLoggedIn" class="cm-login-hint">
      <p>登录后即可发表评论</p>
      <button class="cta-fill interactive" @click="emit('login')">登录 / 注册</button>
    </div>

    <!-- 已登录：评论表单 -->
    <div v-else class="cm-form">
      <div class="cm-user-bar">
        <span class="cm-user-name">{{ userName }}</span>
      </div>
      <div v-if="replyTo" class="reply-hint">
        <span>回复 @{{ replyTo.name }}</span>
        <button class="reply-cancel interactive" @click="cancelReply">×</button>
      </div>
      <textarea v-model="cBody" :placeholder="replyTo ? '回复 @' + replyTo.name + '…' : '写下你的想法…'" class="ft" rows="3"></textarea>
      <button class="cta-fill interactive" @click="doComment">{{ replyTo ? '发布回复' : '发布评论' }}</button>
    </div>

    <div class="cm-list">
      <template v-for="c in rootComments" :key="c.id">
        <div class="cm">
          <div class="cm-av">{{ c.user_avatar || c.user_name?.charAt(0) || '?' }}</div>
          <div class="cm-body">
            <div class="cm-head"><span class="cm-name">{{ c.user_name }}</span><span class="cm-date">{{ fmtDate(c.created_at) }}</span></div>
            <p class="cm-text">{{ c.content }}</p>
            <div class="cm-actions">
              <button class="cm-action interactive" @click="startReply(c.id, c.user_name)">回复</button>
              <button class="cm-action interactive" :class="{ on: commentLikes[c.id]?.liked }" @click="emit('like', c.id)">
                <svg viewBox="0 0 24 24" width="12" height="12" :stroke="commentLikes[c.id]?.liked ? '#c8a45e' : 'currentColor'" stroke-width="2" :fill="commentLikes[c.id]?.liked ? '#c8a45e' : 'none'"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                <span v-if="commentLikes[c.id]?.count">{{ commentLikes[c.id].count }}</span>
              </button>
            </div>
          </div>
        </div>
        <div v-for="r in getReplies(c.id)" :key="r.id" class="cm cm-reply-item">
          <div class="cm-av cm-av-sm">{{ r.user_avatar || r.user_name?.charAt(0) || '?' }}</div>
          <div class="cm-body">
            <div class="cm-head">
              <span class="cm-name">{{ r.user_name }}</span>
              <span v-if="r.reply_to_name" class="cm-reply-to">回复 @{{ r.reply_to_name }}</span>
              <span class="cm-date">{{ fmtDate(r.created_at) }}</span>
            </div>
            <p class="cm-text">{{ r.content }}</p>
            <div class="cm-actions">
              <button class="cm-action interactive" @click="startReply(c.id, r.user_name)">回复</button>
              <button class="cm-action interactive" :class="{ on: commentLikes[r.id]?.liked }" @click="emit('like', r.id)">
                <svg viewBox="0 0 24 24" width="12" height="12" :stroke="commentLikes[r.id]?.liked ? '#c8a45e' : 'currentColor'" stroke-width="2" :fill="commentLikes[r.id]?.liked ? '#c8a45e' : 'none'"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                <span v-if="commentLikes[r.id]?.count">{{ commentLikes[r.id].count }}</span>
              </button>
            </div>
          </div>
        </div>
      </template>
    </div>
    <div v-if="!comments.length" class="no-cm"><p>还没有评论，来抢沙发吧！</p></div>
  </section>
</template>

<style scoped>
.cm-sec { margin-top: 4rem; }
.cm-title { font-family: var(--font-display); font-size: 1.3rem; font-weight: 600; }
.cm-form { display: flex; flex-direction: column; gap: 0.75rem; margin-bottom: 2.5rem; }
.cm-user-bar { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.25rem; }
.cm-user-name { font-size: 0.82rem; font-weight: 600; color: var(--gold); }
.cm-login-hint { text-align: center; padding: 2rem; margin-bottom: 2.5rem; background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--r-sm); }
.cm-login-hint p { font-size: 0.85rem; color: var(--ink-ghost); margin-bottom: 1rem; }
.ft { padding: 0.6rem 0.8rem; background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--r-sm); font-size: 0.85rem; color: var(--ink); font-family: var(--font-body); outline: none; resize: vertical; min-height: 80px; transition: border-color 0.2s; }
.ft:focus { border-color: var(--gold); }
.cta-fill { padding: 0.6rem 1.5rem; background: var(--gold); color: #fff; border: none; border-radius: var(--r-sm); font-size: 0.85rem; font-family: var(--font-body); cursor: pointer; align-self: flex-end; transition: opacity 0.2s; }
.cta-fill:hover { opacity: 0.85; }
.reply-hint { display: flex; align-items: center; gap: 0.5rem; font-size: 0.82rem; color: var(--ink-dim); }
.reply-cancel { background: none; border: none; font-size: 1.2rem; color: var(--ink-ghost); cursor: pointer; padding: 0 0.25rem; }
.cm-list { display: flex; flex-direction: column; gap: 1.25rem; }
.cm { display: flex; gap: 0.75rem; }
.cm-av { width: 36px; height: 36px; border-radius: 50%; background: var(--bg-elevated); display: flex; align-items: center; justify-content: center; font-size: 0.8rem; color: var(--ink-dim); flex-shrink: 0; }
.cm-av-sm { width: 28px; height: 28px; font-size: 0.7rem; }
.cm-body { flex: 1; min-width: 0; }
.cm-head { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.25rem; }
.cm-name { font-size: 0.85rem; font-weight: 600; color: var(--ink); }
.cm-reply-to { font-size: 0.75rem; color: var(--ink-ghost); }
.cm-date { font-size: 0.72rem; color: var(--ink-ghost); }
.cm-text { font-size: 0.85rem; color: var(--ink-dim); line-height: 1.7; margin: 0; }
.cm-actions { display: flex; gap: 0.75rem; margin-top: 0.4rem; }
.cm-action { background: none; border: none; font-size: 0.75rem; color: var(--ink-ghost); cursor: pointer; display: flex; align-items: center; gap: 0.3rem; padding: 0; transition: color 0.2s; }
.cm-action:hover { color: var(--ink); }
.cm-action.on { color: var(--gold); }
.cm-reply-item { margin-left: 2.5rem; padding-left: 1rem; border-left: 2px solid var(--border); }
.no-cm { text-align: center; padding: 2rem; color: var(--ink-ghost); font-size: 0.85rem; }
.rule { height: 1px; background: var(--border); }
</style>
