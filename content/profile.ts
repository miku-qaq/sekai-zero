/**
 * Owner-confirmed public profile data.
 *
 * This is the only source of truth for real-world identity and contact fields.
 * Do not infer a legal name, degree, year, location, or social account from it.
 */
export const publicProfile = {
  handle: "Mikureina",
  monogram: "MR",
  academicStatus: "南京大学 · CS 在读",
  interests: ["动漫", "游戏"],
  gamingPlatforms: ["Nintendo Switch（NS）", "Steam"],
  email: "miku125194847@gmail.com",
} as const;

export type PublicProfileFact = {
  id?: string;
  label: string;
  value: string;
  note: string;
  href?: string;
  ariaLabel?: string;
};

export const profileFacts: readonly PublicProfileFact[] = [
  {
    label: "CN 名",
    value: publicProfile.handle,
    note: "欢迎在这个世界里这样称呼我；这是公开网络称呼，不代表法定姓名。",
  },
  {
    label: "当前阶段",
    value: publicProfile.academicStatus,
    note: "持续学习计算机，也把知识整理成可以反复返回的笔记。",
  },
  {
    label: "兴趣频道",
    value: publicProfile.interests.join(" / "),
    note: "喜欢的作品与收藏会在本人确认后逐步加入本站。",
  },
  {
    label: "常玩平台",
    value: publicProfile.gamingPlatforms.join(" / "),
    note: "具体游戏清单后续再认真整理，不用热门作品代填。",
  },
  {
    id: "contact",
    label: "联系邮箱",
    value: publicProfile.email,
    href: `mailto:${publicProfile.email}`,
    ariaLabel: `发送邮件至 ${publicProfile.email}`,
    note: "适合交流本站、学习或共同兴趣；请勿通过邮件发送敏感信息。",
  },
];
