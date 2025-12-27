import { API_URL } from "../../constants/axios-config";
import { api } from "../../lib";
import { ApiResponse, MembershipPlan } from "../../types";
import { RazorPayOrder } from "../../types/services/orders";

export class MembershipPlansServices {
    private static readonly BASE_URL = `${API_URL}/api/v1`;

    static async getMembershipPlans(): Promise<ApiResponse<MembershipPlan[]>> {
        const response = await api.get<MembershipPlan[]>(
            `${MembershipPlansServices.BASE_URL}/memberships/plans`,
        );
        if (response.success) {
            return {
                data: response.data,
                success: true,
                status: 200,
            };
        }
        return {
            success: false,
            status: response.status,
            error: response.error,
            data: response.data,
        };
    }

    static async buyMembershipPlan(
        planId: string,
    ): Promise<ApiResponse<RazorPayOrder>> {
        const response = await api.post(
            `${MembershipPlansServices.BASE_URL}/payments/membership`,
            {
                planId,
                paymentMethod: "razorpay",
            },
        );
        if (response.success) {
            return {
                data: response.data.razorpayOrder,
                success: true,
                status: 200,
            };
        }
        return {
            success: false,
            status: response.status,
            error: response.error,
            data: response.data,
        };
    }
}
