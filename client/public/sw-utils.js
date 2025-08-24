/**
 * Service Worker Utilities - Cache Management
 */

// Cache configuration
const CACHE_VERSION = '1.0.1';
const CACHE_NAME = `cozy-critter-static-${CACHE_VERSION}`;
const RUNTIME_CACHE = `cozy-critter-runtime-${CACHE_VERSION}`;

// Cache configuration
const STATIC_RESOURCES = [
  '/',
  '/index.html',
  '/manifest.json',
  '/pwa-icon.svg'
];

const CACHE_BLACKLIST = [
  '/api/',
];

const CACHEABLE_EXTENSIONS = [
  '.html', '.css', '.js', '.mjs', '.json', '.svg',
  '.png', '.jpg', '.jpeg', '.webp', '.ico',
  '.woff', '.woff2', '.ttf', '.eot'
];

const SENSITIVE_HEADERS = [
  'set-cookie'
];

/**
 * Check if a URL has a cacheable extension or is a special route
 */
function isCacheableAsset(url) {
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    
    return CACHEABLE_EXTENSIONS.some(ext => pathname.endsWith(ext)) ||
           pathname === '/' ||
           pathname === '/index.html';
  } catch (e) {
    return false;
  }
}

/**
 * Check if a URL is from an allowed origin
 */
function isAllowedOrigin(url) {
  try {
    const requestUrl = new URL(url);
    const currentOrigin = self.location.origin;
    
    return requestUrl.origin === currentOrigin;
  } catch (e) {
    return false;
  }
}

/**
 * Determine if a request/response should skip caching
 */
function shouldSkipCaching(request, response) {
  const url = request.url;
  
  // Skip if different origin
  if (!isAllowedOrigin(url)) {
    return true;
  }
  
  // Skip blacklisted paths
  const pathname = new URL(url).pathname;
  if (CACHE_BLACKLIST.some(blacklistedPath => pathname.startsWith(blacklistedPath))) {
    return true;
  }
  
  // Skip if response has sensitive headers
  if (response) {
    for (const sensitiveHeader of SENSITIVE_HEADERS) {
      if (response.headers.has(sensitiveHeader)) {
        return true;
      }
    }
    
    // Skip non-successful responses
    if (response.status < 200 || response.status >= 300) {
      return true;
    }
    
    // Skip non-basic responses (from different origins or with opaque responses)
    if (response.type !== 'basic' && response.type !== 'cors') {
      return true;
    }
  }
  
  return false;
}

/**
 * Clean up old cache versions
 */
function cleanupOldCaches() {
  return caches.keys()
    .then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // Clean up old versions of our caches
          if (cacheName.startsWith('cozy-critter-') && 
              cacheName !== CACHE_NAME && 
              cacheName !== RUNTIME_CACHE) {
            console.log('Cleaning up old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    });
}

/**
 * Cache static resources during installation
 */
function cacheStaticResources() {
  return caches.open(CACHE_NAME)
    .then((cache) => {
      return cache.addAll(STATIC_RESOURCES);
    });
}