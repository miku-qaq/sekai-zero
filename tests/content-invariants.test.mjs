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
  const [syncScript, parser] = await Promise.all([
    readProjectFile("scripts/sync-steam-library.mjs"),
    readProjectFile("scripts/lib/steam-vdf.mjs"),
  ]);

  assert.match(syncScript, /product\?\.type === "game"/);
  assert.match(syncScript, /const excludedAppIds = new Set\(\["480"\]\)/);
  assert.match(syncScript, /!excludedAppIds\.has\(product\.appId\)/);
  assert.match(syncScript, /Private account identifiers and playtime were not written/);
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

test("keeps five top-level worlds, three collection rooms and EP.014 as the latest release", async () => {
  const [site, collections, figures, releases] = await Promise.all([
    readProjectFile("content/site.ts"),
    readProjectFile("content/collections.ts"),
    readProjectFile("content/figures.ts"),
    readProjectFile("content/releases.ts"),
  ]);

  const worldRoutes = site.match(/export const worldRoutes = \[([^]*?)\] as const;/);
  assert.ok(worldRoutes, "site.ts should expose one canonical world route registry");
  const hrefs = [
    ...worldRoutes[1].matchAll(/href: "\/(about|collections|study|links|logs)\/"/g),
  ].map((match) => match[1]);
  assert.deepEqual(hrefs, ["about", "collections", "study", "links", "logs"]);
  assert.doesNotMatch(worldRoutes[1], /href: "\/(?:anime|games)\/"/);

  const roomIds = [...collections.matchAll(/id: "(anime|games|figures)"/g)].map(
    (match) => match[1],
  );
  const roomHrefs = [
    ...collections.matchAll(/href: "\/collections\/(anime|games|figures)\/"/g),
  ].map((match) => match[1]);
  assert.deepEqual(roomIds, ["anime", "games", "figures"]);
  assert.deepEqual(roomHrefs, ["anime", "games", "figures"]);
  assert.match(collections, /count: animeCatalog\.length/);
  assert.match(collections, /count: gameCatalog\.length/);
  assert.match(collections, /count: figureCollection\.length/);

  const figureEntries = [
    ...figures.matchAll(/\{\s+id: "(figure-\d{3})",([^]*?)\n {2}\},/g),
  ];
  assert.equal(figureEntries.length, 17);
  assert.equal(new Set(figureEntries.map((match) => match[1])).size, 17);
  const allowedFigureKeys = [
    "character",
    "format",
    "id",
    "motif",
    "tone",
    "verification",
  ];
  for (const entry of figureEntries) {
    const keys = [...`id: "${entry[1]}",${entry[2]}`.matchAll(/^\s*(\w+):/gm)].map(
      (match) => match[1],
    );
    assert.deepEqual(keys.toSorted(), allowedFigureKeys);
  }
  assert.equal(figures.match(/verification: "pending"/g)?.length, 1);
  assert.doesNotMatch(
    figureEntries.map((entry) => entry[0]).join("\n"),
    /price|cost|amount|currency|order|purchase|platform|date|time/i,
  );

  const episodes = [...releases.matchAll(/episode: "EP\.(\d{3})"/g)].map(
    (match) => match[1],
  );
  assert.equal(episodes.length, 14);
  assert.equal(new Set(episodes).size, 14);
  assert.equal(episodes[0], "014");
  assert.match(releases, /episode: "EP\.014"[^]*?奇妙收藏馆/);
  assert.match(releases, /NAVIGATION TERMINAL \/ ROUTE 05/);
  assert.match(releases, /GAMES \/ 146 · CV-001/);
});
