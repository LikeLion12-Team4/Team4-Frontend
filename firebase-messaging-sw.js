importScripts(
  "https://www.gstatic.com/firebasejs/10.12.4/firebase-app-compat.js"
)
importScripts(
  "https://www.gstatic.com/firebasejs/10.12.4/firebase-messaging-compat.js"
)
  
firebase.initializeApp({
    apiKey: "AIzaSyAzZgu4HkhvpIqVrlOxXacE0clRLJn_HtE",
    authDomain: "likelion12-4f281.firebaseapp.com",
    projectId: "likelion12-4f281",
    storageBucket: "likelion12-4f281.appspot.com",
    messagingSenderId: "718422166445",
    appId: "1:718422166445:web:e43237c18d3ea303392f24",
    measurementId: "G-WHBL3TGBY0"
});
  
const messaging = firebase.messaging();
  
// 백그라운드에서 수신된 FCM 메시지 처리
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = payload.data.content_title;
  const notificationOptions = {
    body: "영상 제목: "+payload.data.video_title,
    icon: payload.data.content_image,
    badge: payload.data.badge,
    image: payload.data.thumbnail,
    data: { url: payload.data.url }
  };
  self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close(); // 알림 닫기

  const url = event.notification.data.url;
  event.waitUntil(
    clients.openWindow(url) // 새 창에서 열기
  );
});

// 푸시 알림 전송 요청