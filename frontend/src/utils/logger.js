/**
 * Logging Utility
 * Centralized logging with levels and production mode support
 */

const LOG_LEVELS = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
  NONE: 4,
};

const isDevelopment = import.meta.env.DEV || import.meta.env.MODE === "development";
const isProduction = import.meta.env.PROD || import.meta.env.MODE === "production";

// Determine log level based on environment
const currentLogLevel = isDevelopment ? LOG_LEVELS.DEBUG : LOG_LEVELS.ERROR;

/**
 * Check if log level should be displayed
 */
function shouldLog(level) {
  return level >= currentLogLevel;
}

/**
 * Format log message with timestamp and level
 */
function formatLogMessage(level, message, ...args) {
  const timestamp = new Date().toISOString();
  const levelName = Object.keys(LOG_LEVELS).find(
    (key) => LOG_LEVELS[key] === level
  );
  
  return [`[${timestamp}] [${levelName}]`, message, ...args];
}

/**
 * Debug log (only in development)
 */
export function debug(message, ...args) {
  if (shouldLog(LOG_LEVELS.DEBUG)) {
    console.debug(...formatLogMessage(LOG_LEVELS.DEBUG, message, ...args));
  }
}

/**
 * Info log
 */
export function info(message, ...args) {
  if (shouldLog(LOG_LEVELS.INFO)) {
    console.info(...formatLogMessage(LOG_LEVELS.INFO, message, ...args));
  }
}

/**
 * Warning log
 */
export function warn(message, ...args) {
  if (shouldLog(LOG_LEVELS.WARN)) {
    console.warn(...formatLogMessage(LOG_LEVELS.WARN, message, ...args));
  }
}

/**
 * Error log
 */
export function error(message, ...args) {
  if (shouldLog(LOG_LEVELS.ERROR)) {
    console.error(...formatLogMessage(LOG_LEVELS.ERROR, message, ...args));
  }
}

/**
 * Log error with context
 */
export function logError(error, context = {}) {
  const errorMessage = error instanceof Error ? error.message : String(error);
  const errorStack = error instanceof Error ? error.stack : undefined;
  
  error("Error occurred:", errorMessage, {
    context,
    stack: errorStack,
    error,
  });
}

/**
 * Log performance metric
 */
export function logPerformance(label, startTime) {
  if (shouldLog(LOG_LEVELS.DEBUG)) {
    const duration = performance.now() - startTime;
    debug(`Performance [${label}]: ${duration.toFixed(2)}ms`);
  }
}

/**
 * Create performance timer
 */
export function createTimer(label) {
  const startTime = performance.now();
  
  return {
    end() {
      logPerformance(label, startTime);
      return performance.now() - startTime;
    },
  };
}

/**
 * Group logs (only in development)
 */
export function group(label, callback) {
  if (shouldLog(LOG_LEVELS.DEBUG)) {
    console.group(label);
    try {
      callback();
    } finally {
      console.groupEnd();
    }
  } else {
    callback();
  }
}

/**
 * Table log (only in development)
 */
export function table(data) {
  if (shouldLog(LOG_LEVELS.DEBUG)) {
    console.table(data);
  }
}

export default {
  debug,
  info,
  warn,
  error,
  logError,
  logPerformance,
  createTimer,
  group,
  table,
};

