/** Draw without repeats until every question has had a turn. Nothing is persisted. */
export function drawResearchQuestion(
  count: number,
  current: number | null,
  remaining: readonly number[],
  random: () => number = Math.random,
) {
  if (count < 1) return null;
  const pool = remaining.length
    ? [...remaining]
    : Array.from({ length: count }, (_, index) => index);
  const alternatives = pool.filter((index) => index !== current);
  const candidates = alternatives.length ? alternatives : pool;
  const sample = random();
  const normalized = Number.isFinite(sample)
    ? Math.min(0.999999999, Math.max(0, sample))
    : 0;
  const index = candidates[Math.floor(normalized * candidates.length)];
  return { index, remaining: pool.filter((entry) => entry !== index) };
}
