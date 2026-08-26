import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

function normalizedBasePath() {
  const value = process.env.PAGES_BASE_PATH?.trim().replace(/^\/+|\/+$/g, "");
  return value ? `/${value}` : "";
}

async function readExportedPage(path) {
  const output = new URL(`../dist/pages/${path}`, import.meta.url);
  await access(output);
  return readFile(output, "utf8");
}

function assertBasePathSafeReferences(html, pagePath, basePath) {
  const localReferences = [...html.matchAll(/\b(?:src|href)="(\/[^"#?]+)[^"]*"/g)].map(
    (match) => match[1],
  );

  assert.ok(localReferences.length > 0, `expected local resources in ${pagePath}`);

  return Promise.all(
    [...new Set(localReferences)].map(async (reference) => {
      assert.ok(
        !basePath || reference.startsWith(`${basePath}/`),
        `resource is missing the Pages prefix in ${pagePath}: ${reference}`,
      );

      const artifactPath = decodeURIComponent(
        (basePath ? reference.slice(basePath.length) : reference).replace(/^\/+/, ""),
      );
      if (artifactPath) {
        await access(new URL(`../dist/pages/${artifactPath}`, import.meta.url));
      }
    }),
  );
}

test("exports the visitor-first multi-page site for GitHub Pages", async () => {
  const basePath = normalizedBasePath();
  const pages = [
    { path: "index.html", title: /<title>SEKAI \/ 00 · 个人次元站<\/title>/i },
    { path: "about/index.html", title: /<title>关于我 · SEKAI<\/title>/i },
    {
      path: "study/index.html",
      title: /<title>计算机学习笔记 · SEKAI<\/title>/i,
    },
    { path: "links/index.html", title: /<title>链接收藏 · SEKAI<\/title>/i },
    { path: "logs/index.html", title: /<title>世界线日志 · SEKAI<\/title>/i },
    // Keep the former route readable for old bookmarks, but not as a fifth
    // public destination. Its metadata and body are checked separately below.
    {
      path: "projects/index.html",
      title: /<title>世界线日志 · SEKAI<\/title>/i,
    },
  ];

  const exported = new Map();
  for (const page of pages) {
    const html = await readExportedPage(page.path);
    exported.set(page.path, html);

    assert.match(html, /<html[^>]*lang="zh-CN"/i);
    assert.match(html, /<html[^>]*data-theme="light"/i);
    assert.match(html, page.title);
    assert.doesNotMatch(html, /localhost(?::\d+)?/i);
    if (page.path !== "index.html") {
      assert.match(html, /class="journey-navigation section-shell"/);
      assert.match(html, /class="journey-link journey-previous"/);
      assert.match(html, /返回首页/);
    }

    await assertBasePathSafeReferences(html, page.path, basePath);
  }

  const homepage = exported.get("index.html");
  assert.match(homepage, new RegExp(`src="${basePath}/hero-anime-v2\\.webp"`));
  assert.match(homepage, /Mikureina/);
  assert.match(homepage, /南京大学 CS 在读/);
  assert.match(homepage, /Stanford CS224N/);
  assert.match(homepage, /我的三位二次元老婆/);
  assert.match(homepage, /初音未来/);
  assert.match(homepage, /伊蕾娜/);
  assert.match(homepage, /波奇/);
  assert.match(homepage, /FAVORITE FREQUENCIES/);
  assert.match(homepage, /DIMENSIONAL GACHA/);
  assert.match(homepage, /抽一张今天的次元签/);
  assert.match(
    homepage,
    new RegExp(`href="${basePath}/study/#cs224n-nlp-word-vectors"`),
  );

  for (const route of ["about", "study", "links", "logs"]) {
    assert.match(homepage, new RegExp(`href="${basePath}/${route}/"`));
  }
  assert.doesNotMatch(homepage, new RegExp(`href="${basePath}/projects/"`));
  assert.doesNotMatch(
    homepage,
    /EP\.010|PROJECT OVERVIEW|ROADMAP|PHASE\s*0\d|制作档案/i,
  );
  assert.doesNotMatch(homepage, /miku125194847@gmail\.com/);

  const about = exported.get("about/index.html");
  assert.match(about, /Mikureina/);
  assert.match(about, /南京大学 · CS 在读/);
  assert.match(about, /href="mailto:miku125194847@gmail\.com"/);
  assert.doesNotMatch(about, /href="[^"]*\/mailto:/);
  assert.match(about, /最近在投入的三件事/);
  assert.match(about, new RegExp(`href="${basePath}/logs/#project-overview"`));

  const study = exported.get("study/index.html");
  assert.match(study, /NOTE \/ NLP-001/);
  assert.match(study, /AI 与 NLP/);
  assert.match(study, /CS224N 学习笔记 01：词语如何进入向量空间/);
  assert.match(study, /https:\/\/web\.stanford\.edu\/class\/cs224n\//);
  assert.match(
    study,
    /https:\/\/web\.stanford\.edu\/class\/cs224n\/slides_w26\/cs224n-2026-lecture02-wordvecs\.pdf/,
  );
  assert.doesNotMatch(study, /LEARNING QUEUE|learning-queue/i);

  const links = exported.get("links/index.html");
  assert.match(links, /href="https:\/\/www\.bilibili\.com\/"/);
  assert.match(links, /哔哩哔哩 · Bilibili/);
  assert.match(links, /我最喜欢的视频平台/);
  assert.match(links, /下一枚收藏坐标/);
  assert.match(links, /内容待填充/);
  assert.match(links, new RegExp(`href="${basePath}/about/#contact"`));
  assert.match(links, new RegExp(`href="${basePath}/study/#cs224n-nlp-word-vectors"`));
  assert.match(links, /https:\/\/github\.com\/miku-qaq\/sekai-zero/);
  assert.match(links, /https:\/\/web\.stanford\.edu\/class\/cs224n\//);
  assert.doesNotMatch(links, /miku125194847@gmail\.com/);

  const logs = exported.get("logs/index.html");
  assert.match(logs, /id="project-overview"/);
  assert.match(logs, /原“制作档案”已并入日志/);
  assert.match(logs, /CASE \/ 001/);
  assert.match(logs, /https:\/\/github\.com\/miku-qaq\/sekai-zero/);
  assert.match(logs, /id="ep-010"/);
  assert.match(logs, /EP\.010/);
  assert.match(logs, /把网站内容重新交还给访客/);
  assert.match(logs, /id="ep-009"/);

  const projects = exported.get("projects/index.html");
  assert.match(projects, /id="project-overview"/);
  assert.match(projects, /id="ep-010"/);
  assert.match(projects, /<meta[^>]*name="robots"[^>]*content="[^"]*noindex[^"]*"/i);
  const canonicalMatch = projects.match(
    /<link[^>]*rel="canonical"[^>]*href="([^"]+)"/i,
  );
  assert.ok(canonicalMatch, "the compatibility route needs a canonical URL");
  const canonical = new URL(canonicalMatch[1]);
  assert.equal(canonical.pathname, `${basePath}/logs/`);

  const publicPages = [homepage, about, study, links, logs].join("\n");
  assert.doesNotMatch(
    publicPages,
    new RegExp(`href="${basePath}/projects/"`),
    "the compatibility route must not reappear in public navigation",
  );

  await access(new URL("../dist/pages/og-study.png", import.meta.url));
  await access(new URL("../dist/pages/og-v4.png", import.meta.url));
  await access(new URL("../dist/pages/.nojekyll", import.meta.url));
});
