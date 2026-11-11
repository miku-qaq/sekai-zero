import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import ts from "typescript";

const source = await readFile(
  new URL("../lib/capsule-draw.ts", import.meta.url),
  "utf8",
);
const compiled = ts.transpileModule(source, {
  compilerOptions: { target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.ESNext },
}).outputText;
const { createCapsuleDraw, capsuleTiming } = await import(
  `data:text/javascript;base64,${Buffer.from(compiled).toString("base64")}`
);

function setup({ allowed = true, onSelect, onPhase } = {}) {
  let now = 0;
  let serial = 0;
  let motion = allowed;
  const jobs = new Map();
  const events = [];
  const controller = createCapsuleDraw({
    clock: {
      setTimeout(callback, delay) {
        const id = ++serial;
        jobs.set(id, { callback, at: now + delay });
        return id;
      },
      clearTimeout(id) {
        jobs.delete(id);
      },
    },
    motionAllowed: () => motion,
    onSelect(id) {
      events.push({ select: id, at: now });
      onSelect?.(id);
    },
    onPhase(phase) {
      events.push({ phase, at: now });
      onPhase?.(phase);
    },
  });
  return {
    controller,
    jobs,
    events,
    selections: () =>
      events.filter((event) => "select" in event).map((event) => event.select),
    phases: () =>
      events.filter((event) => "phase" in event).map((event) => event.phase),
    setMotion(value) {
      motion = value;
      controller.motionChanged();
    },
    tick(ms) {
      const end = now + ms;
      while (true) {
        const next = [...jobs]
          .filter(([, job]) => job.at <= end)
          .sort((a, b) => a[1].at - b[1].at)[0];
        if (!next) break;
        jobs.delete(next[0]);
        now = next[1].at;
        next[1].callback();
      }
      now = end;
    },
  };
}

test("a capsule turns, drops, selects exactly once and settles after 1360 ms", () => {
  const context = setup();
  assert.deepEqual(capsuleTiming, { turning: 520, dropping: 460, revealing: 380 });
  assert.equal(context.controller.draw("figure-001"), true);
  context.tick(519);
  assert.deepEqual(context.phases(), ["turning"]);
  assert.deepEqual(context.selections(), []);
  context.tick(1);
  assert.deepEqual(context.phases(), ["turning", "dropping"]);
  context.tick(459);
  assert.deepEqual(context.selections(), []);
  context.tick(1);
  assert.deepEqual(context.selections(), ["figure-001"]);
  assert.equal(context.phases().at(-1), "revealing");
  context.tick(379);
  assert.equal(context.jobs.size, 1);
  context.tick(1);
  assert.deepEqual(context.events, [
    { phase: "turning", at: 0 },
    { phase: "dropping", at: 520 },
    { select: "figure-001", at: 980 },
    { phase: "revealing", at: 980 },
    { phase: "idle", at: 1360 },
  ]);
  assert.equal(context.jobs.size, 0);
});

test("rapid input never queues a second piece and a completed turn accepts the next", () => {
  const context = setup();
  context.controller.draw("first");
  assert.equal(context.controller.draw("ignored-1"), false);
  context.tick(520);
  assert.equal(context.controller.draw("ignored-2"), false);
  context.tick(460);
  assert.equal(context.controller.draw("ignored-3"), false);
  context.tick(380);
  assert.deepEqual(context.selections(), ["first"]);
  assert.equal(context.controller.draw("second"), true);
  context.tick(1360);
  assert.deepEqual(context.selections(), ["first", "second"]);
  assert.equal(context.jobs.size, 0);
});

test("motion disabled before drawing delivers immediately without starting a timer", () => {
  const context = setup({ allowed: false });
  assert.equal(context.controller.draw("instant"), true);
  assert.deepEqual(context.events, [
    { select: "instant", at: 0 },
    { phase: "idle", at: 0 },
  ]);
  assert.equal(context.jobs.size, 0);
  context.setMotion(true);
  assert.equal(context.controller.draw("animated"), true);
  context.tick(1360);
  assert.deepEqual(context.selections(), ["instant", "animated"]);
});

test("motion interruption during every stage selects once and cancels all remaining work", () => {
  for (const elapsed of [100, 700, 1100]) {
    const context = setup();
    context.controller.draw("piece");
    context.tick(elapsed);
    context.setMotion(false);
    const settled = [...context.events];
    assert.deepEqual(context.selections(), ["piece"]);
    assert.equal(context.phases().at(-1), "idle");
    assert.equal(context.jobs.size, 0);
    context.tick(2000);
    context.setMotion(false);
    assert.deepEqual(context.events, settled);
  }
});

test("finishing early settles each stage once and immediately allows another draw", () => {
  for (const elapsed of [0, 700, 1100]) {
    const context = setup();
    context.controller.finish();
    assert.deepEqual(context.events, []);
    context.controller.draw("first");
    context.tick(elapsed);
    context.controller.finish();
    context.controller.finish();
    assert.deepEqual(context.selections(), ["first"]);
    assert.equal(context.phases().filter((phase) => phase === "idle").length, 1);
    assert.equal(context.jobs.size, 0);
    assert.equal(context.controller.draw("second"), true);
    context.tick(1360);
    assert.deepEqual(context.selections(), ["first", "second"]);
  }
});

test("unmount during any stage cancels callbacks and refuses later input or completion", () => {
  for (const elapsed of [0, 700, 1100]) {
    const context = setup();
    context.controller.draw("piece");
    context.tick(elapsed);
    const before = [...context.events];
    context.controller.destroy();
    context.controller.destroy();
    context.controller.finish();
    context.setMotion(false);
    assert.equal(context.controller.draw("late"), false);
    context.tick(2000);
    assert.equal(context.jobs.size, 0);
    assert.deepEqual(context.events, before);
  }
});

test("synchronous teardown during a callback cannot schedule another phase", () => {
  let context;
  context = setup({ onSelect: () => context.controller.destroy() });
  context.controller.draw("piece");
  context.tick(2000);
  assert.deepEqual(context.selections(), ["piece"]);
  assert.deepEqual(context.phases(), ["turning", "dropping"]);
  assert.equal(context.jobs.size, 0);

  let phaseContext;
  phaseContext = setup({
    onPhase: (phase) => {
      if (phase === "turning") phaseContext.controller.finish();
    },
  });
  phaseContext.controller.draw("finished");
  phaseContext.tick(2000);
  assert.deepEqual(phaseContext.selections(), ["finished"]);
  assert.deepEqual(phaseContext.phases(), ["turning", "idle"]);
  assert.equal(phaseContext.jobs.size, 0);
});
