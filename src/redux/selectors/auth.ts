import { RootState } from "../../types";

export const isAuthenticated = (state: RootState) => {
    return !!state.auth.user;
};

export const isProfileCompleted = (state: RootState) => {
    return state?.auth?.user?.profileCompleted;
    // return true;
};

export const getUser = (state: RootState) => {
    return state.auth.user;
};
