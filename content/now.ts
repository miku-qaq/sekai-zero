export type CurrentSignal = {
  code: string;
  status: "正在学习" | "兴趣状态" | "个人收藏";
  title: string;
  copy: string;
  href: string;
  action: string;
  tone: "blue" | "mint" | "violet";
};

/**
 * A small, owner-verifiable snapshot of what is happening now. This deliberately
 * avoids invented watching, playing or progress data just to make the site busy.
 */
export const currentBroadcast = {
  updatedAt: "2026.08.29",
  headline: "最近在做什么？",
  summary:
    "目前正在自学 Stanford CS224N，也会回顾此前学过的 CS231n；动画、游戏、手办和喜欢的网站都在慢慢整理进自己的世界。",
  panel: {
    eyebrow: "MIKUREINA / CURRENTLY",
    mark: "NOW",
    title: "学习与兴趣，都在这里留下真实进度。",
    copy: "南京大学 CS 在读 · 动漫与游戏爱好者 · SEKAI / 00 长期维护者",
  },
  signals: [
    {
      code: "LEARNING / NLP-001",
      status: "正在学习",
      title: "Stanford CS224N · Word Vectors",
      copy: "正在自学公开课程资料，从 NLP、词表示与分布式语义开始整理自己的知识地图。",
      href: "/study/#cs224n-nlp-word-vectors",
      action: "继续当前笔记",
      tone: "blue",
    },
    {
      code: "GAMES / NS + STEAM",
      status: "兴趣状态",
      title: "Nintendo Switch · Steam",
      copy: "Steam 游玩记录与 Nintendo Switch 待补清单，已经归入奇妙收藏馆的游戏展柜。",
      href: "/collections/games/",
      action: "打开奇妙收藏馆",
      tone: "mint",
    },
    {
      code: "FAVORITE / VIDEO",
      status: "个人收藏",
      title: "哔哩哔哩 · Bilibili",
      copy: "我最喜欢的视频平台，也是导航终端中第一条明确确认的个人网站收藏。",
      href: "/links/#route-bilibili",
      action: "打开导航终端",
      tone: "violet",
    },
  ] satisfies readonly CurrentSignal[],
} as const;
