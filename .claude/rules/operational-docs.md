# Operational Documentation in Source Files

**Keep operational details in source file docstrings, not separate markdown files.**

## Why

- Docs in separate files drift out of sync with code
- Developers update code but forget to update docs/
- Source docstrings are visible when reading/editing the code
- IDE tooltips show docstrings automatically

## Required Sections for Data Sources

When creating or updating data source files (`src/data/sources/*.py`), include these sections in the module docstring:

```python
"""
[Source Name] Data Source

Brief description of what this source provides.

===============================================================================
OPERATIONAL DETAILS
===============================================================================

[Tier/API Limitations]:
- Rate limits, data delays, API key requirements
- Cost tiers if applicable

Refresh Logic (cache_freshness_hours):
- How often each data type refreshes
- What determines "stale" data

CLI Commands:
    # Show common usage patterns
    python scripts/data_update.py --source [name]
    python scripts/data_update.py --source [name] --full-refresh

Available Sources:
    source_name_1  - Description
    source_name_2  - Description

Database Tables:
    schema.table_name  - What it stores

===============================================================================
USE CASES
===============================================================================

When to use this source vs alternatives.

===============================================================================
ARCHITECTURE
===============================================================================

Data flow, caching strategy, any non-obvious implementation details.
"""
```

## When to Update

Update the docstring when you:
- Change cache_freshness_hours values
- Add/remove data sources from the registry
- Change database table names or schemas
- Modify the data flow or caching logic
- Discover new limitations or gotchas

## Other Source Types

Apply similar patterns to:
- Feature generators (`src/features/generators/*.py`)
- Consolidators (`src/data/consolidators/*.py`)
- Any module with operational parameters users need to know
