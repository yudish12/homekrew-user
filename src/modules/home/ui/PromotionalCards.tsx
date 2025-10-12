import React from "react";
import {
    View,
    StyleSheet,
    TouchableOpacity,
    ImageBackground,
    Dimensions,
    Image,
    Pressable,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Typography } from "../../../components/Typography";
import { CustomIcon } from "../../../components/CustomIcon";
import { COLORS, WEIGHTS } from "../../../constants/ui";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { ServiceCategory } from "../../../types/home-data";
import SkeletonLoader from "../../../components/SkeletonLoader";
import { fontFamily } from "../../../lib";

// Single Component - Products & Services Cards Vertically Stacked - No Props
const ProductServiceCards = ({
    categories,
    loading,
}: {
    categories: ServiceCategory[];
    loading: boolean;
}) => {
    const navigation = useNavigation<any>();
    const handleViewAllPress = () => {
        navigation?.navigate("Services");
    };

    const serviceCardSkeletonLayout = [
        {
            width: Dimensions.get("window").width / 2 - 60,
            height: 40,
            borderRadius: 4,
            style: { marginTop: 8 },
        },
    ];

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Typography variant="h4" color={COLORS.TEXT.DARK}>
                    Explore Services
                </Typography>
                <TouchableOpacity
                    onPress={handleViewAllPress}
                    style={styles.viewAllButton}
                    activeOpacity={0.7}
                >
                    <Typography
                        variant="bodySmall"
                        color={COLORS.primary}
                        style={styles.viewAllText}
                    >
                        View All
                    </Typography>
                    <CustomIcon
                        provider="Ionicons"
                        name="chevron-forward"
                        size={16}
                        color={COLORS.primary}
                        style={styles.viewAllIcon}
                    />
                </TouchableOpacity>
            </View>
            {/* service card */}
            <View style={styles.featuredCardContainer}>
                {loading ? (
                    <SkeletonLoader
                        items={4}
                        containerStyle={{
                            flexDirection: "row",
                            flexWrap: "wrap",
                            justifyContent: "space-between",
                        }}
                        layout={serviceCardSkeletonLayout}
                    />
                ) : (
                    categories.map((category, index) => {
                        if (index < 2) {
                            return (
                                <Pressable
                                    onPress={() =>
                                        navigation.navigate("Services", {
                                            screen: "ServiceLanding",
                                            params: {
                                                serviceName: category.name,
                                                serviceId: category._id,
                                            },
                                        })
                                    }
                                    style={styles.item}
                                >
                                    <View style={styles.featuredCard}>
                                        <Image
                                            source={{ uri: category.image }}
                                            style={{
                                                width: "100%",
                                                height: 80,
                                                borderRadius: 12,
                                            }}
                                            resizeMode="cover"
                                        />
                                    </View>
                                    <Typography
                                        color={COLORS.TEXT.DARK}
                                        variant="caption"
                                        style={{
                                            fontFamily: fontFamily.medium,
                                            textAlign: "center",
                                        }}
                                    >
                                        {category.name}
                                    </Typography>
                                </Pressable>
                            );
                        } else {
                            return (
                                <Pressable
                                    onPress={() =>
                                        navigation.navigate("Services", {
                                            screen: "ServiceLanding",
                                            params: {
                                                serviceName: category.name,
                                                serviceId: category._id,
                                            },
                                        })
                                    }
                                    style={styles.itemShort}
                                >
                                    <View style={styles.featuredCardShort}>
                                        <Image
                                            source={{ uri: category.image }}
                                            style={{
                                                width: "100%",
                                                height: 70,
                                                borderRadius: 12,
                                            }}
                                            resizeMode="cover"
                                        />
                                    </View>
                                    <Typography
                                        color={COLORS.TEXT.DARK}
                                        style={{
                                            fontFamily: fontFamily.medium,
                                            textAlign: "center",
                                        }}
                                        variant="caption"
                                    >
                                        {category.name}
                                    </Typography>
                                </Pressable>
                            );
                        }
                    })
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: "100%",
        marginRight: 16,
        padding: 16,
        marginTop: 8,
    },
    cardContainer: {
        borderRadius: 20,
        overflow: "hidden",
        elevation: 6,
        shadowColor: COLORS.GREY[900],
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        backgroundColor: COLORS.WHITE,
    },
    imageBackground: {
        flex: 1,
        width: "100%",
        height: "100%",
    },
    backgroundImage: {
        borderRadius: 20,
    },
    gradientOverlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    contentOverlay: {
        flex: 1,
        padding: 20,
        justifyContent: "space-between",
    },
    cardHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    badge: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "rgba(255,255,255,0.25)",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        borderColor: "rgba(255,255,255,0.3)",
    },
    badgeText: {
        marginLeft: 6,
        fontSize: 11,
        fontWeight: WEIGHTS.BOLD,
        letterSpacing: 0.8,
    },
    iconBadge: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: "rgba(255,255,255,0.2)",
        borderWidth: 2,
        borderColor: "rgba(255,255,255,0.3)",
        alignItems: "center",
        justifyContent: "center",
    },
    textSection: {
        alignItems: "center",
        paddingVertical: 8,
    },
    cardTitle: {
        fontWeight: WEIGHTS.BOLD,
        fontSize: 22,
        marginBottom: 6,
        textAlign: "center",
        textShadowColor: "rgba(0,0,0,0.4)",
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },
    cardDescription: {
        fontSize: 14,
        fontWeight: WEIGHTS.MEDIUM,
        lineHeight: 20,
        textAlign: "center",
        paddingHorizontal: 8,
        textShadowColor: "rgba(0,0,0,0.3)",
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },
    actionSection: {
        alignItems: "center",
    },
    ctaButton: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 16,
        gap: 8,
        elevation: 3,
        shadowColor: COLORS.GREY[900],
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
    },
    ctaText: {
        fontWeight: WEIGHTS.BOLD,
        fontSize: 15,
    },
    featuredCardContainer: {
        paddingVertical: 8,
        flexDirection: "row",
        gap: 6,
        rowGap: 0,
        flexWrap: "wrap",
    },
    itemShort: {
        gap: 8,
        width: Dimensions.get("window").width / 3 - 20,
        alignItems: "center",
        paddingVertical: 8,
        borderRadius: 12,
    },
    item: {
        gap: 8,
        width: Dimensions.get("window").width / 2 - 24,
        alignItems: "center",
        paddingVertical: 8,
        borderRadius: 12,
    },
    featuredCardShort: {
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 8,
        width: Dimensions.get("window").width / 3 - 24,
    },
    featuredCard: {
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 8,
        width: Dimensions.get("window").width / 2 - 30,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 4,
    },
    viewAllButton: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 4,
        paddingHorizontal: 8,
        backgroundColor: COLORS.primaryLight,
        borderRadius: 12,
    },
    viewAllText: {
        fontWeight: "600",
        fontSize: 13,
    },
    viewAllIcon: {
        marginLeft: 2,
    },
});

export default ProductServiceCards;
