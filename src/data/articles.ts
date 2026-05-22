export interface Article {
  id: string
  title: string
  content: string
  date: string
  pinned?: boolean
}

export const articles: Article[] = [
  {
    id: '1',
    title: '欢迎来到楼西楼louxilou！',
    date: '2026-05-10',
    pinned: true,
    content: `这是我的个人网站，以下是各个功能区的介绍：

📚 藏书阁
收藏各种珍贵书籍，支持在线阅读和TXT下载。阅读器支持多种文本编码（UTF-8、GBK、GB18030、GB2312、Shift_JIS、Big5），自动检测最佳编码解决乱码问题。

🏠 观景台
展示个人照片画廊，可以欣赏风景和日常照片。

📋 公告栏
网站更新日志和功能介绍，所有网站动态都会在这里公布。

📞 联系我
可以通过这里与我取得联系，有什么问题或建议都可以留言。`
  }
]
