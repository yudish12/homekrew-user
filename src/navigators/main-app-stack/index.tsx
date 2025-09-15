import { createNativeStackNavigator } from "@react-navigation/native-stack";
import BottomTabs from "../bottom-tabs";
import Address from "./screens/Address";
import ServiceStack from "../service-stack";
import ProductStack from "../product-stack";
import AllAddress from "./screens/AllAddress";
import PostOrder from "./screens/PostOrder";

const Stack = createNativeStackNavigator();

const MainAppStack = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen name="BottomTabs" component={BottomTabs} />
            <Stack.Screen
                options={{ presentation: "containedTransparentModal" }}
                name="AllAddress"
                component={AllAddress}
            />
            <Stack.Screen
                options={{ presentation: "containedTransparentModal" }}
                name="Address"
                component={Address}
            />
            <Stack.Screen name="Services" component={ServiceStack} />
            <Stack.Screen name="Products" component={ProductStack} />
            <Stack.Screen name="PostOrder" component={PostOrder} />
        </Stack.Navigator>
    );
};

export default MainAppStack;
