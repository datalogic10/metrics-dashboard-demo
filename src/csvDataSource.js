// CSV data source — schema inference, filter extraction, and client-side aggregation.
// Produces output in the same shape as liveConnection.js transforms so both
// CSV and Supabase flow through the same downstream rendering path.

import logger from './logger.js';

// --- Schema inference ---

const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}/;
const QUARTER_RE = /^\d{4}-Q[1-4]$/;

/**
 * Infer column types from CSV headers and sample rows.
 * Returns [{name, udt}] matching Supabase schema RPC shape.
 */
export function inferColumnTypes(headers, sampleRows) {
  return headers.map(name => {
    let allNumeric = true;
    let allDate = true;
    let allBool = true;
    let nonEmpty = 0;

    for (let i = 0; i < sampleRows.length; i++) {
      const val = sampleRows[i][name];
      if (val == null || val === '') continue;
      nonEmpty++;
      if (typeof val === 'boolean') {
        allNumeric = false;
        allDate = false;
        continue;
      }
      if (typeof val === 'number') {
        allBool = false;
        allDate = false;
        continue;
      }
      const s = String(val);
      allBool = false;
      if (allNumeric && isNaN(Number(s))) allNumeric = false;
      if (allDate && !ISO_DATE_RE.test(s) && !QUARTER_RE.test(s)) allDate = false;
    }

    if (nonEmpty === 0) return { name, udt: 'text' };
    if (allBool) return { name, udt: 'bool' };
    if (allNumeric) return { name, udt: 'float8' };
    if (allDate) return { name, udt: 'date' };
    return { name, udt: 'text' };
  });
}

// --- Filter options ---

/**
 * Extract distinct values per dimension column from CSV rows.
 * Returns { column_name: ["val1", "val2", ...] } matching liveFilterOptions shape.
 */
export function buildCsvFilterOptions(rows, dimensionColumns) {
  const sets = {};
  for (let i = 0; i < dimensionColumns.length; i++) {
    sets[dimensionColumns[i]] = new Set();
  }
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    for (let d = 0; d < dimensionColumns.length; d++) {
      const col = dimensionColumns[d];
      const val = row[col];
      if (val != null && val !== '') sets[col].add(val);
    }
  }
  const result = {};
  for (let d = 0; d < dimensionColumns.length; d++) {
    const col = dimensionColumns[d];
    result[col] = Array.from(sets[col]).sort();
  }
  return result;
}

// --- Date bucketing ---

/**
 * Bucket a date string to a period string based on grain.
 * Handles YYYY-MM-DD dates, YYYY-Qn quarters, and YYYY years.
 */
export function bucketDateToGrain(dateStr, grain) {
  if (!dateStr) return null;
  const s = String(dateStr);

  switch (grain) {
    case 'day':
      return s.slice(0, 10); // YYYY-MM-DD

    case 'week': {
      const d = new Date(s.slice(0, 10) + 'T00:00:00');
      const day = d.getDay();
      const diff = day === 0 ? -6 : 1 - day; // Monday
      d.setDate(d.getDate() + diff);
      return d.toISOString().slice(0, 10);
    }

    case 'month':
      return s.slice(0, 7) + '-01'; // YYYY-MM-01

    case 'quarter': {
      const parts = s.slice(0, 10).split('-');
      const mo = parseInt(parts[1], 10);
      return parts[0] + '-Q' + Math.ceil(mo / 3);
    }

    case 'year':
      return s.slice(0, 4); // YYYY

    default:
      return s.slice(0, 7) + '-01';
  }
}

// --- Aggregation helpers ---

function applyOperator(a, b, op) {
  switch (op) {
    case '/': return b !== 0 ? a / b : 0;
    case '*': return a * b;
    case '+': return a + b;
    case '-': return a - b;
    default: return b !== 0 ? a / b : 0;
  }
}

/** Apply a single aggregation to accumulated values */
function finalizeAgg(acc) {
  switch (acc.type) {
    case 'sum': return acc.sum;
    case 'avg': return acc.count > 0 ? acc.sum / acc.count : 0;
    case 'count': return acc.count;
    case 'count_distinct': return acc.set.size;
    case 'min': return acc.min === Infinity ? 0 : acc.min;
    case 'max': return acc.max === -Infinity ? 0 : acc.max;
    default: return acc.sum;
  }
}

function createAcc(type) {
  return { type, sum: 0, count: 0, min: Infinity, max: -Infinity, set: type === 'count_distinct' ? new Set() : null };
}

function addToAcc(acc, val) {
  const n = Number(val) || 0;
  acc.sum += n;
  acc.count += 1;
  if (n < acc.min) acc.min = n;
  if (n > acc.max) acc.max = n;
  if (acc.set) acc.set.add(val);
}

/**
 * Build slot config from metric config for a single metric slot (volume/revenue/derived).
 * Returns { mode, aggType, column, formulaNumAggType, formulaNumColumn, formulaDenAggType, formulaDenColumn, operator }
 */
function slotConfig(metricConfig, prefix) {
  const mode = metricConfig[prefix + 'Mode'] || 'simple';
  if (mode === 'formula') {
    return {
      mode: 'formula',
      numAggType: metricConfig[prefix + 'FormulaNumAggType'] || 'sum',
      numColumn: metricConfig[prefix + 'FormulaNumColumn'],
      denAggType: metricConfig[prefix + 'FormulaDenAggType'] || 'sum',
      denColumn: metricConfig[prefix + 'FormulaDenColumn'],
      operator: metricConfig[prefix + 'FormulaOperator'] || '/',
      multiplier: metricConfig[prefix + 'Multiplier'] || (prefix === 'derived' ? (metricConfig.derivedMultiplier || 1) : 1),
    };
  }
  return {
    mode: 'simple',
    aggType: metricConfig[prefix + 'AggType'] || (metricConfig[prefix + 'Column'] ? 'sum' : 'count'),
    column: metricConfig[prefix + 'Column'],
  };
}

// --- Client-side aggregation ---

/**
 * Filter rows by filter map { column: [values] }.
 * Returns filtered subset.
 */
function filterRows(rows, filters) {
  if (!filters || Object.keys(filters).length === 0) return rows;
  const filterEntries = Object.entries(filters).filter(([, v]) => v && v.length > 0);
  if (filterEntries.length === 0) return rows;

  // Build sets for fast lookup
  const filterSets = filterEntries.map(([col, vals]) => [col, new Set(vals)]);

  const result = [];
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    let pass = true;
    for (let f = 0; f < filterSets.length; f++) {
      const [col, valSet] = filterSets[f];
      if (!valSet.has(row[col])) { pass = false; break; }
    }
    if (pass) result.push(row);
  }
  return result;
}

/** Compute a metric value for a group from its accumulators */
function computeSlotValue(slot, acc, numAcc, denAcc) {
  if (slot.mode === 'formula') {
    const num = finalizeAgg(numAcc);
    const den = finalizeAgg(denAcc);
    return applyOperator(num, den, slot.operator) * (slot.multiplier || 1);
  }
  return finalizeAgg(acc);
}

/**
 * Aggregate CSV rows into period aggregates.
 * config: { metricConfig, grain, dateColumn, filters }
 * Returns { period: { metric1, metric2, metric3 } }
 */
export function aggregateCsvPeriods(rows, config) {
  const { metricConfig, grain, dateColumn, filters } = config;
  const filtered = filterRows(rows, filters);

  const volSlot = slotConfig(metricConfig, 'volume');
  const revSlot = slotConfig(metricConfig, 'revenue');
  const derSlot = slotConfig(metricConfig, 'derived');
  const hasDerived = derSlot.mode === 'formula' || !!metricConfig.derivedAggType || !!metricConfig.derivedColumn;

  // Accumulate per period
  const groups = {};

  for (let i = 0; i < filtered.length; i++) {
    const row = filtered[i];
    const period = bucketDateToGrain(row[dateColumn], grain);
    if (!period) continue;

    if (!groups[period]) {
      groups[period] = {
        vol: createAcc(volSlot.aggType || 'sum'),
        volNum: volSlot.mode === 'formula' ? createAcc(volSlot.numAggType) : null,
        volDen: volSlot.mode === 'formula' ? createAcc(volSlot.denAggType) : null,
        rev: createAcc(revSlot.aggType || 'sum'),
        revNum: revSlot.mode === 'formula' ? createAcc(revSlot.numAggType) : null,
        revDen: revSlot.mode === 'formula' ? createAcc(revSlot.denAggType) : null,
        der: hasDerived && derSlot.mode !== 'formula' ? createAcc(derSlot.aggType || 'sum') : null,
        derNum: derSlot.mode === 'formula' ? createAcc(derSlot.numAggType) : null,
        derDen: derSlot.mode === 'formula' ? createAcc(derSlot.denAggType) : null,
      };
    }

    const g = groups[period];
    if (volSlot.mode === 'formula') {
      addToAcc(g.volNum, row[volSlot.numColumn]);
      addToAcc(g.volDen, row[volSlot.denColumn]);
    } else {
      addToAcc(g.vol, volSlot.column ? row[volSlot.column] : 1);
    }
    if (revSlot.mode === 'formula') {
      addToAcc(g.revNum, row[revSlot.numColumn]);
      addToAcc(g.revDen, row[revSlot.denColumn]);
    } else {
      addToAcc(g.rev, revSlot.column ? row[revSlot.column] : 1);
    }
    if (derSlot.mode === 'formula') {
      addToAcc(g.derNum, row[derSlot.numColumn]);
      addToAcc(g.derDen, row[derSlot.denColumn]);
    } else if (g.der) {
      addToAcc(g.der, derSlot.column ? row[derSlot.column] : 1);
    }
  }

  // Finalize
  const result = {};
  const periods = Object.keys(groups);
  for (let p = 0; p < periods.length; p++) {
    const period = periods[p];
    const g = groups[period];
    const m1 = computeSlotValue(volSlot, g.vol, g.volNum, g.volDen);
    const m2 = computeSlotValue(revSlot, g.rev, g.revNum, g.revDen);
    let m3;
    if (hasDerived) {
      m3 = computeSlotValue(derSlot, g.der, g.derNum, g.derDen);
    } else {
      // Default derived: (10000 * metric2) / metric1
      m3 = m1 > 0 ? (10000 * m2) / m1 : 0;
    }
    result[period] = { metric1: m1, metric2: m2, metric3: m3 };
  }
  return result;
}

/**
 * Aggregate CSV rows into dimension aggregates for a single dimension.
 * config: { metricConfig, grain, dateColumn, filters }
 * Returns { dimColumn: { period: { cat: { m1, m2, m3 } } }, _categoryTotals: { dimColumn: { cat: { m1, m2, m3 } } } }
 */
export function aggregateCsvDimensions(rows, dimColumn, config) {
  const { metricConfig, grain, dateColumn, filters } = config;
  const filtered = filterRows(rows, filters);

  const volSlot = slotConfig(metricConfig, 'volume');
  const revSlot = slotConfig(metricConfig, 'revenue');
  const derSlot = slotConfig(metricConfig, 'derived');
  const hasDerived = derSlot.mode === 'formula' || !!metricConfig.derivedAggType || !!metricConfig.derivedColumn;

  // groups[period][category] = accumulators
  const groups = {};
  // categoryTotals[category] = accumulators (across all periods)
  const catTotals = {};

  function makeAccs() {
    return {
      vol: createAcc(volSlot.aggType || 'sum'),
      volNum: volSlot.mode === 'formula' ? createAcc(volSlot.numAggType) : null,
      volDen: volSlot.mode === 'formula' ? createAcc(volSlot.denAggType) : null,
      rev: createAcc(revSlot.aggType || 'sum'),
      revNum: revSlot.mode === 'formula' ? createAcc(revSlot.numAggType) : null,
      revDen: revSlot.mode === 'formula' ? createAcc(revSlot.denAggType) : null,
      der: hasDerived && derSlot.mode !== 'formula' ? createAcc(derSlot.aggType || 'sum') : null,
      derNum: derSlot.mode === 'formula' ? createAcc(derSlot.numAggType) : null,
      derDen: derSlot.mode === 'formula' ? createAcc(derSlot.denAggType) : null,
    };
  }

  function accumulateRow(accs, row) {
    if (volSlot.mode === 'formula') {
      addToAcc(accs.volNum, row[volSlot.numColumn]);
      addToAcc(accs.volDen, row[volSlot.denColumn]);
    } else {
      addToAcc(accs.vol, volSlot.column ? row[volSlot.column] : 1);
    }
    if (revSlot.mode === 'formula') {
      addToAcc(accs.revNum, row[revSlot.numColumn]);
      addToAcc(accs.revDen, row[revSlot.denColumn]);
    } else {
      addToAcc(accs.rev, revSlot.column ? row[revSlot.column] : 1);
    }
    if (derSlot.mode === 'formula') {
      addToAcc(accs.derNum, row[derSlot.numColumn]);
      addToAcc(accs.derDen, row[derSlot.denColumn]);
    } else if (accs.der) {
      addToAcc(accs.der, derSlot.column ? row[derSlot.column] : 1);
    }
  }

  for (let i = 0; i < filtered.length; i++) {
    const row = filtered[i];
    const period = bucketDateToGrain(row[dateColumn], grain);
    if (!period) continue;
    const cat = row[dimColumn] || 'Unknown';

    if (!groups[period]) groups[period] = {};
    if (!groups[period][cat]) groups[period][cat] = makeAccs();
    accumulateRow(groups[period][cat], row);

    if (!catTotals[cat]) catTotals[cat] = makeAccs();
    accumulateRow(catTotals[cat], row);
  }

  // Finalize into output shape
  function finalizeAccs(accs) {
    const m1 = computeSlotValue(volSlot, accs.vol, accs.volNum, accs.volDen);
    const m2 = computeSlotValue(revSlot, accs.rev, accs.revNum, accs.revDen);
    let m3;
    if (hasDerived) {
      m3 = computeSlotValue(derSlot, accs.der, accs.derNum, accs.derDen);
    } else {
      m3 = m1 > 0 ? (10000 * m2) / m1 : 0;
    }
    return { metric1: m1, metric2: m2, metric3: m3 };
  }

  const dimAggs = {};
  const periods = Object.keys(groups);
  for (let p = 0; p < periods.length; p++) {
    const period = periods[p];
    dimAggs[period] = {};
    const cats = Object.keys(groups[period]);
    for (let c = 0; c < cats.length; c++) {
      dimAggs[period][cats[c]] = finalizeAccs(groups[period][cats[c]]);
    }
  }

  const categoryTotalsOut = {};
  const totalCats = Object.keys(catTotals);
  for (let c = 0; c < totalCats.length; c++) {
    categoryTotalsOut[totalCats[c]] = finalizeAccs(catTotals[totalCats[c]]);
  }

  const result = {};
  result[dimColumn] = dimAggs;
  result._categoryTotals = {};
  result._categoryTotals[dimColumn] = categoryTotalsOut;
  return result;
}

/**
 * Aggregate CSV rows for ALL dimensions at once (for insights).
 * Returns merged dimension aggregates for all provided dimension columns.
 */
export function aggregateAllDimensions(rows, dimensionColumns, config) {
  const merged = {};
  const mergedTotals = {};
  for (let d = 0; d < dimensionColumns.length; d++) {
    const dimCol = dimensionColumns[d];
    const result = aggregateCsvDimensions(rows, dimCol, config);
    merged[dimCol] = result[dimCol];
    if (result._categoryTotals && result._categoryTotals[dimCol]) {
      mergedTotals[dimCol] = result._categoryTotals[dimCol];
    }
  }
  merged._categoryTotals = mergedTotals;
  return merged;
}

// --- Demo metric config ---

export const DEMO_METRIC_CONFIG = {
  volumeColumn: 'volume',
  volumeLabel: 'Gross Volume',
  volumeFormat: '0.0a',
  volumePrefix: '$',
  volumeSuffix: '',
  revenueColumn: 'revenue',
  revenueLabel: 'Net Revenue',
  revenueFormat: '0.0a',
  revenuePrefix: '$',
  revenueSuffix: '',
  derivedMode: 'formula',
  derivedFormulaNumAggType: 'sum',
  derivedFormulaNumColumn: 'revenue',
  derivedFormulaDenAggType: 'sum',
  derivedFormulaDenColumn: 'volume',
  derivedFormulaOperator: '/',
  derivedMultiplier: 10000,
  derivedLabel: 'Margin Rate',
  derivedFormat: '0.0',
  derivedPrefix: '',
  derivedSuffix: ' bps',
  dateColumn: 'reporting_week',
  defaultGrain: 'month',
};
