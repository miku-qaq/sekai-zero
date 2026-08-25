import { publicProfile } from "./profile";
import { releaseHistory } from "./releases";

/**
 * Public-facing copy and navigation for the site.
 *
 * Keeping identity and editorial content outside React components makes weekly
 * updates safer: most copy changes happen here without touching layout code.
 */
/** Primary routes shown as the homepage's world map. */
export const worldRoutes = [
  {
    index: "01",
    href: "/about/",
    navLabel: "关于我",
    eyebrow: "CHARACTER FILE",
    title: "角色设定档",
    description:
      "认识 Mikureina：南京大学 CS 在读，喜欢动漫、游戏，并认真记录正在学习和愿意长期坚持的事情。",
    action: "读取档案",
    motif: "ID",
    tone: "mint",
    layout: "standard",
  },
  {
    index: "02",
    href: "/links/",
    navLabel: "航线终端",
    eyebrow: "ROUTE TERMINAL",
    title: "航线终端",
    description: "每一个入口都附带一条愿意回来的理由；不是没有灵魂的常用网站大全。",
    action: "选择航线",
    motif: "↗",
    tone: "violet",
    layout: "standard",
  },
  {
    index: "03",
    href: "/projects/",
    navLabel: "制作档案",
    eyebrow: "PRODUCTION DOSSIER",
    title: "制作档案",
    description: "不只展示完成画面，也记录目标、结构、取舍与仍在进行的下一步。",
    action: "读取 Project 001",
    motif: "作",
    tone: "amber",
    layout: "featured",
  },
  {
    index: "04",
    href: "/study/",
    navLabel: "学习笔记",
    eyebrow: "COMPUTER STUDY DECK",
    title: "计算机学习舱",
    description:
      "正在自学 Stanford CS224N 公开课程资料；把 NLP 与计算机概念整理成可以搜索、复述和继续扩充的知识地图。",
    action: "开始复习",
    motif: "</>",
    tone: "blue",
    layout: "standard",
  },
  {
    index: "05",
    href: "/logs/",
    navLabel: "世界线日志",
    eyebrow: "TIMELINE ARCHIVE",
    title: "世界线日志",
    description: "把每一话的变化、选择和复盘写下来，让网站成长本身也成为内容。",
    action: "追更日志",
    motif: "05",
    tone: "pink",
    layout: "standard",
  },
] as const;

/** Header, footer, homepage map and journey controls share this route order. */
export const siteConfig = {
  name: "SEKAI / 00",
  shortName: "SEKAI",
  owner: publicProfile.handle,
  description:
    "Mikureina 的个人次元站：南京大学 CS 在读，记录动漫、游戏、计算机学习、作品与长期建站过程。",
  navigation: [
    { label: "首页", href: "/" },
    ...worldRoutes.map(({ navLabel, href }) => ({ label: navLabel, href })),
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
    status: "CASE 001 ONLINE",
    title: "制作档案",
    subtitle: "真实项目案例",
    description:
      "先把本站本身整理为第一份案例：问题、目标、系统、质量标准与每一话的演进都可以追溯。",
    tags: ["Case Study", "Architecture", "Evidence"],
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

/** Compact homepage notes derived from the same source as the full log. */
export const fieldNotes = releaseHistory.map(({ number, date, title, summary }) => ({
  id: `LOG ${number}`,
  date,
  title,
  excerpt: summary,
}));

export const roadmap = [
  {
    phase: "01",
    title: "稳定地基",
    status: "已上线 · 持续维护",
    description: "品牌首页、响应式布局、主题切换、质量检查与发布流程。",
  },
  {
    phase: "02",
    title: "展开多页世界",
    status: "已上线",
    description:
      "独立 About、Links、Projects、Study 与 Logs 路由，共享导航、内容模型和双目标静态路径。",
  },
  {
    phase: "03",
    title: "录入真实内容",
    status: "已点亮一部分",
    description:
      "Mikureina 的称呼、学习状态、兴趣、游戏平台与联系邮箱已经上线；作品、收藏与社交坐标继续按确认范围补充。",
  },
  {
    phase: "04",
    title: "内容系统",
    status: "规划中",
    description: "引入 MDX 文章、标签、搜索、RSS 与可持续维护的媒体资源管线。",
  },
  {
    phase: "05",
    title: "次元实验室",
    status: "未来",
    description: "按需加入互动实验、数据服务和后台；每项能力保持可拆卸。",
  },
] as const;
