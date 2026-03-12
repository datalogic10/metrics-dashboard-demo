// Theme configuration - Light and Dark color palettes
export const THEME_CONFIG = {
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
    statBoxActiveBorder: "#6366f1",
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
    statBoxActiveBorder: "#818cf8",
  },
};

// Category color palette for chart traces
export const MODERN_COLOR_PALETTE = [
  "#6366f1",
  "#ef4444",
  "#10b981",
  "#f59e0b",
  "#8b5cf6",
  "#06b6d4",
  "#84cc16",
  "#f97316",
  "#ec4899",
  "#6b7280",
];

/**
 * Get color for a category by index.
 * "Rest Combined" always gets gray.
 */
export function getCategoryColor(category, index, fallbackPalette = MODERN_COLOR_PALETTE) {
  if (!category) return fallbackPalette[0];
  if (category === "Rest Combined") return "#9ca3af";
  return fallbackPalette[index % fallbackPalette.length];
}
