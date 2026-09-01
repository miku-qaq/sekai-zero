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
  const clientManifest = JSON.parse(
    await readFile(
      new URL("../dist/client/.vite/manifest.json", import.meta.url),
      "utf8",
    ),
  );
  const collectionLinkEntry = clientManifest["app/collections/collection-link.tsx"];
  assert.ok(collectionLinkEntry, "collection navigation needs a client entry");
  assert.equal(collectionLinkEntry.isDynamicEntry, true);
  const collectionLinkChunk = await readFile(
    new URL(`../dist/client/${collectionLinkEntry.file}`, import.meta.url),
    "utf8",
  );
  assert.ok(
    collectionLinkChunk.includes(`=\`${basePath}\`,`),
    "the Pages Link runtime should retain the repository base path",
  );
  assert.match(
    collectionLinkChunk,
    new RegExp(`=\\\`${basePath}\\\`,[A-Za-z_$][\\w$]*=!0`),
    "the Pages Link runtime should preserve directory-style URLs",
  );
  const browserEntry = clientManifest["virtual:vinext-app-browser-entry"];
  assert.ok(browserEntry, "the App Router browser entry should be emitted");
  const browserChunk = await readFile(
    new URL(`../dist/client/${browserEntry.file}`, import.meta.url),
    "utf8",
  );
  assert.ok(
    browserChunk.includes(`=\`${basePath}\`,`),
    "the Pages navigation runtime should retain the repository base path",
  );

  const pages = [
    { path: "index.html", title: /<title>SEKAI \/ 00 · 个人次元站<\/title>/i },
    { path: "about/index.html", title: /<title>关于我 · SEKAI<\/title>/i },
    {
      path: "collections/index.html",
      title: /<title>奇妙收藏馆 · SEKAI<\/title>/i,
    },
    {
      path: "collections/anime/index.html",
      title: /<title>动画收藏 · 奇妙收藏馆 · SEKAI<\/title>/i,
    },
    {
      path: "collections/games/index.html",
      title: /<title>游戏收藏 · 奇妙收藏馆 · SEKAI<\/title>/i,
    },
    {
      path: "collections/figures/index.html",
      title: /<title>手办收藏 · 奇妙收藏馆 · SEKAI<\/title>/i,
    },
    {
      path: "collections/fufu/index.html",
      title: /<title>Fufu 收藏 · 奇妙收藏馆 · SEKAI<\/title>/i,
    },
    {
      path: "study/index.html",
      title: /<title>计算机学习笔记 · SEKAI<\/title>/i,
    },
    { path: "links/index.html", title: /<title>导航终端 · SEKAI<\/title>/i },
    { path: "logs/index.html", title: /<title>世界线日志 · SEKAI<\/title>/i },
    // Keep former routes readable for old bookmarks, but not as canonical
    // navigation destinations. Metadata and bodies are checked below.
    {
      path: "anime/index.html",
      title: /<title>动画收藏 · 奇妙收藏馆 · SEKAI<\/title>/i,
    },
    {
      path: "games/index.html",
      title: /<title>游戏收藏 · 奇妙收藏馆 · SEKAI<\/title>/i,
    },
    {
      path: "projects/index.html",
      title: /<title>世界线日志 · SEKAI<\/title>/i,
    },
  ];
  assert.equal(pages.length, 13, "Pages should expose exactly 13 public routes");

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

  for (const route of ["about", "collections", "study", "links", "logs"]) {
    assert.match(homepage, new RegExp(`href="${basePath}/${route}/"`));
  }
  const routeOrder = ["about", "collections", "study", "links", "logs"].map((route) =>
    homepage.indexOf(`href="${basePath}/${route}/"`),
  );
  assert.ok(routeOrder.every((position) => position >= 0));
  assert.deepEqual(
    routeOrder,
    routeOrder.toSorted((left, right) => left - right),
  );
  assert.doesNotMatch(homepage, new RegExp(`href="${basePath}/(?:anime|games)/"`));
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
  assert.match(about, /最近在投入的事情/);
  assert.match(about, new RegExp(`href="${basePath}/collections/"`));

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

  const collections = exported.get("collections/index.html");
  assert.match(collections, /04 间/);
  assert.match(collections, /257 条/);
  assert.match(collections, /动画展柜/);
  assert.match(collections, /游戏展柜/);
  assert.match(collections, /手办收藏/);
  assert.match(collections, /Fufu 收藏/);
  assert.match(collections, new RegExp(`href="${basePath}/collections/anime/"`));
  assert.match(collections, new RegExp(`href="${basePath}/collections/games/"`));
  assert.match(collections, new RegExp(`href="${basePath}/collections/figures/"`));
  assert.match(collections, new RegExp(`href="${basePath}/collections/fufu/"`));
  assert.match(collections, /从虎生肖开始/);
  const visibleCollections = collections.replaceAll("<!-- -->", "");
  assert.match(visibleCollections, /16 件/);
  assert.match(visibleCollections, /6 只毛绒/);
  assert.equal(
    collections.match(new RegExp(`src="${basePath}/anime/[^"]+\\.webp"`, "g"))?.length,
    4,
  );
  assert.equal(
    collections.match(new RegExp(`src="${basePath}/games/[^"]+\\.webp"`, "g"))?.length,
    4,
  );
  assert.doesNotMatch(collections, /https:\/\/store\.steampowered\.com\/app\//);

  const anime = exported.get("collections/anime/index.html");
  assert.match(anime, /89 部/);
  assert.match(anime, /MIKUREINA&#x27;S WONDER COLLECTION/);
  assert.match(anime, new RegExp(`href="${basePath}/collections/games/"`));
  assert.match(anime, new RegExp(`href="${basePath}/collections/figures/"`));
  assert.match(anime, new RegExp(`href="${basePath}/collections/fufu/"`));
  assert.match(anime, /已展示 <strong>24<\/strong>/);
  assert.match(anime, /还有 (?:<!-- -->)?65(?:<!-- -->)? 部动画尚未展开/);
  assert.match(anime, /灵笼 上半季/);
  assert.match(anime, /魔女之旅/);
  assert.match(anime, /樱花庄的宠物女孩/);
  assert.doesNotMatch(anime, /孤独摇滚！|命运石之门/);
  assert.match(anime, /封面与作品资料索引来自 Bangumi/);
  assert.doesNotMatch(anime, /heart beats|时速5cm|作品名、别名|aliases/i);
  const animeCovers = [
    ...anime.matchAll(new RegExp(`src="${basePath}/anime/[^"]+\\.webp"`, "g")),
  ];
  assert.equal(animeCovers.length, 24);

  const games = exported.get("collections/games/index.html");
  assert.match(games, /146 款/);
  assert.match(games, /104 张/);
  assert.match(games, /MIKUREINA&#x27;S WONDER COLLECTION/);
  assert.match(games, new RegExp(`href="${basePath}/collections/anime/"`));
  assert.match(games, new RegExp(`href="${basePath}/collections/figures/"`));
  assert.match(games, new RegExp(`href="${basePath}/collections/fufu/"`));
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

  const figures = exported.get("collections/figures/index.html");
  const visibleFigures = figures.replaceAll("<!-- -->", "");
  assert.match(figures, /去重记录<\/dt><dd>16 件<\/dd>/);
  assert.match(figures, /初音未来<\/dt><dd>07 件<\/dd>/);
  assert.match(figures, /角色核对<\/dt><dd>16 \/ 16<\/dd>/);
  assert.match(figures, /aria-label="16 件手办收藏核对目录"/);
  assert.equal(figures.match(/id="figure-\d{3}-title"/g)?.length, 16);
  assert.doesNotMatch(figures, /id="figure-003-title"/);
  assert.deepEqual(
    [...figures.matchAll(/id="figure-(\d{3})-title"/g)].map((match) => match[1]),
    [
      "001",
      "002",
      "004",
      "005",
      "006",
      "007",
      "008",
      "009",
      "010",
      "011",
      "012",
      "013",
      "014",
      "015",
      "016",
      "017",
    ],
  );
  assert.deepEqual(
    [...visibleFigures.matchAll(/FIG \/ (\d{3})/g)].map((match) => match[1]),
    [
      "001",
      "002",
      "004",
      "005",
      "006",
      "007",
      "008",
      "009",
      "010",
      "011",
      "012",
      "013",
      "014",
      "015",
      "016",
      "017",
    ],
  );
  assert.match(figures, new RegExp(`href="${basePath}/collections/fufu/"`));
  assert.match(figures, /搜索角色或作品/);
  assert.match(figures, /aria-label="筛选手办角色"/);
  assert.match(figures, /初音未来/);
  assert.match(figures, /伊蕾娜/);
  assert.match(figures, /芙莉莲/);
  assert.match(figures, /Angel Beats!/);
  assert.equal(figures.match(/角色已核对/g)?.length, 16);
  assert.doesNotMatch(
    figures,
    /角色待确认|NEEDS CONFIRMATION|PUBLIC \/ 01|PRIVATE \/ 02/,
  );
  assert.doesNotMatch(figures, /NEXT \/ 03[^]{0,160}本人拍摄的实物照片/);
  assert.doesNotMatch(figures, /\b\d+(?:\.\d{1,2})?\s*(?:人民币|元|CNY|RMB)\b/i);
  assert.doesNotMatch(figures, /[¥￥]\s*\d/);
  assert.doesNotMatch(figures, /\b(?:19|20)\d{2}[/-]\d{1,2}(?:[/-]\d{1,2})?\b/);
  assert.doesNotMatch(figures, /(?:order|订单)[-_:#：\s]*[A-Z0-9]{6,}/i);
  assert.doesNotMatch(figures, /<time\b|data-(?:price|order|date|purchased-at)=/i);

  const fufu = exported.get("collections/fufu/index.html");
  assert.match(fufu, /从寅 2022/);
  assert.match(fufu, /本人收藏<\/dt><dd>06 只<\/dd>/);
  assert.match(fufu, /aria-label="5 只生肖 Fufu 收藏"/);
  assert.equal(fufu.match(/id="(?:figure-003|fufu-zodiac-[^"]+)-title"/g)?.length, 6);
  assert.match(fufu, /id="figure-003-title"/);
  assert.match(
    fufu,
    /初音ミクシリーズ\u3000初音ミク\u3000ふわぷち\u3000どでかジャンボぬいぐるみ/,
  );
  assert.match(fufu, /初音ミク\u3000寅2022\u3000ふわふわぬいぐるみ\(LL\)/);
  assert.match(fufu, /初音ミク\u3000卯2023\u3000ふわぷち\u3000ぬいぐるみ（LL）/);
  assert.match(fufu, /初音ミク\u3000辰2024\u3000ふわぷち\u3000ぬいぐるみ（LL）/);
  assert.match(fufu, /初音ミク\u3000巳2025\u3000ふわぷち\u3000ぬいぐるみ（ＬＬ）/);
  assert.match(fufu, /初音ミク\u3000午2026\u3000ふわぷち\u3000ぬいぐるみ（LL）/);
  assert.match(fufu, /商品卡保留 SEGA 公布的正式名称/);
  assert.match(fufu, /href="https:\/\/segaplaza\.jp\/goods\/120696\/"/);
  assert.match(fufu, /href="https:\/\/info\.miku\.sega\.jp\/16431"/);
  assert.match(fufu, /href="https:\/\/info\.miku\.sega\.jp\/17297"/);
  assert.match(fufu, /href="https:\/\/segaplaza\.jp\/goods\/120142\/"/);
  assert.match(fufu, /href="https:\/\/segaplaza\.jp\/goods\/120683\/"/);
  assert.match(fufu, /href="https:\/\/segaplaza\.jp\/goods\/120684\/"/);
  assert.match(fufu, new RegExp(`href="${basePath}/collections/figures/"`));
  assert.doesNotMatch(fufu, /\b\d+(?:\.\d{1,2})?\s*(?:人民币|元|CNY|RMB)\b/i);
  assert.doesNotMatch(fufu, /[¥￥]\s*\d/);
  assert.doesNotMatch(fufu, /\b(?:19|20)\d{2}[/-]\d{1,2}(?:[/-]\d{1,2})?\b/);
  assert.doesNotMatch(fufu, /(?:order|订单)[-_:#：\s]*[A-Z0-9]{6,}/i);
  assert.doesNotMatch(fufu, /<time\b|data-(?:price|order|date|purchased-at)=/i);

  for (const [html, expectedPath] of [
    [collections, `${basePath}/collections/`],
    [anime, `${basePath}/collections/anime/`],
    [games, `${basePath}/collections/games/`],
    [figures, `${basePath}/collections/figures/`],
    [fufu, `${basePath}/collections/fufu/`],
  ]) {
    const match = html.match(/<link[^>]*rel="canonical"[^>]*href="([^"]+)"/i);
    assert.ok(match, `${expectedPath} should expose a canonical URL`);
    assert.equal(new URL(match[1]).pathname, expectedPath);
  }

  const links = exported.get("links/index.html");
  assert.match(links, /href="https:\/\/www\.bilibili\.com\/"/);
  assert.match(links, /哔哩哔哩 · Bilibili/);
  assert.match(links, /我最喜欢的视频平台/);
  assert.match(links, /href="https:\/\/www\.apple\.com\.cn\/"/);
  assert.match(links, /Apple 中国官网/);
  assert.match(links, /我喜欢 Apple 产品/);
  assert.match(links, /href="https:\/\/store\.steampowered\.com\/"/);
  assert.match(links, /Steam 商店/);
  assert.match(
    links,
    /href="https:\/\/www\.nintendo\.com\/hk\/hardware\/switch\/index\.html"/,
  );
  assert.match(links, /Nintendo Switch 官方网站/);
  assert.match(links, /Steam 与 Nintendo Switch（NS）是我最喜欢的两个游戏平台/);
  assert.match(links, /terminal-card-icon[^>]*>NS</);
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
  assert.match(logs, /18 EPISODES/);
  assert.match(logs, /CASE \/ 001/);
  assert.match(logs, /https:\/\/github\.com\/miku-qaq\/sekai-zero/);
  assert.match(logs, /id="ep-018"/);
  assert.match(logs, /EP\.018/);
  assert.match(logs, /把开发桌面搬到 Mac/);
  assert.match(logs, /id="ep-017"/);
  assert.match(logs, /EP\.017/);
  assert.match(logs, /手办/);
  assert.match(logs, /id="ep-016"/);
  assert.match(logs, /EP\.016/);
  assert.match(logs, /让收藏馆切换不再打断参观/);
  assert.match(logs, /id="ep-015"/);
  assert.match(logs, /EP\.015/);
  assert.match(logs, /Fufu/);
  assert.match(logs, /id="ep-014"/);
  assert.match(logs, /EP\.014/);
  assert.match(logs, /奇妙收藏馆/);
  assert.match(logs, /id="ep-013"/);
  assert.match(logs, /EP\.013/);
  assert.match(logs, /让导航终端找回自己的名字/);
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
  assert.equal(logs.match(/id="ep-\d{3}"/g)?.length, 18);

  const projects = exported.get("projects/index.html");
  assert.match(projects, /id="project-overview"/);
  assert.match(projects, /id="ep-018"/);
  assert.match(projects, /id="ep-017"/);
  assert.match(projects, /id="ep-016"/);
  assert.match(projects, /id="ep-015"/);
  assert.match(projects, /id="ep-014"/);
  assert.match(projects, /id="ep-013"/);
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

  const compatibilityPages = [
    {
      html: exported.get("anime/index.html"),
      canonicalPath: `${basePath}/collections/anime/`,
      copy: /看过的故事，也组成了我的世界/,
    },
    {
      html: exported.get("games/index.html"),
      canonicalPath: `${basePath}/collections/games/`,
      copy: /玩过的世界，也值得收藏/,
    },
  ];
  for (const compatibility of compatibilityPages) {
    assert.match(compatibility.html, compatibility.copy);
    assert.match(
      compatibility.html,
      /<meta[^>]*name="robots"[^>]*content="[^"]*noindex[^"]*"/i,
    );
    const match = compatibility.html.match(
      /<link[^>]*rel="canonical"[^>]*href="([^"]+)"/i,
    );
    assert.ok(match, "collection compatibility pages need canonical URLs");
    assert.equal(new URL(match[1]).pathname, compatibility.canonicalPath);
  }

  const publicPages = [
    homepage,
    about,
    collections,
    anime,
    games,
    figures,
    fufu,
    study,
    links,
    logs,
  ].join("\n");
  assert.doesNotMatch(
    publicPages,
    new RegExp(`href="${basePath}/(?:anime|games|projects)/"`),
    "compatibility routes must not reappear in public navigation",
  );

  await access(new URL("../dist/pages/og-study.png", import.meta.url));
  await access(new URL("../dist/pages/og-v4.png", import.meta.url));
  await access(new URL("../dist/pages/.nojekyll", import.meta.url));
});
