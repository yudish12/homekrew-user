import React from "react";
import { StyleProp, ViewStyle } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Feather from "@expo/vector-icons/Feather";
import AntDesign from "@expo/vector-icons/AntDesign";
import Entypo from "@expo/vector-icons/Entypo";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import Foundation from "@expo/vector-icons/Foundation";
import Octicons from "@expo/vector-icons/Octicons";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import Zocial from "@expo/vector-icons/Zocial";

type IconProvider =
    | "Ionicons"
    | "MaterialIcons"
    | "MaterialCommunityIcons"
    | "FontAwesome"
    | "FontAwesome5"
    | "Feather"
    | "AntDesign"
    | "Entypo"
    | "EvilIcons"
    | "Foundation"
    | "Octicons"
    | "SimpleLineIcons"
    | "Zocial";

interface CustomIconProps {
    provider: IconProvider;
    name: string;
    size?: number;
    color?: string;
    style?: StyleProp<ViewStyle>;
}

const iconProviders = {
    Ionicons,
    MaterialIcons,
    MaterialCommunityIcons,
    FontAwesome,
    FontAwesome5,
    Feather,
    AntDesign,
    Entypo,
    EvilIcons,
    Foundation,
    Octicons,
    SimpleLineIcons,
    Zocial,
};

export const CustomIcon: React.FC<CustomIconProps> = ({
    provider,
    name,
    size = 24,
    color = "black",
    style,
}) => {
    const IconComponent = iconProviders[provider];

    if (!IconComponent) {
        console.warn(`Icon provider "${provider}" not found`);
        return null;
    }

    return (
        <IconComponent
            name={name as any}
            size={size}
            color={color}
            style={style}
        />
    );
};

export default CustomIcon;
