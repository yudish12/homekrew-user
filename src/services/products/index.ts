import { API_URL } from "../../constants/axios-config";
import { api } from "../../lib";
import { ApiResponse } from "../../types";
import { GetProductsCategoriesResponse, Product } from "../../types/home-data";

export class ProductsServices {
    private static readonly BASE_URL = `${API_URL}/api/v1`;

    static async getProductCategories(): Promise<
        ApiResponse<GetProductsCategoriesResponse>
    > {
        const response = await api.get(
            `${this.BASE_URL}/categories?type=product&level=1`,
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
            pagination: response.data?.pagination,
            message: "Product categories fetched successfully",
            status: 200,
        };
    }

    static async getProducts(
        page: number,
        limit: number,
        categoryId?: string,
    ): Promise<ApiResponse<Product[]>> {
        let url = `${this.BASE_URL}/products?page=${page}&limit=${limit}`;
        if (categoryId) url += `&category=${categoryId}`;
        const response = await api.get(url);
        console.log("products", response);
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
            data: response.data.products,
            pagination: response.data.pagination,
            message: "Products fetched successfully",
            status: 200,
        };
    }

    static async getProductById(id: string): Promise<ApiResponse<Product>> {
        const response = await api.get(`${this.BASE_URL}/products/${id}`);
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
            message: "Product fetched successfully",
            status: 200,
        };
    }
}
