import React from "react";
import {
    View,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import BottomSheet from "../../components/BottomSheet";
import { Typography } from "../../components/Typography";
import { Button } from "../../components/Button";
import { COLORS, WEIGHTS } from "../../constants";
import { Coupon } from "../../types";

interface CouponBottomSheetProps {
    visible: boolean;
    onClose: () => void;
    coupons: Coupon[];
    appliedCoupon: Coupon | null;
    onApply: (coupon: Coupon) => void;
    onRemove: () => void;
}

export const CouponBottomSheet: React.FC<CouponBottomSheetProps> = ({
    visible,
    onClose,
    coupons,
    appliedCoupon,
    onApply,
    onRemove,
}) => {
    const formatDiscount = (coupon: Coupon) => {
        if (coupon.discountType === "percentage") {
            return `${coupon.discountValue}% OFF`;
        }
        return `₹${coupon.discountValue} OFF`;
    };

    const getDiscountDescription = (coupon: Coupon) => {
        if (coupon.discountType === "percentage" && coupon.maxDiscount) {
            return `Get ${coupon.discountValue}% off up to ₹${coupon.maxDiscount}`;
        }
        if (coupon.isFlatDiscount) {
            return `Flat ₹${coupon.discountValue} off on your order`;
        }
        return `Save ${formatDiscount(coupon)} on this booking`;
    };

    const handleCouponAction = (coupon: Coupon) => {
        if (appliedCoupon?.id === coupon.id) {
            onRemove();
        } else {
            onApply(coupon);
        }
    };

    const renderCouponCard = ({ item: coupon }: { item: Coupon }) => {
        const isApplied = appliedCoupon?.id === coupon.id;

        return (
            <View style={[styles.couponCard, isApplied && styles.appliedCard]}>
                <View style={styles.couponLeft}>
                    <View
                        style={[
                            styles.discountBadge,
                            isApplied && styles.appliedBadge,
                        ]}
                    >
                        <Ionicons
                            name="pricetag"
                            size={18}
                            color={isApplied ? COLORS.WHITE : COLORS.primary}
                        />
                        <Typography
                            variant="h4"
                            color={isApplied ? COLORS.WHITE : COLORS.primary}
                            style={styles.discountText}
                        >
                            {formatDiscount(coupon)}
                        </Typography>
                    </View>

                    <View style={styles.couponDetails}>
                        <Typography
                            variant="body"
                            color={COLORS.TEXT.DARK}
                            style={styles.couponCode}
                        >
                            {coupon.code}
                        </Typography>
                        <Typography
                            variant="bodySmall"
                            color={COLORS.TEXT.LIGHT}
                            style={styles.couponDescription}
                        >
                            {getDiscountDescription(coupon)}
                        </Typography>
                    </View>
                </View>

                <TouchableOpacity
                    style={[
                        styles.applyButton,
                        isApplied && styles.removeButton,
                    ]}
                    onPress={() => handleCouponAction(coupon)}
                >
                    <Typography
                        variant="body"
                        color={isApplied ? COLORS.RED[500] : COLORS.primary}
                        style={styles.applyButtonText}
                    >
                        {isApplied ? "Remove" : "Apply"}
                    </Typography>
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <BottomSheet
            visible={visible}
            onClose={onClose}
            height={600}
            enableBackdropDismiss={true}
        >
            <View style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.headerLeft}>
                        <Ionicons
                            name="pricetag-outline"
                            size={24}
                            color={COLORS.primary}
                        />
                        <Typography
                            variant="h3"
                            color={COLORS.TEXT.DARK}
                            style={styles.headerTitle}
                        >
                            Apply Coupon
                        </Typography>
                    </View>
                    <TouchableOpacity
                        onPress={onClose}
                        style={styles.closeButton}
                    >
                        <Ionicons
                            name="close"
                            size={24}
                            color={COLORS.TEXT.DARK}
                        />
                    </TouchableOpacity>
                </View>

                {/* Applied Coupon Info */}
                {appliedCoupon && (
                    <View style={styles.appliedInfo}>
                        <Ionicons
                            name="checkmark-circle"
                            size={20}
                            color={COLORS.GREEN[700]}
                        />
                        <Typography
                            variant="body"
                            color={COLORS.GREEN[700]}
                            style={styles.appliedInfoText}
                        >
                            Coupon "{appliedCoupon.code}" applied successfully!
                        </Typography>
                    </View>
                )}

                {/* Coupons List */}
                <FlatList
                    data={coupons}
                    renderItem={renderCouponCard}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.couponsList}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={
                        <View style={styles.emptyState}>
                            <Ionicons
                                name="ticket-outline"
                                size={64}
                                color={COLORS.GREY[200]}
                            />
                            <Typography
                                variant="body"
                                color={COLORS.TEXT.LIGHT}
                                style={styles.emptyText}
                            >
                                No coupons available at the moment
                            </Typography>
                        </View>
                    }
                />
            </View>
        </BottomSheet>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 8,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.GREY[100],
    },
    headerLeft: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    headerTitle: {
        fontWeight: WEIGHTS.BOLD,
    },
    closeButton: {
        padding: 4,
    },
    appliedInfo: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#E8F5E9",
        padding: 12,
        borderRadius: 8,
        marginBottom: 16,
        gap: 8,
    },
    appliedInfoText: {
        flex: 1,
        fontWeight: WEIGHTS.MEDIUM,
    },
    couponsList: {
        paddingBottom: 20,
    },
    couponCard: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: COLORS.WHITE,
        borderWidth: 1.5,
        borderColor: COLORS.GREY[200],
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderStyle: "dashed",
    },
    appliedCard: {
        borderColor: COLORS.primary,
        backgroundColor: COLORS.primaryLight,
        borderStyle: "solid",
    },
    couponLeft: {
        flex: 1,
        gap: 12,
    },
    discountBadge: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: COLORS.primaryLight,
        alignSelf: "flex-start",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        gap: 6,
    },
    appliedBadge: {
        backgroundColor: COLORS.primary,
    },
    discountText: {
        fontWeight: WEIGHTS.BOLD,
    },
    couponDetails: {
        gap: 4,
    },
    couponCode: {
        fontWeight: WEIGHTS.BOLD,
        letterSpacing: 0.5,
        textTransform: "uppercase",
    },
    couponDescription: {
        lineHeight: 18,
    },
    applyButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: COLORS.primary,
        backgroundColor: COLORS.primaryLight,
    },
    removeButton: {
        borderColor: COLORS.RED[500],
        backgroundColor: "#FFEBEE",
    },
    applyButtonText: {
        fontWeight: WEIGHTS.SEMI_BOLD,
        fontSize: 14,
    },
    emptyState: {
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 60,
        gap: 16,
    },
    emptyText: {
        textAlign: "center",
    },
});
