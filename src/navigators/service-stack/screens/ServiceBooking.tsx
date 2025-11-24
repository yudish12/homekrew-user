import React, { useEffect, useState } from "react";
import {
    View,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    FlatList,
    Alert,
    Dimensions,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { COLORS, WEIGHTS } from "../../../constants";
import {
    Typography,
    H3,
    H4,
    Body,
    BodySmall,
    Caption,
} from "../../../components/Typography";
import { Button, PrimaryButton } from "../../../components/Button";
import { Input } from "../../../components/Input";
import { BackButton } from "../../../components/BackButton";
import { useNavigation, useRoute } from "@react-navigation/native";
import { SafeAreaView } from "../../../components/SafeAreaView";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, Coupon, RootState } from "../../../types";
import { setSelectedAddress } from "../../../redux/actions";
import CustomIcon from "../../../components/CustomIcon";
import { BookingData, TimeSlot } from "../../../types/services/orders";
import { OrdersServices } from "../../../services/orders";
import { showErrorToast } from "../../../components/Toast";
import { CouponBottomSheet } from "../../../modules/cart/CouponBottomSheet";

// Types
export interface UserLocation {
    type: string;
    coordinates: number[];
}

export interface UserAddress {
    _id?: string;
    line1: string;
    line2: string;
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
    addressType: string;
    location: UserLocation;
    landmark: string;
}

const timeSlots: TimeSlot[] = [
    { id: "1", time: "08:00 AM - 10:00 AM", available: true },
    { id: "2", time: "10:00 AM - 12:00 PM", available: true },
    { id: "3", time: "12:00 PM - 02:00 PM", available: true },
    { id: "4", time: "02:00 PM - 04:00 PM", available: true },
    { id: "5", time: "04:00 PM - 06:00 PM", available: true },
    { id: "6", time: "06:00 PM - 08:00 PM", available: true },
    { id: "7", time: "08:00 PM - 10:00 PM", available: true },
];

// Helper function to generate next 7 days
const getNext7Days = () => {
    const dates = [];
    const today = new Date();

    for (let i = 1; i < 8; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);

        const dayName = date.toLocaleDateString("en-US", { weekday: "short" });
        const dayNumber = date.getDate();
        const month = date.toLocaleDateString("en-US", { month: "short" });
        const fullDate = date.toISOString().split("T")[0]; // YYYY-MM-DD format

        dates.push({
            id: i.toString(),
            dayName,
            dayNumber,
            month,
            fullDate,
            isToday: i === 0,
        });
    }
    return dates;
};

export const ServiceBooking: React.FC = () => {
    const [dates] = useState(getNext7Days());
    const [selectedDate, setSelectedDate] = useState<string>(dates[0].fullDate);
    const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>("");
    const [specialRequirements, setSpecialRequirements] = useState<string>("");
    const [isLoading, setIsLoading] = useState(false);
    const [isFetchingCoupons, setIsFetchingCoupons] = useState(false);
    const [coupons, setCoupons] = useState<Coupon[]>([]);
    const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
    const [isCouponBottomSheetVisible, setIsCouponBottomSheetVisible] =
        useState(false);

    const userMembership = useSelector(
        (state: RootState) => state.auth.user?.membership,
    );

    const isUserMemberShipActive = !!userMembership;

    // navigation hooks
    const navigation = useNavigation<any>();
    const params = useRoute().params as {
        serviceId: string;
        serviceTemplateId: string;
        pricingData?: {
            maxPrice: number;
            basePrice: number;
            platformFee: number;
            taxAmount: number;
            currency: string;
            membershipDiscount: number;
        };
    };
    console.log(params.pricingData);

    //redux hooks
    const { selectedAddress } = useSelector(
        (state: RootState) => state.address,
    );
    const dispatch = useDispatch<AppDispatch>();

    const formatAddress = (address: UserAddress): string => {
        return `${address.line1}, ${address.line2 ? address.line2 + ", " : ""}${
            address.street
        }, ${address.city}, ${address.state} ${address.postalCode}`;
    };

    // Pricing calculations
    const maxPrice = params.pricingData?.maxPrice || 0;
    const basePrice = params.pricingData?.basePrice || 0;
    const currency = params.pricingData?.currency || "INR";
    const membershipDiscount = params.pricingData?.membershipDiscount ?? 0;
    const platformFee = params.pricingData?.platformFee ?? 0;
    const taxAmount = params.pricingData?.taxAmount ?? 0;
    const subtotal = basePrice + platformFee + taxAmount;

    // Calculate discount based on selected coupon
    const calculateDiscount = () => {
        if (!selectedCoupon) return 0;

        if (selectedCoupon.discountType === "fixed") {
            return selectedCoupon.discountValue;
        } else if (selectedCoupon.discountType === "percentage") {
            const percentageDiscount =
                (subtotal * selectedCoupon.discountValue) / 100;
            // Apply max discount limit if exists
            if (selectedCoupon.maxDiscount) {
                return Math.min(percentageDiscount, selectedCoupon.maxDiscount);
            }
            return percentageDiscount;
        }
        return 0;
    };

    const discount = calculateDiscount();
    const totalPrice = subtotal - discount - membershipDiscount;

    const fetchCoupons = async () => {
        setIsFetchingCoupons(true);
        console.log(
            "Fetching coupons for service template id: ",
            params.serviceTemplateId,
        );
        const response = await OrdersServices.getCoupons(
            "service",
            params.serviceTemplateId,
        );
        if (response.success && response.data) {
            setCoupons(response.data?.coupons || []);
        } else {
            showErrorToast("Error", "Something went wrong. Please try again.", {
                onDismiss: () => {
                    console.log("Error toast dismissed");
                },
            });
        }
        setIsFetchingCoupons(false);
    };

    useEffect(() => {
        fetchCoupons();
    }, []);

    const handleApplyCoupon = (coupon: Coupon) => {
        setSelectedCoupon(coupon);
        setIsCouponBottomSheetVisible(false);
    };

    const handleRemoveCoupon = () => {
        setSelectedCoupon(null);
    };

    const formatCurrency = (amount: number) => {
        const currencySymbol = currency === "INR" ? "₹" : currency;
        return `${currencySymbol}${amount}`;
    };

    const renderPricingBreakdown = () => {
        return (
            <View style={styles.pricingSection}>
                <View style={styles.sectionHeader}>
                    <Ionicons
                        name="receipt-outline"
                        size={20}
                        color={COLORS.primary}
                    />
                    <H4 style={styles.sectionTitle}>Pricing Breakdown</H4>
                </View>
                <View style={styles.pricingCard}>
                    {/* Base Price */}
                    <View style={styles.pricingRow}>
                        <Body style={styles.pricingLabel}>Item Total</Body>
                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                gap: 4,
                            }}
                        >
                            <Caption
                                style={{ textDecorationLine: "line-through" }}
                            >
                                {formatCurrency(maxPrice)}
                            </Caption>
                            <Body style={styles.pricingValue}>
                                {formatCurrency(basePrice)}
                            </Body>
                        </View>
                    </View>
                    <View style={styles.pricingDivider} />

                    {/* Membership Discount Fee */}
                    <View style={styles.pricingRow}>
                        <Body style={styles.pricingLabel}>
                            Membership Discount
                        </Body>
                        <Body style={styles.pricingValue}>
                            {formatCurrency(
                                params.pricingData?.membershipDiscount || 0,
                            )}
                        </Body>
                    </View>
                    <View style={styles.pricingDivider} />
                    {/* Platform Fee */}
                    <View style={styles.pricingRow}>
                        <Body style={styles.pricingLabel}>
                            taxes and platform fee
                        </Body>
                        <Body style={styles.pricingValue}>
                            {formatCurrency(
                                (params.pricingData?.platformFee ?? 0) +
                                    (params.pricingData?.taxAmount ?? 0),
                            )}
                        </Body>
                    </View>
                    <View style={styles.pricingDivider} />

                    {/* Discount */}
                    {discount > 0 && (
                        <>
                            <View style={styles.pricingRow}>
                                <View style={styles.discountLabelContainer}>
                                    <Body style={styles.pricingLabel}>
                                        Discount
                                    </Body>
                                    {selectedCoupon && (
                                        <Caption style={styles.couponCodeText}>
                                            ({selectedCoupon.code})
                                        </Caption>
                                    )}
                                </View>
                                <Body
                                    style={[
                                        styles.pricingValue,
                                        styles.discountText,
                                    ]}
                                >
                                    - {formatCurrency(discount)}
                                </Body>
                            </View>
                            <View style={styles.pricingDivider} />
                        </>
                    )}

                    {/* Total with emphasis */}
                    <View style={styles.totalPricingRow}>
                        <H4 style={styles.totalLabel}>Total Amount</H4>
                        <H3 style={styles.totalValue}>
                            {formatCurrency(totalPrice)}
                        </H3>
                    </View>
                </View>
            </View>
        );
    };

    const handleBookService = async () => {
        setIsLoading(true);
        if (!selectedDate || !selectedTimeSlot || !selectedAddress) {
            Alert.alert("Error", "Please select date, time slot, and address");
            return;
        }
        const bookingData: BookingData = {
            serviceId: params.serviceTemplateId,
            serviceTemplate: params.serviceTemplateId,
            date: selectedDate,
            timeSlot: selectedTimeSlot,
            address: selectedAddress._id,
            specialRequirements: specialRequirements,
            appliedCoupon: selectedCoupon?.code ?? undefined,
        };
        const response = await OrdersServices.bookService(bookingData);
        if (response.success) {
            navigation.navigate("PostBooking", {
                bookingId: response.data?.bookingId,
            });
        } else {
            showErrorToast("Error", response.message, {
                onDismiss: () => {
                    console.log("Error toast dismissed");
                },
                duration: 5000,
            });
        }

        setIsLoading(false);
    };

    const handleAddNewAddress = () => {
        navigation.navigate("AllAddress");
    };

    const renderDateItem = ({ item }: { item: any }) => {
        const isSelected = selectedDate === item.fullDate;

        return (
            <TouchableOpacity
                style={[
                    styles.dateItem,
                    isSelected && styles.selectedDateItem,
                    item.isToday && styles.todayDateItem,
                ]}
                onPress={() => setSelectedDate(item.fullDate)}
            >
                <BodySmall
                    style={[
                        styles.dayName,
                        isSelected && styles.selectedText,
                        item.isToday && !isSelected && styles.todayText,
                    ]}
                >
                    {item.dayName}
                </BodySmall>
                <H4
                    style={[
                        styles.dayNumber,
                        isSelected && styles.selectedText,
                        item.isToday && !isSelected && styles.todayText,
                    ]}
                >
                    {item.dayNumber}
                </H4>
                <BodySmall
                    style={[
                        styles.monthText,
                        isSelected && styles.selectedText,
                        item.isToday && !isSelected && styles.todayText,
                    ]}
                >
                    {item.month}
                </BodySmall>
            </TouchableOpacity>
        );
    };

    const renderTimeSlot = ({ item }: { item: TimeSlot }) => {
        const isSelected = selectedTimeSlot === item.time;
        const isAvailable = item.available;

        return (
            <TouchableOpacity
                style={[
                    styles.timeSlotItem,
                    isSelected && styles.selectedTimeSlot,
                    !isAvailable && styles.unavailableTimeSlot,
                ]}
                onPress={() => isAvailable && setSelectedTimeSlot(item.time)}
                disabled={!isAvailable}
            >
                <Typography
                    style={[
                        styles.timeSlotText,
                        isSelected && styles.selectedText,
                        !isAvailable && styles.unavailableText,
                    ]}
                >
                    {item.time}
                </Typography>
                {!isAvailable && (
                    <MaterialIcons
                        name="block"
                        size={16}
                        color={COLORS.RED[500]}
                        style={styles.unavailableIcon}
                    />
                )}
            </TouchableOpacity>
        );
    };

    if (isFetchingCoupons) {
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
    }

    return (
        <SafeAreaView>
            <BackButton
                onPress={() => {
                    navigation.goBack();
                }}
                backButtonStyle={{ position: "static", marginBottom: 0 }}
            />
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{
                    flex: 1,
                    justifyContent: "space-between",
                }}
            >
                <ScrollView
                    style={styles.container}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Header */}
                    <View style={styles.header}>
                        <H3>Book Your Service</H3>
                        <BodySmall style={styles.subtitle}>
                            Select your preferred date, time, and service
                            location
                        </BodySmall>
                    </View>

                    {/* Date Selection */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Ionicons
                                name="calendar-outline"
                                size={20}
                                color={COLORS.primary}
                            />
                            <H4 style={styles.sectionTitle}>Select Date</H4>
                        </View>
                        <FlatList
                            data={dates}
                            renderItem={renderDateItem}
                            keyExtractor={item => item.id}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.datesList}
                        />
                    </View>

                    {/* Time Slot Selection */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Ionicons
                                name="time-outline"
                                size={20}
                                color={COLORS.primary}
                            />
                            <H4 style={styles.sectionTitle}>
                                Select Time Slot
                            </H4>
                        </View>
                        <FlatList
                            data={timeSlots}
                            renderItem={renderTimeSlot}
                            keyExtractor={item => item.id}
                            numColumns={2}
                            columnWrapperStyle={styles.timeSlotsRow}
                            contentContainerStyle={styles.timeSlotsList}
                        />
                    </View>

                    {/* Address Selection */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Ionicons
                                name="location-outline"
                                size={20}
                                color={COLORS.primary}
                            />
                            <H4 style={styles.sectionTitle}>Service Address</H4>
                        </View>

                        {/* Add New Address Button */}
                        <TouchableOpacity
                            style={styles.addAddressButton}
                            onPress={handleAddNewAddress}
                        >
                            <Ionicons
                                name="add-circle-outline"
                                size={24}
                                color={COLORS.primary}
                            />
                            {!selectedAddress ? (
                                <Body style={styles.addAddressText}>
                                    Choose an address
                                </Body>
                            ) : (
                                <View style={styles.addAddressText}>
                                    <Typography
                                        variant="body"
                                        numberOfLines={2}
                                        color={COLORS.TEXT.DARK}
                                        style={styles.addAddressText}
                                    >
                                        {formatAddress(selectedAddress)}
                                    </Typography>
                                </View>
                            )}
                            <Ionicons
                                name="chevron-forward"
                                size={20}
                                color={COLORS.GREY[400]}
                            />
                        </TouchableOpacity>
                    </View>

                    {/* Special Requirements */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Ionicons
                                name="document-text-outline"
                                size={20}
                                color={COLORS.primary}
                            />
                            <H4 style={styles.sectionTitle}>
                                Special Requirements
                            </H4>
                        </View>
                        <Input
                            placeholder="Any special instructions or requirements..."
                            value={specialRequirements}
                            onChangeText={setSpecialRequirements}
                            multiline={true}
                            numberOfLines={4}
                            inputStyle={styles.requirementsInput}
                        />
                    </View>

                    {!isUserMemberShipActive && (
                        <View style={styles.section}>
                            <TouchableOpacity
                                style={styles.membershipContainer}
                                activeOpacity={0.95}
                                onPress={() =>
                                    navigation.navigate("MembershipDetails")
                                }
                            >
                                <LinearGradient
                                    colors={[
                                        COLORS.NAVY[800],
                                        COLORS.NAVY[700],
                                    ]}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                    style={styles.membershipGradient}
                                >
                                    {/* Decorative Sparkle */}
                                    <View style={styles.membershipSparkle}>
                                        <CustomIcon
                                            provider="MaterialCommunityIcons"
                                            name="star-four-points"
                                            size={12}
                                            color={COLORS.GOLD[500]}
                                        />
                                    </View>

                                    {/* Popular Badge */}
                                    <View style={styles.membershipBadge}>
                                        <LinearGradient
                                            colors={[
                                                COLORS.GOLD[600],
                                                COLORS.GOLD[400],
                                            ]}
                                            start={{ x: 0, y: 0 }}
                                            end={{ x: 1, y: 0 }}
                                            style={
                                                styles.membershipBadgeGradient
                                            }
                                        >
                                            <CustomIcon
                                                provider="Ionicons"
                                                name="star"
                                                size={10}
                                                color={COLORS.WHITE}
                                            />
                                            <Caption
                                                style={
                                                    styles.membershipBadgeText
                                                }
                                            >
                                                UNLOCK PREMIUM
                                            </Caption>
                                        </LinearGradient>
                                    </View>

                                    {/* Content */}
                                    <View style={styles.membershipContent}>
                                        <View style={styles.membershipHeader}>
                                            <View
                                                style={
                                                    styles.membershipIconWrapper
                                                }
                                            >
                                                <CustomIcon
                                                    provider="MaterialCommunityIcons"
                                                    name="crown"
                                                    size={24}
                                                    color={COLORS.GOLD[600]}
                                                />
                                            </View>
                                            <View
                                                style={
                                                    styles.membershipTextContainer
                                                }
                                            >
                                                <H4
                                                    style={
                                                        styles.membershipTitle
                                                    }
                                                >
                                                    Premium Membership
                                                </H4>
                                                <Caption
                                                    style={
                                                        styles.membershipSubtitle
                                                    }
                                                >
                                                    Save up to 40% on all
                                                    services
                                                </Caption>
                                            </View>
                                        </View>

                                        {/* CTA Button */}
                                        <View style={styles.membershipCTA}>
                                            <LinearGradient
                                                colors={[
                                                    COLORS.GOLD[600],
                                                    COLORS.GOLD[400],
                                                ]}
                                                style={styles.membershipButton}
                                            >
                                                <CustomIcon
                                                    provider="Ionicons"
                                                    name="rocket"
                                                    size={16}
                                                    color={COLORS.NAVY[800]}
                                                />
                                                <Body
                                                    style={
                                                        styles.membershipButtonText
                                                    }
                                                >
                                                    View Membership Plans
                                                </Body>
                                                <CustomIcon
                                                    provider="Ionicons"
                                                    name="arrow-forward-circle"
                                                    size={16}
                                                    color={COLORS.NAVY[800]}
                                                />
                                            </LinearGradient>
                                        </View>
                                    </View>
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>
                    )}

                    {/* Apply Coupon Section */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Ionicons
                                name="pricetag-outline"
                                size={20}
                                color={COLORS.primary}
                            />
                            <H4 style={styles.sectionTitle}>Apply Coupon</H4>
                        </View>

                        {selectedCoupon ? (
                            <View style={styles.appliedCouponCard}>
                                <View style={styles.appliedCouponLeft}>
                                    <View style={styles.appliedCouponBadge}>
                                        <Ionicons
                                            name="checkmark-circle"
                                            size={18}
                                            color={COLORS.GREEN[700]}
                                        />
                                        <Body style={styles.appliedCouponCode}>
                                            {selectedCoupon.code}
                                        </Body>
                                    </View>
                                    <BodySmall
                                        style={styles.appliedCouponDiscount}
                                    >
                                        You saved {formatCurrency(discount)}!
                                    </BodySmall>
                                </View>
                                <TouchableOpacity
                                    style={styles.removeCouponButton}
                                    onPress={handleRemoveCoupon}
                                >
                                    <Ionicons
                                        name="close-circle"
                                        size={24}
                                        color={COLORS.RED[500]}
                                    />
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <TouchableOpacity
                                style={styles.applyCouponButton}
                                onPress={() =>
                                    setIsCouponBottomSheetVisible(true)
                                }
                            >
                                <Ionicons
                                    name="pricetag"
                                    size={24}
                                    color={COLORS.primary}
                                />
                                <Body style={styles.applyCouponText}>
                                    {coupons.length > 0
                                        ? `View ${coupons.length} available ${
                                              coupons.length === 1
                                                  ? "coupon"
                                                  : "coupons"
                                          }`
                                        : "No coupons available"}
                                </Body>
                                <Ionicons
                                    name="chevron-forward"
                                    size={20}
                                    color={COLORS.GREY[400]}
                                />
                            </TouchableOpacity>
                        )}
                    </View>

                    {/* Pricing Breakdown */}
                    {renderPricingBreakdown()}
                </ScrollView>
                {/* Book Service Button with Total */}
                <View style={styles.bookingButtonContainer}>
                    <View style={styles.totalPriceContainer}>
                        <Typography
                            variant="bodySmall"
                            style={styles.totalPriceLabel}
                        >
                            TOTAL
                        </Typography>
                        <Typography
                            variant="h3"
                            style={styles.totalPriceAmount}
                        >
                            {formatCurrency(totalPrice)}
                        </Typography>
                    </View>
                    <PrimaryButton
                        title="Book Service"
                        disabled={
                            !selectedDate ||
                            !selectedTimeSlot ||
                            !selectedAddress ||
                            isLoading
                        }
                        textStyle={{ marginLeft: 12 }}
                        onPress={handleBookService}
                        loading={isLoading}
                        style={styles.bookServiceButton}
                        icon={
                            <Ionicons
                                name="checkmark-circle"
                                size={20}
                                color={COLORS.WHITE}
                            />
                        }
                        iconPosition="left"
                    />
                </View>
            </KeyboardAvoidingView>

            {/* Coupon Bottom Sheet */}
            <CouponBottomSheet
                visible={isCouponBottomSheetVisible}
                onClose={() => setIsCouponBottomSheetVisible(false)}
                coupons={coupons}
                appliedCoupon={selectedCoupon}
                onApply={handleApplyCoupon}
                onRemove={handleRemoveCoupon}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.WHITE,
        padding: 20,
        paddingTop: 12,
    },
    header: {
        marginBottom: 30,
    },
    subtitle: {
        color: COLORS.TEXT.LIGHT,
        marginTop: 5,
    },
    section: {
        marginBottom: 30,
    },
    sectionHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 15,
    },
    sectionTitle: {
        marginLeft: 8,
        color: COLORS.TEXT.DARK,
    },

    // Date Selection Styles
    datesList: {
        paddingHorizontal: 5,
    },
    dateItem: {
        backgroundColor: COLORS.WHITE,
        borderWidth: 1,
        borderColor: COLORS.GREY[100],
        borderRadius: 12,
        paddingVertical: 15,
        paddingHorizontal: 20,
        alignItems: "center",
        marginHorizontal: 5,
        minWidth: 80,
    },
    selectedDateItem: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
    },
    todayDateItem: {
        borderColor: COLORS.primary,
        borderWidth: 2,
    },
    dayName: {
        color: COLORS.TEXT.LIGHT,
        marginBottom: 5,
    },
    dayNumber: {
        color: COLORS.TEXT.DARK,
        marginBottom: 2,
    },
    monthText: {
        color: COLORS.TEXT.LIGHT,
        fontSize: 10,
    },
    selectedText: {
        color: COLORS.WHITE,
    },
    todayText: {
        color: COLORS.primary,
    },

    // Time Slot Styles
    timeSlotsList: {
        paddingHorizontal: 5,
    },
    timeSlotsRow: {
        justifyContent: "space-between",
    },
    timeSlotItem: {
        width: Dimensions.get("window").width / 2 - 30,
        backgroundColor: COLORS.WHITE,
        borderWidth: 1,
        borderColor: COLORS.GREY[100],
        borderRadius: 10,
        paddingVertical: 15,
        paddingHorizontal: 10,
        alignItems: "center",
        marginBottom: 10,
        flexDirection: "row",
        justifyContent: "center",
    },
    selectedTimeSlot: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
    },
    unavailableTimeSlot: {
        backgroundColor: COLORS.GREY[100],
        borderColor: COLORS.GREY[200],
    },
    timeSlotText: {
        textAlign: "center",
        fontSize: 12,
    },
    unavailableText: {
        color: COLORS.GREY[400],
    },
    unavailableIcon: {
        marginLeft: 5,
    },

    // Address Styles
    addressesList: {
        marginBottom: 15,
    },
    addressItem: {
        backgroundColor: COLORS.WHITE,
        borderWidth: 1,
        borderColor: COLORS.GREY[100],
        borderRadius: 12,
        padding: 15,
        marginBottom: 10,
    },
    selectedAddressItem: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
    },
    addressHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 8,
    },
    addressTypeContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    // Premium Membership Styles
    membershipContainer: {
        borderRadius: 20,
        overflow: "hidden",
        shadowColor: "rgba(13, 27, 42, 0.45)",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 8,
    },
    membershipGradient: {
        padding: 20,
        position: "relative",
    },
    membershipSparkle: {
        position: "absolute",
        top: 16,
        right: 16,
        zIndex: 1,
    },
    membershipBadge: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 2,
    },
    membershipBadgeGradient: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 6,
        paddingHorizontal: 12,
        gap: 4,
    },
    membershipBadgeText: {
        color: COLORS.WHITE,
        fontSize: 10,
        fontWeight: WEIGHTS.BOLD,
        letterSpacing: 0.5,
    },
    membershipContent: {
        marginTop: 24,
    },
    membershipHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 16,
    },
    membershipIconWrapper: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: "rgba(212, 175, 55, 0.20)",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 12,
    },
    membershipTextContainer: {
        flex: 1,
    },
    membershipTitle: {
        color: COLORS.GOLD[600],
        fontWeight: WEIGHTS.BOLD,
        fontSize: 18,
        marginBottom: 4,
    },
    membershipSubtitle: {
        color: "rgba(255,255,255,0.8)",
        fontSize: 12,
        fontWeight: WEIGHTS.MEDIUM,
    },
    membershipBenefits: {
        marginBottom: 16,
        gap: 10,
    },
    membershipBenefit: {
        flexDirection: "row",
        alignItems: "center",
    },
    membershipCheckIcon: {
        width: 24,
        height: 24,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        marginRight: 10,
    },
    membershipBenefitText: {
        flex: 1,
        color: COLORS.WHITE,
        fontWeight: WEIGHTS.MEDIUM,
        fontSize: 13,
        lineHeight: 18,
    },
    membershipCTA: {
        marginTop: 8,
    },
    membershipButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 14,
        paddingHorizontal: 20,
        borderRadius: 14,
        gap: 8,
    },
    membershipButtonText: {
        color: COLORS.NAVY[800],
        fontWeight: WEIGHTS.BOLD,
        fontSize: 15,
    },
    addressType: {
        marginLeft: 5,
        fontWeight: WEIGHTS.MEDIUM,
    },
    addressText: {
        color: COLORS.TEXT.DARK,
        marginBottom: 5,
        lineHeight: 18,
    },
    landmarkText: {
        color: COLORS.TEXT.LIGHT,
        fontSize: 12,
    },
    addAddressButton: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: COLORS.primaryLight,
        borderWidth: 1,
        borderColor: COLORS.primary,
        borderRadius: 12,
        padding: 15,
        borderStyle: "dashed",
    },
    addAddressText: {
        flex: 1,
        marginLeft: 10,
        color: COLORS.primary,
        fontWeight: WEIGHTS.MEDIUM,
    },

    // Special Requirements Styles
    requirementsInput: {
        textAlignVertical: "top",
        minHeight: 100,
    },

    // Booking Button Styles
    bookingButtonContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "transparent",
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderTopWidth: 1,
        borderTopColor: COLORS.GREY[100],
        shadowColor: COLORS.TEXT.DARK,
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 8,
    },
    totalPriceContainer: {
        flex: 1,
        marginRight: 0,
    },
    totalPriceLabel: {
        color: COLORS.TEXT.LIGHT,
        fontSize: 12,
        fontWeight: WEIGHTS.MEDIUM,
        letterSpacing: 1.2,
        marginBottom: 4,
    },
    totalPriceAmount: {
        color: COLORS.TEXT.DARK,
        fontSize: 24,
        fontWeight: WEIGHTS.BOLD,
    },
    bookServiceButton: {
        flex: 1,
        backgroundColor: COLORS.primary,
        paddingVertical: 14,
        borderRadius: 12,
        minHeight: 54,
    },

    // Pricing Breakdown Styles
    pricingSection: {
        marginBottom: 30,
    },
    pricingCard: {
        backgroundColor: COLORS.WHITE,
        borderWidth: 1,
        borderColor: COLORS.GREY[100],
        borderRadius: 16,
        padding: 20,
        shadowColor: COLORS.TEXT.DARK,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    pricingRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 8,
    },
    pricingLabel: {
        color: COLORS.TEXT.DARK,
        fontWeight: WEIGHTS.REGULAR,
        fontSize: 16,
    },
    pricingValue: {
        color: COLORS.TEXT.DARK,
        fontWeight: WEIGHTS.MEDIUM,
    },
    pricingLabelLight: {
        color: COLORS.TEXT.LIGHT,
        fontWeight: WEIGHTS.REGULAR,
    },
    pricingValueLight: {
        color: COLORS.TEXT.LIGHT,
        fontWeight: WEIGHTS.MEDIUM,
    },
    discountText: {
        color: COLORS.GREEN[700],
        fontWeight: WEIGHTS.SEMI_BOLD,
    },
    pricingDivider: {
        height: 1,
        backgroundColor: COLORS.GREY[100],
        marginVertical: 8,
    },
    totalPricingRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingTop: 16,
        marginTop: 8,
    },
    totalLabel: {
        color: COLORS.TEXT.DARK,
        fontWeight: WEIGHTS.BOLD,
    },
    totalValue: {
        color: COLORS.primary,
        fontWeight: WEIGHTS.BOLD,
    },

    // Coupon Styles
    applyCouponButton: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: COLORS.primaryLight,
        borderWidth: 1,
        borderColor: COLORS.primary,
        borderRadius: 12,
        padding: 15,
        borderStyle: "dashed",
    },
    applyCouponText: {
        flex: 1,
        marginLeft: 10,
        color: COLORS.primary,
        fontWeight: WEIGHTS.MEDIUM,
    },
    appliedCouponCard: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#E8F5E9",
        borderWidth: 1,
        borderColor: COLORS.GREEN[700],
        borderRadius: 12,
        padding: 15,
    },
    appliedCouponLeft: {
        flex: 1,
        gap: 6,
    },
    appliedCouponBadge: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },
    appliedCouponCode: {
        color: COLORS.GREEN[700],
        fontWeight: WEIGHTS.BOLD,
        textTransform: "uppercase",
        letterSpacing: 0.5,
    },
    appliedCouponDiscount: {
        color: COLORS.GREEN[700],
        fontWeight: WEIGHTS.MEDIUM,
    },
    removeCouponButton: {
        padding: 4,
    },
    discountLabelContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },
    couponCodeText: {
        color: COLORS.GREEN[700],
        fontWeight: WEIGHTS.MEDIUM,
        textTransform: "uppercase",
    },
});
