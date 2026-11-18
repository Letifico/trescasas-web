// Service worker de mensajería (push web) — Trescasas
// Debe estar en web/firebase-messaging-sw.js y servirse desde la raíz del sitio.

// Al tocar un aviso:
// - si el aviso es de un acto (su enlace lleva ?acto=...), se abre la app en la ficha de ese acto;
// - si no, y la app ya esta abierta, se trae al frente; si no lo esta, se abre.
// (Va ANTES de cargar Firebase para que este manejador se registre el primero; corta la
// propagacion para que Firebase no abra ademas otra ventana por su cuenta.)
self.addEventListener('notificationclick', function (event) {
  event.notification.close();
  event.stopImmediatePropagation();
  var d = event.notification.data || {};
  var fcm = d.FCM_MSG || {};
  var destino = d.url || (fcm.fcmOptions && fcm.fcmOptions.link) || '/';
  var esActo = String(destino).indexOf('acto=') >= 0;
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (lista) {
      if (!esActo) {
        for (var i = 0; i < lista.length; i++) {
          var c = lista[i];
          if (c.url.indexOf(self.location.origin) === 0 && 'focus' in c) return c.focus();
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
        data: { url: (datos.fcmOptions && datos.fcmOptions.link) || '/' },
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
