importScripts('https://www.gstatic.com/firebasejs/4.8.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/4.8.1/firebase-messaging.js');
importScripts('https://www.gstatic.com/firebasejs/3.6.3/firebase.js');

firebase.initializeApp({
    messagingSenderId: "938674404737"
});

const messaging = firebase.messaging();