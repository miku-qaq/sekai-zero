import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import ts from "typescript";

// Exercise the actual scheduler on every supported Node version without a TS loader.
const source = await readFile(
  new URL("../lib/character-companion.ts", import.meta.url),
  "utf8",
);
const compiled = ts.transpileModule(source, {
  compilerOptions: { target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.ESNext },
}).outputText;
const {
  createCompanionController,
  companionStorageKeys: keys,
  companionTiming: timing,
} = await import(
  `data:text/javascript;base64,${Buffer.from(compiled).toString("base64")}`
);

function clockAt(start = 1_000_000) {
  let now = start;
  let id = 0;
  const pending = new Map();
  return {
    now: () => now,
    setTimeout(callback, delay) {
      const key = ++id;
      pending.set(key, { at: now + delay, callback });
      return key;
    },
    clearTimeout(key) {
      pending.delete(key);
    },
    tick(duration) {
      const end = now + duration;
      let steps = 0;
      while (true) {
        const entry = [...pending.entries()]
          .filter(([, job]) => job.at <= end)
          .sort((a, b) => a[1].at - b[1].at)[0];
        if (!entry) break;
        assert.ok(++steps < 100, "timers must not spin at the same timestamp");
        pending.delete(entry[0]);
        now = entry[1].at;
        entry[1].callback();
      }
      now = end;
    },
    pending: () => pending.size,
  };
}

function setup({
  values = new Map(),
  clock = clockAt(),
  firstCharacter = 0,
  onPrepare,
} = {}) {
  const states = [];
  const controller = createCompanionController({
    clock,
    firstCharacter,
    onPrepare,
    storage: {
      getItem: (key) => values.get(key) ?? null,
      setItem: (key, value) => values.set(key, value),
    },
    onChange: (state) => states.push(state),
  });
  return { controller, clock, states, values, current: () => states.at(-1) ?? null };
}

test("a quiet first arrival leaves after eleven seconds and waits a full minute", () => {
  const { controller, clock, current } = setup();
  controller.start();
  clock.tick(timing.firstVisit - 1);
  assert.equal(current(), null);
  clock.tick(1);
  assert.deepEqual(current(), { character: 0, phase: "peeking", message: false });
  clock.tick(timing.visible);
  assert.equal(current().phase, "leaving");
  clock.tick(timing.departure);
  assert.equal(current(), null);
  clock.tick(timing.cooldown - timing.departure - 1);
  assert.equal(current(), null);
  clock.tick(1);
  assert.equal(current().character, 1);
});

test("a new document retains cooldown and rotates to the next character", () => {
  const first = setup({ firstCharacter: 2 });
  first.controller.start();
  first.clock.tick(timing.firstVisit);
  assert.equal(first.current().character, 2);
  first.controller.destroy();
  assert.equal(first.clock.pending(), 0);

  const second = setup({ values: first.values, clock: first.clock });
  second.controller.start();
  second.clock.tick(timing.visible + timing.cooldown - 1);
  assert.equal(second.current(), null);
  second.clock.tick(1);
  assert.equal(second.current().character, 0);
});

test("dialogs, hidden tabs or input interruption cancel the visit and resume quietly", () => {
  const { controller, clock, current } = setup();
  controller.start();
  clock.tick(timing.firstVisit);
  controller.respond();
  controller.setBlocked(true);
  assert.equal(current(), null);
  assert.equal(clock.pending(), 0);
  clock.tick(5 * timing.cooldown);
  assert.equal(current(), null);
  controller.setBlocked(false);
  clock.tick(timing.cooldown - 1);
  assert.equal(current(), null);
  clock.tick(1);
  assert.equal(current().character, 1);
});

test("hover or keyboard focus holds the current visitor without polling", () => {
  const { controller, clock, current } = setup();
  controller.start();
  clock.tick(timing.firstVisit);
  controller.setHeld(true);
  clock.tick(timing.visible + 30_000);
  assert.equal(current().phase, "peeking");
  assert.equal(clock.pending(), 0);
  controller.setHeld(false);
  clock.tick(0);
  assert.equal(current().phase, "leaving");
  clock.tick(timing.departure);
  assert.equal(current(), null);
});

test("greetings are explicit, repeated clicks do not queue, and messages expire", () => {
  const { controller, clock, current, states } = setup();
  controller.start();
  clock.tick(timing.firstVisit);
  assert.equal(current().message, false);
  controller.respond();
  assert.equal(current().phase, "responding");
  assert.equal(current().message, true);
  const count = states.length;
  controller.respond();
  assert.equal(states.length, count);
  clock.tick(timing.reaction);
  assert.equal(current().phase, "peeking");
  clock.tick(timing.message - timing.reaction);
  assert.equal(current().message, false);
});

test("manual summons respect interruption and destruction prevents late callbacks", () => {
  const { controller, clock, states } = setup();
  controller.start(true);
  controller.summon();
  clock.tick(60_000);
  assert.equal(states.length, 0);
  controller.setBlocked(false);
  controller.summon();
  assert.equal(states.at(-1).phase, "peeking");
  controller.respond();
  controller.destroy();
  const count = states.length;
  controller.setHeld(true);
  controller.setHeld(false);
  controller.setBlocked(false);
  controller.summon();
  clock.tick(120_000);
  assert.equal(states.length, count);
  assert.equal(clock.pending(), 0);
});

test("corrupt or clock-skewed storage cannot cause a burst or an hours-long wait", () => {
  for (const value of ["broken", "Infinity", "-123", "999999999999999"]) {
    const context = setup({ values: new Map([[keys.nextVisit, value]]) });
    context.controller.start();
    context.clock.tick(timing.firstVisit - 1);
    assert.equal(context.current(), null);
    context.clock.tick(timing.visible + timing.cooldown);
    assert.ok(context.states.some((state) => state?.phase === "peeking"));
  }
});

test("only the upcoming portrait is prepared shortly before its visit", () => {
  const prepared = [];
  const context = setup({
    firstCharacter: 1,
    onPrepare: (index) => prepared.push(index),
  });
  context.controller.start();
  context.clock.tick(timing.firstVisit - 4_001);
  assert.deepEqual(prepared, []);
  context.clock.tick(1);
  assert.deepEqual(prepared, [1]);
  context.clock.tick(4_000 + timing.visible + timing.departure);
  context.controller.setBlocked(true);
  context.clock.tick(120_000);
  assert.deepEqual(prepared, [1]);
  context.controller.destroy();
});
