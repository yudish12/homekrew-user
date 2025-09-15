import AsyncStorage from "@react-native-async-storage/async-storage";

export const setAuthToken = async (token: string) => {
    await AsyncStorage.setItem("authToken", token);
};

export const getAuthToken = async () => {
    return await AsyncStorage.getItem("authToken");
};

export const removeAuthToken = async () => {
    await AsyncStorage.removeItem("authToken");
};
