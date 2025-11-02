/// <reference lib="webworker" />

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
  const evt = event as ExtendableEvent;
  evt.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[ServiceWorker] Pre-caching App Shell');
      return cache.addAll(FILES_TO_CACHE);
    })
  );
});

// Activate event: clean up old caches
self.addEventListener('activate', (event) => {
  const evt = event as ExtendableEvent;
  evt.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (key !== CACHE_NAME && key !== API_CACHE_NAME) {
          console.log('[ServiceWorker] Removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
  );
  (self as any).clients.claim();
});

// Fetch event: serve assets from cache if available, otherwise fetch from network
self.addEventListener('fetch', (event) => {
  const evt = event as FetchEvent;
  const url = new URL(evt.request.url);

  // API calls: Network first, then cache
  if (url.hostname.includes('supabase.co')) {
    evt.respondWith(
      fetch(evt.request)
        .then(response => {
          // If the request is successful, update the cache
          if (response.ok) {
            const responseToCache = response.clone();
            caches.open(API_CACHE_NAME).then(cache => {
              cache.put(evt.request, responseToCache);
            });
          }
          return response;
        })
        .catch(() => {
          // If network fails, try to serve from cache
          return caches.match(evt.request).then(cachedResponse => {
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
  if (evt.request.method === 'GET') {
    evt.respondWith(
      caches.open(CACHE_NAME).then(async (cache) => {
        const cachedResponse = await cache.match(evt.request);
        if (cachedResponse) {
          return cachedResponse;
        }
        
        try {
          const networkResponse = await fetch(evt.request);
          if (evt.request.url.startsWith('http')) {
            const responseToCache = networkResponse.clone();
            cache.put(evt.request, responseToCache);
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
    // FIX: Cast event to 'any' to avoid TypeScript error for missing SyncEvent type definition.
    const evt = event as any;
    if (evt.tag === 'sync-data') {
        console.log('[ServiceWorker] Background sync triggered for tag:', evt.tag);
        evt.waitUntil(
            // Placeholder for sync logic, e.g., reading from IndexedDB and sending to server.
            Promise.resolve().then(() => console.log('[ServiceWorker] Sync complete.'))
        );
    }
});

// Periodic Sync for background data updates
self.addEventListener('periodicsync', (event) => {
    // FIX: Cast event to 'any' to avoid TypeScript error for missing PeriodicSyncEvent type definition.
    const evt = event as any;
    if (evt.tag === 'update-content') {
        console.log('[ServiceWorker] Periodic sync triggered for tag:', evt.tag);
        evt.waitUntil(
            // Placeholder for periodic data fetch logic
             Promise.resolve().then(() => console.log('[ServiceWorker] Periodic update complete.'))
        );
    }
});

// Push notification received
self.addEventListener('push', (event) => {
    const evt = event as PushEvent;
    const data = evt.data ? evt.data.json() : { title: 'حرفي', body: 'لديك إشعار جديد!', tag: 'general' };
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
    // FIX: Cast 'self' to 'any' to access the 'registration' property, resolving a type inference issue.
    evt.waitUntil((self as any).registration.showNotification(title, options));
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
    const evt = event as NotificationEvent;
    evt.notification.close();
    evt.waitUntil(
        (self as any).clients.matchAll({ type: 'window' }).then((clientList: any[]) => {
            const urlToOpen = new URL(evt.notification.data.url || '/', self.location.origin).href;
            
            for (const client of clientList) {
                if (client.url === urlToOpen && 'focus' in client) {
                    return client.focus();
                }
            }
            if ((self as any).clients.openWindow) {
                return (self as any).clients.openWindow(urlToOpen);
            }
        })
    );
});


// Add an empty export to treat this file as a module.
export {};
