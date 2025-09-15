import React from "react";
import {
    View,
    TextInput,
    StyleSheet,
    ViewStyle,
    TextStyle,
} from "react-native";
import { COLORS } from "../constants/ui";
import { CustomIcon } from "./CustomIcon";
import { Typography } from "./Typography";

interface SearchBarProps {
    value: string;
    onChangeText: (text: string) => void;
    placeholder?: string;
    containerStyle?: ViewStyle;
    inputStyle?: TextStyle;
}

const SearchBar: React.FC<SearchBarProps> = ({
    value,
    onChangeText,
    placeholder = "Search",
    containerStyle,
    inputStyle,
}) => {
    return (
        <View style={[styles.container, containerStyle]}>
            <View style={styles.iconWrap}>
                <CustomIcon
                    provider="Ionicons"
                    name="search"
                    size={20}
                    color={COLORS.GREY[400]}
                />
            </View>
            <TextInput
                style={[styles.input, inputStyle]}
                placeholder={placeholder}
                placeholderTextColor={COLORS.GREY[400]}
                value={value}
                onChangeText={onChangeText}
                returnKeyType="search"
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: COLORS.WHITE,
        borderRadius: 16,
        height: 48,
        paddingHorizontal: 12,
        borderWidth: 1,
        borderColor: COLORS.GREY[100],
        shadowColor: COLORS.TEXT.DARK,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 2,
    },
    iconWrap: {
        width: 32,
        alignItems: "center",
        justifyContent: "center",
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: COLORS.TEXT.DARK,
    },
});

export default SearchBar;
