import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { AppNavigator } from "./navigators";
import { Provider, useDispatch } from "react-redux";
import configureStore from "./redux/store";
import { AuthInitialState } from "./redux/reducers/auth";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { loadFonts } from "./lib/fonts";
import { View } from "react-native";
import { CartInitialState } from "./redux/reducers/cart";
import { ToastComponent } from "./components/Toast";
import { AddressInitialState } from "./redux/reducers";
import { SafeAreaProvider } from "react-native-safe-area-context";

// Create the store instance
const store = configureStore({
    auth: AuthInitialState,
    cart: CartInitialState,
    address: AddressInitialState,
});

export default function App() {
    const [fontsLoaded, setFontsLoaded] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                await loadFonts();
            } finally {
                setFontsLoaded(true);
            }
        })();
    }, []);

    if (!fontsLoaded) {
        return <View style={{ flex: 1, backgroundColor: "#FFFFFF" }} />;
    }

    return (
        <SafeAreaProvider>
            <GestureHandlerRootView style={{ flex: 1 }}>
                <Provider store={store}>
                    <AppNavigator />
                    <StatusBar style="auto" />
                    <ToastComponent />
                </Provider>
            </GestureHandlerRootView>
        </SafeAreaProvider>
    );
}
