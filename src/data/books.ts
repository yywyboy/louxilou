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
  tags: string[]
  chapters: BookChapter[]
}

export const BOOK_TAGS = [
  { id: 'light-novel', name: '轻小说' },
  { id: 'classic', name: '经典文学' },
  { id: 'novel', name: '长篇小说' },
  { id: 'short-story', name: '短篇集' },
  { id: 'drama', name: '戏剧' },
  { id: 'poetry', name: '诗歌' },
  { id: 'fairy-tale', name: '童话' },
  { id: 'detective', name: '推理' },
  { id: 'adventure', name: '冒险' },
  { id: 'romance', name: '爱情' },
  { id: 'philosophy', name: '哲学' },
  { id: 'dystopia', name: '反乌托邦' },
  { id: 'russian', name: '俄国文学' },
  { id: 'french', name: '法国文学' },
  { id: 'english', name: '英国文学' },
  { id: 'american', name: '美国文学' },
  { id: 'japanese', name: '日本文学' },
  { id: 'german', name: '德国文学' },
  { id: 'italian', name: '意大利文学' },
  { id: 'spanish', name: '西班牙文学' },
  { id: 'latin-american', name: '拉美文学' }
]

export const books: Book[] = [
  {
    id: '1984',
    title: '1984',
    author: '乔治·奥威尔',
    cover: '/books/images/1984/cover.jpg',
    description: '反乌托邦文学的巅峰之作，描绘一个极权统治下的恐怖未来世界',
    tags: ["classic","novel","dystopia","english"],
    chapters: [
    ]
  },
  {
    id: 'kotenbu',
    title: '古典部系列',
    author: '米泽穗信',
    cover: '/books/images/kotenbu/temp.GIF',
    description: '以神山高中古典部为舞台的青春推理小说系列',
    tags: ["light-novel","detective"],
    chapters: [
      { id: '1', title: '冰菓', cover: '/books/images/kotenbu/temp.GIF', status: '已完结', txtUrl: '/books/kotenbu/txt/古典部系列1.txt' },
      { id: '2', title: '愚者的片尾', cover: '/books/images/kotenbu/temp.GIF', status: '已完结', txtUrl: '/books/kotenbu/txt/古典部系列2.txt' },
      { id: '3', title: '库特利亚芙卡的排序', cover: '/books/images/kotenbu/temp.GIF', status: '已完结', txtUrl: '/books/kotenbu/txt/古典部系列3.txt' },
      { id: '4', title: '绕远路的雏偶', cover: '/books/images/kotenbu/temp.GIF', status: '已完结', txtUrl: '/books/kotenbu/txt/古典部系列4.txt' },
      { id: '5', title: '两人距离的概算', cover: '/books/images/kotenbu/temp.GIF', status: '已完结', txtUrl: '/books/kotenbu/txt/古典部系列5.txt' },
      { id: '6', title: '放眼不可理喻的未来', cover: '/books/images/kotenbu/temp.GIF', status: '已完结', txtUrl: '/books/kotenbu/txt/古典部系列6.txt' },
    ]
  },
  {
    id: 'mobitchi',
    title: '魔女之旅',
    author: '白石定规',
    cover: '/books/images/mobitchi/1.GIF',
    description: '讲述魔女伊蕾娜周游各国的故事',
    tags: ["light-novel","adventure"],
    chapters: [
      { id: '1', title: '第1卷', cover: '/books/images/mobitchi/1.GIF', status: '已完结', txtUrl: '/books/mobitchi/txt/魔女之旅 1.txt' },
      { id: '2', title: '第2卷', cover: '/books/images/mobitchi/2.GIF', status: '已完结', txtUrl: '/books/mobitchi/txt/魔女之旅 2.txt' },
      { id: '3', title: '第3卷', cover: '/books/images/mobitchi/3.GIF', status: '已完结', txtUrl: '/books/mobitchi/txt/魔女之旅 3.txt' },
      { id: '4', title: '第4卷', cover: '/books/images/mobitchi/4.GIF', status: '已完结', txtUrl: '/books/mobitchi/txt/魔女之旅 4.txt' },
      { id: '5', title: '第5卷', cover: '/books/images/mobitchi/5.GIF', status: '已完结', txtUrl: '/books/mobitchi/txt/魔女之旅 5.txt' },
      { id: '6', title: '第6卷', cover: '/books/images/mobitchi/6.GIF', status: '已完结', txtUrl: '/books/mobitchi/txt/魔女之旅 6.txt' },
      { id: '7', title: '第7卷', cover: '/books/images/mobitchi/7.GIF', status: '已完结', txtUrl: '/books/mobitchi/txt/魔女之旅 7.txt' },
      { id: '8', title: '第8卷', cover: '/books/images/mobitchi/8.GIF', status: '已完结', txtUrl: '/books/mobitchi/txt/魔女之旅 8.txt' },
      { id: '9', title: '第9卷', cover: '/books/images/mobitchi/9.GIF', status: '已完结', txtUrl: '/books/mobitchi/txt/魔女之旅 9.txt' },
      { id: '10', title: '第10卷', cover: '/books/images/mobitchi/10.GIF', status: '已完结', txtUrl: '/books/mobitchi/txt/魔女之旅 10.txt' },
      { id: '11', title: '第11卷', cover: '/books/images/mobitchi/11.GIF', status: '已完结', txtUrl: '/books/mobitchi/txt/魔女之旅 11.txt' },
      { id: '12', title: '第12卷', cover: '/books/images/mobitchi/12.GIF', status: '已完结', txtUrl: '/books/mobitchi/txt/魔女之旅 12.txt' },
      { id: '13', title: '第13卷', cover: '/books/images/mobitchi/13.GIF', status: '已完结', txtUrl: '/books/mobitchi/txt/魔女之旅 13.txt' },
      { id: '14', title: '第14卷', cover: '/books/images/mobitchi/14.GIF', status: '已完结', txtUrl: '/books/mobitchi/txt/魔女之旅 14.txt' },
      { id: '15', title: '第15卷', cover: '/books/images/mobitchi/15.GIF', status: '已完结', txtUrl: '/books/mobitchi/txt/魔女之旅 15.txt' },
      { id: '16', title: '第16卷', cover: '/books/images/mobitchi/16.GIF', status: '已完结', txtUrl: '/books/mobitchi/txt/魔女之旅 16.txt' },
      { id: '17', title: '第17卷', cover: '/books/images/mobitchi/17.GIF', status: '已完结', txtUrl: '/books/mobitchi/txt/魔女之旅 17.txt' },
      { id: '18', title: '第18卷', cover: '/books/images/mobitchi/18.GIF', status: '已完结', txtUrl: '/books/mobitchi/txt/魔女之旅 18.txt' },
      { id: '19', title: '第19卷', cover: '/books/images/mobitchi/19.GIF', status: '已完结', txtUrl: '/books/mobitchi/txt/魔女之旅 19.txt' },
      { id: '20', title: '第20卷', cover: '/books/images/mobitchi/20.GIF', status: '已完结', txtUrl: '/books/mobitchi/txt/魔女之旅 20.txt' },
      { id: '21', title: '第21卷', cover: '/books/images/mobitchi/21.GIF', status: '已完结', txtUrl: '/books/mobitchi/txt/魔女之旅 21.txt' },
    ]
  },
  {
    id: 'xiaoshimin',
    title: '小市民系列',
    author: '米泽穗信',
    cover: '/books/images/xiaoshimin/IMG_0106.JPG',
    description: '以小市民为主题的推理小说系列',
    tags: ["light-novel","detective"],
    chapters: [
      { id: '1', title: '春季限定草莓塔事件', cover: '/books/images/xiaoshimin/春季限定草莓塔事件.jpg', status: '已完结', txtUrl: '/books/xiaoshimin/txt/春季限定草莓塔事件.txt' },
      { id: '2', title: '夏季限定热带水果芭菲事件', cover: '/books/images/xiaoshimin/IMG_0107.JPG', status: '已完结', txtUrl: '/books/xiaoshimin/txt/夏季限定热带水果芭菲事件.txt' },
      { id: '3', title: '秋季限定栗金饨事件(上)', cover: '/books/images/xiaoshimin/IMG_0108.JPG', status: '已完结', txtUrl: '/books/xiaoshimin/txt/秋季限定栗金饨事件(上).txt' },
      { id: '4', title: '秋季限定栗金饨事件(下)', cover: '/books/images/xiaoshimin/temp(3).gif', status: '已完结', txtUrl: '/books/xiaoshimin/txt/秋季限定栗金饨事件(下).txt' },
      { id: '5', title: '冬季限定法式巧克力事件', cover: '/books/images/xiaoshimin/temp(4).gif', status: '已完结', txtUrl: '/books/xiaoshimin/txt/冬季限定法式巧克力事件.txt' },
      { id: '6', title: '巴黎马卡龙之谜', cover: '/books/images/xiaoshimin/temp(5).gif', status: '已完结', txtUrl: '/books/xiaoshimin/txt/巴黎马卡龙之谜.txt' },
    ]
  },
  {
    id: '三个火枪手',
    title: '三个火枪手',
    author: '大仲马',
    cover: '/books/images/三个火枪手/cover.jpg',
    description: '法国浪漫主义作家大仲马的代表作，讲述达达尼昂与三位火枪手的冒险故事',
    tags: ["classic","novel","adventure","french"],
    chapters: [
      { id: '1', title: '三个火枪手', cover: '/books/images/三个火枪手/cover.jpg', status: '已完结', txtUrl: '/books/三个火枪手/txt/三个火枪手.txt' },
    ]
  },
  {
    id: '了不起的盖茨比',
    title: '了不起的盖茨比',
    author: '菲茨杰拉德',
    cover: '/books/images/了不起的盖茨比/cover.jpg',
    description: '美国作家菲茨杰拉德的代表作，描绘美国梦的幻灭',
    tags: ["classic","novel","american"],
    chapters: [
      { id: '1', title: '了不起的盖茨比', cover: '/books/images/了不起的盖茨比/cover.jpg', status: '已完结', txtUrl: '/books/了不起的盖茨比/txt/了不起的盖茨比.txt' },
    ]
  },
  {
    id: '仲夏夜之梦',
    title: '仲夏夜之梦',
    author: '莎士比亚',
    cover: '/books/images/仲夏夜之梦/cover.jpg',
    description: '莎士比亚最著名的喜剧之一，讲述雅典城外森林中的奇幻爱情故事',
    tags: ["classic","drama","romance","english"],
    chapters: [
      { id: '1', title: '仲夏夜之梦', cover: '/books/images/仲夏夜之梦/cover.jpg', status: '已完结', txtUrl: '/books/仲夏夜之梦/txt/仲夏夜之梦.txt' },
    ]
  },
  {
    id: '傲慢与偏见',
    title: '傲慢与偏见',
    author: '简·奥斯汀',
    cover: '/books/images/傲慢与偏见/cover.jpg',
    description: '英国文学史上最受欢迎的小说之一，讲述伊丽莎白与达西的爱情故事',
    tags: ["classic","novel","romance","english"],
    chapters: [
      { id: '1', title: '傲慢与偏见', cover: '/books/images/傲慢与偏见/cover.jpg', status: '已完结', txtUrl: '/books/傲慢与偏见/txt/傲慢与偏见.txt' },
    ]
  },
  {
    id: '动物农场',
    title: '动物农场',
    author: '乔治·奥威尔',
    cover: '/books/images/动物农场/cover.jpg',
    description: '一部政治讽刺寓言，以动物革命隐喻极权主义的兴起',
    tags: ["classic","novel","dystopia","english"],
    chapters: [
      { id: '1', title: '动物农场', cover: '/books/images/动物农场/cover.jpg', status: '已完结', txtUrl: '/books/动物农场/txt/动物农场.txt' },
    ]
  },
  {
    id: '包法利夫人',
    title: '包法利夫人',
    author: '福楼拜',
    cover: '/books/images/包法利夫人/cover.jpg',
    description: '法国现实主义文学的里程碑，讲述农家女爱玛的悲剧人生',
    tags: ["classic","novel","french"],
    chapters: [
      { id: '1', title: '包法利夫人', cover: '/books/images/包法利夫人/cover.jpg', status: '已完结', txtUrl: '/books/包法利夫人/txt/包法利夫人.txt' },
    ]
  },
  {
    id: '十日谈',
    title: '十日谈',
    author: '薄伽丘',
    cover: '/books/images/十日谈/cover.jpg',
    description: '欧洲文学史上第一部现实主义巨著，以十个青年讲故事的形式展开',
    tags: ["classic","short-story","italian"],
    chapters: [
      { id: '1', title: '十日谈', cover: '/books/images/十日谈/cover.jpg', status: '已完结', txtUrl: '/books/十日谈/txt/十日谈.txt' },
    ]
  },
  {
    id: '卡拉马佐夫兄弟',
    title: '卡拉马佐夫兄弟',
    author: '陀思妥耶夫斯基',
    cover: '/books/images/卡拉马佐夫兄弟/cover.jpg',
    description: '陀思妥耶夫斯基的巅峰之作，探讨信仰、理性和自由意志的终极冲突',
    tags: ["classic","novel","philosophy","russian"],
    chapters: [
      { id: '1', title: '卡拉马佐夫兄弟', cover: '/books/images/卡拉马佐夫兄弟/cover.jpg', status: '已完结', txtUrl: '/books/卡拉马佐夫兄弟/txt/卡拉马佐夫兄弟.txt' },
    ]
  },
  {
    id: '双城记',
    title: '双城记',
    author: '查尔斯·狄更斯',
    cover: '/books/images/双城记/cover.jpg',
    description: '以法国大革命为背景的历史小说，开篇即是文学史上最著名的引言之一',
    tags: ["classic","novel","english"],
    chapters: [
      { id: '1', title: '双城记', cover: '/books/images/双城记/cover.jpg', status: '已完结', txtUrl: '/books/双城记/txt/双城记.txt' },
    ]
  },
  {
    id: '变形记',
    title: '变形记',
    author: '弗兰兹·卡夫卡',
    cover: '/books/images/变形记/cover.jpg',
    description: '卡夫卡最著名的中篇小说，讲述推销员格里高尔变成甲虫的荒诞故事',
    tags: ["classic","novel","philosophy","german"],
    chapters: [
      { id: '1', title: '变形记', cover: '/books/images/变形记/cover.jpg', status: '已完结', txtUrl: '/books/变形记/txt/变形记.txt' },
    ]
  },
  {
    id: '叶甫盖尼·奥涅金',
    title: '叶甫盖尼·奥涅金',
    author: '普希金',
    cover: '/books/images/叶甫盖尼·奥涅金/cover.jpg',
    description: '普希金的诗体小说，俄国现实主义文学的奠基之作',
    tags: ["classic","poetry","russian"],
    chapters: [
      { id: '1', title: '叶甫盖尼·奥涅金', cover: '/books/images/叶甫盖尼·奥涅金/cover.jpg', status: '已完结', txtUrl: '/books/叶甫盖尼·奥涅金/txt/叶甫盖尼·奥涅金.txt' },
    ]
  },
  {
    id: '呼啸山庄',
    title: '呼啸山庄',
    author: '艾米莉·勃朗特',
    cover: '/books/images/呼啸山庄/cover.jpg',
    description: '英国文学史上最伟大的爱情悲剧之一，讲述希斯克利夫与凯瑟琳的爱恨纠葛',
    tags: ["classic","novel","romance","english"],
    chapters: [
      { id: '1', title: '呼啸山庄', cover: '/books/images/呼啸山庄/cover.jpg', status: '已完结', txtUrl: '/books/呼啸山庄/txt/呼啸山庄.txt' },
    ]
  },
  {
    id: '哈克贝利·费恩历险记',
    title: '哈克贝利·费恩历险记',
    author: '马克·吐温',
    cover: '/books/images/哈克贝利·费恩历险记/cover.jpg',
    description: '马克·吐温的代表作，美国文学的源头之一，讲述少年哈克的密西西比河冒险',
    tags: ["classic","novel","adventure","american"],
    chapters: [
      { id: '1', title: '哈克贝利·费恩历险记', cover: '/books/images/哈克贝利·费恩历险记/cover.jpg', status: '已完结', txtUrl: '/books/哈克贝利·费恩历险记/txt/哈克贝利·费恩历险记.txt' },
    ]
  },
  {
    id: '哈姆雷特',
    title: '哈姆雷特',
    author: '莎士比亚',
    cover: '/books/images/哈姆雷特/cover.jpg',
    description: '莎士比亚四大悲剧之首，丹麦王子复仇的永恒经典',
    tags: ["classic","drama","english"],
    chapters: [
      { id: '1', title: '哈姆雷特', cover: '/books/images/哈姆雷特/cover.jpg', status: '已完结', txtUrl: '/books/哈姆雷特/txt/哈姆雷特.txt' },
    ]
  },
  {
    id: '地下室手记',
    title: '地下室手记',
    author: '陀思妥耶夫斯基',
    cover: '/books/images/地下室手记/cover.jpg',
    description: '陀思妥耶夫斯基的中篇杰作，存在主义文学的先声',
    tags: ["classic","novel","philosophy","russian"],
    chapters: [
      { id: '1', title: '地下室手记', cover: '/books/images/地下室手记/cover.jpg', status: '已完结', txtUrl: '/books/地下室手记/txt/地下室手记.txt' },
    ]
  },
  {
    id: '城堡',
    title: '城堡',
    author: '弗兰兹·卡夫卡',
    cover: '/books/images/城堡/cover.jpg',
    description: '卡夫卡的长篇小说，讲述土地测量员K试图进入城堡的荒诞经历',
    tags: ["classic","novel","philosophy","german"],
    chapters: [
      { id: '1', title: '城堡', cover: '/books/images/城堡/cover.jpg', status: '已完结', txtUrl: '/books/城堡/txt/城堡.txt' },
    ]
  },
  {
    id: '基督山伯爵',
    title: '基督山伯爵',
    author: '大仲马',
    cover: '/books/images/基督山伯爵/cover.jpg',
    description: '大仲马最著名的通俗小说，讲述复仇与宽恕的史诗传奇',
    tags: ["classic","novel","adventure","french"],
    chapters: [
      { id: '1', title: '基督山伯爵', cover: '/books/images/基督山伯爵/cover.jpg', status: '已完结', txtUrl: '/books/基督山伯爵/txt/基督山伯爵.txt' },
    ]
  },
  {
    id: '堂吉诃德',
    title: '堂吉诃德',
    author: '塞万提斯',
    cover: '/books/images/堂吉诃德/cover.jpg',
    description: '西方文学史上第一部现代小说，讲述疯癫骑士的荒诞冒险',
    tags: ["classic","novel","adventure","spanish"],
    chapters: [
      { id: '1', title: '堂吉诃德', cover: '/books/images/堂吉诃德/cover.jpg', status: '已完结', txtUrl: '/books/堂吉诃德/txt/堂吉诃德.txt' },
    ]
  },
  {
    id: '复活',
    title: '复活',
    author: '列夫·托尔斯泰',
    cover: '/books/images/复活/cover.jpg',
    description: '托尔斯泰晚年的长篇小说，讲述贵族聂赫留朵夫的精神觉醒与救赎',
    tags: ["classic","novel","philosophy","russian"],
    chapters: [
      { id: '1', title: '复活', cover: '/books/images/复活/cover.jpg', status: '已完结', txtUrl: '/books/复活/txt/复活.txt' },
    ]
  },
  {
    id: '外套',
    title: '外套',
    author: '果戈理',
    cover: '/books/images/外套/cover.jpg',
    description: '果戈理的短篇杰作，圣彼得堡小官吏与一件外套的悲喜故事',
    tags: ["classic","short-story","russian"],
    chapters: [
      { id: '1', title: '外套', cover: '/books/images/外套/cover.jpg', status: '已完结', txtUrl: '/books/外套/txt/外套.txt' },
    ]
  },
  {
    id: '大卫·科波菲尔',
    title: '大卫·科波菲尔',
    author: '查尔斯·狄更斯',
    cover: '/books/images/大卫·科波菲尔/cover.jpg',
    description: '狄更斯最具自传色彩的长篇小说，讲述主人公从童年到成年的成长历程',
    tags: ["classic","novel","english"],
    chapters: [
      { id: '1', title: '大卫·科波菲尔', cover: '/books/images/大卫·科波菲尔/cover.jpg', status: '已完结', txtUrl: '/books/大卫·科波菲尔/txt/大卫·科波菲尔.txt' },
    ]
  },
  {
    id: '契诃夫短篇小说集',
    title: '契诃夫短篇小说集',
    author: '契诃夫',
    cover: '/books/images/契诃夫短篇小说集/cover.jpg',
    description: '俄国短篇小说大师契诃夫的经典作品集',
    tags: ["classic","short-story","russian"],
    chapters: [
      { id: '1', title: '契诃夫短篇小说集', cover: '/books/images/契诃夫短篇小说集/cover.jpg', status: '已完结', txtUrl: '/books/契诃夫短篇小说集/txt/契诃夫短篇小说集.txt' },
    ]
  },
  {
    id: '奥赛罗',
    title: '奥赛罗',
    author: '莎士比亚',
    cover: '/books/images/奥赛罗/cover.jpg',
    description: '莎士比亚四大悲剧之一，讲述摩尔将军奥赛罗因嫉妒而毁灭的故事',
    tags: ["classic","drama","english"],
    chapters: [
      { id: '1', title: '奥赛罗', cover: '/books/images/奥赛罗/cover.jpg', status: '已完结', txtUrl: '/books/奥赛罗/txt/奥赛罗.txt' },
    ]
  },
  {
    id: '安娜·卡列尼娜',
    title: '安娜·卡列尼娜',
    author: '列夫·托尔斯泰',
    cover: '/books/images/安娜·卡列尼娜/cover.jpg',
    description: '托尔斯泰的长篇巨著，被誉为最完美的小说，探讨爱情、婚姻与社会',
    tags: ["classic","novel","romance","russian"],
    chapters: [
      { id: '1', title: '安娜·卡列尼娜', cover: '/books/images/安娜·卡列尼娜/cover.jpg', status: '已完结', txtUrl: '/books/安娜·卡列尼娜/txt/安娜·卡列尼娜.txt' },
    ]
  },
  {
    id: '安徒生童话',
    title: '安徒生童话',
    author: '安徒生',
    cover: '/books/images/安徒生童话/cover.jpg',
    description: '丹麦童话大师安徒生的经典童话集，包含《丑小鸭》《海的女儿》等名篇',
    tags: ["classic","fairy-tale"],
    chapters: [
      { id: '1', title: '安徒生童话', cover: '/books/images/安徒生童话/cover.jpg', status: '已完结', txtUrl: '/books/安徒生童话/txt/安徒生童话.txt' },
    ]
  },
  {
    id: '审判',
    title: '审判',
    author: '弗兰兹·卡夫卡',
    cover: '/books/images/审判/cover.jpg',
    description: '卡夫卡的长篇小说，讲述银行职员约瑟夫·K被莫名审判的荒诞故事',
    tags: ["classic","novel","philosophy","german"],
    chapters: [
      { id: '1', title: '审判', cover: '/books/images/审判/cover.jpg', status: '已完结', txtUrl: '/books/审判/txt/审判.txt' },
    ]
  },
  {
    id: '小王子',
    title: '小王子',
    author: '安托万·德·圣-埃克苏佩里',
    cover: '/books/images/小王子/cover.jpg',
    description: '世界上最受欢迎的童话之一，用孩子的视角透视成人世界的荒诞',
    tags: ["classic","fairy-tale","philosophy","french"],
    chapters: [
      { id: '1', title: '小王子', cover: '/books/images/小王子/cover.jpg', status: '已完结', txtUrl: '/books/小王子/txt/小王子.txt' },
    ]
  },
  {
    id: '少年维特的烦恼',
    title: '少年维特的烦恼',
    author: '歌德',
    cover: '/books/images/少年维特的烦恼/cover.jpg',
    description: '歌德的书信体小说，一部感伤主义文学的经典之作',
    tags: ["classic","novel","romance","german"],
    chapters: [
      { id: '1', title: '少年维特的烦恼', cover: '/books/images/少年维特的烦恼/cover.jpg', status: '已完结', txtUrl: '/books/少年维特的烦恼/txt/少年维特的烦恼.txt' },
    ]
  },
  {
    id: '尤利西斯',
    title: '尤利西斯',
    author: '詹姆斯·乔伊斯',
    cover: '/books/images/尤利西斯/cover.jpg',
    description: '意识流文学的巅峰之作，以一天的时间框架映射整个西方文明',
    tags: ["classic","novel","english"],
    chapters: [
      { id: '1', title: '尤利西斯', cover: '/books/images/尤利西斯/cover.jpg', status: '已完结', txtUrl: '/books/尤利西斯/txt/尤利西斯.txt' },
    ]
  },
  {
    id: '局外人',
    title: '局外人',
    author: '阿尔贝·加缪',
    cover: '/books/images/局外人/cover.jpg',
    description: '加缪的存在主义代表作，讲述一个对世界冷漠疏离的普通人的故事',
    tags: ["classic","novel","philosophy","french"],
    chapters: [
      { id: '1', title: '局外人', cover: '/books/images/局外人/cover.jpg', status: '已完结', txtUrl: '/books/局外人/txt/局外人.txt' },
    ]
  },
  {
    id: '巴黎圣母院',
    title: '巴黎圣母院',
    author: '维克多·雨果',
    cover: '/books/images/巴黎圣母院/cover.jpg',
    description: '雨果的长篇小说，以十五世纪巴黎为背景，讲述钟楼怪人卡西莫多的悲剧',
    tags: ["classic","novel","french"],
    chapters: [
      { id: '1', title: '巴黎圣母院', cover: '/books/images/巴黎圣母院/cover.jpg', status: '已完结', txtUrl: '/books/巴黎圣母院/txt/巴黎圣母院.txt' },
    ]
  },
  {
    id: '强盗',
    title: '强盗',
    author: '弗里德里希·席勒',
    cover: '/books/images/强盗/cover.jpg',
    description: '席勒的成名戏剧，讲述贵族青年卡尔·摩尔反抗社会的叛逆故事',
    tags: ["classic","drama","german"],
    chapters: [
      { id: '1', title: '强盗', cover: '/books/images/强盗/cover.jpg', status: '已完结', txtUrl: '/books/强盗/txt/强盗.txt' },
    ]
  },
  {
    id: '德伯家的苔丝',
    title: '德伯家的苔丝',
    author: '托马斯·哈代',
    cover: '/books/images/德伯家的苔丝/cover.jpg',
    description: '哈代最著名的小说，讲述纯洁少女苔丝的悲剧命运',
    tags: ["classic","novel","english"],
    chapters: [
      { id: '1', title: '德伯家的苔丝', cover: '/books/images/德伯家的苔丝/cover.jpg', status: '已完结', txtUrl: '/books/德伯家的苔丝/txt/德伯家的苔丝.txt' },
    ]
  },
  {
    id: '心',
    title: '心',
    author: '夏目漱石',
    cover: '/books/images/心/cover.jpg',
    description: '夏目漱石的代表作，深入剖析人性中的孤独与利己主义',
    tags: ["classic","novel","philosophy","japanese"],
    chapters: [
      { id: '1', title: '心', cover: '/books/images/心/cover.jpg', status: '已完结', txtUrl: '/books/心/txt/心.txt' },
    ]
  },
  {
    id: '快乐王子',
    title: '快乐王子',
    author: '奥斯卡·王尔德',
    cover: '/books/images/快乐王子/cover.jpg',
    description: '王尔德最著名的童话，讲述快乐王子雕像与小燕子的感人故事',
    tags: ["classic","fairy-tale","english"],
    chapters: [
      { id: '1', title: '快乐王子', cover: '/books/images/快乐王子/cover.jpg', status: '已完结', txtUrl: '/books/快乐王子/txt/快乐王子.txt' },
    ]
  },
  {
    id: '悉达多',
    title: '悉达多',
    author: '赫尔曼·黑塞',
    cover: '/books/images/悉达多/cover.jpg',
    description: '黑塞的哲理小说，讲述古印度贵族青年寻求生命真谛的精神之旅',
    tags: ["classic","novel","philosophy","german"],
    chapters: [
      { id: '1', title: '悉达多', cover: '/books/images/悉达多/cover.jpg', status: '已完结', txtUrl: '/books/悉达多/txt/悉达多.txt' },
    ]
  },
  {
    id: '悲惨世界',
    title: '悲惨世界',
    author: '维克多·雨果',
    cover: '/books/images/悲惨世界/cover.jpg',
    description: '雨果的鸿篇巨制，讲述冉·阿让在苦难中寻求救赎的史诗故事',
    tags: ["classic","novel","french"],
    chapters: [
      { id: '1', title: '悲惨世界', cover: '/books/images/悲惨世界/cover.jpg', status: '已完结', txtUrl: '/books/悲惨世界/txt/悲惨世界.txt' },
    ]
  },
  {
    id: '愤怒的葡萄',
    title: '愤怒的葡萄',
    author: '约翰·斯坦贝克',
    cover: '/books/images/愤怒的葡萄/cover.jpg',
    description: '斯坦贝克的代表作，讲述大萧条时期乔德一家西迁求生的苦难历程',
    tags: ["classic","novel","american"],
    chapters: [
      { id: '1', title: '愤怒的葡萄', cover: '/books/images/愤怒的葡萄/cover.jpg', status: '已完结', txtUrl: '/books/愤怒的葡萄/txt/愤怒的葡萄.txt' },
    ]
  },
  {
    id: '我是猫',
    title: '我是猫',
    author: '夏目漱石',
    cover: '/books/images/我是猫/cover.jpg',
    description: '夏目漱石的成名作，以猫的视角讽刺明治时代日本社会的种种荒诞',
    tags: ["classic","novel","japanese"],
    chapters: [
      { id: '1', title: '我是猫', cover: '/books/images/我是猫/cover.jpg', status: '已完结', txtUrl: '/books/我是猫/txt/我是猫.txt' },
    ]
  },
  {
    id: '战争与和平',
    title: '战争与和平',
    author: '列夫·托尔斯泰',
    cover: '/books/images/战争与和平/cover.jpg',
    description: '托尔斯泰的史诗巨著，以拿破仑战争为背景描绘俄国社会的全景画卷',
    tags: ["classic","novel","russian"],
    chapters: [
      { id: '1', title: '战争与和平', cover: '/books/images/战争与和平/cover.jpg', status: '已完结', txtUrl: '/books/战争与和平/txt/战争与和平.txt' },
    ]
  },
  {
    id: '时间机器',
    title: '时间机器',
    author: '赫伯特·威尔斯',
    cover: '/books/images/时间机器/cover.jpg',
    description: '科幻小说的开山之作，讲述时间旅行者穿越到未来的奇异见闻',
    tags: ["classic","novel","english"],
    chapters: [
      { id: '1', title: '时间机器', cover: '/books/images/时间机器/cover.jpg', status: '已完结', txtUrl: '/books/时间机器/txt/时间机器.txt' },
    ]
  },
  {
    id: '月亮与六便士',
    title: '月亮与六便士',
    author: '毛姆',
    cover: '/books/images/月亮与六便士/cover.jpg',
    description: '毛姆的代表作，以高更为原型讲述一个证券经纪人抛弃一切追求艺术的故事',
    tags: ["classic","novel","english"],
    chapters: [
      { id: '1', title: '月亮与六便士', cover: '/books/images/月亮与六便士/cover.jpg', status: '已完结', txtUrl: '/books/月亮与六便士/txt/月亮与六便士.txt' },
    ]
  },
  {
    id: '杀死一只知更鸟',
    title: '杀死一只知更鸟',
    author: '哈珀·李',
    cover: '/books/images/杀死一只知更鸟/cover.jpg',
    description: '美国现代文学经典，通过孩子的视角探讨种族歧视与正义',
    tags: ["classic","novel","american"],
    chapters: [
      { id: '1', title: '杀死一只知更鸟', cover: '/books/images/杀死一只知更鸟/cover.jpg', status: '已完结', txtUrl: '/books/杀死一只知更鸟/txt/杀死一只知更鸟.txt' },
    ]
  },
  {
    id: '李尔王',
    title: '李尔王',
    author: '莎士比亚',
    cover: '/books/images/李尔王/cover.jpg',
    description: '莎士比亚四大悲剧之一，讲述不列颠国王李尔王因轻信而酿成的家庭悲剧',
    tags: ["classic","drama","english"],
    chapters: [
      { id: '1', title: '李尔王', cover: '/books/images/李尔王/cover.jpg', status: '已完结', txtUrl: '/books/李尔王/txt/李尔王.txt' },
    ]
  },
  {
    id: '欧也妮·葛朗台',
    title: '欧也妮·葛朗台',
    author: '巴尔扎克',
    cover: '/books/images/欧也妮·葛朗台/cover.jpg',
    description: '巴尔扎克《人间喜剧》中的名篇，讲述守财奴葛朗台与女儿的悲剧',
    tags: ["classic","novel","french"],
    chapters: [
      { id: '1', title: '欧也妮·葛朗台', cover: '/books/images/欧也妮·葛朗台/cover.jpg', status: '已完结', txtUrl: '/books/欧也妮·葛朗台/txt/欧也妮·葛朗台.txt' },
    ]
  },
  {
    id: '死魂灵',
    title: '死魂灵',
    author: '果戈理',
    cover: '/books/images/死魂灵/cover.jpg',
    description: '果戈理的长篇讽刺小说，讲述乞乞科夫收购死农奴的荒诞故事',
    tags: ["classic","novel","russian"],
    chapters: [
      { id: '1', title: '死魂灵', cover: '/books/images/死魂灵/cover.jpg', status: '已完结', txtUrl: '/books/死魂灵/txt/死魂灵.txt' },
    ]
  },
  {
    id: '永别了，武器',
    title: '永别了，武器',
    author: '欧内斯特·海明威',
    cover: '/books/images/永别了，武器/cover.jpg',
    description: '海明威的反战小说，以一战为背景讲述战争中的爱情与幻灭',
    tags: ["classic","novel","romance","american"],
    chapters: [
      { id: '1', title: '永别了，武器', cover: '/books/images/永别了，武器/cover.jpg', status: '已完结', txtUrl: '/books/永别了，武器/txt/永别了，武器.txt' },
    ]
  },
  {
    id: '汤姆·索亚历险记',
    title: '汤姆·索亚历险记',
    author: '马克·吐温',
    cover: '/books/images/汤姆·索亚历险记/cover.jpg',
    description: '马克·吐温的儿童冒险小说，讲述调皮男孩汤姆的密西西比河畔冒险',
    tags: ["classic","novel","adventure","american"],
    chapters: [
      { id: '1', title: '汤姆·索亚历险记', cover: '/books/images/汤姆·索亚历险记/cover.jpg', status: '已完结', txtUrl: '/books/汤姆·索亚历险记/txt/汤姆·索亚历险记.txt' },
    ]
  },
  {
    id: '洛丽塔',
    title: '洛丽塔',
    author: '弗拉基米尔·纳博科夫',
    cover: '/books/images/洛丽塔/cover.jpg',
    description: '纳博科夫最具争议的小说，以华丽的文笔讲述一段禁忌之恋',
    tags: ["classic","novel","american"],
    chapters: [
      { id: '1', title: '洛丽塔', cover: '/books/images/洛丽塔/cover.jpg', status: '已完结', txtUrl: '/books/洛丽塔/txt/洛丽塔.txt' },
    ]
  },
  {
    id: '浮士德',
    title: '浮士德',
    author: '歌德',
    cover: '/books/images/浮士德/cover.jpg',
    description: '歌德毕生心血之作，讲述学者浮士德与魔鬼梅菲斯特的交易',
    tags: ["classic","drama","philosophy","german"],
    chapters: [
      { id: '1', title: '浮士德', cover: '/books/images/浮士德/cover.jpg', status: '已完结', txtUrl: '/books/浮士德/txt/浮士德.txt' },
    ]
  },
  {
    id: '爱玛',
    title: '爱玛',
    author: '简·奥斯汀',
    cover: '/books/images/爱玛/cover.jpg',
    description: '奥斯汀的成熟之作，讲述自作聪明的爱玛在爱情中成长的故事',
    tags: ["classic","novel","romance","english"],
    chapters: [
      { id: '1', title: '爱玛', cover: '/books/images/爱玛/cover.jpg', status: '已完结', txtUrl: '/books/爱玛/txt/爱玛.txt' },
    ]
  },
  {
    id: '玩偶之家',
    title: '玩偶之家',
    author: '易卜生',
    cover: '/books/images/玩偶之家/cover.jpg',
    description: '易卜生最著名的戏剧，讲述娜拉觉醒并出走的故事，女性主义文学先驱',
    tags: ["classic","drama"],
    chapters: [
      { id: '1', title: '玩偶之家', cover: '/books/images/玩偶之家/cover.jpg', status: '已完结', txtUrl: '/books/玩偶之家/txt/玩偶之家.txt' },
    ]
  },
  {
    id: '理智与情感',
    title: '理智与情感',
    author: '简·奥斯汀',
    cover: '/books/images/理智与情感/cover.jpg',
    description: '奥斯汀的处女作，讲述达什伍德姐妹截然不同的爱情观',
    tags: ["classic","novel","romance","english"],
    chapters: [
      { id: '1', title: '理智与情感', cover: '/books/images/理智与情感/cover.jpg', status: '已完结', txtUrl: '/books/理智与情感/txt/理智与情感.txt' },
    ]
  },
  {
    id: '生命中不能承受之轻',
    title: '生命中不能承受之轻',
    author: '米兰·昆德拉',
    cover: '/books/images/生命中不能承受之轻/cover.jpg',
    description: '昆德拉的代表作，以布拉格之春为背景探讨生命的轻与重',
    tags: ["classic","novel","philosophy"],
    chapters: [
      { id: '1', title: '生命中不能承受之轻', cover: '/books/images/生命中不能承受之轻/cover.jpg', status: '已完结', txtUrl: '/books/生命中不能承受之轻/txt/生命中不能承受之轻.txt' },
    ]
  },
  {
    id: '白痴',
    title: '白痴',
    author: '陀思妥耶夫斯基',
    cover: '/books/images/白痴/cover.jpg',
    description: '陀思妥耶夫斯基的长篇小说，讲述纯真善良的梅什金公爵的悲剧命运',
    tags: ["classic","novel","russian"],
    chapters: [
      { id: '1', title: '白痴', cover: '/books/images/白痴/cover.jpg', status: '已完结', txtUrl: '/books/白痴/txt/白痴.txt' },
    ]
  },
  {
    id: '白鲸',
    title: '白鲸',
    author: '赫尔曼·梅尔维尔',
    cover: '/books/images/白鲸/cover.jpg',
    description: '美国文学的史诗巨著，讲述亚哈船长追逐白鲸莫比·迪克的执念',
    tags: ["classic","novel","adventure","american"],
    chapters: [
      { id: '1', title: '白鲸', cover: '/books/images/白鲸/cover.jpg', status: '已完结', txtUrl: '/books/白鲸/txt/白鲸.txt' },
    ]
  },
  {
    id: '百年孤独',
    title: '百年孤独',
    author: '加西亚·马尔克斯',
    cover: '/books/images/百年孤独/cover.jpg',
    description: '魔幻现实主义的巅峰之作，讲述布恩迪亚家族七代人的传奇故事',
    tags: ["classic","novel","latin-american"],
    chapters: [
      { id: '1', title: '百年孤独', cover: '/books/images/百年孤独/cover.jpg', status: '已完结', txtUrl: '/books/百年孤独/txt/百年孤独.txt' },
    ]
  },
  {
    id: '神曲',
    title: '神曲',
    author: '但丁',
    cover: '/books/images/神曲/cover.jpg',
    description: '中世纪最伟大的文学作品，但丁游历地狱、炼狱和天堂的灵魂之旅',
    tags: ["classic","poetry","philosophy","italian"],
    chapters: [
      { id: '1', title: '神曲', cover: '/books/images/神曲/cover.jpg', status: '已完结', txtUrl: '/books/神曲/txt/神曲.txt' },
    ]
  },
  {
    id: '福尔摩斯探案集',
    title: '福尔摩斯探案集',
    author: '阿瑟·柯南·道尔',
    cover: '/books/images/福尔摩斯探案集/cover.jpg',
    description: '侦探小说的经典之作，讲述大侦探福尔摩斯与华生的探案故事',
    tags: ["classic","short-story","detective","english"],
    chapters: [
      { id: '1', title: '福尔摩斯探案集', cover: '/books/images/福尔摩斯探案集/cover.jpg', status: '已完结', txtUrl: '/books/福尔摩斯探案集/txt/福尔摩斯探案集.txt' },
    ]
  },
  {
    id: '等待戈多',
    title: '等待戈多',
    author: '塞缪尔·贝克特',
    cover: '/books/images/等待戈多/cover.jpg',
    description: '荒诞派戏剧的代表作，两个人在无尽等待中展开的哲学对话',
    tags: ["classic","drama","philosophy"],
    chapters: [
      { id: '1', title: '等待戈多', cover: '/books/images/等待戈多/cover.jpg', status: '已完结', txtUrl: '/books/等待戈多/txt/等待戈多.txt' },
    ]
  },
  {
    id: '简·爱',
    title: '简·爱',
    author: '夏洛蒂·勃朗特',
    cover: '/books/images/简·爱/cover.jpg',
    description: '英国文学经典，讲述孤女简·爱追求自由与尊严的独立女性故事',
    tags: ["classic","novel","romance","english"],
    chapters: [
      { id: '1', title: '简·爱', cover: '/books/images/简·爱/cover.jpg', status: '已完结', txtUrl: '/books/简·爱/txt/简·爱.txt' },
    ]
  },
  {
    id: '红与黑',
    title: '红与黑',
    author: '司汤达',
    cover: '/books/images/红与黑/cover.jpg',
    description: '法国批判现实主义文学的奠基之作，讲述于连的野心与爱情',
    tags: ["classic","novel","romance","french"],
    chapters: [
      { id: '1', title: '红与黑', cover: '/books/images/红与黑/cover.jpg', status: '已完结', txtUrl: '/books/红与黑/txt/红与黑.txt' },
    ]
  },
  {
    id: '红字',
    title: '红字',
    author: '纳撒尼尔·霍桑',
    cover: '/books/images/红字/cover.jpg',
    description: '美国文学的经典，讲述清教徒社会中一个女人佩戴红字A的赎罪故事',
    tags: ["classic","novel","american"],
    chapters: [
      { id: '1', title: '红字', cover: '/books/images/红字/cover.jpg', status: '已完结', txtUrl: '/books/红字/txt/红字.txt' },
    ]
  },
  {
    id: '红花侠',
    title: '红花侠',
    author: '奥希兹女男爵',
    cover: '/books/images/红花侠/cover.jpg',
    description: '冒险小说经典，讲述法国大革命时期神秘贵族红花侠的救援行动',
    tags: ["classic","novel","adventure","english"],
    chapters: [
      { id: '1', title: '红花侠', cover: '/books/images/红花侠/cover.jpg', status: '已完结', txtUrl: '/books/红花侠/txt/红花侠.txt' },
    ]
  },
  {
    id: '罗密欧与朱丽叶',
    title: '罗密欧与朱丽叶',
    author: '莎士比亚',
    cover: '/books/images/罗密欧与朱丽叶/cover.jpg',
    description: '莎士比亚最著名的爱情悲剧，两个家族仇人的年轻恋人殉情而死',
    tags: ["classic","drama","romance","english"],
    chapters: [
      { id: '1', title: '罗密欧与朱丽叶', cover: '/books/images/罗密欧与朱丽叶/cover.jpg', status: '已完结', txtUrl: '/books/罗密欧与朱丽叶/txt/罗密欧与朱丽叶.txt' },
    ]
  },
  {
    id: '罪与罚',
    title: '罪与罚',
    author: '陀思妥耶夫斯基',
    cover: '/books/images/罪与罚/cover.jpg',
    description: '陀思妥耶夫斯基的代表作，讲述穷大学生拉斯柯尔尼科夫的犯罪与救赎',
    tags: ["classic","novel","philosophy","russian"],
    chapters: [
      { id: '1', title: '罪与罚', cover: '/books/images/罪与罚/cover.jpg', status: '已完结', txtUrl: '/books/罪与罚/txt/罪与罚.txt' },
    ]
  },
  {
    id: '羊脂球',
    title: '羊脂球',
    author: '莫泊桑',
    cover: '/books/images/羊脂球/cover.jpg',
    description: '莫泊桑的成名短篇，普法战争中一个妓女的高尚与乘客的卑劣形成对比',
    tags: ["classic","short-story","french"],
    chapters: [
      { id: '1', title: '羊脂球', cover: '/books/images/羊脂球/cover.jpg', status: '已完结', txtUrl: '/books/羊脂球/txt/羊脂球.txt' },
    ]
  },
  {
    id: '美丽新世界',
    title: '美丽新世界',
    author: '阿道司·赫胥黎',
    cover: '/books/images/美丽新世界/cover.jpg',
    description: '反乌托邦经典三部曲之一，描绘一个以科技控制人类的未来社会',
    tags: ["classic","novel","dystopia","english"],
    chapters: [
      { id: '1', title: '美丽新世界', cover: '/books/images/美丽新世界/cover.jpg', status: '已完结', txtUrl: '/books/美丽新世界/txt/美丽新世界.txt' },
    ]
  },
  {
    id: '群鬼',
    title: '群鬼',
    author: '易卜生',
    cover: '/books/images/群鬼/cover.jpg',
    description: '易卜生的社会问题剧，揭露维多利亚时代道德伪善的悲剧',
    tags: ["classic","drama"],
    chapters: [
      { id: '1', title: '群鬼', cover: '/books/images/群鬼/cover.jpg', status: '已完结', txtUrl: '/books/群鬼/txt/群鬼.txt' },
    ]
  },
  {
    id: '老人与海',
    title: '老人与海',
    author: '欧内斯特·海明威',
    cover: '/books/images/老人与海/cover.jpg',
    description: '海明威的诺贝尔奖之作，讲述古巴老渔夫与大马林鱼的搏斗',
    tags: ["classic","novel","american"],
    chapters: [
      { id: '1', title: '老人与海', cover: '/books/images/老人与海/cover.jpg', status: '已完结', txtUrl: '/books/老人与海/txt/老人与海.txt' },
    ]
  },
  {
    id: '茶花女',
    title: '茶花女',
    author: '小仲马',
    cover: '/books/images/茶花女/cover.jpg',
    description: '法国文学经典爱情悲剧，讲述巴黎名妓玛格丽特的凄美爱情',
    tags: ["classic","novel","romance","french"],
    chapters: [
      { id: '1', title: '茶花女', cover: '/books/images/茶花女/cover.jpg', status: '已完结', txtUrl: '/books/茶花女/txt/茶花女.txt' },
    ]
  },
  {
    id: '荒原狼',
    title: '荒原狼',
    author: '赫尔曼·黑塞',
    cover: '/books/images/荒原狼/cover.jpg',
    description: '黑塞的代表作，讲述一个知识分子在精神分裂中寻找自我',
    tags: ["classic","novel","philosophy","german"],
    chapters: [
      { id: '1', title: '荒原狼', cover: '/books/images/荒原狼/cover.jpg', status: '已完结', txtUrl: '/books/荒原狼/txt/荒原狼.txt' },
    ]
  },
  {
    id: '蝇王',
    title: '蝇王',
    author: '威廉·戈尔丁',
    cover: '/books/images/蝇王/cover.jpg',
    description: '戈尔丁的寓言小说，讲述一群荒岛求生的少年如何退化为野蛮人',
    tags: ["classic","novel","english"],
    chapters: [
      { id: '1', title: '蝇王', cover: '/books/images/蝇王/cover.jpg', status: '已完结', txtUrl: '/books/蝇王/txt/蝇王.txt' },
    ]
  },
  {
    id: '远大前程',
    title: '远大前程',
    author: '查尔斯·狄更斯',
    cover: '/books/images/远大前程/cover.jpg',
    description: '狄更斯的成熟之作，讲述孤儿皮普从卑微到幻灭的成长历程',
    tags: ["classic","novel","english"],
    chapters: [
      { id: '1', title: '远大前程', cover: '/books/images/远大前程/cover.jpg', status: '已完结', txtUrl: '/books/远大前程/txt/远大前程.txt' },
    ]
  },
  {
    id: '远离尘嚣',
    title: '远离尘嚣',
    author: '托马斯·哈代',
    cover: '/books/images/远离尘嚣/cover.jpg',
    description: '哈代的成名作，讲述美丽独立的芭丝谢芭与三个追求者的爱情纠葛',
    tags: ["classic","novel","romance","english"],
    chapters: [
      { id: '1', title: '远离尘嚣', cover: '/books/images/远离尘嚣/cover.jpg', status: '已完结', txtUrl: '/books/远离尘嚣/txt/远离尘嚣.txt' },
    ]
  },
  {
    id: '道林·格雷的画像',
    title: '道林·格雷的画像',
    author: '奥斯卡·王尔德',
    cover: '/books/images/道林·格雷的画像/cover.jpg',
    description: '王尔德唯一的小说，讲述一个美少年的画像替他衰老的寓言故事',
    tags: ["classic","novel","philosophy","english"],
    chapters: [
      { id: '1', title: '道林·格雷的画像', cover: '/books/images/道林·格雷的画像/cover.jpg', status: '已完结', txtUrl: '/books/道林·格雷的画像/txt/道林·格雷的画像.txt' },
    ]
  },
  {
    id: '都柏林人',
    title: '都柏林人',
    author: '詹姆斯·乔伊斯',
    cover: '/books/images/都柏林人/cover.jpg',
    description: '乔伊斯的短篇小说集，以十五个故事描绘都柏林市民的精神瘫痪',
    tags: ["classic","short-story","english"],
    chapters: [
      { id: '1', title: '都柏林人', cover: '/books/images/都柏林人/cover.jpg', status: '已完结', txtUrl: '/books/都柏林人/txt/都柏林人.txt' },
    ]
  },
  {
    id: '金阁寺',
    title: '金阁寺',
    author: '三岛由纪夫',
    cover: '/books/images/金阁寺/cover.jpg',
    description: '三岛由纪夫的代表作，讲述口吃僧人放火烧毁金阁寺的真实事件改编',
    tags: ["classic","novel","philosophy","japanese"],
    chapters: [
      { id: '1', title: '金阁寺', cover: '/books/images/金阁寺/cover.jpg', status: '已完结', txtUrl: '/books/金阁寺/txt/金阁寺.txt' },
    ]
  },
  {
    id: '银河铁道之夜',
    title: '银河铁道之夜',
    author: '宫泽贤治',
    cover: '/books/images/银河铁道之夜/cover.jpg',
    description: '宫泽贤治最著名的童话，讲述少年乔万尼在银河列车上的奇幻旅程',
    tags: ["classic","fairy-tale","japanese"],
    chapters: [
      { id: '1', title: '银河铁道之夜', cover: '/books/images/银河铁道之夜/cover.jpg', status: '已完结', txtUrl: '/books/银河铁道之夜/txt/银河铁道之夜.txt' },
    ]
  },
  {
    id: '阴谋与爱情',
    title: '阴谋与爱情',
    author: '弗里德里希·席勒',
    cover: '/books/images/阴谋与爱情/cover.jpg',
    description: '席勒的市民悲剧，讲述宰相之子与乐师之女被阴谋摧毁的爱情',
    tags: ["classic","drama","romance","german"],
    chapters: [
      { id: '1', title: '阴谋与爱情', cover: '/books/images/阴谋与爱情/cover.jpg', status: '已完结', txtUrl: '/books/阴谋与爱情/txt/阴谋与爱情.txt' },
    ]
  },
  {
    id: '隐身人',
    title: '隐身人',
    author: '赫伯特·威尔斯',
    cover: '/books/images/隐身人/cover.jpg',
    description: '威尔斯的科幻经典，讲述一个科学家发明隐身术后的疯狂与毁灭',
    tags: ["classic","novel","english"],
    chapters: [
      { id: '1', title: '隐身人', cover: '/books/images/隐身人/cover.jpg', status: '已完结', txtUrl: '/books/隐身人/txt/隐身人.txt' },
    ]
  },
  {
    id: '雪国',
    title: '雪国',
    author: '川端康成',
    cover: '/books/images/雪国/cover.jpg',
    description: '川端康成的诺贝尔奖之作，讲述东京男子与雪国艺伎的虚幻爱情',
    tags: ["classic","novel","romance","japanese"],
    chapters: [
      { id: '1', title: '雪国', cover: '/books/images/雪国/cover.jpg', status: '已完结', txtUrl: '/books/雪国/txt/雪国.txt' },
    ]
  },
  {
    id: '雾都孤儿',
    title: '雾都孤儿',
    author: '查尔斯·狄更斯',
    cover: '/books/images/雾都孤儿/cover.jpg',
    description: '狄更斯的早期代表作，讲述孤儿奥利弗在伦敦的苦难经历',
    tags: ["classic","novel","english"],
    chapters: [
      { id: '1', title: '雾都孤儿', cover: '/books/images/雾都孤儿/cover.jpg', status: '已完结', txtUrl: '/books/雾都孤儿/txt/雾都孤儿.txt' },
    ]
  },
  {
    id: '霍乱时期的爱情',
    title: '霍乱时期的爱情',
    author: '加西亚·马尔克斯',
    cover: '/books/images/霍乱时期的爱情/cover.jpg',
    description: '马尔克斯的爱情史诗，讲述一段跨越半个多世纪的忠贞不渝的爱情',
    tags: ["classic","novel","romance","latin-american"],
    chapters: [
      { id: '1', title: '霍乱时期的爱情', cover: '/books/images/霍乱时期的爱情/cover.jpg', status: '已完结', txtUrl: '/books/霍乱时期的爱情/txt/霍乱时期的爱情.txt' },
    ]
  },
  {
    id: '飘',
    title: '飘',
    author: '玛格丽特·米切尔',
    cover: '/books/images/飘/cover.jpg',
    description: '以美国南北战争为背景的史诗爱情小说，讲述斯嘉丽的坚韧与爱情',
    tags: ["classic","novel","romance","american"],
    chapters: [
      { id: '1', title: '飘', cover: '/books/images/飘/cover.jpg', status: '已完结', txtUrl: '/books/飘/txt/飘.txt' },
    ]
  },
  {
    id: '高老头',
    title: '高老头',
    author: '巴尔扎克',
    cover: '/books/images/高老头/cover.jpg',
    description: '巴尔扎克《人间喜剧》的核心作品，讲述父爱的极端与青年的堕落',
    tags: ["classic","novel","french"],
    chapters: [
      { id: '1', title: '高老头', cover: '/books/images/高老头/cover.jpg', status: '已完结', txtUrl: '/books/高老头/txt/高老头.txt' },
    ]
  },
  {
    id: '麦克白',
    title: '麦克白',
    author: '莎士比亚',
    cover: '/books/images/麦克白/cover.jpg',
    description: '莎士比亚四大悲剧之一，讲述苏格兰将军麦克白因野心而走向毁灭',
    tags: ["classic","drama","english"],
    chapters: [
      { id: '1', title: '麦克白', cover: '/books/images/麦克白/cover.jpg', status: '已完结', txtUrl: '/books/麦克白/txt/麦克白.txt' },
    ]
  },
  {
    id: '麦田里的守望者',
    title: '麦田里的守望者',
    author: 'J.D.塞林格',
    cover: '/books/images/麦田里的守望者/cover.jpg',
    description: '美国青春文学经典，讲述叛逆少年霍尔顿在纽约的两天游荡',
    tags: ["classic","novel","american"],
    chapters: [
      { id: '1', title: '麦田里的守望者', cover: '/books/images/麦田里的守望者/cover.jpg', status: '已完结', txtUrl: '/books/麦田里的守望者/txt/麦田里的守望者.txt' },
    ]
  },
  {
    id: '鼠疫',
    title: '鼠疫',
    author: '阿尔贝·加缪',
    cover: '/books/images/鼠疫/cover.jpg',
    description: '加缪的长篇寓言小说，以北非城市爆发鼠疫隐喻人类面对荒诞的态度',
    tags: ["classic","novel","philosophy","french"],
    chapters: [
      { id: '1', title: '鼠疫', cover: '/books/images/鼠疫/cover.jpg', status: '已完结', txtUrl: '/books/鼠疫/txt/鼠疫.txt' },
    ]
  },
]

export function getBookById(id: string): Book | undefined {
  return books.find(book => book.id === id)
}