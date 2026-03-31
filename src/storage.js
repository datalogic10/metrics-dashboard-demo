/**
 * Safe localStorage wrappers. Returns null / silently no-ops when
 * localStorage is unavailable (incognito mode, storage quota, etc.).
 */

export function storageGet(key) {
  try { return localStorage.getItem(key); } catch (e) { return null; }
}

export function storageSet(key, value) {
  try { localStorage.setItem(key, value); } catch (e) { /* unavailable */ }
}

export function storageGetJSON(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch (e) { return null; }
}

export function storageSetJSON(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* unavailable */ }
}
