import { TouchableOpacity, View, StyleSheet, Animated } from "react-native";
import { useState, useRef, useEffect } from "react";
import { LinearGradient } from "expo-linear-gradient";
import CustomIcon from "../../../components/CustomIcon";
import { Typography } from "../../../components/Typography";
import { COLORS } from "../../../constants";
import { useNavigation } from "@react-navigation/native";

export const LocationChip = ({ locationName = "Location" }) => {
    const [isPressed, setIsPressed] = useState(false);
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const pulseAnim = useRef(new Animated.Value(1)).current;

    const navigation = useNavigation<any>();

    useEffect(() => {
        // Subtle pulse animation for the location icon
        const pulseAnimation = Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1.15,
                    duration: 1500,
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 1500,
                    useNativeDriver: true,
                }),
            ]),
        );

        pulseAnimation.start();

        return () => {
            pulseAnimation.stop();
            pulseAnim.setValue(1);
        };
    }, []);

    const handlePressIn = () => {
        setIsPressed(true);
        Animated.spring(scaleAnim, {
            toValue: 0.95,
            useNativeDriver: true,
        }).start();
    };

    const handlePressOut = () => {
        setIsPressed(false);
        Animated.spring(scaleAnim, {
            toValue: 1,
            friction: 3,
            tension: 40,
            useNativeDriver: true,
        }).start();
    };

    return (
        <Animated.View
            style={[
                styles.container,
                {
                    transform: [{ scale: scaleAnim }],
                },
            ]}
        >
            <TouchableOpacity
                onPress={() => navigation.navigate("AllAddress")}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                activeOpacity={1}
                style={styles.touchable}
            >
                <LinearGradient
                    colors={[
                        isPressed
                            ? "rgba(255, 255, 255, 0.25)"
                            : "rgba(255, 255, 255, 0.15)",
                        isPressed
                            ? "rgba(255, 255, 255, 0.15)"
                            : "rgba(255, 255, 255, 0.08)",
                    ]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.gradient}
                >
                    {/* Backdrop blur effect simulation */}
                    <View style={styles.backdrop} />

                    <View style={styles.content}>
                        {/* Location icon with pulse animation */}
                        <Animated.View
                            style={[
                                styles.iconWrapper,
                                {
                                    transform: [{ scale: pulseAnim }],
                                },
                            ]}
                        >
                            <CustomIcon
                                provider="Ionicons"
                                name="location"
                                size={18}
                                color={COLORS.WHITE}
                            />
                        </Animated.View>

                        {/* Location name */}
                        <Typography
                            variant="h3"
                            color={COLORS.TEXT.DARK}
                            style={styles.locationText}
                        >
                            {locationName}
                        </Typography>

                        {/* Chevron icon */}
                        <View style={styles.chevronWrapper}>
                            <CustomIcon
                                provider="Ionicons"
                                name="chevron-down"
                                size={16}
                                color={COLORS.TEXT.DARK}
                            />
                        </View>
                    </View>

                    {/* Shine effect */}
                    <LinearGradient
                        colors={[
                            "rgba(255, 255, 255, 0)",
                            "rgba(255, 255, 255, 0.1)",
                            "rgba(255, 255, 255, 0)",
                        ]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.shine}
                    />
                </LinearGradient>

                {/* Border glow */}
                <View style={styles.borderGlow} />
            </TouchableOpacity>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: "relative",
    },
    touchable: {
        position: "relative",
        borderRadius: 20,
        overflow: "hidden",
    },
    gradient: {
        borderRadius: 20,
        paddingHorizontal: 12,
        paddingVertical: 8,
        position: "relative",
        overflow: "hidden",
    },
    backdrop: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.1)",
    },
    content: {
        flexDirection: "row",
        alignItems: "center",
        position: "relative",
        zIndex: 1,
    },
    iconWrapper: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: "rgba(255, 255, 255, 0.15)",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 6,
    },
    locationText: {
        marginLeft: 2,
        fontWeight: "600",
        fontSize: 15,
        letterSpacing: 0.2,
    },
    chevronWrapper: {
        marginLeft: 4,
        opacity: 0.8,
    },
    shine: {
        position: "absolute",
        top: 0,
        left: -100,
        right: -100,
        height: "100%",
        opacity: 0.5,
    },
    borderGlow: {
        position: "absolute",
        top: -1,
        left: -1,
        right: -1,
        bottom: -1,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.2)",
        zIndex: -1,
    },
});

// Usage in your component:
/*
<LocationChip 
    navigation={navigation} 
    locationName="Home" 
/>
*/
