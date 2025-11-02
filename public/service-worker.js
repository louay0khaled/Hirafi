// This service worker is designed to make the app work offline by caching assets.

const CACHE_NAME = 'hirafi-cache-v2'; // Bump cache version
const DYNAMIC_CACHE_NAME = 'hirafi-dynamic-cache-v1';

// List of files that make up the "app shell"
const FILES_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/icons/icon-maskable-512x512.png'
];

// Install event: open a cache and add the app shell files to it
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[ServiceWorker] Pre-caching App Shell');
      return cache.addAll(FILES_TO_CACHE);
    })
  );
});

// Activate event: clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (key !== CACHE_NAME && key !== DYNAMIC_CACHE_NAME) {
          console.log('[ServiceWorker] Removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
  );
  self.clients.claim();
});

// Fetch event: serve assets from cache if available, otherwise fetch from network
self.addEventListener('fetch', (event) => {
  // Use cache-first strategy for all GET requests
  if (event.request.method === 'GET') {
    event.respondWith(
      caches.open(DYNAMIC_CACHE_NAME).then(async (cache) => {
        // 1. Try to get the resource from the dynamic cache
        const cachedResponse = await cache.match(event.request);
        if (cachedResponse) {
          return cachedResponse;
        }

        // 2. If not in cache, fetch from network
        try {
          const networkResponse = await fetch(event.request);
          // Only cache successful responses for http/https requests
          if (networkResponse.ok && event.request.url.startsWith('http')) {
            const responseToCache = networkResponse.clone();
            cache.put(event.request, responseToCache);
          }
          return networkResponse;
        } catch (error) {
          console.error('[ServiceWorker] Fetch failed:', error);

          // 3. As a fallback, try to find in the static cache (for app shell files)
          const staticCacheResponse = await caches.match(event.request, { cacheName: CACHE_NAME });
          if (staticCacheResponse) return staticCacheResponse;

          // 4. If nothing works, return a generic error response
          return new Response("Network error happened", {
            status: 408,
            headers: { "Content-Type": "text/plain" },
          });
        }
      })
    );
  }
});


// Background Sync event for deferred actions
self.addEventListener('sync', (event) => {
    if (event.tag === 'sync-data') {
        console.log('[ServiceWorker] Background sync triggered for tag:', event.tag);
        event.waitUntil(
            // Placeholder for sync logic, e.g., reading from IndexedDB and sending to server.
            Promise.resolve().then(() => console.log('[ServiceWorker] Sync complete.'))
        );
    }
});

// Periodic Sync for background data updates
self.addEventListener('periodicsync', (event) => {
    if (event.tag === 'update-content') {
        console.log('[ServiceWorker] Periodic sync triggered for tag:', event.tag);
        event.waitUntil(
            // Placeholder for periodic data fetch logic
             Promise.resolve().then(() => console.log('[ServiceWorker] Periodic update complete.'))
        );
    }
});

// Push notification received
self.addEventListener('push', (event) => {
    const data = event.data ? event.data.json() : { title: 'حرفي', body: 'لديك إشعار جديد!', tag: 'general' };
    const title = data.title;
    const options = {
        body: data.body,
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-192x192.png',
        tag: data.tag,
        data: {
            url: data.url || '/'
        }
    };
    event.waitUntil(self.registration.showNotification(title, options));
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    event.waitUntil(
        self.clients.matchAll({ type: 'window' }).then((clientList) => {
            const urlToOpen = new URL(event.notification.data.url || '/', self.location.origin).href;
            
            for (const client of clientList) {
                if (client.url === urlToOpen && 'focus' in client) {
                    return client.focus();
                }
            }
            if (self.clients.openWindow) {
                return self.clients.openWindow(urlToOpen);
            }
        })
    );
});
