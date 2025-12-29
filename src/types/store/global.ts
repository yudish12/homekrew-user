import { UnknownAction } from "redux";
import { ThunkDispatch } from "redux-thunk";
import { AuthState } from "./auth-store";
import { CartState } from "./cart-store";
import { AddressState } from "./address-store";
import { AppSettingsStore } from "./app-settings";

export interface RootState {
    auth: AuthState;
    cart: CartState;
    address: AddressState;
    appSettings: AppSettingsStore;
}

export type AppDispatch = ThunkDispatch<RootState, unknown, UnknownAction>;
