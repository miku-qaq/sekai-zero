import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import vm from "node:vm";
import ts from "typescript";

const moduleNames = [
  "browser-timers",
  "roaming-notebook",
  "fortune-draw",
  "character-companion",
];
const compiled = new Map(
  await Promise.all(
    moduleNames.map(async (name) => {
      const source = await readFile(
        new URL(`../lib/${name}.ts`, import.meta.url),
        "utf8",
      );
      return [
        name,
        ts.transpileModule(source, {
          compilerOptions: {
            target: ts.ScriptTarget.ES2020,
            module: ts.ModuleKind.CommonJS,
          },
        }).outputText,
      ];
    }),
  ),
);

/** Node timers accept arbitrary receivers, so reproduce the browser contract in a realm. */
function browserRealm() {
  const context = vm.createContext({});
  vm.runInContext(
    `
    let now = 100000, serial = 0;
    const jobs = new Map();
    globalThis.setTimeout = function (callback, delay) {
      "use strict";
      if (this !== globalThis) throw new TypeError("Illegal invocation: setTimeout");
      const id = ++serial;
      jobs.set(id, { callback, at: now + delay });
      return id;
    };
    globalThis.clearTimeout = function (id) {
      "use strict";
      if (this !== globalThis) throw new TypeError("Illegal invocation: clearTimeout");
      jobs.delete(id);
    };
    globalThis.testClock = {
      now: () => now,
      pending: () => jobs.size,
      tick(ms) {
        const end = now + ms;
        while (true) {
          const next = [...jobs].filter(([, job]) => job.at <= end)
            .sort((a, b) => a[1].at - b[1].at)[0];
          if (!next) break;
          jobs.delete(next[0]);
          now = next[1].at;
          next[1].callback();
        }
        now = end;
      },
    };
  `,
    context,
  );
  function load(name) {
    return vm.runInContext(
      `(function(exports) { ${compiled.get(name)}; return exports; })({})`,
      context,
    );
  }
  return {
    load,
    timers: load("browser-timers").browserTimers,
    oldClock: vm.runInContext("({ setTimeout, clearTimeout })", context),
    clock: vm.runInContext("testClock", context),
  };
}

test("unbound native timers reproduce Illegal invocation; the adapter preserves the global receiver", () => {
  const { timers, oldClock, clock } = browserRealm();
  assert.throws(() => oldClock.setTimeout(() => {}, 10), {
    name: "TypeError",
    message: /Illegal invocation: setTimeout/,
  });
  const cancelled = timers.setTimeout(() => assert.fail("cancelled timer ran"), 10);
  assert.throws(() => oldClock.clearTimeout(cancelled), {
    name: "TypeError",
    message: /Illegal invocation: clearTimeout/,
  });
  timers.clearTimeout(cancelled);
  let ran = false;
  const detached = timers.setTimeout;
  detached(() => {
    ran = true;
  }, 10);
  clock.tick(10);
  assert.equal(ran, true);
  assert.equal(clock.pending(), 0);
});

test("the roaming tracker starts, cancels and destroys with browser receiver checks", () => {
  const { timers, oldClock, clock, load } = browserRealm();
  const { createRoamingVisitTracker, roamingVisitDelay } = load("roaming-notebook");
  const old = createRoamingVisitTracker({ clock: oldClock, record() {} });
  old.setVisible(true);
  assert.throws(() => old.navigate("/"), {
    name: "TypeError",
    message: /Illegal invocation/,
  });

  const visits = [];
  const tracker = createRoamingVisitTracker({
    clock: timers,
    record: (place) => visits.push(place),
  });
  tracker.setVisible(true);
  tracker.navigate("/");
  assert.equal(clock.pending(), 1);
  tracker.setVisible(false);
  clock.tick(roamingVisitDelay);
  assert.deepEqual(visits, []);
  tracker.setVisible(true);
  clock.tick(roamingVisitDelay);
  assert.deepEqual(visits, ["home"]);
  tracker.navigate("/about/");
  tracker.destroy();
  clock.tick(roamingVisitDelay);
  assert.deepEqual(visits, ["home"]);
  assert.equal(clock.pending(), 0);
});

test("fortune reveal can cancel motion and destroy without an unbound clearTimeout", () => {
  const { timers, clock, load } = browserRealm();
  const { createFortuneReveal } = load("fortune-draw");
  let motion = true;
  const selected = [];
  const phases = [];
  const reveal = createFortuneReveal({
    clock: timers,
    motionAllowed: () => motion,
    onSelect: (id) => selected.push(id),
    onPhase: (phase) => phases.push(phase),
  });
  reveal.reveal("first", true);
  motion = false;
  reveal.motionChanged();
  assert.deepEqual(selected, ["first"]);
  assert.equal(clock.pending(), 0);
  motion = true;
  reveal.reveal("second", true);
  clock.tick(220);
  assert.deepEqual(selected, ["first", "second"]);
  reveal.destroy();
  const count = phases.length;
  clock.tick(280);
  assert.equal(phases.length, count);
  assert.equal(clock.pending(), 0);
});

test("the companion can start, pause, resume and clean up every browser timer", () => {
  const { timers, clock, load } = browserRealm();
  const { createCompanionController, companionTiming } = load("character-companion");
  const values = new Map();
  const appearances = [];
  const companion = createCompanionController({
    clock: { ...timers, now: clock.now },
    storage: {
      getItem: (key) => values.get(key) ?? null,
      setItem: (key, value) => values.set(key, value),
    },
    onChange: (appearance) => appearances.push(appearance),
    onPrepare() {},
  });
  companion.start();
  assert.equal(clock.pending(), 2);
  companion.setBlocked(true);
  assert.equal(clock.pending(), 0);
  companion.setBlocked(false);
  clock.tick(companionTiming.cooldown);
  assert.equal(appearances.at(-1).phase, "peeking");
  companion.respond();
  assert.equal(clock.pending(), 3);
  companion.destroy();
  const count = appearances.length;
  clock.tick(120000);
  assert.equal(appearances.length, count);
  assert.equal(clock.pending(), 0);
});
