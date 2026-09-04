# Rungs — daily word-ladder game (venture #1)

**Status:** Building (Sept 4, 2026). Lovable project `a490f708-d2c3-495f-8221-caf59d7f767a`.
**Owner:** Eric. **Manager/planner:** Claude (this repo is the record; chat history is not).
**Goal:** cover this venture's own monthly run cost (Lovable Pro + Claude usage, roughly $125–225/mo) and grow month over month.

## Why this game

- Daily puzzle format has the best retention/share loop per dollar of build cost (Wordle → Clues by Sam pattern; see `research-2026-09-04.md`).
- Word ladders are deterministic and infinitely generatable from a word list + BFS. No content treadmill, no art budget.
- The niche is crowded with plain Weaver clones, so Rungs needs a hook. Hooks chosen:
  1. **Checkpoints**: the daily ladder must pass through 1–2 shown checkpoint words. Par = sum of BFS segments. Distinct from every competitor found.
  2. **Golf scoring** (par, birdie, bogey) with an emoji share ladder.
  3. **Challenge a friend**: a share link that loads the same puzzle and shows a head-to-head strokes comparison.

## Monetization (in order of expected yield)

| Lever | Price | Status | Needs Eric |
|---|---|---|---|
| Rungs Pro one-time unlock (unlimited, archive, hard mode, no ads, themes) | $3.99 | Waitlist sheet built; Stripe not wired | Connect Stripe in Lovable (Settings → Integrations → Stripe), then tell Claude to wire `startProCheckout()` |
| Display ads (Adsterra first, Ezoic once traffic exists, AdSense later) | RPM ~$2–6 | `AdSlot` component built, renders only when `VITE_ADSENSE_CLIENT` is set | Apply to a network, paste publisher ID |
| Tips (Ko-fi) | — | Not built | Create a Ko-fi page; Claude adds the link |

Realistic math: $200/mo needs roughly 2–7K unique monthly visitors converting 1–2% to Pro, OR 50–75K ad sessions. Pro is the lever; ads are a trickle.

## KPI targets (check weekly via Lovable analytics + `events` table)

| Metric | Month 1 | Month 2 | Month 3 |
|---|---|---|---|
| Unique visitors / mo | 1,000 | 3,000 | 6,000 |
| Day-7 return rate | 15% | 20% | 25% |
| Share clicks / win | 10% | 15% | 20% |
| Pro waitlist or purchases | 40 emails | Stripe live, 30 sales | 60 sales |
| Revenue | $0 | ~$100 | ~$200 |

## Phases

- **P0 (this session):** playable daily game + stats + share + Pro waitlist + ad slots + event tracking. Deploy to lovable.app. Docs, promo copy, submission list.
- **P1 (Eric, ~1 hour):** connect Stripe; buy a domain (rungs.app / playrungs.com or similar) and point Lovable at it; post Show HN + r/WebGames; submit to Listdle/DleList/Puzzle Index/Alldle/aukspot dles. Copy is in `promo-copy.md`.
- **P2 (weekly loop, Claude):** read analytics + events, fix top friction, ship one retention feature per week (archive, hard mode, friend challenge polish, dark themes), refresh submission list. A weekly Routine drives this; Eric can delete it any time.
- **P3 (if Pro sales > 20/mo):** apply to Ezoic; consider a second game reusing the engine (5-letter "Rungs Hard" as a separate daily).

## Governance (from the venture plan doc)

No real spend, account creation, or external posting without Eric. Claude builds, deploys to lovable.app (explicitly authorized in this task), drafts every external post, and hands Eric a paste-ready checklist. Every spend or account step is listed in `launch-checklist.md`.

## Cost discipline

- Lovable credits: batch changes into few, specific messages; never use Max mode for UI tweaks.
- Claude: Fable plans and reviews; Sonnet/Haiku sub-agents do research, copy, and QA passes.
