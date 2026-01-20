import React from "react";
import { View, StyleSheet, Image, TouchableOpacity, Text } from "react-native";
import { COLORS, WEIGHTS } from "../../../constants/ui";
import { Typography } from "../../../components/Typography";
import { CustomIcon } from "../../../components/CustomIcon";
import { fontFamily } from "../../../lib";

export interface ServiceDetailCardProps {
    image?: string;
    title: string;
    rating?: number;
    reviewCount?: number;
    basePrice?: string;
    originalPrice?: string;
    duration?: string;
    pricePerUnit?: string;
    packBadge?: string;
    description?: string;
    onPress?: () => void;
    onAddPress?: () => void;
}

const ServiceDetailCard: React.FC<ServiceDetailCardProps> = ({
    image,
    title,
    rating = 4.77,
    reviewCount = 0,
    basePrice,
    description,
    originalPrice,
    duration,
    pricePerUnit,
    packBadge,
    onPress,
    onAddPress,
}) => {
    const formatReviewCount = (count: number) => {
        if (count > 1000000) {
            return `${(count / 1000000).toFixed(1)}M`;
        }
        return count.toLocaleString();
    };

    return (
        <TouchableOpacity
            style={styles.card}
            activeOpacity={0.9}
            onPress={onPress}
        >
            <View style={styles.cardHeader}>
                <View style={styles.titleRow}>
                    <Typography
                        variant="body"
                        color={COLORS.TEXT.DARK}
                        style={styles.title}
                        numberOfLines={2}
                    >
                        {title}
                    </Typography>
                    {packBadge && (
                        <View style={styles.packBadge}>
                            <Text style={styles.packBadgeText}>
                                {packBadge}
                            </Text>
                        </View>
                    )}
                </View>

                <View style={styles.ratingRow}>
                    <CustomIcon
                        provider="Ionicons"
                        name="star"
                        size={14}
                        color="#FFB800"
                    />
                    <Text style={styles.ratingText}>
                        {rating.toFixed(2)} ({formatReviewCount(reviewCount)}{" "}
                        reviews)
                    </Text>
                </View>
                <View style={styles.cardBody}>
                <View style={styles.priceSection}>
                    <View style={styles.priceRow}>
                        <Text style={styles.currentPrice}>{basePrice}</Text>
                        {originalPrice && originalPrice !== basePrice && (
                            <Text style={styles.originalPrice}>
                                {originalPrice}
                            </Text>
                        )}
                        {duration && (
                            <Text style={styles.duration}>• {duration}</Text>
                        )}
                    </View>
                    {pricePerUnit && (
                        <View style={styles.perUnitRow}>
                            <CustomIcon
                                provider="Ionicons"
                                name="pricetag"
                                size={12}
                                color="#00A896"
                            />
                            <Text style={styles.perUnitText}>
                                {pricePerUnit}
                            </Text>
                        </View>
                    )}
                    {description && (
                        <Typography
                            variant="caption"
                            color={COLORS.GREY[500]}
                            style={{ width: "50%" }}
                            numberOfLines={2}
                            ellipsizeMode="tail"
                        >
                            {description}
                        </Typography>
                    )}
                </View>
                {/* 
                <View style={styles.actionRow}>
                    <TouchableOpacity onPress={onPress}>
                        <Text style={styles.viewDetailsText}>View details</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.addButton}
                        onPress={onAddPress}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.addButtonText}>Add</Text>
                    </TouchableOpacity>
                </View> */}
            </View>
            </View>

            

            {image && (
                <Image
                    source={{ uri: image }}
                    style={styles.cardImage}
                    resizeMode="cover"
                />
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: COLORS.WHITE,
        borderRadius: 12,
        marginBottom: 16,
        shadowColor: COLORS.TEXT.DARK,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
        borderWidth: 1,
        borderColor: COLORS.GREY[100],
        overflow: "hidden",
        position: "relative",
    },
    cardHeader: {
        padding: 16,
        paddingBottom: 8,
    },
    titleRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 8,
        width: "60%",
        gap: 8,
    },
    title: {
        flex: 1,
        fontFamily: fontFamily.semiBold,
        fontSize: 16,
        lineHeight: 22,
        maxWidth: 200,
        color: COLORS.TEXT.DARK,
    },
    packBadge: {
        backgroundColor: COLORS.TEXT.DARK,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 4,
    },
    packBadgeText: {
        color: COLORS.WHITE,
        fontSize: 10,
        fontFamily: fontFamily.semiBold,
        letterSpacing: 0.5,
    },
    ratingRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
    },
    ratingText: {
        fontSize: 12,
        fontFamily: fontFamily.regular,
        color: COLORS.TEXT.DARK,
    },
    cardBody: {
        paddingBottom: 16,
        marginTop: 12
    },
    priceSection: {
        marginBottom: 12,
    },
    priceRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        marginBottom: 6,
    },
    currentPrice: {
        fontSize: 18,
        fontFamily: fontFamily.semiBold,
        color: COLORS.TEXT.DARK,
    },
    originalPrice: {
        fontSize: 14,
        fontFamily: fontFamily.medium,
        color: COLORS.GREY[400],
        textDecorationLine: "line-through",
    },
    duration: {
        fontSize: 14,
        fontFamily: fontFamily.regular,
        color: COLORS.GREY[500],
    },
    perUnitRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
    },
    perUnitText: {
        fontSize: 12,
        fontFamily: fontFamily.medium,
        color: "#00A896",
    },
    actionRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    viewDetailsText: {
        fontSize: 14,
        fontFamily: fontFamily.medium,
        color: "#5B21B6",
        textDecorationLine: "none",
    },
    addButton: {
        backgroundColor: COLORS.primary,
        paddingHorizontal: 24,
        paddingVertical: 8,
        borderRadius: 6,
    },
    addButtonText: {
        color: COLORS.WHITE,
        fontSize: 14,
        fontFamily: fontFamily.semiBold,
    },
    cardImage: {
        position: "absolute",
        right: 16,
        top: 16,
        width: "35%",
        height: 80,
        borderRadius: 8,
    },
});

export default ServiceDetailCard;
