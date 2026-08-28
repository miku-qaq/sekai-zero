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
      path: "anime/index.html",
      title: /<title>动画收藏馆 · SEKAI<\/title>/i,
    },
    {
      path: "games/index.html",
      title: /<title>游戏收藏馆 · SEKAI<\/title>/i,
    },
    {
      path: "study/index.html",
      title: /<title>计算机学习笔记 · SEKAI<\/title>/i,
    },
    { path: "links/index.html", title: /<title>链接收藏 · SEKAI<\/title>/i },
    { path: "logs/index.html", title: /<title>世界线日志 · SEKAI<\/title>/i },
    // Keep the former route readable for old bookmarks, but not as a seventh
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

  for (const route of ["about", "anime", "games", "study", "links", "logs"]) {
    assert.match(homepage, new RegExp(`href="${basePath}/${route}/"`));
  }
  const routeOrder = ["about", "anime", "games", "study", "links", "logs"].map(
    (route) => homepage.indexOf(`href="${basePath}/${route}/"`),
  );
  assert.ok(routeOrder.every((position) => position >= 0));
  assert.deepEqual(
    routeOrder,
    routeOrder.toSorted((left, right) => left - right),
  );
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
  assert.match(about, new RegExp(`href="${basePath}/games/"`));

  const study = exported.get("study/index.html");
  assert.match(study, /NOTE \/ NLP-001/);
  assert.match(study, /AI · 视觉与语言/);
  assert.match(study, /CS224N 学习笔记 01：词语如何进入向量空间/);
  assert.match(study, /https:\/\/web\.stanford\.edu\/class\/cs224n\//);
  assert.match(
    study,
    /https:\/\/web\.stanford\.edu\/class\/cs224n\/slides_w26\/cs224n-2026-lecture02-wordvecs\.pdf/,
  );
  assert.match(study, /id="cs231n-image-classification-data-driven"/);
  assert.match(study, /NOTE \/ CV-001/);
  assert.match(study, /CS231n 学习回顾 01：图像分类为什么要从数据出发/);
  assert.match(study, /曾学习 · 回顾/);
  assert.match(study, /我之前学习过 Stanford CS231n 的公开课程资料/);
  assert.match(study, /https:\/\/cs231n\.stanford\.edu\//);
  assert.match(study, /https:\/\/cs231n\.stanford\.edu\/slides\/2026\/lecture_2\.pdf/);
  assert.match(study, /https:\/\/cs231n\.github\.io\/convolutional-networks\//);
  assert.doesNotMatch(study, /LEARNING QUEUE|learning-queue/i);

  const anime = exported.get("anime/index.html");
  assert.match(anime, /89 部/);
  assert.match(anime, /MIKUREINA&#x27;S COLLECTION/);
  assert.match(anime, new RegExp(`href="${basePath}/games/"`));
  assert.match(anime, /灵笼 上半季/);
  assert.match(anime, /魔女之旅/);
  assert.match(anime, /孤独摇滚！/);
  assert.match(anime, /命运石之门/);
  assert.match(anime, /封面与作品资料索引来自 Bangumi/);
  assert.doesNotMatch(anime, /heart beats|时速5cm|作品名、别名|aliases/i);
  const animeCovers = [
    ...anime.matchAll(new RegExp(`src="${basePath}/anime/[^"]+\\.webp"`, "g")),
  ];
  assert.equal(animeCovers.length, 89);

  const games = exported.get("games/index.html");
  assert.match(games, /146 款/);
  assert.match(games, /104 张/);
  assert.match(games, /MIKUREINA&#x27;S COLLECTION/);
  assert.match(games, new RegExp(`href="${basePath}/anime/"`));
  assert.match(games, /实际游玩记录/);
  assert.match(games, /玩过 \/ 不排名/);
  assert.match(games, /Nintendo Switch 收藏待补充/);
  assert.match(games, /内容待填充 · OWNER CONFIRMATION REQUIRED/);
  assert.equal(
    games.match(/<strong>内容待填充 · OWNER CONFIRMATION REQUIRED<\/strong>/g)?.length,
    1,
  );
  assert.match(games, /https:\/\/store\.steampowered\.com\/app\//);
  assert.doesNotMatch(
    games,
    /"(?:playtime|lastPlayed|accountId|steamId|friends|token|auth|userdata)"\s*:/i,
  );
  assert.doesNotMatch(games, /\b(?:data-)?(?:playtime|lastplayed|accountid|steamid)=/i);
  assert.doesNotMatch(games, /\b7656119\d{10}\b/);
  assert.doesNotMatch(games, /STEAM \/ APP\s+\d+/i);

  const links = exported.get("links/index.html");
  assert.match(links, /href="https:\/\/www\.bilibili\.com\/"/);
  assert.match(links, /哔哩哔哩 · Bilibili/);
  assert.match(links, /我最喜欢的视频平台/);
  assert.match(links, /href="https:\/\/www\.apple\.com\.cn\/"/);
  assert.match(links, /Apple 中国官网/);
  assert.match(links, /我喜欢 Apple 产品/);
  assert.match(links, /href="https:\/\/store\.steampowered\.com\/"/);
  assert.match(links, /Steam 商店/);
  assert.match(links, /href="https:\/\/cs231n\.stanford\.edu\/"/);
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
  assert.match(logs, /id="ep-012"/);
  assert.match(logs, /EP\.012/);
  assert.match(logs, /把游戏足迹与视觉学习接进收藏系统/);
  assert.match(logs, /id="ep-011"/);
  assert.match(logs, /EP\.011/);
  assert.match(logs, /把看过的动画铺成一面收藏墙/);
  assert.match(logs, /id="ep-010"/);
  assert.match(logs, /EP\.010/);
  assert.match(logs, /把网站内容重新交还给访客/);
  assert.match(logs, /id="ep-009"/);

  const projects = exported.get("projects/index.html");
  assert.match(projects, /id="project-overview"/);
  assert.match(projects, /id="ep-012"/);
  assert.match(projects, /id="ep-011"/);
  assert.match(projects, /id="ep-010"/);
  assert.match(projects, /<meta[^>]*name="robots"[^>]*content="[^"]*noindex[^"]*"/i);
  const canonicalMatch = projects.match(
    /<link[^>]*rel="canonical"[^>]*href="([^"]+)"/i,
  );
  assert.ok(canonicalMatch, "the compatibility route needs a canonical URL");
  const canonical = new URL(canonicalMatch[1]);
  assert.equal(canonical.pathname, `${basePath}/logs/`);

  const publicPages = [homepage, about, anime, games, study, links, logs].join("\n");
  assert.doesNotMatch(
    publicPages,
    new RegExp(`href="${basePath}/projects/"`),
    "the compatibility route must not reappear in public navigation",
  );

  await access(new URL("../dist/pages/og-study.png", import.meta.url));
  await access(new URL("../dist/pages/og-v4.png", import.meta.url));
  await access(new URL("../dist/pages/.nojekyll", import.meta.url));
});
