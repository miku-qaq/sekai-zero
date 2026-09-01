import assert from "node:assert/strict";
import {
  access,
  mkdtemp,
  mkdir,
  readFile,
  rename,
  rm,
  writeFile,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import {
  commitSnapshotTransaction,
  recoverSnapshotTransaction,
} from "../scripts/lib/snapshot-transaction.mjs";
import {
  assertSafeSteamCatalogChange,
  compareSteamCatalogs,
} from "../scripts/lib/steam-snapshot-policy.mjs";
import { acquireProcessLock } from "../scripts/lib/process-lock.mjs";

async function fixture() {
  const root = await mkdtemp(path.join(tmpdir(), "sekai-steam-"));
  const transactionRoot = path.join(root, "transaction");
  const committedMarker = path.join(root, "transaction.committed");
  const liveDirectory = path.join(root, "games");
  const liveFile = path.join(root, "games.json");
  const stagedDirectory = path.join(transactionRoot, "staged-directory");
  const stagedFile = path.join(transactionRoot, "staged-file");
  await mkdir(liveDirectory);
  await mkdir(stagedDirectory, { recursive: true });
  await writeFile(path.join(liveDirectory, "old.webp"), "old-cover");
  await writeFile(liveFile, "old-catalog");
  await writeFile(path.join(stagedDirectory, "new.webp"), "new-cover");
  await writeFile(stagedFile, "new-catalog");
  return {
    root,
    transactionRoot,
    committedMarker,
    liveDirectory,
    liveFile,
    stagedDirectory,
    stagedFile,
  };
}

const nativeOperations = { access, rename, rm, writeFile };

test("restores both old outputs when the second snapshot install fails", async () => {
  const paths = await fixture();
  const operations = {
    ...nativeOperations,
    async rename(source, destination) {
      if (source === paths.stagedFile) throw new Error("injected catalog move failure");
      return rename(source, destination);
    },
  };

  try {
    await assert.rejects(
      commitSnapshotTransaction({ ...paths, operations }),
      /injected catalog move failure/,
    );
    assert.equal(
      await readFile(path.join(paths.liveDirectory, "old.webp"), "utf8"),
      "old-cover",
    );
    assert.equal(await readFile(paths.liveFile, "utf8"), "old-catalog");
    await assert.rejects(access(paths.transactionRoot));
  } finally {
    await rm(paths.root, { recursive: true, force: true });
  }
});

test("keeps a committed snapshot when backup cleanup is deferred", async () => {
  const paths = await fixture();
  let committed = false;
  let warned = false;
  const operations = {
    ...nativeOperations,
    async writeFile(target, data, options) {
      await writeFile(target, data, options);
      if (target === paths.committedMarker) committed = true;
    },
    async rm(target, options) {
      if (target === paths.transactionRoot && committed) {
        throw new Error("injected cleanup lock");
      }
      return rm(target, options);
    },
  };

  try {
    await commitSnapshotTransaction({
      ...paths,
      operations,
      onCleanupWarning: () => {
        warned = true;
      },
    });
    assert.equal(warned, true);
    assert.equal(
      await readFile(path.join(paths.liveDirectory, "new.webp"), "utf8"),
      "new-cover",
    );
    assert.equal(await readFile(paths.liveFile, "utf8"), "new-catalog");

    assert.equal(await recoverSnapshotTransaction(paths), "committed-cleanup");
    assert.equal(await readFile(paths.liveFile, "utf8"), "new-catalog");
    await assert.rejects(access(paths.committedMarker));
  } finally {
    await rm(paths.root, { recursive: true, force: true });
  }
});

test("recovers old outputs after an interruption before COMMITTED", async () => {
  const paths = await fixture();
  const backupDirectory = path.join(paths.transactionRoot, "backup-directory");
  const backupFile = path.join(paths.transactionRoot, "backup-file");
  await rename(paths.liveDirectory, backupDirectory);
  await rename(paths.liveFile, backupFile);
  await rename(paths.stagedDirectory, paths.liveDirectory);
  await rename(paths.stagedFile, paths.liveFile);

  try {
    assert.equal(await recoverSnapshotTransaction(paths), "rolled-back");
    assert.equal(
      await readFile(path.join(paths.liveDirectory, "old.webp"), "utf8"),
      "old-cover",
    );
    assert.equal(await readFile(paths.liveFile, "utf8"), "old-catalog");
  } finally {
    await rm(paths.root, { recursive: true, force: true });
  }
});

test("rejects partial caches and retained cover loss by default", () => {
  const previous = [
    { appId: "10", image: "/games/steam-10.webp" },
    { appId: "20", image: "/games/steam-20.webp" },
  ];
  const partial = [{ appId: "10", image: null }];
  const comparison = compareSteamCatalogs(previous, partial);

  assert.equal(comparison.removed.length, 1);
  assert.equal(comparison.coversLost.length, 1);
  assert.throws(() => assertSafeSteamCatalogChange(comparison), /missing 1 existing/);
  assert.throws(
    () => assertSafeSteamCatalogChange(comparison, { allowRemovals: true }),
    /lose 1 existing cover/,
  );
});

test("a second sync cannot touch live data while the process lock is held", async () => {
  const root = await mkdtemp(path.join(tmpdir(), "sekai-steam-lock-"));
  const lockPath = path.join(root, "steam-sync.lock");
  const liveFile = path.join(root, "live.json");
  await writeFile(liveFile, "stable-live-data");
  const release = await acquireProcessLock({
    lockPath,
    label: "Steam library sync",
  });

  try {
    await assert.rejects(
      acquireProcessLock({ lockPath, label: "Steam library sync" }),
      /already running/,
    );
    assert.equal(await readFile(liveFile, "utf8"), "stable-live-data");
  } finally {
    await release();
    await rm(root, { recursive: true, force: true });
  }
});
