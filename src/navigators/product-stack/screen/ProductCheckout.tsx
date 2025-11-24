import React, { useState, useEffect } from "react";
import {
    View,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    Alert,
    ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, WEIGHTS } from "../../../constants";
import {
    Typography,
    H3,
    H4,
    Body,
    BodySmall,
    Caption,
} from "../../../components/Typography";
import { PrimaryButton } from "../../../components/Button";
import {
    AppDispatch,
    CartItem,
    CartState,
    RootState,
    UserAddress,
    Coupon,
} from "../../../types";
import { useDispatch, useSelector } from "react-redux";
import {
    applyCoupon,
    removeFromCart,
    updateQuantity,
} from "../../../redux/actions";
import { StackActions, useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "../../../components/SafeAreaView";
import { BackButton } from "../../../components/BackButton";
import { OrdersServices } from "../../../services/orders";
import { showErrorToast } from "../../../components/Toast";
import { CouponBottomSheet } from "../../../modules/cart/CouponBottomSheet";

const CartCheckout: React.FC = () => {
    const navigation = useNavigation<any>();
    const cartState = useSelector((state: RootState) => state.cart);

    const { selectedAddress } = useSelector(
        (state: RootState) => state.address,
    );

    const dispatch = useDispatch<AppDispatch>();

    // Coupon state
    const [isFetchingCoupons, setIsFetchingCoupons] = useState(false);
    const [coupons, setCoupons] = useState<Coupon[]>([]);
    const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
    const [isCouponBottomSheetVisible, setIsCouponBottomSheetVisible] =
        useState(false);

    // Calculate discount based on selected coupon
    const calculateDiscount = () => {
        if (!selectedCoupon) return 0;

        const subtotal = cartState.totalPrice;

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
    const totalPrice = cartState.totalPrice - discount;

    const removeItem = (itemId: string) => {
        Alert.alert(
            "Remove Item",
            "Are you sure you want to remove this item from cart?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Remove",
                    style: "destructive",
                    onPress: () => {
                        dispatch(removeFromCart(itemId));
                    },
                },
            ],
        );
    };

    const handleCheckout = () => {
        if (cartState.items.length === 0) {
            Alert.alert("Error", "Your cart is empty");
            return;
        }

        if (!selectedAddress) {
            Alert.alert("Error", "Please select a delivery address");
            return;
        }

        const checkoutData = {
            items: cartState.items,
            totalPrice: totalPrice,
            deliveryAddress: selectedAddress,
            timestamp: new Date().toISOString(),
            appliedCoupon: selectedCoupon?.code ?? undefined,
        };

        navigation.navigate("PaymentMethod", { checkoutData });
    };

    const handleAddNewAddress = () => {
        navigation.navigate("AllAddress");
    };

    const formatAddress = (address: UserAddress): string => {
        return `${address.line1}, ${address.line2 ? address.line2 + ", " : ""}${
            address.street
        }, ${address.city}, ${address.state} ${address.postalCode}`;
    };

    // Fetch coupons for products in cart
    const fetchCoupons = async () => {
        if (cartState.items.length === 0) return;

        setIsFetchingCoupons(true);
        try {
            // Fetch coupons for the first product in cart
            // In a real scenario, you might want to fetch for all products and combine
            const firstProductId = cartState.items[0].id;
            console.log("Fetching coupons for product id: ", firstProductId);
            const response = await OrdersServices.getCoupons(
                "product",
                firstProductId,
            );
            if (response.success && response.data) {
                setCoupons(response.data?.coupons || []);
            } else {
                showErrorToast(
                    "Error",
                    "Something went wrong. Please try again.",
                    {
                        onDismiss: () => {
                            console.log("Error toast dismissed");
                        },
                    },
                );
            }
        } catch (error) {
            console.error("Error fetching coupons:", error);
            showErrorToast(
                "Error",
                "Failed to fetch coupons. Please try again.",
            );
        } finally {
            setIsFetchingCoupons(false);
        }
    };

    useEffect(() => {
        if (cartState.items.length > 0) {
            fetchCoupons();
        }
    }, [cartState.items]);

    const handleApplyCoupon = (coupon: Coupon) => {
        setSelectedCoupon(coupon);
        setIsCouponBottomSheetVisible(false);
        dispatch(applyCoupon(coupon));
    };

    const handleRemoveCoupon = () => {
        setSelectedCoupon(null);
    };

    const formatCurrency = (amount: number) => {
        return `₹${amount.toFixed(2)}`;
    };

    const renderCartItem = (item: CartItem) => {
        const itemTotal = item.quantity * item.singleItemPrice;

        return (
            <View key={item.id} style={styles.cartItemContainer}>
                <View style={styles.itemImageContainer}>
                    <Image
                        source={{ uri: item.image }}
                        style={styles.itemImage}
                        resizeMode="cover"
                    />
                </View>

                <View style={styles.itemDetails}>
                    <View style={styles.itemHeader}>
                        <View style={styles.itemInfo}>
                            <H4 style={styles.itemName}>{item.name}</H4>
                            <Body style={styles.itemPrice}>
                                ₹{item.singleItemPrice}
                            </Body>
                        </View>
                        <TouchableOpacity
                            style={styles.removeButton}
                            onPress={() => removeItem(item.id)}
                        >
                            <Ionicons
                                name="close"
                                size={20}
                                color={COLORS.GREY[400]}
                            />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.itemFooter}>
                        <View style={styles.quantityContainer}>
                            <TouchableOpacity
                                style={styles.quantityButton}
                                onPress={() => {
                                    if (item.quantity === 1) {
                                        removeItem(item.id);
                                        return;
                                    }
                                    dispatch(updateQuantity(item.id, -1));
                                }}
                            >
                                <Ionicons
                                    name="remove"
                                    size={16}
                                    color={COLORS.primary}
                                />
                            </TouchableOpacity>
                            <Body style={styles.quantityText}>
                                {item.quantity}
                            </Body>
                            <TouchableOpacity
                                style={styles.quantityButton}
                                onPress={() =>
                                    dispatch(updateQuantity(item.id, 1))
                                }
                            >
                                <Ionicons
                                    name="add"
                                    size={16}
                                    color={COLORS.primary}
                                />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.priceContainer}>
                            <H4 style={styles.itemTotal}>₹{itemTotal}</H4>
                        </View>
                    </View>
                </View>
            </View>
        );
    };

    if (cartState.items.length === 0) {
        return (
            <SafeAreaView>
                <BackButton
                    backButtonStyle={{ position: "static", marginBottom: 0 }}
                    onPress={() => navigation.goBack()}
                />
                <View style={styles.emptyCartContainer}>
                    <Ionicons
                        name="cart-outline"
                        size={80}
                        color={COLORS.GREY[200]}
                    />
                    <H3 style={styles.emptyCartTitle}>Your cart is empty</H3>
                    <BodySmall style={styles.emptyCartSubtitle}>
                        Add some products to get started
                    </BodySmall>
                    <View style={styles.emptyCartButtonContainer}>
                        <PrimaryButton
                            title="Continue Shopping"
                            onPress={() =>
                                navigation.dispatch(StackActions.pop(1))
                            }
                            icon={
                                <Ionicons
                                    name="storefront"
                                    size={20}
                                    color={COLORS.WHITE}
                                />
                            }
                            iconPosition="left"
                        />
                    </View>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <BackButton onPress={() => navigation.goBack()} />
                <H3>Your Cart</H3>
                <BodySmall style={styles.subtitle}>
                    {cartState.totalQuantity} item
                    {cartState.totalQuantity !== 1 ? "s" : ""} in your cart
                </BodySmall>
            </View>

            <ScrollView
                style={styles.scrollContainer}
                showsVerticalScrollIndicator={false}
            >
                {/* Cart Items */}
                <View style={styles.cartItemsSection}>
                    {cartState.items.map(renderCartItem)}
                </View>

                {/* Delivery Address Section */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Ionicons
                            name="location-outline"
                            size={20}
                            color={COLORS.primary}
                        />
                        <H4 style={styles.sectionTitle}>Delivery Address</H4>
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
                                <BodySmall style={styles.appliedCouponDiscount}>
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
                            onPress={() => setIsCouponBottomSheetVisible(true)}
                            disabled={isFetchingCoupons}
                        >
                            {isFetchingCoupons ? (
                                <ActivityIndicator
                                    size="small"
                                    color={COLORS.primary}
                                />
                            ) : (
                                <Ionicons
                                    name="pricetag"
                                    size={24}
                                    color={COLORS.primary}
                                />
                            )}
                            <Body style={styles.applyCouponText}>
                                {isFetchingCoupons
                                    ? "Loading coupons..."
                                    : coupons.length > 0
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

                {/* Order Summary */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Ionicons
                            name="receipt-outline"
                            size={20}
                            color={COLORS.primary}
                        />
                        <H4 style={styles.sectionTitle}>Order Summary</H4>
                    </View>
                    <View style={styles.summaryContainer}>
                        <View style={styles.summaryRow}>
                            <Body>
                                Subtotal ({cartState.totalQuantity} items)
                            </Body>
                            <Body>₹{cartState.totalPrice.toFixed(2)}</Body>
                        </View>
                        <View style={styles.summaryRow}>
                            <Body>Delivery Fee</Body>
                            <Body style={styles.freeDelivery}>Free</Body>
                        </View>
                        {discount > 0 && (
                            <>
                                <View style={styles.summaryDivider} />
                                <View style={styles.summaryRow}>
                                    <View style={styles.discountLabelContainer}>
                                        <Body style={styles.summaryLabel}>
                                            Discount
                                        </Body>
                                        {selectedCoupon && (
                                            <Caption
                                                style={styles.couponCodeText}
                                            >
                                                ({selectedCoupon.code})
                                            </Caption>
                                        )}
                                    </View>
                                    <Body
                                        style={[
                                            styles.summaryValue,
                                            styles.discountText,
                                        ]}
                                    >
                                        - {formatCurrency(discount)}
                                    </Body>
                                </View>
                            </>
                        )}
                        <View style={styles.summaryDivider} />
                        <View style={styles.summaryRow}>
                            <H4>Total Amount</H4>
                            <H4 style={styles.totalAmount}>
                                {formatCurrency(totalPrice)}
                            </H4>
                        </View>
                    </View>
                </View>
            </ScrollView>

            {/* Checkout Button */}
            <View style={styles.checkoutButtonContainer}>
                <PrimaryButton
                    title={`Place Order • ${formatCurrency(totalPrice)}`}
                    onPress={handleCheckout}
                    disabled={cartState.isLoading || !selectedAddress}
                    fullWidth
                    loading={cartState.isLoading}
                    icon={
                        <Ionicons name="card" size={20} color={COLORS.WHITE} />
                    }
                    iconPosition="left"
                />
            </View>

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
    },
    scrollContainer: {
        flex: 1,
        paddingHorizontal: 20,
    },
    header: {
        paddingHorizontal: 20,
        paddingTop: 60,
        marginBottom: 20,
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

    // Cart Items Styles
    cartItemsSection: {
        marginBottom: 30,
    },
    cartItemContainer: {
        backgroundColor: COLORS.WHITE,
        borderWidth: 1,
        borderColor: COLORS.GREY[100],
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        flexDirection: "row",
    },
    itemImageContainer: {
        marginRight: 15,
    },
    itemImage: {
        width: 80,
        height: 80,
        borderRadius: 12,
    },
    itemDetails: {
        flex: 1,
    },
    itemHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 15,
    },
    itemInfo: {
        flex: 1,
    },
    itemName: {
        color: COLORS.TEXT.DARK,
        marginBottom: 4,
    },
    itemPrice: {
        color: COLORS.TEXT.LIGHT,
    },
    removeButton: {
        padding: 4,
    },
    itemFooter: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    quantityContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: COLORS.primaryLight,
        borderRadius: 8,
        padding: 4,
    },
    quantityButton: {
        width: 32,
        height: 32,
        borderRadius: 6,
        backgroundColor: COLORS.WHITE,
        alignItems: "center",
        justifyContent: "center",
    },
    quantityText: {
        marginHorizontal: 15,
        fontWeight: WEIGHTS.MEDIUM,
        color: COLORS.TEXT.DARK,
    },
    priceContainer: {
        alignItems: "flex-end",
    },
    itemTotal: {
        color: COLORS.primary,
        fontWeight: WEIGHTS.BOLD,
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
    selectedText: {
        color: COLORS.WHITE,
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

    // Summary Styles
    summaryContainer: {
        backgroundColor: "#F8F9FA",
        borderRadius: 12,
        padding: 16,
    },
    summaryRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
    },
    summaryDivider: {
        height: 1,
        backgroundColor: COLORS.GREY[100],
        marginVertical: 8,
    },
    freeDelivery: {
        color: COLORS.GREEN[700],
        fontWeight: WEIGHTS.MEDIUM,
    },
    totalAmount: {
        color: COLORS.primary,
        fontWeight: WEIGHTS.BOLD,
    },
    summaryLabel: {
        color: COLORS.TEXT.DARK,
    },
    summaryValue: {
        color: COLORS.TEXT.DARK,
    },
    discountLabelContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },
    discountText: {
        color: COLORS.GREEN[700],
        fontWeight: WEIGHTS.SEMI_BOLD,
    },
    couponCodeText: {
        color: COLORS.GREEN[700],
        fontWeight: WEIGHTS.MEDIUM,
        textTransform: "uppercase",
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

    // Empty Cart Styles
    emptyCartContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 40,
    },
    emptyCartTitle: {
        marginTop: 20,
        marginBottom: 10,
        color: COLORS.TEXT.DARK,
        textAlign: "center",
    },
    emptyCartSubtitle: {
        color: COLORS.TEXT.LIGHT,
        textAlign: "center",
        marginBottom: 30,
    },
    emptyCartButtonContainer: {
        width: "100%",
    },

    // Checkout Button Styles
    checkoutButtonContainer: {
        paddingHorizontal: 20,
        paddingVertical: 20,
        backgroundColor: COLORS.WHITE,
        borderTopWidth: 1,
        borderTopColor: COLORS.GREY[100],
    },
});

export default CartCheckout;
