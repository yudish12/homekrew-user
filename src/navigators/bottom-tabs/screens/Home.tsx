import { useCallback, useEffect, useState } from "react";
import {
    View,
    StyleSheet,
    Dimensions,
    FlatList,
    ScrollView,
    TouchableOpacity,
} from "react-native";
import { COLORS } from "../../../constants/ui";
import { LinearGradient } from "expo-linear-gradient";
import { Typography } from "../../../components/Typography";
import { CustomIcon } from "../../../components/CustomIcon";
import SearchBar from "../../../components/SearchBar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import BannerCarousel from "../../../modules/home/ui/BannerCarousel";
import CategoryChips from "../../../modules/home/ui/CategoryChips";
import ServiceCard from "../../../modules/home/ui/ServiceCard";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";
import { Button } from "../../../components/Button";
import { Banner, Product, ServiceCategory } from "../../../types/home-data";
import { UtilityServices } from "../../../services";
import { SkeletonLoader } from "../../../components/SkeletonLoader";
import { ProductsServices } from "../../../services/products";
import { ServiceCategoryUtil } from "../../../services/serviceCategories";

const Home = () => {
    const [query, setQuery] = useState("");
    const insets = useSafeAreaInsets();

    const [bannerLoading, setBannerLoading] = useState(true);
    const [productsLoading, setProductsLoading] = useState(true);
    const [serviceCategoriesLoading, setServiceCategoriesLoading] =
        useState(true);

    const [products, setProducts] = useState<Product[]>([]);
    const [serviceCategories, setServiceCategories] = useState<
        ServiceCategory[]
    >([]);

    const [banners, setBanners] = useState<Banner[]>([]);

    const tabBarHeight = useBottomTabBarHeight();
    const navigation = useNavigation<any>();

    const fetchHomeData = useCallback(async () => {
        setBannerLoading(true);
        const response = await UtilityServices.getBanners();
        if (!response.success || !response.data) {
            setBannerLoading(false); // Set loading to false even on error
            return;
        }
        setBanners(response.data);
        setBannerLoading(false); // Uncomment this line

        setProductsLoading(true);
        const productsResponse = await ProductsServices.getProducts(1, 5);
        if (!productsResponse.success || !productsResponse.data) {
            setProductsLoading(false); // Set loading to false even on error
            return;
        }
        setProducts(productsResponse.data);
        setProductsLoading(false); // Uncomment this line

        setServiceCategoriesLoading(true);
        const serviceCategoriesResponse =
            await ServiceCategoryUtil.getCategories(1, undefined, 1, 6);
        if (
            !serviceCategoriesResponse.success ||
            !serviceCategoriesResponse.data
        ) {
            setServiceCategoriesLoading(false); // Set loading to false even on error
            return;
        }
        setServiceCategories(serviceCategoriesResponse.data);
        setServiceCategoriesLoading(false); // Uncomment this line
    }, []);

    useEffect(() => {
        fetchHomeData();
    }, []);

    // Banner skeleton layout - match the actual banner dimensions
    const bannerSkeletonLayout = [
        {
            width: Dimensions.get("window").width - 32,
            height: 180,
            borderRadius: 18,
        },
    ];

    // Service card skeleton layout
    const serviceCardSkeletonLayout = [
        { width: "100%" as const, height: 120, borderRadius: 8 },
        {
            width: "70%" as const,
            height: 16,
            borderRadius: 4,
            style: { marginTop: 8 },
        },
        {
            width: "50%" as const,
            height: 14,
            borderRadius: 4,
            style: { marginTop: 4 },
        },
        {
            width: "40%" as const,
            height: 14,
            borderRadius: 4,
            style: { marginTop: 4 },
        },
    ];

    // Category skeleton layout
    const categorySkeletonLayout = [
        { width: 60, height: 60, borderRadius: 30 },
        {
            width: "80%" as const,
            height: 12,
            borderRadius: 4,
            style: { marginTop: 8 },
        },
    ];

    const handleCategoryPress = (categoryId: string, categoryName: string) => {
        // Navigate to specific category or show category services
        console.log("Category pressed:", categoryId);
        navigation.navigate("Services", {
            screen: "ServiceDetails",
            params: {
                serviceId: categoryId,
                serviceName: categoryName,
            },
        });
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top - 10 }]}>
            <LinearGradient
                style={styles.background}
                colors={["rgba(27, 117, 187,0.8)", "white"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
            />

            <View style={styles.headerWrap}>
                <View style={styles.headerRow}>
                    <View
                        style={{ flexDirection: "row", alignItems: "center" }}
                    >
                        <CustomIcon
                            provider="Ionicons"
                            name="flash"
                            size={18}
                            color={COLORS.TEXT.DARK}
                        />
                        <Typography
                            variant="h3"
                            style={[styles.timeText, { marginLeft: 6 }]}
                        >
                            8 minutes
                        </Typography>
                    </View>
                    <View style={styles.badgeWrap}>
                        <TouchableOpacity
                            onPress={() => navigation.navigate("AllAddress")}
                            style={styles.locationChip}
                        >
                            <CustomIcon
                                provider="Ionicons"
                                name="location"
                                size={14}
                                color={COLORS.primary}
                            />
                            <Typography
                                variant="bodySmall"
                                color={COLORS.TEXT.DARK}
                                style={{ marginLeft: 6 }}
                            >
                                Home
                            </Typography>
                            <CustomIcon
                                provider="Ionicons"
                                name="chevron-down"
                                size={14}
                                color={COLORS.TEXT.DARK}
                                style={{ marginLeft: 4 }}
                            />
                        </TouchableOpacity>
                        <View style={styles.profileIcon}>
                            <CustomIcon
                                provider="Ionicons"
                                name="person-circle"
                                size={24}
                                color={COLORS.TEXT.DARK}
                            />
                        </View>
                    </View>
                </View>

                <SearchBar
                    value={query}
                    onChangeText={setQuery}
                    placeholder={'Search for "Lego"'}
                    containerStyle={{ marginTop: 12 }}
                />
            </View>

            <ScrollView
                contentContainerStyle={{ paddingBottom: tabBarHeight + 20 }}
                showsVerticalScrollIndicator={false}
            >
                {/* Banner Section with Skeleton */}
                {bannerLoading ? (
                    <View style={{ paddingHorizontal: 16, marginTop: 12 }}>
                        <SkeletonLoader
                            items={1}
                            layout={bannerSkeletonLayout}
                            containerStyle={{
                                flexDirection: "column",
                            }}
                            itemContainerStyle={{
                                backgroundColor: COLORS.WHITE,
                                borderWidth: 1,
                                borderColor: COLORS.border.light,
                                padding: 0,
                                marginBottom: 0,
                                shadowColor: COLORS.TEXT.DARK,
                                shadowOffset: { width: 0, height: 6 },
                                shadowOpacity: 0.1,
                                shadowRadius: 12,
                                elevation: 3,
                            }}
                        />
                    </View>
                ) : (
                    <BannerCarousel data={banners} style={{ marginTop: 12 }} />
                )}

                <View style={styles.sectionHeader}>
                    <Typography variant="h4" color={COLORS.TEXT.DARK}>
                        Categories
                    </Typography>
                    <Button
                        onPress={() => navigation.navigate("Services")}
                        title="See All"
                        variant="link"
                        size="medium"
                    />
                </View>

                {/* Categories Section with Skeleton */}
                {serviceCategoriesLoading ? (
                    <SkeletonLoader
                        items={7}
                        layout={categorySkeletonLayout}
                        containerStyle={{
                            paddingHorizontal: 16,
                            marginTop: 8,
                            flexDirection: "row",
                            flexWrap: "wrap",
                            justifyContent: "space-between",
                        }}
                        itemContainerStyle={{
                            width: "30%",
                            marginBottom: 16,
                            alignItems: "center",
                        }}
                    />
                ) : (
                    <CategoryChips
                        data={serviceCategories}
                        onPress={handleCategoryPress}
                        style={{ marginTop: 8 }}
                    />
                )}

                <View style={styles.sectionHeaderAlt}>
                    <Typography variant="h4" color={COLORS.TEXT.DARK}>
                        #SpecialForYou
                    </Typography>
                    <Button
                        onPress={() => navigation.navigate("Products")}
                        title="See All"
                        variant="link"
                        size="medium"
                    />
                </View>

                {/* Services Section with Skeleton */}
                {productsLoading ? (
                    <SkeletonLoader
                        items={3}
                        layout={serviceCardSkeletonLayout}
                        containerStyle={{
                            paddingHorizontal: 16,
                            marginTop: 8,
                            flexDirection: "row",
                        }}
                        itemContainerStyle={{
                            width: 160,
                            marginRight: 16,
                            marginBottom: 0,
                        }}
                    />
                ) : (
                    <FlatList
                        data={products}
                        keyExtractor={i => i._id}
                        renderItem={({ item, index }) => (
                            <ServiceCard
                                title={item.name}
                                provider={"item"}
                                price={"234"}
                                rating={4}
                                style={{ marginLeft: index === 0 ? 16 : 0 }}
                            />
                        )}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{
                            paddingRight: 16,
                            paddingVertical: 8,
                        }}
                        style={{ marginTop: 8 }}
                    />
                )}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.WHITE,
    },
    background: {
        position: "absolute",
        left: 0,
        right: 0,
        top: 0,
        height: Dimensions.get("window").height / 1.5,
    },
    headerWrap: {
        paddingTop: 24,
        paddingHorizontal: 16,
        gap: 12,
    },
    headerRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    timeText: {
        color: COLORS.TEXT.DARK,
    },
    badgeWrap: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    profileIcon: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: COLORS.WHITE,
        borderWidth: 1,
        borderColor: COLORS.GREY[100],
        shadowColor: COLORS.TEXT.DARK,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 6,
        elevation: 2,
    },
    locationChip: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: COLORS.WHITE,
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: COLORS.GREY[100],
    },
    sectionHeader: {
        paddingHorizontal: 16,
        marginTop: 20,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    sectionHeaderAlt: {
        paddingHorizontal: 16,
        marginTop: 20,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
});

export default Home;
