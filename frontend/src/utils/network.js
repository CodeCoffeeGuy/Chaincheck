/**
 * Network Status Utility
 * Provides network connectivity detection and status monitoring
 */

/**
 * Check if browser is online
 */
export function isOnline() {
  if (typeof navigator !== "undefined" && "onLine" in navigator) {
    return navigator.onLine;
  }
  return true; // Assume online if can't determine
}

/**
 * Get network connection information (if available)
 */
export function getNetworkInfo() {
  if (typeof navigator !== "undefined" && "connection" in navigator) {
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    
    if (connection) {
      return {
        effectiveType: connection.effectiveType || "unknown",
        downlink: connection.downlink || 0,
        rtt: connection.rtt || 0,
        saveData: connection.saveData || false,
      };
    }
  }
  
  return null;
}

/**
 * Check if connection is slow (based on effectiveType)
 */
export function isSlowConnection() {
  const info = getNetworkInfo();
  if (!info) {
    return false;
  }
  
  const slowTypes = ["slow-2g", "2g"];
  return slowTypes.includes(info.effectiveType);
}

/**
 * Check if save data mode is enabled
 */
export function isSaveDataMode() {
  const info = getNetworkInfo();
  return info?.saveData || false;
}

/**
 * Wait for online status
 */
export function waitForOnline(timeout = 30000) {
  return new Promise((resolve, reject) => {
    if (isOnline()) {
      resolve(true);
      return;
    }
    
    const timeoutId = setTimeout(() => {
      window.removeEventListener("online", onlineHandler);
      reject(new Error("Timeout waiting for online status"));
    }, timeout);
    
    const onlineHandler = () => {
      clearTimeout(timeoutId);
      window.removeEventListener("online", onlineHandler);
      resolve(true);
    };
    
    window.addEventListener("online", onlineHandler);
  });
}

/**
 * Monitor network status changes
 */
export function onNetworkStatusChange(callback) {
  if (typeof window === "undefined") {
    return () => {}; // Return no-op cleanup function
  }
  
  const onlineHandler = () => callback({ online: true });
  const offlineHandler = () => callback({ online: false });
  
  window.addEventListener("online", onlineHandler);
  window.addEventListener("offline", offlineHandler);
  
  // Return cleanup function
  return () => {
    window.removeEventListener("online", onlineHandler);
    window.removeEventListener("offline", offlineHandler);
  };
}

/**
 * Test network connectivity by pinging a URL
 */
export async function testConnectivity(url = "https://www.google.com/favicon.ico", timeout = 5000) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    const response = await fetch(url, {
      method: "HEAD",
      mode: "no-cors",
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Get network quality indicator
 */
export function getNetworkQuality() {
  const info = getNetworkInfo();
  if (!info) {
    return "unknown";
  }
  
  const { effectiveType, downlink, rtt } = info;
  
  if (effectiveType === "4g" && downlink >= 10 && rtt < 100) {
    return "excellent";
  }
  if (effectiveType === "4g" || (effectiveType === "3g" && downlink >= 1.5)) {
    return "good";
  }
  if (effectiveType === "3g" || effectiveType === "2g") {
    return "fair";
  }
  if (effectiveType === "slow-2g") {
    return "poor";
  }
  
  return "unknown";
}

