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
const DATE_REGEX = /(\d{4})-(\d{2})-(\d{2})/;

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
    const dateMatch = periodString.match(DATE_REGEX);
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
  } else if (dataFrequency === "Daily") {
    const dateMatch = periodString.match(DATE_REGEX);
    if (dateMatch) {
      const [, year, month, day] = dateMatch;
      return `${MONTH_NAMES[parseInt(month) - 1]} ${parseInt(day)}'${year.substring(2)}`;
    }
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
// Grain hierarchy index: lower = finer granularity
export const GRAIN_RANK = { Daily: 0, Weekly: 1, Monthly: 2, Quarterly: 3, Yearly: 4 };

export const OVERLAY_CONFIG = [
  { id: 'dod', label: 'DoD', color: '#f97316', minGrain: 'Daily', lookback: { Daily: 1, Weekly: 1, Monthly: 1, Quarterly: 1, Yearly: 1 } },
  { id: 'wow', label: 'WoW', color: '#8b5cf6', minGrain: 'Weekly', lookback: { Daily: 7, Weekly: 1, Monthly: 4, Quarterly: 4, Yearly: 1 } },
  { id: 'mom', label: 'MoM', color: '#06b6d4', minGrain: 'Monthly', lookback: { Daily: 30, Weekly: 4, Monthly: 1, Quarterly: 1, Yearly: 1 } },
  { id: 'qoq', label: 'QoQ', color: '#ec4899', minGrain: 'Quarterly', lookback: { Daily: 90, Weekly: 13, Monthly: 3, Quarterly: 1, Yearly: 1 } },
  { id: 'yoy', label: 'YoY', color: '#a4133c', minGrain: 'Yearly', lookback: { Daily: 365, Weekly: 52, Monthly: 12, Quarterly: 4, Yearly: 1 } },
  { id: 'sma', label: 'SMA', color: '#10b981', isSMA: true, defaultWindow: 3 },
  { id: 'forecast_linear', label: 'Linear', color: '#2563eb', isForecast: true, defaultHorizon: 3 },
  { id: 'forecast_hw', label: 'Seasonal', color: '#d946ef', isForecast: true, defaultHorizon: 3 },
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
  const result = new Array(barData.length);
  let sum = 0;
  for (let i = 0; i < barData.length; i++) {
    sum += barData[i];
    if (i < windowSize - 1) {
      result[i] = null;
    } else {
      if (i >= windowSize) sum -= barData[i - windowSize];
      result[i] = sum / windowSize;
    }
  }
  return result;
}

/**
 * Insert missing daily-grain periods between min and max so chart timelines
 * show real gaps for absent dates instead of squashing adjacent points together.
 *
 * Modes:
 *   - 'none'           — return periods unchanged (current behavior, default)
 *   - 'all-days'       — fill every missing calendar day (crypto, SaaS, etc.)
 *   - 'weekdays-only'  — fill missing Mon–Fri only; do not insert weekend
 *                        placeholders. Existing weekend rows are still kept,
 *                        so this works for both stocks (Mon–Fri) and mixed
 *                        datasets that occasionally have a weekend row.
 *
 * Only operates on YYYY-MM-DD period strings (Daily grain). Other formats
 * (YYYY-MM, YYYY-Wnn, YYYY-QN, YYYY) pass through untouched — coarser
 * grains naturally aggregate gaps away.
 *
 * Weekend = ISO weekend (Sat/Sun). Not configurable for non-Western
 * calendars; intentional simplicity.
 */
/**
 * Compute the set of US stock market holidays (NYSE/NASDAQ) for a given year.
 * Returns a Set of 'YYYY-MM-DD' strings.
 *
 * Covers: New Year's, MLK Day, Presidents' Day, Good Friday, Memorial Day,
 * Juneteenth, Independence Day, Labor Day, Thanksgiving, Christmas.
 * Weekend-observed rules: if a holiday falls on Saturday → Friday off;
 * if on Sunday → Monday off.
 */
function usMarketHolidays(year) {
  const holidays = new Set();

  const observe = (m, d) => {
    const dt = new Date(year, m, d);
    const dow = dt.getDay();
    if (dow === 6) dt.setDate(d - 1);      // Sat → Fri
    else if (dow === 0) dt.setDate(d + 1);  // Sun → Mon
    return dt;
  };

  // Nth weekday of month (weekday: 1=Mon)
  const nthWeekday = (m, weekday, n) => {
    const first = new Date(year, m, 1);
    let d = 1 + ((weekday - first.getDay() + 7) % 7);
    d += (n - 1) * 7;
    return new Date(year, m, d);
  };

  // Last Monday of month
  const lastMonday = (m) => {
    const last = new Date(year, m + 1, 0); // last day of month
    const d = last.getDate() - ((last.getDay() + 6) % 7);
    return new Date(year, m, d);
  };

  // Easter (Anonymous Gregorian algorithm) → Good Friday = Easter - 2
  const a = year % 19, b = Math.floor(year / 100), c = year % 100;
  const d = Math.floor(b / 4), e = b % 4, f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3), h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4), k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const easterMonth = Math.floor((h + l - 7 * m + 114) / 31) - 1; // 0-indexed
  const easterDay = ((h + l - 7 * m + 114) % 31) + 1;
  const goodFriday = new Date(year, easterMonth, easterDay - 2);

  const fmt = (dt) => {
    const yy = dt.getFullYear();
    const mm = String(dt.getMonth() + 1).padStart(2, '0');
    const dd = String(dt.getDate()).padStart(2, '0');
    return `${yy}-${mm}-${dd}`;
  };

  holidays.add(fmt(observe(0, 1)));           // New Year's Day
  holidays.add(fmt(nthWeekday(0, 1, 3)));     // MLK Day (3rd Mon Jan)
  holidays.add(fmt(nthWeekday(1, 1, 3)));     // Presidents' Day (3rd Mon Feb)
  holidays.add(fmt(goodFriday));              // Good Friday
  holidays.add(fmt(lastMonday(4)));           // Memorial Day (last Mon May)
  holidays.add(fmt(observe(5, 19)));          // Juneteenth
  holidays.add(fmt(observe(6, 4)));           // Independence Day
  holidays.add(fmt(nthWeekday(8, 1, 1)));     // Labor Day (1st Mon Sep)
  holidays.add(fmt(nthWeekday(10, 4, 4)));    // Thanksgiving (4th Thu Nov)
  holidays.add(fmt(observe(11, 25)));         // Christmas

  return holidays;
}

// ---------------------------------------------------------------------------
// Tradier market-calendar integration
// Stale-while-revalidate: localStorage gives instant load, Tradier refreshes
// in the background. Past years refresh weekly, current year refreshes daily.
// Falls back to static usMarketHolidays() if no cached or fetched data.
// ---------------------------------------------------------------------------
const LS_KEY = 'tradier_market_closures';   // localStorage key
const STALE_PAST_MS = 7 * 24 * 3600_000;   // past years: refresh weekly
const STALE_CURRENT_MS = 24 * 3600_000;     // current year: refresh daily

function loadClosuresFromStorage() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? JSON.parse(raw) : {};       // { year: { dates: [...], fetchedAt: ms } }
  } catch { return {}; }
}

function saveClosuresToStorage(store) {
  try { localStorage.setItem(LS_KEY, JSON.stringify(store)); } catch {}
}

const _tradierInFlight = {};           // year → Promise<Set>

function fetchTradierYearClosures(year) {
  if (_tradierInFlight[year]) return _tradierInFlight[year];

  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  _tradierInFlight[year] = Promise.all(
    months.map(month =>
      fetch(`https://api.tradier.com/v1/markets/calendar?month=${month}&year=${year}`, {
        headers: { Accept: 'application/json' },
      })
        .then(r => r.ok ? r.json() : null)
        .catch(() => null)
    )
  ).then(results => {
    const closed = [];
    for (const res of results) {
      if (!res?.calendar?.days?.day) continue;
      for (const d of res.calendar.days.day) {
        if (d.status === 'closed') closed.push(d.date);
      }
    }
    delete _tradierInFlight[year];
    if (closed.length === 0) return null;

    // Persist to localStorage
    const store = loadClosuresFromStorage();
    store[year] = { dates: closed, fetchedAt: Date.now() };
    saveClosuresToStorage(store);
    return new Set(closed);
  });

  return _tradierInFlight[year];
}

function isStale(entry, year) {
  if (!entry?.fetchedAt) return true;
  const maxAge = year === new Date().getFullYear() ? STALE_CURRENT_MS : STALE_PAST_MS;
  return Date.now() - entry.fetchedAt > maxAge;
}

/**
 * Read cached market closures synchronously (localStorage + static fallback).
 * Pure read — no network requests. Safe to call in useMemo / render.
 */
export function getCachedMarketClosures(startYear, endYear) {
  const store = loadClosuresFromStorage();
  const closures = new Set();
  for (let y = startYear; y <= endYear; y++) {
    const entry = store[y];
    if (entry?.dates?.length > 0) {
      for (const d of entry.dates) closures.add(d);
    } else {
      for (const d of usMarketHolidays(y)) closures.add(d);
    }
  }
  return closures;
}

/**
 * Refresh stale years from Tradier in the background.
 * Only fires network requests for years whose cache has expired
 * (past years: weekly, current year: daily). Calls onUpdate with
 * the full refreshed Set if any new data arrived.
 */
export function refreshMarketClosures(startYear, endYear, onUpdate) {
  const store = loadClosuresFromStorage();
  const staleYears = [];
  for (let y = startYear; y <= endYear; y++) {
    if (isStale(store[y], y)) staleYears.push(y);
  }
  if (staleYears.length === 0) return;   // everything fresh — no network

  Promise.all(staleYears.map(y => fetchTradierYearClosures(y))).then(results => {
    if (results.some(r => r != null)) {
      onUpdate(getCachedMarketClosures(startYear, endYear));
    }
  });
}

export function fillMissingPeriods(periods, fillMode, marketClosures) {
  if (!fillMode || fillMode === 'none' || !periods || periods.length === 0) return periods;
  const isDaily = /^\d{4}-\d{2}-\d{2}$/.test(periods[0]);
  if (!isDaily) return periods;

  const sorted = [...periods].sort();
  const present = new Set(sorted);
  // Anchor to local midnight to avoid timezone surprises across day boundaries
  const start = new Date(sorted[0] + 'T00:00:00');
  const end = new Date(sorted[sorted.length - 1] + 'T00:00:00');

  // Use provided closures, or fall back to static computation
  let marketHolidays = null;
  if (fillMode === 'trading-days') {
    if (marketClosures && marketClosures.size > 0) {
      marketHolidays = marketClosures;
    } else {
      marketHolidays = new Set();
      for (let y = start.getFullYear(); y <= end.getFullYear(); y++) {
        for (const h of usMarketHolidays(y)) marketHolidays.add(h);
      }
    }
  }

  const out = [];
  const cur = new Date(start);
  while (cur <= end) {
    const dow = cur.getDay(); // 0=Sun, 6=Sat
    const isWeekend = dow === 0 || dow === 6;
    const y = cur.getFullYear();
    const m = String(cur.getMonth() + 1).padStart(2, '0');
    const d = String(cur.getDate()).padStart(2, '0');
    const iso = `${y}-${m}-${d}`;
    const shouldInclude =
      present.has(iso) ||
      fillMode === 'all-days' ||
      (fillMode === 'weekdays-only' && !isWeekend) ||
      (fillMode === 'trading-days' && !isWeekend && !marketHolidays.has(iso));
    if (shouldInclude) out.push(iso);
    cur.setDate(cur.getDate() + 1);
  }
  return out;
}

/**
 * Color palette for metric overlays on the Overall view. Deliberately distinct
 * from OVERLAY_CONFIG colors (DoD/WoW/SMA/etc) and MODERN_COLOR_PALETTE[0]
 * so overlaid metrics don't visually collide with existing traces.
 */
export const METRIC_OVERLAY_PALETTE = ['#0891b2', '#ca8a04', '#7c3aed', '#be123c'];

/**
 * Linearly rescale values into the [targetMin, targetMax] range. Used to fit
 * overlay-metric traces into the primary metric's visible y-range so two
 * metrics with very different magnitudes (e.g. price $150 vs RSI 0–100) can
 * share a single y-axis and be visually compared for correlation-of-movements.
 *
 * Degenerate cases:
 *   - all nulls / empty → all nulls
 *   - all source values equal → all centered at midpoint of target range
 *   - null / non-finite entries pass through as null
 */
export function minMaxRescale(values, targetMin, targetMax) {
  const valid = values.filter(v => v != null && Number.isFinite(v));
  if (valid.length === 0) return values.map(() => null);
  const srcMin = Math.min(...valid);
  const srcMax = Math.max(...valid);
  if (srcMax === srcMin) {
    const mid = (targetMin + targetMax) / 2;
    return values.map(v => (v == null || !Number.isFinite(v) ? null : mid));
  }
  const span = targetMax - targetMin;
  return values.map(v => {
    if (v == null || !Number.isFinite(v)) return null;
    return targetMin + ((v - srcMin) / (srcMax - srcMin)) * span;
  });
}

/**
 * Z-score normalization. Returns values rescaled to mean 0, std 1.
 * Nulls and non-finite values pass through as null.
 * Degenerate cases (single value, zero variance) return zeros.
 */
export function zScore(values) {
  const valid = values.filter(v => v != null && Number.isFinite(v));
  if (valid.length < 2) return values.map(v => (v == null || !Number.isFinite(v) ? null : 0));
  const mean = valid.reduce((a, b) => a + b, 0) / valid.length;
  const variance = valid.reduce((s, v) => s + (v - mean) ** 2, 0) / valid.length;
  const std = Math.sqrt(variance);
  if (std === 0) return values.map(v => (v == null || !Number.isFinite(v) ? null : 0));
  return values.map(v => (v == null || !Number.isFinite(v) ? null : (v - mean) / std));
}

/**
 * Min-max normalization to [0, 1]. Nulls pass through.
 * Degenerate case (all values equal) returns 0.5.
 */
export function minMaxNormalize(values) {
  const valid = values.filter(v => v != null && Number.isFinite(v));
  if (valid.length === 0) return values.map(() => null);
  const min = Math.min(...valid);
  const max = Math.max(...valid);
  if (max === min) return values.map(v => (v == null || !Number.isFinite(v) ? null : 0.5));
  return values.map(v => (v == null || !Number.isFinite(v) ? null : (v - min) / (max - min)));
}

/**
 * Convert hex color to rgba string.
 */
export function hexToRgba(hex, alpha) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

/**
 * Map dataFrequency to natural seasonal cycle length.
 * Returns null for Yearly (no seasonality).
 */
export function detectSeasonalPeriod(dataFrequency) {
  const map = { Daily: 7, Weekly: 52, Monthly: 12, Quarterly: 4 };
  return map[dataFrequency] || null;
}

/**
 * Generate future period strings continuing from the last period in the array.
 * Matches the format used by the existing period strings (categorical x-axis).
 */
export function generateFuturePeriods(periods, dataFrequency, horizon) {
  if (!periods.length) return [];
  const last = periods[periods.length - 1];
  const result = [];

  if (dataFrequency === 'Yearly') {
    const year = parseInt(last);
    for (let i = 1; i <= horizon; i++) result.push(String(year + i));
  } else if (dataFrequency === 'Quarterly') {
    // Format: "YYYY-QN"
    let year = parseInt(last.slice(0, 4));
    let q = parseInt(last.slice(6));
    for (let i = 0; i < horizon; i++) {
      q++;
      if (q > 4) { q = 1; year++; }
      result.push(`${year}-Q${q}`);
    }
  } else if (dataFrequency === 'Monthly') {
    // Format: "YYYY-MM" or "YYYY-MM-DD" — detect from string length
    const isShort = last.length <= 7; // "YYYY-MM"
    let year = parseInt(last.slice(0, 4));
    let month = parseInt(last.slice(5, 7));
    for (let i = 0; i < horizon; i++) {
      month++;
      if (month > 12) { month = 1; year++; }
      const mm = String(month).padStart(2, '0');
      result.push(isShort ? `${year}-${mm}` : `${year}-${mm}-01`);
    }
  } else {
    // Daily or Weekly: increment by 1 or 7 days
    const step = dataFrequency === 'Weekly' ? 7 : 1;
    const d = new Date(last + 'T00:00:00');
    for (let i = 0; i < horizon; i++) {
      d.setDate(d.getDate() + step);
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      result.push(`${y}-${m}-${day}`);
    }
  }
  return result;
}

/**
 * Linear trend forecast via least-squares regression.
 * Returns forecast values, confidence bounds, and MAPE from holdout validation.
 */
export function forecastLinear(values, horizon) {
  const n = values.length;
  if (n < 3) return null;

  // Fit regression on all data
  let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
  for (let i = 0; i < n; i++) {
    sumX += i; sumY += values[i]; sumXY += i * values[i]; sumX2 += i * i;
  }
  const meanX = sumX / n;
  const b = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const a = sumY / n - b * meanX;

  // Standard error of regression
  let sse = 0;
  for (let i = 0; i < n; i++) {
    const residual = values[i] - (a + b * i);
    sse += residual * residual;
  }
  const se = n > 2 ? Math.sqrt(sse / (n - 2)) : 0;
  const sxx = sumX2 - sumX * sumX / n;

  // Forecast with widening prediction intervals
  const forecast = [], upper = [], lower = [];
  for (let h = 1; h <= horizon; h++) {
    const t = n - 1 + h;
    const yHat = a + b * t;
    const interval = 1.96 * se * Math.sqrt(1 + 1 / n + (t - meanX) * (t - meanX) / sxx);
    forecast.push(yHat);
    upper.push(yHat + interval);
    lower.push(Math.max(0, yHat - interval));
  }

  // MAPE via holdout: withhold last few points, refit, measure error
  const holdout = Math.max(1, Math.min(horizon, Math.floor(n / 5)));
  const trainN = n - holdout;
  let tSumX = 0, tSumY = 0, tSumXY = 0, tSumX2 = 0;
  for (let i = 0; i < trainN; i++) {
    tSumX += i; tSumY += values[i]; tSumXY += i * values[i]; tSumX2 += i * i;
  }
  const tB = (trainN * tSumXY - tSumX * tSumY) / (trainN * tSumX2 - tSumX * tSumX);
  const tA = tSumY / trainN - tB * (tSumX / trainN);

  let mapeSum = 0, mapeCount = 0;
  for (let i = trainN; i < n; i++) {
    const predicted = tA + tB * i;
    if (Math.abs(values[i]) > 0.001) {
      mapeSum += Math.abs((values[i] - predicted) / values[i]);
      mapeCount++;
    }
  }
  const mape = mapeCount > 0 ? (mapeSum / mapeCount) * 100 : 0;

  return { forecast, upper, lower, mape };
}

/**
 * Holt-Winters additive triple exponential smoothing.
 * Handles level + trend + seasonality. Falls back to null if insufficient data.
 */
export function forecastHoltWinters(values, horizon, seasonalPeriod) {
  const n = values.length;
  const m = seasonalPeriod;
  if (n < m * 2) return null; // Need at least 2 full seasons

  const alpha = 0.3, beta = 0.1, gamma = 0.3;

  // Initialize: level = mean of first season, trend from first two seasons
  let level = 0;
  for (let i = 0; i < m; i++) level += values[i];
  level /= m;

  let level2 = 0;
  for (let i = m; i < 2 * m; i++) level2 += values[i];
  level2 /= m;
  let trend = (level2 - level) / m;

  const seasonal = new Array(n);
  for (let i = 0; i < m; i++) seasonal[i] = values[i] - level;

  // Run smoothing
  let sse = 0;
  for (let t = m; t < n; t++) {
    const prevLevel = level;
    const prevTrend = trend;
    level = alpha * (values[t] - seasonal[t - m]) + (1 - alpha) * (prevLevel + prevTrend);
    trend = beta * (level - prevLevel) + (1 - beta) * prevTrend;
    seasonal[t] = gamma * (values[t] - level) + (1 - gamma) * seasonal[t - m];

    const fitted = prevLevel + prevTrend + seasonal[t - m];
    sse += (values[t] - fitted) * (values[t] - fitted);
  }

  const residualStd = Math.sqrt(sse / (n - m));

  // Forecast
  const forecast = [], upper = [], lower = [];
  for (let h = 1; h <= horizon; h++) {
    const seasonIdx = n - m + ((h - 1) % m);
    const yHat = level + h * trend + seasonal[seasonIdx];
    const interval = 1.96 * residualStd * Math.sqrt(h);
    forecast.push(yHat);
    upper.push(yHat + interval);
    lower.push(Math.max(0, yHat - interval));
  }

  // MAPE via holdout
  const holdout = Math.max(1, Math.min(horizon, Math.floor(n / 5)));
  const trainN = n - holdout;
  if (trainN < m * 2) return { forecast, upper, lower, mape: 0 }; // Can't validate

  // Refit on training data
  let tLevel = 0;
  for (let i = 0; i < m; i++) tLevel += values[i];
  tLevel /= m;
  let tLevel2 = 0;
  for (let i = m; i < 2 * m; i++) tLevel2 += values[i];
  tLevel2 /= m;
  let tTrend = (tLevel2 - tLevel) / m;
  const tSeasonal = new Array(trainN);
  for (let i = 0; i < m; i++) tSeasonal[i] = values[i] - tLevel;
  for (let t = m; t < trainN; t++) {
    const pl = tLevel;
    tLevel = alpha * (values[t] - tSeasonal[t - m]) + (1 - alpha) * (tLevel + tTrend);
    tTrend = beta * (tLevel - pl) + (1 - beta) * tTrend;
    tSeasonal[t] = gamma * (values[t] - tLevel) + (1 - gamma) * tSeasonal[t - m];
  }

  let mapeSum = 0, mapeCount = 0;
  for (let h = 1; h <= holdout; h++) {
    const sIdx = trainN - m + ((h - 1) % m);
    const predicted = tLevel + h * tTrend + tSeasonal[sIdx];
    const actual = values[trainN + h - 1];
    if (Math.abs(actual) > 0.001) {
      mapeSum += Math.abs((actual - predicted) / actual);
      mapeCount++;
    }
  }
  const mape = mapeCount > 0 ? (mapeSum / mapeCount) * 100 : 0;

  return { forecast, upper, lower, mape };
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
