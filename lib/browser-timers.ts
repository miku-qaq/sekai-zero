/** Native browser timers require their global receiver when injected into a clock. */
export const browserTimers = {
  setTimeout: (callback: () => void, delay: number) =>
    globalThis.setTimeout(callback, delay),
  clearTimeout: (timer: ReturnType<typeof globalThis.setTimeout>) =>
    globalThis.clearTimeout(timer),
};
