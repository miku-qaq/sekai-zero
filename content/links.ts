/** The same category order drives filters and the grouped directory. */
export const linkCategories = [
  {
    id: "video",
    label: "影音娱乐",
    description: "视频、电影和剧集，给日常留一点放松时间。",
    icon: "▶",
  },
  {
    id: "games",
    label: "游戏世界",
    description: "游戏平台、玩家交流与下一场冒险。",
    icon: "✧",
  },
  {
    id: "community",
    label: "社区收藏",
    description: "发现生活灵感，也查查喜欢的手办与周边。",
    icon: "♡",
  },
  {
    id: "shopping",
    label: "购物数码",
    description: "常用购物平台与喜欢的数码产品。",
    icon: "＋",
  },
  {
    id: "study",
    label: "学习资料",
    description: "正在学习的课程、讲义和自己的笔记。",
    icon: "N",
  },
  {
    id: "site",
    label: "本站相关",
    description: "看看这个小世界的源码，或者来打个招呼。",
    icon: "↗",
  },
] as const;

export type LinkCategoryId = (typeof linkCategories)[number]["id"];
export const linkGroups = [{ id: "all", label: "全部" }, ...linkCategories] as const;

export type LinkEntry = {
  id: string;
  group: LinkCategoryId;
  label: string;
  eyebrow: string;
  href: string;
  reason: string;
  tags: readonly string[];
  icon: string;
  action?: string;
  external?: boolean;
};

/** Curated, owner-confirmed destinations with a reason for every entry. */
export const linkEntries: readonly LinkEntry[] = [
  {
    id: "bilibili",
    group: "video",
    label: "哔哩哔哩 · Bilibili",
    eyebrow: "FAVORITE VIDEO PLATFORM",
    href: "https://www.bilibili.com/",
    reason: "我最喜欢的视频平台，也是导航终端里的第一条真实偏好。",
    tags: ["视频", "动漫", "Bilibili"],
    icon: "▶",
    action: "打开哔哩哔哩",
    external: true,
  },
  {
    id: "apple",
    group: "shopping",
    label: "Apple 中国官网",
    eyebrow: "FAVORITE PRODUCT ECOSYSTEM",
    href: "https://www.apple.com.cn/",
    reason: "我喜欢 Apple 产品；这里连接官方产品、设计与服务信息，不用第三方页面代替。",
    tags: ["Apple", "数码产品", "官方网站"],
    icon: "A",
    action: "打开 Apple 官网",
    external: true,
  },
  {
    id: "steam",
    group: "games",
    label: "Steam 商店",
    eyebrow: "GAME PLATFORM / OFFICIAL",
    href: "https://store.steampowered.com/",
    reason:
      "Steam 与 Nintendo Switch（NS）是我最喜欢的两个游戏平台；奇妙收藏馆游戏展柜里的 Steam 作品也都连接官方商店页。",
    tags: ["Steam", "游戏", "官方网站"],
    icon: "◎",
    action: "打开 Steam",
    external: true,
  },
  {
    id: "nintendo-switch",
    group: "games",
    label: "Nintendo Switch 官方网站",
    eyebrow: "FAVORITE GAME PLATFORM / OFFICIAL",
    href: "https://www.nintendo.com/hk/hardware/switch/index.html",
    reason:
      "Nintendo Switch（NS）与 Steam 是我最喜欢的两个游戏平台；具体 NS 游戏会在我确认清单后加入奇妙收藏馆的游戏展柜。",
    tags: ["Nintendo Switch", "NS", "游戏平台"],
    icon: "NS",
    action: "打开 Nintendo Switch 官网",
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
    icon: "NLP",
    action: "继续当前学习",
  },
  {
    id: "contact",
    group: "site",
    label: "联系 Mikureina",
    eyebrow: "PUBLIC MAILBOX",
    href: "/about/#contact",
    reason:
      "已确认的联系邮箱集中保留在角色设定档；关于本站、学习或共同兴趣，可以从那里写信。",
    tags: ["联系", "邮箱", "Mikureina"],
    icon: "@",
    action: "查看联系邮箱",
  },
  {
    id: "sekai-source",
    group: "site",
    label: "SEKAI / 00 源码仓库",
    eyebrow: "SOURCE / VERSION ARCHIVE",
    href: "https://github.com/miku-qaq/sekai-zero",
    reason:
      "本站源码、版本历史与发布流程都在这里公开，可以直接核对世界线日志中的制作说明。",
    tags: ["GitHub", "源码", "版本证据"],
    icon: "{ }",
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
    icon: "N",
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
    icon: "CV",
    action: "打开官方课程页",
    external: true,
  },
  {
    id: "netflix",
    group: "video",
    label: "Netflix",
    eyebrow: "FILMS / SERIES",
    href: "https://www.netflix.com/",
    reason: "电影、剧集与动画的观看入口，想找一部作品时从这里开始。",
    tags: ["Netflix", "奈飞", "网飞", "电影", "剧集"],
    icon: "N",
    action: "打开 Netflix",
    external: true,
  },
  {
    id: "xiaohongshu",
    group: "community",
    label: "小红书",
    eyebrow: "LIFE / INSPIRATION",
    href: "https://www.xiaohongshu.com/explore",
    reason: "生活经验、兴趣分享与日常灵感，收集那些想继续了解的小发现。",
    tags: ["小红书", "生活", "社区", "Xiaohongshu"],
    icon: "红",
    action: "打开小红书",
    external: true,
  },
  {
    id: "xiaoheihe",
    group: "games",
    label: "小黑盒",
    eyebrow: "GAMES / COMMUNITY",
    href: "https://www.xiaoheihe.cn/",
    reason: "看游戏资讯、玩家讨论和游戏资料，给下一款想玩的游戏找点参考。",
    tags: ["小黑盒", "游戏社区", "Steam", "HeyBox"],
    icon: "盒",
    action: "打开小黑盒",
    external: true,
  },
  {
    id: "hpoi",
    group: "community",
    label: "Hpoi 手办维基",
    eyebrow: "FIGURES / COLLECTION",
    href: "https://www.hpoi.net/",
    reason: "查询手办与模型资料，浏览官图、玩家晒图和周边资讯。",
    tags: ["Hpoi", "hopi", "手办", "模型", "收藏"],
    icon: "H",
    action: "打开 Hpoi",
    external: true,
  },
  {
    id: "jd",
    group: "shopping",
    label: "京东",
    eyebrow: "SHOPPING / JD",
    href: "https://www.jd.com/",
    reason: "常用购物入口之一，浏览数码家电和日常用品。",
    tags: ["京东", "JD", "购物", "数码家电"],
    icon: "JD",
    action: "打开京东",
    external: true,
  },
  {
    id: "taobao",
    group: "shopping",
    label: "淘宝",
    eyebrow: "SHOPPING / TAOBAO",
    href: "https://www.taobao.com/",
    reason: "逛店、找周边，也把日常想买的小东西慢慢挑好。",
    tags: ["淘宝", "Taobao", "购物", "周边"],
    icon: "淘",
    action: "打开淘宝",
    external: true,
  },
  {
    id: "pinduoduo",
    group: "shopping",
    label: "拼多多 · PDD",
    eyebrow: "SHOPPING / PDD",
    href: "https://www.pinduoduo.com/",
    reason: "日常购物与商品浏览的另一个入口，和京东、淘宝放在一起方便找到。",
    tags: ["拼多多", "PDD", "购物", "Pinduoduo"],
    icon: "拼",
    action: "打开拼多多",
    external: true,
  },
] as const;
