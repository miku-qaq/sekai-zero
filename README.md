# SEKAI / 00

Mikureina 长期维护、持续迭代的动漫主题个人网站。首页以明亮的「白昼动画杂志」作为世界入口，用个人简介、当前学习、世界地图、三位喜欢的角色频道与次元扭蛋帮助访客快速认识 Mikureina；详细内容沿「关于我、动画收藏、游戏收藏、学习笔记、链接、日志」六条清晰路线展开。动画收藏馆忠实整理 Mikureina 提供的已看片单，游戏收藏馆则从本地 Steam 记录生成可维护的公开目录，并为两类封面保留清楚的来源与版权边界。重点不是堆砌功能，而是建立稳定的工程地基、鲜明但克制的视觉系统，以及可以安全扩展的内容边界。

## 在线入口

- [访问 SEKAI / 00](https://miku-qaq.github.io/sekai-zero/)
- [查看公开源码](https://github.com/miku-qaq/sekai-zero)

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
npm run build:pages  # 生成 GitHub Pages 静态产物
npm run test:pages   # 验证全部静态页面、路由与资源路径
npm run sync:anime   # 按已核对的 Bangumi 条目同步并压缩动画封面
npm run sync:games   # 从本机 Steam 缓存生成游戏目录并压缩已有封面
npm run check        # 提交前完整质量门禁
```

Windows PowerShell 如果因本机执行策略拦截 `npm.ps1`，请使用 `npm.cmd run dev`；不要为了运行本项目降低系统安全策略。

新增已看动画时，在 `content/anime-source.json` 追加唯一 ID、本人提供的标题和核对后的 Bangumi 条目 ID，再运行 `npm run sync:anime`。受限 Windows 网络若无法让 Node 直接下载，可运行 `scripts/sync-anime-covers.ps1`；它与 macOS 使用的主脚本生成同一份内容和本地 WebP 资源。页面只展示一个资料条目正式名称，不显示别名。

游戏目录由 `scripts/sync-steam-library.mjs` 从本机 Steam 客户端缓存生成。脚本会自动探测 Windows 与 macOS 的常见安装位置；非默认安装可以运行 `npm run sync:games -- --steam-dir "<Steam 目录>"`，也可以设置 `STEAM_DIR`。当前目录包含 146 条有正向游玩记录的 Steam 游戏，其中 104 条拥有可用的本地 WebP 封面；Steamworks 测试应用不会进入收藏。生成结果只保留公开作品名、Steam App ID、平台、封面路径与商店入口，不写入账号标识、游玩时长、最近上线或授权信息。

## 每周更新方式

1. 从 `main` 创建 `codex/feat-主题` 或 `feat/主题` 短分支。
2. 身份、文案、动画与游戏清单、学习内容和链接收藏优先修改 `content/`；每一话统一登记在 `content/releases.ts`，当前学习与兴趣信号维护在 `content/now.ts`，页面组合放在 `app/`。
3. 完成一个可验证的小目标，在世界线日志中记录对访客有意义的变化，并按需更新路线图或架构决定。
4. 运行 `npm run check`，通过后再提交 Pull Request。
5. 使用 Conventional Commits，例如 `feat: expand study notes`。

## 公开部署

项目保留两条相互隔离的发布路径：

- **Sites / Cloudflare Worker**：保留未来登录、数据库和服务端能力。
- **GitHub Pages**：当前公开首页的静态备用入口，避免服务端安全层阻断访问。

公开仓库已经使用 **GitHub Actions** 作为 Pages 发布源。`main` 更新会由 `.github/workflows/pages.yml` 自动读取仓库子路径、构建并整理 `dist/pages`、验证资源地址后发布；不要手工维护 `gh-pages` 分支。

目录边界、部署约束与未来扩展方式见 [架构说明](docs/ARCHITECTURE.md)，计划见 [项目路线图](docs/ROADMAP.md)。

## 素材与隐私

动漫角色相关内容只使用自制、生成、获得授权或有明确资料来源的素材，并记录来源。当前主视觉采用原创角色群像，以色彩和人物原型回应站点兴趣，不复制官方立绘、官方服装或 Logo；动画收藏封面来自已核对的公开作品条目，游戏封面来自站点所有者本机的 Steam 客户端缓存，版权均归各作品权利方。Steam 同步遵循最小披露，不公开账号、时长、最近上线或授权信息。完整登记见 `docs/ASSETS.md`。公开个人资料、联系方式和统计能力必须经过站点所有者确认。

本仓库当前不声明开源许可证；除非后续明确授权，否则保留全部权利。
