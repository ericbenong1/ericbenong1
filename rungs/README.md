# Rungs engine (ready-to-apply source)

These are the pure game-logic files for the Rungs Lovable project
(`a490f708-d2c3-495f-8221-caf59d7f767a`), written and unit-tested here so they cost
zero Lovable credits to verify. Applying them to Lovable is one `send_message` call.

## What changed vs. the first Lovable build

1. **words.ts** — replaced the web-frequency scrape (which contained names like
   `mike`/`tony`, non-words like `tres`/`jeux`, and adult terms like `anal`/`orgy` that
   could become puzzle endpoints) with:
   - `WORDS`: 3,860 four-letter words from the public-domain ENABLE list, slurs and
     explicit terms removed. Used for move validation.
   - `COMMON_WORDS`: 900 frequency-ranked clean words (Google web corpus ∩ ENABLE, with
     proper names, abbreviations and unpleasant words removed). Used for endpoints only.
2. **puzzle.ts** — added the **checkpoint** mechanic, which is what differentiates Rungs
   from the many existing Weaver clones. Every puzzle is START → CHECKPOINT → END; each
   leg is 2–3 moves, so par is 4–6 and the ladder is always solvable by construction.
   Epoch moved to 2026-09-04 so today is Rungs #1. `evaluateLadder` refuses a win that
   skips the checkpoint; `hintFor` routes to the checkpoint first, then the end.
3. **scoring.ts** — 🚩 for the checkpoint rung in the share grid, plus `challengeUrl` for
   the challenge-a-friend link.
4. **graph.ts** — `shortestDistance` now reuses `bfsDistances` instead of duplicating BFS.

## Verify

```
rm -rf .tsrun && mkdir -p .tsrun/src/lib/game .tsrun/test \
  && cp src/lib/game/*.ts .tsrun/src/lib/game/ && cp test/*.ts .tsrun/test/ \
  && sed -i -E 's#from "\./([a-z]+)"#from "./\1.ts"#g' .tsrun/src/lib/game/*.ts \
  && node --experimental-strip-types --test .tsrun/test/engine.test.ts
```

Covers: list cleanliness, 60 consecutive daily puzzles valid, 2,000 seeds deterministic
and never failing, checkpoint enforcement along the optimal path, share text and links.

## Applying to Lovable

Needs workspace credits. Upload `src/lib/game/words.ts` as an attachment (it is too large
to paste) and send the UI instructions in `../docs/rungs/lovable-next-message.md`.
