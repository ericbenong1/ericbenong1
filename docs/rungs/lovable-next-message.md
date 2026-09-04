# Next Lovable message (paste when credits are available)

**Attach first:** `rungs/src/lib/game/words.ts` (too large to paste inline).
Also paste the contents of `rungs/src/lib/game/puzzle.ts`, `graph.ts` and `scoring.ts` as
attachments or tell the agent to copy them from this repo.

---

Replace these four files in `src/lib/game/` with the attached versions, exactly as given —
do not regenerate, reorder, trim or "improve" them. They are unit-tested:
`words.ts`, `graph.ts`, `puzzle.ts`, `scoring.ts`.

Then update the UI to match the new engine. The puzzle type now has a `checkpoint` and a
`seed`, and `scoring.ts` exports `challengeUrl` and `rungEmoji`.

**1. Checkpoints.** Every puzzle is START → CHECKPOINT → END.
- Subtitle becomes: "Climb from THIN to TREE via TIME, one letter at a time."
- Under the subtitle add a pill "via TIME" that turns teal with a check icon once hit.
- Render the checkpoint rung in the ladder with a small flag icon.
- Use `evaluateLadder(puzzle, rungs)` for win state. If it returns `reachedEndEarly`,
  show the toast "Hit the checkpoint first" and do NOT end the game.
- Hint button calls `hintFor(puzzle, currentWord, checkpointHit)`.
- Share grid uses `rungEmoji` (🚩 checkpoint, 🟨 hinted, 🟩 normal).
- How-to-play gains one sentence explaining the checkpoint, with a tiny worked example.

**2. Challenge a friend.** In the results modal add a secondary button "Challenge a friend"
that copies `challengeUrl(window.location.origin, puzzle, strokes)` via `navigator.share`
with a clipboard fallback. Track `challenge_click`.
- `/unlimited?seed=X` must pass that seed to `getRandomPuzzle(seed)` so the friend gets the
  identical puzzle.
- When the URL has `?s=N`, show a dismissible banner above the ladder: "A friend finished
  this ladder in N strokes. Beat them?" Track `challenge_open`.

**3. First visit.** Open the how-to-play content as a modal on first visit only
(localStorage flag `rungs:seen-howto`).

Do not change the visual design otherwise. Do not modify the four engine files.
