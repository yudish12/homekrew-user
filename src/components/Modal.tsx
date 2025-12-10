import React, { useEffect, useRef } from "react";
import {
    View,
    StyleSheet,
    Modal as RNModal,
    Animated,
    TouchableOpacity,
    TouchableWithoutFeedback,
} from "react-native";
import { Typography } from "./Typography";
import { Button } from "./Button";
import { CustomIcon } from "./CustomIcon";
import { COLORS } from "../constants/ui";
import { uiUtils } from "../utils/ui";

const { screen, platform, shadow, borderRadius, modal, animation } = uiUtils;

export type ModalType = "success" | "error" | "warning" | "info" | "custom";

interface ModalProps {
    visible: boolean;
    onClose: () => void;
    transparent?: boolean;
    title?: string;
    message?: string;
    type?: ModalType;
    showCloseButton?: boolean;
    children?: React.ReactNode;
    primaryButton?: {
        title: string;
        onPress: () => void;
        loading?: boolean;
    };
    secondaryButton?: {
        title: string;
        onPress: () => void;
    };
    enableBackdropDismiss?: boolean;
    animationType?: "fade" | "slide" | "none";
}

const Modal: React.FC<ModalProps> = ({
    visible,
    onClose,
    title,
    message,
    type = "info",
    showCloseButton = true,
    children,
    primaryButton,
    secondaryButton,
    enableBackdropDismiss = true,
    animationType = "fade",
}) => {
    const scaleValue = useRef(new Animated.Value(0)).current;
    const opacityValue = useRef(new Animated.Value(0)).current;
    useEffect(() => {
        if (visible) {
            Animated.parallel([
                Animated.timing(scaleValue, {
                    toValue: 1,
                    duration: animation.durations.normal,
                    useNativeDriver: true,
                }),
                Animated.timing(opacityValue, {
                    toValue: 1,
                    duration: animation.durations.normal,
                    useNativeDriver: true,
                }),
            ]).start();
        } else {
            Animated.parallel([
                Animated.timing(scaleValue, {
                    toValue: 0,
                    duration: animation.durations.fast,
                    useNativeDriver: true,
                }),
                Animated.timing(opacityValue, {
                    toValue: 0,
                    duration: animation.durations.fast,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    }, [visible]);

    const iconConfig = modal.getIconConfig(type);
    const modalSize = modal.getModalSize();

    const handleBackdropPress = () => {
        if (enableBackdropDismiss) {
            onClose();
        }
    };

    const renderContent = () => {
        if (children) {
            return children;
        }

        return (
            <View style={styles.content}>
                {/* Icon */}
                <View
                    style={[
                        styles.iconContainer,
                        { backgroundColor: iconConfig.backgroundColor },
                    ]}
                >
                    <CustomIcon
                        provider="Ionicons"
                        name={iconConfig.name}
                        size={48}
                        color={iconConfig.color}
                    />
                </View>

                {/* Title */}
                {title && (
                    <Typography
                        variant="h4"
                        style={styles.title}
                        color={COLORS.TEXT.DARK}
                    >
                        {title}
                    </Typography>
                )}

                {/* Message */}
                {message && (
                    <Typography style={styles.message} color={COLORS.GREY[500]}>
                        {message}
                    </Typography>
                )}

                {/* Buttons */}
                <View style={styles.buttonContainer}>
                    {secondaryButton && (
                        <Button
                            title={secondaryButton.title}
                            variant="outline"
                            size="medium"
                            onPress={secondaryButton.onPress}
                            style={styles.secondaryButton}
                        />
                    )}
                    {primaryButton && (
                        <Button
                            title={primaryButton.title}
                            variant="primary"
                            size="medium"
                            loading={primaryButton.loading}
                            onPress={primaryButton.onPress}
                            style={styles.primaryButton}
                        />
                    )}
                </View>
            </View>
        );
    };

    return (
        <RNModal
            visible={visible}
            transparent
            animationType="none"
            statusBarTranslucent
            onRequestClose={onClose}
        >
            <TouchableWithoutFeedback onPress={handleBackdropPress}>
                <Animated.View
                    style={[
                        styles.backdrop,
                        {
                            opacity: opacityValue,
                        },
                    ]}
                >
                    <TouchableWithoutFeedback>
                        <Animated.View
                            style={[
                                styles.modalContainer,
                                modalSize,
                                {
                                    transform: [{ scale: scaleValue }],
                                },
                            ]}
                        >
                            <View style={styles.modal}>
                                {/* Close Button */}
                                {showCloseButton && (
                                    <TouchableOpacity
                                        style={styles.closeButton}
                                        onPress={onClose}
                                        activeOpacity={0.7}
                                    >
                                        <CustomIcon
                                            provider="Ionicons"
                                            name="close"
                                            size={20}
                                            color={COLORS.GREY[400]}
                                        />
                                    </TouchableOpacity>
                                )}

                                {renderContent()}
                            </View>
                        </Animated.View>
                    </TouchableWithoutFeedback>
                </Animated.View>
            </TouchableWithoutFeedback>
        </RNModal>
    );
};

const styles = StyleSheet.create({
    backdrop: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: uiUtils.spacing.md,
    },
    modalContainer: {
        width: "100%",
    },
    modal: {
        backgroundColor: COLORS.WHITE,
        borderRadius: borderRadius.xl,
        padding: uiUtils.spacing.lg,
        ...shadow.getShadow("large"),
        position: "relative",
    },
    closeButton: {
        position: "absolute",
        top: uiUtils.spacing.md,
        right: uiUtils.spacing.md,
        zIndex: 10,
        padding: uiUtils.spacing.xs,
        borderRadius: borderRadius.sm,
        backgroundColor: COLORS.GREY[100],
    },
    content: {
        alignItems: "center",
        paddingTop: uiUtils.spacing.sm,
    },
    iconContainer: {
        width: 80,
        height: 80,
        borderRadius: borderRadius.full,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: uiUtils.spacing.lg,
    },
    title: {
        textAlign: "center",
        marginBottom: uiUtils.spacing.md,
        color: COLORS.TEXT.DARK,
        width: "100%",
    },
    message: {
        textAlign: "center",
        lineHeight: uiUtils.typography.getLineHeight(16),
        marginBottom: uiUtils.spacing.lg,
        paddingHorizontal: uiUtils.spacing.sm,
    },
    buttonContainer: {
        flexDirection: "row",
        gap: uiUtils.spacing.md,
        width: "100%",
    },
    primaryButton: {
        flex: 1,
    },
    secondaryButton: {
        flex: 1,
    },
});

// Convenience components for common modal types
export const SuccessModal: React.FC<Omit<ModalProps, "type">> = props => (
    <Modal type="success" transparent={false} {...props} />
);

export const ErrorModal: React.FC<Omit<ModalProps, "type">> = props => (
    <Modal type="error" {...props} />
);

export const WarningModal: React.FC<Omit<ModalProps, "type">> = props => (
    <Modal type="warning" {...props} />
);

export const InfoModal: React.FC<Omit<ModalProps, "type">> = props => (
    <Modal type="info" {...props} />
);

export default Modal;
