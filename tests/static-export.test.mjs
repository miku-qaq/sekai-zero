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
      path: "collections/gallery/index.html",
      title: /<title>收藏画册 · 奇妙收藏馆 · SEKAI<\/title>/i,
    },
    {
      path: "collections/controllers/index.html",
      title: /<title>手柄收藏 · 奇妙收藏馆 · SEKAI<\/title>/i,
    },
    {
      path: "collections/devices/index.html",
      title: /<title>设备收藏 · 奇妙收藏馆 · SEKAI<\/title>/i,
    },
    {
      path: "collections/headphones/index.html",
      title: /<title>耳机收藏 · 奇妙收藏馆 · SEKAI<\/title>/i,
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
  assert.equal(pages.length, 17, "Pages should expose exactly 17 public routes");

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
  assert.match(homepage, new RegExp(`src="${basePath}/hero-anime-v3\\.webp"`));
  assert.match(homepage, /Mikureina/);
  assert.match(homepage, /南京大学 CS 在读/);
  assert.match(homepage, /大模型分布式训练系统/);
  assert.match(homepage, /我的三位二次元老婆/);
  assert.match(homepage, /初音未来/);
  assert.match(homepage, /伊蕾娜/);
  assert.match(homepage, /波奇/);
  assert.match(homepage, /03 \/ FAVORITES/);
  assert.match(homepage, /BONUS \/ GACHA/);
  assert.match(homepage, /抽一张今天的次元签/);
  assert.match(
    homepage,
    new RegExp(`href="${basePath}/study/#distributed-training-transformer-tp"`),
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
  assert.match(about, /学习与收藏/);
  assert.match(about, new RegExp(`href="${basePath}/collections/"`));

  const study = exported.get("study/index.html");
  assert.match(study, /大模型分布式训练系统/);
  assert.match(study, /大模型系统/);
  for (const chapter of [
    "transformer-tp",
    "collectives",
    "parallelism",
    "moe",
    "parallel-folding",
    "auto-parallel",
    "engineering",
    "questions",
  ]) {
    const id = `distributed-training-${chapter}`;
    assert.match(study, new RegExp(`<details\\b[^>]*id="${id}"`));
    assert.match(study, new RegExp(`href="(?:${basePath}/study/)?#${id}"`));
  }
  assert.match(
    study,
    /<details[^>]*id="distributed-training-transformer-tp"[^>]*data-current="true"/,
  );
  assert.equal(study.match(/data-current="true"/g)?.length, 1);
  assert.match(study, /MoE Parallel Folding: Heterogeneous Parallelism Mappings/);
  assert.match(
    study,
    /如何在 NVIDIA GPU 与 Ascend NPU 平台上开展可重复的分布式训练性能实验？/,
  );
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
  assert.match(collections, /07 间/);
  assert.match(collections, /269 条/);
  assert.match(collections, /动画展柜/);
  assert.match(collections, /游戏展柜/);
  assert.match(collections, /手办收藏/);
  assert.match(collections, /Fufu 收藏/);
  assert.match(collections, /手柄收藏/);
  assert.match(collections, /设备收藏/);
  assert.match(collections, /耳机收藏/);
  assert.match(collections, new RegExp(`href="${basePath}/collections/headphones/"`));
  assert.match(collections, new RegExp(`href="${basePath}/collections/devices/"`));
  assert.match(collections, new RegExp(`href="${basePath}/collections/controllers/"`));
  assert.match(collections, new RegExp(`href="${basePath}/collections/anime/"`));
  assert.match(collections, new RegExp(`href="${basePath}/collections/games/"`));
  assert.match(collections, new RegExp(`href="${basePath}/collections/figures/"`));
  assert.match(collections, new RegExp(`href="${basePath}/collections/fufu/"`));
  assert.match(collections, /寅 2022 到 午 2026/);
  const visibleCollections = collections.replaceAll("<!-- -->", "");
  assert.match(visibleCollections, /16 件/);
  assert.match(visibleCollections, /6 只毛绒/);
  assert.equal(
    collections.match(new RegExp(`src="${basePath}/anime/[^"]+\\.webp"`, "g"))?.length,
    8,
  );
  assert.equal(
    collections.match(new RegExp(`src="${basePath}/games/[^"]+\\.webp"`, "g"))?.length,
    5,
  );
  assert.doesNotMatch(collections, /https:\/\/store\.steampowered\.com\/app\//);

  for (const theme of ["miku", "journeys", "from-screen"]) {
    assert.match(
      collections,
      new RegExp(`href="${basePath}/collections/gallery/\\?exhibit=${theme}"`),
    );
  }
  const gallery = exported.get("collections/gallery/index.html");
  assert.match(gallery, /aria-label="画册分类"/);
  assert.match(gallery, /搜索收藏画册/);
  assert.equal((gallery.match(/aria-label="查看[^"]+大图"/g) ?? []).length, 24);
  assert.match(gallery, new RegExp(`href="${basePath}/collections/"`));

  const anime = exported.get("collections/anime/index.html");
  assert.match(anime, /89 部/);
  assert.match(anime, /MIKUREINA&#x27;S WONDER COLLECTION/);
  assert.match(anime, new RegExp(`href="${basePath}/collections/games/"`));
  assert.match(anime, new RegExp(`href="${basePath}/collections/figures/"`));
  assert.match(anime, new RegExp(`href="${basePath}/collections/fufu/"`));
  assert.match(
    anime.replaceAll("<!-- -->", ""),
    /已显示 <strong>24<\/strong> \/ 89 部/,
  );
  assert.match(anime, /剩余 (?:<!-- -->)?65(?:<!-- -->)? 部/);
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
  assert.match(games, /146 张/);
  assert.match(games, /MIKUREINA&#x27;S WONDER COLLECTION/);
  assert.match(games, new RegExp(`href="${basePath}/collections/anime/"`));
  assert.match(games, new RegExp(`href="${basePath}/collections/figures/"`));
  assert.match(games, new RegExp(`href="${basePath}/collections/fufu/"`));
  assert.match(games, /我的 Steam 游玩记录/);
  assert.match(games, /玩过 \/ 不排名/);
  assert.match(games, /Nintendo Switch 收藏待补充/);
  assert.match(games, /正在整理中/);
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
  assert.match(figures, /展柜收藏<\/dt><dd>16 件<\/dd>/);
  assert.match(figures, /初音未来<\/dt><dd>06 件<\/dd>/);
  assert.match(figures, /其他角色<\/dt><dd>10 件<\/dd>/);
  assert.match(figures, /aria-label="16 件手办收藏"/);
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
  assert.match(figures, /搜索角色、作品或款式/);
  assert.match(figures, /aria-label="筛选手办角色"/);
  assert.match(figures, /初音未来/);
  assert.match(figures, /伊蕾娜/);
  assert.match(figures, /芙莉莲/);
  assert.match(figures, /Angel Beats!/);
  assert.doesNotMatch(figures, /款式已核对<\/p>/);
  assert.equal(
    [
      ...figures.matchAll(
        new RegExp(`src="${basePath}/figures/figure-\\d{3}\\.webp"`, "g"),
      ),
    ].length,
    16,
  );
  assert.match(figures, /超天酱/);
  assert.match(figures, /图片与资料/);
  assert.match(figures, /厂商与商品资料页/);
  assert.doesNotMatch(figures, /非本人实拍/);
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

  const controllers = exported.get("collections/controllers/index.html");
  assert.match(controllers, /aria-label="4 只手柄收藏"/);
  assert.equal(controllers.match(/<h3[^>]*id="controller-[^"]+-title"/g)?.length, 4);
  assert.equal(
    controllers.match(new RegExp(`src="${basePath}/controllers/[^"\\s]+\\.webp"`, "g"))
      ?.length,
    4,
  );
  assert.match(controllers, /Series X\|S 标准款 · 碳黑/);
  assert.match(controllers, /Nintendo Switch 2 Pro 手柄/);
  assert.match(controllers, /《原神》八重神子联名版/);
  assert.match(controllers, /图片与资料/);
  assert.match(controllers, /Xbox · Nintendo · WHOTAO/);
  assert.doesNotMatch(controllers, /非本人实拍/);
  assert.doesNotMatch(
    controllers,
    /[¥￥]\s*\d|data-(?:price|order|date|purchased-at)=/i,
  );

  const devices = exported.get("collections/devices/index.html");
  assert.match(devices, /日常与游戏，都有它们。/);
  assert.match(devices, /aria-label="4 件设备收藏"/);
  assert.match(devices, /aria-label="设备品牌"/);
  assert.match(devices, /<button\b[^>]*aria-pressed="true"[^>]*>全部<\/button>/);
  for (const brand of ["Apple", "Nintendo"]) {
    assert.match(devices, new RegExp(`<button\\b[^>]*>${brand}<\\/button>`));
    assert.match(devices.replaceAll("<!-- -->", ""), new RegExp(`${brand} 官方`));
  }
  assert.deepEqual(
    [...devices.matchAll(/<h3[^>]*id="(device-[^"]+)-title"/g)].map(
      (match) => match[1],
    ),
    [
      "device-nintendo-switch",
      "device-nintendo-switch-2",
      "device-iphone-17-pro",
      "device-ipad-pro-m5",
    ],
  );
  for (const [id, title] of [
    ["device-nintendo-switch", "Nintendo Switch"],
    ["device-nintendo-switch-2", "Nintendo Switch 2"],
    ["device-iphone-17-pro", "iPhone 17 Pro"],
    ["device-ipad-pro-m5", "iPad Pro"],
  ]) {
    assert.match(devices, new RegExp(`<h3[^>]*id="${id}-title">${title}<\\/h3>`));
  }
  assert.match(devices, /aria-label="奇妙收藏馆分馆导航"/);
  for (const room of [
    "anime",
    "games",
    "figures",
    "fufu",
    "controllers",
    "devices",
    "headphones",
  ]) {
    assert.match(devices, new RegExp(`href="${basePath}/collections/${room}/"`));
  }
  assert.match(
    devices,
    new RegExp(`href="${basePath}/collections/gallery/\\?room=devices"`),
  );
  assert.match(devices, /OLED 款式/);
  assert.match(devices, /普通版/);
  assert.match(devices, /星宇橙色/);
  assert.match(devices, /13 英寸 · M5 · 深空黑色/);
  assert.doesNotMatch(devices, /版本待补充/);
  for (const officialUrl of [
    "https://www.nintendo.com/hk/hardware/detail/switch-oled/index.html",
    "https://www.nintendo.com/hk/hardware/switch2/index.html",
    "https://www.apple.com.cn/newsroom/2025/09/apple-unveils-iphone-17-pro-and-iphone-17-pro-max-cn/",
    "https://www.apple.com.cn/ipad-pro/",
  ]) {
    assert.ok(
      devices.includes(`href="${officialUrl}"`),
      `${officialUrl} should link to the confirmed model's official information`,
    );
  }
  assert.doesNotMatch(
    devices,
    /[¥￥]\s*\d|\b\d+(?:\.\d{1,2})?\s*(?:人民币|元|CNY|RMB)\b/i,
  );
  assert.doesNotMatch(devices, /(?:序列号|购买日期|购入日期|订单号)/);
  assert.doesNotMatch(
    devices,
    /data-(?:price|serial(?:-number)?|order|date|purchased-at|purchase-date)=|"(?:price|serialNumber|serial|orderId|purchaseDate|purchasedAt)"\s*:/i,
  );

  const headphones = exported.get("collections/headphones/index.html");
  assert.match(headphones, /喜欢的声音，留在耳边。/);
  assert.match(headphones, /aria-label="4 副耳机收藏"/);
  assert.match(headphones, /aria-label="耳机品牌"/);
  assert.match(headphones, /<button\b[^>]*aria-pressed="true"[^>]*>全部<\/button>/);
  for (const brand of ["Sony", "Apple"]) {
    assert.match(headphones, new RegExp(`<button\\b[^>]*>${brand}<\\/button>`));
    assert.match(headphones.replaceAll("<!-- -->", ""), new RegExp(`${brand} 官方`));
  }
  const headphoneIds = [...headphones.matchAll(/<h3[^>]*id="([^"]+)-title"/g)].map(
    (match) => match[1],
  );
  assert.equal(headphoneIds.length, 4);
  assert.equal(new Set(headphoneIds).size, 4);
  assert.deepEqual(headphoneIds, [
    "device-airpods-pro-3",
    "device-airpods-max-2",
    "headphone-sony-wh-1000xm5",
    "headphone-sony-wh-1000xm6",
  ]);
  for (const [id, title] of [
    ["device-airpods-pro-3", "AirPods Pro 3"],
    ["device-airpods-max-2", "AirPods Max 2"],
    ["headphone-sony-wh-1000xm5", "Sony WH-1000XM5"],
    ["headphone-sony-wh-1000xm6", "Sony WH-1000XM6"],
  ]) {
    assert.ok(headphoneIds.includes(id), `${id} must retain its existing deep link`);
    assert.match(headphones, new RegExp(`<h3[^>]*id="${id}-title">${title}<\\/h3>`));
  }
  assert.match(headphones, /午夜色/);
  assert.match(headphones, /铂金银/);
  assert.match(headphones, /黑色/);
  for (const officialUrl of [
    "https://www.apple.com.cn/airpods-pro/",
    "https://www.apple.com.cn/airpods-max/",
    "https://www.sonystyle.com.cn/products/headphone/wh_1000xm5/wh_1000xm5_s.html",
    "https://www.sonystyle.com.cn/products/headphone/wh_1000xm6/wh_1000xm6_b.html",
  ]) {
    assert.ok(headphones.includes(`href="${officialUrl}"`));
  }
  assert.doesNotMatch(
    headphones,
    /[¥￥]\s*\d|\b\d+(?:\.\d{1,2})?\s*(?:人民币|元|CNY|RMB)\b/i,
  );
  assert.doesNotMatch(headphones, /(?:序列号|购买日期|购入日期|订单号)/);
  assert.doesNotMatch(
    headphones,
    /data-(?:price|serial(?:-number)?|order|date|purchased-at|purchase-date)=|"(?:price|serialNumber|serial|orderId|purchaseDate|purchasedAt)"\s*:/i,
  );
  assert.match(headphones, new RegExp(`href="${basePath}/collections/devices/"`));
  assert.match(
    headphones,
    new RegExp(`href="${basePath}/collections/gallery/\\?room=headphones"`),
  );

  for (const [html, expectedPath] of [
    [controllers, `${basePath}/collections/controllers/`],
    [devices, `${basePath}/collections/devices/`],
    [headphones, `${basePath}/collections/headphones/`],
    [collections, `${basePath}/collections/`],
    [anime, `${basePath}/collections/anime/`],
    [games, `${basePath}/collections/games/`],
    [figures, `${basePath}/collections/figures/`],
    [fufu, `${basePath}/collections/fufu/`],
    [gallery, `${basePath}/collections/gallery/`],
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
  assert.match(links, /我最喜欢的游戏平台之一/);
  assert.match(links, /terminal-card-icon[^>]*>NS</);
  assert.match(links, /href="https:\/\/cs231n\.stanford\.edu\/"/);
  assert.match(links, /id="route-current-study-note"/);
  assert.match(links, /大模型系统学习笔记/);
  assert.match(links, /id="terminal-category-shopping"/);
  assert.match(links, /id="route-netflix"/);
  assert.match(links, /id="route-hpoi"/);
  assert.match(links, /id="route-pinduoduo"/);
  assert.doesNotMatch(links, /terminal-card-placeholder/);
  assert.match(links, new RegExp(`href="${basePath}/about/#contact"`));
  assert.match(
    links,
    new RegExp(`href="${basePath}/study/#distributed-training-transformer-tp"`),
  );
  assert.match(links, /https:\/\/github\.com\/miku-qaq\/sekai-zero/);
  assert.match(links, /https:\/\/web\.stanford\.edu\/class\/cs224n\//);
  assert.doesNotMatch(links, /miku125194847@gmail\.com/);

  const logs = exported.get("logs/index.html");
  assert.match(logs, /id="project-overview"/);
  assert.match(logs, /SEKAI \/ 00 的制作选择与更新/);
  assert.match(logs, /24 EPISODES/);
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
  assert.equal(logs.match(/id="ep-\d{3}"/g)?.length, 24);
  assert.match(logs, /id="ep-024"/);
  assert.ok(logs.indexOf('id="ep-024"') < logs.indexOf('id="project-overview"'));

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
    devices,
    headphones,
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
  await access(new URL("../dist/pages/og-v5.jpg", import.meta.url));
  for (const character of ["miku", "elaina", "bocchi"]) {
    await access(
      new URL(
        `../dist/pages/characters/companions/${character}-v1.webp`,
        import.meta.url,
      ),
    );
  }
  await access(new URL("../dist/pages/.nojekyll", import.meta.url));
});
