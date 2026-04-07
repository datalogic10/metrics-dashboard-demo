// Shared chart utility functions — single source of truth for metric config interpretation
// and chart data transformations.
// Used by both Analyzer_Demo.js (main chart) and compareChartBuilder.js (comparison chart).
// All functions are pure: explicit parameters, no React deps.

/**
 * Resolve effective chart type for a metric: "stacked" | "grouped" | "line"
 * In live mode, reads from config with auto-detection. In demo mode, Margin Rate is always line.
 */
export function resolveChartType(metricName, metricConfig) {
  if (metricConfig) {
    const prefix = metricName === 'metric1' ? 'volume' : metricName === 'metric2' ? 'revenue' : 'derived';
    const configuredType = metricConfig[prefix + 'ChartType'] || 'auto';
    if (configuredType !== 'auto') return configuredType;
    const mode = metricConfig[prefix + 'Mode'] || 'aggregation';
    return mode === 'formula' ? 'line' : 'stacked';
  }
  return metricName === 'metric3' ? 'line' : 'stacked';
}

/**
 * Check if a metric is computed via formula (ratio/derived) vs aggregation (sum/count).
 * Used to gate ratio-aware logic: market share, %Share traces, sorting, Rest Combined.
 */
export function isFormulaMetric(metricName, metricConfig) {
  if (metricConfig) {
    const prefix = metricName === 'metric1' ? 'volume' : metricName === 'metric2' ? 'revenue' : 'derived';
    return (metricConfig[prefix + 'Mode'] || 'aggregation') === 'formula';
  }
  return metricName === 'metric3';
}

/**
 * Build metric display labels from config.
 */
export function getMetricLabels(metricConfig) {
  if (metricConfig) {
    return {
      metric1: metricConfig.volumeLabel || 'Metric 1',
      metric2: metricConfig.revenueLabel || 'Metric 2',
      metric3: metricConfig.derivedLabel || 'Margin Rate',
    };
  }
  return { metric1: 'Metric 1', metric2: 'Metric 2', metric3: 'Metric 3' };
}

/**
 * Format a metric value for display using numeral.js and config-driven format/prefix/suffix.
 */
export function formatMetricValue(value, metricName, metricConfig) {
  if (typeof numeral === 'undefined') return String(value);
  if (metricConfig) {
    if (metricName === 'metric1') {
      const formatted = numeral(value).format(metricConfig.volumeFormat);
      return (metricConfig.volumePrefix || '') + formatted + (metricConfig.volumeSuffix || '');
    }
    if (metricName === 'metric2') {
      const formatted = numeral(value).format(metricConfig.revenueFormat);
      return (metricConfig.revenuePrefix || '') + formatted + (metricConfig.revenueSuffix || '');
    }
    if (metricName === 'metric3') {
      const displayValue = (metricConfig.derivedMode !== 'formula' && metricConfig.derivedDivisor)
        ? value / metricConfig.derivedDivisor : value;
      const formatted = numeral(displayValue).format(metricConfig.derivedFormat);
      return (metricConfig.derivedPrefix || '') + formatted + (metricConfig.derivedSuffix || '');
    }
  }
  switch (metricName) {
    case 'metric1': return '$' + numeral(value).format('0.0a');
    case 'metric2': return '$' + numeral(value).format('0.0a');
    case 'metric3': return numeral(value).format('0.0') + ' bps';
    default: return numeral(value).format('0.0a');
  }
}

// --- Chart data transformation helpers ---

/**
 * Get periods to highlight for a given insight (e.g., sudden_drop alerts).
 * @param {Object} insight - Insight object with metadata
 * @param {string[]} periods - All available period strings
 * @returns {string[]} Period strings to highlight
 */
export function getHighlightPeriods(insight, periods) {
  if (!insight || !insight.metadata) return [];

  const { metadata } = insight;
  const periodsToHighlight = [];

  if (metadata.alertType === "sudden_drop" && metadata.period) {
    const periodIndex = periods.indexOf(metadata.period);
    if (periodIndex > 0) {
      periodsToHighlight.push(periods[periodIndex - 1]);
      periodsToHighlight.push(periods[periodIndex]);
    } else if (periodIndex === 0) {
      periodsToHighlight.push(periods[periodIndex]);
    }
  }

  return periodsToHighlight;
}

/**
 * Apply visual highlighting to chart traces for specified periods.
 * Enlarges markers and changes colors to red for highlighted periods.
 * @param {Object[]} chartData - Plotly trace objects
 * @param {string[]} highlightPeriods - Period strings to highlight
 * @returns {Object[]} Updated trace objects with highlighting applied
 */
export function applyHighlightingToChartData(chartData, highlightPeriods) {
  if (!highlightPeriods || highlightPeriods.length === 0) return chartData;

  return chartData.map((trace) => {
    if (!trace.x || !Array.isArray(trace.x)) return trace;

    const markerSizes =
      trace.marker && trace.marker.size
        ? Array.isArray(trace.marker.size)
          ? [...trace.marker.size]
          : new Array(trace.x.length).fill(trace.marker.size || 6)
        : new Array(trace.x.length).fill(6);

    const markerColors =
      trace.marker && trace.marker.color
        ? Array.isArray(trace.marker.color)
          ? [...trace.marker.color]
          : new Array(trace.x.length).fill(trace.marker.color || "#6366f1")
        : new Array(trace.x.length).fill(trace.color || "#6366f1");

    const lineWidths =
      trace.line && trace.line.width
        ? Array.isArray(trace.line.width)
          ? [...trace.line.width]
          : new Array(trace.x.length).fill(trace.line.width || 2.5)
        : new Array(trace.x.length).fill(2.5);

    const lineColors =
      trace.line && trace.line.color
        ? Array.isArray(trace.line.color)
          ? [...trace.line.color]
          : new Array(trace.x.length).fill(trace.line.color || "#6366f1")
        : new Array(trace.x.length).fill(trace.color || "#6366f1");

    trace.x.forEach((period, index) => {
      if (highlightPeriods.includes(period)) {
        markerSizes[index] =
          (trace.type === "bar" ? 1.3 : 1.8) * (markerSizes[index] || 6);
        markerColors[index] = "#ef4444";

        if (
          trace.type === "scatter" &&
          trace.mode &&
          trace.mode.includes("lines")
        ) {
          lineWidths[index] = (lineWidths[index] || 2.5) * 2;
          lineColors[index] = "#ef4444";
        }
      }
    });

    const updatedTrace = { ...trace };

    if (trace.type === "scatter") {
      if (trace.mode && trace.mode.includes("markers")) {
        updatedTrace.marker = {
          ...trace.marker,
          size: markerSizes,
          color: markerColors,
        };
      }
      if (trace.mode && trace.mode.includes("lines")) {
        updatedTrace.line = {
          ...trace.line,
          width: lineWidths,
          color: lineColors,
        };
      }
    } else if (trace.type === "bar") {
      const currentLineColor =
        (trace.marker && trace.marker.line && trace.marker.line.color) ||
        "rgba(255,255,255,0.3)";
      const currentLineWidth =
        (trace.marker && trace.marker.line && trace.marker.line.width) ||
        0.5;
      const baseLineColor = Array.isArray(currentLineColor)
        ? currentLineColor[0]
        : currentLineColor;
      const baseLineWidth = Array.isArray(currentLineWidth)
        ? currentLineWidth[0]
        : currentLineWidth;

      updatedTrace.marker = {
        ...trace.marker,
        line: {
          ...(trace.marker && trace.marker.line ? trace.marker.line : {}),
          color: trace.x.map((period) =>
            highlightPeriods.includes(period) ? "#ef4444" : baseLineColor
          ),
          width: trace.x.map((period) =>
            highlightPeriods.includes(period) ? 3 : baseLineWidth
          ),
        },
      };
    }

    return updatedTrace;
  });
}

/**
 * Format x-axis tick labels for charts with <= 12 periods.
 * @param {string[]} periodsArray - Period strings
 * @param {Function} formatPeriodDateFn - Function to format a single period string
 * @returns {string[]|undefined} Formatted labels or undefined (let Plotly auto-format)
 */
export function formatXAxisTicks(periodsArray, formatPeriodDateFn) {
  if (periodsArray.length <= 12) {
    return periodsArray.map((period) => formatPeriodDateFn(period));
  }
  return undefined;
}
