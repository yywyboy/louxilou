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
  featured?: boolean
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
    cover: '/books/covers/1984.webp',
    description: '反乌托邦文学的巅峰之作，描绘一个极权统治下的恐怖未来世界',
    tags: ["classic","novel","dystopia","english"],
    chapters: [
      { id: '1', title: '1984', cover: '/books/covers/1984.webp', status: '已完结', txtUrl: '/books/texts/1984/1984.txt' },
    ]
  },
  {
    id: '古典部系列',
    title: '古典部系列',
    author: '米泽穗信',
    cover: '/books/covers/古典部系列.webp',
    description: '以神山高中古典部为舞台的青春推理小说系列',
    tags: ["light-novel","japanese"],
    featured: true,
    chapters: [
      { id: '1', title: '冰菓', cover: '/books/covers/古典部系列.webp', status: '已完结', txtUrl: '/books/texts/古典部系列/古典部系列1.txt' },
      { id: '2', title: '愚者的片尾', cover: '/books/covers/古典部系列.webp', status: '已完结', txtUrl: '/books/texts/古典部系列/古典部系列2.txt' },
      { id: '3', title: '库特利亚芙卡的排序', cover: '/books/covers/古典部系列.webp', status: '已完结', txtUrl: '/books/texts/古典部系列/古典部系列3.txt' },
      { id: '4', title: '绕远路的雏偶', cover: '/books/covers/古典部系列.webp', status: '已完结', txtUrl: '/books/texts/古典部系列/古典部系列4.txt' },
      { id: '5', title: '两人距离的概算', cover: '/books/covers/古典部系列.webp', status: '已完结', txtUrl: '/books/texts/古典部系列/古典部系列5.txt' },
      { id: '6', title: '放眼不可理喻的未来', cover: '/books/covers/古典部系列.webp', status: '已完结', txtUrl: '/books/texts/古典部系列/古典部系列6.txt' },
    ]
  },
  {
    id: '魔女之旅',
    title: '魔女之旅',
    author: '白石定规',
    cover: '/books/covers/魔女之旅.webp',
    description: '讲述魔女伊蕾娜周游各国的故事',
    tags: ["light-novel","japanese"],
    featured: true,
    chapters: [
      { id: '1', title: '第1卷', cover: '/books/covers/魔女之旅.webp', status: '已完结', txtUrl: '/books/texts/mobitchi/魔女之旅 1.txt' },
      { id: '2', title: '第2卷', cover: '/books/covers/魔女之旅.webp', status: '已完结', txtUrl: '/books/texts/mobitchi/魔女之旅 2.txt' },
      { id: '3', title: '第3卷', cover: '/books/covers/魔女之旅.webp', status: '已完结', txtUrl: '/books/texts/mobitchi/魔女之旅 3.txt' },
      { id: '4', title: '第4卷', cover: '/books/covers/魔女之旅.webp', status: '已完结', txtUrl: '/books/texts/mobitchi/魔女之旅 4.txt' },
      { id: '5', title: '第5卷', cover: '/books/covers/魔女之旅.webp', status: '已完结', txtUrl: '/books/texts/mobitchi/魔女之旅 5.txt' },
      { id: '6', title: '第6卷', cover: '/books/covers/魔女之旅.webp', status: '已完结', txtUrl: '/books/texts/mobitchi/魔女之旅 6.txt' },
      { id: '7', title: '第7卷', cover: '/books/covers/魔女之旅.webp', status: '已完结', txtUrl: '/books/texts/mobitchi/魔女之旅 7.txt' },
      { id: '8', title: '第8卷', cover: '/books/covers/魔女之旅.webp', status: '已完结', txtUrl: '/books/texts/mobitchi/魔女之旅 8.txt' },
      { id: '9', title: '第9卷', cover: '/books/covers/魔女之旅.webp', status: '已完结', txtUrl: '/books/texts/mobitchi/魔女之旅 9.txt' },
      { id: '10', title: '第10卷', cover: '/books/covers/魔女之旅.webp', status: '已完结', txtUrl: '/books/texts/mobitchi/魔女之旅 10.txt' },
      { id: '11', title: '第11卷', cover: '/books/covers/魔女之旅.webp', status: '已完结', txtUrl: '/books/texts/mobitchi/魔女之旅 11.txt' },
      { id: '12', title: '第12卷', cover: '/books/covers/魔女之旅.webp', status: '已完结', txtUrl: '/books/texts/mobitchi/魔女之旅12.txt' },
      { id: '13', title: '第13卷', cover: '/books/covers/魔女之旅.webp', status: '已完结', txtUrl: '/books/texts/mobitchi/魔女之旅13.txt' },
      { id: '14', title: '第14卷', cover: '/books/covers/魔女之旅.webp', status: '已完结', txtUrl: '/books/texts/mobitchi/魔女之旅14.txt' },
      { id: '15', title: '第15卷', cover: '/books/covers/魔女之旅.webp', status: '已完结', txtUrl: '/books/texts/mobitchi/魔女之旅15.txt' },
      { id: '16', title: '第16卷', cover: '/books/covers/魔女之旅.webp', status: '已完结', txtUrl: '/books/texts/mobitchi/魔女之旅16.txt' },
      { id: '17', title: '第17卷', cover: '/books/covers/魔女之旅.webp', status: '已完结', txtUrl: '/books/texts/mobitchi/魔女之旅17.txt' },
      { id: '18', title: '第18卷', cover: '/books/covers/魔女之旅.webp', status: '已完结', txtUrl: '/books/texts/mobitchi/魔女之旅18.txt' },
      { id: '19', title: '第19卷', cover: '/books/covers/魔女之旅.webp', status: '已完结', txtUrl: '/books/texts/mobitchi/魔女之旅19.txt' },
      { id: '20', title: '第20卷', cover: '/books/covers/魔女之旅.webp', status: '已完结', txtUrl: '/books/texts/mobitchi/魔女之旅20.txt' },
      { id: '21', title: '第21卷', cover: '/books/covers/魔女之旅.webp', status: '已完结', txtUrl: '/books/texts/mobitchi/魔女之旅21.txt' },
    ]
  },
  {
    id: '小市民系列',
    title: '小市民系列',
    author: '米泽穗信',
    cover: '/books/covers/小市民系列.webp',
    description: '以小市民为主题的推理小说系列',
    tags: ["light-novel","japanese"],
    featured: true,
    chapters: [
      { id: '1', title: '春季限定草莓塔事件', cover: '/books/covers/小市民系列.webp', status: '已完结', txtUrl: '/books/texts/小市民系列/春季限定草莓塔事件.txt' },
      { id: '2', title: '夏季限定热带水果芭菲事件', cover: '/books/covers/小市民系列.webp', status: '已完结', txtUrl: '/books/texts/小市民系列/夏季限定热带水果百汇事件.txt' },
      { id: '3', title: '秋季限定栗金饨事件(上)', cover: '/books/covers/小市民系列.webp', status: '已完结', txtUrl: '/books/texts/小市民系列/秋季限定栗金饨事件(上).txt' },
      { id: '4', title: '秋季限定栗金饨事件(下)', cover: '/books/covers/小市民系列.webp', status: '已完结', txtUrl: '/books/texts/小市民系列/秋季限定栗金饨事件(下).txt' },
      { id: '5', title: '冬季限定法式巧克力事件', cover: '/books/covers/小市民系列.webp', status: '已完结', txtUrl: '/books/texts/小市民系列/冬季限定法式巧克力事件.txt' },
      { id: '6', title: '巴黎马卡龙之谜', cover: '/books/covers/小市民系列.webp', status: '已完结', txtUrl: '/books/texts/小市民系列/巴黎马卡龙之谜.txt' },
    ]
  },
  {
    id: '三个火枪手',
    title: '三个火枪手',
    author: '大仲马',
    cover: '/books/covers/三个火枪手.webp',
    description: '法国浪漫主义作家大仲马的代表作，讲述达达尼昂与三位火枪手的冒险故事',
    tags: ["classic","novel","adventure","french"],
    chapters: [
      { id: '1', title: '三个火枪手', cover: '/books/covers/三个火枪手.webp', status: '已完结', txtUrl: '/books/texts/三个火枪手/三个火枪手.txt' },
    ]
  },
  {
    id: '了不起的盖茨比',
    title: '了不起的盖茨比',
    author: '菲茨杰拉德',
    cover: '/books/covers/了不起的盖茨比.webp',
    description: '美国作家菲茨杰拉德的代表作，描绘美国梦的幻灭',
    tags: ["classic","novel","american"],
    chapters: [
      { id: '1', title: '了不起的盖茨比', cover: '/books/covers/了不起的盖茨比.webp', status: '已完结', txtUrl: '/books/texts/了不起的盖茨比/了不起的盖茨比.txt' },
    ]
  },
  {
    id: '仲夏夜之梦',
    title: '仲夏夜之梦',
    author: '莎士比亚',
    cover: '/books/covers/仲夏夜之梦.webp',
    description: '莎士比亚最著名的喜剧之一，讲述雅典城外森林中的奇幻爱情故事',
    tags: ["classic","drama","romance","english"],
    chapters: [
      { id: '1', title: '仲夏夜之梦', cover: '/books/covers/仲夏夜之梦.webp', status: '已完结', txtUrl: '/books/texts/仲夏夜之梦/仲夏夜之梦.txt' },
    ]
  },
  {
    id: '傲慢与偏见',
    title: '傲慢与偏见',
    author: '简·奥斯汀',
    cover: '/books/covers/傲慢与偏见.webp',
    description: '英国文学史上最受欢迎的小说之一，讲述伊丽莎白与达西的爱情故事',
    tags: ["classic","novel","romance","english"],
    chapters: [
      { id: '1', title: '傲慢与偏见', cover: '/books/covers/傲慢与偏见.webp', status: '已完结', txtUrl: '/books/texts/傲慢与偏见/傲慢与偏见.txt' },
    ]
  },
  {
    id: '动物农场',
    title: '动物农场',
    author: '乔治·奥威尔',
    cover: '/books/covers/动物农场.webp',
    description: '一部政治讽刺寓言，以动物革命隐喻极权主义的兴起',
    tags: ["classic","novel","dystopia","english"],
    chapters: [
      { id: '1', title: '动物农场', cover: '/books/covers/动物农场.webp', status: '已完结', txtUrl: '/books/texts/动物农场/动物农场.txt' },
    ]
  },
  {
    id: '包法利夫人',
    title: '包法利夫人',
    author: '福楼拜',
    cover: '/books/covers/包法利夫人.webp',
    description: '法国现实主义文学的里程碑，讲述农家女爱玛的悲剧人生',
    tags: ["classic","novel","french"],
    chapters: [
      { id: '1', title: '包法利夫人', cover: '/books/covers/包法利夫人.webp', status: '已完结', txtUrl: '/books/texts/包法利夫人/包法利夫人.txt' },
    ]
  },
  {
    id: '十日谈',
    title: '十日谈',
    author: '薄伽丘',
    cover: '/books/covers/十日谈.webp',
    description: '欧洲文学史上第一部现实主义巨著，以十个青年讲故事的形式展开',
    tags: ["classic","short-story","italian"],
    chapters: [
      { id: '1', title: '十日谈', cover: '/books/covers/十日谈.webp', status: '已完结', txtUrl: '/books/texts/十日谈/十日谈.txt' },
    ]
  },
  {
    id: '卡拉马佐夫兄弟',
    title: '卡拉马佐夫兄弟',
    author: '陀思妥耶夫斯基',
    cover: '/books/covers/卡拉马佐夫兄弟.webp',
    description: '陀思妥耶夫斯基的巅峰之作，探讨信仰、理性和自由意志的终极冲突',
    tags: ["classic","novel","philosophy","russian"],
    chapters: [
      { id: '1', title: '卡拉马佐夫兄弟', cover: '/books/covers/卡拉马佐夫兄弟.webp', status: '已完结', txtUrl: '/books/texts/卡拉马佐夫兄弟/卡拉马佐夫兄弟.txt' },
    ]
  },
  {
    id: '双城记',
    title: '双城记',
    author: '查尔斯·狄更斯',
    cover: '/books/covers/双城记.webp',
    description: '以法国大革命为背景的历史小说，开篇即是文学史上最著名的引言之一',
    tags: ["classic","novel","english"],
    chapters: [
      { id: '1', title: '双城记', cover: '/books/covers/双城记.webp', status: '已完结', txtUrl: '/books/texts/双城记/双城记.txt' },
    ]
  },
  {
    id: '变形记',
    title: '变形记',
    author: '弗兰兹·卡夫卡',
    cover: '/books/covers/变形记.webp',
    description: '卡夫卡最著名的中篇小说，讲述推销员格里高尔变成甲虫的荒诞故事',
    tags: ["classic","novel","philosophy","german"],
    chapters: [
      { id: '1', title: '变形记', cover: '/books/covers/变形记.webp', status: '已完结', txtUrl: '/books/texts/变形记/变形记.txt' },
    ]
  },
  {
    id: '叶甫盖尼·奥涅金',
    title: '叶甫盖尼·奥涅金',
    author: '普希金',
    cover: '/books/covers/叶甫盖尼·奥涅金.webp',
    description: '普希金的诗体小说，俄国现实主义文学的奠基之作',
    tags: ["classic","poetry","russian"],
    chapters: [
      { id: '1', title: '叶甫盖尼·奥涅金', cover: '/books/covers/叶甫盖尼·奥涅金.webp', status: '已完结', txtUrl: '/books/texts/叶甫盖尼·奥涅金/叶甫盖尼·奥涅金.txt' },
    ]
  },
  {
    id: '呼啸山庄',
    title: '呼啸山庄',
    author: '艾米莉·勃朗特',
    cover: '/books/covers/呼啸山庄.webp',
    description: '英国文学史上最伟大的爱情悲剧之一，讲述希斯克利夫与凯瑟琳的爱恨纠葛',
    tags: ["classic","novel","romance","english"],
    chapters: [
      { id: '1', title: '呼啸山庄', cover: '/books/covers/呼啸山庄.webp', status: '已完结', txtUrl: '/books/texts/呼啸山庄/呼啸山庄.txt' },
    ]
  },
  {
    id: '哈克贝利·费恩历险记',
    title: '哈克贝利·费恩历险记',
    author: '马克·吐温',
    cover: '/books/covers/哈克贝利·费恩历险记.webp',
    description: '马克·吐温的代表作，美国文学的源头之一，讲述少年哈克的密西西比河冒险',
    tags: ["classic","novel","adventure","american"],
    chapters: [
      { id: '1', title: '哈克贝利·费恩历险记', cover: '/books/covers/哈克贝利·费恩历险记.webp', status: '已完结', txtUrl: '/books/texts/哈克贝利·费恩历险记/哈克贝利·费恩历险记.txt' },
    ]
  },
  {
    id: '哈姆雷特',
    title: '哈姆雷特',
    author: '莎士比亚',
    cover: '/books/covers/哈姆雷特.webp',
    description: '莎士比亚四大悲剧之首，丹麦王子复仇的永恒经典',
    tags: ["classic","drama","english"],
    chapters: [
      { id: '1', title: '哈姆雷特', cover: '/books/covers/哈姆雷特.webp', status: '已完结', txtUrl: '/books/texts/哈姆雷特/哈姆雷特.txt' },
    ]
  },
  {
    id: '地下室手记',
    title: '地下室手记',
    author: '陀思妥耶夫斯基',
    cover: '/books/covers/地下室手记.webp',
    description: '陀思妥耶夫斯基的中篇杰作，存在主义文学的先声',
    tags: ["classic","novel","philosophy","russian"],
    chapters: [
      { id: '1', title: '地下室手记', cover: '/books/covers/地下室手记.webp', status: '已完结', txtUrl: '/books/texts/地下室手记/地下室手记.txt' },
    ]
  },
  {
    id: '城堡',
    title: '城堡',
    author: '弗兰兹·卡夫卡',
    cover: '/books/covers/城堡.webp',
    description: '卡夫卡的长篇小说，讲述土地测量员K试图进入城堡的荒诞经历',
    tags: ["classic","novel","philosophy","german"],
    chapters: [
      { id: '1', title: '城堡', cover: '/books/covers/城堡.webp', status: '已完结', txtUrl: '/books/texts/城堡/城堡.txt' },
    ]
  },
  {
    id: '基督山伯爵',
    title: '基督山伯爵',
    author: '大仲马',
    cover: '/books/covers/基督山伯爵.webp',
    description: '大仲马最著名的通俗小说，讲述复仇与宽恕的史诗传奇',
    tags: ["classic","novel","adventure","french"],
    chapters: [
      { id: '1', title: '基督山伯爵', cover: '/books/covers/基督山伯爵.webp', status: '已完结', txtUrl: '/books/texts/基督山伯爵/基督山伯爵.txt' },
    ]
  },
  {
    id: '堂吉诃德',
    title: '堂吉诃德',
    author: '塞万提斯',
    cover: '/books/covers/堂吉诃德.webp',
    description: '西方文学史上第一部现代小说，讲述疯癫骑士的荒诞冒险',
    tags: ["classic","novel","adventure","spanish"],
    chapters: [
      { id: '1', title: '堂吉诃德', cover: '/books/covers/堂吉诃德.webp', status: '已完结', txtUrl: '/books/texts/堂吉诃德/堂吉诃德.txt' },
    ]
  },
  {
    id: '复活',
    title: '复活',
    author: '列夫·托尔斯泰',
    cover: '/books/covers/复活.webp',
    description: '托尔斯泰晚年的长篇小说，讲述贵族聂赫留朵夫的精神觉醒与救赎',
    tags: ["classic","novel","philosophy","russian"],
    chapters: [
      { id: '1', title: '复活', cover: '/books/covers/复活.webp', status: '已完结', txtUrl: '/books/texts/复活/复活.txt' },
    ]
  },
  {
    id: '外套',
    title: '外套',
    author: '果戈理',
    cover: '/books/covers/外套.webp',
    description: '果戈理的短篇杰作，圣彼得堡小官吏与一件外套的悲喜故事',
    tags: ["classic","short-story","russian"],
    chapters: [
      { id: '1', title: '外套', cover: '/books/covers/外套.webp', status: '已完结', txtUrl: '/books/texts/外套/外套.txt' },
    ]
  },
  {
    id: '大卫·科波菲尔',
    title: '大卫·科波菲尔',
    author: '查尔斯·狄更斯',
    cover: '/books/covers/大卫·科波菲尔.webp',
    description: '狄更斯最具自传色彩的长篇小说，讲述主人公从童年到成年的成长历程',
    tags: ["classic","novel","english"],
    chapters: [
      { id: '1', title: '大卫·科波菲尔', cover: '/books/covers/大卫·科波菲尔.webp', status: '已完结', txtUrl: '/books/texts/大卫·科波菲尔/大卫·科波菲尔.txt' },
    ]
  },
  {
    id: '契诃夫短篇小说集',
    title: '契诃夫短篇小说集',
    author: '契诃夫',
    cover: '/books/covers/契诃夫短篇小说集.webp',
    description: '俄国短篇小说大师契诃夫的经典作品集',
    tags: ["classic","short-story","russian"],
    chapters: [
      { id: '1', title: '契诃夫短篇小说集', cover: '/books/covers/契诃夫短篇小说集.webp', status: '已完结', txtUrl: '/books/texts/契诃夫短篇小说集/契诃夫短篇小说集.txt' },
    ]
  },
  {
    id: '奥赛罗',
    title: '奥赛罗',
    author: '莎士比亚',
    cover: '/books/covers/奥赛罗.webp',
    description: '莎士比亚四大悲剧之一，讲述摩尔将军奥赛罗因嫉妒而毁灭的故事',
    tags: ["classic","drama","english"],
    chapters: [
      { id: '1', title: '奥赛罗', cover: '/books/covers/奥赛罗.webp', status: '已完结', txtUrl: '/books/texts/奥赛罗/奥赛罗.txt' },
    ]
  },
  {
    id: '安娜·卡列尼娜',
    title: '安娜·卡列尼娜',
    author: '列夫·托尔斯泰',
    cover: '/books/covers/安娜·卡列尼娜.webp',
    description: '托尔斯泰的长篇巨著，被誉为最完美的小说，探讨爱情、婚姻与社会',
    tags: ["classic","novel","romance","russian"],
    chapters: [
      { id: '1', title: '安娜·卡列尼娜', cover: '/books/covers/安娜·卡列尼娜.webp', status: '已完结', txtUrl: '/books/texts/安娜·卡列尼娜/安娜·卡列尼娜.txt' },
    ]
  },
  {
    id: '安徒生童话',
    title: '安徒生童话',
    author: '安徒生',
    cover: '/books/covers/安徒生童话.webp',
    description: '丹麦童话大师安徒生的经典童话集，包含《丑小鸭》《海的女儿》等名篇',
    tags: ["classic","fairy-tale"],
    chapters: [
      { id: '1', title: '安徒生童话', cover: '/books/covers/安徒生童话.webp', status: '已完结', txtUrl: '/books/texts/安徒生童话/安徒生童话.txt' },
    ]
  },
  {
    id: '审判',
    title: '审判',
    author: '弗兰兹·卡夫卡',
    cover: '/books/covers/审判.webp',
    description: '卡夫卡的长篇小说，讲述银行职员约瑟夫·K被莫名审判的荒诞故事',
    tags: ["classic","novel","philosophy","german"],
    chapters: [
      { id: '1', title: '审判', cover: '/books/covers/审判.webp', status: '已完结', txtUrl: '/books/texts/审判/审判.txt' },
    ]
  },
  {
    id: '小王子',
    title: '小王子',
    author: '安托万·德·圣-埃克苏佩里',
    cover: '/books/covers/小王子.webp',
    description: '世界上最受欢迎的童话之一，用孩子的视角透视成人世界的荒诞',
    tags: ["classic","fairy-tale","philosophy","french"],
    chapters: [
      { id: '1', title: '小王子', cover: '/books/covers/小王子.webp', status: '已完结', txtUrl: '/books/texts/小王子/小王子.txt' },
    ]
  },
  {
    id: '少年维特的烦恼',
    title: '少年维特的烦恼',
    author: '歌德',
    cover: '/books/covers/少年维特的烦恼.webp',
    description: '歌德的书信体小说，一部感伤主义文学的经典之作',
    tags: ["classic","novel","romance","german"],
    chapters: [
      { id: '1', title: '少年维特的烦恼', cover: '/books/covers/少年维特的烦恼.webp', status: '已完结', txtUrl: '/books/texts/少年维特的烦恼/少年维特的烦恼.txt' },
    ]
  },
  {
    id: '尤利西斯',
    title: '尤利西斯',
    author: '詹姆斯·乔伊斯',
    cover: '/books/covers/尤利西斯.webp',
    description: '意识流文学的巅峰之作，以一天的时间框架映射整个西方文明',
    tags: ["classic","novel","english"],
    chapters: [
      { id: '1', title: '尤利西斯', cover: '/books/covers/尤利西斯.webp', status: '已完结', txtUrl: '/books/texts/尤利西斯/尤利西斯.txt' },
    ]
  },
  {
    id: '局外人',
    title: '局外人',
    author: '阿尔贝·加缪',
    cover: '/books/covers/局外人.webp',
    description: '加缪的存在主义代表作，讲述一个对世界冷漠疏离的普通人的故事',
    tags: ["classic","novel","philosophy","french"],
    chapters: [
      { id: '1', title: '局外人', cover: '/books/covers/局外人.webp', status: '已完结', txtUrl: '/books/texts/局外人/局外人.txt' },
    ]
  },
  {
    id: '巴黎圣母院',
    title: '巴黎圣母院',
    author: '维克多·雨果',
    cover: '/books/covers/巴黎圣母院.webp',
    description: '雨果的长篇小说，以十五世纪巴黎为背景，讲述钟楼怪人卡西莫多的悲剧',
    tags: ["classic","novel","french"],
    chapters: [
      { id: '1', title: '巴黎圣母院', cover: '/books/covers/巴黎圣母院.webp', status: '已完结', txtUrl: '/books/texts/巴黎圣母院/巴黎圣母院.txt' },
    ]
  },
  {
    id: '强盗',
    title: '强盗',
    author: '弗里德里希·席勒',
    cover: '/books/covers/强盗.webp',
    description: '席勒的成名戏剧，讲述贵族青年卡尔·摩尔反抗社会的叛逆故事',
    tags: ["classic","drama","german"],
    chapters: [
      { id: '1', title: '强盗', cover: '/books/covers/强盗.webp', status: '已完结', txtUrl: '/books/texts/强盗/强盗.txt' },
    ]
  },
  {
    id: '德伯家的苔丝',
    title: '德伯家的苔丝',
    author: '托马斯·哈代',
    cover: '/books/covers/德伯家的苔丝.webp',
    description: '哈代最著名的小说，讲述纯洁少女苔丝的悲剧命运',
    tags: ["classic","novel","english"],
    chapters: [
      { id: '1', title: '德伯家的苔丝', cover: '/books/covers/德伯家的苔丝.webp', status: '已完结', txtUrl: '/books/texts/德伯家的苔丝/德伯家的苔丝.txt' },
    ]
  },
  {
    id: '心',
    title: '心',
    author: '夏目漱石',
    cover: '/books/covers/心.webp',
    description: '夏目漱石的代表作，深入剖析人性中的孤独与利己主义',
    tags: ["classic","novel","philosophy","japanese"],
    chapters: [
      { id: '1', title: '心', cover: '/books/covers/心.webp', status: '已完结', txtUrl: '/books/texts/心/心.txt' },
    ]
  },
  {
    id: '快乐王子',
    title: '快乐王子',
    author: '奥斯卡·王尔德',
    cover: '/books/covers/快乐王子.webp',
    description: '王尔德最著名的童话，讲述快乐王子雕像与小燕子的感人故事',
    tags: ["classic","fairy-tale","english"],
    chapters: [
      { id: '1', title: '快乐王子', cover: '/books/covers/快乐王子.webp', status: '已完结', txtUrl: '/books/texts/快乐王子/快乐王子.txt' },
    ]
  },
  {
    id: '悉达多',
    title: '悉达多',
    author: '赫尔曼·黑塞',
    cover: '/books/covers/悉达多.webp',
    description: '黑塞的哲理小说，讲述古印度贵族青年寻求生命真谛的精神之旅',
    tags: ["classic","novel","philosophy","german"],
    chapters: [
      { id: '1', title: '悉达多', cover: '/books/covers/悉达多.webp', status: '已完结', txtUrl: '/books/texts/悉达多/悉达多.txt' },
    ]
  },
  {
    id: '悲惨世界',
    title: '悲惨世界',
    author: '维克多·雨果',
    cover: '/books/covers/悲惨世界.webp',
    description: '雨果的鸿篇巨制，讲述冉·阿让在苦难中寻求救赎的史诗故事',
    tags: ["classic","novel","french"],
    chapters: [
      { id: '1', title: '悲惨世界', cover: '/books/covers/悲惨世界.webp', status: '已完结', txtUrl: '/books/texts/悲惨世界/悲惨世界.txt' },
    ]
  },
  {
    id: '愤怒的葡萄',
    title: '愤怒的葡萄',
    author: '约翰·斯坦贝克',
    cover: '/books/covers/愤怒的葡萄.webp',
    description: '斯坦贝克的代表作，讲述大萧条时期乔德一家西迁求生的苦难历程',
    tags: ["classic","novel","american"],
    chapters: [
      { id: '1', title: '愤怒的葡萄', cover: '/books/covers/愤怒的葡萄.webp', status: '已完结', txtUrl: '/books/texts/愤怒的葡萄/愤怒的葡萄.txt' },
    ]
  },
  {
    id: '我是猫',
    title: '我是猫',
    author: '夏目漱石',
    cover: '/books/covers/我是猫.webp',
    description: '夏目漱石的成名作，以猫的视角讽刺明治时代日本社会的种种荒诞',
    tags: ["classic","novel","japanese"],
    chapters: [
      { id: '1', title: '我是猫', cover: '/books/covers/我是猫.webp', status: '已完结', txtUrl: '/books/texts/我是猫/我是猫.txt' },
    ]
  },
  {
    id: '战争与和平',
    title: '战争与和平',
    author: '列夫·托尔斯泰',
    cover: '/books/covers/战争与和平.webp',
    description: '托尔斯泰的史诗巨著，以拿破仑战争为背景描绘俄国社会的全景画卷',
    tags: ["classic","novel","russian"],
    chapters: [
      { id: '1', title: '战争与和平', cover: '/books/covers/战争与和平.webp', status: '已完结', txtUrl: '/books/texts/战争与和平/战争与和平.txt' },
    ]
  },
  {
    id: '时间机器',
    title: '时间机器',
    author: '赫伯特·威尔斯',
    cover: '/books/covers/时间机器.webp',
    description: '科幻小说的开山之作，讲述时间旅行者穿越到未来的奇异见闻',
    tags: ["classic","novel","english"],
    chapters: [
      { id: '1', title: '时间机器', cover: '/books/covers/时间机器.webp', status: '已完结', txtUrl: '/books/texts/时间机器/时间机器.txt' },
    ]
  },
  {
    id: '月亮与六便士',
    title: '月亮与六便士',
    author: '毛姆',
    cover: '/books/covers/月亮与六便士.webp',
    description: '毛姆的代表作，以高更为原型讲述一个证券经纪人抛弃一切追求艺术的故事',
    tags: ["classic","novel","english"],
    chapters: [
      { id: '1', title: '月亮与六便士', cover: '/books/covers/月亮与六便士.webp', status: '已完结', txtUrl: '/books/texts/月亮与六便士/月亮与六便士.txt' },
    ]
  },
  {
    id: '杀死一只知更鸟',
    title: '杀死一只知更鸟',
    author: '哈珀·李',
    cover: '/books/covers/杀死一只知更鸟.webp',
    description: '美国现代文学经典，通过孩子的视角探讨种族歧视与正义',
    tags: ["classic","novel","american"],
    chapters: [
      { id: '1', title: '杀死一只知更鸟', cover: '/books/covers/杀死一只知更鸟.webp', status: '已完结', txtUrl: '/books/texts/杀死一只知更鸟/杀死一只知更鸟.txt' },
    ]
  },
  {
    id: '李尔王',
    title: '李尔王',
    author: '莎士比亚',
    cover: '/books/covers/李尔王.webp',
    description: '莎士比亚四大悲剧之一，讲述不列颠国王李尔王因轻信而酿成的家庭悲剧',
    tags: ["classic","drama","english"],
    chapters: [
      { id: '1', title: '李尔王', cover: '/books/covers/李尔王.webp', status: '已完结', txtUrl: '/books/texts/李尔王/李尔王.txt' },
    ]
  },
  {
    id: '欧也妮·葛朗台',
    title: '欧也妮·葛朗台',
    author: '巴尔扎克',
    cover: '/books/covers/欧也妮·葛朗台.webp',
    description: '巴尔扎克《人间喜剧》中的名篇，讲述守财奴葛朗台与女儿的悲剧',
    tags: ["classic","novel","french"],
    chapters: [
      { id: '1', title: '欧也妮·葛朗台', cover: '/books/covers/欧也妮·葛朗台.webp', status: '已完结', txtUrl: '/books/texts/欧也妮·葛朗台/欧也妮·葛朗台.txt' },
    ]
  },
  {
    id: '死魂灵',
    title: '死魂灵',
    author: '果戈理',
    cover: '/books/covers/死魂灵.webp',
    description: '果戈理的长篇讽刺小说，讲述乞乞科夫收购死农奴的荒诞故事',
    tags: ["classic","novel","russian"],
    chapters: [
      { id: '1', title: '死魂灵', cover: '/books/covers/死魂灵.webp', status: '已完结', txtUrl: '/books/texts/死魂灵/死魂灵.txt' },
    ]
  },
  {
    id: '永别了，武器',
    title: '永别了，武器',
    author: '欧内斯特·海明威',
    cover: '/books/covers/永别了，武器.webp',
    description: '海明威的反战小说，以一战为背景讲述战争中的爱情与幻灭',
    tags: ["classic","novel","romance","american"],
    chapters: [
      { id: '1', title: '永别了，武器', cover: '/books/covers/永别了，武器.webp', status: '已完结', txtUrl: '/books/texts/永别了，武器/永别了，武器.txt' },
    ]
  },
  {
    id: '汤姆·索亚历险记',
    title: '汤姆·索亚历险记',
    author: '马克·吐温',
    cover: '/books/covers/汤姆·索亚历险记.webp',
    description: '马克·吐温的儿童冒险小说，讲述调皮男孩汤姆的密西西比河畔冒险',
    tags: ["classic","novel","adventure","american"],
    chapters: [
      { id: '1', title: '汤姆·索亚历险记', cover: '/books/covers/汤姆·索亚历险记.webp', status: '已完结', txtUrl: '/books/texts/汤姆·索亚历险记/汤姆·索亚历险记.txt' },
    ]
  },
  {
    id: '洛丽塔',
    title: '洛丽塔',
    author: '弗拉基米尔·纳博科夫',
    cover: '/books/covers/洛丽塔.webp',
    description: '纳博科夫最具争议的小说，以华丽的文笔讲述一段禁忌之恋',
    tags: ["classic","novel","american"],
    chapters: [
      { id: '1', title: '洛丽塔', cover: '/books/covers/洛丽塔.webp', status: '已完结', txtUrl: '/books/texts/洛丽塔/洛丽塔.txt' },
    ]
  },
  {
    id: '浮士德',
    title: '浮士德',
    author: '歌德',
    cover: '/books/covers/浮士德.webp',
    description: '歌德毕生心血之作，讲述学者浮士德与魔鬼梅菲斯特的交易',
    tags: ["classic","drama","philosophy","german"],
    chapters: [
      { id: '1', title: '浮士德', cover: '/books/covers/浮士德.webp', status: '已完结', txtUrl: '/books/texts/浮士德/浮士德.txt' },
    ]
  },
  {
    id: '爱玛',
    title: '爱玛',
    author: '简·奥斯汀',
    cover: '/books/covers/爱玛.webp',
    description: '奥斯汀的成熟之作，讲述自作聪明的爱玛在爱情中成长的故事',
    tags: ["classic","novel","romance","english"],
    chapters: [
      { id: '1', title: '爱玛', cover: '/books/covers/爱玛.webp', status: '已完结', txtUrl: '/books/texts/爱玛/爱玛.txt' },
    ]
  },
  {
    id: '玩偶之家',
    title: '玩偶之家',
    author: '易卜生',
    cover: '/books/covers/玩偶之家.webp',
    description: '易卜生最著名的戏剧，讲述娜拉觉醒并出走的故事，女性主义文学先驱',
    tags: ["classic","drama"],
    chapters: [
      { id: '1', title: '玩偶之家', cover: '/books/covers/玩偶之家.webp', status: '已完结', txtUrl: '/books/texts/玩偶之家/玩偶之家.txt' },
    ]
  },
  {
    id: '理智与情感',
    title: '理智与情感',
    author: '简·奥斯汀',
    cover: '/books/covers/理智与情感.webp',
    description: '奥斯汀的处女作，讲述达什伍德姐妹截然不同的爱情观',
    tags: ["classic","novel","romance","english"],
    chapters: [
      { id: '1', title: '理智与情感', cover: '/books/covers/理智与情感.webp', status: '已完结', txtUrl: '/books/texts/理智与情感/理智与情感.txt' },
    ]
  },
  {
    id: '生命中不能承受之轻',
    title: '生命中不能承受之轻',
    author: '米兰·昆德拉',
    cover: '/books/covers/生命中不能承受之轻.webp',
    description: '昆德拉的代表作，以布拉格之春为背景探讨生命的轻与重',
    tags: ["classic","novel","philosophy"],
    chapters: [
      { id: '1', title: '生命中不能承受之轻', cover: '/books/covers/生命中不能承受之轻.webp', status: '已完结', txtUrl: '/books/texts/生命中不能承受之轻/生命中不能承受之轻.txt' },
    ]
  },
  {
    id: '白痴',
    title: '白痴',
    author: '陀思妥耶夫斯基',
    cover: '/books/covers/白痴.webp',
    description: '陀思妥耶夫斯基的长篇小说，讲述纯真善良的梅什金公爵的悲剧命运',
    tags: ["classic","novel","russian"],
    chapters: [
      { id: '1', title: '白痴', cover: '/books/covers/白痴.webp', status: '已完结', txtUrl: '/books/texts/白痴/白痴.txt' },
    ]
  },
  {
    id: '白鲸',
    title: '白鲸',
    author: '赫尔曼·梅尔维尔',
    cover: '/books/covers/白鲸.webp',
    description: '美国文学的史诗巨著，讲述亚哈船长追逐白鲸莫比·迪克的执念',
    tags: ["classic","novel","adventure","american"],
    chapters: [
      { id: '1', title: '白鲸', cover: '/books/covers/白鲸.webp', status: '已完结', txtUrl: '/books/texts/白鲸/白鲸.txt' },
    ]
  },
  {
    id: '百年孤独',
    title: '百年孤独',
    author: '加西亚·马尔克斯',
    cover: '/books/covers/百年孤独.webp',
    description: '魔幻现实主义的巅峰之作，讲述布恩迪亚家族七代人的传奇故事',
    tags: ["classic","novel","latin-american"],
    chapters: [
      { id: '1', title: '百年孤独', cover: '/books/covers/百年孤独.webp', status: '已完结', txtUrl: '/books/texts/百年孤独/百年孤独.txt' },
    ]
  },
  {
    id: '神曲',
    title: '神曲',
    author: '但丁',
    cover: '/books/covers/神曲.webp',
    description: '中世纪最伟大的文学作品，但丁游历地狱、炼狱和天堂的灵魂之旅',
    tags: ["classic","poetry","philosophy","italian"],
    chapters: [
      { id: '1', title: '神曲', cover: '/books/covers/神曲.webp', status: '已完结', txtUrl: '/books/texts/神曲/神曲.txt' },
    ]
  },
  {
    id: '福尔摩斯探案集',
    title: '福尔摩斯探案集',
    author: '阿瑟·柯南·道尔',
    cover: '/books/covers/福尔摩斯探案集.webp',
    description: '侦探小说的经典之作，讲述大侦探福尔摩斯与华生的探案故事',
    tags: ["classic","short-story","detective","english"],
    chapters: [
      { id: '1', title: '福尔摩斯探案集', cover: '/books/covers/福尔摩斯探案集.webp', status: '已完结', txtUrl: '/books/texts/福尔摩斯探案集/福尔摩斯探案集.txt' },
    ]
  },
  {
    id: '等待戈多',
    title: '等待戈多',
    author: '塞缪尔·贝克特',
    cover: '/books/covers/等待戈多.webp',
    description: '荒诞派戏剧的代表作，两个人在无尽等待中展开的哲学对话',
    tags: ["classic","drama","philosophy"],
    chapters: [
      { id: '1', title: '等待戈多', cover: '/books/covers/等待戈多.webp', status: '已完结', txtUrl: '/books/texts/等待戈多/等待戈多.txt' },
    ]
  },
  {
    id: '简·爱',
    title: '简·爱',
    author: '夏洛蒂·勃朗特',
    cover: '/books/covers/简·爱.webp',
    description: '英国文学经典，讲述孤女简·爱追求自由与尊严的独立女性故事',
    tags: ["classic","novel","romance","english"],
    chapters: [
      { id: '1', title: '简·爱', cover: '/books/covers/简·爱.webp', status: '已完结', txtUrl: '/books/texts/简·爱/简·爱.txt' },
    ]
  },
  {
    id: '红与黑',
    title: '红与黑',
    author: '司汤达',
    cover: '/books/covers/红与黑.webp',
    description: '法国批判现实主义文学的奠基之作，讲述于连的野心与爱情',
    tags: ["classic","novel","romance","french"],
    chapters: [
      { id: '1', title: '红与黑', cover: '/books/covers/红与黑.webp', status: '已完结', txtUrl: '/books/texts/红与黑/红与黑.txt' },
    ]
  },
  {
    id: '红字',
    title: '红字',
    author: '纳撒尼尔·霍桑',
    cover: '/books/covers/红字.webp',
    description: '美国文学的经典，讲述清教徒社会中一个女人佩戴红字A的赎罪故事',
    tags: ["classic","novel","american"],
    chapters: [
      { id: '1', title: '红字', cover: '/books/covers/红字.webp', status: '已完结', txtUrl: '/books/texts/红字/红字.txt' },
    ]
  },
  {
    id: '红花侠',
    title: '红花侠',
    author: '奥希兹女男爵',
    cover: '/books/covers/红花侠.webp',
    description: '冒险小说经典，讲述法国大革命时期神秘贵族红花侠的救援行动',
    tags: ["classic","novel","adventure","english"],
    chapters: [
      { id: '1', title: '红花侠', cover: '/books/covers/红花侠.webp', status: '已完结', txtUrl: '/books/texts/红花侠/红花侠.txt' },
    ]
  },
  {
    id: '罗密欧与朱丽叶',
    title: '罗密欧与朱丽叶',
    author: '莎士比亚',
    cover: '/books/covers/罗密欧与朱丽叶.webp',
    description: '莎士比亚最著名的爱情悲剧，两个家族仇人的年轻恋人殉情而死',
    tags: ["classic","drama","romance","english"],
    chapters: [
      { id: '1', title: '罗密欧与朱丽叶', cover: '/books/covers/罗密欧与朱丽叶.webp', status: '已完结', txtUrl: '/books/texts/罗密欧与朱丽叶/罗密欧与朱丽叶.txt' },
    ]
  },
  {
    id: '罪与罚',
    title: '罪与罚',
    author: '陀思妥耶夫斯基',
    cover: '/books/covers/罪与罚.webp',
    description: '陀思妥耶夫斯基的代表作，讲述穷大学生拉斯柯尔尼科夫的犯罪与救赎',
    tags: ["classic","novel","philosophy","russian"],
    chapters: [
      { id: '1', title: '罪与罚', cover: '/books/covers/罪与罚.webp', status: '已完结', txtUrl: '/books/texts/罪与罚/罪与罚.txt' },
    ]
  },
  {
    id: '羊脂球',
    title: '羊脂球',
    author: '莫泊桑',
    cover: '/books/covers/羊脂球.webp',
    description: '莫泊桑的成名短篇，普法战争中一个妓女的高尚与乘客的卑劣形成对比',
    tags: ["classic","short-story","french"],
    chapters: [
      { id: '1', title: '羊脂球', cover: '/books/covers/羊脂球.webp', status: '已完结', txtUrl: '/books/texts/羊脂球/羊脂球.txt' },
    ]
  },
  {
    id: '美丽新世界',
    title: '美丽新世界',
    author: '阿道司·赫胥黎',
    cover: '/books/covers/美丽新世界.webp',
    description: '反乌托邦经典三部曲之一，描绘一个以科技控制人类的未来社会',
    tags: ["classic","novel","dystopia","english"],
    chapters: [
      { id: '1', title: '美丽新世界', cover: '/books/covers/美丽新世界.webp', status: '已完结', txtUrl: '/books/texts/美丽新世界/美丽新世界.txt' },
    ]
  },
  {
    id: '群鬼',
    title: '群鬼',
    author: '易卜生',
    cover: '/books/covers/群鬼.webp',
    description: '易卜生的社会问题剧，揭露维多利亚时代道德伪善的悲剧',
    tags: ["classic","drama"],
    chapters: [
      { id: '1', title: '群鬼', cover: '/books/covers/群鬼.webp', status: '已完结', txtUrl: '/books/texts/群鬼/群鬼.txt' },
    ]
  },
  {
    id: '老人与海',
    title: '老人与海',
    author: '欧内斯特·海明威',
    cover: '/books/covers/老人与海.webp',
    description: '海明威的诺贝尔奖之作，讲述古巴老渔夫与大马林鱼的搏斗',
    tags: ["classic","novel","american"],
    chapters: [
      { id: '1', title: '老人与海', cover: '/books/covers/老人与海.webp', status: '已完结', txtUrl: '/books/texts/老人与海/老人与海.txt' },
    ]
  },
  {
    id: '茶花女',
    title: '茶花女',
    author: '小仲马',
    cover: '/books/covers/茶花女.webp',
    description: '法国文学经典爱情悲剧，讲述巴黎名妓玛格丽特的凄美爱情',
    tags: ["classic","novel","romance","french"],
    chapters: [
      { id: '1', title: '茶花女', cover: '/books/covers/茶花女.webp', status: '已完结', txtUrl: '/books/texts/茶花女/茶花女.txt' },
    ]
  },
  {
    id: '荒原狼',
    title: '荒原狼',
    author: '赫尔曼·黑塞',
    cover: '/books/covers/荒原狼.webp',
    description: '黑塞的代表作，讲述一个知识分子在精神分裂中寻找自我',
    tags: ["classic","novel","philosophy","german"],
    chapters: [
      { id: '1', title: '荒原狼', cover: '/books/covers/荒原狼.webp', status: '已完结', txtUrl: '/books/texts/荒原狼/荒原狼.txt' },
    ]
  },
  {
    id: '蝇王',
    title: '蝇王',
    author: '威廉·戈尔丁',
    cover: '/books/covers/蝇王.webp',
    description: '戈尔丁的寓言小说，讲述一群荒岛求生的少年如何退化为野蛮人',
    tags: ["classic","novel","english"],
    chapters: [
      { id: '1', title: '蝇王', cover: '/books/covers/蝇王.webp', status: '已完结', txtUrl: '/books/texts/蝇王/蝇王.txt' },
    ]
  },
  {
    id: '远大前程',
    title: '远大前程',
    author: '查尔斯·狄更斯',
    cover: '/books/covers/远大前程.webp',
    description: '狄更斯的成熟之作，讲述孤儿皮普从卑微到幻灭的成长历程',
    tags: ["classic","novel","english"],
    chapters: [
      { id: '1', title: '远大前程', cover: '/books/covers/远大前程.webp', status: '已完结', txtUrl: '/books/texts/远大前程/远大前程.txt' },
    ]
  },
  {
    id: '远离尘嚣',
    title: '远离尘嚣',
    author: '托马斯·哈代',
    cover: '/books/covers/远离尘嚣.webp',
    description: '哈代的成名作，讲述美丽独立的芭丝谢芭与三个追求者的爱情纠葛',
    tags: ["classic","novel","romance","english"],
    chapters: [
      { id: '1', title: '远离尘嚣', cover: '/books/covers/远离尘嚣.webp', status: '已完结', txtUrl: '/books/texts/远离尘嚣/远离尘嚣.txt' },
    ]
  },
  {
    id: '道林·格雷的画像',
    title: '道林·格雷的画像',
    author: '奥斯卡·王尔德',
    cover: '/books/covers/道林·格雷的画像.webp',
    description: '王尔德唯一的小说，讲述一个美少年的画像替他衰老的寓言故事',
    tags: ["classic","novel","philosophy","english"],
    chapters: [
      { id: '1', title: '道林·格雷的画像', cover: '/books/covers/道林·格雷的画像.webp', status: '已完结', txtUrl: '/books/texts/道林·格雷的画像/道林·格雷的画像.txt' },
    ]
  },
  {
    id: '都柏林人',
    title: '都柏林人',
    author: '詹姆斯·乔伊斯',
    cover: '/books/covers/都柏林人.webp',
    description: '乔伊斯的短篇小说集，以十五个故事描绘都柏林市民的精神瘫痪',
    tags: ["classic","short-story","english"],
    chapters: [
      { id: '1', title: '都柏林人', cover: '/books/covers/都柏林人.webp', status: '已完结', txtUrl: '/books/texts/都柏林人/都柏林人.txt' },
    ]
  },
  {
    id: '金阁寺',
    title: '金阁寺',
    author: '三岛由纪夫',
    cover: '/books/covers/金阁寺.webp',
    description: '三岛由纪夫的代表作，讲述口吃僧人放火烧毁金阁寺的真实事件改编',
    tags: ["classic","novel","philosophy","japanese"],
    chapters: [
      { id: '1', title: '金阁寺', cover: '/books/covers/金阁寺.webp', status: '已完结', txtUrl: '/books/texts/金阁寺/金阁寺.txt' },
    ]
  },
  {
    id: '银河铁道之夜',
    title: '银河铁道之夜',
    author: '宫泽贤治',
    cover: '/books/covers/银河铁道之夜.webp',
    description: '宫泽贤治最著名的童话，讲述少年乔万尼在银河列车上的奇幻旅程',
    tags: ["classic","fairy-tale","japanese"],
    chapters: [
      { id: '1', title: '银河铁道之夜', cover: '/books/covers/银河铁道之夜.webp', status: '已完结', txtUrl: '/books/texts/银河铁道之夜/银河铁道之夜.txt' },
    ]
  },
  {
    id: '阴谋与爱情',
    title: '阴谋与爱情',
    author: '弗里德里希·席勒',
    cover: '/books/covers/阴谋与爱情.webp',
    description: '席勒的市民悲剧，讲述宰相之子与乐师之女被阴谋摧毁的爱情',
    tags: ["classic","drama","romance","german"],
    chapters: [
      { id: '1', title: '阴谋与爱情', cover: '/books/covers/阴谋与爱情.webp', status: '已完结', txtUrl: '/books/texts/阴谋与爱情/阴谋与爱情.txt' },
    ]
  },
  {
    id: '隐身人',
    title: '隐身人',
    author: '赫伯特·威尔斯',
    cover: '/books/covers/隐身人.webp',
    description: '威尔斯的科幻经典，讲述一个科学家发明隐身术后的疯狂与毁灭',
    tags: ["classic","novel","english"],
    chapters: [
      { id: '1', title: '隐身人', cover: '/books/covers/隐身人.webp', status: '已完结', txtUrl: '/books/texts/隐身人/隐身人.txt' },
    ]
  },
  {
    id: '雪国',
    title: '雪国',
    author: '川端康成',
    cover: '/books/covers/雪国.webp',
    description: '川端康成的诺贝尔奖之作，讲述东京男子与雪国艺伎的虚幻爱情',
    tags: ["classic","novel","romance","japanese"],
    chapters: [
      { id: '1', title: '雪国', cover: '/books/covers/雪国.webp', status: '已完结', txtUrl: '/books/texts/雪国/雪国.txt' },
    ]
  },
  {
    id: '雾都孤儿',
    title: '雾都孤儿',
    author: '查尔斯·狄更斯',
    cover: '/books/covers/雾都孤儿.webp',
    description: '狄更斯的早期代表作，讲述孤儿奥利弗在伦敦的苦难经历',
    tags: ["classic","novel","english"],
    chapters: [
      { id: '1', title: '雾都孤儿', cover: '/books/covers/雾都孤儿.webp', status: '已完结', txtUrl: '/books/texts/雾都孤儿/雾都孤儿.txt' },
    ]
  },
  {
    id: '霍乱时期的爱情',
    title: '霍乱时期的爱情',
    author: '加西亚·马尔克斯',
    cover: '/books/covers/霍乱时期的爱情.webp',
    description: '马尔克斯的爱情史诗，讲述一段跨越半个多世纪的忠贞不渝的爱情',
    tags: ["classic","novel","romance","latin-american"],
    chapters: [
      { id: '1', title: '霍乱时期的爱情', cover: '/books/covers/霍乱时期的爱情.webp', status: '已完结', txtUrl: '/books/texts/霍乱时期的爱情/霍乱时期的爱情.txt' },
    ]
  },
  {
    id: '飘',
    title: '飘',
    author: '玛格丽特·米切尔',
    cover: '/books/covers/飘.webp',
    description: '以美国南北战争为背景的史诗爱情小说，讲述斯嘉丽的坚韧与爱情',
    tags: ["classic","novel","romance","american"],
    chapters: [
      { id: '1', title: '飘', cover: '/books/covers/飘.webp', status: '已完结', txtUrl: '/books/texts/飘/飘.txt' },
    ]
  },
  {
    id: '高老头',
    title: '高老头',
    author: '巴尔扎克',
    cover: '/books/covers/高老头.webp',
    description: '巴尔扎克《人间喜剧》的核心作品，讲述父爱的极端与青年的堕落',
    tags: ["classic","novel","french"],
    chapters: [
      { id: '1', title: '高老头', cover: '/books/covers/高老头.webp', status: '已完结', txtUrl: '/books/texts/高老头/高老头.txt' },
    ]
  },
  {
    id: '麦克白',
    title: '麦克白',
    author: '莎士比亚',
    cover: '/books/covers/麦克白.webp',
    description: '莎士比亚四大悲剧之一，讲述苏格兰将军麦克白因野心而走向毁灭',
    tags: ["classic","drama","english"],
    chapters: [
      { id: '1', title: '麦克白', cover: '/books/covers/麦克白.webp', status: '已完结', txtUrl: '/books/texts/麦克白/麦克白.txt' },
    ]
  },
  {
    id: '麦田里的守望者',
    title: '麦田里的守望者',
    author: 'J.D.塞林格',
    cover: '/books/covers/麦田里的守望者.webp',
    description: '美国青春文学经典，讲述叛逆少年霍尔顿在纽约的两天游荡',
    tags: ["classic","novel","american"],
    chapters: [
      { id: '1', title: '麦田里的守望者', cover: '/books/covers/麦田里的守望者.webp', status: '已完结', txtUrl: '/books/texts/麦田里的守望者/麦田里的守望者.txt' },
    ]
  },
  {
    id: '鼠疫',
    title: '鼠疫',
    author: '阿尔贝·加缪',
    cover: '/books/covers/鼠疫.webp',
    description: '加缪的长篇寓言小说，以北非城市爆发鼠疫隐喻人类面对荒诞的态度',
    tags: ["classic","novel","philosophy","french"],
    chapters: [
      { id: '1', title: '鼠疫', cover: '/books/covers/鼠疫.webp', status: '已完结', txtUrl: '/books/texts/鼠疫/鼠疫.txt' },
    ]
  },
]

export function getBookById(id: string): Book | undefined {
  return books.find(book => book.id === id)
}