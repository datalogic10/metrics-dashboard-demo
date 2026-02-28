// Cloudflare Worker: LLM proxy for metrics dashboard Quick Query
// Routes natural language questions to OpenRouter API and returns structured JSON

const ALLOWED_ORIGINS = [
  "https://datalogic10.github.io",
  "http://localhost:3000",
  "http://localhost:3333",
  "http://localhost:5000",
  "http://localhost:8080",
  "http://127.0.0.1:3000",
  "http://127.0.0.1:3333",
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

const SYSTEM_PROMPT = `You are a dashboard query assistant. The user will ask a natural language question about business metrics. You must respond with ONLY a JSON object (no markdown, no explanation outside JSON) that configures the dashboard.

The dashboard has these controls:
- metric: one of "Revenue", "Volume", "Margin Rate"
- view: "Overall" (default, no breakdown) or a dimension name to split by. "Overall" shows an aggregate trend line. A dimension name (e.g. "Region") splits the chart into one line per category in that dimension.
- dataFrequency: "Weekly", "Monthly", "Quarterly", "Yearly"
- dateRange: "3M", "6M", "1Y", "3Y", "All"
- selectedCategories: array of specific category values to highlight in the chart (only used when view is a dimension)
- filters: object mapping filter keys to arrays of values — this narrows the data WITHOUT changing the chart breakdown

The user will provide a schema with the available filter keys and their current valid values, plus the available view/dimension names.

CRITICAL RULES — follow these strictly:
- ONLY include fields the user EXPLICITLY mentions or clearly implies. If the user does not mention a time period, do NOT set dateRange. If the user does not mention a frequency, do NOT set dataFrequency. When in doubt, OMIT the field.
- "filters" vs "view" distinction: When a user mentions a specific value like "EMEA" or "Enterprise Suite", that usually means FILTER to that value (use "filters"), NOT split/break down by that dimension. Only set "view" to a dimension when the user explicitly asks to "break down by", "compare across", "split by", or "by region/product/etc." as a comparison.
  - Example: "How is EMEA doing?" → filters: {revenueRegionFilter: ["EMEA"]}, view is NOT set (stays Overall)
  - Example: "Compare revenue across regions" → view: "Region", no filters
  - Example: "How is EMEA doing compared to other regions?" → view: "Region", selectedCategories: ["EMEA"]
- "share" queries: The pattern is "[X]'s share of [metric] in [Y]". X is the SUBJECT whose share you want to see. Y is an additional FILTER constraint.
  - The SUBJECT (X) determines the view and selectedCategories: set "view" to the dimension X belongs to, put X in "selectedCategories".
  - The CONSTRAINT (Y, after "in"/"within"/"for") goes in "filters" — find which dimension Y belongs to and filter by it.
  - Think step by step: (1) identify the subject X, (2) find which dimension X belongs to in the schema, (3) set view to that dimension, (4) put X in selectedCategories, (5) if there's a constraint Y, find its dimension and put it in filters.
  - Example: "What's Mexico's share of Revenue?" → Mexico is in Country dimension → view: "Country", selectedCategories: ["Mexico"], metric: "Revenue"
  - Example: "What's Mexico's share of Revenue in Growth Products?" → Mexico is in Country, Growth Products is in Product Group → view: "Country", selectedCategories: ["Mexico"], filters: {productGroupFilter: ["Growth Products"]}
  - Example: "What's Partnership's share of Volume in Brazil?" → Partnership is in Acquisition Channel, Brazil is in Country → view: "Acquisition Channel", selectedCategories: ["Partnership"], filters: {revenueCountryFilter: ["Brazil"]}
- For "filters", only use the exact filter keys and values from the provided schema.
- For "selectedCategories", only use values that exist in the relevant dimension.
- Always include an "explanation" field (string) briefly describing what you understood.
- Never invent or assume values not in the schema.

Examples:
Q: "What's EMEA growth in Net Revenue?"
A: {"metric": "Revenue", "filters": {"revenueRegionFilter": ["EMEA"]}, "explanation": "Showing revenue filtered to EMEA"}

Q: "Break down volume by product monthly"
A: {"metric": "Volume", "view": "Product", "dataFrequency": "Monthly", "explanation": "Showing monthly volume split by product"}

Q: "How is Enterprise Suite doing?"
A: {"filters": {"productNameFilter": ["Enterprise Suite"]}, "explanation": "Filtered to Enterprise Suite"}

Q: "What's Mexico's share of Revenue in Growth Products?"
A: {"metric": "Revenue", "view": "Country", "selectedCategories": ["Mexico"], "filters": {"productGroupFilter": ["Growth Products"]}, "explanation": "Showing revenue by country with Mexico highlighted, filtered to Growth Products"}

Q: "What is Partnership's share of Volume in Brazil?"
A: {"metric": "Volume", "view": "Acquisition Channel", "selectedCategories": ["Partnership"], "filters": {"revenueCountryFilter": ["Brazil"]}, "explanation": "Showing volume by acquisition channel with Partnership highlighted, filtered to Brazil"}

Respond with ONLY the JSON object. No markdown fences, no extra text.`;

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";
    const headers = corsHeaders(origin);

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

    const { message, schema } = body;
    if (!message || typeof message !== "string") {
      return new Response(JSON.stringify({ error: "Missing 'message' field" }), {
        status: 400,
        headers: { ...headers, "Content-Type": "application/json" },
      });
    }

    // Build user message with schema context
    const userMessage = schema
      ? `Dashboard schema:\n${JSON.stringify(schema, null, 2)}\n\nUser question: ${message}`
      : `User question: ${message}`;

    try {
      const llmResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://datalogic10.github.io",
          "X-Title": "Metrics Dashboard",
        },
        body: JSON.stringify({
          model: "nvidia/nemotron-nano-9b-v2:free",
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: userMessage },
          ],
          max_tokens: 1024,
          temperature: 0,
        }),
      });

      if (!llmResponse.ok) {
        const errText = await llmResponse.text();
        console.error("OpenRouter error:", llmResponse.status, errText);
        return new Response(JSON.stringify({ error: "LLM service error" }), {
          status: 502,
          headers: { ...headers, "Content-Type": "application/json" },
        });
      }

      const llmData = await llmResponse.json();
      const msg = llmData.choices?.[0]?.message;
      // Some models (reasoning models) put output in content, thinking in reasoning.
      // Fall back to reasoning field if content is empty.
      const content = msg?.content?.trim() || msg?.reasoning?.replace(/<think>[\s\S]*?<\/think>/g, "").trim() || "";

      if (!content) {
        console.error("Empty LLM response. Full message:", JSON.stringify(msg));
        return new Response(JSON.stringify({ error: "Empty LLM response" }), {
          status: 502,
          headers: { ...headers, "Content-Type": "application/json" },
        });
      }

      // Extract JSON from response (handle potential markdown fences)
      let jsonStr = content.trim();
      const fenceMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (fenceMatch) {
        jsonStr = fenceMatch[1].trim();
      }

      let parsed;
      try {
        parsed = JSON.parse(jsonStr);
      } catch {
        console.error("Failed to parse LLM JSON:", jsonStr);
        return new Response(JSON.stringify({ error: "LLM returned invalid JSON", raw: jsonStr }), {
          status: 502,
          headers: { ...headers, "Content-Type": "application/json" },
        });
      }

      return new Response(JSON.stringify(parsed), {
        status: 200,
        headers: { ...headers, "Content-Type": "application/json" },
      });
    } catch (err) {
      console.error("Worker error:", err);
      return new Response(JSON.stringify({ error: "Internal worker error" }), {
        status: 500,
        headers: { ...headers, "Content-Type": "application/json" },
      });
    }
  },
};
