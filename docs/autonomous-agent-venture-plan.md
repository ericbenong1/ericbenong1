# Autonomous Multi-Agent Venture — Synthesis & Plan

**Status:** Draft v1 — planning document only. No code, no spend, no live integrations yet.
**Owner:** Eric (Chief Human Officer / Board Chair — final veto on all board items, see [Governance](#governance-the-board-meeting-model))

## 1. Purpose of this document

This consolidates three AI-generated research reports (built from five source videos on autonomous multi-agent AI systems) into one plan: what's actually established, what's speculative, and a concrete, phased path toward a self-funding, largely-autonomous multi-agent venture — bounded from day one by a board-approval mechanism where I retain final veto.

The goal right now is direction-setting, not execution. Nothing here commits to spending money, publishing anything externally, or writing code.

## 2. What the source material actually is — read with caution

Before treating any of this as engineering fact, it's worth being explicit about provenance, because the three reports blur two very different kinds of source:

- **One real anecdote, extensively analyzed.** The central case study — "10 AI agents left alone for 3 days" — is a single YouTube video: one person's account of one run, with no independent verification, no published logs, and strong incentive (it's a growth-hacking YouTube channel) to make the outcome sound more emergent and dramatic than it may have been. Numbers like "742 notes," "27 Etsy drafts," "22 agents" should be treated as *claims*, not measurements.
- **A grab-bag of unrelated supporting material, presented as if it's one coherent body of evidence.** The reports weave in an unrelated persistent-chatbot experiment ("Wild Static"), an unrelated self-funding-wallet demo ("Automaton"), a "$50 AI boss" anecdote, and various blog posts and arXiv papers, some of which are cited with plausible-but-unverified titles and 2026 dates I can't independently confirm from here (no live web/YouTube access in this environment). Some of these citations may be real, some may be slightly-off or fabricated by the research tool — **don't cite any of them externally without verifying the source directly first.**

What *is* well-established, independent of any of that, and worth building on:
- Claude Code's actual, documented context-management behavior (tool-result truncation, history snipping, prompt caching mechanics) — this is real product behavior, not anecdote.
- The general pattern of **worker/critic (or generator/reviewer/adjudicator) loops** improving output quality over naive self-correction — this is a well-supported pattern in agentic system design generally (Anthropic's own "Building Effective Agents" writeup describes evaluator-optimizer loops), even if the specific "Gauntlet Loop" branding is not.
- Prompt caching economics (Anthropic explicit / OpenAI implicit) — this is documented provider behavior.

**Working principle for this whole plan: treat the anecdote as inspiration for what's *possible*, and design the actual system from first principles and verifiable platform documentation — not from the assumption that the video's internal architecture is real or reproducible.**

## 3. What we're actually trying to build

An **open-ended, self-directed venture**: a persistent multi-agent system that researches markets, decides for itself what to build or sell, produces the work, and — over time, and only inside a governance structure I control — earns and reinvests its own money. Not a single fixed product line; the agents' first real job is figuring out what's worth doing.

## 4. Architecture — four layers

| Layer | Platform | Role |
|---|---|---|
| **Execution** | Claude Code / Claude API | Runs individual agents: shell/tool access, sandboxed permissions, sub-agent spawning, context compaction. This is where actual work happens. |
| **Verification** | Claude Code (worker + critic agent pairs) | Every substantive output gets reviewed by an isolated critic agent before it's considered "done." No agent's output ships on its own say-so, regardless of which model produced it. |
| **Macro-orchestration & memory** | Abacus.AI | Task queue / event-driven agent spin-up, RAG vector store for shared long-term memory, RouteLLM for cost-aware model selection across Claude / Gemini / cheaper open models. |
| **Governance & interface** | Lovable (+ Supabase) | The board dashboard: proposal queue, approval/veto UI, spend ledger, agent activity feed. This is the only channel through which agents reach the outside world for anything consequential. |

Gemini is available as a routed option inside Abacus.AI/RouteLLM for cheap/high-volume tasks, reserving Claude for harder reasoning and anything touching the governance layer.

### Why verification is structural, not optional

The clearest actionable lesson across all three reports — independent of whether the specific anecdotes are real — is: **don't let a single agent both produce and approve its own output, no matter how capable the model.** Concretely: every proposal or deliverable that could reach a board meeting or leave the sandbox passes through an agent that did *not* write it and whose only job is to find problems with it, before a human ever sees it. This is cheap insurance against the two failure modes that show up repeatedly in the source material: confident-sounding fabrication, and agents converging on a shared wrong answer because agreeing is easier than being right.

## 5. Governance: the board meeting model

This is the part that's actually mine to design, not the videos' — the reports assumed either full autonomy or a flat "everything is a draft" rule. Instead:

**Default posture:** agents can research, draft, build, and simulate freely inside the sandbox. Nothing leaves the sandbox — no real spend, no real external publish, no irreversible action — without board approval.

**What requires a board decision:**
- Any spend of real money, at any amount.
- Any action visible outside the sandbox (publishing a listing, sending an email/message externally, creating an account, signing up for a service).
- Any new recurring commitment (subscriptions, contracts, API keys with billing attached).
- Hiring/spinning up new sub-agents beyond a pre-agreed compute/cost envelope.
- Anything the Chief of Staff agent itself flags as high-uncertainty or high-risk.

**What doesn't:** internal research, drafts, code in the sandbox, simulated/mocked transactions, sub-agent spawning *within* an already-approved budget envelope for an already-approved task.

**Mechanics:**
- One agent holds the **Chief of Staff** role — aggregates proposals from other agents into a board agenda rather than every agent pinging me individually.
- Board meetings can be **scheduled** (e.g. daily/weekly digest) or **agent-requested** (for anything time-sensitive or above the standing thresholds).
- Every agenda item is a structured proposal: problem, proposed action, cost, risk, expected upside, what happens if we don't act.
- I have **unconditional veto** on every item, every meeting. A vetoed proposal can be revised and resubmitted only with materially new information — not just resubmitted verbatim.
- Every decision (approved, vetoed, deferred) is logged permanently in the ledger — this is also the audit trail if something goes wrong later.

**Trust ladder (how autonomy is allowed to grow):** rather than an automatic mathematical gate (as one report proposed — profit exceeds cost ⇒ auto-upgrade), autonomy expansion is itself a board decision. E.g., after N clean cycles of a specific action class (say, a specific low-risk spend category) going through approval without incident, I can choose to pre-approve that *specific, narrow* class going forward — revocably, at any time. Nothing expands by default; expansion is always something I opt into, deliberately, one category at a time.

## 6. Cost & context engineering (the "keep it alive" layer)

Independent of the governance question, a persistent multi-agent system needs defenses against runaway token spend and context degradation, or it dies on infrastructure cost before it does anything useful:

- **Model routing:** cheap/fast models (via Abacus RouteLLM) handle routine, repeatable work; Claude/Gemini frontier models are reserved for genuinely ambiguous or high-stakes reasoning and anything touching governance.
- **Prompt caching:** structure agent prompts with a static prefix (persona, tool schemas, standing rules) and dynamic suffix (current task/state), so repeated context isn't repriced every call.
- **Context compaction:** rely on Claude Code's existing pipeline (truncate oversized tool output → snip stale history → compact → summarize as a last resort) rather than reinventing it.
- **Financial controller role:** one agent (or a simple rule layer) tracks token/dollar burn in real time and can pause a runaway worker/critic loop before it becomes a board-meeting-sized problem.

## 7. Phased roadmap

**Phase 0 — Sandbox pilot (no money, no external actions, no board yet needed for basics)**
Stand up a minimal Claude Code environment: one Orchestrator + 2-3 worker/critic pairs, doing open-ended market research on a narrow test question, entirely in the sandbox. Goal: prove the verification loop actually catches bad output, and get a feel for real token cost before committing to anything bigger.

**Phase 1 — Governance harness**
Build the Lovable + Supabase board dashboard: proposal queue, approve/veto buttons, spend ledger, activity feed. No real integrations behind it yet — this is the control surface that everything later plugs into. I should be able to see and control the system before it can touch anything real.

**Phase 2 — Bounded real-world pilot**
Connect Abacus.AI for memory/routing. Let agents research and draft real (but unpublished) products/actions. Everything still routes through the board. First real spend, if any, is small, explicit, and individually approved — not a standing budget.

**Phase 3 — Narrow, opted-in autonomy**
Only after Phase 2 has run cleanly: selectively pre-approve specific, narrow, low-risk action classes (per the trust ladder above). Still logged, still revocable, still nowhere near "full autonomy."

**Phase 4 — Not designed yet.** Broader financial autonomy (real payment rails, standing budgets) is explicitly out of scope until Phases 0–3 have actually run and I've decided, with real evidence instead of a video anecdote, that it's warranted.

## 8. Open questions to resolve before building anything real

- **Legal/entity structure:** does agent-run commerce need a business entity, and does that change what "the board" is allowed to approve?
- **Platform ToS:** does automated/AI-assisted listing creation on any target marketplace (Etsy or otherwise) violate that platform's terms? Needs checking per-platform before Phase 2, not assumed from the source video.
- **Tax treatment** of AI-assisted revenue.
- **Security:** prompt-injection and memory-poisoning defenses for anything with persistent shared memory (the "Wild Static" material, while a separate experiment, is a real cautionary pattern here) — needs a concrete design before Phase 2, not just an awareness note.
- **Meeting cadence in practice:** async agents vs. a human's actual availability — need to pilot this in Phase 1 before assuming daily/weekly digests are the right rhythm.

## 9. Immediate next step

Phase 0 only: a small Claude Code sandbox experiment (Orchestrator + worker/critic pairs, one narrow research question, no external calls, no spend) to validate the verification loop and get real cost data — before any dashboard, any platform integration, or any board process is built. Happy to scope that as the next concrete task when you're ready.
