/**
 * Project 001 documents work that already exists in this repository. It is a
 * case study, not a claim about traffic, clients, revenue, or professional
 * experience that the site owner has not supplied.
 */
export const projectCaseStudy = {
  code: "CASE / 001",
  status: "ACTIVE · LONG-TERM BUILD",
  title: "SEKAI / 00",
  subtitle: "把一个喜欢二次元的念头，做成可以长期维护的个人世界。",
  summary:
    "从一张首页慢慢长大，记录学习与兴趣。使用 React 与 TypeScript，持续更新到 Sites 和 GitHub Pages。",
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
    title: "清晰的多页面内容",
    copy: "个人介绍、收藏、学习、导航与日志，各有自己的页面。",
  },
  {
    code: "FEATURE / 02",
    title: "可检索的兴趣与学习",
    copy: "收藏与笔记支持搜索、分类，也能直接分享笔记链接。",
  },
  {
    code: "FEATURE / 03",
    title: "可参与的二次元主题",
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
    question: "为什么先用 Git 管内容，而不是立即接 CMS？",
    decision:
      "当前内容规模仍适合强类型文件。它没有额外账号、数据库和编辑器维护成本，也能让每次内容变化跟随代码一起审查；当长篇笔记明显增多并需要独立文章能力时，再评估构建期 MDX。",
  },
  {
    question: "为什么不把所有组件都放到客户端？",
    decision:
      "只有确实依赖浏览器状态的交互才需要客户端 JavaScript。其余内容保持静态渲染，可以降低运行负担，并在脚本失败时仍然保留可读正文。",
  },
  {
    question: "为什么同时保留 Worker 与静态 Pages？",
    decision:
      "Worker 为未来登录、数据和服务端能力保留空间；Pages 验证内容层和路由没有被平台绑死，也提供更简单的公开备用出口。两者共享源码，但发布适配层彼此隔离。",
  },
] as const;
