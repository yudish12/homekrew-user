import React, { useCallback, useEffect, useState } from "react";
import {
    View,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Dimensions,
    Animated,
} from "react-native";
import { COLORS } from "../../../constants/ui";
import { LinearGradient } from "expo-linear-gradient";
import { Typography } from "../../../components/Typography";
import { CustomIcon } from "../../../components/CustomIcon";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";
import { UserMembership } from "../../../types/user";
import { fontFamily } from "../../../lib";

const { width } = Dimensions.get("window");

interface RouteParams {
    membership: UserMembership;
}

const MembershipStatus = () => {
    const [progressAnim] = useState(new Animated.Value(0));
    const [fadeAnim] = useState(new Animated.Value(0));

    const insets = useSafeAreaInsets();
    const navigation = useNavigation();
    const route = useRoute();
    const { membership } = route.params as RouteParams;
    // Calculate membership progress and days
    const getMembershipDetails = useCallback(() => {
        const startDate = new Date(membership.startDate);
        const endDate = new Date(membership.endDate);
        const today = new Date();

        const totalDuration = endDate.getTime() - startDate.getTime();
        const elapsed = today.getTime() - startDate.getTime();
        const remaining = endDate.getTime() - today.getTime();

        const progress = Math.max(0, Math.min(1, elapsed / totalDuration));
        const daysRemaining = Math.ceil(remaining / (1000 * 3600 * 24));
        const totalDays = Math.ceil(totalDuration / (1000 * 3600 * 24));
        const daysUsed = totalDays - Math.max(0, daysRemaining);

        return {
            progress,
            daysRemaining: Math.max(0, daysRemaining),
            totalDays,
            daysUsed,
            startDate,
            endDate,
        };
    }, [membership]);

    const membershipDetails = getMembershipDetails();
    useEffect(() => {
        // Fade in animation
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
        }).start();

        // Progress bar animation
        Animated.timing(progressAnim, {
            toValue: membershipDetails.progress,
            duration: 1500,
            useNativeDriver: false,
        }).start();
    }, []);

    const formatDate = (date: Date) => {
        return date.toLocaleDateString("en-US", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    };

    const getStatusColor = () => {
        if (membershipDetails.daysRemaining === 0) return "#FF4444";
        if (membershipDetails.daysRemaining <= 7) return "#FF8800";
        return "#00CC66";
    };

    const getStatusText = () => {
        if (membershipDetails.daysRemaining === 0) return "Expires Today";
        if (membershipDetails.daysRemaining === 1) return "1 Day Left";
        return `${membershipDetails.daysRemaining} Days Left`;
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={styles.backButton}
                >
                    <CustomIcon
                        provider="Ionicons"
                        name="arrow-back"
                        size={24}
                        color={COLORS.TEXT.DARK}
                    />
                </TouchableOpacity>
                <Typography variant="h3" style={styles.headerTitle}>
                    My Membership
                </Typography>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView
                style={styles.scrollContainer}
                showsVerticalScrollIndicator={false}
            >
                <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
                    {/* Membership Card */}
                    <View style={styles.membershipCard}>
                        <LinearGradient
                            colors={[COLORS.primary, COLORS.primaryGlow]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.cardGradient}
                        >
                            <View style={styles.cardHeader}>
                                <View style={styles.planTitleContainer}>
                                    <CustomIcon
                                        provider="MaterialCommunityIcons"
                                        name="diamond"
                                        size={24}
                                        color="#FFD700"
                                    />
                                    <Typography
                                        variant="h3"
                                        style={styles.planTitle}
                                    >
                                        {membership.plan.name}
                                    </Typography>
                                </View>
                                <View
                                    style={[
                                        styles.statusBadge,
                                        { backgroundColor: getStatusColor() },
                                    ]}
                                >
                                    <Typography
                                        variant="caption"
                                        style={styles.statusText}
                                    >
                                        ACTIVE
                                    </Typography>
                                </View>
                            </View>

                            <View style={styles.cardContent}>
                                <Typography
                                    variant="h1"
                                    style={styles.daysRemaining}
                                >
                                    {membershipDetails.daysRemaining}
                                </Typography>
                                <Typography
                                    variant="body"
                                    style={styles.daysLabel}
                                >
                                    Days Remaining
                                </Typography>
                            </View>

                            <View style={styles.progressContainer}>
                                <View style={styles.progressTrack}>
                                    <Animated.View
                                        style={[
                                            styles.progressBar,
                                            {
                                                width: progressAnim.interpolate(
                                                    {
                                                        inputRange: [0, 1],
                                                        outputRange: [
                                                            "0%",
                                                            "100%",
                                                        ],
                                                    },
                                                ),
                                            },
                                        ]}
                                    />
                                </View>
                                <View style={styles.progressLabels}>
                                    <Typography
                                        variant="caption"
                                        style={styles.progressLabel}
                                    >
                                        {formatDate(
                                            membershipDetails.startDate,
                                        )}
                                    </Typography>
                                    <Typography
                                        variant="caption"
                                        style={styles.progressLabel}
                                    >
                                        {formatDate(membershipDetails.endDate)}
                                    </Typography>
                                </View>
                            </View>
                        </LinearGradient>
                    </View>

                    {/* Stats Cards */}
                    <View style={styles.statsContainer}>
                        <View style={styles.statCard}>
                            <CustomIcon
                                provider="Ionicons"
                                name="calendar"
                                size={20}
                                color="#4A90E2"
                            />
                            <Typography variant="h4" style={styles.statValue}>
                                {membershipDetails.daysUsed}
                            </Typography>
                            <Typography
                                variant="caption"
                                style={styles.statLabel}
                            >
                                Days Used
                            </Typography>
                        </View>

                        <View style={styles.statCard}>
                            <CustomIcon
                                provider="Ionicons"
                                name="time"
                                size={20}
                                color="#50C878"
                            />
                            <Typography variant="h4" style={styles.statValue}>
                                {membershipDetails.totalDays}
                            </Typography>
                            <Typography
                                variant="caption"
                                style={styles.statLabel}
                            >
                                Total Days
                            </Typography>
                        </View>

                        <View style={styles.statCard}>
                            <CustomIcon
                                provider="Ionicons"
                                name="card"
                                size={20}
                                color="#FF6B35"
                            />
                            <Typography variant="h4" style={styles.statValue}>
                                ₹
                                {parseFloat(
                                    membership.membershipUsage.toString(),
                                ).toFixed(2)}
                            </Typography>
                            <Typography
                                variant="caption"
                                style={styles.statLabel}
                            >
                                Total Used
                            </Typography>
                        </View>
                    </View>

                    {/* Benefits Section */}
                    <View style={styles.benefitsContainer}>
                        <Typography variant="h3" style={styles.sectionTitle}>
                            Your Benefits
                        </Typography>
                        {membership.plan.benefits.map((benefit, index) => (
                            <View key={index} style={styles.benefitItem}>
                                <View style={styles.benefitIcon}>
                                    <CustomIcon
                                        provider="Ionicons"
                                        name="checkmark-circle"
                                        size={20}
                                        color="#00CC66"
                                    />
                                </View>
                                <Typography
                                    variant="body"
                                    style={styles.benefitText}
                                >
                                    {benefit}
                                </Typography>
                            </View>
                        ))}
                    </View>

                    {/* Payment Details */}
                    <View style={styles.paymentContainer}>
                        <Typography variant="h3" style={styles.sectionTitle}>
                            Payment Details
                        </Typography>
                        <View style={styles.paymentCard}>
                            <View style={styles.paymentRow}>
                                <Typography
                                    variant="body"
                                    style={styles.paymentLabel}
                                >
                                    Payment Method
                                </Typography>
                                <Typography
                                    variant="body"
                                    style={styles.paymentValue}
                                >
                                    {membership.payment.method}
                                </Typography>
                            </View>
                            <View style={styles.paymentRow}>
                                <Typography
                                    variant="body"
                                    style={styles.paymentLabel}
                                >
                                    Transaction ID
                                </Typography>
                                <Typography
                                    variant="body"
                                    style={styles.paymentValue}
                                >
                                    {membership.payment.transactionId}
                                </Typography>
                            </View>
                            <View style={styles.paymentRow}>
                                <Typography
                                    variant="body"
                                    style={styles.paymentLabel}
                                >
                                    Auto Renew
                                </Typography>
                                <Typography
                                    variant="body"
                                    style={styles.paymentValue}
                                >
                                    {membership.autoRenew
                                        ? "Enabled"
                                        : "Disabled"}
                                </Typography>
                            </View>
                        </View>
                    </View>

                    {/* Action Buttons */}
                    <View style={styles.actionContainer}>
                        {membershipDetails.daysRemaining > 0 && (
                            <TouchableOpacity style={styles.renewButton}>
                                <LinearGradient
                                    colors={["#4CAF50", "#45a049"]}
                                    style={styles.buttonGradient}
                                >
                                    <Typography
                                        variant="body"
                                        style={styles.buttonText}
                                    >
                                        Renew Membership
                                    </Typography>
                                </LinearGradient>
                            </TouchableOpacity>
                        )}

                        <TouchableOpacity style={styles.supportButton}>
                            <Typography
                                variant="body"
                                style={styles.supportButtonText}
                            >
                                Contact Support
                            </Typography>
                        </TouchableOpacity>
                    </View>
                </Animated.View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F8FAFC",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingVertical: 16,
        backgroundColor: COLORS.WHITE,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.GREY[100],
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#F1F5F9",
    },
    headerTitle: {
        color: COLORS.TEXT.DARK,
        fontWeight: "600",
    },
    scrollContainer: {
        flex: 1,
    },
    content: {
        padding: 16,
    },
    membershipCard: {
        borderRadius: 20,
        marginBottom: 24,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 20,
        elevation: 8,
    },
    cardGradient: {
        borderRadius: 20,
        padding: 20,
    },
    cardHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 24,
    },
    planTitleContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    planTitle: {
        color: COLORS.WHITE,
        fontWeight: "bold",
        marginLeft: 8,
    },
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statusText: {
        color: COLORS.WHITE,
        fontWeight: "bold",
        fontSize: 10,
    },
    cardContent: {
        alignItems: "center",
        marginBottom: 16,
    },
    daysRemaining: {
        color: COLORS.WHITE,
        fontSize: 40,
        fontFamily: fontFamily.bold,
        marginBottom: 4,
    },
    daysLabel: {
        color: "rgba(255, 255, 255, 0.8)",
        fontSize: 16,
    },
    progressContainer: {
        width: "100%",
    },
    progressTrack: {
        height: 8,
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        borderRadius: 4,
        overflow: "hidden",
        marginBottom: 8,
    },
    progressBar: {
        height: "100%",
        backgroundColor: "#FFD700",
        borderRadius: 4,
    },
    progressLabels: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    progressLabel: {
        color: "rgba(255, 255, 255, 0.7)",
        fontSize: 12,
    },
    statsContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 24,
        gap: 12,
    },
    statCard: {
        flex: 1,
        backgroundColor: COLORS.WHITE,
        padding: 16,
        borderRadius: 16,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    statValue: {
        color: COLORS.TEXT.DARK,
        fontWeight: "bold",
        marginTop: 8,
        marginBottom: 4,
    },
    statLabel: {
        color: COLORS.TEXT.DARK,
        textAlign: "center",
    },
    benefitsContainer: {
        backgroundColor: COLORS.WHITE,
        borderRadius: 16,
        padding: 20,
        marginBottom: 24,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    sectionTitle: {
        color: COLORS.TEXT.DARK,
        fontWeight: "bold",
        marginBottom: 16,
    },
    benefitItem: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
    },
    benefitIcon: {
        marginRight: 12,
    },
    benefitText: {
        flex: 1,
        color: COLORS.TEXT.DARK,
    },
    paymentContainer: {
        backgroundColor: COLORS.WHITE,
        borderRadius: 16,
        padding: 20,
        marginBottom: 24,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    paymentCard: {
        borderRadius: 12,
        backgroundColor: "#F8FAFC",
        padding: 16,
    },
    paymentRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
    },
    paymentLabel: {
        color: COLORS.TEXT.DARK,
        flex: 1,
    },
    paymentValue: {
        color: COLORS.TEXT.DARK,
        fontWeight: "500",
        flex: 1,
        textAlign: "right",
    },
    actionContainer: {
        marginBottom: 24,
    },
    renewButton: {
        borderRadius: 16,
        marginBottom: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    buttonGradient: {
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: 16,
        alignItems: "center",
    },
    buttonText: {
        color: COLORS.WHITE,
        fontWeight: "bold",
        fontSize: 16,
    },
    supportButton: {
        backgroundColor: COLORS.WHITE,
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: 16,
        alignItems: "center",
        borderWidth: 1,
        borderColor: COLORS.GREY[200],
    },
    supportButtonText: {
        color: COLORS.TEXT.DARK,
        fontWeight: "500",
        fontSize: 16,
    },
});

export default MembershipStatus;
