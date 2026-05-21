<template>
  <div class="contact-container">
    <div class="page-header">
      <h1>📮 联系我</h1>
      <p>欢迎通过以下方式与我取得联系</p>
    </div>

    <div class="contact-grid">
      <div class="contact-card email">
        <div class="contact-icon">📧</div>
        <div class="contact-info">
          <h3>电子邮箱</h3>
          <a :href="'mailto:' + contactInfo.email" class="contact-link">
            {{ contactInfo.email }}
          </a>
        </div>
      </div>

      <div class="contact-card phone">
        <div class="contact-icon">📱</div>
        <div class="contact-info">
          <h3>电话号码</h3>
          <a :href="'tel:' + contactInfo.phone" class="contact-link">
            {{ contactInfo.phone }}
          </a>
        </div>
      </div>

      <div class="contact-card bilibili">
        <div class="contact-icon">📺</div>
        <div class="contact-info">
          <h3>B站账号</h3>
          <a :href="contactInfo.bilibili" target="_blank" rel="noopener noreferrer" class="contact-link">
            {{ contactInfo.bilibiliName }}
          </a>
        </div>
      </div>

      <div class="contact-card acfun">
        <div class="contact-icon">🎮</div>
        <div class="contact-info">
          <h3>A站账号</h3>
          <a :href="contactInfo.acfun" target="_blank" rel="noopener noreferrer" class="contact-link">
            {{ contactInfo.acfunName }}
          </a>
        </div>
      </div>

      <div class="contact-card github">
        <div class="contact-icon">💻</div>
        <div class="contact-info">
          <h3>GitHub</h3>
          <a :href="contactInfo.github" target="_blank" rel="noopener noreferrer" class="contact-link">
            {{ contactInfo.githubName }}
          </a>
        </div>
      </div>

      <div class="contact-card weibo">
        <div class="contact-icon">📡</div>
        <div class="contact-info">
          <h3>微博</h3>
          <a :href="contactInfo.weibo" target="_blank" rel="noopener noreferrer" class="contact-link">
            {{ contactInfo.weiboName }}
          </a>
        </div>
      </div>
    </div>

    <div class="message-section">
      <h2>💬 给我留言</h2>
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
          <textarea id="content" v-model="message.content" placeholder="请输入你想说的话..." rows="4"></textarea>
        </div>
        <button type="submit" class="submit-btn">发送留言</button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'

const contactInfo = {
  email: 'contact@louxilou.com',
  phone: '138-0000-0000',
  bilibili: 'https://space.bilibili.com/12345678',
  bilibiliName: '@楼西楼louxilou',
  acfun: 'https://www.acfun.cn/u/12345678',
  acfunName: '@楼西楼louxilou',
  github: 'https://github.com/yywyboy',
  githubName: '@yywyboy',
  weibo: 'https://weibo.com/louxilou',
  weiboName: '@楼西楼louxilou'
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

.contact-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  max-width: 1200px;
  margin: 0 auto 3rem;
  padding: 0 1rem;
}

.contact-card {
  background: var(--card-bg, #ffffff);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: var(--image-shadow, 0 4px 16px rgba(0, 0, 0, 0.08));
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.contact-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.contact-icon {
  font-size: 2.5rem;
  width: 70px;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 14px;
}

.email .contact-icon {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.phone .contact-icon {
  background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
}

.bilibili .contact-icon {
  background: linear-gradient(135deg, #fb7299 0%, #f5576c 100%);
}

.acfun .contact-icon {
  background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%);
}

.github .contact-icon {
  background: linear-gradient(135deg, #434343 0%, #000000 100%);
}

.weibo .contact-icon {
  background: linear-gradient(135deg, #e6162d 0%, #ff4d4f 100%);
}

.contact-info h3 {
  font-size: 1rem;
  color: var(--text-secondary, #666666);
  margin-bottom: 0.25rem;
  font-weight: 500;
}

.contact-link {
  font-size: 1.1rem;
  color: var(--text-color, #1a1a1a);
  text-decoration: none;
  font-weight: 600;
  transition: color 0.3s ease;
}

.contact-link:hover {
  color: #667eea;
}

.message-section {
  max-width: 600px;
  margin: 0 auto;
  padding: 0 1rem;
}

.message-section h2 {
  text-align: center;
  font-size: 1.8rem;
  margin-bottom: 2rem;
  color: var(--text-color, #1a1a1a);
}

.message-form {
  background: var(--card-bg, #ffffff);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 2rem;
  box-shadow: var(--image-shadow, 0 4px 16px rgba(0, 0, 0, 0.08));
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  font-size: 0.9rem;
  color: var(--text-secondary, #666666);
  margin-bottom: 0.5rem;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 0.875rem 1rem;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  font-size: 1rem;
  background: transparent;
  color: var(--text-color, #1a1a1a);
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-group textarea {
  resize: vertical;
  min-height: 100px;
}

.submit-btn {
  width: 100%;
  padding: 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #ffffff;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(102, 126, 234, 0.4);
}

[data-theme="dark"] .contact-card,
[data-theme="dark"] .message-form {
  background: rgba(30, 30, 40, 0.8);
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
</style>
