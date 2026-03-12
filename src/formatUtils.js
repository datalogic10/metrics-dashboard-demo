// Pure formatting and insight sentiment utilities.
// No React dependencies.

/**
 * Format a filter/category name for display.
 * Handles booleans, acronyms (<=5 chars all-caps), snake_case, camelCase → Title Case.
 */
export function formatFilterName(filterName) {
  if (typeof filterName !== "string") {
    if (filterName === true) return "Yes";
    if (filterName === false) return "No";
    return String(filterName);
  }

  const isAllCaps =
    filterName === filterName.toUpperCase() && filterName.length <= 5;
  if (isAllCaps) return filterName;

  return filterName
    .replace(/_/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\b\w/g, (l) => l.toUpperCase())
    .trim();
}

// Keyword lists shared between sentiment detection and text colorization
export const SENTIMENT_KEYWORDS = {
  positive: [
    "surged", "surge", "surging",
    "gained", "gaining", "gains",
    "grew", "growing", "growth",
    "improved", "improving", "improvement",
    "accelerated", "accelerating",
    "climbing", "climbed",
    "increased", "increasing",
    "strengthened", "strengthening",
  ],
  negative: [
    "declined", "declining", "decline",
    "lost", "losing", "loss",
    "fell", "falling", "fallen",
    "dropped", "dropping", "drop",
    "decreased", "decreasing",
    "slowing", "slowed", "slowdown",
    "shrinking", "shrunk",
    "weakened", "weakening",
    "contracted", "contracting",
  ],
  neutral: [
    "shifted", "shifting",
    "fluctuated", "fluctuating",
    "volatile", "volatility",
    "stabilized", "stabilizing",
    "maintained", "maintaining",
  ],
};

/**
 * Determine sentiment of an insight text based on keyword matching.
 * @returns {"positive" | "negative" | "neutral"}
 */
export function getInsightSentiment(insightText) {
  const text = insightText.toLowerCase();
  const hasPositive = SENTIMENT_KEYWORDS.positive.some((kw) => text.includes(kw));
  const hasNegative = SENTIMENT_KEYWORDS.negative.some((kw) => text.includes(kw));
  const hasNeutral = SENTIMENT_KEYWORDS.neutral.some((kw) => text.includes(kw));

  if (hasPositive && !hasNegative) return "positive";
  if (hasNegative && !hasPositive) return "negative";
  if (hasNeutral) return "neutral";
  return "neutral";
}

/**
 * Get text and border colors for a sentiment value.
 * @param {"positive" | "negative" | "neutral"} sentiment
 * @param {boolean} isDarkMode
 * @returns {{ text: string, border: string }}
 */
export function getSentimentColors(sentiment, isDarkMode) {
  const colors = {
    positive: {
      text: isDarkMode ? "#34d399" : "#059669",
      border: isDarkMode ? "#34d399" : "#10b981",
    },
    negative: {
      text: isDarkMode ? "#f87171" : "#dc2626",
      border: isDarkMode ? "#f87171" : "#ef4444",
    },
    neutral: {
      text: isDarkMode ? "#fbbf24" : "#d97706",
      border: isDarkMode ? "#fbbf24" : "#f59e0b",
    },
  };
  return colors[sentiment] || colors.neutral;
}
