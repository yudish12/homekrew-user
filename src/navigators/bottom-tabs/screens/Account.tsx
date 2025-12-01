import React from "react";
import {
    View,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Image,
} from "react-native";
import { COLORS, WEIGHTS } from "../../../constants/ui";
import { Typography } from "../../../components/Typography";
import { CustomIcon } from "../../../components/CustomIcon";
import { SafeAreaView } from "../../../components/SafeAreaView";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../types";
import { useNavigation } from "@react-navigation/native";
import { getUser } from "../../../redux/selectors";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { logout } from "../../../redux/actions";
import { ReferralBanner } from "../../../modules/home/ui/ReferralBanner";

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

    const user = useSelector(getUser);
    const dispatch = useDispatch<AppDispatch>();
    const displayName = user?.firstName || "Guest";
    const phone = user?.phoneNumber || "";

    const tabBarheight = useBottomTabBarHeight();

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
                    onPress={() => {}}
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
            {/* Refer card */}
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
});

export default Account;
