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
import ImageView from "react-native-image-viewing";
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

const ServiceTemplate = () => {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const { serviceId, serviceTemplateId } = route.params || {};

    const [serviceTemplate, setServiceTemplate] =
        useState<ServiceTemplateType | null>();
    const [loading, setLoading] = useState(true);
    const [isImageViewVisible, setIsImageViewVisible] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const handleBookNow = () => {
        // Handle booking logic
        navigation.navigate("ServiceBooking", { serviceId, serviceTemplateId });
    };

    const handleImagePress = (index: number) => {
        setCurrentImageIndex(index);
        setIsImageViewVisible(true);
    };

    const renderGalleryImage = (imageUri: string, index: number) => (
        <TouchableOpacity
            key={index}
            style={[styles.galleryImageContainer]}
            activeOpacity={0.8}
            onPress={() => handleImagePress(index)}
        >
            <Image
                source={{ uri: imageUri }}
                style={styles.galleryImage}
                resizeMode="cover"
            />
        </TouchableOpacity>
    );

    const renderGalleryGrid = (images: string[]) => {
        return (
            <View style={styles.galleryGrid}>
                {images.map((image, ind) => renderGalleryImage(image, ind))}
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

    const imageViewerImages = useMemo(() => {
        return (serviceTemplate?.images ?? []).map(uri => ({ uri }));
    }, [serviceTemplate?.images]);

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
                    titleStyle={{ width: "80%" }}
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
                            uri: serviceTemplate?.image ?? "",
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
                    </View>

                    {renderGalleryGrid(serviceTemplate?.images ?? [])}
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

            {/* Full Screen Image Viewer */}
            <ImageView
                images={imageViewerImages}
                imageIndex={currentImageIndex}
                backgroundColor={"#000000"}
                visible={isImageViewVisible}
                onRequestClose={() => setIsImageViewVisible(false)}
            />
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
        width: "100%",
        flexDirection: "row",
        flexWrap: "wrap", // Add this
        justifyContent: "space-between",
        gap: 12,
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
        width: "48%", // Add this to make 2 items per row
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
        height: 300,
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
