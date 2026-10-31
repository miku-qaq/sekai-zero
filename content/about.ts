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
    answer:
      "最近在整理大模型分布式训练系统，也保留 CS224N 笔记、CS231n 回顾和喜欢的收藏。",
  },
] as const;

export const currentFocus = [
  {
    code: "LEARNING",
    title: "大模型分布式训练系统",
    copy: "围绕 Megatron Core、MoE、Parallel Folding 与 UniAP，串起多维并行和性能实验。",
    href: "/study/#distributed-training-transformer-tp",
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
