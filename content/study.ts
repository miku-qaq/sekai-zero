export type StudyCategoryId = "fundamentals" | "programming" | "web" | "tools";

export type StudyNoteSection = {
  heading: string;
  paragraphs?: readonly string[];
  points?: readonly string[];
  code?: string;
  codeLabel?: string;
};

export type StudyNote = {
  id: string;
  category: StudyCategoryId;
  chapter: string;
  title: string;
  summary: string;
  level: string;
  readingTime: string;
  updatedAt: string;
  tags: readonly string[];
  sections: readonly StudyNoteSection[];
  recall: readonly string[];
  sources: readonly {
    label: string;
    publisher: string;
    href: string;
  }[];
};

export const studyCategories = [
  { id: "all", label: "全部笔记", shortLabel: "ALL" },
  { id: "fundamentals", label: "计算机基础", shortLabel: "CORE" },
  { id: "programming", label: "编程语言", shortLabel: "CODE" },
  { id: "web", label: "Web 开发", shortLabel: "WEB" },
  { id: "tools", label: "开发工具", shortLabel: "TOOL" },
] as const;

/**
 * The first notes explain concepts already exercised by this website. They are
 * educational content, not claims about courses completed by the site owner.
 */
export const studyNotes: readonly StudyNote[] = [
  {
    id: "request-lifecycle",
    category: "web",
    chapter: "NOTE / WEB-001",
    title: "输入网址后，页面是怎样出现的？",
    summary:
      "把 DNS、连接、HTTP、服务器响应和浏览器渲染串成一条完整主线，先建立全局地图，再逐个深入。",
    level: "基础",
    readingTime: "8 分钟",
    updatedAt: "2026.08.09",
    tags: ["DNS", "HTTP", "TLS", "浏览器"],
    sections: [
      {
        heading: "先记住这条主线",
        paragraphs: [
          "浏览器不会直接“打开网站”。它先把域名变成服务器地址，建立可靠且加密的连接，发送 HTTP 请求，收到资源后再解析、计算布局并绘制像素。",
        ],
        points: [
          "解析 URL：识别协议、域名、端口、路径和查询参数。",
          "查询 DNS：把容易记忆的域名解析为 IP 地址。",
          "建立连接：通常经过 TCP；HTTPS 还要完成 TLS 握手与证书校验。",
          "发送 HTTP 请求：说明方法、路径、主机和可接受的响应类型。",
          "服务器处理：路由找到页面，读取所需数据并生成响应。",
          "接收资源：HTML 还会继续引用 CSS、JavaScript、字体和图片。",
          "浏览器渲染：解析结构与样式，完成布局、绘制和合成。",
        ],
      },
      {
        heading: "一个最小请求长什么样",
        paragraphs: [
          "请求行说明“要什么”，请求头补充“从哪里来、能接收什么”。服务器会返回状态码、响应头和正文。",
        ],
        codeLabel: "HTTP REQUEST",
        code: "GET /study/ HTTP/1.1\nHost: example.com\nAccept: text/html",
      },
      {
        heading: "容易混淆的边界",
        points: [
          "DNS 只负责寻找地址，不负责下载网页。",
          "HTTPS 不代表网站内容一定可信，只说明传输经过加密且证书身份通过校验。",
          "收到 HTML 不等于页面已经完成；浏览器还要处理依赖资源与渲染流水线。",
        ],
      },
    ],
    recall: [
      "能否不用术语，按顺序复述七个阶段？",
      "DNS、TLS 和 HTTP 分别解决什么问题？",
      "为什么 HTML 到达后页面仍可能是空白的？",
    ],
    sources: [
      {
        label: "HTTP 概览",
        publisher: "MDN Web Docs",
        href: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Overview",
      },
    ],
  },
  {
    id: "git-mental-model",
    category: "tools",
    chapter: "NOTE / TOOL-001",
    title: "Git 提交不是“保存按钮”。",
    summary:
      "用工作区、暂存区和提交历史三个区域理解 Git，知道每条常用命令究竟移动了什么。",
    level: "基础",
    readingTime: "7 分钟",
    updatedAt: "2026.08.09",
    tags: ["Git", "暂存区", "Commit", "版本管理"],
    sections: [
      {
        heading: "三个区域，一条数据流",
        points: [
          "工作区：正在编辑、还可能继续变化的文件。",
          "暂存区：明确选择“下一次提交要包含什么”的清单。",
          "提交历史：带有作者、时间、说明和父提交的不可变快照。",
        ],
        paragraphs: [
          "`git add` 不是把文件上传到网络，而是把当前版本放入暂存区；`git commit` 只写入本地历史；`git push` 才把本地提交发送到远程仓库。",
        ],
      },
      {
        heading: "一次有意识的提交",
        codeLabel: "TERMINAL",
        code: 'git status\ngit diff\ngit add app/study content/study.ts\ngit diff --cached\ngit commit -m "feat: add computer study notebook"',
      },
      {
        heading: "为什么要先看 staged diff",
        paragraphs: [
          "提交说明只能概括你真正提交的内容。先检查暂存差异，可以避免把调试文件、密钥或无关改动混进同一次历史记录。",
        ],
      },
    ],
    recall: [
      "`git add` 与 `git commit` 分别改变哪个区域？",
      "为什么提交成功不等于 GitHub 已更新？",
      "一个提交为什么最好只表达一个完整意图？",
    ],
    sources: [
      {
        label: "What is Git?",
        publisher: "Pro Git / git-scm.com",
        href: "https://git-scm.com/book/en/v2/Getting-Started-What-is-Git%3F",
      },
    ],
  },
  {
    id: "typescript-as-contract",
    category: "programming",
    chapter: "NOTE / CODE-001",
    title: "把 TypeScript 类型当作设计说明。",
    summary:
      "类型不只是为了消灭红线；它描述数据允许出现的形状，也把长期维护需要遵守的边界写进代码。",
    level: "基础",
    readingTime: "9 分钟",
    updatedAt: "2026.08.09",
    tags: ["TypeScript", "Union", "数据建模", "静态检查"],
    sections: [
      {
        heading: "类型在运行前工作",
        paragraphs: [
          "TypeScript 会在构建阶段检查不一致，随后大部分类型信息被移除，浏览器执行的仍是 JavaScript。因此外部数据在运行时依然需要验证。",
        ],
      },
      {
        heading: "先限制状态，再编写界面",
        paragraphs: [
          "联合类型能把无限字符串收窄为有限状态。组件处理每一种状态时，编辑器可以帮助发现遗漏。",
        ],
        codeLabel: "TYPE MODEL",
        code: 'type NoteStatus = "draft" | "reviewed" | "published";\n\ntype Note = {\n  title: string;\n  status: NoteStatus;\n  tags: readonly string[];\n};',
      },
      {
        heading: "类型做不到什么",
        points: [
          "不能判断需求本身是否合理。",
          "不能替代单元测试、集成测试与真实浏览器验证。",
          "不能自动验证从网络、表单或本地存储读到的未知数据。",
        ],
      },
    ],
    recall: [
      "为什么类型安全不等于运行时数据安全？",
      "联合类型怎样减少不可能状态？",
      "什么时候应该使用 `unknown` 而不是直接断言？",
    ],
    sources: [
      {
        label: "Unions and Intersection Types",
        publisher: "TypeScript Handbook",
        href: "https://www.typescriptlang.org/docs/handbook/unions-and-intersections.html",
      },
    ],
  },
  {
    id: "bits-text-utf8",
    category: "fundamentals",
    chapter: "NOTE / CORE-001",
    title: "比特怎样变成屏幕上的文字？",
    summary: "从二进制、字节、字符集到 UTF-8，理解“乱码”其实是编码与解码规则不一致。",
    level: "基础",
    readingTime: "6 分钟",
    updatedAt: "2026.08.09",
    tags: ["二进制", "字节", "Unicode", "UTF-8"],
    sections: [
      {
        heading: "数据只有比特，含义来自约定",
        paragraphs: [
          "计算机存储的是 0 和 1。八个比特通常组成一个字节，但同一串字节究竟代表数字、文字、颜色还是指令，要由读取它的规则决定。",
        ],
      },
      {
        heading: "Unicode 与 UTF-8 不是同一件事",
        points: [
          "Unicode 为字符分配统一码点，回答“它是谁”。",
          "UTF-8 规定码点怎样编码成一到四个字节，回答“怎样存”。",
          "ASCII 的常用字符在 UTF-8 中保持相同的单字节表示。",
        ],
      },
      {
        heading: "乱码为什么发生",
        paragraphs: [
          "写入时使用一套编码，读取时错误地使用另一套编码，同样的字节就会被解释成不同字符。修复时应确认源文件的真实编码，而不是继续复制已经损坏的文字。",
        ],
        codeLabel: "UTF-8 BYTES",
        code: '"A"  -> 41\n"你" -> E4 BD A0',
      },
    ],
    recall: [
      "比特、字节、字符和码点有什么区别？",
      "Unicode 与 UTF-8 各自负责什么？",
      "为什么同一文件在不同程序里可能显示成乱码？",
    ],
    sources: [
      {
        label: "Unicode 技术导论",
        publisher: "The Unicode Consortium",
        href: "https://www.unicode.org/standard/principles.html",
      },
      {
        label: "UTF-8 / UTF-16 / UTF-32 FAQ",
        publisher: "The Unicode Consortium",
        href: "https://www.unicode.org/faq/utf_bom.html",
      },
    ],
  },
];

export const studyPrinciples = [
  {
    index: "01",
    title: "先画地图",
    copy: "先理解概念之间的关系，再深入单个术语，避免把知识记成孤岛。",
  },
  {
    index: "02",
    title: "最小实验",
    copy: "每篇笔记最终都应该落到一个可以运行、观察或验证的小实验。",
  },
  {
    index: "03",
    title: "主动回忆",
    copy: "读完先合上答案，用自己的话解释；能复述，才说明真正建立了模型。",
  },
] as const;

export const studyQueue = [
  {
    order: "NEXT / 01",
    title: "数据结构与复杂度",
    scope: "数组、链表、栈、队列，以及 Big O 想回答的实际问题。",
  },
  {
    order: "NEXT / 02",
    title: "操作系统的基本角色",
    scope: "进程、线程、内存与文件系统怎样共同抽象硬件。",
  },
  {
    order: "NEXT / 03",
    title: "网络分层与可靠传输",
    scope: "从数据链路到应用层，继续拆解 TCP、UDP 与拥塞控制。",
  },
] as const;
