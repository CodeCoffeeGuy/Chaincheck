/**
 * Memoization Utility
 * Provides function memoization for performance optimization
 */

/**
 * Simple memoization with cache size limit
 * @param {Function} fn - Function to memoize
 * @param {Object} options - Memoization options
 * @param {number} options.maxSize - Maximum cache size (default: 100)
 * @param {Function} options.keyGenerator - Function to generate cache key from arguments
 * @returns {Function} Memoized function
 */
export function memoize(fn, options = {}) {
  const { maxSize = 100, keyGenerator = null } = options;
  const cache = new Map();
  
  const generateKey = keyGenerator || ((...args) => {
    // Simple key generation: JSON.stringify with sorted keys for objects
    return JSON.stringify(args, (key, value) => {
      if (typeof value === "object" && value !== null && !Array.isArray(value)) {
        return Object.keys(value)
          .sort()
          .reduce((sorted, k) => {
            sorted[k] = value[k];
            return sorted;
          }, {});
      }
      return value;
    });
  });
  
  return function memoized(...args) {
    const key = generateKey(...args);
    
    if (cache.has(key)) {
      return cache.get(key);
    }
    
    const result = fn(...args);
    
    // Limit cache size (LRU: remove oldest if at limit)
    if (cache.size >= maxSize) {
      const firstKey = cache.keys().next().value;
      cache.delete(firstKey);
    }
    
    cache.set(key, result);
    return result;
  };
}

/**
 * Memoize async function (caches promises)
 */
export function memoizeAsync(fn, options = {}) {
  const { maxSize = 100, keyGenerator = null, ttl = null } = options;
  const cache = new Map();
  
  const generateKey = keyGenerator || ((...args) => JSON.stringify(args));
  
  return async function memoizedAsync(...args) {
    const key = generateKey(...args);
    const cached = cache.get(key);
    
    // Check if cached and not expired
    if (cached) {
      if (ttl && Date.now() - cached.timestamp > ttl) {
        cache.delete(key);
      } else {
        return cached.value;
      }
    }
    
    // Create and cache promise
    const promise = fn(...args).then(
      (result) => {
        // Update cache with result
        cache.set(key, {
          value: result,
          timestamp: Date.now(),
        });
        
        // Limit cache size
        if (cache.size > maxSize) {
          const firstKey = cache.keys().next().value;
          cache.delete(firstKey);
        }
        
        return result;
      },
      (error) => {
        // Remove from cache on error
        cache.delete(key);
        throw error;
      }
    );
    
    // Cache the promise immediately
    cache.set(key, {
      value: promise,
      timestamp: Date.now(),
    });
    
    return promise;
  };
}

/**
 * Clear memoization cache
 */
export function clearMemoCache(memoizedFn) {
  if (memoizedFn && memoizedFn.cache) {
    memoizedFn.cache.clear();
  }
}

/**
 * Memoize with time-to-live (TTL)
 */
export function memoizeWithTTL(fn, ttlMs, options = {}) {
  const memoized = memoize(fn, options);
  const timestamps = new Map();
  
  const wrapped = function memoizedWithTTL(...args) {
    const key = JSON.stringify(args);
    const timestamp = timestamps.get(key);
    
    // Check if expired
    if (timestamp && Date.now() - timestamp > ttlMs) {
      timestamps.delete(key);
      if (memoized.cache) {
        memoized.cache.delete(key);
      }
    }
    
    const result = memoized(...args);
    
    // Update timestamp
    if (!timestamps.has(key)) {
      timestamps.set(key, Date.now());
    }
    
    return result;
  };
  
  wrapped.cache = memoized.cache;
  wrapped.clear = () => {
    timestamps.clear();
    if (memoized.cache) {
      memoized.cache.clear();
    }
  };
  
  return wrapped;
}

