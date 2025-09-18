import { AUTH_ACTIONS } from "../../constants";
import { removeAuthToken } from "../../lib";
import { AppDispatch, RootState } from "../../types";
import { User } from "../../types/user";

export const toggleIsAuthenticated = (isAuthenticated: boolean) => {
    return {
        type: AUTH_ACTIONS.TOGGLE_IS_AUTHENTICATED,
        payload: isAuthenticated,
    };
};

export const setUser = (user: User) => {
    return {
        type: AUTH_ACTIONS.SET_USER,
        payload: user,
    };
};

export const logoutAction = () => {
    return {
        type: AUTH_ACTIONS.LOGOUT,
    };
};

export const logout = () => async (dispatch: AppDispatch) => {
    await removeAuthToken();
    dispatch(logoutAction());
};
