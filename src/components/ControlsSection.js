// Controls section — Quick Query + StatBoxes + 3x2 control grid + Advanced
// Filters slide-out panel. Extracted from Analyzer_Demo.js as a Fragment
// because topSection and advancedFiltersPanel are sibling elements.
//
// `renderButtonGroup` and `renderDropdownFilter` are callbacks from the parent
// (they close over several pieces of state that haven't been hoisted yet).

import { StatBox } from './StatBox.js';

export function ControlsSection({
  styles, theme, isDarkMode,
  // Quick Query
  queryText, setQueryText,
  isLLMLoading, handleLLMQuery,
  showQueryTooltip, setShowQueryTooltip,
  METRIC_LABELS, DIMENSION_DEFINITIONS, LLM_EXAMPLE_QUESTIONS,
  llmError, llmExplanation, setLlmError, setLlmExplanation,
  // Theme + guide buttons
  setIsDarkMode, showGuideButton, showGuide, skipGuide, startGuide,
  // StatBoxes
  liveMetricConfig, allMetricsStatData,
  metric, setMetric,
  dataFrequency, periodChangeLabel,
  activePeriodComparison, setActivePeriodComparison,
  setInsightContext, formatMetricValue,
  // Controls grid
  savedViews, selectedSavedView, handleLoadSavedView,
  view, setView, VIEW_CONFIG, VIEW_LABEL_OVERRIDES,
  DATE_RANGES, dateRange, setDateRange,
  renderButtonGroup,
  setShowSaveViewModal,
  compareCards, addCompareCard,
  handleShareClick, resetAllFilters,
  // Filter search
  filterSearchInputRef, filterSuggestionsDropdownRef,
  filterSearchText, setFilterSearchText,
  showFilterSuggestions, setShowFilterSuggestions,
  filterDropdownPositionRef, dropdownStyle, setDropdownStyle,
  currentFilterSuggestions, getFilterState, handleFilterSuggestionSelect,
  // Show All advanced filters toggle
  showAdvancedFilters, setShowAdvancedFilters,
  // Date agg
  handleDataFrequencyChange,
  // Advanced filters panel
  FILTER_CONFIG, filterOptionsWithoutAll,
  renderDropdownFilter, formatFilterName,
}) {
  return (
    <>
      {/* Top Section: Ask section first, then Statboxes */}
      <div style={styles.topSection}>
        {/* Natural Language Query Interface */}
        <div style={styles.queryContainer} data-guide="quick-query">
          <div style={styles.queryInputGroup}>
            <div style={styles.queryLabelContainer}>
              <label style={styles.queryLabel}>Quick Query</label>
              <div
                style={styles.queryTooltipIcon}
                onMouseEnter={() => setShowQueryTooltip(true)}
                onMouseLeave={() => setShowQueryTooltip(false)}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  style={styles.block}
                >
                  <circle
                    cx="10"
                    cy="10"
                    r="9"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    fill="none"
                  />
                  <path
                    d="M10 6v.01"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M10 9v5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
                {showQueryTooltip && (
                  <div style={styles.queryTooltip}>
                    <div style={styles.queryTooltipArrow}></div>
                    <div style={styles.fontWeight600}>How to Use</div>
                    <div style={styles.textGray}>
                      {METRIC_LABELS
                        ? `Type a natural language question like "How is ${METRIC_LABELS.metric1 || 'the metric'} trending${DIMENSION_DEFINITIONS.length > 0 ? ` by ${DIMENSION_DEFINITIONS[0].viewName}` : ''}?" or click "Feeling Lucky" for examples.`
                        : 'Type a natural language question like "How is revenue trending in EMEA?" or click "Feeling Lucky" for examples. Press Enter or click "Ask" to query.'}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div style={styles.queryInputWrapper}>
              <input
                type="text"
                value={queryText}
                onChange={(e) => setQueryText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && queryText.trim() && !isLLMLoading) {
                    handleLLMQuery(queryText);
                  }
                }}
                placeholder={METRIC_LABELS
                  ? `Ask a question... e.g. How is ${METRIC_LABELS.metric1 || 'the metric'} trending${DIMENSION_DEFINITIONS.length > 0 ? ` by ${DIMENSION_DEFINITIONS[0].viewName}` : ''}?`
                  : "Ask a question... e.g. How is revenue trending in EMEA?"}
                disabled={isLLMLoading}
                style={{
                  flex: 1,
                  padding: "10px 14px",
                  fontSize: "14px",
                  fontFamily: "'Inter', 'Segoe UI', sans-serif",
                  border: "2px solid #d1d5db",
                  borderRadius: "8px",
                  backgroundColor: isLLMLoading ? "#f3f4f6" : "#fff",
                  minHeight: "44px",
                  outline: "none",
                  color: "#374151",
                }}
                onFocus={(e) => { e.target.style.borderColor = "#6366f1"; }}
                onBlur={(e) => { e.target.style.borderColor = "#d1d5db"; }}
              />
              <button
                style={{
                  ...styles.luckyButton,
                  fontSize: "14px",
                  fontWeight: "600",
                  padding: "10px 18px",
                  minWidth: "160px",
                  opacity: isLLMLoading ? 0.6 : 1,
                }}
                onClick={() => {
                  const example = LLM_EXAMPLE_QUESTIONS[Math.floor(Math.random() * LLM_EXAMPLE_QUESTIONS.length)];
                  setQueryText(example);
                  setLlmError("");
                  setLlmExplanation("");
                }}
                disabled={isLLMLoading}
                title="Generate a random example question"
              >
                Feeling Lucky
              </button>
              <button
                style={{
                  ...styles.queryButton,
                  ...(!queryText.trim() || isLLMLoading
                    ? styles.queryButtonDisabled
                    : {}),
                }}
                onClick={() => {
                  if (queryText.trim() && !isLLMLoading) {
                    handleLLMQuery(queryText);
                  }
                }}
                disabled={!queryText.trim() || isLLMLoading}
              >
                {isLLMLoading ? "Thinking..." : "Ask"}
              </button>
            </div>
            {/* LLM feedback: loading, error, explanation */}
            {(isLLMLoading || llmError || llmExplanation) && (
              <div style={{ marginTop: "8px", fontSize: "13px", fontFamily: "'Inter', 'Segoe UI', sans-serif" }}>
                {isLLMLoading && (
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#6366f1" }}>
                    <div style={{
                      width: "14px", height: "14px", border: "2px solid #6366f1",
                      borderTopColor: "transparent", borderRadius: "50%",
                      animation: "spin 0.8s linear infinite",
                    }} />
                    Interpreting your question...
                  </div>
                )}
                {llmError && (
                  <div style={{ color: "#dc2626", padding: "4px 0" }}>
                    {llmError}
                  </div>
                )}
                {llmExplanation && !isLLMLoading && !llmError && (
                  <div style={{ color: "#6b7280", fontStyle: "italic", padding: "4px 0" }}>
                    {llmExplanation}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Theme Toggle Button */}
          <button
            style={{
              ...styles.helpButton,
              right: showGuideButton ? "100px" : "12px",
              backgroundColor: isDarkMode ? "#4b5563" : theme.accentPrimary,
            }}
            onClick={() => setIsDarkMode(!isDarkMode)}
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDarkMode ? "☀️" : "🌙"}
          </button>

          {/* Guide Me Button */}
          {showGuideButton && (
            <button
              style={{
                ...styles.helpButton,
                backgroundColor: showGuide ? "#ef4444" : "#f77f00",
              }}
              onClick={() => {
                if (showGuide) {
                  skipGuide();
                } else {
                  startGuide();
                }
              }}
              title={
                showGuide ? "Stop Guide" : "Guide Me - Click to start tour"
              }
            >
              {showGuide ? "✕" : "Guide Me"}
            </button>
          )}
        </div>

        <div style={styles.statBoxContainer} data-guide="metric-statboxes">
          {(() => {
            const m = ["metric1"];
            if (liveMetricConfig && (liveMetricConfig.revenueAggType || liveMetricConfig.revenueMode === 'formula')) m.push("metric2");
            if (liveMetricConfig && (liveMetricConfig.derivedAggType || liveMetricConfig.derivedMode === 'formula')) m.push("metric3");
            return m;
          })().map((metricName) => {
            const metricStatData = allMetricsStatData[metricName];
            if (!metricStatData) return null;
            const displayLabel = METRIC_LABELS[metricName] || metricName;
            return (
              <StatBox
                key={metricName}
                metricName={metricName}
                metricStatData={metricStatData}
                isActive={metric === metricName}
                accentColor="#6366f1"
                dataFrequency={dataFrequency}
                periodChangeLabel={periodChangeLabel}
                displayLabel={displayLabel}
                activePeriodComparison={activePeriodComparison}
                setActivePeriodComparison={setActivePeriodComparison}
                setMetric={setMetric}
                setInsightContext={setInsightContext}
                formatMetricValue={formatMetricValue}
                styles={styles}
                theme={theme}
                isDarkMode={isDarkMode}
              />
            );
          })}
        </div>

        {/* Controls - 3 Column, 2 Row Grid Layout */}
        <div style={styles.controlsContainer}>
          <div style={styles.controlsHeader}>
            {/* Grid Layout: 3 columns, 2 rows */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: "20px",
                width: "100%",
              }}
            >
              {/* Column 1 - Row 1: Load Saved View */}
              <div style={styles.controlGroup} data-guide="saved-views">
                <label style={styles.label}>Load Saved View</label>
                {savedViews.length > 0 ? (
                  <select
                    style={styles.select}
                    value={selectedSavedView}
                    onChange={(e) => handleLoadSavedView(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <option value="">-- Select a saved view --</option>
                    {savedViews.map((savedView) => (
                      <option key={savedView.name} value={savedView.name}>
                        {savedView.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  <select style={styles.select} disabled>
                    <option>No saved views</option>
                  </select>
                )}
              </div>

              {/* Column 2 - Row 1: Split By Dimension */}
              <div style={styles.controlGroup} data-guide="view-selector">
                <label style={styles.label}>Split By Dimension</label>
                <select
                  style={styles.select}
                  value={view}
                  onChange={(e) => setView(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                >
                  <option value="Overall">Overall</option>
                  {Object.keys(VIEW_CONFIG).map((viewName) => (
                    <option key={viewName} value={viewName}>
                      {VIEW_LABEL_OVERRIDES[viewName] || viewName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Column 3 - Row 1: Date Range */}
              <div
                style={{ ...styles.controlGroup, marginTop: "24px" }}
                data-guide="date-range"
              >
                {renderButtonGroup(
                  DATE_RANGES,
                  dateRange,
                  setDateRange,
                  styles.dateRangeGroup,
                  styles.dateRangeButton,
                  styles.dateRangeButtonActive
                )}
              </div>

              {/* Column 1 - Row 2: Actions */}
              <div style={styles.controlGroup}>
                <div style={styles.buttonGroup}>
                  <button
                    style={{
                      ...styles.buttonGroupBtn,
                      ...(false ? styles.buttonGroupBtnActive : {}),
                    }}
                    onClick={() => setShowSaveViewModal(true)}
                    title="Save View to Google Sheets"
                    data-guide="save-view"
                  >
                    💾 Save View
                  </button>
                  <button
                    style={{
                      ...styles.buttonGroupBtn,
                      ...(compareCards.length > 0 ? styles.buttonGroupBtnActive : {}),
                      position: "relative",
                    }}
                    onClick={addCompareCard}
                    title={compareCards.length >= 3 ? "Maximum 3 compare cards" : "Add current view to compare dock"}
                    disabled={compareCards.length >= 3}
                    data-guide="comparison"
                  >
                    {compareCards.length > 0 && (
                      <span style={{
                        position: "absolute", top: "-6px", right: "-6px",
                        backgroundColor: "#3b82f6", color: "white",
                        borderRadius: "50%", width: "16px", height: "16px",
                        fontSize: "10px", fontWeight: "700",
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>{compareCards.length}</span>
                    )}
                    📊 Compare
                  </button>
                  <button
                    style={{
                      ...styles.buttonGroupBtn,
                      ...(false ? styles.buttonGroupBtnActive : {}),
                    }}
                    onClick={handleShareClick}
                    title="Share Chart Configuration"
                    data-guide="share-link"
                  >
                    🔗 Share
                  </button>
                  <button
                    style={{
                      ...styles.buttonGroupBtn,
                      backgroundColor: theme.danger,
                      color: "white",
                      border: "none",
                      marginLeft: "4px",
                    }}
                    onClick={resetAllFilters}
                    title="Reset All Filters"
                    data-guide="reset-button"
                  >
                    ↺ Reset
                  </button>
                </div>
              </div>

              {/* Column 2 - Row 2: Filter Search with Show All button */}
              <div style={styles.controlGroup} data-guide="filter-search">
                <div
                  style={{ display: "flex", gap: "8px", alignItems: "center" }}
                >
                  <div style={{ ...styles.filterSearchContainer, flex: 1 }}>
                    <input
                      ref={filterSearchInputRef}
                      style={{
                        ...styles.filterSearchInput,
                        borderColor: showFilterSuggestions
                          ? "#6366f1"
                          : "#d1d5db",
                        width: "100%",
                        boxShadow: showFilterSuggestions
                          ? "0 0 0 3px rgba(99, 102, 241, 0.1)"
                          : "none",
                      }}
                      type="text"
                      placeholder="Search filters..."
                      value={filterSearchText}
                      onChange={(e) => {
                        const newValue = e.target.value;
                        setFilterSearchText(newValue);
                        requestAnimationFrame(() => {
                          if (!showFilterSuggestions && newValue.length > 0) {
                            setShowFilterSuggestions(true);
                          }
                        });
                      }}
                      onFocus={() => {
                        requestAnimationFrame(() => {
                          if (filterSearchInputRef.current) {
                            if (!filterDropdownPositionRef.current) {
                              const rect =
                                filterSearchInputRef.current.getBoundingClientRect();
                              filterDropdownPositionRef.current = {
                                top: `${rect.bottom}px`,
                                left: `${rect.left}px`,
                                width: `${rect.width}px`,
                              };
                            }
                            setDropdownStyle(filterDropdownPositionRef.current);
                          }
                        });
                        setShowFilterSuggestions(true);
                      }}
                      onBlur={(e) => {
                        setTimeout(() => {
                          const activeElement = document.activeElement;
                          if (
                            !filterSuggestionsDropdownRef.current ||
                            !filterSuggestionsDropdownRef.current.contains(
                              activeElement
                            )
                          ) {
                            setShowFilterSuggestions(false);
                            filterDropdownPositionRef.current = null;
                          }
                        }, 50);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Escape") {
                          setShowFilterSuggestions(false);
                          if (filterSearchInputRef.current) {
                            filterSearchInputRef.current.blur();
                          }
                        }
                      }}
                      onClick={(e) => e.stopPropagation()}
                    />

                    {/* Filter Suggestions Dropdown */}
                    {showFilterSuggestions &&
                      Object.keys(currentFilterSuggestions).length > 0 && (
                        <div
                          ref={filterSuggestionsDropdownRef}
                          style={{
                            ...styles.filterSuggestionsDropdown,
                            ...dropdownStyle,
                          }}
                        >
                          {Object.entries(currentFilterSuggestions).map(
                            ([groupType, suggestions]) => (
                              <div key={groupType}>
                                <div style={styles.filterGroupHeader}>
                                  {groupType}
                                </div>
                                {suggestions.map((suggestion, index) => {
                                  const isSelected = getFilterState(
                                    suggestion.filterKey
                                  ).includes(suggestion.value);
                                  return (
                                    <div
                                      key={`${suggestion.type}-${suggestion.value}`}
                                      style={
                                        isSelected
                                          ? styles.filterSuggestionItemSelected
                                          : styles.filterSuggestionItemUnselected
                                      }
                                      onMouseDown={(e) => {
                                        e.preventDefault();
                                        handleFilterSuggestionSelect(
                                          suggestion
                                        );
                                      }}
                                    >
                                      <input
                                        type="checkbox"
                                        style={styles.checkboxInput}
                                        checked={isSelected}
                                        onChange={() =>
                                          handleFilterSuggestionSelect(
                                            suggestion
                                          )
                                        }
                                        onClick={(e) => e.stopPropagation()}
                                        onMouseDown={(e) => e.stopPropagation()}
                                      />
                                      <div style={styles.filterSuggestionName}>
                                        {suggestion.displayName}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            )
                          )}
                        </div>
                      )}

                    {/* No results message */}
                    {showFilterSuggestions &&
                      filterSearchText.length > 0 &&
                      Object.keys(currentFilterSuggestions).length === 0 && (
                        <div
                          style={{
                            ...styles.filterSuggestionsDropdown,
                            ...dropdownStyle,
                          }}
                        >
                          <div
                            style={{
                              ...styles.filterSuggestionItem,
                              cursor: "default",
                            }}
                          >
                            <div style={styles.filterSuggestionName}>
                              No matching filters found for "{filterSearchText}"
                            </div>
                          </div>
                        </div>
                      )}
                  </div>
                  <button
                    style={{
                      ...styles.resetButton,
                      backgroundColor: "transparent",
                      border: `1px solid ${theme.borderSecondary}`,
                      color: theme.textSecondary,
                      fontSize: "12px",
                      padding: "6px 12px",
                      whiteSpace: "nowrap",
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowAdvancedFilters(!showAdvancedFilters);
                    }}
                    title="Show all available filters"
                    data-guide="advanced-filters"
                  >
                    Show All
                  </button>
                </div>
              </div>

              {/* Column 3 - Row 2: Date Aggregation */}
              <div style={styles.controlGroup}>
                {renderButtonGroup(
                  ["Daily", "Weekly", "Monthly", "Quarterly", "Yearly"],
                  dataFrequency,
                  handleDataFrequencyChange,
                  styles.dataFrequencyGroup,
                  styles.dataFrequencyButton,
                  styles.dataFrequencyButtonActive
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Filters Sliding Panel */}
      <div style={styles.advancedFiltersPanel}>
        <div style={styles.advancedFiltersHeader}>
          <h3 style={styles.advancedFiltersTitle}>
            Advanced Filters
            <button
              style={styles.closeButton}
              onClick={() => setShowAdvancedFilters(false)}
            >
              ×
            </button>
          </h3>
        </div>

        <div style={styles.advancedFiltersContent}>
          {/* Reset Button at Top */}
          <div style={styles.filterSection}>
            <button style={styles.modernResetButton} onClick={resetAllFilters}>
              Reset All Filters
            </button>
          </div>

          {/* Filter Settings Section */}
          <div style={styles.filterSection}>
            <h4 style={styles.sectionTitle}>Data Filters</h4>

            {/* DRY: Render all filters using FILTER_CONFIG */}
            {FILTER_CONFIG.map(
              ({ key, label, state, setState, formatValue }) => {
                const options = filterOptionsWithoutAll[key] || [];
                return renderDropdownFilter(
                  key,
                  label,
                  options,
                  state,
                  setState,
                  formatValue || formatFilterName
                );
              }
            )}
          </div>
        </div>
      </div>
    </>
  );
}
