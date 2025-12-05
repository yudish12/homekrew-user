import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Animated, Easing } from "react-native";
import { COLORS } from "../constants/ui";
import { Typography } from "./Typography";
import { CustomIcon } from "./CustomIcon";

interface StepperProgressProps {
    currentStep: number;
    totalSteps: number;
    stepLabels?: string[];
}

export const StepperProgress: React.FC<StepperProgressProps> = ({
    currentStep,
    totalSteps,
    stepLabels = [],
}) => {
    const animatedValues = useRef(
        Array.from({ length: totalSteps }, () => new Animated.Value(0)),
    ).current;

    useEffect(() => {
        // Animate completed steps
        animatedValues.forEach((anim, index) => {
            if (index < currentStep) {
                Animated.timing(anim, {
                    toValue: 1,
                    duration: 300,
                    easing: Easing.out(Easing.cubic),
                    useNativeDriver: false,
                }).start();
            } else {
                Animated.timing(anim, {
                    toValue: 0,
                    duration: 200,
                    useNativeDriver: false,
                }).start();
            }
        });
    }, [currentStep]);

    const renderStep = (stepIndex: number) => {
        const isCompleted = stepIndex < currentStep;
        const isCurrent = stepIndex === currentStep;
        const stepNumber = stepIndex + 1;

        const animatedValue = animatedValues[stepIndex];
        const backgroundColor = animatedValue.interpolate({
            inputRange: [0, 1],
            outputRange: [COLORS.GREY[200], COLORS.primary],
        });

        const scale = animatedValue.interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: [1, 1.1, 1],
        });

        // Calculate position: first at left, middle at center, last at right
        let circlePosition: "left" | "center" | "right";
        if (stepIndex === 0) {
            circlePosition = "left";
        } else if (stepIndex === totalSteps - 1) {
            circlePosition = "right";
        } else {
            circlePosition = "center";
        }

        return (
            <View
                key={stepIndex}
                style={[
                    styles.stepWrapper,
                    circlePosition === "left" && styles.stepWrapperLeft,
                    circlePosition === "center" && styles.stepWrapperCenter,
                    circlePosition === "right" && styles.stepWrapperRight,
                ]}
            >
                <Animated.View
                    style={[
                        styles.stepCircle,
                        {
                            backgroundColor: isCurrent
                                ? COLORS.primary
                                : backgroundColor,
                            transform: [{ scale }],
                            borderWidth: isCurrent ? 3 : 0,
                            borderColor: COLORS.primaryLight,
                        },
                    ]}
                >
                    {isCompleted ? (
                        <CustomIcon
                            provider="Ionicons"
                            name="checkmark"
                            size={20}
                            color={COLORS.WHITE}
                        />
                    ) : (
                        <Typography
                            variant="bodySmall"
                            color={isCurrent ? COLORS.WHITE : COLORS.TEXT.DARK}
                            style={styles.stepNumber}
                        >
                            {stepNumber}
                        </Typography>
                    )}
                </Animated.View>

                {stepLabels[stepIndex] && (
                    <Typography
                        variant="caption"
                        color={
                            isCurrent || isCompleted
                                ? COLORS.TEXT.DARK
                                : COLORS.GREY[400]
                        }
                        style={styles.stepLabel}
                    >
                        {stepLabels[stepIndex]}
                    </Typography>
                )}
            </View>
        );
    };

    // Render connecting lines between steps
    const renderConnectingLines = () => {
        const lines = [];
        for (let i = 0; i < totalSteps - 1; i++) {
            const animatedValue = animatedValues[i];
            const lineColor = animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [COLORS.GREY[200], COLORS.primary],
            });

            lines.push(
                <Animated.View
                    key={`line-${i}`}
                    style={[
                        styles.connectingLine,
                        {
                            backgroundColor: lineColor,
                        },
                    ]}
                />,
            );
        }
        return lines;
    };

    return (
        <View style={styles.container}>
            <View style={styles.stepsRow}>
                {/* Background line that spans full width */}
                <View style={styles.backgroundLine} />

                {/* Connecting lines between steps */}
                <View style={styles.linesContainer}>
                    {renderConnectingLines()}
                </View>

                {/* Step circles positioned absolutely */}
                {Array.from({ length: totalSteps }, (_, i) => renderStep(i))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: "100%",
        paddingVertical: 20,
        paddingHorizontal: 16,
    },
    stepsRow: {
        position: "relative",
        width: "100%",
        minHeight: 60,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    backgroundLine: {
        position: "absolute",
        top: 20, // Half of circle height (40/2)
        left: 20, // Half of first circle (40/2)
        right: 20, // Half of last circle (40/2)
        height: 3,
        backgroundColor: COLORS.GREY[200],
        zIndex: 0,
    },
    linesContainer: {
        position: "absolute",
        top: 20,
        left: 20,
        right: 20,
        height: 3,
        flexDirection: "row",
        zIndex: 1,
    },
    connectingLine: {
        flex: 1,
        height: 3,
    },
    stepWrapper: {
        alignItems: "center",
        zIndex: 2,
    },
    stepWrapperLeft: {},
    stepWrapperCenter: {},
    stepWrapperRight: {},
    stepCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center",
        zIndex: 2,
    },
    stepNumber: {
        fontWeight: "600",
    },
    stepLabel: {
        marginTop: 8,
        textAlign: "center",
        fontSize: 11,
        fontWeight: "500",
        flexWrap: "wrap",
        maxWidth: 80,
    },
});
