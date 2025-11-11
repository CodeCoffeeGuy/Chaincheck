/**
 * Debounce and Throttle Utilities
 * Provides function rate limiting for performance optimization
 */

/**
 * Debounce function - delays execution until after wait time has passed since last invocation
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @param {boolean} immediate - If true, trigger on leading edge instead of trailing
 * @returns {Function} Debounced function
 */
export function debounce(func, wait, immediate = false) {
  if (typeof func !== "function") {
    throw new TypeError("Expected a function");
  }
  
  if (typeof wait !== "number" || wait < 0) {
    throw new TypeError("Wait must be a non-negative number");
  }
  
  let timeout = null;
  let result;
  
  const debounced = function debouncedFunction(...args) {
    const callNow = immediate && !timeout;
    
    const later = () => {
      timeout = null;
      if (!immediate) {
        result = func.apply(this, args);
      }
    };
    
    if (timeout) {
      clearTimeout(timeout);
    }
    
    timeout = setTimeout(later, wait);
    
    if (callNow) {
      result = func.apply(this, args);
    }
    
    return result;
  };
  
  // Add cancel method
  debounced.cancel = () => {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
  };
  
  // Add flush method (execute immediately)
  debounced.flush = () => {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
      result = func.apply(this, arguments);
    }
    return result;
  };
  
  return debounced;
}

/**
 * Throttle function - limits execution to at most once per wait time
 * @param {Function} func - Function to throttle
 * @param {number} wait - Wait time in milliseconds
 * @param {Object} options - Throttle options
 * @param {boolean} options.leading - Execute on leading edge (default: true)
 * @param {boolean} options.trailing - Execute on trailing edge (default: true)
 * @returns {Function} Throttled function
 */
export function throttle(func, wait, options = {}) {
  if (typeof func !== "function") {
    throw new TypeError("Expected a function");
  }
  
  if (typeof wait !== "number" || wait < 0) {
    throw new TypeError("Wait must be a non-negative number");
  }
  
  const { leading = true, trailing = true } = options;
  let timeout = null;
  let previous = 0;
  let result;
  
  const throttled = function throttledFunction(...args) {
    const now = Date.now();
    
    if (!previous && !leading) {
      previous = now;
    }
    
    const remaining = wait - (now - previous);
    
    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = now;
      result = func.apply(this, args);
    } else if (!timeout && trailing) {
      timeout = setTimeout(() => {
        previous = leading ? Date.now() : 0;
        timeout = null;
        result = func.apply(this, args);
      }, remaining);
    }
    
    return result;
  };
  
  // Add cancel method
  throttled.cancel = () => {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
    previous = 0;
  };
  
  // Add flush method
  throttled.flush = () => {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
      previous = Date.now();
      result = func.apply(this, arguments);
    }
    return result;
  };
  
  return throttled;
}

/**
 * Request animation frame throttle (for scroll/resize handlers)
 */
export function rafThrottle(func) {
  let rafId = null;
  let lastArgs = null;
  
  const throttled = function throttledFunction(...args) {
    lastArgs = args;
    
    if (rafId === null) {
      rafId = requestAnimationFrame(() => {
        rafId = null;
        func.apply(this, lastArgs);
      });
    }
  };
  
  throttled.cancel = () => {
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  };
  
  return throttled;
}

