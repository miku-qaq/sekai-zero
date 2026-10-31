export const companionTiming = {
  firstVisit: 12_000,
  visible: 11_000,
  cooldown: 60_000,
  reaction: 820,
  message: 2_200,
  departure: 260,
} as const;

export const companionStorageKeys = {
  preference: "sekai-companion",
  nextVisit: "sekai-companion-next-visit",
  nextCharacter: "sekai-companion-next-character",
} as const;

export type CompanionAppearance = {
  character: number;
  phase: "peeking" | "responding" | "leaving";
  message: boolean;
};

type Timer = ReturnType<typeof setTimeout>;
type CompanionClock = {
  now: () => number;
  setTimeout: (callback: () => void, delay: number) => Timer;
  clearTimeout: (timer: Timer) => void;
};

export type CompanionStorage = {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
};

/** A small schedule with injectable time; it never polls or runs while blocked. */
export function createCompanionController({
  storage,
  clock,
  onChange,
  onPrepare,
  firstCharacter = 0,
}: {
  storage: CompanionStorage;
  clock: CompanionClock;
  onChange: (appearance: CompanionAppearance | null) => void;
  onPrepare?: (character: number) => void;
  firstCharacter?: number;
}) {
  const timers = new Map<string, Timer>();
  let appearance: CompanionAppearance | null = null;
  let blocked = false;
  let held = false;
  let stopped = false;
  let leaveAt = 0;
  let nextVisit = 0;

  function cancel(name: string) {
    const timer = timers.get(name);
    if (timer !== undefined) clock.clearTimeout(timer);
    timers.delete(name);
  }

  function later(name: string, delay: number, callback: () => void) {
    cancel(name);
    timers.set(
      name,
      clock.setTimeout(
        () => {
          timers.delete(name);
          if (!stopped) callback();
        },
        Math.max(0, delay),
      ),
    );
  }

  function cancelAll() {
    for (const timer of timers.values()) clock.clearTimeout(timer);
    timers.clear();
  }

  function publish(value: CompanionAppearance | null) {
    appearance = value;
    if (!stopped) onChange(value);
  }

  function saveNextVisit(value: number) {
    nextVisit = value;
    storage.setItem(companionStorageKeys.nextVisit, String(value));
  }

  function planVisit() {
    if (blocked || stopped || appearance) return;
    if (onPrepare) {
      later("prepare", nextVisit - clock.now() - 4_000, () =>
        onPrepare(nextCharacter()),
      );
    }
    later("visit", nextVisit - clock.now(), show);
  }

  function nextCharacter() {
    const saved = storage.getItem(companionStorageKeys.nextCharacter);
    const parsed = saved === null ? firstCharacter : Number(saved);
    return Number.isInteger(parsed) ? ((parsed % 3) + 3) % 3 : 0;
  }

  function leave() {
    if (!appearance || appearance.phase === "leaving" || held) return;
    cancel("hide");
    cancel("reaction");
    cancel("message");
    saveNextVisit(clock.now() + companionTiming.cooldown);
    publish({ ...appearance, phase: "leaving", message: false });
    later("departure", companionTiming.departure, () => {
      publish(null);
      planVisit();
    });
  }

  function planDeparture() {
    if (stopped || !appearance || appearance.phase === "leaving") return;
    later("hide", leaveAt - clock.now(), leave);
  }

  function show() {
    if (blocked || stopped || appearance) return;
    const character = nextCharacter();
    storage.setItem(companionStorageKeys.nextCharacter, String((character + 1) % 3));
    leaveAt = clock.now() + companionTiming.visible;
    // Reserve the next slot now, so a full-page navigation cannot summon it again.
    saveNextVisit(leaveAt + companionTiming.cooldown);
    publish({ character, phase: "peeking", message: false });
    planDeparture();
  }

  return {
    start(initiallyBlocked = false) {
      blocked = initiallyBlocked;
      const now = clock.now();
      const parsed = Number(storage.getItem(companionStorageKeys.nextVisit));
      // Stale timestamps get a quiet arrival; a changed clock cannot hide it for hours.
      const storedVisit = Number.isFinite(parsed)
        ? Math.min(parsed, now + companionTiming.visible + companionTiming.cooldown)
        : now;
      saveNextVisit(Math.max(now + companionTiming.firstVisit, storedVisit));
      planVisit();
    },
    setBlocked(value: boolean) {
      if (blocked === value || stopped) return;
      blocked = value;
      cancelAll();
      held = false;
      saveNextVisit(Math.max(nextVisit, clock.now() + companionTiming.cooldown));
      if (appearance) publish(null);
      planVisit();
    },
    setHeld(value: boolean) {
      if (stopped || held === value) return;
      held = value;
      if (!value) planDeparture();
    },
    respond() {
      if (blocked || stopped || !appearance || appearance.phase !== "peeking") return;
      leaveAt = Math.max(leaveAt, clock.now() + companionTiming.message + 200);
      publish({ ...appearance, phase: "responding", message: true });
      later("reaction", companionTiming.reaction, () => {
        if (appearance) publish({ ...appearance, phase: "peeking" });
      });
      later("message", companionTiming.message, () => {
        if (appearance) publish({ ...appearance, message: false });
      });
      planDeparture();
    },
    summon() {
      if (blocked || stopped) return;
      cancel("visit");
      cancel("prepare");
      show();
    },
    destroy() {
      stopped = true;
      cancelAll();
    },
  };
}
