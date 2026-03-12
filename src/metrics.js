// Pure metric calculation and formatting utilities.
// No React dependencies — all functions take explicit parameters.

/**
 * Calculate percentage change with proper handling for edge cases
 * (zero, negative values, sign changes).
 * Returns percentage change, 9999/-9999 for infinity, or null if cannot calculate.
 */
export function calculatePercentageChange(currentValue, previousValue) {
  if (previousValue === null || previousValue === undefined) return null;
  if (currentValue === null || currentValue === undefined) return null;

  if (previousValue === 0) {
    if (currentValue === 0) return null;
    return currentValue > 0 ? 9999 : -9999;
  }

  const negativeToPositive = previousValue < 0 && currentValue > 0;
  const positiveToNegative = previousValue > 0 && currentValue < 0;
  const bothNegative = previousValue < 0 && currentValue < 0;

  if (negativeToPositive) {
    const absoluteChange = currentValue - previousValue;
    return (absoluteChange / Math.abs(previousValue)) * 100;
  } else if (positiveToNegative) {
    return ((currentValue - previousValue) / previousValue) * 100;
  } else if (bothNegative) {
    const improvement = currentValue - previousValue;
    return (improvement / Math.abs(previousValue)) * 100;
  } else {
    return ((currentValue - previousValue) / previousValue) * 100;
  }
}

/**
 * Calculate growth metrics with direction determination and optional relative growth.
 * @param {number} currentValue
 * @param {number} previousValue
 * @param {number|null} overallGrowthRate - Optional market growth rate for relative comparison
 * @returns {{ growthRate, relativeGrowth, direction, absoluteGrowth }}
 */
export function calculateGrowthMetrics(currentValue, previousValue, overallGrowthRate = null) {
  const growthRate = calculatePercentageChange(currentValue, previousValue);

  const relativeGrowth =
    overallGrowthRate !== null ? growthRate - overallGrowthRate : null;

  let direction;
  if (growthRate === null) {
    direction = "remained flat";
  } else if (growthRate < 0) {
    direction = "declined";
  } else if (relativeGrowth !== null && relativeGrowth > 0) {
    direction = "surged";
  } else if (relativeGrowth !== null && relativeGrowth < 0) {
    direction = "grew only";
  } else {
    direction = growthRate > 0 ? "increased" : "remained flat";
  }

  return {
    growthRate,
    relativeGrowth,
    direction,
    absoluteGrowth: growthRate !== null ? Math.abs(growthRate) : 0,
  };
}

/**
 * Get ISO week number from a date.
 */
export function getWeekNumber(date) {
  const d = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
  );
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
}

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/**
 * Format a period string for display based on dataFrequency.
 * e.g. "2025-06-01" → "Jun'25" (Monthly), "W23'25" (Weekly), "Q2'25" (Quarterly)
 */
export function formatPeriodDate(periodString, dataFrequency) {
  if (!periodString) return periodString;

  if (dataFrequency === "Weekly") {
    if (periodString.includes("W")) {
      const match = periodString.match(/(\d{4})-W(\d{1,2})/);
      if (match) {
        return `W${match[2]}'${match[1].substring(2)}`;
      }
    }
    const dateMatch = periodString.match(/(\d{4})-(\d{2})-(\d{2})/);
    if (dateMatch) {
      const [, year, month, day] = dateMatch;
      const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      if (!isNaN(date.getTime())) {
        return `W${getWeekNumber(date)}'${year.substring(2)}`;
      }
    }
    return periodString;
  } else if (dataFrequency === "Monthly") {
    const dateMatch = periodString.match(/(\d{4})-(\d{2})(?:-(\d{2}))?/);
    if (dateMatch) {
      const [, year, month] = dateMatch;
      return `${MONTH_NAMES[parseInt(month) - 1]}'${year.substring(2)}`;
    }
    return periodString;
  } else if (dataFrequency === "Quarterly") {
    if (periodString.includes("Q")) {
      const match = periodString.match(/(\d{4})-Q(\d)/);
      if (match) {
        return `Q${match[2]}'${match[1].substring(2)}`;
      }
    }
    const dateMatch = periodString.match(/(\d{4})-(\d{2})(?:-(\d{2}))?/);
    if (dateMatch) {
      const [, year, month] = dateMatch;
      const quarter = Math.floor((parseInt(month) - 1) / 3) + 1;
      return `Q${quarter}'${year.substring(2)}`;
    }
    return periodString;
  } else if (dataFrequency === "Yearly") {
    return periodString;
  }

  return periodString;
}

/**
 * Format a YoY percentage value with proper sign and infinity handling.
 * @returns {string} e.g. "+5.3%", "-2.1%", "+∞", "N/A"
 */
export function formatYoYValue(yoyValue) {
  if (yoyValue === null || yoyValue === undefined) return "N/A";
  if (Math.abs(yoyValue) >= 9999) {
    return yoyValue > 0 ? "+∞" : "-∞";
  }
  const sign = yoyValue >= 0 ? "+" : "";
  return sign + yoyValue.toFixed(1) + "%";
}

/**
 * Cap YoY values for chart display (infinity → ±1000).
 */
export function capYoYForDisplay(yoyValue) {
  if (yoyValue === null) return null;
  if (Math.abs(yoyValue) >= 9999) {
    return yoyValue > 0 ? 1000 : -1000;
  }
  return yoyValue;
}

/**
 * Overlay configuration for comparison traces on the Overall chart.
 * lookback: number of entries to look back in sortedBaseDataPeriods for each grain.
 */
export const OVERLAY_CONFIG = [
  { id: 'dod', label: 'DoD', color: '#f97316', lookback: { Daily: 1, Weekly: 1, Monthly: 1, Quarterly: 1, Yearly: 1 } },
  { id: 'wow', label: 'WoW', color: '#8b5cf6', lookback: { Daily: 7, Weekly: 1, Monthly: 4, Quarterly: 4, Yearly: 1 } },
  { id: 'mom', label: 'MoM', color: '#06b6d4', lookback: { Daily: 30, Weekly: 4, Monthly: 1, Quarterly: 1, Yearly: 1 } },
  { id: 'qoq', label: 'QoQ', color: '#ec4899', lookback: { Daily: 90, Weekly: 13, Monthly: 3, Quarterly: 1, Yearly: 1 } },
  { id: 'yoy', label: 'YoY', color: '#a4133c', lookback: { Daily: 365, Weekly: 52, Monthly: 12, Quarterly: 4, Yearly: 1 } },
  { id: 'sma', label: 'SMA', color: '#10b981', isSMA: true, defaultWindow: 3 },
];

/**
 * Generic period-over-period change calculation using index-based lookback.
 */
export function calculatePeriodChange(currentIndex, currentValue, lookbackEntries, sortedPeriods, aggregatesByPeriod, metricName) {
  if (currentIndex < lookbackEntries) return null;
  const previousPeriod = sortedPeriods[currentIndex - lookbackEntries];
  const agg = aggregatesByPeriod[previousPeriod];
  if (!agg) return null;
  const previousValue = agg[metricName];
  return calculatePercentageChange(currentValue, previousValue);
}

/**
 * Simple moving average over barData. Returns null for entries before the window fills.
 */
export function calculateSMA(barData, windowSize) {
  return barData.map((_, i) => {
    if (i < windowSize - 1) return null;
    let sum = 0;
    for (let j = i - windowSize + 1; j <= i; j++) sum += barData[j];
    return sum / windowSize;
  });
}

/**
 * O(1) lookup into dimension aggregates.
 */
export function getDimAggMetric(aggregates, column, period, categoryValue, metricName) {
  const dimAgg = aggregates[column];
  if (!dimAgg) return 0;
  const periodAgg = dimAgg[period];
  if (!periodAgg) return 0;
  const catAgg = periodAgg[categoryValue];
  if (!catAgg) return 0;
  return catAgg[metricName] || 0;
}

/**
 * Get unique non-trivial categories for a column from dimension aggregates.
 */
export function getCategoriesFromAggregates(dimAggs, column, periodsToCheck) {
  const dimAgg = dimAggs[column];
  if (!dimAgg) return [];
  const catSet = new Set();
  for (let p = 0; p < periodsToCheck.length; p++) {
    const periodAgg = dimAgg[periodsToCheck[p]];
    if (!periodAgg) continue;
    const cats = Object.keys(periodAgg);
    for (let c = 0; c < cats.length; c++) {
      const cat = cats[c];
      if (cat && cat !== "Unknown" && cat !== "uncategorized")
        catSet.add(cat);
    }
  }
  return Array.from(catSet);
}

/**
 * Calculate YoY data array for a set of periods.
 * @param {Array} periods
 * @param {Object} dataByPeriod - Map of period → data rows
 * @param {Function} metricCalculator - (rows) => number
 * @param {Function} yoyCalculator - (period, value) => number|null
 * @param {boolean} includeLastPeriod
 * @returns {{ yoyData: Array, lastPeriodYoY: number|null }}
 */
export function calculateYoYDataArray(periods, dataByPeriod, metricCalculator, yoyCalculator, includeLastPeriod = false) {
  const periodsForYoY = includeLastPeriod ? periods : periods.slice(0, -1);
  const yoyDataForPeriods = periodsForYoY.map((period) => {
    const periodRows = dataByPeriod[period] || [];
    const currentValue = metricCalculator(periodRows);
    return yoyCalculator(period, currentValue);
  });

  const yoyData = includeLastPeriod
    ? yoyDataForPeriods
    : [...yoyDataForPeriods, null];

  let lastPeriodYoY = null;
  if (!includeLastPeriod && periods.length > 0) {
    const lastPeriod = periods[periods.length - 1];
    const lastPeriodRows = dataByPeriod[lastPeriod] || [];
    const lastPeriodValue = metricCalculator(lastPeriodRows);
    lastPeriodYoY = yoyCalculator(lastPeriod, lastPeriodValue);
  }

  return { yoyData, lastPeriodYoY };
}
