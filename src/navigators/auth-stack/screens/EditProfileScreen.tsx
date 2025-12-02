import { useState, useEffect, useRef } from "react";
import {
    StyleSheet,
    View,
    ScrollView,
    TouchableOpacity,
    Image,
    Alert,
    Platform,
    KeyboardAvoidingView,
    Modal as RNModal,
    Dimensions,
    Pressable,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as MediaLibrary from "expo-media-library";
import { Video, ResizeMode, AVPlaybackStatus } from "expo-av";
import { SafeAreaView } from "../../../components/SafeAreaView";
import {
    NavigationProp,
    useNavigation,
    useRoute,
} from "@react-navigation/native";
import { BackButton } from "../../../components/BackButton";
import { Typography, H2, Body } from "../../../components/Typography";
import {
    PrimaryButton,
    OutlineButton,
    Button,
} from "../../../components/Button";
import { EmailInput, Input } from "../../../components/Input";
import { DatePicker } from "../../../components/DatePicker";
import Modal from "../../../components/Modal"; // Import your Modal component
import { COLORS, WEIGHTS } from "../../../constants/ui";
import { AuthServices } from "../../../services";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../types";
import { setUser } from "../../../redux/actions";
import { uiUtils } from "../../../utils";
import { User } from "../../../types/user";
import {
    getProfileVideoViewed,
    setProfileVideoViewed,
} from "../../../lib/storage/auth-storage";
import { CustomIcon } from "../../../components/CustomIcon";

interface ProfileFormData {
    firstName: string;
    lastName: string;
    middleName: string;
    userName?: string;
    phoneNumber: string;
    email: string;
    dob: string;
    avatar: string;
}

interface EditProfileParams {
    backEnabled: boolean;
    initialData?: ProfileFormData;
    isUserNameEditable?: boolean;
}

const EditProfileScreen = () => {
    const params = useRoute().params as EditProfileParams;
    const navigation = useNavigation<NavigationProp<any>>();

    const dispatch = useDispatch<AppDispatch>();

    const { user } = useSelector((state: RootState) => state.auth);
    // Form state
    const [formData, setFormData] = useState<ProfileFormData>({
        firstName: user?.firstName ?? "",
        lastName: user?.lastName ?? "",
        middleName: user?.middleName ?? "",
        userName: "",
        phoneNumber: user?.phoneNumber ?? "",
        email: user?.email ?? "",
        dob: user?.dob ?? "",
        avatar: user?.avatar ?? "",
    });

    const [formErrors, setFormErrors] = useState<Partial<ProfileFormData>>({});
    const [isLoading, setIsLoading] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(
        user?.dob ? new Date(user?.dob) : undefined,
    );
    const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState<
        boolean | null
    >(null);
    const [hasCameraPermission, setHasCameraPermission] = useState<
        boolean | null
    >(null);

    // Modal states
    const [showImageModal, setShowImageModal] = useState(false);
    const [selectedImage, setSelectedImage] = useState<{
        name: string;
        uri: string;
        type: string;
    }>();
    const [isUploadingImage, setIsUploadingImage] = useState(false);

    // Video modal states
    const [showVideoModal, setShowVideoModal] = useState(false);
    const videoRef = useRef<Video>(null);

    // Validation functions
    const validateForm = (): boolean => {
        const errors: Partial<ProfileFormData> = {};

        // Required field validation
        if (!formData.firstName.trim()) {
            errors.firstName = "First name is required";
        }

        if (!formData.lastName.trim()) {
            errors.lastName = "Last name is required";
        }

        if (params.isUserNameEditable && !formData?.userName?.trim()) {
            errors.userName = "Username is required";
        } else if (
            params.isUserNameEditable &&
            formData.userName &&
            formData?.userName?.length < 3
        ) {
            errors.userName = "Username must be at least 3 characters";
        } else if (
            params.isUserNameEditable &&
            !/^[a-zA-Z0-9_]+$/.test(formData?.userName ?? "")
        ) {
            errors.userName =
                "Username can only contain letters, numbers, and underscores";
        }

        if (!formData.phoneNumber.trim()) {
            errors.phoneNumber = "Phone number is required";
        } else if (formData.phoneNumber.length < 10) {
            errors.phoneNumber = "Please enter a valid phone number";
        }

        if (!selectedDate) {
            errors.dob = "Date of birth is required";
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleInputChange = (field: keyof ProfileFormData, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value,
        }));

        // Clear error when user starts typing
        if (formErrors[field]) {
            setFormErrors(prev => ({
                ...prev,
                [field]: undefined,
            }));
        }
    };

    const handleDateChange = (date: Date) => {
        setSelectedDate(date);
        setFormData(prev => ({
            ...prev,
            dob: date.toISOString().split("T")[0], // YYYY-MM-DD format
        }));

        // Clear error when date is selected
        if (formErrors.dob) {
            setFormErrors(prev => ({
                ...prev,
                dob: undefined,
            }));
        }
    };

    const handleAvatarPress = () => {
        Alert.alert("Change Profile Picture", "Choose an option", [
            {
                text: "Camera",
                onPress: () => handleImagePicker("camera"),
            },
            {
                text: "Gallery",
                onPress: () => handleImagePicker("gallery"),
            },
            {
                text: "Remove Photo",
                onPress: () => handleRemoveAvatar(),
                style: "destructive",
            },
            {
                text: "Cancel",
                style: "cancel",
            },
        ]);
    };

    const handleImagePicker = async (source: "camera" | "gallery") => {
        try {
            let result;

            if (source === "camera") {
                // Request camera permission
                const { status } =
                    await ImagePicker.requestCameraPermissionsAsync();
                if (status !== "granted") {
                    Alert.alert(
                        "Permission Denied",
                        "Camera access is required to take a photo.",
                    );
                    return;
                }

                result = await ImagePicker.launchCameraAsync({
                    mediaTypes: ImagePicker.MediaTypeOptions.Images,
                    allowsEditing: true,
                    aspect: [1, 1], // square
                    quality: 0.8,
                });
            } else {
                // Request gallery permission
                const { status } =
                    await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (status !== "granted") {
                    Alert.alert(
                        "Permission Denied",
                        "Gallery access is required to select a photo.",
                    );
                    return;
                }

                result = await ImagePicker.launchImageLibraryAsync({
                    mediaTypes: ImagePicker.MediaTypeOptions.Images,
                    allowsEditing: true,
                    aspect: [1, 1],
                    quality: 0.8,
                });
            }

            if (!result.canceled && result.assets && result.assets.length > 0) {
                const pickedImage = result.assets[0];

                // Determine file extension and MIME type
                const uriParts = pickedImage.uri.split(".");
                const fileExtension =
                    uriParts[uriParts.length - 1].toLowerCase();

                let mimeType = "image/jpeg";
                if (fileExtension === "png") mimeType = "image/png";
                else if (fileExtension === "jpg" || fileExtension === "jpeg")
                    mimeType = "image/jpeg";
                else if (fileExtension === "gif") mimeType = "image/gif";
                else if (fileExtension === "webp") mimeType = "image/webp";

                const fileName =
                    pickedImage.fileName ||
                    `profile_${
                        user?.firstName || "user"
                    }_${Date.now()}.${fileExtension}`;

                setSelectedImage({
                    name: fileName,
                    uri: pickedImage.uri,
                    type: mimeType,
                });
                setShowImageModal(true);

                // Optionally, save to media library (only if from camera)
                if (source === "camera") {
                    await MediaLibrary.requestPermissionsAsync();
                    await MediaLibrary.saveToLibraryAsync(pickedImage.uri);
                }
            }
        } catch (error) {
            console.error(error);
            Alert.alert(
                "Error",
                "Something went wrong while selecting the image.",
            );
        }
    };

    const handleImageConfirm = async () => {
        setIsUploadingImage(true);
        try {
            // Here you can call your updateProfilePicture API
            if (!selectedImage) {
                Alert.alert(
                    "Error",
                    "Please select an image before uploading.",
                );
                return;
            }
            const response = await AuthServices.updateProfilePicture(
                selectedImage,
            );

            if (!response.success) {
                Alert.alert(
                    "Error",
                    response.message ||
                        "Failed to update profile picture. Please try again.",
                );
                return;
            }
            setFormData(prev => ({
                ...prev,
                avatar: response.data?.avatar ?? "",
            }));
            dispatch(
                setUser({
                    ...user,
                    avatar: response.data?.avatar ?? "",
                } as User),
            );
            // For now, just update the local state
            handleInputChange("avatar", response.data?.avatar ?? "");
            setShowImageModal(false);
            setSelectedImage(undefined);

            // You can show a success message here if needed
        } catch (error) {
            console.error("Error uploading image:", error);
            Alert.alert(
                "Error",
                "Failed to update profile picture. Please try again.",
            );
        } finally {
            setIsUploadingImage(false);
        }
    };

    const handleImageCancel = () => {
        setShowImageModal(false);
        setSelectedImage(undefined);
    };

    const handleRemoveAvatar = () => {
        handleInputChange("avatar", "");
    };

    const handleSave = async () => {
        if (!validateForm()) {
            return;
        }

        setIsLoading(true);
        try {
            // API call would go here
            if (!params.isUserNameEditable) {
                delete formData.userName;
            }

            const response = await AuthServices.editUserProfile(formData);

            if (response.success && response.data && user) {
                dispatch(
                    setUser({
                        ...user,
                        firstName: response.data.user.firstName,
                        lastName: response.data.user.lastName,
                        middleName: response.data.user.middleName,
                        phoneNumber: response.data.user.phoneNumber,
                        dob: response.data.user.dob,
                        avatar: response.data.user.avatar,
                        profileCompleted:
                            response.data.user.profileCompleted ??
                            user.profileCompleted,
                    }),
                );
                Alert.alert("Success", "Profile updated successfully.", [
                    {
                        text: "OK",
                        onPress: () => {
                            if (params.backEnabled) navigation.goBack();
                        },
                    },
                ]);
            } else {
                Alert.alert(
                    "Error",
                    "Failed to update profile. Please try again.",
                );
            }
        } catch (error) {
            Alert.alert("Error", "Failed to update profile. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        Alert.alert(
            "Discard Changes",
            "Are you sure you want to discard your changes?",
            [
                {
                    text: "Keep Editing",
                    style: "cancel",
                },
                {
                    text: "Discard",
                    style: "destructive",
                    onPress: () => navigation.goBack(),
                },
            ],
        );
    };

    useEffect(() => {
        (async () => {
            const mediaStatus =
                await ImagePicker.requestMediaLibraryPermissionsAsync();
            setHasMediaLibraryPermission(mediaStatus.status === "granted");

            const cameraStatus =
                await ImagePicker.requestCameraPermissionsAsync();
            setHasCameraPermission(cameraStatus.status === "granted");

            // Check if video should be shown (only when backEnabled is false)
            if (params.backEnabled === false) {
                const videoViewed = await getProfileVideoViewed();
                if (!videoViewed) {
                    setShowVideoModal(true);
                }
            }
        })();
    }, [params.backEnabled]);

    const renderAvatar = () => {
        return (
            <View style={styles.avatarSection}>
                <TouchableOpacity
                    style={styles.avatarContainer}
                    onPress={handleAvatarPress}
                    activeOpacity={0.8}
                >
                    {formData.avatar ? (
                        <Image
                            source={{ uri: formData.avatar }}
                            style={styles.avatar}
                            resizeMode="cover"
                        />
                    ) : (
                        <View style={styles.avatarPlaceholder}>
                            <Typography style={styles.avatarPlaceholderText}>
                                {formData.firstName.charAt(0).toUpperCase()}
                                {formData.lastName.charAt(0).toUpperCase()}
                            </Typography>
                        </View>
                    )}
                    <View style={styles.editIconContainer}>
                        <Typography style={styles.editIcon}>✏️</Typography>
                    </View>
                </TouchableOpacity>
                <Body style={styles.avatarHint}>Tap to change photo</Body>
            </View>
        );
    };

    const handleCloseVideo = async () => {
        // Pause video before closing
        if (videoRef.current) {
            await videoRef.current.pauseAsync();
        }
        setShowVideoModal(false);
        await setProfileVideoViewed(true);
    };

    const renderVideoModal = () => {
        return (
            <RNModal
                visible={showVideoModal}
                animationType="fade"
                presentationStyle="fullScreen"
                onRequestClose={handleCloseVideo}
            >
                <View style={styles.videoContainer}>
                    <Video
                        ref={videoRef}
                        source={{
                            uri: "https://homekrew-storage.s3.ap-south-1.amazonaws.com/WhatsApp+Video+2025-11-29+at+16.51.00.mp4",
                        }}
                        style={styles.video}
                        useNativeControls
                        resizeMode={ResizeMode.COVER}
                        shouldPlay
                        onPlaybackStatusUpdate={(status: AVPlaybackStatus) => {
                            if (
                                status.isLoaded &&
                                status.didJustFinish &&
                                !status.isLooping
                            ) {
                                handleCloseVideo();
                            }
                        }}
                    />
                    <View style={styles.skipButtonContainer}>
                        <Button
                            title="Skip"
                            variant="outline"
                            onPress={handleCloseVideo}
                            style={styles.skipButton}
                            textStyle={styles.skipButtonText}
                        />
                    </View>
                </View>
            </RNModal>
        );
    };

    const renderImagePreviewModal = () => {
        return (
            <Modal
                visible={showImageModal}
                onClose={handleImageCancel}
                title="Update Profile Picture"
                message="Do you want to use this image as your profile picture?"
                type="info"
                showCloseButton={true}
                enableBackdropDismiss={true}
                primaryButton={{
                    title: "Use This Photo",
                    onPress: handleImageConfirm,
                    loading: isUploadingImage,
                }}
                secondaryButton={{
                    title: "Cancel",
                    onPress: handleImageCancel,
                }}
            >
                <View style={styles.modalContent}>
                    {selectedImage?.uri ? (
                        <>
                            <Image
                                source={{ uri: selectedImage.uri }}
                                style={styles.previewImage}
                                resizeMode="cover"
                            />
                            <Typography style={styles.previewText}>
                                Preview of your new profile picture
                            </Typography>
                            <View style={styles.buttonContainer}>
                                <Button
                                    title={"Cancel"}
                                    variant="outline"
                                    size="medium"
                                    onPress={handleImageCancel}
                                    style={styles.secondaryButton}
                                />

                                <Button
                                    title={"Looks Good"}
                                    variant="primary"
                                    size="medium"
                                    loading={isUploadingImage}
                                    onPress={handleImageConfirm}
                                    style={styles.primaryButton}
                                />
                            </View>
                        </>
                    ) : null}
                </View>
            </Modal>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                {params.backEnabled && (
                    <BackButton onPress={() => navigation.goBack()} />
                )}
                <H2 style={styles.title}>Edit Profile</H2>
                <Body style={styles.subtitle}>
                    Update your personal information
                </Body>
            </View>

            <KeyboardAvoidingView
                style={{ flex: 1, justifyContent: "space-between" }}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
                <ScrollView style={styles.formSection}>
                    {renderAvatar()}
                    <Input
                        label="First Name"
                        placeholder="Enter your first name"
                        value={formData.firstName}
                        onChangeText={value =>
                            handleInputChange("firstName", value)
                        }
                        error={formErrors.firstName}
                        required
                        autoCapitalize="words"
                        containerStyle={styles.inputContainer}
                    />

                    <Input
                        label="Middle Name"
                        placeholder="Enter your middle name (optional)"
                        value={formData.middleName}
                        onChangeText={value =>
                            handleInputChange("middleName", value)
                        }
                        autoCapitalize="words"
                        containerStyle={styles.inputContainer}
                    />

                    <Input
                        label="Last Name"
                        placeholder="Enter your last name"
                        value={formData.lastName}
                        onChangeText={value =>
                            handleInputChange("lastName", value)
                        }
                        error={formErrors.lastName}
                        required
                        autoCapitalize="words"
                        containerStyle={styles.inputContainer}
                    />

                    {params.isUserNameEditable && (
                        <Input
                            label="Username"
                            placeholder="Enter your username"
                            value={formData.userName}
                            onChangeText={value =>
                                handleInputChange("userName", value)
                            }
                            error={formErrors.userName}
                            required
                            autoCapitalize="none"
                            autoCorrect={false}
                            containerStyle={styles.inputContainer}
                        />
                    )}

                    <Input
                        label="Phone Number"
                        placeholder="Enter your phone number"
                        value={formData.phoneNumber}
                        disabled={true}
                        maxLength={10}
                        error={formErrors.phoneNumber}
                        required
                        keyboardType="phone-pad"
                        autoComplete="tel"
                        inputContainerStyle={{
                            backgroundColor: COLORS.GREY[100],
                            opacity: 0.5,
                        }}
                        containerStyle={[styles.inputContainer]}
                    />

                    <EmailInput
                        label="Email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChangeText={value =>
                            handleInputChange("email", value)
                        }
                        error={formErrors.email}
                        autoCapitalize="none"
                        autoCorrect={false}
                        containerStyle={styles.inputContainer}
                    />

                    <DatePicker
                        label="Date of Birth"
                        placeholder="Select your date of birth"
                        value={selectedDate}
                        onValueChange={handleDateChange}
                        error={formErrors.dob}
                        required
                        maxDate={new Date()} // Can't select future dates
                        minDate={new Date(1900, 0, 1)} // Reasonable minimum
                        containerStyle={styles.inputContainer}
                    />
                </ScrollView>

                <View style={styles.buttonSection}>
                    <OutlineButton
                        title="Cancel"
                        onPress={handleCancel}
                        style={styles.cancelButton}
                        disabled={isLoading}
                    />

                    <PrimaryButton
                        title={isLoading ? "Saving..." : "Save Changes"}
                        onPress={handleSave}
                        loading={isLoading}
                        style={styles.saveButton}
                    />
                </View>
            </KeyboardAvoidingView>

            {/* Video Modal */}
            {renderVideoModal()}

            {/* Image Preview Modal */}
            {renderImagePreviewModal()}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.WHITE,
    },
    scrollView: {
        flex: 1,
    },
    header: {
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 20,
        alignItems: "center",
    },
    title: {
        color: COLORS.TEXT.DARK,
        marginBottom: 8,
    },
    subtitle: {
        color: COLORS.TEXT.LIGHT,
        textAlign: "center",
    },
    avatarSection: {
        alignItems: "center",
        marginBottom: 32,
    },
    avatarContainer: {
        position: "relative",
        marginBottom: 8,
    },
    avatar: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: COLORS.GREY[100],
    },
    avatarPlaceholder: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: COLORS.primaryLight,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 2,
        borderColor: COLORS.primary,
    },
    avatarPlaceholderText: {
        fontSize: 36,
        fontWeight: WEIGHTS.BOLD,
        color: COLORS.primary,
    },
    editIconContainer: {
        position: "absolute",
        bottom: 0,
        right: 0,
        backgroundColor: COLORS.WHITE,
        borderRadius: 18,
        width: 36,
        height: 36,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 2,
        borderColor: COLORS.GREY[100],
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    editIcon: {
        fontSize: 16,
    },
    avatarHint: {
        color: COLORS.TEXT.LIGHT,
        fontSize: 14,
    },
    formSection: {
        paddingHorizontal: 20,
    },
    inputContainer: {
        marginBottom: 20,
    },
    buttonSection: {
        flexDirection: "row",
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 8,
        gap: 12,
    },
    cancelButton: {
        flex: 1,
    },
    saveButton: {
        flex: 1,
    },
    // Modal styles
    modalContent: {
        alignItems: "center",
        paddingVertical: 16,
    },
    previewImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
        marginBottom: 16,
        borderWidth: 2,
        borderColor: COLORS.GREY[200],
    },
    previewText: {
        textAlign: "center",
        color: COLORS.TEXT.LIGHT,
        fontSize: 14,
        marginTop: 8,
    },
    buttonContainer: {
        flexDirection: "row",
        marginTop: 16,
        gap: uiUtils.spacing.md,
        width: "100%",
    },
    primaryButton: {
        flex: 1,
    },
    secondaryButton: {
        flex: 1,
    },
    // Video modal styles
    videoContainer: {
        flex: 1,
        backgroundColor: "#000000",
    },
    video: {
        width: Dimensions.get("window").width,
        height: Dimensions.get("window").height,
    },
    skipButtonContainer: {
        position: "absolute",
        top: Platform.OS === "ios" ? 60 : 40,
        right: 20,
        zIndex: 1000,
    },
    skipButton: {
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        borderColor: COLORS.WHITE,
        borderWidth: 1.5,
        paddingHorizontal: 24,
        paddingVertical: 8,
        minHeight: 40,
    },
    skipButtonText: {
        color: COLORS.WHITE,
        fontSize: 14,
        fontWeight: WEIGHTS.SEMI_BOLD,
    },
});

export default EditProfileScreen;
