# macOS 开发接管

这份指南用于把 SEKAI / 00 从 Windows 平稳接到 Mac。源码始终以 GitHub 的 `main` 为准；新电脑只克隆仓库，不搬运旧电脑生成的依赖、缓存或构建产物。

## Windows 收尾

在切换设备前，先在原电脑完成一次收尾：

```powershell
npm.cmd run check
git status
git push origin main
```

确认重要修改已经提交并推送。`git stash` 只存在本机，不会跟随 GitHub 到 Mac。

## Mac 首次准备

1. 打开“终端”，安装并确认 Apple Command Line Tools：

   ```bash
   xcode-select --install
   git --version
   ```

2. 安装能够读取 `.nvmrc` 的 Node 版本管理器。项目推荐使用 [nvm 官方安装说明](https://github.com/nvm-sh/nvm#installing-and-updating)，不要从不明脚本或镜像安装 Node。

3. 从 GitHub 全新克隆仓库：

   ```bash
   mkdir -p ~/Developer
   cd ~/Developer
   git clone https://github.com/miku-qaq/sekai-zero.git
   cd sekai-zero
   ```

   也可以使用 GitHub Desktop 克隆同一个公开仓库；不要选择“Download ZIP”，因为 ZIP 没有提交历史、分支和远程同步配置。

4. 进入仓库后，让 nvm 读取项目固定版本，再按锁文件安装当前 Mac 架构所需的依赖：

   ```bash
   nvm install
   nvm use
   npm ci --ignore-scripts --no-audit --no-fund
   npm run doctor
   npm run check
   npm run dev
   ```

   终端会显示本地访问地址。Apple Silicon 可以直接使用项目固定的 Node 22，不需要为本站安装 Rosetta。

## GitHub 登录与提交身份

公开仓库无需登录即可克隆；第一次推送前，可以使用 GitHub Desktop，或按 [GitHub 官方 Git 设置](https://docs.github.com/en/get-started/git-basics/set-up-git)配置凭据。提交邮箱继续使用 GitHub 提供的 noreply 地址，避免在公开历史中写入私人邮箱。

只为本仓库配置身份时，在仓库目录运行：

```bash
git config user.name "miku-qaq"
git config user.email "你的 GitHub noreply 邮箱"
```

## 每日开发

```bash
git switch main
git pull --ff-only
git switch -c codex/feat-topic
npm run dev
```

完成一个独立目标后：

```bash
npm run check
git status
git add -A
git commit -m "feat: describe the change"
git push -u origin HEAD
```

修改路由、静态资源路径或 GitHub Pages 发布逻辑时，再运行：

```bash
npm run check:pages
```

同一时刻只在一台电脑上修改一个分支。一台设备完成提交并推送后，另一台设备再拉取，避免制造不必要的冲突。

## 只迁移源码

不要从 Windows 复制以下内容到 Mac：

- `node_modules`；其中包含当前系统和 CPU 架构对应的原生包。
- `.next`、`.vinext`、`dist`、`out`、`.wrangler`、`outputs`、`work` 等生成目录。
- 旧仓库的 `.git` 目录；`git clone` 会创建完整且正确的新副本。
- `.env*`、`.dev.vars*` 或任何令牌。当前项目运行不依赖私人环境变量；未来如有密钥，应从密码管理器在 Mac 上重新创建。
- Steam 的 `userdata`、授权文件或 Windows 客户端缓存。

如果误复制过 `node_modules`，应只删除这个本地依赖目录，再重新运行 `npm ci --ignore-scripts --no-audit --no-fund`；不要修改锁文件来解决架构差异。

## Steam 游戏目录是可选维护任务

首次启动网站不需要 Steam。只有主动更新游戏收藏时，才在 Mac 安装并至少启动一次 Steam，然后运行：

```bash
npm run sync:games
```

脚本会识别 macOS 默认目录。存在多个本地 Steam 用户时，使用脚本提示的 `--steam-user` 明确选择，不删除其他账号的客户端缓存。新 Mac 的本地缓存可能尚未完整下载，因此脚本默认拒绝删除既有游戏，并会复用仓库中已有的封面；只有核对清单后确实要删除作品，才显式追加 `--allow-removals`。生成、校验和可恢复提交全部成功后公开快照才会变化，中断留下的未提交事务会在下次运行前恢复。不要并行启动两次同步；进程锁会让第二次调用安全停止。若异常终止留下了无法识别的锁，请先确认没有同步仍在运行，再按报错提示使用 `--recover-interrupted-sync`。同步完成后先检查游戏目录与封面变化，再运行 `npm run check`。

## 常见问题

- `nvm: command not found`：按照 nvm 官方说明配置 zsh，关闭终端窗口后重新打开，再运行 `command -v nvm`。
- Node 版本不一致：回到仓库目录执行 `nvm install && nvm use`，再运行 `npm run doctor`。
- 原生依赖报架构错误：确认没有复制 Windows 的 `node_modules`，删除该目录后重新执行 `npm ci --ignore-scripts --no-audit --no-fund`。
- Git 提示身份缺失：按上面的仓库级 `git config` 设置公开名称与 GitHub noreply 邮箱。
- 网站可以开发但游戏同步不可用：这是允许的；Steam 只是可选内容来源，不影响页面构建与发布。

`main` 推送后会自动运行 CI 并部署 GitHub Pages；Sites 入口仍按项目现有流程单独发布，不会因为一次普通 Git push 自动更新。两种发布方式在 Mac 与 Windows 上使用同一份源码，不需要维护另一套工程。
