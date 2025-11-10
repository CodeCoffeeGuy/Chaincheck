/**
 * Offline QR Code Validation Utility
 * 
 * Validates QR code format and structure without blockchain connection
 * This provides immediate feedback before attempting on-chain verification
 */

export interface QRValidationResult {
  valid: boolean;
  format: "colon" | "json" | "invalid";
  batchId?: number;
  serialNumber?: string;
  error?: string;
}

/**
 * Validate QR code data format offline
 * @param qrData Raw QR code string
 * @returns Validation result with parsed data if valid
 */
export function validateQRCodeOffline(qrData: string): QRValidationResult {
  if (!qrData || typeof qrData !== "string") {
    return {
      valid: false,
      format: "invalid",
      error: "Invalid QR code data",
    };
  }

  const trimmed = qrData.trim();

  // Check for colon-separated format: "batchId:serialNumber"
  if (trimmed.includes(":") && !trimmed.startsWith("{")) {
    const parts = trimmed.split(":");
    if (parts.length === 2) {
      const batchId = parseInt(parts[0], 10);
      const serialNumber = parts[1].trim();

      if (isNaN(batchId) || batchId <= 0) {
        return {
          valid: false,
          format: "invalid",
          error: "Invalid batch ID format",
        };
      }

      if (!serialNumber || serialNumber.length === 0) {
        return {
          valid: false,
          format: "invalid",
          error: "Serial number is required",
        };
      }

      return {
        valid: true,
        format: "colon",
        batchId,
        serialNumber,
      };
    }
  }

  // Check for JSON format: {"batchId":"1","serialNumber":"SN001"}
  if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
    try {
      const parsed = JSON.parse(trimmed);
      
      if (parsed.batchId && parsed.serialNumber) {
        const batchId = typeof parsed.batchId === "string" 
          ? parseInt(parsed.batchId, 10) 
          : parsed.batchId;
        const serialNumber = String(parsed.serialNumber);

        if (isNaN(batchId) || batchId <= 0) {
          return {
            valid: false,
            format: "invalid",
            error: "Invalid batch ID in JSON",
          };
        }

        if (!serialNumber || serialNumber.length === 0) {
          return {
            valid: false,
            format: "invalid",
            error: "Serial number is required in JSON",
          };
        }

        return {
          valid: true,
          format: "json",
          batchId,
          serialNumber,
        };
      } else {
        return {
          valid: false,
          format: "invalid",
          error: "Missing batchId or serialNumber in JSON",
        };
      }
    } catch (e) {
      return {
        valid: false,
        format: "invalid",
        error: "Invalid JSON format",
      };
    }
  }

  return {
    valid: false,
    format: "invalid",
    error: "QR code format not recognized. Expected format: 'batchId:serialNumber' or JSON",
  };
}

/**
 * Get user-friendly error message for invalid QR codes
 */
export function getQRValidationErrorMessage(result: QRValidationResult): string {
  if (result.valid) {
    return "";
  }

  return result.error || "Invalid QR code format";
}

