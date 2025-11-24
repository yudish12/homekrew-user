import React from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { CustomIcon } from "../../components/CustomIcon";
import { Typography } from "../../components/Typography";
import { Button } from "../../components/Button";
import { COLORS } from "../../constants/ui";
import { spacingUtils, borderRadiusUtils } from "../../utils/ui";

interface ProductsComingSoonProps {
    title?: string;
    description?: string;
    buttonLabel?: string;
    onButtonPress?: () => void;
    style?: ViewStyle;
    iconName?: string;
}

export const ProductsComingSoon: React.FC<ProductsComingSoonProps> = ({
    title = "Products coming soon",
    description = "We are curating the best items for you. Meanwhile, explore other experiences on HomeKrew.",
    buttonLabel,
    onButtonPress,
    style,
    iconName = "cube",
}) => {
    return (
        <View style={[styles.wrapper, style]}>
            <LinearGradient
                colors={["#EEF2FF", "#F8FBFF"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradient}
            >
                <View style={styles.badge}>
                    <CustomIcon
                        provider="Ionicons"
                        name={iconName as any}
                        size={32}
                        color={COLORS.primary}
                    />
                </View>
                <Typography
                    variant="h3"
                    color={COLORS.TEXT.DARK}
                    style={styles.title}
                >
                    {title}
                </Typography>
                <Typography
                    variant="body"
                    color={COLORS.GREY[500]}
                    style={styles.description}
                >
                    {description}
                </Typography>
                {buttonLabel && onButtonPress ? (
                    <Button
                        title={buttonLabel}
                        onPress={onButtonPress}
                        fullWidth
                        style={styles.button}
                    />
                ) : null}
            </LinearGradient>
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        width: "100%",
        paddingHorizontal: spacingUtils.lg,
    },
    gradient: {
        borderRadius: borderRadiusUtils.xl,
        padding: spacingUtils.xl,
        alignItems: "center",
        justifyContent: "center",
        gap: spacingUtils.md,
    },
    badge: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: COLORS.WHITE,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 16,
        elevation: 4,
    },
    title: {
        textAlign: "center",
        marginTop: spacingUtils.md,
    },
    description: {
        textAlign: "center",
        lineHeight: 24,
    },
    button: {
        marginTop: spacingUtils.md,
    },
});

export default ProductsComingSoon;
