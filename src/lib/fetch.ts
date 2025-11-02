import axios, { AxiosError, AxiosInstance, AxiosResponse } from "axios";
import { DEFAULT_CONFIG, ERROR_MESSAGES } from "../constants";
import { ApiError, ApiResponse, FetchConfig, ErrorCodes } from "../types";
import { getAuthToken, removeAuthToken } from "./storage/auth-storage";

class FetchUtility {
    private instance: AxiosInstance;
    private baseURL: string;

    constructor(baseURL: string = "") {
        this.baseURL = baseURL;
        this.instance = axios.create({
            baseURL: this.baseURL,
            ...DEFAULT_CONFIG,
        });

        // Request interceptor
        this.instance.interceptors.request.use(
            async config => {
                return config;
            },
            error => {
                return Promise.reject(error);
            },
        );

        // Response interceptor - removed since we handle errors in request method
        this.instance.interceptors.response.use(
            response => {
                return response;
            },
            (error: AxiosError) => {
                return Promise.reject(error);
            },
        );
    }

    private createApiError(error: AxiosError): ApiError {
        if (error.code === "ECONNABORTED") {
            return {
                message: ERROR_MESSAGES.TIMEOUT_ERROR,
                status: 408,
                code: ErrorCodes.TIMEOUT,
            };
        } else if (!error.response) {
            return {
                message: ERROR_MESSAGES.NETWORK_ERROR,
                status: 0,
                code: ErrorCodes.NETWORK_ERROR,
            };
        } else {
            const { status, data } = error.response;

            switch (status) {
                case 400:
                    return {
                        message:
                            (data as any)?.message ||
                            ERROR_MESSAGES.VALIDATION_ERROR,
                        status,
                        code: ErrorCodes.VALIDATION_ERROR,
                        details: data,
                    };
                case 401:
                    this.removeAuthToken();
                    removeAuthToken();
                    return {
                        message: ERROR_MESSAGES.UNAUTHORIZED,
                        status,
                        code: ErrorCodes.UNAUTHORIZED,
                    };
                case 403:
                    return {
                        message:
                            (data as any)?.message || ERROR_MESSAGES.FORBIDDEN,
                        status,
                        code: ErrorCodes.FORBIDDEN,
                    };
                case 404:
                    return {
                        message: ERROR_MESSAGES.NOT_FOUND,
                        status,
                        code: ErrorCodes.NOT_FOUND,
                    };
                case 500:
                    return {
                        message: ERROR_MESSAGES.SERVER_ERROR,
                        status,
                        code: ErrorCodes.SERVER_ERROR,
                    };
                default:
                    return {
                        message:
                            (data as any)?.message ||
                            ERROR_MESSAGES.UNKNOWN_ERROR,
                        status,
                        code: ErrorCodes.UNKNOWN,
                        details: data,
                    };
            }
        }
    }

    // Generic request method
    async request<T = any>(config: FetchConfig): Promise<ApiResponse<T>> {
        try {
            const { ...axiosConfig } = config;
            const authToken = await getAuthToken();
            console.log("Auth token:", authToken);

            // Check if data is FormData
            const isFormData = axiosConfig.data instanceof FormData;

            // Remove the duplicate Authorization header logic from here
            // Let the interceptor handle it
            const requestConfig = {
                ...axiosConfig,
                headers: {
                    ...axiosConfig.headers,
                    Authorization: `Bearer ${authToken}`,
                },
                // For FormData, let axios handle the content type and transformation
                ...(isFormData && {
                    transformRequest: (data: any) => data,
                }),
            };

            console.log("Request config:", {
                url: requestConfig.url,
                method: requestConfig.method,
                isFormData,
                headers: requestConfig.headers,
            });

            const response: AxiosResponse<T> = await this.instance.request(
                requestConfig,
            );

            // Return success response with proper typing
            // Handle nested data structure from API
            const apiData = response.data as any;
            const actualData = apiData?.data || apiData;
            const message = apiData?.message || "Success";

            return {
                data: actualData,
                status: response.status,
                message: message,
                success: true,
            } as ApiResponse<T>;
        } catch (error) {
            console.log("Error:", error);
            const apiError = this.createApiError(error as AxiosError);

            // Log error for debugging
            console.error(`API Error:${config.url}`, apiError);
            console.error("Full error:", error);

            // Return error response instead of throwing
            return {
                data: null,
                status: apiError.status,
                message: apiError.message,
                success: false,
                error: apiError,
            } as ApiResponse<T>;
        }
    }

    // GET request
    async get<T = any>(
        url: string,
        config?: Omit<FetchConfig, "method" | "url">,
    ): Promise<ApiResponse<T>> {
        return this.request<T>({
            method: "GET",
            url,
            ...config,
        });
    }

    // POST request
    async post<T = any>(
        url: string,
        data?: any,
        config?: Omit<FetchConfig, "method" | "url">,
    ): Promise<ApiResponse<T>> {
        return this.request<T>({
            method: "POST",
            url,
            data,
            ...config,
        });
    }

    // PUT request
    async put<T = any>(
        url: string,
        data?: any,
        config?: Omit<FetchConfig, "method" | "url">,
    ): Promise<ApiResponse<T>> {
        return this.request<T>({
            method: "PUT",
            url,
            data,
            ...config,
        });
    }

    // PATCH request
    async patch<T = any>(
        url: string,
        data?: any,
        config?: Omit<FetchConfig, "method" | "url">,
    ): Promise<ApiResponse<T>> {
        return this.request<T>({
            method: "PATCH",
            url,
            data,
            ...config,
        });
    }

    // DELETE request
    async delete<T = any>(
        url: string,
        config?: Omit<FetchConfig, "method" | "url">,
    ): Promise<ApiResponse<T>> {
        return this.request<T>({
            method: "DELETE",
            url,
            ...config,
        });
    }

    // Upload file
    async upload<T = any>(
        url: string,
        formData: FormData,
        config?: Omit<FetchConfig, "method" | "url">,
    ): Promise<ApiResponse<T>> {
        return this.request<T>({
            method: "POST",
            url,
            data: formData,
            headers: {
                "Content-Type": "multipart/form-data",
            },
            ...config,
        });
    }

    // Download file
    async download(
        url: string,
        config?: Omit<FetchConfig, "method" | "url">,
    ): Promise<Blob> {
        const response = await this.instance.request({
            method: "GET",
            url,
            responseType: "blob",
            ...config,
        });
        return response.data;
    }

    // Set base URL
    setBaseURL(baseURL: string): void {
        this.baseURL = baseURL;
        this.instance.defaults.baseURL = baseURL;
    }

    // Set default auth token
    setAuthToken(token: string): void {
        this.instance.interceptors.request.use(
            async config => {
                // Try to get token from storage if no Authorization header
                try {
                    config.headers.Authorization = `Bearer ${token}`;
                    console.log("Token from storage:", token, config.url);
                } catch (error) {
                    console.warn(
                        "Failed to get auth token from storage:",
                        error,
                    );
                }
                return config;
            },
            error => {
                return Promise.reject(error);
            },
        );
    }

    // Remove auth token
    removeAuthToken(): void {
        delete this.instance.defaults.headers.common.Authorization;
    }

    // Get axios instance (for advanced usage)
    getInstance(): AxiosInstance {
        return this.instance;
    }
}

// Create default instance
const fetchUtility = new FetchUtility();

// Export the instance and class
export default fetchUtility;
export { FetchUtility };

// Convenience exports
export const api = {
    get: fetchUtility.get.bind(fetchUtility),
    post: fetchUtility.post.bind(fetchUtility),
    put: fetchUtility.put.bind(fetchUtility),
    patch: fetchUtility.patch.bind(fetchUtility),
    delete: fetchUtility.delete.bind(fetchUtility),
    upload: fetchUtility.upload.bind(fetchUtility),
    download: fetchUtility.download.bind(fetchUtility),
    setAuthToken: fetchUtility.setAuthToken.bind(fetchUtility),
    removeAuthToken: fetchUtility.removeAuthToken.bind(fetchUtility),
};
