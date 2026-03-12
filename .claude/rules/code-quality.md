# Code Quality Rules

**ALWAYS FOLLOW THESE**

## Content Placement Decision
| Content Type | Where It Belongs |
|--------------|------------------|
| Rules/constraints (always apply) | `.claude/rules/` |
| User context (who is Ashish) | CLAUDE.md |
| Architecture (how system works) | CLAUDE.md |
| Reference material (lookup when needed) | Agent file |
| Domain knowledge (trading, ML concepts) | Agent file |
| Package-specific guidance | Agent file |

**If unsure**: "Is this needed every session, or only sometimes?" → Sometimes = Agent

## Active Triggers (STOP and do these immediately)

| When This Happens | STOP and Do This |
|-------------------|------------------|
| Created 2+ similar classes/functions | Extract base abstraction BEFORE continuing |
| Implementing 3rd instance of a pattern | Refactor the first 2 into shared code FIRST |
| Changed CLI commands or arguments | Update README.md and CLAUDE.md Quick Reference |
| Changed file paths or renamed files | Search docs/ for references, update all |
| Modified database schema | Update CLAUDE.md Database section |
| Created new database table | Add `COMMENT ON TABLE` and `COMMENT ON COLUMN` for all columns |
| Added new user-facing capability | Add to CLAUDE.md Quick Reference table |
| Finished any multi-file change | Run `Grep` to find missed instances |
| Changed logic in src/ | Run `docker exec zombie-trade-bot python script.py --dry-run` or relevant test |
| **Writing `for` loop in feature/backtest/ML code** | **Calculate complexity FIRST. If > 10K iterations → vectorize** |

## Code Style
- **Docstrings**: Skip "this function does X" restating. DO include domain knowledge, limitations, coverage gaps, gotchas
- No type hints on obvious types (e.g., `x: int = 5`)
- Prefer 3 similar lines over a premature abstraction (but 3 is the limit!)
- Delete > Comment (never leave `# TODO: remove this`)
- Delete dead code immediately - no "might need later"

## Performance Anti-Patterns (CRITICAL)

### ⛔ MANDATORY CHECK: Before Writing ANY Loop in Batch Processing Code

**Applies to:** Feature generators, backtesting, ML training, data pipelines

Before writing a `for` loop, STOP and answer:
1. **What is the complexity?** Count nested loops × data size
   - `for symbol` (200) × `for date` (1500) = 300,000 iterations = ❌ TOO SLOW
   - `for symbol` (200) with vectorized ops inside = ✅ OK
2. **Can this be vectorized?**
   - Point-in-time lookups → `merge_asof` (not nested loops)
   - Aggregations → `groupby` (not filtering in loop)
   - Row operations → `np.where` / vectorized pandas (not `apply`)

**If complexity > 10,000 iterations: MUST use vectorized approach or get explicit approval.**

| SLOW (avoid) | FAST (prefer) |
|--------------|---------------|
| `for date in dates: df.loc[mask, col] = val` | Pre-compute, assign once per symbol |
| `for row in df.iterrows()` | Vectorized pandas/numpy operations |
| `price.iloc[i-lookback:i+1]` inside loop | `price.rolling(window=lookback)` |
| Nested `for symbol` + `for date` loops | Daily aggregation + rolling windows |
| `for symbol: df[df['symbol'] == symbol]` | `df.groupby('symbol')` |
| `df.apply(lambda r: ..., axis=1)` | Vectorized: `fillna()`, `where()`, `str.contains()` |
| `for x in items: conn.execute(INSERT)` | Batch insert with `conn.execute(query, list_of_dicts)` |

**Pattern for nested loop with filtering:**
```python
# SLOW: O(symbols × features × data) - filters entire df each iteration
for symbol in symbols:
    symbol_df = df[df['symbol'] == symbol]  # O(n) filter!
    for feature in features:
        result = symbol_df[feature].sum()

# FAST: O(symbols × features) - single groupby operation
grouped = df.groupby('symbol')[features].sum()
# Or for more complex ops:
result = df.groupby('symbol')[features].apply(lambda x: x.notna().sum())
```

**Pattern for row-wise apply:**
```python
# SLOW: Row-by-row lambda (Python loop under the hood)
df['ratio'] = df.apply(
    lambda r: r['a'] / r['b'] if r['b'] > 0 else None, axis=1
)

# FAST: Vectorized with where/mask
df['ratio'] = df['a'] / df['b']
df.loc[df['b'] <= 0, 'ratio'] = None
# Or: df['ratio'] = np.where(df['b'] > 0, df['a'] / df['b'], None)

# SLOW: String operations in apply
df['is_buy'] = df['grade'].apply(lambda x: 'buy' in str(x).lower())

# FAST: Vectorized string accessor
df['is_buy'] = df['grade'].str.lower().str.contains('buy', na=False)
```

**Pattern for point-in-time lookups (use `merge_asof`):**
```python
# SLOW: Loop over every date (O(symbols × dates))
for date in symbol_dates:
    mask = (df['date'] == date)
    df.loc[mask, 'feature'] = compute(date)

# FAST: Vectorized merge_asof (O(symbols))
merged = pd.merge_asof(
    symbol_df.sort_values('date'),
    reference_data.sort_values('reference_date'),
    left_on='date', right_on='reference_date',
    direction='backward'
)
df.loc[orig_indices, 'feature'] = merged['value'].values
```

**Pattern for rolling windows:**
```python
# SLOW: Manual windowing in loop
for i in range(lookback, n):
    window = price.iloc[i-lookback:i+1]
    result[i] = window.max()

# FAST: Vectorized rolling
result = price.rolling(window=lookback, min_periods=lookback).max()
```

## Definition of Done
Task isn't complete until:
1. Code runs without errors (`docker exec zombie-trade-bot python script.py --dry-run`)
2. Smoke test passes (`docker exec zombie-trade-bot python scripts/smoke_test.py`)
3. No new warnings or linting issues introduced
4. Docs updated (CLAUDE.md, README.md, docs/) if behavior changed
5. Verification search completed for pattern changes
6. Changes explained to user (what and why)
