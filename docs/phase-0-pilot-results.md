# Phase 0 Pilot — Results

**Date:** 2026-08-28
**Status:** Complete. Sandbox only — no external calls, no spend, no real listings or publishing.

This is the "small Claude Code experiment" called for in `docs/autonomous-agent-venture-plan.md` §7/§9: an Orchestrator plus worker/critic pairs, one narrow research question, run entirely inside this Claude Code session. Goal was to (1) check whether the worker/critic verification loop actually catches problems, and (2) get a real feel for token cost before building anything bigger.

## Setup

- **Orchestrator:** this session, acting in that role directly — assigning the task, dispatching agents, and synthesizing results.
- **Workers:** 3 independent general-purpose sub-agents, run in parallel, each with no visibility into the others' output or into each other's existence.
- **Critics:** 3 independent general-purpose sub-agents, run in parallel after the workers finished. Each critic saw exactly one worker's draft and had no visibility into the other two drafts — a critic never reviewed the same output another critic reviewed, and no worker saw any critique.
- **Task given to workers:** identify and evaluate 3 narrow, low-capital digital product/service ideas for a solo-operator online business, using only general background knowledge (no live web access available or needed), explicitly instructed not to fabricate statistics, named competitors, or citations, and to give for each idea: a description, a validation-effort estimate, key assumptions, and the single biggest unknown/risk.
- **Task given to critics:** a fixed 6-point checklist (fabrication, unsupported claims dressed as analysis, internal contradictions, evasion/genericness, missing obvious risks, anything that could mislead a human decision-maker) plus a pass/fail verdict.

This mirrors the plan doc's core rule (§4): no agent's output ships on its own say-so, and the critic is structurally isolated from the worker that produced what it's reviewing.

## What the workers produced

All three workers converged on similar categories (Etsy/digital-download template packs, a narrow micro-SaaS utility, a niche newsletter) — expected, since they weren't given creative-divergence instructions. More importantly: **none fabricated a statistic, named competitor, or invented citation.** All three explicitly flagged where they lacked confidence in a number rather than inventing one. This is a genuinely good sign for baseline output discipline on a well-scoped task, and it also meant the pilot ended up testing something more useful than "can critics catch fabrication" — it tested whether critics catch *quality* gaps in output that already clears the fabrication bar.

## What the critics caught

All three critics independently found real, non-overlapping problems the corresponding worker had missed:

- **Critic A** (reviewing Worker A): flagged that Idea 2's stated "biggest unknown" was purely technical/platform risk, silently dropping the monetization-willingness question that Ideas 1 and 3 correctly centered — an internal inconsistency in rigor across the same draft. Also flagged missing marketplace-saturation risk on Idea 1. Verdict: pass with caveats.
- **Critic B** (reviewing Worker B): flagged a confidence mismatch (an assumption stated more assertively than the draft's own hedging elsewhere), and — the most substantive catch — the total absence of platform ToS/API-policy risk across all three ideas, plus no effort-vs-payoff/income-ceiling reality check. Verdict: pass with minor revisions requested.
- **Critic C** (reviewing Worker C): independently caught the same class of gap — missing legal/ToS/IP risk (specifically copyright/trademark exposure for template niches, and ToS/reverse-engineering exposure for the micro-SaaS idea) and missing margin/effort-payoff realism. Verdict: pass with caveats, recommended sending back for one added sentence per idea.

Notably, **two of the three critics independently converged on the same missing risk category** (platform ToS/legal exposure) without seeing each other's work or the other drafts — a reasonable signal that this wasn't a critic idiosyncrasy but a real, systematic gap in how the workers approached the task.

## Verification-loop assessment

**The loop worked.** Every worker draft that would otherwise have looked complete and reasonable turned out to have a real, specific, non-trivial gap that only surfaced under isolated review — and no critic returned a rubber-stamp "no problems found." At the same time, no critic invented a problem that wasn't there or flagged something already correctly hedged in the draft — this wasn't a critic performing manufactured pickiness to justify its existence. This is the pattern the plan doc's §4/§5 verification requirement is designed to produce: catching omission and unsupported-confidence issues, not just outright fabrication.

One caveat worth logging for Phase 1+: this pilot used a fixed critique checklist per the plan's design, which likely primed all three critics toward similar risk categories (ToS/legal, payoff realism) — some convergence may be an artifact of a shared checklist rather than fully independent judgment. Worth varying critic instructions somewhat in a future pilot to test whether the same gaps still surface without a shared checklist nudging toward them.

## Token / cost data

| Role | Count | Total sub-agent tokens | Wall time (parallel) |
|---|---|---|---|
| Workers | 3 | ~121,500 | ~16s |
| Critics | 3 | ~127,500 | ~15–39s |
| **Total** | **6 agents** | **~249,000 tokens** | **~55s combined, run in two sequential parallel batches** |

This excludes the orchestrator's own token usage (this session) for dispatch and synthesis, which isn't separately metered by the tooling available here — a real limitation for the Financial Controller role described in plan doc §6, which will need actual per-call cost visibility (not just aggregate session cost) to do its job. Note also that these are Claude Code sub-agent tokens, not a like-for-like comparison to a cheap-tier "workhorse" model per the plan's routing framework (§6) — this pilot ran everything on the same tier by default, which is realistic for a first pilot but doesn't yet exercise cost-aware routing.

For 3 short (~500-word target) research drafts plus 3 critiques, ~249k tokens is a meaningful per-cycle cost — this is the kind of number the plan's cost/context-engineering layer (§6) exists to manage before scaling up worker/critic pair counts or running cycles continuously.

## Conclusions for next steps

1. **Verification loop validated at small scale.** Worth carrying the worker/critic pattern forward into Phase 1 rather than treating it as unproven.
2. **Critic checklists should stay loosely specified, not rigid**, to avoid convergence-by-shared-checklist masking as independent judgment — worth testing in a follow-up pilot.
3. **Per-agent cost visibility is a real gap**, not just a nice-to-have — before Phase 1's dashboard/ledger work, confirm what cost data is actually obtainable per sub-agent call versus only at the session level.
4. **No fabrication issues surfaced** in this run, so this pilot doesn't yet validate the critic loop's ability to catch outright confident fabrication (per plan doc §8's evasion concern from Nate B. Jones's account) — a future pilot should deliberately include a task more likely to tempt fabrication (e.g., one requiring specific figures) to test that path specifically.

Phase 0 (plan doc §7) is complete per its own success criteria: the verification loop was exercised and shown to catch real issues, and real token-cost data was captured, without any spend, external action, or board process being needed. Phase 1 (governance harness — Lovable + Supabase board dashboard) is the next item on the roadmap, pending Eric's go-ahead.
