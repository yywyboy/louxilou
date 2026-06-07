/**
 * 将 R2 上 xiaoshimin/ 下的 txt 文件上传到 小市民系列/
 * 下载 → 重新上传（避免 copy API 编码问题）
 */

import { createHash, createHmac } from 'crypto'
import https from 'https'

const ACCOUNT_ID = process.env.R2_ACCOUNT_ID
const ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID
const SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY
const BUCKET = 'louxilou'
const HOST = `${ACCOUNT_ID}.r2.cloudflarestorage.com`
const REGION = 'auto'

function sha256(data) { return createHash('sha256').update(data).digest('hex') }
function hmac256(key, data) { return createHmac('sha256', key).update(data).digest() }
function signingKey(secret, ds) { return hmac256(hmac256(hmac256(hmac256(`AWS4${secret}`, ds), REGION), 's3'), 'aws4_request') }

function encodeSegment(s) {
  return encodeURIComponent(s).replace(/[!'()*]/g, c => '%' + c.charCodeAt(0).toString(16).toUpperCase())
}

function encodeKey(key) {
  return key.split('/').map(encodeSegment).join('/')
}

function downloadFile(key) {
  const path = `/${BUCKET}/${encodeKey(key)}`
  const now = new Date()
  const raw = now.toISOString().replace(/\.\d{3}Z$/, 'Z')
  const ds = raw.slice(0, 10).replace(/-/g, '')
  const amzDate = `${ds}T${raw.slice(11, 19).replace(/:/g, '')}Z`

  const signedHeaders = 'host;x-amz-content-sha256;x-amz-date'
  const canonicalHeaders = `host:${HOST}\nx-amz-content-sha256:UNSIGNED-PAYLOAD\nx-amz-date:${amzDate}\n`
  const canonicalRequest = ['GET', path, '', canonicalHeaders, signedHeaders, 'UNSIGNED-PAYLOAD'].join('\n')
  const credentialScope = `${ds}/${REGION}/s3/aws4_request`
  const stringToSign = `AWS4-HMAC-SHA256\n${amzDate}\n${credentialScope}\n${sha256(canonicalRequest)}`
  const signature = hmac256(signingKey(SECRET_ACCESS_KEY, ds), stringToSign).toString('hex')
  const auth = `AWS4-HMAC-SHA256 Credential=${ACCESS_KEY_ID}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`

  return new Promise((resolve, reject) => {
    https.get(`https://${HOST}${path}`, {
      headers: {
        'Host': HOST,
        'x-amz-content-sha256': 'UNSIGNED-PAYLOAD',
        'x-amz-date': amzDate,
        'Authorization': auth,
      },
    }, res => {
      if (res.statusCode !== 200) { reject(new Error(`Download ${res.statusCode}`)); return }
      const chunks = []
      res.on('data', c => chunks.push(c))
      res.on('end', () => resolve(Buffer.concat(chunks)))
    }).on('error', reject)
  })
}

function uploadFile(key, body) {
  const path = `/${BUCKET}/${encodeKey(key)}`
  const contentType = 'text/plain; charset=utf-8'
  const payloadHash = sha256(body)

  const now = new Date()
  const raw = now.toISOString().replace(/\.\d{3}Z$/, 'Z')
  const ds = raw.slice(0, 10).replace(/-/g, '')
  const amzDate = `${ds}T${raw.slice(11, 19).replace(/:/g, '')}Z`

  const signedHeaders = 'content-type;host;x-amz-content-sha256;x-amz-date'
  const canonicalHeaders = `content-type:${contentType}\nhost:${HOST}\nx-amz-content-sha256:${payloadHash}\nx-amz-date:${amzDate}\n`
  const canonicalRequest = ['PUT', path, '', canonicalHeaders, signedHeaders, payloadHash].join('\n')
  const credentialScope = `${ds}/${REGION}/s3/aws4_request`
  const stringToSign = `AWS4-HMAC-SHA256\n${amzDate}\n${credentialScope}\n${sha256(canonicalRequest)}`
  const signature = hmac256(signingKey(SECRET_ACCESS_KEY, ds), stringToSign).toString('hex')
  const auth = `AWS4-HMAC-SHA256 Credential=${ACCESS_KEY_ID}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`

  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname: HOST, port: 443, path, method: 'PUT',
      headers: {
        'Content-Type': contentType,
        'Content-Length': body.length,
        'Host': HOST,
        'x-amz-content-sha256': payloadHash,
        'x-amz-date': amzDate,
        'Authorization': auth,
      },
    }, res => {
      let d = ''
      res.on('data', c => d += c)
      res.on('end', () => res.statusCode === 200 ? resolve(true) : reject(new Error(`Upload ${res.statusCode}: ${d.slice(0, 200)}`)))
    })
    req.on('error', reject)
    req.write(body)
    req.end()
  })
}

const FILES = [
  ['春季限定草莓塔事件.txt', '春季限定草莓塔事件.txt'],
  ['夏季限定热带水果百汇事件.txt', '夏季限定热带水果百汇事件.txt'],
  ['秋季限定栗金饨事件上.txt', '秋季限定栗金饨事件(上).txt'],
  ['秋季限定栗金饨事件下.txt', '秋季限定栗金饨事件(下).txt'],
  ['冬季限定法式巧克力事件.txt', '冬季限定法式巧克力事件.txt'],
  ['巴黎马卡龙之谜.txt', '巴黎马卡龙之谜.txt'],
]

async function main() {
  console.log('📦 xiaoshimin/ → 小市民系列/ (download + re-upload)\n')
  let ok = 0, fail = 0
  for (const [src, dst] of FILES) {
    const srcKey = `books/texts/xiaoshimin/${src}`
    const dstKey = `books/texts/小市民系列/${dst}`
    try {
      const body = await downloadFile(srcKey)
      await uploadFile(dstKey, body)
      ok++
      console.log(`  ✅ ${src} → ${dst} (${body.length} bytes)`)
    } catch (err) {
      fail++
      console.log(`  ❌ ${src} → ${dst}: ${err.message}`)
    }
  }
  console.log(`\n📊 完成: ${ok} 成功, ${fail} 失败`)
}

main().catch(console.error)
