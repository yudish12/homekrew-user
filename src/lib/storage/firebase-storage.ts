import AsyncStorage from "@react-native-async-storage/async-storage";

export const getFcmToken = async () => {
    return await AsyncStorage.getItem("fcmToken");
};

export const setFcmToken = async (token: string) => {
    await AsyncStorage.setItem("fcmToken", token);
};

export const removeFcmToken = async () => {
    await AsyncStorage.removeItem("fcmToken");
};
