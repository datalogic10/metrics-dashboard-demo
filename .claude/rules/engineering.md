# Engineering Principles

## Docker Execution (IMPORTANT)
**All Python commands run inside Docker containers, not on the host machine.**

```bash
# CORRECT - Run inside container
docker exec zombie-trade-bot python scripts/signal_daemon.py --once --dry-run

# WRONG - Will fail (no Python env on host)
python scripts/signal_daemon.py --once --dry-run
```

**Container names (for `docker exec`):**
| Container | Purpose |
|-----------|---------|
| `zombie-trade-bot` | Main app (Streamlit, scripts) |
| `zombie-trade-postgres` | PostgreSQL database |

**Service names (for `docker-compose`):** `app`, `postgres`

**Always use `docker exec zombie-trade-bot` for:**
- Running Python scripts
- Testing code changes
- Database queries
- Any command that needs project dependencies

## Efficiency
- **LLM coding**: Solve the problem, not adjacent problems. One focused change > scattered improvements.
- **Trading system**: Optimize for correctness first, then speed. Premature optimization is the root of evil.
- **Measure before optimizing**: "It feels slow" → profile first, then fix the actual bottleneck.

## Modularity (Clear Boundaries)
| Layer | Responsibility | Does NOT do |
|-------|---------------|-------------|
| `scripts/` | CLI entry points, argument parsing | Business logic |
| `src/brokers/` | Broker API communication | Data storage, ML |
| `src/repositories/` | Database read/write | Business logic, API calls |
| `src/ml/` | Model training, inference | Data fetching, order execution |
| `src/strategies/` | Signal generation | Order execution, data fetching |
| `src/app/` | UI display only | Trading actions, data mutations |

**Rule**: If code doesn't fit cleanly in one layer, it's doing too much. Split it.

## Scalability (Build for 10x, Not 100x)
- Current: 500 symbols, daily data, single broker → Design for: 5000 symbols, minute data, 3 brokers
- Don't build for: 100K symbols, tick data, 50 brokers (that's a rewrite, not a scale)
- **Interfaces over implementations**: Use base classes so swapping components is easy

## Dependencies Policy
- **Before adding a package**: Is there a stdlib or existing dependency that does this?
- **Prefer**: pandas, numpy, scikit-learn, xgboost (already in project)
- **Avoid**: New ORMs, new web frameworks, new ML frameworks without discussion
- **Never**: Add a dependency for one small function (copy the function instead)

## Error Handling Pattern
```python
# Standard pattern for this codebase
try:
    result = do_operation()
except SpecificError as e:
    logger.error(f"Operation failed: {e}")
    return None  # or raise with context
# NO: except Exception: pass (silent failures are bugs)
```

## Testing Strategy
- **Must test**: Order execution logic, ML predictions, data transformations
- **Test approach**: Run with `--dry-run` before live, backtest before deploy
- **When to add unit tests**: When a bug is found (regression test), complex logic
- **Current priority**: Integration tests > Unit tests (system works end-to-end)

## Technical Debt Tracking
When deferring a fix, add here (not scattered TODOs):
| Debt | Impact | Effort | Added |
|------|--------|--------|-------|
| MLTrainingService not implemented | No background ML training in UI | Medium | Dec 2025 |
| DipBuyer symbols hardcoded | Can't configure symbols via config | Low | Dec 2025 |
| Feature Generation Phase 2 | Only 53 features; expand to 500+ (all TA-Lib, sector-relative, VIX) | Medium | Dec 2025 |
| Strategy portfolio/trades access | Strategies can't see actual positions or if signals executed; uses shadow tracking | Medium | Dec 2025 |
| Add adj_open/high/low columns | adj_close now used for features (Jan 2026); adj_open/high/low still needed for proper OHLC-based indicators | Low | Jan 2026 |
| SEC EDGAR DAG not implemented | No automated daily/weekly refresh of SEC fundamentals (annual + quarterly tables) | Low | Dec 2025 |
| SEC EDGAR table not in Data Quality tab | Can't validate fundamentals_history_sec_edgar coverage | Low | Dec 2025 |
| Analyst estimate sources not implemented | quarterly_earnings_estimate, quarterly_revenue_estimate, quarterly_growth_estimates data sources not in registry | Low | Jan 2026 |
| Delisted stock data source | Can't fetch historical data for delisted stocks (e.g., WBA); need Polygon.io or CSV import | Low | Jan 2026 |
| SEC EDGAR 20-F parsing | Foreign private issuers (SPOT, etc.) file 20-F forms with different XBRL tags; EPS/net_income NULL for ~12% of annual records | Low | Jan 2026 |
| SEC EDGAR not split-adjusted | SEC EDGAR EPS is "as-filed" (pre-split); workaround: SimFin priority 1 (has split-adjusted shares). Proper fix: apply split adjustments to SEC EDGAR data | Low | Jan 2026 |
| ADR/foreign fundamentals gap | ~104 Core1000 symbols (ADRs, foreign) have no fundamentals coverage. SimFin is US-focused; SEC EDGAR only has 4. Need alternative free source (FMP, Alpha Vantage, or 20-F parsing) | Medium | Jan 2026 |

## Recent Improvements (for context)
| Improvement | Impact | Date |
|-------------|--------|------|
| Effective Date Fallback Logic | Fixed NULL effective_end dates on most recent fundamentals filings. Now defaults to 90 days (quarterly) or 365 days (annual). Enables feature computation for recent data (e.g., margin_expansion). Applied to all consolidators via base.py. | Jan 2026 |
| RFECV Feature Selection (B1) | RFECV replaces SelectKBest for feature selection. Considers feature interactions, uses TimeSeriesSplit for temporal data, fixed mutual_info_classif bug. Fallback to SelectKBest with 5-min timeout. | Jan 2026 |
| CatBoost in Ensemble (B5) | Added CatBoost as 5th model (0.2 weight each). Ordered boosting provides algorithm diversity beyond XGBoost/LightGBM. Native categorical support. | Jan 2026 |
| Daily Ranking Portfolio Optimization (A2+A3) | Unified sizing: model + rebalance BUYs compete by confidence. Top-N ranking replaces hold periods + shortfall logic. Smoke test validates prioritization. | Jan 2026 |
| Kelly-Vol Position Sizing (A1) | ML BUY/SELL sizing based on Kelly Criterion + ATR volatility. High-vol stocks get smaller positions. Partial exits 10-100%. | Jan 2026 |
| Execution-Aligned Targets (A5) | Intraday/open-to-open targets + market orders. Eliminates gap selection bias (limit orders miss gap-up winners). | Jan 2026 |
| Multi-Horizon Targets (A4) | Added 6 target types: intraday_return_1d/5d, open_to_open_1d/5d, future_return_5d/10d. Model filename includes target. | Jan 2026 |
| Screener Selection UI + UniverseManager Cleanup | Added Core30/Core200 screeners, ScreenerRegistry, SymbolInput.with_screener(). Deleted UniverseManager (628 lines) and universe_config.json. All tabs use new DRY component. | Jan 2026 |
| EMA Crossover Feature Fix | Fixed ema_crossover (was just regime state, not actual crossover). Renamed to ema_regime. Added ema_days_since_bullish_cross and ema_days_since_bearish_cross (time-based features for ML). Version 2.0. | Jan 2026 |
| Feature Generator DRY Refactoring | Eliminated ~50 duplicate lines in TechnicalFeatureGenerator and SectorFeatureGenerator; now use shared src/indicators functions as single source of truth for RSI, MACD, ATR, etc. | Jan 2026 |
| ML Strategy DRY Refactoring | Eliminated 456 duplicate lines (23% reduction); Template Method pattern; 4x LLM efficiency gain | Jan 2026 |

## Session Handoff
At end of significant work, update:
1. Decision Log (if architectural choice made)
2. Current Phase Scope (check off completed items)
3. Technical Debt table (if deferring something)
4. Commit changes with clear message

## CLAUDE.md Size Guard
- **Hard limit**: 350 lines max
- **Current**: Check with `wc -l CLAUDE.md`
- **If over limit**: Move content to agents or .claude/rules/

## Meta-Rule: Improving Rules
When a mistake is made despite having rules:
1. **Identify the gap**: What rule would have prevented this?
2. **Add the missing rule**: Be specific and actionable
3. **Test the rule**: Would it catch similar mistakes?

Rules should be **prescriptive** (tell you what to do), not just **descriptive**.
