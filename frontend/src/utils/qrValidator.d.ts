/**
 * Type declarations for qrValidator.js
 */

export interface QRValidationResult {
  valid: boolean;
  format: "colon" | "json" | "invalid";
  batchId?: number;
  serialNumber?: string;
  error?: string;
}

export function validateQRCodeOffline(qrData: string): QRValidationResult;
export function getQRValidationErrorMessage(result: QRValidationResult): string;

