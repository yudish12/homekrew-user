import { combineReducers } from "redux";
import { authReducer } from "./auth";
import { cartReducer } from "./cart";
import { addressReducer } from "./address";
export * from "./address";

export const rootReducer = combineReducers({
    auth: authReducer,
    cart: cartReducer,
    address: addressReducer,
});
