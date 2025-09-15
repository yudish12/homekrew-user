import React from "react";
import { View, StyleSheet, TouchableOpacity, ViewStyle } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Typography } from "./Typography";
import { CustomIcon } from "./CustomIcon";
import { COLORS } from "../constants/ui";
import { updateQuantity, removeFromCart } from "../redux/actions/cart";
import { getCartItemById } from "../redux/selectors/cart";

interface CartCounterProps {
    productId: string;
    style?: ViewStyle;
    size?: "small" | "medium" | "large";
}

const CartCounter: React.FC<CartCounterProps> = ({
    productId,
    style,
    size = "medium",
}) => {
    const dispatch = useDispatch();
    const cartItem = useSelector(getCartItemById(productId));

    const currentQuantity = cartItem?.quantity || 0;

    const handleIncrease = () => {
        dispatch(updateQuantity(productId, 1));
    };

    const handleDecrease = () => {
        if (currentQuantity > 1) {
            dispatch(updateQuantity(productId, -1));
        } else {
            dispatch(removeFromCart(productId));
        }
    };

    const getSizeStyles = () => {
        switch (size) {
            case "small":
                return {
                    container: styles.smallContainer,
                    button: styles.smallButton,
                    icon: 16,
                    text: styles.smallText,
                };
            case "large":
                return {
                    container: styles.largeContainer,
                    button: styles.largeButton,
                    icon: 20,
                    text: styles.largeText,
                };
            default:
                return {
                    container: styles.mediumContainer,
                    button: styles.mediumButton,
                    icon: 18,
                    text: styles.mediumText,
                };
        }
    };

    const sizeStyles = getSizeStyles();

    if (currentQuantity === 0) {
        return null;
    }

    return (
        <View style={[styles.counterContainer, sizeStyles.container, style]}>
            <TouchableOpacity
                style={[styles.counterButton, sizeStyles.button]}
                onPress={handleDecrease}
                activeOpacity={0.7}
            >
                <CustomIcon
                    provider="Ionicons"
                    name="remove"
                    size={sizeStyles.icon}
                    color={COLORS.TEXT.DARK}
                />
            </TouchableOpacity>

            <View style={styles.quantityContainer}>
                <Typography
                    variant="bodySmall"
                    color={COLORS.TEXT.DARK}
                    style={[styles.quantityText, sizeStyles.text]}
                >
                    {currentQuantity}
                </Typography>
            </View>

            <TouchableOpacity
                style={[styles.counterButton, sizeStyles.button]}
                onPress={handleIncrease}
                activeOpacity={0.7}
            >
                <CustomIcon
                    provider="Ionicons"
                    name="add"
                    size={sizeStyles.icon}
                    color={COLORS.TEXT.DARK}
                />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    counterContainer: {
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        justifyContent: "space-between",
        backgroundColor: COLORS.WHITE,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: COLORS.GREY[200],
        shadowColor: COLORS.TEXT.DARK,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 2,
    },
    counterButton: {
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: COLORS.GREY[100],
    },
    quantityContainer: {
        minWidth: 32,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 8,
    },
    quantityText: {
        fontWeight: "600",
        textAlign: "center",
    },
    // Size variants
    smallContainer: {
        height: 28,
        borderRadius: 14,
    },
    smallButton: {
        width: 28,
        height: 28,
        borderRadius: 14,
    },
    smallText: {
        fontSize: 12,
    },
    mediumContainer: {
        height: 32,
        borderRadius: 16,
    },
    mediumButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
    },
    mediumText: {
        fontSize: 14,
    },
    largeContainer: {
        height: 36,
        borderRadius: 18,
    },
    largeButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
    },
    largeText: {
        fontSize: 16,
    },
});

export default CartCounter;
