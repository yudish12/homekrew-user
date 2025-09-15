import React from "react";
import { TouchableOpacity, View, StyleSheet, ViewStyle } from "react-native";
import { COLORS } from "../constants/ui";

interface RadioButtonProps {
    selected: boolean;
    onPress: () => void;
    size?: number;
    color?: string;
    selectedColor?: string;
    style?: ViewStyle;
}

export const RadioButton: React.FC<RadioButtonProps> = ({
    selected,
    onPress,
    size = 20,
    color = COLORS.GREY[400],
    selectedColor = COLORS.primary,
    style,
}) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            style={[styles.container, { width: size, height: size }, style]}
            activeOpacity={0.7}
        >
            <View
                style={[
                    styles.outerCircle,
                    {
                        width: size,
                        height: size,
                        borderColor: selected ? selectedColor : color,
                    },
                ]}
            >
                {selected && (
                    <View
                        style={[
                            styles.innerCircle,
                            {
                                width: size * 0.5,
                                height: size * 0.5,
                                backgroundColor: selectedColor,
                            },
                        ]}
                    />
                )}
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: "center",
        alignItems: "center",
    },
    outerCircle: {
        borderRadius: 50,
        borderWidth: 2,
        justifyContent: "center",
        alignItems: "center",
    },
    innerCircle: {
        borderRadius: 50,
    },
});

export default RadioButton;
