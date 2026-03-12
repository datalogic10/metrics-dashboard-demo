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
  columns.forEach(c => {
    if (c.name === dateColumn) return;
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
    VOLUME: "volume",
    REVENUE: "revenue",
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
  const addMetric = (aggType, column, alias) => {
    const agg = aggType || (column ? 'sum' : 'count');
    if (agg === 'count') {
      metrics.push({ type: "count", alias });
    } else {
      metrics.push({ type: agg, column, alias });
    }
  };
  addMetric(config.volumeAggType, config.volumeColumn, "volume");
  addMetric(config.revenueAggType, config.revenueColumn, "revenue");
  if (config.derivedAggType) {
    addMetric(config.derivedAggType, config.derivedColumn, "derived");
  }
  return metrics;
}

// Transform flat RPC rows into periodAggregates format
export function transformToPeriodAggregates(rows, hasMetric3) {
  const aggs = {};
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const period = row.period;
    if (!period) continue;
    const vol = Number(row.volume) || 0;
    const rev = Number(row.revenue) || 0;
    const m3 = hasMetric3 ? (Number(row.derived) || 0) : (vol > 0 ? (10000 * rev) / vol : 0);
    aggs[period] = {
      totalVolume: vol,
      totalRevenue: rev,
      Volume: vol,
      Revenue: rev,
      "Margin Rate": m3,
    };
  }
  return aggs;
}

// Transform flat RPC rows into dimensionAggregates format (single dimension)
export function transformToDimensionAggregates(rows, dimColumn, hasMetric3) {
  const aggs = {};
  const categoryTotals = {};
  aggs[dimColumn] = {};
  categoryTotals[dimColumn] = {};

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const period = row.period;
    const category = row[dimColumn] || "Unknown";
    const vol = Number(row.volume) || 0;
    const rev = Number(row.revenue) || 0;
    const m3 = hasMetric3 ? (Number(row.derived) || 0) : (vol > 0 ? (10000 * rev) / vol : 0);

    if (!aggs[dimColumn][period]) aggs[dimColumn][period] = {};
    aggs[dimColumn][period][category] = {
      totalVolume: vol, totalRevenue: rev,
      Volume: vol, Revenue: rev,
      "Margin Rate": m3,
    };

    if (!categoryTotals[dimColumn][category]) {
      categoryTotals[dimColumn][category] = { totalVolume: 0, totalRevenue: 0, _derivedSum: 0, _derivedCount: 0 };
    }
    categoryTotals[dimColumn][category].totalVolume += vol;
    categoryTotals[dimColumn][category].totalRevenue += rev;
    if (hasMetric3) {
      categoryTotals[dimColumn][category]._derivedSum += m3;
      categoryTotals[dimColumn][category]._derivedCount += 1;
    }
  }

  Object.keys(categoryTotals[dimColumn]).forEach(cat => {
    const t = categoryTotals[dimColumn][cat];
    t.Volume = t.totalVolume;
    t.Revenue = t.totalRevenue;
    if (hasMetric3) {
      t["Margin Rate"] = t._derivedCount > 0 ? t._derivedSum / t._derivedCount : 0;
    } else {
      t["Margin Rate"] = t.totalVolume > 0 ? (10000 * t.totalRevenue) / t.totalVolume : 0;
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
