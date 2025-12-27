import { API_URL } from "../../constants/axios-config";
import { api } from "../../lib";
import { ApiResponse } from "../../types";
import {
    AddAddressResponse,
    AddressResponse,
    LocationDetailsResponse,
    SearchLocationResponse,
} from "../../types/services";
import { UserAddress } from "../../types/user-address";

export class AddressServices {
    private static readonly BASE_URL = `${API_URL}/api/v1/user`;
    private static readonly GOOGLE_API_BASE = `${API_URL}/api/v1/google`;
    private static dispatch: any = null;

    static async getAllAddresses(): Promise<ApiResponse<AddressResponse>> {
        const response = await api.get(`${this.BASE_URL}/addresses`);
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
            message: "Addresses fetched successfully",
            status: 200,
        };
    }

    static async addAddress(
        addressData: Omit<UserAddress, "_id">,
    ): Promise<ApiResponse<AddAddressResponse>> {
        const response = await api.post(
            `${this.BASE_URL}/addresses`,
            addressData,
        );
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
            message: "Address added successfully",
            status: 200,
        };
    }

    static async getLocationDetails(
        lat: number,
        lng: number,
    ): Promise<ApiResponse<LocationDetailsResponse>> {
        const response = await api.get(
            `${this.GOOGLE_API_BASE}/location?lat=${lat}&lng=${lng}`,
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
            message: "Location details fetched successfully",
            status: 200,
        };
    }

    static async searchLocation(
        query: string,
    ): Promise<ApiResponse<SearchLocationResponse[]>> {
        const response = await api.get(
            `${this.GOOGLE_API_BASE}/search?query=${query}`,
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
            message: "Location details fetched successfully",
            status: 200,
        };
    }
}
