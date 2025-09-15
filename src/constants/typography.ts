import { fontFamily } from "../lib/fonts";
import { COLORS } from "./ui";

export const typography = {
    fonts: fontFamily,
    sizes: {
        xs: 12,
        sm: 14,
        base: 16,
        lg: 18,
        xl: 20,
        "2xl": 24,
        "3xl": 30,
        "4xl": 36,
        "5xl": 48,
        "6xl": 60,
    },
    lineHeights: {
        tight: 1.25,
        normal: 1.5,
        relaxed: 1.75,
    },
    weights: {
        light: "300",
        normal: "400",
        medium: "500",
        semibold: "600",
        bold: "700",
    },
};

export const textStyles = {
    h1: {
        fontFamily: fontFamily.bold,
        fontSize: typography.sizes["4xl"],
        lineHeight: typography.sizes["4xl"] * typography.lineHeights.tight,
    },
    h2: {
        fontFamily: fontFamily.bold,
        fontSize: typography.sizes["3xl"],
        lineHeight: typography.sizes["3xl"] * typography.lineHeights.tight,
    },
    h3: {
        fontFamily: fontFamily.semiBold,
        fontSize: typography.sizes["2xl"],
        lineHeight: typography.sizes["2xl"] * typography.lineHeights.tight,
    },
    h4: {
        fontFamily: fontFamily.semiBold,
        fontSize: typography.sizes.xl,
        lineHeight: typography.sizes.xl * typography.lineHeights.tight,
    },
    h5: {
        fontFamily: fontFamily.medium,
        fontSize: typography.sizes.lg,
        lineHeight: typography.sizes.lg * typography.lineHeights.normal,
    },
    h6: {
        fontFamily: fontFamily.medium,
        fontSize: typography.sizes.base,
        lineHeight: typography.sizes.base * typography.lineHeights.normal,
    },
    body: {
        fontFamily: fontFamily.regular,
        fontSize: typography.sizes.base,
        lineHeight: typography.sizes.base * typography.lineHeights.normal,
    },
    bodySmall: {
        fontFamily: fontFamily.regular,
        fontSize: typography.sizes.sm,
        lineHeight: typography.sizes.sm * typography.lineHeights.normal,
    },
    caption: {
        fontFamily: fontFamily.regular,
        fontSize: typography.sizes.xs,
        lineHeight: typography.sizes.xs * typography.lineHeights.normal,
    },
    button: {
        fontFamily: fontFamily.medium,
        fontSize: typography.sizes.base,
        lineHeight: typography.sizes.base * typography.lineHeights.normal,
    },
    thinHeading: {
        fontFamily: fontFamily.light,
        fontSize: typography.sizes["2xl"],
        lineHeight: typography.sizes["2xl"] * typography.lineHeights.tight,
    },
    muted: {
        color: COLORS.GREY[500],
        fontSize: typography.sizes.base,
        lineHeight: typography.sizes.base * typography.lineHeights.normal,
        fontFamily: fontFamily.regular,
    },
    error: {
        fontSize: typography.sizes.xs,
        color: COLORS.RED[500],
        marginTop: 4,
        marginLeft: 4,
        fontFamily: fontFamily.regular,
    },
};
