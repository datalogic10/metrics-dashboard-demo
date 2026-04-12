// Insights generator — extracted from Analyzer_Demo.js.
//
// `generateStructuredInsights(tabType, ctx)` returns structured Solo/Cross
// insights for the current metric + filter state. The function closes over
// many values in the original component scope; those are passed in via `ctx`
// and destructured at the top, so the body below is character-identical to
// the original.

import logger from './logger.js';
import { calculatePercentageChange, calculateGrowthMetrics } from './metrics.js';

export function generateStructuredInsights(tabType, ctx) {
  const {
    acquisitionChannelFilter,
    activeInsightsTab,
    calculateMetric,
    channelFilter,
    COLUMNS,
    columnExists,
    companySegmentFilter,
    dateField,
    DIMENSION_DEFINITIONS,
    FILTER_CONFIG,
    filterOptionsMap,
    formatFilterName,
    formatMetric,
    formatPeriodDate,
    generateExcessGrowthInsights,
    getFilterContext,
    getFilterSetState,
    getFilterState,
    INSIGHT_LIMITS,
    insightContext,
    isAiCompanyFilter,
    isFormulaMetric,
    liveInsightsDimAggs,
    metric,
    METRIC_LABELS,
    periodAggregates,
    periods,
    pricingTypeFilter,
    productGroupFilter,
    productNameFilter,
    productSubFilter,
    revenueCountryFilter,
    revenueRegionFilter,
    setInsightContext,
    setSelectedCategories,
    setView,
  } = ctx;

  if (periods.length < 3) {
    return {
      basicInsights: {
        decomposition: [], // 🆕 NEW
        overallTrends: [],
        marketLeaders: [],
        performanceAlerts: [],
        categoryTrends: [],
      },
      advancedInsights: {
        allTimeGrowth: [],
      },
      recommendations: [],
    };
  }

  const structuredInsights = {
    basicInsights: {
      decomposition: [], // 🆕 NEW - explains parent's excess growth (shown first)
      overallTrends: [],
      marketLeaders: [],
      performanceAlerts: [],
      categoryTrends: [],
      shareShifts: [],
    },
    advancedInsights: {
      allTimeGrowth: [],
    },
    recommendations: [],
  };

  // Exclude last period (developing data) from insights analysis
  const completePeriods = periods.slice(0, -1);

  // Synthesize one row per period from periodAggregates (no raw rows available)
  let completeFilteredData = [];
  let completeDataByPeriod = {};
  completePeriods.forEach((period) => {
    const agg = periodAggregates[period];
    if (!agg) return;
    // Synthetic row with volume/revenue columns so calculateMetric() works unchanged
    // Include pre-computed metric3 so insights don't re-derive it with the wrong formula
    const syntheticRow = { [dateField]: period, [COLUMNS.METRIC1]: agg.metric1, [COLUMNS.METRIC2]: agg.metric2, __metric3: agg.metric3 };
    completeFilteredData.push(syntheticRow);
    completeDataByPeriod[period] = [syntheticRow];
  });

  // Pre-computation of aggregates per dimension×category×period.
  // - Demo mode: single-pass scan of raw rows
  // - Live mode: built from dimensionAggregates (already server-aggregated)
  const activeDimColumns = DIMENSION_DEFINITIONS
    .filter((dim) => columnExists(COLUMNS[dim.columnKey]))
    .map((dim) => COLUMNS[dim.columnKey]);
  const precomputed = {};
  activeDimColumns.forEach((col) => {
    precomputed[col] = {};
  });

  // Build precomputed from liveInsightsDimAggs (all dimensions, not just the selected one)
  activeDimColumns.forEach((col) => {
    const dimPeriods = liveInsightsDimAggs[col] || {};
    Object.keys(dimPeriods).forEach((period) => {
      if (!completePeriods.includes(period)) return;
      const cats = dimPeriods[period];
      Object.keys(cats).forEach((val) => {
        if (!val || val === 'Unknown') return;
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
  // Compute metric from pre-aggregated volume/revenue (matches calculateMetricValue logic)
  const metricFromAgg = (m1, m2, m3) => {
    switch (metric) {
      case "metric1":
        return m1;
      case "metric2":
        return m2;
      case "metric3":
        // Live mode: use pre-computed metric3 from server when available
        if (m3 !== undefined) return m3;
        return m1 > 0 ? (10000 * m2) / m1 : 0;
      default:
        return m1;
    }
  };

  const totalMarketValue = calculateMetric(completeFilteredData);
  const totalRevShare = completeFilteredData.reduce(
    (sum, row) =>
      sum + (row[COLUMNS.METRIC2] || 0),
    0
  );

  // ============================================================================
  // UNIFIED INSIGHT GENERATION FRAMEWORK
  // ============================================================================

  // Single source of truth for all thresholds
  const dataScale = totalMarketValue;
  const periodCount = completePeriods.length;

  const INSIGHT_THRESHOLDS = {
    // Growth thresholds
    minGrowthThreshold: periodCount >= 6 ? 5 : 8,
    minRelativeGrowthThreshold: 5, // Minimum difference from market to be significant

    // Market share thresholds
    // Lower threshold for larger datasets (more categories), higher for smaller datasets
    minMarketShareThreshold: dataScale > 1000000 ? 5 : 10,
    minRevContributionThreshold: 0.01, // 1% of total revenue

    // Performance alert thresholds
    consecutiveDeclineThreshold: 2,
    suddenDropThreshold: 20, // Percentage

    // Segment size thresholds
    minSegmentSize: Math.max(dataScale * 0.03, totalMarketValue * 0.05),

    // Share shift thresholds
    minShareShiftPoints: 3, // Percentage points
  };

  // Helper function to check if a category should be excluded from insights
  const shouldExcludeCategory = (category) => {
    if (!category) return true;
    const excludedCategories = ["uncategorized", "other", "unknown"];
    return excludedCategories.some(
      (excluded) => category.toLowerCase() === excluded.toLowerCase()
    );
  };

  // 🚀 PERFORMANCE: O(1) lookup replaces O(N) filter+reduce scan per call
  const calculateCategoryRevShare = (columnName, categoryValue) => {
    var dimData = precomputed[columnName];
    var catData = dimData && dimData[categoryValue];
    return (catData && catData.metric2) || 0;
  };

  // Pre-compute common thresholds used across multiple functions
  const minRevThreshold =
    totalRevShare * INSIGHT_THRESHOLDS.minRevContributionThreshold;

  // Unified insight creation helper - ensures consistent structure
  const createInsight = (
    text,
    basePriority,
    category,
    action,
    metadata = {}
  ) => {
    return {
      text,
      priority: basePriority, // Base priority before scoring
      category,
      action: action || (() => setView("Overall")),
      metadata, // Store additional data for scoring adjustments
    };
  };

  // Deduplicate insights by text - removes duplicates that appear across dimensions
  const deduplicateInsightsByText = (insights) => {
    const seenTexts = new Set();
    return insights.filter((insight) => {
      if (seenTexts.has(insight.text)) return false;
      seenTexts.add(insight.text);
      return true;
    });
  };

  // 🆕 NEW: Check if in drill-down mode and generate EXCESS growth insights
  if (insightContext && insightContext.parentCategory) {
    const excessInsights = generateExcessGrowthInsights(insightContext);
    structuredInsights.basicInsights.decomposition = excessInsights.slice(
      0,
      10
    ); // Show up to 10 insights (single dimension)
  }

  // Helper to create standardized metadata for all insights
  const createStandardMetadata = (type, values = {}) => {
    const baseMetadata = {
      insightType: type, // 'global' | 'single-dimension' | 'cross-dimension'
      scope:
        type === "global"
          ? "global"
          : type === "cross-dimension"
          ? "cross-dimensional"
          : "filtered",
    };

    // For single-dimension insights
    if (type === "single-dimension") {
      baseMetadata.dimensionColumn = values.dimensionColumn;
      baseMetadata.viewName = values.viewName;
      baseMetadata.label = values.label;
    }

    // For cross-dimension insights
    if (type === "cross-dimension") {
      baseMetadata.dimensionColumns = values.crossDimensionFields;
      baseMetadata.crossDimensionName = values.crossDimensionName;
    }

    // Add all other values
    Object.keys(values).forEach((key) => {
      if (!baseMetadata.hasOwnProperty(key)) {
        baseMetadata[key] = values[key];
      }
    });

    return baseMetadata;
  };

  // Unified priority calculation - normalizes different metrics to comparable scale
  const calculateBasePriority = (value, type, context = {}) => {
    switch (type) {
      case "growth_percentage":
        // Growth percentages: 0-100 scale, normalize to 0-100 priority
        return Math.abs(value);

      case "share_points":
        // Share point changes: multiply by revenue share if available
        const revShare = context.revShare || 10; // Default to 10% if not provided
        const recencyFactor = context.recencyFactor || 1.0;
        return Math.abs(value) * (revShare / 10) * recencyFactor;

      case "market_share":
        // Market share: 0-100 scale, use directly
        return value;

      case "drop_percentage":
        // Drop percentage: add base score for urgency
        return value + 50;

      case "decline_score":
        // Decline score: consecutive periods * weight + total decline
        return (context.consecutivePeriods || 0) * 20 + (value || 0);

      case "relative_growth":
        // Relative growth: multiply by revenue share for importance
        const revShareForGrowth = context.revShare || 10;
        return Math.abs(value) * (revShareForGrowth / 10);

      default:
        return Math.abs(value) || 0;
    }
  };

  // Performance decline detection using unified framework
  const detectPerformanceAlerts = () => {
    if (completePeriods.length < 3) return [];

    const alerts = [];
    const recentPeriods = completePeriods.slice(-3);

    // Detect consecutive declines
    let consecutiveDeclines = 0;
    let totalDecline = 0;

    for (let i = 1; i < recentPeriods.length; i++) {
      const currentRows = completeDataByPeriod[recentPeriods[i]] || [];
      const prevRows = completeDataByPeriod[recentPeriods[i - 1]] || [];

      const currentValue = calculateMetric(currentRows);
      const prevValue = calculateMetric(prevRows);

      // Use proper percentage change calculation to handle negative values
      const percentChange = calculatePercentageChange(
        currentValue,
        prevValue
      );

      // Negative percent change means a decline
      if (percentChange !== null && percentChange < 0) {
        consecutiveDeclines++;
        totalDecline += Math.abs(percentChange);
      } else {
        break;
      }
    }

    if (
      consecutiveDeclines >= INSIGHT_THRESHOLDS.consecutiveDeclineThreshold
    ) {
      const priority = calculateBasePriority(totalDecline, "decline_score", {
        consecutivePeriods: consecutiveDeclines,
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
            totalDecline,
          })
        )
      );
    }

    // Check for sudden drops
    for (let i = 1; i < completePeriods.length; i++) {
      const currentRows = completeDataByPeriod[completePeriods[i]] || [];
      const prevRows = completeDataByPeriod[completePeriods[i - 1]] || [];

      const currentValue = calculateMetric(currentRows);
      const prevValue = calculateMetric(prevRows);

      // Use proper percentage change calculation to handle negative values
      const percentChange = calculatePercentageChange(
        currentValue,
        prevValue
      );

      if (percentChange !== null) {
        // Negative percent change means a drop; we want the magnitude
        const dropPercent = Math.abs(Math.min(0, percentChange));
        if (dropPercent > INSIGHT_THRESHOLDS.suddenDropThreshold) {
          const priority = calculateBasePriority(
            dropPercent,
            "drop_percentage"
          );
          const formattedPeriod = formatPeriodDate(completePeriods[i]);
          const anomalousPeriod = completePeriods[i];
          const comparisonPeriod = completePeriods[i - 1];

          alerts.push(
            createInsight(
              `Significant ${METRIC_LABELS[metric] || metric} drop of ${dropPercent.toFixed(
                1
              )}% in ${formattedPeriod} (${formatMetric(
                prevValue
              )} → ${formatMetric(currentValue)})`,
              priority,
              "performanceAlerts",
              () => {
                // Set period anomaly context for decomposition
                setInsightContext({
                  type: "period_anomaly",
                  anomalousPeriod: anomalousPeriod,
                  comparisonPeriod: comparisonPeriod,
                  periods: [comparisonPeriod, anomalousPeriod], // Just 2 periods
                  firstValue: prevValue,
                  lastValue: currentValue,
                  parentGrowth: percentChange,
                  parentExcessGrowth: null, // No market comparison for period anomalies
                  marketAvgGrowth: null, // Simple mode
                  parentAbsChange: currentValue - prevValue,
                  parentLabel: `${formattedPeriod} Drop`,
                  drillPath: [],
                });
                setView("Overall");
              },
              createStandardMetadata("global", {
                alertType: "sudden_drop",
                dropPercent,
                period: completePeriods[i],
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

  // Helper function to detect market share shifts for a dimension using unified framework
  const detectShareShiftsForDimension = (
    columnName,
    filterArray,
    optionsArray,
    setFilterFn,
    labelPrefix = "",
    viewName = null
  ) => {
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

    // 🚀 PERFORMANCE: Use precomputed aggregates instead of per-option filter+reduce
    const dimData = precomputed[columnName] || {};
    optionsArray.slice(1).forEach((option) => {
      // Skip excluded categories
      if (shouldExcludeCategory(option)) return;

      const catAgg = dimData[option];
      if (!catAgg) return;

      // Revenue from precomputed (O(1) vs O(N))
      if (catAgg.metric2 < minRevThreshold) return;

      // Period metrics from precomputed (O(1) vs O(N) filter + reduce)
      const firstAgg = catAgg.byPeriod[firstPeriod];
      const lastAgg = catAgg.byPeriod[lastPeriod];
      const firstCatMetric = firstAgg
        ? metricFromAgg(firstAgg.metric1, firstAgg.metric2, firstAgg.metric3)
        : 0;
      const lastCatMetric = lastAgg
        ? metricFromAgg(lastAgg.metric1, lastAgg.metric2, lastAgg.metric3)
        : 0;

      firstPeriodShare[option] =
        firstTotal > 0 ? (firstCatMetric / firstTotal) * 100 : 0;
      lastPeriodShare[option] =
        lastTotal > 0 ? (lastCatMetric / lastTotal) * 100 : 0;
    });

    Object.keys(firstPeriodShare).forEach((option) => {
      const shareChange = lastPeriodShare[option] - firstPeriodShare[option];

      // Use unified threshold
      if (Math.abs(shareChange) > INSIGHT_THRESHOLDS.minShareShiftPoints) {
        const direction = shareChange > 0 ? "gained" : "lost";

        // Calculate revenue share for priority scoring - use helper
        const categoryRev = calculateCategoryRevShare(columnName, option);
        const revShare = (categoryRev / totalRevShare) * 100;

        // Calculate recency: more recent shifts are more important
        const periodCount = completePeriods.length;
        const recencyFactor =
          periodCount <= 6 ? 1.2 : periodCount <= 12 ? 1.0 : 0.8;

        // Use unified priority calculation
        const priority = calculateBasePriority(shareChange, "share_points", {
          revShare,
          recencyFactor,
        });

        insights.push(
          createInsight(
            `${labelPrefix}${formatFilterName(
              option
            )} ${direction} ${Math.abs(shareChange).toFixed(
              1
            )} percentage points of market share (${firstPeriodShare[
              option
            ].toFixed(1)}% → ${lastPeriodShare[option].toFixed(1)}%)`,
            priority,
            "shareShifts",
            () => {
              // Set the view to the dimension view (not Default) and select the category
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
              viewName: viewName,
              label: labelPrefix || viewName,
            })
          )
        );
      }
    });

    return insights;
  };

  // Market share shift analysis
  // Note: For Margin Rate, market share shifts don't make mathematical sense
  // (can't calculate "share" of a ratio). Disabled for Margin Rate metric.
  // detectMarketShareShifts - derived from DIMENSION_DEFINITIONS (DRY)
  const detectMarketShareShifts = () => {
    if (completePeriods.length < 2) return [];

    // Market share shifts don't make sense for formula (ratio/derived) metrics
    if (isFormulaMetric(metric)) return [];

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

  // Comprehensive insight scoring system
  // Prioritizes insights that are most actionable and important for users
  const scoreInsight = (insight, category) => {
    let score = insight.priority || 0;

    // Category multipliers: Different insight types have different base importance
    const categoryMultipliers = {
      performanceAlerts: 1.5, // Critical alerts (declines, drops) - highest priority
      categoryTrends: 1.4, // Individual category trends (filtered by revenue share) - high priority
      overallTrends: 1.2, // Overall market trends - moderate priority
      marketLeaders: 1.0, // Market leader identification - baseline
      shareShifts: 1.1, // Market share shifts - slightly above baseline
      allTimeGrowth: 1.0, // Cross-dimensional growth insights - baseline
    };

    score *= categoryMultipliers[category] || 1.0;

    // Recency boost: Recent trends are more actionable
    if (insight.text.includes("recent") || insight.text.includes("last")) {
      score *= 1.2;
    }

    // Relative performance boost: Insights showing relative to market are more valuable
    if (
      insight.text.includes("above avg.") ||
      insight.text.includes("below avg.")
    ) {
      score *= 1.3;
    }

    // Magnitude boost: Larger changes are more significant
    const magnitudeMatch = insight.text.match(/(\d+\.?\d*)%/);
    if (magnitudeMatch) {
      const magnitude = parseFloat(magnitudeMatch[1]);
      if (magnitude >= 30) {
        score *= 1.3; // Very large changes
      } else if (magnitude >= 20) {
        score *= 1.2; // Large changes
      } else if (magnitude >= 15) {
        score *= 1.1; // Moderate-large changes
      }
    }

    // Alert severity boost: Declines and drops are more urgent
    if (
      insight.text.includes("declined") ||
      insight.text.includes("declining") ||
      insight.text.includes("drop") ||
      insight.text.includes("decreased")
    ) {
      score *= 1.15; // Negative trends need attention
    }

    // Surge boost: Strong positive performance is also important
    if (insight.text.includes("surged") || insight.text.includes("surge")) {
      score *= 1.1; // Strong positive trends
    }

    // Consistency boost: Multiple periods of consistent trend
    if (
      insight.text.includes("consecutive") ||
      insight.text.includes("consistent")
    ) {
      score *= 1.1;
    }

    return score;
  };

  // Comprehensive insight filtering
  // Removes insights that are not relevant or useful given current filters
  const filterInsights = (insights) => {
    return insights.filter((insight) => {
      // 🆕 NEVER filter decomposition insights - they're specifically about explaining filtered context
      if (insight.category === "decomposition") {
        return true;
      }

      // Context-aware change threshold filtering
      // Different insight categories have different significance thresholds
      const changeMatch = insight.text.match(/(\d+\.?\d*)%/);
      if (changeMatch) {
        const changeValue = parseFloat(changeMatch[1]);
        const category = insight.category;

        // Apply category-specific thresholds
        if (category === "shareShifts") {
          // Share shifts use percentage points, not percentages
          // Already filtered by minShareShiftPoints (3 points) during generation
          // No additional filtering needed here
        } else if (
          category === "categoryTrends" ||
          category === "allTimeGrowth"
        ) {
          // Growth insights - use minGrowthThreshold
          if (changeValue < INSIGHT_THRESHOLDS.minGrowthThreshold)
            return false;
        } else if (category === "marketLeaders") {
          // Market share insights - use minMarketShareThreshold
          if (changeValue < INSIGHT_THRESHOLDS.minMarketShareThreshold)
            return false;
        } else {
          // Default threshold for other categories
          if (changeValue < 5) return false;
        }
      }

      // Skip if insight is about a currently filtered dimension
      // (DRY: Use FILTER_CONFIG to check all filters)
      const insightTextLower = insight.text.toLowerCase();
      for (const { state, formatValue } of FILTER_CONFIG) {
        if (state.length > 0) {
          // Check if insight mentions any of the active filter values
          const matchesFilter = state.some((filterValue) => {
            const filterName = formatValue
              ? formatValue(filterValue)
              : formatFilterName(filterValue);
            return (
              insightTextLower.includes(filterName.toLowerCase()) ||
              insightTextLower.includes(String(filterValue).toLowerCase())
            );
          });
          if (matchesFilter) return false;
        }
      }

      return true;
    });
  };

  // Basic overall trend analysis using complete periods only
  const firstPeriodRows = completeDataByPeriod[completePeriods[0]] || [];
  const lastPeriodRows =
    completeDataByPeriod[completePeriods[completePeriods.length - 1]] || [];

  const firstValue = calculateMetric(firstPeriodRows);
  const lastValue = calculateMetric(lastPeriodRows);

  if (firstValue !== 0 && firstValue !== null) {
    const {
      growthRate: totalGrowth,
      direction,
      absoluteGrowth,
    } = calculateGrowthMetrics(lastValue, firstValue);
    const contextualDescription = getFilterContext();
    const priority = calculateBasePriority(totalGrowth, "growth_percentage");

    structuredInsights.basicInsights.overallTrends.push(
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
          direction,
        })
      )
    );
  }

  // Helper function to analyze market leaders for a dimension using unified framework
  const analyzeMarketLeader = (
    columnName,
    filterArray,
    dimensionLabel,
    viewName,
    textPrefix = "dominates"
  ) => {
    if (filterArray.length > 0 || totalMarketValue === 0) return;

    const analysis = {};

    // 🚀 PERFORMANCE: Use precomputed aggregates instead of full data grouping + metric calc
    const dimData = precomputed[columnName] || {};
    Object.keys(dimData).forEach((value) => {
      if (value === "Unknown" || shouldExcludeCategory(value)) return;
      const cat = dimData[value];
      analysis[value] = metricFromAgg(cat.metric1, cat.metric2);
    });

    const sorted = Object.entries(analysis).sort((a, b) => b[1] - a[1]);
    if (sorted.length === 0) return;

    const [topValue, topMetricValue] = sorted[0];

    // Calculate market share and display value
    let marketShare, displayValue;
    if (isFormulaMetric(metric)) {
      // 🚀 PERFORMANCE: Use precomputed aggregates instead of row-level reduce
      const catData = dimData[topValue];
      displayValue = topMetricValue;
      marketShare =
        totalRevShare > 0 ? (catData.metric2 / totalRevShare) * 100 : 0;
    } else {
      marketShare = (topMetricValue / totalMarketValue) * 100;
      displayValue = topMetricValue;
    }

    // Use unified threshold
    const minThreshold = INSIGHT_THRESHOLDS.minMarketShareThreshold;
    const isNear100Percent = marketShare >= 99.5;

    if (
      (isFormulaMetric(metric) || marketShare > minThreshold) &&
      !isNear100Percent
    ) {
      const shareText =
        isFormulaMetric(metric)
          ? formatMetric(displayValue)
          : `${marketShare.toFixed(1)}% share (${formatMetric(
              displayValue
            )})`;

      const priority = calculateBasePriority(marketShare, "market_share");

      structuredInsights.basicInsights.marketLeaders.push(
        createInsight(
          `${formatFilterName(
            topValue
          )} ${textPrefix} ${dimensionLabel} with ${shareText}`,
          priority,
          "marketLeaders",
          () => {
            // Set the view to the dimension view and select the category
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
            label: dimensionLabel,
          })
        )
      );
    }
  };

  // Market leaders analysis using complete data only - derived from DIMENSION_DEFINITIONS (DRY)
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

    // Deduplicate and limit market leaders
    structuredInsights.basicInsights.marketLeaders =
      deduplicateInsightsByText(
        structuredInsights.basicInsights.marketLeaders
      ).slice(0, INSIGHT_LIMITS.generation.marketLeaders);
  }

  // Cross-dimensional insights using complete periods only
  // Only generate when advanced (Cross) tab is active for better performance
  if (tabType === "advanced" && completePeriods.length >= 2) {
    // Calculate overall market growth rate for comparison (reuse already calculated values)
    // Note: firstValue and lastValue are calculated earlier in this function
    const { growthRate: overallMarketGrowthRate } =
      firstValue && firstValue !== 0 && firstValue !== null
        ? calculateGrowthMetrics(lastValue, firstValue)
        : { growthRate: 0 };

    const crossDimensionalCombos = [
      {
        fields: [COLUMNS.PRODUCT_NAME, COLUMNS.REGION],
        name: "Product × Region",
        filters: [productNameFilter, revenueRegionFilter],
        setters: [setProductNameFilter, setRevenueRegionFilter],
      },
      {
        fields: [COLUMNS.PRODUCT_NAME, COLUMNS.CUSTOMER_SEGMENT],
        name: "Product × Segment",
        filters: [productNameFilter, companySegmentFilter],
        setters: [setProductNameFilter, setCompanySegmentFilter],
      },
      {
        fields: [COLUMNS.PRODUCT_NAME, COLUMNS.ACQUISITION_CHANNEL],
        name: "Product × Acquisition Channel",
        filters: [productNameFilter, acquisitionChannelFilter],
        setters: [setProductNameFilter, setAcquisitionChannelFilter],
      },
      {
        fields: [COLUMNS.PRODUCT_GROUP_L1, COLUMNS.REGION],
        name: "Product Group × Region",
        filters: [productGroupFilter, revenueRegionFilter],
        setters: [setProductGroupFilter, setRevenueRegionFilter],
      },
      {
        fields: [COLUMNS.PRODUCT_GROUP_L1, COLUMNS.CUSTOMER_SEGMENT],
        name: "Product Group × Segment",
        filters: [productGroupFilter, companySegmentFilter],
        setters: [setProductGroupFilter, setCompanySegmentFilter],
      },
      {
        fields: [COLUMNS.REGION, COLUMNS.CUSTOMER_SEGMENT],
        name: "Region × Segment",
        filters: [revenueRegionFilter, companySegmentFilter],
        setters: [setRevenueRegionFilter, setCompanySegmentFilter],
      },
      {
        fields: [COLUMNS.CHANNEL, COLUMNS.CUSTOMER_SEGMENT],
        name: "Channel × Segment",
        filters: [channelFilter, companySegmentFilter],
        setters: [setChannelFilter, setCompanySegmentFilter],
      },
      {
        fields: [COLUMNS.CHANNEL, COLUMNS.REGION],
        name: "Channel × Region",
        filters: [channelFilter, revenueRegionFilter],
        setters: [setChannelFilter, setRevenueRegionFilter],
      },
      {
        fields: [COLUMNS.CUSTOMER_TYPE, COLUMNS.REGION],
        name: "Customer Type × Region",
        filters: [isAiCompanyFilter, revenueRegionFilter],
        setters: [setIsAiCompanyFilter, setRevenueRegionFilter],
      },
      {
        fields: [COLUMNS.CUSTOMER_TYPE, COLUMNS.CUSTOMER_SEGMENT],
        name: "Customer Type × Segment",
        filters: [isAiCompanyFilter, companySegmentFilter],
        setters: [setIsAiCompanyFilter, setCompanySegmentFilter],
      },
      {
        fields: [COLUMNS.ACQUISITION_CHANNEL, COLUMNS.REGION],
        name: "Acquisition Channel × Region",
        filters: [acquisitionChannelFilter, revenueRegionFilter],
        setters: [setAcquisitionChannelFilter, setRevenueRegionFilter],
      },
    ];

    // Cross-dimensional combos require raw rows (multi-column grouping) — not available in aggregated mode
    // Dead code: crossDimensionalCombos is defined but never iterated
    if (false) crossDimensionalCombos.forEach((combo) => {
      const hasVariation = combo.filters.some(
        (filter) => Array.isArray(filter) && filter.length === 0
      );

      if (hasVariation) {
        const segmentAnalysis = {};

        completeFilteredData.forEach((row) => {
          const values = combo.fields.map((field) => row[field]);
          // Skip if any value is missing, Unknown, or excluded category
          if (
            values.every(
              (val) => val && val !== "Unknown" && !shouldExcludeCategory(val)
            )
          ) {
            const segmentKey = values.join(" + ");
            if (!segmentAnalysis[segmentKey]) {
              segmentAnalysis[segmentKey] = [];
            }
            segmentAnalysis[segmentKey].push(row);
          }
        });

        const segmentGrowthRates = Object.entries(segmentAnalysis)
          .map(([segmentKey, rows]) => {
            const totalValue = calculateMetric(rows);
            if (totalValue < INSIGHT_THRESHOLDS.minSegmentSize) return null;

            const firstPeriodSegmentRows = rows.filter(
              (row) => row[dateField] === completePeriods[0]
            );
            const lastPeriodSegmentRows = rows.filter(
              (row) =>
                row[dateField] === completePeriods[completePeriods.length - 1]
            );

            const firstSegmentValue = calculateMetric(firstPeriodSegmentRows);
            const lastSegmentValue = calculateMetric(lastPeriodSegmentRows);

            if (firstSegmentValue === 0 || firstSegmentValue === null)
              return null;

            const { growthRate, relativeGrowth, direction, absoluteGrowth } =
              calculateGrowthMetrics(
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
              combo,
            };
          })
          .filter(
            (item) =>
              item &&
              Math.abs(item.relativeGrowth) >=
                INSIGHT_THRESHOLDS.minRelativeGrowthThreshold &&
              item.absoluteGrowth > INSIGHT_THRESHOLDS.minGrowthThreshold
          )
          .sort(
            (a, b) => Math.abs(b.relativeGrowth) - Math.abs(a.relativeGrowth)
          );

        segmentGrowthRates
          .slice(0, INSIGHT_LIMITS.generation.allTimeGrowth)
          .forEach((item) => {
            const formattedSegment = item.originalValues.join(" x ");

            const relativeText =
              item.relativeGrowth > 0
                ? ` (${item.relativeGrowth.toFixed(
                    1
                  )} percentage points above avg.)`
                : ` (${Math.abs(item.relativeGrowth).toFixed(
                    1
                  )} percentage points below avg.)`;

            const priority = calculateBasePriority(
              item.relativeGrowth,
              "relative_growth"
            );

            structuredInsights.advancedInsights.allTimeGrowth.push(
              createInsight(
                `${METRIC_LABELS[metric] || metric} from ${formattedSegment} users ${
                  item.direction
                } ${item.absoluteGrowth.toFixed(1)}% from ${formatMetric(
                  item.firstValue
                )} to ${formatMetric(item.lastValue)}${relativeText}`,
                priority,
                "allTimeGrowth",
                () => {
                  item.combo.setters.forEach((setter, index) => {
                    if (
                      Array.isArray(item.combo.filters[index]) &&
                      item.combo.filters[index].length === 0
                    ) {
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
                  crossDimensionName: item.combo.name,
                })
              )
            );
          });
      }
    });
  }

  // Detect individual category trends using unified framework
  const detectCategoryTrends = () => {
    if (completePeriods.length < 3) return [];

    const insights = [];

    // Calculate overall market growth rate for recent periods
    // Use last 7 periods (6-month window) so growth rates are large enough to surface
    const recentPeriods = completePeriods.slice(-7);
    if (recentPeriods.length < 3) return [];

    const marketFirstPeriodRows =
      completeDataByPeriod[recentPeriods[0]] || [];
    const marketLastPeriodRows =
      completeDataByPeriod[recentPeriods[recentPeriods.length - 1]] || [];
    const marketFirstValue = calculateMetric(marketFirstPeriodRows);
    const marketLastValue = calculateMetric(marketLastPeriodRows);

    if (marketFirstValue === 0 || marketFirstValue === null) return [];

    const { growthRate: overallMarketGrowthRate } = calculateGrowthMetrics(
      marketLastValue,
      marketFirstValue
    );

    // Get all dimensions to analyze - derived from DIMENSION_DEFINITIONS (DRY)
    const dimensionsToAnalyze = DIMENSION_DEFINITIONS.filter((dim) =>
      columnExists(COLUMNS[dim.columnKey])
    ).map((dim) => ({
      column: COLUMNS[dim.columnKey],
      filter: getFilterState(dim.filterKey),
      setFilter: getFilterSetState(dim.filterKey),
      viewName: dim.viewName,
      label: dim.insightLabel,
    }));

    dimensionsToAnalyze.forEach(
      ({ column, filter, setFilter, viewName, label }) => {
        if (filter.length > 0) return;

        // 🚀 PERFORMANCE: Use precomputed aggregates instead of full data grouping + filtering
        const dimData = precomputed[column] || {};

        // Calculate parent range ONCE per dimension (not per category)
        const parentPeriodValues = recentPeriods
          .map((period) => {
            const periodRows = completeDataByPeriod[period] || [];
            return calculateMetric(periodRows);
          })
          .filter((v) => v != null && !isNaN(v));

        const parentMax =
          parentPeriodValues.length > 0 ? Math.max(...parentPeriodValues) : 0;
        const parentMin =
          parentPeriodValues.length > 0 ? Math.min(...parentPeriodValues) : 0;
        const parentRange = parentMax - parentMin;

        Object.keys(dimData).forEach((categoryValue) => {
          if (
            categoryValue === "Unknown" ||
            shouldExcludeCategory(categoryValue)
          )
            return;

          const catAgg = dimData[categoryValue];

          // Revenue from precomputed (O(1) vs O(N) filter+reduce)
          const categoryRev = catAgg.metric2;
          if (categoryRev < minRevThreshold) return;

          // Period metrics from precomputed (O(1) vs O(N) filter + calculateMetric)
          const firstPeriodAgg = catAgg.byPeriod[recentPeriods[0]];
          const lastPeriodAgg =
            catAgg.byPeriod[recentPeriods[recentPeriods.length - 1]];

          const categoryFirstValue = firstPeriodAgg
            ? metricFromAgg(firstPeriodAgg.metric1, firstPeriodAgg.metric2, firstPeriodAgg.metric3)
            : 0;
          const categoryLastValue = lastPeriodAgg
            ? metricFromAgg(lastPeriodAgg.metric1, lastPeriodAgg.metric2, lastPeriodAgg.metric3)
            : 0;

          if (categoryFirstValue === 0 || categoryFirstValue === null) return;

          const {
            growthRate: categoryGrowthRate,
            relativeGrowth,
            direction,
            absoluteGrowth,
          } = calculateGrowthMetrics(
            categoryLastValue,
            categoryFirstValue,
            overallMarketGrowthRate
          );

          // Use unified thresholds
          if (
            Math.abs(relativeGrowth) <
            INSIGHT_THRESHOLDS.minRelativeGrowthThreshold
          )
            return;
          if (absoluteGrowth < INSIGHT_THRESHOLDS.minGrowthThreshold) return;

          const relativeText =
            relativeGrowth > 0
              ? ` (${relativeGrowth.toFixed(1)} percentage points above avg.)`
              : ` (${Math.abs(relativeGrowth).toFixed(
                  1
                )} percentage points below avg.)`;

          const revShare = (categoryRev / totalRevShare) * 100;

          // 🆕 Simplified scoring: contextualize impact against parent scale
          const absChange = Math.abs(categoryLastValue - categoryFirstValue);

          // Component 1: Normalized impact (60% weight) - using pre-calculated parentRange
          // How big is this change vs parent's total variation?
          const normalizedImpact =
            parentRange > 0 ? (absChange / parentRange) * 100 : absChange;

          // Component 2: Excess vs market (25% weight)
          const excessScore = Math.abs(relativeGrowth) * (revShare / 10);

          // Component 3: Percentage severity (15% weight)
          const severityScore = Math.abs(absoluteGrowth);

          // Component 4: Urgency multiplier (declines are more urgent)
          const urgencyMultiplier = absoluteGrowth < 0 ? 1.5 : 1.0;

          // Simple weighted sum: 60:25:15 ratio
          const priority =
            (normalizedImpact * 0.6 +
              excessScore * 0.25 +
              severityScore * 0.15) *
            urgencyMultiplier;

          insights.push(
            createInsight(
              `${formatFilterName(
                categoryValue
              )} ${METRIC_LABELS[metric] || metric} ${direction} ${absoluteGrowth.toFixed(
                1
              )}% in recent periods (${formatMetric(
                categoryFirstValue
              )} → ${formatMetric(categoryLastValue)})${relativeText}`,
              priority,
              "categoryTrends",
              () => {
                // 🆕 Store insight context with excess growth for drill-down
                const categoryAbsChange =
                  categoryLastValue - categoryFirstValue;
                const categoryExcessGrowth =
                  categoryGrowthRate - overallMarketGrowthRate;

                setInsightContext((prevContext) => {
                  const newContext = {
                    parentCategory: categoryValue,
                    parentLabel: formatFilterName(categoryValue),
                    parentGrowth: categoryGrowthRate,
                    parentExcessGrowth: categoryExcessGrowth,
                    marketAvgGrowth: overallMarketGrowthRate,
                    parentAbsChange: categoryAbsChange,
                    periods: recentPeriods,
                    firstValue: categoryFirstValue,
                    lastValue: categoryLastValue,
                    drillPath:
                      prevContext && prevContext.parentCategory
                        ? [
                            ...((prevContext && prevContext.drillPath) || []),
                            {
                              category: prevContext.parentCategory,
                              label: prevContext.parentLabel,
                              growth: prevContext.parentGrowth,
                              excessGrowth: prevContext.parentExcessGrowth,
                            },
                          ]
                        : [],
                  };
                  logger.log("Setting insightContext:", newContext);
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
                label,
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

  // Execute all analysis functions - MOVED TO END AFTER ALL FUNCTIONS ARE DEFINED
  structuredInsights.basicInsights.performanceAlerts = filterInsights(
    detectPerformanceAlerts()
  );
  structuredInsights.basicInsights.categoryTrends = filterInsights(
    detectCategoryTrends()
  );
  structuredInsights.basicInsights.shareShifts = filterInsights(
    detectMarketShareShifts()
  );

  // Apply filterInsights and deduplication to previously unfiltered categories
  structuredInsights.basicInsights.overallTrends = deduplicateInsightsByText(
    filterInsights(structuredInsights.basicInsights.overallTrends)
  );
  structuredInsights.basicInsights.marketLeaders = deduplicateInsightsByText(
    filterInsights(structuredInsights.basicInsights.marketLeaders)
  );

  // Only filter and score advanced insights when advanced tab is active
  if (tabType === "advanced") {
    structuredInsights.advancedInsights.allTimeGrowth =
      deduplicateInsightsByText(
        filterInsights(structuredInsights.advancedInsights.allTimeGrowth)
      );
  }

  // Apply scoring and generate recommendations
  Object.keys(structuredInsights.basicInsights).forEach((category) => {
    structuredInsights.basicInsights[category] =
      structuredInsights.basicInsights[category]
        .map((insight) => ({
          ...insight,
          score: scoreInsight(insight, category),
        }))
        .sort((a, b) => b.score - a.score);
  });

  // Only score advanced insights when advanced tab is active
  if (tabType === "advanced") {
    Object.keys(structuredInsights.advancedInsights).forEach((category) => {
      structuredInsights.advancedInsights[category] =
        structuredInsights.advancedInsights[category]
          .map((insight) => ({
            ...insight,
            score: scoreInsight(insight, category),
          }))
          .sort((a, b) => b.score - a.score);
    });
  }

  return structuredInsights;

}
