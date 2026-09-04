export const HINT_PENALTY = 2;
export const MAX_HINTS_PER_DAY = 3;

export type ScoreLabel =
  | "Albatross"
  | "Eagle"
  | "Birdie"
  | "Par"
  | "Bogey"
  | "Double Bogey"
  | "Triple Bogey"
  | "Over Par";

/** Golf-style label for strokes relative to par. */
export function scoreLabel(strokes: number, par: number): ScoreLabel {
  const delta = strokes - par;
  if (delta <= -3) return "Albatross";
  if (delta === -2) return "Eagle";
  if (delta === -1) return "Birdie";
  if (delta === 0) return "Par";
  if (delta === 1) return "Bogey";
  if (delta === 2) return "Double Bogey";
  if (delta === 3) return "Triple Bogey";
  return "Over Par";
}

/** Bucket key used by the stats distribution: -2..+3, clamped. */
export function scoreBucket(strokes: number, par: number): number {
  return Math.max(-2, Math.min(3, strokes - par));
}

export function bucketLabel(bucket: number): string {
  if (bucket <= -2) return "−2 or better";
  if (bucket === 0) return "Par";
  return bucket > 0 ? `+${bucket}` : `${bucket}`;
}

export function totalStrokes(moves: number, hintsUsed: number): number {
  return moves + hintsUsed * HINT_PENALTY;
}

export interface ShareRung {
  word: string;
  hinted: boolean;
  checkpoint?: boolean;
}

export interface ShareInput {
  puzzleNumber: number | null;
  par: number;
  strokes: number;
  /** One entry per rung played after the start word. */
  rungs: ShareRung[];
  url: string;
}

export function rungEmoji(r: ShareRung): string {
  if (r.checkpoint) return "🚩";
  return r.hinted ? "🟨" : "🟩";
}

/** Emoji ladder + headline used for the share sheet and clipboard. */
export function buildShareText(input: ShareInput): string {
  const title = input.puzzleNumber === null ? "Rungs (Unlimited)" : `Rungs #${input.puzzleNumber}`;
  const label = scoreLabel(input.strokes, input.par);
  const header = `${title} · Par ${input.par} · ${input.strokes} strokes (${label})`;
  const ladder = input.rungs.map(rungEmoji).join("\n");
  return `${header}\n\n${ladder}\n\n${input.url}`;
}

/** Link a friend can open to play the identical puzzle and see your strokes. */
export function challengeUrl(origin: string, puzzle: { number: number | null; seed: string }, strokes: number): string {
  return puzzle.number === null
    ? `${origin}/unlimited?seed=${encodeURIComponent(puzzle.seed)}&s=${strokes}`
    : `${origin}/?s=${strokes}`;
}
