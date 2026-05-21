<template>
  <div class="contact-container">
    <div class="page-header">
      <h1>📮 联系我</h1>
      <p>欢迎通过以下方式与我取得联系</p>
    </div>

    <div class="contact-layout">
      <div class="contact-info-section">
        <h2>联系方式</h2>

        <div class="contact-item">
          <div class="contact-icon email-icon">📧</div>
          <div class="contact-details">
            <h3>电子邮箱</h3>
            <a :href="'mailto:' + contactInfo.email" class="contact-link">
              {{ contactInfo.email }}
            </a>
          </div>
        </div>

        <div class="contact-item">
          <div class="contact-icon phone-icon">📱</div>
          <div class="contact-details">
            <h3>电话号码</h3>
            <a :href="'tel:' + contactInfo.phone" class="contact-link">
              {{ contactInfo.phone }}
            </a>
          </div>
        </div>

        <div class="contact-item">
          <div class="contact-icon bilibili-icon">📺</div>
          <div class="contact-details">
            <h3>B站</h3>
            <a :href="contactInfo.bilibili" target="_blank" rel="noopener noreferrer" class="contact-link">
              {{ contactInfo.bilibili }}
            </a>
          </div>
        </div>

        <div class="contact-item">
          <div class="contact-icon acfun-icon">🎮</div>
          <div class="contact-details">
            <h3>AcFun</h3>
            <a :href="contactInfo.acfun" target="_blank" rel="noopener noreferrer" class="contact-link">
              {{ contactInfo.acfun }}
            </a>
          </div>
        </div>

        <div class="contact-item">
          <div class="contact-icon github-icon">💻</div>
          <div class="contact-details">
            <h3>GitHub</h3>
            <a :href="contactInfo.github" target="_blank" rel="noopener noreferrer" class="contact-link">
              {{ contactInfo.github }}
            </a>
          </div>
        </div>

        <div class="contact-item">
          <div class="contact-icon x-icon">𝕏</div>
          <div class="contact-details">
            <h3>X</h3>
            <a :href="contactInfo.x" target="_blank" rel="noopener noreferrer" class="contact-link">
              {{ contactInfo.x }}
            </a>
          </div>
        </div>

        <div class="contact-item">
          <div class="contact-icon instagram-icon">📸</div>
          <div class="contact-details">
            <h3>Instagram</h3>
            <a :href="contactInfo.instagram" target="_blank" rel="noopener noreferrer" class="contact-link">
              {{ contactInfo.instagram }}
            </a>
          </div>
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
  alert('留言已发送！感谢你的留言，我会尽快回复。')
  message.name = ''
  message.email = ''
  message.content = ''
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

.contact-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.contact-item:last-child {
  border-bottom: none;
}

.contact-icon {
  width: 50px;
  height: 50px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  flex-shrink: 0;
}

.email-icon {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.phone-icon {
  background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
}

.bilibili-icon {
  background: linear-gradient(135deg, #fb7299 0%, #f5576c 100%);
}

.acfun-icon {
  background: linear-gradient(135deg, #ff6b6b 0%, #feca57 100%);
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

.contact-details h3 {
  font-size: 0.85rem;
  color: var(--text-secondary, #666666);
  margin-bottom: 0.25rem;
  font-weight: 500;
}

.contact-link {
  font-size: 0.95rem;
  color: var(--text-color, #1a1a1a);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
  word-break: break-all;
}

.contact-link:hover {
  color: #667eea;
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

[data-theme="dark"] .contact-item {
  border-bottom-color: rgba(255, 255, 255, 0.05);
}

[data-theme="dark"] .form-group input,
[data-theme="dark"] .form-group textarea {
  border-color: rgba(255, 255, 255, 0.1);
}

[data-theme="dark"] .contact-link {
  color: var(--text-color, #f0f0f5);
}

[data-theme="dark"] .contact-link:hover {
  color: #7c8cff;
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
}
</style>
