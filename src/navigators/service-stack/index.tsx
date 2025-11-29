import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AllServices from "./screens/AllServices";
import ServiceDetails from "./screens/ServiceDetails";
import ServiceTemplate from "./screens/ServiceTemplate";
import { ServiceBooking } from "./screens/ServiceBooking";
import PostBooking from "./screens/PostBooking";
import SlotSelection from "./screens/SlotSelection";

const ServiceStack = () => {
    const Stack = createNativeStackNavigator();
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
                animation: "slide_from_right",
            }}
        >
            <Stack.Screen name="ServiceLanding" component={AllServices} />
            <Stack.Screen name="ServiceDetails" component={ServiceDetails} />
            <Stack.Screen name="ServiceTemplate" component={ServiceTemplate} />
            <Stack.Screen name="SlotSelection" component={SlotSelection} />
            <Stack.Screen name="ServiceBooking" component={ServiceBooking} />
            <Stack.Screen name="PostBooking" component={PostBooking} />
        </Stack.Navigator>
    );
};

export default ServiceStack;
