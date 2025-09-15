import { CART_ACTIONS } from "../../constants";

export const addToCart = (
    id: string,
    quantity: number,
    singleItemPrice: number,
    image: string,
    name: string,
) => {
    return {
        type: CART_ACTIONS.ADD_TO_CART,
        payload: {
            id,
            quantity,
            singleItemPrice,
            image,
            name,
        },
    };
};

export const removeFromCart = (id: string) => {
    return {
        type: CART_ACTIONS.REMOVE_FROM_CART,
        payload: id,
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
