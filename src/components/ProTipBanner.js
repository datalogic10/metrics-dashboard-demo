// Pro Tip banner — yellow strip above main content that cycles through
// tips. Extracted from Analyzer_Demo.js for readability.

const navHover = {
  onMouseEnter: (e) => {
    e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.9)";
    e.currentTarget.style.transform = "scale(1.1)";
  },
  onMouseLeave: (e) => {
    e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.6)";
    e.currentTarget.style.transform = "scale(1)";
  },
};

export function ProTipBanner({ styles, PRO_TIPS, currentTipIndex, setCurrentTipIndex }) {
  const tip = PRO_TIPS[currentTipIndex];
  return (
    <div style={styles.proTipBanner}>
      <span style={styles.proTipLabel}>ProTip</span>
      <span style={styles.proTipIcon}>{tip.icon}</span>
      <div style={styles.proTipContent}>
        <span style={styles.proTipTitle}>{tip.title}:</span>
        <span style={styles.proTipText}>{tip.text}</span>
      </div>
      <div style={styles.proTipNavigation}>
        <button
          style={styles.proTipNavButton}
          onClick={() =>
            setCurrentTipIndex((prev) =>
              prev === 0 ? PRO_TIPS.length - 1 : prev - 1
            )
          }
          {...navHover}
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
          {...navHover}
          title="Next tip"
        >
          ›
        </button>
      </div>
    </div>
  );
}
