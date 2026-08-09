/**
 * Public profile copy. Only facts explicitly established by the owner belong
 * here; private or unknown fields are intentionally omitted instead of filled
 * with invented biography.
 */
export const profileFacts = [
  {
    label: "当前主线",
    value: "把个人网站做成长期作品",
    note: "每周持续迭代，让内容、设计与工程一起成长。",
  },
  {
    label: "推し频道",
    value: "初音未来 / 伊蕾娜 / 波奇",
    note: "音乐、远行与摇滚，构成这个世界的三种能量。",
  },
  {
    label: "网络坐标",
    value: "SEKAI / 00",
    note: "一处连接作品、兴趣、日志与实验的个人空间。",
  },
  {
    label: "开发节奏",
    value: "长期连载 / 小步发布",
    note: "每次更新都应该独立可用，也留下可追溯的版本记录。",
  },
] as const;

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
      "会逐步公开我愿意分享的作品、建站日志、兴趣收藏与创意实验。现实身份只在我主动确认后出现，不为了填满页面而虚构。",
  },
  {
    question: "最近在投入什么？",
    answer:
      "当前主线就是 SEKAI / 00：从单页升级为可扩展的多页面网站，并把每一次设计和工程决定记录下来。",
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
] as const;
