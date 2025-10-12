import React from "react";
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Image,
    Dimensions,
} from "react-native";
import { COLORS } from "../../../constants/ui";
import { Typography } from "../../../components/Typography";
import { CustomIcon } from "../../../components/CustomIcon";
import { Product } from "../../../types/home-data";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 48) / 2.5; // Half width minus padding

interface ProductCardProps {
    product: Product;
    onPress?: (product: Product) => void;
    style?: any;
}

const ProductCard: React.FC<ProductCardProps> = ({
    product,
    onPress,
    style,
}) => {
    const handlePress = () => {
        if (onPress) {
            onPress(product);
        }
    };

    const formatPrice = (price: number) => {
        return `₹${price.toLocaleString()}`;
    };

    const formatRating = (rating: number) => {
        return rating.toFixed(2);
    };

    const formatReviews = (totalRatings: number) => {
        if (totalRatings >= 1000000) {
            return `${(totalRatings / 1000000).toFixed(1)}M`;
        } else if (totalRatings >= 1000) {
            return `${(totalRatings / 1000).toFixed(1)}K`;
        }
        return totalRatings.toString();
    };

    return (
        <TouchableOpacity
            style={[styles.container, style]}
            activeOpacity={0.8}
            onPress={handlePress}
        >
            <View style={styles.imageContainer}>
                <Image
                    source={{
                        uri:
                            product.productImages?.[0] ||
                            product.images?.[0] ||
                            "https://via.placeholder.com/200x200?text=No+Image",
                    }}
                    style={styles.productImage}
                    resizeMode="cover"
                />
            </View>

            <View style={styles.contentContainer}>
                <Typography
                    variant="body"
                    color={COLORS.TEXT.DARK}
                    style={styles.productTitle}
                    numberOfLines={2}
                >
                    {product.name}
                </Typography>

                <View style={styles.ratingContainer}>
                    <CustomIcon
                        provider="Ionicons"
                        name="star"
                        size={12}
                        color="#FFC107"
                    />
                    <Typography
                        variant="caption"
                        color={COLORS.TEXT.DARK}
                        style={styles.ratingText}
                    >
                        {formatRating(product.averageRating)} (
                        {formatReviews(product.totalRatings)})
                    </Typography>
                </View>

                <View style={styles.priceContainer}>
                    <Typography
                        variant="h5"
                        color={COLORS.TEXT.DARK}
                        style={styles.currentPrice}
                    >
                        {formatPrice(product.price)}
                    </Typography>
                    {/* You can add original price logic here if you have discount data */}
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        width: CARD_WIDTH,
        borderRadius: 12,
    },
    imageContainer: {
        height: 140,
        backgroundColor: COLORS.GREY[200],
        borderRadius: 12,
    },
    productImage: {
        width: "100%",
        height: "100%",
        borderRadius: 12,
    },
    contentContainer: {
        padding: 12,
        paddingTop: 8,
        paddingBottom: 12,
    },
    productTitle: {
        fontWeight: "500",
        fontSize: 13,
        lineHeight: 16,
        marginBottom: 4,
        color: COLORS.TEXT.DARK,
    },
    ratingContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 6,
    },
    ratingText: {
        marginLeft: 3,
        fontSize: 11,
        color: COLORS.GREY[500],
        fontWeight: "400",
    },
    priceContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    currentPrice: {
        fontWeight: "600",
        fontSize: 14,
        color: COLORS.TEXT.DARK,
    },
    originalPrice: {
        fontSize: 11,
        color: COLORS.GREY[400],
        textDecorationLine: "line-through",
        marginLeft: 4,
    },
});

export default ProductCard;
