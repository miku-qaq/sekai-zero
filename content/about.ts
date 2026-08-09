export const influenceSignals = [
  {
    index: "39",
    channel: "音乐频道",
    name: "初音未来",
    romanized: "HATSUNE MIKU",
    copy: "留给音乐、创作，以及把还没到来的明天先唱出来的冲动。",
    tone: "mint",
    motif: "♪",
  },
  {
    index: "07",
    channel: "旅行频道",
    name: "伊蕾娜",
    romanized: "ELAINA",
    copy: "留给好奇心、沿途故事，以及还没有被画完的未知地图。",
    tone: "violet",
    motif: "✦",
  },
  {
    index: "06",
    channel: "摇滚频道",
    name: "波奇",
    romanized: "BOCCHI",
    copy: "留给紧张时仍愿意抱紧吉他、把下一小节弹完的那一步。",
    tone: "pink",
    motif: "♬",
  },
] as const;

export const profileQuestions = [
  {
    question: "为什么要做这个网站？",
    answer:
      "因为我想拥有一个不受社交平台版式限制、可以长期积累的数字空间。它既是作品，也是记录兴趣与成长的容器。",
  },
  {
    question: "这里会公开什么？",
    answer:
      "目前公开了 Mikureina 这个称呼、南京大学 CS 在读的学习状态、动漫与游戏兴趣、常玩平台和联系邮箱。没有确认的年级、经历与社交账号不会为了填满页面而虚构。",
  },
  {
    question: "最近在投入什么？",
    answer:
      "一边学习计算机，一边长期建设 SEKAI / 00：继续完善多页面内容，并把每一次设计与工程决定记录下来。",
  },
] as const;

export const profileTimeline = [
  {
    episode: "EP.001",
    title: "建立稳定地基",
    copy: "确定 TypeScript、React、自动检查、响应式布局与可替换内容层。",
  },
  {
    episode: "EP.002",
    title: "点亮次元主视觉",
    copy: "让漫画分镜、角色频道、扭蛋与主题色成为叙事的一部分。",
  },
  {
    episode: "EP.003",
    title: "展开个人宇宙",
    copy: "从一张长首页走向关于、航线与日志各自独立的页面体系。",
  },
  {
    episode: "EP.004",
    title: "建立计算机学习舱",
    copy: "把学习内容从版本日志中分离，整理成可搜索、可复习、可持续校订的知识地图。",
  },
  {
    episode: "EP.005",
    title: "整理第一份制作档案",
    copy: "把本站本身作为真实案例，记录目标、结构、取舍与能够核对的演进证据。",
  },
  {
    episode: "EP.006",
    title: "让真实档案上线",
    copy: "把主人确认公开的称呼、学习状态、兴趣、游戏平台与联系入口写进角色设定档。",
  },
] as const;
