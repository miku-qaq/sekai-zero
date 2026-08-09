# 架构说明

## 目标

SEKAI / 00 是长期个人站，不以首版功能数量衡量质量。架构优先保证：内容易改、页面可拆、平台可换、质量可验证，以及 Windows/macOS 行为一致。

## 当前结构

```text
app/                 路由、全局布局、页面与浏览器交互
content/             公开文案和结构化内容（Git 即 CMS）
tests/               构建产物的服务端渲染契约测试
worker/              Cloudflare Worker 适配层
docs/                架构、路线图与重要决策
.github/             自动检查和协作模板
```

页面默认使用 Server Component。只有移动导航、主题切换、角色频道与原生分享需要 `"use client"`，以控制浏览器 JavaScript 体积。

## 内容演进

首版内容放在 `content/site.ts`，让每周文案更新不触碰布局。出现长文章后引入构建期 MDX 管线，并通过 `getPosts()` 一类稳定查询接口提供给页面。需要在线编辑、留言或用户数据时，再在查询接口下接 Cloudflare D1；媒体上传出现后再启用 R2。

运行时不得从 Worker 文件系统读取 MDX。数据库和存储绑定保持在平台适配层，客户端组件不直接导入它们。

## 视觉系统

站点使用语义化 CSS token，而不是把颜色散落在组件中。`data-theme` 控制明暗模式，`data-channel` 控制初音未来、伊蕾娜与波奇主题频道。角色致意通过配色、节奏、音符和星轨表达，避免复制官方图像资产。

## 迁移策略

Vinext 仍是 beta，因此：

1. 锁定精确版本并提交 lockfile。
2. 避免实验性 Next.js API 与平台专属页面逻辑。
3. Cloudflare 代码限制在 `worker/` 和未来的 repository adapter 中。
4. 每月人工审阅上游变化，不自动合并大版本或 beta 更新。
5. 如需迁移到稳定 Next.js、Astro 或其他平台，`content/` 和绝大多数 React 组件可以保留。
