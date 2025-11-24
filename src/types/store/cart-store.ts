import { Coupon } from "../cart";

export interface CartItem {
    id: string;
    quantity: number;
    singleItemPrice: number;
    image: string;
    name: string;
}

export interface CartState {
    items: CartItem[];
    totalPrice: number;
    platformFee: number;
    isLoading: boolean;
    totalQuantity: number;
    coupon: Coupon | undefined;
}
