import {
  access,
  copyFile,
  mkdir,
  readFile,
  readdir,
  rm,
  stat,
  writeFile,
} from "node:fs/promises";
import { homedir, platform } from "node:os";
import path from "node:path";
import process from "node:process";
import sharp from "sharp";
import {
  getPlayedSteamAppIds,
  parseSteamAppInfo,
  parseSteamTextVdf,
} from "./lib/steam-vdf.mjs";
import {
  commitSnapshotTransaction,
  recoverSnapshotTransaction,
} from "./lib/snapshot-transaction.mjs";
import {
  assertSafeSteamCatalogChange,
  compareSteamCatalogs,
} from "./lib/steam-snapshot-policy.mjs";
import { acquireProcessLock } from "./lib/process-lock.mjs";

const projectRoot = path.resolve(import.meta.dirname, "..");
const catalogPath = path.join(projectRoot, "content", "games-catalog.json");
const coverDirectory = path.join(projectRoot, "public", "games");
const workDirectory = path.join(projectRoot, "work");
const transactionRoot = path.join(workDirectory, "steam-transaction");
const committedMarker = path.join(workDirectory, "steam-transaction.committed");
const lockPath = path.join(workDirectory, "steam-sync.lock");
// App 480 is Valve's Steamworks integration test, not a real library title.
const excludedAppIds = new Set(["480"]);

function readArgument(name) {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

async function exists(target) {
  try {
    await access(target);
    return true;
  } catch {
    return false;
  }
}

async function resolveSteamDirectory() {
  const explicit = readArgument("--steam-dir") || process.env.STEAM_DIR;
  if (explicit) return path.resolve(explicit);

  // Steam may live on any Windows drive. Probe the conventional root folder
  // instead of committing this computer's exact installation path.
  const windowsDriveRoots = Array.from(
    { length: 24 },
    (_, index) => `${String.fromCharCode(67 + index)}:\\`,
  );
  const candidates =
    platform() === "win32"
      ? [
          "C:\\Program Files (x86)\\Steam",
          "C:\\Program Files\\Steam",
          ...windowsDriveRoots.map((root) => path.join(root, "Steam")),
        ]
      : platform() === "darwin"
        ? [path.join(homedir(), "Library", "Application Support", "Steam")]
        : [
            path.join(homedir(), ".steam", "steam"),
            path.join(homedir(), ".local", "share", "Steam"),
          ];

  for (const candidate of candidates) {
    if (await exists(path.join(candidate, "appcache", "appinfo.vdf"))) return candidate;
  }
  throw new Error("Steam directory not found. Pass --steam-dir or set STEAM_DIR.");
}

async function resolveLocalConfig(steamDirectory) {
  const userdataDirectory = path.join(steamDirectory, "userdata");
  const requestedUser = readArgument("--steam-user") || process.env.STEAM_USER_ID;
  if (requestedUser) {
    if (!/^\d+$/.test(requestedUser)) {
      throw new Error("Steam user selector must contain digits only.");
    }
    const selected = path.join(
      userdataDirectory,
      requestedUser,
      "config",
      "localconfig.vdf",
    );
    if (!(await exists(selected))) {
      throw new Error("The selected Steam user cache does not exist.");
    }
    return selected;
  }

  const candidates = [];

  for (const entry of await readdir(userdataDirectory, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const candidate = path.join(
      userdataDirectory,
      entry.name,
      "config",
      "localconfig.vdf",
    );
    if (await exists(candidate)) candidates.push(candidate);
  }

  if (candidates.length !== 1) {
    throw new Error(
      `Expected exactly one Steam user cache, found ${candidates.length}. ` +
        "Pass --steam-user <numeric directory name> or set STEAM_USER_ID; " +
        "do not delete another user's Steam cache.",
    );
  }
  return candidates[0];
}

function assertPathWithin(target, parent, label) {
  const relative = path.relative(path.resolve(parent), path.resolve(target));
  if (!relative || relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new Error(`Refusing to modify an unexpected ${label} path.`);
  }
}

/** Install a fully generated snapshot, rolling back if either move fails. */
async function commitGeneratedSnapshot(stagedCovers, stagedCatalog) {
  assertPathWithin(transactionRoot, workDirectory, "Steam transaction");
  assertPathWithin(committedMarker, workDirectory, "Steam commit marker");
  assertPathWithin(coverDirectory, path.join(projectRoot, "public"), "cover");
  assertPathWithin(catalogPath, path.join(projectRoot, "content"), "catalog");
  await commitSnapshotTransaction({
    transactionRoot,
    committedMarker,
    stagedDirectory: stagedCovers,
    stagedFile: stagedCatalog,
    liveDirectory: coverDirectory,
    liveFile: catalogPath,
    onCleanupWarning: (error) => {
      const message = error instanceof Error ? error.message : String(error);
      console.warn(
        `Steam snapshot was committed; deferred backup cleanup until the next run. ${message}`,
      );
    },
  });
}

async function findCover(steamDirectory, appId) {
  const cacheDirectory = path.join(steamDirectory, "appcache", "librarycache", appId);
  for (const filename of [
    "library_600x900.jpg",
    "library_600x900_schinese.jpg",
    "header.jpg",
  ]) {
    const candidate = path.join(cacheDirectory, filename);
    if (await exists(candidate)) return candidate;
  }
  return null;
}

async function renderCover(source, destination) {
  await sharp(source)
    .resize(420, 630, { fit: "cover", position: "attention" })
    .webp({ quality: 78 })
    .toFile(destination);
}

async function readExistingCatalog() {
  if (!(await exists(catalogPath))) return [];

  let parsed;
  try {
    parsed = JSON.parse(await readFile(catalogPath, "utf8"));
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`The existing public Steam catalog is invalid. ${message}`);
  }
  if (!Array.isArray(parsed?.items)) {
    throw new Error("The existing public Steam catalog has no items array.");
  }
  return parsed.items;
}

async function stageCover({ steamDirectory, game, existingGame, stagedCovers }) {
  const filename = `steam-${game.appId}.webp`;
  const publicImage = `/games/${filename}`;
  const destination = path.join(stagedCovers, filename);
  const sourceCover = await findCover(steamDirectory, game.appId);

  if (sourceCover) {
    await renderCover(sourceCover, destination);
    return publicImage;
  }

  const reusableCover = path.join(coverDirectory, filename);
  if (existingGame?.image === publicImage && (await exists(reusableCover))) {
    await copyFile(reusableCover, destination);
    return publicImage;
  }
  return null;
}

async function syncSteamLibrary() {
  const recovery = await recoverSnapshotTransaction({
    transactionRoot,
    committedMarker,
    liveDirectory: coverDirectory,
    liveFile: catalogPath,
  });
  if (recovery === "rolled-back") {
    console.warn("Recovered the previous Steam snapshot after an interrupted sync.");
  }

  const steamDirectory = await resolveSteamDirectory();
  const localConfigPath = await resolveLocalConfig(steamDirectory);
  const [appInfoBuffer, localConfigText, existingCatalog, appInfoStats] =
    await Promise.all([
      readFile(path.join(steamDirectory, "appcache", "appinfo.vdf")),
      readFile(localConfigPath, "utf8"),
      readExistingCatalog(),
      stat(path.join(steamDirectory, "appcache", "appinfo.vdf")),
    ]);

  const products = parseSteamAppInfo(appInfoBuffer);
  const playedAppIds = getPlayedSteamAppIds(parseSteamTextVdf(localConfigText));
  const collator = new Intl.Collator(["zh-CN", "en"], {
    sensitivity: "base",
    numeric: true,
  });
  const games = [...playedAppIds]
    .map((appId) => products.get(appId))
    .filter(
      (product) =>
        product?.type === "game" && product.title && !excludedAppIds.has(product.appId),
    )
    .sort((left, right) => collator.compare(left.title, right.title));

  if (games.length === 0) {
    throw new Error(
      "No played Steam games were found; the existing public catalog was left unchanged.",
    );
  }

  const existingByAppId = new Map(
    existingCatalog.map((game) => [String(game.appId), game]),
  );
  const allowRemovals =
    process.argv.includes("--allow-removals") ||
    process.env.STEAM_ALLOW_REMOVALS === "1";
  const inventoryPreview = games.map((game) => ({
    appId: game.appId,
    image: existingByAppId.get(String(game.appId))?.image ?? null,
  }));
  assertSafeSteamCatalogChange(
    compareSteamCatalogs(existingCatalog, inventoryPreview),
    {
      allowRemovals,
    },
  );

  await mkdir(transactionRoot);
  const stagedCovers = path.join(transactionRoot, "staged-directory");
  const stagedCatalog = path.join(transactionRoot, "staged-file");
  await mkdir(stagedCovers, { recursive: true });
  let catalog;
  let withCover;
  let comparison;
  let commitStarted = false;

  try {
    catalog = [];
    for (const game of games) {
      const image = await stageCover({
        steamDirectory,
        game,
        existingGame: existingByAppId.get(String(game.appId)),
        stagedCovers,
      });
      catalog.push({
        id: `steam-${game.appId}`,
        appId: game.appId,
        title: game.title,
        platform: "Steam",
        image,
        storeUrl: `https://store.steampowered.com/app/${game.appId}/`,
      });
    }

    const generated = {
      updatedAt: new Date().toISOString().slice(0, 10),
      source: "Steam client local cache",
      items: catalog,
    };
    await writeFile(stagedCatalog, `${JSON.stringify(generated, null, 2)}\n`, "utf8");

    withCover = catalog.filter((game) => game.image).length;
    const stagedCoverCount = (await readdir(stagedCovers)).filter((filename) =>
      filename.endsWith(".webp"),
    ).length;
    if (stagedCoverCount !== withCover || catalog.length !== games.length) {
      throw new Error("Generated Steam snapshot failed validation.");
    }

    comparison = compareSteamCatalogs(existingCatalog, catalog);
    assertSafeSteamCatalogChange(comparison, { allowRemovals });

    commitStarted = true;
    await commitGeneratedSnapshot(stagedCovers, stagedCatalog);
  } catch (error) {
    if (!commitStarted) {
      await rm(transactionRoot, { recursive: true, force: true });
    }
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Steam sync did not publish a complete snapshot. ${message}`, {
      cause: error,
    });
  }
  console.log(
    `Synced ${catalog.length} played Steam games (${withCover} covers) from cache updated ${appInfoStats.mtime.toISOString()}.`,
  );
  console.log(
    `Snapshot diff: +${comparison.added.length} item(s), -${comparison.removed.length} item(s), ` +
      `+${comparison.coversAdded.length} cover(s), -${comparison.coversLost.length} retained cover(s).`,
  );
  console.log(
    "Private account identifiers and playtime were not written to the catalog.",
  );
}

async function main() {
  await mkdir(workDirectory, { recursive: true });
  const releaseLock = await acquireProcessLock({
    lockPath,
    label: "Steam library sync",
    allowUnknownStale: process.argv.includes("--recover-interrupted-sync"),
  });
  try {
    await syncSteamLibrary();
  } finally {
    await releaseLock();
  }
}

await main();
