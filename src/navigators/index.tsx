import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SplashScreen } from "../components/SplashScreen";
import AuthStack from "./auth-stack";
import MainAppStack from "./main-app-stack";
import Header from "../components/header";
import { useDispatch, useSelector } from "react-redux";
import { isAuthenticated, isProfileCompleted } from "../redux/selectors";
import { AppDispatch } from "../types";
import { setUser } from "../redux/actions";
import { AuthServices } from "../services/auth-services";
import EditProfileScreen from "./auth-stack/screens/EditProfileScreen";

const Stack = createNativeStackNavigator();

export const AppNavigator: React.FC = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [showSplash, setShowSplash] = useState(true);

    const userAuth = useSelector(isAuthenticated);
    const isUserProfileCompleted = useSelector(isProfileCompleted);

    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        const checkAuth = async () => {
            const response = await AuthServices.selfVerification();
            if (!response.success || !response.data) {
                setIsLoading(false);
                return;
            }
            dispatch(setUser(response.data));
            setIsLoading(false);
        };

        checkAuth();
    }, []);

    const handleSplashFinish = () => {
        setShowSplash(false);
    };

    // Show splash screen while loading or when explicitly shown
    if (showSplash) {
        return (
            <SplashScreen
                onFinish={handleSplashFinish}
                isAuthenticated={userAuth}
                isLoading={isLoading}
            />
        );
    }

    // Show appropriate stack based on authentication status
    return (
        <NavigationContainer>
            <Stack.Navigator
                screenOptions={({ navigation, route }) => ({
                    header: ({ options }) => {
                        // Don't show header for auth screens as they have custom headers
                        if (route.name === "Auth" || route.name === "MainApp") {
                            return null;
                        }

                        return (
                            <Header
                                title={options.title || route.name}
                                backButton={navigation.canGoBack()}
                                backHandler={() => navigation.goBack()}
                                showLogo={route.name === "Home"}
                            />
                        );
                    },
                    headerShown: true,
                })}
            >
                {userAuth ? (
                    <>
                        {isUserProfileCompleted ? (
                            <Stack.Screen
                                name="MainApp"
                                component={MainAppStack}
                                options={{ headerShown: false }}
                            />
                        ) : (
                            <Stack.Screen
                                name="EditProfile"
                                initialParams={{
                                    backEnabled: false,
                                    isUserNameEditable: false,
                                }}
                                options={{ headerShown: false }}
                                component={EditProfileScreen}
                            />
                        )}
                    </>
                ) : (
                    <Stack.Screen
                        name="Auth"
                        component={AuthStack}
                        options={{ headerShown: false }}
                    />
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
};
