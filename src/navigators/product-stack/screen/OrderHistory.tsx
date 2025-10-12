import React, { useEffect, useMemo, useState } from "react";
import {
    View,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, WEIGHTS } from "../../../constants/ui";
import {
    Typography,
    H3,
    H4,
    Body,
    BodySmall,
} from "../../../components/Typography";
import Tabs from "../../../components/Tabs";
import { OrdersServices } from "../../../services/orders";
import { OrderHistory } from "../../../types/services/orders";
import { formatAddress } from "../../../utils";
import { SafeAreaView } from "../../../components/SafeAreaView";
import { BackButton } from "../../../components/BackButton";
import { useNavigation } from "@react-navigation/native";

// Types
interface OrderItem {
    id: string;
    name: string;
    image: string;
    quantity: number;
    price: number;
}

interface Order {
    id: string;
    orderNumber: string;
    date: string;
    status: "confirmed" | "delivered";
    items: OrderItem[];
    totalAmount: number;
    deliveryAddress: string;
    estimatedDelivery?: string;
    deliveredDate?: string;
    paymentMethod: string;
}

const tabOptions = [
    { label: "Pending", value: "pending" },
    { label: "Confirmed", value: "confirmed" },
    { label: "Delivered", value: "delivered" },
];

const OrderHistoryComponent: React.FC = () => {
    const [currentTab, setCurrentTab] = useState<string>("pending");
    const [refreshing, setRefreshing] = useState(false);
    const [orderHistory, setOrderHistory] = useState<OrderHistory[]>([]);

    const navigation = useNavigation<any>();

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchOrderHistory();
        setRefreshing(false);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "confirmed":
                return COLORS.primary;
            case "delivered":
                return COLORS.GREEN[700];
            default:
                return COLORS.GREY[400];
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "confirmed":
                return "time-outline";
            case "delivered":
                return "checkmark-circle";
            case "pending":
                return "time-outline";
            default:
                return "ellipse-outline";
        }
    };

    const fetchOrderHistory = async () => {
        const response = await OrdersServices.getOrderHistory();
        if (!response.success || !response.data) {
            setOrderHistory([]);
            return;
        }
        setOrderHistory(response.data);
    };

    const filteredOrders = useMemo(() => {
        return orderHistory.filter(order => order.orderStatus === currentTab);
    }, [orderHistory, currentTab]);

    useEffect(() => {
        fetchOrderHistory();
    }, []);

    const renderOrderItem = (item: OrderHistory["products"][0]) => (
        <View key={item._id} style={styles.orderItemContainer}>
            <Image
                source={{ uri: item?.images?.[0] ?? "" }}
                style={styles.itemImage}
                resizeMode="cover"
            />
            <View style={styles.itemDetails}>
                <BodySmall style={styles.itemName}>{item.name}</BodySmall>
                <BodySmall style={styles.itemQuantity}>
                    Qty: {item.quantity}
                </BodySmall>
            </View>
            <BodySmall style={styles.itemPrice}>${item.price}</BodySmall>
        </View>
    );

    const renderOrderCard = (order: OrderHistory) => (
        <TouchableOpacity key={order._id} style={styles.orderCard}>
            {/* Order Header */}
            <View style={styles.orderHeader}>
                <View style={styles.orderInfo}>
                    <H4 style={styles.orderNumber}>#{order.orderId}</H4>
                    <BodySmall style={styles.orderDate}>
                        {order.formattedDate}
                    </BodySmall>
                </View>
                <View
                    style={[
                        styles.statusContainer,
                        {
                            backgroundColor: `${getStatusColor(
                                order.orderStatus,
                            )}20`,
                        },
                    ]}
                >
                    <Ionicons
                        name={getStatusIcon(order.orderStatus)}
                        size={14}
                        color={getStatusColor(order.orderStatus)}
                    />
                    <BodySmall
                        style={[
                            styles.statusText,
                            { color: getStatusColor(order.orderStatus) },
                        ]}
                    >
                        {order.orderStatus.charAt(0).toUpperCase() +
                            order.orderStatus.slice(1)}
                    </BodySmall>
                </View>
            </View>

            {/* Order Items */}
            <View style={styles.orderItemsContainer}>
                {order.products.map(renderOrderItem)}
            </View>

            {/* Delivery Info */}
            <View style={styles.deliveryInfo}>
                <View style={styles.deliveryRow}>
                    <Ionicons
                        name="location-outline"
                        size={16}
                        color={COLORS.GREY[400]}
                    />
                    <BodySmall style={styles.deliveryText} numberOfLines={2}>
                        {formatAddress(order.address)}
                    </BodySmall>
                </View>

                {order.orderStatus === "delivered" && (
                    <View style={styles.deliveryRow}>
                        <Ionicons
                            name="checkmark-circle-outline"
                            size={16}
                            color={COLORS.GREEN[700]}
                        />
                    </View>
                )}

                {/* <View style={styles.deliveryRow}>
                    <Ionicons
                        name="card-outline"
                        size={16}
                        color={COLORS.GREY[400]}
                    />
                    <BodySmall style={styles.deliveryText}>
                        {order.payment.receipt}
                    </BodySmall>
                </View> */}
            </View>

            {/* Order Footer */}
            <View style={styles.orderFooter}>
                <View style={styles.totalContainer}>
                    <BodySmall style={styles.totalLabel}>
                        Total Amount
                    </BodySmall>
                    <H4 style={styles.totalAmount}>${order.totalAmount}</H4>
                </View>
                <TouchableOpacity style={styles.actionButton}>
                    <BodySmall style={styles.actionButtonText}>
                        {order.orderStatus === "confirmed"
                            ? "Track Order"
                            : "Reorder"}
                    </BodySmall>
                    <Ionicons
                        name="chevron-forward"
                        size={16}
                        color={COLORS.primary}
                    />
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );

    const renderEmptyState = () => (
        <View style={styles.emptyStateContainer}>
            <Ionicons
                name={
                    currentTab === "confirmed"
                        ? "time-outline"
                        : "checkmark-circle-outline"
                }
                size={64}
                color={COLORS.GREY[200]}
            />
            <H4 style={styles.emptyStateTitle}>No {currentTab} orders</H4>
            <BodySmall style={styles.emptyStateSubtitle}>
                {currentTab === "confirmed"
                    ? "You don't have any confirmed orders at the moment"
                    : "You don't have any delivered orders yet"}
            </BodySmall>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <BackButton onPress={() => navigation.goBack()} />
                <H3>Order History</H3>
                <BodySmall style={styles.subtitle}>
                    Track and manage your orders
                </BodySmall>
            </View>

            {/* Tabs */}
            <View style={styles.tabsContainer}>
                <Tabs
                    tabOptions={tabOptions}
                    currentTab={currentTab}
                    onTabPress={setCurrentTab}
                    textStyle={styles.tabText}
                />
            </View>

            {/* Orders List */}
            <ScrollView
                style={styles.scrollContainer}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor={COLORS.primary}
                        colors={[COLORS.primary]}
                    />
                }
            >
                <View style={styles.ordersContainer}>
                    {filteredOrders.length > 0
                        ? filteredOrders.map(renderOrderCard)
                        : renderEmptyState()}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.WHITE,
    },
    header: {
        paddingHorizontal: 20,
        paddingTop: 60,
        position: "relative",
        marginBottom: 20,
    },
    subtitle: {
        color: COLORS.TEXT.LIGHT,
        marginTop: 5,
    },
    tabsContainer: {
        marginBottom: 20,
    },
    tabText: {
        fontWeight: WEIGHTS.MEDIUM,
        color: COLORS.TEXT.DARK,
    },
    scrollContainer: {
        flex: 1,
        paddingHorizontal: 20,
    },
    ordersContainer: {
        paddingBottom: 20,
    },

    // Order Card Styles
    orderCard: {
        backgroundColor: COLORS.WHITE,
        borderWidth: 1,
        borderColor: COLORS.GREY[100],
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
    },
    orderHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
    },
    orderInfo: {
        flex: 1,
    },
    orderNumber: {
        color: COLORS.TEXT.DARK,
        marginBottom: 4,
    },
    orderDate: {
        color: COLORS.TEXT.LIGHT,
    },
    statusContainer: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statusText: {
        marginLeft: 4,
        fontSize: 12,
        fontWeight: WEIGHTS.MEDIUM,
    },

    // Order Items Styles
    orderItemsContainer: {
        marginBottom: 16,
    },
    orderItemContainer: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.GREY[100],
    },
    itemImage: {
        width: 40,
        height: 40,
        borderRadius: 8,
        marginRight: 12,
    },
    itemDetails: {
        flex: 1,
    },
    itemName: {
        color: COLORS.TEXT.DARK,
        marginBottom: 2,
    },
    itemQuantity: {
        color: COLORS.TEXT.LIGHT,
    },
    itemPrice: {
        color: COLORS.TEXT.DARK,
        fontWeight: WEIGHTS.MEDIUM,
    },

    // Delivery Info Styles
    deliveryInfo: {
        marginBottom: 16,
    },
    deliveryRow: {
        flexDirection: "row",
        alignItems: "flex-start",
        marginBottom: 8,
    },
    deliveryText: {
        marginLeft: 8,
        color: COLORS.TEXT.LIGHT,
        flex: 1,
        lineHeight: 18,
    },

    // Order Footer Styles
    orderFooter: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderTopWidth: 1,
        borderTopColor: COLORS.GREY[100],
        paddingTop: 16,
    },
    totalContainer: {
        flex: 1,
    },
    totalLabel: {
        color: COLORS.TEXT.LIGHT,
        marginBottom: 4,
    },
    totalAmount: {
        color: COLORS.primary,
        fontWeight: WEIGHTS.BOLD,
    },
    actionButton: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: COLORS.primaryLight,
        borderRadius: 8,
    },
    actionButtonText: {
        color: COLORS.primary,
        fontWeight: WEIGHTS.MEDIUM,
        marginRight: 4,
    },

    // Empty State Styles
    emptyStateContainer: {
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 60,
        paddingHorizontal: 40,
    },
    emptyStateTitle: {
        color: COLORS.TEXT.DARK,
        marginTop: 16,
        marginBottom: 8,
        textAlign: "center",
    },
    emptyStateSubtitle: {
        color: COLORS.TEXT.LIGHT,
        textAlign: "center",
        lineHeight: 20,
    },
});

export default OrderHistoryComponent;
