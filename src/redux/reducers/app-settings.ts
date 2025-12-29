import { APP_SETTINGS_ACTIONS } from "../../constants/";
import { AppSettingsStore } from "../../types/store";

export const AppSettingsInitialState: AppSettingsStore = {
    settings: null,
    loading: false,
    error: null,
};

export const appSettingsReducer = (
    state = AppSettingsInitialState,
    action: any,
) => {
    switch (action.type) {
        case APP_SETTINGS_ACTIONS.FETCH_SETTINGS_REQUEST:
            return { ...state, loading: true, error: null };
        case APP_SETTINGS_ACTIONS.FETCH_SETTINGS_SUCCESS:
            return {
                ...state,
                loading: false,
                settings: action.payload,
                error: null,
            };
        case APP_SETTINGS_ACTIONS.FETCH_SETTINGS_FAILURE:
            return { ...state, loading: false, error: action.payload };
        default:
            return state;
    }
};

