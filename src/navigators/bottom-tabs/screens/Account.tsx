import React, { useState } from "react";
import {
    View,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Image,
    Linking,
} from "react-native";
import { COLORS, WEIGHTS } from "../../../constants/ui";
import { Typography } from "../../../components/Typography";
import { CustomIcon } from "../../../components/CustomIcon";
import { SafeAreaView } from "../../../components/SafeAreaView";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../../types";
import { useNavigation } from "@react-navigation/native";
import {
    getUser,
    getSupportEmail,
    getSupportPhone,
} from "../../../redux/selectors";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { logout } from "../../../redux/actions";
import { ReferralBanner } from "../../../modules/home/ui/ReferralBanner";
import BottomSheet from "../../../components/BottomSheet";
import { showErrorToast } from "../../../components/Toast";
import { UtilityServices } from "../../../services/utility-services";

const QuickAction = ({
    icon,
    label,
    onPress,
}: {
    icon: React.ReactNode;
    label: string;
    onPress?: () => void;
}) => {
    return (
        <TouchableOpacity
            activeOpacity={0.85}
            onPress={onPress}
            style={styles.quickCard}
        >
            <View style={styles.quickIcon}>{icon}</View>
            <Typography style={styles.quickLabel} color={COLORS.TEXT.DARK}>
                {label}
            </Typography>
        </TouchableOpacity>
    );
};

const ListItem = ({
    iconName,
    label,
    onPress,
}: {
    iconName: string;
    label: string;
    onPress?: () => void;
}) => {
    return (
        <TouchableOpacity
            activeOpacity={0.8}
            onPress={onPress}
            style={styles.listItem}
        >
            <View style={styles.listLeft}>
                <CustomIcon
                    provider="Ionicons"
                    name={iconName as any}
                    size={18}
                    color={COLORS.TEXT.DARK}
                />
                <Typography style={styles.listLabel} color={COLORS.TEXT.DARK}>
                    {label}
                </Typography>
            </View>
            <CustomIcon
                provider="Ionicons"
                name="chevron-forward"
                size={18}
                color={COLORS.GREY[200]}
            />
        </TouchableOpacity>
    );
};

const Account = () => {
    const navigation = useNavigation<any>();
    const [isHelpBottomSheetVisible, setIsHelpBottomSheetVisible] =
        useState(false);

    const user = useSelector(getUser);
    const supportEmail = useSelector(getSupportEmail);
    const supportPhone = useSelector(getSupportPhone);
    const dispatch = useDispatch<AppDispatch>();
    const displayName = user?.firstName || "Guest";
    const phone = user?.phoneNumber || "";

    const tabBarheight = useBottomTabBarHeight();

    const handleCall = () => {
        if (supportPhone) {
            Linking.openURL(`tel:${supportPhone}`);
            setIsHelpBottomSheetVisible(false);
        } else {
            showErrorToast("Error", "Phone number not available");
        }
    };

    const handleEmail = () => {
        if (supportEmail) {
            Linking.openURL(`mailto:${supportEmail}`);
            setIsHelpBottomSheetVisible(false);
        } else {
            showErrorToast("Error", "Email not available");
        }
    };

    const handleWhatsApp = () => {
        if (supportPhone) {
            // Extract phone number without special characters
            const phoneNumber = supportPhone.replace(/[^0-9]/g, "");
            Linking.openURL(`https://wa.me/${phoneNumber}`);
            setIsHelpBottomSheetVisible(false);
        } else {
            showErrorToast("Error", "WhatsApp contact not available");
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.WHITE }}>
            {/* Header */}
            <View style={styles.header}>
                <View style={{ flex: 1 }}>
                    <Typography
                        variant="h2"
                        style={styles.name}
                        color={COLORS.TEXT.DARK}
                    >
                        {displayName}
                    </Typography>
                    {!!phone && (
                        <Typography variant="body" color={COLORS.GREY[500]}>
                            {phone}
                        </Typography>
                    )}
                </View>
                <View style={styles.rightRow}>
                    <TouchableOpacity
                        style={styles.editBtn}
                        activeOpacity={0.8}
                        onPress={() =>
                            navigation.navigate("EditProfile", {
                                backEnabled: true,
                            })
                        }
                    >
                        <CustomIcon
                            provider="Ionicons"
                            name="create-outline"
                            size={18}
                            color={COLORS.TEXT.DARK}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.logoutBtn}
                        activeOpacity={0.8}
                        onPress={() => dispatch(logout())}
                    >
                        <CustomIcon
                            provider="Ionicons"
                            name="log-out-outline"
                            size={18}
                            color={COLORS.TEXT.DARK}
                        />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Quick actions - removed Native devices */}
            <View style={styles.quickGrid}>
                <QuickAction
                    label="My bookings"
                    icon={
                        <CustomIcon
                            provider="Ionicons"
                            name="receipt-outline"
                            size={22}
                            color={COLORS.TEXT.DARK}
                        />
                    }
                    onPress={() => {}}
                />
                <QuickAction
                    label="Help &\nsupport"
                    icon={
                        <CustomIcon
                            provider="Ionicons"
                            name="headset-outline"
                            size={22}
                            color={COLORS.TEXT.DARK}
                        />
                    }
                    onPress={() => setIsHelpBottomSheetVisible(true)}
                />
            </View>

            <View style={styles.divider} />
            <ScrollView contentContainerStyle={{ paddingBottom: tabBarheight }}>
                {/* List menu - removed Wallet and My rating */}
                <View style={styles.list}>
                    <ListItem
                        iconName="information-circle-outline"
                        label="My Bookings"
                        onPress={() =>
                            navigation.navigate("ServiceBookingHistory")
                        }
                    />
                    <ListItem
                        iconName="pricetags-outline"
                        label="My Orders"
                        onPress={() => navigation.navigate("OrderHistory")}
                    />
                    <ListItem
                        iconName="sparkles-outline"
                        label="View plans"
                        onPress={() => navigation.navigate("MembershipDetails")}
                    />
                    <ListItem
                        iconName="location-outline"
                        label="Manage addresses"
                        onPress={() => navigation.navigate("AllAddress")}
                    />
                    {/* <ListItem
                        iconName="card-outline"
                        label="Manage payment methods"
                        onPress={() => {}}
                    /> */}
                    <ListItem
                        iconName="settings-outline"
                        label="Settings"
                        onPress={() => {}}
                    />
                </View>

                <ReferralBanner />
            </ScrollView>

            {/* Help & Support Bottom Sheet */}
            <BottomSheet
                visible={isHelpBottomSheetVisible}
                onClose={() => setIsHelpBottomSheetVisible(false)}
                height={530}
            >
                <View style={styles.bottomSheetContent}>
                    <Typography
                        variant="h3"
                        color={COLORS.TEXT.DARK}
                        style={styles.bottomSheetTitle}
                    >
                        Contact Support
                    </Typography>
                    <Typography
                        variant="body"
                        color={COLORS.TEXT.LIGHT}
                        style={styles.bottomSheetSubtitle}
                    >
                        Choose how you'd like to reach us
                    </Typography>

                    <View style={styles.supportOptions}>
                        <TouchableOpacity
                            style={styles.supportOption}
                            onPress={handleCall}
                            activeOpacity={0.7}
                        >
                            <View style={styles.supportIconContainer}>
                                <CustomIcon
                                    provider="Ionicons"
                                    name="call"
                                    size={24}
                                    color={COLORS.primary}
                                />
                            </View>
                            <View style={styles.supportTextContainer}>
                                <Typography
                                    variant="h5"
                                    color={COLORS.TEXT.DARK}
                                    style={styles.supportOptionTitle}
                                >
                                    Call Us
                                </Typography>
                                <Typography
                                    variant="bodySmall"
                                    color={COLORS.TEXT.LIGHT}
                                >
                                    {supportPhone || "Not available"}
                                </Typography>
                            </View>
                            <CustomIcon
                                provider="Ionicons"
                                name="chevron-forward"
                                size={20}
                                color={COLORS.GREY[400]}
                            />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.supportOption}
                            onPress={handleEmail}
                            activeOpacity={0.7}
                        >
                            <View style={styles.supportIconContainer}>
                                <CustomIcon
                                    provider="Ionicons"
                                    name="mail"
                                    size={24}
                                    color={COLORS.primary}
                                />
                            </View>
                            <View style={styles.supportTextContainer}>
                                <Typography
                                    variant="h5"
                                    color={COLORS.TEXT.DARK}
                                    style={styles.supportOptionTitle}
                                >
                                    Email Us
                                </Typography>
                                <Typography
                                    variant="bodySmall"
                                    color={COLORS.TEXT.LIGHT}
                                >
                                    {supportEmail || "Not available"}
                                </Typography>
                            </View>
                            <CustomIcon
                                provider="Ionicons"
                                name="chevron-forward"
                                size={20}
                                color={COLORS.GREY[400]}
                            />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.supportOption}
                            onPress={handleWhatsApp}
                            activeOpacity={0.7}
                        >
                            <View style={styles.supportIconContainer}>
                                <CustomIcon
                                    provider="Ionicons"
                                    name="logo-whatsapp"
                                    size={24}
                                    color={COLORS.primary}
                                />
                            </View>
                            <View style={styles.supportTextContainer}>
                                <Typography
                                    variant="h5"
                                    color={COLORS.TEXT.DARK}
                                    style={styles.supportOptionTitle}
                                >
                                    WhatsApp
                                </Typography>
                                <Typography
                                    variant="bodySmall"
                                    color={COLORS.TEXT.LIGHT}
                                >
                                    Chat with us
                                </Typography>
                            </View>
                            <CustomIcon
                                provider="Ionicons"
                                name="chevron-forward"
                                size={20}
                                color={COLORS.GREY[400]}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            </BottomSheet>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    header: {
        paddingHorizontal: 16,
        paddingTop: 8,
        paddingBottom: 8,
        flexDirection: "row",
        alignItems: "center",
    },
    name: {
        fontWeight: WEIGHTS.BOLD,
    },
    editBtn: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: COLORS.GREY[100],
    },
    logoutBtn: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: COLORS.GREY[100],
    },
    rightRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    quickGrid: {
        paddingHorizontal: 16,
        paddingTop: 12,
        flexDirection: "row",
        gap: 12,
    },
    quickCard: {
        flex: 1,
        backgroundColor: COLORS.WHITE,
        borderRadius: 16,
        paddingVertical: 18,
        paddingHorizontal: 14,
        shadowColor: COLORS.TEXT.DARK,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.06,
        shadowRadius: 12,
        elevation: 2,
    },
    quickIcon: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: COLORS.GREY[100],
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 10,
    },
    quickLabel: {
        fontWeight: WEIGHTS.MEDIUM,
        lineHeight: 18,
    },
    divider: {
        height: 2,
        backgroundColor: COLORS.GREY[100],
        marginTop: 20,
        marginBottom: 8,
    },
    list: {
        paddingHorizontal: 16,
        paddingVertical: 4,
        gap: 8,
    },
    listItem: {
        backgroundColor: COLORS.WHITE,
        borderRadius: 12,
        paddingHorizontal: 14,
        paddingVertical: 14,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderWidth: 1,
        borderColor: COLORS.GREY[100],
    },
    listLeft: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    listLabel: {
        fontWeight: WEIGHTS.MEDIUM,
    },
    referCard: {
        marginTop: 16,
        marginHorizontal: 16,
        backgroundColor: "#F1ECFF",
        borderRadius: 16,
        padding: 16,
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    giftIcon: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: COLORS.WHITE,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: COLORS.TEXT.DARK,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 2,
    },
    bottomSheetContent: {
        paddingTop: 8,
    },
    bottomSheetTitle: {
        fontWeight: WEIGHTS.BOLD,
        marginBottom: 8,
    },
    bottomSheetSubtitle: {
        marginBottom: 24,
    },
    supportOptions: {
        gap: 12,
    },
    supportOption: {
        flexDirection: "row",
        alignItems: "center",
        padding: 16,
        backgroundColor: COLORS.WHITE,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: COLORS.GREY[100],
        shadowColor: COLORS.TEXT.DARK,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 4,
        elevation: 1,
    },
    supportIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: COLORS.primaryLight,
        alignItems: "center",
        justifyContent: "center",
        marginRight: 12,
    },
    supportTextContainer: {
        flex: 1,
    },
    supportOptionTitle: {
        fontWeight: WEIGHTS.SEMI_BOLD,
        marginBottom: 2,
    },
});

export default Account;
