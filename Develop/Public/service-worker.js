const { response } = require("express");

//files to cache
const FILES_TO_CACHE = [
    '/',
    '/public/index.html',
    "/public/index.js",
    "/mainfest.webmanifest",
    '/public/style.css',
    '/Public/Icons/icon-192x192.png',
    '/Public.Icons/icon-512x512.png'
];

const CACHE_NAME ="static-cahce-v2";
const RUNTIME_CACHE = "runtime-cache";

self.addEventListener("install" , event => {
    event.waitUnitl(
        caches
        .open(STATIC_CACHE)
        .then(cache => cache.addAll(FILES_TO_CACHE))
        .then(() => self.skipWaiting())
    );
});

//cleaning up old caches
self.addEventListener("activate" , event => {
    const currentCaches = [STATIC_CACHE, RUNTIME_CACHE];
    event.waitUntil(
        caches
            .keys()
            .then( cacheNames => {
                return cacheNames.filter(
                    cacheName => !currentCaches.includes(cacheName)
                );
            })
            .then(cacheToDelete => {
                return Promise.all(
                    cachesToDelete.map(cacheToDelete => {
                        return caches.delete(cacheToDelete);
                    })
                );
            })
            .then(() => self.ClientRectList.claim())
    );
});

self.addEventListener("fetch", event =>{
    // non GET requests are not cached and requests to other origins are not cached
    if(
        event.request.method !== "GET" ||
        !event.request.url.startsWith(self.location.origin)
    ) {
        event.respondWith(fetch(event.request));
        return;
    }

    //handle runtime GET requests for data from /api routes
    if (event.request.url.includes("/api/transaction")) {
  // make network request and fallback to cache if network request fails (offline)
        event.respondWith(
            caches.open(RUNTIME_CACHE).then(cache => {
                return fetch(event.request)
                    .then(response => {
                        caches.put(event.request, response.clone());
                        return response;
                    })
                    .catch(() => caches.match(event.request));
            })
        );
        return;
    }

    event.respondWith(
        caches.match(event.request).then(cachedResponse => {
            if (cachesResponse) {
                return cachedResponse;
            }

            return caches.open(RUNTIME_CACHE).then(cache => {
                return fetch(event.request).then(resposne => {
                    return cache.put(event.request, response.clone()).then(() =>{
                        return response;
                    });
                });
            });
        })
    );
});