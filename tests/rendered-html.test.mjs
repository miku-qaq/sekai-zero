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
  assert.match(html, /Stanford CS224N · Word Vectors/);
  assert.match(html, /Nintendo Switch · Steam/);
  assert.match(html, /哔哩哔哩 · Bilibili/);
  assert.match(html, /href="\/study\/#cs224n-nlp-word-vectors"/);
  assert.match(html, /href="\/links\/#route-bilibili"/);
  assert.match(html, /https:\/\/miku-qaq\.github\.io\/sekai-zero\/og-v4\.png/);
  assert.doesNotMatch(html, /chatgpt\.site/);

  assert.match(html, /从这里开始浏览/);
  assert.match(html, /我的三位二次元老婆/);
  assert.match(html, /初音未来/);
  assert.match(html, /伊蕾娜/);
  assert.match(html, /波奇/);
  assert.match(html, /CHANNEL CONNECTED/);
  assert.match(html, /id="gacha"/);
  assert.match(html, /抽一张今天的次元签/);
  assert.match(html, /抽取下一张/);
  assert.match(html, /先让明天发出声音/);
  assert.match(html, /hero-anime-v2\.webp/);

  // Engineering history belongs to Logs, not the public-facing homepage.
  assert.doesNotMatch(html, /EP\.\d{3}/);
  assert.doesNotMatch(html, /id="project-overview"/);
  assert.doesNotMatch(html, /id="works"|id="roadmap"/);
  assert.doesNotMatch(html, /\bPHASE\s*0\d\b/i);
  assert.doesNotMatch(html, /role="meter"|aria-valuenow=/i);

  const routeOrder = ["/about/", "/anime/", "/study/", "/links/", "/logs/"].map(
    (href) => html.indexOf(`href="${href}"`),
  );
  assert.ok(routeOrder.every((position) => position >= 0));
  assert.deepEqual(
    routeOrder,
    routeOrder.toSorted((left, right) => left - right),
  );
  assert.doesNotMatch(html, /href="\/projects\/"/);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton/i);
});

test("server-renders the five canonical public routes with clear purposes", async () => {
  const routes = [
    {
      pathname: "/about",
      title: /<title>关于我 · SEKAI<\/title>/i,
      copy: /你好，我是 Mikureina/,
      breadcrumb: /首页<\/a><span[^>]*>\/<\/span><span>关于我<\/span>/,
    },
    {
      pathname: "/anime",
      title: /<title>动画收藏馆 · SEKAI<\/title>/i,
      copy: /看过的故事，也组成了我的世界/,
      breadcrumb: /首页<\/a><span[^>]*>\/<\/span><span>动画收藏<\/span>/,
    },
    {
      pathname: "/study",
      title: /<title>计算机学习笔记 · SEKAI<\/title>/i,
      copy: /把学到的东西，整理成可以返回的地图/,
      breadcrumb: /首页<\/a><span[^>]*>\/<\/span><span>学习笔记<\/span>/,
    },
    {
      pathname: "/links",
      title: /<title>链接收藏 · SEKAI<\/title>/i,
      copy: /我愿意再次打开的入口/,
      breadcrumb: /首页<\/a><span[^>]*>\/<\/span><span>链接<\/span>/,
    },
    {
      pathname: "/logs",
      title: /<title>世界线日志 · SEKAI<\/title>/i,
      copy: /网站怎样成长，都记录在这里/,
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

test("keeps the former projects URL as a Logs compatibility page", async () => {
  const response = await render("/projects");
  assert.equal(response.status, 200);
  const html = await response.text();

  assert.match(html, /<title>世界线日志 · SEKAI<\/title>/i);
  assert.match(html, /id="project-overview"/);
  assert.match(html, /EP\.011/);
  assert.match(html, /id="ep-011"/);
  assert.match(html, /id="ep-010"/);
  assert.match(html, /网站怎样成长，都记录在这里/);
  assert.doesNotMatch(html, />制作档案</);
});

test("publishes the project overview and complete release history only in Logs", async () => {
  const response = await render("/logs");
  assert.equal(response.status, 200);
  const logs = await response.text();

  assert.match(logs, /id="project-overview"/);
  assert.match(logs, /关于 SEKAI \/ 00 的制作记录/);
  assert.match(logs, /原“制作档案”已并入日志/);
  assert.match(logs, /项目公开入口/);
  assert.match(logs, /打开公开网站/);
  assert.match(logs, /查看 GitHub 仓库/);
  assert.match(logs, /https:\/\/github\.com\/miku-qaq\/sekai-zero/);
  assert.match(logs, /EP\.011/);
  assert.match(logs, /id="ep-011"/);
  assert.match(logs, /把看过的动画铺成一面收藏墙/);
  assert.match(logs, /EP\.010/);
  assert.match(logs, /id="ep-010"/);
  assert.match(logs, /把网站内容重新交还给访客/);
  assert.match(logs, /EP\.001/);
  assert.match(logs, /id="ep-001"/);

  const episodeIds = [...logs.matchAll(/id="ep-(\d{3})"/g)].map((match) => match[1]);
  assert.equal(episodeIds.length, 11);
  assert.equal(new Set(episodeIds).size, episodeIds.length);
});

test("publishes confirmed links plus one honest future placeholder", async () => {
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
  assert.match(links, /CS224N 当前笔记/);
  assert.match(links, /https:\/\/github\.com\/miku-qaq\/sekai-zero/);
  assert.match(links, /https:\/\/web\.stanford\.edu\/class\/cs224n\//);
  assert.match(links, /下一枚收藏坐标/);
  assert.match(links, /内容待填充/);
  assert.match(links, /不会为了填满版面而虚构/);
  assert.equal(links.match(/terminal-card-placeholder/g)?.length, 1);
  assert.doesNotMatch(links, /miku125194847@gmail\.com/);
});

test("publishes all 89 watched anime with one formal title and local covers", async () => {
  const response = await render("/anime");
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
  assert.match(html, /灵笼 上半季/);
  assert.match(html, /魔女之旅/);
  assert.match(html, /孤独摇滚！/);
  assert.match(html, /命运石之门/);
  assert.match(html, /IMAGE &amp; DATA CREDIT/);
  assert.match(html, /封面与作品资料索引来自 Bangumi/);
  assert.doesNotMatch(html, /heart beats|时速5cm|作品名、别名|aliases/i);

  const covers = [...html.matchAll(/src="(\/anime\/[^"]+\.webp)"/g)].map(
    (match) => match[1],
  );
  assert.equal(covers.length, 89);
  for (const cover of covers) {
    await access(new URL(`../public${cover}`, import.meta.url));
  }
});

test("server-renders the current CS224N learning note with official sources", async () => {
  const response = await render("/study");
  assert.equal(response.status, 200);
  const html = await response.text();

  assert.match(html, /AI 与 NLP/);
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
    styles,
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
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
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
  ]);

  assert.match(page, /from "@\/content\/site"/);
  assert.match(siteContent, /export const worldRoutes/);
  assert.match(siteContent, /href: "\/about\/"/);
  assert.match(siteContent, /href: "\/anime\/"/);
  assert.match(siteContent, /href: "\/study\/"/);
  assert.match(siteContent, /href: "\/links\/"/);
  assert.match(siteContent, /href: "\/logs\/"/);
  assert.doesNotMatch(siteContent, /href: "\/projects\/"/);
  assert.match(siteContent, /homepageFacts/);
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

  // `/projects/` remains readable for bookmarks, but it is not a sixth public
  // information-architecture destination.
  assert.match(projectsPage, /import LogsPage from "\.\.\/logs\/page"/);
  assert.match(
    projectsPage,
    /alternates: \{ canonical: absoluteSiteUrl\("logs\/"\) \}/,
  );
  assert.match(projectsPage, /robots: \{ index: false, follow: true \}/);
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
  assert.match(releasesContent, /episode: "EP\.011"/);
  assert.match(releasesContent, /ANIME COLLECTION \/ 89/);
  assert.match(releasesContent, /episode: "EP\.010"/);
  assert.match(releasesContent, /VISITOR-FIRST CONTENT/);
  assert.match(nowContent, /LEARNING \/ NLP-001/);
  assert.match(nowContent, /GAMES \/ NS \+ STEAM/);
  assert.match(nowContent, /FAVORITE \/ VIDEO/);
  assert.doesNotMatch(nowContent, /EP\.010|最近更新/);

  // Mastheads, page hand-offs and homepage cards all derive from one registry.
  assert.match(pageMasthead, /worldRoutes\.find/);
  assert.match(pageMasthead, /currentHref: WorldRouteHref/);
  assert.match(pageMasthead, /route\.eyebrow/);
  assert.match(pageMasthead, /route\.motif/);
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
  assert.match(linksContent, /export const linkPlaceholder/);
  assert.equal(linksContent.match(/NEXT FAVORITE \/ OPEN SLOT/g)?.length, 1);

  // Character channels use one honest connected state, not invented sync
  // percentages that look like measured user data.
  assert.match(favoriteChannelsComponent, /sekai-channel/);
  assert.match(favoriteChannelsComponent, /NOW PLAYING/);
  assert.match(favoriteChannelsComponent, /active\.program\.href/);
  assert.match(favoriteChannelsComponent, /CHANNEL CONNECTED/);
  assert.doesNotMatch(favoriteChannelsComponent, /active\.sync|role="meter"/);

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
