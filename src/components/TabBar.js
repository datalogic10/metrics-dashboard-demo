// Tab bar — dataset tabs + add tab button + Configure Metrics + lock/unlock
// toggle. Extracted from Analyzer_Demo.js for readability.

import { tabIconHover } from '../filterUtils.js';
import { updateConfig, getEditSecret, setEditSecret } from '../configDb.js';

export function TabBar({
  // data
  tabs, activeTabId, activeTab, configId, liveMetricConfig,
  liveRowCount, liveDataTruncated, liveDataLoading, liveDataError,
  isDarkMode, isCreatorMode,
  // transient UI state
  renamingTabId, renameText,
  showAddTab, newTabDataset,
  showUnlockPrompt, unlockSecret, unlockError,
  // setters
  setRenamingTabId, setRenameText,
  setShowAddTab, setNewTabDataset,
  setShowUnlockPrompt, setUnlockSecret, setUnlockError,
  setIsCreatorMode,
  setShowMetricsEditor, setMetricsEditorDraft, setMetricsEditorError, setExpandedMetricSlot,
  // callbacks
  switchTab, addTab, removeTab, renameTab, moveTab,
  // refs
  creatorTimerRef,
}) {
  return (
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
                display: "inline-block", flexShrink: 0,
                transition: 'background-color 0.2s ease',
              }} />
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
            {tabs.length > 1 && isActive && (isCreatorMode || !configId) && (
              <React.Fragment>
                {tabs.indexOf(tab) > 0 && <button
                  onClick={e => { e.stopPropagation(); moveTab(tab.id, -1); }}
                  style={{ background: 'none', border: 'none', color: isDarkMode ? '#6b7280' : '#9ca3af', cursor: 'pointer', fontSize: '10px', lineHeight: 1, padding: '0 1px', marginLeft: '4px', opacity: 0.6, transition: 'opacity 0.15s ease' }}
                  {...tabIconHover}
                  title="Move left"
                >&#9664;</button>}
                {tabs.indexOf(tab) < tabs.length - 1 && <button
                  onClick={e => { e.stopPropagation(); moveTab(tab.id, 1); }}
                  style={{ background: 'none', border: 'none', color: isDarkMode ? '#6b7280' : '#9ca3af', cursor: 'pointer', fontSize: '10px', lineHeight: 1, padding: '0 1px', opacity: 0.6, transition: 'opacity 0.15s ease' }}
                  {...tabIconHover}
                  title="Move right"
                >&#9654;</button>}
              </React.Fragment>
            )}
            {tabs.length > 1 && (isCreatorMode || !configId) && (
              <button
                onClick={e => { e.stopPropagation(); removeTab(tab.id); }}
                style={{
                  background: 'none', border: 'none', color: isDarkMode ? '#6b7280' : '#9ca3af',
                  cursor: 'pointer', fontSize: '14px', lineHeight: 1, padding: '0 2px', marginLeft: '4px',
                  opacity: 0.6, display: 'flex', alignItems: 'center',
                  transition: 'opacity 0.15s ease',
                }}
                {...tabIconHover}
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
                setIsCreatorMode(false);
                if (creatorTimerRef.current) clearTimeout(creatorTimerRef.current);
              } else if (getEditSecret(configId)) {
                setIsCreatorMode(true);
              } else {
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
  );
}
