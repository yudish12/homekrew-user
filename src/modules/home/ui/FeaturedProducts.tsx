import React from "react";
import { View, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { COLORS } from "../../../constants/ui";
import { Typography } from "../../../components/Typography";
import { Product } from "../../../types/home-data";
import ProductCard from "./ProductCard";

interface FeaturedProductsProps {
    title?: string;
    products: Product[];
    onSeeAllPress?: () => void;
    onProductPress?: (product: Product) => void;
}

const FeaturedProducts: React.FC<FeaturedProductsProps> = ({
    title = "Most booked services",
    products,
    onSeeAllPress,
    onProductPress,
}) => {
    const navigation = useNavigation<any>();

    const handleProductPress = (product: Product) => {
        if (onProductPress) {
            onProductPress(product);
        } else {
            // Default navigation to product detail
            navigation.navigate("Products", {
                screen: "ProductDetail",
                params: { productId: product._id },
            });
        }
    };

    const handleSeeAllPress = () => {
        if (onSeeAllPress) {
            onSeeAllPress();
        } else {
            // Default navigation to all products
            navigation.navigate("Products", {
                screen: "AllProducts",
            });
        }
    };

    const renderProductCard = ({ item }: { item: Product }) => (
        <ProductCard product={item} onPress={handleProductPress} />
    );

    if (!products || products.length === 0) {
        return null;
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Typography variant="h4" color={COLORS.TEXT.DARK}>
                    {title}
                </Typography>
                <TouchableOpacity
                    onPress={handleSeeAllPress}
                    activeOpacity={0.7}
                >
                    <Typography
                        variant="body"
                        color={COLORS.primary}
                        style={styles.seeAllText}
                    >
                        See all
                    </Typography>
                </TouchableOpacity>
            </View>

            <FlatList
                data={products}
                renderItem={renderProductCard}
                keyExtractor={item => item._id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingVertical: 16,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 16,
        marginBottom: 16,
    },
    seeAllText: {
        fontWeight: "500",
    },
    scrollContent: {
        paddingHorizontal: 16,
    },
    separator: {
        width: 12,
    },
});

export default FeaturedProducts;
