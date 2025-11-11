/**
 * Validation Utilities
 * Provides input validation and data format validation functions
 */

// Note: Using standard Error for now to avoid circular dependencies
// import { ValidationError } from "./errors.js";

/**
 * Validate Ethereum address format
 */
export function isValidAddress(address) {
  if (!address || typeof address !== "string") {
    return false;
  }
  
  // Ethereum address format: 0x followed by 40 hex characters
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * Validate and normalize Ethereum address
 */
export function normalizeAddress(address) {
  if (!isValidAddress(address)) {
    const error = new Error("Invalid Ethereum address format");
    error.field = "address";
    throw error;
  }
  return address.toLowerCase();
}

/**
 * Validate batch ID
 */
export function isValidBatchId(batchId) {
  if (typeof batchId !== "number" && typeof batchId !== "string") {
    return false;
  }
  
  const num = typeof batchId === "string" ? parseInt(batchId, 10) : batchId;
  return !isNaN(num) && num > 0 && Number.isInteger(num);
}

/**
 * Validate serial number
 */
export function isValidSerialNumber(serialNumber) {
  if (typeof serialNumber !== "string") {
    return false;
  }
  
  const trimmed = serialNumber.trim();
  return trimmed.length > 0 && trimmed.length <= 256; // Reasonable max length
}

/**
 * Validate transaction hash format
 */
export function isValidTxHash(txHash) {
  if (!txHash || typeof txHash !== "string") {
    return false;
  }
  
  // Ethereum transaction hash: 0x followed by 64 hex characters
  return /^0x[a-fA-F0-9]{64}$/.test(txHash);
}

/**
 * Validate email format (basic)
 */
export function isValidEmail(email) {
  if (!email || typeof email !== "string") {
    return false;
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate URL format
 */
export function isValidUrl(url) {
  if (!url || typeof url !== "string") {
    return false;
  }
  
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Validate positive integer
 */
export function isPositiveInteger(value) {
  if (typeof value !== "number" && typeof value !== "string") {
    return false;
  }
  
  const num = typeof value === "string" ? parseInt(value, 10) : value;
  return !isNaN(num) && num > 0 && Number.isInteger(num);
}

/**
 * Validate non-empty string
 */
export function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

/**
 * Validate array of strings
 */
export function isValidStringArray(value) {
  if (!Array.isArray(value)) {
    return false;
  }
  
  return value.every((item) => typeof item === "string" && item.trim().length > 0);
}

/**
 * Validate and sanitize input string (remove dangerous characters)
 */
export function sanitizeInput(input, maxLength = 1000) {
  if (typeof input !== "string") {
    return "";
  }
  
  // Remove null bytes and control characters (except newlines and tabs)
  let sanitized = input.replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F]/g, "");
  
  // Trim and limit length
  sanitized = sanitized.trim().slice(0, maxLength);
  
  return sanitized;
}

/**
 * Validate product registration data
 */
export function validateProductRegistration(data) {
  if (typeof data !== "object" || data === null) {
    return false;
  }
  
  return (
    isValidBatchId(data.batchId) &&
    isNonEmptyString(data.name) &&
    isNonEmptyString(data.brand) &&
    isValidStringArray(data.serialNumbers) &&
    data.serialNumbers.length > 0 &&
    data.serialNumbers.length <= 1000 // Reasonable limit
  );
}

/**
 * Validate verification input
 */
export function validateVerificationInput(data) {
  if (typeof data !== "object" || data === null) {
    return false;
  }
  
  return isValidBatchId(data.batchId) && isValidSerialNumber(data.serialNumber);
}

