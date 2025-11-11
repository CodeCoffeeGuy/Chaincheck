/**
 * QR Code Generator Utility
 * Provides functions for generating QR codes in various formats
 */

import QRCode from "qrcode";

/**
 * Generate QR code as data URL (for display)
 * @param {string} data - The data to encode in the QR code
 * @param {Object} options - QR code generation options
 * @param {number} options.width - QR code width (default: 300)
 * @param {number} options.margin - Margin size (default: 2)
 * @param {Object} options.color - Color options
 * @param {string} options.color.dark - Dark color (default: "#000000")
 * @param {string} options.color.light - Light color (default: "#FFFFFF")
 * @returns {Promise<string>} Promise resolving to data URL string
 */
export async function generateQRCodeDataURL(data, options = {}) {
  try {
    const defaultOptions = {
      width: 300,
      margin: 2,
      color: {
        dark: "#000000",
        light: "#FFFFFF",
      },
      ...options,
    };

    return await QRCode.toDataURL(data, defaultOptions);
  } catch (error) {
    console.error("Error generating QR code:", error);
    throw new Error("Failed to generate QR code");
  }
}

/**
 * Generate QR code as SVG string
 * @param {string} data - The data to encode in the QR code
 * @param {Object} options - QR code generation options
 * @param {number} options.width - QR code width (default: 300)
 * @param {number} options.margin - Margin size (default: 2)
 * @param {Object} options.color - Color options
 * @param {string} options.color.dark - Dark color (default: "#000000")
 * @param {string} options.color.light - Light color (default: "#FFFFFF")
 * @returns {Promise<string>} Promise resolving to SVG string
 */
export async function generateQRCodeSVG(data, options = {}) {
  try {
    const defaultOptions = {
      width: 300,
      margin: 2,
      color: {
        dark: "#000000",
        light: "#FFFFFF",
      },
      ...options,
    };

    return await QRCode.toString(data, {
      type: "svg",
      ...defaultOptions,
    });
  } catch (error) {
    console.error("Error generating QR code SVG:", error);
    throw new Error("Failed to generate QR code SVG");
  }
}

/**
 * Download QR code as image
 * @param {string} data - The data to encode
 * @param {string} filename - Filename for download (default: "qrcode")
 * @param {string} format - Image format ("png" or "svg", default: "png")
 * @param {Object} options - QR code generation options
 * @returns {Promise<void>}
 */
export async function downloadQRCode(data, filename = "qrcode", format = "png", options = {}) {
  try {
    if (format === "svg") {
      const svg = await generateQRCodeSVG(data, options);
      const blob = new Blob([svg], { type: "image/svg+xml" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${filename}.svg`;
      a.click();
      window.URL.revokeObjectURL(url);
    } else {
      const dataUrl = await generateQRCodeDataURL(data, options);
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `${filename}.png`;
      a.click();
    }
  } catch (error) {
    console.error("Error downloading QR code:", error);
    throw new Error("Failed to download QR code");
  }
}

/**
 * Generate QR code data for product verification
 * Format: "BATCH_ID:SERIAL_NUMBER"
 * @param {number} batchId - Product batch ID
 * @param {string} serialNumber - Product serial number
 * @returns {string} QR code data string
 */
export function generateProductQRData(batchId, serialNumber) {
  return `${batchId}:${serialNumber}`;
}

/**
 * Generate multiple QR codes for batch
 * @param {number} batchId - Product batch ID
 * @param {string[]} serialNumbers - Array of serial numbers
 * @param {Object} options - QR code generation options
 * @returns {Promise<string[]>} Promise resolving to array of data URLs
 */
export async function generateBatchQRCodes(batchId, serialNumbers, options = {}) {
  try {
    const qrCodes = await Promise.all(
      serialNumbers.map((serialNumber) => {
        const data = generateProductQRData(batchId, serialNumber);
        return generateQRCodeDataURL(data, options);
      })
    );
    return qrCodes;
  } catch (error) {
    console.error("Error generating batch QR codes:", error);
    throw new Error("Failed to generate batch QR codes");
  }
}

