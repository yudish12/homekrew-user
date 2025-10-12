import React, { useState, useEffect, useCallback } from "react";
import {
    View,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    TextInput,
    Image,
    Dimensions,
    RefreshControl,
    Keyboard,
    ScrollView,
    ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "../../../components/SafeAreaView";
import { H3, Body, Caption, H4 } from "../../../components/Typography";
import { COLORS } from "../../../constants/ui";
import { Button, LinkButton } from "../../../components/Button";
import { CustomIcon } from "../../../components/CustomIcon";
import Header from "../../../components/header";
import { useNavigation } from "@react-navigation/native";
import { ServiceCategory } from "../../../types/home-data";
import { UtilityServices } from "../../../services/utility-services";
import { ServiceCategoryUtil } from "../../../services/serviceCategories";
import { useDebounce } from "../../../hooks/useDebounce";
import uiUtils from "../../../utils/ui";

const { width } = Dimensions.get("window");

const SearchBar: React.FC<{
    value: string;
    onChangeText: (text: string) => void;
    placeholder?: string;
}> = ({ value, onChangeText, placeholder = "Search for services..." }) => {
    return (
        <View style={styles.searchBarContainer}>
            <View style={styles.searchBar}>
                <CustomIcon
                    provider="Ionicons"
                    name="search"
                    size={20}
                    color={COLORS.GREY[400]}
                />
                <TextInput
                    style={styles.searchInput}
                    placeholder={placeholder}
                    placeholderTextColor={COLORS.GREY[400]}
                    value={value}
                    onChangeText={onChangeText}
                    returnKeyType="search"
                    autoFocus
                />
                {value.length > 0 && (
                    <TouchableOpacity onPress={() => onChangeText("")}>
                        <CustomIcon
                            provider="Ionicons"
                            name="close-circle"
                            size={20}
                            color={COLORS.GREY[400]}
                        />
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

const PopularServiceCard: React.FC<{
    service: ServiceCategory;
    onPress: () => void;
}> = ({ service, onPress }) => {
    return (
        <TouchableOpacity style={styles.popularServiceCard} onPress={onPress}>
            <View style={styles.popularServiceImage}>
                {service.image ? (
                    <Image
                        source={{ uri: service.image }}
                        style={styles.popularServiceImage}
                        resizeMode="cover"
                    />
                ) : (
                    <View
                        style={[
                            styles.popularServiceImage,
                            styles.placeholderImage,
                        ]}
                    >
                        <CustomIcon
                            provider="Ionicons"
                            name="construct"
                            size={24}
                            color={COLORS.GREY[400]}
                        />
                    </View>
                )}
            </View>
            <Caption
                style={styles.popularServiceTitle}
                numberOfLines={2}
                color={COLORS.TEXT.DARK}
            >
                {service.name}
            </Caption>
        </TouchableOpacity>
    );
};

const SearchResultCard: React.FC<{
    service: ServiceCategory;
    onPress: () => void;
}> = ({ service, onPress }) => {
    return (
        <TouchableOpacity style={styles.searchResultCard} onPress={onPress}>
            <View style={styles.searchResultImage}>
                {service.image ? (
                    <Image
                        source={{ uri: service.image }}
                        style={styles.searchResultImage}
                        resizeMode="cover"
                    />
                ) : (
                    <View
                        style={[
                            styles.searchResultImage,
                            styles.placeholderImage,
                        ]}
                    >
                        <CustomIcon
                            provider="Ionicons"
                            name="construct"
                            size={32}
                            color={COLORS.GREY[400]}
                        />
                    </View>
                )}
            </View>
            <View style={styles.searchResultContent}>
                <H4 style={{ color: COLORS.TEXT.DARK }} numberOfLines={1}>
                    {service.name}
                </H4>
                <Caption
                    color={COLORS.GREY[500]}
                    numberOfLines={2}
                    style={{ marginTop: 4 }}
                >
                    {service.description}
                </Caption>
                <View style={styles.searchResultMeta}>
                    <View style={styles.categoryTag}>
                        <Caption
                            style={{ color: COLORS.primary, fontSize: 11 }}
                        >
                            {service.level === 1 ? "Category" : "Service"}
                        </Caption>
                    </View>
                </View>
            </View>
            <CustomIcon
                provider="Ionicons"
                name="chevron-forward"
                size={16}
                color={COLORS.GREY[400]}
            />
        </TouchableOpacity>
    );
};

const EmptySearchState: React.FC = () => {
    return (
        <View style={styles.emptyState}>
            <View style={styles.emptyStateIcon}>
                <CustomIcon
                    provider="Ionicons"
                    name="search"
                    size={48}
                    color={COLORS.GREY[400]}
                />
            </View>
            <H4
                style={{
                    color: COLORS.GREY[500],
                    textAlign: "center",
                    marginTop: 16,
                }}
            >
                No results found
            </H4>
            <Caption
                style={{
                    color: COLORS.GREY[400],
                    textAlign: "center",
                    marginTop: 8,
                }}
            >
                Try searching for something else
            </Caption>
        </View>
    );
};

const InitialState: React.FC<{
    popularServices: ServiceCategory[];
    onServicePress: (service: ServiceCategory) => void;
    suggestionPress: (suggestion: string) => void;
}> = ({ popularServices, onServicePress, suggestionPress }) => {
    return (
        <ScrollView
            onScroll={() => Keyboard.dismiss()}
            style={styles.initialState}
        >
            <View style={styles.welcomeSection}>
                <View style={styles.welcomeIcon}>
                    <CustomIcon
                        provider="Ionicons"
                        name="sparkles"
                        size={32}
                        color={COLORS.primary}
                    />
                </View>
                <H3
                    style={{
                        color: COLORS.TEXT.DARK,
                        textAlign: "center",
                        marginTop: 16,
                    }}
                >
                    Discover Amazing Services
                </H3>
                <Caption
                    style={{
                        color: COLORS.GREY[500],
                        textAlign: "center",
                        marginTop: 8,
                    }}
                >
                    Find the perfect service for your home and lifestyle
                </Caption>
            </View>

            {popularServices.length > 0 && (
                <View style={styles.popularSection}>
                    <View style={styles.sectionHeader}>
                        <H4 style={{ color: COLORS.TEXT.DARK }}>
                            Popular Services
                        </H4>
                        <Caption color={COLORS.GREY[500]}>
                            Explore trending services
                        </Caption>
                    </View>
                    <FlatList
                        data={popularServices.slice(0, 6)}
                        renderItem={({ item }) => (
                            <PopularServiceCard
                                service={item}
                                onPress={() => onServicePress(item)}
                            />
                        )}
                        keyExtractor={item => item._id}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.popularServicesList}
                    />
                </View>
            )}

            <View style={styles.suggestionsSection}>
                <H4 style={{ color: COLORS.TEXT.DARK, marginBottom: 12 }}>
                    What can we help you find?
                </H4>
                <View style={styles.suggestionChips}>
                    {[
                        "AC Repair",
                        "Plumbing",
                        "Cleaning",
                        "Electrician",
                        "Painting",
                        "Carpenter",
                    ].map((suggestion, index) => (
                        <LinkButton
                            onPress={() => suggestionPress(suggestion)}
                            key={index}
                            title={suggestion}
                        />
                    ))}
                </View>
            </View>
        </ScrollView>
    );
};

const SearchScreen: React.FC = () => {
    const navigation = useNavigation<any>();
    const [query, setQuery] = useState("");
    const [searchResults, setSearchResults] = useState<ServiceCategory[]>([]);
    const [popularServices, setPopularServices] = useState<ServiceCategory[]>(
        [],
    );
    const [isSearching, setIsSearching] = useState(false);
    const [isLoadingPopular, setIsLoadingPopular] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const debouncedQuery = useDebounce(query, 500);

    const fetchPopularServices = useCallback(async () => {
        try {
            setIsLoadingPopular(true);
            const response = await ServiceCategoryUtil.getCategories(
                1,
                undefined,
                1,
                10,
            );
            if (response.success && response.data) {
                setPopularServices(response.data);
            }
        } catch (error) {
            console.error("Error fetching popular services:", error);
        } finally {
            setIsLoadingPopular(false);
        }
    }, []);

    const fetchSearchResults = useCallback(async () => {
        if (!debouncedQuery || debouncedQuery.length < 2) {
            setSearchResults([]);
            return;
        }

        try {
            setIsSearching(true);
            const response = await UtilityServices.getSearchResults(
                debouncedQuery,
            );
            if (response.success && response.data) {
                setSearchResults(response.data);
            } else {
                setSearchResults([]);
            }
        } catch (error) {
            console.error("Error fetching search results:", error);
            setSearchResults([]);
        } finally {
            setIsSearching(false);
        }
    }, [debouncedQuery]);

    const handleRefresh = async () => {
        setRefreshing(true);
        await fetchPopularServices();
        setRefreshing(false);
    };

    const handleServicePress = (service: ServiceCategory) => {
        navigation.navigate("Services", {
            screen: "ServiceDetails",
            params: {
                serviceId: service._id,
                serviceName: service.name,
            },
        });
    };

    const handleSearchResultPress = (service: ServiceCategory) => {
        navigation.navigate("Services", {
            screen: "ServiceDetails",
            params: {
                serviceId: service._id,
                serviceName: service.name,
            },
        });
    };

    useEffect(() => {
        fetchPopularServices();
    }, [fetchPopularServices]);

    useEffect(() => {
        fetchSearchResults();
    }, [fetchSearchResults]);

    const renderSearchResult = ({ item }: { item: ServiceCategory }) => (
        <SearchResultCard
            service={item}
            onPress={() => handleSearchResultPress(item)}
        />
    );

    const showInitialState = !query || query.length < 2;
    const showEmptyState =
        query.length >= 2 && searchResults.length === 0 && !isSearching;

    return (
        <SafeAreaView>
            <Header
                backHandler={() => navigation.goBack()}
                backButton={true}
                title="Search Services"
            />

            <View style={styles.container}>
                <SearchBar
                    value={query}
                    onChangeText={setQuery}
                    placeholder="Search for services..."
                />

                <View style={styles.content}>
                    {showInitialState ? (
                        <InitialState
                            suggestionPress={(suggestion: string) =>
                                setQuery(suggestion)
                            }
                            popularServices={popularServices}
                            onServicePress={handleServicePress}
                        />
                    ) : isSearching ? (
                        <View style={styles.loadingState}>
                            <ActivityIndicator
                                size="large"
                                color={COLORS.primary}
                            />
                            <Body
                                style={{
                                    color: COLORS.GREY[500],
                                    marginTop: 12,
                                    textAlign: "center",
                                }}
                            >
                                Searching for services...
                            </Body>
                        </View>
                    ) : (
                        <FlatList
                            data={searchResults}
                            renderItem={renderSearchResult}
                            keyExtractor={item => item._id}
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={styles.searchResultsList}
                            refreshControl={
                                <RefreshControl
                                    refreshing={refreshing}
                                    onRefresh={handleRefresh}
                                    colors={[COLORS.primary]}
                                    tintColor={COLORS.primary}
                                />
                            }
                            onScroll={() => Keyboard.dismiss()}
                            ListEmptyComponent={
                                showEmptyState ? <EmptySearchState /> : null
                            }
                        />
                    )}
                </View>
            </View>
        </SafeAreaView>
    );
};

export default SearchScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.WHITE,
    },
    loadingState: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 32,
    },
    searchBarContainer: {
        paddingHorizontal: 16,
        paddingVertical: 16,
        backgroundColor: COLORS.WHITE,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border.light,
    },
    searchBar: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: COLORS.GREY[100],
        opacity: 0.6,
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 4,
        borderWidth: 1,
        borderColor: COLORS.border.light,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: COLORS.TEXT.DARK,
        marginLeft: 12,
        marginRight: 8,
    },
    content: {
        flex: 1,
        paddingHorizontal: uiUtils.spacing.getHorizontalPadding(),
    },
    initialState: {
        flex: 1,
        paddingTop: 24,
    },
    welcomeSection: {
        alignItems: "center",
        marginBottom: 32,
    },
    welcomeIcon: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: uiUtils.color.addAlpha(COLORS.primary, 0.1),
        justifyContent: "center",
        alignItems: "center",
    },
    popularSection: {
        marginBottom: 32,
    },
    sectionHeader: {
        marginBottom: 16,
    },
    popularServicesList: {
        paddingRight: 16,
    },
    popularServiceCard: {
        width: 100,
        marginRight: 16,
        alignItems: "center",
    },
    popularServiceImage: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: COLORS.GREY[100],
    },
    placeholderImage: {
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: COLORS.GREY[100],
    },
    popularServiceTitle: {
        marginTop: 8,
        textAlign: "center",
        fontSize: 12,
    },
    suggestionsSection: {
        marginBottom: 24,
    },
    suggestionChips: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
    },
    suggestionChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: uiUtils.color.addAlpha(COLORS.primary, 0.1),
        borderRadius: 20,
        borderWidth: 1,
        borderColor: uiUtils.color.addAlpha(COLORS.primary, 0.2),
    },
    searchResultsList: {
        paddingTop: 16,
        paddingBottom: 24,
    },
    searchResultCard: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: COLORS.WHITE,
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: COLORS.border.light,
        shadowColor: COLORS.TEXT.DARK,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
        elevation: 1,
    },
    searchResultImage: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: COLORS.GREY[100],
    },
    searchResultContent: {
        flex: 1,
        marginLeft: 12,
        marginRight: 8,
    },
    searchResultMeta: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 8,
    },
    categoryTag: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        backgroundColor: uiUtils.color.addAlpha(COLORS.primary, 0.1),
        borderRadius: 8,
    },
    emptyState: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 32,
    },
    emptyStateIcon: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: COLORS.GREY[100],
        justifyContent: "center",
        alignItems: "center",
    },
});
