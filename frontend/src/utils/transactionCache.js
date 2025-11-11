/**
 * Transaction History Caching Utility
 * Caches verification results for faster access and offline support
 */

const CACHE_KEY = "chaincheck_verification_cache";
const CACHE_EXPIRY = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
const MAX_CACHE_SIZE = 1000; // Maximum number of cached verifications

/**
 * Get all cached verifications
 * @returns {Array} Array of cached verifications
 */
export function getCachedVerifications() {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return [];

    const verifications = JSON.parse(cached);
    const now = Date.now();

    // Filter out expired entries
    const valid = verifications.filter((v) => now - v.cachedAt < CACHE_EXPIRY);

    // Update cache if entries were removed
    if (valid.length !== verifications.length) {
      saveCachedVerifications(valid);
    }

    return valid;
  } catch (error) {
    console.error("Error reading verification cache:", error);
    return [];
  }
}

/**
 * Save cached verifications
 * @param {Array} verifications - Array of verifications to save
 */
function saveCachedVerifications(verifications) {
  try {
    // Limit cache size
    const limited = verifications.slice(-MAX_CACHE_SIZE);
    localStorage.setItem(CACHE_KEY, JSON.stringify(limited));
  } catch (error) {
    console.error("Error saving verification cache:", error);
  }
}

/**
 * Add verification to cache
 * @param {Object} verification - Verification object (without cachedAt)
 * @param {string} verification.serialHash - Serial hash
 * @param {number} verification.batchId - Batch ID
 * @param {string} verification.serialNumber - Serial number
 * @param {boolean} verification.isAuthentic - Whether product is authentic
 * @param {string} verification.verifier - Verifier address
 * @param {number} verification.timestamp - Timestamp
 * @param {string} verification.txHash - Transaction hash
 * @param {number} [verification.blockNumber] - Block number
 * @param {string} [verification.productName] - Product name
 * @param {string} [verification.productBrand] - Product brand
 */
export function addCachedVerification(verification) {
  try {
    const cached = getCachedVerifications();
    const now = Date.now();

    // Remove duplicate if exists (same serialHash)
    const filtered = cached.filter((v) => v.serialHash !== verification.serialHash);

    // Add new verification
    const newVerification = {
      ...verification,
      cachedAt: now,
    };

    // Add to beginning and limit size
    const updated = [newVerification, ...filtered].slice(0, MAX_CACHE_SIZE);
    saveCachedVerifications(updated);
  } catch (error) {
    console.error("Error adding verification to cache:", error);
  }
}

/**
 * Get cached verification by serial hash
 * @param {string} serialHash - Serial hash to look up
 * @returns {Object|null} Cached verification or null if not found
 */
export function getCachedVerification(serialHash) {
  try {
    const cached = getCachedVerifications();
    const verification = cached.find((v) => v.serialHash === serialHash);

    if (verification) {
      return verification;
    }

    return null;
  } catch (error) {
    console.error("Error getting cached verification:", error);
    return null;
  }
}

/**
 * Clear all cached verifications
 */
export function clearVerificationCache() {
  try {
    localStorage.removeItem(CACHE_KEY);
  } catch (error) {
    console.error("Error clearing verification cache:", error);
  }
}

/**
 * Get cache statistics
 * @returns {Object} Cache statistics
 * @returns {number} returns.total - Total number of cached items
 * @returns {number} returns.size - Cache size in bytes
 * @returns {number|null} returns.oldest - Oldest cache timestamp
 * @returns {number|null} returns.newest - Newest cache timestamp
 */
export function getCacheStats() {
  try {
    const cached = getCachedVerifications();
    if (cached.length === 0) {
      return {
        total: 0,
        size: 0,
        oldest: null,
        newest: null,
      };
    }

    const timestamps = cached.map((v) => v.cachedAt);
    const size = new Blob([JSON.stringify(cached)]).size;

    return {
      total: cached.length,
      size: size,
      oldest: Math.min(...timestamps),
      newest: Math.max(...timestamps),
    };
  } catch (error) {
    console.error("Error getting cache stats:", error);
    return {
      total: 0,
      size: 0,
      oldest: null,
      newest: null,
    };
  }
}

