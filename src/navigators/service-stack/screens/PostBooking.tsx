import React, { useEffect, useMemo, useRef, useState } from "react";
import {
    Animated,
    Linking,
    Platform,
    ScrollView,
    StyleSheet,
    View,
} from "react-native";
import { SafeAreaView } from "../../../components/SafeAreaView";
import { H3, Body, Caption, H4 } from "../../../components/Typography";
import { COLORS } from "../../../constants/ui";
import { Button, OutlineButton } from "../../../components/Button";
import { CustomIcon } from "../../../components/CustomIcon";
import { AddressCard } from "../../../components/AddressCard";
import RazorpayCheckout from "react-native-razorpay";
import uiUtils from "../../../utils/ui";
import Header from "../../../components/header";
import { OrdersServices } from "../../../services/orders";
import { useNavigation, useRoute } from "@react-navigation/native";
import { showErrorToast } from "../../../components/Toast";
import { BookingHistory } from "../../../types/services/orders";
import { ErrorModal, SuccessModal } from "../../../components/Modal";

// Type for the booking status response
interface BookingStatusResponse {
    _id: string;
    status: string;
    paymentStatus: string;
    date: string;
    timeSlot: string;
    progress: {
        step: number;
        total: number;
        percentage: number;
        nextAction: string;
    };
    statusFlags: {
        isPending: boolean;
        isSearching: boolean;
        hasVendorAssigned: boolean;
        isAccepted: boolean;
        isConfirmed: boolean;
        isOnRoute: boolean;
        hasArrived: boolean;
        isInProgress: boolean;
        isCompleted: boolean;
        isCancelled: boolean;
        isRejected: boolean;
        isFailed: boolean;
        isExpired: boolean;
        canCancel: boolean;
        canRate: boolean;
        needsPayment: boolean;
    };
    pricing: BookingHistory["pricing"];
    service: {
        _id: string;
        name: string;
        category: string;
        subCategory: string;
    };
    assignedVendor?: {
        _id: string;
        name: string;
        phoneNumber: string;
        assignedAt: string;
        acceptedAt: string;
        distance: number;
    };
    timing: {
        bookingDate: string;
        timeSlot: string;
        timeUntilBooking: string;
        isExpired: boolean;
    };
    address: any;
}

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

const PricingBreakdown: React.FC<{
    pricing: BookingHistory["pricing"];
}> = ({ pricing }) => (
    <View style={styles.pricingCard}>
        <View style={styles.pricingRow}>
            <Body color={COLORS.GREY[500]}>Base Price</Body>
            <Body style={{ color: COLORS.TEXT.DARK }}>
                ₹{pricing.basePrice}
            </Body>
        </View>
        {pricing.discountAmount > 0 && (
            <View style={styles.pricingRow}>
                <Body color={COLORS.GREEN[700]}>Discount</Body>
                <Body style={{ color: COLORS.GREEN[700] }}>
                    -₹{pricing.discountAmount}
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
        {pricing.taxAmount > 0 && (
            <View style={styles.pricingRow}>
                <Body color={COLORS.GREY[500]}>Tax</Body>
                <Body style={{ color: COLORS.TEXT.DARK }}>
                    ₹{pricing.taxAmount.toFixed(2)}
                </Body>
            </View>
        )}
        <View style={styles.pricingRow}>
            <Body color={COLORS.GREY[500]}>Platform Fee</Body>
            <Body style={{ color: COLORS.TEXT.DARK }}>
                ₹{pricing.platformFee}
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

const VendorCard: React.FC<{ vendor: any }> = ({ vendor }) => {
    if (!vendor) return null;

    const makeCall = (phoneNumber: string) => {
        console.log(phoneNumber);
        let callNumber = phoneNumber;
        if (Platform.OS !== "android") {
            callNumber = `telprompt:${phoneNumber}`;
        } else {
            callNumber = `tel:${phoneNumber}`;
        }

        Linking.canOpenURL(callNumber)
            .then(supported => {
                if (!supported) {
                    showErrorToast("Error", "Calling number is not supported");
                } else {
                    return Linking.openURL(callNumber);
                }
            })
            .catch(err => showErrorToast("Error", "Something went wrong"));
    };

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
                            marginTop: 6,
                        }}
                    >
                        <CustomIcon
                            provider="Ionicons"
                            name="call"
                            size={12}
                            color={COLORS.GREY[500]}
                        />
                        <Caption
                            style={{ marginLeft: 4 }}
                            color={COLORS.GREY[500]}
                        >
                            {vendor.phoneNumber}
                        </Caption>
                    </View>
                </View>
            </View>

            <View style={{ flexDirection: "row", marginTop: 12 }}>
                <Button
                    onPress={() => makeCall(vendor.phoneNumber)}
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
            </View>
        </View>
    );
};

const BookingDetailsCard: React.FC<{ booking: BookingStatusResponse }> = ({
    booking,
}) => {
    return (
        <View style={styles.card}>
            <H3 style={{ color: COLORS.TEXT.DARK }}>Booking details</H3>
            <View style={styles.detailRow}>
                <Caption color={COLORS.GREY[500]}>Service</Caption>
                <Body style={styles.detailValue}>{booking.service?.name}</Body>
            </View>
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
            <View style={[styles.detailRow, { alignItems: "center" }]}>
                <Caption color={COLORS.GREY[500]}>OTP</Caption>
                <StatusPill
                    color={COLORS.GREY[900]}
                    icon={"key"}
                    text={booking?.otpDeatils?.otp ?? ""}
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

const HeaderStatus: React.FC<{ booking: BookingStatusResponse }> = ({
    booking,
}) => {
    const getStatusTitle = (status: string, hasVendor: boolean) => {
        if (status === "completed") return "Booking completed";
        if (status === "arrived") return "Vendor arrived";
        if (hasVendor) return "Vendor assigned";
        if (status === "pending") return "We're finding a trusted vendor";
        return "Processing your booking";
    };

    const getStatusSubtitle = (booking: BookingStatusResponse) => {
        if (booking.assignedVendor) {
            return "You're all set! A professional has been assigned to your booking.";
        }
        return booking.progress?.nextAction ?? "This won't take long.";
    };

    const title = getStatusTitle(booking.status, !!booking.assignedVendor);
    const subtitle = getStatusSubtitle(booking);

    return (
        <View style={styles.headerCard}>
            <View style={styles.headerIconWrap}>
                {booking.assignedVendor ? (
                    <CustomIcon
                        provider="Ionicons"
                        name="checkmark-circle"
                        size={26}
                        color={COLORS.GREEN[700]}
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
    const navigation = useNavigation<any>();
    const [bookingData, setBookingData] =
        useState<BookingStatusResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [paymentLoading, setPaymentLoading] = useState(false);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);

    const params = useRoute()?.params as { bookingId?: string } | undefined;

    const fetchBookingStatus = async () => {
        try {
            const response = await OrdersServices.getBookingStatus(
                params?.bookingId ?? "",
            );
            if (response.success && response.data) {
                setBookingData(response.data);
            }
        } catch (error) {
            console.error("Error fetching booking status:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Fetch immediately
        fetchBookingStatus();

        // Then set up polling
        timerRef.current = setInterval(fetchBookingStatus, 3000);

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, [params?.bookingId]);

    useEffect(() => {
        if (
            bookingData?.status === "completed" &&
            bookingData.paymentStatus === "paid" &&
            timerRef.current
        ) {
            clearInterval(timerRef.current);
        }
    }, [bookingData?.status, bookingData?.paymentStatus]);

    const handlePayNow = async () => {
        setPaymentLoading(true);
        try {
            const resp = await OrdersServices.bookingPayNow(
                params?.bookingId ?? "",
            );
            console.log(resp, "payment");
            if (resp.success) {
                const options = {
                    key: "rzp_test_M1Ad7casmGNZTV",
                    amount:
                        (resp.data?.booking?.razorpayOrder?.amount ?? 0) / 100,
                    currency: "INR",
                    theme: {
                        color: COLORS.primary,
                        type: "light",
                    },
                    order_id: resp.data?.booking?.razorpayOrder.id ?? "",
                    name: "Buy Products",
                    description:
                        "Payment to buy products delivered right at your registered address ",
                };
                const data = await RazorpayCheckout.open(options);
                setShowSuccessModal(true);
            } else {
                setShowErrorModal(true);
            }
        } catch (error) {
            console.log(error, "error");
            showErrorToast("Error", "Something went wrong. Please try again.", {
                onDismiss: () => {
                    console.log("Error toast dismissed");
                },
            });
        } finally {
            setPaymentLoading(false);
        }
    };

    const handleSuccessClose = () => {
        setShowSuccessModal(false);
    };

    const handleErrorClose = () => {
        setShowErrorModal(false);
    };

    if (loading || !bookingData) {
        return (
            <SafeAreaView>
                <Header
                    backHandler={() => navigation.goBack()}
                    backButton={true}
                    title="Booking Status"
                />
                <View
                    style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <Body>Loading booking details...</Body>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView>
            <Header
                backHandler={() => navigation.goBack()}
                backButton={true}
                title="Booking Status"
            />
            <ScrollView
                contentContainerStyle={{
                    paddingHorizontal: contentPadding,
                    paddingTop: 16,
                    paddingBottom: 24,
                    backgroundColor: COLORS.WHITE,
                }}
            >
                <HeaderStatus booking={bookingData} />

                {bookingData.assignedVendor && (
                    <VendorCard vendor={bookingData.assignedVendor} />
                )}
                {/* Booking ID Card */}
                <View style={styles.bookingIdCard}>
                    <Caption style={styles.bookingIdLabel}>Booking ID</Caption>
                    <Body style={styles.bookingIdValue}>
                        #{bookingData._id}
                    </Body>
                </View>
                <BookingDetailsCard booking={bookingData} />
                <PricingBreakdown pricing={bookingData.pricing} />
                <AddressSection address={bookingData.address} />

                <View style={{ flexDirection: "row" }}>
                    {/* {bookingData.statusFlags?.canCancel && (
                        <OutlineButton
                            title="Cancel booking"
                            style={{ flex: 1 }}
                        />
                    )} */}
                    <View style={{ width: 12 }} />
                    {bookingData.statusFlags?.needsPayment &&
                    bookingData.status === "completed" &&
                    bookingData.paymentStatus === "pending" ? (
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
                            disabled={paymentLoading}
                            loading={paymentLoading}
                            onPress={() => handlePayNow()}
                        />
                    ) : null}
                </View>
            </ScrollView>
            <SuccessModal
                visible={showSuccessModal}
                onClose={handleSuccessClose}
                title="Payment Successful!"
                message={
                    "Your payment has been processed successfully. Your order will be prepared and shipped soon."
                }
            />
            {/* Error Modal */}
            <ErrorModal
                visible={showErrorModal}
                onClose={handleErrorClose}
                title="Payment Failed"
                message={
                    "We couldn't process your payment. Please check your payment details and try again."
                }
            />
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
    bookingIdCard: {
        backgroundColor: COLORS.primaryLight,
        marginBottom: 16,
        borderRadius: 12,
        padding: 16,
        paddingHorizontal: 8,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderLeftWidth: 4,
        borderLeftColor: COLORS.primary,
    },
    bookingIdLabel: {
        color: COLORS.TEXT.DARK,
        fontSize: 12,
    },
    bookingIdValue: {
        color: COLORS.TEXT.DARK,
        fontWeight: "700",
        fontSize: 14,
        letterSpacing: 0.5,
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
        gap: 12,
        shadowRadius: 8,
        elevation: 1,
        marginBottom: 16,
    },
    vendorAvatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: COLORS.primary,
        alignItems: "center",
        justifyContent: "center",
    },
    vendorMetaRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 8,
    },
    detailRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginTop: 10,
    },
    detailValue: {
        color: COLORS.TEXT.DARK,
        flex: 1,
        width: "90%",
        textAlign: "right",
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
    pricingCard: {
        backgroundColor: COLORS.primaryLight,
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
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
});
