import React, { useState } from "react";
import {
    View,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    FlatList,
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
import { PrimaryButton } from "../../../components/Button";
import { Input } from "../../../components/Input";
import { BackButton } from "../../../components/BackButton";
import { useNavigation, useRoute } from "@react-navigation/native";
import { SafeAreaView } from "../../../components/SafeAreaView";
import { useSelector } from "react-redux";
import { RootState } from "../../../types";
import { TimeSlot } from "../../../types/services/orders";

// Types
interface UserLocation {
    type: string;
    coordinates: number[];
}

interface UserAddress {
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

const SlotSelection = () => {
    const navigation = useNavigation<any>();
    const route = useRoute();
    const params = route.params as {
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

    const [dates] = useState(getNext7Days());
    const [selectedDate, setSelectedDate] = useState<string>(dates[0].fullDate);
    const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>("");
    const [specialRequirements, setSpecialRequirements] = useState<string>("");

    //redux hooks
    const { selectedAddress } = useSelector(
        (state: RootState) => state.address,
    );

    const formatAddress = (address: UserAddress): string => {
        return `${address.line1}, ${address.line2 ? address.line2 + ", " : ""}${
            address.street
        }, ${address.city}, ${address.state} ${address.postalCode}`;
    };

    const handleAddNewAddress = () => {
        navigation.navigate("AllAddress");
    };

    const handleContinue = () => {
        if (!selectedDate || !selectedTimeSlot || !selectedAddress) {
            return;
        }

        navigation.navigate("ServiceBooking", {
            serviceId: params.serviceId,
            serviceTemplateId: params.serviceTemplateId,
            pricingData: params.pricingData,
            selectedDate,
            selectedTimeSlot,
            selectedAddress,
            specialRequirements,
        });
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
                    style={styles.scrollView}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Header */}
                    <View style={styles.header}>
                        <H3>Select Date & Time</H3>
                        <BodySmall style={styles.subtitle}>
                            Choose your preferred date, time slot, and service
                            location
                        </BodySmall>
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
                                <BodySmall style={styles.addAddressText}>
                                    Choose an address
                                </BodySmall>
                            ) : (
                                <View style={styles.addAddressText}>
                                    <Typography
                                        variant="bodySmall"
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
                                size={24}
                                color={COLORS.GREY[400]}
                            />
                        </TouchableOpacity>
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

                {/* Continue Button */}
                <View style={styles.continueButtonContainer}>
                    <PrimaryButton
                        title="Continue"
                        disabled={
                            !selectedDate ||
                            !selectedTimeSlot ||
                            !selectedAddress
                        }
                        textStyle={{ marginLeft: 12 }}
                        onPress={handleContinue}
                        style={styles.continueButton}
                        icon={
                            <Ionicons
                                name="arrow-forward-circle"
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

export default SlotSelection;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.WHITE,
    },
    scrollView: {
        flex: 1,
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
    addAddressButton: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: COLORS.primaryLight,
        borderWidth: 1,
        borderColor: COLORS.primary,
        borderRadius: 12,
        padding: 12,
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

    // Continue Button Styles
    continueButtonContainer: {
        backgroundColor: COLORS.WHITE,
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
    continueButton: {
        backgroundColor: COLORS.primary,
        paddingVertical: 14,
        borderRadius: 12,
        minHeight: 54,
    },
});
