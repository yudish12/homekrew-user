import React, { useCallback, useEffect, useState } from "react";
import {
    StyleSheet,
    View,
    FlatList,
    Dimensions,
    Image,
    Text,
} from "react-native";
import { SafeAreaView } from "../../../components/SafeAreaView";
import { COLORS } from "../../../constants/ui";
import { useNavigation, useRoute } from "@react-navigation/native";
import { ServiceCategoryUtil } from "../../../services";
import { ServiceTemplate } from "../../../types/home-data";
import SkeletonLoader from "../../../components/SkeletonLoader";
import { BackButton } from "../../../components/BackButton";
import { Typography } from "../../../components/Typography";
import ServiceDetailCard from "../../../modules/service-flow/ui/ServiceDetailCard";
import { fontFamily } from "../../../lib";

const ServiceDetails = () => {
    const [selectedService, setSelectedService] = useState("5"); // Floor Cleaning is selected
    const navigation = useNavigation<any>();
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const [serviceTemplates, setServiceTemplates] = useState<ServiceTemplate[]>(
        [],
    );

    const { serviceId, subCategoryId, serviceName, image, description } =
        useRoute().params as {
            serviceId: string;
            subCategoryId: string;
            serviceName: string;
            image: string;
            description: string;
        };

    const handleServicePress = (templateId: string) => {
        setSelectedService(templateId);
        // Navigate to service template with service ID
        navigation.navigate("ServiceTemplate", {
            serviceTemplateId: templateId,
            serviceId,
        });
    };

    const handleAddPress = (templateId: string) => {
        // Navigate to service template with service ID
        navigation.navigate("ServiceTemplate", {
            serviceTemplateId: templateId,
            serviceId,
        });
    };

    const fetchServiceTemplates = useCallback(async () => {
        setLoading(true);
        const response = await ServiceCategoryUtil.getServiceTemplates(
            serviceId,
            subCategoryId,
        );
        setServiceTemplates(response?.data ?? []);
        setLoading(false);
    }, [serviceId]);

    useEffect(() => {
        fetchServiceTemplates();
    }, [fetchServiceTemplates]);

    const formatPrice = (price: number, currency: string = "INR") => {
        const currencySymbol = currency === "INR" ? "₹" : currency;
        return `${currencySymbol}${price.toLocaleString("en-IN")}`;
    };

    const renderServiceCard = ({ item }: { item: ServiceTemplate }) => {
        const basePrice = item.pricingGuidelines?.basePrice
            ? formatPrice(
                  item.pricingGuidelines.basePrice,
                  item.pricingGuidelines.currency,
              )
            : item.formattedPrice;

        const maxPrice = item.pricingGuidelines?.maxPrice
            ? formatPrice(
                  item.pricingGuidelines.maxPrice,
                  item.pricingGuidelines.currency,
              )
            : undefined;

        const duration = item.estimatedDuration?.value || undefined;
        const rating = item.vendorStats?.averageRating || 4.77;
        const reviewCount = item.vendorStats?.total || 0;

        const pricePerUnit = item.pricingGuidelines?.basePrice
            ? `${formatPrice(
                  item.pricingGuidelines.basePrice,
                  item.pricingGuidelines.currency,
              )} per AC`
            : undefined;

        const packBadge =
            item.images && item.images.length > 1
                ? `${item.images.length} ACs PACK`
                : undefined;

        return (
            <ServiceDetailCard
                title={item.title}
                rating={rating}
                reviewCount={reviewCount}
                basePrice={basePrice}
                originalPrice={maxPrice}
                duration={duration?.toString() || undefined}
                pricePerUnit={undefined}
                description={item.description}
                packBadge={packBadge}
                image={item.image}
                onPress={() => handleServicePress(item._id)}
                onAddPress={() => handleAddPress(item._id)}
            />
        );
    };

    const renderBanner = () => (
        <View style={styles.bannerContainer}>
            <View style={styles.bannerContent}>
                <Typography style={styles.bannerTitle} color={COLORS.TEXT.DARK}>
                    {serviceName}
                </Typography>
                <Typography variant="caption" color={COLORS.GREY[500]}>
                    {description}
                </Typography>
            </View>
            {image && (
                <Image
                    source={{ uri: image }}
                    style={styles.bannerImage}
                    resizeMode="cover"
                />
            )}
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View
                style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 10,
                    paddingTop: 8,
                }}
            >
                <BackButton
                    backButtonStyle={{ position: "static" }}
                    onPress={() => navigation.goBack()}
                />
            </View>

            {renderBanner()}

            {loading ? (
                <SkeletonLoader
                    layout={[
                        {
                            width: Dimensions.get("window").width - 40,
                            height: 120,
                            borderRadius: 12,
                        },
                        {
                            width: Dimensions.get("window").width - 40,
                            height: 120,
                            borderRadius: 12,
                        },
                        {
                            width: Dimensions.get("window").width - 40,
                            height: 120,
                            borderRadius: 12,
                        },
                    ]}
                    itemContainerStyle={styles.servicesList}
                    pulseDurationMs={1000}
                />
            ) : (
                <FlatList
                    data={serviceTemplates}
                    renderItem={renderServiceCard}
                    keyExtractor={item => item._id}
                    contentContainerStyle={styles.servicesList}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </SafeAreaView>
    );
};

export default ServiceDetails;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.WHITE,
    },
    bannerContainer: {
        backgroundColor: "#F9FAFB",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingVertical: 20,
        marginHorizontal: 16,
        marginTop: 16,
        marginBottom: 8,
        borderRadius: 12,
        overflow: "hidden",
    },
    bannerContent: {
        flex: 1,
        paddingRight: 16,
    },
    bannerTitle: {
        fontFamily: fontFamily.semiBold,
        fontSize: 20,
        lineHeight: 28,
        marginBottom: 8,
        color: COLORS.TEXT.DARK,
    },
    bannerDescription: {
        fontFamily: fontFamily.regular,
        fontSize: 14,
        lineHeight: 20,
        color: COLORS.GREY[500],
    },
    bannerImage: {
        width: 160,
        height: 100,
        borderRadius: 8,
    },
    searchBar: {
        flex: 1,
        marginTop: 16,
    },
    header: {
        backgroundColor: COLORS.WHITE,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.GREY[100],
        shadowOpacity: 0,
        shadowOffset: { width: 0, height: 0 },
        shadowRadius: 0,
        shadowColor: "transparent",
    },
    searchContainer: {
        flexDirection: "row",
        justifyContent: "flex-end",
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: COLORS.WHITE,
    },
    searchButton: {
        padding: 8,
    },
    servicesList: {
        paddingHorizontal: 16,
        paddingTop: 8,
        paddingBottom: 20,
    },
});
