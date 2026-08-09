# ADR 0001：TypeScript、React、Vinext 与 Sites

- 状态：已接受
- 日期：2026-08-09

## 决定

首版采用 TypeScript、React 19、Vinext 与 Sites/Cloudflare Worker 构建和发布。

## 原因

TypeScript 提供长期重构所需的类型安全；React 组件生态适合未来的博客、作品筛选和互动实验；当前 Sites 工具链使用 Vinext，可以快速得到跨平台开发与 Worker 兼容发布路径。

## 后果

Vinext 为 beta，兼容面和升级稳定性弱于成熟框架。项目必须精确锁版本、隔离 Worker 代码、避免实验性 API，并在每个里程碑验证迁移成本。GitHub 负责源码和项目治理，不等同于 GitHub Pages；具有服务端能力时继续使用 Worker 托管。
