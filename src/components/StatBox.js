// StatBox component — displays a single metric card with value, period, and comparison change.
// Extracted from Analyzer_Demo.js for modularity.

import { formatYoYValue as formatYoYValueUtil } from '../metrics.js';

function ChangeDisplay({
  change, changePercent, metricName, label, isActive,
  availableComparisons, activePeriodComparison, setActivePeriodComparison,
  formatMetricValue, styles, theme, isDarkMode,
}) {
  if (change === null) return null;
  const formatYoYValue = formatYoYValueUtil;
  const isPositive = change >= 0;
  const isPositivePercent = changePercent >= 0;
  const trendIcon = isPositive ? (
    <span style={{ fontSize: "14px", lineHeight: "1" }}>↑</span>
  ) : (
    <span style={{ fontSize: "14px", lineHeight: "1" }}>↓</span>
  );

  const comparisonMapping = {
    "52W": "YoY", YoY: "YoY", MoM: "MoM", QoQ: "QoQ", WoW: "WoW", DoD: "DoD",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "4px", alignItems: "center" }}>
      <div style={styles.changeContainer}>
        <span style={{
          ...styles.changeValue,
          color: isActive ? (isPositive ? theme.successText : theme.dangerText) : theme.textQuaternary,
        }}>
          {trendIcon}
          {isPositive ? "+" : ""}
          {formatMetricValue(change, metricName)}
        </span>
        {changePercent !== null && (
          <span style={{
            ...styles.changePercent,
            backgroundColor: isActive
              ? (isPositivePercent ? (isDarkMode ? "rgba(16, 185, 129, 0.2)" : "#d1fae5") : (isDarkMode ? "rgba(239, 68, 68, 0.2)" : "#fee2e2"))
              : theme.bgQuaternary,
            color: isActive
              ? (isPositivePercent ? (isDarkMode ? "#6ee7b7" : "#065f46") : (isDarkMode ? "#fca5a5" : "#991b1b"))
              : theme.textQuaternary,
            border: `1px solid ${isActive
              ? (isPositivePercent ? (isDarkMode ? "rgba(16, 185, 129, 0.4)" : "#a7f3d0") : (isDarkMode ? "rgba(239, 68, 68, 0.4)" : "#fecaca"))
              : theme.borderPrimary}`,
          }}>
            {formatYoYValue(changePercent)} {label}
          </span>
        )}
      </div>
      {/* Carousel dots */}
      {availableComparisons.length > 1 && (
        <div style={{ display: "flex", gap: "6px", justifyContent: "center", marginTop: "2px" }}>
          {availableComparisons.map((comp) => {
            const mappedComp = comparisonMapping[comp] || comp;
            const isActiveDot =
              activePeriodComparison === mappedComp ||
              (mappedComp === "YoY" && comp === "52W" && activePeriodComparison === "YoY");
            return (
              <div
                key={comp}
                title={comp}
                onClick={(e) => {
                  e.stopPropagation();
                  setActivePeriodComparison(mappedComp);
                }}
                style={{
                  width: "6px", height: "6px", borderRadius: "50%",
                  backgroundColor: isActiveDot ? "#6366f1" : "#d1d5db",
                  cursor: "pointer", transition: "all 0.2s ease",
                  border: isActiveDot ? "2px solid #4f46e5" : "1px solid #9ca3af",
                }}
                onMouseEnter={(e) => {
                  if (!isActiveDot) {
                    e.currentTarget.style.backgroundColor = "#9ca3af";
                    e.currentTarget.style.transform = "scale(1.2)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActiveDot) {
                    e.currentTarget.style.backgroundColor = "#d1d5db";
                    e.currentTarget.style.transform = "scale(1)";
                  }
                }}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

export function StatBox({
  metricName, metricStatData, isActive, accentColor,
  dataFrequency, periodChangeLabel, displayLabel,
  activePeriodComparison, setActivePeriodComparison,
  setMetric, setInsightContext, formatMetricValue,
  styles, theme, isDarkMode,
}) {
  displayLabel = displayLabel || metricName;
  const periodLabel =
    dataFrequency === "Daily" ? "Last day"
    : dataFrequency === "Weekly" ? "Last week"
    : dataFrequency === "Monthly" ? "Last month"
    : dataFrequency === "Quarterly" ? "Last quarter"
    : dataFrequency === "Yearly" ? "Last year"
    : "Latest";

  const availableComparisons =
    dataFrequency === "Daily" ? ["YoY", "DoD"]
    : dataFrequency === "Weekly" ? ["52W", "WoW"]
    : dataFrequency === "Monthly" ? ["YoY", "MoM"]
    : dataFrequency === "Quarterly" ? ["YoY", "QoQ"]
    : ["YoY"];

  let changeValue, changePercentValue, comparisonLabel;
  const useYoY = activePeriodComparison === "YoY" || activePeriodComparison === "52W";
  if (useYoY) {
    changeValue = metricStatData.yoyAbsoluteChange;
    changePercentValue = metricStatData.yoyChange;
    comparisonLabel = dataFrequency === "Weekly" ? "52W" : "YoY";
  }
  if (!useYoY || changeValue === null) {
    if (metricStatData.change !== null) {
      changeValue = metricStatData.change;
      changePercentValue = metricStatData.changePercent;
      comparisonLabel = periodChangeLabel;
    }
  }

  return (
    <div
      key={metricName}
      style={{
        ...styles.statBox,
        ...(isActive ? styles.statBoxActive : styles.statBoxInactive),
        ...(isActive && { borderColor: accentColor }),
      }}
      onClick={() => {
        setMetric(metricName);
        setInsightContext(null);
      }}
    >
      {isActive && (
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: "4px",
          backgroundColor: accentColor,
        }} />
      )}
      <div style={styles.statBoxLeft}>
        <div style={{ ...styles.statTitle, color: isActive ? accentColor : "#6b7280" }}>
          {periodLabel} {displayLabel}
        </div>
        <div style={{ ...styles.statValue, color: isActive ? accentColor : "#9ca3af" }}>
          {formatMetricValue(metricStatData.lastValue, metricName)}
        </div>
        <div style={styles.statPeriod}>
          <span style={{ fontSize: "10px" }}>📅</span>
          {metricStatData.lastPeriod}
        </div>
      </div>
      <div style={styles.statBoxRight}>
        <ChangeDisplay
          change={changeValue}
          changePercent={changePercentValue}
          metricName={metricName}
          label={comparisonLabel}
          isActive={isActive}
          availableComparisons={availableComparisons}
          activePeriodComparison={activePeriodComparison}
          setActivePeriodComparison={setActivePeriodComparison}
          formatMetricValue={formatMetricValue}
          styles={styles}
          theme={theme}
          isDarkMode={isDarkMode}
        />
      </div>
    </div>
  );
}
