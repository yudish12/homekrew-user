import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    Image,
    Alert,
    Platform,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import { SafeAreaView } from '../../../components/SafeAreaView';
import { NavigationProp, useNavigation, useRoute } from '@react-navigation/native';
import { BackButton } from '../../../components/BackButton';
import { Typography, H2, Body } from '../../../components/Typography';
import { PrimaryButton, OutlineButton } from '../../../components/Button';
import { Input } from '../../../components/Input';
import { DatePicker } from '../../../components/DatePicker';
import { COLORS, WEIGHTS } from '../../../constants/ui';

interface ProfileFormData {
    firstName: string;
    lastName: string;
    middleName: string;
    userName: string;
    phoneNumber: string;
    dob: string;
    avatar: string;
}

interface EditProfileParams {
    backEnabled: boolean;
    initialData?: ProfileFormData;
}

const EditProfileScreen = () => {
    const params = useRoute().params as EditProfileParams;
    const navigation = useNavigation<NavigationProp<any>>();

    // Form state
    const [formData, setFormData] = useState<ProfileFormData>({
        firstName: '',
        lastName: '',
        middleName: '',
        userName: '',
        phoneNumber: '',
        dob: '',
        avatar: '',
    });

    const [formErrors, setFormErrors] = useState<Partial<ProfileFormData>>({});
    const [isLoading, setIsLoading] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date | undefined>();
    const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState<boolean | null>(null);
    const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);

    // Initialize form with existing data
    useEffect(() => {
        if (params.initialData) {
            setFormData(params.initialData);
            if (params.initialData.dob) {
                setSelectedDate(new Date(params.initialData.dob));
            }
        }
    }, [params.initialData]);

    // Validation functions
    const validateForm = (): boolean => {
        const errors: Partial<ProfileFormData> = {};

        // Required field validation
        if (!formData.firstName.trim()) {
            errors.firstName = 'First name is required';
        }

        if (!formData.lastName.trim()) {
            errors.lastName = 'Last name is required';
        }

        if (!formData.userName.trim()) {
            errors.userName = 'Username is required';
        } else if (formData.userName.length < 3) {
            errors.userName = 'Username must be at least 3 characters';
        } else if (!/^[a-zA-Z0-9_]+$/.test(formData.userName)) {
            errors.userName = 'Username can only contain letters, numbers, and underscores';
        }

        if (!formData.phoneNumber.trim()) {
            errors.phoneNumber = 'Phone number is required';
        } else if (!/^\+?[\d\s\-()]{10,}$/.test(formData.phoneNumber)) {
            errors.phoneNumber = 'Please enter a valid phone number';
        }

        if (!selectedDate) {
            errors.dob = 'Date of birth is required';
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
            dob: date.toISOString().split('T')[0], // YYYY-MM-DD format
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
        Alert.alert(
            'Change Profile Picture',
            'Choose an option',
            [
                {
                    text: 'Camera',
                    onPress: () => handleImagePicker('camera'),
                },
                {
                    text: 'Gallery',
                    onPress: () => handleImagePicker('gallery'),
                },
                {
                    text: 'Remove Photo',
                    onPress: () => handleRemoveAvatar(),
                    style: 'destructive',
                },
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
            ],
        );
    };

    const handleImagePicker = async (source: "camera" | "gallery") => {
        try {
            let result;
    
            if (source === "camera") {
                // Request camera permission
                const { status } = await ImagePicker.requestCameraPermissionsAsync();
                if (status !== "granted") {
                    Alert.alert("Permission Denied", "Camera access is required to take a photo.");
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
                const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (status !== "granted") {
                    Alert.alert("Permission Denied", "Gallery access is required to select a photo.");
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
                const pickedImage = result.assets[0].uri;
                handleInputChange("avatar", pickedImage);
    
                // Optionally, save to media library (only if from camera)
                if (source === "camera") {
                    await MediaLibrary.requestPermissionsAsync();
                    await MediaLibrary.saveToLibraryAsync(pickedImage);
                }
            }
        } catch (error) {
            console.error(error);
            Alert.alert("Error", "Something went wrong while selecting the image.");
        }
    };

    const handleRemoveAvatar = () => {
        handleInputChange('avatar', '');
    };

    const handleSave = async () => {
        if (!validateForm()) {
            return;
        }

        setIsLoading(true);
        try {
            // API call would go here
            console.log('Saving profile data:', formData);
            
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            Alert.alert(
                'Success',
                'Profile updated successfully!',
                [
                    {
                        text: 'OK',
                        onPress: () => navigation.goBack(),
                    },
                ],
            );
        } catch (error) {
            Alert.alert('Error', 'Failed to update profile. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        Alert.alert(
            'Discard Changes',
            'Are you sure you want to discard your changes?',
            [
                {
                    text: 'Keep Editing',
                    style: 'cancel',
                },
                {
                    text: 'Discard',
                    style: 'destructive',
                    onPress: () => navigation.goBack(),
                },
            ],
        );
    };

    useEffect(() => {
        (async () => {
            const mediaStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
            setHasMediaLibraryPermission(mediaStatus.status === "granted");
    
            const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
            setHasCameraPermission(cameraStatus.status === "granted");
        })();
    }, []);
    

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

    return (
        <SafeAreaView style={styles.container}>
            {params.backEnabled && (
                <BackButton onPress={() => navigation.goBack()} />
            )}
            
            <ScrollView 
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                <View style={styles.header}>
                    <H2 style={styles.title}>Edit Profile</H2>
                    <Body style={styles.subtitle}>
                        Update your personal information
                    </Body>
                </View>

                {renderAvatar()}

                <View style={styles.formSection}>
                    <Input
                        label="First Name"
                        placeholder="Enter your first name"
                        value={formData.firstName}
                        onChangeText={(value) => handleInputChange('firstName', value)}
                        error={formErrors.firstName}
                        required
                        autoCapitalize="words"
                        containerStyle={styles.inputContainer}
                    />

                    <Input
                        label="Middle Name"
                        placeholder="Enter your middle name (optional)"
                        value={formData.middleName}
                        onChangeText={(value) => handleInputChange('middleName', value)}
                        autoCapitalize="words"
                        containerStyle={styles.inputContainer}
                    />

                    <Input
                        label="Last Name"
                        placeholder="Enter your last name"
                        value={formData.lastName}
                        onChangeText={(value) => handleInputChange('lastName', value)}
                        error={formErrors.lastName}
                        required
                        autoCapitalize="words"
                        containerStyle={styles.inputContainer}
                    />

                    <Input
                        label="Username"
                        placeholder="Enter your username"
                        value={formData.userName}
                        onChangeText={(value) => handleInputChange('userName', value)}
                        error={formErrors.userName}
                        required
                        autoCapitalize="none"
                        autoCorrect={false}
                        containerStyle={styles.inputContainer}
                    />

                    <Input
                        label="Phone Number"
                        placeholder="Enter your phone number"
                        value={formData.phoneNumber}
                        onChangeText={(value) => handleInputChange('phoneNumber', value)}
                        error={formErrors.phoneNumber}
                        required
                        keyboardType="phone-pad"
                        autoComplete="tel"
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
                </View>

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

                {/* Bottom spacing for better scroll experience */}
                <View style={styles.bottomSpacing} />
            </ScrollView>
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
        alignItems: 'center',
    },
    title: {
        color: COLORS.TEXT.DARK,
        marginBottom: 8,
    },
    subtitle: {
        color: COLORS.TEXT.LIGHT,
        textAlign: 'center',
    },
    avatarSection: {
        alignItems: 'center',
        marginBottom: 32,
    },
    avatarContainer: {
        position: 'relative',
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
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: COLORS.primary,
    },
    avatarPlaceholderText: {
        fontSize: 36,
        fontWeight: WEIGHTS.BOLD,
        color: COLORS.primary,
    },
    editIconContainer: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: COLORS.WHITE,
        borderRadius: 18,
        width: 36,
        height: 36,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: COLORS.GREY[100],
        shadowColor: '#000',
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
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingTop: 20,
        gap: 12,
    },
    cancelButton: {
        flex: 1,
    },
    saveButton: {
        flex: 1,
    },
    bottomSpacing: {
        height: 40,
    },
});

export default EditProfileScreen;