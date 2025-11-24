/**
 * QR Code Generator Server
 * 
 * This service generates QR codes for ChainCheck products.
 * QR codes contain product information in the format: "BATCH_ID:SERIAL_NUMBER"
 * 
 * Usage:
 *   GET /qr?batchId=1&serialNumber=SN123456
 *   Returns: HTML page with QR code image
 * 
 *   GET /qr/json?batchId=1&serialNumber=SN123456
 *   Returns: JSON with QR code data URL
 */

const express = require("express");
const QRCode = require("qrcode");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");

const app = express();
const PORT = process.env.PORT || 3001;
const NODE_ENV = process.env.NODE_ENV || "development";
const isProduction = NODE_ENV === "production";

// ============================================
// Middleware Setup
// ============================================

// Enable CORS for all routes
app.use(cors());

// Parse JSON bodies
app.use(express.json());

// Request logging
if (isProduction) {
  // Production: Use combined format (more detailed)
  app.use(morgan("combined"));
} else {
  // Development: Use dev format (colored, concise)
  app.use(morgan("dev"));
}

// ============================================
// Rate Limiting
// ============================================

// General rate limiter for QR endpoints
const qrLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: "Too many requests",
    message: "Too many requests from this IP, please try again later.",
    retryAfter: "15 minutes"
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Stricter rate limiter for batch operations
const batchLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 batch requests per windowMs
  message: {
    error: "Too many batch requests",
    message: "Too many batch requests from this IP, please try again later.",
    retryAfter: "15 minutes"
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Generate QR code data
 * @param {string} data - Data to encode in QR code
 * @returns {Promise<string>} QR code as data URL
 */
async function generateQRCode(data) {
  try {
    const qrDataURL = await QRCode.toDataURL(data, {
      errorCorrectionLevel: "M",
      type: "image/png",
      width: 300,
      margin: 2,
    });
    return qrDataURL;
  } catch (error) {
    throw new Error("Failed to generate QR code: " + error.message);
  }
}

/**
 * Generate product QR code data string
 * Format: "BATCH_ID:SERIAL_NUMBER" or JSON
 * @param {number} batchId - Product batch ID
 * @param {string} serialNumber - Serial number
 * @param {boolean} useJson - Whether to use JSON format
 * @returns {string} Formatted QR code data
 */
function formatQRData(batchId, serialNumber, useJson = false) {
  if (useJson) {
    return JSON.stringify({
      batchId: batchId.toString(),
      serialNumber: serialNumber,
    });
  }
  return `${batchId}:${serialNumber}`;
}

/**
 * GET /qr - Generate QR code and return as HTML page
 * Query parameters:
 *   - batchId: Product batch ID (required)
 *   - serialNumber: Serial number (required)
 *   - format: 'json' for JSON format, 'colon' for colon-separated (default: 'colon')
 */
app.get("/qr", qrLimiter, async (req, res) => {
  try {
    const batchId = req.query.batchId;
    const serialNumber = req.query.serialNumber;
    const format = req.query.format || "colon";

    // Validate input
    if (!batchId || !serialNumber) {
      return res.status(400).send(`
        <html>
          <body>
            <h1>Error: Missing Parameters</h1>
            <p>Usage: /qr?batchId=1&serialNumber=SN123456</p>
            <p>Optional: &format=json (for JSON format)</p>
          </body>
        </html>
      `);
    }

    // Validate batch ID is a number
    const batchIdNum = parseInt(batchId);
    if (isNaN(batchIdNum) || batchIdNum <= 0) {
      return res.status(400).send(`
        <html>
          <body>
            <h1>Error: Invalid Batch ID</h1>
            <p>Batch ID must be a positive number</p>
          </body>
        </html>
      `);
    }

    // Format QR code data
    const useJson = format === "json";
    const qrData = formatQRData(batchIdNum, serialNumber, useJson);

    // Generate QR code
    const qrCodeDataURL = await generateQRCode(qrData);

    // Return HTML page with QR code
    res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>ChainCheck QR Code</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
              margin: 0;
              background: #f5f5f5;
            }
            .container {
              background: white;
              padding: 30px;
              border-radius: 10px;
              box-shadow: 0 2px 10px rgba(0,0,0,0.1);
              text-align: center;
            }
            h1 {
              color: #333;
              margin-bottom: 20px;
            }
            img {
              border: 2px solid #ddd;
              border-radius: 8px;
              padding: 10px;
              background: white;
            }
            .info {
              margin-top: 20px;
              color: #666;
              font-size: 14px;
            }
            .data {
              margin-top: 10px;
              padding: 10px;
              background: #f8f9fa;
              border-radius: 5px;
              font-family: monospace;
              word-break: break-all;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>ChainCheck Product QR Code</h1>
            <img src="${qrCodeDataURL}" alt="QR Code" />
            <div class="info">
              <p><strong>Batch ID:</strong> ${batchIdNum}</p>
              <p><strong>Serial Number:</strong> ${serialNumber}</p>
              <div class="data">
                <strong>QR Data:</strong><br>${qrData}
              </div>
            </div>
          </div>
        </body>
      </html>
    `);
  } catch (error) {
    console.error("Error generating QR code:", error);
    res.status(500).send(`
      <html>
        <body>
          <h1>Error</h1>
          <p>${error.message}</p>
        </body>
      </html>
    `);
  }
});

/**
 * GET /qr/json - Generate QR code and return as JSON
 * Query parameters:
 *   - batchId: Product batch ID (required)
 *   - serialNumber: Serial number (required)
 *   - format: 'json' for JSON format, 'colon' for colon-separated (default: 'colon')
 */
app.get("/qr/json", qrLimiter, async (req, res) => {
  try {
    const batchId = req.query.batchId;
    const serialNumber = req.query.serialNumber;
    const format = req.query.format || "colon";

    // Validate input
    if (!batchId || !serialNumber) {
      return res.status(400).json({
        error: "Missing parameters",
        message: "batchId and serialNumber are required",
        usage: "/qr/json?batchId=1&serialNumber=SN123456",
      });
    }

    // Validate batch ID
    const batchIdNum = parseInt(batchId);
    if (isNaN(batchIdNum) || batchIdNum <= 0) {
      return res.status(400).json({
        error: "Invalid batch ID",
        message: "Batch ID must be a positive number",
      });
    }

    // Format QR code data
    const useJson = format === "json";
    const qrData = formatQRData(batchIdNum, serialNumber, useJson);

    // Generate QR code
    const qrCodeDataURL = await generateQRCode(qrData);

    // Return JSON response
    res.json({
      success: true,
      batchId: batchIdNum,
      serialNumber: serialNumber,
      qrData: qrData,
      qrCode: qrCodeDataURL,
      format: useJson ? "json" : "colon",
    });
  } catch (error) {
    console.error("Error generating QR code:", error);
    res.status(500).json({
      error: "Failed to generate QR code",
      message: error.message,
    });
  }
});

/**
 * POST /qr/batch - Generate multiple QR codes for a batch
 * Body: {
 *   batchId: number,
 *   serialNumbers: string[],
 *   format?: 'json' | 'colon'
 * }
 */
app.post("/qr/batch", batchLimiter, async (req, res) => {
  try {
    const { batchId, serialNumbers, format = "colon" } = req.body;

    // Validate input
    if (!batchId || !serialNumbers || !Array.isArray(serialNumbers)) {
      return res.status(400).json({
        error: "Invalid request",
        message: "batchId (number) and serialNumbers (array) are required",
      });
    }

    if (serialNumbers.length === 0) {
      return res.status(400).json({
        error: "Empty array",
        message: "serialNumbers array cannot be empty",
      });
    }

    // Generate QR codes for all serials
    const useJson = format === "json";
    const qrCodes = [];

    for (const serialNumber of serialNumbers) {
      const qrData = formatQRData(batchId, serialNumber, useJson);
      const qrCodeDataURL = await generateQRCode(qrData);

      qrCodes.push({
        serialNumber: serialNumber,
        qrData: qrData,
        qrCode: qrCodeDataURL,
      });
    }

    res.json({
      success: true,
      batchId: batchId,
      count: qrCodes.length,
      qrCodes: qrCodes,
    });
  } catch (error) {
    console.error("Error generating batch QR codes:", error);
    res.status(500).json({
      error: "Failed to generate QR codes",
      message: error.message,
    });
  }
});

/**
 * Health check endpoint
 */
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service: "chaincheck-qr-generator",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: NODE_ENV,
    version: "1.0.0"
  });
});

// ============================================
// Error Handling Middleware
// ============================================

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: "Not found",
    message: `Route ${req.path} not found`,
    availableEndpoints: [
      "GET /health",
      "GET /qr?batchId=1&serialNumber=SN123456",
      "GET /qr/json?batchId=1&serialNumber=SN123456",
      "POST /qr/batch"
    ]
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Error:", err);
  
  // Don't leak error details in production
  const errorMessage = isProduction
    ? "An internal server error occurred"
    : err.message;

  res.status(err.status || 500).json({
    error: "Internal server error",
    message: errorMessage,
    ...(isProduction ? {} : { stack: err.stack })
  });
});

// ============================================
// Server Startup
// ============================================

// Graceful shutdown handling
process.on("SIGTERM", () => {
  console.log("SIGTERM signal received: closing HTTP server");
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("SIGINT signal received: closing HTTP server");
  process.exit(0);
});

// Start server
app.listen(PORT, () => {
  console.log("=".repeat(50));
  console.log("ChainCheck QR Generator");
  console.log("=".repeat(50));
  console.log(`Environment: ${NODE_ENV}`);
  console.log(`Port: ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`QR endpoint: http://localhost:${PORT}/qr?batchId=1&serialNumber=SN123456`);
  console.log("=".repeat(50));
});

