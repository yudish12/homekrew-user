import React, { useEffect, useRef, useState } from "react";
import {
    View,
    StyleSheet,
    Dimensions,
    ScrollView,
    TouchableOpacity,
    Animated,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS } from "../../../constants";
import { Typography } from "../../../components/Typography";
import CustomIcon from "../../../components/CustomIcon";

const { width: screenWidth } = Dimensions.get("window");
const CARD_MARGIN = 16;
const CARD_WIDTH = screenWidth - CARD_MARGIN * 2;

interface ActiveBooking {
    _id: string;
    price: number;
    date: string;
    timeSlot: string;
    status: string;
    service: {
        _id: string;
        title: string;
        description: string;
    };
    serviceTemplate: {
        _id: string;
        title: string;
        description: string;
    };
    vendor: {
        _id: string;
        name: string;
        firstName: string;
        lastName: string;
    };
    address: {
        city: string;
        state: string;
        completeAddress: string;
    };
}

interface ActiveBookingsNudgeProps {
    bookings: ActiveBooking[];
    onBookingPress?: (booking: ActiveBooking) => void;
    onViewAllPress?: () => void;
    navigation?: any;
}

const ActiveBookingsNudge: React.FC<ActiveBookingsNudgeProps> = ({
    bookings,
    onBookingPress,
    navigation,
}) => {
    const scrollViewRef = useRef<ScrollView>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;

    useEffect(() => {
        if (bookings.length > 0) {
            // Fade in and slide up animation
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 400,
                    useNativeDriver: true,
                }),
                Animated.spring(slideAnim, {
                    toValue: 0,
                    friction: 8,
                    tension: 40,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    }, [bookings]);

    useEffect(() => {
        if (bookings.length > 1) {
            const interval = setInterval(() => {
                setCurrentIndex(prevIndex => {
                    const nextIndex = (prevIndex + 1) % bookings.length;
                    scrollViewRef.current?.scrollTo({
                        x: nextIndex * (CARD_WIDTH + CARD_MARGIN),
                        animated: true,
                    });
                    return nextIndex;
                });
            }, 5000); // Auto slide every 5 seconds

            return () => clearInterval(interval);
        }
    }, [bookings.length]);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        if (date.toDateString() === today.toDateString()) {
            return "Today";
        } else if (date.toDateString() === tomorrow.toDateString()) {
            return "Tomorrow";
        } else {
            return date.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
            });
        }
    };

    const getStatusConfig = (status: string) => {
        switch (status.toLowerCase()) {
            case "vendor_assigned":
                return {
                    color: COLORS.primary,
                    text: "Vendor Assigned",
                    icon: "person-circle",
                    gradient: [COLORS.primary + "20", COLORS.primary + "10"],
                };
            case "in_progress":
                return {
                    color: COLORS.GREEN[700],
                    text: "In Progress",
                    icon: "time",
                    gradient: [
                        COLORS.GREEN[700] + "20",
                        COLORS.GREEN[700] + "10",
                    ],
                };
            case "confirmed":
                return {
                    color: COLORS.GREEN[700],
                    text: "Confirmed",
                    icon: "checkmark-circle",
                    gradient: [
                        COLORS.GREEN[700] + "20",
                        COLORS.GREEN[700] + "10",
                    ],
                };
            case "pending":
                return {
                    color: COLORS.GREY[500],
                    text: "Pending",
                    icon: "hourglass",
                    gradient: [
                        COLORS.GREY[200] + "20",
                        COLORS.GREY[200] + "10",
                    ],
                };
            default:
                return {
                    color: COLORS.GREY[400],
                    text: status,
                    icon: "information-circle",
                    gradient: [
                        COLORS.GREY[200] + "20",
                        COLORS.GREY[200] + "10",
                    ],
                };
        }
    };

    const getPercentageFromStatus = (status: string) => {
        switch (status.toLowerCase()) {
            case "vendor_assigned":
                return 40;
            case "completed":
                return 80;
            case "confirmed":
                return 20;
            case "arrived":
                return 60;
            default:
                return 0;
        }
    };

    if (bookings.length === 0 || !bookings) {
        return null;
    }

    const handleScroll = (event: any) => {
        const contentOffset = event.nativeEvent.contentOffset;
        const index = Math.round(contentOffset.x / (CARD_WIDTH + CARD_MARGIN));
        setCurrentIndex(index);
    };

    const handleViewAllPress = () => {
        navigation.navigate("ServiceBookingHistory");
    };

    return (
        <Animated.View
            style={[
                styles.container,
                {
                    opacity: fadeAnim,
                    transform: [{ translateY: slideAnim }],
                },
            ]}
        >
            {/* Header */}
            <View style={styles.header}>
                <Typography variant="h4" color={COLORS.TEXT.DARK}>
                    Active Bookings
                </Typography>
                <TouchableOpacity
                    onPress={handleViewAllPress}
                    style={styles.viewAllButton}
                    activeOpacity={0.7}
                >
                    <Typography
                        variant="bodySmall"
                        color={COLORS.primary}
                        style={styles.viewAllText}
                    >
                        View All
                    </Typography>
                    <CustomIcon
                        provider="Ionicons"
                        name="chevron-forward"
                        size={16}
                        color={COLORS.primary}
                        style={styles.viewAllIcon}
                    />
                </TouchableOpacity>
            </View>

            {/* Scrollable Cards */}
            <ScrollView
                ref={scrollViewRef}
                horizontal
                style={{ marginTop: 4 }}
                pagingEnabled={false}
                showsHorizontalScrollIndicator={false}
                onMomentumScrollEnd={handleScroll}
                scrollEventThrottle={16}
                snapToInterval={CARD_WIDTH + CARD_MARGIN}
                decelerationRate="fast"
                contentContainerStyle={styles.scrollContent}
            >
                {bookings.map((booking, index) => {
                    const statusConfig = getStatusConfig(booking.status);
                    return (
                        <TouchableOpacity
                            key={booking._id}
                            style={[
                                styles.bookingCard,
                                index === 0 && styles.firstCard,
                            ]}
                            onPress={() => onBookingPress?.(booking)}
                            activeOpacity={0.7}
                        >
                            {/* Card gradient background */}
                            <View style={styles.cardGradient}>
                                <View style={styles.cardContent}>
                                    {/* Service Title */}
                                    <View style={styles.serviceTitleRow}>
                                        <View
                                            style={styles.serviceIconContainer}
                                        >
                                            <CustomIcon
                                                provider="Ionicons"
                                                name="calendar"
                                                size={18}
                                                color={COLORS.primary}
                                            />
                                        </View>
                                        <Typography
                                            variant="h3"
                                            color={COLORS.TEXT.DARK}
                                            style={styles.serviceTitle}
                                            numberOfLines={1}
                                        >
                                            {booking?.service?.title ??
                                                booking?.serviceTemplate?.title}
                                        </Typography>
                                    </View>

                                    {/* Date & Time */}
                                    <View style={styles.dateTimeRow}>
                                        <View style={styles.dateTimeItem}>
                                            <CustomIcon
                                                provider="Ionicons"
                                                name="calendar-outline"
                                                size={14}
                                                color={COLORS.TEXT.DARK}
                                            />
                                            <Typography
                                                variant="caption"
                                                color={COLORS.TEXT.DARK}
                                                style={styles.dateTimeText}
                                            >
                                                {formatDate(booking.date)}
                                            </Typography>
                                        </View>
                                        <View style={styles.dateTimeItem}>
                                            <CustomIcon
                                                provider="Ionicons"
                                                name="time-outline"
                                                size={14}
                                                color={COLORS.TEXT.DARK}
                                            />
                                            <Typography
                                                variant="caption"
                                                color={COLORS.TEXT.DARK}
                                                style={styles.dateTimeText}
                                            >
                                                {booking.timeSlot}
                                            </Typography>
                                        </View>
                                    </View>

                                    {/* Status Badge */}
                                    <LinearGradient
                                        colors={statusConfig.gradient}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 0 }}
                                        style={styles.statusBadge}
                                    >
                                        <CustomIcon
                                            provider="Ionicons"
                                            name={statusConfig.icon}
                                            size={14}
                                            color={statusConfig.color}
                                        />
                                        <Typography
                                            variant="caption"
                                            color={statusConfig.color}
                                            style={styles.statusText}
                                        >
                                            {statusConfig.text}
                                        </Typography>
                                    </LinearGradient>

                                    {/* Vendor Info */}
                                    {booking.vendor && (
                                        <View style={styles.vendorRow}>
                                            <CustomIcon
                                                provider="Ionicons"
                                                name="person-circle-outline"
                                                size={14}
                                                color={COLORS.TEXT.DARK}
                                            />
                                            <Typography
                                                variant="caption"
                                                color={COLORS.TEXT.DARK}
                                                style={styles.vendorText}
                                                numberOfLines={1}
                                            >
                                                {booking.vendor.firstName}{" "}
                                                {booking.vendor.lastName}
                                            </Typography>
                                        </View>
                                    )}
                                    <View
                                        style={{
                                            position: "relative",
                                            backgroundColor: COLORS.GREY[200],
                                            width: "100%",
                                            height: 4,
                                            borderRadius: 100000,
                                            marginTop: 4,
                                        }}
                                    >
                                        <View
                                            style={{
                                                width: `${getPercentageFromStatus(
                                                    booking.status,
                                                )}%`,
                                                height: 4,
                                                position: "absolute",
                                                top: 0,
                                                left: 0,
                                                backgroundColor: COLORS.primary,
                                            }}
                                        />
                                    </View>
                                </View>

                                {/* View Details indicator */}
                                <View style={styles.viewDetailsIndicator}>
                                    <CustomIcon
                                        provider="Ionicons"
                                        name="chevron-forward"
                                        size={20}
                                        color={COLORS.primary}
                                    />
                                </View>
                            </View>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>

            {/* Pagination Dots */}
            {bookings.length > 1 && (
                <View style={styles.paginationContainer}>
                    {bookings.map((_, index) => (
                        <View
                            key={index}
                            style={[
                                styles.dot,
                                index === currentIndex
                                    ? styles.activeDot
                                    : styles.inactiveDot,
                            ]}
                        />
                    ))}
                </View>
            )}
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 8,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 16,
        marginBottom: 12,
    },
    viewAllButton: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 4,
        paddingHorizontal: 8,
        backgroundColor: COLORS.primaryLight,
        borderRadius: 12,
    },
    viewAllText: {
        fontWeight: "600",
        fontSize: 13,
    },
    viewAllIcon: {
        marginLeft: 2,
    },
    scrollContent: {
        paddingLeft: CARD_MARGIN,
        paddingRight: CARD_MARGIN,
    },
    bookingCard: {
        width: CARD_WIDTH,
        marginRight: CARD_MARGIN,
        borderRadius: 16,
        overflow: "hidden",
        elevation: 3,
        shadowColor: COLORS.GREY[900],
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    firstCard: {
        marginLeft: 0,
    },
    cardGradient: {
        position: "relative",
        padding: 16,
        borderRadius: 16,
        backgroundColor: COLORS.WHITE,
        borderWidth: 2,
        borderColor: COLORS.primary,
    },
    accentBar: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: 4,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
    },
    cardContent: {
        gap: 10,
    },
    serviceTitleRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    serviceIconContainer: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: COLORS.primaryLight,
        justifyContent: "center",
        alignItems: "center",
    },
    serviceTitle: {
        flex: 1,
        fontWeight: "600",
        fontSize: 15,
    },
    dateTimeRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 16,
        paddingLeft: 40,
    },
    dateTimeItem: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
    },
    dateTimeText: {
        fontSize: 12,
        fontWeight: "500",
    },
    statusBadge: {
        flexDirection: "row",
        alignItems: "center",
        alignSelf: "flex-start",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        gap: 4,
        marginLeft: 40,
    },
    statusText: {
        fontSize: 12,
        fontWeight: "600",
        letterSpacing: 0.2,
    },
    vendorRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        paddingLeft: 40,
    },
    vendorText: {
        fontSize: 12,
        fontWeight: "500",
        flex: 1,
    },
    viewDetailsIndicator: {
        position: "absolute",
        right: 12,
        top: "50%",
        marginTop: -10,
    },
    paginationContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        paddingTop: 12,
        gap: 6,
    },
    dot: {
        height: 6,
        borderRadius: 3,
        transition: "all 0.3s",
    },
    activeDot: {
        width: 20,
        backgroundColor: COLORS.primary,
    },
    inactiveDot: {
        width: 6,
        backgroundColor: COLORS.GREY[200],
    },
});

export default ActiveBookingsNudge;
