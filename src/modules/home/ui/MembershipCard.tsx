import React from "react";
import {
    View,
    StyleSheet,
    TouchableOpacity,
    ViewStyle,
    Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Typography } from "../../../components/Typography";
import { Button } from "../../../components/Button";
import { CustomIcon } from "../../../components/CustomIcon";
import { COLORS, WEIGHTS } from "../../../constants/ui";

interface MembershipBannerCardProps {
    planName: string;
    description: string;
    price: number;
    durationInDays: number;
    benefits: string[];
    onPress: () => void;
    style?: ViewStyle;
    variant?: "premium" | "standard";
}

const MembershipBannerCard: React.FC<MembershipBannerCardProps> = ({
    planName,
    description,
    price,
    durationInDays,
    benefits,
    onPress,
    style,
    variant = "standard",
}) => {
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

    const isPremium = variant === "premium";

    // Premium uses dark blue background; non-premium is bright/light

    const shadowColor = isPremium
        ? "rgba(13, 27, 42, 0.45)"
        : "rgba(27, 117, 187, 0.18)";

    return (
        <TouchableOpacity
            style={[
                styles.container,
                style,
                {
                    shadowColor,
                    elevation: isPremium ? 8 : 4,
                    shadowOffset: { width: 0, height: isPremium ? 6 : 3 },
                    shadowOpacity: isPremium ? 0.3 : 0.15,
                    shadowRadius: isPremium ? 12 : 8,
                },
            ]}
            onPress={onPress}
            activeOpacity={0.95}
        >
            <LinearGradient
                colors={
                    isPremium
                        ? [COLORS.NAVY[800], COLORS.NAVY[700]]
                        : [COLORS.WHITE, "#F7FAFF", COLORS.primaryLight]
                }
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradientContainer}
            >
                {/* Decorative Elements */}
                <View style={styles.decorativeElements}>
                    {isPremium && (
                        <View style={styles.sparkle}>
                            <CustomIcon
                                provider="MaterialCommunityIcons"
                                name="star-four-points"
                                size={12}
                                color={COLORS.GOLD[500]}
                            />
                        </View>
                    )}
                </View>

                {/* Popular Badge */}
                {isPremium && (
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
                                size={10}
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

                {/* Header Section */}
                <View
                    style={[styles.header, isPremium && styles.headerWithBadge]}
                >
                    <View style={styles.headerLeft}>
                        <View style={[styles.planNameContainer]}>
                            <Typography
                                variant="h4"
                                color={
                                    isPremium
                                        ? COLORS.GOLD[600]
                                        : COLORS.TEXT.DARK
                                }
                                style={styles.planName}
                            >
                                {planName}
                            </Typography>
                            <View
                                style={[
                                    styles.planIcon,
                                    {
                                        backgroundColor: isPremium
                                            ? "rgba(255,255,255,0.2)"
                                            : COLORS.primaryLight,
                                    },
                                ]}
                            >
                                <CustomIcon
                                    provider={
                                        isPremium
                                            ? "MaterialCommunityIcons"
                                            : "Ionicons"
                                    }
                                    name={isPremium ? "crown" : "ribbon"}
                                    size={14}
                                    color={
                                        isPremium
                                            ? COLORS.GOLD[600]
                                            : COLORS.primary
                                    }
                                />
                            </View>
                        </View>
                        {isPremium && (
                            <View style={styles.premiumSubtitle}>
                                <Typography
                                    variant="caption"
                                    color="rgba(255,255,255,0.8)"
                                    style={styles.premiumSubtitleText}
                                >
                                    Best Value • Save 40%
                                </Typography>
                            </View>
                        )}
                    </View>
                    <View style={styles.priceContainer}>
                        <View style={styles.priceWrapper}>
                            <Typography
                                variant="caption"
                                color={
                                    isPremium
                                        ? COLORS.GOLD[400]
                                        : COLORS.TEXT.LIGHT
                                }
                                style={styles.fromText}
                            >
                                from
                            </Typography>
                            <Typography
                                variant="h3"
                                color={
                                    isPremium
                                        ? COLORS.GOLD[600]
                                        : COLORS.primary
                                }
                                style={styles.price}
                            >
                                {formatPrice(price)}
                            </Typography>
                        </View>
                        <View
                            style={[
                                styles.durationBadge,
                                {
                                    backgroundColor: isPremium
                                        ? "rgba(212, 175, 55, 0.20)"
                                        : COLORS.primaryLight,
                                },
                            ]}
                        >
                            <CustomIcon
                                provider="Ionicons"
                                name="time"
                                size={10}
                                color={
                                    isPremium
                                        ? COLORS.GOLD[600]
                                        : COLORS.primary
                                }
                            />
                            <Typography
                                variant="caption"
                                color={
                                    isPremium
                                        ? COLORS.GOLD[600]
                                        : COLORS.primary
                                }
                                style={styles.durationText}
                            >
                                /{formatDuration(durationInDays).toLowerCase()}
                            </Typography>
                        </View>
                    </View>
                </View>

                {/* Description */}
                <Typography
                    variant="body"
                    color={isPremium ? COLORS.WHITE : COLORS.TEXT.DARK}
                    style={styles.description}
                    numberOfLines={2}
                >
                    {description}
                </Typography>

                {/* Enhanced Benefits Section */}
                <View style={styles.benefitsContainer}>
                    <View style={styles.benefitsHeader}>
                        <CustomIcon
                            provider="Ionicons"
                            name="gift"
                            size={14}
                            color={
                                isPremium ? COLORS.GOLD[600] : COLORS.primary
                            }
                        />
                        <Typography
                            variant="bodySmall"
                            color={isPremium ? COLORS.WHITE : COLORS.TEXT.DARK}
                            style={styles.benefitsHeaderText}
                        >
                            What's included:
                        </Typography>
                    </View>

                    {benefits.slice(0, 2).map((benefit, index) => (
                        <View key={index} style={styles.benefitRow}>
                            <LinearGradient
                                colors={
                                    isPremium
                                        ? [
                                              "rgba(212,175,55,0.35)",
                                              "rgba(212,175,55,0.15)",
                                          ]
                                        : [
                                              COLORS.primaryLight,
                                              COLORS.primary + "20",
                                          ]
                                }
                                style={styles.checkIcon}
                            >
                                <CustomIcon
                                    provider="Ionicons"
                                    name="checkmark-circle"
                                    size={14}
                                    color={
                                        isPremium
                                            ? COLORS.GOLD[600]
                                            : COLORS.primary
                                    }
                                />
                            </LinearGradient>
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

                    {benefits.length > 2 && (
                        <View style={styles.moreBenefitsContainer}>
                            <View
                                style={[
                                    styles.moreBenefitsBadge,
                                    {
                                        backgroundColor: isPremium
                                            ? "rgba(212,175,55,0.15)"
                                            : COLORS.primaryLight + "40",
                                    },
                                ]}
                            >
                                <CustomIcon
                                    provider="Ionicons"
                                    name="add-circle"
                                    size={12}
                                    color={
                                        isPremium
                                            ? COLORS.GOLD[600]
                                            : COLORS.primary
                                    }
                                />
                                <Typography
                                    variant="caption"
                                    color={
                                        isPremium
                                            ? COLORS.GOLD[600]
                                            : COLORS.primary
                                    }
                                    style={styles.moreBenefitsText}
                                >
                                    {benefits.length - 2} more features
                                </Typography>
                            </View>
                        </View>
                    )}
                </View>

                {/* Enhanced CTA Button */}
                <View style={styles.ctaContainer}>
                    {isPremium ? (
                        <LinearGradient
                            colors={[COLORS.GOLD[600], COLORS.GOLD[400]]}
                            style={styles.premiumButton}
                        >
                            <TouchableOpacity
                                style={styles.premiumButtonInner}
                                onPress={onPress}
                                activeOpacity={0.8}
                            >
                                <CustomIcon
                                    provider="Ionicons"
                                    name="rocket"
                                    size={16}
                                    color={COLORS.NAVY[800]}
                                />
                                <Typography
                                    variant="body"
                                    color={COLORS.NAVY[800]}
                                    style={styles.premiumButtonText}
                                >
                                    Upgrade Now
                                </Typography>
                            </TouchableOpacity>
                        </LinearGradient>
                    ) : (
                        <TouchableOpacity
                            style={styles.standardButton}
                            onPress={onPress}
                            activeOpacity={0.8}
                        >
                            <Typography
                                variant="body"
                                color={COLORS.primary}
                                style={styles.standardButtonText}
                            >
                                Choose Plan
                            </Typography>
                            <CustomIcon
                                provider="Ionicons"
                                name="arrow-forward-circle"
                                size={16}
                                color={COLORS.primary}
                            />
                        </TouchableOpacity>
                    )}
                </View>
            </LinearGradient>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: 24,
        marginHorizontal: 22,
        overflow: "hidden",
        transform: [{ scale: 1 }],
    },
    gradientContainer: {
        flex: 1,
        padding: 24,
        justifyContent: "space-between",
        position: "relative",
    },
    decorativeElements: {
        position: "absolute",
        top: 20,
        right: 20,
        zIndex: 1,
    },
    floatingIcon: {
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 8,
    },
    sparkle: {
        position: "absolute",
        top: -4,
        right: -4,
    },
    popularBadge: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 2,
    },
    popularBadgeGradient: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 6,
        paddingHorizontal: 12,
    },
    popularText: {
        marginLeft: 4,
        fontSize: 10,
        fontWeight: WEIGHTS.BOLD,
        letterSpacing: 0.5,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 12,
        marginTop: 16,
    },
    headerWithBadge: {
        // Add a bit more spacing so the premium badge doesn't overlap
        marginTop: 28,
    },
    headerLeft: {
        flex: 1,
        paddingRight: 12,
    },
    planNameContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 6,
    },
    planName: {
        fontWeight: WEIGHTS.BOLD,
        marginRight: 8,
        fontSize: 20,
    },
    planIcon: {
        width: 24,
        height: 24,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
    },
    premiumSubtitle: {
        marginTop: 2,
    },
    premiumSubtitleText: {
        fontSize: 11,
        fontWeight: WEIGHTS.MEDIUM,
        letterSpacing: 0.2,
    },
    priceContainer: {
        alignItems: "flex-end",
    },
    priceWrapper: {
        alignItems: "flex-end",
        marginBottom: 6,
    },
    fromText: {
        fontSize: 10,
        marginBottom: 2,
    },
    price: {
        fontWeight: WEIGHTS.BOLD,
        fontSize: 24,
    },
    durationBadge: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    durationText: {
        marginLeft: 4,
        fontSize: 10,
        fontWeight: WEIGHTS.MEDIUM,
    },
    description: {
        marginBottom: 16,
        lineHeight: 22,
        fontSize: 14,
    },
    benefitsContainer: {
        marginBottom: 20,
    },
    benefitsHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
    },
    benefitsHeaderText: {
        marginLeft: 6,
        fontWeight: WEIGHTS.SEMI_BOLD,
        fontSize: 12,
    },
    benefitRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
    },
    checkIcon: {
        width: 24,
        height: 24,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        marginRight: 10,
    },
    benefitText: {
        flex: 1,
        fontWeight: WEIGHTS.MEDIUM,
        fontSize: 13,
        lineHeight: 18,
    },
    moreBenefitsContainer: {
        marginTop: 8,
        alignItems: "flex-start",
    },
    moreBenefitsBadge: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 16,
    },
    moreBenefitsText: {
        marginLeft: 4,
        fontSize: 11,
        fontWeight: WEIGHTS.MEDIUM,
    },
    ctaContainer: {
        marginTop: 8,
    },
    premiumButton: {
        borderRadius: 16,
        overflow: "hidden",
    },
    premiumButtonInner: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 14,
        paddingHorizontal: 20,
    },
    premiumButtonText: {
        marginLeft: 8,
        fontWeight: WEIGHTS.BOLD,
        fontSize: 16,
    },
    standardButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 14,
        paddingHorizontal: 20,
        borderRadius: 16,
        borderWidth: 2,
        borderColor: COLORS.primary,
        backgroundColor: "transparent",
    },
    standardButtonText: {
        marginRight: 8,
        fontWeight: WEIGHTS.BOLD,
        fontSize: 16,
    },
});

export default MembershipBannerCard;
