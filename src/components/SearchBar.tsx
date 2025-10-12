import React from "react";
import {
    View,
    TextInput,
    StyleSheet,
    ViewStyle,
    TextStyle,
    TouchableOpacity,
} from "react-native";
import { COLORS } from "../constants/ui";
import { CustomIcon } from "./CustomIcon";
import { ServiceCategory } from "../types/home-data";
import { useNavigation } from "@react-navigation/native";
import { Body, BodySmall, Caption } from "./Typography";

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
    const navigation = useNavigation<any>();
    return (
        <TouchableOpacity
            onPress={() => navigation.navigate("SearchScreen")}
            style={[styles.container, containerStyle]}
        >
            <View style={styles.iconWrap}>
                <CustomIcon
                    provider="Ionicons"
                    name="search"
                    size={20}
                    color={COLORS.GREY[400]}
                />
            </View>
            <TouchableOpacity
                onPress={() => navigation.navigate("SearchScreen")}
                style={[styles.input, inputStyle]}
            >
                <BodySmall color={COLORS.GREY[400]}>{placeholder}</BodySmall>
            </TouchableOpacity>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
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
