import React, { useEffect, useState } from "react";
import { View, StyleSheet, Animated, Dimensions, Image } from "react-native";
import { SafeAreaView } from "./SafeAreaView";
import { COLORS } from "../constants/ui";

interface SplashScreenProps {
    onFinish: () => void;
    isAuthenticated: boolean;
    isLoading: boolean;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
    onFinish,
    isAuthenticated,
    isLoading,
}) => {
    const fadeAnim = useState(new Animated.Value(0))[0];
    const scaleAnim = useState(new Animated.Value(0.8))[0];
    const glowAnim = useState(new Animated.Value(0.3))[0];
    const pulseAnim = useState(new Animated.Value(1))[0];
    const loadingScaleAnim = useState(new Animated.Value(1))[0];

    useEffect(() => {
        // Initial fade in animation
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                tension: 50,
                friction: 7,
                useNativeDriver: true,
            }),
        ]).start();

        // Continuous glow animation
        Animated.loop(
            Animated.sequence([
                Animated.timing(glowAnim, {
                    toValue: 0.6,
                    duration: 2000,
                    useNativeDriver: true,
                }),
                Animated.timing(glowAnim, {
                    toValue: 0.2,
                    duration: 2000,
                    useNativeDriver: true,
                }),
            ]),
        ).start();

        // Subtle pulse animation for the logo
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1.03,
                    duration: 3000,
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 3000,
                    useNativeDriver: true,
                }),
            ]),
        ).start();
    }, []);

    // Loading scale animation
    useEffect(() => {
        if (isLoading) {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(loadingScaleAnim, {
                        toValue: 1.1,
                        duration: 1000,
                        useNativeDriver: true,
                    }),
                    Animated.timing(loadingScaleAnim, {
                        toValue: 1,
                        duration: 1000,
                        useNativeDriver: true,
                    }),
                ]),
            ).start();
        } else {
            loadingScaleAnim.stopAnimation();
            loadingScaleAnim.setValue(1);
        }
    }, [isLoading]);

    useEffect(() => {
        // When loading is complete, finish splash after a delay
        if (!isLoading) {
            setTimeout(() => {
                Animated.parallel([
                    Animated.timing(fadeAnim, {
                        toValue: 0,
                        duration: 800,
                        useNativeDriver: true,
                    }),
                    Animated.timing(scaleAnim, {
                        toValue: 0.8,
                        duration: 800,
                        useNativeDriver: true,
                    }),
                ]).start(() => {
                    onFinish();
                });
            }, 2000);
        }
    }, [isLoading, onFinish]);

    return (
        <SafeAreaView style={styles.container}>
            <Animated.View
                style={[
                    styles.content,
                    {
                        opacity: fadeAnim,
                    },
                ]}
            >
                {/* White Circle with Bluish Shadow */}
                <Animated.View
                    style={[
                        styles.circleContainer,
                        {
                            opacity: glowAnim,
                            transform: [
                                {
                                    scale: isLoading
                                        ? loadingScaleAnim
                                        : scaleAnim,
                                },
                            ],
                        },
                    ]}
                />

                {/* Logo */}
                <Animated.View
                    style={[
                        styles.logoContainer,
                        {
                            transform: [
                                {
                                    scale: Animated.multiply(
                                        scaleAnim,
                                        pulseAnim,
                                    ),
                                },
                            ],
                        },
                    ]}
                >
                    <Image
                        source={require("../../assets/homekrew-splash-logo.png")}
                        style={styles.logoImage}
                        resizeMode="contain"
                    />
                </Animated.View>
            </Animated.View>
        </SafeAreaView>
    );
};

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.WHITE,
        justifyContent: "center",
        alignItems: "center",
    },
    content: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
    },
    circleContainer: {
        position: "absolute",
        width: 280,
        height: 280,
        borderRadius: 140,
        backgroundColor: COLORS.WHITE,
        shadowColor: COLORS.primary,
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0.3,
        shadowRadius: 30,
        elevation: 8,
    },
    logoContainer: {
        width: 200,
        height: 200,
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1,
    },
    logoImage: {
        width: 220,
        height: 220,
    },
});
