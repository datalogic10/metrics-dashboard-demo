// Compare View components — Dock Bar and Overlay extracted from Analyzer_Demo.js.
// These are leaf UI components with no children from the parent.

import { COMPARE_CARD_COLORS } from '../compareChartBuilder.js';

/**
 * Fixed bottom dock bar showing compare cards with editable labels.
 * Visible when compareCards.length > 0.
 */
export function CompareDockBar({
  compareCards,
  isDarkMode,
  editingCompareCardId,
  setEditingCompareCardId,
  updateCompareCardLabel,
  removeCompareCard,
  addCompareCard,
  clearAllCompareCards,
  setCompareDateRange,
  setShowCompareView,
}) {
  if (compareCards.length === 0) return null;

  return (
    <div style={{
      position: "fixed",
      bottom: 0,
      left: 0,
      right: 0,
      height: "72px",
      backgroundColor: isDarkMode ? "#1e293b" : "#ffffff",
      borderTop: `2px solid ${isDarkMode ? '#334155' : '#e2e8f0'}`,
      display: "flex",
      alignItems: "center",
      padding: "0 20px",
      gap: "12px",
      zIndex: 50,
      boxShadow: "0 -4px 12px rgba(0,0,0,0.1)",
    }}>
      {compareCards.map((card, idx) => (
        <div key={card.id} style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          padding: "8px 12px",
          backgroundColor: isDarkMode ? "#0f172a" : "#f8fafc",
          borderLeft: `4px solid ${COMPARE_CARD_COLORS[idx]}`,
          borderRadius: "6px",
          border: `1px solid ${isDarkMode ? '#334155' : '#e2e8f0'}`,
          borderLeftWidth: "4px",
          borderLeftColor: COMPARE_CARD_COLORS[idx],
          minWidth: "180px",
          maxWidth: "280px",
        }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            {editingCompareCardId === card.id ? (
              <input
                autoFocus
                defaultValue={card.label}
                onBlur={(e) => { updateCompareCardLabel(card.id, e.target.value || card.label); setEditingCompareCardId(null); }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') { updateCompareCardLabel(card.id, e.target.value || card.label); setEditingCompareCardId(null); }
                  if (e.key === 'Escape') setEditingCompareCardId(null);
                }}
                style={{
                  fontSize: "13px", fontWeight: "600", width: "100%",
                  color: isDarkMode ? "#f1f5f9" : "#1e293b",
                  background: isDarkMode ? "#1e293b" : "#ffffff",
                  border: `1px solid ${COMPARE_CARD_COLORS[idx]}`,
                  borderRadius: "3px", padding: "1px 4px", outline: "none",
                }}
              />
            ) : (
              <div
                onDoubleClick={() => setEditingCompareCardId(card.id)}
                title="Double-click to rename"
                style={{
                  fontSize: "13px",
                  fontWeight: "600",
                  color: isDarkMode ? "#f1f5f9" : "#1e293b",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  cursor: "text",
                }}>{card.label}</div>
            )}
            <div style={{
              fontSize: "11px",
              color: isDarkMode ? "#94a3b8" : "#64748b",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}>{card.tabName} | {card.metricLabel} | {card.view} | {card.dateRange}</div>
          </div>
          <button
            onClick={() => removeCompareCard(card.id)}
            style={{
              background: "none",
              border: "none",
              fontSize: "16px",
              color: isDarkMode ? "#94a3b8" : "#94a3b8",
              cursor: "pointer",
              padding: "2px",
              lineHeight: 1,
            }}
            title="Remove from comparison"
          >x</button>
        </div>
      ))}
      <div style={{ flex: 1 }} />
      {compareCards.length < 3 && (
        <button
          onClick={addCompareCard}
          style={{
            padding: "8px 16px",
            backgroundColor: isDarkMode ? "#1e40af" : "#3b82f6",
            color: "white",
            border: "none",
            borderRadius: "6px",
            fontSize: "12px",
            fontWeight: "600",
            cursor: "pointer",
          }}
        >+ Add Current View</button>
      )}
      {compareCards.length >= 2 && (
        <button
          onClick={() => { setCompareDateRange("30D"); setShowCompareView(true); }}
          style={{
            padding: "8px 16px",
            backgroundColor: isDarkMode ? "#065f46" : "#10b981",
            color: "white",
            border: "none",
            borderRadius: "6px",
            fontSize: "12px",
            fontWeight: "600",
            cursor: "pointer",
          }}
        >Compare</button>
      )}
      <button
        onClick={clearAllCompareCards}
        style={{
          padding: "8px 12px",
          backgroundColor: "transparent",
          color: isDarkMode ? "#94a3b8" : "#64748b",
          border: `1px solid ${isDarkMode ? '#475569' : '#cbd5e1'}`,
          borderRadius: "6px",
          fontSize: "12px",
          cursor: "pointer",
        }}
      >Clear All</button>
    </div>
  );
}

/**
 * Full-screen comparison overlay with Plotly chart and date range selector.
 * Visible when showCompareView is true and compareCards.length >= 2.
 */
export function CompareOverlay({
  compareCards,
  isDarkMode,
  showCompareView,
  setShowCompareView,
  compareDateRange,
  setCompareDateRange,
  compareNormalize,
  setCompareNormalize,
  buildComparisonChart,
  dateRanges,
}) {
  // Memoize chart computation to prevent Plotly from resetting legend toggle state on parent re-renders
  const { traces: comparisonTraces, layout: comparisonLayout } = React.useMemo(
    () => showCompareView && compareCards.length >= 2
      ? buildComparisonChart(compareCards, compareDateRange, isDarkMode, compareNormalize || 'off')
      : { traces: [], layout: {} },
    [compareCards, compareDateRange, isDarkMode, compareNormalize, showCompareView, buildComparisonChart]
  );

  if (!showCompareView || compareCards.length < 2) return null;

  return (
    <div style={{
      position: "fixed",
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: isDarkMode ? "rgba(0,0,0,0.85)" : "rgba(0,0,0,0.6)",
      zIndex: 100,
      display: "flex",
      flexDirection: "column",
    }}
      onClick={(e) => { if (e.target === e.currentTarget) setShowCompareView(false); }}
    >
      <div style={{
        flex: 1,
        margin: "20px",
        backgroundColor: isDarkMode ? "#1e293b" : "#ffffff",
        borderRadius: "12px",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}>
        {/* Header */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px 24px",
          borderBottom: `1px solid ${isDarkMode ? '#334155' : '#e2e8f0'}`,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{ fontSize: "16px", fontWeight: "700", color: isDarkMode ? "#f1f5f9" : "#1e293b" }}>
              Comparison View
            </span>
            {compareCards.map((card, i) => (
              <span key={card.id} style={{
                display: "inline-flex", alignItems: "center", gap: "6px",
                padding: "4px 10px", borderRadius: "16px",
                backgroundColor: COMPARE_CARD_COLORS[i] + '20',
                fontSize: "12px", fontWeight: "500",
                color: COMPARE_CARD_COLORS[i],
              }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: COMPARE_CARD_COLORS[i] }} />
                {card.label}
              </span>
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              {dateRanges.map(range => (
                <button
                  key={range}
                  onClick={() => setCompareDateRange(range)}
                  style={{
                    padding: "4px 10px",
                    fontSize: "11px",
                    fontWeight: compareDateRange === range ? "700" : "500",
                    color: compareDateRange === range ? "#ffffff" : (isDarkMode ? "#94a3b8" : "#64748b"),
                    backgroundColor: compareDateRange === range ? "#3b82f6" : (isDarkMode ? "#334155" : "#f1f5f9"),
                    border: `1px solid ${compareDateRange === range ? '#3b82f6' : (isDarkMode ? '#475569' : '#e2e8f0')}`,
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >{range}</button>
              ))}
            </div>
            {setCompareNormalize && (
              <div
                style={{ display: "flex", alignItems: "center", gap: "4px" }}
                title="Rescale y1 traces for visual comparison of ups and downs. y2 (WoW/DoD/%Share) is untouched. Hover shows original values."
              >
                <span style={{ fontSize: "10px", fontWeight: "600", color: isDarkMode ? "#94a3b8" : "#64748b", textTransform: "uppercase" }}>Normalize</span>
                {[
                  { id: 'off', label: 'Off' },
                  { id: 'zscore', label: 'Z-score' },
                  { id: 'minmax', label: 'Min-max' },
                ].map(opt => {
                  const active = (compareNormalize || 'off') === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => setCompareNormalize(opt.id)}
                      style={{
                        padding: "4px 10px",
                        fontSize: "11px",
                        fontWeight: active ? "700" : "500",
                        color: active ? "#ffffff" : (isDarkMode ? "#94a3b8" : "#64748b"),
                        backgroundColor: active ? "#8b5cf6" : (isDarkMode ? "#334155" : "#f1f5f9"),
                        border: `1px solid ${active ? '#8b5cf6' : (isDarkMode ? '#475569' : '#e2e8f0')}`,
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}
                    >{opt.label}</button>
                  );
                })}
              </div>
            )}
          </div>
          <button
            onClick={() => setShowCompareView(false)}
            style={{
              background: "none", border: "none",
              fontSize: "24px", color: isDarkMode ? "#94a3b8" : "#6b7280",
              cursor: "pointer", padding: "4px",
            }}
            title="Close comparison (Esc)"
          >x</button>
        </div>
        {/* Chart */}
        <div style={{ flex: 1, padding: "16px 24px" }}>
          <PlotlyChart
            data={comparisonTraces}
            layout={comparisonLayout}
            config={{ responsive: true, displayModeBar: true, displaylogo: false }}
            style={{ width: "100%", height: "100%" }}
          />
        </div>
      </div>
    </div>
  );
}
