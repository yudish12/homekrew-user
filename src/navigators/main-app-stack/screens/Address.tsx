import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
    Platform,
    StyleSheet,
    View,
    ScrollView,
    KeyboardAvoidingView,
} from "react-native";
import { SafeAreaView } from "../../../components/SafeAreaView";
import { Button } from "../../../components/Button";
import { Typography } from "../../../components/Typography";
import { COLORS, WEIGHTS } from "../../../constants/ui";
import * as Location from "expo-location";
import { BackButton } from "../../../components/BackButton";
import { useNavigation } from "@react-navigation/native";
import { AddressServices } from "../../../services/address-services";
import { AddressFormData } from "../../../types/user-address";
import { useToast } from "../../../hooks/useToast";
import { AppDispatch, RootState, SearchLocationResponse } from "../../../types";
import { useDebounce } from "../../../hooks/useDebounce";
import MapView from "../../../modules/address/MapView";
import AddressForm from "../../../modules/address/AddressForm";
import { useDispatch, useSelector } from "react-redux";
import { addAddress } from "../../../redux/actions";

// Local Region type (expo-maps does not export Region)
export type Region = {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
};

const DEFAULT_REGION: Region = {
    latitude: 37.7749,
    longitude: -122.4194,
    latitudeDelta: 0.04,
    longitudeDelta: 0.04,
};

const Address = () => {
    const [currentStep, setCurrentStep] = useState<1 | 2>(1);
    const [query, setQuery] = useState("");
    const [region, setRegion] = useState<Region>(DEFAULT_REGION);
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);
    const [addressLine, setAddressLine] = useState<string>("");
    const [isLoading, setIsLoading] = useState(false);

    const [searchResults, setSearchResults] = useState<
        SearchLocationResponse[]
    >([]);
    const [isSearching, setIsSearching] = useState(false);

    const debouncedSearch = useDebounce(query, 700);

    //redux hooks
    const dispatch = useDispatch<AppDispatch>();
    const { loading: isSubmitting } = useSelector(
        (state: RootState) => state.address,
    );

    // Form data state
    const [formData, setFormData] = useState<AddressFormData>({
        line1: "",
        line2: "",
        street: "",
        city: "",
        state: "",
        country: "",
        postalCode: "",
        addressType: "home",
        landmark: "",
        location: {
            type: "Point",
            coordinates: [0, 0],
        },
    });

    const navigation = useNavigation<any>();
    const toast = useToast();

    const requestLocation = useCallback(async () => {
        try {
            const { status } =
                await Location.requestForegroundPermissionsAsync();
            const granted = status === "granted";
            setHasPermission(granted);
            if (!granted) return;

            const pos = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.Balanced,
            });

            const newRegion: Region = {
                latitude: pos.coords.latitude,
                longitude: pos.coords.longitude,
                latitudeDelta: 0.02,
                longitudeDelta: 0.02,
            };
            setRegion(newRegion);

            const [rev] = await Location.reverseGeocodeAsync({
                latitude: pos.coords.latitude,
                longitude: pos.coords.longitude,
            });

            if (rev) {
                const line = [
                    rev.name,
                    rev.street,
                    rev.city,
                    rev.region,
                    rev.postalCode,
                    rev.country,
                ]
                    .filter(Boolean)
                    .join(", ");
                setAddressLine(line);
            }
        } catch (e) {
            // silent fail; keep defaults
        }
    }, []);

    useEffect(() => {
        // Warm up permission state for better UX (doesn't fetch position until user taps)
        Location.getForegroundPermissionsAsync().then(res =>
            setHasPermission(res.status === "granted"),
        );
    }, []);

    const searchLocation = async (params: string) => {
        if (!params) {
            setSearchResults([]);
            return;
        }
        setIsSearching(true);
        try {
            const response = await AddressServices.searchLocation(params);
            if (response.success && response.data) {
                setSearchResults(response.data);
            }
        } catch (error) {
            toast.error("Failed to search location", "error");
        } finally {
            setIsSearching(false);
        }
    };

    useEffect(() => {
        searchLocation(debouncedSearch);
    }, [debouncedSearch]);

    const markerCoord = useMemo(
        () => ({ latitude: region.latitude, longitude: region.longitude }),
        [region],
    );

    const handleLocationConfirm = async () => {
        setIsLoading(true);
        try {
            // Get location details from Google API
            const locationResponse = await AddressServices.getLocationDetails(
                region.latitude,
                region.longitude,
            );

            if (locationResponse.success && locationResponse.data) {
                const locationData = locationResponse.data;
                setFormData(prev => ({
                    ...prev,
                    ...locationData,
                    location: {
                        type: "Point",
                        coordinates: [region.longitude, region.latitude],
                    },
                }));
            }

            setCurrentStep(2);
        } catch (error) {
            toast.error("Failed to get location details", "error");
        } finally {
            setIsLoading(false);
        }
    };

    const handleFormSubmit = async () => {
        await dispatch(addAddress(formData));
        console.log("Address added successfully!");
        navigation.goBack();
    };

    const updateFormData = (field: keyof AddressFormData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const renderStepIndicator = () => (
        <View style={styles.stepIndicator}>
            <View style={styles.stepContainer}>
                <View
                    style={[
                        styles.stepCircle,
                        currentStep >= 1 && styles.activeStep,
                    ]}
                >
                    <Typography
                        style={[
                            styles.stepText,
                            currentStep >= 1 && styles.activeStepText,
                        ]}
                    >
                        1
                    </Typography>
                </View>
                <Typography style={styles.stepLabel}>Location</Typography>
            </View>
            <View style={styles.stepLine} />
            <View style={styles.stepContainer}>
                <View
                    style={[
                        styles.stepCircle,
                        currentStep >= 2 && styles.activeStep,
                    ]}
                >
                    <Typography
                        style={[
                            styles.stepText,
                            currentStep >= 2 && styles.activeStepText,
                        ]}
                    >
                        2
                    </Typography>
                </View>
                <Typography style={styles.stepLabel}>Details</Typography>
            </View>
        </View>
    );

    const renderStep1 = () => (
        <ScrollView
            contentContainerStyle={{ paddingBottom: 20 }}
            style={styles.stepContent}
        >
            <Typography variant="h2" style={styles.stepTitle}>
                Select Location
            </Typography>
            <Typography style={styles.stepDescription}>
                Choose your location on the map or use your current location
            </Typography>
            <MapView
                query={query}
                setQuery={setQuery}
                isLoading={isLoading}
                region={region}
                isSearching={isSearching}
                searchResults={searchResults}
                addressLine={addressLine}
                setSearchResults={setSearchResults}
                setAddressLine={setAddressLine}
                setIsLoading={setIsLoading}
                setRegion={setRegion}
                handleLocationConfirm={handleLocationConfirm}
                requestLocation={requestLocation}
                markerCoord={markerCoord}
            />
        </ScrollView>
    );

    const renderStep2 = () => (
        <KeyboardAvoidingView
            style={styles.keyboardAvoidingView}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
        >
            <ScrollView
                style={styles.stepContent}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
            >
                <Typography variant="h2" style={styles.stepTitle}>
                    Address Details
                </Typography>
                <Typography style={styles.stepDescription}>
                    Fill in the address details below
                </Typography>

                <AddressForm
                    formData={formData}
                    updateFormData={updateFormData}
                />
            </ScrollView>

            <View style={styles.buttonContainer}>
                <Button
                    title="Back"
                    variant="outline"
                    onPress={() => setCurrentStep(1)}
                    style={[styles.actionButton, { marginRight: 12 }]}
                />
                <Button
                    title="Save Address"
                    onPress={handleFormSubmit}
                    loading={isSubmitting}
                    style={[styles.actionButton, { flex: 1 }]}
                />
            </View>
        </KeyboardAvoidingView>
    );

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.WHITE }}>
            <View style={styles.container}>
                <BackButton
                    backButtonStyle={{ top: -5 }}
                    onPress={() =>
                        currentStep === 1
                            ? navigation.goBack()
                            : setCurrentStep(1)
                    }
                />

                {renderStepIndicator()}

                {currentStep === 1 ? renderStep1() : renderStep2()}
            </View>
        </SafeAreaView>
    );
};

export default Address;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 8,
    },
    stepIndicator: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginVertical: 20,
        paddingHorizontal: 20,
    },
    stepContainer: {
        alignItems: "center",
        flex: 1,
    },
    stepCircle: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: COLORS.GREY[200],
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 8,
    },
    activeStep: {
        backgroundColor: COLORS.primary,
    },
    stepText: {
        fontSize: 14,
        fontWeight: WEIGHTS.MEDIUM,
        color: COLORS.WHITE,
    },
    activeStepText: {
        color: COLORS.WHITE,
    },
    stepLabel: {
        fontSize: 12,
        color: COLORS.GREY[400],
        fontWeight: WEIGHTS.MEDIUM,
    },
    stepLine: {
        height: 2,
        backgroundColor: COLORS.GREY[200],
        flex: 1,
        marginHorizontal: 16,
        marginBottom: 24,
    },
    stepContent: {
        flex: 1,
    },
    keyboardAvoidingView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        paddingBottom: 20,
    },
    stepTitle: {
        marginBottom: 8,
        color: COLORS.TEXT.DARK,
        textAlign: "center",
    },
    stepDescription: {
        textAlign: "center",
        color: COLORS.GREY[400],
        marginBottom: 24,
        fontSize: 14,
    },
    formContainer: {
        paddingBottom: 20,
    },
    rowInputs: {
        flexDirection: "row",
        alignItems: "flex-start",
    },
    buttonContainer: {
        flexDirection: "row",
        paddingVertical: 20,
        paddingBottom: 60,
        paddingHorizontal: 16,
        backgroundColor: COLORS.WHITE,
        borderTopWidth: 1,
        borderTopColor: COLORS.GREY[100],
    },
    actionButton: {
        flex: 1,
    },
});
