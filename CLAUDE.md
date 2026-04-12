# Metrics Dashboard — Coding Agent Reference

Single-file React 18 app (`Analyzer_Demo.js`) built with esbuild to `app.js`, served via `npx serve . -p 3456`. Demo mode uses synthetic data; live mode hits Supabase RPC or the dash-api FastAPI proxy. See `memory/` for architecture notes.

## File map update rule

**This map uses grep landmarks, not line numbers, so it doesn't rot on every edit.** When you:
- Rename one of the landmark identifiers below → update the matching entry in this file, same commit
- Add a new `// ═══ <TITLE> ═══` section banner in `Analyzer_Demo.js` → add it to the index below
- Add/rename/delete a file under `src/` or `src/components/` → update the relevant list below

If you're searching for something not in the map, grep first, then add an entry if the thing is load-bearing.

## Analyzer_Demo.js — section index

`Analyzer_Demo.js` is a single `render()` function (see `export function render()`) that owns most state, effects, and JSX. Major sections are marked inline with `// ═══ TITLE ═══` banners — grep the title to jump there.

| Concern | How to find it |
|---|---|
| Module-level helper (pre-component) | grep `function computeServerDateWindow` |
| Component entry | grep `export function render` |
| Live data connection & schema fetch | grep `LIVE DATA CONNECTION & SCHEMA` banner — effect that reads `connectionParams`, loads schema, handles errors |
| Filter state & helpers | grep `FILTER STATE & HELPERS` banner — `FILTER_CONFIG_STATIC`, `getFilterState`, `getFilterSetState`, `FILTER_CONFIG` |
| Tab state & handlers | grep `TAB STATE & HANDLERS` banner — `captureTabSnapshot`, `switchTab`, `addTab`, `removeTab`, `renameTab`, `moveTab` |
| Share code & state restore | grep `SHARE CODE & STATE RESTORE` banner — `restoreStateSnapshot`, undo history effect, save/load view handlers, `decodeShareCode` effect |
| Render helpers | grep `RENDER HELPERS` banner — `renderDropdownFilter`, `renderTooltipIcon`, `renderInsightCategory`, `resetAllFilters`, `renderButtonGroup` |
| Data transformation memos | grep `DATA TRANSFORMATION MEMOS` banner — `filteredDates`, `filteredData`, `dataByPeriod`, `periodAggregates`, `dimensionAggregates`, `periods` |
| Insights generation trigger | grep `INSIGHTS GENERATION TRIGGER` banner — effect that calls `generateStructuredInsights(...)` after a 50ms `setTimeout`, manages `insightsCacheRef` |
| Chart data construction | grep `CHART DATA CONSTRUCTION` banner — `const { chartData, chartLayout } = React.useMemo(...)` for Plotly traces + layout |
| LLM query handling | grep `LLM QUERY HANDLING` banner — `handleLLMQuery` useCallback + `LLM_EXAMPLE_QUESTIONS` memo |
| JSX render output | grep `JSX RENDER OUTPUT` banner — `return (...)` with the top-level component tree |

**Stable landmark identifiers** (rename-safe search anchors):
`FILTER_CONFIG_STATIC`, `captureTabSnapshot`, `restoreStateSnapshot`, `renderDropdownFilter`, `filteredDates`, `generateStructuredInsights(`, `handleLLMQuery`, `computeServerDateWindow`.

## src/ — one-liners

| File | Purpose |
|---|---|
| `chartUtils.js` | Metric-config interpretation, chart type resolution, formula-metric helpers, formatMetricValue, chart layout builder |
| `compareChartBuilder.js` | Pure functions for compare-dock traces, `buildComparisonChart`, `COMPARE_CARD_COLORS` |
| `configDb.js` | Supabase config storage (fetch/update), edit-secret management for creator mode |
| `constants.js` | Static data: `DATE_RANGES`, `GUIDE_STEPS`, `PRO_TIPS` (no runtime deps) |
| `csvDataSource.js` | CSV parsing + client-side aggregation (shape mirrors `liveConnection.js` output) |
| `filterUtils.js` | `buildPFilters` (dynamicFilters → RPC payload), `getActiveViewConfig`, `tabIconHover` |
| `formatUtils.js` | Pure formatting: sentiment analysis, filter-name humanizing (no React) |
| `insightsGenerator.js` | `generateStructuredInsights(tabType, ctx)` — Solo/Cross insight generation. `ctx` is a 36-key object destructured at the top of the function |
| `liveConnection.js` | Supabase + dash-api RPC callers, schema detection, column classification, response transforms |
| `logger.js` | Thin logging wrapper (silent in prod, enabled via `?debug` query param) |
| `metrics.js` | Pure metric calculations, overlays, YoY, SMA, forecasting, `OVERLAY_CONFIG`, `GRAIN_RANK`, `METRIC_OVERLAY_PALETTE` |
| `shareCode.js` | State compression/decompression, `generateShareCode`, `decodeShareCode` |
| `storage.js` | Safe localStorage wrappers |
| `styles.js` | `buildStaticStyles` — theme-aware style objects (includes all keyframes, transitions) |
| `theme.js` | Color palettes: `THEME_CONFIG` (light/dark), `MODERN_COLOR_PALETTE`, `getCategoryColor` |

## src/components/ — one-liners

Components are mostly presentational; state lives in `Analyzer_Demo.js` and gets passed down as props.

| Component | Purpose |
|---|---|
| `ChartPanel.js` | Plotly chart wrapper + surrounding controls: undo, Top X dropdown, trace toggles (Values/%Share/%Growth), insight context banner, overlays menu |
| `CompareView.js` | Compare dock bar + compare overlay (side-by-side chart grid) |
| `ConnectModal.js` | Connection form: Supabase URL/API key or dash-api URL — test + save + redirect |
| `ControlsSection.js` | Quick Query (NL question input), StatBoxes, 3×2 control grid (saved views, split-by, date range, actions, filter search, date agg), Advanced Filters slide-out panel. Returns a Fragment — the two sections are siblings in the tree |
| `DataSummaryPanel.js` | Collapsible debug grid under the chart (row counts, render timing, filter timings) |
| `InsightContextBanner.js` | Drill-down breadcrumb bar shown above the chart when drilling into a category |
| `InsightsPanel.js` | Left sidebar: Solo/Cross tab switcher + insight category list; memoizes `buildInsightsConfig` to keep `colors` object refs stable across hover re-renders |
| `MetricsEditorModal.js` | Configure dataset, date column, metric slots, preset shortcuts, metric suggestions |
| `ProTipBanner.js` | Rotating yellow pro-tip banner (cycles through `PRO_TIPS`) |
| `SaveViewModal.js` | Save view configuration to Google Sheets (name + username/team/custom owner) |
| `ShareModal.js` | Share-link display + edit-key display for creators |
| `StatBox.js` | Single metric card (value, period, % change badge) |
| `StatusBanner.js` | Connection/loading/error/demo-mode banner |
| `TabBar.js` | Tab list, rename, move, close, add tab popover, Configure Metrics button, lock/unlock toggle |

## Hard constraints

- Don't touch `dash-api/`, `supabase/migrations/`, `setup.sql`, `index.html`, `cloudflare-worker/`
- Build script is `npm run build` (esbuild, JSX transform). Don't change it.
- URL hash params, localStorage keys, and the Supabase RPC contract (`query_dataset`) are stable — treat as public API
- Demo mode (no URL hash) and live mode (`#/<configId>`) must both keep working
- No commits/pushes without explicit user instruction
