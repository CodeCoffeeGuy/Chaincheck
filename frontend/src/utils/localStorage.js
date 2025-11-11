/**
 * LocalStorage Utility Functions
 * Handles saving and retrieving data from localStorage with error handling and quota management
 */

// Note: Using console for now to avoid circular dependencies
// import { StorageError } from "./errors.js";
// import logger from "./logger.js";

// Temporary logger until we can properly import
const logger = {
  warn: console.warn.bind(console),
  error: console.error.bind(console),
};

const STORAGE_KEYS = {
  VERIFICATION_HISTORY_FORM: "chaincheck_verification_history_form",
  RECENT_SEARCHES: "chaincheck_recent_searches",
  MANUFACTURER_FORM: "chaincheck_manufacturer_form",
};

/**
 * Check if localStorage is available
 */
export function isLocalStorageAvailable() {
  try {
    const test = "__localStorage_test__";
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}

/**
 * Get storage quota information (if available)
 */
export function getStorageQuota() {
  if (navigator.storage && navigator.storage.estimate) {
    return navigator.storage.estimate();
  }
  return Promise.resolve(null);
}

/**
 * Save data to localStorage with quota handling
 */
export function saveToLocalStorage(key, data) {
  if (!isLocalStorageAvailable()) {
    logger.warn("localStorage is not available");
    return false;
  }
  
  if (!key || typeof key !== "string") {
    throw new Error("Storage key must be a non-empty string");
  }
  
  try {
    const serialized = JSON.stringify(data);
    const size = new Blob([serialized]).size;
    
    // Check approximate quota (5MB limit for most browsers)
    if (size > 4 * 1024 * 1024) {
      throw new Error("Data size exceeds storage limit");
    }
    
    localStorage.setItem(key, serialized);
    return true;
  } catch (error) {
    // Handle quota exceeded error
    if (error.name === "QuotaExceededError" || error.code === 22) {
      logger.error("Storage quota exceeded");
      const quotaError = new Error("Storage quota exceeded. Please clear some data.");
      quotaError.code = "QUOTA_EXCEEDED";
      throw quotaError;
    }
    
    logger.error("Error saving to localStorage:", error);
    return false;
  }
}

/**
 * Get data from localStorage
 */
export function getFromLocalStorage(key, defaultValue = null) {
  if (!isLocalStorageAvailable()) {
    return defaultValue;
  }
  
  if (!key || typeof key !== "string") {
    return defaultValue;
  }
  
  try {
    const item = localStorage.getItem(key);
    if (item === null) {
      return defaultValue;
    }
    return JSON.parse(item);
  } catch (error) {
    logger.error("Error reading from localStorage:", error);
    // Remove corrupted data
    try {
      localStorage.removeItem(key);
    } catch {
      // Ignore removal errors
    }
    return defaultValue;
  }
}

/**
 * Remove data from localStorage
 */
export function removeFromLocalStorage(key) {
  if (!isLocalStorageAvailable()) {
    return false;
  }
  
  if (!key || typeof key !== "string") {
    return false;
  }
  
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    logger.error("Error removing from localStorage:", error);
    return false;
  }
}

/**
 * Clear all localStorage data (use with caution)
 */
export function clearLocalStorage() {
  if (!isLocalStorageAvailable()) {
    return false;
  }
  
  try {
    localStorage.clear();
    return true;
  } catch (error) {
    logger.error("Error clearing localStorage:", error);
    return false;
  }
}

/**
 * Get all keys from localStorage
 */
export function getAllStorageKeys() {
  if (!isLocalStorageAvailable()) {
    return [];
  }
  
  try {
    return Object.keys(localStorage);
  } catch (error) {
    logger.error("Error getting storage keys:", error);
    return [];
  }
}

/**
 * Get storage size estimate
 */
export function getStorageSize() {
  if (!isLocalStorageAvailable()) {
    return 0;
  }
  
  let total = 0;
  try {
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        total += localStorage[key].length + key.length;
      }
    }
  } catch (error) {
    logger.error("Error calculating storage size:", error);
  }
  
  return total;
}

/**
 * Save verification history form data
 */
export function saveVerificationHistoryForm(batchId, serialNumber) {
  return saveToLocalStorage(STORAGE_KEYS.VERIFICATION_HISTORY_FORM, {
    batchId,
    serialNumber,
    timestamp: Date.now(),
  });
}

/**
 * Get verification history form data
 */
export function getVerificationHistoryForm() {
  const data = getFromLocalStorage(STORAGE_KEYS.VERIFICATION_HISTORY_FORM, null);
  if (!data) {
    return null;
  }
  return {
    batchId: data.batchId,
    serialNumber: data.serialNumber,
  };
}

/**
 * Add recent search
 */
export function addRecentSearch(batchId, serialNumber) {
  const searches = getRecentSearches();
  const newSearch = { batchId, serialNumber, timestamp: Date.now() };
  
  // Remove duplicate if exists
  const filtered = searches.filter(
    (s) => !(s.batchId === batchId && s.serialNumber === serialNumber)
  );
  
  // Add to beginning and limit to 10
  const updated = [newSearch, ...filtered].slice(0, 10);
  
  return saveToLocalStorage(STORAGE_KEYS.RECENT_SEARCHES, updated);
}

/**
 * Get recent searches
 */
export function getRecentSearches() {
  return getFromLocalStorage(STORAGE_KEYS.RECENT_SEARCHES, []);
}

/**
 * Clear recent searches
 */
export function clearRecentSearches() {
  return removeFromLocalStorage(STORAGE_KEYS.RECENT_SEARCHES);
}

/**
 * Save manufacturer form data
 */
export function saveManufacturerForm(data) {
  return saveToLocalStorage(STORAGE_KEYS.MANUFACTURER_FORM, {
    ...data,
    timestamp: Date.now(),
  });
}

/**
 * Get manufacturer form data
 */
export function getManufacturerForm() {
  return getFromLocalStorage(STORAGE_KEYS.MANUFACTURER_FORM, null);
}

