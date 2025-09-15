import { useCallback, useEffect, useState } from "react";
import {
    View,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    RefreshControl,
    Dimensions,
} from "react-native";
import { SafeAreaView } from "../../../components/SafeAreaView";
import { Typography } from "../../../components/Typography";
import { Button } from "../../../components/Button";
import { CustomIcon } from "../../../components/CustomIcon";
import { AddressCard } from "../../../components/AddressCard";
import { SkeletonLoader } from "../../../components/SkeletonLoader";
import { COLORS } from "../../../constants/ui";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { UserAddress } from "../../../types/user-address";
import { useToast } from "../../../hooks/useToast";
import { useDispatch, useSelector } from "react-redux";
import {
    clearError,
    getAddressesForUser,
    setSelectedAddress,
} from "../../../redux/actions";
import { AppDispatch, RootState } from "../../../types";

const AllAddress = () => {
    const [refreshing, setRefreshing] = useState(false);

    const { addresses, selectedAddress, loading, error } = useSelector(
        (state: RootState) => state.address,
    );
    const dispatch = useDispatch<AppDispatch>();

    const navigation = useNavigation<any>();

    const toast = useToast();

    const fetchAddresses = useCallback(async () => {
        await dispatch(getAddressesForUser);
        setRefreshing(false);
    }, [selectedAddress]);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchAddresses();
    }, [fetchAddresses]);

    useEffect(() => {
        if (error && error !== "") {
            toast.error(error, "error");
            setTimeout(() => {
                dispatch(clearError);
            }, 3000);
        }
    }, [error]);

    // Initial load
    useEffect(() => {
        fetchAddresses();
    }, []);

    // Refetch when screen comes into focus (e.g., when returning from Address screen)
    useFocusEffect(
        useCallback(() => {
            dispatch(clearError());
        }, []),
    );

    const handleAddressSelect = (address: UserAddress) => {
        dispatch(setSelectedAddress(address));
    };

    const handleAddNewAddress = () => {
        navigation.navigate("Address");
    };

    const handleContinue = () => {
        if (selectedAddress) {
            // Handle continue with selected address
            console.log("Selected address:", selectedAddress);
            navigation.goBack();
        }
    };

    const renderAddressItem = ({ item }: { item: UserAddress }) => (
        <AddressCard
            address={item}
            isSelected={selectedAddress?._id === item._id}
            onSelect={() => handleAddressSelect(item)}
        />
    );

    const renderEmptyState = () => (
        <View style={styles.emptyState}>
            <CustomIcon
                provider="Ionicons"
                name="location-outline"
                size={64}
                color={COLORS.GREY[400]}
            />
            <Typography
                variant="h4"
                color={COLORS.TEXT.DARK}
                style={styles.emptyTitle}
            >
                No Addresses Found
            </Typography>
            <Typography
                variant="body"
                color={COLORS.GREY[500]}
                style={styles.emptySubtitle}
            >
                Add your first address to get started
            </Typography>
        </View>
    );

    const addressSkeletonLayout = [
        {
            width: Dimensions.get("window").width - 50,
            height: 120,
            borderRadius: 16,
        },
    ];

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={styles.backButton}
                >
                    <CustomIcon
                        provider="Ionicons"
                        name="arrow-back"
                        size={24}
                        color={COLORS.TEXT.DARK}
                    />
                </TouchableOpacity>
                <Typography variant="h3" color={COLORS.TEXT.DARK}>
                    Select Address
                </Typography>
                <View style={styles.placeholder} />
            </View>

            <View style={styles.content}>
                {loading && !refreshing ? (
                    <SkeletonLoader
                        items={3}
                        layout={addressSkeletonLayout}
                        containerStyle={styles.skeletonContainer}
                        itemContainerStyle={styles.skeletonItem}
                    />
                ) : (
                    <FlatList
                        data={addresses}
                        keyExtractor={item =>
                            item._id || Math.random().toString()
                        }
                        renderItem={renderAddressItem}
                        contentContainerStyle={[
                            styles.listContainer,
                            addresses.length === 0 && styles.emptyListContainer,
                        ]}
                        showsVerticalScrollIndicator={false}
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={onRefresh}
                                colors={[COLORS.primary]}
                                tintColor={COLORS.primary}
                            />
                        }
                        ListEmptyComponent={renderEmptyState}
                    />
                )}

                <View style={styles.footer}>
                    <Button
                        title="Add New Address"
                        variant="outline"
                        onPress={handleAddNewAddress}
                        icon={
                            <CustomIcon
                                provider="Ionicons"
                                name="add"
                                size={18}
                                color={COLORS.primary}
                            />
                        }
                        iconPosition="left"
                        style={styles.addButton}
                    />

                    {addresses.length > 0 && (
                        <Button
                            title="Continue"
                            variant="primary"
                            onPress={handleContinue}
                            disabled={!selectedAddress}
                            style={styles.continueButton}
                        />
                    )}
                </View>
            </View>
        </SafeAreaView>
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
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border.light,
    },
    backButton: {
        padding: 8,
        marginLeft: -8,
    },
    placeholder: {
        width: 40,
    },
    content: {
        flex: 1,
    },
    listContainer: {
        padding: 16,
        paddingBottom: 150,
    },
    emptyListContainer: {
        flex: 1,
        justifyContent: "center",
    },
    skeletonContainer: {
        padding: 16,
        flexDirection: "column",
    },
    skeletonItem: {
        backgroundColor: "transparent",
        borderWidth: 0,
        padding: 0,
        marginBottom: 12,
    },
    emptyState: {
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 60,
    },
    emptyTitle: {
        marginTop: 16,
        marginBottom: 8,
    },
    emptySubtitle: {
        textAlign: "center",
        lineHeight: 22,
    },
    footer: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: COLORS.WHITE,
        paddingHorizontal: 16,
        paddingVertical: 16,
        borderTopWidth: 1,
        borderTopColor: COLORS.border.light,
        gap: 12,
    },
    addButton: {
        borderColor: COLORS.primary,
    },
    continueButton: {
        opacity: 1,
    },
});

export default AllAddress;
