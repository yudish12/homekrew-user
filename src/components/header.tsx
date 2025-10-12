import React from "react";
import {
    StyleProp,
    StyleSheet,
    View,
    ViewStyle,
    Platform,
    TextStyle,
} from "react-native";
import { BackButton } from "./BackButton";
import { Typography } from "./Typography";
import { COLORS } from "../constants/ui";

interface HeaderProps {
    title: string;
    backButton?: boolean;
    style?: StyleProp<ViewStyle>;
    backButtonStyle?: StyleProp<ViewStyle>;
    backHandler?: () => void;
    showLogo?: boolean;
    titleStyle?: StyleProp<TextStyle>;
}

const Header: React.FC<HeaderProps> = ({
    title,
    backButton = false,
    style,
    backButtonStyle,
    backHandler,
    showLogo = false,
    titleStyle,
}) => {
    return (
        <View style={[styles.header, style]}>
            {backButton && (
                <BackButton
                    backButtonStyle={backButtonStyle}
                    onPress={backHandler || (() => {})}
                />
            )}
            <View style={styles.titleContainer}>
                {showLogo && (
                    <View style={styles.logoContainer}>
                        <Typography variant="h3" style={[styles.logoText]}>
                            HomeKrew
                        </Typography>
                    </View>
                )}
                <Typography
                    style={[
                        styles.title,
                        {
                            marginTop: showLogo ? 4 : 0,
                            textAlign: "center",
                        },
                        titleStyle,
                    ]}
                    variant="thinHeading"
                    color={COLORS.TEXT.DARK}
                >
                    {title}
                </Typography>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: Platform.OS === "ios" ? 16 : 12,
        backgroundColor: COLORS.WHITE,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.GREY[100],
        shadowColor: COLORS.TEXT.DARK,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    titleContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        marginHorizontal: "auto",
        backgroundColor: "white",
    },
    title: {
        textAlign: "center",
    },
    logoContainer: {
        marginBottom: 4,
    },
    logoText: {
        color: COLORS.primary,
        fontWeight: "600",
    },
});

export default Header;
