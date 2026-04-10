// Static constants extracted from Analyzer_Demo.js.
// No runtime dependencies — pure data.

export const DATE_RANGES = ["7D", "14D", "30D", "90D", "QTD", "YTD", "1Y", "2Y", "5Y", "All"];

export const GUIDE_STEPS = [
  {
    id: "quick-query",
    title: "Quick Query",
    description:
      "Click '🎲 Feeling Lucky' to generate example queries, then click 'Ask' to visualize the data.",
    targetSelector: '[data-guide="quick-query"]',
  },
  {
    id: "metric-statboxes",
    title: "Metric Statboxes",
    description:
      "View key metrics (Volume, Revenue, Margin Rate). Click any metric to filter the chart.",
    targetSelector: '[data-guide="metric-statboxes"]',
  },
  {
    id: "insights-panel",
    title: "Insights Panel",
    description:
      "View automated insights: Solo Insights (single-dimension) and Cross Insights (multi-dimensional patterns).",
    targetSelector: '[data-guide="insights-panel"]',
  },
  {
    id: "view-selector",
    title: "View Selector",
    description:
      "Split the data by selecting a dimension (Product, Product Group, Region, Customer Segment, etc.).",
    targetSelector: '[data-guide="view-selector"]',
  },
  {
    id: "top-x-control",
    title: "Top X Control",
    description:
      "Once the data is split, control which categories of that dimension are shown in the chart. Select Top X categories by total value, or manually pick specific categories to display.",
    targetSelector: '[data-guide="top-x-control"]',
  },
  {
    id: "filter-search",
    title: "Filter Search",
    description:
      "Search and apply filters across all dimensions. Faster than Advanced Filters panel.",
    targetSelector: '[data-guide="filter-search"]',
  },
  {
    id: "reset-button",
    title: "Reset Button",
    description:
      "Clear all active filters and return to default view. Useful when you want to start fresh.",
    targetSelector: '[data-guide="reset-button"]',
  },
  {
    id: "share-link",
    title: "Share Link",
    description:
      "Generate shareable URL that preserves filters, date range, view selection, and settings.",
    targetSelector: '[data-guide="share-link"]',
  },
  {
    id: "advanced-filters",
    title: "Advanced Filters",
    description:
      "Access detailed filtering options via gear icon. Useful for multiple filters.",
    targetSelector: '[data-guide="advanced-filters"]',
  },
  {
    id: "comparison",
    title: "Compare Views",
    description:
      "Add up to 3 views to the compare dock bar, then overlay them on a single chart.",
    targetSelector: '[data-guide="comparison"]',
  },
  {
    id: "undo-button",
    title: "Undo Button",
    description:
      "Revert to previous filter state. Disabled when there's no history.",
    targetSelector: '[data-guide="undo-button"]',
  },
];

export const PRO_TIPS = [
  {
    icon: "📅",
    title: "Weekly Business Review",
    text: 'Switch to Weekly view by changing Date Aggregation → then click "Insights" to analyze week-over-week trends.',
  },
  {
    icon: "📈",
    title: "Split by Dimension",
    text: 'Use "Split By" to see top 3 categories of any dimension. Change to top 5 or custom select using the control in the top-right corner of the chart.',
  },
  {
    icon: "🎲",
    title: "Quick Query",
    text: 'Click "🎲 Feeling Lucky" to generate example queries with the correct pattern, then click "Ask" to visualize the data.',
  },
  {
    icon: "🔗",
    title: "Share Your View",
    text: 'Click the "🔗 Share" button to generate a unique link to your current chart configuration. Anyone with the link sees the exact same view.',
  },
  {
    icon: "📊",
    title: "Compare Views",
    text: 'Use the "📊 Compare" button to add views to a dock bar at the bottom. Compare up to 3 views across different tabs.',
  },
  {
    icon: "🎯",
    title: "Filter Smart",
    text: "Type in the filter search box to quickly find and apply filters. It searches across all dimensions — much faster than scrolling through dropdowns.",
  },
  {
    icon: "💡",
    title: "Insights Panel",
    text: 'Click "✨ Click for Insights" to get auto-generated analysis. Toggle between "Solo Insights" (single dimension) and "Cross Insights" (multi-dimensional).',
  },
  {
    icon: "📉",
    title: "Track Visibility",
    text: "Click on legend items in the chart to show/hide specific traces. Double-click to isolate a single trace. Your visibility preferences persist across changes.",
  },
];
