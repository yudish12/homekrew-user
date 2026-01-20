import React, { useState, useRef, useEffect } from "react";
import {
    View,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Dimensions,
    Animated,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Alert,
    Image,
    Keyboard,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "../../../components/SafeAreaView";
import { Typography } from "../../../components/Typography";
import { Button } from "../../../components/Button";
import { CustomIcon } from "../../../components/CustomIcon";
import { StepperProgress } from "../../../components/StepperProgress";
import { Input } from "../../../components/Input";
import { COLORS } from "../../../constants/ui";
import { shadowUtils, spacingUtils } from "../../../utils/ui";
import { RootState } from "../../../types";
import {
    BHK_OPTIONS,
    REQUIREMENT_ITEMS,
    ROOM_ITEMS,
    PACKAGE_DETAILS,
    KITCHEN_LAYOUT_OPTIONS,
    BhkType,
    PackageType,
    KitchenLayoutType,
    getMaxCount,
    validateRequirements,
    calculateAllEstimates,
    formatIndianPrice,
    CALCULATOR_STORAGE_KEY,
    CalculatorResult,
} from "../../../constants/interior-calculator";
import { TimeSlot } from "../../../types/services/orders";
import { OrdersServices } from "../../../services/orders";
import RazorpayCheckout from "react-native-razorpay";
import { showErrorToast, showSuccessToast } from "../../../components/Toast";
import { ErrorModal, SuccessModal } from "../../../components/Modal";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

// Helper function to get sides for each layout type
const getLayoutSides = (layoutType: KitchenLayoutType | null): string[] => {
    switch (layoutType) {
        case "l-shaped":
            return ["1", "2"];
        case "straight":
            return ["1"];
        case "u-shaped":
            return ["1", "2", "3"];
        case "parallel":
            return ["1", "2"];
        default:
            return [];
    }
};

// Kitchen Layout Visual Components
interface KitchenLayoutVisualProps {
    layoutType: KitchenLayoutType;
    isSelected?: boolean;
    size?: number;
}

// Image sources for kitchen layouts
const kitchenLayoutImages = {
    "l-shaped": require("../../../../assets/images/kitchen-layouts/l-shaped.png"),
    straight: require("../../../../assets/images/kitchen-layouts/straight.png"),
    "u-shaped": require("../../../../assets/images/kitchen-layouts/u-shaped.png"),
    parallel: require("../../../../assets/images/kitchen-layouts/parallel.png"),
};

const KitchenLayoutVisual: React.FC<KitchenLayoutVisualProps> = ({
    layoutType,
    isSelected = false,
    size = 120,
}) => {
    const imageSource = kitchenLayoutImages[layoutType];

    if (!imageSource) {
        return null;
    }

    return (
        <Image
            source={imageSource}
            style={{
                width: "100%",
                height: "100%",
                resizeMode: "contain",
            }}
        />
    );
};

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
        });
    }
    return dates;
};

const timeSlots: TimeSlot[] = [
    { id: "1", time: "08:00 AM - 10:00 AM", available: true },
    { id: "2", time: "10:00 AM - 12:00 PM", available: true },
    { id: "3", time: "12:00 PM - 02:00 PM", available: true },
    { id: "4", time: "02:00 PM - 04:00 PM", available: true },
    { id: "5", time: "04:00 PM - 06:00 PM", available: true },
    { id: "6", time: "06:00 PM - 08:00 PM", available: true },
    { id: "7", time: "08:00 PM - 10:00 PM", available: true },
];

interface RoomSelectionProps {
    label: string;
    icon: string;
    count: number;
    maxCount: number;
    onIncrement: () => void;
    onDecrement: () => void;
}

const RoomSelection: React.FC<RoomSelectionProps> = ({
    label,
    icon,
    count,
    maxCount,
    onIncrement,
    onDecrement,
}) => {
    const isMaxReached = count >= maxCount;
    const hasSelection = count > 0;

    return (
        <View style={styles.requirementCard}>
            <View style={styles.requirementLeft}>
                <View style={styles.requirementIconContainer}>
                    <CustomIcon
                        provider="Ionicons"
                        name={icon}
                        size={24}
                        color={hasSelection ? COLORS.primary : COLORS.GREY[400]}
                    />
                </View>
                <View style={styles.requirementTextContainer}>
                    <Typography
                        variant="body"
                        color={COLORS.TEXT.DARK}
                        style={styles.requirementLabel}
                    >
                        {label}
                    </Typography>
                </View>
            </View>

            <View style={styles.counterContainer}>
                <TouchableOpacity
                    style={[
                        styles.counterButton,
                        count === 0 && styles.counterButtonDisabled,
                    ]}
                    onPress={onDecrement}
                    disabled={count === 0}
                    activeOpacity={0.7}
                >
                    <CustomIcon
                        provider="Ionicons"
                        name="remove"
                        size={20}
                        color={count === 0 ? COLORS.GREY[400] : COLORS.WHITE}
                    />
                </TouchableOpacity>

                <View style={styles.countDisplay}>
                    <Typography
                        variant="body"
                        color={COLORS.TEXT.DARK}
                        style={styles.countText}
                    >
                        {count}
                    </Typography>
                </View>

                <TouchableOpacity
                    style={[
                        styles.counterButton,
                        isMaxReached && styles.counterButtonDisabled,
                    ]}
                    onPress={onIncrement}
                    disabled={isMaxReached}
                    activeOpacity={0.7}
                >
                    <CustomIcon
                        provider="Ionicons"
                        name="add"
                        size={20}
                        color={isMaxReached ? COLORS.GREY[400] : COLORS.WHITE}
                    />
                </TouchableOpacity>
            </View>
        </View>
    );
};

interface RequirementCounterProps {
    label: string;
    icon: string;
    count: number;
    maxCount: number;
    note?: string;
    onIncrement: () => void;
    onDecrement: () => void;
}

const RequirementCounter: React.FC<RequirementCounterProps> = ({
    label,
    icon,
    count,
    maxCount,
    note,
    onIncrement,
    onDecrement,
}) => {
    const isMaxReached = count >= maxCount;
    const hasKitchenCheck = label === "Kitchen" && count === 1;

    return (
        <View style={styles.requirementCard}>
            <View style={styles.requirementLeft}>
                <View style={styles.requirementIconContainer}>
                    <CustomIcon
                        provider="Ionicons"
                        name={icon}
                        size={24}
                        color={count > 0 ? COLORS.primary : COLORS.GREY[400]}
                    />
                </View>
                <View style={styles.requirementTextContainer}>
                    <View style={styles.requirementLabelRow}>
                        <Typography
                            variant="body"
                            color={COLORS.TEXT.DARK}
                            style={styles.requirementLabel}
                        >
                            {label}
                        </Typography>
                        {hasKitchenCheck && (
                            <CustomIcon
                                provider="Ionicons"
                                name="checkmark-circle"
                                size={18}
                                color={COLORS.GREEN[700]}
                            />
                        )}
                    </View>
                    {note && count > 0 && (
                        <Typography
                            variant="caption"
                            color={COLORS.TEXT.LIGHT}
                            style={styles.requirementNote}
                        >
                            {note}
                        </Typography>
                    )}
                </View>
            </View>

            <View style={styles.counterContainer}>
                <TouchableOpacity
                    style={[
                        styles.counterButton,
                        count === 0 && styles.counterButtonDisabled,
                    ]}
                    onPress={onDecrement}
                    disabled={count === 0}
                    activeOpacity={0.7}
                >
                    <CustomIcon
                        provider="Ionicons"
                        name="remove"
                        size={20}
                        color={count === 0 ? COLORS.GREY[400] : COLORS.WHITE}
                    />
                </TouchableOpacity>

                <View style={styles.countDisplay}>
                    <Typography
                        variant="body"
                        color={COLORS.TEXT.DARK}
                        style={styles.countText}
                    >
                        {count}
                    </Typography>
                </View>

                <TouchableOpacity
                    style={[
                        styles.counterButton,
                        isMaxReached && styles.counterButtonDisabled,
                    ]}
                    onPress={onIncrement}
                    disabled={isMaxReached}
                    activeOpacity={0.7}
                >
                    <CustomIcon
                        provider="Ionicons"
                        name="add"
                        size={20}
                        color={isMaxReached ? COLORS.GREY[400] : COLORS.WHITE}
                    />
                </TouchableOpacity>
            </View>
        </View>
    );
};

interface PackageCardProps {
    packageType: PackageType;
    price: number;
    isPopular?: boolean;
}

const PackageCard: React.FC<
    PackageCardProps & { isSelected?: boolean; onSelect?: () => void }
> = ({
    packageType,
    price,
    isPopular = false,
    isSelected = false,
    onSelect,
}) => {
    const details = PACKAGE_DETAILS[packageType];
    const [scaleAnim] = useState(new Animated.Value(1));

    useEffect(() => {
        if (isPopular) {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(scaleAnim, {
                        toValue: 1.02,
                        duration: 1000,
                        useNativeDriver: true,
                    }),
                    Animated.timing(scaleAnim, {
                        toValue: 1,
                        duration: 1000,
                        useNativeDriver: true,
                    }),
                ]),
            ).start();
        }
    }, [isPopular]);

    return (
        <TouchableOpacity activeOpacity={0.7} onPress={onSelect}>
            <Animated.View
                style={[
                    styles.packageCard,
                    // Only apply popular styling if not selected
                    isPopular && !isSelected && styles.packageCardPopular,
                    isSelected && styles.packageCardSelected,
                    { transform: [{ scale: scaleAnim }] },
                ]}
            >
                {isPopular && (
                    <View style={styles.popularBadge}>
                        <Typography
                            variant="caption"
                            color={COLORS.WHITE}
                            style={styles.popularText}
                        >
                            {details.badge}
                        </Typography>
                    </View>
                )}

                <View style={styles.packageHeader}>
                    <View
                        style={[
                            styles.packageIconContainer,
                            { backgroundColor: details.color + "20" },
                        ]}
                    >
                        <CustomIcon
                            provider="Ionicons"
                            name={
                                packageType === "essential"
                                    ? "home-outline"
                                    : packageType === "comfort"
                                    ? "home"
                                    : "diamond-outline"
                            }
                            size={28}
                            color={details.color}
                        />
                    </View>
                    <View style={styles.packageTitleContainer}>
                        <Typography
                            variant="h5"
                            color={COLORS.TEXT.DARK}
                            style={styles.packageTitle}
                        >
                            {details.label}
                        </Typography>
                        <Typography
                            variant="caption"
                            color={COLORS.TEXT.LIGHT}
                            style={styles.packageDescription}
                        >
                            {details.description}
                        </Typography>
                    </View>
                </View>

                <View style={styles.priceContainer}>
                    <Typography
                        variant="h3"
                        style={[styles.price, { color: details.color }]}
                    >
                        {formatIndianPrice(price)}
                    </Typography>
                    <Typography variant="caption" color={COLORS.TEXT.LIGHT}>
                        Estimated cost
                    </Typography>
                </View>
                {/* 
            <TouchableOpacity
                style={[
                    styles.viewDetailsButton,
                    isPopular && { backgroundColor: COLORS.primary },
                ]}
                activeOpacity={0.7}
            >
                <Typography
                    variant="bodySmall"
                    color={isPopular ? COLORS.WHITE : COLORS.primary}
                    style={styles.viewDetailsText}
                >
                    View Details
                </Typography>
                <CustomIcon
                    provider="Ionicons"
                    name="arrow-forward"
                    size={16}
                    color={isPopular ? COLORS.WHITE : COLORS.primary}
                />
            </TouchableOpacity> */}
            </Animated.View>
        </TouchableOpacity>
    );
};

export const InteriorCalculator: React.FC = () => {
    const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);
    const [isErrorModalVisible, setIsErrorModalVisible] = useState(false);
    const navigation = useNavigation<any>();
    const flatListRef = useRef<FlatList>(null);
    const scrollViewRef = useRef<ScrollView>(null);
    const [currentStep, setCurrentStep] = useState(0);
    const [selectedBhk, setSelectedBhk] = useState<BhkType | null>(null);
    const [requirements, setRequirements] = useState<Record<string, number>>({
        kitchen: 1,
        wardrobe: 1,
        entertainmentUnit: 1,
        studyUnit: 1,
        crockeryUnit: 1,
    });
    const [selectedRooms, setSelectedRooms] = useState<Record<string, number>>({
        livingRoom: 1,
        kitchen: 1,
        bedroom: 1,
        bathroom: 1,
        dining: 1,
    });
    const [selectedKitchenLayout, setSelectedKitchenLayout] =
        useState<KitchenLayoutType | null>(null);
    const [kitchenDimensions, setKitchenDimensions] = useState<
        Record<string, string>
    >({
        "1": "3",
        "2": "8",
        "3": "3",
    });

    // Reset dimensions when layout changes
    useEffect(() => {
        if (selectedKitchenLayout) {
            const sides = getLayoutSides(selectedKitchenLayout);
            setKitchenDimensions(prev => {
                const newDimensions: Record<string, string> = {};
                sides.forEach((side, index) => {
                    // Keep existing value if it exists, otherwise set default
                    newDimensions[side] =
                        prev[side] ||
                        (index === 0 ? "12" : index === 1 ? "8" : "3");
                });
                return newDimensions;
            });
        }
    }, [selectedKitchenLayout]);

    // Handle keyboard visibility for modular kitchen inputs
    useEffect(() => {
        const keyboardWillShow = Keyboard.addListener(
            Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
            e => {
                setKeyboardHeight(e.endCoordinates.height);
                // Scroll to bottom when keyboard appears
                setTimeout(() => {
                    scrollViewRef.current?.scrollToEnd({ animated: true });
                }, 100);
            },
        );
        const keyboardWillHide = Keyboard.addListener(
            Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
            () => {
                setKeyboardHeight(0);
            },
        );

        return () => {
            keyboardWillShow.remove();
            keyboardWillHide.remove();
        };
    }, []);
    const [selectedPackage, setSelectedPackage] = useState<PackageType | null>(
        null,
    );
    const [dates] = useState(getNext7Days());
    const [selectedDate, setSelectedDate] = useState<string>(
        dates[0]?.fullDate || "",
    );
    const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>("");
    const [specialRequirements, setSpecialRequirements] = useState<string>("");
    const [isProcessingPayment, setIsProcessingPayment] = useState(false);
    const [keyboardHeight, setKeyboardHeight] = useState(0);

    const { selectedAddress } = useSelector(
        (state: RootState) => state.address,
    );
    const user = useSelector((state: RootState) => state.auth.user);

    const scrollToStep = (stepIndex: number) => {
        flatListRef.current?.scrollToIndex({
            index: stepIndex,
            animated: true,
        });
        setCurrentStep(stepIndex);
    };

    const handleClose = () => {
        navigation.goBack();
    };

    const handleBhkSelect = (bhkType: BhkType) => {
        setSelectedBhk(bhkType);
        // Reset rooms when BHK type changes (default quantities)
        if (bhkType !== "modular-kitchen") {
            setSelectedRooms({
                livingRoom: 1,
                kitchen: 1,
                bedroom: getBedroomCountFromBhk(bhkType),
                bathroom: getBathroomCountFromBhk(bhkType),
                dining: 1,
            });
        }
    };

    // Get bedroom count based on BHK type
    const getBedroomCountFromBhk = (bhkType: BhkType): number => {
        switch (bhkType) {
            case "1BHK":
                return 1;
            case "2BHK":
                return 2;
            case "3BHK":
                return 3;
            case "3+BHK":
                return 4;
            default:
                return 1;
        }
    };

    // Get bathroom count based on BHK type (typically bedrooms + 1)
    const getBathroomCountFromBhk = (bhkType: BhkType): number => {
        const bedrooms = getBedroomCountFromBhk(bhkType);
        return bedrooms + 1;
    };

    // Get max count for a room based on BHK type
    const getRoomMaxCount = (roomId: string, bhkType: BhkType): number => {
        switch (roomId) {
            case "livingRoom":
                return 1;
            case "kitchen":
                return 1;
            case "bedroom":
                return getBedroomCountFromBhk(bhkType);
            case "bathroom":
                return getBathroomCountFromBhk(bhkType);
            case "dining":
                return 1;
            default:
                return 1;
        }
    };

    const handleRoomIncrement = (roomId: string) => {
        if (!selectedBhk) return;
        const maxCount = getRoomMaxCount(roomId, selectedBhk);
        setSelectedRooms(prev => ({
            ...prev,
            [roomId]: Math.min((prev[roomId] || 0) + 1, maxCount),
        }));
    };

    const handleRoomDecrement = (roomId: string) => {
        setSelectedRooms(prev => ({
            ...prev,
            [roomId]: Math.max((prev[roomId] || 0) - 1, 0),
        }));
    };

    const handleStep1Continue = () => {
        if (selectedBhk) {
            scrollToStep(1);
        }
    };

    const handleIncrement = (itemId: string) => {
        if (!selectedBhk) return;
        const maxCount = getMaxCount(itemId, selectedBhk);
        setRequirements(prev => ({
            ...prev,
            [itemId]: Math.min((prev[itemId] || 0) + 1, maxCount),
        }));
    };

    const handleDecrement = (itemId: string) => {
        if (itemId === "kitchen") return;
        setRequirements(prev => ({
            ...prev,
            [itemId]: Math.max((prev[itemId] || 0) - 1, 0),
        }));
    };

    const handleStep2Continue = () => {
        if (selectedBhk === "modular-kitchen") {
            // For modular kitchen, kitchen layout is required
            if (!selectedKitchenLayout) {
                Alert.alert("Required", "Please select a kitchen layout");
                return;
            }
            // Validate dimensions are entered
            const layoutSides = getLayoutSides(selectedKitchenLayout);
            const allDimensionsEntered = layoutSides.every(side => {
                const value = kitchenDimensions[side];
                return (
                    value &&
                    value.trim() !== "" &&
                    !isNaN(Number(value)) &&
                    Number(value) > 0
                );
            });
            if (!allDimensionsEntered) {
                Alert.alert("Required", "Please enter all dimensions");
                return;
            }
            scrollToStep(2);
            saveCalculation();
        } else if (selectedBhk) {
            // For BHK types, validate that at least one room has count > 0
            const hasSelectedRooms = Object.values(selectedRooms).some(
                count => count > 0,
            );
            if (!hasSelectedRooms) {
                Alert.alert("Required", "Please select at least one room");
                return;
            }
            scrollToStep(2);
            saveCalculation();
        }
    };

    const saveCalculation = async () => {
        if (!selectedBhk) return;
        try {
            const estimates =
                selectedBhk === "modular-kitchen"
                    ? calculateAllEstimates(selectedBhk, kitchenDimensions)
                    : calculateAllEstimates(selectedBhk);
            const result: CalculatorResult = {
                bhkType: selectedBhk,
                requirements,
                estimates,
                timestamp: Date.now(),
            };
            await AsyncStorage.setItem(
                CALCULATOR_STORAGE_KEY,
                JSON.stringify(result),
            );
        } catch (error) {
            console.error("Error saving calculation:", error);
        }
    };

    const handleStep3Continue = () => {
        if (!selectedPackage) {
            Alert.alert("Required", "Please select a package");
            return;
        }
        scrollToStep(3);
    };

    const handleBookConsultant = async () => {
        if (!selectedDate || !selectedTimeSlot || !selectedAddress) {
            Alert.alert("Required", "Please fill all required fields");
            return;
        }

        if (!selectedBhk || !selectedPackage) {
            Alert.alert("Required", "Please complete all previous steps");
            return;
        }

        if (!user) {
            Alert.alert("Error", "Please login to continue");
            return;
        }

        try {
            setIsProcessingPayment(true);

            // Map BHK type to number
            const getBhkNumber = (bhkType: BhkType): number => {
                switch (bhkType) {
                    case "1BHK":
                        return 1;
                    case "2BHK":
                        return 2;
                    case "3BHK":
                        return 3;
                    case "3+BHK":
                        return 4;
                    default:
                        return 3; // Default for modular-kitchen
                }
            };

            // Map kitchen layout to API format
            const getKitchenLayout = (
                layout: KitchenLayoutType | null,
            ): string => {
                switch (layout) {
                    case "l-shaped":
                        return "L_SHAPE";
                    case "u-shaped":
                        return "U_SHAPE";
                    case "straight":
                        return "STRAIGHT";
                    case "parallel":
                        return "PARALLEL";
                    default:
                        return "STRAIGHT";
                }
            };

            // Map package type to API format
            // Backend enum: ['ESSENTIALS', 'PREMIUM', 'LUXURY']
            const getPackageType = (packageType: PackageType): string => {
                switch (packageType) {
                    case "essential":
                        return "ESSENTIALS";
                    case "comfort":
                        return "PREMIUM"; // "comfort" maps to "PREMIUM" in backend
                    case "luxury":
                        return "LUXURY";
                    default:
                        return "ESSENTIALS";
                }
            };

            // Get bedroom count from BHK type
            const getBedroomCount = (bhkType: BhkType): number => {
                return getBhkNumber(bhkType);
            };

            // Get bathroom count (typically bedrooms + 1 or same as bedrooms)
            const getBathroomCount = (bhkType: BhkType): number => {
                const bedrooms = getBedroomCount(bhkType);
                return bedrooms + 1;
            };

            // Map kitchen dimensions
            const getKitchenMeasurements = (): Record<string, number> => {
                const measurements: Record<string, number> = {};
                const sides = getLayoutSides(selectedKitchenLayout);
                sides.forEach((side, index) => {
                    const value = kitchenDimensions[side];
                    if (value) {
                        // Convert "1", "2", "3" to "a", "b", "c"
                        const letterKey = String.fromCharCode(97 + index); // 0 -> 'a', 1 -> 'b', 2 -> 'c'
                        measurements[letterKey] = parseFloat(value) || 0;
                    }
                });
                return measurements;
            };

            // Determine BHK size based on BHK type
            const getBhkSize = (bhkType: BhkType): string => {
                switch (bhkType) {
                    case "1BHK":
                        return "SMALL";
                    case "2BHK":
                        return "SMALL";
                    case "3BHK":
                        return "MEDIUM";
                    case "3+BHK":
                        return "LARGE";
                    case "modular-kitchen":
                        return "SMALL";
                    default:
                        return "SMALL";
                }
            };

            // Prepare user data (common for both BHK and modular kitchen)
            const userData = {
                name:
                    `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
                    "User",
                email: user.email || "",
                phone: user.phoneNumber || "",
                whatsappOptIn: true, // Default to true, can be made configurable
                city: selectedAddress?.city || "",
            };

            // Prepare calculator data - different structure for BHK vs modular kitchen
            let calculatorData: any;

            if (selectedBhk === "modular-kitchen") {
                // For modular kitchen: only kitchen, homePackage, and user
                calculatorData = {
                    ...(selectedKitchenLayout && {
                        kitchen: {
                            layout: getKitchenLayout(selectedKitchenLayout),
                            measurements: getKitchenMeasurements(),
                            package: getPackageType(selectedPackage),
                        },
                    }),
                    homePackage: getPackageType(selectedPackage),
                    user: userData,
                };
            } else {
                // For BHK: bhkType, bhkSize, rooms, homePackage, and user (NO kitchen)
                calculatorData = {
                    bhkType: getBhkNumber(selectedBhk),
                    bhkSize: getBhkSize(selectedBhk),
                    rooms: {
                        livingRoom: selectedRooms.livingRoom || 1,
                        kitchen: selectedRooms.kitchen || 1,
                        bedroom:
                            selectedRooms.bedroom ||
                            getBedroomCount(selectedBhk),
                        bathroom:
                            selectedRooms.bathroom ||
                            getBathroomCount(selectedBhk),
                        dining: selectedRooms.dining || 1,
                    },
                    homePackage: getPackageType(selectedPackage),
                    user: userData,
                };
            }

            // Log the request body for debugging
            console.log(
                "Calculator Submit Request Body:",
                JSON.stringify(calculatorData, null, 2),
            );

            const response = await OrdersServices.submitCalculator(
                calculatorData,
            );

            if (response.success && response.data) {
                RazorpayCheckout.open({
                    order_id: response.data.razorpayOrder.id,
                    amount: response.data.razorpayOrder.amount,
                    currency: "INR",
                    key: response.data.razorpayConfig.key,
                    theme: {
                        color: COLORS.primary,
                    },
                    name: "Consultant Booking",
                    description: "Payment for consultant booking",
                })
                    .then(data => {
                        setIsSuccessModalVisible(true);
                        setTimeout(() => {
                            navigation.goBack();
                            setIsSuccessModalVisible(false);
                        }, 7500);
                    })
                    .catch(error => {
                        setIsErrorModalVisible(true);
                    });
            }
        } catch (error: any) {
            Alert.alert("Error", "An error occurred. Please try again.");
            console.error("Booking error:", error);
        } finally {
            setIsProcessingPayment(false);
        }
    };

    const handleRecalculate = () => {
        scrollToStep(0);
        setSelectedBhk(null);
        setRequirements({
            kitchen: 1,
            wardrobe: 1,
            entertainmentUnit: 1,
            studyUnit: 1,
            crockeryUnit: 1,
        });
        setSelectedRooms({
            livingRoom: 1,
            kitchen: 1,
            bedroom: 1,
            bathroom: 1,
            dining: 1,
        });
    };

    const getRequirementSummary = () => {
        // For BHK types, return selected rooms with quantities
        if (selectedBhk && selectedBhk !== "modular-kitchen") {
            return ROOM_ITEMS.filter(room => selectedRooms[room.id] > 0).map(
                room => ({
                    ...room,
                    count: selectedRooms[room.id] || 0,
                }),
            );
        }
        // Legacy support for modular kitchen or other cases
        return REQUIREMENT_ITEMS.filter(
            item => requirements[item.id] && requirements[item.id] > 0,
        ).map(item => ({
            ...item,
            count: requirements[item.id],
        }));
    };

    const estimates = selectedBhk
        ? selectedBhk === "modular-kitchen"
            ? calculateAllEstimates(selectedBhk, kitchenDimensions)
            : calculateAllEstimates(selectedBhk)
        : null;

    // Step 1: BHK Selection
    const renderStep1 = () => (
        <View style={styles.stepContainer}>
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <Typography variant="h4" style={styles.title}>
                    Select Your Property Type
                </Typography>
                <Typography
                    variant="body"
                    color={COLORS.TEXT.LIGHT}
                    style={styles.description}
                >
                    Choose the configuration that matches your home
                </Typography>

                <View style={styles.optionsContainer}>
                    {BHK_OPTIONS.map(option => {
                        const isSelected = selectedBhk === option.value;

                        return (
                            <TouchableOpacity
                                key={option.value}
                                style={[
                                    styles.optionCard,
                                    isSelected && styles.optionCardSelected,
                                ]}
                                onPress={() => handleBhkSelect(option.value)}
                                activeOpacity={0.7}
                            >
                                <View
                                    style={[
                                        styles.iconCircle,
                                        isSelected && styles.iconCircleSelected,
                                    ]}
                                >
                                    <CustomIcon
                                        provider="Ionicons"
                                        name={option.icon}
                                        size={32}
                                        color={
                                            isSelected
                                                ? COLORS.WHITE
                                                : COLORS.primary
                                        }
                                    />
                                </View>

                                <View style={styles.optionContent}>
                                    <Typography
                                        variant="h5"
                                        color={
                                            isSelected
                                                ? COLORS.primary
                                                : COLORS.TEXT.DARK
                                        }
                                        style={styles.optionLabel}
                                    >
                                        {option.label}
                                    </Typography>
                                    <Typography
                                        variant="bodySmall"
                                        color={COLORS.TEXT.LIGHT}
                                        style={styles.optionDescription}
                                    >
                                        {option.description}
                                    </Typography>
                                </View>

                                {isSelected && (
                                    <View style={styles.checkmarkContainer}>
                                        <CustomIcon
                                            provider="Ionicons"
                                            name="checkmark-circle"
                                            size={28}
                                            color={COLORS.primary}
                                        />
                                    </View>
                                )}
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </ScrollView>

            <View style={styles.footer}>
                <View style={styles.footerButtons}>
                    <Button
                        title="Continue"
                        onPress={handleStep1Continue}
                        disabled={!selectedBhk}
                        style={styles.continueButton}
                        icon={
                            <CustomIcon
                                provider="Ionicons"
                                name="arrow-forward"
                                size={20}
                                color={COLORS.WHITE}
                            />
                        }
                        iconPosition="extreme-right"
                    />
                </View>
            </View>
        </View>
    );

    // Step 2: Requirements or Kitchen Layout
    const renderStep2 = () => {
        if (selectedBhk === "modular-kitchen") {
            return (
                <View style={styles.stepContainer}>
                    <ScrollView
                        ref={scrollViewRef}
                        style={styles.scrollView}
                        contentContainerStyle={[
                            styles.scrollContent,
                            {
                                paddingBottom:
                                    keyboardHeight > 0
                                        ? keyboardHeight - 40
                                        : spacingUtils.xl,
                            },
                        ]}
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                        keyboardDismissMode="interactive"
                        scrollEnabled={true}
                    >
                        <Typography variant="h4" style={styles.title}>
                            Select Kitchen Layout
                        </Typography>
                        <Typography
                            variant="body"
                            color={COLORS.TEXT.LIGHT}
                            style={styles.description}
                        >
                            Choose your preferred kitchen layout design
                        </Typography>

                        <View style={styles.kitchenLayoutContainer}>
                            {KITCHEN_LAYOUT_OPTIONS.map(layout => {
                                const isSelected =
                                    selectedKitchenLayout === layout.value;
                                return (
                                    <TouchableOpacity
                                        key={layout.value}
                                        style={[
                                            styles.kitchenLayoutCard,
                                            isSelected &&
                                                styles.kitchenLayoutCardSelected,
                                        ]}
                                        onPress={() => {
                                            setSelectedKitchenLayout(
                                                layout.value,
                                            );
                                        }}
                                        activeOpacity={0.7}
                                    >
                                        <View
                                            style={
                                                styles.kitchenLayoutVisualContainer
                                            }
                                        >
                                            <KitchenLayoutVisual
                                                layoutType={layout.value}
                                                isSelected={isSelected}
                                            />
                                        </View>
                                        <Typography
                                            variant="body"
                                            color={
                                                isSelected
                                                    ? COLORS.primary
                                                    : COLORS.TEXT.DARK
                                            }
                                            style={styles.kitchenLayoutLabel}
                                        >
                                            {layout.label}
                                        </Typography>
                                        {isSelected && (
                                            <View
                                                style={
                                                    styles.kitchenLayoutCheckmark
                                                }
                                            >
                                                <CustomIcon
                                                    provider="Ionicons"
                                                    name="checkmark-circle"
                                                    size={20}
                                                    color={COLORS.primary}
                                                />
                                            </View>
                                        )}
                                    </TouchableOpacity>
                                );
                            })}
                        </View>

                        {selectedKitchenLayout && (
                            <View style={styles.dimensionsContainer}>
                                <View style={styles.dimensionsBanner}>
                                    <Typography
                                        variant="body"
                                        color={COLORS.TEXT.DARK}
                                        style={styles.dimensionsBannerText}
                                    >
                                        Set the size as per your requirements
                                    </Typography>
                                </View>
                                <View style={styles.dimensionsInputsContainer}>
                                    {getLayoutSides(selectedKitchenLayout).map(
                                        side => (
                                            <View
                                                key={side}
                                                style={styles.dimensionInputRow}
                                            >
                                                <Typography
                                                    variant="body"
                                                    color={COLORS.TEXT.DARK}
                                                    style={
                                                        styles.dimensionLabel
                                                    }
                                                >
                                                    {side}
                                                </Typography>
                                                <Input
                                                    type="number"
                                                    value={
                                                        kitchenDimensions[
                                                            side
                                                        ] || ""
                                                    }
                                                    onChangeText={text => {
                                                        setKitchenDimensions(
                                                            prev => ({
                                                                ...prev,
                                                                [side]: text,
                                                            }),
                                                        );
                                                    }}
                                                    onFocus={() => {
                                                        // Scroll to show the input when focused
                                                        setTimeout(() => {
                                                            scrollViewRef.current?.scrollToEnd(
                                                                {
                                                                    animated:
                                                                        true,
                                                                },
                                                            );
                                                        }, 300);
                                                    }}
                                                    containerStyle={
                                                        styles.dimensionInputContainer
                                                    }
                                                    inputContainerStyle={
                                                        styles.dimensionInputBox
                                                    }
                                                    keyboardType="numeric"
                                                />
                                                <Typography
                                                    variant="body"
                                                    color={COLORS.TEXT.DARK}
                                                    style={styles.dimensionUnit}
                                                >
                                                    ft.
                                                </Typography>
                                            </View>
                                        ),
                                    )}
                                </View>
                            </View>
                        )}
                    </ScrollView>

                    <View style={styles.footer}>
                        <View style={styles.footerButtons}>
                            <Button
                                title="Back"
                                onPress={() => scrollToStep(0)}
                                variant="outline"
                                style={styles.backButton}
                                icon={
                                    <CustomIcon
                                        provider="Ionicons"
                                        name="arrow-back"
                                        size={20}
                                        color={COLORS.TEXT.DARK}
                                    />
                                }
                                iconPosition="extreme-left"
                            />
                            <Button
                                title="Get Estimate"
                                onPress={handleStep2Continue}
                                style={styles.continueButton}
                                icon={
                                    <CustomIcon
                                        provider="Ionicons"
                                        name="calculator"
                                        size={20}
                                        color={COLORS.WHITE}
                                    />
                                }
                                iconPosition="extreme-right"
                            />
                        </View>
                    </View>
                </View>
            );
        }

        return (
            <View style={styles.stepContainer}>
                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {selectedBhk && (
                        <View style={styles.bhkBadge}>
                            <CustomIcon
                                provider="Ionicons"
                                name="home"
                                size={16}
                                color={COLORS.primary}
                            />
                            <Typography
                                variant="bodySmall"
                                color={COLORS.primary}
                                style={styles.bhkText}
                            >
                                {selectedBhk}
                            </Typography>
                        </View>
                    )}

                    <Typography variant="h4" style={styles.title}>
                        Select Rooms
                    </Typography>
                    <Typography
                        variant="body"
                        color={COLORS.TEXT.LIGHT}
                        style={styles.description}
                    >
                        Choose the rooms you want to include in your interior
                        design
                    </Typography>

                    <View style={styles.roomsContainer}>
                        {ROOM_ITEMS.map(room => (
                            <RoomSelection
                                key={room.id}
                                label={room.label}
                                icon={room.icon}
                                count={selectedRooms[room.id] || 0}
                                maxCount={
                                    selectedBhk
                                        ? getRoomMaxCount(room.id, selectedBhk)
                                        : 1
                                }
                                onIncrement={() => handleRoomIncrement(room.id)}
                                onDecrement={() => handleRoomDecrement(room.id)}
                            />
                        ))}
                    </View>
                </ScrollView>

                <View style={styles.footer}>
                    <View style={styles.footerButtons}>
                        <Button
                            title="Back"
                            onPress={() => scrollToStep(0)}
                            variant="outline"
                            style={styles.backButton}
                            icon={
                                <CustomIcon
                                    provider="Ionicons"
                                    name="arrow-back"
                                    size={20}
                                    color={COLORS.TEXT.DARK}
                                />
                            }
                            iconPosition="extreme-left"
                        />
                        <Button
                            title="Get Estimate"
                            onPress={handleStep2Continue}
                            style={styles.continueButton}
                            icon={
                                <CustomIcon
                                    provider="Ionicons"
                                    name="calculator"
                                    size={20}
                                    color={COLORS.WHITE}
                                />
                            }
                            iconPosition="extreme-right"
                        />
                    </View>
                </View>
            </View>
        );
    };

    // Step 3: Estimates
    const renderStep3 = () => (
        <View style={styles.stepContainer}>
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Summary Card */}
                <View style={styles.summaryCard}>
                    <View style={styles.summaryHeader}>
                        <CustomIcon
                            provider="Ionicons"
                            name="home"
                            size={20}
                            color={COLORS.primary}
                        />
                        <Typography
                            variant="body"
                            color={COLORS.TEXT.DARK}
                            style={styles.summaryTitle}
                        >
                            {selectedBhk === "modular-kitchen"
                                ? "Your Modular Kitchen Selection"
                                : `Your ${selectedBhk} Requirements`}
                        </Typography>
                    </View>
                    <View style={styles.summaryContent}>
                        {selectedBhk === "modular-kitchen" ? (
                            <>
                                {selectedKitchenLayout && (
                                    <View style={styles.summaryItem}>
                                        <CustomIcon
                                            provider="Ionicons"
                                            name="restaurant-outline"
                                            size={18}
                                            color={COLORS.GREY[400]}
                                        />
                                        <Typography
                                            variant="bodySmall"
                                            color={COLORS.TEXT.DARK}
                                            style={styles.summaryItemText}
                                        >
                                            Layout:{" "}
                                            {
                                                KITCHEN_LAYOUT_OPTIONS.find(
                                                    l =>
                                                        l.value ===
                                                        selectedKitchenLayout,
                                                )?.label
                                            }
                                        </Typography>
                                    </View>
                                )}
                                {selectedKitchenLayout &&
                                    Object.keys(kitchenDimensions).length >
                                        0 && (
                                        <View style={styles.summaryItem}>
                                            <CustomIcon
                                                provider="Ionicons"
                                                name="resize-outline"
                                                size={18}
                                                color={COLORS.GREY[400]}
                                            />
                                            <Typography
                                                variant="bodySmall"
                                                color={COLORS.TEXT.DARK}
                                                style={styles.summaryItemText}
                                            >
                                                Dimensions:{" "}
                                                {getLayoutSides(
                                                    selectedKitchenLayout,
                                                )
                                                    .map(
                                                        side =>
                                                            `${side}: ${
                                                                kitchenDimensions[
                                                                    side
                                                                ] || 0
                                                            }ft`,
                                                    )
                                                    .join(", ")}
                                            </Typography>
                                        </View>
                                    )}
                            </>
                        ) : (
                            getRequirementSummary().map(item => (
                                <View key={item.id} style={styles.summaryItem}>
                                    <CustomIcon
                                        provider="Ionicons"
                                        name={item.icon}
                                        size={18}
                                        color={COLORS.GREY[400]}
                                    />
                                    <Typography
                                        variant="bodySmall"
                                        color={COLORS.TEXT.DARK}
                                        style={styles.summaryItemText}
                                    >
                                        {item.label}
                                    </Typography>
                                    <View style={styles.summaryItemCount}>
                                        <Typography
                                            variant="bodySmall"
                                            color={COLORS.primary}
                                            style={styles.summaryCountText}
                                        >
                                            ×{item.count}
                                        </Typography>
                                    </View>
                                </View>
                            ))
                        )}
                    </View>
                </View>

                <Typography variant="h4" style={styles.estimatesTitle}>
                    Choose Your Package
                </Typography>
                <Typography
                    variant="body"
                    color={COLORS.TEXT.LIGHT}
                    style={styles.estimatesDescription}
                >
                    Below are your estimates to book a free online consultation
                </Typography>

                {estimates && (
                    <View style={styles.packagesContainer}>
                        <PackageCard
                            packageType="essential"
                            price={estimates.essential}
                            isSelected={selectedPackage === "essential"}
                            onSelect={() => setSelectedPackage("essential")}
                        />
                        <PackageCard
                            packageType="comfort"
                            price={estimates.comfort}
                            isPopular
                            isSelected={selectedPackage === "comfort"}
                            onSelect={() => setSelectedPackage("comfort")}
                        />
                        <PackageCard
                            packageType="luxury"
                            price={estimates.luxury}
                            isSelected={selectedPackage === "luxury"}
                            onSelect={() => setSelectedPackage("luxury")}
                        />
                    </View>
                )}

                <View style={styles.infoBox}>
                    <CustomIcon
                        provider="Ionicons"
                        name="information-circle"
                        size={20}
                        color={COLORS.primary}
                    />
                    <Typography
                        variant="caption"
                        color={COLORS.TEXT.DARK}
                        style={styles.infoText}
                    >
                        These are estimated costs. Final prices may vary based
                        on materials, design complexity, and site conditions.
                    </Typography>
                </View>
            </ScrollView>

            <View style={styles.footer}>
                <View style={styles.footerButtons}>
                    <Button
                        title="Back"
                        onPress={() => scrollToStep(1)}
                        variant="outline"
                        style={styles.backButton}
                        icon={
                            <CustomIcon
                                provider="Ionicons"
                                name="arrow-back"
                                size={20}
                                color={COLORS.TEXT.DARK}
                            />
                        }
                        iconPosition="extreme-left"
                    />
                    <Button
                        title="Continue"
                        onPress={handleStep3Continue}
                        disabled={!selectedPackage}
                        style={styles.continueButton}
                    />
                </View>
            </View>
        </View>
    );

    // Step 4: Slot Selection
    const renderStep4 = () => {
        const formatAddress = (address: any): string => {
            if (!address) return "";
            return `${address.line1}, ${
                address.line2 ? address.line2 + ", " : ""
            }${address.street}, ${address.city}, ${address.state} ${
                address.postalCode
            }`;
        };

        const renderDateItem = (item: any) => {
            const isSelected = selectedDate === item.fullDate;
            return (
                <TouchableOpacity
                    style={[
                        styles.dateItem,
                        isSelected && styles.selectedDateItem,
                    ]}
                    onPress={() => setSelectedDate(item.fullDate)}
                    activeOpacity={0.7}
                >
                    <Typography
                        variant="caption"
                        color={isSelected ? COLORS.WHITE : COLORS.TEXT.LIGHT}
                        style={styles.dayName}
                    >
                        {item.dayName}
                    </Typography>
                    <Typography
                        variant="h5"
                        color={isSelected ? COLORS.WHITE : COLORS.TEXT.DARK}
                        style={styles.dayNumber}
                    >
                        {item.dayNumber}
                    </Typography>
                    <Typography
                        variant="caption"
                        color={isSelected ? COLORS.WHITE : COLORS.TEXT.LIGHT}
                        style={styles.monthText}
                    >
                        {item.month}
                    </Typography>
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
                    onPress={() =>
                        isAvailable && setSelectedTimeSlot(item.time)
                    }
                    disabled={!isAvailable}
                    activeOpacity={0.7}
                >
                    <Typography
                        variant="bodySmall"
                        color={
                            isSelected
                                ? COLORS.WHITE
                                : !isAvailable
                                ? COLORS.GREY[400]
                                : COLORS.TEXT.DARK
                        }
                    >
                        {item.time}
                    </Typography>
                </TouchableOpacity>
            );
        };

        return (
            <View style={styles.stepContainer}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={{ flex: 1 }}
                >
                    <ScrollView
                        style={styles.scrollView}
                        contentContainerStyle={styles.scrollContent}
                        showsVerticalScrollIndicator={false}
                    >
                        <Typography variant="h4" style={styles.title}>
                            Select Date & Time
                        </Typography>
                        <Typography
                            variant="body"
                            color={COLORS.TEXT.LIGHT}
                            style={styles.description}
                        >
                            Choose your preferred date, time slot, and service
                            location
                        </Typography>

                        {/* Address Selection */}
                        <View style={styles.section}>
                            <View style={styles.sectionHeader}>
                                <CustomIcon
                                    provider="Ionicons"
                                    name="location-outline"
                                    size={20}
                                    color={COLORS.primary}
                                />
                                <Typography
                                    variant="h5"
                                    style={styles.sectionTitle}
                                >
                                    Service Address
                                </Typography>
                            </View>
                            <TouchableOpacity
                                style={styles.addAddressButton}
                                onPress={() =>
                                    navigation.navigate("AllAddress")
                                }
                                activeOpacity={0.7}
                            >
                                <CustomIcon
                                    provider="Ionicons"
                                    name="add-circle-outline"
                                    size={24}
                                    color={COLORS.primary}
                                />
                                {!selectedAddress ? (
                                    <Typography
                                        variant="bodySmall"
                                        color={COLORS.primary}
                                        style={styles.addAddressText}
                                    >
                                        Choose an address
                                    </Typography>
                                ) : (
                                    <Typography
                                        variant="bodySmall"
                                        numberOfLines={2}
                                        color={COLORS.TEXT.DARK}
                                        style={styles.addAddressText}
                                    >
                                        {formatAddress(selectedAddress)}
                                    </Typography>
                                )}
                                <CustomIcon
                                    provider="Ionicons"
                                    name="chevron-forward"
                                    size={24}
                                    color={COLORS.GREY[400]}
                                />
                            </TouchableOpacity>
                        </View>

                        {/* Date Selection */}
                        <View style={styles.section}>
                            <View style={styles.sectionHeader}>
                                <CustomIcon
                                    provider="Ionicons"
                                    name="calendar-outline"
                                    size={20}
                                    color={COLORS.primary}
                                />
                                <Typography
                                    variant="h5"
                                    style={styles.sectionTitle}
                                >
                                    Select Date
                                </Typography>
                            </View>
                            <View style={styles.datesContainer}>
                                {dates.map(item => (
                                    <View
                                        key={item.id}
                                        style={styles.dateItemWrapper}
                                    >
                                        {renderDateItem(item)}
                                    </View>
                                ))}
                            </View>
                        </View>

                        {/* Time Slot Selection */}
                        <View style={styles.section}>
                            <View style={styles.sectionHeader}>
                                <CustomIcon
                                    provider="Ionicons"
                                    name="time-outline"
                                    size={20}
                                    color={COLORS.primary}
                                />
                                <Typography
                                    variant="h5"
                                    style={styles.sectionTitle}
                                >
                                    Select Time Slot
                                </Typography>
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
                                <CustomIcon
                                    provider="Ionicons"
                                    name="document-text-outline"
                                    size={20}
                                    color={COLORS.primary}
                                />
                                <Typography
                                    variant="h5"
                                    style={styles.sectionTitle}
                                >
                                    Special Requirements
                                </Typography>
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

                    <View style={styles.footer}>
                        <View style={styles.consultationPriceContainer}>
                            <Typography
                                variant="caption"
                                color={COLORS.TEXT.LIGHT}
                                style={styles.consultationPriceLabel}
                            >
                                Consultation Fee
                            </Typography>
                            <Typography
                                variant="h4"
                                style={styles.consultationPriceAmount}
                            >
                                ₹199
                            </Typography>
                        </View>
                        <View style={styles.footerButtons}>
                            <Button
                                title="Back"
                                onPress={() => scrollToStep(2)}
                                variant="outline"
                                style={styles.backButton}
                                icon={
                                    <CustomIcon
                                        provider="Ionicons"
                                        name="arrow-back"
                                        size={20}
                                        color={COLORS.TEXT.DARK}
                                    />
                                }
                                iconPosition="extreme-left"
                            />
                            <Button
                                title="Book a Consultant"
                                onPress={handleBookConsultant}
                                disabled={
                                    !selectedDate ||
                                    !selectedTimeSlot ||
                                    !selectedAddress ||
                                    isProcessingPayment
                                }
                                style={styles.continueButton}
                                loading={isProcessingPayment}
                                icon={
                                    <CustomIcon
                                        provider="Ionicons"
                                        name="calendar"
                                        size={20}
                                        color={COLORS.WHITE}
                                    />
                                }
                                iconPosition="extreme-right"
                            />
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </View>
        );
    };

    const steps = [
        { key: "step1", component: renderStep1 },
        { key: "step2", component: renderStep2 },
        { key: "step3", component: renderStep3 },
        { key: "step4", component: renderStep4 },
    ];

    return (
        <>
            <SafeAreaView style={{ ...styles.container, paddingTop: 20 }}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity
                        onPress={handleClose}
                        style={styles.closeButton}
                        activeOpacity={0.7}
                    >
                        <CustomIcon
                            provider="Ionicons"
                            name="close"
                            size={28}
                            color={COLORS.TEXT.DARK}
                        />
                    </TouchableOpacity>
                    <Typography variant="h5" style={styles.headerTitle}>
                        Interior Calculator
                    </Typography>
                    <View style={{ width: 28 }} />
                </View>

                {/* Stepper */}
                <StepperProgress
                    currentStep={currentStep}
                    totalSteps={4}
                    stepLabels={[
                        "Property",
                        "Requirements",
                        "Estimate",
                        "Booking",
                    ]}
                />

                {/* FlatList with steps */}
                <FlatList
                    ref={flatListRef}
                    data={steps}
                    horizontal
                    pagingEnabled
                    scrollEnabled={false}
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={item => item.key}
                    renderItem={({ item }) => item.component()}
                    getItemLayout={(data, index) => ({
                        length: SCREEN_WIDTH,
                        offset: SCREEN_WIDTH * index,
                        index,
                    })}
                />
            </SafeAreaView>
            <SuccessModal
                visible={isSuccessModalVisible}
                onClose={() => {
                    setIsSuccessModalVisible(false);
                }}
                title="Payment Successful"
                message="Your payment has been processed successfully. Please wait for the consultant to contact you."
            />
            <ErrorModal
                visible={isErrorModalVisible}
                onClose={() => setIsErrorModalVisible(false)}
                title="Payment Failed"
                message="Something went wrong. Please try again."
            />
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.WHITE,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: spacingUtils.md,
        paddingVertical: spacingUtils.sm,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border.light,
    },
    closeButton: {
        padding: 4,
    },
    headerTitle: {
        fontWeight: "600",
    },
    stepContainer: {
        width: SCREEN_WIDTH,
        flex: 1,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: spacingUtils.md,
        paddingTop: spacingUtils.lg,
        paddingBottom: spacingUtils.xl,
    },
    title: {
        fontWeight: "700",
        marginBottom: spacingUtils.sm,
    },
    description: {
        marginBottom: spacingUtils.lg,
        lineHeight: 22,
    },
    // Step 1 styles
    optionsContainer: {
        gap: spacingUtils.md,
    },
    optionCard: {
        flexDirection: "row",
        alignItems: "center",
        padding: spacingUtils.md,
        borderRadius: 16,
        borderWidth: 2,
        borderColor: COLORS.border.light,
        backgroundColor: COLORS.WHITE,
    },
    optionCardSelected: {
        borderColor: COLORS.primary,
        backgroundColor: COLORS.primaryLight,
    },
    iconCircle: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: COLORS.primaryLight,
        alignItems: "center",
        justifyContent: "center",
        marginRight: spacingUtils.md,
    },
    iconCircleSelected: {
        backgroundColor: COLORS.primary,
    },
    optionContent: {
        flex: 1,
    },
    optionLabel: {
        fontWeight: "600",
        marginBottom: 4,
    },
    optionDescription: {
        lineHeight: 18,
    },
    checkmarkContainer: {
        marginLeft: spacingUtils.sm,
    },
    // Step 2 styles
    bhkBadge: {
        flexDirection: "row",
        alignItems: "center",
        alignSelf: "flex-start",
        paddingHorizontal: 12,
        paddingVertical: 6,
        backgroundColor: COLORS.primaryLight,
        borderRadius: 20,
        marginBottom: spacingUtils.md,
        gap: 4,
    },
    bhkText: {
        fontWeight: "600",
    },
    requirementsContainer: {
        gap: spacingUtils.md,
        marginBottom: spacingUtils.lg,
    },
    roomsContainer: {
        gap: spacingUtils.md,
        marginBottom: spacingUtils.lg,
    },
    roomCard: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: spacingUtils.md,
        borderRadius: 16,
        borderWidth: 2,
        borderColor: COLORS.border.light,
        backgroundColor: COLORS.WHITE,
        ...shadowUtils.getShadow("small"),
    },
    roomCardSelected: {
        borderColor: COLORS.primary,
        backgroundColor: COLORS.primaryLight,
    },
    roomLeft: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
    },
    roomIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: COLORS.GREY[100],
        alignItems: "center",
        justifyContent: "center",
        marginRight: spacingUtils.sm,
    },
    roomIconContainerSelected: {
        backgroundColor: COLORS.primary,
    },
    roomLabel: {
        fontWeight: "600",
    },
    roomCheckbox: {
        width: 24,
        height: 24,
        borderRadius: 6,
        borderWidth: 2,
        borderColor: COLORS.border.light,
        backgroundColor: COLORS.WHITE,
        alignItems: "center",
        justifyContent: "center",
    },
    roomCheckboxSelected: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
    },
    requirementCard: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: spacingUtils.md,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: COLORS.border.light,
        backgroundColor: COLORS.WHITE,
        ...shadowUtils.getShadow("small"),
    },
    requirementLeft: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
    },
    requirementIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: COLORS.primaryLight,
        alignItems: "center",
        justifyContent: "center",
        marginRight: spacingUtils.sm,
    },
    requirementTextContainer: {
        flex: 1,
    },
    requirementLabelRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },
    requirementLabel: {
        fontWeight: "600",
    },
    requirementNote: {
        marginTop: 2,
        lineHeight: 14,
    },
    counterContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    counterButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: COLORS.primary,
        alignItems: "center",
        justifyContent: "center",
    },
    counterButtonDisabled: {
        backgroundColor: COLORS.GREY[200],
    },
    countDisplay: {
        minWidth: 32,
        alignItems: "center",
    },
    countText: {
        fontWeight: "700",
        fontSize: 18,
    },
    infoBox: {
        flexDirection: "row",
        alignItems: "flex-start",
        padding: spacingUtils.md,
        backgroundColor: COLORS.primaryLight,
        borderRadius: 12,
        gap: 10,
    },
    infoText: {
        flex: 1,
        lineHeight: 18,
    },
    // Step 3 styles
    summaryCard: {
        backgroundColor: COLORS.primaryLight,
        borderRadius: 16,
        padding: spacingUtils.md,
        marginBottom: spacingUtils.lg,
        borderWidth: 1,
        borderColor: COLORS.primary + "30",
    },
    summaryHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: spacingUtils.sm,
        gap: 8,
    },
    summaryTitle: {
        fontWeight: "600",
    },
    summaryContent: {
        gap: spacingUtils.sm,
    },
    summaryItem: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },
    summaryItemText: {
        flex: 1,
    },
    summaryItemCount: {
        backgroundColor: COLORS.WHITE,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    summaryCountText: {
        fontWeight: "600",
    },
    estimatesTitle: {
        fontWeight: "700",
        marginBottom: spacingUtils.sm,
    },
    estimatesDescription: {
        marginBottom: spacingUtils.lg,
        lineHeight: 22,
    },
    packagesContainer: {
        gap: spacingUtils.md,
        marginBottom: spacingUtils.lg,
    },
    packageCard: {
        padding: spacingUtils.md,
        borderRadius: 16,
        borderWidth: 2,
        borderColor: COLORS.border.light,
        backgroundColor: COLORS.WHITE,
        ...shadowUtils.getShadow("medium"),
        position: "relative",
    },
    packageCardPopular: {
        padding: spacingUtils.md,
        borderRadius: 16,
        borderWidth: 2,
        borderColor: COLORS.border.light,
        backgroundColor: COLORS.WHITE,
        ...shadowUtils.getShadow("medium"),
        position: "relative",
    },
    popularBadge: {
        position: "absolute",
        top: -10,
        right: 16,
        backgroundColor: COLORS.RED[500],
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
        zIndex: 1,
    },
    popularText: {
        fontWeight: "700",
        fontSize: 12,
    },
    packageHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: spacingUtils.md,
    },
    packageIconContainer: {
        width: 56,
        height: 56,
        borderRadius: 28,
        alignItems: "center",
        justifyContent: "center",
        marginRight: spacingUtils.sm,
    },
    packageTitleContainer: {
        flex: 1,
    },
    packageTitle: {
        fontWeight: "700",
        marginBottom: 2,
    },
    packageDescription: {
        lineHeight: 16,
    },
    priceContainer: {
        alignItems: "center",
        paddingVertical: spacingUtils.md,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: COLORS.border.light,
        marginBottom: spacingUtils.md,
    },
    price: {
        fontWeight: "800",
        marginBottom: 4,
    },
    viewDetailsButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 12,
        borderRadius: 12,
        backgroundColor: COLORS.primaryLight,
        gap: 6,
    },
    viewDetailsText: {
        fontWeight: "600",
    },
    // Footer
    footer: {
        padding: spacingUtils.md,
        borderTopWidth: 1,
        borderTopColor: COLORS.border.light,
        backgroundColor: COLORS.WHITE,
    },
    consultationPriceContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: spacingUtils.sm,
        paddingHorizontal: spacingUtils.xs,
        marginBottom: spacingUtils.sm,
    },
    consultationPriceLabel: {
        fontWeight: "500",
    },
    consultationPriceAmount: {
        fontWeight: "700",
        color: COLORS.primary,
    },
    footerButtons: {
        flexDirection: "row",
        gap: spacingUtils.sm,
    },
    backButton: {
        flex: 1,
    },
    continueButton: {
        flex: 1,
    },
    // Kitchen Layout Styles
    kitchenLayoutContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: spacingUtils.md,
        marginBottom: spacingUtils.lg,
    },
    kitchenLayoutCard: {
        width: (SCREEN_WIDTH - spacingUtils.md * 3) / 2,
        borderRadius: 16,
        borderWidth: 2,
        borderColor: COLORS.border.light,
        backgroundColor: COLORS.WHITE,
        alignItems: "center",
        justifyContent: "flex-start",
        padding: spacingUtils.xs,
        position: "relative",
        minHeight: 180,
        ...shadowUtils.getShadow("small"),
    },
    kitchenLayoutCardSelected: {
        borderColor: COLORS.primary,
        borderWidth: 3,
    },
    kitchenLayoutVisualContainer: {
        width: "100%",
        height: 120,
        marginBottom: spacingUtils.sm,
        alignItems: "center",
        justifyContent: "center",
    },
    kitchenLayoutLabel: {
        fontWeight: "600",
        textAlign: "center",
    },
    kitchenLayoutCheckmark: {
        position: "absolute",
        top: 8,
        right: 8,
    },
    uShapedVariantsContainer: {
        marginTop: spacingUtils.lg,
        paddingTop: spacingUtils.lg,
        borderTopWidth: 1,
        borderTopColor: COLORS.border.light,
    },
    uShapedTitle: {
        fontWeight: "600",
        marginBottom: spacingUtils.md,
    },
    uShapedVariantsGrid: {
        flexDirection: "row",
        gap: spacingUtils.md,
    },
    uShapedVariantCard: {
        flex: 1,
        padding: spacingUtils.md,
        paddingTop: spacingUtils.lg,
        paddingBottom: spacingUtils.md,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: COLORS.border.light,
        backgroundColor: COLORS.WHITE,
        alignItems: "center",
        justifyContent: "flex-start",
        minHeight: 160,
        ...shadowUtils.getShadow("small"),
    },
    uShapedVariantCardSelected: {
        borderColor: COLORS.primary,
        borderWidth: 3,
        backgroundColor: COLORS.primaryLight,
    },
    uShapedVariantVisualContainer: {
        width: "100%",
        height: 100,
        marginBottom: spacingUtils.sm,
        alignItems: "center",
        justifyContent: "center",
    },
    uShapedVariantLabel: {
        marginTop: spacingUtils.xs,
        fontWeight: "600",
    },
    dimensionsContainer: {
        marginTop: spacingUtils.xs,
        paddingTop: spacingUtils.lg,
        borderTopWidth: 1,
        borderTopColor: COLORS.border.light,
    },
    dimensionsBanner: {
        backgroundColor: "#FFF9E6",
        padding: spacingUtils.md,
        borderRadius: 8,
        marginBottom: spacingUtils.md,
        alignItems: "center",
    },
    dimensionsBannerText: {
        textAlign: "center",
    },
    dimensionsInputsContainer: {
        gap: spacingUtils.md,
    },
    dimensionInputRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: spacingUtils.md,
        width: "100%",
    },
    dimensionLabel: {
        fontWeight: "600",
        width: 30,
        textAlign: "left",
    },
    dimensionInputContainer: {
        flex: 1,
        marginBottom: 0,
    },
    dimensionInputBox: {
        marginBottom: 0,
    },
    dimensionUnit: {
        fontWeight: "500",
        width: 30,
        textAlign: "left",
    },
    packageCardSelected: {
        borderColor: COLORS.primary,
        borderWidth: 3,
        backgroundColor: COLORS.primaryLight + "20",
    },
    // Step 4 Styles
    section: {
        marginBottom: spacingUtils.xl,
    },
    sectionHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: spacingUtils.md,
        gap: 8,
    },
    sectionTitle: {
        fontWeight: "600",
        color: COLORS.TEXT.DARK,
    },
    addAddressButton: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: COLORS.primaryLight,
        borderWidth: 1,
        borderColor: COLORS.primary,
        borderRadius: 12,
        padding: spacingUtils.md,
        borderStyle: "dashed",
    },
    addAddressText: {
        flex: 1,
        marginLeft: spacingUtils.sm,
        fontWeight: "500",
    },
    datesContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: spacingUtils.sm,
        gap: spacingUtils.sm,
    },
    dateItemWrapper: {
        flex: 1,
    },
    dateItem: {
        backgroundColor: COLORS.WHITE,
        borderWidth: 2,
        borderColor: COLORS.border.light,
        borderRadius: 12,
        paddingVertical: spacingUtils.md,
        paddingHorizontal: spacingUtils.xs,
        alignItems: "center",
        justifyContent: "center",
        minHeight: 90,
    },
    selectedDateItem: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
        borderWidth: 2,
    },
    dayName: {
        marginBottom: 4,
        textTransform: "uppercase",
        fontWeight: "500",
    },
    dayNumber: {
        marginBottom: 2,
        fontWeight: "700",
    },
    monthText: {
        fontSize: 11,
        fontWeight: "500",
    },
    timeSlotsList: {
        paddingHorizontal: 4,
    },
    timeSlotsRow: {
        justifyContent: "space-between",
    },
    timeSlotItem: {
        width: (SCREEN_WIDTH - spacingUtils.md * 3) / 2,
        backgroundColor: COLORS.WHITE,
        borderWidth: 1,
        borderColor: COLORS.border.light,
        borderRadius: 10,
        paddingVertical: spacingUtils.md,
        paddingHorizontal: spacingUtils.sm,
        alignItems: "center",
        marginBottom: spacingUtils.sm,
    },
    selectedTimeSlot: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
    },
    unavailableTimeSlot: {
        backgroundColor: COLORS.GREY[100],
        borderColor: COLORS.GREY[200],
    },
    requirementsInput: {
        textAlignVertical: "top",
        minHeight: 100,
    },
});
