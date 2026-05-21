<template>
  <div class="contact-container">
    <div class="page-header">
      <h1>📮 联系我</h1>
      <p>欢迎通过以下方式与我取得联系</p>
    </div>

    <div class="contact-layout">
      <div class="contact-info-section">
        <h2>联系方式</h2>
        <div class="contact-grid">
          <a :href="'mailto:' + contactInfo.email" class="contact-card email-card">
            <div class="contact-icon email-icon">📧</div>
            <span class="contact-label">邮箱</span>
          </a>

          <a :href="'tel:' + contactInfo.phone" class="contact-card phone-card">
            <div class="contact-icon phone-icon">📱</div>
            <span class="contact-label">电话</span>
          </a>

          <a :href="contactInfo.bilibili" target="_blank" rel="noopener noreferrer" class="contact-card bilibili-card">
            <div class="contact-icon bilibili-icon">�Bilibili</div>
            <span class="contact-label">bilibili</span>
          </a>

          <a :href="contactInfo.acfun" target="_blank" rel="noopener noreferrer" class="contact-card acfun-card">
            <div class="contact-icon acfun-icon">𝔸</div>
            <span class="contact-label">AcFun</span>
          </a>

          <a :href="contactInfo.github" target="_blank" rel="noopener noreferrer" class="contact-card github-card">
            <div class="contact-icon github-icon">
              <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
              </svg>
            </div>
            <span class="contact-label">GitHub</span>
          </a>

          <a :href="contactInfo.x" target="_blank" rel="noopener noreferrer" class="contact-card x-card">
            <div class="contact-icon x-icon">𝕏</div>
            <span class="contact-label">X</span>
          </a>

          <a :href="contactInfo.instagram" target="_blank" rel="noopener noreferrer" class="contact-card instagram-card">
            <div class="contact-icon instagram-icon">
              <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </div>
            <span class="contact-label">Instagram</span>
          </a>
        </div>
      </div>

      <div class="message-section">
        <h2>给我留言</h2>
        <form @submit.prevent="sendMessage" class="message-form">
          <div class="form-group">
            <label for="name">你的名字</label>
            <input type="text" id="name" v-model="message.name" placeholder="请输入你的名字" />
          </div>
          <div class="form-group">
            <label for="email">你的邮箱</label>
            <input type="email" id="email" v-model="message.email" placeholder="请输入你的邮箱" />
          </div>
          <div class="form-group">
            <label for="content">留言内容</label>
            <textarea id="content" v-model="message.content" placeholder="请输入你想说的话..." rows="5"></textarea>
          </div>
          <button type="submit" class="submit-btn">发送留言</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'

const contactInfo = {
  email: '17766710131@163.com',
  phone: '17766710131',
  bilibili: 'https://space.bilibili.com/603244446?spm_id_from=333.1007.0.0',
  acfun: 'https://www.acfun.cn/u/45238942',
  github: 'https://github.com/yywyboy',
  x: 'https://x.com/louxilou_',
  instagram: 'https://www.instagram.com/louxilou_?igsh=dzFjb3Nsc2Zjc2Qx'
}

const message = reactive({
  name: '',
  email: '',
  content: ''
})

const sendMessage = () => {
  if (!message.name || !message.email || !message.content) {
    alert('请填写完整信息')
    return
  }
  
  const subject = encodeURIComponent(`来自 ${message.name} 的留言`)
  const body = encodeURIComponent(
    `姓名：${message.name}\n邮箱：${message.email}\n\n留言内容：\n${message.content}`
  )
  
  window.location.href = `mailto:${contactInfo.email}?subject=${subject}&body=${body}`
}
</script>

<style scoped>
.contact-container {
  min-height: 100vh;
  padding: 2rem;
  background: var(--bg-color, #f8f9fa);
}

.page-header {
  text-align: center;
  margin-bottom: 3rem;
  padding: 2rem;
}

.page-header h1 {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  color: var(--text-color, #1a1a1a);
}

.page-header p {
  font-size: 1.1rem;
  color: var(--text-secondary, #666666);
}

.contact-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.contact-info-section {
  background: var(--card-bg, #ffffff);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 2rem;
  box-shadow: var(--image-shadow, 0 4px 16px rgba(0, 0, 0, 0.08));
  height: fit-content;
}

.contact-info-section h2,
.message-section h2 {
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  color: var(--text-color, #1a1a1a);
  padding-bottom: 0.75rem;
  border-bottom: 2px solid rgba(102, 126, 234, 0.2);
}

.contact-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
  gap: 1rem;
}

.contact-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem;
  background: var(--card-bg, #ffffff);
  border-radius: 16px;
  text-decoration: none;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.contact-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.contact-icon {
  width: 50px;
  height: 50px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  color: #fff;
  font-weight: bold;
}

.email-icon {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.phone-icon {
  background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
}

.bilibili-icon {
  background: linear-gradient(135deg, #fb7299 0%, #f5576c 100%);
  font-size: 0.9rem;
}

.acfun-icon {
  background: linear-gradient(135deg, #ff6b6b 0%, #feca57 100%);
  font-size: 1.4rem;
}

.github-icon {
  background: linear-gradient(135deg, #434343 0%, #000000 100%);
}

.x-icon {
  background: linear-gradient(135deg, #000000 0%, #333333 100%);
}

.instagram-icon {
  background: linear-gradient(135deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%);
}

.contact-label {
  font-size: 0.75rem;
  color: var(--text-secondary, #666666);
  font-weight: 500;
}

.message-section {
  background: var(--card-bg, #ffffff);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 2rem;
  box-shadow: var(--image-shadow, 0 4px 16px rgba(0, 0, 0, 0.08));
  height: fit-content;
}

.message-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-size: 0.9rem;
  color: var(--text-secondary, #666666);
  font-weight: 500;
}

.form-group input,
.form-group textarea {
  padding: 0.875rem 1rem;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  font-size: 1rem;
  background: transparent;
  color: var(--text-color, #1a1a1a);
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.15);
}

.form-group textarea {
  resize: vertical;
  min-height: 120px;
}

.submit-btn {
  padding: 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #ffffff;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  margin-top: 0.5rem;
}

.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

[data-theme="dark"] .contact-info-section,
[data-theme="dark"] .message-section {
  background: rgba(30, 30, 40, 0.8);
}

[data-theme="dark"] .contact-card {
  background: rgba(40, 40, 50, 0.8);
}

[data-theme="dark"] .form-group input,
[data-theme="dark"] .form-group textarea {
  border-color: rgba(255, 255, 255, 0.1);
}

[data-theme="dark"] .contact-label {
  color: var(--text-secondary, #a0a0b0);
}

@media (max-width: 900px) {
  .contact-layout {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
}

@media (max-width: 480px) {
  .contact-container {
    padding: 1rem;
  }

  .page-header {
    padding: 1rem;
    margin-bottom: 2rem;
  }

  .page-header h1 {
    font-size: 2rem;
  }

  .contact-info-section,
  .message-section {
    padding: 1.5rem;
  }

  .contact-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
