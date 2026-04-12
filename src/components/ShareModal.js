// Share modal — shows the share link and (for creators) the edit key.
// Extracted from Analyzer_Demo.js.

import logger from '../logger.js';
import { getEditSecret } from '../configDb.js';

export function ShareModal({
  styles, isDarkMode, shareCode,
  isCreatorMode, configId,
  setShowShareModal,
}) {
  return (
    <div
      style={styles.shareModal}
      onClick={(e) => { if (e.target === e.currentTarget) setShowShareModal(false); }}
    >
      <div style={styles.shareModalContent}>
        <div style={styles.shareModalHeader}>
          <div style={styles.shareModalTitle}>Share Chart Configuration</div>
          <button style={styles.shareModalClose} onClick={() => setShowShareModal(false)}>×</button>
        </div>
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
                  }).catch(e => logger.error("Failed to copy:", e));
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
  );
}
