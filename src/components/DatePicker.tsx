import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ViewStyle,
    TextStyle,
    TouchableOpacity,
    Modal,
    ScrollView,
    Pressable,
} from "react-native";
import { COLORS, WEIGHTS } from "../constants/ui";
import { fontFamily } from "../lib/fonts";
import { Typography } from "./Typography";
import { PrimaryButton } from "./Button";

export interface DatePickerProps {
    label?: string;
    placeholder?: string;
    value?: Date;
    onValueChange?: (date: Date) => void;
    error?: string;
    required?: boolean;
    disabled?: boolean;
    containerStyle?: ViewStyle;
    labelStyle?: TextStyle;
    errorStyle?: TextStyle;
    minDate?: Date;
    maxDate?: Date;
    onValidationChange?: (isValid: boolean) => void;
}

export const DatePicker: React.FC<DatePickerProps> = ({
    label,
    placeholder = "Select date",
    value,
    onValueChange,
    error,
    required = false,
    disabled = false,
    containerStyle,
    labelStyle,
    errorStyle,
    minDate,
    maxDate,
    onValidationChange,
}) => {
    const [isFocused, setIsFocused] = useState(false);
    const [internalError, setInternalError] = useState<string>("");
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [tempDate, setTempDate] = useState<Date>(value || new Date());

    const validateDate = (date: Date) => {
        let validationError = "";

        // Required validation
        if (required && !date) {
            validationError = "This field is required";
        }

        // Min date validation
        if (minDate && date < minDate) {
            validationError = `Date must be after ${formatDate(minDate)}`;
        }

        // Max date validation
        if (maxDate && date > maxDate) {
            validationError = `Date must be before ${formatDate(maxDate)}`;
        }

        setInternalError(validationError);
        onValidationChange?.(!validationError);
        return validationError;
    };

    const handleDateChange = (newDate: Date) => {
        setTempDate(newDate);
    };

    const handleConfirm = () => {
        const validationError = validateDate(tempDate);
        if (!validationError) {
            onValueChange?.(tempDate);
            setIsModalVisible(false);
        }
    };

    const handleCancel = () => {
        setTempDate(value || new Date());
        setIsModalVisible(false);
    };

    const formatDate = (date: Date) => {
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const generateYearOptions = () => {
        const currentYear = new Date().getFullYear();
        const years = [];
        const startYear = minDate ? minDate.getFullYear() : 1900;
        const endYear = maxDate ? maxDate.getFullYear() : currentYear;

        for (let year = endYear; year >= startYear; year--) {
            years.push(year);
        }
        return years;
    };

    const generateMonthOptions = () => {
        return [
            { value: 1, label: "January" },
            { value: 2, label: "February" },
            { value: 3, label: "March" },
            { value: 4, label: "April" },
            { value: 5, label: "May" },
            { value: 6, label: "June" },
            { value: 7, label: "July" },
            { value: 8, label: "August" },
            { value: 9, label: "September" },
            { value: 10, label: "October" },
            { value: 11, label: "November" },
            { value: 12, label: "December" },
        ];
    };

    const generateDayOptions = (year: number, month: number) => {
        const daysInMonth = new Date(year, month, 0).getDate();
        const days = [];
        for (let day = 1; day <= daysInMonth; day++) {
            days.push(day);
        }
        return days;
    };

    const finalError = error || internalError;
    const hasError = !!finalError;
    const hasValue = value !== undefined;

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
                    styles.pickerButton,
                    isFocused && styles.pickerContainerFocused,
                    hasError && styles.pickerContainerError,
                    disabled && styles.pickerContainerDisabled,
                ]}
                onPress={() => !disabled && setIsModalVisible(true)}
                onPressIn={() => !disabled && setIsFocused(true)}
                onPressOut={() => !disabled && setIsFocused(false)}
                disabled={disabled}
            >
                <Text
                    style={[
                        styles.pickerText,
                        !hasValue && styles.placeholderText,
                    ]}
                >
                    {hasValue ? formatDate(value) : placeholder}
                </Text>
            </TouchableOpacity>

            <Modal
                visible={isModalVisible}
                transparent
                animationType="fade"
                onRequestClose={handleCancel}
            >
                <Pressable style={styles.modalOverlay} onPress={handleCancel}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Typography variant="h2" style={styles.modalTitle}>
                                {label || "Select Date"}
                            </Typography>
                            <TouchableOpacity
                                onPress={handleCancel}
                                style={styles.closeButton}
                            >
                                <Typography style={styles.closeButtonText}>
                                    ✕
                                </Typography>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.pickerContainer}>
                            <View style={styles.pickerColumn}>
                                <Typography style={styles.pickerLabel}>
                                    Month
                                </Typography>
                                <ScrollView style={styles.pickerScroll}>
                                    {generateMonthOptions().map(month => (
                                        <TouchableOpacity
                                            key={month.value}
                                            style={[
                                                styles.pickerItem,
                                                tempDate.getMonth() + 1 ===
                                                    month.value &&
                                                    styles.pickerItemSelected,
                                            ]}
                                            onPress={() => {
                                                const newDate = new Date(
                                                    tempDate,
                                                );
                                                newDate.setMonth(
                                                    month.value - 1,
                                                );
                                                handleDateChange(newDate);
                                            }}
                                        >
                                            <Typography
                                                style={[
                                                    styles.pickerItemText,
                                                    tempDate.getMonth() + 1 ===
                                                        month.value &&
                                                        styles.pickerItemTextSelected,
                                                ]}
                                            >
                                                {month.label}
                                            </Typography>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                            </View>

                            <View style={styles.pickerColumn}>
                                <Typography style={styles.pickerLabel}>
                                    Day
                                </Typography>
                                <ScrollView style={styles.pickerScroll}>
                                    {generateDayOptions(
                                        tempDate.getFullYear(),
                                        tempDate.getMonth() + 1,
                                    ).map(day => (
                                        <TouchableOpacity
                                            key={day}
                                            style={[
                                                styles.pickerItem,
                                                tempDate.getDate() === day &&
                                                    styles.pickerItemSelected,
                                            ]}
                                            onPress={() => {
                                                const newDate = new Date(
                                                    tempDate,
                                                );
                                                newDate.setDate(day);
                                                handleDateChange(newDate);
                                            }}
                                        >
                                            <Typography
                                                style={[
                                                    styles.pickerItemText,
                                                    tempDate.getDate() ===
                                                        day &&
                                                        styles.pickerItemTextSelected,
                                                ]}
                                            >
                                                {day}
                                            </Typography>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                            </View>

                            <View style={styles.pickerColumn}>
                                <Typography style={styles.pickerLabel}>
                                    Year
                                </Typography>
                                <ScrollView style={styles.pickerScroll}>
                                    {generateYearOptions().map(year => (
                                        <TouchableOpacity
                                            key={year}
                                            style={[
                                                styles.pickerItem,
                                                tempDate.getFullYear() ===
                                                    year &&
                                                    styles.pickerItemSelected,
                                            ]}
                                            onPress={() => {
                                                const newDate = new Date(
                                                    tempDate,
                                                );
                                                newDate.setFullYear(year);
                                                handleDateChange(newDate);
                                            }}
                                        >
                                            <Typography
                                                style={[
                                                    styles.pickerItemText,
                                                    tempDate.getFullYear() ===
                                                        year &&
                                                        styles.pickerItemTextSelected,
                                                ]}
                                            >
                                                {year}
                                            </Typography>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                            </View>
                        </View>

                        <View style={styles.buttonContainer}>
                            <TouchableOpacity
                                style={styles.cancelButton}
                                onPress={handleCancel}
                            >
                                <Typography style={styles.cancelButtonText}>
                                    Cancel
                                </Typography>
                            </TouchableOpacity>
                            <PrimaryButton
                                title="Confirm"
                                onPress={handleConfirm}
                                style={styles.confirmButton}
                            />
                        </View>
                    </View>
                </Pressable>
            </Modal>

            {hasError && (
                <Typography
                    variant="error"
                    style={[styles.errorText, errorStyle]}
                >
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
    pickerButton: {
        borderWidth: 1,
        borderColor: COLORS.GREY[100],
        borderRadius: 10,
        paddingHorizontal: 16,
        minHeight: 48,
        justifyContent: "center",
    },
    pickerContainerFocused: {
        borderColor: COLORS.primary,
        backgroundColor: "transparent",
    },
    pickerContainerError: {
        borderColor: COLORS.RED[500],
        backgroundColor: "transparent",
    },
    pickerContainerDisabled: {
        backgroundColor: "#F9FAFB",
        opacity: 0.6,
    },
    pickerText: {
        fontSize: 16,
        fontFamily: fontFamily.regular,
        color: COLORS.TEXT.DARK,
    },
    placeholderText: {
        color: COLORS.GREY[100],
    },
    errorText: {
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
        width: "90%",
        maxHeight: "80%",
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
        color: COLORS.TEXT.DARK,
        fontSize: 18,
        fontFamily: fontFamily.medium,
    },
    closeButton: {
        padding: 4,
    },
    closeButtonText: {
        fontSize: 18,
        color: COLORS.GREY[400],
    },
    pickerContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 20,
    },
    pickerColumn: {
        flex: 1,
        marginHorizontal: 5,
    },
    pickerLabel: {
        textAlign: "center",
        marginBottom: 10,
        color: COLORS.TEXT.DARK,
        fontSize: 14,
        fontFamily: fontFamily.medium,
    },
    pickerScroll: {
        maxHeight: 200,
    },
    pickerItem: {
        paddingVertical: 10,
        paddingHorizontal: 8,
        borderRadius: 6,
        marginVertical: 2,
    },
    pickerItemSelected: {
        backgroundColor: COLORS.GREY[100],
    },
    pickerItemText: {
        textAlign: "center",
        color: COLORS.TEXT.DARK,
        fontSize: 16,
    },
    pickerItemTextSelected: {
        color: COLORS.GREEN[700],
        fontFamily: fontFamily.medium,
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: COLORS.GREY[100],
    },
    cancelButton: {
        flex: 1,
        marginRight: 8,
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: COLORS.GREY[200],
        alignItems: "center",
    },
    cancelButtonText: {
        color: COLORS.GREY[500],
        fontSize: 16,
        fontFamily: fontFamily.medium,
    },
    confirmButton: {
        flex: 1,
        marginLeft: 8,
    },
});

export default DatePicker;
