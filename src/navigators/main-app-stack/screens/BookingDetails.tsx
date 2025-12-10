import React from "react";
import {
    View,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    Linking,
} from "react-native";
import { SafeAreaView } from "../../../components/SafeAreaView";
import {
    H3,
    Body,
    Caption,
    H4,
    BodySmall,
} from "../../../components/Typography";
import { COLORS } from "../../../constants/ui";
import { Button, OutlineButton } from "../../../components/Button";
import { CustomIcon } from "../../../components/CustomIcon";
import Header from "../../../components/header";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import {
    BookingHistory,
    BookingHistoryItem,
} from "../../../types/services/orders";
import uiUtils from "../../../utils/ui";

const StatusBadge: React.FC<{ status: string; statusBadge: string }> = ({
    status,
    statusBadge,
}) => {
    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case "completed":
                return COLORS.GREEN[700];
            case "cancelled":
                return COLORS.RED[500];
            case "pending":
            case "vendor_assigned":
                return COLORS.primary;
            case "in_progress":
                return "#F59E0B";
            default:
                return COLORS.GREY[500];
        }
    };

    return (
        <View
            style={[
                styles.statusBadge,
                {
                    backgroundColor: uiUtils.color.addAlpha(
                        getStatusColor(status),
                        0.12,
                    ),
                },
            ]}
        >
            <Caption
                style={[styles.statusText, { color: getStatusColor(status) }]}
            >
                {status?.replace("_", " ").toUpperCase()}
            </Caption>
        </View>
    );
};

const InfoCard: React.FC<{ title: string; children: React.ReactNode }> = ({
    title,
    children,
}) => (
    <View style={styles.infoCard}>
        <H4 style={{ color: COLORS.TEXT.DARK, marginBottom: 12 }}>{title}</H4>
        {children}
    </View>
);

const InfoRow: React.FC<{
    label: string;
    value: string;
    icon?: string;
    isSmallText?: boolean;
    onPress?: () => void;
}> = ({ label, value, icon, onPress, isSmallText = false }) => (
    <TouchableOpacity
        style={styles.infoRow}
        onPress={onPress}
        disabled={!onPress}
        activeOpacity={onPress ? 0.7 : 1}
    >
        <View style={styles.infoRowContent}>
            {icon && (
                <CustomIcon
                    provider="Ionicons"
                    name={icon}
                    size={16}
                    color={COLORS.GREY[500]}
                />
            )}
            <View style={styles.infoRowText}>
                <Caption color={COLORS.GREY[500]}>{label}</Caption>
                {isSmallText ? (
                    <Caption style={{ color: COLORS.TEXT.DARK, marginTop: 2 }}>
                        {value}
                    </Caption>
                ) : (
                    <Body style={{ color: COLORS.TEXT.DARK, marginTop: 2 }}>
                        {value}
                    </Body>
                )}
            </View>
        </View>
        {onPress && (
            <CustomIcon
                provider="Ionicons"
                name="chevron-forward"
                size={16}
                color={COLORS.GREY[400]}
            />
        )}
    </TouchableOpacity>
);

const VendorCard: React.FC<{
    vendor: BookingHistoryItem["vendorSearch"]["assignedVendor"];
}> = ({ vendor }) => {
    const handleCall = () => {
        Linking.openURL(`tel:${vendor.vendorId.phoneNumber}`);
    };

    return (
        <View style={styles.vendorCard}>
            <View style={styles.vendorHeader}>
                <View style={styles.vendorAvatar}>
                    {vendor.vendorId.selfieImage ? (
                        <Image
                            source={{ uri: vendor.vendorId.selfieImage }}
                            style={styles.avatarImage}
                        />
                    ) : (
                        <CustomIcon
                            provider="Ionicons"
                            name="person"
                            size={24}
                            color={COLORS.WHITE}
                        />
                    )}
                </View>
                <View style={styles.vendorInfo}>
                    <H4 style={{ color: COLORS.TEXT.DARK }}>
                        {vendor.vendorId.firstName} {vendor.vendorId.lastName}
                    </H4>
                    <Caption color={COLORS.GREY[500]}>
                        Assigned on{" "}
                        {new Date(vendor.assignedAt).toLocaleDateString()}
                    </Caption>
                </View>
            </View>

            <View style={styles.vendorActions}>
                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={handleCall}
                >
                    <CustomIcon
                        provider="Ionicons"
                        name="call"
                        size={16}
                        color={COLORS.primary}
                    />
                    <Caption style={{ color: COLORS.primary, marginLeft: 4 }}>
                        Call
                    </Caption>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const PricingBreakdown: React.FC<{
    pricing: BookingHistoryItem["pricing"];
}> = ({ pricing }) => (
    <View style={styles.pricingCard}>
        <View style={styles.pricingRow}>
            <Body color={COLORS.GREY[500]}>Base Price</Body>
            <Body style={{ color: COLORS.TEXT.DARK }}>
                ₹{pricing.basePrice}
            </Body>
        </View>
        {pricing.membershipDiscount > 0 && (
            <View style={styles.pricingRow}>
                <Body color={COLORS.GREEN[700]}>Membership Discount</Body>
                <Body style={{ color: COLORS.GREEN[700] }}>
                    -₹{pricing.membershipDiscount}
                </Body>
            </View>
        )}
        {pricing.couponDiscount > 0 && (
            <View style={styles.pricingRow}>
                <Body color={COLORS.GREEN[700]}>Coupon Discount</Body>
                <Body style={{ color: COLORS.GREEN[700] }}>
                    -₹{pricing.couponDiscount}
                </Body>
            </View>
        )}
        {pricing.addOnsTotal > 0 && (
            <View style={styles.pricingRow}>
                <Body color={COLORS.RED[500]}>Add-ons Total</Body>
                <Body style={{ color: COLORS.RED[500] }}>
                    +₹{pricing.addOnsTotal}
                </Body>
            </View>
        )}
        <View style={styles.pricingRow}>
            <Body color={COLORS.GREY[500]}>Platform Fees and taxes</Body>
            <Body style={{ color: COLORS.TEXT.DARK }}>
                ₹{(pricing.platformFee + pricing.taxAmount).toFixed(2)}
            </Body>
        </View>
        <View style={[styles.pricingRow, styles.totalRow]}>
            <H4 style={{ color: COLORS.TEXT.DARK }}>Total</H4>
            <H4 style={{ color: COLORS.TEXT.DARK }}>
                ₹{pricing.totalAmount.toFixed(2)}
            </H4>
        </View>
    </View>
);

const BookingDetails: React.FC = () => {
    const navigation = useNavigation<any>();
    const route = useRoute();
    const { booking } = route.params as { booking: BookingHistory };
    if (!booking) {
        return (
            <SafeAreaView>
                <Header
                    backHandler={() => navigation.goBack()}
                    backButton={true}
                    title="Booking Details"
                />
                <View style={styles.errorContainer}>
                    <H3 color={COLORS.RED[500]}>Booking not found</H3>
                    <Button
                        title="Go Back"
                        onPress={() => navigation.goBack()}
                        style={{ marginTop: 20 }}
                    />
                </View>
            </SafeAreaView>
        );
    }

    const handleMapPress = () => {
        // You can implement map navigation here
        console.log("Open map for address:", booking.address.completeAddress);
    };

    const handleRateService = () => {
        // Implement rating logic
        console.log("Rate service for booking:", booking._id);
    };

    const handlePayNow = () => {
        // Implement payment logic
        console.log("Pay now for booking:", booking._id);
    };

    return (
        <SafeAreaView style={{ flex: 1, justifyContent: "space-between" }}>
            <Header
                backHandler={() => navigation.goBack()}
                backButton={true}
                title="Booking Details"
            />

            <ScrollView
                style={styles.container}
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                {/* Status Header */}
                <View style={styles.statusHeader}>
                    <View style={styles.statusInfo}>
                        <H4 style={{ color: COLORS.TEXT.DARK }}>
                            {booking?.service?.title}
                        </H4>
                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "space-between",
                                alignItems: "center",
                                marginTop: 4,
                            }}
                        >
                            <Caption
                                color={COLORS.GREY[500]}
                                style={{ marginTop: 4, width: "50%" }}
                            >
                                {new Intl.DateTimeFormat("en-US", {
                                    weekday: "short",
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                }).format(new Date(booking.date))}{" "}
                                • {booking.timeSlot}
                            </Caption>
                            <StatusBadge
                                status={booking.status}
                                statusBadge={booking.statusBadge}
                            />
                        </View>
                    </View>
                </View>

                {/* Service Information */}
                <InfoCard title="Service Information">
                    <InfoRow
                        label="Service"
                        value={booking.service.title}
                        icon="construct"
                    />
                    <InfoRow
                        isSmallText={true}
                        label="Description"
                        value={booking?.service?.description}
                        icon="list"
                    />
                    {(booking.status === "arrived" ||
                        booking.status === "vendor_assigned" ||
                        booking.status === "in_progress") &&
                        booking?.otpDeatils?.otp && (
                            <InfoRow
                                label="OTP"
                                value={booking?.otpDeatils?.otp ?? ""}
                                icon="key"
                            />
                        )}
                    {booking.specialRequirements && (
                        <InfoRow
                            label="Special Requirements"
                            value={booking?.specialRequirements}
                            icon="document-text"
                        />
                    )}
                </InfoCard>

                {/* Address Information */}
                <InfoCard title="Service Address">
                    <InfoRow
                        label="Address"
                        value={booking.address?.completeAddress ?? ""}
                        icon="location"
                        onPress={handleMapPress}
                    />
                    {booking.address.landmark && (
                        <InfoRow
                            label="Landmark"
                            value={booking.address.landmark}
                            icon="flag"
                        />
                    )}
                </InfoCard>

                {/* Vendor Information */}
                {booking.vendorSearch?.assignedVendor && (
                    <InfoCard title="Assigned Vendor">
                        <VendorCard
                            vendor={booking.vendorSearch.assignedVendor}
                        />
                    </InfoCard>
                )}

                {/* Pricing Information */}
                {booking.status !== "expired" ? (
                    <InfoCard title="Pricing Details">
                        <PricingBreakdown pricing={booking.pricing} />
                    </InfoCard>
                ) : null}

                {/* Booking Information */}
                <InfoCard title="Booking Information">
                    <InfoRow
                        label="Booking ID"
                        value={booking.bookingId}
                        icon="receipt"
                    />
                    <InfoRow
                        label="Booking Status"
                        value={booking.status}
                        icon="card"
                    />
                </InfoCard>
            </ScrollView>
            {/* Action Buttons */}
            {booking.status === "arrived" ||
            booking.status === "vendor_assigned" ||
            booking.status === "in_progress" ? (
                <View style={styles.actionButtons}>
                    <Button
                        title="Manage Booking"
                        style={{
                            flex: 1,
                            backgroundColor: COLORS.primaryLight,
                            borderColor: COLORS.primary,
                            borderWidth: 1,
                        }}
                        textStyle={{
                            color: COLORS.primary,
                        }}
                        onPress={() => {
                            navigation.navigate("Services", {
                                screen: "PostBooking",
                                params: {
                                    bookingId: booking._id,
                                },
                            });
                        }}
                    />
                </View>
            ) : null}
        </SafeAreaView>
    );
};

export default BookingDetails;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.WHITE,
    },
    content: {
        paddingHorizontal: uiUtils.spacing.getHorizontalPadding(),
        paddingTop: 16,
        paddingBottom: 24,
    },
    statusHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 24,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border.light,
    },
    statusInfo: {
        flex: 1,
        marginRight: 12,
    },
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        alignSelf: "flex-start",
    },
    statusText: {
        fontSize: 11,
        fontWeight: "600",
    },
    infoCard: {
        backgroundColor: COLORS.WHITE,
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: COLORS.border.light,
        shadowColor: COLORS.TEXT.DARK,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
        elevation: 1,
    },
    infoRow: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border.light,
    },
    infoRowContent: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
    },
    infoRowText: {
        marginLeft: 12,
        flex: 1,
    },
    vendorCard: {
        backgroundColor: COLORS.primaryLight,
        borderRadius: 12,
        padding: 16,
    },
    vendorHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
    },
    vendorAvatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: COLORS.primary,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
    },
    avatarImage: {
        width: 48,
        height: 48,
        borderRadius: 24,
    },
    vendorInfo: {
        flex: 1,
    },
    vendorActions: {
        flexDirection: "row",
        justifyContent: "space-around",
    },
    actionButton: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 8,
        paddingHorizontal: 16,
        backgroundColor: COLORS.WHITE,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: COLORS.border.light,
    },
    pricingCard: {
        backgroundColor: COLORS.primaryLight,
        borderRadius: 12,
        padding: 16,
    },
    pricingRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 6,
    },
    totalRow: {
        borderTopWidth: 1,
        borderTopColor: COLORS.border.light,
        marginTop: 8,
        paddingTop: 12,
    },
    actionButtons: {
        flexDirection: "row",
        borderTopColor: COLORS.border.light,
        borderTopWidth: 1,
        paddingHorizontal: 20,
        paddingTop: 16,
    },
    errorContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 32,
    },
});
