export type StudyCategoryId = "fundamentals" | "programming" | "web" | "tools" | "ai";

export type StudyNoteSection = {
  heading: string;
  paragraphs?: readonly string[];
  points?: readonly string[];
  code?: string;
  codeLabel?: string;
};

export type StudyNote = {
  id: string;
  current?: boolean;
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
  { id: "ai", label: "AI · 视觉与语言", shortLabel: "AI" },
] as const;

/**
 * Notes combine concepts exercised by this website with owner-confirmed study
 * topics. They document learning in progress, not course completion or formal
 * enrollment unless the owner explicitly confirms those facts.
 */
export const studyNotes: readonly StudyNote[] = [
  {
    id: "cs224n-nlp-word-vectors",
    current: true,
    category: "ai",
    chapter: "NOTE / NLP-001",
    title: "CS224N 学习笔记 01：词语如何进入向量空间？",
    summary:
      "从 Stanford CS224N 的课程主线出发，先建立 NLP、词表示与分布式语义的地图，再理解模型究竟在学习什么。",
    level: "学习中 · 基础",
    readingTime: "10 分钟",
    updatedAt: "2026.08.25",
    tags: ["CS224N", "NLP", "Word Vectors", "分布式语义", "Stanford"],
    sections: [
      {
        heading: "先说明这条学习记录的边界",
        paragraphs: [
          "我最近在自学 Stanford CS224N 的公开课程资料：Natural Language Processing with Deep Learning。这篇先整理第一张知识地图，不代表已经完成课程，也不代表 Stanford 的正式选课、学籍或结课证明。",
          "课程从 NLP 与深度学习基础出发，并延伸到现代语言模型研究；本站会按实际学习进度逐篇整理，而不是提前把整份 syllabus 写成“已掌握”。",
        ],
      },
      {
        heading: "NLP 不只是让模型生成句子",
        paragraphs: [
          "自然语言处理研究怎样让计算机处理人类语言信息。一个任务通常可以拆成四个问题：输入怎样表示、模型要预测什么、误差怎样定义，以及结果怎样评估。",
        ],
        points: [
          "表示：把词、子词、句子或文档变成模型能够计算的数值结构。",
          "目标：根据任务预测上下文词、类别、序列、答案或下一段文本。",
          "学习：用损失函数衡量预测误差，再通过梯度更新模型参数。",
          "评估：指标只能描述某个切面，还要检查数据偏差、失败案例与真实使用风险。",
        ],
      },
      {
        heading: "从 one-hot 到分布式语义",
        paragraphs: [
          "one-hot 向量能给每个词一个唯一编号，却不能直接表达“猫”和“小猫”比“猫”和“飞机”更相近。分布式语义则利用词出现的上下文来学习稠密向量：上下文相似的词，表示往往也更接近。",
          "这不是把一个词的全部含义封存在固定坐标里。语料、训练目标、窗口大小和模型结构都会影响向量；多义词与语境变化也提示我们继续走向上下文化表示。",
        ],
      },
      {
        heading: "Skip-gram 究竟在预测什么",
        paragraphs: [
          "Skip-gram 给定中心词 c，预测固定窗口里的上下文词 o。模型为中心词和上下文词分别维护向量，用点积形成匹配分数，再通过训练让真实词对的分数高于不合适的词对。",
          "完整 softmax 要对整个词表归一化，词表很大时计算昂贵。负采样改为区分真实中心词—上下文词对与随机噪声词对；它是另一个更高效的训练目标，不应简单说成“精确 softmax 的答案”。",
        ],
        codeLabel: "SKIP-GRAM / CONDITIONAL PROBABILITY",
        code: "P(o | c) = exp(u_o · v_c)\n           / sum(exp(u_w · v_c) for w in vocabulary)",
      },
      {
        heading: "一个只说明几何直觉的最小实验",
        paragraphs: [
          "下面的数字是手写玩具向量，不是训练结果。它只演示余弦相似度比较方向，而不证明真实语义关系。",
        ],
        codeLabel: "PYTHON / TOY EMBEDDINGS",
        code: "import numpy as np\n\ndef cosine(a, b):\n    return float(a @ b / (np.linalg.norm(a) * np.linalg.norm(b)))\n\ncat = np.array([0.9, 0.8, 0.1])\nkitten = np.array([0.8, 0.9, 0.1])\nairplane = np.array([0.1, 0.0, 1.0])\n\nprint(cosine(cat, kitten))\nprint(cosine(cat, airplane))",
      },
      {
        heading: "接下来沿着哪条线继续",
        points: [
          "弄清词汇表、上下文窗口与共现信号分别是什么。",
          "理解 Word2Vec 的 Skip-gram / CBOW 目标，以及为什么需要负采样。",
          "复习梯度、反向传播和矩阵运算，再把目标函数落到可运行实现。",
          "随后再连接语言模型、注意力、Transformer、预训练与后训练，而不是跳过地基只记模型名称。",
        ],
      },
    ],
    recall: [
      "one-hot 表示为什么无法直接表达词之间的相似性？",
      "“一个词的含义由它的上下文体现”怎样转化成可学习的信号？",
      "余弦相似度衡量什么，又不能证明什么？",
      "一项 NLP 任务可以拆成哪四个基本问题？",
    ],
    sources: [
      {
        label: "CS224N: Natural Language Processing with Deep Learning",
        publisher: "Stanford University",
        href: "https://web.stanford.edu/class/cs224n/",
      },
      {
        label: "Lecture 2: Word Vectors",
        publisher: "Stanford CS224N · Winter 2026",
        href: "https://web.stanford.edu/class/cs224n/slides_w26/cs224n-2026-lecture02-wordvecs.pdf",
      },
    ],
  },
  {
    id: "cs231n-image-classification-data-driven",
    category: "ai",
    chapter: "NOTE / CV-001",
    title: "CS231n 学习回顾 01：图像分类为什么要从数据出发？",
    summary:
      "从像素与语义之间的距离出发，重新串起数据驱动方法、分类基线与卷积网络这条计算机视觉主线。",
    level: "曾学习 · 回顾",
    readingTime: "9 分钟",
    updatedAt: "2026.08.28",
    tags: ["CS231n", "Computer Vision", "图像分类", "Data-Driven", "CNN", "Stanford"],
    sections: [
      {
        heading: "先说明这篇回顾的边界",
        paragraphs: [
          "我之前学习过 Stanford CS231n 的公开课程资料。这篇不是结课证明或进度汇报，而是把仍值得保留的计算机视觉主线重新整理。具体学习年度、完成比例、作业和成绩没有公开确认，因此本站不作推断。",
          "文中的课程范围使用 Stanford 当前公开课程页面与讲义校对；这些链接说明参考资料来自哪里，不表示我修读了页面所对应学期的正式课程。",
        ],
      },
      {
        heading: "像素看得见，语义并不在数组里",
        paragraphs: [
          "对计算机而言，一张 RGB 图片首先是由数值构成的三维张量；“猫”“汽车”或“飞机”却是人赋予画面的语义。视角、光照、遮挡、形变、背景和同类差异都会让像素发生巨大变化，这正是图像分类的困难所在。",
        ],
        points: [
          "相同物体在不同环境中，可以产生差异很大的像素。",
          "不同物体的局部像素也可能非常相似。",
          "分类器需要学习能跨越这些变化的表示，而不是记住单张图片。",
        ],
      },
      {
        heading: "把识别问题改写成可学习流程",
        paragraphs: [
          "数据驱动方法没有手写出“猫的全部规则”，而是规定模型怎样从样本、目标函数和误差反馈中获得决策边界。",
        ],
        points: [
          "收集带标签的图像数据，再划分训练集、验证集与测试集。",
          "用训练集拟合参数，用验证集选择超参数，测试集只负责最终评估。",
          "在未参与训练的新图像上检查泛化，而不是只看训练记忆。",
        ],
      },
      {
        heading: "两条最小分类基线",
        paragraphs: [
          "kNN 几乎不需要显式训练，却要在预测时查找训练样本；线性分类器则把训练数据压缩进参数矩阵，为每个类别产生分数。它们不是视觉识别的终点，却能帮助区分距离度量、超参数、损失函数与参数化模型。",
        ],
        codeLabel: "CLASSIFICATION / BASELINES",
        code: "kNN:    prediction(x) ← vote(nearest training examples)\nLinear: scores(x)     = W · x + b",
      },
      {
        heading: "为什么课程还要走向卷积网络",
        paragraphs: [
          "普通全连接模型通常先把图片展平成向量，既会迅速增加参数，也没有充分利用图像的空间结构。卷积网络明确假设输入是图像：神经元连接局部区域，并在不同位置共享滤波器参数，从而逐层把原始像素变成可用于分类的特征。",
        ],
        points: [
          "基础：分类、损失函数、优化与反向传播。",
          "视觉理解：CNN、检测、分割、视频与 Transformer。",
          "生成与交互：自监督、生成模型、3D 与视觉语言。",
          "真实使用：还要检查数据、计算、失败模式与社会影响。",
        ],
      },
      {
        heading: "这是一张地图，不是完成清单",
        paragraphs: [
          "后续只有在重新推导、实现或验证某个主题后，才会增加对应笔记。课程目录说明可以去哪里，不等于每一个方向都已经掌握。",
        ],
      },
    ],
    recall: [
      "图像的像素表示与人理解的语义之间，为什么存在差距？",
      "训练集、验证集和测试集分别承担什么职责？",
      "kNN 与线性分类器分别把学习结果保存在哪里？",
      "卷积网络利用了图像输入的哪些结构特点？",
    ],
    sources: [
      {
        label: "CS231n: Deep Learning for Computer Vision",
        publisher: "Stanford University",
        href: "https://cs231n.stanford.edu/",
      },
      {
        label: "Image Classification with Linear Classifiers",
        publisher: "Stanford CS231n · Official Lecture Slides",
        href: "https://cs231n.stanford.edu/slides/2026/lecture_2.pdf",
      },
      {
        label: "Convolutional Networks",
        publisher: "Stanford CS231n · Course Notes",
        href: "https://cs231n.github.io/convolutional-networks/",
      },
    ],
  },
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
    copy: "适合实验的主题补一个可以运行、观察或验证的小例子；纯概念主题也留下可检查的推理或练习。",
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
    title: "CS224N · Word2Vec 目标与梯度",
    scope:
      "把当前笔记中的概念推进到损失函数、负采样目标、梯度更新与一次可运行训练实验；真正完成推导后再发布。",
  },
] as const;
