export interface Book {
  id: string
  title: string
  author: string
  cover: string
  description: string
  chapters: Chapter[]
}

export interface Chapter {
  id: string
  title: string
  content: string
}

export const books: Book[] = [
  {
    id: 'kotenbu',
    title: '古典部系列',
    author: '米泽穗信',
    cover: '/books/images/kotenbu/temp.GIF',
    description: '以神山高中古典部为舞台的青春推理小说系列',
    chapters: [
      { id: '1', title: '冰菓', content: '古典部系列第一卷' },
      { id: '2', title: '愚者的片尾', content: '古典部系列第二卷' },
      { id: '3', title: '库特利亚芙卡的顺序', content: '古典部系列第三卷' },
      { id: '4', title: '绕远路的雏人偶', content: '古典部系列第四卷' },
      { id: '5', title: '两人距离的概算', content: '古典部系列第五卷' },
      { id: '6', title: '迟来的翅膀', content: '古典部系列第六卷' }
    ]
  },
  {
    id: 'mobitchi',
    title: '魔女之旅',
    author: '白石定规',
    cover: '/books/images/mobitchi/1.GIF',
    description: '讲述魔女伊蕾娜周游各国的故事',
    chapters: [
      { id: '1', title: '第1卷', content: '魔女之旅第一卷' },
      { id: '2', title: '第2卷', content: '魔女之旅第二卷' },
      { id: '3', title: '第3卷', content: '魔女之旅第三卷' },
      { id: '4', title: '第4卷', content: '魔女之旅第四卷' },
      { id: '5', title: '第5卷', content: '魔女之旅第五卷' },
      { id: '6', title: '第6卷', content: '魔女之旅第六卷' },
      { id: '7', title: '第7卷', content: '魔女之旅第七卷' },
      { id: '8', title: '第8卷', content: '魔女之旅第八卷' },
      { id: '9', title: '第9卷', content: '魔女之旅第九卷' },
      { id: '10', title: '第10卷', content: '魔女之旅第十卷' },
      { id: '11', title: '第11卷', content: '魔女之旅第十一卷' },
      { id: '12', title: '第12卷', content: '魔女之旅第十二卷' },
      { id: '13', title: '第13卷', content: '魔女之旅第十三卷' },
      { id: '14', title: '第14卷', content: '魔女之旅第十四卷' },
      { id: '15', title: '第15卷', content: '魔女之旅第十五卷' },
      { id: '16', title: '第16卷', content: '魔女之旅第十六卷' },
      { id: '17', title: '第17卷', content: '魔女之旅第十七卷' },
      { id: '18', title: '第18卷', content: '魔女之旅第十八卷' },
      { id: '19', title: '第19卷', content: '魔女之旅第十九卷' },
      { id: '20', title: '第20卷', content: '魔女之旅第二十卷' },
      { id: '21', title: '第21卷', content: '魔女之旅第二十一卷' },
      { id: '22', title: '第22卷', content: '魔女之旅第二十二卷' },
      { id: '23', title: '第23卷', content: '魔女之旅第二十三卷' },
      { id: '24', title: '第24卷', content: '魔女之旅第二十四卷' },
      { id: '学院', title: '魔女之旅学院', content: '魔女之旅学院篇' },
      { id: '学院物语', title: '魔女之旅学院物语', content: '魔女之旅学院物语' },
      { id: '番外', title: '番外', content: '魔女之旅番外' },
      { id: '短篇', title: '短篇', content: '魔女之旅短篇' },
      { id: '短篇集', title: '短篇集', content: '魔女之旅短篇集' }
    ]
  },
  {
    id: 'xiaoshimin',
    title: '小市民系列',
    author: '米泽穗信',
    cover: '/books/images/xiaoshimin/IMG_0106.JPG',
    description: '以小市民为主题的推理小说系列',
    chapters: [
      { id: '1', title: '春季限定草莓塔事件', content: '小市民系列第一卷' },
      { id: '2', title: '夏季限定热带水果百汇事件', content: '小市民系列第二卷' },
      { id: '3', title: '秋季限定栗金饨事件(上)', content: '小市民系列第三卷上' },
      { id: '4', title: '秋季限定栗金饨事件(下)', content: '小市民系列第三卷下' },
      { id: '5', title: '冬季限定法式巧克力事件', content: '小市民系列第四卷' },
      { id: '6', title: '巴黎马卡龙之谜', content: '小市民系列第五卷' }
    ]
  }
]

export function getBookById(id: string): Book | undefined {
  return books.find(book => book.id === id)
}

export function getBooksByAuthor(author: string): Book[] {
  return books.filter(book => book.author.includes(author))
}
