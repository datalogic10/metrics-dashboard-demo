// Pure aggregation functions for building period and dimension aggregates.
// No React dependencies — takes all inputs as parameters.

/**
 * Build period-level aggregates from raw data rows.
 * Structure: { period: { metric1, metric2, metric3 } }
 */
export function buildPeriodAggregates(data, dtField, columns) {
  const aggregates = {};
  const volCol = columns.METRIC1;
  const revCol = columns.METRIC2;
  const n = data.length;

  for (let i = 0; i < n; i++) {
    const row = data[i];
    const period = row[dtField];

    if (!aggregates[period]) {
      aggregates[period] = { metric1: 0, metric2: 0 };
    }

    aggregates[period].metric1 += row[volCol] || 0;
    aggregates[period].metric2 += row[revCol] || 0;
  }

  // Compute derived metric3
  const periods = Object.keys(aggregates);
  for (let p = 0; p < periods.length; p++) {
    const agg = aggregates[periods[p]];
    agg.metric3 =
      agg.metric1 > 0 ? (10000 * agg.metric2) / agg.metric1 : 0;
  }

  return aggregates;
}

/**
 * Build dimension-level aggregates from raw data rows.
 * Structure: { dimColumn: { period: { categoryValue: { metric1, metric2, metric3 } } }, _categoryTotals: {...} }
 * Optimized for 800K+ rows using index-based loops.
 */
export function buildDimensionAggregates(data, dtField, columns, dimensionDefs) {
  const aggregates = {};
  const categoryTotals = {};

  // Pre-filter valid dimensions and pre-allocate structures
  const validDims = [];
  for (let d = 0; d < dimensionDefs.length; d++) {
    const dim = dimensionDefs[d];
    const column = columns[dim.columnKey];
    if (column) {
      validDims.push({ column });
      aggregates[column] = {};
      categoryTotals[column] = {};
    }
  }

  const dimCount = validDims.length;
  if (dimCount === 0) {
    aggregates._categoryTotals = categoryTotals;
    return aggregates;
  }

  const volCol = columns.METRIC1;
  const revCol = columns.METRIC2;
  const n = data.length;

  for (let i = 0; i < n; i++) {
    const row = data[i];
    const period = row[dtField];
    if (!period) continue;

    const volume = row[volCol] || 0;
    const revenue = row[revCol] || 0;

    for (let d = 0; d < dimCount; d++) {
      const { column } = validDims[d];
      const categoryValue = row[column] || "Unknown";

      if (!aggregates[column][period]) {
        aggregates[column][period] = {};
      }

      if (!aggregates[column][period][categoryValue]) {
        aggregates[column][period][categoryValue] = {
          metric1: 0,
          metric2: 0,
        };
      }

      aggregates[column][period][categoryValue].metric1 += volume;
      aggregates[column][period][categoryValue].metric2 += revenue;

      if (!categoryTotals[column][categoryValue]) {
        categoryTotals[column][categoryValue] = {
          metric1: 0,
          metric2: 0,
        };
      }
      categoryTotals[column][categoryValue].metric1 += volume;
      categoryTotals[column][categoryValue].metric2 += revenue;
    }
  }

  // Compute derived metric3 in a single pass over the known dimensions
  for (let d = 0; d < dimCount; d++) {
    const { column } = validDims[d];
    const periods = Object.keys(aggregates[column]);
    for (let p = 0; p < periods.length; p++) {
      const cats = aggregates[column][periods[p]];
      const catKeys = Object.keys(cats);
      for (let c = 0; c < catKeys.length; c++) {
        const agg = cats[catKeys[c]];
        agg.metric3 = agg.metric1 > 0 ? (10000 * agg.metric2) / agg.metric1 : 0;
      }
    }
    const totCats = Object.keys(categoryTotals[column]);
    for (let c = 0; c < totCats.length; c++) {
      const t = categoryTotals[column][totCats[c]];
      t.metric3 = t.metric1 > 0 ? (10000 * t.metric2) / t.metric1 : 0;
    }
  }

  aggregates._categoryTotals = categoryTotals;
  return aggregates;
}
