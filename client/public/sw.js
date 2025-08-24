// Import utilities and handlers
importScripts('./sw-utils.js');
importScripts('./sw-fetch-handlers.js');

// Install event - cache static resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    cacheStaticResources()
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
    cleanupOldCaches()
      .then(() => {
        // Take control of all clients
        return self.clients.claim();
      })
  );
});

// Fetch event - use modular handlers
self.addEventListener('fetch', handleFetchEvent);

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
