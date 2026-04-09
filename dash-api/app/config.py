"""Settings from environment variables.

Named DB connections are discovered from DASH_DB_* env vars:
  DASH_DB_ZBT=postgresql://user:pass@host:5432/db  →  connection name "zbt"
"""

import os


def load_connections() -> dict[str, str]:
    """Return {name: dsn} for all DASH_DB_* env vars."""
    prefix = "DASH_DB_"
    connections = {}
    for key, value in os.environ.items():
        if key.startswith(prefix) and value:
            name = key[len(prefix):].lower()
            connections[name] = value
    return connections


API_SECRET = os.environ.get("DASH_API_SECRET", "")
POOL_SIZE = int(os.environ.get("DASH_POOL_SIZE", "5"))
