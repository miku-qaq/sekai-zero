# 架构说明

## 目标

SEKAI / 00 是长期个人站，不以首版功能数量衡量质量。架构优先保证：内容易改、页面可拆、平台可换、质量可验证，以及 Windows/macOS 行为一致。

## 当前结构

```text
app/                 路由、全局布局、页面与浏览器交互
content/             公开文案和结构化内容（Git 即 CMS）
tests/               Worker SSR 与 Pages 静态产物契约测试
worker/              Cloudflare Worker 适配层
docs/                架构、路线图与重要决策
.github/             自动检查和协作模板
```

页面默认使用 Server Component。只有移动导航、主题切换、角色频道与原生分享需要 `"use client"`，以控制浏览器 JavaScript 体积。

当前页面职责如下：

- `/`：世界入口、精选频道与各区域预告，不承载所有详细内容。
- `/about`：只使用已确认信息的个人角色设定档。
- `/links`：站内频道与建造工具航线；真实友链和社交坐标未确认前保持诚实空态。
- `/study`：可搜索、可展开的计算机学习笔记；正文静态可索引，只有筛选与搜索进入客户端。
- `/logs`：可展开的版本日志与工程决定档案。

共享页头、内页首屏、页脚和首页路线卡位于 `app/components/`。内页视觉单独放在 `app/subpages.css`，避免继续无边界扩张原首页样式。`lib/site-path.ts` 是唯一的公开路径入口，负责兼容根域与 GitHub Pages 仓库子路径。

## 内容演进

站点级内容放在 `content/site.ts`，个人档案、航线、学习笔记和日志分别放在 `content/about.ts`、`content/links.ts`、`content/study.ts` 与 `content/logs.ts`，让每周文案更新不触碰布局。学习笔记目前使用强类型数据，每篇统一保留知识主线、最小示例、易错边界、主动回忆与一手资料；超过约 8–10 篇后迁移到构建期 MDX 和 `/study/[slug]/`，而不在 Worker 运行时读取文件。出现更多长文章后，通过 `getPosts()` 一类稳定查询接口提供给页面。需要在线编辑、留言或用户数据时，再在查询接口下接 Cloudflare D1；媒体上传出现后再启用 R2。

运行时不得从 Worker 文件系统读取 MDX。数据库和存储绑定保持在平台适配层，客户端组件不直接导入它们。

## 视觉系统

站点使用语义化 CSS token，而不是把颜色散落在组件中。`data-theme` 控制明暗模式，`data-channel` 控制初音未来、伊蕾娜与波奇主题频道。视觉语言由原创群像、漫画网点、对白框和分镜构成；兴趣频道可以使用角色姓名和主题文案，但不复制官方图像资产。所有生成或授权素材统一登记在 `docs/ASSETS.md`。

## 双目标发布

默认 `npm run build` 继续产出 Sites/Cloudflare Worker，以保留未来的服务端扩展能力。`DEPLOY_TARGET=github-pages` 时，Vite 只加载 Vinext，Next 配置改为静态导出并使用 Pages 提供的仓库资源前缀。Vinext beta 的 `basePath` 预渲染缺陷和临时规避记录在 ADR 0002。

静态目标不得导入 `headers()`、Server Actions、D1、R2 或 Worker 绑定。需要这些能力的页面必须留在动态目标，并在内容边界上提供静态降级。两种构建均由自动化测试验证；整理脚本把 Vinext 的带前缀资源归一到 `dist/pages`，并为多页 HTML 生成目录式 `index.html` 副本，Pages 只上传该目录。

## 迁移策略

Vinext 仍是 beta，因此：

1. 锁定精确版本并提交 lockfile。
2. 避免实验性 Next.js API 与平台专属页面逻辑。
3. Cloudflare 代码限制在 `worker/` 和未来的 repository adapter 中。
4. 每月人工审阅上游变化，不自动合并大版本或 beta 更新。
5. 如需迁移到稳定 Next.js、Astro 或其他平台，`content/` 和绝大多数 React 组件可以保留。
