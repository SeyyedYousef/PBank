/**
 * PBank Service Worker
 * Provides offline caching and network resilience
 */

const CACHE_NAME = 'pbank-cache-v1';
const OFFLINE_URL = '/offline.html';

// Assets to cache on install
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/offline.html',
    '/manifest.json',
    '/vite.svg',
];

// Install event - cache static assets
self.addEventListener('install', function (event) {
    event.waitUntil(
        caches.open(CACHE_NAME).then(function (cache) {
            console.log('[SW] Caching static assets');
            return cache.addAll(STATIC_ASSETS);
        })
    );
    // Force activation
    self.skipWaiting();
});

// Activate event - clean old caches
self.addEventListener('activate', function (event) {
    event.waitUntil(
        caches.keys().then(function (cacheNames) {
            return Promise.all(
                cacheNames
                    .filter(function (name) { return name !== CACHE_NAME; })
                    .map(function (name) { return caches.delete(name); })
            );
        })
    );
    // Take control immediately
    self.clients.claim();
});

// Fetch event - network first, fallback to cache
self.addEventListener('fetch', function (event) {
    var request = event.request;

    // Skip non-GET requests
    if (request.method !== 'GET') return;

    // Skip cross-origin requests
    if (!request.url.startsWith(self.location.origin)) return;

    // For navigation requests (HTML pages)
    if (request.mode === 'navigate') {
        event.respondWith(
            fetch(request)
                .catch(function () {
                    return caches.match(OFFLINE_URL);
                })
        );
        return;
    }

    // For static assets - cache first
    if (
        request.url.includes('/assets/') ||
        request.url.endsWith('.js') ||
        request.url.endsWith('.css') ||
        request.url.endsWith('.png') ||
        request.url.endsWith('.svg') ||
        request.url.endsWith('.woff2')
    ) {
        event.respondWith(
            caches.match(request).then(function (cached) {
                if (cached) return cached;

                return fetch(request).then(function (response) {
                    // Cache successful responses
                    if (response.ok) {
                        var responseClone = response.clone();
                        caches.open(CACHE_NAME).then(function (cache) {
                            cache.put(request, responseClone);
                        });
                    }
                    return response;
                });
            })
        );
        return;
    }

    // For API requests - network only (no cache)
    if (request.url.includes('/api/')) {
        event.respondWith(fetch(request));
        return;
    }

    // Default: network first with cache fallback
    event.respondWith(
        fetch(request)
            .then(function (response) {
                // Cache successful responses
                if (response.ok) {
                    var responseClone = response.clone();
                    caches.open(CACHE_NAME).then(function (cache) {
                        cache.put(request, responseClone);
                    });
                }
                return response;
            })
            .catch(function () {
                return caches.match(request);
            })
    );
});
