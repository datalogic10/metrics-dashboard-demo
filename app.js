var __app = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // Analyzer_Demo.js
  var Analyzer_Demo_exports = {};
  __export(Analyzer_Demo_exports, {
    render: () => render
  });

  // src/theme.js
  var THEME_CONFIG = {
    light: {
      // Backgrounds
      bgPrimary: "#ffffff",
      bgSecondary: "#fafafa",
      bgTertiary: "#f9fafb",
      bgQuaternary: "#f3f4f6",
      // Text
      textPrimary: "#111827",
      textSecondary: "#374151",
      textTertiary: "#6b7280",
      textQuaternary: "#9ca3af",
      // Borders
      borderPrimary: "#e5e7eb",
      borderSecondary: "#d1d5db",
      // Interactive
      accentPrimary: "#6366f1",
      accentHover: "#5558e3",
      // Status colors
      success: "#10b981",
      successBg: "rgba(16, 185, 129, 0.12)",
      successBorder: "rgba(16, 185, 129, 0.3)",
      successText: "#059669",
      danger: "#ef4444",
      dangerBg: "rgba(239, 68, 68, 0.12)",
      dangerBorder: "rgba(239, 68, 68, 0.3)",
      dangerText: "#dc2626",
      // Chart specific - seamless
      chartBg: "#ffffff",
      chartPlotBg: "#ffffff",
      overlayBg: "rgba(0, 0, 0, 0.5)",
      // Stat box
      statBoxActiveBg: "#f0f9ff",
      statBoxActiveBorder: "#6366f1"
    },
    dark: {
      // Backgrounds - using cohesive gray scale without pitch black
      bgPrimary: "#1e293b",
      bgSecondary: "#1e293b",
      bgTertiary: "#334155",
      bgQuaternary: "#475569",
      // Text
      textPrimary: "#f9fafb",
      textSecondary: "#e5e7eb",
      textTertiary: "#d1d5db",
      textQuaternary: "#9ca3af",
      // Borders
      borderPrimary: "#374151",
      borderSecondary: "#4b5563",
      // Interactive
      accentPrimary: "#818cf8",
      accentHover: "#6366f1",
      // Status colors
      success: "#10b981",
      successBg: "rgba(16, 185, 129, 0.15)",
      successBorder: "rgba(16, 185, 129, 0.4)",
      successText: "#34d399",
      danger: "#ef4444",
      dangerBg: "rgba(239, 68, 68, 0.15)",
      dangerBorder: "rgba(239, 68, 68, 0.4)",
      dangerText: "#f87171",
      // Chart specific - seamless, no distinction
      chartBg: "#334155",
      chartPlotBg: "#334155",
      overlayBg: "rgba(0, 0, 0, 0.7)",
      // Stat box
      statBoxActiveBg: "rgba(129, 140, 248, 0.1)",
      statBoxActiveBorder: "#818cf8"
    }
  };
  var MODERN_COLOR_PALETTE = [
    "#6366f1",
    "#ef4444",
    "#10b981",
    "#f59e0b",
    "#8b5cf6",
    "#06b6d4",
    "#84cc16",
    "#f97316",
    "#ec4899",
    "#6b7280"
  ];
  function getCategoryColor(category, index, fallbackPalette = MODERN_COLOR_PALETTE) {
    if (!category) return fallbackPalette[0];
    if (category === "Rest Combined") return "#9ca3af";
    return fallbackPalette[index % fallbackPalette.length];
  }

  // src/syntheticData.js
  function generateSyntheticData() {
    var rows = [];
    var rngState = 1234567891;
    var rng = function() {
      rngState = rngState * 1664525 + 1013904223 & 2147483647;
      return rngState / 2147483647;
    };
    var productNames = ["Core Product", "Support Add-on", "Analytics Add-on", "Enterprise Suite"];
    var productGroupMap = {
      "Core Product": "Core Products",
      "Support Add-on": "Core Products",
      "Analytics Add-on": "Growth Products",
      "Enterprise Suite": "Growth Products"
    };
    var pricingTypeMap = {
      "Core Product": ["Annual Contract", "Monthly Subscription"],
      "Support Add-on": ["Volume License", "Monthly Subscription"],
      "Analytics Add-on": ["Usage-Based", "Annual Contract"],
      "Enterprise Suite": ["Annual Contract", "Volume License"]
    };
    var regions = ["NA", "EMEA", "APAC", "LATAM"];
    var countryMap = {
      "NA": ["US", "Canada"],
      "EMEA": ["UK", "Germany", "France"],
      "APAC": ["Japan", "Australia", "Singapore"],
      "LATAM": ["Brazil", "Mexico"]
    };
    var channels = ["Direct", "Partner", "Self-Serve", "Inbound"];
    var channelTypeMap = {
      "Direct": "Sales-Led",
      "Partner": "Partner-Led",
      "Self-Serve": "Product-Led",
      "Inbound": "Marketing-Led"
    };
    var segmentMap = {
      "Core Product": "Enterprise",
      "Support Add-on": "SMB",
      "Analytics Add-on": "Mid-Market",
      "Enterprise Suite": "Enterprise"
    };
    var acquisitionChannels = ["Organic Search", "Paid Search", "Referral", "Partnership"];
    var customerTypes = ["Tech-Native", "Traditional", "Digital-First"];
    var baseWeeklyVolumes = {
      "Core Product": 12e7 / 52,
      "Support Add-on": 45e6 / 52,
      "Analytics Add-on": 35e6 / 52,
      "Enterprise Suite": 6e7 / 52
    };
    var regionFactors = { "NA": 0.45, "EMEA": 0.3, "APAC": 0.18, "LATAM": 0.07 };
    var marginRates = {
      "Core Product": 0.3,
      "Support Add-on": 0.2,
      "Analytics Add-on": 0.35,
      "Enterprise Suite": 0.28
    };
    var annualGrowthRates = {
      "Core Product": 0.32,
      "Support Add-on": -0.18,
      "Analytics Add-on": 0.85,
      "Enterprise Suite": 0.55
    };
    var currentDate = new Date(2023, 0, 2);
    var today = /* @__PURE__ */ new Date();
    var dayOfWeek = today.getDay();
    var endDate = new Date(today);
    endDate.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
    var weekIndex = 0;
    while (currentDate <= endDate) {
      var yr = currentDate.getFullYear();
      var mo = currentDate.getMonth() + 1;
      var dy = currentDate.getDate();
      var moStr = mo < 10 ? "0" + mo : String(mo);
      var dyStr = dy < 10 ? "0" + dy : String(dy);
      var weekStr = yr + "-" + moStr + "-" + dyStr;
      var monthStr = yr + "-" + moStr + "-01";
      var quarter = Math.ceil(mo / 3);
      var quarterStr = yr + "-Q" + quarter;
      var yearStr = String(yr);
      for (var pIdx = 0; pIdx < productNames.length; pIdx++) {
        var productName = productNames[pIdx];
        var growthRate = annualGrowthRates[productName];
        var weeklyGrowthFactor = Math.pow(1 + growthRate, weekIndex / 52);
        for (var rIdx = 0; rIdx < regions.length; rIdx++) {
          var region = regions[rIdx];
          var regionFactor = regionFactors[region];
          var countries = countryMap[region];
          var country = countries[(pIdx + rIdx) % countries.length];
          var noise = 0.92 + rng() * 0.16;
          var seasonality = 1 + 0.12 * Math.sin((mo - 3) * Math.PI / 6);
          var volume = Math.round(
            baseWeeklyVolumes[productName] * regionFactor * weeklyGrowthFactor * seasonality * noise
          );
          var marginRate = marginRates[productName];
          var revenue = Math.round(volume * marginRate * (0.95 + rng() * 0.1));
          var comboIdx = pIdx * regions.length + rIdx;
          var channel = channels[comboIdx % channels.length];
          var channelType = channelTypeMap[channel];
          var segment = segmentMap[productName];
          var acqChannel = acquisitionChannels[comboIdx % acquisitionChannels.length];
          var customerType = customerTypes[pIdx % customerTypes.length];
          var pricingTypes = pricingTypeMap[productName];
          var pricingType = pricingTypes[rIdx % pricingTypes.length];
          rows.push({
            reporting_week: weekStr,
            reporting_month: monthStr,
            reporting_quarter: quarterStr,
            reporting_year: yearStr,
            product_group_l1: productGroupMap[productName],
            product_name: productName,
            product: pricingType,
            region,
            country,
            channel,
            channel_type: channelType,
            customer_segment: segment,
            acquisition_channel: acqChannel,
            customer_type: customerType,
            volume,
            revenue
          });
        }
      }
      currentDate.setDate(currentDate.getDate() + 7);
      weekIndex++;
    }
    return { rows };
  }
  var DEMO_COLUMNS = {
    REPORTING_WEEK: "reporting_week",
    REPORTING_MONTH: "reporting_month",
    REPORTING_QUARTER: "reporting_quarter",
    REPORTING_YEAR: "reporting_year",
    PRODUCT_GROUP_L1: "product_group_l1",
    PRODUCT_NAME: "product_name",
    PRODUCT: "product",
    CUSTOMER_SEGMENT: "customer_segment",
    REGION: "region",
    COUNTRY: "country",
    ACQUISITION_CHANNEL: "acquisition_channel",
    CUSTOMER_TYPE: "customer_type",
    CHANNEL: "channel",
    CHANNEL_TYPE: "channel_type",
    METRIC1: "volume",
    METRIC2: "revenue"
  };
  var DEMO_DIMENSION_DEFINITIONS = [
    {
      columnKey: "PRODUCT_GROUP_L1",
      filterKey: "productGroupFilter",
      abbreviation: "pg",
      filterLabel: "Product Group",
      viewName: "Product Group",
      viewLabel: "Product Groups",
      insightLabel: "product group",
      marketLeaderLabel: "product groups",
      insightTextPrefix: "leads",
      isProductDimension: true,
      displayOrder: 1
    },
    {
      columnKey: "PRODUCT_NAME",
      filterKey: "productFilter",
      abbreviation: "pn",
      filterLabel: "Product",
      viewName: "Product",
      viewLabel: "Products",
      insightLabel: "product",
      marketLeaderLabel: "products",
      insightTextPrefix: "leads",
      isProductDimension: true,
      displayOrder: 2
    },
    {
      columnKey: "PRODUCT",
      filterKey: "pricingTypeFilter",
      abbreviation: "pt",
      filterLabel: "Pricing Type",
      viewName: "Pricing Type",
      viewLabel: "Pricing Types",
      insightLabel: "pricing type",
      marketLeaderLabel: "pricing types",
      insightTextPrefix: "leads",
      isProductDimension: true,
      displayOrder: 3
    },
    {
      columnKey: "COUNTRY",
      filterKey: "revenueCountryFilter",
      abbreviation: "rc",
      filterLabel: "Country",
      viewName: "Country",
      viewLabel: "Countries",
      insightLabel: "country",
      marketLeaderLabel: "countries",
      insightTextPrefix: "leads",
      isProductDimension: false,
      displayOrder: 4
    },
    {
      columnKey: "REGION",
      filterKey: "revenueRegionFilter",
      abbreviation: "rr",
      filterLabel: "Region",
      viewName: "Region",
      viewLabel: "Regions",
      insightLabel: "region",
      marketLeaderLabel: "regions",
      insightTextPrefix: "leads",
      isProductDimension: false,
      displayOrder: 5
    },
    {
      columnKey: "CHANNEL",
      filterKey: "channelFilter",
      abbreviation: "ch",
      filterLabel: "Channel",
      viewName: "Channel",
      viewLabel: "Channels",
      insightLabel: "channel",
      marketLeaderLabel: "channels",
      insightTextPrefix: "leads",
      isProductDimension: false,
      displayOrder: 6
    },
    {
      columnKey: "CHANNEL_TYPE",
      filterKey: "channelTypeFilter",
      abbreviation: "cht",
      filterLabel: "Channel Type",
      viewName: "Channel Type",
      viewLabel: "Channel Types",
      insightLabel: "channel type",
      marketLeaderLabel: "channel types",
      insightTextPrefix: "leads",
      isProductDimension: false,
      displayOrder: 7
    },
    {
      columnKey: "CUSTOMER_SEGMENT",
      filterKey: "companySegmentFilter",
      abbreviation: "cs",
      filterLabel: "Customer Segment",
      viewName: "Customer Segment",
      viewLabel: "Customer Segments",
      insightLabel: "segment",
      marketLeaderLabel: "segments",
      insightTextPrefix: "leads",
      isProductDimension: false,
      displayOrder: 8
    },
    {
      columnKey: "ACQUISITION_CHANNEL",
      filterKey: "acquisitionChannelFilter",
      abbreviation: "ac",
      filterLabel: "Acquisition Channel",
      viewName: "Acquisition Channel",
      viewLabel: "Acquisition Channels",
      insightLabel: "acquisition channel",
      marketLeaderLabel: "acquisition channels",
      insightTextPrefix: "leads",
      isProductDimension: false,
      displayOrder: 9
    },
    {
      columnKey: "CUSTOMER_TYPE",
      filterKey: "isAiCompanyFilter",
      abbreviation: "ct",
      filterLabel: "Customer Type",
      viewName: "Customer Type",
      viewLabel: "Customer Types",
      insightLabel: "customer type",
      marketLeaderLabel: "customer types",
      insightTextPrefix: "leads",
      isProductDimension: false,
      displayOrder: 10
    }
  ];

  // src/liveConnection.js
  var DEFAULT_METRIC_CONFIGS = {
    fmc_job_metrics: {
      volumeColumn: null,
      revenueColumn: "score",
      volumeLabel: "Total Jobs",
      revenueLabel: "Total Score",
      derivedLabel: "Avg Score",
      volumeFormat: "0,0",
      revenueFormat: "0,0",
      derivedFormat: "0.0",
      volumePrefix: "",
      volumeSuffix: "",
      revenuePrefix: "",
      revenueSuffix: "",
      derivedPrefix: "",
      derivedSuffix: "",
      derivedDivisor: 1e4,
      dateColumn: "reporting_dt"
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
      volumePrefix: "",
      volumeSuffix: "",
      revenuePrefix: "",
      revenueSuffix: "",
      derivedPrefix: "",
      derivedSuffix: "",
      derivedDivisor: 1e4,
      dateColumn: "reporting_dt"
    }
  };
  function parseUrlRoute() {
    const hash = window.location.hash.replace(/^#\/?/, "");
    if (!hash) return { mode: "demo" };
    const configId = hash.split("?")[0];
    return { mode: "config", configId };
  }
  function parseHashParams() {
    const hash = window.location.hash;
    const qIdx = hash.indexOf("?");
    if (qIdx === -1) return new URLSearchParams();
    return new URLSearchParams(hash.slice(qIdx));
  }
  function parseStateParam() {
    try {
      const s = parseHashParams().get("s");
      if (!s) return null;
      const b64 = s.replace(/-/g, "+").replace(/_/g, "/");
      return JSON.parse(atob(b64));
    } catch (e) {
      return null;
    }
  }
  function createRpcCaller(connectionParams) {
    return function callQueryDataset(action, params) {
      if (!connectionParams) return Promise.reject(new Error("No connection"));
      const { supabaseUrl, apiKey, dataset } = connectionParams;
      return fetch(supabaseUrl + "/rest/v1/rpc/query_dataset", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": apiKey,
          "Authorization": "Bearer " + apiKey
        },
        body: JSON.stringify({ p_table: dataset, p_action: action, ...params })
      }).then((res) => {
        if (!res.ok) throw new Error("RPC returned " + res.status);
        return res.json();
      }).then((data) => {
        if (data.error) throw new Error(data.error);
        return data;
      });
    };
  }
  function createQueryCache(maxSize = 100) {
    const cache = /* @__PURE__ */ new Map();
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
      clear() {
        cache.clear();
      },
      get size() {
        return cache.size;
      }
    };
  }
  function classifySchema(columns, dateColumn) {
    if (!columns || !dateColumn) return { dimensions: [], metrics: [] };
    const dims = [];
    const mets = [];
    const numericTypes = ["int4", "int8", "float4", "float8", "numeric"];
    const dateTypes = ["date", "timestamp", "timestamptz"];
    const idTypes = ["uuid"];
    columns.forEach((c) => {
      if (c.name === dateColumn) return;
      if (dateTypes.includes(c.udt) || idTypes.includes(c.udt)) return;
      if (numericTypes.includes(c.udt)) {
        mets.push(c);
      } else {
        dims.push(c);
      }
    });
    return { dimensions: dims, metrics: mets };
  }
  function detectDateColumn(columns) {
    if (!columns) return null;
    const dateCol = columns.find(
      (c) => c.udt === "date" || c.udt === "timestamp" || c.udt === "timestamptz" || c.name === "reporting_dt" || c.name.includes("_dt") || c.name.includes("date")
    );
    return dateCol ? dateCol.name : null;
  }
  function buildLiveColumns(schemaDims) {
    const cols = {
      REPORTING_DAY: "reporting_day",
      REPORTING_WEEK: "reporting_week",
      REPORTING_MONTH: "reporting_month",
      REPORTING_QUARTER: "reporting_quarter",
      REPORTING_YEAR: "reporting_year",
      METRIC1: "volume",
      METRIC2: "revenue"
    };
    schemaDims.forEach((c) => {
      cols["DIM_" + c.name.toUpperCase()] = c.name;
    });
    return cols;
  }
  function buildLiveDimensions(schemaDims) {
    return schemaDims.map((c, index) => {
      const label = c.name.replace(/^is_/, "").replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
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
        displayOrder: index + 1
      };
    });
  }
  function buildRpcMetrics(config) {
    if (!config) return [];
    const metrics = [];
    const addMetric = (aggType, column, alias, percentile) => {
      const agg = aggType || (column ? "sum" : "count");
      if (agg === "count") {
        metrics.push({ type: "count", alias });
      } else if (agg === "percentile") {
        metrics.push({ type: "percentile", column, alias, percentile: percentile || 0.5 });
      } else {
        metrics.push({ type: agg, column, alias });
      }
    };
    const addSlot = (prefix, alias) => {
      const mode = config[prefix + "Mode"];
      if (mode === "formula") {
        addMetric(config[prefix + "FormulaNumAggType"], config[prefix + "FormulaNumColumn"], alias + "_num", config[prefix + "FormulaNumPercentile"]);
        addMetric(config[prefix + "FormulaDenAggType"], config[prefix + "FormulaDenColumn"], alias + "_den", config[prefix + "FormulaDenPercentile"]);
      } else {
        const aggType = config[prefix + "AggType"];
        if (prefix === "derived" && !aggType) return;
        addMetric(aggType, config[prefix + "Column"], alias, config[prefix + "Percentile"]);
      }
    };
    addSlot("volume", "volume");
    addSlot("revenue", "revenue");
    addSlot("derived", "derived");
    return metrics;
  }
  function applyOperator(a, b, op) {
    switch (op) {
      case "/":
        return b !== 0 ? a / b : 0;
      case "*":
        return a * b;
      case "+":
        return a + b;
      case "-":
        return a - b;
      default:
        return b !== 0 ? a / b : 0;
    }
  }
  function resolveMetric(row, alias, formulaConfigs) {
    const fc = formulaConfigs && formulaConfigs[alias];
    if (fc) {
      const num = Number(row[alias + "_num"]) || 0;
      const den = Number(row[alias + "_den"]) || 0;
      return applyOperator(num, den, fc.operator);
    }
    return Number(row[alias]) || 0;
  }
  function computeMetric3(row, vol, rev, hasMetric3, formulaConfigs) {
    if (formulaConfigs && formulaConfigs.derived) {
      return resolveMetric(row, "derived", formulaConfigs);
    } else if (hasMetric3) {
      return Number(row.derived) || 0;
    }
    return vol > 0 ? 1e4 * rev / vol : 0;
  }
  function transformToPeriodAggregates(rows, hasMetric3, formulaConfigs) {
    const aggs = {};
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const period = row.period;
      if (!period) continue;
      const vol = resolveMetric(row, "volume", formulaConfigs);
      const rev = resolveMetric(row, "revenue", formulaConfigs);
      const m3 = computeMetric3(row, vol, rev, hasMetric3, formulaConfigs);
      aggs[period] = {
        metric1: vol,
        metric2: rev,
        metric3: m3
      };
    }
    return aggs;
  }
  function transformToDimensionAggregates(rows, dimColumn, hasMetric3, formulaConfigs, boolColumns) {
    const isBoolDim = boolColumns && boolColumns.has(dimColumn);
    const aggs = {};
    const categoryTotals = {};
    aggs[dimColumn] = {};
    categoryTotals[dimColumn] = {};
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const period = row.period;
      const rawCat = row[dimColumn];
      const category = rawCat == null ? "Unknown" : isBoolDim ? dimColumn + "_" + String(rawCat).toLowerCase() : rawCat || "Unknown";
      const vol = resolveMetric(row, "volume", formulaConfigs);
      const rev = resolveMetric(row, "revenue", formulaConfigs);
      const m3 = computeMetric3(row, vol, rev, hasMetric3, formulaConfigs);
      if (!aggs[dimColumn][period]) aggs[dimColumn][period] = {};
      aggs[dimColumn][period][category] = {
        metric1: vol,
        metric2: rev,
        metric3: m3
      };
      if (!categoryTotals[dimColumn][category]) {
        categoryTotals[dimColumn][category] = { metric1: 0, metric2: 0, _volNumSum: 0, _volDenSum: 0, _revNumSum: 0, _revDenSum: 0, _derNumSum: 0, _derDenSum: 0, _derivedSum: 0, _derivedCount: 0 };
      }
      const ct = categoryTotals[dimColumn][category];
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
    Object.keys(categoryTotals[dimColumn]).forEach((cat) => {
      const t = categoryTotals[dimColumn][cat];
      t.metric1 = formulaConfigs && formulaConfigs.volume ? applyOperator(t._volNumSum, t._volDenSum, formulaConfigs.volume.operator) : t.metric1;
      t.metric2 = formulaConfigs && formulaConfigs.revenue ? applyOperator(t._revNumSum, t._revDenSum, formulaConfigs.revenue.operator) : t.metric2;
      if (formulaConfigs && formulaConfigs.derived) {
        t.metric3 = applyOperator(t._derNumSum, t._derDenSum, formulaConfigs.derived.operator);
      } else if (hasMetric3) {
        t.metric3 = t._derivedCount > 0 ? t._derivedSum / t._derivedCount : 0;
      } else {
        t.metric3 = t.metric1 > 0 ? 1e4 * t.metric2 / t.metric1 : 0;
      }
    });
    aggs._categoryTotals = categoryTotals;
    return aggs;
  }
  var frequencyToGrain = {
    "Daily": "day",
    "Weekly": "week",
    "Monthly": "month",
    "Quarterly": "quarter",
    "Yearly": "year"
  };
  var LLM_WORKER_URL = "https://metrics-dashboard-llm-proxy.datalogic10.workers.dev";

  // src/configDb.js
  var CONFIG_DB_URL = "https://ash-infra-vm.eastus.cloudapp.azure.com";
  var CONFIG_DB_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNzM1Njg5NjAwLCJleHAiOjE4OTM0NTYwMDB9.yLBvNnhPQk0WIq82mIdsvoIwnjpOylqo8dxk6VmgYP0";
  var ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
  function nanoid(size = 12) {
    const bytes = crypto.getRandomValues(new Uint8Array(size));
    let id = "";
    for (let i = 0; i < size; i++) id += ALPHABET[bytes[i] & 63];
    return id;
  }
  function callConfigRpc(fnName, params) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5e3);
    return fetch(CONFIG_DB_URL + "/rest/v1/rpc/" + fnName, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": CONFIG_DB_ANON_KEY,
        "Authorization": "Bearer " + CONFIG_DB_ANON_KEY
      },
      body: JSON.stringify(params),
      signal: controller.signal
    }).then((res) => {
      clearTimeout(timeoutId);
      if (!res.ok) throw new Error("Config DB RPC " + fnName + " returned " + res.status);
      return res.text();
    }).then((text) => text ? JSON.parse(text) : null);
  }
  function fetchConfig(id) {
    return callConfigRpc("get_dashboard_config", { p_id: id });
  }
  function createConfig({ name, connectionJson, tabsJson }) {
    const id = nanoid(12);
    const editSecret = nanoid(21);
    return callConfigRpc("create_dashboard_config", {
      p_id: id,
      p_edit_secret: editSecret,
      p_name: name || null,
      p_connection_json: connectionJson,
      p_tabs_json: tabsJson
    }).then(() => ({ id, editSecret }));
  }
  function updateConfig(id, editSecret, { tabsJson, name }) {
    const params = { p_id: id, p_edit_secret: editSecret };
    if (tabsJson !== void 0) params.p_tabs_json = tabsJson;
    if (name !== void 0) params.p_name = name;
    return callConfigRpc("update_dashboard_config", params);
  }
  function getEditSecret(configId) {
    try {
      return localStorage.getItem("configEditSecret_" + configId);
    } catch (e) {
      return null;
    }
  }
  function setEditSecret(configId, secret) {
    try {
      localStorage.setItem("configEditSecret_" + configId, secret);
    } catch (e) {
    }
  }
  function isCreator(configId) {
    return !!getEditSecret(configId);
  }

  // src/shareCode.js
  var VALUE_ABBREVIATIONS = {
    // Data frequencies
    Weekly: "W",
    Monthly: "Mo",
    Quarterly: "Q",
    Yearly: "Yr",
    // Metrics
    metric1: "m1",
    metric2: "m2",
    metric3: "m3",
    // Views ("Overall" is default, no abbreviation needed)
    "Product Group": "PG",
    "Product": "Pr",
    "Pricing Type": "PT",
    "Customer Segment": "CS",
    "Region": "Re",
    "Country": "Co",
    "Acquisition Channel": "AC",
    "Customer Type": "CT",
    "Channel": "Ch",
    "Channel Type": "ChT",
    // Date ranges
    QTD: "Qt",
    YTD: "Yt",
    "1Y": "1y",
    All: "A",
    // Category selection modes
    topX: "T",
    manual: "Man"
  };
  var REVERSE_ABBREVIATIONS = {
    ...Object.fromEntries(
      Object.entries(VALUE_ABBREVIATIONS).map(([k, v]) => [v, k])
    ),
    // Legacy metric abbreviations (backward compat for old share codes)
    O: "metric2",
    P: "metric1",
    MR: "metric3"
  };
  function base64UrlEncode(str) {
    return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  }
  function base64UrlDecode(str) {
    str = str.replace(/-/g, "+").replace(/_/g, "/");
    while (str.length % 4) str += "=";
    return atob(str);
  }
  function compressStateHelper(snapshot, dimensionDefs, isNested = false) {
    if (!snapshot) return null;
    const compact = {};
    if (snapshot.dataFrequency !== "Monthly") {
      compact.df = VALUE_ABBREVIATIONS[snapshot.dataFrequency] || snapshot.dataFrequency;
    }
    if (snapshot.metric !== "metric2") {
      compact.m = VALUE_ABBREVIATIONS[snapshot.metric] || snapshot.metric;
    }
    if (snapshot.view !== "Overall" && snapshot.view !== "") {
      compact.v = VALUE_ABBREVIATIONS[snapshot.view] || snapshot.view;
    }
    if (snapshot.topX !== 3) compact.tx = snapshot.topX;
    if (snapshot.dateRange !== "YTD") {
      compact.dr = VALUE_ABBREVIATIONS[snapshot.dateRange] || snapshot.dateRange;
    }
    if (snapshot.activeInsightsTab) compact.ait = snapshot.activeInsightsTab;
    if (snapshot.selectedCategories && snapshot.selectedCategories.length > 0) {
      compact.sc = snapshot.selectedCategories;
    }
    if (snapshot.categorySelectionMode !== "topX") {
      compact.csm = VALUE_ABBREVIATIONS[snapshot.categorySelectionMode] || snapshot.categorySelectionMode;
    }
    if (snapshot.showAllShareTraces !== false) compact.sst = snapshot.showAllShareTraces ? 1 : 0;
    if (snapshot.showAllGrowthTraces !== false) compact.sgt = snapshot.showAllGrowthTraces ? 1 : 0;
    if (snapshot.showAllDollarTraces !== true) compact.sdt = snapshot.showAllDollarTraces ? 1 : 0;
    dimensionDefs.forEach((dim) => {
      if (snapshot[dim.filterKey] && snapshot[dim.filterKey].length > 0) {
        compact[dim.abbreviation] = snapshot[dim.filterKey];
      }
    });
    if (!isNested) {
      if (snapshot.scenario1) compact.s1 = compressStateHelper(snapshot.scenario1, dimensionDefs, true);
      if (snapshot.scenario2) compact.s2 = compressStateHelper(snapshot.scenario2, dimensionDefs, true);
      if (snapshot.scenario3) compact.s3 = compressStateHelper(snapshot.scenario3, dimensionDefs, true);
      if (snapshot.activeScenarios && (snapshot.activeScenarios.scenario1 || snapshot.activeScenarios.scenario2 || snapshot.activeScenarios.scenario3)) {
        compact.as = snapshot.activeScenarios;
      }
      if (snapshot.scenarioLabels) compact.sl = snapshot.scenarioLabels;
      if (snapshot.showScenarioPanel) compact.ssp = snapshot.showScenarioPanel ? 1 : 0;
      if (snapshot.traceVisibility && Object.keys(snapshot.traceVisibility).length > 0) {
        compact.tv = snapshot.traceVisibility;
      }
    } else {
      if (snapshot.visibleTraceNames && snapshot.visibleTraceNames.length > 0) {
        compact.vtn = snapshot.visibleTraceNames;
      }
    }
    if (!isNested && snapshot.insightContext) compact.ic = snapshot.insightContext;
    return compact;
  }
  function compressState(snapshot, dimensionDefs) {
    return compressStateHelper(snapshot, dimensionDefs, false);
  }
  function expandStateHelper(compact, dimensionDefs) {
    if (!compact) return null;
    const expandValue = (abbr, defaultValue) => {
      if (abbr === void 0) return defaultValue;
      return REVERSE_ABBREVIATIONS[abbr] || abbr;
    };
    const snapshot = {
      dataFrequency: expandValue(compact.df, "Monthly"),
      metric: expandValue(compact.m, "metric2"),
      view: expandValue(compact.v, "Overall") || "Overall",
      topX: compact.tx !== void 0 ? compact.tx : 3,
      dateRange: expandValue(compact.dr, "YTD"),
      activeInsightsTab: compact.ait || null,
      selectedCategories: compact.sc || [],
      categorySelectionMode: expandValue(compact.csm, "topX"),
      showAllShareTraces: compact.sst !== void 0 ? compact.sst === 1 : false,
      showAllGrowthTraces: compact.sgt !== void 0 ? compact.sgt === 1 : false,
      showAllDollarTraces: compact.sdt !== void 0 ? compact.sdt === 1 : true
    };
    dimensionDefs.forEach((dim) => {
      snapshot[dim.filterKey] = [];
    });
    dimensionDefs.forEach((dim) => {
      if (compact[dim.abbreviation]) snapshot[dim.filterKey] = compact[dim.abbreviation];
    });
    if (compact.vtn !== void 0) snapshot.visibleTraceNames = compact.vtn;
    return snapshot;
  }
  function expandState(compact, dimensionDefs) {
    const snapshot = expandStateHelper(compact, dimensionDefs);
    if (compact.s1 !== void 0) snapshot.scenario1 = expandStateHelper(compact.s1, dimensionDefs);
    if (compact.s2 !== void 0) snapshot.scenario2 = expandStateHelper(compact.s2, dimensionDefs);
    if (compact.s3 !== void 0) snapshot.scenario3 = expandStateHelper(compact.s3, dimensionDefs);
    if (compact.as !== void 0) {
      snapshot.activeScenarios = compact.as;
    } else {
      snapshot.activeScenarios = { scenario1: false, scenario2: false, scenario3: false };
    }
    if (compact.sl !== void 0) {
      snapshot.scenarioLabels = compact.sl;
    } else {
      snapshot.scenarioLabels = { scenario1: "Scenario 1", scenario2: "Scenario 2", scenario3: "Scenario 3" };
    }
    if (compact.ssp !== void 0) snapshot.showScenarioPanel = compact.ssp === 1;
    if (compact.tv !== void 0) snapshot.traceVisibility = compact.tv;
    if (compact.ic !== void 0) snapshot.insightContext = compact.ic;
    return snapshot;
  }
  function generateShareCode(snapshot, dimensionDefs) {
    const compact = compressState(snapshot, dimensionDefs);
    return base64UrlEncode(JSON.stringify(compact));
  }
  function decodeShareCode(code, dimensionDefs) {
    try {
      if (!code || typeof code !== "string" || code.trim().length === 0) return null;
      const jsonString = base64UrlDecode(code.trim());
      const compact = JSON.parse(jsonString);
      return expandState(compact, dimensionDefs);
    } catch (error) {
      console.error("Failed to decode share code:", error);
      return null;
    }
  }

  // src/metrics.js
  function calculatePercentageChange(currentValue, previousValue) {
    if (previousValue === null || previousValue === void 0) return null;
    if (currentValue === null || currentValue === void 0) return null;
    if (previousValue === 0) {
      if (currentValue === 0) return null;
      return currentValue > 0 ? 9999 : -9999;
    }
    const negativeToPositive = previousValue < 0 && currentValue > 0;
    const positiveToNegative = previousValue > 0 && currentValue < 0;
    const bothNegative = previousValue < 0 && currentValue < 0;
    if (negativeToPositive) {
      const absoluteChange = currentValue - previousValue;
      return absoluteChange / Math.abs(previousValue) * 100;
    } else if (positiveToNegative) {
      return (currentValue - previousValue) / previousValue * 100;
    } else if (bothNegative) {
      const improvement = currentValue - previousValue;
      return improvement / Math.abs(previousValue) * 100;
    } else {
      return (currentValue - previousValue) / previousValue * 100;
    }
  }
  function calculateGrowthMetrics(currentValue, previousValue, overallGrowthRate = null) {
    const growthRate = calculatePercentageChange(currentValue, previousValue);
    const relativeGrowth = overallGrowthRate !== null ? growthRate - overallGrowthRate : null;
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
      absoluteGrowth: growthRate !== null ? Math.abs(growthRate) : 0
    };
  }
  function getWeekNumber(date) {
    const d = new Date(
      Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
    );
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil(((d - yearStart) / 864e5 + 1) / 7);
  }
  var MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  var DATE_REGEX = /(\d{4})-(\d{2})-(\d{2})/;
  function formatPeriodDate(periodString, dataFrequency) {
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
  function formatYoYValue(yoyValue) {
    if (yoyValue === null || yoyValue === void 0) return "N/A";
    if (Math.abs(yoyValue) >= 9999) {
      return yoyValue > 0 ? "+\u221E" : "-\u221E";
    }
    const sign = yoyValue >= 0 ? "+" : "";
    return sign + yoyValue.toFixed(1) + "%";
  }
  function capYoYForDisplay(yoyValue) {
    if (yoyValue === null) return null;
    if (Math.abs(yoyValue) >= 9999) {
      return yoyValue > 0 ? 1e3 : -1e3;
    }
    return yoyValue;
  }
  var GRAIN_RANK = { Daily: 0, Weekly: 1, Monthly: 2, Quarterly: 3, Yearly: 4 };
  var OVERLAY_CONFIG = [
    { id: "dod", label: "DoD", color: "#f97316", minGrain: "Daily", lookback: { Daily: 1, Weekly: 1, Monthly: 1, Quarterly: 1, Yearly: 1 } },
    { id: "wow", label: "WoW", color: "#8b5cf6", minGrain: "Weekly", lookback: { Daily: 7, Weekly: 1, Monthly: 4, Quarterly: 4, Yearly: 1 } },
    { id: "mom", label: "MoM", color: "#06b6d4", minGrain: "Monthly", lookback: { Daily: 30, Weekly: 4, Monthly: 1, Quarterly: 1, Yearly: 1 } },
    { id: "qoq", label: "QoQ", color: "#ec4899", minGrain: "Quarterly", lookback: { Daily: 90, Weekly: 13, Monthly: 3, Quarterly: 1, Yearly: 1 } },
    { id: "yoy", label: "YoY", color: "#a4133c", minGrain: "Yearly", lookback: { Daily: 365, Weekly: 52, Monthly: 12, Quarterly: 4, Yearly: 1 } },
    { id: "sma", label: "SMA", color: "#10b981", isSMA: true, defaultWindow: 3 },
    { id: "forecast_linear", label: "Linear", color: "#2563eb", isForecast: true, defaultHorizon: 3 },
    { id: "forecast_hw", label: "Seasonal", color: "#d946ef", isForecast: true, defaultHorizon: 3 }
  ];
  function calculatePeriodChange(currentIndex, currentValue, lookbackEntries, sortedPeriods, aggregatesByPeriod, metricName) {
    if (currentIndex < lookbackEntries) return null;
    const previousPeriod = sortedPeriods[currentIndex - lookbackEntries];
    const agg = aggregatesByPeriod[previousPeriod];
    if (!agg) return null;
    const previousValue = agg[metricName];
    return calculatePercentageChange(currentValue, previousValue);
  }
  function calculateSMA(barData, windowSize) {
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
  function hexToRgba(hex, alpha) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r},${g},${b},${alpha})`;
  }
  function detectSeasonalPeriod(dataFrequency) {
    const map = { Daily: 7, Weekly: 52, Monthly: 12, Quarterly: 4 };
    return map[dataFrequency] || null;
  }
  function generateFuturePeriods(periods, dataFrequency, horizon) {
    if (!periods.length) return [];
    const last = periods[periods.length - 1];
    const result = [];
    if (dataFrequency === "Yearly") {
      const year = parseInt(last);
      for (let i = 1; i <= horizon; i++) result.push(String(year + i));
    } else if (dataFrequency === "Quarterly") {
      let year = parseInt(last.slice(0, 4));
      let q = parseInt(last.slice(6));
      for (let i = 0; i < horizon; i++) {
        q++;
        if (q > 4) {
          q = 1;
          year++;
        }
        result.push(`${year}-Q${q}`);
      }
    } else if (dataFrequency === "Monthly") {
      const isShort = last.length <= 7;
      let year = parseInt(last.slice(0, 4));
      let month = parseInt(last.slice(5, 7));
      for (let i = 0; i < horizon; i++) {
        month++;
        if (month > 12) {
          month = 1;
          year++;
        }
        const mm = String(month).padStart(2, "0");
        result.push(isShort ? `${year}-${mm}` : `${year}-${mm}-01`);
      }
    } else {
      const step = dataFrequency === "Weekly" ? 7 : 1;
      const d = /* @__PURE__ */ new Date(last + "T00:00:00");
      for (let i = 0; i < horizon; i++) {
        d.setDate(d.getDate() + step);
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        result.push(`${y}-${m}-${day}`);
      }
    }
    return result;
  }
  function forecastLinear(values, horizon) {
    const n = values.length;
    if (n < 3) return null;
    let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
    for (let i = 0; i < n; i++) {
      sumX += i;
      sumY += values[i];
      sumXY += i * values[i];
      sumX2 += i * i;
    }
    const meanX = sumX / n;
    const b = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const a = sumY / n - b * meanX;
    let sse = 0;
    for (let i = 0; i < n; i++) {
      const residual = values[i] - (a + b * i);
      sse += residual * residual;
    }
    const se = n > 2 ? Math.sqrt(sse / (n - 2)) : 0;
    const sxx = sumX2 - sumX * sumX / n;
    const forecast = [], upper = [], lower = [];
    for (let h = 1; h <= horizon; h++) {
      const t = n - 1 + h;
      const yHat = a + b * t;
      const interval = 1.96 * se * Math.sqrt(1 + 1 / n + (t - meanX) * (t - meanX) / sxx);
      forecast.push(yHat);
      upper.push(yHat + interval);
      lower.push(Math.max(0, yHat - interval));
    }
    const holdout = Math.max(1, Math.min(horizon, Math.floor(n / 5)));
    const trainN = n - holdout;
    let tSumX = 0, tSumY = 0, tSumXY = 0, tSumX2 = 0;
    for (let i = 0; i < trainN; i++) {
      tSumX += i;
      tSumY += values[i];
      tSumXY += i * values[i];
      tSumX2 += i * i;
    }
    const tB = (trainN * tSumXY - tSumX * tSumY) / (trainN * tSumX2 - tSumX * tSumX);
    const tA = tSumY / trainN - tB * (tSumX / trainN);
    let mapeSum = 0, mapeCount = 0;
    for (let i = trainN; i < n; i++) {
      const predicted = tA + tB * i;
      if (Math.abs(values[i]) > 1e-3) {
        mapeSum += Math.abs((values[i] - predicted) / values[i]);
        mapeCount++;
      }
    }
    const mape = mapeCount > 0 ? mapeSum / mapeCount * 100 : 0;
    return { forecast, upper, lower, mape };
  }
  function forecastHoltWinters(values, horizon, seasonalPeriod) {
    const n = values.length;
    const m = seasonalPeriod;
    if (n < m * 2) return null;
    const alpha = 0.3, beta = 0.1, gamma = 0.3;
    let level = 0;
    for (let i = 0; i < m; i++) level += values[i];
    level /= m;
    let level2 = 0;
    for (let i = m; i < 2 * m; i++) level2 += values[i];
    level2 /= m;
    let trend = (level2 - level) / m;
    const seasonal = new Array(n);
    for (let i = 0; i < m; i++) seasonal[i] = values[i] - level;
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
    const forecast = [], upper = [], lower = [];
    for (let h = 1; h <= horizon; h++) {
      const seasonIdx = n - m + (h - 1) % m;
      const yHat = level + h * trend + seasonal[seasonIdx];
      const interval = 1.96 * residualStd * Math.sqrt(h);
      forecast.push(yHat);
      upper.push(yHat + interval);
      lower.push(Math.max(0, yHat - interval));
    }
    const holdout = Math.max(1, Math.min(horizon, Math.floor(n / 5)));
    const trainN = n - holdout;
    if (trainN < m * 2) return { forecast, upper, lower, mape: 0 };
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
      const sIdx = trainN - m + (h - 1) % m;
      const predicted = tLevel + h * tTrend + tSeasonal[sIdx];
      const actual = values[trainN + h - 1];
      if (Math.abs(actual) > 1e-3) {
        mapeSum += Math.abs((actual - predicted) / actual);
        mapeCount++;
      }
    }
    const mape = mapeCount > 0 ? mapeSum / mapeCount * 100 : 0;
    return { forecast, upper, lower, mape };
  }
  function getDimAggMetric(aggregates, column, period, categoryValue, metricName) {
    const dimAgg = aggregates[column];
    if (!dimAgg) return 0;
    const periodAgg = dimAgg[period];
    if (!periodAgg) return 0;
    const catAgg = periodAgg[categoryValue];
    if (!catAgg) return 0;
    return catAgg[metricName] || 0;
  }
  function getCategoriesFromAggregates(dimAggs, column, periodsToCheck) {
    const dimAgg = dimAggs[column];
    if (!dimAgg) return [];
    const catSet = /* @__PURE__ */ new Set();
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
  function calculateYoYDataArray(periods, dataByPeriod, metricCalculator, yoyCalculator, includeLastPeriod = false) {
    const periodsForYoY = includeLastPeriod ? periods : periods.slice(0, -1);
    const yoyDataForPeriods = periodsForYoY.map((period) => {
      const periodRows = dataByPeriod[period] || [];
      const currentValue = metricCalculator(periodRows);
      return yoyCalculator(period, currentValue);
    });
    const yoyData = includeLastPeriod ? yoyDataForPeriods : [...yoyDataForPeriods, null];
    let lastPeriodYoY = null;
    if (!includeLastPeriod && periods.length > 0) {
      const lastPeriod = periods[periods.length - 1];
      const lastPeriodRows = dataByPeriod[lastPeriod] || [];
      const lastPeriodValue = metricCalculator(lastPeriodRows);
      lastPeriodYoY = yoyCalculator(lastPeriod, lastPeriodValue);
    }
    return { yoyData, lastPeriodYoY };
  }

  // src/formatUtils.js
  function formatFilterName(filterName) {
    if (typeof filterName !== "string") {
      if (filterName === true) return "Yes";
      if (filterName === false) return "No";
      return String(filterName);
    }
    const isAllCaps = filterName === filterName.toUpperCase() && filterName.length <= 5;
    if (isAllCaps) return filterName;
    return filterName.replace(/_/g, " ").replace(/([a-z])([A-Z])/g, "$1 $2").replace(/\b\w/g, (l) => l.toUpperCase()).trim();
  }
  var SENTIMENT_KEYWORDS = {
    positive: [
      "surged",
      "surge",
      "surging",
      "gained",
      "gaining",
      "gains",
      "grew",
      "growing",
      "growth",
      "improved",
      "improving",
      "improvement",
      "accelerated",
      "accelerating",
      "climbing",
      "climbed",
      "increased",
      "increasing",
      "strengthened",
      "strengthening"
    ],
    negative: [
      "declined",
      "declining",
      "decline",
      "lost",
      "losing",
      "loss",
      "fell",
      "falling",
      "fallen",
      "dropped",
      "dropping",
      "drop",
      "decreased",
      "decreasing",
      "slowing",
      "slowed",
      "slowdown",
      "shrinking",
      "shrunk",
      "weakened",
      "weakening",
      "contracted",
      "contracting"
    ],
    neutral: [
      "shifted",
      "shifting",
      "fluctuated",
      "fluctuating",
      "volatile",
      "volatility",
      "stabilized",
      "stabilizing",
      "maintained",
      "maintaining"
    ]
  };
  function getInsightSentiment(insightText) {
    const text = insightText.toLowerCase();
    const hasPositive = SENTIMENT_KEYWORDS.positive.some((kw) => text.includes(kw));
    const hasNegative = SENTIMENT_KEYWORDS.negative.some((kw) => text.includes(kw));
    const hasNeutral = SENTIMENT_KEYWORDS.neutral.some((kw) => text.includes(kw));
    if (hasPositive && !hasNegative) return "positive";
    if (hasNegative && !hasPositive) return "negative";
    if (hasNeutral) return "neutral";
    return "neutral";
  }
  function getSentimentColors(sentiment, isDarkMode) {
    const colors = {
      positive: {
        text: isDarkMode ? "#34d399" : "#059669",
        border: isDarkMode ? "#34d399" : "#10b981"
      },
      negative: {
        text: isDarkMode ? "#f87171" : "#dc2626",
        border: isDarkMode ? "#f87171" : "#ef4444"
      },
      neutral: {
        text: isDarkMode ? "#fbbf24" : "#d97706",
        border: isDarkMode ? "#fbbf24" : "#f59e0b"
      }
    };
    return colors[sentiment] || colors.neutral;
  }

  // src/components/InsightContextBanner.js
  function InsightContextBanner({
    insightContext,
    formatMetric,
    formatPeriodDate: formatPeriodDate2,
    onClear,
    theme,
    isDarkMode
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
      drillPath
    } = insightContext;
    const isPositive = parentAbsChange >= 0;
    const changeSign = isPositive ? "+" : "";
    const growthColor = isPositive ? theme.success : theme.danger;
    const excessColor = parentExcessGrowth > 0 ? theme.success : theme.danger;
    return /* @__PURE__ */ React.createElement(
      "div",
      {
        style: {
          backgroundColor: isDarkMode ? "rgba(99, 102, 241, 0.1)" : "#f0f9ff",
          border: `1px solid ${isDarkMode ? "rgba(99, 102, 241, 0.3)" : "#bfdbfe"}`,
          borderRadius: "8px",
          padding: "12px 16px",
          marginBottom: "12px",
          fontSize: "13px"
        }
      },
      drillPath && drillPath.length > 0 && /* @__PURE__ */ React.createElement(
        "div",
        {
          style: {
            display: "flex",
            alignItems: "center",
            gap: "6px",
            marginBottom: "8px",
            fontSize: "12px",
            color: theme.textTertiary
          }
        },
        /* @__PURE__ */ React.createElement("span", null, "Overall"),
        drillPath.map((step, i) => /* @__PURE__ */ React.createElement(React.Fragment, { key: i }, /* @__PURE__ */ React.createElement("span", null, "\u2192"), /* @__PURE__ */ React.createElement("span", null, step.label))),
        /* @__PURE__ */ React.createElement("span", null, "\u2192"),
        /* @__PURE__ */ React.createElement("span", { style: { fontWeight: "600", color: theme.textPrimary } }, parentLabel)
      ),
      /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: "16px" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: "8px" } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: "16px" } }, "\u{1F50D}"), /* @__PURE__ */ React.createElement("span", { style: { fontWeight: "600", color: theme.textPrimary } }, "Investigating: ", parentLabel)), /* @__PURE__ */ React.createElement(
        "div",
        {
          style: {
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "4px 12px",
            backgroundColor: isDarkMode ? "rgba(0,0,0,0.2)" : "white",
            borderRadius: "6px"
          }
        },
        /* @__PURE__ */ React.createElement("span", { style: { color: growthColor, fontWeight: "700" } }, changeSign, parentGrowth.toFixed(1), "%"),
        parentExcessGrowth != null && marketAvgGrowth != null && /* @__PURE__ */ React.createElement(
          "span",
          {
            style: {
              color: excessColor,
              fontWeight: "700",
              fontSize: "11px",
              backgroundColor: isDarkMode ? "rgba(16, 185, 129, 0.1)" : "#d1fae5",
              padding: "2px 6px",
              borderRadius: "4px"
            }
          },
          changeSign,
          parentExcessGrowth.toFixed(1),
          "pp above",
          " ",
          marketAvgGrowth.toFixed(1),
          "% market"
        ),
        /* @__PURE__ */ React.createElement("span", { style: { color: theme.textTertiary } }, "(", formatMetric(firstValue), " ", "\u2192", " ", formatMetric(lastValue), ")"),
        /* @__PURE__ */ React.createElement("span", { style: { color: theme.textSecondary, fontWeight: "600" } }, changeSign, formatMetric(parentAbsChange))
      ), /* @__PURE__ */ React.createElement("div", { style: { color: theme.textTertiary, fontSize: "12px" } }, formatPeriodDate2(periods[0]), " ", "\u2192", " ", formatPeriodDate2(periods[periods.length - 1])), /* @__PURE__ */ React.createElement(
        "button",
        {
          onClick: onClear,
          style: {
            marginLeft: "auto",
            padding: "4px 8px",
            fontSize: "11px",
            backgroundColor: "transparent",
            border: `1px solid ${theme.borderSecondary}`,
            borderRadius: "4px",
            color: theme.textTertiary,
            cursor: "pointer"
          }
        },
        "Clear context"
      ))
    );
  }

  // src/components/MetricsEditorModal.js
  function MetricsEditorModal({
    draft,
    onDraftChange,
    onClose,
    onSave,
    suggesting,
    error,
    onSuggest,
    columns,
    schemaDimensions,
    expandedSlot,
    onExpandSlot,
    activeDataset,
    isDarkMode
  }) {
    const allCols = columns || [];
    const numericCols = allCols.filter(
      (c) => c.udt === "int4" || c.udt === "int8" || c.udt === "float4" || c.udt === "float8" || c.udt === "numeric"
    );
    const dateCols = allCols.filter(
      (c) => c.udt === "date" || c.udt === "timestamp" || c.udt === "timestamptz"
    );
    const updateDraft = (field, value) => onDraftChange((prev) => ({ ...prev, [field]: value }));
    const overlayStyle = {
      position: "fixed",
      inset: 0,
      zIndex: 1e4,
      backgroundColor: "rgba(0,0,0,0.5)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    };
    const modalStyle = {
      backgroundColor: isDarkMode ? "#1f2937" : "#ffffff",
      color: isDarkMode ? "#f3f4f6" : "#111827",
      borderRadius: "12px",
      padding: "24px",
      width: "480px",
      maxWidth: "90vw",
      maxHeight: "85vh",
      overflowY: "auto",
      boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
      border: `1px solid ${isDarkMode ? "#374151" : "#e5e7eb"}`
    };
    const labelStyle = { fontSize: "12px", fontWeight: 600, marginBottom: "4px", display: "block", color: isDarkMode ? "#9ca3af" : "#6b7280" };
    const inputStyle = {
      width: "100%",
      padding: "6px 10px",
      borderRadius: "6px",
      fontSize: "13px",
      border: `1px solid ${isDarkMode ? "#4b5563" : "#d1d5db"}`,
      backgroundColor: isDarkMode ? "#111827" : "#f9fafb",
      color: isDarkMode ? "#f3f4f6" : "#111827",
      outline: "none"
    };
    const selectStyle = { ...inputStyle, cursor: "pointer" };
    const sectionStyle = { marginBottom: "16px", padding: "12px", borderRadius: "8px", backgroundColor: isDarkMode ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)", border: `1px solid ${isDarkMode ? "#374151" : "#f3f4f6"}` };
    const rowStyle = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginTop: "6px" };
    const pillStyle = (isActive) => ({
      padding: "2px 8px",
      fontSize: "11px",
      borderRadius: "4px",
      cursor: "pointer",
      fontWeight: 500,
      border: `1px solid ${isActive ? isDarkMode ? "#6366f1" : "#818cf8" : isDarkMode ? "#4b5563" : "#d1d5db"}`,
      backgroundColor: isActive ? isDarkMode ? "rgba(99,102,241,0.2)" : "rgba(99,102,241,0.1)" : "transparent",
      color: isActive ? isDarkMode ? "#a5b4fc" : "#4f46e5" : isDarkMode ? "#9ca3af" : "#6b7280"
    });
    const renderAggRow = (aggTypeKey, columnKey, pctKey, allowDisable) => {
      const aggVal = draft[aggTypeKey] || (allowDisable ? "" : draft[columnKey] ? "sum" : "count");
      return /* @__PURE__ */ React.createElement("div", { style: rowStyle }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { style: labelStyle }, "Aggregation"), /* @__PURE__ */ React.createElement("select", { style: selectStyle, value: aggVal, onChange: (e) => {
        const agg = e.target.value;
        updateDraft(aggTypeKey, agg || null);
        if (agg === "count" || !agg) updateDraft(columnKey, null);
        if (agg !== "percentile") updateDraft(pctKey, null);
      } }, allowDisable && /* @__PURE__ */ React.createElement("option", { value: "" }, "\u2014 none (disable) \u2014"), /* @__PURE__ */ React.createElement("option", { value: "count" }, "COUNT(*)"), /* @__PURE__ */ React.createElement("option", { value: "count_distinct" }, "COUNT(DISTINCT)"), /* @__PURE__ */ React.createElement("option", { value: "sum" }, "SUM"), /* @__PURE__ */ React.createElement("option", { value: "avg" }, "AVG"), /* @__PURE__ */ React.createElement("option", { value: "min" }, "MIN"), /* @__PURE__ */ React.createElement("option", { value: "max" }, "MAX"), /* @__PURE__ */ React.createElement("option", { value: "percentile" }, "PERCENTILE"))), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { style: labelStyle }, "Column"), /* @__PURE__ */ React.createElement(
        "select",
        {
          style: selectStyle,
          value: draft[columnKey] || "",
          disabled: !aggVal || aggVal === "count",
          onChange: (e) => updateDraft(columnKey, e.target.value || null)
        },
        /* @__PURE__ */ React.createElement("option", { value: "" }, "\u2014 select \u2014"),
        (aggVal === "count_distinct" ? allCols : numericCols).map((c) => /* @__PURE__ */ React.createElement("option", { key: c.name, value: c.name }, c.name))
      )), aggVal === "percentile" && /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { style: labelStyle }, "Pct (0-1)"), /* @__PURE__ */ React.createElement(
        "input",
        {
          type: "number",
          step: "0.05",
          min: "0",
          max: "1",
          style: { ...inputStyle, width: "70px" },
          value: draft[pctKey] != null ? draft[pctKey] : 0.5,
          onChange: (e) => updateDraft(pctKey, parseFloat(e.target.value) || 0.5)
        }
      )));
    };
    return /* @__PURE__ */ React.createElement("div", { style: overlayStyle, onClick: onClose }, /* @__PURE__ */ React.createElement("div", { style: modalStyle, onClick: (e) => e.stopPropagation() }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" } }, /* @__PURE__ */ React.createElement("h3", { style: { margin: 0, fontSize: "16px", fontWeight: 700 } }, "Configure Metrics"), /* @__PURE__ */ React.createElement("button", { onClick: onClose, style: { background: "none", border: "none", color: isDarkMode ? "#9ca3af" : "#6b7280", cursor: "pointer", fontSize: "18px", lineHeight: 1 } }, "\xD7")), error && /* @__PURE__ */ React.createElement("div", { style: { padding: "8px 12px", marginBottom: "12px", borderRadius: "6px", fontSize: "12px", backgroundColor: isDarkMode ? "rgba(239,68,68,0.15)" : "#fef2f2", color: isDarkMode ? "#fca5a5" : "#dc2626", border: `1px solid ${isDarkMode ? "rgba(239,68,68,0.3)" : "#fecaca"}` } }, error), /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: onSuggest,
        disabled: suggesting,
        style: {
          width: "100%",
          padding: "8px",
          marginBottom: "16px",
          borderRadius: "8px",
          border: `1px solid ${isDarkMode ? "#6366f1" : "#818cf8"}`,
          backgroundColor: isDarkMode ? "rgba(99,102,241,0.15)" : "rgba(99,102,241,0.08)",
          color: isDarkMode ? "#a5b4fc" : "#4f46e5",
          cursor: suggesting ? "wait" : "pointer",
          fontSize: "13px",
          fontWeight: 600,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "6px",
          opacity: suggesting ? 0.7 : 1
        }
      },
      suggesting ? /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("span", { style: { width: "14px", height: "14px", border: "2px solid currentColor", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite", display: "inline-block" } }), "Analyzing schema...") : "AI Suggest Metrics"
    ), [
      { prefix: "volume", title: "Metric 1", canDisable: false },
      { prefix: "revenue", title: "Metric 2", canDisable: false },
      { prefix: "derived", title: "Metric 3", canDisable: true }
    ].map(({ prefix, title, canDisable }) => {
      const aggKey = prefix + "AggType";
      const colKey = prefix + "Column";
      const labelKey = prefix + "Label";
      const formatKey = prefix + "Format";
      const prefixKey = prefix + "Prefix";
      const suffixKey = prefix + "Suffix";
      const modeKey = prefix + "Mode";
      const percentileKey = prefix + "Percentile";
      const formulaOpKey = prefix + "FormulaOperator";
      const fNumAggKey = prefix + "FormulaNumAggType";
      const fNumColKey = prefix + "FormulaNumColumn";
      const fNumPctKey = prefix + "FormulaNumPercentile";
      const fDenAggKey = prefix + "FormulaDenAggType";
      const fDenColKey = prefix + "FormulaDenColumn";
      const fDenPctKey = prefix + "FormulaDenPercentile";
      const chartTypeKey = prefix + "ChartType";
      const mode = draft[modeKey] || "aggregation";
      const isExpanded = expandedSlot === prefix;
      const summaryParts = [];
      if (mode === "formula") {
        const numAgg = (draft[fNumAggKey] || "count").toUpperCase();
        const numCol = draft[fNumColKey] ? `(${draft[fNumColKey]})` : "(*)";
        const op = { "/": "\xF7", "*": "\xD7", "+": "+", "-": "\u2212" }[draft[formulaOpKey] || "/"] || "\xF7";
        const denAgg = (draft[fDenAggKey] || "count").toUpperCase();
        const denCol = draft[fDenColKey] ? `(${draft[fDenColKey]})` : "(*)";
        summaryParts.push(`${numAgg}${numCol} ${op} ${denAgg}${denCol}`);
      } else {
        const agg = draft[aggKey];
        if (canDisable && !agg) {
          summaryParts.push("Disabled");
        } else {
          const aggLabel = (agg || "count").toUpperCase();
          const col = draft[colKey] ? `(${draft[colKey]})` : "(*)";
          summaryParts.push(`${aggLabel}${col}`);
        }
      }
      const label = draft[labelKey];
      const summary = label ? `${summaryParts[0]}  \xB7  ${label}` : summaryParts[0];
      const isDisabled = canDisable && mode === "aggregation" && !draft[aggKey];
      return /* @__PURE__ */ React.createElement("div", { key: prefix, style: {
        ...sectionStyle,
        marginBottom: "8px",
        transition: "all 0.15s ease"
      } }, /* @__PURE__ */ React.createElement(
        "div",
        {
          onClick: () => onExpandSlot(isExpanded ? null : prefix),
          style: {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            cursor: "pointer",
            userSelect: "none"
          }
        },
        /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: "8px", minWidth: 0, flex: 1 } }, /* @__PURE__ */ React.createElement("span", { style: {
          fontSize: "10px",
          color: isDarkMode ? "#6b7280" : "#9ca3af",
          transition: "transform 0.15s ease",
          transform: isExpanded ? "rotate(90deg)" : "rotate(0deg)",
          display: "inline-block"
        } }, "\u25B6"), /* @__PURE__ */ React.createElement("span", { style: { fontSize: "13px", fontWeight: 700, color: isDarkMode ? "#f3f4f6" : "#111827", flexShrink: 0 } }, title), !isExpanded && /* @__PURE__ */ React.createElement("span", { style: {
          fontSize: "11px",
          color: isDisabled ? isDarkMode ? "#6b7280" : "#9ca3af" : isDarkMode ? "#9ca3af" : "#6b7280",
          fontStyle: isDisabled ? "italic" : "normal",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap"
        } }, summary)),
        isExpanded && /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: "4px", flexShrink: 0 } }, ["aggregation", "formula"].map((m) => /* @__PURE__ */ React.createElement(
          "button",
          {
            key: m,
            onClick: (e) => {
              e.stopPropagation();
              updateDraft(modeKey, m);
              if (m === "formula") {
                updateDraft(aggKey, null);
                updateDraft(colKey, null);
              }
            },
            style: pillStyle(mode === m)
          },
          m === "aggregation" ? "Agg" : "Formula"
        )))
      ), isExpanded && /* @__PURE__ */ React.createElement("div", { style: { marginTop: "10px" } }, mode === "aggregation" ? renderAggRow(aggKey, colKey, percentileKey, canDisable) : /* @__PURE__ */ React.createElement("div", { style: { padding: "8px", borderRadius: "6px", backgroundColor: isDarkMode ? "rgba(99,102,241,0.08)" : "rgba(99,102,241,0.04)", border: `1px solid ${isDarkMode ? "#4b5563" : "#e5e7eb"}` } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: "11px", fontWeight: 600, marginBottom: "4px", color: isDarkMode ? "#9ca3af" : "#6b7280" } }, "Numerator"), renderAggRow(fNumAggKey, fNumColKey, fNumPctKey, false), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "center", margin: "6px 0" } }, /* @__PURE__ */ React.createElement(
        "select",
        {
          style: { ...selectStyle, width: "50px", textAlign: "center", padding: "4px", fontSize: "14px", fontWeight: 700 },
          value: draft[formulaOpKey] || "/",
          onChange: (e) => updateDraft(formulaOpKey, e.target.value)
        },
        /* @__PURE__ */ React.createElement("option", { value: "/" }, "\xF7"),
        /* @__PURE__ */ React.createElement("option", { value: "*" }, "\xD7"),
        /* @__PURE__ */ React.createElement("option", { value: "+" }, "+"),
        /* @__PURE__ */ React.createElement("option", { value: "-" }, "\u2212")
      )), /* @__PURE__ */ React.createElement("div", { style: { fontSize: "11px", fontWeight: 600, marginBottom: "4px", color: isDarkMode ? "#9ca3af" : "#6b7280" } }, "Denominator"), renderAggRow(fDenAggKey, fDenColKey, fDenPctKey, false)), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: "6px", marginTop: "8px" } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { style: labelStyle }, "Label"), /* @__PURE__ */ React.createElement("input", { style: inputStyle, value: draft[labelKey] || "", onChange: (e) => updateDraft(labelKey, e.target.value), placeholder: "e.g. Total" })), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { style: labelStyle }, "Format"), /* @__PURE__ */ React.createElement("input", { style: inputStyle, value: draft[formatKey] || "", onChange: (e) => updateDraft(formatKey, e.target.value), placeholder: "0,0" })), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { style: labelStyle }, "Prefix"), /* @__PURE__ */ React.createElement("input", { style: inputStyle, value: draft[prefixKey] || "", onChange: (e) => updateDraft(prefixKey, e.target.value), placeholder: "$" })), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { style: labelStyle }, "Suffix"), /* @__PURE__ */ React.createElement("input", { style: inputStyle, value: draft[suffixKey] || "", onChange: (e) => updateDraft(suffixKey, e.target.value), placeholder: "ms" }))), /* @__PURE__ */ React.createElement("div", { style: { marginTop: "8px", display: "flex", alignItems: "center", gap: "6px" } }, /* @__PURE__ */ React.createElement("label", { style: { ...labelStyle, marginBottom: 0, whiteSpace: "nowrap" } }, "Chart"), [
        { value: "auto", label: "Auto" },
        { value: "stacked", label: "Stacked" },
        { value: "grouped", label: "Grouped" },
        { value: "line", label: "Line" }
      ].map((opt) => {
        const current = draft[chartTypeKey] || "auto";
        return /* @__PURE__ */ React.createElement(
          "button",
          {
            key: opt.value,
            onClick: () => updateDraft(chartTypeKey, opt.value),
            style: pillStyle(current === opt.value)
          },
          opt.label
        );
      }), (draft[chartTypeKey] || "auto") === "auto" && /* @__PURE__ */ React.createElement("span", { style: { fontSize: "10px", color: isDarkMode ? "#6b7280" : "#9ca3af" } }, "(", mode === "formula" ? "line" : "stacked", ")"))));
    }), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "8px", marginBottom: "16px" } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { style: labelStyle }, "Dataset (table name)"), /* @__PURE__ */ React.createElement("input", { style: inputStyle, value: draft.dataset || activeDataset || "", onChange: (e) => updateDraft("dataset", e.target.value), placeholder: "schema.table_name" })), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { style: labelStyle }, "Date Column"), /* @__PURE__ */ React.createElement("select", { style: selectStyle, value: draft.dateColumn || "", onChange: (e) => updateDraft("dateColumn", e.target.value || null) }, /* @__PURE__ */ React.createElement("option", { value: "" }, "\u2014 none \u2014"), dateCols.map((c) => /* @__PURE__ */ React.createElement("option", { key: c.name, value: c.name }, c.name)))), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { style: labelStyle }, "Default Grain"), /* @__PURE__ */ React.createElement("select", { style: selectStyle, value: draft.defaultGrain || "month", onChange: (e) => updateDraft("defaultGrain", e.target.value) }, /* @__PURE__ */ React.createElement("option", { value: "day" }, "Daily"), /* @__PURE__ */ React.createElement("option", { value: "week" }, "Weekly"), /* @__PURE__ */ React.createElement("option", { value: "month" }, "Monthly"), /* @__PURE__ */ React.createElement("option", { value: "quarter" }, "Quarterly"), /* @__PURE__ */ React.createElement("option", { value: "year" }, "Yearly"))), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { style: labelStyle }, "Sort top-N by"), /* @__PURE__ */ React.createElement("select", { style: selectStyle, value: draft.topNRankBy || "volume", onChange: (e) => updateDraft("topNRankBy", e.target.value) }, /* @__PURE__ */ React.createElement("option", { value: "volume" }, "Metric 1"), /* @__PURE__ */ React.createElement("option", { value: "revenue" }, "Metric 2"), /* @__PURE__ */ React.createElement("option", { value: "derived" }, "Metric 3")))), /* @__PURE__ */ React.createElement("div", { style: sectionStyle }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: "13px", fontWeight: 700, color: isDarkMode ? "#f3f4f6" : "#111827" } }, "Dimensions & Filters"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: "8px" } }, /* @__PURE__ */ React.createElement("button", { onClick: () => updateDraft("visibleDimensions", schemaDimensions.map((c) => c.name)), style: { fontSize: "11px", padding: "2px 8px", borderRadius: "4px", border: `1px solid ${isDarkMode ? "#4b5563" : "#d1d5db"}`, background: "transparent", color: isDarkMode ? "#9ca3af" : "#6b7280", cursor: "pointer" } }, "All"), /* @__PURE__ */ React.createElement("button", { onClick: () => updateDraft("visibleDimensions", []), style: { fontSize: "11px", padding: "2px 8px", borderRadius: "4px", border: `1px solid ${isDarkMode ? "#4b5563" : "#d1d5db"}`, background: "transparent", color: isDarkMode ? "#9ca3af" : "#6b7280", cursor: "pointer" } }, "None"))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexWrap: "wrap", gap: "6px" } }, schemaDimensions.map((c) => {
      const visible = draft.visibleDimensions ? draft.visibleDimensions.includes(c.name) : true;
      const label = c.name.replace(/^is_/, "").replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
      return /* @__PURE__ */ React.createElement(
        "button",
        {
          key: c.name,
          onClick: () => {
            const current = draft.visibleDimensions || schemaDimensions.map((d) => d.name);
            const updated = visible ? current.filter((n) => n !== c.name) : [...current, c.name];
            updateDraft("visibleDimensions", updated);
          },
          style: {
            padding: "4px 10px",
            borderRadius: "14px",
            fontSize: "12px",
            cursor: "pointer",
            border: `1px solid ${visible ? isDarkMode ? "#6366f1" : "#818cf8" : isDarkMode ? "#374151" : "#e5e7eb"}`,
            backgroundColor: visible ? isDarkMode ? "rgba(99,102,241,0.2)" : "rgba(99,102,241,0.1)" : "transparent",
            color: visible ? isDarkMode ? "#a5b4fc" : "#4f46e5" : isDarkMode ? "#6b7280" : "#9ca3af",
            fontWeight: visible ? 600 : 400
          }
        },
        label
      );
    }))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: "8px", justifyContent: "flex-end" } }, /* @__PURE__ */ React.createElement("button", { onClick: onClose, style: { padding: "8px 16px", borderRadius: "8px", border: `1px solid ${isDarkMode ? "#4b5563" : "#d1d5db"}`, background: "transparent", color: isDarkMode ? "#d1d5db" : "#374151", cursor: "pointer", fontSize: "13px", fontWeight: 500 } }, "Cancel"), /* @__PURE__ */ React.createElement("button", { onClick: onSave, style: { padding: "8px 20px", borderRadius: "8px", border: "none", backgroundColor: "#6366f1", color: "#ffffff", cursor: "pointer", fontSize: "13px", fontWeight: 600 } }, "Save & Apply"))));
  }

  // src/components/StatBox.js
  function ChangeDisplay({
    change,
    changePercent,
    metricName,
    label,
    isActive,
    availableComparisons,
    activePeriodComparison,
    setActivePeriodComparison,
    formatMetricValue,
    styles,
    theme,
    isDarkMode
  }) {
    if (change === null) return null;
    const formatYoYValue2 = formatYoYValue;
    const isPositive = change >= 0;
    const isPositivePercent = changePercent >= 0;
    const trendIcon = isPositive ? /* @__PURE__ */ React.createElement("span", { style: { fontSize: "14px", lineHeight: "1" } }, "\u2191") : /* @__PURE__ */ React.createElement("span", { style: { fontSize: "14px", lineHeight: "1" } }, "\u2193");
    const comparisonMapping = {
      "52W": "YoY",
      YoY: "YoY",
      MoM: "MoM",
      QoQ: "QoQ",
      WoW: "WoW",
      DoD: "DoD"
    };
    return /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: "4px", alignItems: "center" } }, /* @__PURE__ */ React.createElement("div", { style: styles.changeContainer }, /* @__PURE__ */ React.createElement("span", { style: {
      ...styles.changeValue,
      color: isActive ? isPositive ? theme.successText : theme.dangerText : theme.textQuaternary
    } }, trendIcon, isPositive ? "+" : "", formatMetricValue(change, metricName)), changePercent !== null && /* @__PURE__ */ React.createElement("span", { style: {
      ...styles.changePercent,
      backgroundColor: isActive ? isPositivePercent ? isDarkMode ? "rgba(16, 185, 129, 0.2)" : "#d1fae5" : isDarkMode ? "rgba(239, 68, 68, 0.2)" : "#fee2e2" : theme.bgQuaternary,
      color: isActive ? isPositivePercent ? isDarkMode ? "#6ee7b7" : "#065f46" : isDarkMode ? "#fca5a5" : "#991b1b" : theme.textQuaternary,
      border: `1px solid ${isActive ? isPositivePercent ? isDarkMode ? "rgba(16, 185, 129, 0.4)" : "#a7f3d0" : isDarkMode ? "rgba(239, 68, 68, 0.4)" : "#fecaca" : theme.borderPrimary}`
    } }, formatYoYValue2(changePercent), " ", label)), availableComparisons.length > 1 && /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: "6px", justifyContent: "center", marginTop: "2px" } }, availableComparisons.map((comp) => {
      const mappedComp = comparisonMapping[comp] || comp;
      const isActiveDot = activePeriodComparison === mappedComp || mappedComp === "YoY" && comp === "52W" && activePeriodComparison === "YoY";
      return /* @__PURE__ */ React.createElement(
        "div",
        {
          key: comp,
          title: comp,
          onClick: (e) => {
            e.stopPropagation();
            setActivePeriodComparison(mappedComp);
          },
          style: {
            width: "6px",
            height: "6px",
            borderRadius: "50%",
            backgroundColor: isActiveDot ? "#6366f1" : "#d1d5db",
            cursor: "pointer",
            transition: "all 0.2s ease",
            border: isActiveDot ? "2px solid #4f46e5" : "1px solid #9ca3af"
          },
          onMouseEnter: (e) => {
            if (!isActiveDot) {
              e.currentTarget.style.backgroundColor = "#9ca3af";
              e.currentTarget.style.transform = "scale(1.2)";
            }
          },
          onMouseLeave: (e) => {
            if (!isActiveDot) {
              e.currentTarget.style.backgroundColor = "#d1d5db";
              e.currentTarget.style.transform = "scale(1)";
            }
          }
        }
      );
    })));
  }
  function StatBox({
    metricName,
    metricStatData,
    isActive,
    accentColor,
    dataFrequency,
    periodChangeLabel,
    displayLabel,
    activePeriodComparison,
    setActivePeriodComparison,
    setMetric,
    setInsightContext,
    formatMetricValue,
    styles,
    theme,
    isDarkMode
  }) {
    displayLabel = displayLabel || metricName;
    const periodLabel = dataFrequency === "Weekly" ? "Last week" : dataFrequency === "Monthly" ? "Last month" : dataFrequency === "Quarterly" ? "Last quarter" : dataFrequency === "Yearly" ? "Last year" : "Latest";
    const availableComparisons = dataFrequency === "Daily" ? ["YoY", "DoD"] : dataFrequency === "Weekly" ? ["52W", "WoW"] : dataFrequency === "Monthly" ? ["YoY", "MoM"] : dataFrequency === "Quarterly" ? ["YoY", "QoQ"] : ["YoY"];
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
    return /* @__PURE__ */ React.createElement(
      "div",
      {
        key: metricName,
        style: {
          ...styles.statBox,
          ...isActive ? styles.statBoxActive : styles.statBoxInactive,
          ...isActive && { borderColor: accentColor }
        },
        onClick: () => {
          setMetric(metricName);
          setInsightContext(null);
        }
      },
      isActive && /* @__PURE__ */ React.createElement("div", { style: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: "4px",
        backgroundColor: accentColor
      } }),
      /* @__PURE__ */ React.createElement("div", { style: styles.statBoxLeft }, /* @__PURE__ */ React.createElement("div", { style: { ...styles.statTitle, color: isActive ? accentColor : "#6b7280" } }, periodLabel, " ", displayLabel), /* @__PURE__ */ React.createElement("div", { style: { ...styles.statValue, color: isActive ? accentColor : "#9ca3af" } }, formatMetricValue(metricStatData.lastValue, metricName)), /* @__PURE__ */ React.createElement("div", { style: styles.statPeriod }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: "10px" } }, "\u{1F4C5}"), metricStatData.lastPeriod)),
      /* @__PURE__ */ React.createElement("div", { style: styles.statBoxRight }, /* @__PURE__ */ React.createElement(
        ChangeDisplay,
        {
          change: changeValue,
          changePercent: changePercentValue,
          metricName,
          label: comparisonLabel,
          isActive,
          availableComparisons,
          activePeriodComparison,
          setActivePeriodComparison,
          formatMetricValue,
          styles,
          theme,
          isDarkMode
        }
      ))
    );
  }

  // src/aggregation.js
  function buildPeriodAggregates(data, dtField, columns) {
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
    const periods = Object.keys(aggregates);
    for (let p = 0; p < periods.length; p++) {
      const agg = aggregates[periods[p]];
      agg.metric3 = agg.metric1 > 0 ? 1e4 * agg.metric2 / agg.metric1 : 0;
    }
    return aggregates;
  }
  function buildDimensionAggregates(data, dtField, columns, dimensionDefs) {
    const aggregates = {};
    const categoryTotals = {};
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
            metric2: 0
          };
        }
        aggregates[column][period][categoryValue].metric1 += volume;
        aggregates[column][period][categoryValue].metric2 += revenue;
        if (!categoryTotals[column][categoryValue]) {
          categoryTotals[column][categoryValue] = {
            metric1: 0,
            metric2: 0
          };
        }
        categoryTotals[column][categoryValue].metric1 += volume;
        categoryTotals[column][categoryValue].metric2 += revenue;
      }
    }
    Object.keys(aggregates).forEach((column) => {
      Object.keys(aggregates[column]).forEach((period) => {
        Object.keys(aggregates[column][period]).forEach((categoryValue) => {
          const agg = aggregates[column][period][categoryValue];
          agg.metric3 = agg.metric1 > 0 ? 1e4 * agg.metric2 / agg.metric1 : 0;
        });
      });
    });
    Object.keys(categoryTotals).forEach((column) => {
      Object.keys(categoryTotals[column]).forEach((categoryValue) => {
        const t = categoryTotals[column][categoryValue];
        t.metric3 = t.metric1 > 0 ? 1e4 * t.metric2 / t.metric1 : 0;
      });
    });
    aggregates._categoryTotals = categoryTotals;
    return aggregates;
  }

  // Analyzer_Demo.js
  function render() {
    const [isDarkMode, setIsDarkMode] = React.useState(false);
    const theme = isDarkMode ? THEME_CONFIG.dark : THEME_CONFIG.light;
    const [showDataSummary, setShowDataSummary] = React.useState(false);
    const DATE_RANGES = ["7D", "30D", "QTD", "YTD", "1Y", "All"];
    const STATIC_STYLES = React.useMemo(
      () => ({
        base: {
          button: {
            padding: "6px 12px",
            border: "none",
            borderRadius: "6px",
            fontSize: "12px",
            fontWeight: "500",
            cursor: "pointer",
            transition: "all 0.15s ease"
          },
          input: {
            padding: "6px 10px",
            border: `1px solid ${theme.borderSecondary}`,
            borderRadius: "6px",
            fontSize: "12px",
            color: theme.textSecondary,
            backgroundColor: theme.bgPrimary,
            transition: "all 0.15s ease"
          },
          flexRow: { display: "flex", alignItems: "center", gap: "8px" },
          flexCol: { display: "flex", flexDirection: "column" },
          card: {
            backgroundColor: theme.bgPrimary,
            borderRadius: "8px",
            border: "none",
            boxShadow: isDarkMode ? "0 1px 3px rgba(0, 0, 0, 0.3)" : "0 1px 2px rgba(0, 0, 0, 0.05)"
          }
        },
        buttonGroup: {
          display: "flex",
          gap: "4px",
          backgroundColor: theme.bgQuaternary,
          padding: "4px",
          borderRadius: "8px",
          border: `1px solid ${theme.borderSecondary}`
        },
        buttonGroupBtn: {
          padding: "4px 10px",
          borderRadius: "4px",
          backgroundColor: "transparent",
          color: theme.textTertiary,
          border: "none",
          fontSize: "12px",
          fontWeight: "500",
          cursor: "pointer",
          transition: "all 0.15s ease"
        },
        buttonGroupBtnActive: {
          backgroundColor: theme.accentPrimary,
          color: "white"
        },
        topSection: {
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          marginBottom: "12px"
        },
        statBoxContainer: {
          display: "flex",
          gap: "12px",
          flexWrap: "nowrap",
          width: "100%"
        },
        controlsHeader: {
          display: "flex",
          alignItems: "center",
          padding: "14px 18px",
          backgroundColor: "transparent",
          borderBottom: `1px solid ${isDarkMode ? "rgba(148, 163, 184, 0.1)" : "rgba(229, 231, 235, 0.5)"}`,
          gap: "16px",
          flexWrap: "wrap"
        },
        controlsHeaderTitle: {
          fontSize: "14px",
          fontWeight: "700",
          color: theme.textPrimary,
          display: "flex",
          alignItems: "center",
          gap: "8px"
        },
        controlsHeaderChevron: { fontSize: "12px", color: theme.textTertiary },
        controlsContent: { padding: "18px", overflowY: "visible" },
        controlsRow: {
          display: "flex",
          flexWrap: "wrap",
          gap: "20px",
          alignItems: "end"
        },
        controlGroup: {
          display: "flex",
          flexDirection: "column",
          minWidth: "140px",
          flex: "1 1 auto"
        },
        controlGroupCompact: {
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: "8px",
          flex: "1 1 auto"
        },
        label: {
          fontSize: "13px",
          fontWeight: "normal",
          color: theme.textPrimary,
          marginBottom: "6px"
        },
        labelCompact: {
          fontSize: "12px",
          fontWeight: "500",
          color: theme.textSecondary,
          marginBottom: "0",
          marginRight: "4px",
          whiteSpace: "nowrap"
        },
        resetButton: {
          backgroundColor: "#ef4444",
          color: "white",
          whiteSpace: "nowrap",
          padding: "6px 12px",
          border: "none",
          borderRadius: "6px",
          fontSize: "12px",
          fontWeight: "500",
          cursor: "pointer"
        },
        filterSearchContainer: { position: "relative", minWidth: "200px" },
        filterSearchInput: {
          width: "100%",
          outline: "none",
          padding: "6px 10px",
          border: `1px solid ${theme.borderSecondary}`,
          borderRadius: "6px",
          fontSize: "12px",
          color: theme.textSecondary,
          backgroundColor: theme.bgPrimary,
          transition: "all 0.15s ease"
        },
        filterSuggestionItem: {
          display: "flex",
          alignItems: "center",
          padding: "8px 12px",
          cursor: "pointer",
          borderBottom: `1px solid ${theme.bgQuaternary}`
        },
        filterSuggestionName: {
          fontSize: "13px",
          color: theme.textPrimary,
          fontWeight: "500",
          cursor: "pointer",
          userSelect: "none"
        },
        filterGroupHeader: {
          padding: "8px 12px",
          backgroundColor: theme.bgTertiary,
          fontSize: "11px",
          color: theme.textTertiary,
          fontWeight: "600",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          borderBottom: `1px solid ${theme.borderPrimary}`
        },
        mainContent: {
          display: "flex",
          gap: "12px",
          alignItems: "flex-start",
          position: "relative"
        },
        leftPanel: {
          display: "flex",
          flexDirection: "column",
          minWidth: "300px",
          maxWidth: "350px"
        },
        statBoxLeft: {
          display: "flex",
          flexDirection: "column",
          flex: "1 1 0",
          position: "relative",
          zIndex: 1
        },
        statBoxRight: {
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          justifyContent: "flex-start",
          gap: "12px",
          minWidth: "130px",
          position: "relative",
          zIndex: 1
        },
        statBoxActive: {
          border: "none",
          backgroundColor: isDarkMode ? "rgba(129, 140, 248, 0.15)" : theme.statBoxActiveBg,
          transform: "translateY(-2px)",
          boxShadow: isDarkMode ? `0 4px 16px rgba(129, 140, 248, 0.4), 0 0 0 1px rgba(129, 140, 248, 0.5)` : `0 4px 12px rgba(99, 102, 241, 0.2), 0 0 0 1px ${theme.accentPrimary}`
        },
        statBoxInactive: { opacity: 0.9 },
        statTitle: {
          fontSize: "12px",
          fontWeight: "600",
          color: theme.textTertiary,
          marginBottom: "8px",
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          display: "flex",
          alignItems: "center",
          gap: "6px"
        },
        statValue: {
          fontSize: "28px",
          fontWeight: "800",
          color: theme.textPrimary,
          lineHeight: "1.1",
          marginBottom: "10px",
          letterSpacing: "-0.02em"
        },
        statPeriod: {
          fontSize: "11px",
          color: theme.textQuaternary,
          marginBottom: "0",
          fontWeight: "500",
          display: "flex",
          alignItems: "center",
          gap: "4px"
        },
        changeContainer: {
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          gap: "6px",
          marginBottom: "0",
          paddingLeft: "12px",
          borderLeft: `2px solid ${theme.bgQuaternary}`
        },
        changeValue: {
          fontSize: "15px",
          fontWeight: "700",
          display: "flex",
          alignItems: "center",
          gap: "4px"
        },
        changePercent: {
          fontSize: "11px",
          fontWeight: "600",
          padding: "4px 10px",
          borderRadius: "16px",
          display: "inline-block"
        },
        undoButton: {
          position: "absolute",
          top: "12px",
          left: "12px",
          backgroundColor: theme.bgPrimary,
          border: `1px solid ${theme.borderSecondary}`,
          borderRadius: "6px",
          padding: "4px 6px",
          fontSize: "16px",
          cursor: "pointer",
          zIndex: 10,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minWidth: "28px",
          minHeight: "28px",
          opacity: 1,
          color: theme.textSecondary
        },
        undoButtonDisabled: { opacity: 0.4, cursor: "not-allowed" },
        shareModal: {
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: theme.overlayBg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1e4
        },
        shareModalContent: {
          backgroundColor: theme.bgPrimary,
          borderRadius: "8px",
          padding: "24px",
          maxWidth: "500px",
          width: "90%",
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
        },
        shareModalHeader: {
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "20px"
        },
        shareModalTitle: {
          fontSize: "20px",
          fontWeight: "600",
          color: theme.textPrimary
        },
        shareModalClose: {
          background: "none",
          border: "none",
          fontSize: "24px",
          color: theme.textTertiary,
          cursor: "pointer",
          padding: "0",
          width: "32px",
          height: "32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "4px"
        },
        shareLinkContainer: { display: "flex", gap: "8px", marginBottom: "16px" },
        shareLinkInput: {
          flex: 1,
          padding: "10px 12px",
          border: `1px solid ${theme.borderSecondary}`,
          borderRadius: "6px",
          fontSize: "14px",
          fontFamily: "monospace",
          backgroundColor: theme.bgTertiary,
          color: theme.textSecondary
        },
        shareCopyButton: {
          padding: "10px 20px",
          backgroundColor: theme.accentPrimary,
          color: "white",
          fontSize: "14px",
          border: "none",
          borderRadius: "6px",
          fontWeight: "500",
          cursor: "pointer"
        },
        shareInstructions: {
          fontSize: "14px",
          color: theme.textTertiary,
          lineHeight: "1.5"
        },
        shareCodeSection: { marginBottom: "24px" },
        shareCodeLabel: {
          fontSize: "12px",
          fontWeight: "500",
          color: theme.textTertiary,
          marginBottom: "8px",
          display: "block"
        },
        pasteCodeSection: {
          marginTop: "24px",
          paddingTop: "24px",
          borderTop: `1px solid ${theme.borderPrimary}`
        },
        pasteCodeInput: {
          width: "100%",
          padding: "10px 12px",
          border: `1px solid ${theme.borderSecondary}`,
          borderRadius: "6px",
          fontSize: "14px",
          fontFamily: "monospace",
          backgroundColor: theme.bgTertiary,
          color: theme.textSecondary,
          marginBottom: "8px"
        },
        pasteCodeError: {
          fontSize: "12px",
          color: theme.dangerText,
          marginBottom: "8px"
        },
        shareLoadButton: {
          padding: "10px 20px",
          backgroundColor: theme.success,
          color: "white",
          fontSize: "14px",
          width: "100%",
          border: "none",
          borderRadius: "6px",
          fontWeight: "500",
          cursor: "pointer"
        },
        topXControl: {
          position: "absolute",
          top: "12px",
          right: "12px",
          backgroundColor: theme.bgPrimary,
          border: `1px solid ${theme.borderSecondary}`,
          borderRadius: "8px",
          padding: "8px 12px",
          fontSize: "13px",
          cursor: "pointer",
          zIndex: 10,
          display: "flex",
          alignItems: "center",
          gap: "8px",
          minHeight: "40px",
          color: theme.textSecondary
        },
        topXControlDropdown: {
          position: "absolute",
          top: "100%",
          right: "0",
          marginTop: "8px",
          backgroundColor: theme.bgPrimary,
          border: `1px solid ${theme.borderSecondary}`,
          borderRadius: "8px",
          minWidth: "280px",
          maxWidth: "400px",
          maxHeight: "500px",
          overflowY: "auto",
          zIndex: 1e3,
          padding: "12px"
        },
        topXControlHeader: {
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "12px",
          paddingBottom: "8px",
          borderBottom: `1px solid ${theme.borderPrimary}`
        },
        topXControlTitle: {
          fontSize: "14px",
          fontWeight: "600",
          color: theme.textSecondary
        },
        topXModeToggle: {
          display: "flex",
          gap: "4px",
          backgroundColor: theme.bgQuaternary,
          padding: "4px",
          borderRadius: "6px",
          marginBottom: "12px"
        },
        topXInput: {
          width: "100%",
          padding: "6px 8px",
          border: `1px solid ${theme.borderSecondary}`,
          borderRadius: "4px",
          fontSize: "13px",
          marginBottom: "12px",
          backgroundColor: theme.bgPrimary,
          color: theme.textSecondary
        },
        categorySelectionList: {
          display: "flex",
          flexDirection: "column",
          gap: "4px",
          maxHeight: "300px",
          overflowY: "auto"
        },
        categorySelectionItem: {
          display: "flex",
          alignItems: "center",
          padding: "6px 8px",
          borderRadius: "4px",
          cursor: "pointer",
          color: theme.textSecondary
        },
        categoryCheckbox: {
          width: "16px",
          height: "16px",
          marginRight: "8px",
          cursor: "pointer",
          accentColor: theme.accentPrimary
        },
        advancedFiltersHeader: {
          padding: "24px 24px 20px",
          borderBottom: `1px solid ${isDarkMode ? "rgba(75, 85, 99, 0.2)" : "rgba(229, 231, 235, 0.5)"}`,
          backgroundColor: theme.bgTertiary,
          position: "sticky",
          top: 0,
          zIndex: 10
        },
        advancedFiltersTitle: {
          fontSize: "18px",
          fontWeight: "600",
          color: theme.textSecondary,
          margin: "0",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between"
        },
        closeButton: {
          background: "none",
          border: "none",
          fontSize: "24px",
          color: theme.textTertiary,
          cursor: "pointer",
          padding: "0",
          width: "32px",
          height: "32px",
          borderRadius: "6px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        },
        advancedFiltersContent: { padding: "24px" },
        filterSection: { marginBottom: "24px" },
        sectionTitle: {
          fontSize: "14px",
          fontWeight: "600",
          color: theme.textSecondary,
          marginBottom: "16px",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          borderBottom: `1px solid ${isDarkMode ? "rgba(75, 85, 99, 0.3)" : "rgba(229, 231, 235, 0.6)"}`,
          paddingBottom: "8px"
        },
        modernSelect: {
          width: "100%",
          padding: "8px 12px",
          border: `1px solid ${theme.borderSecondary}`,
          borderRadius: "8px",
          fontSize: "14px",
          color: theme.textSecondary,
          backgroundColor: theme.bgPrimary,
          cursor: "pointer",
          appearance: "none",
          backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e")`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right 12px center",
          backgroundSize: "16px",
          paddingRight: "48px"
        },
        modernInput: {
          width: "100%",
          padding: "8px 12px",
          border: `1px solid ${theme.borderSecondary}`,
          borderRadius: "8px",
          fontSize: "14px",
          color: theme.textSecondary,
          backgroundColor: theme.bgPrimary,
          boxSizing: "border-box"
        },
        inputGroup: { display: "flex", flexDirection: "column", gap: "8px" },
        modernLabel: {
          fontSize: "13px",
          fontWeight: "500",
          color: theme.textTertiary,
          marginBottom: "6px"
        },
        checkboxContainer: {
          border: `1px solid ${isDarkMode ? "rgba(75, 85, 99, 0.3)" : "rgba(229, 231, 235, 0.6)"}`,
          borderRadius: "8px",
          padding: "8px",
          backgroundColor: theme.bgPrimary,
          maxHeight: "200px",
          overflowY: "auto"
        },
        checkboxItem: {
          display: "flex",
          alignItems: "center",
          padding: "6px 8px",
          cursor: "pointer",
          borderRadius: "4px"
        },
        checkboxInput: {
          width: "16px",
          height: "16px",
          marginRight: "8px",
          cursor: "pointer",
          accentColor: theme.accentPrimary
        },
        checkboxLabel: {
          fontSize: "13px",
          color: theme.textSecondary,
          cursor: "pointer",
          userSelect: "none"
        },
        filterDropdown: {
          border: `1px solid ${isDarkMode ? "rgba(75, 85, 99, 0.3)" : "rgba(229, 231, 235, 0.6)"}`,
          borderRadius: "8px",
          backgroundColor: theme.bgPrimary,
          marginBottom: "8px"
        },
        filterDropdownHeader: {
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 12px",
          cursor: "pointer",
          borderRadius: "6px"
        },
        filterDropdownTitle: {
          fontSize: "13px",
          fontWeight: "500",
          color: theme.textSecondary,
          display: "flex",
          alignItems: "center",
          gap: "8px"
        },
        filterDropdownChevron: { fontSize: "12px", color: theme.textTertiary },
        filterDropdownContent: {
          maxHeight: "200px",
          overflowY: "auto",
          padding: "8px",
          borderTop: `1px solid ${theme.borderPrimary}`
        },
        filterSelectedCount: {
          fontSize: "11px",
          color: theme.accentPrimary,
          fontWeight: "600",
          marginLeft: "4px"
        },
        queryInputGroup: {
          display: "flex",
          flexDirection: "column",
          gap: "4px",
          position: "relative"
        },
        queryLabelContainer: {
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "10px",
          marginBottom: "4px"
        },
        queryLabel: {
          fontSize: "20px",
          fontWeight: "600",
          textAlign: "center",
          letterSpacing: "-0.02em",
          background: "linear-gradient(135deg, #4c51bf 0%, #5b21b6 25%, #a855f7 50%, #2563eb 75%, #0891b2 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          fontFamily: "'Inter', 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif",
          position: "relative"
        },
        queryTooltipIcon: {
          position: "relative",
          cursor: "pointer",
          fontSize: "12px",
          color: "#9ca3af",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "16px",
          height: "16px"
        },
        queryTooltip: {
          position: "absolute",
          top: "calc(100% + 8px)",
          left: "50%",
          transform: "translateX(-50%)",
          padding: "10px 14px",
          backgroundColor: theme.bgPrimary,
          color: theme.textSecondary,
          fontSize: "11px",
          borderRadius: "8px",
          zIndex: 1e3,
          pointerEvents: "none",
          textAlign: "left",
          lineHeight: "1.5",
          border: `1px solid ${theme.borderPrimary}`,
          fontFamily: "'Inter', 'Segoe UI', sans-serif",
          width: "320px",
          maxWidth: "320px",
          wordWrap: "break-word",
          whiteSpace: "normal"
        },
        queryTooltipArrow: {
          position: "absolute",
          top: "-6px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "0",
          height: "0",
          borderLeft: "6px solid transparent",
          borderRight: "6px solid transparent",
          borderBottom: `6px solid ${theme.bgPrimary}`
        },
        queryInputWrapper: { display: "flex", gap: "8px", alignItems: "stretch" },
        queryInput: {
          flex: 1,
          padding: "12px 16px",
          border: `1px solid ${isDarkMode ? "rgba(148, 163, 184, 0.2)" : theme.borderSecondary}`,
          borderRadius: "10px",
          fontSize: "14px",
          color: theme.textSecondary,
          backgroundColor: isDarkMode ? "rgba(51, 65, 85, 0.5)" : theme.bgPrimary,
          outline: "none",
          fontFamily: "'Inter', 'Segoe UI', sans-serif",
          boxShadow: isDarkMode ? "inset 0 1px 3px rgba(0, 0, 0, 0.3)" : "inset 0 1px 2px rgba(0, 0, 0, 0.05)"
        },
        queryButton: {
          padding: "10px 24px",
          backgroundColor: theme.accentPrimary,
          color: "white",
          fontSize: "14px",
          fontWeight: "600",
          whiteSpace: "nowrap",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer"
        },
        queryButtonDisabled: {
          backgroundColor: theme.borderSecondary,
          color: theme.textQuaternary,
          cursor: "not-allowed"
        },
        luckyButton: {
          padding: "10px 20px",
          backgroundColor: theme.bgPrimary,
          color: theme.accentPrimary,
          fontSize: "14px",
          fontWeight: "600",
          whiteSpace: "nowrap",
          border: `2px solid ${theme.accentPrimary}`,
          borderRadius: "6px",
          cursor: "pointer"
        },
        queryHint: {
          fontSize: "11px",
          color: theme.textTertiary,
          fontStyle: "italic",
          marginTop: "4px"
        },
        modernResetButton: {
          width: "100%",
          padding: "8px 12px",
          backgroundColor: theme.danger,
          color: "white",
          fontSize: "14px",
          fontWeight: "600",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer"
        },
        insightsTabsContainer: {
          display: "flex",
          gap: "6px",
          backgroundColor: "transparent",
          padding: "0",
          borderRadius: "0",
          border: "none"
        },
        insightsTab: {
          flex: 1,
          padding: "10px 16px",
          borderRadius: "4px",
          fontWeight: "600",
          backgroundColor: "transparent",
          color: theme.textTertiary,
          display: "flex",
          alignItems: "center",
          gap: "6px",
          border: "none",
          fontSize: "12px",
          cursor: "pointer"
        },
        insightsTabActive: {
          backgroundColor: theme.accentPrimary,
          color: "white"
        },
        clickForInsightsButton: {
          flex: 1,
          padding: "14px 20px",
          borderRadius: "8px",
          fontWeight: "700",
          backgroundColor: theme.accentPrimary,
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          border: "none",
          fontSize: "14px",
          cursor: "pointer",
          boxShadow: "none",
          transition: "all 0.2s ease"
        },
        tabCount: {
          fontSize: "10px",
          color: "inherit",
          backgroundColor: "rgba(255,255,255,0.2)",
          padding: "2px 6px",
          borderRadius: "8px"
        },
        insightsContext: {
          fontSize: "13px",
          color: theme.accentPrimary,
          fontWeight: "600",
          marginBottom: "4px"
        },
        insightsSubtitle: {
          fontSize: "12px",
          color: theme.textTertiary,
          fontWeight: "400",
          marginBottom: "20px"
        },
        categorySection: { marginBottom: "16px" },
        categoryTitle: {
          fontSize: "14px",
          fontWeight: "600",
          color: theme.textSecondary,
          marginBottom: "12px",
          paddingBottom: "6px",
          borderBottom: `1px solid ${isDarkMode ? "rgba(75, 85, 99, 0.2)" : "rgba(229, 231, 235, 0.5)"}`,
          display: "flex",
          alignItems: "center",
          gap: "6px"
        },
        insightsList: { display: "flex", flexDirection: "column", gap: "8px" },
        insightItem: {
          padding: "12px 14px",
          backgroundColor: isDarkMode ? "rgba(148, 163, 184, 0.08)" : theme.bgSecondary,
          borderRadius: "8px",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "flex-start",
          gap: "10px",
          transition: "all 0.15s ease"
        },
        insightNumber: {
          fontSize: "12px",
          fontWeight: "700",
          color: theme.accentPrimary,
          minWidth: "16px"
        },
        insightText: {
          fontSize: "12px",
          color: theme.textSecondary,
          lineHeight: "1.4",
          flex: 1
        },
        summaryTitle: {
          fontSize: "16px",
          fontWeight: "600",
          color: theme.textSecondary,
          marginBottom: showDataSummary ? "16px" : "0px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          userSelect: "none"
        },
        summaryGrid: {
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "12px"
        },
        summaryItem: { fontSize: "13px", color: theme.textTertiary },
        flexBetween: {
          display: "flex",
          alignItems: "center",
          gap: "8px",
          justifyContent: "space-between"
        },
        flexWrap: {
          display: "flex",
          alignItems: "center",
          gap: "8px",
          flexWrap: "wrap",
          flex: "1 1 auto"
        },
        flexGap8: { display: "flex", alignItems: "center", gap: "8px" },
        block: { display: "block" },
        fontWeight600: {
          fontWeight: "600",
          marginBottom: "4px",
          color: theme.textPrimary
        },
        textGray: { color: theme.textTertiary },
        marginTop12: { marginTop: "12px" },
        guideOverlay: {
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: theme.overlayBg,
          zIndex: 2e3,
          pointerEvents: "auto"
        },
        guideHighlight: {
          position: "fixed",
          border: `3px solid ${theme.accentPrimary}`,
          borderRadius: "8px",
          boxShadow: `0 0 0 9999px ${theme.overlayBg}`,
          pointerEvents: "none",
          zIndex: 2001,
          boxSizing: "border-box"
        },
        guideTooltip: {
          position: "fixed",
          backgroundColor: theme.bgPrimary,
          borderRadius: "12px",
          zIndex: 2002,
          maxWidth: "400px",
          padding: "16px",
          fontFamily: "'Inter', 'Segoe UI', sans-serif",
          pointerEvents: "auto"
        },
        guideTooltipHeader: {
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "8px"
        },
        guideTooltipTitle: {
          fontSize: "16px",
          fontWeight: "600",
          color: theme.textPrimary,
          marginBottom: "4px"
        },
        guideTooltipStep: {
          fontSize: "12px",
          color: theme.textTertiary,
          fontWeight: "500"
        },
        guideTooltipDescription: {
          fontSize: "14px",
          color: theme.textSecondary,
          lineHeight: "1.5",
          marginBottom: "12px"
        },
        guideTooltipButtons: {
          display: "flex",
          gap: "8px",
          justifyContent: "flex-end"
        },
        guideTooltipButton: {
          padding: "6px 12px",
          borderRadius: "6px",
          border: "none",
          fontSize: "13px",
          fontWeight: "500",
          cursor: "pointer"
        },
        guideTooltipButtonPrimary: {
          backgroundColor: theme.accentPrimary,
          color: "white"
        },
        guideTooltipButtonSecondary: {
          backgroundColor: theme.bgQuaternary,
          color: theme.textSecondary
        },
        guideTooltipClose: {
          background: "none",
          border: "none",
          fontSize: "20px",
          color: theme.textTertiary,
          cursor: "pointer",
          padding: "0",
          width: "24px",
          height: "24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "4px"
        },
        helpButton: {
          position: "absolute",
          top: "-12px",
          right: "12px",
          padding: "6px 12px",
          borderRadius: "16px",
          backgroundColor: theme.accentPrimary,
          color: "white",
          border: "none",
          fontSize: "12px",
          fontWeight: "600",
          cursor: "pointer",
          zIndex: 1500,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          whiteSpace: "nowrap",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
        },
        // Optimization 6: Hoisted styles for .map() loops
        checkboxItemSelected: {
          display: "flex",
          alignItems: "center",
          padding: "6px 8px",
          cursor: "pointer",
          borderRadius: "4px",
          fontWeight: "600",
          backgroundColor: "#f0f9ff"
        },
        checkboxItemUnselected: {
          display: "flex",
          alignItems: "center",
          padding: "6px 8px",
          cursor: "pointer",
          borderRadius: "4px",
          backgroundColor: "transparent"
        },
        filterSuggestionItemSelected: {
          display: "flex",
          alignItems: "center",
          padding: "8px 12px",
          cursor: "pointer",
          borderBottom: `1px solid ${theme.bgQuaternary}`,
          backgroundColor: isDarkMode ? "rgba(129, 140, 248, 0.15)" : "#f0f9ff"
        },
        filterSuggestionItemUnselected: {
          display: "flex",
          alignItems: "center",
          padding: "8px 12px",
          cursor: "pointer",
          borderBottom: `1px solid ${theme.bgQuaternary}`,
          backgroundColor: isDarkMode ? "rgba(51, 65, 85, 0.3)" : "white"
        },
        categorySelectionItemSelected: {
          display: "flex",
          alignItems: "center",
          padding: "6px 8px",
          borderRadius: "4px",
          cursor: "pointer",
          color: theme.textSecondary,
          backgroundColor: "#f0f9ff"
        },
        categorySelectionItemUnselected: {
          display: "flex",
          alignItems: "center",
          padding: "6px 8px",
          borderRadius: "4px",
          cursor: "pointer",
          color: theme.textSecondary,
          backgroundColor: "transparent"
        },
        savedViewsHeader: {
          fontSize: "11px",
          fontWeight: "600",
          color: "#6b7280",
          marginBottom: "8px",
          textTransform: "uppercase",
          letterSpacing: "0.5px"
        },
        savedScenarioCard: {
          padding: "8px",
          backgroundColor: "#f9fafb",
          borderRadius: "6px",
          border: "1px solid #e5e7eb"
        },
        savedScenarioRow: {
          display: "flex",
          alignItems: "center",
          gap: "8px",
          marginBottom: "6px"
        },
        savedScenarioLabel: {
          flex: 1,
          fontSize: "12px",
          fontWeight: "500",
          color: "#374151"
        },
        savedScenarioDeleteBtn: {
          padding: "2px 8px",
          backgroundColor: "#ef4444",
          color: "white",
          border: "none",
          borderRadius: "4px",
          fontSize: "10px",
          fontWeight: "500",
          cursor: "pointer"
        },
        allSlotsFilled: {
          fontSize: "11px",
          color: "#6b7280",
          fontStyle: "italic",
          textAlign: "center",
          padding: "8px",
          backgroundColor: "#f9fafb",
          borderRadius: "4px",
          marginTop: "12px"
        },
        categoryLabelText: { fontSize: "13px", color: "#374151" },
        noCategoriesFound: {
          padding: "12px",
          textAlign: "center",
          color: "#6b7280",
          fontSize: "13px"
        },
        radioLabel: {
          display: "flex",
          alignItems: "center",
          cursor: "pointer",
          fontSize: "13px"
        },
        marginRight6: { marginRight: "6px" },
        marginBottom16: { marginBottom: "16px" },
        flexGap12Mt8: { display: "flex", gap: "12px", marginTop: "8px" }
      }),
      [theme, isDarkMode, showDataSummary]
    );
    const [urlRoute] = React.useState(() => parseUrlRoute());
    const [baseConnection, setBaseConnection] = React.useState(null);
    const [configId, setConfigId] = React.useState(urlRoute.mode === "config" ? urlRoute.configId : null);
    const [isCreatorMode, setIsCreatorMode] = React.useState(false);
    const [configLoading, setConfigLoading] = React.useState(urlRoute.mode === "config");
    const [configError, setConfigError] = React.useState(null);
    const creatorTimerRef = React.useRef(null);
    const resetCreatorTimer = React.useCallback(() => {
      if (creatorTimerRef.current) clearTimeout(creatorTimerRef.current);
      creatorTimerRef.current = setTimeout(() => {
        setIsCreatorMode(false);
      }, 2 * 60 * 1e3);
    }, []);
    React.useEffect(() => {
      if (isCreatorMode && configId) {
        resetCreatorTimer();
        return () => {
          if (creatorTimerRef.current) clearTimeout(creatorTimerRef.current);
        };
      }
    }, [isCreatorMode, configId, resetCreatorTimer]);
    const [showUnlockPrompt, setShowUnlockPrompt] = React.useState(false);
    const [unlockSecret, setUnlockSecret] = React.useState("");
    const [unlockError, setUnlockError] = React.useState("");
    const [showConnectModal, setShowConnectModal] = React.useState(false);
    const [connectForm, setConnectForm] = React.useState({ supabaseUrl: "", apiKey: "", dataset: "" });
    const [connectError, setConnectError] = React.useState("");
    const [connectSaving, setConnectSaving] = React.useState(false);
    const pendingStateRef = React.useRef(urlRoute.mode === "config" ? parseStateParam() : null);
    const [tabs, setTabs] = React.useState(() => {
      return [];
    });
    const [activeTabId, setActiveTabId] = React.useState(() => tabs.length > 0 ? tabs[0].id : null);
    const tabStateCacheRef = React.useRef({});
    const [renamingTabId, setRenamingTabId] = React.useState(null);
    const [renameText, setRenameText] = React.useState("");
    const [showAddTab, setShowAddTab] = React.useState(false);
    const [newTabDataset, setNewTabDataset] = React.useState("");
    const tabNextIdRef = React.useRef(tabs.length + 1);
    React.useEffect(() => {
      if (urlRoute.mode !== "config") return;
      setConfigLoading(true);
      fetchConfig(urlRoute.configId).then((config) => {
        if (!config) {
          setConfigError("Dashboard not found. It may have been deleted.");
          setConfigLoading(false);
          return;
        }
        const conn = config.connection_json;
        setBaseConnection({ supabaseUrl: conn.supabaseUrl, apiKey: conn.apiKey, initialDataset: conn.dataset || null });
        const tabsData = config.tabs_json;
        if (Array.isArray(tabsData) && tabsData.length > 0) {
          setTabs(tabsData);
          const savedActiveTab = (() => {
            try {
              return localStorage.getItem("activeTabId_" + urlRoute.configId);
            } catch (e) {
              return null;
            }
          })();
          const initialTabId = savedActiveTab && tabsData.some((t) => t.id === savedActiveTab) ? savedActiveTab : tabsData[0].id;
          setActiveTabId(initialTabId);
          tabNextIdRef.current = Math.max(...tabsData.map((t) => {
            const m = t.id.match(/^tab_(\d+)$/);
            return m ? parseInt(m[1], 10) : 0;
          }));
          const initialTab = tabsData.find((t) => t.id === initialTabId) || tabsData[0];
          if (initialTab.metricConfig) {
            setLiveMetricConfig(initialTab.metricConfig);
          }
          tabsData.forEach((t) => {
            if (t.id !== initialTabId && t.metricConfig) {
              tabStateCacheRef.current[t.id] = { liveMetricConfig: t.metricConfig };
            }
          });
        } else {
          const ds = conn.dataset || null;
          setTabs([{ id: "tab_1", name: ds || "New Tab", dataset: ds }]);
          setActiveTabId("tab_1");
        }
        setConfigId(urlRoute.configId);
        setIsCreatorMode(isCreator(urlRoute.configId));
        setConfigLoading(false);
      }).catch((err) => {
        setConfigError("Failed to load dashboard: " + err.message);
        setConfigLoading(false);
      });
    }, []);
    const uiSelectionsRestoredRef = React.useRef(/* @__PURE__ */ new Set());
    const pendingTraceTogglesRef = React.useRef(null);
    const activeTab = tabs.find((t) => t.id === activeTabId) || null;
    const connectionParams = React.useMemo(() => {
      if (!baseConnection || !activeTab || !activeTab.dataset) return null;
      return { supabaseUrl: baseConnection.supabaseUrl, apiKey: baseConnection.apiKey, dataset: activeTab.dataset };
    }, [baseConnection, activeTab]);
    const [liveDataLoading, setLiveDataLoading] = React.useState(!!connectionParams);
    const [liveDataError, setLiveDataError] = React.useState(null);
    const [liveColumnMeta, setLiveColumnMeta] = React.useState(null);
    const [liveSchemaReady, setLiveSchemaReady] = React.useState(false);
    const [liveFilterOptions, setLiveFilterOptions] = React.useState({});
    const [livePeriodAggregates, setLivePeriodAggregates] = React.useState(null);
    const [liveDimensionAggregates, setLiveDimensionAggregates] = React.useState(null);
    const [liveInsightsDimAggs, setLiveInsightsDimAggs] = React.useState({});
    const [liveAggLoading, setLiveAggLoading] = React.useState(false);
    const [liveRowCount, setLiveRowCount] = React.useState(0);
    const [liveDataTruncated, setLiveDataTruncated] = React.useState(false);
    const [liveMetricConfig, setLiveMetricConfig] = React.useState(null);
    const isLiveMode = connectionParams !== null && liveSchemaReady;
    const [showMetricsEditor, setShowMetricsEditor] = React.useState(false);
    const [metricsEditorDraft, setMetricsEditorDraft] = React.useState(null);
    const [metricsEditorSuggesting, setMetricsEditorSuggesting] = React.useState(false);
    const [metricsEditorError, setMetricsEditorError] = React.useState("");
    const [expandedMetricSlot, setExpandedMetricSlot] = React.useState(null);
    const buildTabsJson = React.useCallback((currentTabs, currentTabId, currentMetricConfig) => {
      return currentTabs.map((t) => {
        const mc = t.id === currentTabId ? currentMetricConfig : tabStateCacheRef.current[t.id]?.liveMetricConfig || null;
        return { id: t.id, name: t.name, dataset: t.dataset, metricConfig: mc };
      });
    }, []);
    const persistToConfigDb = React.useCallback((updatedTabs, currentTabId, currentMetricConfig) => {
      if (!configId || !isCreatorMode) return;
      resetCreatorTimer();
      const tabsJson = buildTabsJson(updatedTabs || tabs, currentTabId || activeTabId, currentMetricConfig || liveMetricConfig);
      updateConfig(configId, getEditSecret(configId), { tabsJson }).catch((err) => console.warn("Failed to save config to DB:", err));
    }, [configId, isCreatorMode, tabs, activeTabId, liveMetricConfig, buildTabsJson, resetCreatorTimer]);
    const tabsInitializedRef = React.useRef(false);
    React.useEffect(() => {
      if (!tabsInitializedRef.current) {
        tabsInitializedRef.current = true;
        return;
      }
      persistToConfigDb();
    }, [tabs]);
    const handleMetricsEditorSave = React.useCallback(() => {
      const config = { ...metricsEditorDraft };
      const newDataset = config.dataset;
      delete config.dataset;
      const datasetChanged = newDataset && activeTab && newDataset !== activeTab.dataset;
      let updatedTabs = tabs;
      if (datasetChanged) {
        updatedTabs = tabs.map((t) => t.id === activeTabId ? { ...t, dataset: newDataset } : t);
        setTabs(updatedTabs);
        loadedDatasetsRef.current.delete(activeTab.dataset);
      }
      setLiveMetricConfig(config);
      setShowMetricsEditor(false);
      queryCacheRef.current.clear();
      persistToConfigDb(updatedTabs, activeTabId, config);
    }, [metricsEditorDraft, activeTab, activeTabId, connectionParams, tabs, persistToConfigDb]);
    const handleMetricsEditorSuggest = React.useCallback(async () => {
      setMetricsEditorSuggesting(true);
      setMetricsEditorError("");
      try {
        const res = await fetch(LLM_WORKER_URL + "/suggest-metrics", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ columns: liveColumnMeta })
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.error || "Request failed");
        }
        const suggestion = await res.json();
        const allCols = liveColumnMeta || [];
        const validDate = allCols.filter((c) => c.udt === "date" || c.udt === "timestamp" || c.udt === "timestamptz").map((c) => c.name);
        const validAllCols = allCols.map((c) => c.name);
        const allowedAggs = ["count", "count_distinct", "sum", "avg", "min", "max"];
        setMetricsEditorDraft((prev) => ({
          ...prev,
          volumeAggType: suggestion.volumeAggType && allowedAggs.includes(suggestion.volumeAggType) ? suggestion.volumeAggType : suggestion.volumeColumn ? "sum" : "count",
          volumeColumn: suggestion.volumeColumn && validAllCols.includes(suggestion.volumeColumn) ? suggestion.volumeColumn : prev.volumeColumn,
          revenueAggType: suggestion.revenueAggType && allowedAggs.includes(suggestion.revenueAggType) ? suggestion.revenueAggType : suggestion.revenueColumn ? "sum" : "count",
          revenueColumn: suggestion.revenueColumn && validAllCols.includes(suggestion.revenueColumn) ? suggestion.revenueColumn : prev.revenueColumn,
          derivedMode: "aggregation",
          formulaOperator: prev.formulaOperator || "/",
          derivedAggType: suggestion.derivedAggType && allowedAggs.includes(suggestion.derivedAggType) ? suggestion.derivedAggType : prev.derivedAggType,
          derivedColumn: suggestion.derivedColumn && validAllCols.includes(suggestion.derivedColumn) ? suggestion.derivedColumn : prev.derivedColumn,
          volumeLabel: suggestion.volumeLabel || prev.volumeLabel,
          revenueLabel: suggestion.revenueLabel || prev.revenueLabel,
          derivedLabel: suggestion.derivedLabel || prev.derivedLabel,
          volumeFormat: suggestion.volumeFormat || prev.volumeFormat,
          revenueFormat: suggestion.revenueFormat || prev.revenueFormat,
          derivedFormat: suggestion.derivedFormat || prev.derivedFormat,
          volumePrefix: suggestion.volumePrefix != null ? suggestion.volumePrefix : prev.volumePrefix || "",
          volumeSuffix: suggestion.volumeSuffix != null ? suggestion.volumeSuffix : prev.volumeSuffix || "",
          revenuePrefix: suggestion.revenuePrefix != null ? suggestion.revenuePrefix : prev.revenuePrefix || "",
          revenueSuffix: suggestion.revenueSuffix != null ? suggestion.revenueSuffix : prev.revenueSuffix || "",
          derivedPrefix: suggestion.derivedPrefix != null ? suggestion.derivedPrefix : prev.derivedPrefix || "",
          derivedSuffix: suggestion.derivedSuffix != null ? suggestion.derivedSuffix : prev.derivedSuffix || "",
          dateColumn: suggestion.dateColumn && validDate.includes(suggestion.dateColumn) ? suggestion.dateColumn : prev.dateColumn
        }));
      } catch (err) {
        setMetricsEditorError(err.message || "Suggestion failed");
      } finally {
        setMetricsEditorSuggesting(false);
      }
    }, [liveColumnMeta]);
    const callQueryDataset = React.useMemo(
      () => createRpcCaller(connectionParams),
      [connectionParams]
    );
    const queryCacheRef = React.useRef(createQueryCache(100));
    const cachedQuery = React.useCallback((action, params) => {
      const cache = queryCacheRef.current;
      const key = cache.getKey(action, params);
      const cached = cache.get(key);
      if (cached) return Promise.resolve(cached);
      return callQueryDataset(action, params).then((result) => {
        cache.set(key, result);
        return result;
      });
    }, [callQueryDataset]);
    const liveDateColumn = React.useMemo(() => detectDateColumn(liveColumnMeta), [liveColumnMeta]);
    const liveSchemaClassified = React.useMemo(() => classifySchema(liveColumnMeta, liveDateColumn), [liveColumnMeta, liveDateColumn]);
    const visibleLiveDimensions = React.useMemo(() => {
      if (!liveSchemaClassified.dimensions.length) return [];
      const visible = liveMetricConfig?.visibleDimensions;
      if (!visible || !Array.isArray(visible)) return liveSchemaClassified.dimensions;
      return liveSchemaClassified.dimensions.filter((c) => visible.includes(c.name));
    }, [liveSchemaClassified.dimensions, liveMetricConfig]);
    const liveBooleanColumns = React.useMemo(() => {
      if (!liveColumnMeta) return /* @__PURE__ */ new Set();
      return new Set(liveColumnMeta.filter((c) => c.udt === "bool").map((c) => c.name));
    }, [liveColumnMeta]);
    const loadedDatasetsRef = React.useRef(/* @__PURE__ */ new Set());
    React.useEffect(() => {
      if (!connectionParams) return;
      if (loadedDatasetsRef.current.has(connectionParams.dataset) && liveColumnMeta) return;
      setLiveDataLoading(true);
      setLiveDataError(null);
      const { dataset } = connectionParams;
      callQueryDataset("schema", {}).then((schemaData) => {
        const columns = schemaData.columns || [];
        setLiveColumnMeta(columns);
        let config = null;
        const currentTab = tabs.find((t) => t.id === activeTabId) || tabs.find((t) => t.dataset === dataset);
        if (currentTab && currentTab.metricConfig) config = currentTab.metricConfig;
        const isNewConnection = !config;
        if (!config) {
          config = DEFAULT_METRIC_CONFIGS[dataset] || {
            volumeColumn: null,
            revenueColumn: null,
            volumeLabel: "Count",
            revenueLabel: "Count",
            derivedLabel: "Ratio",
            volumeFormat: "0,0",
            revenueFormat: "0,0",
            derivedFormat: "0.0",
            derivedDivisor: 1e4,
            dateColumn: columns.find((c) => c.udt === "date" || c.name.includes("_dt"))?.name || null
          };
          if (!DEFAULT_METRIC_CONFIGS[dataset] && isCreatorMode) {
            setMetricsEditorDraft({ ...config, dataset });
            setShowMetricsEditor(true);
          }
        }
        const columnNames = new Set(columns.map((c) => c.name));
        let configDirty = false;
        if (config.dateColumn && !columnNames.has(config.dateColumn)) {
          const detected = columns.find((c) => c.udt === "date" || c.name.includes("_dt"))?.name || null;
          console.warn(`[Dashboard] dateColumn "${config.dateColumn}" not in schema, auto-correcting to "${detected}"`);
          config.dateColumn = detected;
          configDirty = true;
        }
        if (Array.isArray(config.visibleDimensions)) {
          const before = config.visibleDimensions.length;
          config.visibleDimensions = config.visibleDimensions.filter((d) => columnNames.has(d));
          if (config.visibleDimensions.length !== before) configDirty = true;
        }
        if (configDirty && configId && isCreatorMode) {
          persistToConfigDb(void 0, void 0, config);
        }
        setLiveMetricConfig(config);
        if (config.defaultGrain) {
          const grainToFreq = { day: "Daily", week: "Weekly", month: "Monthly", quarter: "Quarterly", year: "Yearly" };
          setDataFrequency(grainToFreq[config.defaultGrain] || "Monthly");
        }
        const dateCol = config.dateColumn || columns.find((c) => c.udt === "date" || c.name.includes("_dt"))?.name;
        const dimCols = columns.filter((c) => {
          if (c.name === dateCol) return false;
          if (c.udt === "int4" || c.udt === "int8" || c.udt === "float4" || c.udt === "float8" || c.udt === "numeric") return false;
          return true;
        });
        const boolCols = new Set(columns.filter((c) => c.udt === "bool").map((c) => c.name));
        return Promise.all(
          dimCols.map(
            (c) => cachedQuery("distinct", { p_column: c.name }).then((r) => ({ column: c.name, values: r.values || [], isBool: boolCols.has(c.name) })).catch(() => ({ column: c.name, values: [], isBool: boolCols.has(c.name) }))
          )
        );
      }).then((distinctResults) => {
        const filterOpts = {};
        distinctResults.forEach((r) => {
          if (r.isBool) {
            filterOpts[r.column] = r.values.map((v) => r.column + "_" + String(v).toLowerCase());
          } else {
            filterOpts[r.column] = r.values;
          }
        });
        setLiveFilterOptions(filterOpts);
        setLiveSchemaReady(true);
        setLiveDataLoading(false);
        loadedDatasetsRef.current.add(connectionParams.dataset);
        if (!uiSelectionsRestoredRef.current.has(activeTabId)) {
          uiSelectionsRestoredRef.current.add(activeTabId);
          try {
            const selectionsKey = "uiSelections_" + connectionParams.supabaseUrl + "_" + activeTabId;
            const saved = localStorage.getItem(selectionsKey);
            if (saved) {
              const s = JSON.parse(saved);
              const schemaColNames = new Set(distinctResults.map((r) => r.column));
              if (s.dataFrequency) setDataFrequency(s.dataFrequency);
              if (s.metric) setMetric(s.metric);
              if (s.view && s.view !== "Overall") {
                const viewValid = distinctResults.some((r) => {
                  const label = r.column.replace(/^is_/, "").replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
                  return label === s.view;
                });
                setView(viewValid ? s.view : "Overall");
              } else if (s.view) {
                setView(s.view);
              }
              if (s.topX != null) setTopX(s.topX);
              if (s.categorySelectionMode) setCategorySelectionMode(s.categorySelectionMode);
              if (s.selectedCategories) setSelectedCategories(s.selectedCategories);
              if (s.dynamicFilters) {
                const cleaned = {};
                Object.keys(s.dynamicFilters).forEach((filterKey) => {
                  const colName = filterKey.replace(/^dim_/, "").replace(/_filter$/, "");
                  if (schemaColNames.has(colName)) cleaned[filterKey] = s.dynamicFilters[filterKey];
                });
                setDynamicFilters(cleaned);
              }
              if (s.dateRange) setDateRange(s.dateRange);
              if (s.activeOverlays) setActiveOverlays(s.activeOverlays);
              if (s.smaWindow) setSmaWindow(s.smaWindow);
              if (s.forecastHorizon) setForecastHorizon(s.forecastHorizon);
              if (s.activeInsightsTab !== void 0) setActiveInsightsTab(s.activeInsightsTab);
              if (s.showAllDollarTraces !== void 0 || s.showAllShareTraces !== void 0 || s.showAllGrowthTraces !== void 0) {
                pendingTraceTogglesRef.current = {
                  showAllDollarTraces: s.showAllDollarTraces,
                  showAllShareTraces: s.showAllShareTraces,
                  showAllGrowthTraces: s.showAllGrowthTraces
                };
              }
            }
          } catch (e) {
          }
        }
      }).catch((err) => {
        setLiveDataError(err.message);
        setLiveDataLoading(false);
      });
    }, [connectionParams]);
    const restoreStateSnapshotRef = React.useRef(null);
    const [dynamicFilters, setDynamicFilters] = React.useState({});
    const COLUMNS = isLiveMode ? buildLiveColumns(visibleLiveDimensions) : DEMO_COLUMNS;
    const DIMENSION_DEFINITIONS = isLiveMode ? buildLiveDimensions(visibleLiveDimensions) : DEMO_DIMENSION_DEFINITIONS;
    const METRIC_LABELS = isLiveMode && liveMetricConfig ? {
      metric1: liveMetricConfig.volumeLabel,
      metric2: liveMetricConfig.revenueLabel,
      metric3: liveMetricConfig.derivedLabel
    } : {
      metric1: "Gross Volume",
      metric2: "Net Revenue",
      metric3: "Margin Rate"
    };
    const queryData = React.useMemo(function() {
      if (connectionParams) return { rows: [] };
      return generateSyntheticData();
    }, [connectionParams]);
    const { cleanedQueryData, metadataVariables } = React.useMemo(() => {
      if (!queryData.rows || queryData.rows.length === 0) {
        return {
          cleanedQueryData: queryData,
          metadataVariables: {
            username: null,
            team: null,
            shared_configuration: null,
            saved_views: []
          }
        };
      }
      const metadata = {
        username: null,
        team: null,
        shared_configuration: null,
        saved_views: []
      };
      for (let i = 0; i < queryData.rows.length; i++) {
        const row = queryData.rows[i];
        const familyValue = row[COLUMNS.PRODUCT_NAME];
        const methodValue = row[COLUMNS.PRODUCT];
        if (familyValue) {
          const familyStr = familyValue.toString();
          if (familyStr === "username") {
            metadata.username = methodValue;
          } else if (familyStr === "team") {
            metadata.team = methodValue;
          } else if (familyStr === "Shared Configuration") {
            metadata.shared_configuration = methodValue;
          } else if (familyStr.startsWith("Saved Views:")) {
            const viewName = familyStr.replace("Saved Views:", "").trim();
            const configCode = methodValue ? methodValue.toString() : "";
            if (viewName && configCode) {
              metadata.saved_views.push({ name: viewName, code: configCode });
            }
          }
        }
        if (metadata.username && metadata.team && metadata.shared_configuration && i > 20) {
          if (metadata.saved_views.length === 0) {
            break;
          }
        }
      }
      const cleanedRows = queryData.rows.filter((row) => {
        const familyValue = row[COLUMNS.PRODUCT_NAME];
        if (!familyValue) return true;
        const familyStr = familyValue.toString();
        return !(familyStr === "configuration_code" || familyStr === "view_name" || familyStr === "username" || familyStr === "team" || familyStr.startsWith("Saved Views:") || familyStr === "Shared Configuration");
      });
      return {
        cleanedQueryData: { ...queryData, rows: cleanedRows },
        metadataVariables: metadata
      };
    }, [queryData]);
    const availableColumns = React.useMemo(() => {
      if (isLiveMode && liveColumnMeta) {
        const cols = new Set(liveColumnMeta.map((c) => c.name));
        cols.add("reporting_day");
        cols.add("reporting_week");
        cols.add("reporting_month");
        cols.add("reporting_quarter");
        cols.add("reporting_year");
        cols.add("volume");
        cols.add("revenue");
        return cols;
      }
      if (!cleanedQueryData.rows || cleanedQueryData.rows.length === 0)
        return /* @__PURE__ */ new Set();
      const firstRow = cleanedQueryData.rows[0];
      return new Set(Object.keys(firstRow));
    }, [isLiveMode, liveColumnMeta, cleanedQueryData.rows]);
    const columnExists = React.useCallback(
      (columnName) => {
        return availableColumns.has(columnName);
      },
      [availableColumns]
    );
    const PRODUCT_DIMENSIONS = DIMENSION_DEFINITIONS.filter(
      (dim) => dim.isProductDimension && columnExists(COLUMNS[dim.columnKey])
    ).map((dim) => COLUMNS[dim.columnKey]);
    const VIEW_CONFIG = React.useMemo(() => {
      const filteredViews = {};
      [...DIMENSION_DEFINITIONS].sort((a, b) => a.displayOrder - b.displayOrder).forEach((dim) => {
        const column = COLUMNS[dim.columnKey];
        if (columnExists(column)) {
          filteredViews[dim.viewName] = {
            column,
            label: dim.viewLabel
          };
        }
      });
      return filteredViews;
    }, [columnExists]);
    const VIEW_LABEL_OVERRIDES = {};
    const GUIDE_STEPS = [
      {
        id: "quick-query",
        title: "Quick Query",
        description: "Click '\u{1F3B2} Feeling Lucky' to generate example queries, then click 'Ask' to visualize the data.",
        targetSelector: '[data-guide="quick-query"]'
      },
      {
        id: "metric-statboxes",
        title: "Metric Statboxes",
        description: "View key metrics (Volume, Revenue, Margin Rate). Click any metric to filter the chart.",
        targetSelector: '[data-guide="metric-statboxes"]'
      },
      {
        id: "insights-panel",
        title: "Insights Panel",
        description: "View automated insights: Solo Insights (single-dimension) and Cross Insights (multi-dimensional patterns).",
        targetSelector: '[data-guide="insights-panel"]'
      },
      {
        id: "view-selector",
        title: "View Selector",
        description: "Split the data by selecting a dimension (Product, Product Group, Region, Customer Segment, etc.).",
        targetSelector: '[data-guide="view-selector"]'
      },
      {
        id: "top-x-control",
        title: "Top X Control",
        description: "Once the data is split, control which categories of that dimension are shown in the chart. Select Top X categories by total value, or manually pick specific categories to display.",
        targetSelector: '[data-guide="top-x-control"]'
      },
      {
        id: "filter-search",
        title: "Filter Search",
        description: "Search and apply filters across all dimensions. Faster than Advanced Filters panel.",
        targetSelector: '[data-guide="filter-search"]'
      },
      {
        id: "reset-button",
        title: "Reset Button",
        description: "Clear all active filters and return to default view. Useful when you want to start fresh.",
        targetSelector: '[data-guide="reset-button"]'
      },
      {
        id: "share-link",
        title: "Share Link",
        description: "Generate shareable URL that preserves filters, date range, view selection, and settings.",
        targetSelector: '[data-guide="share-link"]'
      },
      {
        id: "advanced-filters",
        title: "Advanced Filters",
        description: "Access detailed filtering options via gear icon. Useful for multiple filters.",
        targetSelector: '[data-guide="advanced-filters"]'
      },
      {
        id: "comparison",
        title: "Scenario Comparison",
        description: "Compare up to 3 scenarios side-by-side. Click chart icon to open comparison panel.",
        targetSelector: '[data-guide="comparison"]'
      },
      {
        id: "undo-button",
        title: "Undo Button",
        description: "Revert to previous filter state. Disabled when there's no history.",
        targetSelector: '[data-guide="undo-button"]'
      }
    ];
    const [dataFrequency, setDataFrequency] = React.useState("Monthly");
    const [metric, setMetric] = React.useState("metric2");
    const [activePeriodComparison, setActivePeriodComparison] = React.useState("YoY");
    const [activeOverlays, setActiveOverlays] = React.useState({ yoy: true, forecast_linear: true });
    const [smaWindow, setSmaWindow] = React.useState(3);
    const [forecastHorizon, setForecastHorizon] = React.useState(3);
    const [showOverlayMenu, setShowOverlayMenu] = React.useState(false);
    const prevGrainRef = React.useRef(dataFrequency);
    React.useEffect(() => {
      if (prevGrainRef.current === dataFrequency) return;
      prevGrainRef.current = dataFrequency;
      const toDisable = OVERLAY_CONFIG.filter(
        (o) => o.minGrain && GRAIN_RANK[o.minGrain] < GRAIN_RANK[dataFrequency]
      ).map((o) => o.id);
      if (toDisable.length > 0) {
        setActiveOverlays((prev) => {
          const next = { ...prev };
          toDisable.forEach((id) => {
            next[id] = false;
          });
          return next;
        });
      }
    }, [dataFrequency]);
    const [view, setView] = React.useState("Overall");
    const [topX, setTopX] = React.useState(3);
    const [categorySelectionMode, setCategorySelectionMode] = React.useState("topX");
    const [selectedCategories, setSelectedCategories] = React.useState([]);
    const [showTopXControl, setShowTopXControl] = React.useState(false);
    const [categorySearchText, setCategorySearchText] = React.useState("");
    const [productNameFilter, setProductNameFilter] = React.useState([]);
    const [companySegmentFilter, setCompanySegmentFilter] = React.useState([]);
    const [revenueRegionFilter, setRevenueRegionFilter] = React.useState([]);
    const [revenueCountryFilter, setRevenueCountryFilter] = React.useState([]);
    const [acquisitionChannelFilter, setAcquisitionChannelFilter] = React.useState([]);
    const [pricingTypeFilter, setPricingTypeFilter] = React.useState([]);
    const [isAiCompanyFilter, setIsAiCompanyFilter] = React.useState([]);
    const [channelFilter, setChannelFilter] = React.useState([]);
    const [productGroupFilter, setProductGroupFilter] = React.useState([]);
    const [productSubFilter, setProductSubFilter] = React.useState([]);
    const [channelTypeFilter, setChannelTypeFilter] = React.useState(
      []
    );
    const [customerConnectFilter, setCustomerConnectFilter] = React.useState([]);
    const [insightContext, setInsightContext] = React.useState(null);
    const FILTER_CONFIG_STATIC = React.useMemo(() => {
      return DIMENSION_DEFINITIONS.map((dim) => ({
        key: dim.filterKey,
        column: COLUMNS[dim.columnKey],
        label: dim.filterLabel,
        displayOrder: dim.displayOrder
      })).filter((filter) => columnExists(filter.column)).sort((a, b) => a.displayOrder - b.displayOrder);
    }, [columnExists]);
    const getFilterState = React.useCallback(
      (key) => {
        if (isLiveMode) {
          return dynamicFilters[key] || [];
        }
        const stateMap = {
          productNameFilter,
          pricingTypeFilter,
          companySegmentFilter,
          revenueRegionFilter,
          revenueCountryFilter,
          acquisitionChannelFilter,
          channelFilter,
          productGroupFilter,
          productSubFilter,
          isAiCompanyFilter,
          channelTypeFilter,
          customerConnectFilter
        };
        return stateMap[key] || [];
      },
      [
        isLiveMode,
        dynamicFilters,
        productNameFilter,
        pricingTypeFilter,
        companySegmentFilter,
        revenueRegionFilter,
        revenueCountryFilter,
        acquisitionChannelFilter,
        channelFilter,
        productGroupFilter,
        productSubFilter,
        isAiCompanyFilter,
        channelTypeFilter,
        customerConnectFilter
      ]
    );
    const getFilterSetState = React.useCallback((key) => {
      if (isLiveMode) {
        return (value) => {
          setDynamicFilters((prev) => ({
            ...prev,
            [key]: typeof value === "function" ? value(prev[key] || []) : value
          }));
        };
      }
      const setStateMap = {
        productNameFilter: setProductNameFilter,
        pricingTypeFilter: setPricingTypeFilter,
        companySegmentFilter: setCompanySegmentFilter,
        revenueRegionFilter: setRevenueRegionFilter,
        revenueCountryFilter: setRevenueCountryFilter,
        acquisitionChannelFilter: setAcquisitionChannelFilter,
        channelFilter: setChannelFilter,
        productGroupFilter: setProductGroupFilter,
        productSubFilter: setProductSubFilter,
        isAiCompanyFilter: setIsAiCompanyFilter,
        channelTypeFilter: setChannelTypeFilter,
        customerConnectFilter: setCustomerConnectFilter
      };
      return setStateMap[key];
    }, [isLiveMode]);
    const FILTER_CONFIG = React.useMemo(() => {
      return FILTER_CONFIG_STATIC.map((filter) => ({
        ...filter,
        state: getFilterState(filter.key),
        setState: getFilterSetState(filter.key)
      }));
    }, [FILTER_CONFIG_STATIC, getFilterState, getFilterSetState]);
    const [dateRange, setDateRange] = React.useState("1Y");
    const [showAdvancedFilters, setShowAdvancedFilters] = React.useState(false);
    const [activeInsightsTab, setActiveInsightsTab] = React.useState(null);
    const captureTabSnapshot = React.useCallback(() => ({
      // Live data state
      liveColumnMeta,
      liveSchemaReady,
      liveFilterOptions,
      livePeriodAggregates,
      liveDimensionAggregates,
      liveAggLoading,
      liveRowCount,
      liveDataTruncated,
      liveMetricConfig,
      liveDataError,
      liveInsightsDimAggs,
      // UI state
      dataFrequency,
      metric,
      view,
      topX,
      categorySelectionMode,
      selectedCategories,
      dynamicFilters,
      dateRange,
      activeOverlays,
      smaWindow,
      forecastHorizon,
      activeInsightsTab
    }), [
      liveColumnMeta,
      liveSchemaReady,
      liveFilterOptions,
      livePeriodAggregates,
      liveDimensionAggregates,
      liveAggLoading,
      liveRowCount,
      liveDataTruncated,
      liveMetricConfig,
      liveDataError,
      liveInsightsDimAggs,
      dataFrequency,
      metric,
      view,
      topX,
      categorySelectionMode,
      selectedCategories,
      dynamicFilters,
      dateRange,
      activeOverlays,
      smaWindow,
      forecastHorizon,
      activeInsightsTab
    ]);
    const restoreTabSnapshot = React.useCallback((snap) => {
      setLiveColumnMeta(snap.liveColumnMeta || null);
      setLiveSchemaReady(snap.liveSchemaReady || false);
      setLiveFilterOptions(snap.liveFilterOptions || {});
      setLivePeriodAggregates(snap.livePeriodAggregates || null);
      setLiveDimensionAggregates(snap.liveDimensionAggregates || null);
      setLiveAggLoading(snap.liveAggLoading || false);
      setLiveRowCount(snap.liveRowCount || 0);
      setLiveDataTruncated(snap.liveDataTruncated || false);
      setLiveMetricConfig(snap.liveMetricConfig || null);
      setLiveDataError(snap.liveDataError || null);
      setLiveInsightsDimAggs(snap.liveInsightsDimAggs || {});
      const grainToFreq = { day: "Daily", week: "Weekly", month: "Monthly", quarter: "Quarterly", year: "Yearly" };
      const defaultFromGrain = snap.liveMetricConfig?.defaultGrain ? grainToFreq[snap.liveMetricConfig.defaultGrain] : null;
      setDataFrequency(snap.dataFrequency || defaultFromGrain || "Monthly");
      setMetric(snap.metric || "metric1");
      setView(snap.view || "Overall");
      setTopX(snap.topX != null ? snap.topX : 3);
      setCategorySelectionMode(snap.categorySelectionMode || "topX");
      setSelectedCategories(snap.selectedCategories || []);
      setDynamicFilters(snap.dynamicFilters || {});
      setDateRange(snap.dateRange || "1Y");
      setActiveOverlays(snap.activeOverlays || { yoy: true, forecast_linear: true });
      setSmaWindow(snap.smaWindow || 3);
      setForecastHorizon(snap.forecastHorizon || 3);
      setActiveInsightsTab(snap.activeInsightsTab || null);
    }, []);
    const uiSelectionsSaveTimerRef = React.useRef(null);
    React.useEffect(() => {
      if (!connectionParams || !liveSchemaReady) return;
      clearTimeout(uiSelectionsSaveTimerRef.current);
      uiSelectionsSaveTimerRef.current = setTimeout(() => {
        const selectionsKey = "uiSelections_" + connectionParams.supabaseUrl + "_" + activeTabId;
        const selections = {
          dataFrequency,
          metric,
          view,
          topX,
          categorySelectionMode,
          selectedCategories,
          dynamicFilters,
          dateRange,
          activeOverlays,
          smaWindow,
          forecastHorizon,
          activeInsightsTab
        };
        try {
          localStorage.setItem(selectionsKey, JSON.stringify(selections));
        } catch (e) {
        }
      }, 500);
      return () => clearTimeout(uiSelectionsSaveTimerRef.current);
    }, [
      connectionParams,
      liveSchemaReady,
      activeTabId,
      dataFrequency,
      metric,
      view,
      topX,
      categorySelectionMode,
      selectedCategories,
      dynamicFilters,
      dateRange,
      activeOverlays,
      smaWindow,
      forecastHorizon,
      activeInsightsTab
    ]);
    const switchTab = React.useCallback((targetTabId) => {
      if (targetTabId === activeTabId) return;
      if (activeTabId) {
        tabStateCacheRef.current[activeTabId] = captureTabSnapshot();
      }
      const cached = tabStateCacheRef.current[targetTabId];
      if (cached) {
        restoreTabSnapshot(cached);
      } else {
        restoreTabSnapshot({});
        setLiveDataLoading(true);
      }
      queryCacheRef.current.clear();
      setActiveTabId(targetTabId);
      if (configId) {
        try {
          localStorage.setItem("activeTabId_" + configId, targetTabId);
        } catch (e) {
        }
      }
    }, [activeTabId, configId, captureTabSnapshot, restoreTabSnapshot]);
    const addTab = React.useCallback((name, dataset) => {
      const id = "tab_" + ++tabNextIdRef.current;
      const newTab = { id, name, dataset: dataset || null };
      if (activeTabId) {
        tabStateCacheRef.current[activeTabId] = captureTabSnapshot();
      }
      setTabs((prev) => [...prev, newTab]);
      setActiveTabId(id);
      restoreTabSnapshot({});
      queryCacheRef.current.clear();
      if (dataset) {
        setLiveDataLoading(true);
      } else {
        setLiveDataLoading(false);
        setLiveSchemaReady(false);
        setTimeout(() => {
          setMetricsEditorDraft({});
          setMetricsEditorError("");
          setExpandedMetricSlot(null);
          setShowMetricsEditor(true);
        }, 50);
      }
    }, [activeTabId, captureTabSnapshot, restoreTabSnapshot]);
    const removeTab = React.useCallback((tabId) => {
      const tab = tabs.find((t) => t.id === tabId);
      if (!window.confirm('Delete tab "' + (tab?.name || "Untitled") + '"? This cannot be undone.')) return;
      setTabs((prev) => {
        const remaining = prev.filter((t) => t.id !== tabId);
        if (remaining.length === 0) return prev;
        delete tabStateCacheRef.current[tabId];
        if (tabId === activeTabId) {
          const idx = prev.findIndex((t) => t.id === tabId);
          const nextTab = remaining[Math.min(idx, remaining.length - 1)];
          const cached = tabStateCacheRef.current[nextTab.id];
          if (cached) {
            restoreTabSnapshot(cached);
          } else {
            restoreTabSnapshot({});
            setLiveDataLoading(true);
          }
          queryCacheRef.current.clear();
          setActiveTabId(nextTab.id);
        }
        return remaining;
      });
    }, [activeTabId, tabs, restoreTabSnapshot]);
    const renameTab = React.useCallback((tabId, newName) => {
      setTabs((prev) => prev.map((t) => t.id === tabId ? { ...t, name: newName } : t));
    }, []);
    const styles = React.useMemo(
      () => ({
        ...STATIC_STYLES,
        // Only dynamic properties that depend on showAdvancedFilters
        container: {
          ...STATIC_STYLES.base.card,
          padding: "20px",
          fontFamily: "'Inter', 'Segoe UI', sans-serif",
          backgroundColor: theme.bgSecondary,
          minHeight: "100vh",
          position: "relative",
          paddingRight: showAdvancedFilters ? "390px" : "20px",
          border: "none",
          borderRadius: "0"
        },
        controlsContainer: {
          backgroundColor: isDarkMode ? "#334155" : theme.bgPrimary,
          borderRadius: "12px",
          width: "100%",
          overflowX: "hidden",
          overflowY: "visible",
          border: "none",
          boxShadow: isDarkMode ? "0 2px 8px rgba(0, 0, 0, 0.4)" : "0 1px 3px rgba(0, 0, 0, 0.1)"
        },
        chartContainer: {
          backgroundColor: isDarkMode ? "#334155" : theme.bgPrimary,
          borderRadius: "12px",
          flex: 1,
          overflow: "hidden",
          position: "relative",
          border: "none",
          boxShadow: isDarkMode ? "0 2px 8px rgba(0, 0, 0, 0.4)" : "0 1px 3px rgba(0, 0, 0, 0.1)"
        },
        statBox: {
          backgroundColor: isDarkMode ? "#334155" : theme.bgPrimary,
          padding: "16px 18px",
          borderRadius: "12px",
          border: "none",
          minWidth: "280px",
          flex: "1 1 0",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: "16px",
          cursor: "pointer",
          position: "relative",
          overflow: "hidden",
          boxShadow: isDarkMode ? "0 2px 8px rgba(0, 0, 0, 0.4)" : "0 1px 3px rgba(0, 0, 0, 0.1)",
          transition: "all 0.2s ease"
        },
        select: {
          ...STATIC_STYLES.base.input,
          cursor: "pointer",
          minWidth: "140px"
        },
        filterSuggestionsDropdown: {
          position: "fixed",
          backgroundColor: theme.bgPrimary,
          border: `1px solid ${theme.borderSecondary}`,
          borderRadius: "6px",
          maxHeight: "400px",
          overflowY: "auto",
          zIndex: 1e4
        },
        dateRangeGroup: {
          ...STATIC_STYLES.buttonGroup,
          padding: "1px"
        },
        dateRangeButton: {
          ...STATIC_STYLES.buttonGroupBtn,
          fontSize: "11px",
          padding: "5px 10px"
        },
        dateRangeButtonActive: STATIC_STYLES.buttonGroupBtnActive,
        dataFrequencyGroup: {
          ...STATIC_STYLES.buttonGroup,
          padding: "1px"
        },
        dataFrequencyButton: {
          ...STATIC_STYLES.buttonGroupBtn,
          padding: "5px 10px"
        },
        dataFrequencyButtonActive: STATIC_STYLES.buttonGroupBtnActive,
        topXModeButton: {
          flex: 1,
          ...STATIC_STYLES.buttonGroupBtn,
          padding: "6px 12px"
        },
        topXModeButtonActive: STATIC_STYLES.buttonGroupBtnActive,
        advancedFiltersToggle: {
          position: "fixed",
          top: "50%",
          right: showAdvancedFilters ? "370px" : "0px",
          transform: "translateY(-50%)",
          backgroundColor: theme.accentPrimary,
          color: "white",
          border: "none",
          padding: "12px 16px",
          borderRadius: "8px 0 0 8px",
          cursor: "pointer",
          fontSize: "14px",
          fontWeight: "500",
          zIndex: 1001,
          writingMode: "vertical-lr",
          textOrientation: "mixed",
          minHeight: "120px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        },
        advancedFiltersPanel: {
          position: "fixed",
          top: "0",
          right: showAdvancedFilters ? "0" : "-370px",
          width: "370px",
          height: "100vh",
          backgroundColor: theme.bgPrimary,
          zIndex: 1e3,
          overflowY: "auto",
          borderLeft: `1px solid ${isDarkMode ? "rgba(75, 85, 99, 0.3)" : "rgba(229, 231, 235, 0.6)"}`,
          boxShadow: isDarkMode ? "-4px 0 12px rgba(0, 0, 0, 0.3)" : "-4px 0 12px rgba(0, 0, 0, 0.1)",
          display: showAdvancedFilters ? "block" : "none"
        },
        queryContainer: {
          backgroundColor: "transparent",
          borderRadius: "0",
          padding: "0 0 18px 0",
          width: "100%",
          position: "relative",
          border: "none",
          boxShadow: "none"
        },
        structuredInsightsContainer: {
          backgroundColor: "transparent",
          borderRadius: "0",
          padding: "20px 0 0 0",
          marginTop: "12px",
          border: "none",
          boxShadow: "none"
        },
        summaryContainer: {
          ...STATIC_STYLES.base.card,
          padding: showDataSummary ? "16px" : "0px 16px 6px 16px",
          marginTop: showDataSummary ? "8px" : "4px"
        },
        proTipBanner: {
          background: "linear-gradient(90deg, #fefce8 0%, #fef9c3 100%)",
          borderRadius: "6px",
          padding: "6px 12px",
          marginBottom: "8px",
          marginTop: "-12px",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          border: "1px solid #fde047",
          position: "relative",
          overflow: "hidden"
        },
        proTipIcon: {
          fontSize: "14px",
          flexShrink: 0
        },
        proTipContent: {
          flex: 1,
          display: "flex",
          alignItems: "center",
          gap: "6px",
          minWidth: 0
        },
        proTipLabel: {
          backgroundColor: "#facc15",
          color: "#713f12",
          fontSize: "9px",
          fontWeight: "600",
          padding: "2px 6px",
          borderRadius: "3px",
          textTransform: "uppercase",
          letterSpacing: "0.3px",
          flexShrink: 0
        },
        proTipTitle: {
          fontWeight: "600",
          fontSize: "12px",
          color: "#a16207",
          marginRight: "4px",
          flexShrink: 0
        },
        proTipText: {
          fontSize: "11px",
          color: "#854d0e",
          lineHeight: "1.3",
          overflow: "hidden",
          textOverflow: "ellipsis"
        },
        proTipNavigation: {
          display: "flex",
          alignItems: "center",
          gap: "4px",
          flexShrink: 0
        },
        proTipNavButton: {
          width: "20px",
          height: "20px",
          borderRadius: "50%",
          border: "1px solid #fcd34d",
          backgroundColor: "rgba(255, 255, 255, 0.5)",
          color: "#a16207",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "11px",
          fontWeight: "bold",
          transition: "all 0.15s ease"
        },
        proTipCounter: {
          fontSize: "10px",
          color: "#a16207",
          fontWeight: "500",
          minWidth: "32px",
          textAlign: "center"
        }
      }),
      [showAdvancedFilters, showDataSummary, isDarkMode]
    );
    React.useEffect(() => {
      if (dataFrequency === "Yearly" && dateRange !== "All") {
        setDateRange("All");
      }
    }, [dataFrequency]);
    const [filterSearchText, setFilterSearchText] = React.useState("");
    const [debouncedFilterSearchText, setDebouncedFilterSearchText] = React.useState("");
    const [showFilterSuggestions, setShowFilterSuggestions] = React.useState(false);
    const filterSearchInputRef = React.useRef(null);
    const filterSuggestionsDropdownRef = React.useRef(null);
    const [dropdownStyle, setDropdownStyle] = React.useState({});
    const [showAllShareTraces, setShowAllShareTraces] = React.useState(false);
    const [showAllGrowthTraces, setShowAllGrowthTraces] = React.useState(false);
    const [showAllDollarTraces, setShowAllDollarTraces] = React.useState(true);
    React.useEffect(() => {
      if (pendingTraceTogglesRef.current) {
        const p = pendingTraceTogglesRef.current;
        if (p.showAllDollarTraces !== void 0) setShowAllDollarTraces(p.showAllDollarTraces);
        if (p.showAllShareTraces !== void 0) setShowAllShareTraces(p.showAllShareTraces);
        if (p.showAllGrowthTraces !== void 0) setShowAllGrowthTraces(p.showAllGrowthTraces);
        pendingTraceTogglesRef.current = null;
      }
    });
    React.useEffect(() => {
      if (!connectionParams || !liveSchemaReady || !activeTabId) return;
      const selectionsKey = "uiSelections_" + connectionParams.supabaseUrl + "_" + activeTabId;
      try {
        const saved = localStorage.getItem(selectionsKey);
        if (saved) {
          const existing = JSON.parse(saved);
          existing.showAllDollarTraces = showAllDollarTraces;
          existing.showAllShareTraces = showAllShareTraces;
          existing.showAllGrowthTraces = showAllGrowthTraces;
          localStorage.setItem(selectionsKey, JSON.stringify(existing));
        }
      } catch (e) {
      }
    }, [connectionParams, liveSchemaReady, activeTabId, showAllDollarTraces, showAllShareTraces, showAllGrowthTraces]);
    const [queryText, setQueryText] = React.useState("");
    const [showQueryTooltip, setShowQueryTooltip] = React.useState(false);
    const lastExecutedQueryRef = React.useRef("");
    const [isLLMLoading, setIsLLMLoading] = React.useState(false);
    const [llmError, setLlmError] = React.useState("");
    const [llmExplanation, setLlmExplanation] = React.useState("");
    const [showInsightTooltips, setShowInsightTooltips] = React.useState({});
    const [insightPagination, setInsightPagination] = React.useState({});
    const [hoveredInsight, setHoveredInsight] = React.useState(null);
    const [loadingInsights, setLoadingInsights] = React.useState(false);
    const [structuredInsights, setStructuredInsights] = React.useState({
      basicInsights: {
        decomposition: [],
        // 🆕 NEW - excess growth decomposition
        overallTrends: [],
        marketLeaders: [],
        performanceAlerts: [],
        categoryTrends: [],
        shareShifts: []
      },
      advancedInsights: {
        allTimeGrowth: []
      },
      recommendations: []
    });
    const INSIGHT_LIMITS = {
      generation: {
        performanceAlerts: 15,
        overallTrends: 10,
        categoryTrends: 20,
        shareShifts: 20,
        marketLeaders: 15,
        allTimeGrowth: 15
      },
      pagination: {
        perPage: 3
        // Consistent across all categories
      }
    };
    const [expandedFilters, setExpandedFilters] = React.useState({});
    const [history, setHistory] = React.useState([]);
    const isRestoringRef = React.useRef(false);
    const previousStateRef = React.useRef(null);
    const isExecutingQueryRef = React.useRef(false);
    const filterDropdownPositionRef = React.useRef(null);
    const [showShareModal, setShowShareModal] = React.useState(false);
    const [shareCode, setShareCode] = React.useState("");
    const [showSaveViewModal, setShowSaveViewModal] = React.useState(false);
    const [saveViewName, setSaveViewName] = React.useState("");
    const [saveViewOwnerType, setSaveViewOwnerType] = React.useState("username");
    const [saveViewCustomOwner, setSaveViewCustomOwner] = React.useState("");
    const [saveViewError, setSaveViewError] = React.useState("");
    const [saveViewSuccess, setSaveViewSuccess] = React.useState("");
    const [username, setUsername] = React.useState("");
    const [teamName, setTeamName] = React.useState("");
    const [savedViews, setSavedViews] = React.useState([]);
    const [selectedSavedView, setSelectedSavedView] = React.useState("");
    const renderCountRef = React.useRef(0);
    const filterTimeRef = React.useRef(0);
    const renderStartTime = performance.now();
    const hasCheckedInitialLoadRef = React.useRef(false);
    const [scenario1, setScenario1] = React.useState(null);
    const [scenario2, setScenario2] = React.useState(null);
    const [scenario3, setScenario3] = React.useState(null);
    const [activeScenarios, setActiveScenarios] = React.useState({
      scenario1: false,
      scenario2: false,
      scenario3: false
    });
    const [scenarioLabels, setScenarioLabels] = React.useState({
      scenario1: "Scenario 1",
      scenario2: "Scenario 2",
      scenario3: "Scenario 3"
    });
    const [showScenarioPanel, setShowScenarioPanel] = React.useState(false);
    const [traceVisibility, setTraceVisibility] = React.useState({});
    const chartRef = React.useRef(null);
    const [showGuide, setShowGuide] = React.useState(false);
    const [guideStep, setGuideStep] = React.useState(0);
    const [showGuideButton, setShowGuideButton] = React.useState(true);
    const guideTargetRefs = React.useRef({});
    const PRO_TIPS = React.useMemo(
      () => [
        {
          icon: "\u{1F4C5}",
          title: "Weekly Business Review",
          text: 'Switch to Weekly view by changing Date Aggregation \u2192 then click "Insights" to analyze week-over-week trends.'
        },
        {
          icon: "\u{1F4C8}",
          title: "Split by Dimension",
          text: 'Use "Split By" to see top 3 categories of any dimension. Change to top 5 or custom select using the control in the top-right corner of the chart.'
        },
        {
          icon: "\u{1F3B2}",
          title: "Quick Query",
          text: 'Click "\u{1F3B2} Feeling Lucky" to generate example queries with the correct pattern, then click "Ask" to visualize the data.'
        },
        {
          icon: "\u{1F517}",
          title: "Share Your View",
          text: 'Click the "\u{1F517} Share" button to generate a unique link to your current chart configuration. Anyone with the link sees the exact same view.'
        },
        {
          icon: "\u{1F4CA}",
          title: "Compare Scenarios",
          text: 'Use the "\u{1F4CA}" button to capture and compare up to 3 different scenarios. Currently in Beta version.'
        },
        {
          icon: "\u{1F3AF}",
          title: "Filter Smart",
          text: "Type in the filter search box to quickly find and apply filters. It searches across all dimensions \u2014 much faster than scrolling through dropdowns."
        },
        {
          icon: "\u{1F4A1}",
          title: "Insights Panel",
          text: 'Click "\u2728 Click for Insights" to get auto-generated analysis. Toggle between "Solo Insights" (single dimension) and "Cross Insights" (multi-dimensional).'
        },
        {
          icon: "\u{1F4C9}",
          title: "Track Visibility",
          text: "Click on legend items in the chart to show/hide specific traces. Double-click to isolate a single trace. Your visibility preferences persist across changes."
        }
      ],
      []
    );
    const [currentTipIndex, setCurrentTipIndex] = React.useState(
      () => Math.floor(Math.random() * 8)
    );
    React.useEffect(() => {
      const tipInterval = setInterval(() => {
        setCurrentTipIndex((prev) => (prev + 1) % PRO_TIPS.length);
      }, 12e4);
      return () => clearInterval(tipInterval);
    }, [PRO_TIPS.length]);
    const insightsCacheRef = React.useRef({});
    const captureStateSnapshot = React.useCallback(() => {
      const snapshot = {
        dataFrequency,
        metric,
        view,
        topX,
        dateRange,
        activeInsightsTab,
        selectedCategories: [...selectedCategories],
        categorySelectionMode,
        showAllShareTraces,
        showAllGrowthTraces,
        showAllDollarTraces,
        // Scenario comparison state
        scenario1,
        scenario2,
        scenario3,
        activeScenarios: { ...activeScenarios },
        scenarioLabels: { ...scenarioLabels },
        showScenarioPanel,
        // Legend visibility state
        traceVisibility: { ...traceVisibility },
        // 🆕 Investigation context state
        insightContext: insightContext ? { ...insightContext } : null
      };
      FILTER_CONFIG.forEach(({ key, state }) => {
        snapshot[key] = [...state];
      });
      return snapshot;
    }, [
      dataFrequency,
      metric,
      view,
      topX,
      dateRange,
      activeInsightsTab,
      selectedCategories,
      categorySelectionMode,
      showAllShareTraces,
      showAllGrowthTraces,
      showAllDollarTraces,
      scenario1,
      scenario2,
      scenario3,
      activeScenarios,
      scenarioLabels,
      showScenarioPanel,
      traceVisibility,
      insightContext,
      FILTER_CONFIG
    ]);
    const restoreStateSnapshot = React.useCallback(
      (snapshot) => {
        isRestoringRef.current = true;
        setDataFrequency(snapshot.dataFrequency);
        setMetric(snapshot.metric);
        setInsightContext(snapshot.insightContext || null);
        setTopX(snapshot.topX);
        setDateRange(snapshot.dateRange);
        setActiveInsightsTab(snapshot.activeInsightsTab);
        FILTER_CONFIG.forEach(({ key, setState }) => {
          if (snapshot[key]) {
            setState(snapshot[key]);
          }
        });
        if (snapshot.showAllShareTraces !== void 0) {
          setShowAllShareTraces(snapshot.showAllShareTraces);
        }
        if (snapshot.showAllGrowthTraces !== void 0) {
          setShowAllGrowthTraces(snapshot.showAllGrowthTraces);
        }
        if (snapshot.showAllDollarTraces !== void 0) {
          setShowAllDollarTraces(snapshot.showAllDollarTraces);
        }
        if (snapshot.selectedCategories) {
          setSelectedCategories([...snapshot.selectedCategories]);
        }
        if (snapshot.categorySelectionMode) {
          setCategorySelectionMode(snapshot.categorySelectionMode);
        }
        if (snapshot.scenario1 !== void 0) {
          setScenario1(snapshot.scenario1);
        }
        if (snapshot.scenario2 !== void 0) {
          setScenario2(snapshot.scenario2);
        }
        if (snapshot.scenario3 !== void 0) {
          setScenario3(snapshot.scenario3);
        }
        if (snapshot.activeScenarios !== void 0) {
          setActiveScenarios({ ...snapshot.activeScenarios });
        }
        if (snapshot.scenarioLabels !== void 0) {
          setScenarioLabels({ ...snapshot.scenarioLabels });
        }
        if (snapshot.showScenarioPanel !== void 0) {
          setShowScenarioPanel(snapshot.showScenarioPanel);
        }
        if (snapshot.traceVisibility !== void 0) {
          setTraceVisibility({ ...snapshot.traceVisibility });
        }
        setView(snapshot.view || "Overall");
        setTimeout(() => {
          isRestoringRef.current = false;
        }, 100);
      },
      [FILTER_CONFIG]
    );
    restoreStateSnapshotRef.current = restoreStateSnapshot;
    React.useEffect(() => {
      if (!liveSchemaReady || !pendingStateRef.current) return;
      const state = pendingStateRef.current;
      pendingStateRef.current = null;
      if (restoreStateSnapshotRef.current) {
        try {
          restoreStateSnapshotRef.current(state);
        } catch (e) {
          console.warn("Failed to restore shared state:", e);
        }
      }
    }, [liveSchemaReady]);
    const handleUndo = React.useCallback(() => {
      if (history.length > 0) {
        const previousState = history[history.length - 1];
        setHistory((prev) => prev.slice(0, -1));
        restoreStateSnapshot(previousState);
      }
    }, [history, restoreStateSnapshot]);
    const clearScenario = React.useCallback((index) => {
      if (index === 1) {
        setScenario1(null);
        setActiveScenarios((prev) => ({ ...prev, scenario1: false }));
      } else if (index === 2) {
        setScenario2(null);
        setActiveScenarios((prev) => ({ ...prev, scenario2: false }));
      } else if (index === 3) {
        setScenario3(null);
        setActiveScenarios((prev) => ({ ...prev, scenario3: false }));
      }
    }, []);
    const toggleScenario = React.useCallback((index) => {
      setActiveScenarios((prev) => {
        const key = `scenario${index}`;
        return { ...prev, [key]: !prev[key] };
      });
    }, []);
    const updateScenarioLabel = React.useCallback((index, label) => {
      setScenarioLabels((prev) => {
        const key = `scenario${index}`;
        return { ...prev, [key]: label };
      });
    }, []);
    const scrollToElementForGuide = React.useCallback((element) => {
      if (!element) return;
      setTimeout(() => {
        const rect = element.getBoundingClientRect();
        const tooltipTop = window.innerHeight - 430;
        if (rect.bottom > tooltipTop) {
          window.scrollTo({
            top: window.pageYOffset + rect.bottom - tooltipTop + 50,
            behavior: "smooth"
          });
        } else {
          element.scrollIntoView({
            behavior: "smooth",
            block: "center",
            inline: "nearest"
          });
        }
      }, 50);
    }, []);
    const startGuide = React.useCallback(() => {
      setShowGuide(true);
      setGuideStep(0);
      setTimeout(() => {
        const element = document.querySelector(GUIDE_STEPS[0].targetSelector);
        if (element) {
          guideTargetRefs.current[GUIDE_STEPS[0].id] = element;
          scrollToElementForGuide(element);
        }
      }, 300);
    }, [scrollToElementForGuide]);
    const nextStep = React.useCallback(() => {
      if (guideStep < GUIDE_STEPS.length - 1) {
        const nextIndex = guideStep + 1;
        setGuideStep(nextIndex);
        if (GUIDE_STEPS[nextIndex].id === "top-x-control" && view === "Overall") {
          const firstView = Object.keys(VIEW_CONFIG)[0];
          if (firstView) {
            setView(firstView);
          }
        }
        setTimeout(() => {
          const element = document.querySelector(
            GUIDE_STEPS[nextIndex].targetSelector
          );
          if (element) {
            guideTargetRefs.current[GUIDE_STEPS[nextIndex].id] = element;
            scrollToElementForGuide(element);
          }
        }, 150);
      } else {
        setShowGuide(false);
        setGuideStep(0);
      }
    }, [guideStep, scrollToElementForGuide, view, VIEW_CONFIG]);
    const previousStep = React.useCallback(() => {
      if (guideStep > 0) {
        const prevIndex = guideStep - 1;
        setGuideStep(prevIndex);
        setTimeout(() => {
          const element = document.querySelector(
            GUIDE_STEPS[prevIndex].targetSelector
          );
          if (element) {
            guideTargetRefs.current[GUIDE_STEPS[prevIndex].id] = element;
            scrollToElementForGuide(element);
          }
        }, 150);
      }
    }, [guideStep, scrollToElementForGuide]);
    const skipGuide = React.useCallback(() => {
      setShowGuide(false);
      setGuideStep(0);
    }, []);
    const compressState2 = React.useCallback(
      (snapshot) => compressState(snapshot, DIMENSION_DEFINITIONS),
      [DIMENSION_DEFINITIONS]
    );
    const generateShareCode2 = React.useCallback(() => {
      const snapshot = captureStateSnapshot();
      return generateShareCode(snapshot, DIMENSION_DEFINITIONS);
    }, [captureStateSnapshot, DIMENSION_DEFINITIONS]);
    const decodeShareCode2 = React.useCallback(
      (code) => decodeShareCode(code, DIMENSION_DEFINITIONS),
      [DIMENSION_DEFINITIONS]
    );
    const handleShareClick = React.useCallback(async () => {
      if (!configId) return;
      const snapshot = captureStateSnapshot();
      snapshot.activeTabId = activeTabId;
      const stateStr = btoa(JSON.stringify(snapshot)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
      const url = window.location.origin + window.location.pathname + "#/" + configId + "?s=" + stateStr;
      try {
        await navigator.clipboard.writeText(url);
      } catch (e) {
      }
      setShareCode(url);
      setShowShareModal(true);
    }, [captureStateSnapshot, activeTabId, configId]);
    const saveToGoogleSheets = React.useCallback((viewData) => {
      const WEB_APP_URL = "https://your-apps-script-deployment-url.example.com/exec";
      const query = new URLSearchParams({
        timestamp: viewData.timestamp || "",
        viewName: viewData.viewName || "",
        owner: viewData.owner || "",
        ownerType: viewData.ownerType || "",
        configurationCode: viewData.configurationCode || ""
      }).toString();
      const fullUrl = WEB_APP_URL + "?" + query;
      window.open(fullUrl, "_blank", "noopener,noreferrer");
      return Promise.resolve({ success: true, url: fullUrl });
    }, []);
    const handleLoadSavedView = React.useCallback(
      (viewName) => {
        if (!viewName) {
          setSelectedSavedView("");
          return;
        }
        const savedView = savedViews.find((v) => v.name === viewName);
        if (!savedView) {
          return;
        }
        const decodedState = decodeShareCode2(savedView.code);
        if (decodedState) {
          isRestoringRef.current = true;
          restoreStateSnapshot(decodedState);
          setTimeout(() => {
            isRestoringRef.current = false;
          }, 100);
          setSelectedSavedView(viewName);
        }
      },
      [savedViews, decodeShareCode2, restoreStateSnapshot]
    );
    const handleSaveView = React.useCallback(() => {
      if (!saveViewName.trim()) {
        setSaveViewError("Please enter a view name");
        return;
      }
      if (saveViewOwnerType === "custom" && !saveViewCustomOwner.trim()) {
        setSaveViewError("Please enter a custom owner name");
        return;
      }
      let owner = "";
      let ownerType = "";
      if (saveViewOwnerType === "username") {
        owner = username || "unknown_user";
        ownerType = "username";
      } else if (saveViewOwnerType === "team") {
        owner = teamName || "unknown_team";
        ownerType = "team";
      } else {
        owner = saveViewCustomOwner.trim();
        ownerType = "custom";
      }
      const configCode = generateShareCode2();
      const viewData = {
        viewName: saveViewName.trim(),
        owner,
        ownerType,
        configurationCode: configCode,
        timestamp: (/* @__PURE__ */ new Date()).toISOString().split("T")[0]
        // Format as YYYY-MM-DD
      };
      saveToGoogleSheets(viewData).then(() => {
        setSaveViewSuccess(
          "Saving... Check the new tab that opened. If you don't see a new tab, please allow popups for this site."
        );
        setSaveViewError("");
        setTimeout(() => {
          setShowSaveViewModal(false);
          setSaveViewName("");
          setSaveViewCustomOwner("");
          setSaveViewOwnerType("username");
          setSaveViewSuccess("");
        }, 3e3);
      }).catch((error) => {
        setSaveViewError(
          error.message || "Failed to save view. Please try again."
        );
        setSaveViewSuccess("");
      });
    }, [
      saveViewName,
      saveViewOwnerType,
      saveViewCustomOwner,
      username,
      teamName,
      generateShareCode2,
      saveToGoogleSheets
    ]);
    const arraysEqual = (a, b) => {
      if (a === b) return true;
      if (!a || !b) return false;
      return JSON.stringify(a) === JSON.stringify(b);
    };
    React.useEffect(() => {
      const timeoutId = setTimeout(() => {
        setDebouncedFilterSearchText(filterSearchText);
      }, 150);
      return () => clearTimeout(timeoutId);
    }, [filterSearchText]);
    React.useEffect(() => {
      if (hasCheckedInitialLoadRef.current) return;
      if (!metadataVariables.shared_configuration) return;
      hasCheckedInitialLoadRef.current = true;
      const sharedConfigValue = metadataVariables.shared_configuration;
      if (typeof sharedConfigValue === "string" && sharedConfigValue.trim().length > 0) {
        const codeFromData = sharedConfigValue.trim();
        const decodedState = decodeShareCode2(codeFromData);
        if (decodedState) {
          isRestoringRef.current = true;
          restoreStateSnapshot(decodedState);
          setTimeout(() => {
            isRestoringRef.current = false;
          }, 100);
        }
      }
    }, [metadataVariables, decodeShareCode2, restoreStateSnapshot]);
    React.useEffect(() => {
      if (metadataVariables.username && !username) {
        setUsername(metadataVariables.username.toString());
      }
      if (metadataVariables.team && !teamName) {
        setTeamName(metadataVariables.team.toString());
      }
    }, [metadataVariables, username, teamName]);
    React.useEffect(() => {
      if (metadataVariables.saved_views.length > 0) {
        setSavedViews(metadataVariables.saved_views);
      }
    }, [metadataVariables]);
    React.useEffect(() => {
      if (isRestoringRef.current) {
        previousStateRef.current = captureStateSnapshot();
        return;
      }
      const currentSnapshot = captureStateSnapshot();
      if (previousStateRef.current === null) {
        previousStateRef.current = currentSnapshot;
        return;
      }
      const prevSnapshot = previousStateRef.current;
      const hasChanged = prevSnapshot.dataFrequency !== currentSnapshot.dataFrequency || prevSnapshot.metric !== currentSnapshot.metric || prevSnapshot.view !== currentSnapshot.view || prevSnapshot.topX !== currentSnapshot.topX || prevSnapshot.dateRange !== currentSnapshot.dateRange || // Check all filters using FILTER_CONFIG_STATIC (only need key)
      FILTER_CONFIG_STATIC.some(
        ({ key }) => !arraysEqual(prevSnapshot[key], currentSnapshot[key])
      );
      if (hasChanged) {
        setHistory((prev) => {
          const newHistory = [...prev, prevSnapshot];
          return newHistory.slice(-10);
        });
      }
      previousStateRef.current = currentSnapshot;
    }, [
      dataFrequency,
      metric,
      view,
      topX,
      dateRange,
      captureStateSnapshot,
      FILTER_CONFIG
    ]);
    React.useEffect(() => {
      if (isRestoringRef.current || isExecutingQueryRef.current) {
        return;
      }
      setSelectedCategories([]);
      setCategorySelectionMode("topX");
      setShowTopXControl(false);
      setCategorySearchText("");
    }, [view]);
    React.useEffect(() => {
      const handleClickOutside = (event) => {
        if (showTopXControl && !event.target.closest("[data-topx-control]")) {
          setShowTopXControl(false);
        }
        if (showFilterSuggestions && filterSearchInputRef.current && filterSuggestionsDropdownRef.current && !filterSearchInputRef.current.contains(event.target) && !filterSuggestionsDropdownRef.current.contains(event.target)) {
          setShowFilterSuggestions(false);
        }
        if (showAddTab && !event.target.closest("[data-add-tab]")) {
          setShowAddTab(false);
          setNewTabDataset("");
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [showTopXControl, showFilterSuggestions, showAddTab]);
    React.useEffect(() => {
      const timer = setTimeout(() => {
        setShowGuideButton(false);
      }, 12e4);
      return () => clearTimeout(timer);
    }, []);
    const toggleFilterExpansion = React.useCallback((filterName) => {
      setExpandedFilters((prev) => ({
        ...prev,
        [filterName]: !prev[filterName]
      }));
    }, []);
    const mouseHandlers = React.useMemo(
      () => ({
        hoverEnter: (e, bgColor = "#f0f9ff", borderColor = "#6366f1") => {
          e.currentTarget.style.backgroundColor = bgColor;
          if (borderColor) e.currentTarget.style.borderColor = borderColor;
        },
        hoverLeave: (e, bgColor = "transparent", borderColor = null) => {
          e.currentTarget.style.backgroundColor = bgColor;
          if (borderColor) e.currentTarget.style.borderColor = borderColor;
        },
        headerHover: (e) => {
          e.currentTarget.style.backgroundColor = "#f9fafb";
        },
        headerLeave: (e) => {
          e.currentTarget.style.backgroundColor = "transparent";
        }
      }),
      []
    );
    const formatFilterName2 = React.useCallback(
      (filterName) => formatFilterName(filterName),
      []
    );
    const renderDropdownFilter = React.useCallback(
      (filterName, label, options, selectedValues, onSelectionChange, formatValue = formatFilterName2) => {
        const isExpanded = expandedFilters[filterName];
        const allSelected = selectedValues.length === 0 || selectedValues.length === options.length;
        const selectedCount = selectedValues.length;
        const handleAllToggle = () => {
          if (allSelected) {
            onSelectionChange([]);
          } else {
            onSelectionChange(options);
          }
        };
        const handleOptionToggle = (value) => {
          if (selectedValues.includes(value)) {
            onSelectionChange(selectedValues.filter((v) => v !== value));
          } else {
            onSelectionChange([...selectedValues, value]);
          }
        };
        return /* @__PURE__ */ React.createElement("div", { style: styles.inputGroup }, /* @__PURE__ */ React.createElement("div", { style: styles.filterDropdown }, /* @__PURE__ */ React.createElement(
          "div",
          {
            style: styles.filterDropdownHeader,
            onClick: () => toggleFilterExpansion(filterName)
          },
          /* @__PURE__ */ React.createElement("div", { style: styles.filterDropdownTitle }, /* @__PURE__ */ React.createElement("span", null, label), selectedCount > 0 && !allSelected && /* @__PURE__ */ React.createElement("span", { style: styles.filterSelectedCount }, "(", selectedCount, " selected)"), allSelected && /* @__PURE__ */ React.createElement("span", { style: styles.filterSelectedCount }, "(All)")),
          /* @__PURE__ */ React.createElement(
            "span",
            {
              style: {
                ...styles.filterDropdownChevron,
                transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)"
              }
            },
            "\u25BC"
          )
        ), isExpanded && /* @__PURE__ */ React.createElement("div", { style: styles.filterDropdownContent }, /* @__PURE__ */ React.createElement(
          "div",
          {
            style: allSelected ? styles.checkboxItemSelected : styles.checkboxItemUnselected,
            onClick: handleAllToggle
          },
          /* @__PURE__ */ React.createElement(
            "input",
            {
              type: "checkbox",
              style: styles.checkboxInput,
              checked: allSelected,
              onChange: handleAllToggle
            }
          ),
          /* @__PURE__ */ React.createElement("span", { style: styles.checkboxLabel }, "All")
        ), options.map((option) => {
          const isSelected = selectedValues.includes(option);
          return /* @__PURE__ */ React.createElement(
            "div",
            {
              key: String(option),
              style: isSelected ? styles.checkboxItemSelected : styles.checkboxItemUnselected,
              onClick: () => handleOptionToggle(option)
            },
            /* @__PURE__ */ React.createElement(
              "input",
              {
                type: "checkbox",
                style: styles.checkboxInput,
                checked: isSelected,
                onChange: () => handleOptionToggle(option)
              }
            ),
            /* @__PURE__ */ React.createElement("span", { style: styles.checkboxLabel }, formatValue(option))
          );
        }))));
      },
      [expandedFilters, toggleFilterExpansion, formatFilterName2]
    );
    const renderTooltipIcon = React.useCallback(
      (categoryKey, tooltipText) => {
        const isVisible = showInsightTooltips[categoryKey];
        return /* @__PURE__ */ React.createElement(
          "div",
          {
            style: styles.queryTooltipIcon,
            onMouseEnter: () => {
              setShowInsightTooltips((prev) => ({
                ...prev,
                [categoryKey]: true
              }));
            },
            onMouseLeave: () => {
              setShowInsightTooltips((prev) => ({
                ...prev,
                [categoryKey]: false
              }));
            }
          },
          /* @__PURE__ */ React.createElement(
            "svg",
            {
              width: "14",
              height: "14",
              viewBox: "0 0 20 20",
              fill: "none",
              xmlns: "http://www.w3.org/2000/svg",
              style: styles.block
            },
            /* @__PURE__ */ React.createElement(
              "circle",
              {
                cx: "10",
                cy: "10",
                r: "9",
                stroke: "currentColor",
                strokeWidth: "1.5",
                fill: "none"
              }
            ),
            /* @__PURE__ */ React.createElement(
              "path",
              {
                d: "M10 6v.01",
                stroke: "currentColor",
                strokeWidth: "1.5",
                strokeLinecap: "round"
              }
            ),
            /* @__PURE__ */ React.createElement(
              "path",
              {
                d: "M10 9v5",
                stroke: "currentColor",
                strokeWidth: "1.5",
                strokeLinecap: "round"
              }
            )
          ),
          isVisible && /* @__PURE__ */ React.createElement("div", { style: styles.queryTooltip }, /* @__PURE__ */ React.createElement("div", { style: styles.queryTooltipArrow }), /* @__PURE__ */ React.createElement("div", { style: styles.fontWeight600 }, "How it's calculated"), /* @__PURE__ */ React.createElement("div", { style: styles.textGray }, tooltipText))
        );
      },
      [showInsightTooltips, styles]
    );
    const getInsightSentiment2 = React.useCallback(
      (insightText) => getInsightSentiment(insightText),
      []
    );
    const getSentimentColors2 = React.useCallback(
      (sentiment) => getSentimentColors(sentiment, isDarkMode),
      [isDarkMode]
    );
    const colorizeInsightText = React.useCallback(
      (insightText, sentiment) => {
        const colors = getSentimentColors(sentiment, isDarkMode);
        const keywords = SENTIMENT_KEYWORDS[sentiment] || [];
        if (keywords.length === 0) return insightText;
        const pattern = new RegExp(`\\b(${keywords.join("|")})\\b`, "gi");
        const parts = [];
        let lastIndex = 0;
        let match;
        pattern.lastIndex = 0;
        while ((match = pattern.exec(insightText)) !== null) {
          if (match.index > lastIndex) {
            parts.push(insightText.substring(lastIndex, match.index));
          }
          parts.push(
            /* @__PURE__ */ React.createElement("span", { key: match.index, style: { color: colors.text, fontWeight: "600" } }, match[0])
          );
          lastIndex = match.index + match[0].length;
        }
        if (lastIndex < insightText.length) {
          parts.push(insightText.substring(lastIndex));
        }
        return parts.length > 0 ? parts : insightText;
      },
      [isDarkMode]
    );
    const SHOW_SENTIMENT_BORDER = true;
    const InsightItem = React.memo(
      ({
        insight,
        index,
        isHovered,
        colorConfig,
        showSentimentBorder,
        setHoveredInsight: setHoveredInsight2
      }) => {
        const sentiment = getInsightSentiment2(insight.text);
        const colorizedText = colorizeInsightText(insight.text, sentiment);
        const borderColor = showSentimentBorder ? getSentimentColors2(sentiment).border : colorConfig.borderColor;
        const handleMouseEnter = React.useCallback(() => {
          setHoveredInsight2(insight);
        }, [insight, setHoveredInsight2]);
        const handleMouseLeave = React.useCallback(() => {
          setHoveredInsight2(null);
        }, [setHoveredInsight2]);
        return /* @__PURE__ */ React.createElement(
          "div",
          {
            style: {
              ...styles.insightItem,
              borderLeft: `4px solid ${borderColor}`,
              backgroundColor: isHovered ? colorConfig.hoverBackgroundColor : colorConfig.backgroundColor
            },
            onClick: insight.action,
            onMouseEnter: handleMouseEnter,
            onMouseLeave: handleMouseLeave
          },
          /* @__PURE__ */ React.createElement("span", { style: styles.insightNumber }, index + 1, "."),
          /* @__PURE__ */ React.createElement("span", { style: styles.insightText }, colorizedText)
        );
      }
    );
    const renderInsightCategory = React.useCallback(
      (insights, title, categoryKey, tooltipText = null, colorConfig = {
        borderColor: theme.accentPrimary,
        backgroundColor: theme.bgSecondary,
        hoverBackgroundColor: theme.statBoxActiveBg,
        hoverBorderColor: theme.accentPrimary
      }) => {
        if (!insights || insights.length === 0) return null;
        const insightsPerPage = INSIGHT_LIMITS.pagination.perPage;
        const currentPage = insightPagination[categoryKey] || 0;
        const startIndex = currentPage * insightsPerPage;
        const endIndex = startIndex + insightsPerPage;
        const paginatedInsights = insights.slice(startIndex, endIndex);
        const totalPages = Math.ceil(insights.length / insightsPerPage);
        const hasPagination = insights.length > insightsPerPage;
        return /* @__PURE__ */ React.createElement("div", { style: styles.categorySection }, /* @__PURE__ */ React.createElement("h4", { style: styles.categoryTitle }, title, tooltipText && renderTooltipIcon(categoryKey, tooltipText)), /* @__PURE__ */ React.createElement("div", { style: styles.insightsList }, paginatedInsights.map((insight, index) => {
          return /* @__PURE__ */ React.createElement(
            InsightItem,
            {
              key: insight.text + startIndex + index,
              insight,
              index: startIndex + index,
              isHovered: hoveredInsight === insight,
              colorConfig,
              showSentimentBorder: SHOW_SENTIMENT_BORDER,
              setHoveredInsight
            }
          );
        })), hasPagination && /* @__PURE__ */ React.createElement("div", { style: { ...styles.flexBetween, marginTop: "12px" } }, /* @__PURE__ */ React.createElement(
          "button",
          {
            style: {
              padding: "4px 12px",
              border: "1px solid #d1d5db",
              borderRadius: "4px",
              backgroundColor: currentPage === 0 ? "#f3f4f6" : "white",
              color: currentPage === 0 ? "#9ca3af" : "#374151",
              cursor: currentPage === 0 ? "not-allowed" : "pointer",
              fontSize: "12px"
            },
            onClick: () => {
              if (currentPage > 0) {
                setInsightPagination((prev) => ({
                  ...prev,
                  [categoryKey]: currentPage - 1
                }));
              }
            },
            disabled: currentPage === 0
          },
          "Previous"
        ), /* @__PURE__ */ React.createElement("span", { style: { fontSize: "12px", color: "#6b7280" } }, "Page ", currentPage + 1, " of ", totalPages, " (", insights.length, " total)"), /* @__PURE__ */ React.createElement(
          "button",
          {
            style: {
              padding: "4px 12px",
              border: "1px solid #d1d5db",
              borderRadius: "4px",
              backgroundColor: currentPage >= totalPages - 1 ? "#f3f4f6" : "white",
              color: currentPage >= totalPages - 1 ? "#9ca3af" : "#374151",
              cursor: currentPage >= totalPages - 1 ? "not-allowed" : "pointer",
              fontSize: "12px"
            },
            onClick: () => {
              if (currentPage < totalPages - 1) {
                setInsightPagination((prev) => ({
                  ...prev,
                  [categoryKey]: currentPage + 1
                }));
              }
            },
            disabled: currentPage >= totalPages - 1
          },
          "Next"
        )));
      },
      [
        styles,
        showInsightTooltips,
        insightPagination,
        renderTooltipIcon,
        INSIGHT_LIMITS,
        setInsightPagination,
        mouseHandlers,
        hoveredInsight,
        setHoveredInsight,
        theme,
        isDarkMode
      ]
    );
    const filterMatches = React.useCallback((filterArray, value) => {
      if (!filterArray || filterArray.length === 0) return true;
      return filterArray.includes(value);
    }, []);
    const dateField = React.useMemo(() => {
      switch (dataFrequency) {
        case "Daily":
          return COLUMNS.REPORTING_DAY || COLUMNS.REPORTING_WEEK;
        case "Weekly":
          return COLUMNS.REPORTING_WEEK;
        case "Monthly":
          return COLUMNS.REPORTING_MONTH;
        case "Quarterly":
          return COLUMNS.REPORTING_QUARTER;
        case "Yearly":
          return COLUMNS.REPORTING_YEAR;
        default:
          return COLUMNS.REPORTING_MONTH;
      }
    }, [dataFrequency]);
    const liveAggRequestRef = React.useRef(0);
    React.useEffect(() => {
      if (!isLiveMode || !liveMetricConfig) return;
      const requestId = ++liveAggRequestRef.current;
      setLiveAggLoading(true);
      const grain = frequencyToGrain[dataFrequency] || "month";
      const dateCol = liveMetricConfig.dateColumn || liveDateColumn;
      const rpcMetrics = buildRpcMetrics(liveMetricConfig);
      const pFilters = {};
      Object.keys(dynamicFilters).forEach((filterKey) => {
        const vals = dynamicFilters[filterKey];
        if (!vals || vals.length === 0) return;
        const colName = filterKey.replace(/^dim_/, "").replace(/_filter$/, "");
        if (liveBooleanColumns.has(colName)) {
          pFilters[colName] = vals.map((v) => {
            const suffix = v.replace(colName + "_", "");
            return suffix === "true" ? true : suffix === "false" ? false : v;
          });
        } else {
          pFilters[colName] = vals;
        }
      });
      const viewConfig = view !== "Overall" ? VIEW_CONFIG[view] : null;
      const dimColumn = viewConfig ? viewConfig.column : null;
      const periodPromise = cachedQuery("data", {
        p_time_grain: grain,
        p_date_column: dateCol,
        p_metrics: rpcMetrics,
        p_filters: pFilters
      });
      const dimPromise = dimColumn ? cachedQuery("data", {
        p_time_grain: grain,
        p_date_column: dateCol,
        p_group_by: [dimColumn],
        p_metrics: rpcMetrics,
        p_filters: pFilters,
        ...topX > 0 ? { p_top_n: topX } : {}
        // p_rank_by omitted — requires updated query_dataset RPC (migration 015)
      }) : Promise.resolve(null);
      const hasMetric3 = !!liveMetricConfig.derivedAggType || liveMetricConfig.derivedMode === "formula";
      const formulaConfigs = {};
      if (liveMetricConfig.volumeMode === "formula") formulaConfigs.volume = { operator: liveMetricConfig.volumeFormulaOperator || "/" };
      if (liveMetricConfig.revenueMode === "formula") formulaConfigs.revenue = { operator: liveMetricConfig.revenueFormulaOperator || "/" };
      if (liveMetricConfig.derivedMode === "formula") formulaConfigs.derived = { operator: liveMetricConfig.derivedFormulaOperator || "/" };
      const formulaConfigsArg = Object.keys(formulaConfigs).length > 0 ? formulaConfigs : null;
      Promise.all([periodPromise, dimPromise]).then(([periodData, dimData]) => {
        if (requestId !== liveAggRequestRef.current) return;
        const periodAggs = transformToPeriodAggregates(periodData.rows || [], hasMetric3, formulaConfigsArg);
        setLivePeriodAggregates(periodAggs);
        if (dimData && dimColumn) {
          const dimAggs = transformToDimensionAggregates(dimData.rows || [], dimColumn, hasMetric3, formulaConfigsArg, liveBooleanColumns);
          setLiveDimensionAggregates(dimAggs);
          setLiveRowCount(dimData.row_count || (dimData.rows ? dimData.rows.length : 0));
          setLiveDataTruncated(!!dimData.truncated);
        } else {
          setLiveDimensionAggregates({});
          setLiveRowCount(periodData.row_count || (periodData.rows ? periodData.rows.length : 0));
          setLiveDataTruncated(!!periodData.truncated);
        }
        setLiveAggLoading(false);
      }).catch((err) => {
        if (requestId !== liveAggRequestRef.current) return;
        console.error("[Dashboard] Aggregation fetch error:", err);
        setLiveAggLoading(false);
      });
    }, [isLiveMode, liveMetricConfig, dataFrequency, dynamicFilters, view, VIEW_CONFIG, liveDateColumn, cachedQuery, topX, liveBooleanColumns]);
    React.useEffect(() => {
      if (!isLiveMode || !activeInsightsTab || !liveMetricConfig) return;
      let cancelled = false;
      const grain = frequencyToGrain[dataFrequency] || "month";
      const dateCol = liveMetricConfig.dateColumn || liveDateColumn;
      const rpcMetrics = buildRpcMetrics(liveMetricConfig);
      const pFilters = {};
      Object.keys(dynamicFilters).forEach((filterKey) => {
        const vals = dynamicFilters[filterKey];
        if (!vals || vals.length === 0) return;
        const colName = filterKey.replace(/^dim_/, "").replace(/_filter$/, "");
        if (liveBooleanColumns.has(colName)) {
          pFilters[colName] = vals.map((v) => {
            const suffix = v.replace(colName + "_", "");
            return suffix === "true" ? true : suffix === "false" ? false : v;
          });
        } else {
          pFilters[colName] = vals;
        }
      });
      const dimCols = visibleLiveDimensions.map((d) => d.name);
      if (dimCols.length === 0) return;
      const hasMetric3 = !!liveMetricConfig.derivedAggType || liveMetricConfig.derivedMode === "formula";
      const formulaConfigs = {};
      if (liveMetricConfig.volumeMode === "formula") formulaConfigs.volume = { operator: liveMetricConfig.volumeFormulaOperator || "/" };
      if (liveMetricConfig.revenueMode === "formula") formulaConfigs.revenue = { operator: liveMetricConfig.revenueFormulaOperator || "/" };
      if (liveMetricConfig.derivedMode === "formula") formulaConfigs.derived = { operator: liveMetricConfig.derivedFormulaOperator || "/" };
      const formulaConfigsArg = Object.keys(formulaConfigs).length > 0 ? formulaConfigs : null;
      const CONCURRENCY = 3;
      const merged = {};
      const fetchDim = (col) => cachedQuery("data", {
        p_time_grain: grain,
        p_date_column: dateCol,
        p_group_by: [col],
        p_metrics: rpcMetrics,
        p_filters: pFilters
      }).then((data) => {
        const aggs = transformToDimensionAggregates(data.rows || [], col, hasMetric3, formulaConfigsArg, liveBooleanColumns);
        Object.keys(aggs).forEach((key) => {
          if (key !== "_categoryTotals") merged[key] = aggs[key];
        });
      });
      const processBatches = async () => {
        for (let i = 0; i < dimCols.length; i += CONCURRENCY) {
          if (cancelled) return;
          const batch = dimCols.slice(i, i + CONCURRENCY);
          await Promise.all(batch.map(fetchDim));
        }
        if (!cancelled) setLiveInsightsDimAggs({ ...merged });
      };
      processBatches();
      return () => {
        cancelled = true;
      };
    }, [
      isLiveMode,
      activeInsightsTab,
      liveMetricConfig,
      dataFrequency,
      dynamicFilters,
      visibleLiveDimensions,
      cachedQuery,
      liveDateColumn,
      liveBooleanColumns
    ]);
    const periodChangeLabel = React.useMemo(() => {
      switch (dataFrequency) {
        case "Daily":
          return "DoD";
        case "Weekly":
          return "WoW";
        case "Monthly":
          return "MoM";
        case "Quarterly":
          return "QoQ";
        case "Yearly":
          return "YoY";
        default:
          return "Period";
      }
    }, [dataFrequency]);
    const dataExtracts = React.useMemo(() => {
      if (isLiveMode) {
        var liveAllDates = livePeriodAggregates ? Object.keys(livePeriodAggregates).sort() : [];
        var liveFoMap = {};
        FILTER_CONFIG_STATIC.forEach(function(fc2) {
          var colName = fc2.key.replace(/^dim_/, "").replace(/_filter$/, "");
          var vals = liveFilterOptions[colName] || [];
          liveFoMap[fc2.key] = ["All"].concat(vals);
        });
        return {
          allDates: liveAllDates,
          filterOptionsMap: liveFoMap,
          pricingTypes: ["All"],
          pricingTypeToGroup: /* @__PURE__ */ new Map()
        };
      }
      var rows = cleanedQueryData.rows;
      var n = rows.length;
      var dtCol = dateField;
      var ptCol = COLUMNS.PRODUCT_NAME;
      var ptgCol = COLUMNS.PRODUCT_GROUP_L1;
      var filterCols = [];
      for (var f = 0; f < FILTER_CONFIG_STATIC.length; f++) {
        var fc = FILTER_CONFIG_STATIC[f];
        filterCols.push({ key: fc.key, column: fc.column, values: /* @__PURE__ */ new Set() });
      }
      var fcLen = filterCols.length;
      var dateSet = /* @__PURE__ */ new Set();
      var ptToGroup = /* @__PURE__ */ new Map();
      for (var i = 0; i < n; i++) {
        var row = rows[i];
        var d = row[dtCol];
        if (d != null && d !== "") dateSet.add(d);
        for (var j = 0; j < fcLen; j++) {
          var val = row[filterCols[j].column];
          if (val && val !== "Unknown") filterCols[j].values.add(val);
        }
        var pm = row[ptCol];
        var pmf = row[ptgCol];
        if (pm && pmf) {
          ptToGroup.set(pm, pmf);
        }
      }
      var allDatesArr = Array.from(dateSet).sort();
      var foMap = {};
      for (var fi = 0; fi < fcLen; fi++) {
        foMap[filterCols[fi].key] = ["All"].concat(
          Array.from(filterCols[fi].values)
        );
      }
      var ptArr = foMap["pricingTypeFilter"] || ["All"];
      return {
        allDates: allDatesArr,
        filterOptionsMap: foMap,
        pricingTypes: ptArr,
        pricingTypeToGroup: ptToGroup
      };
    }, [isLiveMode, livePeriodAggregates, liveFilterOptions, cleanedQueryData.rows, dateField, FILTER_CONFIG_STATIC]);
    var allDates = dataExtracts.allDates;
    var filterOptionsMap = dataExtracts.filterOptionsMap;
    var pricingTypes = dataExtracts.pricingTypes;
    var pricingTypeToGroup = dataExtracts.pricingTypeToGroup;
    const periodToDateStr = React.useCallback((period) => {
      if (!period) return "";
      const qMatch = period.match(/^(\d{4})-Q(\d)$/);
      if (qMatch) {
        const mo = ((parseInt(qMatch[2]) - 1) * 3 + 1).toString().padStart(2, "0");
        return qMatch[1] + "-" + mo + "-01";
      }
      if (/^\d{4}$/.test(period)) return period + "-01-01";
      return period;
    }, []);
    const filteredDates = React.useMemo(() => {
      if (dateRange === "All") {
        return allDates;
      }
      const lastComparable = allDates.length > 0 ? periodToDateStr(allDates[allDates.length - 1]) : "";
      const now = /* @__PURE__ */ new Date(lastComparable + "T00:00:00");
      if (isNaN(now.getTime())) return allDates;
      const yearStart = now.getFullYear() + "-01-01";
      const oneYearAgo = now.getFullYear() - 1 + "-" + (now.getMonth() + 1).toString().padStart(2, "0") + "-" + now.getDate().toString().padStart(2, "0");
      const computeAgo = (months) => {
        const d = new Date(now);
        d.setMonth(d.getMonth() - months);
        return d.getFullYear() + "-" + (d.getMonth() + 1).toString().padStart(2, "0") + "-" + d.getDate().toString().padStart(2, "0");
      };
      const computeDaysAgo = (days) => {
        const d = new Date(now);
        d.setDate(d.getDate() - days);
        return d.getFullYear() + "-" + (d.getMonth() + 1).toString().padStart(2, "0") + "-" + d.getDate().toString().padStart(2, "0");
      };
      switch (dateRange) {
        case "7D":
          return allDates.filter((date) => periodToDateStr(date) >= computeDaysAgo(7));
        case "30D":
          return allDates.filter((date) => periodToDateStr(date) >= computeDaysAgo(30));
        case "QTD":
          return allDates.filter((date) => periodToDateStr(date) >= computeAgo(3));
        case "YTD":
          return allDates.filter((date) => periodToDateStr(date) >= yearStart);
        case "1Y":
          return allDates.filter((date) => periodToDateStr(date) >= oneYearAgo);
        default:
          return allDates;
      }
    }, [dateRange, allDates, periodToDateStr]);
    const filteredDatesSet = React.useMemo(() => {
      return new Set(filteredDates);
    }, [filteredDates]);
    const getFilterOptions = React.useCallback(
      (key) => {
        return filterOptionsMap[key] || [];
      },
      [filterOptionsMap]
    );
    const buildLLMSchema = React.useCallback(() => {
      const filters = {};
      FILTER_CONFIG_STATIC.forEach(({ key, label }) => {
        const opts = getFilterOptions(key);
        const values = opts.length > 1 ? opts.slice(1) : [];
        if (values.length > 0) {
          filters[key] = { label, values };
        }
      });
      const views = ["Overall", ...Object.keys(VIEW_CONFIG)];
      const metricMap = {
        metric1: METRIC_LABELS.metric1 || "Metric 1",
        metric2: METRIC_LABELS.metric2 || "Metric 2",
        metric3: METRIC_LABELS.metric3 || "Metric 3"
      };
      return {
        metrics: metricMap,
        views,
        dataFrequencies: isLiveMode ? ["Daily", "Weekly", "Monthly", "Quarterly", "Yearly"] : ["Weekly", "Monthly", "Quarterly", "Yearly"],
        dateRanges: DATE_RANGES,
        filters
      };
    }, [FILTER_CONFIG_STATIC, getFilterOptions, VIEW_CONFIG, METRIC_LABELS]);
    const filterOptionsWithoutAll = React.useMemo(() => {
      const map = {};
      Object.keys(filterOptionsMap).forEach((key) => {
        map[key] = filterOptionsMap[key].slice(1);
      });
      map.pricingTypeFilter = pricingTypes.slice(1);
      return map;
    }, [filterOptionsMap, pricingTypes]);
    const createFilterSearchOptionsForType = React.useCallback(
      (filterType, filterKey, optionsArray, setFilterFn, formatDisplayName = formatFilterName2) => {
        return optionsArray.slice(1).map((value) => ({
          type: filterType,
          filterKey,
          // Store key to look up state later
          value,
          displayName: formatDisplayName(value),
          searchText: `${filterType} ${value}`.toLowerCase().replace(/_/g, " "),
          action: () => {
            setFilterFn((prev) => {
              if (prev.includes(value)) {
                return prev.filter((v) => v !== value);
              } else {
                return [...prev, value];
              }
            });
          }
        }));
      },
      [formatFilterName2]
    );
    const createFilterSearchOptions = React.useMemo(() => {
      const options = FILTER_CONFIG_STATIC.flatMap(({ label, key }) => {
        const optionsArray = key === "pricingTypeFilter" ? pricingTypes : filterOptionsMap[key] || [];
        if (!optionsArray) return [];
        const setState = getFilterSetState(key);
        const formatValue = key === "pricingTypeFilter" ? void 0 : void 0;
        return createFilterSearchOptionsForType(
          label,
          key,
          optionsArray,
          setState,
          formatValue || formatFilterName2
        );
      });
      return options;
    }, [
      FILTER_CONFIG_STATIC,
      pricingTypes,
      filterOptionsMap,
      createFilterSearchOptionsForType,
      getFilterSetState,
      formatFilterName2
    ]);
    const allFilterSuggestions = React.useMemo(() => {
      const allOptions = createFilterSearchOptions;
      const grouped = {};
      allOptions.forEach((option) => {
        if (!grouped[option.type]) {
          grouped[option.type] = [];
        }
        grouped[option.type].push(option);
      });
      Object.keys(grouped).forEach((type) => {
        grouped[type].sort((a, b) => a.displayName.localeCompare(b.displayName));
      });
      const advancedFiltersOrder = [...DIMENSION_DEFINITIONS].sort((a, b) => a.displayOrder - b.displayOrder).map((dim) => dim.filterLabel);
      const orderedGrouped = {};
      advancedFiltersOrder.forEach((label) => {
        if (grouped[label]) {
          orderedGrouped[label] = grouped[label];
        } else {
          const matchingKey = Object.keys(grouped).find(
            (key) => key.toLowerCase() === label.toLowerCase() || key.includes(label) || label.includes(key)
          );
          if (matchingKey) {
            orderedGrouped[matchingKey] = grouped[matchingKey];
          }
        }
      });
      Object.keys(grouped).forEach((type) => {
        if (!orderedGrouped[type]) {
          orderedGrouped[type] = grouped[type];
        }
      });
      return orderedGrouped;
    }, [createFilterSearchOptions, FILTER_CONFIG]);
    const handleFilterSuggestionSelect = React.useCallback((suggestion) => {
      suggestion.action();
    }, []);
    const buildFilterDescription = React.useCallback(
      (mode, separator = ", ", prefix = "", suffix = "", emptyText = "") => {
        const activeFilters = [];
        if (dateRange !== "All") {
          const formatters = {
            active: () => dateRange,
            context: () => `${dateRange} timeframe`,
            short: () => dateRange
          };
          activeFilters.push(formatters[mode]());
        }
        const getFormatters = (filterConfig) => {
          const { label, formatValue, state } = filterConfig;
          const formatFn = formatValue || formatFilterName2;
          return {
            active: (arr) => arr.map(formatFn).join(", "),
            context: (arr) => {
              if (label.includes("Segment") || label.includes("Channel"))
                return `for ${arr.map(formatFn).join(", ")} users`;
              if (label.includes("Surface"))
                return `on ${arr.map(formatFn).join(", ")} surface`;
              if (label.includes("Region") || label.includes("Country"))
                return `in ${arr.map(formatFn).join(", ")}`;
              return `on ${arr.map(formatFn).join(", ")}`;
            },
            short: (arr) => arr.map(formatFn).join(", ")
          };
        };
        FILTER_CONFIG.forEach((filterConfig) => {
          const { state } = filterConfig;
          if (state.length > 0) {
            const formatters = getFormatters(filterConfig);
            activeFilters.push(formatters[mode](state));
          }
        });
        if (activeFilters.length === 0) return emptyText;
        return prefix + activeFilters.join(separator) + suffix;
      },
      [formatFilterName2, dateRange, FILTER_CONFIG]
    );
    const getSimpleChartTitle = React.useCallback(() => {
      const displayMetric = METRIC_LABELS[metric] || metric;
      const filterText = buildFilterDescription("active", ", ", "", "", "");
      if (filterText) {
        return `${displayMetric}
(Filtered by: ${filterText})`;
      }
      return displayMetric;
    }, [metric, METRIC_LABELS, buildFilterDescription]);
    const getFilterContext = React.useCallback(() => {
      return buildFilterDescription("context", " ", "", "", "All Data");
    }, [buildFilterDescription]);
    const getShortFilterContext = React.useCallback(() => {
      return buildFilterDescription("short", " x ", "", "", "All Data");
    }, [buildFilterDescription]);
    const resetAllFilters = React.useCallback(() => {
      if (isLiveMode) {
        setDynamicFilters({});
      } else {
        FILTER_CONFIG.forEach(({ setState }) => setState([]));
      }
      setDateRange("YTD");
      setView("Overall");
      setActiveInsightsTab(null);
      setFilterSearchText("");
      setShowFilterSuggestions(false);
      setInsightContext(null);
    }, [FILTER_CONFIG, isLiveMode]);
    const handleDataFrequencyChange = React.useCallback((newFrequency) => {
      setDataFrequency(newFrequency);
      setInsightContext(null);
    }, []);
    const baseFilteredData = React.useMemo(() => {
      const startTime = performance.now();
      const result = cleanedQueryData.rows.filter((row) => {
        if (row[dateField] == null || row[dateField] === "") return false;
        return FILTER_CONFIG.every(({ state, column }) => {
          return filterMatches(state, row[column]);
        });
      });
      filterTimeRef.current = performance.now() - startTime;
      return result;
    }, [cleanedQueryData.rows, filterMatches, FILTER_CONFIG, dateField]);
    const filteredData = React.useMemo(() => {
      return baseFilteredData.filter((row) => {
        return filteredDatesSet.has(row[dateField]);
      });
    }, [baseFilteredData, filteredDatesSet, dateField]);
    renderCountRef.current += 1;
    const dataByPeriod = React.useMemo(() => {
      const grouped = {};
      filteredData.forEach((row) => {
        const period = row[dateField];
        if (!grouped[period]) {
          grouped[period] = [];
        }
        grouped[period].push(row);
      });
      return grouped;
    }, [filteredData, dateField]);
    const buildPeriodAggregates2 = (data, dtField) => buildPeriodAggregates(data, dtField, COLUMNS);
    const baseDataAggregatesByPeriod = React.useMemo(
      () => isLiveMode ? livePeriodAggregates || {} : buildPeriodAggregates2(baseFilteredData, dateField),
      [isLiveMode, livePeriodAggregates, baseFilteredData, dateField]
    );
    const sortedBaseDataPeriods = React.useMemo(() => {
      return Object.keys(baseDataAggregatesByPeriod).sort();
    }, [baseDataAggregatesByPeriod]);
    const periodAggregates = React.useMemo(() => {
      var base = baseDataAggregatesByPeriod;
      var result = {};
      var periods2 = Object.keys(base);
      for (var p = 0; p < periods2.length; p++) {
        var period = periods2[p];
        if (filteredDatesSet.has(period)) {
          result[period] = base[period];
        }
      }
      return result;
    }, [baseDataAggregatesByPeriod, filteredDatesSet]);
    const buildDimensionAggregates2 = (data, dtField) => buildDimensionAggregates(data, dtField, COLUMNS, DIMENSION_DEFINITIONS);
    const baseDimensionAggregates = React.useMemo(
      () => isLiveMode ? liveDimensionAggregates || { _categoryTotals: {} } : buildDimensionAggregates2(baseFilteredData, dateField),
      [isLiveMode, liveDimensionAggregates, baseFilteredData, dateField]
    );
    const dimensionAggregates = React.useMemo(() => {
      var base = baseDimensionAggregates;
      var result = {};
      var categoryTotals = {};
      var columns = Object.keys(base);
      for (var c = 0; c < columns.length; c++) {
        var col = columns[c];
        if (col === "_categoryTotals") continue;
        result[col] = {};
        categoryTotals[col] = {};
        var periods2 = Object.keys(base[col]);
        for (var p = 0; p < periods2.length; p++) {
          var period = periods2[p];
          if (!filteredDatesSet.has(period)) continue;
          result[col][period] = base[col][period];
          var cats = Object.keys(base[col][period]);
          for (var k = 0; k < cats.length; k++) {
            var cat = cats[k];
            var agg = base[col][period][cat];
            if (!categoryTotals[col][cat]) {
              categoryTotals[col][cat] = { metric1: 0, metric2: 0 };
            }
            categoryTotals[col][cat].metric1 += agg.metric1;
            categoryTotals[col][cat].metric2 += agg.metric2;
          }
        }
      }
      var ctCols = Object.keys(categoryTotals);
      for (var ci = 0; ci < ctCols.length; ci++) {
        var catKeys = Object.keys(categoryTotals[ctCols[ci]]);
        for (var ki = 0; ki < catKeys.length; ki++) {
          var t = categoryTotals[ctCols[ci]][catKeys[ki]];
          t.metric3 = t.metric1 > 0 ? 1e4 * t.metric2 / t.metric1 : 0;
        }
      }
      result._categoryTotals = categoryTotals;
      return result;
    }, [baseDimensionAggregates, filteredDatesSet]);
    const getDimMetric = React.useCallback(
      (aggregates, column, period, categoryValue, metricName) => getDimAggMetric(aggregates, column, period, categoryValue, metricName),
      []
    );
    const dimensionCategoryTotals = React.useMemo(() => {
      return dimensionAggregates._categoryTotals || {};
    }, [dimensionAggregates]);
    const categoryColorMap = React.useMemo(() => {
      const map = {};
      Object.keys(dimensionCategoryTotals).forEach((dimCol) => {
        const cats = Object.keys(dimensionCategoryTotals[dimCol]).filter((c) => c && c !== "Unknown").sort((a, b) => b.localeCompare(a));
        const dimMap = {};
        cats.forEach((cat, i) => {
          dimMap[cat] = MODERN_COLOR_PALETTE[i % MODERN_COLOR_PALETTE.length];
        });
        dimMap["Rest Combined"] = "#9ca3af";
        map[dimCol] = dimMap;
      });
      return map;
    }, [dimensionCategoryTotals]);
    const periods = React.useMemo(() => {
      return Object.keys(periodAggregates).sort();
    }, [periodAggregates]);
    const calculateMetricValue = React.useCallback((rows, metricName) => {
      if (!rows || rows.length === 0) return 0;
      let m1 = 0;
      let m2 = 0;
      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        m1 += row[COLUMNS.METRIC1] || 0;
        m2 += row[COLUMNS.METRIC2] || 0;
      }
      switch (metricName) {
        case "metric1":
          return m1;
        case "metric2":
          return m2;
        case "metric3":
          if (rows.length === 1 && rows[0].__metric3 !== void 0) return rows[0].__metric3;
          return m1 > 0 ? 1e4 * m2 / m1 : 0;
        default:
          return m1;
      }
    }, []);
    const calculateMetric = React.useCallback(
      (rows) => calculateMetricValue(rows, metric),
      [metric, calculateMetricValue]
    );
    const resolveChartType = React.useCallback((metricName) => {
      if (isLiveMode && liveMetricConfig) {
        const prefix = metricName === "metric1" ? "volume" : metricName === "metric2" ? "revenue" : "derived";
        const configuredType = liveMetricConfig[prefix + "ChartType"] || "auto";
        if (configuredType !== "auto") return configuredType;
        const mode = liveMetricConfig[prefix + "Mode"] || "aggregation";
        return mode === "formula" ? "line" : "stacked";
      }
      return metricName === "metric3" ? "line" : "stacked";
    }, [isLiveMode, liveMetricConfig]);
    const formatMetricValue = React.useCallback((value, metricName) => {
      if (isLiveMode && liveMetricConfig) {
        if (metricName === "metric1") {
          const formatted = numeral(value).format(liveMetricConfig.volumeFormat);
          return (liveMetricConfig.volumePrefix || "") + formatted + (liveMetricConfig.volumeSuffix || "");
        }
        if (metricName === "metric2") {
          const formatted = numeral(value).format(liveMetricConfig.revenueFormat);
          return (liveMetricConfig.revenuePrefix || "") + formatted + (liveMetricConfig.revenueSuffix || "");
        }
        if (metricName === "metric3") {
          const displayValue = liveMetricConfig.derivedMode !== "formula" && liveMetricConfig.derivedDivisor ? value / liveMetricConfig.derivedDivisor : value;
          const formatted = numeral(displayValue).format(liveMetricConfig.derivedFormat);
          return (liveMetricConfig.derivedPrefix || "") + formatted + (liveMetricConfig.derivedSuffix || "");
        }
      }
      switch (metricName) {
        case "metric1":
          return "$" + numeral(value).format("0.0a");
        case "metric2":
          return "$" + numeral(value).format("0.0a");
        case "metric3":
          return numeral(value).format("0.0") + " bps";
        default:
          return numeral(value).format("0.0a");
      }
    }, [isLiveMode, liveMetricConfig]);
    const formatMetric = React.useCallback(
      (value) => formatMetricValue(value, metric),
      [metric, formatMetricValue]
    );
    const calculatePercentageChange2 = React.useCallback(
      (currentValue, previousValue) => calculatePercentageChange(currentValue, previousValue),
      []
    );
    const calculateGrowthMetrics2 = React.useCallback(
      (currentValue, previousValue, overallGrowthRate = null) => calculateGrowthMetrics(currentValue, previousValue, overallGrowthRate),
      []
    );
    const formatPeriodDate2 = React.useCallback(
      (periodString) => formatPeriodDate(periodString, dataFrequency),
      [dataFrequency]
    );
    const formatYoYValue2 = React.useCallback(
      (yoyValue) => formatYoYValue(yoyValue),
      []
    );
    const capYoYForDisplay2 = React.useCallback(
      (yoyValue) => capYoYForDisplay(yoyValue),
      []
    );
    const calculateYoYDataArray2 = React.useCallback(
      (periods2, dataByPeriod2, metricCalculator, yoyCalculator, includeLastPeriod = false) => calculateYoYDataArray(periods2, dataByPeriod2, metricCalculator, yoyCalculator, includeLastPeriod),
      []
    );
    const generateExcessGrowthInsights = React.useCallback(
      (insightContext2) => {
        if (!insightContext2) {
          return [];
        }
        const {
          parentExcessGrowth,
          marketAvgGrowth,
          periods: ctxPeriods
        } = insightContext2;
        const isSimpleModeContext = marketAvgGrowth == null;
        if (!isSimpleModeContext && (!parentExcessGrowth || parentExcessGrowth === 0)) {
          return [];
        }
        const insights = [];
        const firstPeriod = ctxPeriods[0];
        const lastPeriod = ctxPeriods[ctxPeriods.length - 1];
        const parentFirstValue = periodAggregates[firstPeriod] ? periodAggregates[firstPeriod][metric] || 0 : 0;
        const parentLastValue = periodAggregates[lastPeriod] ? periodAggregates[lastPeriod][metric] || 0 : 0;
        const parentAbsChange = parentLastValue - parentFirstValue;
        const parentFirstRev = periodAggregates[firstPeriod] ? periodAggregates[firstPeriod].metric2 || 0 : 0;
        const parentLastRev = periodAggregates[lastPeriod] ? periodAggregates[lastPeriod].metric2 || 0 : 0;
        if (parentFirstValue === 0) {
          return [];
        }
        const excludedDimensions = [
          "productGroupFilter",
          "productSubFilter"
        ];
        const availableDimensions = DIMENSION_DEFINITIONS.filter((dim) => {
          const filterState = getFilterState(dim.filterKey);
          return filterState.length === 0 && columnExists(COLUMNS[dim.columnKey]) && !excludedDimensions.includes(dim.filterKey);
        });
        if (availableDimensions.length === 0) {
          return [];
        }
        const dimensionPriority = {
          revenueRegionFilter: 1,
          revenueCountryFilter: 2,
          productNameFilter: 3,
          pricingTypeFilter: 4,
          channelFilter: 5,
          companySegmentFilter: 6,
          isAiCompanyFilter: 7,
          acquisitionChannelFilter: 8,
          customerConnectFilter: 9,
          channelTypeFilter: 10
        };
        const computeCategoryContribution = (column, categoryValue) => {
          const categoryFirstValue = getDimAggMetric(
            dimensionAggregates,
            column,
            firstPeriod,
            categoryValue,
            metric
          );
          const categoryLastValue = getDimAggMetric(
            dimensionAggregates,
            column,
            lastPeriod,
            categoryValue,
            metric
          );
          const categoryGrowth = calculatePercentageChange2(
            categoryLastValue,
            categoryFirstValue
          );
          if (categoryGrowth === null) return null;
          const categoryAbsChange = categoryLastValue - categoryFirstValue;
          const useSimpleMode = marketAvgGrowth == null;
          const excessVsMarket = marketAvgGrowth != null ? categoryGrowth - marketAvgGrowth : null;
          let baseShare, excessContribution, pctOfExcess;
          if (metric === "metric3") {
            const categoryFirstRev = getDimAggMetric(
              dimensionAggregates,
              column,
              firstPeriod,
              categoryValue,
              "metric2"
            );
            const categoryLastRev = getDimAggMetric(
              dimensionAggregates,
              column,
              lastPeriod,
              categoryValue,
              "metric2"
            );
            const avgCategoryRev = (categoryFirstRev + categoryLastRev) / 2;
            const avgParentRev = (parentFirstRev + parentLastRev) / 2;
            const volumeShare = avgParentRev !== 0 ? avgCategoryRev / avgParentRev : 0;
            const contributionBps = volumeShare * categoryAbsChange;
            if (useSimpleMode) {
              pctOfExcess = parentAbsChange !== 0 ? contributionBps / parentAbsChange : 0;
              excessContribution = contributionBps;
              baseShare = volumeShare;
            } else {
              const contributionPercentagePoints = volumeShare * excessVsMarket;
              pctOfExcess = parentExcessGrowth !== 0 ? contributionPercentagePoints / parentExcessGrowth : 0;
              excessContribution = contributionPercentagePoints;
              baseShare = volumeShare;
            }
          } else if (useSimpleMode) {
            const absContributionRatio = parentAbsChange !== 0 ? categoryAbsChange / parentAbsChange : 0;
            pctOfExcess = absContributionRatio;
            excessContribution = categoryAbsChange;
            baseShare = categoryFirstValue / parentFirstValue;
          } else if (categoryFirstValue < 0) {
            const absContributionRatio = parentAbsChange !== 0 ? categoryAbsChange / parentAbsChange : 0;
            const isOutperforming = categoryGrowth > marketAvgGrowth;
            pctOfExcess = isOutperforming ? Math.abs(absContributionRatio) : -Math.abs(absContributionRatio);
            excessContribution = pctOfExcess * parentExcessGrowth;
            baseShare = absContributionRatio;
          } else {
            baseShare = categoryFirstValue / parentFirstValue;
            excessContribution = excessVsMarket * baseShare;
            pctOfExcess = excessContribution / parentExcessGrowth;
          }
          return {
            categoryFirstValue,
            categoryLastValue,
            categoryAbsChange,
            categoryGrowth,
            excessVsMarket,
            baseShare,
            excessContribution,
            pctOfExcess
          };
        };
        const dimensionAnalysis = availableDimensions.map((dimension) => {
          const column = COLUMNS[dimension.columnKey];
          const categories = getCategoriesFromAggregates(
            dimensionAggregates,
            column,
            ctxPeriods
          );
          if (categories.length <= 1) return null;
          const categoryContributions = categories.map((categoryValue) => {
            const result = computeCategoryContribution(column, categoryValue);
            return result ? Math.abs(result.pctOfExcess) : 0;
          });
          const maxContribution = Math.max(...categoryContributions, 0);
          const numSignificant = categoryContributions.filter(
            (c) => c >= 0.05
          ).length;
          return {
            dimension,
            maxContribution,
            numSignificant,
            fixedPriority: dimensionPriority[dimension.filterKey] || 50
          };
        });
        const validDimensionAnalysis = dimensionAnalysis.filter(
          (d) => d !== null
        );
        if (validDimensionAnalysis.length === 0) return [];
        validDimensionAnalysis.sort((a, b) => {
          if (Math.abs(a.maxContribution - b.maxContribution) > 0.1) {
            return b.maxContribution - a.maxContribution;
          }
          if (a.numSignificant !== b.numSignificant) {
            return a.numSignificant - b.numSignificant;
          }
          return a.fixedPriority - b.fixedPriority;
        });
        const prioritizedDimensions = validDimensionAnalysis.slice(0, 1).map((d) => d.dimension);
        prioritizedDimensions.forEach((dimension) => {
          const column = COLUMNS[dimension.columnKey];
          const { viewName, insightLabel, filterKey } = dimension;
          const categories = getCategoriesFromAggregates(
            dimensionAggregates,
            column,
            ctxPeriods
          );
          if (categories.length <= 1) return;
          categories.forEach((categoryValue) => {
            const result = computeCategoryContribution(column, categoryValue);
            if (!result) return;
            const {
              categoryFirstValue,
              categoryLastValue,
              categoryAbsChange,
              categoryGrowth,
              excessVsMarket,
              baseShare,
              excessContribution,
              pctOfExcess
            } = result;
            const useSimpleMode = marketAvgGrowth == null;
            if (Math.abs(pctOfExcess) >= 0.05) {
              const contributionPct = Math.abs(pctOfExcess * 100).toFixed(0);
              const categoryLabel = formatFilterName2(categoryValue);
              let text;
              if (useSimpleMode) {
                const isPositiveContribution = pctOfExcess > 0;
                const changeDirection = categoryAbsChange > 0 ? "increase" : "drop";
                const verb = isPositiveContribution ? "contributed" : "offset";
                text = `[${insightLabel}] ${categoryLabel} ${verb} ${contributionPct}% of the ${changeDirection} (${formatMetric(
                  categoryFirstValue
                )} \u2192 ${formatMetric(categoryLastValue)})`;
              } else {
                const isCategoryAboveMarket = excessVsMarket > 0;
                const direction = isCategoryAboveMarket ? "above" : "below";
                const isGrowing = categoryGrowth >= 0;
                const growthVerb = isGrowing ? "grew" : "declined";
                const growthDisplay = Math.abs(categoryGrowth).toFixed(0);
                const isParentOutperforming = parentExcessGrowth > 0;
                const performanceNoun = isParentOutperforming ? "outperformance" : "underperformance";
                const isPositiveContribution = isCategoryAboveMarket && isParentOutperforming || !isCategoryAboveMarket && !isParentOutperforming;
                const verb = isPositiveContribution ? "drove" : "offset";
                text = `[${insightLabel}] ${categoryLabel} ${growthVerb} ${growthDisplay}% (${Math.abs(
                  excessVsMarket
                ).toFixed(
                  0
                )}pp ${direction} market) - ${verb} ${contributionPct}% of ${performanceNoun}`;
              }
              insights.push({
                text,
                priority: Math.abs(pctOfExcess) * 100,
                category: "decomposition",
                metadata: {
                  type: "excess_contribution",
                  categoryGrowth,
                  marketAvgGrowth,
                  excessVsMarket,
                  baseShare,
                  excessContribution,
                  pctOfExcess,
                  categoryFirstValue,
                  categoryLastValue,
                  categoryAbsChange,
                  dimension: column,
                  dimensionValue: categoryValue,
                  dimensionLabel: insightLabel,
                  viewName
                },
                action: () => {
                  const categoryExcessGrowth = marketAvgGrowth != null ? categoryGrowth - marketAvgGrowth : null;
                  setInsightContext((prevContext) => ({
                    type: prevContext && prevContext.type,
                    parentCategory: categoryValue,
                    parentLabel: formatFilterName2(categoryValue),
                    parentGrowth: categoryGrowth,
                    parentExcessGrowth: categoryExcessGrowth,
                    marketAvgGrowth,
                    parentAbsChange: categoryAbsChange,
                    periods: ctxPeriods,
                    firstValue: categoryFirstValue,
                    lastValue: categoryLastValue,
                    drillPath: [
                      ...prevContext && prevContext.drillPath || [],
                      {
                        category: prevContext && prevContext.parentCategory,
                        label: prevContext && prevContext.parentLabel,
                        growth: prevContext && prevContext.parentGrowth,
                        excessGrowth: prevContext && prevContext.parentExcessGrowth,
                        marketAvgGrowth: prevContext && prevContext.marketAvgGrowth,
                        absChange: prevContext && prevContext.parentAbsChange,
                        periods: prevContext && prevContext.periods,
                        firstValue: prevContext && prevContext.firstValue,
                        lastValue: prevContext && prevContext.lastValue
                      }
                    ]
                  }));
                  const setFilter = getFilterSetState(filterKey);
                  setFilter([categoryValue]);
                  setView("Overall");
                }
              });
            }
          });
        });
        return insights.sort(
          (a, b) => Math.abs(b.metadata.pctOfExcess) - Math.abs(a.metadata.pctOfExcess)
        );
      },
      [
        dimensionAggregates,
        periodAggregates,
        metric,
        dateField,
        calculatePercentageChange2,
        formatFilterName2,
        columnExists,
        getFilterState,
        getFilterSetState,
        setView
      ]
    );
    const generateStructuredInsights = (tabType) => {
      if (periods.length < 3 || !isLiveMode && filteredData.length === 0) {
        return {
          basicInsights: {
            decomposition: [],
            // 🆕 NEW
            overallTrends: [],
            marketLeaders: [],
            performanceAlerts: [],
            categoryTrends: []
          },
          advancedInsights: {
            allTimeGrowth: []
          },
          recommendations: []
        };
      }
      const structuredInsights2 = {
        basicInsights: {
          decomposition: [],
          // 🆕 NEW - explains parent's excess growth (shown first)
          overallTrends: [],
          marketLeaders: [],
          performanceAlerts: [],
          categoryTrends: [],
          shareShifts: []
        },
        advancedInsights: {
          allTimeGrowth: []
        },
        recommendations: []
      };
      const completePeriods = periods.slice(0, -1);
      let completeFilteredData, completeDataByPeriod;
      if (isLiveMode) {
        completeFilteredData = [];
        completeDataByPeriod = {};
        completePeriods.forEach((period) => {
          const agg = periodAggregates[period];
          if (!agg) return;
          const syntheticRow = { [dateField]: period, [COLUMNS.METRIC1]: agg.metric1, [COLUMNS.METRIC2]: agg.metric2, __metric3: agg.metric3 };
          completeFilteredData.push(syntheticRow);
          completeDataByPeriod[period] = [syntheticRow];
        });
      } else {
        completeFilteredData = filteredData.filter(
          (row) => completePeriods.includes(row[dateField])
        );
        completeDataByPeriod = {};
        for (let i = 0; i < completeFilteredData.length; i++) {
          const row = completeFilteredData[i];
          const period = row[dateField];
          if (!completeDataByPeriod[period]) completeDataByPeriod[period] = [];
          completeDataByPeriod[period].push(row);
        }
      }
      const activeDimColumns = DIMENSION_DEFINITIONS.filter((dim) => columnExists(COLUMNS[dim.columnKey])).map((dim) => COLUMNS[dim.columnKey]);
      const precomputed = {};
      activeDimColumns.forEach((col) => {
        precomputed[col] = {};
      });
      if (isLiveMode) {
        activeDimColumns.forEach((col) => {
          const dimPeriods = liveInsightsDimAggs[col] || {};
          Object.keys(dimPeriods).forEach((period) => {
            if (!completePeriods.includes(period)) return;
            const cats = dimPeriods[period];
            Object.keys(cats).forEach((val) => {
              if (!val || val === "Unknown") return;
              const catAgg = cats[val];
              let cat = precomputed[col][val];
              if (!cat) {
                cat = { metric1: 0, metric2: 0, byPeriod: {} };
                precomputed[col][val] = cat;
              }
              const vol = catAgg.metric1 || 0;
              const rev = catAgg.metric2 || 0;
              cat.metric1 += vol;
              cat.metric2 += rev;
              cat.byPeriod[period] = { metric1: vol, metric2: rev, metric3: catAgg.metric3 };
            });
          });
        });
      } else {
        for (let i = 0; i < completeFilteredData.length; i++) {
          const row = completeFilteredData[i];
          const period = row[dateField];
          const volume = row[COLUMNS.METRIC1] || 0;
          const revenue = row[COLUMNS.METRIC2] || 0;
          for (let d = 0; d < activeDimColumns.length; d++) {
            const col = activeDimColumns[d];
            const val = row[col];
            if (!val) continue;
            let cat = precomputed[col][val];
            if (!cat) {
              cat = { metric1: 0, metric2: 0, byPeriod: {} };
              precomputed[col][val] = cat;
            }
            cat.metric1 += volume;
            cat.metric2 += revenue;
            let pAgg = cat.byPeriod[period];
            if (!pAgg) {
              pAgg = { metric1: 0, metric2: 0 };
              cat.byPeriod[period] = pAgg;
            }
            pAgg.metric1 += volume;
            pAgg.metric2 += revenue;
          }
        }
      }
      const metricFromAgg = (m1, m2, m3) => {
        switch (metric) {
          case "metric1":
            return m1;
          case "metric2":
            return m2;
          case "metric3":
            if (m3 !== void 0) return m3;
            return m1 > 0 ? 1e4 * m2 / m1 : 0;
          default:
            return m1;
        }
      };
      const totalMarketValue = calculateMetric(completeFilteredData);
      const totalRevShare = completeFilteredData.reduce(
        (sum, row) => sum + (row[COLUMNS.METRIC2] || 0),
        0
      );
      const dataScale = totalMarketValue;
      const periodCount = completePeriods.length;
      const INSIGHT_THRESHOLDS = {
        // Growth thresholds
        minGrowthThreshold: periodCount >= 6 ? 5 : 8,
        minRelativeGrowthThreshold: 5,
        // Minimum difference from market to be significant
        // Market share thresholds
        // Lower threshold for larger datasets (more categories), higher for smaller datasets
        minMarketShareThreshold: dataScale > 1e6 ? 5 : 10,
        minRevContributionThreshold: 0.01,
        // 1% of total revenue
        // Performance alert thresholds
        consecutiveDeclineThreshold: 2,
        suddenDropThreshold: 20,
        // Percentage
        // Segment size thresholds
        minSegmentSize: Math.max(dataScale * 0.03, totalMarketValue * 0.05),
        // Share shift thresholds
        minShareShiftPoints: 3
        // Percentage points
      };
      const shouldExcludeCategory = (category) => {
        if (!category) return true;
        const excludedCategories = ["uncategorized", "other", "unknown"];
        return excludedCategories.some(
          (excluded) => category.toLowerCase() === excluded.toLowerCase()
        );
      };
      const calculateCategoryRevShare = (columnName, categoryValue) => {
        var dimData = precomputed[columnName];
        var catData = dimData && dimData[categoryValue];
        return catData && catData.metric2 || 0;
      };
      const minRevThreshold = totalRevShare * INSIGHT_THRESHOLDS.minRevContributionThreshold;
      const createInsight = (text, basePriority, category, action, metadata = {}) => {
        return {
          text,
          priority: basePriority,
          // Base priority before scoring
          category,
          action: action || (() => setView("Overall")),
          metadata
          // Store additional data for scoring adjustments
        };
      };
      const deduplicateInsightsByText = (insights) => {
        const seenTexts = /* @__PURE__ */ new Set();
        return insights.filter((insight) => {
          if (seenTexts.has(insight.text)) return false;
          seenTexts.add(insight.text);
          return true;
        });
      };
      if (insightContext && insightContext.parentCategory) {
        const excessInsights = generateExcessGrowthInsights(insightContext);
        structuredInsights2.basicInsights.decomposition = excessInsights.slice(
          0,
          10
        );
      }
      const createStandardMetadata = (type, values = {}) => {
        const baseMetadata = {
          insightType: type,
          // 'global' | 'single-dimension' | 'cross-dimension'
          scope: type === "global" ? "global" : type === "cross-dimension" ? "cross-dimensional" : "filtered"
        };
        if (type === "single-dimension") {
          baseMetadata.dimensionColumn = values.dimensionColumn;
          baseMetadata.viewName = values.viewName;
          baseMetadata.label = values.label;
        }
        if (type === "cross-dimension") {
          baseMetadata.dimensionColumns = values.crossDimensionFields;
          baseMetadata.crossDimensionName = values.crossDimensionName;
        }
        Object.keys(values).forEach((key) => {
          if (!baseMetadata.hasOwnProperty(key)) {
            baseMetadata[key] = values[key];
          }
        });
        return baseMetadata;
      };
      const calculateBasePriority = (value, type, context = {}) => {
        switch (type) {
          case "growth_percentage":
            return Math.abs(value);
          case "share_points":
            const revShare = context.revShare || 10;
            const recencyFactor = context.recencyFactor || 1;
            return Math.abs(value) * (revShare / 10) * recencyFactor;
          case "market_share":
            return value;
          case "drop_percentage":
            return value + 50;
          case "decline_score":
            return (context.consecutivePeriods || 0) * 20 + (value || 0);
          case "relative_growth":
            const revShareForGrowth = context.revShare || 10;
            return Math.abs(value) * (revShareForGrowth / 10);
          default:
            return Math.abs(value) || 0;
        }
      };
      const detectPerformanceAlerts = () => {
        if (completePeriods.length < 3) return [];
        const alerts = [];
        const recentPeriods = completePeriods.slice(-3);
        let consecutiveDeclines = 0;
        let totalDecline = 0;
        for (let i = 1; i < recentPeriods.length; i++) {
          const currentRows = completeDataByPeriod[recentPeriods[i]] || [];
          const prevRows = completeDataByPeriod[recentPeriods[i - 1]] || [];
          const currentValue = calculateMetric(currentRows);
          const prevValue = calculateMetric(prevRows);
          const percentChange = calculatePercentageChange2(
            currentValue,
            prevValue
          );
          if (percentChange !== null && percentChange < 0) {
            consecutiveDeclines++;
            totalDecline += Math.abs(percentChange);
          } else {
            break;
          }
        }
        if (consecutiveDeclines >= INSIGHT_THRESHOLDS.consecutiveDeclineThreshold) {
          const priority = calculateBasePriority(totalDecline, "decline_score", {
            consecutivePeriods: consecutiveDeclines
          });
          alerts.push(
            createInsight(
              `${METRIC_LABELS[metric] || metric} declining for ${consecutiveDeclines} consecutive periods (${totalDecline.toFixed(
                1
              )}% total decline) - requires attention`,
              priority,
              "performanceAlerts",
              () => setView("Overall"),
              createStandardMetadata("global", {
                alertType: "consecutive_decline",
                consecutiveDeclines,
                totalDecline
              })
            )
          );
        }
        for (let i = 1; i < completePeriods.length; i++) {
          const currentRows = completeDataByPeriod[completePeriods[i]] || [];
          const prevRows = completeDataByPeriod[completePeriods[i - 1]] || [];
          const currentValue = calculateMetric(currentRows);
          const prevValue = calculateMetric(prevRows);
          const percentChange = calculatePercentageChange2(
            currentValue,
            prevValue
          );
          if (percentChange !== null) {
            const dropPercent = Math.abs(Math.min(0, percentChange));
            if (dropPercent > INSIGHT_THRESHOLDS.suddenDropThreshold) {
              const priority = calculateBasePriority(
                dropPercent,
                "drop_percentage"
              );
              const formattedPeriod = formatPeriodDate2(completePeriods[i]);
              const anomalousPeriod = completePeriods[i];
              const comparisonPeriod = completePeriods[i - 1];
              alerts.push(
                createInsight(
                  `Significant ${METRIC_LABELS[metric] || metric} drop of ${dropPercent.toFixed(
                    1
                  )}% in ${formattedPeriod} (${formatMetric(
                    prevValue
                  )} \u2192 ${formatMetric(currentValue)})`,
                  priority,
                  "performanceAlerts",
                  () => {
                    setInsightContext({
                      type: "period_anomaly",
                      anomalousPeriod,
                      comparisonPeriod,
                      periods: [comparisonPeriod, anomalousPeriod],
                      // Just 2 periods
                      firstValue: prevValue,
                      lastValue: currentValue,
                      parentGrowth: percentChange,
                      parentExcessGrowth: null,
                      // No market comparison for period anomalies
                      marketAvgGrowth: null,
                      // Simple mode
                      parentAbsChange: currentValue - prevValue,
                      parentLabel: `${formattedPeriod} Drop`,
                      drillPath: []
                    });
                    setView("Overall");
                  },
                  createStandardMetadata("global", {
                    alertType: "sudden_drop",
                    dropPercent,
                    period: completePeriods[i]
                  })
                )
              );
            }
          }
        }
        return deduplicateInsightsByText(alerts).slice(
          0,
          INSIGHT_LIMITS.generation.performanceAlerts
        );
      };
      const detectShareShiftsForDimension = (columnName, filterArray, optionsArray, setFilterFn, labelPrefix = "", viewName = null) => {
        if (filterArray.length > 0 || completePeriods.length < 2) return [];
        const insights = [];
        const firstPeriod = completePeriods[0];
        const lastPeriod = completePeriods[completePeriods.length - 1];
        const firstPeriodShare = {};
        const lastPeriodShare = {};
        const firstPeriodData = completeDataByPeriod[firstPeriod] || [];
        const lastPeriodData = completeDataByPeriod[lastPeriod] || [];
        const firstTotal = calculateMetric(firstPeriodData);
        const lastTotal = calculateMetric(lastPeriodData);
        const dimData = precomputed[columnName] || {};
        optionsArray.slice(1).forEach((option) => {
          if (shouldExcludeCategory(option)) return;
          const catAgg = dimData[option];
          if (!catAgg) return;
          if (catAgg.metric2 < minRevThreshold) return;
          const firstAgg = catAgg.byPeriod[firstPeriod];
          const lastAgg = catAgg.byPeriod[lastPeriod];
          const firstCatMetric = firstAgg ? metricFromAgg(firstAgg.metric1, firstAgg.metric2, firstAgg.metric3) : 0;
          const lastCatMetric = lastAgg ? metricFromAgg(lastAgg.metric1, lastAgg.metric2, lastAgg.metric3) : 0;
          firstPeriodShare[option] = firstTotal > 0 ? firstCatMetric / firstTotal * 100 : 0;
          lastPeriodShare[option] = lastTotal > 0 ? lastCatMetric / lastTotal * 100 : 0;
        });
        Object.keys(firstPeriodShare).forEach((option) => {
          const shareChange = lastPeriodShare[option] - firstPeriodShare[option];
          if (Math.abs(shareChange) > INSIGHT_THRESHOLDS.minShareShiftPoints) {
            const direction = shareChange > 0 ? "gained" : "lost";
            const categoryRev = calculateCategoryRevShare(columnName, option);
            const revShare = categoryRev / totalRevShare * 100;
            const periodCount2 = completePeriods.length;
            const recencyFactor = periodCount2 <= 6 ? 1.2 : periodCount2 <= 12 ? 1 : 0.8;
            const priority = calculateBasePriority(shareChange, "share_points", {
              revShare,
              recencyFactor
            });
            insights.push(
              createInsight(
                `${labelPrefix}${formatFilterName2(
                  option
                )} ${direction} ${Math.abs(shareChange).toFixed(
                  1
                )} percentage points of market share (${firstPeriodShare[option].toFixed(1)}% \u2192 ${lastPeriodShare[option].toFixed(1)}%)`,
                priority,
                "shareShifts",
                () => {
                  if (viewName) {
                    setView(viewName);
                    setTimeout(() => {
                      setSelectedCategories([option]);
                    }, 0);
                  } else {
                    setFilterFn([option]);
                  }
                },
                createStandardMetadata("single-dimension", {
                  option,
                  shareChange,
                  revShare,
                  firstShare: firstPeriodShare[option],
                  lastShare: lastPeriodShare[option],
                  dimensionColumn: columnName,
                  viewName,
                  label: labelPrefix || viewName
                })
              )
            );
          }
        });
        return insights;
      };
      const detectMarketShareShifts = () => {
        if (completePeriods.length < 2) return [];
        if (metric === "metric3") return [];
        const insights = DIMENSION_DEFINITIONS.flatMap((dim) => {
          const column = COLUMNS[dim.columnKey];
          if (!columnExists(column)) return [];
          return detectShareShiftsForDimension(
            column,
            getFilterState(dim.filterKey),
            filterOptionsMap[dim.filterKey] || [],
            getFilterSetState(dim.filterKey),
            "",
            dim.viewName
          );
        });
        return deduplicateInsightsByText(
          insights.sort((a, b) => b.priority - a.priority)
        ).slice(0, INSIGHT_LIMITS.generation.shareShifts);
      };
      const scoreInsight = (insight, category) => {
        let score = insight.priority || 0;
        const categoryMultipliers = {
          performanceAlerts: 1.5,
          // Critical alerts (declines, drops) - highest priority
          categoryTrends: 1.4,
          // Individual category trends (filtered by revenue share) - high priority
          overallTrends: 1.2,
          // Overall market trends - moderate priority
          marketLeaders: 1,
          // Market leader identification - baseline
          shareShifts: 1.1,
          // Market share shifts - slightly above baseline
          allTimeGrowth: 1
          // Cross-dimensional growth insights - baseline
        };
        score *= categoryMultipliers[category] || 1;
        if (insight.text.includes("recent") || insight.text.includes("last")) {
          score *= 1.2;
        }
        if (insight.text.includes("above avg.") || insight.text.includes("below avg.")) {
          score *= 1.3;
        }
        const magnitudeMatch = insight.text.match(/(\d+\.?\d*)%/);
        if (magnitudeMatch) {
          const magnitude = parseFloat(magnitudeMatch[1]);
          if (magnitude >= 30) {
            score *= 1.3;
          } else if (magnitude >= 20) {
            score *= 1.2;
          } else if (magnitude >= 15) {
            score *= 1.1;
          }
        }
        if (insight.text.includes("declined") || insight.text.includes("declining") || insight.text.includes("drop") || insight.text.includes("decreased")) {
          score *= 1.15;
        }
        if (insight.text.includes("surged") || insight.text.includes("surge")) {
          score *= 1.1;
        }
        if (insight.text.includes("consecutive") || insight.text.includes("consistent")) {
          score *= 1.1;
        }
        return score;
      };
      const filterInsights = (insights) => {
        return insights.filter((insight) => {
          if (insight.category === "decomposition") {
            return true;
          }
          const changeMatch = insight.text.match(/(\d+\.?\d*)%/);
          if (changeMatch) {
            const changeValue = parseFloat(changeMatch[1]);
            const category = insight.category;
            if (category === "shareShifts") {
            } else if (category === "categoryTrends" || category === "allTimeGrowth") {
              if (changeValue < INSIGHT_THRESHOLDS.minGrowthThreshold)
                return false;
            } else if (category === "marketLeaders") {
              if (changeValue < INSIGHT_THRESHOLDS.minMarketShareThreshold)
                return false;
            } else {
              if (changeValue < 5) return false;
            }
          }
          const insightTextLower = insight.text.toLowerCase();
          for (const { state, formatValue } of FILTER_CONFIG) {
            if (state.length > 0) {
              const matchesFilter = state.some((filterValue) => {
                const filterName = formatValue ? formatValue(filterValue) : formatFilterName2(filterValue);
                return insightTextLower.includes(filterName.toLowerCase()) || insightTextLower.includes(String(filterValue).toLowerCase());
              });
              if (matchesFilter) return false;
            }
          }
          return true;
        });
      };
      const firstPeriodRows = completeDataByPeriod[completePeriods[0]] || [];
      const lastPeriodRows = completeDataByPeriod[completePeriods[completePeriods.length - 1]] || [];
      const firstValue = calculateMetric(firstPeriodRows);
      const lastValue = calculateMetric(lastPeriodRows);
      if (firstValue !== 0 && firstValue !== null) {
        const {
          growthRate: totalGrowth,
          direction,
          absoluteGrowth
        } = calculateGrowthMetrics2(lastValue, firstValue);
        const contextualDescription = getFilterContext();
        const priority = calculateBasePriority(totalGrowth, "growth_percentage");
        structuredInsights2.basicInsights.overallTrends.push(
          createInsight(
            `Overall ${METRIC_LABELS[metric] || metric} ${direction} ${absoluteGrowth.toFixed(
              1
            )}% from ${formatMetric(firstValue)} to ${formatMetric(
              lastValue
            )} ${contextualDescription} (complete periods only)`,
            priority,
            "overallTrends",
            () => setView("Overall"),
            createStandardMetadata("global", {
              totalGrowth,
              firstValue,
              lastValue,
              direction
            })
          )
        );
      }
      const analyzeMarketLeader = (columnName, filterArray, dimensionLabel, viewName, textPrefix = "dominates") => {
        if (filterArray.length > 0 || totalMarketValue === 0) return;
        const analysis = {};
        const dimData = precomputed[columnName] || {};
        Object.keys(dimData).forEach((value) => {
          if (value === "Unknown" || shouldExcludeCategory(value)) return;
          const cat = dimData[value];
          analysis[value] = metricFromAgg(cat.metric1, cat.metric2);
        });
        const sorted = Object.entries(analysis).sort((a, b) => b[1] - a[1]);
        if (sorted.length === 0) return;
        const [topValue, topMetricValue] = sorted[0];
        let marketShare, displayValue;
        if (metric === "metric3") {
          const catData = dimData[topValue];
          displayValue = topMetricValue;
          marketShare = totalRevShare > 0 ? catData.metric2 / totalRevShare * 100 : 0;
        } else {
          marketShare = topMetricValue / totalMarketValue * 100;
          displayValue = topMetricValue;
        }
        const minThreshold = INSIGHT_THRESHOLDS.minMarketShareThreshold;
        const isNear100Percent = marketShare >= 99.5;
        if ((metric === "metric3" || marketShare > minThreshold) && !isNear100Percent) {
          const shareText = metric === "metric3" ? formatMetric(displayValue) : `${marketShare.toFixed(1)}% share (${formatMetric(
            displayValue
          )})`;
          const priority = calculateBasePriority(marketShare, "market_share");
          structuredInsights2.basicInsights.marketLeaders.push(
            createInsight(
              `${formatFilterName2(
                topValue
              )} ${textPrefix} ${dimensionLabel} with ${shareText}`,
              priority,
              "marketLeaders",
              () => {
                if (viewName) {
                  setView(viewName);
                  setTimeout(() => {
                    setSelectedCategories([topValue]);
                  }, 0);
                }
              },
              createStandardMetadata("single-dimension", {
                topValue,
                marketShare,
                displayValue,
                dimensionLabel,
                dimensionColumn: columnName,
                viewName,
                label: dimensionLabel
              })
            )
          );
        }
      };
      if (totalMarketValue > 0) {
        DIMENSION_DEFINITIONS.forEach((dim) => {
          const column = COLUMNS[dim.columnKey];
          if (columnExists(column)) {
            analyzeMarketLeader(
              column,
              getFilterState(dim.filterKey),
              dim.marketLeaderLabel,
              dim.viewName,
              dim.insightTextPrefix
            );
          }
        });
        structuredInsights2.basicInsights.marketLeaders = deduplicateInsightsByText(
          structuredInsights2.basicInsights.marketLeaders
        ).slice(0, INSIGHT_LIMITS.generation.marketLeaders);
      }
      if (tabType === "advanced" && completePeriods.length >= 2) {
        const { growthRate: overallMarketGrowthRate } = firstValue && firstValue !== 0 && firstValue !== null ? calculateGrowthMetrics2(lastValue, firstValue) : { growthRate: 0 };
        const crossDimensionalCombos = [
          {
            fields: [COLUMNS.PRODUCT_NAME, COLUMNS.REGION],
            name: "Product \xD7 Region",
            filters: [productNameFilter, revenueRegionFilter],
            setters: [setProductNameFilter, setRevenueRegionFilter]
          },
          {
            fields: [COLUMNS.PRODUCT_NAME, COLUMNS.CUSTOMER_SEGMENT],
            name: "Product \xD7 Segment",
            filters: [productNameFilter, companySegmentFilter],
            setters: [setProductNameFilter, setCompanySegmentFilter]
          },
          {
            fields: [COLUMNS.PRODUCT_NAME, COLUMNS.ACQUISITION_CHANNEL],
            name: "Product \xD7 Acquisition Channel",
            filters: [productNameFilter, acquisitionChannelFilter],
            setters: [setProductNameFilter, setAcquisitionChannelFilter]
          },
          {
            fields: [COLUMNS.PRODUCT_GROUP_L1, COLUMNS.REGION],
            name: "Product Group \xD7 Region",
            filters: [productGroupFilter, revenueRegionFilter],
            setters: [setProductGroupFilter, setRevenueRegionFilter]
          },
          {
            fields: [COLUMNS.PRODUCT_GROUP_L1, COLUMNS.CUSTOMER_SEGMENT],
            name: "Product Group \xD7 Segment",
            filters: [productGroupFilter, companySegmentFilter],
            setters: [setProductGroupFilter, setCompanySegmentFilter]
          },
          {
            fields: [COLUMNS.REGION, COLUMNS.CUSTOMER_SEGMENT],
            name: "Region \xD7 Segment",
            filters: [revenueRegionFilter, companySegmentFilter],
            setters: [setRevenueRegionFilter, setCompanySegmentFilter]
          },
          {
            fields: [COLUMNS.CHANNEL, COLUMNS.CUSTOMER_SEGMENT],
            name: "Channel \xD7 Segment",
            filters: [channelFilter, companySegmentFilter],
            setters: [setChannelFilter, setCompanySegmentFilter]
          },
          {
            fields: [COLUMNS.CHANNEL, COLUMNS.REGION],
            name: "Channel \xD7 Region",
            filters: [channelFilter, revenueRegionFilter],
            setters: [setChannelFilter, setRevenueRegionFilter]
          },
          {
            fields: [COLUMNS.CUSTOMER_TYPE, COLUMNS.REGION],
            name: "Customer Type \xD7 Region",
            filters: [isAiCompanyFilter, revenueRegionFilter],
            setters: [setIsAiCompanyFilter, setRevenueRegionFilter]
          },
          {
            fields: [COLUMNS.CUSTOMER_TYPE, COLUMNS.CUSTOMER_SEGMENT],
            name: "Customer Type \xD7 Segment",
            filters: [isAiCompanyFilter, companySegmentFilter],
            setters: [setIsAiCompanyFilter, setCompanySegmentFilter]
          },
          {
            fields: [COLUMNS.ACQUISITION_CHANNEL, COLUMNS.REGION],
            name: "Acquisition Channel \xD7 Region",
            filters: [acquisitionChannelFilter, revenueRegionFilter],
            setters: [setAcquisitionChannelFilter, setRevenueRegionFilter]
          }
        ];
        if (!isLiveMode) crossDimensionalCombos.forEach((combo) => {
          const hasVariation = combo.filters.some(
            (filter) => Array.isArray(filter) && filter.length === 0
          );
          if (hasVariation) {
            const segmentAnalysis = {};
            completeFilteredData.forEach((row) => {
              const values = combo.fields.map((field) => row[field]);
              if (values.every(
                (val) => val && val !== "Unknown" && !shouldExcludeCategory(val)
              )) {
                const segmentKey = values.join(" + ");
                if (!segmentAnalysis[segmentKey]) {
                  segmentAnalysis[segmentKey] = [];
                }
                segmentAnalysis[segmentKey].push(row);
              }
            });
            const segmentGrowthRates = Object.entries(segmentAnalysis).map(([segmentKey, rows]) => {
              const totalValue = calculateMetric(rows);
              if (totalValue < INSIGHT_THRESHOLDS.minSegmentSize) return null;
              const firstPeriodSegmentRows = rows.filter(
                (row) => row[dateField] === completePeriods[0]
              );
              const lastPeriodSegmentRows = rows.filter(
                (row) => row[dateField] === completePeriods[completePeriods.length - 1]
              );
              const firstSegmentValue = calculateMetric(firstPeriodSegmentRows);
              const lastSegmentValue = calculateMetric(lastPeriodSegmentRows);
              if (firstSegmentValue === 0 || firstSegmentValue === null)
                return null;
              const { growthRate, relativeGrowth, direction, absoluteGrowth } = calculateGrowthMetrics2(
                lastSegmentValue,
                firstSegmentValue,
                overallMarketGrowthRate
              );
              return {
                segmentKey,
                originalValues: segmentKey.split(" + "),
                growthRate,
                relativeGrowth,
                direction,
                absoluteGrowth,
                totalValue,
                firstValue: firstSegmentValue,
                lastValue: lastSegmentValue,
                combo
              };
            }).filter(
              (item) => item && Math.abs(item.relativeGrowth) >= INSIGHT_THRESHOLDS.minRelativeGrowthThreshold && item.absoluteGrowth > INSIGHT_THRESHOLDS.minGrowthThreshold
            ).sort(
              (a, b) => Math.abs(b.relativeGrowth) - Math.abs(a.relativeGrowth)
            );
            segmentGrowthRates.slice(0, INSIGHT_LIMITS.generation.allTimeGrowth).forEach((item) => {
              const formattedSegment = item.originalValues.join(" x ");
              const relativeText = item.relativeGrowth > 0 ? ` (${item.relativeGrowth.toFixed(
                1
              )} percentage points above avg.)` : ` (${Math.abs(item.relativeGrowth).toFixed(
                1
              )} percentage points below avg.)`;
              const priority = calculateBasePriority(
                item.relativeGrowth,
                "relative_growth"
              );
              structuredInsights2.advancedInsights.allTimeGrowth.push(
                createInsight(
                  `${METRIC_LABELS[metric] || metric} from ${formattedSegment} users ${item.direction} ${item.absoluteGrowth.toFixed(1)}% from ${formatMetric(
                    item.firstValue
                  )} to ${formatMetric(item.lastValue)}${relativeText}`,
                  priority,
                  "allTimeGrowth",
                  () => {
                    item.combo.setters.forEach((setter, index) => {
                      if (Array.isArray(item.combo.filters[index]) && item.combo.filters[index].length === 0) {
                        setter([item.originalValues[index]]);
                      }
                    });
                    setView("Overall");
                  },
                  createStandardMetadata("cross-dimension", {
                    segmentKey: item.segmentKey,
                    growthRate: item.growthRate,
                    relativeGrowth: item.relativeGrowth,
                    crossDimensionFields: item.combo.fields,
                    crossDimensionName: item.combo.name
                  })
                )
              );
            });
          }
        });
      }
      const detectCategoryTrends = () => {
        if (completePeriods.length < 3) return [];
        const insights = [];
        const recentPeriods = completePeriods.slice(-7);
        if (recentPeriods.length < 3) return [];
        const marketFirstPeriodRows = completeDataByPeriod[recentPeriods[0]] || [];
        const marketLastPeriodRows = completeDataByPeriod[recentPeriods[recentPeriods.length - 1]] || [];
        const marketFirstValue = calculateMetric(marketFirstPeriodRows);
        const marketLastValue = calculateMetric(marketLastPeriodRows);
        if (marketFirstValue === 0 || marketFirstValue === null) return [];
        const { growthRate: overallMarketGrowthRate } = calculateGrowthMetrics2(
          marketLastValue,
          marketFirstValue
        );
        const dimensionsToAnalyze = DIMENSION_DEFINITIONS.filter(
          (dim) => columnExists(COLUMNS[dim.columnKey])
        ).map((dim) => ({
          column: COLUMNS[dim.columnKey],
          filter: getFilterState(dim.filterKey),
          setFilter: getFilterSetState(dim.filterKey),
          viewName: dim.viewName,
          label: dim.insightLabel
        }));
        dimensionsToAnalyze.forEach(
          ({ column, filter, setFilter, viewName, label }) => {
            if (filter.length > 0) return;
            const dimData = precomputed[column] || {};
            const parentPeriodValues = recentPeriods.map((period) => {
              const periodRows = completeDataByPeriod[period] || [];
              return calculateMetric(periodRows);
            }).filter((v) => v != null && !isNaN(v));
            const parentMax = parentPeriodValues.length > 0 ? Math.max(...parentPeriodValues) : 0;
            const parentMin = parentPeriodValues.length > 0 ? Math.min(...parentPeriodValues) : 0;
            const parentRange = parentMax - parentMin;
            Object.keys(dimData).forEach((categoryValue) => {
              if (categoryValue === "Unknown" || shouldExcludeCategory(categoryValue))
                return;
              const catAgg = dimData[categoryValue];
              const categoryRev = catAgg.metric2;
              if (categoryRev < minRevThreshold) return;
              const firstPeriodAgg = catAgg.byPeriod[recentPeriods[0]];
              const lastPeriodAgg = catAgg.byPeriod[recentPeriods[recentPeriods.length - 1]];
              const categoryFirstValue = firstPeriodAgg ? metricFromAgg(firstPeriodAgg.metric1, firstPeriodAgg.metric2, firstPeriodAgg.metric3) : 0;
              const categoryLastValue = lastPeriodAgg ? metricFromAgg(lastPeriodAgg.metric1, lastPeriodAgg.metric2, lastPeriodAgg.metric3) : 0;
              if (categoryFirstValue === 0 || categoryFirstValue === null) return;
              const {
                growthRate: categoryGrowthRate,
                relativeGrowth,
                direction,
                absoluteGrowth
              } = calculateGrowthMetrics2(
                categoryLastValue,
                categoryFirstValue,
                overallMarketGrowthRate
              );
              if (Math.abs(relativeGrowth) < INSIGHT_THRESHOLDS.minRelativeGrowthThreshold)
                return;
              if (absoluteGrowth < INSIGHT_THRESHOLDS.minGrowthThreshold) return;
              const relativeText = relativeGrowth > 0 ? ` (${relativeGrowth.toFixed(1)} percentage points above avg.)` : ` (${Math.abs(relativeGrowth).toFixed(
                1
              )} percentage points below avg.)`;
              const revShare = categoryRev / totalRevShare * 100;
              const absChange = Math.abs(categoryLastValue - categoryFirstValue);
              const normalizedImpact = parentRange > 0 ? absChange / parentRange * 100 : absChange;
              const excessScore = Math.abs(relativeGrowth) * (revShare / 10);
              const severityScore = Math.abs(absoluteGrowth);
              const urgencyMultiplier = absoluteGrowth < 0 ? 1.5 : 1;
              const priority = (normalizedImpact * 0.6 + excessScore * 0.25 + severityScore * 0.15) * urgencyMultiplier;
              insights.push(
                createInsight(
                  `${formatFilterName2(
                    categoryValue
                  )} ${METRIC_LABELS[metric] || metric} ${direction} ${absoluteGrowth.toFixed(
                    1
                  )}% in recent periods (${formatMetric(
                    categoryFirstValue
                  )} \u2192 ${formatMetric(categoryLastValue)})${relativeText}`,
                  priority,
                  "categoryTrends",
                  () => {
                    const categoryAbsChange = categoryLastValue - categoryFirstValue;
                    const categoryExcessGrowth = categoryGrowthRate - overallMarketGrowthRate;
                    setInsightContext((prevContext) => {
                      const newContext = {
                        parentCategory: categoryValue,
                        parentLabel: formatFilterName2(categoryValue),
                        parentGrowth: categoryGrowthRate,
                        parentExcessGrowth: categoryExcessGrowth,
                        marketAvgGrowth: overallMarketGrowthRate,
                        parentAbsChange: categoryAbsChange,
                        periods: recentPeriods,
                        firstValue: categoryFirstValue,
                        lastValue: categoryLastValue,
                        drillPath: prevContext && prevContext.parentCategory ? [
                          ...prevContext && prevContext.drillPath || [],
                          {
                            category: prevContext.parentCategory,
                            label: prevContext.parentLabel,
                            growth: prevContext.parentGrowth,
                            excessGrowth: prevContext.parentExcessGrowth
                          }
                        ] : []
                      };
                      console.log("\u2705 Setting insightContext:", newContext);
                      return newContext;
                    });
                    setFilter([categoryValue]);
                    setView("Overall");
                    setSelectedCategories([]);
                  },
                  createStandardMetadata("single-dimension", {
                    categoryValue,
                    categoryGrowthRate,
                    relativeGrowth,
                    revShare,
                    dimensionColumn: column,
                    viewName,
                    label
                  })
                )
              );
            });
          }
        );
        return deduplicateInsightsByText(
          insights.sort((a, b) => b.priority - a.priority)
        ).slice(0, INSIGHT_LIMITS.generation.categoryTrends);
      };
      structuredInsights2.basicInsights.performanceAlerts = filterInsights(
        detectPerformanceAlerts()
      );
      structuredInsights2.basicInsights.categoryTrends = filterInsights(
        detectCategoryTrends()
      );
      structuredInsights2.basicInsights.shareShifts = filterInsights(
        detectMarketShareShifts()
      );
      structuredInsights2.basicInsights.overallTrends = deduplicateInsightsByText(
        filterInsights(structuredInsights2.basicInsights.overallTrends)
      );
      structuredInsights2.basicInsights.marketLeaders = deduplicateInsightsByText(
        filterInsights(structuredInsights2.basicInsights.marketLeaders)
      );
      if (tabType === "advanced") {
        structuredInsights2.advancedInsights.allTimeGrowth = deduplicateInsightsByText(
          filterInsights(structuredInsights2.advancedInsights.allTimeGrowth)
        );
      }
      Object.keys(structuredInsights2.basicInsights).forEach((category) => {
        structuredInsights2.basicInsights[category] = structuredInsights2.basicInsights[category].map((insight) => ({
          ...insight,
          score: scoreInsight(insight, category)
        })).sort((a, b) => b.score - a.score);
      });
      if (tabType === "advanced") {
        Object.keys(structuredInsights2.advancedInsights).forEach((category) => {
          structuredInsights2.advancedInsights[category] = structuredInsights2.advancedInsights[category].map((insight) => ({
            ...insight,
            score: scoreInsight(insight, category)
          })).sort((a, b) => b.score - a.score);
        });
      }
      return structuredInsights2;
    };
    const createInsightsCacheKey = (metric2, tabType, periods2, activeFilters, contextParent) => {
      const firstPeriods = periods2.slice(0, 3).join(",");
      const lastPeriods = periods2.slice(-3).join(",");
      const filterHash = JSON.stringify(activeFilters);
      const contextKey = contextParent || "root";
      return `${metric2}-${tabType || "none"}-${firstPeriods}-${lastPeriods}-${filterHash}-${contextKey}`;
    };
    React.useEffect(() => {
      if (!activeInsightsTab) {
        setStructuredInsights({
          basicInsights: {
            decomposition: [],
            overallTrends: [],
            marketLeaders: [],
            performanceAlerts: [],
            categoryTrends: [],
            shareShifts: []
          },
          advancedInsights: {
            allTimeGrowth: []
          },
          recommendations: []
        });
        setLoadingInsights(false);
        return;
      }
      const activeFilters = {
        productName: productNameFilter,
        companySegment: companySegmentFilter,
        revenueRegion: revenueRegionFilter,
        revenueCountry: revenueCountryFilter,
        acquisitionChannel: acquisitionChannelFilter,
        pricingType: pricingTypeFilter,
        isAiCompany: isAiCompanyFilter,
        channel: channelFilter,
        productGroup: productGroupFilter,
        productSub: productSubFilter
      };
      const dimDataKey = isLiveMode ? Object.keys(liveInsightsDimAggs).sort().join(",") : "";
      const cacheKey = createInsightsCacheKey(
        metric,
        activeInsightsTab,
        periods,
        activeFilters,
        insightContext && insightContext.parentCategory
      ) + (dimDataKey ? `|dims:${dimDataKey}` : "");
      if (insightsCacheRef.current[cacheKey]) {
        setStructuredInsights(insightsCacheRef.current[cacheKey]);
        setLoadingInsights(false);
        return;
      }
      setLoadingInsights(true);
      const timeoutId = setTimeout(() => {
        const insights = generateStructuredInsights(activeInsightsTab);
        insightsCacheRef.current[cacheKey] = insights;
        const cacheKeys = Object.keys(insightsCacheRef.current);
        if (cacheKeys.length > 10) {
          cacheKeys.slice(0, cacheKeys.length - 10).forEach((key) => {
            delete insightsCacheRef.current[key];
          });
        }
        setStructuredInsights(insights);
        setLoadingInsights(false);
      }, 50);
      return () => clearTimeout(timeoutId);
    }, [
      activeInsightsTab,
      periods,
      filteredData,
      dateField,
      metric,
      calculateMetric,
      formatPeriodDate2,
      productNameFilter,
      companySegmentFilter,
      revenueRegionFilter,
      revenueCountryFilter,
      acquisitionChannelFilter,
      pricingTypeFilter,
      isAiCompanyFilter,
      channelFilter,
      productGroupFilter,
      productSubFilter,
      insightContext,
      // 🆕 CRITICAL: Must include insightContext so insights regenerate when drilling down
      isLiveMode,
      periodAggregates,
      dimensionAggregates,
      liveInsightsDimAggs
    ]);
    const displayedInsights = React.useMemo(() => {
      if (!view) {
        return structuredInsights;
      }
      const viewConfig = VIEW_CONFIG[view];
      if (!viewConfig) {
        return structuredInsights;
      }
      const dimensionLabels = [
        viewConfig.label.toLowerCase(),
        // e.g., "acquisition channels"
        view.toLowerCase()
        // e.g., "acquisition channel"
      ];
      const isRelatedToViewDimension = (insight) => {
        const selectedViewColumn = viewConfig.column;
        const metadata = insight.metadata || {};
        if (metadata.insightType === "global") {
          return true;
        }
        if (metadata.insightType === "cross-dimension" && metadata.dimensionColumns) {
          return metadata.dimensionColumns.includes(selectedViewColumn);
        }
        if (metadata.insightType === "single-dimension" && metadata.dimensionColumn) {
          return metadata.dimensionColumn === selectedViewColumn;
        }
        if (metadata.crossDimensionFields) {
          const matchesCrossField = metadata.crossDimensionFields.some(
            (field) => field === selectedViewColumn
          );
          if (matchesCrossField) return true;
        }
        if (metadata.dimensionColumn) {
          if (metadata.dimensionColumn === selectedViewColumn) {
            return true;
          }
        }
        if (metadata.viewName && metadata.viewName === view) {
          return true;
        }
        if (metadata.label) {
          const insightTextLower = insight.text.toLowerCase();
          const metadataLabel = metadata.label.toLowerCase();
          const matchesLabel = dimensionLabels.some(
            (label) => label.includes(metadataLabel) || metadataLabel.includes(label)
          );
          if (matchesLabel) return true;
        }
        return false;
      };
      const filtered = {
        basicInsights: {},
        advancedInsights: {},
        recommendations: structuredInsights.recommendations
      };
      Object.keys(structuredInsights.basicInsights).forEach((category) => {
        if (category === "performanceAlerts" || category === "overallTrends" || category === "decomposition") {
          filtered.basicInsights[category] = structuredInsights.basicInsights[category];
        } else {
          filtered.basicInsights[category] = structuredInsights.basicInsights[category].filter(isRelatedToViewDimension);
        }
      });
      Object.keys(structuredInsights.advancedInsights).forEach((category) => {
        filtered.advancedInsights[category] = structuredInsights.advancedInsights[category].filter(isRelatedToViewDimension);
      });
      return filtered;
    }, [structuredInsights, view, VIEW_CONFIG]);
    React.useEffect(() => {
      setInsightPagination({});
    }, [displayedInsights]);
    const allMetricsStatData = React.useMemo(() => {
      if (periods.length === 0) {
        return { metric1: null, metric2: null, metric3: null };
      }
      const mainPeriod = periods.length > 1 ? periods[periods.length - 2] : periods[periods.length - 1];
      const previousPeriod = periods.length > 2 ? periods[periods.length - 3] : null;
      const mainAgg = periodAggregates[mainPeriod];
      const prevAgg = previousPeriod ? periodAggregates[previousPeriod] : null;
      let yoyPeriod = null;
      if (dataFrequency === "Weekly") {
        const currentIndex = sortedBaseDataPeriods.indexOf(mainPeriod);
        if (currentIndex >= 52) {
          yoyPeriod = sortedBaseDataPeriods[currentIndex - 52];
        }
      } else {
        const currentYear = parseInt(mainPeriod.substring(0, 4));
        const previousYear = currentYear - 1;
        yoyPeriod = mainPeriod.replace(
          currentYear.toString(),
          previousYear.toString()
        );
      }
      const yoyAgg = yoyPeriod ? baseDataAggregatesByPeriod[yoyPeriod] : null;
      const metrics = ["metric1", "metric2", "metric3"];
      const result = {};
      metrics.forEach((metricName) => {
        const mainValue = mainAgg ? mainAgg[metricName] : 0;
        let change = null;
        let changePercent = null;
        if (prevAgg) {
          const previousValue = prevAgg[metricName];
          change = mainValue - previousValue;
          if (previousValue !== 0) {
            changePercent = change / previousValue * 100;
          }
        }
        let yoyChange = null;
        let yoyAbsoluteChange = null;
        if (yoyAgg) {
          const previousYearValue = yoyAgg[metricName];
          yoyAbsoluteChange = mainValue - previousYearValue;
          yoyChange = calculatePercentageChange2(mainValue, previousYearValue);
        }
        result[metricName] = {
          lastPeriod: mainPeriod,
          lastValue: mainValue,
          change,
          changePercent,
          yoyChange,
          yoyAbsoluteChange
        };
      });
      return result;
    }, [
      periods,
      periodAggregates,
      dataFrequency,
      sortedBaseDataPeriods,
      baseDataAggregatesByPeriod,
      calculatePercentageChange2
    ]);
    const statData = React.useMemo(() => {
      return allMetricsStatData[metric] || null;
    }, [allMetricsStatData, metric]);
    const calculateScenarioChartData = React.useCallback(
      (scenarioSnapshot, scenarioIndex, scenarioLabel) => {
        if (!scenarioSnapshot) return [];
        const scenarioMetric = scenarioSnapshot.metric || "metric2";
        const scenarioView = scenarioSnapshot.view || "Overall";
        const scenarioDateRange = scenarioSnapshot.dateRange || "YTD";
        const scenarioDataFrequency = scenarioSnapshot.dataFrequency || "Monthly";
        const scenarioTopX = scenarioSnapshot.topX || 3;
        const scenarioSelectedCategories = scenarioSnapshot.selectedCategories || [];
        const scenarioShowAllShareTraces = scenarioSnapshot.showAllShareTraces || false;
        const scenarioShowAllGrowthTraces = scenarioSnapshot.showAllGrowthTraces || false;
        const scenarioShowAllDollarTraces = scenarioSnapshot.showAllDollarTraces !== void 0 ? scenarioSnapshot.showAllDollarTraces : true;
        const visibleTraceNames = scenarioSnapshot.visibleTraceNames || null;
        const getScenarioDateField = (freq) => {
          switch (freq) {
            case "Weekly":
              return COLUMNS.REPORTING_WEEK;
            case "Monthly":
              return COLUMNS.REPORTING_MONTH;
            case "Quarterly":
              return COLUMNS.REPORTING_QUARTER;
            case "Yearly":
              return COLUMNS.REPORTING_YEAR;
            default:
              return COLUMNS.REPORTING_MONTH;
          }
        };
        const scenarioDateField = getScenarioDateField(scenarioDataFrequency);
        const scenarioFilteredData = cleanedQueryData.rows.filter((row) => {
          return FILTER_CONFIG_STATIC.every(({ column, key }) => {
            const scenarioFilterState = scenarioSnapshot[key] || [];
            return filterMatches(scenarioFilterState, row[column]);
          });
        });
        const allScenarioDates = Array.from(
          new Set(scenarioFilteredData.map((row) => row[scenarioDateField]))
        ).sort();
        let scenarioFilteredDates = allScenarioDates;
        if (scenarioDateRange !== "All") {
          const now = /* @__PURE__ */ new Date();
          let yearStart = now.getFullYear() + "-01-01";
          let oneYearAgo = now.getFullYear() - 1 + "-" + (now.getMonth() + 1).toString().padStart(2, "0") + "-" + now.getDate().toString().padStart(2, "0");
          let threeMonthsAgo = new Date(now);
          threeMonthsAgo.setMonth(now.getMonth() - 3);
          let oneQuarterAgo = threeMonthsAgo.getFullYear() + "-" + (threeMonthsAgo.getMonth() + 1).toString().padStart(2, "0") + "-" + threeMonthsAgo.getDate().toString().padStart(2, "0");
          switch (scenarioDateRange) {
            case "1Y":
              scenarioFilteredDates = allScenarioDates.filter(
                (date) => date >= oneYearAgo
              );
              break;
            case "YTD":
              scenarioFilteredDates = allScenarioDates.filter(
                (date) => date >= yearStart
              );
              break;
            case "QTD":
              scenarioFilteredDates = allScenarioDates.filter(
                (date) => date >= oneQuarterAgo
              );
              break;
            default:
              scenarioFilteredDates = allScenarioDates;
          }
        }
        const scenarioDataByPeriod = {};
        scenarioFilteredData.filter((row) => scenarioFilteredDates.includes(row[scenarioDateField])).forEach((row) => {
          const period = row[scenarioDateField];
          if (!scenarioDataByPeriod[period]) {
            scenarioDataByPeriod[period] = [];
          }
          scenarioDataByPeriod[period].push(row);
        });
        const scenarioPeriods = Object.keys(scenarioDataByPeriod).sort();
        if (scenarioPeriods.length === 0) return [];
        const scenarioColors = {
          1: "#ef4444",
          // Red
          2: "#10b981",
          // Green
          3: "#8b5cf6"
          // Purple
        };
        const scenarioColor = scenarioColors[scenarioIndex] || "#6b7280";
        const scenarioDashPatterns = {
          1: "solid",
          2: "dash",
          3: "dot"
        };
        const scenarioDash = scenarioDashPatterns[scenarioIndex] || "dash";
        const calculateScenarioMetric = (rows) => {
          return calculateMetricValue(rows, scenarioMetric);
        };
        const formatScenarioMetric = (value) => {
          return formatMetricValue(value, scenarioMetric);
        };
        const scenarioTraces = [];
        if (scenarioView === "Overall") {
          const barData = scenarioPeriods.map((period) => {
            const periodRows = scenarioDataByPeriod[period] || [];
            return calculateScenarioMetric(periodRows);
          });
          const periodsForYoY = scenarioPeriods.slice(0, -1);
          const yoyDataForPeriods = periodsForYoY.map((period) => {
            const periodRows = scenarioDataByPeriod[period] || [];
            const currentValue = calculateScenarioMetric(periodRows);
            let previousValue = null;
            if (scenarioDataFrequency === "Weekly") {
              const allScenarioPeriods = Array.from(
                new Set(scenarioFilteredData.map((row) => row[scenarioDateField]))
              ).sort();
              const currentIndex = allScenarioPeriods.indexOf(period);
              if (currentIndex >= 52) {
                const periodAgo = allScenarioPeriods[currentIndex - 52];
                const previousRows = scenarioFilteredData.filter(
                  (row) => row[scenarioDateField] === periodAgo
                );
                if (previousRows.length > 0) {
                  previousValue = calculateScenarioMetric(previousRows);
                }
              }
            } else {
              const currentYear = parseInt(period.substring(0, 4));
              const previousYear = currentYear - 1;
              const previousPeriod = period.replace(
                currentYear.toString(),
                previousYear.toString()
              );
              const previousRows = scenarioFilteredData.filter(
                (row) => row[scenarioDateField] === previousPeriod
              );
              if (previousRows.length > 0) {
                previousValue = calculateScenarioMetric(previousRows);
              }
            }
            return calculatePercentageChange2(currentValue, previousValue);
          });
          const yoyData = [...yoyDataForPeriods, null];
          scenarioTraces.push({
            type: "bar",
            x: scenarioPeriods,
            y: barData,
            name: `[${scenarioLabel}] ${scenarioMetric}`,
            marker: {
              color: scenarioColor,
              line: { color: "rgba(255,255,255,0.3)", width: 0.5 },
              opacity: 0.6
            },
            customdata: barData.map((value) => formatMetricValue(value, scenarioMetric)),
            hovertemplate: `[${scenarioLabel}] ${scenarioMetric}<br>%{customdata}<extra></extra>`,
            visible: "legendonly"
            // Hidden by default, user can show via legend
          });
          const scenarioYoYLabel = scenarioDataFrequency === "Weekly" ? "52W" : "YoY";
          scenarioTraces.push({
            type: "scatter",
            mode: "lines+markers",
            x: scenarioPeriods,
            y: yoyData.map(capYoYForDisplay2),
            name: `[${scenarioLabel}] ${scenarioYoYLabel} Change %`,
            yaxis: "y2",
            line: {
              color: scenarioColor,
              width: 2.5,
              dash: scenarioDash
            },
            marker: {
              size: 3,
              color: scenarioColor,
              symbol: scenarioIndex === 1 ? "circle" : scenarioIndex === 2 ? "square" : "diamond"
            },
            customdata: yoyData.map(formatYoYValue2),
            hovertemplate: `[${scenarioLabel}] ${scenarioYoYLabel} Change: %{customdata}<extra></extra>`,
            connectgaps: false,
            visible: "legendonly"
          });
        } else {
          const config = VIEW_CONFIG[scenarioView];
          if (config) {
            const attribute = config.column;
            const attributeValues = Array.from(
              new Set(
                scenarioFilteredData.filter(
                  (row) => scenarioFilteredDates.includes(row[scenarioDateField])
                ).map((row) => row[attribute]).filter((val) => val && val !== "Unknown")
              )
            );
            const attributeTotals = attributeValues.map((attrValue) => {
              const attrRows = scenarioFilteredData.filter(
                (row) => scenarioFilteredDates.includes(row[scenarioDateField]) && row[attribute] === attrValue
              );
              let total;
              if (scenarioMetric === "metric3") {
                total = attrRows.reduce(
                  (sum, row) => sum + (row[COLUMNS.METRIC2] || 0),
                  0
                );
              } else {
                total = calculateScenarioMetric(attrRows);
              }
              return { attrValue, total };
            });
            const sortedAttributes = attributeTotals.sort(
              (a, b) => b.total - a.total
            );
            const topXCategories = sortedAttributes.slice(0, scenarioTopX).map((item) => item.attrValue);
            const manualCategories = scenarioSelectedCategories.filter(
              (cat) => attributeValues.includes(cat)
            );
            const combinedCategories = Array.from(
              /* @__PURE__ */ new Set([...topXCategories, ...manualCategories])
            );
            const restAttributes = attributeValues.filter(
              (val) => !combinedCategories.includes(val)
            );
            const allCategories = [...combinedCategories];
            if (restAttributes.length > 0) {
              allCategories.push("Rest Combined");
            }
            allCategories.forEach((category, index) => {
              const traceData = scenarioPeriods.map((period) => {
                const periodRows = scenarioDataByPeriod[period] || [];
                if (category === "Rest Combined") {
                  const periodRestRows = periodRows.filter(
                    (row) => restAttributes.includes(row[attribute])
                  );
                  return calculateScenarioMetric(periodRestRows);
                } else {
                  const periodAttrRows = periodRows.filter(
                    (row) => row[attribute] === category
                  );
                  return calculateScenarioMetric(periodAttrRows);
                }
              });
              const categoryColor = getCategoryColor(category, index);
              const blendedColor = scenarioColor;
              if (resolveChartType(scenarioMetric) === "line") {
                scenarioTraces.push({
                  type: "scatter",
                  mode: "lines+markers",
                  name: `[${scenarioLabel}] ${category} - ${scenarioMetric}`,
                  x: scenarioPeriods,
                  y: traceData,
                  visible: "legendonly",
                  line: {
                    color: blendedColor,
                    width: 2,
                    dash: scenarioDash
                  },
                  marker: {
                    size: 3,
                    color: blendedColor,
                    symbol: scenarioIndex === 1 ? "circle" : scenarioIndex === 2 ? "square" : "diamond"
                  },
                  customdata: traceData.map((value) => formatMetricValue(value, scenarioMetric)),
                  hovertemplate: `[${scenarioLabel}] ${category}<br>%{customdata}<extra></extra>`
                });
              } else {
                const periodTotals = scenarioPeriods.map((period) => {
                  const periodRows = scenarioDataByPeriod[period] || [];
                  return calculateScenarioMetric(periodRows);
                });
                const shares = traceData.map((value, periodIndex) => {
                  const totalForPeriod = periodTotals[periodIndex];
                  return totalForPeriod > 0 ? value / totalForPeriod * 100 : 0;
                });
                if (scenarioShowAllDollarTraces) {
                  scenarioTraces.push({
                    type: "bar",
                    name: `[${scenarioLabel}] ${category} - ${scenarioMetric}`,
                    x: scenarioPeriods,
                    y: traceData,
                    visible: "legendonly",
                    marker: {
                      color: blendedColor,
                      line: { color: "rgba(255,255,255,0.3)", width: 0.5 },
                      opacity: 0.5
                    },
                    customdata: traceData.map((value) => formatMetricValue(value, scenarioMetric)),
                    hovertemplate: `[${scenarioLabel}] ${category}<br>%{customdata}<extra></extra>`
                  });
                }
                if (scenarioShowAllShareTraces) {
                  scenarioTraces.push({
                    type: "scatter",
                    mode: "lines+markers",
                    name: `[${scenarioLabel}] ${category} - %Share`,
                    x: scenarioPeriods,
                    y: shares,
                    visible: "legendonly",
                    line: {
                      color: blendedColor,
                      width: 2,
                      dash: scenarioDash
                    },
                    marker: {
                      size: 3,
                      color: blendedColor,
                      symbol: scenarioIndex === 1 ? "circle" : scenarioIndex === 2 ? "square" : "diamond"
                    },
                    yaxis: "y2",
                    customdata: shares.map((share) => share != null ? `${share.toFixed(1)}%` : ""),
                    hovertemplate: `[${scenarioLabel}] ${category} - %Share<br>%{customdata}<extra></extra>`
                  });
                }
                if (scenarioShowAllGrowthTraces) {
                  const shareGrowthRates = shares.map(
                    (currentShare, periodIndex) => {
                      const currentPeriod = scenarioPeriods[periodIndex];
                      let previousPeriod;
                      if (scenarioDataFrequency === "Weekly") {
                        const allPeriods = Array.from(
                          new Set(
                            scenarioFilteredData.map(
                              (row) => row[scenarioDateField]
                            )
                          )
                        ).sort();
                        const currentIndex = allPeriods.indexOf(currentPeriod);
                        if (currentIndex === -1 || currentIndex < 52) return null;
                        previousPeriod = allPeriods[currentIndex - 52];
                      } else {
                        const currentYear = parseInt(
                          currentPeriod.substring(0, 4)
                        );
                        const previousYear = currentYear - 1;
                        previousPeriod = currentPeriod.replace(
                          currentYear.toString(),
                          previousYear.toString()
                        );
                      }
                      const previousPeriodRows = scenarioFilteredData.filter(
                        (row) => row[scenarioDateField] === previousPeriod
                      );
                      if (previousPeriodRows.length === 0) return null;
                      let previousCategoryValue;
                      if (category === "Rest Combined") {
                        const previousRestRows = previousPeriodRows.filter(
                          (row) => restAttributes.includes(row[attribute])
                        );
                        previousCategoryValue = calculateScenarioMetric(previousRestRows);
                      } else {
                        const previousCategoryRows = previousPeriodRows.filter(
                          (row) => row[attribute] === category
                        );
                        previousCategoryValue = calculateScenarioMetric(previousCategoryRows);
                      }
                      const previousPeriodTotal = calculateScenarioMetric(previousPeriodRows);
                      if (previousPeriodTotal === 0 || previousPeriodTotal === null)
                        return null;
                      const previousShare = previousPeriodTotal > 0 ? previousCategoryValue / previousPeriodTotal * 100 : 0;
                      if (previousShare === 0 || previousShare === null)
                        return null;
                      if (currentShare === 0 || currentShare === null)
                        return null;
                      return calculatePercentageChange2(
                        currentShare,
                        previousShare
                      );
                    }
                  );
                  scenarioTraces.push({
                    type: "scatter",
                    mode: "lines+markers",
                    name: `[${scenarioLabel}] ${category} - %Share Growth`,
                    x: scenarioPeriods,
                    y: shareGrowthRates.map(capYoYForDisplay2),
                    visible: "legendonly",
                    line: {
                      color: blendedColor,
                      width: 2,
                      dash: scenarioDash
                    },
                    marker: {
                      size: 3,
                      color: blendedColor,
                      symbol: scenarioIndex === 1 ? "circle" : scenarioIndex === 2 ? "square" : "diamond"
                    },
                    yaxis: "y2",
                    customdata: shareGrowthRates.map(formatYoYValue2),
                    hovertemplate: `[${scenarioLabel}] ${category} - %Share Growth<br>%{customdata}<extra></extra>`
                  });
                }
              }
            });
          }
        }
        if (visibleTraceNames && visibleTraceNames.length > 0) {
          const getBaseTraceName = (scenarioTraceName) => {
            const match = scenarioTraceName.match(/^\[.*?\]\s*(.+)$/);
            return match ? match[1] : scenarioTraceName;
          };
          const filteredTraces = scenarioTraces.filter((trace) => {
            const baseName = getBaseTraceName(trace.name);
            return visibleTraceNames.includes(baseName);
          });
          return filteredTraces;
        }
        return scenarioTraces;
      },
      [
        cleanedQueryData.rows,
        FILTER_CONFIG,
        filterMatches,
        calculateMetricValue,
        formatMetricValue,
        VIEW_CONFIG,
        getCategoryColor,
        calculatePercentageChange2,
        formatYoYValue2,
        capYoYForDisplay2
      ]
    );
    const getHighlightPeriods = React.useCallback(
      (insight) => {
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
      },
      [periods]
    );
    const applyHighlightingToChartData = React.useCallback(
      (chartData2, highlightPeriods) => {
        if (!highlightPeriods || highlightPeriods.length === 0) return chartData2;
        return chartData2.map((trace) => {
          if (!trace.x || !Array.isArray(trace.x)) return trace;
          const markerSizes = trace.marker && trace.marker.size ? Array.isArray(trace.marker.size) ? [...trace.marker.size] : new Array(trace.x.length).fill(trace.marker.size || 6) : new Array(trace.x.length).fill(6);
          const markerColors = trace.marker && trace.marker.color ? Array.isArray(trace.marker.color) ? [...trace.marker.color] : new Array(trace.x.length).fill(trace.marker.color || "#6366f1") : new Array(trace.x.length).fill(trace.color || "#6366f1");
          const lineWidths = trace.line && trace.line.width ? Array.isArray(trace.line.width) ? [...trace.line.width] : new Array(trace.x.length).fill(trace.line.width || 2.5) : new Array(trace.x.length).fill(2.5);
          const lineColors = trace.line && trace.line.color ? Array.isArray(trace.line.color) ? [...trace.line.color] : new Array(trace.x.length).fill(trace.line.color || "#6366f1") : new Array(trace.x.length).fill(trace.color || "#6366f1");
          trace.x.forEach((period, index) => {
            if (highlightPeriods.includes(period)) {
              markerSizes[index] = (trace.type === "bar" ? 1.3 : 1.8) * (markerSizes[index] || 6);
              markerColors[index] = "#ef4444";
              if (trace.type === "scatter" && trace.mode && trace.mode.includes("lines")) {
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
                color: markerColors
              };
            }
            if (trace.mode && trace.mode.includes("lines")) {
              updatedTrace.line = {
                ...trace.line,
                width: lineWidths,
                color: lineColors
              };
            }
          } else if (trace.type === "bar") {
            const currentLineColor = trace.marker && trace.marker.line && trace.marker.line.color || "rgba(255,255,255,0.3)";
            const currentLineWidth = trace.marker && trace.marker.line && trace.marker.line.width || 0.5;
            const baseLineColor = Array.isArray(currentLineColor) ? currentLineColor[0] : currentLineColor;
            const baseLineWidth = Array.isArray(currentLineWidth) ? currentLineWidth[0] : currentLineWidth;
            updatedTrace.marker = {
              ...trace.marker,
              line: {
                ...trace.marker && trace.marker.line ? trace.marker.line : {},
                color: trace.x.map(
                  (period) => highlightPeriods.includes(period) ? "#ef4444" : baseLineColor
                ),
                width: trace.x.map(
                  (period) => highlightPeriods.includes(period) ? 3 : baseLineWidth
                )
              }
            };
          }
          return updatedTrace;
        });
      },
      []
    );
    const formatXAxisTicks = React.useCallback(
      (periodsArray) => {
        if (periodsArray.length <= 12) {
          return periodsArray.map((period) => formatPeriodDate2(period));
        }
        return void 0;
      },
      [formatPeriodDate2]
    );
    const prepareChartDataByAttribute = React.useCallback(
      (attribute, attributeName) => {
        const dimTotals = dimensionCategoryTotals[attribute] || {};
        const attributeValues = Object.keys(dimTotals);
        const attributeTotals = attributeValues.map((attrValue) => {
          const totals = dimTotals[attrValue] || {
            metric1: 0,
            metric2: 0
          };
          const total = metric === "metric3" ? totals.metric2 : totals[metric] || totals.metric1;
          return { attrValue, total };
        });
        const sortedAttributes = attributeTotals.sort(
          (a, b) => b.total - a.total
        );
        let topAttributes, restAttributes;
        if (isLiveMode && topX > 0) {
          topAttributes = attributeValues;
          restAttributes = [];
        } else {
          const topXCategories = sortedAttributes.slice(0, topX).map((item) => item.attrValue);
          const manualCategories = selectedCategories.filter(
            (cat) => attributeValues.includes(cat)
          );
          const combinedCategories = Array.from(
            /* @__PURE__ */ new Set([...topXCategories, ...manualCategories])
          );
          topAttributes = combinedCategories;
          restAttributes = attributeValues.filter(
            (val) => !topAttributes.includes(val)
          );
        }
        const allCategories = [...topAttributes];
        if (restAttributes.length > 0) {
          allCategories.push("Rest Combined");
        }
        const periodTotals = periods.map((period) => {
          const agg = periodAggregates[period];
          if (!agg) return 0;
          return agg[metric] || agg.metric1;
        });
        const sharePercentages = {};
        const dimAgg = dimensionAggregates[attribute] || {};
        const chartData2 = [];
        allCategories.forEach((category, index) => {
          const traceData = periods.map((period) => {
            if (category !== "Rest Combined" || isLiveMode && topX > 0) {
              if (isLiveMode && topX > 0) {
                const periodAgg = dimensionAggregates[attribute]?.[period];
                if (!periodAgg || !(category in periodAgg)) return null;
              }
              return getDimMetric(
                dimensionAggregates,
                attribute,
                period,
                category,
                metric
              );
            }
            if (metric === "metric3") {
              let m1Sum = 0, m2Sum = 0;
              const dimAgg2 = dimensionAggregates[attribute];
              restAttributes.forEach((restAttr) => {
                const catAgg = dimAgg2 && dimAgg2[period] && dimAgg2[period][restAttr];
                if (catAgg) {
                  m1Sum += catAgg.metric1 || 0;
                  m2Sum += catAgg.metric2 || 0;
                }
              });
              return m1Sum > 0 ? 1e4 * m2Sum / m1Sum : 0;
            }
            return restAttributes.reduce(
              (sum, attr) => sum + getDimMetric(
                dimensionAggregates,
                attribute,
                period,
                attr,
                metric
              ),
              0
            );
          });
          const textAnnotations = traceData.map((value, periodIndex) => {
            const period = periods[periodIndex];
            const totalForPeriod = periodTotals[periodIndex];
            const periodTotalAgg = periodAggregates[period];
            let percentage;
            if (metric === "metric3") {
              const totalM1 = periodTotalAgg ? periodTotalAgg.metric1 : 0;
              let categoryM1 = 0;
              if (category === "Rest Combined" && !(isLiveMode && topX > 0)) {
                restAttributes.forEach((restAttr) => {
                  const catAgg = dimAgg[period] && dimAgg[period][restAttr];
                  if (catAgg) categoryM1 += catAgg.metric1;
                });
              } else {
                const catAgg = dimAgg[period] && dimAgg[period][category];
                if (catAgg) categoryM1 = catAgg.metric1;
              }
              percentage = totalM1 > 0 ? categoryM1 / totalM1 * 100 : 0;
            } else {
              percentage = value !== null && totalForPeriod > 0 ? value / totalForPeriod * 100 : 0;
            }
            if (metric !== "metric3") {
              if (!sharePercentages[category]) {
                sharePercentages[category] = [];
              }
              sharePercentages[category].push(value === null ? null : percentage);
            }
            if (value === 0 || value === null) return "";
            return formatMetric(value) + "<br>" + percentage.toFixed(1) + "%";
          });
          const dimColorMap = categoryColorMap[attribute] || {};
          const categoryColor = dimColorMap[category] || getCategoryColor(category, index);
          const chartType = resolveChartType(metric);
          if (chartType === "line") {
            chartData2.push({
              type: "scatter",
              mode: "lines+markers",
              name: `${category} - ${METRIC_LABELS[metric] || metric}`,
              x: periods,
              y: traceData,
              visible: true,
              line: {
                color: categoryColor,
                width: 2.5
              },
              marker: {
                size: 3,
                color: categoryColor
              },
              customdata: traceData.map((value) => formatMetricValue(value, metric)),
              hovertemplate: category + "<br>%{customdata}<extra></extra>"
            });
          } else {
            chartData2.push({
              type: "bar",
              name: `${category} - ${METRIC_LABELS[metric] || metric}`,
              x: periods,
              y: traceData,
              visible: showAllDollarTraces ? true : "legendonly",
              marker: {
                color: categoryColor,
                line: { color: "rgba(255,255,255,0.3)", width: 0.5 },
                opacity: 0.85
              },
              // Add text annotations with percentage
              text: textAnnotations,
              textposition: "inside",
              textfont: {
                color: isDarkMode ? "#ffffff" : "#111827",
                size: 9,
                family: "'Inter', 'Segoe UI', sans-serif"
              },
              insidetextanchor: "middle",
              customdata: traceData.map((value) => formatMetricValue(value, metric)),
              hovertemplate: category + "<br>%{customdata}<extra></extra>"
            });
          }
          if (chartType !== "line") {
            const shares = sharePercentages[category] || [];
            chartData2.push({
              type: "scatter",
              mode: "lines+markers",
              name: `${category} - %Share`,
              x: periods,
              y: shares,
              visible: showAllShareTraces ? true : "legendonly",
              line: {
                color: categoryColor,
                width: 2,
                dash: "dot"
              },
              marker: {
                size: 3,
                color: categoryColor
              },
              yaxis: "y2",
              customdata: shares.map((share) => share != null ? `${share.toFixed(1)}%` : ""),
              hovertemplate: `${category} - %Share<br>%{customdata}<extra></extra>`
            });
            const periodsForYoY = periods.slice(0, -1);
            const yoyGrowthRatesForPeriods = periodsForYoY.map(
              (currentPeriod) => {
                let currentCategoryValue;
                if (category === "Rest Combined" && !(isLiveMode && topX > 0)) {
                  currentCategoryValue = 0;
                  restAttributes.forEach((restAttr) => {
                    currentCategoryValue += getDimMetric(
                      baseDimensionAggregates,
                      attribute,
                      currentPeriod,
                      restAttr,
                      metric
                    );
                  });
                } else {
                  currentCategoryValue = getDimMetric(
                    baseDimensionAggregates,
                    attribute,
                    currentPeriod,
                    category,
                    metric
                  );
                }
                let previousPeriod;
                if (dataFrequency === "Weekly") {
                  const currentIndex = sortedBaseDataPeriods.indexOf(currentPeriod);
                  if (currentIndex === -1 || currentIndex < 52) return null;
                  previousPeriod = sortedBaseDataPeriods[currentIndex - 52];
                } else {
                  const currentYear = parseInt(currentPeriod.substring(0, 4));
                  const previousYear = currentYear - 1;
                  previousPeriod = currentPeriod.replace(
                    currentYear.toString(),
                    previousYear.toString()
                  );
                }
                const dimAgg2 = baseDimensionAggregates[attribute];
                if (!dimAgg2 || !dimAgg2[previousPeriod]) {
                  return null;
                }
                let previousCategoryValue;
                if (category === "Rest Combined" && !(isLiveMode && topX > 0)) {
                  previousCategoryValue = 0;
                  restAttributes.forEach((restAttr) => {
                    previousCategoryValue += getDimMetric(
                      baseDimensionAggregates,
                      attribute,
                      previousPeriod,
                      restAttr,
                      metric
                    );
                  });
                } else {
                  previousCategoryValue = getDimMetric(
                    baseDimensionAggregates,
                    attribute,
                    previousPeriod,
                    category,
                    metric
                  );
                }
                return calculatePercentageChange2(
                  currentCategoryValue,
                  previousCategoryValue
                );
              }
            );
            const yoyGrowthRates = [...yoyGrowthRatesForPeriods, null];
            chartData2.push({
              type: "scatter",
              mode: "lines+markers",
              name: `${category} - %Growth YoY`,
              x: periods,
              y: yoyGrowthRates.map(capYoYForDisplay2),
              // Cap infinity for display
              visible: showAllGrowthTraces ? true : "legendonly",
              line: {
                color: categoryColor,
                width: 2,
                dash: "solid"
              },
              marker: {
                size: 3,
                color: categoryColor
              },
              yaxis: "y2",
              customdata: yoyGrowthRates.map(formatYoYValue2),
              hovertemplate: `${category} - %Growth YoY<br>%{customdata}<extra></extra>`
            });
          }
        });
        const splitChartType = resolveChartType(metric);
        const referenceLineData = splitChartType === "line" ? periods.map((period) => {
          const agg = periodAggregates[period];
          if (!agg) return 0;
          return agg[metric] || 0;
        }) : null;
        if (splitChartType === "line" && referenceLineData) {
          chartData2.push({
            type: "scatter",
            mode: "lines+markers",
            x: periods,
            y: referenceLineData,
            name: "Overall Average",
            line: {
              color: "#6b7280",
              width: 2,
              dash: "dash"
            },
            marker: {
              size: 3,
              color: "#6b7280"
            },
            customdata: referenceLineData.map((value) => formatMetricValue(value, metric)),
            hovertemplate: "Overall Average: %{customdata}<extra></extra>"
          });
        }
        const titleText = getSimpleChartTitle();
        const showLegend = true;
        const chartLayout2 = {
          title: {
            text: titleText,
            font: { size: 16, color: "#374151" }
          },
          barmode: splitChartType === "line" ? void 0 : splitChartType === "grouped" ? "group" : "relative",
          showlegend: showLegend,
          legend: {
            x: 1.02,
            y: 1,
            xanchor: "left",
            yanchor: "top",
            bgcolor: "rgba(255, 255, 255, 0.8)",
            bordercolor: "#e5e7eb",
            borderwidth: 1,
            traceorder: "reversed"
            // Reverse legend order to match visual stacking
          },
          xaxis: {
            type: "category",
            // Treat as categorical to avoid timezone date parsing issues
            title: {
              text: dataFrequency.replace("ly", ""),
              font: { size: 14, color: "#374151" }
            },
            tickfont: { color: "#6b7280" },
            linecolor: "#e5e7eb",
            showgrid: false,
            showspikes: false,
            // Show all ticks if total number of ticks is <= 12
            tickmode: periods.length <= 12 ? "array" : "auto",
            tickvals: periods.length <= 12 ? periods : void 0,
            ticktext: formatXAxisTicks(periods)
          },
          yaxis: {
            title: {
              text: isLiveMode ? METRIC_LABELS[metric] || metric : splitChartType === "line" ? "Basis Points" : "USD",
              font: { size: 14, color: "#374151" }
            },
            tickfont: { color: "#6b7280" },
            zerolinecolor: "#e5e7eb",
            showgrid: false,
            showspikes: false,
            // Add range calculation to include negative values in stacked bars
            range: (() => {
              const barTraces = chartData2.filter((trace) => trace.type === "bar");
              if (barTraces.length === 0) return void 0;
              const numPeriods = barTraces[0] && barTraces[0].y ? barTraces[0].y.length : 0;
              let maxStackedPositive = 0;
              let minStackedNegative = 0;
              for (let i = 0; i < numPeriods; i++) {
                let positiveSum = 0;
                let negativeSum = 0;
                barTraces.forEach((trace) => {
                  const value = trace.y[i] || 0;
                  if (value > 0) {
                    positiveSum += value;
                  } else if (value < 0) {
                    negativeSum += value;
                  }
                });
                maxStackedPositive = Math.max(maxStackedPositive, positiveSum);
                minStackedNegative = Math.min(minStackedNegative, negativeSum);
              }
              if (minStackedNegative < 0) {
                return [minStackedNegative * 1.3, maxStackedPositive * 1.3];
              } else if (maxStackedPositive > 0) {
                return [0, maxStackedPositive * 1.3];
              }
              return void 0;
            })()
          },
          hovermode: "x unified"
        };
        if (splitChartType !== "line") {
          chartLayout2.yaxis2 = {
            title: {
              text: "% Share / %Growth YoY",
              font: { size: 12, color: "#6366f1" }
            },
            tickfont: { color: "#6366f1", size: 11 },
            overlaying: "y",
            side: "right",
            showgrid: false,
            zeroline: showAllShareTraces || showAllGrowthTraces,
            zerolinewidth: 2,
            zerolinecolor: "#d1d5db"
          };
        }
        return { chartData: chartData2, chartLayout: chartLayout2 };
      },
      [
        filteredData,
        periods,
        dateField,
        metric,
        topX,
        categorySelectionMode,
        selectedCategories,
        calculateMetric,
        formatMetric,
        getSimpleChartTitle,
        showAllShareTraces,
        showAllGrowthTraces,
        showAllDollarTraces,
        dataFrequency,
        baseFilteredData,
        formatPeriodDate2,
        formatXAxisTicks,
        formatYoYValue2,
        capYoYForDisplay2,
        // Optimization: pre-computed aggregates
        dimensionAggregates,
        dimensionCategoryTotals,
        getDimMetric,
        periodAggregates,
        // Optimization: pre-computed base data aggregates for YoY calculations
        baseDataAggregatesByPeriod,
        baseDimensionAggregates,
        sortedBaseDataPeriods,
        // Theme
        isDarkMode,
        theme,
        METRIC_LABELS,
        categoryColorMap
      ]
    );
    const getVisibleTraceNames = React.useCallback(() => {
      let chartData2 = [];
      if (view === "Overall") {
        chartData2 = [{ name: METRIC_LABELS[metric] || metric, visible: true }];
        OVERLAY_CONFIG.forEach((overlay) => {
          if (activeOverlays[overlay.id]) {
            const name = overlay.isForecast ? overlay.label : overlay.isSMA ? `SMA(${smaWindow})` : overlay.label + " Change %";
            chartData2.push({ name, visible: true });
          }
        });
      } else {
        const config = VIEW_CONFIG[view];
        if (config) {
          const result = prepareChartDataByAttribute(config.column, config.label);
          chartData2 = result.chartData;
        }
      }
      const visibleTraceNames = chartData2.filter(
        (trace) => trace.visible !== "legendonly" && trace.visible !== false
      ).map((trace) => trace.name);
      return visibleTraceNames;
    }, [view, metric, dataFrequency, prepareChartDataByAttribute, VIEW_CONFIG, activeOverlays, smaWindow, forecastHorizon, METRIC_LABELS]);
    const setScenario = React.useCallback(
      (index) => {
        const snapshot = captureStateSnapshot();
        snapshot.visibleTraceNames = getVisibleTraceNames();
        if (index === 1) {
          setScenario1(snapshot);
          setActiveScenarios((prev) => ({ ...prev, scenario1: true }));
        } else if (index === 2) {
          setScenario2(snapshot);
          setActiveScenarios((prev) => ({ ...prev, scenario2: true }));
        } else if (index === 3) {
          setScenario3(snapshot);
          setActiveScenarios((prev) => ({ ...prev, scenario3: true }));
        }
      },
      [captureStateSnapshot, getVisibleTraceNames]
    );
    const { chartData, chartLayout } = React.useMemo(() => {
      let chartData2 = [];
      let chartLayout2 = {};
      if (view === "Overall") {
        const barData = periods.map((period) => {
          const agg = periodAggregates[period];
          return agg ? agg[metric] || 0 : 0;
        });
        const overlayTraces = [];
        let primaryOverlayData = null;
        OVERLAY_CONFIG.forEach((overlay) => {
          if (!activeOverlays[overlay.id]) return;
          if (overlay.isForecast) return;
          if (overlay.isSMA) {
            const smaData = calculateSMA(barData, smaWindow);
            overlayTraces.push({
              type: "scatter",
              mode: "lines",
              x: periods,
              y: smaData,
              name: `SMA(${smaWindow})`,
              yaxis: "y",
              line: { color: overlay.color, width: 2, dash: "dot" },
              customdata: smaData.map((v) => v !== null ? formatMetricValue(v, metric) : "N/A"),
              hovertemplate: `SMA(${smaWindow}): %{customdata}<extra></extra>`,
              connectgaps: false
            });
          } else {
            if (overlay.minGrain && GRAIN_RANK[overlay.minGrain] < GRAIN_RANK[dataFrequency]) return;
            const lookback = overlay.lookback[dataFrequency];
            if (!lookback || periods.length <= lookback) return;
            const changeData = periods.map((period, i) => {
              const currentIndex = sortedBaseDataPeriods.indexOf(period);
              if (currentIndex === -1) return null;
              return calculatePeriodChange(currentIndex, barData[i], lookback, sortedBaseDataPeriods, baseDataAggregatesByPeriod, metric);
            });
            if (!primaryOverlayData) primaryOverlayData = { data: changeData, label: overlay.label };
            overlayTraces.push({
              type: "scatter",
              mode: "lines+markers",
              x: periods,
              y: changeData.map(capYoYForDisplay2),
              name: overlay.label + " Change %",
              yaxis: "y2",
              line: { color: overlay.color, width: 2.5, shape: "spline", smoothing: 0.3 },
              marker: { size: 3, color: overlay.color, line: { color: "#ffffff", width: 1 } },
              customdata: changeData.map(formatYoYValue2),
              hovertemplate: overlay.label + " Change: %{customdata}<extra></extra>",
              connectgaps: false
            });
          }
        });
        const activeForecastOverlays = OVERLAY_CONFIG.filter((o) => o.isForecast && activeOverlays[o.id]);
        let forecastExtendedPeriods = periods;
        let forecastUpperMax = 0;
        const fullHistoryValues = sortedBaseDataPeriods.map((p) => {
          const agg = baseDataAggregatesByPeriod[p];
          return agg ? agg[metric] || 0 : 0;
        });
        if (activeForecastOverlays.length > 0 && fullHistoryValues.length >= 3) {
          const futurePeriods = generateFuturePeriods(sortedBaseDataPeriods, dataFrequency, forecastHorizon);
          forecastExtendedPeriods = [...periods, ...futurePeriods];
          activeForecastOverlays.forEach((overlay) => {
            let result;
            if (overlay.id === "forecast_hw") {
              const sp = detectSeasonalPeriod(dataFrequency);
              result = sp && fullHistoryValues.length >= sp * 2 ? forecastHoltWinters(fullHistoryValues, forecastHorizon, sp) : forecastLinear(fullHistoryValues, forecastHorizon);
            } else {
              result = forecastLinear(fullHistoryValues, forecastHorizon);
            }
            if (!result) return;
            forecastUpperMax = Math.max(forecastUpperMax, ...result.upper);
            const lastActualValue = barData[barData.length - 1];
            const bridgeY = new Array(periods.length).fill(null);
            bridgeY[periods.length - 1] = lastActualValue;
            const forecastY = [...bridgeY, ...result.forecast];
            const upperY = [...bridgeY, ...result.upper];
            const lowerY = [...new Array(periods.length).fill(null).map((_, i) => i === periods.length - 1 ? lastActualValue : null), ...result.lower];
            const mapeLabel = result.mape > 0 ? ` (MAPE: ${result.mape.toFixed(1)}%)` : "";
            overlayTraces.push({
              type: "scatter",
              mode: "lines",
              x: forecastExtendedPeriods,
              y: forecastY,
              name: `${overlay.label}${mapeLabel}`,
              yaxis: "y",
              line: { color: overlay.color, width: 2.5, dash: "dash" },
              connectgaps: false,
              customdata: forecastY.map((v) => v !== null ? formatMetricValue(v, metric) : "N/A"),
              hovertemplate: `${overlay.label}: %{customdata}<extra></extra>`
            });
            overlayTraces.push({
              type: "scatter",
              mode: "lines",
              x: forecastExtendedPeriods,
              y: upperY,
              yaxis: "y",
              line: { width: 0 },
              showlegend: false,
              hoverinfo: "skip"
            });
            overlayTraces.push({
              type: "scatter",
              mode: "lines",
              x: forecastExtendedPeriods,
              y: lowerY,
              yaxis: "y",
              line: { width: 0 },
              fill: "tonexty",
              fillcolor: hexToRgba(overlay.color, 0.12),
              showlegend: false,
              hoverinfo: "skip"
            });
          });
        }
        const activeChangeOverlays = OVERLAY_CONFIG.filter((o) => !o.isSMA && !o.isForecast && activeOverlays[o.id] && !(o.minGrain && GRAIN_RANK[o.minGrain] < GRAIN_RANK[dataFrequency]) && !(o.lookback && o.lookback[dataFrequency] && periods.length <= o.lookback[dataFrequency]));
        const textAnnotations = barData.map((value, index) => {
          let annotation = formatMetric(value);
          if (activeChangeOverlays.length === 1 && primaryOverlayData) {
            const changeVal = primaryOverlayData.data[index];
            if (changeVal !== null) {
              annotation += "<br>" + primaryOverlayData.label + ": " + formatYoYValue(changeVal);
            }
          }
          return annotation;
        });
        const barColors = barData.map((_, index) => {
          if (index === barData.length - 1) {
            return "rgba(156, 163, 175, 0.6)";
          }
          return MODERN_COLOR_PALETTE[0];
        });
        const overallChartType = resolveChartType(metric);
        const mainTrace = overallChartType === "line" ? {
          type: "scatter",
          mode: "lines+markers",
          x: periods,
          y: barData,
          name: METRIC_LABELS[metric] || metric,
          line: { color: MODERN_COLOR_PALETTE[0], width: 2.5, shape: "spline", smoothing: 0.3 },
          marker: { size: 5, color: MODERN_COLOR_PALETTE[0] },
          text: textAnnotations,
          textposition: "top center",
          textfont: { color: theme.textPrimary, size: 11 },
          customdata: barData.map((value) => formatMetricValue(value, metric)),
          hovertemplate: "%{customdata}<extra></extra>"
        } : {
          type: "bar",
          x: periods,
          y: barData,
          name: METRIC_LABELS[metric] || metric,
          marker: {
            color: barColors,
            line: { color: "rgba(255,255,255,0.3)", width: 0.5 },
            opacity: 0.85
          },
          text: textAnnotations,
          textposition: "outside",
          textfont: { color: theme.textPrimary, size: 11 },
          customdata: barData.map((value) => formatMetricValue(value, metric)),
          hovertemplate: "%{customdata}<extra></extra>"
        };
        chartData2 = [mainTrace, ...overlayTraces];
        chartLayout2 = {
          title: {
            text: getSimpleChartTitle(),
            font: { size: 16, color: "#374151" }
          },
          xaxis: {
            type: "category",
            // Treat as categorical to avoid timezone date parsing issues
            title: {
              text: dataFrequency.replace("ly", ""),
              font: { size: 14, color: "#374151" }
            },
            tickfont: { color: "#6b7280" },
            linecolor: "#e5e7eb",
            showgrid: false,
            showspikes: false,
            // Show all ticks if total number of ticks is <= 12
            tickmode: forecastExtendedPeriods.length <= 12 ? "array" : "auto",
            tickvals: forecastExtendedPeriods.length <= 12 ? forecastExtendedPeriods : void 0,
            ticktext: formatXAxisTicks(forecastExtendedPeriods)
          },
          yaxis: {
            title: {
              text: isLiveMode ? METRIC_LABELS[metric] || metric : overallChartType === "line" ? "Basis Points" : "USD",
              font: { size: 14, color: "#374151" }
            },
            tickfont: { color: "#6b7280" },
            zerolinecolor: "#e5e7eb",
            showgrid: false,
            side: "left",
            showspikes: false,
            range: barData.length > 0 ? (() => {
              const maxValue = Math.max(...barData, forecastUpperMax);
              const minValue = Math.min(...barData);
              if (minValue < 0) {
                return [minValue * 1.3, maxValue * 1.3];
              } else if (maxValue > 0) {
                return [0, maxValue * 1.3];
              }
              return void 0;
            })() : void 0
          },
          // Vertical separator at forecast boundary
          shapes: activeForecastOverlays.length > 0 ? [{
            type: "line",
            x0: periods[periods.length - 1],
            x1: periods[periods.length - 1],
            y0: 0,
            y1: 1,
            yref: "paper",
            line: { color: "#9ca3af", width: 1.5, dash: "dot" }
          }] : [],
          yaxis2: activeChangeOverlays.length > 0 ? {
            title: {
              text: activeChangeOverlays.map((o) => o.label).join(" / ") + " Change (%)",
              font: { size: 14, color: activeChangeOverlays.length === 1 ? activeChangeOverlays[0].color : "#6b7280" }
            },
            tickfont: { color: activeChangeOverlays.length === 1 ? activeChangeOverlays[0].color : "#6b7280" },
            showgrid: false,
            side: "right",
            overlaying: "y",
            zeroline: true,
            zerolinewidth: 2,
            zerolinecolor: "#d1d5db",
            showspikes: false
          } : { visible: false, overlaying: "y" },
          hovermode: "x unified"
        };
      } else {
        const config = VIEW_CONFIG[view];
        if (config) {
          const result = prepareChartDataByAttribute(config.column, config.label);
          chartData2 = result.chartData;
          chartLayout2 = result.chartLayout;
        }
      }
      if (activeScenarios.scenario1 && scenario1) {
        const scenario1Traces = calculateScenarioChartData(
          scenario1,
          1,
          scenarioLabels.scenario1
        );
        chartData2 = [...chartData2, ...scenario1Traces];
      }
      if (activeScenarios.scenario2 && scenario2) {
        const scenario2Traces = calculateScenarioChartData(
          scenario2,
          2,
          scenarioLabels.scenario2
        );
        chartData2 = [...chartData2, ...scenario2Traces];
      }
      if (activeScenarios.scenario3 && scenario3) {
        const scenario3Traces = calculateScenarioChartData(
          scenario3,
          3,
          scenarioLabels.scenario3
        );
        chartData2 = [...chartData2, ...scenario3Traces];
      }
      const modernLayout = {
        ...chartLayout2,
        font: {
          family: "'Inter', 'Segoe UI', sans-serif",
          size: 12,
          color: theme.textPrimary
        },
        legend: {
          bgcolor: "transparent",
          bordercolor: "transparent",
          borderwidth: 0,
          font: { color: theme.textSecondary, size: 11 },
          orientation: "h",
          y: -0.25
        },
        plot_bgcolor: theme.chartPlotBg,
        paper_bgcolor: theme.chartBg,
        hoverlabel: {
          font: {
            size: 11,
            family: "'Inter', 'Segoe UI', sans-serif",
            color: theme.textPrimary
          },
          bgcolor: isDarkMode ? "rgba(45, 55, 72, 0.95)" : "rgba(255, 255, 255, 0.95)",
          bordercolor: theme.borderPrimary
        },
        xaxis: {
          ...chartLayout2.xaxis,
          color: theme.textPrimary,
          gridcolor: isDarkMode ? "rgba(75, 85, 99, 0.4)" : "rgba(229, 231, 235, 0.5)",
          title: chartLayout2.xaxis && chartLayout2.xaxis.title ? {
            ...chartLayout2.xaxis.title,
            font: {
              color: theme.textPrimary,
              size: 12
            }
          } : void 0
        },
        yaxis: {
          ...chartLayout2.yaxis,
          color: theme.textPrimary,
          gridcolor: isDarkMode ? "rgba(75, 85, 99, 0.4)" : "rgba(229, 231, 235, 0.5)",
          title: chartLayout2.yaxis && chartLayout2.yaxis.title ? {
            ...chartLayout2.yaxis.title,
            font: {
              color: theme.textPrimary,
              size: 12
            }
          } : void 0
        },
        title: chartLayout2.title ? {
          ...chartLayout2.title,
          font: {
            color: theme.textPrimary,
            size: 14,
            family: "'Inter', 'Segoe UI', sans-serif"
          }
        } : void 0,
        annotations: chartLayout2.annotations ? chartLayout2.annotations.map((ann) => ({
          ...ann,
          font: {
            ...ann.font,
            color: theme.textPrimary,
            size: 11
          }
        })) : void 0,
        height: 500,
        margin: { l: 80, r: 80, t: 60, b: 140 }
      };
      return { chartData: chartData2, chartLayout: modernLayout };
    }, [
      view,
      metric,
      periods,
      dateField,
      dataFrequency,
      topX,
      selectedCategories,
      categorySelectionMode,
      calculateMetric,
      formatMetric,
      prepareChartDataByAttribute,
      getSimpleChartTitle,
      formatPeriodDate2,
      activeScenarios,
      scenario1,
      scenario2,
      scenario3,
      scenarioLabels,
      calculateScenarioChartData,
      capYoYForDisplay2,
      formatYoYValue2,
      isDarkMode,
      theme,
      periodAggregates,
      activeOverlays,
      smaWindow,
      forecastHorizon,
      sortedBaseDataPeriods,
      baseDataAggregatesByPeriod,
      formatMetricValue,
      METRIC_LABELS
    ]);
    const highlightedChartData = React.useMemo(() => {
      if (!hoveredInsight) return chartData;
      const highlightPeriods = getHighlightPeriods(hoveredInsight);
      if (highlightPeriods.length === 0) return chartData;
      return applyHighlightingToChartData(chartData, highlightPeriods);
    }, [
      chartData,
      hoveredInsight,
      getHighlightPeriods,
      applyHighlightingToChartData
    ]);
    const finalChartData = React.useMemo(() => {
      if (Object.keys(traceVisibility).length === 0) return highlightedChartData;
      return highlightedChartData.map((trace) => {
        const traceName = trace.name;
        if (traceName in traceVisibility) {
          return {
            ...trace,
            visible: traceVisibility[traceName] ? true : "legendonly"
          };
        }
        return trace;
      });
    }, [highlightedChartData, traceVisibility]);
    const handleLegendClick = React.useCallback((event) => {
      if (event && event.curveNumber !== void 0 && event.data) {
        const clickedTrace = event.data[event.curveNumber];
        if (!clickedTrace || !clickedTrace.name) {
          return true;
        }
        const newVisibility = {};
        event.data.forEach((trace) => {
          if (trace.name) {
            if (trace.name === clickedTrace.name) {
              const currentVisibility = trace.visible === false || trace.visible === "legendonly" ? false : true;
              newVisibility[trace.name] = !currentVisibility;
            } else {
              newVisibility[trace.name] = trace.visible === false || trace.visible === "legendonly" ? false : true;
            }
          }
        });
        setTraceVisibility(newVisibility);
        return false;
      }
      return true;
    }, []);
    const getAvailableCategoriesForView = React.useCallback(() => {
      if (view === "Overall") return [];
      const config = VIEW_CONFIG[view];
      if (!config) return [];
      const column = config.column;
      if (!column) return [];
      const dimTotals = dimensionCategoryTotals[column];
      if (dimTotals) {
        return Object.keys(dimTotals).filter((val) => val && val !== "Unknown").sort();
      }
      return [];
    }, [view, dimensionCategoryTotals, VIEW_CONFIG]);
    const filteredCategories = React.useMemo(() => {
      const allCategories = getAvailableCategoriesForView();
      if (!categorySearchText || categorySearchText.trim().length === 0) {
        return allCategories;
      }
      const searchTerm = categorySearchText.toLowerCase().trim();
      return allCategories.filter(
        (category) => formatFilterName2(category).toLowerCase().includes(searchTerm) || category.toLowerCase().includes(searchTerm)
      );
    }, [getAvailableCategoriesForView, categorySearchText, formatFilterName2]);
    const currentFilterSuggestions = React.useMemo(() => {
      if (!debouncedFilterSearchText || debouncedFilterSearchText.trim().length === 0) {
        return allFilterSuggestions;
      }
      const searchTerm = debouncedFilterSearchText.toLowerCase().trim();
      const filtered = {};
      Object.keys(allFilterSuggestions).forEach((type) => {
        const matchingOptions = allFilterSuggestions[type].filter((option) => {
          return option.displayName.toLowerCase().includes(searchTerm) || option.searchText.includes(searchTerm) || type.toLowerCase().includes(searchTerm);
        });
        if (matchingOptions.length > 0) {
          filtered[type] = matchingOptions;
        }
      });
      return filtered;
    }, [debouncedFilterSearchText, allFilterSuggestions]);
    const parseQuery = React.useCallback(
      (query) => {
        const metricPatterns = {
          [METRIC_LABELS.metric2 || "metric2"]: "metric2",
          [METRIC_LABELS.metric1 || "metric1"]: "metric1",
          [METRIC_LABELS.metric3 || "metric3"]: "metric3"
        };
        let parsed = {
          category: null,
          categoryValue: null,
          // The actual value to filter on
          filters: [],
          metric: null,
          action: null,
          // "growth" or "share"
          isValid: false
        };
        let queryText2 = query.trim();
        if (queryText2.toLowerCase().startsWith("what is")) {
          queryText2 = queryText2.substring(7).trim();
        }
        for (const [metricName, metricValue] of Object.entries(metricPatterns)) {
          if (queryText2.toLowerCase().includes(metricName.toLowerCase())) {
            parsed.metric = metricValue;
            queryText2 = queryText2.replace(new RegExp(metricName, "gi"), "").trim();
            break;
          }
        }
        if (queryText2.toLowerCase().includes("growth")) {
          parsed.action = "growth";
          queryText2 = queryText2.replace(/growth/gi, "").trim();
        } else if (queryText2.toLowerCase().includes("share")) {
          parsed.action = "share";
          queryText2 = queryText2.replace(/share/gi, "").trim();
        } else if (queryText2.toLowerCase().includes("amount") || queryText2.toLowerCase().includes("bps")) {
          parsed.action = "growth";
          queryText2 = queryText2.replace(/\b(amount|bps)\b/gi, "").trim();
        }
        const categoryMatch = queryText2.match(/^(.+?)(?:\'s)/i);
        if (categoryMatch) {
          parsed.category = categoryMatch[1].trim();
        }
        const withinMatch = query.match(/within\s+(.+?)$/i);
        if (withinMatch) {
          let filterText = withinMatch[1].trim();
          filterText = filterText.replace(/^all\s+/i, "");
          parsed.filters = filterText.split(/[\/,\s]+and\s+|[\/,]+|\s+and\s+/i).map((f) => f.trim()).filter((f) => f && f.toLowerCase() !== "all");
        }
        if (parsed.category) {
          FILTER_CONFIG_STATIC.forEach(({ key }) => {
            const optionsArray = getFilterOptions(key);
            if (optionsArray) {
              const found = optionsArray.find(
                (opt) => formatFilterName2(opt).toLowerCase() === parsed.category.toLowerCase() || String(opt).toLowerCase() === parsed.category.toLowerCase()
              );
              if (found) {
                parsed.categoryValue = found;
              }
            }
          });
        }
        parsed.isValid = !!parsed.category && !!parsed.metric;
        return parsed;
      },
      [formatFilterName2, FILTER_CONFIG, getFilterOptions]
    );
    const getCategoriesForView = React.useCallback(
      (config) => {
        return Array.from(
          new Set(
            baseFilteredData.map((row) => row[config.column]).filter((val) => val && val !== "Unknown")
          )
        );
      },
      [baseFilteredData]
    );
    const setViewAndCategory = React.useCallback((viewName, categoryValue) => {
      setView(viewName);
      setTopX(0);
      setTimeout(() => {
        setSelectedCategories([categoryValue]);
      }, 0);
    }, []);
    const matchFiltersToOptions = React.useCallback(
      (filterNames, optionsArray) => {
        return filterNames.map((filterName) => {
          return optionsArray.find((opt) => {
            if (typeof opt === "boolean" || typeof filterName === "boolean") {
              return opt === filterName;
            }
            const optStr = String(opt);
            const filterStr = String(filterName);
            return formatFilterName2(optStr).toLowerCase() === filterStr.toLowerCase() || optStr.toLowerCase() === filterStr.toLowerCase();
          });
        }).filter((opt) => opt !== void 0 && opt !== null);
      },
      [formatFilterName2]
    );
    const applyLLMResponse = React.useCallback(
      (response) => {
        isExecutingQueryRef.current = true;
        const validMetricKeys = ["metric1", "metric2", "metric3"];
        if (response.metric) {
          if (validMetricKeys.includes(response.metric)) {
            setMetric(response.metric);
          } else {
            const labelToKey = Object.entries(METRIC_LABELS).find(
              ([, label]) => label && label.toLowerCase() === response.metric.toLowerCase()
            );
            if (labelToKey && validMetricKeys.includes(labelToKey[0])) {
              setMetric(labelToKey[0]);
            }
          }
        }
        const validFreqs = isLiveMode ? ["Daily", "Weekly", "Monthly", "Quarterly", "Yearly"] : ["Weekly", "Monthly", "Quarterly", "Yearly"];
        if (response.dataFrequency && validFreqs.includes(response.dataFrequency)) {
          setDataFrequency(response.dataFrequency);
        }
        const validRanges = DATE_RANGES;
        if (response.dateRange && validRanges.includes(response.dateRange)) {
          setDateRange(response.dateRange);
        }
        if (response.filters && typeof response.filters === "object") {
          FILTER_CONFIG.forEach(({ setState }) => setState([]));
          Object.entries(response.filters).forEach(([key, values]) => {
            const setter = getFilterSetState(key);
            const opts = getFilterOptions(key);
            if (setter && Array.isArray(values) && opts.length > 1) {
              const validValues = values.filter((v) => opts.includes(v));
              if (validValues.length > 0) {
                setter(validValues);
              }
            }
          });
        }
        const validViews = ["Overall", ...Object.keys(VIEW_CONFIG)];
        if (response.view && validViews.includes(response.view)) {
          setView(response.view);
          if (response.view !== "Overall" && Array.isArray(response.selectedCategories) && response.selectedCategories.length > 0) {
            const config = VIEW_CONFIG[response.view];
            if (config) {
              const categories = getCategoriesForView(config);
              const validCats = response.selectedCategories.filter((c) => categories.includes(c));
              if (validCats.length > 0) {
                setTopX(0);
                setCategorySelectionMode("manual");
                setTimeout(() => setSelectedCategories(validCats), 50);
              }
            }
          } else {
            setSelectedCategories([]);
          }
        }
        setInsightContext(null);
        setTimeout(() => {
          isExecutingQueryRef.current = false;
        }, 200);
      },
      [FILTER_CONFIG, getFilterSetState, getFilterOptions, VIEW_CONFIG, getCategoriesForView, METRIC_LABELS]
    );
    const handleLLMQuery = React.useCallback(
      async (query) => {
        if (!query || !query.trim()) return;
        setIsLLMLoading(true);
        setLlmError("");
        setLlmExplanation("");
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3e4);
        try {
          const schema = buildLLMSchema();
          const res = await fetch(LLM_WORKER_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: query, schema }),
            signal: controller.signal
          });
          clearTimeout(timeoutId);
          if (!res.ok) {
            const errData = await res.json().catch(() => ({}));
            throw new Error(errData.error || `Request failed (${res.status})`);
          }
          const data = await res.json();
          if (data.explanation) {
            setLlmExplanation(data.explanation);
          }
          applyLLMResponse(data);
          lastExecutedQueryRef.current = query;
        } catch (err) {
          clearTimeout(timeoutId);
          if (err.name === "AbortError") {
            setLlmError("Request timed out. Please try again.");
          } else {
            setLlmError(err.message || "Something went wrong.");
          }
        } finally {
          setIsLLMLoading(false);
        }
      },
      [buildLLMSchema, applyLLMResponse, LLM_WORKER_URL]
    );
    const LLM_EXAMPLE_QUESTIONS = React.useMemo(() => {
      if (isLiveMode && liveMetricConfig) {
        const mLabels = [METRIC_LABELS.metric1, METRIC_LABELS.metric2, METRIC_LABELS.metric3].filter(Boolean);
        const dimLabels = DIMENSION_DEFINITIONS.map((d) => d.viewName || d.filterLabel);
        const sampleCats = [];
        DIMENSION_DEFINITIONS.forEach((d) => {
          const col = COLUMNS[d.columnKey];
          const totals = dimensionCategoryTotals && dimensionCategoryTotals[col] || {};
          const cats = Object.keys(totals).filter((c) => c && c !== "Unknown" && c !== "Rest Combined" && c.length < 30);
          if (cats.length > 0) sampleCats.push(...cats.slice(0, 3));
        });
        const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
        const grains = ["daily", "weekly", "monthly", "quarterly"];
        const questions = [];
        mLabels.forEach((m) => {
          if (dimLabels.length > 0) {
            questions.push(`How is ${m} trending by ${pick(dimLabels)}?`);
            questions.push(`Show me ${m} by ${pick(dimLabels)}, ${pick(grains)}`);
            questions.push(`Compare ${m} across ${pick(dimLabels)}`);
          }
          questions.push(`What does ${m} look like over the last year?`);
        });
        if (sampleCats.length > 0) {
          questions.push(`How is ${pick(sampleCats)} performing?`);
          if (sampleCats.length > 1) questions.push(`Compare ${sampleCats[0]} vs ${sampleCats[1]}`);
        }
        if (dimLabels.length > 0 && mLabels.length > 0) {
          questions.push(`Break down ${pick(mLabels)} by ${pick(dimLabels)}`);
          questions.push(`Show ${pick(grains)} ${pick(mLabels)} trends`);
        }
        return questions.length > 0 ? questions : ["Show me the data trends", "Break down by category, monthly"];
      }
      return [
        "How is revenue trending in EMEA?",
        "Show me volume by product, monthly",
        "What does margin rate look like by region over 3 years?",
        "Compare revenue across channels quarterly",
        "How is Enterprise Suite performing?",
        "Break down revenue by country",
        "Show weekly volume for Core Products",
        "What's the revenue split by pricing type?",
        "How does revenue break down by customer segment?",
        "Show me quarterly margin rate trends"
      ];
    }, [isLiveMode, liveMetricConfig, METRIC_LABELS, DIMENSION_DEFINITIONS, COLUMNS, dimensionCategoryTotals]);
    React.useEffect(() => {
      if (isRestoringRef.current) return;
      if (isExecutingQueryRef.current) return;
      setQueryText("");
      lastExecutedQueryRef.current = "";
    }, [
      metric,
      view,
      productNameFilter,
      companySegmentFilter,
      revenueRegionFilter,
      acquisitionChannelFilter,
      pricingTypeFilter,
      isAiCompanyFilter,
      channelFilter,
      productGroupFilter,
      productSubFilter,
      dateRange
    ]);
    const renderButtonGroup = React.useCallback(
      (options, value, onChange, groupStyle, buttonStyle, activeButtonStyle) => {
        return /* @__PURE__ */ React.createElement("div", { style: groupStyle }, options.map((option) => /* @__PURE__ */ React.createElement(
          "button",
          {
            key: option,
            style: {
              ...buttonStyle,
              ...value === option ? activeButtonStyle : {}
            },
            onClick: () => onChange(option)
          },
          option
        )));
      },
      []
    );
    const getNextEmptyScenario = React.useCallback(() => {
      if (!scenario1)
        return { index: 1, color: "#ef4444", label: scenarioLabels.scenario1 };
      if (!scenario2)
        return { index: 2, color: "#10b981", label: scenarioLabels.scenario2 };
      if (!scenario3)
        return { index: 3, color: "#8b5cf6", label: scenarioLabels.scenario3 };
      return null;
    }, [scenario1, scenario2, scenario3, scenarioLabels]);
    const getSavedScenarios = React.useCallback(() => {
      const saved = [];
      if (scenario1) {
        saved.push({
          index: 1,
          color: "#ef4444",
          scenario: scenario1,
          isActive: activeScenarios.scenario1,
          label: scenarioLabels.scenario1
        });
      }
      if (scenario2) {
        saved.push({
          index: 2,
          color: "#10b981",
          scenario: scenario2,
          isActive: activeScenarios.scenario2,
          label: scenarioLabels.scenario2
        });
      }
      if (scenario3) {
        saved.push({
          index: 3,
          color: "#8b5cf6",
          scenario: scenario3,
          isActive: activeScenarios.scenario3,
          label: scenarioLabels.scenario3
        });
      }
      return saved;
    }, [scenario1, scenario2, scenario3, activeScenarios, scenarioLabels]);
    return /* @__PURE__ */ React.createElement("div", { style: styles.container }, /* @__PURE__ */ React.createElement("style", null, `
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `), baseConnection && tabs.length > 0 && /* @__PURE__ */ React.createElement("div", { style: {
      display: "flex",
      alignItems: "center",
      gap: "0",
      marginBottom: "12px",
      borderBottom: `2px solid ${isDarkMode ? "#374151" : "#e5e7eb"}`
    } }, tabs.map((tab) => {
      const isActive = tab.id === activeTabId;
      const isRenaming = renamingTabId === tab.id;
      return /* @__PURE__ */ React.createElement(
        "div",
        {
          key: tab.id,
          style: {
            display: "flex",
            alignItems: "center",
            gap: "4px",
            padding: "8px 16px",
            fontSize: "13px",
            fontWeight: isActive ? 600 : 400,
            cursor: "pointer",
            userSelect: "none",
            position: "relative",
            color: isActive ? isDarkMode ? "#f3f4f6" : "#111827" : isDarkMode ? "#9ca3af" : "#6b7280",
            backgroundColor: isActive ? isDarkMode ? "rgba(99,102,241,0.1)" : "rgba(99,102,241,0.05)" : "transparent",
            borderBottom: isActive ? `2px solid ${isDarkMode ? "#818cf8" : "#6366f1"}` : "2px solid transparent",
            marginBottom: "-2px",
            borderRadius: "6px 6px 0 0",
            transition: "all 0.15s ease"
          },
          onClick: () => {
            if (!isRenaming) switchTab(tab.id);
          },
          onDoubleClick: () => {
            if (isCreatorMode || !configId) {
              setRenamingTabId(tab.id);
              setRenameText(tab.name);
            }
          }
        },
        isActive && /* @__PURE__ */ React.createElement("span", { style: {
          width: "6px",
          height: "6px",
          borderRadius: "50%",
          backgroundColor: liveDataLoading ? "#818cf8" : liveDataError ? "#ef4444" : "#10b981",
          display: "inline-block",
          flexShrink: 0
        } }),
        isRenaming ? /* @__PURE__ */ React.createElement(
          "input",
          {
            autoFocus: true,
            value: renameText,
            onChange: (e) => setRenameText(e.target.value),
            onBlur: () => {
              if (renameText.trim()) renameTab(tab.id, renameText.trim());
              setRenamingTabId(null);
            },
            onKeyDown: (e) => {
              if (e.key === "Enter") {
                if (renameText.trim()) renameTab(tab.id, renameText.trim());
                setRenamingTabId(null);
              }
              if (e.key === "Escape") setRenamingTabId(null);
            },
            onClick: (e) => e.stopPropagation(),
            style: {
              background: "transparent",
              border: "none",
              borderBottom: `1px solid ${isDarkMode ? "#818cf8" : "#6366f1"}`,
              color: "inherit",
              fontSize: "13px",
              fontWeight: 600,
              padding: "0 2px",
              width: Math.max(60, renameText.length * 8) + "px",
              outline: "none"
            }
          }
        ) : /* @__PURE__ */ React.createElement("span", null, tab.name),
        isActive && liveRowCount > 0 && !liveDataLoading && /* @__PURE__ */ React.createElement("span", { style: { fontSize: "11px", color: isDarkMode ? "#6b7280" : "#9ca3af", marginLeft: "4px" } }, "(", liveRowCount.toLocaleString(), liveDataTruncated ? "!" : "", ")"),
        tabs.length > 1 && (isCreatorMode || !configId) && /* @__PURE__ */ React.createElement(
          "button",
          {
            onClick: (e) => {
              e.stopPropagation();
              removeTab(tab.id);
            },
            style: {
              background: "none",
              border: "none",
              color: isDarkMode ? "#6b7280" : "#9ca3af",
              cursor: "pointer",
              fontSize: "14px",
              lineHeight: 1,
              padding: "0 2px",
              marginLeft: "4px",
              opacity: 0.6,
              display: "flex",
              alignItems: "center"
            },
            onMouseEnter: (e) => e.target.style.opacity = 1,
            onMouseLeave: (e) => e.target.style.opacity = 0.6
          },
          "\xD7"
        )
      );
    }), (isCreatorMode || !configId) && /* @__PURE__ */ React.createElement("div", { style: { position: "relative" }, "data-add-tab": true }, /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: () => setShowAddTab(!showAddTab),
        style: {
          background: "none",
          border: "none",
          color: isDarkMode ? "#6b7280" : "#9ca3af",
          cursor: "pointer",
          fontSize: "18px",
          lineHeight: 1,
          padding: "6px 12px",
          display: "flex",
          alignItems: "center"
        },
        title: "Add dataset tab"
      },
      "+"
    ), showAddTab && /* @__PURE__ */ React.createElement("div", { style: {
      position: "absolute",
      top: "100%",
      left: 0,
      zIndex: 100,
      backgroundColor: isDarkMode ? "#1f2937" : "#ffffff",
      border: `1px solid ${isDarkMode ? "#374151" : "#e5e7eb"}`,
      borderRadius: "8px",
      padding: "12px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
      minWidth: "200px"
    } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: "12px", fontWeight: 600, marginBottom: "8px", color: isDarkMode ? "#d1d5db" : "#374151" } }, "New Tab"), /* @__PURE__ */ React.createElement(
      "input",
      {
        autoFocus: true,
        placeholder: "Tab name",
        value: newTabDataset,
        onChange: (e) => setNewTabDataset(e.target.value),
        onKeyDown: (e) => {
          if (e.key === "Enter" && newTabDataset.trim()) {
            addTab(newTabDataset.trim());
            setNewTabDataset("");
            setShowAddTab(false);
          }
          if (e.key === "Escape") {
            setShowAddTab(false);
            setNewTabDataset("");
          }
        },
        style: {
          width: "100%",
          padding: "6px 10px",
          borderRadius: "6px",
          fontSize: "13px",
          border: `1px solid ${isDarkMode ? "#4b5563" : "#d1d5db"}`,
          backgroundColor: isDarkMode ? "#111827" : "#f9fafb",
          color: isDarkMode ? "#f3f4f6" : "#111827",
          outline: "none",
          boxSizing: "border-box"
        }
      }
    ), /* @__PURE__ */ React.createElement("div", { style: { fontSize: "11px", color: isDarkMode ? "#6b7280" : "#9ca3af", marginTop: "6px" } }, "Name your tab, then set dataset in Configure Metrics"))), (isCreatorMode || !configId) && /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: () => {
          setMetricsEditorDraft({ ...liveMetricConfig || {}, dataset: activeTab?.dataset || "" });
          setMetricsEditorError("");
          setExpandedMetricSlot(null);
          setShowMetricsEditor(true);
        },
        style: {
          marginLeft: "auto",
          padding: "4px 12px",
          borderRadius: "6px",
          border: `1px solid ${isDarkMode ? "rgba(16,185,129,0.4)" : "rgba(16,185,129,0.5)"}`,
          background: "transparent",
          color: isDarkMode ? "#6ee7b7" : "#065f46",
          cursor: "pointer",
          fontSize: "11px",
          fontWeight: 500,
          whiteSpace: "nowrap"
        }
      },
      "Configure Metrics"
    ), configId && /* @__PURE__ */ React.createElement("div", { style: { marginLeft: isCreatorMode ? "0" : "auto", position: "relative" } }, /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: () => {
          if (isCreatorMode) {
            setIsCreatorMode(false);
            if (creatorTimerRef.current) clearTimeout(creatorTimerRef.current);
          } else if (getEditSecret(configId)) {
            setIsCreatorMode(true);
          } else {
            setShowUnlockPrompt(!showUnlockPrompt);
            setUnlockError("");
            setUnlockSecret("");
          }
        },
        title: isCreatorMode ? "Lock editing (auto-locks after 2 min)" : "Unlock editing",
        style: {
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: "4px 8px",
          color: isCreatorMode ? isDarkMode ? "#6ee7b7" : "#065f46" : isDarkMode ? "#6b7280" : "#9ca3af",
          fontSize: "14px",
          display: "flex",
          alignItems: "center"
        }
      },
      isCreatorMode ? "\u{1F513}" : "\u{1F512}"
    ), showUnlockPrompt && !isCreatorMode && /* @__PURE__ */ React.createElement("div", { style: {
      position: "absolute",
      top: "100%",
      right: 0,
      zIndex: 100,
      backgroundColor: isDarkMode ? "#1f2937" : "#ffffff",
      border: `1px solid ${isDarkMode ? "#374151" : "#e5e7eb"}`,
      borderRadius: "8px",
      padding: "12px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
      minWidth: "240px"
    } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: "12px", fontWeight: 600, marginBottom: "8px", color: isDarkMode ? "#d1d5db" : "#374151" } }, "Enter Edit Key"), /* @__PURE__ */ React.createElement(
      "input",
      {
        autoFocus: true,
        type: "password",
        placeholder: "Paste edit key...",
        value: unlockSecret,
        onChange: (e) => setUnlockSecret(e.target.value),
        onKeyDown: (e) => {
          if (e.key === "Escape") setShowUnlockPrompt(false);
          if (e.key === "Enter" && unlockSecret.trim()) {
            updateConfig(configId, unlockSecret.trim(), {}).then((ok) => {
              if (ok) {
                setEditSecret(configId, unlockSecret.trim());
                setIsCreatorMode(true);
                setShowUnlockPrompt(false);
              } else {
                setUnlockError("Invalid key");
              }
            }).catch(() => setUnlockError("Failed to verify"));
          }
        },
        style: {
          width: "100%",
          padding: "6px 10px",
          borderRadius: "6px",
          fontSize: "13px",
          boxSizing: "border-box",
          border: `1px solid ${isDarkMode ? "#4b5563" : "#d1d5db"}`,
          backgroundColor: isDarkMode ? "#111827" : "#f9fafb",
          color: isDarkMode ? "#f3f4f6" : "#111827",
          outline: "none"
        }
      }
    ), unlockError && /* @__PURE__ */ React.createElement("div", { style: { fontSize: "11px", color: "#ef4444", marginTop: "4px" } }, unlockError), /* @__PURE__ */ React.createElement("div", { style: { fontSize: "11px", color: isDarkMode ? "#6b7280" : "#9ca3af", marginTop: "6px" } }, "Press Enter to unlock editing")))), baseConnection && activeTab && !activeTab.dataset && !liveDataLoading && /* @__PURE__ */ React.createElement("div", { style: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      padding: "8px 16px",
      backgroundColor: isDarkMode ? "rgba(245, 158, 11, 0.12)" : "rgba(245, 158, 11, 0.1)",
      border: `1px solid ${isDarkMode ? "rgba(245, 158, 11, 0.35)" : "rgba(245, 158, 11, 0.4)"}`,
      borderRadius: "8px",
      marginBottom: "12px",
      fontSize: "12px",
      color: isDarkMode ? "#fbbf24" : "#92400e"
    } }, /* @__PURE__ */ React.createElement("span", null, "No dataset configured. Click ", /* @__PURE__ */ React.createElement("strong", null, "Configure Metrics"), " to set the table name.")), configLoading && /* @__PURE__ */ React.createElement("div", { style: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      padding: "8px 16px",
      backgroundColor: isDarkMode ? "rgba(99, 102, 241, 0.12)" : "rgba(99, 102, 241, 0.1)",
      border: `1px solid ${isDarkMode ? "rgba(99, 102, 241, 0.35)" : "rgba(99, 102, 241, 0.4)"}`,
      borderRadius: "8px",
      marginBottom: "12px",
      fontSize: "12px",
      color: isDarkMode ? "#a5b4fc" : "#4338ca"
    } }, /* @__PURE__ */ React.createElement("div", { style: { width: "14px", height: "14px", border: "2px solid currentColor", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" } }), /* @__PURE__ */ React.createElement("span", null, "Loading dashboard configuration...")), configError && /* @__PURE__ */ React.createElement("div", { style: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      padding: "8px 16px",
      backgroundColor: isDarkMode ? "rgba(239, 68, 68, 0.12)" : "rgba(239, 68, 68, 0.1)",
      border: `1px solid ${isDarkMode ? "rgba(239, 68, 68, 0.35)" : "rgba(239, 68, 68, 0.4)"}`,
      borderRadius: "8px",
      marginBottom: "12px",
      fontSize: "12px",
      color: isDarkMode ? "#fca5a5" : "#dc2626"
    } }, /* @__PURE__ */ React.createElement("span", null, configError), /* @__PURE__ */ React.createElement("button", { onClick: () => window.location.reload(), style: {
      marginLeft: "auto",
      padding: "2px 10px",
      borderRadius: "4px",
      fontSize: "11px",
      cursor: "pointer",
      border: `1px solid ${isDarkMode ? "rgba(239, 68, 68, 0.4)" : "rgba(239, 68, 68, 0.5)"}`,
      background: "transparent",
      color: "inherit"
    } }, "Retry")), liveDataLoading && /* @__PURE__ */ React.createElement("div", { style: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      padding: "8px 16px",
      backgroundColor: isDarkMode ? "rgba(99, 102, 241, 0.12)" : "rgba(99, 102, 241, 0.1)",
      border: `1px solid ${isDarkMode ? "rgba(99, 102, 241, 0.35)" : "rgba(99, 102, 241, 0.4)"}`,
      borderRadius: "8px",
      marginBottom: "12px",
      fontSize: "12px",
      color: isDarkMode ? "#a5b4fc" : "#4338ca"
    } }, /* @__PURE__ */ React.createElement("div", { style: { width: "14px", height: "14px", border: "2px solid currentColor", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" } }), /* @__PURE__ */ React.createElement("span", null, "Connecting to ", /* @__PURE__ */ React.createElement("strong", null, connectionParams?.dataset), "...")), liveDataError && /* @__PURE__ */ React.createElement("div", { style: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      padding: "8px 16px",
      backgroundColor: isDarkMode ? "rgba(239, 68, 68, 0.12)" : "rgba(239, 68, 68, 0.1)",
      border: `1px solid ${isDarkMode ? "rgba(239, 68, 68, 0.35)" : "rgba(239, 68, 68, 0.4)"}`,
      borderRadius: "8px",
      marginBottom: "12px",
      fontSize: "12px",
      color: isDarkMode ? "#fca5a5" : "#dc2626"
    } }, /* @__PURE__ */ React.createElement("span", null, "Connection failed: ", liveDataError, ". Showing demo data instead.")), liveDataTruncated && !liveDataLoading && /* @__PURE__ */ React.createElement("div", { style: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      padding: "8px 16px",
      backgroundColor: isDarkMode ? "rgba(245, 158, 11, 0.12)" : "rgba(245, 158, 11, 0.1)",
      border: `1px solid ${isDarkMode ? "rgba(245, 158, 11, 0.35)" : "rgba(245, 158, 11, 0.4)"}`,
      borderRadius: "8px",
      marginBottom: "12px",
      fontSize: "12px",
      color: isDarkMode ? "#fbbf24" : "#92400e"
    } }, /* @__PURE__ */ React.createElement("span", null, "Data truncated \u2014 results hit the row limit. Metrics may be incomplete.")), !isLiveMode && !liveDataLoading && !liveDataError && /* @__PURE__ */ React.createElement("div", { style: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      padding: "8px 16px",
      backgroundColor: isDarkMode ? "rgba(234, 179, 8, 0.12)" : "rgba(234, 179, 8, 0.1)",
      border: `1px solid ${isDarkMode ? "rgba(234, 179, 8, 0.35)" : "rgba(234, 179, 8, 0.4)"}`,
      borderRadius: "8px",
      marginBottom: "12px",
      fontSize: "12px",
      color: isDarkMode ? "#fcd34d" : "#92400e"
    } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: "14px" } }, "\u26A0\uFE0F"), /* @__PURE__ */ React.createElement("span", null, /* @__PURE__ */ React.createElement("strong", null, "Demo only:"), " Viewing synthetic data."), /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: () => setShowConnectModal(true),
        style: {
          marginLeft: "auto",
          padding: "4px 12px",
          borderRadius: "4px",
          fontSize: "11px",
          cursor: "pointer",
          border: `1px solid ${isDarkMode ? "rgba(99, 102, 241, 0.5)" : "rgba(99, 102, 241, 0.5)"}`,
          background: isDarkMode ? "rgba(99, 102, 241, 0.2)" : "rgba(99, 102, 241, 0.1)",
          color: isDarkMode ? "#a5b4fc" : "#4338ca",
          fontWeight: 600,
          whiteSpace: "nowrap"
        }
      },
      "Connect to Database"
    )), /* @__PURE__ */ React.createElement("div", { style: styles.topSection }, /* @__PURE__ */ React.createElement("div", { style: styles.queryContainer, "data-guide": "quick-query" }, /* @__PURE__ */ React.createElement("div", { style: styles.queryInputGroup }, /* @__PURE__ */ React.createElement("div", { style: styles.queryLabelContainer }, /* @__PURE__ */ React.createElement("label", { style: styles.queryLabel }, "Quick Query"), /* @__PURE__ */ React.createElement(
      "div",
      {
        style: styles.queryTooltipIcon,
        onMouseEnter: () => setShowQueryTooltip(true),
        onMouseLeave: () => setShowQueryTooltip(false)
      },
      /* @__PURE__ */ React.createElement(
        "svg",
        {
          width: "14",
          height: "14",
          viewBox: "0 0 20 20",
          fill: "none",
          xmlns: "http://www.w3.org/2000/svg",
          style: styles.block
        },
        /* @__PURE__ */ React.createElement(
          "circle",
          {
            cx: "10",
            cy: "10",
            r: "9",
            stroke: "currentColor",
            strokeWidth: "1.5",
            fill: "none"
          }
        ),
        /* @__PURE__ */ React.createElement(
          "path",
          {
            d: "M10 6v.01",
            stroke: "currentColor",
            strokeWidth: "1.5",
            strokeLinecap: "round"
          }
        ),
        /* @__PURE__ */ React.createElement(
          "path",
          {
            d: "M10 9v5",
            stroke: "currentColor",
            strokeWidth: "1.5",
            strokeLinecap: "round"
          }
        )
      ),
      showQueryTooltip && /* @__PURE__ */ React.createElement("div", { style: styles.queryTooltip }, /* @__PURE__ */ React.createElement("div", { style: styles.queryTooltipArrow }), /* @__PURE__ */ React.createElement("div", { style: styles.fontWeight600 }, "How to Use"), /* @__PURE__ */ React.createElement("div", { style: styles.textGray }, isLiveMode && METRIC_LABELS ? `Type a natural language question like "How is ${METRIC_LABELS.metric1 || "the metric"} trending${DIMENSION_DEFINITIONS.length > 0 ? ` by ${DIMENSION_DEFINITIONS[0].viewName}` : ""}?" or click "Feeling Lucky" for examples.` : 'Type a natural language question like "How is revenue trending in EMEA?" or click "Feeling Lucky" for examples. Press Enter or click "Ask" to query.'))
    )), /* @__PURE__ */ React.createElement("div", { style: styles.queryInputWrapper }, /* @__PURE__ */ React.createElement(
      "input",
      {
        type: "text",
        value: queryText,
        onChange: (e) => setQueryText(e.target.value),
        onKeyDown: (e) => {
          if (e.key === "Enter" && queryText.trim() && !isLLMLoading) {
            handleLLMQuery(queryText);
          }
        },
        placeholder: isLiveMode && METRIC_LABELS ? `Ask a question... e.g. How is ${METRIC_LABELS.metric1 || "the metric"} trending${DIMENSION_DEFINITIONS.length > 0 ? ` by ${DIMENSION_DEFINITIONS[0].viewName}` : ""}?` : "Ask a question... e.g. How is revenue trending in EMEA?",
        disabled: isLLMLoading,
        style: {
          flex: 1,
          padding: "10px 14px",
          fontSize: "14px",
          fontFamily: "'Inter', 'Segoe UI', sans-serif",
          border: "2px solid #d1d5db",
          borderRadius: "8px",
          backgroundColor: isLLMLoading ? "#f3f4f6" : "#fff",
          minHeight: "44px",
          outline: "none",
          color: "#374151"
        },
        onFocus: (e) => {
          e.target.style.borderColor = "#6366f1";
        },
        onBlur: (e) => {
          e.target.style.borderColor = "#d1d5db";
        }
      }
    ), /* @__PURE__ */ React.createElement(
      "button",
      {
        style: {
          ...styles.luckyButton,
          fontSize: "14px",
          fontWeight: "600",
          padding: "10px 18px",
          minWidth: "160px",
          opacity: isLLMLoading ? 0.6 : 1
        },
        onClick: () => {
          const example = LLM_EXAMPLE_QUESTIONS[Math.floor(Math.random() * LLM_EXAMPLE_QUESTIONS.length)];
          setQueryText(example);
          setLlmError("");
          setLlmExplanation("");
        },
        disabled: isLLMLoading,
        title: "Generate a random example question"
      },
      "Feeling Lucky"
    ), /* @__PURE__ */ React.createElement(
      "button",
      {
        style: {
          ...styles.queryButton,
          ...!queryText.trim() || isLLMLoading ? styles.queryButtonDisabled : {}
        },
        onClick: () => {
          if (queryText.trim() && !isLLMLoading) {
            handleLLMQuery(queryText);
          }
        },
        disabled: !queryText.trim() || isLLMLoading
      },
      isLLMLoading ? "Thinking..." : "Ask"
    )), (isLLMLoading || llmError || llmExplanation) && /* @__PURE__ */ React.createElement("div", { style: { marginTop: "8px", fontSize: "13px", fontFamily: "'Inter', 'Segoe UI', sans-serif" } }, isLLMLoading && /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: "8px", color: "#6366f1" } }, /* @__PURE__ */ React.createElement("div", { style: {
      width: "14px",
      height: "14px",
      border: "2px solid #6366f1",
      borderTopColor: "transparent",
      borderRadius: "50%",
      animation: "spin 0.8s linear infinite"
    } }), "Interpreting your question..."), llmError && /* @__PURE__ */ React.createElement("div", { style: { color: "#dc2626", padding: "4px 0" } }, llmError), llmExplanation && !isLLMLoading && !llmError && /* @__PURE__ */ React.createElement("div", { style: { color: "#6b7280", fontStyle: "italic", padding: "4px 0" } }, llmExplanation))), /* @__PURE__ */ React.createElement(
      "button",
      {
        style: {
          ...styles.helpButton,
          right: showGuideButton ? "100px" : "12px",
          backgroundColor: isDarkMode ? "#4b5563" : theme.accentPrimary
        },
        onClick: () => setIsDarkMode(!isDarkMode),
        title: isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"
      },
      isDarkMode ? "\u2600\uFE0F" : "\u{1F319}"
    ), showGuideButton && /* @__PURE__ */ React.createElement(
      "button",
      {
        style: {
          ...styles.helpButton,
          backgroundColor: showGuide ? "#ef4444" : "#f77f00"
        },
        onClick: () => {
          if (showGuide) {
            skipGuide();
          } else {
            startGuide();
          }
        },
        title: showGuide ? "Stop Guide" : "Guide Me - Click to start tour"
      },
      showGuide ? "\u2715" : "Guide Me"
    )), /* @__PURE__ */ React.createElement("div", { style: styles.statBoxContainer, "data-guide": "metric-statboxes" }, (isLiveMode && liveMetricConfig && !liveMetricConfig.derivedAggType && liveMetricConfig.derivedMode !== "formula" ? ["metric1", "metric2"] : ["metric1", "metric2", "metric3"]).map((metricName) => {
      const metricStatData = allMetricsStatData[metricName];
      if (!metricStatData) return null;
      const displayLabel = METRIC_LABELS[metricName] || metricName;
      return /* @__PURE__ */ React.createElement(
        StatBox,
        {
          key: metricName,
          metricName,
          metricStatData,
          isActive: metric === metricName,
          accentColor: "#6366f1",
          dataFrequency,
          periodChangeLabel,
          displayLabel,
          activePeriodComparison,
          setActivePeriodComparison,
          setMetric,
          setInsightContext,
          formatMetricValue,
          styles,
          theme,
          isDarkMode
        }
      );
    })), /* @__PURE__ */ React.createElement("div", { style: styles.controlsContainer }, /* @__PURE__ */ React.createElement("div", { style: styles.controlsHeader }, /* @__PURE__ */ React.createElement(
      "div",
      {
        style: {
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: "20px",
          width: "100%"
        }
      },
      /* @__PURE__ */ React.createElement("div", { style: styles.controlGroup, "data-guide": "saved-views" }, /* @__PURE__ */ React.createElement("label", { style: styles.label }, "Load Saved View"), savedViews.length > 0 ? /* @__PURE__ */ React.createElement(
        "select",
        {
          style: styles.select,
          value: selectedSavedView,
          onChange: (e) => handleLoadSavedView(e.target.value),
          onClick: (e) => e.stopPropagation()
        },
        /* @__PURE__ */ React.createElement("option", { value: "" }, "-- Select a saved view --"),
        savedViews.map((savedView) => /* @__PURE__ */ React.createElement("option", { key: savedView.name, value: savedView.name }, savedView.name))
      ) : /* @__PURE__ */ React.createElement("select", { style: styles.select, disabled: true }, /* @__PURE__ */ React.createElement("option", null, "No saved views"))),
      /* @__PURE__ */ React.createElement("div", { style: styles.controlGroup, "data-guide": "view-selector" }, /* @__PURE__ */ React.createElement("label", { style: styles.label }, "Split By Dimension"), /* @__PURE__ */ React.createElement(
        "select",
        {
          style: styles.select,
          value: view,
          onChange: (e) => setView(e.target.value),
          onClick: (e) => e.stopPropagation()
        },
        /* @__PURE__ */ React.createElement("option", { value: "Overall" }, "Overall"),
        Object.keys(VIEW_CONFIG).map((viewName) => /* @__PURE__ */ React.createElement("option", { key: viewName, value: viewName }, VIEW_LABEL_OVERRIDES[viewName] || viewName))
      )),
      /* @__PURE__ */ React.createElement(
        "div",
        {
          style: { ...styles.controlGroup, marginTop: "24px" },
          "data-guide": "date-range"
        },
        renderButtonGroup(
          DATE_RANGES,
          dateRange,
          setDateRange,
          styles.dateRangeGroup,
          styles.dateRangeButton,
          styles.dateRangeButtonActive
        )
      ),
      /* @__PURE__ */ React.createElement("div", { style: styles.controlGroup }, /* @__PURE__ */ React.createElement("div", { style: styles.buttonGroup }, /* @__PURE__ */ React.createElement(
        "button",
        {
          style: {
            ...styles.buttonGroupBtn,
            ...false ? styles.buttonGroupBtnActive : {}
          },
          onClick: () => setShowSaveViewModal(true),
          title: "Save View to Google Sheets",
          "data-guide": "save-view"
        },
        "\u{1F4BE} Save View"
      ), /* @__PURE__ */ React.createElement(
        "button",
        {
          style: {
            ...styles.buttonGroupBtn,
            ...showScenarioPanel ? styles.buttonGroupBtnActive : {}
          },
          onClick: () => setShowScenarioPanel(!showScenarioPanel),
          title: "Scenario Comparison",
          "data-guide": "comparison"
        },
        "\u{1F4CA} Compare"
      ), /* @__PURE__ */ React.createElement(
        "button",
        {
          style: {
            ...styles.buttonGroupBtn,
            ...false ? styles.buttonGroupBtnActive : {}
          },
          onClick: handleShareClick,
          title: "Share Chart Configuration",
          "data-guide": "share-link"
        },
        "\u{1F517} Share"
      ), /* @__PURE__ */ React.createElement(
        "button",
        {
          style: {
            ...styles.buttonGroupBtn,
            backgroundColor: theme.danger,
            color: "white",
            border: "none",
            marginLeft: "4px"
          },
          onClick: resetAllFilters,
          title: "Reset All Filters",
          "data-guide": "reset-button"
        },
        "\u21BA Reset"
      ))),
      /* @__PURE__ */ React.createElement("div", { style: styles.controlGroup, "data-guide": "filter-search" }, /* @__PURE__ */ React.createElement(
        "div",
        {
          style: { display: "flex", gap: "8px", alignItems: "center" }
        },
        /* @__PURE__ */ React.createElement("div", { style: { ...styles.filterSearchContainer, flex: 1 } }, /* @__PURE__ */ React.createElement(
          "input",
          {
            ref: filterSearchInputRef,
            style: {
              ...styles.filterSearchInput,
              borderColor: showFilterSuggestions ? "#6366f1" : "#d1d5db",
              width: "100%",
              boxShadow: showFilterSuggestions ? "0 0 0 3px rgba(99, 102, 241, 0.1)" : "none"
            },
            type: "text",
            placeholder: "Search filters...",
            value: filterSearchText,
            onChange: (e) => {
              const newValue = e.target.value;
              setFilterSearchText(newValue);
              requestAnimationFrame(() => {
                if (!showFilterSuggestions && newValue.length > 0) {
                  setShowFilterSuggestions(true);
                }
              });
            },
            onFocus: () => {
              requestAnimationFrame(() => {
                if (filterSearchInputRef.current) {
                  if (!filterDropdownPositionRef.current) {
                    const rect = filterSearchInputRef.current.getBoundingClientRect();
                    filterDropdownPositionRef.current = {
                      top: `${rect.bottom}px`,
                      left: `${rect.left}px`,
                      width: `${rect.width}px`
                    };
                  }
                  setDropdownStyle(filterDropdownPositionRef.current);
                }
              });
              setShowFilterSuggestions(true);
            },
            onBlur: (e) => {
              setTimeout(() => {
                const activeElement = document.activeElement;
                if (!filterSuggestionsDropdownRef.current || !filterSuggestionsDropdownRef.current.contains(
                  activeElement
                )) {
                  setShowFilterSuggestions(false);
                  filterDropdownPositionRef.current = null;
                }
              }, 50);
            },
            onKeyDown: (e) => {
              if (e.key === "Escape") {
                setShowFilterSuggestions(false);
                if (filterSearchInputRef.current) {
                  filterSearchInputRef.current.blur();
                }
              }
            },
            onClick: (e) => e.stopPropagation()
          }
        ), showFilterSuggestions && Object.keys(currentFilterSuggestions).length > 0 && /* @__PURE__ */ React.createElement(
          "div",
          {
            ref: filterSuggestionsDropdownRef,
            style: {
              ...styles.filterSuggestionsDropdown,
              ...dropdownStyle
            }
          },
          Object.entries(currentFilterSuggestions).map(
            ([groupType, suggestions]) => /* @__PURE__ */ React.createElement("div", { key: groupType }, /* @__PURE__ */ React.createElement("div", { style: styles.filterGroupHeader }, groupType), suggestions.map((suggestion, index) => {
              const isSelected = getFilterState(
                suggestion.filterKey
              ).includes(suggestion.value);
              return /* @__PURE__ */ React.createElement(
                "div",
                {
                  key: `${suggestion.type}-${suggestion.value}`,
                  style: isSelected ? styles.filterSuggestionItemSelected : styles.filterSuggestionItemUnselected,
                  onMouseDown: (e) => {
                    e.preventDefault();
                    handleFilterSuggestionSelect(
                      suggestion
                    );
                  }
                },
                /* @__PURE__ */ React.createElement(
                  "input",
                  {
                    type: "checkbox",
                    style: styles.checkboxInput,
                    checked: isSelected,
                    onChange: () => handleFilterSuggestionSelect(
                      suggestion
                    ),
                    onClick: (e) => e.stopPropagation(),
                    onMouseDown: (e) => e.stopPropagation()
                  }
                ),
                /* @__PURE__ */ React.createElement("div", { style: styles.filterSuggestionName }, suggestion.displayName)
              );
            }))
          )
        ), showFilterSuggestions && filterSearchText.length > 0 && Object.keys(currentFilterSuggestions).length === 0 && /* @__PURE__ */ React.createElement(
          "div",
          {
            style: {
              ...styles.filterSuggestionsDropdown,
              ...dropdownStyle
            }
          },
          /* @__PURE__ */ React.createElement(
            "div",
            {
              style: {
                ...styles.filterSuggestionItem,
                cursor: "default"
              }
            },
            /* @__PURE__ */ React.createElement("div", { style: styles.filterSuggestionName }, 'No matching filters found for "', filterSearchText, '"')
          )
        )),
        /* @__PURE__ */ React.createElement(
          "button",
          {
            style: {
              ...styles.resetButton,
              backgroundColor: "transparent",
              border: `1px solid ${theme.borderSecondary}`,
              color: theme.textSecondary,
              fontSize: "12px",
              padding: "6px 12px",
              whiteSpace: "nowrap"
            },
            onClick: (e) => {
              e.stopPropagation();
              setShowAdvancedFilters(!showAdvancedFilters);
            },
            title: "Show all available filters",
            "data-guide": "advanced-filters"
          },
          "Show All"
        )
      )),
      /* @__PURE__ */ React.createElement("div", { style: styles.controlGroup }, renderButtonGroup(
        isLiveMode ? ["Daily", "Weekly", "Monthly", "Quarterly", "Yearly"] : ["Weekly", "Monthly", "Quarterly", "Yearly"],
        dataFrequency,
        handleDataFrequencyChange,
        styles.dataFrequencyGroup,
        styles.dataFrequencyButton,
        styles.dataFrequencyButtonActive
      ))
    )))), /* @__PURE__ */ React.createElement("div", { style: styles.advancedFiltersPanel }, /* @__PURE__ */ React.createElement("div", { style: styles.advancedFiltersHeader }, /* @__PURE__ */ React.createElement("h3", { style: styles.advancedFiltersTitle }, "Advanced Filters", /* @__PURE__ */ React.createElement(
      "button",
      {
        style: styles.closeButton,
        onClick: () => setShowAdvancedFilters(false)
      },
      "\xD7"
    ))), /* @__PURE__ */ React.createElement("div", { style: styles.advancedFiltersContent }, /* @__PURE__ */ React.createElement("div", { style: styles.filterSection }, /* @__PURE__ */ React.createElement("button", { style: styles.modernResetButton, onClick: resetAllFilters }, "Reset All Filters")), /* @__PURE__ */ React.createElement("div", { style: styles.filterSection }, /* @__PURE__ */ React.createElement("h4", { style: styles.sectionTitle }, "Data Filters"), FILTER_CONFIG.map(
      ({ key, label, state, setState, formatValue }) => {
        const options = filterOptionsWithoutAll[key] || [];
        return renderDropdownFilter(
          key,
          label,
          options,
          state,
          setState,
          formatValue || formatFilterName2
        );
      }
    )))), /* @__PURE__ */ React.createElement("div", { style: styles.proTipBanner }, /* @__PURE__ */ React.createElement("span", { style: styles.proTipLabel }, "ProTip"), /* @__PURE__ */ React.createElement("span", { style: styles.proTipIcon }, PRO_TIPS[currentTipIndex].icon), /* @__PURE__ */ React.createElement("div", { style: styles.proTipContent }, /* @__PURE__ */ React.createElement("span", { style: styles.proTipTitle }, PRO_TIPS[currentTipIndex].title, ":"), /* @__PURE__ */ React.createElement("span", { style: styles.proTipText }, PRO_TIPS[currentTipIndex].text)), /* @__PURE__ */ React.createElement("div", { style: styles.proTipNavigation }, /* @__PURE__ */ React.createElement(
      "button",
      {
        style: styles.proTipNavButton,
        onClick: () => setCurrentTipIndex(
          (prev) => prev === 0 ? PRO_TIPS.length - 1 : prev - 1
        ),
        onMouseEnter: (e) => {
          e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.9)";
          e.currentTarget.style.transform = "scale(1.1)";
        },
        onMouseLeave: (e) => {
          e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.6)";
          e.currentTarget.style.transform = "scale(1)";
        },
        title: "Previous tip"
      },
      "\u2039"
    ), /* @__PURE__ */ React.createElement("span", { style: styles.proTipCounter }, currentTipIndex + 1, "/", PRO_TIPS.length), /* @__PURE__ */ React.createElement(
      "button",
      {
        style: styles.proTipNavButton,
        onClick: () => setCurrentTipIndex((prev) => (prev + 1) % PRO_TIPS.length),
        onMouseEnter: (e) => {
          e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.9)";
          e.currentTarget.style.transform = "scale(1.1)";
        },
        onMouseLeave: (e) => {
          e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.6)";
          e.currentTarget.style.transform = "scale(1)";
        },
        title: "Next tip"
      },
      "\u203A"
    ))), /* @__PURE__ */ React.createElement("div", { style: styles.mainContent }, /* @__PURE__ */ React.createElement("div", { style: styles.leftPanel, "data-guide": "insights-panel" }, activeInsightsTab === null ? /* @__PURE__ */ React.createElement("div", { style: styles.insightsTabsContainer }, /* @__PURE__ */ React.createElement(
      "button",
      {
        style: styles.clickForInsightsButton,
        onClick: () => setActiveInsightsTab("basic"),
        onMouseEnter: (e) => {
          e.currentTarget.style.opacity = "0.9";
        },
        onMouseLeave: (e) => {
          e.currentTarget.style.opacity = "";
        }
      },
      /* @__PURE__ */ React.createElement("span", { style: { fontSize: "16px" } }, "\u2728"),
      "Click for Insights",
      /* @__PURE__ */ React.createElement("span", { style: { fontSize: "16px" } }, "\u2728")
    )) : /* @__PURE__ */ React.createElement("div", { style: styles.insightsTabsContainer }, /* @__PURE__ */ React.createElement(
      "button",
      {
        style: {
          ...styles.insightsTab,
          ...activeInsightsTab === "basic" ? styles.insightsTabActive : {}
        },
        onClick: () => setActiveInsightsTab(
          activeInsightsTab === "basic" ? null : "basic"
        )
      },
      "Solo Insights",
      /* @__PURE__ */ React.createElement("span", { style: styles.tabCount }, Object.values(displayedInsights.basicInsights).flat().length)
    ), /* @__PURE__ */ React.createElement(
      "button",
      {
        style: {
          ...styles.insightsTab,
          ...activeInsightsTab === "advanced" ? styles.insightsTabActive : {}
        },
        onClick: () => setActiveInsightsTab(
          activeInsightsTab === "advanced" ? null : "advanced"
        )
      },
      "Cross Insights",
      (activeInsightsTab === "advanced" || Object.values(displayedInsights.advancedInsights).flat().length > 0) && /* @__PURE__ */ React.createElement("span", { style: styles.tabCount }, Object.values(displayedInsights.advancedInsights).flat().length)
    )), activeInsightsTab && (() => {
      const insightsConfig = {
        basic: {
          title: "Single-dimension analysis of trends and patterns",
          emptyMessage: "No significant patterns detected with current filters and data range. Try adjusting your date range or filters to see more insights.",
          categories: [
            {
              key: "decomposition",
              title: "Investigation Decomposition",
              tooltipText: "Breaks down the investigation to show which sub-segments are driving the observed performance. Explains what's behind the trend or anomaly you're investigating.",
              colors: {
                borderColor: "#10b981",
                backgroundColor: isDarkMode ? "rgba(16, 185, 129, 0.1)" : "rgba(16, 185, 129, 0.08)",
                hoverBackgroundColor: isDarkMode ? "rgba(16, 185, 129, 0.15)" : "#d1fae5",
                hoverBorderColor: "#10b981"
              }
            },
            {
              key: "performanceAlerts",
              title: "Performance Alerts",
              tooltipText: null,
              colors: {
                borderColor: theme.danger,
                backgroundColor: theme.dangerBg,
                hoverBackgroundColor: isDarkMode ? "rgba(239, 68, 68, 0.2)" : "#fee2e2",
                hoverBorderColor: theme.danger
              }
            },
            {
              key: "overallTrends",
              title: "Overall Trends",
              tooltipText: null
            },
            {
              key: "categoryTrends",
              title: "Category Trends",
              tooltipText: "Above/below avg. compares category growth rate to overall market growth rate. For example, if market grew 20% and category grew 30%, it's 10 percentage points above avg.",
              colors: {
                borderColor: theme.accentPrimary,
                backgroundColor: theme.statBoxActiveBg,
                hoverBackgroundColor: isDarkMode ? "rgba(129, 140, 248, 0.15)" : "#dbeafe",
                hoverBorderColor: theme.accentPrimary
              }
            },
            {
              key: "shareShifts",
              title: "Market Share Shifts",
              tooltipText: "Above/below avg. compares category growth rate to overall market growth rate. For example, if market grew 20% and category grew 30%, it's 10 percentage points above avg.",
              colors: {
                borderColor: isDarkMode ? "#a78bfa" : "#8b5cf6",
                backgroundColor: isDarkMode ? "rgba(139, 92, 246, 0.1)" : "rgba(139, 92, 246, 0.08)",
                hoverBackgroundColor: isDarkMode ? "rgba(139, 92, 246, 0.15)" : "#f3e8ff",
                hoverBorderColor: isDarkMode ? "#a78bfa" : "#8b5cf6"
              }
            },
            {
              key: "marketLeaders",
              title: "Market Leaders",
              tooltipText: null
            }
          ],
          insights: displayedInsights.basicInsights
        },
        advanced: {
          title: "Multi-attribute analysis across dimensions",
          emptyMessage: "Advanced cross-dimensional insights will be displayed here when sufficient data patterns are detected across multiple attributes. Try using fewer filters to see cross-dimensional patterns.",
          categories: [
            {
              key: "allTimeGrowth",
              title: "Cross Insights Growth",
              tooltipText: "Above/below avg. compares segment growth rate to overall market growth rate. For example, if market grew 20% and segment grew 30%, it's 10 percentage points above avg."
            }
          ],
          insights: displayedInsights.advancedInsights
        }
      };
      const config = insightsConfig[activeInsightsTab];
      if (!config) return null;
      if (loadingInsights) {
        return /* @__PURE__ */ React.createElement("div", { style: styles.structuredInsightsContainer }, /* @__PURE__ */ React.createElement(
          "div",
          {
            style: {
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "40px",
              color: "#6b7280"
            }
          },
          /* @__PURE__ */ React.createElement(
            "div",
            {
              style: {
                width: "40px",
                height: "40px",
                border: "4px solid #f3f4f6",
                borderTop: "4px solid #3b82f6",
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
                marginBottom: "16px"
              }
            }
          ),
          /* @__PURE__ */ React.createElement("div", { style: { fontSize: "14px", fontWeight: "500" } }, "Loading Insights..."),
          /* @__PURE__ */ React.createElement("div", { style: { fontSize: "12px", marginTop: "8px" } }, "Analyzing patterns in your data")
        ));
      }
      const processedInsights = config.insights;
      const totalInsights = Object.values(processedInsights).flat().length;
      return /* @__PURE__ */ React.createElement("div", { style: styles.structuredInsightsContainer }, /* @__PURE__ */ React.createElement("div", { style: styles.insightsContext }, getShortFilterContext()), /* @__PURE__ */ React.createElement("div", { style: styles.insightsSubtitle }, config.title), config.categories.map(
        ({ key, title, tooltipText, colors }) => renderInsightCategory(
          processedInsights[key],
          title,
          key,
          tooltipText,
          colors
        )
      ), totalInsights === 0 && /* @__PURE__ */ React.createElement("div", { style: styles.categorySection }, /* @__PURE__ */ React.createElement("div", { style: styles.insightText }, config.emptyMessage)));
    })()), /* @__PURE__ */ React.createElement("div", { style: styles.chartContainer }, /* @__PURE__ */ React.createElement(
      "button",
      {
        style: {
          ...styles.undoButton,
          ...history.length === 0 ? styles.undoButtonDisabled : {}
        },
        onClick: handleUndo,
        disabled: history.length === 0,
        title: "Undo (Go back to previous filters and selections)",
        "data-guide": "undo-button"
      },
      "\u23EA"
    ), showScenarioPanel && (() => {
      const nextScenario = getNextEmptyScenario();
      const savedScenarios = getSavedScenarios();
      return /* @__PURE__ */ React.createElement(
        "div",
        {
          style: {
            position: "absolute",
            top: "12px",
            left: "50px",
            backgroundColor: "white",
            border: "1px solid #d1d5db",
            borderRadius: "8px",
            padding: "12px",
            fontSize: "12px",
            zIndex: 10,
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            minWidth: "280px",
            maxWidth: "320px"
          }
        },
        /* @__PURE__ */ React.createElement(
          "div",
          {
            style: {
              fontSize: "13px",
              fontWeight: "600",
              color: "#374151",
              marginBottom: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between"
            }
          },
          /* @__PURE__ */ React.createElement("span", null, "Compare Views"),
          /* @__PURE__ */ React.createElement(
            "button",
            {
              onClick: () => setShowScenarioPanel(false),
              style: {
                background: "none",
                border: "none",
                fontSize: "18px",
                color: "#6b7280",
                cursor: "pointer",
                padding: "0",
                width: "24px",
                height: "24px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "4px"
              },
              title: "Close Scenario Panel"
            },
            "\xD7"
          )
        ),
        nextScenario && /* @__PURE__ */ React.createElement(
          "div",
          {
            style: {
              marginBottom: savedScenarios.length > 0 ? "16px" : "0"
            }
          },
          /* @__PURE__ */ React.createElement(
            "div",
            {
              style: {
                fontSize: "11px",
                fontWeight: "600",
                color: "#6b7280",
                marginBottom: "8px",
                textTransform: "uppercase",
                letterSpacing: "0.5px"
              }
            },
            "Capture View"
          ),
          /* @__PURE__ */ React.createElement(
            "div",
            {
              style: {
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "8px"
              }
            },
            /* @__PURE__ */ React.createElement(
              "div",
              {
                style: {
                  width: "16px",
                  height: "16px",
                  backgroundColor: nextScenario.color,
                  borderRadius: "4px",
                  border: "1px solid #9ca3af"
                }
              }
            ),
            /* @__PURE__ */ React.createElement(
              "input",
              {
                type: "text",
                value: nextScenario.label,
                onChange: (e) => updateScenarioLabel(
                  nextScenario.index,
                  e.target.value
                ),
                placeholder: `Scenario ${nextScenario.index}`,
                style: {
                  flex: 1,
                  padding: "6px 8px",
                  border: "1px solid #d1d5db",
                  borderRadius: "4px",
                  fontSize: "12px"
                }
              }
            )
          ),
          /* @__PURE__ */ React.createElement(
            "button",
            {
              onClick: () => setScenario(nextScenario.index),
              style: {
                width: "100%",
                padding: "8px 12px",
                backgroundColor: nextScenario.color,
                color: "white",
                border: "none",
                borderRadius: "4px",
                fontSize: "12px",
                fontWeight: "500",
                cursor: "pointer"
              }
            },
            "\u2795 Add to Compare"
          )
        ),
        savedScenarios.length > 0 && /* @__PURE__ */ React.createElement(
          "div",
          {
            style: {
              paddingTop: savedScenarios.length > 0 && nextScenario ? "16px" : "0",
              borderTop: savedScenarios.length > 0 && nextScenario ? "1px solid #e5e7eb" : "none"
            }
          },
          /* @__PURE__ */ React.createElement("div", { style: styles.savedViewsHeader }, "Saved Views (", savedScenarios.length, ")"),
          savedScenarios.map((saved, idx) => /* @__PURE__ */ React.createElement(
            "div",
            {
              key: saved.index,
              style: {
                ...styles.savedScenarioCard,
                marginBottom: idx === savedScenarios.length - 1 ? "0" : "10px"
              }
            },
            /* @__PURE__ */ React.createElement("div", { style: styles.savedScenarioRow }, /* @__PURE__ */ React.createElement(
              "input",
              {
                type: "checkbox",
                checked: saved.isActive,
                onChange: () => toggleScenario(saved.index),
                style: {
                  cursor: "pointer",
                  accentColor: saved.color
                }
              }
            ), /* @__PURE__ */ React.createElement("span", { style: styles.savedScenarioLabel }, saved.label), /* @__PURE__ */ React.createElement(
              "button",
              {
                onClick: () => clearScenario(saved.index),
                style: styles.savedScenarioDeleteBtn,
                title: "Remove this scenario"
              },
              "Clear"
            ))
          ))
        ),
        !nextScenario && savedScenarios.length === 3 && /* @__PURE__ */ React.createElement("div", { style: styles.allSlotsFilled }, "Maximum 3 scenarios reached. Clear one to add more.")
      );
    })(), view !== "Overall" && /* @__PURE__ */ React.createElement("div", { style: { position: "relative" }, "data-topx-control": true }, /* @__PURE__ */ React.createElement(
      "button",
      {
        style: styles.topXControl,
        onClick: () => setShowTopXControl(!showTopXControl),
        title: "Configure category selection",
        "data-guide": "top-x-control"
      },
      "Top ",
      topX,
      selectedCategories.length > 0 && ` + ${selectedCategories.length}`,
      " \u25BC"
    ), showTopXControl && /* @__PURE__ */ React.createElement("div", { style: styles.topXControlDropdown }, /* @__PURE__ */ React.createElement("div", { style: styles.topXControlHeader }, /* @__PURE__ */ React.createElement("div", { style: styles.topXControlTitle }, "Category Selection"), /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: () => setShowTopXControl(false),
        style: {
          background: "none",
          border: "none",
          fontSize: "20px",
          color: "#6b7280",
          cursor: "pointer",
          padding: "0",
          width: "24px",
          height: "24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }
      },
      "\xD7"
    )), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(
      "label",
      {
        style: {
          fontSize: "12px",
          fontWeight: "500",
          color: "#6b7280",
          marginBottom: "4px",
          display: "block"
        }
      },
      "Top X Categories"
    ), /* @__PURE__ */ React.createElement(
      "input",
      {
        style: styles.topXInput,
        type: "number",
        value: topX,
        onChange: (e) => setTopX(
          Math.max(
            0,
            Math.min(20, parseInt(e.target.value) || 0)
          )
        ),
        min: "0",
        max: "20"
      }
    )), /* @__PURE__ */ React.createElement("div", { style: { marginTop: "16px" } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(
      "label",
      {
        style: {
          fontSize: "12px",
          fontWeight: "500",
          color: "#6b7280",
          marginBottom: "8px",
          display: "block"
        }
      },
      "Additional Categories (",
      selectedCategories.length,
      " ",
      "selected)",
      /* @__PURE__ */ React.createElement(
        "span",
        {
          style: {
            fontSize: "11px",
            color: "#9ca3af",
            fontWeight: "400",
            marginLeft: "4px"
          }
        },
        "(in addition to Top ",
        topX,
        ")"
      )
    ), /* @__PURE__ */ React.createElement(
      "input",
      {
        style: {
          ...styles.topXInput,
          marginBottom: "8px"
        },
        type: "text",
        placeholder: "Search categories...",
        value: categorySearchText,
        onChange: (e) => setCategorySearchText(e.target.value),
        onClick: (e) => e.stopPropagation()
      }
    ), /* @__PURE__ */ React.createElement("div", { style: styles.categorySelectionList }, filteredCategories.length > 0 ? filteredCategories.map((category) => {
      const isSelected = selectedCategories.includes(category);
      return /* @__PURE__ */ React.createElement(
        "div",
        {
          key: category,
          style: isSelected ? styles.categorySelectionItemSelected : styles.categorySelectionItemUnselected,
          onClick: () => {
            if (isSelected) {
              setSelectedCategories(
                (prev) => prev.filter((c) => c !== category)
              );
            } else {
              setSelectedCategories((prev) => [
                ...prev,
                category
              ]);
            }
          }
        },
        /* @__PURE__ */ React.createElement(
          "input",
          {
            type: "checkbox",
            style: styles.categoryCheckbox,
            checked: isSelected,
            onChange: () => {
            }
          }
        ),
        /* @__PURE__ */ React.createElement("span", { style: styles.categoryLabelText }, formatFilterName2(category))
      );
    }) : /* @__PURE__ */ React.createElement("div", { style: styles.noCategoriesFound }, 'No categories found matching "', categorySearchText, '"')))))), view !== "Overall" && resolveChartType(metric) !== "line" && /* @__PURE__ */ React.createElement(
      "div",
      {
        style: {
          display: "flex",
          gap: "8px",
          marginBottom: "12px",
          alignItems: "center",
          justifyContent: "center",
          flexWrap: "wrap"
        }
      },
      /* @__PURE__ */ React.createElement(
        "button",
        {
          onClick: () => {
            setShowAllDollarTraces(!showAllDollarTraces);
            setTraceVisibility({});
          },
          style: {
            padding: "6px 12px",
            backgroundColor: showAllDollarTraces ? "#8b5cf6" : "white",
            color: showAllDollarTraces ? "white" : "#8b5cf6",
            border: "1px solid #8b5cf6",
            borderRadius: "6px",
            fontSize: "12px",
            fontWeight: "500",
            cursor: "pointer"
          }
        },
        showAllDollarTraces ? "\u2713" : "",
        " $ Share"
      ),
      /* @__PURE__ */ React.createElement(
        "button",
        {
          onClick: () => {
            setShowAllShareTraces(!showAllShareTraces);
            setTraceVisibility({});
          },
          style: {
            padding: "6px 12px",
            backgroundColor: showAllShareTraces ? "#6366f1" : "white",
            color: showAllShareTraces ? "white" : "#6366f1",
            border: "1px solid #6366f1",
            borderRadius: "6px",
            fontSize: "12px",
            fontWeight: "500",
            cursor: "pointer"
          }
        },
        showAllShareTraces ? "\u2713" : "",
        " %Share"
      ),
      /* @__PURE__ */ React.createElement(
        "button",
        {
          onClick: () => {
            setShowAllGrowthTraces(!showAllGrowthTraces);
            setTraceVisibility({});
          },
          style: {
            padding: "6px 12px",
            backgroundColor: showAllGrowthTraces ? "#10b981" : "white",
            color: showAllGrowthTraces ? "white" : "#10b981",
            border: "1px solid #10b981",
            borderRadius: "6px",
            fontSize: "12px",
            fontWeight: "500",
            cursor: "pointer"
          }
        },
        showAllGrowthTraces ? "\u2713" : "",
        " %Growth YoY"
      ),
      /* @__PURE__ */ React.createElement(
        "div",
        {
          style: {
            width: "100%",
            textAlign: "center",
            fontSize: "11px",
            color: "#6b7280",
            marginTop: "4px"
          }
        },
        "Click buttons to toggle traces",
        /* @__PURE__ */ React.createElement("br", null),
        "Legend appears when active"
      )
    ), insightContext && /* @__PURE__ */ React.createElement(
      InsightContextBanner,
      {
        insightContext,
        formatMetric,
        formatPeriodDate: formatPeriodDate2,
        onClear: () => {
          setInsightContext(null);
        },
        theme,
        isDarkMode
      }
    ), view === "Overall" && /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "flex-end", marginBottom: "4px", position: "relative" } }, /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: () => setShowOverlayMenu((prev) => !prev),
        style: {
          padding: "4px 10px",
          fontSize: "11px",
          fontWeight: 600,
          borderRadius: "6px",
          border: `1px solid ${isDarkMode ? "#4b5563" : "#d1d5db"}`,
          backgroundColor: isDarkMode ? "#1f2937" : "#ffffff",
          color: isDarkMode ? "#d1d5db" : "#374151",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: "4px"
        }
      },
      "Overlays",
      (() => {
        const count = OVERLAY_CONFIG.filter((o) => activeOverlays[o.id]).length;
        return count > 0 ? ` (${count})` : "";
      })(),
      /* @__PURE__ */ React.createElement("span", { style: { fontSize: "8px", marginLeft: "2px" } }, showOverlayMenu ? "\u25B2" : "\u25BC")
    ), showOverlayMenu && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { style: { position: "fixed", inset: 0, zIndex: 999 }, onClick: () => setShowOverlayMenu(false) }), /* @__PURE__ */ React.createElement("div", { style: {
      position: "absolute",
      top: "100%",
      right: 0,
      zIndex: 1e3,
      marginTop: "4px",
      backgroundColor: isDarkMode ? "#1f2937" : "#ffffff",
      border: `1px solid ${isDarkMode ? "#374151" : "#e5e7eb"}`,
      borderRadius: "8px",
      padding: "4px 0",
      minWidth: "160px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
    } }, OVERLAY_CONFIG.map((overlay) => {
      const isActive = !!activeOverlays[overlay.id];
      const grainTooCoarse = overlay.minGrain && GRAIN_RANK[overlay.minGrain] < GRAIN_RANK[dataFrequency];
      const lookbackNeeded = overlay.lookback && overlay.lookback[dataFrequency];
      const insufficientData = lookbackNeeded && periods.length <= lookbackNeeded;
      const isDisabled = grainTooCoarse || insufficientData;
      const disabledReason = grainTooCoarse ? `Not available in ${dataFrequency} grain` : insufficientData ? `Needs ${lookbackNeeded + 1}+ ${dataFrequency.toLowerCase()} periods` : "";
      return /* @__PURE__ */ React.createElement("div", { key: overlay.id, style: { padding: "0 4px" }, title: isDisabled ? disabledReason : "" }, /* @__PURE__ */ React.createElement(
        "label",
        {
          style: {
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "6px 8px",
            cursor: isDisabled ? "default" : "pointer",
            borderRadius: "4px",
            fontSize: "12px",
            fontWeight: 500,
            color: isDisabled ? isDarkMode ? "#6b7280" : "#9ca3af" : isDarkMode ? "#e5e7eb" : "#374151",
            backgroundColor: "transparent",
            opacity: isDisabled ? 0.5 : 1,
            transition: "background-color 0.1s"
          },
          onMouseEnter: (e) => {
            if (!isDisabled) e.currentTarget.style.backgroundColor = isDarkMode ? "#374151" : "#f3f4f6";
          },
          onMouseLeave: (e) => {
            e.currentTarget.style.backgroundColor = "transparent";
          }
        },
        /* @__PURE__ */ React.createElement(
          "input",
          {
            type: "checkbox",
            checked: isActive && !isDisabled,
            disabled: isDisabled,
            onChange: () => setActiveOverlays((prev) => ({ ...prev, [overlay.id]: !prev[overlay.id] })),
            style: { accentColor: overlay.color, cursor: isDisabled ? "default" : "pointer" }
          }
        ),
        /* @__PURE__ */ React.createElement("span", { style: {
          width: "10px",
          height: "10px",
          borderRadius: "50%",
          backgroundColor: isDisabled ? isDarkMode ? "#4b5563" : "#d1d5db" : overlay.color,
          flexShrink: 0
        } }),
        /* @__PURE__ */ React.createElement("span", null, overlay.label),
        overlay.isSMA && isActive && /* @__PURE__ */ React.createElement(
          "input",
          {
            type: "number",
            min: 2,
            max: 52,
            value: smaWindow,
            onClick: (e) => e.stopPropagation(),
            onChange: (e) => setSmaWindow(Math.max(2, Math.min(52, parseInt(e.target.value) || 3))),
            style: {
              width: "36px",
              padding: "1px 3px",
              fontSize: "11px",
              borderRadius: "4px",
              border: `1px solid ${isDarkMode ? "#4b5563" : "#d1d5db"}`,
              textAlign: "center",
              backgroundColor: isDarkMode ? "#111827" : "#f9fafb",
              color: isDarkMode ? "#f3f4f6" : "#111827",
              outline: "none",
              marginLeft: "auto"
            }
          }
        ),
        overlay.isForecast && isActive && /* @__PURE__ */ React.createElement(
          "input",
          {
            type: "number",
            min: 1,
            max: 12,
            value: forecastHorizon,
            onClick: (e) => e.stopPropagation(),
            onChange: (e) => setForecastHorizon(Math.max(1, Math.min(12, parseInt(e.target.value) || 3))),
            style: {
              width: "36px",
              padding: "1px 3px",
              fontSize: "11px",
              borderRadius: "4px",
              border: `1px solid ${isDarkMode ? "#4b5563" : "#d1d5db"}`,
              textAlign: "center",
              backgroundColor: isDarkMode ? "#111827" : "#f9fafb",
              color: isDarkMode ? "#f3f4f6" : "#111827",
              outline: "none",
              marginLeft: "auto"
            }
          }
        )
      ));
    })))), /* @__PURE__ */ React.createElement(
      PlotlyChart,
      {
        key: `${view}-${metric}-${dataFrequency}-${dateRange}`,
        data: finalChartData,
        layout: chartLayout,
        ref: chartRef,
        onLegendClick: handleLegendClick
      }
    ))), /* @__PURE__ */ React.createElement("div", { style: styles.summaryContainer }, /* @__PURE__ */ React.createElement(
      "h4",
      {
        style: styles.summaryTitle,
        onClick: () => setShowDataSummary(!showDataSummary)
      },
      /* @__PURE__ */ React.createElement("span", { style: { fontSize: "12px" } }, showDataSummary ? "\u25BC" : "\u25B6"),
      "Data Summary"
    ), showDataSummary && /* @__PURE__ */ React.createElement("div", { style: styles.summaryGrid }, /* @__PURE__ */ React.createElement("div", { style: styles.summaryItem }, /* @__PURE__ */ React.createElement("strong", null, "Date Aggregation:"), " ", dataFrequency), /* @__PURE__ */ React.createElement("div", { style: styles.summaryItem }, /* @__PURE__ */ React.createElement("strong", null, "Metric:"), " ", metric), /* @__PURE__ */ React.createElement("div", { style: styles.summaryItem }, /* @__PURE__ */ React.createElement("strong", null, "Split By Dimension:"), " ", view), /* @__PURE__ */ React.createElement("div", { style: styles.summaryItem }, /* @__PURE__ */ React.createElement("strong", null, "Date Range:"), " ", dateRange), /* @__PURE__ */ React.createElement("div", { style: styles.summaryItem }, /* @__PURE__ */ React.createElement("strong", null, "Total Records:"), " ", filteredData.length.toLocaleString()), /* @__PURE__ */ React.createElement("div", { style: styles.summaryItem }, /* @__PURE__ */ React.createElement("strong", null, "Period Range:"), " ", periods.length > 0 ? periods[0] + " to " + periods[periods.length - 1] : "No data"), /* @__PURE__ */ React.createElement("div", { style: styles.summaryItem }, /* @__PURE__ */ React.createElement("strong", null, "Active Filters:"), " ", FILTER_CONFIG.flatMap(({ state, formatValue, key }) => {
      if (state.length === 0) return [];
      return state.map(
        (val) => formatValue ? formatValue(val) : formatFilterName2(val)
      );
    }).join(", ") || "None"), /* @__PURE__ */ React.createElement("div", { style: styles.summaryItem }, /* @__PURE__ */ React.createElement("strong", null, "Filter Context:"), " ", getShortFilterContext()), /* @__PURE__ */ React.createElement("div", { style: styles.summaryItem }, /* @__PURE__ */ React.createElement("strong", null, "Market Size:"), " ", formatMetric(calculateMetric(filteredData))), /* @__PURE__ */ React.createElement("div", { style: styles.summaryItem }, /* @__PURE__ */ React.createElement("strong", null, "Solo Insights Found:"), " ", Object.values(displayedInsights.basicInsights).flat().length), /* @__PURE__ */ React.createElement("div", { style: styles.summaryItem }, /* @__PURE__ */ React.createElement("strong", null, "Data Filter Time:"), " ", filterTimeRef.current.toFixed(2), "ms"), /* @__PURE__ */ React.createElement("div", { style: styles.summaryItem }, /* @__PURE__ */ React.createElement("strong", null, "Render Time:"), " ", (performance.now() - renderStartTime).toFixed(2), "ms"), /* @__PURE__ */ React.createElement("div", { style: styles.summaryItem }, /* @__PURE__ */ React.createElement("strong", null, "Render Count:"), " ", renderCountRef.current), /* @__PURE__ */ React.createElement("div", { style: styles.summaryItem }, /* @__PURE__ */ React.createElement("strong", null, "Raw Data Rows:"), " ", cleanedQueryData.rows ? cleanedQueryData.rows.length.toLocaleString() : 0), /* @__PURE__ */ React.createElement("div", { style: styles.summaryItem }, /* @__PURE__ */ React.createElement("strong", null, "Filtered Rows:"), " ", filteredData.length.toLocaleString()), /* @__PURE__ */ React.createElement("div", { style: styles.summaryItem }, /* @__PURE__ */ React.createElement("strong", null, "Cross Insights Found:"), " ", Object.values(displayedInsights.advancedInsights).flat().length))), showConnectModal && /* @__PURE__ */ React.createElement("div", { style: styles.shareModal, onClick: (e) => {
      if (e.target === e.currentTarget) setShowConnectModal(false);
    } }, /* @__PURE__ */ React.createElement("div", { style: { ...styles.shareModalContent, maxWidth: "440px" } }, /* @__PURE__ */ React.createElement("div", { style: styles.shareModalHeader }, /* @__PURE__ */ React.createElement("div", { style: styles.shareModalTitle }, "Connect to Database"), /* @__PURE__ */ React.createElement("button", { style: styles.shareModalClose, onClick: () => setShowConnectModal(false) }, "\xD7")), /* @__PURE__ */ React.createElement("div", { style: { padding: "4px 0 16px" } }, /* @__PURE__ */ React.createElement("p", { style: { margin: "0 0 16px", fontSize: "12px", color: isDarkMode ? "#9ca3af" : "#6b7280" } }, "Enter your Supabase connection details. Requires the ", /* @__PURE__ */ React.createElement("code", { style: { fontSize: "11px", padding: "1px 4px", borderRadius: "3px", background: isDarkMode ? "#1f2937" : "#f3f4f6" } }, "query_dataset"), " RPC function (see setup.sql)."), [
      { key: "supabaseUrl", label: "Supabase URL", placeholder: "https://your-project.supabase.co" },
      { key: "apiKey", label: "API Key (anon)", placeholder: "eyJhbGciOi..." },
      { key: "dataset", label: "Dataset (table name)", placeholder: "my_metrics_table" }
    ].map((f) => /* @__PURE__ */ React.createElement("div", { key: f.key, style: { marginBottom: "12px" } }, /* @__PURE__ */ React.createElement("label", { style: { display: "block", fontSize: "11px", fontWeight: 600, marginBottom: "4px", color: isDarkMode ? "#d1d5db" : "#374151" } }, f.label), /* @__PURE__ */ React.createElement(
      "input",
      {
        type: f.key === "apiKey" ? "password" : "text",
        value: connectForm[f.key],
        onChange: (e) => setConnectForm((prev) => ({ ...prev, [f.key]: e.target.value })),
        placeholder: f.placeholder,
        style: {
          width: "100%",
          padding: "8px 10px",
          borderRadius: "6px",
          fontSize: "13px",
          boxSizing: "border-box",
          border: `1px solid ${isDarkMode ? "#4b5563" : "#d1d5db"}`,
          backgroundColor: isDarkMode ? "#111827" : "#f9fafb",
          color: isDarkMode ? "#f3f4f6" : "#111827",
          outline: "none"
        }
      }
    ))), connectError && /* @__PURE__ */ React.createElement("div", { style: { fontSize: "12px", color: "#ef4444", marginBottom: "12px" } }, connectError), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: "8px", justifyContent: "flex-end" } }, /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: () => setShowConnectModal(false),
        style: {
          padding: "6px 14px",
          borderRadius: "6px",
          fontSize: "12px",
          cursor: "pointer",
          border: `1px solid ${isDarkMode ? "#4b5563" : "#d1d5db"}`,
          background: "transparent",
          color: isDarkMode ? "#d1d5db" : "#374151"
        }
      },
      "Cancel"
    ), /* @__PURE__ */ React.createElement(
      "button",
      {
        disabled: connectSaving || !connectForm.supabaseUrl || !connectForm.apiKey || !connectForm.dataset,
        onClick: async () => {
          setConnectError("");
          setConnectSaving(true);
          try {
            const testRes = await fetch(connectForm.supabaseUrl.replace(/\/+$/, "") + "/rest/v1/rpc/query_dataset", {
              method: "POST",
              headers: { "Content-Type": "application/json", "apikey": connectForm.apiKey, "Authorization": "Bearer " + connectForm.apiKey },
              body: JSON.stringify({ p_table: connectForm.dataset, p_action: "schema" })
            });
            if (!testRes.ok) throw new Error("Connection failed (HTTP " + testRes.status + "). Check your URL and API key.");
            const testData = await testRes.json();
            if (testData.error) throw new Error(testData.error);
            const connectionJson = { supabaseUrl: connectForm.supabaseUrl.replace(/\/+$/, ""), apiKey: connectForm.apiKey, dataset: connectForm.dataset };
            const tabsJson = [{ id: "tab_1", name: connectForm.dataset, dataset: connectForm.dataset, metricConfig: null }];
            const result = await createConfig({ name: connectForm.dataset, connectionJson, tabsJson });
            setEditSecret(result.id, result.editSecret);
            window.location.hash = "#/" + result.id;
            window.location.reload();
          } catch (err) {
            setConnectError(err.message);
          }
          setConnectSaving(false);
        },
        style: {
          padding: "6px 14px",
          borderRadius: "6px",
          fontSize: "12px",
          cursor: "pointer",
          fontWeight: 600,
          border: "none",
          background: !connectForm.supabaseUrl || !connectForm.apiKey || !connectForm.dataset ? isDarkMode ? "#374151" : "#e5e7eb" : "#6366f1",
          color: !connectForm.supabaseUrl || !connectForm.apiKey || !connectForm.dataset ? isDarkMode ? "#6b7280" : "#9ca3af" : "#ffffff"
        }
      },
      connectSaving ? "Connecting..." : "Connect & Save"
    ))))), showShareModal && /* @__PURE__ */ React.createElement(
      "div",
      {
        style: styles.shareModal,
        onClick: (e) => {
          if (e.target === e.currentTarget) {
            setShowShareModal(false);
          }
        }
      },
      /* @__PURE__ */ React.createElement("div", { style: styles.shareModalContent }, /* @__PURE__ */ React.createElement("div", { style: styles.shareModalHeader }, /* @__PURE__ */ React.createElement("div", { style: styles.shareModalTitle }, "Share Chart Configuration"), /* @__PURE__ */ React.createElement(
        "button",
        {
          style: styles.shareModalClose,
          onClick: () => setShowShareModal(false)
        },
        "\xD7"
      )), /* @__PURE__ */ React.createElement("div", { style: styles.shareCodeSection }, /* @__PURE__ */ React.createElement("label", { style: styles.shareCodeLabel }, "Your Share Link:"), /* @__PURE__ */ React.createElement("div", { style: styles.shareLinkContainer }, /* @__PURE__ */ React.createElement(
        "a",
        {
          id: "share-link-anchor",
          href: shareCode,
          target: "_blank",
          rel: "noopener noreferrer",
          style: {
            ...styles.shareLinkInput,
            textDecoration: "none",
            color: "#6366f1",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            padding: "10px 12px",
            wordBreak: "break-all"
          }
        },
        shareCode
      ), /* @__PURE__ */ React.createElement(
        "button",
        {
          id: "copy-share-code-btn",
          style: styles.shareCopyButton,
          onClick: () => {
            if (navigator.clipboard && navigator.clipboard.writeText) {
              navigator.clipboard.writeText(shareCode).then(() => {
                const btn = document.getElementById("copy-share-code-btn");
                if (btn) {
                  const orig = btn.textContent;
                  btn.textContent = "Copied!";
                  btn.style.backgroundColor = "#10b981";
                  setTimeout(() => {
                    btn.textContent = orig;
                    btn.style.backgroundColor = "#6366f1";
                  }, 2e3);
                }
              }).catch((e) => console.error("Failed to copy:", e));
            }
          }
        },
        "Copy Link"
      )), /* @__PURE__ */ React.createElement("div", { style: styles.shareInstructions }, /* @__PURE__ */ React.createElement("p", { style: { margin: "8px 0 0 0", fontSize: "12px", color: "#6b7280" } }, "Share this link. Recipients can view and explore the dashboard from this exact view.")), isCreatorMode && configId && (() => {
        const secret = getEditSecret(configId);
        if (!secret) return null;
        return /* @__PURE__ */ React.createElement("div", { style: {
          marginTop: "12px",
          padding: "10px 12px",
          borderRadius: "6px",
          background: isDarkMode ? "rgba(99,102,241,0.08)" : "rgba(99,102,241,0.05)",
          border: `1px solid ${isDarkMode ? "rgba(99,102,241,0.2)" : "rgba(99,102,241,0.15)"}`
        } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: "11px", fontWeight: 600, color: isDarkMode ? "#a5b4fc" : "#4338ca", marginBottom: "4px" } }, "Edit Key (for managing from other devices)"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: "8px" } }, /* @__PURE__ */ React.createElement("code", { style: {
          flex: 1,
          fontSize: "11px",
          padding: "4px 8px",
          borderRadius: "4px",
          background: isDarkMode ? "#111827" : "#f3f4f6",
          color: isDarkMode ? "#d1d5db" : "#374151",
          wordBreak: "break-all",
          userSelect: "all"
        } }, secret), /* @__PURE__ */ React.createElement(
          "button",
          {
            id: "copy-edit-key-btn",
            onClick: () => {
              navigator.clipboard.writeText(secret).then(() => {
                const btn = document.getElementById("copy-edit-key-btn");
                if (btn) {
                  const orig = btn.textContent;
                  btn.textContent = "Copied!";
                  setTimeout(() => {
                    btn.textContent = orig;
                  }, 1500);
                }
              });
            },
            style: {
              padding: "3px 8px",
              borderRadius: "4px",
              fontSize: "10px",
              cursor: "pointer",
              border: `1px solid ${isDarkMode ? "rgba(99,102,241,0.3)" : "rgba(99,102,241,0.3)"}`,
              background: "transparent",
              color: isDarkMode ? "#a5b4fc" : "#4338ca",
              whiteSpace: "nowrap"
            }
          },
          "Copy"
        )), /* @__PURE__ */ React.createElement("div", { style: { fontSize: "10px", color: isDarkMode ? "#6b7280" : "#9ca3af", marginTop: "4px" } }, "Paste this into the \u2699 gear icon on another device to unlock editing."));
      })()))
    ), showSaveViewModal && /* @__PURE__ */ React.createElement(
      "div",
      {
        style: styles.shareModal,
        onClick: (e) => {
          if (e.target === e.currentTarget) {
            setShowSaveViewModal(false);
          }
        }
      },
      /* @__PURE__ */ React.createElement("div", { style: styles.shareModalContent }, /* @__PURE__ */ React.createElement(
        "button",
        {
          style: styles.shareModalClose,
          onClick: () => {
            setShowSaveViewModal(false);
            setSaveViewError("");
            setSaveViewSuccess("");
          }
        },
        "\xD7"
      ), /* @__PURE__ */ React.createElement("div", { style: styles.shareCodeSection }, /* @__PURE__ */ React.createElement("div", { style: styles.shareInstructions }, /* @__PURE__ */ React.createElement(
        "p",
        {
          style: {
            margin: "0 0 16px 0",
            fontSize: "11px",
            color: "#9ca3af",
            fontStyle: "italic"
          }
        },
        'Note: Saved views will appear in the "Load Saved View" dropdown after approximately 1 hour, once the Google Sheet data is refreshed in the database.'
      )), /* @__PURE__ */ React.createElement("div", { style: styles.marginBottom16 }, /* @__PURE__ */ React.createElement("label", { style: styles.shareCodeLabel }, "View Name:"), /* @__PURE__ */ React.createElement(
        "input",
        {
          type: "text",
          value: saveViewName,
          onChange: (e) => {
            setSaveViewName(e.target.value);
            setSaveViewError("");
          },
          placeholder: "Enter a name for this view...",
          style: {
            ...styles.pasteCodeInput,
            width: "100%"
          }
        }
      )), /* @__PURE__ */ React.createElement("div", { style: styles.marginBottom16 }, /* @__PURE__ */ React.createElement("label", { style: styles.shareCodeLabel }, "Save as:"), /* @__PURE__ */ React.createElement("div", { style: styles.flexGap12Mt8 }, /* @__PURE__ */ React.createElement("label", { style: styles.radioLabel }, /* @__PURE__ */ React.createElement(
        "input",
        {
          type: "radio",
          value: "username",
          checked: saveViewOwnerType === "username",
          onChange: (e) => setSaveViewOwnerType(e.target.value),
          style: styles.marginRight6,
          disabled: !username
        }
      ), username || "Username (not available)"), /* @__PURE__ */ React.createElement("label", { style: styles.radioLabel }, /* @__PURE__ */ React.createElement(
        "input",
        {
          type: "radio",
          value: "team",
          checked: saveViewOwnerType === "team",
          onChange: (e) => setSaveViewOwnerType(e.target.value),
          style: styles.marginRight6,
          disabled: !teamName
        }
      ), teamName || "Team (not available)"), /* @__PURE__ */ React.createElement("label", { style: styles.radioLabel }, /* @__PURE__ */ React.createElement(
        "input",
        {
          type: "radio",
          value: "custom",
          checked: saveViewOwnerType === "custom",
          onChange: (e) => setSaveViewOwnerType(e.target.value),
          style: styles.marginRight6
        }
      ), "Custom"))), saveViewOwnerType === "custom" && /* @__PURE__ */ React.createElement("div", { style: styles.marginBottom16 }, /* @__PURE__ */ React.createElement("label", { style: styles.shareCodeLabel }, "Custom Owner:"), /* @__PURE__ */ React.createElement(
        "input",
        {
          type: "text",
          value: saveViewCustomOwner,
          onChange: (e) => {
            setSaveViewCustomOwner(e.target.value);
            setSaveViewError("");
          },
          placeholder: "Enter custom owner name...",
          style: {
            ...styles.pasteCodeInput,
            width: "100%"
          }
        }
      )), saveViewError && /* @__PURE__ */ React.createElement(
        "div",
        {
          style: {
            color: "#ef4444",
            fontSize: "13px",
            marginBottom: "12px",
            padding: "8px",
            backgroundColor: "#fee2e2",
            borderRadius: "4px"
          }
        },
        saveViewError
      ), saveViewSuccess && /* @__PURE__ */ React.createElement(
        "div",
        {
          style: {
            color: "#10b981",
            fontSize: "13px",
            marginBottom: "12px",
            padding: "8px",
            backgroundColor: "#d1fae5",
            borderRadius: "4px"
          }
        },
        saveViewSuccess
      ), /* @__PURE__ */ React.createElement(
        "button",
        {
          style: {
            ...styles.shareLoadButton,
            width: "100%"
          },
          onClick: handleSaveView
        },
        "Save View"
      ), /* @__PURE__ */ React.createElement("div", { style: styles.shareInstructions }, /* @__PURE__ */ React.createElement(
        "p",
        {
          style: {
            margin: "12px 0 0 0",
            fontSize: "12px",
            color: "#6b7280"
          }
        },
        "This will save your current chart configuration to Google Sheets. A new tab will open to complete the save (to bypass CSP/CORS restrictions). You can close the new tab after seeing the success message."
      ))))
    ), showGuide && (() => {
      const step = GUIDE_STEPS[guideStep];
      if (!step) return null;
      const element = document.querySelector(step.targetSelector);
      if (!element) return null;
      const rect = element.getBoundingClientRect();
      return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { style: styles.guideOverlay, onClick: skipGuide }), /* @__PURE__ */ React.createElement(
        "div",
        {
          style: {
            ...styles.guideHighlight,
            top: `${rect.top}px`,
            left: `${rect.left}px`,
            width: `${rect.width}px`,
            height: `${rect.height}px`
          }
        }
      ), /* @__PURE__ */ React.createElement(
        "div",
        {
          style: {
            ...styles.guideTooltip,
            position: "fixed",
            bottom: "200px",
            right: "24px",
            maxWidth: "400px"
          }
        },
        /* @__PURE__ */ React.createElement("div", { style: styles.guideTooltipHeader }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: styles.guideTooltipTitle }, step.title), /* @__PURE__ */ React.createElement("div", { style: styles.guideTooltipStep }, "Step ", guideStep + 1, " of ", GUIDE_STEPS.length)), /* @__PURE__ */ React.createElement("button", { style: styles.guideTooltipClose, onClick: skipGuide }, "\xD7")),
        /* @__PURE__ */ React.createElement("div", { style: styles.guideTooltipDescription }, step.description),
        /* @__PURE__ */ React.createElement("div", { style: styles.guideTooltipButtons }, guideStep > 0 && /* @__PURE__ */ React.createElement(
          "button",
          {
            style: {
              ...styles.guideTooltipButton,
              ...styles.guideTooltipButtonSecondary
            },
            onClick: previousStep
          },
          "\u2190 Previous"
        ), /* @__PURE__ */ React.createElement(
          "button",
          {
            style: {
              ...styles.guideTooltipButton,
              ...styles.guideTooltipButtonSecondary
            },
            onClick: skipGuide
          },
          "Skip"
        ), /* @__PURE__ */ React.createElement(
          "button",
          {
            style: {
              ...styles.guideTooltipButton,
              ...styles.guideTooltipButtonPrimary
            },
            onClick: nextStep
          },
          guideStep < GUIDE_STEPS.length - 1 ? "Next \u2192" : "Finish"
        ))
      ));
    })(), showMetricsEditor && metricsEditorDraft && /* @__PURE__ */ React.createElement(
      MetricsEditorModal,
      {
        draft: metricsEditorDraft,
        onDraftChange: setMetricsEditorDraft,
        onClose: () => setShowMetricsEditor(false),
        onSave: handleMetricsEditorSave,
        suggesting: metricsEditorSuggesting,
        error: metricsEditorError,
        onSuggest: handleMetricsEditorSuggest,
        columns: liveColumnMeta,
        schemaDimensions: liveSchemaClassified.dimensions,
        expandedSlot: expandedMetricSlot,
        onExpandSlot: setExpandedMetricSlot,
        activeDataset: activeTab?.dataset,
        isDarkMode
      }
    ));
  }
  return __toCommonJS(Analyzer_Demo_exports);
})();
