/* =====================================================
   tomato agency — Service Worker
   Strategy:
     - precache the app shell on install
     - network-first for HTML + CSS/JS (so a deploy serves fresh styles/scripts
       immediately — stale CSS after deploy was breaking layout)
     - stale-while-revalidate for other assets (images, fonts)
     - offline fallback to cache, then root
   ===================================================== */

const VERSION    = 'tomato-v2.2.1';
const CORE_CACHE = `${VERSION}-core`;
const RUN_CACHE  = `${VERSION}-run`;

const CORE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/assets/css/style.css',
  '/assets/css/pages.css',
  '/assets/js/main.js',
  '/assets/img/logo.png',
  '/assets/img/wordmark.png',
  '/assets/img/og-image.png',
  '/assets/icons/favicon.png',
  '/assets/icons/favicon-16x16.png',
  '/assets/icons/favicon-32x32.png',
  '/assets/icons/favicon-48x48.png',
  '/assets/icons/apple-touch-icon.png',
  '/assets/icons/icon-192x192.png',
  '/assets/icons/icon-512x512.png'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CORE_CACHE).then((cache) =>
      cache.addAll(CORE_ASSETS).catch(() => {})
    )
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => !k.startsWith(VERSION)).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

const sameOrigin = (url) => new URL(url, self.location.origin).origin === self.location.origin;
const isHTML = (req) => req.mode === 'navigate' || (req.headers.get('accept') || '').includes('text/html');
const isStyleOrScript = (req) => /\.(css|js)$/i.test(new URL(req.url).pathname);

async function staleWhileRevalidate(request) {
  const cache = await caches.open(RUN_CACHE);
  const cached = await cache.match(request);
  const fetchPromise = fetch(request).then((response) => {
    if (response && response.status === 200 && response.type !== 'opaque') {
      cache.put(request, response.clone());
    }
    return response;
  }).catch(() => new Response('', { status: 504, statusText: 'offline' }));
  // Why explicit await: `cached || fetchPromise` evaluates the Promise as
  // truthy and returns it before resolution — if the promise later resolves
  // to a non-Response value, respondWith throws "Failed to convert".
  if (cached) return cached;
  return fetchPromise;
}

async function networkFirst(request) {
  try {
    const network = await fetch(request);
    const cache = await caches.open(RUN_CACHE);
    cache.put(request, network.clone());
    return network;
  } catch {
    const cached = await caches.match(request);
    if (cached) return cached;
    if (isHTML(request)) {
      const offline = await caches.match('/');
      if (offline) return offline;
    }
    return new Response('', { status: 504, statusText: 'offline' });
  }
}

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  if (!sameOrigin(req.url)) return; // let third-party (fonts.googleapis) hit the network freely

  if (isHTML(req) || isStyleOrScript(req)) {
    event.respondWith(networkFirst(req));
  } else {
    event.respondWith(staleWhileRevalidate(req));
  }
});

self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting();
});
