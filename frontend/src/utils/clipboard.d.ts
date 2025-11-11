/**
 * Type declarations for clipboard.js
 */

export function copyToClipboard(text: string): Promise<boolean>;
export function copyToClipboardWithFeedback(
  text: string,
  showToast?: (message: string, type?: "success" | "error" | "info" | "warning", duration?: number) => void
): Promise<boolean>;
export function readFromClipboard(): Promise<string>;
export function isClipboardAvailable(): boolean;

