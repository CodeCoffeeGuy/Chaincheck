/**
 * Object Utilities
 * Provides common object manipulation and processing functions
 */

/**
 * Deep clone object
 * @param {*} obj - Object to clone
 * @returns {*} Cloned object
 */
export function deepClone(obj) {
  if (obj === null || typeof obj !== "object") {
    return obj;
  }
  
  if (obj instanceof Date) {
    return new Date(obj.getTime());
  }
  
  if (obj instanceof Array) {
    return obj.map((item) => deepClone(item));
  }
  
  if (typeof obj === "object") {
    const cloned = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        cloned[key] = deepClone(obj[key]);
      }
    }
    return cloned;
  }
  
  return obj;
}

/**
 * Pick properties from object
 * @param {Object} obj - Object to pick from
 * @param {Array|string} keys - Keys to pick (string or array of strings)
 * @returns {Object} New object with picked properties
 */
export function pick(obj, keys) {
  if (obj === null || typeof obj !== "object") {
    return {};
  }
  
  const keysArray = Array.isArray(keys) ? keys : [keys];
  const result = {};
  
  for (const key of keysArray) {
    if (key in obj) {
      result[key] = obj[key];
    }
  }
  
  return result;
}

/**
 * Omit properties from object
 * @param {Object} obj - Object to omit from
 * @param {Array|string} keys - Keys to omit (string or array of strings)
 * @returns {Object} New object without omitted properties
 */
export function omit(obj, keys) {
  if (obj === null || typeof obj !== "object") {
    return {};
  }
  
  const keysArray = Array.isArray(keys) ? keys : [keys];
  const keysSet = new Set(keysArray);
  const result = {};
  
  for (const key in obj) {
    if (obj.hasOwnProperty(key) && !keysSet.has(key)) {
      result[key] = obj[key];
    }
  }
  
  return result;
}

/**
 * Merge objects deeply
 * @param {Object} target - Target object
 * @param {...Object} sources - Source objects to merge
 * @returns {Object} Merged object
 */
export function merge(target, ...sources) {
  if (target === null || typeof target !== "object") {
    target = {};
  }
  
  for (const source of sources) {
    if (source === null || typeof source !== "object") {
      continue;
    }
    
    for (const key in source) {
      if (source.hasOwnProperty(key)) {
        if (
          typeof source[key] === "object" &&
          source[key] !== null &&
          !Array.isArray(source[key]) &&
          typeof target[key] === "object" &&
          target[key] !== null &&
          !Array.isArray(target[key])
        ) {
          // Deep merge objects
          target[key] = merge({}, target[key], source[key]);
        } else {
          // Overwrite with source value
          target[key] = source[key];
        }
      }
    }
  }
  
  return target;
}

/**
 * Check if object is empty
 * @param {Object} obj - Object to check
 * @returns {boolean} True if object is empty
 */
export function isEmpty(obj) {
  if (obj === null || typeof obj !== "object") {
    return true;
  }
  
  if (Array.isArray(obj)) {
    return obj.length === 0;
  }
  
  return Object.keys(obj).length === 0;
}

/**
 * Get object keys as array
 * @param {Object} obj - Object to get keys from
 * @returns {Array} Array of keys
 */
export function keys(obj) {
  if (obj === null || typeof obj !== "object") {
    return [];
  }
  
  return Object.keys(obj);
}

/**
 * Get object values as array
 * @param {Object} obj - Object to get values from
 * @returns {Array} Array of values
 */
export function values(obj) {
  if (obj === null || typeof obj !== "object") {
    return [];
  }
  
  return Object.values(obj);
}

/**
 * Get object entries as array of [key, value] pairs
 * @param {Object} obj - Object to get entries from
 * @returns {Array} Array of [key, value] pairs
 */
export function entries(obj) {
  if (obj === null || typeof obj !== "object") {
    return [];
  }
  
  return Object.entries(obj);
}

/**
 * Invert object (swap keys and values)
 * @param {Object} obj - Object to invert
 * @returns {Object} Inverted object
 */
export function invert(obj) {
  if (obj === null || typeof obj !== "object") {
    return {};
  }
  
  const result = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const value = obj[key];
      // Only use string/number values as keys
      if (typeof value === "string" || typeof value === "number") {
        result[value] = key;
      }
    }
  }
  return result;
}

/**
 * Map object values
 * @param {Object} obj - Object to map
 * @param {Function} fn - Mapping function (value, key, object) => newValue
 * @returns {Object} New object with mapped values
 */
export function mapValues(obj, fn) {
  if (obj === null || typeof obj !== "object" || typeof fn !== "function") {
    return {};
  }
  
  const result = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      result[key] = fn(obj[key], key, obj);
    }
  }
  return result;
}

/**
 * Map object keys
 * @param {Object} obj - Object to map
 * @param {Function} fn - Mapping function (key, value, object) => newKey
 * @returns {Object} New object with mapped keys
 */
export function mapKeys(obj, fn) {
  if (obj === null || typeof obj !== "object" || typeof fn !== "function") {
    return {};
  }
  
  const result = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const newKey = fn(key, obj[key], obj);
      result[newKey] = obj[key];
    }
  }
  return result;
}

/**
 * Filter object by predicate
 * @param {Object} obj - Object to filter
 * @param {Function} predicate - Filter function (value, key, object) => boolean
 * @returns {Object} New object with filtered properties
 */
export function filter(obj, predicate) {
  if (obj === null || typeof obj !== "object" || typeof predicate !== "function") {
    return {};
  }
  
  const result = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (predicate(obj[key], key, obj)) {
        result[key] = obj[key];
      }
    }
  }
  return result;
}

/**
 * Get nested property value by path
 * @param {Object} obj - Object to get value from
 * @param {string|Array} path - Property path (e.g., "user.name" or ["user", "name"])
 * @param {*} defaultValue - Default value if path doesn't exist
 * @returns {*} Property value or default
 */
export function get(obj, path, defaultValue = undefined) {
  if (obj === null || typeof obj !== "object") {
    return defaultValue;
  }
  
  const keys = Array.isArray(path) ? path : path.split(".");
  let result = obj;
  
  for (const key of keys) {
    if (result === null || result === undefined || typeof result !== "object") {
      return defaultValue;
    }
    result = result[key];
    if (result === undefined) {
      return defaultValue;
    }
  }
  
  return result;
}

/**
 * Set nested property value by path
 * @param {Object} obj - Object to set value in
 * @param {string|Array} path - Property path
 * @param {*} value - Value to set
 * @returns {Object} Modified object
 */
export function set(obj, path, value) {
  if (obj === null || typeof obj !== "object") {
    return obj;
  }
  
  const keys = Array.isArray(path) ? path : path.split(".");
  const lastKey = keys.pop();
  let current = obj;
  
  for (const key of keys) {
    if (current[key] === null || current[key] === undefined || typeof current[key] !== "object") {
      current[key] = {};
    }
    current = current[key];
  }
  
  current[lastKey] = value;
  return obj;
}

/**
 * Check if object has nested property
 * @param {Object} obj - Object to check
 * @param {string|Array} path - Property path
 * @returns {boolean} True if path exists
 */
export function has(obj, path) {
  if (obj === null || typeof obj !== "object") {
    return false;
  }
  
  const keys = Array.isArray(path) ? path : path.split(".");
  let current = obj;
  
  for (const key of keys) {
    if (current === null || current === undefined || typeof current !== "object") {
      return false;
    }
    if (!(key in current)) {
      return false;
    }
    current = current[key];
  }
  
  return true;
}

/**
 * Flatten nested object
 * @param {Object} obj - Object to flatten
 * @param {string} separator - Separator for keys (default: ".")
 * @param {number} maxDepth - Maximum depth to flatten (default: Infinity)
 * @returns {Object} Flattened object
 */
export function flatten(obj, separator = ".", maxDepth = Infinity) {
  if (obj === null || typeof obj !== "object") {
    return obj;
  }
  
  const result = {};
  
  function flattenRecursive(current, prefix = "", depth = 0) {
    if (depth > maxDepth) {
      result[prefix] = current;
      return;
    }
    
    if (current === null || typeof current !== "object" || Array.isArray(current)) {
      result[prefix] = current;
      return;
    }
    
    for (const key in current) {
      if (current.hasOwnProperty(key)) {
        const newKey = prefix ? `${prefix}${separator}${key}` : key;
        flattenRecursive(current[key], newKey, depth + 1);
      }
    }
  }
  
  flattenRecursive(obj);
  return result;
}

/**
 * Check if two objects are deeply equal
 * @param {*} obj1 - First object
 * @param {*} obj2 - Second object
 * @returns {boolean} True if objects are deeply equal
 */
export function isEqual(obj1, obj2) {
  if (obj1 === obj2) {
    return true;
  }
  
  if (obj1 === null || obj2 === null) {
    return obj1 === obj2;
  }
  
  if (typeof obj1 !== typeof obj2) {
    return false;
  }
  
  if (typeof obj1 !== "object") {
    return obj1 === obj2;
  }
  
  if (Array.isArray(obj1) !== Array.isArray(obj2)) {
    return false;
  }
  
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  
  if (keys1.length !== keys2.length) {
    return false;
  }
  
  for (const key of keys1) {
    if (!keys2.includes(key)) {
      return false;
    }
    if (!isEqual(obj1[key], obj2[key])) {
      return false;
    }
  }
  
  return true;
}

