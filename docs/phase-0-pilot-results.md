# Phase 0 Sandbox Pilot — Results

**Status:** Complete. One-shot validation run, as scoped. Per plan doc §9 / STATUS.md's "Next concrete action" — no further phase started, no external calls made, no money spent.
**Run date:** 2026-08-28
**Owner:** Eric (review only — this pilot itself required no board decision; nothing left the sandbox)

## 1. What was run

A minimal Claude Code multi-agent setup: one **Orchestrator** (this session) coordinating **3 sequential worker/critic pairs** (6 sub-agent calls total), each stage building on the corrected output of the last. No external tools were used anywhere in the pipeline — every worker and critic agent was explicitly instructed not to call WebSearch/WebFetch and to reason only from trained knowledge, flagging uncertainty rather than fabricating statistics or citations. This matches the plan doc's "entirely in the sandbox, no external calls, no spend" constraint.

**Research question posed to the pipeline:** evaluate 5 digital product / micro-SaaS ideas buildable and launchable using only tools already available (Claude Code, Lovable, Abacus.AI), scored on buildability, build time, market demand signal, and competition.

**Pipeline structure:**

| Stage | Worker | Critic |
|---|---|---|
| 1 — Idea generation | Brainstormed 7 candidate ideas with self-assessed buildability | Independently audited every score, dropped 1 idea, reshaped 1, overruled 2 scores → finalized 5-idea list |
| 2 — Market & competition | Rated demand (1–5) and competition-openness (1–5) for the 5 finalized ideas, plus build-time estimates | Independently audited every rating, fixed 2 internal inconsistencies, corrected 2 scores, flagged a mischaracterized competitor citation |
| 3 — Scoring & ranking | Built a composite rubric, computed scores, ranked all 5, recommended a #1 | Independently *recomputed* all arithmetic from scratch, stress-tested the rubric's weighting for robustness, checked the #1 reasoning for a double standard |

Each worker and critic ran as an isolated sub-agent with no visibility into the other's reasoning — the critic only ever saw the worker's finished output, never its rationale-in-progress, so agreement couldn't come from shared context.

## 2. Idea evaluation — final results

### Final 5 ideas (post Stage-1 correction)

| # | Idea | Buildability (1–5) | Demand (1–5) | Competition-openness (1–5, 5=wide open) | Build time |
|---|---|---|---|---|---|
| 1 | **DocPortal** — RAG knowledge base for small professional firms | 4 | 3 | 1 | 4–7 wks |
| 2 | **CoachDesk** — vertical micro-CRM for coaches/trainers | 4 | 4 | 2 | 3–5 wks |
| 3 | **RepurposeIt** — long-form-to-social content repackager (export-only) | 5 | 2 | 1 | 2–4 wks |
| 4 | **FitApply** — resume/cover-letter tailoring vs. a job posting | 3 | 5 | 1 | 6–9 wks |
| 5 | **FlowState** — habit/wellness check-in dashboard (web+email, no push) | 4 | 2 | 1 | 3–5 wks |

Two ideas were dropped or reshaped before reaching this table: **RecapAI** (voice-memo summarizer) was dropped after the critic showed its core value collapses into a near-duplicate of RepurposeIt if Abacus.AI's speech-to-text support turns out not to exist (unconfirmed capability). **ClipCraft** (AI short-form video generator) was dropped — confirmed correctly excluded, since video rendering/editing is genuinely outside all three tools. **FlowState** survived only after being reshaped from a "mobile push-notification habit coach" (2/5 buildable — no native push channel in this stack) to a web+email check-in product (4/5 buildable).

### Ranked recommendation

Using an equal-weighted composite (buildability + demand + competition-openness + a build-time-derived speed score, each 25%):

1. **CoachDesk — 3.53** (recommended #1)
2. **RepurposeIt — 3.25**
3. **FlowState — 2.78**
4. **DocPortal — 2.70**
5. **FitApply — 2.50**

**Why CoachDesk:** it's the only idea with no glaring weak point — solid buildability, second-highest demand (backed by a durable comparable-business signal: multiple real, long-running SaaS products already serve this exact function, meaning coaches demonstrably pay recurring money for it), fast build time, and the *best* competition-openness score in the set. Its main risk — entrenched incumbents (Trainerize, TrueCoach, etc.) and price-sensitive buyers who might default to spreadsheets/DMs instead of paying — is a go-to-market/positioning problem, not a structural flaw in the product concept itself.

**Important caveat the final critic surfaced (see §3):** this is a genuine two-way race, not a clean win. CoachDesk's 0.28-point lead over RepurposeIt evaporates — and RepurposeIt takes #1 outright — under a coherent, non-cherry-picked alternative weighting that prioritizes buildability/speed-to-ship over demand-durability. The critic also found the "addressable vs. structural risk" framing used to justify CoachDesk's #1 slot applies a real, if partial, double standard versus RepurposeIt's dismissed risk. **Read this as: CoachDesk is the better default pick if demand-durability and competitive breathing room matter to Eric; RepurposeIt is the more defensible pick if the priority is shipping the fastest, most technically de-risked thing first.** This nuance — not a clean, unqualified #1 — is itself part of what the pilot was supposed to produce: an honest, load-bearing answer rather than a confident-sounding one.

## 3. Verification-loop validation — did the critics actually catch real flaws?

**Yes, unambiguously, at every stage.** None of the three critics rubber-stamped their worker's output; each produced concrete, itemized corrections that changed the substance of the deliverable, not just its wording. Selected examples (not an exhaustive list — full detail in the pipeline transcript):

- **Stage 1 critic** caught that the worker applied rigorous "I'm not sure this capability exists" scrutiny to one idea (RecapAI's speech-to-text dependency) but *not* to another (DocPortal's RAG-citation-quality claim) — an inconsistent-rigor bug, not a factual error. It also independently determined that if RecapAI's core risk is real, the product **degrades into an undisclosed duplicate of RepurposeIt** — a duplicate-detection catch the worker never considered. It further found an unflagged compliance gap: RepurposeIt's original scope ("send via the app") implied in-app bulk email sending, which would require CAN-SPAM/deliverability infrastructure outside the declared three-tool stack — caught and fixed by narrowing scope to export-only.
- **Stage 2 critic** found that DocPortal's own stated reasoning ("the free/bundled options are the real threat") logically implied a 1/5 competition score, while the worker had scored it 2/5 — an internal contradiction between narrative and number. It also recognized that the worker's single best insight ("this idea is replicable by pasting into a free LLM chat window") logically applied to two other ideas (DocPortal, FitApply) that the worker hadn't extended it to, and corrected both scores accordingly. It flagged one competitor citation (Repurpose.io) as a real company but the wrong category (video, not text) — a precision catch, not a fabrication catch.
- **Stage 3 critic** independently *recomputed* every piece of arithmetic from scratch (it did not find any actual calculation errors — the worker's math checked out) but went further: it algebraically tested whether the ranking was robust to alternative, equally defensible weighting schemes, and found the #1 pick **flips outright** under a scheme that favors buildability/speed over demand. It also caught that the "addressable vs. structural risk" argument used to justify the #1 slot wasn't applied symmetrically to the runner-up.

**Assessment:** the pattern across all three stages was not "worker makes an obvious error, critic catches it" — it was closer to "worker does competent, mostly-correct work; critic finds a real, non-obvious flaw in consistency, completeness, or robustness that survives a second, independently-reasoned pass." That is a stronger result for validating the verification loop than a pilot that just catches typos or shallow mistakes would have been — the flaws caught were the kind that would plausibly have shipped as confident-sounding conclusions if only one agent had produced this output.

## 4. Cost and token data (real, not estimated)

Actual per-agent token usage, as reported by the sub-agent tool after each run:

| Agent | Tokens |
|---|---|
| Stage 1 Worker | 45,075 |
| Stage 1 Critic | 43,660 |
| Stage 2 Worker | 48,144 |
| Stage 2 Critic | 41,706 |
| Stage 3 Worker | 44,999 |
| Stage 3 Critic | 41,110 |
| **Total (6 agents)** | **264,694** |

Model used throughout: Claude Sonnet 5 (current pricing: $2.00/MTok input, $10.00/MTok output). The sub-agent tool reports a combined token count, not a separate input/output split, so an exact dollar figure isn't available from this run — but bounding it: at the all-input rate ($2/MTok) the floor is ~$0.53; at the all-output rate ($10/MTok) the ceiling is ~$2.65. Given these tasks were mostly long-form generation (short prompts, long structured markdown output), the realistic figure sits well above the floor — **a reasonable estimate is roughly $2 for the full 6-agent, 3-stage pipeline.** Orchestrator (this session's own) overhead is separate and not included in that figure — it's a small fraction of one Sonnet session's context budget, immaterial next to the sub-agent cost.

**Read on the cost profile:** genuinely cheap. A ~$2, sub-20-minutes-of-wall-clock research pipeline that produced a defensible, self-correcting 5-idea evaluation with ranked recommendation is well within "worth running many times" territory, even before any model-routing optimization (routing routine steps to a cheaper model per plan doc §6 would cut this further). This is a real data point supporting the plan's assumption that a worker/critic architecture is affordable at this project's scale — it is not a reason to assume it stays cheap at 10x or 100x the agent count without the cost-control mechanisms in plan doc §6 (financial controller role, model routing, prompt caching) actually being built.

## 5. Does the process hold up?

**Verification loop: validated.** Three-for-three real, substantive catches, including one (Stage 3) that surfaced genuine ranking fragility rather than a simple factual error — arguably the most valuable kind of catch for a scoring/ranking pipeline, since a wrong ranking is far more consequential than a wrong fact.

**Cost profile: validated at this scale.** ~$2 and ~9 minutes of total sub-agent wall-clock time (durations: 62s, 136s, 81s, 150s, 41s, 132s) for a 6-agent, 3-stage pipeline is affordable and fast enough to iterate on. No runaway spend, no context-degradation issues observed — every agent completed its task in a single pass with no retries needed.

**One limitation worth naming honestly:** because "no external calls" was a hard constraint for this pilot, all market/competition claims (including every named competitor product) rest on the agents' training knowledge, not live verification. The Stage 2 critic itself flagged medium-confidence uncertainty on several named products (Practice Better, PT Distinction, Typeshare, Simplified, Way of Life) rather than asserting them as fact — which is the correct behavior for this constraint, but means the market analysis in §2 should be treated as a structured hypothesis, not verified market research, before any real decision is made on it.

## 6. Explicit scope note

Per instructions, this is a one-shot validation run. **No further phase has been started.** The process has been proven to work at small scale with real (if bounded) cost data; the actual idea evaluation output (§2) is a secondary artifact of that validation, not itself a commitment to build CoachDesk, RepurposeIt, or anything else. Any decision to act on §2 is Eric's, separate from this pilot's own pass/fail verdict on the architecture.
