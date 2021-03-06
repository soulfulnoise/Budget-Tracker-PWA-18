//files to cache
const FILES_TO_CACHE = [
    "/",
    "/public/index.html",
    "/public/index.js",
    "/mainfest.webmanifest",
    "/public/style.css",
    "/Public/Icons/icon-192x192.png",
    "/Public.Icons/icon-512x512.png"
];

const CACHE_NAME ="static-cahce-v2";
const DATA_CACHE_NAME = "data-cache-v1";


// install
self.addEventListener("install", function(evt) {
  evt.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log("-cached successfully!");
      return cache.addAll(FILES_TO_CACHE);
    })
  );

  self.skipWaiting();
});
//activate
self.addEventListener("activate", function(evt) {
  evt.waitUntil(
    caches.keys().then(keyList => {
      return Promise.all(
        keyList.map(key => {
          if (key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
            console.log("Removing old cache data", key);
            return caches.delete(key);
          }
        })
      );
    })
  );

  self.clients.claim();
});

// fetch
self.addEventListener("fetch", function(evt) {
  // cache successful requests to the API
  if (evt.request.url.includes("/api/transaction")) {
    evt.respondWith(
      caches.open(DATA_CACHE_NAME).then(cache => {
        return fetch(evt.request)
          .then(response => {
            //  clone and store  in the cache with a good response.
            if (response.status === 200) {
              cache.put(evt.request.url, response.clone());
            }

            return response;
          })
          .catch(err => {
            // Network request failed, try to get it from the cache.
            return cache.match(evt.request);
          });
      }).catch(err => console.log(err))
    );

    return;
  }

  evt.respondWith(
    caches.open(CACHE_NAME).then(cache =>{
      return cache.match(evt.request).then(response => {
        return response || fetch(evt.request);
      });
    })

  );
});