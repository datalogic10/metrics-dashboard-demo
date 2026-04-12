// Data Summary panel — collapsible debug/info grid under the chart.
// Shows query state, filter context, render timings, row counts.
// Extracted from Analyzer_Demo.js.

export function DataSummaryPanel({
  styles,
  showDataSummary, setShowDataSummary,
  dataFrequency, metric, view, dateRange,
  liveRowCount, filteredData, periods,
  FILTER_CONFIG, formatFilterName,
  getShortFilterContext, formatMetric, calculateMetric,
  displayedInsights,
  filterTimeRef, renderStartTime, renderCountRef,
  cleanedQueryData,
}) {
  return (
    <div style={styles.summaryContainer}>
      <h4 style={styles.summaryTitle} onClick={() => setShowDataSummary(!showDataSummary)}>
        <span style={{ fontSize: "12px" }}>
          {showDataSummary ? "▼" : "▶"}
        </span>
        Data Summary
      </h4>
      {showDataSummary && (
        <div style={styles.summaryGrid}>
          <div style={styles.summaryItem}>
            <strong>Date Aggregation:</strong> {dataFrequency}
          </div>
          <div style={styles.summaryItem}>
            <strong>Metric:</strong> {metric}
          </div>
          <div style={styles.summaryItem}>
            <strong>Split By Dimension:</strong> {view}
          </div>
          <div style={styles.summaryItem}>
            <strong>Date Range:</strong> {dateRange}
          </div>
          <div style={styles.summaryItem}>
            <strong>Total Records:</strong>{" "}
            {(liveRowCount || filteredData.length).toLocaleString()}
          </div>
          <div style={styles.summaryItem}>
            <strong>Period Range:</strong>{" "}
            {periods.length > 0
              ? periods[0] + " to " + periods[periods.length - 1]
              : "No data"}
          </div>
          <div style={styles.summaryItem}>
            <strong>Active Filters:</strong>{" "}
            {FILTER_CONFIG.flatMap(({ state, formatValue, key }) => {
              if (state.length === 0) return [];
              return state.map((val) =>
                formatValue ? formatValue(val) : formatFilterName(val)
              );
            }).join(", ") || "None"}
          </div>
          <div style={styles.summaryItem}>
            <strong>Filter Context:</strong> {getShortFilterContext()}
          </div>
          <div style={styles.summaryItem}>
            <strong>Market Size:</strong>{" "}
            {formatMetric(calculateMetric(filteredData))}
          </div>
          <div style={styles.summaryItem}>
            <strong>Solo Insights Found:</strong>{" "}
            {Object.values(displayedInsights.basicInsights).flat().length}
          </div>
          <div style={styles.summaryItem}>
            <strong>Data Filter Time:</strong>{" "}
            {filterTimeRef.current.toFixed(2)}ms
          </div>
          <div style={styles.summaryItem}>
            <strong>Render Time:</strong>{" "}
            {(performance.now() - renderStartTime).toFixed(2)}ms
          </div>
          <div style={styles.summaryItem}>
            <strong>Render Count:</strong> {renderCountRef.current}
          </div>
          <div style={styles.summaryItem}>
            <strong>Raw Data Rows:</strong>{" "}
            {cleanedQueryData.rows
              ? cleanedQueryData.rows.length.toLocaleString()
              : 0}
          </div>
          <div style={styles.summaryItem}>
            <strong>Filtered Rows:</strong>{" "}
            {filteredData.length.toLocaleString()}
          </div>
          <div style={styles.summaryItem}>
            <strong>Cross Insights Found:</strong>{" "}
            {Object.values(displayedInsights.advancedInsights).flat().length}
          </div>
        </div>
      )}
    </div>
  );
}
