import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AllProducts from "./screen/AllProducts";
import ProductDetail from "./screen/ProductDetail";
import ProductCheckout from "./screen/ProductCheckout";
import OrderHistory from "./screen/OrderHistory";
import PaymentMethod from "./screen/PaymentMethod";

const ProductStack = () => {
    const Stack = createNativeStackNavigator();
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
                animation: "slide_from_right",
            }}
        >
            <Stack.Screen name="ProductsLanding" component={AllProducts} />
            <Stack.Screen name="ProductDetail" component={ProductDetail} />
            <Stack.Screen name="ProductCheckout" component={ProductCheckout} />
            <Stack.Screen name="PaymentMethod" component={PaymentMethod} />
            <Stack.Screen name="OrderHistory" component={OrderHistory} />
        </Stack.Navigator>
    );
};

export default ProductStack;
