import React, { useState } from "react";
import {
    View,
    TextInput,
    Text,
    StyleSheet,
    ViewStyle,
    TextStyle,
    TextInputProps,
    TouchableOpacity,
} from "react-native";
import { COLORS, WEIGHTS } from "../constants/ui";
import { fontFamily } from "../lib/fonts";
import { Typography } from "./Typography";
import CustomIcon from "./CustomIcon";

export type InputType =
    | "text"
    | "email"
    | "password"
    | "number"
    | "phone"
    | "url";
export type IconPosition = "left" | "right";

interface InputProps extends Omit<TextInputProps, "secureTextEntry"> {
    label?: string;
    placeholder?: string;
    type?: InputType;
    icon?: React.ReactNode;
    disabled?: boolean;
    iconPosition?: IconPosition;
    rightIcon?: React.ReactNode;
    error?: string;
    regex?: RegExp;
    required?: boolean;
    containerStyle?: ViewStyle;
    inputStyle?: TextStyle;
    labelStyle?: TextStyle;
    errorStyle?: TextStyle;
    showPasswordToggle?: boolean;
    onValidationChange?: (isValid: boolean) => void;
}

export const Input: React.FC<InputProps> = ({
    label,
    placeholder,
    type = "text",
    icon,
    iconPosition = "left",
    rightIcon,
    error,
    regex,
    required = false,
    containerStyle,
    inputStyle,
    labelStyle,
    disabled,
    errorStyle,
    showPasswordToggle = false,
    onValidationChange,
    value,
    onChangeText,
    ...props
}) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [internalError, setInternalError] = useState<string>("");

    const validateInput = (text: string) => {
        let validationError = "";

        // Required validation
        if (required && (!text || text.trim() === "")) {
            validationError = "This field is required";
        }

        // Regex validation
        if (regex && text && !regex.test(text)) {
            validationError = "Invalid format";
        }

        // Type-specific validation
        if (text && !validationError) {
            switch (type) {
                case "email":
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(text)) {
                        validationError = "Please enter a valid email address";
                    }
                    break;
                case "url":
                    const urlRegex =
                        /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
                    if (!urlRegex.test(text)) {
                        validationError = "Please enter a valid URL";
                    }
                    break;
                case "phone":
                    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
                    if (!phoneRegex.test(text.replace(/\s/g, ""))) {
                        validationError = "Please enter a valid phone number";
                    }
                    break;
                case "number":
                    if (isNaN(Number(text))) {
                        validationError = "Please enter a valid number";
                    }
                    break;
            }
        }

        setInternalError(validationError);
        onValidationChange?.(!validationError);
        return validationError;
    };

    const handleChangeText = (text: string) => {
        const validationError = validateInput(text);
        onChangeText?.(text);
    };

    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);
    };

    const getInputType = () => {
        switch (type) {
            case "email":
                return "email-address";
            case "number":
                return "numeric";
            case "phone":
                return "phone-pad";
            case "url":
                return "url";
            default:
                return "default";
        }
    };

    const getKeyboardType = () => {
        switch (type) {
            case "email":
                return "email-address";
            case "number":
                return "numeric";
            case "phone":
                return "phone-pad";
            case "url":
                return "url";
            default:
                return "default";
        }
    };

    const getAutoCapitalize = () => {
        switch (type) {
            case "email":
            case "password":
            case "url":
                return "none";
            default:
                return "sentences";
        }
    };

    const finalError = error || internalError;
    const hasError = !!finalError;

    return (
        <View style={[styles.container, containerStyle]}>
            {label && (
                <Text style={[styles.label, labelStyle]}>
                    {label}
                    {required && <Text style={styles.required}> *</Text>}
                </Text>
            )}

            <View
                style={[
                    styles.inputContainer,
                    isFocused && styles.inputContainerFocused,
                    hasError && styles.inputContainerError,
                ]}
            >
                {icon && iconPosition === "left" && (
                    <View style={styles.leftIcon}>{icon}</View>
                )}

                <TextInput
                    style={[
                        styles.input,
                        ...(icon && iconPosition === "left"
                            ? [styles.inputWithLeftIcon]
                            : []),
                        ...(rightIcon ||
                        (type === "password" && showPasswordToggle)
                            ? [styles.inputWithRightIcon]
                            : []),
                        ...(inputStyle ? [inputStyle] : []),
                    ]}
                    placeholder={placeholder}
                    placeholderTextColor={COLORS.GREY[100]}
                    value={value}
                    onChangeText={handleChangeText}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    secureTextEntry={type === "password" && !isPasswordVisible}
                    keyboardType={getKeyboardType()}
                    autoCapitalize={getAutoCapitalize()}
                    autoCorrect={
                        type === "email" || type === "password" ? false : true
                    }
                    {...props}
                />

                {type === "password" && showPasswordToggle && (
                    <TouchableOpacity
                        style={styles.rightIcon}
                        onPress={togglePasswordVisibility}
                    >
                        {isPasswordVisible ? (
                            <CustomIcon
                                provider="MaterialIcons"
                                name="visibility"
                                size={20}
                            />
                        ) : (
                            <CustomIcon
                                provider="MaterialIcons"
                                name="visibility-off"
                                size={20}
                            />
                        )}
                    </TouchableOpacity>
                )}

                {rightIcon && !(type === "password" && showPasswordToggle) && (
                    <View style={styles.rightIcon}>{rightIcon}</View>
                )}
            </View>

            {hasError && (
                <Typography variant="error" style={errorStyle}>
                    {finalError}
                </Typography>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: WEIGHTS.MEDIUM,
        color: COLORS.TEXT.DARK,
        marginBottom: 8,
    },
    required: {
        color: COLORS.RED[500],
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: COLORS.GREY[100],
        borderRadius: 10,
        paddingHorizontal: 16,
        minHeight: 48,
    },
    inputContainerFocused: {
        borderColor: COLORS.primary,
        backgroundColor: "transparent",
    },
    inputContainerError: {
        borderColor: COLORS.RED[500],
        backgroundColor: "transparent",
    },
    input: {
        flex: 1,
        fontSize: 16,
        fontFamily: fontFamily.regular,
        justifyContent: "center",
        alignItems: "center",
        color: COLORS.TEXT.DARK,
    },
    inputWithLeftIcon: {
        marginLeft: 8,
    },
    inputWithRightIcon: {
        marginRight: 8,
    },
    leftIcon: {
        marginRight: 8,
    },
    rightIcon: {
        marginLeft: 8,
    },
    passwordToggle: {
        fontSize: 18,
    },
});

// Convenience components for common input types
export const EmailInput: React.FC<Omit<InputProps, "type">> = props => (
    <Input type="email" {...props} />
);

export const PasswordInput: React.FC<Omit<InputProps, "type">> = props => (
    <Input type="password" showPasswordToggle {...props} />
);

export const NumberInput: React.FC<Omit<InputProps, "type">> = props => (
    <Input type="number" {...props} />
);

export const PhoneInput: React.FC<Omit<InputProps, "type">> = props => (
    <Input type="phone" {...props} />
);

export const UrlInput: React.FC<Omit<InputProps, "type">> = props => (
    <Input type="url" {...props} />
);
