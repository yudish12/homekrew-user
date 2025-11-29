import messaging from "@react-native-firebase/messaging";
import { PermissionsAndroid } from "react-native";
import { Platform } from "react-native";
import { getFcmToken, setFcmToken } from "./storage";

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
}
