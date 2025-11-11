/**
 * Custom Error Types and Error Handling Utilities
 * Provides structured error handling with custom error classes
 */

/**
 * Base custom error class
 */
export class ChainCheckError extends Error {
  constructor(message, code = null, cause = null) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.cause = cause;
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

/**
 * Blockchain-related errors
 */
export class BlockchainError extends ChainCheckError {
  constructor(message, code = null, cause = null) {
    super(message, code, cause);
  }
}

/**
 * Network-related errors
 */
export class NetworkError extends ChainCheckError {
  constructor(message, code = null, cause = null) {
    super(message, code, cause);
  }
}

/**
 * Validation errors
 */
export class ValidationError extends ChainCheckError {
  constructor(message, field = null, cause = null) {
    super(message, "VALIDATION_ERROR", cause);
    this.field = field;
  }
}

/**
 * Storage errors (localStorage, etc.)
 */
export class StorageError extends ChainCheckError {
  constructor(message, code = null, cause = null) {
    super(message, code || "STORAGE_ERROR", cause);
  }
}

/**
 * Parse error message from various error types
 */
export function parseErrorMessage(error) {
  if (error instanceof ChainCheckError) {
    return error.message;
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  if (typeof error === "string") {
    return error;
  }
  
  return "An unknown error occurred";
}

/**
 * Check if error is a user rejection (MetaMask)
 */
export function isUserRejection(error) {
  const message = parseErrorMessage(error).toLowerCase();
  return (
    message.includes("user rejected") ||
    message.includes("user denied") ||
    message.includes("rejected") ||
    (typeof error === "object" && error !== null && error.code === 4001)
  );
}

/**
 * Check if error is due to insufficient funds
 */
export function isInsufficientFunds(error) {
  const message = parseErrorMessage(error).toLowerCase();
  return (
    message.includes("insufficient funds") ||
    message.includes("insufficient balance") ||
    message.includes("not enough")
  );
}

/**
 * Check if error is a network error
 */
export function isNetworkError(error) {
  const message = parseErrorMessage(error).toLowerCase();
  return (
    message.includes("network") ||
    message.includes("connection") ||
    message.includes("timeout") ||
    message.includes("fetch failed")
  );
}

/**
 * Get user-friendly error message
 */
export function getUserFriendlyError(error) {
  if (isUserRejection(error)) {
    return "Transaction was cancelled";
  }
  
  if (isInsufficientFunds(error)) {
    return "Insufficient funds. Please add more MATIC to your wallet";
  }
  
  if (isNetworkError(error)) {
    return "Network error. Please check your connection and try again";
  }
  
  return parseErrorMessage(error);
}

