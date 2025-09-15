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

export const getOrderSummary = (state: RootState) => ({
    subtotal: state.cart.totalPrice,
    deliveryFee: 0,
    processingFee: 0,
    total: state.cart.totalPrice,
});
