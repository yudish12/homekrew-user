import { AxiosRequestConfig, Method } from "axios";

// Types for the fetch utility
export interface FetchConfig
    extends Omit<AxiosRequestConfig, "method" | "url"> {
    method?: Method;
    url: string;
    authToken?: string;
    showError?: boolean;
    timeout?: number;
}

export interface ApiResponse<T = any> {
    data: T | null;
    status: number;
    message?: string;
    success: boolean;
    error?: ApiError;
    pagination?: PaginationMeta;
}

export interface ApiError {
    message: string;
    status: number;
    code: string;
    details?: any;
}

// Error codes for handling specific scenarios
export enum ErrorCodes {
    UNAUTHORIZED = "UNAUTHORIZED",
    FORBIDDEN = "FORBIDDEN",
    NETWORK_ERROR = "NETWORK_ERROR",
    TIMEOUT = "TIMEOUT",
    VALIDATION_ERROR = "VALIDATION_ERROR",
    SERVER_ERROR = "SERVER_ERROR",
    NOT_FOUND = "NOT_FOUND",
    UNKNOWN = "UNKNOWN",
}

export interface PaginationMeta {
    currentPage: number;
    hasNext: boolean;
    hasPrev: boolean;
    totalCount: number;
    totalPages: number;
}
