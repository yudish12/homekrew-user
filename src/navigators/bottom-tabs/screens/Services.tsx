import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { COLORS } from "../../../constants/ui";

const Services = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Services Screen</Text>
            <Text style={styles.subtitle}>Browse available services</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.WHITE,
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: COLORS.primary,
        marginBottom: 10,
        textAlign: "center",
    },
    subtitle: {
        fontSize: 16,
        color: COLORS.GREY[500],
        textAlign: "center",
    },
});

export default Services;
