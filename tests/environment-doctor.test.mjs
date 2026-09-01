import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import {
  compareVersions,
  evaluateVersionPolicy,
  extractMinimumVersion,
  extractPackageManagerVersion,
  findUnsafeTrackedFiles,
  parseVersion,
} from "../scripts/environment-doctor.mjs";

const projectUrl = new URL("../", import.meta.url);

test("parses and compares the pinned runtime versions", () => {
  assert.deepEqual(parseVersion("v22.14.0"), [22, 14, 0]);
  assert.deepEqual(parseVersion("10.9.2"), [10, 9, 2]);
  assert.equal(parseVersion("not-a-version"), null);
  assert.equal(compareVersions("22.14.0", "22.14.0"), 0);
  assert.equal(compareVersions("22.15.0", "22.14.0"), 1);
  assert.equal(compareVersions("22.13.9", "22.14.0"), -1);
  assert.equal(extractMinimumVersion(">=22.14.0"), "22.14.0");
  assert.equal(extractPackageManagerVersion("npm@10.9.2"), "10.9.2");
});

test("separates incompatible runtimes from recommended-version drift", () => {
  const compatible = evaluateVersionPolicy({
    currentNode: "22.14.0",
    minimumNode: "22.14.0",
    pinnedNode: "22.14.0",
    currentNpm: "10.9.2",
    pinnedNpm: "10.9.2",
  });
  assert.ok(compatible.every((check) => check.level === "ok"));

  const outdated = evaluateVersionPolicy({
    currentNode: "22.13.0",
    minimumNode: "22.14.0",
    pinnedNode: "22.14.0",
    currentNpm: "10.9.2",
    pinnedNpm: "10.9.2",
  });
  assert.ok(outdated.some((check) => check.level === "error"));

  const newerMajor = evaluateVersionPolicy({
    currentNode: "24.0.0",
    minimumNode: "22.14.0",
    pinnedNode: "22.14.0",
    currentNpm: "11.0.0",
    pinnedNpm: "10.9.2",
  });
  assert.ok(newerMajor.some((check) => check.level === "warn"));
  assert.ok(!newerMajor.some((check) => check.level === "error"));
});

test("rejects tracked secrets and generated output without reading their contents", () => {
  assert.deepEqual(
    findUnsafeTrackedFiles([
      ".env.example",
      ".dev.vars.example",
      "app/page.tsx",
      ".env.local",
      ".dev.vars",
      "app/.ENV.production",
      "config/.dev.vars.preview",
      "node_modules/example/index.js",
      "packages/site/node_modules/example/index.js",
      "dist/server/index.js",
    ]),
    [
      ".env.local",
      ".dev.vars",
      "app/.ENV.production",
      "config/.dev.vars.preview",
      "node_modules/example/index.js",
      "packages/site/node_modules/example/index.js",
      "dist/server/index.js",
    ],
  );
});

test("keeps macOS bootstrap files and package scripts aligned", async () => {
  const [packageSource, nvmVersion, nodeVersion, attributes, guide] = await Promise.all(
    [
      readFile(new URL("package.json", projectUrl), "utf8"),
      readFile(new URL(".nvmrc", projectUrl), "utf8"),
      readFile(new URL(".node-version", projectUrl), "utf8"),
      readFile(new URL(".gitattributes", projectUrl), "utf8"),
      readFile(new URL("docs/MACOS_SETUP.md", projectUrl), "utf8"),
    ],
  );
  const packageJson = JSON.parse(packageSource);

  assert.equal(nvmVersion.trim(), "22.14.0");
  assert.equal(nodeVersion.trim(), nvmVersion.trim());
  assert.equal(packageJson.engines.node, ">=22.14.0");
  assert.equal(packageJson.packageManager, "npm@10.9.2");
  assert.equal(packageJson.scripts.doctor, "node scripts/environment-doctor.mjs");
  assert.match(packageJson.scripts["test:content"], /environment-doctor\.test\.mjs/);
  assert.match(packageJson.scripts["test:content"], /steam-snapshot-safety\.test\.mjs/);
  assert.match(packageJson.scripts["check:pages"], /PAGES_BASE_PATH=\/sekai-zero/);
  assert.match(attributes, /^\* text=auto eol=lf$/m);
  assert.match(guide, /git clone https:\/\/github\.com\/miku-qaq\/sekai-zero\.git/);
  assert.match(guide, /npm ci --ignore-scripts --no-audit --no-fund/);
  assert.match(guide, /npm run doctor/);
  assert.match(guide, /不要从 Windows 复制以下内容到 Mac/);
  assert.match(guide, /- `node_modules`/);
});
