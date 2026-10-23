/**
 * Project 001 documents work that already exists in this repository. It is a
 * case study, not a claim about traffic, clients, revenue, or professional
 * experience that the site owner has not supplied.
 */
export const projectCaseStudy = {
  code: "CASE / 001",
  status: "ACTIVE · LONG-TERM BUILD",
  title: "SEKAI / 00",
  subtitle: "从喜欢二次元，到拥有自己的小世界。",
  summary: "从一张首页慢慢长大，把学习与收藏放在一起。",
  facts: [
    { label: "项目类型", value: "长期个人网站" },
    { label: "核心技术", value: "TypeScript / React" },
    { label: "内容方式", value: "Git as CMS" },
    { label: "发布目标", value: "Sites / GitHub Pages" },
  ],
} as const;

export const projectEvidence = [
  {
    code: "LIVE",
    label: "打开公开网站",
    href: "https://miku-qaq.github.io/sekai-zero/",
    external: true,
  },
  {
    code: "SOURCE",
    label: "查看 GitHub 仓库",
    href: "https://github.com/miku-qaq/sekai-zero",
    external: true,
  },
  {
    code: "CHANGELOG",
    label: "读取世界线日志",
    href: "/logs/",
    external: false,
  },
] as const;

export const projectFeatures = [
  {
    code: "FEATURE / 01",
    title: "各有一页",
    copy: "个人介绍、收藏、学习、导航与日志，各有自己的页面。",
  },
  {
    code: "FEATURE / 02",
    title: "随时查找",
    copy: "收藏与笔记支持搜索、分类，也能直接分享笔记链接。",
  },
  {
    code: "FEATURE / 03",
    title: "角色与配色",
    copy: "切换角色频道与配色，偏好保存在当前设备。",
  },
  {
    code: "FEATURE / 04",
    title: "适配不同设备",
    copy: "适配电脑与手机，支持键盘操作和明暗主题。",
  },
] as const;

export const projectDecisions = [
  {
    question: "为什么用 Git 管内容？",
    decision:
      "当前规模适合用强类型文件保存内容，改动与代码一起记录。等长篇笔记增多，再考虑 MDX。",
  },
  {
    question: "哪些内容需要 JavaScript？",
    decision:
      "搜索、筛选和主题切换需要浏览器交互；正文保持静态，减少加载负担，脚本失效时也能阅读。",
  },
  {
    question: "为什么保留两种发布方式？",
    decision:
      "Worker 留出服务端扩展空间，GitHub Pages 提供静态访问入口。两者共用源码，各自构建。",
  },
] as const;
