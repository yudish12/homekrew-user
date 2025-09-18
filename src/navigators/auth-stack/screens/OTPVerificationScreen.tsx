import React, { useRef, useState } from "react";
import {
    View,
    StyleSheet,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    TouchableOpacity,
    TextInput,
    Dimensions,
} from "react-native";
import { COLORS } from "../../../constants/ui";
import { Typography } from "../../../components/Typography";
import { Button } from "../../../components/Button";
import { CustomIcon } from "../../../components/CustomIcon";
import Header from "../../../components/header";
import Modal from "../../../components/Modal";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../types";
import { setUser } from "../../../redux/actions";
import { AuthServices } from "../../../services/auth-services";
import { showErrorToast } from "../../../components/Toast";
import { setAuthToken } from "../../../lib";

interface OTPVerificationScreenProps {
    navigation: any;
    route: any;
}

const OTPVerificationScreen: React.FC<OTPVerificationScreenProps> = ({
    navigation,
    route,
}) => {
    const { phoneNumber } = route.params;
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showResendModal, setShowResendModal] = useState(false);

    const inputRefs = useRef<TextInput[]>([]);

    const dispatch = useDispatch<AppDispatch>();

    const handleVerifyOTP = async () => {
        setError("");
        const otpString = otp.join("");
        if (!otpString) {
            setError("Please enter the OTP");
            return;
        }

        if (otpString.length !== 6) {
            setError("Please enter a valid 6-digit OTP");
            return;
        }

        setIsLoading(true);

        const response = await AuthServices.verifyOtp(phoneNumber, otpString);
        if (!response.success || !response.data) {
            showErrorToast(
                "OTP Verification Failed",
                "Something went wrong. Please try again.",
                {
                    onDismiss: () => {
                        console.log("Error toast dismissed");
                    },
                },
            );
            setIsLoading(false);
            return;
        }

        setIsLoading(false);
        setShowSuccessModal(true);
        setAuthToken(response.data.accessToken ?? "");
        console.log(response);
        dispatch(setUser(response.data));
    };

    const handleResendOTP = () => {
        setShowResendModal(true);
    };

    const handleSuccessModalClose = () => {
        setShowSuccessModal(false);
    };

    const handleResendModalClose = () => {
        setShowResendModal(false);
    };

    const handleResendConfirm = () => {
        setShowResendModal(false);
        // Implement actual resend logic here
        console.log("Resending OTP...");
    };

    const handleOtpChange = (text: string, index: number) => {
        const newOtp = [...otp];

        // Handle single digit input
        if (text.length === 1) {
            newOtp[index] = text;
            setOtp(newOtp);

            // Move to next input if not the last one
            if (index < 5) {
                inputRefs.current[index + 1]?.focus();
            }
        }
        // Handle backspace
        else if (text.length === 0) {
            newOtp[index] = "";
            setOtp(newOtp);

            // Move to previous input if not the first one
            if (index > 0) {
                inputRefs.current[index - 1]?.focus();
            }
        }
        // Handle paste or multiple digits
        else if (text.length > 1) {
            const digits = text.split("").slice(0, 6);
            const newOtpArray = [...otp];

            // Fill the current and next inputs
            for (let i = 0; i < digits.length && index + i < 6; i++) {
                newOtpArray[index + i] = digits[i];
            }

            setOtp(newOtpArray);

            // Focus on the next empty input or the last input
            const nextIndex = Math.min(index + digits.length, 5);
            inputRefs.current[nextIndex]?.focus();
        }
    };

    // Handle key press for backspace
    const handleKeyPress = (e: any, index: number) => {
        if (
            e.nativeEvent.key === "Backspace" &&
            otp[index] === "" &&
            index > 0
        ) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    // Handle input focus
    const handleFocus = (index: number) => {
        // If user clicks on an empty field, allow it
        // If user clicks on a filled field, select all text
        if (otp[index] !== "") {
            inputRefs.current[index]?.setSelection(0, 1);
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <Header
                title="Verify OTP"
                backButton={true}
                backHandler={() => navigation.goBack()}
                style={styles.header}
            />

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                <View style={styles.content}>
                    {/* Hero Section */}
                    <View style={styles.heroSection}>
                        <View style={styles.iconContainer}>
                            <CustomIcon
                                provider="Ionicons"
                                name="shield-checkmark"
                                size={48}
                                color={COLORS.primary}
                            />
                        </View>
                        <Typography
                            variant="h3"
                            style={styles.heroTitle}
                            color={COLORS.TEXT.DARK}
                        >
                            Enter verification code
                        </Typography>
                        <Typography
                            variant="body"
                            style={styles.heroSubtitle}
                            color={COLORS.GREY[500]}
                        >
                            We've sent a 6-digit code to{"\n"}
                            <Typography variant="body" color={COLORS.primary}>
                                {phoneNumber}
                            </Typography>
                        </Typography>
                    </View>

                    {/* OTP Input Section */}
                    <View style={styles.inputSection}>
                        <View style={styles.otpContainer}>
                            {[0, 1, 2, 3, 4, 5].map(index => (
                                <TextInput
                                    key={index}
                                    ref={ref => {
                                        if (ref) inputRefs.current[index] = ref;
                                    }}
                                    style={styles.otpField}
                                    value={otp[index]}
                                    onChangeText={text =>
                                        handleOtpChange(text, index)
                                    }
                                    onKeyPress={e => handleKeyPress(e, index)}
                                    onFocus={() => handleFocus(index)}
                                    keyboardType="numeric"
                                    maxLength={6}
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    selectTextOnFocus={true}
                                    textAlign="center"
                                    placeholder=""
                                />
                            ))}
                        </View>
                        {error && (
                            <Typography
                                variant="error"
                                style={styles.errorText}
                            >
                                {error}
                            </Typography>
                        )}
                    </View>

                    {/* Verify Button */}
                    <View style={styles.buttonSection}>
                        <Button
                            title="Verify OTP"
                            variant="primary"
                            size="large"
                            fullWidth
                            loading={isLoading}
                            onPress={handleVerifyOTP}
                            icon={
                                <CustomIcon
                                    provider="Ionicons"
                                    name="checkmark"
                                    size={20}
                                    color="white"
                                />
                            }
                            iconPosition="right"
                        />
                    </View>

                    {/* Resend OTP */}
                    <View style={styles.resendSection}>
                        <Typography
                            variant="body"
                            style={styles.resendText}
                            color={COLORS.GREY[500]}
                        >
                            Didn't receive the code?{" "}
                        </Typography>
                        <TouchableOpacity onPress={handleResendOTP}>
                            <Typography
                                variant="body"
                                style={styles.resendLink}
                                color={COLORS.primary}
                            >
                                Resend OTP
                            </Typography>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>

            {/* Success Modal */}
            <Modal
                visible={showSuccessModal}
                onClose={handleSuccessModalClose}
                type="success"
                title="OTP Verified!"
                message="Your phone number has been successfully verified. You can now proceed to use the app."
                primaryButton={{
                    title: "Continue",
                    onPress: handleSuccessModalClose,
                }}
            />

            {/* Resend OTP Modal */}
            <Modal
                visible={showResendModal}
                onClose={handleResendModalClose}
                type="info"
                title="Resend OTP"
                message="A new verification code will be sent to your phone number. This may take a few moments."
                primaryButton={{
                    title: "Resend",
                    onPress: handleResendConfirm,
                }}
                secondaryButton={{
                    title: "Cancel",
                    onPress: handleResendModalClose,
                }}
            />
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.WHITE,
    },
    header: {
        backgroundColor: COLORS.WHITE,
    },
    scrollContent: {
        flexGrow: 1,
    },
    content: {
        flex: 1,
        paddingTop: 32,
        paddingBottom: 40,
    },
    heroSection: {
        alignItems: "center",
        marginBottom: 40,
    },
    iconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: COLORS.primaryLight,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 24,
    },
    heroTitle: {
        textAlign: "center",
        marginBottom: 12,
        color: COLORS.TEXT.DARK,
    },
    heroSubtitle: {
        textAlign: "center",
        lineHeight: 24,
        paddingHorizontal: 16,
    },
    inputSection: {
        paddingHorizontal: 24,
        marginBottom: 32,
    },
    otpContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 16,
    },
    otpField: {
        width: Dimensions.get("window").width / 6 - 15,
        height: 55,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: COLORS.GREY[100],
        backgroundColor: "white",
        shadowColor: "#000000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 6,
    },
    otpBox: {
        width: 48,
        height: 56,
        borderWidth: 2,
        borderColor: COLORS.GREY[100],
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: COLORS.WHITE,
    },
    otpBoxFilled: {
        borderColor: COLORS.primary,
        backgroundColor: COLORS.primaryLight,
    },
    otpBoxError: {
        borderColor: COLORS.RED[500],
    },
    errorText: {
        textAlign: "center",
        marginTop: 8,
    },
    buttonSection: {
        paddingHorizontal: 24,
        marginBottom: 32,
    },
    resendSection: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },
    resendText: {
        color: COLORS.GREY[500],
    },
    resendLink: {
        fontWeight: "600",
    },
});

export default OTPVerificationScreen;
