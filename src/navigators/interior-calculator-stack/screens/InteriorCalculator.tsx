import React, { useState, useRef, useEffect } from "react";
import {
    View,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Dimensions,
    Animated,
    ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "../../../components/SafeAreaView";
import { Typography } from "../../../components/Typography";
import { Button } from "../../../components/Button";
import { CustomIcon } from "../../../components/CustomIcon";
import { StepperProgress } from "../../../components/StepperProgress";
import { COLORS } from "../../../constants/ui";
import { shadowUtils, spacingUtils } from "../../../utils/ui";
import {
    BHK_OPTIONS,
    REQUIREMENT_ITEMS,
    PACKAGE_DETAILS,
    BhkType,
    PackageType,
    getMaxCount,
    validateRequirements,
    calculateAllEstimates,
    formatIndianPrice,
    CALCULATOR_STORAGE_KEY,
    CalculatorResult,
} from "../../../constants/interior-calculator";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

interface RequirementCounterProps {
    label: string;
    icon: string;
    count: number;
    maxCount: number;
    note?: string;
    onIncrement: () => void;
    onDecrement: () => void;
}

const RequirementCounter: React.FC<RequirementCounterProps> = ({
    label,
    icon,
    count,
    maxCount,
    note,
    onIncrement,
    onDecrement,
}) => {
    const isMaxReached = count >= maxCount;
    const hasKitchenCheck = label === "Kitchen" && count === 1;

    return (
        <View style={styles.requirementCard}>
            <View style={styles.requirementLeft}>
                <View style={styles.requirementIconContainer}>
                    <CustomIcon
                        provider="Ionicons"
                        name={icon}
                        size={24}
                        color={count > 0 ? COLORS.primary : COLORS.GREY[400]}
                    />
                </View>
                <View style={styles.requirementTextContainer}>
                    <View style={styles.requirementLabelRow}>
                        <Typography
                            variant="body"
                            color={COLORS.TEXT.DARK}
                            style={styles.requirementLabel}
                        >
                            {label}
                        </Typography>
                        {hasKitchenCheck && (
                            <CustomIcon
                                provider="Ionicons"
                                name="checkmark-circle"
                                size={18}
                                color={COLORS.GREEN[700]}
                            />
                        )}
                    </View>
                    {note && count > 0 && (
                        <Typography
                            variant="caption"
                            color={COLORS.TEXT.LIGHT}
                            style={styles.requirementNote}
                        >
                            {note}
                        </Typography>
                    )}
                </View>
            </View>

            <View style={styles.counterContainer}>
                <TouchableOpacity
                    style={[
                        styles.counterButton,
                        count === 0 && styles.counterButtonDisabled,
                    ]}
                    onPress={onDecrement}
                    disabled={count === 0}
                    activeOpacity={0.7}
                >
                    <CustomIcon
                        provider="Ionicons"
                        name="remove"
                        size={20}
                        color={count === 0 ? COLORS.GREY[400] : COLORS.WHITE}
                    />
                </TouchableOpacity>

                <View style={styles.countDisplay}>
                    <Typography
                        variant="body"
                        color={COLORS.TEXT.DARK}
                        style={styles.countText}
                    >
                        {count}
                    </Typography>
                </View>

                <TouchableOpacity
                    style={[
                        styles.counterButton,
                        isMaxReached && styles.counterButtonDisabled,
                    ]}
                    onPress={onIncrement}
                    disabled={isMaxReached}
                    activeOpacity={0.7}
                >
                    <CustomIcon
                        provider="Ionicons"
                        name="add"
                        size={20}
                        color={isMaxReached ? COLORS.GREY[400] : COLORS.WHITE}
                    />
                </TouchableOpacity>
            </View>
        </View>
    );
};

interface PackageCardProps {
    packageType: PackageType;
    price: number;
    isPopular?: boolean;
}

const PackageCard: React.FC<PackageCardProps> = ({
    packageType,
    price,
    isPopular = false,
}) => {
    const details = PACKAGE_DETAILS[packageType];
    const [scaleAnim] = useState(new Animated.Value(1));

    useEffect(() => {
        if (isPopular) {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(scaleAnim, {
                        toValue: 1.02,
                        duration: 1000,
                        useNativeDriver: true,
                    }),
                    Animated.timing(scaleAnim, {
                        toValue: 1,
                        duration: 1000,
                        useNativeDriver: true,
                    }),
                ]),
            ).start();
        }
    }, [isPopular]);

    return (
        <Animated.View
            style={[
                styles.packageCard,
                isPopular && styles.packageCardPopular,
                { transform: [{ scale: scaleAnim }] },
            ]}
        >
            {isPopular && (
                <View style={styles.popularBadge}>
                    <Typography
                        variant="caption"
                        color={COLORS.WHITE}
                        style={styles.popularText}
                    >
                        {details.badge}
                    </Typography>
                </View>
            )}

            <View style={styles.packageHeader}>
                <View
                    style={[
                        styles.packageIconContainer,
                        { backgroundColor: details.color + "20" },
                    ]}
                >
                    <CustomIcon
                        provider="Ionicons"
                        name={
                            packageType === "essential"
                                ? "home-outline"
                                : packageType === "comfort"
                                ? "home"
                                : "diamond-outline"
                        }
                        size={28}
                        color={details.color}
                    />
                </View>
                <View style={styles.packageTitleContainer}>
                    <Typography
                        variant="h5"
                        color={COLORS.TEXT.DARK}
                        style={styles.packageTitle}
                    >
                        {details.label}
                    </Typography>
                    <Typography
                        variant="caption"
                        color={COLORS.TEXT.LIGHT}
                        style={styles.packageDescription}
                    >
                        {details.description}
                    </Typography>
                </View>
            </View>

            <View style={styles.priceContainer}>
                <Typography
                    variant="h3"
                    style={[styles.price, { color: details.color }]}
                >
                    {formatIndianPrice(price)}
                </Typography>
                <Typography variant="caption" color={COLORS.TEXT.LIGHT}>
                    Estimated cost
                </Typography>
            </View>
            {/* 
            <TouchableOpacity
                style={[
                    styles.viewDetailsButton,
                    isPopular && { backgroundColor: COLORS.primary },
                ]}
                activeOpacity={0.7}
            >
                <Typography
                    variant="bodySmall"
                    color={isPopular ? COLORS.WHITE : COLORS.primary}
                    style={styles.viewDetailsText}
                >
                    View Details
                </Typography>
                <CustomIcon
                    provider="Ionicons"
                    name="arrow-forward"
                    size={16}
                    color={isPopular ? COLORS.WHITE : COLORS.primary}
                />
            </TouchableOpacity> */}
        </Animated.View>
    );
};

export const InteriorCalculator: React.FC = () => {
    const navigation = useNavigation<any>();
    const flatListRef = useRef<FlatList>(null);
    const [currentStep, setCurrentStep] = useState(0);
    const [selectedBhk, setSelectedBhk] = useState<BhkType | null>(null);
    const [requirements, setRequirements] = useState<Record<string, number>>({
        kitchen: 1,
        wardrobe: 1,
        entertainmentUnit: 1,
        studyUnit: 1,
        crockeryUnit: 1,
    });

    const scrollToStep = (stepIndex: number) => {
        flatListRef.current?.scrollToIndex({
            index: stepIndex,
            animated: true,
        });
        setCurrentStep(stepIndex);
    };

    const handleClose = () => {
        navigation.goBack();
    };

    const handleBhkSelect = (bhkType: BhkType) => {
        setSelectedBhk(bhkType);
    };

    const handleStep1Continue = () => {
        if (selectedBhk) {
            scrollToStep(1);
        }
    };

    const handleIncrement = (itemId: string) => {
        if (!selectedBhk) return;
        const maxCount = getMaxCount(itemId, selectedBhk);
        setRequirements(prev => ({
            ...prev,
            [itemId]: Math.min((prev[itemId] || 0) + 1, maxCount),
        }));
    };

    const handleDecrement = (itemId: string) => {
        if (itemId === "kitchen") return;
        setRequirements(prev => ({
            ...prev,
            [itemId]: Math.max((prev[itemId] || 0) - 1, 0),
        }));
    };

    const handleStep2Continue = () => {
        if (selectedBhk) {
            const validation = validateRequirements(selectedBhk, requirements);
            if (validation.valid) {
                scrollToStep(2);
                saveCalculation();
            }
        }
    };

    const saveCalculation = async () => {
        if (!selectedBhk) return;
        try {
            const estimates = calculateAllEstimates(requirements);
            const result: CalculatorResult = {
                bhkType: selectedBhk,
                requirements,
                estimates,
                timestamp: Date.now(),
            };
            await AsyncStorage.setItem(
                CALCULATOR_STORAGE_KEY,
                JSON.stringify(result),
            );
        } catch (error) {
            console.error("Error saving calculation:", error);
        }
    };

    const handleBookConsultation = () => {
        navigation.goBack();
    };

    const handleRecalculate = () => {
        scrollToStep(0);
        setSelectedBhk(null);
        setRequirements({
            kitchen: 1,
            wardrobe: 1,
            entertainmentUnit: 1,
            studyUnit: 1,
            crockeryUnit: 1,
        });
    };

    const getRequirementSummary = () => {
        return REQUIREMENT_ITEMS.filter(
            item => requirements[item.id] && requirements[item.id] > 0,
        ).map(item => ({
            ...item,
            count: requirements[item.id],
        }));
    };

    const estimates = selectedBhk ? calculateAllEstimates(requirements) : null;

    // Step 1: BHK Selection
    const renderStep1 = () => (
        <View style={styles.stepContainer}>
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <Typography variant="h4" style={styles.title}>
                    Select Your Property Type
                </Typography>
                <Typography
                    variant="body"
                    color={COLORS.TEXT.LIGHT}
                    style={styles.description}
                >
                    Choose the configuration that matches your home
                </Typography>

                <View style={styles.optionsContainer}>
                    {BHK_OPTIONS.map(option => {
                        const isSelected = selectedBhk === option.value;

                        return (
                            <TouchableOpacity
                                key={option.value}
                                style={[
                                    styles.optionCard,
                                    isSelected && styles.optionCardSelected,
                                ]}
                                onPress={() => handleBhkSelect(option.value)}
                                activeOpacity={0.7}
                            >
                                <View
                                    style={[
                                        styles.iconCircle,
                                        isSelected && styles.iconCircleSelected,
                                    ]}
                                >
                                    <CustomIcon
                                        provider="Ionicons"
                                        name={option.icon}
                                        size={32}
                                        color={
                                            isSelected
                                                ? COLORS.WHITE
                                                : COLORS.primary
                                        }
                                    />
                                </View>

                                <View style={styles.optionContent}>
                                    <Typography
                                        variant="h5"
                                        color={
                                            isSelected
                                                ? COLORS.primary
                                                : COLORS.TEXT.DARK
                                        }
                                        style={styles.optionLabel}
                                    >
                                        {option.label}
                                    </Typography>
                                    <Typography
                                        variant="bodySmall"
                                        color={COLORS.TEXT.LIGHT}
                                        style={styles.optionDescription}
                                    >
                                        {option.description}
                                    </Typography>
                                </View>

                                {isSelected && (
                                    <View style={styles.checkmarkContainer}>
                                        <CustomIcon
                                            provider="Ionicons"
                                            name="checkmark-circle"
                                            size={28}
                                            color={COLORS.primary}
                                        />
                                    </View>
                                )}
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </ScrollView>

            <View style={styles.footer}>
                <Button
                    title="Continue"
                    onPress={handleStep1Continue}
                    disabled={!selectedBhk}
                    fullWidth
                    icon={
                        <CustomIcon
                            provider="Ionicons"
                            name="arrow-forward"
                            size={20}
                            color={COLORS.WHITE}
                        />
                    }
                    iconPosition="extreme-right"
                />
            </View>
        </View>
    );

    // Step 2: Requirements
    const renderStep2 = () => (
        <View style={styles.stepContainer}>
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {selectedBhk && (
                    <View style={styles.bhkBadge}>
                        <CustomIcon
                            provider="Ionicons"
                            name="home"
                            size={16}
                            color={COLORS.primary}
                        />
                        <Typography
                            variant="bodySmall"
                            color={COLORS.primary}
                            style={styles.bhkText}
                        >
                            {selectedBhk}
                        </Typography>
                    </View>
                )}

                <Typography variant="h4" style={styles.title}>
                    What do you need?
                </Typography>
                <Typography
                    variant="body"
                    color={COLORS.TEXT.LIGHT}
                    style={styles.description}
                >
                    Select the interior elements for your home
                </Typography>

                <View style={styles.requirementsContainer}>
                    {REQUIREMENT_ITEMS.map(item => (
                        <RequirementCounter
                            key={item.id}
                            label={item.label}
                            icon={item.icon}
                            count={requirements[item.id] || 0}
                            maxCount={
                                selectedBhk
                                    ? getMaxCount(item.id, selectedBhk)
                                    : item.maxCount
                            }
                            note={item.note}
                            onIncrement={() => handleIncrement(item.id)}
                            onDecrement={() => handleDecrement(item.id)}
                        />
                    ))}
                </View>

                <View style={styles.infoBox}>
                    <CustomIcon
                        provider="Ionicons"
                        name="information-circle"
                        size={20}
                        color={COLORS.primary}
                    />
                    <Typography
                        variant="caption"
                        color={COLORS.TEXT.DARK}
                        style={styles.infoText}
                    >
                        Kitchen is mandatory. Adjust other requirements as
                        needed for your {selectedBhk}.
                    </Typography>
                </View>
            </ScrollView>

            <View style={styles.footer}>
                <Button
                    title="Back"
                    onPress={() => scrollToStep(0)}
                    variant="outline"
                    style={styles.backButton}
                    icon={
                        <CustomIcon
                            provider="Ionicons"
                            name="arrow-back"
                            size={20}
                            color={COLORS.TEXT.DARK}
                        />
                    }
                    iconPosition="extreme-left"
                />
                <Button
                    title="Get Estimate"
                    onPress={handleStep2Continue}
                    style={styles.continueButton}
                    icon={
                        <CustomIcon
                            provider="Ionicons"
                            name="calculator"
                            size={20}
                            color={COLORS.WHITE}
                        />
                    }
                    iconPosition="extreme-right"
                />
            </View>
        </View>
    );

    // Step 3: Estimates
    const renderStep3 = () => (
        <View style={styles.stepContainer}>
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Summary Card */}
                <View style={styles.summaryCard}>
                    <View style={styles.summaryHeader}>
                        <CustomIcon
                            provider="Ionicons"
                            name="home"
                            size={20}
                            color={COLORS.primary}
                        />
                        <Typography
                            variant="body"
                            color={COLORS.TEXT.DARK}
                            style={styles.summaryTitle}
                        >
                            Your {selectedBhk} Requirements
                        </Typography>
                    </View>
                    <View style={styles.summaryContent}>
                        {getRequirementSummary().map(item => (
                            <View key={item.id} style={styles.summaryItem}>
                                <CustomIcon
                                    provider="Ionicons"
                                    name={item.icon}
                                    size={18}
                                    color={COLORS.GREY[400]}
                                />
                                <Typography
                                    variant="bodySmall"
                                    color={COLORS.TEXT.DARK}
                                    style={styles.summaryItemText}
                                >
                                    {item.label}
                                </Typography>
                                <View style={styles.summaryItemCount}>
                                    <Typography
                                        variant="bodySmall"
                                        color={COLORS.primary}
                                        style={styles.summaryCountText}
                                    >
                                        ×{item.count}
                                    </Typography>
                                </View>
                            </View>
                        ))}
                    </View>
                </View>

                <Typography variant="h4" style={styles.estimatesTitle}>
                    Choose Your Package
                </Typography>
                <Typography
                    variant="body"
                    color={COLORS.TEXT.LIGHT}
                    style={styles.estimatesDescription}
                >
                    Below are your estimates to book a free online consultation
                </Typography>

                {estimates && (
                    <View style={styles.packagesContainer}>
                        <PackageCard
                            packageType="essential"
                            price={estimates.essential}
                        />
                        <PackageCard
                            packageType="comfort"
                            price={estimates.comfort}
                            isPopular
                        />
                        <PackageCard
                            packageType="luxury"
                            price={estimates.luxury}
                        />
                    </View>
                )}

                <View style={styles.infoBox}>
                    <CustomIcon
                        provider="Ionicons"
                        name="information-circle"
                        size={20}
                        color={COLORS.primary}
                    />
                    <Typography
                        variant="caption"
                        color={COLORS.TEXT.DARK}
                        style={styles.infoText}
                    >
                        These are estimated costs. Final prices may vary based
                        on materials, design complexity, and site conditions.
                    </Typography>
                </View>
            </ScrollView>

            <View style={styles.footer}>
                <Button
                    title="Recalculate"
                    onPress={handleRecalculate}
                    variant="outline"
                    style={styles.backButton}
                    icon={
                        <CustomIcon
                            provider="Ionicons"
                            name="refresh"
                            size={20}
                            color={COLORS.TEXT.DARK}
                        />
                    }
                    iconPosition="extreme-left"
                />
                <Button
                    title="Continue"
                    onPress={handleBookConsultation}
                    style={styles.continueButton}
                />
            </View>
        </View>
    );

    const steps = [
        { key: "step1", component: renderStep1 },
        { key: "step2", component: renderStep2 },
        { key: "step3", component: renderStep3 },
    ];

    return (
        <SafeAreaView style={{ ...styles.container, paddingTop: 20 }}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={handleClose}
                    style={styles.closeButton}
                    activeOpacity={0.7}
                >
                    <CustomIcon
                        provider="Ionicons"
                        name="close"
                        size={28}
                        color={COLORS.TEXT.DARK}
                    />
                </TouchableOpacity>
                <Typography variant="h5" style={styles.headerTitle}>
                    Interior Calculator
                </Typography>
                <View style={{ width: 28 }} />
            </View>

            {/* Stepper */}
            <StepperProgress
                currentStep={currentStep}
                totalSteps={3}
                stepLabels={["Property", "Requirements", "Estimate"]}
            />

            {/* FlatList with steps */}
            <FlatList
                ref={flatListRef}
                data={steps}
                horizontal
                pagingEnabled
                scrollEnabled={false}
                showsHorizontalScrollIndicator={false}
                keyExtractor={item => item.key}
                renderItem={({ item }) => item.component()}
                getItemLayout={(data, index) => ({
                    length: SCREEN_WIDTH,
                    offset: SCREEN_WIDTH * index,
                    index,
                })}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.WHITE,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: spacingUtils.md,
        paddingVertical: spacingUtils.sm,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border.light,
    },
    closeButton: {
        padding: 4,
    },
    headerTitle: {
        fontWeight: "600",
    },
    stepContainer: {
        width: SCREEN_WIDTH,
        flex: 1,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: spacingUtils.md,
        paddingTop: spacingUtils.lg,
        paddingBottom: spacingUtils.xl,
    },
    title: {
        fontWeight: "700",
        marginBottom: spacingUtils.sm,
    },
    description: {
        marginBottom: spacingUtils.lg,
        lineHeight: 22,
    },
    // Step 1 styles
    optionsContainer: {
        gap: spacingUtils.md,
    },
    optionCard: {
        flexDirection: "row",
        alignItems: "center",
        padding: spacingUtils.md,
        borderRadius: 16,
        borderWidth: 2,
        borderColor: COLORS.border.light,
        backgroundColor: COLORS.WHITE,
        ...shadowUtils.getShadow("small"),
    },
    optionCardSelected: {
        borderColor: COLORS.primary,
        backgroundColor: COLORS.primaryLight,
    },
    iconCircle: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: COLORS.primaryLight,
        alignItems: "center",
        justifyContent: "center",
        marginRight: spacingUtils.md,
    },
    iconCircleSelected: {
        backgroundColor: COLORS.primary,
    },
    optionContent: {
        flex: 1,
    },
    optionLabel: {
        fontWeight: "600",
        marginBottom: 4,
    },
    optionDescription: {
        lineHeight: 18,
    },
    checkmarkContainer: {
        marginLeft: spacingUtils.sm,
    },
    // Step 2 styles
    bhkBadge: {
        flexDirection: "row",
        alignItems: "center",
        alignSelf: "flex-start",
        paddingHorizontal: 12,
        paddingVertical: 6,
        backgroundColor: COLORS.primaryLight,
        borderRadius: 20,
        marginBottom: spacingUtils.md,
        gap: 4,
    },
    bhkText: {
        fontWeight: "600",
    },
    requirementsContainer: {
        gap: spacingUtils.md,
        marginBottom: spacingUtils.lg,
    },
    requirementCard: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: spacingUtils.md,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: COLORS.border.light,
        backgroundColor: COLORS.WHITE,
        ...shadowUtils.getShadow("small"),
    },
    requirementLeft: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
    },
    requirementIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: COLORS.primaryLight,
        alignItems: "center",
        justifyContent: "center",
        marginRight: spacingUtils.sm,
    },
    requirementTextContainer: {
        flex: 1,
    },
    requirementLabelRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },
    requirementLabel: {
        fontWeight: "600",
    },
    requirementNote: {
        marginTop: 2,
        lineHeight: 14,
    },
    counterContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    counterButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: COLORS.primary,
        alignItems: "center",
        justifyContent: "center",
    },
    counterButtonDisabled: {
        backgroundColor: COLORS.GREY[200],
    },
    countDisplay: {
        minWidth: 32,
        alignItems: "center",
    },
    countText: {
        fontWeight: "700",
        fontSize: 18,
    },
    infoBox: {
        flexDirection: "row",
        alignItems: "flex-start",
        padding: spacingUtils.md,
        backgroundColor: COLORS.primaryLight,
        borderRadius: 12,
        gap: 10,
    },
    infoText: {
        flex: 1,
        lineHeight: 18,
    },
    // Step 3 styles
    summaryCard: {
        backgroundColor: COLORS.primaryLight,
        borderRadius: 16,
        padding: spacingUtils.md,
        marginBottom: spacingUtils.lg,
        borderWidth: 1,
        borderColor: COLORS.primary + "30",
    },
    summaryHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: spacingUtils.sm,
        gap: 8,
    },
    summaryTitle: {
        fontWeight: "600",
    },
    summaryContent: {
        gap: spacingUtils.sm,
    },
    summaryItem: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },
    summaryItemText: {
        flex: 1,
    },
    summaryItemCount: {
        backgroundColor: COLORS.WHITE,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    summaryCountText: {
        fontWeight: "600",
    },
    estimatesTitle: {
        fontWeight: "700",
        marginBottom: spacingUtils.sm,
    },
    estimatesDescription: {
        marginBottom: spacingUtils.lg,
        lineHeight: 22,
    },
    packagesContainer: {
        gap: spacingUtils.md,
        marginBottom: spacingUtils.lg,
    },
    packageCard: {
        padding: spacingUtils.md,
        borderRadius: 16,
        borderWidth: 2,
        borderColor: COLORS.border.light,
        backgroundColor: COLORS.WHITE,
        ...shadowUtils.getShadow("medium"),
        position: "relative",
    },
    packageCardPopular: {
        borderColor: COLORS.primary,
        borderWidth: 3,
    },
    popularBadge: {
        position: "absolute",
        top: -10,
        right: 16,
        backgroundColor: COLORS.RED[500],
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
        zIndex: 1,
    },
    popularText: {
        fontWeight: "700",
        fontSize: 12,
    },
    packageHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: spacingUtils.md,
    },
    packageIconContainer: {
        width: 56,
        height: 56,
        borderRadius: 28,
        alignItems: "center",
        justifyContent: "center",
        marginRight: spacingUtils.sm,
    },
    packageTitleContainer: {
        flex: 1,
    },
    packageTitle: {
        fontWeight: "700",
        marginBottom: 2,
    },
    packageDescription: {
        lineHeight: 16,
    },
    priceContainer: {
        alignItems: "center",
        paddingVertical: spacingUtils.md,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: COLORS.border.light,
        marginBottom: spacingUtils.md,
    },
    price: {
        fontWeight: "800",
        marginBottom: 4,
    },
    viewDetailsButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 12,
        borderRadius: 12,
        backgroundColor: COLORS.primaryLight,
        gap: 6,
    },
    viewDetailsText: {
        fontWeight: "600",
    },
    // Footer
    footer: {
        flexDirection: "row",
        padding: spacingUtils.md,
        borderTopWidth: 1,
        borderTopColor: COLORS.border.light,
        backgroundColor: COLORS.WHITE,
        gap: spacingUtils.sm,
    },
    backButton: {
        flex: 1,
    },
    continueButton: {
        flex: 1,
    },
});
