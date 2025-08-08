const CACHE_NAME = 'cozy-critter-v1.0.0';
const RUNTIME_CACHE = 'cozy-critter-runtime';

// Resources to cache on install
const STATIC_RESOURCES = [
  '/',
  '/index.html',
  '/src/main.tsx',
  '/src/index.css',
  '/manifest.json',
  // Add other static assets as needed
];

// Install event - cache static resources
self.addEventListener('install', (event) => {
  console.log('🐾 Cozy Critter Service Worker: Installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('🐾 Caching static resources');
        return cache.addAll(STATIC_RESOURCES);
      })
      .then(() => {
        console.log('🐾 Service Worker installed successfully');
        // Force activation of new service worker
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('🐾 Service Worker installation failed:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('🐾 Cozy Critter Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE) {
              console.log('🐾 Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('🐾 Service Worker activated successfully');
        // Take control of all clients
        return self.clients.claim();
      })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests and chrome-extension requests
  if (event.request.method !== 'GET' || event.request.url.startsWith('chrome-extension://')) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        // Return cached version if available
        if (cachedResponse) {
          console.log('🐾 Serving from cache:', event.request.url);
          return cachedResponse;
        }

        // Otherwise fetch from network
        return fetch(event.request)
          .then((response) => {
            // Don't cache non-successful responses
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response since it can only be consumed once
            const responseToCache = response.clone();

            // Cache the new response
            caches.open(RUNTIME_CACHE)
              .then((cache) => {
                console.log('🐾 Caching new resource:', event.request.url);
                cache.put(event.request, responseToCache);
              });

            return response;
          })
          .catch((error) => {
            console.log('🐾 Network request failed, serving offline fallback');
            
            // For navigation requests, return the cached index.html
            if (event.request.mode === 'navigate') {
              return caches.match('/index.html');
            }
            
            // For other requests, you could return a generic offline page or asset
            throw error;
          });
      })
  );
});

// Background sync for when connectivity returns
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    console.log('🐾 Background sync triggered');
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
  console.log('🐾 Notification clicked:', event.action);
  
  event.notification.close();
  
  if (event.action === 'checkin') {
    event.waitUntil(
      clients.openWindow('/?action=checkin')
    );
  }
});