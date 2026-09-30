importScripts(
  "https://www.gstatic.com/firebasejs/12.3.0/firebase-app-compat.js",
  "https://www.gstatic.com/firebasejs/12.3.0/firebase-messaging-compat.js"
);

firebase.initializeApp({
  apiKey: "AIzaSyBunyChVwR7Wq0CeQ1J2vaCUW1onWBXpEU",
  authDomain: "ex-patriot.firebaseapp.com",
  projectId: "ex-patriot",
  messagingSenderId: "407951799946",
  appId: "1:407951799946:web:2b7b91807ef6ed3841df73"
});

firebase.messaging();
// Clickable Notif Link.
self.addEventListener('notificationclick', function (event) {
  event.notification.close();
  event.waitUntil(clients.openWindow('https://warmest-soup.github.io/Chat'));
});