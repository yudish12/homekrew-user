import { useCallback, useEffect, useState } from "react";
import {
    StyleSheet,
    View,
    ScrollView,
    TouchableOpacity,
    FlatList,
    ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "../../../components/SafeAreaView";
import { BackButton } from "../../../components/BackButton";
import SearchBar from "../../../components/SearchBar";
import { Typography } from "../../../components/Typography";
import { CustomIcon } from "../../../components/CustomIcon";
import ServiceCard from "../../../modules/service-flow/ui/ServiceCard";
import { COLORS } from "../../../constants/ui";
import { useNavigation } from "@react-navigation/native";
import { ServiceCategoryUtil } from "../../../services";
import { ServiceChildCategory } from "../../../types/home-data";

const AllServices = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [filterCategories, setFilterCategories] =
        useState<{ label: string; value: string }[]>();
    const [selectedFilter, setSelectedFilter] = useState<{
        label: string;
        value: string;
    }>();
    const [showFilter, setShowFilter] = useState(true);

    const [allChildCategories, setAllChildCategories] = useState<
        (ServiceChildCategory & { parentId: string })[]
    >([]);

    const [filteredChildCategories, setFilteredChildCategories] = useState<
        (ServiceChildCategory & { parentId: string })[]
    >([]);

    const navigation = useNavigation<any>();

    const fetchServicesAndCategories = useCallback(async () => {
        setLoading(true);
        const response = await ServiceCategoryUtil.getCategories(1);

        let tempChildCategories: (ServiceChildCategory & {
            parentId: string;
        })[] = [];
        response.data?.forEach(category => {
            tempChildCategories = tempChildCategories.concat(
                category.childCategories.map(childCategory => ({
                    ...childCategory,
                    parentId: category._id,
                })),
            );
        });

        const filters =
            response.data?.map(category => ({
                label: category.name,
                value: category._id,
            })) || [];

        setAllChildCategories(tempChildCategories);
        setFilterCategories(filters);

        // pick first category by default
        if (filters.length > 0) {
            setSelectedFilter(filters[0]);
        }

        setLoading(false);
    }, []);

    useEffect(() => {
        fetchServicesAndCategories();
    }, [fetchServicesAndCategories]);

    useEffect(() => {
        let temp = allChildCategories;

        if (selectedFilter) {
            temp = temp.filter(cat => cat.parentId === selectedFilter.value);
        }

        if (searchQuery.trim().length > 0) {
            const query = searchQuery.toLowerCase();
            temp = temp.filter(
                cat =>
                    cat.name.toLowerCase().includes(query) ||
                    cat.description?.toLowerCase().includes(query),
            );
        }

        setFilteredChildCategories(temp);
    }, [selectedFilter, allChildCategories, searchQuery]);

    const handleServicePress = (serviceId: string, serviceName: string) => {
        // Navigate to service details
        navigation.navigate("ServiceDetails", { serviceId, serviceName });
    };

    const handleAddPress = (serviceId: string, serviceName: string) => {
        // Add to cart logic
        navigation.navigate("ServiceDetails", { serviceId, serviceName });
    };

    const renderServiceCard = ({
        item,
    }: {
        item: ServiceChildCategory & { parentId: string };
    }) => (
        <ServiceCard
            title={item.name}
            provider={item.description}
            image={item.image}
            onPress={() => handleServicePress(item.parentId, item.name)}
            onAddPress={() => handleAddPress(item.parentId, item.name)}
        />
    );

    const renderFilterButton = (filter: { label: string; value: string }) => {
        const isSelected = selectedFilter?.value === filter.value;
        return (
            <TouchableOpacity
                key={filter.value}
                style={[
                    styles.filterButton,
                    isSelected && styles.filterButtonSelected,
                ]}
                onPress={() => setSelectedFilter(filter)}
                activeOpacity={0.8}
            >
                <Typography
                    variant="button"
                    color={isSelected ? COLORS.WHITE : COLORS.GREY[500]}
                    style={[
                        styles.filterButtonText,
                        isSelected && styles.filterButtonTextSelected,
                    ]}
                >
                    {filter.label}
                </Typography>
            </TouchableOpacity>
        );
    };

    if (loading)
        return (
            <View
                style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        );

    return (
        <SafeAreaView style={styles.container}>
            <BackButton
                onPress={() => navigation.goBack()}
                backButtonStyle={styles.backButton}
            />
            <View style={styles.header}>
                <SearchBar
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    placeholder="Example: Milk Powder"
                    containerStyle={styles.searchBar}
                />
            </View>

            <View style={styles.titleSection}>
                <Typography
                    variant="h3"
                    color={COLORS.TEXT.DARK}
                    style={styles.title}
                >
                    Search Result's
                </Typography>
                <TouchableOpacity
                    onPress={() => setShowFilter(!showFilter)}
                    style={styles.filterIcon}
                    activeOpacity={0.7}
                >
                    <CustomIcon
                        provider="MaterialIcons"
                        name={!showFilter ? "filter-list" : "filter-list-off"}
                        size={28}
                        color={COLORS.GREY[500]}
                    />
                </TouchableOpacity>
            </View>

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={[
                    styles.filtersContainer,
                    {
                        display: showFilter ? "flex" : "none",
                    },
                ]}
                contentContainerStyle={styles.filtersContent}
            >
                {filterCategories?.map(renderFilterButton)}
            </ScrollView>

            <FlatList
                data={filteredChildCategories}
                renderItem={renderServiceCard}
                ListEmptyComponent={
                    <View style={styles.emptyList}>
                        <Typography
                            variant="h3"
                            color={COLORS.TEXT.DARK}
                            style={styles.emptyListText}
                        >
                            No results found
                            <CustomIcon
                                provider="MaterialIcons"
                                name="search"
                                size={24}
                                style={{ marginLeft: 20, marginTop: 8 }}
                                color={COLORS.TEXT.DARK}
                            />
                        </Typography>
                        <Typography
                            variant="h3"
                            color={COLORS.TEXT.DARK}
                            style={styles.emptyListText}
                        >
                            Try another filter
                        </Typography>
                    </View>
                }
                keyExtractor={item => item._id}
                contentContainerStyle={styles.servicesList}
                showsVerticalScrollIndicator={false}
            />
        </SafeAreaView>
    );
};

export default AllServices;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.WHITE,
        borderWidth: 2,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingTop: 8,
        paddingBottom: 16,
        gap: 12,
    },
    backButton: {
        position: "relative",
        top: 0,
        left: 0,
    },
    searchBar: {
        flex: 1,
        marginTop: 0,
    },
    emptyList: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 16,
    },
    emptyListText: {
        fontSize: 16,
        fontWeight: "500",
        marginTop: 8,
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        flexDirection: "column",
    },
    titleSection: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        marginBottom: 16,
    },
    title: {
        fontWeight: "700",
    },
    filterIcon: {
        padding: 4,
    },
    filtersContainer: {
        marginBottom: 20,
        maxHeight: 80,
    },
    filtersContent: {
        paddingHorizontal: 16,
        gap: 12,
    },
    filterButton: {
        paddingHorizontal: 16,
        paddingVertical: 6,
        height: 40,
        marginBottom: 30,
        borderRadius: 8,
        backgroundColor: COLORS.GREY[100],
        borderWidth: 1,
        borderColor: COLORS.GREY[200],
    },
    filterButtonSelected: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
    },
    filterButtonText: {
        fontSize: 14,
        fontWeight: "500",
    },
    filterButtonTextSelected: {
        color: COLORS.WHITE,
    },
    servicesList: {
        paddingHorizontal: 16,
        paddingBottom: 20,
    },
});
