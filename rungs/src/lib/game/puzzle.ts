import { bfsDistances, neighborsOf, shortestPath } from "./graph";
import { hashSeed, makeRng, rngInt } from "./rng";
import { COMMON_SET, COMMON_WORDS } from "./words";

export const EPOCH_DATE = "2026-09-04"; // Rungs #1
export const MIN_LEG = 2;
export const MAX_LEG = 3;
export const MIN_PAR = MIN_LEG * 2; // 4
export const MAX_PAR = MAX_LEG * 2; // 6
export const PUZZLE_TIME_ZONE = "America/Chicago";

export interface Puzzle {
  start: string;
  /** The ladder must pass through this word before reaching `end`. */
  checkpoint: string;
  end: string;
  /** dist(start, checkpoint) + dist(checkpoint, end). */
  par: number;
  /** Daily puzzle number, or null for unlimited puzzles. */
  number: number | null;
  dateKey: string;
  /** Seed that reproduces this puzzle (used by challenge links). */
  seed: string;
}

/** Today's calendar date in the puzzle time zone, as YYYY-MM-DD. */
export function puzzleDateKey(now: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: PUZZLE_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

export function puzzleNumberFor(dateKey: string): number {
  const day = Date.parse(dateKey + "T00:00:00Z");
  const epoch = Date.parse(EPOCH_DATE + "T00:00:00Z");
  return Math.max(1, Math.floor((day - epoch) / 86_400_000) + 1);
}

/** Milliseconds until the next daily puzzle unlocks. */
export function msUntilNextPuzzle(now: Date = new Date()): number {
  const key = puzzleDateKey(now);
  let ms = now.getTime();
  const step = 60_000;
  const limit = ms + 26 * 3600_000;
  while (ms < limit) {
    ms += step;
    if (puzzleDateKey(new Date(ms)) !== key) break;
  }
  return Math.max(0, ms - now.getTime());
}

type Triple = { start: string; checkpoint: string; end: string; par: number };

function candidatesAt(dist: Map<string, number>, min: number, max: number): string[] {
  const out: string[] = [];
  for (const [word, d] of dist) if (d >= min && d <= max && COMMON_SET.has(word)) out.push(word);
  out.sort();
  return out;
}

/**
 * Try to build a checkpoint puzzle from a given start word. Returns null when
 * the start has no valid checkpoint/end combination.
 */
function tripleFrom(start: string, rng: () => number): Triple | null {
  if (neighborsOf(start).length === 0) return null;
  const fromStart = bfsDistances(start);
  const checkpoints = candidatesAt(fromStart, MIN_LEG, MAX_LEG);
  if (!checkpoints.length) return null;
  const checkpoint = checkpoints[rngInt(rng, checkpoints.length)]!;
  const fromCheckpoint = bfsDistances(checkpoint);
  const ends = candidatesAt(fromCheckpoint, MIN_LEG, MAX_LEG).filter(
    (w) => w !== start && (fromStart.get(w) ?? 0) >= 2,
  );
  if (!ends.length) return null;
  const end = ends[rngInt(rng, ends.length)]!;
  const par = fromStart.get(checkpoint)! + fromCheckpoint.get(end)!;
  return { start, checkpoint, end, par };
}

/**
 * Build a puzzle from a seed. Deterministic and always solvable: the checkpoint
 * is chosen from the BFS frontier of the start, the end from the frontier of the
 * checkpoint, so a path of exactly `par` moves through the checkpoint exists.
 */
export function generatePuzzle(seed: string): Triple {
  const rng = makeRng(hashSeed(seed));
  for (let attempt = 0; attempt < 300; attempt++) {
    const start = COMMON_WORDS[rngInt(rng, COMMON_WORDS.length)]!;
    const triple = tripleFrom(start, rng);
    if (triple) return triple;
  }
  // Deterministic fallback: scan the common list in order (still BFS-verified).
  for (const start of COMMON_WORDS) {
    const triple = tripleFrom(start, rng);
    if (triple) return triple;
  }
  throw new Error("Word graph cannot produce a puzzle");
}

export function getDailyPuzzle(now: Date = new Date()): Puzzle {
  const dateKey = puzzleDateKey(now);
  const seed = `rungs-daily-${dateKey}`;
  return { ...generatePuzzle(seed), number: puzzleNumberFor(dateKey), dateKey, seed };
}

export function getRandomPuzzle(seed?: string): Puzzle {
  const key = seed ?? `${Date.now().toString(36)}${Math.floor(Math.random() * 1e6).toString(36)}`;
  return { ...generatePuzzle(`rungs-unlimited-${key}`), number: null, dateKey: key, seed: key };
}

export interface LadderState {
  /** Index in `rungs` where the checkpoint was hit, or -1. */
  checkpointIndex: number;
  checkpointHit: boolean;
  /** END was entered before the checkpoint: not a win, show a nudge. */
  reachedEndEarly: boolean;
  won: boolean;
}

/** Evaluate the rungs played so far (excluding the start word). */
export function evaluateLadder(puzzle: Puzzle, rungs: readonly string[]): LadderState {
  const checkpointIndex = rungs.indexOf(puzzle.checkpoint);
  const checkpointHit = checkpointIndex !== -1;
  const last = rungs[rungs.length - 1];
  const atEnd = last === puzzle.end;
  return {
    checkpointIndex,
    checkpointHit,
    reachedEndEarly: atEnd && !checkpointHit,
    won: atEnd && checkpointHit && checkpointIndex < rungs.length - 1,
  };
}

/** Next word on the shortest path toward the checkpoint (if not hit) or the end. */
export function hintFor(puzzle: Puzzle, current: string, checkpointHit: boolean): string | null {
  const target = checkpointHit ? puzzle.end : puzzle.checkpoint;
  const path = shortestPath(current, target);
  return path && path.length > 1 ? path[1]! : null;
}
