import { useState, useEffect, useCallback } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    Dimensions,
    ActivityIndicator,
    FlatList,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { COLORS } from "../../../constants/ui";
import { Typography } from "../../../components/Typography";
import {
    ServiceCategory,
    ProductCategory,
    Product,
} from "../../../types/home-data";
import { ServiceCategoryUtil } from "../../../services/serviceCategories";
import { ProductsServices } from "../../../services/products";
import { CustomIcon } from "../../../components/CustomIcon";
import ServiceCard from "../../../modules/home/ui/ServiceCard";
import SearchBar from "../../../components/SearchBar";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 48) / 2; // 2 columns with padding
const CARD_WIDTH_THREE = (width - 64) / 3; // 3 columns with padding

const Explore = () => {
    const [serviceCategories, setServiceCategories] = useState<
        ServiceCategory[]
    >([]);
    const [productCategories, setProductCategories] = useState<
        ProductCategory[]
    >([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [servicesLoading, setServicesLoading] = useState(true);
    const [productsLoading, setProductsLoading] = useState(true);
    const [featuredProductsLoading, setFeaturedProductsLoading] =
        useState(true);

    const navigation = useNavigation<any>();
    const insets = useSafeAreaInsets();

    const fetchData = useCallback(async () => {
        setLoading(true);

        // Fetch service categories (limit to 5 for the grid)
        setServicesLoading(true);
        const servicesResponse = await ServiceCategoryUtil.getCategories(
            1,
            undefined,
            1,
            3,
        );
        if (servicesResponse.success && servicesResponse.data) {
            setServiceCategories(servicesResponse.data);
        }
        setServicesLoading(false);

        // Fetch product categories
        setProductsLoading(true);
        const productsResponse = await ProductsServices.getProductCategories();
        if (productsResponse.success && productsResponse.data) {
            setProductCategories(productsResponse.data.categories || []);
        }
        setProductsLoading(false);

        // Fetch featured products
        setFeaturedProductsLoading(true);
        const featuredProductsResponse = await ProductsServices.getProducts(
            1,
            8,
        );
        if (featuredProductsResponse.success && featuredProductsResponse.data) {
            setProducts(featuredProductsResponse.data);
        }
        setFeaturedProductsLoading(false);

        setLoading(false);
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleServicePress = (categoryId: string, categoryName: string) => {
        navigation.navigate("Services", {
            screen: "AllServices",
            params: { categoryId, categoryName },
        });
    };

    const handleProductCategoryPress = (
        categoryId: string,
        categoryName: string,
    ) => {
        navigation.navigate("Products", {
            screen: "AllProducts",
            params: { categoryId, categoryName },
        });
    };

    const handleProductPress = (productId: string) => {
        navigation.navigate("Products", {
            screen: "ProductDetail",
            params: { productId },
        });
    };

    const handleSeeAllServices = () => {
        navigation.navigate("Services", {
            screen: "AllServices",
        });
    };

    const handleSeeAllProducts = () => {
        navigation.navigate("Products", {
            screen: "AllProducts",
        });
    };

    const renderProductCategoryCard = (item: ProductCategory) => (
        <TouchableOpacity
            key={item._id}
            style={styles.productCategoryCard}
            activeOpacity={0.8}
            onPress={() => handleProductCategoryPress(item._id, item.name)}
        >
            <View style={styles.productCategoryContent}>
                <View style={styles.productCategoryIcon}>
                    <CustomIcon
                        provider="Ionicons"
                        name="cube-outline"
                        size={24}
                        color={COLORS.primary}
                    />
                </View>
                <Typography
                    variant="bodySmall"
                    color={COLORS.TEXT.DARK}
                    style={styles.productCategoryName}
                    numberOfLines={2}
                >
                    {item.name}
                </Typography>
            </View>
        </TouchableOpacity>
    );

    const renderProductCard = ({
        item,
        index,
    }: {
        item: Product;
        index: number;
    }) => (
        <ServiceCard
            title={item.name}
            provider={item.category?.name || "Product"}
            price={`₹${item.price}`}
            rating={item.averageRating || 0}
            image={item.productImages?.[0] || item.images?.[0]}
            onPress={() => handleProductPress(item._id)}
            style={{ marginLeft: index === 0 ? 20 : 0 }}
        />
    );

    const renderFeaturedProducts = () => {
        if (featuredProductsLoading) {
            return (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="small" color={COLORS.primary} />
                    <Typography
                        variant="caption"
                        color={COLORS.GREY[500]}
                        style={styles.loadingText}
                    >
                        Loading products...
                    </Typography>
                </View>
            );
        }

        if (products.length === 0) {
            return (
                <View style={styles.emptyContainer}>
                    <CustomIcon
                        provider="Ionicons"
                        name="cube-outline"
                        size={48}
                        color={COLORS.GREY[400]}
                    />
                    <Typography
                        variant="bodySmall"
                        color={COLORS.GREY[500]}
                        style={styles.emptyText}
                    >
                        No products available
                    </Typography>
                </View>
            );
        }

        return (
            <FlatList
                data={products}
                keyExtractor={item => item._id}
                renderItem={renderProductCard}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.productsList}
            />
        );
    };

    const renderServiceCategories = () => {
        if (productsLoading) {
            return (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="small" color={COLORS.primary} />
                    <Typography
                        variant="caption"
                        color={COLORS.GREY[500]}
                        style={styles.loadingText}
                    >
                        Loading categories...
                    </Typography>
                </View>
            );
        }

        if (serviceCategories.length === 0) {
            return (
                <View style={styles.emptyContainer}>
                    <CustomIcon
                        provider="Ionicons"
                        name="cube-outline"
                        size={48}
                        color={COLORS.GREY[400]}
                    />
                    <Typography
                        variant="bodySmall"
                        color={COLORS.GREY[500]}
                        style={styles.emptyText}
                    >
                        No categories available
                    </Typography>
                </View>
            );
        }

        return (
            <View style={styles.productCategoriesGrid}>
                {productCategories.slice(0, 6).map(renderProductCategoryCard)}
            </View>
        );
    };

    if (loading) {
        return (
            <View style={[styles.container, { paddingTop: insets.top }]}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                    <Typography
                        variant="bodySmall"
                        color={COLORS.GREY[500]}
                        style={styles.loadingText}
                    >
                        Loading explore...
                    </Typography>
                </View>
            </View>
        );
    }

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <View style={styles.header}>
                    <Typography variant="h3" color={COLORS.TEXT.DARK}>
                        Explore
                    </Typography>
                    <Typography
                        variant="bodySmall"
                        color={COLORS.GREY[500]}
                        style={styles.headerSubtitle}
                    >
                        Discover services and products
                    </Typography>
                </View>

                <SearchBar
                    value={""}
                    onChangeText={() => {}}
                    placeholder={"Search for Service eg: Ac Repair"}
                    containerStyle={{ marginBottom: 20, marginHorizontal: 16 }}
                />

                {/* Product Categories Section */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Typography
                            variant="h6"
                            color={COLORS.TEXT.DARK}
                            style={styles.sectionTitle}
                        >
                            Explore Services
                        </Typography>
                        <TouchableOpacity
                            style={styles.seeAllButton}
                            onPress={handleSeeAllServices}
                            activeOpacity={0.7}
                        >
                            <Typography
                                variant="caption"
                                color={COLORS.primary}
                                style={styles.seeAllText}
                            >
                                See All
                            </Typography>
                            <CustomIcon
                                provider="Ionicons"
                                name="chevron-forward"
                                size={16}
                                color={COLORS.primary}
                            />
                        </TouchableOpacity>
                    </View>
                    {renderServiceCategories()}
                </View>

                {/* Featured Products Section */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Typography
                            variant="h6"
                            color={COLORS.TEXT.DARK}
                            style={styles.sectionTitle}
                        >
                            Featured Products
                        </Typography>
                        <TouchableOpacity
                            style={styles.seeAllButton}
                            onPress={handleSeeAllProducts}
                            activeOpacity={0.7}
                        >
                            <Typography
                                variant="caption"
                                color={COLORS.primary}
                                style={styles.seeAllText}
                            >
                                See All
                            </Typography>
                            <CustomIcon
                                provider="Ionicons"
                                name="chevron-forward"
                                size={16}
                                color={COLORS.primary}
                            />
                        </TouchableOpacity>
                    </View>
                    {renderFeaturedProducts()}
                </View>

                {/* Bottom padding for tab bar */}
                <View style={styles.bottomPadding} />
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.WHITE,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 100, // Space for tab bar
    },
    header: {
        paddingHorizontal: 20,
        paddingVertical: 24,
        backgroundColor: COLORS.WHITE,
    },
    headerSubtitle: {
        fontSize: 16,
        color: COLORS.GREY[500],
    },
    section: {
        marginBottom: 32,
    },
    sectionHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 20,
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: "600",
    },
    seeAllButton: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 12,
        paddingVertical: 6,
        backgroundColor: COLORS.primaryLight,
        borderRadius: 16,
    },
    seeAllText: {
        fontSize: 12,
        fontWeight: "500",
        marginRight: 4,
    },
    servicesGrid: {
        paddingHorizontal: 20,
    },
    firstRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 12,
    },
    secondRow: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    serviceCard: {
        backgroundColor: COLORS.WHITE,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: COLORS.border.light,
        shadowColor: COLORS.TEXT.DARK,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 2,
    },
    firstRowCard: {
        height: 120,
    },
    secondRowCard: {
        height: 120,
    },
    serviceCardContent: {
        flex: 1,
        padding: 16,
        justifyContent: "space-between",
    },
    serviceIconContainer: {
        alignItems: "center",
        marginBottom: 8,
    },
    serviceIcon: {
        width: 60,
        height: 50,
        alignSelf: "flex-end",
    },
    serviceName: {
        fontSize: 14,
        fontWeight: "500",
        textAlign: "center",
        lineHeight: 18,
    },
    productsList: {
        paddingRight: 20,
        paddingVertical: 8,
    },
    productCategoriesGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        paddingHorizontal: 20,
        justifyContent: "space-between",
    },
    productCategoryCard: {
        width: (width - 60) / 3, // 3 columns with padding
        backgroundColor: COLORS.WHITE,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: COLORS.border.light,
        marginBottom: 12,
        shadowColor: COLORS.TEXT.DARK,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04,
        shadowRadius: 4,
        elevation: 1,
    },
    productCategoryContent: {
        padding: 16,
        alignItems: "center",
    },
    productCategoryIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: COLORS.primaryLight,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 8,
    },
    productCategoryName: {
        fontSize: 12,
        fontWeight: "500",
        textAlign: "center",
        lineHeight: 16,
    },
    loadingContainer: {
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 40,
    },
    loadingText: {
        marginTop: 8,
        fontSize: 14,
    },
    emptyContainer: {
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 40,
    },
    emptyText: {
        marginTop: 12,
        fontSize: 14,
    },
    bottomPadding: {
        height: 20,
    },
});

export default Explore;
