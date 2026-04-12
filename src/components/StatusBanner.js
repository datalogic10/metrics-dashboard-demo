// Status Banner component — connection/loading/error/demo status banners.
// Extracted from Analyzer_Demo.js for readability.

function BannerBase({ isDarkMode, color, children }) {
  const colors = {
    blue: {
      bg: isDarkMode ? "rgba(99, 102, 241, 0.12)" : "rgba(99, 102, 241, 0.1)",
      border: isDarkMode ? "rgba(99, 102, 241, 0.35)" : "rgba(99, 102, 241, 0.4)",
      text: isDarkMode ? "#a5b4fc" : "#4338ca",
    },
    red: {
      bg: isDarkMode ? "rgba(239, 68, 68, 0.12)" : "rgba(239, 68, 68, 0.1)",
      border: isDarkMode ? "rgba(239, 68, 68, 0.35)" : "rgba(239, 68, 68, 0.4)",
      text: isDarkMode ? "#fca5a5" : "#dc2626",
    },
    amber: {
      bg: isDarkMode ? "rgba(245, 158, 11, 0.12)" : "rgba(245, 158, 11, 0.1)",
      border: isDarkMode ? "rgba(245, 158, 11, 0.35)" : "rgba(245, 158, 11, 0.4)",
      text: isDarkMode ? "#fbbf24" : "#92400e",
    },
    yellow: {
      bg: isDarkMode ? "rgba(234, 179, 8, 0.12)" : "rgba(234, 179, 8, 0.1)",
      border: isDarkMode ? "rgba(234, 179, 8, 0.35)" : "rgba(234, 179, 8, 0.4)",
      text: isDarkMode ? "#fcd34d" : "#92400e",
    },
  };
  const c = colors[color] || colors.blue;
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: "8px",
      padding: "8px 16px", backgroundColor: c.bg,
      border: `1px solid ${c.border}`,
      borderRadius: "8px", marginBottom: "12px", fontSize: "12px",
      color: c.text,
      transition: "background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease",
      animation: "bannerFadeIn 0.25s ease",
    }}>
      {children}
    </div>
  );
}

function Spinner() {
  return (
    <div style={{
      width: "14px", height: "14px",
      border: "2px solid currentColor",
      borderTopColor: "transparent",
      borderRadius: "50%",
      animation: "spin 0.8s linear infinite",
    }} />
  );
}

export function StatusBanner({
  baseConnection,
  activeTab,
  configLoading,
  configError,
  liveDataLoading,
  liveDataError,
  liveDataTruncated,
  dataSourceType,
  connectionParams,
  isDarkMode,
  handleCsvUpload,
  setShowConnectModal,
}) {
  return (
    <>
      {baseConnection && activeTab && !activeTab.dataset && !liveDataLoading && (
        <BannerBase isDarkMode={isDarkMode} color="amber">
          <span>No dataset configured. Click <strong>Configure Metrics</strong> to set the table name.</span>
        </BannerBase>
      )}
      {configLoading && (
        <BannerBase isDarkMode={isDarkMode} color="blue">
          <Spinner />
          <span>Loading dashboard configuration...</span>
        </BannerBase>
      )}
      {configError && (
        <BannerBase isDarkMode={isDarkMode} color="red">
          <span>{configError}</span>
          <button onClick={() => window.location.reload()} style={{
            marginLeft: "auto", padding: "2px 10px", borderRadius: "4px", fontSize: "11px", cursor: "pointer",
            border: `1px solid ${isDarkMode ? "rgba(239, 68, 68, 0.4)" : "rgba(239, 68, 68, 0.5)"}`,
            background: "transparent", color: "inherit",
          }}>Retry</button>
        </BannerBase>
      )}
      {liveDataLoading && (
        <BannerBase isDarkMode={isDarkMode} color="blue">
          <Spinner />
          <span>Connecting to <strong>{connectionParams?.dataset}</strong>...</span>
        </BannerBase>
      )}
      {liveDataError && (
        <BannerBase isDarkMode={isDarkMode} color="red">
          <span>Connection failed: {liveDataError}. Showing demo data instead.</span>
        </BannerBase>
      )}
      {liveDataTruncated && !liveDataLoading && (
        <BannerBase isDarkMode={isDarkMode} color="amber">
          <span>Data truncated — results hit the row limit. Metrics may be incomplete.</span>
        </BannerBase>
      )}
      {dataSourceType === 'csv' && !connectionParams && !liveDataLoading && !liveDataError && (
        <BannerBase isDarkMode={isDarkMode} color="yellow">
          <span><strong>Demo Data</strong> — viewing sample CSV.</span>
          <div style={{ marginLeft: "auto", display: "flex", gap: "6px" }}>
            <label style={{
              padding: "4px 12px", borderRadius: "4px", fontSize: "11px", cursor: "pointer",
              border: `1px solid ${isDarkMode ? "rgba(16, 185, 129, 0.5)" : "rgba(16, 185, 129, 0.5)"}`,
              background: isDarkMode ? "rgba(16, 185, 129, 0.2)" : "rgba(16, 185, 129, 0.1)",
              color: isDarkMode ? "#6ee7b7" : "#065f46", fontWeight: 600, whiteSpace: "nowrap",
            }}>
              Upload CSV
              <input type="file" accept=".csv,.tsv" hidden onChange={e => {
                if (e.target.files[0]) handleCsvUpload(e.target.files[0]);
                e.target.value = '';
              }} />
            </label>
            <button
              onClick={() => setShowConnectModal(true)}
              style={{
                padding: "4px 12px", borderRadius: "4px", fontSize: "11px", cursor: "pointer",
                border: `1px solid ${isDarkMode ? "rgba(99, 102, 241, 0.5)" : "rgba(99, 102, 241, 0.5)"}`,
                background: isDarkMode ? "rgba(99, 102, 241, 0.2)" : "rgba(99, 102, 241, 0.1)",
                color: isDarkMode ? "#a5b4fc" : "#4338ca", fontWeight: 600, whiteSpace: "nowrap",
              }}
            >Connect to Database</button>
          </div>
        </BannerBase>
      )}
    </>
  );
}
