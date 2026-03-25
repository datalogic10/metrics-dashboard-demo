-- Config DB: Stores dashboard configurations for the metrics dashboard.
-- Table lives in a separate schema to isolate from application data.
-- RPC functions live in public schema so PostgREST can call them.
-- edit_secret is never returned by any function.

-- Schema
CREATE SCHEMA IF NOT EXISTS dashboard_config;

-- Table
CREATE TABLE dashboard_config.configs (
  id text PRIMARY KEY,
  edit_secret text NOT NULL,
  name text,
  connection_json jsonb NOT NULL,
  tabs_json jsonb NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

COMMENT ON TABLE dashboard_config.configs IS 'Dashboard configurations: connection details + tab/metric definitions';
COMMENT ON COLUMN dashboard_config.configs.id IS 'Public nanoid (12 chars), used in URL';
COMMENT ON COLUMN dashboard_config.configs.edit_secret IS 'Private nanoid (21 chars), stored in creator localStorage only';
COMMENT ON COLUMN dashboard_config.configs.connection_json IS '{supabaseUrl, apiKey, dataset} for the data source';
COMMENT ON COLUMN dashboard_config.configs.tabs_json IS '[{id, name, dataset, metricConfig}] array of tab definitions';

-- Index for faster lookups
CREATE INDEX idx_configs_created_at ON dashboard_config.configs (created_at DESC);

-- Constraints: validate ID format and limit payload sizes
ALTER TABLE dashboard_config.configs
  ADD CONSTRAINT id_format CHECK (id ~ '^[A-Za-z0-9_\-]{8,24}$'),
  ADD CONSTRAINT connection_json_size CHECK (octet_length(connection_json::text) < 4096),
  ADD CONSTRAINT tabs_json_size CHECK (octet_length(tabs_json::text) < 65536);

-- RLS: block all direct access. All access goes through SECURITY DEFINER RPCs.
ALTER TABLE dashboard_config.configs ENABLE ROW LEVEL SECURITY;
-- No policies = no direct access for any role

-- Explicitly revoke schema access from all roles
REVOKE ALL ON SCHEMA dashboard_config FROM PUBLIC;
REVOKE ALL ON ALL TABLES IN SCHEMA dashboard_config FROM PUBLIC, anon, authenticated;

-- =============================================================================
-- RPC Functions (public schema, SECURITY DEFINER)
-- =============================================================================

-- Create a new config
CREATE OR REPLACE FUNCTION public.create_dashboard_config(
  p_id text,
  p_edit_secret text,
  p_name text,
  p_connection_json jsonb,
  p_tabs_json jsonb
) RETURNS void
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = dashboard_config
AS $$
BEGIN
  INSERT INTO configs (id, edit_secret, name, connection_json, tabs_json)
  VALUES (p_id, p_edit_secret, p_name, p_connection_json, p_tabs_json);
END;
$$;

-- Get a config by ID (never returns edit_secret)
CREATE OR REPLACE FUNCTION public.get_dashboard_config(p_id text)
RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER STABLE
SET search_path = dashboard_config
AS $$
DECLARE
  result jsonb;
BEGIN
  SELECT jsonb_build_object(
    'id', c.id,
    'name', c.name,
    'connection_json', c.connection_json,
    'tabs_json', c.tabs_json,
    'created_at', c.created_at,
    'updated_at', c.updated_at
  ) INTO result
  FROM configs c
  WHERE c.id = p_id;

  RETURN result;
END;
$$;

-- Update a config (requires matching edit_secret)
CREATE OR REPLACE FUNCTION public.update_dashboard_config(
  p_id text,
  p_edit_secret text,
  p_tabs_json jsonb DEFAULT NULL,
  p_name text DEFAULT NULL
) RETURNS boolean
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = dashboard_config
AS $$
DECLARE
  rows_affected int;
BEGIN
  UPDATE configs
  SET
    tabs_json = COALESCE(p_tabs_json, configs.tabs_json),
    name = COALESCE(p_name, configs.name),
    updated_at = now()
  WHERE id = p_id AND edit_secret = p_edit_secret;

  GET DIAGNOSTICS rows_affected = ROW_COUNT;
  RETURN rows_affected > 0;
END;
$$;

-- Delete a config (requires matching edit_secret)
CREATE OR REPLACE FUNCTION public.delete_dashboard_config(
  p_id text,
  p_edit_secret text
) RETURNS boolean
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = dashboard_config
AS $$
DECLARE
  rows_affected int;
BEGIN
  DELETE FROM configs
  WHERE id = p_id AND edit_secret = p_edit_secret;

  GET DIAGNOSTICS rows_affected = ROW_COUNT;
  RETURN rows_affected > 0;
END;
$$;

-- Grant execute to anon and authenticated roles
GRANT EXECUTE ON FUNCTION public.create_dashboard_config(text, text, text, jsonb, jsonb) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_dashboard_config(text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.update_dashboard_config(text, text, jsonb, text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.delete_dashboard_config(text, text) TO anon, authenticated;
