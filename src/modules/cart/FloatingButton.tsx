import {
    Dimensions,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { Typography } from "../../components/Typography";
import { useSelector } from "react-redux";
import { getCartTotalQuantity } from "../../redux/selectors";
import { COLORS } from "../../constants";
import CustomIcon from "../../components/CustomIcon";
import { useNavigation } from "@react-navigation/native";

const FloatingCartButton = () => {
    const navigation = useNavigation<any>();
    const cartTotalQuantity = useSelector(getCartTotalQuantity);

    if (cartTotalQuantity === 0) return null;
    return (
        <TouchableOpacity
            onPress={() => navigation.navigate("ProductCheckout")}
            style={styles.container}
        >
            <View>
                <Typography color="white" variant="caption">
                    Checkout
                </Typography>
                <Typography color="white" variant="caption">
                    {cartTotalQuantity} items
                </Typography>
            </View>
            <View style={styles.arrowContainer}>
                <CustomIcon
                    provider="Ionicons"
                    name="chevron-forward"
                    size={24}
                    color={COLORS.WHITE}
                />
            </View>
        </TouchableOpacity>
    );
};

export default FloatingCartButton;

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        color: COLORS.WHITE,
        justifyContent: "space-between",
        bottom: 30,
        left: "30%",
        backgroundColor: COLORS.primary,
        flexDirection: "row",
        gap: 28,
        paddingRight: 6,
        paddingLeft: 16,
        borderRadius: 60,
        paddingVertical: 6,
        alignItems: "center",
    },
    arrowContainer: {
        backgroundColor: "#144272",
        borderRadius: 10000,
        padding: 8,
    },
});
