import { API_URL } from "../../constants/axios-config";
import { api } from "../../lib";
import { ApiResponse, Coupon, CouponResponse } from "../../types";
import {
    BookingData,
    BookingHistory,
    BookingResponse,
    BookOrderRequest,
    BookOrderResponse,
    OrderHistory,
} from "../../types/services/orders";

export class OrdersServices {
    private static readonly BASE_URL = `${API_URL}/api/v1`;

    static async bookService(
        bookingData: BookingData,
    ): Promise<ApiResponse<BookingResponse>> {
        const response = await api.post(
            `${this.BASE_URL}/bookings/service/book`,
            bookingData,
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
            message: "Booking successful",
            status: 200,
        };
    }

    static async bookOrder(
        body: BookOrderRequest,
    ): Promise<ApiResponse<BookOrderResponse>> {
        const response = await api.post(
            `${this.BASE_URL}/payments/product/create-order`,
            body,
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
            message: "Booking successful",
            status: 200,
        };
    }

    static async getOrderHistory(): Promise<ApiResponse<OrderHistory[]>> {
        const response = await api.get(`${this.BASE_URL}/orders/user`);
        if (!response.success) {
            return {
                success: false,
                error: response.error,
                data: response.data.orders,
                message: response.message,
                status: response.status,
            };
        }

        return {
            success: true,
            data: response.data.orders,
            message: "Order history fetched successfully",
            status: 200,
        };
    }

    static async getBookingStatus(
        bookingId: string,
    ): Promise<ApiResponse<any>> {
        const response = await api.get(
            `${this.BASE_URL}/bookings/status/${bookingId}`,
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
            message: "Booking status fetched successfully",
            status: 200,
        };
    }

    static async getServiceBookingHistory(
        id: string,
    ): Promise<ApiResponse<BookingHistory[]>> {
        const response = await api.get(`${this.BASE_URL}/bookings/user/${id}`);
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
            data: response.data.bookings,
            message: "Booking history fetched successfully",
            status: 200,
            pagination: response.data.pagination,
        };
    }

    static async bookingPayNow(bookingId: string): Promise<ApiResponse<any>> {
        const response = await api.post(`${this.BASE_URL}/payments/bookings`, {
            bookingId,
            paymentMethod: "razorpay",
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
            message: "Booking status fetched successfully",
            status: 200,
        };
    }

    static async getCoupons(
        type: "service" | "product",
        id: string,
    ): Promise<ApiResponse<CouponResponse>> {
        const response = await api.get(
            `${this.BASE_URL}/coupons/${type}/${id}`,
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
            message: "Coupons fetched successfully",
            status: 200,
        };
    }

    static async getBookingPrice(
        serviceTemplateId: string,
        quantity: number,
        couponCode?: string,
    ) {
        const response = await api.post(`${this.BASE_URL}/bookings/preview`, {
            serviceId: serviceTemplateId,
            quantity,
            appliedCoupon: couponCode,
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
            message: "Booking price fetched successfully",
            status: 200,
        };
    }
}
