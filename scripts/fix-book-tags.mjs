import { readFileSync, writeFileSync } from 'fs'

const BOOK_META = {
  '三个火枪手': { author: '大仲马', description: '法国浪漫主义作家大仲马的代表作，讲述达达尼昂与三位火枪手的冒险故事', tags: ['classic', 'novel', 'adventure', 'french'] },
  '了不起的盖茨比': { author: '菲茨杰拉德', description: '美国作家菲茨杰拉德的代表作，描绘美国梦的幻灭', tags: ['classic', 'novel', 'american'] },
  '仲夏夜之梦': { author: '莎士比亚', description: '莎士比亚最著名的喜剧之一，讲述雅典城外森林中的奇幻爱情故事', tags: ['classic', 'drama', 'romance', 'english'] },
  '傲慢与偏见': { author: '简·奥斯汀', description: '英国文学史上最受欢迎的小说之一，讲述伊丽莎白与达西的爱情故事', tags: ['classic', 'novel', 'romance', 'english'] },
  '动物农场': { author: '乔治·奥威尔', description: '一部政治讽刺寓言，以动物革命隐喻极权主义的兴起', tags: ['classic', 'novel', 'dystopia', 'english'] },
  '包法利夫人': { author: '福楼拜', description: '法国现实主义文学的里程碑，讲述农家女爱玛的悲剧人生', tags: ['classic', 'novel', 'french'] },
  '十日谈': { author: '薄伽丘', description: '欧洲文学史上第一部现实主义巨著，以十个青年讲故事的形式展开', tags: ['classic', 'short-story', 'italian'] },
  '卡拉马佐夫兄弟': { author: '陀思妥耶夫斯基', description: '陀思妥耶夫斯基的巅峰之作，探讨信仰、理性和自由意志的终极冲突', tags: ['classic', 'novel', 'philosophy', 'russian'] },
  '双城记': { author: '查尔斯·狄更斯', description: '以法国大革命为背景的历史小说，开篇即是文学史上最著名的引言之一', tags: ['classic', 'novel', 'english'] },
  '变形记': { author: '弗兰兹·卡夫卡', description: '卡夫卡最著名的中篇小说，讲述推销员格里高尔变成甲虫的荒诞故事', tags: ['classic', 'novel', 'philosophy', 'german'] },
  '叶甫盖尼·奥涅金': { author: '普希金', description: '普希金的诗体小说，俄国现实主义文学的奠基之作', tags: ['classic', 'poetry', 'russian'] },
  '呼啸山庄': { author: '艾米莉·勃朗特', description: '英国文学史上最伟大的爱情悲剧之一，讲述希斯克利夫与凯瑟琳的爱恨纠葛', tags: ['classic', 'novel', 'romance', 'english'] },
  '哈克贝利·费恩历险记': { author: '马克·吐温', description: '马克·吐温的代表作，美国文学的源头之一，讲述少年哈克的密西西比河冒险', tags: ['classic', 'novel', 'adventure', 'american'] },
  '哈姆雷特': { author: '莎士比亚', description: '莎士比亚四大悲剧之首，丹麦王子复仇的永恒经典', tags: ['classic', 'drama', 'english'] },
  '地下室手记': { author: '陀思妥耶夫斯基', description: '陀思妥耶夫斯基的中篇杰作，存在主义文学的先声', tags: ['classic', 'novel', 'philosophy', 'russian'] },
  '城堡': { author: '弗兰兹·卡夫卡', description: '卡夫卡的长篇小说，讲述土地测量员K试图进入城堡的荒诞经历', tags: ['classic', 'novel', 'philosophy', 'german'] },
  '基督山伯爵': { author: '大仲马', description: '大仲马最著名的通俗小说，讲述复仇与宽恕的史诗传奇', tags: ['classic', 'novel', 'adventure', 'french'] },
  '堂吉诃德': { author: '塞万提斯', description: '西方文学史上第一部现代小说，讲述疯癫骑士的荒诞冒险', tags: ['classic', 'novel', 'adventure', 'spanish'] },
  '复活': { author: '列夫·托尔斯泰', description: '托尔斯泰晚年的长篇小说，讲述贵族聂赫留朵夫的精神觉醒与救赎', tags: ['classic', 'novel', 'philosophy', 'russian'] },
  '外套': { author: '果戈理', description: '果戈理的短篇杰作，圣彼得堡小官吏与一件外套的悲喜故事', tags: ['classic', 'short-story', 'russian'] },
  '大卫·科波菲尔': { author: '查尔斯·狄更斯', description: '狄更斯最具自传色彩的长篇小说，讲述主人公从童年到成年的成长历程', tags: ['classic', 'novel', 'english'] },
  '契诃夫短篇小说集': { author: '契诃夫', description: '俄国短篇小说大师契诃夫的经典作品集', tags: ['classic', 'short-story', 'russian'] },
  '奥赛罗': { author: '莎士比亚', description: '莎士比亚四大悲剧之一，讲述摩尔将军奥赛罗因嫉妒而毁灭的故事', tags: ['classic', 'drama', 'english'] },
  '安娜·卡列尼娜': { author: '列夫·托尔斯泰', description: '托尔斯泰的长篇巨著，被誉为最完美的小说，探讨爱情、婚姻与社会', tags: ['classic', 'novel', 'romance', 'russian'] },
  '安徒生童话': { author: '安徒生', description: '丹麦童话大师安徒生的经典童话集，包含《丑小鸭》《海的女儿》等名篇', tags: ['classic', 'fairy-tale'] },
  '审判': { author: '弗兰兹·卡夫卡', description: '卡夫卡的长篇小说，讲述银行职员约瑟夫·K被莫名审判的荒诞故事', tags: ['classic', 'novel', 'philosophy', 'german'] },
  '小王子': { author: '安托万·德·圣-埃克苏佩里', description: '世界上最受欢迎的童话之一，用孩子的视角透视成人世界的荒诞', tags: ['classic', 'fairy-tale', 'philosophy', 'french'] },
  '少年维特的烦恼': { author: '歌德', description: '歌德的书信体小说，一部感伤主义文学的经典之作', tags: ['classic', 'novel', 'romance', 'german'] },
  '尤利西斯': { author: '詹姆斯·乔伊斯', description: '意识流文学的巅峰之作，以一天的时间框架映射整个西方文明', tags: ['classic', 'novel', 'english'] },
  '局外人': { author: '阿尔贝·加缪', description: '加缪的存在主义代表作，讲述一个对世界冷漠疏离的普通人的故事', tags: ['classic', 'novel', 'philosophy', 'french'] },
  '巴黎圣母院': { author: '维克多·雨果', description: '雨果的长篇小说，以十五世纪巴黎为背景，讲述钟楼怪人卡西莫多的悲剧', tags: ['classic', 'novel', 'french'] },
  '强盗': { author: '弗里德里希·席勒', description: '席勒的成名戏剧，讲述贵族青年卡尔·摩尔反抗社会的叛逆故事', tags: ['classic', 'drama', 'german'] },
  '德伯家的苔丝': { author: '托马斯·哈代', description: '哈代最著名的小说，讲述纯洁少女苔丝的悲剧命运', tags: ['classic', 'novel', 'english'] },
  '心': { author: '夏目漱石', description: '夏目漱石的代表作，深入剖析人性中的孤独与利己主义', tags: ['classic', 'novel', 'philosophy', 'japanese'] },
  '快乐王子': { author: '奥斯卡·王尔德', description: '王尔德最著名的童话，讲述快乐王子雕像与小燕子的感人故事', tags: ['classic', 'fairy-tale', 'english'] },
  '悉达多': { author: '赫尔曼·黑塞', description: '黑塞的哲理小说，讲述古印度贵族青年寻求生命真谛的精神之旅', tags: ['classic', 'novel', 'philosophy', 'german'] },
  '悲惨世界': { author: '维克多·雨果', description: '雨果的鸿篇巨制，讲述冉·阿让在苦难中寻求救赎的史诗故事', tags: ['classic', 'novel', 'french'] },
  '愤怒的葡萄': { author: '约翰·斯坦贝克', description: '斯坦贝克的代表作，讲述大萧条时期乔德一家西迁求生的苦难历程', tags: ['classic', 'novel', 'american'] },
  '我是猫': { author: '夏目漱石', description: '夏目漱石的成名作，以猫的视角讽刺明治时代日本社会的种种荒诞', tags: ['classic', 'novel', 'japanese'] },
  '战争与和平': { author: '列夫·托尔斯泰', description: '托尔斯泰的史诗巨著，以拿破仑战争为背景描绘俄国社会的全景画卷', tags: ['classic', 'novel', 'russian'] },
  '时间机器': { author: '赫伯特·威尔斯', description: '科幻小说的开山之作，讲述时间旅行者穿越到未来的奇异见闻', tags: ['classic', 'novel', 'english'] },
  '月亮与六便士': { author: '毛姆', description: '毛姆的代表作，以高更为原型讲述一个证券经纪人抛弃一切追求艺术的故事', tags: ['classic', 'novel', 'english'] },
  '杀死一只知更鸟': { author: '哈珀·李', description: '美国现代文学经典，通过孩子的视角探讨种族歧视与正义', tags: ['classic', 'novel', 'american'] },
  '李尔王': { author: '莎士比亚', description: '莎士比亚四大悲剧之一，讲述不列颠国王李尔王因轻信而酿成的家庭悲剧', tags: ['classic', 'drama', 'english'] },
  '欧也妮·葛朗台': { author: '巴尔扎克', description: '巴尔扎克《人间喜剧》中的名篇，讲述守财奴葛朗台与女儿的悲剧', tags: ['classic', 'novel', 'french'] },
  '死魂灵': { author: '果戈理', description: '果戈理的长篇讽刺小说，讲述乞乞科夫收购死农奴的荒诞故事', tags: ['classic', 'novel', 'russian'] },
  '永别了，武器': { author: '欧内斯特·海明威', description: '海明威的反战小说，以一战为背景讲述战争中的爱情与幻灭', tags: ['classic', 'novel', 'romance', 'american'] },
  '汤姆·索亚历险记': { author: '马克·吐温', description: '马克·吐温的儿童冒险小说，讲述调皮男孩汤姆的密西西比河畔冒险', tags: ['classic', 'novel', 'adventure', 'american'] },
  '洛丽塔': { author: '弗拉基米尔·纳博科夫', description: '纳博科夫最具争议的小说，以华丽的 prose 讲述一段禁忌之恋', tags: ['classic', 'novel', 'american'] },
  '浮士德': { author: '歌德', description: '歌德毕生心血之作，讲述学者浮士德与魔鬼梅菲斯特的交易', tags: ['classic', 'drama', 'philosophy', 'german'] },
  '爱玛': { author: '简·奥斯汀', description: '奥斯汀的成熟之作，讲述自作聪明的爱玛在爱情中成长的故事', tags: ['classic', 'novel', 'romance', 'english'] },
  '玩偶之家': { author: '易卜生', description: '易卜生最著名的戏剧，讲述娜拉觉醒并出走的故事，女性主义文学先驱', tags: ['classic', 'drama'] },
  '理智与情感': { author: '简·奥斯汀', description: '奥斯汀的处女作，讲述达什伍德姐妹截然不同的爱情观', tags: ['classic', 'novel', 'romance', 'english'] },
  '生命中不能承受之轻': { author: '米兰·昆德拉', description: '昆德拉的代表作，以布拉格之春为背景探讨生命的轻与重', tags: ['classic', 'novel', 'philosophy'] },
  '白痴': { author: '陀思妥耶夫斯基', description: '陀思妥耶夫斯基的长篇小说，讲述纯真善良的梅什金公爵的悲剧命运', tags: ['classic', 'novel', 'russian'] },
  '白鲸': { author: '赫尔曼·梅尔维尔', description: '美国文学的史诗巨著，讲述亚哈船长追逐白鲸莫比·迪克的执念', tags: ['classic', 'novel', 'adventure', 'american'] },
  '百年孤独': { author: '加西亚·马尔克斯', description: '魔幻现实主义的巅峰之作，讲述布恩迪亚家族七代人的传奇故事', tags: ['classic', 'novel', 'latin-american'] },
  '神曲': { author: '但丁', description: '中世纪最伟大的文学作品，但丁游历地狱、炼狱和天堂的灵魂之旅', tags: ['classic', 'poetry', 'philosophy', 'italian'] },
  '福尔摩斯探案集': { author: '阿瑟·柯南·道尔', description: '侦探小说的经典之作，讲述大侦探福尔摩斯与华生的探案故事', tags: ['classic', 'short-story', 'detective', 'english'] },
  '等待戈多': { author: '塞缪尔·贝克特', description: '荒诞派戏剧的代表作，两个人在无尽等待中展开的哲学对话', tags: ['classic', 'drama', 'philosophy'] },
  '简·爱': { author: '夏洛蒂·勃朗特', description: '英国文学经典，讲述孤女简·爱追求自由与尊严的独立女性故事', tags: ['classic', 'novel', 'romance', 'english'] },
  '红与黑': { author: '司汤达', description: '法国批判现实主义文学的奠基之作，讲述于连的野心与爱情', tags: ['classic', 'novel', 'romance', 'french'] },
  '红字': { author: '纳撒尼尔·霍桑', description: '美国文学的经典，讲述清教徒社会中一个女人佩戴红字A的赎罪故事', tags: ['classic', 'novel', 'american'] },
  '红花侠': { author: '奥希兹女男爵', description: '冒险小说经典，讲述法国大革命时期神秘贵族红花侠的救援行动', tags: ['classic', 'novel', 'adventure', 'english'] },
  '罗密欧与朱丽叶': { author: '莎士比亚', description: '莎士比亚最著名的爱情悲剧，两个家族仇人的年轻恋人殉情而死', tags: ['classic', 'drama', 'romance', 'english'] },
  '罪与罚': { author: '陀思妥耶夫斯基', description: '陀思妥耶夫斯基的代表作，讲述穷大学生拉斯柯尔尼科夫的犯罪与救赎', tags: ['classic', 'novel', 'philosophy', 'russian'] },
  '羊脂球': { author: '莫泊桑', description: '莫泊桑的成名短篇，普法战争中一个妓女的高尚与乘客的卑劣形成对比', tags: ['classic', 'short-story', 'french'] },
  '美丽新世界': { author: '阿道司·赫胥黎', description: '反乌托邦经典三部曲之一，描绘一个以科技控制人类的未来社会', tags: ['classic', 'novel', 'dystopia', 'english'] },
  '群鬼': { author: '易卜生', description: '易卜生的社会问题剧，揭露维多利亚时代道德伪善的悲剧', tags: ['classic', 'drama'] },
  '老人与海': { author: '欧内斯特·海明威', description: '海明威的诺贝尔奖之作，讲述古巴老渔夫与大马林鱼的搏斗', tags: ['classic', 'novel', 'american'] },
  '茶花女': { author: '小仲马', description: '法国文学经典爱情悲剧，讲述巴黎名妓玛格丽特的凄美爱情', tags: ['classic', 'novel', 'romance', 'french'] },
  '荒原狼': { author: '赫尔曼·黑塞', description: '黑塞的代表作，讲述一个知识分子在精神分裂中寻找自我', tags: ['classic', 'novel', 'philosophy', 'german'] },
  '蝇王': { author: '威廉·戈尔丁', description: '戈尔丁的寓言小说，讲述一群荒岛求生的少年如何退化为野蛮人', tags: ['classic', 'novel', 'english'] },
  '远大前程': { author: '查尔斯·狄更斯', description: '狄更斯的成熟之作，讲述孤儿皮普从卑微到幻灭的成长历程', tags: ['classic', 'novel', 'english'] },
  '远离尘嚣': { author: '托马斯·哈代', description: '哈代的成名作，讲述美丽独立的芭丝谢芭与三个追求者的爱情纠葛', tags: ['classic', 'novel', 'romance', 'english'] },
  '道林·格雷的画像': { author: '奥斯卡·王尔德', description: '王尔德唯一的小说，讲述一个美少年的画像替他衰老的寓言故事', tags: ['classic', 'novel', 'philosophy', 'english'] },
  '都柏林人': { author: '詹姆斯·乔伊斯', description: '乔伊斯的短篇小说集，以十五个故事描绘都柏林市民的精神瘫痪', tags: ['classic', 'short-story', 'english'] },
  '金阁寺': { author: '三岛由纪夫', description: '三岛由纪夫的代表作，讲述口吃僧人放火烧毁金阁寺的真实事件改编', tags: ['classic', 'novel', 'philosophy', 'japanese'] },
  '银河铁道之夜': { author: '宫泽贤治', description: '宫泽贤治最著名的童话，讲述少年乔万尼在银河列车上的奇幻旅程', tags: ['classic', 'fairy-tale', 'japanese'] },
  '阴谋与爱情': { author: '弗里德里希·席勒', description: '席勒的市民悲剧，讲述宰相之子与乐师之女被阴谋摧毁的爱情', tags: ['classic', 'drama', 'romance', 'german'] },
  '隐身人': { author: '赫伯特·威尔斯', description: '威尔斯的科幻经典，讲述一个科学家发明隐身术后的疯狂与毁灭', tags: ['classic', 'novel', 'english'] },
  '雪国': { author: '川端康成', description: '川端康成的诺贝尔奖之作，讲述东京男子与雪国艺伎的虚幻爱情', tags: ['classic', 'novel', 'romance', 'japanese'] },
  '雾都孤儿': { author: '查尔斯·狄更斯', description: '狄更斯的早期代表作，讲述孤儿奥利弗在伦敦的苦难经历', tags: ['classic', 'novel', 'english'] },
  '霍乱时期的爱情': { author: '加西亚·马尔克斯', description: '马尔克斯的爱情史诗，讲述一段跨越半个多世纪的忠贞不渝的爱情', tags: ['classic', 'novel', 'romance', 'latin-american'] },
  '飘': { author: '玛格丽特·米切尔', description: '以美国南北战争为背景的史诗爱情小说，讲述斯嘉丽的坚韧与爱情', tags: ['classic', 'novel', 'romance', 'american'] },
  '高老头': { author: '巴尔扎克', description: '巴尔扎克《人间喜剧》的核心作品，讲述父爱的极端与青年的堕落', tags: ['classic', 'novel', 'french'] },
  '麦克白': { author: '莎士比亚', description: '莎士比亚四大悲剧之一，讲述苏格兰将军麦克白因野心而走向毁灭', tags: ['classic', 'drama', 'english'] },
  '麦田里的守望者': { author: 'J.D.塞林格', description: '美国青春文学经典，讲述叛逆少年霍尔顿在纽约的两天游荡', tags: ['classic', 'novel', 'american'] },
  '鼠疫': { author: '阿尔贝·加缪', description: '加缪的长篇寓言小说，以北非城市爆发鼠疫隐喻人类面对荒诞的态度', tags: ['classic', 'novel', 'philosophy', 'french'] },
  '1984': { author: '乔治·奥威尔', description: '反乌托邦文学的巅峰之作，描绘一个极权统治下的恐怖未来世界', tags: ['classic', 'novel', 'dystopia', 'english'] }
}

const filePath = 'L:/src/data/books.ts'
let content = readFileSync(filePath, 'utf-8')

let fixed = 0
for (const [title, meta] of Object.entries(BOOK_META)) {
  const escapedTitle = title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

  const authorPattern = new RegExp(
    `(id:\\s*'${escapedTitle}'[\\s\\S]*?author:\\s*)'待补充'`,
    'm'
  )
  if (authorPattern.test(content)) {
    content = content.replace(authorPattern, `$1'${meta.author}'`)
    fixed++
  }

  const descPattern = new RegExp(
    `(id:\\s*'${escapedTitle}'[\\s\\S]*?description:\\s*)'${escapedTitle} 轻小说系列'`,
    'm'
  )
  if (descPattern.test(content)) {
    content = content.replace(descPattern, `$1'${meta.description}'`)
  }

  const tagInsertPattern = new RegExp(
    `(id:\\s*'${escapedTitle}'[\\s\\S]*?description:\\s*'[^']+')`
  )
  if (tagInsertPattern.test(content) && !content.includes(`id: '${escapedTitle}'` + `[\s\S]*?tags:`)) {
    const match = content.match(new RegExp(`(id:\\s*'${escapedTitle}'[\\s\\S]*?description:\\s*'[^']+)'\\s*\\n(\\s*chapters:)`))
    if (match && !match[0].includes('tags:')) {
      content = content.replace(match[0], `${match[1]}'\n    tags: ${JSON.stringify(meta.tags)},\n${match[2]}`)
    }
  }
}

writeFileSync(filePath, content)
console.log(`Fixed ${fixed} books with correct author, description, and tags`)
