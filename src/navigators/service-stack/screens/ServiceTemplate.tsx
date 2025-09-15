import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
    StyleSheet,
    View,
    ScrollView,
    TouchableOpacity,
    Image,
    Dimensions,
    ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "../../../components/SafeAreaView";
import { Typography } from "../../../components/Typography";
import { Button } from "../../../components/Button";
import { COLORS } from "../../../constants/ui";
import { useNavigation, useRoute } from "@react-navigation/native";
import Header from "../../../components/header";
import { ServiceTemplate as ServiceTemplateType } from "../../../types/home-data";
import { ServiceCategoryUtil } from "../../../services";
import { BackButton } from "../../../components/BackButton";

const { width } = Dimensions.get("window");

// Service data based on the Car Repairing image
const serviceData = {
    id: "1",
    title: "Car Repairing",
    provider: "Wade Warren",
    price: "৳182",
    description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    headerImage:
        "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=300&fit=crop",
    galleryImages: [
        "https://images.unsplash.com/photo-1486754735734-325b5831c3ad?w=200&h=300&fit=crop", // Large image (spans 2 rows)
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=150&fit=crop", // Top right
        "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=200&h=150&fit=crop", // Middle right
        "https://images.unsplash.com/photo-1486754735734-325b5831c3ad?w=200&h=150&fit=crop", // Middle left
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=150&fit=crop", // Bottom left
        "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=200&h=150&fit=crop", // Bottom right
    ],
};

const ServiceTemplate = () => {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const { serviceId, serviceTemplateId } = route.params || {};

    const [serviceTemplate, setServiceTemplate] =
        useState<ServiceTemplateType | null>();
    const [loading, setLoading] = useState(true);

    const url = useMemo(
        () => serviceTemplate?.images.find(image => image.isPrimary)?.url ?? "",
        [serviceTemplate],
    );

    const handleBookNow = () => {
        // Handle booking logic
        navigation.navigate("ServiceBooking", { serviceId, serviceTemplateId });
    };

    const renderGalleryImage = (
        imageUri: string,
        index: number,
        isLarge: boolean = false,
    ) => (
        <TouchableOpacity
            key={index}
            style={[
                styles.galleryImageContainer,
                isLarge
                    ? styles.largeImageContainer
                    : styles.smallImageContainer,
            ]}
            activeOpacity={0.8}
        >
            <Image
                source={{ uri: imageUri }}
                style={styles.galleryImage}
                resizeMode="cover"
            />
        </TouchableOpacity>
    );

    const renderGalleryGrid = () => {
        const images = serviceData.galleryImages;

        return (
            <View style={styles.galleryGrid}>
                {/* Left Column */}
                <View style={styles.leftColumn}>
                    {/* Large image (spans 2 rows) */}
                    {renderGalleryImage(images[0], 0, true)}

                    {/* Middle left image */}
                    {renderGalleryImage(images[3], 3, false)}

                    {/* Bottom left image */}
                    {renderGalleryImage(images[4], 4, false)}
                </View>

                {/* Right Column */}
                <View style={styles.rightColumn}>
                    {/* Top right image */}
                    {renderGalleryImage(images[1], 1, false)}

                    {/* Middle right image */}
                    {renderGalleryImage(images[2], 2, false)}

                    {/* Bottom right image */}
                    {renderGalleryImage(images[5], 5, true)}
                </View>
            </View>
        );
    };

    const fetchServiceTemplateDetails = useCallback(async () => {
        setLoading(true);
        const response = await ServiceCategoryUtil.getServiceTemplateById(
            serviceTemplateId,
        );
        setServiceTemplate(response?.data ?? null);
        setLoading(false);
    }, [serviceTemplateId]);

    useEffect(() => {
        fetchServiceTemplateDetails();
    }, [fetchServiceTemplateDetails]);

    if (loading)
        return (
            <View
                style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        );

    return (
        <SafeAreaView style={styles.container}>
            <View
                style={{
                    justifyContent: "center",
                    paddingHorizontal: 10,
                    alignItems: "center",

                    backgroundColor: "transparent",
                }}
            >
                <Header
                    title={serviceTemplate?.title ?? ""}
                    backButton={false}
                    style={{
                        shadowOpacity: 0,
                        shadowOffset: { width: 0, height: 0 },
                        shadowRadius: 0,
                        shadowColor: "transparent",
                    }}
                    backHandler={() => navigation.goBack()}
                    showLogo={false}
                    backButtonStyle={{ top: 5 }}
                />
                <BackButton onPress={() => navigation.goBack()} />
            </View>
            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
            >
                {/* Header Image */}
                <View style={styles.headerImageContainer}>
                    <Image
                        source={{
                            uri: url ?? "",
                        }}
                        style={styles.headerImage}
                        resizeMode="cover"
                    />
                </View>

                {/* Service Details Section */}
                <View style={styles.serviceDetailsSection}>
                    <View style={styles.serviceInfo}>
                        <Typography
                            variant="h4"
                            color={COLORS.TEXT.DARK}
                            style={styles.serviceTitle}
                        >
                            {serviceTemplate?.title}
                        </Typography>
                        <Typography
                            variant="body"
                            color={COLORS.TEXT.DARK}
                            style={styles.providerName}
                        >
                            {serviceTemplate?.description}
                        </Typography>
                    </View>

                    <View style={styles.priceAndButton}>
                        <Typography
                            variant="h3"
                            color={COLORS.primary}
                            style={styles.price}
                        >
                            {serviceTemplate?.formattedPrice}
                        </Typography>
                        <TouchableOpacity
                            style={styles.addButton}
                            activeOpacity={0.8}
                        >
                            <Typography
                                variant="button"
                                color={COLORS.WHITE}
                                style={styles.addButtonText}
                            >
                                Add
                            </Typography>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* About Me Section */}
                <View style={styles.aboutSection}>
                    <Typography
                        variant="h4"
                        color={COLORS.TEXT.DARK}
                        style={styles.sectionTitle}
                    >
                        About me
                    </Typography>
                    <Typography
                        variant="body"
                        color={COLORS.TEXT.DARK}
                        style={styles.description}
                    >
                        {serviceTemplate?.description}
                    </Typography>
                </View>

                {/* Photo & Videos Section */}
                <View style={styles.gallerySection}>
                    <View style={styles.galleryHeader}>
                        <Typography
                            variant="h4"
                            color={COLORS.TEXT.DARK}
                            style={styles.sectionTitle}
                        >
                            Photo & Videos
                        </Typography>
                        <TouchableOpacity activeOpacity={0.7}>
                            <Typography
                                variant="body"
                                color={COLORS.primary}
                                style={styles.seeAllLink}
                            >
                                See All
                            </Typography>
                        </TouchableOpacity>
                    </View>

                    {renderGalleryGrid()}
                </View>

                {/* Bottom spacing for sticky button */}
                <View style={styles.bottomSpacing} />
            </ScrollView>

            {/* Sticky Book Now Button */}
            <View style={styles.stickyButtonContainer}>
                <Button
                    title="Book Now!"
                    variant="primary"
                    size="large"
                    fullWidth={true}
                    onPress={handleBookNow}
                    style={styles.bookNowButton}
                />
            </View>
        </SafeAreaView>
    );
};

export default ServiceTemplate;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.WHITE,
    },
    scrollView: {
        flex: 1,
    },
    headerImageContainer: {
        width: "100%",
        height: 250,
    },
    headerImage: {
        width: "100%",
        height: "100%",
    },
    serviceDetailsSection: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        paddingHorizontal: 16,
        paddingVertical: 20,
        backgroundColor: COLORS.WHITE,
    },
    serviceInfo: {
        flex: 1,
        marginRight: 16,
    },
    serviceTitle: {
        fontWeight: "700",
        marginBottom: 8,
    },
    providerName: {
        fontWeight: "400",
    },
    priceAndButton: {
        alignItems: "flex-end",
    },
    price: {
        fontWeight: "700",
        marginBottom: 12,
    },
    addButton: {
        backgroundColor: COLORS.primary,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },
    addButtonText: {
        color: COLORS.WHITE,
        fontSize: 14,
        fontWeight: "600",
    },
    aboutSection: {
        paddingHorizontal: 16,
        paddingBottom: 24,
        backgroundColor: COLORS.WHITE,
    },
    sectionTitle: {
        fontWeight: "700",
        marginBottom: 12,
    },
    description: {
        lineHeight: 22,
        marginBottom: 8,
    },
    readMoreLink: {
        fontWeight: "500",
    },
    gallerySection: {
        paddingHorizontal: 16,
        paddingBottom: 24,
        backgroundColor: COLORS.WHITE,
    },
    galleryHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
    },
    seeAllLink: {
        fontWeight: "500",
    },
    galleryGrid: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    leftColumn: {
        width: (width - 48) / 2, // Half width minus padding
        justifyContent: "flex-start",
    },
    rightColumn: {
        width: (width - 48) / 2, // Half width minus padding
        justifyContent: "flex-start",
    },
    galleryImageContainer: {
        borderRadius: 12,
        overflow: "hidden",
        marginBottom: 12,
    },
    largeImageContainer: {
        height: 252, // 2 rows height (120 + 12 + 120)
    },
    smallImageContainer: {
        height: 120, // 1 row height
    },
    galleryImage: {
        width: "100%",
        height: "100%",
    },
    bottomSpacing: {
        height: 100, // Space for sticky button
    },
    stickyButtonContainer: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: COLORS.WHITE,
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 34, // Extra padding from bottom
        borderTopWidth: 1,
        borderTopColor: COLORS.GREY[100],
        shadowColor: COLORS.TEXT.DARK,
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    bookNowButton: {
        borderRadius: 12,
    },
});
