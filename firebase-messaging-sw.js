importScripts('https://www.gstatic.com/firebasejs/4.8.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/4.8.1/firebase-messaging.js');
importScripts('https://www.gstatic.com/firebasejs/3.6.3/firebase.js');

firebase.initializeApp({
    messagingSenderId: "938674404737"
});

// navigator.serviceWorker.register('../firebase-messaging-sw.js')
// .then(function(registration) {
//     console.log('Registration successful, scope is:', registration.scope);
//     firebase.messaging().useServiceWorker(registration);
// }).catch(function(err) {
//     console.log('Service worker registration failed, error:', err);
// });

// navigator.serviceWorker.ready
//     .then(function(serviceWorkerRegistration) {
//         return serviceWorkerRegistration.pushManager.subscribe({
//             userVisibleOnly: true
//         });
//     })
// .then(function(subscription) {console.log(subscription.endpoint);});

const messaging = firebase.messaging();

// messaging.onMessage(function(payload) {
//     console.log('Message received. ', payload);
// });

messaging.setBackgroundMessageHandler(payload => {
    const title = payload.notification.title;
    console.log('payload', payload.notification.icon);
    const options = {
       body: payload.notification.body,
       icon: payload.notification.icon
    }
    return self.registration.showNotification(title, options);
});