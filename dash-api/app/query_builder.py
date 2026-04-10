"""Python port of the query_dataset SQL function.

Builds and executes aggregation queries against any Postgres database.
Same response format as the PL/pgSQL version so the JS dashboard works unchanged.
"""

import re
from datetime import date as _date

import asyncpg

from .models import QueryRequest

ALLOWED_METRIC_TYPES = {"count", "count_distinct", "sum", "avg", "min", "max", "percentile"}
ORDER_BY_RE = re.compile(r"^[a-zA-Z_][a-zA-Z0-9_]*\s*(ASC|DESC)?$", re.IGNORECASE)
DATE_RE = re.compile(r"^\d{4}-\d{2}-\d{2}$")


def _quote_ident(name: str) -> str:
    return '"' + name.replace('"', '""') + '"'


def _resolve_table(table: str) -> tuple[str, str] | dict:
    """Parse schema.table, defaulting to 'public' schema."""
    if table.count(".") > 1:
        return {"error": f"Invalid table name: {table}. Expected schema.table format"}
    if "." in table:
        schema, tbl = table.split(".", 1)
        return schema, tbl
    return "public", table


async def _table_exists(conn: asyncpg.Connection, schema: str, table: str) -> bool:
    row = await conn.fetchval(
        "SELECT 1 FROM information_schema.tables WHERE table_schema = $1 AND table_name = $2",
        schema, table,
    )
    return row is not None


async def _column_exists(conn: asyncpg.Connection, schema: str, table: str, column: str) -> bool:
    row = await conn.fetchval(
        "SELECT 1 FROM information_schema.columns WHERE table_schema = $1 AND table_name = $2 AND column_name = $3",
        schema, table, column,
    )
    return row is not None


async def _get_columns(conn: asyncpg.Connection, schema: str, table: str) -> list[dict]:
    rows = await conn.fetch(
        "SELECT column_name, data_type, udt_name FROM information_schema.columns "
        "WHERE table_schema = $1 AND table_name = $2 ORDER BY ordinal_position",
        schema, table,
    )
    return [{"name": r["column_name"], "type": r["data_type"], "udt": r["udt_name"]} for r in rows]


# ---------------------------------------------------------------------------
# Action handlers
# ---------------------------------------------------------------------------

async def _handle_schema(conn: asyncpg.Connection, schema: str, table: str) -> dict:
    columns = await _get_columns(conn, schema, table)
    return {"columns": columns}


async def _handle_distinct(conn: asyncpg.Connection, schema: str, table: str, req: QueryRequest) -> dict:
    if not req.column:
        return {"error": "column is required for distinct action"}
    if not await _column_exists(conn, schema, table, req.column):
        return {"error": f"Column {req.column} does not exist in {schema}.{table}"}

    # Fast path: pg_stats.most_common_vals, populated by ANALYZE.
    # System catalog lookup — no table scan, returns in <10ms regardless of
    # table size. Captures up to 100 most-frequent values per column, which
    # covers the vast majority of filter-dropdown use cases.
    #
    # Motivating case: analytics.prices_daily has ~7.8M rows and no index on
    # `source` (2 distinct values). A real DISTINCT scan takes ~73s because
    # PG has to Seq Scan the whole table to prove the set is complete, even
    # with LIMIT 50. pg_stats returns both values instantly.
    #
    # The `most_common_vals::text::text[]` cast trick converts pg_stats'
    # polymorphic anyarray to a text[] via its canonical text representation.
    # Fine for typical dimension values (identifiers, category names) that
    # don't contain array-delimiter characters.
    stats_row = await conn.fetchrow(
        "SELECT most_common_vals::text::text[] AS vals "
        "FROM pg_stats "
        "WHERE schemaname = $1 AND tablename = $2 AND attname = $3",
        schema, table, req.column,
    )
    DISTINCT_LIMIT = 20

    if stats_row and stats_row["vals"]:
        vals = sorted(stats_row["vals"])
        truncated = len(vals) > DISTINCT_LIMIT
        return {"column": req.column, "values": vals[:DISTINCT_LIMIT], "truncated": truncated}

    # Fallback: actual DISTINCT scan. Slow on big unindexed columns, but the
    # only option if the table has never been ANALYZEd (e.g. freshly created)
    # or the column is entirely NULL so pg_stats has no entry.
    fqn = _quote_ident(schema) + "." + _quote_ident(table)
    col = _quote_ident(req.column)
    # Fetch LIMIT+1 to detect truncation without an extra COUNT query
    sql = f"SELECT DISTINCT {col}::text AS val FROM {fqn} WHERE {col} IS NOT NULL ORDER BY val LIMIT {DISTINCT_LIMIT + 1}"
    rows = await conn.fetch(sql)
    vals = [r["val"] for r in rows]
    truncated = len(vals) > DISTINCT_LIMIT
    return {"column": req.column, "values": vals[:DISTINCT_LIMIT], "truncated": truncated}


async def _handle_data(conn: asyncpg.Connection, schema: str, table: str, req: QueryRequest) -> dict:
    if not req.metrics:
        return {"error": "metrics must contain at least one metric definition"}

    fqn = _quote_ident(schema) + "." + _quote_ident(table)
    select_parts: list[str] = []
    group_parts: list[str] = []
    where_parts: list[str] = ["1=1"]
    params: list = []  # asyncpg $1, $2, ...
    param_idx = 0

    # -- Rank tracking for top-N --
    rank_aliases: list[str] = []
    rank_exprs: list[str] = []
    first_metric_rank_expr = "COUNT(*)"

    # -- Build metric SELECT expressions --
    for i, m in enumerate(req.metrics):
        mtype = m.get("type", "")
        alias = m.get("alias", f"m{i}")
        col = m.get("column")

        if mtype not in ALLOWED_METRIC_TYPES:
            return {"error": f"Invalid metric type: {mtype}. Allowed: {', '.join(sorted(ALLOWED_METRIC_TYPES))}"}

        if mtype != "count" and col:
            if not await _column_exists(conn, schema, table, col):
                return {"error": f"Metric column {col} does not exist"}

        qcol = _quote_ident(col) if col else None
        qalias = _quote_ident(alias)
        expr = ""
        rank_expr = ""

        if mtype == "count":
            expr = f"COUNT(*) AS {qalias}"
            rank_expr = "COUNT(*)"
        elif mtype == "count_distinct":
            expr = f"COUNT(DISTINCT {qcol}) AS {qalias}"
            rank_expr = f"COUNT(DISTINCT {qcol})"
        elif mtype == "sum":
            expr = f"COALESCE(SUM({qcol}), 0) AS {qalias}"
            rank_expr = f"COALESCE(SUM({qcol}), 0)"
        elif mtype == "avg":
            expr = f"AVG({qcol}) AS {qalias}"
            rank_expr = f"AVG({qcol})"
        elif mtype == "min":
            expr = f"MIN({qcol}) AS {qalias}"
            rank_expr = f"MIN({qcol})"
        elif mtype == "max":
            expr = f"MAX({qcol}) AS {qalias}"
            rank_expr = f"MAX({qcol})"
        elif mtype == "percentile":
            try:
                pct = float(m.get("percentile", 0.5))
            except (ValueError, TypeError):
                return {"error": "percentile must be a number between 0.0 and 1.0"}
            if not (0.0 <= pct <= 1.0):
                return {"error": "percentile must be between 0.0 and 1.0"}
            expr = f"PERCENTILE_CONT({pct}) WITHIN GROUP (ORDER BY {qcol}) AS {qalias}"
            # percentile can't be used as a simple GROUP BY aggregate; skip rank tracking

        select_parts.append(expr)
        if mtype != "percentile":
            rank_aliases.append(alias)
            rank_exprs.append(rank_expr)
            if i == 0:
                first_metric_rank_expr = rank_expr

    # Override rank expression if rank_by specified
    if req.rank_by and rank_aliases:
        for j, ra in enumerate(rank_aliases):
            if ra == req.rank_by:
                first_metric_rank_expr = rank_exprs[j]
                break

    # -- Time grain expression --
    time_expr = None
    if req.time_grain and req.date_column:
        if not await _column_exists(conn, schema, table, req.date_column):
            return {"error": f"Date column {req.date_column} does not exist"}

        dc = _quote_ident(req.date_column)
        grain_map = {
            "day": f"TO_CHAR({dc}, 'YYYY-MM-DD')",
            "week": f"TO_CHAR(DATE_TRUNC('week', {dc}), 'YYYY-MM-DD')",
            "month": f"TO_CHAR(DATE_TRUNC('month', {dc}), 'YYYY-MM-DD')",
            "quarter": f"TO_CHAR({dc}, 'YYYY') || '-Q' || EXTRACT(QUARTER FROM {dc})::text",
            "year": f"TO_CHAR({dc}, 'YYYY')",
        }
        if req.time_grain not in grain_map:
            return {"error": f"Invalid time_grain: {req.time_grain}. Use day/week/month/quarter/year"}

        time_expr = grain_map[req.time_grain]
        select_parts.insert(0, f"{time_expr} AS period")
        group_parts.append(time_expr)

    # -- GROUP BY columns (with optional top-N on first column) --
    top_n_col = None
    top_n_applied = False
    top_n_expr = None

    for i, col in enumerate(req.group_by):
        if not await _column_exists(conn, schema, table, col):
            return {"error": f"Group-by column {col} does not exist"}

        if i == 0 and req.top_n and req.top_n > 0:
            top_n_col = col
            top_n_applied = True
            # top_n_expr built after WHERE filters
        else:
            qcol = _quote_ident(col)
            select_parts.insert(0, f"COALESCE({qcol}::text, 'Unknown') AS {qcol}")
            group_parts.append(qcol)

    # -- WHERE clauses from filters --
    for fcol, fvals in req.filters.items():
        if not await _column_exists(conn, schema, table, fcol):
            continue
        if fvals:
            param_idx += 1
            where_parts.append(f"{_quote_ident(fcol)}::text = ANY(${param_idx}::text[])")
            params.append(fvals)

    # -- Date range bounds on date_column --
    # Both bounds are optional. If the client omits either, no bound is applied
    # on that side — i.e. omitting date_to means "no upper bound", which is the
    # correct default for forecast/target/budget tables whose rows legitimately
    # extend into the future.
    #
    # The upper bound is expressed as a half-open interval
    #   date_column < (date_to + 1 day)
    # rather than a closed `<= date_to::date`. For a timestamp/timestamptz
    # column, `ts <= '2026-04-09'::date` silently becomes
    # `ts <= '2026-04-09 00:00:00'`, which drops every row on the upper-bound
    # day that has a non-midnight time. The half-open form is correct for both
    # `date` and `timestamp[tz]` columns and remains index-friendly (the column
    # is still bare on the LHS, so a b-tree range scan can be used).
    #
    # YYYY-MM-DD format is validated before binding; values are converted to
    # datetime.date objects because asyncpg's date codec requires a real date
    # (calls .toordinal() on the value) — handing it a raw string raises
    # DataError on bind.
    if req.date_column:
        if req.date_from and DATE_RE.match(req.date_from):
            param_idx += 1
            where_parts.append(f"{_quote_ident(req.date_column)} >= ${param_idx}::date")
            params.append(_date.fromisoformat(req.date_from))
        if req.date_to and DATE_RE.match(req.date_to):
            param_idx += 1
            where_parts.append(
                f"{_quote_ident(req.date_column)} < (${param_idx}::date + INTERVAL '1 day')"
            )
            params.append(_date.fromisoformat(req.date_to))

    # -- Build top-N CTE --
    cte_sql = None
    where_clause = " AND ".join(where_parts)

    if top_n_applied:
        qtop = _quote_ident(top_n_col)
        if time_expr:
            # Per-period top-N
            cte_sql = (
                f"WITH _cat_ranked AS MATERIALIZED ("
                f"SELECT {time_expr} AS period, COALESCE({qtop}::text, 'Unknown') AS cat, "
                f"{first_metric_rank_expr} AS _metric, "
                f"ROW_NUMBER() OVER (PARTITION BY {time_expr} ORDER BY {first_metric_rank_expr} DESC, COALESCE({qtop}::text, 'Unknown')) AS _rank "
                f"FROM {fqn} WHERE {where_clause} GROUP BY 1, 2"
                f"), _top_cats AS MATERIALIZED ("
                f"SELECT period, cat FROM _cat_ranked WHERE _rank <= {int(req.top_n)}"
                f")"
            )
            top_n_expr = (
                f"CASE WHEN ({time_expr}, COALESCE({qtop}::text, 'Unknown')) IN (SELECT period, cat FROM _top_cats) "
                f"THEN COALESCE({qtop}::text, 'Unknown') ELSE 'Rest Combined' END"
            )
        else:
            # Global top-N
            cte_sql = (
                f"WITH _top_n_cats AS MATERIALIZED ("
                f"SELECT COALESCE({qtop}::text, 'Unknown') AS cat, {first_metric_rank_expr} AS _cnt "
                f"FROM {fqn} WHERE {where_clause} GROUP BY 1 ORDER BY 2 DESC, 1 LIMIT {int(req.top_n)}"
                f")"
            )
            top_n_expr = (
                f"CASE WHEN COALESCE({qtop}::text, 'Unknown') IN (SELECT cat FROM _top_n_cats) "
                f"THEN COALESCE({qtop}::text, 'Unknown') ELSE 'Rest Combined' END"
            )

        select_parts.insert(0, f"{top_n_expr} AS {_quote_ident(top_n_col)}")
        group_parts.append(top_n_expr)

    # -- Assemble final SQL --
    sql = ""
    if cte_sql:
        sql += cte_sql + " "

    sql += "SELECT " + ", ".join(select_parts)
    sql += f" FROM {fqn}"
    sql += f" WHERE {where_clause}"

    if group_parts:
        sql += " GROUP BY " + ", ".join(group_parts)

    if req.order_by:
        if ORDER_BY_RE.match(req.order_by):
            ob_parts = req.order_by.strip().split()
            ob_direction = f" {ob_parts[1].upper()}" if len(ob_parts) == 2 else ""
            sql += f" ORDER BY {_quote_ident(ob_parts[0])}{ob_direction}"
    elif req.time_grain:
        sql += " ORDER BY period"

    sql += f" LIMIT {req.limit}"

    # -- Execute --
    rows = await conn.fetch(sql, *params)
    result = [dict(r) for r in rows]

    # Convert Decimal/etc to float for JSON serialization
    for row in result:
        for k, v in row.items():
            if hasattr(v, "as_tuple"):  # Decimal
                row[k] = float(v)

    row_count = len(result)
    return {
        "rows": result,
        "row_count": row_count,
        "truncated": row_count >= req.limit,
        "top_n_applied": top_n_applied,
    }


# ---------------------------------------------------------------------------
# Dispatcher
# ---------------------------------------------------------------------------

async def execute_query(pool: asyncpg.Pool, req: QueryRequest) -> dict:
    result = _resolve_table(req.table)
    if isinstance(result, dict):
        return result
    schema, table = result

    async with pool.acquire() as conn:
        if not await _table_exists(conn, schema, table):
            return {"error": f"Table {schema}.{table} does not exist"}

        if req.action == "schema":
            return await _handle_schema(conn, schema, table)
        elif req.action == "distinct":
            return await _handle_distinct(conn, schema, table, req)
        elif req.action == "data":
            return await _handle_data(conn, schema, table, req)
        else:
            return {"error": f"Unknown action: {req.action}. Use schema/distinct/data"}
