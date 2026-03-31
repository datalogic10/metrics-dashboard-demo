/**
 * Thin logging wrapper. Silent in production unless ?debug is in the URL.
 * Keeps console calls in one place so they can be globally controlled.
 */
const DEBUG = typeof window !== 'undefined' &&
  (window.location.search.includes('debug') || window.location.hash.includes('debug'));

const noop = () => {};

const logger = {
  log:   DEBUG ? console.log.bind(console)   : noop,
  warn:  DEBUG ? console.warn.bind(console)  : noop,
  error: console.error.bind(console), // errors always visible
};

export default logger;
