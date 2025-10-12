import { api } from "../../lib";
import { ApiResponse } from "../../types";
import {
    Banner,
    ServiceCategory,
    ServiceTemplate,
} from "../../types/home-data";

export class UtilityServices {
    private static readonly BASE_URL = "https://ao1.onrender.com/api/v1";
    private static dispatch: any = null;

    static async getBanners(): Promise<ApiResponse<Banner[]>> {
        const response = await api.get(`${this.BASE_URL}/banner`);
        console.log(response, "banners");
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

    static async getSearchResults(
        query: string,
    ): Promise<ApiResponse<ServiceCategory[]>> {
        const response = await api.get(
            `${this.BASE_URL}/categories?search=${query}`,
        );
        if (!response.success) {
            return {
                success: false,
                error: response.error,
                data: response.data.categories,
                message: response.message,
                status: response.status,
                pagination: response.data.pagination,
            };
        }

        return {
            success: true,
            data: response.data.categories,
            message: "Search results fetched successfully",
            status: 200,
            pagination: response.data.pagination,
        };
    }

    static async getActiveBookings(): Promise<ApiResponse<any>> {
        const response = await api.get(`${this.BASE_URL}/bookings/user/active`);
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
            message: "Active bookings fetched successfully",
            status: 200,
        };
    }

    static async getFeaturedServiceTemplate(): Promise<
        ApiResponse<ServiceTemplate[]>
    > {
        const response = await api.get(
            `${this.BASE_URL}/service-templates?isFeatured=true`,
        );
        if (!response.success) {
            return {
                success: false,
                status: response.status,
                error: response.error,
                data: response.data.serviceTemplates,
            };
        }

        return {
            success: true,
            data: response.data.serviceTemplates,
            message: "Featured service templates fetched successfully",
            status: 200,
        };
    }
}
