# Project Focus

**SINGLE SOURCE OF TRUTH FOR SCOPE**

**Long-term vision**: World-class ML trading system with 60%+ accuracy
**Current phase**: Phase 4 - Live Trading Hardening (Phases 0-3 complete)
**Current status**: ML accuracy 71.1% achieved (target: 60%+), codebase cleanup complete

---

## Roadmap

### Phase 0: Immediate Trading ✅ COMPLETE
- [x] Signal generation from strategies
- [x] Signal storage in database (database-first)
- [x] Signal execution through UI
- [x] Signal daemon for continuous generation during market hours
- [x] Strategy-owned symbols via `get_symbols()`

### Phase 1: Postgres Migration ✅ COMPLETE
- [x] Replace DuckDB with PostgreSQL
- [x] Enable concurrent read/write (daemon + UI simultaneously)
- [x] Migrate schema: trading_signals, market_data, positions, orders (272K rows)
- [x] Update all repositories to use PostgreSQL (auto-detection)
- [x] Test signal daemon + Streamlit running concurrently
- [x] Migrate ML features module to PostgreSQL (JSONB instead of DuckDB MAP)

### Phase 1.5: Codebase Cleanup ✅ COMPLETE
- [x] Delete archive folders (~6,500 lines)
- [x] Remove deprecated data sources from registry
- [x] Fix & document smoke test
- [x] DRY refactoring: Backtest engine (380+ lines removed, 75% reduction in main function)

### Phase 2: ML Signal Quality ✅ COMPLETE
- [x] 2A: Sector-relative features (4 new features)
- [x] 2B: Insider transaction data source (2045 records for 18 symbols)
- [x] 2C: Feature audit (88 unique features, presence rates, importance ranking)
- [x] 2D: Data pull + feature backfill (43 symbols, 5 years, 44,403 rows)
- [x] 2E: Feature audit UI (Data Quality tab + ML Ops tabs)
- [x] 2F: Ensemble feature tracking fix (training → save → load → predict)
- [x] 2G: Audit adj_close vs close usage (DEFERRED - tracked in tech debt)

### Phase 3: ML Model Improvements ✅ COMPLETE
- [x] 3A: Replace binary classification with regression (TargetProcessor class)
- [x] 3B: Walk-forward validation (10 folds, expanding window)
- [x] 3C: Model diversity (4-model ensemble: XGBoost, LightGBM, Linear, RandomForest)
- [x] 3D: SPY benchmark comparison (Core 4 metrics: SPY Return, Excess Return, Alpha, Beta)
- [x] Kelly-Vol position sizing (ML strategies)
- [x] Execution-aligned targets (intraday/open-to-open)
- [x] Multi-horizon targets (1d/5d/10d)

**Results**: 71.1% ML accuracy on walk-forward validation (target: 60%+)

### Phase 4: Live Trading Hardening 🔄 IN PROGRESS
- [ ] End-to-end live trading with real orders
- [ ] Order tracking and position management
- [ ] Error handling and recovery
- [ ] Accurate backtesting validation
- [ ] Cloud compute strategy (Azure Spot VM, ~$20-50/month)

**Focus**: Validate system with small positions before scaling

### Phase 5: Production Hardening
- [ ] Simple monitoring (know when things break)
- [ ] Alerting on failures
- [ ] Logging and audit trail
- [ ] Performance optimization (30x-49x speedups already achieved)

---

## Success Metrics

**Achieved**:
- ✅ ML accuracy > 60% on walk-forward validation → **71.1% achieved** (Jan 2026)
- ✅ Codebase cleanup complete (~10K+ lines removed)
- ✅ All features validated (88 unique features, presence rates tracked)
- ✅ Can run training on 90+ symbols successfully

**Pending**:
- [ ] Backtest Sharpe > SPY Sharpe for same period (needs validation)
- [ ] Live trading with real orders (Phase 4)

---

## NOT in Current Roadmap (REJECT or DEFER)
- Real-time/tick data streaming
- Multi-broker support
- Options/crypto trading
- Advanced ML (transformers, RL)
- Kubernetes/microservices
- Sub-second latency optimization
- Full cloud deployment (budget doesn't support)

---

## Decision Log
| Decision | Why | Date |
|----------|-----|------|
| Scripts + Monitor (not UI trading) | Simpler, fewer bugs, CLI is faster | 2024 |
| Database-first | Latency, offline capability, no API rate limits | 2024 |
| Single CLAUDE.md | One source of truth, less drift | Dec 2024 |
| PostgreSQL (not DuckDB) | DuckDB single-writer blocks daemon+UI concurrency | Dec 2025 |
| .claude/rules/ | Modular rules, reduce context loading | Dec 2025 |
| SEC EDGAR over YFinance fundamentals | YFinance only has today's data; SEC EDGAR has 15+ years history | Dec 2025 |
| DataSourceBase + Registry pattern | 62% code reduction; easy to add Alpaca/Polygon/Finnhub sources | Dec 2025 |
| Different feature counts per model | Intentional for ensemble diversity via max_features | Dec 2025 |
| 4-model diverse ensemble | Algorithm diversity (XGBoost, LightGBM, Linear, RF) beats multiple XGBoost variants | Jan 2026 |
| Cash reserve management in strategy | Strategy controls all trading decisions; Engine executes. 4% cash target, sell lowest-conf positions | Jan 2026 |
| Confidence-based BUY prioritization | Higher confidence signals get priority when cash limited; prevents arbitrary ordering | Jan 2026 |
| DRY refactoring (Template Method) | 380+ lines removed, 75% reduction in main function; improves testability and maintainability | Jan 2026 |
| ExecutionResult pattern | State mutations returned, not applied directly; cleaner separation of concerns | Jan 2026 |

---

## When User Asks for Out-of-Scope Work
Respond: "That's Phase [X] work. Current phase is Phase 4 (Live Trading Hardening). Should I add it to the roadmap, or is there a simpler version that fits current phase?"
