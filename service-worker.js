// ============================================
// SERVICE WORKER — Elizabeth Mendez v2
// Estrategia: Cache-First para assets,
//             Network-First para HTML,
//             Stale-While-Revalidate para CSS/JS
// ============================================

const CACHE_VERSION = 'elizabethmendez-v2';
const STATIC_CACHE  = `${CACHE_VERSION}-static`;
const IMAGE_CACHE   = `${CACHE_VERSION}-images`;

const STATIC_ASSETS = [
  './',
  './index.html',
  './CSS/style1.css?v=1.0.1',
  './js/mis_script.js',
  './manifest.json',
];

const IMAGE_ASSETS = [
  './Imagenes/LcdaElizabeth.png',
  './Imagenes/fondo.jpg',
];

// ─── Install — precaché de assets críticos ──────────────────────────────────

self.addEventListener('install', (event) => {
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE).then((cache) => cache.addAll(STATIC_ASSETS)),
      caches.open(IMAGE_CACHE).then((cache) => cache.addAll(IMAGE_ASSETS)),
    ]).then(() => self.skipWaiting())
  );
});

// ─── Activate — limpiar cachés antiguas ─────────────────────────────────────

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(
        names
          .filter((n) => n.startsWith('elizabethmendez-') && n !== STATIC_CACHE && n !== IMAGE_CACHE)
          .map((n) => caches.delete(n))
      )
    ).then(() => self.clients.claim())
  );
});

// ─── Fetch — estrategias por tipo de recurso ────────────────────────────────

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Ignorar peticiones no-GET y externas
  if (request.method !== 'GET' || url.origin !== location.origin) return;

  // No cachear el formulario PHP
  if (url.pathname.includes('envio-formulario')) return;

  // Imágenes: Cache-First (estables, cambian poco)
  if (/\.(png|jpg|jpeg|webp|gif|svg|ico)$/i.test(url.pathname)) {
    event.respondWith(cacheFirst(request, IMAGE_CACHE));
    return;
  }

  // HTML: Network-First (siempre queremos contenido fresco)
  if (request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(networkFirst(request, STATIC_CACHE));
    return;
  }

  // CSS / JS: Stale-While-Revalidate (sirve rápido y actualiza en background)
  event.respondWith(staleWhileRevalidate(request, STATIC_CACHE));
});

// ─── Helpers de estrategia ──────────────────────────────────────────────────

async function cacheFirst(request, cacheName) {
  const cached = await caches.match(request);
  if (cached) return cached;
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    return new Response('Imagen no disponible sin conexión', { status: 503 });
  }
}

async function networkFirst(request, cacheName) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await caches.match(request);
    return cached ?? offlineFallback();
  }
}

async function staleWhileRevalidate(request, cacheName) {
  const cache  = await caches.open(cacheName);
  const cached = await cache.match(request);

  const fetchPromise = fetch(request).then((response) => {
    if (response.ok) cache.put(request, response.clone());
    return response;
  }).catch(() => null);

  return cached ?? await fetchPromise ?? offlineFallback();
}

function offlineFallback() {
  return new Response(
    `<!doctype html><html lang="es"><head><meta charset="UTF-8">
    <title>Sin conexión — Elizabeth Mendez</title>
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <style>body{font-family:serif;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;background:#FAF8F5;color:#3A3632;text-align:center;padding:24px}h1{font-size:2rem;margin-bottom:.5rem}p{color:#8B8177}</style>
    </head><body><div><h1>Sin conexión</h1><p>Por favor verifica tu conexión a internet e inténtalo de nuevo.</p></div></body></html>`,
    { headers: { 'Content-Type': 'text/html; charset=UTF-8' }, status: 503 }
  );
}

// ─── Push Notifications ─────────────────────────────────────────────────────

self.addEventListener('push', (event) => {
  const data = event.data?.json() ?? {};
  const options = {
    body:    data.body    ?? 'Nuevos diseños exclusivos disponibles',
    icon:    data.icon    ?? './Imagenes/favicon_transparente.ico',
    badge:   data.badge   ?? './Imagenes/favicon_transparente.ico',
    vibrate: [200, 100, 200],
    data:    { url: data.url ?? '/#galeria-vestidos' },
    actions: [
      { action: 'explore', title: 'Ver colección' },
      { action: 'close',   title: 'Cerrar'        },
    ],
  };
  event.waitUntil(
    self.registration.showNotification('Elizabeth Mendez Diseño', options)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  if (event.action !== 'close') {
    const target = event.notification.data?.url ?? '/';
    event.waitUntil(clients.openWindow(target));
  }
});
