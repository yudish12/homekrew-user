import { useCallback } from "react";
import {
    showToast,
    showSuccessToast,
    showErrorToast,
    showInfoToast,
    showWarningToast,
} from "../components/Toast";
import { ToastConfig } from "../types";

export const useToast = () => {
    const toast = useCallback((config: ToastConfig) => {
        showToast(config);
    }, []);

    const success = useCallback(
        (title: string, message?: string, options?: Partial<ToastConfig>) => {
            showSuccessToast(title, message, options);
        },
        [],
    );

    const error = useCallback(
        (title: string, message?: string, options?: Partial<ToastConfig>) => {
            showErrorToast(title, message, options);
        },
        [],
    );

    const info = useCallback(
        (title: string, message?: string, options?: Partial<ToastConfig>) => {
            showInfoToast(title, message, options);
        },
        [],
    );

    const warning = useCallback(
        (title: string, message?: string, options?: Partial<ToastConfig>) => {
            showWarningToast(title, message, options);
        },
        [],
    );

    return {
        toast,
        success,
        error,
        info,
        warning,
    };
};
