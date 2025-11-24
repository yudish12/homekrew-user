import React, { useCallback, useEffect, useState } from "react";
import {
    StyleSheet,
    View,
    ScrollView,
    TouchableOpacity,
    Image,
    Dimensions,
    ActivityIndicator,
    Alert,
} from "react-native";
import { SafeAreaView } from "../../../components/SafeAreaView";
import { Typography } from "../../../components/Typography";
import { Button } from "../../../components/Button";
import { CustomIcon } from "../../../components/CustomIcon";
import { COLORS } from "../../../constants/ui";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../../redux/actions/cart";
import {
    isItemInCart,
    getCartTotalQuantity,
} from "../../../redux/selectors/cart";
import CartCounter from "../../../components/CartCounter";
import { Product } from "../../../types/home-data";
import { ProductsServices } from "../../../services/products";

const { width } = Dimensions.get("window");

const ProductDetail = () => {
    const navigation = useNavigation<any>();
    const dispatch = useDispatch();

    const { productId } = (useRoute().params as { productId: string }) || {};

    const [productData, setProductData] = useState<Product | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);

    const isInCart = useSelector(isItemInCart(productData?._id ?? ""));
    const cartTotalQuantity = useSelector(getCartTotalQuantity);

    const fetchProductDetails = useCallback(async () => {
        try {
            setError(null);
            const response = await ProductsServices.getProductById(productId);

            if (!response.success || !response.data) {
                setError("Failed to load product details. Please try again.");
                setProductData(null);
                return;
            }

            setProductData(response.data);
        } catch (err) {
            setError(
                "Network error. Please check your connection and try again.",
            );
            setProductData(null);
        } finally {
            setLoading(false);
        }
    }, [productId]);

    const handleAddToCart = () => {
        if (!productData) return;

        if (!productData.stock || productData.stock <= 0) {
            Alert.alert(
                "Out of Stock",
                "This product is currently out of stock.",
            );
            return;
        }

        dispatch(
            addToCart(
                productData._id,
                1,
                productData.discountPrice || 0,
                productData?.productImages?.[0],
                productData.name,
                productData.pricing.platformFee,
            ),
        );
    };

    const handleCartPress = () => {
        navigation.navigate("ProductCheckout");
    };

    const handleRetry = () => {
        setLoading(true);
        fetchProductDetails();
    };

    useEffect(() => {
        if (!productId) {
            setError("Invalid product ID");
            return;
        }
        setLoading(true);
        fetchProductDetails();
    }, [fetchProductDetails, productId]);

    // Get available images (prioritize productImages, fallback to images)
    const availableImages = productData?.productImages?.length
        ? productData.productImages
        : productData?.images?.length
        ? productData.images
        : [];

    // Loading state
    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                    <Typography
                        variant="body"
                        color={COLORS.GREY[500]}
                        style={styles.loadingText}
                    >
                        Loading product details...
                    </Typography>
                </View>
            </SafeAreaView>
        );
    }

    // Error state
    if (error || !productData) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.errorContainer}>
                    <CustomIcon
                        provider="Ionicons"
                        name="alert-circle-outline"
                        size={64}
                        color={COLORS.GREY[400]}
                    />
                    <Typography
                        variant="h5"
                        color={COLORS.GREY[500]}
                        style={styles.errorTitle}
                    >
                        Oops! Something went wrong
                    </Typography>
                    <Typography
                        variant="body"
                        color={COLORS.GREY[500]}
                        style={styles.errorMessage}
                    >
                        {error || "Product not found"}
                    </Typography>
                    <Button
                        title="Try Again"
                        variant="primary"
                        size="medium"
                        onPress={handleRetry}
                        style={styles.retryButton}
                    />
                    <Button
                        title="Go Back"
                        variant="outline"
                        size="medium"
                        onPress={() => navigation.navigate("ProductsLanding")}
                        style={styles.goBackButton}
                    />
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => {
                        if (navigation.canGoBack()) {
                            navigation.goBack();
                        } else {
                            navigation.navigate("ProductStack", {
                                screen: "ProductsLanding",
                            });
                        }
                    }}
                    activeOpacity={0.7}
                >
                    <CustomIcon
                        provider="Ionicons"
                        name="arrow-back"
                        size={24}
                        color={COLORS.TEXT.DARK}
                    />
                </TouchableOpacity>

                <Typography
                    variant="h5"
                    color={COLORS.TEXT.DARK}
                    style={styles.headerTitle}
                >
                    Product Details
                </Typography>

                <View style={styles.headerRight}>
                    <TouchableOpacity
                        style={styles.headerIcon}
                        activeOpacity={0.7}
                        onPress={handleCartPress}
                    >
                        <CustomIcon
                            provider="Ionicons"
                            name="bag-outline"
                            size={24}
                            color={COLORS.TEXT.DARK}
                        />
                        {cartTotalQuantity > 0 && (
                            <View style={styles.cartBadge}>
                                <Typography
                                    variant="caption"
                                    color={COLORS.WHITE}
                                    style={styles.cartBadgeText}
                                >
                                    {cartTotalQuantity}
                                </Typography>
                            </View>
                        )}
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Product Images */}
                <View style={styles.imageSection}>
                    {availableImages.length > 0 ? (
                        <>
                            <View style={styles.mainImageContainer}>
                                <Image
                                    source={{
                                        uri: availableImages[
                                            selectedImageIndex
                                        ],
                                    }}
                                    style={styles.productImage}
                                    resizeMode="contain"
                                />

                                {/* Stock status overlay */}
                                {(!productData.stock ||
                                    productData.stock <= 0) && (
                                    <View style={styles.outOfStockOverlay}>
                                        <Typography
                                            variant="h6"
                                            color={COLORS.WHITE}
                                            style={styles.outOfStockText}
                                        >
                                            Out of Stock
                                        </Typography>
                                    </View>
                                )}
                            </View>

                            {/* Image thumbnails */}
                            {availableImages.length > 1 && (
                                <ScrollView
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                    style={styles.thumbnailContainer}
                                    contentContainerStyle={
                                        styles.thumbnailContent
                                    }
                                >
                                    {availableImages.map((image, index) => (
                                        <TouchableOpacity
                                            key={index}
                                            style={[
                                                styles.thumbnail,
                                                selectedImageIndex === index &&
                                                    styles.selectedThumbnail,
                                            ]}
                                            onPress={() =>
                                                setSelectedImageIndex(index)
                                            }
                                            activeOpacity={0.8}
                                        >
                                            <Image
                                                source={{ uri: image }}
                                                style={styles.thumbnailImage}
                                                resizeMode="cover"
                                            />
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                            )}
                        </>
                    ) : (
                        <View style={styles.noImageContainer}>
                            <CustomIcon
                                provider="Ionicons"
                                name="image-outline"
                                size={64}
                                color={COLORS.GREY[400]}
                            />
                            <Typography
                                variant="body"
                                color={COLORS.GREY[500]}
                                style={styles.noImageText}
                            >
                                No image available
                            </Typography>
                        </View>
                    )}
                </View>

                {/* Product Information */}
                <View style={styles.productInfo}>
                    {/* Title and Price */}
                    <View style={styles.titleSection}>
                        <Typography
                            variant="h3"
                            color={COLORS.TEXT.DARK}
                            style={styles.productTitle}
                        >
                            {productData.name || "Product Name Not Available"}
                        </Typography>

                        <View style={styles.priceSection}>
                            <View
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    gap: 8,
                                }}
                            >
                                <Typography variant="h3" color={COLORS.primary}>
                                    ₹
                                    {productData.discountPrice?.toFixed(2) ||
                                        "0.00"}
                                </Typography>
                                <Typography
                                    variant="h6"
                                    style={{
                                        textDecorationLine: "line-through",
                                    }}
                                    color={COLORS.GREY[500]}
                                >
                                    ₹{productData.price?.toFixed(2) || "0.00"}
                                </Typography>
                            </View>

                            {/* Stock status */}
                            <View
                                style={[
                                    styles.stockBadge,
                                    productData.stock && productData.stock > 0
                                        ? styles.inStockBadge
                                        : styles.outOfStockBadge,
                                ]}
                            >
                                <Typography
                                    variant="caption"
                                    color={COLORS.WHITE}
                                    style={styles.stockText}
                                >
                                    {productData.stock && productData.stock > 0
                                        ? `${productData.stock} in stock`
                                        : "Out of Stock"}
                                </Typography>
                            </View>
                        </View>
                    </View>

                    {/* Rating and Sales */}
                    {(productData.averageRating || productData.totalSold) && (
                        <View style={styles.statsSection}>
                            {productData.averageRating && (
                                <View style={styles.ratingContainer}>
                                    <CustomIcon
                                        provider="Ionicons"
                                        name="star"
                                        size={16}
                                        color="#FFD700"
                                    />
                                    <Typography
                                        variant="body"
                                        color={COLORS.TEXT.DARK}
                                        style={styles.ratingText}
                                    >
                                        {productData.averageRating.toFixed(1)}
                                    </Typography>
                                    {productData.totalRatings && (
                                        <Typography
                                            variant="caption"
                                            color={COLORS.GREY[500]}
                                            style={styles.ratingCount}
                                        >
                                            ({productData.totalRatings} reviews)
                                        </Typography>
                                    )}
                                </View>
                            )}

                            {productData.totalSold && (
                                <View style={styles.soldContainer}>
                                    <CustomIcon
                                        provider="Ionicons"
                                        name="trending-up"
                                        size={16}
                                        color={COLORS.GREY[500]}
                                    />
                                    <Typography
                                        variant="body"
                                        color={COLORS.GREY[500]}
                                        style={styles.soldText}
                                    >
                                        {productData.totalSold} sold
                                    </Typography>
                                </View>
                            )}
                        </View>
                    )}

                    {/* Category and SKU */}
                    <View style={styles.metaSection}>
                        {productData.category?.name && (
                            <View style={styles.metaItem}>
                                <CustomIcon
                                    provider="Ionicons"
                                    name="pricetag-outline"
                                    size={18}
                                    color={COLORS.GREY[500]}
                                />
                                <Typography
                                    variant="body"
                                    color={COLORS.TEXT.DARK}
                                    style={styles.metaText}
                                >
                                    Category: {productData.category.name}
                                </Typography>
                            </View>
                        )}

                        {productData.sku && (
                            <View style={styles.metaItem}>
                                <CustomIcon
                                    provider="Ionicons"
                                    name="barcode-outline"
                                    size={18}
                                    color={COLORS.GREY[500]}
                                />
                                <Typography
                                    variant="body"
                                    color={COLORS.GREY[500]}
                                    style={styles.metaText}
                                >
                                    SKU: {productData.sku}
                                </Typography>
                            </View>
                        )}
                    </View>

                    {/* Description */}
                    {productData.description && (
                        <View style={styles.descriptionSection}>
                            <Typography
                                variant="h6"
                                color={COLORS.TEXT.DARK}
                                style={styles.sectionTitle}
                            >
                                Description
                            </Typography>
                            <Typography
                                variant="body"
                                color={COLORS.TEXT.DARK}
                                style={styles.description}
                            >
                                {productData.description}
                            </Typography>
                        </View>
                    )}
                </View>
            </ScrollView>

            {/* Sticky Bottom Button */}
            <View style={styles.bottomContainer}>
                <View style={styles.bottomContent}>
                    {isInCart ? (
                        <View style={styles.cartActionContainer}>
                            <CartCounter
                                productId={productData._id}
                                size="large"
                                style={styles.cartCounter}
                            />
                            <Button
                                title="View Cart"
                                variant="outline"
                                size="medium"
                                onPress={handleCartPress}
                                style={styles.viewCartButton}
                                icon={
                                    <CustomIcon
                                        provider="Ionicons"
                                        name="bag-outline"
                                        size={16}
                                        color={COLORS.primary}
                                    />
                                }
                            />
                        </View>
                    ) : (
                        <Button
                            title={
                                !productData.stock || productData.stock <= 0
                                    ? "Out of Stock"
                                    : "Add to Cart"
                            }
                            variant="primary"
                            size="large"
                            fullWidth={true}
                            disabled={
                                !productData.stock || productData.stock <= 0
                            }
                            onPress={handleAddToCart}
                            style={[
                                styles.addToCartButton,
                                !productData.stock || productData.stock <= 0
                                    ? styles.disabledButton
                                    : {},
                            ]}
                            icon={
                                <CustomIcon
                                    provider="Ionicons"
                                    name="bag-outline"
                                    size={20}
                                    color={COLORS.WHITE}
                                />
                            }
                        />
                    )}
                </View>
            </View>
        </SafeAreaView>
    );
};

export default ProductDetail;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.WHITE,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 20,
    },
    loadingText: {
        marginTop: 16,
        textAlign: "center",
    },
    errorContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 20,
    },
    errorTitle: {
        marginTop: 16,
        fontWeight: "600",
        textAlign: "center",
    },
    errorMessage: {
        marginTop: 8,
        marginBottom: 24,
        textAlign: "center",
        lineHeight: 20,
    },
    retryButton: {
        marginBottom: 12,
        minWidth: 120,
    },
    goBackButton: {
        minWidth: 120,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.GREY[100],
        backgroundColor: COLORS.WHITE,
    },
    backButton: {
        padding: 8,
        borderRadius: 8,
    },
    headerTitle: {
        fontWeight: "600",
        flex: 1,
        textAlign: "center",
        marginHorizontal: 16,
    },
    headerRight: {
        flexDirection: "row",
        alignItems: "center",
    },
    headerIcon: {
        padding: 8,
        position: "relative",
        borderRadius: 8,
    },
    cartBadge: {
        position: "absolute",
        top: 4,
        right: 4,
        backgroundColor: COLORS.primary,
        borderRadius: 10,
        minWidth: 20,
        height: 20,
        alignItems: "center",
        justifyContent: "center",
    },
    cartBadgeText: {
        fontSize: 10,
        fontWeight: "600",
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 100, // Space for sticky button
    },
    imageSection: {
        backgroundColor: "#F8F9FA",
    },
    mainImageContainer: {
        alignItems: "center",
        paddingVertical: 20,
        position: "relative",
    },
    productImage: {
        width: width * 0.85,
        height: width * 0.85,
        borderRadius: 12,
        backgroundColor: COLORS.WHITE,
    },
    outOfStockOverlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.6)",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 12,
        margin: 20,
    },
    outOfStockText: {
        fontWeight: "600",
        textTransform: "uppercase",
        letterSpacing: 1,
    },
    thumbnailContainer: {
        paddingBottom: 20,
    },
    thumbnailContent: {
        paddingHorizontal: 20,
        gap: 12,
    },
    thumbnail: {
        width: 60,
        height: 60,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: COLORS.GREY[200],
        overflow: "hidden",
    },
    selectedThumbnail: {
        borderColor: COLORS.primary,
        borderWidth: 3,
    },
    thumbnailImage: {
        width: "100%",
        height: "100%",
    },
    noImageContainer: {
        alignItems: "center",
        paddingVertical: 60,
        backgroundColor: COLORS.GREY[500],
    },
    noImageText: {
        marginTop: 12,
    },
    productInfo: {
        paddingHorizontal: 20,
        paddingTop: 24,
    },
    titleSection: {
        marginBottom: 20,
    },
    productTitle: {
        fontWeight: "700",
        lineHeight: 32,
        marginBottom: 12,
    },
    priceSection: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingTop: 12,
    },
    price: {
        fontWeight: "800",
        fontSize: 28,
    },
    stockBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
    },
    inStockBadge: {
        backgroundColor: "#10B981",
    },
    outOfStockBadge: {
        backgroundColor: "#EF4444",
    },
    stockText: {
        fontSize: 12,
        fontWeight: "600",
        textTransform: "uppercase",
    },
    statsSection: {
        flexDirection: "row",
        alignItems: "center",
        gap: 24,
        marginBottom: 20,
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.GREY[100],
    },
    ratingContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
    },
    ratingText: {
        fontWeight: "600",
        marginLeft: 4,
    },
    ratingCount: {
        marginLeft: 4,
    },
    soldContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
    },
    soldText: {
        marginLeft: 4,
    },
    metaSection: {
        marginBottom: 24,
    },
    metaItem: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 8,
        gap: 8,
    },
    metaText: {
        flex: 1,
    },
    descriptionSection: {
        marginBottom: 40,
    },
    sectionTitle: {
        fontWeight: "700",
        marginBottom: 12,
        color: COLORS.TEXT.DARK,
    },
    description: {
        lineHeight: 24,
        color: COLORS.TEXT.DARK,
    },
    bottomContainer: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: COLORS.WHITE,
        paddingTop: 16,
        paddingBottom: 34,
        paddingHorizontal: 20,
        borderTopWidth: 1,
        borderTopColor: COLORS.GREY[100],
        shadowColor: COLORS.TEXT.DARK,
        shadowOffset: {
            width: 0,
            height: -4,
        },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 8,
    },
    bottomContent: {
        maxWidth: 400,
        alignSelf: "center",
        width: "100%",
    },
    cartActionContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    cartCounter: {
        flex: 1,
    },
    viewCartButton: {
        flex: 1,
    },
    addToCartButton: {
        shadowColor: COLORS.primary,
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 8,
    },
    disabledButton: {
        opacity: 0.6,
        shadowOpacity: 0,
        elevation: 0,
    },
});
