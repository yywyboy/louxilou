import { ref, onMounted } from 'vue'
import { supabase } from '../lib/supabase'
import type { User, Session } from '@supabase/supabase-js'

const user = ref<User | null>(null)
const session = ref<Session | null>(null)
const loading = ref(true)

let initialized = false

export function useAuth() {
  async function init() {
    if (!supabase || initialized) return
    initialized = true

    const { data } = await supabase.auth.getSession()
    session.value = data.session
    user.value = data.session?.user ?? null
    loading.value = false

    const client = supabase
    client.auth.onAuthStateChange((_event, s) => {
      session.value = s
      user.value = s?.user ?? null
    })
  }

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

  onMounted(() => { init() })

  return { user, session, loading, sendMagicLink, updateUsername, signOut, getDisplayName }
}
