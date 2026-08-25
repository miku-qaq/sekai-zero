import { currentRelease } from "./releases";

export type CurrentSignal = {
  code: string;
  status: "IN PROGRESS" | "ON AIR" | "QUEUED";
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
  episode: currentRelease.episode,
  episodeNumber: currentRelease.number,
  updatedAt: currentRelease.date,
  headline: "这一周，正在让学习、建站与下一步彼此相连。",
  summary:
    "这里是会随真实进度更新的信号台。每条信号都通往可以继续阅读的页面，而不是停在一句没有上下文的状态。",
  signals: [
    {
      code: "LEARNING / NLP-001",
      status: "IN PROGRESS",
      title: "Stanford CS224N · Word Vectors",
      copy: "正在自学公开课程资料，从 NLP、词表示与分布式语义开始整理自己的知识地图。",
      href: "/study/#cs224n-nlp-word-vectors",
      action: "继续当前笔记",
      tone: "blue",
    },
    {
      code: `BUILDING / ${currentRelease.episode}`,
      status: "ON AIR",
      title: currentRelease.title,
      copy: currentRelease.summary,
      href: "/projects/",
      action: "查看制作证据",
      tone: "mint",
    },
    {
      code: "NEXT / NLP-002",
      status: "QUEUED",
      title: "Word2Vec 目标与梯度",
      copy: "把当前概念推进到损失函数、负采样目标、梯度更新与一次可运行训练实验；完成理解后再发布。",
      href: "/study/#learning-queue",
      action: "查看学习队列",
      tone: "violet",
    },
  ] satisfies readonly CurrentSignal[],
} as const;
