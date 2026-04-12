// Insights panel — left-side column with Solo/Cross tabs and insight
// category sections. Extracted from Analyzer_Demo.js.
//
// Rendering of individual insight items (with pagination + sentiment
// coloring) is delegated to the `renderInsightCategory` callback from
// the parent; this component only owns the tab-shell and config.

function buildInsightsConfig(displayedInsights, theme, isDarkMode) {
  return {
    basic: {
      title: "Single-dimension analysis of trends and patterns",
      emptyMessage:
        "No significant patterns detected with current filters and data range. Try adjusting your date range or filters to see more insights.",
      categories: [
        {
          key: "decomposition",
          title: "Investigation Decomposition",
          tooltipText:
            "Breaks down the investigation to show which sub-segments are driving the observed performance. Explains what's behind the trend or anomaly you're investigating.",
          colors: {
            borderColor: "#10b981",
            backgroundColor: isDarkMode ? "rgba(16, 185, 129, 0.1)" : "rgba(16, 185, 129, 0.08)",
            hoverBackgroundColor: isDarkMode ? "rgba(16, 185, 129, 0.15)" : "#d1fae5",
            hoverBorderColor: "#10b981",
          },
        },
        {
          key: "performanceAlerts",
          title: "Performance Alerts",
          tooltipText: null,
          colors: {
            borderColor: theme.danger,
            backgroundColor: theme.dangerBg,
            hoverBackgroundColor: isDarkMode ? "rgba(239, 68, 68, 0.2)" : "#fee2e2",
            hoverBorderColor: theme.danger,
          },
        },
        {
          key: "overallTrends",
          title: "Overall Trends",
          tooltipText: null,
        },
        {
          key: "categoryTrends",
          title: "Category Trends",
          tooltipText:
            "Above/below avg. compares category growth rate to overall market growth rate. For example, if market grew 20% and category grew 30%, it's 10 percentage points above avg.",
          colors: {
            borderColor: theme.accentPrimary,
            backgroundColor: theme.statBoxActiveBg,
            hoverBackgroundColor: isDarkMode ? "rgba(129, 140, 248, 0.15)" : "#dbeafe",
            hoverBorderColor: theme.accentPrimary,
          },
        },
        {
          key: "shareShifts",
          title: "Market Share Shifts",
          tooltipText:
            "Above/below avg. compares category growth rate to overall market growth rate. For example, if market grew 20% and category grew 30%, it's 10 percentage points above avg.",
          colors: {
            borderColor: isDarkMode ? "#a78bfa" : "#8b5cf6",
            backgroundColor: isDarkMode ? "rgba(139, 92, 246, 0.1)" : "rgba(139, 92, 246, 0.08)",
            hoverBackgroundColor: isDarkMode ? "rgba(139, 92, 246, 0.15)" : "#f3e8ff",
            hoverBorderColor: isDarkMode ? "#a78bfa" : "#8b5cf6",
          },
        },
        {
          key: "marketLeaders",
          title: "Market Leaders",
          tooltipText: null,
        },
      ],
      insights: displayedInsights.basicInsights,
    },
    advanced: {
      title: "Multi-attribute analysis across dimensions",
      emptyMessage:
        "Advanced cross-dimensional insights will be displayed here when sufficient data patterns are detected across multiple attributes. Try using fewer filters to see cross-dimensional patterns.",
      categories: [
        {
          key: "allTimeGrowth",
          title: "Cross Insights Growth",
          tooltipText:
            "Above/below avg. compares segment growth rate to overall market growth rate. For example, if market grew 20% and segment grew 30%, it's 10 percentage points above avg.",
        },
      ],
      insights: displayedInsights.advancedInsights,
    },
  };
}

export function InsightsPanel({
  styles, theme, isDarkMode,
  activeInsightsTab, setActiveInsightsTab,
  displayedInsights,
  loadingInsights,
  getShortFilterContext,
  renderInsightCategory,
}) {
  const insightsConfigMemo = React.useMemo(
    () => buildInsightsConfig(displayedInsights, theme, isDarkMode),
    [displayedInsights, theme, isDarkMode]
  );
  return (
    <div style={styles.leftPanel} data-guide="insights-panel">
      {activeInsightsTab === null ? (
        <div style={styles.insightsTabsContainer}>
          <button
            style={styles.clickForInsightsButton}
            onClick={() => setActiveInsightsTab("basic")}
            onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.9"; }}
            onMouseLeave={(e) => { e.currentTarget.style.opacity = ""; }}
          >
            <span style={{ fontSize: "16px" }}>✨</span>
            Click for Insights
            <span style={{ fontSize: "16px" }}>✨</span>
          </button>
        </div>
      ) : (
        <div style={styles.insightsTabsContainer}>
          <button
            style={{ ...styles.insightsTab, ...(activeInsightsTab === "basic" ? styles.insightsTabActive : {}) }}
            onClick={() => setActiveInsightsTab(activeInsightsTab === "basic" ? null : "basic")}
          >
            Solo Insights
            <span style={styles.tabCount}>
              {Object.values(displayedInsights.basicInsights).flat().length}
            </span>
          </button>
          <button
            style={{ ...styles.insightsTab, ...(activeInsightsTab === "advanced" ? styles.insightsTabActive : {}) }}
            onClick={() => setActiveInsightsTab(activeInsightsTab === "advanced" ? null : "advanced")}
          >
            Cross Insights
            {(activeInsightsTab === "advanced" ||
              Object.values(displayedInsights.advancedInsights).flat().length > 0) && (
              <span style={styles.tabCount}>
                {Object.values(displayedInsights.advancedInsights).flat().length}
              </span>
            )}
          </button>
        </div>
      )}

      {activeInsightsTab && (() => {
        // Memoized so the per-category `colors` objects keep stable references
        // across hover re-renders — otherwise React.memo on InsightItem fails
        // its shallow compare and every item re-renders on every hover.
        const insightsConfig = insightsConfigMemo;
        const config = insightsConfig[activeInsightsTab];
        if (!config) return null;

        if (loadingInsights) {
          return (
            <div style={styles.structuredInsightsContainer}>
              <div style={{
                display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center",
                padding: "40px", color: "#6b7280",
              }}>
                <div style={{
                  width: "40px", height: "40px",
                  border: "4px solid #f3f4f6",
                  borderTop: "4px solid #3b82f6",
                  borderRadius: "50%",
                  animation: "spin 0.8s linear infinite",
                  marginBottom: "16px",
                }} />
                <div style={{ fontSize: "14px", fontWeight: "500" }}>Loading Insights...</div>
                <div style={{ fontSize: "12px", marginTop: "8px" }}>Analyzing patterns in your data</div>
              </div>
            </div>
          );
        }

        const processedInsights = config.insights;
        const totalInsights = Object.values(processedInsights).flat().length;

        return (
          <div style={styles.structuredInsightsContainer}>
            <div style={styles.insightsContext}>{getShortFilterContext()}</div>
            <div style={styles.insightsSubtitle}>{config.title}</div>
            {config.categories.map(({ key, title, tooltipText, colors }) =>
              renderInsightCategory(
                processedInsights[key],
                title,
                key,
                tooltipText,
                colors
              )
            )}
            {totalInsights === 0 && (
              <div style={styles.categorySection}>
                <div style={styles.insightText}>{config.emptyMessage}</div>
              </div>
            )}
          </div>
        );
      })()}
    </div>
  );
}
