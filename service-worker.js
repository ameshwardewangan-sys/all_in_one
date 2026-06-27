/* ==========================================
   ExamVerse AI
   Production Service Worker
   Part 1
========================================== */

'use strict';
const CACHE_NAME = "examverse-cache-v1";

const urlsToCache = [
  "/",
  "/index.html",
  "/style.css",
  "/app.js",
  "/manifest.json"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
const CACHE_VERSION = 'examverse-v1.0.0';

const STATIC_CACHE = `${CACHE_VERSION}-static`;
const DYNAMIC_CACHE = `${CACHE_VERSION}-dynamic`;

const STATIC_ASSETS = [

    '/',

    '/index.html',

    '/style.css',

    '/app.js',

    '/firebase.js',

    '/manifest.json',

    '/assets/logo.png',

    '/assets/icons/icon-192.png',

    '/assets/icons/icon-512.png'

];


/* ===========================
   INSTALL
=========================== */

self.addEventListener('install', event => {

    console.log('Installing Service Worker...');

    event.waitUntil(

        caches.open(STATIC_CACHE)

        .then(cache => {

            return cache.addAll(STATIC_ASSETS);

        })

    );

    self.skipWaiting();

});


/* ===========================
   ACTIVATE
=========================== */

self.addEventListener('activate', event => {

    event.waitUntil(

        caches.keys().then(keys => {

            return Promise.all(

                keys.map(key => {

                    if (

                        key !== STATIC_CACHE &&

                        key !== DYNAMIC_CACHE

                    ) {

                        return caches.delete(key);

                    }

                })

            );

        })

    );

    self.clients.claim();

});


/* ===========================
   CACHE FIRST
=========================== */

async function cacheFirst(request){

    const cached = await caches.match(request);

    if(cached){

        return cached;

    }

    return fetch(request);

}


/* ===========================
   NETWORK FIRST
=========================== */

async function networkFirst(request){

    try{

        const response = await fetch(request);

        const cache = await caches.open(DYNAMIC_CACHE);

        cache.put(request,response.clone());

        return response;

    }catch(e){

        const cached = await caches.match(request);

        return cached;

    }

}
/* ==========================================
   FETCH EVENT
========================================== */

self.addEventListener("fetch", (event) => {

    if (event.request.method !== "GET") return;

    event.respondWith(

        (async () => {

            try {

                const networkResponse = await fetch(event.request);

                const cache = await caches.open(DYNAMIC_CACHE);

                cache.put(event.request, networkResponse.clone());

                return networkResponse;

            } catch (error) {

                const cachedResponse = await caches.match(event.request);

                if (cachedResponse) {
                    return cachedResponse;
                }

                if (
                    event.request.destination === "document"
                ) {

                    const offlinePage = await caches.match("/index.html");

                    if (offlinePage) {
                        return offlinePage;
                    }

                }

                return new Response(

                    "Offline",

                    {
                        status: 503,
                        statusText: "Offline"
                    }

                );

            }

        })()

    );

});


/* ==========================================
   BACKGROUND SYNC
========================================== */

self.addEventListener("sync", (event) => {

    switch (event.tag) {

        case "sync-user-data":

            event.waitUntil(syncUserData());

            break;

        case "sync-mock-tests":

            event.waitUntil(syncMockTests());

            break;

        default:

            break;

    }

});


async function syncUserData() {

    console.log("Syncing User Data...");

    return Promise.resolve();

}


async function syncMockTests() {

    console.log("Syncing Mock Tests...");

    return Promise.resolve();

}


/* ==========================================
   PUSH NOTIFICATION
========================================== */

self.addEventListener("push", (event) => {

    let data = {};

    if (event.data) {
        data = event.data.json();
    }

    const options = {

        body: data.body || "New update available.",

        icon: "/assets/icons/icon-192.png",

        badge: "/assets/icons/icon-96.png",

        image: data.image || "",

        vibrate: [100, 50, 100],

        requireInteraction: true,

        data: {
            url: data.url || "/"
        },

        actions: [

            {
                action: "open",
                title: "Open"
            },

            {
                action: "close",
                title: "Dismiss"
            }

        ]

    };

    event.waitUntil(

        self.registration.showNotification(

            data.title || "ExamVerse AI",

            options

        )

    );

});


/* ==========================================
   NOTIFICATION CLICK
========================================== */

self.addEventListener("notificationclick", (event) => {

    event.notification.close();

    if (event.action === "close") return;

    event.waitUntil(

        clients.openWindow(

            event.notification.data.url || "/"

        )

    );

});


/* ==========================================
   MESSAGE EVENT
========================================== */

self.addEventListener("message", (event) => {

    if (!event.data) return;

    if (event.data.type === "SKIP_WAITING") {

        self.skipWaiting();

    }

});
/* ==========================================
   ExamVerse AI
   Service Worker
   Part 3 (Final)
========================================== */

/* ===========================
   NAVIGATION PRELOAD
=========================== */

self.addEventListener("activate", (event) => {

    event.waitUntil(

        (async () => {

            if ("navigationPreload" in self.registration) {

                await self.registration.navigationPreload.enable();

            }

        })()

    );

});


/* ===========================
   PERIODIC BACKGROUND SYNC
=========================== */

self.addEventListener("periodicsync", (event) => {

    if (event.tag === "examverse-daily-sync") {

        event.waitUntil(runDailySync());

    }

});


async function runDailySync() {

    console.log("Running Daily Background Sync...");

    return Promise.resolve();

}


/* ===========================
   OFFLINE REQUEST QUEUE
=========================== */

const offlineQueue = [];

async function queueRequest(request) {

    offlineQueue.push({

        url: request.url,

        method: request.method,

        time: Date.now()

    });

}

async function replayQueue() {

    while (offlineQueue.length > 0) {

        const item = offlineQueue.shift();

        try {

            await fetch(item.url, {

                method: item.method

            });

        } catch (e) {

            offlineQueue.unshift(item);

            break;

        }

    }

}


/* ===========================
   ONLINE EVENT
=========================== */

self.addEventListener("online", () => {

    replayQueue();

});


/* ===========================
   SHARE TARGET
=========================== */

self.addEventListener("fetch", (event) => {

    const url = new URL(event.request.url);

    if (
        event.request.method === "POST" &&
        url.pathname === "/share-target"
    ) {

        event.respondWith(

            Response.redirect("/", 303)

        );

    }

});


/* ===========================
   STORAGE CLEANUP
=========================== */

async function cleanupOldCaches() {

    const keys = await caches.keys();

    await Promise.all(

        keys.map((key) => {

            if (!key.startsWith(CACHE_VERSION)) {

                return caches.delete(key);

            }

        })

    );

}

cleanupOldCaches();


/* ===========================
   VERSION MESSAGE
=========================== */

console.log(
    "ExamVerse AI Service Worker v1.0.0 Loaded Successfully"
);
self.addEventListener("install", () => {
  console.log("Service Worker Installed");
});

self.addEventListener("fetch", event => {
  console.log("Fetch:", event.request.url);
});
/* ==========================================
   END OF SERVICE WORKER
========================================== */
