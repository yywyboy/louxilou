export interface BookChapter {
  id: string
  title: string
  status: string
  cover: string
  txtUrl: string
  epubUrl: string
}

export interface Book {
  id: string
  title: string
  author: string
  cover: string
  description: string
  chapters: BookChapter[]
  txtZipUrl?: string
  epubZipUrl?: string
}

export const books: Book[] = [
  {
    id: 'shiaimin',
    title: '小市民系列',
    author: '米泽穗信',
    cover: '/books/images/xiaoshimin/IMG_0106.JPG',
    description: '高中生小鸠常悟朗与小佐内由纪既不算是情侣，也不是相互依赖的关系。他们本着互利互惠、各取所需的原则结盟，朝着平凡小市民的目标努力。然而，二人身边却接二连三出现一个又一个谜团。虽然小鸠不想让自己像名侦探那样被瞩目，可一遇到谜题就忍不住想立刻解开，那他到底能不能成为名副其实的小市民呢？',
    txtZipUrl: '/books/xiaoshimin/txt/小市民系列TXT.zip',
    epubZipUrl: '/books/xiaoshimin/epub/小市民系列EPUB.zip',
    chapters: [
      {
        id: 'spring',
        title: '春季限定草莓挞事件',
        status: '已完结',
        cover: '/books/images/xiaoshimin/temp.gif',
        txtUrl: '/books/xiaoshimin/txt/春季限定草莓塔事件.txt',
        epubUrl: '/books/xiaoshimin/epub/春季限定草莓塔事件.epub'
      },
      {
        id: 'summer',
        title: '夏季限定热带水果芭菲事件',
        status: '已完结',
        cover: '/books/images/xiaoshimin/temp(5).gif',
        txtUrl: '/books/xiaoshimin/txt/夏季限定热带水果百汇事件.txt',
        epubUrl: '/books/xiaoshimin/epub/夏季限定热带水果百汇事件.epub'
      },
      {
        id: 'autumn-1',
        title: '秋季限定栗金饨事件（上）',
        status: '已完结',
        cover: '/books/images/xiaoshimin/temp(4).gif',
        txtUrl: '/books/xiaoshimin/txt/秋季限定栗金饨事件(上).txt',
        epubUrl: '/books/xiaoshimin/epub/秋季限定栗金饨事件(上).epub'
      },
      {
        id: 'autumn-2',
        title: '秋季限定栗金饨事件（下）',
        status: '已完结',
        cover: '/books/images/xiaoshimin/temp(3).gif',
        txtUrl: '/books/xiaoshimin/txt/秋季限定栗金饨事件(下).txt',
        epubUrl: '/books/xiaoshimin/epub/秋季限定栗金饨事件(下).epub'
      },
      {
        id: 'paris',
        title: '巴黎马卡龙之谜',
        status: '已完结',
        cover: '/books/images/xiaoshimin/temp(2).gif',
        txtUrl: '/books/xiaoshimin/txt/巴黎马卡龙之谜.txt',
        epubUrl: '/books/xiaoshimin/epub/巴黎马卡龙之谜.epub'
      },
      {
        id: 'winter',
        title: '冬季限定法式巧克力事件',
        status: '已完结',
        cover: '/books/images/xiaoshimin/temp(1).gif',
        txtUrl: '/books/xiaoshimin/txt/冬季限定法式巧克力事件.txt',
        epubUrl: '/books/xiaoshimin/epub/冬季限定法式巧克力事件.epub'
      }
    ]
  },
  {
    id: 'mobitchi',
    title: '魔女之旅',
    author: '白石定规',
    cover: '/books/images/mobitchi/temp.GIF',
    description: '某个地方有一位魔女，她的名字叫伊蕾娜。她是一位旅行者，以见证世界的美丽为己任，驾驶着扫帚在天空中自由飞翔。她走过了各种各样的国家，遇到了形形色色的人们，经历了各种各样的故事。这是关于一位魔女在旅途中所见所闻的故事。',
    txtZipUrl: '/books/mobitchi/txt/魔女之旅全部TXT.zip',
    epubZipUrl: '/books/mobitchi/epub/魔女之旅全部EPUB.zip',
    chapters: [
      {
        id: 'vol1',
        title: '魔女之旅 第1卷',
        status: '已完结',
        cover: '/books/images/mobitchi/1.GIF',
        txtUrl: '/books/mobitchi/txt/魔女之旅 1.txt',
        epubUrl: '/books/mobitchi/epub/魔女之旅 1.epub'
      },
      {
        id: 'vol2',
        title: '魔女之旅 第2卷',
        status: '已完结',
        cover: '/books/images/mobitchi/2.GIF',
        txtUrl: '/books/mobitchi/txt/魔女之旅 2.txt',
        epubUrl: '/books/mobitchi/epub/魔女之旅 2.epub'
      },
      {
        id: 'vol3',
        title: '魔女之旅 第3卷',
        status: '已完结',
        cover: '/books/images/mobitchi/3.GIF',
        txtUrl: '/books/mobitchi/txt/魔女之旅 3.txt',
        epubUrl: '/books/mobitchi/epub/魔女之旅 3.epub'
      },
      {
        id: 'vol4',
        title: '魔女之旅 第4卷',
        status: '已完结',
        cover: '/books/images/mobitchi/4.GIF',
        txtUrl: '/books/mobitchi/txt/魔女之旅 4.txt',
        epubUrl: '/books/mobitchi/epub/魔女之旅 4.epub'
      },
      {
        id: 'vol5',
        title: '魔女之旅 第5卷',
        status: '已完结',
        cover: '/books/images/mobitchi/5.GIF',
        txtUrl: '/books/mobitchi/txt/魔女之旅 5.txt',
        epubUrl: '/books/mobitchi/epub/魔女之旅 5.epub'
      },
      {
        id: 'side',
        title: '魔女之旅番外',
        status: '已完结',
        cover: '/books/images/mobitchi/temp 2.GIF',
        txtUrl: '/books/mobitchi/txt/魔女之旅番外.txt',
        epubUrl: '/books/mobitchi/epub/魔女之旅番外.epub'
      }
    ]
  },
  {
    id: 'kotenbu',
    title: '古典部系列',
    author: '米泽穗信',
    cover: '/books/images/kotenbu/temp 8.GIF',
    description: '神山高中古典部的成员折木奉太郎，是一个崇尚节能主义的高中生。他因为姐姐的命令而加入了濒临废部的古典部，遇到了好奇心旺盛的少女千反田爱瑠。从此，他的平淡生活被打破，开始了一段段充满谜题的校园生活。',
    txtZipUrl: '/books/kotenbu/txt/古典部系列全部TXT.zip',
    epubZipUrl: '/books/kotenbu/epub/古典部系列全部EPUB.zip',
    chapters: [
      {
        id: 'hyouka',
        title: '冰菓',
        status: '已完结',
        cover: '/books/images/kotenbu/temp.GIF',
        txtUrl: '/books/kotenbu/txt/古典部系列1.txt',
        epubUrl: '/books/kotenbu/epub/古典部系列1.epub'
      },
      {
        id: 'futaribun',
        title: '愚者的片尾',
        status: '已完结',
        cover: '/books/images/kotenbu/temp 2.GIF',
        txtUrl: '/books/kotenbu/txt/古典部系列2.txt',
        epubUrl: '/books/kotenbu/epub/古典部系列2.epub'
      },
      {
        id: 'kaku',
        title: '库特利亚芙卡的排序',
        status: '已完结',
        cover: '/books/images/kotenbu/temp 3.GIF',
        txtUrl: '/books/kotenbu/txt/古典部系列3.txt',
        epubUrl: '/books/kotenbu/epub/古典部系列3.epub'
      },
      {
        id: 'yume',
        title: '绕远路的雏人偶',
        status: '已完结',
        cover: '/books/images/kotenbu/temp 4.GIF',
        txtUrl: '/books/kotenbu/txt/古典部系列4.txt',
        epubUrl: '/books/kotenbu/epub/古典部系列4.epub'
      },
      {
        id: 'matsu',
        title: '两人距离的概算',
        status: '已完结',
        cover: '/books/images/kotenbu/temp 5.GIF',
        txtUrl: '/books/kotenbu/txt/古典部系列5.txt',
        epubUrl: '/books/kotenbu/epub/古典部系列5.epub'
      },
      {
        id: 'tsubasa',
        title: '迟来的翅膀',
        status: '已完结',
        cover: '/books/images/kotenbu/temp 6.GIF',
        txtUrl: '/books/kotenbu/txt/古典部系列6.txt',
        epubUrl: '/books/kotenbu/epub/古典部系列6.epub'
      }
    ]
  }
]

export const getBookById = (id: string): Book | undefined => {
  return books.find(book => book.id === id)
}

export const searchBooks = (keyword: string): Book[] => {
  const lowerKeyword = keyword.toLowerCase()
  return books.filter(book => 
    book.title.toLowerCase().includes(lowerKeyword) ||
    book.author.toLowerCase().includes(lowerKeyword)
  )
}