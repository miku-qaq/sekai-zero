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
  note?: string;
  href?: string;
  ariaLabel?: string;
};

export const profileFacts: readonly PublicProfileFact[] = [
  {
    label: "CN 名",
    value: publicProfile.handle,
  },
  {
    label: "当前阶段",
    value: publicProfile.academicStatus,
  },
  {
    label: "兴趣频道",
    value: publicProfile.interests.join(" / "),
  },
  {
    label: "常玩平台",
    value: publicProfile.gamingPlatforms.join(" / "),
  },
  {
    id: "contact",
    label: "联系邮箱",
    value: publicProfile.email,
    href: `mailto:${publicProfile.email}`,
    ariaLabel: `发送邮件至 ${publicProfile.email}`,
    note: "欢迎聊聊学习与共同的兴趣。",
  },
];
