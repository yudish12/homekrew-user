import { APP_SETTINGS_ACTIONS } from "../../constants";
import { UtilityServices } from "../../services/utility-services";
import { AppDispatch } from "../../types";

export const fetchAppSettingsRequest = () => {
    return {
        type: APP_SETTINGS_ACTIONS.FETCH_SETTINGS_REQUEST,
    };
};

export const fetchAppSettingsSuccess = (settings: any) => {
    return {
        type: APP_SETTINGS_ACTIONS.FETCH_SETTINGS_SUCCESS,
        payload: settings,
    };
};

export const fetchAppSettingsFailure = (error: string) => {
    return {
        type: APP_SETTINGS_ACTIONS.FETCH_SETTINGS_FAILURE,
        payload: error,
    };
};

export const fetchAppSettings = () => async (dispatch: AppDispatch) => {
    try {
        dispatch(fetchAppSettingsRequest());
        const response = await UtilityServices.getAppSettings();
        
        if (response.success && response.data) {
            dispatch(fetchAppSettingsSuccess(response.data));
        } else {
            dispatch(fetchAppSettingsFailure(response.message || "Failed to fetch app settings"));
        }
    } catch (error: any) {
        dispatch(fetchAppSettingsFailure(error.message || "An error occurred"));
    }
};

