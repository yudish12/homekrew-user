import React from "react";
import {
    StyleSheet,
    TouchableOpacity,
    View,
    Platform,
    ViewStyle,
    StyleProp,
} from "react-native";
import { CustomIcon } from "./CustomIcon";
import { COLORS } from "../constants/ui";

interface BackButtonProps {
    onPress: () => void;
    backButtonStyle?: StyleProp<ViewStyle>;
    color?: string;
    size?: number;
}

export const BackButton: React.FC<BackButtonProps> = ({
    onPress,
    backButtonStyle,
    color = COLORS.TEXT.DARK,
    size = 24,
}) => {
    return (
        <View style={[styles.container, backButtonStyle]}>
            <TouchableOpacity
                onPress={onPress}
                style={styles.touchable}
                activeOpacity={0.7}
            >
                <CustomIcon
                    provider="Ionicons"
                    name="arrow-back"
                    size={size}
                    color={color}
                />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        left: 0,
        top: 0,
        zIndex: 10,
    },
    touchable: {
        padding: Platform.OS === "ios" ? 14 : 12,
    },
});
