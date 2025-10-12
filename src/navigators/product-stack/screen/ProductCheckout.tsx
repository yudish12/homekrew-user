import React, { useState } from "react";
import {
    View,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, WEIGHTS } from "../../../constants";
import {
    Typography,
    H3,
    H4,
    Body,
    BodySmall,
} from "../../../components/Typography";
import { PrimaryButton } from "../../../components/Button";
import {
    AppDispatch,
    CartItem,
    CartState,
    RootState,
    UserAddress,
} from "../../../types";
import { useDispatch, useSelector } from "react-redux";
import { removeFromCart, updateQuantity } from "../../../redux/actions";
import { StackActions, useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "../../../components/SafeAreaView";
import { BackButton } from "../../../components/BackButton";

const CartCheckout: React.FC = () => {
    const navigation = useNavigation<any>();
    const cartState = useSelector((state: RootState) => state.cart);
    const { selectedAddress } = useSelector(
        (state: RootState) => state.address,
    );

    const dispatch = useDispatch<AppDispatch>();

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
            totalPrice: cartState.totalPrice,
            deliveryAddress: selectedAddress,
            timestamp: new Date().toISOString(),
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
                                ${item.singleItemPrice}
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
                            <H4 style={styles.itemTotal}>${itemTotal}</H4>
                        </View>
                    </View>
                </View>
            </View>
        );
    };

    if (cartState.items.length === 0) {
        return (
            <SafeAreaView>
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
                            <Body>${cartState.totalPrice}</Body>
                        </View>
                        <View style={styles.summaryRow}>
                            <Body>Delivery Fee</Body>
                            <Body style={styles.freeDelivery}>Free</Body>
                        </View>
                        <View style={styles.summaryDivider} />
                        <View style={styles.summaryRow}>
                            <H4>Total Amount</H4>
                            <H4 style={styles.totalAmount}>
                                ${cartState.totalPrice}
                            </H4>
                        </View>
                    </View>
                </View>
            </ScrollView>

            {/* Checkout Button */}
            <View style={styles.checkoutButtonContainer}>
                <PrimaryButton
                    title={`Place Order • $${cartState.totalPrice}`}
                    onPress={handleCheckout}
                    fullWidth
                    loading={cartState.isLoading}
                    icon={
                        <Ionicons name="card" size={20} color={COLORS.WHITE} />
                    }
                    iconPosition="left"
                />
            </View>
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
        padding: 20,
        paddingBottom: 60,
        backgroundColor: COLORS.WHITE,
        borderTopWidth: 1,
        borderTopColor: COLORS.GREY[100],
    },
});

export default CartCheckout;
