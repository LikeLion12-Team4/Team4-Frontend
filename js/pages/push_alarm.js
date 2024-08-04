// Firebase 초기 설정
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
import {
  getMessaging,
  getToken,
  onMessage,
} from "https://www.gstatic.com/firebasejs/10.12.4/firebase-messaging.js";

document.addEventListener("DOMContentLoaded", function () {
  console.log("dd");

  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional

  const firebaseConfig = initializeApp({
    apiKey: "AIzaSyAzZgu4HkhvpIqVrlOxXacE0clRLJn_HtE",
    authDomain: "likelion12-4f281.firebaseapp.com",
    projectId: "likelion12-4f281",
    storageBucket: "likelion12-4f281.appspot.com",
    messagingSenderId: "718422166445",
    appId: "1:718422166445:web:e43237c18d3ea303392f24",
    measurementId: "G-WHBL3TGBY0",
  });

  // Initialize Firebase

  const messaging = getMessaging(firebaseConfig);

  async function registerServiceWorkerAndGetToken() {
    try {
      // Register the service worker
      const registration = await navigator.serviceWorker.register(
        "/firebase-messaging-sw.js"
      );
      console.log(
        "Service Worker registration successful with scope: ",
        registration.scope
      );

      // Wait for the service worker to be ready
      await navigator.serviceWorker.ready;

      // Get the FCM token
      const currentToken = await getToken(messaging, {
        vapidKey:
          "BBl9Y4GVrIKCupTYeIJCgi3c0Zv9AvTeCbB86zMFI56wwGYOrU_idN3vBlglKTexmE_OI80ZD1lIQin2TtWlQ2Y",
        serviceWorkerRegistration: registration,
      });
      //await deleteToken(messaging);
      if (currentToken) {
        console.log("FCM Token:", currentToken);
        sessionStorage.setItem("FCM", currentToken);
      } else {
        console.log(
          "No registration token available. Request permission to generate one."
        );
      }
    } catch (err) {
      console.error("Service Worker registration failed: ", err);
    }
  }

  // Request permission and register service worker
  async function requestPermissionAndRegisterSW() {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      console.log("Notification permission granted.");
      await registerServiceWorkerAndGetToken();
    } else {
      console.log("Unable to get permission to notify.");
    }
  }

  // Call the function to request permission and register service worker
  requestPermissionAndRegisterSW();

  onMessage(messaging, (payload) => {
    console.log(
      "[firebase-messaging-sw.js] Received background message ",
      payload
    );
    const notificationTitle = payload.data.content_title;
    const notificationOptions = {
      body: "test,영상 제목: " + payload.data.video_title,
      icon: payload.data.content_image,
      badge: payload.data.badge,
      image: payload.data.thumbnail,
      data: { url: payload.data.url },
    };
    if (Notification.permission === "granted") {
      navigator.serviceWorker.getRegistration().then((registration) => {
        if (registration) {
          registration.showNotification(notificationTitle, notificationOptions);
        }
      });
    }
  });
});
