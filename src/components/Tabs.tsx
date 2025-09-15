import {
    Animated,
    Dimensions,
    Easing,
    StyleSheet,
    TextStyle,
    TouchableOpacity,
    View,
} from "react-native";
import { useEffect, useRef } from "react";
import { Typography } from "./Typography";
import { COLORS } from "../constants";

const Tabs = ({
    tabOptions,
    currentTab,
    onTabPress,
    textStyle,
}: {
    tabOptions: { label: string; value: string }[];
    currentTab: string;
    onTabPress: (value: string) => void;
    textStyle?: TextStyle;
}) => {
    const animatedValue = useRef(new Animated.Value(0)).current;
    const tabWidth = (Dimensions.get("window").width - 32) / tabOptions.length;

    useEffect(() => {
        const tabIndex = tabOptions.findIndex(
            option => option.value === currentTab,
        );

        Animated.timing(animatedValue, {
            duration: 180,
            easing: Easing.linear,
            toValue: tabIndex,
            useNativeDriver: false,
        }).start();
    }, [currentTab]);

    return (
        <View style={styles.container}>
            {/* Tabs */}
            <Animated.View
                style={[
                    styles.indicator,
                    {
                        width: tabWidth,
                    },
                    {
                        transform: [
                            {
                                translateX: animatedValue.interpolate({
                                    inputRange: tabOptions.map((_, i) => i),
                                    outputRange: tabOptions.map(
                                        (_, i) => i * tabWidth,
                                    ),
                                }),
                            },
                        ],
                    },
                ]}
            />
            {tabOptions.map(option => (
                <TouchableOpacity
                    style={styles.tab}
                    key={option.value}
                    onPress={() => {
                        onTabPress(option.value);
                    }}
                >
                    <Typography variant="body" style={textStyle}>
                        {option.label}
                    </Typography>
                </TouchableOpacity>
            ))}
        </View>
    );
};

export default Tabs;

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        marginHorizontal: 16,
        position: "relative",
        height: 40,
    },
    tab: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    indicator: {
        backgroundColor: COLORS.primaryLight,
        position: "absolute",
        top: 0,
        bottom: 0,
        borderRadius: 8,
    },
});
