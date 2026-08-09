export type LinkEntry = {
  id: string;
  group: "internal" | "toolkit";
  label: string;
  eyebrow: string;
  href: string;
  reason: string;
  tags: readonly string[];
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
    id: "github",
    group: "toolkit",
    label: "GitHub",
    eyebrow: "VERSION ARCHIVE",
    href: "https://github.com/",
    reason: "保存每一次可追溯的变化，并为持续集成与公开发布提供入口。",
    tags: ["Git", "版本", "协作"],
    external: true,
  },
] as const;

export const linkGroups = [
  { id: "all", label: "全部航线" },
  { id: "internal", label: "本站频道" },
  { id: "toolkit", label: "建造装备" },
] as const;

export const dormantSectors = [
  {
    title: "灵感星球",
    code: "SECTOR / INSPIRATION",
    copy: "等待录入真正影响过我的博客、作品与创作者。每条都会写下为什么收藏。",
  },
  {
    title: "朋友的世界",
    code: "SECTOR / FRIENDS",
    copy: "这个星域还没有公开坐标。等主人确认后再点亮，拒绝为了热闹而虚构友链。",
  },
  {
    title: "我的公开坐标",
    code: "SECTOR / SOCIAL",
    copy: "社交主页与联系方式尚未公开；未来会在确认隐私边界后逐项接入。",
  },
] as const;
