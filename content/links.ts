export type LinkEntry = {
  id: string;
  group: "internal" | "study" | "toolkit" | "contact";
  label: string;
  eyebrow: string;
  href: string;
  reason: string;
  tags: readonly string[];
  action?: string;
  external?: boolean;
};

/**
 * Curated routes and tools with an editorial reason for every entry. External
 * social accounts and friend links stay absent until the owner supplies them.
 */
export const linkEntries: readonly LinkEntry[] = [
  {
    id: "about",
    group: "internal",
    label: "角色设定档",
    eyebrow: "PROFILE CHANNEL",
    href: "/about/",
    reason: "先认识正在建设这座世界的人，以及目前愿意公开的真实部分。",
    tags: ["关于我", "设定", "长期主线"],
  },
  {
    id: "projects",
    group: "internal",
    label: "制作档案",
    eyebrow: "PRODUCTION DOSSIER",
    href: "/projects/",
    reason: "查看这座网站真实的问题、目标、结构、取舍与版本证据，而不只看最终画面。",
    tags: ["项目", "案例", "工程"],
  },
  {
    id: "study",
    group: "internal",
    label: "计算机学习舱",
    eyebrow: "KNOWLEDGE DECK",
    href: "/study/",
    reason: "把计算机概念整理成可以搜索、展开、复述和继续校订的个人知识地图。",
    tags: ["学习", "计算机", "笔记"],
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
    id: "logs",
    group: "internal",
    label: "世界线日志",
    eyebrow: "UPDATE ARCHIVE",
    href: "/logs/",
    reason: "查看每一话改了什么、为什么这样做，以及下一步会通向哪里。",
    tags: ["日志", "设计", "复盘"],
  },
  {
    id: "gacha",
    group: "internal",
    label: "次元扭蛋机",
    eyebrow: "BONUS TRACK",
    href: "/#gacha",
    reason: "抽一张原创次元签，给今天一个轻松但能够执行的行动提示。",
    tags: ["互动", "随机", "小彩蛋"],
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
    id: "react",
    group: "toolkit",
    label: "React",
    eyebrow: "INTERFACE ENGINE",
    href: "https://react.dev/",
    reason: "用可组合组件拆开复杂界面，让每个频道可以独立维护和继续扩充。",
    tags: ["组件", "前端", "开源"],
    external: true,
  },
  {
    id: "typescript",
    group: "toolkit",
    label: "TypeScript",
    eyebrow: "TYPE SYSTEM",
    href: "https://www.typescriptlang.org/",
    reason: "让内容模型和组件契约更清楚，降低长期改版时悄悄出错的概率。",
    tags: ["类型", "质量", "可维护"],
    external: true,
  },
  {
    id: "sekai-source",
    group: "toolkit",
    label: "SEKAI / 00 源码仓库",
    eyebrow: "SOURCE / VERSION ARCHIVE",
    href: "https://github.com/miku-qaq/sekai-zero",
    reason: "本站源码、版本历史与发布流程都在这里公开，可以直接核对制作档案中的说明。",
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
    id: "cs224n-word-vectors",
    group: "study",
    label: "CS224N · Word Vectors",
    eyebrow: "LECTURE 02 / PRIMARY SOURCE",
    href: "https://web.stanford.edu/class/cs224n/slides_w26/cs224n-2026-lecture02-wordvecs.pdf",
    reason: "当前词向量笔记对应的官方课程讲义，用来继续核对表示、训练目标与负采样。",
    tags: ["Lecture 2", "Word2Vec", "PDF"],
    action: "阅读官方讲义",
    external: true,
  },
] as const;

export const linkGroups = [
  { id: "all", label: "全部航线" },
  { id: "internal", label: "本站频道" },
  { id: "study", label: "学习信标" },
  { id: "toolkit", label: "建造装备" },
  { id: "contact", label: "公开坐标" },
] as const;

export const dormantSectors = [
  {
    title: "灵感星球",
    code: "SECTOR / INSPIRATION",
    copy: "等我整理好真正影响过自己的博客、作品与创作者后再录入；每条都会写下为什么收藏。",
  },
  {
    title: "朋友的世界",
    code: "SECTOR / FRIENDS",
    copy: "这个星域还没有公开坐标。等我确认后再点亮，不为了热闹而虚构友链。",
  },
  {
    title: "游戏收藏馆",
    code: "SECTOR / GAMES",
    copy: "Nintendo Switch 与 Steam 已经确认；具体游戏、游玩状态和收藏理由会等真实清单准备好后再录入。",
  },
] as const;
