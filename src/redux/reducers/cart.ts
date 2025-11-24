import { CART_ACTIONS } from "../../constants";
import { CartState } from "../../types";

export const CartInitialState: CartState = {
    items: [], //quantity and product id
    totalPrice: 0,
    isLoading: false,
    totalQuantity: 0,
    platformFee: 0,
    coupon: undefined,
};

export const cartReducer = (state = CartInitialState, action: any) => {
    switch (action.type) {
        case CART_ACTIONS.ADD_TO_CART:
            const newPrice =
                state.totalPrice +
                action.payload.singleItemPrice * action.payload.quantity;
            return {
                ...state,
                items: [...state.items, action.payload],
                totalPrice: newPrice,
                totalQuantity: state.totalQuantity + action.payload.quantity,
                platformFee: action.payload.platformFee,
            };
        case CART_ACTIONS.REMOVE_FROM_CART:
            const item = state.items.find(item => item.id === action.payload);
            if (!item) return state;
            return {
                ...state,
                items: state.items.filter(item => item.id !== action.payload),
                totalQuantity: state.totalQuantity - (item?.quantity ?? 0),
                totalPrice:
                    state.totalPrice - item.singleItemPrice * item.quantity,
            };
        case CART_ACTIONS.UPDATE_QUANTITY:
            let newTotalQuantity = state.totalQuantity;
            let newTotalPrice = state.totalPrice;
            let singleItemPrice = 1;
            return {
                ...state,
                items: state.items.map(item => {
                    if (item.id === action.payload.id) {
                        singleItemPrice = item.singleItemPrice;
                        return {
                            ...item,
                            quantity: item.quantity + action.payload.quantity,
                        };
                    }
                    return item;
                }),
                totalQuantity: newTotalQuantity + action.payload.quantity,
                totalPrice:
                    newTotalPrice + action.payload.quantity * singleItemPrice,
            };
        case CART_ACTIONS.CLEAR_CART:
            return { ...state, items: [], totalPrice: 0, totalQuantity: 0 };
        case CART_ACTIONS.APPLY_COUPON:
            return { ...state, coupon: action.payload };
        case CART_ACTIONS.REMOVE_COUPON:
            return { ...state, coupon: undefined };
        default:
            return state;
    }
};
