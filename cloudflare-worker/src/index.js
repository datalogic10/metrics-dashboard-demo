// Cloudflare Worker: LLM proxy for metrics dashboard Quick Query
// Routes natural language questions to OpenRouter API and returns structured JSON

const ALLOWED_ORIGINS = [
  "https://datalogic10.github.io",
  "http://localhost:3000",
  "http://localhost:3333",
  "http://localhost:3456",
  "http://localhost:5000",
  "http://localhost:8080",
  "http://127.0.0.1:3000",
  "http://127.0.0.1:3333",
  "http://127.0.0.1:3456",
  "http://127.0.0.1:5000",
  "http://127.0.0.1:8080",
];

// Rate limiting: 20 req/min per IP (in-memory, resets on worker restart — fine for demo)
const rateLimitMap = new Map();
const RATE_LIMIT = 20;
const RATE_WINDOW_MS = 60_000;

function checkRateLimit(ip) {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now - entry.windowStart > RATE_WINDOW_MS) {
    rateLimitMap.set(ip, { windowStart: now, count: 1 });
    return true;
  }
  if (entry.count >= RATE_LIMIT) return false;
  entry.count++;
  return true;
}

function corsHeaders(origin) {
  const allowed = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    "Access-Control-Allow-Origin": allowed,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
  };
}

// Build a dynamic system prompt from the schema the frontend sends
function buildSystemPrompt(schema) {
  // Build metric description from schema
  let metricDesc;
  let metricExamples = {};
  if (schema && schema.metrics && typeof schema.metrics === 'object' && !Array.isArray(schema.metrics)) {
    // metrics is a map: { internalKey: displayLabel }
    const entries = Object.entries(schema.metrics);
    metricDesc = entries.map(([key, label]) => `"${key}" (displayed as "${label}")`).join(', ');
    metricExamples = schema.metrics;
  } else if (schema && Array.isArray(schema.metrics)) {
    metricDesc = schema.metrics.map(m => `"${m}"`).join(', ');
  } else {
    metricDesc = '"Revenue", "Volume", "Margin Rate"';
  }

  const viewsList = schema && schema.views ? schema.views.join(', ') : 'Overall';
  const freqList = schema && schema.dataFrequencies ? schema.dataFrequencies.join(', ') : 'Weekly, Monthly, Quarterly, Yearly';
  const rangeList = schema && schema.dateRanges ? schema.dateRanges.join(', ') : '3M, 6M, 1Y, 3Y, All';

  // Build filter description
  let filterDesc = '';
  if (schema && schema.filters) {
    const filterLines = Object.entries(schema.filters).map(([key, { label, values }]) => {
      const sampleVals = values.slice(0, 8).map(v => `"${v}"`).join(', ');
      const more = values.length > 8 ? ` ... (${values.length} total)` : '';
      return `  - ${key} (${label}): [${sampleVals}${more}]`;
    });
    filterDesc = filterLines.join('\n');
  }

  // Pick a sample metric label and view for examples
  const metricEntries = schema && schema.metrics && typeof schema.metrics === 'object' && !Array.isArray(schema.metrics)
    ? Object.entries(schema.metrics) : [];
  const sampleMetricKey = metricEntries.length > 0 ? metricEntries[0][0] : 'Volume';
  const sampleMetricLabel = metricEntries.length > 0 ? metricEntries[0][1] : 'Volume';
  const sampleView = schema && schema.views && schema.views.length > 1 ? schema.views[1] : 'Category';

  // Pick sample filter key/value for examples
  let sampleFilterKey = '';
  let sampleFilterValue = '';
  if (schema && schema.filters) {
    const firstFilter = Object.entries(schema.filters)[0];
    if (firstFilter) {
      sampleFilterKey = firstFilter[0];
      sampleFilterValue = firstFilter[1].values[0] || 'SomeValue';
    }
  }

  return `You are a dashboard query assistant. The user will ask a natural language question about metrics. You must respond with ONLY a JSON object (no markdown, no explanation outside JSON) that configures the dashboard.

The dashboard has these controls:
- metric: use the INTERNAL KEY (not the display label). Available metrics: ${metricDesc}
- view: one of: ${viewsList}. "Overall" (default) shows an aggregate trend line. Other values split the chart by that dimension.
- dataFrequency: one of: ${freqList}
- dateRange: one of: ${rangeList}
- selectedCategories: array of specific category values to highlight (only when view is a dimension)
- filters: object mapping filter keys to arrays of values — narrows data WITHOUT changing chart breakdown

${filterDesc ? `Available filters:\n${filterDesc}` : ''}

CRITICAL RULES — follow these strictly:
- The "metric" field must be an INTERNAL KEY (e.g. "${sampleMetricKey}"), even if the user refers to it by its display label (e.g. "${sampleMetricLabel}"). Map the user's words to the closest matching internal key.
- ONLY include fields the user EXPLICITLY mentions or clearly implies. If the user does not mention a time period, do NOT set dateRange. If the user does not mention a frequency, do NOT set dataFrequency. When in doubt, OMIT the field.
- "filters" vs "view" distinction: When a user mentions a specific value like "${sampleFilterValue}", that usually means FILTER to that value (use "filters"), NOT split by that dimension. Only set "view" to a dimension when the user explicitly asks to "break down by", "compare across", "split by", or "by [dimension]" as a comparison.
- "share" queries: "[X]'s share of [metric] in [Y]". X determines view + selectedCategories. Y goes in filters.
- For "filters", only use exact filter keys and values from the schema above.
- For "selectedCategories", only use values that exist in the relevant dimension.
- Always include an "explanation" field (string) briefly describing what you understood.
- Never invent or assume values not in the schema.

Examples:
Q: "How is ${sampleMetricLabel} trending by ${sampleView}?"
A: {"metric": "${sampleMetricKey}", "view": "${sampleView}", "explanation": "Showing ${sampleMetricLabel} trend split by ${sampleView}"}

${sampleFilterKey ? `Q: "How is ${sampleFilterValue} doing?"
A: {"filters": {"${sampleFilterKey}": ["${sampleFilterValue}"]}, "explanation": "Filtered to ${sampleFilterValue}"}` : ''}

Q: "Break down ${sampleMetricLabel} by ${sampleView} monthly"
A: {"metric": "${sampleMetricKey}", "view": "${sampleView}", "dataFrequency": "Monthly", "explanation": "Showing monthly ${sampleMetricLabel} split by ${sampleView}"}

Respond with ONLY the JSON object. No markdown fences, no extra text.`;
}

// Fallback static prompt when no schema is provided
const STATIC_SYSTEM_PROMPT = `You are a dashboard query assistant. The user will ask a natural language question about metrics. You must respond with ONLY a JSON object (no markdown, no explanation outside JSON) that configures the dashboard.

The dashboard has these controls:
- metric: one of "Revenue", "Volume", "Margin Rate"
- view: "Overall" (default, no breakdown) or a dimension name to split by
- dataFrequency: "Weekly", "Monthly", "Quarterly", "Yearly"
- dateRange: "3M", "6M", "1Y", "3Y", "All"
- selectedCategories: array of specific category values to highlight in the chart
- filters: object mapping filter keys to arrays of values

CRITICAL RULES:
- ONLY include fields the user EXPLICITLY mentions or clearly implies. When in doubt, OMIT.
- "filters" vs "view": Specific values go in filters. Only set view when user asks to "break down by" / "compare across" / "split by".
- Always include an "explanation" field.
- Never invent values not in the schema.

Respond with ONLY the JSON object. No markdown fences, no extra text.`;

const METRIC_SUGGEST_PROMPT = `You are a data analytics assistant. Given a database table schema (column names and types), suggest how to configure a 3-metric dashboard.

The dashboard has exactly 3 metric slots. Each is independently configurable with its own aggregation type and column:
1. **Metric 1**: The primary counting/volume metric — e.g., COUNT(*) of rows, SUM of units, COUNT(DISTINCT user_id).
2. **Metric 2**: A secondary metric — e.g., SUM(score), AVG(price), COUNT(DISTINCT job_id).
3. **Metric 3**: An optional third metric — e.g., AVG(score), MAX(value). Set derivedAggType to null to disable.

You must respond with ONLY a JSON object (no markdown, no explanation) with these exact fields:
{
  "volumeAggType": "count|count_distinct|sum|avg|min|max",  // aggregation type for metric 1
  "volumeColumn": null or "column_name",   // null only if volumeAggType is "count", otherwise required
  "revenueAggType": "count|count_distinct|sum|avg|min|max", // aggregation type for metric 2
  "revenueColumn": null or "column_name",  // null only if revenueAggType is "count", otherwise required
  "derivedAggType": null or "count|count_distinct|sum|avg|min|max", // aggregation type for metric 3, null to disable
  "derivedColumn": null or "column_name",  // null if derivedAggType is null or "count", otherwise required
  "volumeLabel": "string",                 // Human-readable label for metric 1
  "revenueLabel": "string",                // Human-readable label for metric 2
  "derivedLabel": "string",                // Human-readable label for metric 3 (omit if derivedAggType is null)
  "volumeFormat": "0,0",                   // numeral.js format string
  "revenueFormat": "0,0",                  // numeral.js format string
  "derivedFormat": "0.0",                  // numeral.js format string for metric 3
  "volumePrefix": "",                      // prefix before formatted value (e.g. "$", "€")
  "volumeSuffix": "",                      // suffix after formatted value (e.g. " units", " bps")
  "revenuePrefix": "",                     // prefix for metric 2
  "revenueSuffix": "",                     // suffix for metric 2
  "derivedPrefix": "",                     // prefix for metric 3
  "derivedSuffix": "",                     // suffix for metric 3
  "dateColumn": "column_name"              // The date/timestamp column for time series
}

Rules:
- Column values must be actual column names from the schema (any column for count_distinct, numeric for sum/avg/min/max), or null only when aggType is "count"
- dateColumn must be a date/timestamp column from the schema
- Choose metrics that make business sense for the data
- Keep labels concise (2-3 words max)
- For format strings: use "0,0" for integers, "0,0.00" for currency, "0.0" for decimals, "0.0%" for percentages

Respond with ONLY the JSON object.`;


// Try calling a single model, returns { parsed, model } on success or throws
async function tryModel(model, apiKey, systemPrompt, userMsg) {
  const llmResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://datalogic10.github.io",
      "X-Title": "Metrics Dashboard",
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMsg },
      ],
      max_tokens: 1024,
      temperature: 0,
    }),
  });

  if (!llmResponse.ok) {
    const errText = await llmResponse.text();
    throw new Error(`${model}: HTTP ${llmResponse.status} — ${errText}`);
  }

  const llmData = await llmResponse.json();
  const msg = llmData.choices?.[0]?.message;
  const content = msg?.content?.trim() || msg?.reasoning?.replace(/<think>[\s\S]*?<\/think>/g, "").trim() || "";

  if (!content) {
    throw new Error(`${model}: Empty response`);
  }

  let jsonStr = content.trim();
  const fenceMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenceMatch) {
    jsonStr = fenceMatch[1].trim();
  }

  const parsed = JSON.parse(jsonStr);
  return { parsed, model };
}

// Models in priority order — try each until one succeeds
const MODELS = [
  "nvidia/nemotron-3-nano-30b-a3b:free",
  "qwen/qwen3-vl-30b-a3b-thinking",
  "arcee-ai/trinity-large-preview:free",
  "nvidia/nemotron-nano-9b-v2:free",
];

async function callWithFallback(env, systemPrompt, userMessage, headers) {
  const errors = [];
  for (const model of MODELS) {
    try {
      const { parsed, model: usedModel } = await tryModel(model, env.OPENROUTER_API_KEY, systemPrompt, userMessage);
      parsed._model = usedModel;
      return new Response(JSON.stringify(parsed), {
        status: 200,
        headers: { ...headers, "Content-Type": "application/json" },
      });
    } catch (err) {
      console.error(`Model failed: ${err.message}`);
      errors.push(err.message);
    }
  }
  return new Response(JSON.stringify({ error: "All models failed", details: errors }), {
    status: 502,
    headers: { ...headers, "Content-Type": "application/json" },
  });
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";
    const headers = corsHeaders(origin);
    const url = new URL(request.url);
    const path = url.pathname;

    // Handle CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers });
    }

    if (request.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: { ...headers, "Content-Type": "application/json" },
      });
    }

    // Rate limit check
    const ip = request.headers.get("CF-Connecting-IP") || "unknown";
    if (!checkRateLimit(ip)) {
      return new Response(JSON.stringify({ error: "Rate limit exceeded. Try again in a minute." }), {
        status: 429,
        headers: { ...headers, "Content-Type": "application/json" },
      });
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
        status: 400,
        headers: { ...headers, "Content-Type": "application/json" },
      });
    }

    // ===== Route: /suggest-metrics =====
    if (path === "/suggest-metrics") {
      const { columns } = body;
      if (!columns || !Array.isArray(columns)) {
        return new Response(JSON.stringify({ error: "Missing 'columns' array" }), {
          status: 400,
          headers: { ...headers, "Content-Type": "application/json" },
        });
      }

      const userMessage = `Table columns:\n${JSON.stringify(columns, null, 2)}\n\nSuggest the best metric configuration for this table.`;
      return callWithFallback(env, METRIC_SUGGEST_PROMPT, userMessage, headers);
    }

    // ===== Route: / (default — Quick Query) =====
    const { message, schema } = body;
    if (!message || typeof message !== "string") {
      return new Response(JSON.stringify({ error: "Missing 'message' field" }), {
        status: 400,
        headers: { ...headers, "Content-Type": "application/json" },
      });
    }

    // Build dynamic system prompt from schema, or fall back to static
    const systemPrompt = schema ? buildSystemPrompt(schema) : STATIC_SYSTEM_PROMPT;
    const userMessage = `User question: ${message}`;

    return callWithFallback(env, systemPrompt, userMessage, headers);
  },
};
