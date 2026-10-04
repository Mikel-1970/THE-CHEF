// Retirar la antigua PWA sin borrar fotografías ni recargar la pestaña del usuario.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', event => {
 event.waitUntil((async () => {
  const names = await caches.keys();
  await Promise.all(names.filter(name => name.startsWith('workbox-precache')).map(name => caches.delete(name)));
  await self.registration.unregister();
 })());
});
