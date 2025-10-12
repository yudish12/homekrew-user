import React from "react";
import {
    View,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Image,
    Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { COLORS } from "../../../constants/ui";
import { Typography } from "../../../components/Typography";
import { ServiceTemplate } from "../../../types/home-data";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 48) / 2; // Half width minus padding

interface FeaturedServiceTemplateProps {
    title?: string;
    serviceTemplates: ServiceTemplate[];
    onSeeAllPress?: () => void;
    onServicePress?: (serviceTemplate: ServiceTemplate) => void;
}

const FeaturedServiceTemplate: React.FC<FeaturedServiceTemplateProps> = ({
    title = "Popular Services",
    serviceTemplates,
    onSeeAllPress,
    onServicePress,
}) => {
    const navigation = useNavigation<any>();

    const handleServicePress = (serviceTemplate: ServiceTemplate) => {
        if (onServicePress) {
            onServicePress(serviceTemplate);
        } else {
            // Default navigation to ServiceTemplate screen
            navigation.navigate("Services", {
                screen: "ServiceTemplate",
                params: {
                    serviceTemplateId: serviceTemplate._id,
                    serviceId: serviceTemplate.category._id,
                },
            });
        }
    };

    const handleSeeAllPress = () => {
        if (onSeeAllPress) {
            onSeeAllPress();
        } else {
            // Default navigation to all services
            navigation.navigate("Services", {
                screen: "AllServices",
            });
        }
    };

    const renderServiceCard = ({ item }: { item: ServiceTemplate }) => (
        <TouchableOpacity
            style={styles.serviceCard}
            activeOpacity={0.8}
            onPress={() => handleServicePress(item)}
        >
            <View style={styles.imageContainer}>
                <Image
                    source={{ uri: item.image }}
                    style={styles.serviceImage}
                    resizeMode="cover"
                />
            </View>
            <View style={styles.textContainer}>
                <Typography
                    variant="body"
                    color={COLORS.TEXT.DARK}
                    style={styles.serviceTitle}
                    numberOfLines={2}
                >
                    {item.title}
                </Typography>
            </View>
        </TouchableOpacity>
    );

    if (!serviceTemplates || serviceTemplates.length === 0) {
        return null;
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Typography
                    variant="h4"
                    color={COLORS.TEXT.DARK}
                    style={styles.title}
                >
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
                data={serviceTemplates}
                renderItem={renderServiceCard}
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
    title: {
        fontWeight: "700",
        flex: 1,
    },
    seeAllText: {
        fontWeight: "500",
    },
    scrollContent: {
        paddingHorizontal: 16,
    },
    serviceCard: {
        width: CARD_WIDTH,
        backgroundColor: COLORS.WHITE,
        borderRadius: 12,
        overflow: "hidden",
        shadowColor: COLORS.TEXT.DARK,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 2,
        borderWidth: 1,
        borderColor: COLORS.GREY[100],
    },
    imageContainer: {
        height: 120,
        backgroundColor: COLORS.GREY[200],
    },
    serviceImage: {
        width: "100%",
        height: "100%",
    },
    textContainer: {
        padding: 12,
        minHeight: 60,
        justifyContent: "center",
    },
    serviceTitle: {
        fontWeight: "500",
        fontSize: 14,
        lineHeight: 18,
        textAlign: "center",
    },
    separator: {
        width: 12,
    },
});

export default FeaturedServiceTemplate;
