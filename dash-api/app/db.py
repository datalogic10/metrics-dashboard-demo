"""Connection pool management using asyncpg.

Pools are lazily created per named connection on first request.
"""

import asyncpg
from .config import load_connections, POOL_SIZE

_pools: dict[str, asyncpg.Pool] = {}
_connections: dict[str, str] = {}


def _ensure_connections_loaded():
    global _connections
    if not _connections:
        _connections = load_connections()


async def get_pool(connection_name: str) -> asyncpg.Pool:
    _ensure_connections_loaded()
    if connection_name not in _connections:
        raise KeyError(f"Unknown connection: {connection_name}")
    if connection_name not in _pools:
        dsn = _connections[connection_name]
        _pools[connection_name] = await asyncpg.create_pool(
            dsn, min_size=1, max_size=POOL_SIZE,
        )
    return _pools[connection_name]


async def close_all_pools():
    for pool in _pools.values():
        await pool.close()
    _pools.clear()


def available_connections() -> list[str]:
    _ensure_connections_loaded()
    return list(_connections.keys())
