const { Expo } = require("expo-server-sdk");
const expo = new Expo();

function sendNotification(token, title, body) {
  if (!Expo.isExpoPushToken(token)) return;
  if (!title || !body) return;
  let message = [
    {
      to: token,
      sound: "default",
      title: title,
      body: body,
      data: { name: title, message: body },
      priority: "high",
    },
  ];
  let chunks = expo.chunkPushNotifications(message);

  (async () => {
    for (let chunk of chunks) {
      try {
        await expo.sendPushNotificationsAsync(chunk);
        console.log(`[${formatDate(new Date())}] Sent a push notification!`);
      } catch (error) {
        console.error(
          `[${formatDate(new Date())}] Error while sending push notification`
        );
      }
    }
  })();
}

module.exports.sendNotification = sendNotification;
