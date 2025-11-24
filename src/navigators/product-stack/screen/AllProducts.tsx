import React, { useCallback, useEffect, useState } from "react";
import {
    StyleSheet,
    View,
    FlatList,
    TouchableOpacity,
    Image,
    ScrollView,
    RefreshControl,
    Dimensions,
    ActivityIndicator,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { SafeAreaView } from "../../../components/SafeAreaView";
import { Typography } from "../../../components/Typography";
import { CustomIcon } from "../../../components/CustomIcon";
import SearchBar from "../../../components/SearchBar";
import { Button } from "../../../components/Button";
import CartCounter from "../../../components/CartCounter";
import { COLORS } from "../../../constants/ui";
import { useNavigation } from "@react-navigation/native";
import { addToCart } from "../../../redux/actions/cart";
import {
    getCartTotalQuantity,
    isItemInCart,
} from "../../../redux/selectors/cart";
import { BackButton } from "../../../components/BackButton";
import { ProductsServices } from "../../../services/products";
import { Product, ProductCategory } from "../../../types/home-data";
import { useToast } from "../../../hooks/useToast";
import SkeletonLoader from "../../../components/SkeletonLoader";
import FloatingCartButton from "../../../modules/cart/FloatingButton";
import { ProductsComingSoon } from "../../../modules/products/ProductsComingSoon";

const ProductCard = ({
    item,
    handleAddToCart,
    handleProductPress,
}: {
    item: Product;
    handleAddToCart: (product: Product) => void;
    handleProductPress: (productId: string) => void;
}) => {
    const isInCart = useSelector(isItemInCart(item._id));
    return (
        <TouchableOpacity
            style={styles.productCard}
            onPress={() => handleProductPress(item._id)}
            activeOpacity={0.9}
        >
            <View style={styles.imageContainer}>
                <Image
                    source={{ uri: item.productImages?.[0] ?? "" }}
                    style={styles.productImage}
                    resizeMode="cover"
                />
                {!item.stock && (
                    <View style={styles.outOfStockOverlay}>
                        <Typography
                            variant="caption"
                            color={COLORS.WHITE}
                            style={styles.outOfStockText}
                        >
                            Out of Stock
                        </Typography>
                    </View>
                )}
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
                        {item.averageRating}
                    </Typography>
                </View>
            </View>

            <View style={styles.productInfo}>
                <Typography
                    variant="h6"
                    color={COLORS.TEXT.DARK}
                    style={styles.productTitle}
                    numberOfLines={2}
                >
                    {item.name}
                </Typography>

                <View style={styles.priceContainer}>
                    <Typography
                        variant="h5"
                        color="#FF6B35"
                        style={styles.currentPrice}
                    >
                        {`₹${item.discountPrice}`}
                    </Typography>
                    <Typography
                        variant="bodySmall"
                        color={COLORS.GREY[400]}
                        style={styles.originalPrice}
                    >
                        {`₹${item.price}`}
                    </Typography>
                </View>

                {isInCart ? (
                    <CartCounter
                        productId={item._id}
                        size="small"
                        style={styles.cartCounter}
                    />
                ) : (
                    <Button
                        title="Add to Cart"
                        variant="primary"
                        size="small"
                        fullWidth={true}
                        disabled={!item.stock}
                        onPress={() => handleAddToCart(item)}
                        style={styles.addToCartButton}
                    />
                )}
            </View>
        </TouchableOpacity>
    );
};

// Loading footer component for pagination
const LoadingFooter = () => (
    <View style={styles.loadingFooter}>
        <ActivityIndicator size="small" color={COLORS.primary} />
        <Typography
            variant="caption"
            color={COLORS.GREY[500]}
            style={styles.loadingText}
        >
            Loading more products...
        </Typography>
    </View>
);

// Error footer component
const ErrorFooter = ({ onRetry }: { onRetry: () => void }) => (
    <View style={styles.errorFooter}>
        <Typography
            variant="caption"
            color={COLORS.GREY[500]}
            style={styles.errorText}
        >
            Failed to load more products
        </Typography>
        <Button
            title="Retry"
            variant="outline"
            size="small"
            onPress={onRetry}
            style={styles.retryButton}
        />
    </View>
);

const AllProducts = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const dispatch = useDispatch();
    const navigation = useNavigation<any>();
    const toast = useToast();

    // Product states
    const [products, setProducts] = useState<Product[]>([]);
    const [productCategories, setProductCategories] = useState<
        ProductCategory[]
    >([]);

    // Loading states
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    // Pagination states
    const [page, setPage] = useState(1);
    const [hasNextPage, setHasNextPage] = useState(true);
    const [paginationError, setPaginationError] = useState(false);

    // Filter states
    const [selectedFilter, setSelectedFilter] = useState<
        ProductCategory | undefined
    >();
    const [showFilter, setShowFilter] = useState(true);

    const ITEMS_PER_PAGE = 6;

    // Fetch products with pagination
    const fetchProducts = useCallback(
        async (
            pageNum: number = 1,
            isRefresh: boolean = false,
            filter: ProductCategory | undefined = undefined,
        ) => {
            try {
                // Reset pagination error when retrying
                setPaginationError(false);
                console.log("selectedFilter", filter);
                const response = await ProductsServices.getProducts(
                    pageNum,
                    ITEMS_PER_PAGE,
                    filter?._id ?? "",
                );

                if (!response.success || !response.data) {
                    if (pageNum === 1) {
                        setProducts([]);
                        toast.error("Failed to fetch products");
                    } else {
                        setPaginationError(true);
                    }
                    return;
                }

                const newProducts = response.data;

                if (pageNum === 1 || isRefresh) {
                    // First page or refresh - replace products
                    setProducts(newProducts);
                } else {
                    // Pagination - append products
                    setProducts(prev => [...prev, ...newProducts]);
                }

                // Check if there are more pages
                setHasNextPage(newProducts.length === ITEMS_PER_PAGE);
            } catch (error) {
                console.error("Error fetching products:", error);
                if (pageNum === 1) {
                    setProducts([]);
                    toast.error("Network error. Please try again.");
                } else {
                    setPaginationError(true);
                }
            } finally {
                setLoading(false);
                setLoadingMore(false);
                setRefreshing(false);
            }
        },
        [selectedFilter, toast],
    );

    // Fetch product categories
    const fetchProductCategories = useCallback(async () => {
        try {
            const response = await ProductsServices.getProductCategories();
            if (!response.success || !response.data) {
                setProductCategories([]);
                toast.error("Failed to fetch categories");
                return;
            }
            setProductCategories(response.data.categories);
        } catch (error) {
            console.error("Error fetching categories:", error);
            setProductCategories([]);
        }
    }, [toast]);

    // Handle end reached for pagination
    const handleEndReached = useCallback(() => {
        if (
            !loadingMore &&
            hasNextPage &&
            !paginationError &&
            products.length > 0
        ) {
            setLoadingMore(true);
            const nextPage = page + 1;
            setPage(nextPage);
            fetchProducts(nextPage);
        }
    }, [
        loadingMore,
        hasNextPage,
        paginationError,
        products.length,
        page,
        fetchProducts,
    ]);

    // Handle refresh
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setPage(1);
        setHasNextPage(true);
        setPaginationError(false);
        fetchProducts(1, true);
        fetchProductCategories();
    }, [fetchProducts, fetchProductCategories]);

    // Handle filter change
    const handleFilterChange = useCallback(
        (filter: ProductCategory | undefined) => {
            console.log("filter", filter);
            setSelectedFilter(filter);
            setPage(1);
            setHasNextPage(true);
            setPaginationError(false);
            setLoading(true);
            fetchProducts(1, true, filter);
        },
        [fetchProducts, fetchProductCategories, selectedFilter],
    );

    // Handle retry pagination
    const handleRetryPagination = useCallback(() => {
        setPaginationError(false);
        setLoadingMore(true);
        fetchProducts(page);
    }, [page, fetchProducts]);

    // Initial load
    useEffect(() => {
        fetchProducts(1, true);
        fetchProductCategories();
    }, []);

    const renderFilterButton = (filter: ProductCategory) => {
        const isSelected = selectedFilter?._id === filter._id;
        return (
            <TouchableOpacity
                key={filter._id}
                style={[
                    styles.filterButton,
                    isSelected && styles.filterButtonSelected,
                ]}
                onPress={() => handleFilterChange(filter)}
                activeOpacity={0.8}
            >
                <Typography
                    variant="button"
                    color={isSelected ? COLORS.WHITE : COLORS.GREY[500]}
                    style={[
                        styles.filterButtonText,
                        isSelected && styles.filterButtonTextSelected,
                    ]}
                >
                    {filter.name}
                </Typography>
            </TouchableOpacity>
        );
    };

    // Render footer component based on state
    const renderFooter = () => {
        if (!products.length) return null;

        if (loadingMore) {
            return <LoadingFooter />;
        }

        if (paginationError) {
            return <ErrorFooter onRetry={handleRetryPagination} />;
        }

        if (!hasNextPage) {
            return (
                <View style={styles.endFooter}>
                    <Typography
                        variant="caption"
                        color={COLORS.GREY[400]}
                        style={styles.endText}
                    >
                        You've reached the end
                    </Typography>
                </View>
            );
        }

        return null;
    };

    // Redux selectors
    const cartTotalQuantity = useSelector(getCartTotalQuantity);

    const handleAddToCart = (product: Product) => {
        if (!product.stock) return;

        dispatch(
            addToCart(
                product._id,
                1, // quantity
                product.discountPrice, // singleItemPrice
                product?.productImages?.[0],
                product.name,
                product?.pricing?.platformFee ?? 0,
            ),
        );
    };

    const handleProductPress = (productId: string) => {
        navigation.navigate("ProductStack", {
            screen: "ProductDetail",
            params: { productId },
        });
    };

    const handleCartPress = () => {
        navigation.navigate("ProductStack", {
            screen: "ProductCheckout",
        });
    };

    const navigateToExplore = useCallback(() => {
        const state = navigation.getState?.();
        if (state?.routeNames?.includes?.("Explore")) {
            navigation.navigate("Explore");
            return;
        }

        const parent = navigation.getParent?.();
        const parentState = parent?.getState?.();

        if (parentState?.routeNames?.includes?.("Explore")) {
            parent?.navigate("Explore");
            return;
        }

        navigation.navigate("BottomTabs", {
            screen: "Explore",
        });
    }, [navigation]);

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerTop}>
                    <BackButton
                        onPress={() => navigation.goBack()}
                        color={COLORS.TEXT.DARK}
                        backButtonStyle={{ position: "static" }}
                    />
                    <Typography
                        variant="h3"
                        color={COLORS.TEXT.DARK}
                        style={styles.headerTitle}
                    >
                        Products
                    </Typography>
                    <TouchableOpacity
                        style={styles.cartButton}
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

                <SearchBar
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    placeholder="Search products..."
                    containerStyle={styles.searchBar}
                />
            </View>

            <View style={styles.titleSection}>
                <Typography
                    variant="h3"
                    color={COLORS.TEXT.DARK}
                    style={styles.title}
                >
                    Search Results ({products.length})
                </Typography>
                <TouchableOpacity
                    onPress={() => setShowFilter(!showFilter)}
                    style={styles.filterIcon}
                    activeOpacity={0.7}
                >
                    <CustomIcon
                        provider="MaterialIcons"
                        name={!showFilter ? "filter-list" : "filter-list-off"}
                        size={28}
                        color={COLORS.GREY[500]}
                    />
                </TouchableOpacity>
            </View>

            {loading && !refreshing ? (
                <>
                    <SkeletonLoader
                        layout={[
                            {
                                width: 64,
                                height: 30,
                                borderRadius: 10,
                            },
                            {
                                width: 64,
                                height: 30,
                                borderRadius: 10,
                            },
                            {
                                width: 64,
                                height: 30,
                                borderRadius: 10,
                            },
                            {
                                width: 64,
                                height: 30,
                                borderRadius: 10,
                            },
                        ]}
                        containerStyle={styles.categorySkeleton}
                        itemContainerStyle={styles.categoryContainerSkeleton}
                        pulseDurationMs={1000}
                    />
                    <SkeletonLoader
                        layout={[
                            {
                                width: "100%",
                                height: 100,
                                borderRadius: 12,
                            },
                            {
                                width: "100%",
                                height: 100,
                                borderRadius: 12,
                            },
                        ]}
                        containerStyle={{
                            marginTop: 60,
                            width: Dimensions.get("window").width - 30,
                            marginLeft: 20,
                        }}
                        itemContainerStyle={{
                            width: Dimensions.get("window").width - 30,
                        }}
                        pulseDurationMs={1000}
                    />
                </>
            ) : (
                <>
                    {/* Products Grid */}
                    <FlatList
                        data={products}
                        renderItem={({ item }) => (
                            <ProductCard
                                item={item}
                                handleAddToCart={handleAddToCart}
                                handleProductPress={handleProductPress}
                            />
                        )}
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={onRefresh}
                                colors={[COLORS.primary]}
                                tintColor={COLORS.primary}
                            />
                        }
                        keyExtractor={(item, index) => `${item._id}-${index}`}
                        numColumns={2}
                        contentContainerStyle={styles.productsList}
                        columnWrapperStyle={styles.row}
                        showsVerticalScrollIndicator={false}
                        onEndReached={handleEndReached}
                        onEndReachedThreshold={0.1}
                        ListHeaderComponent={
                            <ScrollView
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                style={[
                                    styles.filtersContainer,
                                    {
                                        display: showFilter ? "flex" : "none",
                                    },
                                ]}
                                contentContainerStyle={styles.filtersContent}
                            >
                                {/* Add "All" filter option */}
                                <TouchableOpacity
                                    style={[
                                        styles.filterButton,
                                        !selectedFilter &&
                                            styles.filterButtonSelected,
                                    ]}
                                    onPress={() =>
                                        handleFilterChange(undefined)
                                    }
                                    activeOpacity={0.8}
                                >
                                    <Typography
                                        variant="button"
                                        color={
                                            !selectedFilter
                                                ? COLORS.WHITE
                                                : COLORS.GREY[500]
                                        }
                                        style={[
                                            styles.filterButtonText,
                                            !selectedFilter &&
                                                styles.filterButtonTextSelected,
                                        ]}
                                    >
                                        All
                                    </Typography>
                                </TouchableOpacity>
                                {productCategories?.map(renderFilterButton)}
                            </ScrollView>
                        }
                        ListFooterComponent={renderFooter}
                        ListEmptyComponent={
                            <ProductsComingSoon
                                title="Fresh products are coming soon"
                                description="We are stocking up exciting products. In the meantime, continue discovering services and inspirations in Explore."
                                buttonLabel="Go to Explore"
                                onButtonPress={navigateToExplore}
                            />
                        }
                    />
                </>
            )}
            <FloatingCartButton />
        </SafeAreaView>
    );
};

export default AllProducts;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F8F9FA",
    },
    filterButton: {
        paddingHorizontal: 16,
        paddingVertical: 6,
        minHeight: 40,
        maxHeight: 40,
        marginBottom: 30,
        borderRadius: 8,
        backgroundColor: COLORS.GREY[100],
        borderWidth: 1,
        borderColor: COLORS.GREY[200],
    },
    filterButtonSelected: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
    },
    filterButtonText: {
        fontSize: 14,
        fontWeight: "500",
    },
    filterButtonTextSelected: {
        color: COLORS.WHITE,
    },
    titleSection: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        marginBottom: 16,
    },
    title: {
        fontWeight: "700",
    },
    filterIcon: {
        padding: 4,
    },
    header: {
        paddingTop: 16,
        paddingBottom: 20,
        shadowColor: COLORS.TEXT.DARK,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    headerTop: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
    },
    filtersContainer: {
        marginBottom: 0,
    },
    filtersContent: {
        gap: 12,
    },
    headerTitle: {
        fontWeight: "700",
    },
    cartButton: {
        position: "relative",
        padding: 8,
        marginRight: 12,
    },
    cartBadge: {
        position: "absolute",
        top: 2,
        right: 2,
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
    searchBar: {
        marginHorizontal: 16,
        marginTop: 0,
    },
    productsList: {
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 20,
    },
    row: {
        justifyContent: "space-between",
    },
    categoryContainerSkeleton: {
        width: Dimensions.get("window").width - 25,
        flexDirection: "row",
        marginLeft: 15,
        gap: 20,
    },
    categorySkeleton: {
        width: 30,
        height: 30,
        borderRadius: 30,
    },
    productCard: {
        width: "48%",
        backgroundColor: COLORS.WHITE,
        borderRadius: 12,
        marginBottom: 16,
        shadowColor: COLORS.TEXT.DARK,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
        borderWidth: 1,
        justifyContent: "space-between",
        borderColor: COLORS.GREY[100],
        overflow: "hidden",
    },
    imageContainer: {
        position: "relative",
        height: 140,
        backgroundColor: COLORS.GREY[200],
    },
    productImage: {
        width: "100%",
        height: "100%",
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
    },
    outOfStockText: {
        fontWeight: "600",
    },
    ratingContainer: {
        position: "absolute",
        top: 8,
        left: 8,
        backgroundColor: COLORS.WHITE,
        borderRadius: 12,
        paddingHorizontal: 8,
        paddingVertical: 4,
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
    },
    ratingText: {
        fontSize: 12,
        fontWeight: "600",
    },
    productInfo: {
        padding: 12,
        gap: 8,
    },
    productTitle: {
        fontWeight: "600",
        lineHeight: 18,
    },
    priceContainer: {
        flexDirection: "row",
        alignItems: "baseline",
        gap: 8,
    },
    currentPrice: {
        fontWeight: "700",
        fontSize: 16,
    },
    originalPrice: {
        textDecorationLine: "line-through",
        fontSize: 12,
    },
    addToCartButton: {
        borderRadius: 8,
        paddingVertical: 8,
    },
    cartCounter: {
        alignSelf: "center",
    },
    // New pagination-related styles
    loadingFooter: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 20,
        gap: 8,
    },
    loadingText: {
        fontSize: 12,
    },
    errorFooter: {
        alignItems: "center",
        paddingVertical: 20,
        gap: 8,
    },
    errorText: {
        fontSize: 12,
        textAlign: "center",
    },
    retryButton: {
        paddingHorizontal: 16,
        paddingVertical: 6,
    },
    endFooter: {
        alignItems: "center",
        paddingTop: 20,
        paddingBottom: 60,
    },
    endText: {
        fontSize: 12,
        fontStyle: "italic",
    },
});
