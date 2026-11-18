// Service worker de mensajería (push web) — Trescasas
// Debe estar en web/firebase-messaging-sw.js y servirse desde la raíz del sitio.

// Al tocar un aviso: si la app ya está abierta, la trae al frente; si no, la abre.
// (Va ANTES de cargar Firebase para que este manejador se registre el primero.)
self.addEventListener('notificationclick', function (event) {
  event.notification.close();
  const destino = (event.notification.data && event.notification.data.url) || '/';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (lista) {
      for (const c of lista) {
        if (c.url.startsWith(self.location.origin) && 'focus' in c) {
          return c.focus();
        }
      }
      if (clients.openWindow) return clients.openWindow(destino);
    })
  );
});

// Que la version nueva de este fichero se aplique en cuanto llega, sin esperar a cerrar la app.
self.addEventListener('install', function () { self.skipWaiting(); });
self.addEventListener('activate', function (event) { event.waitUntil(self.clients.claim()); });

// Aviso con la app "a la vista". Si hay una ventana de la app visible, Firebase no saca
// notificacion: se lo pasa a la app, que lo ensena como una franja interior. Eso deja sin
// notificacion al que bloquea el movil con la app abierta (para el navegador sigue visible).
// Aqui se saca tambien la notificacion del sistema en ese caso. Cuando no hay ventana visible
// no se hace nada: la notificacion la saca Firebase, como siempre.
// (Va ANTES de cargar Firebase, igual que el manejador de arriba.)
self.addEventListener('push', function (event) {
  var datos = {};
  try { datos = event.data ? event.data.json() : {}; } catch (e) { return; }
  var n = datos.notification;
  if (!n) return;
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (lista) {
      var hayVisible = lista.some(function (c) {
        return c.visibilityState === 'visible' && c.url.indexOf('chrome-extension://') !== 0;
      });
      if (!hayVisible) return;
      return self.registration.showNotification(n.title || 'Trescasas', {
        body: n.body || '',
        icon: '/icons/Icon-192.png',
        badge: '/icons/Icon-192.png',
        data: { url: '/' },
      });
    })
  );
});

importScripts('https://www.gstatic.com/firebasejs/11.6.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/11.6.1/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyDwDY5VCVzSQv6M9hYJtKGLQ_y94N9NbZI",
  authDomain: "trescasas-fdc8e.firebaseapp.com",
  projectId: "trescasas-fdc8e",
  storageBucket: "trescasas-fdc8e.firebasestorage.app",
  messagingSenderId: "54926511739",
  appId: "1:54926511739:web:86ff486120b363ff6b1cde"
});

const messaging = firebase.messaging();

// Notificación cuando la web está en segundo plano
messaging.onBackgroundMessage(function (payload) {
  const n = payload.notification || {};
  self.registration.showNotification(n.title || 'Trescasas', {
    body: n.body || '',
    icon: '/icons/Icon-192.png',
    badge: '/icons/Icon-192.png',
    data: { url: '/' },
  });
});
