export interface Coupon {
    id: string;
    code: string;
    discount: string;
    discountType: "fixed" | "percentage";
    maxDiscount: number;
    discountValue: number;
    isFlatDiscount: boolean;
}

export interface CouponResponse {
    count: 1;
    coupons: Coupon[];
    success: true;
}
