# 参与项目

## 工作流

- `main` 始终保持可发布；使用短生命周期分支开发。
- Codex 分支使用 `codex/` 前缀，人工分支可使用 `feat/`、`fix/`、`docs/`、`refactor/` 或 `chore/`。
- 一次 Pull Request 只解决一个清晰目标；涉及视觉变化时附上桌面与移动端说明。
- 提交信息采用 Conventional Commits，例如 `fix: preserve theme preference`。

## 质量门禁

提交前运行 `npm run check`。新增行为需要测试；修改公开内容时检查隐私、版权与链接有效性。注释解释设计原因、边界与不直观的限制，不逐行复述代码。

新电脑首次克隆后先执行 `npm ci --ignore-scripts --no-audit --no-fund` 与 `npm run doctor`。修改路由、静态资源路径或 Pages 发布逻辑时，再执行 `npm run check:pages`。Windows 与 macOS 使用同一份锁文件，不复制另一台电脑的 `node_modules` 或构建产物；详细步骤见 [macOS 开发接管指南](docs/MACOS_SETUP.md)。

## 架构边界

- `content/`：可公开的数据和文案。
- `app/`：路由、页面组合及少量交互组件。
- `worker/`：Cloudflare 平台适配，不能向页面泄漏平台类型。
- `db/`：只有出现真实持久化需求时才启用。

新增依赖必须说明价值和维护成本。预发布依赖不得自动升级或自动合并。
