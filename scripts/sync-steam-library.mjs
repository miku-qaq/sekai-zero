import {
  access,
  mkdir,
  readFile,
  readdir,
  stat,
  unlink,
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

const projectRoot = path.resolve(import.meta.dirname, "..");
const catalogPath = path.join(projectRoot, "content", "games-catalog.json");
const coverDirectory = path.join(projectRoot, "public", "games");
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
        "Use a separate Steam directory or remove inactive local user caches before syncing.",
    );
  }
  return candidates[0];
}

async function clearGeneratedCovers() {
  await mkdir(coverDirectory, { recursive: true });
  const expected = path.join(projectRoot, "public", "games");
  if (path.resolve(coverDirectory) !== path.resolve(expected)) {
    throw new Error("Refusing to clean an unexpected game cover directory");
  }

  for (const entry of await readdir(coverDirectory, { withFileTypes: true })) {
    if (entry.isFile() && entry.name.endsWith(".webp")) {
      await unlink(path.join(coverDirectory, entry.name));
    }
  }
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

async function main() {
  const steamDirectory = await resolveSteamDirectory();
  const localConfigPath = await resolveLocalConfig(steamDirectory);
  const [appInfoBuffer, localConfigText] = await Promise.all([
    readFile(path.join(steamDirectory, "appcache", "appinfo.vdf")),
    readFile(localConfigPath, "utf8"),
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

  await clearGeneratedCovers();
  const catalog = [];
  for (const game of games) {
    const sourceCover = await findCover(steamDirectory, game.appId);
    const image = sourceCover ? `/games/steam-${game.appId}.webp` : null;
    if (sourceCover) {
      await renderCover(
        sourceCover,
        path.join(coverDirectory, `steam-${game.appId}.webp`),
      );
    }
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
  await writeFile(catalogPath, `${JSON.stringify(generated, null, 2)}\n`, "utf8");

  const withCover = catalog.filter((game) => game.image).length;
  const appInfoTime = (await stat(path.join(steamDirectory, "appcache", "appinfo.vdf")))
    .mtime;
  console.log(
    `Synced ${catalog.length} played Steam games (${withCover} covers) from cache updated ${appInfoTime.toISOString()}.`,
  );
  console.log(
    "Private account identifiers and playtime were not written to the catalog.",
  );
}

await main();
