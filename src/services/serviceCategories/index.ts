import { api } from "../../lib";
import { ApiResponse } from "../../types";
import { ServiceCategory, ServiceTemplate } from "../../types/home-data";

export class ServiceCategoryUtil {
    private static readonly BASE_URL = "https://ao1.onrender.com/api/v1";

    static async getCategories(
        level: number,
        parentCategory?: string,
        page?: number,
        limit?: number,
        isFeatured?: boolean,
    ): Promise<ApiResponse<ServiceCategory[]>> {
        let url = `${this.BASE_URL}/categories?type=service&level=${level}`;

        if (parentCategory) url += `&parentCategory=${parentCategory}`;
        if (page) url += `&page=${page}`;
        if (limit) url += `&limit=${limit}`;
        if (isFeatured) url += `&isFeatured=${isFeatured}`;
        const response = await api.get(url);
        console.log("service", response);

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
            data: response.data.categories,
            pagination: response.data.pagination,
            message: "Service categories fetched successfully",
            status: 200,
        };
    }

    static async getServiceTemplates(
        id: string,
    ): Promise<ApiResponse<ServiceTemplate[]>> {
        const response = await api.get(
            `${this.BASE_URL}/service-templates?category=${id}`,
        );
        console.log(response);
        if (!response.success) {
            return {
                success: false,
                error: response.error,
                data: response.data.serviceTemplates,
                message: response.message,
                status: response.status,
            };
        }

        return {
            success: true,
            data: response.data.serviceTemplates,
            pagination: response.data.pagination,
            message: "Service templates fetched successfully",
            status: 200,
        };
    }

    static async getServiceTemplateById(
        id: string,
    ): Promise<ApiResponse<ServiceTemplate>> {
        const response = await api.get(
            `${this.BASE_URL}/service-templates/${id}`,
        );
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
            message: "Service template fetched successfully",
            status: 200,
        };
    }
}
