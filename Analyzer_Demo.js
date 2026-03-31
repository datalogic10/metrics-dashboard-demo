import { THEME_CONFIG, MODERN_COLOR_PALETTE, getCategoryColor } from './src/theme.js';
import { generateSyntheticData, DEMO_COLUMNS, DEMO_DIMENSION_DEFINITIONS } from './src/syntheticData.js';
import {
  DEFAULT_METRIC_CONFIGS, parseUrlRoute, parseStateParam,
  createRpcCaller, createQueryCache,
  classifySchema, detectDateColumn, buildLiveColumns, buildLiveDimensions,
  buildRpcMetrics, transformToPeriodAggregates, transformToDimensionAggregates,
  frequencyToGrain, LLM_WORKER_URL,
} from './src/liveConnection.js';
import {
  fetchConfig, createConfig, updateConfig, isCreator, getEditSecret, setEditSecret,
} from './src/configDb.js';
import {
  compressState as compressStateUtil,
  generateShareCode as generateShareCodeUtil,
  decodeShareCode as decodeShareCodeUtil,
} from './src/shareCode.js';
import {
  calculatePercentageChange as calculatePercentageChangeUtil,
  calculateGrowthMetrics as calculateGrowthMetricsUtil,
  formatPeriodDate as formatPeriodDateUtil,
  formatYoYValue as formatYoYValueUtil,
  capYoYForDisplay as capYoYForDisplayUtil,
  getDimAggMetric,
  getCategoriesFromAggregates,
  calculateYoYDataArray as calculateYoYDataArrayUtil,
  OVERLAY_CONFIG,
  calculatePeriodChange,
  calculateSMA,
  forecastLinear,
  forecastHoltWinters,
  generateFuturePeriods,
  detectSeasonalPeriod,
  hexToRgba,
} from './src/metrics.js';
import {
  formatFilterName as formatFilterNameUtil,
  getInsightSentiment as getInsightSentimentUtil,
  getSentimentColors as getSentimentColorsUtil,
  SENTIMENT_KEYWORDS,
} from './src/formatUtils.js';
import { InsightContextBanner } from './src/components/InsightContextBanner.js';
import { MetricsEditorModal } from './src/components/MetricsEditorModal.js';
import { StatBox } from './src/components/StatBox.js';
import {
  buildPeriodAggregates as buildPeriodAggregatesUtil,
  buildDimensionAggregates as buildDimensionAggregatesUtil,
} from './src/aggregation.js';

export function render() {

  // Theme state
  const [isDarkMode, setIsDarkMode] = React.useState(false);
  const theme = isDarkMode ? THEME_CONFIG.dark : THEME_CONFIG.light;

  // Data Summary collapse state (declared early — used in STATIC_STYLES below)
  const [showDataSummary, setShowDataSummary] = React.useState(false);

  const DATE_RANGES = ["7D", "30D", "QTD", "YTD", "1Y", "All"];

  // Static styles for performance (Optimization #3)
  // Memoized: only recomputes when theme/isDarkMode/showDataSummary changes
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
          transition: "all 0.15s ease",
        },
        input: {
          padding: "6px 10px",
          border: `1px solid ${theme.borderSecondary}`,
          borderRadius: "6px",
          fontSize: "12px",
          color: theme.textSecondary,
          backgroundColor: theme.bgPrimary,
          transition: "all 0.15s ease",
        },
        flexRow: { display: "flex", alignItems: "center", gap: "8px" },
        flexCol: { display: "flex", flexDirection: "column" },
        card: {
          backgroundColor: theme.bgPrimary,
          borderRadius: "8px",
          border: "none",
          boxShadow: isDarkMode
            ? "0 1px 3px rgba(0, 0, 0, 0.3)"
            : "0 1px 2px rgba(0, 0, 0, 0.05)",
        },
      },
      buttonGroup: {
        display: "flex",
        gap: "4px",
        backgroundColor: theme.bgQuaternary,
        padding: "4px",
        borderRadius: "8px",
        border: `1px solid ${theme.borderSecondary}`,
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
        transition: "all 0.15s ease",
      },
      buttonGroupBtnActive: {
        backgroundColor: theme.accentPrimary,
        color: "white",
      },
      topSection: {
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        marginBottom: "12px",
      },
      statBoxContainer: {
        display: "flex",
        gap: "12px",
        flexWrap: "nowrap",
        width: "100%",
      },
      controlsHeader: {
        display: "flex",
        alignItems: "center",
        padding: "14px 18px",
        backgroundColor: "transparent",
        borderBottom: `1px solid ${
          isDarkMode ? "rgba(148, 163, 184, 0.1)" : "rgba(229, 231, 235, 0.5)"
        }`,
        gap: "16px",
        flexWrap: "wrap",
      },
      controlsHeaderTitle: {
        fontSize: "14px",
        fontWeight: "700",
        color: theme.textPrimary,
        display: "flex",
        alignItems: "center",
        gap: "8px",
      },
      controlsHeaderChevron: { fontSize: "12px", color: theme.textTertiary },
      controlsContent: { padding: "18px", overflowY: "visible" },
      controlsRow: {
        display: "flex",
        flexWrap: "wrap",
        gap: "20px",
        alignItems: "end",
      },
      controlGroup: {
        display: "flex",
        flexDirection: "column",
        minWidth: "140px",
        flex: "1 1 auto",
      },
      controlGroupCompact: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: "8px",
        flex: "1 1 auto",
      },
      label: {
        fontSize: "13px",
        fontWeight: "normal",
        color: theme.textPrimary,
        marginBottom: "6px",
      },
      labelCompact: {
        fontSize: "12px",
        fontWeight: "500",
        color: theme.textSecondary,
        marginBottom: "0",
        marginRight: "4px",
        whiteSpace: "nowrap",
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
        cursor: "pointer",
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
        transition: "all 0.15s ease",
      },
      filterSuggestionItem: {
        display: "flex",
        alignItems: "center",
        padding: "8px 12px",
        cursor: "pointer",
        borderBottom: `1px solid ${theme.bgQuaternary}`,
      },
      filterSuggestionName: {
        fontSize: "13px",
        color: theme.textPrimary,
        fontWeight: "500",
        cursor: "pointer",
        userSelect: "none",
      },
      filterGroupHeader: {
        padding: "8px 12px",
        backgroundColor: theme.bgTertiary,
        fontSize: "11px",
        color: theme.textTertiary,
        fontWeight: "600",
        textTransform: "uppercase",
        letterSpacing: "0.05em",
        borderBottom: `1px solid ${theme.borderPrimary}`,
      },
      mainContent: {
        display: "flex",
        gap: "12px",
        alignItems: "flex-start",
        position: "relative",
      },
      leftPanel: {
        display: "flex",
        flexDirection: "column",
        minWidth: "300px",
        maxWidth: "350px",
      },
      statBoxLeft: {
        display: "flex",
        flexDirection: "column",
        flex: "1 1 0",
        position: "relative",
        zIndex: 1,
      },
      statBoxRight: {
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        justifyContent: "flex-start",
        gap: "12px",
        minWidth: "130px",
        position: "relative",
        zIndex: 1,
      },
      statBoxActive: {
        border: "none",
        backgroundColor: isDarkMode
          ? "rgba(129, 140, 248, 0.15)"
          : theme.statBoxActiveBg,
        transform: "translateY(-2px)",
        boxShadow: isDarkMode
          ? `0 4px 16px rgba(129, 140, 248, 0.4), 0 0 0 1px rgba(129, 140, 248, 0.5)`
          : `0 4px 12px rgba(99, 102, 241, 0.2), 0 0 0 1px ${theme.accentPrimary}`,
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
        gap: "6px",
      },
      statValue: {
        fontSize: "28px",
        fontWeight: "800",
        color: theme.textPrimary,
        lineHeight: "1.1",
        marginBottom: "10px",
        letterSpacing: "-0.02em",
      },
      statPeriod: {
        fontSize: "11px",
        color: theme.textQuaternary,
        marginBottom: "0",
        fontWeight: "500",
        display: "flex",
        alignItems: "center",
        gap: "4px",
      },
      changeContainer: {
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        gap: "6px",
        marginBottom: "0",
        paddingLeft: "12px",
        borderLeft: `2px solid ${theme.bgQuaternary}`,
      },
      changeValue: {
        fontSize: "15px",
        fontWeight: "700",
        display: "flex",
        alignItems: "center",
        gap: "4px",
      },
      changePercent: {
        fontSize: "11px",
        fontWeight: "600",
        padding: "4px 10px",
        borderRadius: "16px",
        display: "inline-block",
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
        color: theme.textSecondary,
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
        zIndex: 10000,
      },
      shareModalContent: {
        backgroundColor: theme.bgPrimary,
        borderRadius: "8px",
        padding: "24px",
        maxWidth: "500px",
        width: "90%",
        boxShadow:
          "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      },
      shareModalHeader: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: "20px",
      },
      shareModalTitle: {
        fontSize: "20px",
        fontWeight: "600",
        color: theme.textPrimary,
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
        borderRadius: "4px",
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
        color: theme.textSecondary,
      },
      shareCopyButton: {
        padding: "10px 20px",
        backgroundColor: theme.accentPrimary,
        color: "white",
        fontSize: "14px",
        border: "none",
        borderRadius: "6px",
        fontWeight: "500",
        cursor: "pointer",
      },
      shareInstructions: {
        fontSize: "14px",
        color: theme.textTertiary,
        lineHeight: "1.5",
      },
      shareCodeSection: { marginBottom: "24px" },
      shareCodeLabel: {
        fontSize: "12px",
        fontWeight: "500",
        color: theme.textTertiary,
        marginBottom: "8px",
        display: "block",
      },
      pasteCodeSection: {
        marginTop: "24px",
        paddingTop: "24px",
        borderTop: `1px solid ${theme.borderPrimary}`,
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
        marginBottom: "8px",
      },
      pasteCodeError: {
        fontSize: "12px",
        color: theme.dangerText,
        marginBottom: "8px",
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
        cursor: "pointer",
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
        color: theme.textSecondary,
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
        zIndex: 1000,
        padding: "12px",
      },
      topXControlHeader: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: "12px",
        paddingBottom: "8px",
        borderBottom: `1px solid ${theme.borderPrimary}`,
      },
      topXControlTitle: {
        fontSize: "14px",
        fontWeight: "600",
        color: theme.textSecondary,
      },
      topXModeToggle: {
        display: "flex",
        gap: "4px",
        backgroundColor: theme.bgQuaternary,
        padding: "4px",
        borderRadius: "6px",
        marginBottom: "12px",
      },
      topXInput: {
        width: "100%",
        padding: "6px 8px",
        border: `1px solid ${theme.borderSecondary}`,
        borderRadius: "4px",
        fontSize: "13px",
        marginBottom: "12px",
        backgroundColor: theme.bgPrimary,
        color: theme.textSecondary,
      },
      categorySelectionList: {
        display: "flex",
        flexDirection: "column",
        gap: "4px",
        maxHeight: "300px",
        overflowY: "auto",
      },
      categorySelectionItem: {
        display: "flex",
        alignItems: "center",
        padding: "6px 8px",
        borderRadius: "4px",
        cursor: "pointer",
        color: theme.textSecondary,
      },
      categoryCheckbox: {
        width: "16px",
        height: "16px",
        marginRight: "8px",
        cursor: "pointer",
        accentColor: theme.accentPrimary,
      },
      advancedFiltersHeader: {
        padding: "24px 24px 20px",
        borderBottom: `1px solid ${
          isDarkMode ? "rgba(75, 85, 99, 0.2)" : "rgba(229, 231, 235, 0.5)"
        }`,
        backgroundColor: theme.bgTertiary,
        position: "sticky",
        top: 0,
        zIndex: 10,
      },
      advancedFiltersTitle: {
        fontSize: "18px",
        fontWeight: "600",
        color: theme.textSecondary,
        margin: "0",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
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
        justifyContent: "center",
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
        borderBottom: `1px solid ${
          isDarkMode ? "rgba(75, 85, 99, 0.3)" : "rgba(229, 231, 235, 0.6)"
        }`,
        paddingBottom: "8px",
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
        backgroundImage:
          "url(\"data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e\")",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "right 12px center",
        backgroundSize: "16px",
        paddingRight: "48px",
      },
      modernInput: {
        width: "100%",
        padding: "8px 12px",
        border: `1px solid ${theme.borderSecondary}`,
        borderRadius: "8px",
        fontSize: "14px",
        color: theme.textSecondary,
        backgroundColor: theme.bgPrimary,
        boxSizing: "border-box",
      },
      inputGroup: { display: "flex", flexDirection: "column", gap: "8px" },
      modernLabel: {
        fontSize: "13px",
        fontWeight: "500",
        color: theme.textTertiary,
        marginBottom: "6px",
      },
      checkboxContainer: {
        border: `1px solid ${
          isDarkMode ? "rgba(75, 85, 99, 0.3)" : "rgba(229, 231, 235, 0.6)"
        }`,
        borderRadius: "8px",
        padding: "8px",
        backgroundColor: theme.bgPrimary,
        maxHeight: "200px",
        overflowY: "auto",
      },
      checkboxItem: {
        display: "flex",
        alignItems: "center",
        padding: "6px 8px",
        cursor: "pointer",
        borderRadius: "4px",
      },
      checkboxInput: {
        width: "16px",
        height: "16px",
        marginRight: "8px",
        cursor: "pointer",
        accentColor: theme.accentPrimary,
      },
      checkboxLabel: {
        fontSize: "13px",
        color: theme.textSecondary,
        cursor: "pointer",
        userSelect: "none",
      },
      filterDropdown: {
        border: `1px solid ${
          isDarkMode ? "rgba(75, 85, 99, 0.3)" : "rgba(229, 231, 235, 0.6)"
        }`,
        borderRadius: "8px",
        backgroundColor: theme.bgPrimary,
        marginBottom: "8px",
      },
      filterDropdownHeader: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "10px 12px",
        cursor: "pointer",
        borderRadius: "6px",
      },
      filterDropdownTitle: {
        fontSize: "13px",
        fontWeight: "500",
        color: theme.textSecondary,
        display: "flex",
        alignItems: "center",
        gap: "8px",
      },
      filterDropdownChevron: { fontSize: "12px", color: theme.textTertiary },
      filterDropdownContent: {
        maxHeight: "200px",
        overflowY: "auto",
        padding: "8px",
        borderTop: `1px solid ${theme.borderPrimary}`,
      },
      filterSelectedCount: {
        fontSize: "11px",
        color: theme.accentPrimary,
        fontWeight: "600",
        marginLeft: "4px",
      },
      queryInputGroup: {
        display: "flex",
        flexDirection: "column",
        gap: "4px",
        position: "relative",
      },
      queryLabelContainer: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "10px",
        marginBottom: "4px",
      },
      queryLabel: {
        fontSize: "20px",
        fontWeight: "600",
        textAlign: "center",
        letterSpacing: "-0.02em",
        background:
          "linear-gradient(135deg, #4c51bf 0%, #5b21b6 25%, #a855f7 50%, #2563eb 75%, #0891b2 100%)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
        fontFamily:
          "'Inter', 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif",
        position: "relative",
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
        height: "16px",
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
        zIndex: 1000,
        pointerEvents: "none",
        textAlign: "left",
        lineHeight: "1.5",
        border: `1px solid ${theme.borderPrimary}`,
        fontFamily: "'Inter', 'Segoe UI', sans-serif",
        width: "320px",
        maxWidth: "320px",
        wordWrap: "break-word",
        whiteSpace: "normal",
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
        borderBottom: `6px solid ${theme.bgPrimary}`,
      },
      queryInputWrapper: { display: "flex", gap: "8px", alignItems: "stretch" },
      queryInput: {
        flex: 1,
        padding: "12px 16px",
        border: `1px solid ${
          isDarkMode ? "rgba(148, 163, 184, 0.2)" : theme.borderSecondary
        }`,
        borderRadius: "10px",
        fontSize: "14px",
        color: theme.textSecondary,
        backgroundColor: isDarkMode ? "rgba(51, 65, 85, 0.5)" : theme.bgPrimary,
        outline: "none",
        fontFamily: "'Inter', 'Segoe UI', sans-serif",
        boxShadow: isDarkMode
          ? "inset 0 1px 3px rgba(0, 0, 0, 0.3)"
          : "inset 0 1px 2px rgba(0, 0, 0, 0.05)",
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
        cursor: "pointer",
      },
      queryButtonDisabled: {
        backgroundColor: theme.borderSecondary,
        color: theme.textQuaternary,
        cursor: "not-allowed",
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
        cursor: "pointer",
      },
      queryHint: {
        fontSize: "11px",
        color: theme.textTertiary,
        fontStyle: "italic",
        marginTop: "4px",
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
        cursor: "pointer",
      },
      insightsTabsContainer: {
        display: "flex",
        gap: "6px",
        backgroundColor: "transparent",
        padding: "0",
        borderRadius: "0",
        border: "none",
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
        cursor: "pointer",
      },
      insightsTabActive: {
        backgroundColor: theme.accentPrimary,
        color: "white",
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
        transition: "all 0.2s ease",
      },
      tabCount: {
        fontSize: "10px",
        color: "inherit",
        backgroundColor: "rgba(255,255,255,0.2)",
        padding: "2px 6px",
        borderRadius: "8px",
      },
      insightsContext: {
        fontSize: "13px",
        color: theme.accentPrimary,
        fontWeight: "600",
        marginBottom: "4px",
      },
      insightsSubtitle: {
        fontSize: "12px",
        color: theme.textTertiary,
        fontWeight: "400",
        marginBottom: "20px",
      },
      categorySection: { marginBottom: "16px" },
      categoryTitle: {
        fontSize: "14px",
        fontWeight: "600",
        color: theme.textSecondary,
        marginBottom: "12px",
        paddingBottom: "6px",
        borderBottom: `1px solid ${
          isDarkMode ? "rgba(75, 85, 99, 0.2)" : "rgba(229, 231, 235, 0.5)"
        }`,
        display: "flex",
        alignItems: "center",
        gap: "6px",
      },
      insightsList: { display: "flex", flexDirection: "column", gap: "8px" },
      insightItem: {
        padding: "12px 14px",
        backgroundColor: isDarkMode
          ? "rgba(148, 163, 184, 0.08)"
          : theme.bgSecondary,
        borderRadius: "8px",
        border: "none",
        cursor: "pointer",
        display: "flex",
        alignItems: "flex-start",
        gap: "10px",
        transition: "all 0.15s ease",
      },
      insightNumber: {
        fontSize: "12px",
        fontWeight: "700",
        color: theme.accentPrimary,
        minWidth: "16px",
      },
      insightText: {
        fontSize: "12px",
        color: theme.textSecondary,
        lineHeight: "1.4",
        flex: 1,
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
        userSelect: "none",
      },
      summaryGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "12px",
      },
      summaryItem: { fontSize: "13px", color: theme.textTertiary },
      flexBetween: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
        justifyContent: "space-between",
      },
      flexWrap: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
        flexWrap: "wrap",
        flex: "1 1 auto",
      },
      flexGap8: { display: "flex", alignItems: "center", gap: "8px" },
      block: { display: "block" },
      fontWeight600: {
        fontWeight: "600",
        marginBottom: "4px",
        color: theme.textPrimary,
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
        zIndex: 2000,
        pointerEvents: "auto",
      },
      guideHighlight: {
        position: "fixed",
        border: `3px solid ${theme.accentPrimary}`,
        borderRadius: "8px",
        boxShadow: `0 0 0 9999px ${theme.overlayBg}`,
        pointerEvents: "none",
        zIndex: 2001,
        boxSizing: "border-box",
      },
      guideTooltip: {
        position: "fixed",
        backgroundColor: theme.bgPrimary,
        borderRadius: "12px",
        zIndex: 2002,
        maxWidth: "400px",
        padding: "16px",
        fontFamily: "'Inter', 'Segoe UI', sans-serif",
        pointerEvents: "auto",
      },
      guideTooltipHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: "8px",
      },
      guideTooltipTitle: {
        fontSize: "16px",
        fontWeight: "600",
        color: theme.textPrimary,
        marginBottom: "4px",
      },
      guideTooltipStep: {
        fontSize: "12px",
        color: theme.textTertiary,
        fontWeight: "500",
      },
      guideTooltipDescription: {
        fontSize: "14px",
        color: theme.textSecondary,
        lineHeight: "1.5",
        marginBottom: "12px",
      },
      guideTooltipButtons: {
        display: "flex",
        gap: "8px",
        justifyContent: "flex-end",
      },
      guideTooltipButton: {
        padding: "6px 12px",
        borderRadius: "6px",
        border: "none",
        fontSize: "13px",
        fontWeight: "500",
        cursor: "pointer",
      },
      guideTooltipButtonPrimary: {
        backgroundColor: theme.accentPrimary,
        color: "white",
      },
      guideTooltipButtonSecondary: {
        backgroundColor: theme.bgQuaternary,
        color: theme.textSecondary,
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
        borderRadius: "4px",
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
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      },
      // Optimization 6: Hoisted styles for .map() loops
      checkboxItemSelected: {
        display: "flex",
        alignItems: "center",
        padding: "6px 8px",
        cursor: "pointer",
        borderRadius: "4px",
        fontWeight: "600",
        backgroundColor: "#f0f9ff",
      },
      checkboxItemUnselected: {
        display: "flex",
        alignItems: "center",
        padding: "6px 8px",
        cursor: "pointer",
        borderRadius: "4px",
        backgroundColor: "transparent",
      },
      filterSuggestionItemSelected: {
        display: "flex",
        alignItems: "center",
        padding: "8px 12px",
        cursor: "pointer",
        borderBottom: `1px solid ${theme.bgQuaternary}`,
        backgroundColor: isDarkMode ? "rgba(129, 140, 248, 0.15)" : "#f0f9ff",
      },
      filterSuggestionItemUnselected: {
        display: "flex",
        alignItems: "center",
        padding: "8px 12px",
        cursor: "pointer",
        borderBottom: `1px solid ${theme.bgQuaternary}`,
        backgroundColor: isDarkMode ? "rgba(51, 65, 85, 0.3)" : "white",
      },
      categorySelectionItemSelected: {
        display: "flex",
        alignItems: "center",
        padding: "6px 8px",
        borderRadius: "4px",
        cursor: "pointer",
        color: theme.textSecondary,
        backgroundColor: "#f0f9ff",
      },
      categorySelectionItemUnselected: {
        display: "flex",
        alignItems: "center",
        padding: "6px 8px",
        borderRadius: "4px",
        cursor: "pointer",
        color: theme.textSecondary,
        backgroundColor: "transparent",
      },
      savedViewsHeader: {
        fontSize: "11px",
        fontWeight: "600",
        color: "#6b7280",
        marginBottom: "8px",
        textTransform: "uppercase",
        letterSpacing: "0.5px",
      },
      savedScenarioCard: {
        padding: "8px",
        backgroundColor: "#f9fafb",
        borderRadius: "6px",
        border: "1px solid #e5e7eb",
      },
      savedScenarioRow: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
        marginBottom: "6px",
      },
      savedScenarioLabel: {
        flex: 1,
        fontSize: "12px",
        fontWeight: "500",
        color: "#374151",
      },
      savedScenarioDeleteBtn: {
        padding: "2px 8px",
        backgroundColor: "#ef4444",
        color: "white",
        border: "none",
        borderRadius: "4px",
        fontSize: "10px",
        fontWeight: "500",
        cursor: "pointer",
      },
      allSlotsFilled: {
        fontSize: "11px",
        color: "#6b7280",
        fontStyle: "italic",
        textAlign: "center",
        padding: "8px",
        backgroundColor: "#f9fafb",
        borderRadius: "4px",
        marginTop: "12px",
      },
      categoryLabelText: { fontSize: "13px", color: "#374151" },
      noCategoriesFound: {
        padding: "12px",
        textAlign: "center",
        color: "#6b7280",
        fontSize: "13px",
      },
      radioLabel: {
        display: "flex",
        alignItems: "center",
        cursor: "pointer",
        fontSize: "13px",
      },
      marginRight6: { marginRight: "6px" },
      marginBottom16: { marginBottom: "16px" },
      flexGap12Mt8: { display: "flex", gap: "12px", marginTop: "8px" },
    }),
    [theme, isDarkMode, showDataSummary]
  );

  // ===== LIVE DATA CONNECTION + TAB SYSTEM =====
  const [urlRoute] = React.useState(() => parseUrlRoute());
  const [baseConnection, setBaseConnection] = React.useState(null); // set async after config fetch
  const [configId, setConfigId] = React.useState(urlRoute.mode === 'config' ? urlRoute.configId : null);
  const [isCreatorMode, setIsCreatorMode] = React.useState(false);
  const [configLoading, setConfigLoading] = React.useState(urlRoute.mode === 'config');
  const [configError, setConfigError] = React.useState(null);
  // Auto-lock creator mode after 2 min of inactivity
  const creatorTimerRef = React.useRef(null);
  const resetCreatorTimer = React.useCallback(() => {
    if (creatorTimerRef.current) clearTimeout(creatorTimerRef.current);
    creatorTimerRef.current = setTimeout(() => {
      setIsCreatorMode(false);
    }, 2 * 60 * 1000);
  }, []);
  // Start/reset timer whenever creator mode activates
  React.useEffect(() => {
    if (isCreatorMode && configId) {
      resetCreatorTimer();
      return () => { if (creatorTimerRef.current) clearTimeout(creatorTimerRef.current); };
    }
  }, [isCreatorMode, configId, resetCreatorTimer]);

  const [showUnlockPrompt, setShowUnlockPrompt] = React.useState(false);
  const [unlockSecret, setUnlockSecret] = React.useState('');
  const [unlockError, setUnlockError] = React.useState('');
  const [showConnectModal, setShowConnectModal] = React.useState(false);
  const [connectForm, setConnectForm] = React.useState({ supabaseUrl: '', apiKey: '', dataset: '' });
  const [connectError, setConnectError] = React.useState('');
  const [connectSaving, setConnectSaving] = React.useState(false);
  const pendingStateRef = React.useRef(urlRoute.mode === 'config' ? parseStateParam() : null);

  // Tab system: each tab has { id, name, dataset }
  const [tabs, setTabs] = React.useState(() => {
    return []; // populated after config fetch, or stays empty in demo mode
  });
  const [activeTabId, setActiveTabId] = React.useState(() => tabs.length > 0 ? tabs[0].id : null);
  const tabStateCacheRef = React.useRef({}); // { [tabId]: { snapshot of per-tab state } }
  const [renamingTabId, setRenamingTabId] = React.useState(null);
  const [renameText, setRenameText] = React.useState('');
  const [showAddTab, setShowAddTab] = React.useState(false);
  const [newTabDataset, setNewTabDataset] = React.useState('');
  const tabNextIdRef = React.useRef(tabs.length + 1);

  // Tabs are persisted to Config DB via persistToConfigDb (no localStorage needed)

  // Config mode: fetch dashboard config from Config DB on mount
  React.useEffect(() => {
    if (urlRoute.mode !== 'config') return;
    setConfigLoading(true);
    fetchConfig(urlRoute.configId)
      .then(config => {
        if (!config) {
          setConfigError('Dashboard not found. It may have been deleted.');
          setConfigLoading(false);
          return;
        }
        const conn = config.connection_json;
        setBaseConnection({ supabaseUrl: conn.supabaseUrl, apiKey: conn.apiKey, initialDataset: conn.dataset || null });
        // Restore tabs from config
        const tabsData = config.tabs_json;
        if (Array.isArray(tabsData) && tabsData.length > 0) {
          setTabs(tabsData);
          // Restore last active tab from localStorage, fall back to first tab
          const savedActiveTab = (() => { try { return localStorage.getItem('activeTabId_' + urlRoute.configId); } catch (e) { return null; } })();
          const initialTabId = savedActiveTab && tabsData.some(t => t.id === savedActiveTab) ? savedActiveTab : tabsData[0].id;
          setActiveTabId(initialTabId);
          tabNextIdRef.current = Math.max(...tabsData.map(t => {
            const m = t.id.match(/^tab_(\d+)$/);
            return m ? parseInt(m[1], 10) : 0;
          }));
          // Set metric config for the initial tab
          const initialTab = tabsData.find(t => t.id === initialTabId) || tabsData[0];
          if (initialTab.metricConfig) {
            setLiveMetricConfig(initialTab.metricConfig);
          }
          // Pre-populate tab state cache with metric configs from all other tabs
          tabsData.forEach(t => {
            if (t.id !== initialTabId && t.metricConfig) {
              tabStateCacheRef.current[t.id] = { liveMetricConfig: t.metricConfig };
            }
          });
        } else {
          // Fallback: single tab from connection dataset
          const ds = conn.dataset || null;
          setTabs([{ id: 'tab_1', name: ds || 'New Tab', dataset: ds }]);
          setActiveTabId('tab_1');
        }
        setConfigId(urlRoute.configId);
        setIsCreatorMode(isCreator(urlRoute.configId));
        setConfigLoading(false);
      })
      .catch(err => {
        setConfigError('Failed to load dashboard: ' + err.message);
        setConfigLoading(false);
      });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps -- mount only

  // Track whether we've restored saved UI selections for initial page load
  const uiSelectionsRestoredRef = React.useRef(new Set());

  // Derive connectionParams from baseConnection + active tab
  const activeTab = tabs.find(t => t.id === activeTabId) || null;
  const connectionParams = React.useMemo(() => {
    if (!baseConnection || !activeTab || !activeTab.dataset) return null;
    return { supabaseUrl: baseConnection.supabaseUrl, apiKey: baseConnection.apiKey, dataset: activeTab.dataset };
  }, [baseConnection, activeTab]);

  const [liveDataLoading, setLiveDataLoading] = React.useState(!!connectionParams);
  const [liveDataError, setLiveDataError] = React.useState(null);
  const [liveColumnMeta, setLiveColumnMeta] = React.useState(null); // schema columns from query_dataset
  const [liveSchemaReady, setLiveSchemaReady] = React.useState(false);
  const [liveFilterOptions, setLiveFilterOptions] = React.useState({}); // { column_name: ["val1", ...] }
  const [livePeriodAggregates, setLivePeriodAggregates] = React.useState(null);
  const [liveDimensionAggregates, setLiveDimensionAggregates] = React.useState(null);
  const [liveInsightsDimAggs, setLiveInsightsDimAggs] = React.useState({}); // all-dimension aggs for insights
  const [liveAggLoading, setLiveAggLoading] = React.useState(false);
  const [liveRowCount, setLiveRowCount] = React.useState(0);
  const [liveDataTruncated, setLiveDataTruncated] = React.useState(false);

  // Metric config for live mode — defines how columns map to the 3 metric slots
  const [liveMetricConfig, setLiveMetricConfig] = React.useState(null); // set from Config DB

  const isLiveMode = connectionParams !== null && liveSchemaReady;

  // Metrics editor modal state
  const [showMetricsEditor, setShowMetricsEditor] = React.useState(false);
  const [metricsEditorDraft, setMetricsEditorDraft] = React.useState(null);
  const [metricsEditorSuggesting, setMetricsEditorSuggesting] = React.useState(false);
  const [metricsEditorError, setMetricsEditorError] = React.useState('');
  const [expandedMetricSlot, setExpandedMetricSlot] = React.useState(null);

  // Build tabs_json for Config DB persistence (includes metricConfig per tab)
  const buildTabsJson = React.useCallback((currentTabs, currentTabId, currentMetricConfig) => {
    return currentTabs.map(t => {
      const mc = t.id === currentTabId
        ? currentMetricConfig
        : (tabStateCacheRef.current[t.id]?.liveMetricConfig || null);
      return { id: t.id, name: t.name, dataset: t.dataset, metricConfig: mc };
    });
  }, []);

  // Persist current tabs + metric configs to Config DB (fire-and-forget)
  const persistToConfigDb = React.useCallback((updatedTabs, currentTabId, currentMetricConfig) => {
    if (!configId || !isCreatorMode) return;
    resetCreatorTimer(); // reset auto-lock on every edit
    const tabsJson = buildTabsJson(updatedTabs || tabs, currentTabId || activeTabId, currentMetricConfig || liveMetricConfig);
    updateConfig(configId, getEditSecret(configId), { tabsJson })
      .catch(err => console.warn('Failed to save config to DB:', err));
  }, [configId, isCreatorMode, tabs, activeTabId, liveMetricConfig, buildTabsJson, resetCreatorTimer]);

  // Persist tab structure changes (add/remove/rename) to Config DB — skip initial load
  const tabsInitializedRef = React.useRef(false);
  React.useEffect(() => {
    if (!tabsInitializedRef.current) { tabsInitializedRef.current = true; return; }
    persistToConfigDb();
  }, [tabs]); // eslint-disable-line react-hooks/exhaustive-deps -- only fire on tab array changes

  // Metrics Editor save handler — persists config to localStorage, Config DB, and applies to UI
  const handleMetricsEditorSave = React.useCallback(() => {
    const config = { ...metricsEditorDraft };
    const newDataset = config.dataset;
    delete config.dataset;
    const datasetChanged = newDataset && activeTab && newDataset !== activeTab.dataset;
    let updatedTabs = tabs;
    if (datasetChanged) {
      updatedTabs = tabs.map(t => t.id === activeTabId ? { ...t, dataset: newDataset } : t);
      setTabs(updatedTabs);
      loadedDatasetsRef.current.delete(activeTab.dataset);
    }
    setLiveMetricConfig(config);
    setShowMetricsEditor(false);
    queryCacheRef.current.clear();
    // Persist to Config DB
    persistToConfigDb(updatedTabs, activeTabId, config);
  }, [metricsEditorDraft, activeTab, activeTabId, connectionParams, tabs, persistToConfigDb]);

  // Metrics Editor AI suggestion handler — calls LLM worker to auto-configure metrics
  const handleMetricsEditorSuggest = React.useCallback(async () => {
    setMetricsEditorSuggesting(true);
    setMetricsEditorError('');
    try {
      const res = await fetch(LLM_WORKER_URL + '/suggest-metrics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ columns: liveColumnMeta }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Request failed');
      }
      const suggestion = await res.json();
      const allCols = liveColumnMeta || [];
      const validDate = allCols.filter(c => c.udt === 'date' || c.udt === 'timestamp' || c.udt === 'timestamptz').map(c => c.name);
      const validAllCols = allCols.map(c => c.name);
      const allowedAggs = ['count', 'count_distinct', 'sum', 'avg', 'min', 'max'];
      setMetricsEditorDraft(prev => ({
        ...prev,
        volumeAggType: suggestion.volumeAggType && allowedAggs.includes(suggestion.volumeAggType) ? suggestion.volumeAggType : (suggestion.volumeColumn ? 'sum' : 'count'),
        volumeColumn: suggestion.volumeColumn && validAllCols.includes(suggestion.volumeColumn) ? suggestion.volumeColumn : prev.volumeColumn,
        revenueAggType: suggestion.revenueAggType && allowedAggs.includes(suggestion.revenueAggType) ? suggestion.revenueAggType : (suggestion.revenueColumn ? 'sum' : 'count'),
        revenueColumn: suggestion.revenueColumn && validAllCols.includes(suggestion.revenueColumn) ? suggestion.revenueColumn : prev.revenueColumn,
        derivedMode: 'aggregation',
        formulaOperator: prev.formulaOperator || '/',
        derivedAggType: suggestion.derivedAggType && allowedAggs.includes(suggestion.derivedAggType) ? suggestion.derivedAggType : prev.derivedAggType,
        derivedColumn: suggestion.derivedColumn && validAllCols.includes(suggestion.derivedColumn) ? suggestion.derivedColumn : prev.derivedColumn,
        volumeLabel: suggestion.volumeLabel || prev.volumeLabel,
        revenueLabel: suggestion.revenueLabel || prev.revenueLabel,
        derivedLabel: suggestion.derivedLabel || prev.derivedLabel,
        volumeFormat: suggestion.volumeFormat || prev.volumeFormat,
        revenueFormat: suggestion.revenueFormat || prev.revenueFormat,
        derivedFormat: suggestion.derivedFormat || prev.derivedFormat,
        volumePrefix: suggestion.volumePrefix != null ? suggestion.volumePrefix : (prev.volumePrefix || ""),
        volumeSuffix: suggestion.volumeSuffix != null ? suggestion.volumeSuffix : (prev.volumeSuffix || ""),
        revenuePrefix: suggestion.revenuePrefix != null ? suggestion.revenuePrefix : (prev.revenuePrefix || ""),
        revenueSuffix: suggestion.revenueSuffix != null ? suggestion.revenueSuffix : (prev.revenueSuffix || ""),
        derivedPrefix: suggestion.derivedPrefix != null ? suggestion.derivedPrefix : (prev.derivedPrefix || ""),
        derivedSuffix: suggestion.derivedSuffix != null ? suggestion.derivedSuffix : (prev.derivedSuffix || ""),
        dateColumn: suggestion.dateColumn && validDate.includes(suggestion.dateColumn) ? suggestion.dateColumn : prev.dateColumn,
      }));
    } catch (err) {
      setMetricsEditorError(err.message || 'Suggestion failed');
    } finally {
      setMetricsEditorSuggesting(false);
    }
  }, [liveColumnMeta]);

  // ===== RPC CALL HELPER =====
  const callQueryDataset = React.useMemo(
    () => createRpcCaller(connectionParams),
    [connectionParams]
  );

  // ===== QUERY CACHE (in-memory LRU) =====
  const queryCacheRef = React.useRef(createQueryCache(100));

  const cachedQuery = React.useCallback((action, params) => {
    const cache = queryCacheRef.current;
    const key = cache.getKey(action, params);
    const cached = cache.get(key);
    if (cached) return Promise.resolve(cached);
    return callQueryDataset(action, params).then(result => { cache.set(key, result); return result; });
  }, [callQueryDataset]);

  // ===== BUILD COLUMNS/DIMENSIONS FROM SCHEMA =====
  const liveDateColumn = React.useMemo(() => detectDateColumn(liveColumnMeta), [liveColumnMeta]);
  const liveSchemaClassified = React.useMemo(() => classifySchema(liveColumnMeta, liveDateColumn), [liveColumnMeta, liveDateColumn]);

  // Filter dimensions to only those the user selected as visible
  const visibleLiveDimensions = React.useMemo(() => {
    if (!liveSchemaClassified.dimensions.length) return [];
    const visible = liveMetricConfig?.visibleDimensions;
    if (!visible || !Array.isArray(visible)) return liveSchemaClassified.dimensions;
    return liveSchemaClassified.dimensions.filter(c => visible.includes(c.name));
  }, [liveSchemaClassified.dimensions, liveMetricConfig]);

  // Detect boolean columns from schema (udt 'bool') for display-friendly labels
  const liveBooleanColumns = React.useMemo(() => {
    if (!liveColumnMeta) return new Set();
    return new Set(liveColumnMeta.filter(c => c.udt === 'bool').map(c => c.name));
  }, [liveColumnMeta]);



  // ===== STARTUP: FETCH SCHEMA + DISTINCT VALUES =====
  // Track which datasets have been loaded to avoid redundant fetches on tab switch
  const loadedDatasetsRef = React.useRef(new Set());
  React.useEffect(() => {
    if (!connectionParams) return;
    // Skip if we already loaded this dataset (tab switch restored from cache)
    if (loadedDatasetsRef.current.has(connectionParams.dataset) && liveColumnMeta) return;
    setLiveDataLoading(true);
    setLiveDataError(null);

    const { dataset } = connectionParams;

    // Step 1: Fetch schema
    callQueryDataset('schema', {})
      .then(schemaData => {
        const columns = schemaData.columns || [];
        setLiveColumnMeta(columns);

        // Determine metric config from Config DB tab, fall back to defaults for new tabs
        let config = null;
        const currentTab = tabs.find(t => t.id === activeTabId) || tabs.find(t => t.dataset === dataset);
        if (currentTab && currentTab.metricConfig) config = currentTab.metricConfig;
        const isNewConnection = !config;
        if (!config) {
          config = DEFAULT_METRIC_CONFIGS[dataset] || {
            volumeColumn: null, revenueColumn: null,
            volumeLabel: "Count", revenueLabel: "Count", derivedLabel: "Ratio",
            volumeFormat: "0,0", revenueFormat: "0,0", derivedFormat: "0.0", derivedDivisor: 10000,
            dateColumn: columns.find(c => c.udt === 'date' || c.name.includes('_dt'))?.name || null,
          };
          // Auto-open metrics editor for new datasets so creator can configure
          if (!DEFAULT_METRIC_CONFIGS[dataset] && isCreatorMode) {
            setMetricsEditorDraft({ ...config, dataset });
            setShowMetricsEditor(true);
          }
        }
        // Auto-correct stale config values against current schema
        const columnNames = new Set(columns.map(c => c.name));
        let configDirty = false;
        if (config.dateColumn && !columnNames.has(config.dateColumn)) {
          const detected = columns.find(c => c.udt === 'date' || c.name.includes('_dt'))?.name || null;
          console.warn(`[Dashboard] dateColumn "${config.dateColumn}" not in schema, auto-correcting to "${detected}"`);
          config.dateColumn = detected;
          configDirty = true;
        }
        // Remove stale visibleDimensions entries
        if (Array.isArray(config.visibleDimensions)) {
          const before = config.visibleDimensions.length;
          config.visibleDimensions = config.visibleDimensions.filter(d => columnNames.has(d));
          if (config.visibleDimensions.length !== before) configDirty = true;
        }
        if (configDirty && configId && isCreatorMode) {
          // Auto-corrected config — persist to Config DB
          persistToConfigDb(undefined, undefined, config);
        }
        // Always set metric config (whether from Config DB or freshly created)
        setLiveMetricConfig(config);

        // Apply default grain on first load for this dataset
        if (config.defaultGrain) {
          const grainToFreq = { day: 'Daily', week: 'Weekly', month: 'Monthly', quarter: 'Quarterly', year: 'Yearly' };
          setDataFrequency(grainToFreq[config.defaultGrain] || 'Monthly');
        }

        // Step 2: Fetch distinct values for all dimension columns
        const dateCol = config.dateColumn || columns.find(c => c.udt === 'date' || c.name.includes('_dt'))?.name;
        const dimCols = columns.filter(c => {
          if (c.name === dateCol) return false;
          if (c.udt === 'int4' || c.udt === 'int8' || c.udt === 'float4' || c.udt === 'float8' || c.udt === 'numeric') return false;
          return true;
        });

        // Identify boolean columns to prefix values with column name
        const boolCols = new Set(columns.filter(c => c.udt === 'bool').map(c => c.name));

        return Promise.all(
          dimCols.map(c =>
            cachedQuery('distinct', { p_column: c.name })
              .then(r => ({ column: c.name, values: r.values || [], isBool: boolCols.has(c.name) }))
              .catch(() => ({ column: c.name, values: [], isBool: boolCols.has(c.name) }))
          )
        );
      })
      .then(distinctResults => {
        const filterOpts = {};
        distinctResults.forEach(r => {
          if (r.isBool) {
            filterOpts[r.column] = r.values.map(v => r.column + '_' + String(v).toLowerCase());
          } else {
            filterOpts[r.column] = r.values;
          }
        });
        setLiveFilterOptions(filterOpts);
        setLiveSchemaReady(true);
        setLiveDataLoading(false);
        loadedDatasetsRef.current.add(connectionParams.dataset);

        // Restore saved UI selections on initial page load (not tab switches)
        if (!uiSelectionsRestoredRef.current.has(activeTabId)) {
          uiSelectionsRestoredRef.current.add(activeTabId);
          try {
            const selectionsKey = 'uiSelections_' + connectionParams.supabaseUrl + '_' + activeTabId;
            const saved = localStorage.getItem(selectionsKey);
            if (saved) {
              const s = JSON.parse(saved);
              // Validate saved selections against current schema columns
              const schemaColNames = new Set(distinctResults.map(r => r.column));
              if (s.dataFrequency) setDataFrequency(s.dataFrequency);
              if (s.metric) setMetric(s.metric);
              // Validate saved view — reset to Overall if the dimension no longer exists
              if (s.view && s.view !== 'Overall') {
                // View names are derived from column names (e.g. "Job Source" from "job_source")
                // Check if any schema column could produce this view name
                const viewValid = distinctResults.some(r => {
                  const label = r.column.replace(/^is_/, '').replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                  return label === s.view;
                });
                setView(viewValid ? s.view : 'Overall');
              } else if (s.view) {
                setView(s.view);
              }
              if (s.topX != null) setTopX(s.topX);
              if (s.categorySelectionMode) setCategorySelectionMode(s.categorySelectionMode);
              if (s.selectedCategories) setSelectedCategories(s.selectedCategories);
              // Filter out stale dynamicFilters referencing columns no longer in schema
              if (s.dynamicFilters) {
                const cleaned = {};
                Object.keys(s.dynamicFilters).forEach(filterKey => {
                  const colName = filterKey.replace(/^dim_/, '').replace(/_filter$/, '');
                  if (schemaColNames.has(colName)) cleaned[filterKey] = s.dynamicFilters[filterKey];
                });
                setDynamicFilters(cleaned);
              }
              if (s.dateRange) setDateRange(s.dateRange);
              if (s.activeOverlays) setActiveOverlays(s.activeOverlays);
              if (s.smaWindow) setSmaWindow(s.smaWindow);
              if (s.forecastHorizon) setForecastHorizon(s.forecastHorizon);
              if (s.activeInsightsTab !== undefined) setActiveInsightsTab(s.activeInsightsTab);
            }
          } catch (e) {}
        }
      })
      .catch(err => {
        setLiveDataError(err.message);
        setLiveDataLoading(false);
      });
  }, [connectionParams]);

  // Ref to hold restoreStateSnapshot for use in early effects (the callback is defined later)
  const restoreStateSnapshotRef = React.useRef(null);

  // Dynamic filters for live mode (single state object)
  const [dynamicFilters, setDynamicFilters] = React.useState({});

  const COLUMNS = isLiveMode ? buildLiveColumns(visibleLiveDimensions) : DEMO_COLUMNS;

  const DIMENSION_DEFINITIONS = isLiveMode ? buildLiveDimensions(visibleLiveDimensions) : DEMO_DIMENSION_DEFINITIONS;

  // Metric display labels — in live mode, use labels from metric config
  const METRIC_LABELS = isLiveMode && liveMetricConfig ? {
    metric1: liveMetricConfig.volumeLabel,
    metric2: liveMetricConfig.revenueLabel,
    metric3: liveMetricConfig.derivedLabel,
  } : {
    metric1: "Gross Volume",
    metric2: "Net Revenue",
    metric3: "Margin Rate",
  };

  // Data source: live Supabase data when connected, synthetic data for demo mode
  // In live mode: no raw rows needed (server-side aggregation).
  // queryData is only used for demo mode synthetic data.
  const queryData = React.useMemo(function() {
    if (connectionParams) return { rows: [] }; // Live mode: empty rows, aggregates come from RPC
    return generateSyntheticData();
  }, [connectionParams]);

  /**
   * Extract metadata from queryData and create cleaned version.
   * For the synthetic data generator, no metadata rows exist so this is effectively a pass-through.
   * The cleanedQueryData will equal queryData with the same rows.
   */
  const { cleanedQueryData, metadataVariables } = React.useMemo(() => {
    if (!queryData.rows || queryData.rows.length === 0) {
      return {
        cleanedQueryData: queryData,
        metadataVariables: {
          username: null,
          team: null,
          shared_configuration: null,
          saved_views: [],
        },
      };
    }

    const metadata = {
      username: null,
      team: null,
      shared_configuration: null,
      saved_views: [],
    };

    // Extract metadata from special rows
    // Performance optimization: stop early if all single-value metadata is found
    for (let i = 0; i < queryData.rows.length; i++) {
      const row = queryData.rows[i];
      const familyValue = row[COLUMNS.PRODUCT_NAME];
      const methodValue = row[COLUMNS.PRODUCT];

      if (familyValue) {
        const familyStr = familyValue.toString();

        // Extract username
        if (familyStr === "username") {
          metadata.username = methodValue;
        }
        // Extract team
        else if (familyStr === "team") {
          metadata.team = methodValue;
        }
        // Extract shared configuration (for auto-loading saved state)
        else if (familyStr === "Shared Configuration") {
          metadata.shared_configuration = methodValue;
        }
        // Extract saved views: product_category="Saved Views:<View Name>", configuration in product
        else if (familyStr.startsWith("Saved Views:")) {
          const viewName = familyStr.replace("Saved Views:", "").trim();
          const configCode = methodValue ? methodValue.toString() : "";
          if (viewName && configCode) {
            metadata.saved_views.push({ name: viewName, code: configCode });
          }
        }
      }

      // Performance optimization: Early exit if all single-value metadata is found
      // (We still continue if we haven't checked all rows for saved_views since there can be multiple)
      // Typically metadata rows are at the beginning, so this saves processing thousands of data rows
      if (
        metadata.username &&
        metadata.team &&
        metadata.shared_configuration &&
        i > 20
      ) {
        // We've found all single-value metadata and checked first 20+ rows for saved views
        // Continue scanning remaining rows only if we've found at least one saved view
        // (to catch all saved views which might be scattered)
        if (metadata.saved_views.length === 0) {
          break; // No saved views found in first 20 rows, unlikely to find more
        }
      }
    }

    // Filter out all metadata rows to create cleaned queryData
    const cleanedRows = queryData.rows.filter((row) => {
      const familyValue = row[COLUMNS.PRODUCT_NAME];

      if (!familyValue) return true; // Keep rows without family value

      const familyStr = familyValue.toString();

      // Exclude all metadata rows (including legacy unused metadata)
      return !(
        familyStr === "configuration_code" ||
        familyStr === "view_name" ||
        familyStr === "username" ||
        familyStr === "team" ||
        familyStr.startsWith("Saved Views:") ||
        familyStr === "Shared Configuration"
      );
    });

    return {
      cleanedQueryData: { ...queryData, rows: cleanedRows },
      metadataVariables: metadata,
    };
  }, [queryData]);

  // Helper to check which columns exist in the data
  const availableColumns = React.useMemo(() => {
    // Live mode: derive from schema + synthetic time grain columns
    if (isLiveMode && liveColumnMeta) {
      const cols = new Set(liveColumnMeta.map(c => c.name));
      // Add synthetic columns the dashboard uses
      cols.add('reporting_day');
      cols.add('reporting_week');
      cols.add('reporting_month');
      cols.add('reporting_quarter');
      cols.add('reporting_year');
      cols.add('volume');
      cols.add('revenue');
      return cols;
    }
    if (!cleanedQueryData.rows || cleanedQueryData.rows.length === 0)
      return new Set();
    const firstRow = cleanedQueryData.rows[0];
    return new Set(Object.keys(firstRow));
  }, [isLiveMode, liveColumnMeta, cleanedQueryData.rows]);

  // Helper function to check if a column exists
  const columnExists = React.useCallback(
    (columnName) => {
      return availableColumns.has(columnName);
    },
    [availableColumns]
  );

  // Derive PRODUCT_DIMENSIONS from DIMENSION_DEFINITIONS (DRY)
  const PRODUCT_DIMENSIONS = DIMENSION_DEFINITIONS.filter(
    (dim) => dim.isProductDimension && columnExists(COLUMNS[dim.columnKey])
  ).map((dim) => COLUMNS[dim.columnKey]);

  // VIEW_CONFIG - derived from DIMENSION_DEFINITIONS (DRY)
  // Only include dimensions that exist in the data, sorted by displayOrder
  const VIEW_CONFIG = React.useMemo(() => {
    const filteredViews = {};

    // Sort by displayOrder and filter to only include columns that exist
    [...DIMENSION_DEFINITIONS]
      .sort((a, b) => a.displayOrder - b.displayOrder)
      .forEach((dim) => {
        const column = COLUMNS[dim.columnKey];
        if (columnExists(column)) {
          filteredViews[dim.viewName] = {
            column: column,
            label: dim.viewLabel,
          };
        }
      });

    return filteredViews;
  }, [columnExists]);

  // View label overrides for cleaner display
  const VIEW_LABEL_OVERRIDES = {};

  const GUIDE_STEPS = [
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
      title: "Scenario Comparison",
      description:
        "Compare up to 3 scenarios side-by-side. Click chart icon to open comparison panel.",
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

  const [dataFrequency, setDataFrequency] = React.useState("Monthly");
  const [metric, setMetric] = React.useState("metric2");
  const [activePeriodComparison, setActivePeriodComparison] =
    React.useState("YoY"); // YoY, MoM, QoQ, WoW (stat boxes)
  const [activeOverlays, setActiveOverlays] = React.useState({ yoy: true, forecast_linear: true }); // chart overlay toggles
  const [smaWindow, setSmaWindow] = React.useState(3);
  const [forecastHorizon, setForecastHorizon] = React.useState(3);
  const [showOverlayMenu, setShowOverlayMenu] = React.useState(false);
  const [view, setView] = React.useState("Overall");
  const [topX, setTopX] = React.useState(3);
  const [categorySelectionMode, setCategorySelectionMode] =
    React.useState("topX");
  const [selectedCategories, setSelectedCategories] = React.useState([]);
  const [showTopXControl, setShowTopXControl] = React.useState(false);
  const [categorySearchText, setCategorySearchText] = React.useState("");
  const [productNameFilter, setProductNameFilter] = React.useState([]);
  const [companySegmentFilter, setCompanySegmentFilter] = React.useState([]);
  const [revenueRegionFilter, setRevenueRegionFilter] = React.useState([]);
  const [revenueCountryFilter, setRevenueCountryFilter] = React.useState([]);
  const [acquisitionChannelFilter, setAcquisitionChannelFilter] =
    React.useState([]);
  const [pricingTypeFilter, setPricingTypeFilter] = React.useState([]);
  const [isAiCompanyFilter, setIsAiCompanyFilter] = React.useState([]);
  const [channelFilter, setChannelFilter] = React.useState([]);
  const [productGroupFilter, setProductGroupFilter] = React.useState([]);
  const [productSubFilter, setProductSubFilter] = React.useState([]);
  const [channelTypeFilter, setChannelTypeFilter] = React.useState(
    []
  );
  const [customerConnectFilter, setCustomerConnectFilter] = React.useState([]);

  // 🆕 NEW: Insight context for drill-down tracking with excess growth
  const [insightContext, setInsightContext] = React.useState(null);
  // Structure when set:
  // {
  //   parentCategory: "analytics_add_on",
  //   parentLabel: "Analytics Add-on",
  //   parentGrowth: 30.0,
  //   parentExcessGrowth: 19.9,      // pp above market avg
  //   marketAvgGrowth: 10.1,         // market baseline
  //   parentAbsChange: 770000,
  //   periods: ["2025-10", "2025-11", "2025-12", "2026-01"],
  //   firstValue: 2570000,
  //   lastValue: 3340000,
  //   drillPath: []                   // breadcrumb history
  // }

  // Filter configuration - derived from DIMENSION_DEFINITIONS (DRY)
  // Only include filters for columns that exist in the data
  // Static filter configuration - only depends on column existence, not filter state values
  // This prevents unnecessary recalculations when filter selections change
  const FILTER_CONFIG_STATIC = React.useMemo(() => {
    // Derive from DIMENSION_DEFINITIONS and filter to only include existing columns
    return DIMENSION_DEFINITIONS.map((dim) => ({
      key: dim.filterKey,
      column: COLUMNS[dim.columnKey],
      label: dim.filterLabel,
      displayOrder: dim.displayOrder,
    }))
      .filter((filter) => columnExists(filter.column))
      .sort((a, b) => a.displayOrder - b.displayOrder);
  }, [columnExists]);

  // Helper function to get current filter state by key
  const getFilterState = React.useCallback(
    (key) => {
      // Live mode: use dynamic filters object
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
        customerConnectFilter,
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
      customerConnectFilter,
    ]
  );

  // Helper function to get setState function by key (stable - setters never change)
  const getFilterSetState = React.useCallback((key) => {
    // Live mode: return a setter that updates the dynamic filters object
    if (isLiveMode) {
      return (value) => {
        setDynamicFilters(prev => ({
          ...prev,
          [key]: typeof value === 'function' ? value(prev[key] || []) : value,
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
      customerConnectFilter: setCustomerConnectFilter,
    };
    return setStateMap[key];
  }, [isLiveMode]); // setDynamicFilters is stable; demo setters are stable

  // Derived FILTER_CONFIG for backwards compatibility - adds state and setState to static config
  const FILTER_CONFIG = React.useMemo(() => {
    return FILTER_CONFIG_STATIC.map((filter) => ({
      ...filter,
      state: getFilterState(filter.key),
      setState: getFilterSetState(filter.key),
    }));
  }, [FILTER_CONFIG_STATIC, getFilterState, getFilterSetState]);
  const [dateRange, setDateRange] = React.useState("1Y");
  const [showAdvancedFilters, setShowAdvancedFilters] = React.useState(false);
  const [activeInsightsTab, setActiveInsightsTab] = React.useState(null);

  // ===== TAB SWITCHING =====
  // Capture current per-tab state into a snapshot object
  const captureTabSnapshot = React.useCallback(() => ({
    // Live data state
    liveColumnMeta, liveSchemaReady, liveFilterOptions,
    livePeriodAggregates, liveDimensionAggregates, liveAggLoading,
    liveRowCount, liveDataTruncated, liveMetricConfig, liveDataError,
    // UI state
    dataFrequency, metric, view, topX, categorySelectionMode,
    selectedCategories, dynamicFilters, dateRange,
    activeOverlays, smaWindow, forecastHorizon, activeInsightsTab,
  }), [
    liveColumnMeta, liveSchemaReady, liveFilterOptions,
    livePeriodAggregates, liveDimensionAggregates, liveAggLoading,
    liveRowCount, liveDataTruncated, liveMetricConfig, liveDataError,
    dataFrequency, metric, view, topX, categorySelectionMode,
    selectedCategories, dynamicFilters, dateRange,
    activeOverlays, smaWindow, forecastHorizon, activeInsightsTab,
  ]);

  // Restore per-tab state from a snapshot
  const restoreTabSnapshot = React.useCallback((snap) => {
    // Live data state
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
    // UI state
    const grainToFreq = { day: 'Daily', week: 'Weekly', month: 'Monthly', quarter: 'Quarterly', year: 'Yearly' };
    const defaultFromGrain = snap.liveMetricConfig?.defaultGrain ? grainToFreq[snap.liveMetricConfig.defaultGrain] : null;
    setDataFrequency(snap.dataFrequency || defaultFromGrain || 'Monthly');
    setMetric(snap.metric || 'metric1');
    setView(snap.view || 'Overall');
    setTopX(snap.topX != null ? snap.topX : 3);
    setCategorySelectionMode(snap.categorySelectionMode || 'topX');
    setSelectedCategories(snap.selectedCategories || []);
    setDynamicFilters(snap.dynamicFilters || {});
    setDateRange(snap.dateRange || '1Y');
    setActiveOverlays(snap.activeOverlays || { yoy: true, forecast_linear: true });
    setSmaWindow(snap.smaWindow || 3);
    setForecastHorizon(snap.forecastHorizon || 3);
    setActiveInsightsTab(snap.activeInsightsTab || null);
  }, []);

  // Persist UI selections to localStorage (debounced) for page refresh restore
  const uiSelectionsSaveTimerRef = React.useRef(null);
  React.useEffect(() => {
    if (!connectionParams || !liveSchemaReady) return;
    // Debounce to avoid excessive writes
    clearTimeout(uiSelectionsSaveTimerRef.current);
    uiSelectionsSaveTimerRef.current = setTimeout(() => {
      const selectionsKey = 'uiSelections_' + connectionParams.supabaseUrl + '_' + activeTabId;
      const selections = {
        dataFrequency, metric, view, topX, categorySelectionMode,
        selectedCategories, dynamicFilters, dateRange,
        activeOverlays, smaWindow, forecastHorizon, activeInsightsTab,
      };
      try { localStorage.setItem(selectionsKey, JSON.stringify(selections)); } catch (e) {}
    }, 500);
    return () => clearTimeout(uiSelectionsSaveTimerRef.current);
  }, [connectionParams, liveSchemaReady, activeTabId, dataFrequency, metric, view, topX,
      categorySelectionMode, selectedCategories, dynamicFilters, dateRange,
      activeOverlays, smaWindow, forecastHorizon, activeInsightsTab]);

  const switchTab = React.useCallback((targetTabId) => {
    if (targetTabId === activeTabId) return;
    // Save current tab state
    if (activeTabId) {
      tabStateCacheRef.current[activeTabId] = captureTabSnapshot();
    }
    // Restore target tab state (or defaults if first visit)
    const cached = tabStateCacheRef.current[targetTabId];
    if (cached) {
      restoreTabSnapshot(cached);
    } else {
      // Reset to defaults — schema fetch effect will fire due to connectionParams change
      restoreTabSnapshot({});
      setLiveDataLoading(true);
    }
    // Clear query cache when switching datasets
    queryCacheRef.current.clear();
    setActiveTabId(targetTabId);
    // Persist active tab for page refresh
    if (configId) { try { localStorage.setItem('activeTabId_' + configId, targetTabId); } catch (e) {} }
  }, [activeTabId, configId, captureTabSnapshot, restoreTabSnapshot]);

  const addTab = React.useCallback((name, dataset) => {
    const id = 'tab_' + (++tabNextIdRef.current);
    const newTab = { id, name, dataset: dataset || null };
    // Save current tab state before switching
    if (activeTabId) {
      tabStateCacheRef.current[activeTabId] = captureTabSnapshot();
    }
    setTabs(prev => [...prev, newTab]);
    setActiveTabId(id);
    // Reset state for new tab
    restoreTabSnapshot({});
    queryCacheRef.current.clear();
    if (dataset) {
      // Dataset provided — schema fetch effect will fire
      setLiveDataLoading(true);
    } else {
      // No dataset yet — open Configure Metrics so user can set it
      setLiveDataLoading(false);
      setLiveSchemaReady(false);
      setTimeout(() => {
        setMetricsEditorDraft({});
        setMetricsEditorError('');
        setExpandedMetricSlot(null);
        setShowMetricsEditor(true);
      }, 50);
    }
  }, [activeTabId, captureTabSnapshot, restoreTabSnapshot]);

  const removeTab = React.useCallback((tabId) => {
    const tab = tabs.find(t => t.id === tabId);
    if (!window.confirm('Delete tab "' + (tab?.name || 'Untitled') + '"? This cannot be undone.')) return;
    setTabs(prev => {
      const remaining = prev.filter(t => t.id !== tabId);
      if (remaining.length === 0) return prev; // Don't remove last tab
      delete tabStateCacheRef.current[tabId];
      // If removing active tab, switch to adjacent
      if (tabId === activeTabId) {
        const idx = prev.findIndex(t => t.id === tabId);
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
    setTabs(prev => prev.map(t => t.id === tabId ? { ...t, name: newName } : t));
  }, []);

  // Dynamic styles - only properties that change based on state (Optimization #3)
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
        borderRadius: "0",
      },
      controlsContainer: {
        backgroundColor: isDarkMode ? "#334155" : theme.bgPrimary,
        borderRadius: "12px",
        width: "100%",
        overflowX: "hidden",
        overflowY: "visible",
        border: "none",
        boxShadow: isDarkMode
          ? "0 2px 8px rgba(0, 0, 0, 0.4)"
          : "0 1px 3px rgba(0, 0, 0, 0.1)",
      },
      chartContainer: {
        backgroundColor: isDarkMode ? "#334155" : theme.bgPrimary,
        borderRadius: "12px",
        flex: 1,
        overflow: "hidden",
        position: "relative",
        border: "none",
        boxShadow: isDarkMode
          ? "0 2px 8px rgba(0, 0, 0, 0.4)"
          : "0 1px 3px rgba(0, 0, 0, 0.1)",
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
        boxShadow: isDarkMode
          ? "0 2px 8px rgba(0, 0, 0, 0.4)"
          : "0 1px 3px rgba(0, 0, 0, 0.1)",
        transition: "all 0.2s ease",
      },
      select: {
        ...STATIC_STYLES.base.input,
        cursor: "pointer",
        minWidth: "140px",
      },
      filterSuggestionsDropdown: {
        position: "fixed",
        backgroundColor: theme.bgPrimary,
        border: `1px solid ${theme.borderSecondary}`,
        borderRadius: "6px",
        maxHeight: "400px",
        overflowY: "auto",
        zIndex: 10000,
      },
      dateRangeGroup: {
        ...STATIC_STYLES.buttonGroup,
        padding: "1px",
      },
      dateRangeButton: {
        ...STATIC_STYLES.buttonGroupBtn,
        fontSize: "11px",
        padding: "5px 10px",
      },
      dateRangeButtonActive: STATIC_STYLES.buttonGroupBtnActive,
      dataFrequencyGroup: {
        ...STATIC_STYLES.buttonGroup,
        padding: "1px",
      },
      dataFrequencyButton: {
        ...STATIC_STYLES.buttonGroupBtn,
        padding: "5px 10px",
      },
      dataFrequencyButtonActive: STATIC_STYLES.buttonGroupBtnActive,
      topXModeButton: {
        flex: 1,
        ...STATIC_STYLES.buttonGroupBtn,
        padding: "6px 12px",
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
        justifyContent: "center",
      },
      advancedFiltersPanel: {
        position: "fixed",
        top: "0",
        right: showAdvancedFilters ? "0" : "-370px",
        width: "370px",
        height: "100vh",
        backgroundColor: theme.bgPrimary,
        zIndex: 1000,
        overflowY: "auto",
        borderLeft: `1px solid ${
          isDarkMode ? "rgba(75, 85, 99, 0.3)" : "rgba(229, 231, 235, 0.6)"
        }`,
        boxShadow: isDarkMode
          ? "-4px 0 12px rgba(0, 0, 0, 0.3)"
          : "-4px 0 12px rgba(0, 0, 0, 0.1)",
        display: showAdvancedFilters ? "block" : "none",
      },
      queryContainer: {
        backgroundColor: "transparent",
        borderRadius: "0",
        padding: "0 0 18px 0",
        width: "100%",
        position: "relative",
        border: "none",
        boxShadow: "none",
      },
      structuredInsightsContainer: {
        backgroundColor: "transparent",
        borderRadius: "0",
        padding: "20px 0 0 0",
        marginTop: "12px",
        border: "none",
        boxShadow: "none",
      },
      summaryContainer: {
        ...STATIC_STYLES.base.card,
        padding: showDataSummary ? "16px" : "0px 16px 6px 16px",
        marginTop: showDataSummary ? "8px" : "4px",
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
        overflow: "hidden",
      },
      proTipIcon: {
        fontSize: "14px",
        flexShrink: 0,
      },
      proTipContent: {
        flex: 1,
        display: "flex",
        alignItems: "center",
        gap: "6px",
        minWidth: 0,
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
        flexShrink: 0,
      },
      proTipTitle: {
        fontWeight: "600",
        fontSize: "12px",
        color: "#a16207",
        marginRight: "4px",
        flexShrink: 0,
      },
      proTipText: {
        fontSize: "11px",
        color: "#854d0e",
        lineHeight: "1.3",
        overflow: "hidden",
        textOverflow: "ellipsis",
      },
      proTipNavigation: {
        display: "flex",
        alignItems: "center",
        gap: "4px",
        flexShrink: 0,
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
        transition: "all 0.15s ease",
      },
      proTipCounter: {
        fontSize: "10px",
        color: "#a16207",
        fontWeight: "500",
        minWidth: "32px",
        textAlign: "center",
      },
    }),
    [showAdvancedFilters, showDataSummary, isDarkMode]
  );

  // Auto-switch Date Range to "All" when Yearly aggregation is selected
  React.useEffect(() => {
    if (dataFrequency === "Yearly" && dateRange !== "All") {
      setDateRange("All");
    }
  }, [dataFrequency]);

  const [filterSearchText, setFilterSearchText] = React.useState("");
  const [debouncedFilterSearchText, setDebouncedFilterSearchText] =
    React.useState("");
  const [showFilterSuggestions, setShowFilterSuggestions] =
    React.useState(false);
  const filterSearchInputRef = React.useRef(null);
  const filterSuggestionsDropdownRef = React.useRef(null);
  const [dropdownStyle, setDropdownStyle] = React.useState({});

  const [showAllShareTraces, setShowAllShareTraces] = React.useState(false);
  const [showAllGrowthTraces, setShowAllGrowthTraces] = React.useState(false);
  const [showAllDollarTraces, setShowAllDollarTraces] = React.useState(true);

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
      decomposition: [], // 🆕 NEW - excess growth decomposition
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
  });
  const INSIGHT_LIMITS = {
    generation: {
      performanceAlerts: 15,
      overallTrends: 10,
      categoryTrends: 20,
      shareShifts: 20,
      marketLeaders: 15,
      allTimeGrowth: 15,
    },
    pagination: {
      perPage: 3, // Consistent across all categories
    },
  };

  const [expandedFilters, setExpandedFilters] = React.useState({});

  const [history, setHistory] = React.useState([]);
  const isRestoringRef = React.useRef(false);
  const previousStateRef = React.useRef(null);
  const isExecutingQueryRef = React.useRef(false);
  const filterDropdownPositionRef = React.useRef(null);

  const [showShareModal, setShowShareModal] = React.useState(false);
  const [shareCode, setShareCode] = React.useState("");

  // Save View state
  const [showSaveViewModal, setShowSaveViewModal] = React.useState(false);
  const [saveViewName, setSaveViewName] = React.useState("");
  const [saveViewOwnerType, setSaveViewOwnerType] = React.useState("username"); // "username" | "team" | "custom"
  const [saveViewCustomOwner, setSaveViewCustomOwner] = React.useState("");
  const [saveViewError, setSaveViewError] = React.useState("");
  const [saveViewSuccess, setSaveViewSuccess] = React.useState("");
  const [username, setUsername] = React.useState("");
  const [teamName, setTeamName] = React.useState("");
  const [savedViews, setSavedViews] = React.useState([]);
  const [selectedSavedView, setSelectedSavedView] = React.useState("");

  // Performance timing - using refs to avoid causing re-renders
  const renderCountRef = React.useRef(0);
  const filterTimeRef = React.useRef(0);
  const renderStartTime = performance.now(); // Captured at start of each render

  const hasCheckedInitialLoadRef = React.useRef(false);

  const [scenario1, setScenario1] = React.useState(null);
  const [scenario2, setScenario2] = React.useState(null);
  const [scenario3, setScenario3] = React.useState(null);
  const [activeScenarios, setActiveScenarios] = React.useState({
    scenario1: false,
    scenario2: false,
    scenario3: false,
  });
  const [scenarioLabels, setScenarioLabels] = React.useState({
    scenario1: "Scenario 1",
    scenario2: "Scenario 2",
    scenario3: "Scenario 3",
  });
  const [showScenarioPanel, setShowScenarioPanel] = React.useState(false);

  // Legend visibility state - tracks which traces are visible/hidden after user interactions
  const [traceVisibility, setTraceVisibility] = React.useState({});
  const chartRef = React.useRef(null);

  // Guide state
  const [showGuide, setShowGuide] = React.useState(false);
  const [guideStep, setGuideStep] = React.useState(0);
  const [showGuideButton, setShowGuideButton] = React.useState(true);
  const guideTargetRefs = React.useRef({});

  // Pro Tips state - start with random tip on each page load
  const PRO_TIPS = React.useMemo(
    () => [
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
        title: "Compare Scenarios",
        text: 'Use the "📊" button to capture and compare up to 3 different scenarios. Currently in Beta version.',
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
    ],
    []
  );

  // Start with a random tip on each page load
  const [currentTipIndex, setCurrentTipIndex] = React.useState(() =>
    Math.floor(Math.random() * 8)
  );

  // Cycle through pro tips every 120 seconds
  React.useEffect(() => {
    const tipInterval = setInterval(() => {
      setCurrentTipIndex((prev) => (prev + 1) % PRO_TIPS.length);
    }, 120000); // 120 seconds
    return () => clearInterval(tipInterval);
  }, [PRO_TIPS.length]);

  // Cache for insights to avoid regeneration on tab/metric switches
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
      insightContext: insightContext ? { ...insightContext } : null,
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
    FILTER_CONFIG,
  ]);

  const restoreStateSnapshot = React.useCallback(
    (snapshot) => {
      isRestoringRef.current = true;
      setDataFrequency(snapshot.dataFrequency);
      setMetric(snapshot.metric);
      setInsightContext(snapshot.insightContext || null); // 🆕 Restore investigation context
      setTopX(snapshot.topX);
      setDateRange(snapshot.dateRange);
      setActiveInsightsTab(snapshot.activeInsightsTab);
      FILTER_CONFIG.forEach(({ key, setState }) => {
        if (snapshot[key]) {
          setState(snapshot[key]);
        }
      });
      if (snapshot.showAllShareTraces !== undefined) {
        setShowAllShareTraces(snapshot.showAllShareTraces);
      }
      if (snapshot.showAllGrowthTraces !== undefined) {
        setShowAllGrowthTraces(snapshot.showAllGrowthTraces);
      }
      if (snapshot.showAllDollarTraces !== undefined) {
        setShowAllDollarTraces(snapshot.showAllDollarTraces);
      }
      if (snapshot.selectedCategories) {
        setSelectedCategories([...snapshot.selectedCategories]);
      }
      if (snapshot.categorySelectionMode) {
        setCategorySelectionMode(snapshot.categorySelectionMode);
      }
      // Restore scenario comparison state
      if (snapshot.scenario1 !== undefined) {
        setScenario1(snapshot.scenario1);
      }
      if (snapshot.scenario2 !== undefined) {
        setScenario2(snapshot.scenario2);
      }
      if (snapshot.scenario3 !== undefined) {
        setScenario3(snapshot.scenario3);
      }
      if (snapshot.activeScenarios !== undefined) {
        setActiveScenarios({ ...snapshot.activeScenarios });
      }
      if (snapshot.scenarioLabels !== undefined) {
        setScenarioLabels({ ...snapshot.scenarioLabels });
      }
      if (snapshot.showScenarioPanel !== undefined) {
        setShowScenarioPanel(snapshot.showScenarioPanel);
      }
      // Restore legend visibility state
      if (snapshot.traceVisibility !== undefined) {
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

  // Apply pending shared state (?s= param) after schema is ready
  React.useEffect(() => {
    if (!liveSchemaReady || !pendingStateRef.current) return;
    const state = pendingStateRef.current;
    pendingStateRef.current = null;
    if (restoreStateSnapshotRef.current) {
      try { restoreStateSnapshotRef.current(state); } catch (e) { console.warn('Failed to restore shared state:', e); }
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
          behavior: "smooth",
        });
      } else {
        element.scrollIntoView({
          behavior: "smooth",
          block: "center",
          inline: "nearest",
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

      // If moving to the Top X step and view is Overall, automatically switch to first available view
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

  // Share code utilities (delegated to src/shareCode.js)
  const compressState = React.useCallback(
    (snapshot) => compressStateUtil(snapshot, DIMENSION_DEFINITIONS),
    [DIMENSION_DEFINITIONS]
  );

  const generateShareCode = React.useCallback(() => {
    const snapshot = captureStateSnapshot();
    return generateShareCodeUtil(snapshot, DIMENSION_DEFINITIONS);
  }, [captureStateSnapshot, DIMENSION_DEFINITIONS]);

  const decodeShareCode = React.useCallback(
    (code) => decodeShareCodeUtil(code, DIMENSION_DEFINITIONS),
    [DIMENSION_DEFINITIONS]
  );

  const handleShareClick = React.useCallback(async () => {
    if (!configId) return;
    const snapshot = captureStateSnapshot();
    snapshot.activeTabId = activeTabId;
    const stateStr = btoa(JSON.stringify(snapshot)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    const url = window.location.origin + window.location.pathname + '#/' + configId + '?s=' + stateStr;
    try { await navigator.clipboard.writeText(url); } catch (e) {}
    setShareCode(url);
    setShowShareModal(true);
  }, [captureStateSnapshot, activeTabId, configId]);

  // Save View - Google Sheets helper function
  const saveToGoogleSheets = React.useCallback((viewData) => {
    // Google Apps Script Web App URL (placeholder - replace with your deployment URL)
    const WEB_APP_URL =
      "https://your-apps-script-deployment-url.example.com/exec";

    const query = new URLSearchParams({
      timestamp: viewData.timestamp || "",
      viewName: viewData.viewName || "",
      owner: viewData.owner || "",
      ownerType: viewData.ownerType || "",
      configurationCode: viewData.configurationCode || "",
    }).toString();

    const fullUrl = WEB_APP_URL + "?" + query;

    // Open in new tab to bypass CSP/CORS restrictions
    // This is the most reliable method for restrictive iframe environments
    window.open(fullUrl, "_blank", "noopener,noreferrer");

    // Always resolve - if popup was blocked, user will notice and can manually allow
    return Promise.resolve({ success: true, url: fullUrl });
  }, []);

  // Load Saved View handler
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

      // Decode and apply the configuration
      const decodedState = decodeShareCode(savedView.code);
      if (decodedState) {
        isRestoringRef.current = true;
        restoreStateSnapshot(decodedState);
        setTimeout(() => {
          isRestoringRef.current = false;
        }, 100);
        setSelectedSavedView(viewName);
      }
    },
    [savedViews, decodeShareCode, restoreStateSnapshot]
  );

  // Save View handler
  const handleSaveView = React.useCallback(() => {
    // Validation
    if (!saveViewName.trim()) {
      setSaveViewError("Please enter a view name");
      return;
    }

    if (saveViewOwnerType === "custom" && !saveViewCustomOwner.trim()) {
      setSaveViewError("Please enter a custom owner name");
      return;
    }

    // Determine the owner based on selection
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

    // Generate the configuration code
    const configCode = generateShareCode();

    // Prepare data for Google Sheets
    const viewData = {
      viewName: saveViewName.trim(),
      owner: owner,
      ownerType: ownerType,
      configurationCode: configCode,
      timestamp: new Date().toISOString().split("T")[0], // Format as YYYY-MM-DD
    };

    // Call the Google Sheets API (returns a promise)
    saveToGoogleSheets(viewData)
      .then(() => {
        setSaveViewSuccess(
          "Saving... Check the new tab that opened. If you don't see a new tab, please allow popups for this site."
        );
        setSaveViewError("");

        // Clear form after 3 seconds (give user time to read message)
        setTimeout(() => {
          setShowSaveViewModal(false);
          setSaveViewName("");
          setSaveViewCustomOwner("");
          setSaveViewOwnerType("username");
          setSaveViewSuccess("");
        }, 3000);
      })
      .catch((error) => {
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
    generateShareCode,
    saveToGoogleSheets,
  ]);

  // Helper function to compare arrays for equality (DRY)
  const arraysEqual = (a, b) => {
    if (a === b) return true;
    if (!a || !b) return false;
    return JSON.stringify(a) === JSON.stringify(b);
  };

  // Debounce filter search text to improve performance (150ms delay)
  React.useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedFilterSearchText(filterSearchText);
    }, 150);
    return () => clearTimeout(timeoutId);
  }, [filterSearchText]);

  // Auto-load shared configuration if present (using extracted metadata)
  React.useEffect(() => {
    // Only check once we have data, and only check once
    if (hasCheckedInitialLoadRef.current) return;
    if (!metadataVariables.shared_configuration) return;

    // Mark as checked only after we've processed (or attempted to process) with valid data
    hasCheckedInitialLoadRef.current = true;

    // Ensure it's a string before processing
    const sharedConfigValue = metadataVariables.shared_configuration;
    if (
      typeof sharedConfigValue === "string" &&
      sharedConfigValue.trim().length > 0
    ) {
      const codeFromData = sharedConfigValue.trim();
      const decodedState = decodeShareCode(codeFromData);
      if (decodedState) {
        // Set restoring flag to prevent history tracking during initial load
        isRestoringRef.current = true;
        restoreStateSnapshot(decodedState);
        setTimeout(() => {
          isRestoringRef.current = false;
        }, 100);
      }
    }
  }, [metadataVariables, decodeShareCode, restoreStateSnapshot]);


  // Set username and team from extracted metadata
  React.useEffect(() => {
    if (metadataVariables.username && !username) {
      setUsername(metadataVariables.username.toString());
    }
    if (metadataVariables.team && !teamName) {
      setTeamName(metadataVariables.team.toString());
    }
  }, [metadataVariables, username, teamName]);

  // Set saved views from extracted metadata
  React.useEffect(() => {
    if (metadataVariables.saved_views.length > 0) {
      setSavedViews(metadataVariables.saved_views);
    }
  }, [metadataVariables]);

  // Track state changes and save to history
  React.useEffect(() => {
    // Skip saving history when restoring (to avoid infinite loops)
    if (isRestoringRef.current) {
      previousStateRef.current = captureStateSnapshot();
      return;
    }

    const currentSnapshot = captureStateSnapshot();

    // Initialize previous state ref on first run
    if (previousStateRef.current === null) {
      previousStateRef.current = currentSnapshot;
      return;
    }

    // If we have a previous state and it's different from current, save it to history
    const prevSnapshot = previousStateRef.current;
    // Check if state actually changed (DRY: using helper for array comparisons)
    const hasChanged =
      prevSnapshot.dataFrequency !== currentSnapshot.dataFrequency ||
      prevSnapshot.metric !== currentSnapshot.metric ||
      prevSnapshot.view !== currentSnapshot.view ||
      prevSnapshot.topX !== currentSnapshot.topX ||
      prevSnapshot.dateRange !== currentSnapshot.dateRange ||
      // Check all filters using FILTER_CONFIG_STATIC (only need key)
      FILTER_CONFIG_STATIC.some(
        ({ key }) => !arraysEqual(prevSnapshot[key], currentSnapshot[key])
      );

    if (hasChanged) {
      // Save previous state to history
      setHistory((prev) => {
        // Keep only last 10 states to reduce memory usage
        const newHistory = [...prev, prevSnapshot];
        return newHistory.slice(-10);
      });
    }

    // Update previous state ref for next comparison
    previousStateRef.current = currentSnapshot;
  }, [
    dataFrequency,
    metric,
    view,
    topX,
    dateRange,
    captureStateSnapshot,
    FILTER_CONFIG,
  ]);

  // Reset selected categories when view changes
  React.useEffect(() => {
    // Skip resetting trace visibility during state restoration or query execution
    if (isRestoringRef.current || isExecutingQueryRef.current) {
      return;
    }

    setSelectedCategories([]);
    setCategorySelectionMode("topX");
    setShowTopXControl(false);
    setCategorySearchText("");
  }, [view]);

  // Close dropdowns when clicking outside (consolidated handler)
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      // Close Top X dropdown
      if (showTopXControl && !event.target.closest("[data-topx-control]")) {
        setShowTopXControl(false);
      }
      // Close filter suggestions dropdown
      if (
        showFilterSuggestions &&
        filterSearchInputRef.current &&
        filterSuggestionsDropdownRef.current &&
        !filterSearchInputRef.current.contains(event.target) &&
        !filterSuggestionsDropdownRef.current.contains(event.target)
      ) {
        setShowFilterSuggestions(false);
      }
      // Close add-tab dropdown
      if (showAddTab && !event.target.closest("[data-add-tab]")) {
        setShowAddTab(false);
        setNewTabDataset('');
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showTopXControl, showFilterSuggestions, showAddTab]);

  // Hide Guide Me button after 2 minutes
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setShowGuideButton(false);
    }, 120000); // 2 minutes = 120000 milliseconds

    return () => clearTimeout(timer);
  }, []);

  // Toggle filter expansion
  const toggleFilterExpansion = React.useCallback((filterName) => {
    setExpandedFilters((prev) => ({
      ...prev,
      [filterName]: !prev[filterName],
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
      },
    }),
    []
  );

  const formatFilterName = React.useCallback(
    (filterName) => formatFilterNameUtil(filterName),
    []
  );

  // Helper function to render a dropdown filter
  const renderDropdownFilter = React.useCallback(
    (
      filterName,
      label,
      options,
      selectedValues,
      onSelectionChange,
      formatValue = formatFilterName
    ) => {
      const isExpanded = expandedFilters[filterName];
      const allSelected =
        selectedValues.length === 0 || selectedValues.length === options.length;
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

      return (
        <div style={styles.inputGroup}>
          <div style={styles.filterDropdown}>
            <div
              style={styles.filterDropdownHeader}
              onClick={() => toggleFilterExpansion(filterName)}
            >
              <div style={styles.filterDropdownTitle}>
                <span>{label}</span>
                {selectedCount > 0 && !allSelected && (
                  <span style={styles.filterSelectedCount}>
                    ({selectedCount} selected)
                  </span>
                )}
                {allSelected && (
                  <span style={styles.filterSelectedCount}>(All)</span>
                )}
              </div>
              <span
                style={{
                  ...styles.filterDropdownChevron,
                  transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                }}
              >
                ▼
              </span>
            </div>
            {isExpanded && (
              <div style={styles.filterDropdownContent}>
                <div
                  style={
                    allSelected
                      ? styles.checkboxItemSelected
                      : styles.checkboxItemUnselected
                  }
                  onClick={handleAllToggle}
                >
                  <input
                    type="checkbox"
                    style={styles.checkboxInput}
                    checked={allSelected}
                    onChange={handleAllToggle}
                  />
                  <span style={styles.checkboxLabel}>All</span>
                </div>
                {options.map((option) => {
                  const isSelected = selectedValues.includes(option);
                  return (
                    <div
                      key={String(option)}
                      style={
                        isSelected
                          ? styles.checkboxItemSelected
                          : styles.checkboxItemUnselected
                      }
                      onClick={() => handleOptionToggle(option)}
                    >
                      <input
                        type="checkbox"
                        style={styles.checkboxInput}
                        checked={isSelected}
                        onChange={() => handleOptionToggle(option)}
                      />
                      <span style={styles.checkboxLabel}>
                        {formatValue(option)}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      );
    },
    [expandedFilters, toggleFilterExpansion, formatFilterName]
  );

  // Helper function to render tooltip icon
  const renderTooltipIcon = React.useCallback(
    (categoryKey, tooltipText) => {
      const isVisible = showInsightTooltips[categoryKey];
      return (
        <div
          style={styles.queryTooltipIcon}
          onMouseEnter={() => {
            setShowInsightTooltips((prev) => ({
              ...prev,
              [categoryKey]: true,
            }));
          }}
          onMouseLeave={() => {
            setShowInsightTooltips((prev) => ({
              ...prev,
              [categoryKey]: false,
            }));
          }}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={styles.block}
          >
            <circle
              cx="10"
              cy="10"
              r="9"
              stroke="currentColor"
              strokeWidth="1.5"
              fill="none"
            />
            <path
              d="M10 6v.01"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <path
              d="M10 9v5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
          {isVisible && (
            <div style={styles.queryTooltip}>
              <div style={styles.queryTooltipArrow}></div>
              <div style={styles.fontWeight600}>How it's calculated</div>
              <div style={styles.textGray}>{tooltipText}</div>
            </div>
          )}
        </div>
      );
    },
    [showInsightTooltips, styles]
  );

  // ==================== INSIGHT SENTIMENT & COLORING ====================

  const getInsightSentiment = React.useCallback(
    (insightText) => getInsightSentimentUtil(insightText),
    []
  );

  const getSentimentColors = React.useCallback(
    (sentiment) => getSentimentColorsUtil(sentiment, isDarkMode),
    [isDarkMode]
  );

  // Colorize keywords in insight text (uses JSX, stays in main file)
  const colorizeInsightText = React.useCallback(
    (insightText, sentiment) => {
      const colors = getSentimentColorsUtil(sentiment, isDarkMode);
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
          <span key={match.index} style={{ color: colors.text, fontWeight: "600" }}>
            {match[0]}
          </span>
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

  // ==================== END INSIGHT SENTIMENT & COLORING ====================

  // 🚀 PERFORMANCE: Memoized insight item component to prevent unnecessary re-renders
  // Sentiment + colorization + borderColor computed once here (not duplicated in parent)
  const InsightItem = React.memo(
    ({
      insight,
      index,
      isHovered,
      colorConfig,
      showSentimentBorder,
      setHoveredInsight,
    }) => {
      // Single sentiment computation per insight (parent no longer duplicates this)
      const sentiment = getInsightSentiment(insight.text);
      const colorizedText = colorizeInsightText(insight.text, sentiment);
      const borderColor = showSentimentBorder
        ? getSentimentColors(sentiment).border
        : colorConfig.borderColor;

      // Stable callbacks using useCallback
      const handleMouseEnter = React.useCallback(() => {
        setHoveredInsight(insight);
      }, [insight, setHoveredInsight]);

      const handleMouseLeave = React.useCallback(() => {
        setHoveredInsight(null);
      }, [setHoveredInsight]);

      return (
        <div
          style={{
            ...styles.insightItem,
            borderLeft: `4px solid ${borderColor}`,
            backgroundColor: isHovered
              ? colorConfig.hoverBackgroundColor
              : colorConfig.backgroundColor,
          }}
          onClick={insight.action}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <span style={styles.insightNumber}>{index + 1}.</span>
          <span style={styles.insightText}>{colorizedText}</span>
        </div>
      );
    }
  );

  // Helper function to render an insight category section with tooltips and pagination
  const renderInsightCategory = React.useCallback(
    (
      insights,
      title,
      categoryKey,
      tooltipText = null,
      colorConfig = {
        borderColor: theme.accentPrimary,
        backgroundColor: theme.bgSecondary,
        hoverBackgroundColor: theme.statBoxActiveBg,
        hoverBorderColor: theme.accentPrimary,
      }
    ) => {
      if (!insights || insights.length === 0) return null;

      // Get pagination state for this category
      // Consistent 3 per page for all categories
      const insightsPerPage = INSIGHT_LIMITS.pagination.perPage;
      const currentPage = insightPagination[categoryKey] || 0;
      const startIndex = currentPage * insightsPerPage;
      const endIndex = startIndex + insightsPerPage;
      const paginatedInsights = insights.slice(startIndex, endIndex);
      const totalPages = Math.ceil(insights.length / insightsPerPage);
      const hasPagination = insights.length > insightsPerPage;

      return (
        <div style={styles.categorySection}>
          <h4 style={styles.categoryTitle}>
            {title}
            {tooltipText && renderTooltipIcon(categoryKey, tooltipText)}
          </h4>
          <div style={styles.insightsList}>
            {paginatedInsights.map((insight, index) => {
              return (
                <InsightItem
                  key={insight.text + startIndex + index}
                  insight={insight}
                  index={startIndex + index}
                  isHovered={hoveredInsight === insight}
                  colorConfig={colorConfig}
                  showSentimentBorder={SHOW_SENTIMENT_BORDER}
                  setHoveredInsight={setHoveredInsight}
                />
              );
            })}
          </div>
          {hasPagination && (
            <div style={{ ...styles.flexBetween, marginTop: "12px" }}>
              <button
                style={{
                  padding: "4px 12px",
                  border: "1px solid #d1d5db",
                  borderRadius: "4px",
                  backgroundColor: currentPage === 0 ? "#f3f4f6" : "white",
                  color: currentPage === 0 ? "#9ca3af" : "#374151",
                  cursor: currentPage === 0 ? "not-allowed" : "pointer",
                  fontSize: "12px",
                }}
                onClick={() => {
                  if (currentPage > 0) {
                    setInsightPagination((prev) => ({
                      ...prev,
                      [categoryKey]: currentPage - 1,
                    }));
                  }
                }}
                disabled={currentPage === 0}
              >
                Previous
              </button>
              <span style={{ fontSize: "12px", color: "#6b7280" }}>
                Page {currentPage + 1} of {totalPages} ({insights.length} total)
              </span>
              <button
                style={{
                  padding: "4px 12px",
                  border: "1px solid #d1d5db",
                  borderRadius: "4px",
                  backgroundColor:
                    currentPage >= totalPages - 1 ? "#f3f4f6" : "white",
                  color: currentPage >= totalPages - 1 ? "#9ca3af" : "#374151",
                  cursor:
                    currentPage >= totalPages - 1 ? "not-allowed" : "pointer",
                  fontSize: "12px",
                }}
                onClick={() => {
                  if (currentPage < totalPages - 1) {
                    setInsightPagination((prev) => ({
                      ...prev,
                      [categoryKey]: currentPage + 1,
                    }));
                  }
                }}
                disabled={currentPage >= totalPages - 1}
              >
                Next
              </button>
            </div>
          )}
        </div>
      );
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
      isDarkMode,
    ]
  );

  // Helper function to check if a filter value matches (for multi-select filters)
  // Returns true if filter array is empty (all selected) or if value is in the array
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

  // ===== LIVE MODE: FETCH AGGREGATED DATA FROM RPC =====
  // Fires whenever controls change in live mode (frequency, view, filters)
  const liveAggRequestRef = React.useRef(0);
  React.useEffect(() => {
    if (!isLiveMode || !liveMetricConfig) return;
    const requestId = ++liveAggRequestRef.current;
    setLiveAggLoading(true);

    const grain = frequencyToGrain[dataFrequency] || "month";
    const dateCol = liveMetricConfig.dateColumn || liveDateColumn;
    const rpcMetrics = buildRpcMetrics(liveMetricConfig);

    // Build p_filters from dynamicFilters (strip dim_ prefix and _filter suffix to get column name)
    const pFilters = {};
    Object.keys(dynamicFilters).forEach(filterKey => {
      const vals = dynamicFilters[filterKey];
      if (!vals || vals.length === 0) return;
      // filterKey format: "dim_column_name_filter"
      const colName = filterKey.replace(/^dim_/, '').replace(/_filter$/, '');
      // Reverse-transform boolean display values back to raw true/false for the DB query
      if (liveBooleanColumns.has(colName)) {
        pFilters[colName] = vals.map(v => {
          const suffix = v.replace(colName + '_', '');
          return suffix === 'true' ? true : suffix === 'false' ? false : v;
        });
      } else {
        pFilters[colName] = vals;
      }
    });

    // Determine active dimension column for split-by view
    const viewConfig = view !== "Overall" ? VIEW_CONFIG[view] : null;
    const dimColumn = viewConfig ? viewConfig.column : null;

    // Call 1: Period aggregates (overall, no dimension split)
    const periodPromise = cachedQuery('data', {
      p_time_grain: grain,
      p_date_column: dateCol,
      p_metrics: rpcMetrics,
      p_filters: pFilters,
    });

    // Call 2: Dimension aggregates (only if a dimension is selected)
    // Pass p_top_n to bucket high-cardinality dimensions server-side
    const dimPromise = dimColumn
      ? cachedQuery('data', {
          p_time_grain: grain,
          p_date_column: dateCol,
          p_group_by: [dimColumn],
          p_metrics: rpcMetrics,
          p_filters: pFilters,
          ...(topX > 0 ? { p_top_n: topX } : {}),
          // p_rank_by omitted — requires updated query_dataset RPC (migration 015)
        })
      : Promise.resolve(null);

    const hasMetric3 = !!liveMetricConfig.derivedAggType || liveMetricConfig.derivedMode === 'formula';
    const formulaConfigs = {};
    if (liveMetricConfig.volumeMode === 'formula') formulaConfigs.volume = { operator: liveMetricConfig.volumeFormulaOperator || '/' };
    if (liveMetricConfig.revenueMode === 'formula') formulaConfigs.revenue = { operator: liveMetricConfig.revenueFormulaOperator || '/' };
    if (liveMetricConfig.derivedMode === 'formula') formulaConfigs.derived = { operator: liveMetricConfig.derivedFormulaOperator || '/' };
    const formulaConfigsArg = Object.keys(formulaConfigs).length > 0 ? formulaConfigs : null;
    Promise.all([periodPromise, dimPromise])
      .then(([periodData, dimData]) => {
        if (requestId !== liveAggRequestRef.current) return; // Stale response
        const periodAggs = transformToPeriodAggregates(periodData.rows || [], hasMetric3, formulaConfigsArg);
        setLivePeriodAggregates(periodAggs);
        // Show row count from the most granular query: dimension query if active, else period query
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
      })
      .catch(err => {
        if (requestId !== liveAggRequestRef.current) return;
        console.error('[Dashboard] Aggregation fetch error:', err);
        setLiveAggLoading(false);
      });
  }, [isLiveMode, liveMetricConfig, dataFrequency, dynamicFilters, view, VIEW_CONFIG, liveDateColumn, cachedQuery, topX, liveBooleanColumns]);

  // Fetch dimension aggregates for visible dimensions when insights tab is open in live mode.
  // Uses only visibleDimensions (from Configure Metrics) and a concurrency limit of 3 to
  // avoid overwhelming Supabase with parallel requests.
  React.useEffect(() => {
    if (!isLiveMode || !activeInsightsTab || !liveMetricConfig) return;
    let cancelled = false;

    const grain = frequencyToGrain[dataFrequency] || "month";
    const dateCol = liveMetricConfig.dateColumn || liveDateColumn;
    const rpcMetrics = buildRpcMetrics(liveMetricConfig);
    const pFilters = {};
    Object.keys(dynamicFilters).forEach(filterKey => {
      const vals = dynamicFilters[filterKey];
      if (!vals || vals.length === 0) return;
      const colName = filterKey.replace(/^dim_/, '').replace(/_filter$/, '');
      if (liveBooleanColumns.has(colName)) {
        pFilters[colName] = vals.map(v => {
          const suffix = v.replace(colName + '_', '');
          return suffix === 'true' ? true : suffix === 'false' ? false : v;
        });
      } else {
        pFilters[colName] = vals;
      }
    });

    // Only fetch visible dimensions (user-configured in Configure Metrics)
    const dimCols = visibleLiveDimensions.map(d => d.name);
    if (dimCols.length === 0) return;

    const hasMetric3 = !!liveMetricConfig.derivedAggType || liveMetricConfig.derivedMode === 'formula';
    const formulaConfigs = {};
    if (liveMetricConfig.volumeMode === 'formula') formulaConfigs.volume = { operator: liveMetricConfig.volumeFormulaOperator || '/' };
    if (liveMetricConfig.revenueMode === 'formula') formulaConfigs.revenue = { operator: liveMetricConfig.revenueFormulaOperator || '/' };
    if (liveMetricConfig.derivedMode === 'formula') formulaConfigs.derived = { operator: liveMetricConfig.derivedFormulaOperator || '/' };
    const formulaConfigsArg = Object.keys(formulaConfigs).length > 0 ? formulaConfigs : null;

    // Fetch with concurrency limit of 3 to avoid overwhelming Supabase
    const CONCURRENCY = 3;
    const merged = {};
    const fetchDim = (col) =>
      cachedQuery('data', {
        p_time_grain: grain,
        p_date_column: dateCol,
        p_group_by: [col],
        p_metrics: rpcMetrics,
        p_filters: pFilters,
      }).then(data => {
        const aggs = transformToDimensionAggregates(data.rows || [], col, hasMetric3, formulaConfigsArg, liveBooleanColumns);
        Object.keys(aggs).forEach(key => {
          if (key !== '_categoryTotals') merged[key] = aggs[key];
        });
      });

    // Process in batches of CONCURRENCY
    const processBatches = async () => {
      for (let i = 0; i < dimCols.length; i += CONCURRENCY) {
        if (cancelled) return;
        const batch = dimCols.slice(i, i + CONCURRENCY);
        await Promise.all(batch.map(fetchDim));
      }
      if (!cancelled) setLiveInsightsDimAggs({ ...merged });
    };
    processBatches();

    return () => { cancelled = true; };
  }, [isLiveMode, activeInsightsTab, liveMetricConfig, dataFrequency, dynamicFilters,
      visibleLiveDimensions, cachedQuery, liveDateColumn, liveBooleanColumns]);

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

  // ===== OPTIMIZATION (Opportunity 1): Single-pass data extraction =====
  // Replaces 13+ separate O(N) scans (allDates, extractFilterOptions×10, pricingTypes,
  // pricingTypeToGroup) with a single walk over cleanedQueryData.rows.
  // On 800K rows this saves ~12 redundant full scans.
  const dataExtracts = React.useMemo(() => {
    // Live mode: derive from server-provided data
    if (isLiveMode) {
      // allDates from period aggregates
      var liveAllDates = livePeriodAggregates ? Object.keys(livePeriodAggregates).sort() : [];

      // filterOptionsMap from liveFilterOptions (fetched via distinct RPC)
      var liveFoMap = {};
      FILTER_CONFIG_STATIC.forEach(function(fc) {
        // Extract column name from filterKey: "dim_column_name_filter" → "column_name"
        var colName = fc.key.replace(/^dim_/, '').replace(/_filter$/, '');
        var vals = liveFilterOptions[colName] || [];
        liveFoMap[fc.key] = ["All"].concat(vals);
      });

      return {
        allDates: liveAllDates,
        filterOptionsMap: liveFoMap,
        pricingTypes: ["All"],
        pricingTypeToGroup: new Map(),
      };
    }

    // Demo mode: scan rows as before
    var rows = cleanedQueryData.rows;
    var n = rows.length;
    var dtCol = dateField;
    var ptCol = COLUMNS.PRODUCT_NAME;
    var ptgCol = COLUMNS.PRODUCT_GROUP_L1;

    // Pre-build filter column descriptors for the inner loop
    var filterCols = [];
    for (var f = 0; f < FILTER_CONFIG_STATIC.length; f++) {
      var fc = FILTER_CONFIG_STATIC[f];
      filterCols.push({ key: fc.key, column: fc.column, values: new Set() });
    }
    var fcLen = filterCols.length;

    var dateSet = new Set();
    var ptToGroup = new Map();

    for (var i = 0; i < n; i++) {
      var row = rows[i];

      // Collect unique dates
      var d = row[dtCol];
      if (d != null && d !== "") dateSet.add(d);

      // Collect unique filter option values for every dimension
      for (var j = 0; j < fcLen; j++) {
        var val = row[filterCols[j].column];
        if (val && val !== "Unknown") filterCols[j].values.add(val);
      }

      // Collect product_name → product_group mapping
      var pm = row[ptCol];
      var pmf = row[ptgCol];
      if (pm && pmf) {
        ptToGroup.set(pm, pmf);
      }
    }

    // Build sorted allDates
    var allDatesArr = Array.from(dateSet).sort();

    // Build filterOptionsMap: { filterKey → ["All", ...uniqueValues] }
    var foMap = {};
    for (var fi = 0; fi < fcLen; fi++) {
      foMap[filterCols[fi].key] = ["All"].concat(
        Array.from(filterCols[fi].values)
      );
    }

    // pricingTypes is a subset already in filterOptionsMap
    var ptArr = foMap["pricingTypeFilter"] || ["All"];

    return {
      allDates: allDatesArr,
      filterOptionsMap: foMap,
      pricingTypes: ptArr,
      pricingTypeToGroup: ptToGroup,
    };
  }, [isLiveMode, livePeriodAggregates, liveFilterOptions, cleanedQueryData.rows, dateField, FILTER_CONFIG_STATIC]);

  // Destructure for downstream consumers (preserves all existing variable names)
  var allDates = dataExtracts.allDates;
  var filterOptionsMap = dataExtracts.filterOptionsMap;
  var pricingTypes = dataExtracts.pricingTypes;
  var pricingTypeToGroup = dataExtracts.pricingTypeToGroup;

  // Convert any period string (weekly/monthly/quarterly/yearly) to a comparable "YYYY-MM-DD" string
  const periodToDateStr = React.useCallback((period) => {
    if (!period) return "";
    // Quarterly: "2025-Q3" → "2025-07-01"
    const qMatch = period.match(/^(\d{4})-Q(\d)$/);
    if (qMatch) {
      const mo = ((parseInt(qMatch[2]) - 1) * 3 + 1).toString().padStart(2, "0");
      return qMatch[1] + "-" + mo + "-01";
    }
    // Yearly: "2025" → "2025-01-01"
    if (/^\d{4}$/.test(period)) return period + "-01-01";
    // Monthly "2025-03-01" or Weekly "2025-03-17" — already comparable
    return period;
  }, []);

  // Get filtered dates (as array)
  const filteredDates = React.useMemo(() => {
    if (dateRange === "All") {
      return allDates;
    }

    // Anchor date ranges to the last date in the dataset (not today's date)
    // so YTD/QTD/1Y always return results even if data doesn't extend to the present
    const lastComparable = allDates.length > 0 ? periodToDateStr(allDates[allDates.length - 1]) : "";
    const now = new Date(lastComparable + "T00:00:00");
    if (isNaN(now.getTime())) return allDates;

    const yearStart = now.getFullYear() + "-01-01";
    const oneYearAgo =
      (now.getFullYear() - 1) +
      "-" +
      (now.getMonth() + 1).toString().padStart(2, "0") +
      "-" +
      now.getDate().toString().padStart(2, "0");

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

    // Compare by converting each period to a date string first
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

  // OPTIMIZATION: Convert filteredDates to Set for O(1) lookups instead of O(n) with .includes()
  // This dramatically speeds up filtering when we have hundreds of dates
  const filteredDatesSet = React.useMemo(() => {
    return new Set(filteredDates);
  }, [filteredDates]);

  const getFilterOptions = React.useCallback(
    (key) => {
      return filterOptionsMap[key] || [];
    },
    [filterOptionsMap]
  );

  // Build schema for LLM context — tells the LLM what filter keys/values are available
  const buildLLMSchema = React.useCallback(() => {
    const filters = {};
    FILTER_CONFIG_STATIC.forEach(({ key, label }) => {
      const opts = getFilterOptions(key);
      // Send options without "All" sentinel, skip empty filters
      const values = opts.length > 1 ? opts.slice(1) : [];
      if (values.length > 0) {
        filters[key] = { label, values };
      }
    });
    // Collect available view names from VIEW_CONFIG
    const views = ["Overall", ...Object.keys(VIEW_CONFIG)];
    // Map internal metric keys to display labels so LLM knows what the user sees
    const metricMap = {
      metric1: METRIC_LABELS.metric1 || "Metric 1",
      metric2: METRIC_LABELS.metric2 || "Metric 2",
      metric3: METRIC_LABELS.metric3 || "Metric 3",
    };
    return {
      metrics: metricMap,
      views,
      dataFrequencies: isLiveMode ? ["Daily", "Weekly", "Monthly", "Quarterly", "Yearly"] : ["Weekly", "Monthly", "Quarterly", "Yearly"],
      dateRanges: DATE_RANGES,
      filters,
    };
  }, [FILTER_CONFIG_STATIC, getFilterOptions, VIEW_CONFIG, METRIC_LABELS]);

  // OPTIMIZATION: Pre-compute sliced options (without "All") for rendering
  // This avoids creating new arrays on every render for each filter
  const filterOptionsWithoutAll = React.useMemo(() => {
    const map = {};
    Object.keys(filterOptionsMap).forEach((key) => {
      map[key] = filterOptionsMap[key].slice(1);
    });
    // Add pricing types
    map.pricingTypeFilter = pricingTypes.slice(1);
    return map;
  }, [filterOptionsMap, pricingTypes]);

  // Helper function to create filter search options for a filter type
  // NOTE: No longer includes isSelected - that's looked up at render time for better performance
  const createFilterSearchOptionsForType = React.useCallback(
    (
      filterType,
      filterKey,
      optionsArray,
      setFilterFn,
      formatDisplayName = formatFilterName
    ) => {
      return optionsArray.slice(1).map((value) => ({
        type: filterType,
        filterKey, // Store key to look up state later
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
        },
      }));
    },
    [formatFilterName]
  );

  const createFilterSearchOptions = React.useMemo(() => {
    const options = FILTER_CONFIG_STATIC.flatMap(({ label, key }) => {
      const optionsArray =
        key === "pricingTypeFilter"
          ? pricingTypes
          : filterOptionsMap[key] || [];
      if (!optionsArray) return [];

      // Get the setState function for this filter
      const setState = getFilterSetState(key);

      // Get formatValue if available from the original config (for custom formatting)
      const formatValue = key === "pricingTypeFilter" ? undefined : undefined; // Can add custom formatters here if needed

      // Standard filter handling
      return createFilterSearchOptionsForType(
        label,
        key,
        optionsArray,
        setState,
        formatValue || formatFilterName
      );
    });

    return options;
  }, [
    FILTER_CONFIG_STATIC,
    pricingTypes,
    filterOptionsMap,
    createFilterSearchOptionsForType,
    getFilterSetState,
    formatFilterName,
  ]);

  const allFilterSuggestions = React.useMemo(() => {
    const allOptions = createFilterSearchOptions;

    // Group all options by type
    const grouped = {};

    allOptions.forEach((option) => {
      if (!grouped[option.type]) {
        grouped[option.type] = [];
      }
      grouped[option.type].push(option);
    });

    // Sort options within each group
    Object.keys(grouped).forEach((type) => {
      grouped[type].sort((a, b) => a.displayName.localeCompare(b.displayName));
    });

    // Order groups to match Advanced Filters order - derived from DIMENSION_DEFINITIONS (DRY)
    const advancedFiltersOrder = [...DIMENSION_DEFINITIONS]
      .sort((a, b) => a.displayOrder - b.displayOrder)
      .map((dim) => dim.filterLabel);

    const orderedGrouped = {};

    // Add groups in Advanced Filters order
    advancedFiltersOrder.forEach((label) => {
      // Try exact match first
      if (grouped[label]) {
        orderedGrouped[label] = grouped[label];
      } else {
        // Try to find matching label (case-insensitive or partial match)
        const matchingKey = Object.keys(grouped).find(
          (key) =>
            key.toLowerCase() === label.toLowerCase() ||
            key.includes(label) ||
            label.includes(key)
        );
        if (matchingKey) {
          orderedGrouped[matchingKey] = grouped[matchingKey];
        }
      }
    });

    // Add any remaining groups not in Advanced Filters order (shouldn't happen, but just in case)
    Object.keys(grouped).forEach((type) => {
      if (!orderedGrouped[type]) {
        orderedGrouped[type] = grouped[type];
      }
    });

    return orderedGrouped;
  }, [createFilterSearchOptions, FILTER_CONFIG]);

  const handleFilterSuggestionSelect = React.useCallback((suggestion) => {
    suggestion.action();
    // Keep dropdown open and search text so user can select multiple filters
    // Dropdown will close on outside click or Esc key
  }, []);

  const buildFilterDescription = React.useCallback(
    (mode, separator = ", ", prefix = "", suffix = "", emptyText = "") => {
      const activeFilters = [];

      // Date range
      if (dateRange !== "All") {
        const formatters = {
          active: () => dateRange,
          context: () => `${dateRange} timeframe`,
          short: () => dateRange,
        };
        activeFilters.push(formatters[mode]());
      }

      const getFormatters = (filterConfig) => {
        const { label, formatValue, state } = filterConfig;
        const formatFn = formatValue || formatFilterName;

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
          short: (arr) => arr.map(formatFn).join(", "),
        };
      };

      // Process all filters from FILTER_CONFIG
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
    [formatFilterName, dateRange, FILTER_CONFIG]
  );

  // Simple chart title helper - just metric name + optional filters
  const getSimpleChartTitle = React.useCallback(() => {
    const displayMetric = METRIC_LABELS[metric] || metric;
    const filterText = buildFilterDescription("active", ", ", "", "", "");
    if (filterText) {
      return `${displayMetric}\n(Filtered by: ${filterText})`;
    }
    return displayMetric;
  }, [metric, METRIC_LABELS, buildFilterDescription]);

  // Helper function to get contextual filter description for insights
  const getFilterContext = React.useCallback(() => {
    return buildFilterDescription("context", " ", "", "", "All Data");
  }, [buildFilterDescription]);

  // Helper function to get short filter context for display
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

  // Wrapper for setDataFrequency that clears insight context
  const handleDataFrequencyChange = React.useCallback((newFrequency) => {
    setDataFrequency(newFrequency);
    setInsightContext(null); // Clear decomposition context when changing frequency
  }, []);

  const baseFilteredData = React.useMemo(() => {
    const startTime = performance.now();
    const result = cleanedQueryData.rows.filter((row) => {
      // Exclude rows with null/undefined date fields (e.g., configuration rows)
      if (row[dateField] == null || row[dateField] === "") return false;

      // Check all filters from FILTER_CONFIG
      return FILTER_CONFIG.every(({ state, column }) => {
        return filterMatches(state, row[column]);
      });
    });
    filterTimeRef.current = performance.now() - startTime;
    return result;
  }, [cleanedQueryData.rows, filterMatches, FILTER_CONFIG, dateField]);

  // Filter data based on selected filters AND date range
  // OPTIMIZATION: Use Set lookup (O(1)) instead of array.includes (O(n))
  const filteredData = React.useMemo(() => {
    return baseFilteredData.filter((row) => {
      // Apply date range filter using Set for fast O(1) lookup
      return filteredDatesSet.has(row[dateField]);
    });
  }, [baseFilteredData, filteredDatesSet, dateField]);

  // Increment render count on every render (no state update = no infinite loop)
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

  // Period-level aggregation: delegates to extracted utility, binding COLUMNS
  const buildPeriodAggregates = (data, dtField) => buildPeriodAggregatesUtil(data, dtField, COLUMNS);

  // OPTIMIZATION (Opportunity 2): Compute base aggregates once, derive filtered version cheaply
  // In live mode: use server-provided aggregates directly
  const baseDataAggregatesByPeriod = React.useMemo(
    () => isLiveMode ? (livePeriodAggregates || {}) : buildPeriodAggregates(baseFilteredData, dateField),
    [isLiveMode, livePeriodAggregates, baseFilteredData, dateField]
  );

  // sortedBaseDataPeriods: baseDataAggregatesByPeriod is now computed earlier (Opportunity 2)
  const sortedBaseDataPeriods = React.useMemo(() => {
    return Object.keys(baseDataAggregatesByPeriod).sort();
  }, [baseDataAggregatesByPeriod]);

  // periodAggregates: derived from baseDataAggregatesByPeriod by filtering to periods in filteredDatesSet
  // Cost: O(P) where P = number of periods, instead of O(N) re-scan of filteredData
  const periodAggregates = React.useMemo(() => {
    var base = baseDataAggregatesByPeriod;
    var result = {};
    var periods = Object.keys(base);
    for (var p = 0; p < periods.length; p++) {
      var period = periods[p];
      if (filteredDatesSet.has(period)) {
        result[period] = base[period];
      }
    }
    return result;
  }, [baseDataAggregatesByPeriod, filteredDatesSet]);

  // ===== OPTIMIZATION: Shared dimension-level aggregation builder (DRY) =====
  // Dimension-level aggregation: delegates to extracted utility, binding COLUMNS + DIMENSION_DEFINITIONS
  const buildDimensionAggregates = (data, dtField) => buildDimensionAggregatesUtil(data, dtField, COLUMNS, DIMENSION_DEFINITIONS);

  // OPTIMIZATION (Opportunity 2): Compute base dimension aggregates once on baseFilteredData (O(N×M)),
  // then derive the date-filtered version cheaply (O(D×P×C)) instead of a second O(N×M) scan
  // In live mode: use server-provided aggregates directly
  const baseDimensionAggregates = React.useMemo(
    () => isLiveMode ? (liveDimensionAggregates || { _categoryTotals: {} }) : buildDimensionAggregates(baseFilteredData, dateField),
    [isLiveMode, liveDimensionAggregates, baseFilteredData, dateField]
  );

  // dimensionAggregates: derived from baseDimensionAggregates by keeping only periods in filteredDatesSet
  // Cost: O(D×P×C) where D=dimensions, P=periods, C=categories — orders of magnitude cheaper than O(N×M)
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
      var periods = Object.keys(base[col]);
      for (var p = 0; p < periods.length; p++) {
        var period = periods[p];
        if (!filteredDatesSet.has(period)) continue;
        result[col][period] = base[col][period];
        // Accumulate category totals for filtered periods only
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
    // Compute derived metric3 for category totals
    var ctCols = Object.keys(categoryTotals);
    for (var ci = 0; ci < ctCols.length; ci++) {
      var catKeys = Object.keys(categoryTotals[ctCols[ci]]);
      for (var ki = 0; ki < catKeys.length; ki++) {
        var t = categoryTotals[ctCols[ci]][catKeys[ki]];
        t.metric3 =
          t.metric1 > 0 ? (10000 * t.metric2) / t.metric1 : 0;
      }
    }
    result._categoryTotals = categoryTotals;
    return result;
  }, [baseDimensionAggregates, filteredDatesSet]);

  // Helper to get metric value from dimension aggregates (O(1) lookup)
  // Unified helper: O(1) lookup into any dimension aggregates object (replaces getDimensionMetric, getBaseDimensionMetric, getBaseDimensionVolume)
  const getDimMetric = React.useCallback(
    (aggregates, column, period, categoryValue, metricName) =>
      getDimAggMetric(aggregates, column, period, categoryValue, metricName),
    []
  );

  // OPTIMIZATION (Opportunity 3): Category totals are now computed during the aggregation pass
  // instead of a separate triple-nested loop. Just read the pre-computed result.
  const dimensionCategoryTotals = React.useMemo(() => {
    return dimensionAggregates._categoryTotals || {};
  }, [dimensionAggregates]);

  // Stable color assignment per dimension: categories sorted alphabetically → fixed color index.
  // Two categories from different dimensions may share a color (they're never shown together).
  const categoryColorMap = React.useMemo(() => {
    const map = {};
    Object.keys(dimensionCategoryTotals).forEach((dimCol) => {
      const cats = Object.keys(dimensionCategoryTotals[dimCol])
        .filter(c => c && c !== "Unknown")
        .sort((a, b) => b.localeCompare(a));
      const dimMap = {};
      cats.forEach((cat, i) => {
        dimMap[cat] = MODERN_COLOR_PALETTE[i % MODERN_COLOR_PALETTE.length];
      });
      dimMap["Rest Combined"] = "#9ca3af";
      map[dimCol] = dimMap;
    });
    return map;
  }, [dimensionCategoryTotals]);

  // Get unique dates/periods — always from periodAggregates (works in both modes)
  const periods = React.useMemo(() => {
    return Object.keys(periodAggregates).sort();
  }, [periodAggregates]);

  // Calculate metrics from rows (fallback for non-period-grouped data)
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
        return m1 > 0 ? (10000 * m2) / m1 : 0;
      default:
        return m1;
    }
  }, []);

  const calculateMetric = React.useCallback(
    (rows) => calculateMetricValue(rows, metric),
    [metric, calculateMetricValue]
  );

  // 🆕 NEW: InsightContextBanner Component - displays context banner for drill-down
  // Resolve effective chart type for a metric: "stacked" | "grouped" | "line"
  // In live mode, reads from config with auto-detection. In demo mode, Margin Rate is always line.
  const resolveChartType = React.useCallback((metricName) => {
    if (isLiveMode && liveMetricConfig) {
      const prefix = metricName === 'metric1' ? 'volume' : metricName === 'metric2' ? 'revenue' : 'derived';
      const configuredType = liveMetricConfig[prefix + 'ChartType'] || 'auto';
      if (configuredType !== 'auto') return configuredType;
      // Auto: formula mode → line, otherwise stacked
      const mode = liveMetricConfig[prefix + 'Mode'] || 'aggregation';
      return mode === 'formula' ? 'line' : 'stacked';
    }
    // Demo mode: metric3 (derived) is line, others are stacked
    return metricName === 'metric3' ? 'line' : 'stacked';
  }, [isLiveMode, liveMetricConfig]);

  const formatMetricValue = React.useCallback((value, metricName) => {
    // Live mode: use metric config formatting with prefix/suffix
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
        const displayValue = (liveMetricConfig.derivedMode !== 'formula' && liveMetricConfig.derivedDivisor) ? value / liveMetricConfig.derivedDivisor : value;
        const formatted = numeral(displayValue).format(liveMetricConfig.derivedFormat);
        return (liveMetricConfig.derivedPrefix || "") + formatted + (liveMetricConfig.derivedSuffix || "");
      }
    }
    // Demo mode: prefix/suffix baked in
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

  // Format metric values (uses current metric)
  const formatMetric = React.useCallback(
    (value) => formatMetricValue(value, metric),
    [metric, formatMetricValue]
  );

  const calculatePercentageChange = React.useCallback(
    (currentValue, previousValue) => calculatePercentageChangeUtil(currentValue, previousValue),
    []
  );

  const calculateGrowthMetrics = React.useCallback(
    (currentValue, previousValue, overallGrowthRate = null) =>
      calculateGrowthMetricsUtil(currentValue, previousValue, overallGrowthRate),
    []
  );

  const formatPeriodDate = React.useCallback(
    (periodString) => formatPeriodDateUtil(periodString, dataFrequency),
    [dataFrequency]
  );

  // ==================== OVERLAY HELPER FUNCTIONS ====================

  const formatYoYValue = React.useCallback(
    (yoyValue) => formatYoYValueUtil(yoyValue),
    []
  );

  const capYoYForDisplay = React.useCallback(
    (yoyValue) => capYoYForDisplayUtil(yoyValue),
    []
  );

  const calculateYoYDataArray = React.useCallback(
    (periods, dataByPeriod, metricCalculator, yoyCalculator, includeLastPeriod = false) =>
      calculateYoYDataArrayUtil(periods, dataByPeriod, metricCalculator, yoyCalculator, includeLastPeriod),
    []
  );

  const generateExcessGrowthInsights = React.useCallback(
    (insightContext) => {
      if (!insightContext) {
        return [];
      }

      const {
        parentExcessGrowth,
        marketAvgGrowth,
        periods: ctxPeriods,
      } = insightContext;

      // Can't decompose if no excess growth (except in SIMPLE MODE where parentExcessGrowth can be null)
      const isSimpleModeContext = marketAvgGrowth == null;
      if (
        !isSimpleModeContext &&
        (!parentExcessGrowth || parentExcessGrowth === 0)
      ) {
        return [];
      }

      const insights = [];
      const firstPeriod = ctxPeriods[0];
      const lastPeriod = ctxPeriods[ctxPeriods.length - 1];

      // O(1) parent value lookups from periodAggregates
      const parentFirstValue = periodAggregates[firstPeriod]
        ? periodAggregates[firstPeriod][metric] || 0
        : 0;
      const parentLastValue = periodAggregates[lastPeriod]
        ? periodAggregates[lastPeriod][metric] || 0
        : 0;
      const parentAbsChange = parentLastValue - parentFirstValue;

      // Parent Revenue values (needed for Margin Rate weighting) - computed once
      const parentFirstRev = periodAggregates[firstPeriod]
        ? periodAggregates[firstPeriod].metric2 || 0
        : 0;
      const parentLastRev = periodAggregates[lastPeriod]
        ? periodAggregates[lastPeriod].metric2 || 0
        : 0;

      if (parentFirstValue === 0) {
        return [];
      }

      // Dimensions to exclude from decomposition analysis (not helpful for insights)
      const excludedDimensions = [
        "productGroupFilter",
        "productSubFilter",
      ];

      // Get available dimensions (not already filtered, and not excluded)
      const availableDimensions = DIMENSION_DEFINITIONS.filter((dim) => {
        const filterState = getFilterState(dim.filterKey);
        return (
          filterState.length === 0 &&
          columnExists(COLUMNS[dim.columnKey]) &&
          !excludedDimensions.includes(dim.filterKey)
        );
      });

      if (availableDimensions.length === 0) {
        return [];
      }

      // Fixed priority used only as tiebreaker
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
        channelTypeFilter: 10,
      };

      // Helper to compute pctOfExcess for a category (shared by analysis + final pass)
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
        const categoryGrowth = calculatePercentageChange(
          categoryLastValue,
          categoryFirstValue
        );

        if (categoryGrowth === null) return null;

        const categoryAbsChange = categoryLastValue - categoryFirstValue;
        const useSimpleMode = marketAvgGrowth == null;
        const excessVsMarket =
          marketAvgGrowth != null ? categoryGrowth - marketAvgGrowth : null;

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
          const volumeShare =
            avgParentRev !== 0 ? avgCategoryRev / avgParentRev : 0;
          const contributionBps = volumeShare * categoryAbsChange;

          if (useSimpleMode) {
            pctOfExcess =
              parentAbsChange !== 0 ? contributionBps / parentAbsChange : 0;
            excessContribution = contributionBps;
            baseShare = volumeShare;
          } else {
            const contributionPercentagePoints = volumeShare * excessVsMarket;
            pctOfExcess =
              parentExcessGrowth !== 0
                ? contributionPercentagePoints / parentExcessGrowth
                : 0;
            excessContribution = contributionPercentagePoints;
            baseShare = volumeShare;
          }
        } else if (useSimpleMode) {
          const absContributionRatio =
            parentAbsChange !== 0 ? categoryAbsChange / parentAbsChange : 0;
          pctOfExcess = absContributionRatio;
          excessContribution = categoryAbsChange;
          baseShare = categoryFirstValue / parentFirstValue;
        } else if (categoryFirstValue < 0) {
          const absContributionRatio =
            parentAbsChange !== 0 ? categoryAbsChange / parentAbsChange : 0;
          const isOutperforming = categoryGrowth > marketAvgGrowth;
          pctOfExcess = isOutperforming
            ? Math.abs(absContributionRatio)
            : -Math.abs(absContributionRatio);
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
          pctOfExcess,
        };
      };

      // Analyze each dimension to find which has most concentrated contribution
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
          fixedPriority: dimensionPriority[dimension.filterKey] || 50,
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

      const prioritizedDimensions = validDimensionAnalysis
        .slice(0, 1)
        .map((d) => d.dimension);

      // For each prioritized dimension
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
            pctOfExcess,
          } = result;

          const useSimpleMode = marketAvgGrowth == null;

          // Filter by contribution (>5%)
          if (Math.abs(pctOfExcess) >= 0.05) {
            const contributionPct = Math.abs(pctOfExcess * 100).toFixed(0);
            const categoryLabel = formatFilterName(categoryValue);

            let text;

            if (useSimpleMode) {
              const isPositiveContribution = pctOfExcess > 0;
              const changeDirection =
                categoryAbsChange > 0 ? "increase" : "drop";
              const verb = isPositiveContribution ? "contributed" : "offset";

              text = `[${insightLabel}] ${categoryLabel} ${verb} ${contributionPct}% of the ${changeDirection} (${formatMetric(
                categoryFirstValue
              )} → ${formatMetric(categoryLastValue)})`;
            } else {
              const isCategoryAboveMarket = excessVsMarket > 0;
              const direction = isCategoryAboveMarket ? "above" : "below";
              const isGrowing = categoryGrowth >= 0;
              const growthVerb = isGrowing ? "grew" : "declined";
              const growthDisplay = Math.abs(categoryGrowth).toFixed(0);
              const isParentOutperforming = parentExcessGrowth > 0;
              const performanceNoun = isParentOutperforming
                ? "outperformance"
                : "underperformance";
              const isPositiveContribution =
                (isCategoryAboveMarket && isParentOutperforming) ||
                (!isCategoryAboveMarket && !isParentOutperforming);
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
                viewName,
              },
              action: () => {
                const categoryExcessGrowth =
                  marketAvgGrowth != null
                    ? categoryGrowth - marketAvgGrowth
                    : null;

                setInsightContext((prevContext) => ({
                  type: prevContext && prevContext.type,
                  parentCategory: categoryValue,
                  parentLabel: formatFilterName(categoryValue),
                  parentGrowth: categoryGrowth,
                  parentExcessGrowth: categoryExcessGrowth,
                  marketAvgGrowth: marketAvgGrowth,
                  parentAbsChange: categoryAbsChange,
                  periods: ctxPeriods,
                  firstValue: categoryFirstValue,
                  lastValue: categoryLastValue,
                  drillPath: [
                    ...((prevContext && prevContext.drillPath) || []),
                    {
                      category: prevContext && prevContext.parentCategory,
                      label: prevContext && prevContext.parentLabel,
                      growth: prevContext && prevContext.parentGrowth,
                      excessGrowth:
                        prevContext && prevContext.parentExcessGrowth,
                      marketAvgGrowth:
                        prevContext && prevContext.marketAvgGrowth,
                      absChange: prevContext && prevContext.parentAbsChange,
                      periods: prevContext && prevContext.periods,
                      firstValue: prevContext && prevContext.firstValue,
                      lastValue: prevContext && prevContext.lastValue,
                    },
                  ],
                }));

                const setFilter = getFilterSetState(filterKey);
                setFilter([categoryValue]);

                setView("Overall");
              },
            });
          }
        });
      });

      // Sort by absolute excess contribution
      return insights.sort(
        (a, b) =>
          Math.abs(b.metadata.pctOfExcess) - Math.abs(a.metadata.pctOfExcess)
      );
    },
    [
      dimensionAggregates,
      periodAggregates,
      metric,
      dateField,
      calculatePercentageChange,
      formatFilterName,
      columnExists,
      getFilterState,
      getFilterSetState,
      setView,
    ]
  );

  const generateStructuredInsights = (tabType) => {
    if (periods.length < 3 || (!isLiveMode && filteredData.length === 0)) {
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

    // Build completeFilteredData and completeDataByPeriod:
    // - Demo mode: filter raw rows to complete periods
    // - Live mode: synthesize one row per period from periodAggregates (no raw rows available)
    let completeFilteredData, completeDataByPeriod;
    if (isLiveMode) {
      completeFilteredData = [];
      completeDataByPeriod = {};
      completePeriods.forEach((period) => {
        const agg = periodAggregates[period];
        if (!agg) return;
        // Synthetic row with volume/revenue columns so calculateMetric() works unchanged
        const syntheticRow = { [dateField]: period, [COLUMNS.METRIC1]: agg.metric1, [COLUMNS.METRIC2]: agg.metric2 };
        completeFilteredData.push(syntheticRow);
        completeDataByPeriod[period] = [syntheticRow];
      });
    } else {
      completeFilteredData = filteredData.filter((row) =>
        completePeriods.includes(row[dateField])
      );
      completeDataByPeriod = {};
      for (let i = 0; i < completeFilteredData.length; i++) {
        const row = completeFilteredData[i];
        const period = row[dateField];
        if (!completeDataByPeriod[period]) completeDataByPeriod[period] = [];
        completeDataByPeriod[period].push(row);
      }
    }

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

    if (isLiveMode) {
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
            cat.byPeriod[period] = { metric1: vol, metric2: rev };
          });
        });
      });
    } else {
      for (let i = 0; i < completeFilteredData.length; i++) {
        const row = completeFilteredData[i];
        const period = row[dateField];
        const volume = row[COLUMNS.METRIC1] || 0;
        const revenue =
          row[COLUMNS.METRIC2] || 0;
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
    // Compute metric from pre-aggregated volume/revenue (matches calculateMetricValue logic)
    const metricFromAgg = (m1, m2) => {
      switch (metric) {
        case "metric1":
          return m1;
        case "metric2":
          return m2;
        case "metric3":
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
            `${metric} declining for ${consecutiveDeclines} consecutive periods (${totalDecline.toFixed(
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
                `Significant ${metric} drop of ${dropPercent.toFixed(
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
          ? metricFromAgg(firstAgg.metric1, firstAgg.metric2)
          : 0;
        const lastCatMetric = lastAgg
          ? metricFromAgg(lastAgg.metric1, lastAgg.metric2)
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

      // Market share shifts don't make sense for Margin Rate metric
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
          `Overall ${metric} ${direction} ${absoluteGrowth.toFixed(
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
      if (metric === "metric3") {
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
        (metric === "metric3" || marketShare > minThreshold) &&
        !isNear100Percent
      ) {
        const shareText =
          metric === "metric3"
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

      // Cross-dimensional combos require raw rows (multi-column grouping) — skip in live mode
      if (!isLiveMode) crossDimensionalCombos.forEach((combo) => {
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
                  `${metric} from ${formattedSegment} users ${
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
              ? metricFromAgg(firstPeriodAgg.metric1, firstPeriodAgg.metric2)
              : 0;
            const categoryLastValue = lastPeriodAgg
              ? metricFromAgg(lastPeriodAgg.metric1, lastPeriodAgg.metric2)
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
                )} ${metric} ${direction} ${absoluteGrowth.toFixed(
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
                    console.log("✅ Setting insightContext:", newContext);
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
  };

  // Helper function to create a cache key for insights
  const createInsightsCacheKey = (
    metric,
    tabType,
    periods,
    activeFilters,
    contextParent
  ) => {
    const firstPeriods = periods.slice(0, 3).join(",");
    const lastPeriods = periods.slice(-3).join(",");
    // Create a stable hash of active filters to detect filter changes
    const filterHash = JSON.stringify(activeFilters);
    // Include context parent to ensure unique cache for each drill-down level
    const contextKey = contextParent || "root";
    return `${metric}-${
      tabType || "none"
    }-${firstPeriods}-${lastPeriods}-${filterHash}-${contextKey}`;
  };

  // Generate insights asynchronously to avoid blocking UI when switching metrics
  React.useEffect(() => {
    // Skip computation if insights tab is not open
    if (!activeInsightsTab) {
      setStructuredInsights({
        basicInsights: {
          decomposition: [],
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
      });
      setLoadingInsights(false);
      return;
    }

    // Create cache key with active filters to prevent stale cache hits
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
      productSub: productSubFilter,
    };

    // In live mode, include dimension data fingerprint so cache invalidates when dim data arrives
    const dimDataKey = isLiveMode ? Object.keys(liveInsightsDimAggs).sort().join(',') : '';
    const cacheKey = createInsightsCacheKey(
      metric,
      activeInsightsTab,
      periods,
      activeFilters,
      insightContext && insightContext.parentCategory
    ) + (dimDataKey ? `|dims:${dimDataKey}` : '');

    // Check if we have cached insights for this exact configuration
    if (insightsCacheRef.current[cacheKey]) {
      setStructuredInsights(insightsCacheRef.current[cacheKey]);
      setLoadingInsights(false);
      return;
    }

    // Show loading state and defer insights generation
    setLoadingInsights(true);

    // Use setTimeout to defer insights generation, allowing UI to render first
    const timeoutId = setTimeout(() => {
      // Generate new insights
      const insights = generateStructuredInsights(activeInsightsTab);

      // Cache the results
      insightsCacheRef.current[cacheKey] = insights;

      // Limit cache size to prevent memory issues (keep last 10 entries)
      const cacheKeys = Object.keys(insightsCacheRef.current);
      if (cacheKeys.length > 10) {
        // Remove oldest entries
        cacheKeys.slice(0, cacheKeys.length - 10).forEach((key) => {
          delete insightsCacheRef.current[key];
        });
      }

      setStructuredInsights(insights);
      setLoadingInsights(false);
    }, 50); // Small delay to allow chart to render first

    return () => clearTimeout(timeoutId);
  }, [
    activeInsightsTab,
    periods,
    filteredData,
    dateField,
    metric,
    calculateMetric,
    formatPeriodDate,
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
    insightContext, // 🆕 CRITICAL: Must include insightContext so insights regenerate when drilling down
    isLiveMode,
    periodAggregates,
    dimensionAggregates,
    liveInsightsDimAggs,
  ]);

  // Filter insights based on selected Split By dimension (view)
  // This is separate from generation to avoid regenerating insights on every view change
  const displayedInsights = React.useMemo(() => {
    // If no view is selected, return all insights
    if (!view) {
      return structuredInsights;
    }

    // Get the configuration for the selected view dimension
    const viewConfig = VIEW_CONFIG[view];
    if (!viewConfig) {
      return structuredInsights;
    }

    // Create variations of the dimension label to match against
    const dimensionLabels = [
      viewConfig.label.toLowerCase(), // e.g., "acquisition channels"
      view.toLowerCase(), // e.g., "acquisition channel"
    ];

    // Helper function to check if an insight is related to the selected dimension
    const isRelatedToViewDimension = (insight) => {
      const selectedViewColumn = viewConfig.column;
      const metadata = insight.metadata || {};

      // Global insights - always show
      if (metadata.insightType === "global") {
        return true;
      }

      // Cross-dimensional insights - check if any dimension matches
      if (
        metadata.insightType === "cross-dimension" &&
        metadata.dimensionColumns
      ) {
        return metadata.dimensionColumns.includes(selectedViewColumn);
      }

      // Single-dimension insights - direct match
      if (
        metadata.insightType === "single-dimension" &&
        metadata.dimensionColumn
      ) {
        return metadata.dimensionColumn === selectedViewColumn;
      }

      // Fallback for backward compatibility (older insights without standard metadata)
      // Check for cross-dimensional insights using legacy field
      if (metadata.crossDimensionFields) {
        const matchesCrossField = metadata.crossDimensionFields.some(
          (field) => field === selectedViewColumn
        );
        if (matchesCrossField) return true;
      }

      // Check for single-dimension insights with dimensionColumn
      if (metadata.dimensionColumn) {
        if (metadata.dimensionColumn === selectedViewColumn) {
          return true;
        }
      }

      // Check viewName
      if (metadata.viewName && metadata.viewName === view) {
        return true;
      }

      // Check label matching
      if (metadata.label) {
        const insightTextLower = insight.text.toLowerCase();
        const metadataLabel = metadata.label.toLowerCase();
        const matchesLabel = dimensionLabels.some(
          (label) =>
            label.includes(metadataLabel) || metadataLabel.includes(label)
        );
        if (matchesLabel) return true;
      }

      return false;
    };

    // Filter each category of insights
    const filtered = {
      basicInsights: {},
      advancedInsights: {},
      recommendations: structuredInsights.recommendations,
    };

    // Filter basic insights
    // Note: Performance alerts, overall trends, and decomposition are not dimension-specific, so always include them
    Object.keys(structuredInsights.basicInsights).forEach((category) => {
      if (
        category === "performanceAlerts" ||
        category === "overallTrends" ||
        category === "decomposition"
      ) {
        // Always show performance alerts, overall trends, and decomposition regardless of split by
        filtered.basicInsights[category] =
          structuredInsights.basicInsights[category];
      } else {
        // Filter other insights based on selected dimension
        filtered.basicInsights[category] = structuredInsights.basicInsights[
          category
        ].filter(isRelatedToViewDimension);
      }
    });

    // Filter advanced insights
    Object.keys(structuredInsights.advancedInsights).forEach((category) => {
      filtered.advancedInsights[category] = structuredInsights.advancedInsights[
        category
      ].filter(isRelatedToViewDimension);
    });

    return filtered;
  }, [structuredInsights, view, VIEW_CONFIG]);

  // Reset pagination when insights change (filters, view changes, etc.)
  // This prevents showing page 2 when new filtered data only has 1 page
  React.useEffect(() => {
    setInsightPagination({});
  }, [displayedInsights]);

  // ===== OPTIMIZATION: Calculate all stat box metrics in a single computation =====
  // Instead of calling getStatBoxDataForMetric 3 times, compute all metrics together
  const allMetricsStatData = React.useMemo(() => {
    if (periods.length === 0) {
      return { metric1: null, metric2: null, metric3: null };
    }

    // Use second-to-last period as the main period (since last is developing)
    const mainPeriod =
      periods.length > 1
        ? periods[periods.length - 2]
        : periods[periods.length - 1];
    const previousPeriod =
      periods.length > 2 ? periods[periods.length - 3] : null;

    // Get pre-computed aggregates for main and previous periods
    const mainAgg = periodAggregates[mainPeriod];
    const prevAgg = previousPeriod ? periodAggregates[previousPeriod] : null;

    // Determine YoY comparison period
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

    // Calculate stats for all metrics in one pass
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
          changePercent = (change / previousValue) * 100;
        }
      }

      let yoyChange = null;
      let yoyAbsoluteChange = null;
      if (yoyAgg) {
        const previousYearValue = yoyAgg[metricName];
        yoyAbsoluteChange = mainValue - previousYearValue;
        yoyChange = calculatePercentageChange(mainValue, previousYearValue);
      }

      result[metricName] = {
        lastPeriod: mainPeriod,
        lastValue: mainValue,
        change,
        changePercent,
        yoyChange,
        yoyAbsoluteChange,
      };
    });
    return result;
  }, [
    periods,
    periodAggregates,
    dataFrequency,
    sortedBaseDataPeriods,
    baseDataAggregatesByPeriod,
    calculatePercentageChange,
  ]);

  // Keep the current metric's statData for backward compatibility
  const statData = React.useMemo(() => {
    return allMetricsStatData[metric] || null;
  }, [allMetricsStatData, metric]);

  const calculateScenarioChartData = React.useCallback(
    (scenarioSnapshot, scenarioIndex, scenarioLabel) => {
      if (!scenarioSnapshot) return [];

      // Get scenario configuration
      const scenarioMetric = scenarioSnapshot.metric || "metric2";
      const scenarioView = scenarioSnapshot.view || "Overall";
      const scenarioDateRange = scenarioSnapshot.dateRange || "YTD";
      const scenarioDataFrequency = scenarioSnapshot.dataFrequency || "Monthly";
      const scenarioTopX = scenarioSnapshot.topX || 3;
      const scenarioSelectedCategories =
        scenarioSnapshot.selectedCategories || [];
      const scenarioShowAllShareTraces =
        scenarioSnapshot.showAllShareTraces || false;
      const scenarioShowAllGrowthTraces =
        scenarioSnapshot.showAllGrowthTraces || false;
      const scenarioShowAllDollarTraces =
        scenarioSnapshot.showAllDollarTraces !== undefined
          ? scenarioSnapshot.showAllDollarTraces
          : true;
      const visibleTraceNames = scenarioSnapshot.visibleTraceNames || null;

      // Get scenario date field
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

      // Filter data based on scenario filters
      const scenarioFilteredData = cleanedQueryData.rows.filter((row) => {
        // Check all filters using FILTER_CONFIG_STATIC (only need column and key)
        return FILTER_CONFIG_STATIC.every(({ column, key }) => {
          const scenarioFilterState = scenarioSnapshot[key] || [];
          return filterMatches(scenarioFilterState, row[column]);
        });
      });

      // Get scenario date range filtered data
      const allScenarioDates = Array.from(
        new Set(scenarioFilteredData.map((row) => row[scenarioDateField]))
      ).sort();

      let scenarioFilteredDates = allScenarioDates;
      if (scenarioDateRange !== "All") {
        const now = new Date();
        let yearStart = now.getFullYear() + "-01-01";
        let oneYearAgo =
          now.getFullYear() -
          1 +
          "-" +
          (now.getMonth() + 1).toString().padStart(2, "0") +
          "-" +
          now.getDate().toString().padStart(2, "0");
        let threeMonthsAgo = new Date(now);
        threeMonthsAgo.setMonth(now.getMonth() - 3);
        let oneQuarterAgo =
          threeMonthsAgo.getFullYear() +
          "-" +
          (threeMonthsAgo.getMonth() + 1).toString().padStart(2, "0") +
          "-" +
          threeMonthsAgo.getDate().toString().padStart(2, "0");

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
      scenarioFilteredData
        .filter((row) => scenarioFilteredDates.includes(row[scenarioDateField]))
        .forEach((row) => {
          const period = row[scenarioDateField];
          if (!scenarioDataByPeriod[period]) {
            scenarioDataByPeriod[period] = [];
          }
          scenarioDataByPeriod[period].push(row);
        });

      const scenarioPeriods = Object.keys(scenarioDataByPeriod).sort();

      if (scenarioPeriods.length === 0) return [];

      // Scenario color palette
      const scenarioColors = {
        1: "#ef4444", // Red
        2: "#10b981", // Green
        3: "#8b5cf6", // Purple
      };
      const scenarioColor = scenarioColors[scenarioIndex] || "#6b7280";
      const scenarioDashPatterns = {
        1: "solid",
        2: "dash",
        3: "dot",
      };
      const scenarioDash = scenarioDashPatterns[scenarioIndex] || "dash";

      // Calculate metric for scenario
      const calculateScenarioMetric = (rows) => {
        return calculateMetricValue(rows, scenarioMetric);
      };

      // Format metric for scenario
      const formatScenarioMetric = (value) => {
        return formatMetricValue(value, scenarioMetric);
      };

      const scenarioTraces = [];

      if (scenarioView === "Overall") {
        // Default view (Overall): single bar chart with YoY line
        const barData = scenarioPeriods.map((period) => {
          const periodRows = scenarioDataByPeriod[period] || [];
          return calculateScenarioMetric(periodRows);
        });

        // Calculate YoY for scenario
        const periodsForYoY = scenarioPeriods.slice(0, -1);
        const yoyDataForPeriods = periodsForYoY.map((period) => {
          const periodRows = scenarioDataByPeriod[period] || [];
          const currentValue = calculateScenarioMetric(periodRows);

          // Calculate YoY using scenario data
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

          return calculatePercentageChange(currentValue, previousValue);
        });
        const yoyData = [...yoyDataForPeriods, null];

        // Add bar trace
        scenarioTraces.push({
          type: "bar",
          x: scenarioPeriods,
          y: barData,
          name: `[${scenarioLabel}] ${scenarioMetric}`,
          marker: {
            color: scenarioColor,
            line: { color: "rgba(255,255,255,0.3)", width: 0.5 },
            opacity: 0.6,
          },
          customdata: barData.map((value) => formatMetricValue(value, scenarioMetric)),
          hovertemplate: `[${scenarioLabel}] ${scenarioMetric}<br>%{customdata}<extra></extra>`,
          visible: "legendonly", // Hidden by default, user can show via legend
        });

        // Add YoY line trace
        const scenarioYoYLabel =
          scenarioDataFrequency === "Weekly" ? "52W" : "YoY";
        scenarioTraces.push({
          type: "scatter",
          mode: "lines+markers",
          x: scenarioPeriods,
          y: yoyData.map(capYoYForDisplay),
          name: `[${scenarioLabel}] ${scenarioYoYLabel} Change %`,
          yaxis: "y2",
          line: {
            color: scenarioColor,
            width: 2.5,
            dash: scenarioDash,
          },
          marker: {
            size: 3,
            color: scenarioColor,
            symbol:
              scenarioIndex === 1
                ? "circle"
                : scenarioIndex === 2
                ? "square"
                : "diamond",
          },
          customdata: yoyData.map(formatYoYValue),
          hovertemplate: `[${scenarioLabel}] ${scenarioYoYLabel} Change: %{customdata}<extra></extra>`,
          connectgaps: false,
          visible: "legendonly",
        });
      } else {
        // Attribute view: similar to prepareChartDataByAttribute
        const config = VIEW_CONFIG[scenarioView];
        if (config) {
          const attribute = config.column;
          const attributeValues = Array.from(
            new Set(
              scenarioFilteredData
                .filter((row) =>
                  scenarioFilteredDates.includes(row[scenarioDateField])
                )
                .map((row) => row[attribute])
                .filter((val) => val && val !== "Unknown")
            )
          );

          // Calculate totals for sorting
          const attributeTotals = attributeValues.map((attrValue) => {
            const attrRows = scenarioFilteredData.filter(
              (row) =>
                scenarioFilteredDates.includes(row[scenarioDateField]) &&
                row[attribute] === attrValue
            );
            let total;
            if (scenarioMetric === "metric3") {
              total = attrRows.reduce(
                (sum, row) =>
                  sum +
                  (row[COLUMNS.METRIC2] || 0),
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
          const topXCategories = sortedAttributes
            .slice(0, scenarioTopX)
            .map((item) => item.attrValue);
          const manualCategories = scenarioSelectedCategories.filter((cat) =>
            attributeValues.includes(cat)
          );
          const combinedCategories = Array.from(
            new Set([...topXCategories, ...manualCategories])
          );
          const restAttributes = attributeValues.filter(
            (val) => !combinedCategories.includes(val)
          );

          const allCategories = [...combinedCategories];
          if (restAttributes.length > 0) {
            allCategories.push("Rest Combined");
          }

          // Create traces for each category
          allCategories.forEach((category, index) => {
            const traceData = scenarioPeriods.map((period) => {
              const periodRows = scenarioDataByPeriod[period] || [];
              if (category === "Rest Combined") {
                const periodRestRows = periodRows.filter((row) =>
                  restAttributes.includes(row[attribute])
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
            const blendedColor = scenarioColor; // Use scenario color instead

            if (scenarioMetric === "metric3") {
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
                  dash: scenarioDash,
                },
                marker: {
                  size: 3,
                  color: blendedColor,
                  symbol:
                    scenarioIndex === 1
                      ? "circle"
                      : scenarioIndex === 2
                      ? "square"
                      : "diamond",
                },
                customdata: traceData.map((value) => formatMetricValue(value, scenarioMetric)),
                hovertemplate: `[${scenarioLabel}] ${category}<br>%{customdata}<extra></extra>`,
              });
            } else {
              // Calculate share percentages
              const periodTotals = scenarioPeriods.map((period) => {
                const periodRows = scenarioDataByPeriod[period] || [];
                return calculateScenarioMetric(periodRows);
              });

              const shares = traceData.map((value, periodIndex) => {
                const totalForPeriod = periodTotals[periodIndex];
                return totalForPeriod > 0 ? (value / totalForPeriod) * 100 : 0;
              });

              // Dollar trace
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
                    opacity: 0.5,
                  },
                  customdata: traceData.map((value) => formatMetricValue(value, scenarioMetric)),
                  hovertemplate: `[${scenarioLabel}] ${category}<br>%{customdata}<extra></extra>`,
                });
              }

              // %Share trace
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
                    dash: scenarioDash,
                  },
                  marker: {
                    size: 3,
                    color: blendedColor,
                    symbol:
                      scenarioIndex === 1
                        ? "circle"
                        : scenarioIndex === 2
                        ? "square"
                        : "diamond",
                  },
                  yaxis: "y2",
                  customdata: shares.map((share) => share != null ? `${share.toFixed(1)}%` : ''),
                  hovertemplate: `[${scenarioLabel}] ${category} - %Share<br>%{customdata}<extra></extra>`,
                });
              }

              // %Share Growth trace (YoY)
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
                      previousCategoryValue =
                        calculateScenarioMetric(previousRestRows);
                    } else {
                      const previousCategoryRows = previousPeriodRows.filter(
                        (row) => row[attribute] === category
                      );
                      previousCategoryValue =
                        calculateScenarioMetric(previousCategoryRows);
                    }

                    const previousPeriodTotal =
                      calculateScenarioMetric(previousPeriodRows);
                    if (
                      previousPeriodTotal === 0 ||
                      previousPeriodTotal === null
                    )
                      return null;

                    const previousShare =
                      previousPeriodTotal > 0
                        ? (previousCategoryValue / previousPeriodTotal) * 100
                        : 0;
                    if (previousShare === 0 || previousShare === null)
                      return null;
                    if (currentShare === 0 || currentShare === null)
                      return null;

                    // Use proper percentage change calculation to handle edge cases
                    return calculatePercentageChange(
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
                  y: shareGrowthRates.map(capYoYForDisplay),
                  visible: "legendonly",
                  line: {
                    color: blendedColor,
                    width: 2,
                    dash: scenarioDash,
                  },
                  marker: {
                    size: 3,
                    color: blendedColor,
                    symbol:
                      scenarioIndex === 1
                        ? "circle"
                        : scenarioIndex === 2
                        ? "square"
                        : "diamond",
                  },
                  yaxis: "y2",
                  customdata: shareGrowthRates.map(formatYoYValue),
                  hovertemplate: `[${scenarioLabel}] ${category} - %Share Growth<br>%{customdata}<extra></extra>`,
                });
              }
            }
          });
        }
      }

      // Filter traces to only include those that were visible when scenario was saved
      if (visibleTraceNames && visibleTraceNames.length > 0) {
        // Helper function to extract base trace name from scenario trace name
        // Example: "[Scenario 1] Category - Metric" -> "Category - Metric"
        const getBaseTraceName = (scenarioTraceName) => {
          // Remove scenario label prefix like "[Scenario 1] " or "[Scenario 2] "
          const match = scenarioTraceName.match(/^\[.*?\]\s*(.+)$/);
          return match ? match[1] : scenarioTraceName;
        };

        // Filter traces to only include those whose base name matches a visible trace name
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
      calculatePercentageChange,
      formatYoYValue,
      capYoYForDisplay,
    ]
  );

  // Helper function to extract periods to highlight from an insight
  const getHighlightPeriods = React.useCallback(
    (insight) => {
      if (!insight || !insight.metadata) return [];

      const { metadata } = insight;
      const periodsToHighlight = [];

      // For sudden_drop alerts, highlight the current period and previous period
      if (metadata.alertType === "sudden_drop" && metadata.period) {
        const periodIndex = periods.indexOf(metadata.period);
        if (periodIndex > 0) {
          // Previous period (before the drop)
          periodsToHighlight.push(periods[periodIndex - 1]);
          // Current period (the drop)
          periodsToHighlight.push(periods[periodIndex]);
        } else if (periodIndex === 0) {
          // If it's the first period, only highlight that one
          periodsToHighlight.push(periods[periodIndex]);
        }
      }

      // For consecutive_decline alerts, we'd need to track periods, but for now just handle sudden_drop
      // Can be extended later for other alert types

      return periodsToHighlight;
    },
    [periods]
  );

  // Helper function to apply highlighting to chartData
  const applyHighlightingToChartData = React.useCallback(
    (chartData, highlightPeriods) => {
      if (!highlightPeriods || highlightPeriods.length === 0) return chartData;

      return chartData.map((trace) => {
        if (!trace.x || !Array.isArray(trace.x)) return trace;

        // Create arrays for marker sizes and colors
        const markerSizes =
          trace.marker && trace.marker.size
            ? Array.isArray(trace.marker.size)
              ? [...trace.marker.size]
              : new Array(trace.x.length).fill(trace.marker.size || 6)
            : new Array(trace.x.length).fill(6);

        const markerColors =
          trace.marker && trace.marker.color
            ? Array.isArray(trace.marker.color)
              ? [...trace.marker.color]
              : new Array(trace.x.length).fill(trace.marker.color || "#6366f1")
            : new Array(trace.x.length).fill(trace.color || "#6366f1");

        const lineWidths =
          trace.line && trace.line.width
            ? Array.isArray(trace.line.width)
              ? [...trace.line.width]
              : new Array(trace.x.length).fill(trace.line.width || 2.5)
            : new Array(trace.x.length).fill(2.5);

        const lineColors =
          trace.line && trace.line.color
            ? Array.isArray(trace.line.color)
              ? [...trace.line.color]
              : new Array(trace.x.length).fill(trace.line.color || "#6366f1")
            : new Array(trace.x.length).fill(trace.color || "#6366f1");

        // Highlight periods
        trace.x.forEach((period, index) => {
          if (highlightPeriods.includes(period)) {
            // Increase marker size and change color to highlight
            markerSizes[index] =
              (trace.type === "bar" ? 1.3 : 1.8) * (markerSizes[index] || 6);
            markerColors[index] = "#ef4444"; // Red highlight color

            // For line charts, increase line width and change color
            if (
              trace.type === "scatter" &&
              trace.mode &&
              trace.mode.includes("lines")
            ) {
              lineWidths[index] = (lineWidths[index] || 2.5) * 2;
              lineColors[index] = "#ef4444";
            }
          }
        });

        // Create updated trace
        const updatedTrace = { ...trace };

        if (trace.type === "scatter") {
          // Handle scatter plots (lines+markers or just markers)
          if (trace.mode && trace.mode.includes("markers")) {
            updatedTrace.marker = {
              ...trace.marker,
              size: markerSizes,
              color: markerColors,
            };
          }
          if (trace.mode && trace.mode.includes("lines")) {
            updatedTrace.line = {
              ...trace.line,
              width: lineWidths,
              color: lineColors,
            };
          }
        } else if (trace.type === "bar") {
          // For bars, highlight with a thicker, colored border
          const currentLineColor =
            (trace.marker && trace.marker.line && trace.marker.line.color) ||
            "rgba(255,255,255,0.3)";
          const currentLineWidth =
            (trace.marker && trace.marker.line && trace.marker.line.width) ||
            0.5;
          const baseLineColor = Array.isArray(currentLineColor)
            ? currentLineColor[0]
            : currentLineColor;
          const baseLineWidth = Array.isArray(currentLineWidth)
            ? currentLineWidth[0]
            : currentLineWidth;

          updatedTrace.marker = {
            ...trace.marker,
            line: {
              ...(trace.marker && trace.marker.line ? trace.marker.line : {}),
              color: trace.x.map((period) =>
                highlightPeriods.includes(period) ? "#ef4444" : baseLineColor
              ),
              width: trace.x.map((period) =>
                highlightPeriods.includes(period) ? 3 : baseLineWidth
              ),
            },
          };
        }

        return updatedTrace;
      });
    },
    []
  );

  // Format x-axis tick labels - shared utility for chart layouts
  const formatXAxisTicks = React.useCallback(
    (periodsArray) => {
      if (periodsArray.length <= 12) {
        return periodsArray.map((period) => formatPeriodDate(period));
      }
      return undefined;
    },
    [formatPeriodDate]
  );

  const prepareChartDataByAttribute = React.useCallback(
    (attribute, attributeName) => {
      // ===== OPTIMIZATION: Use pre-computed dimensionCategoryTotals =====
      const dimTotals = dimensionCategoryTotals[attribute] || {};
      const attributeValues = Object.keys(dimTotals);

      // Use pre-computed totals for sorting (O(1) lookup instead of O(n) filter + reduce)
      const attributeTotals = attributeValues.map((attrValue) => {
        const totals = dimTotals[attrValue] || {
          metric1: 0,
          metric2: 0,
        };
        // For metric3 (derived), use metric2 for sorting instead of the ratio
        const total =
          metric === "metric3"
            ? totals.metric2
            : totals[metric] || totals.metric1;
        return { attrValue, total };
      });

      // Sort attributes for reference
      const sortedAttributes = attributeTotals.sort(
        (a, b) => b.total - a.total
      );

      // Determine which categories to show - combine Top X and Manual selections
      let topAttributes, restAttributes;

      // When server-side top-N bucketing is active (live mode with topX > 0),
      // categories are already bucketed into top-N + "Rest Combined" — use as-is.
      // Client-side re-slicing would create a DUPLICATE "Rest Combined" trace.
      if (isLiveMode && topX > 0) {
        topAttributes = attributeValues;
        restAttributes = [];
      } else {
        // Always get top X categories
        const topXCategories = sortedAttributes
          .slice(0, topX)
          .map((item) => item.attrValue);

        // Get manually selected categories (if any)
        const manualCategories = selectedCategories.filter((cat) =>
          attributeValues.includes(cat)
        );

        // Combine both: Top X + Manual selections (remove duplicates)
        const combinedCategories = Array.from(
          new Set([...topXCategories, ...manualCategories])
        );

        topAttributes = combinedCategories;
        restAttributes = attributeValues.filter(
          (val) => !topAttributes.includes(val)
        );
      }

      // Create traces for each selected/top attribute + Rest Combined
      const allCategories = [...topAttributes];
      if (restAttributes.length > 0) {
        allCategories.push("Rest Combined");
      }

      // ===== OPTIMIZATION: Use pre-computed periodAggregates for period totals =====
      const periodTotals = periods.map((period) => {
        const agg = periodAggregates[period];
        if (!agg) return 0;
        return agg[metric] || agg.metric1;
      });

      // Store share percentages for %Share and %Share Growth Rate traces
      const sharePercentages = {};

      // ===== OPTIMIZATION: Use dimensionAggregates for trace data =====
      const dimAgg = dimensionAggregates[attribute] || {};

      // Build traces grouped by category for better hover ordering
      // Note: In Plotly stacked bars, trace order determines both stack (bottom-to-top)
      // and hover (top-to-bottom), which creates an inherent visual mismatch
      const chartData = [];

      allCategories.forEach((category, index) => {
        const traceData = periods.map((period) => {
          // When server-side top-N is active, "Rest Combined" is a real category
          // in dimensionAggregates — read it directly instead of re-summing.
          if (category !== "Rest Combined" || (isLiveMode && topX > 0)) {
            // Per-period top-N: category may not exist in every period (bucketed
            // into "Rest Combined" for that period). Return null (gap) instead of 0
            // so Plotly skips it in hover tooltips and doesn't draw a misleading bar.
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

          // For client-side "Rest Combined": sum base metrics first for metric3 (not the ratios themselves)
          if (metric === "metric3") {
            let m1Sum = 0,
              m2Sum = 0;
            const dimAgg = dimensionAggregates[attribute];
            restAttributes.forEach((restAttr) => {
              const catAgg =
                dimAgg && dimAgg[period] && dimAgg[period][restAttr];
              if (catAgg) {
                m1Sum += catAgg.metric1 || 0;
                m2Sum += catAgg.metric2 || 0;
              }
            });
            return m1Sum > 0 ? (10000 * m2Sum) / m1Sum : 0;
          }

          // For metric1/metric2, sum metric values directly
          return restAttributes.reduce(
            (sum, attr) =>
              sum +
              getDimMetric(
                dimensionAggregates,
                attribute,
                period,
                attr,
                metric
              ),
            0
          );
        });

        // ===== OPTIMIZATION: Use pre-computed aggregates for percentages =====
        const textAnnotations = traceData.map((value, periodIndex) => {
          const period = periods[periodIndex];
          const totalForPeriod = periodTotals[periodIndex];
          const periodTotalAgg = periodAggregates[period];
          let percentage;

          if (metric === "metric3") {
            // For metric3 (derived), calculate share based on metric1 using pre-computed aggregates
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

            percentage =
              totalM1 > 0 ? (categoryM1 / totalM1) * 100 : 0;
          } else {
            // For metric1 and metric2, calculate share as usual
            percentage =
              (value !== null && totalForPeriod > 0) ? (value / totalForPeriod) * 100 : 0;
          }

          // Store share percentage for %Share traces (only for Volume and Revenue)
          if (metric !== "metric3") {
            if (!sharePercentages[category]) {
              sharePercentages[category] = [];
            }
            sharePercentages[category].push(value === null ? null : percentage);
          }

          if (value === 0 || value === null) return "";

          return formatMetric(value) + "<br>" + percentage.toFixed(1) + "%";
        });

        // Stable color from dimension-level map (survives grain/top-N changes)
        const dimColorMap = categoryColorMap[attribute] || {};
        const categoryColor = dimColorMap[category] || getCategoryColor(category, index);

        // Add main metric trace (bar or line)
        const chartType = resolveChartType(metric);
        if (chartType === "line") {
          chartData.push({
            type: "scatter",
            mode: "lines+markers",
            name: `${category} - ${METRIC_LABELS[metric] || metric}`,
            x: periods,
            y: traceData,
            visible: true,
            line: {
              color: categoryColor,
              width: 2.5,
            },
            marker: {
              size: 3,
              color: categoryColor,
            },
            customdata: traceData.map((value) => formatMetricValue(value, metric)),
            hovertemplate: category + "<br>%{customdata}<extra></extra>",
          });
        } else {
          chartData.push({
            type: "bar",
            name: `${category} - ${METRIC_LABELS[metric] || metric}`,
            x: periods,
            y: traceData,
            visible: showAllDollarTraces ? true : "legendonly",
            marker: {
              color: categoryColor,
              line: { color: "rgba(255,255,255,0.3)", width: 0.5 },
              opacity: 0.85,
            },
            // Add text annotations with percentage
            text: textAnnotations,
            textposition: "inside",
            textfont: {
              color: isDarkMode ? "#ffffff" : "#111827",
              size: 9,
              family: "'Inter', 'Segoe UI', sans-serif",
            },
            insidetextanchor: "middle",
            customdata: traceData.map((value) => formatMetricValue(value, metric)),
            hovertemplate: category + "<br>%{customdata}<extra></extra>",
          });
        }

        // Add %Share and %Growth YoY traces — only for bar metrics (not line/ratio metrics)
        if (chartType !== "line") {
          const shares = sharePercentages[category] || [];

          // Add %Share trace
          chartData.push({
            type: "scatter",
            mode: "lines+markers",
            name: `${category} - %Share`,
            x: periods,
            y: shares,
            visible: showAllShareTraces ? true : "legendonly",
            line: {
              color: categoryColor,
              width: 2,
              dash: "dot",
            },
            marker: {
              size: 3,
              color: categoryColor,
            },
            yaxis: "y2",
            customdata: shares.map((share) => share != null ? `${share.toFixed(1)}%` : ''),
            hovertemplate: `${category} - %Share<br>%{customdata}<extra></extra>`,
          });

          // ===== Calculate %Growth YoY for each dimension category =====
          // OPTIMIZATION: Reuses existing calculatePercentageChange helper for consistency
          // and leverages cached baseDimensionAggregates data
          // Exclude last period from YoY calculation (consistent with Overall view)
          const periodsForYoY = periods.slice(0, -1);
          const yoyGrowthRatesForPeriods = periodsForYoY.map(
            (currentPeriod) => {
              // Get current period value for this category (from cached baseDimensionAggregates)
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

              // Find the same period from previous year (consistent with Overall view logic)
              let previousPeriod;
              if (dataFrequency === "Weekly") {
                const currentIndex =
                  sortedBaseDataPeriods.indexOf(currentPeriod);
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

              // Check if previous period exists in the data (consistent with Overall view logic)
              const dimAgg = baseDimensionAggregates[attribute];
              if (!dimAgg || !dimAgg[previousPeriod]) {
                // Previous period doesn't exist in data - return null (same as Overall view)
                return null;
              }

              // Get previous period value for this category (from cached baseDimensionAggregates)
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

              // Use existing calculatePercentageChange helper for consistency
              // (handles all edge cases: zero, negative, sign changes, infinity)
              return calculatePercentageChange(
                currentCategoryValue,
                previousCategoryValue
              );
            }
          );

          // Pad with null for the last period (consistent with Overall view)
          const yoyGrowthRates = [...yoyGrowthRatesForPeriods, null];

          // Add %Growth YoY trace
          chartData.push({
            type: "scatter",
            mode: "lines+markers",
            name: `${category} - %Growth YoY`,
            x: periods,
            y: yoyGrowthRates.map(capYoYForDisplay), // Cap infinity for display
            visible: showAllGrowthTraces ? true : "legendonly",
            line: {
              color: categoryColor,
              width: 2,
              dash: "solid",
            },
            marker: {
              size: 3,
              color: categoryColor,
            },
            yaxis: "y2",
            customdata: yoyGrowthRates.map(formatYoYValue),
            hovertemplate: `${category} - %Growth YoY<br>%{customdata}<extra></extra>`,
          });
        }
      });

      // Calculate reference line data for line metrics (overall average per period)
      const splitChartType = resolveChartType(metric);
      const referenceLineData =
        splitChartType === "line"
          ? periods.map((period) => {
              const agg = periodAggregates[period];
              if (!agg) return 0;
              return agg[metric] || 0;
            })
          : null;

      // Add reference line trace for line metrics
      if (splitChartType === "line" && referenceLineData) {
        chartData.push({
          type: "scatter",
          mode: "lines+markers",
          x: periods,
          y: referenceLineData,
          name: "Overall Average",
          line: {
            color: "#6b7280",
            width: 2,
            dash: "dash",
          },
          marker: {
            size: 3,
            color: "#6b7280",
          },
          customdata: referenceLineData.map((value) => formatMetricValue(value, metric)),
          hovertemplate: "Overall Average: %{customdata}<extra></extra>",
        });
      }

      // Simple title - just metric name + optional filters
      const titleText = getSimpleChartTitle();

      // Show legend all the time to allow individual trace selection
      const showLegend = true;

      const chartLayout = {
        title: {
          text: titleText,
          font: { size: 16, color: "#374151" },
        },
        barmode: splitChartType === "line" ? undefined : splitChartType === "grouped" ? "group" : "relative",
        showlegend: showLegend,
        legend: {
          x: 1.02,
          y: 1,
          xanchor: "left",
          yanchor: "top",
          bgcolor: "rgba(255, 255, 255, 0.8)",
          bordercolor: "#e5e7eb",
          borderwidth: 1,
          traceorder: "reversed", // Reverse legend order to match visual stacking
        },
        xaxis: {
          type: "category", // Treat as categorical to avoid timezone date parsing issues
          title: {
            text: dataFrequency.replace("ly", ""),
            font: { size: 14, color: "#374151" },
          },
          tickfont: { color: "#6b7280" },
          linecolor: "#e5e7eb",
          showgrid: false,
          showspikes: false,
          // Show all ticks if total number of ticks is <= 12
          tickmode: periods.length <= 12 ? "array" : "auto",
          tickvals: periods.length <= 12 ? periods : undefined,
          ticktext: formatXAxisTicks(periods),
        },
        yaxis: {
          title: {
            text: isLiveMode ? (METRIC_LABELS[metric] || metric) : (splitChartType === "line" ? "Basis Points" : "USD"),
            font: { size: 14, color: "#374151" },
          },
          tickfont: { color: "#6b7280" },
          zerolinecolor: "#e5e7eb",
          showgrid: false,
          showspikes: false,
          // Add range calculation to include negative values in stacked bars
          range: (() => {
            // Get all bar traces
            const barTraces = chartData.filter((trace) => trace.type === "bar");

            if (barTraces.length === 0) return undefined;

            // Calculate stacked totals per period (for relative mode)
            const numPeriods =
              barTraces[0] && barTraces[0].y ? barTraces[0].y.length : 0;
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
              // Include negative values with individual padding
              return [minStackedNegative * 1.3, maxStackedPositive * 1.3];
            } else if (maxStackedPositive > 0) {
              // Only positive values
              return [0, maxStackedPositive * 1.3];
            }
            return undefined;
          })(),
        },
        hovermode: "x unified",
      };

      // Add secondary y-axis for %Share and %Growth YoY (only for bar metrics)
      if (splitChartType !== "line") {
        chartLayout.yaxis2 = {
          title: {
            text: "% Share / %Growth YoY",
            font: { size: 12, color: "#6366f1" },
          },
          tickfont: { color: "#6366f1", size: 11 },
          overlaying: "y",
          side: "right",
          showgrid: false,
          zeroline: showAllShareTraces || showAllGrowthTraces,
          zerolinewidth: 2,
          zerolinecolor: "#d1d5db",
        };
      }

      return { chartData, chartLayout };
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
      formatPeriodDate,
      formatXAxisTicks,
      formatYoYValue,
      capYoYForDisplay,
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
      categoryColorMap,
    ]
  );

  // Helper function to get current chart data without scenarios and extract visible trace names
  const getVisibleTraceNames = React.useCallback(() => {
    let chartData = [];
    if (view === "Overall") {
      chartData = [{ name: METRIC_LABELS[metric] || metric, visible: true }];
      OVERLAY_CONFIG.forEach(overlay => {
        if (activeOverlays[overlay.id]) {
          const name = overlay.isForecast ? overlay.label : overlay.isSMA ? `SMA(${smaWindow})` : overlay.label + ' Change %';
          chartData.push({ name, visible: true });
        }
      });
    } else {
      const config = VIEW_CONFIG[view];
      if (config) {
        const result = prepareChartDataByAttribute(config.column, config.label);
        chartData = result.chartData;
      }
    }
    const visibleTraceNames = chartData
      .filter(
        (trace) => trace.visible !== "legendonly" && trace.visible !== false
      )
      .map((trace) => trace.name);

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

  // Prepare chart data based on view
  const { chartData, chartLayout } = React.useMemo(() => {
    let chartData = [];
    let chartLayout = {};

    if (view === "Overall") {
      // Use periodAggregates — unified path for both demo and live mode
      const barData = periods.map((period) => {
        const agg = periodAggregates[period];
        return agg ? (agg[metric] || 0) : 0;
      });

      // Build overlay traces dynamically from activeOverlays
      const overlayTraces = [];
      let primaryOverlayData = null; // For bar text annotations

      OVERLAY_CONFIG.forEach(overlay => {
        if (!activeOverlays[overlay.id]) return;
        if (overlay.isForecast) return; // Handled separately below

        if (overlay.isSMA) {
          const smaData = calculateSMA(barData, smaWindow);
          overlayTraces.push({
            type: 'scatter', mode: 'lines',
            x: periods, y: smaData,
            name: `SMA(${smaWindow})`,
            yaxis: 'y',
            line: { color: overlay.color, width: 2, dash: 'dot' },
            customdata: smaData.map(v => v !== null ? formatMetricValue(v, metric) : 'N/A'),
            hovertemplate: `SMA(${smaWindow}): %{customdata}<extra></extra>`,
            connectgaps: false,
          });
        } else {
          const lookback = overlay.lookback[dataFrequency];
          if (!lookback) return;

          const changeData = periods.map((period, i) => {
            const currentIndex = sortedBaseDataPeriods.indexOf(period);
            if (currentIndex === -1) return null;
            return calculatePeriodChange(currentIndex, barData[i], lookback, sortedBaseDataPeriods, baseDataAggregatesByPeriod, metric);
          });

          if (!primaryOverlayData) primaryOverlayData = { data: changeData, label: overlay.label };

          overlayTraces.push({
            type: 'scatter', mode: 'lines+markers',
            x: periods, y: changeData.map(capYoYForDisplay),
            name: overlay.label + ' Change %',
            yaxis: 'y2',
            line: { color: overlay.color, width: 2.5, shape: 'spline', smoothing: 0.3 },
            marker: { size: 3, color: overlay.color, line: { color: '#ffffff', width: 1 } },
            customdata: changeData.map(formatYoYValue),
            hovertemplate: overlay.label + ' Change: %{customdata}<extra></extra>',
            connectgaps: false,
          });
        }
      });

      // Build forecast overlay traces (extended x-axis with future periods)
      // Train on full history (sortedBaseDataPeriods + baseDataAggregatesByPeriod) — same
      // data source as DoD/YoY overlays — so forecast is stable regardless of date range.
      const activeForecastOverlays = OVERLAY_CONFIG.filter(o => o.isForecast && activeOverlays[o.id]);
      let forecastExtendedPeriods = periods; // default: no extension
      let forecastUpperMax = 0;

      // Build full-history training data (dimension-filtered, not date-range-filtered)
      const fullHistoryValues = sortedBaseDataPeriods.map(p => {
        const agg = baseDataAggregatesByPeriod[p];
        return agg ? (agg[metric] || 0) : 0;
      });

      if (activeForecastOverlays.length > 0 && fullHistoryValues.length >= 3) {
        const futurePeriods = generateFuturePeriods(sortedBaseDataPeriods, dataFrequency, forecastHorizon);
        forecastExtendedPeriods = [...periods, ...futurePeriods];

        activeForecastOverlays.forEach(overlay => {
          let result;
          if (overlay.id === 'forecast_hw') {
            const sp = detectSeasonalPeriod(dataFrequency);
            result = (sp && fullHistoryValues.length >= sp * 2)
              ? forecastHoltWinters(fullHistoryValues, forecastHorizon, sp)
              : forecastLinear(fullHistoryValues, forecastHorizon);
          } else {
            result = forecastLinear(fullHistoryValues, forecastHorizon);
          }
          if (!result) return;

          // Track max for y-axis range
          forecastUpperMax = Math.max(forecastUpperMax, ...result.upper);

          // Bridge: connect last actual value to first forecast for visual continuity
          const lastActualValue = barData[barData.length - 1];
          const bridgeY = new Array(periods.length).fill(null);
          bridgeY[periods.length - 1] = lastActualValue;
          const forecastY = [...bridgeY, ...result.forecast];
          const upperY = [...bridgeY, ...result.upper];
          const lowerY = [...new Array(periods.length).fill(null).map((_, i) => i === periods.length - 1 ? lastActualValue : null), ...result.lower];

          const mapeLabel = result.mape > 0 ? ` (MAPE: ${result.mape.toFixed(1)}%)` : '';

          // Forecast line
          overlayTraces.push({
            type: 'scatter', mode: 'lines',
            x: forecastExtendedPeriods, y: forecastY,
            name: `${overlay.label}${mapeLabel}`,
            yaxis: 'y',
            line: { color: overlay.color, width: 2.5, dash: 'dash' },
            connectgaps: false,
            customdata: forecastY.map(v => v !== null ? formatMetricValue(v, metric) : 'N/A'),
            hovertemplate: `${overlay.label}: %{customdata}<extra></extra>`,
          });

          // Upper confidence bound (invisible anchor for fill)
          overlayTraces.push({
            type: 'scatter', mode: 'lines',
            x: forecastExtendedPeriods, y: upperY,
            yaxis: 'y', line: { width: 0 },
            showlegend: false, hoverinfo: 'skip',
          });

          // Lower confidence bound with fill to upper
          overlayTraces.push({
            type: 'scatter', mode: 'lines',
            x: forecastExtendedPeriods, y: lowerY,
            yaxis: 'y', line: { width: 0 },
            fill: 'tonexty',
            fillcolor: hexToRgba(overlay.color, 0.12),
            showlegend: false, hoverinfo: 'skip',
          });
        });
      }

      // Create text annotations — show change only when exactly 1 period-change overlay active
      const activeChangeOverlays = OVERLAY_CONFIG.filter(o => !o.isSMA && !o.isForecast && activeOverlays[o.id]);
      const textAnnotations = barData.map((value, index) => {
        let annotation = formatMetric(value);
        if (activeChangeOverlays.length === 1 && primaryOverlayData) {
          const changeVal = primaryOverlayData.data[index];
          if (changeVal !== null) {
            annotation += '<br>' + primaryOverlayData.label + ': ' + formatYoYValueUtil(changeVal);
          }
        }
        return annotation;
      });

      const barColors = barData.map((_, index) => {
        if (index === barData.length - 1) {
          return "rgba(156, 163, 175, 0.6)"; // Light gray for last bar (developing data)
        }
        return MODERN_COLOR_PALETTE[0]; // Primary color for all other bars
      });

      const overallChartType = resolveChartType(metric);
      const mainTrace = overallChartType === "line"
        ? {
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
            hovertemplate: "%{customdata}<extra></extra>",
          }
        : {
            type: "bar",
            x: periods,
            y: barData,
            name: METRIC_LABELS[metric] || metric,
            marker: {
              color: barColors,
              line: { color: "rgba(255,255,255,0.3)", width: 0.5 },
              opacity: 0.85,
            },
            text: textAnnotations,
            textposition: "outside",
            textfont: { color: theme.textPrimary, size: 11 },
            customdata: barData.map((value) => formatMetricValue(value, metric)),
            hovertemplate: "%{customdata}<extra></extra>",
          };

      chartData = [mainTrace, ...overlayTraces];

      chartLayout = {
        title: {
          text: getSimpleChartTitle(),
          font: { size: 16, color: "#374151" },
        },
        xaxis: {
          type: "category", // Treat as categorical to avoid timezone date parsing issues
          title: {
            text: dataFrequency.replace("ly", ""),
            font: { size: 14, color: "#374151" },
          },
          tickfont: { color: "#6b7280" },
          linecolor: "#e5e7eb",
          showgrid: false,
          showspikes: false,
          // Show all ticks if total number of ticks is <= 12
          tickmode: forecastExtendedPeriods.length <= 12 ? "array" : "auto",
          tickvals: forecastExtendedPeriods.length <= 12 ? forecastExtendedPeriods : undefined,
          ticktext: formatXAxisTicks(forecastExtendedPeriods),
        },
        yaxis: {
          title: {
            text: isLiveMode ? (METRIC_LABELS[metric] || metric) : (overallChartType === "line" ? "Basis Points" : "USD"),
            font: { size: 14, color: "#374151" },
          },
          tickfont: { color: "#6b7280" },
          zerolinecolor: "#e5e7eb",
          showgrid: false,
          side: "left",
          showspikes: false,
          range:
            barData.length > 0
              ? (() => {
                  const maxValue = Math.max(...barData, forecastUpperMax);
                  const minValue = Math.min(...barData);
                  if (minValue < 0) {
                    return [minValue * 1.3, maxValue * 1.3];
                  } else if (maxValue > 0) {
                    return [0, maxValue * 1.3];
                  }
                  return undefined;
                })()
              : undefined,
        },
        // Vertical separator at forecast boundary
        shapes: activeForecastOverlays.length > 0 ? [{
          type: 'line',
          x0: periods[periods.length - 1],
          x1: periods[periods.length - 1],
          y0: 0, y1: 1, yref: 'paper',
          line: { color: '#9ca3af', width: 1.5, dash: 'dot' },
        }] : [],
        yaxis2: activeChangeOverlays.length > 0 ? {
          title: {
            text: activeChangeOverlays.map(o => o.label).join(' / ') + " Change (%)",
            font: { size: 14, color: activeChangeOverlays.length === 1 ? activeChangeOverlays[0].color : '#6b7280' },
          },
          tickfont: { color: activeChangeOverlays.length === 1 ? activeChangeOverlays[0].color : '#6b7280' },
          showgrid: false,
          side: "right",
          overlaying: "y",
          zeroline: true,
          zerolinewidth: 2,
          zerolinecolor: "#d1d5db",
          showspikes: false,
        } : { visible: false, overlaying: "y" },
        hovermode: "x unified",
      };
    } else {
      const config = VIEW_CONFIG[view];
      if (config) {
        const result = prepareChartDataByAttribute(config.column, config.label);
        chartData = result.chartData;
        chartLayout = result.chartLayout;
      }
    }

    if (activeScenarios.scenario1 && scenario1) {
      const scenario1Traces = calculateScenarioChartData(
        scenario1,
        1,
        scenarioLabels.scenario1
      );
      chartData = [...chartData, ...scenario1Traces];
    }
    if (activeScenarios.scenario2 && scenario2) {
      const scenario2Traces = calculateScenarioChartData(
        scenario2,
        2,
        scenarioLabels.scenario2
      );
      chartData = [...chartData, ...scenario2Traces];
    }
    if (activeScenarios.scenario3 && scenario3) {
      const scenario3Traces = calculateScenarioChartData(
        scenario3,
        3,
        scenarioLabels.scenario3
      );
      chartData = [...chartData, ...scenario3Traces];
    }

    // Modern layout configuration
    const modernLayout = {
      ...chartLayout,
      font: {
        family: "'Inter', 'Segoe UI', sans-serif",
        size: 12,
        color: theme.textPrimary,
      },
      legend: {
        bgcolor: "transparent",
        bordercolor: "transparent",
        borderwidth: 0,
        font: { color: theme.textSecondary, size: 11 },
        orientation: "h",
        y: -0.25,
      },
      plot_bgcolor: theme.chartPlotBg,
      paper_bgcolor: theme.chartBg,
      hoverlabel: {
        font: {
          size: 11,
          family: "'Inter', 'Segoe UI', sans-serif",
          color: theme.textPrimary,
        },
        bgcolor: isDarkMode
          ? "rgba(45, 55, 72, 0.95)"
          : "rgba(255, 255, 255, 0.95)",
        bordercolor: theme.borderPrimary,
      },
      xaxis: {
        ...chartLayout.xaxis,
        color: theme.textPrimary,
        gridcolor: isDarkMode
          ? "rgba(75, 85, 99, 0.4)"
          : "rgba(229, 231, 235, 0.5)",
        title:
          chartLayout.xaxis && chartLayout.xaxis.title
            ? {
                ...chartLayout.xaxis.title,
                font: {
                  color: theme.textPrimary,
                  size: 12,
                },
              }
            : undefined,
      },
      yaxis: {
        ...chartLayout.yaxis,
        color: theme.textPrimary,
        gridcolor: isDarkMode
          ? "rgba(75, 85, 99, 0.4)"
          : "rgba(229, 231, 235, 0.5)",
        title:
          chartLayout.yaxis && chartLayout.yaxis.title
            ? {
                ...chartLayout.yaxis.title,
                font: {
                  color: theme.textPrimary,
                  size: 12,
                },
              }
            : undefined,
      },
      title: chartLayout.title
        ? {
            ...chartLayout.title,
            font: {
              color: theme.textPrimary,
              size: 14,
              family: "'Inter', 'Segoe UI', sans-serif",
            },
          }
        : undefined,
      annotations: chartLayout.annotations
        ? chartLayout.annotations.map((ann) => ({
            ...ann,
            font: {
              ...ann.font,
              color: theme.textPrimary,
              size: 11,
            },
          }))
        : undefined,
      height: 500,
      margin: { l: 80, r: 80, t: 60, b: 140 },
    };

    return { chartData, chartLayout: modernLayout };
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
    formatPeriodDate,
    activeScenarios,
    scenario1,
    scenario2,
    scenario3,
    scenarioLabels,
    calculateScenarioChartData,
    capYoYForDisplay,
    formatYoYValue,
    isDarkMode,
    theme,
    periodAggregates,
    activeOverlays,
    smaWindow,
    forecastHorizon,
    sortedBaseDataPeriods,
    baseDataAggregatesByPeriod,
    formatMetricValue,
    METRIC_LABELS,
  ]);

  // Apply highlighting to chartData when an insight is hovered
  const highlightedChartData = React.useMemo(() => {
    if (!hoveredInsight) return chartData;

    const highlightPeriods = getHighlightPeriods(hoveredInsight);
    if (highlightPeriods.length === 0) return chartData;

    return applyHighlightingToChartData(chartData, highlightPeriods);
  }, [
    chartData,
    hoveredInsight,
    getHighlightPeriods,
    applyHighlightingToChartData,
  ]);

  // Apply legend visibility state to chart data
  const finalChartData = React.useMemo(() => {
    if (Object.keys(traceVisibility).length === 0) return highlightedChartData;

    return highlightedChartData.map((trace) => {
      const traceName = trace.name;
      if (traceName in traceVisibility) {
        // Convert boolean to Plotly's visibility format: true or 'legendonly'
        return {
          ...trace,
          visible: traceVisibility[traceName] ? true : "legendonly",
        };
      }
      return trace;
    });
  }, [highlightedChartData, traceVisibility]);

  // Handle legend click events to track visibility state
  const handleLegendClick = React.useCallback((event) => {
    if (event && event.curveNumber !== undefined && event.data) {
      // Get the clicked trace
      const clickedTrace = event.data[event.curveNumber];
      if (!clickedTrace || !clickedTrace.name) {
        return true; // Allow default behavior if we can't identify the trace
      }

      // Create new visibility state by toggling the clicked trace
      const newVisibility = {};
      event.data.forEach((trace) => {
        if (trace.name) {
          // If this is the clicked trace, toggle its visibility
          // trace.visible can be true, false, or 'legendonly'
          if (trace.name === clickedTrace.name) {
            const currentVisibility =
              trace.visible === false || trace.visible === "legendonly"
                ? false
                : true;
            newVisibility[trace.name] = !currentVisibility;
          } else {
            // Keep other traces at their current visibility
            newVisibility[trace.name] =
              trace.visible === false || trace.visible === "legendonly"
                ? false
                : true;
          }
        }
      });
      setTraceVisibility(newVisibility);

      // Return false to prevent Plotly's default behavior since we're handling it manually
      return false;
    }
    return true; // Allow default behavior if we can't handle it
  }, []);

  // Helper function to get available categories for the current view
  const getAvailableCategoriesForView = React.useCallback(() => {
    if (view === "Overall") return [];

    const config = VIEW_CONFIG[view];
    if (!config) return [];

    const column = config.column;
    if (!column) return [];

    // Use dimensionCategoryTotals (works in both demo and live mode)
    const dimTotals = dimensionCategoryTotals[column];
    if (dimTotals) {
      return Object.keys(dimTotals)
        .filter((val) => val && val !== "Unknown")
        .sort();
    }
    return [];
  }, [view, dimensionCategoryTotals, VIEW_CONFIG]);

  // Filter categories based on search text
  const filteredCategories = React.useMemo(() => {
    const allCategories = getAvailableCategoriesForView();
    if (!categorySearchText || categorySearchText.trim().length === 0) {
      return allCategories;
    }
    const searchTerm = categorySearchText.toLowerCase().trim();
    return allCategories.filter(
      (category) =>
        formatFilterName(category).toLowerCase().includes(searchTerm) ||
        category.toLowerCase().includes(searchTerm)
    );
  }, [getAvailableCategoriesForView, categorySearchText, formatFilterName]);

  const currentFilterSuggestions = React.useMemo(() => {
    // If no search text, show all options
    if (
      !debouncedFilterSearchText ||
      debouncedFilterSearchText.trim().length === 0
    ) {
      return allFilterSuggestions;
    }

    // Simple client-side filtering (very fast on pre-grouped data)
    const searchTerm = debouncedFilterSearchText.toLowerCase().trim();
    const filtered = {};

    Object.keys(allFilterSuggestions).forEach((type) => {
      const matchingOptions = allFilterSuggestions[type].filter((option) => {
        return (
          option.displayName.toLowerCase().includes(searchTerm) ||
          option.searchText.includes(searchTerm) ||
          type.toLowerCase().includes(searchTerm)
        );
      });

      if (matchingOptions.length > 0) {
        filtered[type] = matchingOptions;
      }
    });

    return filtered;
  }, [debouncedFilterSearchText, allFilterSuggestions]);

  // Simplified query parser
  const parseQuery = React.useCallback(
    (query) => {
      // Patterns:
      // 1. "What is <category>'s <metric>" -> Default view, filter on category
      // 2. "What is <category>'s <metric> Growth [within <filter>]" -> Default view, filter on category + optional filters
      // 3. "What is <category>'s <metric> Share [within <filter>]" -> Category's dimension view, filter on category + optional filters

      const metricPatterns = {
        [METRIC_LABELS.metric2 || "metric2"]: "metric2",
        [METRIC_LABELS.metric1 || "metric1"]: "metric1",
        [METRIC_LABELS.metric3 || "metric3"]: "metric3",
      };

      let parsed = {
        category: null,
        categoryValue: null, // The actual value to filter on
        filters: [],
        metric: null,
        action: null, // "growth" or "share"
        isValid: false,
      };

      let queryText = query.trim();
      if (queryText.toLowerCase().startsWith("what is")) {
        queryText = queryText.substring(7).trim();
      }

      // Extract metric
      for (const [metricName, metricValue] of Object.entries(metricPatterns)) {
        if (queryText.toLowerCase().includes(metricName.toLowerCase())) {
          parsed.metric = metricValue;
          queryText = queryText
            .replace(new RegExp(metricName, "gi"), "")
            .trim();
          break;
        }
      }

      // Extract action (Growth, Share, or Unit - Amount/Bps)
      if (queryText.toLowerCase().includes("growth")) {
        parsed.action = "growth";
        queryText = queryText.replace(/growth/gi, "").trim();
      } else if (queryText.toLowerCase().includes("share")) {
        parsed.action = "share";
        queryText = queryText.replace(/share/gi, "").trim();
      } else if (
        queryText.toLowerCase().includes("amount") ||
        queryText.toLowerCase().includes("bps")
      ) {
        // Unit (Amount/Bps) behaves the same as Growth
        parsed.action = "growth";
        queryText = queryText.replace(/\b(amount|bps)\b/gi, "").trim();
      }

      // Extract category (before "'s")
      const categoryMatch = queryText.match(/^(.+?)(?:\'s)/i);
      if (categoryMatch) {
        parsed.category = categoryMatch[1].trim();
      }

      // Extract filters (after "within")
      const withinMatch = query.match(/within\s+(.+?)$/i);
      if (withinMatch) {
        let filterText = withinMatch[1].trim();
        // Handle "all X" -> just "X"
        filterText = filterText.replace(/^all\s+/i, "");

        // Split by "/" or "and" or ","
        parsed.filters = filterText
          .split(/[\/,\s]+and\s+|[\/,]+|\s+and\s+/i)
          .map((f) => f.trim())
          .filter((f) => f && f.toLowerCase() !== "all");
      }

      // Find the actual category value from filter options
      if (parsed.category) {
        FILTER_CONFIG_STATIC.forEach(({ key }) => {
          const optionsArray = getFilterOptions(key);
          if (optionsArray) {
            const found = optionsArray.find(
              (opt) =>
                formatFilterName(opt).toLowerCase() ===
                  parsed.category.toLowerCase() ||
                String(opt).toLowerCase() === parsed.category.toLowerCase()
            );
            if (found) {
              parsed.categoryValue = found;
            }
          }
        });
      }

      // Query is valid if it has category and metric
      parsed.isValid = !!parsed.category && !!parsed.metric;

      return parsed;
    },
    [formatFilterName, FILTER_CONFIG, getFilterOptions]
  );

  const getCategoriesForView = React.useCallback(
    (config) => {
      return Array.from(
        new Set(
          baseFilteredData
            .map((row) => row[config.column])
            .filter((val) => val && val !== "Unknown")
        )
      );
    },
    [baseFilteredData]
  );

  const setViewAndCategory = React.useCallback((viewName, categoryValue) => {
    setView(viewName);
    setTopX(0); // Set TopX to 0 when coming from Ask a Question
    setTimeout(() => {
      setSelectedCategories([categoryValue]);
    }, 0);
  }, []);

  const matchFiltersToOptions = React.useCallback(
    (filterNames, optionsArray) => {
      return filterNames
        .map((filterName) => {
          return optionsArray.find((opt) => {
            // Handle boolean values (for AI Company filter) - direct comparison
            if (typeof opt === "boolean" || typeof filterName === "boolean") {
              return opt === filterName;
            }
            // Handle string comparisons
            const optStr = String(opt);
            const filterStr = String(filterName);
            return (
              formatFilterName(optStr).toLowerCase() ===
                filterStr.toLowerCase() ||
              optStr.toLowerCase() === filterStr.toLowerCase()
            );
          });
        })
        .filter((opt) => opt !== undefined && opt !== null);
    },
    [formatFilterName]
  );

  // Apply structured LLM response to dashboard controls
  const applyLLMResponse = React.useCallback(
    (response) => {
      isExecutingQueryRef.current = true;

      // Validate and apply metric — accept internal keys or display labels
      const validMetricKeys = ["metric1", "metric2", "metric3"];
      if (response.metric) {
        if (validMetricKeys.includes(response.metric)) {
          setMetric(response.metric);
        } else {
          // LLM may return a display label — reverse-map to internal key
          const labelToKey = Object.entries(METRIC_LABELS).find(
            ([, label]) => label && label.toLowerCase() === response.metric.toLowerCase()
          );
          if (labelToKey && validMetricKeys.includes(labelToKey[0])) {
            setMetric(labelToKey[0]);
          }
        }
      }

      // Validate and apply dataFrequency
      const validFreqs = isLiveMode ? ["Daily", "Weekly", "Monthly", "Quarterly", "Yearly"] : ["Weekly", "Monthly", "Quarterly", "Yearly"];
      if (response.dataFrequency && validFreqs.includes(response.dataFrequency)) {
        setDataFrequency(response.dataFrequency);
      }

      // Validate and apply dateRange
      const validRanges = DATE_RANGES;
      if (response.dateRange && validRanges.includes(response.dateRange)) {
        setDateRange(response.dateRange);
      }

      // Apply filters — validate each key and values against actual options
      if (response.filters && typeof response.filters === "object") {
        // Clear existing filters first
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

      // Apply view
      const validViews = ["Overall", ...Object.keys(VIEW_CONFIG)];
      if (response.view && validViews.includes(response.view)) {
        setView(response.view);
        // If view is a dimension and selectedCategories provided, apply them
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

  // Handle natural language query via LLM worker
  const handleLLMQuery = React.useCallback(
    async (query) => {
      if (!query || !query.trim()) return;
      setIsLLMLoading(true);
      setLlmError("");
      setLlmExplanation("");

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      try {
        const schema = buildLLMSchema();
        const res = await fetch(LLM_WORKER_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: query, schema }),
          signal: controller.signal,
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

  // Natural language example questions for Feeling Lucky — data-driven in live mode
  const LLM_EXAMPLE_QUESTIONS = React.useMemo(() => {
    if (isLiveMode && liveMetricConfig) {
      const mLabels = [METRIC_LABELS.metric1, METRIC_LABELS.metric2, METRIC_LABELS.metric3].filter(Boolean);
      const dimLabels = DIMENSION_DEFINITIONS.map(d => d.viewName || d.filterLabel);
      // Collect a few real category values from the data
      const sampleCats = [];
      DIMENSION_DEFINITIONS.forEach(d => {
        const col = COLUMNS[d.columnKey];
        const totals = (dimensionCategoryTotals && dimensionCategoryTotals[col]) || {};
        const cats = Object.keys(totals).filter(c => c && c !== 'Unknown' && c !== 'Rest Combined' && c.length < 30);
        if (cats.length > 0) sampleCats.push(...cats.slice(0, 3));
      });
      const pick = arr => arr[Math.floor(Math.random() * arr.length)];
      const grains = ['daily', 'weekly', 'monthly', 'quarterly'];
      const questions = [];
      // Metric + dimension templates
      mLabels.forEach(m => {
        if (dimLabels.length > 0) {
          questions.push(`How is ${m} trending by ${pick(dimLabels)}?`);
          questions.push(`Show me ${m} by ${pick(dimLabels)}, ${pick(grains)}`);
          questions.push(`Compare ${m} across ${pick(dimLabels)}`);
        }
        questions.push(`What does ${m} look like over the last year?`);
      });
      // Category-specific templates
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
      "Show me quarterly margin rate trends",
    ];
  }, [isLiveMode, liveMetricConfig, METRIC_LABELS, DIMENSION_DEFINITIONS, COLUMNS, dimensionCategoryTotals]);

  // Clear query text when filters, metric, or view change (but not during state restoration or query execution)
  React.useEffect(() => {
    // Skip clearing during state restoration to avoid clearing query text when loading from share code
    if (isRestoringRef.current) return;
    // Skip clearing during query execution to preserve the query text after asking a question
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
    dateRange,
  ]);

  const renderButtonGroup = React.useCallback(
    (options, value, onChange, groupStyle, buttonStyle, activeButtonStyle) => {
      return (
        <div style={groupStyle}>
          {options.map((option) => (
            <button
              key={option}
              style={{
                ...buttonStyle,
                ...(value === option ? activeButtonStyle : {}),
              }}
              onClick={() => onChange(option)}
            >
              {option}
            </button>
          ))}
        </div>
      );
    },
    []
  );

  // Get the next empty scenario slot for progressive disclosure
  const getNextEmptyScenario = React.useCallback(() => {
    if (!scenario1)
      return { index: 1, color: "#ef4444", label: scenarioLabels.scenario1 };
    if (!scenario2)
      return { index: 2, color: "#10b981", label: scenarioLabels.scenario2 };
    if (!scenario3)
      return { index: 3, color: "#8b5cf6", label: scenarioLabels.scenario3 };
    return null; // All slots filled
  }, [scenario1, scenario2, scenario3, scenarioLabels]);

  // Get all saved scenarios
  const getSavedScenarios = React.useCallback(() => {
    const saved = [];
    if (scenario1) {
      saved.push({
        index: 1,
        color: "#ef4444",
        scenario: scenario1,
        isActive: activeScenarios.scenario1,
        label: scenarioLabels.scenario1,
      });
    }
    if (scenario2) {
      saved.push({
        index: 2,
        color: "#10b981",
        scenario: scenario2,
        isActive: activeScenarios.scenario2,
        label: scenarioLabels.scenario2,
      });
    }
    if (scenario3) {
      saved.push({
        index: 3,
        color: "#8b5cf6",
        scenario: scenario3,
        isActive: activeScenarios.scenario3,
        label: scenarioLabels.scenario3,
      });
    }
    return saved;
  }, [scenario1, scenario2, scenario3, activeScenarios, scenarioLabels]);

  // StatBox rendering delegated to extracted component (src/components/StatBox.js)

  return (
    <div style={styles.container}>
      {/* Add keyframes animation for loading spinner */}
      <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>

      {/* Tab Bar — only in live mode with tabs */}
      {baseConnection && tabs.length > 0 && (
        <div style={{
          display: "flex", alignItems: "center", gap: "0", marginBottom: "12px",
          borderBottom: `2px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`,
        }}>
          {tabs.map(tab => {
            const isActive = tab.id === activeTabId;
            const isRenaming = renamingTabId === tab.id;
            return (
              <div key={tab.id} style={{
                display: "flex", alignItems: "center", gap: "4px",
                padding: "8px 16px", fontSize: "13px", fontWeight: isActive ? 600 : 400,
                cursor: "pointer", userSelect: "none", position: "relative",
                color: isActive ? (isDarkMode ? '#f3f4f6' : '#111827') : (isDarkMode ? '#9ca3af' : '#6b7280'),
                backgroundColor: isActive ? (isDarkMode ? 'rgba(99,102,241,0.1)' : 'rgba(99,102,241,0.05)') : 'transparent',
                borderBottom: isActive ? `2px solid ${isDarkMode ? '#818cf8' : '#6366f1'}` : '2px solid transparent',
                marginBottom: '-2px',
                borderRadius: '6px 6px 0 0',
                transition: 'all 0.15s ease',
              }}
                onClick={() => { if (!isRenaming) switchTab(tab.id); }}
                onDoubleClick={() => { if (isCreatorMode || !configId) { setRenamingTabId(tab.id); setRenameText(tab.name); } }}
              >
                {isActive && (
                  <span style={{ width: "6px", height: "6px", borderRadius: "50%",
                    backgroundColor: liveDataLoading ? '#818cf8' : liveDataError ? '#ef4444' : '#10b981',
                    display: "inline-block", flexShrink: 0 }} />
                )}
                {isRenaming ? (
                  <input
                    autoFocus
                    value={renameText}
                    onChange={e => setRenameText(e.target.value)}
                    onBlur={() => { if (renameText.trim()) renameTab(tab.id, renameText.trim()); setRenamingTabId(null); }}
                    onKeyDown={e => {
                      if (e.key === 'Enter') { if (renameText.trim()) renameTab(tab.id, renameText.trim()); setRenamingTabId(null); }
                      if (e.key === 'Escape') setRenamingTabId(null);
                    }}
                    onClick={e => e.stopPropagation()}
                    style={{
                      background: 'transparent', border: 'none', borderBottom: `1px solid ${isDarkMode ? '#818cf8' : '#6366f1'}`,
                      color: 'inherit', fontSize: '13px', fontWeight: 600, padding: '0 2px', width: Math.max(60, renameText.length * 8) + 'px',
                      outline: 'none',
                    }}
                  />
                ) : (
                  <span>{tab.name}</span>
                )}
                {isActive && liveRowCount > 0 && !liveDataLoading && (
                  <span style={{ fontSize: '11px', color: isDarkMode ? '#6b7280' : '#9ca3af', marginLeft: '4px' }}>
                    ({liveRowCount.toLocaleString()}{liveDataTruncated ? '!' : ''})
                  </span>
                )}
                {tabs.length > 1 && (isCreatorMode || !configId) && (
                  <button
                    onClick={e => { e.stopPropagation(); removeTab(tab.id); }}
                    style={{
                      background: 'none', border: 'none', color: isDarkMode ? '#6b7280' : '#9ca3af',
                      cursor: 'pointer', fontSize: '14px', lineHeight: 1, padding: '0 2px', marginLeft: '4px',
                      opacity: 0.6, display: 'flex', alignItems: 'center',
                    }}
                    onMouseEnter={e => e.target.style.opacity = 1}
                    onMouseLeave={e => e.target.style.opacity = 0.6}
                  >
                    &times;
                  </button>
                )}
              </div>
            );
          })}
          {/* Add Tab Button — hidden for viewers */}
          {(isCreatorMode || !configId) && <div style={{ position: 'relative' }} data-add-tab>
            <button
              onClick={() => setShowAddTab(!showAddTab)}
              style={{
                background: 'none', border: 'none', color: isDarkMode ? '#6b7280' : '#9ca3af',
                cursor: 'pointer', fontSize: '18px', lineHeight: 1, padding: '6px 12px',
                display: 'flex', alignItems: 'center',
              }}
              title="Add dataset tab"
            >
              +
            </button>
            {showAddTab && (
              <div style={{
                position: 'absolute', top: '100%', left: 0, zIndex: 100,
                backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
                border: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`,
                borderRadius: '8px', padding: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                minWidth: '200px',
              }}>
                <div style={{ fontSize: '12px', fontWeight: 600, marginBottom: '8px', color: isDarkMode ? '#d1d5db' : '#374151' }}>
                  New Tab
                </div>
                <input
                  autoFocus
                  placeholder="Tab name"
                  value={newTabDataset}
                  onChange={e => setNewTabDataset(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && newTabDataset.trim()) {
                      addTab(newTabDataset.trim());
                      setNewTabDataset('');
                      setShowAddTab(false);
                    }
                    if (e.key === 'Escape') { setShowAddTab(false); setNewTabDataset(''); }
                  }}
                  style={{
                    width: '100%', padding: '6px 10px', borderRadius: '6px', fontSize: '13px',
                    border: `1px solid ${isDarkMode ? '#4b5563' : '#d1d5db'}`,
                    backgroundColor: isDarkMode ? '#111827' : '#f9fafb',
                    color: isDarkMode ? '#f3f4f6' : '#111827',
                    outline: 'none', boxSizing: 'border-box',
                  }}
                />
                <div style={{ fontSize: '11px', color: isDarkMode ? '#6b7280' : '#9ca3af', marginTop: '6px' }}>
                  Name your tab, then set dataset in Configure Metrics
                </div>
              </div>
            )}
          </div>}
          {/* Configure Metrics button — right-aligned, hidden for viewers */}
          {(isCreatorMode || !configId) && (
            <button
              onClick={() => {
                setMetricsEditorDraft({ ...(liveMetricConfig || {}), dataset: activeTab?.dataset || '' });
                setMetricsEditorError('');
                setExpandedMetricSlot(null);
                setShowMetricsEditor(true);
              }}
              style={{
                marginLeft: 'auto', padding: "4px 12px", borderRadius: "6px",
                border: `1px solid ${isDarkMode ? 'rgba(16,185,129,0.4)' : 'rgba(16,185,129,0.5)'}`,
                background: "transparent", color: isDarkMode ? '#6ee7b7' : '#065f46',
                cursor: "pointer", fontSize: "11px", fontWeight: 500, whiteSpace: "nowrap",
              }}
            >
              Configure Metrics
            </button>
          )}
          {/* Lock/unlock toggle — creators can lock, viewers can unlock with edit key */}
          {configId && (
            <div style={{ marginLeft: isCreatorMode ? '0' : 'auto', position: 'relative' }}>
              <button
                onClick={() => {
                  if (isCreatorMode) {
                    // Lock: exit creator mode
                    setIsCreatorMode(false);
                    if (creatorTimerRef.current) clearTimeout(creatorTimerRef.current);
                  } else if (getEditSecret(configId)) {
                    // Has secret in localStorage — re-unlock directly
                    setIsCreatorMode(true);
                  } else {
                    // No secret — show prompt
                    setShowUnlockPrompt(!showUnlockPrompt);
                    setUnlockError('');
                    setUnlockSecret('');
                  }
                }}
                title={isCreatorMode ? "Lock editing (auto-locks after 2 min)" : "Unlock editing"}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer', padding: '4px 8px',
                  color: isCreatorMode ? (isDarkMode ? '#6ee7b7' : '#065f46') : (isDarkMode ? '#6b7280' : '#9ca3af'),
                  fontSize: '14px', display: 'flex', alignItems: 'center',
                }}
              >{isCreatorMode ? '\u{1F513}' : '\u{1F512}'}</button>
              {showUnlockPrompt && !isCreatorMode && (
                <div style={{
                  position: 'absolute', top: '100%', right: 0, zIndex: 100,
                  backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
                  border: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`,
                  borderRadius: '8px', padding: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  minWidth: '240px',
                }}>
                  <div style={{ fontSize: '12px', fontWeight: 600, marginBottom: '8px', color: isDarkMode ? '#d1d5db' : '#374151' }}>
                    Enter Edit Key
                  </div>
                  <input
                    autoFocus
                    type="password"
                    placeholder="Paste edit key..."
                    value={unlockSecret}
                    onChange={e => setUnlockSecret(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Escape') setShowUnlockPrompt(false);
                      if (e.key === 'Enter' && unlockSecret.trim()) {
                        updateConfig(configId, unlockSecret.trim(), {})
                          .then(ok => {
                            if (ok) {
                              setEditSecret(configId, unlockSecret.trim());
                              setIsCreatorMode(true);
                              setShowUnlockPrompt(false);
                            } else {
                              setUnlockError('Invalid key');
                            }
                          })
                          .catch(() => setUnlockError('Failed to verify'));
                      }
                    }}
                    style={{
                      width: '100%', padding: '6px 10px', borderRadius: '6px', fontSize: '13px', boxSizing: 'border-box',
                      border: `1px solid ${isDarkMode ? '#4b5563' : '#d1d5db'}`,
                      backgroundColor: isDarkMode ? '#111827' : '#f9fafb',
                      color: isDarkMode ? '#f3f4f6' : '#111827', outline: 'none',
                    }}
                  />
                  {unlockError && <div style={{ fontSize: '11px', color: '#ef4444', marginTop: '4px' }}>{unlockError}</div>}
                  <div style={{ fontSize: '11px', color: isDarkMode ? '#6b7280' : '#9ca3af', marginTop: '6px' }}>
                    Press Enter to unlock editing
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Status Banner */}
      {baseConnection && activeTab && !activeTab.dataset && !liveDataLoading && (
        <div style={{
          display: "flex", alignItems: "center", gap: "8px",
          padding: "8px 16px", backgroundColor: isDarkMode ? "rgba(245, 158, 11, 0.12)" : "rgba(245, 158, 11, 0.1)",
          border: `1px solid ${isDarkMode ? "rgba(245, 158, 11, 0.35)" : "rgba(245, 158, 11, 0.4)"}`,
          borderRadius: "8px", marginBottom: "12px", fontSize: "12px",
          color: isDarkMode ? "#fbbf24" : "#92400e",
        }}>
          <span>No dataset configured. Click <strong>Configure Metrics</strong> to set the table name.</span>
        </div>
      )}
      {configLoading && (
        <div style={{
          display: "flex", alignItems: "center", gap: "8px",
          padding: "8px 16px", backgroundColor: isDarkMode ? "rgba(99, 102, 241, 0.12)" : "rgba(99, 102, 241, 0.1)",
          border: `1px solid ${isDarkMode ? "rgba(99, 102, 241, 0.35)" : "rgba(99, 102, 241, 0.4)"}`,
          borderRadius: "8px", marginBottom: "12px", fontSize: "12px",
          color: isDarkMode ? "#a5b4fc" : "#4338ca",
        }}>
          <div style={{ width: "14px", height: "14px", border: "2px solid currentColor", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
          <span>Loading dashboard configuration...</span>
        </div>
      )}
      {configError && (
        <div style={{
          display: "flex", alignItems: "center", gap: "8px",
          padding: "8px 16px", backgroundColor: isDarkMode ? "rgba(239, 68, 68, 0.12)" : "rgba(239, 68, 68, 0.1)",
          border: `1px solid ${isDarkMode ? "rgba(239, 68, 68, 0.35)" : "rgba(239, 68, 68, 0.4)"}`,
          borderRadius: "8px", marginBottom: "12px", fontSize: "12px",
          color: isDarkMode ? "#fca5a5" : "#dc2626",
        }}>
          <span>{configError}</span>
          <button onClick={() => window.location.reload()} style={{
            marginLeft: "auto", padding: "2px 10px", borderRadius: "4px", fontSize: "11px", cursor: "pointer",
            border: `1px solid ${isDarkMode ? "rgba(239, 68, 68, 0.4)" : "rgba(239, 68, 68, 0.5)"}`,
            background: "transparent", color: "inherit",
          }}>Retry</button>
        </div>
      )}
      {liveDataLoading && (
        <div style={{
          display: "flex", alignItems: "center", gap: "8px",
          padding: "8px 16px", backgroundColor: isDarkMode ? "rgba(99, 102, 241, 0.12)" : "rgba(99, 102, 241, 0.1)",
          border: `1px solid ${isDarkMode ? "rgba(99, 102, 241, 0.35)" : "rgba(99, 102, 241, 0.4)"}`,
          borderRadius: "8px", marginBottom: "12px", fontSize: "12px",
          color: isDarkMode ? "#a5b4fc" : "#4338ca",
        }}>
          <div style={{ width: "14px", height: "14px", border: "2px solid currentColor", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
          <span>Connecting to <strong>{connectionParams?.dataset}</strong>...</span>
        </div>
      )}
      {liveDataError && (
        <div style={{
          display: "flex", alignItems: "center", gap: "8px",
          padding: "8px 16px", backgroundColor: isDarkMode ? "rgba(239, 68, 68, 0.12)" : "rgba(239, 68, 68, 0.1)",
          border: `1px solid ${isDarkMode ? "rgba(239, 68, 68, 0.35)" : "rgba(239, 68, 68, 0.4)"}`,
          borderRadius: "8px", marginBottom: "12px", fontSize: "12px",
          color: isDarkMode ? "#fca5a5" : "#dc2626",
        }}>
          <span>Connection failed: {liveDataError}. Showing demo data instead.</span>
        </div>
      )}
      {liveDataTruncated && !liveDataLoading && (
        <div style={{
          display: "flex", alignItems: "center", gap: "8px",
          padding: "8px 16px", backgroundColor: isDarkMode ? "rgba(245, 158, 11, 0.12)" : "rgba(245, 158, 11, 0.1)",
          border: `1px solid ${isDarkMode ? "rgba(245, 158, 11, 0.35)" : "rgba(245, 158, 11, 0.4)"}`,
          borderRadius: "8px", marginBottom: "12px", fontSize: "12px",
          color: isDarkMode ? "#fbbf24" : "#92400e",
        }}>
          <span>Data truncated — results hit the row limit. Metrics may be incomplete.</span>
        </div>
      )}
      {!isLiveMode && !liveDataLoading && !liveDataError && (
        <div style={{
          display: "flex", alignItems: "center", gap: "8px",
          padding: "8px 16px",
          backgroundColor: isDarkMode ? "rgba(234, 179, 8, 0.12)" : "rgba(234, 179, 8, 0.1)",
          border: `1px solid ${isDarkMode ? "rgba(234, 179, 8, 0.35)" : "rgba(234, 179, 8, 0.4)"}`,
          borderRadius: "8px", marginBottom: "12px", fontSize: "12px",
          color: isDarkMode ? "#fcd34d" : "#92400e",
        }}>
          <span style={{ fontSize: "14px" }}>⚠️</span>
          <span><strong>Demo only:</strong> Viewing synthetic data.</span>
          <button
            onClick={() => setShowConnectModal(true)}
            style={{
              marginLeft: "auto", padding: "4px 12px", borderRadius: "4px", fontSize: "11px", cursor: "pointer",
              border: `1px solid ${isDarkMode ? "rgba(99, 102, 241, 0.5)" : "rgba(99, 102, 241, 0.5)"}`,
              background: isDarkMode ? "rgba(99, 102, 241, 0.2)" : "rgba(99, 102, 241, 0.1)",
              color: isDarkMode ? "#a5b4fc" : "#4338ca", fontWeight: 600, whiteSpace: "nowrap",
            }}
          >Connect to Database</button>
        </div>
      )}

      {/* Top Section: Ask section first, then Statboxes */}
      <div style={styles.topSection}>
        {/* Natural Language Query Interface */}
        <div style={styles.queryContainer} data-guide="quick-query">
          <div style={styles.queryInputGroup}>
            <div style={styles.queryLabelContainer}>
              <label style={styles.queryLabel}>Quick Query</label>
              <div
                style={styles.queryTooltipIcon}
                onMouseEnter={() => setShowQueryTooltip(true)}
                onMouseLeave={() => setShowQueryTooltip(false)}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  style={styles.block}
                >
                  <circle
                    cx="10"
                    cy="10"
                    r="9"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    fill="none"
                  />
                  <path
                    d="M10 6v.01"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M10 9v5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
                {showQueryTooltip && (
                  <div style={styles.queryTooltip}>
                    <div style={styles.queryTooltipArrow}></div>
                    <div style={styles.fontWeight600}>How to Use</div>
                    <div style={styles.textGray}>
                      {isLiveMode && METRIC_LABELS
                        ? `Type a natural language question like "How is ${METRIC_LABELS.metric1 || 'the metric'} trending${DIMENSION_DEFINITIONS.length > 0 ? ` by ${DIMENSION_DEFINITIONS[0].viewName}` : ''}?" or click "Feeling Lucky" for examples.`
                        : 'Type a natural language question like "How is revenue trending in EMEA?" or click "Feeling Lucky" for examples. Press Enter or click "Ask" to query.'}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div style={styles.queryInputWrapper}>
              <input
                type="text"
                value={queryText}
                onChange={(e) => setQueryText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && queryText.trim() && !isLLMLoading) {
                    handleLLMQuery(queryText);
                  }
                }}
                placeholder={isLiveMode && METRIC_LABELS
                  ? `Ask a question... e.g. How is ${METRIC_LABELS.metric1 || 'the metric'} trending${DIMENSION_DEFINITIONS.length > 0 ? ` by ${DIMENSION_DEFINITIONS[0].viewName}` : ''}?`
                  : "Ask a question... e.g. How is revenue trending in EMEA?"}
                disabled={isLLMLoading}
                style={{
                  flex: 1,
                  padding: "10px 14px",
                  fontSize: "14px",
                  fontFamily: "'Inter', 'Segoe UI', sans-serif",
                  border: "2px solid #d1d5db",
                  borderRadius: "8px",
                  backgroundColor: isLLMLoading ? "#f3f4f6" : "#fff",
                  minHeight: "44px",
                  outline: "none",
                  color: "#374151",
                }}
                onFocus={(e) => { e.target.style.borderColor = "#6366f1"; }}
                onBlur={(e) => { e.target.style.borderColor = "#d1d5db"; }}
              />
              <button
                style={{
                  ...styles.luckyButton,
                  fontSize: "14px",
                  fontWeight: "600",
                  padding: "10px 18px",
                  minWidth: "160px",
                  opacity: isLLMLoading ? 0.6 : 1,
                }}
                onClick={() => {
                  const example = LLM_EXAMPLE_QUESTIONS[Math.floor(Math.random() * LLM_EXAMPLE_QUESTIONS.length)];
                  setQueryText(example);
                  setLlmError("");
                  setLlmExplanation("");
                }}
                disabled={isLLMLoading}
                title="Generate a random example question"
              >
                Feeling Lucky
              </button>
              <button
                style={{
                  ...styles.queryButton,
                  ...(!queryText.trim() || isLLMLoading
                    ? styles.queryButtonDisabled
                    : {}),
                }}
                onClick={() => {
                  if (queryText.trim() && !isLLMLoading) {
                    handleLLMQuery(queryText);
                  }
                }}
                disabled={!queryText.trim() || isLLMLoading}
              >
                {isLLMLoading ? "Thinking..." : "Ask"}
              </button>
            </div>
            {/* LLM feedback: loading, error, explanation */}
            {(isLLMLoading || llmError || llmExplanation) && (
              <div style={{ marginTop: "8px", fontSize: "13px", fontFamily: "'Inter', 'Segoe UI', sans-serif" }}>
                {isLLMLoading && (
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#6366f1" }}>
                    <div style={{
                      width: "14px", height: "14px", border: "2px solid #6366f1",
                      borderTopColor: "transparent", borderRadius: "50%",
                      animation: "spin 0.8s linear infinite",
                    }} />
                    Interpreting your question...
                  </div>
                )}
                {llmError && (
                  <div style={{ color: "#dc2626", padding: "4px 0" }}>
                    {llmError}
                  </div>
                )}
                {llmExplanation && !isLLMLoading && !llmError && (
                  <div style={{ color: "#6b7280", fontStyle: "italic", padding: "4px 0" }}>
                    {llmExplanation}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Theme Toggle Button */}
          <button
            style={{
              ...styles.helpButton,
              right: showGuideButton ? "100px" : "12px",
              backgroundColor: isDarkMode ? "#4b5563" : theme.accentPrimary,
            }}
            onClick={() => setIsDarkMode(!isDarkMode)}
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDarkMode ? "☀️" : "🌙"}
          </button>

          {/* Guide Me Button */}
          {showGuideButton && (
            <button
              style={{
                ...styles.helpButton,
                backgroundColor: showGuide ? "#ef4444" : "#f77f00",
              }}
              onClick={() => {
                if (showGuide) {
                  skipGuide();
                } else {
                  startGuide();
                }
              }}
              title={
                showGuide ? "Stop Guide" : "Guide Me - Click to start tour"
              }
            >
              {showGuide ? "✕" : "Guide Me"}
            </button>
          )}
        </div>

        <div style={styles.statBoxContainer} data-guide="metric-statboxes">
          {(isLiveMode && liveMetricConfig && !liveMetricConfig.derivedAggType && liveMetricConfig.derivedMode !== 'formula'
            ? ["metric1", "metric2"]
            : ["metric1", "metric2", "metric3"]
          ).map((metricName) => {
            const metricStatData = allMetricsStatData[metricName];
            if (!metricStatData) return null;
            const displayLabel = METRIC_LABELS[metricName] || metricName;
            return (
              <StatBox
                key={metricName}
                metricName={metricName}
                metricStatData={metricStatData}
                isActive={metric === metricName}
                accentColor="#6366f1"
                dataFrequency={dataFrequency}
                periodChangeLabel={periodChangeLabel}
                displayLabel={displayLabel}
                activePeriodComparison={activePeriodComparison}
                setActivePeriodComparison={setActivePeriodComparison}
                setMetric={setMetric}
                setInsightContext={setInsightContext}
                formatMetricValue={formatMetricValue}
                styles={styles}
                theme={theme}
                isDarkMode={isDarkMode}
              />
            );
          })}
        </div>

        {/* Controls - 3 Column, 2 Row Grid Layout */}
        <div style={styles.controlsContainer}>
          <div style={styles.controlsHeader}>
            {/* Grid Layout: 3 columns, 2 rows */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: "20px",
                width: "100%",
              }}
            >
              {/* Column 1 - Row 1: Load Saved View */}
              <div style={styles.controlGroup} data-guide="saved-views">
                <label style={styles.label}>Load Saved View</label>
                {savedViews.length > 0 ? (
                  <select
                    style={styles.select}
                    value={selectedSavedView}
                    onChange={(e) => handleLoadSavedView(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <option value="">-- Select a saved view --</option>
                    {savedViews.map((savedView) => (
                      <option key={savedView.name} value={savedView.name}>
                        {savedView.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  <select style={styles.select} disabled>
                    <option>No saved views</option>
                  </select>
                )}
              </div>

              {/* Column 2 - Row 1: Split By Dimension */}
              <div style={styles.controlGroup} data-guide="view-selector">
                <label style={styles.label}>Split By Dimension</label>
                <select
                  style={styles.select}
                  value={view}
                  onChange={(e) => setView(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                >
                  <option value="Overall">Overall</option>
                  {Object.keys(VIEW_CONFIG).map((viewName) => (
                    <option key={viewName} value={viewName}>
                      {VIEW_LABEL_OVERRIDES[viewName] || viewName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Column 3 - Row 1: Date Range */}
              <div
                style={{ ...styles.controlGroup, marginTop: "24px" }}
                data-guide="date-range"
              >
                {renderButtonGroup(
                  DATE_RANGES,
                  dateRange,
                  setDateRange,
                  styles.dateRangeGroup,
                  styles.dateRangeButton,
                  styles.dateRangeButtonActive
                )}
              </div>

              {/* Column 1 - Row 2: Actions */}
              <div style={styles.controlGroup}>
                <div style={styles.buttonGroup}>
                  <button
                    style={{
                      ...styles.buttonGroupBtn,
                      ...(false ? styles.buttonGroupBtnActive : {}),
                    }}
                    onClick={() => setShowSaveViewModal(true)}
                    title="Save View to Google Sheets"
                    data-guide="save-view"
                  >
                    💾 Save View
                  </button>
                  <button
                    style={{
                      ...styles.buttonGroupBtn,
                      ...(showScenarioPanel ? styles.buttonGroupBtnActive : {}),
                    }}
                    onClick={() => setShowScenarioPanel(!showScenarioPanel)}
                    title="Scenario Comparison"
                    data-guide="comparison"
                  >
                    📊 Compare
                  </button>
                  <button
                    style={{
                      ...styles.buttonGroupBtn,
                      ...(false ? styles.buttonGroupBtnActive : {}),
                    }}
                    onClick={handleShareClick}
                    title="Share Chart Configuration"
                    data-guide="share-link"
                  >
                    🔗 Share
                  </button>
                  <button
                    style={{
                      ...styles.buttonGroupBtn,
                      backgroundColor: theme.danger,
                      color: "white",
                      border: "none",
                      marginLeft: "4px",
                    }}
                    onClick={resetAllFilters}
                    title="Reset All Filters"
                    data-guide="reset-button"
                  >
                    ↺ Reset
                  </button>
                </div>
              </div>

              {/* Column 2 - Row 2: Filter Search with Show All button */}
              <div style={styles.controlGroup} data-guide="filter-search">
                <div
                  style={{ display: "flex", gap: "8px", alignItems: "center" }}
                >
                  <div style={{ ...styles.filterSearchContainer, flex: 1 }}>
                    <input
                      ref={filterSearchInputRef}
                      style={{
                        ...styles.filterSearchInput,
                        borderColor: showFilterSuggestions
                          ? "#6366f1"
                          : "#d1d5db",
                        width: "100%",
                        boxShadow: showFilterSuggestions
                          ? "0 0 0 3px rgba(99, 102, 241, 0.1)"
                          : "none",
                      }}
                      type="text"
                      placeholder="Search filters..."
                      value={filterSearchText}
                      onChange={(e) => {
                        const newValue = e.target.value;
                        setFilterSearchText(newValue);
                        requestAnimationFrame(() => {
                          if (!showFilterSuggestions && newValue.length > 0) {
                            setShowFilterSuggestions(true);
                          }
                        });
                      }}
                      onFocus={() => {
                        requestAnimationFrame(() => {
                          if (filterSearchInputRef.current) {
                            if (!filterDropdownPositionRef.current) {
                              const rect =
                                filterSearchInputRef.current.getBoundingClientRect();
                              filterDropdownPositionRef.current = {
                                top: `${rect.bottom}px`,
                                left: `${rect.left}px`,
                                width: `${rect.width}px`,
                              };
                            }
                            setDropdownStyle(filterDropdownPositionRef.current);
                          }
                        });
                        setShowFilterSuggestions(true);
                      }}
                      onBlur={(e) => {
                        setTimeout(() => {
                          const activeElement = document.activeElement;
                          if (
                            !filterSuggestionsDropdownRef.current ||
                            !filterSuggestionsDropdownRef.current.contains(
                              activeElement
                            )
                          ) {
                            setShowFilterSuggestions(false);
                            filterDropdownPositionRef.current = null;
                          }
                        }, 50);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Escape") {
                          setShowFilterSuggestions(false);
                          if (filterSearchInputRef.current) {
                            filterSearchInputRef.current.blur();
                          }
                        }
                      }}
                      onClick={(e) => e.stopPropagation()}
                    />

                    {/* Filter Suggestions Dropdown */}
                    {showFilterSuggestions &&
                      Object.keys(currentFilterSuggestions).length > 0 && (
                        <div
                          ref={filterSuggestionsDropdownRef}
                          style={{
                            ...styles.filterSuggestionsDropdown,
                            ...dropdownStyle,
                          }}
                        >
                          {Object.entries(currentFilterSuggestions).map(
                            ([groupType, suggestions]) => (
                              <div key={groupType}>
                                <div style={styles.filterGroupHeader}>
                                  {groupType}
                                </div>
                                {suggestions.map((suggestion, index) => {
                                  // Look up isSelected state dynamically for better performance
                                  const isSelected = getFilterState(
                                    suggestion.filterKey
                                  ).includes(suggestion.value);
                                  return (
                                    <div
                                      key={`${suggestion.type}-${suggestion.value}`}
                                      style={
                                        isSelected
                                          ? styles.filterSuggestionItemSelected
                                          : styles.filterSuggestionItemUnselected
                                      }
                                      onMouseDown={(e) => {
                                        e.preventDefault(); // Prevent input blur
                                        handleFilterSuggestionSelect(
                                          suggestion
                                        );
                                      }}
                                    >
                                      <input
                                        type="checkbox"
                                        style={styles.checkboxInput}
                                        checked={isSelected}
                                        onChange={() =>
                                          handleFilterSuggestionSelect(
                                            suggestion
                                          )
                                        }
                                        onClick={(e) => e.stopPropagation()}
                                        onMouseDown={(e) => e.stopPropagation()}
                                      />
                                      <div style={styles.filterSuggestionName}>
                                        {suggestion.displayName}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            )
                          )}
                        </div>
                      )}

                    {/* No results message */}
                    {showFilterSuggestions &&
                      filterSearchText.length > 0 &&
                      Object.keys(currentFilterSuggestions).length === 0 && (
                        <div
                          style={{
                            ...styles.filterSuggestionsDropdown,
                            ...dropdownStyle,
                          }}
                        >
                          <div
                            style={{
                              ...styles.filterSuggestionItem,
                              cursor: "default",
                            }}
                          >
                            <div style={styles.filterSuggestionName}>
                              No matching filters found for "{filterSearchText}"
                            </div>
                          </div>
                        </div>
                      )}
                  </div>
                  <button
                    style={{
                      ...styles.resetButton,
                      backgroundColor: "transparent",
                      border: `1px solid ${theme.borderSecondary}`,
                      color: theme.textSecondary,
                      fontSize: "12px",
                      padding: "6px 12px",
                      whiteSpace: "nowrap",
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowAdvancedFilters(!showAdvancedFilters);
                    }}
                    title="Show all available filters"
                    data-guide="advanced-filters"
                  >
                    Show All
                  </button>
                </div>
              </div>

              {/* Column 3 - Row 2: Date Aggregation */}
              <div style={styles.controlGroup}>
                {renderButtonGroup(
                  isLiveMode ? ["Daily", "Weekly", "Monthly", "Quarterly", "Yearly"] : ["Weekly", "Monthly", "Quarterly", "Yearly"],
                  dataFrequency,
                  handleDataFrequencyChange,
                  styles.dataFrequencyGroup,
                  styles.dataFrequencyButton,
                  styles.dataFrequencyButtonActive
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Filters Sliding Panel */}
      <div style={styles.advancedFiltersPanel}>
        <div style={styles.advancedFiltersHeader}>
          <h3 style={styles.advancedFiltersTitle}>
            Advanced Filters
            <button
              style={styles.closeButton}
              onClick={() => setShowAdvancedFilters(false)}
            >
              ×
            </button>
          </h3>
        </div>

        <div style={styles.advancedFiltersContent}>
          {/* Reset Button at Top */}
          <div style={styles.filterSection}>
            <button style={styles.modernResetButton} onClick={resetAllFilters}>
              Reset All Filters
            </button>
          </div>

          {/* Filter Settings Section */}
          <div style={styles.filterSection}>
            <h4 style={styles.sectionTitle}>Data Filters</h4>

            {/* DRY: Render all filters using FILTER_CONFIG */}
            {FILTER_CONFIG.map(
              ({ key, label, state, setState, formatValue }) => {
                // OPTIMIZATION: Use pre-sliced options to avoid array creation on every render
                const options = filterOptionsWithoutAll[key] || [];
                return renderDropdownFilter(
                  key,
                  label,
                  options,
                  state,
                  setState,
                  formatValue || formatFilterName
                );
              }
            )}
          </div>
        </div>
      </div>

      {/* Pro Tip Banner */}
      <div style={styles.proTipBanner}>
        <span style={styles.proTipLabel}>ProTip</span>
        <span style={styles.proTipIcon}>{PRO_TIPS[currentTipIndex].icon}</span>
        <div style={styles.proTipContent}>
          <span style={styles.proTipTitle}>
            {PRO_TIPS[currentTipIndex].title}:
          </span>
          <span style={styles.proTipText}>
            {PRO_TIPS[currentTipIndex].text}
          </span>
        </div>
        <div style={styles.proTipNavigation}>
          <button
            style={styles.proTipNavButton}
            onClick={() =>
              setCurrentTipIndex((prev) =>
                prev === 0 ? PRO_TIPS.length - 1 : prev - 1
              )
            }
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor =
                "rgba(255, 255, 255, 0.9)";
              e.currentTarget.style.transform = "scale(1.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor =
                "rgba(255, 255, 255, 0.6)";
              e.currentTarget.style.transform = "scale(1)";
            }}
            title="Previous tip"
          >
            ‹
          </button>
          <span style={styles.proTipCounter}>
            {currentTipIndex + 1}/{PRO_TIPS.length}
          </span>
          <button
            style={styles.proTipNavButton}
            onClick={() =>
              setCurrentTipIndex((prev) => (prev + 1) % PRO_TIPS.length)
            }
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor =
                "rgba(255, 255, 255, 0.9)";
              e.currentTarget.style.transform = "scale(1.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor =
                "rgba(255, 255, 255, 0.6)";
              e.currentTarget.style.transform = "scale(1)";
            }}
            title="Next tip"
          >
            ›
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={styles.mainContent}>
        {/* Left Panel: Insights */}
        <div style={styles.leftPanel} data-guide="insights-panel">
          {/* Tab-Style Insights */}
          {activeInsightsTab === null ? (
            <div style={styles.insightsTabsContainer}>
              <button
                style={styles.clickForInsightsButton}
                onClick={() => setActiveInsightsTab("basic")}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = "0.9";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = "";
                }}
              >
                <span style={{ fontSize: "16px" }}>✨</span>
                Click for Insights
                <span style={{ fontSize: "16px" }}>✨</span>
              </button>
            </div>
          ) : (
            <div style={styles.insightsTabsContainer}>
              <button
                style={{
                  ...styles.insightsTab,
                  ...(activeInsightsTab === "basic"
                    ? styles.insightsTabActive
                    : {}),
                }}
                onClick={() =>
                  setActiveInsightsTab(
                    activeInsightsTab === "basic" ? null : "basic"
                  )
                }
              >
                Solo Insights
                <span style={styles.tabCount}>
                  {Object.values(displayedInsights.basicInsights).flat().length}
                </span>
              </button>

              <button
                style={{
                  ...styles.insightsTab,
                  ...(activeInsightsTab === "advanced"
                    ? styles.insightsTabActive
                    : {}),
                }}
                onClick={() =>
                  setActiveInsightsTab(
                    activeInsightsTab === "advanced" ? null : "advanced"
                  )
                }
              >
                Cross Insights
                {(activeInsightsTab === "advanced" ||
                  Object.values(displayedInsights.advancedInsights).flat()
                    .length > 0) && (
                  <span style={styles.tabCount}>
                    {
                      Object.values(displayedInsights.advancedInsights).flat()
                        .length
                    }
                  </span>
                )}
              </button>
            </div>
          )}

          {/* DRY: Insights sections with configuration */}
          {activeInsightsTab &&
            (() => {
              const insightsConfig = {
                basic: {
                  title: "Single-dimension analysis of trends and patterns",
                  emptyMessage:
                    "No significant patterns detected with current filters and data range. Try adjusting your date range or filters to see more insights.",
                  categories: [
                    {
                      key: "decomposition",
                      title: "Investigation Decomposition",
                      tooltipText:
                        "Breaks down the investigation to show which sub-segments are driving the observed performance. Explains what's behind the trend or anomaly you're investigating.",
                      colors: {
                        borderColor: "#10b981",
                        backgroundColor: isDarkMode
                          ? "rgba(16, 185, 129, 0.1)"
                          : "rgba(16, 185, 129, 0.08)",
                        hoverBackgroundColor: isDarkMode
                          ? "rgba(16, 185, 129, 0.15)"
                          : "#d1fae5",
                        hoverBorderColor: "#10b981",
                      },
                    },
                    {
                      key: "performanceAlerts",
                      title: "Performance Alerts",
                      tooltipText: null,
                      colors: {
                        borderColor: theme.danger,
                        backgroundColor: theme.dangerBg,
                        hoverBackgroundColor: isDarkMode
                          ? "rgba(239, 68, 68, 0.2)"
                          : "#fee2e2",
                        hoverBorderColor: theme.danger,
                      },
                    },
                    {
                      key: "overallTrends",
                      title: "Overall Trends",
                      tooltipText: null,
                    },
                    {
                      key: "categoryTrends",
                      title: "Category Trends",
                      tooltipText:
                        "Above/below avg. compares category growth rate to overall market growth rate. For example, if market grew 20% and category grew 30%, it's 10 percentage points above avg.",
                      colors: {
                        borderColor: theme.accentPrimary,
                        backgroundColor: theme.statBoxActiveBg,
                        hoverBackgroundColor: isDarkMode
                          ? "rgba(129, 140, 248, 0.15)"
                          : "#dbeafe",
                        hoverBorderColor: theme.accentPrimary,
                      },
                    },
                    {
                      key: "shareShifts",
                      title: "Market Share Shifts",
                      tooltipText:
                        "Above/below avg. compares category growth rate to overall market growth rate. For example, if market grew 20% and category grew 30%, it's 10 percentage points above avg.",
                      colors: {
                        borderColor: isDarkMode ? "#a78bfa" : "#8b5cf6",
                        backgroundColor: isDarkMode
                          ? "rgba(139, 92, 246, 0.1)"
                          : "rgba(139, 92, 246, 0.08)",
                        hoverBackgroundColor: isDarkMode
                          ? "rgba(139, 92, 246, 0.15)"
                          : "#f3e8ff",
                        hoverBorderColor: isDarkMode ? "#a78bfa" : "#8b5cf6",
                      },
                    },
                    {
                      key: "marketLeaders",
                      title: "Market Leaders",
                      tooltipText: null,
                    },
                  ],
                  insights: displayedInsights.basicInsights,
                },
                advanced: {
                  title: "Multi-attribute analysis across dimensions",
                  emptyMessage:
                    "Advanced cross-dimensional insights will be displayed here when sufficient data patterns are detected across multiple attributes. Try using fewer filters to see cross-dimensional patterns.",
                  categories: [
                    {
                      key: "allTimeGrowth",
                      title: "Cross Insights Growth",
                      tooltipText:
                        "Above/below avg. compares segment growth rate to overall market growth rate. For example, if market grew 20% and segment grew 30%, it's 10 percentage points above avg.",
                    },
                  ],
                  insights: displayedInsights.advancedInsights,
                },
              };

              const config = insightsConfig[activeInsightsTab];
              if (!config) return null;

              // Show loading indicator while insights are being generated
              if (loadingInsights) {
                return (
                  <div style={styles.structuredInsightsContainer}>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "40px",
                        color: "#6b7280",
                      }}
                    >
                      <div
                        style={{
                          width: "40px",
                          height: "40px",
                          border: "4px solid #f3f4f6",
                          borderTop: "4px solid #3b82f6",
                          borderRadius: "50%",
                          animation: "spin 1s linear infinite",
                          marginBottom: "16px",
                        }}
                      ></div>
                      <div style={{ fontSize: "14px", fontWeight: "500" }}>
                        Loading Insights...
                      </div>
                      <div style={{ fontSize: "12px", marginTop: "8px" }}>
                        Analyzing patterns in your data
                      </div>
                    </div>
                  </div>
                );
              }

              // Use insights directly (limiting now happens at generation time)
              const processedInsights = config.insights;

              const totalInsights =
                Object.values(processedInsights).flat().length;

              return (
                <div style={styles.structuredInsightsContainer}>
                  <div style={styles.insightsContext}>
                    {getShortFilterContext()}
                  </div>
                  <div style={styles.insightsSubtitle}>{config.title}</div>
                  {config.categories.map(
                    ({ key, title, tooltipText, colors }) =>
                      renderInsightCategory(
                        processedInsights[key],
                        title,
                        key,
                        tooltipText,
                        colors
                      )
                  )}
                  {totalInsights === 0 && (
                    <div style={styles.categorySection}>
                      <div style={styles.insightText}>
                        {config.emptyMessage}
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}
        </div>

        {/* Chart */}
        <div style={styles.chartContainer}>
          {/* Undo Button */}
          <button
            style={{
              ...styles.undoButton,
              ...(history.length === 0 ? styles.undoButtonDisabled : {}),
            }}
            onClick={handleUndo}
            disabled={history.length === 0}
            title="Undo (Go back to previous filters and selections)"
            data-guide="undo-button"
          >
            ⏪
          </button>

          {/* Scenario Comparison Control Panel */}
          {showScenarioPanel &&
            (() => {
              const nextScenario = getNextEmptyScenario();
              const savedScenarios = getSavedScenarios();

              return (
                <div
                  style={{
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
                    maxWidth: "320px",
                  }}
                >
                  {/* Header */}
                  <div
                    style={{
                      fontSize: "13px",
                      fontWeight: "600",
                      color: "#374151",
                      marginBottom: "12px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <span>Compare Views</span>
                    <button
                      onClick={() => setShowScenarioPanel(false)}
                      style={{
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
                        borderRadius: "4px",
                      }}
                      title="Close Scenario Panel"
                    >
                      ×
                    </button>
                  </div>

                  {/* Add New Scenario Section - Only show if slots available */}
                  {nextScenario && (
                    <div
                      style={{
                        marginBottom: savedScenarios.length > 0 ? "16px" : "0",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "11px",
                          fontWeight: "600",
                          color: "#6b7280",
                          marginBottom: "8px",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                        }}
                      >
                        Capture View
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          marginBottom: "8px",
                        }}
                      >
                        <div
                          style={{
                            width: "16px",
                            height: "16px",
                            backgroundColor: nextScenario.color,
                            borderRadius: "4px",
                            border: "1px solid #9ca3af",
                          }}
                        ></div>
                        <input
                          type="text"
                          value={nextScenario.label}
                          onChange={(e) =>
                            updateScenarioLabel(
                              nextScenario.index,
                              e.target.value
                            )
                          }
                          placeholder={`Scenario ${nextScenario.index}`}
                          style={{
                            flex: 1,
                            padding: "6px 8px",
                            border: "1px solid #d1d5db",
                            borderRadius: "4px",
                            fontSize: "12px",
                          }}
                        />
                      </div>
                      <button
                        onClick={() => setScenario(nextScenario.index)}
                        style={{
                          width: "100%",
                          padding: "8px 12px",
                          backgroundColor: nextScenario.color,
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                          fontSize: "12px",
                          fontWeight: "500",
                          cursor: "pointer",
                        }}
                      >
                        ➕ Add to Compare
                      </button>
                    </div>
                  )}

                  {/* Saved Scenarios Section */}
                  {savedScenarios.length > 0 && (
                    <div
                      style={{
                        paddingTop:
                          savedScenarios.length > 0 && nextScenario
                            ? "16px"
                            : "0",
                        borderTop:
                          savedScenarios.length > 0 && nextScenario
                            ? "1px solid #e5e7eb"
                            : "none",
                      }}
                    >
                      <div style={styles.savedViewsHeader}>
                        Saved Views ({savedScenarios.length})
                      </div>
                      {savedScenarios.map((saved, idx) => (
                        <div
                          key={saved.index}
                          style={{
                            ...styles.savedScenarioCard,
                            marginBottom:
                              idx === savedScenarios.length - 1 ? "0" : "10px",
                          }}
                        >
                          <div style={styles.savedScenarioRow}>
                            <input
                              type="checkbox"
                              checked={saved.isActive}
                              onChange={() => toggleScenario(saved.index)}
                              style={{
                                cursor: "pointer",
                                accentColor: saved.color,
                              }}
                            />
                            <span style={styles.savedScenarioLabel}>
                              {saved.label}
                            </span>
                            <button
                              onClick={() => clearScenario(saved.index)}
                              style={styles.savedScenarioDeleteBtn}
                              title="Remove this scenario"
                            >
                              Clear
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* All slots filled message */}
                  {!nextScenario && savedScenarios.length === 3 && (
                    <div style={styles.allSlotsFilled}>
                      Maximum 3 scenarios reached. Clear one to add more.
                    </div>
                  )}
                </div>
              );
            })()}

          {/* Top X Control - Only show when not empty view */}
          {view !== "Overall" && (
            <div style={{ position: "relative" }} data-topx-control>
              <button
                style={styles.topXControl}
                onClick={() => setShowTopXControl(!showTopXControl)}
                title="Configure category selection"
                data-guide="top-x-control"
              >
                Top {topX}
                {selectedCategories.length > 0 &&
                  ` + ${selectedCategories.length}`}
                {" ▼"}
              </button>

              {showTopXControl && (
                <div style={styles.topXControlDropdown}>
                  <div style={styles.topXControlHeader}>
                    <div style={styles.topXControlTitle}>
                      Category Selection
                    </div>
                    <button
                      onClick={() => setShowTopXControl(false)}
                      style={{
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
                        justifyContent: "center",
                      }}
                    >
                      ×
                    </button>
                  </div>

                  {/* Top X Input - Always visible */}
                  <div>
                    <label
                      style={{
                        fontSize: "12px",
                        fontWeight: "500",
                        color: "#6b7280",
                        marginBottom: "4px",
                        display: "block",
                      }}
                    >
                      Top X Categories
                    </label>
                    <input
                      style={styles.topXInput}
                      type="number"
                      value={topX}
                      onChange={(e) =>
                        setTopX(
                          Math.max(
                            0,
                            Math.min(20, parseInt(e.target.value) || 0)
                          )
                        )
                      }
                      min="0"
                      max="20"
                    />
                  </div>

                  {/* Manual Category Selection - Always available, in addition to Top X */}
                  <div style={{ marginTop: "16px" }}>
                    <div>
                      <label
                        style={{
                          fontSize: "12px",
                          fontWeight: "500",
                          color: "#6b7280",
                          marginBottom: "8px",
                          display: "block",
                        }}
                      >
                        Additional Categories ({selectedCategories.length}{" "}
                        selected)
                        <span
                          style={{
                            fontSize: "11px",
                            color: "#9ca3af",
                            fontWeight: "400",
                            marginLeft: "4px",
                          }}
                        >
                          (in addition to Top {topX})
                        </span>
                      </label>
                      {/* Search Input */}
                      <input
                        style={{
                          ...styles.topXInput,
                          marginBottom: "8px",
                        }}
                        type="text"
                        placeholder="Search categories..."
                        value={categorySearchText}
                        onChange={(e) => setCategorySearchText(e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                      />
                      <div style={styles.categorySelectionList}>
                        {filteredCategories.length > 0 ? (
                          filteredCategories.map((category) => {
                            const isSelected =
                              selectedCategories.includes(category);
                            return (
                              <div
                                key={category}
                                style={
                                  isSelected
                                    ? styles.categorySelectionItemSelected
                                    : styles.categorySelectionItemUnselected
                                }
                                onClick={() => {
                                  if (isSelected) {
                                    setSelectedCategories((prev) =>
                                      prev.filter((c) => c !== category)
                                    );
                                  } else {
                                    setSelectedCategories((prev) => [
                                      ...prev,
                                      category,
                                    ]);
                                  }
                                }}
                              >
                                <input
                                  type="checkbox"
                                  style={styles.categoryCheckbox}
                                  checked={isSelected}
                                  onChange={() => {}}
                                />
                                <span style={styles.categoryLabelText}>
                                  {formatFilterName(category)}
                                </span>
                              </div>
                            );
                          })
                        ) : (
                          <div style={styles.noCategoriesFound}>
                            No categories found matching "{categorySearchText}"
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Toggle buttons for $ Share, %Share and %Share Growth traces (only for Volume and Revenue) */}
          {view !== "Overall" && metric !== "metric3" && (
            <div
              style={{
                display: "flex",
                gap: "8px",
                marginBottom: "12px",
                alignItems: "center",
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <button
                onClick={() => setShowAllDollarTraces(!showAllDollarTraces)}
                style={{
                  padding: "6px 12px",
                  backgroundColor: showAllDollarTraces ? "#8b5cf6" : "white",
                  color: showAllDollarTraces ? "white" : "#8b5cf6",
                  border: "1px solid #8b5cf6",
                  borderRadius: "6px",
                  fontSize: "12px",
                  fontWeight: "500",
                  cursor: "pointer",
                }}
              >
                {showAllDollarTraces ? "✓" : ""} $ Share
              </button>
              <button
                onClick={() => setShowAllShareTraces(!showAllShareTraces)}
                style={{
                  padding: "6px 12px",
                  backgroundColor: showAllShareTraces ? "#6366f1" : "white",
                  color: showAllShareTraces ? "white" : "#6366f1",
                  border: "1px solid #6366f1",
                  borderRadius: "6px",
                  fontSize: "12px",
                  fontWeight: "500",
                  cursor: "pointer",
                }}
              >
                {showAllShareTraces ? "✓" : ""} %Share
              </button>
              <button
                onClick={() => setShowAllGrowthTraces(!showAllGrowthTraces)}
                style={{
                  padding: "6px 12px",
                  backgroundColor: showAllGrowthTraces ? "#10b981" : "white",
                  color: showAllGrowthTraces ? "white" : "#10b981",
                  border: "1px solid #10b981",
                  borderRadius: "6px",
                  fontSize: "12px",
                  fontWeight: "500",
                  cursor: "pointer",
                }}
              >
                {showAllGrowthTraces ? "✓" : ""} %Growth YoY
              </button>
              <div
                style={{
                  width: "100%",
                  textAlign: "center",
                  fontSize: "11px",
                  color: "#6b7280",
                  marginTop: "4px",
                }}
              >
                Click buttons to toggle traces
                <br />
                Legend appears when active
              </div>
            </div>
          )}

          {/* 🆕 Insight Context Banner - Shows drill-down context with excess growth */}
          {insightContext && (
            <InsightContextBanner
              insightContext={insightContext}
              formatMetric={formatMetric}
              formatPeriodDate={formatPeriodDate}
              onClear={() => {
                setInsightContext(null);
              }}
              theme={theme}
              isDarkMode={isDarkMode}
            />
          )}

          {view === "Overall" && (
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '4px', position: 'relative' }}>
              <button
                onClick={() => setShowOverlayMenu(prev => !prev)}
                style={{
                  padding: '4px 10px',
                  fontSize: '11px',
                  fontWeight: 600,
                  borderRadius: '6px',
                  border: `1px solid ${isDarkMode ? '#4b5563' : '#d1d5db'}`,
                  backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
                  color: isDarkMode ? '#d1d5db' : '#374151',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                Overlays
                {(() => { const count = OVERLAY_CONFIG.filter(o => activeOverlays[o.id]).length; return count > 0 ? ` (${count})` : ''; })()}
                <span style={{ fontSize: '8px', marginLeft: '2px' }}>{showOverlayMenu ? '▲' : '▼'}</span>
              </button>
              {showOverlayMenu && (
                <>
                  <div style={{ position: 'fixed', inset: 0, zIndex: 999 }} onClick={() => setShowOverlayMenu(false)} />
                  <div style={{
                    position: 'absolute', top: '100%', right: 0, zIndex: 1000, marginTop: '4px',
                    backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
                    border: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`,
                    borderRadius: '8px', padding: '4px 0', minWidth: '160px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  }}>
                    {OVERLAY_CONFIG.map(overlay => {
                      const isActive = !!activeOverlays[overlay.id];
                      return (
                        <div key={overlay.id} style={{ padding: '0 4px' }}>
                          <label
                            style={{
                              display: 'flex', alignItems: 'center', gap: '8px',
                              padding: '6px 8px', cursor: 'pointer', borderRadius: '4px',
                              fontSize: '12px', fontWeight: 500,
                              color: isDarkMode ? '#e5e7eb' : '#374151',
                              backgroundColor: 'transparent',
                              transition: 'background-color 0.1s',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.backgroundColor = isDarkMode ? '#374151' : '#f3f4f6'; }}
                            onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                          >
                            <input
                              type="checkbox" checked={isActive}
                              onChange={() => setActiveOverlays(prev => ({ ...prev, [overlay.id]: !prev[overlay.id] }))}
                              style={{ accentColor: overlay.color, cursor: 'pointer' }}
                            />
                            <span style={{
                              width: '10px', height: '10px', borderRadius: '50%',
                              backgroundColor: overlay.color, flexShrink: 0,
                            }} />
                            <span>{overlay.label}</span>
                            {overlay.isSMA && isActive && (
                              <input
                                type="number" min={2} max={52} value={smaWindow}
                                onClick={e => e.stopPropagation()}
                                onChange={e => setSmaWindow(Math.max(2, Math.min(52, parseInt(e.target.value) || 3)))}
                                style={{
                                  width: '36px', padding: '1px 3px', fontSize: '11px', borderRadius: '4px',
                                  border: `1px solid ${isDarkMode ? '#4b5563' : '#d1d5db'}`, textAlign: 'center',
                                  backgroundColor: isDarkMode ? '#111827' : '#f9fafb',
                                  color: isDarkMode ? '#f3f4f6' : '#111827',
                                  outline: 'none', marginLeft: 'auto',
                                }}
                              />
                            )}
                            {overlay.isForecast && isActive && (
                              <input
                                type="number" min={1} max={12} value={forecastHorizon}
                                onClick={e => e.stopPropagation()}
                                onChange={e => setForecastHorizon(Math.max(1, Math.min(12, parseInt(e.target.value) || 3)))}
                                style={{
                                  width: '36px', padding: '1px 3px', fontSize: '11px', borderRadius: '4px',
                                  border: `1px solid ${isDarkMode ? '#4b5563' : '#d1d5db'}`, textAlign: 'center',
                                  backgroundColor: isDarkMode ? '#111827' : '#f9fafb',
                                  color: isDarkMode ? '#f3f4f6' : '#111827',
                                  outline: 'none', marginLeft: 'auto',
                                }}
                              />
                            )}
                          </label>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          )}

          <PlotlyChart
            key={`${view}-${metric}-${dataFrequency}-${dateRange}`}
            data={finalChartData}
            layout={chartLayout}
            ref={chartRef}
            onLegendClick={handleLegendClick}
          />
        </div>
      </div>

      {/* Summary Stats */}
      <div style={styles.summaryContainer}>
        <h4
          style={styles.summaryTitle}
          onClick={() => setShowDataSummary(!showDataSummary)}
        >
          <span style={{ fontSize: "12px" }}>
            {showDataSummary ? "▼" : "▶"}
          </span>
          Data Summary
        </h4>
        {showDataSummary && (
          <div style={styles.summaryGrid}>
            <div style={styles.summaryItem}>
              <strong>Date Aggregation:</strong> {dataFrequency}
            </div>
            <div style={styles.summaryItem}>
              <strong>Metric:</strong> {metric}
            </div>
            <div style={styles.summaryItem}>
              <strong>Split By Dimension:</strong> {view}
            </div>
            <div style={styles.summaryItem}>
              <strong>Date Range:</strong> {dateRange}
            </div>
            <div style={styles.summaryItem}>
              <strong>Total Records:</strong>{" "}
              {filteredData.length.toLocaleString()}
            </div>
            <div style={styles.summaryItem}>
              <strong>Period Range:</strong>{" "}
              {periods.length > 0
                ? periods[0] + " to " + periods[periods.length - 1]
                : "No data"}
            </div>
            <div style={styles.summaryItem}>
              <strong>Active Filters:</strong>{" "}
              {FILTER_CONFIG.flatMap(({ state, formatValue, key }) => {
                if (state.length === 0) return [];
                return state.map((val) =>
                  formatValue ? formatValue(val) : formatFilterName(val)
                );
              }).join(", ") || "None"}
            </div>
            <div style={styles.summaryItem}>
              <strong>Filter Context:</strong> {getShortFilterContext()}
            </div>
            <div style={styles.summaryItem}>
              <strong>Market Size:</strong>{" "}
              {formatMetric(calculateMetric(filteredData))}
            </div>
            <div style={styles.summaryItem}>
              <strong>Solo Insights Found:</strong>{" "}
              {Object.values(displayedInsights.basicInsights).flat().length}
            </div>
            <div style={styles.summaryItem}>
              <strong>Data Filter Time:</strong>{" "}
              {filterTimeRef.current.toFixed(2)}ms
            </div>
            <div style={styles.summaryItem}>
              <strong>Render Time:</strong>{" "}
              {(performance.now() - renderStartTime).toFixed(2)}ms
            </div>
            <div style={styles.summaryItem}>
              <strong>Render Count:</strong> {renderCountRef.current}
            </div>
            <div style={styles.summaryItem}>
              <strong>Raw Data Rows:</strong>{" "}
              {cleanedQueryData.rows
                ? cleanedQueryData.rows.length.toLocaleString()
                : 0}
            </div>
            <div style={styles.summaryItem}>
              <strong>Filtered Rows:</strong>{" "}
              {filteredData.length.toLocaleString()}
            </div>
            <div style={styles.summaryItem}>
              <strong>Cross Insights Found:</strong>{" "}
              {Object.values(displayedInsights.advancedInsights).flat().length}
            </div>
          </div>
        )}
      </div>

      {/* Connect to Database Modal */}
      {showConnectModal && (
        <div style={styles.shareModal} onClick={e => { if (e.target === e.currentTarget) setShowConnectModal(false); }}>
          <div style={{ ...styles.shareModalContent, maxWidth: '440px' }}>
            <div style={styles.shareModalHeader}>
              <div style={styles.shareModalTitle}>Connect to Database</div>
              <button style={styles.shareModalClose} onClick={() => setShowConnectModal(false)}>×</button>
            </div>
            <div style={{ padding: '4px 0 16px' }}>
              <p style={{ margin: '0 0 16px', fontSize: '12px', color: isDarkMode ? '#9ca3af' : '#6b7280' }}>
                Enter your Supabase connection details. Requires the <code style={{ fontSize: '11px', padding: '1px 4px', borderRadius: '3px', background: isDarkMode ? '#1f2937' : '#f3f4f6' }}>query_dataset</code> RPC function (see setup.sql).
              </p>
              {[
                { key: 'supabaseUrl', label: 'Supabase URL', placeholder: 'https://your-project.supabase.co' },
                { key: 'apiKey', label: 'API Key (anon)', placeholder: 'eyJhbGciOi...' },
                { key: 'dataset', label: 'Dataset (table name)', placeholder: 'my_metrics_table' },
              ].map(f => (
                <div key={f.key} style={{ marginBottom: '12px' }}>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, marginBottom: '4px', color: isDarkMode ? '#d1d5db' : '#374151' }}>{f.label}</label>
                  <input
                    type={f.key === 'apiKey' ? 'password' : 'text'}
                    value={connectForm[f.key]}
                    onChange={e => setConnectForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                    placeholder={f.placeholder}
                    style={{
                      width: '100%', padding: '8px 10px', borderRadius: '6px', fontSize: '13px', boxSizing: 'border-box',
                      border: `1px solid ${isDarkMode ? '#4b5563' : '#d1d5db'}`,
                      backgroundColor: isDarkMode ? '#111827' : '#f9fafb',
                      color: isDarkMode ? '#f3f4f6' : '#111827', outline: 'none',
                    }}
                  />
                </div>
              ))}
              {connectError && (
                <div style={{ fontSize: '12px', color: '#ef4444', marginBottom: '12px' }}>{connectError}</div>
              )}
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                <button
                  onClick={() => setShowConnectModal(false)}
                  style={{
                    padding: '6px 14px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer',
                    border: `1px solid ${isDarkMode ? '#4b5563' : '#d1d5db'}`,
                    background: 'transparent', color: isDarkMode ? '#d1d5db' : '#374151',
                  }}
                >Cancel</button>
                <button
                  disabled={connectSaving || !connectForm.supabaseUrl || !connectForm.apiKey || !connectForm.dataset}
                  onClick={async () => {
                    setConnectError('');
                    setConnectSaving(true);
                    try {
                      // Validate connection by calling schema action
                      const testRes = await fetch(connectForm.supabaseUrl.replace(/\/+$/, '') + '/rest/v1/rpc/query_dataset', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', 'apikey': connectForm.apiKey, 'Authorization': 'Bearer ' + connectForm.apiKey },
                        body: JSON.stringify({ p_table: connectForm.dataset, p_action: 'schema' }),
                      });
                      if (!testRes.ok) throw new Error('Connection failed (HTTP ' + testRes.status + '). Check your URL and API key.');
                      const testData = await testRes.json();
                      if (testData.error) throw new Error(testData.error);
                      // Connection works — create config in Config DB
                      const connectionJson = { supabaseUrl: connectForm.supabaseUrl.replace(/\/+$/, ''), apiKey: connectForm.apiKey, dataset: connectForm.dataset };
                      const tabsJson = [{ id: 'tab_1', name: connectForm.dataset, dataset: connectForm.dataset, metricConfig: null }];
                      const result = await createConfig({ name: connectForm.dataset, connectionJson, tabsJson });
                      setEditSecret(result.id, result.editSecret);
                      // Navigate to the new config URL
                      window.location.hash = '#/' + result.id;
                      window.location.reload();
                    } catch (err) {
                      setConnectError(err.message);
                    }
                    setConnectSaving(false);
                  }}
                  style={{
                    padding: '6px 14px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer', fontWeight: 600,
                    border: 'none',
                    background: (!connectForm.supabaseUrl || !connectForm.apiKey || !connectForm.dataset) ? (isDarkMode ? '#374151' : '#e5e7eb') : '#6366f1',
                    color: (!connectForm.supabaseUrl || !connectForm.apiKey || !connectForm.dataset) ? (isDarkMode ? '#6b7280' : '#9ca3af') : '#ffffff',
                  }}
                >{connectSaving ? 'Connecting...' : 'Connect & Save'}</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && (
        <div
          style={styles.shareModal}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowShareModal(false);
            }
          }}
        >
          <div style={styles.shareModalContent}>
            <div style={styles.shareModalHeader}>
              <div style={styles.shareModalTitle}>
                Share Chart Configuration
              </div>
              <button
                style={styles.shareModalClose}
                onClick={() => setShowShareModal(false)}
              >
                ×
              </button>
            </div>
            {/* Share Link Section */}
            <div style={styles.shareCodeSection}>
              <label style={styles.shareCodeLabel}>Your Share Link:</label>
              <div style={styles.shareLinkContainer}>
                      <a
                        id="share-link-anchor"
                        href={shareCode}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          ...styles.shareLinkInput,
                          textDecoration: "none",
                          color: "#6366f1",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          padding: "10px 12px",
                          wordBreak: "break-all",
                        }}
                      >
                        {shareCode}
                      </a>
                      <button
                        id="copy-share-code-btn"
                        style={styles.shareCopyButton}
                        onClick={() => {
                          if (navigator.clipboard && navigator.clipboard.writeText) {
                            navigator.clipboard.writeText(shareCode).then(() => {
                              const btn = document.getElementById("copy-share-code-btn");
                              if (btn) {
                                const orig = btn.textContent;
                                btn.textContent = "Copied!";
                                btn.style.backgroundColor = "#10b981";
                                setTimeout(() => { btn.textContent = orig; btn.style.backgroundColor = "#6366f1"; }, 2000);
                              }
                            }).catch(e => console.error("Failed to copy:", e));
                          }
                        }}
                      >
                        Copy Link
                      </button>
              </div>
              <div style={styles.shareInstructions}>
                <p style={{ margin: "8px 0 0 0", fontSize: "12px", color: "#6b7280" }}>
                  Share this link. Recipients can view and explore the dashboard from this exact view.
                </p>
              </div>
              {/* Edit Key section — only for creators with a config */}
              {isCreatorMode && configId && (() => {
                const secret = getEditSecret(configId);
                if (!secret) return null;
                return (
                  <div style={{ marginTop: '12px', padding: '10px 12px', borderRadius: '6px',
                    background: isDarkMode ? 'rgba(99,102,241,0.08)' : 'rgba(99,102,241,0.05)',
                    border: `1px solid ${isDarkMode ? 'rgba(99,102,241,0.2)' : 'rgba(99,102,241,0.15)'}`,
                  }}>
                    <div style={{ fontSize: '11px', fontWeight: 600, color: isDarkMode ? '#a5b4fc' : '#4338ca', marginBottom: '4px' }}>
                      Edit Key (for managing from other devices)
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <code style={{
                        flex: 1, fontSize: '11px', padding: '4px 8px', borderRadius: '4px',
                        background: isDarkMode ? '#111827' : '#f3f4f6', color: isDarkMode ? '#d1d5db' : '#374151',
                        wordBreak: 'break-all', userSelect: 'all',
                      }}>{secret}</code>
                      <button
                        id="copy-edit-key-btn"
                        onClick={() => {
                          navigator.clipboard.writeText(secret).then(() => {
                            const btn = document.getElementById('copy-edit-key-btn');
                            if (btn) { const orig = btn.textContent; btn.textContent = 'Copied!'; setTimeout(() => { btn.textContent = orig; }, 1500); }
                          });
                        }}
                        style={{
                          padding: '3px 8px', borderRadius: '4px', fontSize: '10px', cursor: 'pointer',
                          border: `1px solid ${isDarkMode ? 'rgba(99,102,241,0.3)' : 'rgba(99,102,241,0.3)'}`,
                          background: 'transparent', color: isDarkMode ? '#a5b4fc' : '#4338ca', whiteSpace: 'nowrap',
                        }}
                      >Copy</button>
                    </div>
                    <div style={{ fontSize: '10px', color: isDarkMode ? '#6b7280' : '#9ca3af', marginTop: '4px' }}>
                      Paste this into the &#9881; gear icon on another device to unlock editing.
                    </div>
                  </div>
                );
              })()}
            </div>

          </div>
        </div>
      )}

      {/* Save View Modal */}
      {showSaveViewModal && (
        <div
          style={styles.shareModal}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowSaveViewModal(false);
            }
          }}
        >
          <div style={styles.shareModalContent}>
            <button
              style={styles.shareModalClose}
              onClick={() => {
                setShowSaveViewModal(false);
                setSaveViewError("");
                setSaveViewSuccess("");
              }}
            >
              ×
            </button>

            <div style={styles.shareCodeSection}>
              {/* Note at top */}
              <div style={styles.shareInstructions}>
                <p
                  style={{
                    margin: "0 0 16px 0",
                    fontSize: "11px",
                    color: "#9ca3af",
                    fontStyle: "italic",
                  }}
                >
                  Note: Saved views will appear in the "Load Saved View"
                  dropdown after approximately 1 hour, once the Google Sheet
                  data is refreshed in the database.
                </p>
              </div>

              {/* View Name Input */}
              <div style={styles.marginBottom16}>
                <label style={styles.shareCodeLabel}>View Name:</label>
                <input
                  type="text"
                  value={saveViewName}
                  onChange={(e) => {
                    setSaveViewName(e.target.value);
                    setSaveViewError("");
                  }}
                  placeholder="Enter a name for this view..."
                  style={{
                    ...styles.pasteCodeInput,
                    width: "100%",
                  }}
                />
              </div>

              {/* Owner Type Selection */}
              <div style={styles.marginBottom16}>
                <label style={styles.shareCodeLabel}>Save as:</label>
                <div style={styles.flexGap12Mt8}>
                  <label style={styles.radioLabel}>
                    <input
                      type="radio"
                      value="username"
                      checked={saveViewOwnerType === "username"}
                      onChange={(e) => setSaveViewOwnerType(e.target.value)}
                      style={styles.marginRight6}
                      disabled={!username}
                    />
                    {username || "Username (not available)"}
                  </label>
                  <label style={styles.radioLabel}>
                    <input
                      type="radio"
                      value="team"
                      checked={saveViewOwnerType === "team"}
                      onChange={(e) => setSaveViewOwnerType(e.target.value)}
                      style={styles.marginRight6}
                      disabled={!teamName}
                    />
                    {teamName || "Team (not available)"}
                  </label>
                  <label style={styles.radioLabel}>
                    <input
                      type="radio"
                      value="custom"
                      checked={saveViewOwnerType === "custom"}
                      onChange={(e) => setSaveViewOwnerType(e.target.value)}
                      style={styles.marginRight6}
                    />
                    Custom
                  </label>
                </div>
              </div>

              {/* Custom Owner Input (shown only when "Custom" is selected) */}
              {saveViewOwnerType === "custom" && (
                <div style={styles.marginBottom16}>
                  <label style={styles.shareCodeLabel}>Custom Owner:</label>
                  <input
                    type="text"
                    value={saveViewCustomOwner}
                    onChange={(e) => {
                      setSaveViewCustomOwner(e.target.value);
                      setSaveViewError("");
                    }}
                    placeholder="Enter custom owner name..."
                    style={{
                      ...styles.pasteCodeInput,
                      width: "100%",
                    }}
                  />
                </div>
              )}

              {/* Error Message */}
              {saveViewError && (
                <div
                  style={{
                    color: "#ef4444",
                    fontSize: "13px",
                    marginBottom: "12px",
                    padding: "8px",
                    backgroundColor: "#fee2e2",
                    borderRadius: "4px",
                  }}
                >
                  {saveViewError}
                </div>
              )}

              {/* Success Message */}
              {saveViewSuccess && (
                <div
                  style={{
                    color: "#10b981",
                    fontSize: "13px",
                    marginBottom: "12px",
                    padding: "8px",
                    backgroundColor: "#d1fae5",
                    borderRadius: "4px",
                  }}
                >
                  {saveViewSuccess}
                </div>
              )}

              {/* Save Button */}
              <button
                style={{
                  ...styles.shareLoadButton,
                  width: "100%",
                }}
                onClick={handleSaveView}
              >
                Save View
              </button>

              {/* Instructions */}
              <div style={styles.shareInstructions}>
                <p
                  style={{
                    margin: "12px 0 0 0",
                    fontSize: "12px",
                    color: "#6b7280",
                  }}
                >
                  This will save your current chart configuration to Google
                  Sheets. A new tab will open to complete the save (to bypass
                  CSP/CORS restrictions). You can close the new tab after seeing
                  the success message.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {showGuide &&
        (() => {
          const step = GUIDE_STEPS[guideStep];
          if (!step) return null;
          const element = document.querySelector(step.targetSelector);
          if (!element) return null;
          const rect = element.getBoundingClientRect();
          return (
            <>
              <div style={styles.guideOverlay} onClick={skipGuide} />
              <div
                style={{
                  ...styles.guideHighlight,
                  top: `${rect.top}px`,
                  left: `${rect.left}px`,
                  width: `${rect.width}px`,
                  height: `${rect.height}px`,
                }}
              />
              <div
                style={{
                  ...styles.guideTooltip,
                  position: "fixed",
                  bottom: "200px",
                  right: "24px",
                  maxWidth: "400px",
                }}
              >
                <div style={styles.guideTooltipHeader}>
                  <div>
                    <div style={styles.guideTooltipTitle}>{step.title}</div>
                    <div style={styles.guideTooltipStep}>
                      Step {guideStep + 1} of {GUIDE_STEPS.length}
                    </div>
                  </div>
                  <button style={styles.guideTooltipClose} onClick={skipGuide}>
                    ×
                  </button>
                </div>
                <div style={styles.guideTooltipDescription}>
                  {step.description}
                </div>
                <div style={styles.guideTooltipButtons}>
                  {guideStep > 0 && (
                    <button
                      style={{
                        ...styles.guideTooltipButton,
                        ...styles.guideTooltipButtonSecondary,
                      }}
                      onClick={previousStep}
                    >
                      ← Previous
                    </button>
                  )}
                  <button
                    style={{
                      ...styles.guideTooltipButton,
                      ...styles.guideTooltipButtonSecondary,
                    }}
                    onClick={skipGuide}
                  >
                    Skip
                  </button>
                  <button
                    style={{
                      ...styles.guideTooltipButton,
                      ...styles.guideTooltipButtonPrimary,
                    }}
                    onClick={nextStep}
                  >
                    {guideStep < GUIDE_STEPS.length - 1 ? "Next →" : "Finish"}
                  </button>
                </div>
              </div>
            </>
          );
        })()}

      {/* Metrics Editor Modal */}
      {showMetricsEditor && metricsEditorDraft && (
        <MetricsEditorModal
          draft={metricsEditorDraft}
          onDraftChange={setMetricsEditorDraft}
          onClose={() => setShowMetricsEditor(false)}
          onSave={handleMetricsEditorSave}
          suggesting={metricsEditorSuggesting}
          error={metricsEditorError}
          onSuggest={handleMetricsEditorSuggest}
          columns={liveColumnMeta}
          schemaDimensions={liveSchemaClassified.dimensions}
          expandedSlot={expandedMetricSlot}
          onExpandSlot={setExpandedMetricSlot}
          activeDataset={activeTab?.dataset}
          isDarkMode={isDarkMode}
        />
      )}
    </div>
  );
}
