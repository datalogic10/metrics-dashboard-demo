// Small shared helpers used across the dashboard render tree.
// Kept as a single file since each helper is trivial — splitting into
// one-file-per-function adds import plumbing without readability benefit.

// Build p_filters payload from dynamicFilters state. Strips the "dim_…_filter"
// key wrapper to raw column names. If a column is in booleanColumns, reverses
// the "<col>_true"/"<col>_false" display-value convention to real booleans.
export function buildPFilters(dynamicFilters, booleanColumns) {
  const out = {};
  Object.keys(dynamicFilters).forEach((filterKey) => {
    const vals = dynamicFilters[filterKey];
    if (!vals || vals.length === 0) return;
    const colName = filterKey.replace(/^dim_/, '').replace(/_filter$/, '');
    if (booleanColumns && booleanColumns.has(colName)) {
      out[colName] = vals.map((v) => {
        const suffix = v.replace(colName + '_', '');
        return suffix === 'true' ? true : suffix === 'false' ? false : v;
      });
    } else {
      out[colName] = vals;
    }
  });
  return out;
}

// VIEW_CONFIG entry for the active view, or null for "Overall".
export function getActiveViewConfig(view, VIEW_CONFIG) {
  return view !== 'Overall' ? VIEW_CONFIG[view] : null;
}

// Subtle opacity-on-hover for icon buttons. Spread into a JSX element
// via {...tabIconHover}. Pair with `transition: 'opacity 0.15s ease'`
// and `opacity: 0.6` on the button's inline style.
export const tabIconHover = {
  onMouseEnter: (e) => { e.target.style.opacity = 1; },
  onMouseLeave: (e) => { e.target.style.opacity = 0.6; },
};
