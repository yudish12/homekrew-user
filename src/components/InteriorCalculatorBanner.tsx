import React, { useEffect, useState } from "react";
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Image,
    Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Typography } from "./Typography";
import { CustomIcon } from "./CustomIcon";
import { COLORS } from "../constants/ui";
import { shadowUtils } from "../utils/ui";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
    CALCULATOR_STORAGE_KEY,
    CalculatorResult,
    formatIndianPrice,
} from "../constants/interior-calculator";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export const InteriorCalculatorBanner: React.FC = () => {
    const navigation = useNavigation<any>();
    const [previousCalculation, setPreviousCalculation] =
        useState<CalculatorResult | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadPreviousCalculation();
    }, []);

    const loadPreviousCalculation = async () => {
        try {
            const stored = await AsyncStorage.getItem(CALCULATOR_STORAGE_KEY);
            if (stored) {
                const parsed = JSON.parse(stored) as CalculatorResult;
                setPreviousCalculation(parsed);
            }
        } catch (error) {
            console.error("Error loading calculation:", error);
        } finally {
            setLoading(false);
        }
    };

    const handlePress = () => {
        navigation.navigate("InteriorCalculator");
    };

    if (loading) {
        return null;
    }

    return (
        <TouchableOpacity
            style={styles.container}
            activeOpacity={0.85}
            onPress={handlePress}
        >
            <View style={styles.gradientOverlay}>
                <View style={styles.contentWrapper}>
                    <View style={styles.leftSection}>
                        <View style={styles.iconContainer}>
                            <CustomIcon
                                provider="Ionicons"
                                name="calculator-outline"
                                size={28}
                                color={COLORS.WHITE}
                            />
                        </View>
                        <View style={styles.textContainer}>
                            {previousCalculation ? (
                                <>
                                    <Typography
                                        variant="bodySmall"
                                        color={COLORS.WHITE}
                                        style={styles.subtitle}
                                    >
                                        {previousCalculation.bhkType} •{" "}
                                        {formatIndianPrice(
                                            previousCalculation.estimates
                                                .comfort,
                                        )}{" "}
                                        onwards
                                    </Typography>
                                </>
                            ) : (
                                <>
                                    <Typography
                                        variant="h6"
                                        color={COLORS.WHITE}
                                        style={styles.title}
                                    >
                                        Calculate Interior Cost
                                    </Typography>
                                </>
                            )}
                        </View>
                    </View>

                    <View style={styles.rightSection}>
                        <View style={styles.actionButton}>
                            <Typography
                                variant="bodySmall"
                                color={COLORS.primary}
                                style={styles.actionText}
                            >
                                {previousCalculation
                                    ? "Recalculate"
                                    : "Calculate"}
                            </Typography>
                            <CustomIcon
                                provider="Ionicons"
                                name="chevron-forward"
                                size={18}
                                color={COLORS.primary}
                            />
                        </View>
                    </View>
                </View>

                {/* Decorative pattern */}
                <View style={styles.decorativeCircle1} />
                <View style={styles.decorativeCircle2} />
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 16,
        marginVertical: 16,
        borderRadius: 16,
        overflow: "hidden",
        ...shadowUtils.getShadow("medium"),
    },
    gradientOverlay: {
        backgroundColor: COLORS.primary,
        paddingVertical: 20,
        paddingHorizontal: 20,
        minHeight: 100,
        position: "relative",
        overflow: "hidden",
    },
    contentWrapper: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        zIndex: 2,
    },
    leftSection: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
        marginRight: 12,
    },
    iconContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 12,
    },
    textContainer: {
        flex: 1,
    },
    title: {
        fontWeight: "600",
        marginBottom: 4,
    },
    subtitle: {
        opacity: 0.95,
        lineHeight: 18,
    },
    rightSection: {
        alignItems: "flex-end",
    },
    actionButton: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: COLORS.WHITE,
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 20,
        gap: 4,
    },
    actionText: {
        fontWeight: "600",
    },
    decorativeCircle1: {
        position: "absolute",
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: "rgba(255, 255, 255, 0.08)",
        top: -40,
        right: -20,
        zIndex: 1,
    },
    decorativeCircle2: {
        position: "absolute",
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: "rgba(255, 255, 255, 0.05)",
        bottom: -20,
        left: -10,
        zIndex: 1,
    },
});
