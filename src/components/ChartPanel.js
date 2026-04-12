// Chart panel — Plotly chart wrapper plus the controls clustered around it:
// undo button, Top X / category-selection dropdown, trace toggle buttons
// (Values / %Share / %Growth), insight-context banner, and the Overlays menu
// (metric overlays + computed overlays like SMA / forecast). Extracted from
// Analyzer_Demo.js.
//
// PlotlyChart is a global from index.html (React.forwardRef wrapper around
// Plotly.react), so it doesn't need to be imported.

import { InsightContextBanner } from './InsightContextBanner.js';

export function ChartPanel({
  styles, theme, isDarkMode,
  // Undo
  history, handleUndo,
  // Top X / category selection
  view, topX, setTopX,
  showTopXControl, setShowTopXControl,
  selectedCategories, setSelectedCategories,
  categorySearchText, setCategorySearchText,
  filteredCategories, formatFilterName,
  // Trace toggles
  metric, resolveChartType,
  showAllDollarTraces, setShowAllDollarTraces,
  showAllShareTraces, setShowAllShareTraces,
  showAllGrowthTraces, setShowAllGrowthTraces,
  setTraceVisibility,
  // Insight context banner
  insightContext, setInsightContext,
  formatMetric, formatPeriodDate,
  // Overlays menu
  showOverlayMenu, setShowOverlayMenu,
  OVERLAY_CONFIG, activeOverlays, setActiveOverlays,
  availableBaseMetrics, metricOverlays, setMetricOverlays,
  METRIC_OVERLAY_PALETTE, METRIC_LABELS,
  GRAIN_RANK, dataFrequency, periods,
  smaWindow, setSmaWindow,
  forecastHorizon, setForecastHorizon,
  // Plotly chart
  finalChartData, chartLayout, chartRef, handleLegendClick, dateRange,
}) {
  return (
    <div style={styles.chartContainer}>
      {/* Undo Button */}
      <button
        style={{
          ...styles.undoButton,
          ...(history.length === 0 ? styles.undoButtonDisabled : {}),
        }}
        onClick={handleUndo}
        disabled={history.length === 0}
        title="Undo (Go back to previous filters and selections)"
        data-guide="undo-button"
      >
        ⏪
      </button>

      {/* Top X Control - Only show when not empty view */}
      {view !== "Overall" && (
        <div style={{ position: "relative" }} data-topx-control>
          <button
            style={styles.topXControl}
            onClick={() => setShowTopXControl(!showTopXControl)}
            title="Configure category selection"
            data-guide="top-x-control"
          >
            Top {topX}
            {selectedCategories.length > 0 &&
              ` + ${selectedCategories.length}`}
            {" ▼"}
          </button>

          {showTopXControl && (
            <div style={styles.topXControlDropdown}>
              <div style={styles.topXControlHeader}>
                <div style={styles.topXControlTitle}>
                  Category Selection
                </div>
                <button
                  onClick={() => setShowTopXControl(false)}
                  style={{
                    background: "none",
                    border: "none",
                    fontSize: "20px",
                    color: "#6b7280",
                    cursor: "pointer",
                    padding: "0",
                    width: "24px",
                    height: "24px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  ×
                </button>
              </div>

              {/* Top X Input - Always visible */}
              <div>
                <label
                  style={{
                    fontSize: "12px",
                    fontWeight: "500",
                    color: "#6b7280",
                    marginBottom: "4px",
                    display: "block",
                  }}
                >
                  Top X Categories
                </label>
                <input
                  style={styles.topXInput}
                  type="number"
                  value={topX}
                  onChange={(e) =>
                    setTopX(
                      Math.max(
                        0,
                        Math.min(20, parseInt(e.target.value) || 0)
                      )
                    )
                  }
                  min="0"
                  max="20"
                />
              </div>

              {/* Manual Category Selection - Always available, in addition to Top X */}
              <div style={{ marginTop: "16px" }}>
                <div>
                  <label
                    style={{
                      fontSize: "12px",
                      fontWeight: "500",
                      color: "#6b7280",
                      marginBottom: "8px",
                      display: "block",
                    }}
                  >
                    Additional Categories ({selectedCategories.length}{" "}
                    selected)
                    <span
                      style={{
                        fontSize: "11px",
                        color: "#9ca3af",
                        fontWeight: "400",
                        marginLeft: "4px",
                      }}
                    >
                      (in addition to Top {topX})
                    </span>
                  </label>
                  {/* Search Input */}
                  <input
                    style={{
                      ...styles.topXInput,
                      marginBottom: "8px",
                    }}
                    type="text"
                    placeholder="Search categories..."
                    value={categorySearchText}
                    onChange={(e) => setCategorySearchText(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <div style={styles.categorySelectionList}>
                    {filteredCategories.length > 0 ? (
                      filteredCategories.map((category) => {
                        const isSelected =
                          selectedCategories.includes(category);
                        return (
                          <div
                            key={category}
                            style={
                              isSelected
                                ? styles.categorySelectionItemSelected
                                : styles.categorySelectionItemUnselected
                            }
                            onClick={() => {
                              if (isSelected) {
                                setSelectedCategories((prev) =>
                                  prev.filter((c) => c !== category)
                                );
                              } else {
                                setSelectedCategories((prev) => [
                                  ...prev,
                                  category,
                                ]);
                              }
                            }}
                          >
                            <input
                              type="checkbox"
                              style={styles.categoryCheckbox}
                              checked={isSelected}
                              onChange={() => {}}
                            />
                            <span style={styles.categoryLabelText}>
                              {formatFilterName(category)}
                            </span>
                          </div>
                        );
                      })
                    ) : (
                      <div style={styles.noCategoriesFound}>
                        No categories found matching "{categorySearchText}"
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Toggle buttons for Values, %Share and %Share Growth traces (only for non-formula metrics) */}
      {view !== "Overall" && resolveChartType(metric) !== "line" && (
        <div
          style={{
            display: "flex",
            gap: "8px",
            marginBottom: "12px",
            alignItems: "center",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <button
            onClick={() => { setShowAllDollarTraces(!showAllDollarTraces); setTraceVisibility({}); }}
            style={{
              padding: "6px 12px",
              backgroundColor: showAllDollarTraces ? "#8b5cf6" : "white",
              color: showAllDollarTraces ? "white" : "#8b5cf6",
              border: "1px solid #8b5cf6",
              borderRadius: "6px",
              fontSize: "12px",
              fontWeight: "500",
              cursor: "pointer",
            }}
          >
            {showAllDollarTraces ? "✓" : ""} Values
          </button>
          <button
            onClick={() => { setShowAllShareTraces(!showAllShareTraces); setTraceVisibility({}); }}
            style={{
              padding: "6px 12px",
              backgroundColor: showAllShareTraces ? "#6366f1" : "white",
              color: showAllShareTraces ? "white" : "#6366f1",
              border: "1px solid #6366f1",
              borderRadius: "6px",
              fontSize: "12px",
              fontWeight: "500",
              cursor: "pointer",
            }}
          >
            {showAllShareTraces ? "✓" : ""} %Share
          </button>
          <button
            onClick={() => { setShowAllGrowthTraces(!showAllGrowthTraces); setTraceVisibility({}); }}
            style={{
              padding: "6px 12px",
              backgroundColor: showAllGrowthTraces ? "#10b981" : "white",
              color: showAllGrowthTraces ? "white" : "#10b981",
              border: "1px solid #10b981",
              borderRadius: "6px",
              fontSize: "12px",
              fontWeight: "500",
              cursor: "pointer",
            }}
          >
            {showAllGrowthTraces ? "✓" : ""} %Growth YoY
          </button>
          <div
            style={{
              width: "100%",
              textAlign: "center",
              fontSize: "11px",
              color: "#6b7280",
              marginTop: "4px",
            }}
          >
            Click buttons to toggle traces
            <br />
            Legend appears when active
          </div>
        </div>
      )}

      {/* Insight Context Banner - Shows drill-down context with excess growth */}
      {insightContext && (
        <InsightContextBanner
          insightContext={insightContext}
          formatMetric={formatMetric}
          formatPeriodDate={formatPeriodDate}
          onClear={() => {
            setInsightContext(null);
          }}
          theme={theme}
          isDarkMode={isDarkMode}
        />
      )}

      {view === "Overall" && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '4px', position: 'relative' }}>
          <button
            onClick={() => setShowOverlayMenu(prev => !prev)}
            style={{
              padding: '4px 10px',
              fontSize: '11px',
              fontWeight: 600,
              borderRadius: '6px',
              border: `1px solid ${isDarkMode ? '#4b5563' : '#d1d5db'}`,
              backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
              color: isDarkMode ? '#d1d5db' : '#374151',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            Overlays
            {(() => { const count = OVERLAY_CONFIG.filter(o => activeOverlays[o.id]).length; return count > 0 ? ` (${count})` : ''; })()}
            <span style={{ fontSize: '8px', marginLeft: '2px' }}>{showOverlayMenu ? '▲' : '▼'}</span>
          </button>
          {showOverlayMenu && (
            <>
              <div style={{ position: 'fixed', inset: 0, zIndex: 999 }} onClick={() => setShowOverlayMenu(false)} />
              <div style={{
                position: 'absolute', top: '100%', right: 0, zIndex: 1000, marginTop: '4px',
                backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
                border: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`,
                borderRadius: '8px', padding: '4px 0', minWidth: '200px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              }}>
                {/* Metric overlays section — base metrics other than the primary */}
                {(() => {
                  const candidates = availableBaseMetrics.filter(m => m !== metric);
                  if (candidates.length === 0) return null;
                  return (
                    <>
                      <div style={{
                        padding: '6px 12px 4px',
                        fontSize: '10px', fontWeight: 700, textTransform: 'uppercase',
                        color: isDarkMode ? '#9ca3af' : '#6b7280',
                        letterSpacing: '0.05em',
                      }}>
                        Overlay Metrics
                      </div>
                      {candidates.map((overlayMetric, idx) => {
                        const isActive = metricOverlays.includes(overlayMetric);
                        const color = METRIC_OVERLAY_PALETTE[idx % METRIC_OVERLAY_PALETTE.length];
                        return (
                          <div key={overlayMetric} style={{ padding: '0 4px' }}>
                            <label style={{
                              display: 'flex', alignItems: 'center', gap: '8px',
                              padding: '6px 8px', cursor: 'pointer', borderRadius: '4px',
                              fontSize: '12px', fontWeight: 500,
                              color: isDarkMode ? '#e5e7eb' : '#374151',
                              backgroundColor: 'transparent',
                              transition: 'background-color 0.1s',
                            }}
                              onMouseEnter={e => { e.currentTarget.style.backgroundColor = isDarkMode ? '#374151' : '#f3f4f6'; }}
                              onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                            >
                              <input
                                type="checkbox"
                                checked={isActive}
                                onChange={() => setMetricOverlays(prev =>
                                  prev.includes(overlayMetric)
                                    ? prev.filter(m => m !== overlayMetric)
                                    : [...prev, overlayMetric]
                                )}
                                style={{ accentColor: color, cursor: 'pointer' }}
                              />
                              <span style={{
                                width: '10px', height: '10px', borderRadius: '50%',
                                backgroundColor: color, flexShrink: 0,
                              }} />
                              <span>{METRIC_LABELS[overlayMetric] || overlayMetric}</span>
                            </label>
                          </div>
                        );
                      })}
                      <div style={{
                        padding: '2px 12px 6px',
                        fontSize: '10px', fontStyle: 'italic',
                        color: isDarkMode ? '#6b7280' : '#9ca3af',
                      }}>
                        Rescaled to primary metric; hover shows real values
                      </div>
                      <div style={{
                        height: '1px', margin: '4px 8px',
                        backgroundColor: isDarkMode ? '#374151' : '#e5e7eb',
                      }} />
                    </>
                  );
                })()}
                {OVERLAY_CONFIG.map(overlay => {
                  const isActive = !!activeOverlays[overlay.id];
                  const grainTooCoarse = overlay.minGrain && GRAIN_RANK[overlay.minGrain] < GRAIN_RANK[dataFrequency];
                  const lookbackNeeded = overlay.lookback && overlay.lookback[dataFrequency];
                  const insufficientData = lookbackNeeded && periods.length <= lookbackNeeded;
                  const isDisabled = grainTooCoarse || insufficientData;
                  const disabledReason = grainTooCoarse
                    ? `Not available in ${dataFrequency} grain`
                    : insufficientData ? `Needs ${lookbackNeeded + 1}+ ${dataFrequency.toLowerCase()} periods` : '';
                  return (
                    <div key={overlay.id} style={{ padding: '0 4px' }} title={isDisabled ? disabledReason : ''}>
                      <label
                        style={{
                          display: 'flex', alignItems: 'center', gap: '8px',
                          padding: '6px 8px', cursor: isDisabled ? 'default' : 'pointer', borderRadius: '4px',
                          fontSize: '12px', fontWeight: 500,
                          color: isDisabled ? (isDarkMode ? '#6b7280' : '#9ca3af') : (isDarkMode ? '#e5e7eb' : '#374151'),
                          backgroundColor: 'transparent',
                          opacity: isDisabled ? 0.5 : 1,
                          transition: 'background-color 0.1s',
                        }}
                        onMouseEnter={e => { if (!isDisabled) e.currentTarget.style.backgroundColor = isDarkMode ? '#374151' : '#f3f4f6'; }}
                        onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                      >
                        <input
                          type="checkbox" checked={isActive && !isDisabled}
                          disabled={isDisabled}
                          onChange={() => setActiveOverlays(prev => ({ ...prev, [overlay.id]: !prev[overlay.id] }))}
                          style={{ accentColor: overlay.color, cursor: isDisabled ? 'default' : 'pointer' }}
                        />
                        <span style={{
                          width: '10px', height: '10px', borderRadius: '50%',
                          backgroundColor: isDisabled ? (isDarkMode ? '#4b5563' : '#d1d5db') : overlay.color, flexShrink: 0,
                        }} />
                        <span>{overlay.label}</span>
                        {overlay.isSMA && isActive && (
                          <input
                            type="number" min={2} max={52} value={smaWindow}
                            onClick={e => e.stopPropagation()}
                            onChange={e => setSmaWindow(Math.max(2, Math.min(52, parseInt(e.target.value) || 3)))}
                            style={{
                              width: '36px', padding: '1px 3px', fontSize: '11px', borderRadius: '4px',
                              border: `1px solid ${isDarkMode ? '#4b5563' : '#d1d5db'}`, textAlign: 'center',
                              backgroundColor: isDarkMode ? '#111827' : '#f9fafb',
                              color: isDarkMode ? '#f3f4f6' : '#111827',
                              outline: 'none', marginLeft: 'auto',
                            }}
                          />
                        )}
                        {overlay.isForecast && isActive && (
                          <input
                            type="number" min={1} max={12} value={forecastHorizon}
                            onClick={e => e.stopPropagation()}
                            onChange={e => setForecastHorizon(Math.max(1, Math.min(12, parseInt(e.target.value) || 3)))}
                            style={{
                              width: '36px', padding: '1px 3px', fontSize: '11px', borderRadius: '4px',
                              border: `1px solid ${isDarkMode ? '#4b5563' : '#d1d5db'}`, textAlign: 'center',
                              backgroundColor: isDarkMode ? '#111827' : '#f9fafb',
                              color: isDarkMode ? '#f3f4f6' : '#111827',
                              outline: 'none', marginLeft: 'auto',
                            }}
                          />
                        )}
                      </label>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      )}

      <PlotlyChart
        key={`${view}-${metric}-${dataFrequency}-${dateRange}`}
        data={finalChartData}
        layout={chartLayout}
        ref={chartRef}
        onLegendClick={handleLegendClick}
      />
    </div>
  );
}
