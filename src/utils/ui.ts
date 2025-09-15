import { Platform, Dimensions } from "react-native";
import { COLORS } from "../constants/ui";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

// Screen dimensions utilities
export const screenUtils = {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    isSmallScreen: SCREEN_WIDTH < 375,
    isMediumScreen: SCREEN_WIDTH >= 375 && SCREEN_WIDTH < 414,
    isLargeScreen: SCREEN_WIDTH >= 414,
    isTablet: SCREEN_WIDTH >= 768,
    isLandscape: SCREEN_WIDTH > SCREEN_HEIGHT,
    isPortrait: SCREEN_HEIGHT > SCREEN_WIDTH,
};

// Platform utilities
export const platformUtils = {
    isIOS: Platform.OS === "ios",
    isAndroid: Platform.OS === "android",
    isWeb: Platform.OS === "web",
    select: Platform.select,
    version: Platform.Version,
};

// Color utilities
export const colorUtils = {
    // Add alpha to hex color
    addAlpha: (color: string, alpha: number): string => {
        const hex = color.replace("#", "");
        const r = parseInt(hex.substr(0, 2), 16);
        const g = parseInt(hex.substr(2, 2), 16);
        const b = parseInt(hex.substr(4, 2), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    },

    // Convert hex to RGB
    hexToRgb: (hex: string): { r: number; g: number; b: number } | null => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result
            ? {
                  r: parseInt(result[1], 16),
                  g: parseInt(result[2], 16),
                  b: parseInt(result[3], 16),
              }
            : null;
    },

    // Get contrast color (black or white) for given background
    getContrastColor: (backgroundColor: string): string => {
        const rgb = colorUtils.hexToRgb(backgroundColor);
        if (!rgb) return COLORS.TEXT.DARK;

        const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
        return brightness > 128 ? COLORS.TEXT.DARK : COLORS.WHITE;
    },

    // Generate color variations
    lighten: (color: string, amount: number): string => {
        const rgb = colorUtils.hexToRgb(color);
        if (!rgb) return color;

        const newR = Math.min(255, rgb.r + amount);
        const newG = Math.min(255, rgb.g + amount);
        const newB = Math.min(255, rgb.b + amount);

        return `#${newR.toString(16).padStart(2, "0")}${newG
            .toString(16)
            .padStart(2, "0")}${newB.toString(16).padStart(2, "0")}`;
    },

    darken: (color: string, amount: number): string => {
        const rgb = colorUtils.hexToRgb(color);
        if (!rgb) return color;

        const newR = Math.max(0, rgb.r - amount);
        const newG = Math.max(0, rgb.g - amount);
        const newB = Math.max(0, rgb.b - amount);

        return `#${newR.toString(16).padStart(2, "0")}${newG
            .toString(16)
            .padStart(2, "0")}${newB.toString(16).padStart(2, "0")}`;
    },
};

// Spacing utilities
export const spacingUtils = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
    xxxl: 64,

    // Get responsive spacing
    getResponsiveSpacing: (baseSpacing: number): number => {
        if (screenUtils.isSmallScreen) return baseSpacing * 0.8;
        if (screenUtils.isLargeScreen) return baseSpacing * 1.2;
        return baseSpacing;
    },

    // Get horizontal padding based on screen size
    getHorizontalPadding: (): number => {
        if (screenUtils.isSmallScreen) return 16;
        if (screenUtils.isMediumScreen) return 20;
        if (screenUtils.isLargeScreen) return 24;
        return 20;
    },
};

// Shadow utilities
export const shadowUtils = {
    // iOS shadow
    ios: {
        small: {
            shadowColor: COLORS.TEXT.DARK,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
        },
        medium: {
            shadowColor: COLORS.TEXT.DARK,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.15,
            shadowRadius: 8,
        },
        large: {
            shadowColor: COLORS.TEXT.DARK,
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.2,
            shadowRadius: 16,
        },
    },

    // Android elevation
    android: {
        small: { elevation: 2 },
        medium: { elevation: 4 },
        large: { elevation: 8 },
    },

    // Cross-platform shadow
    getShadow: (size: "small" | "medium" | "large") => {
        return platformUtils.isIOS
            ? shadowUtils.ios[size]
            : shadowUtils.android[size];
    },
};

// Border radius utilities
export const borderRadiusUtils = {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    full: 9999,

    // Get responsive border radius
    getResponsiveRadius: (baseRadius: number): number => {
        if (screenUtils.isSmallScreen) return baseRadius * 0.8;
        if (screenUtils.isLargeScreen) return baseRadius * 1.2;
        return baseRadius;
    },
};

// Modal configuration utilities
export type ModalType = "success" | "error" | "warning" | "info" | "custom";

export const modalUtils = {
    getIconConfig: (type: ModalType) => {
        switch (type) {
            case "success":
                return {
                    name: "checkmark-circle",
                    color: COLORS.GREEN[700],
                    backgroundColor: colorUtils.addAlpha(
                        COLORS.GREEN[700],
                        0.2,
                    ),
                };
            case "error":
                return {
                    name: "close-circle",
                    color: COLORS.RED[500],
                    backgroundColor: colorUtils.addAlpha(COLORS.RED[500], 0.2),
                };
            case "warning":
                return {
                    name: "warning",
                    color: "#F59E0B",
                    backgroundColor: colorUtils.addAlpha("#F59E0B", 0.2),
                };
            case "info":
                return {
                    name: "information-circle",
                    color: COLORS.primary,
                    backgroundColor: COLORS.primaryLight,
                };
            default:
                return {
                    name: "information-circle",
                    color: COLORS.primary,
                    backgroundColor: COLORS.primaryLight,
                };
        }
    },

    getModalSize: () => {
        if (screenUtils.isSmallScreen) return { maxWidth: SCREEN_WIDTH - 32 };
        if (screenUtils.isTablet) return { maxWidth: 500 };
        return { maxWidth: 400 };
    },
};

// Button configuration utilities
export const buttonUtils = {
    getSizeConfig: (size: "small" | "medium" | "large") => {
        const configs = {
            small: {
                paddingHorizontal: 16,
                paddingVertical: 8,
                minHeight: 36,
                fontSize: 14,
            },
            medium: {
                paddingHorizontal: 24,
                paddingVertical: 12,
                minHeight: 48,
                fontSize: 16,
            },
            large: {
                paddingHorizontal: 32,
                paddingVertical: 16,
                minHeight: 56,
                fontSize: 18,
            },
        };
        return configs[size];
    },

    getVariantConfig: (variant: "primary" | "outline" | "link") => {
        const configs = {
            primary: {
                backgroundColor: COLORS.primary,
                borderColor: COLORS.primary,
                textColor: COLORS.WHITE,
                borderWidth: 0,
            },
            outline: {
                backgroundColor: "transparent",
                borderColor: COLORS.TEXT.DARK,
                textColor: COLORS.TEXT.DARK,
                borderWidth: 1,
            },
            link: {
                backgroundColor: "transparent",
                borderColor: "transparent",
                textColor: COLORS.primary,
                borderWidth: 0,
            },
        };
        return configs[variant];
    },
};

// Input configuration utilities
export const inputUtils = {
    getInputHeight: (size: "small" | "medium" | "large") => {
        const heights = {
            small: 40,
            medium: 50,
            large: 60,
        };
        return heights[size];
    },

    getBorderRadius: (size: "small" | "medium" | "large") => {
        const radius = {
            small: borderRadiusUtils.sm,
            medium: borderRadiusUtils.md,
            large: borderRadiusUtils.lg,
        };
        return radius[size];
    },
};

// Typography utilities
export const typographyUtils = {
    getResponsiveFontSize: (baseSize: number): number => {
        if (screenUtils.isSmallScreen) return baseSize * 0.9;
        if (screenUtils.isLargeScreen) return baseSize * 1.1;
        return baseSize;
    },

    getLineHeight: (fontSize: number, multiplier: number = 1.5): number => {
        return fontSize * multiplier;
    },
};

// Animation utilities
export const animationUtils = {
    durations: {
        fast: 200,
        normal: 300,
        slow: 500,
    },

    easing: {
        easeIn: "ease-in",
        easeOut: "ease-out",
        easeInOut: "ease-in-out",
    },

    // Get animation duration based on screen size
    getResponsiveDuration: (baseDuration: number): number => {
        if (screenUtils.isSmallScreen) return baseDuration * 0.8;
        if (screenUtils.isLargeScreen) return baseDuration * 1.2;
        return baseDuration;
    },
};

// Layout utilities
export const layoutUtils = {
    // Get safe area padding
    getSafeAreaPadding: () => {
        return {
            top: platformUtils.isIOS ? 44 : 24,
            bottom: platformUtils.isIOS ? 34 : 24,
            horizontal: spacingUtils.getHorizontalPadding(),
        };
    },

    // Get header height
    getHeaderHeight: () => {
        return platformUtils.isIOS ? 88 : 64;
    },

    // Get tab bar height
    getTabBarHeight: () => {
        return platformUtils.isIOS ? 83 : 60;
    },

    // Calculate available height for content
    getContentHeight: (
        excludeHeader: boolean = true,
        excludeTabBar: boolean = false,
    ) => {
        let height = SCREEN_HEIGHT;

        if (excludeHeader) {
            height -= layoutUtils.getHeaderHeight();
        }

        if (excludeTabBar) {
            height -= layoutUtils.getTabBarHeight();
        }

        return height;
    },
};

// Validation utilities
export const validationUtils = {
    // Phone number validation
    isValidPhoneNumber: (phone: string): boolean => {
        const phoneRegex = /^[6-9]\d{9}$/;
        return phoneRegex.test(phone);
    },

    // Email validation
    isValidEmail: (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },

    // OTP validation
    isValidOTP: (otp: string, length: number = 6): boolean => {
        const otpRegex = new RegExp(`^\\d{${length}}$`);
        return otpRegex.test(otp);
    },

    // Password strength validation
    isStrongPassword: (password: string): boolean => {
        // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
        const passwordRegex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
        return passwordRegex.test(password);
    },
};

// Device utilities
export const deviceUtils = {
    // Check if device has notch
    hasNotch: (): boolean => {
        return platformUtils.isIOS && SCREEN_HEIGHT >= 812;
    },

    // Get device type
    getDeviceType: (): "phone" | "tablet" => {
        return screenUtils.isTablet ? "tablet" : "phone";
    },

    // Get orientation
    getOrientation: (): "portrait" | "landscape" => {
        return screenUtils.isPortrait ? "portrait" : "landscape";
    },
};

// Export all utilities as a single object for easy importing
export const uiUtils = {
    screen: screenUtils,
    platform: platformUtils,
    color: colorUtils,
    spacing: spacingUtils,
    shadow: shadowUtils,
    borderRadius: borderRadiusUtils,
    modal: modalUtils,
    button: buttonUtils,
    input: inputUtils,
    typography: typographyUtils,
    animation: animationUtils,
    layout: layoutUtils,
    validation: validationUtils,
    device: deviceUtils,
};

export default uiUtils;
