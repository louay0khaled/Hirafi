// FIX: Add a triple-slash directive to include webworker types, which resolves errors for ExtendableEvent and FetchEvent.
/// <reference lib="webworker" />

// This service worker is designed to make the app work offline by caching assets.

const CACHE_NAME = 'hirafi-cache-v1';

// List of files that make up the "app shell"
const FILES_TO_CACHE = [
  '/',
  '/index.html',
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
        if (key !== CACHE_NAME) {
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

  // Don't cache requests to Supabase API to ensure data freshness
  if (url.hostname.includes('supabase.co')) {
    evt.respondWith(fetch(evt.request));
    return;
  }

  // We only want to handle GET requests for other resources
  if (evt.request.method !== 'GET') {
    return;
  }
  
  evt.respondWith(
    caches.open(CACHE_NAME).then(async (cache) => {
      // Try to get the resource from the cache
      const cachedResponse = await cache.match(evt.request);
      // If it's in the cache, return it
      if (cachedResponse) {
        return cachedResponse;
      }
      
      // If it's not in the cache, fetch it from the network
      try {
        const networkResponse = await fetch(evt.request);
        // Don't cache chrome-extension:// requests or other non-http requests
        if (evt.request.url.startsWith('http')) {
           // Clone the response because it's a one-time-use stream
          const responseToCache = networkResponse.clone();
          // Add the new resource to the cache
          cache.put(evt.request, responseToCache);
        }
        // Return the network response
        return networkResponse;
      } catch (error) {
        // Handle fetch errors, e.g., when offline
        console.error('[ServiceWorker] Fetch failed:', error);
        // You could return a fallback offline page here if you have one
        return new Response("Network error happened", {
          status: 408,
          headers: { "Content-Type": "text/plain" },
        });
      }
    })
  );
});