import {
    View,
    Text,
    ActivityIndicator,
    ScrollView,
    TouchableOpacity,
    Platform,
    StyleSheet,
    TextInput,
} from "react-native";
import React, { useRef, useEffect, useMemo } from "react";
import MapView, {
    Marker,
    PROVIDER_GOOGLE,
    Region as MapRegion,
    PROVIDER_DEFAULT,
} from "react-native-maps";
import SearchBar from "../../components/SearchBar";
import { Button } from "../../components/Button";
import { COLORS, WEIGHTS } from "../../constants";
import CustomIcon from "../../components/CustomIcon";
import { Typography } from "../../components/Typography";
import { Region } from "../../navigators/main-app-stack/screens/Address";

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

const MapViewComponent = (props: MapViewProps) => {
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

    console.log("query", query);

    const mapRef = useRef<MapView>(null);
    const lastExternalRegion = useRef<{ lat: number; lng: number } | null>(
        null,
    );

    // Convert Region to MapRegion format
    const mapRegion: MapRegion = useMemo(
        () => ({
            latitude: region.latitude,
            longitude: region.longitude,
            latitudeDelta: region.latitudeDelta,
            longitudeDelta: region.longitudeDelta,
        }),
        [
            region.latitude,
            region.longitude,
            region.latitudeDelta,
            region.longitudeDelta,
        ],
    );

    const handleRegionChangeComplete = (newRegion: MapRegion) => {
        // Only update if this is a significant change (user dragged or external update)
        const hasChanged =
            Math.abs(newRegion.latitude - region.latitude) > 0.0001 ||
            Math.abs(newRegion.longitude - region.longitude) > 0.0001;

        if (hasChanged) {
            setRegion({
                latitude: newRegion.latitude,
                longitude: newRegion.longitude,
                latitudeDelta: newRegion.latitudeDelta,
                longitudeDelta: newRegion.longitudeDelta,
            });
        }
    };

    // Animate map when region changes externally (e.g., from current location or search)
    useEffect(() => {
        const currentKey = `${region.latitude.toFixed(
            6,
        )}_${region.longitude.toFixed(6)}`;
        const lastKey = lastExternalRegion.current
            ? `${lastExternalRegion.current.lat.toFixed(
                  6,
              )}_${lastExternalRegion.current.lng.toFixed(6)}`
            : null;

        // Only animate if this is an external change (not from map interaction)
        if (mapRef.current && currentKey !== lastKey) {
            lastExternalRegion.current = {
                lat: region.latitude,
                lng: region.longitude,
            };
            mapRef.current.animateToRegion(mapRegion, 500);
        }
    }, [mapRegion]);

    return (
        <>
            <TextInput
                placeholder="Search for a location"
                value={query}
                onChangeText={setQuery}
                style={styles.search}
                returnKeyType="search"
                autoFocus
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
                                    const newRegion = {
                                        latitude: lat,
                                        longitude: lng,
                                        latitudeDelta: 0.02,
                                        longitudeDelta: 0.02,
                                    };
                                    setRegion(newRegion);
                                    setAddressLine(result.formattedAddress);
                                    setSearchResults([]);
                                    // Animate map to selected location
                                    if (mapRef.current) {
                                        mapRef.current.animateToRegion(
                                            newRegion,
                                            500,
                                        );
                                    }
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
                <MapView
                    ref={mapRef}
                    provider={
                        Platform.OS === "ios"
                            ? PROVIDER_DEFAULT
                            : PROVIDER_GOOGLE
                    }
                    style={styles.map}
                    region={mapRegion}
                    onRegionChangeComplete={handleRegionChangeComplete}
                    showsUserLocation={false}
                    showsMyLocationButton={false}
                    mapType="standard"
                    loadingEnabled={true}
                >
                    <Marker
                        coordinate={markerCoord}
                        title="Selected location"
                        draggable
                        onDragEnd={e => {
                            const newCoord = e.nativeEvent.coordinate;
                            setRegion(prev => ({
                                ...prev,
                                latitude: newCoord.latitude,
                                longitude: newCoord.longitude,
                            }));
                        }}
                    />
                </MapView>

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

export default MapViewComponent;

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
        backgroundColor: COLORS.WHITE,
        borderWidth: 1,
        borderColor: COLORS.GREY[100],
        shadowOffset: { width: 0, height: 4 },
        marginBottom: 16,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 15,
        color: COLORS.TEXT.DARK,
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
