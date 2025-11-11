/**
 * Clipboard Utilities
 * Provides copy-to-clipboard functionality with fallbacks
 */

/**
 * Copy text to clipboard
 * @param {string} text - The text to copy
 * @returns {Promise<boolean>} Promise that resolves to true if successful
 */
export async function copyToClipboard(text) {
  if (typeof text !== "string") {
    throw new TypeError("Text must be a string");
  }
  
  if (!text) {
    return false;
  }
  
  try {
    // Use modern Clipboard API if available
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    
    // Fallback for older browsers or non-secure contexts
    return fallbackCopyToClipboard(text);
  } catch (err) {
    // Try fallback if Clipboard API fails
    try {
      return fallbackCopyToClipboard(text);
    } catch (fallbackErr) {
      console.error("Failed to copy text:", fallbackErr);
      return false;
    }
  }
}

/**
 * Fallback copy method using execCommand
 */
function fallbackCopyToClipboard(text) {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.style.position = "fixed";
  textArea.style.left = "-999999px";
  textArea.style.top = "-999999px";
  textArea.style.opacity = "0";
  textArea.setAttribute("readonly", "");
  textArea.setAttribute("aria-hidden", "true");
  
  document.body.appendChild(textArea);
  
  // Select and copy
  textArea.select();
  textArea.setSelectionRange(0, text.length);
  
  try {
    const successful = document.execCommand("copy");
    document.body.removeChild(textArea);
    return successful;
  } catch (err) {
    document.body.removeChild(textArea);
    return false;
  }
}

/**
 * Copy text to clipboard with user feedback
 * @param {string} text - The text to copy
 * @param {Function} showToast - Optional toast function to show success/error message
 * @returns {Promise<boolean>} Promise that resolves to true if successful
 */
export async function copyToClipboardWithFeedback(text, showToast = null) {
  const success = await copyToClipboard(text);
  
  if (showToast && typeof showToast === "function") {
    if (success) {
      showToast("Copied to clipboard!", "success", 3000);
    } else {
      showToast("Failed to copy to clipboard", "error", 3000);
    }
  }
  
  return success;
}

/**
 * Read text from clipboard
 * @returns {Promise<string>} Promise that resolves to clipboard text
 */
export async function readFromClipboard() {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      return await navigator.clipboard.readText();
    }
    throw new Error("Clipboard API not available");
  } catch (err) {
    console.error("Failed to read from clipboard:", err);
    throw err;
  }
}

/**
 * Check if clipboard API is available
 */
export function isClipboardAvailable() {
  return !!(navigator.clipboard && window.isSecureContext);
}

