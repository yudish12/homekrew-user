import React from "react";
import {
    View,
    StyleSheet,
    Image,
    TouchableOpacity,
    ViewStyle,
    Text,
} from "react-native";
import { COLORS, WEIGHTS } from "../../../constants/ui";
import { Typography } from "../../../components/Typography";
import { CustomIcon } from "../../../components/CustomIcon";
import { fontFamily } from "../../../lib";

export interface ServiceCardProps {
    image?: string;
    title: string;
    provider: string;
    originalPrice?: string;
    maxPrice?: string;
    discountedPrice?: string;
    rating?: number;
    buttonText?: string;
    showPrice?: boolean;
    buttonIconName?: string;
    onPress?: () => void;
    onAddPress?: () => void;
    style?: ViewStyle;
}

// Use a better visual placeholder from assets
const placeholderImage = require("../../../../assets/splash-icon.png");

const ServiceCard: React.FC<ServiceCardProps> = ({
    image,
    title,
    provider,
    originalPrice,
    maxPrice,
    discountedPrice,
    showPrice = false,
    rating = 0,
    onPress,
    onAddPress,
    buttonText,
    buttonIconName,
    style,
}) => {
    return (
        <TouchableOpacity
            style={[styles.card, style]}
            activeOpacity={0.9}
            onPress={onPress}
        >
            <View style={styles.imageWrap}>
                <Image
                    source={{ uri: image }}
                    style={styles.image}
                    resizeMode="cover"
                />
            </View>

            <View style={styles.content}>
                <View style={styles.info}>
                    <Typography
                        variant="body"
                        color={COLORS.TEXT.DARK}
                        numberOfLines={2}
                        style={styles.title}
                    >
                        {title}
                    </Typography>

                    <Typography
                        variant="caption"
                        numberOfLines={1}
                        color={COLORS.GREY[500]}
                        style={styles.provider}
                    >
                        {provider}
                    </Typography>

                    {showPrice && (
                        <View style={styles.pricingRow}>
                            {maxPrice && (
                                <Text style={styles.maxPrice}>{maxPrice}</Text>
                            )}
                            <Text style={styles.basePrice}>
                                {originalPrice}
                            </Text>
                        </View>
                    )}
                </View>

                <TouchableOpacity
                    style={styles.addButton}
                    onPress={onAddPress}
                    activeOpacity={0.8}
                >
                    <CustomIcon
                        provider="Ionicons"
                        name={buttonIconName ?? "eye-outline"}
                        size={14}
                        color={COLORS.WHITE}
                    />
                    <Typography
                        variant="caption"
                        color={COLORS.WHITE}
                        style={styles.addButtonText}
                    >
                        {buttonText ?? "View"}
                    </Typography>
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        flexDirection: "row",
        backgroundColor: COLORS.WHITE,
        borderRadius: 12,
        marginBottom: 12,
        shadowColor: COLORS.TEXT.DARK,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 2,
        borderWidth: 1,
        borderColor: COLORS.GREY[100],
        overflow: "hidden",
        minHeight: 90,
    },
    imageWrap: {
        width: 80,
        height: 90,
        backgroundColor: COLORS.GREY[200],
    },
    image: {
        width: 80,
        height: 90,
    },
    content: {
        flex: 1,
        flexDirection: "row",
        padding: 12,
        justifyContent: "space-between",
        alignItems: "center",
    },
    info: {
        flex: 1,
        justifyContent: "center",
        gap: 2,
    },
    title: {
        fontWeight: WEIGHTS.SEMI_BOLD,
        fontSize: 14,
        lineHeight: 18,
    },
    provider: {
        fontSize: 12,
        lineHeight: 16,
        marginTop: 2,
    },
    pricingRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        marginTop: 6,
    },
    maxPrice: {
        fontSize: 12,
        color: COLORS.GREY[400],
        textDecorationLine: "line-through",
        textDecorationStyle: "solid",
        fontFamily: fontFamily.medium,
    },
    basePrice: {
        fontSize: 14,
        fontFamily: fontFamily.semiBold,
        color: COLORS.GREY[500],
    },
    originalPrice: {
        fontSize: 11,
    },
    priceText: {
        fontFamily: fontFamily.semiBold,
        fontSize: 12,
    },
    discountedPrice: {
        fontWeight: WEIGHTS.BOLD,
        fontSize: 14,
    },
    addButton: {
        backgroundColor: COLORS.primary,
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 16,
        gap: 4,
        alignSelf: "flex-start",
    },
    addButtonText: {
        color: COLORS.WHITE,
        fontSize: 12,
        fontWeight: WEIGHTS.MEDIUM,
    },
});

export default ServiceCard;
