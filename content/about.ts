import { releaseHistory } from "./releases";

export const influenceSignals = [
  {
    index: "39",
    channel: "音乐频道",
    name: "初音未来",
    romanized: "HATSUNE MIKU",
    copy: "留给音乐、创作，以及把还没到来的明天先唱出来的冲动。",
    tone: "mint",
    motif: "♪",
  },
  {
    index: "07",
    channel: "旅行频道",
    name: "伊蕾娜",
    romanized: "ELAINA",
    copy: "留给好奇心、沿途故事，以及还没有被画完的未知地图。",
    tone: "violet",
    motif: "✦",
  },
  {
    index: "06",
    channel: "摇滚频道",
    name: "波奇",
    romanized: "BOCCHI",
    copy: "留给紧张时仍愿意抱紧吉他、把下一小节弹完的那一步。",
    tone: "pink",
    motif: "♬",
  },
] as const;

export const profileQuestions = [
  {
    question: "为什么要做这个网站？",
    answer:
      "因为我想拥有一个不受社交平台版式限制、可以长期积累的数字空间。它既是作品，也是记录兴趣与成长的容器。",
  },
  {
    question: "平时喜欢什么？",
    answer:
      "喜欢动漫和游戏，常用 Nintendo Switch 与 Steam。初音未来、伊蕾娜和波奇，也分别成为本站音乐、远行与摇滚三条灵感频道。",
  },
  {
    question: "最近在投入什么？",
    answer:
      "最近正在自学 Stanford CS224N 的公开课程资料，从自然语言处理与词表示开始建立知识地图；同时持续建设 SEKAI / 00。",
  },
] as const;

/** The profile shows the same release facts as Projects and Logs. */
export const profileTimeline = releaseHistory
  .toReversed()
  .map(({ episode, title, summary }) => ({ episode, title, copy: summary }));
