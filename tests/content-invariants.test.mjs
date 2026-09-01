import assert from "node:assert/strict";
import { access, readFile, readdir } from "node:fs/promises";
import test from "node:test";

const projectUrl = new URL("../", import.meta.url);

async function readProjectFile(path) {
  return readFile(new URL(path, projectUrl), "utf8");
}

test("keeps the generated Steam catalog public, deterministic and private by design", async () => {
  const rawCatalog = await readProjectFile("content/games-catalog.json");
  const catalog = JSON.parse(rawCatalog);

  assert.deepEqual(Object.keys(catalog).toSorted(), ["items", "source", "updatedAt"]);
  assert.equal(catalog.source, "Steam client local cache");
  assert.match(catalog.updatedAt, /^\d{4}-\d{2}-\d{2}$/);
  assert.equal(catalog.items.length, 146);

  const allowedEntryKeys = ["appId", "id", "image", "platform", "storeUrl", "title"];
  for (const game of catalog.items) {
    assert.deepEqual(Object.keys(game).toSorted(), allowedEntryKeys);
    assert.match(game.appId, /^\d+$/);
    assert.equal(game.id, `steam-${game.appId}`);
    assert.equal(game.platform, "Steam");
    assert.equal(game.storeUrl, `https://store.steampowered.com/app/${game.appId}/`);
    assert.ok(game.title.trim().length > 0);
    assert.ok(game.image === null || game.image === `/games/steam-${game.appId}.webp`);
  }

  assert.equal(new Set(catalog.items.map((game) => game.id)).size, 146);
  assert.equal(new Set(catalog.items.map((game) => game.appId)).size, 146);
  assert.ok(!catalog.items.some((game) => game.appId === "480"));

  const referencedCovers = catalog.items
    .map((game) => game.image)
    .filter((image) => image !== null);
  assert.equal(referencedCovers.length, 104);
  assert.equal(new Set(referencedCovers).size, 104);

  const coverFiles = (await readdir(new URL("public/games/", projectUrl)))
    .filter((filename) => filename.endsWith(".webp"))
    .toSorted();
  assert.equal(coverFiles.length, 104);
  assert.deepEqual(
    coverFiles,
    referencedCovers.map((image) => image.split("/").at(-1)).toSorted(),
  );
  await Promise.all(
    referencedCovers.map((image) => access(new URL(`public${image}`, projectUrl))),
  );

  // Public catalog entries are allow-listed above. This second check makes a
  // future accidental schema expansion with account or activity data obvious.
  assert.doesNotMatch(
    rawCatalog,
    /"(?:playtime|lastPlayed|accountId|steamId|friends|token|auth|userdata)"\s*:/i,
  );
});

test("Steam cache helpers return played app IDs without returning activity values", async () => {
  const { getPlayedSteamAppIds, parseSteamTextVdf } =
    await import("../scripts/lib/steam-vdf.mjs");
  const localConfig = parseSteamTextVdf(`
    "UserLocalConfigStore"
    {
      "Software" { "Valve" { "Steam" { "apps"
        {
          "10" { "Playtime" "45" "LastPlayed" "123456" }
          "20" { "Playtime" "0" "LastPlayed" "654321" }
        }
      } } }
    }
  `);

  const playedIds = getPlayedSteamAppIds(localConfig);
  assert.ok(playedIds instanceof Set);
  assert.deepEqual([...playedIds], ["10"]);
  assert.ok([...playedIds].every((value) => /^\d+$/.test(value)));
});

test("documents the Steam sync output allow-list and protects local authorization data", async () => {
  const [syncScript, parser, transaction, policy, processLock] = await Promise.all([
    readProjectFile("scripts/sync-steam-library.mjs"),
    readProjectFile("scripts/lib/steam-vdf.mjs"),
    readProjectFile("scripts/lib/snapshot-transaction.mjs"),
    readProjectFile("scripts/lib/steam-snapshot-policy.mjs"),
    readProjectFile("scripts/lib/process-lock.mjs"),
  ]);

  assert.match(syncScript, /product\?\.type === "game"/);
  assert.match(syncScript, /const excludedAppIds = new Set\(\["480"\]\)/);
  assert.match(syncScript, /!excludedAppIds\.has\(product\.appId\)/);
  assert.match(syncScript, /Private account identifiers and playtime were not written/);
  assert.match(syncScript, /readArgument\("--steam-user"\)/);
  assert.match(syncScript, /process\.env\.STEAM_USER_ID/);
  assert.match(syncScript, /do not delete another user's Steam cache/);
  assert.doesNotMatch(syncScript, /remove inactive local user caches/);
  assert.match(syncScript, /async function commitGeneratedSnapshot/);
  assert.match(syncScript, /recoverSnapshotTransaction/);
  assert.match(syncScript, /commitSnapshotTransaction/);
  assert.match(syncScript, /process\.argv\.includes\("--allow-removals"\)/);
  assert.match(syncScript, /acquireProcessLock/);
  assert.match(syncScript, /--recover-interrupted-sync/);
  assert.match(syncScript, /await copyFile\(reusableCover, destination\)/);
  assert.match(syncScript, /games\.length === 0/);
  assert.match(syncScript, /stagedCoverCount !== withCover/);
  assert.match(transaction, /COMMITTED/);
  assert.match(transaction, /committed-cleanup/);
  assert.match(policy, /comparison\.removed\.length > 0/);
  assert.match(policy, /comparison\.coversLost\.length > 0/);
  assert.match(processLock, /await open\(lockPath, "wx"\)/);
  assert.match(processLock, /processIsRunning/);
  assert.doesNotMatch(syncScript, /async function clearGeneratedCovers/);
  assert.match(syncScript, /id: `steam-\$\{game\.appId\}`/);
  assert.match(
    syncScript,
    /storeUrl: `https:\/\/store\.steampowered\.com\/app\/\$\{game\.appId\}\//,
  );
  const publicEntry = syncScript.match(/catalog\.push\(\{([^]*?)\}\);/);
  assert.ok(publicEntry, "sync script should have an explicit public entry schema");
  assert.doesNotMatch(
    publicEntry[1],
    /playtime|lastPlayed|accountId|steamId|friends|token|auth|userdata/i,
  );
  assert.match(parser, /access tokens; those bytes are skipped/);
  assert.match(
    parser,
    /Returns app IDs with a positive local playtime, but never returns the time itself/,
  );
});

test("keeps CS224N as the only current note and CS231n as an official-source review", async () => {
  const study = await readProjectFile("content/study.ts");

  assert.equal(study.match(/current: true/g)?.length, 1);
  assert.match(study, /id: "cs224n-nlp-word-vectors"[^]*?current: true/);
  assert.match(study, /id: "cs231n-image-classification-data-driven"/);
  assert.match(study, /NOTE \/ CV-001/);
  assert.match(study, /曾学习 · 回顾/);
  assert.match(study, /我之前学习过 Stanford CS231n 的公开课程资料/);
  assert.match(study, /不是结课证明或进度汇报/);
  assert.match(study, /不表示我修读了页面所对应学期的正式课程/);
  assert.match(study, /https:\/\/cs231n\.stanford\.edu\//);
  assert.match(study, /https:\/\/cs231n\.stanford\.edu\/slides\/2026\/lecture_2\.pdf/);
  assert.match(study, /https:\/\/cs231n\.github\.io\/convolutional-networks\//);
});

test("keeps five top-level worlds, four collection rooms and EP.018 as the latest release", async () => {
  const [site, collections, figures, fufu, releases, animeCatalogRaw, gameCatalogRaw] =
    await Promise.all([
      readProjectFile("content/site.ts"),
      readProjectFile("content/collections.ts"),
      readProjectFile("content/figures.ts"),
      readProjectFile("content/fufu.ts"),
      readProjectFile("content/releases.ts"),
      readProjectFile("content/anime-catalog.json"),
      readProjectFile("content/games-catalog.json"),
    ]);

  const worldRoutes = site.match(/export const worldRoutes = \[([^]*?)\] as const;/);
  assert.ok(worldRoutes, "site.ts should expose one canonical world route registry");
  const hrefs = [
    ...worldRoutes[1].matchAll(/href: "\/(about|collections|study|links|logs)\/"/g),
  ].map((match) => match[1]);
  assert.deepEqual(hrefs, ["about", "collections", "study", "links", "logs"]);
  assert.doesNotMatch(worldRoutes[1], /href: "\/(?:anime|games)\/"/);

  const roomIds = [...collections.matchAll(/id: "(anime|games|figures|fufu)"/g)].map(
    (match) => match[1],
  );
  const roomHrefs = [
    ...collections.matchAll(/href: "\/collections\/(anime|games|figures|fufu)\/"/g),
  ].map((match) => match[1]);
  assert.deepEqual(roomIds, ["anime", "games", "figures", "fufu"]);
  assert.deepEqual(roomHrefs, ["anime", "games", "figures", "fufu"]);
  assert.match(collections, /count: animeCatalog\.length/);
  assert.match(collections, /count: gameCatalog\.length/);
  assert.match(collections, /count: figureCollection\.length/);
  assert.match(collections, /count: fufuCollection\.length/);
  assert.match(
    collections,
    /export const collectionRecordCount = collectionRooms\.reduce/,
  );

  const figureEntries = [
    ...figures.matchAll(/\{\s+id: "(figure-\d{3})",([^]*?)\n {2}\},/g),
  ];
  assert.equal(figureEntries.length, 16);
  assert.equal(new Set(figureEntries.map((match) => match[1])).size, 16);
  assert.deepEqual(
    figureEntries.map((entry) => entry[1]),
    [
      "figure-001",
      "figure-002",
      "figure-004",
      "figure-005",
      "figure-006",
      "figure-007",
      "figure-008",
      "figure-009",
      "figure-010",
      "figure-011",
      "figure-012",
      "figure-013",
      "figure-014",
      "figure-015",
      "figure-016",
      "figure-017",
    ],
  );
  const allowedFigureKeys = [
    "character",
    "format",
    "id",
    "motif",
    "product",
    "tone",
    "verification",
    "work",
  ];
  for (const entry of figureEntries) {
    const keys = [...`id: "${entry[1]}",${entry[2]}`.matchAll(/^\s*(\w+):/gm)].map(
      (match) => match[1],
    );
    assert.deepEqual(keys.toSorted(), allowedFigureKeys);
  }
  const figureEntrySource = figureEntries.map((entry) => entry[0]).join("\n");
  assert.equal(
    figureEntrySource.match(/verification: "identity-confirmed"/g)?.length,
    16,
  );
  assert.equal(figureEntrySource.match(/product: null/g)?.length, 16);
  assert.equal(figureEntrySource.match(/character: "初音未来"/g)?.length, 7);
  assert.match(
    figures,
    /id: "figure-017"[^]*?character: "初音未来"[^]*?work: "初音未来"/,
  );
  assert.match(figures, /work: string;/);
  assert.match(figures, /product: FigureProductDetails;/);
  assert.doesNotMatch(
    figures,
    /verification: "pending"|character: "角色待确认"|format: "待确认"/,
  );
  assert.doesNotMatch(
    figureEntrySource,
    /price|cost|amount|currency|order|purchase|platform|date|time/i,
  );

  const fufuEntries = [
    ...fufu.matchAll(/\{\s+id: "(figure-003|fufu-[^"]+)",([^]*?)\n {2}\},/g),
  ];
  assert.equal(fufuEntries.length, 6);
  assert.deepEqual(
    fufuEntries.map((entry) => entry[1]),
    [
      "figure-003",
      "fufu-zodiac-2022-tiger",
      "fufu-zodiac-2023-rabbit",
      "fufu-zodiac-2024-dragon",
      "fufu-zodiac-2025-snake",
      "fufu-zodiac-2026-horse",
    ],
  );
  assert.equal(new Set(fufuEntries.map((entry) => entry[1])).size, 6);

  const allowedFufuKeys = [
    "character",
    "id",
    "kind",
    "motif",
    "officialUrl",
    "title",
    "tone",
    "verification",
    "year",
    "zodiac",
  ];
  for (const entry of fufuEntries) {
    const keys = [...`id: "${entry[1]}",${entry[2]}`.matchAll(/^\s*(\w+):/gm)].map(
      (match) => match[1],
    );
    assert.deepEqual(keys.toSorted(), allowedFufuKeys);
  }

  assert.deepEqual(
    fufuEntries.map((entry) => entry[2].match(/\n\s+title: "([^"]+)"/)?.[1]),
    [
      "初音ミクシリーズ　初音ミク　ふわぷち　どでかジャンボぬいぐるみ",
      "初音ミク　寅2022　ふわふわぬいぐるみ(LL)",
      "初音ミク　卯2023　ふわぷち　ぬいぐるみ（LL）",
      "初音ミク　辰2024　ふわぷち　ぬいぐるみ（LL）",
      "初音ミク　巳2025　ふわぷち　ぬいぐるみ（ＬＬ）",
      "初音ミク　午2026　ふわぷち　ぬいぐるみ（LL）",
    ],
  );
  assert.deepEqual(
    fufuEntries.map((entry) => [
      entry[2].match(/\n\s+zodiac: (null|"[^"]+")/)?.[1] ?? null,
      entry[2].match(/\n\s+year: (null|\d{4})/)?.[1] ?? null,
    ]),
    [
      ["null", "null"],
      ['"寅"', "2022"],
      ['"卯"', "2023"],
      ['"辰"', "2024"],
      ['"巳"', "2025"],
      ['"午"', "2026"],
    ],
  );
  assert.equal(fufu.match(/id: "figure-003"/g)?.length, 1);
  assert.doesNotMatch(
    fufuEntries.map((entry) => entry[0]).join("\n"),
    /^\s*(?:price|cost|amount|currency|order|orderId|purchaseDate|purchasedAt|shop|batch):/im,
  );

  const contentFiles = (await readdir(new URL("content/", projectUrl)))
    .filter((filename) => filename.endsWith(".ts"))
    .toSorted();
  const filesContainingMigratedId = [];
  for (const filename of contentFiles) {
    const source = await readProjectFile(`content/${filename}`);
    if (/id: "figure-003"/.test(source)) filesContainingMigratedId.push(filename);
  }
  assert.deepEqual(filesContainingMigratedId, ["fufu.ts"]);

  const animeCount = JSON.parse(animeCatalogRaw).length;
  const gameCount = JSON.parse(gameCatalogRaw).items.length;
  assert.equal(animeCount, 89);
  assert.equal(gameCount, 146);
  assert.equal(animeCount + gameCount + figureEntries.length + fufuEntries.length, 257);

  const episodes = [...releases.matchAll(/episode: "EP\.(\d{3})"/g)].map(
    (match) => match[1],
  );
  assert.equal(episodes.length, 18);
  assert.equal(new Set(episodes).size, 18);
  assert.equal(episodes[0], "018");
  assert.match(releases, /episode: "EP\.018"[^]*?Mac/);
  assert.match(releases, /episode: "EP\.018"[^]*?(?:GitHub|环境自检)/);
  assert.match(releases, /episode: "EP\.017"[^]*?手办/);
  assert.match(releases, /episode: "EP\.017"[^]*?(?:核对|作品出处)/);
  assert.match(releases, /episode: "EP\.016"[^]*?客户端导航/);
  assert.match(releases, /episode: "EP\.016"[^]*?不再整页刷新/);
  assert.match(releases, /episode: "EP\.015"[^]*?Fufu/);
  assert.match(releases, /episode: "EP\.015"[^]*?(?:寅|生肖)/);
  assert.match(releases, /episode: "EP\.014"[^]*?奇妙收藏馆/);
  assert.match(releases, /NAVIGATION TERMINAL \/ ROUTE 05/);
  assert.match(releases, /GAMES \/ 146 · CV-001/);
});
