import { ReactNode, useEffect, useMemo, useRef } from "react";
import {
    Animated,
    Dimensions,
    Pressable,
    StyleSheet,
    View,
    ViewStyle,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";

interface BottomSheetProps {
    visible: boolean;
    onClose: () => void;
    height?: number; // absolute height in px; defaults to 60% of screen
    enableBackdropDismiss?: boolean;
    children?: ReactNode;
    styleProps?: ViewStyle;
}

const SCREEN_HEIGHT = Dimensions.get("window").height;

const BottomSheet = ({
    visible,
    onClose,
    height,
    enableBackdropDismiss = true,
    children,
    styleProps,
}: BottomSheetProps) => {
    const sheetHeight = useMemo(
        () => height ?? Math.floor(SCREEN_HEIGHT * 0.6),
        [height],
    );

    const translateY = useRef(new Animated.Value(sheetHeight)).current;
    const backdropOpacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (visible) {
            Animated.parallel([
                Animated.timing(translateY, {
                    toValue: 0,
                    duration: 220,
                    useNativeDriver: true,
                }),
                Animated.timing(backdropOpacity, {
                    toValue: 1,
                    duration: 220,
                    useNativeDriver: true,
                }),
            ]).start();
        } else {
            Animated.parallel([
                Animated.timing(translateY, {
                    toValue: sheetHeight,
                    duration: 220,
                    useNativeDriver: true,
                }),
                Animated.timing(backdropOpacity, {
                    toValue: 0,
                    duration: 220,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    }, [visible, sheetHeight, translateY, backdropOpacity]);

    const panGesture = Gesture.Pan()
        .onStart(() => {
            // no-op, we animate using onUpdate
        })
        .onUpdate(({ translationY }) => {
            if (translationY > 0) {
                translateY.setValue(translationY);
            }
        })
        .onEnd(({ velocityY, translationY }) => {
            const shouldClose =
                velocityY > 800 || translationY > sheetHeight * 0.25;
            if (shouldClose) {
                Animated.parallel([
                    Animated.timing(translateY, {
                        toValue: sheetHeight,
                        duration: 200,
                        useNativeDriver: true,
                    }),
                    Animated.timing(backdropOpacity, {
                        toValue: 0,
                        duration: 200,
                        useNativeDriver: true,
                    }),
                ]).start(() => onClose());
            } else {
                Animated.spring(translateY, {
                    toValue: 0,
                    bounciness: 0,
                    useNativeDriver: true,
                }).start();
            }
        });

    if (!visible) return null;

    return (
        <View
            style={[StyleSheet.absoluteFill, styleProps]}
            pointerEvents="box-none"
        >
            <Pressable
                style={StyleSheet.absoluteFill}
                onPress={enableBackdropDismiss ? onClose : undefined}
            >
                <Animated.View
                    pointerEvents="none"
                    style={[styles.backdrop, { opacity: backdropOpacity }]}
                />
            </Pressable>

            <GestureDetector gesture={panGesture}>
                <Animated.View
                    style={[
                        styles.container,
                        {
                            height: sheetHeight,
                            transform: [{ translateY }],
                        },
                        styleProps,
                    ]}
                >
                    <View style={styles.handleWrap}>
                        <View style={styles.handle} />
                    </View>
                    {children}
                </Animated.View>
            </GestureDetector>
        </View>
    );
};

export default BottomSheet;

const styles = StyleSheet.create({
    backdrop: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.4)",
    },
    container: {
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "white",
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        paddingBottom: 24,
        paddingHorizontal: 16,
        paddingTop: 8,
        shadowColor: "#000",
        shadowOpacity: 0.12,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: -4 },
        elevation: 8,
    },
    handleWrap: {
        alignItems: "center",
        paddingVertical: 8,
    },
    handle: {
        width: 44,
        height: 5,
        borderRadius: 999,
        backgroundColor: "#E5E7EB",
    },
});
