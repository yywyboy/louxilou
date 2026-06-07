/**
 * 设置 R2 Bucket 的 CORS 规则
 * 用法: node scripts/set-r2-cors.mjs
 */

import { createHash, createHmac } from 'crypto'
import https from 'https'

const ACCOUNT_ID = 'fe43d67a052aba3d1f30e4397675db9e'
const ACCESS_KEY_ID = '91db861f2bd1f8d74ee23cf5c3d2e811'
const SECRET_ACCESS_KEY = '3f8b618ab1b39af4919d162914790e236d9d7354f090e60533b58ef0a7f42507'
const BUCKET = 'louxilou'
const HOST = `${ACCOUNT_ID}.r2.cloudflarestorage.com`
const REGION = 'auto'

function sha256(data) { return createHash('sha256').update(data).digest('hex') }
function hmac(key, data) { return createHmac('sha256', key).update(data).digest() }
function signingKey(secret, ds) { return hmac(hmac(hmac(hmac(`AWS4${secret}`, ds), REGION), 's3'), 'aws4_request') }

const corsConfig = `<?xml version="1.0" encoding="UTF-8"?>
<CORSConfiguration>
  <CORSRule>
    <AllowedOrigin>https://louxilou.com.cn</AllowedOrigin>
    <AllowedMethod>GET</AllowedMethod>
    <AllowedMethod>HEAD</AllowedMethod>
    <AllowedHeader>*</AllowedHeader>
    <MaxAgeSeconds>86400</MaxAgeSeconds>
  </CORSRule>
</CORSConfiguration>`

async function main() {
  const body = Buffer.from(corsConfig)
  const payloadHash = sha256(body)

  const now = new Date()
  const raw = now.toISOString().replace(/\.\d{3}Z$/, 'Z')
  const ds = raw.slice(0, 10).replace(/-/g, '')
  const amzDate = `${ds}T${raw.slice(11, 19).replace(/:/g, '')}Z`

  const canonicalUri = `/${BUCKET}`
  const canonicalQueryString = 'cors='
  const signedHeaders = 'content-type;host;x-amz-content-sha256;x-amz-date'
  const canonicalHeaders = `content-type:application/xml\nhost:${HOST}\nx-amz-content-sha256:${payloadHash}\nx-amz-date:${amzDate}\n`

  const canonicalRequest = ['PUT', canonicalUri, canonicalQueryString, canonicalHeaders, signedHeaders, payloadHash].join('\n')
  const credentialScope = `${ds}/${REGION}/s3/aws4_request`
  const stringToSign = `AWS4-HMAC-SHA256\n${amzDate}\n${credentialScope}\n${sha256(canonicalRequest)}`
  const signature = hmac(signingKey(SECRET_ACCESS_KEY, ds), stringToSign).toString('hex')
  const auth = `AWS4-HMAC-SHA256 Credential=${ACCESS_KEY_ID}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`

  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname: HOST, port: 443,
      path: `/${BUCKET}?cors`,
      method: 'PUT',
      headers: {
        'Content-Type': 'application/xml',
        'Content-Length': body.length,
        'Host': HOST,
        'x-amz-content-sha256': payloadHash,
        'x-amz-date': amzDate,
        'Authorization': auth,
      },
    }, res => {
      let d = ''
      res.on('data', c => d += c)
      res.on('end', () => {
        if (res.statusCode === 200) {
          console.log('✅ CORS 配置成功！')
        } else {
          console.error(`❌ 失败 (${res.statusCode}): ${d}`)
        }
        resolve()
      })
    })
    req.on('error', reject)
    req.write(body)
    req.end()
  })
}

main().catch(console.error)
