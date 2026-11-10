import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import ts from "typescript";

const source = await readFile(
  new URL("../lib/research-prompt.ts", import.meta.url),
  "utf8",
);
const compiled = ts.transpileModule(source, {
  compilerOptions: { target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.ESNext },
}).outputText;
const { drawResearchQuestion } = await import(
  `data:text/javascript;base64,${Buffer.from(compiled).toString("base64")}`
);

test("each round visits all twelve questions once without consecutive repeats", () => {
  let current = null;
  let remaining = [];
  for (let round = 0; round < 5; round += 1) {
    const seen = new Set();
    for (let draw = 0; draw < 12; draw += 1) {
      const next = drawResearchQuestion(12, current, remaining, () => (draw % 7) / 7);
      assert.notEqual(next.index, current);
      assert.ok(!seen.has(next.index));
      seen.add(next.index);
      current = next.index;
      remaining = next.remaining;
    }
    assert.equal(seen.size, 12);
    assert.equal(remaining.length, 0);
  }
});

test("empty or single-question outlines remain safe and samples stay within bounds", () => {
  assert.equal(drawResearchQuestion(0, null, []), null);
  assert.deepEqual(drawResearchQuestion(1, 0, []), { index: 0, remaining: [] });
  for (const sample of [0, 1, -1, NaN, Infinity]) {
    const next = drawResearchQuestion(12, null, [], () => sample);
    assert.ok(next.index >= 0 && next.index < 12);
    assert.equal(next.remaining.length, 11);
  }
});
