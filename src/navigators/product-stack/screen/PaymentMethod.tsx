import React, { useState } from "react";
import { View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { COLORS, WEIGHTS } from "../../../constants//ui";
import RazorpayCheckout from "react-native-razorpay";
import {
    Typography,
    H3,
    H4,
    Body,
    BodySmall,
} from "../../../components/Typography";
import { PrimaryButton } from "../../../components/Button";
import Modal, { SuccessModal, ErrorModal } from "../../../components/Modal";
import { SafeAreaView } from "../../../components/SafeAreaView";
import { OrdersServices } from "../../../services/orders";
import { useSelector } from "react-redux";
import { getOrderSummary } from "../../../redux/selectors";
import { BookOrderRequest } from "../../../types/services/orders";
import { RootState } from "../../../types";
import { useNavigation } from "@react-navigation/native";

// Types
interface PaymentMethod {
    id: "razorpay" | "cod";
    type: "razorpay" | "cod";
    title: string;
    subtitle: string;
    icon: string;
    iconProvider: "Ionicons" | "MaterialIcons";
    benefits: string[];
    processingFee?: number;
    isRecommended?: boolean;
}

// Mock data
const paymentMethods: PaymentMethod[] = [
    {
        id: "razorpay",
        type: "razorpay",
        title: "Pay Online",
        subtitle: "Credit/Debit Card, UPI, Net Banking",
        icon: "card-outline",
        iconProvider: "Ionicons",
        benefits: [
            "Instant payment confirmation",
            "Secure encrypted transactions",
            "Multiple payment options",
            "Cashback eligible",
        ],
        processingFee: 0,
        isRecommended: true,
    },
    {
        id: "cod",
        type: "cod",
        title: "Cash on Delivery",
        subtitle: "Pay when your order is delivered",
        icon: "local-shipping",
        iconProvider: "MaterialIcons",
        benefits: [
            "Pay after receiving the order",
            "Inspect before payment",
            "No advance payment required",
            "Cash or card at doorstep",
        ],
    },
];

const PaymentMethod: React.FC = () => {
    const [selectedMethod, setSelectedMethod] = useState<"razorpay" | "cod">(
        "razorpay",
    );
    const [isProcessing, setIsProcessing] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);

    // Mock order summary
    const orderSummary = useSelector(getOrderSummary);
    const user = useSelector((state: RootState) => state.auth.user);
    const selectedAddress = useSelector(
        (state: RootState) => state.address.selectedAddress,
    );
    const items = useSelector((state: RootState) => state.cart.items);

    const handleMethodSelect = (methodId: "razorpay" | "cod") => {
        setSelectedMethod(methodId);
    };

    const navigation = useNavigation<any>();

    const handlePayment = async () => {
        try {
            setIsProcessing(true);

            const checkoutData: BookOrderRequest = {
                userId: user?._id ?? "",
                products: items.map(item => ({
                    product: item.id,
                    productName: item.name,
                    price: item.singleItemPrice,
                    quantity: item.quantity,
                })),
                couponCode: undefined,
                address: selectedAddress?._id ?? "",
                paymentMethod: selectedMethod,
                customer: {
                    name: user?.name ?? "",
                    contact: user?.phoneNumber ?? "",
                },
            };

            const response = await OrdersServices.bookOrder(checkoutData);

            if (selectedMethod === "razorpay") {
                const options = {
                    key: "rzp_test_M1Ad7casmGNZTV",
                    amount: (response.data?.razorpayOrder?.amount ?? 0) / 100,
                    currency: "INR",
                    theme: {
                        color: COLORS.primary,
                        type: "light",
                    },
                    order_id: response.data?.razorpayOrder.id ?? "",
                    name: "Buy Products",
                    description:
                        "Payment to buy products delivered right at your registered address ",
                };
                const data = await RazorpayCheckout.open(options);
            }
            setShowSuccessModal(true);
            setIsProcessing(false);
        } catch (error) {
            setShowErrorModal(true);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleSuccessClose = () => {
        setShowSuccessModal(false);
        navigation.navigate("OrderHistory");
    };

    const handleErrorClose = () => {
        setShowErrorModal(false);
    };

    const handleRetryPayment = () => {
        setShowErrorModal(false);
        handlePayment();
    };

    const renderPaymentMethod = (method: PaymentMethod) => {
        const isSelected = selectedMethod === method.id;
        const IconComponent =
            method.iconProvider === "Ionicons" ? Ionicons : MaterialIcons;

        return (
            <TouchableOpacity
                key={method.id}
                style={[
                    styles.paymentMethodContainer,
                    isSelected && styles.selectedMethodContainer,
                ]}
                onPress={() => handleMethodSelect(method.id)}
            >
                <View style={styles.methodHeader}>
                    <View style={styles.methodIcon}>
                        <IconComponent
                            name={method.icon as any}
                            size={24}
                            color={isSelected ? COLORS.WHITE : COLORS.primary}
                        />
                    </View>
                    <View style={styles.methodInfo}>
                        <H4
                            style={[
                                styles.methodTitle,
                                isSelected && styles.selectedText,
                            ]}
                        >
                            {method.title}
                        </H4>
                        <BodySmall
                            style={[
                                styles.methodSubtitle,
                                isSelected && styles.selectedText,
                            ]}
                        >
                            {method.subtitle}
                        </BodySmall>
                    </View>
                    <View style={styles.radioContainer}>
                        <View
                            style={[
                                styles.radioOuter,
                                isSelected && styles.radioOuterSelected,
                            ]}
                        >
                            {isSelected && <View style={styles.radioInner} />}
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    const selectedMethodData = paymentMethods.find(
        m => m.id === selectedMethod,
    );

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <H3>Payment Method</H3>
                <BodySmall style={styles.subtitle}>
                    Choose your preferred payment option
                </BodySmall>
            </View>

            <ScrollView
                style={styles.scrollContainer}
                showsVerticalScrollIndicator={false}
            >
                {/* Payment Methods */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Ionicons
                            name="card-outline"
                            size={20}
                            color={COLORS.primary}
                        />
                        <H4 style={styles.sectionTitle}>
                            Select Payment Method
                        </H4>
                    </View>
                    <View style={styles.methodsList}>
                        {paymentMethods.map(renderPaymentMethod)}
                    </View>
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
                            <Body>Subtotal</Body>
                            <Body>${orderSummary.subtotal}</Body>
                        </View>
                        <View style={styles.summaryRow}>
                            <Body>Delivery Fee</Body>
                            <Body style={styles.freeDelivery}>Free</Body>
                        </View>
                        <View style={styles.summaryDivider} />
                        <View style={styles.summaryRow}>
                            <H4>Total Amount</H4>
                            <H4 style={styles.totalAmount}>
                                ${orderSummary.total}
                            </H4>
                        </View>
                    </View>
                </View>

                {/* Security Info */}
                <View style={styles.securityInfo}>
                    <View style={styles.securityItem}>
                        <Ionicons
                            name="shield-checkmark"
                            size={20}
                            color={COLORS.GREEN[700]}
                        />
                        <BodySmall style={styles.securityText}>
                            256-bit SSL encryption
                        </BodySmall>
                    </View>
                    <View style={styles.securityItem}>
                        <Ionicons
                            name="lock-closed"
                            size={20}
                            color={COLORS.GREEN[700]}
                        />
                        <BodySmall style={styles.securityText}>
                            PCI DSS compliant
                        </BodySmall>
                    </View>
                    <View style={styles.securityItem}>
                        <Ionicons
                            name="checkmark-circle"
                            size={20}
                            color={COLORS.GREEN[700]}
                        />
                        <BodySmall style={styles.securityText}>
                            Secure payment gateway
                        </BodySmall>
                    </View>
                </View>
            </ScrollView>

            {/* Payment Button */}
            <View style={styles.paymentButtonContainer}>
                <PrimaryButton
                    title={`${
                        selectedMethodData?.type === "razorpay"
                            ? "Pay Now"
                            : "Place Order"
                    } • $${orderSummary.total}`}
                    onPress={handlePayment}
                    fullWidth
                    disabled={isProcessing || !selectedAddress}
                    loading={isProcessing}
                    icon={
                        <Ionicons
                            name={
                                selectedMethodData?.type === "razorpay"
                                    ? "card"
                                    : "cash-outline"
                            }
                            size={20}
                            color={COLORS.WHITE}
                        />
                    }
                    iconPosition="left"
                />
            </View>

            {/* Success Modal */}
            <SuccessModal
                visible={showSuccessModal}
                onClose={handleSuccessClose}
                title="Payment Successful!"
                message={
                    selectedMethodData?.type === "razorpay"
                        ? "Your payment has been processed successfully. Your order will be prepared and shipped soon."
                        : "Your order has been placed successfully. You can pay cash when the order is delivered."
                }
                primaryButton={{
                    title: "View Order",
                    onPress: handleSuccessClose,
                }}
                secondaryButton={{
                    title: "Continue Shopping",
                    onPress: () => navigation.navigate("ProductsLanding"),
                }}
            />

            {/* Error Modal */}
            <ErrorModal
                visible={showErrorModal}
                onClose={handleErrorClose}
                title="Payment Failed"
                message={
                    selectedMethodData?.type === "razorpay"
                        ? "We couldn't process your payment. Please check your payment details and try again."
                        : "There was an issue placing your order. Please try again."
                }
                primaryButton={{
                    title: "Try Again",
                    onPress: handleRetryPayment,
                }}
                secondaryButton={{
                    title: "Cancel",
                    onPress: handleErrorClose,
                }}
            />
        </SafeAreaView>
    );
};

export default PaymentMethod;

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
        paddingTop: 20,
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

    // Payment Methods Styles
    methodsList: {
        gap: 16,
    },
    paymentMethodContainer: {
        backgroundColor: COLORS.WHITE,
        borderWidth: 2,
        borderColor: COLORS.GREY[100],
        borderRadius: 16,
        padding: 16,
        position: "relative",
    },
    selectedMethodContainer: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
    },
    methodHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
    },
    methodIcon: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 8,
    },
    methodInfo: {
        flex: 1,
        marginLeft: 6,
    },
    methodTitle: {
        fontWeight: WEIGHTS.MEDIUM,
        marginBottom: 4,
    },
    methodSubtitle: {
        color: COLORS.TEXT.LIGHT,
        marginBottom: 8,
    },
    radioContainer: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: COLORS.GREY[100],
        alignItems: "center",
        justifyContent: "center",
        position: "absolute",
        top: 0,
        right: 0,
    },
    radioOuter: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: COLORS.primary,
        alignItems: "center",
        justifyContent: "center",
    },
    selectedText: {
        color: COLORS.WHITE,
    },
    radioOuterSelected: {
        backgroundColor: COLORS.primary,
    },
    radioInner: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: COLORS.WHITE,
    },
    processingFeeContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 8,
    },
    processingFeeText: {
        color: COLORS.TEXT.LIGHT,
        marginLeft: 4,
    },
    recommendedText: {
        color: COLORS.WHITE,
        backgroundColor: COLORS.primary,
        paddingHorizontal: 4,
        paddingVertical: 2,
        borderRadius: 4,
    },
    benefitsList: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
        marginBottom: 8,
    },
    benefitItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 8,
        borderRadius: 8,
        backgroundColor: COLORS.GREY[100],
    },
    benefitText: {
        color: COLORS.TEXT.LIGHT,
        marginLeft: 4,
    },

    // Order Summary Styles
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
    recommendedBadge: {
        position: "absolute",
        top: 4,
        right: 4,
        backgroundColor: COLORS.primary,
        borderRadius: 10,
        minWidth: 20,
        height: 20,
        alignItems: "center",
        justifyContent: "center",
    },
    // Security Info Styles
    securityInfo: {
        marginBottom: 20,
    },
    securityItem: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        marginBottom: 8,
    },
    securityText: {
        color: COLORS.TEXT.LIGHT,
    },
    paymentButtonContainer: {
        marginTop: 20,
        paddingHorizontal: 20,
        marginBottom: 40,
    },
});
