import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View, StyleSheet } from "react-native";
import Home from "./screens/Home";
import Services from "./screens/Services";
import { COLORS } from "../../constants/ui";
import { CustomIcon } from "../../components/CustomIcon";
import Account from "./screens/Account";

const Tab = createBottomTabNavigator();

const TabIcon = ({ name, focused }: { name: string; focused: boolean }) => {
    const tint = focused ? COLORS.primary : COLORS.GREY[400];

    return (
        <View style={styles.iconContainer}>
            {focused && (
                <View
                    pointerEvents="none"
                    style={[styles.topIndicator, { top: -20 }]}
                />
            )}
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
                    height: 72,
                    backgroundColor: COLORS.WHITE,
                    borderTopWidth: 0,
                    borderRadius: 20,
                    paddingTop: 12,
                    paddingBottom: 8,
                    // shadow
                    shadowColor: COLORS.TEXT.DARK,
                    shadowOffset: { width: 0, height: 8 },
                    shadowOpacity: 0.2,
                    shadowRadius: 16,
                    elevation: 6,
                },
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
                name="Explore"
                component={Services}
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
