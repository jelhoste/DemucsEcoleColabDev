// Service worker de Bandes — la version vient de version.json / APP_VERSION.
// À CHAQUE LIVRAISON : changer APP_VERSION ici, dans version.json et dans les deux pages (voir CHANGELOG.md).
const APP_VERSION = '1.20.0';
const CACHE = 'bandes-' + APP_VERSION;
const COQUILLE = ['./', './index.html', './editeur.html', './banc.html', './comparateur.html', './manifest.json', './icon-192.png', './icon-512.png', './icon-512-maskable.png', './version.json'];

self.addEventListener('install', (e) => {
  self.skipWaiting(); // la nouvelle version prend la main tout de suite (la page, elle, propose de recharger)
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(COQUILLE)));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith('bandes-') && k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('message', (e) => {
  if (e.data === 'SKIP_WAITING') self.skipWaiting();
  if (e.data === 'GET_VERSION' && e.source) e.source.postMessage({ type: 'VERSION', version: APP_VERSION });
});
self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return; // polices Google, etc. : réseau direct
  // réseau d'abord (cache:'no-cache' = on ignore le cache HTTP de GitHub Pages, qui garde les fichiers 10 min), cache en secours hors ligne
  e.respondWith(fetch(req, { cache: 'no-cache' }).then(r => {
    if (r.ok) { const copie = r.clone(); caches.open(CACHE).then(c => c.put(req, copie)); }
    return r;
  }).catch(() => caches.match(req, { ignoreSearch: true }).then(r => r || caches.match('./index.html'))));
});
