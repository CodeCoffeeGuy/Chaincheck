/**
 * Retry Utility
 * Provides retry logic for async operations with exponential backoff
 */

/**
 * Retry an async function with exponential backoff
 * @param {Function} fn - Async function to retry
 * @param {Object} options - Retry options
 * @param {number} options.maxAttempts - Maximum number of attempts (default: 3)
 * @param {number} options.delay - Initial delay in milliseconds (default: 1000)
 * @param {number} options.maxDelay - Maximum delay in milliseconds (default: 10000)
 * @param {number} options.factor - Exponential backoff factor (default: 2)
 * @param {Function} options.shouldRetry - Function to determine if error should be retried
 * @param {Function} options.onRetry - Callback called before each retry
 * @returns {Promise} Promise that resolves with the result or rejects after max attempts
 */
export async function retry(fn, options = {}) {
  const {
    maxAttempts = 3,
    delay = 1000,
    maxDelay = 10000,
    factor = 2,
    shouldRetry = () => true,
    onRetry = null,
  } = options;
  
  let lastError;
  let currentDelay = delay;
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      // Check if we should retry this error
      if (!shouldRetry(error, attempt)) {
        throw error;
      }
      
      // Don't retry on last attempt
      if (attempt === maxAttempts) {
        break;
      }
      
      // Call onRetry callback if provided
      if (onRetry) {
        onRetry(error, attempt, currentDelay);
      }
      
      // Wait before retrying
      await sleep(currentDelay);
      
      // Calculate next delay with exponential backoff
      currentDelay = Math.min(currentDelay * factor, maxDelay);
    }
  }
  
  throw lastError;
}

/**
 * Sleep utility
 */
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Retry with fixed delay (no exponential backoff)
 */
export async function retryFixed(fn, maxAttempts = 3, delay = 1000) {
  return retry(fn, {
    maxAttempts,
    delay,
    factor: 1, // No exponential backoff
  });
}

/**
 * Retry with immediate retry (no delay)
 */
export async function retryImmediate(fn, maxAttempts = 3) {
  return retry(fn, {
    maxAttempts,
    delay: 0,
    factor: 1,
  });
}

/**
 * Retry only on specific error types
 */
export function retryOnError(fn, errorTypes, options = {}) {
  const shouldRetry = (error) => {
    const errorMessage = error?.message?.toLowerCase() || "";
    return errorTypes.some((type) => errorMessage.includes(type.toLowerCase()));
  };
  
  return retry(fn, { ...options, shouldRetry });
}

/**
 * Retry with timeout
 */
export async function retryWithTimeout(fn, timeoutMs, options = {}) {
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => reject(new Error("Operation timed out")), timeoutMs);
  });
  
  const fnWithTimeout = async () => {
    return Promise.race([fn(), timeoutPromise]);
  };
  
  return retry(fnWithTimeout, options);
}

