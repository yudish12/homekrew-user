import { useState } from "react";
import {
    View,
    StyleSheet,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    TouchableOpacity,
} from "react-native";
import { COLORS } from "../../../constants/ui";
import { Typography } from "../../../components/Typography";
import PhoneInputComponent from "../../../components/PhoneInput";
import { Button } from "../../../components/Button";
import { CustomIcon } from "../../../components/CustomIcon";
import Header from "../../../components/header";
import { ERROR_CODES, validatePhoneNumber } from "../../../lib";
import { AuthServices } from "../../../services/auth-services";
import { useToast } from "../../../hooks/useToast";

const LoginScreen = ({ navigation }: any) => {
    const [phoneNumber, setPhoneNumber] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const { success, error: showErrorToast } = useToast();

    const handleLogin = async () => {
        setError("");

        if (!phoneNumber.trim()) {
            setError("Phone number is required");
            return;
        }

        if (!validatePhoneNumber(phoneNumber)) {
            setError("Please enter a valid 10-digit phone number");
            return;
        }

        setIsLoading(true);

        try {
            const response = await AuthServices.login(phoneNumber);
            if (!response.success) {
                showErrorToast(
                    "Login Failed",
                    "Something went wrong. Please try again.",
                    {
                        onDismiss: () => {
                            console.log("Error toast dismissed");
                        },
                    },
                );
                return;
            }

            // Show success toast
            success(
                "OTP Sent!",
                "Verification code has been sent to your phone number",
                {
                    onDismiss: () => {
                        console.log("Success toast dismissed");
                    },
                },
            );

            // Navigate to OTP verification
            navigation.navigate("OTPVerification", {
                phoneNumber: `+91${phoneNumber}`,
            });
        } catch (err) {
            showErrorToast(
                "Network Error",
                "Please check your internet connection and try again",
            );
        } finally {
            setIsLoading(false);
        }
    };

    const handleSignupNavigation = () => {
        navigation.navigate("Signup");
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <Header title="Welcome Back" style={styles.header} />

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
                                name="phone-portrait"
                                size={42}
                                color={COLORS.primary}
                            />
                        </View>
                        <Typography
                            variant="h3"
                            style={styles.heroTitle}
                            color={COLORS.TEXT.DARK}
                        >
                            Enter your phone number
                        </Typography>
                        <Typography
                            variant="body"
                            style={styles.heroSubtitle}
                            color={COLORS.GREY[500]}
                        >
                            We'll send you a verification code to confirm your
                            identity
                        </Typography>
                    </View>

                    {/* Phone Input Section */}
                    <View style={styles.inputSection}>
                        <PhoneInputComponent
                            label="Phone Number"
                            value={phoneNumber}
                            onChangeText={setPhoneNumber}
                            error={error}
                            required
                        />
                    </View>

                    {/* Login Button */}
                    <View style={styles.buttonSection}>
                        <Button
                            title="Send OTP"
                            variant="primary"
                            size="large"
                            fullWidth
                            loading={isLoading}
                            onPress={handleLogin}
                            icon={
                                <CustomIcon
                                    provider="Ionicons"
                                    name="arrow-forward"
                                    size={20}
                                    color="white"
                                />
                            }
                            iconPosition="right"
                        />
                    </View>

                    {/* Terms and Privacy */}
                    <View style={styles.termsSection}>
                        <Typography
                            variant="caption"
                            style={styles.termsText}
                            color={COLORS.GREY[400]}
                        >
                            By continuing, you agree to our{" "}
                        </Typography>
                        <TouchableOpacity>
                            <Typography
                                variant="caption"
                                style={styles.termsLink}
                                color={COLORS.primary}
                            >
                                Terms of Service
                            </Typography>
                        </TouchableOpacity>
                        <Typography
                            variant="caption"
                            style={styles.termsText}
                            color={COLORS.GREY[400]}
                        >
                            {" "}
                            and{" "}
                        </Typography>
                        <TouchableOpacity>
                            <Typography
                                variant="caption"
                                style={styles.termsLink}
                                color={COLORS.primary}
                            >
                                Privacy Policy
                            </Typography>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
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
        paddingHorizontal: 0,
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
        width: 70,
        height: 70,
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
        marginBottom: 32,
        paddingHorizontal: 24,
    },
    buttonSection: {
        paddingHorizontal: 24,
        marginBottom: 32,
    },
    dividerContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 32,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: COLORS.GREY[100],
    },
    dividerText: {
        marginHorizontal: 16,
        textTransform: "uppercase",
        letterSpacing: 1,
    },
    signupSection: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 40,
    },
    signupText: {
        color: COLORS.GREY[500],
    },
    signupLink: {
        fontWeight: "600",
    },
    termsSection: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 20,
    },
    termsText: {
        color: COLORS.GREY[400],
        textAlign: "center",
    },
    termsLink: {
        color: COLORS.primary,
        textDecorationLine: "underline",
    },
});

export default LoginScreen;
