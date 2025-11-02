// This service worker is designed to make the app work offline by caching assets.

const CACHE_NAME = 'hirafi-cache-v2'; // Bump cache version
const API_CACHE_NAME = 'hirafi-api-cache-v1';

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
        if (key !== CACHE_NAME && key !== API_CACHE_NAME) {
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
  const url = new URL(event.request.url);

  // API calls: Network first, then cache
  if (url.hostname.includes('supabase.co')) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // If the request is successful, update the cache
          if (response.ok) {
            const responseToCache = response.clone();
            caches.open(API_CACHE_NAME).then(cache => {
              cache.put(event.request, responseToCache);
            });
          }
          return response;
        })
        .catch(() => {
          // If network fails, try to serve from cache
          return caches.match(event.request).then(cachedResponse => {
            if (cachedResponse) {
              return cachedResponse;
            }
            // If not in cache either, return a generic error response
            return new Response(JSON.stringify({ error: 'offline' }), {
              status: 503,
              headers: { 'Content-Type': 'application/json' },
            });
          });
        })
    );
    return;
  }

  // For other requests (app shell, images, etc.), use cache-first strategy
  if (event.request.method === 'GET') {
    event.respondWith(
      caches.open(CACHE_NAME).then(async (cache) => {
        const cachedResponse = await cache.match(event.request);
        if (cachedResponse) {
          return cachedResponse;
        }
        
        try {
          const networkResponse = await fetch(event.request);
          if (event.request.url.startsWith('http')) {
            const responseToCache = networkResponse.clone();
            cache.put(event.request, responseToCache);
          }
          return networkResponse;
        } catch (error) {
          console.error('[ServiceWorker] Fetch failed:', error);
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
