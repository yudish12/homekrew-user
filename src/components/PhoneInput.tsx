import React from "react";
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    StyleProp,
    ViewStyle,
} from "react-native";
import { Typography } from "./Typography";
import { COLORS } from "../constants/ui";
import { fontFamily } from "../lib/fonts";

interface PhoneInputProps {
    label?: string;
    value: string;
    style?: StyleProp<ViewStyle>;
    onChangeText: (text: string) => void;
    required?: boolean;
    error?: string;
}

const PhoneInputComponent = ({
    label,
    value,
    onChangeText,
    required = true,
    style,
    error,
}: PhoneInputProps) => {
    return (
        <View style={style}>
            {label ? (
                <Typography style={{ marginBottom: 6 }} variant="bodySmall">
                    {label}
                    {required && <Text style={styles.required}> *</Text>}
                </Typography>
            ) : null}
            <View style={styles.phoneInputContainer}>
                <View
                    style={[
                        styles.countryCodeContainer,
                        error && styles.inputError,
                    ]}
                >
                    <Typography variant="bodySmall">+91</Typography>
                </View>
                <TextInput
                    style={[styles.phoneInput, error && styles.inputError]}
                    placeholder="Enter your phone number"
                    value={value}
                    keyboardType="phone-pad"
                    onChangeText={onChangeText}
                    maxLength={10}
                />
            </View>
            {error && <Typography variant="error">{error}</Typography>}
        </View>
    );
};

const styles = StyleSheet.create({
    phoneInputContainer: {
        flexDirection: "row",
        alignItems: "stretch",
        gap: 10,
        height: 50,
    },
    countryCodeContainer: {
        padding: 8,
        flex: 1,
        borderWidth: 1,
        borderRadius: 10,
        borderColor: COLORS.GREY[100],
        justifyContent: "center",
        alignItems: "center",
    },
    phoneInput: {
        marginBottom: 0,
        fontSize: 16,
        borderRadius: 10,
        borderWidth: 1,
        paddingLeft: 16,
        borderColor: COLORS.GREY[100],
        justifyContent: "center",
        alignItems: "center",
        fontFamily: fontFamily.regular,
        flex: 6,
    },
    required: {
        color: COLORS.RED[500],
    },
    inputError: {
        borderColor: COLORS.RED[500],
    },
});

export default PhoneInputComponent;
