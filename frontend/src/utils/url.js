/**
 * URL Utilities
 * Provides URL parsing, building, and manipulation functions
 */

/**
 * Parse URL into components
 * @param {string} url - URL to parse
 * @returns {Object|null} Parsed URL object or null if invalid
 */
export function parseUrl(url) {
  if (typeof url !== "string" || url.trim().length === 0) {
    return null;
  }
  
  try {
    const urlObj = new URL(url);
    return {
      href: urlObj.href,
      protocol: urlObj.protocol,
      hostname: urlObj.hostname,
      port: urlObj.port,
      pathname: urlObj.pathname,
      search: urlObj.search,
      hash: urlObj.hash,
      origin: urlObj.origin,
      host: urlObj.host,
    };
  } catch (error) {
    return null;
  }
}

/**
 * Build URL from components
 * @param {Object} components - URL components
 * @param {string} components.protocol - Protocol (e.g., "https:")
 * @param {string} components.hostname - Hostname
 * @param {string} components.port - Port (optional)
 * @param {string} components.pathname - Path (optional)
 * @param {Object|string} components.search - Query string or object (optional)
 * @param {string} components.hash - Hash (optional)
 * @returns {string} Built URL
 */
export function buildUrl(components) {
  if (typeof components !== "object" || components === null) {
    return "";
  }
  
  const { protocol, hostname, port, pathname, search, hash } = components;
  
  if (!protocol || !hostname) {
    return "";
  }
  
  let url = `${protocol}//${hostname}`;
  
  if (port) {
    url += `:${port}`;
  }
  
  if (pathname) {
    const path = pathname.startsWith("/") ? pathname : `/${pathname}`;
    url += path;
  }
  
  if (search) {
    const queryString = typeof search === "string" 
      ? (search.startsWith("?") ? search : `?${search}`)
      : buildQueryString(search);
    url += queryString;
  }
  
  if (hash) {
    url += hash.startsWith("#") ? hash : `#${hash}`;
  }
  
  return url;
}

/**
 * Parse query string into object
 * @param {string} queryString - Query string (with or without "?")
 * @returns {Object} Parsed query parameters
 */
export function parseQueryString(queryString) {
  if (typeof queryString !== "string") {
    return {};
  }
  
  const cleanQuery = queryString.startsWith("?") ? queryString.slice(1) : queryString;
  if (cleanQuery.length === 0) {
    return {};
  }
  
  const params = {};
  const pairs = cleanQuery.split("&");
  
  for (const pair of pairs) {
    const [key, value = ""] = pair.split("=");
    const decodedKey = decodeURIComponent(key);
    const decodedValue = decodeURIComponent(value);
    
    // Handle array parameters (key[]=value)
    if (decodedKey.endsWith("[]")) {
      const arrayKey = decodedKey.slice(0, -2);
      if (!params[arrayKey]) {
        params[arrayKey] = [];
      }
      params[arrayKey].push(decodedValue);
    } else if (key in params) {
      // Multiple values for same key - convert to array
      if (!Array.isArray(params[decodedKey])) {
        params[decodedKey] = [params[decodedKey]];
      }
      params[decodedKey].push(decodedValue);
    } else {
      params[decodedKey] = decodedValue;
    }
  }
  
  return params;
}

/**
 * Build query string from object
 * @param {Object} params - Query parameters object
 * @param {boolean} encode - Whether to encode values (default: true)
 * @returns {string} Query string (without "?")
 */
export function buildQueryString(params, encode = true) {
  if (typeof params !== "object" || params === null) {
    return "";
  }
  
  const pairs = [];
  
  for (const key in params) {
    if (params.hasOwnProperty(key)) {
      const value = params[key];
      
      if (value === null || value === undefined) {
        continue;
      }
      
      const encodedKey = encode ? encodeURIComponent(key) : key;
      
      if (Array.isArray(value)) {
        for (const item of value) {
          const encodedValue = encode ? encodeURIComponent(item) : item;
          pairs.push(`${encodedKey}[]=${encodedValue}`);
        }
      } else {
        const encodedValue = encode ? encodeURIComponent(value) : value;
        pairs.push(`${encodedKey}=${encodedValue}`);
      }
    }
  }
  
  return pairs.join("&");
}

/**
 * Get query parameter from URL
 * @param {string} url - URL or query string
 * @param {string} key - Parameter key
 * @param {*} defaultValue - Default value if not found
 * @returns {*} Parameter value or default
 */
export function getQueryParam(url, key, defaultValue = null) {
  if (typeof url !== "string" || typeof key !== "string") {
    return defaultValue;
  }
  
  const params = parseQueryString(url.includes("?") ? url.split("?")[1] : url);
  return key in params ? params[key] : defaultValue;
}

/**
 * Set query parameter in URL
 * @param {string} url - Base URL
 * @param {string} key - Parameter key
 * @param {*} value - Parameter value
 * @returns {string} URL with updated parameter
 */
export function setQueryParam(url, key, value) {
  if (typeof url !== "string" || typeof key !== "string") {
    return url;
  }
  
  const urlObj = parseUrl(url);
  if (!urlObj) {
    return url;
  }
  
  const params = parseQueryString(urlObj.search);
  params[key] = value;
  
  const queryString = buildQueryString(params);
  const newSearch = queryString ? `?${queryString}` : "";
  
  return buildUrl({
    protocol: urlObj.protocol,
    hostname: urlObj.hostname,
    port: urlObj.port,
    pathname: urlObj.pathname,
    search: newSearch,
    hash: urlObj.hash,
  });
}

/**
 * Remove query parameter from URL
 * @param {string} url - Base URL
 * @param {string} key - Parameter key to remove
 * @returns {string} URL without the parameter
 */
export function removeQueryParam(url, key) {
  if (typeof url !== "string" || typeof key !== "string") {
    return url;
  }
  
  const urlObj = parseUrl(url);
  if (!urlObj) {
    return url;
  }
  
  const params = parseQueryString(urlObj.search);
  delete params[key];
  
  const queryString = buildQueryString(params);
  const newSearch = queryString ? `?${queryString}` : "";
  
  return buildUrl({
    protocol: urlObj.protocol,
    hostname: urlObj.hostname,
    port: urlObj.port,
    pathname: urlObj.pathname,
    search: newSearch,
    hash: urlObj.hash,
  });
}

/**
 * Check if URL is valid
 * @param {string} url - URL to validate
 * @returns {boolean} True if URL is valid
 */
export function isValidUrl(url) {
  if (typeof url !== "string" || url.trim().length === 0) {
    return false;
  }
  
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Check if URL is absolute (starts with protocol)
 * @param {string} url - URL to check
 * @returns {boolean} True if absolute URL
 */
export function isAbsoluteUrl(url) {
  if (typeof url !== "string") {
    return false;
  }
  
  return /^[a-z][a-z\d+\-.]*:/.test(url);
}

/**
 * Make URL absolute
 * @param {string} url - Relative or absolute URL
 * @param {string} baseUrl - Base URL for relative URLs
 * @returns {string} Absolute URL
 */
export function makeAbsolute(url, baseUrl = window?.location?.href || "") {
  if (typeof url !== "string") {
    return "";
  }
  
  if (isAbsoluteUrl(url)) {
    return url;
  }
  
  try {
    return new URL(url, baseUrl).href;
  } catch {
    return url;
  }
}

/**
 * Get domain from URL
 * @param {string} url - URL to extract domain from
 * @returns {string} Domain or empty string
 */
export function getDomain(url) {
  const urlObj = parseUrl(url);
  return urlObj ? urlObj.hostname : "";
}

/**
 * Get path from URL
 * @param {string} url - URL to extract path from
 * @returns {string} Path or empty string
 */
export function getPath(url) {
  const urlObj = parseUrl(url);
  return urlObj ? urlObj.pathname : "";
}

/**
 * Build PolygonScan transaction URL
 * @param {string} txHash - Transaction hash
 * @param {string} network - Network name ("polygon", "mumbai", or "localhost")
 * @returns {string} PolygonScan URL
 */
export function buildPolygonScanUrl(txHash, network = "polygon") {
  if (typeof txHash !== "string" || txHash.trim().length === 0) {
    return "";
  }
  
  const networks = {
    polygon: "polygonscan.com",
    mumbai: "mumbai.polygonscan.com",
    localhost: "",
  };
  
  const domain = networks[network.toLowerCase()] || networks.polygon;
  
  if (!domain) {
    return ""; // Localhost - no explorer available
  }
  
  return `https://${domain}/tx/${txHash}`;
}

/**
 * Build PolygonScan address URL
 * @param {string} address - Ethereum address
 * @param {string} network - Network name ("polygon", "mumbai", or "localhost")
 * @returns {string} PolygonScan URL
 */
export function buildPolygonScanAddressUrl(address, network = "polygon") {
  if (typeof address !== "string" || address.trim().length === 0) {
    return "";
  }
  
  const networks = {
    polygon: "polygonscan.com",
    mumbai: "mumbai.polygonscan.com",
    localhost: "",
  };
  
  const domain = networks[network.toLowerCase()] || networks.polygon;
  
  if (!domain) {
    return ""; // Localhost - no explorer available
  }
  
  return `https://${domain}/address/${address}`;
}

/**
 * Build share URL with query parameters
 * @param {string} baseUrl - Base URL
 * @param {Object} params - Parameters to add
 * @returns {string} Share URL
 */
export function buildShareUrl(baseUrl, params = {}) {
  if (typeof baseUrl !== "string" || baseUrl.trim().length === 0) {
    return "";
  }
  
  const urlObj = parseUrl(baseUrl);
  if (!urlObj) {
    return baseUrl;
  }
  
  const existingParams = parseQueryString(urlObj.search);
  const mergedParams = { ...existingParams, ...params };
  const queryString = buildQueryString(mergedParams);
  
  return buildUrl({
    protocol: urlObj.protocol,
    hostname: urlObj.hostname,
    port: urlObj.port,
    pathname: urlObj.pathname,
    search: queryString ? `?${queryString}` : "",
    hash: urlObj.hash,
  });
}

/**
 * Normalize URL (remove trailing slash, normalize protocol, etc.)
 * @param {string} url - URL to normalize
 * @returns {string} Normalized URL
 */
export function normalizeUrl(url) {
  if (typeof url !== "string" || url.trim().length === 0) {
    return "";
  }
  
  try {
    const urlObj = new URL(url);
    
    // Remove trailing slash from pathname (except root)
    let pathname = urlObj.pathname;
    if (pathname.length > 1 && pathname.endsWith("/")) {
      pathname = pathname.slice(0, -1);
    }
    
    // Normalize protocol (remove trailing colon if missing)
    let protocol = urlObj.protocol;
    if (!protocol.endsWith(":")) {
      protocol += ":";
    }
    
    return buildUrl({
      protocol,
      hostname: urlObj.hostname,
      port: urlObj.port,
      pathname,
      search: urlObj.search,
      hash: urlObj.hash,
    });
  } catch {
    return url;
  }
}

/**
 * Get URL without query parameters
 * @param {string} url - URL to process
 * @returns {string} URL without query string
 */
export function getUrlWithoutQuery(url) {
  if (typeof url !== "string") {
    return "";
  }
  
  const urlObj = parseUrl(url);
  if (!urlObj) {
    return url.split("?")[0].split("#")[0];
  }
  
  return buildUrl({
    protocol: urlObj.protocol,
    hostname: urlObj.hostname,
    port: urlObj.port,
    pathname: urlObj.pathname,
    hash: urlObj.hash,
  });
}

/**
 * Get URL without hash
 * @param {string} url - URL to process
 * @returns {string} URL without hash
 */
export function getUrlWithoutHash(url) {
  if (typeof url !== "string") {
    return "";
  }
  
  const urlObj = parseUrl(url);
  if (!urlObj) {
    return url.split("#")[0];
  }
  
  return buildUrl({
    protocol: urlObj.protocol,
    hostname: urlObj.hostname,
    port: urlObj.port,
    pathname: urlObj.pathname,
    search: urlObj.search,
  });
}

/**
 * Encode URL component
 * @param {string} str - String to encode
 * @returns {string} Encoded string
 */
export function encodeUrl(str) {
  if (typeof str !== "string") {
    return "";
  }
  
  return encodeURIComponent(str);
}

/**
 * Decode URL component
 * @param {string} str - Encoded string
 * @returns {string} Decoded string
 */
export function decodeUrl(str) {
  if (typeof str !== "string") {
    return "";
  }
  
  try {
    return decodeURIComponent(str);
  } catch {
    return str;
  }
}

