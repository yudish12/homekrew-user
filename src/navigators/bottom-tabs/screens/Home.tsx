import { useCallback, useEffect, useState } from "react";
import {
    View,
    StyleSheet,
    Dimensions,
    FlatList,
    ScrollView,
    TouchableOpacity,
    RefreshControl,
    Image,
    StatusBar,
} from "react-native";
import { COLORS } from "../../../constants/ui";
import { LinearGradient } from "expo-linear-gradient";
import { Typography } from "../../../components/Typography";
import { CustomIcon } from "../../../components/CustomIcon";
import SearchBar from "../../../components/SearchBar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import BannerCarousel from "../../../modules/home/ui/BannerCarousel";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import {
    Banner,
    Product,
    ServiceCategory,
    ServiceTemplate,
} from "../../../types/home-data";
import {
    MembershipPlansServices,
    ServiceCategoryUtil,
    UtilityServices,
} from "../../../services";
import { SkeletonLoader } from "../../../components/SkeletonLoader";
import { MembershipPlan, RootState } from "../../../types";
import MembershipBannerCard from "../../../modules/home/ui/MembershipCard";
import ProductServiceCards from "../../../modules/home/ui/PromotionalCards";
import { useSelector } from "react-redux";
import ActiveBookingsNudge from "../../../modules/home/ui/ActiveBookingNudge";
import { MembershipStatusBadge } from "../../../modules/home/ui/MembershipBadge";
import FeaturedServiceTemplate from "../../../modules/home/ui/FeaturedServiceTemplate";
import { ProductsServices } from "../../../services/products";
import FeaturedProducts from "../../../modules/home/ui/FeaturedProducts";
import { ProductsComingSoon } from "../../../modules/products/ProductsComingSoon";
import { InteriorCalculatorBanner } from "../../../components/InteriorCalculatorBanner";

// Define the ActiveBooking interface
interface ActiveBooking {
    _id: string;
    price: number;
    date: string;
    timeSlot: string;
    status: string;
    service: {
        _id: string;
        title: string;
        description: string;
    };
    serviceTemplate: {
        _id: string;
        title: string;
        description: string;
    };
    vendor: {
        _id: string;
        name: string;
        firstName: string;
        lastName: string;
    };
    address: {
        city: string;
        state: string;
        completeAddress: string;
    };
}

const Home = () => {
    // Existing state
    const [bannerLoading, setBannerLoading] = useState(true);
    const [memberShipPlansLoading, setMemberShipPlansLoading] = useState(true);
    const [servicesLoading, setServicesLoading] = useState(true);

    const [memberShipDetails, setMemberShipDetails] = useState<
        MembershipPlan[]
    >([]);
    const [banners, setBanners] = useState<Banner[]>([]);
    const [serviceCategories, setServiceCategories] = useState<
        ServiceCategory[]
    >([]);
    const [featuredServiceTemplates, setFeaturedServiceTemplates] = useState<
        ServiceTemplate[]
    >([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [productsLoading, setProductsLoading] = useState(false);
    const [
        featuredServiceTemplatesLoading,
        setFeaturedServiceTemplatesLoading,
    ] = useState(false);
    // New state for active bookings
    const [activeBookings, setActiveBookings] = useState<ActiveBooking[]>([]);
    const [activeBookingsLoading, setActiveBookingsLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const insets = useSafeAreaInsets();
    const tabBarHeight = useBottomTabBarHeight();
    const navigation = useNavigation<any>();

    const user = useSelector((state: RootState) => state.auth.user);

    // Calculate days remaining for active membership
    const getMembershipDaysRemaining = useCallback(() => {
        if (!user?.membership || user.membership.status !== "ACTIVE") {
            return null;
        }

        const endDate = new Date(user.membership.endDate);
        const today = new Date();
        const timeDiff = endDate.getTime() - today.getTime();
        const daysRemaining = Math.ceil(timeDiff / (1000 * 3600 * 24));

        return daysRemaining > 0 ? daysRemaining : 0;
    }, [user?.membership]);

    // No sticky/animated header; using static header with gradient background

    // Fetch active bookings function
    const fetchActiveBookings = useCallback(async () => {
        try {
            setActiveBookingsLoading(true);

            // If you have user-specific bookings, use user ID
            let response;

            response = await UtilityServices.getActiveBookings();

            if (response.success && response.data) {
                setActiveBookings(response.data);
            } else {
                setActiveBookings([]);
            }
        } catch (error) {
            console.error("Error fetching active bookings:", error);
            setActiveBookings([]);
        } finally {
            setActiveBookingsLoading(false);
        }
    }, [user?._id]);

    const fetchServices = useCallback(async () => {
        setServicesLoading(true);
        const response = await ServiceCategoryUtil.getCategories(
            1,
            undefined,
            1,
            8,
            true,
        );
        if (response.success && response.data) {
            setServiceCategories(response.data);
        }
        setServicesLoading(false);
    }, []);

    const fetchProducts = useCallback(async () => {
        setProductsLoading(true);
        const response = await ProductsServices.getProducts(1, 8);
        if (response.success && response.data) {
            setProducts(response.data);
        }
        setProductsLoading(false);
    }, []);

    const fetchFeaturedServiceTemplates = useCallback(async () => {
        setFeaturedServiceTemplatesLoading(true);
        const response = await UtilityServices.getFeaturedServiceTemplate();
        if (response.success && response.data) {
            setFeaturedServiceTemplates(response.data);
        }
        setFeaturedServiceTemplatesLoading(false);
    }, []);

    // Fetch home data function
    const fetchHomeData = useCallback(async () => {
        setBannerLoading(true);
        setMemberShipPlansLoading(true);
        setProductsLoading(true);
        try {
            // Fetch banners
            const bannerResponse = await UtilityServices.getBanners();
            if (bannerResponse.success && bannerResponse.data) {
                setBanners(bannerResponse.data);
            }

            // Fetch membership plans
            const membershipResponse =
                await MembershipPlansServices.getMembershipPlans();
            if (membershipResponse.success && membershipResponse.data) {
                setMemberShipDetails(membershipResponse.data);
            }

            // Fetch products
            const productsResponse = await ProductsServices.getProducts(1, 8);
            if (productsResponse.success && productsResponse.data) {
                setProducts(productsResponse.data);
            }
        } catch (error) {
            console.error("Error fetching home data:", error);
        } finally {
            setBannerLoading(false);
            setMemberShipPlansLoading(false);
            setProductsLoading(false);
        }
    }, []);

    // Initial data fetch
    useEffect(() => {
        fetchHomeData();
        fetchServices();
        fetchFeaturedServiceTemplates();
    }, [fetchHomeData]);

    // Fetch bookings when screen comes into focus
    useFocusEffect(
        useCallback(() => {
            fetchActiveBookings();
        }, []),
    );

    // Pull to refresh function
    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        try {
            await Promise.all([fetchHomeData(), fetchActiveBookings()]);
        } finally {
            setRefreshing(false);
        }
    }, [fetchHomeData, fetchActiveBookings]);

    // Handle booking press
    const handleBookingPress = useCallback(
        (booking: ActiveBooking) => {
            navigation.navigate("Services", {
                screen: "PostBooking",
                params: {
                    bookingId: booking._id,
                    booking: booking,
                },
            });
        },
        [navigation],
    );

    // Handle view all bookings press
    const handleViewAllPress = useCallback(() => {
        navigation.navigate("MyBookings", {
            tab: "active",
        });
    }, [navigation]);

    const handleSeeAllPress = useCallback(() => {
        navigation.navigate("Services");
    }, [navigation]);

    const handleServicePress = useCallback(
        (serviceTemplate: ServiceTemplate) => {
            navigation.navigate("Services", {
                screen: "ServiceTemplate",
                params: { serviceTemplateId: serviceTemplate._id },
            });
        },
        [navigation],
    );

    const daysRemaining = getMembershipDaysRemaining();

    // Banner skeleton layout - match the actual banner dimensions
    const bannerSkeletonLayout = [
        {
            width: Dimensions.get("window").width - 32,
            height: 180,
            borderRadius: 18,
        },
    ];

    // Membership card (horizontal list) skeleton layout — existing sizes fine
    const serviceCardSkeletonLayout = [
        { width: 160, height: 90, borderRadius: 8 },
        { width: 120, height: 14, borderRadius: 4, style: { marginTop: 8 } },
        { width: 100, height: 12, borderRadius: 4, style: { marginTop: 4 } },
    ];

    // Product card skeleton layout (matches ProductCard.tsx)
    const productCardSkeletonItemWidth =
        (Dimensions.get("window").width - 48) / 2.5;
    const productCardSkeletonLayout = [
        { width: "100%" as const, height: 140, borderRadius: 12 },
        {
            width: "90%" as const,
            height: 14,
            borderRadius: 4,
            style: { marginTop: 8 },
        },
        { width: 90, height: 12, borderRadius: 4, style: { marginTop: 6 } },
    ];

    // Service template card skeleton layout (matches FeaturedServiceTemplate.tsx)
    const serviceTemplateSkeletonItemWidth =
        (Dimensions.get("window").width - 48) / 2;
    const serviceTemplateCardSkeletonLayout = [
        { width: "100%" as const, height: 120, borderRadius: 12 },
        {
            width: "85%" as const,
            height: 14,
            borderRadius: 4,
            style: { marginTop: 8 },
        },
    ];

    // Active bookings skeleton layout
    const activeBookingsSkeletonLayout = [
        {
            width: Dimensions.get("window").width - 32,
            height: 60,
            borderRadius: 8,
        },
    ];

    const renderItem = ({
        item,
        index,
    }: {
        item: MembershipPlan;
        index: number;
    }) => (
        <MembershipBannerCard
            planName={item.name}
            description={item.description}
            price={item.price}
            durationInDays={item.durationInDays}
            benefits={item.benefits}
            variant={
                item.name.toLowerCase() === "premium" ||
                item.name.toLowerCase() === "gold"
                    ? "premium"
                    : "standard"
            }
            onPress={() =>
                navigation.navigate("MembershipDetails", {
                    screen: "MembershipDetails",
                    params: { ...item },
                })
            }
            key={index}
            style={{ marginTop: 8 }}
        />
    );

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <View style={styles.gradientContainer} pointerEvents="none">
                <LinearGradient
                    style={styles.background}
                    colors={["rgba(27, 117, 187,0.9)", COLORS.WHITE]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 0.6 }}
                />
            </View>

            <ScrollView
                contentContainerStyle={{
                    paddingBottom: tabBarHeight,
                }}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={[COLORS.primary]}
                        tintColor={COLORS.primary}
                    />
                }
            >
                <View style={styles.headerWrap}>
                    <View style={styles.headerRow}>
                        <TouchableOpacity
                            onPress={() => navigation.navigate("AllAddress")}
                            style={styles.locationChip}
                        >
                            <CustomIcon
                                provider="Ionicons"
                                name="location"
                                size={20}
                                color={COLORS.TEXT.DARK}
                            />
                            <Typography
                                variant="h3"
                                color={COLORS.TEXT.DARK}
                                style={{ marginLeft: 6 }}
                            >
                                Home
                            </Typography>
                            <CustomIcon
                                provider="Ionicons"
                                name="chevron-down"
                                size={20}
                                color={COLORS.TEXT.DARK}
                                style={{ marginLeft: 4 }}
                            />
                        </TouchableOpacity>
                        <View style={styles.badgeWrap}>
                            {/* Membership Status Badge */}
                            <MembershipStatusBadge />

                            <TouchableOpacity
                                onPress={() =>
                                    navigation.navigate("EditProfile", {
                                        backEnabled: true,
                                    })
                                }
                                style={styles.profileIcon}
                            >
                                {user?.avatar ? (
                                    <Image
                                        source={{ uri: user.avatar }}
                                        resizeMode="cover"
                                        width={36}
                                        height={36}
                                        style={{ borderRadius: 100000 }}
                                    />
                                ) : (
                                    <CustomIcon
                                        provider="Ionicons"
                                        name="person-circle"
                                        size={24}
                                        color={COLORS.TEXT.DARK}
                                    />
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                <View style={styles.stickyHeader}>
                    <SearchBar
                        value={""}
                        onChangeText={() => {}}
                        placeholder={'Search for "Lego"'}
                        containerStyle={styles.stickySearchBar}
                    />
                </View>
                {/* Banner Section with Skeleton */}
                {bannerLoading ? (
                    <View style={{ paddingHorizontal: 16, marginTop: 12 }}>
                        <SkeletonLoader
                            items={1}
                            layout={bannerSkeletonLayout}
                            containerStyle={{ flexDirection: "column" }}
                            itemContainerStyle={{ marginBottom: 0 }}
                        />
                    </View>
                ) : (
                    <BannerCarousel data={banners} style={{ marginTop: 2 }} />
                )}

                <ProductServiceCards
                    loading={servicesLoading}
                    categories={serviceCategories}
                />

                {/* Interior Calculator Banner */}
                <InteriorCalculatorBanner />

                {/* Featured Products Section */}
                {productsLoading ? (
                    <View style={{ paddingHorizontal: 16, marginTop: 8 }}>
                        <SkeletonLoader
                            items={3}
                            layout={productCardSkeletonLayout}
                            containerStyle={{ flexDirection: "row" }}
                            itemContainerStyle={{
                                width: productCardSkeletonItemWidth,
                                marginRight: 12,
                            }}
                        />
                    </View>
                ) : products.length > 0 ? (
                    <FeaturedProducts
                        title="Most ordered products"
                        products={products}
                        onSeeAllPress={() =>
                            navigation.navigate("Products", {
                                screen: "AllProducts",
                            })
                        }
                        onProductPress={product =>
                            navigation.navigate("ProductStack", {
                                screen: "ProductDetail",
                                params: { productId: product._id },
                            })
                        }
                    />
                ) : (
                    <ProductsComingSoon
                        title="Products launching soon"
                        description="We are adding a curated collection of products very soon. Until then, explore services tailor-made for you."
                        buttonLabel="Explore more"
                        onButtonPress={() => navigation.navigate("Explore")}
                        style={{ marginTop: 16 }}
                    />
                )}

                {/* Active Bookings Nudge with Loading State */}
                {activeBookingsLoading ? (
                    <View style={{ paddingHorizontal: 16, marginTop: 12 }}>
                        <SkeletonLoader
                            items={1}
                            layout={bannerSkeletonLayout}
                            containerStyle={{ flexDirection: "column" }}
                            itemContainerStyle={{ marginBottom: 0 }}
                        />
                    </View>
                ) : activeBookings.length > 0 ? (
                    <ActiveBookingsNudge
                        bookings={activeBookings}
                        navigation={navigation}
                        onBookingPress={handleBookingPress}
                        onViewAllPress={handleViewAllPress}
                    />
                ) : null}

                {featuredServiceTemplatesLoading ? (
                    <View style={{ paddingHorizontal: 16, marginTop: 8 }}>
                        <SkeletonLoader
                            items={3}
                            layout={serviceTemplateCardSkeletonLayout}
                            containerStyle={{ flexDirection: "row" }}
                            itemContainerStyle={{
                                width: serviceTemplateSkeletonItemWidth,
                                marginRight: 12,
                            }}
                        />
                    </View>
                ) : featuredServiceTemplates.length > 0 ? (
                    <FeaturedServiceTemplate
                        serviceTemplates={featuredServiceTemplates}
                        onSeeAllPress={handleSeeAllPress}
                        onServicePress={handleServicePress}
                    />
                ) : null}

                {user?.membership ? null : (
                    <>
                        {/* Membership Plans Section with Skeleton */}
                        {memberShipPlansLoading ? (
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
                                data={memberShipDetails}
                                renderItem={renderItem}
                                keyExtractor={item => item._id}
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={{
                                    paddingRight: 16,
                                    paddingVertical: 8,
                                }}
                                style={{
                                    paddingHorizontal: 16,
                                    paddingVertical: 8,
                                }}
                            />
                        )}
                    </>
                )}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "transparent",
    },
    gradientContainer: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: Dimensions.get("window").height,
        zIndex: 0,
    },
    background: {
        position: "absolute",
        left: 0,
        right: 0,
        top: 0,
        height: Dimensions.get("window").height,
        width: "100%",
    },
    headerWrap: {
        paddingRight: 16,
        paddingLeft: 6,
        gap: 12,
        paddingVertical: 16,
        backgroundColor: "transparent",
    },
    headerRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    timeText: {
        color: COLORS.TEXT.DARK,
    },
    stickyHeader: {
        paddingHorizontal: 16,
        paddingBottom: 10,
        paddingTop: 0,
    },
    stickySearchBar: {
        backgroundColor: COLORS.WHITE,
        shadowColor: COLORS.TEXT.DARK,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
        elevation: 2,
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
        backgroundColor: "transparent",
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 16,
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
    // Membership Status Badge Styles
    membershipContainer: {
        marginTop: 8,
        paddingHorizontal: 8,
    },
    membershipBadge: {
        position: "relative",
        borderRadius: 16,
    },
    membershipGradient: {
        borderRadius: 16,
        padding: 2,
    },
    membershipContent: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: COLORS.primaryGlow,
        borderRadius: 14,
        paddingHorizontal: 12,
        paddingVertical: 8,
    },
    membershipIconContainer: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: COLORS.primaryShadow,
        alignItems: "center",
        justifyContent: "center",
        marginRight: 8,
    },
    membershipTextContainer: {
        flex: 1,
    },
    membershipTitle: {
        color: "#FFFFFF",
        fontWeight: "600",
        fontSize: 13,
    },
    membershipSubtitle: {
        color: "rgba(255, 255, 255, 0.8)",
        fontSize: 11,
        marginTop: 1,
    },
});

export default Home;
