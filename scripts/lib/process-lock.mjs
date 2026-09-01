import { open, readFile, rename, rm } from "node:fs/promises";
import process from "node:process";

function processIsRunning(pid) {
  try {
    process.kill(pid, 0);
    return true;
  } catch (error) {
    return error?.code === "EPERM";
  }
}

async function readOwner(lockPath) {
  try {
    const parsed = JSON.parse(await readFile(lockPath, "utf8"));
    return Number.isInteger(parsed?.pid) && parsed.pid > 0 ? parsed : null;
  } catch {
    return null;
  }
}

/**
 * Acquire a cross-platform, process-scoped lock before touching recovery state.
 * Stale locks with a dead PID are reclaimed through an atomic rename so two
 * recovery attempts cannot both remove a newly acquired lock.
 */
export async function acquireProcessLock({
  lockPath,
  label,
  allowUnknownStale = false,
}) {
  for (let attempt = 0; attempt < 4; attempt += 1) {
    let handle;
    try {
      handle = await open(lockPath, "wx");
    } catch (error) {
      if (error?.code !== "EEXIST") throw error;

      const owner = await readOwner(lockPath);
      if (owner && processIsRunning(owner.pid)) {
        throw new Error(`${label} is already running in process ${owner.pid}.`);
      }
      if (!owner && !allowUnknownStale) {
        throw new Error(
          `${label} found an unreadable lock. Confirm no sync is running, then retry with the explicit recovery flag.`,
        );
      }

      const quarantine = `${lockPath}.stale-${process.pid}-${Date.now()}-${attempt}`;
      try {
        await rename(lockPath, quarantine);
      } catch (renameError) {
        if (renameError?.code === "ENOENT") continue;
        throw renameError;
      }
      await rm(quarantine, { force: true });
      continue;
    }

    try {
      await handle.writeFile(
        `${JSON.stringify({ pid: process.pid, startedAt: new Date().toISOString() })}\n`,
        "utf8",
      );
    } catch (error) {
      await handle.close();
      await rm(lockPath, { force: true });
      throw error;
    }

    let released = false;
    return async () => {
      if (released) return;
      released = true;
      await handle.close();
      await rm(lockPath, { force: true });
    };
  }

  throw new Error(`${label} could not acquire its process lock; retry later.`);
}
