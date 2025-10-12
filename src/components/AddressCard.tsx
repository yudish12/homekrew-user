import React from "react";
import { View, StyleSheet, TouchableOpacity, ViewStyle } from "react-native";
import { Typography } from "./Typography";
import { CustomIcon } from "./CustomIcon";
import { RadioButton } from "./RadioButton";
import { COLORS } from "../constants/ui";
import { UserAddress } from "../types/user-address";

interface AddressCardProps {
    address: UserAddress;
    isSelected: boolean;
    onSelect: () => void;
    style?: ViewStyle;
}

export const AddressCard: React.FC<AddressCardProps> = ({
    address,
    isSelected,
    onSelect,
    style,
}) => {
    const getAddressTypeIcon = (type: string) => {
        switch (type?.toLowerCase()) {
            case "home":
                return "home";
            case "work":
                return "business";
            case "other":
                return "location";
            default:
                return "location";
        }
    };

    const getAddressTypeColor = (type: string) => {
        switch (type?.toLowerCase()) {
            case "home":
                return COLORS.GREEN[700];
            case "work":
                return COLORS.primary;
            case "other":
                return COLORS.GREY[500];
            default:
                return COLORS.GREY[500];
        }
    };

    const formatAddress = () => {
        const parts = [
            address.line1,
            address.line2,
            address.street,
            address.city,
            address.state,
            address.postalCode,
        ].filter(Boolean);

        return parts.join(", ");
    };

    return (
        <TouchableOpacity
            style={[
                styles.container,
                isSelected && styles.selectedContainer,
                style,
            ]}
            onPress={onSelect}
            activeOpacity={0.7}
        >
            <View style={styles.header}>
                <View style={styles.typeContainer}>
                    <CustomIcon
                        provider="Ionicons"
                        name={getAddressTypeIcon(address.addressType)}
                        size={16}
                        color={getAddressTypeColor(address.addressType)}
                    />
                    <Typography
                        variant="bodySmall"
                        color={getAddressTypeColor(address.addressType)}
                        style={styles.typeText}
                    >
                        {address.city}, {address.state}
                    </Typography>
                </View>
            </View>

            <Typography
                variant="body"
                color={COLORS.TEXT.DARK}
                style={styles.addressText}
                numberOfLines={3}
            >
                {address.completeAddress}
            </Typography>

            {address.landmark && (
                <View style={styles.landmarkContainer}>
                    <CustomIcon
                        provider="Ionicons"
                        name="flag"
                        size={12}
                        color={COLORS.GREY[400]}
                    />
                    <Typography
                        variant="caption"
                        color={COLORS.GREY[500]}
                        style={styles.landmarkText}
                    >
                        {address.landmark}
                    </Typography>
                </View>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
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
    selectedContainer: {
        borderColor: COLORS.primary,
        borderWidth: 2,
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 2,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 8,
    },
    typeContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    typeText: {
        marginLeft: 6,
        textTransform: "capitalize",
        fontWeight: "600",
    },
    addressText: {
        lineHeight: 20,
        marginBottom: 8,
    },
    landmarkContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    landmarkText: {
        marginLeft: 4,
        fontStyle: "italic",
    },
});

export default AddressCard;
