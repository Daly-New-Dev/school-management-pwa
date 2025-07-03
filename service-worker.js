// A more robust service worker with an update notification system.

const CACHE_NAME = 'school-admin-cache-v11'; // **IMPORTANT**: Version incremented to trigger update.
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './school_logo.png',
  './icons/appicon.PNG', // ** UPDATED to uppercase **
  './icons/appicon1.PNG', // ** UPDATED to uppercase **
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css',
  'https://fonts.googleapis.com/css2?family=Kantumruy+Pro:ital,wght@0,100..700;1,100..700&family=Khmer+OS+Moul&display=swap'
];

// Install event: caches the core assets.
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache and caching assets');
        return cache.addAll(urlsToCache);
      })
  );
});

// Activate event: cleans up old caches.
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim()) // Take control of open clients
  );
});

// Listen for a message from the client to skip waiting.
self.addEventListener('message', event => {
  if (event.data && event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});


// Fetch event: uses a cache-first strategy for speed.
// The update logic is handled by the browser's service worker update cycle.
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        // Not in cache, fetch from network
        return fetch(event.request);
      }
    )
  );
});
