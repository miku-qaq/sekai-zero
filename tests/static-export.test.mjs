import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

function normalizedBasePath() {
  const value = process.env.PAGES_BASE_PATH?.trim().replace(/^\/+|\/+$/g, "");
  return value ? `/${value}` : "";
}

test("exports a self-contained multi-page GitHub Pages site", async () => {
  const basePath = normalizedBasePath();

  const pages = [
    { path: "index.html", title: /<title>SEKAI \/ 00 · 个人次元站<\/title>/i },
    { path: "about/index.html", title: /<title>角色设定档 · SEKAI<\/title>/i },
    { path: "links/index.html", title: /<title>航线终端 · SEKAI<\/title>/i },
    { path: "logs/index.html", title: /<title>世界线日志 · SEKAI<\/title>/i },
  ];

  for (const page of pages) {
    const output = new URL(`../dist/pages/${page.path}`, import.meta.url);
    await access(output);
    const html = await readFile(output, "utf8");

    assert.match(html, /<html[^>]*lang="zh-CN"/i);
    assert.match(html, page.title);
    assert.doesNotMatch(html, /localhost(?::\d+)?/i);

    const localReferences = [
      ...html.matchAll(/\b(?:src|href)="(\/[^"#?]+)[^"]*"/g),
    ].map((match) => match[1]);
    assert.ok(localReferences.length > 0, `expected local resources in ${page.path}`);

    for (const reference of new Set(localReferences)) {
      assert.ok(
        !basePath || reference.startsWith(`${basePath}/`),
        `resource is missing the Pages prefix in ${page.path}: ${reference}`,
      );

      const artifactPath = decodeURIComponent(
        (basePath ? reference.slice(basePath.length) : reference).replace(/^\/+/, ""),
      );
      if (artifactPath) {
        await access(new URL(`../dist/pages/${artifactPath}`, import.meta.url));
      }
    }
  }

  const homepage = await readFile(
    new URL("../dist/pages/index.html", import.meta.url),
    "utf8",
  );
  assert.match(homepage, new RegExp(`src="${basePath}/hero-anime-v2\\.webp"`));
  assert.match(homepage, new RegExp(`href="${basePath}/about/"`));
  assert.match(homepage, new RegExp(`href="${basePath}/links/"`));
  assert.match(homepage, new RegExp(`href="${basePath}/logs/"`));
  await access(new URL("../dist/pages/.nojekyll", import.meta.url));
});
