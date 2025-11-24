import { Pressable, View } from "react-native";
import { CustomIcon } from "../../components/CustomIcon";
import { useState } from "react";
import { COLORS } from "../../constants/ui";
import { Input } from "../../components/Input";
import { Button } from "../../components/Button";

export const RatingUI = ({
    rating,
    setRating,
    review,
    setReview,
    onSubmit = () => {},
    showCta = true,
}: {
    rating: number;
    review: string;
    setRating: React.Dispatch<React.SetStateAction<number>>;
    setReview: React.Dispatch<React.SetStateAction<string>>;
    onSubmit?: () => void;
    showCta?: boolean;
}) => {
    return (
        <View style={{ gap: 10 }}>
            <View
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 4,
                    marginTop: 10,
                    marginBottom: 6,
                    alignSelf: "center",
                }}
            >
                {Array.from({ length: 5 }).map((_, index) => (
                    <Pressable onPress={() => setRating(index + 1)}>
                        <CustomIcon
                            provider="Ionicons"
                            name="star"
                            size={24}
                            color={
                                rating >= index + 1
                                    ? COLORS.GOLD[500]
                                    : COLORS.GREY[200]
                            }
                        />
                    </Pressable>
                ))}
            </View>
            <Input
                placeholder="Write a review"
                value={review}
                onChangeText={setReview}
                multiline={true}
                inputStyle={{ minHeight: 100 }}
                numberOfLines={4}
            />
            {showCta && (
                <Button
                    disabled={rating === 0}
                    title={
                        rating === 0 ? "Please provide a feedback" : "Submit"
                    }
                    onPress={onSubmit}
                    style={{ marginTop: 10 }}
                />
            )}
        </View>
    );
};
