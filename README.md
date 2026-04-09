# Metrics Analyzer Dashboard

**[View Live Demo](https://datalogic10.github.io/metrics-dashboard-demo/)**

An interactive metrics analytics dashboard for exploring revenue, growth, and segmentation across product lines and markets. Built with React and Plotly.js.

![Dashboard Preview](https://img.shields.io/badge/status-live-brightgreen)

## Features

- **Multi-metric analysis** — Gross Volume, Net Revenue, and Margin Rate with period-over-period change tracking
- **Flexible aggregation** — Weekly, Monthly, Quarterly, and Yearly views with adjustable date ranges
- **Dimensional breakdowns** — Slice data by Product, Region, Channel, Segment, and more
- **Auto-generated insights** — Trend detection, anomaly identification, and cross-dimensional analysis
- **Interactive charts** — Stacked bars, growth overlays, legend filtering, and drill-down via chart clicks
- **Scenario planning** — Save and compare different filter/view configurations
- **Natural language queries** — Quick Query interface for exploring data by asking questions
- **Light/Dark theme** — Toggle between color modes
- **Fully client-side** — Runs entirely in the browser with synthetic demo data; no backend required

## Connecting to a Database

The dashboard supports two connection types via the "Connect Database" modal:

| Type | Backend | Use case |
|------|---------|----------|
| **Supabase** | Supabase PostgREST RPC | Databases with Supabase PostgREST (requires `query_dataset` function from [`setup.sql`](./setup.sql)) |
| **Direct Postgres** | [`dash-api/`](./dash-api/) FastAPI proxy | Any Postgres database via named connections |

**Direct Postgres** requires a running `dash-api` instance. The Python source lives in [`dash-api/`](./dash-api/) in this repo; deployment (docker-compose, env vars, reverse proxy) lives in [ash-infra](https://github.com/datalogic10/ash-infra). Connection fields:
- **API URL** — dash-api base URL (e.g., `https://your-server.com/dash-api`)
- **API Secret** — Bearer token configured in dash-api
- **Connection Name** — Named connection (e.g., `zbt`)
- **Table** — Full `schema.table` name (e.g., `analytics.signals`)

## dash-api backend

The `dash-api/` directory contains the Python FastAPI service that implements the `query_dataset` contract for Direct Postgres connections. It is the Python counterpart to the SQL implementation in `setup.sql` (used by the Supabase path) — both implement the same request/response shape so the client in `Analyzer_Demo.js` can target either backend transparently.

Co-locating the client, the SQL implementation, and the Python implementation in one repo makes drift obvious at PR review time: any change to the contract touches all three files in one diff.

### Deployment

dash-api runs as a docker-compose service on the VM managed by [ash-infra](https://github.com/datalogic10/ash-infra). The `docker-compose.yml` there uses a cross-repo build context (`../metrics-dashboard-demo/dash-api`) and a read-only bind mount of `dash-api/app/` into the running container, so code-only changes do not require rebuilding the image.

**Deploy flow:**

| Change type | Flow |
|---|---|
| Code only (`.py` files under `dash-api/app/`) | `git push` → VM cron auto-pulls (~5 min) → `cd ~/ash-infra && docker compose restart dash-api` |
| `requirements.txt` (new or upgraded dependency) | `git push` → VM cron auto-pulls → `cd ~/ash-infra && docker compose up -d --build dash-api` |

The distinction matters: code lives in the bind mount and reloads on restart; dependencies are baked into the image at build time and only change on rebuild. Restarting without rebuilding after a `requirements.txt` change will fail loudly at container startup with an `ImportError`.

### Local development

The service is self-contained within `dash-api/` — it has its own `Dockerfile` and `requirements.txt`. You can build and run it directly without the bind mount for local testing:

```bash
cd dash-api
docker build -t dash-api-local .
docker run --rm -p 8000:8000 -e DASH_DB_ZBT=... -e DASH_API_SECRET=... dash-api-local
```

Under the production compose setup, the bind mount in ash-infra always shadows the baked-in `COPY app/`, but the image remains standalone-usable for debugging.

## Tech Stack

- **React 18** — UI framework (loaded via CDN)
- **Plotly.js** — Interactive charting library
- **esbuild** — JSX pre-compilation
- **GitHub Pages** — Hosting

## License

All rights reserved. This code is publicly visible for portfolio and demonstration purposes only. See [LICENSE](./LICENSE).
