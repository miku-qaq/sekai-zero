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
  assert.match(html, /在现实与/);
  assert.match(html, /三条特别喜欢的/);
  assert.match(html, /初音未来/);
  assert.match(html, /伊蕾娜/);
  assert.match(html, /波奇/);
  assert.match(html, /id="works"/);
  assert.match(html, /id="roadmap"/);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton/i);
});

test("keeps product boundaries and interaction safeguards in place", async () => {
  const [page, content, packageJson, header, layout, share] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../content/site.ts", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
    readFile(new URL("../app/components/site-header.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/share-button.tsx", import.meta.url), "utf8"),
  ]);

  assert.match(page, /from "@\/content\/site"/);
  assert.match(content, /favoriteChannels/);
  assert.match(packageJson, /"name": "sekai-zero-personal-site"/);
  assert.doesNotMatch(page, /SkeletonPreview|codex-preview/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton|drizzle-kit/);
  assert.match(header, /hidden=\{!menuOpen\}/);
  assert.match(header, /event\.key === "Escape"/);
  assert.match(layout, /themeInitializationScript/);
  assert.match(share, /manualUrl/);
  assert.match(share, /aria-live="polite"/);
});
