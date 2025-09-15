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
