import { Platform } from "react-native";
import { api, NotificationService } from "../../lib";
import { ApiResponse, UserUpdateBody } from "../../types";
import { User } from "../../types/user";
import { setAuthToken } from "../../lib/storage/auth-storage";

export class AuthServices {
    private static readonly BASE_URL = "https://ao1.onrender.com/api/v1/user";
    private static dispatch: any = null;

    // Method to set dispatch function
    static setDispatch(dispatch: any) {
        AuthServices.dispatch = dispatch;
    }

    static async login(phoneNumber: string): Promise<ApiResponse<boolean>> {
        const response = await api.post(`${this.BASE_URL}/authenticate`, {
            phoneNumber,
        });
        if (!response.success) {
            return {
                success: false,
                error: response.error,
                data: false,
                message: response.message,
                status: response.status,
            };
        }

        return {
            success: true,
            data: true,
            message: "Otp send successfully",
            status: 200,
        };
    }

    static async verifyOtp(
        phoneNumber: string,
        otp: string,
    ): Promise<ApiResponse<User>> {
        const response = await api.post(`${this.BASE_URL}/verify`, {
            phoneNumber: phoneNumber.replace("+91", ""),
            otp,
        });
        console.log(response);
        if (!response.success) {
            return {
                success: false,
                error: response.error,
                data: response.data,
                message: response.message,
                status: response.status,
            };
        }

        // Store token in AsyncStorage
        await setAuthToken(response.data.accessToken);

        // Also set token in API instance for immediate use
        api.setAuthToken(response.data.accessToken);

        return {
            success: true,
            data: {
                ...response.data.user,
                accessToken: response.data.accessToken,
            },
            message: "Otp verified successfully",
            status: 200,
        };
    }

    static async selfVerification(): Promise<ApiResponse<User>> {
        const response = await api.get(`${this.BASE_URL}/current-user`);
        console.log(response);
        if (!response.success) {
            return {
                success: false,
                error: response.error,
                data: response.data,
                message: response.message,
                status: response.status,
            };
        }

        return {
            success: true,
            data: response.data,
            message: "User data fetched successfully",
            status: 200,
        };
    }

    static async editUserProfile(
        body: UserUpdateBody,
    ): Promise<ApiResponse<{ user: User }>> {
        const response = await api.put<{ user: User }>(
            `${this.BASE_URL}/profile`,
            body,
        );

        if (!response.success) {
            return {
                success: false,
                message:
                    response.error?.message || "User profile update failed",
                error: response.error,
                data: null,
                status: response.status,
            };
        }

        return {
            success: true,
            data: response.data,
            status: response.status,
            message: response.message || "User profile update successful",
        };
    }

    static async updateProfilePicture({
        name,
        uri,
        type,
    }: {
        name: string;
        uri: string;
        type: string;
    }): Promise<ApiResponse<User>> {
        // Create FormData for file upload
        const formData = new FormData();

        // Android needs the file object in a specific format
        const fileToUpload = {
            uri: Platform.OS === "android" ? uri : uri.replace("file://", ""),
            name: name || "profile-image.jpg",
            type: type || "image/jpeg",
        };

        formData.append("image", fileToUpload as any);

        console.log("Uploading image with data:", fileToUpload);

        const response = await api.put<any>(
            `${this.BASE_URL}/profile`,
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            },
        );

        console.log("Upload response:", response);

        if (!response.success) {
            return {
                success: false,
                message:
                    response.error?.message || "Profile picture update failed",
                error: response.error,
                data: null,
                status: response.status,
            };
        }

        return {
            success: true,
            data: response.data.user,
            status: response.status,
            message: response.message || "Profile picture update successful",
        };
    }

    static async registerFcmToken(
        deviceId: string,
        platform: string,
    ): Promise<ApiResponse<any>> {
        const token = await NotificationService.getToken();
        const response = await api.post<any>(`${this.BASE_URL}/fcm-register`, {
            fcmToken: token,
            deviceId,
            platform,
        });
        console.log(response);
        if (!response.success) {
            return {
                success: false,
                message:
                    response.error?.message || "FCM token registration failed",
                error: response.error,
                data: null,
                status: response.status,
            };
        }

        return {
            success: true,
            data: response.data,
            status: response.status,
            message: response.message || "FCM token registration successful",
        };
    }

    static async logout() {}
}
