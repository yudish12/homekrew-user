import { api } from "../../lib";
import { ApiResponse } from "../../types";
import { Banner } from "../../types/home-data";

export class UtilityServices {
    private static readonly BASE_URL = "https://ao1.onrender.com/api/v1";
    private static dispatch: any = null;

    static async getBanners(): Promise<ApiResponse<Banner[]>> {
        const response = await api.get(`${this.BASE_URL}/banner`);
        if (!response.success) {
            return {
                success: false,
                error: response.error,
                data: response.data.banners,
                message: response.message,
                status: response.status,
                pagination: response.data.pagination,
            };
        }

        return {
            success: true,
            data: response.data.banners,
            message: "Banners fetched successfully",
            status: 200,
            pagination: response.data.pagination,
        };
    }
}
