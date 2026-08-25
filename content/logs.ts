import { releaseHistory } from "./releases";

/** Full log entries derive from the canonical release history. */
export const buildLogs = releaseHistory.map((release, index) => ({
  ...release,
  status: index === 0 ? "NOW ON AIR" : "ARCHIVED",
}));
