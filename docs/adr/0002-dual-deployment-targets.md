# ADR 0002：Sites 与 GitHub Pages 双目标发布

- 状态：已接受
- 日期：2026-08-09

## 背景

Sites 提供 Worker、D1 和 R2 的长期扩展空间，但当前公开 `chatgpt.site` 地址会在部分网络环境触发 Cloudflare 安全拦截。站点所有者同时决定使用公开 GitHub 仓库。

## 决定

保留 Sites 作为动态部署目标，并增加 GitHub Pages 静态目标。两者共用页面、内容与样式，只在构建入口处分流：

- 默认构建加载 Vinext、Sites 打包插件和 Cloudflare 插件。
- Pages 构建只加载 Vinext，启用 `output: "export"`、仓库资源前缀和静态 metadata。
- GitHub Actions 只发布整理后的 `dist/pages`，不上传 Worker、数据库配置或构建缓存。

## 后果

当前多页面网站可以通过 Pages 获得纯静态公开入口，也能继续在 Sites 迭代。任何新增的服务端功能必须明确提供静态降级，或仅在动态目标开放。两个目标都需要独立契约测试，避免某一条发布路径长期失修。

Vinext `1.0.0-beta.5` 的预渲染器在配置 `basePath` 时仍以 `/` 请求内部 RSC 服务并返回 404；开启 `trailingSlash` 后，它又会把自己的 308 规范化跳转误判为预渲染失败。因此当前使用 `assetPrefix`、`NEXT_PUBLIC_BASE_PATH` 与 `sitePath()` 显式处理资源和站内链接，先导出 `about.html` 一类规范文件，再由 `prepare-pages.mjs` 生成 `about/index.html` 目录副本。升级 Vinext 时必须重新验证并优先恢复标准 `basePath + trailingSlash`。
