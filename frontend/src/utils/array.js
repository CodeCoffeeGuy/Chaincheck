/**
 * Array Utilities
 * Provides common array manipulation and processing functions
 */

/**
 * Chunk array into smaller arrays of specified size
 * @param {Array} array - Array to chunk
 * @param {number} size - Size of each chunk
 * @returns {Array} Array of chunks
 */
export function chunk(array, size = 1) {
  if (!Array.isArray(array) || size < 1) {
    return [];
  }
  
  const chunks = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

/**
 * Get unique values from array
 * @param {Array} array - Array to get unique values from
 * @returns {Array} Array of unique values
 */
export function unique(array) {
  if (!Array.isArray(array)) {
    return [];
  }
  
  return [...new Set(array)];
}

/**
 * Get unique values by key (for array of objects)
 * @param {Array} array - Array of objects
 * @param {string|Function} keyOrFn - Key to compare or function to extract value
 * @returns {Array} Array of unique objects
 */
export function uniqueBy(array, keyOrFn) {
  if (!Array.isArray(array)) {
    return [];
  }
  
  const seen = new Set();
  const getKey = typeof keyOrFn === "function" ? keyOrFn : (item) => item[keyOrFn];
  
  return array.filter((item) => {
    const key = getKey(item);
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

/**
 * Group array by key or function
 * @param {Array} array - Array to group
 * @param {string|Function} keyOrFn - Key to group by or function to extract key
 * @returns {Object} Object with grouped arrays
 */
export function groupBy(array, keyOrFn) {
  if (!Array.isArray(array)) {
    return {};
  }
  
  const getKey = typeof keyOrFn === "function" ? keyOrFn : (item) => item[keyOrFn];
  
  return array.reduce((groups, item) => {
    const key = getKey(item);
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(item);
    return groups;
  }, {});
}

/**
 * Sort array by key or function
 * @param {Array} array - Array to sort
 * @param {string|Function} keyOrFn - Key to sort by or function to extract value
 * @param {boolean} descending - Sort descending if true (default: false)
 * @returns {Array} Sorted array (new array, original not modified)
 */
export function sortBy(array, keyOrFn, descending = false) {
  if (!Array.isArray(array)) {
    return [];
  }
  
  const getValue = typeof keyOrFn === "function" ? keyOrFn : (item) => item[keyOrFn];
  const sorted = [...array].sort((a, b) => {
    const aVal = getValue(a);
    const bVal = getValue(b);
    
    if (aVal < bVal) return descending ? 1 : -1;
    if (aVal > bVal) return descending ? -1 : 1;
    return 0;
  });
  
  return sorted;
}

/**
 * Flatten nested array
 * @param {Array} array - Array to flatten
 * @param {number} depth - Flattening depth (default: 1, use Infinity for full flatten)
 * @returns {Array} Flattened array
 */
export function flatten(array, depth = 1) {
  if (!Array.isArray(array)) {
    return [];
  }
  
  if (depth === Infinity) {
    return array.flat(Infinity);
  }
  
  return array.flat(depth);
}

/**
 * Remove falsy values from array
 * @param {Array} array - Array to compact
 * @returns {Array} Array without falsy values
 */
export function compact(array) {
  if (!Array.isArray(array)) {
    return [];
  }
  
  return array.filter(Boolean);
}

/**
 * Get difference between two arrays
 * @param {Array} array1 - First array
 * @param {Array} array2 - Second array
 * @returns {Array} Items in array1 but not in array2
 */
export function difference(array1, array2) {
  if (!Array.isArray(array1)) {
    return [];
  }
  if (!Array.isArray(array2)) {
    return array1;
  }
  
  const set2 = new Set(array2);
  return array1.filter((item) => !set2.has(item));
}

/**
 * Get intersection of two arrays
 * @param {Array} array1 - First array
 * @param {Array} array2 - Second array
 * @returns {Array} Items in both arrays
 */
export function intersection(array1, array2) {
  if (!Array.isArray(array1) || !Array.isArray(array2)) {
    return [];
  }
  
  const set2 = new Set(array2);
  return array1.filter((item) => set2.has(item));
}

/**
 * Get union of two arrays (unique items from both)
 * @param {Array} array1 - First array
 * @param {Array} array2 - Second array
 * @returns {Array} Unique items from both arrays
 */
export function union(array1, array2) {
  if (!Array.isArray(array1) && !Array.isArray(array2)) {
    return [];
  }
  if (!Array.isArray(array1)) {
    return unique(array2);
  }
  if (!Array.isArray(array2)) {
    return unique(array1);
  }
  
  return unique([...array1, ...array2]);
}

/**
 * Shuffle array (Fisher-Yates algorithm)
 * @param {Array} array - Array to shuffle
 * @returns {Array} Shuffled array (new array, original not modified)
 */
export function shuffle(array) {
  if (!Array.isArray(array)) {
    return [];
  }
  
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Get random item from array
 * @param {Array} array - Array to get random item from
 * @returns {*} Random item or undefined if array is empty
 */
export function randomItem(array) {
  if (!Array.isArray(array) || array.length === 0) {
    return undefined;
  }
  
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * Get random items from array
 * @param {Array} array - Array to get random items from
 * @param {number} count - Number of items to get
 * @returns {Array} Array of random items
 */
export function randomItems(array, count = 1) {
  if (!Array.isArray(array) || array.length === 0 || count < 1) {
    return [];
  }
  
  const shuffled = shuffle(array);
  return shuffled.slice(0, Math.min(count, array.length));
}

/**
 * Partition array into two arrays based on predicate
 * @param {Array} array - Array to partition
 * @param {Function} predicate - Function to test each item
 * @returns {Array} [truthy items, falsy items]
 */
export function partition(array, predicate) {
  if (!Array.isArray(array)) {
    return [[], []];
  }
  
  if (typeof predicate !== "function") {
    return [array, []];
  }
  
  return array.reduce(
    (acc, item) => {
      acc[predicate(item) ? 0 : 1].push(item);
      return acc;
    },
    [[], []]
  );
}

/**
 * Remove items from array
 * @param {Array} array - Array to remove items from
 * @param {*} items - Item or array of items to remove
 * @returns {Array} New array without removed items
 */
export function remove(array, items) {
  if (!Array.isArray(array)) {
    return [];
  }
  
  const itemsToRemove = Array.isArray(items) ? items : [items];
  const set = new Set(itemsToRemove);
  return array.filter((item) => !set.has(item));
}

/**
 * Get last item from array
 * @param {Array} array - Array to get last item from
 * @returns {*} Last item or undefined
 */
export function last(array) {
  if (!Array.isArray(array) || array.length === 0) {
    return undefined;
  }
  
  return array[array.length - 1];
}

/**
 * Get first item from array
 * @param {Array} array - Array to get first item from
 * @returns {*} First item or undefined
 */
export function first(array) {
  if (!Array.isArray(array) || array.length === 0) {
    return undefined;
  }
  
  return array[0];
}

/**
 * Sum array of numbers
 * @param {Array} array - Array of numbers
 * @returns {number} Sum of numbers
 */
export function sum(array) {
  if (!Array.isArray(array)) {
    return 0;
  }
  
  return array.reduce((acc, num) => acc + (Number(num) || 0), 0);
}

/**
 * Get average of array of numbers
 * @param {Array} array - Array of numbers
 * @returns {number} Average of numbers
 */
export function average(array) {
  if (!Array.isArray(array) || array.length === 0) {
    return 0;
  }
  
  return sum(array) / array.length;
}

/**
 * Get maximum value from array
 * @param {Array} array - Array of numbers
 * @returns {number} Maximum value
 */
export function max(array) {
  if (!Array.isArray(array) || array.length === 0) {
    return undefined;
  }
  
  return Math.max(...array.map(Number).filter((n) => !isNaN(n)));
}

/**
 * Get minimum value from array
 * @param {Array} array - Array of numbers
 * @returns {number} Minimum value
 */
export function min(array) {
  if (!Array.isArray(array) || array.length === 0) {
    return undefined;
  }
  
  return Math.min(...array.map(Number).filter((n) => !isNaN(n)));
}

