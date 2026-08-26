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
    note: "这是我在本站与网络上使用的公开称呼。",
  },
  {
    label: "当前阶段",
    value: publicProfile.academicStatus,
    note: "目前在南京大学学习计算机，也在持续整理个人学习笔记。",
  },
  {
    label: "兴趣频道",
    value: publicProfile.interests.join(" / "),
    note: "动漫与游戏，也是本站二次元主题和互动设计的主要来源。",
  },
  {
    label: "常玩平台",
    value: publicProfile.gamingPlatforms.join(" / "),
    note: "平时主要使用 Nintendo Switch（NS）与 Steam。",
  },
  {
    id: "contact",
    label: "联系邮箱",
    value: publicProfile.email,
    href: `mailto:${publicProfile.email}`,
    ariaLabel: `发送邮件至 ${publicProfile.email}`,
    note: "欢迎交流本站、计算机学习或共同兴趣；请勿通过邮件发送敏感信息。",
  },
];
