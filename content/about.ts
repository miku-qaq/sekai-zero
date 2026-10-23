export const influenceSignals = [
  {
    index: "39",
    channel: "音乐频道",
    name: "初音未来",
    romanized: "HATSUNE MIKU",
    copy: "薄荷色音符，唱向未来。",
    tone: "mint",
    motif: "♪",
  },
  {
    index: "07",
    channel: "旅行频道",
    name: "伊蕾娜",
    romanized: "ELAINA",
    copy: "沿着雾紫星轨，去看新的风景。",
    tone: "violet",
    motif: "✦",
  },
  {
    index: "06",
    channel: "摇滚频道",
    name: "波奇",
    romanized: "BOCCHI",
    copy: "樱粉色节拍，也有摇滚的勇气。",
    tone: "pink",
    motif: "♬",
  },
] as const;

export const profileQuestions = [
  {
    question: "为什么要做这个网站？",
    answer: "给学到的东西和喜欢的事物，留一个自己的地方。",
  },
  {
    question: "平时喜欢什么？",
    answer: "动漫、游戏，以及初音未来、伊蕾娜和波奇。常玩 Nintendo Switch 与 Steam。",
  },
  {
    question: "最近在投入什么？",
    answer: "自学 CS224N，回顾 CS231n，也继续打理收藏馆。",
  },
] as const;

export const currentFocus = [
  {
    code: "LEARNING",
    title: "自然语言处理",
    copy: "自学 CS224N，从词向量与分布式语义开始。",
    href: "/study/#cs224n-nlp-word-vectors",
    action: "阅读当前笔记",
  },
  {
    code: "COLLECTION",
    title: "奇妙收藏馆",
    copy: "动画、游戏、手办、Fufu 与手柄，慢慢收进同一座馆。",
    href: "/collections/",
    action: "进入奇妙收藏馆",
  },
] as const;
