<template>
  <div class="contact-container">
    <div class="page-header">
      <h1>📮 联系我</h1>
      <p>欢迎通过以下方式与我取得联系</p>
    </div>

    <div class="contact-grid">
      <div 
        class="contact-item email-item" 
        @click="copyToClipboard(contactInfo.email, 'email')"
      >
        <div class="contact-icon email-icon">📧</div>
        <div class="contact-info">
          <span class="contact-label">电子邮箱</span>
          <span class="contact-value">{{ contactInfo.email }}</span>
        </div>
        <div class="copy-hint">
          <svg v-if="copiedField !== 'email'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
          </svg>
          <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
      </div>

      <div 
        class="contact-item phone-item" 
        @click="copyToClipboard(contactInfo.phone, 'phone')"
      >
        <div class="contact-icon phone-icon">📱</div>
        <div class="contact-info">
          <span class="contact-label">电话号码</span>
          <span class="contact-value">{{ contactInfo.phone }}</span>
        </div>
        <div class="copy-hint">
          <svg v-if="copiedField !== 'phone'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
          </svg>
          <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
      </div>

      <a :href="contactInfo.bilibili" target="_blank" rel="noopener noreferrer" class="contact-icon-item">
        <div class="icon-wrapper bilibili-icon">
          <svg viewBox="0 0 24 24" fill="none" width="24" height="24">
            <rect x="3" y="3" width="18" height="18" rx="4" fill="#FB7299"/>
            <text x="12" y="17" font-family="Arial, sans-serif" font-size="10" font-weight="bold" fill="white" text-anchor="middle">B</text>
          </svg>
        </div>
        <span class="icon-label">bilibili</span>
      </a>

      <a :href="contactInfo.acfun" target="_blank" rel="noopener noreferrer" class="contact-icon-item">
        <div class="icon-wrapper acfun-icon">
          <svg viewBox="0 0 24 24" fill="none" width="24" height="24">
            <rect x="3" y="3" width="18" height="18" rx="4" fill="#FF6B6B"/>
            <text x="12" y="17" font-family="Arial, sans-serif" font-size="10" font-weight="bold" fill="white" text-anchor="middle">A</text>
          </svg>
        </div>
        <span class="icon-label">AcFun</span>
      </a>

      <a :href="contactInfo.douyin" target="_blank" rel="noopener noreferrer" class="contact-icon-item">
        <div class="icon-wrapper douyin-icon">
          <svg viewBox="0 0 24 24" fill="none" width="24" height="24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" fill="url(#douyinGradient)"/>
            <path d="M9.5 15.5c-.83 0-1.5-.67-1.5-1.5V9c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5v5c0 .83-.67 1.5-1.5 1.5z" fill="#fff"/>
            <path d="M14.5 15.5c-.83 0-1.5-.67-1.5-1.5v-2c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5v2c0 .83-.67 1.5-1.5 1.5z" fill="#fff"/>
            <circle cx="17" cy="7" r="1.5" fill="#fff"/>
            <defs>
              <linearGradient id="douyinGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#FE2C55"/>
                <stop offset="50%" stop-color="#F58529"/>
                <stop offset="100%" stop-color="#FF0050"/>
              </linearGradient>
            </defs>
          </svg>
        </div>
        <span class="icon-label">抖音</span>
      </a>

      <a :href="contactInfo.github" target="_blank" rel="noopener noreferrer" class="contact-icon-item">
        <div class="icon-wrapper github-icon">
          <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
          </svg>
        </div>
        <span class="icon-label">GitHub</span>
      </a>

      <a :href="contactInfo.x" target="_blank" rel="noopener noreferrer" class="contact-icon-item">
        <div class="icon-wrapper x-icon">
          <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
        </div>
        <span class="icon-label">X</span>
      </a>

      <a :href="contactInfo.instagram" target="_blank" rel="noopener noreferrer" class="contact-icon-item">
        <div class="icon-wrapper instagram-icon">
          <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
          </svg>
        </div>
        <span class="icon-label">Instagram</span>
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const contactInfo = {
  email: '17766710131@163.com',
  phone: '17766710131',
  bilibili: 'https://space.bilibili.com/603244446?spm_id_from=333.1007.0.0',
  acfun: 'https://www.acfun.cn/u/45238942',
  douyin: 'https://www.douyin.com/user/MS4wLjABAAAABe8u8MGYZKd631TZB7hWZwnGH2ZR1A5DyD2oTcgnLe4?from_tab_name=main',
  github: 'https://github.com/yywyboy',
  x: 'https://x.com/louxilou_',
  instagram: 'https://www.instagram.com/louxilou_?igsh=dzFjb3Nsc2Zjc2Qx'
}

const copiedField = ref<string | null>(null)

const copyToClipboard = async (text: string, field: string) => {
  try {
    await navigator.clipboard.writeText(text)
    copiedField.value = field
    
    setTimeout(() => {
      copiedField.value = null
    }, 2000)
  } catch (err) {
    console.error('复制失败:', err)
  }
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
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: auto auto auto;
  gap: 1.25rem;
  max-width: 900px;
  margin: 0 auto;
  padding: 0 1rem;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem 1.5rem;
  background: var(--card-bg, #ffffff);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
  position: relative;
}

.contact-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.email-item,
.phone-item {
  grid-column: 1 / -1;
}

.contact-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.3rem;
  color: #fff;
  font-weight: bold;
  flex-shrink: 0;
}

.email-icon {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.phone-icon {
  background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
}

.contact-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  flex: 1;
  min-width: 0;
}

.contact-label {
  font-size: 0.8rem;
  color: var(--text-secondary, #666666);
  font-weight: 500;
}

.contact-value {
  font-size: 1.05rem;
  color: var(--text-color, #1a1a1a);
  font-weight: 600;
  word-break: break-all;
}

.copy-hint {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary, #666666);
  transition: color 0.3s ease, transform 0.3s ease;
  padding: 0.5rem;
}

.contact-item:hover .copy-hint {
  color: #667eea;
}

.copy-hint svg {
  transition: transform 0.3s ease;
}

.contact-item:hover .copy-hint svg {
  transform: scale(1.1);
}

[data-theme="dark"] .copy-hint {
  color: var(--text-secondary, #a0a0b0);
}

[data-theme="dark"] .contact-item:hover .copy-hint {
  color: #7c8cff;
}

.contact-icon-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 1.25rem 1rem;
  background: var(--card-bg, #ffffff);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  text-decoration: none;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

.contact-icon-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.icon-wrapper {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--icon-bg, #f0f0f0);
}

.bilibili-icon {
  background: linear-gradient(135deg, #FB7299 0%, #F5576C 100%);
}

.acfun-icon {
  background: linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%);
}

.douyin-icon {
  background: transparent;
}

.github-icon {
  background: #171515;
  color: #fff;
}

.x-icon {
  background: #000000;
  color: #fff;
}

.instagram-icon {
  background: linear-gradient(135deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%);
  color: #fff;
}

.icon-label {
  font-size: 0.8rem;
  color: var(--text-secondary, #666666);
  font-weight: 500;
}

[data-theme="dark"] .contact-item,
[data-theme="dark"] .contact-icon-item {
  background: rgba(30, 30, 40, 0.85);
}

[data-theme="dark"] .contact-value {
  color: var(--text-color, #f0f0f5);
}

[data-theme="dark"] .icon-label {
  color: var(--text-secondary, #a0a0b0);
}

@media (max-width: 768px) {
  .contact-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .email-item,
  .phone-item {
    grid-column: 1 / -1;
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

  .contact-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .email-item,
  .phone-item {
    grid-column: 1;
  }

  .contact-item {
    padding: 1rem 1.25rem;
  }

  .contact-icon-item {
    flex-direction: row;
    justify-content: flex-start;
    padding: 1rem 1.25rem;
    gap: 1rem;
  }

  .icon-wrapper {
    width: 44px;
    height: 44px;
  }
}
</style>
