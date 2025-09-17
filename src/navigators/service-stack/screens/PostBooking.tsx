import React, { useEffect, useMemo, useRef } from "react";
import { Animated, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "../../../components/SafeAreaView";
import { H3, Body, Caption, H4 } from "../../../components/Typography";
import { COLORS } from "../../../constants/ui";
import { Button, OutlineButton } from "../../../components/Button";
import { CustomIcon } from "../../../components/CustomIcon";
import { AddressCard } from "../../../components/AddressCard";
import { BackButton } from "../../../components/BackButton";
import uiUtils from "../../../utils/ui";
import Header from "../../../components/header";
import { OrdersServices } from "../../../services/orders";
import { useRoute } from "@react-navigation/native";

// Toggle this to preview screens
const SHOW_VENDOR_ASSIGNED = true;

const MOCK_ADDRESS = {
    id: "addr_1",
    addressType: "home",
    line1: "221B Baker Street",
    line2: "Near Regent's Park",
    street: "Marylebone",
    city: "London",
    state: "London",
    postalCode: "NW1 6XE",
    landmark: "Next to the museum",
};

const MOCK_FINDING_BOOKING = {
    _id: "68c50f6ad9d3ade0aacb2415",
    status: "pending",
    paymentStatus: "pending",
    date: "2025-09-14T00:00:00.000Z",
    timeSlot: "08:00 AM - 10:00 PM",
    progress: {
        step: 1,
        total: 8,
        percentage: 12.5,
        nextAction: "Searching for available vendors",
    },
    statusFlags: {
        isPending: true,
        isSearching: true,
        hasVendorAssigned: false,
        isAccepted: false,
        isConfirmed: false,
        isOnRoute: false,
        hasArrived: false,
        isInProgress: false,
        isCompleted: false,
        isCancelled: false,
        isRejected: false,
        isFailed: false,
        isExpired: false,
        canCancel: true,
        canRate: false,
        needsPayment: true,
    },
    pricing: {
        basePrice: 750,
        totalAmount: 922.5,
        formattedTotal: "₹922.50",
        paymentStatus: "pending",
    },
    assignedVendor: null,
    timing: {
        bookingDate: "2025-09-14T00:00:00.000Z",
        timeSlot: "08:00 AM - 10:00 PM",
        timeUntilBooking: "Today",
        isExpired: false,
    },
    address: MOCK_ADDRESS,
};

const MOCK_VENDOR_BOOKING = {
    ...MOCK_FINDING_BOOKING,
    statusFlags: {
        ...MOCK_FINDING_BOOKING.statusFlags,
        isSearching: false,
        hasVendorAssigned: true,
        isAccepted: true,
        canCancel: true,
        needsPayment: false,
    },
    paymentStatus: "paid",
    pricing: {
        ...MOCK_FINDING_BOOKING.pricing,
        paymentStatus: "paid",
    },
    assignedVendor: {
        id: "ven_12",
        name: "Rahul Sharma",
        rating: 4.7,
        jobsCompleted: 128,
        phone: "+91 98765 43210",
        eta: "Arriving between 9:00 AM - 10:00 AM",
    },
};

const StatusPill: React.FC<{ color: string; icon: string; text: string }> = ({
    color,
    icon,
    text,
}) => {
    return (
        <View
            style={[
                styles.pill,
                {
                    backgroundColor: uiUtils.color.addAlpha(color, 0.12),
                    borderColor: uiUtils.color.addAlpha(color, 0.35),
                },
            ]}
        >
            <CustomIcon
                provider="Ionicons"
                name={icon}
                size={16}
                color={color}
            />
            <Caption style={{ marginLeft: 6 }} color={color}>
                {text}
            </Caption>
        </View>
    );
};

const ProgressBar: React.FC<{ percentage: number }> = ({ percentage }) => {
    const width = Math.max(4, Math.min(100, percentage));
    return (
        <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${width}%` }]} />
        </View>
    );
};

const SearchingAnimation: React.FC = () => {
    const pulse = useRef(new Animated.Value(0)).current;
    useEffect(() => {
        const loop = Animated.loop(
            Animated.sequence([
                Animated.timing(pulse, {
                    toValue: 1,
                    duration: 900,
                    useNativeDriver: true,
                }),
                Animated.timing(pulse, {
                    toValue: 0,
                    duration: 900,
                    useNativeDriver: true,
                }),
            ]),
        );
        loop.start();
        return () => loop.stop();
    }, [pulse]);

    const scale = pulse.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 1.08],
    });
    const opacity = pulse.interpolate({
        inputRange: [0, 1],
        outputRange: [0.6, 1],
    });

    return (
        <Animated.View
            style={[styles.searchPulse, { transform: [{ scale }], opacity }]}
        >
            <CustomIcon
                provider="Ionicons"
                name="search"
                size={22}
                color={COLORS.primary}
            />
        </Animated.View>
    );
};

const VendorCard: React.FC<{ vendor: any }> = ({ vendor }) => {
    if (!vendor) return null;
    return (
        <View style={styles.card}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
                <View style={styles.vendorAvatar}>
                    <CustomIcon
                        provider="Ionicons"
                        name="person"
                        size={18}
                        color={COLORS.WHITE}
                    />
                </View>
                <View style={{ marginLeft: 12, flex: 1 }}>
                    <H4 style={{ color: COLORS.TEXT.DARK }}>{vendor.name}</H4>
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            marginTop: 2,
                        }}
                    >
                        <CustomIcon
                            provider="Ionicons"
                            name="star"
                            size={14}
                            color={COLORS.GREEN[700]}
                        />
                        <Caption
                            style={{ marginLeft: 6 }}
                            color={COLORS.GREY[500]}
                        >
                            {vendor.rating} • {vendor.jobsCompleted} jobs
                        </Caption>
                    </View>
                </View>
            </View>

            <View style={styles.vendorMetaRow}>
                <CustomIcon
                    provider="Ionicons"
                    name="location"
                    size={16}
                    color={COLORS.GREY[500]}
                />
                <Caption style={{ marginLeft: 6 }} color={COLORS.GREY[500]}>
                    {vendor.eta}
                </Caption>
            </View>

            <View style={{ flexDirection: "row", marginTop: 12 }}>
                <Button
                    title="Call"
                    style={{ flex: 1 }}
                    icon={
                        <CustomIcon
                            provider="Ionicons"
                            name="call"
                            size={18}
                            color={COLORS.WHITE}
                        />
                    }
                />
                <View style={{ width: 12 }} />
                <OutlineButton title="Message" style={{ flex: 1 }} />
            </View>
        </View>
    );
};

const BookingDetailsCard: React.FC<{ booking: any }> = ({ booking }) => {
    return (
        <View style={styles.card}>
            <H3 style={{ color: COLORS.TEXT.DARK }}>Booking details</H3>
            <View style={styles.detailRow}>
                <Caption color={COLORS.GREY[500]}>Date</Caption>
                <Body style={styles.detailValue}>
                    {new Date(booking.date).toDateString()}
                </Body>
            </View>
            <View style={styles.detailRow}>
                <Caption color={COLORS.GREY[500]}>Time</Caption>
                <Body style={styles.detailValue}>{booking.timeSlot}</Body>
            </View>
            <View style={styles.detailRow}>
                <Caption color={COLORS.GREY[500]}>Amount</Caption>
                <Body style={styles.detailValue}>
                    {booking.pricing?.formattedTotal ?? "—"}
                </Body>
            </View>
            <View style={[styles.detailRow, { alignItems: "center" }]}>
                <Caption color={COLORS.GREY[500]}>Payment</Caption>
                <StatusPill
                    color={
                        booking.paymentStatus === "paid"
                            ? COLORS.GREEN[700]
                            : COLORS.primary
                    }
                    icon={
                        booking.paymentStatus === "paid"
                            ? "checkmark-circle"
                            : "card"
                    }
                    text={booking.paymentStatus === "paid" ? "Paid" : "Pending"}
                />
            </View>
        </View>
    );
};

const AddressSection: React.FC<{ address: any | null }> = ({ address }) => {
    if (!address) {
        return (
            <View style={styles.card}>
                <H3 style={{ color: COLORS.TEXT.DARK }}>Service address</H3>
                <Body style={{ marginTop: 6 }} color={COLORS.GREY[500]}>
                    Address not provided. Please add an address to help our
                    vendor reach you.
                </Body>
                <OutlineButton title="Add address" style={{ marginTop: 12 }} />
            </View>
        );
    }
    return (
        <View style={styles.card}>
            <H3 style={{ color: COLORS.TEXT.DARK, marginBottom: 8 }}>
                Service address
            </H3>
            <AddressCard
                address={address}
                isSelected={true}
                onSelect={() => {}}
            />
        </View>
    );
};

const HeaderStatus: React.FC<{ booking: any }> = ({ booking }) => {
    const title = booking.assignedVendor
        ? "Vendor assigned"
        : "We’re finding a trusted vendor";
    const subtitle = booking.assignedVendor
        ? "You’re all set! A professional has been assigned to your booking."
        : booking.progress?.nextAction ?? "This won’t take long.";

    const iconInfo = useMemo(() => {
        if (booking.assignedVendor) {
            return { icon: "checkmark-circle", color: COLORS.GREEN[700] };
        }
        return { icon: "search", color: COLORS.primary };
    }, [booking]);

    return (
        <View style={styles.headerCard}>
            <View style={styles.headerIconWrap}>
                {booking.assignedVendor ? (
                    <CustomIcon
                        provider="Ionicons"
                        name={iconInfo.icon}
                        size={26}
                        color={iconInfo.color}
                    />
                ) : (
                    <SearchingAnimation />
                )}
            </View>
            <H3 style={{ color: COLORS.TEXT.DARK, textAlign: "center" }}>
                {title}
            </H3>
            <Body
                style={{
                    color: COLORS.GREY[500],
                    textAlign: "center",
                    marginTop: 6,
                }}
            >
                {subtitle}
            </Body>
            <View style={{ marginTop: 12, width: "100%" }}>
                <ProgressBar percentage={booking.progress?.percentage ?? 10} />
            </View>
            <View style={{ marginTop: 10 }}>
                <StatusPill
                    color={
                        booking.assignedVendor
                            ? COLORS.GREEN[700]
                            : COLORS.primary
                    }
                    icon={booking.assignedVendor ? "shield-checkmark" : "time"}
                    text={booking.timing?.timeUntilBooking ?? "Soon"}
                />
            </View>
        </View>
    );
};

const PostBooking: React.FC = () => {
    const contentPadding = uiUtils.spacing.getHorizontalPadding();

    const timerRef = useRef<NodeJS.Timeout>(null);

    const params = useRoute()?.params as { bookingId?: string } | undefined;

    const currentBooking = SHOW_VENDOR_ASSIGNED
        ? MOCK_VENDOR_BOOKING
        : MOCK_FINDING_BOOKING;

    const fetchBookingStatus = async () => {
        const response = await OrdersServices.getBookingStatus(
            params?.bookingId ?? "",
        );
    };

    useEffect(() => {
        timerRef.current = setInterval(fetchBookingStatus, 3000);
        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, []);

    return (
        <SafeAreaView>
            <Header backButton={true} title="Booking Status" />
            <ScrollView
                contentContainerStyle={{
                    paddingHorizontal: contentPadding,
                    paddingTop: 16,
                    paddingBottom: 24,
                    backgroundColor: COLORS.WHITE,
                }}
            >
                <HeaderStatus booking={currentBooking} />
                {currentBooking.assignedVendor && (
                    <VendorCard vendor={currentBooking.assignedVendor} />
                )}
                <BookingDetailsCard booking={currentBooking} />
                <AddressSection address={currentBooking.address} />
                <View style={{ flexDirection: "row" }}>
                    {currentBooking.statusFlags?.canCancel && (
                        <OutlineButton
                            title="Cancel booking"
                            style={{ flex: 1 }}
                        />
                    )}
                    <View style={{ width: 12 }} />
                    {currentBooking.statusFlags?.needsPayment ? (
                        <Button
                            title="Pay now"
                            style={{ flex: 1 }}
                            icon={
                                <CustomIcon
                                    provider="Ionicons"
                                    name="card"
                                    size={18}
                                    color={COLORS.WHITE}
                                />
                            }
                        />
                    ) : (
                        <Button
                            title="Support"
                            style={{ flex: 1 }}
                            icon={
                                <CustomIcon
                                    provider="Ionicons"
                                    name="help-buoy"
                                    size={18}
                                    color={COLORS.WHITE}
                                />
                            }
                        />
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default PostBooking;

const styles = StyleSheet.create({
    headerCard: {
        backgroundColor: COLORS.WHITE,
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: COLORS.border.light,
        shadowColor: COLORS.TEXT.DARK,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
        elevation: 1,
        alignItems: "center",
        marginBottom: 16,
    },
    headerIconWrap: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: COLORS.primaryLight,
        marginBottom: 10,
    },
    pill: {
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 9999,
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderWidth: 1,
        alignSelf: "flex-start",
    },
    progressTrack: {
        height: 8,
        width: "100%",
        backgroundColor: uiUtils.color.addAlpha(COLORS.primary, 0.08),
        borderRadius: 9999,
        overflow: "hidden",
    },
    progressFill: {
        height: "100%",
        backgroundColor: COLORS.primary,
        borderRadius: 9999,
    },
    card: {
        backgroundColor: COLORS.WHITE,
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: COLORS.border.light,
        shadowColor: COLORS.TEXT.DARK,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
        elevation: 1,
        marginBottom: 16,
    },
    vendorAvatar: {
        width: 36,
        height: 36,
        borderRadius: 22,
        backgroundColor: COLORS.primary,
        alignItems: "center",
        justifyContent: "center",
    },
    vendorMetaRow: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 8,
        marginTop: 12,
    },
    detailRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginTop: 10,
    },
    detailValue: {
        color: COLORS.TEXT.DARK,
    },
    searchPulse: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: COLORS.WHITE,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderColor: uiUtils.color.addAlpha(COLORS.primary, 0.35),
    },
});
