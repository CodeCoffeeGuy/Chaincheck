/**
 * Formatting Utilities
 * Provides functions for formatting addresses, numbers, dates, and other data
 */

/**
 * Format Ethereum address to shortened version (0x1234...5678)
 */
export function formatAddress(address, startLength = 6, endLength = 4) {
  if (!address || typeof address !== "string") {
    return "";
  }
  
  if (address.length <= startLength + endLength) {
    return address;
  }
  
  return `${address.slice(0, startLength)}...${address.slice(-endLength)}`;
}

/**
 * Format transaction hash to shortened version
 */
export function formatTxHash(txHash, startLength = 10, endLength = 8) {
  if (!txHash || typeof txHash !== "string") {
    return "";
  }
  
  if (txHash.length <= startLength + endLength) {
    return txHash;
  }
  
  return `${txHash.slice(0, startLength)}...${txHash.slice(-endLength)}`;
}

/**
 * Format number with commas (e.g., 1000 -> "1,000")
 */
export function formatNumber(number, decimals = 0) {
  if (typeof number !== "number" || isNaN(number)) {
    return "0";
  }
  
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(number);
}

/**
 * Format large numbers with K, M, B suffixes
 */
export function formatCompactNumber(number, decimals = 1) {
  if (typeof number !== "number" || isNaN(number)) {
    return "0";
  }
  
  const abs = Math.abs(number);
  const sign = number < 0 ? "-" : "";
  
  if (abs >= 1e9) {
    return `${sign}${(abs / 1e9).toFixed(decimals)}B`;
  }
  if (abs >= 1e6) {
    return `${sign}${(abs / 1e6).toFixed(decimals)}M`;
  }
  if (abs >= 1e3) {
    return `${sign}${(abs / 1e3).toFixed(decimals)}K`;
  }
  
  return number.toString();
}

/**
 * Format date to readable string
 */
export function formatDate(date, options = {}) {
  if (!date) {
    return "";
  }
  
  const dateObj = date instanceof Date ? date : new Date(date);
  
  if (isNaN(dateObj.getTime())) {
    return "";
  }
  
  const defaultOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
    ...options,
  };
  
  return new Intl.DateTimeFormat("en-US", defaultOptions).format(dateObj);
}

/**
 * Format date to relative time (e.g., "2 hours ago", "3 days ago")
 */
export function formatRelativeTime(date) {
  if (!date) {
    return "";
  }
  
  const dateObj = date instanceof Date ? date : new Date(date);
  
  if (isNaN(dateObj.getTime())) {
    return "";
  }
  
  const now = new Date();
  const diffMs = now - dateObj;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);
  const diffWeek = Math.floor(diffDay / 7);
  const diffMonth = Math.floor(diffDay / 30);
  const diffYear = Math.floor(diffDay / 365);
  
  if (diffSec < 60) {
    return "just now";
  }
  if (diffMin < 60) {
    return `${diffMin} minute${diffMin !== 1 ? "s" : ""} ago`;
  }
  if (diffHour < 24) {
    return `${diffHour} hour${diffHour !== 1 ? "s" : ""} ago`;
  }
  if (diffDay < 7) {
    return `${diffDay} day${diffDay !== 1 ? "s" : ""} ago`;
  }
  if (diffWeek < 4) {
    return `${diffWeek} week${diffWeek !== 1 ? "s" : ""} ago`;
  }
  if (diffMonth < 12) {
    return `${diffMonth} month${diffMonth !== 1 ? "s" : ""} ago`;
  }
  return `${diffYear} year${diffYear !== 1 ? "s" : ""} ago`;
}

/**
 * Format timestamp to readable date and time
 */
export function formatDateTime(timestamp) {
  if (!timestamp) {
    return "";
  }
  
  const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
  
  if (isNaN(date.getTime())) {
    return "";
  }
  
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

/**
 * Format file size in bytes to human-readable format
 */
export function formatFileSize(bytes) {
  if (typeof bytes !== "number" || bytes < 0) {
    return "0 B";
  }
  
  const units = ["B", "KB", "MB", "GB", "TB"];
  let size = bytes;
  let unitIndex = 0;
  
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  
  return `${size.toFixed(unitIndex === 0 ? 0 : 2)} ${units[unitIndex]}`;
}

/**
 * Format percentage
 */
export function formatPercentage(value, decimals = 1) {
  if (typeof value !== "number" || isNaN(value)) {
    return "0%";
  }
  
  return `${value.toFixed(decimals)}%`;
}

/**
 * Format currency (for MATIC or other tokens)
 */
export function formatCurrency(amount, symbol = "MATIC", decimals = 4) {
  if (typeof amount !== "number" || isNaN(amount)) {
    return `0 ${symbol}`;
  }
  
  return `${formatNumber(amount, decimals)} ${symbol}`;
}

