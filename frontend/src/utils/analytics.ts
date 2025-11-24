/**
 * Analytics Integration - PostHog
 * 
 * PostHog provides product analytics, session replay, feature flags, and more
 * Only tracks in production mode when API key is provided
 */

import posthog from "posthog-js";

const IS_PRODUCTION = import.meta.env.PROD;
const POSTHOG_KEY = import.meta.env.VITE_POSTHOG_KEY;
const POSTHOG_HOST = import.meta.env.VITE_POSTHOG_HOST || "https://app.posthog.com";

/**
 * Initialize PostHog
 */
export function initAnalytics() {
  if (!POSTHOG_KEY) {
    console.log("Analytics: PostHog not initialized (POSTHOG_KEY not set)");
    return;
  }

  try {
    posthog.init(POSTHOG_KEY, {
      api_host: POSTHOG_HOST,
      // Only enable autocapture in production
      autocapture: IS_PRODUCTION,
      // Capture pageviews automatically
      capture_pageview: true,
      // Capture pageleaves
      capture_pageleave: true,
      // Session replay (optional, can be expensive)
      session_recording: {
        recordCrossOriginIframes: false,
        maskAllInputs: true, // Privacy: mask all inputs
      },
      // Privacy settings
      respect_dnt: true, // Respect Do Not Track
      // Loaded callback
      loaded: (_posthog) => {
        if (IS_PRODUCTION) {
          console.log("Analytics: PostHog initialized");
        }
      },
    });
  } catch (error) {
    console.error("Analytics: Failed to initialize PostHog", error);
  }
}

/**
 * Track page view
 */
export function trackPageView(path?: string) {
  if (!POSTHOG_KEY || !posthog.__loaded) return;

  if (path) {
    posthog.capture("$pageview", {
      $current_url: path,
    });
  } else {
    posthog.capture("$pageview");
  }
}

/**
 * Track event
 */
export function trackEvent(
  eventName: string,
  properties?: Record<string, any>
) {
  if (!POSTHOG_KEY || !posthog.__loaded) return;

  posthog.capture(eventName, properties);
}

/**
 * Track QR code scan
 */
export function trackQRScan(success: boolean, error?: string) {
  trackEvent("qr_scan", {
    success,
    error: error || null,
    category: "verification",
  });
}

/**
 * Track product verification
 */
export function trackVerification(isAuthentic: boolean, batchId?: number) {
  trackEvent("product_verification", {
    is_authentic: isAuthentic,
    result: isAuthentic ? "authentic" : "counterfeit",
    batch_id: batchId,
    category: "verification",
  });
}

/**
 * Track wallet connection
 */
export function trackWalletConnection(connected: boolean, walletType?: string) {
  trackEvent("wallet_connection", {
    connected,
    wallet_type: walletType || "metamask",
    category: "wallet",
  });
}

/**
 * Track error
 */
export function trackError(error: Error, context?: Record<string, any>) {
  trackEvent("error", {
    error_name: error.name,
    error_message: error.message,
    error_stack: error.stack,
    category: "error",
    ...context,
  });
}

/**
 * Identify user (when wallet is connected)
 */
export function identifyUser(userId: string, properties?: Record<string, any>) {
  if (!POSTHOG_KEY || !posthog.__loaded) return;

  posthog.identify(userId, properties);
}

/**
 * Reset user (when wallet is disconnected)
 */
export function resetUser() {
  if (!POSTHOG_KEY || !posthog.__loaded) return;

  posthog.reset();
}

/**
 * Get PostHog instance (for advanced usage)
 */
export function getPostHog() {
  return posthog.__loaded ? posthog : null;
}




