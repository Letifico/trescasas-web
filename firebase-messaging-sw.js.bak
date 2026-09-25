// Service worker de mensajería (push web) — Trescasas
// Debe estar en web/firebase-messaging-sw.js y servirse desde la raíz del sitio.
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
  });
});
