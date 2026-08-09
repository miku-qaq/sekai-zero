import { access, cp, mkdir, readdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const clientDirectory = path.join(root, "dist", "client");
const pagesDirectory = path.join(root, "dist", "pages");

function normalizedBaseSegment() {
  return process.env.PAGES_BASE_PATH?.trim().replace(/^\/+|\/+$/g, "") ?? "";
}

function assertInsideDist(target) {
  const distDirectory = path.join(root, "dist");
  const relative = path.relative(distDirectory, target);
  if (!relative || relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new Error(`Refusing to prepare Pages outside dist: ${target}`);
  }
}

assertInsideDist(pagesDirectory);
await access(path.join(clientDirectory, "index.html"));
await rm(pagesDirectory, { recursive: true, force: true });
await mkdir(pagesDirectory, { recursive: true });

const baseSegment = normalizedBaseSegment();
const nestedAssetDirectory = baseSegment
  ? path.join(clientDirectory, baseSegment, "_next")
  : path.join(clientDirectory, "_next");

// Vinext writes assetPrefix chunks into a nested folder. GitHub Pages mounts
// the uploaded artifact at the project path already, so flatten that one level
// while keeping the prefixed URLs in index.html.
await cp(nestedAssetDirectory, path.join(pagesDirectory, "_next"), {
  recursive: true,
});

for (const entry of await readdir(clientDirectory, { withFileTypes: true })) {
  if (entry.name === ".vite" || entry.name === "vinext-client-entry-manifest.json") {
    continue;
  }
  if (baseSegment && entry.isDirectory() && entry.name === baseSegment) {
    continue;
  }

  await cp(
    path.join(clientDirectory, entry.name),
    path.join(pagesDirectory, entry.name),
    { recursive: entry.isDirectory() },
  );
}

/**
 * GitHub Pages serves `/about/` from `about/index.html`. Vinext cannot emit
 * that shape directly today because its export crawler rejects the framework's
 * own trailing-slash redirect, so materialize equivalent directory entries
 * without deleting the canonical `about.html` fallback.
 */
async function materializeDirectoryRoutes(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const source = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      if (entry.name !== "_next") await materializeDirectoryRoutes(source);
      continue;
    }

    if (
      !entry.isFile() ||
      !entry.name.endsWith(".html") ||
      entry.name === "index.html" ||
      entry.name === "404.html"
    ) {
      continue;
    }

    const routeDirectory = path.join(directory, entry.name.slice(0, -".html".length));
    const routeIndex = path.join(routeDirectory, "index.html");
    assertInsideDist(routeIndex);
    await mkdir(routeDirectory, { recursive: true });
    await cp(source, routeIndex);
  }
}

await materializeDirectoryRoutes(pagesDirectory);

// GitHub Pages must not let Jekyll discard the framework's `_next` directory.
await writeFile(path.join(pagesDirectory, ".nojekyll"), "", "utf8");
