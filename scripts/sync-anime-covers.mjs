import { execFileSync } from "node:child_process";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import sharp from "sharp";

const projectRoot = process.cwd();
const sourcePath = path.join(projectRoot, "content", "anime-source.json");
const catalogPath = path.join(projectRoot, "content", "anime-catalog.json");
const coverDirectory = path.join(projectRoot, "public", "anime");
const cacheDirectory = process.env.ANIME_SYNC_CACHE_DIR
  ? path.resolve(projectRoot, process.env.ANIME_SYNC_CACHE_DIR)
  : undefined;
const userAgent = "sekai-zero/0.1.0 (https://github.com/miku-qaq/sekai-zero)";

/**
 * Fetches with the platform-neutral Web API first and falls back to curl.
 *
 * Some managed Windows environments block Node's direct TLS connection while
 * still allowing the system network client. macOS and normal CI environments
 * continue to use fetch, so this maintenance script remains portable.
 */
async function requestBuffer(url) {
  let fetchError;

  if (process.env.ANIME_SYNC_USE_CURL !== "1") {
    try {
      const response = await fetch(url, {
        headers: { "User-Agent": userAgent },
        signal: AbortSignal.timeout(30_000),
      });

      if (!response.ok) {
        throw new Error(response.status + " " + response.statusText);
      }

      return Buffer.from(await response.arrayBuffer());
    } catch (error) {
      fetchError = error;
    }
  }

  const executable = process.platform === "win32" ? "curl.exe" : "curl";

  try {
    return execFileSync(
      executable,
      [
        "--location",
        "--fail",
        "--silent",
        "--show-error",
        "--max-time",
        "45",
        "--user-agent",
        userAgent,
        url,
      ],
      { encoding: "buffer", maxBuffer: 12 * 1024 * 1024 },
    );
  } catch (curlError) {
    throw new AggregateError(
      [fetchError ?? new Error("fetch intentionally skipped"), curlError],
      "Unable to retrieve " + url,
    );
  }
}

function normalizedFormat(platform) {
  const value = String(platform ?? "").trim();
  const formats = {
    TV: "TV",
    WEB: "网络动画",
    Web: "网络动画",
    OVA: "OVA",
    OAD: "OAD",
    剧场版: "动画电影",
    MOVIE: "动画电影",
  };

  return formats[value] ?? (value || "动画");
}

function titleYear(date) {
  const match = /^\d{4}/.exec(String(date ?? ""));
  return match ? Number(match[0]) : null;
}

const source = JSON.parse(await readFile(sourcePath, "utf8"));
const seenIds = new Set();
const seenBangumiIds = new Set();

for (const item of source) {
  if (!item.id || !item.rawTitle || !Number.isInteger(item.bangumiId)) {
    throw new Error("Invalid anime source entry: " + JSON.stringify(item));
  }
  if (seenIds.has(item.id)) throw new Error("Duplicate anime id: " + item.id);
  if (seenBangumiIds.has(item.bangumiId)) {
    throw new Error("Duplicate Bangumi subject id: " + item.bangumiId);
  }
  seenIds.add(item.id);
  seenBangumiIds.add(item.bangumiId);
}

await mkdir(coverDirectory, { recursive: true });

const catalog = [];
for (const [index, item] of source.entries()) {
  const subjectUrl = "https://api.bgm.tv/v0/subjects/" + item.bangumiId;
  const cachedDetail = cacheDirectory
    ? path.join(cacheDirectory, item.id + ".json")
    : undefined;
  const cachedCover = cacheDirectory
    ? path.join(cacheDirectory, item.id + ".image")
    : undefined;
  const detail = JSON.parse(
    (cachedDetail
      ? await readFile(cachedDetail)
      : await requestBuffer(subjectUrl)
    ).toString("utf8"),
  );
  const imageSource =
    detail.images?.large ?? detail.images?.common ?? detail.images?.medium;

  if (!imageSource) {
    throw new Error("Bangumi subject " + item.bangumiId + " has no usable cover image");
  }

  const cover = cachedCover
    ? await readFile(cachedCover)
    : await requestBuffer(imageSource);
  const assetName = item.id + ".webp";
  const assetPath = path.join(coverDirectory, assetName);

  await sharp(cover)
    .rotate()
    .resize(420, 630, {
      fit: "cover",
      position: "centre",
      withoutEnlargement: false,
    })
    .webp({ quality: 78, effort: 5, smartSubsample: true })
    .toFile(assetPath);

  catalog.push({
    id: item.id,
    title: detail.name_cn || detail.name,
    image: "/anime/" + assetName,
    year: titleYear(detail.date),
    format: normalizedFormat(detail.platform),
    status: "watched",
    source: {
      label: "Bangumi",
      url: "https://bgm.tv/subject/" + item.bangumiId,
      imageUrl: imageSource,
      matchedTitle: detail.name_cn || detail.name,
    },
  });

  process.stdout.write(
    "[" +
      String(index + 1).padStart(2, "0") +
      "/" +
      source.length +
      "] " +
      item.rawTitle +
      "\n",
  );
}

await writeFile(catalogPath, JSON.stringify(catalog, null, 2) + "\n", "utf8");
console.log("Synced " + catalog.length + " anime covers and catalog records.");
