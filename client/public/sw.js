// Cache version - increment when updating cache strategy
const CACHE_VERSION = '1.0.1';
const CACHE_NAME = `cozy-critter-static-${CACHE_VERSION}`;
const RUNTIME_CACHE = `cozy-critter-runtime-${CACHE_VERSION}`;

// Only cache built static assets - limit to essential files
const STATIC_RESOURCES = [
  '/',
  '/index.html',
  '/manifest.json',
  '/pwa-icon.svg'
  // Note: CSS and JS are handled by Vite in production builds
];

// Paths that should NEVER be cached (sensitive/dynamic content)
const CACHE_BLACKLIST = [
  '/api/',           // All API endpoints
  '/auth/',          // Authentication endpoints
  '/login',          // Login pages
  '/logout',         // Logout endpoints
  '/admin/',         // Admin interfaces
  '/user/',          // User-specific data
  '/session',        // Session endpoints
  '/token',          // Token endpoints
  '/oauth',          // OAuth flows
  '/callback',       // Auth callbacks
  '/webhook',        // Webhook endpoints
  '/socket',         // WebSocket connections
];

// Allowed file extensions for caching (built assets only)
const CACHEABLE_EXTENSIONS = [
  '.html',
  '.css',
  '.js',
  '.mjs',
  '.json',
  '.svg',
  '.png',
  '.jpg',
  '.jpeg',
  '.webp',
  '.ico',
  '.woff',
  '.woff2',
  '.ttf',
  '.eot'
];

// Sensitive headers that indicate responses should not be cached
const SENSITIVE_HEADERS = [
  'set-cookie',
  'authorization',
  'x-csrf-token',
  'x-auth-token',
  'x-session-token',
  'authenticate',
  'proxy-authenticate',
  'www-authenticate'
];

// Install event - cache static resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(STATIC_RESOURCES);
      })
      .then(() => {
        // Force activation of new service worker
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('Service Worker installation failed:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
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
      })
      .then(() => {
        // Take control of all clients
        return self.clients.claim();
      })
  );
});

// Security helper functions
function isAllowedOrigin(url) {
  try {
    const requestUrl = new URL(url);
    const currentOrigin = self.location.origin;
    
    // Only allow same-origin requests
    return requestUrl.origin === currentOrigin;
  } catch (e) {
    return false;
  }
}

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

function isCacheableAsset(url) {
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    
    // Check if it has a cacheable extension
    return CACHEABLE_EXTENSIONS.some(ext => pathname.endsWith(ext)) ||
           pathname === '/' ||
           pathname === '/index.html';
  } catch (e) {
    return false;
  }
}

// Fetch event - secure caching strategy
self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = request.url;
  
  // Skip non-GET requests, chrome-extension requests, and different origins
  if (request.method !== 'GET' || 
      url.startsWith('chrome-extension://') || 
      !isAllowedOrigin(url)) {
    return;
  }
  
  // Skip requests that shouldn't be cached
  if (shouldSkipCaching(request)) {
    return;
  }
  
  // Only cache allowed asset types
  if (!isCacheableAsset(url)) {
    return;
  }
  
  // For built CSS and JS files, use network-first strategy
  const isBuiltAsset = url.includes('.css') || 
                       url.includes('.js') || 
                       url.includes('.mjs');
  
  if (isBuiltAsset) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Security check before caching
          if (shouldSkipCaching(request, response)) {
            return response;
          }
          
          // Cache the fresh response
          if (response && response.status === 200) {
            const responseToCache = response.clone();
            caches.open(RUNTIME_CACHE).then((cache) => {
              cache.put(request, responseToCache);
            });
          }
          return response;
        })
        .catch(() => {
          // Fallback to cache if network fails
          return caches.match(request);
        })
    );
    return;
  }
  
  // For other allowed assets, use cache-first strategy
  event.respondWith(
    caches.match(request)
      .then((cachedResponse) => {
        // Return cached version if available
        if (cachedResponse) {
          return cachedResponse;
        }
        
        // Otherwise fetch from network
        return fetch(request)
          .then((response) => {
            // Security check before caching
            if (shouldSkipCaching(request, response)) {
              return response;
            }
            
            // Clone the response since it can only be consumed once
            const responseToCache = response.clone();
            
            // Cache the new response
            caches.open(RUNTIME_CACHE)
              .then((cache) => {
                cache.put(request, responseToCache);
              });
            
            return response;
          })
          .catch((error) => {
            // For navigation requests, return the cached index.html
            if (request.mode === 'navigate') {
              return caches.match('/index.html');
            }
            
            throw error;
          });
      })
  );
});

// Background sync for when connectivity returns
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    // Here you could sync any pending mood entries or custom messages
    // that couldn't be processed while offline
  }
});

// Push notifications (for future use)
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body || 'Time for your mood check-in! 🐾',
      icon: '/pwa-192x192.png',
      badge: '/pwa-192x192.png',
      tag: 'mood-reminder',
      requireInteraction: false,
      actions: [
        {
          action: 'checkin',
          title: 'Check-in now'
        },
        {
          action: 'dismiss',
          title: 'Later'
        }
      ]
    };

    event.waitUntil(
      self.registration.showNotification(data.title || 'Cozy Critter', options)
    );
  }
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action === 'checkin') {
    event.waitUntil(
      clients.openWindow('/?action=checkin')
    );
  }
});