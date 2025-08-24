/**
 * Service Worker Fetch Handlers
 */

/**
 * Handle navigation requests with network-first strategy
 */
function handleNavigationRequest(request) {
  return fetch(request)
    .then((response) => {
      if (!shouldSkipCaching(request, response)) {
        const copy = response.clone();
        caches.open(RUNTIME_CACHE).then((cache) => {
          cache.put('/index.html', copy);
        });
      }
      return response;
    })
    .catch(() => {
      // Fallback to cache if network fails
      return caches.match('/index.html');
    });
}

/**
 * Handle built assets (CSS/JS) with network-first strategy
 */
function handleBuiltAsset(request) {
  return fetch(request)
    .then((response) => {
      // Security check before caching
      if (!shouldSkipCaching(request, response)) {
        // Cache the fresh response
        if (response && response.status === 200) {
          const responseToCache = response.clone();
          caches.open(RUNTIME_CACHE).then((cache) => {
            cache.put(request, responseToCache);
          });
        }
      }
      return response;
    })
    .catch(() => {
      // Fallback to cache if network fails
      return caches.match(request);
    });
}

/**
 * Handle other assets with cache-first strategy
 */
function handleCacheableAsset(request) {
  return caches.match(request)
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
    });
}

/**
 * Main fetch event handler that routes to appropriate strategy
 */
function handleFetchEvent(event) {
  const request = event.request;
  const url = request.url;

  // Skip non-GET requests, chrome-extension requests, and different origins
  if (request.method !== 'GET' ||
      url.startsWith('chrome-extension://') ||
      !isAllowedOrigin(url)) {
    return;
  }

  // Always use network-first for navigation requests
  if (request.mode === 'navigate') {
    event.respondWith(handleNavigationRequest(request));
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
    event.respondWith(handleBuiltAsset(request));
    return;
  }
  
  // For other allowed assets, use cache-first strategy
  event.respondWith(handleCacheableAsset(request));
}