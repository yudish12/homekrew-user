import { ADDRESS_ACTIONS } from "../../constants";
import { AddressServices } from "../../services/address-services";
import { AppDispatch, RootState, UserAddress } from "../../types";

export const getAddressesRequest = () => {
    return {
        type: ADDRESS_ACTIONS.GET_ADDRESSES_REQUEST,
    };
};

export const getAddressSuccess = (addresses: UserAddress[]) => {
    return {
        type: ADDRESS_ACTIONS.GET_ADDRESSES_SUCCESS,
        payload: addresses,
    };
};

export const getAddressFailure = (error: string) => {
    return {
        type: ADDRESS_ACTIONS.GET_ADDRESSES_FAILURE,
        payload: error,
    };
};

export const addAddressRequest = () => {
    return {
        type: ADDRESS_ACTIONS.ADD_ADDRESS_REQUEST,
    };
};

export const addAddressSuccess = (address: UserAddress) => {
    return {
        type: ADDRESS_ACTIONS.ADD_ADDRESS_SUCCESS,
        payload: address,
    };
};

export const addAddressFailure = (error: string) => {
    return {
        type: ADDRESS_ACTIONS.ADD_ADDRESS_FAILURE,
        payload: error,
    };
};

export const setSelectedAddress = (address: UserAddress) => {
    return {
        type: ADDRESS_ACTIONS.SET_SELECTED_ADDRESS,
        payload: address,
    };
};

export const clearSelectedAddress = () => {
    return {
        type: ADDRESS_ACTIONS.CLEAR_SELECTED_ADDRESS,
    };
};

export const clearError = () => {
    return {
        type: ADDRESS_ACTIONS.CLEAR_ERROR,
    };
};

//thunks
export const getAddressesForUser = async (dispatch: AppDispatch) => {
    dispatch(getAddressesRequest());
    const response = await AddressServices.getAllAddresses();
    if (response.success) {
        dispatch(getAddressSuccess(response.data?.addresses ?? []));
    } else {
        dispatch(
            getAddressFailure(
                response.error?.message ?? "Something went wrong",
            ),
        );
    }
};

export const addAddress =
    (addressData: Omit<UserAddress, "_id">) =>
    async (dispatch: AppDispatch, getState: () => RootState) => {
        dispatch(addAddressRequest());
        const response = await AddressServices.addAddress(addressData);
        console.log(response.data);
        if (response.success && response.data) {
            dispatch(addAddressSuccess(response.data.address));
            dispatch(getAddressesForUser);
        } else {
            dispatch(
                addAddressFailure(
                    response.error?.message ?? "Something went wrong",
                ),
            );
        }
    };
