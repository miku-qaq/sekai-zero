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
    "这个项目不是一次性简历模板。它从一张首页开始，逐步建立独立路由、强类型内容、可访问交互、自动质量检查与双目标发布，让每次更新都能成为下一次更新的地基。",
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
    copy: "关于、动画、学习、链接与日志各有独立职责，首页只负责介绍、兴趣互动和清晰引导。",
  },
  {
    code: "FEATURE / 02",
    title: "可检索的兴趣与学习",
    copy: "89 部动画可按名称、类型与年份筛选；计算机笔记也能按主题搜索并通过深链接展开。",
  },
  {
    code: "FEATURE / 03",
    title: "可参与的二次元主题",
    copy: "三角色频道会改变整站配色并连接真实内容，选择只保存在当前设备。",
  },
  {
    code: "FEATURE / 04",
    title: "适配不同设备",
    copy: "桌面与手机共享同一套内容结构，同时保留键盘操作、主题切换与静态访问。",
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
