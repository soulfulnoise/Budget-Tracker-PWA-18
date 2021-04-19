//files to cache
const FILES_TO_CACHE = [
    '/',
    '/public/index.html',
    '/public/style.css',
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