/**
 * Type declarations for qrGenerator.js
 */

export interface QRCodeOptions {
  width?: number;
  margin?: number;
  color?: {
    dark?: string;
    light?: string;
  };
}

export function generateQRCodeDataURL(data: string, options?: QRCodeOptions): Promise<string>;
export function generateQRCodeSVG(data: string, options?: QRCodeOptions): Promise<string>;
export function downloadQRCode(
  data: string,
  filename?: string,
  format?: "png" | "svg",
  options?: QRCodeOptions
): Promise<void>;
export function generateProductQRData(batchId: number, serialNumber: string): string;
export function generateBatchQRCodes(
  batchId: number,
  serialNumbers: string[],
  options?: QRCodeOptions
): Promise<string[]>;

