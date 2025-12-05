import { registerRootComponent } from "expo";
import messaging from "@react-native-firebase/messaging";
import notifee, { AndroidImportance, EventType } from "@notifee/react-native";

import App from "./src/App";

// Background message handler must be set outside of the app lifecycle
messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log("Background notification received:", remoteMessage);

    // Create notification channel if needed (Android)
    await notifee.createChannel({
        id: "default",
        name: "Default Channel",
        importance: AndroidImportance.HIGH,
        sound: "default",
    });

    // Display notification using Notifee
    await notifee.displayNotification({
        title: remoteMessage.notification?.title || "New Notification",
        body: remoteMessage.notification?.body || "",
        android: {
            channelId: "default",
            importance: AndroidImportance.HIGH,
            sound: "default",
            pressAction: {
                id: "default",
            },
        },
        ios: {
            sound: "default",
        },
        data: remoteMessage.data as Record<string, string>,
    });
});

// Handle background notification events (when app is killed)
notifee.onBackgroundEvent(async ({ type, detail }) => {
    if (type === EventType.PRESS) {
        console.log(
            "User pressed background notification:",
            detail.notification,
        );
        // Handle notification press when app was in background/killed
    }
});

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
