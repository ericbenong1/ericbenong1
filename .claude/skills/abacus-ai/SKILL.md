---
name: abacus-ai
description: Use this whenever a task calls Abacus.AI, RouteLLM, or ChatLLM; queries the venture's document retriever / RAG store; or has to decide which model handles a sub-task (Abacus.AI or not — that decision is what this skill is for). Also trigger for anything touching this repo's docs/autonomous-agent-venture-plan.md Phase 2 memory/routing layer. Covers REST auth, the `abacusai` Python SDK, and RouteLLM's OpenAI-compatible endpoint, all oriented around spending the fewest tokens/dollars per call rather than the most convenient default.
---

# Abacus.AI — token-efficient usage

Abacus.AI is this venture's macro-orchestration/memory layer (plan doc §4): a RAG vector
store for shared agent memory, plus RouteLLM for cost-aware model selection across
Claude/Gemini/cheaper open models. The reason this skill exists at all is that it's easy
to call an API "correctly" while still wasting most of the tokens or dollars it costs.
Every section below is a lever for not doing that.

## Before anything else: don't hardcode the key

Read the key from an environment variable (`ABACUS_API_KEY` or whatever this project has
named it) — never paste it into a script, prompt, or commit. If it isn't set, stop and ask
rather than guessing or inventing one.

## Auth, in one paragraph each

**REST**: header `apiKey: <key>`, base `https://api.abacus.ai/api/v0/<action>` (e.g.
`.../api/v0/listRouteLLMModels`).

**Python SDK**: `pip install abacusai` (if install fails with a setuptools/`install_layout`
error, that's a stale system `setuptools`/`wheel` conflict, not the package — use a venv:
`python3 -m venv .venv && .venv/bin/pip install abacusai`). Then:
```python
import os
from abacusai import ApiClient
client = ApiClient(os.environ["ABACUS_API_KEY"])
```

**RouteLLM** (OpenAI-compatible): `Authorization: Bearer <key>` at base
`https://routellm.abacus.ai/v1` — works as a drop-in with the OpenAI SDK
(`OpenAI(base_url="https://routellm.abacus.ai/v1", api_key=key)`), or plain REST.

## The single biggest lever: route the task, not a habit

Don't call a frontier model out of habit for work a cheap model can do just as well and
you can still check. Classify the task first, the way the plan doc's routing framework
(§6) already commits to:

- **Routine, repeatable, checkable** (most agent output — routine drafts, classification,
  extraction, formatting) → a cheap routed model. Pass an explicit `llm_name`
  (SDK) or `model` (RouteLLM REST) rather than leaving it on auto-select, so cost is a
  choice, not a default.
- **Ambiguous, high-stakes, or touching governance** → a frontier Claude/Gemini model.
- **Needs a specific capability** (vision, live web, code execution) → whichever model
  actually has that capability, regardless of tier.

Cheap options that exist right now (confirmed live against the installed SDK's
`abacusai.api_class.enums.LLMName` — see `references/api-reference.md` for the full list,
since this changes over time and hardcoding it here would go stale):
`GEMINI_3_5_FLASH_LITE`, `LLAMA3_1_8B`, `OPENAI_GPT5_NANO`, `CLAUDE_V3_5_HAIKU`.

Before locking in a model choice for anything recurring, call
`client.list_route_llm_models()` (or `GET /v1/models` on the RouteLLM base) to check
*current* pricing — the catalog and rates move, and a hardcoded "cheapest model" list
drifts wrong.

Always pass an explicit token cap (`max_tokens` on `evaluate_prompt`,
`num_completion_tokens` on `get_chat_response`/`get_conversation_response`). An unbounded
generation on a cheap model can still cost more than a bounded one on an expensive model.

## RAG / shared memory: pull chunks, not documents

For anything hitting the venture's document retriever, use
`client.get_matching_documents(document_retriever_id, query, limit=..., max_words=...,
max_words_per_chunk=...)` — it returns only the relevant chunks, ranked by relevance, not
the source document. This is *removal* in the plan doc's own vocabulary (§6: removal vs.
shrinking vs. discounting) — the irrelevant material never enters the request at all,
which is strictly better than shrinking it after the fact. Tune `limit` and `max_words`
down to the smallest number of chunks that actually answers the question; padding the
lookup "to be safe" defeats the point of having a retriever instead of just dumping
memory into context.

## Prompt shape: static prefix, dynamic suffix

Structure calls as a stable prefix (persona, tool schemas, standing rules) followed by the
variable part (current task/state) — the same discipline the plan doc already commits to
for prompt caching. A prompt that reshuffles its "constant" material on every call pays
full price every time instead of hitting the cache.

## When you need an exact method signature: ask the SDK, not your memory

`abacusai`'s methods and parameters change across releases; a hardcoded reference in this
file will eventually be wrong in a way that's hard to notice. The installed package is the
source of truth and costs nothing to check:
```bash
python3 -c "import inspect, abacusai; print(inspect.signature(abacusai.ApiClient.get_chat_response))"
```
`references/api-reference.md` has the signatures and the full `LLMName` list as they stood
when this skill was written, for a quick read — but re-verify with the command above
before depending on an exact parameter name for anything that matters.

## One environment fact, not an API fact

Some Claude Code sandboxes (this repo's cloud sessions, confirmed here) have a network
egress policy that blocks `abacus.ai` domains outright — calls fail at the proxy (403 on
CONNECT) regardless of whether the API key is valid. If a call to Abacus.AI fails
immediately with a connection-level error rather than an auth or API error, check the
network policy before assuming the key or the request is wrong.
