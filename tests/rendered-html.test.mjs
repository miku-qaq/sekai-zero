import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
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

test("builds the exact 15-route Worker manifest", async () => {
  const workerSource = await readFile(
    new URL("../dist/server/index.js", import.meta.url),
    "utf8",
  );
  const routePatterns = [...workerSource.matchAll(/\bpattern:`(\/[^`]*)`/g)].map(
    (match) => match[1],
  );

  assert.deepEqual(routePatterns.toSorted(), [
    "/",
    "/about",
    "/anime",
    "/collections",
    "/collections/anime",
    "/collections/controllers",
    "/collections/figures",
    "/collections/fufu",
    "/collections/gallery",
    "/collections/games",
    "/games",
    "/links",
    "/logs",
    "/projects",
    "/study",
  ]);
});

test("ships collection navigation as a hydrated client boundary", async () => {
  const manifest = JSON.parse(
    await readFile(
      new URL("../dist/client/.vite/manifest.json", import.meta.url),
      "utf8",
    ),
  );
  const entry = manifest["app/collections/collection-link.tsx"];

  assert.ok(entry, "collection-link should be present in the client manifest");
  assert.equal(entry.isDynamicEntry, true);
  await access(new URL(`../dist/client/${entry.file}`, import.meta.url));
});

test("serves a bounded gallery on static and deep-linked requests", async () => {
  for (const pathname of [
    "/collections/gallery",
    "/collections/gallery?room=controllers&item=controller-apex4-yae-miko",
  ]) {
    const response = await render(pathname);
    assert.equal(response.status, 200);
    const html = await response.text();
    assert.match(html, /<title>收藏画册 · 奇妙收藏馆 · SEKAI<\/title>/);
    assert.match(html, /aria-label="画册分类"/);
    assert.match(html, /搜索收藏画册/);
    assert.match(html, /初音的一角/);
    assert.match(html, /旅途与魔法/);
    assert.match(html, /从屏幕到身边/);
    assert.equal((html.match(/aria-label="查看[^"]+大图"/g) ?? []).length, 24);
    assert.match(html, /再翻 (?:<!-- -->)?24/);
    assert.doesNotMatch(html, /<dialog\b/);
    assert.doesNotMatch(
      html,
      /\b7656119\d{10}\b|"(?:playtime|lastPlayed|accountId|steamId|price|purchaseDate)"\s*:/i,
    );
  }
});

test("server-renders a visitor-first homepage with personal and playful content", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<html[^>]*lang="zh-CN"/i);
  assert.match(html, /<html[^>]*data-theme="light"/i);
  assert.match(html, /<title>SEKAI \/ 00 · 个人次元站<\/title>/i);
  assert.match(html, /你好，我是[^]*?Mikureina/);
  assert.match(html, /南京大学 · CS 在读/);
  assert.match(html, /CS224N · 词向量/);
  assert.match(html, /Nintendo Switch · Steam/);
  assert.match(html, /哔哩哔哩/);
  assert.match(html, /href="\/study\/#cs224n-nlp-word-vectors"/);
  assert.match(html, /href="\/links\/#route-bilibili"/);
  assert.match(html, /https:\/\/miku-qaq\.github\.io\/sekai-zero\/og-v5\.jpg/);
  assert.doesNotMatch(html, /chatgpt\.site/);

  assert.match(html, /从这里开始浏览/);
  assert.match(html, /我的三位二次元老婆/);
  assert.match(html, /初音未来/);
  assert.match(html, /伊蕾娜/);
  assert.match(html, /波奇/);
  for (const character of ["miku", "elaina", "bocchi"]) {
    assert.match(
      html,
      new RegExp(`(?:/|%2F)characters(?:/|%2F)${character}-v1\\.webp`),
    );
  }
  assert.match(html, /id="gacha"/);
  assert.match(html, /抽一张今天的次元签/);
  assert.match(html, /抽取下一张/);
  assert.match(html, /先让明天发出声音/);
  assert.match(html, /hero-anime-v3\.webp/);

  // Engineering history belongs to Logs, not the public-facing homepage.
  assert.doesNotMatch(html, /EP\.\d{3}/);
  assert.doesNotMatch(html, /id="project-overview"/);
  assert.doesNotMatch(html, /id="works"|id="roadmap"/);
  assert.doesNotMatch(html, /\bPHASE\s*0\d\b/i);
  assert.doesNotMatch(html, /role="meter"|aria-valuenow=/i);

  const routeOrder = ["/about/", "/collections/", "/study/", "/links/", "/logs/"].map(
    (href) => html.indexOf(`href="${href}"`),
  );
  assert.ok(routeOrder.every((position) => position >= 0));
  assert.deepEqual(
    routeOrder,
    routeOrder.toSorted((left, right) => left - right),
  );
  assert.doesNotMatch(html, /href="\/(?:anime|games)\/"/);
  assert.doesNotMatch(html, /href="\/projects\/"/);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton/i);
});

test("server-renders the five canonical top-level routes with clear purposes", async () => {
  const routes = [
    {
      pathname: "/about",
      title: /<title>关于我 · SEKAI<\/title>/i,
      copy: /你好，我是 Mikureina/,
      breadcrumb: /首页<\/a><span[^>]*>\/<\/span><span>关于我<\/span>/,
    },
    {
      pathname: "/collections",
      title: /<title>奇妙收藏馆 · SEKAI<\/title>/i,
      copy: /把喜欢的世界，收进同一座馆/,
      breadcrumb: /首页<\/a><span[^>]*>\/<\/span><span>奇妙收藏馆<\/span>/,
    },
    {
      pathname: "/study",
      title: /<title>计算机学习笔记 · SEKAI<\/title>/i,
      copy: /把所学，记成自己的理解/,
      breadcrumb: /首页<\/a><span[^>]*>\/<\/span><span>学习笔记<\/span>/,
    },
    {
      pathname: "/links",
      title: /<title>导航终端 · SEKAI<\/title>/i,
      copy: /常去的地方/,
      breadcrumb: /首页<\/a><span[^>]*>\/<\/span><span>导航终端<\/span>/,
    },
    {
      pathname: "/logs",
      title: /<title>世界线日志 · SEKAI<\/title>/i,
      copy: /记录小世界的成长/,
      breadcrumb: /首页<\/a><span[^>]*>\/<\/span><span>日志<\/span>/,
    },
  ];

  for (const route of routes) {
    const response = await render(route.pathname);
    assert.equal(response.status, 200, route.pathname);
    const html = await response.text();
    assert.match(html, route.title);
    assert.match(html, route.copy);
    assert.match(html, route.breadcrumb);
    assert.match(html, /class="journey-navigation section-shell"/);
    assert.match(html, /返回首页/);
    assert.match(html, /当前位置/);
    assert.doesNotMatch(html, /主人/);
  }
});

test("server-renders the five canonical rooms inside the Wonder Collection", async () => {
  const rooms = [
    {
      pathname: "/collections/anime",
      title: /<title>动画收藏 · 奇妙收藏馆 · SEKAI<\/title>/i,
      copy: /看过的故事，也组成了我的世界/,
      subpage: "动画展柜",
    },
    {
      pathname: "/collections/games",
      title: /<title>游戏收藏 · 奇妙收藏馆 · SEKAI<\/title>/i,
      copy: /玩过的世界，也值得收藏/,
      subpage: "游戏展柜",
    },
    {
      pathname: "/collections/figures",
      title: /<title>手办收藏 · 奇妙收藏馆 · SEKAI<\/title>/i,
      copy: /喜欢的角色，也在现实里留下坐标/,
      subpage: "手办收藏",
    },
    {
      pathname: "/collections/fufu",
      title: /<title>Fufu 收藏 · 奇妙收藏馆 · SEKAI<\/title>/i,
      copy: /从寅 2022/,
      subpage: "Fufu 收藏",
    },
    {
      pathname: "/collections/controllers",
      title: /<title>手柄收藏 · 奇妙收藏馆 · SEKAI<\/title>/i,
      copy: /把冒险，握在手里/,
      subpage: "手柄收藏",
    },
  ];

  for (const room of rooms) {
    const response = await render(room.pathname);
    assert.equal(response.status, 200, room.pathname);
    const html = await response.text();
    assert.match(html, room.title);
    assert.match(html, room.copy);
    assert.match(
      html,
      new RegExp(
        `首页<\\/a><span[^>]*>\\/<\\/span><span>奇妙收藏馆<\\/span><span[^>]*>\\/<\\/span><span>${room.subpage}<\\/span>`,
      ),
    );
    assert.match(html, /aria-label="奇妙收藏馆分馆导航"/);
    assert.match(html, /href="\/collections\/anime\/"/);
    assert.match(html, /href="\/collections\/games\/"/);
    assert.match(html, /href="\/collections\/figures\/"/);
    assert.match(html, /href="\/collections\/fufu\/"/);
    assert.match(html, /href="\/collections\/controllers\/"/);
    assert.match(html, /class="journey-navigation section-shell"/);
  }
});

test("keeps the former projects URL as a Logs compatibility page", async () => {
  const response = await render("/projects");
  assert.equal(response.status, 200);
  const html = await response.text();

  assert.match(html, /<title>世界线日志 · SEKAI<\/title>/i);
  assert.match(html, /id="project-overview"/);
  assert.match(html, /EP\.017/);
  assert.match(html, /id="ep-017"/);
  assert.match(html, /EP\.016/);
  assert.match(html, /id="ep-016"/);
  assert.match(html, /EP\.015/);
  assert.match(html, /id="ep-015"/);
  assert.match(html, /EP\.014/);
  assert.match(html, /id="ep-014"/);
  assert.match(html, /EP\.013/);
  assert.match(html, /id="ep-013"/);
  assert.match(html, /EP\.012/);
  assert.match(html, /id="ep-012"/);
  assert.match(html, /id="ep-011"/);
  assert.match(html, /id="ep-010"/);
  assert.match(html, /记录小世界的成长/);
  assert.doesNotMatch(html, />制作档案</);
});

test("keeps the former anime and games URLs as noindex canonical compatibility pages", async () => {
  const compatibilityRoutes = [
    {
      pathname: "/anime",
      title: /<title>动画收藏 · 奇妙收藏馆 · SEKAI<\/title>/i,
      copy: /看过的故事，也组成了我的世界/,
      canonicalPath: "/sekai-zero/collections/anime/",
    },
    {
      pathname: "/games",
      title: /<title>游戏收藏 · 奇妙收藏馆 · SEKAI<\/title>/i,
      copy: /玩过的世界，也值得收藏/,
      canonicalPath: "/sekai-zero/collections/games/",
    },
  ];

  for (const route of compatibilityRoutes) {
    const response = await render(route.pathname);
    assert.equal(response.status, 200, route.pathname);
    const html = await response.text();
    assert.match(html, route.title);
    assert.match(html, route.copy);
    assert.match(html, /<meta[^>]*name="robots"[^>]*content="[^"]*noindex[^"]*"/i);
    const canonicalMatch = html.match(/<link[^>]*rel="canonical"[^>]*href="([^"]+)"/i);
    assert.ok(canonicalMatch, `${route.pathname} should expose a canonical URL`);
    assert.equal(new URL(canonicalMatch[1]).pathname, route.canonicalPath);
  }
});

test("publishes the project overview and complete release history only in Logs", async () => {
  const response = await render("/logs");
  assert.equal(response.status, 200);
  const logs = await response.text();

  assert.match(logs, /id="project-overview"/);
  assert.match(logs, /关于 SEKAI \/ 00 的制作记录/);
  assert.match(logs, /SEKAI \/ 00 的制作选择与更新/);
  assert.match(logs, /18 EPISODES/);
  assert.match(logs, /项目公开入口/);
  assert.match(logs, /打开公开网站/);
  assert.match(logs, /查看 GitHub 仓库/);
  assert.match(logs, /https:\/\/github\.com\/miku-qaq\/sekai-zero/);
  assert.match(logs, /EP\.018/);
  assert.match(logs, /id="ep-018"/);
  assert.match(logs, /把开发桌面搬到 Mac/);
  assert.match(logs, /EP\.017/);
  assert.match(logs, /id="ep-017"/);
  assert.match(logs, /手办/);
  assert.match(logs, /EP\.016/);
  assert.match(logs, /id="ep-016"/);
  assert.match(logs, /让收藏馆切换不再打断参观/);
  assert.match(logs, /EP\.015/);
  assert.match(logs, /id="ep-015"/);
  assert.match(logs, /Fufu/);
  assert.match(logs, /EP\.014/);
  assert.match(logs, /id="ep-014"/);
  assert.match(logs, /奇妙收藏馆/);
  assert.match(logs, /EP\.013/);
  assert.match(logs, /id="ep-013"/);
  assert.match(logs, /让导航终端找回自己的名字/);
  assert.match(logs, /EP\.012/);
  assert.match(logs, /id="ep-012"/);
  assert.match(logs, /把游戏足迹与视觉学习接进收藏系统/);
  assert.match(logs, /EP\.011/);
  assert.match(logs, /id="ep-011"/);
  assert.match(logs, /把看过的动画铺成一面收藏墙/);
  assert.match(logs, /EP\.010/);
  assert.match(logs, /id="ep-010"/);
  assert.match(logs, /把网站内容重新交还给访客/);
  assert.match(logs, /EP\.001/);
  assert.match(logs, /id="ep-001"/);

  const episodeIds = [...logs.matchAll(/id="ep-(\d{3})"/g)].map((match) => match[1]);
  assert.equal(episodeIds.length, 18);
  assert.equal(new Set(episodeIds).size, episodeIds.length);
});

test("publishes the categorized directory with all confirmed destinations", async () => {
  const response = await render("/links");
  assert.equal(response.status, 200);
  const links = await response.text();

  assert.match(links, /id="route-bilibili"/);
  assert.match(links, /href="https:\/\/www\.bilibili\.com\/"/);
  assert.match(links, /哔哩哔哩 · Bilibili/);
  assert.match(links, /id="route-apple"/);
  assert.match(links, /href="https:\/\/www\.apple\.com\.cn\/"/);
  assert.match(links, /Apple 中国官网/);
  assert.match(links, /我喜欢 Apple 产品/);
  assert.match(links, /id="route-steam"/);
  assert.match(links, /href="https:\/\/store\.steampowered\.com\/"/);
  assert.match(links, /id="route-nintendo-switch"/);
  assert.match(
    links,
    /href="https:\/\/www\.nintendo\.com\/hk\/hardware\/switch\/index\.html"/,
  );
  assert.match(links, /Nintendo Switch 官方网站/);
  assert.match(links, /我最喜欢的游戏平台之一/);
  assert.match(links, /和 Steam 并列的最爱/);
  assert.match(links, /terminal-card-icon[^>]*>NS</);
  assert.match(links, /id="route-cs231n-course"/);
  assert.match(links, /href="https:\/\/cs231n\.stanford\.edu\/"/);
  assert.match(links, /CS224N 当前笔记/);
  assert.match(links, /https:\/\/github\.com\/miku-qaq\/sekai-zero/);
  assert.match(links, /https:\/\/web\.stanford\.edu\/class\/cs224n\//);
  assert.equal(links.match(/<a[^>]*id="route-/g)?.length, 16);
  for (const category of ["video", "games", "community", "shopping", "study", "site"]) {
    assert.match(links, new RegExp(`id="terminal-category-${category}"`));
  }
  for (const host of [
    "www.netflix.com",
    "www.xiaohongshu.com",
    "www.xiaoheihe.cn",
    "www.hpoi.net",
    "www.jd.com",
    "www.taobao.com",
    "www.pinduoduo.com",
  ]) {
    assert.ok(
      links.includes(`href="https://${host}/`),
      `${host} should be a real destination`,
    );
  }
  assert.doesNotMatch(links, /terminal-card-placeholder/);
  assert.doesNotMatch(links, /miku125194847@gmail\.com/);
});

test("keeps the Wonder Collection hub concise while linking all five rooms", async () => {
  const response = await render("/collections");
  assert.equal(response.status, 200);
  const html = await response.text();

  assert.match(html, /05 间/);
  assert.match(html, /261 条/);
  assert.match(html, /动画展柜/);
  assert.match(html, /游戏展柜/);
  assert.match(html, /手办收藏/);
  assert.match(html, /Fufu 收藏/);
  assert.match(html, /href="\/collections\/anime\/"/);
  assert.match(html, /href="\/collections\/games\/"/);
  assert.match(html, /href="\/collections\/figures\/"/);
  assert.match(html, /href="\/collections\/fufu\/"/);
  assert.match(html, /href="\/collections\/controllers\/"/);
  assert.match(html, /寅 2022 到 午 2026/);
  const visibleHtml = html.replaceAll("<!-- -->", "");
  assert.match(visibleHtml, /16 件/);
  assert.match(visibleHtml, /6 只毛绒/);
  assert.match(visibleHtml, /89 部已看/);
  assert.match(visibleHtml, /146 款记录/);

  // The hub is an overview, not a duplicate rendering of the full archives.
  assert.equal(html.match(/src="\/anime\/[^"]+\.webp"/g)?.length, 8);
  assert.equal(html.match(/src="\/games\/[^"]+\.webp"/g)?.length, 5);
  assert.doesNotMatch(html, /href="https:\/\/store\.steampowered\.com\/app\//);
});

test("publishes all 89 watched anime while initially rendering only 24 cards", async () => {
  const response = await render("/collections/anime");
  assert.equal(response.status, 200);
  const html = await response.text();
  const source = JSON.parse(
    await readFile(new URL("../content/anime-source.json", import.meta.url), "utf8"),
  );
  const catalog = JSON.parse(
    await readFile(new URL("../content/anime-catalog.json", import.meta.url), "utf8"),
  );

  assert.equal(source.length, 89);
  assert.equal(catalog.length, 89);
  assert.equal(new Set(source.map((entry) => entry.rawTitle)).size, 89);
  assert.equal(new Set(catalog.map((entry) => entry.id)).size, 89);
  assert.ok(catalog.every((entry) => !("aliases" in entry)));

  assert.match(html, /89 部/);
  assert.match(html, /MIKUREINA&#x27;S WONDER COLLECTION/);
  assert.match(html, /动画展柜/);
  assert.match(html, /游戏展柜/);
  assert.match(html, /手办收藏/);
  assert.match(html, /Fufu 收藏/);
  assert.match(html, /href="\/collections\/games\/"/);
  assert.match(html, /href="\/collections\/figures\/"/);
  assert.match(html, /href="\/collections\/fufu\/"/);
  assert.match(html, /href="\/collections\/controllers\/"/);
  assert.match(html.replaceAll("<!-- -->", ""), /已显示 <strong>24<\/strong> \/ 89 部/);
  assert.match(html, /剩余 (?:<!-- -->)?65(?:<!-- -->)? 部/);
  assert.match(html, /灵笼 上半季/);
  assert.match(html, /魔女之旅/);
  assert.match(html, /樱花庄的宠物女孩/);
  assert.doesNotMatch(html, /孤独摇滚！|命运石之门/);
  assert.match(html, /动画资料与封面来源/);
  assert.match(html, /封面与作品资料索引来自 Bangumi/);
  assert.doesNotMatch(html, /heart beats|时速5cm|作品名、别名|aliases/i);

  const covers = [...html.matchAll(/src="(\/anime\/[^"]+\.webp)"/g)].map(
    (match) => match[1],
  );
  assert.equal(covers.length, 24);
  for (const cover of covers) {
    await access(new URL(`../public${cover}`, import.meta.url));
  }
});

test("publishes 146 played Steam games while keeping private activity data local", async () => {
  const response = await render("/collections/games");
  assert.equal(response.status, 200);
  const html = await response.text();

  assert.match(html, /146 款/);
  assert.match(html, /146 张/);
  assert.match(html, /MIKUREINA&#x27;S WONDER COLLECTION/);
  assert.match(html, /动画展柜/);
  assert.match(html, /游戏展柜/);
  assert.match(html, /手办收藏/);
  assert.match(html, /Fufu 收藏/);
  assert.match(html, /href="\/collections\/anime\/"/);
  assert.match(html, /href="\/collections\/figures\/"/);
  assert.match(html, /href="\/collections\/fufu\/"/);
  assert.match(html, /href="\/collections\/controllers\/"/);
  assert.match(html, /我的 Steam 游玩记录/);
  assert.match(html, /玩过 \/ 不排名/);
  assert.match(html, /游戏名称与封面版权归各自权利方所有/);
  assert.match(html, /Nintendo Switch 收藏待补充/);
  assert.match(html, /正在整理中/);
  assert.match(html, /https:\/\/store\.steampowered\.com\/app\//);

  // Privacy disclosures may explain what is withheld, but no private field or
  // Steam account value may be serialized into the public document.
  assert.doesNotMatch(
    html,
    /"(?:playtime|lastPlayed|accountId|steamId|friends|token|auth|userdata)"\s*:/i,
  );
  assert.doesNotMatch(html, /\b(?:data-)?(?:playtime|lastplayed|accountid|steamid)=/i);
  assert.doesNotMatch(html, /\b7656119\d{10}\b/);
  assert.doesNotMatch(html, /STEAM \/ APP\s+\d+/i);
});

test("publishes 16 product-matched figures with stable archive numbers", async () => {
  const response = await render("/collections/figures");
  assert.equal(response.status, 200);
  const html = await response.text();
  const visibleHtml = html.replaceAll("<!-- -->", "");

  assert.match(html, /展柜收藏<\/dt><dd>16 件<\/dd>/);
  assert.match(html, /初音未来<\/dt><dd>06 件<\/dd>/);
  assert.match(html, /款式配图<\/dt><dd>16 \/ 16<\/dd>/);
  assert.match(html, /aria-label="16 件手办收藏"/);
  assert.equal(html.match(/id="figure-\d{3}-title"/g)?.length, 16);
  assert.doesNotMatch(html, /id="figure-003-title"/);
  assert.deepEqual(
    [...html.matchAll(/id="figure-(\d{3})-title"/g)].map((match) => match[1]),
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
    [...visibleHtml.matchAll(/FIG \/ (\d{3})/g)].map((match) => match[1]),
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
  assert.match(html, /href="\/collections\/fufu\/"/);
  assert.match(html, /href="\/collections\/controllers\/"/);
  assert.match(html, /搜索角色、作品或款式/);
  assert.match(html, /aria-label="筛选手办角色"/);
  assert.match(visibleHtml, /当前展示 <strong>16<\/strong> \/\s*总计 16 件/);
  assert.match(html, /初音未来/);
  assert.match(html, /伊蕾娜/);
  assert.match(html, /芙莉莲/);
  assert.match(html, /Angel Beats!/);
  assert.doesNotMatch(html, /款式已核对<\/p>/);
  assert.equal(html.match(/src="\/figures\/figure-\d{3}\.webp"/g)?.length, 16);
  assert.equal(html.match(/aria-haspopup="dialog"/g)?.length, 16);
  assert.match(html, /超天酱/);
  assert.match(html, /商品展示图 · 非本人实拍/);
  assert.doesNotMatch(html, /角色待确认|NEEDS CONFIRMATION|PUBLIC \/ 01|PRIVATE \/ 02/);
  assert.doesNotMatch(html, /NEXT \/ 03[^]{0,160}本人拍摄的实物照片/);

  // Boundary copy may name withheld field categories. Actual financial,
  // order and date values must never be serialized into the public document.
  assert.doesNotMatch(html, /\b\d+(?:\.\d{1,2})?\s*(?:人民币|元|CNY|RMB)\b/i);
  assert.doesNotMatch(html, /[¥￥]\s*\d/);
  assert.doesNotMatch(html, /\b(?:19|20)\d{2}[/-]\d{1,2}(?:[/-]\d{1,2})?\b/);
  assert.doesNotMatch(html, /(?:order|订单)[-_:#：\s]*[A-Z0-9]{6,}/i);
  assert.doesNotMatch(html, /<time\b|data-(?:price|order|date|purchased-at)=/i);
});

test("publishes the six owner-confirmed Fufu with formal names and no transaction values", async () => {
  const response = await render("/collections/fufu");
  assert.equal(response.status, 200);
  const html = await response.text();

  assert.match(html, /<title>Fufu 收藏 · 奇妙收藏馆 · SEKAI<\/title>/i);
  assert.match(html, /从寅 2022/);
  assert.match(html, /本人收藏<\/dt><dd>06 只<\/dd>/);
  assert.match(html, /aria-label="5 只生肖 Fufu 收藏"/);
  assert.equal(html.match(/id="(?:figure-003|fufu-zodiac-[^"]+)-title"/g)?.length, 6);
  assert.match(html, /id="figure-003-title"/);
  assert.match(
    html,
    /初音ミクシリーズ\u3000初音ミク\u3000ふわぷち\u3000どでかジャンボぬいぐるみ/,
  );
  assert.match(html, /初音ミク\u3000寅2022\u3000ふわふわぬいぐるみ\(LL\)/);
  assert.match(html, /初音ミク\u3000卯2023\u3000ふわぷち\u3000ぬいぐるみ（LL）/);
  assert.match(html, /初音ミク\u3000辰2024\u3000ふわぷち\u3000ぬいぐるみ（LL）/);
  assert.match(html, /初音ミク\u3000巳2025\u3000ふわぷち\u3000ぬいぐるみ（ＬＬ）/);
  assert.match(html, /初音ミク\u3000午2026\u3000ふわぷち\u3000ぬいぐるみ（LL）/);
  assert.match(html, /商品卡保留 SEGA 公布的正式名称/);
  assert.equal(html.match(/<img[^>]+src="\/fufu\/[^"]+\.webp"/g)?.length, 6);
  assert.match(html, /SEGA 官方商品图 · 非本人实拍/);
  assert.match(html, /href="https:\/\/segaplaza\.jp\/goods\/120696\/"/);
  assert.match(html, /href="https:\/\/info\.miku\.sega\.jp\/16431"/);
  assert.match(html, /href="https:\/\/info\.miku\.sega\.jp\/17297"/);
  assert.match(html, /href="https:\/\/segaplaza\.jp\/goods\/120142\/"/);
  assert.match(html, /href="https:\/\/segaplaza\.jp\/goods\/120683\/"/);
  assert.match(html, /href="https:\/\/segaplaza\.jp\/goods\/120684\/"/);
  assert.match(html, /href="\/collections\/figures\/"/);

  const canonicalMatch = html.match(/<link[^>]*rel="canonical"[^>]*href="([^"]+)"/i);
  assert.ok(canonicalMatch, "the Fufu room should expose a canonical URL");
  assert.equal(new URL(canonicalMatch[1]).pathname, "/sekai-zero/collections/fufu/");

  // Years identify the zodiac editions. Prices, order identifiers and full
  // transaction dates remain private and must not appear as public values.
  assert.doesNotMatch(html, /\b\d+(?:\.\d{1,2})?\s*(?:人民币|元|CNY|RMB)\b/i);
  assert.doesNotMatch(html, /[¥￥]\s*\d/);
  assert.doesNotMatch(html, /\b(?:19|20)\d{2}[/-]\d{1,2}(?:[/-]\d{1,2})?\b/);
  assert.doesNotMatch(html, /(?:order|订单)[-_:#：\s]*[A-Z0-9]{6,}/i);
  assert.doesNotMatch(html, /<time\b|data-(?:price|order|date|purchased-at)=/i);
});

test("renders current CS224N plus a bounded CS231n review with official sources", async () => {
  const response = await render("/study");
  assert.equal(response.status, 200);
  const html = await response.text();

  assert.match(html, /AI · 视觉与语言/);
  assert.match(html, /CURRENTLY LEARNING/);
  assert.match(html, /NOTE \/ NLP-001/);
  assert.match(html, /id="cs224n-nlp-word-vectors"/);
  assert.match(html, /data-current="true"/);
  assert.equal(html.match(/data-current="true"/g)?.length, 1);
  assert.match(html, /CS224N 学习笔记 01：词语如何进入向量空间/);
  assert.match(html, /Skip-gram 究竟在预测什么/);
  assert.match(html, /不代表 Stanford 的正式选课、学籍或结课证明/);
  assert.match(html, /https:\/\/web\.stanford\.edu\/class\/cs224n\//);
  assert.match(
    html,
    /https:\/\/web\.stanford\.edu\/class\/cs224n\/slides_w26\/cs224n-2026-lecture02-wordvecs\.pdf/,
  );
  assert.match(html, /id="cs231n-image-classification-data-driven"/);
  assert.match(html, /NOTE \/ CV-001/);
  assert.match(html, /CS231n 学习回顾 01：图像分类为什么要从数据出发/);
  assert.match(html, /曾学习 · 回顾/);
  assert.match(html, /我之前学习过 Stanford CS231n 的公开课程资料/);
  assert.match(html, /不是结课证明或进度汇报/);
  assert.match(html, /https:\/\/cs231n\.stanford\.edu\//);
  assert.match(html, /https:\/\/cs231n\.stanford\.edu\/slides\/2026\/lecture_2\.pdf/);
  assert.match(html, /https:\/\/cs231n\.github\.io\/convolutional-networks\//);
  assert.doesNotMatch(html, /learning-queue/);
});

test("publishes only the owner-confirmed profile and one direct contact entry", async () => {
  const aboutResponse = await render("/about");
  assert.equal(aboutResponse.status, 200);
  const about = await aboutResponse.text();

  assert.match(about, /Mikureina/);
  assert.match(about, /南京大学 · CS 在读/);
  assert.match(about, /动漫/);
  assert.match(about, /游戏/);
  assert.match(about, /Nintendo Switch/);
  assert.match(about, /Steam/);
  assert.match(about, /miku125194847@gmail\.com/);
  assert.match(about, /href="mailto:miku125194847@gmail\.com"/);
  for (const character of ["miku", "elaina", "bocchi"]) {
    assert.match(about, new RegExp(`href="/characters/${character}-v1\\.webp"`));
  }
  assert.match(about, /sekai-friends-wide\.webp/);
  assert.doesNotMatch(about, /称呼、职业、所在地等现实信息尚未由主人公开/);

  const [homepageResponse, linksResponse] = await Promise.all([
    render("/"),
    render("/links"),
  ]);
  const [homepage, links] = await Promise.all([
    homepageResponse.text(),
    linksResponse.text(),
  ]);
  assert.doesNotMatch(homepage, /miku125194847@gmail\.com/);
  assert.doesNotMatch(links, /miku125194847@gmail\.com/);
  assert.match(links, /联系 Mikureina/);
  assert.match(links, /href="\/about\/#contact"/);
});

test("keeps navigation, deep links and playful interactions within safe boundaries", async () => {
  const [
    page,
    siteContent,
    packageJson,
    header,
    layout,
    share,
    gacha,
    studyNotebook,
    studyContent,
    projectsPage,
    projectsContent,
    animeCompatibilityPage,
    gamesCompatibilityPage,
    collectionsContent,
    figuresContent,
    figuresPage,
    figureCatalog,
    fufuContent,
    fufuPage,
    animeCatalogComponent,
    gameCatalogComponent,
    sitePaths,
    profileContent,
    releasesContent,
    nowContent,
    journeyNavigation,
    pageMasthead,
    worldMap,
    linkTerminal,
    linksContent,
    favoriteChannelsComponent,
    collectionNavigation,
    collectionLink,
    collectionsPage,
    viteConfig,
  ] = await Promise.all([
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
    readFile(new URL("../app/components/study-notebook.tsx", import.meta.url), "utf8"),
    readFile(new URL("../content/study.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/projects/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../content/projects.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/anime/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/games/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../content/collections.ts", import.meta.url), "utf8"),
    readFile(new URL("../content/figures.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/collections/figures/page.tsx", import.meta.url), "utf8"),
    readFile(
      new URL("../app/collections/figures/figure-catalog.tsx", import.meta.url),
      "utf8",
    ),
    readFile(new URL("../content/fufu.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/collections/fufu/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/collections/anime-catalog.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/collections/game-catalog.tsx", import.meta.url), "utf8"),
    readFile(new URL("../lib/site-path.ts", import.meta.url), "utf8"),
    readFile(new URL("../content/profile.ts", import.meta.url), "utf8"),
    readFile(new URL("../content/releases.ts", import.meta.url), "utf8"),
    readFile(new URL("../content/now.ts", import.meta.url), "utf8"),
    readFile(
      new URL("../app/components/journey-navigation.tsx", import.meta.url),
      "utf8",
    ),
    readFile(new URL("../app/components/page-masthead.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/world-map.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/link-terminal.tsx", import.meta.url), "utf8"),
    readFile(new URL("../content/links.ts", import.meta.url), "utf8"),
    readFile(
      new URL("../app/components/favorite-channels.tsx", import.meta.url),
      "utf8",
    ),
    readFile(
      new URL("../app/collections/collection-navigation.tsx", import.meta.url),
      "utf8",
    ),
    readFile(
      new URL("../app/collections/collection-link.tsx", import.meta.url),
      "utf8",
    ),
    readFile(new URL("../app/collections/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../vite.config.ts", import.meta.url), "utf8"),
  ]);

  assert.match(siteContent, /export const worldRoutes/);
  assert.match(siteContent, /href: "\/about\/"/);
  assert.match(siteContent, /href: "\/collections\/"/);
  assert.match(siteContent, /href: "\/study\/"/);
  assert.match(siteContent, /href: "\/links\/"/);
  assert.match(siteContent, /href: "\/logs\/"/);
  assert.doesNotMatch(siteContent, /href: "\/(?:anime|games|projects)\/"/);
  assert.match(siteContent, /favoriteChannels/);
  assert.match(siteContent, /dimensionalFortunes/);
  assert.match(siteContent, /href: "\/logs\/#project-overview"/);
  assert.match(packageJson, /"name": "sekai-zero-personal-site"/);
  assert.doesNotMatch(page, /Roadmap|featuredContent|fieldNotes/);
  assert.doesNotMatch(page, /SkeletonPreview|codex-preview/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton|drizzle-kit/);

  assert.match(header, /siteConfig\.navigation\.map/);
  assert.match(header, /sitePath\(item\.href\)/);
  assert.match(header, /hidden=\{!menuOpen\}/);
  assert.match(header, /event\.key === "Escape"/);
  assert.match(header, /aria-current/);
  assert.match(header, /function isCurrentNavigationPath/);
  assert.match(header, /currentPath\.startsWith\(`\$\{targetPath\}\/`\)/);
  assert.match(header, /href === "\/collections\/"/);
  assert.match(header, /\/\(\?:anime\|games\)\$/);
  assert.match(header, /return "light"/);
  assert.match(layout, /themeInitializationScript/);
  assert.match(layout, /data-theme="light"/);
  assert.match(layout, /sekai-channel/);
  assert.match(layout, /subpages\.css/);
  assert.match(share, /manualUrl/);
  assert.match(share, /aria-live="polite"/);
  assert.match(gacha, /Math\.random/);
  assert.match(gacha, /aria-atomic="true"/);

  // Initial Study deep links reveal content without an unexpected smooth jump;
  // later user-driven hash changes may animate unless reduced motion is enabled.
  assert.match(studyNotebook, /syncHashTarget\("auto"\)/);
  assert.match(studyNotebook, /handleHashChange = \(\) => syncHashTarget\("smooth"\)/);
  assert.match(studyNotebook, /setFilter\("all"\)/);
  assert.match(studyNotebook, /setQuery\(""\)/);
  assert.match(studyNotebook, /target\.open = true/);
  assert.match(studyNotebook, /target\.scrollIntoView/);
  assert.match(studyNotebook, /HTMLDetailsElement/);
  assert.match(studyNotebook, /navigator\.clipboard\.writeText/);
  assert.match(studyNotebook, /sitePath\("\/study\/#archive-title"\)/);
  assert.match(studyContent, /not course completion or formal/);
  assert.match(studyContent, /category: "ai"/);
  assert.match(studyContent, /current: true/);
  assert.match(studyContent, /publisher: "Stanford University"/);

  // Compatibility URLs remain readable without becoming public navigation
  // destinations or competing with their canonical pages in search.
  assert.match(projectsPage, /import LogsPage from "\.\.\/logs\/page"/);
  assert.match(
    projectsPage,
    /alternates: \{ canonical: absoluteSiteUrl\("logs\/"\) \}/,
  );
  assert.match(projectsPage, /robots: \{ index: false, follow: true \}/);
  assert.match(
    animeCompatibilityPage,
    /import CollectionsAnimePage from "\.\.\/collections\/anime\/page"/,
  );
  assert.match(
    animeCompatibilityPage,
    /alternates: \{ canonical: absoluteSiteUrl\("collections\/anime\/"\) \}/,
  );
  assert.match(
    gamesCompatibilityPage,
    /import CollectionsGamesPage from "\.\.\/collections\/games\/page"/,
  );
  assert.match(
    gamesCompatibilityPage,
    /alternates: \{ canonical: absoluteSiteUrl\("collections\/games\/"\) \}/,
  );
  assert.match(animeCompatibilityPage, /robots: \{ index: false, follow: true \}/);
  assert.match(gamesCompatibilityPage, /robots: \{ index: false, follow: true \}/);
  assert.match(projectsContent, /not a claim about traffic, clients, revenue/);
  assert.doesNotMatch(projectsContent, /WAITING FOR VERIFIED WORK/);
  assert.doesNotMatch(projectsContent, /访问量|收入|客户评价|转化率/);

  // Every internal URL passes through the base-path helper so GitHub Pages and
  // root-domain builds share one content model.
  assert.match(sitePaths, /NEXT_PUBLIC_BASE_PATH/);
  assert.match(sitePaths, /const basePath = segment \? `\/\$\{segment\}` : ""/);
  assert.match(sitePaths, /pathname\.startsWith\("#"\)/);
  assert.match(profileContent, /Owner-confirmed public profile data/);
  assert.match(profileContent, /handle: "Mikureina"/);
  assert.match(profileContent, /academicStatus: "南京大学 · CS 在读"/);
  assert.match(profileContent, /email: "miku125194847@gmail\.com"/);
  assert.match(releasesContent, /episode: "EP\.018"/);
  assert.match(releasesContent, /MACOS HANDOFF \/ READY/);
  assert.match(releasesContent, /episode: "EP\.017"/);
  assert.match(releasesContent, /手办/);
  assert.match(releasesContent, /episode: "EP\.016"/);
  assert.match(releasesContent, /COLLECTION SPA NAVIGATION/);
  assert.match(releasesContent, /episode: "EP\.015"/);
  assert.match(releasesContent, /Fufu/);
  assert.match(releasesContent, /episode: "EP\.014"/);
  assert.match(releasesContent, /奇妙收藏馆/);
  assert.match(releasesContent, /episode: "EP\.012"/);
  assert.match(releasesContent, /GAMES \/ 146 · CV-001/);
  assert.match(releasesContent, /episode: "EP\.011"/);
  assert.match(releasesContent, /ANIME COLLECTION \/ 89/);
  assert.match(releasesContent, /episode: "EP\.010"/);
  assert.match(releasesContent, /VISITOR-FIRST CONTENT/);
  assert.match(nowContent, /LEARNING \/ NLP-001/);
  assert.match(nowContent, /GAMES \/ NS \+ STEAM/);
  assert.match(nowContent, /FAVORITE \/ VIDEO/);
  assert.doesNotMatch(nowContent, /EP\.010|最近更新/);

  assert.match(collectionsContent, /href: "\/collections\/anime\/"/);
  assert.match(collectionsContent, /href: "\/collections\/games\/"/);
  assert.match(collectionsContent, /href: "\/collections\/figures\/"/);
  assert.match(collectionsContent, /href: "\/collections\/fufu\/"/);
  assert.match(collectionsContent, /count: animeCatalog\.length/);
  assert.match(collectionsContent, /count: gameCatalog\.length/);
  assert.match(collectionsContent, /count: figureCollection\.length/);
  assert.match(collectionsContent, /count: fufuCollection\.length/);
  assert.match(collectionLink, /^"use client";/);
  assert.match(collectionLink, /import Link from "next\/link"/);
  assert.match(collectionLink, /legacyBehavior/);
  assert.match(collectionLink, /href=\{sitePath\(href\)\}/);
  assert.doesNotMatch(collectionLink, /window\.location|location\.assign/);
  assert.match(collectionNavigation, /import \{ CollectionLink \}/);
  assert.match(collectionNavigation, /href=\{room\.href\}/);
  assert.match(collectionNavigation, /scroll=\{false\}/);
  assert.doesNotMatch(collectionNavigation, /<a\b/);
  assert.match(collectionsPage, /import \{ CollectionLink \}/);
  assert.doesNotMatch(collectionsPage, /<a[^>]+href=\{sitePath\([^)]*collections/);
  assert.match(viteConfig, /process\.env\.__NEXT_ROUTER_BASEPATH/);
  assert.match(viteConfig, /process\.env\.__VINEXT_TRAILING_SLASH/);
  assert.match(viteConfig, /process\.env\.NEXT_PUBLIC_BASE_PATH/);
  const figureCollectionSource = figuresContent.match(
    /export const figureCollection:[^=]+ = \[([^]*?)\] as const;/,
  );
  assert.ok(figureCollectionSource, "figures.ts should expose the typed collection");
  assert.equal(figuresContent.match(/id: "figure-\d{3}"/g)?.length, 16);
  assert.doesNotMatch(figuresContent, /id: "figure-003"/);
  assert.equal(figureCollectionSource[1].match(/character: "初音未来"/g)?.length, 6);
  assert.equal(
    figureCollectionSource[1].match(/verification: "product-confirmed"/g)?.length,
    16,
  );
  assert.equal(
    figureCollectionSource[1].match(/image: "\/figures\/figure-\d{3}\.webp"/g)?.length,
    16,
  );
  assert.match(figuresContent, /work: string;/);
  assert.match(figuresContent, /product: FigureProductDetails;/);
  assert.match(
    figuresContent,
    /id: "figure-017"[^]*?character: "初音未来"[^]*?work: "初音未来"/,
  );
  assert.doesNotMatch(
    figuresContent,
    /verification: "pending"|character: "角色待确认"|format: "待确认"/,
  );
  assert.match(figuresPage, /<FigureCatalog \/>/);
  assert.doesNotMatch(figuresPage, /PUBLIC \/ 01|PRIVATE \/ 02|NEXT \/ 03/);
  assert.match(figureCatalog, /^"use client";/);
  assert.match(figureCatalog, /id\.replace\("figure-", ""\)/);
  assert.match(figureCatalog, /FIG \/ \{number\}/);
  assert.doesNotMatch(figureCatalog, /index \+ 1|角色待确认|NEEDS CONFIRMATION/);
  assert.equal(fufuContent.match(/id: "(?:figure-003|fufu-zodiac-[^"]+)"/g)?.length, 6);
  assert.equal(fufuContent.match(/id: "figure-003"/g)?.length, 1);
  assert.match(fufuContent, /初音ミク\u3000寅2022\u3000ふわふわぬいぐるみ\(LL\)/);
  assert.match(
    fufuContent,
    /初音ミク\u3000巳2025\u3000ふわぷち\u3000ぬいぐるみ（ＬＬ）/,
  );
  assert.match(fufuContent, /初音ミク\u3000午2026\u3000ふわぷち\u3000ぬいぐるみ（LL）/);
  assert.doesNotMatch(
    fufuContent,
    /^\s*(?:price|cost|amount|currency|order|orderId|purchaseDate|purchasedAt|shop|batch):/im,
  );
  assert.match(fufuPage, /export const dynamic = "force-static"/);
  assert.match(
    fufuPage,
    /alternates: \{ canonical: absoluteSiteUrl\("collections\/fufu\/"\) \}/,
  );
  assert.match(fufuPage, /<CollectionNavigation current="fufu" \/>/);
  assert.match(animeCatalogComponent, /const PAGE_SIZE = 24/);
  assert.match(animeCatalogComponent, /visibleEntries\.slice\(0, visibleLimit\)/);
  assert.match(gameCatalogComponent, /const PAGE_SIZE = 24/);
  assert.match(gameCatalogComponent, /filteredGames\.slice\(0, visibleLimit\)/);

  // Mastheads, page hand-offs and homepage cards all derive from one registry.
  assert.match(pageMasthead, /worldRoutes\.find/);
  assert.match(pageMasthead, /currentHref: WorldRouteHref/);
  assert.match(pageMasthead, /route\.eyebrow/);
  assert.match(pageMasthead, /route\.motif/);
  assert.match(pageMasthead, /subpageLabel/);
  assert.match(journeyNavigation, /worldRoutes\.findIndex/);
  assert.match(journeyNavigation, /currentHref: WorldRouteHref/);
  assert.match(journeyNavigation, /worldRoutes\[currentIndex\]\.navLabel/);
  assert.match(worldMap, /worldRoutes\.map/);
  assert.match(worldMap, /sitePath\(route\.href\)/);

  // Random recommendation only highlights and scrolls to a card. Opening the
  // destination remains an explicit visitor action on the rendered anchor.
  assert.match(linkTerminal, /function recommendRandomEntry\(\)/);
  assert.match(linkTerminal, /setRecommendedId\(entry\.id\)/);
  assert.match(linkTerminal, /card\?\.scrollIntoView/);
  assert.match(linkTerminal, /data-recommended=/);
  assert.doesNotMatch(
    linkTerminal,
    /window\.open|window\.location|location\.assign|location\.href/,
  );
  assert.match(linksContent, /id: "bilibili"/);
  assert.match(linksContent, /id: "apple"/);
  assert.match(linksContent, /export const linkCategories/);

  // Character portraits keep theme selection and useful destination links,
  // without simulated connection or synchronization status.
  assert.match(favoriteChannelsComponent, /sekai-channel/);
  assert.match(favoriteChannelsComponent, /active\.image/);
  assert.match(favoriteChannelsComponent, /active\.program\.href/);
  assert.match(favoriteChannelsComponent, /aria-pressed=\{selected\}/);
  assert.doesNotMatch(favoriteChannelsComponent, /active\.sync|role="meter"/);
});

test("publishes exactly the four owner-confirmed controllers with local product images", async () => {
  const response = await render("/collections/controllers");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /收藏手柄<\/dt><dd>04 只<\/dd>/);
  assert.match(html, /品牌<\/dt><dd>03 个<\/dd>/);
  assert.match(html, /角色联名<\/dt><dd>01 款<\/dd>/);
  assert.match(html, /aria-label="4 只手柄收藏"/);
  assert.equal(html.match(/<h3[^>]*id="controller-[^"]+-title"/g)?.length, 4);
  assert.equal(html.match(/src="\/controllers\/[^"\s]+\.webp"/g)?.length, 4);
  assert.equal(html.match(/aria-haspopup="dialog"/g)?.length, 4);
  for (const name of [
    "Xbox 无线手柄",
    "Series X|S 标准款 · 碳黑",
    "Nintendo Switch Pro 手柄",
    "Nintendo Switch 2 Pro 手柄",
    "飞智八爪鱼 4",
    "《原神》八重神子联名版",
  ])
    assert.ok(html.includes(name));
  assert.match(html, /商品展示图 · 非本人实拍/);
  assert.doesNotMatch(html, /[¥￥]\s*\d|data-(?:price|order|date|purchased-at)=/i);
});
