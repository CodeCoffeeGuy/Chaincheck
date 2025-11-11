/**
 * String Utilities
 * Provides common string manipulation and formatting functions
 */

/**
 * Truncate string to specified length with ellipsis
 * @param {string} str - String to truncate
 * @param {number} maxLength - Maximum length
 * @param {string} suffix - Suffix to add (default: "...")
 * @returns {string} Truncated string
 */
export function truncate(str, maxLength = 50, suffix = "...") {
  if (typeof str !== "string") {
    return "";
  }
  
  if (str.length <= maxLength) {
    return str;
  }
  
  return str.slice(0, maxLength - suffix.length) + suffix;
}

/**
 * Truncate string in the middle (useful for addresses/hashes)
 * @param {string} str - String to truncate
 * @param {number} startLength - Characters to show at start
 * @param {number} endLength - Characters to show at end
 * @param {string} separator - Separator (default: "...")
 * @returns {string} Truncated string
 */
export function truncateMiddle(str, startLength = 6, endLength = 4, separator = "...") {
  if (typeof str !== "string") {
    return "";
  }
  
  if (str.length <= startLength + endLength) {
    return str;
  }
  
  return str.slice(0, startLength) + separator + str.slice(-endLength);
}

/**
 * Capitalize first letter of string
 * @param {string} str - String to capitalize
 * @returns {string} Capitalized string
 */
export function capitalize(str) {
  if (typeof str !== "string" || str.length === 0) {
    return "";
  }
  
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Capitalize first letter of each word
 * @param {string} str - String to capitalize
 * @returns {string} Title case string
 */
export function titleCase(str) {
  if (typeof str !== "string" || str.length === 0) {
    return "";
  }
  
  return str
    .toLowerCase()
    .split(/\s+/)
    .map((word) => capitalize(word))
    .join(" ");
}

/**
 * Convert string to slug (URL-friendly)
 * @param {string} str - String to slugify
 * @returns {string} Slug string
 */
export function slugify(str) {
  if (typeof str !== "string") {
    return "";
  }
  
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/[\s_-]+/g, "-") // Replace spaces/underscores with hyphens
    .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
}

/**
 * Escape HTML special characters
 * @param {string} str - String to escape
 * @returns {string} Escaped string
 */
export function escapeHtml(str) {
  if (typeof str !== "string") {
    return "";
  }
  
  const map = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  
  return str.replace(/[&<>"']/g, (char) => map[char]);
}

/**
 * Unescape HTML entities
 * @param {string} str - String to unescape
 * @returns {string} Unescaped string
 */
export function unescapeHtml(str) {
  if (typeof str !== "string") {
    return "";
  }
  
  const map = {
    "&amp;": "&",
    "&lt;": "<",
    "&gt;": ">",
    "&quot;": '"',
    "&#039;": "'",
    "&#39;": "'",
  };
  
  return str.replace(/&(amp|lt|gt|quot|#039|#39);/g, (match) => map[match] || match);
}

/**
 * Remove whitespace from string
 * @param {string} str - String to trim
 * @returns {string} Trimmed string
 */
export function trim(str) {
  if (typeof str !== "string") {
    return "";
  }
  
  return str.trim();
}

/**
 * Remove all whitespace from string
 * @param {string} str - String to process
 * @returns {string} String without whitespace
 */
export function removeWhitespace(str) {
  if (typeof str !== "string") {
    return "";
  }
  
  return str.replace(/\s+/g, "");
}

/**
 * Pad string to specified length
 * @param {string} str - String to pad
 * @param {number} length - Target length
 * @param {string} padString - String to pad with (default: " ")
 * @param {boolean} padStart - Pad at start if true, end if false (default: true)
 * @returns {string} Padded string
 */
export function pad(str, length, padString = " ", padStart = true) {
  if (typeof str !== "string") {
    str = String(str);
  }
  
  if (str.length >= length) {
    return str;
  }
  
  const padding = padString.repeat(length - str.length).slice(0, length - str.length);
  return padStart ? padding + str : str + padding;
}

/**
 * Check if string starts with substring
 * @param {string} str - String to check
 * @param {string} searchString - Substring to search for
 * @param {number} position - Position to start search (default: 0)
 * @returns {boolean} True if string starts with substring
 */
export function startsWith(str, searchString, position = 0) {
  if (typeof str !== "string" || typeof searchString !== "string") {
    return false;
  }
  
  return str.startsWith(searchString, position);
}

/**
 * Check if string ends with substring
 * @param {string} str - String to check
 * @param {string} searchString - Substring to search for
 * @param {number} length - Length to search from end (default: str.length)
 * @returns {boolean} True if string ends with substring
 */
export function endsWith(str, searchString, length = str?.length) {
  if (typeof str !== "string" || typeof searchString !== "string") {
    return false;
  }
  
  return str.endsWith(searchString, length);
}

/**
 * Replace all occurrences of substring
 * @param {string} str - String to process
 * @param {string} search - Substring to replace
 * @param {string} replace - Replacement string
 * @returns {string} String with replacements
 */
export function replaceAll(str, search, replace) {
  if (typeof str !== "string") {
    return "";
  }
  
  return str.split(search).join(replace);
}

/**
 * Extract numbers from string
 * @param {string} str - String to extract numbers from
 * @returns {number[]} Array of numbers found
 */
export function extractNumbers(str) {
  if (typeof str !== "string") {
    return [];
  }
  
  const matches = str.match(/\d+/g);
  return matches ? matches.map(Number) : [];
}

/**
 * Check if string is empty or only whitespace
 * @param {string} str - String to check
 * @returns {boolean} True if empty or whitespace only
 */
export function isEmpty(str) {
  if (typeof str !== "string") {
    return true;
  }
  
  return str.trim().length === 0;
}

/**
 * Count words in string
 * @param {string} str - String to count words in
 * @returns {number} Word count
 */
export function wordCount(str) {
  if (typeof str !== "string" || str.trim().length === 0) {
    return 0;
  }
  
  return str.trim().split(/\s+/).length;
}

/**
 * Reverse string
 * @param {string} str - String to reverse
 * @returns {string} Reversed string
 */
export function reverse(str) {
  if (typeof str !== "string") {
    return "";
  }
  
  return str.split("").reverse().join("");
}

/**
 * Generate random string
 * @param {number} length - Length of random string
 * @param {string} chars - Character set to use (default: alphanumeric)
 * @returns {string} Random string
 */
export function randomString(length = 10, chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789") {
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

