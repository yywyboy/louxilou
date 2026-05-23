export interface BookChapter {
  id: string
  title: string
  cover: string
  status: string
  txtUrl: string
}

export interface Book {
  id: string
  title: string
  author: string
  cover: string
  description: string
  chapters: BookChapter[]
}

export const books: Book[] = [
  {
    id: 'kotenbu',
    title: '古典部系列',
    author: '米泽穗信',
    cover: '/books/images/kotenbu/temp.GIF',
    description: '以神山高中古典部为舞台的青春推理小说系列',
    chapters: [
      { id: '1', title: '冰菓', cover: '/books/images/kotenbu/temp.GIF', status: '已完结', txtUrl: '/books/kotenbu/txt/古典部系列1.txt' },
      { id: '2', title: '愚者的片尾', cover: '/books/images/kotenbu/temp 2.GIF', status: '已完结', txtUrl: '/books/kotenbu/txt/古典部系列2.txt' },
      { id: '3', title: '库特利亚芙卡的顺序', cover: '/books/images/kotenbu/temp 3.GIF', status: '已完结', txtUrl: '/books/kotenbu/txt/古典部系列3.txt' },
      { id: '4', title: '绕远路的雏人偶', cover: '/books/images/kotenbu/temp 4.GIF', status: '已完结', txtUrl: '/books/kotenbu/txt/古典部系列4.txt' },
      { id: '5', title: '两人距离的概算', cover: '/books/images/kotenbu/temp 5.GIF', status: '已完结', txtUrl: '/books/kotenbu/txt/古典部系列5.txt' },
      { id: '6', title: '迟来的翅膀', cover: '/books/images/kotenbu/temp 6.GIF', status: '已完结', txtUrl: '/books/kotenbu/txt/古典部系列6.txt' }
    ]
  },
  {
    id: 'mobitchi',
    title: '魔女之旅',
    author: '白石定规',
    cover: '/books/images/mobitchi/1.GIF',
    description: '讲述魔女伊蕾娜周游各国的故事',
    chapters: [
      { id: '1', title: '第1卷', cover: '/books/images/mobitchi/1.GIF', status: '已完结', txtUrl: '/books/mobitchi/txt/魔女之旅 1.txt' },
      { id: '2', title: '第2卷', cover: '/books/images/mobitchi/2.GIF', status: '已完结', txtUrl: '/books/mobitchi/txt/魔女之旅 2.txt' },
      { id: '3', title: '第3卷', cover: '/books/images/mobitchi/3.GIF', status: '已完结', txtUrl: '/books/mobitchi/txt/魔女之旅 3.txt' },
      { id: '4', title: '第4卷', cover: '/books/images/mobitchi/4.GIF', status: '已完结', txtUrl: '/books/mobitchi/txt/魔女之旅 4.txt' },
      { id: '5', title: '第5卷', cover: '/books/images/mobitchi/5.GIF', status: '已完结', txtUrl: '/books/mobitchi/txt/魔女之旅 5.txt' },
      { id: '6', title: '第6卷', cover: '/books/images/mobitchi/6.GIF', status: '已完结', txtUrl: '/books/mobitchi/txt/魔女之旅 6.txt' },
      { id: '7', title: '第7卷', cover: '/books/images/mobitchi/7.GIF', status: '已完结', txtUrl: '/books/mobitchi/txt/魔女之旅 7.txt' },
      { id: '8', title: '第8卷', cover: '/books/images/mobitchi/temp 8.GIF', status: '已完结', txtUrl: '/books/mobitchi/txt/魔女之旅 8.txt' },
      { id: '9', title: '第9卷', cover: '/books/images/mobitchi/temp 9.GIF', status: '已完结', txtUrl: '/books/mobitchi/txt/魔女之旅 9.txt' },
      { id: '10', title: '第10卷', cover: '/books/images/mobitchi/temp 10.GIF', status: '已完结', txtUrl: '/books/mobitchi/txt/魔女之旅 10.txt' },
      { id: '11', title: '第11卷', cover: '/books/images/mobitchi/temp 11.GIF', status: '已完结', txtUrl: '/books/mobitchi/txt/魔女之旅 11.txt' },
      { id: '12', title: '第12卷', cover: '/books/images/mobitchi/temp 12.GIF', status: '已完结', txtUrl: '/books/mobitchi/txt/魔女之旅12.txt' },
      { id: '13', title: '第13卷', cover: '/books/images/mobitchi/temp 13.GIF', status: '已完结', txtUrl: '/books/mobitchi/txt/魔女之旅13.txt' },
      { id: '14', title: '第14卷', cover: '/books/images/mobitchi/temp 14.GIF', status: '已完结', txtUrl: '/books/mobitchi/txt/魔女之旅14.txt' },
      { id: '15', title: '第15卷', cover: '/books/images/mobitchi/temp 15.GIF', status: '已完结', txtUrl: '/books/mobitchi/txt/魔女之旅15.txt' },
      { id: '16', title: '第16卷', cover: '/books/images/mobitchi/temp 16.GIF', status: '已完结', txtUrl: '/books/mobitchi/txt/魔女之旅16.txt' },
      { id: '17', title: '第17卷', cover: '/books/images/mobitchi/temp 17.GIF', status: '已完结', txtUrl: '/books/mobitchi/txt/魔女之旅17.txt' },
      { id: '18', title: '第18卷', cover: '/books/images/mobitchi/temp 18.GIF', status: '已完结', txtUrl: '/books/mobitchi/txt/魔女之旅18.txt' },
      { id: '19', title: '第19卷', cover: '/books/images/mobitchi/temp 19.GIF', status: '已完结', txtUrl: '/books/mobitchi/txt/魔女之旅19.txt' },
      { id: '20', title: '第20卷', cover: '/books/images/mobitchi/temp 20.GIF', status: '已完结', txtUrl: '/books/mobitchi/txt/魔女之旅20.txt' },
      { id: '21', title: '第21卷', cover: '/books/images/mobitchi/temp 21.GIF', status: '已完结', txtUrl: '/books/mobitchi/txt/魔女之旅21.txt' },
      { id: '22', title: '第22卷', cover: '/books/images/mobitchi/temp 22.GIF', status: '已完结', txtUrl: '/books/mobitchi/txt/魔女之旅22.txt' },
      { id: '23', title: '第23卷', cover: '/books/images/mobitchi/temp 23.GIF', status: '已完结', txtUrl: '/books/mobitchi/txt/魔女之旅 23.txt' },
      { id: '24', title: '第24卷', cover: '/books/images/mobitchi/temp 24.GIF', status: '已完结', txtUrl: '/books/mobitchi/txt/魔女之旅 24.txt' },
      { id: '学院', title: '魔女之旅学院', cover: '/books/images/mobitchi/temp.GIF', status: '已完结', txtUrl: '/books/mobitchi/txt/魔女之旅学院.txt' },
      { id: '学院物语', title: '魔女之旅学院物语', cover: '/books/images/mobitchi/temp.GIF', status: '已完结', txtUrl: '/books/mobitchi/txt/魔女之旅学院物语.txt' },
      { id: '番外', title: '番外', cover: '/books/images/mobitchi/temp.GIF', status: '已完结', txtUrl: '/books/mobitchi/txt/魔女之旅番外.txt' },
      { id: '短篇', title: '短篇', cover: '/books/images/mobitchi/temp.GIF', status: '已完结', txtUrl: '/books/mobitchi/txt/魔女之旅短篇.txt' },
      { id: '短篇集', title: '短篇集', cover: '/books/images/mobitchi/temp.GIF', status: '已完结', txtUrl: '/books/mobitchi/txt/魔女之旅短篇集.txt' }
    ]
  },
  {
    id: 'xiaoshimin',
    title: '小市民系列',
    author: '米泽穗信',
    cover: '/books/images/xiaoshimin/IMG_0106.JPG',
    description: '以小市民为主题的推理小说系列',
    chapters: [
      { id: '1', title: '春季限定草莓塔事件', cover: '/books/images/xiaoshimin/temp.gif', status: '已完结', txtUrl: '/books/xiaoshimin/txt/春季限定草莓塔事件.txt' },
      { id: '2', title: '夏季限定热带水果百汇事件', cover: '/books/images/xiaoshimin/temp(1).gif', status: '已完结', txtUrl: '/books/xiaoshimin/txt/夏季限定热带水果百汇事件.txt' },
      { id: '3', title: '秋季限定栗金饨事件(上)', cover: '/books/images/xiaoshimin/temp(2).gif', status: '已完结', txtUrl: '/books/xiaoshimin/txt/秋季限定栗金饨事件(上).txt' },
      { id: '4', title: '秋季限定栗金饨事件(下)', cover: '/books/images/xiaoshimin/temp(3).gif', status: '已完结', txtUrl: '/books/xiaoshimin/txt/秋季限定栗金饨事件(下).txt' },
      { id: '5', title: '冬季限定法式巧克力事件', cover: '/books/images/xiaoshimin/temp(4).gif', status: '已完结', txtUrl: '/books/xiaoshimin/txt/冬季限定法式巧克力事件.txt' },
      { id: '6', title: '巴黎马卡龙之谜', cover: '/books/images/xiaoshimin/temp(5).gif', status: '已完结', txtUrl: '/books/xiaoshimin/txt/巴黎马卡龙之谜.txt' }
    ]
  }
]

export function getBookById(id: string): Book | undefined {
  return books.find(book => book.id === id)
}

export function getBooksByAuthor(author: string): Book[] {
  return books.filter(book => book.author.includes(author))
}
