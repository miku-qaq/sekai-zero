export type LinkEntry = {
  id: string;
  group: "favorite" | "study" | "project" | "contact";
  label: string;
  eyebrow: string;
  href: string;
  reason: string;
  tags: readonly string[];
  action?: string;
  external?: boolean;
};

/** Curated, owner-confirmed destinations with a reason for every entry. */
export const linkEntries: readonly LinkEntry[] = [
  {
    id: "bilibili",
    group: "favorite",
    label: "哔哩哔哩 · Bilibili",
    eyebrow: "FAVORITE VIDEO PLATFORM",
    href: "https://www.bilibili.com/",
    reason: "我最喜欢的视频平台，也是这份个人链接收藏里的第一条真实偏好。",
    tags: ["视频", "动漫", "Bilibili"],
    action: "打开哔哩哔哩",
    external: true,
  },
  {
    id: "apple",
    group: "favorite",
    label: "Apple 中国官网",
    eyebrow: "FAVORITE PRODUCT ECOSYSTEM",
    href: "https://www.apple.com.cn/",
    reason: "我喜欢 Apple 产品；这里连接官方产品、设计与服务信息，不用第三方页面代替。",
    tags: ["Apple", "数码产品", "官方网站"],
    action: "打开 Apple 官网",
    external: true,
  },
  {
    id: "steam",
    group: "favorite",
    label: "Steam 商店",
    eyebrow: "GAME PLATFORM / OFFICIAL",
    href: "https://store.steampowered.com/",
    reason:
      "Steam 是我平时主要使用的游戏平台之一；游戏收藏馆里的作品也都链接回官方商店页。",
    tags: ["Steam", "游戏", "官方网站"],
    action: "打开 Steam",
    external: true,
  },
  {
    id: "current-cs224n-note",
    group: "study",
    label: "CS224N 当前笔记",
    eyebrow: "NOW LEARNING / NLP-001",
    href: "/study/#cs224n-nlp-word-vectors",
    reason:
      "从词表示与分布式语义开始，直接进入我正在整理的 CS224N 自学记录与回忆问题。",
    tags: ["CS224N", "NLP", "Word Vectors"],
    action: "继续当前学习",
  },
  {
    id: "contact",
    group: "contact",
    label: "联系 Mikureina",
    eyebrow: "PUBLIC MAILBOX",
    href: "/about/#contact",
    reason:
      "已确认的联系邮箱集中保留在角色设定档；关于本站、学习或共同兴趣，可以从那里写信。",
    tags: ["联系", "邮箱", "Mikureina"],
    action: "查看联系邮箱",
  },
  {
    id: "sekai-source",
    group: "project",
    label: "SEKAI / 00 源码仓库",
    eyebrow: "SOURCE / VERSION ARCHIVE",
    href: "https://github.com/miku-qaq/sekai-zero",
    reason:
      "本站源码、版本历史与发布流程都在这里公开，可以直接核对世界线日志中的制作说明。",
    tags: ["GitHub", "源码", "版本证据"],
    action: "核对公开仓库",
    external: true,
  },
  {
    id: "cs224n-course",
    group: "study",
    label: "Stanford CS224N",
    eyebrow: "OFFICIAL COURSE / PRIMARY SOURCE",
    href: "https://web.stanford.edu/class/cs224n/",
    reason: "当前 NLP 学习主线的一手入口；课程范围、讲义与安排都优先回到官方页面核对。",
    tags: ["Stanford", "NLP", "官方课程"],
    action: "打开官方课程页",
    external: true,
  },
  {
    id: "cs231n-course",
    group: "study",
    label: "Stanford CS231n",
    eyebrow: "COURSE REVIEW / PRIMARY SOURCE",
    href: "https://cs231n.stanford.edu/",
    reason:
      "此前学习过的计算机视觉公开课程资料；回顾笔记会以当前官方页面和讲义核对概念边界。",
    tags: ["Stanford", "计算机视觉", "CS231n"],
    action: "打开官方课程页",
    external: true,
  },
] as const;

export const linkGroups = [
  { id: "all", label: "全部" },
  { id: "favorite", label: "我的收藏" },
  { id: "study", label: "学习资料" },
  { id: "project", label: "项目源码" },
  { id: "contact", label: "联系" },
] as const;

/**
 * One intentional blank card keeps the collection visibly extensible without
 * publishing invented favorites. It is not counted as an available route.
 */
export const linkPlaceholder = {
  eyebrow: "NEXT FAVORITE / OPEN SLOT",
  label: "下一枚收藏坐标",
  reason:
    "这里会留给下一项由 Mikureina 亲自确认的网站；内容待补充，但不会为了填满版面而虚构。",
  tags: ["有意留白", "待确认"],
} as const;
