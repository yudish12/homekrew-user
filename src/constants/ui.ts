export const COLORS = {
    WHITE: "#FFFFFF",
    primary: "#1B75BB",
    //primary with 0.3 alpha
    primaryLight: "#1B75BB33",
    // Additional colors for splash screen
    primaryGlow: "#1B75BB66", // Primary with 40% opacity for glow
    primaryShadow: "#1B75BB22", // Primary with 13% opacity for subtle shadow
    TEXT: {
        LIGHT: "#B1B1B1",
        DARK: "#282828",
    },
    GREY: {
        100: "#00000033",
        200: "#B1B1B1",
        400: "#6B7280",
        500: "#6B7280",
        900: "#111827",
    },
    GREEN: {
        700: "#498A40",
    },
    RED: {
        500: "#EF4444",
    },
    GOLD: {
        400: "#F4D35E", // warm light gold
        500: "#E2B007", // rich gold
        600: "#D4AF37", // classic metallic gold
    },
    NAVY: {
        700: "#1D4E89", // dark blue (brighter)
        800: "#153E75", // dark blue
    },
    border: {
        light: "#E5E7EB",
        dark: "#111827",
    },
};

export const WEIGHTS = {
    THIN: "300" as const,
    REGULAR: "400" as const,
    MEDIUM: "500" as const,
    SEMI_BOLD: "600" as const,
    BOLD: "700" as const,
};

export const membershipGradientColors = [
    "#5DADE2", // lighter sky blue
    "#66CDAA", // medium aquamarine
    "#B2F2BB", // pastel mint / very light green
] as const;
