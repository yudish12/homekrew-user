import { NavigationProp, useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { RootState } from "../../../types";
import { TouchableOpacity, View, Animated, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import CustomIcon from "../../../components/CustomIcon";
import { COLORS, membershipGradientColors } from "../../../constants";
import { Typography } from "../../../components/Typography";
import { useCallback, useEffect, useRef } from "react";

// Membership Status Component - Compact Header Badge
export const MembershipStatusBadge = () => {
    const navigation = useNavigation<NavigationProp<any>>();
    const pulseAnim = useRef(new Animated.Value(1)).current;
    const glowAnim = useRef(new Animated.Value(0)).current;
    const shimmerAnim = useRef(new Animated.Value(0)).current;
    const user = useSelector((state: RootState) => state.auth.user);

    useEffect(() => {
        if (user?.membership?.status === "ACTIVE") {
            // Pulse animation
            const pulseAnimation = Animated.loop(
                Animated.sequence([
                    Animated.timing(pulseAnim, {
                        toValue: 1.08,
                        duration: 1200,
                        useNativeDriver: true,
                    }),
                    Animated.timing(pulseAnim, {
                        toValue: 1,
                        duration: 1200,
                        useNativeDriver: true,
                    }),
                ]),
            );

            // Glow animation
            const glowAnimation = Animated.loop(
                Animated.sequence([
                    Animated.timing(glowAnim, {
                        toValue: 1,
                        duration: 1800,
                        useNativeDriver: true,
                    }),
                    Animated.timing(glowAnim, {
                        toValue: 0,
                        duration: 1800,
                        useNativeDriver: true,
                    }),
                ]),
            );

            // Shimmer animation
            const shimmerAnimation = Animated.loop(
                Animated.timing(shimmerAnim, {
                    toValue: 1,
                    duration: 2500,
                    useNativeDriver: true,
                }),
            );

            pulseAnimation.start();
            glowAnimation.start();
            shimmerAnimation.start();

            return () => {
                pulseAnimation.stop();
                glowAnimation.stop();
                shimmerAnimation.stop();
                pulseAnim.setValue(1);
                glowAnim.setValue(0);
                shimmerAnim.setValue(0);
            };
        }
    }, [user?.membership?.status]);

    const getMembershipDaysRemaining = useCallback(() => {
        if (!user?.membership || user.membership.status !== "ACTIVE") {
            return null;
        }

        const endDate = new Date(user.membership.endDate);
        const today = new Date();
        const timeDiff = endDate.getTime() - today.getTime();
        const daysRemaining = Math.ceil(timeDiff / (1000 * 3600 * 24));

        return daysRemaining > 0 ? daysRemaining : 0;
    }, [user?.membership]);

    if (!user?.membership || user.membership.status !== "ACTIVE") {
        return null;
    }

    const handleMembershipPress = () => {
        navigation.navigate("MembershipStatus", {
            membership: user.membership,
        });
    };

    const daysRemaining = getMembershipDaysRemaining();

    const glowOpacity = glowAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0.4, 0.9],
    });

    const shimmerTranslate = shimmerAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [-100, 100],
    });

    return (
        <TouchableOpacity
            onPress={handleMembershipPress}
            activeOpacity={0.7}
            style={styles.container}
        >
            <Animated.View
                style={[
                    styles.badgeWrapper,
                    {
                        transform: [{ scale: pulseAnim }],
                    },
                ]}
            >
                {/* Outer glow effect */}
                <Animated.View
                    style={[
                        styles.outerGlow,
                        {
                            opacity: glowOpacity,
                        },
                    ]}
                >
                    <LinearGradient
                        colors={membershipGradientColors}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.glowGradient}
                    />
                </Animated.View>

                {/* Main badge */}
                <LinearGradient
                    colors={membershipGradientColors}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.badge}
                >
                    {/* Shimmer overlay */}
                    <Animated.View
                        style={[
                            styles.shimmerOverlay,
                            {
                                transform: [{ translateX: shimmerTranslate }],
                            },
                        ]}
                    >
                        <LinearGradient
                            colors={[
                                "rgba(255, 255, 255, 0)",
                                "rgba(255, 255, 255, 0.5)",
                                "rgba(255, 255, 255, 0)",
                            ]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.shimmerGradient}
                        />
                    </Animated.View>

                    <View style={styles.content}>
                        {/* Icon */}
                        <View style={styles.iconContainer}>
                            <CustomIcon
                                provider="MaterialCommunityIcons"
                                name="diamond"
                                size={14}
                                color="#FFFFFF"
                            />
                        </View>

                        {/* Days remaining */}
                        <Typography variant="caption" style={styles.daysText}>
                            {daysRemaining !== null && daysRemaining > 0
                                ? `${daysRemaining}d`
                                : "0d"}
                        </Typography>
                    </View>
                </LinearGradient>

                {/* Active indicator dot */}
                <Animated.View
                    style={[
                        styles.activeDot,
                        {
                            opacity: glowOpacity,
                        },
                    ]}
                />
            </Animated.View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        height: 36,
        justifyContent: "center",
        alignItems: "center",
    },
    badgeWrapper: {
        position: "relative",
        height: 36,
    },
    outerGlow: {
        position: "absolute",
        top: -2,
        left: -2,
        right: -2,
        bottom: -2,
        borderRadius: 18,
        overflow: "hidden",
    },
    glowGradient: {
        width: "100%",
        height: "100%",
        opacity: 0.5,
    },
    badge: {
        height: 36,
        borderRadius: 18,
        paddingHorizontal: 10,
        paddingVertical: 6,
        overflow: "hidden",
        elevation: 4,
        shadowColor: COLORS.primary,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.4,
        shadowRadius: 4,
        position: "relative",
    },
    shimmerOverlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: "200%",
    },
    shimmerGradient: {
        width: "100%",
        height: "100%",
    },
    content: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 4,
        zIndex: 1,
    },
    iconContainer: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        justifyContent: "center",
        alignItems: "center",
    },
    daysText: {
        color: "#FFFFFF",
        fontSize: 12,
        fontWeight: "700",
        letterSpacing: 0.3,
    },
    activeDot: {
        position: "absolute",
        top: 1,
        right: 1,
        width: 7,
        height: 7,
        borderRadius: 3.5,
        backgroundColor: "#00FF88",
        borderWidth: 1.5,
        borderColor: "#FFFFFF",
        zIndex: 2,
    },
});
