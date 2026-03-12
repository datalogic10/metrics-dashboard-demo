// InsightContextBanner — displays drill-down context with breadcrumbs,
// growth metrics, and excess growth indicator.

export function InsightContextBanner({
  insightContext,
  formatMetric,
  formatPeriodDate,
  onClear,
  theme,
  isDarkMode,
}) {
  if (!insightContext) return null;

  const {
    parentLabel,
    parentGrowth,
    parentExcessGrowth,
    marketAvgGrowth,
    parentAbsChange,
    firstValue,
    lastValue,
    periods,
    drillPath,
  } = insightContext;

  const isPositive = parentAbsChange >= 0;
  const changeSign = isPositive ? "+" : "";
  const growthColor = isPositive ? theme.success : theme.danger;
  const excessColor = parentExcessGrowth > 0 ? theme.success : theme.danger;

  return (
    <div
      style={{
        backgroundColor: isDarkMode ? "rgba(99, 102, 241, 0.1)" : "#f0f9ff",
        border: `1px solid ${
          isDarkMode ? "rgba(99, 102, 241, 0.3)" : "#bfdbfe"
        }`,
        borderRadius: "8px",
        padding: "12px 16px",
        marginBottom: "12px",
        fontSize: "13px",
      }}
    >
      {/* Breadcrumb navigation */}
      {drillPath && drillPath.length > 0 && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            marginBottom: "8px",
            fontSize: "12px",
            color: theme.textTertiary,
          }}
        >
          <span>Overall</span>
          {drillPath.map((step, i) => (
            <React.Fragment key={i}>
              <span>{"\u2192"}</span>
              <span>{step.label}</span>
            </React.Fragment>
          ))}
          <span>{"\u2192"}</span>
          <span style={{ fontWeight: "600", color: theme.textPrimary }}>
            {parentLabel}
          </span>
        </div>
      )}

      {/* Current context with excess growth */}
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "16px" }}>{"\uD83D\uDD0D"}</span>
          <span style={{ fontWeight: "600", color: theme.textPrimary }}>
            Investigating: {parentLabel}
          </span>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "4px 12px",
            backgroundColor: isDarkMode ? "rgba(0,0,0,0.2)" : "white",
            borderRadius: "6px",
          }}
        >
          <span style={{ color: growthColor, fontWeight: "700" }}>
            {changeSign}
            {parentGrowth.toFixed(1)}%
          </span>
          {parentExcessGrowth != null && marketAvgGrowth != null && (
            <span
              style={{
                color: excessColor,
                fontWeight: "700",
                fontSize: "11px",
                backgroundColor: isDarkMode
                  ? "rgba(16, 185, 129, 0.1)"
                  : "#d1fae5",
                padding: "2px 6px",
                borderRadius: "4px",
              }}
            >
              {changeSign}
              {parentExcessGrowth.toFixed(1)}pp above{" "}
              {marketAvgGrowth.toFixed(1)}% market
            </span>
          )}
          <span style={{ color: theme.textTertiary }}>
            ({formatMetric(firstValue)} {"\u2192"} {formatMetric(lastValue)})
          </span>
          <span style={{ color: theme.textSecondary, fontWeight: "600" }}>
            {changeSign}
            {formatMetric(parentAbsChange)}
          </span>
        </div>

        <div style={{ color: theme.textTertiary, fontSize: "12px" }}>
          {formatPeriodDate(periods[0])} {"\u2192"}{" "}
          {formatPeriodDate(periods[periods.length - 1])}
        </div>

        <button
          onClick={onClear}
          style={{
            marginLeft: "auto",
            padding: "4px 8px",
            fontSize: "11px",
            backgroundColor: "transparent",
            border: `1px solid ${theme.borderSecondary}`,
            borderRadius: "4px",
            color: theme.textTertiary,
            cursor: "pointer",
          }}
        >
          Clear context
        </button>
      </div>
    </div>
  );
}
