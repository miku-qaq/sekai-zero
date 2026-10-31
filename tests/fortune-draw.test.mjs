import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import ts from "typescript";

const source = await readFile(
  new URL("../lib/fortune-draw.ts", import.meta.url),
  "utf8",
);
const compiled = ts.transpileModule(source, {
  compilerOptions: { target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.ESNext },
}).outputText;
const { readFortuneAlbum, nextFortune, createFortuneReveal } = await import(
  `data:text/javascript;base64,${Buffer.from(compiled).toString("base64")}`
);
const ids = [
  "miku-tomorrow",
  "elaina-detour",
  "bocchi-stage",
  "miku-rhythm",
  "elaina-curiosity",
  "bocchi-next-bar",
];

function setup(allowed = true) {
  let now = 0;
  let nextTimer = 0;
  let motion = allowed;
  const jobs = new Map();
  const phases = [];
  const selections = [];
  const clock = {
    setTimeout(callback, delay) {
      const id = ++nextTimer;
      jobs.set(id, { callback, at: now + delay });
      return id;
    },
    clearTimeout(id) {
      jobs.delete(id);
    },
  };
  const controller = createFortuneReveal({
    clock,
    motionAllowed: () => motion,
    onSelect: (id, collect) => selections.push({ id, collect }),
    onPhase: (phase) => phases.push(phase),
  });
  return {
    controller,
    phases,
    selections,
    jobs,
    reduce() {
      motion = false;
      controller.motionChanged();
    },
    tick(ms) {
      const target = now + ms;
      while (true) {
        const job = [...jobs.entries()]
          .filter(([, value]) => value.at <= target)
          .sort((a, b) => a[1].at - b[1].at)[0];
        if (!job) break;
        jobs.delete(job[0]);
        now = job[1].at;
        job[1].callback();
      }
      now = target;
    },
  };
}

test("local albums reject corrupt values and retain only unique known card IDs", () => {
  for (const raw of [null, "broken", "{}", "null", "123"])
    assert.deepEqual(readFortuneAlbum(raw, ids), []);
  assert.deepEqual(
    readFortuneAlbum(JSON.stringify([ids[2], ids[0], "unknown", ids[2], null, 1]), ids),
    [ids[2], ids[0]],
  );
});

test("a displayed preview is not collected, and six actual draws encounter all six cards", () => {
  let active = ids[0];
  const collected = [];
  for (let i = 0; i < ids.length; i += 1) {
    const next = nextFortune(ids, active, collected, () => 0.4);
    assert.notEqual(next, active);
    assert.ok(!collected.includes(next));
    collected.push(next);
    active = next;
  }
  assert.deepEqual([...collected].sort(), [...ids].sort());
});

test("a completed album can draw again without immediately repeating the visible card", () => {
  for (const current of ids) {
    for (const sample of [0, 0.5, 0.999, -1, 1, NaN]) {
      const selected = nextFortune(ids, current, ids, () => sample);
      assert.ok(ids.includes(selected));
      assert.notEqual(selected, current);
    }
  }
  assert.equal(nextFortune([], "", []), null);
  assert.equal(nextFortune(["only"], "only", []), "only");
});

test("one reveal takes 500ms, ignores rapid repeats, and selects the requested card once", () => {
  const { controller, phases, selections, tick, jobs } = setup();
  assert.equal(controller.reveal(ids[1], true), true);
  assert.equal(controller.reveal(ids[2], true), false);
  assert.deepEqual(phases, ["drawing"]);
  tick(219);
  assert.deepEqual(selections, []);
  tick(1);
  assert.deepEqual(selections, [{ id: ids[1], collect: true }]);
  assert.equal(phases.at(-1), "revealing");
  tick(279);
  assert.equal(controller.reveal(ids[3], true), false);
  tick(1);
  assert.equal(phases.at(-1), "idle");
  assert.equal(jobs.size, 0);
  assert.equal(controller.reveal(ids[3], false), true);
  tick(500);
  assert.deepEqual(selections.at(-1), { id: ids[3], collect: false });
});

test("reduced motion reveals instantly and disabling motion mid-reveal never loses or duplicates a card", () => {
  const instant = setup(false);
  instant.controller.reveal(ids[1], true);
  assert.deepEqual(instant.selections, [{ id: ids[1], collect: true }]);
  assert.deepEqual(instant.phases, ["idle"]);
  assert.equal(instant.jobs.size, 0);
  for (const elapsed of [100, 300]) {
    const context = setup();
    context.controller.reveal(ids[2], true);
    context.tick(elapsed);
    context.reduce();
    context.tick(1000);
    assert.deepEqual(context.selections, [{ id: ids[2], collect: true }]);
    assert.equal(context.phases.at(-1), "idle");
    assert.equal(context.jobs.size, 0);
  }
});

test("unmount cancels every late callback and refuses new reveals", () => {
  const { controller, phases, selections, tick, jobs } = setup();
  controller.reveal(ids[1], true);
  controller.destroy();
  tick(1000);
  assert.deepEqual(phases, ["drawing"]);
  assert.deepEqual(selections, []);
  assert.equal(jobs.size, 0);
  assert.equal(controller.reveal(ids[2], true), false);
});
