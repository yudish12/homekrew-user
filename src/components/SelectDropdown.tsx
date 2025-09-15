import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ViewStyle,
    TextStyle,
    TouchableOpacity,
    Modal,
    FlatList,
    Pressable,
} from "react-native";
import { COLORS, WEIGHTS } from "../constants/ui";
import { fontFamily } from "../lib/fonts";

export type IconPosition = "left" | "right";

interface SelectOption {
    label: string;
    value: string | number;
}

interface SelectDropdownProps {
    label?: string;
    placeholder?: string;
    options: SelectOption[];
    value?: string | number;
    onValueChange?: (value: string | number) => void;
    icon?: React.ReactNode;
    iconPosition?: IconPosition;
    rightIcon?: React.ReactNode;
    error?: string;
    required?: boolean;
    disabled?: boolean;
    containerStyle?: ViewStyle;
    dropdownStyle?: ViewStyle;
    labelStyle?: TextStyle;
    errorStyle?: TextStyle;
    placeholderStyle?: TextStyle;
    onValidationChange?: (isValid: boolean) => void;
}

export const SelectDropdown: React.FC<SelectDropdownProps> = ({
    label,
    placeholder = "Select an option",
    options,
    value,
    onValueChange,
    icon,
    iconPosition = "left",
    rightIcon,
    error,
    required = false,
    disabled = false,
    containerStyle,
    dropdownStyle,
    labelStyle,
    errorStyle,
    placeholderStyle,
    onValidationChange,
}) => {
    const [isFocused, setIsFocused] = useState(false);
    const [internalError, setInternalError] = useState<string>("");
    const [isModalVisible, setIsModalVisible] = useState(false);

    const validateSelection = (selectedValue?: string | number) => {
        let validationError = "";

        // Required validation
        if (required && (!selectedValue || selectedValue === "")) {
            validationError = "This field is required";
        }

        setInternalError(validationError);
        onValidationChange?.(!validationError);
        return validationError;
    };

    const handleValueChange = (selectedValue: string | number) => {
        const validationError = validateSelection(selectedValue);
        onValueChange?.(selectedValue);
        setIsModalVisible(false);
    };

    const finalError = error || internalError;
    const hasError = !!finalError;
    const hasValue = value !== undefined && value !== "";

    const selectedOption = options.find(option => option.value === value);
    const displayText = selectedOption ? selectedOption.label : placeholder;

    return (
        <View style={[styles.container, containerStyle]}>
            {label && (
                <Text style={[styles.label, labelStyle]}>
                    {label}
                    {required && <Text style={styles.required}> *</Text>}
                </Text>
            )}

            <TouchableOpacity
                style={[
                    styles.dropdownContainer,
                    isFocused && styles.dropdownContainerFocused,
                    hasError && styles.dropdownContainerError,
                    disabled && styles.dropdownContainerDisabled,
                    dropdownStyle,
                ]}
                onPress={() => !disabled && setIsModalVisible(true)}
                onPressIn={() => !disabled && setIsFocused(true)}
                onPressOut={() => !disabled && setIsFocused(false)}
                disabled={disabled}
            >
                {icon && iconPosition === "left" && (
                    <View style={styles.leftIcon}>{icon}</View>
                )}

                <Text
                    style={[
                        styles.dropdownText,
                        !hasValue && styles.placeholderText,
                        placeholderStyle,
                    ]}
                >
                    {displayText}
                </Text>

                {rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
            </TouchableOpacity>

            <Modal
                visible={isModalVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setIsModalVisible(false)}
            >
                <Pressable
                    style={styles.modalOverlay}
                    onPress={() => setIsModalVisible(false)}
                >
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>
                                {label || "Select Option"}
                            </Text>
                            <TouchableOpacity
                                onPress={() => setIsModalVisible(false)}
                                style={styles.closeButton}
                            >
                                <Text style={styles.closeButtonText}>✕</Text>
                            </TouchableOpacity>
                        </View>
                        <FlatList
                            data={options}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={[
                                        styles.optionItem,
                                        value === item.value &&
                                            styles.selectedOptionItem,
                                    ]}
                                    onPress={() =>
                                        handleValueChange(item.value)
                                    }
                                >
                                    <Text
                                        style={[
                                            styles.optionText,
                                            value === item.value &&
                                                styles.selectedOptionText,
                                        ]}
                                    >
                                        {item.label}
                                    </Text>
                                </TouchableOpacity>
                            )}
                            style={styles.optionsList}
                        />
                    </View>
                </Pressable>
            </Modal>

            {hasError && (
                <Text style={[styles.errorText, errorStyle]}>{finalError}</Text>
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
    dropdownContainer: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: COLORS.GREY[100],
        borderRadius: 10,
        paddingHorizontal: 16,
        minHeight: 48,
    },
    dropdownContainerFocused: {
        borderColor: COLORS.primary,
        backgroundColor: "transparent",
    },
    dropdownContainerError: {
        borderColor: COLORS.RED[500],
        backgroundColor: "transparent",
    },
    dropdownContainerDisabled: {
        backgroundColor: "#F9FAFB",
        opacity: 0.6,
    },
    dropdownText: {
        flex: 1,
        fontSize: 16,
        fontFamily: fontFamily.regular,
        color: COLORS.TEXT.DARK,
    },
    placeholderText: {
        color: COLORS.GREY[100],
    },
    leftIcon: {
        marginRight: 8,
    },
    rightIcon: {
        marginLeft: 8,
    },
    errorText: {
        fontSize: 12,
        color: COLORS.RED[500],
        marginTop: 4,
        marginLeft: 4,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalContent: {
        backgroundColor: "white",
        borderRadius: 12,
        width: "80%",
        maxHeight: "70%",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.GREY[100],
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: WEIGHTS.MEDIUM,
        color: COLORS.TEXT.DARK,
    },
    closeButton: {
        padding: 4,
    },
    closeButtonText: {
        fontSize: 18,
        color: COLORS.GREY[400],
    },
    optionsList: {
        maxHeight: 300,
    },
    optionItem: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.GREY[100],
    },
    selectedOptionItem: {
        backgroundColor: COLORS.primary + "10",
    },
    optionText: {
        fontSize: 16,
        fontFamily: fontFamily.regular,
        color: COLORS.TEXT.DARK,
    },
    selectedOptionText: {
        color: COLORS.primary,
        fontWeight: WEIGHTS.MEDIUM,
    },
});

export default SelectDropdown;
