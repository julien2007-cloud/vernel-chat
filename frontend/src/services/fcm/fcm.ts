import { PushNotifications } from "@capacitor/push-notifications";

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

const getDeliveredNotifications = async () => {
  const notificationList = await PushNotifications.getDeliveredNotifications();
  console.log("delivered notifications", notificationList);
};


export const initPushNotifications = async () => {
  // 1. Listen for the FCM registration token
  await PushNotifications.addListener("registration", (token) => {
    console.log("FCM Registration Token:", token.value);
  });

  // 2. Listen for registration errors
  await PushNotifications.addListener("registrationError", (err) => {
    console.error("Registration error:", err.error);
  });

  // 3. Listen when a notification arrives
  await PushNotifications.addListener(
    "pushNotificationReceived",
    (notification) => {
      console.log("Push notification received:", notification);
    }
  );

  // 4. Listen when the user taps a notification
  await PushNotifications.addListener(
    "pushNotificationActionPerformed",
    (notification) => {
      console.log("Push notification tapped:", notification);
    }
  );

  // 5. Check notification permission
  let permStatus = await PushNotifications.checkPermissions();

  // 6. Ask for permission if necessary
  if (permStatus.receive === "prompt") {
    permStatus = await PushNotifications.requestPermissions();
  }

  // 7. Stop if permission was denied
  if (permStatus.receive !== "granted") {
    console.log("Notification permission denied");
    return;
  }

  // 8. Register this phone with Firebase
  await PushNotifications.register();
};