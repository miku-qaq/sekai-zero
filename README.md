# SEKAI / 00

一个长期维护、每周迭代的动漫主题个人网站。首版重点不是堆砌功能，而是建立稳定的工程地基、鲜明但克制的视觉系统，以及可以安全扩展的内容边界。

## 技术路线

- **TypeScript**：公开接口和内容模型都有静态类型，降低长期修改时的回归风险。
- **React 19 + Vinext**：使用组件化 UI 与 App Router 结构，并输出 Cloudflare Worker 兼容产物。
- **Tailwind CSS 4 + CSS design tokens**：Tailwind 负责构建管线，站点自己的颜色、间距与主题通过可维护的 CSS 变量表达。
- **Node.js 22 + npm**：Windows 与 macOS 使用同一套锁文件和脚本。
- **GitHub Actions**：每个提交自动执行格式、Lint、类型、构建与服务端渲染检查。

> Vinext 仍处于 beta 阶段。本项目固定依赖版本、隔离平台代码，并避免实验性 Next.js API；迁移出口记录在架构决策文档中。

## 本地开发

要求 Node.js `>=22.14.0`，推荐使用仓库内 `.nvmrc` / `.node-version` 指定的版本。

```bash
npm install
npm run dev
```

访问终端中显示的本地地址。常用命令：

```bash
npm run format       # 自动格式化
npm run lint         # 代码规范与可访问性检查
npm run typecheck    # TypeScript 静态检查
npm test             # 构建并验证服务端输出
npm run check        # 提交前完整质量门禁
```

Windows PowerShell 如果因本机执行策略拦截 `npm.ps1`，请使用 `npm.cmd run dev`；不要为了运行本项目降低系统安全策略。

## 每周更新方式

1. 从 `main` 创建 `codex/feat-主题` 或 `feat/主题` 短分支。
2. 身份、文案、作品和收藏优先修改 `content/`；页面组合放在 `app/`。
3. 完成一个可验证的小目标，更新路线图或架构决定。
4. 运行 `npm run check`，通过后再提交 Pull Request。
5. 使用 Conventional Commits，例如 `feat: add project archive`。

目录边界、部署约束与未来扩展方式见 [架构说明](docs/ARCHITECTURE.md)，计划见 [项目路线图](docs/ROADMAP.md)。

## 素材与隐私

动漫角色相关内容只使用自制、获得授权或符合法律要求的素材，并记录来源。首版用色彩、文字与抽象图形向喜欢的角色致意，不复制官方立绘。公开个人资料、联系方式和统计能力必须经过站点所有者确认。

本仓库当前不声明开源许可证；除非后续明确授权，否则保留全部权利。
