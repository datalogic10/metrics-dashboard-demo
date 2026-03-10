## Requirements Doc for metrics-dashboard-demo Session

### Goal

Transform the dashboard from a hardcoded demo into a reusable analytics tool that connects to any Supabase/Postgres database. The dashboard stays fully client-side (GitHub Pages). All data aggregation happens in the user's database via a generic RPC function. The dashboard sends structured query requests and renders the results.

### How it works end-to-end

```
1. User creates a dense dimensional table in their Supabase
   (e.g., one row per week × source × model × user_id with raw measures)

2. User installs the generic query_dataset() RPC in their Supabase
   (we provide the SQL -- one function that works with any table)

3. User opens dashboard with connection params in URL hash:
   #supabaseUrl=https://xxx.supabase.co&apiKey=eyJ...&table=fct_metrics

4. Dashboard fetches schema → LLM suggests metrics → user confirms

5. Dashboard queries RPC for each chart/filter interaction
   → RPC returns only aggregated rows (never raw data)
   → Dashboard renders charts
```

### Connection & Configuration

Dashboard reads config from URL hash params (hash so they're not sent to any server):
- `#supabaseUrl=https://xxx.supabase.co` -- Supabase project URL
- `#apiKey=eyJ...` -- Supabase anon key
- `#table=fct_metrics` -- Table or view to query

When no `supabaseUrl` is present, use existing synthetic data (demo mode).

### Generic RPC: query_dataset()

The user installs ONE function in their Supabase that handles all dashboard queries. We provide the SQL. The function accepts structured query requests and returns aggregated results. It never allows raw SQL -- only whitelisted operations.

**We need to create this function and include the SQL in the dashboard repo (e.g., `setup.sql`).**

```sql
-- The dashboard calls this RPC for every interaction
CREATE OR REPLACE FUNCTION public.query_dataset(
  p_table text,                    -- table/view name to query
  p_action text DEFAULT 'data',    -- 'schema' | 'distinct' | 'data'

  -- For 'distinct' action: which column to get unique values for
  p_column text DEFAULT NULL,

  -- For 'data' action: structured query params
  p_filters jsonb DEFAULT '{}',    -- {"source_type": ["adzuna","lever"], "is_remote": [true]}
  p_group_by text[] DEFAULT '{}',  -- ['scoring_model', 'reporting_week']
  p_metrics jsonb DEFAULT '[]',    -- [{"sql": "COUNT(DISTINCT user_id)", "alias": "num_users"}]
  p_order_by text DEFAULT NULL,    -- 'num_users DESC'
  p_limit integer DEFAULT 10000
)
RETURNS jsonb
```

**Three actions:**

1. `schema` -- Returns column names and types. Called once on startup.
```json
// query_dataset('fct_metrics', 'schema')
{
  "columns": [
    {"name": "reporting_week", "type": "date"},
    {"name": "source_type", "type": "text"},
    {"name": "score", "type": "integer"},
    {"name": "user_id", "type": "uuid"}
  ]
}
```

2. `distinct` -- Returns unique values for one column (max 50). Called lazily when user opens a filter dropdown.
```json
// query_dataset('fct_metrics', 'distinct', 'source_type')
{
  "column": "source_type",
  "values": ["adzuna", "remotive", "greenhouse", "lever", "jooble", "usajobs", "arbeitnow"]
}
```

3. `data` -- Runs a structured aggregation query. Called on every chart render / filter change.
```json
// query_dataset('fct_metrics', 'data', NULL,
//   '{"source_type": ["adzuna"]}',
//   '{"scoring_model", "reporting_week"}',
//   '[{"sql": "COUNT(DISTINCT user_id)", "alias": "num_users"}, {"sql": "SUM(score)", "alias": "total_score"}]'
// )
{
  "rows": [
    {"scoring_model": "groq/llama-3.3", "reporting_week": "2026-03-03", "num_users": 2, "total_score": 450},
    ...
  ],
  "row_count": 15
}
```

**Security**: The function validates that p_table exists, p_column exists in the table, p_group_by columns exist, and p_metrics only contain whitelisted aggregation functions (SUM, COUNT, COUNT DISTINCT, AVG, MIN, MAX). No raw SQL passthrough.

### Startup Flow

```
1. Dashboard reads URL hash params
   → No params? Load synthetic data (demo mode), stop here

2. Call query_dataset(table, 'schema')
   → Get column names and types
   → Auto-classify: date/timestamp columns = time dimensions,
     text/boolean with few values = dimensions,
     numeric = potential metric columns

3. LLM metric suggestion (using existing Cloudflare Worker)
   → Send column schema to LLM
   → Prompt: "Given these columns, suggest useful metrics"
   → LLM returns metric definitions like:
     [
       {"name": "Number of Users", "sql": "COUNT(DISTINCT user_id)"},
       {"name": "Avg Score", "sql": "SUM(score) / NULLIF(COUNT(DISTINCT CASE WHEN score IS NOT NULL THEN job_id END), 0)"},
       {"name": "Number of Jobs", "sql": "COUNT(DISTINCT job_id)"}
     ]
   → Show to user in an editable list/modal
   → User confirms, edits, or adds their own
   → Store metric definitions in localStorage alongside the connection

4. Dashboard is ready
   → Render filter sidebar (dimension columns with lazy-loaded distinct values)
   → Render metric selector (from confirmed metric definitions)
   → Render time aggregation buttons (from detected time columns)
   → Fetch initial data via query_dataset('data', ...) with default grouping
```

### Dashboard Interactions (all via RPC)

Every user interaction triggers a `query_dataset(table, 'data', ...)` call:

**Filter change**: User selects source_type=adzuna
→ Dashboard adds to p_filters, re-queries with same group_by and metrics
→ Re-renders chart

**Dimension change**: User switches "split by" from source_type to scoring_model
→ Dashboard changes p_group_by, re-queries
→ Re-renders chart

**Metric change**: User switches from "Number of Users" to "Avg Score"
→ Dashboard changes p_metrics, re-queries
→ Re-renders chart

**Time grain change**: User switches from weekly to monthly
→ Dashboard changes which time column is in p_group_by (reporting_week → reporting_month)
→ Re-queries, re-renders

**Filter dropdown open**: User clicks the source_type filter
→ Dashboard calls query_dataset(table, 'distinct', 'source_type')
→ Populates dropdown with up to 50 unique values
→ Cache the result (same column won't be fetched again)

### Caching

Cache query results client-side to avoid redundant RPC calls:
- Cache key: hash of (table + action + all params)
- Storage: sessionStorage or in-memory Map (cleared on page refresh)
- Max size: cap at ~20MB or ~100 cached queries, LRU eviction
- Cache the `distinct` results aggressively (dimension values rarely change within a session)
- Cache `data` results for the exact same filter+group+metric combo

### Metric Definitions

Stored in localStorage per connection (supabaseUrl + table):

```json
{
  "connection_key": "https://xxx.supabase.co/fct_metrics",
  "metrics": [
    {"name": "Number of Users", "sql": "COUNT(DISTINCT user_id)", "format": "number"},
    {"name": "Avg Score", "sql": "SUM(score) / NULLIF(COUNT(DISTINCT CASE WHEN score IS NOT NULL THEN job_id END), 0)", "format": "decimal"},
    {"name": "Total Jobs", "sql": "COUNT(DISTINCT job_id)", "format": "number"},
    {"name": "Total Score", "sql": "SUM(score)", "format": "number"}
  ]
}
```

Users can edit metrics at any time via a settings panel. The LLM suggestion is only the starting point.

### Insights Module

The insights module currently runs client-side over the full dataset. Rework it to use RPC queries:

**Solo Insights** (for current view):
- For each dimension column, query the data grouped by that dimension with the current filters
- Compare current period vs previous period
- Identify: top category, biggest growth, biggest decline
- Example: "adzuna is the top source with 150 jobs (45% share). greenhouse grew 110% week-over-week."

**Cross Insights** (correlations):
- For each pair of (dimension × dimension), query with both in group_by
- Identify interesting patterns
- Example: "groq/llama-3.3 scores highest on greenhouse jobs (avg 62 vs 45 overall)"

Each insight is a separate RPC call. Run them in parallel (Promise.all) and cache results.

### Saved Views

Store in localStorage:

```json
{
  "saved_views": [
    {
      "name": "Scoring by Model (Last 30d)",
      "connection_key": "https://xxx.supabase.co/fct_metrics",
      "filters": {"is_remote": [true]},
      "group_by": ["scoring_model", "reporting_week"],
      "metric": "Avg Score",
      "time_range": "30d",
      "created_at": "2026-03-06T00:00:00Z"
    }
  ]
}
```

- Save button stores current dashboard state as a named view
- Load button restores filters, grouping, metric, and time range
- Export/import as JSON file for sharing
- Views are connection-specific (different views per database/table)

### Backward Compatibility

- **Demo mode** (no URL hash params) must continue working exactly as before
- The synthetic data generator should NOT be removed
- All existing features should work in demo mode: scenarios, insights, NLQ, themes
- In live mode, features that require the full dataset client-side (like client-side filtering) are replaced by RPC calls

### Changes Summary

| Area | Current (demo mode) | Live mode |
|------|-------------------|-----------|
| Data source | `generateSyntheticData()` | `query_dataset()` RPC |
| Columns/dimensions | Hardcoded COLUMNS + DIMENSION_DEFINITIONS | Auto-discovered from schema |
| Metrics | Hardcoded Volume/Revenue/Margin Rate | User-defined via LLM suggestion + editor |
| Filtering | Client-side array filter | RPC with p_filters param |
| Aggregation | Client-side reduce/group | RPC with p_group_by + p_metrics |
| Distinct values | Derived from loaded data | Lazy RPC call, max 50 values |
| Insights | Client-side full dataset scan | Parallel RPC queries |
| Saved views | URL encoding (limited) | localStorage + JSON export/import |
| Caching | N/A (all data in memory) | sessionStorage, LRU, ~20MB cap |

### Files to create/modify

1. **`setup.sql`** (new) -- Generic `query_dataset()` RPC function that users install in their Supabase
2. **`Analyzer_Demo.js`** -- Major refactor of data loading, columns, dimensions, metrics, filtering, insights
3. **`index.html`** -- Add connection setup UI (or modal) for entering Supabase URL/key/table
4. **`cloudflare-worker/src/index.js`** -- Add endpoint for metric suggestion (send schema, get metric definitions)

### Testing

1. No params: dashboard loads with synthetic data (demo mode) -- everything works as before
2. With params: `#supabaseUrl=https://xxx.supabase.co&apiKey=eyJ...&table=fct_metrics` -- connects, fetches schema, suggests metrics, loads data
3. Filter interaction: select a filter value → chart updates with filtered data from RPC
4. Dimension switch: change "split by" → chart re-renders with new grouping
5. Metric switch: change metric → chart re-renders
6. Insights: generates insights via parallel RPC calls
7. Saved views: save, load, export, import all work
8. Invalid connection: shows error, offers demo mode fallback
9. Slow query: loading indicator shown, cached on completion