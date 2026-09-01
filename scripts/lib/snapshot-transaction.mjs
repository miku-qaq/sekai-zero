import { access, rename, rm, writeFile } from "node:fs/promises";
import path from "node:path";

const defaultOperations = { access, rename, rm, writeFile };

async function exists(target, operations = defaultOperations) {
  try {
    await operations.access(target);
    return true;
  } catch {
    return false;
  }
}

async function restoreBackup({ backup, live, directory, operations }) {
  if (!(await exists(backup, operations))) return false;
  if (await exists(live, operations)) {
    await operations.rm(live, { recursive: directory, force: true });
  }
  await operations.rename(backup, live);
  return true;
}

/**
 * Recover a snapshot whose process stopped before the COMMITTED marker existed.
 * A surviving marker means the new snapshot won; only its old backup is cleaned.
 */
export async function recoverSnapshotTransaction({
  transactionRoot,
  committedMarker,
  liveDirectory,
  liveFile,
  operations = defaultOperations,
}) {
  const transactionExists = await exists(transactionRoot, operations);
  const committed = await exists(committedMarker, operations);

  if (committed) {
    if (transactionExists) {
      await operations.rm(transactionRoot, { recursive: true, force: true });
    }
    await operations.rm(committedMarker, { force: true });
    return "committed-cleanup";
  }
  if (!transactionExists) return "none";

  const backupDirectory = path.join(transactionRoot, "backup-directory");
  const backupFile = path.join(transactionRoot, "backup-file");
  const directoryRestored = await restoreBackup({
    backup: backupDirectory,
    live: liveDirectory,
    directory: true,
    operations,
  });
  const fileRestored = await restoreBackup({
    backup: backupFile,
    live: liveFile,
    directory: false,
    operations,
  });
  await operations.rm(transactionRoot, { recursive: true, force: true });
  return directoryRestored || fileRestored ? "rolled-back" : "staging-cleanup";
}

/**
 * Install a generated directory + catalog as one recoverable snapshot.
 * Backup cleanup is deliberately outside the rollback block: a cleanup failure
 * must never delete the already committed new snapshot.
 */
export async function commitSnapshotTransaction({
  transactionRoot,
  committedMarker,
  stagedDirectory,
  stagedFile,
  liveDirectory,
  liveFile,
  operations = defaultOperations,
  onCleanupWarning = () => {},
}) {
  const backupDirectory = path.join(transactionRoot, "backup-directory");
  const backupFile = path.join(transactionRoot, "backup-file");

  try {
    if (await exists(liveDirectory, operations)) {
      await operations.rename(liveDirectory, backupDirectory);
    }
    if (await exists(liveFile, operations)) {
      await operations.rename(liveFile, backupFile);
    }
    await operations.rename(stagedDirectory, liveDirectory);
    await operations.rename(stagedFile, liveFile);
    await operations.writeFile(committedMarker, "COMMITTED\n", {
      encoding: "utf8",
      flag: "wx",
    });
  } catch (error) {
    await recoverSnapshotTransaction({
      transactionRoot,
      committedMarker,
      liveDirectory,
      liveFile,
      operations,
    });
    throw error;
  }

  try {
    await operations.rm(transactionRoot, { recursive: true, force: true });
    await operations.rm(committedMarker, { force: true });
  } catch (error) {
    onCleanupWarning(error);
  }
}
