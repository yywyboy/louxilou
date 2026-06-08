import { ref } from 'vue'
import { supabase } from '../lib/supabase'
import type { User, Session } from '@supabase/supabase-js'

const user = ref<User | null>(null)
const session = ref<Session | null>(null)
const loading = ref(true)

let initPromise: Promise<void> | null = null

function ensureInit() {
  if (initPromise) return initPromise
  if (!supabase) { loading.value = false; return Promise.resolve() }

  const client = supabase

  // 先注册监听，确保 hash token 不丢失
  client.auth.onAuthStateChange((_event, s) => {
    session.value = s
    user.value = s?.user ?? null
    loading.value = false
  })

  // 处理 URL hash 中的 token
  initPromise = client.auth.getSession().then(({ data }) => {
    session.value = data.session
    user.value = data.session?.user ?? null
    loading.value = false
  })

  return initPromise
}

// 模块加载时立即初始化
ensureInit()

export function useAuth() {
  /** 发送魔法链接 */
  async function sendMagicLink(email: string) {
    if (!supabase) return { error: 'Supabase 未配置' }
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
        emailRedirectTo: window.location.origin,
      },
    })
    return { error: error?.message || null }
  }

  /** 设置用户名 */
  async function updateUsername(username: string) {
    if (!supabase) return { error: 'Supabase 未配置' }
    const { error } = await supabase.auth.updateUser({ data: { username } })
    if (!error) {
      const { data } = await supabase.auth.getUser()
      user.value = data.user
    }
    return { error: error?.message || null }
  }

  async function signOut() {
    if (!supabase) return
    await supabase.auth.signOut()
    user.value = null
    session.value = null
  }

  function getDisplayName(): string {
    if (!user.value) return ''
    return user.value.user_metadata?.username || user.value.email?.split('@')[0] || '用户'
  }

  return { user, session, loading, sendMagicLink, updateUsername, signOut, getDisplayName }
}
