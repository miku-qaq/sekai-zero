export type CapsulePhase = "idle" | "turning" | "dropping" | "revealing";

export const capsuleTiming = {
  turning: 520,
  dropping: 460,
  revealing: 380,
} as const;

type Timer = ReturnType<typeof globalThis.setTimeout>;

/** One turn dispenses one piece. Animation cancellation still delivers the piece. */
export function createCapsuleDraw({
  clock,
  motionAllowed,
  onSelect,
  onPhase,
}: {
  clock: {
    setTimeout: (callback: () => void, delay: number) => Timer;
    clearTimeout: (timer: Timer) => void;
  };
  motionAllowed: () => boolean;
  onSelect: (id: string) => void;
  onPhase: (phase: CapsulePhase) => void;
}) {
  let timer: Timer | null = null;
  let pending: string | null = null;
  let busy = false;
  let destroyed = false;
  let generation = 0;

  function cancelTimer() {
    if (timer !== null) clock.clearTimeout(timer);
    timer = null;
  }

  function active(run: number) {
    return !destroyed && busy && generation === run;
  }

  function schedule(callback: () => void, delay: number, run: number) {
    // A callback may synchronously finish or destroy the controller.
    if (!active(run)) return;
    timer = clock.setTimeout(() => {
      if (!active(run)) return;
      timer = null;
      callback();
    }, delay);
  }

  function selectPending() {
    if (pending === null || destroyed) return;
    const id = pending;
    pending = null;
    onSelect(id);
  }

  function finish() {
    if (destroyed || !busy) return;
    const run = ++generation;
    cancelTimer();
    busy = false;
    selectPending();
    if (!destroyed && generation === run) onPhase("idle");
  }

  return {
    draw(id: string) {
      if (destroyed || busy) return false;
      const run = ++generation;
      busy = true;
      pending = id;
      if (!motionAllowed()) {
        finish();
        return true;
      }

      onPhase("turning");
      schedule(
        () => {
          onPhase("dropping");
          schedule(
            () => {
              selectPending();
              if (!active(run)) return;
              onPhase("revealing");
              schedule(finish, capsuleTiming.revealing, run);
            },
            capsuleTiming.dropping,
            run,
          );
        },
        capsuleTiming.turning,
        run,
      );
      return true;
    },
    finish,
    motionChanged() {
      if (!destroyed && busy && !motionAllowed()) finish();
    },
    destroy() {
      destroyed = true;
      busy = false;
      pending = null;
      generation += 1;
      cancelTimer();
    },
  };
}
