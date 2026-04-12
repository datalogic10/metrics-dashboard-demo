// Save View modal — saves current chart configuration to Google Sheets
// with a user/team/custom owner. Extracted from Analyzer_Demo.js.

export function SaveViewModal({
  styles,
  setShowSaveViewModal,
  saveViewName, setSaveViewName,
  saveViewError, setSaveViewError,
  saveViewSuccess, setSaveViewSuccess,
  saveViewOwnerType, setSaveViewOwnerType,
  saveViewCustomOwner, setSaveViewCustomOwner,
  username, teamName,
  handleSaveView,
}) {
  return (
    <div
      style={styles.shareModal}
      onClick={(e) => { if (e.target === e.currentTarget) setShowSaveViewModal(false); }}
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
          <div style={styles.shareInstructions}>
            <p style={{ margin: "0 0 16px 0", fontSize: "11px", color: "#9ca3af", fontStyle: "italic" }}>
              Note: Saved views will appear in the "Load Saved View" dropdown after approximately 1 hour, once the Google Sheet data is refreshed in the database.
            </p>
          </div>

          <div style={styles.marginBottom16}>
            <label style={styles.shareCodeLabel}>View Name:</label>
            <input
              type="text"
              value={saveViewName}
              onChange={(e) => { setSaveViewName(e.target.value); setSaveViewError(""); }}
              placeholder="Enter a name for this view..."
              style={{ ...styles.pasteCodeInput, width: "100%" }}
            />
          </div>

          <div style={styles.marginBottom16}>
            <label style={styles.shareCodeLabel}>Save as:</label>
            <div style={styles.flexGap12Mt8}>
              <label style={styles.radioLabel}>
                <input
                  type="radio" value="username"
                  checked={saveViewOwnerType === "username"}
                  onChange={(e) => setSaveViewOwnerType(e.target.value)}
                  style={styles.marginRight6}
                  disabled={!username}
                />
                {username || "Username (not available)"}
              </label>
              <label style={styles.radioLabel}>
                <input
                  type="radio" value="team"
                  checked={saveViewOwnerType === "team"}
                  onChange={(e) => setSaveViewOwnerType(e.target.value)}
                  style={styles.marginRight6}
                  disabled={!teamName}
                />
                {teamName || "Team (not available)"}
              </label>
              <label style={styles.radioLabel}>
                <input
                  type="radio" value="custom"
                  checked={saveViewOwnerType === "custom"}
                  onChange={(e) => setSaveViewOwnerType(e.target.value)}
                  style={styles.marginRight6}
                />
                Custom
              </label>
            </div>
          </div>

          {saveViewOwnerType === "custom" && (
            <div style={styles.marginBottom16}>
              <label style={styles.shareCodeLabel}>Custom Owner:</label>
              <input
                type="text"
                value={saveViewCustomOwner}
                onChange={(e) => { setSaveViewCustomOwner(e.target.value); setSaveViewError(""); }}
                placeholder="Enter custom owner name..."
                style={{ ...styles.pasteCodeInput, width: "100%" }}
              />
            </div>
          )}

          {saveViewError && (
            <div style={{ color: "#ef4444", fontSize: "13px", marginBottom: "12px", padding: "8px", backgroundColor: "#fee2e2", borderRadius: "4px" }}>
              {saveViewError}
            </div>
          )}

          {saveViewSuccess && (
            <div style={{ color: "#10b981", fontSize: "13px", marginBottom: "12px", padding: "8px", backgroundColor: "#d1fae5", borderRadius: "4px" }}>
              {saveViewSuccess}
            </div>
          )}

          <button
            style={{ ...styles.shareLoadButton, width: "100%" }}
            onClick={handleSaveView}
          >
            Save View
          </button>

          <div style={styles.shareInstructions}>
            <p style={{ margin: "12px 0 0 0", fontSize: "12px", color: "#6b7280" }}>
              This will save your current chart configuration to Google Sheets. A new tab will open to complete the save (to bypass CSP/CORS restrictions). You can close the new tab after seeing the success message.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
