export type CurrentSignal = {
  code: string;
  status: "学习笔记" | "游戏平台" | "常用网站";
  title: string;
  copy: string;
  href: string;
  action: string;
  tone: "blue" | "mint" | "violet";
};

/**
 * The owner's last confirmed interests and learning record. The date describes
 * that record, not the latest site deployment or an inferred progress update.
 */
export const currentBroadcast = {
  updatedAt: "2026.10.31",
  headline: "学习与日常。",
  summary: "记下所学，也留住喜欢。",
  panel: {
    eyebrow: "MIKUREINA",
    mark: "LIFE",
    title: "一边学习，一边收集喜欢。",
    copy: "南京大学 CS · 动漫 · 游戏",
  },
  signals: [
    {
      code: "01",
      status: "学习笔记",
      title: "大模型分布式训练系统",
      copy: "从多维并行到 MoE，沿着源码与实验继续深入。",
      href: "/study/#distributed-training-transformer-tp",
      action: "阅读笔记",
      tone: "blue",
    },
    {
      code: "02",
      status: "游戏平台",
      title: "Nintendo Switch · Steam",
      copy: "Steam 游戏已收进收藏馆。",
      href: "/collections/games/",
      action: "逛游戏收藏",
      tone: "mint",
    },
    {
      code: "03",
      status: "常用网站",
      title: "哔哩哔哩",
      copy: "我最喜欢的视频平台。",
      href: "/links/#route-bilibili",
      action: "打开导航终端",
      tone: "violet",
    },
  ] satisfies readonly CurrentSignal[],
} as const;
