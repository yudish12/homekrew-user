import React, { useState } from "react";
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
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { COLORS, WEIGHTS } from "../../../constants";
import {
    Typography,
    H3,
    H4,
    Body,
    BodySmall,
} from "../../../components/Typography";
import { Button, PrimaryButton } from "../../../components/Button";
import { Input } from "../../../components/Input";
import { BackButton } from "../../../components/BackButton";
import { useNavigation, useRoute } from "@react-navigation/native";
import { SafeAreaView } from "../../../components/SafeAreaView";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../types";
import { setSelectedAddress } from "../../../redux/actions";
import CustomIcon from "../../../components/CustomIcon";
import { BookingData, TimeSlot } from "../../../types/services/orders";
import { OrdersServices } from "../../../services/orders";
import { showErrorToast } from "../../../components/Toast";

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

    // navigation hooks
    const navigation = useNavigation<any>();
    const params = useRoute().params as {
        serviceId: string;
        serviceTemplateId: string;
    };

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
        };
        const response = await OrdersServices.bookService(bookingData);
        if (response.success) {
            navigation.navigate("PostBooking", {
                bookingId: response.data?.bookingId,
            });
        } else {
            showErrorToast("Error", "Something went wrong. Please try again.", {
                onDismiss: () => {
                    console.log("Error toast dismissed");
                },
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

    return (
        <SafeAreaView style={{ paddingTop: 30 }}>
            <BackButton
                onPress={() => {
                    navigation.goBack();
                }}
                backButtonStyle={{ top: 40, left: 4 }}
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
                </ScrollView>
                {/* Book Service Button */}
                <View style={styles.bookingButtonContainer}>
                    <PrimaryButton
                        title="Book Service"
                        disabled={
                            !selectedDate ||
                            !selectedTimeSlot ||
                            !selectedAddress ||
                            isLoading
                        }
                        onPress={handleBookService}
                        fullWidth
                        loading={isLoading}
                        icon={
                            <Ionicons
                                name="checkmark"
                                size={20}
                                color={COLORS.WHITE}
                            />
                        }
                        iconPosition="left"
                    />
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.WHITE,
        padding: 20,
        marginTop: 15,
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
        marginTop: 20,
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
});
