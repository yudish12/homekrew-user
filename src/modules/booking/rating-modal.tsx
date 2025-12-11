import React from "react";
import { View, Image, StyleSheet, Pressable, Keyboard } from "react-native";
import Modal from "../../components/Modal";
import { RatingUI } from "./rating-ui";
import { H3, Body, H5, H4 } from "../../components/Typography";
import { Button, OutlineButton } from "../../components/Button";
import { COLORS } from "../../constants/ui";
import { shadowUtils, spacingUtils, borderRadiusUtils } from "../../utils/ui";

interface RatingModalProps {
    visible: boolean;
    onClose: () => void;
    onSubmit: (rating: number, review: string) => void;
    templateImage: string;
    templateName: string;
}

export const RatingModal: React.FC<RatingModalProps> = ({
    visible,
    onClose,
    onSubmit,
    templateImage,
    templateName,
}) => {
    const [rating, setRating] = React.useState<number>(0);
    const [review, setReview] = React.useState<string>("");

    const handleSubmit = () => {
        onSubmit(rating, review);
        setRating(0);
        setReview("");
    };

    const handleCancel = () => {
        setRating(0);
        setReview("");
        onClose();
    };

    return (
        <Modal visible={visible} onClose={handleCancel}>
            <Pressable
                onPress={() => Keyboard.dismiss()}
                style={styles.container}
            >
                <View style={styles.header}>
                    <H4
                        style={{ textAlign: "center" }}
                        color={COLORS.TEXT.DARK}
                    >
                        Rate Our Service
                    </H4>
                </View>

                <View style={styles.templateInfo}>
                    <Image
                        source={{ uri: templateImage }}
                        style={styles.templateImage}
                        resizeMode="cover"
                    />
                    <View style={styles.templateDetails}>
                        <Body color={COLORS.TEXT.DARK}>{templateName}</Body>
                    </View>
                </View>

                <View style={styles.ratingSection}>
                    <RatingUI
                        showCta={false}
                        rating={rating}
                        review={review}
                        setRating={setRating}
                        setReview={setReview}
                    />
                </View>

                <View style={styles.footer}>
                    <OutlineButton
                        title="Cancel"
                        onPress={handleCancel}
                        style={styles.cancelButton}
                    />
                    <Button
                        title="Submit"
                        onPress={handleSubmit}
                        style={styles.submitButton}
                        disabled={rating === 0}
                    />
                </View>
            </Pressable>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: COLORS.WHITE,
        borderRadius: borderRadiusUtils.lg,
        overflow: "hidden",
        maxWidth: 500,
        width: "100%",
    },
    header: {
        paddingHorizontal: spacingUtils.lg,
        paddingBottom: spacingUtils.md,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.GREY[200],
    },
    templateInfo: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: spacingUtils.lg,
        paddingVertical: spacingUtils.md,
        backgroundColor: COLORS.GREY[100],
    },
    templateImage: {
        width: 60,
        height: 60,
        borderRadius: borderRadiusUtils.md,
        backgroundColor: COLORS.GREY[200],
        ...shadowUtils.getShadow("small"),
    },
    templateDetails: {
        flex: 1,
        marginLeft: spacingUtils.md,
    },
    ratingSection: {
        paddingHorizontal: spacingUtils.lg,
        paddingVertical: spacingUtils.md,
    },
    footer: {
        flexDirection: "row",
        paddingHorizontal: spacingUtils.lg,
        paddingTop: spacingUtils.lg,
        borderTopWidth: 1,
        borderTopColor: COLORS.GREY[200],
        gap: spacingUtils.md,
    },
    cancelButton: {
        flex: 1,
    },
    submitButton: {
        flex: 1,
    },
});
