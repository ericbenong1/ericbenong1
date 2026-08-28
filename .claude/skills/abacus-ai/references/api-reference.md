# Abacus.AI API reference (verified against `abacusai` v1.4.110)

Everything below was read directly from the installed `abacusai` Python package's source
and docstrings (`pip install abacusai`), not from documentation prose or training
knowledge — that package is the actual client Abacus.AI ships, so it's more reliable than
a cached description of it. It **will drift** as the SDK is updated; re-check with
`inspect.signature(...)` (see SKILL.md) before trusting an exact parameter name for
anything consequential. This file is a fast-read snapshot, not a promise.

## Auth surfaces (three, not one)

| Surface | Header | Base URL |
|---|---|---|
| Abacus.AI REST | `apiKey: <key>` | `https://api.abacus.ai/api/v0/<action>` |
| Abacus.AI Python SDK | `ApiClient(api_key)` constructor arg | wraps the REST surface above |
| RouteLLM (OpenAI-compatible) | `Authorization: Bearer <key>` | `https://routellm.abacus.ai/v1` |

The REST action naming convention is camelCase (e.g. `listRouteLLMModels`,
`getMatchingDocuments`); the Python SDK method names are the snake_case equivalents.

## Chat / prompt methods

### `evaluate_prompt` — single-shot, no deployment needed
```python
ApiClient.evaluate_prompt(self, prompt: str = None, system_message: str = None,
    llm_name: Union[LLMName, str] = None, max_tokens: int = None, temperature: float = 0.0,
    messages: list = None, response_type: str = None, json_response_schema: dict = None,
    stop_sequences: List = None, top_p: float = None) -> LlmResponse
```
The lightest-weight way to route a single call to a specific model. Set `llm_name`
explicitly for cost control — leaving it `None` means auto-selection, which is
convenient but not a cost decision you made on purpose. Set `max_tokens`.
`json_response_schema` is worth using whenever you need structured output — it's cheaper
and more reliable than parsing free text out of a longer response.

### `get_chat_response` / `get_conversation_response` — deployment-backed, with retrieval
```python
ApiClient.get_chat_response(self, deployment_token: str, deployment_id: str, messages: list,
    llm_name: str = None, num_completion_tokens: int = None, system_message: str = None,
    temperature: float = None, filter_key_values: dict = None, search_score_cutoff: float = None,
    chat_config: dict = None, user_info: dict = None, exclude_thinking_segments: bool = False) -> Dict

ApiClient.get_conversation_response(self, deployment_id: str, message: str, deployment_token: str,
    deployment_conversation_id: str = None, external_session_id: str = None, llm_name: str = None,
    num_completion_tokens: int = None, system_message: str = None, temperature: float = None,
    filter_key_values: dict = None, search_score_cutoff: float = None, chat_config: dict = None,
    doc_infos: list = None, user_info: dict = None, execute_usercode_tool: bool = False,
    exclude_thinking_segments: bool = False) -> Dict
```
Use these against a deployment that already has a document retriever attached, so
retrieval-augmented context comes back automatically. `search_score_cutoff` is a token
lever worth knowing about: it drops low-relevance retrieved chunks before they ever reach
the model, same principle as tuning `get_matching_documents`' `limit`/`max_words` below.
`get_conversation_response` persists turns server-side under
`deployment_conversation_id` — reuse that ID across a multi-turn exchange instead of
resending prior turns yourself.

`create_deployment_conversation(deployment_id, name=None, external_application_id=None)`
starts the conversation these two build on.

Streaming variants exist for both (`get_streaming_chat_response`,
`get_streaming_conversation_response`) — prefer them for anything long enough that a
premature stop (budget cutoff, user cancel) should stop generation rather than paying for
tokens already generated.

## RAG / document retriever

### `get_matching_documents` — the chunk-pull, not the document-pull
```python
ApiClient.get_matching_documents(self, document_retriever_id: str, query: str,
    filters: dict = None, limit: int = None, result_columns: list = None,
    max_words: int = None, num_retrieval_margin_words: int = None,
    max_words_per_chunk: int = None, score_multiplier_column: str = None,
    min_score: float = None, required_phrases: list = None, filter_clause: str = None,
    crowding_limits: Dict[str, int] = None, include_text_search: bool = False
) -> List[DocumentRetrieverLookupResult]
```
Returns chunks sorted by relevance, not whole documents. The tunable knobs that
actually control token spend: `limit` (how many chunks), `max_words` (total budget across
all returned chunks), `max_words_per_chunk` (cap per chunk), `min_score` (relevance floor
— raise it to cut low-value chunks rather than paying for a bigger `limit`).
`required_phrases`/`filter_clause` narrow the search itself rather than filtering a
larger result set after the fact, which is strictly cheaper.

`create_document_retriever(project_id, name, feature_group_id, document_retriever_config)`
is how one gets set up in the first place — a feature group's document columns get
chunked and embedded. Not something a routine agent call needs to touch.

## RouteLLM

```python
ApiClient.list_route_llm_models(self)  # GET listRouteLLMModels — model name, description, id, price
```
Also reachable as `GET https://routellm.abacus.ai/v1/models` in the OpenAI-compatible
surface. Check this before hardcoding a "cheap model" choice anywhere persistent —
pricing and the catalog change.

Chat completions on the RouteLLM surface follow the standard OpenAI request/response
shape (`POST /v1/chat/completions` with `model`, `messages`, `max_tokens`, etc.) — any
OpenAI-SDK-compatible client works by pointing `base_url` at
`https://routellm.abacus.ai/v1`.

## `LLMName` enum — full list as of `abacusai` 1.4.110

Confirmed by importing `abacusai.api_class.enums.LLMName` directly (105 values). Treat
this as a snapshot to skim for "does a cheap/specialist option exist," not a source to
copy a model string out of for production use without re-checking
`list_route_llm_models()` first — new tiers get added and old ones get retired.

**Notably cheap/small tiers** (good default candidates for routine, checkable agent
work): `OPENAI_GPT5_NANO`, `OPENAI_GPT5_NANO_HIGH`, `OPENAI_GPT5_4_NANO`,
`OPENAI_GPT5_MINI`, `OPENAI_GPT5_MINI_LOW`, `OPENAI_GPT5_4_MINI`, `OPENAI_GPT4O_MINI`,
`OPENAI_GPT4_1_MINI`, `OPENAI_GPT4_1_NANO`, `OPENAI_O1_MINI`, `OPENAI_O4_MINI`,
`CLAUDE_V3_HAIKU`, `CLAUDE_V3_5_HAIKU`, `GEMINI_3_5_FLASH_LITE`,
`GEMINI_3_1_FLASH_LITE`, `GEMINI_1_5_FLASH`, `GEMINI_2_FLASH`, `XAI_GROK_3_MINI`,
`LLAMA3_1_8B`, `QWEN_2_5_32B`.

**Frontier / high-reasoning tiers** (reserve for ambiguous or governance-touching work):
`CLAUDE_V5_OPUS`, `CLAUDE_V5_SONNET`, `CLAUDE_V4_8_OPUS`, `CLAUDE_V4_7_OPUS`,
`OPENAI_GPT5_6_LUNA`/`SOL`/`TERRA`, `OPENAI_GPT5_5`, `OPENAI_O3_HIGH`,
`GEMINI_3_1_PRO`, `GEMINI_3_PRO`, `XAI_GROK_4_6`.

**Full alphabetical list**: ABACUS_DRACARYS, ABACUS_SMAUG3, CLAUDE_V3_5_HAIKU,
CLAUDE_V3_5_SONNET, CLAUDE_V3_7_SONNET, CLAUDE_V3_HAIKU, CLAUDE_V3_OPUS,
CLAUDE_V4_5_OPUS, CLAUDE_V4_5_SONNET, CLAUDE_V4_6_OPUS, CLAUDE_V4_6_SONNET,
CLAUDE_V4_7_OPUS, CLAUDE_V4_8_OPUS, CLAUDE_V4_OPUS, CLAUDE_V4_SONNET, CLAUDE_V5_OPUS,
CLAUDE_V5_SONNET, DEEPSEEK_R1, DEEPSEEK_V3_1, GEMINI_1_5_FLASH, GEMINI_1_5_PRO,
GEMINI_2_5_FLASH, GEMINI_2_5_PRO, GEMINI_2_FLASH, GEMINI_2_PRO, GEMINI_3_1_FLASH_LITE,
GEMINI_3_1_PRO, GEMINI_3_5_FLASH, GEMINI_3_5_FLASH_LITE, GEMINI_3_6_FLASH,
GEMINI_3_7_FLASH, GEMINI_3_FLASH, GEMINI_3_PRO, GEMMA_4_31B, INKLING, KIMI_K2_5,
KIMI_K2_6, KIMI_K2_7_CODE, KIMI_K3, LLAMA3_1_405B, LLAMA3_1_70B, LLAMA3_1_8B,
LLAMA3_3_70B, LLAMA3_LARGE_CHAT, LLAMA4_MAVERICK, MINIMAX_M2_7, MINIMAX_M3,
MUSE_SPARK_1_1, MUSE_SPARK_1_2, OPENAI_GPT3_5, OPENAI_GPT3_5_TEXT, OPENAI_GPT4,
OPENAI_GPT4O, OPENAI_GPT4O_MINI, OPENAI_GPT4_1, OPENAI_GPT4_128K,
OPENAI_GPT4_128K_LATEST, OPENAI_GPT4_1_MINI, OPENAI_GPT4_1_NANO, OPENAI_GPT4_32K,
OPENAI_GPT5, OPENAI_GPT5_1, OPENAI_GPT5_2, OPENAI_GPT5_4, OPENAI_GPT5_4_MINI,
OPENAI_GPT5_4_NANO, OPENAI_GPT5_5, OPENAI_GPT5_6_LUNA, OPENAI_GPT5_6_SOL,
OPENAI_GPT5_6_TERRA, OPENAI_GPT5_MINI, OPENAI_GPT5_MINI_HIGH, OPENAI_GPT5_MINI_LOW,
OPENAI_GPT5_NANO, OPENAI_GPT5_NANO_HIGH, OPENAI_O1_MINI, OPENAI_O3, OPENAI_O3_HIGH,
OPENAI_O4_MINI, OPENAI_O4_MINI_HIGH, OX_ALPHA, QWEN3_235B_A22B, QWEN3_32B, QWEN3_6,
QWEN3_6_27B, QWEN3_7_MAX, QWEN3_8_27B, QWEN3_8_MAX, QWEN3_CODER, QWEN_2_5_32B,
QWEN_2_5_32B_BASE, QWEN_2_5_72B, QWQ_32B, XAI_GROK, XAI_GROK_3, XAI_GROK_3_MINI,
XAI_GROK_4, XAI_GROK_4_2, XAI_GROK_4_3, XAI_GROK_4_5, XAI_GROK_4_6,
XIAOMI_MIMO_V2_PRO, ZAI_GLM_5_1, ZAI_GLM_5_2, ZAI_GLM_5_3

## Installing the SDK without the setuptools error

`pip install abacusai` on a system Python can fail with an `install_layout` /
`AttributeError` from a Debian-patched `setuptools`. Fix: use a virtualenv rather than
fighting the system installer —
```bash
python3 -m venv .venv
.venv/bin/pip install --quiet abacusai
```

## Known environment constraint (not an API fact)

Confirmed by direct test in this repo's Claude Code cloud sessions: the network egress
proxy rejects the CONNECT to `api.abacus.ai` and `routellm.abacus.ai` with a 403 —
`abacus.ai` domains are blocked by this environment's network policy, full stop. A valid
API key does not help; nothing short of changing the environment's egress policy does.
This is specific to that kind of sandboxed session — it doesn't apply to a local machine
or a differently-configured environment.
