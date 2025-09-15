import React from "react";
import { View, StyleSheet, Text } from "react-native";
import Toast from "react-native-toast-message";
import { COLORS } from "../constants/ui";

export type ToastType = "success" | "error" | "info" | "warning";

export interface ToastConfig {
    type: ToastType;
    title: string;
    message?: string;
    duration?: number;
    onPress?: () => void;
    onDismiss?: () => void;
    position?: "top" | "bottom";
}

// Very simple toast layouts using basic Text components
const toastConfig = {
    success: ({ text1, text2 }: any) => (
        <View style={[styles.toastContainer, styles.successToast]}>
            <Text style={styles.toastTitle}>{text1}</Text>
            {text2 && <Text style={styles.toastMessage}>{text2}</Text>}
        </View>
    ),

    error: ({ text1, text2 }: any) => (
        <View style={[styles.toastContainer, styles.errorToast]}>
            <Text style={styles.toastTitle}>{text1}</Text>
            {text2 && <Text style={styles.toastMessage}>{text2}</Text>}
        </View>
    ),

    info: ({ text1, text2 }: any) => (
        <View style={[styles.toastContainer, styles.infoToast]}>
            <Text style={styles.toastTitle}>{text1}</Text>
            {text2 && <Text style={styles.toastMessage}>{text2}</Text>}
        </View>
    ),

    warning: ({ text1, text2 }: any) => (
        <View style={[styles.toastContainer, styles.warningToast]}>
            <Text style={styles.toastTitle}>{text1}</Text>
            {text2 && <Text style={styles.toastMessage}>{text2}</Text>}
        </View>
    ),
};

const styles = StyleSheet.create({
    toastContainer: {
        marginHorizontal: 16,
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 16,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    successToast: {
        backgroundColor: "#D1FAE5",
        borderLeftWidth: 4,
        borderLeftColor: COLORS.GREEN[700],
    },
    errorToast: {
        backgroundColor: "#FEE2E2",
        borderLeftWidth: 4,
        borderLeftColor: COLORS.RED[500],
    },
    infoToast: {
        backgroundColor: "#DBEAFE",
        borderLeftWidth: 4,
        borderLeftColor: COLORS.primary,
    },
    warningToast: {
        backgroundColor: "#FEF3C7",
        borderLeftWidth: 4,
        borderLeftColor: "#F59E0B",
    },
    toastTitle: {
        fontSize: 14,
        fontWeight: "600",
        color: COLORS.TEXT.DARK,
        marginBottom: 2,
    },
    toastMessage: {
        fontSize: 12,
        color: COLORS.GREY[500],
        lineHeight: 16,
    },
});

// Toast utility functions
export const showToast = (config: ToastConfig) => {
    const {
        type,
        title,
        message,
        duration = 3000,
        onPress,
        onDismiss,
        position = "top",
    } = config;

    Toast.show({
        type,
        text1: title,
        text2: message,
        position,
        visibilityTime: duration,
        onPress,
        onHide: onDismiss,
        topOffset: 60,
    });
};

// Convenience methods
export const showSuccessToast = (
    title: string,
    message?: string,
    options?: Partial<ToastConfig>,
) => {
    showToast({
        type: "success",
        title,
        message,
        ...options,
    });
};

export const showErrorToast = (
    title: string,
    message?: string,
    options?: Partial<ToastConfig>,
) => {
    showToast({
        type: "error",
        title,
        message,
        ...options,
    });
};

export const showInfoToast = (
    title: string,
    message?: string,
    options?: Partial<ToastConfig>,
) => {
    showToast({
        type: "info",
        title,
        message,
        ...options,
    });
};

export const showWarningToast = (
    title: string,
    message?: string,
    options?: Partial<ToastConfig>,
) => {
    showToast({
        type: "warning",
        title,
        message,
        ...options,
    });
};

// Main Toast component
export const ToastComponent: React.FC = () => {
    return <Toast config={toastConfig} />;
};

export default ToastComponent;
