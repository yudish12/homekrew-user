import React from "react";
import {
    TouchableOpacity,
    Text,
    View,
    ViewStyle,
    TextStyle,
    TouchableOpacityProps,
} from "react-native";
import { COLORS, WEIGHTS } from "../constants/ui";

export type ButtonVariant = "primary" | "outline" | "link";
export type IconPosition = "left" | "right" | "extreme-left" | "extreme-right";

interface ButtonProps extends TouchableOpacityProps {
    title: string;
    variant?: ButtonVariant;
    icon?: React.ReactNode;
    iconPosition?: IconPosition;
    size?: "small" | "medium" | "large";
    disabled?: boolean;
    loading?: boolean;
    style?: ViewStyle[] | ViewStyle;
    textStyle?: TextStyle;
    fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
    title,
    variant = "primary",
    icon,
    iconPosition = "left",
    size = "medium",
    disabled = false,
    loading = false,
    style,
    textStyle,
    fullWidth = false,
    ...props
}) => {
    const getButtonStyle = (): ViewStyle | ViewStyle[] => {
        const baseStyle: ViewStyle = {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 14,
            paddingHorizontal: 24,
            paddingVertical: 12,
            minHeight: 48,
            position: "relative", // For absolute positioned icons
        };

        // Size styles
        if (size === "small") {
            baseStyle.paddingHorizontal = 16;
            baseStyle.paddingVertical = 8;
            baseStyle.minHeight = 36;
        } else if (size === "large") {
            baseStyle.paddingHorizontal = 32;
            baseStyle.paddingVertical = 16;
            baseStyle.minHeight = 56;
        }

        // Variant styles
        if (variant === "primary") {
            baseStyle.backgroundColor = COLORS.primary;
            baseStyle.borderWidth = 0;
        } else if (variant === "outline") {
            baseStyle.backgroundColor = "transparent";
            baseStyle.borderWidth = 1;
            baseStyle.borderColor = COLORS.TEXT.DARK;
        } else if (variant === "link") {
            baseStyle.backgroundColor = "transparent";
            baseStyle.borderWidth = 0;
            baseStyle.paddingHorizontal = 8;
            baseStyle.paddingVertical = 4;
        }

        // Additional styles
        if (fullWidth) {
            baseStyle.width = "100%";
        }

        if (disabled || loading) {
            baseStyle.opacity = 0.5;
        }
        if (Array.isArray(style)) {
            return [baseStyle, ...style];
        } else {
            return { ...baseStyle, ...style };
        }
    };

    const getTextStyle = (): TextStyle => {
        const baseTextStyle: TextStyle = {
            fontSize: 16,
            fontWeight: WEIGHTS.REGULAR,
            textAlign: "center",
        };

        // Size text styles
        if (size === "small") {
            baseTextStyle.fontSize = 14;
        } else if (size === "large") {
            baseTextStyle.fontSize = 18;
        }

        // Variant text styles
        if (variant === "primary") {
            baseTextStyle.color = "white";
        } else if (variant === "outline") {
            baseTextStyle.color = COLORS.TEXT.DARK;
        } else if (variant === "link") {
            baseTextStyle.color = COLORS.primary;
            baseTextStyle.textDecorationLine = "underline";
        }

        if (disabled) {
            baseTextStyle.opacity = 0.6;
        }

        return { ...baseTextStyle, ...textStyle };
    };

    const getIconStyle = (): ViewStyle => {
        const baseIconStyle: ViewStyle = {
            position: "absolute",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1,
        };

        if (iconPosition === "left") {
            baseIconStyle.left = 16;
        } else if (iconPosition === "right") {
            baseIconStyle.right = 16;
        } else if (iconPosition === "extreme-left") {
            baseIconStyle.left = 8;
        } else if (iconPosition === "extreme-right") {
            baseIconStyle.right = 8;
        }

        return baseIconStyle;
    };

    const renderIcon = () => {
        if (!icon) return null;
        return <View style={getIconStyle()}>{icon}</View>;
    };

    const renderContent = () => {
        if (loading) {
            return (
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <Text style={getTextStyle()}>Loading...</Text>
                </View>
            );
        }

        return (
            <>
                {renderIcon()}
                <Text style={getTextStyle()}>{title}</Text>
            </>
        );
    };

    return (
        <TouchableOpacity
            style={getButtonStyle()}
            disabled={disabled || loading}
            activeOpacity={0.8}
            {...props}
        >
            {renderContent()}
        </TouchableOpacity>
    );
};

// Convenience components for common use cases
export const PrimaryButton: React.FC<Omit<ButtonProps, "variant">> = props => (
    <Button variant="primary" {...props} />
);

export const OutlineButton: React.FC<Omit<ButtonProps, "variant">> = props => (
    <Button variant="outline" {...props} />
);

export const LinkButton: React.FC<Omit<ButtonProps, "variant">> = props => (
    <Button variant="link" {...props} />
);

// Size convenience components
export const SmallButton: React.FC<Omit<ButtonProps, "size">> = props => (
    <Button size="small" {...props} />
);

export const LargeButton: React.FC<Omit<ButtonProps, "size">> = props => (
    <Button size="large" {...props} />
);
