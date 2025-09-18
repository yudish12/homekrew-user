import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./screens/LoginScreen";
import OTPVerificationScreen from "./screens/OTPVerificationScreen";
import { SafeAreaView } from "../../components/SafeAreaView";
import EditProfileScreen from "./screens/EditProfileScreen";

const AuthStack = () => {
    const Stack = createNativeStackNavigator();

    return (
        <SafeAreaView>
            <Stack.Navigator
                screenOptions={{
                    headerShown: false,
                }}
            >
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen
                    name="OTPVerification"
                    component={OTPVerificationScreen}
                />
                <Stack.Screen name="PostLoginEdit" component={EditProfileScreen}/>
            </Stack.Navigator>
        </SafeAreaView>
    );
};

export default AuthStack;
