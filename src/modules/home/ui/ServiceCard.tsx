import React from "react";
import {
    View,
    StyleSheet,
    Image,
    TouchableOpacity,
    ViewStyle,
    ImageSourcePropType,
} from "react-native";
import { COLORS } from "../../../constants/ui";
import { Typography } from "../../../components/Typography";
import { CustomIcon } from "../../../components/CustomIcon";

export interface ServiceCardProps {
    image?: ImageSourcePropType;
    title: string;
    provider: string;
    price: string;
    rating?: number;
    onPress?: () => void;
    style?: ViewStyle;
}

// Use a better visual placeholder from assets
const placeholderImage = require("../../../../assets/splash-icon.png");

const ServiceCard: React.FC<ServiceCardProps> = ({
    image,
    title,
    provider,
    price,
    rating = 0,
    onPress,
    style,
}) => {
    return (
        <TouchableOpacity
            style={[styles.card, style]}
            activeOpacity={0.9}
            onPress={onPress}
        >
            <View style={styles.imageWrap}>
                <Image
                    source={image || placeholderImage}
                    style={styles.image}
                    resizeMode="cover"
                />
                <View style={styles.ratingPill}>
                    <CustomIcon
                        provider="Ionicons"
                        name="star"
                        size={12}
                        color="#FFC107"
                    />
                    <Typography variant="caption" style={{ marginLeft: 4 }}>
                        {rating.toFixed(1)}
                    </Typography>
                </View>
                <View style={styles.bookmarkBtn}>
                    <CustomIcon
                        provider="Ionicons"
                        name="bookmark"
                        size={16}
                        color={COLORS.primary}
                    />
                </View>
            </View>
            <View style={styles.info}>
                <Typography variant="h5" color={COLORS.TEXT.DARK}>
                    {title}
                </Typography>
                <View style={styles.row}>
                    <CustomIcon
                        provider="Ionicons"
                        name="person"
                        size={14}
                        color={COLORS.GREY[400]}
                    />
                    <Typography
                        variant="bodySmall"
                        color={COLORS.GREY[500]}
                        style={{ marginLeft: 6 }}
                    >
                        {provider}
                    </Typography>
                </View>
                <Typography variant="h5" color={COLORS.GREEN[700]}>
                    {price}
                </Typography>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        width: 200,
        borderRadius: 16,
        backgroundColor: COLORS.WHITE,
        overflow: "hidden",
        shadowColor: COLORS.TEXT.DARK,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 10,
        elevation: 2,
        marginRight: 12,
        borderWidth: 1,
        borderColor: COLORS.GREY[100],
    },
    imageWrap: {
        width: "100%",
        height: 120,
        backgroundColor: COLORS.GREY[200],
    },
    image: {
        width: "100%",
        height: "100%",
    },
    ratingPill: {
        position: "absolute",
        top: 10,
        left: 10,
        backgroundColor: COLORS.WHITE,
        borderRadius: 12,
        paddingHorizontal: 8,
        paddingVertical: 4,
        flexDirection: "row",
        alignItems: "center",
    },
    bookmarkBtn: {
        position: "absolute",
        top: 10,
        right: 10,
        backgroundColor: COLORS.WHITE,
        width: 28,
        height: 28,
        borderRadius: 14,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: COLORS.TEXT.DARK,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
        elevation: 2,
    },
    info: {
        padding: 12,
        gap: 6,
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
    },
});

export default ServiceCard;
