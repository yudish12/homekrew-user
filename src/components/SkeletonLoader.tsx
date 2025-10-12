import React, { useEffect, useMemo, useRef } from "react";
import { Animated, StyleSheet, View, ViewStyle } from "react-native";
import { COLORS } from "../constants/ui";

export interface SkeletonLayoutItem {
    width?: number | `${number}%` | "auto";
    height: number;
    borderRadius?: number;
    style?: ViewStyle;
}

export interface SkeletonLoaderProps {
    items?: number;
    containerStyle?: ViewStyle;
    itemContainerStyle?: ViewStyle;
    layout?: SkeletonLayoutItem[];
    pulseDurationMs?: number;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
    items = 1,
    containerStyle,
    itemContainerStyle,
    layout = [{ width: "100%", height: 16, borderRadius: 8 }],
    pulseDurationMs = 1200,
}) => {
    const animated = useRef(new Animated.Value(0.6)).current;

    useEffect(() => {
        const loop = Animated.loop(
            Animated.sequence([
                Animated.timing(animated, {
                    toValue: 1,
                    duration: pulseDurationMs,
                    useNativeDriver: true,
                }),
                Animated.timing(animated, {
                    toValue: 0.6,
                    duration: pulseDurationMs,
                    useNativeDriver: true,
                }),
            ]),
        );
        loop.start();
        return () => loop.stop();
    }, [animated, pulseDurationMs]);

    const placeholders = useMemo(() => Array.from({ length: items }), [items]);

    return (
        <View style={[styles.container, containerStyle]}>
            {placeholders.map((_, idx) => (
                <View
                    key={idx}
                    style={[styles.itemContainer, itemContainerStyle]}
                >
                    {layout.map((block, jdx) => (
                        <Animated.View
                            key={jdx}
                            style={[
                                styles.block,
                                {
                                    width: block.width ?? "100%",
                                    height: block.height,
                                    borderRadius: block.borderRadius ?? 8,
                                    opacity: animated,
                                },
                                block.style,
                            ]}
                        />
                    ))}
                </View>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
    },
    itemContainer: {
        backgroundColor: "transparent",
        borderRadius: 12,
        borderWidth: 0,
        padding: 0,
        marginBottom: 16,
    },
    block: {
        backgroundColor: COLORS.primaryLight, // Changed from GREY[200] to primaryLight
        marginBottom: 8,
    },
});

export default SkeletonLoader;
