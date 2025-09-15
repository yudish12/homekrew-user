import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet, View, FlatList, Dimensions } from "react-native";
import { SafeAreaView } from "../../../components/SafeAreaView";
import Header from "../../../components/header";
import ServiceCard from "../../../modules/service-flow/ui/ServiceCard";
import { COLORS } from "../../../constants/ui";
import { useNavigation, useRoute } from "@react-navigation/native";
import SearchBar from "../../../components/SearchBar";
import { ServiceCategoryUtil } from "../../../services";
import { ServiceTemplate } from "../../../types/home-data";
import SkeletonLoader from "../../../components/SkeletonLoader";
import { BackButton } from "../../../components/BackButton";

const ServiceDetails = () => {
    const [selectedService, setSelectedService] = useState("5"); // Floor Cleaning is selected
    const navigation = useNavigation<any>();
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const [serviceTemplates, setServiceTemplates] = useState<ServiceTemplate[]>(
        [],
    );

    const { serviceId, serviceName } = useRoute().params as {
        serviceId: string;
        serviceName: string;
    };

    const handleServicePress = (templateId: string) => {
        setSelectedService(templateId);
        // Navigate to service template with service ID
        navigation.navigate("ServiceTemplate", {
            serviceTemplateId: templateId,
            serviceId,
        });
    };

    const handleAddPress = (templateId: string) => {
        // Navigate to service template with service ID
        navigation.navigate("ServiceTemplate", {
            serviceTemplateId: templateId,
            serviceId,
        });
    };

    const fetchServiceTemplates = useCallback(async () => {
        setLoading(true);
        const response = await ServiceCategoryUtil.getServiceTemplates(
            serviceId,
        );
        setServiceTemplates(response?.data ?? []);
        setLoading(false);
    }, [serviceId]);

    useEffect(() => {
        fetchServiceTemplates();
    }, [fetchServiceTemplates]);

    const renderServiceCard = ({ item }: { item: ServiceTemplate }) => (
        <ServiceCard
            title={item.title}
            provider={item.description}
            originalPrice={item.formattedPrice}
            image={item.primaryImage}
            buttonText="Start"
            buttonIconName="calendar-outline"
            onPress={() => handleServicePress(item._id)}
            onAddPress={() => handleAddPress(item._id)}
        />
    );

    return (
        <SafeAreaView style={styles.container}>
            <View
                style={{
                    justifyContent: "center",
                    paddingHorizontal: 20,
                    alignItems: "center",

                    backgroundColor: "transparent",
                }}
            >
                <Header
                    title={serviceName}
                    backButton={false}
                    style={styles.header}
                />
                <BackButton onPress={() => navigation.goBack()} />
            </View>

            <View style={styles.searchContainer}>
                <SearchBar
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    placeholder="Example: Milk Powder"
                    containerStyle={styles.searchBar}
                    inputStyle={{ fontSize: 15 }}
                />
            </View>
            {loading ? (
                <SkeletonLoader
                    layout={[
                        {
                            width: Dimensions.get("window").width - 40,
                            height: 100,
                            borderRadius: 12,
                        },
                        {
                            width: Dimensions.get("window").width - 40,
                            height: 100,
                            borderRadius: 12,
                        },
                        {
                            width: Dimensions.get("window").width - 40,
                            height: 100,
                            borderRadius: 12,
                        },
                    ]}
                    itemContainerStyle={styles.servicesList}
                    pulseDurationMs={1000}
                />
            ) : (
                <FlatList
                    data={serviceTemplates}
                    renderItem={renderServiceCard}
                    keyExtractor={item => item._id}
                    contentContainerStyle={styles.servicesList}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </SafeAreaView>
    );
};

export default ServiceDetails;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
    },
    searchBar: {
        flex: 1,
        marginTop: 16,
    },
    header: {
        backgroundColor: COLORS.WHITE,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.GREY[100],
        shadowOpacity: 0,
        shadowOffset: { width: 0, height: 0 },
        shadowRadius: 0,
        shadowColor: "transparent",
    },
    searchContainer: {
        flexDirection: "row",
        justifyContent: "flex-end",
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: COLORS.WHITE,
    },
    searchButton: {
        padding: 8,
    },
    servicesList: {
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 20,
    },
});
