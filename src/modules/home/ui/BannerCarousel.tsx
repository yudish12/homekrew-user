import React, { useEffect, useRef, useState, useCallback } from "react";
import {
    View,
    Image,
    StyleSheet,
    FlatList,
    Dimensions,
    TouchableOpacity,
    ViewStyle,
    ImageSourcePropType,
} from "react-native";
import { COLORS } from "../../../constants/ui";
import { Typography } from "../../../components/Typography";
import { Banner } from "../../../types/home-data";
import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get("window");

export interface BannerItem {
    id: string;
    imageUrl?: ImageSourcePropType;
    title?: string;
    subtitle?: string;
    ctaText?: string;
    onPress?: () => void;
}

interface BannerCarouselProps {
    data: Banner[];
    style?: ViewStyle;
    autoplayIntervalMs?: number;
}

const ITEM_SPACING = 14;
const SIDE_PADDING = 16;
const CARD_WIDTH = width - 32;

const BannerCarousel: React.FC<BannerCarouselProps> = ({
    data,
    style,
    autoplayIntervalMs = 3500,
}) => {
    const [index, setIndex] = useState(0);
    const flatListRef = useRef<FlatList>(null);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const isScrollingRef = useRef(false);

    // Clear existing timer
    const clearTimer = useCallback(() => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
    }, []);

    // Start autoplay timer
    const startTimer = useCallback(() => {
        if (!data?.length || data.length <= 1) return;

        clearTimer();
        timerRef.current = setInterval(() => {
            if (!isScrollingRef.current) {
                setIndex(prevIndex => {
                    const nextIndex = (prevIndex + 1) % data.length;
                    flatListRef.current?.scrollToIndex({
                        index: nextIndex,
                        animated: true,
                        viewPosition: 0.5,
                    });
                    return nextIndex;
                });
            }
        }, autoplayIntervalMs);
    }, [data?.length, autoplayIntervalMs, clearTimer]);

    // Handle viewable items change
    const onViewableItemsChanged = useCallback(({ viewableItems }: any) => {
        if (viewableItems?.length > 0 && viewableItems[0].index !== null) {
            const currentIndex = viewableItems[0].index;
            setIndex(currentIndex);
        }
    }, []);

    // Handle scroll begin - pause autoplay
    const onScrollBeginDrag = useCallback(() => {
        isScrollingRef.current = true;
        clearTimer();
    }, [clearTimer]);

    // Handle scroll end - resume autoplay
    const onScrollEndDrag = useCallback(() => {
        isScrollingRef.current = false;
        // Resume timer after a short delay to allow scroll to settle
        setTimeout(() => {
            if (!isScrollingRef.current) {
                startTimer();
            }
        }, 100);
    }, [startTimer]);

    // Handle momentum scroll end
    const onMomentumScrollEnd = useCallback(() => {
        isScrollingRef.current = false;
        startTimer();
    }, [startTimer]);

    // Start timer on mount and when data changes
    useEffect(() => {
        startTimer();
        return () => clearTimer();
    }, [startTimer, clearTimer]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            clearTimer();
        };
    }, [clearTimer]);

    const navigation = useNavigation<any>();

    // Viewability config
    const viewConfigRef = useRef({
        viewAreaCoveragePercentThreshold: 50,
        minimumViewTime: 100,
        waitForInteraction: false,
    });

    const renderItem = ({
        item,
        index: itemIndex,
    }: {
        item: Banner;
        index: number;
    }) => (
        <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => {
                const destinations = item.destination.split("/");
                const destinationLength = destinations.length;
                if (destinationLength === 1) {
                    navigation.navigate(destinations[0]);
                } else if (destinationLength === 2) {
                    navigation.navigate("Services", {
                        screen: "ServiceLanding",
                        params: {
                            serviceName: destinations[0],
                            serviceId: destinations[1],
                        },
                    });
                }
            }}
            style={[
                styles.bannerCard,
                {
                    marginLeft: itemIndex === 0 ? SIDE_PADDING : ITEM_SPACING,
                    marginRight:
                        itemIndex === data.length - 1 ? SIDE_PADDING : 0,
                },
            ]}
        >
            <Image
                source={{ uri: item.imageUrl }}
                style={styles.bannerImage}
                resizeMode="cover"
            />
            {item.title || item.subtitle || item.clickAction.type ? (
                <View style={styles.bannerContent}>
                    {item.title ? (
                        <Typography
                            variant="h4"
                            color={COLORS.WHITE}
                            style={{
                                marginBottom: 8,
                            }}
                        >
                            {item.title}
                        </Typography>
                    ) : null}
                    {item.subtitle ? (
                        <Typography
                            variant="body"
                            color={COLORS.WHITE}
                            style={{ opacity: 0.9, marginBottom: 8 }}
                        >
                            {item.subtitle}
                        </Typography>
                    ) : null}
                    <View style={styles.ctaPill}>
                        <Typography
                            variant="bodySmall"
                            color={COLORS.TEXT.DARK}
                        >
                            Book Now
                        </Typography>
                    </View>
                </View>
            ) : null}
        </TouchableOpacity>
    );

    // Handle dot press
    const onDotPress = useCallback(
        (dotIndex: number) => {
            if (dotIndex !== index) {
                clearTimer();
                isScrollingRef.current = true;
                setIndex(dotIndex);
                flatListRef.current?.scrollToIndex({
                    index: dotIndex,
                    animated: true,
                    viewPosition: 0.5,
                });

                // Resume autoplay after navigation
                setTimeout(() => {
                    isScrollingRef.current = false;
                    startTimer();
                }, 500);
            }
        },
        [index, clearTimer, startTimer],
    );

    if (!data?.length) return null;

    return (
        <View style={[styles.container, style]}>
            <FlatList
                ref={flatListRef}
                data={data}
                keyExtractor={item => item._id}
                renderItem={renderItem}
                horizontal
                showsHorizontalScrollIndicator={false}
                onViewableItemsChanged={onViewableItemsChanged}
                viewabilityConfig={viewConfigRef.current}
                snapToInterval={CARD_WIDTH + ITEM_SPACING}
                snapToAlignment="center"
                decelerationRate="fast"
                onScrollBeginDrag={onScrollBeginDrag}
                onScrollEndDrag={onScrollEndDrag}
                onMomentumScrollEnd={onMomentumScrollEnd}
                style={{ marginTop: 12 }}
            />
            <View style={styles.dotsRow}>
                {data.map((_, i) => (
                    <TouchableOpacity
                        key={i}
                        onPress={() => onDotPress(i)}
                        style={[
                            styles.dot,
                            i === index ? styles.dotActive : null,
                        ]}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    />
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: "100%",
    },
    itemContainer: {
        width: width,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 16,
    },
    bannerCard: {
        width: CARD_WIDTH,
        height: 180,
        borderRadius: 18,
        overflow: "hidden",
        backgroundColor: COLORS.GREY[200],
        shadowColor: COLORS.TEXT.DARK,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 3,
    },
    bannerImage: {
        width: "100%",
        height: "100%",
        objectFit: "cover",
    },
    bannerContent: {
        position: "absolute",
        left: 16,
        bottom: 14,
        right: 16,
    },
    ctaPill: {
        alignSelf: "flex-start",
        backgroundColor: "#FFD54F",
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderRadius: 16,
    },
    dotsRow: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 10,
        gap: 8,
    },
    dot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: COLORS.GREY[200],
    },
    dotActive: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: COLORS.primary,
    },
});

export default BannerCarousel;
