import { AUTH_ACTIONS } from "../../constants";
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
