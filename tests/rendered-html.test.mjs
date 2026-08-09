import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render(pathname = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${pathname}`, {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the product homepage and its core navigation", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<html[^>]*lang="zh-CN"/i);
  assert.match(html, /<title>SEKAI \/ 00 · 个人次元站<\/title>/i);
  assert.match(html, /这里不只一页/);
  assert.match(html, /角色设定档/);
  assert.match(html, /航线终端/);
  assert.match(html, /世界线日志/);
  assert.match(html, /三张我的 SSR/);
  assert.match(html, /hero-anime-v2\.webp/);
  assert.match(html, /本话三个次元瞬间/);
  assert.match(html, /キラッ/);
  assert.match(html, /<h3>把还没有形状的明天/);
  assert.match(html, /role="meter"[^>]*aria-valuenow="99"/);
  assert.match(html, /id="gacha"/);
  assert.match(html, /抽一张今天的次元签/);
  assert.match(html, /抽取下一张/);
  assert.match(html, /先让明天发出声音/);
  assert.match(html, /初音未来/);
  assert.match(html, /伊蕾娜/);
  assert.match(html, /波奇/);
  assert.match(html, /id="works"/);
  assert.match(html, /id="roadmap"/);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton/i);
});

test("server-renders every secondary route with its own editorial purpose", async () => {
  const routes = [
    {
      pathname: "/about",
      title: /<title>角色设定档 · SEKAI<\/title>/i,
      copy: /欢迎来到我的角色设定页/,
    },
    {
      pathname: "/links",
      title: /<title>航线终端 · SEKAI<\/title>/i,
      copy: /我在互联网留下的航线/,
    },
    {
      pathname: "/logs",
      title: /<title>世界线日志 · SEKAI<\/title>/i,
      copy: /把网站的成长，也写成内容/,
    },
  ];

  for (const route of routes) {
    const response = await render(route.pathname);
    assert.equal(response.status, 200, route.pathname);
    const html = await response.text();
    assert.match(html, route.title);
    assert.match(html, route.copy);
  }
});

test("keeps product boundaries and interaction safeguards in place", async () => {
  const [page, content, packageJson, header, layout, share, gacha, styles, sitePaths] =
    await Promise.all([
      readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
      readFile(new URL("../content/site.ts", import.meta.url), "utf8"),
      readFile(new URL("../package.json", import.meta.url), "utf8"),
      readFile(new URL("../app/components/site-header.tsx", import.meta.url), "utf8"),
      readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
      readFile(new URL("../app/components/share-button.tsx", import.meta.url), "utf8"),
      readFile(
        new URL("../app/components/dimensional-gacha.tsx", import.meta.url),
        "utf8",
      ),
      readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
      readFile(new URL("../lib/site-path.ts", import.meta.url), "utf8"),
    ]);

  assert.match(page, /from "@\/content\/site"/);
  assert.match(content, /favoriteChannels/);
  assert.match(content, /mangaMoments/);
  assert.match(content, /dimensionalFortunes/);
  assert.match(packageJson, /"name": "sekai-zero-personal-site"/);
  assert.doesNotMatch(page, /SkeletonPreview|codex-preview/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton|drizzle-kit/);
  assert.match(header, /hidden=\{!menuOpen\}/);
  assert.match(header, /event\.key === "Escape"/);
  assert.match(header, /aria-current/);
  assert.match(layout, /themeInitializationScript/);
  assert.match(layout, /subpages\.css/);
  assert.match(share, /manualUrl/);
  assert.match(share, /aria-live="polite"/);
  assert.match(gacha, /Math\.random/);
  assert.match(gacha, /aria-atomic="true"/);
  assert.match(sitePaths, /NEXT_PUBLIC_BASE_PATH/);

  const mobileStart = styles.indexOf("@media (max-width: 760px)");
  const mobileEnd = styles.indexOf("@media (max-width: 420px)");
  const mobileStyles = styles.slice(mobileStart, mobileEnd);
  assert.match(
    mobileStyles,
    /\.channel-options\s*\{[^}]*repeat\(3, minmax\(0, 1fr\)\)/,
  );
  assert.match(
    mobileStyles,
    /\.channel-option-symbol\s*\{[^}]*grid-row:\s*auto;[^}]*grid-column:\s*auto;/,
  );
});
