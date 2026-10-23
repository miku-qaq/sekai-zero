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
  headline: "最近在做。",
  summary: "自学 CS224N，也回顾 CS231n。",
  panel: {
    eyebrow: "MIKUREINA / CURRENTLY",
    mark: "NOW",
    title: "一边学习，一边收集喜欢。",
    copy: "南京大学 CS · 动漫 · 游戏",
  },
  signals: [
    {
      code: "LEARNING / NLP-001",
      status: "正在学习",
      title: "CS224N · 词向量",
      copy: "从词表示与分布式语义开始。",
      href: "/study/#cs224n-nlp-word-vectors",
      action: "阅读笔记",
      tone: "blue",
    },
    {
      code: "GAMES / NS + STEAM",
      status: "兴趣状态",
      title: "Nintendo Switch · Steam",
      copy: "Steam 游戏已收进收藏馆。",
      href: "/collections/games/",
      action: "查看游戏收藏",
      tone: "mint",
    },
    {
      code: "FAVORITE / VIDEO",
      status: "个人收藏",
      title: "哔哩哔哩",
      copy: "我最喜欢的视频平台。",
      href: "/links/#route-bilibili",
      action: "常用网站",
      tone: "violet",
    },
  ] satisfies readonly CurrentSignal[],
} as const;
