import React from "react";
import {
    View,
    StyleSheet,
    TouchableOpacity,
    ViewStyle,
    Image,
} from "react-native";
import { COLORS } from "../../../constants/ui";
import { Typography } from "../../../components/Typography";
import { ServiceCategory } from "../../../types/home-data";

export interface CategoryItem {
    id: string;
    label: string;
    icon: string;
    color?: string;
}

interface CategoryChipsProps {
    data: ServiceCategory[];
    style?: ViewStyle;
    onPress?: (id: string, name: string) => void;
}

const CategoryChips: React.FC<CategoryChipsProps> = ({
    data,
    style,
    onPress,
}) => {
    const renderCategoryCard = (item: ServiceCategory) => (
        <TouchableOpacity
            key={item._id}
            style={styles.categoryCard}
            activeOpacity={0.8}
            onPress={() => onPress?.(item._id, item.name)}
        >
            <View style={styles.cardContent}>
                <View style={styles.iconSection}>
                    <View style={styles.iconContainer}>
                        <Image
                            source={{
                                uri: item.image,
                            }}
                            style={styles.categoryIcon}
                            resizeMode="contain"
                        />
                    </View>
                </View>
                <View style={styles.textSection}>
                    <Typography
                        variant="h6"
                        color={COLORS.TEXT.DARK}
                        style={styles.categoryName}
                        numberOfLines={2}
                    >
                        {item.name}
                    </Typography>
                    <Typography
                        variant="caption"
                        color={COLORS.GREY[500]}
                        style={styles.serviceCount}
                    >
                        {Math.floor(Math.random() * 20) + 1} Services
                    </Typography>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={[styles.container, style]}>
            <View style={styles.grid}>
                {data.map(item => renderCategoryCard(item))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: "transparent",
    },
    grid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        columnGap: 2,
    },
    categoryCard: {
        width: "31%", // 3 columns with spacing
        backgroundColor: COLORS.WHITE,
        borderRadius: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: COLORS.border.light,
        shadowColor: COLORS.TEXT.DARK,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 2,
        minHeight: 110,
    },
    cardContent: {
        flex: 1,
        justifyContent: "space-between",
    },
    textSection: {
        flex: 1,
        justifyContent: "flex-start",
        marginBottom: 12,
        paddingHorizontal: 12,
    },
    categoryName: {
        fontWeight: "600",
        marginBottom: 4,
        lineHeight: 18,
        fontSize: 14,
    },
    serviceCount: {
        fontSize: 12,
        lineHeight: 16,
        color: COLORS.GREY[500],
    },
    iconSection: {
        alignItems: "flex-end",
        justifyContent: "flex-end",
    },
    iconContainer: {
        width: 80,
        height: 48,
        justifyContent: "flex-end",
        alignItems: "center",
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        marginVertical: 8,
        elevation: 2,
    },
    categoryIcon: {
        width: 80,
        height: 48,
    },
});

export default CategoryChips;
