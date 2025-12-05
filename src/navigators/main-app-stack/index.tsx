import { createNativeStackNavigator } from "@react-navigation/native-stack";
import BottomTabs from "../bottom-tabs";
import Address from "./screens/Address";
import ServiceStack from "../service-stack";
import ProductStack from "../product-stack";
import AllAddress from "./screens/AllAddress";
import PostOrder from "./screens/PostOrder";
import EditProfileScreen from "../auth-stack/screens/EditProfileScreen";
import OrderHistoryComponent from "../product-stack/screen/OrderHistory";
import ServiceBookingHistory from "./screens/ServiceBookingHistory";
import BookingDetails from "./screens/BookingDetails";
import SearchScreen from "./screens/SearchScreen";
import MembershipPlansScreen from "./screens/AllPlansScreen";
import MembershipStatus from "./screens/MembershipStatus";
import { InteriorCalculatorStack } from "../interior-calculator-stack";

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
            <Stack.Screen name="ProductStack" component={ProductStack} />
            <Stack.Screen name="PostOrder" component={PostOrder} />
            <Stack.Screen name="EditProfile" component={EditProfileScreen} />
            <Stack.Screen
                name="OrderHistory"
                component={OrderHistoryComponent}
            />
            <Stack.Screen
                name="ServiceBookingHistory"
                component={ServiceBookingHistory}
            />
            <Stack.Screen
                name="MembershipDetails"
                component={MembershipPlansScreen}
            />
            <Stack.Screen name="BookingDetails" component={BookingDetails} />
            <Stack.Screen name="SearchScreen" component={SearchScreen} />
            <Stack.Screen
                name="MembershipStatus"
                component={MembershipStatus}
            />
            <Stack.Screen
                name="InteriorCalculator"
                component={InteriorCalculatorStack}
                options={{
                    headerShown: false,
                    presentation: "modal",
                    animation: "slide_from_bottom",
                }}
            />
        </Stack.Navigator>
    );
};

export default MainAppStack;
