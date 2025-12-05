import messaging, {
    FirebaseMessagingTypes,
} from "@react-native-firebase/messaging";
import { PermissionsAndroid } from "react-native";
import { Platform } from "react-native";
import { getFcmToken, setFcmToken } from "./storage";
import notifee, { AndroidImportance, EventType } from "@notifee/react-native";

export class NotificationService {
    static async requestPermission(): Promise<boolean> {
        if (Platform.OS === "ios") {
            const authStatus = await messaging().requestPermission();
            const enabled =
                authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
                authStatus === messaging.AuthorizationStatus.PROVISIONAL;
            return enabled;
        }

        const status = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        );
        return status === PermissionsAndroid.RESULTS.GRANTED;
    }

    static async getToken(): Promise<string | null> {
        const isTokenAlreadySet = await getFcmToken();
        if (
            isTokenAlreadySet &&
            isTokenAlreadySet !== null &&
            isTokenAlreadySet !== ""
        ) {
            return isTokenAlreadySet;
        }
        const token = await messaging().getToken();
        setFcmToken(token);
        return token;
    }

    static async createChannel() {
        await notifee.createChannel({
            id: "default",
            name: "Default Channel",
            importance: AndroidImportance.HIGH,
            sound: "default",
        });
    }

    static async displayNotification(
        remoteMessage: FirebaseMessagingTypes.RemoteMessage,
    ) {
        try {
            const { notification, data } = remoteMessage;

            await notifee.displayNotification({
                title: notification?.title || "New Notification",
                body: notification?.body || "",
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
                data: data as Record<string, string>,
            });
        } catch (error) {
            console.error("Error displaying notification:", error);
        }
    }

    static setupForegroundMessageHandler() {
        // Handle foreground messages
        const unsubscribe = messaging().onMessage(
            async (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
                console.log("Foreground notification received:", remoteMessage);
                await this.displayNotification(remoteMessage);
            },
        );
        return unsubscribe;
    }

    static setupNotificationHandlers() {
        // Handle notification interactions
        notifee.onForegroundEvent(async ({ type, detail }) => {
            if (type === EventType.PRESS) {
                console.log("User pressed notification:", detail.notification);
                // Handle notification press - navigate to specific screen if needed
                // You can access detail.notification?.data for custom data
            }
        });
    }

    static async initialize() {
        try {
            // Request permission
            const hasPermission = await this.requestPermission();
            if (!hasPermission) {
                console.log("Notification permission denied");
                return;
            }

            // Create notification channel (Android)
            if (Platform.OS === "android") {
                await this.createChannel();
            }

            // Get FCM token
            const token = await this.getToken();
            const apnsToken = await messaging().getAPNSToken();
            console.log("APNS Token:", apnsToken);
            console.log("FCM Token:", token);

            // Setup handlers
            this.setupForegroundMessageHandler();
            this.setupNotificationHandlers();

            // Handle token refresh
            messaging().onTokenRefresh(async newToken => {
                console.log("FCM Token refreshed:", newToken);
                await setFcmToken(newToken);
            });
        } catch (error) {
            console.error("Error initializing notifications:", error);
        }
    }
}
