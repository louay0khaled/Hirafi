// FIX: Add a triple-slash directive to include webworker types, which resolves errors for ExtendableEvent and FetchEvent.
/// <reference lib="webworker" />

// This service worker is designed to make the app work offline by caching assets.

const CACHE_NAME = 'hirafi-cache-v1';

// List of files that make up the "app shell"
const FILES_TO_CACHE = [
  '/',
  '/index.html',
  '/index.tsx', // In a real build, this would be compiled to index.js
  '/App.tsx',
  '/types.ts',
  '/constants.ts',
  '/data/craftsmen.ts',
  '/components/BottomNav.tsx',
  '/components/CraftsmanCard.tsx',
  '/components/Header.tsx',
  '/components/Icons.tsx',
  '/components/SkeletonLoader.tsx',
  '/screens/HomeScreen.tsx',
  '/screens/BrowseScreen.tsx',
  '/screens/ProfileScreen.tsx',
  '/screens/MessagesScreen.tsx',
  '/screens/AccountScreen.tsx',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  'https://cdn.tailwindcss.com',
  // Caching CDN assets for React
  'https://aistudiocdn.com/react@^19.2.0',
  'https://aistudiocdn.com/react-dom@^19.2.0/client',
  'https://aistudiocdn.com/react@^19.2.0/jsx-runtime'
];

// Install event: open a cache and add the app shell files to it
self.addEventListener('install', (event) => {
  const evt = event as ExtendableEvent;
  evt.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[ServiceWorker] Pre-caching App Shell');
      // Use addAll to fetch and cache all the files in the list
      return cache.addAll(FILES_TO_CACHE).catch(error => {
        console.error('[ServiceWorker] Failed to cache files during install:', error);
      });
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
  // Tell the active service worker to take control of the page immediately.
  (self as any).clients.claim();
});

// Fetch event: serve assets from cache if available, otherwise fetch from network
self.addEventListener('fetch', (event) => {
  const evt = event as FetchEvent;
  // We only want to handle GET requests
  if (evt.request.method !== 'GET') {
    return;
  }
  
  evt.respondWith(
    caches.match(evt.request).then((response) => {
      // If the resource is in the cache, serve it from there
      if (response) {
        return response;
      }

      // If the resource is not in the cache, fetch it from the network
      return fetch(evt.request).then((networkResponse) => {
        // Clone the response because it's a one-time-use stream
        const responseToCache = networkResponse.clone();
        
        // Don't cache chrome-extension:// requests
        if (evt.request.url.startsWith('chrome-extension://')) {
          return networkResponse;
        }

        // Open the cache and add the new resource to it
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(evt.request, responseToCache);
        });

        // Return the network response
        return networkResponse;
      });
    })
  );
});
