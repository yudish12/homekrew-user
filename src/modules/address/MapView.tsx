import {
    View,
    Text,
    ActivityIndicator,
    ScrollView,
    TouchableOpacity,
    Platform,
    StyleSheet,
} from "react-native";
import React from "react";
import SearchBar from "../../components/SearchBar";
import { Button } from "../../components/Button";
import { COLORS, WEIGHTS } from "../../constants";
import CustomIcon from "../../components/CustomIcon";
import { Typography } from "../../components/Typography";
import { Region } from "../../navigators/main-app-stack/screens/Address";
import { AppleMaps, GoogleMaps } from "expo-maps";

interface MapViewProps {
    query: string;
    setQuery: (query: string) => void;
    isLoading: boolean;
    region: Region;
    isSearching: boolean;
    searchResults: any[];
    addressLine: string;
    setSearchResults: (results: any[]) => void;
    setAddressLine: (line: string) => void;
    setIsLoading: (loading: boolean) => void;
    setRegion: React.Dispatch<React.SetStateAction<Region>>;
    handleLocationConfirm: () => void;
    requestLocation: () => void;
    markerCoord: any;
}

const MapView = (props: MapViewProps) => {
    const {
        query,
        setQuery,
        isSearching,
        isLoading,
        searchResults,
        addressLine,
        setSearchResults,
        setAddressLine,
        setIsLoading,
        setRegion,
        handleLocationConfirm,
        requestLocation,
        markerCoord,
        region,
    } = props;
    return (
        <>
            <SearchBar
                value={query}
                onChangeText={setQuery}
                placeholder="Search for a location"
                containerStyle={styles.search}
                inputStyle={{ fontSize: 15 }}
            />

            {isSearching ? (
                <>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                </>
            ) : searchResults.length > 0 ? (
                <ScrollView style={[styles.searchResults, styles.resultsCard]}>
                    {searchResults.map((result, index) => (
                        <View key={result.placeId}>
                            <TouchableOpacity
                                activeOpacity={0.75}
                                style={styles.resultRow}
                                onPress={() => {
                                    const lat = result.coordinates.lat;
                                    const lng = result.coordinates.lng;
                                    setRegion({
                                        latitude: lat,
                                        longitude: lng,
                                        latitudeDelta: 0.02,
                                        longitudeDelta: 0.02,
                                    });
                                    setAddressLine(result.formattedAddress);
                                    setSearchResults([]);
                                }}
                            >
                                <View style={styles.resultIconContainer}>
                                    <CustomIcon
                                        provider="Ionicons"
                                        name="location-outline"
                                        size={18}
                                        color={COLORS.primary}
                                    />
                                </View>
                                <View style={styles.resultTexts}>
                                    <Typography
                                        variant="body"
                                        color={COLORS.TEXT.DARK}
                                        style={styles.resultMain}
                                        numberOfLines={1}
                                    >
                                        {result.structuredFormatting.mainText}
                                    </Typography>
                                    <Typography
                                        variant="bodySmall"
                                        color={COLORS.GREY[500]}
                                        style={styles.resultSecondary}
                                        numberOfLines={1}
                                    >
                                        {
                                            result.structuredFormatting
                                                .secondaryText
                                        }
                                    </Typography>
                                </View>
                                <CustomIcon
                                    provider="Ionicons"
                                    name="chevron-forward"
                                    size={18}
                                    color={COLORS.GREY[400]}
                                />
                            </TouchableOpacity>
                            {index !== searchResults.length - 1 && (
                                <View style={styles.resultDivider} />
                            )}
                        </View>
                    ))}
                </ScrollView>
            ) : null}

            <Button
                title="Use current location"
                variant="link"
                onPress={requestLocation}
                icon={
                    <CustomIcon
                        provider="Ionicons"
                        name="locate-outline"
                        size={18}
                        color={COLORS.primary}
                    />
                }
                iconPosition="extreme-left"
                style={styles.useLocation}
            />

            <View style={styles.card}>
                {Platform.OS === "ios" ? (
                    <AppleMaps.View
                        style={styles.map}
                        markers={[
                            {
                                coordinates: markerCoord,
                                title: "Selected location",
                            },
                        ]}
                        onCameraMove={e => {
                            const { coordinates } = e;
                            if (
                                coordinates &&
                                typeof coordinates.latitude === "number" &&
                                typeof coordinates.longitude === "number"
                            ) {
                                setRegion(prev => ({
                                    ...prev,
                                    latitude: coordinates.latitude as number,
                                    longitude: coordinates.longitude as number,
                                }));
                            }
                        }}
                    />
                ) : (
                    <GoogleMaps.View
                        style={styles.map}
                        markers={[
                            {
                                coordinates: markerCoord,
                                title: "Selected location",
                            },
                        ]}
                        onCameraMove={e => {
                            const { coordinates } = e;
                            if (
                                coordinates &&
                                typeof coordinates.latitude === "number" &&
                                typeof coordinates.longitude === "number"
                            ) {
                                setRegion(prev => ({
                                    ...prev,
                                    latitude: coordinates.latitude as number,
                                    longitude: coordinates.longitude as number,
                                }));
                            }
                        }}
                    />
                )}

                <View style={styles.cardFooter}>
                    <CustomIcon
                        provider="Ionicons"
                        name="location-outline"
                        size={20}
                        color={COLORS.GREY[500]}
                    />
                    <View style={{ flex: 1 }}>
                        <Typography
                            style={{ color: COLORS.GREY[500], fontSize: 12 }}
                        >
                            Selected Location
                        </Typography>
                        <Typography
                            style={styles.addressText}
                            numberOfLines={2}
                        >
                            {addressLine || "267 New Avenue Park New York"}
                        </Typography>
                    </View>
                </View>
            </View>

            <Button
                title="Confirm Location"
                onPress={handleLocationConfirm}
                loading={isLoading}
                style={styles.confirmButton}
            />
        </>
    );
};

export default MapView;

const styles = StyleSheet.create({
    searchResults: {
        paddingHorizontal: 16,
        paddingVertical: 16,
        gap: 12,
        maxHeight: 250,
    },
    resultsCard: {
        backgroundColor: COLORS.WHITE,
        borderRadius: 16,
        shadowColor: COLORS.TEXT.DARK,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.06,
        shadowRadius: 12,
        elevation: 2,
    },
    resultRow: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 10,
        paddingHorizontal: 4,
    },
    resultIconContainer: {
        width: 28,
        alignItems: "center",
        justifyContent: "center",
        marginRight: 8,
    },
    resultTexts: {
        flex: 1,
    },
    resultMain: {
        fontWeight: WEIGHTS.MEDIUM,
    },
    resultSecondary: {
        marginTop: 2,
    },
    resultDivider: {
        height: 1,
        backgroundColor: COLORS.GREY[100],
        marginVertical: 6,
    },
    search: {
        borderRadius: 16,
        height: 56,
        shadowOpacity: 0.06,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
        marginBottom: 16,
    },
    useLocation: {
        alignSelf: "flex-start",
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 0,
        paddingVertical: 0,
        width: 220,
        minHeight: 32,
        marginBottom: 16,
    },
    card: {
        backgroundColor: COLORS.WHITE,
        borderRadius: 20,
        shadowColor: COLORS.TEXT.DARK,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 3,
        overflow: "hidden",
        marginBottom: 24,
    },
    map: {
        height: 260,
        width: "100%",
    },
    cardFooter: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 14,
        gap: 12,
    },
    addressText: {
        color: COLORS.TEXT.DARK,
        fontWeight: WEIGHTS.MEDIUM,
        fontSize: 14,
    },
    confirmButton: {
        marginTop: 16,
    },
});
