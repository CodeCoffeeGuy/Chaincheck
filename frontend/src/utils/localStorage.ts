/**
 * LocalStorage utility functions
 * Handles saving and retrieving data from localStorage with error handling
 */

const STORAGE_KEYS = {
  VERIFICATION_HISTORY_FORM: "chaincheck_verification_history_form",
  RECENT_SEARCHES: "chaincheck_recent_searches",
  MANUFACTURER_FORM: "chaincheck_manufacturer_form",
} as const;

/**
 * Save data to localStorage
 */
export const saveToLocalStorage = <T>(key: string, data: T): boolean => {
  try {
    const serialized = JSON.stringify(data);
    localStorage.setItem(key, serialized);
    return true;
  } catch (error) {
    console.error("Error saving to localStorage:", error);
    return false;
  }
};

/**
 * Get data from localStorage
 */
export const getFromLocalStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    if (item === null) {
      return defaultValue;
    }
    return JSON.parse(item) as T;
  } catch (error) {
    console.error("Error reading from localStorage:", error);
    return defaultValue;
  }
};

/**
 * Remove data from localStorage
 */
export const removeFromLocalStorage = (key: string): boolean => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error("Error removing from localStorage:", error);
    return false;
  }
};

/**
 * Save verification history form data
 */
export const saveVerificationHistoryForm = (batchId: string, serialNumber: string) => {
  return saveToLocalStorage(STORAGE_KEYS.VERIFICATION_HISTORY_FORM, {
    batchId,
    serialNumber,
    timestamp: Date.now(),
  });
};

/**
 * Get verification history form data
 */
export const getVerificationHistoryForm = (): { batchId: string; serialNumber: string } | null => {
  const data = getFromLocalStorage<{ batchId: string; serialNumber: string; timestamp: number } | null>(
    STORAGE_KEYS.VERIFICATION_HISTORY_FORM,
    null
  );
  return data ? { batchId: data.batchId, serialNumber: data.serialNumber } : null;
};

/**
 * Add recent search
 */
export const addRecentSearch = (batchId: string, serialNumber: string) => {
  const searches = getRecentSearches();
  const newSearch = { batchId, serialNumber, timestamp: Date.now() };
  
  // Remove duplicate if exists
  const filtered = searches.filter(
    (s) => !(s.batchId === batchId && s.serialNumber === serialNumber)
  );
  
  // Add to beginning and limit to 10
  const updated = [newSearch, ...filtered].slice(0, 10);
  
  return saveToLocalStorage(STORAGE_KEYS.RECENT_SEARCHES, updated);
};

/**
 * Get recent searches
 */
export const getRecentSearches = (): Array<{ batchId: string; serialNumber: string; timestamp: number }> => {
  return getFromLocalStorage(STORAGE_KEYS.RECENT_SEARCHES, []);
};

/**
 * Clear recent searches
 */
export const clearRecentSearches = () => {
  return removeFromLocalStorage(STORAGE_KEYS.RECENT_SEARCHES);
};

/**
 * Save manufacturer form data
 */
export const saveManufacturerForm = (data: Record<string, any>) => {
  return saveToLocalStorage(STORAGE_KEYS.MANUFACTURER_FORM, {
    ...data,
    timestamp: Date.now(),
  });
};

/**
 * Get manufacturer form data
 */
export const getManufacturerForm = (): Record<string, any> | null => {
  return getFromLocalStorage(STORAGE_KEYS.MANUFACTURER_FORM, null);
};

