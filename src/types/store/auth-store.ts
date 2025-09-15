import { User } from "../user";

export interface AuthState {
    user: User | null;
    loading: boolean;
    error: null | unknown;
    isSigningUp: boolean;
    isSigningIn: boolean;
}
