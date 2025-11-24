import { CART_ACTIONS } from "../../constants";
import { Coupon } from "../../types";

export const addToCart = (
    id: string,
    quantity: number,
    singleItemPrice: number,
    image: string,
    name: string,
    platformFee: number,
) => {
    return {
        type: CART_ACTIONS.ADD_TO_CART,
        payload: {
            id,
            quantity,
            singleItemPrice,
            image,
            name,
            platformFee,
        },
    };
};

export const removeFromCart = (id: string) => {
    return {
        type: CART_ACTIONS.REMOVE_FROM_CART,
        payload: id,
    };
};

export const applyCoupon = (couponCode: Coupon) => {
    return {
        type: CART_ACTIONS.APPLY_COUPON,
        payload: couponCode,
    };
};

export const removeCoupon = () => {
    return {
        type: CART_ACTIONS.REMOVE_COUPON,
    };
};

export const updateQuantity = (id: string, quantity: number) => {
    return {
        type: CART_ACTIONS.UPDATE_QUANTITY,
        payload: {
            id,
            quantity,
        },
    };
};

export const clearCart = () => {
    return {
        type: CART_ACTIONS.CLEAR_CART,
    };
};
