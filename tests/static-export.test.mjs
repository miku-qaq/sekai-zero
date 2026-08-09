import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

function normalizedBasePath() {
  const value = process.env.PAGES_BASE_PATH?.trim().replace(/^\/+|\/+$/g, "");
  return value ? `/${value}` : "";
}

test("exports a self-contained GitHub Pages homepage", async () => {
  const output = new URL("../dist/pages/index.html", import.meta.url);
  await access(output);

  const html = await readFile(output, "utf8");
  const basePath = normalizedBasePath();

  assert.match(html, /<html[^>]*lang="zh-CN"/i);
  assert.match(html, /<title>SEKAI \/ 00 · 个人次元站<\/title>/i);
  assert.match(html, new RegExp(`src="${basePath}/hero-anime-v2\\.webp"`));

  const localReferences = [...html.matchAll(/\b(?:src|href)="(\/[^"#?]+)[^"]*"/g)].map(
    (match) => match[1],
  );
  assert.ok(localReferences.length > 0, "expected local HTML resources");

  for (const reference of new Set(localReferences)) {
    assert.ok(
      !basePath || reference.startsWith(`${basePath}/`),
      `resource is missing the Pages prefix: ${reference}`,
    );

    const artifactPath = decodeURIComponent(
      (basePath ? reference.slice(basePath.length) : reference).replace(/^\/+/, ""),
    );
    if (artifactPath) {
      await access(new URL(`../dist/pages/${artifactPath}`, import.meta.url));
    }
  }

  await access(new URL("../dist/pages/.nojekyll", import.meta.url));
  assert.doesNotMatch(html, /localhost(?::\d+)?/i);
});
