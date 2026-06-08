<script setup lang="ts">
import { ref, watch } from 'vue'
import { useAuth } from '../composables/useAuth'

defineProps<{ visible: boolean }>()
const emit = defineEmits<{ close: [] }>()

const { user, sendMagicLink, updateUsername } = useAuth()

const step = ref<'email' | 'sent' | 'username'>('email')
const email = ref('')
const username = ref('')
const error = ref('')
const submitting = ref(false)

// 监听登录状态：用户点击魔法链接回来后自动切换步骤
watch(() => user.value, (u) => {
  if (!u) return
  // 登录成功，检查是否有用户名
  if (u.user_metadata?.username) {
    // 有用户名，直接关闭
    resetAndClose()
  } else {
    // 没有用户名，进入设置步骤
    step.value = 'username'
  }
})

async function handleSendLink() {
  if (!email.value.trim()) { error.value = '请输入邮箱'; return }
  error.value = ''
  submitting.value = true

  const { error: err } = await sendMagicLink(email.value.trim())
  if (err) { error.value = err; submitting.value = false; return }

  step.value = 'sent'
  submitting.value = false
}

async function handleSetUsername() {
  if (!username.value.trim()) { error.value = '请输入用户名'; return }
  error.value = ''
  submitting.value = true

  const { error: err } = await updateUsername(username.value.trim())
  if (err) { error.value = err; submitting.value = false; return }

  submitting.value = false
  resetAndClose()
}

function resetAndClose() {
  step.value = 'email'
  email.value = ''
  username.value = ''
  error.value = ''
  emit('close')
}

function onOverlayClick(e: MouseEvent) {
  if ((e.target as HTMLElement).classList.contains('auth-overlay')) resetAndClose()
}
</script>

<template>
  <Teleport to="body">
    <Transition name="auth">
      <div v-if="visible" class="auth-overlay" @click="onOverlayClick">
        <div class="auth-card">
          <button class="auth-close interactive" @click="resetAndClose">
            <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>

          <!-- Step 1: 输入邮箱 -->
          <template v-if="step === 'email'">
            <h2 class="auth-title">登录 / 注册</h2>
            <p class="auth-sub">输入邮箱，我们会发送验证链接</p>
            <form class="auth-form" @submit.prevent="handleSendLink">
              <input v-model="email" type="email" placeholder="你的邮箱" class="auth-input" autocomplete="email" />
              <p v-if="error" class="auth-error">{{ error }}</p>
              <button type="submit" class="auth-btn interactive" :disabled="submitting">
                {{ submitting ? '发送中…' : '发送验证链接' }}
              </button>
            </form>
          </template>

          <!-- Step 2: 等待验证 -->
          <template v-if="step === 'sent'">
            <div class="auth-sent-icon">
              <svg viewBox="0 0 24 24" width="48" height="48" stroke="var(--gold)" stroke-width="1.5" fill="none"><rect x="2" y="4" width="20" height="16" rx="2"/><polyline points="22,4 12,13 2,4"/></svg>
            </div>
            <h2 class="auth-title">验证你的邮箱</h2>
            <p class="auth-sub">已向 <strong>{{ email }}</strong> 发送验证链接<br>点击邮件中的链接后，返回此页面</p>
            <p class="auth-note">没有收到？请检查垃圾邮件文件夹</p>
            <button class="auth-back interactive" @click="step = 'email'; error = ''">← 返回重新发送</button>
          </template>

          <!-- Step 3: 设置用户名（新用户） -->
          <template v-if="step === 'username'">
            <h2 class="auth-title">设置用户名</h2>
            <p class="auth-sub">邮箱验证成功！给自己取个名字吧</p>
            <form class="auth-form" @submit.prevent="handleSetUsername">
              <input v-model="username" type="text" placeholder="你的名字" class="auth-input" maxlength="20" autocomplete="username" />
              <p v-if="error" class="auth-error">{{ error }}</p>
              <button type="submit" class="auth-btn interactive" :disabled="submitting">
                {{ submitting ? '保存中…' : '完成注册' }}
              </button>
            </form>
          </template>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.auth-overlay {
  position: fixed; inset: 0; z-index: 10001;
  background: rgba(var(--bg-rgb), 0.85);
  backdrop-filter: blur(12px);
  display: flex; align-items: center; justify-content: center;
  padding: 1.5rem;
}
.auth-card {
  position: relative;
  width: 100%; max-width: 380px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--r-lg);
  padding: 2.5rem 2rem 2rem;
  box-shadow: 0 16px 48px rgba(0,0,0,0.12);
}
.auth-close {
  position: absolute; top: 1rem; right: 1rem;
  background: none; border: none; color: var(--ink-ghost);
  cursor: pointer; padding: 0.25rem; transition: color 0.2s;
}
.auth-close:hover { color: var(--ink); }
.auth-title {
  font-family: var(--font-display); font-size: 1.4rem; font-weight: 700;
  margin-bottom: 0.4rem;
}
.auth-sub {
  font-size: 0.82rem; color: var(--ink-ghost); margin-bottom: 1.5rem; line-height: 1.7;
}
.auth-sub strong { color: var(--gold); font-weight: 600; }
.auth-sent-icon { text-align: center; margin-bottom: 1.25rem; }
.auth-note {
  font-size: 0.75rem; color: var(--ink-vanish); text-align: center;
  margin-top: 0.5rem; margin-bottom: 1.25rem;
}
.auth-form { display: flex; flex-direction: column; gap: 0.75rem; }
.auth-input {
  padding: 0.65rem 0.85rem;
  background: var(--bg-warm); border: 1px solid var(--border);
  border-radius: var(--r-sm); font-size: 0.85rem; color: var(--ink);
  font-family: var(--font-body); outline: none; transition: border-color 0.2s;
}
.auth-input:focus { border-color: var(--gold); }
.auth-error { font-size: 0.78rem; color: #c84444; margin: 0; }
.auth-btn {
  padding: 0.7rem;
  background: var(--gold); color: #fff; border: none;
  border-radius: var(--r-sm); font-size: 0.85rem; font-family: var(--font-body);
  cursor: pointer; transition: opacity 0.2s; margin-top: 0.25rem;
}
.auth-btn:hover { opacity: 0.85; }
.auth-btn:disabled { opacity: 0.5; cursor: not-allowed; }
.auth-back {
  display: block; margin: 0 auto;
  background: none; border: none; color: var(--ink-ghost);
  font-size: 0.78rem; font-family: var(--font-body);
  cursor: pointer; transition: color 0.2s;
}
.auth-back:hover { color: var(--ink); }

.auth-enter-active { transition: opacity 0.3s ease; }
.auth-leave-active { transition: opacity 0.2s ease; }
.auth-enter-from, .auth-leave-to { opacity: 0; }
</style>
