import React, { useState, useEffect } from "react";
import {
    View,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    SafeAreaView,
    Alert,
    ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Typography } from "../../../components/Typography";
import { CustomIcon } from "../../../components/CustomIcon";
import { SkeletonLoader } from "../../../components/SkeletonLoader";
import { COLORS, WEIGHTS } from "../../../constants/ui";
import { MembershipPlan } from "../../../types";
import { MembershipPlansServices } from "../../../services";
import { useNavigation, useRoute } from "@react-navigation/native";
import { fontFamily } from "../../../lib";
import RazorpayCheckout from "react-native-razorpay";
import { showErrorToast, showSuccessToast } from "../../../components/Toast";

// Enhanced Membership Card Component for List View
const MembershipPlanCard: React.FC<{
    plan: MembershipPlan;
    onPress: () => void;
}> = ({ plan, onPress }) => {
    const formatDuration = (days: number): string => {
        if (days >= 365) {
            const years = Math.floor(days / 365);
            return `${years} ${years === 1 ? "Year" : "Years"}`;
        } else if (days >= 30) {
            const months = Math.floor(days / 30);
            return `${months} ${months === 1 ? "Month" : "Months"}`;
        } else {
            return `${days} ${days === 1 ? "Day" : "Days"}`;
        }
    };

    const formatPrice = (price: number): string => {
        return `₹${price.toLocaleString("en-IN")}`;
    };

    // Determine if premium based on name
    const isPremium =
        plan.name.toLowerCase() === "premium" ||
        plan.name.toLowerCase() === "gold";
    const isPopular = isPremium; // Premium is popular

    // Premium card uses dark blue + gold accents; standard matches home card
    const gradientColors = isPremium
        ? ([COLORS.NAVY[800], COLORS.NAVY[700]] as const)
        : ([COLORS.WHITE, "#F7FAFF", COLORS.primaryLight] as const);

    return (
        <TouchableOpacity
            style={styles.planCard}
            onPress={onPress}
            activeOpacity={0.95}
        >
            <LinearGradient
                colors={gradientColors}
                style={styles.planCardGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            >
                {/* Popular Badge */}
                {isPopular && (
                    <View style={styles.popularBadge}>
                        <LinearGradient
                            colors={[COLORS.GOLD[600], COLORS.GOLD[400]]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.popularBadgeGradient}
                        >
                            <CustomIcon
                                provider="Ionicons"
                                name="star"
                                size={12}
                                color={COLORS.WHITE}
                            />
                            <Typography
                                variant="caption"
                                color={COLORS.WHITE}
                                style={styles.popularText}
                            >
                                MOST POPULAR
                            </Typography>
                        </LinearGradient>
                    </View>
                )}

                {/* Header */}
                <View
                    style={[styles.planHeader, isPremium && { marginTop: 20 }]}
                >
                    <View style={styles.planInfo}>
                        <Typography
                            variant="h3"
                            color={
                                isPremium ? COLORS.GOLD[600] : COLORS.TEXT.DARK
                            }
                            style={styles.planTitle}
                        >
                            {plan.name}
                        </Typography>
                        <View style={styles.priceSection}>
                            <Typography
                                variant="h2"
                                color={
                                    isPremium
                                        ? COLORS.GOLD[600]
                                        : COLORS.primary
                                }
                                style={styles.currentPrice}
                            >
                                {formatPrice(plan.price)}
                            </Typography>
                            <Typography
                                variant="bodySmall"
                                color={
                                    isPremium
                                        ? COLORS.GOLD[400]
                                        : COLORS.TEXT.LIGHT
                                }
                            >
                                per{" "}
                                {formatDuration(
                                    plan.durationInDays,
                                ).toLowerCase()}
                            </Typography>
                        </View>
                    </View>

                    {/* Plan Icon */}
                    <View
                        style={[
                            styles.planIcon,
                            {
                                backgroundColor: isPremium
                                    ? "rgba(212,175,55,0.20)"
                                    : COLORS.primary + "20",
                            },
                        ]}
                    >
                        <CustomIcon
                            provider="Ionicons"
                            name={isPremium ? "diamond" : "shield-checkmark"}
                            size={32}
                            color={
                                isPremium ? COLORS.GOLD[600] : COLORS.primary
                            }
                        />
                    </View>
                </View>

                {/* Description */}
                <Typography
                    variant="body"
                    color={isPremium ? COLORS.WHITE : COLORS.TEXT.DARK}
                    style={styles.planDescription}
                    numberOfLines={2}
                >
                    {plan.description}
                </Typography>

                {/* Benefits Preview */}
                <View style={styles.benefitsPreview}>
                    {plan.benefits.slice(0, 3).map((benefit, index) => (
                        <View key={index} style={styles.benefitItem}>
                            <CustomIcon
                                provider="Ionicons"
                                name="checkmark-circle"
                                size={16}
                                color={
                                    isPremium
                                        ? COLORS.GOLD[600]
                                        : COLORS.primary
                                }
                            />
                            <Typography
                                variant="bodySmall"
                                color={
                                    isPremium ? COLORS.WHITE : COLORS.TEXT.DARK
                                }
                                style={styles.benefitText}
                                numberOfLines={1}
                            >
                                {benefit}
                            </Typography>
                        </View>
                    ))}
                    {plan.benefits.length > 3 && (
                        <Typography
                            variant="caption"
                            color={
                                isPremium ? COLORS.GOLD[400] : COLORS.TEXT.LIGHT
                            }
                            style={styles.moreBenefits}
                        >
                            +{plan.benefits.length - 3} more benefits
                        </Typography>
                    )}
                </View>

                {/* View Details Button */}
                <View style={styles.viewDetailsButton}>
                    <Typography
                        variant="body"
                        color={isPremium ? COLORS.GOLD[600] : COLORS.primary}
                        style={styles.viewDetailsText}
                    >
                        View Details
                    </Typography>
                    <CustomIcon
                        provider="Ionicons"
                        name="arrow-forward"
                        size={16}
                        color={isPremium ? COLORS.GOLD[600] : COLORS.primary}
                    />
                </View>
            </LinearGradient>
        </TouchableOpacity>
    );
};

// Detailed Plan View Component
const MembershipDetailView: React.FC<{
    plan: MembershipPlan;
    onBack: () => void;
}> = ({ plan, onBack }) => {
    const [buyingLoading, setBuyLoading] = useState(false);
    const navigation = useNavigation<any>();
    const formatDuration = (days: number): string => {
        if (days >= 365) {
            const years = Math.floor(days / 365);
            return `${years} ${years === 1 ? "Year" : "Years"}`;
        } else if (days >= 30) {
            const months = Math.floor(days / 30);
            return `${months} ${months === 1 ? "Month" : "Months"}`;
        } else {
            return `${days} ${days === 1 ? "Day" : "Days"}`;
        }
    };

    const formatPrice = (price: number): string => {
        return `₹${price.toLocaleString("en-IN")}`;
    };

    const isPremium =
        plan.name.toLowerCase() === "premium" ||
        plan.name.toLowerCase() === "gold";
    const isPopular = isPremium;

    const handleBuyNow = async () => {
        setBuyLoading(true);
        const response = await MembershipPlansServices.buyMembershipPlan(
            plan?._id ?? "",
        );
        if (response.success) {
            RazorpayCheckout.open({
                key: "rzp_test_M1Ad7casmGNZTV",
                amount: (response.data?.amount ?? 0) / 100,
                currency: "INR",
                theme: {
                    color: COLORS.primary,
                },
                order_id: response.data?.id ?? "",
                name: "Buy Products",
                description:
                    "Payment to buy products delivered right at your registered address ",
            });
            setBuyLoading(false);
            showSuccessToast("Plan purchased successfully");
            setTimeout(() => {
                navigation.navigate("MainApp");
            }, 1000);
            // Default implementation - you can add your payment navigation here
            // navigation.navigate('PaymentScreen', { plan: selectedPlan });
        } else {
            showErrorToast(response.error?.message ?? "Failed to buy plan");
            setBuyLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.detailContainer}>
            <ScrollView
                style={styles.detailScrollView}
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <View style={styles.detailHeader}>
                    <TouchableOpacity
                        onPress={onBack}
                        style={styles.backButton}
                    >
                        <CustomIcon
                            provider="Ionicons"
                            name="arrow-back"
                            size={24}
                            color={COLORS.TEXT.DARK}
                        />
                    </TouchableOpacity>
                    <Typography
                        variant="h3"
                        color={COLORS.TEXT.DARK}
                        style={styles.detailHeaderTitle}
                    >
                        Plan Details
                    </Typography>
                    <View style={{ width: 24 }} />
                </View>

                {/* Plan Hero Section */}
                <LinearGradient
                    colors={
                        isPremium
                            ? [COLORS.NAVY[800], COLORS.NAVY[700]]
                            : [COLORS.WHITE, "#F7FAFF", COLORS.primaryLight]
                    }
                    style={styles.heroSection}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                >
                    {isPopular && (
                        <View style={styles.detailPopularBadge}>
                            <CustomIcon
                                provider="Ionicons"
                                name="star"
                                size={14}
                                color={COLORS.GOLD[600]}
                            />
                            <Typography
                                variant="caption"
                                color={COLORS.GOLD[600]}
                                style={styles.popularText}
                            >
                                MOST POPULAR CHOICE
                            </Typography>
                        </View>
                    )}

                    <View
                        style={[
                            styles.heroContent,
                            isPremium && { marginTop: 20 },
                        ]}
                    >
                        <View
                            style={[
                                styles.heroIcon,
                                {
                                    backgroundColor: isPremium
                                        ? "rgba(212,175,55,0.20)"
                                        : COLORS.primary + "20",
                                },
                            ]}
                        >
                            <CustomIcon
                                provider="Ionicons"
                                name={
                                    isPremium ? "diamond" : "shield-checkmark"
                                }
                                size={32}
                                color={
                                    isPremium
                                        ? COLORS.GOLD[600]
                                        : COLORS.primary
                                }
                            />
                        </View>

                        <Typography
                            variant="h1"
                            color={
                                isPremium ? COLORS.GOLD[600] : COLORS.primary
                            }
                            style={styles.heroTitle}
                        >
                            {plan.name}
                        </Typography>

                        <Typography
                            variant="body"
                            color={isPremium ? COLORS.WHITE : COLORS.TEXT.DARK}
                            style={styles.heroDescription}
                        >
                            {plan.description}
                        </Typography>

                        <View style={styles.heroPricing}>
                            <Typography
                                variant="h1"
                                color={
                                    isPremium
                                        ? COLORS.GOLD[600]
                                        : COLORS.primary
                                }
                                style={styles.detailCurrentPrice}
                            >
                                {formatPrice(plan.price)}
                            </Typography>
                            <Typography
                                variant="body"
                                color={
                                    isPremium
                                        ? COLORS.GOLD[400]
                                        : COLORS.TEXT.LIGHT
                                }
                            >
                                for {formatDuration(plan.durationInDays)}
                            </Typography>
                        </View>
                    </View>
                </LinearGradient>

                {/* Features Section */}
                <View style={styles.featuresSection}>
                    <Typography
                        variant="h3"
                        color={COLORS.TEXT.DARK}
                        style={styles.sectionTitle}
                    >
                        What's Included
                    </Typography>

                    <View style={styles.featuresList}>
                        {plan.benefits.map((benefit, index) => (
                            <View key={index} style={styles.featureRow}>
                                <View style={styles.featureIconWrapper}>
                                    <CustomIcon
                                        provider="Ionicons"
                                        name="checkmark-circle"
                                        size={20}
                                        color={COLORS.primary}
                                    />
                                </View>
                                <Typography
                                    variant="body"
                                    color={COLORS.TEXT.DARK}
                                    style={styles.featureDescription}
                                >
                                    {benefit}
                                </Typography>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Bottom spacing for fixed button */}
                <View style={{ height: 100 }} />
            </ScrollView>

            {/* Fixed Buy Now Button */}
            <View style={styles.buyNowContainer}>
                <LinearGradient
                    colors={
                        isPremium
                            ? [COLORS.GOLD[600], COLORS.GOLD[400]]
                            : [COLORS.primary, COLORS.primary + "DD"]
                    }
                    style={styles.buyNowButton}
                >
                    <TouchableOpacity
                        style={[
                            styles.buyNowInner,
                            buyingLoading && styles.loading,
                        ]}
                        onPress={() => handleBuyNow()}
                        activeOpacity={0.9}
                    >
                        <CustomIcon
                            provider="Ionicons"
                            name="card"
                            size={20}
                            color={isPremium ? COLORS.NAVY[800] : COLORS.WHITE}
                        />
                        <Typography
                            variant="h4"
                            color={isPremium ? COLORS.NAVY[800] : COLORS.WHITE}
                            style={styles.buyNowText}
                        >
                            Buy Now - {formatPrice(plan.price)}
                        </Typography>
                        {buyingLoading && (
                            <ActivityIndicator
                                size="small"
                                color={
                                    isPremium ? COLORS.NAVY[800] : COLORS.WHITE
                                }
                            />
                        )}
                    </TouchableOpacity>
                </LinearGradient>
            </View>
        </SafeAreaView>
    );
};

// Skeleton Layout for Membership Plans
const getMembershipPlanSkeletonLayout = () => [
    // Popular badge area
    {
        width: 100 as unknown as `${number}%`,
        height: 24,
        borderRadius: 12,
        style: { marginBottom: 12 },
    },
    // Header with title and icon
    {
        width: 70 as unknown as `${number}%`,
        height: 28,
        borderRadius: 8,
        style: { marginBottom: 8 },
    },
    {
        width: 50 as unknown as `${number}%`,
        height: 32,
        borderRadius: 8,
        style: { marginBottom: 16 },
    },
    // Description
    {
        width: 100 as unknown as `${number}%`,
        height: 16,
        borderRadius: 6,
        style: { marginBottom: 4 },
    },
    {
        width: 80 as unknown as `${number}%`,
        height: 16,
        borderRadius: 6,
        style: { marginBottom: 16 },
    },
    // Benefits
    {
        width: 90 as unknown as `${number}%`,
        height: 14,
        borderRadius: 6,
        style: { marginBottom: 6 },
    },
    {
        width: 85 as unknown as `${number}%`,
        height: 14,
        borderRadius: 6,
        style: { marginBottom: 6 },
    },
    {
        width: 75 as unknown as `${number}%`,
        height: 14,
        borderRadius: 6,
        style: { marginBottom: 16 },
    },
    // View Details button
    {
        width: 40 as unknown as `${number}%`,
        height: 20,
        borderRadius: 10,
        style: { alignSelf: "center" as const },
    },
];

// Main Membership Plans Screen Component with Service Integration
const MembershipPlansScreen: React.FC<{
    onBuyNow?: (plan: MembershipPlan) => void;
}> = ({ onBuyNow }) => {
    const params = useRoute().params as {
        screen: string;
        params: MembershipPlan;
    };

    const [membershipPlans, setMembershipPlans] = useState<MembershipPlan[]>(
        [],
    );
    const [selectedPlan, setSelectedPlan] = useState<MembershipPlan | null>(
        params?.params ?? null,
    );
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Fetch membership plans on component mount
    useEffect(() => {
        fetchMembershipPlans();
    }, []);

    const fetchMembershipPlans = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await MembershipPlansServices.getMembershipPlans();

            if (response.success && response.data) {
                setMembershipPlans(response.data);
            } else {
                setError(
                    response.error?.message ??
                        "Failed to fetch membership plans",
                );
            }
        } catch (err) {
            setError("Network error. Please check your connection.");
            console.error("Error fetching membership plans:", err);
        } finally {
            setLoading(false);
        }
    };

    const handlePlanSelect = (plan: MembershipPlan) => {
        setSelectedPlan(plan);
    };

    const handleBack = () => {
        setSelectedPlan(null);
    };

    const handleRetry = () => {
        fetchMembershipPlans();
    };

    const navigation = useNavigation<any>();

    // Show detail view if plan is selected
    if (selectedPlan) {
        return <MembershipDetailView plan={selectedPlan} onBack={handleBack} />;
    }

    // Main plans list view
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.detailHeader}>
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
                <Typography
                    variant="h3"
                    color={COLORS.TEXT.DARK}
                    style={styles.detailHeaderTitle}
                >
                    Membership Plans
                </Typography>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Loading State */}
                {loading && (
                    <SkeletonLoader
                        items={3}
                        layout={getMembershipPlanSkeletonLayout()}
                        containerStyle={styles.skeletonContainer}
                        itemContainerStyle={styles.skeletonItem}
                    />
                )}

                {/* Error State */}
                {error && !loading && (
                    <View style={styles.errorState}>
                        <CustomIcon
                            provider="Ionicons"
                            name="alert-circle-outline"
                            size={48}
                            color={COLORS.RED[500]}
                        />
                        <Typography
                            variant="h4"
                            color={COLORS.TEXT.DARK}
                            style={styles.errorTitle}
                        >
                            Something went wrong
                        </Typography>
                        <Typography
                            variant="body"
                            color={COLORS.TEXT.LIGHT}
                            style={styles.errorDescription}
                        >
                            {error}
                        </Typography>
                        <TouchableOpacity
                            style={styles.retryButton}
                            onPress={handleRetry}
                            activeOpacity={0.8}
                        >
                            <CustomIcon
                                provider="Ionicons"
                                name="refresh"
                                size={16}
                                color={COLORS.WHITE}
                            />
                            <Typography
                                variant="body"
                                color={COLORS.WHITE}
                                style={styles.retryText}
                            >
                                Try Again
                            </Typography>
                        </TouchableOpacity>
                    </View>
                )}

                {/* Success State - Plans List */}
                {!loading &&
                    !error &&
                    membershipPlans.map(plan => (
                        <MembershipPlanCard
                            key={plan._id}
                            plan={plan}
                            onPress={() => handlePlanSelect(plan)}
                        />
                    ))}

                {/* Empty State */}
                {!loading && !error && membershipPlans.length === 0 && (
                    <View style={styles.emptyState}>
                        <CustomIcon
                            provider="Ionicons"
                            name="document-text-outline"
                            size={48}
                            color={COLORS.TEXT.LIGHT}
                        />
                        <Typography
                            variant="h4"
                            color={COLORS.TEXT.LIGHT}
                            style={styles.emptyTitle}
                        >
                            No Plans Available
                        </Typography>
                        <Typography
                            variant="body"
                            color={COLORS.TEXT.LIGHT}
                            style={styles.emptyDescription}
                        >
                            Check back later for membership plans
                        </Typography>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.WHITE,
    },
    header: {
        padding: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border.light,
    },
    screenTitle: {
        marginTop: 12,
        fontFamily: fontFamily.semiBold,
        marginBottom: 4,
    },
    screenSubtitle: {
        fontSize: 14,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: 20,
        paddingTop: 16,
    },
    planCard: {
        marginBottom: 16,
        borderRadius: 20,
        overflow: "hidden",
        // iOS Shadow
        shadowColor: COLORS.GREY[400],
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        // Android Shadow
        elevation: 3,
        backgroundColor: COLORS.WHITE,
    },
    planCardGradient: {
        padding: 20,
        position: "relative",
    },
    popularBadge: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        paddingVertical: 0,
    },
    popularBadgeGradient: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 6,
        gap: 4,
    },
    popularText: {
        fontSize: 10,
        fontWeight: WEIGHTS.BOLD,
        letterSpacing: 0.5,
    },
    planHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 12,
        marginTop: 8,
    },
    planInfo: {
        flex: 1,
    },
    planTitle: {
        fontWeight: WEIGHTS.BOLD,
        marginBottom: 8,
    },
    priceSection: {
        alignItems: "flex-start",
    },
    currentPrice: {
        fontWeight: WEIGHTS.BOLD,
        marginBottom: 4,
    },
    planIcon: {
        width: 56,
        height: 56,
        borderRadius: 28,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 2,
        borderColor: "rgba(255,255,255,0.3)",
    },
    planDescription: {
        marginBottom: 16,
        lineHeight: 20,
    },
    benefitsPreview: {
        marginBottom: 16,
    },
    benefitItem: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 8,
        gap: 8,
    },
    benefitText: {
        flex: 1,
        fontWeight: WEIGHTS.MEDIUM,
    },
    moreBenefits: {
        marginTop: 4,
        fontStyle: "italic",
        marginLeft: 24,
    },
    viewDetailsButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        paddingVertical: 8,
    },
    viewDetailsText: {
        fontWeight: WEIGHTS.SEMI_BOLD,
    },
    // Skeleton Loader Styles
    skeletonContainer: {
        flexDirection: "column",
    },
    loading: {
        opacity: 0.5,
    },
    skeletonItem: {
        width: "100%",
        marginBottom: 16,
        padding: 20,
        height: "auto",
        minHeight: 200,
    },
    // Error State Styles
    errorState: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 60,
        paddingHorizontal: 20,
    },
    errorTitle: {
        fontWeight: WEIGHTS.BOLD,
        marginTop: 16,
        marginBottom: 8,
        textAlign: "center",
    },
    errorDescription: {
        textAlign: "center",
        marginBottom: 24,
        lineHeight: 20,
    },
    retryButton: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: COLORS.primary,
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 16,
        gap: 8,
    },
    retryText: {
        fontWeight: WEIGHTS.SEMI_BOLD,
    },
    // Empty State Styles
    emptyState: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 60,
    },
    emptyTitle: {
        fontWeight: WEIGHTS.BOLD,
        marginTop: 16,
        marginBottom: 8,
    },
    emptyDescription: {
        textAlign: "center",
    },
    // Detail View Styles
    detailContainer: {
        flex: 1,
        backgroundColor: COLORS.WHITE,
    },
    detailScrollView: {
        flex: 1,
    },
    detailHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 20,
        paddingTop: 32,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border.light,
    },
    backButton: {
        padding: 4,
    },
    detailHeaderTitle: {
        fontWeight: WEIGHTS.BOLD,
    },
    heroSection: {
        padding: 24,
        margin: 20,
        borderRadius: 24,
        position: "relative",
    },
    detailPopularBadge: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: COLORS.GREEN[700],
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 8,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        gap: 6,
    },
    heroContent: {
        alignItems: "center",
        marginTop: 8,
    },
    heroIcon: {
        width: 80,
        height: 80,
        borderRadius: 40,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 16,
        borderWidth: 3,
        borderColor: "rgba(255,255,255,0.3)",
    },
    heroTitle: {
        fontWeight: WEIGHTS.BOLD,
        marginBottom: 8,
        textAlign: "center",
    },
    heroDescription: {
        textAlign: "center",
        marginBottom: 20,
        paddingHorizontal: 16,
        lineHeight: 22,
    },
    heroPricing: {
        alignItems: "center",
        gap: 4,
    },
    detailCurrentPrice: {
        fontWeight: WEIGHTS.BOLD,
        fontSize: 32,
    },
    featuresSection: {
        padding: 20,
    },
    sectionTitle: {
        fontWeight: WEIGHTS.BOLD,
        marginBottom: 16,
    },
    featuresList: {
        gap: 12,
    },
    featureRow: {
        flexDirection: "row",
        alignItems: "flex-start",
        gap: 12,
    },
    featureIconWrapper: {
        marginTop: 2,
    },
    featureDescription: {
        flex: 1,
        lineHeight: 22,
    },
    buyNowContainer: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        padding: 20,
        backgroundColor: COLORS.WHITE,
        borderTopWidth: 1,
        borderTopColor: COLORS.border.light,
        // iOS Shadow
        shadowColor: COLORS.GREY[400],
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        // Android Shadow
        elevation: 4,
    },
    buyNowButton: {
        borderRadius: 16,
        overflow: "hidden",
    },
    buyNowInner: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 16,
        gap: 12,
    },
    buyNowText: {
        fontWeight: WEIGHTS.BOLD,
        fontSize: 16,
    },
});

export default MembershipPlansScreen;
