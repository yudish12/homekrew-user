import { AUTH_ACTIONS } from "../../constants/";
import { AuthState } from "../../types/store";

export const AuthInitialState: AuthState = {
    user: null,
    loading: false,
    error: null,
    isSigningUp: false,
    isSigningIn: false,
};

export const authReducer = (state = AuthInitialState, action: any) => {
    switch (action.type) {
        case AUTH_ACTIONS.GET_USER_REQUEST:
            return { ...state, loading: true };
        case AUTH_ACTIONS.GET_USER_SUCCESS:
            return { ...state, loading: false, user: action.payload.user };
        case AUTH_ACTIONS.GET_USER_FAILURE:
            return { ...state, loading: false, error: action.payload };
        case AUTH_ACTIONS.SET_SIGNIN_STATE:
            return { ...state, isSigningIn: action.payload };
        case AUTH_ACTIONS.CLEAR_SIGNIN_STATE:
            return { ...state, isSigningIn: false };
        case AUTH_ACTIONS.SET_SIGNUP_STATE:
            return { ...state, isSigningUp: action.payload };
        case AUTH_ACTIONS.CLEAR_SIGNUP_STATE:
            return { ...state, isSigningUp: false };
        case AUTH_ACTIONS.TOGGLE_IS_AUTHENTICATED:
            return { ...state, user: action.payload };
        case AUTH_ACTIONS.SET_USER:
            return { ...state, user: action.payload };
        case AUTH_ACTIONS.LOGOUT:
            return {
                ...state,
                user: null,
                isSigningUp: false,
                isSigningIn: false,
            };
        default:
            return state;
    }
};
