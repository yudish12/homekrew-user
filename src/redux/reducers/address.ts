import { ADDRESS_ACTIONS } from "../../constants";
import { AddressState } from "../../types";

export const AddressInitialState: AddressState = {
    loading: false,
    error: null,
    addresses: [],
    selectedAddress: null,
};

export const addressReducer = (state = AddressInitialState, action: any) => {
    switch (action.type) {
        case ADDRESS_ACTIONS.GET_ADDRESSES_REQUEST:
            return { ...state, loading: true };
        case ADDRESS_ACTIONS.GET_ADDRESSES_SUCCESS:
            return { ...state, loading: false, addresses: action.payload };
        case ADDRESS_ACTIONS.GET_ADDRESSES_FAILURE:
            return { ...state, loading: false, error: action.payload };
        case ADDRESS_ACTIONS.ADD_ADDRESS_REQUEST:
            return { ...state, loading: true };
        case ADDRESS_ACTIONS.ADD_ADDRESS_SUCCESS:
            return {
                ...state,
                loading: false,
                addresses: [...state.addresses, action.payload],
            };
        case ADDRESS_ACTIONS.ADD_ADDRESS_FAILURE:
            return { ...state, loading: false, error: action.payload };
        case ADDRESS_ACTIONS.SET_SELECTED_ADDRESS:
            return { ...state, selectedAddress: action.payload };
        case ADDRESS_ACTIONS.CLEAR_SELECTED_ADDRESS:
            return { ...state, selectedAddress: null };
        case ADDRESS_ACTIONS.CLEAR_ERROR:
            return { ...state, error: null };
        default:
            return state;
    }
};
