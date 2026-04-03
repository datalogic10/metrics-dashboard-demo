// Metrics Editor Modal — configures metric slots, dataset, date column, dimensions.
// Extracted from Analyzer_Demo.js for modularity.

export function MetricsEditorModal({
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
  isDarkMode,
}) {
  const allCols = columns || [];
  const numericCols = allCols.filter(c =>
    c.udt === 'int4' || c.udt === 'int8' || c.udt === 'float4' || c.udt === 'float8' || c.udt === 'numeric'
  );
  const dateCols = allCols.filter(c =>
    c.udt === 'date' || c.udt === 'timestamp' || c.udt === 'timestamptz'
  );
  const updateDraft = (field, value) => onDraftChange(prev => ({ ...prev, [field]: value }));

  const overlayStyle = {
    position: 'fixed', inset: 0, zIndex: 10000,
    backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
    alignItems: 'center', justifyContent: 'center',
  };
  const modalStyle = {
    backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
    color: isDarkMode ? '#f3f4f6' : '#111827',
    borderRadius: '12px', padding: '24px', width: '480px', maxWidth: '90vw',
    maxHeight: '85vh', overflowY: 'auto',
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
    border: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`,
  };
  const labelStyle = { fontSize: '12px', fontWeight: 600, marginBottom: '4px', display: 'block', color: isDarkMode ? '#9ca3af' : '#6b7280' };
  const inputStyle = {
    width: '100%', padding: '6px 10px', borderRadius: '6px', fontSize: '13px',
    border: `1px solid ${isDarkMode ? '#4b5563' : '#d1d5db'}`,
    backgroundColor: isDarkMode ? '#111827' : '#f9fafb',
    color: isDarkMode ? '#f3f4f6' : '#111827',
    outline: 'none',
  };
  const selectStyle = { ...inputStyle, cursor: 'pointer' };
  const sectionStyle = { marginBottom: '16px', padding: '12px', borderRadius: '8px', backgroundColor: isDarkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)', border: `1px solid ${isDarkMode ? '#374151' : '#f3f4f6'}` };
  const rowStyle = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '6px' };

  const pillStyle = (isActive) => ({
    padding: '2px 8px', fontSize: '11px', borderRadius: '4px', cursor: 'pointer', fontWeight: 500,
    border: `1px solid ${isActive ? (isDarkMode ? '#6366f1' : '#818cf8') : (isDarkMode ? '#4b5563' : '#d1d5db')}`,
    backgroundColor: isActive ? (isDarkMode ? 'rgba(99,102,241,0.2)' : 'rgba(99,102,241,0.1)') : 'transparent',
    color: isActive ? (isDarkMode ? '#a5b4fc' : '#4f46e5') : (isDarkMode ? '#9ca3af' : '#6b7280'),
  });

  const renderAggRow = (aggTypeKey, columnKey, pctKey, allowDisable) => {
    const aggVal = draft[aggTypeKey] || (allowDisable ? '' : (draft[columnKey] ? 'sum' : 'count'));
    return (
      <div style={rowStyle}>
        <div>
          <label style={labelStyle}>Aggregation</label>
          <select style={selectStyle} value={aggVal} onChange={e => {
            const agg = e.target.value;
            updateDraft(aggTypeKey, agg || null);
            if (agg === 'count' || !agg) updateDraft(columnKey, null);
            if (agg !== 'percentile') updateDraft(pctKey, null);
          }}>
            {allowDisable && <option value="">— none (disable) —</option>}
            <option value="count">COUNT(*)</option>
            <option value="count_distinct">COUNT(DISTINCT)</option>
            <option value="sum">SUM</option>
            <option value="avg">AVG</option>
            <option value="min">MIN</option>
            <option value="max">MAX</option>
            <option value="percentile">PERCENTILE</option>
          </select>
        </div>
        <div>
          <label style={labelStyle}>Column</label>
          <select style={selectStyle} value={draft[columnKey] || ''} disabled={!aggVal || aggVal === 'count'}
            onChange={e => updateDraft(columnKey, e.target.value || null)}>
            <option value="">— select —</option>
            {(aggVal === 'count_distinct' ? allCols : numericCols).map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
          </select>
        </div>
        {aggVal === 'percentile' && (
          <div>
            <label style={labelStyle}>Pct (0-1)</label>
            <input type="number" step="0.05" min="0" max="1" style={{ ...inputStyle, width: '70px' }}
              value={draft[pctKey] != null ? draft[pctKey] : 0.5}
              onChange={e => updateDraft(pctKey, parseFloat(e.target.value) || 0.5)} />
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={modalStyle} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700 }}>Configure Metrics</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: isDarkMode ? '#9ca3af' : '#6b7280', cursor: 'pointer', fontSize: '18px', lineHeight: 1 }}>&times;</button>
        </div>

        {error && (
          <div style={{ padding: '8px 12px', marginBottom: '12px', borderRadius: '6px', fontSize: '12px', backgroundColor: isDarkMode ? 'rgba(239,68,68,0.15)' : '#fef2f2', color: isDarkMode ? '#fca5a5' : '#dc2626', border: `1px solid ${isDarkMode ? 'rgba(239,68,68,0.3)' : '#fecaca'}` }}>
            {error}
          </div>
        )}

        {/* AI Suggest Button */}
        <button
          onClick={onSuggest}
          disabled={suggesting}
          style={{
            width: '100%', padding: '8px', marginBottom: '16px', borderRadius: '8px',
            border: `1px solid ${isDarkMode ? '#6366f1' : '#818cf8'}`,
            backgroundColor: isDarkMode ? 'rgba(99,102,241,0.15)' : 'rgba(99,102,241,0.08)',
            color: isDarkMode ? '#a5b4fc' : '#4f46e5',
            cursor: suggesting ? 'wait' : 'pointer', fontSize: '13px', fontWeight: 600,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
            opacity: suggesting ? 0.7 : 1,
          }}
        >
          {suggesting ? (
            <>
              <span style={{ width: '14px', height: '14px', border: '2px solid currentColor', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite', display: 'inline-block' }} />
              Analyzing schema...
            </>
          ) : (
            'AI Suggest Metrics'
          )}
        </button>

        {/* Metric Slots — accordion: click header to expand/collapse */}
        {[
          { prefix: 'volume', title: 'Metric 1', canDisable: false },
          { prefix: 'revenue', title: 'Metric 2', canDisable: true },
          { prefix: 'derived', title: 'Metric 3', canDisable: true },
        ].map(({ prefix, title, canDisable }) => {
          const aggKey = prefix + 'AggType';
          const colKey = prefix + 'Column';
          const labelKey = prefix + 'Label';
          const formatKey = prefix + 'Format';
          const prefixKey = prefix + 'Prefix';
          const suffixKey = prefix + 'Suffix';
          const modeKey = prefix + 'Mode';
          const percentileKey = prefix + 'Percentile';
          const formulaOpKey = prefix + 'FormulaOperator';
          const fNumAggKey = prefix + 'FormulaNumAggType';
          const fNumColKey = prefix + 'FormulaNumColumn';
          const fNumPctKey = prefix + 'FormulaNumPercentile';
          const fDenAggKey = prefix + 'FormulaDenAggType';
          const fDenColKey = prefix + 'FormulaDenColumn';
          const fDenPctKey = prefix + 'FormulaDenPercentile';
          const chartTypeKey = prefix + 'ChartType';
          const mode = draft[modeKey] || 'aggregation';
          const isExpanded = expandedSlot === prefix;

          // Build compact summary for collapsed state
          const summaryParts = [];
          if (mode === 'formula') {
            const numAgg = (draft[fNumAggKey] || 'count').toUpperCase();
            const numCol = draft[fNumColKey] ? `(${draft[fNumColKey]})` : '(*)';
            const op = { '/': '÷', '*': '×', '+': '+', '-': '−' }[draft[formulaOpKey] || '/'] || '÷';
            const denAgg = (draft[fDenAggKey] || 'count').toUpperCase();
            const denCol = draft[fDenColKey] ? `(${draft[fDenColKey]})` : '(*)';
            summaryParts.push(`${numAgg}${numCol} ${op} ${denAgg}${denCol}`);
          } else {
            const agg = draft[aggKey];
            if (canDisable && !agg) {
              summaryParts.push('Disabled');
            } else {
              const aggLabel = (agg || 'count').toUpperCase();
              const col = draft[colKey] ? `(${draft[colKey]})` : '(*)';
              summaryParts.push(`${aggLabel}${col}`);
            }
          }
          const label = draft[labelKey];
          const summary = label ? `${summaryParts[0]}  ·  ${label}` : summaryParts[0];
          const isDisabled = canDisable && mode === 'aggregation' && !draft[aggKey];

          return (
            <div key={prefix} style={{
              ...sectionStyle,
              marginBottom: '8px',
              transition: 'all 0.15s ease',
            }}>
              {/* Accordion header — always visible */}
              <div
                onClick={() => onExpandSlot(isExpanded ? null : prefix)}
                style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  cursor: 'pointer', userSelect: 'none',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0, flex: 1 }}>
                  <span style={{
                    fontSize: '10px', color: isDarkMode ? '#6b7280' : '#9ca3af',
                    transition: 'transform 0.15s ease',
                    transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
                    display: 'inline-block',
                  }}>&#9654;</span>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: isDarkMode ? '#f3f4f6' : '#111827', flexShrink: 0 }}>
                    {title}
                  </span>
                  {!isExpanded && (
                    <span style={{
                      fontSize: '11px', color: isDisabled ? (isDarkMode ? '#6b7280' : '#9ca3af') : (isDarkMode ? '#9ca3af' : '#6b7280'),
                      fontStyle: isDisabled ? 'italic' : 'normal',
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>
                      {summary}
                    </span>
                  )}
                </div>
                {isExpanded && (
                  <div style={{ display: 'flex', gap: '4px', flexShrink: 0 }}>
                    {['aggregation', 'formula'].map(m => (
                      <button key={m}
                        onClick={e => {
                          e.stopPropagation();
                          updateDraft(modeKey, m);
                          if (m === 'formula') {
                            updateDraft(aggKey, null);
                            updateDraft(colKey, null);
                          }
                        }}
                        style={pillStyle(mode === m)}
                      >
                        {m === 'aggregation' ? 'Agg' : 'Formula'}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Expanded body */}
              {isExpanded && (
                <div style={{ marginTop: '10px' }}>
                  {mode === 'aggregation' ? (
                    renderAggRow(aggKey, colKey, percentileKey, canDisable)
                  ) : (
                    <div style={{ padding: '8px', borderRadius: '6px', backgroundColor: isDarkMode ? 'rgba(99,102,241,0.08)' : 'rgba(99,102,241,0.04)', border: `1px solid ${isDarkMode ? '#4b5563' : '#e5e7eb'}` }}>
                      <div style={{ fontSize: '11px', fontWeight: 600, marginBottom: '4px', color: isDarkMode ? '#9ca3af' : '#6b7280' }}>Numerator</div>
                      {renderAggRow(fNumAggKey, fNumColKey, fNumPctKey, false)}
                      <div style={{ display: 'flex', justifyContent: 'center', margin: '6px 0' }}>
                        <select style={{ ...selectStyle, width: '50px', textAlign: 'center', padding: '4px', fontSize: '14px', fontWeight: 700 }}
                          value={draft[formulaOpKey] || '/'}
                          onChange={e => updateDraft(formulaOpKey, e.target.value)}>
                          <option value="/">÷</option>
                          <option value="*">×</option>
                          <option value="+">+</option>
                          <option value="-">−</option>
                        </select>
                      </div>
                      <div style={{ fontSize: '11px', fontWeight: 600, marginBottom: '4px', color: isDarkMode ? '#9ca3af' : '#6b7280' }}>Denominator</div>
                      {renderAggRow(fDenAggKey, fDenColKey, fDenPctKey, false)}
                    </div>
                  )}

                  {/* Formatting: Label, Format, Prefix, Suffix in one row */}
                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '6px', marginTop: '8px' }}>
                    <div>
                      <label style={labelStyle}>Label</label>
                      <input style={inputStyle} value={draft[labelKey] || ''} onChange={e => updateDraft(labelKey, e.target.value)} placeholder="e.g. Total" />
                    </div>
                    <div>
                      <label style={labelStyle}>Format</label>
                      <input style={inputStyle} value={draft[formatKey] || ''} onChange={e => updateDraft(formatKey, e.target.value)} placeholder="0,0" />
                    </div>
                    <div>
                      <label style={labelStyle}>Prefix</label>
                      <input style={inputStyle} value={draft[prefixKey] || ''} onChange={e => updateDraft(prefixKey, e.target.value)} placeholder="$" />
                    </div>
                    <div>
                      <label style={labelStyle}>Suffix</label>
                      <input style={inputStyle} value={draft[suffixKey] || ''} onChange={e => updateDraft(suffixKey, e.target.value)} placeholder="ms" />
                    </div>
                  </div>
                  {/* Chart Type pills */}
                  <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <label style={{ ...labelStyle, marginBottom: 0, whiteSpace: 'nowrap' }}>Chart</label>
                    {[
                      { value: 'auto', label: 'Auto' },
                      { value: 'stacked', label: 'Stacked' },
                      { value: 'grouped', label: 'Grouped' },
                      { value: 'line', label: 'Line' },
                    ].map(opt => {
                      const current = draft[chartTypeKey] || 'auto';
                      return (
                        <button key={opt.value}
                          onClick={() => updateDraft(chartTypeKey, opt.value)}
                          style={pillStyle(current === opt.value)}
                        >
                          {opt.label}
                        </button>
                      );
                    })}
                    {(draft[chartTypeKey] || 'auto') === 'auto' && (
                      <span style={{ fontSize: '10px', color: isDarkMode ? '#6b7280' : '#9ca3af' }}>
                        ({mode === 'formula' ? 'line' : 'stacked'})
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Dataset + Date Column + Default Grain + Top-N Rank By */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '8px', marginBottom: '16px' }}>
          <div>
            <label style={labelStyle}>Dataset (table name)</label>
            <input style={inputStyle} value={draft.dataset || activeDataset || ''} onChange={e => updateDraft('dataset', e.target.value)} placeholder="schema.table_name" />
          </div>
          <div>
            <label style={labelStyle}>Date Column</label>
            <select style={selectStyle} value={draft.dateColumn || ''} onChange={e => updateDraft('dateColumn', e.target.value || null)}>
              <option value="">— none —</option>
              {dateCols.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Default Grain</label>
            <select style={selectStyle} value={draft.defaultGrain || 'month'} onChange={e => updateDraft('defaultGrain', e.target.value)}>
              <option value="day">Daily</option>
              <option value="week">Weekly</option>
              <option value="month">Monthly</option>
              <option value="quarter">Quarterly</option>
              <option value="year">Yearly</option>
            </select>
          </div>
          <div>
            <label style={labelStyle}>Sort top-N by</label>
            <select style={selectStyle} value={draft.topNRankBy || 'volume'} onChange={e => updateDraft('topNRankBy', e.target.value)}>
              <option value="volume">Metric 1</option>
              <option value="revenue">Metric 2</option>
              <option value="derived">Metric 3</option>
            </select>
          </div>
        </div>

        {/* Visible Dimensions */}
        <div style={sectionStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <div style={{ fontSize: '13px', fontWeight: 700, color: isDarkMode ? '#f3f4f6' : '#111827' }}>
              Dimensions & Filters
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => updateDraft('visibleDimensions', schemaDimensions.map(c => c.name))} style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '4px', border: `1px solid ${isDarkMode ? '#4b5563' : '#d1d5db'}`, background: 'transparent', color: isDarkMode ? '#9ca3af' : '#6b7280', cursor: 'pointer' }}>All</button>
              <button onClick={() => updateDraft('visibleDimensions', [])} style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '4px', border: `1px solid ${isDarkMode ? '#4b5563' : '#d1d5db'}`, background: 'transparent', color: isDarkMode ? '#9ca3af' : '#6b7280', cursor: 'pointer' }}>None</button>
            </div>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {schemaDimensions.map(c => {
              const visible = draft.visibleDimensions ? draft.visibleDimensions.includes(c.name) : true;
              const label = c.name.replace(/^is_/, '').replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
              return (
                <button key={c.name}
                  onClick={() => {
                    const current = draft.visibleDimensions || schemaDimensions.map(d => d.name);
                    const updated = visible ? current.filter(n => n !== c.name) : [...current, c.name];
                    updateDraft('visibleDimensions', updated);
                  }}
                  style={{
                    padding: '4px 10px', borderRadius: '14px', fontSize: '12px', cursor: 'pointer',
                    border: `1px solid ${visible ? (isDarkMode ? '#6366f1' : '#818cf8') : (isDarkMode ? '#374151' : '#e5e7eb')}`,
                    backgroundColor: visible ? (isDarkMode ? 'rgba(99,102,241,0.2)' : 'rgba(99,102,241,0.1)') : 'transparent',
                    color: visible ? (isDarkMode ? '#a5b4fc' : '#4f46e5') : (isDarkMode ? '#6b7280' : '#9ca3af'),
                    fontWeight: visible ? 600 : 400,
                  }}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
          <button onClick={onClose} style={{ padding: '8px 16px', borderRadius: '8px', border: `1px solid ${isDarkMode ? '#4b5563' : '#d1d5db'}`, background: 'transparent', color: isDarkMode ? '#d1d5db' : '#374151', cursor: 'pointer', fontSize: '13px', fontWeight: 500 }}>
            Cancel
          </button>
          <button onClick={onSave} style={{ padding: '8px 20px', borderRadius: '8px', border: 'none', backgroundColor: '#6366f1', color: '#ffffff', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}>
            Save & Apply
          </button>
        </div>
      </div>
    </div>
  );
}
