import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import ts from "typescript";

const source = await readFile(
  new URL("../lib/roaming-notebook.ts", import.meta.url),
  "utf8",
);
const compiled = ts.transpileModule(source, {
  compilerOptions: { target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.ESNext },
}).outputText;
const {
  roamingPlaceForPath,
  readRoamingVisits,
  addRoamingVisit,
  createRoamingStorage,
  createRoamingVisitTracker,
  roamingVisitDelay,
} = await import(
  `data:text/javascript;base64,${Buffer.from(compiled).toString("base64")}`
);

test("canonical worlds and compatibility URLs share six stamps on both deployments", () => {
  const routes = [
    ["/", "home"],
    ["/about/", "about"],
    ["/collections", "collections"],
    ["/collections/figures/", "collections"],
    ["/collections/gallery/?room=devices", "collections"],
    ["/study/#cs224n-nlp-word-vectors", "study"],
    ["/links/", "links"],
    ["/logs/", "logs"],
    ["/anime", "collections"],
    ["/games/", "collections"],
    ["/projects", "logs"],
  ];
  for (const [path, expected] of routes) {
    assert.equal(roamingPlaceForPath(path), expected, path);
    assert.equal(roamingPlaceForPath(`/sekai-zero${path}`, "/sekai-zero/"), expected);
    assert.equal(roamingPlaceForPath(path, "/sekai-zero/"), expected);
  }
  assert.equal(roamingPlaceForPath("/sekai-zero", "/sekai-zero/"), "home");
});

test("missing pages and prefix lookalikes cannot add an invented visit", () => {
  for (const path of [
    "/elsewhere",
    "/aboutness",
    "/about/missing",
    "/collections/missing",
    "/collections/gallery/missing",
    "/sekai-zero-other/links",
  ]) {
    assert.equal(roamingPlaceForPath(path, "/sekai-zero"), null, path);
  }
});

test("stored visits are deduplicated and constrained to known IDs", () => {
  assert.deepEqual(
    readRoamingVisits('["logs","home","logs",null,"price","collections",123]'),
    ["home", "collections", "logs"],
  );
  for (const raw of [null, "", "broken", "{}", '"home"', "[".repeat(2_049)]) {
    assert.deepEqual(readRoamingVisits(raw), []);
  }
  assert.deepEqual(addRoamingVisit(["logs", "home"], "home"), ["home", "logs"]);
  assert.deepEqual(addRoamingVisit(["logs", "home"], "about"), [
    "home",
    "about",
    "logs",
  ]);
});

test("quota failure uses memory for both new stamps and clearing", () => {
  const store = createRoamingStorage(() => ({
    getItem: () => '["home"]',
    setItem() {
      throw new Error("QuotaExceededError");
    },
  }));
  assert.deepEqual(store.read(), ["home"]);
  store.write(["home", "about"]);
  assert.deepEqual(store.read(), ["home", "about"]);
  store.write([]);
  assert.deepEqual(store.read(), []);
});

test("read denial preserves the last readable state and still permits local use", () => {
  let denied = false;
  const store = createRoamingStorage(() => ({
    getItem() {
      if (denied) throw new Error("SecurityError");
      return '["logs"]';
    },
    setItem() {},
  }));
  assert.deepEqual(store.read(), ["logs"]);
  denied = true;
  assert.deepEqual(store.read(), ["logs"]);
  store.write(["about", "logs"]);
  assert.deepEqual(store.read(), ["about", "logs"]);

  const unavailable = createRoamingStorage(() => {
    throw new Error("No storage");
  });
  assert.deepEqual(unavailable.read(), []);
  unavailable.write(["study"]);
  assert.deepEqual(unavailable.read(), ["study"]);
});

function setup() {
  let now = 0;
  let nextId = 0;
  const jobs = new Map();
  const recorded = [];
  const tracker = createRoamingVisitTracker({
    record: (place) => recorded.push(place),
    clock: {
      setTimeout(callback, delay) {
        const id = ++nextId;
        jobs.set(id, { at: now + delay, callback });
        return id;
      },
      clearTimeout(id) {
        jobs.delete(id);
      },
    },
  });
  return {
    tracker,
    recorded,
    pending: () => jobs.size,
    tick(duration) {
      now += duration;
      for (const [id, job] of [...jobs]) {
        if (job.at <= now) {
          jobs.delete(id);
          job.callback();
        }
      }
    },
  };
}

test("only an uninterrupted visible visit earns a stamp", () => {
  const { tracker, recorded, tick, pending } = setup();
  tracker.navigate("/collections/figures/");
  tick(5_000);
  assert.deepEqual(recorded, []);
  tracker.setVisible(true);
  tick(roamingVisitDelay - 1);
  assert.deepEqual(recorded, []);
  tracker.setVisible(false);
  assert.equal(pending(), 0);
  tracker.setVisible(true);
  tick(roamingVisitDelay - 1);
  assert.deepEqual(recorded, []);
  tick(1);
  assert.deepEqual(recorded, ["collections"]);
  tracker.setVisible(false);
  tracker.setVisible(true);
  tick(5_000);
  assert.deepEqual(recorded, ["collections"]);
});

test("navigation cancels the previous chapter's pending stamp", () => {
  const { tracker, recorded, tick } = setup();
  tracker.setVisible(true);
  tracker.navigate("/about");
  tick(1_000);
  tracker.navigate("/links");
  tick(1_000);
  assert.deepEqual(recorded, []);
  tick(500);
  assert.deepEqual(recorded, ["links"]);
});

test("clearing stays empty until navigation; disposal cancels late callbacks", () => {
  const { tracker, recorded, tick, pending } = setup();
  tracker.setVisible(true);
  tracker.navigate("/about");
  tracker.reset();
  assert.equal(pending(), 0);
  tracker.setVisible(false);
  tracker.setVisible(true);
  tick(5_000);
  assert.deepEqual(recorded, []);
  tracker.navigate("/study");
  tick(roamingVisitDelay);
  assert.deepEqual(recorded, ["study"]);
  tracker.navigate("/logs");
  tracker.destroy();
  tracker.navigate("/");
  tracker.setVisible(true);
  tick(5_000);
  assert.deepEqual(recorded, ["study"]);
  assert.equal(pending(), 0);
});
