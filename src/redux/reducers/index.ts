import { combineReducers } from "redux";
import { authReducer } from "./auth";
import { cartReducer } from "./cart";
import { addressReducer } from "./address";
import { appSettingsReducer } from "./app-settings";
export * from "./address";
export * from "./app-settings";

export const rootReducer = combineReducers({
    auth: authReducer,
    cart: cartReducer,
    address: addressReducer,
    appSettings: appSettingsReducer,
});
