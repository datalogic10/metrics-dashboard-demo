// Default metric configs per known dataset
export const DEFAULT_METRIC_CONFIGS = {
  fmc_job_metrics: {
    volumeColumn: null,
    revenueColumn: "score",
    volumeLabel: "Total Jobs",
    revenueLabel: "Total Score",
    derivedLabel: "Avg Score",
    volumeFormat: "0,0",
    revenueFormat: "0,0",
    derivedFormat: "0.0",
    volumePrefix: "", volumeSuffix: "",
    revenuePrefix: "", revenueSuffix: "",
    derivedPrefix: "", derivedSuffix: "",
    derivedDivisor: 10000,
    dateColumn: "reporting_dt",
  },
  fmc_conversations: {
    volumeColumn: "message_count",
    revenueColumn: "user_message_count",
    volumeLabel: "Total Messages",
    revenueLabel: "User Messages",
    derivedLabel: "User Msg Rate",
    volumeFormat: "0,0",
    revenueFormat: "0,0",
    derivedFormat: "0.0%",
    volumePrefix: "", volumeSuffix: "",
    revenuePrefix: "", revenueSuffix: "",
    derivedPrefix: "", derivedSuffix: "",
    derivedDivisor: 10000,
    dateColumn: "reporting_dt",
  },
};

// Detect URL format: config (/#/{id}) or demo (no hash)
export function parseUrlRoute() {
  const hash = window.location.hash.replace(/^#\/?/, '');
  if (!hash) return { mode: 'demo' };
  // Config mode: hash is a config ID (nanoid), possibly with ?s= state param
  const configId = hash.split('?')[0];
  return { mode: 'config', configId };
}

// Parse hash query params (?s=, ?edit=) from the URL hash fragment
function parseHashParams() {
  const hash = window.location.hash;
  const qIdx = hash.indexOf('?');
  if (qIdx === -1) return new URLSearchParams();
  return new URLSearchParams(hash.slice(qIdx));
}

// Parse the ?s= state param from the URL hash (used for shared chart state)
// URL format: site/#/{config_id}?s={base64} — the ?s= is inside the hash fragment
export function parseStateParam() {
  try {
    const s = parseHashParams().get('s');
    if (!s) return null;
    // Restore URL-safe base64 to standard base64
    const b64 = s.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(b64));
  } catch (e) {
    return null;
  }
}

// Parse connection params from URL hash
export function parseConnectionParams() {
  const hash = window.location.hash.replace(/^#/, '');
  if (!hash) return null;
  const params = new URLSearchParams(hash);
  const supabaseUrl = params.get('supabaseUrl');
  const apiKey = params.get('apiKey');
  const dataset = params.get('dataset');
  if (supabaseUrl && apiKey && dataset) {
    return { supabaseUrl, apiKey, dataset };
  }
  return null;
}

// Parse base connection (URL + key) from hash, dataset optional (for tab system)
export function parseBaseConnection() {
  const hash = window.location.hash.replace(/^#/, '');
  if (!hash) return null;
  const params = new URLSearchParams(hash);
  const supabaseUrl = params.get('supabaseUrl');
  const apiKey = params.get('apiKey');
  const dataset = params.get('dataset') || null;
  if (supabaseUrl && apiKey) {
    return { supabaseUrl, apiKey, initialDataset: dataset };
  }
  return null;
}

// Create an RPC caller for a given connection
export function createRpcCaller(connectionParams) {
  return function callQueryDataset(action, params) {
    if (!connectionParams) return Promise.reject(new Error('No connection'));
    const { supabaseUrl, apiKey, dataset } = connectionParams;
    return fetch(supabaseUrl + '/rest/v1/rpc/query_dataset', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': apiKey,
        'Authorization': 'Bearer ' + apiKey,
      },
      body: JSON.stringify({ p_table: dataset, p_action: action, ...params }),
    })
      .then(res => { if (!res.ok) throw new Error('RPC returned ' + res.status); return res.json(); })
      .then(data => { if (data.error) throw new Error(data.error); return data; });
  };
}

// LRU cache for query results
export function createQueryCache(maxSize = 100) {
  const cache = new Map();
  return {
    getKey: (action, params) => JSON.stringify({ action, ...params }),
    get(key) {
      if (cache.has(key)) {
        const val = cache.get(key);
        cache.delete(key);
        cache.set(key, val);
        return val;
      }
      return null;
    },
    set(key, value) {
      if (cache.size >= maxSize) {
        cache.delete(cache.keys().next().value);
      }
      cache.set(key, value);
    },
    clear() { cache.clear(); },
    get size() { return cache.size; },
  };
}

// Classify schema columns into dimensions and metrics
export function classifySchema(columns, dateColumn) {
  if (!columns || !dateColumn) return { dimensions: [], metrics: [] };
  const dims = [];
  const mets = [];
  const numericTypes = ['int4', 'int8', 'float4', 'float8', 'numeric'];
  const dateTypes = ['date', 'timestamp', 'timestamptz'];
  const idTypes = ['uuid'];
  columns.forEach(c => {
    if (c.name === dateColumn) return;
    // Skip other date columns, UUIDs — not useful as dimensions
    if (dateTypes.includes(c.udt) || idTypes.includes(c.udt)) return;
    if (numericTypes.includes(c.udt)) {
      mets.push(c);
    } else {
      dims.push(c);
    }
  });
  return { dimensions: dims, metrics: mets };
}

// Detect date column from schema
export function detectDateColumn(columns) {
  if (!columns) return null;
  const dateCol = columns.find(c =>
    c.udt === 'date' || c.udt === 'timestamp' || c.udt === 'timestamptz' ||
    c.name === 'reporting_dt' || c.name.includes('_dt') || c.name.includes('date')
  );
  return dateCol ? dateCol.name : null;
}

// Build COLUMNS object from schema dimensions
export function buildLiveColumns(schemaDims) {
  const cols = {
    REPORTING_DAY: "reporting_day",
    REPORTING_WEEK: "reporting_week",
    REPORTING_MONTH: "reporting_month",
    REPORTING_QUARTER: "reporting_quarter",
    REPORTING_YEAR: "reporting_year",
    METRIC1: "volume",
    METRIC2: "revenue",
  };
  schemaDims.forEach(c => {
    cols["DIM_" + c.name.toUpperCase()] = c.name;
  });
  return cols;
}

// Build DIMENSION_DEFINITIONS from schema dimensions
export function buildLiveDimensions(schemaDims) {
  return schemaDims.map((c, index) => {
    const label = c.name.replace(/^is_/, '').replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    return {
      columnKey: "DIM_" + c.name.toUpperCase(),
      filterKey: "dim_" + c.name + "_filter",
      abbreviation: c.name.slice(0, 3),
      filterLabel: label,
      viewName: label,
      viewLabel: label,
      insightLabel: label.toLowerCase(),
      marketLeaderLabel: label.toLowerCase(),
      insightTextPrefix: "leads",
      isProductDimension: false,
      displayOrder: index + 1,
    };
  });
}

// Build p_metrics array for the RPC from metric config
export function buildRpcMetrics(config) {
  if (!config) return [];
  const metrics = [];
  const addMetric = (aggType, column, alias, percentile) => {
    const agg = aggType || (column ? 'sum' : 'count');
    if (agg === 'count') {
      metrics.push({ type: "count", alias });
    } else if (agg === 'percentile') {
      metrics.push({ type: "percentile", column, alias, percentile: percentile || 0.5 });
    } else {
      metrics.push({ type: agg, column, alias });
    }
  };

  // Helper: add a metric slot (simple or formula mode)
  const addSlot = (prefix, alias) => {
    const mode = config[prefix + 'Mode'];
    if (mode === 'formula') {
      addMetric(config[prefix + 'FormulaNumAggType'], config[prefix + 'FormulaNumColumn'], alias + '_num', config[prefix + 'FormulaNumPercentile']);
      addMetric(config[prefix + 'FormulaDenAggType'], config[prefix + 'FormulaDenColumn'], alias + '_den', config[prefix + 'FormulaDenPercentile']);
    } else {
      const aggType = config[prefix + 'AggType'];
      if ((prefix === 'derived' || prefix === 'revenue') && !aggType) return; // Metric 2 & 3 can be disabled
      addMetric(aggType, config[prefix + 'Column'], alias, config[prefix + 'Percentile']);
    }
  };

  addSlot('volume', 'volume');
  addSlot('revenue', 'revenue');
  addSlot('derived', 'derived');
  return metrics;
}

// Apply a formula operator to two values
function applyOperator(a, b, op) {
  switch (op) {
    case '/': return b !== 0 ? a / b : 0;
    case '*': return a * b;
    case '+': return a + b;
    case '-': return a - b;
    default: return b !== 0 ? a / b : 0;
  }
}

// Resolve a metric value from an RPC row, handling formula mode
function resolveMetric(row, alias, formulaConfigs) {
  const fc = formulaConfigs && formulaConfigs[alias];
  if (fc) {
    const num = Number(row[alias + '_num']) || 0;
    const den = Number(row[alias + '_den']) || 0;
    return applyOperator(num, den, fc.operator);
  }
  return Number(row[alias]) || 0;
}

// Compute metric3 (derived) value from a row — shared by both transform functions
function computeMetric3(row, vol, rev, hasMetric3, formulaConfigs) {
  if (formulaConfigs && formulaConfigs.derived) {
    return resolveMetric(row, 'derived', formulaConfigs);
  } else if (hasMetric3) {
    return Number(row.derived) || 0;
  }
  return vol > 0 ? (10000 * rev) / vol : 0;
}

// Transform flat RPC rows into periodAggregates format
// formulaConfigs: { volume: {operator}, revenue: {operator}, derived: {operator} } — keys present only for formula-mode slots
export function transformToPeriodAggregates(rows, hasMetric3, formulaConfigs) {
  const aggs = {};
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const period = row.period;
    if (!period) continue;
    const vol = resolveMetric(row, 'volume', formulaConfigs);
    const rev = resolveMetric(row, 'revenue', formulaConfigs);
    const m3 = computeMetric3(row, vol, rev, hasMetric3, formulaConfigs);
    aggs[period] = {
      metric1: vol,
      metric2: rev,
      metric3: m3,
    };
  }
  return aggs;
}

// Transform flat RPC rows into dimensionAggregates format (single dimension)
export function transformToDimensionAggregates(rows, dimColumn, hasMetric3, formulaConfigs, boolColumns) {
  const isBoolDim = boolColumns && boolColumns.has(dimColumn);
  const aggs = {};
  const categoryTotals = {};
  aggs[dimColumn] = {};
  categoryTotals[dimColumn] = {};

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const period = row.period;
    const rawCat = row[dimColumn];
    const category = rawCat == null ? "Unknown"
      : isBoolDim ? dimColumn + '_' + String(rawCat).toLowerCase()
      : rawCat || "Unknown";
    const vol = resolveMetric(row, 'volume', formulaConfigs);
    const rev = resolveMetric(row, 'revenue', formulaConfigs);
    const m3 = computeMetric3(row, vol, rev, hasMetric3, formulaConfigs);

    if (!aggs[dimColumn][period]) aggs[dimColumn][period] = {};
    aggs[dimColumn][period][category] = {
      metric1: vol,
      metric2: rev,
      metric3: m3,
    };

    if (!categoryTotals[dimColumn][category]) {
      categoryTotals[dimColumn][category] = { metric1: 0, metric2: 0, _volNumSum: 0, _volDenSum: 0, _revNumSum: 0, _revDenSum: 0, _derNumSum: 0, _derDenSum: 0, _derivedSum: 0, _derivedCount: 0 };
    }
    const ct = categoryTotals[dimColumn][category];
    // Accumulate raw values for formula-mode totals
    if (formulaConfigs && formulaConfigs.volume) {
      ct._volNumSum += Number(row.volume_num) || 0;
      ct._volDenSum += Number(row.volume_den) || 0;
    } else {
      ct.metric1 += vol;
    }
    if (formulaConfigs && formulaConfigs.revenue) {
      ct._revNumSum += Number(row.revenue_num) || 0;
      ct._revDenSum += Number(row.revenue_den) || 0;
    } else {
      ct.metric2 += rev;
    }
    if (formulaConfigs && formulaConfigs.derived) {
      ct._derNumSum += Number(row.derived_num) || 0;
      ct._derDenSum += Number(row.derived_den) || 0;
    } else if (hasMetric3) {
      ct._derivedSum += m3;
      ct._derivedCount += 1;
    }
  }

  Object.keys(categoryTotals[dimColumn]).forEach(cat => {
    const t = categoryTotals[dimColumn][cat];
    t.metric1 = (formulaConfigs && formulaConfigs.volume) ? applyOperator(t._volNumSum, t._volDenSum, formulaConfigs.volume.operator) : t.metric1;
    t.metric2 = (formulaConfigs && formulaConfigs.revenue) ? applyOperator(t._revNumSum, t._revDenSum, formulaConfigs.revenue.operator) : t.metric2;
    if (formulaConfigs && formulaConfigs.derived) {
      t.metric3 = applyOperator(t._derNumSum, t._derDenSum, formulaConfigs.derived.operator);
    } else if (hasMetric3) {
      t.metric3 = t._derivedCount > 0 ? t._derivedSum / t._derivedCount : 0;
    } else {
      t.metric3 = t.metric1 > 0 ? (10000 * t.metric2) / t.metric1 : 0;
    }
  });

  aggs._categoryTotals = categoryTotals;
  return aggs;
}

// Map dashboard dataFrequency to RPC time_grain
export const frequencyToGrain = {
  "Daily": "day",
  "Weekly": "week",
  "Monthly": "month",
  "Quarterly": "quarter",
  "Yearly": "year",
};

// LLM Worker URL
export const LLM_WORKER_URL = "https://metrics-dashboard-llm-proxy.datalogic10.workers.dev";
