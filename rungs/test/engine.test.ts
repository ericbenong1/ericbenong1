import assert from "node:assert/strict";
import { test } from "node:test";
import { COMMON_SET, COMMON_WORDS, WORDS } from "../src/lib/game/words.ts";
import { generatePuzzle, getDailyPuzzle, evaluateLadder, hintFor, puzzleNumberFor, getRandomPuzzle, type Puzzle } from "../src/lib/game/puzzle.ts";
import { shortestDistance, validateMove } from "../src/lib/game/graph.ts";
import { buildShareText, challengeUrl } from "../src/lib/game/scoring.ts";

const BAD = ["anal", "orgy", "nude", "sexy", "porn", "tres", "jeux", "mike", "tony"];

test("word lists are clean and sane", () => {
  assert.ok(WORDS.length > 3500);
  assert.equal(COMMON_WORDS.length, 900);
  for (const w of BAD) assert.ok(!COMMON_SET.has(w), `common list contains ${w}`);
  for (const w of ["anal", "orgy", "nude", "porn"]) assert.ok(!WORDS.includes(w), `validation list contains ${w}`);
  for (const w of COMMON_WORDS) assert.ok(WORDS.includes(w), `${w} not in validation list`);
});

test("daily puzzles for the next 60 days are valid", () => {
  for (let i = 0; i < 60; i++) {
    const day = new Date(Date.UTC(2026, 8, 4, 18, 0, 0) + i * 86_400_000);
    const p = getDailyPuzzle(day);
    assert.ok(p.par >= 4 && p.par <= 6, `${p.dateKey} par ${p.par}`);
    for (const w of [p.start, p.checkpoint, p.end]) assert.ok(COMMON_SET.has(w), `${w} not common`);
    assert.notEqual(p.start, p.end);
    assert.notEqual(p.checkpoint, p.end);
    assert.equal(shortestDistance(p.start, p.checkpoint)! + shortestDistance(p.checkpoint, p.end)!, p.par);
    assert.ok((shortestDistance(p.start, p.end) ?? 0) >= 2, "end adjacent to start");
    assert.equal(p.number, i + 1);
  }
});

test("generator is deterministic and never fails across 2000 seeds", () => {
  for (let i = 0; i < 2000; i++) {
    const a = generatePuzzle(`seed-${i}`);
    const b = generatePuzzle(`seed-${i}`);
    assert.deepEqual(a, b);
    assert.ok(a.par >= 4 && a.par <= 6);
  }
  assert.equal(puzzleNumberFor("2026-09-04"), 1);
  assert.equal(puzzleNumberFor("2026-09-03"), 1, "never below 1");
});

test("ladder evaluation enforces the checkpoint", () => {
  const p: Puzzle = { ...generatePuzzle("rungs-daily-2026-09-04"), number: 1, dateKey: "2026-09-04", seed: "x" };
  // Walk the optimal path via the hint function.
  const rungs: string[] = [];
  let cur = p.start;
  for (let i = 0; i < 12; i++) {
    const state = evaluateLadder(p, rungs);
    if (state.won) break;
    const next = hintFor(p, cur, state.checkpointHit);
    assert.ok(next, "hint should exist");
    assert.equal(validateMove(cur, next!), null);
    rungs.push(next!);
    cur = next!;
  }
  const final = evaluateLadder(p, rungs);
  assert.ok(final.won);
  assert.equal(rungs.length, p.par);
  assert.ok(final.checkpointIndex >= 0 && final.checkpointIndex < rungs.length - 1);
});

test("share text and challenge link", () => {
  const text = buildShareText({ puzzleNumber: 3, par: 5, strokes: 5, url: "https://x", rungs: [
    { word: "a", hinted: false }, { word: "b", hinted: false, checkpoint: true }, { word: "c", hinted: true }, { word: "d", hinted: false },
  ]});
  assert.equal(text, "Rungs #3 · Par 5 · 5 strokes (Par)\n\n🟩\n🚩\n🟨\n🟩\n\nhttps://x");
  assert.equal(challengeUrl("https://x", { number: 3, seed: "s" }, 5), "https://x/?s=5");
  assert.equal(challengeUrl("https://x", { number: null, seed: "ab c" }, 7), "https://x/unlimited?seed=ab%20c&s=7");
  const r = getRandomPuzzle("ab c");
  assert.deepEqual(getRandomPuzzle("ab c"), r);
});
