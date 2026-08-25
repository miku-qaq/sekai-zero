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
  assert.match(html, /Mikureina/);
  assert.match(html, /EP\.008/);
  assert.match(html, /CS224N/);
  assert.match(html, /NOW \/ CURRENT BROADCAST/);
  assert.match(html, /这一周，正在让学习、建站与下一步彼此相连/);
  assert.match(html, /href="\/study\/#cs224n-nlp-word-vectors"/);
  assert.match(html, /href="\/study\/#learning-queue"/);
  assert.match(html, /https:\/\/miku-qaq\.github\.io\/sekai-zero\/og-v3\.png/);
  assert.doesNotMatch(html, /chatgpt\.site/);
  assert.match(html, /角色设定档/);
  assert.match(html, /航线终端/);
  assert.match(html, /制作档案/);
  assert.match(html, /计算机学习舱/);
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

  const routeOrder = ["/about/", "/links/", "/projects/", "/study/", "/logs/"].map(
    (href) => html.indexOf(`href="${href}"`),
  );
  assert.ok(routeOrder.every((position) => position >= 0));
  assert.deepEqual(
    routeOrder,
    routeOrder.toSorted((left, right) => left - right),
  );
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton/i);
});

test("server-renders every secondary route with its own editorial purpose", async () => {
  const routes = [
    {
      pathname: "/about",
      title: /<title>角色设定档 · SEKAI<\/title>/i,
      copy: /你好，我是 Mikureina/,
    },
    {
      pathname: "/links",
      title: /<title>航线终端 · SEKAI<\/title>/i,
      copy: /通往这座世界内外的航线/,
    },
    {
      pathname: "/projects",
      title: /<title>制作档案 · SEKAI<\/title>/i,
      copy: /把制作过程，也做成一份作品/,
    },
    {
      pathname: "/study",
      title: /<title>计算机学习舱 · SEKAI<\/title>/i,
      copy: /把学到的东西，整理成可以返回的地图/,
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
    assert.match(html, /class="journey-navigation section-shell"/);
    assert.match(html, /CURRENT FILE/);
    assert.doesNotMatch(html, /主人/);
  }
});

test("publishes connected routes and verifiable project evidence", async () => {
  const [linksResponse, projectsResponse, logsResponse] = await Promise.all([
    render("/links"),
    render("/projects"),
    render("/logs"),
  ]);
  const [links, projects, logs] = await Promise.all([
    linksResponse.text(),
    projectsResponse.text(),
    logsResponse.text(),
  ]);

  assert.match(links, /CS224N 当前笔记/);
  assert.match(links, /https:\/\/github\.com\/miku-qaq\/sekai-zero/);
  assert.match(links, /https:\/\/web\.stanford\.edu\/class\/cs224n\//);
  assert.match(projects, /项目公开证据/);
  assert.match(projects, /打开公开网站/);
  assert.match(projects, /查看 GitHub 仓库/);
  assert.match(projects, /href="\/logs\/"/);
  assert.match(logs, /EP\.008/);
  assert.match(logs, /id="ep-008"/);
  assert.match(logs, /让各个页面开始彼此回应/);
  const episodeIds = [...logs.matchAll(/id="ep-(\d{3})"/g)].map((match) => match[1]);
  assert.equal(episodeIds.length, 8);
  assert.equal(new Set(episodeIds).size, episodeIds.length);
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

test("keeps product boundaries and interaction safeguards in place", async () => {
  const [
    page,
    content,
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
    linkTerminal,
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
    readFile(new URL("../app/components/link-terminal.tsx", import.meta.url), "utf8"),
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
  assert.match(studyNotebook, /role="search"/);
  assert.match(studyNotebook, /aria-live="polite"/);
  assert.match(studyNotebook, /<details/);
  assert.match(studyNotebook, /<summary>/);
  assert.match(studyNotebook, /清除筛选/);
  assert.match(studyNotebook, /hashchange/);
  assert.match(studyNotebook, /HTMLDetailsElement/);
  assert.match(studyNotebook, /navigator\.clipboard\.writeText/);
  assert.match(studyContent, /not course completion or formal/);
  assert.match(studyContent, /category: "ai"/);
  assert.match(studyContent, /current: true/);
  assert.match(studyContent, /publisher: "Stanford University"/);
  assert.match(studyContent, /developer\.mozilla\.org/);
  assert.match(studyContent, /git-scm\.com/);
  assert.match(projectsPage, /CASE 001 \/ SEKAI 00/);
  assert.match(projectsContent, /not a claim about traffic, clients, revenue/);
  assert.match(projectsContent, /WAITING FOR VERIFIED WORK/);
  assert.doesNotMatch(projectsContent, /访问量|收入|客户评价|转化率/);
  assert.match(sitePaths, /NEXT_PUBLIC_BASE_PATH/);
  assert.match(profileContent, /Owner-confirmed public profile data/);
  assert.match(profileContent, /handle: "Mikureina"/);
  assert.match(profileContent, /academicStatus: "南京大学 · CS 在读"/);
  assert.match(profileContent, /email: "miku125194847@gmail\.com"/);
  assert.match(releasesContent, /Canonical release history/);
  assert.match(releasesContent, /episode: "EP\.008"/);
  assert.match(nowContent, /LEARNING \/ NLP-001/);
  assert.match(nowContent, /\/study\/#cs224n-nlp-word-vectors/);
  assert.match(journeyNavigation, /worldRoutes\.findIndex/);
  assert.match(linkTerminal, /setGroup\("all"\)/);
  assert.match(linkTerminal, /setQuery\(""\)/);

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
