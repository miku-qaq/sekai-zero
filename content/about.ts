export const influenceSignals = [
  {
    index: "39",
    channel: "音乐频道",
    name: "初音未来",
    romanized: "HATSUNE MIKU",
    copy: "本站用薄荷色、音符与数字舞台表达她带来的未来感。",
    tone: "mint",
    motif: "♪",
  },
  {
    index: "07",
    channel: "旅行频道",
    name: "伊蕾娜",
    romanized: "ELAINA",
    copy: "本站用雾紫、星轨与路线卡表达旅行故事里的探索感。",
    tone: "violet",
    motif: "✦",
  },
  {
    index: "06",
    channel: "摇滚频道",
    name: "波奇",
    romanized: "BOCCHI",
    copy: "本站用樱粉、节拍与舞台卡片表达摇滚演出的能量。",
    tone: "pink",
    motif: "♬",
  },
] as const;

export const profileQuestions = [
  {
    question: "为什么要做这个网站？",
    answer:
      "我会长期维护这个网站，用它整理计算机学习笔记、记录动漫与游戏兴趣，也保存每一次有意义的更新。",
  },
  {
    question: "平时喜欢什么？",
    answer:
      "喜欢动漫和游戏，常用 Nintendo Switch 与 Steam。初音未来、伊蕾娜和波奇，也分别成为本站音乐、远行与摇滚三条灵感频道。",
  },
  {
    question: "最近在投入什么？",
    answer:
      "最近正在自学 Stanford CS224N 的公开课程资料，也在回顾此前学习过的 CS231n；动画与 Steam 游戏收藏会随着真实记录继续更新。",
  },
] as const;

export const currentFocus = [
  {
    code: "LEARNING",
    title: "自然语言处理",
    copy: "正在自学 Stanford CS224N 公开课程资料，从词向量与分布式语义开始整理个人笔记。",
    href: "/study/#cs224n-nlp-word-vectors",
    action: "阅读当前笔记",
  },
  {
    code: "GAMES",
    title: "Steam 游戏收藏",
    copy: "已经从本地 Steam 记录整理实际玩过的游戏，只展示名称与封面，不公开账号和时长。",
    href: "/games/",
    action: "浏览游戏收藏",
  },
  {
    code: "INTERESTS",
    title: "动画收藏",
    copy: "已经把 89 部看过的动画整理成独立收藏馆；喜欢的角色包括初音未来、伊蕾娜和波奇。",
    href: "/anime/",
    action: "浏览动画收藏",
  },
] as const;
