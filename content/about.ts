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
    question: "这里会记录什么？",
    answer: "CS224N 学习笔记、CS231n 回顾，以及慢慢充实的收藏馆。",
  },
] as const;

export const currentFocus = [
  {
    code: "LEARNING",
    title: "自然语言处理",
    copy: "CS224N 笔记，从词向量与分布式语义开始。",
    href: "/study/#cs224n-nlp-word-vectors",
    action: "阅读笔记",
  },
  {
    code: "COLLECTION",
    title: "奇妙收藏馆",
    copy: "动画、游戏、手办，还有身边的设备。",
    href: "/collections/",
    action: "逛逛收藏馆",
  },
] as const;
