import { RootState } from "../../types";

export const getAppSettings = (state: RootState) => {
    return state.appSettings.settings;
};

export const getAppSettingsLoading = (state: RootState) => {
    return state.appSettings.loading;
};

export const getAppSettingsError = (state: RootState) => {
    return state.appSettings.error;
};

export const getSupportEmail = (state: RootState) => {
    return state.appSettings.settings?.supportEmail || "";
};

export const getSupportPhone = (state: RootState) => {
    return state.appSettings.settings?.supportPhone || "";
};

export const getChatSupportEnabled = (state: RootState) => {
    return state.appSettings.settings?.chatSupportEnabled || false;
};

