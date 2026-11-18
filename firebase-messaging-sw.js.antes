// Service worker de mensajería (push web) — Trescasas
// Debe estar en web/firebase-messaging-sw.js y servirse desde la raíz del sitio.

// Al tocar un aviso: trae la app al frente si ya está abierta; si no, la abre.
// Va ANTES de los importScripts y corta la propagación para que el manejador
// propio de Firebase no abra una segunda ventana.
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.stopImmediatePropagation();
  const destino = self.location.origin + '/';
  event.waitUntil((async () => {
    const ventanas = await clients.matchAll({ type: 'window', includeUncontrolled: true });
    for (const c of ventanas) {
      const u = new URL(c.url);
      const esApp = u.pathname === '/' || u.pathname === '/index.html';
      if (esApp && 'focus' in c) return c.focus();
    }
    if (clients.openWindow) return clients.openWindow(destino);
  })());
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

// Solo para mensajes sin "notification" (los que sí la llevan ya los muestra
// Firebase; si los mostráramos aquí también, saldrían repetidos).
messaging.onBackgroundMessage((payload) => {
  if (payload.notification) return;
  const d = payload.data || {};
  self.registration.showNotification(d.title || 'Trescasas', {
    body: d.body || '',
    icon: '/icons/Icon-192.png',
    badge: '/icons/Icon-192.png',
  });
});