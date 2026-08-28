# Project Status — Autonomous Multi-Agent Venture

**Purpose of this file:** a fast on-ramp for a new chat session. Read this + `docs/autonomous-agent-venture-plan.md` and you have full context — no need to re-explain the project from scratch.

## Where things stand

**Phase: Pre-Phase-0.** Governance and architecture planning only. Nothing has been built, no sandbox pilot has run, no money has moved, nothing external has been touched. See `docs/autonomous-agent-venture-plan.md` §7 for the phase definitions.

**Source of truth:** `docs/autonomous-agent-venture-plan.md`, tracked in [PR #1](https://github.com/ericbenong1/ericbenong1/pull/1) on branch `claude/video-review-cqrxwj`. That file has the full architecture, governance model, and open questions — this file only adds operational notes that don't belong in the architecture doc itself.

## Key decisions so far

- **Governance:** a board-meeting model with Eric holding unconditional veto on any real spend, external action, or new recurring commitment. Full detail in the plan doc §5.
- **Sub-agent hiring/firing:** delegated to a budget envelope + Hiring Committee (doesn't need board approval), with Eric retaining a standing right to hire/fire directly at any time, independent of the meeting cadence.
- **Financial recordkeeping:** a Controller/Bookkeeper agent role logs revenue/expense events with tax-relevant metadata as they happen — organizes records for a real accountant, does not replace one.
- **Ambition:** full self-funding autonomy is the long-term goal, reached only through the phased roadmap (§7) — currently at Phase 0, nothing built yet.
- **Product direction:** open-ended — agents research and decide what to build/sell, not a fixed product line.

## Environment / access notes

- **This Claude Code sandbox cannot reach YouTube or Substack** (`natesnewsletter.substack.com`, including its `/feed` and individual post URLs) — blocked by this environment's network egress proxy, confirmed via direct test. GitHub is reachable. **Workaround in use:** Eric pastes article/transcript text directly — done twice now (Open Brain post, then 4 more full pieces: the 10-agent video transcript + 3 Nate B. Jones articles on token/context saving, multi-agent verification ("Ringer"/institutions), and model routing). This works well — keep using it.
- **Nate B. Jones** (newsletter, YouTube, GitHub `NateBJones-Projects`) is Eric's trusted source for AI engineering ideas/tools. Now grounded in primary-source content he's pasted directly (see above), not secondhand summaries — this substantially upgraded confidence in the plan doc's design in several places (see plan doc §2 update note, §5 appeals process, §6 routing/context techniques, §8 security note).
  - **Ringer** — a real, open-source local pre-call router + swarm orchestrator (per Nate's own July 2026 writeup, not just a GitHub summary now). Intercepts requests from **Codex CLI** specifically before they reach a provider — can return a cached accepted answer, run a fixed code path, select relevant source passages, or stop an oversized request. Worker lanes: Codex, Grok Build, OpenCode/OpenRouter. Ships with "Ringside," a browser dashboard. **This is why it needs a local machine (Eric's Windows laptop), not this cloud session** — it's CLI-based local software, not a hosted service. Important caveat, in Nate's own words: **Ringer does not yet reliably support Claude Code** (its Anthropic adapter passes unit tests but failed a live check as of July 2026) — so it's not a drop-in for this plan's Claude-Code-centric execution layer without further checking. Candidate to evaluate during Phase 0, not yet adopted.
  - **AI Airlock** (macOS-only document sanitizer for AI tools) — not usable for Eric, no macOS available.
  - **"Open Brain"** — resolved: Eric pasted Nate's Mar 2026 post in full. It's a personal, MCP-accessible knowledge store (Postgres + pgvector via Supabase, captured via Slack, ~$0.10–0.30/mo) that any AI tool can semantically search instead of Eric re-explaining context every new chat. This is **Eric's personal context layer, distinct from the venture's own agent-team memory** (the Abacus.AI RAG store in the plan doc). Noted as a candidate Phase 1+ integration in plan doc §4 (Chief of Staff querying it via MCP at board-meeting time) — not built, not committed, not blocking anything. The actual setup guide/prompt kit is paid content behind Nate's paywall — implementation steps aren't accessible from this environment; paste specific steps if/when we build it.
- **Devices:** Eric uses Chrome/Chromebook, the Claude app, and a Windows laptop (no macOS). This session runs in the cloud regardless of what device he's on — no device switch needed unless a specific future tool requires local execution (e.g., Ringer, confirmed above to be exactly that kind of tool). Nothing currently requires switching.
- **Platforms available:** Claude Code/API, Abacus.AI, Lovable — all already accessible. Gemini available as a routed option via Abacus.

## Session practice (to manage context/cost)

- The repo (this file + the plan doc) is the persistent record — not the chat history. A new session should be bootstrapped by pointing it here rather than re-explaining the project.
- Keep working in one session for active back-and-forth on a single topic. Start a **new session at real phase boundaries** (e.g., when Phase 0 execution actually kicks off) rather than per message.
- To bootstrap a new session: *"Read `docs/autonomous-agent-venture-plan.md` and `STATUS.md` in ericbenong1/ericbenong1 (branch `claude/video-review-cqrxwj`, PR #1), then continue from there."*
- Update this file (not just the plan doc) whenever an operational/environment fact changes — access constraints, tooling decisions, device notes — so it doesn't only live in chat history.

## Next concrete action

Phase 0 sandbox pilot (plan doc §9): a small Claude Code experiment — Orchestrator + 2-3 worker/critic pairs, one narrow research question, no external calls, no spend — to validate the verification loop and get real token-cost data before building anything else. **Not started.**
