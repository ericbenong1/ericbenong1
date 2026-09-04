import { WORDS, WORD_SET } from "./words";

/** Number of positions where two equal-length words differ. */
export function letterDiff(a: string, b: string): number {
  if (a.length !== b.length) return Number.POSITIVE_INFINITY;
  let d = 0;
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) d++;
  return d;
}

export function isWord(word: string): boolean {
  return WORD_SET.has(word.toLowerCase());
}

let adjacency: Map<string, string[]> | null = null;

function buildAdjacency(): Map<string, string[]> {
  const buckets = new Map<string, string[]>();
  for (const word of WORDS) {
    for (let i = 0; i < word.length; i++) {
      const key = word.slice(0, i) + "_" + word.slice(i + 1);
      const list = buckets.get(key);
      if (list) list.push(word);
      else buckets.set(key, [word]);
    }
  }
  const adj = new Map<string, string[]>();
  for (const group of buckets.values()) {
    if (group.length < 2) continue;
    for (const word of group) {
      let list = adj.get(word);
      if (!list) {
        list = [];
        adj.set(word, list);
      }
      for (const other of group) if (other !== word) list.push(other);
    }
  }
  return adj;
}

export function getAdjacency(): Map<string, string[]> {
  if (!adjacency) adjacency = buildAdjacency();
  return adjacency;
}

export function neighborsOf(word: string): string[] {
  return getAdjacency().get(word.toLowerCase()) ?? [];
}

/** Distances (in moves) from `start` to every reachable word. */
export function bfsDistances(start: string): Map<string, number> {
  const adj = getAdjacency();
  const dist = new Map<string, number>([[start, 0]]);
  let frontier = [start];
  let depth = 0;
  while (frontier.length) {
    depth++;
    const next: string[] = [];
    for (const word of frontier) {
      for (const n of adj.get(word) ?? []) {
        if (!dist.has(n)) {
          dist.set(n, depth);
          next.push(n);
        }
      }
    }
    frontier = next;
  }
  return dist;
}

/** Shortest number of moves from start to end, or null when unreachable. */
export function shortestDistance(start: string, end: string): number | null {
  if (start === end) return 0;
  return bfsDistances(start).get(end) ?? null;
}

/** One shortest path start -> end inclusive, or null when unreachable. */
export function shortestPath(start: string, end: string): string[] | null {
  if (start === end) return [start];
  const adj = getAdjacency();
  const prev = new Map<string, string>([[start, start]]);
  let frontier = [start];
  while (frontier.length) {
    const next: string[] = [];
    for (const word of frontier) {
      for (const n of adj.get(word) ?? []) {
        if (prev.has(n)) continue;
        prev.set(n, word);
        if (n === end) {
          const path = [end];
          let cur = end;
          while (cur !== start) {
            cur = prev.get(cur)!;
            path.push(cur);
          }
          return path.reverse();
        }
        next.push(n);
      }
    }
    frontier = next;
  }
  return null;
}

export type MoveError = "not-a-word" | "not-one-letter" | "same-word" | "bad-length";

/** Validate a candidate rung against the previous rung. Returns null when legal. */
export function validateMove(previous: string, candidate: string): MoveError | null {
  const word = candidate.toLowerCase();
  if (word.length !== previous.length) return "bad-length";
  if (word === previous) return "same-word";
  if (!isWord(word)) return "not-a-word";
  if (letterDiff(previous, word) !== 1) return "not-one-letter";
  return null;
}

export const MOVE_ERROR_MESSAGES: Record<MoveError, string> = {
  "not-a-word": "Not in the word list",
  "not-one-letter": "Change exactly one letter",
  "same-word": "That's the same word",
  "bad-length": "Words must be 4 letters",
};
