import React from "react";
import { ViewStyle } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "../constants";

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
    return (
        <RNSafeAreaView
            style={[{ flex: 1, backgroundColor }, style]}
            edges={edges}
        >
            {children}
        </RNSafeAreaView>
    );
};
