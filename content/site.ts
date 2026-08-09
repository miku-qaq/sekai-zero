/**
 * Public-facing copy and navigation for the site.
 *
 * Keeping identity and editorial content outside React components makes weekly
 * updates safer: most copy changes happen here without touching layout code.
 */
export const siteConfig = {
  name: "SEKAI / 00",
  shortName: "SEKAI",
  description: "一个在现实与次元之间持续生长的个人空间，收藏作品、想法与生活切片。",
  navigation: [
    { label: "关于", href: "#about" },
    { label: "收藏", href: "#favorites" },
    { label: "扭蛋", href: "#gacha" },
    { label: "作品", href: "#works" },
    { label: "日志", href: "#notes" },
    { label: "路线图", href: "#roadmap" },
  ],
} as const;

/**
 * Three compact manga beats used directly below the hero. They establish the
 * site's anime language before visitors reach the more detailed collection.
 */
export const mangaMoments = [
  {
    index: "01",
    label: "SING",
    soundEffect: "キラッ",
    motif: "♪",
    copy: "把还没有形状的明天，先唱给它听。",
    tone: "mint",
  },
  {
    index: "02",
    label: "WANDER",
    soundEffect: "ふわっ",
    motif: "✦",
    copy: "把每一次远行，收进自己的故事书。",
    tone: "violet",
  },
  {
    index: "03",
    label: "ROCK",
    soundEffect: "ジャーン",
    motif: "♬",
    copy: "就算紧张到融化，也要弹完这一小节。",
    tone: "pink",
  },
] as const;

/**
 * Expandable card pool for the dimensional gacha. These are original prompts
 * inspired by the emotional qualities the owner enjoys in three characters;
 * they are not quotations from the source works.
 */
export const dimensionalFortunes = [
  {
    id: "miku-tomorrow",
    channel: "miku",
    rarity: "SSR",
    code: "MINT SIGNAL / 39",
    motif: "♪",
    title: "先让明天发出声音",
    message: "不必等到一切准备完美。今天完成的一个小片段，就能成为未来真正开始的前奏。",
    action: "行动指令：完成一件可以分享的小作品。",
  },
  {
    id: "elaina-detour",
    channel: "elaina",
    rarity: "SR",
    code: "ASH VOYAGE / 07",
    motif: "✦",
    title: "绕路也算旅程",
    message:
      "计划之外的风景并不是浪费时间；把意外记下来，它可能正是今天最值得收藏的故事。",
    action: "行动指令：记录一个意外发现。",
  },
  {
    id: "bocchi-stage",
    channel: "bocchi",
    rarity: "SSR",
    code: "PINK ROCK / 06",
    motif: "♬",
    title: "紧张也可以上台",
    message: "勇气不是完全不害怕，而是手还在发抖时，也愿意把下一小节认真弹完。",
    action: "行动指令：公开一个还不完美的想法。",
  },
  {
    id: "miku-rhythm",
    channel: "miku",
    rarity: "SR",
    code: "MINT LOOP / 01",
    motif: "♫",
    title: "把重复练习变成节奏",
    message: "那些看似普通的重复，会在某个时刻突然连成旋律。今天只需要守住自己的节拍。",
    action: "行动指令：给重要技能留二十五分钟。",
  },
  {
    id: "elaina-curiosity",
    channel: "elaina",
    rarity: "SSR",
    code: "VIOLET MAP / 02",
    motif: "✧",
    title: "让好奇心先出发",
    message:
      "地图不一定要完整才启程。先朝那个让你忍不住多看一眼的方向，迈出很小的一步。",
    action: "行动指令：打开一个一直想了解的主题。",
  },
  {
    id: "bocchi-next-bar",
    channel: "bocchi",
    rarity: "SR",
    code: "PINK BAR / 04",
    motif: "♩",
    title: "只弹下一小节",
    message: "任务大到让人想融化时，不用解决整首歌。把眼前这一小节弹好，就已经在前进。",
    action: "行动指令：把大任务缩成十分钟步骤。",
  },
] as const;

export const favoriteChannels = [
  {
    id: "miku",
    index: "01",
    name: "初音未来",
    romanized: "HATSUNE MIKU",
    motif: "♪",
    rarity: "SSR",
    chapter: "VOICE OF TOMORROW",
    signal: "MIKU GREEN / DIGITAL POP",
    note: "把还没发生的明天，唱成现在就想抵达的样子。",
    sync: 99,
    tags: ["电子歌姬", "未来感", "音乐"],
  },
  {
    id: "elaina",
    index: "02",
    name: "伊蕾娜",
    romanized: "ELAINA",
    motif: "✦",
    rarity: "SSR",
    chapter: "WANDERING WITCH",
    signal: "ASH VIOLET / WANDER",
    note: "保持好奇，去看更远的地方，也把沿途故事认真收好。",
    sync: 92,
    tags: ["旅行魔女", "故事感", "星轨"],
  },
  {
    id: "bocchi",
    index: "03",
    name: "波奇",
    romanized: "BOCCHI",
    motif: "♬",
    rarity: "SSR",
    chapter: "SHY ROCK HERO",
    signal: "SHY PINK / ROCK ON",
    note: "即使紧张到快要融化，也可以抱紧吉他，再向前一步。",
    sync: 96,
    tags: ["摇滚少女", "社恐能量", "吉他"],
  },
] as const;

export const projectHighlights = [
  {
    index: "01",
    status: "NOW BUILDING",
    title: "SEKAI / 00",
    subtitle: "长期个人网站",
    description:
      "不是一次性交付的简历模板，而是一套可以每周继续生长的数字空间。首章从设计系统、响应式体验与工程质量开始。",
    tags: ["TypeScript", "React", "Design System"],
    tone: "cyan",
  },
  {
    index: "02",
    status: "NEXT CHAPTER",
    title: "作品陈列室",
    subtitle: "可检索的项目档案",
    description:
      "下一阶段会把真实作品整理为独立案例，补充目标、过程、结果与复盘，而不只展示一张截图。",
    tags: ["Case Study", "Filter", "MDX"],
    tone: "violet",
  },
  {
    index: "03",
    status: "RESERVED",
    title: "次元实验室",
    subtitle: "互动与创意实验",
    description:
      "为小游戏、音乐可视化、像素组件和有趣的浏览器实验预留空间；每项功能都独立演进，不拖累主站。",
    tags: ["Creative Code", "Web Audio", "Lab"],
    tone: "pink",
  },
] as const;

export const fieldNotes = [
  {
    id: "LOG 001",
    date: "2026.08.09",
    title: "先把房子搭稳，再开始装饰",
    excerpt:
      "清晰的边界、自动检查和可替换的内容层，决定了这个网站半年后还能不能轻松修改。",
  },
  {
    id: "LOG 002",
    date: "DESIGN NOTE",
    title: "现代感，不等于堆满特效",
    excerpt: "大部分界面保持安静，只把动画留给状态、反馈与少数值得记住的瞬间。",
  },
  {
    id: "LOG 003",
    date: "NEXT WEEK",
    title: "给每次更新留一扇门",
    excerpt:
      "路线图以小步迭代为单位：每周交付一件可以验证的改进，并把决定写进项目文档。",
  },
] as const;

export const roadmap = [
  {
    phase: "01",
    title: "稳定地基",
    status: "本周",
    description: "品牌首页、响应式布局、主题切换、质量检查与发布流程。",
  },
  {
    phase: "02",
    title: "录入真实内容",
    status: "下一步",
    description: "替换公开身份、作品、社交链接与兴趣收藏，不虚构任何个人资料。",
  },
  {
    phase: "03",
    title: "内容系统",
    status: "规划中",
    description: "引入 MDX 文章、标签、搜索、RSS 与可持续维护的媒体资源管线。",
  },
  {
    phase: "04",
    title: "次元实验室",
    status: "未来",
    description: "按需加入互动实验、数据服务和后台；每项能力保持可拆卸。",
  },
] as const;
