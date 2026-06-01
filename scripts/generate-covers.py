import os
import sys
from PIL import Image, ImageDraw, ImageFont

BOOKS_DIR = r'L:\public\books\images'

COVERS = {
    'kotenbu': {'title': '古典部系列', 'author': '米泽穗信', 'colors': [(41, 128, 185), (142, 68, 173)]},
    'mobitchi': {'title': '魔女之旅', 'author': '白石定规', 'colors': [(39, 174, 96), (22, 160, 133)]},
    'xiaoshimin': {'title': '小市民系列', 'author': '米泽穗信', 'colors': [(211, 84, 0), (192, 57, 43)]},
    '三个火枪手': {'title': '三个火枪手', 'author': '大仲马', 'colors': [(192, 57, 43), (142, 68, 173)]},
    '了不起的盖茨比': {'title': '了不起的盖茨比', 'author': '菲茨杰拉德', 'colors': [(241, 196, 15), (230, 126, 34)]},
    '仲夏夜之梦': {'title': '仲夏夜之梦', 'author': '莎士比亚', 'colors': [(26, 188, 156), (22, 160, 133)]},
    '傲慢与偏见': {'title': '傲慢与偏见', 'author': '简·奥斯汀', 'colors': [(232, 67, 147), (154, 18, 179)]},
    '动物农场': {'title': '动物农场', 'author': '乔治·奥威尔', 'colors': [(39, 174, 96), (41, 128, 185)]},
    '包法利夫人': {'title': '包法利夫人', 'author': '福楼拜', 'colors': [(230, 126, 34), (211, 84, 0)]},
    '十日谈': {'title': '十日谈', 'author': '薄伽丘', 'colors': [(142, 68, 173), (232, 67, 147)]},
    '卡拉马佐夫兄弟': {'title': '卡拉马佐夫兄弟', 'author': '陀思妥耶夫斯基', 'colors': [(44, 62, 80), (52, 73, 94)]},
    '双城记': {'title': '双城记', 'author': '查尔斯·狄更斯', 'colors': [(192, 57, 43), (44, 62, 80)]},
    '变形记': {'title': '变形记', 'author': '卡夫卡', 'colors': [(52, 73, 94), (44, 62, 80)]},
    '叶甫盖尼·奥涅金': {'title': '叶甫盖尼·奥涅金', 'author': '普希金', 'colors': [(22, 160, 133), (26, 188, 156)]},
    '呼啸山庄': {'title': '呼啸山庄', 'author': '艾米莉·勃朗特', 'colors': [(44, 62, 80), (192, 57, 43)]},
    '哈克贝利·费恩历险记': {'title': '哈克贝利·费恩历险记', 'author': '马克·吐温', 'colors': [(41, 128, 185), (39, 174, 96)]},
    '哈姆雷特': {'title': '哈姆雷特', 'author': '莎士比亚', 'colors': [(44, 62, 80), (142, 68, 173)]},
    '地下室手记': {'title': '地下室手记', 'author': '陀思妥耶夫斯基', 'colors': [(52, 73, 94), (192, 57, 43)]},
    '城堡': {'title': '城堡', 'author': '卡夫卡', 'colors': [(52, 73, 94), (39, 174, 96)]},
    '基督山伯爵': {'title': '基督山伯爵', 'author': '大仲马', 'colors': [(230, 126, 34), (192, 57, 43)]},
    '堂吉诃德': {'title': '堂吉诃德', 'author': '塞万提斯', 'colors': [(211, 84, 0), (230, 126, 34)]},
    '复活': {'title': '复活', 'author': '列夫·托尔斯泰', 'colors': [(39, 174, 96), (44, 62, 80)]},
    '外套': {'title': '外套', 'author': '果戈理', 'colors': [(44, 62, 80), (52, 73, 94)]},
    '大卫·科波菲尔': {'title': '大卫·科波菲尔', 'author': '查尔斯·狄更斯', 'colors': [(41, 128, 185), (22, 160, 133)]},
    '契诃夫短篇小说集': {'title': '契诃夫短篇小说集', 'author': '契诃夫', 'colors': [(142, 68, 173), (52, 73, 94)]},
    '奥赛罗': {'title': '奥赛罗', 'author': '莎士比亚', 'colors': [(192, 57, 43), (52, 73, 94)]},
    '安娜·卡列尼娜': {'title': '安娜·卡列尼娜', 'author': '列夫·托尔斯泰', 'colors': [(192, 57, 43), (232, 67, 147)]},
    '安徒生童话': {'title': '安徒生童话', 'author': '安徒生', 'colors': [(241, 196, 15), (26, 188, 156)]},
    '审判': {'title': '审判', 'author': '卡夫卡', 'colors': [(52, 73, 94), (142, 68, 173)]},
    '小王子': {'title': '小王子', 'author': '圣-埃克苏佩里', 'colors': [(241, 196, 15), (41, 128, 185)]},
    '少年维特的烦恼': {'title': '少年维特的烦恼', 'author': '歌德', 'colors': [(39, 174, 96), (232, 67, 147)]},
    '尤利西斯': {'title': '尤利西斯', 'author': '詹姆斯·乔伊斯', 'colors': [(44, 62, 80), (22, 160, 133)]},
    '局外人': {'title': '局外人', 'author': '阿尔贝·加缪', 'colors': [(52, 73, 94), (230, 126, 34)]},
    '巴黎圣母院': {'title': '巴黎圣母院', 'author': '维克多·雨果', 'colors': [(192, 57, 43), (230, 126, 34)]},
    '强盗': {'title': '强盗', 'author': '席勒', 'colors': [(44, 62, 80), (192, 57, 43)]},
    '德伯家的苔丝': {'title': '德伯家的苔丝', 'author': '托马斯·哈代', 'colors': [(39, 174, 96), (52, 73, 94)]},
    '心': {'title': '心', 'author': '夏目漱石', 'colors': [(192, 57, 43), (44, 62, 80)]},
    '快乐王子': {'title': '快乐王子', 'author': '奥斯卡·王尔德', 'colors': [(241, 196, 15), (232, 67, 147)]},
    '悉达多': {'title': '悉达多', 'author': '赫尔曼·黑塞', 'colors': [(26, 188, 156), (241, 196, 15)]},
    '悲惨世界': {'title': '悲惨世界', 'author': '维克多·雨果', 'colors': [(44, 62, 80), (192, 57, 43)]},
    '愤怒的葡萄': {'title': '愤怒的葡萄', 'author': '约翰·斯坦贝克', 'colors': [(39, 174, 96), (211, 84, 0)]},
    '我是猫': {'title': '我是猫', 'author': '夏目漱石', 'colors': [(230, 126, 34), (241, 196, 15)]},
    '战争与和平': {'title': '战争与和平', 'author': '列夫·托尔斯泰', 'colors': [(192, 57, 43), (44, 62, 80)]},
    '时间机器': {'title': '时间机器', 'author': '赫伯特·威尔斯', 'colors': [(41, 128, 185), (142, 68, 173)]},
    '月亮与六便士': {'title': '月亮与六便士', 'author': '毛姆', 'colors': [(241, 196, 15), (52, 73, 94)]},
    '杀死一只知更鸟': {'title': '杀死一只知更鸟', 'author': '哈珀·李', 'colors': [(44, 62, 80), (39, 174, 96)]},
    '李尔王': {'title': '李尔王', 'author': '莎士比亚', 'colors': [(52, 73, 94), (192, 57, 43)]},
    '欧也妮·葛朗台': {'title': '欧也妮·葛朗台', 'author': '巴尔扎克', 'colors': [(230, 126, 34), (52, 73, 94)]},
    '死魂灵': {'title': '死魂灵', 'author': '果戈理', 'colors': [(52, 73, 94), (39, 174, 96)]},
    '永别了，武器': {'title': '永别了，武器', 'author': '海明威', 'colors': [(44, 62, 80), (192, 57, 43)]},
    '汤姆·索亚历险记': {'title': '汤姆·索亚历险记', 'author': '马克·吐温', 'colors': [(41, 128, 185), (241, 196, 15)]},
    '洛丽塔': {'title': '洛丽塔', 'author': '纳博科夫', 'colors': [(232, 67, 147), (142, 68, 173)]},
    '浮士德': {'title': '浮士德', 'author': '歌德', 'colors': [(44, 62, 80), (142, 68, 173)]},
    '爱玛': {'title': '爱玛', 'author': '简·奥斯汀', 'colors': [(232, 67, 147), (230, 126, 34)]},
    '玩偶之家': {'title': '玩偶之家', 'author': '易卜生', 'colors': [(142, 68, 173), (232, 67, 147)]},
    '理智与情感': {'title': '理智与情感', 'author': '简·奥斯汀', 'colors': [(41, 128, 185), (232, 67, 147)]},
    '生命中不能承受之轻': {'title': '生命中不能承受之轻', 'author': '米兰·昆德拉', 'colors': [(52, 73, 94), (26, 188, 156)]},
    '白痴': {'title': '白痴', 'author': '陀思妥耶夫斯基', 'colors': [(52, 73, 94), (232, 67, 147)]},
    '白鲸': {'title': '白鲸', 'author': '赫尔曼·梅尔维尔', 'colors': [(41, 128, 185), (44, 62, 80)]},
    '百年孤独': {'title': '百年孤独', 'author': '加西亚·马尔克斯', 'colors': [(241, 196, 15), (142, 68, 173)]},
    '神曲': {'title': '神曲', 'author': '但丁', 'colors': [(192, 57, 43), (241, 196, 15)]},
    '福尔摩斯探案集': {'title': '福尔摩斯探案集', 'author': '柯南·道尔', 'colors': [(44, 62, 80), (39, 174, 96)]},
    '等待戈多': {'title': '等待戈多', 'author': '贝克特', 'colors': [(52, 73, 94), (230, 126, 34)]},
    '简·爱': {'title': '简·爱', 'author': '夏洛蒂·勃朗特', 'colors': [(232, 67, 147), (192, 57, 43)]},
    '红与黑': {'title': '红与黑', 'author': '司汤达', 'colors': [(192, 57, 43), (44, 62, 80)]},
    '红字': {'title': '红字', 'author': '霍桑', 'colors': [(192, 57, 43), (52, 73, 94)]},
    '红花侠': {'title': '红花侠', 'author': '奥希兹女男爵', 'colors': [(192, 57, 43), (232, 67, 147)]},
    '罗密欧与朱丽叶': {'title': '罗密欧与朱丽叶', 'author': '莎士比亚', 'colors': [(232, 67, 147), (192, 57, 43)]},
    '罪与罚': {'title': '罪与罚', 'author': '陀思妥耶夫斯基', 'colors': [(192, 57, 43), (52, 73, 94)]},
    '羊脂球': {'title': '羊脂球', 'author': '莫泊桑', 'colors': [(241, 196, 15), (230, 126, 34)]},
    '美丽新世界': {'title': '美丽新世界', 'author': '赫胥黎', 'colors': [(41, 128, 185), (142, 68, 173)]},
    '群鬼': {'title': '群鬼', 'author': '易卜生', 'colors': [(52, 73, 94), (192, 57, 43)]},
    '老人与海': {'title': '老人与海', 'author': '海明威', 'colors': [(41, 128, 185), (22, 160, 133)]},
    '茶花女': {'title': '茶花女', 'author': '小仲马', 'colors': [(232, 67, 147), (142, 68, 173)]},
    '荒原狼': {'title': '荒原狼', 'author': '赫尔曼·黑塞', 'colors': [(52, 73, 94), (142, 68, 173)]},
    '蝇王': {'title': '蝇王', 'author': '威廉·戈尔丁', 'colors': [(39, 174, 96), (44, 62, 80)]},
    '远大前程': {'title': '远大前程', 'author': '查尔斯·狄更斯', 'colors': [(41, 128, 185), (230, 126, 34)]},
    '远离尘嚣': {'title': '远离尘嚣', 'author': '托马斯·哈代', 'colors': [(39, 174, 96), (41, 128, 185)]},
    '道林·格雷的画像': {'title': '道林·格雷的画像', 'author': '奥斯卡·王尔德', 'colors': [(142, 68, 173), (52, 73, 94)]},
    '都柏林人': {'title': '都柏林人', 'author': '詹姆斯·乔伊斯', 'colors': [(39, 174, 96), (52, 73, 94)]},
    '金阁寺': {'title': '金阁寺', 'author': '三岛由纪夫', 'colors': [(241, 196, 15), (192, 57, 43)]},
    '银河铁道之夜': {'title': '银河铁道之夜', 'author': '宫泽贤治', 'colors': [(41, 128, 185), (241, 196, 15)]},
    '阴谋与爱情': {'title': '阴谋与爱情', 'author': '席勒', 'colors': [(232, 67, 147), (44, 62, 80)]},
    '隐身人': {'title': '隐身人', 'author': '赫伯特·威尔斯', 'colors': [(52, 73, 94), (41, 128, 185)]},
    '雪国': {'title': '雪国', 'author': '川端康成', 'colors': [(22, 160, 133), (241, 196, 15)]},
    '雾都孤儿': {'title': '雾都孤儿', 'author': '查尔斯·狄更斯', 'colors': [(52, 73, 94), (41, 128, 185)]},
    '霍乱时期的爱情': {'title': '霍乱时期的爱情', 'author': '马尔克斯', 'colors': [(232, 67, 147), (230, 126, 34)]},
    '飘': {'title': '飘', 'author': '玛格丽特·米切尔', 'colors': [(192, 57, 43), (241, 196, 15)]},
    '高老头': {'title': '高老头', 'author': '巴尔扎克', 'colors': [(230, 126, 34), (44, 62, 80)]},
    '麦克白': {'title': '麦克白', 'author': '莎士比亚', 'colors': [(192, 57, 43), (44, 62, 80)]},
    '麦田里的守望者': {'title': '麦田里的守望者', 'author': '塞林格', 'colors': [(39, 174, 96), (241, 196, 15)]},
    '鼠疫': {'title': '鼠疫', 'author': '阿尔贝·加缪', 'colors': [(52, 73, 94), (39, 174, 96)]},
    '1984': {'title': '1984', 'author': '乔治·奥威尔', 'colors': [(192, 57, 43), (44, 62, 80)]},
}

def draw_gradient(img, c1, c2):
    w, h = img.size
    draw = ImageDraw.Draw(img)
    for y in range(h):
        r = int(c1[0] + (c2[0] - c1[0]) * y / h)
        g = int(c1[1] + (c2[1] - c1[1]) * y / h)
        b = int(c1[2] + (c2[2] - c1[2]) * y / h)
        draw.line([(0, y), (w, y)], fill=(r, g, b))
    return draw

def wrap_text(text, font, max_width):
    lines = []
    current = ""
    for ch in text:
        test = current + ch
        bbox = font.getbbox(test)
        if bbox[2] - bbox[0] > max_width and current:
            lines.append(current)
            current = ch
        else:
            current = test
    if current:
        lines.append(current)
    return lines

def generate_cover(book_id, info):
    W, H = 400, 560
    img = Image.new('RGB', (W, H))
    draw = draw_gradient(img, info['colors'][0], info['colors'][1])

    font_path = r'C:\Windows\Fonts\msyh.ttc'
    if not os.path.exists(font_path):
        font_path = r'C:\Windows\Fonts\simhei.ttf'

    title_font = ImageFont.truetype(font_path, 36)
    author_font = ImageFont.truetype(font_path, 22)

    draw.rectangle([(0, 0), (W - 1, H - 1)], outline=(255, 255, 255, 80), width=2)

    title_lines = wrap_text(info['title'], title_font, W - 80)
    total_h = len(title_lines) * 48
    y = (H - total_h - 40) // 2
    for line in title_lines:
        bbox = title_font.getbbox(line)
        tw = bbox[2] - bbox[0]
        x = (W - tw) // 2
        draw.text((x + 2, y + 2), line, fill=(0, 0, 0, 60), font=title_font)
        draw.text((x, y), line, fill=(255, 255, 255), font=title_font)
        y += 48

    author = info['author']
    bbox = author_font.getbbox(author)
    aw = bbox[2] - bbox[0]
    ax = (W - aw) // 2
    draw.text((ax, y + 10), author, fill=(255, 255, 255, 200), font=author_font)

    out_dir = os.path.join(BOOKS_DIR, book_id)
    os.makedirs(out_dir, exist_ok=True)
    img.save(os.path.join(out_dir, 'cover.jpg'), 'JPEG', quality=85)

count = 0
for book_id, info in COVERS.items():
    generate_cover(book_id, info)
    count += 1

print(f"Generated {count} covers")
