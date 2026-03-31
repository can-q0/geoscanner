"""Claude API integration for GEO analysis - uses full SKILL.md rubrics."""

import json
import os
import time
from anthropic import Anthropic, RateLimitError
from config import ANTHROPIC_API_KEY

client = Anthropic(api_key=ANTHROPIC_API_KEY)
MODEL_QUICK = "claude-haiku-4-5-20251001"
MODEL_FULL = "claude-sonnet-4-6"

PROMPTS_DIR = os.path.join(os.path.dirname(__file__), "..", "prompts")
SCHEMA_DIR = os.path.join(os.path.dirname(__file__), "..", "schema")

# Cache loaded prompts
_prompt_cache = {}


def _load_prompt(name):
    """Load a SKILL.md prompt file from backend/prompts/."""
    if name not in _prompt_cache:
        path = os.path.join(PROMPTS_DIR, f"{name}.md")
        with open(path, "r") as f:
            _prompt_cache[name] = f.read()
    return _prompt_cache[name]


def _load_schema_templates():
    """Load all JSON-LD schema templates."""
    templates = {}
    for fname in os.listdir(SCHEMA_DIR):
        if fname.endswith(".json"):
            with open(os.path.join(SCHEMA_DIR, fname), "r") as f:
                templates[fname.replace(".json", "")] = f.read()
    return templates


# --- JSON output wrapper ---
JSON_OUTPUT_SUFFIX = """

IMPORTANT: Return ONLY valid JSON (no markdown fences, no explanation text before/after).
Do not wrap in ```json``` blocks. Output raw JSON only.
Keep all text fields concise — max 2-3 sentences per field. Do not exceed 12000 tokens total."""


# --- Quick scan prompt (condensed from audit.md) ---
QUICK_SCAN_PROMPT = _load_prompt("audit") + """

## QUICK SCAN MODE

You are running a QUICK scan (not a full audit). Based on the provided single-page data, estimate scores for all 6 categories. You have limited data so make reasonable estimates.

Return ONLY valid JSON (no markdown, no code blocks):
{
  "geo_score": <int 0-100, weighted composite using: citability*0.25 + brand*0.20 + content_eeat*0.20 + technical*0.15 + schema*0.10 + platform*0.10>,
  "scores": {
    "citability": <int 0-100>,
    "brand": <int 0-100>,
    "content_eeat": <int 0-100>,
    "technical": <int 0-100>,
    "schema": <int 0-100>,
    "platform": <int 0-100>
  },
  "summary": "<3-4 sentence executive summary of GEO readiness>",
  "top_findings": [
    "<critical finding 1>",
    "<critical finding 2>",
    "<critical finding 3>"
  ],
  "score_label": "<Excellent|Good|Fair|Poor|Critical>"
}"""


def _repair_truncated_json(text):
    """Attempt to repair JSON that was truncated mid-generation."""
    # Try as-is first
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        pass

    # Walk through tracking actual nesting (respecting strings)
    stack = []  # tracks [ or {
    in_string = False
    escaped = False
    last_good = 0  # position after last complete value

    for i, ch in enumerate(text):
        if escaped:
            escaped = False
            continue
        if ch == '\\' and in_string:
            escaped = True
            continue
        if ch == '"':
            in_string = not in_string
            continue
        if in_string:
            continue
        if ch in '{[':
            stack.append(ch)
        elif ch == '}' and stack and stack[-1] == '{':
            stack.pop()
            if not stack:
                last_good = i + 1
        elif ch == ']' and stack and stack[-1] == '[':
            stack.pop()
            if not stack:
                last_good = i + 1
        elif ch == ',' and len(stack) <= 1:
            last_good = i

    # Strategy 1: truncate to last clean string end, then close everything
    # Find last complete key-value or array element
    trunc = text
    if in_string:
        # Cut back to the opening quote of the truncated string
        last_quote = text.rfind('"', 0, len(text) - 1)
        if last_quote > 0:
            # Go back further to before the key or value
            before = text[:last_quote].rstrip()
            if before.endswith(':'):
                # Truncated value — remove the key too
                key_start = before.rfind('"', 0, len(before) - 1)
                if key_start > 0:
                    trunc = text[:key_start].rstrip().rstrip(',')
                else:
                    trunc = before[:-1].rstrip().rstrip(',')
            elif before.endswith(','):
                trunc = before[:-1]
            else:
                trunc = before

    # Close remaining open brackets/braces
    stack2 = []
    in_str = False
    esc = False
    for ch in trunc:
        if esc:
            esc = False
            continue
        if ch == '\\' and in_str:
            esc = True
            continue
        if ch == '"':
            in_str = not in_str
            continue
        if in_str:
            continue
        if ch in '{[':
            stack2.append(ch)
        elif ch == '}' and stack2 and stack2[-1] == '{':
            stack2.pop()
        elif ch == ']' and stack2 and stack2[-1] == '[':
            stack2.pop()

    closers = ''.join(']' if c == '[' else '}' for c in reversed(stack2))
    trunc += closers

    try:
        return json.loads(trunc)
    except json.JSONDecodeError:
        pass

    # Strategy 2: cut to last_good position
    if last_good > 10:
        try:
            return json.loads(text[:last_good])
        except json.JSONDecodeError:
            pass

    # Strategy 3: brute force — find last } that parses
    for i in range(len(text) - 1, max(0, len(text) - 2000), -1):
        if text[i] == '}':
            try:
                return json.loads(text[:i + 1])
            except json.JSONDecodeError:
                continue

    raise json.JSONDecodeError("Could not repair truncated JSON", text, 0)


def _call_claude(system_prompt, user_data, model=None, max_retries=3):
    """Make a synchronous Claude API call with retry on rate limits."""
    for attempt in range(max_retries):
        try:
            response = client.messages.create(
                model=model or MODEL_FULL,
                max_tokens=16384,
                system=system_prompt,
                messages=[{"role": "user", "content": user_data}],
            )
            if response.stop_reason == "max_tokens":
                print(f"WARNING: Claude response truncated (max_tokens hit), model={model or MODEL_FULL}")
            text = response.content[0].text.strip()
            # Strip markdown code fences if present
            if text.startswith("```"):
                text = text.split("\n", 1)[1].rsplit("```", 1)[0].strip()
            return _repair_truncated_json(text)
        except RateLimitError as e:
            wait = 30 * (attempt + 1)
            print(f"Rate limited (attempt {attempt + 1}/{max_retries}), waiting {wait}s... {e}")
            if attempt < max_retries - 1:
                time.sleep(wait)
            else:
                raise


def analyze_quick(page_data, robots_data, llmstxt_data, citability_data):
    """Run quick GEO analysis via single Claude call using full audit rubric."""
    user_content = f"""Website data for quick GEO analysis:

## Page Data
URL: {page_data.get('url', 'N/A')}
Title: {page_data.get('title', 'N/A')}
Description: {page_data.get('description', 'N/A')}
Word Count: {page_data.get('word_count', 0)}
H1 Tags: {json.dumps(page_data.get('h1_tags', []))}
Heading Structure: {json.dumps(page_data.get('heading_structure', [])[:20])}
Has SSR Content: {page_data.get('has_ssr_content', 'unknown')}
Security Headers: {json.dumps(page_data.get('security_headers', {}))}
Structured Data: {json.dumps(page_data.get('structured_data', [])[:3], default=str)}
Internal Links Count: {len(page_data.get('internal_links', []))}
External Links Count: {len(page_data.get('external_links', []))}
Meta Tags: {json.dumps(page_data.get('meta_tags', {}), default=str)}

## Text Content (first 3000 chars)
{page_data.get('text_content', '')[:3000]}

## Robots.txt AI Crawler Status
{json.dumps(robots_data.get('ai_crawler_status', {}), default=str)}
Sitemaps: {json.dumps(robots_data.get('sitemaps', []))}

## llms.txt
Exists: {llmstxt_data.get('exists', False)}

## Citability Analysis (from citability_scorer.py)
Average Score: {citability_data.get('average_score', 'N/A')}
Total Blocks Scored: {citability_data.get('total_blocks', 0)}
Grade Distribution: {json.dumps(citability_data.get('grade_distribution', {}), default=str)}"""

    return _call_claude(QUICK_SCAN_PROMPT, user_content, model=MODEL_QUICK)


def analyze_citability(data):
    """Full citability analysis using geo-citability SKILL.md rubric."""
    prompt = _load_prompt("citability") + JSON_OUTPUT_SUFFIX + """
Return JSON:
{
  "score": <int 0-100>,
  "analysis": "<detailed paragraph on citability strengths and weaknesses>",
  "rewrite_suggestions": [
    {"heading": "<section>", "original_preview": "<first 50 words>", "suggested_rewrite": "<improved version>", "improvement_reason": "<why better>"}
  ],
  "findings": [
    {"severity": "critical|high|medium|low", "title": "<finding>", "description": "<details>"}
  ]
}"""
    return _call_claude(prompt, data)


def analyze_content_eeat(data):
    """Full E-E-A-T analysis using geo-content SKILL.md rubric."""
    prompt = _load_prompt("content_eeat") + JSON_OUTPUT_SUFFIX + """
Return JSON:
{
  "score": <int 0-100>,
  "breakdown": {"experience": <int 0-25>, "expertise": <int 0-25>, "authoritativeness": <int 0-25>, "trustworthiness": <int 0-25>},
  "analysis": "<detailed paragraph>",
  "findings": [
    {"severity": "critical|high|medium|low", "title": "<finding>", "description": "<details>"}
  ]
}"""
    return _call_claude(prompt, data)


def analyze_technical(data):
    """Full technical SEO analysis using geo-technical SKILL.md rubric."""
    prompt = _load_prompt("technical") + JSON_OUTPUT_SUFFIX + """
Return JSON:
{
  "score": <int 0-100>,
  "analysis": "<detailed paragraph>",
  "crawler_access": {"<crawler_name>": "ALLOWED|BLOCKED|NOT_MENTIONED"},
  "findings": [
    {"severity": "critical|high|medium|low", "title": "<finding>", "description": "<details>", "fix": "<how to fix>"}
  ]
}"""
    return _call_claude(prompt, data)


def analyze_schema(data):
    """Full schema analysis using geo-schema SKILL.md rubric + JSON-LD templates."""
    templates = _load_schema_templates()
    prompt = _load_prompt("schema") + """

## Reference JSON-LD Templates
Use these as basis for generated schema recommendations:

""" + "\n\n".join([f"### {name}\n```json\n{tpl}\n```" for name, tpl in templates.items()])
    prompt += JSON_OUTPUT_SUFFIX + """
Return JSON:
{
  "score": <int 0-100>,
  "detected_schemas": ["<schema type>"],
  "missing_critical": ["<missing schema>"],
  "analysis": "<detailed paragraph>",
  "generated_schema": "<ready-to-paste JSON-LD code for ALL missing critical schemas>",
  "findings": [
    {"severity": "critical|high|medium|low", "title": "<finding>", "description": "<details>"}
  ]
}"""
    return _call_claude(prompt, data)


def analyze_platform(data):
    """Full platform optimization using geo-platform-optimizer SKILL.md rubric."""
    prompt = _load_prompt("platform") + JSON_OUTPUT_SUFFIX + """
Return JSON:
{
  "score": <int 0-100>,
  "platforms": {
    "google_aio": {"score": <int 0-20>, "status": "ready|partial|not_ready", "tips": ["<tip>"]},
    "chatgpt": {"score": <int 0-20>, "status": "ready|partial|not_ready", "tips": ["<tip>"]},
    "perplexity": {"score": <int 0-20>, "status": "ready|partial|not_ready", "tips": ["<tip>"]},
    "gemini": {"score": <int 0-20>, "status": "ready|partial|not_ready", "tips": ["<tip>"]},
    "bing_copilot": {"score": <int 0-20>, "status": "ready|partial|not_ready", "tips": ["<tip>"]}
  },
  "analysis": "<detailed paragraph>",
  "findings": [
    {"severity": "critical|high|medium|low", "title": "<finding>", "description": "<details>"}
  ]
}"""
    return _call_claude(prompt, data)


def analyze_brand(data):
    """Full brand mentions analysis using geo-brand-mentions SKILL.md rubric."""
    prompt = _load_prompt("brand") + JSON_OUTPUT_SUFFIX + """
Return JSON:
{
  "score": <int 0-100>,
  "platform_scores": {
    "youtube": <int 0-100>,
    "reddit": <int 0-100>,
    "wikipedia": <int 0-100>,
    "linkedin": <int 0-100>,
    "other": <int 0-100>
  },
  "analysis": "<detailed paragraph>",
  "findings": [
    {"severity": "critical|high|medium|low", "title": "<finding>", "description": "<details>"}
  ]
}"""
    return _call_claude(prompt, data)


def analyze_full_category(category, data):
    """Run a single category analysis for full audit."""
    dispatch = {
        "citability": analyze_citability,
        "content_eeat": analyze_content_eeat,
        "technical": analyze_technical,
        "schema": analyze_schema,
        "platform": analyze_platform,
        "brand": analyze_brand,
    }
    return dispatch[category](data)


def synthesize_report(all_results):
    """Synthesize all category results into a final report using geo-report SKILL.md."""
    prompt = _load_prompt("report") + JSON_OUTPUT_SUFFIX + """
Return JSON:
{
  "executive_summary": "<4-6 sentence business-friendly summary>",
  "quick_wins": [
    {"action": "<what to do>", "impact": "high|medium|low", "effort": "<time estimate>"}
  ],
  "medium_term": [
    {"action": "<what to do>", "impact": "high|medium|low", "effort": "<time estimate>"}
  ],
  "strategic": [
    {"action": "<what to do>", "impact": "high|medium|low", "effort": "<time estimate>"}
  ],
  "all_findings": [
    {"severity": "critical|high|medium|low", "category": "<category>", "title": "<finding>", "description": "<1 sentence>", "fix": "<1 sentence>"}
  ]
}

STRICT LIMITS:
- executive_summary: max 4 sentences
- quick_wins: max 5 items
- medium_term: max 5 items
- strategic: max 3 items
- all_findings: max 10 items, each description max 1 sentence
- Total response must be under 3000 tokens"""
    # Trim the input to avoid blowing up context
    trimmed = json.dumps(all_results, indent=1, default=str)
    if len(trimmed) > 20000:
        trimmed = trimmed[:20000] + "\n... (truncated)"
    user_content = f"""Audit results to synthesize into client report:

{trimmed}"""

    return _call_claude(prompt, user_content)
