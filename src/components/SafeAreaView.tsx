import React from "react";
import { ViewStyle, View } from "react-native";
import { COLORS } from "../constants";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface SafeAreaViewProps {
    children: React.ReactNode;
    style?: ViewStyle;
    edges?: ("top" | "bottom" | "left" | "right")[];
    backgroundColor?: string;
}

export const SafeAreaView: React.FC<SafeAreaViewProps> = ({
    children,
    style,
    edges = ["top", "bottom", "left", "right"],
    backgroundColor = COLORS.WHITE,
}) => {
    const insets = useSafeAreaInsets();
    return (
        <View
            style={[
                {
                    flex: 1,
                    backgroundColor,
                    paddingTop: insets.top,
                    paddingBottom: insets.bottom,
                    paddingLeft: insets.left,
                    paddingRight: insets.right,
                },
                style,
            ]}
        >
            {children}
        </View>
    );
};
