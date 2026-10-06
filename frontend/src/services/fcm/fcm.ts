import { PushNotifications } from "@capacitor/push-notifications";
import { Capacitor } from "@capacitor/core";
// const addListeners = async () => {
//   await PushNotifications.addListener("registration", (token) => {
//     console.info("Registration token: ", token.value);
//   });

//   await PushNotifications.addListener("registrationError", (err) => {
//     console.error("Registration error: ", err.error);
//   });

//   await PushNotifications.addListener(
//     "pushNotificationReceived",
//     (notification) => {
//       console.log("Push notification received: ", notification);
//     }
//   );

//   await PushNotifications.addListener(
//     "pushNotificationActionPerformed",
//     (notification) => {
//       console.log(
//         "Push notification action performed",
//         notification.actionId,
//         notification.inputValue
//       );
//     }
//   );
// };

// const registerNotifications = async () => {
//   let permStatus = await PushNotifications.checkPermissions();

//   if (permStatus.receive === "prompt") {
//     permStatus = await PushNotifications.requestPermissions();
//   }

//   if (permStatus.receive !== "granted") {
//     throw new Error("User denied permissions!");
//   }

//   await PushNotifications.register();
// };

// const getDeliveredNotifications = async () => {
//   const notificationList = await PushNotifications.getDeliveredNotifications();
//   console.log("delivered notifications", notificationList);
// };

// export const initPushNotifications = async () => {
//   if (!Capacitor.isNativePlatform()) return;
  
//   // 1. Listen for the FCM registration token
//   await PushNotifications.addListener("registration", (token) => {
//     console.log("FCM Registration Token:", token.value);
//   });

//   // 2. Listen for registration errors
//   await PushNotifications.addListener("registrationError", (err) => {
//     console.error("Registration error:", err.error);
//   });

//   // 3. Listen when a notification arrives
//   await PushNotifications.addListener(
//     "pushNotificationReceived",
//     (notification) => {
//       console.log("Push notification received:", notification);
//     }
//   );

//   // 4. Listen when the user taps a notification
//   await PushNotifications.addListener(
//     "pushNotificationActionPerformed",
//     (notification) => {
//       console.log("Push notification tapped:", notification);
//     }
//   );

//   // 5. Check notification permission
//   let permStatus = await PushNotifications.checkPermissions();

//   // 6. Ask for permission if necessary
//   if (permStatus.receive === "prompt") {
//     permStatus = await PushNotifications.requestPermissions();
//   }

//   // 7. Stop if permission was denied
//   if (permStatus.receive !== "granted") {
//     console.log("Notification permission denied");
//     return;
//   }

//   // 8. Register this phone with Firebase
//   await PushNotifications.register();
// };
  const API_URL = import.meta.env.VITE_API_URL; // your backend

  export const initPushNotifications = async (
    authToken: string,
    onOpenChat?: (chatId: string) => void
  ) => {
    if (!Capacitor.isNativePlatform()) return;

    // Android 8+ needs a channel for notifications to show
    if (Capacitor.getPlatform() === "android") {
      await PushNotifications.createChannel({
        id: "messages",
        name: "Messages",
        importance: 5,
        visibility: 1,
      });
    }

    await PushNotifications.removeAllListeners(); // avoid duplicate listeners on re-login

    await PushNotifications.addListener("registration", async (token) => {
      console.log("FCM Registration Token:", token.value);
      try {
        const res = await fetch(`${API_URL}/api/push/register`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({
            token: token.value,
            platform: Capacitor.getPlatform(),
          }),
        });
        if (!res.ok) throw new Error(`Request failed with status ${res.status}`);
      } catch (e) {
        console.error("Failed to send token to backend", e);
      }
    });

    await PushNotifications.addListener("registrationError", (err) => {
      console.error("Registration error:", err.error);
    });

    // App is open: FCM does NOT show a system notification, so handle it yourself
    await PushNotifications.addListener("pushNotificationReceived", (n) => {
      console.log("Push received:", n);
      // e.g. show an in-app toast, or bump an unread badge
    });

    // User tapped the notification
    await PushNotifications.addListener(
      "pushNotificationActionPerformed",
      (action) => {
        const chatId = action.notification.data?.chatId;
        if (chatId && onOpenChat) onOpenChat(String(chatId));
      }
    );

    let perm = await PushNotifications.checkPermissions();
    if (perm.receive === "prompt")
      perm = await PushNotifications.requestPermissions();
    if (perm.receive !== "granted") return;

    await PushNotifications.register();
  };