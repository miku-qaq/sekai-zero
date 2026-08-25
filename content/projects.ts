export type ProjectTone = "mint" | "violet" | "blue" | "pink" | "amber";

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

export const projectShifts = [
  {
    index: "01",
    label: "INFORMATION ARCHITECTURE",
    before: "所有内容都挤在一张长首页里。",
    now: "每个页面只完成一个主要任务，首页负责把访客送往正确入口。",
    tone: "mint",
  },
  {
    index: "02",
    label: "CONTENT BOUNDARY",
    before: "文案与布局容易绑在组件中。",
    now: "公开内容进入强类型模块，大多数更新不需要触碰页面结构。",
    tone: "violet",
  },
  {
    index: "03",
    label: "RELEASE CONFIDENCE",
    before: "页面能打开，不代表下一次改动仍然安全。",
    now: "格式、Lint、类型、Worker 渲染和 Pages 子路径都进入发布门禁。",
    tone: "blue",
  },
] as const;

export const projectSystemFlow = [
  {
    index: "01",
    label: "CONTENT",
    title: "内容层",
    copy: "个人档案、航线、学习笔记、制作档案与版本日志各自拥有数据边界。",
  },
  {
    index: "02",
    label: "SERVER UI",
    title: "静态页面",
    copy: "详细正文默认在服务端生成，让首屏内容可读、可索引，也减少浏览器负担。",
  },
  {
    index: "03",
    label: "CLIENT ISLANDS",
    title: "交互小岛",
    copy: "主题、菜单、搜索和扭蛋等确实需要状态的部分，才进入客户端组件。",
  },
  {
    index: "04",
    label: "QUALITY GATES",
    title: "自动检查",
    copy: "同一份源码必须通过代码规范、类型、构建与页面契约，才允许成为新一话。",
  },
  {
    index: "05",
    label: "DELIVERY",
    title: "双目标发布",
    copy: "动态 Worker 保留未来扩展能力，静态 Pages 构建保留平台迁移与公开备用出口。",
  },
] as const;

export const productionChapters = [
  {
    episode: "EP.001",
    title: "建立稳定地基",
    copy: "确定 TypeScript、React、自动检查、响应式布局与可替换内容层。",
    evidence: "ENGINEERING FOUNDATION",
  },
  {
    episode: "EP.002",
    title: "让二次元成为叙事语言",
    copy: "用原创主视觉、漫画分镜、频道色与互动反馈建立自己的表达，而不是复制角色素材。",
    evidence: "VISUAL IDENTITY",
  },
  {
    episode: "EP.003",
    title: "从单页展开个人宇宙",
    copy: "角色档案、航线终端与版本日志成为各自可以分享的真实页面。",
    evidence: "MULTI-PAGE SYSTEM",
  },
  {
    episode: "EP.004",
    title: "点亮计算机学习舱",
    copy: "把知识整理成带搜索、分类、回忆问题和一手来源的长期学习地图。",
    evidence: "LEARNING ARCHIVE",
  },
  {
    episode: "EP.005",
    title: "把制作过程变成第一份案例",
    copy: "不等待虚构作品填满页面，先把这个真实项目的问题、选择和演进说清楚。",
    evidence: "CASE STUDY",
  },
  {
    episode: "EP.006",
    title: "让真实档案进入内容系统",
    copy: "只录入主人确认的称呼、学习状态、兴趣、游戏平台与联系入口，并为未知资料保留边界。",
    evidence: "PUBLIC PROFILE",
  },
  {
    episode: "EP.007",
    title: "让真实学习主线进入知识地图",
    copy: "新增 CS224N / NLP 频道、完整笔记、官方来源与自学边界，让学习状态成为可持续更新的内容。",
    evidence: "LEARNING SIGNAL",
  },
] as const;

export const qualityGates = [
  {
    code: "GATE / 01",
    title: "格式与规范",
    copy: "统一格式、Lint 与可访问性规则，减少协作和长期修改中的隐性分歧。",
  },
  {
    code: "GATE / 02",
    title: "类型边界",
    copy: "TypeScript 在构建前检查内容模型、组件契约与平台适配是否保持一致。",
  },
  {
    code: "GATE / 03",
    title: "Worker 渲染",
    copy: "验证所有路由都能生成真实 HTML，而不是只测试一个客户端壳。",
  },
  {
    code: "GATE / 04",
    title: "Pages 导出",
    copy: "模拟仓库子路径，检查目录式页面、站内链接、图片和分享资源没有断点。",
  },
] as const;

export const projectDecisions = [
  {
    question: "为什么先用 Git 管内容，而不是立即接 CMS？",
    decision:
      "当前内容规模仍适合强类型文件。它没有额外账号、数据库和编辑器维护成本，也能让每次内容变化跟随代码一起审查。学习笔记超过约 8–10 篇后，再把长内容迁移到构建期 MDX。",
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

export const nextCheckpoints = [
  "收录主人确认的真实作品、游戏收藏与社交坐标",
  "把长文章迁移到独立路由与构建期 MDX",
  "为 main 配置与每周协作方式匹配的分支保护",
] as const;

export const futureCase = {
  code: "CASE / 002",
  status: "WAITING FOR VERIFIED WORK",
  copy: "下一份档案会在主人提供项目名称、目标、本人职责、过程证据与真实结果后点亮；没有证据的数字不会进入这里。",
} as const;
