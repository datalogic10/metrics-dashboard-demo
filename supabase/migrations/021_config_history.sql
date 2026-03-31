-- Config History: keeps last 10 versions of tabs_json before each update.
-- Enables rollback if a save corrupts the config.

-- History table
CREATE TABLE dashboard_config.config_history (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  config_id text NOT NULL,
  tabs_json jsonb NOT NULL,
  saved_at timestamptz DEFAULT now()
);

COMMENT ON TABLE dashboard_config.config_history IS 'Audit trail: previous tabs_json snapshots before each update';
COMMENT ON COLUMN dashboard_config.config_history.config_id IS 'FK to configs.id (no constraint — history survives config deletion)';
COMMENT ON COLUMN dashboard_config.config_history.tabs_json IS 'The tabs_json value BEFORE the update overwrote it';

CREATE INDEX idx_config_history_config_id ON dashboard_config.config_history (config_id, saved_at DESC);

-- Revoke direct access (same pattern as configs table)
REVOKE ALL ON ALL TABLES IN SCHEMA dashboard_config FROM PUBLIC, anon, authenticated;

-- Trigger: snapshot old tabs_json before every update, keep only last 10
CREATE OR REPLACE FUNCTION dashboard_config.snapshot_tabs_json()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  -- Only snapshot when tabs_json actually changed
  IF OLD.tabs_json IS DISTINCT FROM NEW.tabs_json THEN
    INSERT INTO dashboard_config.config_history (config_id, tabs_json)
    VALUES (OLD.id, OLD.tabs_json);

    -- Prune: keep only the 10 most recent snapshots per config
    DELETE FROM dashboard_config.config_history
    WHERE config_id = OLD.id
      AND id NOT IN (
        SELECT h.id FROM dashboard_config.config_history h
        WHERE h.config_id = OLD.id
        ORDER BY h.saved_at DESC
        LIMIT 10
      );
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_config_snapshot
  BEFORE UPDATE ON dashboard_config.configs
  FOR EACH ROW
  EXECUTE FUNCTION dashboard_config.snapshot_tabs_json();

-- RPC: list history for a config (most recent first, max 10)
CREATE OR REPLACE FUNCTION public.get_config_history(p_id text)
RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER STABLE
SET search_path = dashboard_config
AS $$
DECLARE
  result jsonb;
BEGIN
  SELECT COALESCE(jsonb_agg(
    jsonb_build_object(
      'id', h.id,
      'tabs_json', h.tabs_json,
      'saved_at', h.saved_at
    ) ORDER BY h.saved_at DESC
  ), '[]'::jsonb)
  INTO result
  FROM config_history h
  WHERE h.config_id = p_id;

  RETURN result;
END;
$$;

-- RPC: restore a specific history snapshot (requires edit_secret)
CREATE OR REPLACE FUNCTION public.restore_config_snapshot(
  p_id text,
  p_edit_secret text,
  p_history_id bigint
)
RETURNS boolean
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = dashboard_config
AS $$
DECLARE
  snapshot_json jsonb;
  rows_affected int;
BEGIN
  -- Fetch the snapshot (validates it belongs to this config)
  SELECT h.tabs_json INTO snapshot_json
  FROM config_history h
  WHERE h.id = p_history_id AND h.config_id = p_id;

  IF snapshot_json IS NULL THEN
    RETURN false;
  END IF;

  -- Update config (this itself triggers a new snapshot of the current state)
  UPDATE configs
  SET tabs_json = snapshot_json, updated_at = now()
  WHERE id = p_id AND edit_secret = p_edit_secret;

  GET DIAGNOSTICS rows_affected = ROW_COUNT;
  RETURN rows_affected > 0;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_config_history(text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.restore_config_snapshot(text, text, bigint) TO anon, authenticated;
