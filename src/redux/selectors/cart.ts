import { RootState } from "../../types";

export const getCartItems = (state: RootState) => state.cart.items;

export const getCartTotalPrice = (state: RootState) => state.cart.totalPrice;

export const getCartTotalQuantity = (state: RootState) =>
    state.cart.totalQuantity;

export const getCartItemCount = (state: RootState) => state.cart.items.length;

export const getCartItemById = (id: string) => (state: RootState) =>
    state.cart.items.find(item => item.id === id);

export const isCartLoading = (state: RootState) => state.cart.isLoading;

export const isItemInCart = (id: string) => (state: RootState) =>
    state.cart.items.some(item => item.id === id);

export const getOrderSummary = (state: RootState) => {
    const coupon = state.cart.coupon;
    let discount = 0;
    if (coupon) {
        if (coupon.discountType === "fixed") {
            discount = coupon.discountValue;
        } else if (coupon.discountType === "percentage") {
            discount = (state.cart.totalPrice * coupon.discountValue) / 100;
        }
    }
    return {
        subtotal: state.cart.totalPrice - discount,
        deliveryFee: 0,
        processingFee: 0,
        total: state.cart.totalPrice - discount,
        coupon: coupon,
        discount: discount,
    };
};
