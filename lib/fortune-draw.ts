/** Keep only known IDs; a broken or older local album never breaks the page. */
export function readFortuneAlbum(raw: string | null, ids: readonly string[]) {
  try {
    const value: unknown = JSON.parse(raw ?? "[]");
    if (!Array.isArray(value)) return [];
    const known = new Set(ids);
    return [
      ...new Set(
        value.filter((id): id is string => typeof id === "string" && known.has(id)),
      ),
    ];
  } catch {
    return [];
  }
}

/** Meet unseen cards first, while never immediately redrawing the visible card. */
export function nextFortune(
  ids: readonly string[],
  current: string,
  collected: readonly string[],
  random: () => number = Math.random,
) {
  const others = ids.filter((id) => id !== current);
  const unseen = others.filter((id) => !collected.includes(id));
  const pool = unseen.length ? unseen : others.length ? others : ids;
  if (!pool.length) return null;
  const sample = random();
  const normalized = Number.isFinite(sample)
    ? Math.min(0.999999999, Math.max(0, sample))
    : 0;
  return pool[Math.floor(normalized * pool.length)];
}

export type FortunePhase = "idle" | "drawing" | "revealing";
type Timer = ReturnType<typeof setTimeout>;

/** One bounded reveal. Repeated input cannot queue cards or steal button focus. */
export function createFortuneReveal({
  onSelect,
  onPhase,
  motionAllowed,
  clock,
}: {
  onSelect: (id: string, collect: boolean) => void;
  onPhase: (phase: FortunePhase) => void;
  motionAllowed: () => boolean;
  clock: {
    setTimeout: (callback: () => void, delay: number) => Timer;
    clearTimeout: (timer: Timer) => void;
  };
}) {
  let timer: Timer | null = null;
  let pending: { id: string; collect: boolean } | null = null;
  let busy = false;
  let destroyed = false;

  function cancel() {
    if (timer !== null) clock.clearTimeout(timer);
    timer = null;
  }

  function selectPending() {
    if (!pending || destroyed) return;
    const next = pending;
    pending = null;
    onSelect(next.id, next.collect);
  }

  function finish() {
    cancel();
    selectPending();
    busy = false;
    if (!destroyed) onPhase("idle");
  }

  return {
    reveal(id: string, collect: boolean) {
      if (busy || destroyed) return false;
      busy = true;
      pending = { id, collect };
      if (!motionAllowed()) {
        finish();
        return true;
      }
      onPhase("drawing");
      timer = clock.setTimeout(() => {
        timer = null;
        if (destroyed) return;
        selectPending();
        onPhase("revealing");
        timer = clock.setTimeout(finish, 280);
      }, 220);
      return true;
    },
    motionChanged() {
      if (!destroyed && busy && !motionAllowed()) finish();
    },
    destroy() {
      destroyed = true;
      pending = null;
      cancel();
    },
  };
}
