<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface Article {
  id: string
  title: string
  content: string
  createdAt: string
}

const articles = ref<Article[]>([])
const showLogin = ref(true)
const password = ref('')
const errorMessage = ref('')
const showPublishForm = ref(false)
const newArticle = ref({ title: '', content: '' })

const ADMIN_PASSWORD = 'admin123'
const STORAGE_KEY = 'louxilou_articles'

const loadArticles = () => {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored) {
    articles.value = JSON.parse(stored)
  } else {
    articles.value = [
      {
        id: '1',
        title: '欢迎来到楼西楼',
        content: '这是一个展示个人作品的空间。在这里，您可以看到我的摄影作品、阅读心得和生活感悟。',
        createdAt: '2024-01-01'
      },
      {
        id: '2',
        title: '新功能上线',
        content: '我们刚刚添加了观景台功能，您可以在这里浏览我的摄影作品集。',
        createdAt: '2024-01-15'
      }
    ]
    saveArticles()
  }
}

const saveArticles = () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(articles.value))
}

const login = () => {
  if (password.value === ADMIN_PASSWORD) {
    showLogin.value = false
    errorMessage.value = ''
  } else {
    errorMessage.value = '密码错误，请重试'
  }
}

const publishArticle = () => {
  if (!newArticle.value.title || !newArticle.value.content) {
    errorMessage.value = '请填写标题和内容'
    return
  }
  
  const article: Article = {
    id: Date.now().toString(),
    title: newArticle.value.title,
    content: newArticle.value.content,
    createdAt: new Date().toISOString().split('T')[0]
  }
  
  articles.value.unshift(article)
  saveArticles()
  
  newArticle.value = { title: '', content: '' }
  showPublishForm.value = false
  errorMessage.value = ''
}

const deleteArticle = (id: string) => {
  articles.value = articles.value.filter(a => a.id !== id)
  saveArticles()
}

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })
}

onMounted(() => {
  loadArticles()
})
</script>

<template>
  <div class="articles-container">
    <!-- 登录界面 -->
    <div v-if="showLogin" class="login-section">
      <div class="login-card">
        <h2 class="login-title">管理员登录</h2>
        <p class="login-desc">请输入密码以管理文章</p>
        <div class="input-group">
          <input 
            v-model="password" 
            type="password" 
            placeholder="请输入密码"
            class="password-input"
            @keyup.enter="login"
          />
        </div>
        <button class="login-btn" @click="login">登录</button>
        <p v-if="errorMessage" class="error-text">{{ errorMessage }}</p>
      </div>
    </div>

    <!-- 文章管理界面 -->
    <div v-else class="articles-section">
      <!-- 顶部操作栏 -->
      <div class="top-bar">
        <h1 class="section-title">文章管理</h1>
        <div class="actions">
          <button 
            class="publish-btn" 
            @click="showPublishForm = !showPublishForm"
            :class="{ active: showPublishForm }"
          >
            {{ showPublishForm ? '取消' : '发布新文章' }}
          </button>
          <button class="logout-btn" @click="showLogin = true; password = ''">退出</button>
        </div>
      </div>

      <!-- 发布表单 -->
      <div v-if="showPublishForm" class="publish-form">
        <h3>发布新文章</h3>
        <div class="form-group">
          <input 
            v-model="newArticle.title" 
            type="text" 
            placeholder="文章标题"
            class="form-input"
          />
        </div>
        <div class="form-group">
          <textarea 
            v-model="newArticle.content" 
            placeholder="文章内容"
            class="form-textarea"
            rows="6"
          ></textarea>
        </div>
        <div class="form-actions">
          <button class="submit-btn" @click="publishArticle">发布</button>
          <button class="cancel-btn" @click="showPublishForm = false">取消</button>
        </div>
        <p v-if="errorMessage" class="error-text">{{ errorMessage }}</p>
      </div>

      <!-- 文章列表 -->
      <div class="articles-list">
        <div v-if="articles.length === 0" class="empty-state">
          <p>暂无文章，点击上方按钮发布第一篇文章</p>
        </div>
        
        <div 
          v-for="article in articles" 
          :key="article.id" 
          class="article-card"
        >
          <div class="article-header">
            <h3 class="article-title">{{ article.title }}</h3>
            <button class="delete-btn" @click="deleteArticle(article.id)">删除</button>
          </div>
          <p class="article-content">{{ article.content }}</p>
          <p class="article-date">{{ formatDate(article.createdAt) }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.articles-container {
  min-height: 100vh;
  padding: 40px 20px;
  max-width: 800px;
  margin: 0 auto;
}

.login-section {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
}

.login-card {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 249, 250, 0.9) 100%);
  backdrop-filter: blur(20px);
  padding: 40px;
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  text-align: center;
  width: 100%;
  max-width: 400px;
}

.login-title {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 8px;
}

.login-desc {
  color: #6b7280;
  margin-bottom: 24px;
}

.input-group {
  margin-bottom: 20px;
}

.password-input {
  width: 100%;
  padding: 14px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 16px;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.8);
}

.password-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.login-btn {
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.login-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 20px rgba(102, 126, 234, 0.4);
}

.error-text {
  color: #ef4444;
  margin-top: 12px;
  font-size: 14px;
}

.articles-section {
  animation: fadeIn 0.5s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  flex-wrap: wrap;
  gap: 16px;
}

.section-title {
  font-size: 28px;
  font-weight: 700;
}

.actions {
  display: flex;
  gap: 12px;
}

.publish-btn,
.logout-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.publish-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.publish-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.publish-btn.active {
  background: #6b7280;
}

.logout-btn {
  background: #f3f4f6;
  color: #374151;
}

.logout-btn:hover {
  background: #e5e7eb;
}

.publish-form {
  background: white;
  padding: 30px;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  margin-bottom: 30px;
}

.publish-form h3 {
  margin-bottom: 20px;
  font-size: 18px;
}

.form-group {
  margin-bottom: 16px;
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 10px;
  font-size: 14px;
  transition: all 0.3s ease;
  box-sizing: border-box;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-textarea {
  resize: vertical;
  min-height: 120px;
}

.form-actions {
  display: flex;
  gap: 12px;
  margin-top: 20px;
}

.submit-btn,
.cancel-btn {
  padding: 10px 24px;
  border: none;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.submit-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.submit-btn:hover {
  transform: translateY(-2px);
}

.cancel-btn {
  background: #f3f4f6;
  color: #6b7280;
}

.cancel-btn:hover {
  background: #e5e7eb;
}

.articles-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  background: rgba(102, 126, 234, 0.05);
  border-radius: 16px;
  color: #6b7280;
}

.article-card {
  background: white;
  padding: 24px;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.article-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 25px rgba(0, 0, 0, 0.08);
}

.article-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.article-title {
  font-size: 18px;
  font-weight: 600;
  margin: 0;
}

.delete-btn {
  padding: 6px 12px;
  background: #fee2e2;
  color: #dc2626;
  border: none;
  border-radius: 8px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.delete-btn:hover {
  background: #fecaca;
}

.article-content {
  color: #4b5563;
  line-height: 1.6;
  margin-bottom: 12px;
}

.article-date {
  color: #9ca3af;
  font-size: 14px;
  margin: 0;
}

@media (prefers-color-scheme: dark) {
  .login-card {
    background: linear-gradient(135deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.9) 100%);
  }
  
  .login-title,
  .login-desc {
    color: #e2e8f0;
  }
  
  .password-input {
    background: rgba(51, 65, 85, 0.8);
    border-color: #475569;
    color: #e2e8f0;
  }
  
  .password-input::placeholder {
    color: #94a3b8;
  }
  
  .publish-form,
  .article-card {
    background: #1e293b;
  }
  
  .section-title,
  .article-title {
    color: #e2e8f0;
  }
  
  .article-content {
    color: #cbd5e1;
  }
  
  .article-date {
    color: #64748b;
  }
  
  .logout-btn {
    background: #334155;
    color: #cbd5e1;
  }
  
  .logout-btn:hover {
    background: #475569;
  }
  
  .form-input,
  .form-textarea {
    background: #334155;
    border-color: #475569;
    color: #e2e8f0;
  }
  
  .form-input::placeholder,
  .form-textarea::placeholder {
    color: #64748b;
  }
  
  .cancel-btn {
    background: #334155;
    color: #94a3b8;
  }
  
  .cancel-btn:hover {
    background: #475569;
  }
  
  .empty-state {
    background: rgba(129, 140, 248, 0.1);
    color: #94a3b8;
  }
}
</style>