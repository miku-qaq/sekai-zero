import { access, readFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import { platform } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(import.meta.dirname, "..");

async function exists(target) {
  try {
    await access(target);
    return true;
  } catch {
    return false;
  }
}

/** Parse the numeric part of a Node/npm-style semantic version. */
export function parseVersion(value) {
  const match = String(value)
    .trim()
    .match(/^v?(\d+)\.(\d+)\.(\d+)/);
  if (!match) return null;
  return match.slice(1).map(Number);
}

/** Compare semantic versions without depending on a package at bootstrap time. */
export function compareVersions(left, right) {
  const leftParts = parseVersion(left);
  const rightParts = parseVersion(right);
  if (!leftParts || !rightParts) return null;

  for (let index = 0; index < 3; index += 1) {
    if (leftParts[index] !== rightParts[index]) {
      return leftParts[index] > rightParts[index] ? 1 : -1;
    }
  }
  return 0;
}

export function extractMinimumVersion(engineRange) {
  return String(engineRange).match(/>=\s*(\d+\.\d+\.\d+)/)?.[1] ?? null;
}

export function extractPackageManagerVersion(declaration) {
  return String(declaration).match(/^npm@(\d+\.\d+\.\d+)$/)?.[1] ?? null;
}

/**
 * Keep compatibility failures separate from recommended-version drift. A newer
 * compatible runtime may be usable, while the pinned Node 22 line remains the
 * reproducible choice shared by Windows, macOS and CI.
 */
export function evaluateVersionPolicy({
  currentNode,
  minimumNode,
  pinnedNode,
  currentNpm,
  pinnedNpm,
}) {
  const checks = [];
  const nodeComparison = compareVersions(currentNode, minimumNode);
  const currentNodeParts = parseVersion(currentNode);
  const pinnedNodeParts = parseVersion(pinnedNode);

  if (nodeComparison === null || !minimumNode) {
    checks.push({
      level: "error",
      label: "Node.js",
      detail: "无法读取项目要求的 Node.js 版本。",
    });
  } else if (nodeComparison < 0) {
    checks.push({
      level: "error",
      label: "Node.js",
      detail: `当前 ${currentNode}，项目至少需要 ${minimumNode}。`,
    });
  } else {
    checks.push({
      level: "ok",
      label: "Node.js",
      detail: `${currentNode} 满足 >=${minimumNode}。`,
    });
  }

  if (!currentNodeParts || !pinnedNodeParts) {
    checks.push({
      level: "error",
      label: "Node.js 固定版本",
      detail: "无法解析 .node-version / .nvmrc。",
    });
  } else if (compareVersions(currentNode, pinnedNode) !== 0) {
    checks.push({
      level: "warn",
      label: "Node.js 固定版本",
      detail: `建议切回仓库固定的 ${pinnedNode}，避免本机与 CI 漂移。`,
    });
  } else {
    checks.push({
      level: "ok",
      label: "Node.js 固定版本",
      detail: `正在使用仓库固定的 ${pinnedNode}。`,
    });
  }

  const currentNpmParts = parseVersion(currentNpm);
  const pinnedNpmParts = parseVersion(pinnedNpm);
  if (!currentNpmParts || !pinnedNpmParts) {
    checks.push({
      level: "warn",
      label: "npm",
      detail: `未能核对 npm；仓库记录的版本是 ${pinnedNpm ?? "未知"}。`,
    });
  } else if (compareVersions(currentNpm, pinnedNpm) !== 0) {
    checks.push({
      level: "warn",
      label: "npm",
      detail: `当前 ${currentNpm}；建议使用 npm ${pinnedNpmParts[0]} 主版本。`,
    });
  } else {
    checks.push({
      level: "ok",
      label: "npm",
      detail: `${currentNpm} 与仓库工具链一致。`,
    });
  }

  return checks;
}

const ignoredGeneratedDirectories = new Set([
  "node_modules",
  ".next",
  ".vinext",
  "dist",
  "out",
  ".wrangler",
  "outputs",
  "work",
]);

/** Inspect names only; environment file contents must never enter diagnostics. */
export function findUnsafeTrackedFiles(files) {
  return files.filter((filename) => {
    const normalized = filename.replaceAll("\\", "/");
    const comparable = normalized.toLowerCase();
    const segments = comparable.split("/").filter(Boolean);
    const basename = segments.at(-1) ?? "";
    const isGenerated = segments
      .slice(0, -1)
      .some((segment) => ignoredGeneratedDirectories.has(segment));
    const isEnvironmentFile =
      (basename === ".env" || basename.startsWith(".env.")) &&
      basename !== ".env.example";
    const isDevVars =
      (basename === ".dev.vars" || basename.startsWith(".dev.vars.")) &&
      basename !== ".dev.vars.example";
    return isGenerated || isEnvironmentFile || isDevVars;
  });
}

function commandAvailable(command, args, cwd) {
  const result = spawnSync(command, args, {
    cwd,
    stdio: "ignore",
    windowsHide: true,
  });
  return !result.error && result.status === 0;
}

function readCommand(command, args, cwd = projectRoot) {
  const result = spawnSync(command, args, {
    cwd,
    encoding: "utf8",
    windowsHide: true,
  });
  return result.status === 0 ? result.stdout : null;
}

function detectNpmVersion() {
  const fromUserAgent =
    process.env.npm_config_user_agent?.match(/npm\/(\d+\.\d+\.\d+)/)?.[1];
  if (fromUserAgent) return fromUserAgent;

  const windows = platform() === "win32";
  const command = windows ? (process.env.ComSpec ?? "cmd.exe") : "npm";
  const args = windows ? ["/d", "/s", "/c", "npm.cmd --version"] : ["--version"];
  const result = spawnSync(command, args, {
    cwd: projectRoot,
    encoding: "utf8",
    windowsHide: true,
  });
  return result.status === 0 ? result.stdout.trim() : null;
}

export async function inspectEnvironment() {
  const [packageSource, nvmVersion, nodeVersion, attributes] = await Promise.all([
    readFile(path.join(projectRoot, "package.json"), "utf8"),
    readFile(path.join(projectRoot, ".nvmrc"), "utf8"),
    readFile(path.join(projectRoot, ".node-version"), "utf8"),
    readFile(path.join(projectRoot, ".gitattributes"), "utf8"),
  ]);
  const packageJson = JSON.parse(packageSource);
  const pinnedNode = nodeVersion.trim();
  const gitAvailable = commandAvailable("git", ["--version"]);
  const dependenciesInstalled = await exists(path.join(projectRoot, "node_modules"));
  const nativeDependenciesReady =
    dependenciesInstalled &&
    commandAvailable(process.execPath, ["-e", "import('sharp')"], projectRoot);
  const checks = evaluateVersionPolicy({
    currentNode: process.versions.node,
    minimumNode: extractMinimumVersion(packageJson.engines?.node),
    pinnedNode,
    currentNpm: detectNpmVersion(),
    pinnedNpm: extractPackageManagerVersion(packageJson.packageManager),
  });

  checks.push({
    level: nvmVersion.trim() === pinnedNode ? "ok" : "error",
    label: "版本文件",
    detail:
      nvmVersion.trim() === pinnedNode
        ? `.nvmrc 与 .node-version 均为 ${pinnedNode}。`
        : ".nvmrc 与 .node-version 不一致。",
  });
  checks.push({
    level: gitAvailable ? "ok" : "error",
    label: "Git",
    detail: gitAvailable
      ? "可以使用版本管理。"
      : "未找到 Git；macOS 可先安装 Command Line Tools。",
  });
  checks.push({
    level: attributes.includes("* text=auto eol=lf") ? "ok" : "error",
    label: "换行规则",
    detail: attributes.includes("* text=auto eol=lf")
      ? "仓库统一使用 LF，Windows 与 macOS 不会互相制造整文件改动。"
      : "缺少跨平台 LF 规则。",
  });
  checks.push({
    level: dependenciesInstalled && nativeDependenciesReady ? "ok" : "error",
    label: "依赖",
    detail: !dependenciesInstalled
      ? "尚未安装依赖；请运行 npm ci。"
      : nativeDependenciesReady
        ? "本机依赖已经安装，原生图像模块可在当前系统加载。"
        : "依赖不是当前系统的有效安装；请删除 node_modules 后重新运行 npm ci。",
  });
  checks.push({
    level: "info",
    label: "平台",
    detail: `${platform()} / ${process.arch}`,
  });

  if (gitAvailable) {
    const repositoryRoot = readCommand("git", ["rev-parse", "--show-toplevel"]);
    const repositoryReady =
      repositoryRoot !== null &&
      path.resolve(repositoryRoot.trim()) === path.resolve(projectRoot);
    checks.push({
      level: repositoryReady ? "ok" : "error",
      label: "Git 仓库",
      detail: repositoryReady
        ? "环境自检已定位到当前项目仓库。"
        : "无法从项目目录读取 Git 仓库；请重新通过 GitHub 克隆项目。",
    });

    const trackedOutput = repositoryReady
      ? readCommand("git", ["ls-files", "-z"])
      : null;
    const unsafeTrackedFiles =
      trackedOutput === null
        ? null
        : findUnsafeTrackedFiles(trackedOutput.split("\0").filter(Boolean));
    checks.push({
      level:
        unsafeTrackedFiles === null || unsafeTrackedFiles.length > 0 ? "error" : "ok",
      label: "版本库边界",
      detail:
        unsafeTrackedFiles === null
          ? "无法读取 Git 跟踪清单，未把未知状态误判为安全。"
          : unsafeTrackedFiles.length === 0
            ? "本地依赖、构建产物与真实环境文件均未被 Git 跟踪。"
            : `发现 ${unsafeTrackedFiles.length} 个不应进入 Git 的本地文件。`,
    });

    const status = repositoryReady
      ? readCommand("git", ["status", "--porcelain"])
      : null;
    checks.push({
      level: status === null ? "error" : status.trim() ? "warn" : "ok",
      label: "工作区",
      detail:
        status === null
          ? "无法读取 Git 工作区状态；换设备前不要继续推送。"
          : status.trim()
            ? "存在尚未提交的修改；换设备前请先核对、提交并推送。"
            : "工作区干净，可以安全切换设备。",
    });
  }

  if (platform() === "darwin") {
    const commandLineToolsAvailable = commandAvailable("xcode-select", ["-p"]);
    checks.push({
      level: commandLineToolsAvailable ? "ok" : "warn",
      label: "Command Line Tools",
      detail: commandLineToolsAvailable
        ? "macOS 编译与 Git 基础工具可用。"
        : "尚未检测到；可运行 xcode-select --install。",
    });
    checks.push({
      level: "info",
      label: "Steam（可选）",
      detail: "环境自检不会读取 Steam；只有主动更新游戏目录时才运行同步。",
    });
  }

  return checks;
}

async function main() {
  const checks = await inspectEnvironment();
  const tags = { ok: "OK", warn: "WARN", error: "ERROR", info: "INFO" };

  console.log("SEKAI / 00 · 开发环境自检\n");
  for (const check of checks) {
    console.log(`[${tags[check.level]}] ${check.label}：${check.detail}`);
  }

  if (checks.some((check) => check.level === "error")) {
    console.error("\n环境仍有阻断项，请修复 ERROR 后再启动开发。");
    process.exitCode = 1;
    return;
  }

  console.log("\n环境可以使用。下一步：npm run dev");
}

const directEntry = process.argv[1] ? path.resolve(process.argv[1]) : null;
if (directEntry === fileURLToPath(import.meta.url)) {
  await main();
}
