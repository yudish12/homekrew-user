import { API_URL } from "../../constants/axios-config";
import { api } from "../../lib";
import { ApiResponse } from "../../types";
import {
    Banner,
    ServiceCategory,
    ServiceTemplate,
} from "../../types/home-data";

export class UtilityServices {
    private static readonly BASE_URL = `${API_URL}/api/v1`;
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

    static async rateVendor(
        bookingId: string,
        rating: number,
        review: string,
    ): Promise<ApiResponse<any>> {
        const response = await api.post(`${this.BASE_URL}/rating`, {
            itemId: bookingId,
            itemType: "Vendor",
            rating,
            comment: review,
            sourceId: bookingId,
            sourceType: "Booking",
        });
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
            message: "Vendor rated successfully",
            status: 200,
        };
    }

    static async rateServiceTemplate(
        bookingId: string,
        rating: number,
        review: string,
    ): Promise<ApiResponse<any>> {
        const response = await api.post(`${this.BASE_URL}/rating`, {
            itemId: bookingId,
            itemType: "Booking",
            rating,
            comment: review,
            sourceId: bookingId,
            sourceType: "Booking",
        });
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
            message: "Service template rated successfully",
            status: 200,
        };
    }

    static async rateProduct(
        productId: string,
        orderId: string,
        rating: number,
        review: string,
    ): Promise<ApiResponse<any>> {
        const response = await api.post(`${this.BASE_URL}/rating`, {
            itemId: productId,
            itemType: "Product",
            rating,
            comment: review,
            sourceId: orderId,
            sourceType: "Order",
        });
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
            message: "Product rated successfully",
            status: 200,
        };
    }

    static async getAppSettings(): Promise<ApiResponse<any>> {
        const response = await api.get(`${this.BASE_URL}/settings`);
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
            message: "App settings fetched successfully",
            status: 200,
        };
    }
}
