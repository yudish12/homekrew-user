// Default configuration
import DeviceInfo from "react-native-device-info";

export const DEFAULT_CONFIG = {
    timeout: 30000000, // 30 seconds
    headers: {
        "Content-Type": "application/json",
        "X-Device-ID": DeviceInfo.getUniqueId(),
    },
};

// export const API_URL = "http://192.168.0.179:8000";
export const API_URL = "https://api.homekrew.in";
// export const API_URL = "https://ao1.onrender.com";
