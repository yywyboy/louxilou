-- =====================================================
-- 迁移现有书籍数据到 Supabase（幂等，可重复运行）
-- =====================================================

-- 古典部系列
INSERT INTO books (id, title, author, cover, description) VALUES
('kotenbu', '古典部系列', '米泽穗信', '/books/images/kotenbu/temp.GIF', '以神山高中古典部为舞台的青春推理小说系列')
ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, author=EXCLUDED.author, cover=EXCLUDED.cover, description=EXCLUDED.description;

INSERT INTO book_chapters (id, book_id, title, cover, status, txt_url, sort_order) VALUES
('1', 'kotenbu', '冰菓', '/books/images/kotenbu/temp.GIF', '已完结', '/books/kotenbu/txt/古典部系列1.txt', 1),
('2', 'kotenbu', '愚者的片尾', '/books/images/kotenbu/temp 2.GIF', '已完结', '/books/kotenbu/txt/古典部系列2.txt', 2),
('3', 'kotenbu', '库特利亚芙卡的顺序', '/books/images/kotenbu/temp 3.GIF', '已完结', '/books/kotenbu/txt/古典部系列3.txt', 3),
('4', 'kotenbu', '绕远路的雏人偶', '/books/images/kotenbu/temp 4.GIF', '已完结', '/books/kotenbu/txt/古典部系列4.txt', 4),
('5', 'kotenbu', '两人距离的概算', '/books/images/kotenbu/temp 5.GIF', '已完结', '/books/kotenbu/txt/古典部系列5.txt', 5),
('6', 'kotenbu', '迟来的翅膀', '/books/images/kotenbu/temp 6.GIF', '已完结', '/books/kotenbu/txt/古典部系列6.txt', 6)
ON CONFLICT (id, book_id) DO UPDATE SET title=EXCLUDED.title, cover=EXCLUDED.cover, txt_url=EXCLUDED.txt_url, sort_order=EXCLUDED.sort_order;

-- 魔女之旅
INSERT INTO books (id, title, author, cover, description) VALUES
('mobitchi', '魔女之旅', '白石定规', '/books/images/mobitchi/1.GIF', '讲述魔女伊蕾娜周游各国的故事')
ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, author=EXCLUDED.author, cover=EXCLUDED.cover, description=EXCLUDED.description;

INSERT INTO book_chapters (id, book_id, title, cover, status, txt_url, sort_order) VALUES
('1', 'mobitchi', '第1卷', '/books/images/mobitchi/1.GIF', '已完结', '/books/mobitchi/txt/魔女之旅 1.txt', 1),
('2', 'mobitchi', '第2卷', '/books/images/mobitchi/2.GIF', '已完结', '/books/mobitchi/txt/魔女之旅 2.txt', 2),
('3', 'mobitchi', '第3卷', '/books/images/mobitchi/3.GIF', '已完结', '/books/mobitchi/txt/魔女之旅 3.txt', 3),
('4', 'mobitchi', '第4卷', '/books/images/mobitchi/4.GIF', '已完结', '/books/mobitchi/txt/魔女之旅 4.txt', 4),
('5', 'mobitchi', '第5卷', '/books/images/mobitchi/5.GIF', '已完结', '/books/mobitchi/txt/魔女之旅 5.txt', 5),
('6', 'mobitchi', '第6卷', '/books/images/mobitchi/6.GIF', '已完结', '/books/mobitchi/txt/魔女之旅 6.txt', 6),
('7', 'mobitchi', '第7卷', '/books/images/mobitchi/7.GIF', '已完结', '/books/mobitchi/txt/魔女之旅 7.txt', 7),
('8', 'mobitchi', '第8卷', '/books/images/mobitchi/temp 8.GIF', '已完结', '/books/mobitchi/txt/魔女之旅 8.txt', 8),
('9', 'mobitchi', '第9卷', '/books/images/mobitchi/temp 9.GIF', '已完结', '/books/mobitchi/txt/魔女之旅 9.txt', 9),
('10', 'mobitchi', '第10卷', '/books/images/mobitchi/temp 10.GIF', '已完结', '/books/mobitchi/txt/魔女之旅 10.txt', 10),
('11', 'mobitchi', '第11卷', '/books/images/mobitchi/temp 11.GIF', '已完结', '/books/mobitchi/txt/魔女之旅 11.txt', 11),
('12', 'mobitchi', '第12卷', '/books/images/mobitchi/temp 12.GIF', '已完结', '/books/mobitchi/txt/魔女之旅12.txt', 12),
('13', 'mobitchi', '第13卷', '/books/images/mobitchi/temp 13.GIF', '已完结', '/books/mobitchi/txt/魔女之旅13.txt', 13),
('14', 'mobitchi', '第14卷', '/books/images/mobitchi/temp 14.GIF', '已完结', '/books/mobitchi/txt/魔女之旅14.txt', 14),
('15', 'mobitchi', '第15卷', '/books/images/mobitchi/temp 15.GIF', '已完结', '/books/mobitchi/txt/魔女之旅15.txt', 15),
('16', 'mobitchi', '第16卷', '/books/images/mobitchi/temp 16.GIF', '已完结', '/books/mobitchi/txt/魔女之旅16.txt', 16),
('17', 'mobitchi', '第17卷', '/books/images/mobitchi/temp 17.GIF', '已完结', '/books/mobitchi/txt/魔女之旅17.txt', 17),
('18', 'mobitchi', '第18卷', '/books/images/mobitchi/temp 18.GIF', '已完结', '/books/mobitchi/txt/魔女之旅18.txt', 18),
('19', 'mobitchi', '第19卷', '/books/images/mobitchi/temp 19.GIF', '已完结', '/books/mobitchi/txt/魔女之旅19.txt', 19),
('20', 'mobitchi', '第20卷', '/books/images/mobitchi/temp 20.GIF', '已完结', '/books/mobitchi/txt/魔女之旅20.txt', 20),
('21', 'mobitchi', '第21卷', '/books/images/mobitchi/temp 21.GIF', '已完结', '/books/mobitchi/txt/魔女之旅21.txt', 21),
('22', 'mobitchi', '第22卷', '/books/images/mobitchi/temp 22.GIF', '已完结', '/books/mobitchi/txt/魔女之旅22.txt', 22),
('23', 'mobitchi', '第23卷', '/books/images/mobitchi/temp 23.GIF', '已完结', '/books/mobitchi/txt/魔女之旅 23.txt', 23),
('24', 'mobitchi', '第24卷', '/books/images/mobitchi/temp 24.GIF', '已完结', '/books/mobitchi/txt/魔女之旅 24.txt', 24),
('学院', 'mobitchi', '魔女之旅学院', '/books/images/mobitchi/temp.GIF', '已完结', '/books/mobitchi/txt/魔女之旅学院.txt', 25),
('学院物语', 'mobitchi', '魔女之旅学院物语', '/books/images/mobitchi/temp.GIF', '已完结', '/books/mobitchi/txt/魔女之旅学院物语.txt', 26),
('番外', 'mobitchi', '番外', '/books/images/mobitchi/temp.GIF', '已完结', '/books/mobitchi/txt/魔女之旅番外.txt', 27),
('短篇', 'mobitchi', '短篇', '/books/images/mobitchi/temp.GIF', '已完结', '/books/mobitchi/txt/魔女之旅短篇.txt', 28),
('短篇集', 'mobitchi', '短篇集', '/books/images/mobitchi/temp.GIF', '已完结', '/books/mobitchi/txt/魔女之旅短篇集.txt', 29)
ON CONFLICT (id, book_id) DO UPDATE SET title=EXCLUDED.title, cover=EXCLUDED.cover, txt_url=EXCLUDED.txt_url, sort_order=EXCLUDED.sort_order;

-- 小市民系列
INSERT INTO books (id, title, author, cover, description) VALUES
('xiaoshimin', '小市民系列', '米泽穗信', '/books/images/xiaoshimin/IMG_0106.JPG', '以小市民为主题的推理小说系列')
ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, author=EXCLUDED.author, cover=EXCLUDED.cover, description=EXCLUDED.description;

INSERT INTO book_chapters (id, book_id, title, cover, status, txt_url, sort_order) VALUES
('1', 'xiaoshimin', '春季限定草莓塔事件', '/books/images/xiaoshimin/temp.gif', '已完结', '/books/xiaoshimin/txt/春季限定草莓塔事件.txt', 1),
('2', 'xiaoshimin', '夏季限定热带水果百汇事件', '/books/images/xiaoshimin/temp(1).gif', '已完结', '/books/xiaoshimin/txt/夏季限定热带水果百汇事件.txt', 2),
('3', 'xiaoshimin', '秋季限定栗金饨事件(上)', '/books/images/xiaoshimin/temp(2).gif', '已完结', '/books/xiaoshimin/txt/秋季限定栗金饨事件(上).txt', 3),
('4', 'xiaoshimin', '秋季限定栗金饨事件(下)', '/books/images/xiaoshimin/temp(3).gif', '已完结', '/books/xiaoshimin/txt/秋季限定栗金饨事件(下).txt', 4),
('5', 'xiaoshimin', '冬季限定法式巧克力事件', '/books/images/xiaoshimin/temp(4).gif', '已完结', '/books/xiaoshimin/txt/冬季限定法式巧克力事件.txt', 5),
('6', 'xiaoshimin', '巴黎马卡龙之谜', '/books/images/xiaoshimin/temp(5).gif', '已完结', '/books/xiaoshimin/txt/巴黎马卡龙之谜.txt', 6)
ON CONFLICT (id, book_id) DO UPDATE SET title=EXCLUDED.title, cover=EXCLUDED.cover, txt_url=EXCLUDED.txt_url, sort_order=EXCLUDED.sort_order;
