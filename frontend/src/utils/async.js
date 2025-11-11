/**
 * Async Utilities
 * Provides utilities for working with async operations
 */

/**
 * Delay execution for specified milliseconds
 */
export function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Timeout wrapper for promises
 */
export function timeout(promise, ms, errorMessage = "Operation timed out") {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error(errorMessage)), ms)
    ),
  ]);
}

/**
 * Execute promises in parallel with concurrency limit
 */
export async function parallelLimit(tasks, limit = 5) {
  const results = [];
  const executing = [];
  
  for (const task of tasks) {
    const promise = Promise.resolve(task()).then((result) => {
      executing.splice(executing.indexOf(promise), 1);
      return result;
    });
    
    results.push(promise);
    executing.push(promise);
    
    if (executing.length >= limit) {
      await Promise.race(executing);
    }
  }
  
  return Promise.all(results);
}

/**
 * Retry failed promises with exponential backoff
 */
export async function retryPromise(fn, maxAttempts = 3, delayMs = 1000) {
  let lastError;
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (attempt < maxAttempts) {
        await delay(delayMs * Math.pow(2, attempt - 1));
      }
    }
  }
  
  throw lastError;
}

/**
 * Batch process items with async function
 */
export async function batchProcess(items, processor, batchSize = 10) {
  const results = [];
  
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const batchResults = await Promise.all(batch.map(processor));
    results.push(...batchResults);
  }
  
  return results;
}

/**
 * Debounce async function
 */
export function debounceAsync(fn, wait) {
  let timeout;
  let latestArgs;
  let latestResolve;
  let latestReject;
  
  return function debounced(...args) {
    return new Promise((resolve, reject) => {
      latestArgs = args;
      latestResolve = resolve;
      latestReject = reject;
      
      clearTimeout(timeout);
      timeout = setTimeout(async () => {
        try {
          const result = await fn(...latestArgs);
          latestResolve(result);
        } catch (error) {
          latestReject(error);
        }
      }, wait);
    });
  };
}

/**
 * Create a promise that can be cancelled
 */
export function cancellable(promise) {
  let cancelled = false;
  
  const wrappedPromise = promise.then(
    (value) => {
      if (cancelled) {
        throw new Error("Promise was cancelled");
      }
      return value;
    },
    (error) => {
      if (cancelled) {
        throw new Error("Promise was cancelled");
      }
      throw error;
    }
  );
  
  wrappedPromise.cancel = () => {
    cancelled = true;
  };
  
  return wrappedPromise;
}

/**
 * Wait for condition to be true
 */
export async function waitFor(condition, timeoutMs = 5000, intervalMs = 100) {
  const startTime = Date.now();
  
  while (Date.now() - startTime < timeoutMs) {
    if (await condition()) {
      return true;
    }
    await delay(intervalMs);
  }
  
  throw new Error("Condition timeout");
}

/**
 * Execute async function with progress callback
 */
export async function withProgress(fn, onProgress) {
  let progress = 0;
  
  const updateProgress = (value) => {
    progress = Math.max(0, Math.min(100, value));
    onProgress(progress);
  };
  
  try {
    const result = await fn(updateProgress);
    updateProgress(100);
    return result;
  } catch (error) {
    updateProgress(0);
    throw error;
  }
}

