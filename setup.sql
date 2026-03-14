-- setup.sql: Generic query_dataset() RPC for the Metrics Dashboard
--
-- Install this function in your Supabase project to enable live dashboard connections.
-- The dashboard calls this RPC for all data interactions (schema discovery, filter dropdowns, chart data).
--
-- Security: validates table exists, columns exist, metrics use only whitelisted aggregate functions.
-- No raw SQL passthrough — all queries are constructed server-side from structured parameters.

-- Drop old signature (10 params) to avoid ambiguity with new 11-param version
DROP FUNCTION IF EXISTS public.query_dataset(text, text, text, jsonb, text[], jsonb, text, text, text, integer);

CREATE OR REPLACE FUNCTION public.query_dataset(
  p_table text,                       -- dataset name (mapped to actual table internally)
  p_action text DEFAULT 'data',       -- 'schema' | 'distinct' | 'data'
  p_column text DEFAULT NULL,         -- for 'distinct': which column to get unique values
  p_filters jsonb DEFAULT '{}',       -- {"column_name": ["value1", "value2"]}
  p_group_by text[] DEFAULT '{}',     -- ['column1', 'column2']
  p_metrics jsonb DEFAULT '[]',       -- [{"type": "count", "alias": "vol"}, {"type": "sum", "column": "score", "alias": "rev"}]
  p_time_grain text DEFAULT NULL,     -- 'week' | 'month' | 'quarter' | 'year'
  p_date_column text DEFAULT NULL,    -- date column to apply time grain to
  p_order_by text DEFAULT NULL,       -- 'alias ASC/DESC'
  p_limit integer DEFAULT 10000,
  p_top_n integer DEFAULT NULL        -- top N categories for first group_by column; rest bucketed as 'Rest Combined'
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_schema text;
  v_actual_table text;
  v_fqn text;
  v_sql text;
  v_result jsonb;
  v_columns jsonb;
  v_row_count integer;
  v_metric_rec jsonb;
  v_select_parts text[] := '{}';
  v_group_parts text[] := '{}';
  v_where_parts text[] := ARRAY['1=1'];
  v_filter_key text;
  v_filter_vals jsonb;
  v_col text;
  v_i integer;
  v_time_expr text;
  v_allowed_types text[] := ARRAY['count', 'count_distinct', 'sum', 'avg', 'min', 'max', 'percentile'];
  v_top_n_col text;               -- first group_by column when p_top_n is used
  v_top_n_expr text;              -- CASE WHEN expression for top-N bucketing
  v_first_metric_alias text;      -- unused, kept for backward compat
  v_first_metric_rank_expr text := 'COUNT(*)'; -- ranking expression for top-N CTE
  v_cte_sql text := NULL;         -- WITH clause for top-N (built after WHERE parts)
  v_top_n_applied boolean := false;
BEGIN
  -- ===== TABLE RESOLUTION =====
  -- Map known dataset names to actual schema.table.
  -- Add your own datasets here.
  CASE p_table
    WHEN 'fmc_job_metrics' THEN
      v_schema := 'public_analytics';
      v_actual_table := 'fct_job_metrics';
    WHEN 'fmc_conversations' THEN
      v_schema := 'public_analytics';
      v_actual_table := 'fct_conversations';
    ELSE
      IF position('.' in p_table) > 0 THEN
        v_schema := split_part(p_table, '.', 1);
        v_actual_table := split_part(p_table, '.', 2);
      ELSE
        v_schema := 'public';
        v_actual_table := p_table;
      END IF;
  END CASE;

  v_fqn := quote_ident(v_schema) || '.' || quote_ident(v_actual_table);

  -- Validate table exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = v_schema AND table_name = v_actual_table
  ) THEN
    RETURN jsonb_build_object('error', format('Table %s.%s does not exist', v_schema, v_actual_table));
  END IF;

  -- ===== SCHEMA ACTION =====
  IF p_action = 'schema' THEN
    SELECT jsonb_agg(jsonb_build_object(
      'name', column_name,
      'type', data_type,
      'udt', udt_name
    ) ORDER BY ordinal_position)
    INTO v_columns
    FROM information_schema.columns
    WHERE table_schema = v_schema AND table_name = v_actual_table;

    RETURN jsonb_build_object('columns', COALESCE(v_columns, '[]'::jsonb));

  -- ===== DISTINCT ACTION =====
  ELSIF p_action = 'distinct' THEN
    IF p_column IS NULL THEN
      RETURN jsonb_build_object('error', 'p_column is required for distinct action');
    END IF;

    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema = v_schema AND table_name = v_actual_table AND column_name = p_column
    ) THEN
      RETURN jsonb_build_object('error', format('Column %s does not exist in %s.%s', p_column, v_schema, v_actual_table));
    END IF;

    v_sql := format(
      'SELECT jsonb_agg(val ORDER BY val) FROM (SELECT DISTINCT %I::text AS val FROM %s WHERE %I IS NOT NULL LIMIT 50) sub',
      p_column, v_fqn, p_column
    );
    EXECUTE v_sql INTO v_result;

    RETURN jsonb_build_object(
      'column', p_column,
      'values', COALESCE(v_result, '[]'::jsonb)
    );

  -- ===== DATA ACTION =====
  ELSIF p_action = 'data' THEN

    -- Build metric SELECT expressions
    IF jsonb_array_length(COALESCE(p_metrics, '[]'::jsonb)) = 0 THEN
      RETURN jsonb_build_object('error', 'p_metrics must contain at least one metric definition');
    END IF;

    FOR v_i IN 0..jsonb_array_length(p_metrics) - 1 LOOP
      v_metric_rec := p_metrics->v_i;

      IF NOT ((v_metric_rec->>'type') = ANY(v_allowed_types)) THEN
        RETURN jsonb_build_object('error', format('Invalid metric type: %s. Allowed: %s',
          v_metric_rec->>'type', array_to_string(v_allowed_types, ', ')));
      END IF;

      -- Validate column exists for non-count types
      IF (v_metric_rec->>'type') != 'count' AND (v_metric_rec->>'column') IS NOT NULL THEN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_schema = v_schema AND table_name = v_actual_table
            AND column_name = (v_metric_rec->>'column')
        ) THEN
          RETURN jsonb_build_object('error', format('Metric column %s does not exist', v_metric_rec->>'column'));
        END IF;
      END IF;

      CASE v_metric_rec->>'type'
        WHEN 'count' THEN
          v_select_parts := array_append(v_select_parts, format('COUNT(*) AS %I', v_metric_rec->>'alias'));
          IF v_i = 0 THEN v_first_metric_rank_expr := 'COUNT(*)'; END IF;
        WHEN 'count_distinct' THEN
          v_select_parts := array_append(v_select_parts, format('COUNT(DISTINCT %I) AS %I', v_metric_rec->>'column', v_metric_rec->>'alias'));
          IF v_i = 0 THEN v_first_metric_rank_expr := format('COUNT(DISTINCT %I)', v_metric_rec->>'column'); END IF;
        WHEN 'sum' THEN
          v_select_parts := array_append(v_select_parts, format('COALESCE(SUM(%I), 0) AS %I', v_metric_rec->>'column', v_metric_rec->>'alias'));
          IF v_i = 0 THEN v_first_metric_rank_expr := format('COALESCE(SUM(%I), 0)', v_metric_rec->>'column'); END IF;
        WHEN 'avg' THEN
          v_select_parts := array_append(v_select_parts, format('AVG(%I) AS %I', v_metric_rec->>'column', v_metric_rec->>'alias'));
          IF v_i = 0 THEN v_first_metric_rank_expr := format('AVG(%I)', v_metric_rec->>'column'); END IF;
        WHEN 'min' THEN
          v_select_parts := array_append(v_select_parts, format('MIN(%I) AS %I', v_metric_rec->>'column', v_metric_rec->>'alias'));
          IF v_i = 0 THEN v_first_metric_rank_expr := format('MIN(%I)', v_metric_rec->>'column'); END IF;
        WHEN 'max' THEN
          v_select_parts := array_append(v_select_parts, format('MAX(%I) AS %I', v_metric_rec->>'column', v_metric_rec->>'alias'));
          IF v_i = 0 THEN v_first_metric_rank_expr := format('MAX(%I)', v_metric_rec->>'column'); END IF;
        WHEN 'percentile' THEN
          v_select_parts := array_append(v_select_parts, format(
            'PERCENTILE_CONT(%s) WITHIN GROUP (ORDER BY %I) AS %I',
            COALESCE((v_metric_rec->>'percentile')::numeric, 0.5),
            v_metric_rec->>'column',
            v_metric_rec->>'alias'
          ));
          -- percentile can't be used as a simple GROUP BY aggregate, keep COUNT(*) fallback
      END CASE;
    END LOOP;

    -- Time grain expression (added to SELECT and GROUP BY)
    IF p_time_grain IS NOT NULL AND p_date_column IS NOT NULL THEN
      IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = v_schema AND table_name = v_actual_table AND column_name = p_date_column
      ) THEN
        RETURN jsonb_build_object('error', format('Date column %s does not exist', p_date_column));
      END IF;

      CASE p_time_grain
        WHEN 'day' THEN
          v_time_expr := format('TO_CHAR(%I, ''YYYY-MM-DD'')', p_date_column);
        WHEN 'week' THEN
          v_time_expr := format('TO_CHAR(DATE_TRUNC(''week'', %I), ''YYYY-MM-DD'')', p_date_column);
        WHEN 'month' THEN
          v_time_expr := format('TO_CHAR(DATE_TRUNC(''month'', %I), ''YYYY-MM-DD'')', p_date_column);
        WHEN 'quarter' THEN
          v_time_expr := format('TO_CHAR(%I, ''YYYY'') || ''-Q'' || EXTRACT(QUARTER FROM %I)::text', p_date_column, p_date_column);
        WHEN 'year' THEN
          v_time_expr := format('TO_CHAR(%I, ''YYYY'')', p_date_column);
        ELSE
          RETURN jsonb_build_object('error', format('Invalid time_grain: %s. Use day/week/month/quarter/year', p_time_grain));
      END CASE;

      v_select_parts := array_prepend(v_time_expr || ' AS period', v_select_parts);
      v_group_parts := array_append(v_group_parts, v_time_expr);
    END IF;

    -- Capture alias of first metric for top-N ranking
    IF jsonb_array_length(p_metrics) > 0 THEN
      v_first_metric_alias := p_metrics->0->>'alias';
    END IF;

    -- Non-time GROUP BY columns (with optional top-N bucketing on first column)
    FOR v_i IN 1..COALESCE(array_length(p_group_by, 1), 0) LOOP
      v_col := p_group_by[v_i];
      IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = v_schema AND table_name = v_actual_table AND column_name = v_col
      ) THEN
        RETURN jsonb_build_object('error', format('Group-by column %s does not exist', v_col));
      END IF;

      -- Apply top-N bucketing to the first group_by column when p_top_n is set.
      -- We only record the column here; the CASE WHEN expression is built AFTER WHERE
      -- parts are assembled so that date/filter constraints are applied to the ranking.
      IF v_i = 1 AND p_top_n IS NOT NULL AND p_top_n > 0 THEN
        v_top_n_col := v_col;
        v_top_n_applied := true;
        -- v_top_n_expr built below, after WHERE filters loop
      ELSE
        v_select_parts := array_prepend(format('COALESCE(%I::text, ''Unknown'') AS %I', v_col, v_col), v_select_parts);
        v_group_parts := array_append(v_group_parts, format('%I', v_col));
      END IF;
    END LOOP;

    -- WHERE clauses from filters
    FOR v_filter_key, v_filter_vals IN SELECT * FROM jsonb_each(p_filters) LOOP
      IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = v_schema AND table_name = v_actual_table AND column_name = v_filter_key
      ) THEN
        CONTINUE;
      END IF;
      IF jsonb_array_length(v_filter_vals) > 0 THEN
        v_where_parts := array_append(v_where_parts,
          format('%I::text IN (SELECT jsonb_array_elements_text(%L::jsonb))', v_filter_key, v_filter_vals::text));
      END IF;
    END LOOP;

    -- Build top-N CTE and CASE WHEN now that WHERE parts include all date/filter constraints.
    -- Using a CTE ensures the top-N list is computed exactly once (deterministic).
    IF v_top_n_applied THEN
      v_cte_sql := format(
        'WITH _top_n_cats AS (' ||
          'SELECT COALESCE(%I::text, ''Unknown'') AS cat, %s AS _cnt ' ||
          'FROM %s WHERE %s GROUP BY 1 ORDER BY 2 DESC, 1 LIMIT %s' ||
        ')',
        v_top_n_col, v_first_metric_rank_expr, v_fqn,
        array_to_string(v_where_parts, ' AND '), p_top_n
      );
      v_top_n_expr := format(
        'CASE WHEN COALESCE(%I::text, ''Unknown'') IN (SELECT cat FROM _top_n_cats) ' ||
        'THEN COALESCE(%I::text, ''Unknown'') ELSE ''Rest Combined'' END',
        v_top_n_col, v_top_n_col
      );
      v_select_parts := array_prepend(v_top_n_expr || format(' AS %I', v_top_n_col), v_select_parts);
      v_group_parts := array_append(v_group_parts, v_top_n_expr);
    END IF;

    -- Assemble and execute
    v_sql := COALESCE(v_cte_sql || ' ', '') ||
      'SELECT jsonb_agg(row_to_json(sub)), count(*) FROM (' ||
      'SELECT ' || array_to_string(v_select_parts, ', ') ||
      ' FROM ' || v_fqn ||
      ' WHERE ' || array_to_string(v_where_parts, ' AND ');

    IF array_length(v_group_parts, 1) > 0 THEN
      v_sql := v_sql || ' GROUP BY ' || array_to_string(v_group_parts, ', ');
    END IF;

    IF p_order_by IS NOT NULL THEN
      -- Only allow simple "column ASC/DESC" patterns
      IF p_order_by ~ '^[a-zA-Z_][a-zA-Z0-9_]*\s*(ASC|DESC)?$' THEN
        v_sql := v_sql || ' ORDER BY ' || p_order_by;
      END IF;
    ELSE
      -- Default: order by period if time grain is set
      IF p_time_grain IS NOT NULL THEN
        v_sql := v_sql || ' ORDER BY period';
      END IF;
    END IF;

    v_sql := v_sql || ' LIMIT ' || p_limit || ') sub';

    EXECUTE v_sql INTO v_result, v_row_count;

    RETURN jsonb_build_object(
      'rows', COALESCE(v_result, '[]'::jsonb),
      'row_count', COALESCE(v_row_count, 0),
      'truncated', COALESCE(v_row_count, 0) >= p_limit,
      'top_n_applied', v_top_n_applied
    );

  ELSE
    RETURN jsonb_build_object('error', format('Unknown action: %s. Use schema/distinct/data', p_action));
  END IF;
END;
$$;

GRANT EXECUTE ON FUNCTION public.query_dataset(text, text, text, jsonb, text[], jsonb, text, text, text, integer, integer) TO anon;
GRANT EXECUTE ON FUNCTION public.query_dataset(text, text, text, jsonb, text[], jsonb, text, text, text, integer, integer) TO authenticated;

COMMENT ON FUNCTION public.query_dataset IS
  'Generic query endpoint for the Metrics Dashboard. Actions: schema (column discovery), distinct (filter values), data (aggregated metrics).';
