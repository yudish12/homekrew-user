export type ToastType = "success" | "error" | "info" | "warning";

export interface ToastConfig {
    type: ToastType;
    title: string;
    message?: string;
    duration?: number;
    onPress?: () => void;
    onDismiss?: () => void;
    showCloseButton?: boolean;
    position?: "top" | "bottom";
}
