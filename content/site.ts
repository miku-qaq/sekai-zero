import { publicProfile } from "./profile";

/**
 * Public-facing copy and navigation for the site.
 *
 * Keeping identity and editorial content outside React components makes weekly
 * updates safer: most copy changes happen here without touching layout code.
 */
/**
 * Canonical public route registry.
 *
 * Header, footer, homepage map, page mastheads and journey controls all read
 * this order so visitors never see conflicting labels or file numbers.
 */
export const worldRoutes = [
  {
    index: "01",
    href: "/about/",
    navLabel: "关于我",
    eyebrow: "ABOUT MIKUREINA",
    title: "关于 Mikureina",
    description:
      "认识 Mikureina：南京大学 CS 在读，喜欢动漫与游戏，最近正在自学自然语言处理。",
    action: "了解我",
    motif: "ID",
    tone: "mint",
    layout: "standard",
  },
  {
    index: "02",
    href: "/anime/",
    navLabel: "动画收藏",
    eyebrow: "ANIME COLLECTION",
    title: "动画收藏馆",
    description:
      "按 Mikureina 提供的已看片单整理；保留作品标题、年份、类型与可追溯封面来源。",
    action: "浏览动画收藏",
    motif: "★",
    tone: "pink",
    layout: "standard",
  },
  {
    index: "03",
    href: "/study/",
    navLabel: "学习笔记",
    eyebrow: "COMPUTER STUDY NOTES",
    title: "计算机学习笔记",
    description:
      "当前主线是 Stanford CS224N；也收录 Web、Git、TypeScript 与编码基础笔记。",
    action: "阅读笔记",
    motif: "</>",
    tone: "blue",
    layout: "featured",
  },
  {
    index: "04",
    href: "/links/",
    navLabel: "链接",
    eyebrow: "CURATED LINKS",
    title: "链接与收藏",
    description:
      "收录我喜欢的网站、当前学习资料、源码与联系方式；每条链接都说明留下的理由。",
    action: "浏览链接",
    motif: "↗",
    tone: "violet",
    layout: "standard",
  },
  {
    index: "05",
    href: "/logs/",
    navLabel: "日志",
    eyebrow: "WORLDLINE LOG",
    title: "世界线日志",
    description: "项目说明、制作取舍与历次更新集中收录在这里，不再散落到其他页面。",
    action: "阅读日志",
    motif: "05",
    tone: "amber",
    layout: "standard",
  },
] as const;

export type WorldRouteHref = (typeof worldRoutes)[number]["href"];

/** Header, footer, homepage map and journey controls share this route order. */
export const siteConfig = {
  name: "SEKAI / 00",
  shortName: "SEKAI",
  owner: publicProfile.handle,
  description:
    "Mikureina 的个人次元站：南京大学 CS 在读，记录动漫、游戏、计算机学习、链接收藏与网站世界线。",
  navigation: [
    { index: "00", label: "首页", href: "/" },
    ...worldRoutes.map(({ index, navLabel, href }) => ({
      index,
      label: navLabel,
      href,
    })),
  ],
} as const;

/**
 * Three compact manga beats used directly below the hero. They establish the
 * site's anime language before visitors reach the more detailed collection.
 */
export const homepageFacts = [
  {
    index: "01",
    label: "NJU / CS",
    soundEffect: "学ぶ",
    motif: "{ }",
    copy: "南京大学 CS 在读，持续学习计算机基础，也通过项目积累实践经验。",
    tone: "mint",
  },
  {
    index: "02",
    label: "CURRENT / NLP",
    soundEffect: "進行中",
    motif: "NLP",
    copy: "最近自学 Stanford CS224N，正从词向量与分布式语义开始整理笔记。",
    tone: "violet",
  },
  {
    index: "03",
    label: "ANIME / GAMES",
    soundEffect: "好き",
    motif: "NS",
    copy: "喜欢动漫和游戏，平时主要使用 Nintendo Switch 与 Steam。",
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
    note: "本站用薄荷色、音符与数字舞台表达未来感。",
    tags: ["电子歌姬", "未来感", "音乐"],
    program: {
      label: "STUDY SIGNAL / CH.39",
      title: "把词变成坐标",
      description:
        "学习舱正在整理 CS224N Word Vectors：从 one-hot 的局限走向稠密表示。",
      href: "/study/#cs224n-nlp-word-vectors",
      action: "进入学习舱",
    },
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
    note: "本站用雾紫、星轨与路线卡表达探索感。",
    tags: ["旅行魔女", "故事感", "星轨"],
    program: {
      label: "ROUTE SIGNAL / CH.07",
      title: "下一站，由好奇心选择",
      description: "航线终端收录本站频道与值得回来的公开入口，每条都说明为什么留下。",
      href: "/links/",
      action: "打开航线终端",
    },
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
    note: "本站用樱粉、节拍与舞台卡片表达摇滚感。",
    tags: ["摇滚少女", "社恐能量", "吉他"],
    program: {
      label: "BUILD SIGNAL / CH.06",
      title: "这座世界怎样做出来",
      description: "世界线日志集中记录 SEKAI / 00 的设计、内容结构与每次公开变化。",
      href: "/logs/#project-overview",
      action: "查看项目记录",
    },
  },
] as const;
