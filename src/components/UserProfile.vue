<script setup lang="ts">
import { ref, watch } from 'vue'
import { useAuth } from '../composables/useAuth'

const props = defineProps<{ visible: boolean }>()
const emit = defineEmits<{ close: [] }>()

const { user, signOut, updateUsername, deleteAccount } = useAuth()

const editing = ref(false)
const newName = ref('')
const error = ref('')
const saving = ref(false)
const showDeleteConfirm = ref(false)
const deleting = ref(false)

watch(() => props.visible, (v) => {
  if (v) {
    newName.value = user.value?.user_metadata?.username || ''
    editing.value = false
    error.value = ''
    showDeleteConfirm.value = false
  }
})

async function saveName() {
  if (!newName.value.trim()) { error.value = '用户名不能为空'; return }
  error.value = ''
  saving.value = true
  const { error: err } = await updateUsername(newName.value.trim())
  if (err) { error.value = err; saving.value = false; return }
  saving.value = false
  editing.value = false
}

function handleSignOut() {
  signOut()
  emit('close')
}

async function handleDelete() {
  deleting.value = true
  const { error: err } = await deleteAccount()
  if (err) {
    alert(err)
    deleting.value = false
    return
  }
  emit('close')
}

function onOverlayClick(e: MouseEvent) {
  if ((e.target as HTMLElement).classList.contains('profile-overlay')) emit('close')
}
</script>

<template>
  <Teleport to="body">
    <Transition name="profile">
      <div v-if="visible" class="profile-overlay" @click="onOverlayClick">
        <div class="profile-card">
          <button class="profile-close interactive" @click="emit('close')">
            <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>

          <!-- 头像 + 信息 -->
          <div class="profile-header">
            <div class="profile-avatar">{{ (user?.user_metadata?.username || user?.email?.charAt(0) || '?').charAt(0).toUpperCase() }}</div>
            <div class="profile-info">
              <p class="profile-name">{{ user?.user_metadata?.username || '未设置用户名' }}</p>
              <p class="profile-email">{{ user?.email }}</p>
            </div>
          </div>

          <div class="profile-divider"></div>

          <!-- 用户名编辑 -->
          <div class="profile-section">
            <label class="profile-label">用户名</label>
            <template v-if="!editing">
              <div class="profile-row">
                <span class="profile-value">{{ user?.user_metadata?.username || '—' }}</span>
                <button class="profile-edit-btn interactive" @click="editing = true">修改</button>
              </div>
            </template>
            <template v-else>
              <div class="profile-edit-row">
                <input v-model="newName" type="text" class="profile-input" maxlength="20" placeholder="输入新用户名" />
                <button class="profile-save-btn interactive" :disabled="saving" @click="saveName">{{ saving ? '…' : '保存' }}</button>
                <button class="profile-cancel-btn interactive" @click="editing = false; error = ''">取消</button>
              </div>
              <p v-if="error" class="profile-error">{{ error }}</p>
            </template>
          </div>

          <div class="profile-divider"></div>

          <!-- 操作 -->
          <div class="profile-actions">
            <button class="profile-action interactive" @click="handleSignOut">
              <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
              退出登录
            </button>
            <button class="profile-action profile-action-danger interactive" @click="showDeleteConfirm = true">
              <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
              注销账号
            </button>
          </div>

          <!-- 注销确认 -->
          <Transition name="confirm">
            <div v-if="showDeleteConfirm" class="profile-confirm">
              <p class="profile-confirm-text">确定要注销账号吗？此操作不可撤销。</p>
              <div class="profile-confirm-btns">
                <button class="profile-cancel-btn interactive" @click="showDeleteConfirm = false">取消</button>
                <button class="profile-delete-btn interactive" :disabled="deleting" @click="handleDelete">{{ deleting ? '注销中…' : '确定注销' }}</button>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.profile-overlay {
  position: fixed; inset: 0; z-index: 10001;
  background: rgba(var(--bg-rgb), 0.5);
  backdrop-filter: blur(8px);
  display: flex; align-items: center; justify-content: center;
  padding: 1.5rem;
}
.profile-card {
  position: relative;
  width: 100%; max-width: 360px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--r-lg);
  padding: 2rem 1.5rem 1.5rem;
  box-shadow: 0 16px 48px rgba(0,0,0,0.12);
}
.profile-close {
  position: absolute; top: 1rem; right: 1rem;
  background: none; border: none; color: var(--ink-ghost);
  cursor: pointer; padding: 0.25rem; transition: color 0.2s;
}
.profile-close:hover { color: var(--ink); }

.profile-header { display: flex; align-items: center; gap: 1rem; margin-bottom: 1.25rem; }
.profile-avatar {
  width: 48px; height: 48px; border-radius: 50%;
  background: var(--gold); color: #fff;
  display: flex; align-items: center; justify-content: center;
  font-family: var(--font-display); font-size: 1.2rem; font-weight: 700;
  flex-shrink: 0;
}
.profile-info { min-width: 0; }
.profile-name { font-family: var(--font-display); font-size: 1.1rem; font-weight: 600; margin: 0 0 0.15rem; }
.profile-email { font-size: 0.78rem; color: var(--ink-ghost); margin: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

.profile-divider { height: 1px; background: var(--border); margin: 1rem 0; }

.profile-section { margin-bottom: 0.25rem; }
.profile-label { font-size: 0.72rem; color: var(--ink-ghost); display: block; margin-bottom: 0.4rem; }
.profile-row { display: flex; align-items: center; justify-content: space-between; }
.profile-value { font-size: 0.88rem; color: var(--ink); }
.profile-edit-btn {
  background: none; border: none; color: var(--gold);
  font-size: 0.78rem; font-family: var(--font-body);
  cursor: pointer; transition: opacity 0.2s;
}
.profile-edit-btn:hover { opacity: 0.7; }

.profile-edit-row { display: flex; gap: 0.5rem; align-items: center; }
.profile-input {
  flex: 1; padding: 0.5rem 0.7rem;
  background: var(--bg-warm); border: 1px solid var(--border);
  border-radius: var(--r-sm); font-size: 0.85rem; color: var(--ink);
  font-family: var(--font-body); outline: none; transition: border-color 0.2s;
}
.profile-input:focus { border-color: var(--gold); }
.profile-save-btn {
  padding: 0.45rem 0.8rem; background: var(--gold); color: #fff;
  border: none; border-radius: var(--r-sm); font-size: 0.78rem;
  font-family: var(--font-body); cursor: pointer; transition: opacity 0.2s;
}
.profile-save-btn:hover { opacity: 0.85; }
.profile-save-btn:disabled { opacity: 0.5; cursor: not-allowed; }
.profile-cancel-btn {
  padding: 0.45rem 0.8rem; background: none; color: var(--ink-ghost);
  border: 1px solid var(--border); border-radius: var(--r-sm); font-size: 0.78rem;
  font-family: var(--font-body); cursor: pointer; transition: all 0.2s;
}
.profile-cancel-btn:hover { border-color: var(--ink-ghost); }
.profile-error { font-size: 0.75rem; color: #c84444; margin: 0.4rem 0 0; }

.profile-actions { display: flex; flex-direction: column; gap: 0.25rem; }
.profile-action {
  display: flex; align-items: center; gap: 0.6rem;
  width: 100%; padding: 0.6rem 0.75rem;
  background: none; border: none; border-radius: var(--r-sm);
  font-size: 0.82rem; font-family: var(--font-body);
  color: var(--ink-dim); cursor: pointer; transition: all 0.2s;
  text-align: left;
}
.profile-action:hover { background: var(--gold-dim); color: var(--ink); }
.profile-action-danger { color: #c84444; }
.profile-action-danger:hover { background: rgba(200,68,68,0.08); color: #c84444; }

.profile-confirm {
  margin-top: 0.75rem; padding: 0.75rem;
  background: rgba(200,68,68,0.06); border: 1px solid rgba(200,68,68,0.15);
  border-radius: var(--r-sm);
}
.profile-confirm-text { font-size: 0.8rem; color: var(--ink-dim); margin: 0 0 0.75rem; }
.profile-confirm-btns { display: flex; gap: 0.5rem; justify-content: flex-end; }
.profile-delete-btn {
  padding: 0.45rem 0.8rem; background: #c84444; color: #fff;
  border: none; border-radius: var(--r-sm); font-size: 0.78rem;
  font-family: var(--font-body); cursor: pointer; transition: opacity 0.2s;
}
.profile-delete-btn:hover { opacity: 0.85; }

.profile-enter-active { transition: opacity 0.3s ease; }
.profile-leave-active { transition: opacity 0.2s ease; }
.profile-enter-from, .profile-leave-to { opacity: 0; }
.confirm-enter-active { transition: all 0.2s ease; }
.confirm-leave-active { transition: all 0.15s ease; }
.confirm-enter-from, .confirm-leave-to { opacity: 0; transform: translateY(-4px); }
</style>
