// Value abbreviation maps for compact state serialization
export const VALUE_ABBREVIATIONS = {
  // Data frequencies
  Weekly: "W",
  Monthly: "Mo",
  Quarterly: "Q",
  Yearly: "Yr",
  // Metrics
  Revenue: "O",
  Volume: "P",
  "Margin Rate": "MR",
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
  manual: "Man",
};

export const REVERSE_ABBREVIATIONS = Object.fromEntries(
  Object.entries(VALUE_ABBREVIATIONS).map(([k, v]) => [v, k])
);

export function base64UrlEncode(str) {
  return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function base64UrlDecode(str) {
  str = str.replace(/-/g, "+").replace(/_/g, "/");
  while (str.length % 4) str += "=";
  return atob(str);
}

// Compress a state snapshot for sharing
export function compressStateHelper(snapshot, dimensionDefs, isNested = false) {
  if (!snapshot) return null;
  const compact = {};

  if (snapshot.dataFrequency !== "Monthly") {
    compact.df = VALUE_ABBREVIATIONS[snapshot.dataFrequency] || snapshot.dataFrequency;
  }
  if (snapshot.metric !== "Revenue") {
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

export function compressState(snapshot, dimensionDefs) {
  return compressStateHelper(snapshot, dimensionDefs, false);
}

// Expand a compressed state back to full snapshot
export function expandStateHelper(compact, dimensionDefs) {
  if (!compact) return null;
  const expandValue = (abbr, defaultValue) => {
    if (abbr === undefined) return defaultValue;
    return REVERSE_ABBREVIATIONS[abbr] || abbr;
  };

  const snapshot = {
    dataFrequency: expandValue(compact.df, "Monthly"),
    metric: expandValue(compact.m, "Revenue"),
    view: expandValue(compact.v, "Overall") || "Overall",
    topX: compact.tx !== undefined ? compact.tx : 3,
    dateRange: expandValue(compact.dr, "YTD"),
    activeInsightsTab: compact.ait || null,
    selectedCategories: compact.sc || [],
    categorySelectionMode: expandValue(compact.csm, "topX"),
    showAllShareTraces: compact.sst !== undefined ? compact.sst === 1 : false,
    showAllGrowthTraces: compact.sgt !== undefined ? compact.sgt === 1 : false,
    showAllDollarTraces: compact.sdt !== undefined ? compact.sdt === 1 : true,
  };

  dimensionDefs.forEach((dim) => { snapshot[dim.filterKey] = []; });
  dimensionDefs.forEach((dim) => {
    if (compact[dim.abbreviation]) snapshot[dim.filterKey] = compact[dim.abbreviation];
  });

  if (compact.vtn !== undefined) snapshot.visibleTraceNames = compact.vtn;
  return snapshot;
}

export function expandState(compact, dimensionDefs) {
  const snapshot = expandStateHelper(compact, dimensionDefs);

  if (compact.s1 !== undefined) snapshot.scenario1 = expandStateHelper(compact.s1, dimensionDefs);
  if (compact.s2 !== undefined) snapshot.scenario2 = expandStateHelper(compact.s2, dimensionDefs);
  if (compact.s3 !== undefined) snapshot.scenario3 = expandStateHelper(compact.s3, dimensionDefs);
  if (compact.as !== undefined) {
    snapshot.activeScenarios = compact.as;
  } else {
    snapshot.activeScenarios = { scenario1: false, scenario2: false, scenario3: false };
  }
  if (compact.sl !== undefined) {
    snapshot.scenarioLabels = compact.sl;
  } else {
    snapshot.scenarioLabels = { scenario1: "Scenario 1", scenario2: "Scenario 2", scenario3: "Scenario 3" };
  }
  if (compact.ssp !== undefined) snapshot.showScenarioPanel = compact.ssp === 1;
  if (compact.tv !== undefined) snapshot.traceVisibility = compact.tv;
  if (compact.ic !== undefined) snapshot.insightContext = compact.ic;

  return snapshot;
}

// Generate a share code from a snapshot
export function generateShareCode(snapshot, dimensionDefs) {
  const compact = compressState(snapshot, dimensionDefs);
  return base64UrlEncode(JSON.stringify(compact));
}

// Decode a share code back to a snapshot
export function decodeShareCode(code, dimensionDefs) {
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
