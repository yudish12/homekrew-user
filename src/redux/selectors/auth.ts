import { RootState } from "../../types";

export const isAuthenticated = (state: RootState) => {
    return !!state.auth.user;
};

export const getUser = (state: RootState) => {
    return state.auth.user;
};
