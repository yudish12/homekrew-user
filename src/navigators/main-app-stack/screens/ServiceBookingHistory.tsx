import React, { useState, useEffect } from "react";
import {
    View,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    RefreshControl,
    Alert,
} from "react-native";
import { SafeAreaView } from "../../../components/SafeAreaView";
import { H3, Body, Caption, H4, H5 } from "../../../components/Typography";
import { COLORS } from "../../../constants/ui";
import { Button, OutlineButton } from "../../../components/Button";
import { CustomIcon } from "../../../components/CustomIcon";
import Header from "../../../components/header";
import Tabs from "../../../components/Tabs";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { RootState } from "../../../types";
import { OrdersServices } from "../../../services/orders";
import { BookingHistory } from "../../../types/services/orders";
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
                {statusBadge.replace("_", " ").toUpperCase()}
            </Caption>
        </View>
    );
};

const BookingHistoryCard: React.FC<{
    booking: BookingHistory;
    onPress: () => void;
}> = ({ booking, onPress }) => {
    const formatAddress = (address: BookingHistory["address"]) => {
        if (!address) return "No address";
        return (
            address.completeAddress ||
            `${address.city || ""}, ${address.state || ""}`
                .replace(/,\s*,/g, ",")
                .replace(/^,\s*|,\s*$/g, "")
        );
    };

    const getStatusDisplay = (status: string) => {
        switch (status.toLowerCase()) {
            case "vendor_assigned":
                return "Vendor Assigned";
            case "pending":
                return "Pending";
            case "completed":
                return "Completed";
            case "cancelled":
                return "Cancelled";
            case "in_progress":
                return "In Progress";
            default:
                return status.charAt(0).toUpperCase() + status.slice(1);
        }
    };

    return (
        <TouchableOpacity
            style={styles.bookingCard}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <View style={styles.cardHeader}>
                <View style={styles.serviceInfo}>
                    <H5 style={{ color: COLORS.TEXT.DARK }}>
                        {booking?.serviceName ?? booking?.service?.title}
                    </H5>
                    <View style={styles.serviceMeta}>
                        <CustomIcon
                            provider="Ionicons"
                            name="calendar"
                            size={12}
                            color={COLORS.GREY[500]}
                        />
                        <Caption
                            style={{ marginLeft: 4 }}
                            color={COLORS.GREY[500]}
                        >
                            {booking.formattedDate ||
                                new Date(
                                    booking.date,
                                ).toLocaleDateString()}{" "}
                            • {booking.timeSlot}
                        </Caption>
                    </View>
                </View>
                <StatusBadge
                    status={booking.status}
                    statusBadge={getStatusDisplay(booking.status)}
                />
            </View>

            <View style={styles.cardContent}>
                <View style={styles.addressRow}>
                    <CustomIcon
                        provider="Ionicons"
                        name="location"
                        size={14}
                        color={COLORS.GREY[500]}
                    />
                    <Caption
                        style={{ marginLeft: 6, flex: 1 }}
                        color={COLORS.GREY[500]}
                        numberOfLines={1}
                    >
                        {formatAddress(booking.address)}
                    </Caption>
                </View>

                {booking.vendorSearch?.assignedVendor && (
                    <View style={styles.vendorRow}>
                        <CustomIcon
                            provider="Ionicons"
                            name="person"
                            size={14}
                            color={COLORS.GREY[500]}
                        />
                        <Caption
                            style={{ marginLeft: 6 }}
                            color={COLORS.GREY[500]}
                        >
                            {
                                booking.vendorSearch.assignedVendor.vendorId
                                    .firstName
                            }{" "}
                            {
                                booking.vendorSearch.assignedVendor.vendorId
                                    .lastName
                            }
                        </Caption>
                    </View>
                )}

                <View style={styles.priceRow}>
                    <Body
                        style={{ color: COLORS.TEXT.DARK, fontWeight: "600" }}
                    >
                        {booking.formattedAmount ||
                            `₹${
                                booking.totalPrice ||
                                booking.pricing.totalAmount ||
                                0
                            }`}
                    </Body>
                    <Caption color={COLORS.GREY[500]}>
                        {booking.paymentStatus === "paid" ? "Paid" : "Pending"}
                    </Caption>
                </View>
            </View>

            <View style={styles.cardActions}>
                {booking.canRate && (
                    <OutlineButton
                        title="Rate Service"
                        size="small"
                        style={{ flex: 1 }}
                        icon={
                            <CustomIcon
                                provider="Ionicons"
                                name="star"
                                size={14}
                                color={COLORS.primary}
                            />
                        }
                    />
                )}
                <Button
                    title="View Details"
                    size="small"
                    variant="outline"
                    onPress={onPress}
                    textStyle={{ color: COLORS.primary }}
                    style={{
                        flex: 1,
                        marginLeft: 8,
                        paddingVertical: 12,
                        borderColor: COLORS.primary,
                    }}
                    icon={
                        <CustomIcon
                            provider="Ionicons"
                            name="eye"
                            size={14}
                            color={COLORS.primary}
                        />
                    }
                />
            </View>
        </TouchableOpacity>
    );
};

const EmptyState: React.FC<{ filter: string }> = ({ filter }) => {
    const getEmptyMessage = (filter: string) => {
        switch (filter) {
            case "all":
                return "No booking history found";
            case "completed":
                return "No completed bookings";
            case "cancelled":
                return "No cancelled bookings";
            case "pending":
                return "No pending bookings";
            default:
                return "No bookings found";
        }
    };

    return (
        <View style={styles.emptyState}>
            <CustomIcon
                provider="Ionicons"
                name="document-text"
                size={48}
                color={COLORS.GREY[400]}
            />
            <H4
                style={{
                    color: COLORS.GREY[500],
                    marginTop: 16,
                    textAlign: "center",
                }}
            >
                {getEmptyMessage(filter)}
            </H4>
            <Caption
                style={{
                    color: COLORS.GREY[400],
                    textAlign: "center",
                    marginTop: 8,
                }}
            >
                Your service booking history will appear here
            </Caption>
        </View>
    );
};

const LoadingState: React.FC = () => {
    return (
        <View style={styles.loadingState}>
            <CustomIcon
                provider="Ionicons"
                name="refresh"
                size={32}
                color={COLORS.primary}
            />
            <Body
                style={{
                    color: COLORS.GREY[500],
                    marginTop: 12,
                    textAlign: "center",
                }}
            >
                Loading booking history...
            </Body>
        </View>
    );
};

const ServiceBookingHistory: React.FC = () => {
    const navigation = useNavigation<any>();
    const user = useSelector((state: RootState) => state.auth.user);

    const [activeTab, setActiveTab] = useState("all");
    const [bookings, setBookings] = useState<BookingHistory[]>([]);
    const [filteredBookings, setFilteredBookings] = useState<BookingHistory[]>(
        [],
    );
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const tabOptions = [
        { label: "All", value: "all" },
        { label: "Completed", value: "completed" },
        { label: "Pending", value: "pending" },
    ];

    const fetchBookingHistory = async () => {
        if (!user?._id) {
            setError("User not found");
            setLoading(false);
            return;
        }

        try {
            setError(null);
            const response = await OrdersServices.getServiceBookingHistory(
                user._id,
            );
            if (response.success && response.data) {
                // Handle the new API response structure
                const bookingData = response.data || [];
                setBookings(bookingData);
                filterBookings(activeTab, bookingData);
            } else {
                setError(response.message || "Failed to fetch booking history");
                setBookings([]);
                setFilteredBookings([]);
            }
        } catch (err) {
            console.error("Error fetching booking history:", err);
            setError("Something went wrong. Please try again.");
            setBookings([]);
            setFilteredBookings([]);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const filterBookings = (
        filter: string,
        bookingsData: BookingHistory[] = bookings,
    ) => {
        console.log(bookingsData);
        if (filter === "all") {
            setFilteredBookings(bookingsData);
        } else if (filter === "pending") {
            setFilteredBookings(
                bookingsData.filter(
                    booking =>
                        booking.status === "arrived" ||
                        booking.status === "vendor_assigned" ||
                        booking.status === "in_progress",
                ),
            );
        } else {
            setFilteredBookings(
                bookingsData.filter(booking => booking.status === filter),
            );
        }
    };

    const handleTabPress = (value: string) => {
        setActiveTab(value);
        filterBookings(value);
    };

    const handleRefresh = async () => {
        setRefreshing(true);
        await fetchBookingHistory();
    };

    const handleBookingPress = (booking: BookingHistory) => {
        // Navigate to booking details
        navigation.navigate("BookingDetails", { booking });
    };

    const renderBookingItem = ({ item }: { item: BookingHistory }) => (
        <BookingHistoryCard
            booking={item}
            onPress={() => handleBookingPress(item)}
        />
    );

    useEffect(() => {
        fetchBookingHistory();
    }, [user?._id]);

    if (loading) {
        return (
            <SafeAreaView>
                <Header
                    backHandler={() => navigation.goBack()}
                    backButton={true}
                    title="Service History"
                />
                <View style={styles.container}>
                    <LoadingState />
                </View>
            </SafeAreaView>
        );
    }

    if (error) {
        return (
            <SafeAreaView>
                <Header
                    backHandler={() => navigation.goBack()}
                    backButton={true}
                    title="Service History"
                />
                <View style={styles.container}>
                    <View style={styles.errorState}>
                        <CustomIcon
                            provider="Ionicons"
                            name="alert-circle"
                            size={48}
                            color={COLORS.RED[500]}
                        />
                        <H4
                            style={{
                                color: COLORS.RED[500],
                                marginTop: 16,
                                textAlign: "center",
                            }}
                        >
                            Error Loading History
                        </H4>
                        <Caption
                            style={{
                                color: COLORS.GREY[500],
                                textAlign: "center",
                                marginTop: 8,
                            }}
                        >
                            {error}
                        </Caption>
                        <Button
                            title="Try Again"
                            style={{ marginTop: 16 }}
                            onPress={fetchBookingHistory}
                            icon={
                                <CustomIcon
                                    provider="Ionicons"
                                    name="refresh"
                                    size={16}
                                    color={COLORS.WHITE}
                                />
                            }
                        />
                    </View>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView>
            <Header
                backHandler={() => navigation.goBack()}
                backButton={true}
                title="Service History"
            />

            <View style={styles.container}>
                <Tabs
                    tabOptions={tabOptions}
                    currentTab={activeTab}
                    onTabPress={handleTabPress}
                />

                <View style={styles.content}>
                    {filteredBookings.length > 0 ? (
                        <FlatList
                            data={filteredBookings}
                            renderItem={renderBookingItem}
                            keyExtractor={item => item._id}
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={styles.listContainer}
                            refreshControl={
                                <RefreshControl
                                    refreshing={refreshing}
                                    onRefresh={handleRefresh}
                                    colors={[COLORS.primary]}
                                    tintColor={COLORS.primary}
                                />
                            }
                        />
                    ) : (
                        <EmptyState filter={activeTab} />
                    )}
                </View>
            </View>
        </SafeAreaView>
    );
};

export default ServiceBookingHistory;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingVertical: 20,
        backgroundColor: COLORS.WHITE,
    },
    content: {
        flex: 1,
        paddingHorizontal: uiUtils.spacing.getHorizontalPadding(),
    },
    listContainer: {
        paddingTop: 16,
        paddingBottom: 24,
    },
    bookingCard: {
        backgroundColor: COLORS.WHITE,
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: COLORS.border.light,
        shadowColor: COLORS.TEXT.DARK,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
        elevation: 1,
    },
    cardHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 12,
    },
    serviceInfo: {
        flex: 1,
        marginRight: 12,
    },
    serviceMeta: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 4,
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        alignSelf: "flex-start",
    },
    statusText: {
        fontSize: 11,
        fontWeight: "600",
    },
    cardContent: {
        marginBottom: 12,
    },
    addressRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 6,
    },
    vendorRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 8,
    },
    priceRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    cardActions: {
        flexDirection: "row",
        alignItems: "center",
    },
    emptyState: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 32,
    },
    loadingState: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 32,
    },
    errorState: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 32,
    },
});
