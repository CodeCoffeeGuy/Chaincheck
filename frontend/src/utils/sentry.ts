/**
 * Sentry Error Tracking Configuration
 * 
 * Integrates Sentry for production error tracking and monitoring
 * Only initializes in production mode when DSN is provided
 */

import * as Sentry from "@sentry/react";

const SENTRY_DSN = import.meta.env.VITE_SENTRY_DSN;
const ENVIRONMENT = import.meta.env.MODE || "development";
const IS_PRODUCTION = import.meta.env.PROD;

/**
 * Initialize Sentry if DSN is provided
 */
export function initSentry() {
  // Only initialize in production or if explicitly enabled
  if (!SENTRY_DSN) {
    console.log("Sentry: DSN not provided, error tracking disabled");
    return;
  }

  try {
    Sentry.init({
      dsn: SENTRY_DSN,
      environment: ENVIRONMENT,
      
      // Performance monitoring
      tracesSampleRate: IS_PRODUCTION ? 0.1 : 1.0, // 10% in production, 100% in dev
      
      // Session replay (optional, can be expensive)
      replaysSessionSampleRate: IS_PRODUCTION ? 0.1 : 1.0,
      replaysOnErrorSampleRate: 1.0, // Always capture replays on errors
      
      // Integrations
      integrations: [
        Sentry.browserTracingIntegration(),
        Sentry.replayIntegration({
          maskAllText: true, // Privacy: mask all text
          blockAllMedia: true, // Privacy: block all media
        }),
      ],
      
      // Release tracking
      release: import.meta.env.VITE_APP_VERSION || "1.0.0",
      
      // Error filtering
      beforeSend(event, _hint) {
        // Don't send user rejection errors (not real errors)
        if (event.exception) {
          const errorMessage = event.exception.values?.[0]?.value || "";
          if (
            errorMessage.includes("User rejected") ||
            errorMessage.includes("user rejected") ||
            errorMessage.includes("User denied")
          ) {
            return null; // Don't send this error
          }
        }
        
        return event;
      },
      
      // Ignore specific errors
      ignoreErrors: [
        // Browser extensions
        "top.GLOBALS",
        "originalCreateNotification",
        "canvas.contentDocument",
        "MyApp_RemoveAllHighlights",
        "atomicFindClose",
        // Network errors that are expected
        "NetworkError",
        "Failed to fetch",
        "Load failed",
        // MetaMask errors
        "User rejected",
        "User denied",
      ],
    });

    console.log("Sentry: Error tracking initialized");
  } catch (error) {
    console.error("Sentry: Failed to initialize", error);
  }
}

/**
 * Capture an exception
 */
export function captureException(error: Error, context?: Record<string, any>) {
  if (!SENTRY_DSN) return;
  
  Sentry.captureException(error, {
    contexts: {
      custom: context || {},
    },
  });
}

/**
 * Capture a message
 */
export function captureMessage(message: string, level: Sentry.SeverityLevel = "info") {
  if (!SENTRY_DSN) return;
  
  Sentry.captureMessage(message, level);
}

/**
 * Set user context
 */
export function setUser(user: { id?: string; email?: string; username?: string }) {
  if (!SENTRY_DSN) return;
  
  Sentry.setUser(user);
}

/**
 * Add breadcrumb
 */
export function addBreadcrumb(breadcrumb: Sentry.Breadcrumb) {
  if (!SENTRY_DSN) return;
  
  Sentry.addBreadcrumb(breadcrumb);
}

/**
 * Set context
 */
export function setContext(name: string, context: Record<string, any>) {
  if (!SENTRY_DSN) return;
  
  Sentry.setContext(name, context);
}

/**
 * Wrap component with Sentry error boundary
 */
export const SentryErrorBoundary = Sentry.ErrorBoundary;







