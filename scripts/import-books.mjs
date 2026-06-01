import { readdirSync, statSync, mkdirSync, existsSync, readFileSync, writeFileSync } from 'fs'
import { join, basename, extname } from 'path'
import { execSync } from 'child_process'

const IMPORT_DIR = 'L:/import'
const BOOKS_DIR = 'L:/public/books'
const BOOKS_TS = 'L:/src/data/books.ts'
const COLORS = ['#E63946', '#457B9D', '#2A9D8F', '#E9C46A', '#F4A261', '#264653', '#6D597A', '#B56576', '#355070', '#EAAC8B']

function parseBookName(filename) {
  const name = basename(filename, extname(filename))
  const match = name.match(/^(.+?)\s*(\d+)$/)
  if (match) return { title: match[1].trim(), volume: match[2] }
  return { title: name, volume: null }
}

function generateCover(title, author, color, outPath) {
  const pyScript = `
from PIL import Image, ImageDraw, ImageFont
img = Image.new('RGB', (300, 400), '${color}')
draw = ImageDraw.Draw(img)
try:
    ft = ImageFont.truetype('msyh.ttc', 40)
    fa = ImageFont.truetype('msyh.ttc', 22)
except:
    ft = ImageFont.load_default()
    fa = ImageFont.load_default()
bbox = draw.textbbox((0, 0), '${title}', font=ft)
tw = bbox[2] - bbox[0]
draw.text(((300-tw)//2, 150), '${title}', fill='white', font=ft)
bbox2 = draw.textbbox((0, 0), '${author}', font=fa)
aw = bbox2[2] - bbox2[0]
draw.text(((300-aw)//2, 210), '${author}', fill='#ddd', font=fa)
draw.rectangle([(20, 20), (280, 380)], outline='white', width=2)
img.save('${outPath.replace(/\\/g, '\\\\')}', 'JPEG', quality=85)
`
  execSync(`python -c "${pyScript.replace(/"/g, '\\"')}"`, { stdio: 'pipe' })
}

console.log('=== 轻小说导入工具 ===\n')
console.log(`扫描目录: ${IMPORT_DIR}\n`)

if (!existsSync(IMPORT_DIR)) {
  mkdirSync(IMPORT_DIR, { recursive: true })
  console.log(`已创建导入目录: ${IMPORT_DIR}`)
  console.log('请将 TXT 文件放入该目录，文件名格式: "书名 卷号.txt" 或 "书名.txt"')
  console.log('示例: "刀剑神域 1.txt", "刀剑神域 2.txt"')
  process.exit(0)
}

const files = readdirSync(IMPORT_DIR).filter(f => extname(f).toLowerCase() === '.txt')

if (files.length === 0) {
  console.log('未找到 TXT 文件，请将轻小说 TXT 文件放入导入目录')
  console.log('文件名格式: "书名 卷号.txt" 或 "书名.txt"')
  process.exit(0)
}

const groups = {}
for (const file of files) {
  const { title, volume } = parseBookName(file)
  if (!groups[title]) groups[title] = []
  groups[title].push({ file, volume })
}

console.log(`发现 ${files.length} 个文件，${Object.keys(groups).length} 部作品:\n`)

const existingContent = readFileSync(BOOKS_TS, 'utf-8')
const existingIds = [...existingContent.matchAll(/id:\s*'([^']+)'/g)].map(m => m[1])

let colorIdx = 0
const newEntries = []

for (const [title, volumes] of Object.entries(groups)) {
  const bookId = title.replace(/\s+/g, '-').toLowerCase()
  if (existingIds.includes(bookId)) {
    console.log(`  跳过 (已存在): ${title}`)
    continue
  }

  const author = '待补充'
  const description = `${title} 轻小说系列`
  const color = COLORS[colorIdx % COLORS.length]
  colorIdx++

  const imgDir = join(BOOKS_DIR, 'images', bookId)
  const txtDir = join(BOOKS_DIR, bookId, 'txt')
  mkdirSync(imgDir, { recursive: true })
  mkdirSync(txtDir, { recursive: true })

  const coverPath = join(imgDir, 'cover.jpg')
  if (!existsSync(coverPath)) {
    generateCover(title, author, color, coverPath)
  }

  const chapters = volumes
    .sort((a, b) => {
      const na = parseInt(a.volume) || 0
      const nb = parseInt(b.volume) || 0
      return na - nb
    })
    .map((v, i) => {
      const src = join(IMPORT_DIR, v.file)
      const dest = join(txtDir, v.file)
      const srcContent = readFileSync(src)
      writeFileSync(dest, srcContent)
      return {
        id: String(i + 1),
        title: v.volume ? `第${v.volume}卷` : '全文',
        cover: `/books/images/${bookId}/cover.jpg`,
        status: '已完结',
        txtUrl: `/books/${bookId}/txt/${v.file}`
      }
    })

  newEntries.push({
    id: bookId,
    title,
    author,
    cover: `/books/images/${bookId}/cover.jpg`,
    description,
    chapters
  })

  console.log(`  导入: ${title} (${chapters.length} 卷)`)
}

if (newEntries.length === 0) {
  console.log('\n没有新书需要导入')
  process.exit(0)
}

const entriesStr = newEntries.map(book => `  {
    id: '${book.id}',
    title: '${book.title}',
    author: '${book.author}',
    cover: '${book.cover}',
    description: '${book.description}',
    chapters: [
${book.chapters.map(ch => `      { id: '${ch.id}', title: '${ch.title}', cover: '${ch.cover}', status: '${ch.status}', txtUrl: '${ch.txtUrl}' }`).join(',\n')}
    ]
  }`).join(',\n\n')

const updatedContent = existingContent.replace(
  /(\n\]\n\nexport function getBookById)/,
  `,\n${entriesStr}\n$1`
)

writeFileSync(BOOKS_TS, updatedContent)

console.log(`\n完成! 已导入 ${newEntries.length} 部作品到 books.ts`)
console.log('请替换自动生成的封面图: public/books/images/{bookId}/cover.jpg')
console.log('请修改作者信息: src/data/books.ts')
