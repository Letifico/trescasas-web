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

// Notificacion de cada aviso. Se saca aqui, con la etiqueta unica que pone el servidor.
// - App cerrada o en segundo plano: Firebase tambien la saca por su cuenta, con esa misma
//   etiqueta, y el sistema las deja en una sola.
// - App "a la vista" (por ejemplo, movil bloqueado con la app abierta): Firebase no saca nada,
//   solo se lo pasa a la app; la notificacion es la de aqui.
// Si el aviso llegara sin etiqueta, solo se saca en el segundo caso, para no repetirla.
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
      if (!n.tag && !hayVisible) return;
      return self.registration.showNotification(n.title || 'Trescasas', {
        body: n.body || '',
        icon: '/icons/Icon-192.png',
        badge: '/icons/Icon-192.png',
        tag: n.tag || datos.fcmMessageId,
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

// En segundo plano no hace falta hacer nada aqui: la notificacion ya la sacan Firebase y el
// manejador de arriba (con la misma etiqueta). Antes se sacaba otra desde aqui y salia repetida.
messaging.onBackgroundMessage(function () {});
