import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
    View,
    StyleSheet,
    TouchableOpacityProps,
    TouchableOpacity,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Home from "./screens/Home";
import Explore from "./screens/Explore";
import { COLORS } from "../../constants/ui";
import { CustomIcon } from "../../components/CustomIcon";
import Account from "./screens/Account";
import AllProducts from "../product-stack/screen/AllProducts";

const Tab = createBottomTabNavigator();

const TabIcon = ({ name, focused }: { name: string; focused: boolean }) => {
    const tint = focused ? COLORS.primary : COLORS.GREY[400];

    return (
        <View style={styles.iconContainer}>
            <CustomIcon
                provider="Ionicons"
                name={name as any}
                size={22}
                color={tint}
            />
        </View>
    );
};

const BottomTabs = () => {
    const insets = useSafeAreaInsets();

    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: COLORS.primary,
                tabBarInactiveTintColor: COLORS.GREY[400],
                tabBarLabelStyle: {
                    fontSize: 11,
                    marginBottom: 6,
                },
                tabBarStyle: {
                    position: "absolute",
                    left: 16,
                    right: 16,
                    bottom: 0,
                    height: 72 + insets.bottom,
                    backgroundColor: COLORS.WHITE,
                    borderTopWidth: 0,
                    paddingTop: 12,
                    paddingBottom: 8,
                    // shadow
                    shadowColor: COLORS.TEXT.DARK,
                    shadowOffset: { width: 0, height: 8 },
                    shadowOpacity: 0.2,
                    shadowRadius: 16,
                    elevation: 6,
                },
                tabBarButton: props => (
                    <TouchableOpacity
                        {...(props as TouchableOpacityProps)}
                        activeOpacity={0.7}
                    />
                ),
            }}
        >
            <Tab.Screen
                name="Home"
                component={Home}
                options={{
                    tabBarLabel: "Home",
                    tabBarIcon: ({ focused }) => (
                        <TabIcon name="home" focused={focused} />
                    ),
                }}
            />
            <Tab.Screen
                name="Products"
                component={AllProducts}
                options={{
                    tabBarLabel: "Products",
                    tabBarIcon: ({ focused }) => (
                        <TabIcon name="cart" focused={focused} />
                    ),
                }}
            />
            <Tab.Screen
                name="Explore"
                component={Explore}
                options={{
                    tabBarLabel: "Explore",
                    tabBarIcon: ({ focused }) => (
                        <TabIcon name="compass" focused={focused} />
                    ),
                }}
            />
            <Tab.Screen
                name="Account"
                component={Account}
                options={{
                    tabBarLabel: "Account",
                    tabBarIcon: ({ focused }) => (
                        <TabIcon name="person" focused={focused} />
                    ),
                }}
            />
        </Tab.Navigator>
    );
};

const styles = StyleSheet.create({
    iconContainer: {
        alignItems: "center",
        justifyContent: "center",
    },
    topIndicator: {
        position: "absolute",
        top: 0,
        width: 20,
        height: 10,
        borderBottomLeftRadius: 9,
        borderBottomRightRadius: 9,
        zIndex: -10,
        backgroundColor: COLORS.primary,
    },
});

export default BottomTabs;
