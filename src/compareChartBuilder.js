/**
 * Compare Chart Builder — Pure functions for building comparison chart traces.
 *
 * Reconstructs charts from captured config + base data, reusing the same logic
 * as the main chart pipeline. This ensures comparison charts always match the
 * main chart (y2 axes, text annotations, colors, etc.) without duplication.
 *
 * Data flow:
 *   1. addCompareCard captures config + base (unfiltered) aggregates
 *   2. buildCardTraces() filters periods by comparison date range,
 *      then builds traces identical to the main chart
 *   3. buildComparisonChart() combines multiple cards into overlay or side-by-side
 */

import {
  getDimAggMetric,
  calculatePercentageChange,
  capYoYForDisplay,
  formatYoYValue,
  OVERLAY_CONFIG,
  GRAIN_RANK,
  calculatePeriodChange,
  calculateSMA,
} from './metrics.js';
import { getCategoryColor } from './theme.js';

// --- Config-derived helpers (replicate useCallback logic as pure functions) ---

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

export function isFormulaMetric(metricName, metricConfig) {
  if (metricConfig) {
    const prefix = metricName === 'metric1' ? 'volume' : metricName === 'metric2' ? 'revenue' : 'derived';
    return (metricConfig[prefix + 'Mode'] || 'aggregation') === 'formula';
  }
  return metricName === 'metric3';
}

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

function formatMetricValue(value, metricName, metricConfig) {
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

// --- Period filtering ---

export function filterPeriodsByDateRange(allPeriods, dateRange) {
  if (!dateRange || dateRange === 'All') return allPeriods;
  const now = new Date();
  const toDateStr = (d) => d.getFullYear() + '-' + (d.getMonth() + 1).toString().padStart(2, '0') + '-' + d.getDate().toString().padStart(2, '0');
  const daysAgo = (days) => { const d = new Date(now); d.setDate(d.getDate() - days); return toDateStr(d); };
  const monthsAgo = (months) => { const d = new Date(now); d.setMonth(d.getMonth() - months); return toDateStr(d); };
  const yearStart = now.getFullYear() + '-01-01';

  let cutoff;
  switch (dateRange) {
    case '7D': cutoff = daysAgo(7); break;
    case '14D': cutoff = daysAgo(14); break;
    case '30D': cutoff = daysAgo(30); break;
    case 'QTD': cutoff = monthsAgo(3); break;
    case 'YTD': cutoff = yearStart; break;
    case '1Y': cutoff = daysAgo(365); break;
    default: return allPeriods;
  }

  const periodToDate = (p) => {
    if (p.includes('W')) return p.replace('W', '-W');
    if (p.length === 7) return p + '-01';
    if (p.length === 4) return p + '-01-01';
    return p;
  };
  return allPeriods.filter(p => periodToDate(p) >= cutoff);
}

function filterAggregates(baseAggregates, periodsSet) {
  const result = {};
  for (const period in baseAggregates) {
    if (periodsSet.has(period)) result[period] = baseAggregates[period];
  }
  return result;
}

function filterDimensionAggregates(baseDimAggs, periodsSet) {
  const result = {};
  const categoryTotals = {};
  for (const col in baseDimAggs) {
    if (col === '_categoryTotals') continue;
    result[col] = {};
    categoryTotals[col] = {};
    for (const period in baseDimAggs[col]) {
      if (!periodsSet.has(period)) continue;
      result[col][period] = baseDimAggs[col][period];
      for (const cat in baseDimAggs[col][period]) {
        const agg = baseDimAggs[col][period][cat];
        if (!categoryTotals[col][cat]) categoryTotals[col][cat] = { metric1: 0, metric2: 0 };
        categoryTotals[col][cat].metric1 += agg.metric1 || 0;
        categoryTotals[col][cat].metric2 += agg.metric2 || 0;
      }
    }
  }
  // Compute metric3 for category totals
  for (const col in categoryTotals) {
    for (const cat in categoryTotals[col]) {
      const t = categoryTotals[col][cat];
      t.metric3 = t.metric1 > 0 ? (10000 * t.metric2) / t.metric1 : 0;
    }
  }
  result._categoryTotals = categoryTotals;
  return result;
}

// --- Card trace builder (mirrors main chart pipeline) ---

/**
 * Build chart traces for a single compare card.
 * @param {Object} card - Compare card with config + base data
 * @param {string} dateRange - Date range to filter periods
 * @returns {{ traces: Array, periods: Array, chartType: string, yAxisTitle: string }}
 */
export function buildCardTraces(card, dateRange) {
  const { metric, view, topX, selectedCategories, dataFrequency,
    metricConfig, viewConfig, categoryColorMap: cardColorMap,
    activeOverlays, smaWindow,
    periodAggregates: basePeriodAggs, dimensionAggregates: baseDimAggs } = card;

  const allPeriods = Object.keys(basePeriodAggs).sort();
  const periods = filterPeriodsByDateRange(allPeriods, dateRange);
  const periodsSet = new Set(periods);

  const periodAggs = filterAggregates(basePeriodAggs, periodsSet);
  const dimAggs = filterDimensionAggregates(baseDimAggs, periodsSet);

  const labels = getMetricLabels(metricConfig);
  const chartType = resolveChartType(metric, metricConfig);
  const isFormula = isFormulaMetric(metric, metricConfig);
  const fmtValue = (v) => formatMetricValue(v, metric, metricConfig);

  const traces = [];

  if (view === 'Overall') {
    const barData = periods.map(p => {
      const agg = periodAggs[p];
      return agg ? (agg[metric] || 0) : 0;
    });

    if (chartType === 'line') {
      traces.push({
        type: 'scatter', mode: 'lines+markers',
        x: periods, y: barData,
        name: labels[metric] || metric,
        line: { width: 2.5 },
        marker: { size: 5 },
        customdata: barData.map(fmtValue),
        hovertemplate: '%{customdata}<extra></extra>',
      });
    } else {
      traces.push({
        type: 'bar',
        x: periods, y: barData,
        name: labels[metric] || metric,
        marker: { opacity: 0.85 },
        text: barData.map(fmtValue),
        textposition: 'outside',
        textfont: { size: 11 },
        customdata: barData.map(fmtValue),
        hovertemplate: '%{customdata}<extra></extra>',
      });
    }

    // Overlay traces (YoY, WoW, DoD, SMA change %) on y2
    if (activeOverlays) {
      OVERLAY_CONFIG.forEach(overlay => {
        if (!activeOverlays[overlay.id]) return;
        if (overlay.isForecast) return;

        if (overlay.isSMA) {
          const smaData = calculateSMA(barData, smaWindow || 3);
          traces.push({
            type: 'scatter', mode: 'lines',
            x: periods, y: smaData,
            name: `SMA(${smaWindow || 3})`,
            yaxis: 'y',
            line: { color: overlay.color, width: 2, dash: 'dot' },
            customdata: smaData.map(v => v !== null ? fmtValue(v) : 'N/A'),
            hovertemplate: `SMA(${smaWindow || 3}): %{customdata}<extra></extra>`,
            connectgaps: false,
          });
        } else {
          if (overlay.minGrain && GRAIN_RANK[overlay.minGrain] < GRAIN_RANK[dataFrequency]) return;
          const lookback = overlay.lookback?.[dataFrequency];
          if (!lookback || periods.length <= lookback) return;

          const changeData = periods.map((period, i) => {
            const currentIndex = allPeriods.indexOf(period);
            if (currentIndex === -1) return null;
            return calculatePeriodChange(currentIndex, barData[i], lookback, allPeriods, basePeriodAggs, metric);
          });

          traces.push({
            type: 'scatter', mode: 'lines+markers',
            x: periods, y: changeData.map(capYoYForDisplay),
            name: overlay.label + ' Change %',
            yaxis: 'y2',
            line: { color: overlay.color, width: 2.5 },
            marker: { size: 3, color: overlay.color },
            customdata: changeData.map(formatYoYValue),
            hovertemplate: overlay.label + ' Change: %{customdata}<extra></extra>',
            connectgaps: false,
          });
        }
      });
    }
  } else if (viewConfig) {
    // Dimension view
    const attribute = viewConfig.column;
    const catTotals = (dimAggs._categoryTotals || {})[attribute] || {};
    const attributeValues = Object.keys(catTotals);
    const sorted = attributeValues.map(v => ({
      attrValue: v,
      total: isFormula ? (catTotals[v]?.metric2 || 0) : (catTotals[v]?.[metric] || catTotals[v]?.metric1 || 0),
    })).sort((a, b) => b.total - a.total);

    let topAttributes, restAttributes;
    if (topX > 0) {
      topAttributes = attributeValues;
      restAttributes = [];
    } else {
      const topXCats = sorted.slice(0, topX).map(i => i.attrValue);
      const manualCats = (selectedCategories || []).filter(c => attributeValues.includes(c));
      topAttributes = [...new Set([...topXCats, ...manualCats])];
      restAttributes = attributeValues.filter(v => !topAttributes.includes(v));
    }

    const allCategories = [...topAttributes];
    if (restAttributes.length > 0) allCategories.push('Rest Combined');

    // Period totals for %Share calculation
    const periodTotals = periods.map(p => {
      const agg = periodAggs[p];
      return agg ? (agg[metric] || agg.metric1 || 0) : 0;
    });

    const dimColorMap = (cardColorMap || {})[attribute] || {};

    allCategories.forEach((category, index) => {
      const traceData = periods.map(period => {
        if (category !== 'Rest Combined' || topX > 0) {
          if (topX > 0) {
            const pAgg = dimAggs[attribute]?.[period];
            if (!pAgg || !(category in pAgg)) return null;
          }
          return getDimAggMetric(dimAggs, attribute, period, category, metric);
        }
        if (isFormula) {
          let m1 = 0, m2 = 0;
          restAttributes.forEach(ra => {
            const ca = dimAggs[attribute]?.[period]?.[ra];
            if (ca) { m1 += ca.metric1 || 0; m2 += ca.metric2 || 0; }
          });
          return m1 > 0 ? (10000 * m2) / m1 : 0;
        }
        return restAttributes.reduce((sum, ra) =>
          sum + getDimAggMetric(dimAggs, attribute, period, ra, metric), 0);
      });

      // %Share calculation
      const sharePercentages = traceData.map((value, i) => {
        if (isFormula) {
          const totalM1 = periodAggs[periods[i]]?.metric1 || 0;
          let catM1 = 0;
          if (category === 'Rest Combined' && !(topX > 0)) {
            restAttributes.forEach(ra => { catM1 += dimAggs[attribute]?.[periods[i]]?.[ra]?.metric1 || 0; });
          } else {
            catM1 = dimAggs[attribute]?.[periods[i]]?.[category]?.metric1 || 0;
          }
          return totalM1 > 0 ? (catM1 / totalM1) * 100 : 0;
        }
        return (value !== null && periodTotals[i] > 0) ? (value / periodTotals[i]) * 100 : 0;
      });

      const categoryColor = dimColorMap[category] || getCategoryColor(category, index);

      // Main metric trace
      if (chartType === 'line') {
        traces.push({
          type: 'scatter', mode: 'lines+markers',
          name: `${category} - ${labels[metric] || metric}`,
          x: periods, y: traceData, visible: true,
          line: { color: categoryColor, width: 2.5 },
          marker: { size: 3, color: categoryColor },
          customdata: traceData.map(fmtValue),
          hovertemplate: category + '<br>%{customdata}<extra></extra>',
        });
      } else {
        traces.push({
          type: 'bar',
          name: `${category} - ${labels[metric] || metric}`,
          x: periods, y: traceData, visible: true,
          marker: { color: categoryColor, line: { color: 'rgba(255,255,255,0.3)', width: 0.5 }, opacity: 0.85 },
          text: traceData.map((v, i) => {
            if (v === 0 || v === null) return '';
            const pct = !isFormula ? sharePercentages[i] : 0;
            return fmtValue(v) + (pct > 0 ? '<br>' + pct.toFixed(1) + '%' : '');
          }),
          textposition: 'inside', textfont: { size: 9 }, insidetextanchor: 'middle',
          customdata: traceData.map(fmtValue),
          hovertemplate: category + '<br>%{customdata}<extra></extra>',
        });

        // %Share trace (y2)
        if (!isFormula) {
          traces.push({
            type: 'scatter', mode: 'lines+markers',
            name: `${category} - %Share`,
            x: periods, y: sharePercentages,
            visible: 'legendonly',
            line: { color: categoryColor, width: 2, dash: 'dot' },
            marker: { size: 3, color: categoryColor },
            yaxis: 'y2',
            customdata: sharePercentages.map(s => s != null ? s.toFixed(1) + '%' : ''),
            hovertemplate: `${category} - %Share<br>%{customdata}<extra></extra>`,
          });
        }

        // %Growth YoY trace (y2)
        const yoyData = periods.slice(0, -1).map(currentPeriod => {
          let currentVal = category === 'Rest Combined' && !(topX > 0)
            ? restAttributes.reduce((s, ra) => s + getDimAggMetric(baseDimAggs, attribute, currentPeriod, ra, metric), 0)
            : getDimAggMetric(baseDimAggs, attribute, currentPeriod, category, metric);

          const currentYear = parseInt(currentPeriod.substring(0, 4));
          const prevPeriod = dataFrequency === 'Weekly'
            ? (() => { const idx = allPeriods.indexOf(currentPeriod); return idx >= 52 ? allPeriods[idx - 52] : null; })()
            : currentPeriod.replace(currentYear.toString(), (currentYear - 1).toString());

          if (!prevPeriod || !baseDimAggs[attribute]?.[prevPeriod]) return null;

          let prevVal = category === 'Rest Combined' && !(topX > 0)
            ? restAttributes.reduce((s, ra) => s + getDimAggMetric(baseDimAggs, attribute, prevPeriod, ra, metric), 0)
            : getDimAggMetric(baseDimAggs, attribute, prevPeriod, category, metric);

          return calculatePercentageChange(currentVal, prevVal);
        });
        yoyData.push(null); // pad last period

        traces.push({
          type: 'scatter', mode: 'lines+markers',
          name: `${category} - %Growth YoY`,
          x: periods, y: yoyData.map(capYoYForDisplay),
          visible: 'legendonly',
          line: { color: categoryColor, width: 2 },
          marker: { size: 3, color: categoryColor },
          yaxis: 'y2',
          customdata: yoyData.map(formatYoYValue),
          hovertemplate: `${category} - %Growth YoY<br>%{customdata}<extra></extra>`,
        });
      }
    });

    // Reference line for line metrics
    if (chartType === 'line') {
      const refData = periods.map(p => periodAggs[p]?.[metric] || 0);
      traces.push({
        type: 'scatter', mode: 'lines+markers',
        x: periods, y: refData,
        name: 'Overall Average',
        line: { color: '#6b7280', width: 2, dash: 'dash' },
        marker: { size: 3, color: '#6b7280' },
        customdata: refData.map(fmtValue),
        hovertemplate: 'Overall Average: %{customdata}<extra></extra>',
      });
    }
  }

  return {
    traces,
    periods,
    chartType,
    hasY2: traces.some(t => t.yaxis === 'y2'),
    yAxisTitle: labels[metric] || metric,
  };
}

// --- Comparison chart layout builder ---

const COMPARE_CARD_COLORS = ['#3b82f6', '#10b981', '#f59e0b'];

function hexToRgb(hex) {
  return [parseInt(hex.slice(1, 3), 16), parseInt(hex.slice(3, 5), 16), parseInt(hex.slice(5, 7), 16)];
}

function makeShade(baseRgb, index, total) {
  const factor = total <= 1 ? 0 : index / (total + 1);
  return `rgb(${Math.round(baseRgb[0] + (255 - baseRgb[0]) * factor * 0.6)},${Math.round(baseRgb[1] + (255 - baseRgb[1]) * factor * 0.6)},${Math.round(baseRgb[2] + (255 - baseRgb[2]) * factor * 0.6)})`;
}

/**
 * Build the full comparison chart (traces + layout) from multiple cards.
 * @param {Array} cards - Compare cards
 * @param {string} compareDateRange - Date range filter for comparison
 * @param {boolean} isDarkMode
 * @returns {{ traces: Array, layout: Object }}
 */
export function buildComparisonChart(cards, compareDateRange, isDarkMode) {
  const isSideBySide = cards.length === 3;

  // Build per-card traces
  const cardResults = cards.map(card => buildCardTraces(card, compareDateRange));

  let traces = [];
  const layout = {
    font: { family: "'Inter', 'Segoe UI', sans-serif", size: 12, color: isDarkMode ? '#e2e8f0' : '#374151' },
    plot_bgcolor: isDarkMode ? '#0f172a' : '#ffffff',
    paper_bgcolor: isDarkMode ? '#1e293b' : '#ffffff',
    legend: { bgcolor: 'transparent', bordercolor: 'transparent', font: { color: isDarkMode ? '#94a3b8' : '#6b7280', size: 11 }, orientation: 'h', y: -0.2 },
    height: isSideBySide ? 500 : 550,
    margin: { l: 80, r: 80, t: 60, b: 120 },
    showlegend: true,
  };

  if (isSideBySide) {
    // 3 cards: side-by-side subplots
    const domains = [[0, 0.30], [0.35, 0.65], [0.70, 1.0]];
    layout.annotations = [];
    layout.barmode = 'group';

    cardResults.forEach((result, i) => {
      const xKey = i === 0 ? 'xaxis' : `xaxis${i + 1}`;
      const yKey = i === 0 ? 'yaxis' : `yaxis${i + 1}`;
      layout[xKey] = { domain: domains[i], type: 'category', tickangle: -45, tickfont: { size: 10, color: isDarkMode ? '#94a3b8' : '#6b7280' } };
      layout[yKey] = { title: { text: result.yAxisTitle, font: { size: 11 } }, tickfont: { size: 10, color: isDarkMode ? '#94a3b8' : '#6b7280' }, gridcolor: isDarkMode ? '#334155' : '#f1f5f9' };

      // Y2 for each subplot if needed
      if (result.hasY2) {
        const y2Key = `yaxis${(i * 2) + 2}`;
        layout[y2Key] = { title: { text: '% Share / %Growth YoY', font: { size: 10 } }, tickfont: { size: 9 }, overlaying: i === 0 ? 'y' : `y${i + 1}`, side: 'right', showgrid: false };
      }

      layout.annotations.push({
        text: `<b>${cards[i].label}</b>`,
        xref: 'paper', yref: 'paper',
        x: (domains[i][0] + domains[i][1]) / 2, y: 1.05,
        showarrow: false, font: { size: 12, color: COMPARE_CARD_COLORS[i] },
      });

      result.traces.forEach(trace => {
        const xRef = i === 0 ? 'x' : `x${i + 1}`;
        const yRef = trace.yaxis === 'y2' ? `y${(i * 2) + 2}` : (i === 0 ? 'y' : `y${i + 1}`);
        const prefixedName = `[${cards[i].label}] ${trace.name}`;
        traces.push({
          ...trace, xaxis: xRef, yaxis: yRef, name: prefixedName,
          showlegend: true, visible: true,
          hovertemplate: prefixedName + '<br>%{customdata}<extra></extra>',
        });
      });
    });
  } else {
    // 2 cards: shared axes overlay with card-colored traces
    const allPeriods = [...new Set([...cardResults[0].periods, ...cardResults[1].periods])].sort();
    const anyHasY2 = cardResults.some(r => r.hasY2);

    layout.xaxis = { type: 'category', tickangle: -45, tickfont: { size: 10, color: isDarkMode ? '#94a3b8' : '#6b7280' } };
    layout.yaxis = {
      title: { text: [...new Set(cardResults.map(r => r.yAxisTitle))].join(' / '), font: { size: 11 } },
      tickfont: { size: 10, color: isDarkMode ? '#94a3b8' : '#6b7280' },
      gridcolor: isDarkMode ? '#334155' : '#f1f5f9',
    };
    if (anyHasY2) {
      layout.yaxis2 = {
        title: { text: '% Share / %Growth YoY', font: { size: 11 } },
        tickfont: { size: 10 }, overlaying: 'y', side: 'right', gridcolor: 'transparent',
        zeroline: true, zerolinecolor: 'rgba(0,0,0,0.05)', zerolinewidth: 1,
      };
    }
    layout.barmode = 'group';

    cardResults.forEach((result, cardIdx) => {
      const groupSuffix = `card${cardIdx}`;
      const baseRgb = hexToRgb(COMPARE_CARD_COLORS[cardIdx]);
      const traceCount = result.traces.length;
      let visibleIdx = 0;

      result.traces.forEach(trace => {
        // Map trace data to unified X-axis
        const mappedY = allPeriods.map(p => {
          const idx = result.periods.indexOf(p);
          return idx >= 0 && trace.y ? trace.y[idx] : null;
        });
        const mappedText = allPeriods.map(p => {
          const idx = result.periods.indexOf(p);
          return idx >= 0 && trace.text ? trace.text[idx] : '';
        });
        const mappedCustomdata = allPeriods.map(p => {
          const idx = result.periods.indexOf(p);
          return idx >= 0 && trace.customdata ? trace.customdata[idx] : '';
        });

        const shadeColor = makeShade(baseRgb, visibleIdx, traceCount);
        visibleIdx++;
        const cardLabel = cards[cardIdx].label;
        const prefixedName = `[${cardLabel}] ${trace.name}`;

        traces.push({
          ...trace,
          x: allPeriods,
          y: mappedY,
          text: Array.isArray(trace.text) ? mappedText : trace.text,
          customdata: mappedCustomdata,
          name: prefixedName,
          showlegend: true,
          visible: true, // Show all traces (including y2) in comparison
          hovertemplate: prefixedName + '<br>%{customdata}<extra></extra>',
          marker: { ...(trace.marker || {}), color: shadeColor, opacity: 0.85 },
          line: { ...(trace.line || {}), color: shadeColor,
            ...(cardIdx > 0 && trace.type === 'scatter' ? { dash: 'dash' } : {}),
          },
          ...(trace.type === 'bar' ? { offsetgroup: groupSuffix, legendgroup: groupSuffix } : {}),
        });
      });
    });
  }

  return { traces, layout };
}

export { COMPARE_CARD_COLORS };
