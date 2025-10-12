import React, { useState } from "react";
import {
    View,
    StyleSheet,
    Image,
    Linking,
    Alert,
    TouchableOpacity,
} from "react-native";
import { Typography } from "../../../components/Typography";
import { COLORS, WEIGHTS } from "../../../constants";
import { Button } from "../../../components/Button";
import BottomSheet from "../../../components/BottomSheet";
import CustomIcon from "../../../components/CustomIcon";

interface ReferralBannerProps {
    onReferPress?: () => void;
}

export const ReferralBanner: React.FC<ReferralBannerProps> = ({
    onReferPress,
}) => {
    const REFERRAL_LINK = "https://yourapp.com/refer?code=ABC123";
    const REFERRAL_MESSAGE = `Check out this amazing app! Join using my referral link: ${REFERRAL_LINK}`;

    const [showShareSheet, setShowShareSheet] = useState(false);

    const handleReferPress = () => {
        setShowShareSheet(true);
        onReferPress?.();
    };

    const handleWhatsAppShare = async () => {
        try {
            // Try WhatsApp first
            let url = `whatsapp://send?text=${encodeURIComponent(
                REFERRAL_MESSAGE,
            )}`;
            let supported = await Linking.canOpenURL(url);

            if (!supported) {
                // Try alternative WhatsApp URL scheme
                url = `https://wa.me/?text=${encodeURIComponent(
                    REFERRAL_MESSAGE,
                )}`;
                supported = await Linking.canOpenURL(url);
            }

            if (supported) {
                await Linking.openURL(url);
                setShowShareSheet(false);
            } else {
                Alert.alert(
                    "Error",
                    "WhatsApp is not installed on your device",
                );
            }
        } catch (error) {
            console.error("WhatsApp sharing error:", error);
            Alert.alert(
                "Error",
                "Failed to open WhatsApp. Please make sure WhatsApp is installed.",
            );
        }
    };

    const handleSMSShare = async () => {
        const url = `sms:?body=${encodeURIComponent(REFERRAL_MESSAGE)}`;
        try {
            const supported = await Linking.canOpenURL(url);
            if (supported) {
                await Linking.openURL(url);
                setShowShareSheet(false);
            } else {
                Alert.alert("Error", "SMS is not available on your device");
            }
        } catch (error) {
            Alert.alert("Error", "Failed to open SMS");
        }
    };

    const handleEmailShare = async () => {
        const subject = "Join this amazing app!";
        const url = `mailto:?subject=${encodeURIComponent(
            subject,
        )}&body=${encodeURIComponent(REFERRAL_MESSAGE)}`;
        try {
            const supported = await Linking.canOpenURL(url);
            if (supported) {
                await Linking.openURL(url);
                setShowShareSheet(false);
            } else {
                Alert.alert("Error", "Email is not available on your device");
            }
        } catch (error) {
            Alert.alert("Error", "Failed to open Email");
        }
    };

    return (
        <>
            <TouchableOpacity
                style={styles.container}
                onPress={handleReferPress}
                activeOpacity={0.9}
            >
                {/* Background Pattern */}
                <View style={styles.backgroundPattern}>
                    <View style={styles.patternCircle1} />
                    <View style={styles.patternCircle2} />
                    <View style={styles.patternCircle3} />
                </View>

                <View style={styles.content}>
                    {/* Left Section - Icon and Text */}
                    <View style={styles.leftSection}>
                        <View style={styles.iconContainer}>
                            <View style={styles.iconBackground}>
                                <Image
                                    source={require("../../../../assets/refer.png")}
                                    style={styles.icon}
                                    resizeMode="contain"
                                />
                            </View>
                        </View>

                        <View style={styles.textContainer}>
                            <Typography
                                variant="h4"
                                style={styles.title}
                                color={COLORS.WHITE}
                            >
                                Refer a Friend
                            </Typography>
                            <Typography
                                variant="bodySmall"
                                style={styles.subtitle}
                                color={COLORS.WHITE}
                            >
                                Share the love and earn rewards together
                            </Typography>
                        </View>
                    </View>

                    {/* Right Section - Button */}
                    <View style={styles.rightSection}>
                        <View style={styles.buttonContainer}>
                            <CustomIcon
                                provider="Ionicons"
                                name="arrow-forward"
                                size={20}
                                color={COLORS.primary}
                            />
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
            {/* Share Bottom Sheet */}
            <BottomSheet
                visible={showShareSheet}
                onClose={() => setShowShareSheet(false)}
                height={360}
                enableBackdropDismiss={true}
            >
                <View style={styles.sheetContent}>
                    <Typography
                        variant="h4"
                        style={styles.sheetTitle}
                        color={COLORS.TEXT.DARK}
                    >
                        Share via
                    </Typography>

                    <View style={styles.shareOptions}>
                        {/* WhatsApp Option */}
                        <Button
                            title="WhatsApp"
                            variant="outline"
                            fullWidth
                            onPress={handleWhatsAppShare}
                            style={styles.shareButton}
                            icon={
                                <CustomIcon
                                    provider="FontAwesome"
                                    name="whatsapp"
                                    size={24}
                                    color={COLORS.GREEN[700]}
                                />
                            }
                            iconPosition="left"
                        />

                        {/* SMS Option */}
                        <Button
                            title="SMS"
                            variant="outline"
                            fullWidth
                            onPress={handleSMSShare}
                            style={styles.shareButton}
                            icon={
                                <CustomIcon
                                    provider="MaterialIcons"
                                    name="sms"
                                    size={24}
                                    color={COLORS.primary}
                                    style={{ marginLeft: 4 }}
                                />
                            }
                            iconPosition="left"
                        />

                        {/* Email Option */}
                        <Button
                            title="Email"
                            variant="outline"
                            fullWidth
                            onPress={handleEmailShare}
                            style={styles.shareButton}
                            icon={
                                <CustomIcon
                                    provider="Entypo"
                                    name="email"
                                    size={24}
                                    color={COLORS.RED[500]}
                                />
                            }
                            iconPosition="left"
                        />
                    </View>
                </View>
            </BottomSheet>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: COLORS.primary,
        borderRadius: 20,
        marginHorizontal: 16,
        marginVertical: 16,
        shadowColor: COLORS.primary,
        shadowOffset: {
            width: 0,
            height: 8,
        },
        shadowOpacity: 0.25,
        shadowRadius: 16,
        elevation: 8,
        overflow: "hidden",
    },
    backgroundPattern: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    patternCircle1: {
        position: "absolute",
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: COLORS.primaryLight,
        top: -30,
        right: -30,
    },
    patternCircle2: {
        position: "absolute",
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: COLORS.primaryGlow,
        bottom: -20,
        left: -20,
    },
    patternCircle3: {
        position: "absolute",
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: COLORS.primaryShadow,
        top: 20,
        left: 20,
    },
    content: {
        flexDirection: "row",
        alignItems: "center",
        padding: 20,
        minHeight: 100,
    },
    leftSection: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
    },
    iconContainer: {
        marginRight: 16,
    },
    iconBackground: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        alignItems: "center",
        justifyContent: "center",
        shadowColor: COLORS.primary,
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 4,
    },
    icon: {
        width: 36,
        height: 36,
    },
    textContainer: {
        flex: 1,
    },
    title: {
        fontWeight: WEIGHTS.BOLD,
        marginBottom: 4,
        textAlign: "left",
    },
    subtitle: {
        textAlign: "left",
        opacity: 0.9,
        lineHeight: 18,
    },
    rightSection: {
        alignItems: "center",
        justifyContent: "center",
    },
    buttonContainer: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: COLORS.WHITE,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: COLORS.primary,
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 6,
    },
    sheetContent: {
        paddingTop: 8,
    },
    sheetTitle: {
        fontWeight: WEIGHTS.SEMI_BOLD,
        marginBottom: 24,
        textAlign: "center",
    },
    shareOptions: {
        gap: 12,
    },
    shareButton: {
        justifyContent: "flex-start",
        paddingLeft: 60,
    },
    iconCircle: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: "center",
        justifyContent: "center",
    },
});
